#!/usr/bin/env node
// scripts/backfill-media.mjs
// Indexes every image/loop/file asset already referenced across all docs
// into the new `media` table (migration 003-admin.sql) — otherwise the
// admin media library (Stage 7 Phase 5) starts empty next to a full
// Cloudinary/R2 account with 209 real assets already live.
//
// Two sources, both needed — probed directly against the DB before writing
// this, not assumed:
//  1. Dedicated `image`/`loop`/`file` blocks — only ~15 of them. Real width/
//     height/alt come straight from the block (not scripts/image-map.json,
//     whose deliveryUrl/width/height fields are stale "<pending:...>"/0
//     placeholders from before the actual migration ran).
//  2. Full Cloudinary URLs embedded as raw <img>/<a> inside `richtext`/
//     `callout` HTML — the majority (58+ blocks contain them). Parsed with
//     cheerio, same tool extract-docs.mjs already uses, not regex — HTML
//     is not a regular language and this backfill only runs once.
//
// Usage: node scripts/backfill-media.mjs [--dry-run]

import fs from 'node:fs/promises'
import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'

const DRY_RUN = process.argv.includes('--dry-run')

async function loadEnv() {
  const text = await fs.readFile(new URL('../.env.local', import.meta.url), 'utf8')
  const env = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}

function cldUrl(cloud, publicId) {
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${publicId}`
}
function cldVideoUrl(cloud, publicId) {
  return `https://res.cloudinary.com/${cloud}/video/upload/${publicId}.mp4`
}

// https://res.cloudinary.com/<cloud>/<resource>/upload/<transform>/<version>/<publicId>.<ext>
// transform and version segments are both optional.
function publicIdFromCloudinaryUrl(url) {
  const m = url.match(/res\.cloudinary\.com\/[^/]+\/(image|video|raw)\/upload\/(.+?)(?:\.[a-zA-Z0-9]+)?(?:[?#].*)?$/)
  if (!m) return null
  const [, resourceType, rest] = m
  const parts = rest.split('/').filter(Boolean)
  while (parts.length && (/,/.test(parts[0]) || /^v\d+$/.test(parts[0]) || /^[a-z]_[a-zA-Z0-9.]+$/.test(parts[0]))) {
    parts.shift()
  }
  return { resourceType, publicId: parts.join('/') }
}

async function main() {
  const env = await loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  const cloud = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  const pdfMap = JSON.parse(await fs.readFile(new URL('./pdf-map.json', import.meta.url), 'utf8'))
  const pdfUrls = Object.values(pdfMap)

  const { data: docs, error } = await supabase.from('docs').select('blocks')
  if (error) throw error
  // Bengali translations can embed the same or different images inline —
  // 82 blocks there contain Cloudinary references, worth not missing.
  const { data: translations, error: trError } = await supabase.from('doc_translations').select('blocks')
  if (trError) throw trError

  const rows = new Map() // dedupe by `${backend}:${publicId}`

  function addRow(row) {
    const key = `${row.backend}:${row.public_id}`
    if (!rows.has(key)) rows.set(key, row)
  }

  for (const doc of [...docs, ...translations]) {
    for (const block of doc.blocks ?? []) {
      // 1. Dedicated block types
      if (block.type === 'image' || block.type === 'loop') {
        addRow({
          backend: 'cloudinary',
          public_id: block.publicId,
          url: block.type === 'loop' ? cldVideoUrl(cloud, block.publicId) : cldUrl(cloud, block.publicId),
          kind: block.type === 'loop' ? 'video' : 'image',
          alt: block.alt ?? null,
          width: block.width || null,
          height: block.height || null,
        })
      } else if (block.type === 'file') {
        const matchUrl = pdfUrls.find((u) => u.includes(block.publicId))
        const backend = matchUrl?.includes('r2.dev') ? 'r2' : 'cloudinary'
        addRow({
          backend,
          public_id: block.publicId,
          url: matchUrl ?? (backend === 'cloudinary' ? `https://res.cloudinary.com/${cloud}/raw/upload/${block.publicId}` : ''),
          kind: 'file',
          alt: block.label ?? null,
          width: null,
          height: null,
        })
      }

      // 2. Embedded <img>/<video>/<a> inside richtext or callout HTML
      if ((block.type === 'richtext' || block.type === 'callout') && block.html) {
        const $ = cheerio.load(block.html)
        $('img[src], video source[src], a[href]').each((_, el) => {
          const url = $(el).attr('src') || $(el).attr('href') || ''
          if (!url.includes('cloudinary.com')) return
          const parsed = publicIdFromCloudinaryUrl(url)
          if (!parsed) return
          const kind = parsed.resourceType === 'video' ? 'video' : parsed.resourceType === 'raw' ? 'file' : 'image'
          addRow({
            backend: 'cloudinary',
            public_id: parsed.publicId,
            url,
            kind,
            alt: $(el).attr('alt') || null,
            width: null,
            height: null,
          })
        })
      }
    }
  }

  const toInsert = [...rows.values()]
  console.log(`Found ${toInsert.length} unique media assets referenced across all docs.`)
  console.log(`  images: ${toInsert.filter((r) => r.kind === 'image').length}`)
  console.log(`  video: ${toInsert.filter((r) => r.kind === 'video').length}`)
  console.log(`  files: ${toInsert.filter((r) => r.kind === 'file').length}`)

  if (DRY_RUN) {
    console.log('\n--dry-run, not writing. Sample:')
    console.log(toInsert.slice(0, 5))
    return
  }

  const { error: insertError, count } = await supabase
    .from('media')
    .upsert(toInsert, { onConflict: 'backend,public_id', ignoreDuplicates: true, count: 'exact' })
  if (insertError) throw insertError
  console.log(`\nInserted (or already present): ${count ?? toInsert.length} rows.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
