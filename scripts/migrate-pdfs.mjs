#!/usr/bin/env node
// scripts/migrate-pdfs.mjs
// Uploads all PDFs referenced by the 132 Jekyll lessons to Cloudinary (raw,
// <10MB) or R2 (>=10MB), then rewrites the matching <a href> links in the
// affected docs rows already in Supabase. Idempotent — safe to re-run.
//
// Usage: node scripts/migrate-pdfs.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v2 as cloudinary } from 'cloudinary'

const DRY_RUN = process.argv.includes('--dry-run')
const ROOT = path.resolve(import.meta.dirname, '..')
const DOCS_SOURCE = 'C:/Users/Raptor/Downloads/docs-master/docs-master'
const CLOUDINARY_SIZE_LIMIT = 10 * 1024 * 1024

async function loadEnv() {
  const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
  return Object.fromEntries(
    raw.split('\n')
      .filter(l => l.includes('=') && !l.trim().startsWith('#'))
      .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
  )
}

async function findAllPdfs() {
  const results = []
  async function scan(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) await scan(full)
      else if (entry.name.toLowerCase().endsWith('.pdf')) results.push(full)
    }
  }
  await scan(path.join(DOCS_SOURCE, 'assets'))
  return results
}

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

  const files = await findAllPdfs()
  console.log(`Found ${files.length} PDFs\n`)

  const pathMap = {} // old relative path (as it appears in <a href>) -> new URL

  for (const file of files) {
    const relFromAssets = path.relative(path.join(DOCS_SOURCE, 'assets'), file).replace(/\\/g, '/')
    const oldHrefPath = `assets/${relFromAssets}` // matches what's literally in the <a href> after Liquid-stripping
    const stat = await fs.stat(file)
    const sizeMB = (stat.size / 1024 / 1024).toFixed(1)
    const backend = stat.size >= CLOUDINARY_SIZE_LIMIT ? 'r2' : 'cloudinary'
    const key = `pdfs/${path.basename(file)}`

    console.log(`[${backend.toUpperCase().padEnd(10)}] ${relFromAssets}  (${sizeMB} MB)`)

    if (DRY_RUN) {
      pathMap[oldHrefPath] = `<${backend}:${key}>`
      continue
    }

    const buffer = await fs.readFile(file)

    if (backend === 'r2') {
      await r2.send(new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'application/pdf',
      }))
      pathMap[oldHrefPath] = `${env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`
    } else {
      const publicId = key.replace(/\.pdf$/, '')
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { public_id: publicId, resource_type: 'raw', overwrite: true },
          (err, res) => err ? reject(err) : resolve(res)
        )
        stream.end(buffer)
      })
      pathMap[oldHrefPath] = result.secure_url
    }
  }

  await fs.mkdir(path.join(ROOT, 'scripts/reports'), { recursive: true })
  await fs.writeFile(path.join(ROOT, 'scripts/pdf-map.json'), JSON.stringify(pathMap, null, 2))
  console.log(`\nWrote scripts/pdf-map.json (${Object.keys(pathMap).length} entries)`)

  if (DRY_RUN) {
    console.log('\n[dry-run] Skipping DB rewrite.')
    return
  }

  // ── Rewrite <a href> links in affected docs ────────────────────────────
  // Links live in two places: richtext.html, and table cells (header/rows) —
  // table cells keep raw HTML too (see extract-docs.mjs table handling).
  const { data: docs, error } = await supabase.from('docs').select('id, path, blocks')
  if (error) throw error

  let docsUpdated = 0
  let linksRewritten = 0

  function rewriteHtml(html) {
    let out = html
    let hit = false
    for (const [oldPath, newUrl] of Object.entries(pathMap)) {
      // Old hrefs look like: /../assets/img/graphics-design/pdfs/designer-guide-2.pdf
      // (the {{ site.baseurl }} Liquid tag was already stripped upstream, leaving `/../`)
      const pattern = new RegExp(
        `(href=["'])[^"']*${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(["'])`,
        'g'
      )
      if (pattern.test(out)) {
        out = out.replace(pattern, `$1${newUrl}$2`)
        hit = true
      }
    }
    return { html: out, hit }
  }

  for (const doc of docs) {
    let changed = false
    const newBlocks = doc.blocks.map(block => {
      if (block.type === 'richtext' || block.type === 'callout') {
        const { html, hit } = rewriteHtml(block.html)
        if (hit) { changed = true; linksRewritten++; return { ...block, html } }
        return block
      }
      if (block.type === 'table') {
        let tableChanged = false
        const rewriteCell = (cell) => {
          const { html, hit } = rewriteHtml(cell)
          if (hit) { tableChanged = true; linksRewritten++ }
          return html
        }
        const header = block.header.map(rewriteCell)
        const rows = block.rows.map(row => row.map(rewriteCell))
        if (tableChanged) { changed = true; return { ...block, header, rows } }
        return block
      }
      return block
    })

    if (changed) {
      const { error: updateErr } = await supabase.from('docs').update({ blocks: newBlocks }).eq('id', doc.id)
      if (updateErr) { console.error(`Failed to update ${doc.path}:`, updateErr.message); continue }
      console.log(`  Updated ${doc.path}`)
      docsUpdated++
    }
  }

  console.log(`\n✅ ${docsUpdated} docs updated, ${linksRewritten} links rewritten.`)
}

main().catch(err => { console.error(err); process.exit(1) })
