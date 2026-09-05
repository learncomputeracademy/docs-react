#!/usr/bin/env node
// Adds the first 6 of 11 ChatGPT-generated infographics (user-generated,
// 2026-09-03, per .extra-images/cybersecurity/PROMPTS.md) to their matching
// cybersecurity lessons. Existing content untouched; this only appends an
// image block. Source files supplied as 1.png-6.png, renamed here to match
// their target lesson slugs before running — read and visually confirmed
// each one against its prompt before renaming (all 6 matched their
// intended lesson exactly, in order).
//
// Same pipeline as scripts/add-basics-infographics.mjs /
// add-cybersecurity-real-screenshots.mjs: sharp WebP re-encode (strips
// AI/EXIF metadata as a side effect) -> Cloudinary at
// docs/img/cybersecurity/<slug>.
//
// 5 more infographics (mobile-device-security, wifi-and-vpns,
// backing-up-data, social-media-privacy, ransomware-identity-theft-response)
// are still pending from the user per PROMPTS.md — see
// cybersecurity-category-pending memory.
//
// Usage: node scripts/add-cybersecurity-infographics.mjs [--dry-run]

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
  { path: 'cybersecurity/why-cybersecurity-matters', slug: 'why-cybersecurity-matters',
    altEn: 'An infographic explaining why cybersecurity matters — your data has real value, attacks are automated not personal, and small mistakes have real cost, with who it affects and simple protective habits',
    altBn: 'একটা infographic যেখানে ব্যাখ্যা করা কেন cybersecurity গুরুত্বপূর্ণ — আপনার data-র আসল value আছে, attack automated, personal না, আর ছোট ভুলের আসল খরচ আছে, এটা কাকে প্রভাবিত করে আর সহজ প্রতিরক্ষামূলক habit সহ',
    captionEn: 'Small habits today prevent big problems tomorrow — the same idea this whole course builds on.',
    captionBn: 'আজকের ছোট habit আগামীকালের বড় সমস্যা প্রতিরোধ করে — এই পুরো কোর্স যে একই ধারণার উপর তৈরি।' },
  { path: 'cybersecurity/threat-landscape', slug: 'threat-landscape',
    altEn: 'An infographic comparing four types of attackers — cybercriminals, hacktivists, insiders, and state-sponsored groups — with their typical motives, targets, and methods',
    altBn: 'একটা infographic যেখানে চার ধরনের attacker তুলনা করা — cybercriminal, hacktivist, insider, আর state-sponsored group — তাদের সাধারণ motive, target, আর পদ্ধতি সহ',
    captionEn: 'Different attackers, different goals — most real threats come from cybercriminals seeking profit.',
    captionBn: 'ভিন্ন attacker, ভিন্ন লক্ষ্য — বেশিরভাগ আসল threat profit খোঁজা cybercriminal থেকে আসে।' },
  { path: 'cybersecurity/malware-deep-dive', slug: 'malware-deep-dive',
    altEn: 'An infographic covering how malware gets in, what it does once inside, signs of an infection, and the steps to contain an outbreak',
    altBn: 'একটা infographic যেখানে কভার করা হয়েছে malware কীভাবে ঢোকে, ভেতরে ঢোকার পর কী করে, একটা infection-এর লক্ষণ, আর একটা outbreak contain করার step',
    captionEn: 'Disconnect first, always — the single most useful and most often skipped step.',
    captionBn: 'সবসময় প্রথমে disconnect করুন — একক সবচেয়ে useful আর সবচেয়ে বেশি বাদ পড়া step।' },
  { path: 'cybersecurity/phishing-social-engineering', slug: 'phishing-social-engineering',
    altEn: 'An infographic covering the five common forms of phishing and social engineering — phishing, spear phishing, smishing, vishing, and pretexting — with shared warning signs',
    altBn: 'একটা infographic যেখানে phishing আর social engineering-এর পাঁচটা common রূপ কভার করা — phishing, spear phishing, smishing, vishing, আর pretexting — শেয়ার করা সতর্কতা চিহ্ন সহ',
    captionEn: 'No legitimate bank, company, or government office will ever ask for your password, a login code, or your card\'s CVV.',
    captionBn: 'কোনো বৈধ bank, company, বা government office কখনো আপনার password, একটা login code, বা আপনার card-এর CVV চাইবে না।' },
  { path: 'cybersecurity/safe-browsing', slug: 'safe-browsing',
    altEn: 'An infographic covering safe browsing — checking the padlock and HTTPS, checking the actual domain not just the name, spotting too-good-to-be-true offers, and hovering before clicking',
    altBn: 'একটা infographic যেখানে safe browsing কভার করা — padlock আর HTTPS check করা, শুধু নাম না আসল domain check করা, সত্যি হতে খুব ভালো offer চেনা, আর click করার আগে hover করা',
    captionEn: 'A fake website only needs to look real for a few seconds — a few quick checks are usually enough to catch it.',
    captionBn: 'একটা নকল website শুধু কয়েক সেকেন্ডের জন্য আসল দেখতে হয় — এটা ধরতে সাধারণত কয়েকটা দ্রুত check যথেষ্ট।' },
  { path: 'cybersecurity/email-security', slug: 'email-security',
    altEn: 'An infographic covering email security — checking the sender not just the display name, being cautious with attachments, checking where links actually go, and using spam filters',
    altBn: 'একটা infographic যেখানে email security কভার করা — শুধু display name না sender check করা, attachment নিয়ে সতর্ক থাকা, link আসলে কোথায় যায় check করা, আর spam filter ব্যবহার করা',
    captionEn: 'Control someone\'s email, and you can reset nearly any other account — protecting it matters more than it seems.',
    captionBn: 'কারো email নিয়ন্ত্রণ করুন, আর প্রায় যেকোনো অন্য account reset করা যায় — এটা রক্ষা করা যতটা মনে হয় তার চেয়ে বেশি গুরুত্বপূর্ণ।' },
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
