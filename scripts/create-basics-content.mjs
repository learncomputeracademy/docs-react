#!/usr/bin/env node
// Rewrites the "Computer Basics" category as real, separate lessons.
// Previously this category held ONE doc (basics/computer-fundamentals,
// 104 blocks, 16 chapters stacked via headings) — replaced here by one doc
// per chapter, per docs/CONTENT-PIPELINE.md and the outline approved with
// the site owner 2026-07-28.
//
// Original content — universal computing concepts, not anyone's
// proprietary text, written fresh for this site (docs/CONTENT-PIPELINE.md
// §3: never copied from W3Schools/GeeksforGeeks/Wikipedia/etc).
//
// Run incrementally as each lesson is written and approved — this file
// grows to 16 lessons over several runs, not all at once. Idempotent:
// re-running is always safe, upserts on `path` / `doc_id,locale`.
//
// The old single-page doc is left untouched until every replacement
// lesson exists — deleting it (soft-delete, D-... TBD) plus the 301
// redirect to /basics/what-is-a-computer is a separate, final step once
// the full outline is done, not part of any individual lesson run.
//
// Usage: node scripts/create-basics-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Block builders (English) ────────────────────────────────────────────

function h(level, text, anchor) {
  const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor: a }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }
function img(publicId, alt, width, height, caption) { return { id: nanoid(12), type: 'image', publicId, alt, width, height, caption } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// ── Lessons ──────────────────────────────────────────────────────────────

const lessons = []

lessons.push({
  slug: 'what-is-a-computer',
  sortOrder: 1,
  en: {
    title: 'What Is a Computer?',
    metaTitle: 'What Is a Computer? | Learn Computer Academy',
    metaDescription: 'A beginner-friendly introduction to what a computer actually is, the four basic operations every computer performs, and why computers are called general-purpose machines.',
    blocks: [
      p('<p>A <b>computer</b> is a machine that takes in information, follows a set of instructions to work with that information, and produces a result. That’s it — everything else you’ll learn about computers, from the phone in your pocket to the servers running a website, builds on this one idea.</p>'),

      h(2, 'What Makes Something a Computer?'),
      p('<p>You might picture a desktop PC when you hear the word "computer," but the real definition is broader. A computer is any device that can accept <b>input</b>, process it according to a set of stored instructions (called a <b>program</b>), and produce <b>output</b> — automatically, and without a human redoing the work by hand each time.</p>'),
      p('<p>A calculator can do arithmetic, but it can only do arithmetic — you can’t teach it to do something new. A computer, on the other hand, can be given a completely different program and do a completely different job. That difference — the ability to run different programs — is what separates a computer from every other machine.</p>'),

      h(2, 'The Four Basic Operations'),
      p('<p>Every computer, no matter how simple or powerful, is built around four basic operations:</p>'),
      table(
        ['Operation', 'What it means', 'Example'],
        [
          ['Input', 'Getting information into the computer', 'Typing on a keyboard, clicking a mouse, scanning a barcode'],
          ['Process', 'Working with that information according to instructions', 'Calculating a total, checking a password, resizing a photo'],
          ['Output', 'Sending a result back out so a person can use it', 'Text appearing on a screen, a document printing, a song playing'],
          ['Storage', 'Keeping information for later, even after the power is off', 'Saving a file, remembering your saved passwords'],
        ]
      ),
      img(
        'docs/img/basics/what-is-a-computer-1',
        'Diagram showing the four basic computer operations — input, process, output, and storage — arranged in a circular cycle',
        1024, 768,
        'Input, process, output, and storage are the four operations every computer performs, in this order.'
      ),

      h(2, 'Computers Are General-Purpose Machines'),
      p('<p>This is the single most important idea in this whole section: a computer is a <b>general-purpose</b> machine. The exact same hardware that plays a video can also add up a spreadsheet, edit a photo, or run a game — because what the computer actually does is entirely decided by which program is currently running, not by anything physically different inside the machine.</p>'),
      p('<p>This is why installing new software can make an old computer do something it has never done before, without a single physical part being added or changed. You are not changing the computer — you are changing its instructions.</p>'),

      h(2, 'Where You Already Use Computers'),
      p('<p>Once you know what to look for, computers turn out to be almost everywhere, not just on a desk:</p><ul><li>The <b>smartphone</b> in your pocket is a computer that happens to also make phone calls.</li><li>A <b>smart TV</b>, a <b>washing machine</b> with a digital display, and a modern <b>car’s dashboard</b> all contain small computers running their own programs.</li><li>An <b>ATM</b> takes input (your card and PIN), processes it (checks your balance), and produces output (your cash and a receipt) — exactly the same four-step cycle described above.</li></ul>'),

      callout('tip', '<p>You do not need to understand how a processor works at the chip level to use a computer well, or even to become good at it. Understanding the ideas in this section — input, process, output, storage, and "general-purpose" — is what actually makes the rest of computing make sense, and that’s exactly what the lessons that follow build on.</p>', 'You don’t need to be an engineer to start'),

      h(2, 'What This Section Covers'),
      p('<p>The rest of Computer Basics walks through each piece of this picture in order: how computers have changed over time, the physical hardware inside one, how it remembers and stores information, how it "thinks" using nothing but two digits, the software that tells it what to do, and how millions of computers talk to each other over a network — including the one you’re using to read this page.</p>'),
    ],
  },
  bn: {
    title: 'কম্পিউটার কী?',
    metaTitle: 'কম্পিউটার কী? | Learn Computer Academy',
    metaDescription: 'কম্পিউটার আসলে কী, প্রতিটি কম্পিউটার যে চারটি মৌলিক কাজ করে তার একটি সহজবোধ্য পরিচিতি, আর কেন কম্পিউটারকে জেনারেল-পারপাস যন্ত্র বলা হয়।',
    blocks: [
      p('<p><b>কম্পিউটার</b> এমন একটি যন্ত্র যা তথ্য গ্রহণ করে (ইনপুট), একটি নির্দিষ্ট নির্দেশাবলী অনুসরণ করে সেই তথ্য নিয়ে কাজ করে (প্রসেস), আর একটি ফলাফল তৈরি করে (আউটপুট)। ব্যাস, এটুকুই — আপনার পকেটের ফোন থেকে শুরু করে একটি ওয়েবসাইট চালানো সার্ভার পর্যন্ত, কম্পিউটার সম্পর্কে আপনি যা কিছু শিখবেন, সবকিছুরই ভিত্তি এই একটি ধারণা।</p>'),

      h(2, 'কোন জিনিস একটি কম্পিউটারকে কম্পিউটার বানায়?', 'what-makes-something-a-computer'),
      p('<p>"কম্পিউটার" শব্দটি শুনলে হয়তো আপনার মনে একটি ডেস্কটপ পিসি-র ছবি ভেসে ওঠে, কিন্তু আসল সংজ্ঞাটা এর চেয়ে অনেক বড়। কম্পিউটার এমন যেকোনো যন্ত্র যা <b>ইনপুট</b> গ্রহণ করতে পারে, একটি সংরক্ষিত নির্দেশাবলীর সেট (যাকে বলা হয় <b>প্রোগ্রাম</b>) অনুযায়ী সেটি প্রসেস করতে পারে, আর <b>আউটপুট</b> তৈরি করতে পারে — সম্পূর্ণ স্বয়ংক্রিয়ভাবে, প্রতিবার মানুষকে হাতে করে কাজটা আবার করতে না হয়েই।</p>'),
      p('<p>একটি ক্যালকুলেটর অঙ্ক কষতে পারে, কিন্তু শুধু অঙ্কই কষতে পারে — আপনি একে নতুন কিছু শেখাতে পারবেন না। অন্যদিকে একটি কম্পিউটারকে সম্পূর্ণ ভিন্ন একটি প্রোগ্রাম দিলে সেটি সম্পূর্ণ ভিন্ন একটি কাজ করতে পারে। ভিন্ন ভিন্ন প্রোগ্রাম চালাতে পারার এই ক্ষমতাই কম্পিউটারকে অন্য সব যন্ত্র থেকে আলাদা করে।</p>'),

      h(2, 'চারটি মৌলিক কাজ', 'the-four-basic-operations'),
      p('<p>প্রতিটি কম্পিউটার, তা যত সাধারণ বা শক্তিশালীই হোক না কেন, এই চারটি মৌলিক কাজের উপর ভিত্তি করে তৈরি:</p>'),
      table(
        ['কাজ', 'এর মানে কী', 'উদাহরণ'],
        [
          ['ইনপুট', 'কম্পিউটারে তথ্য প্রবেশ করানো', 'কীবোর্ডে টাইপ করা, মাউস ক্লিক করা, বারকোড স্ক্যান করা'],
          ['প্রসেস', 'নির্দেশাবলী অনুযায়ী সেই তথ্য নিয়ে কাজ করা', 'যোগফল হিসাব করা, পাসওয়ার্ড যাচাই করা, ছবির মাপ বদলানো'],
          ['আউটপুট', 'একজন মানুষ ব্যবহার করতে পারে এমনভাবে ফলাফল বের করে দেওয়া', 'স্ক্রিনে টেক্সট দেখানো, একটি ডকুমেন্ট প্রিন্ট হওয়া, গান বাজা'],
          ['স্টোরেজ', 'পাওয়ার বন্ধ হয়ে গেলেও তথ্য পরে ব্যবহারের জন্য জমিয়ে রাখা', 'একটি ফাইল সেভ করা, সেভ করা পাসওয়ার্ড মনে রাখা'],
        ]
      ),
      img(
        'docs/img/basics/what-is-a-computer-1',
        'চারটি মৌলিক কম্পিউটার কাজ — ইনপুট, প্রসেস, আউটপুট, আর স্টোরেজ — একটি চক্রাকারে দেখানো ডায়াগ্রাম',
        1024, 768,
        'ইনপুট, প্রসেস, আউটপুট, আর স্টোরেজ — এই ক্রমেই প্রতিটি কম্পিউটার এই চারটি কাজ করে।'
      ),

      h(2, 'কম্পিউটার একটি জেনারেল-পারপাস যন্ত্র', 'computers-are-general-purpose-machines'),
      p('<p>এই পুরো অংশের সবচেয়ে গুরুত্বপূর্ণ ধারণাটি এটাই: কম্পিউটার একটি <b>জেনারেল-পারপাস</b> (সাধারণ-উদ্দেশ্য) যন্ত্র। যে হার্ডওয়্যার দিয়ে একটি ভিডিও চলে, সেই একই হার্ডওয়্যার দিয়ে একটি স্প্রেডশিট যোগ করা, একটি ছবি এডিট করা, বা একটি গেম চালানোও সম্ভব — কারণ কম্পিউটার আসলে কী করছে তা পুরোপুরি নির্ভর করে তখন কোন প্রোগ্রাম চলছে তার উপর, যন্ত্রের ভেতরে শারীরিকভাবে ভিন্ন কিছু আছে কি না তার উপর নয়।</p>'),
      p('<p>এই কারণেই নতুন সফটওয়্যার ইনস্টল করলে একটি পুরনো কম্পিউটারও এমন কিছু করতে পারে যা সে আগে কখনো করেনি — কম্পিউটারের একটিও শারীরিক অংশ যোগ বা পরিবর্তন না করেই। আপনি কম্পিউটারটা বদলাচ্ছেন না — আপনি তার নির্দেশাবলী বদলাচ্ছেন।</p>'),

      h(2, 'যেখানে আপনি ইতিমধ্যেই কম্পিউটার ব্যবহার করছেন', 'where-you-already-use-computers'),
      p('<p>কোথায় খুঁজতে হবে জানা থাকলে দেখবেন কম্পিউটার প্রায় সব জায়গাতেই আছে, শুধু ডেস্কে নয়:</p><ul><li>আপনার পকেটের <b>স্মার্টফোন</b>টিও একটি কম্পিউটার, যেটি পাশাপাশি ফোন কলও করতে পারে।</li><li>একটি <b>স্মার্ট টিভি</b>, ডিজিটাল ডিসপ্লে-যুক্ত একটি <b>ওয়াশিং মেশিন</b>, আর আধুনিক <b>গাড়ির ড্যাশবোর্ড</b> — এদের সবগুলোর ভেতরেই ছোট ছোট কম্পিউটার নিজস্ব প্রোগ্রাম চালাচ্ছে।</li><li>একটি <b>ATM</b> ইনপুট নেয় (আপনার কার্ড আর PIN), সেটি প্রসেস করে (আপনার ব্যালেন্স যাচাই করে), আর আউটপুট দেয় (আপনার টাকা আর একটি রসিদ) — উপরে বলা সেই একই চার-ধাপের চক্র।</li></ul>'),

      callout('tip', '<p>একটি প্রসেসর চিপ-স্তরে কীভাবে কাজ করে তা বোঝার দরকার নেই কম্পিউটার ভালোভাবে ব্যবহার করতে, এমনকি এতে দক্ষ হয়ে উঠতেও। এই অংশের ধারণাগুলো — ইনপুট, প্রসেস, আউটপুট, স্টোরেজ, আর "জেনারেল-পারপাস" — বোঝাই আসলে বাকি সবকিছুকে বোধগম্য করে তোলে, আর পরবর্তী পাঠগুলো ঠিক এর উপরেই গড়ে উঠবে।</p>', 'ইঞ্জিনিয়ার হতে হবে না শুরু করতে'),

      h(2, 'এই অংশে যা যা থাকবে', 'what-this-section-covers'),
      p('<p>Computer Basics-এর বাকি পাঠগুলো এই পুরো ছবিটার প্রতিটি অংশ ক্রমানুসারে দেখাবে: সময়ের সাথে কম্পিউটার কীভাবে বদলেছে, একটির ভেতরের শারীরিক হার্ডওয়্যার কেমন, এটি কীভাবে তথ্য মনে রাখে আর জমিয়ে রাখে, মাত্র দুটি সংখ্যা দিয়ে এটি কীভাবে "চিন্তা" করে, কোন সফটওয়্যার একে কী করতে হবে বলে দেয়, আর লক্ষ লক্ষ কম্পিউটার কীভাবে নেটওয়ার্কের মাধ্যমে একে অপরের সাথে কথা বলে — এই পাতাটি পড়ার জন্য আপনি এখন যেটি ব্যবহার করছেন, সেটি সহ।</p>'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'basics').single()
  if (catErr || !category) {
    console.error('Category "basics" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] basics/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] basics/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `basics/${lesson.slug}`
    const row = {
      category_id: category.id,
      slug: lesson.slug,
      path,
      old_path: null,
      title: lesson.en.title,
      meta_title: lesson.en.metaTitle,
      meta_description: lesson.en.metaDescription,
      blocks: lesson.en.blocks,
      toc: toc(lesson.en.blocks),
      status: 'published',
      sort_order: lesson.sortOrder,
      published_at: new Date().toISOString(),
    }

    // No unique constraint on docs.path to target with .upsert()'s
    // onConflict — select-then-insert/update instead, which is idempotent
    // regardless of what constraints do or don't exist.
    const { data: existing } = await supabase.from('docs').select('id').eq('path', path).maybeSingle()
    let docId = existing?.id
    if (docId) {
      const { error: docErr } = await supabase.from('docs').update(row).eq('id', docId)
      if (docErr) { console.error(`Failed ${lesson.slug} (en update):`, docErr.message); continue }
    } else {
      const { data: inserted, error: docErr } = await supabase.from('docs').insert(row).select('id').single()
      if (docErr) { console.error(`Failed ${lesson.slug} (en insert):`, docErr.message); continue }
      docId = inserted.id
    }
    console.log(`  ✓ en  ${path}`)

    const trRow = {
      doc_id: docId,
      locale: 'bn',
      title: lesson.bn.title,
      meta_title: lesson.bn.metaTitle,
      meta_description: lesson.bn.metaDescription,
      blocks: lesson.bn.blocks,
      toc: toc(lesson.bn.blocks),
    }
    const { data: existingTr } = await supabase.from('doc_translations').select('doc_id').eq('doc_id', docId).eq('locale', 'bn').maybeSingle()
    const { error: trErr } = existingTr
      ? await supabase.from('doc_translations').update(trRow).eq('doc_id', docId).eq('locale', 'bn')
      : await supabase.from('doc_translations').insert(trRow)
    if (trErr) { console.error(`Failed ${lesson.slug} (bn):`, trErr.message); continue }
    console.log(`  ✓ bn  ${path}`)
  }

  console.log(`\n✅ Done.`)
}

main().catch(err => { console.error(err); process.exit(1) })
