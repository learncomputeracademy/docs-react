#!/usr/bin/env node
// scripts/add-more-resources-2.mjs
// One-off, 2026-08-20, second round. Two jobs:
//  1. Fix Ideogram/Leonardo AI (both showed Cloudflare's "Verifying..."
//     interstitial, not the real page — pikwy/site-shot's datacenter IPs
//     get bot-challenged) and Spline (site-shot's render hit a client-side
//     JS error, blank page) by re-capturing with claude-in-chrome's real
//     browser session instead, which isn't IP-flagged.
//  2. Add 13 more modern resources, screenshots from the same real-browser
//     session.
//
// Landscape source (claude-in-chrome's screenshot tool is a fixed
// 1568x717ish regardless of viewport size — confirmed, see D-103) cropped
// to the required 700x900 portrait via a Cloudinary incoming transform at
// upload time (crop:fill, gravity:auto — content-aware, picks the more
// visually interesting horizontal slice rather than a blind center-crop).
//
// Usage: node scripts/add-more-resources-2.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

const DRY_RUN = process.argv.includes('--dry-run')
const SCRIPT_DIR = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')))
const SHOTS_DIR = 'C:\\Users\\Raptor\\AppData\\Local\\Temp\\claude-chrome-screenshots-i2QFRe'

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
      { public_id: publicId, resource_type: 'image', overwrite: true, transformation: [{ width: 700, height: 900, crop: 'fill', gravity: 'auto' }] },
      (err, result) => (err || !result ? reject(err) : resolve(result))
    )
    stream.end(buffer)
  })
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

const FIXES = [
  { name: 'Ideogram', url: 'https://ideogram.ai/', file: 'screenshot-1787202522047-22.jpg', slug: 'ideogram' },
  { name: 'Leonardo AI', url: 'https://leonardo.ai/', file: 'screenshot-1787202543646-23.jpg', slug: 'leonardo-ai' },
  { name: 'Spline', url: 'https://spline.design/', file: 'screenshot-1787202568370-24.jpg', slug: 'spline' },
]

const NEW_RESOURCES = [
  { group: 'AI Tools', name: 'Midjourney', url: 'https://www.midjourney.com/', file: 'screenshot-1787202592380-25.jpg' },
  { group: 'AI Tools', name: 'v0', url: 'https://v0.app/', file: 'screenshot-1787202613993-26.jpg' },
  { group: 'AI Tools', name: 'Perplexity', url: 'https://www.perplexity.ai/', file: 'screenshot-1787202636878-27.jpg' },
  { group: 'Design & UI', name: 'Dribbble', url: 'https://dribbble.com/', file: 'screenshot-1787202667339-28.jpg' },
  { group: 'Design & UI', name: 'Behance', url: 'https://www.behance.net/', file: 'screenshot-1787202692056-29.jpg' },
  { group: 'Design & UI', name: 'Awwwards', url: 'https://www.awwwards.com/', file: 'screenshot-1787202717068-30.jpg' },
  { group: 'Free Icons', name: 'Heroicons', url: 'https://heroicons.com/', file: 'screenshot-1787202741467-31.jpg' },
  { group: 'Free Icons', name: 'Tabler Icons', url: 'https://tabler.io/icons', file: 'screenshot-1787202765541-32.jpg' },
  { group: 'Colors', name: 'Huemint', url: 'https://huemint.com/', file: 'screenshot-1787202798515-33.jpg' },
  { group: 'Colors', name: 'UI Colors', url: 'https://uicolors.app/', file: 'screenshot-1787202825255-34.jpg' },
  { group: 'JavaScript Libraries', name: 'Tailwind CSS', url: 'https://tailwindcss.com/', file: 'screenshot-1787202847679-35.jpg' },
  { group: 'JavaScript Libraries', name: 'Radix UI', url: 'https://www.radix-ui.com/', file: 'screenshot-1787202868897-36.jpg' },
  { group: 'JavaScript Libraries', name: 'TanStack', url: 'https://tanstack.com/', file: 'screenshot-1787202892274-37.jpg' },
]

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function main() {
  const env = await loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  configureCloudinary(env)

  for (const r of FIXES) {
    const localPath = path.join(SHOTS_DIR, r.file)
    let buffer
    try {
      buffer = await fs.readFile(localPath)
    } catch (e) {
      console.error(`Skipping fix for ${r.name}: can't read ${localPath}`, e.message)
      continue
    }
    if (DRY_RUN) {
      console.log(`Would fix: ${r.name} <- ${r.file}`)
      continue
    }
    const thumbnailUrl = await uploadAndRegister(supabase, buffer, `resources/${r.slug}`, r.name)
    const { error } = await supabase.from('resources').update({ thumbnail_url: thumbnailUrl }).eq('name', r.name).eq('url', r.url)
    if (error) console.error(`Update failed for ${r.name}:`, error.message)
    else console.log(`Fixed: ${r.name}`)
  }

  const { data: existing, error: existingError } = await supabase.from('resources').select('name, url')
  if (existingError) throw existingError
  const existingKeys = new Set((existing ?? []).map((r) => `${r.name}::${r.url}`))

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
