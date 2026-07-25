#!/usr/bin/env node
// Bengali pilot: 3 lessons (intro, variables, data-types) from the new
// Programming category — first slice for the user's quality/tone review
// before continuing category-by-category, per D-16's chosen pace.
//
// Rules applied: prose translated, code blocks byte-identical to English
// (syntax untouched), inline <code> spans inside richtext/table cells left
// as-is, anchors identical to the English toc/heading anchors so deep
// links and scroll-to work the same in both languages. Example data inside
// code (string literals like "Ada", "apple") kept in English — it's part
// of the code example, not prose, and keeping it consistent across
// languages helps a student cross-reference the English version.
import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const raw = fs.readFileSync('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const source = JSON.parse(fs.readFileSync('scripts/reports/pilot-source.json', 'utf8'))
const byPath = Object.fromEntries(source.map(d => [d.path, d]))

// ── programming/intro ────────────────────────────────────────────────────

const introEn = byPath['programming/intro']
const introBn = {
  title: 'প্রোগ্রামিং কী?',
  meta_title: 'প্রোগ্রামিং কী? | Learn Computer Academy',
  meta_description: null,
  blocks: [
    { ...introEn.blocks[0], html: '<p>প্রোগ্রামিং হলো কম্পিউটারকে নির্দেশ দেওয়ার পদ্ধতি। কম্পিউটার ইংরেজি বোঝে না, আপনার উদ্দেশ্যও বোঝে না, বা আপনি "কী বোঝাতে চেয়েছেন" তাও বোঝে না — এটি শুধু এমন ভাষায় লেখা সুনির্দিষ্ট, স্পষ্ট ধাপগুলো অনুসরণ করে যা সে প্রক্রিয়া করতে পারে। প্রোগ্রামিং হলো একটি সমস্যাকে সেই ধাপগুলোতে ভেঙে ফেলার দক্ষতা।</p>' },
    { ...introEn.blocks[1], text: 'কেন প্রোগ্রামিং শিখবেন?' },
    { ...introEn.blocks[2], html: '<p>আপনি যে অ্যাপ, ওয়েবসাইট বা সফটওয়্যার ব্যবহার করেন, তার প্রতিটিই কারও লেখা কোডের উপর চলে। প্রোগ্রামিং শিখলে আপনি শুধু টুল ব্যবহার না করে নিজেই টুল তৈরি করতে পারবেন — পুনরাবৃত্তিমূলক কাজ স্বয়ংক্রিয় করা, ওয়েবসাইট তৈরি করা, ডেটা বিশ্লেষণ করা, অথবা গেম বানানো। এটি চিন্তাভাবনার একটি পদ্ধতিও বটে: বড়, অস্পষ্ট সমস্যাকে ছোট, সুনির্দিষ্ট অংশে ভাগ করা কম্পিউটারের বাইরেও কাজে লাগে।</p>' },
    { ...introEn.blocks[3], text: 'কোড আসলে দেখতে কেমন?' },
    { ...introEn.blocks[4], html: '<p>এখানে একটি ছোট, সম্পূর্ণ প্রোগ্রাম দেওয়া হলো। এখনই প্রতিটি শব্দ বোঝার জন্য চিন্তা করবেন না — এর প্রতিটি অংশ পরবর্তী পাঠগুলোতে বিস্তারিতভাবে আলোচনা করা হয়েছে।</p>' },
    introEn.blocks[5], // code — unchanged
    { ...introEn.blocks[6], html: '<p>এই প্রোগ্রামটি দুটি তথ্য সংরক্ষণ করে (একটি নাম এবং একটি বয়স), বয়সের উপর ভিত্তি করে একটি সিদ্ধান্ত নেয়, এবং একটি বার্তা প্রিন্ট করে। তথ্য সংরক্ষণ করা, সিদ্ধান্ত নেওয়া এবং কাজ পুনরাবৃত্তি করা — প্রায় প্রতিটি প্রোগ্রাম এই তিনটি ধারণার উপর ভিত্তি করে তৈরি।</p>' },
    { ...introEn.blocks[7], text: 'এই সেকশনটি যেভাবে সাজানো হয়েছে' },
    { ...introEn.blocks[8], html: '<p>প্রতিটি পাঠে একটি করে বিল্ডিং ব্লক আলোচনা করা হয়েছে — ভেরিয়েবল, ডেটা টাইপ, লুপ, ফাংশন ইত্যাদি — সাথে JavaScript-এ রান করার মতো উদাহরণ। এই ধারণাগুলো শুধু JavaScript-এর জন্য নির্দিষ্ট নয়; একবার আপনি বুঝে গেলে "লুপ" বা "ফাংশন" কী, তাহলে যেকোনো প্রোগ্রামিং ভাষাতেই একই ধারণা চিনতে পারবেন।</p>' },
    { ...introEn.blocks[9], title: 'কোনো সেটআপ প্রয়োজন নেই', html: '<p>এই কোর্স অনুসরণ করতে আপনার কিছুই ইনস্টল করার দরকার নেই। এই সাইটের প্রতিটি কোড উদাহরণ পাতার মধ্যেই এডিট করে সরাসরি রান করা যায়।</p>' },
  ],
  toc: [
    { id: 'why-learn-to-program', text: 'কেন প্রোগ্রামিং শিখবেন?', level: 2 },
    { id: 'what-does-code-actually-look-like', text: 'কোড আসলে দেখতে কেমন?', level: 2 },
    { id: 'how-this-section-is-organized', text: 'এই সেকশনটি যেভাবে সাজানো হয়েছে', level: 2 },
  ],
}

// ── programming/variables ────────────────────────────────────────────────

const varsEn = byPath['programming/variables']
const varsBn = {
  title: 'ভেরিয়েবল',
  meta_title: 'ভেরিয়েবল | Learn Computer Academy',
  meta_description: null,
  blocks: [
    { ...varsEn.blocks[0], html: '<p>ভেরিয়েবল হলো একটি মানের জন্য নামযুক্ত একটি ধারক (container)। আপনার কোডের সব জায়গায় বারবার ২৫ সংখ্যাটি না লিখে, আপনি এটি একবার একটি ভেরিয়েবলে সংরক্ষণ করে নামের মাধ্যমে ব্যবহার করতে পারেন — এতে কোড পড়া এবং পরিবর্তন করা, দুটোই সহজ হয়।</p>' },
    { ...varsEn.blocks[1], text: 'ভেরিয়েবল ডিক্লেয়ার করা' },
    { ...varsEn.blocks[2], html: '<p>JavaScript-এ, আপনি <code>let</code> দিয়ে একটি ভেরিয়েবল ডিক্লেয়ার করেন এবং <code>=</code> চিহ্ন দিয়ে এটিকে একটি মান দেন:</p>' },
    varsEn.blocks[3], // code — unchanged
    { ...varsEn.blocks[4], text: 'ভেরিয়েবলের মান পরিবর্তন হতে পারে' },
    { ...varsEn.blocks[5], html: '<p>ভেরিয়েবলের মূল বৈশিষ্ট্যই হলো প্রোগ্রাম চলার সময় এর মান পরিবর্তন হতে পারে — এখান থেকেই এর নামকরণ হয়েছে (ইংরেজিতে "variable" শব্দের অর্থ "পরিবর্তনশীল")।</p>' },
    varsEn.blocks[6], // code — unchanged
    { ...varsEn.blocks[7], text: 'নামকরণের নিয়ম' },
    { ...varsEn.blocks[8], html: '<p>একটি ভেরিয়েবলের নাম অবশ্যই একটি অক্ষর, <code>_</code>, বা <code>$</code> দিয়ে শুরু হতে হবে — কোনো সংখ্যা দিয়ে নয় — এবং এতে কোনো স্পেস থাকতে পারবে না। ভালো নাম সেই মানটি কীসের জন্য তা বর্ণনা করে।</p>' },
    { ...varsEn.blocks[9], header: ['ভালো', 'কাজ করে, কিন্তু অস্পষ্ট'] }, // row values are identifiers, unchanged
    { ...varsEn.blocks[10], html: '<p>JavaScript-এ ভেরিয়েবলের নাম কেস-সেনসিটিভ (case-sensitive): <code>score</code> এবং <code>Score</code> দুটি সম্পূর্ণ আলাদা ভেরিয়েবল।</p>' },
  ],
  toc: [
    { id: 'declaring-a-variable', text: 'ভেরিয়েবল ডিক্লেয়ার করা', level: 2 },
    { id: 'variables-can-change', text: 'ভেরিয়েবলের মান পরিবর্তন হতে পারে', level: 2 },
    { id: 'naming-rules', text: 'নামকরণের নিয়ম', level: 2 },
  ],
}

// ── programming/data-types ───────────────────────────────────────────────

const dtEn = byPath['programming/data-types']
const dtBn = {
  title: 'ডেটা টাইপ',
  meta_title: 'ডেটা টাইপ | Learn Computer Academy',
  meta_description: null,
  blocks: [
    { ...dtEn.blocks[0], html: '<p>প্রোগ্রামের প্রতিটি মানের একটি টাইপ (type) থাকে, যা নির্ধারণ করে সেটি কী ধরনের ডেটা এবং সেটি দিয়ে আপনি কী করতে পারবেন। সংখ্যা যোগ করা যায়; টেক্সট জোড়া লাগানো যায়; true/false মান সিদ্ধান্ত নেওয়ার কাজে ব্যবহার করা যায়।</p>' },
    { ...dtEn.blocks[1], text: 'মৌলিক টাইপগুলো' },
    {
      ...dtEn.blocks[2],
      header: ['টাইপ', 'উদাহরণ', 'বিবরণ'],
      rows: [
        ['Number', '<code>42</code>, <code>3.14</code>', 'পূর্ণ সংখ্যা বা দশমিক সংখ্যা'],
        ['String', '<code>"hello"</code>', 'টেক্সট, কোটেশনের মধ্যে থাকে'],
        ['Boolean', '<code>true</code>, <code>false</code>', 'হ্যাঁ/না, চালু/বন্ধ ধরনের মান'],
        ['Undefined', '<code>undefined</code>', 'এমন ভেরিয়েবল যা ডিক্লেয়ার করা হয়েছে কিন্তু এখনো কোনো মান দেওয়া হয়নি'],
        ['Null', '<code>null</code>', 'ইচ্ছাকৃতভাবে খালি রাখা একটি মান'],
      ],
    },
    { ...dtEn.blocks[3], text: 'একটি মানের টাইপ যাচাই করা' },
    { ...dtEn.blocks[4], html: '<p>JavaScript-এর <code>typeof</code> অপারেটর আপনাকে বলে দেয় একটি মান কোন টাইপের — শেখার সময় এটি কাজে লাগে, এবং মাঝে মাঝে বাস্তব কোডেও ব্যবহৃত হয়।</p>' },
    dtEn.blocks[5], // code — comments here show literal output ("number", "string"), not descriptive text, so left as-is
    { ...dtEn.blocks[6], html: '<p>দেখতে একইরকম মনে হলেও সংখ্যা এবং স্ট্রিং সম্পূর্ণ ভিন্নভাবে আচরণ করে: <code>"5" + "5"</code> দুটি টেক্সটকে জোড়া লাগিয়ে <code>"55"</code> তৈরি করে, অথচ <code>5 + 5</code> দুটি সংখ্যা যোগ করে <code>10</code> তৈরি করে। সংখ্যা এবং সংখ্যাযুক্ত স্ট্রিং গুলিয়ে ফেলা শুরুর দিকের সবচেয়ে সাধারণ ভুলগুলোর একটি।</p>' },
  ],
  toc: [
    { id: 'the-basic-types', text: 'মৌলিক টাইপগুলো', level: 2 },
    { id: 'checking-a-values-type', text: 'একটি মানের টাইপ যাচাই করা', level: 2 },
  ],
}

const translations = [
  { doc_id: introEn.id, ...introBn },
  { doc_id: varsEn.id, ...varsBn },
  { doc_id: dtEn.id, ...dtBn },
]

async function main() {
  for (const t of translations) {
    const { error } = await supabase.from('doc_translations').upsert(
      { ...t, locale: 'bn' },
      { onConflict: 'doc_id,locale' }
    )
    if (error) { console.error('Failed:', t.title, error.message); continue }
    console.log('✓', t.title)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
