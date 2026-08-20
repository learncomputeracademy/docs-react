#!/usr/bin/env node
// scripts/add-modern-resources.mjs
// One-off, run 2026-08-20 alongside scripts/fix-resource-links.mjs and
// scripts/audit-resource-links.mjs. Uploads real screenshots (captured via
// live browser navigation this session — Magnific's is its public og:image
// instead, since the logged-in dashboard view isn't safe to publish, see
// commit message) to Cloudinary, then inserts new resources / refreshes
// thumbnails on the 3 genuinely-rebranded rows from fix-resource-links.mjs.
//
// Idempotent on the insert side (checks name+url like seed-resources.mjs);
// the 3 refresh updates are safe to re-run (just overwrite the same URL).
//
// Usage: node scripts/add-modern-resources.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

const DRY_RUN = process.argv.includes('--dry-run')
const SHOTS_DIR = 'C:\\Users\\Raptor\\AppData\\Local\\Temp\\claude-chrome-screenshots-i2QFRe'
const SCRIPT_DIR = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')))

async function loadEnv() {
  const text = await fs.readFile(new URL('../.env.local', import.meta.url), 'utf8')
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

// New resources — group_name matches the taxonomy already in `resources`
// (seed-resources.mjs), plus one new group ("AI Tools") for the AI
// image/video/3D generators that didn't exist as a category on the old
// Jekyll site at all.
const NEW_RESOURCES = [
  // AI Tools
  { group: 'AI Tools', name: 'Ideogram', url: 'https://ideogram.ai/', file: 'screenshot-1787198124614-3.jpg' },
  { group: 'AI Tools', name: 'Leonardo AI', url: 'https://leonardo.ai/', file: 'screenshot-1787198141937-4.jpg' },
  { group: 'AI Tools', name: 'Krea AI', url: 'https://www.krea.ai/', file: 'screenshot-1787198161036-5.jpg' },
  { group: 'AI Tools', name: 'Recraft', url: 'https://www.recraft.ai/', file: 'screenshot-1787198177565-6.jpg' },
  // Free Images
  { group: 'Free Images', name: 'Storyset', url: 'https://storyset.com/', file: 'screenshot-1787198196144-7.jpg' },
  { group: 'Free Images', name: 'Lummi', url: 'https://www.lummi.ai/', file: 'screenshot-1787198261591-9.jpg' },
  // Colors
  { group: 'Colors', name: 'Realtime Colors', url: 'https://www.realtimecolors.com/', file: 'screenshot-1787198278729-10.jpg' },
  // Free Icons
  { group: 'Free Icons', name: 'Phosphor Icons', url: 'https://phosphoricons.com/', file: 'screenshot-1787198294744-11.jpg' },
  { group: 'Free Icons', name: 'Lucide', url: 'https://lucide.dev/', file: 'screenshot-1787198312957-12.jpg' },
  // Free Fonts
  { group: 'Free Fonts', name: 'Fontshare', url: 'https://www.fontshare.com/', file: 'screenshot-1787198341094-14.jpg' },
  // Design & UI
  { group: 'Design & UI', name: 'Mobbin', url: 'https://mobbin.com/', file: 'screenshot-1787198370138-16.jpg' },
  { group: 'Design & UI', name: 'Framer', url: 'https://www.framer.com/', file: 'screenshot-1787198389694-17.jpg' },
  { group: 'Design & UI', name: 'Spline', url: 'https://spline.design/', file: 'screenshot-1787198409686-18.jpg' },
  // JavaScript Libraries
  { group: 'JavaScript Libraries', name: 'shadcn/ui', url: 'https://ui.shadcn.com/', file: 'screenshot-1787198429008-19.jpg' },
  { group: 'JavaScript Libraries', name: 'Motion', url: 'https://motion.dev/', file: 'screenshot-1787198448420-20.jpg' },
]

// Refresh thumbnails on the 3 rows fix-resource-links.mjs genuinely
// rebranded (Freepik/Iconfinder -> Magnific's two entry points, Landen ->
// Umso) — their old thumbnails are the wrong, pre-rebrand brand now.
// Magnific's own file was already downloaded from its public og:image
// (not a live screenshot — see commit message for why) to
// scripts/resource-thumbs/magnific.jpg by an earlier step this session.
const THUMBNAIL_REFRESH = [
  { name: 'Magnific', url: 'https://www.magnific.com/', localPath: 'resource-thumbs/magnific.jpg', slug: 'magnific' },
  { name: 'Magnific Icons', url: 'https://www.magnific.com/icons', localPath: 'resource-thumbs/magnific.jpg', slug: 'magnific-icons' },
  { name: 'Umso (formerly Landen)', url: 'https://www.umso.com/', localPath: null, file: 'screenshot-1787198102305-2.jpg', slug: 'umso' },
]

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function uploadAndRegister(supabase, buffer, publicId, alt) {
  const result = await uploadToCloudinary(buffer, publicId)
  const { error: mediaError } = await supabase.from('media').upsert(
    {
      backend: 'cloudinary',
      public_id: publicId,
      url: result.secure_url,
      kind: 'image',
      alt,
      width: result.width ?? null,
      height: result.height ?? null,
      bytes: result.bytes ?? buffer.byteLength,
    },
    { onConflict: 'backend,public_id' }
  )
  if (mediaError) throw mediaError
  return result.secure_url
}

async function main() {
  const env = await loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  configureCloudinary(env)

  const { data: existing, error: existingError } = await supabase.from('resources').select('name, url')
  if (existingError) throw existingError
  const existingKeys = new Set((existing ?? []).map((r) => `${r.name}::${r.url}`))

  // Refresh the 3 rebranded thumbnails first.
  for (const r of THUMBNAIL_REFRESH) {
    const localPath = r.localPath ? path.join(SCRIPT_DIR, r.localPath) : path.join(SHOTS_DIR, r.file)
    let buffer
    try {
      buffer = await fs.readFile(localPath)
    } catch (e) {
      console.error(`Skipping thumbnail refresh for ${r.name}: can't read ${localPath}`, e.message)
      continue
    }
    if (DRY_RUN) {
      console.log(`Would refresh thumbnail: ${r.name} <- ${r.localPath ?? r.file}`)
      continue
    }
    const url = await uploadAndRegister(supabase, buffer, `resources/${r.slug}`, r.name)
    const { error } = await supabase.from('resources').update({ thumbnail_url: url }).eq('name', r.name).eq('url', r.url)
    if (error) console.error(`Update failed for ${r.name}:`, error.message)
    else console.log(`Refreshed thumbnail: ${r.name}`)
  }

  // Insert new resources.
  const groupCounts = {}
  for (const r of NEW_RESOURCES) {
    const key = `${r.name}::${r.url}`
    if (existingKeys.has(key)) {
      console.log(`Skipped (already present): ${r.name}`)
      continue
    }
    if (!(r.group in groupCounts)) {
      const { count } = await supabase.from('resources').select('id', { count: 'exact', head: true }).eq('group_name', r.group)
      groupCounts[r.group] = count ?? 0
    }
    const sortOrder = ++groupCounts[r.group]

    if (DRY_RUN) {
      console.log(`Would insert: ${r.group} / ${r.name} (sort_order ${sortOrder})`)
      continue
    }

    const localPath = path.join(SHOTS_DIR, r.file)
    let buffer
    try {
      buffer = await fs.readFile(localPath)
    } catch (e) {
      console.error(`Skipping ${r.name}: can't read screenshot ${localPath}`, e.message)
      continue
    }
    const thumbnailUrl = await uploadAndRegister(supabase, buffer, `resources/${slugify(r.name)}`, r.name)

    const { error } = await supabase.from('resources').insert({
      group_name: r.group,
      name: r.name,
      url: r.url,
      thumbnail_url: thumbnailUrl,
      sort_order: sortOrder,
    })
    if (error) throw error
    console.log(`Inserted: ${r.group} / ${r.name}`)
  }

  console.log('\nDone.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
