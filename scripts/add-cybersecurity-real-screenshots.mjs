#!/usr/bin/env node
// Adds the 4 real-screenshot images (captured live via claude-in-chrome,
// 2026-09-03) to their matching cybersecurity lessons. Existing content is
// untouched; this only appends an image block. Same pipeline as
// scripts/add-basics-infographics.mjs.
//
// Source pages (all public, generic — no personal data, per the
// real-screenshot-lessons-privacy discipline):
//   - password-managers        — Bitwarden's real web vault login screen
//   - two-factor-authentication — Authy's real product page (live 2FA code UI)
//   - browser-privacy-settings  — Mozilla Support's real Firefox privacy/
//     security settings article (chrome://settings itself is blocked from
//     browser automation — this is the closest real, safe capture)
//   - checking-a-breach         — haveibeenpwned.com's real result screen,
//     using HIBP's own official public test account
//     (account-exists@hibp-integration-tests.com) — a real "pwned" result
//     with zero personal data
//
// The 11 ChatGPT-generated infographics are a separate follow-up script,
// added once the user hands them over — see .extra-images/cybersecurity/PROMPTS.md.
//
// Usage: node scripts/add-cybersecurity-real-screenshots.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import { nanoid } from 'nanoid'

const ROOT = path.resolve(import.meta.dirname, '..')
const IMG_DIR = path.join(ROOT, '.extra-images/cybersecurity/raw')
const DRY_RUN = process.argv.includes('--dry-run')

const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
cloudinary.config({ cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET })

function img(publicId, alt, width, height, caption) { return { id: nanoid(12), type: 'image', publicId, alt, caption, width, height } }
function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }

function cloudinaryUploadBuffer(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ public_id: publicId, resource_type: 'image', overwrite: true }, (err, res) => err ? reject(err) : resolve(res))
    stream.end(buffer)
  })
}

async function convertAndUpload(slug) {
  const inputPath = path.join(IMG_DIR, `${slug}.jpg`)
  const publicId = `docs/img/cybersecurity/${slug}`
  const buffer = await sharp(inputPath).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
  const { width, height } = await sharp(buffer).metadata()
  const result = await cloudinaryUploadBuffer(buffer, publicId)
  return { publicId, width, height, deliveryUrl: result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/') }
}

const targets = [
  { path: 'cybersecurity/password-managers', slug: 'password-manager-login',
    altEn: 'The real login screen of Bitwarden, a password manager, showing the email field and passkey / single sign-on options',
    altBn: 'একটা password manager, Bitwarden-এর আসল login screen, email field আর passkey / single sign-on option সহ',
    captionEn: 'A real password manager\'s login screen — the one password a person actually needs to remember.',
    captionBn: 'একটা আসল password manager-এর login screen — একজন মানুষের আসলে মনে রাখার দরকার হয় এমন একমাত্র password।' },
  { path: 'cybersecurity/two-factor-authentication', slug: 'two-factor-authentication',
    altEn: 'A real authenticator app (Authy) showing a live, time-limited six-digit two-factor authentication code counting down',
    altBn: 'একটা আসল authenticator app (Authy) একটা live, সময়-সীমিত ছয়-সংখ্যার two-factor authentication code দেখাচ্ছে, যেটা countdown করছে',
    captionEn: 'A live time-based code from an authenticator app — this is what the second factor in 2FA actually looks like.',
    captionBn: 'একটা authenticator app থেকে একটা live time-based code — 2FA-তে দ্বিতীয় factor আসলে দেখতে এমন।' },
  { path: 'cybersecurity/browser-privacy-settings', slug: 'browser-privacy-settings',
    altEn: 'A real Firefox support article explaining how to open the browser\'s Privacy and Security settings panel from the menu button',
    altBn: 'browser-এর menu button থেকে Privacy and Security settings panel কীভাবে খুলতে হয় তা ব্যাখ্যা করা একটা আসল Firefox support article',
    captionEn: 'Every major browser has a Privacy and Security settings panel a click away from the main menu.',
    captionBn: 'প্রতিটা major browser-এর একটা Privacy and Security settings panel main menu থেকে একটা click দূরে থাকে।' },
  { path: 'cybersecurity/checking-a-breach', slug: 'hibp-result',
    altEn: 'A real Have I Been Pwned result screen showing "Oh no — pwned!" with a breach timeline entry for Adobe, using HIBP\'s own official public test account',
    altBn: 'HIBP-এর নিজস্ব official public test account ব্যবহার করে "Oh no — pwned!" দেখানো একটা আসল Have I Been Pwned result screen, সাথে Adobe-এর একটা breach timeline entry',
    captionEn: 'A real Have I Been Pwned result — this is what a positive match looks like, shown here on HIBP\'s own safe public test account.',
    captionBn: 'একটা আসল Have I Been Pwned result — একটা positive match দেখতে এমন, এখানে HIBP-এর নিজস্ব safe public test account-এ দেখানো হয়েছে।' },
]

async function main() {
  for (const t of targets) {
    const { data: doc, error: docErr } = await supabase.from('docs').select('id,blocks').eq('path', t.path).single()
    if (docErr || !doc) { console.error(`✗ ${t.path} — not found:`, docErr?.message); continue }

    if (doc.blocks.some(b => b.type === 'image' && b.publicId === `docs/img/cybersecurity/${t.slug}`)) {
      console.log(`  = ${t.path} — already has this image, skipped`); continue
    }

    console.log(`  ↑ ${t.slug} — converting + uploading...`)
    const upload = DRY_RUN ? { publicId: `docs/img/cybersecurity/${t.slug}`, width: 0, height: 0 } : await convertAndUpload(t.slug)

    const enBlock = img(upload.publicId, t.altEn, upload.width, upload.height, t.captionEn)
    const enBlocks = [...doc.blocks, enBlock]

    const { data: tr, error: trErr } = await supabase.from('doc_translations').select('blocks').eq('doc_id', doc.id).eq('locale', 'bn').single()
    if (trErr || !tr) { console.error(`✗ ${t.path} (bn) — not found:`, trErr?.message); continue }
    const bnBlock = img(upload.publicId, t.altBn, upload.width, upload.height, t.captionBn)
    const bnBlocks = [...tr.blocks, bnBlock]

    if (DRY_RUN) { console.log(`  [en+bn] ${t.path} — would append ${upload.publicId} (${enBlocks.length} blocks total)`); continue }

    const { error: updDocErr } = await supabase.from('docs').update({ blocks: enBlocks, toc: toc(enBlocks) }).eq('id', doc.id)
    if (updDocErr) { console.error(`✗ ${t.path} (en update):`, updDocErr.message); continue }
    const { error: updTrErr } = await supabase.from('doc_translations').update({ blocks: bnBlocks, toc: toc(bnBlocks) }).eq('doc_id', doc.id).eq('locale', 'bn')
    if (updTrErr) { console.error(`✗ ${t.path} (bn update):`, updTrErr.message); continue }
    console.log(`  ✓ ${t.path} — appended ${upload.publicId} (${upload.width}x${upload.height})`)
  }
  console.log(DRY_RUN ? '\n[dry-run] no writes made.' : `\n✅ Done. ${targets.length} lessons processed.`)
}

main().catch(err => { console.error(err); process.exit(1) })
