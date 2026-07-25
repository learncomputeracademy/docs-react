#!/usr/bin/env node
// Bengali translation for the remaining 16 Programming lessons (pilot 3
// already done separately). West Bengal/Indian Bengali vocabulary
// throughout per user correction (জল not পানি pattern) — no Bangladeshi
// word choices. Same rules as the pilot: prose translated, code blocks
// untouched except genuinely descriptive comments (not literal output
// echoes), anchors identical to English for consistent deep-linking.
import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const raw = fs.readFileSync('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const source = JSON.parse(fs.readFileSync('scripts/reports/remaining-source.json', 'utf8'))
const byPath = Object.fromEntries(source.map(d => [d.path, d]))

const translations = []

// ── constants ────────────────────────────────────────────────────────────
{
  const en = byPath['programming/constants']
  translations.push({
    doc_id: en.id,
    title: 'কনস্ট্যান্ট',
    meta_title: 'কনস্ট্যান্ট | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>কনস্ট্যান্ট অনেকটা ভেরিয়েবলের মতোই, তবে এর মান একবার সেট হয়ে গেলে আর কখনো পরিবর্তন করা যায় না। যখনই কোনো মান প্রোগ্রামের পুরো সময়কাল জুড়ে অপরিবর্তিত থাকা উচিত, তখন কনস্ট্যান্ট ব্যবহার করুন — এটি আপনাকে অনিচ্ছাকৃতভাবে কোনো মান ওভাররাইট করা থেকে রক্ষা করে।</p>' },
      { ...en.blocks[1], text: 'কনস্ট্যান্ট ডিক্লেয়ার করা' },
      { ...en.blocks[2], html: '<p>JavaScript-এ, <code>let</code>-এর বদলে <code>const</code> ব্যবহার করুন:</p>' },
      en.blocks[3],
      { ...en.blocks[4], html: '<p>একটি কনস্ট্যান্টকে আবার নতুন মান দেওয়ার চেষ্টা করলে এরর হয় — JavaScript ইচ্ছাকৃতভাবেই আপনাকে আটকে দেয়:</p>' },
      en.blocks[5],
      { ...en.blocks[6], text: 'কখন const এবং কখন let ব্যবহার করবেন' },
      { ...en.blocks[7], html: '<p>অভিজ্ঞ প্রোগ্রামারদের একটি সাধারণ অভ্যাস হলো: ডিফল্ট হিসেবে <code>const</code> ব্যবহার করা, এবং শুধুমাত্র তখনই <code>let</code>-এ পরিবর্তন করা যখন আপনি জানেন যে একটি মান সত্যিই পরে পরিবর্তন হবে (যেমন একটি কাউন্টার বা স্কোর)। এতে কোড বোঝা সহজ হয় — <code>const</code> দেখলেই বুঝে যাবেন সেই মানটি চিরস্থায়ীভাবে স্থির।</p>' },
    ],
    toc: [
      { id: 'declaring-a-constant', text: 'কনস্ট্যান্ট ডিক্লেয়ার করা', level: 2 },
      { id: 'when-to-use-const-vs-let', text: 'কখন const এবং কখন let ব্যবহার করবেন', level: 2 },
    ],
  })
}

// ── type-casting ─────────────────────────────────────────────────────────
{
  const en = byPath['programming/type-casting']
  translations.push({
    doc_id: en.id,
    title: 'টাইপ কাস্টিং',
    meta_title: 'টাইপ কাস্টিং | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>টাইপ কাস্টিং (টাইপ কনভার্সনও বলা হয়) মানে একটি মানকে এক টাইপ থেকে অন্য টাইপে রূপান্তর করা — যেমন, টেক্সট <code>"42"</code>-কে সংখ্যা <code>42</code>-এ পরিণত করা। এটি গুরুত্বপূর্ণ কারণ কোনো ফর্ম, ফাইল, বা ইউজার ইনপুট থেকে পাওয়া মান প্রায়ই টেক্সট হিসেবে আসে, এমনকি যখন এটি একটি সংখ্যাকে বোঝায় তখনও।</p>' },
      { ...en.blocks[1], text: 'টেক্সটকে সংখ্যায় রূপান্তর করা' },
      { ...en.blocks[2], code: en.blocks[2].code.replace('30 — real addition now, not text joining', '30 — আসল যোগফল, টেক্সট জোড়া লাগানো নয়') },
      { ...en.blocks[3], text: 'সংখ্যাকে টেক্সটে রূপান্তর করা' },
      en.blocks[4],
      { ...en.blocks[5], text: 'রূপান্তর ব্যর্থ হলে কী হয়' },
      { ...en.blocks[6], html: '<p>সব টেক্সট বৈধ সংখ্যা নয়। এমন কিছু রূপান্তর করার চেষ্টা করলে যা সংখ্যা নয়, তাহলে প্রোগ্রাম ক্র্যাশ না করে <code>NaN</code> ("Not a Number") নামে একটি বিশেষ মান তৈরি হয়।</p>' },
      en.blocks[7],
    ],
    toc: [
      { id: 'converting-text-to-a-number', text: 'টেক্সটকে সংখ্যায় রূপান্তর করা', level: 2 },
      { id: 'converting-a-number-to-text', text: 'সংখ্যাকে টেক্সটে রূপান্তর করা', level: 2 },
      { id: 'what-happens-if-the-conversion-fails', text: 'রূপান্তর ব্যর্থ হলে কী হয়', level: 2 },
    ],
  })
}

// ── operators ────────────────────────────────────────────────────────────
{
  const en = byPath['programming/operators']
  translations.push({
    doc_id: en.id,
    title: 'অপারেটর',
    meta_title: 'অপারেটর | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: "<p>অপারেটর হলো এমন চিহ্ন যা মানের উপর কাজ করে — সংখ্যা যোগ করা, তুলনা করা, true/false শর্ত একত্রিত করা। এই পাঠে সেই পাঁচ ধরনের অপারেটর নিয়ে আলোচনা করা হয়েছে যা আপনি প্রায় সবসময় ব্যবহার করবেন।</p>" },
      { ...en.blocks[1], text: 'অ্যারিথমেটিক অপারেটর' },
      { ...en.blocks[2], html: '<p>গণনার জন্য ব্যবহৃত হয়।</p>' },
      { ...en.blocks[3], header: ['অপারেটর', 'অর্থ', 'উদাহরণ'] }, // rows are symbols/math, unchanged
      { ...en.blocks[4], text: 'অ্যাসাইনমেন্ট অপারেটর' },
      { ...en.blocks[5], html: '<p>একটি ভেরিয়েবলকে মান দিতে ব্যবহৃত হয়, প্রায়ই একটি হিসাবের সাথে মিলিয়ে।</p>' },
      en.blocks[6], // code: "same as: ..." is a code-equivalent, not prose — left as-is
      { ...en.blocks[7], text: 'কম্প্যারিজন অপারেটর' },
      { ...en.blocks[8], html: '<p>দুটি মান তুলনা করে <code>true</code> বা <code>false</code> তৈরি করে।</p>' },
      { ...en.blocks[9], header: ['অপারেটর', 'অর্থ'], rows: [
        ['===', 'সমান (টাইপও যাচাই করে)'],
        ['!==', 'সমান নয়'],
        ['>', 'বড়'],
        ['<', 'ছোট'],
        ['>=', 'বড় বা সমান'],
      ] },
      { ...en.blocks[10], code: en.blocks[10].code.replace('false — different types', 'false — ভিন্ন টাইপ') },
      { ...en.blocks[11], text: 'লজিক্যাল অপারেটর' },
      { ...en.blocks[12], html: '<p>true/false মান একত্রিত করে বা উল্টে দেয়।</p>' },
      { ...en.blocks[13], header: ['অপারেটর', 'অর্থ', 'উদাহরণ'], rows: [
        ['&&', 'AND — দুটোই true হতে হবে', 'true && false → false'],
        ['||', 'OR — অন্তত একটি true হলেই চলবে', 'true || false → true'],
        ['!', 'NOT — মান উল্টে দেয়', '!true → false'],
      ] },
      { ...en.blocks[14], text: 'বিটওয়াইজ অপারেটর' },
      { ...en.blocks[15], html: '<p>সংখ্যার বাইনারি রূপের উপর সরাসরি, বিট বাই বিট কাজ করে। উপরের অপারেটরগুলোর তুলনায় এগুলো আপনি অনেক কম ব্যবহার করবেন, তবে লো-লেভেল কোড, গ্রাফিক্স এবং পারমিশন ফ্ল্যাগে এগুলোর দেখা মেলে।</p>' },
      { ...en.blocks[16], code: en.blocks[16].code.replace('1  — AND on the underlying bits', '1  — অন্তর্নিহিত বিটগুলোর উপর AND').replace('7  — OR on the underlying bits', '7  — অন্তর্নিহিত বিটগুলোর উপর OR') },
      { ...en.blocks[17], html: '<p>বিটওয়াইজ অপারেটর <a href="/programming/binary-numbers">বাইনারি নাম্বার</a> পাঠের পর অনেক বেশি স্পষ্ট হয়ে যাবে — এখন এই অংশটা শুধু চোখ বুলিয়ে গেলে ফিরে এসে দেখলেও চলবে।</p>' },
    ],
    toc: [
      { id: 'arithmetic-operators', text: 'অ্যারিথমেটিক অপারেটর', level: 2 },
      { id: 'assignment-operators', text: 'অ্যাসাইনমেন্ট অপারেটর', level: 2 },
      { id: 'comparison-operators', text: 'কম্প্যারিজন অপারেটর', level: 2 },
      { id: 'logical-operators', text: 'লজিক্যাল অপারেটর', level: 2 },
      { id: 'bitwise-operators', text: 'বিটওয়াইজ অপারেটর', level: 2 },
    ],
  })
}

// ── comments ─────────────────────────────────────────────────────────────
{
  const en = byPath['programming/comments']
  translations.push({
    doc_id: en.id,
    title: 'কমেন্ট',
    meta_title: 'কমেন্ট | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>কমেন্ট হলো আপনার কোডের মধ্যে থাকা এমন টেক্সট যা কম্পিউটার সম্পূর্ণভাবে উপেক্ষা করে — এটি মানুষের জন্য, মেশিনের জন্য নয়। কমেন্ট ব্যাখ্যা করে কোড *কেন* কিছু একটা করছে, বিশেষ করে যা কোড দেখেই স্পষ্ট বোঝা যায় না।</p>' },
      { ...en.blocks[1], text: 'সিঙ্গেল-লাইন কমেন্ট' },
      { ...en.blocks[2], code: '// এটি ট্যাক্সসহ মোট মূল্য হিসাব করে\nlet total = price * 1.18;' },
      { ...en.blocks[3], text: 'মাল্টি-লাইন কমেন্ট' },
      { ...en.blocks[4], code: "/*\n  এই ফাংশনটি একজন ইউজারের বয়স যাচাই করে।\n  এটি true রিটার্ন করে শুধুমাত্র তখনই যখন বয়সটি একটি বাস্তবসম্মত মানুষের বয়স।\n*/\nfunction isValidAge(age) {\n  return age > 0 && age < 130;\n}" },
      { ...en.blocks[5], text: 'কখন কমেন্ট লিখবেন' },
      { ...en.blocks[6], html: '<p>পরিষ্কার ভেরিয়েবল আর ফাংশনের নামযুক্ত ভালো কোডে খুব কম কমেন্টই দরকার হয় — কোড নিজেই নিজেকে ব্যাখ্যা করে। কমেন্ট লিখুন যখন *কেন*-টা স্পষ্ট নয়: কোনো বাগের সমাধান, কোনো অস্পষ্ট বিজনেস নিয়ম, অথবা সহজে ভেঙে যেতে পারে এমন কিছুর সতর্কবার্তা।</p>' },
      { ...en.blocks[7], html: '<p>যে কমেন্ট শুধু কোডটাই আবার বলে দেয়, সেটা মূল্য যোগ করে না, শুধু বিশৃঙ্খলা তৈরি করে: <code>x = x + 1;</code>-এর উপরে <code>// add 1 to x</code> লিখলে আপনি এমন কিছু জানতে পারবেন না যা আগে থেকেই দেখতে পাচ্ছিলেন না।</p>' },
    ],
    toc: [
      { id: 'single-line-comments', text: 'সিঙ্গেল-লাইন কমেন্ট', level: 2 },
      { id: 'multi-line-comments', text: 'মাল্টি-লাইন কমেন্ট', level: 2 },
      { id: 'when-to-comment', text: 'কখন কমেন্ট লিখবেন', level: 2 },
    ],
  })
}

// ── if-statements ────────────────────────────────────────────────────────
{
  const en = byPath['programming/if-statements']
  translations.push({
    doc_id: en.id,
    title: 'If স্টেটমেন্ট',
    meta_title: 'If স্টেটমেন্ট | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>if স্টেটমেন্ট আপনার প্রোগ্রামকে একটি সিদ্ধান্ত নিতে দেয় — একটি শর্ত true হলে একটি কোড ব্লক চালায়, আর চাইলে সেটি false হলে অন্য একটি ব্লক চালায়।</p>' },
      { ...en.blocks[1], text: 'সাধারণ if' },
      en.blocks[2],
      { ...en.blocks[3], text: 'if / else' },
      en.blocks[4],
      { ...en.blocks[5], text: 'if / else if / else' },
      { ...en.blocks[6], html: '<p>যখন দুটির বেশি সম্ভাব্য ফলাফল থাকে, তখন একাধিক শর্ত একসাথে জুড়ে দিন।</p>' },
      en.blocks[7], // "// Output: Grade: C" — showing literal program output, left as-is
      { ...en.blocks[8], html: '<p>শুধু প্রথম মিলে যাওয়া শর্তটিই চলে — একবার একটি ব্রাঞ্চ বাছাই হয়ে গেলে, JavaScript বাকিগুলো এড়িয়ে যায়, এমনকি পরবর্তী কোনো শর্তও true হলেও।</p>' },
    ],
    toc: [
      { id: 'basic-if', text: 'সাধারণ if', level: 2 },
      { id: 'if-else', text: 'if / else', level: 2 },
      { id: 'if-else-if-else', text: 'if / else if / else', level: 2 },
    ],
  })
}

// ── loops ────────────────────────────────────────────────────────────────
{
  const en = byPath['programming/loops']
  translations.push({
    doc_id: en.id,
    title: 'লুপ',
    meta_title: 'লুপ | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>লুপ একটি কোড ব্লককে বারবার চালায়, যাতে আপনাকে সেটা হাতে করে বারবার লিখতে না হয়। প্রোগ্রাম ডেটার তালিকা প্রসেস করা, নির্দিষ্ট সংখ্যকবার একটি কাজ পুনরাবৃত্তি করা, অথবা কোনো শর্ত পূরণ না হওয়া পর্যন্ত চলতে থাকার কাজ লুপের মাধ্যমেই করে।</p>' },
      { ...en.blocks[1], text: 'for লুপ' },
      { ...en.blocks[2], html: '<p>কতবার কিছু একটা পুনরাবৃত্তি করতে চান তা যদি আগে থেকেই জানা থাকে, তাহলে <code>for</code> লুপ ব্যবহার করুন।</p>' },
      { ...en.blocks[3], code: en.blocks[3].code.replace('Prints Count: 1 through Count: 5', 'Count: 1 থেকে Count: 5 পর্যন্ত প্রিন্ট করে') },
      { ...en.blocks[4], html: '<p><code>for</code> লুপের তিনটি অংশ থাকে, সেমিকোলন দিয়ে আলাদা করা: একটি শুরুর বিন্দু (<code>let i = 1</code>), প্রতিবার পুনরাবৃত্তির আগে যাচাই করা একটি শর্ত (<code>i <= 5</code>), এবং প্রতিবার পুনরাবৃত্তির পরে চলা একটি ধাপ (<code>i++</code>)।</p>' },
      { ...en.blocks[5], text: 'while লুপ' },
      { ...en.blocks[6], html: '<p>কতবার পুনরাবৃত্তি লাগবে তা আগে থেকে না জানা থাকলে <code>while</code> লুপ ব্যবহার করুন — যতক্ষণ শর্তটি true থাকে ততক্ষণ এটি চলতেই থাকে।</p>' },
      en.blocks[7],
      { ...en.blocks[8], html: '<p><code>while</code> লুপের শর্ত যদি কখনো false না হয়, তাহলে লুপটি চিরকাল চলতে থাকে — একে বলা হয় ইনফিনিট লুপ (infinite loop), আর এটি শুরুর দিকের সবচেয়ে সাধারণ ভুলগুলোর একটি। সবসময় নিশ্চিত করুন লুপের ভেতরে এমন কিছু আছে যা এটিকে শেষের দিকে নিয়ে যায়।</p>' },
      { ...en.blocks[9], text: 'অ্যারের উপর লুপ চালানো' },
      { ...en.blocks[10], html: '<p>একটি তালিকার প্রতিটি আইটেম দেখার সবচেয়ে সহজ উপায় হলো <code>for...of</code>।</p>' },
      en.blocks[11],
    ],
    toc: [
      { id: 'the-for-loop', text: 'for লুপ', level: 2 },
      { id: 'the-while-loop', text: 'while লুপ', level: 2 },
      { id: 'looping-over-an-array', text: 'অ্যারের উপর লুপ চালানো', level: 2 },
    ],
  })
}

// ── arrays ───────────────────────────────────────────────────────────────
{
  const en = byPath['programming/arrays']
  translations.push({
    doc_id: en.id,
    title: 'অ্যারে',
    meta_title: 'অ্যারে | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>অ্যারে হলো মানের একটি সাজানো তালিকা, যা একটি মাত্র ভেরিয়েবল নামের মধ্যে সংরক্ষিত থাকে। <code>fruit1</code>, <code>fruit2</code>, <code>fruit3</code> আলাদা করে তৈরি না করে, আপনি একটি অ্যারেই তৈরি করতে পারেন যাতে এগুলো সবই থাকে।</p>' },
      { ...en.blocks[1], text: 'একটি অ্যারে তৈরি করা' },
      en.blocks[2],
      { ...en.blocks[3], text: 'ইনডেক্স দিয়ে আইটেম অ্যাক্সেস করা' },
      { ...en.blocks[4], html: '<p>প্রতিটি আইটেমের একটি অবস্থান থাকে, যাকে বলা হয় ইনডেক্স, যা শুরু হয় <strong>0</strong> থেকে — 1 থেকে নয়।</p>' },
      { ...en.blocks[5], code: en.blocks[5].code.replace('first item', 'প্রথম আইটেম').replace('last item', 'শেষ আইটেম') },
      { ...en.blocks[6], text: 'সাধারণ অ্যারে অপারেশন' },
      { ...en.blocks[7], header: ['মেথড', 'এটি কী করে', 'উদাহরণ'], rows: [
        ['<code>.push(x)</code>', 'শেষে একটি আইটেম যোগ করে', 'fruits.push("kiwi")'],
        ['<code>.pop()</code>', 'শেষ আইটেমটি সরিয়ে দেয়', 'fruits.pop()'],
        ['<code>.length</code>', 'আইটেমের সংখ্যা', 'fruits.length → 3'],
        ['<code>.indexOf(x)</code>', 'একটি মানের অবস্থান খুঁজে বের করে', 'fruits.indexOf("banana") → 1'],
      ] },
      en.blocks[8],
    ],
    toc: [
      { id: 'creating-an-array', text: 'একটি অ্যারে তৈরি করা', level: 2 },
      { id: 'accessing-items-by-index', text: 'ইনডেক্স দিয়ে আইটেম অ্যাক্সেস করা', level: 2 },
      { id: 'common-array-operations', text: 'সাধারণ অ্যারে অপারেশন', level: 2 },
    ],
  })
}

// ── strings ──────────────────────────────────────────────────────────────
{
  const en = byPath['programming/strings']
  translations.push({
    doc_id: en.id,
    title: 'স্ট্রিং',
    meta_title: 'স্ট্রিং | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>স্ট্রিং হলো টেক্সট — কোটেশনের মধ্যে থাকা অক্ষরের একটি ধারা। স্ট্রিং সবচেয়ে বেশি ব্যবহৃত ডেটা টাইপগুলোর একটি, কারণ প্রায় প্রতিটি প্রোগ্রামই কোথাও না কোথাও টেক্সট নিয়ে কাজ করে: নাম, বার্তা, ফাইল পাথ, URL।</p>' },
      { ...en.blocks[1], text: 'একটি স্ট্রিং তৈরি করা' },
      en.blocks[2],
      { ...en.blocks[3], text: 'স্ট্রিং জোড়া লাগানো' },
      en.blocks[4],
      { ...en.blocks[5], text: 'কাজে লাগার মতো স্ট্রিং প্রপার্টি ও মেথড' },
      { ...en.blocks[6], header: ['মেথড', 'এটি কী করে', 'উদাহরণ'], rows: [
        ['<code>.length</code>', 'অক্ষরের সংখ্যা', '"hello".length → 5'],
        ['<code>.toUpperCase()</code>', 'বড় হাতের অক্ষরে রূপান্তর করে', '"hi".toUpperCase() → "HI"'],
        ['<code>.includes(x)</code>', 'টেক্সটে x আছে কিনা যাচাই করে', '"hello".includes("ell") → true'],
        ['<code>.slice(a, b)</code>', 'স্ট্রিং-এর একটি অংশ বের করে', '"hello".slice(0, 3) → "hel"'],
      ] },
      { ...en.blocks[7], text: 'টেমপ্লেট লিটারেল' },
      { ...en.blocks[8], html: '<p>ব্যাকটিক (backtick) ব্যবহার করে আপনি সরাসরি একটি স্ট্রিং-এর মধ্যে ভেরিয়েবল বসাতে পারেন, <code>+</code> দিয়ে টুকরো টুকরো জোড়া না লাগিয়ে।</p>' },
      en.blocks[9],
    ],
    toc: [
      { id: 'creating-a-string', text: 'একটি স্ট্রিং তৈরি করা', level: 2 },
      { id: 'joining-strings', text: 'স্ট্রিং জোড়া লাগানো', level: 2 },
      { id: 'useful-string-properties-and-methods', text: 'কাজে লাগার মতো স্ট্রিং প্রপার্টি ও মেথড', level: 2 },
      { id: 'template-literals', text: 'টেমপ্লেট লিটারেল', level: 2 },
    ],
  })
}

// ── functions ────────────────────────────────────────────────────────────
{
  const en = byPath['programming/functions']
  translations.push({
    doc_id: en.id,
    title: 'ফাংশন',
    meta_title: 'ফাংশন | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>ফাংশন হলো একটি নামযুক্ত, পুনঃব্যবহারযোগ্য কোড ব্লক যা একটি নির্দিষ্ট কাজ সম্পন্ন করে। প্রয়োজনের প্রতিটি জায়গায় একই ধাপ বারবার কপি না করে, আপনি সেগুলো একবার একটি ফাংশন হিসেবে লিখে রাখেন এবং যখনই দরকার নাম ধরে সেটিকে ডাকেন।</p>' },
      { ...en.blocks[1], text: 'একটি ফাংশন সংজ্ঞায়িত করা' },
      en.blocks[2],
      { ...en.blocks[3], html: '<p>এখানে <code>name</code>-কে বলা হয় একটি প্যারামিটার — প্রতিবার ডাকা হলে ফাংশনটি যে মান পাবে তার জন্য একটি প্লেসহোল্ডার।</p>' },
      { ...en.blocks[4], text: 'একটি মান রিটার্ন করা' },
      { ...en.blocks[5], html: '<p>একটি ফাংশন <code>return</code> ব্যবহার করে যে তাকে ডেকেছে তার কাছে একটি মান ফেরত পাঠাতে পারে।</p>' },
      en.blocks[6],
      { ...en.blocks[7], text: 'কেন ফাংশন ব্যবহার করবেন' },
      { ...en.blocks[8], html: '<p>ফাংশন কোডকে পুনঃব্যবহারযোগ্য করে তোলে, আলাদাভাবে টেস্ট করা সহজ করে, এবং পড়া সহজ করে — <code>calculateTotalPrice()</code>-এর মতো একটি ভালো নামের ফাংশন আপনাকে বলে দেয় একটি কোড ব্লক কী করে, ভেতরের প্রতিটি লাইন না পড়েই।</p>' },
    ],
    toc: [
      { id: 'defining-a-function', text: 'একটি ফাংশন সংজ্ঞায়িত করা', level: 2 },
      { id: 'returning-a-value', text: 'একটি মান রিটার্ন করা', level: 2 },
      { id: 'why-use-functions', text: 'কেন ফাংশন ব্যবহার করবেন', level: 2 },
    ],
  })
}

// ── recursion ────────────────────────────────────────────────────────────
{
  const en = byPath['programming/recursion']
  translations.push({
    doc_id: en.id,
    title: 'রিকার্শন',
    meta_title: 'রিকার্শন | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>রিকার্শন হলো যখন একটি ফাংশন নিজেকেই ডাকে একই সমস্যার একটি ছোট সংস্করণ সমাধান করার জন্য, যতক্ষণ না এটি এমন একটি সহজ পরিস্থিতিতে পৌঁছায় যার উত্তর সরাসরি দেওয়া যায়। এটি পুনরাবৃত্তি প্রকাশ করার লুপের চেয়ে ভিন্ন একটি উপায় — কখনো কখনো আরও স্বাভাবিক, বিশেষত এমন সমস্যার জন্য যা নিজের ভাষাতেই সংজ্ঞায়িত।</p>' },
      { ...en.blocks[1], text: 'একটি ক্লাসিক উদাহরণ: ফ্যাক্টোরিয়াল' },
      { ...en.blocks[2], html: '<p>কোনো সংখ্যার ফ্যাক্টোরিয়াল হলো সেই সংখ্যাকে তার নিচের সংখ্যার ফ্যাক্টোরিয়াল দিয়ে গুণ করা, 1-এ না পৌঁছানো পর্যন্ত। যেমন, <code>4! = 4 × 3 × 2 × 1 = 24</code>।</p>' },
      { ...en.blocks[3], code: en.blocks[3].code.replace('base case — stops the recursion', 'বেস কেস — রিকার্শন থামিয়ে দেয়').replace('recursive case', 'রিকার্সিভ কেস') },
      { ...en.blocks[4], text: 'প্রতিটি রিকার্সিভ ফাংশনের জন্য দুটি অংশ দরকার' },
      { ...en.blocks[5], header: ['অংশ', 'উদ্দেশ্য'], rows: [
        ['বেস কেস', 'সেই সহজ পরিস্থিতি যা সরাসরি একটি উত্তর ফেরত দেয়, আর কোনো রিকার্শন ছাড়াই — এটি না থাকলে ফাংশনটি চিরকাল নিজেকে ডাকতেই থাকবে'],
        ['রিকার্সিভ কেস', 'সমস্যার একটি ছোট সংস্করণে আবার ফাংশনটিকে ডাকে, বেস কেসের দিকে এগিয়ে যেতে যেতে'],
      ] },
      { ...en.blocks[6], html: '<p>বেস কেস ছাড়া (বা যেটাতে কখনো পৌঁছানো যায় না) একটি রিকার্সিভ ফাংশন "স্ট্যাক ওভারফ্লো" ঘটায় — প্রোগ্রামটি অপেক্ষমাণ সব কলের হিসাব রাখতে গিয়ে মেমরি শেষ করে ফেলে। প্রতিটি রিকার্সিভ ফাংশনেরই কোনো না কোনোভাবে থামার একটি উপায় দরকার।</p>' },
    ],
    toc: [
      { id: 'a-classic-example-factorial', text: 'একটি ক্লাসিক উদাহরণ: ফ্যাক্টোরিয়াল', level: 2 },
      { id: 'the-two-parts-every-recursive-function-needs', text: 'প্রতিটি রিকার্সিভ ফাংশনের জন্য দুটি অংশ দরকার', level: 2 },
    ],
  })
}

// ── scope ────────────────────────────────────────────────────────────────
{
  const en = byPath['programming/scope']
  translations.push({
    doc_id: en.id,
    title: 'স্কোপ',
    meta_title: 'স্কোপ | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>স্কোপ নির্ধারণ করে আপনার কোডের কোন জায়গা থেকে একটি ভেরিয়েবল অ্যাক্সেস করা যায়। একটি ফাংশনের ভেতরে ডিক্লেয়ার করা ভেরিয়েবল সাধারণত তার বাইরে থেকে দেখা যায় না — এটি কোনো সীমাবদ্ধতা নয়, বরং এটিই একটি বড় প্রোগ্রামের বিভিন্ন অংশকে একে অপরের সাথে অনিচ্ছাকৃতভাবে মিশে যাওয়া থেকে রক্ষা করে।</p>' },
      { ...en.blocks[1], text: 'লোকাল স্কোপ' },
      { ...en.blocks[2], html: '<p>একটি ফাংশনের ভেতরে ডিক্লেয়ার করা ভেরিয়েবল শুধুমাত্র সেই ফাংশনের ভেতরেই থাকে।</p>' },
      { ...en.blocks[3], code: en.blocks[3].code.replace('works fine', 'ঠিকভাবে কাজ করে') },
      { ...en.blocks[4], text: 'গ্লোবাল স্কোপ' },
      { ...en.blocks[5], html: '<p>যেকোনো ফাংশনের বাইরে ডিক্লেয়ার করা ভেরিয়েবল সেই ফাইলের সব জায়গা থেকে অ্যাক্সেসযোগ্য, ফাংশনের ভেতর থেকেও।</p>' },
      { ...en.blocks[6], code: en.blocks[6].code.replace('// global', '// গ্লোবাল').replace('can read the global variable', 'গ্লোবাল ভেরিয়েবলটি পড়তে পারে') },
      { ...en.blocks[7], text: 'কেন স্কোপ গুরুত্বপূর্ণ' },
      { ...en.blocks[8], html: '<p>ভেরিয়েবলকে লোকাল রাখা (সবকিছু গ্লোবাল না করে) প্রোগ্রামের বিভিন্ন অংশকে দুর্ঘটনাক্রমে একে অপরের ভেরিয়েবলে হস্তক্ষেপ করা থেকে আটকায় — বড় প্রোগ্রামে খুঁজে পেতে কষ্ট হয় এমন বাগের একটি সাধারণ উৎস।</p>' },
    ],
    toc: [
      { id: 'local-scope', text: 'লোকাল স্কোপ', level: 2 },
      { id: 'global-scope', text: 'গ্লোবাল স্কোপ', level: 2 },
      { id: 'why-scope-matters', text: 'কেন স্কোপ গুরুত্বপূর্ণ', level: 2 },
    ],
  })
}

// ── input-output ─────────────────────────────────────────────────────────
{
  const en = byPath['programming/input-output']
  translations.push({
    doc_id: en.id,
    title: 'ইনপুট এবং আউটপুট',
    meta_title: 'ইনপুট এবং আউটপুট | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>ইনপুট হলো এমন ডেটা যা একটি প্রোগ্রাম গ্রহণ করে — কোনো ইউজার, ফাইল, বা অন্য প্রোগ্রাম থেকে। আউটপুট হলো তার জবাবে প্রোগ্রামটি যা তৈরি করে। প্রায় প্রতিটি কার্যকর প্রোগ্রামই, মূলত, ইনপুট → প্রসেসিং → আউটপুট-এর একটি চক্র।</p>' },
      { ...en.blocks[1], text: 'আউটপুট' },
      { ...en.blocks[2], html: '<p>এই সাইটের উদাহরণগুলোতে আউটপুট প্রিন্ট করতে <code>console.log()</code> ব্যবহার করা হয়েছে — একটি বাস্তব ওয়েবপেজে আউটপুট বলতে সাধারণত স্ক্রিনে কিছু একটা আপডেট করা বোঝায়।</p>' },
      en.blocks[3],
      { ...en.blocks[4], text: 'ব্রাউজারে ইনপুট' },
      { ...en.blocks[5], html: '<p>ব্রাউজারে কারও কাছ থেকে ইনপুট নেওয়ার একটি সহজ উপায় হলো <code>prompt()</code>, যা একটি ছোট ইনপুট বক্স খুলে দেয় এবং ইউজার যা টাইপ করেছে তা একটি স্ট্রিং হিসেবে ফেরত দেয়।</p>' },
      en.blocks[6],
      { ...en.blocks[7], html: '<p><code>prompt()</code> সবসময় একটি স্ট্রিং ফেরত দেয় — যদি আপনি একটি সংখ্যা চান, তাহলে সেটি দিয়ে অঙ্ক করার আগে <code>Number()</code> দিয়ে রূপান্তর করতে ভুলবেন না (দেখুন <a href="/programming/type-casting">টাইপ কাস্টিং</a> পাঠ)।</p>' },
      { ...en.blocks[8], text: 'বাস্তব জীবনের ইনপুট/আউটপুট' },
      { ...en.blocks[9], html: '<p>সাধারণ পপ-আপের বাইরেও, প্রোগ্রাম ওয়েব ফর্ম, ফাইল, ডেটাবেস, সেন্সর, বা নেটওয়ার্কের মাধ্যমে অন্য প্রোগ্রাম থেকে ইনপুট নেয় — আর স্ক্রিন, ফাইল, ডেটাবেস, অথবা নেটওয়ার্কে আউটপুট পাঠায়। মূল ধারণাটা সবসময় একই থাকে: ডেটা নিয়ে আসা, প্রসেস করা, ফলাফল পাঠানো।</p>' },
    ],
    toc: [
      { id: 'output', text: 'আউটপুট', level: 2 },
      { id: 'input-in-the-browser', text: 'ব্রাউজারে ইনপুট', level: 2 },
      { id: 'real-world-inputoutput', text: 'বাস্তব জীবনের ইনপুট/আউটপুট', level: 2 },
    ],
  })
}

// ── bits-and-bytes ───────────────────────────────────────────────────────
{
  const en = byPath['programming/bits-and-bytes']
  translations.push({
    doc_id: en.id,
    title: 'বিট এবং বাইট',
    meta_title: 'বিট এবং বাইট | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>প্রতিটি প্রোগ্রামের নিচে, সব ডেটা — সংখ্যা, টেক্সট, ছবি, ভিডিও — মাত্র দুটি মানের ধারা হিসেবে সংরক্ষিত থাকে: 0 এবং 1। বিট আর বাইট বোঝা মানে বোঝা যে আপনার লেখা কোডের নিচে কম্পিউটার আসলে কী করছে।</p>' },
      { ...en.blocks[1], text: 'বিট কী?' },
      { ...en.blocks[2], html: '<p>একটি <strong>বিট</strong> ("বাইনারি ডিজিট"-এর সংক্ষিপ্ত রূপ) হলো একটি কম্পিউটার সংরক্ষণ করতে পারে এমন ডেটার সবচেয়ে ছোট একক — একটি মাত্র 0 বা 1। একা একটি বিট ঠিক দুটি অবস্থা প্রকাশ করতে পারে: বন্ধ/চালু, false/true, না/হ্যাঁ।</p>' },
      { ...en.blocks[3], text: 'বাইট কী?' },
      { ...en.blocks[4], html: '<p>একটি <strong>বাইট</strong> হলো 8টি বিটের একটি দল। একটি বাইট 2⁸ = 256টি ভিন্ন মান প্রকাশ করতে পারে (0 থেকে 255) — যা, উদাহরণস্বরূপ, একটি সাধারণ এনকোডিং ব্যবহার করে ইংরেজি টেক্সটের একটি মাত্র অক্ষর সংরক্ষণ করার জন্য যথেষ্ট।</p>' },
      { ...en.blocks[5], header: ['একক', 'আকার', 'মোটামুটি'], rows: [
        ['1 বাইট', '8 বিট', 'একটি অক্ষর'],
        ['1 কিলোবাইট (KB)', '1,024 বাইট', 'একটি ছোট ইমেইল'],
        ['1 মেগাবাইট (MB)', '1,024 KB', 'কয়েকটি ছবি'],
        ['1 গিগাবাইট (GB)', '1,024 MB', 'দুই-একটি সিনেমা'],
      ] },
      { ...en.blocks[6], text: 'প্রোগ্রামিং-এর জন্য এটি কেন গুরুত্বপূর্ণ' },
      { ...en.blocks[7], html: '<p>ডেটা টাইপের নির্দিষ্ট আকার থাকার এটাই কারণ — যে ডেটা টাইপকে শুধু true/false ধরে রাখতে হয়, তার একটি বড় সংখ্যা ধরে রাখা টাইপের মতো এত মেমরি সংরক্ষণ করার দরকার হয় না। শুরুর দিকে আপনাকে সরাসরি বিট নিয়ে কাজ করতে হয় না খুব একটা, কিন্তু এই ধারণাটাই ফাইলের আকার থেকে শুরু করে নেটওয়ার্কের গতি, এমনকি কোডে কিছু সংখ্যার সীমা থাকার কারণ পর্যন্ত সবকিছুর ভিত্তি।</p>' },
    ],
    toc: [
      { id: 'what-is-a-bit', text: 'বিট কী?', level: 2 },
      { id: 'what-is-a-byte', text: 'বাইট কী?', level: 2 },
      { id: 'why-this-matters-for-programming', text: 'প্রোগ্রামিং-এর জন্য এটি কেন গুরুত্বপূর্ণ', level: 2 },
    ],
  })
}

// ── binary-numbers ───────────────────────────────────────────────────────
{
  const en = byPath['programming/binary-numbers']
  translations.push({
    doc_id: en.id,
    title: 'বাইনারি নাম্বার',
    meta_title: 'বাইনারি নাম্বার | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>বাইনারি হলো এমন একটি সংখ্যা পদ্ধতি যেখানে শুধু দুটি অঙ্ক ব্যবহৃত হয়, 0 এবং 1 — আপনি প্রতিদিন যে দশমিক পদ্ধতি ব্যবহার করেন তার তুলনায়, যেখানে দশটি অঙ্ক থাকে (0–9)। এটিই কম্পিউটার ভেতরে ভেতরে যে সংখ্যা পদ্ধতি ব্যবহার করে, কারণ একটি বিটের মাত্র দুটি সম্ভাব্য অবস্থা থাকে।</p>' },
      { ...en.blocks[1], text: 'বাইনারি গোনা যেভাবে কাজ করে' },
      { ...en.blocks[2], html: '<p>দশমিকে, প্রতিটি অবস্থান 10-এর একটি ঘাত প্রকাশ করে (1, 10, 100, ...)। বাইনারিতে, প্রতিটি অবস্থান 2-এর একটি ঘাত প্রকাশ করে (1, 2, 4, 8, ...)।</p>' },
      { ...en.blocks[3], header: ['বাইনারি', 'হিসাব', 'দশমিক'] }, // rows are numbers/symbols, unchanged
      { ...en.blocks[4], text: 'কোডে বাইনারিকে দশমিকে রূপান্তর করা' },
      en.blocks[5],
      { ...en.blocks[6], text: 'কোডে দশমিককে বাইনারিতে রূপান্তর করা' },
      en.blocks[7],
    ],
    toc: [
      { id: 'how-binary-counting-works', text: 'বাইনারি গোনা যেভাবে কাজ করে', level: 2 },
      { id: 'converting-binary-to-decimal-in-code', text: 'কোডে বাইনারিকে দশমিকে রূপান্তর করা', level: 2 },
      { id: 'converting-decimal-to-binary-in-code', text: 'কোডে দশমিককে বাইনারিতে রূপান্তর করা', level: 2 },
    ],
  })
}

// ── hexadecimal-numbers ──────────────────────────────────────────────────
{
  const en = byPath['programming/hexadecimal-numbers']
  translations.push({
    doc_id: en.id,
    title: 'হেক্সাডেসিমাল নাম্বার',
    meta_title: 'হেক্সাডেসিমাল নাম্বার | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>হেক্সাডেসিমাল (সংক্ষেপে "হেক্স") হলো 16টি অঙ্কের একটি সংখ্যা পদ্ধতি: 0–9, তারপর A–F যা 10–15-কে বোঝায়। প্রোগ্রামিং-এ এটি ব্যাপকভাবে ব্যবহৃত হয় কারণ এটি বাইনারির সাথে নিখুঁতভাবে মিলে যায় — একটি হেক্স অঙ্ক ঠিক 4টি বিট প্রকাশ করে — আর অনেক লম্বা 0 আর 1-এর সারির চেয়ে অনেক বেশি সংক্ষিপ্ত ও সহজপাঠ্য।</p>' },
      { ...en.blocks[1], text: 'হেক্স অঙ্কগুলো' },
      { ...en.blocks[2], header: ['দশমিক', 'হেক্স'] }, // rows are numbers/letters, unchanged
      { ...en.blocks[3], text: 'হেক্স আপনি আগে থেকেই যেখানে দেখেছেন' },
      { ...en.blocks[4], html: '<p>আপনি যদি CSS কালার নিয়ে কাজ করে থাকেন, তাহলে হেক্সাডেসিমাল আপনি আগেই ব্যবহার করেছেন — <code>#FF8A30</code>-এর মতো একটি রং তিনটি হেক্স জোড়া, লাল, সবুজ, এবং নীলের জন্য একটি করে (প্রতিটি জোড়া <code>00</code> থেকে <code>FF</code> পর্যন্ত, অর্থাৎ 0–255)।</p>' },
      { ...en.blocks[5], text: 'কোডে রূপান্তর করা' },
      en.blocks[6],
    ],
    toc: [
      { id: 'the-hex-digits', text: 'হেক্স অঙ্কগুলো', level: 2 },
      { id: 'where-youve-already-seen-hex', text: 'হেক্স আপনি আগে থেকেই যেখানে দেখেছেন', level: 2 },
      { id: 'converting-in-code', text: 'কোডে রূপান্তর করা', level: 2 },
    ],
  })
}

// ── boolean-algebra ──────────────────────────────────────────────────────
{
  const en = byPath['programming/boolean-algebra']
  translations.push({
    doc_id: en.id,
    title: 'বুলিয়ান অ্যালজেব্রা',
    meta_title: 'বুলিয়ান অ্যালজেব্রা | Learn Computer Academy',
    meta_description: null,
    blocks: [
      { ...en.blocks[0], html: '<p>বুলিয়ান অ্যালজেব্রা হলো যুক্তিবিদ্যার সেই শাখা যা শুধুমাত্র দুটি মান — true এবং false — এবং সেগুলোকে একত্রিত করার অপারেশন নিয়ে কাজ করে। আপনার লেখা প্রতিটি <code>if</code> স্টেটমেন্ট আর লজিক্যাল অপারেটরের গাণিতিক ভিত্তি এটাই, এবং ডিজিটাল সার্কিট নিজেই যেভাবে তৈরি হয় তার পেছনেও এটাই আছে।</p>' },
      { ...en.blocks[1], text: 'তিনটি মূল অপারেশন' },
      { ...en.blocks[2], header: ['অপারেশন', 'JavaScript', 'ফলাফল true হয় যখন'], rows: [
        ['AND', '<code>&&</code>', 'দুটো ইনপুটই true'],
        ['OR', '<code>||</code>', 'অন্তত একটি ইনপুট true'],
        ['NOT', '<code>!</code>', 'ইনপুটটি false (এটি মান উল্টে দেয়)'],
      ] },
      { ...en.blocks[3], text: 'ট্রুথ টেবিল' },
      { ...en.blocks[4], html: '<p>একটি ট্রুথ টেবিলে ইনপুটের সব সম্ভাব্য সমন্বয় এবং প্রতিটির ফলাফল তালিকাবদ্ধ থাকে — কোনো অপারেশন ঠিক কীভাবে আচরণ করে তা দেখার একটি সংক্ষিপ্ত উপায়।</p>' },
      en.blocks[5], // table of true/false, unchanged (these are literal boolean values, universal notation)
      { ...en.blocks[6], text: 'কেন এটি গুরুত্বপূর্ণ' },
      { ...en.blocks[7], html: '<p>আপনার লেখা প্রতিটি শর্ত — <code>if (age >= 18 && hasId)</code> — বুলিয়ান অ্যালজেব্রারই কাজ। ট্রুথ টেবিল বুঝলে সঠিক শর্ত লেখা অনেক সহজ হয়ে যায়, বিশেষ করে যখন আপনি একই লাইনে <code>&&</code> এবং <code>||</code> দিয়ে একাধিক শর্ত একত্রিত করা শুরু করবেন।</p>' },
    ],
    toc: [
      { id: 'the-three-core-operations', text: 'তিনটি মূল অপারেশন', level: 2 },
      { id: 'truth-tables', text: 'ট্রুথ টেবিল', level: 2 },
      { id: 'why-it-matters', text: 'কেন এটি গুরুত্বপূর্ণ', level: 2 },
    ],
  })
}

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  console.log(`${translations.length} lessons to translate\n`)
  let written = 0
  for (const t of translations) {
    const { error } = await supabase.from('doc_translations').upsert({ ...t, locale: 'bn' }, { onConflict: 'doc_id,locale' })
    if (error) { console.error('Failed:', t.title, error.message); continue }
    console.log('✓', t.title)
    written++
  }
  console.log(`\n✅ ${written}/${translations.length} written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
