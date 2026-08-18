#!/usr/bin/env node
// Final batch of the beginner-eye content audit (D-90/D-92 continuation, "do
// the rest") — the deferred scope named in those journal entries: Career
// Skills (CV/LinkedIn mockups), Marketing (CTA/email/social mockups), and
// HTML/CSS (form/navbar/dropdown UI mockups). 8 images, 8 lessons.
//
// Images (hand-built in the real Figma web app via claude-in-chrome, same
// as Tier 1/2 — fictional people/companies, no real platform trade dress):
//   docs/img/career/cv-example            — writing-a-developer-cv
//   docs/img/career/profile-example       — linkedin-and-your-online-presence
//     (deliberately generic "professional profile" — no real LinkedIn blue/logo)
//   docs/img/marketing/cta-example         — calls-to-action
//   docs/img/marketing/email-example       — writing-emails
//   docs/img/marketing/social-post-example — social-content-strategy
//   docs/img/html/form-example             — forms
//   docs/img/css/navbar-example            — navbar (states: active/hover/default)
//   docs/img/css/dropdown-example          — dropdowns (open state, item hovered)
//
// Insertion index varies by lesson shape: normal lessons with an intro
// paragraph before the first heading get index 1 (right after intro).
// html/forms, css/navbar, css/dropdowns are the older Jekyll-style docs
// (leading <hr>, no intro paragraph) — inspected each one's block list by
// hand: html/forms gets index 3 (after the intro paragraph that follows the
// first heading, before the code sample); css/navbar and css/dropdowns get
// index 2 (right before their existing interactive <tryit> demo, so the
// static mockup sets up what the live demo then lets you play with).
//
// Usage: node scripts/add-tier2b-images.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

function img(publicId, alt, width, height, caption) { return { id: nanoid(12), type: 'image', publicId, alt, width, height, caption } }
function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }

const CV = { publicId: 'docs/img/career/cv-example', width: 734, height: 343 }
const PROFILE = { publicId: 'docs/img/career/profile-example', width: 796, height: 245 }
const CTA = { publicId: 'docs/img/marketing/cta-example', width: 737, height: 370 }
const EMAIL = { publicId: 'docs/img/marketing/email-example', width: 690, height: 493 }
const SOCIAL = { publicId: 'docs/img/marketing/social-post-example', width: 492, height: 554 }
const FORM = { publicId: 'docs/img/html/form-example', width: 590, height: 493 }
const NAVBAR = { publicId: 'docs/img/css/navbar-example', width: 712, height: 168 }
const DROPDOWN = { publicId: 'docs/img/css/dropdown-example', width: 590, height: 250 }

const targets = [
  { path: 'career/writing-a-developer-cv', img: CV, insertAt: 1,
    altEn: 'A finished developer CV example — a navy sidebar accent, name and title, a Skills section, and an Experience section with a project bullet',
    altBn: 'একটা শেষ হওয়া developer CV উদাহরণ — একটা navy sidebar accent, নাম আর title, একটা Skills section, আর একটা project bullet সহ Experience section',
    captionEn: 'A finished example — skills up top, one real project described with what it did.',
    captionBn: 'একটা শেষ হওয়া উদাহরণ — উপরে skills, কী করেছে তা বর্ণনা করা একটা real project।' },
  { path: 'career/linkedin-and-your-online-presence', img: PROFILE, insertAt: 1,
    altEn: 'A generic professional online profile mockup — a dark cover band, an avatar circle, a name, a one-line headline, and location with connection count',
    altBn: 'একটা generic professional online profile mockup — একটা গাঢ় cover band, একটা avatar circle, একটা নাম, এক লাইনের headline, আর connection count সহ location',
    captionEn: 'What a filled-in profile looks like — headline says what you do, not just your job title.',
    captionBn: 'একটা fill করা profile দেখতে যেমন — headline বলে আপনি কী করেন, শুধু job title না।' },
  { path: 'marketing/calls-to-action', img: CTA, insertAt: 1,
    altEn: 'A call-to-action section mockup — a teal background, a bold headline, a supporting line, and a single orange "Get Started Free" button',
    altBn: 'একটা call-to-action section mockup — একটা teal background, একটা bold headline, একটা supporting line, আর একটা single orange "Get Started Free" button',
    captionEn: 'One clear headline, one clear button — not three competing offers.',
    captionBn: 'একটা স্পষ্ট headline, একটা স্পষ্ট button — প্রতিযোগিতা করা তিনটা offer না।' },
  { path: 'marketing/writing-emails', img: EMAIL, insertAt: 1,
    altEn: 'A newsletter email mockup — a dark header with a brand name, a greeting, a bold headline, placeholder body lines, an orange call-to-action button, and small unsubscribe text',
    altBn: 'একটা newsletter email mockup — brand নাম সহ একটা গাঢ় header, একটা greeting, একটা bold headline, placeholder body line, একটা orange call-to-action button, আর ছোট unsubscribe text',
    captionEn: 'A finished example — one headline, short body, one button, and the required unsubscribe line.',
    captionBn: 'একটা শেষ হওয়া উদাহরণ — একটা headline, ছোট body, একটা button, আর প্রয়োজনীয় unsubscribe লাইন।' },
  { path: 'marketing/social-content-strategy', img: SOCIAL, insertAt: 1,
    altEn: 'A social media post template mockup — an avatar and username, an image placeholder, a caption line, and a like/comment count row',
    altBn: 'একটা social media post template mockup — একটা avatar আর username, একটা image placeholder, একটা caption লাইন, আর একটা like/comment count row',
    captionEn: 'The anatomy of a post — who posted it, the image, the caption, and the engagement.',
    captionBn: 'একটা post-এর গঠন — কে post করেছে, image, caption, আর engagement।' },
  { path: 'html/forms', img: FORM, insertAt: 3,
    altEn: 'A styled contact form example — a heading, Name and Email text inputs, a Message textarea, and a teal "Send Message" submit button',
    altBn: 'একটা styled contact form উদাহরণ — একটা heading, Name আর Email text input, একটা Message textarea, আর একটা teal "Send Message" submit button',
    captionEn: 'What the markup below actually renders as, once it has some styling.',
    captionBn: 'নিচের markup আসলে কী render করে, কিছু styling পাওয়ার পর।' },
  { path: 'css/navbar', img: NAVBAR, insertAt: 2,
    altEn: 'A navigation bar mockup showing three link states side by side — an active link with an underline, a hovered link with a background pill, and default muted links',
    altBn: 'তিনটা link state পাশাপাশি দেখানো একটা navigation bar mockup — underline সহ একটা active link, background pill সহ একটা hover করা link, আর default muted link',
    captionEn: 'The three states every nav link needs: default, :hover, and active-page.',
    captionBn: 'প্রতিটা nav link-এর প্রয়োজনীয় তিনটা state: default, :hover, আর active-page।' },
  { path: 'css/dropdowns', img: DROPDOWN, insertAt: 2,
    altEn: 'A dropdown menu mockup showing a "Products" trigger open, with a panel of four menu items and one item highlighted as hovered',
    altBn: 'একটা "Products" trigger খোলা দেখানো একটা dropdown menu mockup, চারটা menu item সহ একটা panel আর একটা item hover করা হিসেবে highlight করা',
    captionEn: 'The open state — what the demo below builds toward.',
    captionBn: 'খোলা state — নিচের demo যার দিকে তৈরি করে।' },
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
