#!/usr/bin/env node
// Adds 14 hand-picked infographics (ChatGPT-generated, .extra-images/basic-
// computer/, renamed to their target slug) to the end of their matching
// "basics" chapter — user request 2026-09-02. Existing images in each
// chapter are untouched; this only appends.
//
// Pipeline mirrors migrate-images.mjs: sharp re-encode to WebP q80/max
// 1600px (this also strips all EXIF/AI-provenance metadata — sharp never
// copies source metadata unless .withMetadata() is called, so no separate
// "strip metadata" step is needed) -> Cloudinary image/upload at
// docs/img/basics/<slug>, matching docs/ASSETS.md's folder convention.
//
// Two "Output Devices" images existed for the one output-devices chapter;
// output-devices.png (the fuller version — plotter/VR/braille row) was
// picked per user choice. output-devices-unused-v1.png is left alone,
// not uploaded.
//
// Usage: node scripts/add-basics-infographics.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import { nanoid } from 'nanoid'

const ROOT = path.resolve(import.meta.dirname, '..')
const IMG_DIR = path.join(ROOT, '.extra-images/basic-computer')
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
  const publicId = `docs/img/basics/${slug}`
  const buffer = await sharp(inputPath).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
  const { width, height } = await sharp(buffer).metadata()
  const result = await cloudinaryUploadBuffer(buffer, publicId)
  return { publicId, width, height, deliveryUrl: result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/') }
}

const targets = [
  { path: 'basics/what-is-a-computer', slug: 'what-is-a-computer',
    altEn: 'An infographic showing the four basic computer operations — input, process, output, storage — with everyday examples like smartphones, ATMs, and washing machines',
    altBn: 'একটা infographic যেখানে কম্পিউটারের চারটি মূল operation দেখানো হয়েছে — input, process, output, storage — স্মার্টফোন, ATM, আর ওয়াশিং মেশিনের মতো দৈনন্দিন উদাহরণ সহ',
    captionEn: 'The four basic operations every computer performs, from typing on a keyboard to a video appearing on screen.',
    captionBn: 'প্রতিটি কম্পিউটার যে চারটি মূল কাজ করে — কীবোর্ডে টাইপ করা থেকে স্ক্রিনে ভিডিও দেখা পর্যন্ত।' },
  { path: 'basics/computer-hardware', slug: 'computer-hardware',
    altEn: 'An infographic of the physical parts inside a computer case — CPU, motherboard, RAM, storage drive, and power supply — each labeled with its role',
    altBn: 'কম্পিউটার কেসের ভিতরের physical অংশগুলোর একটা infographic — CPU, motherboard, RAM, storage drive, আর power supply — প্রতিটির কাজ লেবেল করা',
    captionEn: 'The core hardware components that work together inside every computer, laptop, and phone.',
    captionBn: 'মূল hardware উপাদানগুলো, যেগুলো প্রতিটি কম্পিউটার, ল্যাপটপ আর ফোনের ভিতরে একসাথে কাজ করে।' },
  { path: 'basics/input-devices', slug: 'input-devices',
    altEn: 'An infographic of computer input devices — keyboard, mouse, touchpad, trackball, microphone, webcam, scanner, camera, and barcode scanner — arranged around a computer',
    altBn: 'কম্পিউটার input device-এর একটা infographic — কীবোর্ড, মাউস, টাচপ্যাড, ট্র্যাকবল, মাইক্রোফোন, ওয়েবক্যাম, স্ক্যানার, ক্যামেরা, আর বারকোড স্ক্যানার — একটা কম্পিউটারের চারপাশে সাজানো',
    captionEn: 'Devices that send data and commands into the computer, from everyday keyboards to specialized fingerprint readers.',
    captionBn: 'যেসব device কম্পিউটারে data আর command পাঠায়, রোজকার কীবোর্ড থেকে শুরু করে বিশেষ fingerprint reader পর্যন্ত।' },
  { path: 'basics/output-devices', slug: 'output-devices',
    altEn: 'An infographic of computer output devices — monitors, projectors, speakers, headphones, printers, touchscreens, and specialized devices like VR headsets and braille displays',
    altBn: 'কম্পিউটার output device-এর একটা infographic — মনিটর, projector, স্পিকার, হেডফোন, প্রিন্টার, টাচস্ক্রিন, আর VR headset, braille display-এর মতো বিশেষ device',
    captionEn: 'Devices that present information from the computer so you can see, hear, or hold it.',
    captionBn: 'যেসব device কম্পিউটার থেকে তথ্য উপস্থাপন করে, যাতে আপনি সেটা দেখতে, শুনতে, বা হাতে ধরতে পারেন।' },
  { path: 'basics/computer-memory', slug: 'computer-memory',
    altEn: 'An infographic comparing computer memory types — RAM, ROM, and cache as primary memory, alongside HDD, SSD, NVMe, and other secondary storage — ordered by speed',
    altBn: 'কম্পিউটার memory-এর ধরন তুলনা করা একটা infographic — RAM, ROM, আর cache primary memory হিসেবে, সাথে HDD, SSD, NVMe আর অন্যান্য secondary storage — গতি অনুযায়ী সাজানো',
    captionEn: 'The different types of memory that help a computer think, work, and remember.',
    captionBn: 'যেসব memory কম্পিউটারকে ভাবতে, কাজ করতে, আর মনে রাখতে সাহায্য করে, তাদের বিভিন্ন ধরন।' },
  { path: 'basics/storage-devices', slug: 'storage-devices',
    altEn: 'An infographic comparing storage devices — hard disk drive, solid state drive, USB flash drive, and cloud storage — with speed, capacity, and portability comparisons',
    altBn: 'storage device তুলনা করা একটা infographic — hard disk drive, solid state drive, USB flash drive, আর cloud storage — গতি, capacity, আর portability সহ',
    captionEn: 'How the main storage options compare on speed, capacity, and portability.',
    captionBn: 'গতি, capacity, আর portability-তে মূল storage option গুলো কীভাবে তুলনা করা যায়।' },
  { path: 'basics/number-systems', slug: 'number-systems',
    altEn: 'An infographic explaining decimal, binary, and hexadecimal number systems, showing how the number 13 is represented in each — 13, 1101, and D',
    altBn: 'decimal, binary, আর hexadecimal number system ব্যাখ্যা করা একটা infographic, ১৩ সংখ্যাটি প্রতিটিতে কীভাবে দেখানো হয় তা সহ — 13, 1101, আর D',
    captionEn: 'The same number, three ways: decimal, binary, and hexadecimal.',
    captionBn: 'একই সংখ্যা, তিনভাবে — decimal, binary, আর hexadecimal।' },
  { path: 'basics/computer-software', slug: 'computer-software',
    altEn: "An infographic contrasting system software — operating system, utility software, device drivers — with application software like word processors, spreadsheets, and web browsers",
    altBn: 'system software — operating system, utility software, device driver — আর application software যেমন word processor, spreadsheet, web browser-এর মধ্যে তুলনা করা একটা infographic',
    captionEn: "Software has no physical form, but it's what tells the hardware what to do.",
    captionBn: 'Software-এর কোনো physical রূপ নেই, কিন্তু এটাই hardware-কে বলে দেয় কী করতে হবে।' },
  { path: 'basics/operating-systems', slug: 'operating-systems',
    altEn: 'An infographic explaining what an operating system does — managing memory, processor, files, and devices — and the major OS families: Windows, macOS, Linux, Android, and iOS',
    altBn: 'operating system কী করে তা ব্যাখ্যা করা একটা infographic — memory, processor, file, আর device পরিচালনা — আর প্রধান OS পরিবার: Windows, macOS, Linux, Android, আর iOS',
    captionEn: 'The operating system is the bridge between you and the hardware underneath.',
    captionBn: 'Operating system হলো আপনার আর নিচের hardware-এর মধ্যে সেতু।' },
  { path: 'basics/computer-networking', slug: 'computer-networking',
    altEn: 'An infographic explaining computer networking — the difference between a LAN and a WAN, common networking hardware like routers and switches, and how an IP address identifies a device',
    altBn: 'কম্পিউটার networking ব্যাখ্যা করা একটা infographic — LAN আর WAN-এর পার্থক্য, router, switch-এর মতো সাধারণ networking hardware, আর IP address কীভাবে একটা device চিহ্নিত করে',
    captionEn: 'How devices connect and exchange data, from a home Wi-Fi network to the internet.',
    captionBn: 'কীভাবে device একে অপরের সাথে সংযুক্ত হয়ে data আদান-প্রদান করে, একটা home Wi-Fi network থেকে শুরু করে ইন্টারনেট পর্যন্ত।' },
  { path: 'basics/internet-basics', slug: 'internet-basics',
    altEn: 'An infographic explaining how the internet works — your device, ISP, DNS, and a web server — and the four steps that happen when a webpage loads',
    altBn: 'ইন্টারনেট কীভাবে কাজ করে তা ব্যাখ্যা করা একটা infographic — আপনার device, ISP, DNS, আর একটা web server — আর একটা webpage load হওয়ার সময় যে চারটি ধাপ ঘটে',
    captionEn: 'What actually happens, in under a second, between typing a URL and seeing the page.',
    captionBn: 'একটা URL টাইপ করা থেকে পেজ দেখা পর্যন্ত, এক সেকেন্ডেরও কম সময়ে আসলে কী ঘটে।' },
  { path: 'basics/cybersecurity-basics', slug: 'cybersecurity-basics',
    altEn: 'An infographic covering cybersecurity basics — strong passwords, recognizing malware and phishing, and keeping software updated — with extra smart habits like two-factor authentication',
    altBn: 'cybersecurity basics নিয়ে একটা infographic — শক্তিশালী password, malware আর phishing চেনা, আর software আপডেট রাখা — সাথে two-factor authentication-এর মতো অতিরিক্ত smart habit',
    captionEn: 'Good cybersecurity is mostly about consistent habits, not complexity.',
    captionBn: 'ভালো cybersecurity মূলত জটিলতা নয়, ধারাবাহিক habit-এর ব্যাপার।' },
  { path: 'basics/computer-applications', slug: 'computer-applications',
    altEn: 'An infographic showing computer applications across everyday fields — education, business, healthcare, entertainment, and retail — each with typical uses',
    altBn: 'দৈনন্দিন বিভিন্ন ক্ষেত্রে কম্পিউটার application দেখানো একটা infographic — education, business, healthcare, entertainment, আর retail — প্রতিটির সাধারণ ব্যবহার সহ',
    captionEn: 'One computer, endless possibilities — the same core hardware powers every field, only the software changes.',
    captionBn: 'একটা কম্পিউটার, অসীম সম্ভাবনা — একই মূল hardware প্রতিটি ক্ষেত্রে কাজ করে, শুধু software পাল্টায়।' },
  { path: 'basics/quantum-computing-intro', slug: 'quantum-computing-intro',
    altEn: "An infographic introducing quantum computing — comparing a classical bit's fixed 0 or 1 state to a qubit's superposition of both at once — and where quantum computing might help",
    altBn: 'quantum computing পরিচয় করানো একটা infographic — classical bit-এর স্থির 0 বা 1 অবস্থার সাথে qubit-এর superposition (একইসাথে দুটোই) তুলনা করা — আর quantum computing কোথায় সাহায্য করতে পারে তা সহ',
    captionEn: 'Quantum computing is still experimental, but it explores many possibilities at once instead of checking them one by one.',
    captionBn: 'Quantum computing এখনো experimental, কিন্তু এটা একবারে অনেক সম্ভাবনা explore করে, একটার পর একটা check করার বদলে।' },
  { path: 'basics/artificial-intelligence-basics', slug: 'artificial-intelligence-basics',
    altEn: "An infographic explaining artificial intelligence basics — how machine learning works, where AI already appears in everyday apps, and what today's AI still cannot do",
    altBn: 'artificial intelligence basics ব্যাখ্যা করা একটা infographic — machine learning কীভাবে কাজ করে, দৈনন্দিন app-এ AI ইতিমধ্যে কোথায় আছে, আর আজকের AI এখনো কী করতে পারে না',
    captionEn: "AI learns patterns from data to make predictions — it doesn't truly understand, and it can be confidently wrong.",
    captionBn: 'AI data থেকে pattern শিখে prediction করে — এটা সত্যিকারের understand করে না, আর confidently ভুলও হতে পারে।' },
]

async function main() {
  for (const t of targets) {
    const { data: doc, error: docErr } = await supabase.from('docs').select('id,blocks').eq('path', t.path).single()
    if (docErr || !doc) { console.error(`✗ ${t.path} — not found:`, docErr?.message); continue }

    if (doc.blocks.some(b => b.type === 'image' && b.publicId === `docs/img/basics/${t.slug}`)) {
      console.log(`  = ${t.path} — already has this image, skipped`); continue
    }

    console.log(`  ↑ ${t.slug} — converting + uploading...`)
    const upload = DRY_RUN ? { publicId: `docs/img/basics/${t.slug}`, width: 0, height: 0 } : await convertAndUpload(t.slug)

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
