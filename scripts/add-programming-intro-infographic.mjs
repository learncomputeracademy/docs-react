#!/usr/bin/env node
// Adds a single ChatGPT-generated infographic (user-supplied 2026-09-04) to the
// bottom of programming/intro. Same pipeline as the cybersecurity infographic
// scripts: sharp WebP re-encode (strips AI/EXIF metadata as a side effect) ->
// Cloudinary at docs/img/programming/intro.
//
// Usage: node scripts/add-programming-intro-infographic.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import { nanoid } from 'nanoid'

const ROOT = path.resolve(import.meta.dirname, '..')
const DRY_RUN = process.argv.includes('--dry-run')
const PATH = 'programming/intro'
const SLUG = 'intro'
const INPUT = path.join(ROOT, '.extra-images/programming/programming-intro.png')

const ALT_EN = 'An infographic explaining what programming is — why learn to program, what code actually looks like with a JavaScript example, how this course section is organized (variables, data types, conditions, loops, functions), what you\'ll build over time, and the programmer\'s mindset'
const ALT_BN = 'একটা infographic যেখানে ব্যাখ্যা করা programming আসলে কী — কেন programming শেখা, code আসলে দেখতে কেমন একটা JavaScript উদাহরণ সহ, এই course section কীভাবে সাজানো (variable, data type, condition, loop, function), সময়ের সাথে কী বানাবেন, আর programmer-এর mindset'
const CAPTION_EN = 'Storing information, making decisions, and repeating actions — the three ideas almost every program is built from.'
const CAPTION_BN = 'তথ্য store করা, সিদ্ধান্ত নেওয়া, আর কাজ repeat করা — প্রায় প্রতিটা program এই তিনটা ধারণা দিয়ে তৈরি।'

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

async function main() {
  const { data: doc, error: docErr } = await supabase.from('docs').select('id,blocks').eq('path', PATH).single()
  if (docErr || !doc) { console.error('Not found:', docErr?.message); process.exit(1) }

  const publicId = `docs/img/programming/${SLUG}`
  if (doc.blocks.some(b => b.type === 'image' && b.publicId === publicId)) {
    console.log('Already has this image. Skipping.'); return
  }

  console.log('Converting + uploading...')
  const upload = DRY_RUN
    ? { publicId, width: 0, height: 0 }
    : await (async () => {
        const buffer = await sharp(INPUT).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
        const { width, height } = await sharp(buffer).metadata()
        await cloudinaryUploadBuffer(buffer, publicId)
        return { publicId, width, height }
      })()

  const enBlock = img(upload.publicId, ALT_EN, upload.width, upload.height, CAPTION_EN)
  const enBlocks = [...doc.blocks, enBlock]

  const { data: tr, error: trErr } = await supabase.from('doc_translations').select('blocks').eq('doc_id', doc.id).eq('locale', 'bn').single()
  if (trErr || !tr) { console.error('bn not found:', trErr?.message); process.exit(1) }
  const bnBlock = img(upload.publicId, ALT_BN, upload.width, upload.height, CAPTION_BN)
  const bnBlocks = [...tr.blocks, bnBlock]

  if (DRY_RUN) { console.log(`[dry-run] would append ${upload.publicId} (en ${enBlocks.length} blocks, bn ${bnBlocks.length} blocks)`); return }

  const { error: updDocErr } = await supabase.from('docs').update({ blocks: enBlocks, toc: toc(enBlocks) }).eq('id', doc.id)
  if (updDocErr) { console.error('en update failed:', updDocErr.message); process.exit(1) }
  const { error: updTrErr } = await supabase.from('doc_translations').update({ blocks: bnBlocks, toc: toc(bnBlocks) }).eq('doc_id', doc.id).eq('locale', 'bn')
  if (updTrErr) { console.error('bn update failed:', updTrErr.message); process.exit(1) }

  console.log(`✓ ${PATH} — appended ${upload.publicId} (${upload.width}x${upload.height})`)
}

main().catch(err => { console.error(err); process.exit(1) })
