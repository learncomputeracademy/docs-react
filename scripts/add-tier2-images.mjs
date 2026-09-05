#!/usr/bin/env node
// Tier 2 of the beginner-eye content audit (D-90 continuation) — adds real
// Figma-built example mockups to the 7 zero-image Graphic Design "exercise"
// lessons (worst gap on the site — these literally instruct "design a
// poster/flyer/business card" with no example shown) and 2 SEO lessons
// where a mocked Google SERP result / Open Graph share card grounds an
// otherwise abstract, code-only concept.
//
// Images (hand-built in the real Figma web app via claude-in-chrome, same
// as Tier 1 — deliberately generic/fictional brand names, no real client
// or platform trade dress):
//   docs/img/design/business-card-example — visiting-card-intro + -exercise
//   docs/img/design/poster-example        — poster
//   docs/img/design/flyer-example         — flyer
//   docs/img/design/brochure-example      — brochure-intro + -exercise
//   docs/img/design/menu-example          — menu-exercise
//   docs/img/seo/serp-result-mockup       — title-tags + meta-descriptions
//   docs/img/seo/og-card-mockup           — open-graph
//
// Graphic Design "exercise" lessons are unusually thin (heading, <hr>, an
// assignment table, a note — no intro paragraph), so the image is inserted
// at index 2, right before the assignment table: "here's a finished
// example, now build yours." SEO lessons keep the established index-1
// (right after the intro paragraph) convention.
//
// Usage: node scripts/add-tier2-images.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

function img(publicId, alt, width, height, caption) { return { id: nanoid(12), type: 'image', publicId, alt, width, height, caption } }
function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }

const BUSINESS_CARD = { publicId: 'docs/img/design/business-card-example', width: 796, height: 429 }
const POSTER = { publicId: 'docs/img/design/poster-example', width: 465, height: 710 }
const FLYER = { publicId: 'docs/img/design/flyer-example', width: 490, height: 649 }
const BROCHURE = { publicId: 'docs/img/design/brochure-example', width: 955, height: 465 }
const MENU = { publicId: 'docs/img/design/menu-example', width: 612, height: 673 }
const SERP = { publicId: 'docs/img/seo/serp-result-mockup', width: 918, height: 294 }
const OG = { publicId: 'docs/img/seo/og-card-mockup', width: 737, height: 373 }

const targets = [
  { path: 'design/visiting-card-intro', img: BUSINESS_CARD, insertAt: 2,
    altEn: 'A finished business card example — dark navy background, name and title in white, contact details, an orange accent block',
    altBn: 'একটা শেষ হওয়া business card উদাহরণ — গাঢ় navy background, সাদা রঙে নাম আর title, contact detail, একটা orange accent block',
    captionEn: 'A finished example — front side of a simple, professional business card.',
    captionBn: 'একটা শেষ হওয়া উদাহরণ — একটা সরল, professional business card-এর সামনের দিক।' },
  { path: 'design/visiting-card-exercise', img: BUSINESS_CARD, insertAt: 2,
    altEn: 'A finished business card example — dark navy background, name and title in white, contact details, an orange accent block',
    altBn: 'একটা শেষ হওয়া business card উদাহরণ — গাঢ় navy background, সাদা রঙে নাম আর title, contact detail, একটা orange accent block',
    captionEn: 'One way to solve this exercise — use it as a reference, not a template to copy exactly.',
    captionBn: 'এই exercise সমাধানের একটা উপায় — এটাকে একটা reference হিসেবে ব্যবহার করুন, হুবহু কপি করার একটা template না।' },
  { path: 'design/poster', img: POSTER, insertAt: 2,
    altEn: 'A finished poster example — bold purple background, large white headline, an image placeholder, an orange event-details bar',
    altBn: 'একটা শেষ হওয়া poster উদাহরণ — গাঢ় purple background, বড় সাদা headline, একটা image placeholder, একটা orange event-details bar',
    captionEn: 'A finished example — a bold headline, one clear image area, and event details in a single accent bar.',
    captionBn: 'একটা শেষ হওয়া উদাহরণ — একটা বোল্ড headline, একটা স্পষ্ট image এলাকা, আর একটা accent bar-এ event detail।' },
  { path: 'design/flyer', img: FLYER, insertAt: 2,
    altEn: 'A finished flyer example — teal header band, cream background, an image placeholder, event details, and a call-to-action link',
    altBn: 'একটা শেষ হওয়া flyer উদাহরণ — teal header band, cream background, একটা image placeholder, event detail, আর একটা call-to-action link',
    captionEn: 'A finished example — smaller and denser than a poster, built to be handed out or shared digitally.',
    captionBn: 'একটা শেষ হওয়া উদাহরণ — একটা poster-এর চেয়ে ছোট আর ঘনসন্নিবিষ্ট, বিতরণ বা digitally শেয়ার করার জন্য বানানো।' },
  { path: 'design/brochure-intro', img: BROCHURE, insertAt: 2,
    altEn: 'A finished tri-fold brochure example — a navy cover panel, and two inside panels listing services and contact details',
    altBn: 'একটা শেষ হওয়া tri-fold brochure উদাহরণ — একটা navy cover panel, আর service আর contact detail তালিকাভুক্ত করা দুটো ভিতরের panel',
    captionEn: 'A finished example of a tri-fold brochure — cover, then two inside panels once unfolded.',
    captionBn: 'একটা tri-fold brochure-এর একটা শেষ হওয়া উদাহরণ — cover, তারপর খোলার পরে দুটো ভিতরের panel।' },
  { path: 'design/brochure-exercise', img: BROCHURE, insertAt: 2,
    altEn: 'A finished tri-fold brochure example — a navy cover panel, and two inside panels listing services and contact details',
    altBn: 'একটা শেষ হওয়া tri-fold brochure উদাহরণ — একটা navy cover panel, আর service আর contact detail তালিকাভুক্ত করা দুটো ভিতরের panel',
    captionEn: 'One way to solve this exercise — use it as a reference, not a template to copy exactly.',
    captionBn: 'এই exercise সমাধানের একটা উপায় — এটাকে একটা reference হিসেবে ব্যবহার করুন, হুবহু কপি করার একটা template না।' },
  { path: 'design/menu-exercise', img: MENU, insertAt: 2,
    altEn: 'A finished restaurant menu example — a dark header with the cafe name, a cream background, and a starters section with prices',
    altBn: 'একটা শেষ হওয়া restaurant menu উদাহরণ — cafe-এর নাম সহ একটা গাঢ় header, একটা cream background, আর দাম সহ একটা starters section',
    captionEn: 'A finished example — clear section heading, consistent item/price alignment.',
    captionBn: 'একটা শেষ হওয়া উদাহরণ — স্পষ্ট section heading, সামঞ্জস্যপূর্ণ item/দাম alignment।' },
  { path: 'seo/title-tags', img: SERP, insertAt: 1,
    altEn: 'A mocked Google search result showing the breadcrumb URL, the clickable blue title, and the gray description snippet',
    altBn: 'breadcrumb URL, clickable নীল title, আর ধূসর description snippet দেখানো একটা mock করা Google search result',
    captionEn: 'The title tag is what becomes the clickable blue link here.',
    captionBn: 'Title tag হলো এখানে যা clickable নীল link হয়ে যায়।' },
  { path: 'seo/meta-descriptions', img: SERP, insertAt: 1,
    altEn: 'A mocked Google search result showing the breadcrumb URL, the clickable blue title, and the gray description snippet',
    altBn: 'breadcrumb URL, clickable নীল title, আর ধূসর description snippet দেখানো একটা mock করা Google search result',
    captionEn: 'The meta description is what usually becomes the gray snippet text below the title.',
    captionBn: 'Meta description সাধারণত title-এর নিচে ধূসর snippet টেক্সট হয়ে যায়।' },
  { path: 'seo/open-graph', img: OG, insertAt: 1,
    altEn: 'A mocked Open Graph share-card preview — an image, a domain name, a bold title, and a description, as it would appear when a link is shared',
    altBn: 'একটা mock করা Open Graph share-card preview — একটা image, একটা domain name, একটা bold title, আর একটা description, একটা link শেয়ার হলে যেমন দেখাতো',
    captionEn: 'This is what og:image, og:title, and og:description control — the card shown when a link is shared.',
    captionBn: 'এটাই og:image, og:title, আর og:description নিয়ন্ত্রণ করে — একটা link শেয়ার হলে দেখানো card।' },
]

async function main() {
  for (const t of targets) {
    const { data: doc, error: docErr } = await supabase.from('docs').select('id,blocks').eq('path', t.path).single()
    if (docErr || !doc) { console.error(`✗ ${t.path} — not found:`, docErr?.message); continue }

    const alreadyHasImage = doc.blocks.some(b => b.type === 'image' && b.publicId === t.img.publicId)
    if (alreadyHasImage) { console.log(`  = ${t.path} — already has this image, skipped`); continue }

    const enImgBlock = img(t.img.publicId, t.altEn, t.img.width, t.img.height, t.captionEn)
    const enBlocks = [...doc.blocks.slice(0, t.insertAt), enImgBlock, ...doc.blocks.slice(t.insertAt)]

    const { data: tr, error: trErr } = await supabase.from('doc_translations').select('blocks').eq('doc_id', doc.id).eq('locale', 'bn').single()
    if (trErr || !tr) { console.error(`✗ ${t.path} (bn) — not found:`, trErr?.message); continue }
    const bnImgBlock = img(t.img.publicId, t.altBn, t.img.width, t.img.height, t.captionBn)
    const bnBlocks = [...tr.blocks.slice(0, t.insertAt), bnImgBlock, ...tr.blocks.slice(t.insertAt)]

    if (DRY_RUN) { console.log(`  [en+bn] ${t.path} — would insert ${t.img.publicId} at index ${t.insertAt} (${enBlocks.length} blocks total)`); continue }

    const { error: updDocErr } = await supabase.from('docs').update({ blocks: enBlocks, toc: toc(enBlocks) }).eq('id', doc.id)
    if (updDocErr) { console.error(`✗ ${t.path} (en update):`, updDocErr.message); continue }
    const { error: updTrErr } = await supabase.from('doc_translations').update({ blocks: bnBlocks, toc: toc(bnBlocks) }).eq('doc_id', doc.id).eq('locale', 'bn')
    if (updTrErr) { console.error(`✗ ${t.path} (bn update):`, updTrErr.message); continue }
    console.log(`  ✓ ${t.path} — inserted ${t.img.publicId}`)
  }
  console.log(DRY_RUN ? '\n[dry-run] no writes made.' : `\n✅ Done. ${targets.length} lessons processed.`)
}

main().catch(err => { console.error(err); process.exit(1) })
