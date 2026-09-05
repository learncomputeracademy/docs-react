#!/usr/bin/env node
// Adds real Figma-built diagrams to old, image-less Jekyll-migrated lessons —
// a beginner-eye audit (2026-08-18) found HTML/CSS/Graphic Design/Career/
// Marketing/SEO/WordPress are almost entirely text-only (0 image blocks on
// ~500+ lessons). This is Tier 1 of that fix: the 3 highest-leverage,
// inherently-spatial concepts that had zero visual aid.
//
// Images (hand-built in the real Figma web app via claude-in-chrome, same
// as the Figma course's real-app screenshots — not AI-generated, since
// exact text labels like "<figcaption>" matter and AI text rendering is
// unreliable):
//   1. docs/img/html/page-anatomy — one annotated "page anatomy" diagram
//      (header/nav/main/article/figure/figcaption/section/aside/footer, all
//      labeled and correctly nested), reused across 10 HTML lessons.
//   2. docs/img/css/box-model-diagram — classic devtools-style nested
//      margin/border/padding/content diagram, for css/boxmodel.
//   3. docs/img/css/position-values — 5 labeled comparison panels
//      (static/relative/absolute/fixed/sticky), for css/positioning.
//
// Inserts the image block right after each lesson's existing intro
// paragraph (index 1) — does not touch any other content. Safe to re-run.
//
// Usage: node scripts/add-figma-diagrams.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

function img(publicId, alt, width, height, caption) { return { id: nanoid(12), type: 'image', publicId, alt, width, height, caption } }
function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }

const ANATOMY_ALT_EN = "A diagram of a webpage's semantic HTML structure, showing labeled, correctly nested regions for header, nav, main, article, figure, figcaption, section, aside, and footer"
const ANATOMY_ALT_BN = 'একটা webpage-এর semantic HTML গঠনের একটা diagram, header, nav, main, article, figure, figcaption, section, aside, আর footer-এর জন্য label করা, সঠিকভাবে nested region দেখাচ্ছে'

const ANATOMY = { publicId: 'docs/img/html/page-anatomy', width: 1286, height: 735 }
const BOXMODEL = { publicId: 'docs/img/css/box-model-diagram', width: 1188, height: 662 }
const POSITION = { publicId: 'docs/img/css/position-values', width: 1286, height: 428 }

// path -> { captionEn, captionBn } (alt is shared per image; caption highlights the specific tag)
const targets = [
  { path: 'html/semantic-elements', img: ANATOMY,
    captionEn: 'The semantic regions of a typical page — header, nav, main (with article, figure/figcaption, and section), aside, and footer.',
    captionBn: 'একটা সাধারণ page-এর semantic region — header, nav, main (article, figure/figcaption, আর section সহ), aside, আর footer।' },
  { path: 'html/tag-header', img: ANATOMY,
    captionEn: 'The <header> region — usually the top of the page or a section, holding a logo, title, or intro content.',
    captionBn: '<header> region — সাধারণত page বা section-এর শীর্ষ, একটা logo, title, বা intro content ধারণ করে।' },
  { path: 'html/tag-nav', img: ANATOMY,
    captionEn: 'The <nav> region — a block of major navigation links, often sitting just under the header.',
    captionBn: '<nav> region — প্রধান navigation link-এর একটা block, প্রায়ই header-এর ঠিক নিচে বসে।' },
  { path: 'html/tag-main', img: ANATOMY,
    captionEn: 'The <main> region — wraps the page\'s primary content (article, section, aside), one per page.',
    captionBn: '<main> region — page-এর প্রধান content (article, section, aside) মোড়ায়, প্রতি page-এ একটা।' },
  { path: 'html/tag-article', img: ANATOMY,
    captionEn: 'The <article> region — self-contained content that would still make sense on its own, like a blog post.',
    captionBn: '<article> region — স্বয়ংসম্পূর্ণ content যা নিজে থেকেই অর্থবহ হবে, যেমন একটা blog post।' },
  { path: 'html/tag-section', img: ANATOMY,
    captionEn: 'The <section> region — a thematic grouping of content, usually with its own heading, inside an article or main.',
    captionBn: '<section> region — content-এর একটা বিষয়ভিত্তিক গ্রুপিং, সাধারণত নিজস্ব heading সহ, একটা article বা main-এর ভিতরে।' },
  { path: 'html/tag-aside', img: ANATOMY,
    captionEn: 'The <aside> region — content tangentially related to the main content, like a sidebar.',
    captionBn: '<aside> region — মূল content-এর সাথে পরোক্ষভাবে সম্পর্কিত content, যেমন একটা sidebar।' },
  { path: 'html/tag-footer', img: ANATOMY,
    captionEn: 'The <footer> region — closing content for a page or section, like copyright or contact links.',
    captionBn: '<footer> region — একটা page বা section-এর জন্য শেষ content, যেমন copyright বা contact link।' },
  { path: 'html/tag-figure', img: ANATOMY,
    captionEn: 'The <figure> region — wraps self-contained media (an image, diagram, or code sample) plus its <figcaption>.',
    captionBn: '<figure> region — স্বয়ংসম্পূর্ণ media (একটা image, diagram, বা code sample) আর তার <figcaption> মোড়ায়।' },
  { path: 'html/tag-figcaption', img: ANATOMY,
    captionEn: 'The <figcaption> — a caption tied to its parent <figure>, always the first or last child inside it.',
    captionBn: '<figcaption> — তার parent <figure>-এর সাথে যুক্ত একটা caption, সবসময় এর ভিতরে প্রথম বা শেষ child।' },
  { path: 'css/boxmodel', img: BOXMODEL, altEn: 'A classic devtools-style diagram of the CSS box model, showing nested margin, border, padding, and content regions, each labeled', altBn: 'CSS box model-এর একটা classic devtools-style diagram, nested margin, border, padding, আর content region দেখাচ্ছে, প্রতিটা label করা',
    captionEn: 'The CSS box model, outside in: margin, then border, then padding, then the actual content.',
    captionBn: 'CSS box model, বাইরে থেকে ভিতরে: margin, তারপর border, তারপর padding, তারপর আসল content।' },
  { path: 'css/positioning', img: POSITION, altEn: 'Five labeled comparison panels showing the effect of each CSS position value: static, relative, absolute, fixed, and sticky', altBn: 'পাঁচটা label করা comparison panel প্রতিটা CSS position value-এর প্রভাব দেখাচ্ছে: static, relative, absolute, fixed, আর sticky',
    captionEn: 'The five position values side by side — what each one actually does to an element.',
    captionBn: 'পাঁচটা position value পাশাপাশি — প্রতিটা আসলে একটা element-এর সাথে কী করে।' },
]

async function main() {
  for (const t of targets) {
    const { data: doc, error: docErr } = await supabase.from('docs').select('id,blocks').eq('path', t.path).single()
    if (docErr || !doc) { console.error(`✗ ${t.path} — not found:`, docErr?.message); continue }

    const alreadyHasImage = doc.blocks.some(b => b.type === 'image' && b.publicId === t.img.publicId)
    if (alreadyHasImage) { console.log(`  = ${t.path} — already has this image, skipped`); continue }

    const enImgBlock = img(t.img.publicId, t.altEn ?? ANATOMY_ALT_EN, t.img.width, t.img.height, t.captionEn)
    const enBlocks = [...doc.blocks.slice(0, 1), enImgBlock, ...doc.blocks.slice(1)]

    const { data: tr, error: trErr } = await supabase.from('doc_translations').select('blocks').eq('doc_id', doc.id).eq('locale', 'bn').single()
    if (trErr || !tr) { console.error(`✗ ${t.path} (bn) — not found:`, trErr?.message); continue }
    const bnImgBlock = img(t.img.publicId, t.altBn ?? ANATOMY_ALT_BN, t.img.width, t.img.height, t.captionBn)
    const bnBlocks = [...tr.blocks.slice(0, 1), bnImgBlock, ...tr.blocks.slice(1)]

    if (DRY_RUN) { console.log(`  [en+bn] ${t.path} — would insert ${t.img.publicId} at index 1 (${enBlocks.length} blocks total)`); continue }

    const { error: updDocErr } = await supabase.from('docs').update({ blocks: enBlocks, toc: toc(enBlocks) }).eq('id', doc.id)
    if (updDocErr) { console.error(`✗ ${t.path} (en update):`, updDocErr.message); continue }
    const { error: updTrErr } = await supabase.from('doc_translations').update({ blocks: bnBlocks, toc: toc(bnBlocks) }).eq('doc_id', doc.id).eq('locale', 'bn')
    if (updTrErr) { console.error(`✗ ${t.path} (bn update):`, updTrErr.message); continue }
    console.log(`  ✓ ${t.path} — inserted ${t.img.publicId}`)
  }
  console.log(DRY_RUN ? '\n[dry-run] no writes made.' : `\n✅ Done. ${targets.length} lessons processed.`)
}

main().catch(err => { console.error(err); process.exit(1) })
