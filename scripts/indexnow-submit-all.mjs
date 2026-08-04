#!/usr/bin/env node
// One-time backfill: submits every URL already in the live sitemap to
// IndexNow. Not needed again after this — app/api/revalidate/route.ts
// pings IndexNow on every future publish/edit/delete automatically. This
// script exists only because that webhook has no history; it only fires
// going forward from whenever it was wired in.
//
// Reuses app/sitemap.ts's own output (fetched live) instead of re-deriving
// the page list from Supabase — one source of truth, and it can never
// submit a URL sitemap.xml itself wouldn't consider real.
//
// Usage: node scripts/indexnow-submit-all.mjs [--dry-run]

import fs from 'node:fs/promises'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))

const SITE_URL = (env.NEXT_PUBLIC_SITE_URL ?? 'https://docs.learncomputer.in').replace(/\/$/, '')
const KEY = env.INDEXNOW_KEY
const DRY_RUN = process.argv.includes('--dry-run')

if (!KEY) {
  console.error('INDEXNOW_KEY missing from .env.local.')
  process.exit(1)
}

const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`)
if (!sitemapRes.ok) {
  console.error(`Failed to fetch ${SITE_URL}/sitemap.xml — status ${sitemapRes.status}`)
  process.exit(1)
}
const xml = await sitemapRes.text()
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])

if (urls.length === 0) {
  console.error('No <loc> entries found in the sitemap — nothing to submit.')
  process.exit(1)
}

console.log(`${urls.length} URL(s) found in ${SITE_URL}/sitemap.xml`)

if (DRY_RUN) {
  urls.slice(0, 10).forEach(u => console.log(`  ${u}`))
  if (urls.length > 10) console.log(`  … and ${urls.length - 10} more`)
  console.log('\n[dry-run] no submission made.')
} else {
  // IndexNow allows up to 10,000 URLs per request — chunked defensively in
  // case the sitemap grows well past that someday.
  const CHUNK_SIZE = 10000
  const host = new URL(SITE_URL).host
  let submitted = 0

  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunk = urls.slice(i, i + CHUNK_SIZE)
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: KEY,
        keyLocation: `${SITE_URL}/${KEY}.txt`,
        urlList: chunk,
      }),
    })
    if (!res.ok) {
      console.error(`Chunk starting at ${i} failed — status ${res.status}: ${await res.text().catch(() => '')}`)
      continue
    }
    submitted += chunk.length
    console.log(`  ✓ submitted ${chunk.length} URL(s) (status ${res.status})`)
  }

  console.log(`\n✅ Done. ${submitted}/${urls.length} URL(s) submitted to IndexNow.`)
}

// ponytail: process.exit() called right after a fetch cuts off undici's
// socket cleanup mid-flight and crashes with a libuv assertion on Windows
// Node — falling through to natural exit instead sidesteps it.
