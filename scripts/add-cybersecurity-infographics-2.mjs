#!/usr/bin/env node
// Adds the remaining 5 of 11 ChatGPT-generated infographics (user-generated,
// 2026-09-04, per .extra-images/cybersecurity/PROMPTS.md #7-11) to their
// matching cybersecurity lessons. Existing content untouched; this only
// appends an image block. Source files supplied with ChatGPT timestamp
// names, renamed here to match their target lesson slugs before running —
// read and visually confirmed each one against its prompt before renaming
// (all 5 matched their intended lesson exactly, in timestamp order).
//
// Companion to scripts/add-cybersecurity-infographics.mjs (first 6). Same
// pipeline: sharp WebP re-encode (strips AI/EXIF metadata as a side effect)
// -> Cloudinary at docs/img/cybersecurity/<slug>.
//
// Usage: node scripts/add-cybersecurity-infographics-2.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import { nanoid } from 'nanoid'

const ROOT = path.resolve(import.meta.dirname, '..')
const IMG_DIR = path.join(ROOT, '.extra-images/cybersecurity')
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
  const inputPath = path.join(IMG_DIR, `${slug}.png`)
  const publicId = `docs/img/cybersecurity/${slug}`
  const buffer = await sharp(inputPath).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
  const { width, height } = await sharp(buffer).metadata()
  const result = await cloudinaryUploadBuffer(buffer, publicId)
  return { publicId, width, height, deliveryUrl: result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/') }
}

const targets = [
  { path: 'cybersecurity/mobile-device-security', slug: 'mobile-device-security',
    altEn: 'An infographic covering mobile device security — screen lock, app permissions, official app stores only, and Find My Device',
    altBn: 'একটা infographic যেখানে mobile device security কভার করা — screen lock, app permission, শুধু official app store, আর Find My Device',
    captionEn: 'Your phone holds more than you think — lock it, watch its permissions, and turn on remote-wipe before you need it.',
    captionBn: 'আপনার phone-এ যতটা মনে হয় তার চেয়ে বেশি থাকে — সেটা lock করুন, permission খেয়াল রাখুন, আর দরকার হওয়ার আগেই remote-wipe চালু করে রাখুন।' },
  { path: 'cybersecurity/wifi-and-vpns', slug: 'wifi-and-vpns',
    altEn: 'An infographic covering public Wi-Fi risk, home router basics, what a VPN actually does, and when you actually need one',
    altBn: 'একটা infographic যেখানে public Wi-Fi risk, home router basics, একটা VPN আসলে কী করে, আর কখন এটা আসলে দরকার কভার করা',
    captionEn: 'Not every network deserves the same trust — a VPN meaningfully helps on public Wi-Fi, not so much on your own secured home network.',
    captionBn: 'প্রতিটা network একই trust পাওয়ার যোগ্য না — public Wi-Fi-তে একটা VPN বাস্তবিক সাহায্য করে, নিজের secure home network-এ ততটা না।' },
  { path: 'cybersecurity/backing-up-data', slug: 'backing-up-data',
    altEn: 'An infographic covering the 3-2-1 backup rule — 3 copies, 2 different media, 1 off-site — and why untested backups are just an assumption',
    altBn: 'একটা infographic যেখানে 3-2-1 backup rule কভার করা — 3 copy, 2 ধরনের media, 1 off-site — আর কেন test না করা backup শুধু একটা ধারণা মাত্র',
    captionEn: 'A backup you have never restored is not proven — test it before you need it, not after.',
    captionBn: 'যে backup কখনো restore করে দেখেননি সেটা প্রমাণিত না — দরকার হওয়ার পর না, তার আগেই test করুন।' },
  { path: 'cybersecurity/social-media-privacy', slug: 'social-media-privacy',
    altEn: 'An infographic covering social media privacy settings, oversharing location, checking who can see a post, and thinking before you post',
    altBn: 'একটা infographic যেখানে social media privacy setting, location oversharing, কে post দেখতে পারে check করা, আর post করার আগে চিন্তা করা কভার করা',
    captionEn: 'Deleting a post does not mean it is gone — screenshots, caches, and archives can keep it alive long after you take it down.',
    captionBn: 'একটা post delete করা মানে এটা চলে গেছে তা না — screenshot, cache, আর archive এটাকে সরানোর পরও অনেক দিন বাঁচিয়ে রাখতে পারে।' },
  { path: 'cybersecurity/ransomware-identity-theft-response', slug: 'ransomware-identity-theft-response',
    altEn: 'An infographic covering step-by-step response to ransomware — disconnect, don\'t pay, report, restore from backup — and to identity theft — change passwords, alert your bank, monitor accounts, report to authorities',
    altBn: 'একটা infographic যেখানে ransomware-এর ধাপে ধাপে response কভার করা — disconnect, pay না করা, report করা, backup থেকে restore করা — আর identity theft-এর — password পরিবর্তন, bank-কে জানানো, account monitor করা, authority-কে report করা',
    captionEn: 'Act fast, but don\'t panic — a calm, ordered plan recovers more than a rushed one.',
    captionBn: 'দ্রুত কাজ করুন, কিন্তু panic করবেন না — একটা শান্ত, গোছানো plan তাড়াহুড়ো করা plan-এর চেয়ে বেশি recover করে।' },
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
