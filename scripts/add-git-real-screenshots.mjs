#!/usr/bin/env node
// Adds 4 real screenshots (captured live via claude-in-chrome, 2026-09-03,
// per the user's explicit "don't use Magnific, use claude-in-chrome" and
// "hide any personal/private info" instructions) to their matching git
// lessons. Existing content untouched; this only appends an image block.
// Same pipeline as scripts/add-cybersecurity-real-screenshots.mjs.
//
// Sources:
//   - github-repo-page      — octocat/Hello-World, GitHub's own official
//     public demo repo (github-repo-page.png)
//   - pull-request          — a real merged PR on that same public repo
//     (pull-request.png)
//   - github-issues         — a real public issues list on microsoft/vscode
//     (github-issues.png)
//   - creating-a-github-repository — the real "Create a new repository"
//     form (logged-in-only screen, unavoidable) — the Owner/username field
//     blurred via a sharp region-blur before upload, same recipe as the
//     Google Drive filename blur from D-107 (creating-a-github-repository.jpg)
//
// All 4 also cropped to exclude the top-nav avatar/notification icons —
// zero personal data in any of the first 3 (fully public GitHub pages),
// only the repo-creation screen's Owner field needed redaction.
//
// Usage: node scripts/add-git-real-screenshots.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import { nanoid } from 'nanoid'

const ROOT = path.resolve(import.meta.dirname, '..')
const IMG_DIR = path.join(ROOT, '.extra-images/git/raw')
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

async function convertAndUpload(slug, ext) {
  const inputPath = path.join(IMG_DIR, `${slug}.${ext}`)
  const publicId = `docs/img/git/${slug}`
  const buffer = await sharp(inputPath).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
  const { width, height } = await sharp(buffer).metadata()
  const result = await cloudinaryUploadBuffer(buffer, publicId)
  return { publicId, width, height, deliveryUrl: result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/') }
}

const targets = [
  { path: 'git/introduction-to-github', slug: 'github-repo-page', ext: 'png',
    altEn: 'A real, public GitHub repository page — octocat/Hello-World, GitHub\'s own official demo repository — showing the Code button, commit history, and rendered README',
    altBn: 'একটা আসল, public GitHub repository page — octocat/Hello-World, GitHub-এর নিজের official demo repository — Code button, commit history, আর render করা README দেখাচ্ছে',
    captionEn: 'A real repository page — this is what every project on GitHub looks like at a glance.',
    captionBn: 'একটা আসল repository page — GitHub-এ প্রতিটা project এক নজরে দেখতে এমন।' },
  { path: 'git/forking-and-pull-requests', slug: 'pull-request', ext: 'png',
    altEn: 'A real, merged pull request on a public GitHub repository, showing the conversation, commits, and files-changed tabs',
    altBn: 'একটা public GitHub repository-তে একটা আসল, merged pull request, conversation, commit, আর files-changed tab দেখাচ্ছে',
    captionEn: 'A real merged pull request — the review step before code becomes part of a project.',
    captionBn: 'একটা আসল merged pull request — কোড একটা project-এর অংশ হওয়ার আগের review step।' },
  { path: 'git/github-issues', slug: 'github-issues', ext: 'png',
    altEn: 'A real public issues list on a large open-source GitHub repository, showing open issue counts, titles, and labels',
    altBn: 'একটা বড় open-source GitHub repository-তে একটা আসল public issues list, খোলা issue সংখ্যা, title, আর label দেখাচ্ছে',
    captionEn: 'A real issues list — tracking bugs and feature requests alongside the code itself.',
    captionBn: 'একটা আসল issues list — কোডের পাশাপাশি bug আর feature request track করা।' },
  { path: 'git/creating-a-github-repository', slug: 'creating-a-github-repository', ext: 'jpg',
    altEn: 'The real "Create a new repository" form on GitHub, with the repository name and description filled in — the Owner/username field blurred for privacy',
    altBn: 'GitHub-এর আসল "Create a new repository" form, repository name আর description পূরণ করা — privacy-র জন্য Owner/username field blur করা',
    captionEn: 'The real repository-creation form — this is what deciding a name, visibility, and starter files actually looks like.',
    captionBn: 'আসল repository-creation form — একটা নাম, visibility, আর starter file ঠিক করা আসলে দেখতে এমন।' },
]

async function main() {
  for (const t of targets) {
    const { data: doc, error: docErr } = await supabase.from('docs').select('id,blocks').eq('path', t.path).single()
    if (docErr || !doc) { console.error(`✗ ${t.path} — not found:`, docErr?.message); continue }

    if (doc.blocks.some(b => b.type === 'image' && b.publicId === `docs/img/git/${t.slug}`)) {
      console.log(`  = ${t.path} — already has this image, skipped`); continue
    }

    console.log(`  ↑ ${t.slug} — converting + uploading...`)
    const upload = DRY_RUN ? { publicId: `docs/img/git/${t.slug}`, width: 0, height: 0 } : await convertAndUpload(t.slug, t.ext)

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
