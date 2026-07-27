#!/usr/bin/env node
// scripts/upload-resource-thumbnails.mjs
// Uploads the old Jekyll site's resource preview thumbnails
// (docs-master/docs-master/assets/img/preview-N.*) to Cloudinary, then
// sets resources.thumbnail_url and registers each upload in the `media`
// table so it shows up in the admin Media library too.
//
// Cloudinary, not R2 (docs/ASSETS.md, lib/storage.ts's pickBackend()):
// these are tiny preview images, nowhere near the 10MB R2 cutoff — R2 is
// plain object storage for oversized files, Cloudinary is where every
// other image on this site lives and gets f_auto/q_auto transformation.
//
// Idempotent — skips any resource that already has a thumbnail_url.
//
// Usage: node scripts/upload-resource-thumbnails.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

const DRY_RUN = process.argv.includes('--dry-run')
const YML_PATH = 'C:\\Users\\Raptor\\Downloads\\docs-master\\docs-master\\_data\\resources.yml'
const IMG_DIR = 'C:\\Users\\Raptor\\Downloads\\docs-master\\docs-master\\assets\\img'

async function loadEnv() {
  const text = await fs.readFile(new URL('../.env.local', import.meta.url), 'utf8')
  const env = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}

// Same corrections seed-resources.mjs already applied when it wrote these
// rows to the DB — thumbnails must key off the same (name, url) pairs
// that actually exist there, not the raw source file's. The last two are
// casing fixes ("Javascript" -> "JavaScript", "JQuery" -> "jQuery") made
// when the resource list was transcribed by hand; not source bugs like
// the first one, just a naming drift this matcher needs to know about.
function correctName(name, url) {
  if (name === 'Visit' && url === 'https://vectr.com/') return 'Vectr'
  if (name === 'W3Schools Javascript') return 'W3Schools JavaScript'
  if (name === 'W3Schools JQuery') return 'W3Schools jQuery'
  return name
}

// Line-based parser, not a YAML lib — the file's shape is one fixed
// 3-line pattern ("- name:" / "url:" / "thumbnail:") repeated under
// group headers, not worth a dependency for.
async function parseResourcesYml() {
  const text = await fs.readFile(YML_PATH, 'utf8')
  const lines = text.split('\n')
  const entries = []
  let current = null
  for (const line of lines) {
    const nameMatch = line.match(/^\s*-\s*name:\s*(.+)$/)
    const urlMatch = line.match(/^\s*url:\s*(.+)$/)
    const thumbMatch = line.match(/^\s*thumbnail:\s*"?([^"]+?)"?\s*$/)
    if (nameMatch) {
      if (current) entries.push(current)
      current = { name: nameMatch[1].trim(), url: null, thumbnail: null }
    } else if (urlMatch && current) {
      current.url = urlMatch[1].trim()
    } else if (thumbMatch && current) {
      current.thumbnail = thumbMatch[1].trim()
    }
  }
  if (current) entries.push(current)
  return entries
    .filter((e) => e.url && e.thumbnail)
    .map((e) => ({ ...e, name: correctName(e.name, e.url) }))
}

function configureCloudinary(env) {
  cloudinary.config({
    cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  })
}

function uploadToCloudinary(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, resource_type: 'image', overwrite: true },
      (err, result) => (err || !result ? reject(err) : resolve(result))
    )
    stream.end(buffer)
  })
}

async function main() {
  const env = await loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  configureCloudinary(env)

  const parsed = await parseResourcesYml()

  const { data: resources, error } = await supabase.from('resources').select('id, name, url, thumbnail_url')
  if (error) throw error
  const byKey = new Map(resources.map((r) => [`${r.name}::${r.url}`, r]))

  const report = { uploaded: [], skippedAlreadySet: [], skippedNoMatch: [], skippedMissingFile: [] }

  for (const entry of parsed) {
    const key = `${entry.name}::${entry.url}`
    const resource = byKey.get(key)
    if (!resource) {
      report.skippedNoMatch.push(key)
      continue
    }
    if (resource.thumbnail_url) {
      report.skippedAlreadySet.push(key)
      continue
    }

    const localPath = path.join(IMG_DIR, entry.thumbnail)
    let buffer
    try {
      buffer = await fs.readFile(localPath)
    } catch {
      report.skippedMissingFile.push(entry.thumbnail)
      continue
    }

    if (DRY_RUN) {
      report.uploaded.push(`${key} <- ${entry.thumbnail} (dry-run)`)
      continue
    }

    const publicId = `resources/${entry.thumbnail.replace(/\.[^.]+$/, '')}`
    const result = await uploadToCloudinary(buffer, publicId)

    const { error: updateError } = await supabase
      .from('resources')
      .update({ thumbnail_url: result.secure_url })
      .eq('id', resource.id)
    if (updateError) throw updateError

    // Register in media so it's visible/manageable from the admin Media
    // library too, same as every other Cloudinary asset on the site.
    const { error: mediaError } = await supabase.from('media').upsert(
      {
        backend: 'cloudinary',
        public_id: publicId,
        url: result.secure_url,
        kind: 'image',
        alt: entry.name,
        width: result.width ?? null,
        height: result.height ?? null,
        bytes: result.bytes ?? buffer.byteLength,
      },
      { onConflict: 'backend,public_id' }
    )
    if (mediaError) throw mediaError

    report.uploaded.push(key)
    console.log(`Uploaded: ${key}`)
  }

  console.log(`\nUploaded: ${report.uploaded.length}`)
  console.log(`Already had a thumbnail: ${report.skippedAlreadySet.length}`)
  console.log(`No matching resource row: ${report.skippedNoMatch.length}`)
  console.log(`Local file missing: ${report.skippedMissingFile.length}`)

  await fs.mkdir(new URL('./reports/', import.meta.url), { recursive: true })
  await fs.writeFile(
    new URL('./reports/upload-resource-thumbnails.json', import.meta.url),
    JSON.stringify(report, null, 2)
  )
  console.log('Full report written to scripts/reports/upload-resource-thumbnails.json')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
