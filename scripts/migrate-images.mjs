#!/usr/bin/env node
// scripts/migrate-images.mjs
// Converts + uploads every referenced image (191 files) and rewrites every
// reference across all 131 docs. Idempotent (Cloudinary overwrite:true, R2
// PutObject overwrite-by-key) — safe to re-run.
//
// Rasters (jpg/png) -> WebP q80, max 1600px -> Cloudinary image/upload.
// GIFs (7 large ones matter; 3 tiny ones along for consistency) -> MP4 via
// ffmpeg -> Cloudinary video/upload -> block type becomes `loop` (D-15),
// inline <img> becomes <video autoplay muted loop playsinline>.
//
// Usage: node scripts/migrate-images.mjs [--dry-run] [--relink-only]
// --relink-only skips conversion/upload entirely and re-runs just the DB
// rewrite pass against the existing scripts/image-map.json — for patching
// the rewrite logic without re-uploading 191 already-live files.

import fs from 'node:fs/promises'
import fssync from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import sharp from 'sharp'
import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v2 as cloudinary } from 'cloudinary'

const run = promisify(execFile)
const DRY_RUN = process.argv.includes('--dry-run')
const RELINK_ONLY = process.argv.includes('--relink-only')
const ROOT = path.resolve(import.meta.dirname, '..')
const DOCS_SOURCE = 'C:/Users/Raptor/Downloads/docs-master/docs-master'
const CLOUDINARY_SIZE_LIMIT = 10 * 1024 * 1024
const FFMPEG = 'ffmpeg' // resolved via PATH
const TMP_DIR = path.join(os.tmpdir(), 'lca-image-migrate')

async function loadEnv() {
  const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
  return Object.fromEntries(
    raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#'))
      .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
  )
}

function normalize(p) {
  let prev
  let cur = p.replace(/\{\{[\s\S]*?\}\}/g, '')
  do { prev = cur; cur = cur.replace(/^(\.\.\/|\.\/|\/)/, '') } while (cur !== prev)
  return cur
}

// ── Conversion ───────────────────────────────────────────────────────────

async function convertRaster(inputPath) {
  const img = sharp(inputPath)
  const meta = await img.metadata()
  const buffer = await img
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()
  const outMeta = await sharp(buffer).metadata()
  return { buffer, width: outMeta.width, height: outMeta.height, contentType: 'image/webp' }
}

async function convertGif(inputPath) {
  const meta = await sharp(inputPath).metadata()
  await fs.mkdir(TMP_DIR, { recursive: true })
  const outPath = path.join(TMP_DIR, `${path.basename(inputPath, '.gif')}-${Date.now()}.mp4`)
  await run(FFMPEG, [
    '-y', '-i', inputPath,
    '-movflags', 'faststart',
    '-pix_fmt', 'yuv420p',
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-an',
    outPath,
  ])
  const buffer = await fs.readFile(outPath)
  await fs.unlink(outPath).catch(() => {})
  return { buffer, width: meta.width, height: meta.height, contentType: 'video/mp4' }
}

// ── Upload ───────────────────────────────────────────────────────────────

function cloudinaryUploadBuffer(buffer, publicId, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, resource_type: resourceType, overwrite: true },
      (err, res) => err ? reject(err) : resolve(res)
    )
    stream.end(buffer)
  })
}

// ── HTML surgery: rewrite <img> tags AND <a href> download links to images
// in richtext/table-cell HTML. Several design/ lessons pair a thumbnail
// <img> with a separate "Download full size" <a href download> pointing at
// the same asset — same two-link-per-resource pattern already seen with the
// PDF download tables. Both need rewriting, not just the <img>.

function rewriteImgTags($, root, imageMap) {
  let hit = false
  $(root).find('img').each((_, el) => {
    const $el = $(el)
    const src = $el.attr('src') || ''
    const key = normalize(src)
    const entry = imageMap[key]
    if (!entry) return // unmatched — e.g. teaching-example placeholder filenames, left untouched
    hit = true
    if (entry.kind === 'image') {
      $el.attr('src', entry.deliveryUrl)
      $el.removeAttr('width').removeAttr('height')
    } else {
      // GIF -> autoplay loop video. Preserve class (layout/styling), drop alt
      // (decorative), carry the alt text into aria-label instead.
      const cls = $el.attr('class') || ''
      const alt = $el.attr('alt') || ''
      const video = $(`<video autoplay muted loop playsinline${cls ? ` class="${cls}"` : ''}${alt ? ` aria-label="${alt}"` : ''}><source src="${entry.deliveryUrl}" type="video/mp4"></video>`)
      $el.replaceWith(video)
    }
  })
  $(root).find('a[href]').each((_, el) => {
    const $el = $(el)
    const href = $el.attr('href') || ''
    if (!/\.(png|jpe?g|gif|svg|webp)$/i.test(href)) return
    const key = normalize(href)
    const entry = imageMap[key]
    if (!entry) return
    hit = true
    // Full-size "download" link — point at the (already-converted) delivery
    // URL. If the source was a GIF, link the MP4; `download` attr, if any,
    // still forces a save rather than in-browser playback.
    $el.attr('href', entry.deliveryUrl)
  })
  // One-off pattern: <iframe src="...jpg"> used to get scroll/fixed-height
  // behavior on a very tall reference image (photoshop/shortcut-keys).
  $(root).find('iframe[src]').each((_, el) => {
    const $el = $(el)
    const src = $el.attr('src') || ''
    if (!/\.(png|jpe?g|gif|svg|webp)$/i.test(src)) return
    const key = normalize(src)
    const entry = imageMap[key]
    if (!entry || entry.kind !== 'image') return // no GIF-in-iframe cases exist; skip if it ever happens
    hit = true
    $el.attr('src', entry.deliveryUrl)
  })
  return hit
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const env = await loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  cloudinary.config({
    cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  })
  const r2 = new S3Client({
    region: 'auto',
    endpoint: env.R2_ENDPOINT,
    credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
  })

  let imageMap = {} // normalized old path -> { kind, publicId, deliveryUrl, width, height }

  if (RELINK_ONLY) {
    imageMap = JSON.parse(await fs.readFile(path.join(ROOT, 'scripts/image-map.json'), 'utf8'))
    console.log(`--relink-only: loaded ${Object.keys(imageMap).length} entries from scripts/image-map.json, skipping upload\n`)
  } else {

  const audit = JSON.parse(await fs.readFile(path.join(ROOT, 'scripts/reports/image-audit.json'), 'utf8'))
  const files = audit.referencedList
  console.log(`${files.length} referenced images to process\n`)

  let processed = 0

  for (const f of files) {
    const absPath = path.join(DOCS_SOURCE, f.path)
    const isGif = f.ext === '.gif'
    const relNoExt = f.path.replace(/^assets\//, '').replace(/\.[^.]+$/, '')
    const publicId = relNoExt // mirrors source tree, matches migrate-pdfs.mjs convention

    processed++
    process.stdout.write(`[${String(processed).padStart(3)}/${files.length}] ${isGif ? 'GIF ' : 'IMG '} ${f.path}  `)

    if (DRY_RUN) {
      imageMap[normalize(f.path)] = { kind: isGif ? 'loop' : 'image', publicId, deliveryUrl: `<pending:${publicId}>`, width: 0, height: 0 }
      console.log('(dry-run)')
      continue
    }

    try {
      if (isGif) {
        const { buffer, width, height } = await convertGif(absPath)
        if (buffer.byteLength >= CLOUDINARY_SIZE_LIMIT) {
          // Extremely unlikely after conversion, but route to R2 if it happens
          await r2.send(new PutObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: `video/${publicId}.mp4`, Body: buffer, ContentType: 'video/mp4' }))
          imageMap[normalize(f.path)] = { kind: 'loop', publicId, deliveryUrl: `${env.NEXT_PUBLIC_R2_PUBLIC_URL}/video/${publicId}.mp4`, width, height }
          console.log(`-> R2 (${(buffer.byteLength/1024/1024).toFixed(1)}MB, oversized after conversion)`)
        } else {
          const result = await cloudinaryUploadBuffer(buffer, publicId, 'video')
          imageMap[normalize(f.path)] = { kind: 'loop', publicId, deliveryUrl: result.secure_url, width, height }
          console.log(`-> Cloudinary (${(f.bytes/1024/1024).toFixed(1)}MB -> ${(buffer.byteLength/1024/1024).toFixed(2)}MB)`)
        }
      } else {
        const { buffer, width, height } = await convertRaster(absPath)
        const result = await cloudinaryUploadBuffer(buffer, publicId, 'image')
        const deliveryUrl = result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/')
        imageMap[normalize(f.path)] = { kind: 'image', publicId, deliveryUrl, width, height }
        console.log(`-> Cloudinary (${(f.bytes/1024).toFixed(0)}KB -> ${(buffer.byteLength/1024).toFixed(0)}KB)`)
      }
    } catch (err) {
      console.log(`FAILED: ${err.message}`)
    }
  }

  await fs.writeFile(path.join(ROOT, 'scripts/image-map.json'), JSON.stringify(imageMap, null, 2))
  console.log(`\nWrote scripts/image-map.json (${Object.keys(imageMap).length} entries)`)

  if (DRY_RUN) {
    console.log('\n[dry-run] Skipping DB rewrite.')
    return
  }

  } // end !RELINK_ONLY

  // ── Rewrite docs ─────────────────────────────────────────────────────
  const { data: docs, error } = await supabase.from('docs').select('id, path, blocks')
  if (error) throw error

  let docsUpdated = 0
  let blocksConvertedToLoop = 0
  let imgTagsRewritten = 0

  for (const doc of docs) {
    let changed = false
    const newBlocks = doc.blocks.map(block => {
      if (block.type === 'image') {
        const src = block._src
        if (!src) return block
        const entry = imageMap[normalize(src)]
        if (!entry) return block
        changed = true
        if (entry.kind === 'loop') {
          blocksConvertedToLoop++
          return { id: block.id, type: 'loop', publicId: entry.publicId, alt: block.alt, width: entry.width, height: entry.height }
        }
        return { ...block, publicId: entry.publicId, width: entry.width, height: entry.height, _src: undefined }
      }
      if (block.type === 'richtext' || block.type === 'callout') {
        const $ = cheerio.load(block.html, { decodeEntities: false })
        const hit = rewriteImgTags($, $.root(), imageMap)
        if (!hit) return block
        changed = true
        imgTagsRewritten++
        return { ...block, html: $('body').html() }
      }
      if (block.type === 'table') {
        let tableChanged = false
        const rewriteCell = (cellHtml) => {
          const $ = cheerio.load(cellHtml, { decodeEntities: false })
          const hit = rewriteImgTags($, $.root(), imageMap)
          if (hit) { tableChanged = true; imgTagsRewritten++ }
          return hit ? $('body').html() : cellHtml
        }
        const header = block.header.map(rewriteCell)
        const rows = block.rows.map(row => row.map(rewriteCell))
        if (!tableChanged) return block
        changed = true
        return { ...block, header, rows }
      }
      return block
    })

    if (changed) {
      // strip undefined _src cleanly (JSON.stringify drops it, but be explicit)
      const cleaned = newBlocks.map(b => {
        if (b.type === 'image' && '_src' in b) { const { _src, ...rest } = b; return rest }
        return b
      })
      const { error: updateErr } = await supabase.from('docs').update({ blocks: cleaned }).eq('id', doc.id)
      if (updateErr) { console.error(`Failed to update ${doc.path}:`, updateErr.message); continue }
      docsUpdated++
    }
  }

  console.log(`\n✅ ${docsUpdated} docs updated`)
  console.log(`   ${blocksConvertedToLoop} image blocks converted to loop`)
  console.log(`   ${imgTagsRewritten} inline <img> tags rewritten (richtext/table cells)`)
}

main().catch(err => { console.error(err); process.exit(1) })
