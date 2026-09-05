#!/usr/bin/env node
// Adds 4 more hand-picked infographics (ChatGPT-generated, user request
// 2026-09-03) to the end of their matching "basics" chapter — same pattern
// as scripts/add-basics-infographics.mjs (Session 78). This batch targets
// 4 lessons that already exist with one isometric hero image each; these
// dense infographics are appended as a second (or third) image, not a
// replacement.
//
// Source files renamed from their ChatGPT export names to descriptive
// slugs in .extra-images/basic-computer/ before running this script:
//   file-and-folder-basics-infographic.png       -> basics/file-and-folder-basics
//   command-line-and-terminal-basics-infographic.png -> basics/command-line-and-terminal-basics
//   git-basics-infographic.png                    -> basics/git-basics
//   generations-of-computers-infographic.png      -> basics/generations-of-computers
// No 5th image was supplied for basics/github-basics — left untouched.
//
// Pipeline mirrors the original batch: sharp re-encode to WebP q80/max
// 1600px (strips AI/EXIF metadata as a side effect) -> Cloudinary at
// docs/img/basics/<slug>-N (N picked to not collide with each lesson's
// existing image index).
//
// Usage: node scripts/add-basics-infographics-batch2.mjs [--dry-run]

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

async function convertAndUpload(sourceFile, publicId) {
  const inputPath = path.join(IMG_DIR, sourceFile)
  const buffer = await sharp(inputPath).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
  const { width, height } = await sharp(buffer).metadata()
  const result = await cloudinaryUploadBuffer(buffer, publicId)
  return { publicId, width, height, deliveryUrl: result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/') }
}

const targets = [
  { path: 'basics/file-and-folder-basics', source: 'file-and-folder-basics-infographic.png', publicId: 'docs/img/basics/file-and-folder-basics-3',
    altEn: 'An infographic covering file and folder basics — what a file actually is, common file extensions, how folders nest, absolute vs. relative paths, and file naming rules for code',
    altBn: 'একটা infographic যেখানে file আর folder-এর basics কভার করা — একটা file আসলে কী, common file extension, folder কীভাবে nest করে, absolute বনাম relative path, আর code-এর জন্য file naming নিয়ম',
    captionEn: 'The building blocks every later lesson on this site assumes — files, extensions, folders, and paths.',
    captionBn: 'এই সাইটের পরের প্রতিটা lesson যা ধরে নেয় সেই building block — file, extension, folder, আর path।' },
  { path: 'basics/command-line-and-terminal-basics', source: 'command-line-and-terminal-basics-infographic.png', publicId: 'docs/img/basics/command-line-and-terminal-basics-3',
    altEn: 'An infographic covering command line and terminal basics — GUI vs CLI, opening a terminal on Windows and macOS, navigation commands, creating and deleting files, and reading a command\'s structure',
    altBn: 'একটা infographic যেখানে command line আর terminal-এর basics কভার করা — GUI বনাম CLI, Windows আর macOS-এ terminal খোলা, navigation command, file তৈরি ও delete করা, আর একটা command-এর structure পড়া',
    captionEn: 'The same commands, side by side for Windows and macOS/Linux — the exact reference used throughout the Cybersecurity course\'s CLI lessons too.',
    captionBn: 'একই command, Windows আর macOS/Linux-এর জন্য পাশাপাশি — Cybersecurity কোর্সের CLI lesson-এও ব্যবহৃত একই reference।' },
  { path: 'basics/git-basics', source: 'git-basics-infographic.png', publicId: 'docs/img/basics/git-basics-2',
    altEn: 'An infographic covering Git basics — the problem before version control, what a commit actually is, the three core ideas of repository/staging area/commit, and the commands to know',
    altBn: 'একটা infographic যেখানে Git basics কভার করা — version control-এর আগের সমস্যা, একটা commit আসলে কী, repository/staging area/commit-এর তিনটা মূল ধারণা, আর জানার মতো command',
    captionEn: 'The same core loop — modify, stage, commit — taught in full depth in this site\'s dedicated Git & GitHub course.',
    captionBn: 'একই মূল loop — modify, stage, commit — এই সাইটের dedicated Git & GitHub কোর্সে পূর্ণ গভীরতায় শেখানো।' },
  { path: 'basics/generations-of-computers', source: 'generations-of-computers-infographic.png', publicId: 'docs/img/basics/generations-of-computers-2',
    altEn: 'An infographic covering the five generations of computers — vacuum tubes, transistors, integrated circuits, microprocessors, and artificial intelligence — with approximate periods and examples',
    altBn: 'একটা infographic যেখানে কম্পিউটারের পাঁচটা generation কভার করা — vacuum tube, transistor, integrated circuit, microprocessor, আর artificial intelligence — আনুমানিক সময়কাল আর উদাহরণ সহ',
    captionEn: 'Five generations, one trend each time: more power, less space, lower cost.',
    captionBn: 'পাঁচটা generation, প্রতিবার একই প্রবণতা: বেশি power, কম জায়গা, কম খরচ।' },
]

async function main() {
  for (const t of targets) {
    const { data: doc, error: docErr } = await supabase.from('docs').select('id,blocks').eq('path', t.path).single()
    if (docErr || !doc) { console.error(`✗ ${t.path} — not found:`, docErr?.message); continue }

    if (doc.blocks.some(b => b.type === 'image' && b.publicId === t.publicId)) {
      console.log(`  = ${t.path} — already has this image, skipped`); continue
    }

    console.log(`  ↑ ${t.source} — converting + uploading...`)
    const upload = DRY_RUN ? { publicId: t.publicId, width: 0, height: 0 } : await convertAndUpload(t.source, t.publicId)

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
