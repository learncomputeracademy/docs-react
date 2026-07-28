#!/usr/bin/env node
// scripts/upload-logo.mjs
// Uploads the new LCA wordmark logos (light-mode/black-text and
// dark-mode/white-text variants, text already baked into the artwork) to
// Cloudinary under docs/img/site/ (docs/ASSETS.md's "logo, OG images,
// anything not lesson-specific" folder), overwriting the same public_id on
// every run so the delivery URL stays stable across re-uploads.
//
// Usage: node scripts/upload-logo.mjs

import fs from 'node:fs/promises'
import { v2 as cloudinary } from 'cloudinary'

const LIGHT_SRC = 'e:\\Computer Institute\\Logo\\00 NEw 21-12-2021\\PNG Icons\\Full\\16.png'
const DARK_SRC = 'e:\\Computer Institute\\Logo\\00 NEw 21-12-2021\\PNG Icons\\Full\\17.png'

async function loadEnv() {
  const text = await fs.readFile(new URL('../.env.local', import.meta.url), 'utf8')
  const env = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}

function uploadOne(buffer, publicId) {
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
  cloudinary.config({
    cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  })

  const targets = [
    { src: LIGHT_SRC, publicId: 'docs/img/site/logo-light', label: 'light-mode (black text)' },
    { src: DARK_SRC, publicId: 'docs/img/site/logo-dark', label: 'dark-mode (white text)' },
  ]

  for (const t of targets) {
    const buffer = await fs.readFile(t.src)
    const result = await uploadOne(buffer, t.publicId)
    console.log(`${t.label}: ${t.publicId} — ${result.width}x${result.height}, ${(result.bytes / 1024).toFixed(0)} KB`)
    console.log(`  ${result.secure_url}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
