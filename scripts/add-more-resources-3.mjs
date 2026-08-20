#!/usr/bin/env node
// scripts/add-more-resources-3.mjs
// One-off, 2026-08-20, third round. 14 more resources: CSS Generators
// (Clippy, Cubic Bezier, Haikei, Neumorphism.io), Design & UI (Land-book,
// Siteinspire), Free Fonts (Font Pair), JavaScript Libraries (Next.js,
// Vite, Zod), and a new "Hosting & Deployment" group (Vercel, Netlify,
// Cloudflare Pages, Railway) — matches doc category naming (there's a
// "Hosting & Deployment" lesson category already).
//
// Same real-browser-capture + Cloudinary crop:fill,gravity:auto pipeline
// as add-more-resources-2.mjs (D-104) — no 3rd-party screenshot service.
//
// One more logged-in-account catch this round: Vercel's page rendered the
// signed-in dashboard (real project/repo names — "wgh's projects",
// amartadey/Sitalabari-Next-JS-Project, etc.), same shape as D-102's
// Magnific catch. Used the same fix: fetched vercel.com's HTML same-origin
// with credentials:'omit' inside the page, read the public og:image URL
// (no query string this time, so directly downloadable), and used that
// instead of the live screenshot for that one entry.
//
// Usage: node scripts/add-more-resources-3.mjs [--dry-run]

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

const NEW_RESOURCES = [
  { group: 'CSS Generators', name: 'Clippy', url: 'https://bennettfeely.com/clippy/', file: 'screenshot-1787205361789-38.jpg' },
  { group: 'CSS Generators', name: 'Cubic Bezier', url: 'https://cubic-bezier.com/', file: 'screenshot-1787205385314-39.jpg' },
  { group: 'CSS Generators', name: 'Haikei', url: 'https://haikei.app/', file: 'screenshot-1787205411006-40.jpg' },
  { group: 'CSS Generators', name: 'Neumorphism.io', url: 'https://neumorphism.io/', file: 'screenshot-1787205436103-41.jpg' },
  { group: 'Design & UI', name: 'Land-book', url: 'https://land-book.com/', file: 'screenshot-1787205462415-42.jpg' },
  { group: 'Design & UI', name: 'Siteinspire', url: 'https://www.siteinspire.com/', file: 'screenshot-1787205490300-43.jpg' },
  { group: 'Free Fonts', name: 'Font Pair', url: 'https://fontpair.co/', file: 'screenshot-1787205519689-44.jpg' },
  { group: 'JavaScript Libraries', name: 'Next.js', url: 'https://nextjs.org/', file: 'screenshot-1787205543376-45.jpg' },
  { group: 'JavaScript Libraries', name: 'Vite', url: 'https://vite.dev/', file: 'screenshot-1787205571783-46.jpg' },
  { group: 'JavaScript Libraries', name: 'Zod', url: 'https://zod.dev/', file: 'screenshot-1787205600149-47.jpg' },
  { group: 'Hosting & Deployment', name: 'Vercel', url: 'https://vercel.com/', file: 'vercel-og.png' },
  { group: 'Hosting & Deployment', name: 'Netlify', url: 'https://www.netlify.com/', file: 'screenshot-1787205698759-49.jpg' },
  { group: 'Hosting & Deployment', name: 'Cloudflare Pages', url: 'https://pages.cloudflare.com/', file: 'screenshot-1787205726110-50.jpg' },
  { group: 'Hosting & Deployment', name: 'Railway', url: 'https://railway.com/', file: 'screenshot-1787205758376-51.jpg' },
]

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function main() {
  const env = await loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  configureCloudinary(env)

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
