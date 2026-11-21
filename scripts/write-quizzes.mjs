#!/usr/bin/env node
// End-of-lesson quizzes, EN + BN, one data file per category (D-142).
//
//   node scripts/write-quizzes.mjs <category>               dry run: validate (+ --review=path)
//   node scripts/write-quizzes.mjs <category> --write       write quiz blocks to the DB
//   node scripts/write-quizzes.mjs <category> --live        refresh those pages on the live site
//
// Data: scripts/quizzes/<category>.mjs exports `lang` (code highlighting) and
// `QUIZZES` keyed by lesson slug. Idempotent: block id `quiz-<slug>`,
// question ids `<slug>-q<n>`, so a re-run replaces the quiz in place. The quiz
// is always the last block. Bengali rows get the same ids, answers and lang.
//
// Service-role writes skip the DB revalidate trigger (migration 011), so the
// live site only changes after --live (run it once the code is deployed; the
// data cache survives deploys, see CLAUDE.md). --write refreshes local dev
// (POST /api/revalidate with tag + path) if it is running.

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const category = process.argv[2]
if (!category || category.startsWith('--')) {
  console.error('Usage: node scripts/write-quizzes.mjs <category> [--write | --live] [--review=path]')
  process.exit(1)
}
const WRITE = process.argv.includes('--write')
const LIVE = process.argv.includes('--live')
const reviewPath = process.argv.find((a) => a.startsWith('--review='))?.slice(9)
const mod = await import(`./quizzes/${category}.mjs`)
const { lang } = mod
// Opt-in (export const shuffle = true): rotate each 4-option question's options
// by a fixed, slug-derived amount so the correct answer is spread across A-D.
// Deterministic, so re-runs give the same order; EN and BN move together.
const QUIZZES = mod.shuffle ? rotateAll(mod.QUIZZES) : mod.QUIZZES
function rotateAll(all) {
  const out = {}
  for (const [slug, qs] of Object.entries(all)) {
    out[slug] = qs.map((x, i) => {
      if (x.options.length !== 4) return x
      let h = 0
      for (const ch of `${slug}#${i}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0
      const k = h % 4
      const options = x.options.map((_, j) => x.options[(j - k + 4) % 4])
      return { ...x, options, answer: (x.answer + k) % 4 }
    })
  }
  return out
}
const LIVE_URL = 'https://docs.learncomputer.in'
const slugs = Object.keys(QUIZZES)

function build(slug, locale) {
  return {
    id: `quiz-${slug}`,
    type: 'quiz',
    lang,
    questions: QUIZZES[slug].map((x, i) => ({
      id: `${slug}-q${i + 1}`,
      prompt: locale === 'en' ? x.en : x.bn,
      options: x.options.map((o) => (Array.isArray(o) ? o[locale === 'en' ? 0 : 1] : o)),
      answer: x.answer,
      explain: locale === 'en' ? x.exEn : x.exBn,
    })),
  }
}

// Same rules as lib/admin/sanitize.ts + a few content checks.
function validate(slug) {
  const errs = []
  const qs = QUIZZES[slug]
  if (qs.length < 3) errs.push(`${slug}: fewer than 3 questions`)
  qs.forEach((x, i) => {
    const n = `${slug} q${i + 1}`
    if (x.options.length < 2) errs.push(`${n}: <2 options`)
    if (!Number.isInteger(x.answer) || x.answer < 0 || x.answer >= x.options.length) errs.push(`${n}: bad answer`)
    for (const s of [x.en, x.bn, x.exEn, x.exBn, ...x.options.flat()]) {
      if (!s || typeof s !== 'string') errs.push(`${n}: empty text`)
      else if (/<(?!\/?(code|pre|em|strong)>)/.test(s)) errs.push(`${n}: unescaped < in ${JSON.stringify(s.slice(0, 40))}`)
    }
  })
  return errs
}

function env() {
  return fs.readFile('.env.local', 'utf8').then((raw) =>
    Object.fromEntries(raw.split('\n').filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })),
  )
}

async function revalidate(base, secret, paths) {
  let ok = 0
  for (const path of paths) {
    for (const p of [`/${path}`, `/bn/${path}`]) {
      const res = await fetch(`${base}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': secret },
        body: JSON.stringify({ tag: `doc:${path}`, path: p }),
      }).catch((e) => ({ ok: false, statusText: e.message }))
      if (res.ok) ok++
      else if (base === LIVE_URL) console.error(`✗ ${p}: ${res.statusText}`)
    }
  }
  return ok
}

async function main() {
  const errors = slugs.flatMap(validate)
  if (errors.length) {
    console.error(errors.join('\n'))
    process.exit(1)
  }
  const counts = [0, 0, 0, 0, 0, 0]
  slugs.forEach((s) => QUIZZES[s].forEach((x) => counts[x.answer]++))
  console.log(`${category}: ${slugs.length} quizzes, ${slugs.reduce((n, s) => n + QUIZZES[s].length, 0)} questions, lang=${lang}. Answer spread A-D: ${counts.slice(0, 4).join(' / ')}`)

  if (reviewPath) {
    const strip = (h) => h.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '\n```\n$1\n```\n').replace(/<\/?code>/g, '`').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    let md = `# ${category} quizzes — review\n`
    for (const slug of slugs) {
      md += `\n## ${category}/${slug}\n`
      for (const locale of ['en', 'bn']) {
        md += `\n**${locale.toUpperCase()}**\n`
        build(slug, locale).questions.forEach((x, i) => {
          md += `\n${i + 1}. ${strip(x.prompt)}\n`
          x.options.forEach((o, j) => (md += `   - ${j === x.answer ? '✅' : '⬜'} ${strip(o)}\n`))
          md += `   - _${strip(x.explain)}_\n`
        })
      }
    }
    await fs.writeFile(reviewPath, md)
    console.log(`Review file: ${reviewPath}`)
  }

  const e = await env()
  if (LIVE) {
    const ok = await revalidate(LIVE_URL, e.REVALIDATE_SECRET, slugs.map((s) => `${category}/${s}`))
    console.log(`Live site: ${ok}/${slugs.length * 2} pages refreshed.`)
    return
  }
  if (!WRITE) {
    console.log('Dry run — nothing written. Re-run with --write to save to the database.')
    return
  }

  const supabase = createClient(e.NEXT_PUBLIC_SUPABASE_URL, e.SUPABASE_SERVICE_ROLE_KEY)
  const withQuiz = (blocks, quiz) => [...blocks.filter((b) => b.id !== quiz.id), quiz]
  const written = []
  const failed = []
  for (const slug of slugs) {
    const path = `${category}/${slug}`
    // One retry: a transient "fetch failed" hit one lesson in the HTML pilot.
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const { data: doc, error } = await supabase.from('docs').select('id, blocks').eq('path', path).single()
        if (error || !doc) throw new Error(error?.message ?? 'not found')
        const { error: upErr } = await supabase.from('docs').update({ blocks: withQuiz(doc.blocks, build(slug, 'en')) }).eq('id', doc.id)
        if (upErr) throw new Error(`en: ${upErr.message}`)
        const { data: tr } = await supabase.from('doc_translations').select('blocks').eq('doc_id', doc.id).eq('locale', 'bn').maybeSingle()
        if (tr) {
          const { error: trErr } = await supabase.from('doc_translations').update({ blocks: withQuiz(tr.blocks, build(slug, 'bn')) }).eq('doc_id', doc.id).eq('locale', 'bn')
          if (trErr) throw new Error(`bn: ${trErr.message}`)
        }
        console.log(`✓ ${path}${tr ? ' (en + bn)' : ' (en only — no bn translation)'}`)
        written.push(path)
        break
      } catch (err) {
        if (attempt === 2) { console.error(`✗ ${path}: ${err.message}`); failed.push(path) }
      }
    }
  }
  const local = await revalidate('http://localhost:3000', e.REVALIDATE_SECRET, written)
  console.log(`\nDone. ${written.length}/${slugs.length} lessons written${failed.length ? `, FAILED: ${failed.join(', ')}` : ''}. Local dev: ${local ? `${local} pages refreshed` : 'not running'}.`)
}

main().catch((err) => { console.error(err); process.exit(1) })
