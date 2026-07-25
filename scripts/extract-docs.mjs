#!/usr/bin/env node
// scripts/extract-docs.mjs
// Extracts content from the Jekyll _docs/ source into typed JSON blocks.
// By default this is a DRY-RUN: writes to scripts/reports/ only, no DB writes.
// Pass --write to upsert into Supabase (idempotent, keyed on docs.path).
//
// Usage:  node scripts/extract-docs.mjs
//         node scripts/extract-docs.mjs --verbose
//         node scripts/extract-docs.mjs --write
//
// Outputs:
//   scripts/reports/extract-report.json   — per-file classification + block summary
//   scripts/url-map.json                  — {old_path: new_path} for 3 consumers:
//                                           1) docs.path in Supabase
//                                           2) internal link rewriting (526 <a href>)
//                                           3) next.config redirects

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import * as cheerio from 'cheerio'
import { nanoid } from 'nanoid'
import { createClient } from '@supabase/supabase-js'

// ── Config ────────────────────────────────────────────────────────────────────

const VERBOSE = process.argv.includes('--verbose')
const WRITE   = process.argv.includes('--write')
const __dir   = path.dirname(fileURLToPath(import.meta.url))
const ROOT    = path.resolve(__dir, '..')
const DOCS_DIR = 'C:/Users/Raptor/Downloads/docs-master/docs-master/_docs'
const REPORTS  = path.join(ROOT, 'scripts/reports')

// ── .env.local loader (no dotenv dependency — plain Node script) ──────────────

async function loadEnv() {
  const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
  return Object.fromEntries(
    raw.split('\n')
      .filter(l => l.includes('=') && !l.trim().startsWith('#'))
      .map(l => {
        const i = l.indexOf('=')
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
      })
  )
}

// ── Demo files (confirmed in RESEARCH.md — contain <form>/<style>/interactive) ─

const DEMO_BASENAMES = new Set([
  'css-form', 'css-navbar', 'css-dropdowns', 'css-pseudo-classes',
  'css-pseudo-elements', 'css-inline-block', 'css-image-transparency',
  'css-icons', 'css-font',
  'html-forms', 'html-form-elements', 'html-form-input-types',
  'html-blocks', 'html-responsive', 'tag-video',
])

// Photoshop slugs that live under design/ in the Jekyll source
const PHOTOSHOP_SLUGS = new Set([
  'photoshop-intro', 'photoshop-toolbar', 'photoshop-layers',
  'photoshop-selection-tools', 'photoshop-drawing-selection-tools',
  'photoshop-alteration-tools', 'photoshop-additional-tools',
  'photoshop-color-boxes', 'photoshop-resizing', 'photoshop-saving',
  'photoshop-shortcut-keys', 'photoshop-syllabus',
])

// ── URL mapping (R1-R7 from docs/URLS.md) ─────────────────────────────────────

function deriveNewPath(category, fileBasename) {
  // Category: basic → basics, one-page special case
  if (category === 'basic') {
    if (fileBasename === 'basic-computer')
      return { category: 'basics', slug: 'computer-fundamentals', redirect: null }
    return { category: 'basics', slug: fileBasename.replace(/^basic-/, ''), redirect: null }
  }

  // Category: design → design | photoshop split (D-12a)
  if (category === 'design') {
    if (fileBasename === 'graphics-design-posters') {
      // Duplicate page — 301 to poster, no row created
      return { category: 'design', slug: null, redirect: 'design/poster' }
    }
    if (PHOTOSHOP_SLUGS.has(fileBasename)) {
      return { category: 'photoshop', slug: fileBasename.replace(/^photoshop-/, ''), redirect: null }
    }
    if (fileBasename === 'image') {
      return { category: 'design', slug: 'image-basics', redirect: null }
    }
    // Strip graphics-design- stutter; others (color-theory, typography…) pass through
    const slug = fileBasename.replace(/^graphics-design-/, '')
    return { category: 'design', slug, redirect: null }
  }

  // All other categories: R1 — strip {category}- or js- prefix
  // R6 — don't strip prefixes that add meaning (tag-, link-, etc.)
  let slug = fileBasename
  const stripPrefixes = [`${category}-`, 'js-']
  for (const p of stripPrefixes) {
    if (slug.startsWith(p)) { slug = slug.slice(p.length); break }
  }
  return { category, slug, redirect: null }
}

// ── Code language detection ───────────────────────────────────────────────────

function detectLanguage(classAttr = '') {
  const m = classAttr.match(/language-(\S+)|lang-(\S+)/i)
  if (m) {
    const raw = (m[1] || m[2]).toLowerCase().replace(/^\./, '')
    return raw === 'js' ? 'javascript' : raw
  }
  // Fallback: look for common class names
  if (/\bhtml\b/i.test(classAttr)) return 'html'
  if (/\bcss\b/i.test(classAttr)) return 'css'
  if (/\bjavascript\b|\bjs\b/i.test(classAttr)) return 'javascript'
  return 'text'
}

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
}

// ── Block extraction ──────────────────────────────────────────────────────────

function extractBlocks($, $root) {
  const blocks = []
  let richtextBuf = []
  const warnings = []
  const usedAnchors = new Map() // dedup within this doc — "Key Characteristics"
                                 // repeats across sections in several lessons;
                                 // colliding anchors break deep-links and React keys

  function uniqueAnchor(base) {
    const count = usedAnchors.get(base) ?? 0
    usedAnchors.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  }

  function flushRichtext() {
    const html = richtextBuf.join('\n').trim()
    if (html) blocks.push({ id: nanoid(12), type: 'richtext', html })
    richtextBuf = []
  }

  function processEl(el) {
    const tag = (el.type === 'tag' ? el.name : null)
    if (!tag) return

    // H1 → skip (title is in frontmatter)
    if (tag === 'h1') return

    // Headings H2-H6
    if (/^h[2-6]$/.test(tag)) {
      flushRichtext()
      const level = parseInt(tag[1])
      const text = $(el).text().trim()
      const anchor = uniqueAnchor($(el).attr('id') || slugify(text))
      blocks.push({ id: nanoid(12), type: 'heading', level, text, anchor })
      return
    }

    // Code blocks — <pre>, .code-view, .wp-block-code
    if (tag === 'pre') {
      flushRichtext()
      const $code = $(el).find('code').first()
      const codeText = $code.length ? $code.text() : $(el).text()
      const classAttr = ($code.attr('class') || '') + ' ' + ($(el).attr('class') || '')
      const language = detectLanguage(classAttr)
      blocks.push({ id: nanoid(12), type: 'code', language, code: codeText.trim() })
      return
    }

    // Tables — cells keep their inner HTML, not just .text(). Several design/
    // lessons use tables as download/resource lists (thumbnail + <a> per
    // cell); .text() silently discarded the links and images entirely.
    // Consistent with richtext/callout blocks: trusted first-party HTML.
    if (tag === 'table') {
      flushRichtext()
      const cellHtml = (i, td) => ($(td).html() || '').trim()
      const header = []
      $(el).find('thead th, thead td').each((i, th) => header.push(cellHtml(i, th)))
      const rows = []
      $(el).find('tbody tr').each((_, tr) => {
        const row = []
        $(tr).find('td, th').each((i, td) => row.push(cellHtml(i, td)))
        if (row.length) rows.push(row)
      })
      // If no explicit thead, try first tr as header
      if (!header.length) {
        const firstRow = $(el).find('tr').first()
        firstRow.find('th, td').each((i, td) => header.push(cellHtml(i, td)))
        // Remove the first row from rows
        rows.shift()
      }
      blocks.push({ id: nanoid(12), type: 'table', header, rows })
      return
    }

    // Images (Stage 4 will rewrite src to Cloudinary publicId)
    if (tag === 'img') {
      flushRichtext()
      const src = $(el).attr('src') || ''
      const alt = $(el).attr('alt') || ''
      const width  = parseInt($(el).attr('width')  || '0') || 800
      const height = parseInt($(el).attr('height') || '0') || 600
      if (!src) { warnings.push(`empty <img> src`); return }
      blocks.push({ id: nanoid(12), type: 'image', publicId: '', alt, width, height, _src: src })
      return
    }

    // Interactive elements → flag as tryit-candidate (Phase 2)
    if (['form', 'select', 'textarea', 'input'].includes(tag)) {
      warnings.push(`interactive <${tag}> — convert to tryit block in Phase 2`)
      richtextBuf.push($.html(el))
      return
    }

    // Inline style blocks → flag
    if (tag === 'style') {
      warnings.push(`inline <style> — review for tryit block in Phase 2`)
      return
    }

    // Drop: footer-btn, loader chrome
    if ($(el).hasClass('footer-btn')) return
    if ($(el).hasClass('loader'))     return

    // Unwrap: Bootstrap grid + classless wrappers
    const cls = ($(el).attr('class') || '').trim()
    const isGrid = tag === 'div' && /\b(row|container|col-|content-wrapper|page-content)\b/.test(cls)
    const isClassless = tag === 'div' && !cls

    if (isGrid || isClassless) {
      $(el).contents().each((_, child) => processEl(child))
      return
    }

    // Everything else → richtext buffer
    richtextBuf.push($.html(el))
  }

  $root.contents().each((_, child) => processEl(child))
  flushRichtext()

  return { blocks, warnings }
}

// ── File classification ───────────────────────────────────────────────────────

// Classify based on what's INSIDE .doc-content (not the outer Liquid chrome)
function classifyContent($, $content, basename) {
  if (DEMO_BASENAMES.has(basename)) return 'demo'
  const inner = $content.html() || ''
  const hasFooterBtn = inner.includes('footer-btn')
  const hasGridDiv   = /class=["'][^"']*\b(row|col-)\b/.test(inner)
  const hasClasslessDiv = $content.find('div:not([class]):not([id])').length > 0
  const hasH5H6     = $content.find('h5, h6').length > 0
  if (hasFooterBtn || hasGridDiv || hasClasslessDiv || hasH5H6) return 'mechanical'
  return 'clean'
}

// ── Walk _docs/ recursively ───────────────────────────────────────────────────

async function walkDocs() {
  const files = []
  async function scan(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) await scan(full)
      else if (entry.name.endsWith('.md')) files.push(full)
    }
  }
  await scan(DOCS_DIR)
  return files
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(REPORTS, { recursive: true })

  const files = await walkDocs()
  console.log(`Found ${files.length} .md files\n`)

  const report = {
    summary:  { total: 0, clean: 0, mechanical: 0, demo: 0, fail: 0, redirects: 0 },
    records:  [],
    urlMap:   {},        // old_path → new_path (excludes redirects)
    redirects: {},       // old_path → redirect_target
    ok:       [],
    warn:     [],
    fail:     [],
  }

  for (const file of files) {
    const rel      = path.relative(DOCS_DIR, file).replace(/\\/g, '/')
    const category = rel.split('/')[0]
    const basename = path.basename(file, '.md')

    let raw
    try { raw = await fs.readFile(file, 'utf8') }
    catch { report.fail.push({ file: rel, why: 'read error' }); report.summary.fail++; continue }

    // Parse frontmatter
    const { data: fm, content } = matter(raw)
    const oldPath   = (fm.permalink || `${category}/${basename}/`).replace(/^\/|\/$/g, '')
    const title     = (fm.title || basename).split('|')[0].trim()
    const metaTitle = fm.title || null

    // Derive new URL
    const { category: newCat, slug: newSlug, redirect } = deriveNewPath(category, basename)

    if (redirect) {
      report.redirects[oldPath] = redirect
      report.summary.redirects++
      report.records.push({
        file: rel, class: 'redirect', oldPath, title, redirect,
        note: `duplicate — 301 → ${redirect}`,
      })
      if (VERBOSE) console.log(`  REDIRECT  ${oldPath} → ${redirect}`)
      continue
    }

    const newPath = `${newCat}/${newSlug}`
    report.urlMap[oldPath] = newPath

    // Strip Liquid tags
    const noLiquid = content
      .replace(/\{%-?[\s\S]*?-?%\}/g, '')
      .replace(/\{\{[\s\S]*?\}\}/g, '')

    // Load into cheerio
    const $ = cheerio.load(noLiquid, { decodeEntities: false })
    const $content = $('.doc-content').first()

    if (!$content.length) {
      report.fail.push({ file: rel, why: 'no .doc-content' })
      report.summary.fail++
      console.error(`  FAIL  ${rel} — no .doc-content`)
      continue
    }

    // Classify (based on doc-content interior, not outer chrome)
    const fileClass = classifyContent($, $content, basename)

    // Extract blocks
    const { blocks, warnings } = extractBlocks($, $content)

    // Count block types
    const blockCounts = {}
    for (const b of blocks) blockCounts[b.type] = (blockCounts[b.type] || 0) + 1

    // TOC from heading blocks
    const toc = blocks
      .filter(b => b.type === 'heading')
      .map(b => ({ id: b.anchor, text: b.text, level: b.level }))

    const catCounters = (report.__catCounters ??= {})
    const sortOrder = (catCounters[newCat] = (catCounters[newCat] ?? 0) + 1)

    const record = {
      file:       rel,
      class:      fileClass,
      oldPath,
      newPath,
      category:   newCat,
      slug:       newSlug,
      title,
      metaTitle,
      sortOrder,
      blockCount: blocks.length,
      blockTypes: blockCounts,
      blocks,
      toc,
      warnings,
    }

    if (VERBOSE) {
      console.log(`  [${fileClass.toUpperCase().padEnd(10)}] ${oldPath} → ${newPath}  (${blocks.length} blocks)`)
      if (warnings.length) warnings.forEach(w => console.log(`    ⚠ ${w}`))
    }

    report.records.push(record)
    report.summary.total++
    report.summary[fileClass]++

    if (warnings.length) report.warn.push({ file: rel, warnings })
    else report.ok.push(rel)
  }

  // Sort url-map by old_path for readability
  report.urlMap = Object.fromEntries(
    Object.entries(report.urlMap).sort(([a], [b]) => a.localeCompare(b))
  )
  delete report.__catCounters

  // Write outputs
  const reportPath  = path.join(REPORTS, 'extract-report.json')
  const urlMapPath  = path.join(ROOT, 'scripts/url-map.json')

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
  await fs.writeFile(urlMapPath, JSON.stringify(report.urlMap, null, 2))

  // ── --write: upsert into Supabase ─────────────────────────────────────────
  if (WRITE) {
    if (report.summary.fail > 0) {
      console.error('\nRefusing to write: fail list is non-empty. Fix extraction first.')
      process.exit(1)
    }

    const env = await loadEnv()
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

    const { data: categories, error: catErr } = await supabase.from('categories').select('id, slug')
    if (catErr) { console.error('Failed to load categories:', catErr.message); process.exit(1) }
    const catIdBySlug = Object.fromEntries(categories.map(c => [c.slug, c.id]))

    const docRows = report.records
      .filter(r => r.class !== 'redirect')
      .map(r => {
        const categoryId = catIdBySlug[r.category]
        if (!categoryId) throw new Error(`Unknown category slug: ${r.category} (file: ${r.file})`)
        return {
          category_id:      categoryId,
          slug:             r.slug,
          path:             r.newPath,
          old_path:         r.oldPath,
          title:            r.title,
          meta_title:       r.metaTitle,
          meta_description: null,
          blocks:           r.blocks,
          toc:              r.toc,
          status:           'published',
          sort_order:       r.sortOrder,
          published_at:     new Date().toISOString(),
        }
      })

    console.log(`\nWriting ${docRows.length} docs to Supabase...`)

    // Batch upserts — Supabase/PostgREST has a payload size ceiling; 25 at a time is safe
    const BATCH = 25
    let written = 0
    for (let i = 0; i < docRows.length; i += BATCH) {
      const batch = docRows.slice(i, i + BATCH)
      const { error } = await supabase.from('docs').upsert(batch, { onConflict: 'path' })
      if (error) {
        console.error(`\nUpsert failed on batch starting at index ${i}:`, error.message)
        process.exit(1)
      }
      written += batch.length
      console.log(`  ${written}/${docRows.length}`)
    }

    console.log(`\n✅ Wrote ${written} docs.`)
  }

  // Print summary
  const s = report.summary
  console.log('\n─────────────────────────────────────────')
  console.log(`Files scanned:  ${files.length}`)
  console.log(`Docs emitted:   ${s.total}  (${files.length - s.total} skipped / redirects)`)
  console.log(`  clean:        ${s.clean}   (target ≈ 65)`)
  console.log(`  mechanical:   ${s.mechanical}  (target ≈ 52)`)
  console.log(`  demo:         ${s.demo}   (target = 15)`)
  console.log(`  fail:         ${s.fail}   (must be 0)`)
  console.log(`  redirects:    ${s.redirects}`)
  console.log(`Warnings:       ${report.warn.length}`)
  console.log(`─────────────────────────────────────────`)
  console.log(`\nReport:  ${reportPath}`)
  console.log(`URL map: ${urlMapPath}`)

  if (s.fail > 0) {
    console.error('\nFAILURES:')
    report.fail.forEach(f => console.error(`  ${f.file}: ${f.why}`))
    process.exit(1)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
