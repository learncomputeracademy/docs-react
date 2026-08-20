#!/usr/bin/env node
// scripts/resize-resource-thumbs-700x900.mjs
// One-off, 2026-08-20. User asked for exact 700x900px thumbnails on the 16
// resources added/refreshed in add-modern-resources.mjs (15 new + Umso).
// The first pass (that script) captured plain viewport screenshots
// (1568x717, whatever the tab happened to be) — this re-captures every one
// of those 16 at true 700x900 and re-uploads, replacing both the
// Cloudinary asset and the DB thumbnail_url (Cloudinary's returned
// secure_url is version-stamped, so overwriting the asset alone would NOT
// update what the old stored URL serves — the DB row has to point at the
// new URL too).
//
// Screenshots came from two free services after resize_window+screenshot
// was confirmed NOT to change this tool's screenshot output size at all
// (tested directly — see commit message): pikwy.com's web form (10 of the
// 16, until its free daily quota ran out mid-batch) and site-shot.com's
// public JSON screenshot endpoint (the rest — scripts/fetch-siteshot.mjs),
// both requested at width=700/height=900 explicitly. Local files already
// downloaded to scripts/resource-thumbs/ by hand before this script runs.
//
// Usage: node scripts/resize-resource-thumbs-700x900.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

const DRY_RUN = process.argv.includes('--dry-run')
const SCRIPT_DIR = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')))
const THUMBS_DIR = path.join(SCRIPT_DIR, 'resource-thumbs')

async function loadEnv() {
  const text = await fs.readFile(path.join(SCRIPT_DIR, '..', '.env.local'), 'utf8')
  const env = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) env[m[1]] = m[2]
  }
  return env
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

// name/url match the rows exactly as they exist today (post add-modern-
// resources.mjs / fix-resource-links.mjs); slug matches the public_id each
// already has, so this overwrites the same Cloudinary asset in place.
const ROWS = [
  { name: 'Ideogram', url: 'https://ideogram.ai/', file: 'ideogram.jpg', slug: 'ideogram' },
  { name: 'Leonardo AI', url: 'https://leonardo.ai/', file: 'leonardo-ai.jpg', slug: 'leonardo-ai' },
  { name: 'Krea AI', url: 'https://www.krea.ai/', file: 'krea-ai.jpg', slug: 'krea-ai' },
  { name: 'Recraft', url: 'https://www.recraft.ai/', file: 'recraft.png', slug: 'recraft' },
  { name: 'Storyset', url: 'https://storyset.com/', file: 'storyset.jpg', slug: 'storyset' },
  { name: 'Lummi', url: 'https://www.lummi.ai/', file: 'lummi.jpg', slug: 'lummi' },
  { name: 'Realtime Colors', url: 'https://www.realtimecolors.com/', file: 'realtime-colors.jpg', slug: 'realtime-colors' },
  { name: 'Phosphor Icons', url: 'https://phosphoricons.com/', file: 'phosphor-icons.jpg', slug: 'phosphor-icons' },
  { name: 'Lucide', url: 'https://lucide.dev/', file: 'lucide.jpg', slug: 'lucide' },
  { name: 'Fontshare', url: 'https://www.fontshare.com/', file: 'fontshare.jpg', slug: 'fontshare' },
  { name: 'Mobbin', url: 'https://mobbin.com/', file: 'mobbin.png', slug: 'mobbin' },
  { name: 'Framer', url: 'https://www.framer.com/', file: 'framer.png', slug: 'framer' },
  { name: 'Spline', url: 'https://spline.design/', file: 'spline.png', slug: 'spline' },
  { name: 'shadcn/ui', url: 'https://ui.shadcn.com/', file: 'shadcn-ui.png', slug: 'shadcn-ui' },
  { name: 'Motion', url: 'https://motion.dev/', file: 'motion.png', slug: 'motion' },
  { name: 'Umso (formerly Landen)', url: 'https://www.umso.com/', file: 'umso.png', slug: 'umso' },
]

async function main() {
  const env = await loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  configureCloudinary(env)

  for (const r of ROWS) {
    const localPath = path.join(THUMBS_DIR, r.file)
    let buffer
    try {
      buffer = await fs.readFile(localPath)
    } catch (e) {
      console.error(`Skipping ${r.name}: can't read ${localPath}`, e.message)
      continue
    }
    if (DRY_RUN) {
      console.log(`Would re-upload: ${r.name} <- ${r.file} (${buffer.length} bytes)`)
      continue
    }
    const result = await uploadToCloudinary(buffer, `resources/${r.slug}`)
    const { error: mediaError } = await supabase.from('media').upsert(
      {
        backend: 'cloudinary',
        public_id: `resources/${r.slug}`,
        url: result.secure_url,
        kind: 'image',
        alt: r.name,
        width: result.width ?? null,
        height: result.height ?? null,
        bytes: result.bytes ?? buffer.byteLength,
      },
      { onConflict: 'backend,public_id' }
    )
    if (mediaError) throw mediaError

    const { error } = await supabase.from('resources').update({ thumbnail_url: result.secure_url }).eq('name', r.name).eq('url', r.url)
    if (error) console.error(`Update failed for ${r.name}:`, error.message)
    else console.log(`Updated: ${r.name} -> ${result.width}x${result.height}`)
  }

  console.log('\nDone.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
