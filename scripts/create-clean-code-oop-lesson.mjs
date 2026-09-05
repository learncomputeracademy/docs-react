#!/usr/bin/env node
// Adds one new capstone lesson to "programming": "Writing Code That Lasts —
// Clean Code & Basic OOP". Source: roadmap.sh's Software Design &
// Architecture roadmap PDF (user-supplied 2026-09-03) — only the thin
// beginner-appropriate slice (clean code habits, basic OOP pillars).
// Everything architectural/enterprise (SOLID, GoF/PoSA patterns, DDD,
// microservices, CQRS, event sourcing, enterprise patterns) judged out of
// scope — see D-128 in DECISIONS.md.
//
// Appended at the end of the category (sort_order 20, after
// boolean-algebra) — no reshuffle needed.
//
// Usage: node scripts/create-clean-code-oop-lesson.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
const DRY_RUN = process.argv.includes('--dry-run')

function h(level, text, anchor) { const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'); return { id: nanoid(12), type: 'heading', level, text, anchor: a } }
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function code(language, codeText) { return { id: nanoid(12), type: 'code', language, code: codeText.trim() } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function table(header, rows, caption) { return { id: nanoid(12), type: 'table', header, rows, caption } }
function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }
function ul(items) { return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>` }

const lesson = {
  slug: 'clean-code-and-basic-oop',
  sortOrder: 20,
  en: {
    title: 'Writing Code That Lasts — Clean Code & Basic OOP',
    metaTitle: 'Writing Code That Lasts — Clean Code & Basic OOP | Learn Computer Academy',
    metaDescription: 'Clean code habits every beginner should build early — meaningful names, small functions, DRY, YAGNI — plus the four core ideas of object-oriented programming, explained simply.',
    blocks: [
      p('<p>Everything so far has been about making code <i>work</i>. This lesson is about something just as important: making code that other people — including future you — can still understand six months later.</p>'),
      p('<p>Code you write once and never touch again can be messy and it won\'t matter. Real programs get read, changed, and debugged far more often than they get written the first time. A little discipline now saves a lot of confusion later.</p>'),

      h(2, 'Clean Code Habits'),
      p('<p>None of these require new syntax — they\'re just habits.</p>'),
      table(
        ['Habit', 'Why it matters'],
        [
          ['Meaningful names over comments', 'A variable named <code>daysUntilExpiry</code> explains itself. A variable named <code>d</code> with a comment next to it can drift out of sync with the comment — the name never can.'],
          ['Keep functions small', 'A function that does one clear thing is easy to test, reuse, and reason about. A function doing five things is really five functions wearing a trench coat.'],
          ['Be consistent', 'Pick one naming style and one indentation style and stick to it throughout a project — consistency makes code predictable to read even in parts you\'ve never seen before.'],
          ['DRY — Don\'t Repeat Yourself', 'If the same logic is copy-pasted in three places, a bug fix has to happen in three places too, and it\'s easy to miss one.'],
          ['YAGNI — You Aren\'t Gonna Need It', 'Don\'t build flexibility or features for a future that might never come — it adds complexity today for a maybe that may never happen.'],
        ]
      ),
      p('<p>Compare these two versions of the same idea:</p>'),
      code('javascript', `// Hard to follow
function calc(a, b, t) {
  return t === 1 ? a + b : a - b;
}

// Clean
function combineAmounts(amountA, amountB, operation) {
  return operation === 'add'
    ? amountA + amountB
    : amountA - amountB;
}`),
      p('<p>Same logic, same length — but the second version tells you what it does without needing a comment.</p>'),

      h(2, 'What Is Object-Oriented Programming?'),
      p('<p><b>Object-oriented programming (OOP)</b> is a way of organising code around "objects" — bundles of related data and the functions that work on that data — instead of writing one long list of steps. Most modern languages (JavaScript, Python, Java, C#) support it.</p>'),
      p('<p>Think of a <code>Car</code> object: it has data (color, speed, fuel level) and behaviour (accelerate, brake, refuel) bundled together, instead of that data floating around loose and a pile of separate functions operating on it from a distance.</p>'),

      h(2, 'The Four Core Ideas'),
      table(
        ['Idea', 'What it means'],
        [
          ['Encapsulation', 'Bundling an object\'s data with the functions that operate on it, and hiding the internal details other code doesn\'t need to see.'],
          ['Abstraction', 'Exposing only what\'s necessary to use something, hiding how it works underneath — you can drive a car without knowing how the engine is built.'],
          ['Inheritance', 'A new object type can reuse and extend an existing one — a <code>SportsCar</code> can inherit everything a <code>Car</code> already has, and add its own extras.'],
          ['Polymorphism', 'Different object types can respond to the same instruction in their own way — <code>car.makeSound()</code> and <code>truck.makeSound()</code> both exist, but do different things.'],
        ]
      ),
      code('javascript', `class Car {
  constructor(brand) {
    this.brand = brand;
    this.speed = 0;
  }
  accelerate() {
    this.speed += 10;
  }
}

class SportsCar extends Car {  // inheritance
  accelerate() {                // polymorphism — its own version
    this.speed += 25;
  }
}

const civic = new Car('Honda');
const ferrari = new SportsCar('Ferrari');
civic.accelerate();
ferrari.accelerate();
console.log(civic.speed, ferrari.speed); // 10, 25`),
      callout('note', '<p>You don\'t need to master OOP to be productive — plenty of real, working code is written without classes at all. But recognising these four words when they come up (in a job interview, in another language\'s documentation, in a codebase you join) is worth having early.</p>', 'You Don\'t Need to Use This Everywhere'),

      h(2, 'Where This Leaves You'),
      p('<p>Clean code habits and basic OOP won\'t make a program run any differently — the computer doesn\'t care about your variable names. They make a difference to the next person reading the code, who is very often you.</p>')
    ],
  },
  bn: {
    title: 'টেকসই কোড লেখা — ক্লিন কোড আর বেসিক OOP',
    metaTitle: 'টেকসই কোড লেখা — ক্লিন কোড আর বেসিক OOP | Learn Computer Academy',
    metaDescription: 'প্রতিটি শিক্ষানবিশের প্রথম দিকেই গড়ে তোলা উচিত এমন ক্লিন কোড অভ্যাস — অর্থবহ নাম, ছোট ফাংশন, DRY, YAGNI — সাথে অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিংয়ের চারটি মূল ধারণা, সহজভাবে ব্যাখ্যা করা।',
    blocks: [
      p('<p>এতক্ষণ সবকিছু ছিল কোড <i>কাজ করানো</i> নিয়ে। এই পাঠ ঠিক ততটাই গুরুত্বপূর্ণ একটি বিষয় নিয়ে: এমন কোড তৈরি করা যা অন্যরা — আর ছয় মাস পরের আপনি নিজেও — এখনও বুঝতে পারে।</p>'),
      p('<p>যে কোড একবার লিখে আর কখনো ছোঁয়া হয় না তা এলোমেলো হলেও কিছু আসে যায় না। বাস্তব প্রোগ্রাম প্রথমবার লেখার চেয়ে অনেক বেশিবার পড়া, পরিবর্তন করা, আর ডিবাগ করা হয়। এখন সামান্য শৃঙ্খলা পরে অনেক বিভ্রান্তি বাঁচায়।</p>'),

      h(2, 'ক্লিন কোড অভ্যাস', 'clean-code-habits'),
      p('<p>এগুলোর কোনোটার জন্যই নতুন সিনট্যাক্স লাগে না — এগুলো শুধু অভ্যাস।</p>'),
      table(
        ['অভ্যাস', 'কেন গুরুত্বপূর্ণ'],
        [
          ['কমেন্টের চেয়ে অর্থবহ নাম', '<code>daysUntilExpiry</code> নামের একটি ভেরিয়েবল নিজেই নিজেকে ব্যাখ্যা করে। <code>d</code> নামের একটি ভেরিয়েবল পাশে কমেন্ট থাকলেও কমেন্টের সাথে অসামঞ্জস্যপূর্ণ হয়ে যেতে পারে — নাম কখনো পারে না।'],
          ['ফাংশন ছোট রাখুন', 'একটি স্পষ্ট কাজ করা ফাংশন টেস্ট করা, পুনরায় ব্যবহার করা, আর বোঝা সহজ। পাঁচটি কাজ করা একটি ফাংশন আসলে পাঁচটি ফাংশন এক কোটের ভেতরে লুকিয়ে।'],
          ['সামঞ্জস্যপূর্ণ থাকুন', 'একটি নামকরণ স্টাইল আর একটি ইনডেন্টেশন স্টাইল বেছে নিয়ে পুরো প্রোজেক্ট জুড়ে সেটা মেনে চলুন — সামঞ্জস্যতা কোডকে পূর্বাভাসযোগ্য করে তোলে, এমনকি এমন অংশেও যা আপনি আগে কখনো দেখেননি।'],
          ['DRY — নিজেকে পুনরাবৃত্তি করবেন না', 'একই লজিক তিন জায়গায় কপি-পেস্ট করা থাকলে, একটি বাগ ঠিক করতে তিন জায়গায়ই করতে হয়, আর একটা মিস হওয়া সহজ।'],
          ['YAGNI — এটা আপনার লাগবে না', 'হয়তো কখনো না আসা এক ভবিষ্যতের জন্য নমনীয়তা বা ফিচার তৈরি করবেন না — এটা আজ জটিলতা যোগ করে এমন একটা "হয়তো"-র জন্য যা কখনো নাও ঘটতে পারে।'],
        ]
      ),
      p('<p>একই ধারণার এই দুটি ভার্সন তুলনা করুন:</p>'),
      code('javascript', `// অনুসরণ করা কঠিন
function calc(a, b, t) {
  return t === 1 ? a + b : a - b;
}

// পরিষ্কার
function combineAmounts(amountA, amountB, operation) {
  return operation === 'add'
    ? amountA + amountB
    : amountA - amountB;
}`),
      p('<p>একই লজিক, একই দৈর্ঘ্য — কিন্তু দ্বিতীয় ভার্সন কোনো কমেন্ট ছাড়াই বলে দেয় এটা কী করে।</p>'),

      h(2, 'অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং কী?', 'what-is-object-oriented-programming'),
      p('<p><b>অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং (OOP)</b> হলো একটি লম্বা ধাপের তালিকা লেখার বদলে "অবজেক্ট" — সম্পর্কিত ডেটা আর সেই ডেটার উপর কাজ করা ফাংশনের বান্ডেল — এর চারপাশে কোড সংগঠিত করার একটি উপায়। বেশিরভাগ আধুনিক ভাষা (JavaScript, Python, Java, C#) এটি সমর্থন করে।</p>'),
      p('<p>একটা <code>Car</code> অবজেক্ট ভাবুন: এর ডেটা (রং, গতি, জ্বালানির পরিমাণ) আর আচরণ (গতি বাড়ানো, ব্রেক করা, জ্বালানি ভরা) একসাথে বান্ডেল করা, ডেটা আলাদাভাবে ভাসতে থাকা আর দূর থেকে একগাদা আলাদা ফাংশন সেটার উপর কাজ করার বদলে।</p>'),

      h(2, 'চারটি মূল ধারণা', 'the-four-core-ideas'),
      table(
        ['ধারণা', 'এর অর্থ কী'],
        [
          ['এনক্যাপসুলেশন', 'একটা অবজেক্টের ডেটা তার উপর কাজ করা ফাংশনের সাথে বান্ডেল করা, আর অন্য কোডের দেখার দরকার নেই এমন অভ্যন্তরীণ বিবরণ লুকিয়ে রাখা।'],
          ['অ্যাবস্ট্রাকশন', 'কিছু ব্যবহার করার জন্য শুধু যা দরকার তা প্রকাশ করা, ভেতরে এটা কীভাবে কাজ করে তা লুকিয়ে রাখা — ইঞ্জিন কীভাবে তৈরি তা না জেনেই আপনি একটা গাড়ি চালাতে পারেন।'],
          ['ইনহেরিটেন্স', 'একটা নতুন অবজেক্ট টাইপ একটা বিদ্যমান টাইপ পুনরায় ব্যবহার আর সম্প্রসারিত করতে পারে — একটা <code>SportsCar</code> একটা <code>Car</code>-এর সবকিছু ইনহেরিট করতে পারে, আর নিজের অতিরিক্ত কিছু যোগ করতে পারে।'],
          ['পলিমরফিজম', 'ভিন্ন অবজেক্ট টাইপ একই নির্দেশনায় নিজের মতো করে সাড়া দিতে পারে — <code>car.makeSound()</code> আর <code>truck.makeSound()</code> দুটোই আছে, কিন্তু ভিন্ন কাজ করে।'],
        ]
      ),
      code('javascript', `class Car {
  constructor(brand) {
    this.brand = brand;
    this.speed = 0;
  }
  accelerate() {
    this.speed += 10;
  }
}

class SportsCar extends Car {  // inheritance
  accelerate() {                // polymorphism — নিজস্ব ভার্সন
    this.speed += 25;
  }
}

const civic = new Car('Honda');
const ferrari = new SportsCar('Ferrari');
civic.accelerate();
ferrari.accelerate();
console.log(civic.speed, ferrari.speed); // 10, 25`),
      callout('note', '<p>প্রোডাক্টিভ হতে OOP আয়ত্ত করার দরকার নেই — অনেক বাস্তব, কার্যকর কোড ক্লাস ছাড়াই লেখা হয়। কিন্তু এই চারটি শব্দ যখন আসে (একটা চাকরির ইন্টারভিউতে, অন্য একটা ভাষার ডকুমেন্টেশনে, আপনি যোগ দেওয়া একটা কোডবেসে) তখন চিনতে পারা প্রথম দিকেই জানার মতো।</p>', 'এটা সবসময় ব্যবহার করার দরকার নেই'),

      h(2, 'এরপর কোথায়', 'where-this-leaves-you'),
      p('<p>ক্লিন কোড অভ্যাস আর বেসিক OOP একটা প্রোগ্রাম ভিন্নভাবে চালাবে না — কম্পিউটার আপনার ভেরিয়েবলের নাম নিয়ে চিন্তা করে না। এগুলো পার্থক্য তৈরি করে পরের ব্যক্তির জন্য যে কোডটা পড়বে, যে প্রায়ই আসলে আপনি নিজেই।</p>')
    ],
  },
}

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'programming').single()
  if (catErr || !category) { console.error('Category "programming" not found.'); process.exit(1) }

  console.log(`Category id: ${category.id}`)
  if (DRY_RUN) {
    console.log(`  [en] programming/${lesson.slug} — ${lesson.en.title} (${lesson.en.blocks.length} blocks, sort_order ${lesson.sortOrder})`)
    console.log(`  [bn] programming/${lesson.slug} — ${lesson.bn.title} (${lesson.bn.blocks.length} blocks)`)
    console.log('\n[dry-run] no writes made.')
    return
  }

  const path = `programming/${lesson.slug}`
  const row = {
    category_id: category.id, slug: lesson.slug, path, old_path: null,
    title: lesson.en.title, meta_title: lesson.en.metaTitle, meta_description: lesson.en.metaDescription,
    blocks: lesson.en.blocks, toc: toc(lesson.en.blocks), status: 'published',
    sort_order: lesson.sortOrder, published_at: new Date().toISOString(),
  }
  const { data: existing } = await supabase.from('docs').select('id').eq('path', path).maybeSingle()
  let docId = existing?.id
  if (docId) {
    const { error } = await supabase.from('docs').update(row).eq('id', docId)
    if (error) { console.error('en update failed:', error.message); process.exit(1) }
  } else {
    const { data: inserted, error } = await supabase.from('docs').insert(row).select('id').single()
    if (error) { console.error('en insert failed:', error.message); process.exit(1) }
    docId = inserted.id
  }
  console.log(`  ✓ en  ${path}`)

  const trRow = {
    doc_id: docId, locale: 'bn', title: lesson.bn.title, meta_title: lesson.bn.metaTitle,
    meta_description: lesson.bn.metaDescription, blocks: lesson.bn.blocks, toc: toc(lesson.bn.blocks),
  }
  const { data: existingTr } = await supabase.from('doc_translations').select('doc_id').eq('doc_id', docId).eq('locale', 'bn').maybeSingle()
  const { error: trErr } = existingTr
    ? await supabase.from('doc_translations').update(trRow).eq('doc_id', docId).eq('locale', 'bn')
    : await supabase.from('doc_translations').insert(trRow)
  if (trErr) { console.error('bn failed:', trErr.message); process.exit(1) }
  console.log(`  ✓ bn  ${path}`)
  console.log('\n✅ Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
