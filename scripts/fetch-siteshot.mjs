#!/usr/bin/env node
// scripts/fetch-siteshot.mjs
// One-off helper used 2026-08-20 to fetch 700x900 screenshots from
// site-shot.com's public JSON endpoint directly (curl-equivalent), after
// pikwy.com's free daily quota ran out mid-batch. Not meant to be a
// permanent dependency — see commit message.
//
// Usage: node scripts/fetch-siteshot.mjs <name> <url>
// Writes scripts/resource-thumbs/<name>.png

import fs from 'node:fs/promises'
import path from 'node:path'

const [, , name, url] = process.argv
if (!name || !url) {
  console.error('Usage: node scripts/fetch-siteshot.mjs <name> <url>')
  process.exit(1)
}

const endpoint =
  `https://www.site-shot.com/screenshot/?width=700&height=900&zoom=100&scaled_width=700&full_size=` +
  `&format=PNG&user_agent=desktop_chrome&rnd=${Date.now()}&url=${encodeURIComponent(url)}` +
  `&g-recaptcha-response=&no_ads_no_cookie=1`

const res = await fetch(endpoint, {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
})
if (!res.ok) {
  console.error(`HTTP ${res.status} for ${url}`)
  process.exit(1)
}
const json = await res.json()
if (!json.image) {
  console.error('No image field in response:', JSON.stringify(json).slice(0, 300))
  process.exit(1)
}
const b64 = json.image.split(',')[1]
const buf = Buffer.from(b64, 'base64')
const outDir = path.join(path.dirname(decodeURIComponent(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))), 'resource-thumbs')
await fs.mkdir(outDir, { recursive: true })
const outPath = path.join(outDir, `${name}.png`)
await fs.writeFile(outPath, buf)
console.log(`Wrote ${outPath} (${buf.length} bytes)`)
