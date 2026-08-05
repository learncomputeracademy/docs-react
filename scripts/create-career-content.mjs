#!/usr/bin/env node
// New "career" category — 34 lessons, per the outline approved with the site
// owner 2026-08-05 (docs/CONTENT-PIPELINE.md). Prompted by the site owner
// sharing an NCERT "Employability Skills" Class XI textbook for reference —
// explicitly NOT to be followed (no CBSE syllabus alignment, no LibreOffice/
// grooming/green-skills sessions, nothing copied). Used only as a prompt for
// what a skills-adjacent category could look like; this one is original and
// industry-specific to web dev / design / digital marketing graduates.
//
// Original content — written fresh for this site (CONTENT-PIPELINE.md §3).
//
// ⚠️ Two things this run is built around, both explicit from the site owner:
// 1. Interview toughness and "not knowing the answer" get real coverage —
//    most career content skips this because it's uncomfortable to write.
//    Lesson `when-you-dont-know` is the direct answer to that request.
// 2. Rejection and resilience are a full section (6 lessons), not a
//    paragraph. Most guides treat rejection as an afterthought; this one
//    treats it as the default outcome worth preparing for on its own terms.
//
// Tone note: this is the first category on the site where tone carries as
// much weight as accuracy. Honest about how hard this is, without being
// discouraging. Never "believe in yourself" content — diagnostic framing
// throughout ("here's how to work out what's wrong") instead of reassurance.
// The English-confidence barrier in interviews is named directly rather than
// avoided, especially in the BN translations, since that's the one subject
// on this site where the Bengali version isn't just a translation convenience
// — it's often the reader's actual situation.
//
// Idempotent — upserts on `path` / `doc_id,locale`. Usage:
//   node scripts/create-career-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Block builders ──────────────────────────────────────────────────────

function h(level, text, anchor) {
  const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor: a }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function code(language, source, runnable) { return { id: nanoid(12), type: 'code', language, code: source, runnable: !!runnable } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }
function img(publicId, alt, width, height, caption) { return { id: nanoid(12), type: 'image', publicId, alt, width, height, caption } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// ── Lessons ──────────────────────────────────────────────────────────────

const lessons = []

lessons.push({
  slug: 'why-skills-alone-dont-get-you-hired',
  sortOrder: 1,
  en: {
    title: 'Why Skills Alone Do Not Get You Hired',
    metaTitle: 'Why Skills Alone Do Not Get You Hired | Learn Computer Academy',
    metaDescription: 'Finishing a course teaches you to build things. Getting hired is a separate skill, almost never taught, and this course exists to close that gap.',
    blocks: [
      p('<p>You can finish a course, genuinely know the material, and still struggle to get hired. This confuses people, because it feels unfair — you did the work, you can build things, why is nobody calling back?</p><p>The honest answer: <b>knowing how to build things and knowing how to get hired to build things are two different skills.</b> Courses teach the first one. Almost nothing teaches the second. This course is entirely about the second.</p>'),

      h(2, 'What a Course Actually Certifies'),
      p('<p>A completion certificate tells an employer one thing: you attended and finished. It does not tell them whether you can work independently, whether your code is any good, whether you can explain your reasoning, or whether you can handle a deadline. Every one of those is what a hiring decision actually turns on.</p><p>This is not a flaw specific to this site\'s courses — it is true of every certificate from every institute, everywhere. Employers know this, which is exactly why they ask for more than a certificate.</p>'),

      img(
        'docs/img/career/what-employers-look-for-1',
        'A hiring manager and a young job candidate sitting across a table in conversation during a job interview',
        1024, 768,
        'A junior interview evaluates a narrower, more specific set of things than most candidates assume.'
      ),

      h(2, 'What Employers Actually Check'),
      table(
        ['What they look at', 'What it tells them'],
        [
          ['Projects you can show', 'Whether you can actually build something, not just follow a tutorial'],
          ['How you talk about your work', 'Whether you understand it or memorised it'],
          ['GitHub / online presence', 'Whether you exist as a working developer outside a classroom'],
          ['How you handle a question you don\'t know', 'Whether you\'ll be honest and resourceful on the job, not just today'],
          ['Basic professionalism', 'Whether you\'re ready to work with a team and a client'],
        ]
      ),
      p('<p>Notice that "finished the course" is not on this list. It gets you in the door in some cases. It rarely gets you the job.</p>'),

      callout('note', '<p>This is not a reason to doubt the course, or yourself. It is a reason to spend deliberate time on the second skill — the one this category teaches — instead of assuming it will happen automatically once the first one is in place.</p>', 'Not a discouragement — a missing step'),

      h(2, 'Why Nobody Taught You This Already'),
      p('<p>Technical courses are built around technical content, because that is what can be taught in a structured curriculum with clear right answers. Getting hired involves judgment, presentation, timing, and handling rejection — messier things that do not fit neatly into a syllabus, so they get skipped.</p><p>That gap is real and it is common — not just here. It is also closeable, in less time than it took to learn the technical skill in the first place.</p>'),

      h(2, 'What This Course Actually Does'),
      p('<p>It is organised in the order these problems actually show up: building proof of what you can do, applying in a way that gets noticed, handling the interview itself — including the parts that go badly — dealing with rejection without it derailing you, and what the first few months on a job actually look like once you get there.</p>'),
    ],
  },
  bn: {
    title: 'শুধু দক্ষতা দিয়ে চাকরি হয় না কেন',
    metaTitle: 'শুধু দক্ষতা দিয়ে চাকরি হয় না কেন | Learn Computer Academy',
    metaDescription: 'একটি কোর্স শেষ করা আপনাকে জিনিস তৈরি করতে শেখায়। চাকরি পাওয়া একটি আলাদা দক্ষতা, প্রায় কখনো শেখানো হয় না, আর এই কোর্সটি সেই ফাঁক বন্ধ করতে আছে।',
    blocks: [
      p('<p>আপনি একটি কোর্স শেষ করতে পারেন, সত্যিই বিষয়টি জানতে পারেন, আর তারপরও চাকরি পেতে সংগ্রাম করতে পারেন। এটি মানুষকে বিভ্রান্ত করে, কারণ এটি অন্যায্য মনে হয় — আপনি কাজটি করেছেন, আপনি জিনিস তৈরি করতে পারেন, কেউ কেন ফিরে ডাকছে না?</p><p>সৎ উত্তর: <b>জিনিস তৈরি করতে জানা আর জিনিস তৈরির জন্য নিয়োগ পেতে জানা দুটি আলাদা দক্ষতা।</b> কোর্স প্রথমটি শেখায়। প্রায় কিছুই দ্বিতীয়টি শেখায় না। এই কোর্সটি সম্পূর্ণভাবে দ্বিতীয়টি নিয়ে।</p>'),

      h(2, 'একটি কোর্স আসলে কী প্রমাণ করে', 'what-a-course-actually-certifies'),
      p('<p>একটি সমাপ্তির সার্টিফিকেট একজন নিয়োগকর্তাকে একটি জিনিস বলে: আপনি উপস্থিত ছিলেন আর শেষ করেছেন। এটি তাদের বলে না আপনি স্বাধীনভাবে কাজ করতে পারেন কিনা, আপনার কোড কতটা ভালো, আপনি আপনার যুক্তি ব্যাখ্যা করতে পারেন কিনা, বা আপনি একটি deadline সামলাতে পারেন কিনা। এগুলোর প্রতিটিই যার উপর একটি নিয়োগের সিদ্ধান্ত আসলে নির্ভর করে।</p><p>এটি এই সাইটের কোর্সের নির্দিষ্ট কোনো ত্রুটি নয় — এটি সর্বত্র প্রতিটি প্রতিষ্ঠানের প্রতিটি সার্টিফিকেটের জন্য সত্য। নিয়োগকর্তারা এটি জানেন, যে কারণে তারা একটি সার্টিফিকেটের বেশি কিছু চান।</p>'),

      h(2, 'নিয়োগকর্তারা আসলে কী যাচাই করে', 'what-employers-actually-check'),
      table(
        ['তারা কী দেখে', 'এটি তাদের কী বলে'],
        [
          ['আপনি দেখাতে পারেন এমন প্রোজেক্ট', 'আপনি আসলে কিছু তৈরি করতে পারেন কিনা, শুধু একটি টিউটোরিয়াল অনুসরণ নয়'],
          ['আপনি আপনার কাজ নিয়ে কীভাবে কথা বলেন', 'আপনি এটি বুঝেছেন নাকি মুখস্থ করেছেন'],
          ['GitHub / অনলাইন উপস্থিতি', 'আপনি একটি ক্লাসরুমের বাইরে একজন কার্যকর ডেভেলপার হিসেবে আছেন কিনা'],
          ['আপনি জানেন না এমন একটি প্রশ্ন কীভাবে সামলান', 'আপনি চাকরিতে সৎ আর সম্পদশালী হবেন কিনা, শুধু আজকের জন্য নয়'],
          ['মৌলিক পেশাদারিত্ব', 'আপনি একটি টিম আর একজন ক্লায়েন্টের সাথে কাজ করতে প্রস্তুত কিনা'],
        ]
      ),
      p('<p>লক্ষ্য করুন "কোর্স শেষ করেছি" এই তালিকায় নেই। কিছু ক্ষেত্রে এটি আপনাকে দরজায় ঢোকায়। এটি খুব কমই আপনাকে চাকরিটি দেয়।</p>'),

      callout('note', '<p>এটি কোর্স, বা নিজেকে সন্দেহ করার কারণ নয়। এটি দ্বিতীয় দক্ষতায় — এই বিভাগ যা শেখায় — ইচ্ছাকৃতভাবে সময় দেওয়ার একটি কারণ, প্রথমটি জায়গায় থাকলে এটি স্বয়ংক্রিয়ভাবে ঘটবে ধরে নেওয়ার বদলে।</p>', 'নিরুৎসাহ নয় — একটি অনুপস্থিত ধাপ'),

      h(2, 'কেউ কেন আগে এটি শেখায়নি', 'why-nobody-taught-you-this-already'),
      p('<p>টেকনিক্যাল কোর্স টেকনিক্যাল কন্টেন্টের চারপাশে তৈরি, কারণ এটিই স্পষ্ট সঠিক উত্তরসহ একটি কাঠামোগত syllabus-এ শেখানো যায়। চাকরি পাওয়ায় বিচারশক্তি, উপস্থাপনা, সময়, আর প্রত্যাখ্যান সামলানো জড়িত — এলোমেলো জিনিস যা একটি syllabus-এ পরিপাটিভাবে ফিট করে না, তাই সেগুলো বাদ পড়ে।</p><p>সেই ফাঁকটি বাস্তব আর সাধারণ — শুধু এখানে নয়। এটি বন্ধ করাও যায়, প্রথমে টেকনিক্যাল দক্ষতা শিখতে যা সময় লেগেছিল তার চেয়ে কম সময়ে।</p>'),

      h(2, 'এই কোর্সটি আসলে কী করে', 'what-this-course-actually-does'),
      p('<p>এই সমস্যাগুলো আসলে যে ক্রমে দেখা দেয় সেই ক্রমে এটি সাজানো: আপনি কী করতে পারেন তার প্রমাণ তৈরি করা, নজরে আসার মতো করে আবেদন করা, ইন্টারভিউ নিজেই সামলানো — খারাপ যাওয়া অংশগুলোসহ, নিজেকে বিপথে না নিয়ে প্রত্যাখ্যান সামলানো, আর সেখানে পৌঁছানোর পর একটি চাকরির প্রথম কয়েক মাস আসলে কেমন দেখায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'what-employers-look-for-in-a-junior',
  sortOrder: 2,
  en: {
    title: 'What Employers Actually Look For in a Junior',
    metaTitle: 'What Employers Look For in a Junior Developer | Learn Computer Academy',
    metaDescription: 'Nobody expects a junior to know everything. What they check for instead — and the honest gap between what students assume and what actually matters.',
    blocks: [
      p('<p>A lot of anxiety before applying comes from a wrong assumption: that a junior role requires being job-ready in the same sense a senior hire does. It does not. Understanding what a junior hire is actually being evaluated on removes a surprising amount of that anxiety.</p>'),

      h(2, 'Nobody Expects You to Know Everything'),
      p('<p>A junior developer is not hired because they already know the codebase, the company\'s specific tools, or every edge case in the language. They are hired because they can learn quickly, work carefully, and become useful within a reasonable time. That is a fundamentally different bar than "already an expert."</p>'),

      h(2, 'What Actually Gets Checked'),
      table(
        ['What they check', 'Why it matters more than raw knowledge'],
        [
          ['Fundamentals, done solidly', 'Gaps in the basics are far more costly than gaps in advanced topics — advanced topics can be looked up'],
          ['Can you reason through a problem', 'This predicts how you\'ll handle problems nobody taught you, which is most of the job'],
          ['Do you ask when stuck, or guess silently', 'Silent guessing produces bugs that surface much later and cost more to fix'],
          ['Can you take feedback without getting defensive', 'Code review is constant; someone who takes it personally is expensive to work with'],
          ['Do you finish things', 'A half-built project says less than a small, complete one'],
          ['Basic communication', 'Can you explain a problem clearly, in writing, to someone who wasn\'t there'],
        ]
      ),

      callout('warning', '<p>Trying to look like you already know everything is the most common junior mistake, and it backfires specifically. Experienced interviewers can tell the difference between real depth and a memorised answer within a few follow-up questions — and a candidate caught bluffing is trusted less than one who was honest about a gap from the start.</p>', 'Do not perform expertise you do not have'),

      h(2, 'The Gap Between What Students Assume and What Actually Matters'),
      table(
        ['What students often think matters most', 'What actually carries more weight'],
        [
          ['Knowing every framework feature', 'Being solid on fundamentals and knowing how to find the rest'],
          ['Having an impressive-sounding project idea', 'Having a small project that is genuinely finished and understood'],
          ['Sounding confident about everything', 'Being accurate about what you do and don\'t know'],
          ['A long list of technologies on the CV', 'Real depth in a smaller set, that you can actually discuss'],
        ]
      ),

      h(2, 'Different Companies, Different Bars'),
      p('<p>A large company hiring juniors in batches often filters primarily on fundamentals and problem-solving, because there is training in place afterward. A small business or agency hiring one junior directly is often filtering more on "can this person be useful within a few weeks", because there is no formal onboarding program to lean on.</p><p>Neither is wrong — they are testing for different things because the job itself is different. Worth finding out which situation you\'re in before an interview, since it changes what to emphasise.</p>'),

      h(2, 'The Practical Takeaway'),
      p('<p>You are not being compared to a senior developer. You are being compared to other juniors, most of whom have the same gaps you do. The candidate who stands out is usually not the one who knows the most — it is the one who is solid on fundamentals, honest about limits, and clearly capable of learning the rest.</p>'),
    ],
  },
  bn: {
    title: 'একজন Junior-এ নিয়োগকর্তারা আসলে কী খোঁজে',
    metaTitle: 'একজন Junior Developer-এ নিয়োগকর্তারা কী খোঁজে | Learn Computer Academy',
    metaDescription: 'কেউ একজন junior সবকিছু জানবে আশা করে না। এর বদলে তারা কী যাচাই করে — আর শিক্ষার্থীরা কী ধরে নেয় আর আসলে কী গুরুত্বপূর্ণ তার মধ্যে সৎ ফাঁক।',
    blocks: [
      p('<p>আবেদন করার আগের অনেক উদ্বেগ একটি ভুল অনুমান থেকে আসে: যে একটি junior ভূমিকার জন্য একজন senior নিয়োগের মতোই একই অর্থে চাকরির জন্য প্রস্তুত হতে হয়। তা নয়। একটি junior নিয়োগ আসলে কীসের উপর মূল্যায়িত হচ্ছে তা বোঝা সেই উদ্বেগের একটি বিস্ময়কর পরিমাণ সরিয়ে দেয়।</p>'),

      h(2, 'কেউ আপনার সবকিছু জানার আশা করে না', 'nobody-expects-you-to-know-everything'),
      p('<p>একজন junior developer নিয়োগ পায় না কারণ তারা ইতিমধ্যে codebase, কোম্পানির নির্দিষ্ট টুল, বা ভাষার প্রতিটি edge case জানে। তাদের নিয়োগ করা হয় কারণ তারা দ্রুত শিখতে পারে, যত্নের সাথে কাজ করতে পারে, আর একটি যুক্তিসঙ্গত সময়ের মধ্যে কাজের হয়ে উঠতে পারে। এটি "ইতিমধ্যে একজন বিশেষজ্ঞ"-এর চেয়ে মৌলিকভাবে ভিন্ন একটি মান।</p>'),

      img(
        'docs/img/career/what-employers-look-for-1',
        'একজন নিয়োগকর্তা আর একজন তরুণ চাকরিপ্রার্থী একটি টেবিলের ওপাশে বসে একটি চাকরির ইন্টারভিউয়ের সময় কথোপকথনে',
        1024, 768,
        'একটি junior ইন্টারভিউ বেশিরভাগ প্রার্থী যা ধরে নেয় তার চেয়ে সংকীর্ণ, বেশি নির্দিষ্ট জিনিসের সেট মূল্যায়ন করে।'
      ),

      h(2, 'আসলে কী যাচাই করা হয়', 'what-actually-gets-checked'),
      table(
        ['তারা কী যাচাই করে', 'কেন এটি কাঁচা জ্ঞানের চেয়ে বেশি গুরুত্বপূর্ণ'],
        [
          ['মূল বিষয়, শক্তভাবে করা', 'মূল বিষয়ে ফাঁক উন্নত বিষয়ের ফাঁকের চেয়ে অনেক বেশি খরচবহুল — উন্নত বিষয় খুঁজে দেখা যায়'],
          ['আপনি একটি সমস্যার মধ্য দিয়ে যুক্তি করতে পারেন কিনা', 'এটি ভবিষ্যদ্বাণী করে আপনি এমন সমস্যা কীভাবে সামলাবেন যা কেউ আপনাকে শেখায়নি, যা চাকরির বেশিরভাগ'],
          ['আটকে গেলে আপনি জিজ্ঞাসা করেন, নাকি চুপচাপ অনুমান করেন', 'চুপচাপ অনুমান এমন bug তৈরি করে যা অনেক পরে সামনে আসে আর ঠিক করতে বেশি খরচ হয়'],
          ['আপনি রাগ না করে feedback নিতে পারেন কিনা', 'Code review ক্রমাগত হয়; যে এটি ব্যক্তিগতভাবে নেয় তার সাথে কাজ করা ব্যয়বহুল'],
          ['আপনি জিনিস শেষ করেন কিনা', 'একটি অর্ধ-তৈরি প্রোজেক্ট একটি ছোট, সম্পূর্ণ একটির চেয়ে কম বলে'],
          ['মৌলিক যোগাযোগ', 'আপনি সেখানে ছিল না এমন কাউকে লিখিতভাবে একটি সমস্যা স্পষ্টভাবে ব্যাখ্যা করতে পারেন কিনা'],
        ]
      ),

      callout('warning', '<p>আপনি ইতিমধ্যে সবকিছু জানেন এমন দেখানোর চেষ্টা সবচেয়ে সাধারণ junior ভুল, আর এটি নির্দিষ্টভাবে ব্যর্থ হয়। অভিজ্ঞ interviewer কয়েকটি follow-up প্রশ্নের মধ্যেই আসল গভীরতা আর মুখস্থ করা উত্তরের মধ্যে পার্থক্য বলতে পারে — আর ধরা পড়া একজন প্রার্থীকে শুরু থেকে একটি ফাঁক সম্পর্কে সৎ থাকা একজনের চেয়ে কম বিশ্বাস করা হয়।</p>', 'নেই এমন দক্ষতার অভিনয় করবেন না'),

      h(2, 'শিক্ষার্থীরা কী ধরে নেয় আর আসলে কী গুরুত্বপূর্ণ তার মধ্যে ফাঁক', 'the-gap-between-what-students-assume-and-what-actually-matters'),
      table(
        ['শিক্ষার্থীরা প্রায়ই ভাবে সবচেয়ে গুরুত্বপূর্ণ কী', 'আসলে বেশি ওজন বহন করে কী'],
        [
          ['প্রতিটি framework ফিচার জানা', 'মূল বিষয়ে শক্ত থাকা আর বাকিটা কীভাবে খুঁজতে হয় জানা'],
          ['একটি চিত্তাকর্ষক শোনানো প্রোজেক্টের ধারণা থাকা', 'একটি ছোট প্রোজেক্ট থাকা যা সত্যিই শেষ আর বোঝা'],
          ['সবকিছু নিয়ে আত্মবিশ্বাসী শোনানো', 'আপনি কী জানেন আর কী জানেন না তা নিয়ে সঠিক থাকা'],
          ['CV-তে প্রযুক্তির একটি লম্বা তালিকা', 'একটি ছোট সেটে আসল গভীরতা, যা নিয়ে আপনি আসলে আলোচনা করতে পারেন'],
        ]
      ),

      h(2, 'ভিন্ন কোম্পানি, ভিন্ন মান', 'different-companies-different-bars'),
      p('<p>একটি বড় কোম্পানি ব্যাচে junior নিয়োগ করলে প্রায়ই প্রধানত মূল বিষয় আর সমস্যা সমাধানে ছাঁকে, কারণ পরে প্রশিক্ষণ ব্যবস্থা আছে। একটি ছোট ব্যবসা বা agency সরাসরি একজন junior নিয়োগ করলে প্রায়ই বেশি "এই ব্যক্তি কয়েক সপ্তাহের মধ্যে কাজের হতে পারবে কিনা" তে ছাঁকে, কারণ ভরসা করার মতো কোনো আনুষ্ঠানিক onboarding প্রোগ্রাম নেই।</p><p>কোনোটিই ভুল নয় — তারা ভিন্ন জিনিসের জন্য পরীক্ষা করছে কারণ চাকরিটি নিজেই ভিন্ন। একটি ইন্টারভিউর আগে আপনি কোন পরিস্থিতিতে আছেন তা জেনে নেওয়া সার্থক, কারণ এটি কী জোর দিতে হবে তা বদলায়।</p>'),

      h(2, 'ব্যবহারিক শিক্ষা', 'the-practical-takeaway'),
      p('<p>আপনাকে একজন senior developer-এর সাথে তুলনা করা হচ্ছে না। আপনাকে অন্য junior-দের সাথে তুলনা করা হচ্ছে, যাদের বেশিরভাগের আপনার মতোই একই ফাঁক আছে। যে প্রার্থী আলাদা দাঁড়ায় সে সাধারণত সবচেয়ে বেশি জানা একজন নয় — এটি সে যে মূল বিষয়ে শক্ত, সীমা সম্পর্কে সৎ, আর স্পষ্টভাবে বাকিটা শেখার সক্ষম।</p>'),
    ],
  },
})

lessons.push({
  slug: 'the-realistic-first-job-landscape',
  sortOrder: 3,
  en: {
    title: 'The Realistic First-Job Landscape',
    metaTitle: 'The Realistic First-Job Landscape | Learn Computer Academy',
    metaDescription: 'Most students aim only at a full-time developer job at a company. There are several other real routes in, and knowing them changes what to prepare for.',
    blocks: [
      p('<p>Ask most students what they\'re aiming for and the answer is the same: "a job at a company." That is one real path, and it is the hardest one to enter from a standing start with no experience. It is not the only path, and treating it as the only one narrows your options for no good reason.</p>'),

      h(2, 'The Routes That Actually Exist'),
      table(
        ['Route', 'What it looks like', 'Getting in'],
        [
          ['Full-time at a company', 'Salaried, structured, a defined role', 'Hardest to enter cold; usually needs a portfolio, referral, or standout interview'],
          ['Agency or studio', 'Building sites/apps for various clients', 'Often more open to juniors with a decent portfolio, since the work is varied and the training is on the job'],
          ['Internship', 'Fixed-term, sometimes paid, sometimes not', 'Lower bar to enter; the point is experience and a reference, not the salary'],
          ['Freelance', 'Direct clients, project-based', 'No gatekeeper at all — the barrier is finding clients, not passing a screen'],
          ['Contract / part-time', 'Defined project, defined period', 'Often found through people you already know'],
        ]
      ),

      h(2, 'Why This Matters'),
      p('<p>Each route rewards a different kind of preparation. A company job rewards a strong CV, a clean portfolio, and interview performance. Freelance work rewards being findable, being trustworthy to a stranger quickly, and pricing sensibly. An agency often cares most about whether you can be handed a task and get on with it.</p><p>Preparing only for the company-job path, and only for that one, means the other routes — several of which are genuinely faster to enter — never get tried.</p>'),

      callout('note', '<p>These routes are not ranked by prestige here, and that is deliberate. A freelance project that pays and produces a happy client is not a lesser outcome than a full-time offer — it is a different outcome, and for many students starting out, it is the more realistic near-term one. Later lessons in this course cover freelancing directly.</p>'),

      h(2, 'They Feed Each Other'),
      p('<p>These paths are not walled off from one another. An internship becomes a reference for a full-time application. A freelance project becomes a portfolio piece and a case study. A contract role becomes a full-time offer once someone sees the work. Very few careers move in a straight line from "finished a course" to "salaried job" — most zigzag through two or three of these first.</p>'),

      h(2, 'What to Actually Do With This'),
      p('<p>Do not pick one route and ignore the rest. Build a portfolio strong enough for a company application, and simultaneously stay open to a small freelance project or an internship if one appears first. The first income, the first reference, and the first piece of real experience matter more than which category it falls into.</p>'),
    ],
  },
  bn: {
    title: 'বাস্তবসম্মত প্রথম-চাকরির দৃশ্যপট',
    metaTitle: 'বাস্তবসম্মত প্রথম-চাকরির দৃশ্যপট | Learn Computer Academy',
    metaDescription: 'বেশিরভাগ শিক্ষার্থী শুধু একটি কোম্পানিতে পূর্ণকালীন ডেভেলপার চাকরির দিকে লক্ষ্য করে। ঢোকার আরও কয়েকটি বাস্তব পথ আছে, আর সেগুলো জানা কী প্রস্তুত করতে হবে তা বদলায়।',
    blocks: [
      p('<p>বেশিরভাগ শিক্ষার্থীকে জিজ্ঞাসা করুন তারা কীসের দিকে লক্ষ্য করছে, উত্তর একই: "একটি কোম্পানিতে একটি চাকরি।" এটি একটি বাস্তব পথ, আর কোনো অভিজ্ঞতা ছাড়া দাঁড়িয়ে থাকা অবস্থা থেকে ঢোকা এটিই সবচেয়ে কঠিন। এটি একমাত্র পথ নয়, আর এটিকে একমাত্র হিসেবে গণ্য করা কোনো ভালো কারণ ছাড়াই আপনার বিকল্প সংকীর্ণ করে।</p>'),

      h(2, 'যে পথগুলো আসলে আছে', 'the-routes-that-actually-exist'),
      table(
        ['পথ', 'এটি দেখতে কেমন', 'ঢোকা'],
        [
          ['একটি কোম্পানিতে পূর্ণকালীন', 'বেতনভুক্ত, কাঠামোগত, একটি সংজ্ঞায়িত ভূমিকা', 'শীতল অবস্থা থেকে ঢোকা সবচেয়ে কঠিন; সাধারণত একটি portfolio, referral, বা দুর্দান্ত ইন্টারভিউ দরকার'],
          ['Agency বা studio', 'বিভিন্ন ক্লায়েন্টের জন্য সাইট/app তৈরি', 'একটি মোটামুটি portfolioযুক্ত junior-দের জন্য প্রায়ই বেশি খোলা, কারণ কাজ বৈচিত্র্যময় আর প্রশিক্ষণটি কাজের মধ্যেই'],
          ['Internship', 'নির্দিষ্ট-সময়ের, কখনো বেতনযুক্ত, কখনো নয়', 'ঢোকার মান কম; মূল কথা অভিজ্ঞতা আর একটি reference, বেতন নয়'],
          ['Freelance', 'সরাসরি ক্লায়েন্ট, প্রোজেক্ট-ভিত্তিক', 'একেবারেই কোনো gatekeeper নেই — বাধাটি ক্লায়েন্ট খুঁজে পাওয়া, একটি screen পাস করা নয়'],
          ['Contract / খণ্ডকালীন', 'সংজ্ঞায়িত প্রোজেক্ট, সংজ্ঞায়িত সময়কাল', 'প্রায়ই আপনার ইতিমধ্যে চেনা মানুষের মাধ্যমে পাওয়া যায়'],
        ]
      ),

      h(2, 'এটি কেন গুরুত্বপূর্ণ', 'why-this-matters'),
      p('<p>প্রতিটি পথ ভিন্ন ধরনের প্রস্তুতিকে পুরস্কৃত করে। একটি কোম্পানির চাকরি একটি শক্তিশালী CV, একটি পরিষ্কার portfolio, আর ইন্টারভিউ পারফরম্যান্সকে পুরস্কৃত করে। Freelance কাজ খুঁজে পাওয়ার যোগ্য হওয়া, দ্রুত একজন অচেনা মানুষের কাছে বিশ্বাসযোগ্য হওয়া, আর যুক্তিসঙ্গতভাবে দাম ঠিক করাকে পুরস্কৃত করে। একটি Agency প্রায়ই সবচেয়ে বেশি চিন্তিত আপনাকে একটি কাজ দেওয়া হলে আপনি এগিয়ে যেতে পারেন কিনা তা নিয়ে।</p><p>শুধু কোম্পানি-চাকরির পথের জন্য প্রস্তুতি নেওয়া, আর শুধু সেটির জন্য, মানে অন্য পথগুলো — যার কয়েকটি সত্যিই ঢুকতে দ্রুত — কখনো চেষ্টা করা হয় না।</p>'),

      callout('note', '<p>এই পথগুলো এখানে মর্যাদা অনুযায়ী র‍্যাংক করা হয়নি, আর এটি ইচ্ছাকৃত। একটি freelance প্রোজেক্ট যা টাকা দেয় আর একজন খুশি ক্লায়েন্ট তৈরি করে তা একটি পূর্ণকালীন অফারের চেয়ে কম ফলাফল নয় — এটি একটি ভিন্ন ফলাফল, আর শুরু করা অনেক শিক্ষার্থীর জন্য, এটি বেশি বাস্তবসম্মত নিকট-মেয়াদি একটি। এই কোর্সের পরের পাঠ সরাসরি freelancing কভার করে।</p>'),

      h(2, 'তারা একে অপরকে খাওয়ায়', 'they-feed-each-other'),
      p('<p>এই পথগুলো একে অপর থেকে বেড়া দেওয়া নয়। একটি internship একটি পূর্ণকালীন আবেদনের জন্য একটি reference হয়ে ওঠে। একটি freelance প্রোজেক্ট একটি portfolio অংশ আর একটি case study হয়ে ওঠে। কাজটি দেখার পর একটি contract ভূমিকা একটি পূর্ণকালীন অফার হয়ে ওঠে। খুব কম ক্যারিয়ারই "একটি কোর্স শেষ করেছি" থেকে "বেতনভুক্ত চাকরি" পর্যন্ত সরলরেখায় চলে — বেশিরভাগ প্রথমে এগুলোর দুই বা তিনটির মধ্য দিয়ে আঁকাবাঁকা চলে।</p>'),

      h(2, 'এটি নিয়ে আসলে কী করবেন', 'what-to-actually-do-with-this'),
      p('<p>একটি পথ বেছে বাকিগুলো উপেক্ষা করবেন না। একটি কোম্পানির আবেদনের জন্য যথেষ্ট শক্তিশালী একটি portfolio তৈরি করুন, আর একই সাথে একটি ছোট freelance প্রোজেক্ট বা একটি internship প্রথমে এলে তার জন্য খোলা থাকুন। প্রথম আয়, প্রথম reference, আর বাস্তব অভিজ্ঞতার প্রথম অংশ এটি কোন শ্রেণীতে পড়ে তার চেয়ে বেশি গুরুত্বপূর্ণ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'assessing-yourself-honestly',
  sortOrder: 4,
  en: {
    title: 'Assessing Yourself Honestly',
    metaTitle: 'Assessing Yourself Honestly Before You Apply | Learn Computer Academy',
    metaDescription: 'A blunt, structured way to check where you actually stand before applying — because a wrong self-assessment wastes effort in the wrong direction.',
    blocks: [
      p('<p>Before applying anywhere, it helps to know honestly where you actually stand. Not to discourage yourself, and not to inflate your confidence either — just an accurate picture, because acting on a wrong one wastes effort in the wrong direction.</p>'),

      h(2, 'Two Ways This Goes Wrong'),
      p('<p>Underestimating yourself means not applying to things you were actually ready for, or apologising for gaps that are completely normal at this stage. Overestimating yourself means walking into interviews unprepared for basic questions, or applying only to roles well beyond your current level and collecting rejections that a slightly different target would have avoided.</p><p>Both come from the same root cause: not having checked honestly beforehand.</p>'),

      h(2, 'A Straightforward Self-Check'),
      p('<ol><li><b>Can you build something small from scratch, with no tutorial open?</b> Not follow one — build something on your own once you\'ve learned the pieces. If not yet, this is the actual priority, ahead of applying anywhere.</li><li><b>Can you explain your own project out loud, clearly, in under two minutes?</b> If you struggle to explain it, an interviewer will notice, whatever the code looks like.</li><li><b>Do you know why your code works</b>, or did you copy a working pattern without fully following it? Both get something built; only the first survives being asked "why did you do it this way".</li><li><b>Can you read an error message and have a reasonable first guess at the cause?</b> This is the single most practical junior skill, and cheap to build with practice.</li><li><b>Have you ever had your code reviewed or criticised, and how did you react?</b> If the honest answer is "badly", that is worth working on before an interview, not after a bad one.</li></ol>'),

      callout('tip', '<p>Answer these in writing, honestly, dated. Revisit them monthly. The gap between this month\'s answers and last month\'s is a far better measure of progress than how you feel on any given day.</p>'),

      h(2, 'Where to Get an Outside View'),
      p('<p>Self-assessment has a limit — everyone is a poor judge of their own blind spots by definition. A second opinion helps: ask a teacher, a further-along peer, or anyone technical to look at one project and be genuinely honest, not encouraging. Encouraging feedback feels better and teaches you less.</p>'),

      h(2, 'What Not to Compare Yourself Against'),
      p('<p>Comparing yourself to senior developers, to impressive online portfolios built over years, or to the most advanced person in your batch produces discouragement with no useful information attached. The only comparison worth making is between where you are now and where you were a month ago, and between what you can currently do and what a junior role in this landscape actually requires — covered in the previous lesson.</p>'),
    ],
  },
  bn: {
    title: 'সততার সাথে নিজেকে মূল্যায়ন করা',
    metaTitle: 'আবেদনের আগে সততার সাথে নিজেকে মূল্যায়ন | Learn Computer Academy',
    metaDescription: 'আবেদন করার আগে আপনি আসলে কোথায় আছেন তা যাচাই করার একটি সরাসরি, কাঠামোগত উপায় — কারণ একটি ভুল স্ব-মূল্যায়ন ভুল দিকে পরিশ্রম নষ্ট করে।',
    blocks: [
      p('<p>যেকোনো জায়গায় আবেদন করার আগে, আপনি আসলে কোথায় আছেন তা সততার সাথে জানা সাহায্য করে। নিজেকে নিরুৎসাহিত করতে নয়, আর আপনার আত্মবিশ্বাস স্ফীত করতেও নয় — শুধু একটি সঠিক চিত্র, কারণ একটি ভুলের উপর কাজ করা ভুল দিকে পরিশ্রম নষ্ট করে।</p>'),

      h(2, 'দুটি উপায়ে এটি ভুল হয়', 'two-ways-this-goes-wrong'),
      p('<p>নিজেকে কম মূল্যায়ন করার অর্থ আপনি আসলে যার জন্য প্রস্তুত ছিলেন তাতে আবেদন না করা, বা এই পর্যায়ে সম্পূর্ণ স্বাভাবিক ফাঁকের জন্য ক্ষমা চাওয়া। নিজেকে বেশি মূল্যায়ন করার অর্থ মৌলিক প্রশ্নের জন্য অপ্রস্তুত অবস্থায় ইন্টারভিউতে হাঁটা, বা শুধু আপনার বর্তমান স্তরের অনেক ঊর্ধ্বে ভূমিকায় আবেদন করে এমন প্রত্যাখ্যান জমা করা যা কিছুটা ভিন্ন লক্ষ্য এড়াতে পারত।</p><p>দুটোই একই মূল কারণ থেকে আসে: আগে থেকে সততার সাথে যাচাই না করা।</p>'),

      h(2, 'একটি সরল স্ব-যাচাই', 'a-straightforward-self-check'),
      p('<p><ol><li><b>কোনো টিউটোরিয়াল খোলা ছাড়া আপনি কি শূন্য থেকে ছোট কিছু তৈরি করতে পারেন?</b> একটি অনুসরণ নয় — টুকরোগুলো শেখার পর নিজে থেকে কিছু তৈরি করুন। এখনো না পারলে, এটিই আসল অগ্রাধিকার, যেকোনো জায়গায় আবেদনের আগে।</li><li><b>আপনি কি জোরে, স্পষ্টভাবে, দুই মিনিটের কমে আপনার নিজের প্রোজেক্ট ব্যাখ্যা করতে পারেন?</b> এটি ব্যাখ্যা করতে সংগ্রাম করলে, একজন interviewer লক্ষ্য করবে, কোড যেমনই দেখাক।</li><li><b>আপনি কি জানেন আপনার কোড কেন কাজ করে</b>, নাকি সম্পূর্ণ অনুসরণ না করেই একটি কার্যকর প্যাটার্ন কপি করেছেন? দুটোই কিছু তৈরি করে; শুধু প্রথমটি "আপনি কেন এভাবে করেছেন" জিজ্ঞাসা করা টিকে থাকে।</li><li><b>আপনি কি একটি error বার্তা পড়তে পারেন আর কারণ সম্পর্কে একটি যুক্তিসঙ্গত প্রথম অনুমান করতে পারেন?</b> এটি একক সবচেয়ে ব্যবহারিক junior দক্ষতা, আর অনুশীলনে সস্তায় তৈরি হয়।</li><li><b>আপনার কোড কখনো review বা সমালোচিত হয়েছে, আর আপনি কীভাবে প্রতিক্রিয়া দিয়েছেন?</b> সৎ উত্তর "খারাপভাবে" হলে, একটি খারাপ ইন্টারভিউর পরে নয়, আগে এতে কাজ করা সার্থক।</li></ol></p>'),

      callout('tip', '<p>এগুলোর উত্তর লিখিতভাবে, সৎভাবে, তারিখসহ দিন। প্রতি মাসে আবার দেখুন। এই মাসের উত্তর আর গত মাসেরটির মধ্যে ফাঁকটি যেকোনো দিন আপনার কেমন লাগছে তার চেয়ে অগ্রগতির অনেক ভালো মাপ।</p>'),

      h(2, 'বাইরের একটি দৃষ্টিভঙ্গি কোথায় পাবেন', 'where-to-get-an-outside-view'),
      p('<p>স্ব-মূল্যায়নের একটি সীমা আছে — সংজ্ঞা অনুযায়ী সবাই নিজের অন্ধ বিন্দুর একজন খারাপ বিচারক। একটি দ্বিতীয় মতামত সাহায্য করে: একজন শিক্ষক, একজন এগিয়ে থাকা সমকক্ষ, বা যেকোনো টেকনিক্যাল কাউকে একটি প্রোজেক্ট দেখতে আর সত্যিই সৎ হতে বলুন, উৎসাহব্যঞ্জক নয়। উৎসাহব্যঞ্জক feedback ভালো লাগে আর আপনাকে কম শেখায়।</p>'),

      h(2, 'নিজেকে যার সাথে তুলনা করবেন না', 'what-not-to-compare-yourself-against'),
      p('<p>নিজেকে senior developer-দের সাথে, বছরের পর বছর ধরে তৈরি চিত্তাকর্ষক অনলাইন portfolio-র সাথে, বা আপনার ব্যাচের সবচেয়ে উন্নত ব্যক্তির সাথে তুলনা করলে কোনো কাজের তথ্য ছাড়াই নিরুৎসাহ তৈরি হয়। একমাত্র তুলনা করার যোগ্য হলো আপনি এখন কোথায় আছেন আর এক মাস আগে কোথায় ছিলেন তার মধ্যে, আর আপনি বর্তমানে কী করতে পারেন আর এই দৃশ্যপটে একটি junior ভূমিকা আসলে কী দাবি করে তার মধ্যে — আগের পাঠে কভার করা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'what-counts-as-a-portfolio-project',
  sortOrder: 5,
  en: {
    title: 'What Counts as a Portfolio Project',
    metaTitle: 'What Counts as a Portfolio Project | Learn Computer Academy',
    metaDescription: 'A tutorial you followed is not a portfolio project. What actually counts, why finished beats ambitious, and how many you genuinely need.',
    blocks: [
      p('<p>The word "project" gets used loosely, and the loose version is a common trap: something copied from a tutorial, with the name changed, is not a portfolio project. It proves you can follow instructions. A portfolio has to prove something more than that.</p>'),

      h(2, 'What a Real Project Demonstrates'),
      p('<p>A project worth showing answers three questions for whoever looks at it: <b>can this person build something that works, did they make real decisions along the way, and can they explain those decisions?</b> A copied tutorial answers none of these, because every decision was already made by whoever wrote the tutorial.</p>'),

      table(
        ['Not a portfolio project', 'A portfolio project'],
        [
          ['Followed a tutorial exactly, renamed it', 'Built something with your own structure and decisions, even if small'],
          ['Copied someone else\'s design pixel for pixel', 'Solved a real (even small) problem for a real or plausible user'],
          ['Never deployed — only runs on your laptop', 'Live, at a real URL anyone can visit'],
          ['No README, no explanation', 'Explains what it does, why, and what you\'d improve'],
          ['Perfect and abandoned the moment it worked', 'Has at least one commit history showing it was iterated on'],
        ]
      ),

      img(
        'docs/img/career/portfolio-project-1',
        'A young developer working late at a laptop with a deployed web project visible on screen, notes and a notebook on the desk beside them',
        1024, 768,
        'A small, finished, deployed project you understand deeply beats an ambitious one that never shipped.'
      ),

      h(2, 'Finished and Small Beats Ambitious and Incomplete'),
      p('<p>A simple to-do app that is fully finished, deployed, and that you can explain in detail is worth more than an ambitious social network clone that is half-built and abandoned. An interviewer can only evaluate what actually exists. An unfinished ambitious project mostly demonstrates that you started something you couldn\'t finish — which is the opposite of what you want to show.</p>'),

      callout('warning', '<p>The most common way students waste months: picking a project far beyond their current level, getting stuck, and never shipping anything. Scope down until you are confident you can finish it in the time you actually have, then build that.</p>', 'Scope for finishing, not for impressing'),

      h(2, 'How Many You Actually Need'),
      p('<p>Two or three genuinely finished, understood, deployed projects beat ten half-finished ones, every time. Depth beats a long list — an interviewer will usually pick one project and go deep on it, and a thin list with real substance in each entry survives that far better than a long list that collapses under one follow-up question.</p>'),

      h(2, 'Where Project Ideas Come From'),
      p('<p>A genuine small problem you or someone you know actually has works best — it is easier to explain convincingly because it is real. Failing that, rebuild something ordinary (a small e-commerce page, a booking form, a simple dashboard) but with your own data, your own design decisions, and features you added because you thought they belonged there, not because a tutorial listed them.</p>'),
    ],
  },
  bn: {
    title: 'একটি Portfolio প্রোজেক্ট হিসেবে কী গণ্য হয়',
    metaTitle: 'একটি Portfolio প্রোজেক্ট হিসেবে কী গণ্য হয় | Learn Computer Academy',
    metaDescription: 'আপনার অনুসরণ করা একটি টিউটোরিয়াল একটি portfolio প্রোজেক্ট নয়। আসলে কী গণ্য হয়, শেষ করা কেন উচ্চাভিলাষীকে হারায়, আর আপনার আসলে কতগুলো দরকার।',
    blocks: [
      p('<p>"প্রোজেক্ট" শব্দটি ঢিলেভাবে ব্যবহৃত হয়, আর ঢিলে সংস্করণটি একটি সাধারণ ফাঁদ: একটি টিউটোরিয়াল থেকে কপি করা কিছু, নাম বদলে, একটি portfolio প্রোজেক্ট নয়। এটি প্রমাণ করে আপনি নির্দেশনা অনুসরণ করতে পারেন। একটি portfolio-কে এর চেয়ে বেশি কিছু প্রমাণ করতে হয়।</p>'),

      h(2, 'একটি আসল প্রোজেক্ট কী দেখায়', 'what-a-real-project-demonstrates'),
      p('<p>দেখার যোগ্য একটি প্রোজেক্ট যে কেউ দেখে তার তিনটি প্রশ্নের উত্তর দেয়: <b>এই ব্যক্তি কাজ করে এমন কিছু তৈরি করতে পারে, পথে তারা আসল সিদ্ধান্ত নিয়েছে, আর তারা সেই সিদ্ধান্ত ব্যাখ্যা করতে পারে কিনা।</b> একটি কপি করা টিউটোরিয়াল এর কোনোটির উত্তর দেয় না, কারণ প্রতিটি সিদ্ধান্ত ইতিমধ্যে টিউটোরিয়াল যে লিখেছে সে নিয়ে নিয়েছে।</p>'),

      table(
        ['একটি Portfolio প্রোজেক্ট নয়', 'একটি Portfolio প্রোজেক্ট'],
        [
          ['একটি টিউটোরিয়াল ঠিক অনুসরণ করেছে, নাম বদলেছে', 'নিজস্ব গঠন আর সিদ্ধান্তসহ কিছু তৈরি করেছে, ছোট হলেও'],
          ['অন্য কারো ডিজাইন পিক্সেলে পিক্সেলে কপি করেছে', 'একটি বাস্তব (এমনকি ছোট) সমস্যা একজন বাস্তব বা বিশ্বাসযোগ্য ব্যবহারকারীর জন্য সমাধান করেছে'],
          ['কখনো deploy হয়নি — শুধু আপনার ল্যাপটপে চলে', 'লাইভ, একটি আসল URL-এ যে কেউ যেতে পারে'],
          ['কোনো README নেই, কোনো ব্যাখ্যা নেই', 'এটি কী করে, কেন, আর আপনি কী উন্নত করতেন তা ব্যাখ্যা করে'],
          ['নিখুঁত আর কাজ করার মুহূর্তেই পরিত্যক্ত', 'অন্তত একটি commit ইতিহাস আছে যা দেখায় এটিতে পুনরাবৃত্তি হয়েছে'],
        ]
      ),

      img(
        'docs/img/career/portfolio-project-1',
        'একজন তরুণ ডেভেলপার রাতে একটি ল্যাপটপে কাজ করছেন, স্ক্রিনে একটি deploy করা ওয়েব প্রোজেক্ট দৃশ্যমান, ডেস্কের পাশে নোট আর একটি নোটবুক',
        1024, 768,
        'আপনার গভীরভাবে বোঝা একটি ছোট, শেষ, deploy করা প্রোজেক্ট এমন একটি উচ্চাভিলাষী প্রোজেক্টকে হারায় যা কখনো ship হয়নি।'
      ),

      h(2, 'শেষ আর ছোট উচ্চাভিলাষী আর অসম্পূর্ণকে হারায়', 'finished-and-small-beats-ambitious-and-incomplete'),
      p('<p>সম্পূর্ণভাবে শেষ, deploy করা, আর আপনি বিস্তারিত ব্যাখ্যা করতে পারেন এমন একটি সরল to-do app একটি উচ্চাভিলাষী সোশ্যাল নেটওয়ার্কের নকল যা অর্ধেক তৈরি আর পরিত্যক্ত তার চেয়ে বেশি মূল্যবান। একজন interviewer শুধু আসলে যা আছে তা মূল্যায়ন করতে পারেন। একটি অসম্পূর্ণ উচ্চাভিলাষী প্রোজেক্ট বেশিরভাগ দেখায় আপনি এমন কিছু শুরু করেছিলেন যা শেষ করতে পারেননি — যা আপনি দেখাতে চান তার উল্টো।</p>'),

      callout('warning', '<p>শিক্ষার্থীরা যেভাবে সবচেয়ে বেশি মাস নষ্ট করে: তাদের বর্তমান স্তরের অনেক বাইরে একটি প্রোজেক্ট বাছা, আটকে যাওয়া, আর কখনো কিছু ship না করা। আপনার আসলে থাকা সময়ে এটি শেষ করার আত্মবিশ্বাসী না হওয়া পর্যন্ত scope কমান, তারপর সেটি তৈরি করুন।</p>', 'চিত্তাকর্ষক করার জন্য নয়, শেষ করার জন্য scope করুন'),

      h(2, 'আপনার আসলে কতগুলো দরকার', 'how-many-you-actually-need'),
      p('<p>দুই বা তিনটি সত্যিই শেষ, বোঝা, deploy করা প্রোজেক্ট দশটি অর্ধ-শেষ প্রোজেক্টকে প্রতিবারই হারায়। একটি লম্বা তালিকার চেয়ে গভীরতা ভালো — একজন interviewer সাধারণত একটি প্রোজেক্ট বাছবেন আর সেটিতে গভীরে যাবেন, আর প্রতিটি এন্ট্রিতে আসল সারবত্তাসহ একটি পাতলা তালিকা একটি ফলো-আপ প্রশ্নে ভেঙে পড়া একটি লম্বা তালিকার চেয়ে অনেক ভালো টিকে থাকে।</p>'),

      h(2, 'প্রোজেক্টের ধারণা কোথা থেকে আসে', 'where-project-ideas-come-from'),
      p('<p>আপনার বা আপনার চেনা কারো সত্যিই থাকা একটি প্রকৃত ছোট সমস্যা সবচেয়ে ভালো কাজ করে — বিশ্বাসযোগ্যভাবে ব্যাখ্যা করা সহজ কারণ এটি বাস্তব। সেটি না হলে, সাধারণ কিছু পুনর্নির্মাণ করুন (একটি ছোট e-commerce পাতা, একটি বুকিং form, একটি সরল dashboard) কিন্তু আপনার নিজের ডেটা, আপনার নিজের ডিজাইন সিদ্ধান্ত, আর আপনি যোগ করেছেন এমন ফিচার নিয়ে কারণ আপনি ভেবেছেন সেগুলো সেখানে থাকা উচিত, একটি টিউটোরিয়াল সেগুলো তালিকাভুক্ত করেছিল বলে নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'building-and-presenting-your-portfolio',
  sortOrder: 6,
  en: {
    title: 'Building and Presenting Your Portfolio',
    metaTitle: 'Building and Presenting Your Portfolio | Learn Computer Academy',
    metaDescription: 'A portfolio site does not need to be elaborate. What it actually needs to contain, and the presentation mistakes that undersell real work.',
    blocks: [
      p('<p>A portfolio is where your projects from the previous lesson actually get seen. It does not need to be elaborate — it needs to be clear, and it needs to exist. A brilliant project with no portfolio page describing it might as well not exist to someone screening candidates.</p>'),

      h(2, 'What It Needs to Contain'),
      p('<ul><li><b>Who you are and what you do</b>, in one or two sentences — not a life story.</li><li><b>Two or three projects</b>, each with a live link, a source code link, a short description of the problem it solves, and the specific technologies used.</li><li><b>A way to contact you</b> — email at minimum, visible without hunting.</li><li><b>Optional but useful:</b> a short note on what you\'re learning next, which shows momentum rather than a finished, static state.</li></ul>'),

      h(2, 'Describing a Project Well'),
      p('<p>For each project, three short things matter more than a long writeup: <b>what problem it solves</b>, <b>what you specifically decided or built</b> (not just the tech stack), and <b>what you\'d do differently now</b>. That last one matters more than it seems — it shows judgment has developed since you built it, which is exactly what a reviewer wants to see.</p>'),
      code('text', 'Weak: "A to-do app built with React."\n\nBetter: "A to-do app with drag-to-reorder tasks and local storage\nso data survives a refresh. I originally stored everything in one\ncomponent\'s state; splitting it into a custom hook after the app\ngrew past three components taught me why that separation matters."'),

      h(2, 'The Presentation Mistakes That Undersell Real Work'),
      p('<ul><li><b>No live link.</b> A GitHub repo alone asks the reviewer to run your code locally, and almost nobody will. Deploy it — a free static host or a simple platform is enough for most student projects.</li><li><b>No screenshots or a broken deploy.</b> Check live links work before sending them anywhere. A dead link is worse than no link.</li><li><b>Overwritten with generic template text.</b> "Lorem ipsum", placeholder images, and unedited starter-kit text signal the project was abandoned before it was finished.</li><li><b>Burying the good project under weaker ones.</b> Lead with your strongest work, not chronological order.</li></ul>'),

      callout('tip', '<p>Your portfolio site is itself a project, and it is often the first thing anyone sees — so it should reflect the same standard you\'re asking to be judged by. A portfolio site that is slow, broken on mobile, or has visible bugs undermines everything it is trying to show.</p>'),

      h(2, 'You Do Not Need a Custom-Built Site to Start'),
      p('<p>A single clean page, or even a well-organised GitHub profile README with pinned repositories, is enough to begin applying. Building an elaborate portfolio site is a reasonable project in itself, but do not let building it become the reason you delay applying anywhere.</p>'),
    ],
  },
  bn: {
    title: 'আপনার Portfolio তৈরি আর উপস্থাপন করা',
    metaTitle: 'আপনার Portfolio তৈরি আর উপস্থাপন করা | Learn Computer Academy',
    metaDescription: 'একটি portfolio সাইটের বিস্তৃত হওয়ার প্রয়োজন নেই। এতে আসলে কী থাকা দরকার, আর উপস্থাপনার ভুল যা বাস্তব কাজকে কম দেখায়।',
    blocks: [
      p('<p>একটি portfolio হলো যেখানে আগের পাঠের আপনার প্রোজেক্ট আসলে দেখা যায়। এটি বিস্তৃত হওয়ার প্রয়োজন নেই — এটি স্পষ্ট হওয়া দরকার, আর এর অস্তিত্ব থাকা দরকার। একটি চমৎকার প্রোজেক্ট যা বর্ণনা করা কোনো portfolio পাতা নেই তা প্রার্থী ছাঁকা কারো কাছে না থাকার মতোই।</p>'),

      h(2, 'এতে কী থাকা দরকার', 'what-it-needs-to-contain'),
      p('<ul><li><b>আপনি কে আর কী করেন</b>, এক বা দুই বাক্যে — একটি জীবনকাহিনী নয়।</li><li><b>দুই বা তিনটি প্রোজেক্ট</b>, প্রতিটির একটি live লিংক, একটি সোর্স কোড লিংক, এটি যে সমস্যা সমাধান করে তার একটি সংক্ষিপ্ত বর্ণনা, আর ব্যবহৃত নির্দিষ্ট প্রযুক্তি।</li><li><b>যোগাযোগের একটি উপায়</b> — অন্তত ইমেইল, খুঁজতে না হয়ে দৃশ্যমান।</li><li><b>ঐচ্ছিক কিন্তু কাজের:</b> আপনি এরপর কী শিখছেন তার একটি ছোট নোট, যা একটি শেষ, স্থির অবস্থার বদলে গতি দেখায়।</li></ul>'),

      h(2, 'একটি প্রোজেক্ট ভালোভাবে বর্ণনা করা', 'describing-a-project-well'),
      p('<p>প্রতিটি প্রোজেক্টের জন্য, তিনটি ছোট জিনিস একটি দীর্ঘ লেখার চেয়ে বেশি গুরুত্বপূর্ণ: <b>এটি কী সমস্যা সমাধান করে</b>, <b>আপনি নির্দিষ্টভাবে কী সিদ্ধান্ত নিয়েছেন বা তৈরি করেছেন</b> (শুধু tech stack নয়), আর <b>আপনি এখন কী ভিন্নভাবে করতেন</b>। শেষটি যতটা মনে হয় তার চেয়ে বেশি গুরুত্বপূর্ণ — এটি দেখায় আপনি এটি তৈরি করার পর থেকে বিচারশক্তি বিকশিত হয়েছে, যা ঠিক একজন পর্যালোচক দেখতে চায়।</p>'),
      code('text', 'দুর্বল: "React দিয়ে তৈরি একটি to-do app।"\n\nভালো: "Drag-to-reorder কাজসহ একটি to-do app আর local storage\nযাতে refresh-এও ডেটা টিকে থাকে। আমি মূলত সবকিছু একটি\ncomponent-এর state-এ রেখেছিলাম; app তিনটি component ছাড়িয়ে\nবাড়ার পর এটিকে একটি কাস্টম hook-এ ভাগ করা আমাকে শিখিয়েছে\nসেই আলাদাকরণ কেন গুরুত্বপূর্ণ।"'),

      h(2, 'উপস্থাপনার ভুল যা বাস্তব কাজকে কম দেখায়', 'the-presentation-mistakes-that-undersell-real-work'),
      p('<ul><li><b>কোনো live লিংক নেই।</b> শুধু একটি GitHub repo পর্যালোচককে স্থানীয়ভাবে আপনার কোড চালাতে বলে, আর প্রায় কেউই করবে না। এটি deploy করুন — বেশিরভাগ শিক্ষার্থী প্রোজেক্টের জন্য একটি বিনামূল্যের static host বা একটি সরল প্ল্যাটফর্ম যথেষ্ট।</li><li><b>কোনো screenshot নেই বা একটি ভাঙা deploy।</b> কোথাও পাঠানোর আগে live লিংক কাজ করে কিনা যাচাই করুন। একটি মৃত লিংক কোনো লিংকের চেয়ে খারাপ।</li><li><b>সাধারণ টেমপ্লেট টেক্সট দিয়ে ওভাররাইট করা।</b> "Lorem ipsum", placeholder ছবি, আর অসম্পাদিত starter-kit টেক্সট সংকেত দেয় প্রোজেক্টটি শেষ হওয়ার আগেই পরিত্যক্ত হয়েছে।</li><li><b>ভালো প্রোজেক্টটি দুর্বলগুলোর নিচে চাপা দেওয়া।</b> সময়ানুক্রম নয়, আপনার সবচেয়ে শক্তিশালী কাজ দিয়ে শুরু করুন।</li></ul>'),

      callout('tip', '<p>আপনার portfolio সাইট নিজেই একটি প্রোজেক্ট, আর এটিই প্রায়ই প্রথম জিনিস যা কেউ দেখে — তাই এটি একই মান প্রতিফলিত করা উচিত যা দিয়ে আপনি বিচার হতে চাইছেন। যে portfolio সাইট ধীর, মোবাইলে ভাঙা, বা দৃশ্যমান bug আছে তা যা দেখানোর চেষ্টা করছে তার সবকিছু দুর্বল করে।</p>'),

      h(2, 'শুরু করতে আপনার একটি কাস্টম-তৈরি সাইটের প্রয়োজন নেই', 'you-do-not-need-a-custom-built-site-to-start'),
      p('<p>একটি একক পরিষ্কার পাতা, বা এমনকি pinned repository সহ একটি ভালোভাবে সংগঠিত GitHub প্রোফাইল README, আবেদন শুরু করতে যথেষ্ট। একটি বিস্তৃত portfolio সাইট তৈরি করা নিজেই একটি যুক্তিসঙ্গত প্রোজেক্ট, কিন্তু এটি তৈরি করাকে যেকোনো জায়গায় আবেদন করতে দেরি করার কারণ হতে দেবেন না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'github-for-job-seekers',
  sortOrder: 7,
  en: {
    title: 'GitHub for Job Seekers',
    metaTitle: 'GitHub for Job Seekers | Learn Computer Academy',
    metaDescription: 'A GitHub profile is often checked before a CV is read closely. What a recruiter actually looks at, and the small habits that make a real difference.',
    blocks: [
      p('<p>For a developer role, a GitHub profile is often checked before the CV is read closely — it is faster proof than a paragraph of claims. It does not need to be extensive. It needs to look like an active, real account rather than an empty one.</p>'),

      h(2, 'What Gets Looked At'),
      p('<ul><li><b>Are there real repositories</b>, or is the account essentially empty?</li><li><b>Do commit histories show actual work over time</b>, or one giant commit that dumped a finished project in at once?</li><li><b>Are there READMEs</b> explaining what each project is?</li><li><b>Is anything recent?</b> A profile untouched for a year reads as inactive, fairly or not.</li></ul><p>Nobody expects hundreds of repositories or a packed contribution graph. A handful of genuine, explained projects is worth far more than a large number of copied or abandoned ones.</p>'),

      h(2, 'Commit History Is Evidence'),
      p('<p>A project uploaded as a single commit reads as "I built this somewhere else and dumped it here" — even if that is not what happened. A project with a real sequence of commits shows the actual process: getting something basic working, then improving it. That sequence is itself evidence of how you work, which is exactly what a reviewer is trying to assess.</p>'),
      code('bash', '# A believable history — small, incremental commits\ngit commit -m "Add basic task list with add/remove"\ngit commit -m "Persist tasks to local storage"\ngit commit -m "Add drag-to-reorder"\ngit commit -m "Fix reorder bug when list is empty"\n\n# Not this — one commit, no visible process\ngit commit -m "Finished project"'),

      h(2, 'Writing a README That Actually Helps'),
      p('<p>A minimal README that helps a reviewer: what the project does, in one or two sentences; how to run it locally; what you would improve if you kept working on it. That third point matters more than it looks — it is a direct, low-effort way to demonstrate judgment, and almost nobody includes it.</p>'),

      h(2, 'Cleaning Up Before You Apply'),
      p('<ul><li>Pin your two or three best projects to the top of your profile.</li><li>Delete or make private anything that is genuinely embarrassing — a first attempt with no structure, an unfinished copy of a tutorial with no explanation.</li><li>Add a short bio and, if you have one, a link to your portfolio site.</li><li>Use a real profile photo. An anonymous default icon reads as an inactive or throwaway account.</li></ul>'),

      callout('warning', '<p>Do not delete everything imperfect. A profile with three polished projects and nothing else can look staged. A messier history with visible early struggles alongside genuinely good recent work reads as more credible, not less — it shows growth, which is exactly what a junior candidate is supposed to demonstrate.</p>', 'Do not over-curate'),

      h(2, 'Contributing to Other Projects'),
      p('<p>A small, genuine contribution to someone else\'s open-source project — fixing a typo in documentation, a small bug fix — is a real signal, because it means working within someone else\'s existing code and conventions, which is closer to an actual job than a solo project is. It is optional and not expected of a junior candidate, but it stands out when present.</p>'),
    ],
  },
  bn: {
    title: 'চাকরিপ্রার্থীদের জন্য GitHub',
    metaTitle: 'চাকরিপ্রার্থীদের জন্য GitHub | Learn Computer Academy',
    metaDescription: 'একটি CV ভালোভাবে পড়ার আগে প্রায়ই একটি GitHub প্রোফাইল যাচাই করা হয়। একজন recruiter আসলে কী দেখেন, আর যে ছোট অভ্যাস আসল পার্থক্য তৈরি করে।',
    blocks: [
      p('<p>একটি ডেভেলপার ভূমিকার জন্য, CV ভালোভাবে পড়ার আগে প্রায়ই একটি GitHub প্রোফাইল যাচাই করা হয় — এটি দাবির একটি অনুচ্ছেদের চেয়ে দ্রুত প্রমাণ। এটি বিস্তৃত হওয়ার প্রয়োজন নেই। এটিকে একটি খালি অ্যাকাউন্টের বদলে একটি সক্রিয়, বাস্তব অ্যাকাউন্টের মতো দেখাতে হবে।</p>'),

      h(2, 'কী দেখা হয়', 'what-gets-looked-at'),
      p('<ul><li><b>আসল repository আছে কি</b>, নাকি অ্যাকাউন্টটি মূলত খালি?</li><li><b>Commit ইতিহাস সময়ের সাথে আসল কাজ দেখায়</b>, নাকি একবারে একটি শেষ প্রোজেক্ট ফেলে দেওয়া একটি বিশাল commit?</li><li><b>প্রতিটি প্রোজেক্ট কী তা ব্যাখ্যা করা README আছে কি?</b></li><li><b>সাম্প্রতিক কিছু আছে কি?</b> এক বছর অস্পর্শিত একটি প্রোফাইল ন্যায্য হোক বা না হোক নিষ্ক্রিয় হিসেবে পড়া যায়।</li></ul><p>কেউ শত শত repository বা একটি ভরা contribution গ্রাফ আশা করে না। মুষ্টিমেয় সত্যিকারের, ব্যাখ্যা করা প্রোজেক্ট একটি বড় সংখ্যক কপি করা বা পরিত্যক্তগুলোর চেয়ে অনেক বেশি মূল্যবান।</p>'),

      h(2, 'Commit ইতিহাস প্রমাণ', 'commit-history-is-evidence'),
      p('<p>একটি একক commit হিসেবে আপলোড করা একটি প্রোজেক্ট এমন পড়া যায় "আমি এটি অন্য কোথাও তৈরি করেছি আর এখানে ফেলে দিয়েছি" — এমনকি সেটি না ঘটে থাকলেও। বাস্তব commit-এর একটি ক্রমযুক্ত একটি প্রোজেক্ট আসল প্রক্রিয়া দেখায়: মৌলিক কিছু কাজ করানো, তারপর এটি উন্নত করা। সেই ক্রমটি নিজেই আপনি কীভাবে কাজ করেন তার প্রমাণ, যা ঠিক একজন পর্যালোচক মূল্যায়ন করার চেষ্টা করছেন।</p>'),
      code('bash', '# একটি বিশ্বাসযোগ্য ইতিহাস — ছোট, ক্রমিক commit\ngit commit -m "Add basic task list with add/remove"\ngit commit -m "Persist tasks to local storage"\ngit commit -m "Add drag-to-reorder"\ngit commit -m "Fix reorder bug when list is empty"\n\n# এটি নয় — একটি commit, কোনো দৃশ্যমান প্রক্রিয়া নেই\ngit commit -m "Finished project"'),

      h(2, 'একটি README লেখা যা আসলে সাহায্য করে', 'writing-a-readme-that-actually-helps'),
      p('<p>একজন পর্যালোচককে সাহায্য করে এমন একটি ন্যূনতম README: প্রোজেক্টটি কী করে, এক বা দুই বাক্যে; স্থানীয়ভাবে এটি কীভাবে চালাবেন; আপনি এতে কাজ চালিয়ে গেলে কী উন্নত করতেন। সেই তৃতীয় বিষয়টি যতটা মনে হয় তার চেয়ে বেশি গুরুত্বপূর্ণ — এটি বিচারশক্তি প্রদর্শনের একটি সরাসরি, কম পরিশ্রমের উপায়, আর প্রায় কেউ এটি অন্তর্ভুক্ত করে না।</p>'),

      h(2, 'আবেদনের আগে পরিষ্কার করা', 'cleaning-up-before-you-apply'),
      p('<ul><li>আপনার দুই বা তিনটি সেরা প্রোজেক্ট আপনার প্রোফাইলের উপরে pin করুন।</li><li>সত্যিই লজ্জাজনক যেকোনো কিছু মুছুন বা private করুন — কোনো গঠন ছাড়া একটি প্রথম প্রচেষ্টা, কোনো ব্যাখ্যা ছাড়া একটি টিউটোরিয়ালের অসম্পূর্ণ কপি।</li><li>একটি ছোট bio যোগ করুন, আর আপনার একটি থাকলে, আপনার portfolio সাইটের একটি লিংক।</li><li>একটি আসল প্রোফাইল ছবি ব্যবহার করুন। একটি নামহীন ডিফল্ট আইকন একটি নিষ্ক্রিয় বা ফেলনা অ্যাকাউন্ট হিসেবে পড়া যায়।</li></ul>'),

      callout('warning', '<p>অপূর্ণ সবকিছু মুছবেন না। তিনটি পরিমার্জিত প্রোজেক্ট আর আর কিছু না থাকা একটি প্রোফাইল সাজানো দেখাতে পারে। দৃশ্যমান প্রাথমিক সংগ্রামসহ একটি এলোমেলো ইতিহাস, সাথে সত্যিই ভালো সাম্প্রতিক কাজ, কম নয় বেশি বিশ্বাসযোগ্য পড়া যায় — এটি বৃদ্ধি দেখায়, যা ঠিক একজন junior প্রার্থীর প্রদর্শন করার কথা।</p>', 'অতিরিক্ত পরিমার্জন করবেন না'),

      h(2, 'অন্যের প্রোজেক্টে অবদান রাখা', 'contributing-to-other-projects'),
      p('<p>অন্য কারো open-source প্রোজেক্টে একটি ছোট, আসল অবদান — ডকুমেন্টেশনে একটি টাইপো ঠিক করা, একটি ছোট bug fix — একটি আসল সংকেত, কারণ এর অর্থ অন্য কারো বিদ্যমান কোড আর প্রথার মধ্যে কাজ করা, যা একটি একক প্রোজেক্টের চেয়ে একটি আসল চাকরির কাছাকাছি। এটি ঐচ্ছিক আর একজন junior প্রার্থীর কাছে প্রত্যাশিত নয়, কিন্তু উপস্থিত থাকলে এটি আলাদা দাঁড়ায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'writing-a-developer-cv',
  sortOrder: 8,
  en: {
    title: 'Writing a Developer CV',
    metaTitle: 'Writing a Developer CV | Learn Computer Academy',
    metaDescription: 'A developer CV is scanned for seconds, not read. What to include, what to cut, and how to describe a project instead of just naming it.',
    blocks: [
      p('<p>A CV for a junior developer role gets scanned in seconds before anyone decides whether to read it properly. It needs to be structured for that fast pass, not written as a complete life history.</p>'),

      h(2, 'What Belongs on It'),
      p('<ul><li><b>Contact details</b> — email, phone, and links to your portfolio and GitHub. Make links actually clickable if the format allows it.</li><li><b>A short summary</b> — two or three lines, specific rather than generic. Not "hardworking and passionate about technology" — say what you can actually do.</li><li><b>Projects</b>, described properly (below) — usually the most important section for someone with no formal work history yet.</li><li><b>Skills</b>, grouped and honest — languages, frameworks, and tools you can genuinely discuss, not everything you\'ve ever opened once.</li><li><b>Education</b>, including the course that got you here.</li><li><b>Anything else genuinely relevant</b> — a relevant part-time job, a hackathon, a small freelance project.</li></ul>'),

      h(2, 'Describing a Project on a CV'),
      p('<p>Naming a project tells a reader almost nothing. Describing what it does and what you built tells them a great deal, in the same space.</p>'),
      table(
        ['Weak', 'Better'],
        [
          ['To-do App (React)', 'Task manager with drag-to-reorder and local storage persistence — built solo, deployed'],
          ['E-commerce site', 'Product listing site with search, filtering, and a cart — connects to a REST API I also built'],
          ['Portfolio website', 'Personal site built to learn responsive layout — fully mobile-optimised, deployed with a custom domain'],
        ]
      ),

      h(2, 'One Page, Almost Always'),
      p('<p>A junior candidate with limited work history rarely has enough genuine content to justify more than one page, and a padded two-page CV reads as padding, not substance. Cut before you add.</p>'),

      callout('warning', '<p>Do not list a technology you cannot discuss for two minutes. Interviewers frequently ask about whatever is on the CV, and a listed skill you can\'t actually speak to does more damage than leaving it off entirely — it turns your own CV into a trap.</p>', 'Only list what you can defend'),

      h(2, 'Formatting That Survives Automated Screening'),
      p('<p>Larger companies often run CVs through automated keyword screening before a person ever sees them. Plain, clearly labelled sections, standard headings, and no information hidden inside images or unusual formatting all survive that step better. Elaborate visual design is not required and can actively work against you here.</p>'),

      h(2, 'Tailor It, at Least a Little'),
      p('<p>A CV that obviously was not adjusted at all for the specific role reads as a low-effort mass application, and is often treated as one. It does not need a rewrite for every application — but the summary line and the order projects appear in are worth adjusting to what the specific role actually asks for.</p>'),
    ],
  },
  bn: {
    title: 'একটি Developer CV লেখা',
    metaTitle: 'একটি Developer CV লেখা | Learn Computer Academy',
    metaDescription: 'একটি developer CV সেকেন্ডে স্ক্যান করা হয়, পড়া হয় না। কী অন্তর্ভুক্ত করবেন, কী বাদ দেবেন, আর একটি প্রোজেক্ট শুধু নাম না দিয়ে কীভাবে বর্ণনা করবেন।',
    blocks: [
      p('<p>একটি junior ডেভেলপার ভূমিকার জন্য একটি CV কেউ এটি ভালোভাবে পড়ার সিদ্ধান্ত নেওয়ার আগে সেকেন্ডে স্ক্যান করা হয়। এটি সেই দ্রুত পাসের জন্য গঠিত হওয়া দরকার, একটি সম্পূর্ণ জীবনকাহিনী হিসেবে লেখা নয়।</p>'),

      h(2, 'এতে কী থাকা দরকার', 'what-belongs-on-it'),
      p('<ul><li><b>যোগাযোগের বিবরণ</b> — ইমেইল, ফোন, আর আপনার portfolio আর GitHub-এর লিংক। ফরম্যাট অনুমতি দিলে লিংকগুলো আসলে ক্লিকযোগ্য করুন।</li><li><b>একটি ছোট সারসংক্ষেপ</b> — দুই বা তিন লাইন, সাধারণের বদলে নির্দিষ্ট। "hardworking and passionate about technology" নয় — আপনি আসলে কী করতে পারেন তা বলুন।</li><li><b>প্রোজেক্ট</b>, ঠিকভাবে বর্ণনা করা (নিচে) — এখনো কোনো আনুষ্ঠানিক কাজের ইতিহাস নেই এমন কারো জন্য সাধারণত সবচেয়ে গুরুত্বপূর্ণ অংশ।</li><li><b>দক্ষতা</b>, দলবদ্ধ আর সৎ — ভাষা, framework, আর টুল যা নিয়ে আপনি সত্যিই আলোচনা করতে পারেন, আপনি কখনো একবার খুলেছেন এমন সবকিছু নয়।</li><li><b>শিক্ষা</b>, আপনাকে এখানে এনেছে এমন কোর্সসহ।</li><li><b>সত্যিই প্রাসঙ্গিক অন্য যেকোনো কিছু</b> — একটি প্রাসঙ্গিক খণ্ডকালীন চাকরি, একটি hackathon, একটি ছোট freelance প্রোজেক্ট।</li></ul>'),

      h(2, 'একটি CV-তে একটি প্রোজেক্ট বর্ণনা করা', 'describing-a-project-on-a-cv'),
      p('<p>একটি প্রোজেক্টের নাম দেওয়া একজন পাঠককে প্রায় কিছুই বলে না। এটি কী করে আর আপনি কী তৈরি করেছেন তা বর্ণনা করা একই জায়গায় তাদের অনেক কিছু বলে।</p>'),
      table(
        ['দুর্বল', 'ভালো'],
        [
          ['To-do App (React)', 'Drag-to-reorder আর local storage persistence সহ কাজ ব্যবস্থাপক — একা তৈরি, deploy করা'],
          ['E-commerce site', 'সার্চ, ফিল্টার, আর একটি কার্টসহ পণ্য তালিকার সাইট — আমার তৈরি একটি REST API-এর সাথে সংযুক্ত'],
          ['Portfolio website', 'Responsive লেআউট শিখতে তৈরি ব্যক্তিগত সাইট — সম্পূর্ণ মোবাইল-অপ্টিমাইজ করা, একটি কাস্টম ডোমেইনে deploy করা'],
        ]
      ),

      h(2, 'প্রায় সবসময় এক পাতা', 'one-page-almost-always'),
      p('<p>সীমিত কাজের ইতিহাসযুক্ত একজন junior প্রার্থীর খুব কমই এক পাতার বেশি ন্যায্যতা দেওয়ার মতো যথেষ্ট আসল কন্টেন্ট থাকে, আর একটি ভরাট দুই-পাতার CV ভরাট হিসেবে পড়া যায়, সারবত্তা নয়। যোগ করার আগে কাটুন।</p>'),

      callout('warning', '<p>এমন একটি প্রযুক্তি তালিকাভুক্ত করবেন না যা আপনি দুই মিনিট আলোচনা করতে পারবেন না। Interviewer প্রায়ই CV-তে যা আছে তা নিয়ে জিজ্ঞাসা করে, আর একটি তালিকাভুক্ত দক্ষতা যা নিয়ে আপনি আসলে কথা বলতে পারেন না তা সম্পূর্ণ বাদ দেওয়ার চেয়ে বেশি ক্ষতি করে — এটি আপনার নিজের CV-কে একটি ফাঁদে পরিণত করে।</p>', 'শুধু যা রক্ষা করতে পারেন তা তালিকাভুক্ত করুন'),

      h(2, 'স্বয়ংক্রিয় স্ক্রিনিং টিকে থাকা ফরম্যাটিং', 'formatting-that-survives-automated-screening'),
      p('<p>বড় কোম্পানি প্রায়ই কোনো মানুষ দেখার আগে CV স্বয়ংক্রিয় keyword screening-এর মধ্য দিয়ে চালায়। সাধারণ, স্পষ্টভাবে লেবেল করা অংশ, আদর্শ শিরোনাম, আর ছবি বা অস্বাভাবিক ফরম্যাটিংয়ে লুকানো কোনো তথ্য নেই — এগুলো সবই সেই ধাপ ভালোভাবে টিকে থাকে। বিস্তৃত দৃশ্যগত ডিজাইনের প্রয়োজন নেই আর এখানে এটি সক্রিয়ভাবে আপনার বিরুদ্ধে কাজ করতে পারে।</p>'),

      h(2, 'অন্তত একটু এটি মানানসই করুন', 'tailor-it-at-least-a-little'),
      p('<p>একটি CV যা স্পষ্টতই নির্দিষ্ট ভূমিকার জন্য একেবারেই সমন্বয় করা হয়নি তা একটি কম-পরিশ্রমের ভর আবেদন হিসেবে পড়া যায়, আর প্রায়ই একটি হিসেবে গণ্য হয়। প্রতিটি আবেদনের জন্য এটির পুনর্লিখনের প্রয়োজন নেই — কিন্তু সারসংক্ষেপ লাইন আর প্রোজেক্ট যে ক্রমে দেখা যায় তা নির্দিষ্ট ভূমিকা আসলে যা চায় তার সাথে সমন্বয় করা সার্থক।</p>'),
    ],
  },
})

lessons.push({
  slug: 'linkedin-and-your-online-presence',
  sortOrder: 9,
  en: {
    title: 'LinkedIn and Your Online Presence',
    metaTitle: 'LinkedIn and Your Online Presence for Job Seekers | Learn Computer Academy',
    metaDescription: 'A recruiter searches your name before an interview. What they find matters. How to make a LinkedIn profile that actually helps.',
    blocks: [
      p('<p>Before an interview, and often before even replying to an application, a recruiter or hiring manager will search your name. What they find in those thirty seconds shapes their first impression before you\'ve said a word.</p>'),

      h(2, 'Why This Matters More Than It Feels Like It Should'),
      p('<p>An empty or outdated profile is not neutral — it reads as either not serious about the job search or not really active in the field. A profile search that turns up nothing at all is, for a developer role specifically, mildly unusual, since most working developers have some visible online trace.</p>'),

      h(2, 'What a Junior\'s Profile Actually Needs'),
      p('<ul><li><b>A real, current photo.</b> Casual is fine; a photo where your face is clearly visible is what matters.</li><li><b>A headline that says what you do</b>, not just your course name. "Frontend developer — React, learning Node" tells a recruiter more than "Student at Learn Computer Academy".</li><li><b>A short About section</b>, written as a person, describing what you can build and what you\'re learning next.</li><li><b>Your real projects</b>, linked — the same ones from your portfolio and GitHub.</li><li><b>Your course and any real experience</b>, listed accurately.</li></ul>'),

      h(2, 'Posting — Optional, But It Compounds'),
      p('<p>You do not need to post to have a usable profile. If you do, the same advice from this site\'s marketing course applies directly: something specific you learned, a project you finished, a problem you solved and how, works far better than generic motivational content. One honest post about finishing a real project is worth more than ten vague ones about "the journey".</p>'),

      callout('tip', '<p>Commenting genuinely on other people\'s posts — a real technical comment, not "Great post!" — costs almost nothing and slowly builds visibility in a way that is far less effort than writing original posts regularly.</p>'),

      h(2, 'Connecting With People'),
      p('<p>Connect with instructors, classmates, and anyone you meet at an event or interview — even one that didn\'t lead anywhere. When you send a request, add a short note saying who you are and where you met, rather than a bare invitation nobody remembers accepting.</p><p>This is the actual mechanism behind referrals, covered properly in a later lesson: people refer people they have some real memory of, not strangers who appear from nowhere when they need something.</p>'),

      h(2, 'Search Yourself'),
      p('<p>Search your own name the way a stranger would, from a private or incognito window. If something outdated, unprofessional, or simply confusing about who you are shows up ahead of anything useful, that is worth fixing before it costs you an opportunity rather than after.</p>'),
    ],
  },
  bn: {
    title: 'LinkedIn আর আপনার অনলাইন উপস্থিতি',
    metaTitle: 'চাকরিপ্রার্থীদের জন্য LinkedIn আর অনলাইন উপস্থিতি | Learn Computer Academy',
    metaDescription: 'একটি ইন্টারভিউর আগে একজন recruiter আপনার নাম সার্চ করেন। তারা যা পান তা গুরুত্বপূর্ণ। কীভাবে একটি LinkedIn প্রোফাইল বানাবেন যা আসলে সাহায্য করে।',
    blocks: [
      p('<p>একটি ইন্টারভিউর আগে, আর প্রায়ই একটি আবেদনের জবাব দেওয়ার আগেও, একজন recruiter বা hiring manager আপনার নাম সার্চ করবেন। সেই ত্রিশ সেকেন্ডে তারা যা খুঁজে পান তা আপনি একটি শব্দ বলার আগেই তাদের প্রথম ধারণা গঠন করে।</p>'),

      h(2, 'এটি যতটা মনে হওয়া উচিত তার চেয়ে বেশি গুরুত্বপূর্ণ কেন', 'why-this-matters-more-than-it-feels-like-it-should'),
      p('<p>একটি খালি বা সেকেলে প্রোফাইল নিরপেক্ষ নয় — এটি চাকরি খোঁজায় গুরুত্বসহকারে নয় বা এই ক্ষেত্রে সত্যিই সক্রিয় নয় হিসেবে পড়া যায়। একটি প্রোফাইল সার্চে একেবারে কিছু না পাওয়া, বিশেষভাবে একটি ডেভেলপার ভূমিকার জন্য, কিছুটা অস্বাভাবিক, কারণ বেশিরভাগ কার্যরত ডেভেলপারের কিছু দৃশ্যমান অনলাইন চিহ্ন থাকে।</p>'),

      h(2, 'একজন Junior-এর প্রোফাইলে আসলে কী দরকার', 'what-a-juniors-profile-actually-needs'),
      p('<ul><li><b>একটি আসল, বর্তমান ছবি।</b> নৈমিত্তিক হলেও ঠিক আছে; যা গুরুত্বপূর্ণ তা হলো আপনার মুখ স্পষ্টভাবে দৃশ্যমান একটি ছবি।</li><li><b>এমন একটি headline যা আপনি কী করেন তা বলে</b>, শুধু আপনার কোর্সের নাম নয়। "Frontend developer — React, learning Node" একজন recruiter-কে "Student at Learn Computer Academy"-র চেয়ে বেশি বলে।</li><li><b>একটি ছোট About অংশ</b>, একজন মানুষ হিসেবে লেখা, আপনি কী তৈরি করতে পারেন আর এরপর কী শিখছেন তা বর্ণনা করে।</li><li><b>আপনার আসল প্রোজেক্ট</b>, লিংক করা — আপনার portfolio আর GitHub-এর একই গুলো।</li><li><b>আপনার কোর্স আর যেকোনো আসল অভিজ্ঞতা</b>, সঠিকভাবে তালিকাভুক্ত।</li></ul>'),

      h(2, 'পোস্ট করা — ঐচ্ছিক, কিন্তু জমে', 'posting-optional-but-it-compounds'),
      p('<p>একটি ব্যবহারযোগ্য প্রোফাইল পেতে আপনার পোস্ট করার প্রয়োজন নেই। আপনি করলে, এই সাইটের মার্কেটিং কোর্সের একই পরামর্শ সরাসরি প্রযোজ্য: নির্দিষ্ট কিছু যা আপনি শিখেছেন, একটি প্রোজেক্ট যা আপনি শেষ করেছেন, একটি সমস্যা যা আপনি সমাধান করেছেন আর কীভাবে, "the journey" নিয়ে দশটি অস্পষ্ট পোস্টের চেয়ে একটি সৎ পোস্ট অনেক ভালো কাজ করে।</p>'),

      callout('tip', '<p>অন্যের পোস্টে সত্যিকারভাবে মন্তব্য করা — একটি আসল টেকনিক্যাল মন্তব্য, "Great post!" নয় — প্রায় কোনো খরচ নেই আর নিয়মিত মূল পোস্ট লেখার চেয়ে অনেক কম পরিশ্রমে ধীরে ধীরে দৃশ্যমানতা গড়ে।</p>'),

      h(2, 'মানুষের সাথে সংযুক্ত হওয়া', 'connecting-with-people'),
      p('<p>প্রশিক্ষক, সহপাঠী, আর একটি ইভেন্ট বা ইন্টারভিউতে দেখা করা যে কারো সাথে সংযুক্ত হন — যেটি কোথাও নিয়ে যায়নি তার সাথেও। আপনি একটি অনুরোধ পাঠালে, একটি বেয়ার আমন্ত্রণের বদলে আপনি কে আর কোথায় দেখা হয়েছিল তা বলা একটি ছোট নোট যোগ করুন যা কেউ গ্রহণ করেছে বলে মনে রাখে না।</p><p>এটিই referral-এর পেছনের আসল প্রক্রিয়া, পরের একটি পাঠে ঠিকভাবে কভার করা: মানুষ এমন মানুষকে refer করে যাদের সম্পর্কে তাদের কিছু আসল স্মৃতি আছে, কোথাও থেকে হঠাৎ হাজির হওয়া অচেনা মানুষকে নয় যখন তাদের কিছু দরকার।</p>'),

      h(2, 'নিজেকে সার্চ করুন', 'search-yourself'),
      p('<p>একটি অচেনা মানুষ যেভাবে করবে সেভাবে, একটি ব্যক্তিগত বা incognito উইন্ডো থেকে, আপনার নিজের নাম সার্চ করুন। কাজের কিছুর আগে সেকেলে, অপেশাদার, বা আপনি কে তা নিয়ে সহজভাবে বিভ্রান্তিকর কিছু দেখা গেলে, এটি আপনার একটি সুযোগের খরচ হওয়ার আগে ঠিক করা সার্থক, পরে নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'where-junior-roles-actually-are',
  sortOrder: 10,
  en: {
    title: 'Where Junior Roles Actually Are',
    metaTitle: 'Where Junior Developer Roles Actually Are | Learn Computer Academy',
    metaDescription: 'Big-name job portals are not where most juniors actually get hired. The places that are, and why they get overlooked.',
    blocks: [
      p('<p>Most students search for jobs the same way: open a major job portal, search "developer," apply to the first page of results. That is not wrong, but it is the most crowded and least targeted place to look, and it is far from the only one.</p>'),

      h(2, 'The Places That Actually Work'),
      table(
        ['Where', 'Why it works'],
        [
          ['Local agencies and studios', 'Smaller, often hire directly without a formal process, and juniors are genuinely useful to them'],
          ['Small business owners who need a website', 'No competing applicant pool at all — you are proposing, not applying'],
          ['LinkedIn, searched directly rather than browsed', 'Search specific terms ("junior frontend," your city) rather than scrolling a generic feed'],
          ['Company career pages directly', 'Many roles never reach the major portals at all'],
          ['Your own network — teachers, classmates, previous employers', 'The highest-conversion source there is, covered in the next lesson'],
          ['Freelance platforms', 'Genuinely open to beginners in a way full-time hiring often is not'],
          ['Local WhatsApp and Telegram groups for developers', 'Small and informal, but roles get shared here before they\'re posted publicly'],
        ]
      ),

      h(2, 'Why Job Portals Alone Underperform'),
      p('<p>A posting on a major portal can receive hundreds of applications within a day. A junior candidate with a thin work history is competing in the same pool as everyone else who had the same idea, and the sorting is often automated and unforgiving of a CV that doesn\'t hit the right keywords.</p><p>That doesn\'t mean skip portals — many real roles are genuinely posted there. It means don\'t rely on them as the only source, because the odds per application are worse there than almost anywhere else on this list.</p>'),

      callout('note', '<p>The smaller and more direct the channel, the less competition and the more a real portfolio and a genuine conversation matter relative to keyword matching. A small agency owner who looks at your GitHub personally is a very different filter than an automated system scanning five hundred CVs.</p>'),

      h(2, 'A Practical Weekly Habit'),
      p('<p>Rather than one giant application session, a steady weekly rhythm works better and is easier to sustain: a fixed number of thoughtful applications, a few direct messages to companies or people, one piece of networking (a comment, a message, attending something), and updating the portfolio with anything new. Consistency here matters more than any single burst of effort.</p>'),
    ],
  },
  bn: {
    title: 'Junior ভূমিকা আসলে কোথায় থাকে',
    metaTitle: 'Junior ডেভেলপার ভূমিকা আসলে কোথায় থাকে | Learn Computer Academy',
    metaDescription: 'বড়-নামের job পোর্টাল সেই জায়গা নয় যেখানে বেশিরভাগ junior আসলে নিয়োগ পায়। যেখানে পায়, আর কেন সেগুলো উপেক্ষিত হয়।',
    blocks: [
      p('<p>বেশিরভাগ শিক্ষার্থী একই উপায়ে চাকরি খোঁজে: একটি প্রধান job পোর্টাল খুলুন, "developer" সার্চ করুন, ফলাফলের প্রথম পাতায় আবেদন করুন। এটি ভুল নয়, কিন্তু এটি খোঁজার সবচেয়ে ভিড়যুক্ত আর সবচেয়ে কম লক্ষ্যযুক্ত জায়গা, আর এটি একমাত্রটি থেকে অনেক দূরে।</p>'),

      h(2, 'যেসব জায়গা আসলে কাজ করে', 'the-places-that-actually-work'),
      table(
        ['কোথায়', 'কেন এটি কাজ করে'],
        [
          ['স্থানীয় agency আর studio', 'ছোট, প্রায়ই কোনো আনুষ্ঠানিক প্রক্রিয়া ছাড়া সরাসরি নিয়োগ করে, আর junior তাদের কাছে সত্যিই কাজের'],
          ['একটি ওয়েবসাইট দরকার এমন ছোট ব্যবসার মালিক', 'একেবারেই কোনো প্রতিযোগী আবেদনকারী পুল নেই — আপনি প্রস্তাব দিচ্ছেন, আবেদন করছেন না'],
          ['LinkedIn, ব্রাউজ না করে সরাসরি সার্চ করা', 'একটি সাধারণ ফিড স্ক্রল করার বদলে নির্দিষ্ট term ("junior frontend," আপনার শহর) সার্চ করুন'],
          ['সরাসরি কোম্পানির career পাতা', 'অনেক ভূমিকা প্রধান পোর্টালে কখনো পৌঁছায়ই না'],
          ['আপনার নিজের নেটওয়ার্ক — শিক্ষক, সহপাঠী, আগের নিয়োগকর্তা', 'উপলব্ধ সর্বোচ্চ-রূপান্তরের উৎস, পরের পাঠে কভার করা'],
          ['Freelance প্ল্যাটফর্ম', 'পূর্ণকালীন নিয়োগ প্রায়ই যেভাবে নয় সেভাবে সত্যিই শিক্ষানবিসদের জন্য খোলা'],
          ['ডেভেলপারদের জন্য স্থানীয় WhatsApp আর Telegram group', 'ছোট আর অনানুষ্ঠানিক, কিন্তু প্রকাশ্যে পোস্ট হওয়ার আগে এখানে ভূমিকা শেয়ার হয়'],
        ]
      ),

      h(2, 'শুধু Job পোর্টাল কেন কম পারফর্ম করে', 'why-job-portals-alone-underperform'),
      p('<p>একটি প্রধান পোর্টালে একটি posting একদিনে শত শত আবেদন পেতে পারে। পাতলা কাজের ইতিহাসযুক্ত একজন junior প্রার্থী একই ধারণাযুক্ত বাকি সবার সাথে একই পুলে প্রতিযোগিতা করছে, আর বাছাইটি প্রায়ই স্বয়ংক্রিয় আর সঠিক keyword না মেলা একটি CV-র প্রতি ক্ষমাহীন।</p><p>এর অর্থ পোর্টাল বাদ দেওয়া নয় — অনেক আসল ভূমিকা সত্যিই সেখানে পোস্ট হয়। এর অর্থ সেগুলোকে একমাত্র উৎস হিসেবে নির্ভর না করা, কারণ প্রতি আবেদনে সম্ভাবনা এই তালিকার প্রায় অন্য যেকোনো কিছুর চেয়ে সেখানে খারাপ।</p>'),

      callout('note', '<p>চ্যানেলটি যত ছোট আর সরাসরি, প্রতিযোগিতা তত কম আর keyword মেলানোর সাপেক্ষে একটি আসল portfolio আর একটি প্রকৃত কথোপকথন তত বেশি গুরুত্বপূর্ণ। একজন ছোট agency মালিক যে ব্যক্তিগতভাবে আপনার GitHub দেখেন তিনি পাঁচশো CV স্ক্যান করা একটি স্বয়ংক্রিয় সিস্টেম থেকে খুব ভিন্ন একটি ফিল্টার।</p>'),

      h(2, 'একটি ব্যবহারিক সাপ্তাহিক অভ্যাস', 'a-practical-weekly-habit'),
      p('<p>একটি বিশাল আবেদনের সেশনের বদলে, একটি স্থির সাপ্তাহিক ছন্দ ভালো কাজ করে আর বজায় রাখা সহজ: একটি নির্দিষ্ট সংখ্যক চিন্তাশীল আবেদন, কোম্পানি বা মানুষকে কয়েকটি সরাসরি বার্তা, নেটওয়ার্কিংয়ের একটি অংশ (একটি মন্তব্য, একটি বার্তা, কিছুতে যোগ দেওয়া), আর নতুন কিছু দিয়ে portfolio আপডেট করা। এখানে ধারাবাহিকতা যেকোনো একক পরিশ্রমের গুচ্ছের চেয়ে বেশি গুরুত্বপূর্ণ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'applying-well',
  sortOrder: 11,
  en: {
    title: 'Applying Well — and Why Mass-Applying Fails',
    metaTitle: 'Applying Well and Why Mass-Applying Fails | Learn Computer Academy',
    metaDescription: 'Fifty identical applications usually produce fewer replies than fifteen targeted ones. What a good application actually contains.',
    blocks: [
      p('<p>Applying to fifty roles with one unchanged CV and no message feels productive — it is a lot of visible activity. It usually produces fewer replies than fifteen applications sent with a short, specific message and a slightly adjusted CV. Volume is not the variable that matters most here.</p>'),

      h(2, 'Why Mass-Applying Underperforms'),
      p('<p>A generic application is easy for a reader to skip, because it does not address anything about their specific role or company — it is visibly one of fifty identical copies. A short, specific message signals the opposite: that this application was actually written for them, which is a low bar almost nobody clears, which is exactly why clearing it stands out.</p>'),

      h(2, 'What a Good Application Contains'),
      p('<ul><li><b>A short note</b>, not a copy-pasted cover letter template — two or three sentences saying why this role specifically, and one specific thing about your background that fits it.</li><li><b>A CV adjusted</b> to what the posting actually asks for, at least in emphasis.</li><li><b>Links that work</b> — portfolio, GitHub, live projects, tested before sending.</li><li><b>No spelling mistakes in the message itself</b> — read it once more before sending, out loud if possible.</li></ul>'),
      code('text', 'Generic (skipped): "I am writing to express my interest in the\nDeveloper position. I believe my skills make me a strong\ncandidate. Please find my CV attached."\n\nSpecific (read): "I saw you\'re looking for a frontend developer\nfamiliar with React. I recently built and deployed a task manager\nusing React and a REST API I wrote myself — link below. Happy to\nwalk through the code or take on a small test task."'),

      h(2, 'Following Up'),
      p('<p>A short, polite follow-up after a week of silence is normal practice, not pushy — hiring processes are frequently slower than applicants expect, and a message can genuinely get lost or buried. One follow-up is reasonable. Several unanswered follow-ups in a short period reads as pressure rather than interest, and can work against you.</p>'),

      callout('tip', '<p>Track what you\'ve applied to and when — a simple spreadsheet is enough. Without this, following up becomes guesswork, and it becomes hard to tell which kind of application, message, or role is actually getting responses.</p>'),

      h(2, 'Quality Over Volume, With a Floor'),
      p('<p>This is not an argument for applying to only two or three roles total. It is an argument against fifty identical, unconsidered ones. A reasonable middle ground: apply broadly to keep the pipeline full, but spend real effort on the message and CV fit for roles you actually want.</p>'),
    ],
  },
  bn: {
    title: 'ভালোভাবে আবেদন করা — আর Mass-Applying কেন ব্যর্থ হয়',
    metaTitle: 'ভালোভাবে আবেদন করা আর Mass-Applying কেন ব্যর্থ হয় | Learn Computer Academy',
    metaDescription: 'পঞ্চাশটি হুবহু আবেদন সাধারণত পনেরোটি লক্ষ্যযুক্ত আবেদনের চেয়ে কম জবাব তৈরি করে। একটি ভালো আবেদনে আসলে কী থাকে।',
    blocks: [
      p('<p>একটি অপরিবর্তিত CV আর কোনো বার্তা ছাড়া পঞ্চাশটি ভূমিকায় আবেদন করা কাজের মনে হয় — এটি অনেক দৃশ্যমান কার্যকলাপ। এটি সাধারণত একটি ছোট, নির্দিষ্ট বার্তা আর সামান্য সমন্বয় করা CV সহ পাঠানো পনেরোটি আবেদনের চেয়ে কম জবাব তৈরি করে। এখানে volume সবচেয়ে গুরুত্বপূর্ণ পরিবর্তনশীল নয়।</p>'),

      h(2, 'Mass-Applying কেন কম পারফর্ম করে', 'why-mass-applying-underperforms'),
      p('<p>একটি সাধারণ আবেদন একজন পাঠকের বাদ দেওয়া সহজ, কারণ এটি তাদের নির্দিষ্ট ভূমিকা বা কোম্পানি সম্পর্কে কিছুই সম্বোধন করে না — এটি দৃশ্যত পঞ্চাশটি হুবহু কপির একটি। একটি ছোট, নির্দিষ্ট বার্তা উল্টো সংকেত দেয়: এই আবেদনটি আসলে তাদের জন্য লেখা হয়েছিল, যা এমন একটি নিম্ন মান যা প্রায় কেউ পার হয় না, যে কারণেই এটি পার হওয়া আলাদা দাঁড়ায়।</p>'),

      h(2, 'একটি ভালো আবেদনে কী থাকে', 'what-a-good-application-contains'),
      p('<ul><li><b>একটি ছোট নোট</b>, একটি copy-paste করা cover letter টেমপ্লেট নয় — দুই বা তিন বাক্য বলা কেন এই ভূমিকাটি নির্দিষ্টভাবে, আর আপনার পটভূমি সম্পর্কে একটি নির্দিষ্ট জিনিস যা এতে মানানসই।</li><li><b>একটি CV সমন্বয় করা</b> posting আসলে কী চায় তার সাথে, অন্তত জোরের ক্ষেত্রে।</li><li><b>কাজ করে এমন লিংক</b> — portfolio, GitHub, live প্রোজেক্ট, পাঠানোর আগে পরীক্ষা করা।</li><li><b>বার্তায় নিজেই কোনো বানান ভুল নেই</b> — পাঠানোর আগে আরেকবার পড়ুন, সম্ভব হলে জোরে।</li></ul>'),
      code('text', 'সাধারণ (বাদ পড়ে): "I am writing to express my interest in the\nDeveloper position. I believe my skills make me a strong\ncandidate. Please find my CV attached."\n\nনির্দিষ্ট (পড়া হয়): "I saw you\'re looking for a frontend developer\nfamiliar with React. I recently built and deployed a task manager\nusing React and a REST API I wrote myself — link below. Happy to\nwalk through the code or take on a small test task."'),

      h(2, 'ফলো-আপ করা', 'following-up'),
      p('<p>এক সপ্তাহের নীরবতার পর একটি ছোট, ভদ্র ফলো-আপ স্বাভাবিক প্রথা, চাপাচাপি নয় — নিয়োগ প্রক্রিয়া প্রায়ই আবেদনকারীদের প্রত্যাশার চেয়ে ধীর, আর একটি বার্তা সত্যিই হারিয়ে যেতে বা চাপা পড়তে পারে। একটি ফলো-আপ যুক্তিসঙ্গত। একটি ছোট সময়ে কয়েকটি জবাবহীন ফলো-আপ আগ্রহের বদলে চাপ হিসেবে পড়া যায়, আর আপনার বিরুদ্ধে কাজ করতে পারে।</p>'),

      callout('tip', '<p>আপনি কী আর কখন আবেদন করেছেন তা ট্র্যাক করুন — একটি সরল spreadsheet যথেষ্ট। এটি ছাড়া, ফলো-আপ করা অনুমান হয়ে যায়, আর কোন ধরনের আবেদন, বার্তা, বা ভূমিকা আসলে জবাব পাচ্ছে তা বলা কঠিন হয়ে যায়।</p>'),

      h(2, 'একটি মেঝেসহ, Volume-এর চেয়ে গুণমান', 'quality-over-volume-with-a-floor'),
      p('<p>এটি মোট শুধু দুই বা তিনটি ভূমিকায় আবেদনের যুক্তি নয়। এটি পঞ্চাশটি হুবহু, অবিবেচিত আবেদনের বিরুদ্ধে একটি যুক্তি। একটি যুক্তিসঙ্গত মধ্যপন্থা: pipeline ভরা রাখতে বিস্তৃতভাবে আবেদন করুন, কিন্তু আপনি আসলে চান এমন ভূমিকার জন্য বার্তা আর CV মিলের উপর আসল পরিশ্রম দিন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'referrals-and-networks',
  sortOrder: 12,
  en: {
    title: 'Referrals and Networks',
    metaTitle: 'Referrals and Networks for Job Seekers | Learn Computer Academy',
    metaDescription: 'A referral is the highest-conversion way into a junior role. Building a network without a job title, honestly and without being pushy.',
    blocks: [
      p('<p>A large share of junior hiring, especially at smaller companies, happens through referrals — someone inside vouching for someone they know. It is one of the highest-conversion routes into a role, and it is the one students most often assume is unavailable to them.</p>'),

      h(2, 'Why Referrals Work So Well'),
      p('<p>A referral solves the employer\'s actual problem: hiring is risky, a CV and a short interview reveal only so much, and a vouch from someone already trusted reduces that risk. It does not replace being competent — a referred candidate who cannot do the work still fails the interview — but it gets you a real conversation far more reliably than a cold application does.</p>'),

      h(2, '"I Don\'t Have a Network" Is Usually Wrong'),
      p('<p>A network does not mean senior industry contacts. At this stage, it realistically includes: instructors and teachers, who often know local employers directly; classmates, some of whom will get hired before you and can vouch for you later; alumni of your course or institute already working; anyone from a previous job, even unrelated to tech; family friends and acquaintances who happen to work anywhere near the field.</p><p>Most students already have more of this than they think — they just haven\'t activated it, because asking for anything from it feels uncomfortable.</p>'),

      h(2, 'How to Actually Use It, Without Being Awkward'),
      p('<p>Do not open with "can you get me a job." Start with a genuine, specific, low-pressure ask: <i>"I\'m applying for junior developer roles — do you know anyone hiring, or would you mind if I mentioned your name when I apply somewhere you\'ve worked?"</i> That is easy to say yes to, because it asks for information or a small favour, not a guaranteed outcome.</p>'),

      callout('warning', '<p>Never claim a connection or a referral you don\'t actually have. It is easy to check, it damages the person whose name you used, and it damages you far more permanently than the rejection you were trying to avoid.</p>', 'Never fabricate a connection'),

      h(2, 'Building the Network Before You Need It'),
      p('<p>A network built the week you start job hunting is thin and obvious. One built over the months before — genuinely helping classmates, staying in touch with instructors, actually engaging with people online rather than only when you want something — is available and natural when you actually need it.</p>'),

      h(2, 'Alumni Specifically'),
      p('<p>People who took the same course and are now working are an unusually good resource: they know exactly what you learned, remember what the transition into work felt like, and are often willing to help precisely because someone helped them the same way not long ago. If your institute has any alumni group or channel, that is worth using directly for this.</p>'),
    ],
  },
  bn: {
    title: 'Referral আর নেটওয়ার্ক',
    metaTitle: 'চাকরিপ্রার্থীদের জন্য Referral আর নেটওয়ার্ক | Learn Computer Academy',
    metaDescription: 'একটি junior ভূমিকায় ঢোকার সর্বোচ্চ-রূপান্তরের উপায় একটি referral। কোনো job title ছাড়া, সৎভাবে আর চাপাচাপি না করে একটি নেটওয়ার্ক তৈরি করা।',
    blocks: [
      p('<p>Junior নিয়োগের একটি বড় অংশ, বিশেষত ছোট কোম্পানিতে, referral-এর মাধ্যমে ঘটে — ভেতরের কেউ তাদের চেনা কারো জন্য প্রশংসা করা। এটি একটি ভূমিকায় ঢোকার সর্বোচ্চ-রূপান্তরের পথগুলোর একটি, আর এটিই সেই একটি যা শিক্ষার্থীরা প্রায়ই ধরে নেয় তাদের কাছে অনুপলব্ধ।</p>'),

      h(2, 'Referral কেন এত ভালো কাজ করে', 'why-referrals-work-so-well'),
      p('<p>একটি referral নিয়োগকর্তার আসল সমস্যা সমাধান করে: নিয়োগ ঝুঁকিপূর্ণ, একটি CV আর একটি ছোট ইন্টারভিউ শুধু এতটাই প্রকাশ করে, আর ইতিমধ্যে বিশ্বস্ত কারো একটি সমর্থন সেই ঝুঁকি কমায়। এটি যোগ্যতার বিকল্প নয় — একজন referred প্রার্থী যে কাজ করতে পারে না সে এখনো ইন্টারভিউতে ব্যর্থ হয় — কিন্তু এটি আপনাকে একটি ঠান্ডা আবেদনের চেয়ে অনেক বেশি নির্ভরযোগ্যভাবে একটি আসল কথোপকথন এনে দেয়।</p>'),

      h(2, '"আমার কোনো নেটওয়ার্ক নেই" সাধারণত ভুল', 'i-dont-have-a-network-is-usually-wrong'),
      p('<p>একটি নেটওয়ার্ক মানে senior শিল্প যোগাযোগ নয়। এই পর্যায়ে, এটি বাস্তবসম্মতভাবে অন্তর্ভুক্ত করে: প্রশিক্ষক আর শিক্ষক, যারা প্রায়ই স্থানীয় নিয়োগকর্তাদের সরাসরি চেনেন; সহপাঠী, যাদের কয়েকজন আপনার আগে নিয়োগ পাবে আর পরে আপনার জন্য প্রশংসা করতে পারে; আপনার কোর্স বা প্রতিষ্ঠানের ইতিমধ্যে কাজ করা প্রাক্তন শিক্ষার্থী; আগের যেকোনো চাকরি থেকে যে কেউ, প্রযুক্তির সাথে অসম্পর্কিত হলেও; পরিবারের বন্ধু আর পরিচিত যারা ক্ষেত্রটির কাছাকাছি কোথাও কাজ করেন।</p><p>বেশিরভাগ শিক্ষার্থীর ইতিমধ্যে তারা যা ভাবে তার চেয়ে এর বেশি আছে — তারা শুধু এটি সক্রিয় করেনি, কারণ এটি থেকে কিছু চাওয়া অস্বস্তিকর মনে হয়।</p>'),

      h(2, 'অস্বস্তিকর না হয়ে এটি আসলে কীভাবে ব্যবহার করবেন', 'how-to-actually-use-it-without-being-awkward'),
      p('<p>"can you get me a job" দিয়ে শুরু করবেন না। একটি প্রকৃত, নির্দিষ্ট, কম-চাপের অনুরোধ দিয়ে শুরু করুন: <i>"আমি junior developer ভূমিকার জন্য আবেদন করছি — আপনি কি কাউকে নিয়োগ করতে জানেন, বা আপনি যেখানে কাজ করেছেন সেখানে আবেদন করার সময় আপনার নাম উল্লেখ করলে আপনার আপত্তি আছে?"</i> এটিতে হ্যাঁ বলা সহজ, কারণ এটি তথ্য বা একটি ছোট উপকার চায়, একটি নিশ্চিত ফলাফল নয়।</p>'),

      callout('warning', '<p>এমন একটি যোগাযোগ বা referral কখনো দাবি করবেন না যা আপনার আসলে নেই। এটি যাচাই করা সহজ, এটি যার নাম আপনি ব্যবহার করেছেন তার ক্ষতি করে, আর আপনি যে প্রত্যাখ্যান এড়ানোর চেষ্টা করছিলেন তার চেয়ে এটি আপনার অনেক বেশি স্থায়ীভাবে ক্ষতি করে।</p>', 'কখনো একটি যোগাযোগ বানাবেন না'),

      h(2, 'দরকার হওয়ার আগে নেটওয়ার্কটি তৈরি করা', 'building-the-network-before-you-need-it'),
      p('<p>আপনি চাকরি খোঁজা শুরু করার সপ্তাহে তৈরি একটি নেটওয়ার্ক পাতলা আর স্পষ্ট। আগের মাসগুলোতে তৈরি একটি — সত্যিই সহপাঠীদের সাহায্য করা, প্রশিক্ষকদের সাথে যোগাযোগ রাখা, শুধু কিছু চাওয়ার সময় নয় বরং আসলে অনলাইনে মানুষের সাথে যুক্ত হওয়া — আপনার আসলে দরকার হলে উপলব্ধ আর স্বাভাবিক থাকে।</p>'),

      h(2, 'বিশেষভাবে প্রাক্তন শিক্ষার্থী', 'alumni-specifically'),
      p('<p>যারা একই কোর্স নিয়েছে আর এখন কাজ করছে তারা একটি অস্বাভাবিকভাবে ভালো সম্পদ: তারা ঠিক জানে আপনি কী শিখেছেন, কাজে রূপান্তর কেমন লেগেছিল তা মনে রাখে, আর প্রায়ই সাহায্য করতে ইচ্ছুক ঠিক কারণ কেউ বেশিদিন আগে একইভাবে তাদের সাহায্য করেছিল। আপনার প্রতিষ্ঠানের কোনো প্রাক্তন শিক্ষার্থী গ্রুপ বা চ্যানেল থাকলে, এটির জন্য সরাসরি এটি ব্যবহার করা সার্থক।</p>'),
    ],
  },
})

lessons.push({
  slug: 'the-experience-required-trap',
  sortOrder: 13,
  en: {
    title: 'The "Experience Required" Trap',
    metaTitle: 'The Experience Required Trap | Learn Computer Academy',
    metaDescription: 'Junior postings that ask for two years of experience are common and often more negotiable than they look. What to do about them.',
    blocks: [
      p('<p>"Junior developer wanted, 1-2 years experience required" is a genuinely common posting, and it stops a lot of students from applying at all. It is worth understanding what is actually happening before letting it filter you out.</p>'),

      h(2, 'Why This Contradiction Exists'),
      p('<p>Often the number is closer to a wishlist than a strict requirement — written by someone hoping for an experienced candidate at a junior salary, but willing to hire a strong junior with none of that experience if one applies. Sometimes it is copied from a template without much thought. Occasionally it is a genuine requirement. There is usually no way to tell which from the posting alone.</p>'),

      callout('note', '<p>A frequently useful rule of thumb from hiring research: if you meet roughly half of the listed requirements and are strong on the ones that matter most for the role, it is usually worth applying. Treating every line as a hard requirement filters out a large share of realistic opportunities for no good reason.</p>'),

      h(2, 'What Actually Counts as "Experience"'),
      p('<p>Employers writing these postings are often really asking "has this person built real things and dealt with real problems," not literally "has this person held a paid job for exactly this many years." That can, at least partly, be genuinely demonstrated by:</p><ul><li>Real, finished, deployed projects — not tutorial copies.</li><li>Freelance work, even small or unpaid early projects.</li><li>Open-source contributions.</li><li>Personal projects that solved an actual problem for someone.</li><li>Coursework that involved building something substantial rather than following exercises.</li></ul><p>None of this is identical to a paid job, and being upfront about that is important — but it is genuine evidence of ability, which is what the requirement is usually really trying to screen for.</p>'),

      h(2, 'When It Comes Up in an Interview'),
      p('<p>If asked directly about the experience gap, the strongest response is not defensive — it is confident and specific: acknowledge the gap plainly, then immediately point to what you have built and what it demonstrates. "I don\'t have formal work experience, but I built and deployed [project], which involved [specific real problem you solved]" is a complete, honest, strong answer.</p>'),

      callout('warning', '<p>What does not work: pretending a course project was a paid job, inflating a small personal project into something it wasn\'t, or getting defensive when the gap is pointed out. All three are easy for an experienced interviewer to see through, and they cost more trust than the honest gap itself ever would.</p>'),

      h(2, 'When to Actually Skip a Posting'),
      p('<p>Some gaps are real and worth respecting — a role explicitly requiring deep expertise in a specific framework you have never touched at all is a poor use of your time and theirs. The judgment call is between "this asks for more polish on what I already do" (apply) and "this asks for something I fundamentally haven\'t learned yet" (skip, and treat it as a note on what to learn next).</p>'),
    ],
  },
  bn: {
    title: '"Experience Required" ফাঁদ',
    metaTitle: 'Experience Required ফাঁদ | Learn Computer Academy',
    metaDescription: 'দুই বছরের অভিজ্ঞতা চাওয়া Junior posting সাধারণ আর প্রায়ই যতটা মনে হয় তার চেয়ে বেশি আলোচনাযোগ্য। এটি নিয়ে কী করবেন।',
    blocks: [
      p('<p>"Junior developer wanted, 1-2 years experience required" সত্যিই একটি সাধারণ posting, আর এটি অনেক শিক্ষার্থীকে একেবারেই আবেদন করা থেকে থামায়। এটি আপনাকে ছাঁকতে দেওয়ার আগে আসলে কী ঘটছে তা বোঝা সার্থক।</p>'),

      h(2, 'এই দ্বন্দ্বটি কেন আছে', 'why-this-contradiction-exists'),
      p('<p>প্রায়ই সংখ্যাটি একটি কঠোর প্রয়োজনীয়তার চেয়ে একটি চাহিদা তালিকার কাছাকাছি — একজন junior বেতনে একজন অভিজ্ঞ প্রার্থীর আশায় লেখা, কিন্তু কেউ আবেদন করলে সেই অভিজ্ঞতার কিছুই ছাড়া একজন শক্তিশালী junior নিয়োগ করতে ইচ্ছুক। কখনো এটি বেশি চিন্তা ছাড়াই একটি টেমপ্লেট থেকে কপি করা। কখনো কখনো এটি একটি প্রকৃত প্রয়োজনীয়তা। শুধু posting থেকে কোনটি তা বলার সাধারণত কোনো উপায় নেই।</p>'),

      callout('note', '<p>নিয়োগ গবেষণা থেকে প্রায়ই কাজের একটি সাধারণ নিয়ম: আপনি তালিকাভুক্ত প্রয়োজনীয়তার মোটামুটি অর্ধেক পূরণ করলে আর ভূমিকার জন্য সবচেয়ে গুরুত্বপূর্ণগুলোতে শক্তিশালী হলে, সাধারণত আবেদন করা সার্থক। প্রতিটি লাইনকে একটি কঠোর প্রয়োজনীয়তা হিসেবে গণ্য করা কোনো ভালো কারণ ছাড়াই বাস্তবসম্মত সুযোগের একটি বড় অংশ ছেঁকে ফেলে।</p>'),

      h(2, '"অভিজ্ঞতা" হিসেবে আসলে কী গণ্য হয়', 'what-actually-counts-as-experience'),
      p('<p>এই posting লেখা নিয়োগকর্তারা প্রায়ই আসলে জিজ্ঞাসা করছেন "এই ব্যক্তি আসল জিনিস তৈরি করেছে আর আসল সমস্যা সামলেছে কিনা," আক্ষরিকভাবে "এই ব্যক্তি ঠিক এই বছর ধরে একটি বেতনযুক্ত চাকরি করেছে কিনা" নয়। এটি, অন্তত আংশিকভাবে, সত্যিই এভাবে প্রদর্শন করা যায়:</p><ul><li>আসল, শেষ, deploy করা প্রোজেক্ট — টিউটোরিয়াল কপি নয়।</li><li>Freelance কাজ, এমনকি ছোট বা প্রাথমিক বিনা-বেতনের প্রোজেক্টও।</li><li>Open-source অবদান।</li><li>ব্যক্তিগত প্রোজেক্ট যা কারো জন্য একটি আসল সমস্যা সমাধান করেছে।</li><li>Coursework যাতে ব্যায়াম অনুসরণের বদলে সারবত্তাপূর্ণ কিছু তৈরি জড়িত ছিল।</li></ul><p>এর কোনোটিই একটি বেতনযুক্ত চাকরির অভিন্ন নয়, আর এ বিষয়ে সরাসরি থাকা গুরুত্বপূর্ণ — কিন্তু এটি সক্ষমতার আসল প্রমাণ, যা প্রয়োজনীয়তাটি সাধারণত আসলে যাচাই করার চেষ্টা করছে।</p>'),

      h(2, 'ইন্টারভিউতে এটি উঠলে', 'when-it-comes-up-in-an-interview'),
      p('<p>অভিজ্ঞতার ফাঁক নিয়ে সরাসরি জিজ্ঞাসা করা হলে, সবচেয়ে শক্তিশালী প্রতিক্রিয়া আত্মপক্ষ-সমর্থনমূলক নয় — এটি আত্মবিশ্বাসী আর নির্দিষ্ট: ফাঁকটি সরলভাবে স্বীকার করুন, তারপর সাথে সাথে আপনি কী তৈরি করেছেন আর এটি কী প্রদর্শন করে তা নির্দেশ করুন। "আমার আনুষ্ঠানিক কাজের অভিজ্ঞতা নেই, কিন্তু আমি [প্রোজেক্ট] তৈরি আর deploy করেছি, যাতে [আপনার সমাধান করা নির্দিষ্ট আসল সমস্যা] জড়িত ছিল" একটি সম্পূর্ণ, সৎ, শক্তিশালী উত্তর।</p>'),

      callout('warning', '<p>যা কাজ করে না: একটি কোর্স প্রোজেক্টকে একটি বেতনযুক্ত চাকরি হিসেবে ভান করা, একটি ছোট ব্যক্তিগত প্রোজেক্টকে যা ছিল না তাতে ফুলিয়ে তোলা, বা ফাঁকটি নির্দেশ করা হলে আত্মপক্ষ-সমর্থনমূলক হয়ে ওঠা। একজন অভিজ্ঞ interviewer-এর জন্য তিনটিই সহজে ধরা পড়ে, আর সেগুলো সৎ ফাঁকটি নিজে কখনো করত তার চেয়ে বেশি বিশ্বাস খরচ করায়।</p>'),

      h(2, 'কখন আসলে একটি Posting বাদ দেবেন', 'when-to-actually-skip-a-posting'),
      p('<p>কিছু ফাঁক আসল আর সম্মানের যোগ্য — একটি নির্দিষ্ট framework-এ গভীর দক্ষতা স্পষ্টভাবে চাওয়া একটি ভূমিকা যা আপনি একেবারেই কখনো স্পর্শ করেননি আপনার আর তাদের সময়ের একটি খারাপ ব্যবহার। বিচারের সিদ্ধান্তটি "আমি ইতিমধ্যে যা করি তাতে এটি বেশি পরিমার্জন চায়" (আবেদন করুন) আর "এটি এমন কিছু চায় যা আমি এখনো মৌলিকভাবে শিখিনি" (বাদ দিন, আর এটিকে এরপর কী শিখতে হবে তার একটি নোট হিসেবে গণ্য করুন) এর মধ্যে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'what-actually-happens-in-an-interview',
  sortOrder: 14,
  en: {
    title: 'What Actually Happens in an Interview',
    metaTitle: 'What Actually Happens in a Developer Interview | Learn Computer Academy',
    metaDescription: 'The stages a junior developer interview usually goes through, and why each one exists — so nothing that happens is a surprise.',
    blocks: [
      p('<p>A lot of interview anxiety comes from not knowing what is actually about to happen. The format varies by company, but a junior developer interview usually follows a recognisable shape, and knowing it in advance removes a real source of nervousness.</p>'),

      img(
        'docs/img/career/interview-stages-1',
        'A young job candidate on a video call interview at a laptop in a quiet home setting, notes visible beside the keyboard',
        1024, 768,
        'Knowing the shape of the process in advance removes a real source of nervousness.'
      ),

      h(2, 'The Usual Stages'),
      table(
        ['Stage', 'What happens', 'What it\'s actually checking'],
        [
          ['Screening call', 'Short, sometimes with HR rather than a developer', 'Basic fit, availability, expectations, whether to proceed further'],
          ['Technical interview', 'Questions about your projects, fundamentals, sometimes small problems', 'Whether you actually understand what you claim to'],
          ['Live coding or a task', 'Solving a small problem, sometimes on a shared screen', 'How you think, not just whether you reach the answer'],
          ['Take-home assignment', 'A small project done alone over a few days', 'Real, unpressured work — often the most representative stage'],
          ['Culture / team fit', 'A more conversational round, sometimes with a future teammate', 'Whether you\'d be reasonable to work alongside day to day'],
          ['Final / offer discussion', 'Salary, start date, logistics', 'Closing the process, on both sides'],
        ]
      ),
      p('<p>Not every company runs every stage, and small companies often compress several of these into one conversation. Larger companies typically run more of them, more formally.</p>'),

      h(2, 'Why Each Stage Exists'),
      p('<p>Every stage is trying to answer a different question, which is why they can feel repetitive even though they aren\'t: the screening call checks basic fit, the technical round checks depth, live coding checks process, the take-home checks real unsupervised work, and the culture round checks whether working alongside you would be reasonable day to day. Understanding what each stage is actually for makes it much easier to answer well.</p>'),

      callout('note', '<p>A rejection at one stage doesn\'t erase what you demonstrated at an earlier one. Someone who did well technically but wasn\'t the right team fit for that specific role learned something different from someone who struggled with the fundamentals — and the right response to each is different, covered properly in the rejection section of this course.</p>'),

      h(2, 'Remote and In-Person'),
      p('<p>A remote interview adds its own small logistics that are worth handling in advance: a stable connection, a quiet space, the video call software actually tested beforehand, and a charged device. None of this is about skill, and losing points to a bad connection or a dying laptop is an entirely avoidable, low-effort fix.</p>'),

      h(2, 'What This Means for Preparation'),
      p('<p>Knowing the shape in advance means preparation can be split accordingly: know your own story and projects cold for the early conversational stages, be solid on fundamentals for the technical stage, and practise explaining your thinking out loud for anything coding-related. The next few lessons cover each of these directly.</p>'),
    ],
  },
  bn: {
    title: 'একটি ইন্টারভিউতে আসলে কী ঘটে',
    metaTitle: 'একটি Developer ইন্টারভিউতে আসলে কী ঘটে | Learn Computer Academy',
    metaDescription: 'একটি junior developer ইন্টারভিউ সাধারণত যেসব পর্যায়ের মধ্য দিয়ে যায়, আর কেন প্রতিটি আছে — যাতে যা ঘটে তার কিছুই বিস্ময়কর না হয়।',
    blocks: [
      p('<p>অনেক ইন্টারভিউ উদ্বেগ আসে আসলে কী ঘটতে চলেছে তা না জানা থেকে। ফরম্যাট কোম্পানি ভেদে ভিন্ন হয়, কিন্তু একটি junior developer ইন্টারভিউ সাধারণত একটি চেনা আকৃতি অনুসরণ করে, আর আগে থেকে এটি জানা নার্ভাসনেসের একটি আসল উৎস সরায়।</p>'),

      img(
        'docs/img/career/interview-stages-1',
        'একজন তরুণ চাকরিপ্রার্থী একটি শান্ত বাড়ির পরিবেশে ল্যাপটপে একটি video call ইন্টারভিউতে, কীবোর্ডের পাশে নোট দৃশ্যমান',
        1024, 768,
        'আগে থেকে প্রক্রিয়ার আকৃতি জানা নার্ভাসনেসের একটি আসল উৎস সরায়।'
      ),

      h(2, 'সাধারণ পর্যায়গুলো', 'the-usual-stages'),
      table(
        ['পর্যায়', 'কী ঘটে', 'এটি আসলে কী যাচাই করছে'],
        [
          ['স্ক্রিনিং কল', 'ছোট, কখনো একজন developer-এর বদলে HR-এর সাথে', 'মৌলিক মিল, উপলব্ধতা, প্রত্যাশা, এগিয়ে যাওয়া উচিত কিনা'],
          ['টেকনিক্যাল ইন্টারভিউ', 'আপনার প্রোজেক্ট, মূল বিষয় নিয়ে প্রশ্ন, কখনো ছোট সমস্যা', 'আপনি যা দাবি করেন তা আসলে বোঝেন কিনা'],
          ['Live coding বা একটি কাজ', 'একটি ছোট সমস্যা সমাধান, কখনো একটি শেয়ার করা স্ক্রিনে', 'আপনি কীভাবে ভাবেন, শুধু উত্তরে পৌঁছান কিনা নয়'],
          ['Take-home কাজ', 'একা কয়েক দিন ধরে করা একটি ছোট প্রোজেক্ট', 'আসল, চাপহীন কাজ — প্রায়ই সবচেয়ে প্রতিনিধিত্বমূলক পর্যায়'],
          ['Culture / team fit', 'বেশি কথোপকথনমূলক একটি রাউন্ড, কখনো একজন ভবিষ্যৎ সহকর্মীর সাথে', 'দৈনন্দিন আপনার সাথে কাজ করা যুক্তিসঙ্গত হবে কিনা'],
          ['চূড়ান্ত / অফার আলোচনা', 'বেতন, শুরুর তারিখ, লজিস্টিক', 'দুই পক্ষেই প্রক্রিয়া বন্ধ করা'],
        ]
      ),
      p('<p>প্রতিটি কোম্পানি প্রতিটি পর্যায় চালায় না, আর ছোট কোম্পানি প্রায়ই এগুলোর কয়েকটি একটি কথোপকথনে সংকুচিত করে। বড় কোম্পানি সাধারণত এগুলোর বেশি চালায়, বেশি আনুষ্ঠানিকভাবে।</p>'),

      h(2, 'প্রতিটি পর্যায় কেন আছে', 'why-each-stage-exists'),
      p('<p>প্রতিটি পর্যায় একটি ভিন্ন প্রশ্নের উত্তর দেওয়ার চেষ্টা করছে, যে কারণে সেগুলো পুনরাবৃত্ত মনে হতে পারে যদিও নয়: স্ক্রিনিং কল মৌলিক মিল যাচাই করে, টেকনিক্যাল রাউন্ড গভীরতা যাচাই করে, live coding প্রক্রিয়া যাচাই করে, take-home আসল unsupervised কাজ যাচাই করে, আর culture রাউন্ড দৈনন্দিন আপনার সাথে কাজ করা যুক্তিসঙ্গত হবে কিনা যাচাই করে। প্রতিটি পর্যায় আসলে কীসের জন্য তা বোঝা ভালো উত্তর দেওয়া অনেক সহজ করে।</p>'),

      callout('note', '<p>একটি পর্যায়ে একটি প্রত্যাখ্যান আগেরটিতে আপনি যা প্রদর্শন করেছেন তা মুছে দেয় না। যে টেকনিক্যালি ভালো করেছে কিন্তু সেই নির্দিষ্ট ভূমিকার জন্য সঠিক team fit ছিল না সে মূল বিষয়ে সংগ্রাম করা কারো চেয়ে ভিন্ন কিছু শিখেছে — আর প্রতিটির সঠিক প্রতিক্রিয়া ভিন্ন, এই কোর্সের প্রত্যাখ্যান অংশে ঠিকভাবে কভার করা।</p>'),

      h(2, 'রিমোট আর সরাসরি', 'remote-and-in-person'),
      p('<p>একটি রিমোট ইন্টারভিউ এর নিজস্ব ছোট লজিস্টিক যোগ করে যা আগে থেকে সামলানো সার্থক: একটি স্থিতিশীল সংযোগ, একটি শান্ত জায়গা, আগে থেকে আসলে পরীক্ষা করা video call সফটওয়্যার, আর একটি চার্জ করা ডিভাইস। এর কোনোটিই দক্ষতা নিয়ে নয়, আর একটি খারাপ সংযোগ বা মরে যাওয়া ল্যাপটপে পয়েন্ট হারানো সম্পূর্ণভাবে এড়ানো যায় এমন একটি কম-পরিশ্রমের সমাধান।</p>'),

      h(2, 'প্রস্তুতির জন্য এর অর্থ কী', 'what-this-means-for-preparation'),
      p('<p>আগে থেকে আকৃতিটি জানা মানে প্রস্তুতি সেই অনুযায়ী ভাগ করা যায়: প্রাথমিক কথোপকথনমূলক পর্যায়ের জন্য আপনার নিজের গল্প আর প্রোজেক্ট ঠান্ডা মাথায় জানুন, টেকনিক্যাল পর্যায়ের জন্য মূল বিষয়ে শক্ত হন, আর coding-সম্পর্কিত যেকোনো কিছুর জন্য জোরে আপনার চিন্তা ব্যাখ্যা করার অনুশীলন করুন। পরের কয়েকটি পাঠ এগুলোর প্রতিটি সরাসরি কভার করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'preparing-for-an-interview',
  sortOrder: 15,
  en: {
    title: 'Preparing for an Interview',
    metaTitle: 'Preparing for a Developer Interview | Learn Computer Academy',
    metaDescription: 'What real preparation looks like beyond re-reading notes — researching the company, rehearsing out loud, and the two-day checklist.',
    blocks: [
      p('<p>Most interview preparation is passive — re-reading notes, browsing a topic list. Little of that transfers to actually performing well in the room. Preparation that changes the outcome looks different.</p>'),

      h(2, 'Research the Company, Specifically'),
      p('<p>Spend twenty minutes before any interview finding out: what the company actually builds, roughly who their customers are, and — where you can find it — what technologies they use. This does three things at once: it lets you ask an informed question later, it lets you connect your own experience to their actual work rather than speaking generically, and it signals real interest, which is itself noticed.</p>'),

      h(2, 'Prepare Your Own Material, Not Just Theirs'),
      p('<ul><li><b>Your projects</b> — able to explain each one in under two minutes, and go deeper on request.</li><li><b>Your story</b> — why this field, why this role, in a few natural sentences (the next lesson covers this specifically).</li><li><b>Likely questions</b> — for a junior role, expect questions on fundamentals in your stack, one or two problem-solving questions, and "why do you want this role."</li><li><b>Your own questions to ask</b> — prepared in advance, covered in a later lesson.</li></ul>'),

      h(2, 'Rehearse Out Loud, Not Just in Your Head'),
      p('<p>Thinking through an answer silently and saying it out loud are different skills, and the gap between them is exactly where nerves show up. Practise answering common questions out loud — to a mirror, to a friend, recorded on your phone. It feels awkward the first few times and it works.</p>'),

      callout('tip', '<p>Time yourself explaining a project. Two minutes is a genuinely short amount of time, and most people, unpracticed, either run long and lose the listener or leave out the interesting part entirely. Practising against a clock fixes this fast.</p>'),

      h(2, 'A Two-Day-Before Checklist'),
      p('<ul><li>Confirm the format (call, video, in person) and platform.</li><li>Test your setup if remote — camera, microphone, internet.</li><li>Re-read the job posting and match it against your own prepared examples.</li><li>Plan your route or your login well in advance if it\'s in-person or first thing in the morning.</li><li>Prepare two or three questions to ask them.</li><li>Get a proper night\'s sleep — this affects performance more than one extra hour of last-minute review does.</li></ul>'),

      h(2, 'What Preparation Cannot Do'),
      p('<p>Preparation reduces nervousness and improves clarity. It does not guarantee an offer, and treating any single interview as a pass-or-fail verdict on your worth sets up exactly the kind of discouragement the rejection section of this course deals with directly. Prepare seriously, then let the outcome be what it is.</p>'),
    ],
  },
  bn: {
    title: 'একটি ইন্টারভিউর জন্য প্রস্তুতি',
    metaTitle: 'একটি Developer ইন্টারভিউর জন্য প্রস্তুতি | Learn Computer Academy',
    metaDescription: 'নোট আবার পড়ার বাইরে আসল প্রস্তুতি কেমন দেখায় — কোম্পানি গবেষণা করা, জোরে অনুশীলন করা, আর দুই-দিনের চেকলিস্ট।',
    blocks: [
      p('<p>বেশিরভাগ ইন্টারভিউ প্রস্তুতি নিষ্ক্রিয় — নোট আবার পড়া, একটি বিষয়ের তালিকা ব্রাউজ করা। এর সামান্যই ঘরে আসলে ভালো পারফর্ম করায় স্থানান্তরিত হয়। ফলাফল বদলানো প্রস্তুতি ভিন্ন দেখায়।</p>'),

      h(2, 'কোম্পানি নিয়ে গবেষণা করুন, নির্দিষ্টভাবে', 'research-the-company-specifically'),
      p('<p>যেকোনো ইন্টারভিউর আগে বিশ মিনিট এটি খুঁজে বের করতে দিন: কোম্পানিটি আসলে কী তৈরি করে, মোটামুটি তাদের গ্রাহক কারা, আর — খুঁজে পেলে — তারা কোন প্রযুক্তি ব্যবহার করে। এটি একসাথে তিনটি কাজ করে: এটি আপনাকে পরে একটি তথ্যপূর্ণ প্রশ্ন জিজ্ঞাসা করতে দেয়, এটি আপনাকে সাধারণভাবে কথা না বলে আপনার নিজের অভিজ্ঞতা তাদের আসল কাজের সাথে সংযুক্ত করতে দেয়, আর এটি আসল আগ্রহের সংকেত দেয়, যা নিজেই লক্ষ্য করা হয়।</p>'),

      h(2, 'শুধু তাদের নয়, আপনার নিজের উপাদান প্রস্তুত করুন', 'prepare-your-own-material-not-just-theirs'),
      p('<ul><li><b>আপনার প্রোজেক্ট</b> — প্রতিটি দুই মিনিটের কমে ব্যাখ্যা করতে সক্ষম, আর অনুরোধে আরও গভীরে যাওয়া।</li><li><b>আপনার গল্প</b> — কেন এই ক্ষেত্র, কেন এই ভূমিকা, কয়েকটি স্বাভাবিক বাক্যে (পরের পাঠ এটি নির্দিষ্টভাবে কভার করে)।</li><li><b>সম্ভাব্য প্রশ্ন</b> — একটি junior ভূমিকার জন্য, আপনার stack-এর মূল বিষয়ে প্রশ্ন, এক বা দুটি সমস্যা-সমাধান প্রশ্ন, আর "কেন আপনি এই ভূমিকা চান" আশা করুন।</li><li><b>জিজ্ঞাসা করার আপনার নিজের প্রশ্ন</b> — আগে থেকে প্রস্তুত, একটি পরের পাঠে কভার করা।</li></ul>'),

      h(2, 'মাথায় নয়, জোরে অনুশীলন করুন', 'rehearse-out-loud-not-just-in-your-head'),
      p('<p>নীরবে একটি উত্তর নিয়ে ভাবা আর এটি জোরে বলা ভিন্ন দক্ষতা, আর তাদের মধ্যে ফাঁকটি ঠিক যেখানে নার্ভাসনেস দেখা যায়। সাধারণ প্রশ্নের জোরে উত্তর দেওয়ার অনুশীলন করুন — একটি আয়নার কাছে, একজন বন্ধুর কাছে, আপনার ফোনে রেকর্ড করা। প্রথম কয়েকবার এটি অস্বস্তিকর লাগে আর এটি কাজ করে।</p>'),

      callout('tip', '<p>একটি প্রোজেক্ট ব্যাখ্যা করতে নিজের সময় নিন। দুই মিনিট সত্যিই একটি ছোট সময়, আর বেশিরভাগ মানুষ, অনুশীলন ছাড়া, হয় লম্বা হয়ে যায় আর শ্রোতা হারায় নয়তো আকর্ষণীয় অংশটি সম্পূর্ণ বাদ দেয়। একটি ঘড়ির বিরুদ্ধে অনুশীলন এটি দ্রুত ঠিক করে।</p>'),

      h(2, 'দুই-দিন-আগের একটি চেকলিস্ট', 'a-two-day-before-checklist'),
      p('<ul><li>ফরম্যাট (কল, ভিডিও, সরাসরি) আর প্ল্যাটফর্ম নিশ্চিত করুন।</li><li>রিমোট হলে আপনার সেটআপ পরীক্ষা করুন — ক্যামেরা, মাইক্রোফোন, ইন্টারনেট।</li><li>Job posting আবার পড়ুন আর আপনার নিজের প্রস্তুত উদাহরণের সাথে মেলান।</li><li>এটি সরাসরি হলে বা সকালে প্রথম হলে আপনার পথ বা আপনার login ভালোভাবে আগে থেকে পরিকল্পনা করুন।</li><li>তাদের জিজ্ঞাসা করার জন্য দুই বা তিনটি প্রশ্ন প্রস্তুত করুন।</li><li>একটি ঠিকঠাক রাতের ঘুম নিন — এটি শেষ মুহূর্তের এক অতিরিক্ত ঘণ্টা পর্যালোচনার চেয়ে বেশি পারফরম্যান্স প্রভাবিত করে।</li></ul>'),

      h(2, 'প্রস্তুতি যা করতে পারে না', 'what-preparation-cannot-do'),
      p('<p>প্রস্তুতি নার্ভাসনেস কমায় আর স্পষ্টতা উন্নত করে। এটি একটি অফার নিশ্চিত করে না, আর যেকোনো একক ইন্টারভিউকে আপনার মূল্যের উপর একটি পাস-বা-ফেল রায় হিসেবে গণ্য করা ঠিক এই কোর্সের প্রত্যাখ্যান অংশ সরাসরি সামলায় এমন ধরনের নিরুৎসাহ তৈরি করে। গুরুত্বসহকারে প্রস্তুতি নিন, তারপর ফলাফল যা তা হতে দিন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'communicating-clearly-under-pressure',
  sortOrder: 16,
  en: {
    title: 'Communicating Clearly Under Pressure',
    metaTitle: 'Communicating Clearly Under Interview Pressure | Learn Computer Academy',
    metaDescription: 'For many candidates, the real barrier in an interview is confidence speaking English under pressure, not technical knowledge. Addressed directly, with practical fixes.',
    blocks: [
      p('<p>For many candidates, what actually goes wrong in an interview is not a lack of technical knowledge — it is losing clarity under pressure, often specifically while trying to explain something in English. This is common enough, and rarely named directly enough, that it deserves its own lesson rather than a passing mention.</p>'),

      h(2, 'Naming the Actual Problem'),
      p('<p>If English is not your first language, or you are more confident in it reading and writing than speaking under pressure, that is not a reflection of your technical ability, and it is not rare. It is a genuinely common situation for candidates across India, and pretending it doesn\'t affect interviews helps nobody prepare for it.</p><p>What matters to a technical interviewer is almost always whether your <b>reasoning</b> is clear — not whether your grammar is perfect. Knowing that changes what to actually practise.</p>'),

      h(2, 'What Actually Helps'),
      p('<ul><li><b>Slow down on purpose.</b> Nervousness speeds speech up, which is exactly when clarity drops. A slightly slower pace reads as more confident, not less, even when it doesn\'t feel that way from the inside.</li><li><b>Prepare key phrases in advance</b>, especially for explaining your projects and your reasoning — you don\'t need to improvise language under pressure if the structure is already rehearsed.</li><li><b>Simple, direct sentences beat complex ones.</b> "I used a hook to manage the state" is clearer and safer than a longer sentence attempting more nuance and losing precision halfway through.</li><li><b>It is completely acceptable to ask for a question to be repeated or clarified.</b> This is not a weakness, and every experienced interviewer has had this asked of them many times without thinking less of the candidate.</li><li><b>Practising out loud, in English, regularly</b> — not just reading, actually speaking — is what closes this gap over time. Explaining your own projects out loud is good practice for exactly this.</li></ul>'),

      callout('note', '<p>A pause to think is not a failure. Silence for a few seconds while organising a thought reads as consideration, not as not knowing the answer. Rushing to fill that silence with a half-formed sentence usually reads worse than the pause would have.</p>', 'A pause is not a failure'),

      h(2, 'Being Asked to Repeat Yourself'),
      p('<p>If an interviewer asks you to clarify or repeat something, that is not automatically criticism of your English — technical explanations are often genuinely unclear the first time regardless of language, and asking for clarification is completely normal in any professional conversation. Restate the same point more simply rather than a different, more complicated way of saying it.</p>'),

      h(2, 'This Improves With Deliberate Practice'),
      p('<p>This specific skill — technical explanation, under pressure, in English — improves measurably with repetition, in a way that is faster and more direct than general English study. Explaining your own projects out loud, to a friend, a mirror, or a phone recording, twenty times before an interview, is more useful preparation for this specific problem than almost anything else on this list.</p>'),
    ],
  },
  bn: {
    title: 'চাপের মধ্যে স্পষ্টভাবে যোগাযোগ করা',
    metaTitle: 'ইন্টারভিউর চাপে স্পষ্টভাবে যোগাযোগ করা | Learn Computer Academy',
    metaDescription: 'অনেক প্রার্থীর জন্য, একটি ইন্টারভিউতে আসল বাধা হলো চাপের মধ্যে ইংরেজি বলার আত্মবিশ্বাস, টেকনিক্যাল জ্ঞান নয়। সরাসরি সম্বোধন করা, ব্যবহারিক সমাধানসহ।',
    blocks: [
      p('<p>অনেক প্রার্থীর জন্য, একটি ইন্টারভিউতে আসলে যা ভুল হয় তা টেকনিক্যাল জ্ঞানের অভাব নয় — এটি চাপের মধ্যে স্পষ্টতা হারানো, প্রায়ই বিশেষভাবে ইংরেজিতে কিছু ব্যাখ্যা করার চেষ্টা করার সময়। এটি যথেষ্ট সাধারণ, আর যথেষ্ট সরাসরি নাম দেওয়া হয় না, যে এটি একটি সংক্ষিপ্ত উল্লেখের বদলে নিজস্ব একটি পাঠের যোগ্য।</p>'),

      h(2, 'আসল সমস্যার নাম দেওয়া', 'naming-the-actual-problem'),
      p('<p>ইংরেজি আপনার প্রথম ভাষা না হলে, বা আপনি এটি পড়া আর লেখায় চাপের মধ্যে বলার চেয়ে বেশি আত্মবিশ্বাসী হলে, এটি আপনার টেকনিক্যাল সক্ষমতার প্রতিফলন নয়, আর এটি বিরল নয়। ভারত জুড়ে প্রার্থীদের জন্য এটি সত্যিই একটি সাধারণ পরিস্থিতি, আর এটি ইন্টারভিউকে প্রভাবিত করে না এমন ভান করা কাউকে এর জন্য প্রস্তুত হতে সাহায্য করে না।</p><p>একজন টেকনিক্যাল interviewer-এর কাছে যা গুরুত্বপূর্ণ তা প্রায় সবসময় আপনার <b>যুক্তি</b> স্পষ্ট কিনা — আপনার ব্যাকরণ নিখুঁত কিনা নয়। এটি জানা আসলে কী অনুশীলন করতে হবে তা বদলায়।</p>'),

      h(2, 'যা আসলে সাহায্য করে', 'what-actually-helps'),
      p('<ul><li><b>ইচ্ছাকৃতভাবে ধীর করুন।</b> নার্ভাসনেস কথা বলা দ্রুত করে, যা ঠিক তখনই যখন স্পষ্টতা কমে। কিছুটা ধীর গতি ভেতর থেকে যেমন মনে হয় তার চেয়েও কম নয়, বেশি আত্মবিশ্বাসী পড়া যায়।</li><li><b>আগে থেকে মূল বাক্যাংশ প্রস্তুত করুন</b>, বিশেষত আপনার প্রোজেক্ট আর আপনার যুক্তি ব্যাখ্যার জন্য — গঠনটি ইতিমধ্যে অনুশীলিত থাকলে চাপের মধ্যে ভাষা তাৎক্ষণিকভাবে তৈরি করতে হয় না।</li><li><b>সরল, সরাসরি বাক্য জটিলগুলোকে হারায়।</b> "I used a hook to manage the state" বেশি সূক্ষ্মতার চেষ্টা করা আর মাঝপথে নির্ভুলতা হারানো একটি লম্বা বাক্যের চেয়ে স্পষ্ট আর নিরাপদ।</li><li><b>একটি প্রশ্ন পুনরাবৃত্তি বা স্পষ্ট করতে বলা সম্পূর্ণ গ্রহণযোগ্য।</b> এটি একটি দুর্বলতা নয়, আর প্রতিটি অভিজ্ঞ interviewer-কে এটি বহুবার জিজ্ঞাসা করা হয়েছে প্রার্থী সম্পর্কে কম না ভেবে।</li><li><b>নিয়মিত জোরে, ইংরেজিতে অনুশীলন করা</b> — শুধু পড়া নয়, আসলে বলা — এটিই সময়ের সাথে এই ফাঁক বন্ধ করে। আপনার নিজের প্রোজেক্ট জোরে ব্যাখ্যা করা ঠিক এর জন্য ভালো অনুশীলন।</li></ul>'),

      callout('note', '<p>ভাবার জন্য একটি বিরতি ব্যর্থতা নয়। একটি চিন্তা সাজানোর সময় কয়েক সেকেন্ডের নীরবতা বিবেচনা হিসেবে পড়া যায়, উত্তর না জানা হিসেবে নয়। একটি অর্ধ-তৈরি বাক্য দিয়ে সেই নীরবতা ভরাট করতে তাড়াহুড়ো করা সাধারণত বিরতিটির চেয়ে খারাপ পড়া যায়।</p>', 'একটি বিরতি ব্যর্থতা নয়'),

      h(2, 'নিজেকে পুনরাবৃত্তি করতে বলা হলে', 'being-asked-to-repeat-yourself'),
      p('<p>একজন interviewer যদি আপনাকে কিছু স্পষ্ট করতে বা পুনরাবৃত্তি করতে বলেন, এটি স্বয়ংক্রিয়ভাবে আপনার ইংরেজির সমালোচনা নয় — ভাষা নির্বিশেষে টেকনিক্যাল ব্যাখ্যা প্রায়ই প্রথমবার সত্যিই অস্পষ্ট থাকে, আর স্পষ্টীকরণ চাওয়া যেকোনো পেশাদার কথোপকথনে সম্পূর্ণ স্বাভাবিক। বলার একটি ভিন্ন, বেশি জটিল উপায়ের বদলে একই বিষয় বেশি সরলভাবে পুনরায় বলুন।</p>'),

      h(2, 'ইচ্ছাকৃত অনুশীলনে এটি উন্নত হয়', 'this-improves-with-deliberate-practice'),
      p('<p>এই নির্দিষ্ট দক্ষতা — টেকনিক্যাল ব্যাখ্যা, চাপের মধ্যে, ইংরেজিতে — পুনরাবৃত্তিতে পরিমাপযোগ্যভাবে উন্নত হয়, সাধারণ ইংরেজি অধ্যয়নের চেয়ে দ্রুত আর বেশি সরাসরি উপায়ে। একটি ইন্টারভিউর আগে বিশবার একজন বন্ধুর কাছে, একটি আয়নার কাছে, বা একটি ফোন রেকর্ডিংয়ে জোরে আপনার নিজের প্রোজেক্ট ব্যাখ্যা করা এই নির্দিষ্ট সমস্যার জন্য এই তালিকার প্রায় অন্য যেকোনো কিছুর চেয়ে বেশি কাজের প্রস্তুতি।</p>'),
    ],
  },
})

lessons.push({
  slug: 'how-you-come-across',
  sortOrder: 17,
  en: {
    title: 'How You Come Across',
    metaTitle: 'How You Come Across in an Interview | Learn Computer Academy',
    metaDescription: 'Personality in an interview is not performance or charisma. It is a handful of specific, practisable behaviours that build trust quickly.',
    blocks: [
      p('<p>"Personality" in a hiring context does not mean being extroverted, entertaining, or naturally charismatic. It means whether an interviewer, in a short conversation, comes away trusting that you\'d be reasonable and pleasant to work with. That is a much narrower and more practisable thing than "personality" suggests.</p>'),

      h(2, 'What Actually Builds That Trust'),
      p('<ul><li><b>Genuine engagement</b> — reacting to what they actually say, rather than delivering rehearsed lines regardless of the question asked.</li><li><b>Curiosity</b> — asking a real question when something isn\'t clear, rather than nodding through confusion.</li><li><b>Honesty about limits</b> — covered in its own lesson shortly, and one of the fastest ways to build trust in a technical conversation specifically.</li><li><b>Basic warmth</b> — a genuine "thank you for the opportunity," actually listening rather than just waiting for your turn to speak, showing up on time.</li><li><b>Calm under a difficult question</b> — not visibly rattled, not defensive, not pretending nothing is hard.</li></ul>'),

      h(2, 'None of This Requires Extroversion'),
      p('<p>A quiet, careful candidate who listens well, answers precisely, and is honest about gaps often comes across better than an outwardly confident one who talks over the interviewer or oversells. Being naturally reserved is not a disadvantage here — it just needs its own version of preparation rather than trying to imitate a different personality entirely.</p>'),

      callout('warning', '<p>The specific thing to avoid is not quietness — it is disengagement. Not asking a single question the entire interview, giving one-word answers with no elaboration, or showing no visible reaction to anything said reads as disinterest, whatever the actual intent behind it was.</p>'),

      h(2, 'Body Language, Briefly'),
      p('<p>For video calls specifically: look at the camera occasionally, not just the screen, since that is what reads as eye contact on the other end. Sit reasonably upright. A calm, steady presence communicates more than most people expect it to, and it is a habit rather than a talent — noticeable and correctable with a little practice in front of a camera beforehand.</p>'),

      h(2, 'The One-Sentence Version'),
      p('<p>Come across as someone paying real attention, answering honestly, and genuinely interested in the conversation. That single description covers most of what "personality" is actually being evaluated on in this context, and every part of it is something you can deliberately practise.</p>'),
    ],
  },
  bn: {
    title: 'আপনি কেমন দেখা যান',
    metaTitle: 'একটি ইন্টারভিউতে আপনি কেমন দেখা যান | Learn Computer Academy',
    metaDescription: 'নিয়োগের প্রসঙ্গে "personality" অভিনয় বা karisma নয়। এটি অল্প কয়েকটি নির্দিষ্ট, অনুশীলনযোগ্য আচরণ যা দ্রুত বিশ্বাস তৈরি করে।',
    blocks: [
      p('<p>নিয়োগের প্রসঙ্গে "personality" মানে বহির্মুখী, বিনোদনদায়ক, বা স্বাভাবিকভাবে karismatic হওয়া নয়। এর অর্থ একজন interviewer, একটি ছোট কথোপকথনে, এই বিশ্বাস নিয়ে বেরিয়ে যান কিনা যে আপনার সাথে কাজ করা যুক্তিসঙ্গত আর আনন্দদায়ক হবে। এটি "personality" যা বোঝায় তার চেয়ে অনেক সংকীর্ণ আর অনুশীলনযোগ্য জিনিস।</p>'),

      h(2, 'আসলে কী সেই বিশ্বাস তৈরি করে', 'what-actually-builds-that-trust'),
      p('<ul><li><b>প্রকৃত সম্পৃক্ততা</b> — জিজ্ঞাসিত প্রশ্ন নির্বিশেষে অনুশীলিত লাইন দেওয়ার বদলে তারা আসলে যা বলে তাতে প্রতিক্রিয়া দেওয়া।</li><li><b>কৌতূহল</b> — বিভ্রান্তির মধ্য দিয়ে মাথা নাড়ার বদলে কিছু স্পষ্ট না হলে একটি আসল প্রশ্ন জিজ্ঞাসা করা।</li><li><b>সীমা সম্পর্কে সততা</b> — শীঘ্রই নিজস্ব একটি পাঠে কভার করা, আর বিশেষভাবে একটি টেকনিক্যাল কথোপকথনে বিশ্বাস তৈরির দ্রুততম উপায়গুলোর একটি।</li><li><b>মৌলিক উষ্ণতা</b> — একটি প্রকৃত "সুযোগের জন্য ধন্যবাদ," শুধু আপনার কথা বলার পালার জন্য অপেক্ষা করার বদলে আসলে শোনা, সময়মতো হাজির হওয়া।</li><li><b>একটি কঠিন প্রশ্নের নিচে শান্ত</b> — দৃশ্যত বিচলিত নয়, আত্মপক্ষ-সমর্থনমূলক নয়, কিছুই কঠিন নয় এমন ভান নয়।</li></ul>'),

      h(2, 'এর কোনোটিতেই বহির্মুখিতার প্রয়োজন নেই', 'none-of-this-requires-extroversion'),
      p('<p>একজন শান্ত, সাবধানী প্রার্থী যে ভালো শোনে, নির্ভুলভাবে উত্তর দেয়, আর ফাঁক সম্পর্কে সৎ সে প্রায়ই interviewer-এর উপর কথা বলা বা অতিরিক্ত বিক্রি করা একজন বাহ্যত আত্মবিশ্বাসী একজনের চেয়ে ভালো দেখা যায়। স্বাভাবিকভাবে সংরক্ষিত হওয়া এখানে একটি অসুবিধা নয় — এর শুধু সম্পূর্ণ ভিন্ন একটি ব্যক্তিত্ব অনুকরণের চেষ্টার বদলে নিজস্ব একটি প্রস্তুতির সংস্করণ প্রয়োজন।</p>'),

      callout('warning', '<p>এড়ানোর নির্দিষ্ট জিনিসটি শান্ততা নয় — এটি বিচ্ছিন্নতা। পুরো ইন্টারভিউতে একটি প্রশ্নও না জিজ্ঞাসা করা, কোনো বিস্তারিত ছাড়া এক-শব্দের উত্তর দেওয়া, বা বলা কোনো কিছুতে কোনো দৃশ্যমান প্রতিক্রিয়া না দেখানো অনাগ্রহ হিসেবে পড়া যায়, এর পেছনের আসল উদ্দেশ্য যাই হোক।</p>'),

      h(2, 'Body Language, সংক্ষেপে', 'body-language-briefly'),
      p('<p>বিশেষভাবে video call-এর জন্য: শুধু স্ক্রিন নয়, মাঝে মাঝে ক্যামেরার দিকে তাকান, কারণ অন্য প্রান্তে সেটিই eye contact হিসেবে পড়া যায়। যুক্তিসঙ্গতভাবে সোজা বসুন। একটি শান্ত, স্থির উপস্থিতি বেশিরভাগ মানুষ যা আশা করে তার চেয়ে বেশি যোগাযোগ করে, আর এটি একটি প্রতিভার বদলে একটি অভ্যাস — আগে থেকে একটি ক্যামেরার সামনে একটু অনুশীলনে লক্ষণীয় আর সংশোধনযোগ্য।</p>'),

      h(2, 'এক-বাক্যের সংস্করণ', 'the-one-sentence-version'),
      p('<p>এমন কেউ হিসেবে দেখা দিন যে আসল মনোযোগ দিচ্ছে, সৎভাবে উত্তর দিচ্ছে, আর কথোপকথনে সত্যিই আগ্রহী। সেই একক বর্ণনাটি এই প্রসঙ্গে "personality" আসলে কীসের উপর মূল্যায়িত হচ্ছে তার বেশিরভাগ কভার করে, আর এর প্রতিটি অংশ এমন কিছু যা আপনি ইচ্ছাকৃতভাবে অনুশীলন করতে পারেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'tell-me-about-yourself',
  sortOrder: 18,
  en: {
    title: '"Tell Me About Yourself"',
    metaTitle: 'How to Answer Tell Me About Yourself | Learn Computer Academy',
    metaDescription: 'Almost every interview opens with this question, and most candidates answer it badly by rambling. A simple structure that works every time.',
    blocks: [
      p('<p>Almost every interview opens with some version of "tell me about yourself" or "walk me through your background." It feels like an easy question and most candidates answer it badly — either rambling through an unstructured life story, or freezing because the question is so open-ended.</p>'),

      h(2, 'What They Are Actually Asking'),
      p('<p>Nobody wants your full biography. The real question is narrower: <b>why are you relevant to this role, in a way I can follow in under a minute?</b> Treat it as that question, not the literal one.</p>'),

      h(2, 'A Structure That Works'),
      p('<p>A reliable shape: <b>where you are now</b> (briefly) → <b>what got you into this field</b> (briefly) → <b>what you\'ve built or learned that\'s relevant</b> (the main part) → <b>what you\'re looking for now</b> (a short close that connects to this role).</p>'),
      code('text', 'Weak (unstructured): "So I was born in... I went to school... then I\ngot interested in computers... my family... then I joined this\ncourse... it was really interesting... um..."\n\nStructured: "I finished a web development course a few months ago,\nfocused on React and Node. Before that I was drawn to programming\nbecause I liked figuring out how things worked, not just using them.\nDuring the course I built a couple of projects on my own — a task\nmanager with a REST API I wrote myself — and that\'s when I realised\nI wanted to focus on frontend work specifically. I\'m looking for a\njunior role where I can keep building on that and learn from a real\nteam."'),

      h(2, 'Keep It Short'),
      p('<p>Sixty to ninety seconds is the right length. Longer and the interviewer\'s attention drifts before you get to anything relevant to the job at hand; shorter and it can feel dismissive of a genuine opening question. Time yourself while practising — this is one of the easiest things on this list to over- or under-shoot without noticing.</p>'),

      callout('warning', '<p>Do not memorise it word for word. A rehearsed answer delivered like a recitation sounds stiff and unnatural, and it audibly breaks if you get interrupted or asked a follow-up mid-answer. Know the shape and the key points; let the exact wording vary naturally each time.</p>', 'Structure it, do not script it'),

      h(2, 'Tailor the Ending'),
      p('<p>The middle of the answer — your background and what you\'ve built — stays roughly the same across interviews. The close should shift slightly toward the specific role: mention something about the company or the position that connects to what you just said, using the research from the preparation lesson.</p>'),
    ],
  },
  bn: {
    title: '"Tell Me About Yourself"',
    metaTitle: 'Tell Me About Yourself-এর উত্তর কীভাবে দেবেন | Learn Computer Academy',
    metaDescription: 'প্রায় প্রতিটি ইন্টারভিউ এই প্রশ্ন দিয়ে শুরু হয়, আর বেশিরভাগ প্রার্থী এলোমেলো কথা বলে এর খারাপ উত্তর দেয়। একটি সরল গঠন যা প্রতিবার কাজ করে।',
    blocks: [
      p('<p>প্রায় প্রতিটি ইন্টারভিউ "tell me about yourself" বা "walk me through your background"-এর কোনো একটি সংস্করণ দিয়ে শুরু হয়। এটি একটি সহজ প্রশ্ন মনে হয় আর বেশিরভাগ প্রার্থী এর খারাপ উত্তর দেয় — হয় একটি অগঠিত জীবনকাহিনীর মধ্য দিয়ে এলোমেলো কথা বলে, নয়তো প্রশ্নটি এত খোলা বলে জমে যায়।</p>'),

      h(2, 'তারা আসলে কী জিজ্ঞাসা করছে', 'what-they-are-actually-asking'),
      p('<p>কেউ আপনার সম্পূর্ণ জীবনী চায় না। আসল প্রশ্নটি সংকীর্ণ: <b>আপনি এই ভূমিকার জন্য কেন প্রাসঙ্গিক, এক মিনিটের কমে আমি অনুসরণ করতে পারি এমনভাবে?</b> এটিকে আক্ষরিক প্রশ্নের বদলে সেই প্রশ্ন হিসেবে গণ্য করুন।</p>'),

      h(2, 'একটি গঠন যা কাজ করে', 'a-structure-that-works'),
      p('<p>একটি নির্ভরযোগ্য আকৃতি: <b>আপনি এখন কোথায় আছেন</b> (সংক্ষেপে) → <b>এই ক্ষেত্রে আপনাকে কী নিয়ে এসেছে</b> (সংক্ষেপে) → <b>আপনি কী তৈরি করেছেন বা শিখেছেন যা প্রাসঙ্গিক</b> (প্রধান অংশ) → <b>আপনি এখন কী খুঁজছেন</b> (এই ভূমিকার সাথে সংযুক্ত একটি ছোট সমাপ্তি)।</p>'),
      code('text', 'দুর্বল (অগঠিত): "So I was born in... I went to school... then I\ngot interested in computers... my family... then I joined this\ncourse... it was really interesting... um..."\n\nগঠিত: "I finished a web development course a few months ago,\nfocused on React and Node. Before that I was drawn to programming\nbecause I liked figuring out how things worked, not just using them.\nDuring the course I built a couple of projects on my own — a task\nmanager with a REST API I wrote myself — and that\'s when I realised\nI wanted to focus on frontend work specifically. I\'m looking for a\njunior role where I can keep building on that and learn from a real\nteam."'),

      h(2, 'এটি ছোট রাখুন', 'keep-it-short'),
      p('<p>ষাট থেকে নব্বই সেকেন্ড সঠিক দৈর্ঘ্য। বেশি লম্বা হলে হাতের কাজের সাথে প্রাসঙ্গিক কিছুতে পৌঁছানোর আগে interviewer-এর মনোযোগ সরে যায়; ছোট হলে এটি একটি প্রকৃত সূচনা প্রশ্নকে অবহেলা করা মনে হতে পারে। অনুশীলনের সময় নিজের সময় নিন — এই তালিকার সবচেয়ে সহজ জিনিসগুলোর একটি লক্ষ্য না করেই বেশি বা কম করা।</p>'),

      callout('warning', '<p>এটি শব্দে শব্দে মুখস্থ করবেন না। একটি আবৃত্তির মতো দেওয়া একটি অনুশীলিত উত্তর কাঠখোট্টা আর অস্বাভাবিক শোনায়, আর আপনি বাধাপ্রাপ্ত হলে বা মাঝ-উত্তরে একটি follow-up জিজ্ঞাসা করা হলে এটি শ্রুতিগতভাবে ভেঙে যায়। আকৃতি আর মূল বিষয়গুলো জানুন; সঠিক শব্দচয়ন প্রতিবার স্বাভাবিকভাবে বদলাতে দিন।</p>', 'এটি গঠন করুন, script করবেন না'),

      h(2, 'শেষটি মানানসই করুন', 'tailor-the-ending'),
      p('<p>উত্তরের মাঝখানটি — আপনার পটভূমি আর আপনি কী তৈরি করেছেন — ইন্টারভিউ জুড়ে মোটামুটি একই থাকে। সমাপ্তিটি নির্দিষ্ট ভূমিকার দিকে সামান্য সরানো উচিত: প্রস্তুতি পাঠের গবেষণা ব্যবহার করে কোম্পানি বা পদ সম্পর্কে এমন কিছু উল্লেখ করুন যা আপনি সবে বলেছেন তার সাথে সংযুক্ত।</p>'),
    ],
  },
})

lessons.push({
  slug: 'talking-about-your-projects',
  sortOrder: 19,
  en: {
    title: 'Talking About Your Projects',
    metaTitle: 'Talking About Your Projects in an Interview | Learn Computer Academy',
    metaDescription: 'This is where most of a junior interview actually happens. A structure for explaining a project that survives follow-up questions.',
    blocks: [
      p('<p>For a junior candidate with limited work history, discussing projects is often where most of the actual interview happens. Getting this right matters more than almost anything else covered so far.</p>'),

      h(2, 'A Structure That Holds Up'),
      p('<p><b>What it does</b> (one sentence) → <b>why you built it / what problem it solves</b> → <b>what you specifically built and decided</b> → <b>a real challenge you hit and how you solved it</b> → <b>what you\'d improve now</b>. The middle two are what most candidates skip, and they are what actually distinguishes a real answer from a rehearsed summary.</p>'),

      h(2, 'The Challenge Is the Most Important Part'),
      p('<p>"What was a challenge you ran into" is almost always asked, in some form, and it is the strongest opportunity to show real problem-solving. A specific technical obstacle, described honestly — what went wrong, how you diagnosed it, how you fixed it — is far more convincing than claiming everything went smoothly, and it is more interesting to listen to.</p>'),
      code('text', 'Weak: "It went pretty smoothly, no major issues."\n\nStronger: "The trickiest part was getting the drag-to-reorder feature\nworking with local storage — the order would reset on refresh because\nI was only storing the task data, not the order. I ended up storing\nan explicit position field on each task and sorting by that on load."'),

      h(2, 'Expect Follow-Up Questions'),
      p('<p>An interviewer will often go deeper on one detail rather than moving to the next project: why this approach and not another, what would happen at a larger scale, what would break it. This is not hostility — it is exactly how a real interview checks whether you understood what you built or copied a working pattern without following it, which is the difference the earlier self-assessment lesson raised directly.</p>'),

      callout('tip', '<p>Before any interview, re-read your own code for the projects you plan to discuss. It is a common and avoidable mistake to forget the specifics of your own decisions under pressure, simply because time has passed since you wrote it.</p>'),

      h(2, 'When a Project Was a Group Effort'),
      p('<p>Be precise and honest about your specific contribution rather than describing the whole project as though you built it alone. "I worked on the authentication flow and the dashboard UI; a teammate handled the backend API" is a stronger, more credible answer than a vague "we built this together" that leaves your actual role unclear.</p>'),

      h(2, 'Picking Which Project to Lead With'),
      p('<p>Lead with the project you understand most deeply and can defend under sustained questioning — not necessarily the most visually impressive one. A simple project you can discuss for ten minutes without running out of substance is worth more in an interview than an elaborate one you can only describe at the surface.</p>'),
    ],
  },
  bn: {
    title: 'আপনার প্রোজেক্ট নিয়ে কথা বলা',
    metaTitle: 'একটি ইন্টারভিউতে আপনার প্রোজেক্ট নিয়ে কথা বলা | Learn Computer Academy',
    metaDescription: 'এখানেই একটি junior ইন্টারভিউর বেশিরভাগ আসলে ঘটে। একটি প্রোজেক্ট ব্যাখ্যা করার একটি গঠন যা follow-up প্রশ্ন টিকে থাকে।',
    blocks: [
      p('<p>সীমিত কাজের ইতিহাসযুক্ত একজন junior প্রার্থীর জন্য, প্রোজেক্ট নিয়ে আলোচনা প্রায়ই যেখানে আসল ইন্টারভিউয়ের বেশিরভাগ ঘটে। এটি ঠিক করা এখন পর্যন্ত কভার করা প্রায় অন্য যেকোনো কিছুর চেয়ে বেশি গুরুত্বপূর্ণ।</p>'),

      h(2, 'একটি গঠন যা টিকে থাকে', 'a-structure-that-holds-up'),
      p('<p><b>এটি কী করে</b> (এক বাক্য) → <b>আপনি কেন এটি তৈরি করেছেন / এটি কী সমস্যা সমাধান করে</b> → <b>আপনি নির্দিষ্টভাবে কী তৈরি আর সিদ্ধান্ত নিয়েছেন</b> → <b>আপনার সম্মুখীন হওয়া একটি আসল চ্যালেঞ্জ আর কীভাবে সমাধান করেছেন</b> → <b>এখন আপনি কী উন্নত করতেন</b>। মাঝের দুটি সেগুলো যা বেশিরভাগ প্রার্থী বাদ দেয়, আর সেগুলোই যা আসলে একটি আসল উত্তরকে একটি অনুশীলিত সারসংক্ষেপ থেকে আলাদা করে।</p>'),

      h(2, 'চ্যালেঞ্জটি সবচেয়ে গুরুত্বপূর্ণ অংশ', 'the-challenge-is-the-most-important-part'),
      p('<p>"আপনি কোন চ্যালেঞ্জের মুখোমুখি হয়েছেন" প্রায় সবসময় কোনো না কোনো রূপে জিজ্ঞাসা করা হয়, আর এটি আসল সমস্যা-সমাধান দেখানোর সবচেয়ে শক্তিশালী সুযোগ। সৎভাবে বর্ণনা করা একটি নির্দিষ্ট টেকনিক্যাল বাধা — কী ভুল হয়েছিল, আপনি কীভাবে নির্ণয় করেছেন, কীভাবে ঠিক করেছেন — সবকিছু মসৃণভাবে গেছে দাবি করার চেয়ে অনেক বেশি বিশ্বাসযোগ্য, আর শুনতে বেশি আকর্ষণীয়।</p>'),
      code('text', 'দুর্বল: "It went pretty smoothly, no major issues."\n\nশক্তিশালী: "The trickiest part was getting the drag-to-reorder feature\nworking with local storage — the order would reset on refresh because\nI was only storing the task data, not the order. I ended up storing\nan explicit position field on each task and sorting by that on load."'),

      h(2, 'Follow-Up প্রশ্ন আশা করুন', 'expect-follow-up-questions'),
      p('<p>একজন interviewer প্রায়ই পরের প্রোজেক্টে যাওয়ার বদলে একটি বিবরণে গভীরে যাবেন: কেন এই পদ্ধতি অন্যটি নয়, একটি বড় স্কেলে কী ঘটবে, কী এটি ভাঙবে। এটি শত্রুতা নয় — এটি ঠিক যেভাবে একটি আসল ইন্টারভিউ যাচাই করে আপনি যা তৈরি করেছেন তা বুঝেছেন নাকি অনুসরণ না করেই একটি কার্যকর প্যাটার্ন কপি করেছেন, যা আগের স্ব-মূল্যায়ন পাঠ সরাসরি তুলেছিল।</p>'),

      callout('tip', '<p>যেকোনো ইন্টারভিউর আগে, আপনি আলোচনার পরিকল্পনা করা প্রোজেক্টগুলোর জন্য আপনার নিজের কোড আবার পড়ুন। চাপের মধ্যে আপনার নিজের সিদ্ধান্তের বিবরণ ভুলে যাওয়া একটি সাধারণ আর এড়ানো যায় এমন ভুল, শুধু কারণ এটি লেখার পর থেকে সময় পার হয়েছে।</p>'),

      h(2, 'একটি প্রোজেক্ট একটি দলগত প্রচেষ্টা হলে', 'when-a-project-was-a-group-effort'),
      p('<p>পুরো প্রোজেক্টটি যেন আপনি একা তৈরি করেছেন তা বর্ণনার বদলে আপনার নির্দিষ্ট অবদান সম্পর্কে সঠিক আর সৎ হন। "I worked on the authentication flow and the dashboard UI; a teammate handled the backend API" একটি অস্পষ্ট "we built this together"-এর চেয়ে একটি শক্তিশালী, বেশি বিশ্বাসযোগ্য উত্তর যা আপনার আসল ভূমিকা অস্পষ্ট রাখে।</p>'),

      h(2, 'কোন প্রোজেক্ট দিয়ে নেতৃত্ব দেবেন তা বাছা', 'picking-which-project-to-lead-with'),
      p('<p>আপনি সবচেয়ে গভীরভাবে বোঝেন আর টানা প্রশ্নের অধীনে রক্ষা করতে পারেন এমন প্রোজেক্ট দিয়ে নেতৃত্ব দিন — অগত্যা সবচেয়ে দৃশ্যত চিত্তাকর্ষক একটি নয়। একটি সরল প্রোজেক্ট যা নিয়ে আপনি সারবত্তা ফুরিয়ে না গিয়ে দশ মিনিট আলোচনা করতে পারেন তা একটি ইন্টারভিউতে একটি বিস্তৃত প্রোজেক্টের চেয়ে বেশি মূল্যবান যা আপনি শুধু উপরিভাগে বর্ণনা করতে পারেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'when-you-dont-know',
  sortOrder: 20,
  en: {
    title: 'When You Do Not Know the Answer',
    metaTitle: 'What to Do When You Do Not Know an Interview Answer | Learn Computer Academy',
    metaDescription: 'Interviewers often ask past your level on purpose. How you handle not knowing is a skill in itself, and often matters more than knowing would have.',
    blocks: [
      p('<p>This happens in nearly every technical interview: a question comes up that you genuinely do not know the answer to. Most candidates treat this as the interview going wrong. It usually isn\'t — how you handle it is frequently more informative to the interviewer than the answer itself would have been.</p>'),

      img(
        'docs/img/career/when-you-dont-know-1',
        'A calm, thoughtful young candidate pausing mid-conversation in an interview, visibly composed while thinking rather than flustered',
        1024, 768,
        'A composed pause while reasoning through an unknown question reads as strength, not weakness.'
      ),

      h(2, 'This Is Often Deliberate'),
      p('<p>Experienced interviewers frequently ask questions slightly beyond a candidate\'s expected level on purpose — not to fail you, but specifically to see what happens when you don\'t know something, because that is a direct preview of what happens on the job when you inevitably hit something you weren\'t taught. Nobody who has done this job for any length of time knows everything; the honest handling of not knowing is itself the thing being evaluated.</p>'),

      h(2, 'The Two Reactions That Damage You'),
      p('<p><b>Bluffing</b> — guessing confidently and hoping it sounds plausible — is the worse of the two. Experienced interviewers catch this quickly with one or two follow-up questions, and a candidate caught bluffing is trusted less afterward than one who was honest from the start, on that question and every one after it.</p><p><b>Freezing</b> — going silent, visibly panicking, apologising repeatedly — doesn\'t damage trust the way bluffing does, but it wastes an opportunity to show something useful, and it makes the rest of the interview harder for everyone in the room.</p>'),

      h(2, 'What to Do Instead'),
      p('<p>A working structure: <b>say plainly that you\'re not certain</b> → <b>say what you do know that\'s related</b> → <b>reason toward an answer out loud, even a partial or wrong one</b> → <b>say clearly how you\'d actually find out</b>.</p>'),
      code('text', 'Weak (bluffing): "Oh yeah, that\'s uh... I think it does the thing\nwith the... yeah, that\'s right, it handles that automatically."\n\nWeak (freezing): "I... don\'t know. Sorry." [long silence]\n\nStrong: "I haven\'t used that specifically, but based on how [related\nthing I do know] works, I\'d guess it does X — though I\'m not fully\nsure. If I hit this on the job I\'d check the documentation first,\nand probably test it with a small example to confirm before relying\non it."'),

      h(2, 'Why the Strong Version Works'),
      p('<p>It demonstrates several things at once, none of which required actually knowing the answer: honesty, which builds trust rather than spending it; reasoning from what you do know, which is the actual skill being tested; and a real, credible plan for finding out, which is what you would genuinely do on the job. An interviewer walks away from that exchange with more confidence in you, not less — despite the fact that you didn\'t know the answer.</p>'),

      callout('note', '<p>This is not a trick for making not-knowing look good. It is what competent, experienced developers actually do constantly, in real jobs, multiple times a week. Practising it in an interview is practising the real skill, not performing one.</p>', 'This is the actual skill, not a workaround'),

      h(2, 'Practising This Before It Happens'),
      p('<p>Deliberately pick a few technical questions slightly beyond your current knowledge and practise the honest-reasoning structure out loud, in advance, rather than encountering this pattern for the first time under real pressure. It feels artificial the first few times and becomes natural with repetition, the same way any other rehearsed structure does.</p>'),

      h(2, 'When It Is a Concept, Not a Fact'),
      p('<p>If the gap is a whole concept rather than one fact you\'d normally look up — something you would need real time to learn properly, not a quick search — it is fine to say that plainly too: "I haven\'t learned that yet, but I\'d want to before working with it in production" is an honest, reasonable answer, and a considerably better one than pretending otherwise.</p>'),
    ],
  },
  bn: {
    title: 'আপনি যখন উত্তরটি জানেন না',
    metaTitle: 'একটি ইন্টারভিউ উত্তর না জানলে কী করবেন | Learn Computer Academy',
    metaDescription: 'Interviewer প্রায়ই ইচ্ছাকৃতভাবে আপনার স্তরের বাইরে প্রশ্ন করে। আপনি না জানা কীভাবে সামলান তা নিজেই একটি দক্ষতা, আর প্রায়ই জানার চেয়ে বেশি গুরুত্বপূর্ণ।',
    blocks: [
      p('<p>প্রায় প্রতিটি টেকনিক্যাল ইন্টারভিউতে এটি ঘটে: এমন একটি প্রশ্ন আসে যার উত্তর আপনি সত্যিই জানেন না। বেশিরভাগ প্রার্থী এটিকে ইন্টারভিউ ভুল হয়ে যাওয়া হিসেবে গণ্য করে। এটি সাধারণত তা নয় — আপনি এটি কীভাবে সামলান তা প্রায়ই interviewer-এর কাছে উত্তরটি নিজে যা হতো তার চেয়ে বেশি তথ্যবহুল।</p>'),

      img(
        'docs/img/career/when-you-dont-know-1',
        'একজন শান্ত, চিন্তাশীল তরুণ প্রার্থী একটি ইন্টারভিউয়ের মাঝখানে বিরতি নিচ্ছেন, বিব্রত না হয়ে দৃশ্যত সংযতভাবে ভাবছেন',
        1024, 768,
        'একটি অজানা প্রশ্নের মধ্য দিয়ে যুক্তি করার সময় একটি সংযত বিরতি দুর্বলতা নয়, শক্তি হিসেবে পড়া যায়।'
      ),

      h(2, 'এটি প্রায়ই ইচ্ছাকৃত', 'this-is-often-deliberate'),
      p('<p>অভিজ্ঞ interviewer প্রায়ই ইচ্ছাকৃতভাবে একজন প্রার্থীর প্রত্যাশিত স্তরের সামান্য বাইরে প্রশ্ন করেন — আপনাকে ব্যর্থ করতে নয়, বিশেষভাবে দেখতে আপনি কিছু না জানলে কী ঘটে, কারণ এটি চাকরিতে অনিবার্যভাবে শেখানো হয়নি এমন কিছুর মুখোমুখি হলে যা ঘটে তার একটি সরাসরি পূর্বরূপ। যে কেউ যেকোনো সময়ের জন্য এই চাকরি করেছে সে সবকিছু জানে না; না জানার সৎ সামলানো নিজেই সেই জিনিস যা মূল্যায়ন করা হচ্ছে।</p>'),

      h(2, 'দুটি প্রতিক্রিয়া যা আপনার ক্ষতি করে', 'the-two-reactions-that-damage-you'),
      p('<p><b>Bluffing</b> — আত্মবিশ্বাসের সাথে অনুমান করা আর আশা করা এটি বিশ্বাসযোগ্য শোনাবে — দুটির মধ্যে খারাপটি। অভিজ্ঞ interviewer এক বা দুটি follow-up প্রশ্নে দ্রুত এটি ধরে ফেলেন, আর ধরা পড়া একজন প্রার্থীকে এরপর কম বিশ্বাস করা হয় শুরু থেকে সৎ থাকা একজনের চেয়ে, সেই প্রশ্নে আর এর পরের প্রতিটিতে।</p><p><b>Freezing</b> — চুপ হয়ে যাওয়া, দৃশ্যত আতঙ্কিত হওয়া, বারবার ক্ষমা চাওয়া — bluffing যেভাবে করে সেভাবে বিশ্বাসের ক্ষতি করে না, কিন্তু এটি কাজের কিছু দেখানোর একটি সুযোগ নষ্ট করে, আর এটি ঘরের সবার জন্য ইন্টারভিউয়ের বাকি অংশ কঠিন করে তোলে।</p>'),

      h(2, 'এর বদলে কী করবেন', 'what-to-do-instead'),
      p('<p>একটি কার্যকর গঠন: <b>সরলভাবে বলুন আপনি নিশ্চিত নন</b> → <b>সম্পর্কিত যা আপনি জানেন তা বলুন</b> → <b>জোরে একটি উত্তরের দিকে যুক্তি করুন, এমনকি একটি আংশিক বা ভুল একটিও</b> → <b>স্পষ্টভাবে বলুন আপনি আসলে কীভাবে জানবেন</b>।</p>'),
      code('text', 'দুর্বল (bluffing): "Oh yeah, that\'s uh... I think it does the thing\nwith the... yeah, that\'s right, it handles that automatically."\n\nদুর্বল (freezing): "I... don\'t know. Sorry." [দীর্ঘ নীরবতা]\n\nশক্তিশালী: "I haven\'t used that specifically, but based on how [related\nthing I do know] works, I\'d guess it does X — though I\'m not fully\nsure. If I hit this on the job I\'d check the documentation first,\nand probably test it with a small example to confirm before relying\non it."'),

      h(2, 'শক্তিশালী সংস্করণ কেন কাজ করে', 'why-the-strong-version-works'),
      p('<p>এটি একসাথে কয়েকটি জিনিস প্রদর্শন করে, যার কোনোটির জন্যই আসলে উত্তরটি জানার প্রয়োজন ছিল না: সততা, যা খরচ করার বদলে বিশ্বাস তৈরি করে; আপনি যা জানেন তা থেকে যুক্তি করা, যা আসল দক্ষতা পরীক্ষা করা হচ্ছে; আর জানার একটি আসল, বিশ্বাসযোগ্য পরিকল্পনা, যা আপনি চাকরিতে সত্যিই করতেন। একজন interviewer সেই বিনিময় থেকে কম নয়, বেশি আত্মবিশ্বাস নিয়ে হাঁটেন — আপনি উত্তরটি জানতেন না তা সত্ত্বেও।</p>'),

      callout('note', '<p>এটি না-জানাকে ভালো দেখানোর একটি কৌশল নয়। এটিই যোগ্য, অভিজ্ঞ ডেভেলপাররা আসলে করেন ক্রমাগত, বাস্তব চাকরিতে, সপ্তাহে একাধিকবার। একটি ইন্টারভিউতে এটি অনুশীলন করা আসল দক্ষতা অনুশীলন করা, একটি অভিনয় নয়।</p>', 'এটিই আসল দক্ষতা, একটি সমাধান নয়'),

      h(2, 'এটি ঘটার আগে অনুশীলন করা', 'practising-this-before-it-happens'),
      p('<p>বাস্তব চাপের মধ্যে প্রথমবার এই প্যাটার্নের মুখোমুখি হওয়ার বদলে ইচ্ছাকৃতভাবে আপনার বর্তমান জ্ঞানের সামান্য বাইরে কয়েকটি টেকনিক্যাল প্রশ্ন বেছে নিন আর আগে থেকে জোরে সৎ-যুক্তির গঠনটি অনুশীলন করুন। প্রথম কয়েকবার এটি কৃত্রিম মনে হয় আর পুনরাবৃত্তিতে স্বাভাবিক হয়ে ওঠে, অন্য যেকোনো অনুশীলিত গঠনের মতোই।</p>'),

      h(2, 'এটি একটি তথ্য নয়, একটি ধারণা হলে', 'when-it-is-a-concept-not-a-fact'),
      p('<p>ফাঁকটি যদি আপনি সাধারণত খুঁজে দেখতেন এমন একটি তথ্যের বদলে একটি সম্পূর্ণ ধারণা হয় — এমন কিছু যা ভালোভাবে শিখতে আপনার আসল সময় লাগবে, একটি দ্রুত সার্চ নয় — সেটিও সরলভাবে বলা ঠিক আছে: "I haven\'t learned that yet, but I\'d want to before working with it in production" একটি সৎ, যুক্তিসঙ্গত উত্তর, আর অন্যরকম ভান করার চেয়ে যথেষ্ট ভালো একটি।</p>'),
    ],
  },
})

lessons.push({
  slug: 'live-coding-and-thinking-out-loud',
  sortOrder: 21,
  en: {
    title: 'Live Coding and Thinking Out Loud',
    metaTitle: 'Live Coding Interviews and Thinking Out Loud | Learn Computer Academy',
    metaDescription: 'Live coding is stressful mainly because candidates try to work in silence. Narrating your thinking is a practisable skill that changes the whole experience.',
    blocks: [
      p('<p>Being asked to solve a small problem while someone watches, sometimes typing on a shared screen, is one of the more stressful parts of a junior interview. Most of that stress comes from one specific and fixable habit: trying to work in silence.</p>'),

      h(2, 'Why Silence Makes It Worse'),
      p('<p>An interviewer watching you code in total silence has almost no information about how you\'re thinking — only whether you eventually land on a working answer. That means every pause reads as being stuck, even when you\'re actually reasoning productively. Narrating your thinking gives them something to evaluate other than the final result, which is usually to your advantage, not a distraction from it.</p>'),

      h(2, 'What to Actually Say Out Loud'),
      p('<ul><li><b>Restate the problem</b> in your own words before writing anything — this alone catches a real share of misunderstandings early, before they cost time.</li><li><b>Say your plan before coding it</b>: "I think I\'ll loop through this and check each one against..." — a sentence, not a speech.</li><li><b>Narrate as you go</b>: "I\'m using a map here because I need to look these up quickly later."</li><li><b>Say when you notice a mistake</b>, rather than silently fixing it and hoping nobody saw: "Actually, that won\'t handle an empty list — let me fix that."</li><li><b>Ask when a requirement is genuinely unclear</b>, rather than guessing silently and hoping you guessed correctly.</li></ul>'),

      h(2, 'A Reasonable Approach to the Problem Itself'),
      p('<p>Clarify what\'s actually being asked → think through the approach out loud before typing → start with something simple that works, even if not optimal → improve it if there\'s time, narrating why. A basic, working, clearly explained answer beats a clever, silent one that only half works or that nobody watching could follow.</p>'),

      callout('tip', '<p>It is completely acceptable to say "let me think for a second" and pause deliberately. A short, announced pause reads entirely differently from an unexplained silence — the first is composed, the second reads as stuck.</p>'),

      h(2, 'If You Get Properly Stuck'),
      p('<p>Say so plainly, then apply the honest-reasoning structure from the previous lesson: what you\'ve tried, what you think the actual problem is, and what you\'d try next. An interviewer who sees a candidate work through being stuck systematically often comes away more confident than they would from someone who happened not to hit any difficulty at all.</p>'),

      h(2, 'Practising This'),
      p('<p>Solve small practice problems while talking through your reasoning out loud, alone or with a friend listening — the narration is the actual skill being built here, not the problem-solving itself, which you\'ve mostly already practised elsewhere in your coursework.</p>'),
    ],
  },
  bn: {
    title: 'Live Coding আর জোরে চিন্তা করা',
    metaTitle: 'Live Coding ইন্টারভিউ আর জোরে চিন্তা করা | Learn Computer Academy',
    metaDescription: 'Live coding প্রধানত চাপের কারণ কারণ প্রার্থীরা নীরবে কাজ করার চেষ্টা করে। আপনার চিন্তা বর্ণনা করা একটি অনুশীলনযোগ্য দক্ষতা যা পুরো অভিজ্ঞতা বদলে দেয়।',
    blocks: [
      p('<p>কেউ দেখার সময় একটি ছোট সমস্যা সমাধান করতে বলা, কখনো একটি শেয়ার করা স্ক্রিনে টাইপ করা, একটি junior ইন্টারভিউয়ের বেশি চাপের অংশগুলোর একটি। সেই চাপের বেশিরভাগ আসে একটি নির্দিষ্ট আর ঠিক করার যোগ্য অভ্যাস থেকে: নীরবে কাজ করার চেষ্টা করা।</p>'),

      h(2, 'নীরবতা কেন এটি খারাপ করে', 'why-silence-makes-it-worse'),
      p('<p>সম্পূর্ণ নীরবতায় আপনাকে code করতে দেখা একজন interviewer-এর আপনি কীভাবে ভাবছেন তা নিয়ে প্রায় কোনো তথ্য নেই — শুধু আপনি শেষে একটি কার্যকর উত্তরে পৌঁছান কিনা। এর অর্থ প্রতিটি বিরতি আটকে থাকা হিসেবে পড়া যায়, এমনকি আপনি আসলে ফলপ্রসূভাবে যুক্তি করছেন তখনও। আপনার চিন্তা বর্ণনা করা তাদের চূড়ান্ত ফলাফল ছাড়া মূল্যায়ন করার মতো কিছু দেয়, যা সাধারণত এর বিরুদ্ধে বিভ্রান্তির বদলে আপনার পক্ষে।</p>'),

      h(2, 'জোরে আসলে কী বলবেন', 'what-to-actually-say-out-loud'),
      p('<ul><li>কিছু লেখার আগে <b>নিজের ভাষায় সমস্যাটি পুনরায় বলুন</b> — এটি একাই আসল ভুল বোঝাবুঝির একটি অংশ আগে ধরে ফেলে, সময় খরচ হওয়ার আগে।</li><li><b>কোড করার আগে আপনার পরিকল্পনা বলুন</b>: "I think I\'ll loop through this and check each one against..." — একটি বাক্য, একটি বক্তৃতা নয়।</li><li><b>এগোনোর সাথে বর্ণনা করুন</b>: "I\'m using a map here because I need to look these up quickly later."</li><li>কেউ দেখেছে কিনা আশা করে চুপচাপ ঠিক করার বদলে <b>আপনি একটি ভুল লক্ষ্য করলে বলুন</b>: "Actually, that won\'t handle an empty list — let me fix that."</li><li>সঠিক অনুমান করেছেন আশা করে চুপচাপ অনুমান করার বদলে <b>একটি প্রয়োজনীয়তা সত্যিই অস্পষ্ট হলে জিজ্ঞাসা করুন</b>।</li></ul>'),

      h(2, 'সমস্যাটির প্রতি একটি যুক্তিসঙ্গত পদ্ধতি', 'a-reasonable-approach-to-the-problem-itself'),
      p('<p>আসলে কী জিজ্ঞাসা করা হচ্ছে তা স্পষ্ট করুন → টাইপ করার আগে জোরে পদ্ধতি নিয়ে ভাবুন → সরল কিছু দিয়ে শুরু করুন যা কাজ করে, সর্বোত্তম না হলেও → সময় থাকলে এটি উন্নত করুন, কেন তা বর্ণনা করে। একটি মৌলিক, কার্যকর, স্পষ্টভাবে ব্যাখ্যা করা উত্তর একটি চতুর, নীরব একটিকে হারায় যা শুধু অর্ধেক কাজ করে বা যা দেখা কেউ অনুসরণ করতে পারত না।</p>'),

      callout('tip', '<p>"let me think for a second" বলা আর ইচ্ছাকৃতভাবে বিরতি নেওয়া সম্পূর্ণ গ্রহণযোগ্য। একটি ছোট, ঘোষিত বিরতি একটি অব্যাখ্যাত নীরবতা থেকে সম্পূর্ণ ভিন্নভাবে পড়া যায় — প্রথমটি সংযত, দ্বিতীয়টি আটকে থাকা হিসেবে পড়া যায়।</p>'),

      h(2, 'আপনি সত্যিই আটকে গেলে', 'if-you-get-properly-stuck'),
      p('<p>সরলভাবে বলুন, তারপর আগের পাঠের সৎ-যুক্তির গঠনটি প্রয়োগ করুন: আপনি কী চেষ্টা করেছেন, আপনি মনে করেন আসল সমস্যাটি কী, আর পরে কী চেষ্টা করবেন। একজন interviewer যিনি একজন প্রার্থীকে পদ্ধতিগতভাবে আটকে থাকার মধ্য দিয়ে কাজ করতে দেখেন তিনি প্রায়ই এমন কারো চেয়ে বেশি আত্মবিশ্বাসী হয়ে বেরিয়ে আসেন যার কোনো অসুবিধারই মুখোমুখি হয়নি।</p>'),

      h(2, 'এটি অনুশীলন করা', 'practising-this'),
      p('<p>জোরে আপনার যুক্তি বলতে বলতে ছোট অনুশীলন সমস্যা সমাধান করুন, একা বা একজন বন্ধু শুনছেন এমন অবস্থায় — বর্ণনাটিই এখানে তৈরি হওয়া আসল দক্ষতা, সমস্যা-সমাধান নিজে নয়, যা আপনি আপনার কোর্সওয়ার্কে অন্যত্র বেশিরভাগ ইতিমধ্যে অনুশীলন করেছেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'take-home-assignments',
  sortOrder: 22,
  en: {
    title: 'Take-Home Assignments',
    metaTitle: 'Take-Home Assignments in Interviews | Learn Computer Academy',
    metaDescription: 'Take-home tests are often the most representative stage of the process. How to approach one, and the warning signs of one that is unreasonable.',
    blocks: [
      p('<p>A take-home assignment — building something small over a few days, without anyone watching — is often the stage that most resembles real work, since there is no live pressure and you can work at your own pace. It rewards genuine effort more directly than any other stage.</p>'),

      h(2, 'Why This Stage Matters'),
      p('<p>Without a clock running and nobody watching, a take-home assignment shows something the other stages can\'t: how you actually work when left alone. Code quality, decision-making, whether you handle edge cases without being prompted, whether you write anything explaining your choices — all visible here in a way live coding under pressure doesn\'t allow.</p>'),

      h(2, 'How to Approach One'),
      p('<ul><li><b>Read the requirements twice before writing any code.</b> Misreading a requirement is a completely avoidable way to lose points on something you were otherwise fully capable of doing correctly.</li><li><b>Do not over-engineer it.</b> Solve what was actually asked, cleanly, rather than adding unrequested features to seem impressive — reviewers usually read that as poor judgment about scope, not initiative.</li><li><b>Handle basic edge cases</b> — empty input, unexpected values — even where the instructions don\'t explicitly mention them. It signals real care.</li><li><b>Write a short README</b> explaining how to run it and any decisions worth flagging — the same practice covered in the GitHub lesson, applying here directly.</li><li><b>Test it yourself before submitting</b>, as if you were the one about to review it cold.</li></ul>'),

      callout('warning', '<p>Do not submit something broken because a deadline is close. A smaller, fully working submission beats a larger, ambitious, broken one every time — the same principle as the earlier lesson on scoping a portfolio project to actually finish it.</p>'),

      h(2, 'Time Management'),
      p('<p>Respect the suggested time if one is given. Spending five times the estimate to produce something more polished can actually read poorly — it may suggest a struggle to prioritise or estimate time realistically, both of which matter directly on a real job with real deadlines.</p>'),

      h(2, 'Recognising an Unreasonable One'),
      p('<p>Most take-home tasks are reasonable and roughly match the size stated. Occasionally one is not — asking for what amounts to several days of substantial, production-scale work for an unpaid "assignment" is a real pattern some companies use to extract free labour rather than genuinely evaluate a candidate.</p><p>If a task feels disproportionate to a normal interview stage, it is fair to ask directly how long it\'s expected to take, or to raise the concern with whoever is coordinating the process. A reasonable company will clarify; how they respond to that question is itself informative.</p>'),

      h(2, 'After Submitting'),
      p('<p>Be ready to walk through your decisions in a follow-up conversation — this stage is very often paired with a discussion afterward, which is effectively another round of the project-discussion skills covered earlier in this course, applied to work you did without time pressure.</p>'),
    ],
  },
  bn: {
    title: 'Take-Home কাজ',
    metaTitle: 'ইন্টারভিউতে Take-Home কাজ | Learn Computer Academy',
    metaDescription: 'Take-home টেস্ট প্রায়ই প্রক্রিয়ার সবচেয়ে প্রতিনিধিত্বমূলক পর্যায়। একটি কীভাবে সামলাবেন, আর একটি অযৌক্তিকের সতর্কতা চিহ্ন।',
    blocks: [
      p('<p>একটি take-home কাজ — কেউ না দেখেই কয়েক দিন ধরে ছোট কিছু তৈরি করা — প্রায়ই সেই পর্যায় যা বাস্তব কাজের সবচেয়ে কাছাকাছি, কারণ কোনো live চাপ নেই আর আপনি নিজের গতিতে কাজ করতে পারেন। এটি অন্য যেকোনো পর্যায়ের চেয়ে সরাসরি প্রকৃত পরিশ্রমকে পুরস্কৃত করে।</p>'),

      h(2, 'এই পর্যায়টি কেন গুরুত্বপূর্ণ', 'why-this-stage-matters'),
      p('<p>কোনো ঘড়ি না চললে আর কেউ না দেখলে, একটি take-home কাজ এমন কিছু দেখায় যা অন্য পর্যায়গুলো পারে না: একা থাকলে আপনি আসলে কীভাবে কাজ করেন। কোডের গুণমান, সিদ্ধান্ত গ্রহণ, প্রম্পট ছাড়াই আপনি edge case সামলান কিনা, আপনার পছন্দ ব্যাখ্যা করে কিছু লেখেন কিনা — সবই এখানে এমনভাবে দৃশ্যমান যা চাপের মধ্যে live coding দেয় না।</p>'),

      h(2, 'একটি কীভাবে সামলাবেন', 'how-to-approach-one'),
      p('<ul><li><b>কোনো কোড লেখার আগে দুবার প্রয়োজনীয়তা পড়ুন।</b> একটি প্রয়োজনীয়তা ভুল পড়া এমন কিছুতে পয়েন্ট হারানোর একটি সম্পূর্ণ এড়ানো যায় এমন উপায় যা অন্যথায় আপনি সঠিকভাবে করতে সম্পূর্ণ সক্ষম ছিলেন।</li><li><b>এটি অতিরিক্ত-প্রকৌশলিত করবেন না।</b> চিত্তাকর্ষক দেখাতে অনুরোধ না করা ফিচার যোগ করার বদলে যা আসলে জিজ্ঞাসা করা হয়েছে তা পরিষ্কারভাবে সমাধান করুন — পর্যালোচক সাধারণত এটিকে উদ্যোগ নয়, scope নিয়ে খারাপ বিচারশক্তি হিসেবে পড়েন।</li><li><b>মৌলিক edge case সামলান</b> — খালি input, অপ্রত্যাশিত মান — নির্দেশনা স্পষ্টভাবে সেগুলো উল্লেখ না করলেও। এটি আসল যত্নের সংকেত দেয়।</li><li>এটি কীভাবে চালাবেন আর পতাকাঙ্কিত করার যোগ্য যেকোনো সিদ্ধান্ত ব্যাখ্যা করে <b>একটি ছোট README লিখুন</b> — GitHub পাঠের একই অনুশীলন, এখানে সরাসরি প্রযোজ্য।</li><li>জমা দেওয়ার আগে <b>নিজে এটি পরীক্ষা করুন</b>, যেন আপনিই এটি ঠান্ডা মাথায় পর্যালোচনা করতে যাচ্ছেন।</li></ul>'),

      callout('warning', '<p>একটি deadline কাছে বলে ভাঙা কিছু জমা দেবেন না। একটি ছোট, সম্পূর্ণ কার্যকর জমা প্রতিবার একটি বড়, উচ্চাভিলাষী, ভাঙা একটিকে হারায় — একটি portfolio প্রোজেক্টকে আসলে শেষ করার জন্য scope করার আগের পাঠের একই নীতি।</p>'),

      h(2, 'সময় ব্যবস্থাপনা', 'time-management'),
      p('<p>একটি প্রস্তাবিত সময় দেওয়া হলে তা সম্মান করুন। বেশি পরিমার্জিত কিছু তৈরি করতে আনুমানিকের পাঁচগুণ সময় খরচ করলে আসলে খারাপ পড়া যেতে পারে — এটি অগ্রাধিকার দেওয়া বা বাস্তবসম্মতভাবে সময় আন্দাজ করায় সংগ্রামের ইঙ্গিত দিতে পারে, দুটোই আসল deadline-যুক্ত একটি বাস্তব চাকরিতে সরাসরি গুরুত্বপূর্ণ।</p>'),

      h(2, 'একটি অযৌক্তিক চিনতে পারা', 'recognising-an-unreasonable-one'),
      p('<p>বেশিরভাগ take-home কাজ যুক্তিসঙ্গত আর বলা আকারের সাথে মোটামুটি মেলে। মাঝে মাঝে একটি নয় — একটি বেতনহীন "assignment"-এর জন্য যা কয়েক দিনের সারবত্তাপূর্ণ, প্রোডাকশন-স্কেল কাজের সমান তা চাওয়া কিছু কোম্পানি ব্যবহার করে এমন একটি আসল প্যাটার্ন যা সত্যিই একজন প্রার্থী মূল্যায়নের বদলে বিনামূল্যের শ্রম আদায় করে।</p><p>একটি কাজ একটি স্বাভাবিক ইন্টারভিউ পর্যায়ের সাথে অসামঞ্জস্যপূর্ণ মনে হলে, সরাসরি জিজ্ঞাসা করা ন্যায্য এটি কত সময় নেওয়ার প্রত্যাশা করা হয়, বা প্রক্রিয়া সমন্বয়কারী যে কারো সাথে উদ্বেগটি তোলা। একটি যুক্তিসঙ্গত কোম্পানি স্পষ্ট করবে; তারা সেই প্রশ্নের কীভাবে জবাব দেয় তা নিজেই তথ্যবহুল।</p>'),

      h(2, 'জমা দেওয়ার পর', 'after-submitting'),
      p('<p>একটি follow-up কথোপকথনে আপনার সিদ্ধান্তের মধ্য দিয়ে যেতে প্রস্তুত থাকুন — এই পর্যায়টি প্রায়ই পরে একটি আলোচনার সাথে জোড়া লাগানো হয়, যা কার্যকরভাবে এই কোর্সে আগে কভার করা প্রোজেক্ট-আলোচনা দক্ষতার আরেকটি রাউন্ড, সময়ের চাপ ছাড়া আপনার করা কাজে প্রয়োগ করা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'questions-to-ask-and-salary',
  sortOrder: 23,
  en: {
    title: 'Questions to Ask, and Talking About Salary',
    metaTitle: 'Questions to Ask in an Interview and Discussing Salary | Learn Computer Academy',
    metaDescription: 'What to ask when given the chance, and how to handle a salary conversation as a junior candidate without over- or under-selling yourself.',
    blocks: [
      p('<p>Almost every interview ends with "do you have any questions for us?" Saying no is a genuinely missed opportunity — this moment is one of the only places in the whole process where you\'re evaluating them too, and asking nothing reads as a lack of real interest.</p>'),

      h(2, 'Good Questions to Ask'),
      p('<ul><li>"What does a typical first few months look like for someone in this role?"</li><li>"How does the team review code, and how often?"</li><li>"What would success look like in this role after six months?"</li><li>"What\'s the biggest challenge the team is working through right now?"</li><li>Something specific from your research — genuinely referencing what the company builds, which shows the preparation covered earlier actually happened.</li></ul><p>These signal that you\'re thinking seriously about the actual job, not just trying to get any offer at all.</p>'),

      h(2, 'What Not to Lead With'),
      p('<p>Questions purely about vacation days, remote-work policy, or perks are not wrong to eventually ask, but leading with them in a first conversation reads as prioritising the job\'s conditions well before you\'ve even earned the offer. Save those for once an offer is genuinely on the table.</p>'),

      h(2, 'The Salary Question'),
      p('<p>"What are your salary expectations?" makes most junior candidates uncomfortable, mainly because they don\'t know what a reasonable number even looks like yet.</p><ul><li><b>Research a realistic range first</b> — talk to instructors, alumni, or check what similar junior roles in your city and specialisation are actually paying, rather than guessing blind.</li><li><b>It is fine to give a range</b> rather than a single fixed number.</li><li><b>It is fine to ask what the budgeted range for the role is</b>, especially if asked before you\'ve had the chance to research anything.</li><li><b>Do not undersell yourself out of pure anxiety</b> — a number far below the going market rate is often read as a lack of confidence rather than as a bargain, and it can be genuinely hard to correct once accepted.</li></ul>'),

      callout('note', '<p>As a junior with limited experience, expecting a senior-level salary is unrealistic, and that\'s fine — the honest goal at this stage is usually a fair starting number, real experience, and room to grow, not maximising the first number on the offer.</p>'),

      h(2, 'A Reasonable Answer'),
      code('text', '"Based on what I\'ve seen for junior roles with similar\nresponsibilities in this area, I was thinking somewhere in the\nrange of [X to Y]. I\'m open to discussing it based on the full\npackage and the role itself."'),
      p('<p>This shows you did the research, gives room to negotiate, and doesn\'t lock you into a single number before you\'ve heard their offer.</p>'),

      h(2, 'It Is a Two-Way Conversation'),
      p('<p>An interview is not only them deciding about you — you are also deciding whether this is a place worth working, which is exactly what good questions and an honest salary conversation are for. Treating the whole process as one-directional, with you doing all the auditioning, misses half of what the conversation is actually there to establish.</p>'),
    ],
  },
  bn: {
    title: 'জিজ্ঞাসা করার প্রশ্ন, আর বেতন নিয়ে কথা বলা',
    metaTitle: 'একটি ইন্টারভিউতে জিজ্ঞাসা করার প্রশ্ন আর বেতন আলোচনা | Learn Computer Academy',
    metaDescription: 'সুযোগ পেলে কী জিজ্ঞাসা করবেন, আর নিজেকে বেশি বা কম বিক্রি না করে একজন junior প্রার্থী হিসেবে একটি বেতনের কথোপকথন কীভাবে সামলাবেন।',
    blocks: [
      p('<p>প্রায় প্রতিটি ইন্টারভিউ "do you have any questions for us?" দিয়ে শেষ হয়। না বলা সত্যিই একটি হারানো সুযোগ — এই মুহূর্তটি পুরো প্রক্রিয়ার সেই অল্প কয়েকটি জায়গার একটি যেখানে আপনিও তাদের মূল্যায়ন করছেন, আর কিছুই না জিজ্ঞাসা করা আসল আগ্রহের অভাব হিসেবে পড়া যায়।</p>'),

      h(2, 'জিজ্ঞাসা করার ভালো প্রশ্ন', 'good-questions-to-ask'),
      p('<ul><li>"What does a typical first few months look like for someone in this role?"</li><li>"How does the team review code, and how often?"</li><li>"What would success look like in this role after six months?"</li><li>"What\'s the biggest challenge the team is working through right now?"</li><li>আপনার গবেষণা থেকে নির্দিষ্ট কিছু — কোম্পানি আসলে কী তৈরি করে তা সত্যিই উল্লেখ করে, যা দেখায় আগে কভার করা প্রস্তুতি আসলে ঘটেছিল।</li></ul><p>এগুলো সংকেত দেয় আপনি আসল চাকরিটি নিয়ে গুরুত্বসহকারে ভাবছেন, শুধু যেকোনো একটি অফার পাওয়ার চেষ্টা করছেন না।</p>'),

      h(2, 'যা দিয়ে শুরু করবেন না', 'what-not-to-lead-with'),
      p('<p>শুধু ছুটির দিন, রিমোট-কাজের নীতি, বা সুবিধা নিয়ে প্রশ্ন শেষে জিজ্ঞাসা করা ভুল নয়, কিন্তু প্রথম কথোপকথনে সেগুলো দিয়ে শুরু করা আপনি অফারটি অর্জন করার আগেই চাকরির শর্তকে অগ্রাধিকার দেওয়া হিসেবে পড়া যায়। একটি অফার সত্যিই টেবিলে থাকলে সেগুলো তখনকার জন্য রাখুন।</p>'),

      h(2, 'বেতনের প্রশ্ন', 'the-salary-question'),
      p('<p>"What are your salary expectations?" বেশিরভাগ junior প্রার্থীকে অস্বস্তিতে ফেলে, প্রধানত কারণ তারা এখনো জানে না একটি যুক্তিসঙ্গত সংখ্যা দেখতে কেমন।</p><ul><li><b>প্রথমে একটি বাস্তবসম্মত পরিসর গবেষণা করুন</b> — অন্ধভাবে অনুমান করার বদলে প্রশিক্ষক, প্রাক্তন শিক্ষার্থীদের সাথে কথা বলুন, বা আপনার শহর আর বিশেষায়নে একই ধরনের junior ভূমিকা আসলে কত দিচ্ছে তা যাচাই করুন।</li><li><b>একটি একক নির্দিষ্ট সংখ্যার বদলে একটি পরিসর দেওয়া ঠিক আছে।</b></li><li><b>ভূমিকার জন্য বাজেট করা পরিসর কী তা জিজ্ঞাসা করা ঠিক আছে</b>, বিশেষত আপনি কিছু গবেষণা করার সুযোগ পাওয়ার আগে জিজ্ঞাসা করা হলে।</li><li><b>শুধু উদ্বেগের কারণে নিজেকে কম বিক্রি করবেন না</b> — চলতি বাজার দরের অনেক নিচের একটি সংখ্যা প্রায়ই একটি দরকষাকষির বদলে আত্মবিশ্বাসের অভাব হিসেবে পড়া হয়, আর একবার গ্রহণ করার পর এটি সত্যিই ঠিক করা কঠিন হতে পারে।</li></ul>'),

      callout('note', '<p>সীমিত অভিজ্ঞতাযুক্ত একজন junior হিসেবে, একটি senior-স্তরের বেতন আশা করা অবাস্তব, আর এটি ঠিক আছে — এই পর্যায়ে সৎ লক্ষ্য সাধারণত একটি ন্যায্য শুরুর সংখ্যা, আসল অভিজ্ঞতা, আর বাড়ার জায়গা, অফারের প্রথম সংখ্যা সর্বোচ্চ করা নয়।</p>'),

      h(2, 'একটি যুক্তিসঙ্গত উত্তর', 'a-reasonable-answer'),
      code('text', '"Based on what I\'ve seen for junior roles with similar\nresponsibilities in this area, I was thinking somewhere in the\nrange of [X to Y]. I\'m open to discussing it based on the full\npackage and the role itself."'),
      p('<p>এটি দেখায় আপনি গবেষণা করেছেন, দরকষাকষির জায়গা দেয়, আর তাদের অফার শোনার আগে আপনাকে একটি একক সংখ্যায় আটকে রাখে না।</p>'),

      h(2, 'এটি একটি দ্বি-মুখী কথোপকথন', 'it-is-a-two-way-conversation'),
      p('<p>একটি ইন্টারভিউ শুধু তারা আপনার সম্পর্কে সিদ্ধান্ত নিচ্ছে তা নয় — আপনিও সিদ্ধান্ত নিচ্ছেন এটি কাজ করার যোগ্য একটি জায়গা কিনা, যা ঠিক ভালো প্রশ্ন আর একটি সৎ বেতন কথোপকথনের জন্য। পুরো প্রক্রিয়াটিকে একমুখী হিসেবে গণ্য করা, আপনি সব অডিশন দিচ্ছেন এমন, কথোপকথনটি আসলে প্রতিষ্ঠার জন্য যা সেখানে আছে তার অর্ধেক মিস করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'rejection-is-the-normal-case',
  sortOrder: 24,
  en: {
    title: 'Rejection Is the Normal Case',
    metaTitle: 'Rejection Is the Normal Case in a Job Search | Learn Computer Academy',
    metaDescription: 'Almost everyone gets rejected far more than they get accepted. Treating rejection as the default outcome, not the exception, changes how it feels.',
    blocks: [
      p('<p>Nobody warns students clearly enough beforehand: in almost every job search, rejection is the <b>default</b> outcome, not a sign that something has gone wrong. Getting hired is the exception that eventually shows up after enough attempts, not the expected result of any single one.</p>'),

      h(2, 'What This Actually Looks Like'),
      p('<p>A real, ordinary job search for a first role commonly involves dozens of applications, most of which never get a reply at all, several interviews that go nowhere, and eventually one or two that work out. That is not a sign of a struggling candidate — it is closer to how the process ordinarily runs for most people, including strong candidates. The people who eventually get hired are not the ones who skipped the rejection; they are the ones who kept going through it.</p>'),

      callout('note', '<p>Nobody posts about their thirty rejections. Everybody posts about the one offer. This creates a badly skewed public impression of how the process actually looks from the inside — most of the visible evidence is survivorship, not a representative sample.</p>', 'What you see online is not the full picture'),

      img(
        'docs/img/career/rejection-normal-1',
        'A young person sitting quietly at a desk with a laptop showing an email inbox, several messages visible, a determined rather than defeated expression',
        1024, 768,
        'Most real job searches involve far more rejection than acceptance — that is the ordinary shape of the process, not a sign of failure.'
      ),

      h(2, 'Why This Reframe Matters'),
      p('<p>Treating each individual rejection as a personal verdict makes every single one feel catastrophic, which makes persistence exhausting and makes people quit early — often right before something was about to work out. Treating rejection as the statistically expected outcome of applying makes each one just a data point, one of many, on the way to the ones that don\'t reject you.</p>'),

      h(2, 'A Silent No Is Not a Worse Rejection'),
      p('<p>Many applications never get any reply at all. That silence is not a more severe verdict than an explicit rejection — it usually just reflects how hiring works at scale: a high volume of applicants, limited time, and no obligation or established norm to respond to everyone. It says very little about you specifically.</p>'),

      h(2, 'The Honest Reframe, Not a False One'),
      p('<p>This isn\'t "don\'t worry, it\'ll definitely work out" — that promise cannot honestly be made to anyone, and this course won\'t make it. It is: <b>almost everyone doing this successfully went through a large number of rejections first, and that fact alone says nothing definitive about your particular outcome.</b> The rest of this section is about what to actually do with a rejection once it happens, rather than just how to feel about it.</p>'),
    ],
  },
  bn: {
    title: 'প্রত্যাখ্যান স্বাভাবিক ঘটনা',
    metaTitle: 'একটি চাকরি খোঁজায় প্রত্যাখ্যান স্বাভাবিক ঘটনা | Learn Computer Academy',
    metaDescription: 'প্রায় সবাই গ্রহণের চেয়ে অনেক বেশি প্রত্যাখ্যান পায়। প্রত্যাখ্যানকে ব্যতিক্রমের বদলে ডিফল্ট ফলাফল হিসেবে গণ্য করা এটি কেমন লাগে তা বদলে দেয়।',
    blocks: [
      p('<p>কেউ শিক্ষার্থীদের আগে থেকে যথেষ্ট স্পষ্টভাবে সতর্ক করে না: প্রায় প্রতিটি চাকরি খোঁজায়, প্রত্যাখ্যান <b>ডিফল্ট</b> ফলাফল, কিছু ভুল হয়ে যাওয়ার চিহ্ন নয়। নিয়োগ পাওয়া সেই ব্যতিক্রম যা শেষে যথেষ্ট চেষ্টার পর দেখা দেয়, কোনো একক প্রচেষ্টার প্রত্যাশিত ফলাফল নয়।</p>'),

      h(2, 'এটি আসলে দেখতে কেমন', 'what-this-actually-looks-like'),
      p('<p>একটি প্রথম ভূমিকার জন্য একটি বাস্তব, সাধারণ চাকরি খোঁজায় সাধারণত ডজনখানেক আবেদন জড়িত থাকে, যার বেশিরভাগ কখনো একেবারেই কোনো জবাব পায় না, কয়েকটি ইন্টারভিউ যা কোথাও যায় না, আর শেষে একটি বা দুটি যা কাজ করে। এটি একজন সংগ্রামরত প্রার্থীর চিহ্ন নয় — এটি বেশিরভাগ মানুষের জন্য, শক্তিশালী প্রার্থীসহ, প্রক্রিয়াটি সাধারণত যেভাবে চলে তার কাছাকাছি। যারা শেষে নিয়োগ পায় তারা প্রত্যাখ্যান এড়িয়ে গেছে এমন নয়; তারা এর মধ্য দিয়ে চালিয়ে গেছে এমন।</p>'),

      callout('note', '<p>কেউ তাদের ত্রিশটি প্রত্যাখ্যান নিয়ে পোস্ট করে না। সবাই একটি অফার নিয়ে পোস্ট করে। এটি প্রক্রিয়াটি ভেতর থেকে আসলে কেমন দেখায় তার একটি খারাপভাবে বিকৃত প্রকাশ্য ধারণা তৈরি করে — বেশিরভাগ দৃশ্যমান প্রমাণ survivorship, একটি প্রতিনিধিত্বমূলক নমুনা নয়।</p>', 'আপনি অনলাইনে যা দেখেন তা সম্পূর্ণ চিত্র নয়'),

      img(
        'docs/img/career/rejection-normal-1',
        'একজন তরুণ ব্যক্তি একটি ডেস্কে একটি ল্যাপটপসহ শান্তভাবে বসে আছেন যেখানে একটি ইমেইল ইনবক্স দেখা যাচ্ছে, কয়েকটি বার্তা দৃশ্যমান, পরাজিত নয় বরং দৃঢ়সংকল্প একটি অভিব্যক্তি',
        1024, 768,
        'বেশিরভাগ বাস্তব চাকরি খোঁজায় গ্রহণের চেয়ে অনেক বেশি প্রত্যাখ্যান জড়িত থাকে — এটি প্রক্রিয়ার স্বাভাবিক আকৃতি, ব্যর্থতার চিহ্ন নয়।'
      ),

      h(2, 'এই পুনর্বিবেচনা কেন গুরুত্বপূর্ণ', 'why-this-reframe-matters'),
      p('<p>প্রতিটি একক প্রত্যাখ্যানকে একটি ব্যক্তিগত রায় হিসেবে গণ্য করা প্রতিটিকে বিপর্যয়কর মনে করায়, যা অধ্যবসায়কে ক্লান্তিকর করে আর মানুষকে তাড়াতাড়ি ছেড়ে দিতে বাধ্য করে — প্রায়ই কিছু কাজ করতে যাওয়ার ঠিক আগে। প্রত্যাখ্যানকে আবেদনের পরিসংখ্যানগতভাবে প্রত্যাশিত ফলাফল হিসেবে গণ্য করা প্রতিটিকে শুধু একটি ডেটা পয়েন্ট করে, অনেকগুলোর একটি, আপনাকে প্রত্যাখ্যান করে না এমনগুলোর পথে।</p>'),

      h(2, 'একটি নীরব না একটি খারাপ প্রত্যাখ্যান নয়', 'a-silent-no-is-not-a-worse-rejection'),
      p('<p>অনেক আবেদন কখনো একেবারেই কোনো জবাব পায় না। সেই নীরবতা একটি স্পষ্ট প্রত্যাখ্যানের চেয়ে বেশি গুরুতর রায় নয় — এটি সাধারণত শুধু প্রতিফলিত করে নিয়োগ বড় মাপে কীভাবে কাজ করে: প্রার্থীর একটি উঁচু পরিমাণ, সীমিত সময়, আর সবাইকে জবাব দেওয়ার কোনো বাধ্যবাধকতা বা প্রতিষ্ঠিত নিয়ম নেই। এটি আপনার সম্পর্কে নির্দিষ্টভাবে খুব কমই বলে।</p>'),

      h(2, 'সৎ পুনর্বিবেচনা, একটি মিথ্যা নয়', 'the-honest-reframe-not-a-false-one'),
      p('<p>এটি "চিন্তা করবেন না, এটি অবশ্যই কাজ হয়ে যাবে" নয় — সেই প্রতিশ্রুতি সৎভাবে কাউকে দেওয়া যায় না, আর এই কোর্স সেটি দেবে না। এটি: <b>এটি সফলভাবে করছে প্রায় সবাই প্রথমে বিপুল সংখ্যক প্রত্যাখ্যানের মধ্য দিয়ে গেছে, আর সেই তথ্যটি একাই আপনার নির্দিষ্ট ফলাফল সম্পর্কে চূড়ান্তভাবে কিছু বলে না।</b> এই অংশের বাকিটা এটি নিয়ে কেমন লাগবে তা নয়, একটি প্রত্যাখ্যান ঘটলে আসলে এটি নিয়ে কী করবেন তা নিয়ে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'what-a-rejection-does-and-does-not-mean',
  sortOrder: 25,
  en: {
    title: 'What a Rejection Does and Does Not Mean',
    metaTitle: 'What a Rejection Does and Does Not Mean | Learn Computer Academy',
    metaDescription: 'A rejection is specific and limited information, not a verdict on your worth. What it can genuinely tell you, and what it definitely cannot.',
    blocks: [
      p('<p>A rejection is a small, specific, limited piece of information — one company, one role, one moment in time, decided you weren\'t the right fit for that particular opening. It is not a broad verdict on your ability, your worth, or your future, however much it can feel like one in the moment.</p>'),

      h(2, 'What It Genuinely Can Mean'),
      p('<ul><li>Someone else\'s specific background matched this specific role slightly better.</li><li>The company\'s exact needs shifted, or were oddly specific in a way your background didn\'t happen to match.</li><li>Budget, timing, or internal politics you have no visibility into and no control over.</li><li>A real, fixable gap in your preparation or your skills for this particular role.</li><li>Simply bad luck — an off day for you, an off day for the interviewer, a mismatch of chemistry that isn\'t really measuring competence at all.</li></ul>'),

      h(2, 'What It Almost Never Means'),
      p('<p>It does not mean you are not cut out for this field. It does not mean the course, or the months you spent on it, were wasted. It does not mean every future application will go the same way. A single data point, or even several in a row, cannot support a conclusion that broad — and treating it as though it can is a much bigger error than the rejection itself.</p>'),

      callout('warning', '<p>Watch specifically for one thought pattern: "I got rejected" quietly turning into "I am not good enough" in your head. The first is a fact about one outcome. The second is an unsupported and much larger conclusion your mind adds on top of it — and it is worth noticing the difference each time, deliberately.</p>', 'A fact versus a story about the fact'),

      h(2, 'When It Actually Is a Signal Worth Acting On'),
      p('<p>A single rejection rarely tells you much on its own. A genuine, repeated pattern across several rejections — always stalling at the same stage, always the same kind of question catching you out — is real, useful information, and it is exactly what the diagnostic lesson later in this section is for. One instance is close to noise; a repeated pattern is a signal worth actually investigating.</p>'),

      h(2, 'The Comparison That Actually Helps'),
      p('<p>Comparing this month\'s rejections to last month\'s — are your interviews getting further along, are you getting more replies, do the technical rounds feel any less shaky than they did before — is a genuinely useful measure of progress. Comparing yourself to other people\'s visible outcomes, which by definition never shows their rejections, is not.</p>'),
    ],
  },
  bn: {
    title: 'একটি প্রত্যাখ্যান কী বোঝায় আর কী বোঝায় না',
    metaTitle: 'একটি প্রত্যাখ্যান কী বোঝায় আর কী বোঝায় না | Learn Computer Academy',
    metaDescription: 'একটি প্রত্যাখ্যান নির্দিষ্ট আর সীমিত তথ্য, আপনার মূল্যের উপর একটি রায় নয়। এটি সত্যিই আপনাকে কী বলতে পারে, আর কী কখনো পারে না।',
    blocks: [
      p('<p>একটি প্রত্যাখ্যান একটি ছোট, নির্দিষ্ট, সীমিত তথ্যের টুকরো — একটি কোম্পানি, একটি ভূমিকা, সময়ের একটি মুহূর্ত, সিদ্ধান্ত নিয়েছে আপনি সেই নির্দিষ্ট খোলার জন্য সঠিক মিল ছিলেন না। এটি আপনার সক্ষমতা, আপনার মূল্য, বা আপনার ভবিষ্যতের উপর একটি ব্যাপক রায় নয়, সেই মুহূর্তে এটি যতই একটি মনে হোক।</p>'),

      h(2, 'এটি সত্যিই কী বোঝাতে পারে', 'what-it-genuinely-can-mean'),
      p('<ul><li>অন্য কারো নির্দিষ্ট পটভূমি এই নির্দিষ্ট ভূমিকার সাথে সামান্য ভালো মিলেছে।</li><li>কোম্পানির সঠিক প্রয়োজন বদলেছে, বা এমনভাবে অদ্ভুতভাবে নির্দিষ্ট ছিল যা আপনার পটভূমির সাথে মেলেনি।</li><li>বাজেট, সময়, বা অভ্যন্তরীণ রাজনীতি যাতে আপনার কোনো দৃশ্যমানতা বা নিয়ন্ত্রণ নেই।</li><li>এই নির্দিষ্ট ভূমিকার জন্য আপনার প্রস্তুতি বা দক্ষতায় একটি আসল, ঠিক করার যোগ্য ফাঁক।</li><li>শুধু খারাপ ভাগ্য — আপনার জন্য একটি খারাপ দিন, interviewer-এর জন্য একটি খারাপ দিন, রসায়নের একটি অমিল যা আসলে যোগ্যতা মাপছেই না।</li></ul>'),

      h(2, 'এটি প্রায় কখনো কী বোঝায় না', 'what-it-almost-never-means'),
      p('<p>এর অর্থ এই নয় যে আপনি এই ক্ষেত্রের জন্য তৈরি নন। এর অর্থ এই নয় যে কোর্সটি, বা এতে আপনি ব্যয় করা মাসগুলো, নষ্ট হয়েছে। এর অর্থ এই নয় যে প্রতিটি ভবিষ্যৎ আবেদন একই পথে যাবে। একটি একক ডেটা পয়েন্ট, বা এমনকি টানা কয়েকটি, এত ব্যাপক একটি সিদ্ধান্ত সমর্থন করতে পারে না — আর এটি করতে পারে ভাবা প্রত্যাখ্যানটি নিজের চেয়ে অনেক বড় একটি ভুল।</p>'),

      callout('warning', '<p>বিশেষভাবে একটি চিন্তার ধরনের জন্য নজর রাখুন: "I got rejected" চুপচাপ আপনার মাথায় "I am not good enough"-এ পরিণত হওয়া। প্রথমটি একটি ফলাফল সম্পর্কে একটি তথ্য। দ্বিতীয়টি আপনার মন এর উপর যোগ করা একটি অসমর্থিত আর অনেক বড় সিদ্ধান্ত — আর প্রতিবার ইচ্ছাকৃতভাবে পার্থক্যটি লক্ষ্য করা সার্থক।</p>', 'একটি তথ্য বনাম তথ্য নিয়ে একটি গল্প'),

      h(2, 'এটি আসলে যখন কাজ করার যোগ্য একটি সংকেত', 'when-it-actually-is-a-signal-worth-acting-on'),
      p('<p>একটি একক প্রত্যাখ্যান খুব কমই নিজে থেকে অনেক কিছু বলে। কয়েকটি প্রত্যাখ্যান জুড়ে একটি প্রকৃত, পুনরাবৃত্ত প্যাটার্ন — সবসময় একই পর্যায়ে থমকে যাওয়া, সবসময় একই ধরনের প্রশ্ন আপনাকে ধরছে — আসল, কাজের তথ্য, আর এই অংশের পরের নির্ণয়মূলক পাঠটি ঠিক এর জন্য। একটি ঘটনা শব্দের কাছাকাছি; একটি পুনরাবৃত্ত প্যাটার্ন সত্যিই তদন্তের যোগ্য একটি সংকেত।</p>'),

      h(2, 'তুলনা যা আসলে সাহায্য করে', 'the-comparison-that-actually-helps'),
      p('<p>এই মাসের প্রত্যাখ্যানকে গত মাসেরটির সাথে তুলনা করা — আপনার ইন্টারভিউ কি আরও এগিয়ে যাচ্ছে, আপনি কি বেশি জবাব পাচ্ছেন, টেকনিক্যাল রাউন্ড কি আগের চেয়ে কম টলমলে মনে হয় — অগ্রগতির সত্যিই একটি কাজের মাপ। নিজেকে অন্য মানুষের দৃশ্যমান ফলাফলের সাথে তুলনা করা, যা সংজ্ঞা অনুযায়ী তাদের প্রত্যাখ্যান কখনো দেখায় না, তা নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'getting-and-using-feedback',
  sortOrder: 26,
  en: {
    title: 'Getting and Using Feedback',
    metaTitle: 'Getting and Using Interview Feedback | Learn Computer Academy',
    metaDescription: 'Most companies give no feedback after a rejection. How to ask for it anyway, and what to actually do with feedback once you receive some.',
    blocks: [
      p('<p>Feedback after a rejection is the single most useful thing available for improving, and most companies don\'t offer it without being asked, often for liability reasons more than indifference. It is worth asking for anyway — the worst realistic outcome is silence, which is exactly what you already have without asking.</p>'),

      h(2, 'How to Ask'),
      p('<p>A short, genuinely gracious message works best:</p>'),
      code('text', '"Thank you for letting me know, and for the opportunity to\ninterview. If you have a moment, I\'d really appreciate any feedback\non where I could improve for next time."'),
      p('<p>No pressure, no argument, no pushing back on the decision itself — just a genuine, low-effort request. Some companies will decline to answer, often for legal or policy reasons that have nothing to do with you personally. Many will give at least something if asked directly and politely, since it costs them very little.</p>'),

      img(
        'docs/img/career/feedback-1',
        'A mentor and a young developer having a calm, focused conversation over a laptop, the mentor pointing at the screen while the developer listens attentively',
        1024, 768,
        'Feedback is the most useful thing available after a rejection — and it usually has to be asked for.'
      ),

      h(2, 'Reading Feedback Without Getting Defensive'),
      p('<p>The instinct when receiving critical feedback is to explain, justify, or argue against it. Resist that instinct entirely, at least until well after the conversation is over. The point of asking was to learn something useful, and arguing with the answer — even silently, even just in your own head in the moment — defeats the entire purpose of having asked.</p>'),

      callout('note', '<p>Feedback is often vague — "not quite the right fit" is common and genuinely unhelpful on its own. If you can ask one clarifying follow-up without being pushy, do: "Was that more about technical skills, or more about the overall fit?" narrows a vague answer into something you can actually act on.</p>'),

      h(2, 'What to Do With It'),
      p('<p>Write it down as soon as you get it, dated, alongside which company and stage it came from. After a handful of rejections, read them together rather than one at a time — a pattern across several ("technical fundamentals need work," showing up three separate times) is far more reliable and actionable than any single piece of feedback taken alone.</p>'),

      h(2, 'When You Get Nothing'),
      p('<p>No feedback at all is common, not personal, and does not mean the interview went unusually badly — it usually just means the company has no formal process for giving it, or a policy against doing so. In that case, self-assessment fills the gap: immediately after the interview, while it\'s still fresh, write down what felt shaky, what you couldn\'t answer confidently, and what you\'d prepare differently next time.</p>'),

      h(2, 'Feedback From Practice, Not Just Real Interviews'),
      p('<p>You don\'t have to wait for a real rejection to get feedback. A mock interview with a teacher, a further-along peer, or anyone technical willing to ask real questions and give honest reactions produces the same kind of useful signal, on your own schedule, without the emotional weight of a genuine rejection attached to it.</p>'),
    ],
  },
  bn: {
    title: 'Feedback পাওয়া আর ব্যবহার করা',
    metaTitle: 'ইন্টারভিউ Feedback পাওয়া আর ব্যবহার করা | Learn Computer Academy',
    metaDescription: 'বেশিরভাগ কোম্পানি প্রত্যাখ্যানের পরে কোনো feedback দেয় না। তবুও কীভাবে চাইবেন, আর কিছু পেলে এটি নিয়ে আসলে কী করবেন।',
    blocks: [
      p('<p>একটি প্রত্যাখ্যানের পরে feedback উন্নতির জন্য উপলব্ধ একক সবচেয়ে কাজের জিনিস, আর বেশিরভাগ কোম্পানি জিজ্ঞাসা না করে এটি দেয় না, প্রায়ই উদাসীনতার চেয়ে বেশি দায়বদ্ধতার কারণে। তবুও এটি চাওয়া সার্থক — বাস্তবসম্মত সবচেয়ে খারাপ ফলাফল হলো নীরবতা, যা জিজ্ঞাসা না করেই আপনার ইতিমধ্যে আছে।</p>'),

      h(2, 'কীভাবে জিজ্ঞাসা করবেন', 'how-to-ask'),
      p('<p>একটি ছোট, সত্যিই কৃতজ্ঞ বার্তা সবচেয়ে ভালো কাজ করে:</p>'),
      code('text', '"Thank you for letting me know, and for the opportunity to\ninterview. If you have a moment, I\'d really appreciate any feedback\non where I could improve for next time."'),
      p('<p>কোনো চাপ নেই, কোনো তর্ক নেই, সিদ্ধান্তটি নিজের বিরুদ্ধে কোনো ঠেলাঠেলি নেই — শুধু একটি প্রকৃত, কম-পরিশ্রমের অনুরোধ। কিছু কোম্পানি জবাব দিতে অস্বীকার করবে, প্রায়ই আইনি বা নীতিগত কারণে যা আপনার সাথে ব্যক্তিগতভাবে সম্পর্কহীন। অনেকে সরাসরি আর ভদ্রভাবে জিজ্ঞাসা করলে অন্তত কিছু দেবে, কারণ এতে তাদের খুব কম খরচ হয়।</p>'),

      img(
        'docs/img/career/feedback-1',
        'একজন mentor আর একজন তরুণ ডেভেলপার একটি ল্যাপটপের উপর একটি শান্ত, মনোযোগী কথোপকথনে, mentor স্ক্রিনের দিকে নির্দেশ করছেন আর ডেভেলপার মনোযোগ দিয়ে শুনছেন',
        1024, 768,
        'একটি প্রত্যাখ্যানের পরে উপলব্ধ সবচেয়ে কাজের জিনিস feedback — আর এটি সাধারণত চাওয়া লাগে।'
      ),

      h(2, 'আত্মপক্ষ-সমর্থনমূলক না হয়ে Feedback পড়া', 'reading-feedback-without-getting-defensive'),
      p('<p>সমালোচনামূলক feedback পাওয়ার সময় প্রবৃত্তি হলো ব্যাখ্যা করা, ন্যায্যতা দেওয়া, বা এর বিরুদ্ধে তর্ক করা। সেই প্রবৃত্তি সম্পূর্ণভাবে প্রতিরোধ করুন, অন্তত কথোপকথন শেষ হওয়ার অনেক পরে পর্যন্ত। জিজ্ঞাসা করার মূল কথা ছিল কাজের কিছু শেখা, আর উত্তরের সাথে তর্ক করা — এমনকি নীরবে, এমনকি সেই মুহূর্তে শুধু নিজের মাথায় — জিজ্ঞাসা করার পুরো উদ্দেশ্য নস্যাৎ করে।</p>'),

      callout('note', '<p>Feedback প্রায়ই অস্পষ্ট — "not quite the right fit" সাধারণ আর নিজে সত্যিই অকেজো। চাপাচাপি না করে একটি স্পষ্টীকরণ follow-up জিজ্ঞাসা করতে পারলে, করুন: "Was that more about technical skills, or more about the overall fit?" একটি অস্পষ্ট উত্তরকে এমন কিছুতে সংকীর্ণ করে যা নিয়ে আপনি আসলে কাজ করতে পারেন।</p>'),

      h(2, 'এটি নিয়ে কী করবেন', 'what-to-do-with-it'),
      p('<p>পাওয়ার সাথে সাথে এটি লিখে রাখুন, তারিখসহ, কোন কোম্পানি আর পর্যায় থেকে এসেছে তার সাথে। মুষ্টিমেয় প্রত্যাখ্যানের পর, একবারে একটি না পড়ে একসাথে পড়ুন — কয়েকটি জুড়ে একটি প্যাটার্ন ("technical fundamentals need work," তিনবার আলাদাভাবে দেখা যাওয়া) একা নেওয়া যেকোনো একক feedback-এর চেয়ে অনেক বেশি নির্ভরযোগ্য আর কাজে লাগানোর যোগ্য।</p>'),

      h(2, 'আপনি কিছুই না পেলে', 'when-you-get-nothing'),
      p('<p>একেবারে কোনো feedback না পাওয়া সাধারণ, ব্যক্তিগত নয়, আর এর অর্থ এই নয় যে ইন্টারভিউটি অস্বাভাবিকভাবে খারাপ গেছে — এর সাধারণত অর্থ শুধু কোম্পানির এটি দেওয়ার কোনো আনুষ্ঠানিক প্রক্রিয়া নেই, বা এমনটা না করার একটি নীতি। সেক্ষেত্রে, স্ব-মূল্যায়ন ফাঁকটি পূরণ করে: ইন্টারভিউয়ের সাথে সাথে, এখনো তাজা থাকতে, কী টলমলে মনে হয়েছিল, কী আপনি আত্মবিশ্বাসের সাথে উত্তর দিতে পারেননি, আর পরেরবার কী ভিন্নভাবে প্রস্তুত করতেন তা লিখে রাখুন।</p>'),

      h(2, 'অনুশীলন থেকে Feedback, শুধু আসল ইন্টারভিউ নয়', 'feedback-from-practice-not-just-real-interviews'),
      p('<p>Feedback পেতে আপনাকে একটি আসল প্রত্যাখ্যানের জন্য অপেক্ষা করতে হবে না। একজন শিক্ষক, একজন এগিয়ে থাকা সমকক্ষ, বা আসল প্রশ্ন জিজ্ঞাসা করতে আর সৎ প্রতিক্রিয়া দিতে ইচ্ছুক যেকোনো টেকনিক্যাল কারো সাথে একটি mock ইন্টারভিউ একই ধরনের কাজের সংকেত তৈরি করে, আপনার নিজের সূচিতে, এর সাথে যুক্ত একটি প্রকৃত প্রত্যাখ্যানের আবেগিক ওজন ছাড়াই।</p>'),
    ],
  },
})

lessons.push({
  slug: 'diagnosing-why-you-keep-not-getting-through',
  sortOrder: 27,
  en: {
    title: 'Diagnosing Why You Keep Not Getting Through',
    metaTitle: 'Diagnosing Why Interviews Keep Not Working Out | Learn Computer Academy',
    metaDescription: 'When interviews consistently do not work out, a structured diagnosis finds the actual stage that is failing, instead of guessing at a fix.',
    blocks: [
      p('<p>A handful of rejections is normal and doesn\'t need diagnosing. If a real pattern is showing up — consistently not even getting a first reply, or consistently reaching an interview but never passing it — that is worth genuinely diagnosing, rather than guessing at a fix or, worse, changing everything at once and losing track of what actually helped.</p>'),

      h(2, 'Find the Actual Stage That Is Failing'),
      table(
        ['Pattern', 'Likely stage', 'Where to look'],
        [
          ['Rarely get a reply at all', 'CV / application', 'CV clarity, portfolio links working, whether the CV is tailored at all'],
          ['Get replies, but the first call goes nowhere', 'Screening', 'Communication, clarity about what you want, basic fit signals'],
          ['Pass screening, fail the technical round', 'Fundamentals or project depth', 'Revisit core concepts; make sure you can defend your own projects in real depth'],
          ['Fail specifically at live coding', 'Process under pressure', 'Practice thinking out loud (see the earlier lesson); this is a distinct skill from knowing the material'],
          ['Get to final rounds, don\'t get the offer', 'Fit, or genuinely close competition', 'Often less fixable directly; frequently just needs more attempts, not a different approach'],
        ]
      ),
      p('<p>Where in this sequence things consistently break down changes what is actually worth working on next. Fixing your CV does nothing if the real problem is technical fundamentals; drilling algorithms does nothing if applications aren\'t even generating replies in the first place.</p>'),

      h(2, 'Gather Real Evidence Before Acting'),
      p('<p>Track every application: date, company, stage reached, any feedback received. After ten to fifteen data points, a genuine pattern is usually visible — reacting to any single rejection in isolation is reacting to noise, not signal.</p>'),

      callout('tip', '<p>Ask someone else to review your CV, watch you do a mock interview, or look at your portfolio with fresh eyes. Self-diagnosis has a real blind spot here — the exact same gap that\'s causing rejections is often invisible to you precisely because you don\'t know what you don\'t know.</p>'),

      h(2, 'Change One Thing at a Time'),
      p('<p>If several things are adjusted simultaneously — a new CV, a new interview style, new projects, all at once — and results improve, there is no way to know which change actually mattered, which makes the next round of troubleshooting just as blind as this one. Change the thing the evidence points to most clearly, then genuinely give it a fair number of attempts before adjusting again.</p>'),

      h(2, 'When the Honest Answer Is "Not Ready Yet"'),
      p('<p>Sometimes consistent rejection at the technical stage means a real skills gap that needs more study time, not a better interview technique — and that is a completely legitimate, fixable, temporary answer, not a verdict on your fundamental ability. Recognising it plainly and returning to focused practice for a stretch of time is a reasonable, deliberate strategy, not a failure or a step backward.</p>'),
    ],
  },
  bn: {
    title: 'আপনি কেন বারবার পার হচ্ছেন না তা নির্ণয় করা',
    metaTitle: 'ইন্টারভিউ কেন কাজ হচ্ছে না তা নির্ণয় | Learn Computer Academy',
    metaDescription: 'ইন্টারভিউ ধারাবাহিকভাবে কাজ না করলে, একটি কাঠামোগত নির্ণয় আসল ব্যর্থ পর্যায়টি খুঁজে বের করে, একটি সমাধান অনুমান করার বদলে।',
    blocks: [
      p('<p>মুষ্টিমেয় প্রত্যাখ্যান স্বাভাবিক আর নির্ণয়ের প্রয়োজন নেই। একটি আসল প্যাটার্ন দেখা দিলে — ধারাবাহিকভাবে প্রথম জবাবও না পাওয়া, বা ধারাবাহিকভাবে একটি ইন্টারভিউতে পৌঁছানো কিন্তু কখনো পাস না করা — সেটি একটি সমাধান অনুমান করার বদলে, বা আরও খারাপ, একসাথে সবকিছু বদলে আসলে কী সাহায্য করেছে তার হিসাব হারানোর বদলে, সত্যিই নির্ণয়ের যোগ্য।</p>'),

      h(2, 'আসল ব্যর্থ পর্যায়টি খুঁজুন', 'find-the-actual-stage-that-is-failing'),
      table(
        ['প্যাটার্ন', 'সম্ভাব্য পর্যায়', 'কোথায় দেখবেন'],
        [
          ['খুব কমই একেবারে জবাব পান', 'CV / আবেদন', 'CV স্পষ্টতা, portfolio লিংক কাজ করে কিনা, CV আদৌ মানানসই কিনা'],
          ['জবাব পান, কিন্তু প্রথম কল কোথাও যায় না', 'স্ক্রিনিং', 'যোগাযোগ, আপনি কী চান তা নিয়ে স্পষ্টতা, মৌলিক মিলের সংকেত'],
          ['স্ক্রিনিং পাস করেন, টেকনিক্যাল রাউন্ডে ব্যর্থ', 'মূল বিষয় বা প্রোজেক্টের গভীরতা', 'মূল ধারণা আবার দেখুন; নিশ্চিত করুন আপনি আসল গভীরতায় নিজের প্রোজেক্ট রক্ষা করতে পারেন'],
          ['বিশেষভাবে live coding-এ ব্যর্থ', 'চাপের নিচে প্রক্রিয়া', 'জোরে চিন্তা করার অনুশীলন করুন (আগের পাঠ দেখুন); এটি বিষয়টি জানা থেকে আলাদা একটি দক্ষতা'],
          ['চূড়ান্ত রাউন্ডে পৌঁছান, অফার পান না', 'Fit, বা সত্যিই কাছাকাছি প্রতিযোগিতা', 'প্রায়ই সরাসরি ঠিক করার যোগ্য কম; প্রায়ই শুধু আরও চেষ্টা দরকার, একটি ভিন্ন পদ্ধতি নয়'],
        ]
      ),
      p('<p>এই ক্রমের কোথায় জিনিস ধারাবাহিকভাবে ভেঙে পড়ে তা পরে আসলে কী কাজ করার যোগ্য তা বদলায়। আসল সমস্যা টেকনিক্যাল মূল বিষয় হলে আপনার CV ঠিক করা কিছুই করে না; আবেদন প্রথম স্থানে জবাবই তৈরি না করলে algorithm অনুশীলন কিছুই করে না।</p>'),

      h(2, 'কাজ করার আগে আসল প্রমাণ সংগ্রহ করুন', 'gather-real-evidence-before-acting'),
      p('<p>প্রতিটি আবেদন ট্র্যাক করুন: তারিখ, কোম্পানি, পৌঁছানো পর্যায়, পাওয়া যেকোনো feedback। দশ থেকে পনেরোটি ডেটা পয়েন্টের পর, একটি প্রকৃত প্যাটার্ন সাধারণত দৃশ্যমান — বিচ্ছিন্নভাবে যেকোনো একক প্রত্যাখ্যানে প্রতিক্রিয়া দেওয়া শব্দে প্রতিক্রিয়া দেওয়া, সংকেতে নয়।</p>'),

      callout('tip', '<p>অন্য কাউকে আপনার CV পর্যালোচনা করতে, আপনাকে একটি mock ইন্টারভিউ করতে দেখতে, বা তাজা চোখে আপনার portfolio দেখতে বলুন। এখানে স্ব-নির্ণয়ের একটি আসল অন্ধ বিন্দু আছে — প্রত্যাখ্যান ঘটাচ্ছে ঠিক সেই ফাঁকটি প্রায়ই আপনার কাছে অদৃশ্য ঠিক কারণ আপনি জানেন না আপনি কী জানেন না।</p>'),

      h(2, 'একবারে একটি জিনিস বদলান', 'change-one-thing-at-a-time'),
      p('<p>একসাথে কয়েকটি জিনিস সমন্বয় করা হলে — একটি নতুন CV, একটি নতুন ইন্টারভিউ স্টাইল, নতুন প্রোজেক্ট, সবই একবারে — আর ফলাফল উন্নত হয়, কোন পরিবর্তনটি আসলে গুরুত্বপূর্ণ ছিল তা জানার কোনো উপায় নেই, যা সমস্যা সমাধানের পরের রাউন্ডকে এটির মতোই অন্ধ করে তোলে। প্রমাণ সবচেয়ে স্পষ্টভাবে যেদিকে নির্দেশ করে সেটি বদলান, তারপর আবার সমন্বয় করার আগে সত্যিই এটিকে একটি ন্যায্য সংখ্যক চেষ্টা দিন।</p>'),

      h(2, 'যখন সৎ উত্তরটি "এখনো প্রস্তুত নই"', 'when-the-honest-answer-is-not-ready-yet'),
      p('<p>কখনো কখনো টেকনিক্যাল পর্যায়ে ধারাবাহিক প্রত্যাখ্যানের অর্থ একটি ভালো ইন্টারভিউ কৌশল নয়, বেশি পড়ার সময় দরকার এমন একটি আসল দক্ষতার ফাঁক — আর এটি একটি সম্পূর্ণ বৈধ, ঠিক করার যোগ্য, সাময়িক উত্তর, আপনার মৌলিক সক্ষমতার উপর একটি রায় নয়। এটি সরলভাবে স্বীকার করা আর কিছু সময়ের জন্য মনোযোগী অনুশীলনে ফিরে যাওয়া একটি যুক্তিসঙ্গত, ইচ্ছাকৃত কৌশল, একটি ব্যর্থতা বা পিছিয়ে যাওয়া নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'staying-sharp-while-job-hunting',
  sortOrder: 28,
  en: {
    title: 'Staying Sharp While Job Hunting',
    metaTitle: 'Staying Sharp While Job Hunting | Learn Computer Academy',
    metaDescription: 'A long job search without ongoing practice leaves skills quietly eroding, and eventually shows up in interviews. A sustainable structure fixes this.',
    blocks: [
      p('<p>A job search can stretch on for months, and time spent purely applying and interviewing, with no ongoing building, quietly erodes the actual skills those applications are supposed to demonstrate. This eventually shows up in interviews as rustiness, which then compounds the discouragement of the search itself.</p>'),

      h(2, 'Why Skills Quietly Erode'),
      p('<p>Coding is a skill that fades with disuse the same way any practical skill does. A student mid-course, coding daily, is measurably sharper in the moment than the same person three months into a job search where the only coding happening is occasional interview prep. Applying alone is not practice.</p>'),

      h(2, 'A Sustainable Weekly Structure'),
      p('<p>Job hunting and skill-building work better run in parallel, deliberately, rather than treating the search as a full-time activity that pushes everything else out entirely:</p><ul><li><b>A fixed block of applying and networking</b> — covered in the earlier applying-well lesson.</li><li><b>A fixed block of actually building</b> — a new small feature, a new small project, contributing to something. This keeps skills current and, as a direct side effect, keeps generating fresh material to discuss in the next interview.</li><li><b>A fixed block of deliberate review</b> — revisiting fundamentals, particularly whatever came up as shaky in a recent interview.</li></ul>'),

      callout('tip', '<p>Keep building something the entire time you\'re searching, even if it\'s small. Beyond keeping skills sharp, it gives you something new and current to talk about in the next interview, which matters more than it sounds — "what have you built recently" is a very common question, and "nothing, I\'ve just been applying" is a genuinely weak answer to it.</p>'),

      h(2, 'Avoid Two Opposite Failure Modes'),
      p('<p>Spending literally all available time on applications, with zero time left for building or review, leaves you rustier with each passing week of searching — the opposite of what the time was supposed to produce. Spending all your time comfortably building instead, while quietly avoiding the discomfort of actually applying and facing rejection, produces skill without forward progress toward the actual goal. Both feel productive in the moment. Neither, alone, moves the search forward.</p>'),

      h(2, 'Structure Beats Willpower Here'),
      p('<p>A loose, unscheduled search is far easier to let quietly slide — a day becomes a week becomes a month with the discouragement doing the work of avoidance. A simple, fixed weekly structure removes a lot of the daily decision-making about what to do next, which is exactly the kind of decision that\'s hardest to make well while discouraged.</p>'),
    ],
  },
  bn: {
    title: 'চাকরি খোঁজার সময় দক্ষতা ধারালো রাখা',
    metaTitle: 'চাকরি খোঁজার সময় দক্ষতা ধারালো রাখা | Learn Computer Academy',
    metaDescription: 'ক্রমাগত অনুশীলন ছাড়া একটি দীর্ঘ চাকরি খোঁজা দক্ষতাকে চুপচাপ ক্ষয় করে, আর শেষে ইন্টারভিউতে দেখা দেয়। একটি টেকসই কাঠামো এটি ঠিক করে।',
    blocks: [
      p('<p>একটি চাকরি খোঁজা মাসের পর মাস চলতে পারে, আর কোনো চলমান তৈরি ছাড়া শুধু আবেদন আর ইন্টারভিউতে ব্যয় করা সময় সেই আবেদনগুলো যা প্রদর্শন করার কথা সেই আসল দক্ষতা চুপচাপ ক্ষয় করে। এটি শেষে ইন্টারভিউতে মরচে ধরা হিসেবে দেখা দেয়, যা তারপর অনুসন্ধানের নিজের নিরুৎসাহকে বাড়িয়ে তোলে।</p>'),

      h(2, 'দক্ষতা চুপচাপ কেন ক্ষয় হয়', 'why-skills-quietly-erode'),
      p('<p>Coding একটি দক্ষতা যা অন্য যেকোনো ব্যবহারিক দক্ষতার মতোই অব্যবহারে ম্লান হয়। প্রতিদিন coding করা কোর্সের মাঝামাঝি একজন শিক্ষার্থী সেই মুহূর্তে একই ব্যক্তি তিন মাস চাকরি খোঁজার মধ্যে থাকার চেয়ে পরিমাপযোগ্যভাবে বেশি ধারালো যেখানে একমাত্র coding হচ্ছে মাঝে মাঝে ইন্টারভিউ প্রস্তুতি। শুধু আবেদন করা অনুশীলন নয়।</p>'),

      h(2, 'একটি টেকসই সাপ্তাহিক কাঠামো', 'a-sustainable-weekly-structure'),
      p('<p>চাকরি খোঁজা আর দক্ষতা-তৈরি ইচ্ছাকৃতভাবে সমান্তরালে চালালে ভালো কাজ করে, খোঁজাটিকে একটি পূর্ণকালীন কার্যকলাপ হিসেবে গণ্য করে যা বাকি সবকিছু সম্পূর্ণ বের করে দেয় তার বদলে:</p><ul><li><b>আবেদন আর নেটওয়ার্কিংয়ের একটি নির্দিষ্ট ব্লক</b> — আগের ভালোভাবে-আবেদন পাঠে কভার করা।</li><li><b>আসলে তৈরি করার একটি নির্দিষ্ট ব্লক</b> — একটি নতুন ছোট ফিচার, একটি নতুন ছোট প্রোজেক্ট, কিছুতে অবদান রাখা। এটি দক্ষতা বর্তমান রাখে আর, একটি সরাসরি পার্শ্বপ্রতিক্রিয়া হিসেবে, পরের ইন্টারভিউতে আলোচনা করার জন্য তাজা উপাদান তৈরি করতে থাকে।</li><li><b>ইচ্ছাকৃত পর্যালোচনার একটি নির্দিষ্ট ব্লক</b> — মূল বিষয় আবার দেখা, বিশেষত সাম্প্রতিক একটি ইন্টারভিউতে যা টলমলে মনে হয়েছিল।</li></ul>'),

      callout('tip', '<p>আপনি খোঁজার পুরো সময় কিছু তৈরি করতে থাকুন, ছোট হলেও। দক্ষতা ধারালো রাখার বাইরে, এটি আপনাকে পরের ইন্টারভিউতে আলোচনা করার জন্য নতুন আর বর্তমান কিছু দেয়, যা শোনার চেয়ে বেশি গুরুত্বপূর্ণ — "আপনি সম্প্রতি কী তৈরি করেছেন" একটি খুব সাধারণ প্রশ্ন, আর "কিছুই না, আমি শুধু আবেদন করছিলাম" এর একটি সত্যিই দুর্বল উত্তর।</p>'),

      h(2, 'দুটি বিপরীত ব্যর্থতার ধরন এড়ান', 'avoid-two-opposite-failure-modes'),
      p('<p>আক্ষরিকভাবে উপলব্ধ সব সময় আবেদনে ব্যয় করা, তৈরি বা পর্যালোচনার জন্য শূন্য সময় রেখে, খোঁজার প্রতিটি পার হওয়া সপ্তাহের সাথে আপনাকে বেশি মরচে ধরায় — সময়টি যা তৈরি করার কথা ছিল তার উল্টো। এর বদলে আরামে সব সময় তৈরিতে ব্যয় করা, আসলে আবেদন করা আর প্রত্যাখ্যানের মুখোমুখি হওয়ার অস্বস্তি চুপচাপ এড়িয়ে, আসল লক্ষ্যের দিকে সামনের অগ্রগতি ছাড়া দক্ষতা তৈরি করে। দুটোই সেই মুহূর্তে কাজের মনে হয়। কোনোটিই, একা, খোঁজাকে সামনে এগিয়ে নেয় না।</p>'),

      h(2, 'এখানে ইচ্ছাশক্তির চেয়ে কাঠামো ভালো', 'structure-beats-willpower-here'),
      p('<p>একটি ঢিলে, অসূচিত খোঁজা চুপচাপ পিছলে যেতে দেওয়া অনেক সহজ — একটি দিন একটি সপ্তাহ হয়ে যায় একটি মাস হয়ে যায় নিরুৎসাহ এড়ানোর কাজ করতে করতে। একটি সরল, নির্দিষ্ট সাপ্তাহিক কাঠামো পরে কী করবেন সে সম্পর্কে অনেক দৈনিক সিদ্ধান্ত গ্রহণ সরায়, যা ঠিক সেই ধরনের সিদ্ধান্ত যা নিরুৎসাহিত অবস্থায় ভালোভাবে নেওয়া সবচেয়ে কঠিন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'confidence-and-self-doubt',
  sortOrder: 29,
  en: {
    title: 'Confidence and Self-Doubt',
    metaTitle: 'Confidence and Self-Doubt in a Job Search | Learn Computer Academy',
    metaDescription: 'Self-doubt during a job search is close to universal, including among people who go on to succeed. What actually helps, and what makes it worse.',
    blocks: [
      p('<p>Somewhere in a long job search, most people start genuinely wondering if they\'re cut out for this at all. This is close to universal — including among people who go on to have long, successful careers — and it is worth naming directly rather than pretending it doesn\'t happen.</p>'),

      h(2, 'Why This Happens, Structurally'),
      p('<p>A job search concentrates rejection into a short period in a way daily life normally doesn\'t. A few weeks of repeated rejection, compressed together, would shake almost anyone\'s confidence — this is closer to a structural feature of what a job search actually is than a personal weakness in the person going through it.</p>'),

      callout('note', '<p>The specific, common thought worth naming directly: "maybe I chose the wrong field." That thought is a completely normal response to concentrated rejection, and it is worth treating as exactly that — a predictable emotional response to a hard stretch — rather than as new, previously hidden information about your actual aptitude suddenly revealing itself.</p>', 'A predictable feeling, not new information'),

      h(2, 'What Tends to Help'),
      p('<ul><li><b>Separate the feeling from the facts.</b> Feeling discouraged today doesn\'t change what you actually know or what you\'ve actually built — the feeling is real, but it isn\'t evidence about your ability.</li><li><b>Look at concrete, dated evidence of progress</b> — the self-assessment from the earlier lesson, old code you can genuinely no longer relate to because you\'ve improved past it, concepts that used to be difficult and now genuinely aren\'t.</li><li><b>Talk to someone actually going through the same thing.</b> Self-doubt isolates by making everyone feel like they\'re uniquely struggling; a classmate in the same search almost always turns out to be feeling exactly the same way.</li><li><b>Separate rest from giving up.</b> Taking a deliberate short break to recover is not the same as quitting, and treating every pause as failure makes genuine rest feel unavailable, which burns people out faster.</li></ul>'),

      h(2, 'What Tends to Make It Worse'),
      p('<p>Constantly comparing yourself to others\' visible success, applying while genuinely exhausted rather than actually resting, and treating every single rejection as fresh, un-processed evidence rather than an expected, ordinary part of the process all reliably make self-doubt worse rather than better.</p>'),

      h(2, 'When It Becomes Something More Than Job-Search Stress'),
      p('<p>Ordinary discouragement during a hard search is expected and, in time, passes. Persistent low mood, real difficulty functioning day to day, or a loss of interest in things well beyond the job search itself are a different, more serious matter, and deserve real support beyond a career course — from someone qualified to help with that specifically, not from career advice.</p>'),

      h(2, 'The Honest Note to End On'),
      p('<p>Confidence in this field is built, gradually, by doing the work and seeing it hold up in front of other people — not by feeling ready first and only then starting. Most people who eventually feel confident got there by continuing to show up while still uncertain, not by waiting for the uncertainty to fully disappear before they began.</p>'),
    ],
  },
  bn: {
    title: 'আত্মবিশ্বাস আর আত্ম-সন্দেহ',
    metaTitle: 'একটি চাকরি খোঁজায় আত্মবিশ্বাস আর আত্ম-সন্দেহ | Learn Computer Academy',
    metaDescription: 'চাকরি খোঁজার সময় আত্ম-সন্দেহ প্রায় সর্বজনীন, শেষে সফল হওয়া মানুষদের মধ্যেও। আসলে কী সাহায্য করে, আর কী এটি খারাপ করে।',
    blocks: [
      p('<p>একটি দীর্ঘ চাকরি খোঁজার কোথাও, বেশিরভাগ মানুষ সত্যিই ভাবতে শুরু করে তারা এর জন্য আদৌ তৈরি কিনা। এটি প্রায় সর্বজনীন — দীর্ঘ, সফল ক্যারিয়ার পাওয়া মানুষদের মধ্যেও — আর এটি ঘটে না এমন ভান করার বদলে সরাসরি নাম দেওয়ার যোগ্য।</p>'),

      h(2, 'এটি কাঠামোগতভাবে কেন ঘটে', 'why-this-happens-structurally'),
      p('<p>একটি চাকরি খোঁজা এমনভাবে একটি সংক্ষিপ্ত সময়ে প্রত্যাখ্যান কেন্দ্রীভূত করে যা দৈনন্দিন জীবন সাধারণত করে না। পুনরাবৃত্ত প্রত্যাখ্যানের কয়েক সপ্তাহ, একসাথে সংকুচিত, প্রায় যে কারো আত্মবিশ্বাস নাড়িয়ে দেবে — এটি এর মধ্য দিয়ে যাওয়া ব্যক্তির একটি ব্যক্তিগত দুর্বলতার চেয়ে একটি চাকরি খোঁজা আসলে কী তার একটি কাঠামোগত বৈশিষ্ট্যের কাছাকাছি।</p>'),

      callout('note', '<p>সরাসরি নাম দেওয়ার যোগ্য নির্দিষ্ট, সাধারণ চিন্তা: "হয়তো আমি ভুল ক্ষেত্র বেছেছি।" সেই চিন্তা কেন্দ্রীভূত প্রত্যাখ্যানের একটি সম্পূর্ণ স্বাভাবিক প্রতিক্রিয়া, আর এটিকে ঠিক তাই হিসেবে গণ্য করা সার্থক — একটি কঠিন সময়ের একটি অনুমানযোগ্য আবেগিক প্রতিক্রিয়া — আপনার আসল যোগ্যতা সম্পর্কে হঠাৎ প্রকাশ পাওয়া নতুন, আগে লুকানো তথ্য হিসেবে নয়।</p>', 'একটি অনুমানযোগ্য অনুভূতি, নতুন তথ্য নয়'),

      h(2, 'সাধারণত যা সাহায্য করে', 'what-tends-to-help'),
      p('<ul><li><b>অনুভূতিকে তথ্য থেকে আলাদা করুন।</b> আজ নিরুৎসাহিত বোধ করা আপনি আসলে কী জানেন বা আসলে কী তৈরি করেছেন তা বদলায় না — অনুভূতিটি বাস্তব, কিন্তু এটি আপনার সক্ষমতা সম্পর্কে প্রমাণ নয়।</li><li><b>অগ্রগতির নির্দিষ্ট, তারিখযুক্ত প্রমাণ দেখুন</b> — আগের পাঠের স্ব-মূল্যায়ন, পুরোনো কোড যার সাথে আপনি সত্যিই আর সম্পর্কিত বোধ করেন না কারণ আপনি এটি ছাড়িয়ে উন্নত হয়েছেন, এমন ধারণা যা আগে কঠিন ছিল আর এখন সত্যিই নয়।</li><li><b>একই জিনিসের মধ্য দিয়ে যাওয়া কারো সাথে কথা বলুন।</b> আত্ম-সন্দেহ সবাইকে অনন্যভাবে সংগ্রামরত মনে করিয়ে বিচ্ছিন্ন করে; একই খোঁজায় একজন সহপাঠী প্রায় সবসময় ঠিক একই রকম অনুভব করছে দেখা যায়।</li><li><b>বিশ্রামকে হাল ছেড়ে দেওয়া থেকে আলাদা করুন।</b> সেরে উঠতে একটি ইচ্ছাকৃত ছোট বিরতি নেওয়া ছেড়ে দেওয়ার মতো নয়, আর প্রতিটি বিরতিকে ব্যর্থতা হিসেবে গণ্য করা প্রকৃত বিশ্রামকে অনুপলব্ধ মনে করায়, যা মানুষকে দ্রুত নিঃশেষ করে।</li></ul>'),

      h(2, 'সাধারণত যা এটি খারাপ করে', 'what-tends-to-make-it-worse'),
      p('<p>ক্রমাগত নিজেকে অন্যের দৃশ্যমান সাফল্যের সাথে তুলনা করা, সত্যিই ক্লান্ত অবস্থায় আবেদন করা আসলে বিশ্রাম না নিয়ে, আর প্রতিটি একক প্রত্যাখ্যানকে প্রক্রিয়ার একটি প্রত্যাশিত, সাধারণ অংশের বদলে তাজা, অপ্রক্রিয়াজাত প্রমাণ হিসেবে গণ্য করা সবই নির্ভরযোগ্যভাবে আত্ম-সন্দেহকে ভালোর বদলে খারাপ করে।</p>'),

      h(2, 'এটি চাকরি-খোঁজার চাপের চেয়ে বেশি কিছু হয়ে উঠলে', 'when-it-becomes-something-more-than-job-search-stress'),
      p('<p>একটি কঠিন খোঁজার সময় সাধারণ নিরুৎসাহ প্রত্যাশিত আর, সময়ের সাথে, চলে যায়। স্থায়ী নিম্ন মেজাজ, দৈনন্দিন কাজে সত্যিকারের অসুবিধা, বা চাকরি খোঁজার নিজের বাইরে অনেক কিছুতে আগ্রহ হারানো একটি ভিন্ন, বেশি গুরুতর বিষয়, আর একটি ক্যারিয়ার কোর্সের বাইরে আসল সহায়তার যোগ্য — নির্দিষ্টভাবে এতে সাহায্য করার যোগ্যতাসম্পন্ন কারো কাছ থেকে, ক্যারিয়ার পরামর্শ থেকে নয়।</p>'),

      h(2, 'শেষ করার সৎ নোট', 'the-honest-note-to-end-on'),
      p('<p>এই ক্ষেত্রে আত্মবিশ্বাস তৈরি হয়, ধীরে ধীরে, কাজ করে আর অন্য মানুষের সামনে এটি টিকে থাকতে দেখে — প্রথমে প্রস্তুত বোধ করে আর তারপরই শুরু করে নয়। যারা শেষে আত্মবিশ্বাসী বোধ করে তাদের বেশিরভাগ এখনো অনিশ্চিত থাকা অবস্থায় হাজির হতে থাকা দিয়ে সেখানে পৌঁছেছে, শুরু করার আগে অনিশ্চয়তা সম্পূর্ণ অদৃশ্য হওয়ার অপেক্ষা করে নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'freelancing-as-a-first-income',
  sortOrder: 30,
  en: {
    title: 'Freelancing as a First Income',
    metaTitle: 'Freelancing as a First Income | Learn Computer Academy',
    metaDescription: 'For many students, the fastest realistic income is a small freelance project, not a salaried job. Finding first clients, pricing, and delivering well.',
    blocks: [
      p('<p>For many students, the fastest realistic path to actual income is not a salaried job — it is a small freelance project for a local business or an individual client. There is no gatekeeper, no formal application process, and no competing pool of hundreds of other applicants. This site\'s <a href="/marketing/">Digital Marketing course</a> covers the client and business side in more depth; this lesson focuses specifically on getting the first project as a beginner.</p>'),

      h(2, 'Where First Clients Actually Come From'),
      p('<p>Almost never a stranger found online, especially for a first project. Realistically: local small businesses without a website at all — a shop, a tutor, a local service provider; people you already know who run something small; friends and family who know someone who needs one; and a genuinely low, honest price for the first one or two projects specifically to build a portfolio piece and a reference, more than to earn well from that specific job.</p>'),

      img(
        'docs/img/career/freelancing-1',
        'A young freelance developer showing a laptop screen to a small shop owner, both looking at a website mockup together in a small local shop',
        1024, 768,
        'A first freelance client is rarely a stranger online — it is usually someone local, with a real, specific need.'
      ),

      h(2, 'Pricing as a Beginner'),
      p('<p>Pricing too high for a first project, with nothing yet to show, produces silence. Pricing at zero devalues the work and can attract clients who don\'t respect your time at all. A modest, honest price for the first couple of projects — treating them explicitly as portfolio-building — is the practical middle ground, with prices rising once there is real, demonstrable work to point to.</p>'),

      callout('note', '<p>Be upfront that you\'re early in your freelance work, rather than pretending otherwise. Most small local clients care far more about a fair price, clear communication, and actually finishing on time than about years of formal experience — and pretending to have experience you don\'t is a much bigger risk than admitting you\'re newer to this.</p>'),

      h(2, 'Scoping a Project So It Does Not Spiral'),
      p('<p>Agree in writing, even informally over a message, on exactly what will be delivered, roughly by when, and what counts as done. "Build me a website" with nothing more specific than that reliably turns into endless unpaid revisions once the client keeps thinking of new things to add. A simple written scope — even three or four bullet points — protects both sides and heads this off before it starts.</p>'),

      h(2, 'Delivering Well on a Small Project'),
      p('<ul><li>Communicate proactively rather than going quiet — a short update, even "still on track," is worth sending unprompted.</li><li>Deliver on the timeline you agreed to, or say clearly and early if that has changed and why.</li><li>Test what you built properly before handing it over.</li><li>Ask for a short testimonial or a review once the client is genuinely happy — this becomes real portfolio material and evidence for the next client.</li></ul>'),

      h(2, 'What This Actually Builds Toward'),
      p('<p>A finished, paid, real client project is a stronger portfolio entry than most tutorial-based ones, a genuine reference from someone with no reason to inflate their praise, and often the first proof that someone was willing to pay for your work at all — which changes how the rest of the job search feels, not just what it produces.</p>'),
    ],
  },
  bn: {
    title: 'প্রথম আয় হিসেবে Freelancing',
    metaTitle: 'প্রথম আয় হিসেবে Freelancing | Learn Computer Academy',
    metaDescription: 'অনেক শিক্ষার্থীর জন্য, দ্রুততম বাস্তবসম্মত আয় একটি বেতনভুক্ত চাকরি নয়, একটি ছোট freelance প্রোজেক্ট। প্রথম ক্লায়েন্ট খোঁজা, দাম ঠিক করা, আর ভালোভাবে দেওয়া।',
    blocks: [
      p('<p>অনেক শিক্ষার্থীর জন্য, আসল আয়ের দ্রুততম বাস্তবসম্মত পথ একটি বেতনভুক্ত চাকরি নয় — এটি একটি স্থানীয় ব্যবসা বা একজন ব্যক্তি ক্লায়েন্টের জন্য একটি ছোট freelance প্রোজেক্ট। কোনো gatekeeper নেই, কোনো আনুষ্ঠানিক আবেদন প্রক্রিয়া নেই, আর অন্য শত শত আবেদনকারীর কোনো প্রতিযোগী পুল নেই। এই সাইটের <a href="/bn/marketing/">Digital Marketing কোর্স</a> বেশি গভীরে ক্লায়েন্ট আর ব্যবসার দিক কভার করে; এই পাঠটি বিশেষভাবে একজন শিক্ষানবিস হিসেবে প্রথম প্রোজেক্ট পাওয়ার উপর কেন্দ্রীভূত।</p>'),

      h(2, 'প্রথম ক্লায়েন্ট আসলে কোথা থেকে আসে', 'where-first-clients-actually-come-from'),
      p('<p>প্রায় কখনো অনলাইনে পাওয়া একজন অচেনা মানুষ নয়, বিশেষত একটি প্রথম প্রোজেক্টের জন্য। বাস্তবসম্মতভাবে: একেবারেই কোনো ওয়েবসাইট নেই এমন স্থানীয় ছোট ব্যবসা — একটি দোকান, একজন টিউটর, একটি স্থানীয় সেবা প্রদানকারী; আপনার ইতিমধ্যে চেনা মানুষ যারা ছোট কিছু চালায়; বন্ধু আর পরিবার যারা এমন কাউকে চেনে যার একটি দরকার; আর একটি সত্যিই কম, সৎ দাম বিশেষভাবে প্রথম এক বা দুটি প্রোজেক্টের জন্য একটি portfolio অংশ আর একটি reference তৈরি করতে, সেই নির্দিষ্ট কাজ থেকে ভালো আয়ের চেয়ে বেশি।</p>'),

      img(
        'docs/img/career/freelancing-1',
        'একজন তরুণ freelance ডেভেলপার একটি ছোট স্থানীয় দোকানে একজন দোকান মালিককে একটি ল্যাপটপ স্ক্রিন দেখাচ্ছেন, দুজনেই একসাথে একটি ওয়েবসাইট mockup দেখছেন',
        1024, 768,
        'একটি প্রথম freelance ক্লায়েন্ট খুব কমই অনলাইনে একজন অচেনা মানুষ — সাধারণত এটি একজন স্থানীয়, একটি আসল, নির্দিষ্ট প্রয়োজনসহ।'
      ),

      h(2, 'একজন শিক্ষানবিস হিসেবে দাম ঠিক করা', 'pricing-as-a-beginner'),
      p('<p>দেখানোর মতো এখনো কিছু না থাকা অবস্থায় একটি প্রথম প্রোজেক্টের জন্য খুব বেশি দাম ঠিক করা নীরবতা তৈরি করে। শূন্যে দাম ঠিক করা কাজের মূল্য কমায় আর এমন ক্লায়েন্ট আকর্ষণ করতে পারে যারা আপনার সময়কে একেবারেই সম্মান করে না। প্রথম কয়েকটি প্রোজেক্টের জন্য একটি মাঝারি, সৎ দাম — সেগুলোকে স্পষ্টভাবে portfolio-তৈরি হিসেবে গণ্য করে — ব্যবহারিক মধ্যপন্থা, দেখানোর মতো আসল, প্রদর্শনযোগ্য কাজ থাকলে দাম বাড়ে।</p>'),

      callout('note', '<p>অন্যরকম ভান করার বদলে সরাসরি বলুন আপনি আপনার freelance কাজে প্রাথমিক পর্যায়ে। বেশিরভাগ ছোট স্থানীয় ক্লায়েন্ট বছরের আনুষ্ঠানিক অভিজ্ঞতার চেয়ে একটি ন্যায্য দাম, স্পষ্ট যোগাযোগ, আর আসলে সময়মতো শেষ করা নিয়ে অনেক বেশি চিন্তিত — আর আপনার নেই এমন অভিজ্ঞতা থাকার ভান করা আপনি এতে নতুন তা স্বীকার করার চেয়ে অনেক বড় ঝুঁকি।</p>'),

      h(2, 'একটি প্রোজেক্ট এমনভাবে scope করা যাতে এটি নিয়ন্ত্রণহীন না হয়', 'scoping-a-project-so-it-does-not-spiral'),
      p('<p>লিখিতভাবে সম্মত হন, একটি বার্তায় অনানুষ্ঠানিকভাবে হলেও, ঠিক কী দেওয়া হবে, মোটামুটি কবে, আর কী শেষ হিসেবে গণ্য হয়। "Build me a website" এর চেয়ে বেশি নির্দিষ্ট কিছু ছাড়া নির্ভরযোগ্যভাবে অন্তহীন বিনা-বেতনের সংশোধনে পরিণত হয় ক্লায়েন্ট নতুন জিনিস যোগ করার কথা ভাবতে থাকলে। একটি সরল লিখিত scope — এমনকি তিন বা চারটি bullet point — দুই পক্ষকে রক্ষা করে আর এটি শুরু হওয়ার আগেই ঠেকায়।</p>'),

      h(2, 'একটি ছোট প্রোজেক্টে ভালোভাবে দেওয়া', 'delivering-well-on-a-small-project'),
      p('<ul><li>চুপ হয়ে যাওয়ার বদলে সক্রিয়ভাবে যোগাযোগ করুন — একটি ছোট আপডেট, এমনকি "still on track," না চাইতেই পাঠানো সার্থক।</li><li>আপনার সম্মত সময়সূচিতে দিন, বা সেটি বদলেছে হলে স্পষ্টভাবে আর আগেভাগে বলুন কেন।</li><li>হস্তান্তরের আগে আপনি যা তৈরি করেছেন তা ঠিকভাবে পরীক্ষা করুন।</li><li>ক্লায়েন্ট সত্যিই খুশি হলে একটি ছোট প্রশংসাপত্র বা একটি review চান — এটি আসল portfolio উপাদান আর পরের ক্লায়েন্টের জন্য প্রমাণ হয়ে ওঠে।</li></ul>'),

      h(2, 'এটি আসলে কীসের দিকে তৈরি করে', 'what-this-actually-builds-toward'),
      p('<p>একটি শেষ, টাকা দেওয়া, আসল ক্লায়েন্ট প্রোজেক্ট বেশিরভাগ টিউটোরিয়াল-ভিত্তিক একটির চেয়ে একটি শক্তিশালী portfolio এন্ট্রি, তাদের প্রশংসা ফুলিয়ে তোলার কোনো কারণ নেই এমন কারো কাছ থেকে একটি প্রকৃত reference, আর প্রায়ই প্রথম প্রমাণ যে কেউ আপনার কাজের জন্য আদৌ টাকা দিতে ইচ্ছুক ছিল — যা বাকি চাকরি খোঁজা কেমন লাগে তা বদলায়, শুধু এটি কী তৈরি করে তা নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'building-experience-without-a-job',
  sortOrder: 31,
  en: {
    title: 'Building Experience Without a Job',
    metaTitle: 'Building Experience Without a Job | Learn Computer Academy',
    metaDescription: 'Real, demonstrable experience does not require a paid job title. Concrete ways to build it while still searching, and how to describe it honestly.',
    blocks: [
      p('<p>"I need experience to get a job, but I need a job to get experience" feels like a closed loop. It isn\'t, quite — there are several genuine ways to build real, demonstrable experience without a job title attached to it, and they fill the gap while a search continues.</p>'),

      h(2, 'Real Ways to Build It'),
      p('<ul><li><b>Volunteer technical work</b> for a local nonprofit, a community group, or a school — often genuinely needed and genuinely appreciated, and a completely real project with a real (if unpaid) client.</li><li><b>Open-source contributions</b> — even small ones, covered in the GitHub lesson, are real collaborative experience with someone else\'s code and conventions.</li><li><b>Building something for a friend or family member\'s actual small business</b>, treated with the same seriousness as the freelancing lesson describes.</li><li><b>Hackathons and coding competitions</b>, where they\'re available — time-boxed, genuinely collaborative, and often produce a concrete, demoable result.</li><li><b>A study or build group with classmates</b>, working on something together rather than solo, which is closer to team experience than any individual project can be.</li><li><b>Writing genuinely useful technical content</b> — an honest explainer of something you learned, published somewhere real, which itself demonstrates both the skill and the ability to communicate it clearly.</li></ul>'),

      callout('note', '<p>None of this is identical to a paid job, and claiming otherwise damages trust the moment it\'s checked. But it is real, honest evidence of the same underlying things a job would demonstrate: building real things, working with other people, and following through to a finished result.</p>'),

      h(2, 'Describing This Honestly'),
      p('<p>Be accurate rather than inflating the framing. "Volunteer project" or "personal project" or "open-source contribution" are honest, specific, and interviewers respect specificity over inflated titles every time. Calling an unpaid personal project a "job" is easy to catch and, once caught, damages trust in everything else on the CV alongside it.</p>'),

      h(2, 'Why This Matters More Than It Might Seem To'),
      p('<p>Beyond filling a CV gap, this kind of work keeps skills current in exactly the way the earlier lesson on staying sharp describes, and it generates fresh, specific material to discuss in the "talking about your projects" section of an interview. It is not a lesser substitute for a real job — it is genuine evidence in its own right, and it should be treated and presented that way, confidently.</p>'),
    ],
  },
  bn: {
    title: 'কোনো চাকরি ছাড়া অভিজ্ঞতা তৈরি করা',
    metaTitle: 'কোনো চাকরি ছাড়া অভিজ্ঞতা তৈরি করা | Learn Computer Academy',
    metaDescription: 'আসল, প্রদর্শনযোগ্য অভিজ্ঞতার জন্য একটি বেতনভুক্ত job title-এর প্রয়োজন নেই। এটি তৈরি করার সুনির্দিষ্ট উপায়, আর কীভাবে সৎভাবে বর্ণনা করবেন।',
    blocks: [
      p('<p>"চাকরি পেতে আমার অভিজ্ঞতা দরকার, কিন্তু অভিজ্ঞতা পেতে আমার একটি চাকরি দরকার" একটি বন্ধ চক্রের মতো মনে হয়। এটি ঠিক তা নয় — কোনো job title সংযুক্ত ছাড়াই আসল, প্রদর্শনযোগ্য অভিজ্ঞতা তৈরির কয়েকটি প্রকৃত উপায় আছে, আর সেগুলো একটি খোঁজা চলতে থাকা অবস্থায় ফাঁকটি পূরণ করে।</p>'),

      h(2, 'এটি তৈরির প্রকৃত উপায়', 'real-ways-to-build-it'),
      p('<ul><li>একটি স্থানীয় nonprofit, একটি কমিউনিটি group, বা একটি স্কুলের জন্য <b>স্বেচ্ছাসেবী টেকনিক্যাল কাজ</b> — প্রায়ই সত্যিই দরকার আর সত্যিই প্রশংসিত, আর একটি সম্পূর্ণ আসল প্রোজেক্ট একটি আসল (বিনা-বেতনের হলেও) ক্লায়েন্টসহ।</li><li><b>Open-source অবদান</b> — এমনকি ছোটগুলোও, GitHub পাঠে কভার করা, অন্য কারো কোড আর প্রথার সাথে আসল সহযোগী অভিজ্ঞতা।</li><li>Freelancing পাঠ যেভাবে বর্ণনা করে সেই একই গুরুত্বসহকারে গণ্য করা <b>একজন বন্ধু বা পরিবারের সদস্যের আসল ছোট ব্যবসার জন্য কিছু তৈরি করা</b>।</li><li>উপলব্ধ থাকলে <b>Hackathon আর coding প্রতিযোগিতা</b> — সময়-সীমিত, সত্যিই সহযোগী, আর প্রায়ই একটি সুনির্দিষ্ট, প্রদর্শনযোগ্য ফলাফল তৈরি করে।</li><li>একা কাজ করার বদলে একসাথে কিছুতে কাজ করা <b>সহপাঠীদের সাথে একটি অধ্যয়ন বা তৈরি group</b>, যা যেকোনো একক প্রোজেক্টের চেয়ে team অভিজ্ঞতার কাছাকাছি।</li><li><b>সত্যিই কাজের টেকনিক্যাল কন্টেন্ট লেখা</b> — আপনি শেখা কিছুর একটি সৎ ব্যাখ্যা, কোথাও আসল জায়গায় প্রকাশিত, যা নিজেই দক্ষতা আর এটি স্পষ্টভাবে যোগাযোগ করার ক্ষমতা দুটোই প্রদর্শন করে।</li></ul>'),

      callout('note', '<p>এর কোনোটিই একটি বেতনভুক্ত চাকরির অভিন্ন নয়, আর অন্যরকম দাবি করা যাচাই হওয়ার মুহূর্তেই বিশ্বাসের ক্ষতি করে। কিন্তু এটি একটি চাকরি যা প্রদর্শন করত সেই একই অন্তর্নিহিত জিনিসের আসল, সৎ প্রমাণ: আসল জিনিস তৈরি করা, অন্য মানুষের সাথে কাজ করা, আর একটি শেষ ফলাফল পর্যন্ত চালিয়ে যাওয়া।</p>'),

      h(2, 'এটি সৎভাবে বর্ণনা করা', 'describing-this-honestly'),
      p('<p>ফ্রেমিং ফুলিয়ে তোলার বদলে সঠিক হন। "Volunteer project" বা "personal project" বা "open-source contribution" সৎ, নির্দিষ্ট, আর interviewer প্রতিবার ফুলিয়ে তোলা title-এর চেয়ে নির্দিষ্টতাকে সম্মান করে। একটি বিনা-বেতনের ব্যক্তিগত প্রোজেক্টকে একটি "চাকরি" বলা ধরা পড়া সহজ আর, একবার ধরা পড়লে, CV-তে এর পাশের বাকি সবকিছুতে বিশ্বাসের ক্ষতি করে।</p>'),

      h(2, 'এটি যতটা মনে হতে পারে তার চেয়ে বেশি গুরুত্বপূর্ণ কেন', 'why-this-matters-more-than-it-might-seem-to'),
      p('<p>একটি CV ফাঁক পূরণের বাইরে, এই ধরনের কাজ দক্ষতা ধারালো রাখা নিয়ে আগের পাঠ যেভাবে বর্ণনা করে ঠিক সেভাবে বর্তমান রাখে, আর এটি একটি ইন্টারভিউয়ের "আপনার প্রোজেক্ট নিয়ে কথা বলা" অংশে আলোচনার জন্য তাজা, নির্দিষ্ট উপাদান তৈরি করে। এটি একটি আসল চাকরির একটি নিকৃষ্ট বিকল্প নয় — এটি নিজের অধিকারে আসল প্রমাণ, আর এটি সেভাবেই, আত্মবিশ্বাসের সাথে, গণ্য আর উপস্থাপন করা উচিত।</p>'),
    ],
  },
})

lessons.push({
  slug: 'your-first-ninety-days',
  sortOrder: 32,
  en: {
    title: 'Your First Ninety Days',
    metaTitle: 'Your First Ninety Days in a New Developer Job | Learn Computer Academy',
    metaDescription: 'What actually matters in the first three months of a first developer job, and the expectation gaps that catch new juniors off guard.',
    blocks: [
      p('<p>Getting the offer is the end of everything this course has covered so far, and the start of an entirely different set of adjustments. The first ninety days set the tone for how a new team sees you, and a few honest expectation resets make that period considerably less disorienting.</p>'),

      h(2, 'Nobody Expects You to Contribute Meaningfully on Day One'),
      p('<p>The first weeks are mostly about the codebase, the tools, and the team being unfamiliar all at once — this is normal, expected, and not a sign of falling behind. Most teams budget real ramp-up time for a new junior precisely because they know this. Panicking about not yet being fully productive in week two is a much bigger problem than actually not being fully productive in week two.</p>'),

      img(
        'docs/img/career/first-ninety-days-1',
        'A new young employee sitting at a desk among a small team in an office, taking notes while a colleague explains something on a shared screen',
        1024, 768,
        'The first ninety days are about becoming someone the team trusts with small, well-defined tasks — not about knowing everything immediately.'
      ),

      h(2, 'What Actually Matters Early On'),
      table(
        ['What to prioritise', 'Why'],
        [
          ['Asking good questions', 'Far better than silently guessing and shipping something wrong'],
          ['Understanding before changing', 'Read and genuinely understand existing code before modifying it confidently'],
          ['Following existing conventions', 'Even ones you\'d personally do differently — consistency matters more than personal preference early on'],
          ['Being reliable on small things', 'Small, correctly finished tasks build trust faster than one ambitious, unfinished one'],
          ['Taking notes', 'You will be told the same thing only once in most teams — write it down'],
        ]
      ),

      h(2, 'Asking Questions Well'),
      p('<p>Nobody expects a new junior to know everything, but there is a real difference between a well-formed question and a vague one. "I looked at X and Y, I think it might be Z, but I\'m not sure — could you confirm?" respects the other person\'s time and shows real effort. "How does this work?" with zero attempt made first does not, and wears thin quickly on a busy team.</p>'),

      callout('tip', '<p>Keep a running list of questions and batch them where reasonable, rather than interrupting a colleague every few minutes. This is a genuine courtesy on a busy team, and it is also just a more efficient way to actually get unstuck.</p>'),

      h(2, 'Common Expectation Gaps'),
      p('<ul><li><b>Real code is messier than course code.</b> Legacy decisions, technical debt, and constraints that made sense at the time but look odd now are completely normal in any real, ongoing codebase.</li><li><b>Documentation is often incomplete or out of date.</b> Asking a person directly is frequently faster and more reliable than searching for a document that may not exist.</li><li><b>Meetings take up more time than expected.</b> This surprises almost every junior coming straight from a course.</li><li><b>Progress is genuinely slower than solo project work.</b> Coordinating with a team, working within someone else\'s existing code, and following review processes all take real time that solo work never required.</li></ul>'),

      h(2, 'The Ninety-Day Goal'),
      p('<p>Not to become an expert. To become someone the team trusts with small, well-defined tasks, who asks reasonable questions, and who is clearly still learning but visibly improving. That is a genuinely realistic bar for ninety days, and hitting it sets up everything that comes after.</p>'),
    ],
  },
  bn: {
    title: 'আপনার প্রথম নব্বই দিন',
    metaTitle: 'একটি নতুন Developer চাকরিতে আপনার প্রথম নব্বই দিন | Learn Computer Academy',
    metaDescription: 'একটি প্রথম developer চাকরির প্রথম তিন মাসে আসলে কী গুরুত্বপূর্ণ, আর প্রত্যাশার ফাঁক যা নতুন junior-দের অপ্রস্তুত করে।',
    blocks: [
      p('<p>অফার পাওয়া এই কোর্স এখন পর্যন্ত যা কভার করেছে তার শেষ, আর সম্পূর্ণ ভিন্ন এক সেট সমন্বয়ের শুরু। প্রথম নব্বই দিন একটি নতুন team আপনাকে কীভাবে দেখে তার সুর ঠিক করে, আর কয়েকটি সৎ প্রত্যাশা পুনর্বিবেচনা সেই সময়টিকে যথেষ্ট কম বিভ্রান্তিকর করে।</p>'),

      h(2, 'কেউ আপনি প্রথম দিনেই অর্থপূর্ণভাবে অবদান রাখবেন আশা করে না', 'nobody-expects-you-to-contribute-meaningfully-on-day-one'),
      p('<p>প্রথম সপ্তাহগুলো বেশিরভাগ codebase, টুল, আর team একসাথে অপরিচিত হওয়া নিয়ে — এটি স্বাভাবিক, প্রত্যাশিত, আর পিছিয়ে পড়ার চিহ্ন নয়। বেশিরভাগ team একটি নতুন junior-এর জন্য আসল ramp-up সময় বাজেট করে ঠিক এই কারণে যে তারা এটি জানে। দ্বিতীয় সপ্তাহে এখনো সম্পূর্ণ উৎপাদনশীল না হওয়া নিয়ে আতঙ্কিত হওয়া দ্বিতীয় সপ্তাহে আসলে সম্পূর্ণ উৎপাদনশীল না হওয়ার চেয়ে অনেক বড় সমস্যা।</p>'),

      img(
        'docs/img/career/first-ninety-days-1',
        'একজন নতুন তরুণ কর্মী অফিসে একটি ছোট team-এর মধ্যে একটি ডেস্কে বসে আছেন, একজন সহকর্মী একটি শেয়ার করা স্ক্রিনে কিছু ব্যাখ্যা করার সময় নোট নিচ্ছেন',
        1024, 768,
        'প্রথম নব্বই দিন সাথে সাথে সবকিছু জানা নিয়ে নয় — এমন কেউ হয়ে ওঠা নিয়ে যাকে team ছোট, ভালোভাবে সংজ্ঞায়িত কাজ দিয়ে বিশ্বাস করে।'
      ),

      h(2, 'শুরুতে আসলে কী গুরুত্বপূর্ণ', 'what-actually-matters-early-on'),
      table(
        ['কী অগ্রাধিকার দেবেন', 'কেন'],
        [
          ['ভালো প্রশ্ন জিজ্ঞাসা করা', 'চুপচাপ অনুমান করে ভুল কিছু ship করার চেয়ে অনেক ভালো'],
          ['বদলানোর আগে বোঝা', 'আত্মবিশ্বাসের সাথে পরিবর্তনের আগে বিদ্যমান কোড পড়ুন আর সত্যিই বুঝুন'],
          ['বিদ্যমান প্রথা অনুসরণ করা', 'ব্যক্তিগতভাবে ভিন্নভাবে করতেন এমনগুলোও — শুরুতে ব্যক্তিগত পছন্দের চেয়ে ধারাবাহিকতা বেশি গুরুত্বপূর্ণ'],
          ['ছোট জিনিসে নির্ভরযোগ্য হওয়া', 'ছোট, সঠিকভাবে শেষ করা কাজ একটি উচ্চাভিলাষী, অসম্পূর্ণ একটির চেয়ে দ্রুত বিশ্বাস গড়ে'],
          ['নোট নেওয়া', 'বেশিরভাগ team-এ আপনাকে একই জিনিস শুধু একবার বলা হবে — এটি লিখে রাখুন'],
        ]
      ),

      h(2, 'ভালোভাবে প্রশ্ন জিজ্ঞাসা করা', 'asking-questions-well'),
      p('<p>কেউ একজন নতুন junior সবকিছু জানবে আশা করে না, কিন্তু একটি ভালোভাবে গঠিত প্রশ্ন আর একটি অস্পষ্ট প্রশ্নের মধ্যে একটি আসল পার্থক্য আছে। "I looked at X and Y, I think it might be Z, but I\'m not sure — could you confirm?" অন্য ব্যক্তির সময়কে সম্মান করে আর আসল পরিশ্রম দেখায়। "How does this work?" প্রথমে কোনো চেষ্টা ছাড়াই তা করে না, আর একটি ব্যস্ত team-এ দ্রুত ক্ষয় হয়।</p>'),

      callout('tip', '<p>প্রতি কয়েক মিনিটে একজন সহকর্মীকে বাধা দেওয়ার বদলে প্রশ্নের একটি চলমান তালিকা রাখুন আর যুক্তিসঙ্গত হলে সেগুলো একসাথে করুন। এটি একটি ব্যস্ত team-এ একটি আসল সৌজন্য, আর এটি আসলে আটকে থাকা থেকে বেরোনোর একটি বেশি দক্ষ উপায়ও।</p>'),

      h(2, 'সাধারণ প্রত্যাশার ফাঁক', 'common-expectation-gaps'),
      p('<ul><li><b>আসল কোড কোর্স কোডের চেয়ে এলোমেলো।</b> Legacy সিদ্ধান্ত, technical debt, আর সেই সময় অর্থপূর্ণ ছিল কিন্তু এখন অদ্ভুত দেখায় এমন সীমাবদ্ধতা যেকোনো আসল, চলমান codebase-এ সম্পূর্ণ স্বাভাবিক।</li><li><b>ডকুমেন্টেশন প্রায়ই অসম্পূর্ণ বা সেকেলে।</b> সরাসরি একজন ব্যক্তিকে জিজ্ঞাসা করা প্রায়ই হয়তো নেই এমন একটি ডকুমেন্ট খোঁজার চেয়ে দ্রুত আর বেশি নির্ভরযোগ্য।</li><li><b>মিটিং প্রত্যাশার চেয়ে বেশি সময় নেয়।</b> এটি একটি কোর্স থেকে সরাসরি আসা প্রায় প্রতিটি junior-কে অবাক করে।</li><li><b>অগ্রগতি একক প্রোজেক্ট কাজের চেয়ে সত্যিই ধীর।</b> একটি team-এর সাথে সমন্বয় করা, অন্য কারো বিদ্যমান কোডের মধ্যে কাজ করা, আর review প্রক্রিয়া অনুসরণ করা সবই আসল সময় নেয় যা একক কাজে কখনো লাগত না।</li></ul>'),

      h(2, 'নব্বই-দিনের লক্ষ্য', 'the-ninety-day-goal'),
      p('<p>একজন বিশেষজ্ঞ হওয়া নয়। এমন কেউ হওয়া যাকে team ছোট, ভালোভাবে সংজ্ঞায়িত কাজ দিয়ে বিশ্বাস করে, যে যুক্তিসঙ্গত প্রশ্ন জিজ্ঞাসা করে, আর যে স্পষ্টভাবে এখনো শিখছে কিন্তু দৃশ্যত উন্নতি করছে। নব্বই দিনের জন্য এটি একটি সত্যিই বাস্তবসম্মত মান, আর এতে পৌঁছানো এরপরের সবকিছু সাজিয়ে দেয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'working-in-a-team-and-code-review',
  sortOrder: 33,
  en: {
    title: 'Working in a Team and Taking Code Review',
    metaTitle: 'Working in a Team and Taking Code Review | Learn Computer Academy',
    metaDescription: 'Code review is constant once you have a job, and how you handle it is one of the most closely watched things about a new junior.',
    blocks: [
      p('<p>Course projects are usually solo. A real job almost never is. Code review specifically — someone else reading and critiquing your code before it ships — happens constantly, and how a new junior handles it is one of the most closely watched signals on a team, often more closely watched than raw coding ability itself.</p>'),

      h(2, 'What Code Review Actually Is'),
      p('<p>Code review is not personal criticism, whatever it might feel like the first few times. Its actual purpose is catching bugs before they reach real users, keeping a shared codebase consistent enough that anyone can work in any part of it, and spreading knowledge across a team rather than leaving it locked in one person\'s head. Comments on your code are about the code, not a judgment of you as a person or a developer.</p>'),

      h(2, 'Receiving Feedback Well'),
      p('<ul><li><b>Do not take it personally</b>, even when the instinct is strong, especially the first few times.</li><li><b>Ask if something is unclear</b>, rather than guessing at what a comment meant and possibly implementing the wrong fix.</li><li><b>Say thank you</b>, genuinely — someone spent real time reading your code carefully, which is a form of investment in you, not an attack.</li><li><b>Do not argue defensively.</b> If you disagree, ask a genuine question or explain your reasoning calmly — it is completely fine to disagree, but the tone of disagreement is what gets noticed and remembered.</li><li><b>Apply what you learn from it going forward</b> — the same comment appearing repeatedly across reviews is the clearest possible signal of what to actually change.</li></ul>'),

      callout('warning', '<p>The single most damaging reaction to a review comment is visible defensiveness — arguing, getting quiet and sullen, or making the same mistake again to prove a point. This is watched far more closely than any individual coding mistake, because it directly predicts what working with you day to day will actually feel like.</p>', 'How you react is watched closely'),

      h(2, 'Giving Feedback, Eventually'),
      p('<p>As a junior you will likely review someone else\'s code at some point too, even early on. Be specific rather than vague, explain the reasoning behind a suggestion rather than issuing a bare correction, and separate genuine problems from matters of pure personal style — not every difference from how you\'d have written it is actually wrong.</p>'),

      h(2, 'Working in a Team Beyond Review'),
      p('<p>Communicate proactively when you\'re stuck, rather than silently struggling for hours before anyone else even knows there\'s a problem. Update the team on progress without being asked. Ask before making a large or unexpected change to something shared. None of this is about being unusually social — it is about making yourself easy to work alongside, which is a specific, learnable, practical skill in its own right, not a personality trait you either have or don\'t.</p>'),
    ],
  },
  bn: {
    title: 'একটি Team-এ কাজ করা আর Code Review নেওয়া',
    metaTitle: 'একটি Team-এ কাজ করা আর Code Review নেওয়া | Learn Computer Academy',
    metaDescription: 'একটি চাকরি হয়ে গেলে Code review ক্রমাগত হয়, আর আপনি এটি কীভাবে সামলান তা একজন নতুন junior সম্পর্কে সবচেয়ে ঘনিষ্ঠভাবে লক্ষ্য করা জিনিসগুলোর একটি।',
    blocks: [
      p('<p>কোর্স প্রোজেক্ট সাধারণত একক। একটি আসল চাকরি প্রায় কখনো নয়। বিশেষভাবে Code review — কেউ এটি ship হওয়ার আগে আপনার কোড পড়ে আর সমালোচনা করে — ক্রমাগত ঘটে, আর একজন নতুন junior এটি কীভাবে সামলায় তা একটি team-এ সবচেয়ে ঘনিষ্ঠভাবে লক্ষ্য করা সংকেতগুলোর একটি, প্রায়ই কাঁচা coding সক্ষমতার চেয়েও বেশি ঘনিষ্ঠভাবে লক্ষ্য করা।</p>'),

      h(2, 'Code Review আসলে কী', 'what-code-review-actually-is'),
      p('<p>Code review প্রথম কয়েকবার যেমনই মনে হোক ব্যক্তিগত সমালোচনা নয়। এর আসল উদ্দেশ্য বাস্তব ব্যবহারকারীদের কাছে পৌঁছানোর আগে bug ধরা, একটি শেয়ার করা codebase-কে যথেষ্ট ধারাবাহিক রাখা যাতে যে কেউ এর যেকোনো অংশে কাজ করতে পারে, আর একজন ব্যক্তির মাথায় আটকে রাখার বদলে একটি team জুড়ে জ্ঞান ছড়ানো। আপনার কোডে মন্তব্য কোড সম্পর্কে, একজন ব্যক্তি বা একজন developer হিসেবে আপনার একটি রায় নয়।</p>'),

      h(2, 'Feedback ভালোভাবে গ্রহণ করা', 'receiving-feedback-well'),
      p('<ul><li><b>এটি ব্যক্তিগতভাবে নেবেন না</b>, প্রবৃত্তি শক্তিশালী হলেও, বিশেষত প্রথম কয়েকবার।</li><li>একটি মন্তব্যের অর্থ কী তা অনুমান করে সম্ভবত ভুল সমাধান প্রয়োগ করার বদলে <b>কিছু অস্পষ্ট হলে জিজ্ঞাসা করুন</b>।</li><li><b>ধন্যবাদ বলুন</b>, সত্যিই — কেউ আপনার কোড সাবধানে পড়তে আসল সময় দিয়েছে, যা আপনার প্রতি একধরনের বিনিয়োগ, একটি আক্রমণ নয়।</li><li><b>আত্মপক্ষ-সমর্থনমূলকভাবে তর্ক করবেন না।</b> দ্বিমত করলে, একটি প্রকৃত প্রশ্ন জিজ্ঞাসা করুন বা শান্তভাবে আপনার যুক্তি ব্যাখ্যা করুন — দ্বিমত করা সম্পূর্ণ ঠিক আছে, কিন্তু দ্বিমতের সুরটিই লক্ষ্য করা আর মনে রাখা হয়।</li><li><b>সামনে এগিয়ে এটি থেকে যা শেখেন তা প্রয়োগ করুন</b> — review জুড়ে বারবার দেখা যাওয়া একই মন্তব্য আসলে কী বদলাতে হবে তার সবচেয়ে স্পষ্ট সম্ভাব্য সংকেত।</li></ul>'),

      callout('warning', '<p>একটি review মন্তব্যের সবচেয়ে ক্ষতিকর প্রতিক্রিয়া হলো দৃশ্যমান আত্মপক্ষ-সমর্থন — তর্ক করা, চুপ আর গোমড়ামুখো হয়ে যাওয়া, বা একটি বিষয় প্রমাণ করতে আবার একই ভুল করা। যেকোনো একক coding ভুলের চেয়ে এটি অনেক বেশি ঘনিষ্ঠভাবে লক্ষ্য করা হয়, কারণ এটি সরাসরি ভবিষ্যদ্বাণী করে দৈনন্দিন আপনার সাথে কাজ করা আসলে কেমন লাগবে।</p>', 'আপনি কীভাবে প্রতিক্রিয়া দেন তা ঘনিষ্ঠভাবে লক্ষ্য করা হয়'),

      h(2, 'শেষে, Feedback দেওয়া', 'giving-feedback-eventually'),
      p('<p>একজন junior হিসেবে আপনি সম্ভবত কোনো এক সময় অন্য কারো কোডও review করবেন, শুরুতেই হলেও। অস্পষ্টের বদলে নির্দিষ্ট হন, একটি বেয়ার সংশোধন দেওয়ার বদলে একটি পরামর্শের পেছনের যুক্তি ব্যাখ্যা করুন, আর আসল সমস্যাকে বিশুদ্ধ ব্যক্তিগত স্টাইলের বিষয় থেকে আলাদা করুন — আপনি যেভাবে লিখতেন তার থেকে প্রতিটি পার্থক্য আসলে ভুল নয়।</p>'),

      h(2, 'Review-এর বাইরে একটি Team-এ কাজ করা', 'working-in-a-team-beyond-review'),
      p('<p>আপনি আটকে গেলে সক্রিয়ভাবে যোগাযোগ করুন, অন্য কেউ একটি সমস্যা আছে জানার আগে ঘণ্টার পর ঘণ্টা চুপচাপ সংগ্রাম করার বদলে। জিজ্ঞাসা করা ছাড়াই team-কে অগ্রগতি সম্পর্কে আপডেট করুন। শেয়ার করা কিছুতে একটি বড় বা অপ্রত্যাশিত পরিবর্তন করার আগে জিজ্ঞাসা করুন। এর কোনোটিই অস্বাভাবিকভাবে সামাজিক হওয়া নিয়ে নয় — এটি নিজেকে সাথে কাজ করা সহজ করা নিয়ে, যা নিজের অধিকারে একটি নির্দিষ্ট, শেখার যোগ্য, ব্যবহারিক দক্ষতা, একটি ব্যক্তিত্বের বৈশিষ্ট্য নয় যা আপনার হয় আছে নয় নেই।</p>'),
    ],
  },
})

lessons.push({
  slug: 'growing-out-of-junior',
  sortOrder: 34,
  en: {
    title: 'Growing Out of Junior — Where This Leaves You',
    metaTitle: 'Growing Out of Junior — Where This Leaves You | Learn Computer Academy',
    metaDescription: 'A recap of this course, what actually signals readiness for the next level, and the one idea worth carrying forward above all the others.',
    blocks: [
      p('<p>This course covered a lot of ground: proof of work, applying, interviews at their hardest moments, rejection, freelancing, and the first months on a job. This lesson closes it by looking at what comes after "junior" — and pulling together the one idea that actually mattered across every earlier lesson.</p>'),

      h(2, 'What Actually Signals Growing Out of Junior'),
      p('<ul><li><b>Needing less guidance</b> on tasks similar to ones you\'ve done before.</li><li><b>Anticipating problems</b> before they happen, rather than only reacting once they do.</li><li><b>Giving other people useful feedback</b>, not just receiving it.</li><li><b>Making sound decisions independently</b>, and being trusted with genuinely ambiguous tasks rather than only clearly-specified ones.</li><li><b>Helping newer juniors</b> — the clearest visible sign a team actually notices and remembers.</li></ul><p>None of this happens on a fixed timeline. It happens through consistent, deliberate practice on real work — which is exactly what the first ninety days, handled well, sets in motion.</p>'),

      h(2, 'The Course in One Paragraph'),
      p('<p>Skills alone rarely get you hired — proof of that skill does. Applying well beats applying often. Interviews reward honesty about what you don\'t know far more than they reward confident guessing. Rejection is the statistically normal outcome of the process, not a verdict on your worth, and it is survivable and, eventually, past. Freelance and volunteer work are genuine routes in, not lesser consolation prizes. And once you\'re in, staying humble and easy to work alongside matters just as much as writing good code.</p>'),

      h(2, 'The One Idea Worth Carrying Forward'),
      callout('note', '<p><b>Honesty consistently outperforms performance.</b> Honest about what you know and don\'t. Honest in how you describe your projects. Honest about needing help. Honest with yourself about where you actually stand. Every single lesson in this course, in one form or another, comes back to this same idea — it is the one piece of advice from this entire course worth remembering if nothing else is.</p>', 'If you remember one thing from this course'),

      h(2, 'Where to Go From Here'),
      table(
        ['Course', 'How it connects'],
        [
          ['Your technical courses', 'Keep building — the portfolio and skills sections of this course only work if there is ongoing real material behind them'],
          ['<a href="/marketing/">Digital Marketing</a>', 'Directly useful if freelancing — finding clients, pricing, and presenting your work professionally'],
          ['<a href="/seo/">SEO</a>', 'Relevant if you ever build and want people to actually find your own portfolio site'],
        ]
      ),

      h(2, 'A Genuinely Honest Closing Note'),
      p('<p>This process is hard, it takes longer than anyone would like, and it does not always feel fair while you\'re in the middle of it. That is a real, accurate description of it — not a reason to expect it won\'t work out. Almost everyone who eventually succeeds at this went through a version of everything covered in this course: the uncertainty, the rejections, the moments of doubting the whole thing. What separates the people who get there from the people who don\'t is mostly whether they kept going through that stretch, not whether they skipped it entirely. Nobody skips it entirely.</p>'),
    ],
  },
  bn: {
    title: 'Junior থেকে বেড়ে ওঠা — এখান থেকে আপনি কোথায়',
    metaTitle: 'Junior থেকে বেড়ে ওঠা — এখান থেকে আপনি কোথায় | Learn Computer Academy',
    metaDescription: 'এই কোর্সের একটি সারসংক্ষেপ, প্রস্তুতির আসল সংকেত কী, আর বাকি সবকিছুর উপরে বহন করার যোগ্য একটি ধারণা।',
    blocks: [
      p('<p>এই কোর্সটি অনেক এলাকা কভার করেছে: কাজের প্রমাণ, আবেদন, তাদের সবচেয়ে কঠিন মুহূর্তে ইন্টারভিউ, প্রত্যাখ্যান, freelancing, আর একটি চাকরির প্রথম কয়েক মাস। এই পাঠটি "junior"-এর পরে কী আসে তা দেখে এটি বন্ধ করে — আর প্রতিটি আগের পাঠ জুড়ে আসলে যে একটি ধারণা গুরুত্বপূর্ণ ছিল তা একত্র করে।</p>'),

      h(2, 'Junior থেকে বেড়ে ওঠার আসল সংকেত কী', 'what-actually-signals-growing-out-of-junior'),
      p('<p><ul><li>আগে করা কাজের মতো কাজে <b>কম নির্দেশনার প্রয়োজন</b>।</li><li>ঘটার পরে শুধু প্রতিক্রিয়া দেওয়ার বদলে ঘটার আগে <b>সমস্যা পূর্বাভাস দেওয়া</b>।</li><li>শুধু গ্রহণ নয়, <b>অন্য মানুষকে কাজের feedback দেওয়া</b>।</li><li><b>স্বাধীনভাবে সঠিক সিদ্ধান্ত নেওয়া</b>, আর শুধু স্পষ্টভাবে নির্দিষ্ট করা কাজের বদলে সত্যিই অস্পষ্ট কাজে বিশ্বাস করা।</li><li><b>নতুন junior-দের সাহায্য করা</b> — একটি team আসলে লক্ষ্য করে আর মনে রাখে এমন সবচেয়ে স্পষ্ট দৃশ্যমান চিহ্ন।</li></ul></p><p>এর কোনোটিই একটি নির্দিষ্ট সময়সূচিতে ঘটে না। এটি ঘটে আসল কাজে ধারাবাহিক, ইচ্ছাকৃত অনুশীলনের মাধ্যমে — যা ঠিক ভালোভাবে সামলানো প্রথম নব্বই দিন গতিতে আনে।</p>'),

      h(2, 'এক অনুচ্ছেদে কোর্সটি', 'the-course-in-one-paragraph'),
      p('<p>শুধু দক্ষতা খুব কমই আপনাকে নিয়োগ পাইয়ে দেয় — সেই দক্ষতার প্রমাণ দেয়। বেশি আবেদন করা ভালোভাবে আবেদন করাকে হারায় না, ভালোভাবে আবেদন করা প্রায়ই বেশি আবেদনকে হারায়। ইন্টারভিউ আত্মবিশ্বাসী অনুমানের চেয়ে আপনি কী জানেন না তা নিয়ে সততাকে অনেক বেশি পুরস্কৃত করে। প্রত্যাখ্যান প্রক্রিয়ার পরিসংখ্যানগতভাবে স্বাভাবিক ফলাফল, আপনার মূল্যের উপর একটি রায় নয়, আর এটি টিকে থাকার যোগ্য আর, শেষে, অতীত। Freelance আর স্বেচ্ছাসেবী কাজ প্রকৃত পথ, নিকৃষ্ট সান্ত্বনা পুরস্কার নয়। আর একবার আপনি ভেতরে থাকলে, নম্র আর সাথে কাজ করা সহজ থাকা ভালো কোড লেখার মতোই গুরুত্বপূর্ণ।</p>'),

      h(2, 'বহন করার যোগ্য একটি ধারণা', 'the-one-idea-worth-carrying-forward'),
      callout('note', '<p><b>সততা ধারাবাহিকভাবে অভিনয়কে হারায়।</b> আপনি কী জানেন আর জানেন না তা নিয়ে সৎ। আপনার প্রোজেক্ট কীভাবে বর্ণনা করেন তাতে সৎ। সাহায্যের প্রয়োজন নিয়ে সৎ। আপনি আসলে কোথায় আছেন তা নিয়ে নিজের সাথে সৎ। এই কোর্সের প্রতিটি একক পাঠ, কোনো না কোনো রূপে, এই একই ধারণায় ফিরে আসে — আর কিছু না হলেও এই সম্পূর্ণ কোর্স থেকে মনে রাখার যোগ্য একটি পরামর্শ এটিই।</p>', 'এই কোর্স থেকে একটি জিনিস মনে রাখলে'),

      h(2, 'এখান থেকে কোথায় যাবেন', 'where-to-go-from-here'),
      table(
        ['কোর্স', 'এটি কীভাবে সংযুক্ত'],
        [
          ['আপনার টেকনিক্যাল কোর্স', 'তৈরি করতে থাকুন — এই কোর্সের portfolio আর দক্ষতা অংশ শুধু তখনই কাজ করে যখন এর পেছনে চলমান আসল উপাদান থাকে'],
          ['<a href="/bn/marketing/">Digital Marketing</a>', 'Freelancing করলে সরাসরি কাজের — ক্লায়েন্ট খোঁজা, দাম ঠিক করা, আর পেশাদারভাবে আপনার কাজ উপস্থাপন করা'],
          ['<a href="/bn/seo/">SEO</a>', 'আপনি কখনো তৈরি করলে আর মানুষ আসলে আপনার নিজের portfolio সাইট খুঁজে পাক চাইলে প্রাসঙ্গিক'],
        ]
      ),

      h(2, 'একটি সত্যিই সৎ সমাপনী নোট', 'a-genuinely-honest-closing-note'),
      p('<p>এই প্রক্রিয়াটি কঠিন, এটি যে কারো পছন্দের চেয়ে বেশি সময় নেয়, আর আপনি এর মাঝখানে থাকা অবস্থায় এটি সবসময় ন্যায্য মনে হয় না। এটি এর একটি আসল, সঠিক বর্ণনা — এটি কাজ হবে না প্রত্যাশা করার একটি কারণ নয়। এতে শেষে সফল হওয়া প্রায় সবাই এই কোর্সে কভার করা সবকিছুর একটি সংস্করণের মধ্য দিয়ে গেছে: অনিশ্চয়তা, প্রত্যাখ্যান, পুরো বিষয়টি সন্দেহ করার মুহূর্ত। যারা সেখানে পৌঁছায় আর যারা পৌঁছায় না তাদের মধ্যে যা আলাদা করে তা বেশিরভাগ তারা সেই সময়টার মধ্য দিয়ে চালিয়ে গেছে কিনা, তারা এটি সম্পূর্ণ এড়িয়ে গেছে কিনা তা নয়। কেউ এটি সম্পূর্ণ এড়িয়ে যায় না।</p>'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'career').single()
  if (catErr || !category) {
    console.error('Category "career" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] career/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] career/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `career/${lesson.slug}`
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

    const { data: existingDoc } = await supabase.from('docs').select('id').eq('path', path).maybeSingle()
    let docId = existingDoc?.id
    if (existingDoc) {
      const { error } = await supabase.from('docs').update(row).eq('id', existingDoc.id)
      if (error) { console.error(`FAIL docs update ${path}:`, error.message); continue }
    } else {
      const { data: inserted, error } = await supabase.from('docs').insert(row).select('id').single()
      if (error) { console.error(`FAIL docs insert ${path}:`, error.message); continue }
      docId = inserted.id
    }

    const trRow = {
      doc_id: docId,
      locale: 'bn',
      title: lesson.bn.title,
      meta_title: lesson.bn.metaTitle,
      meta_description: lesson.bn.metaDescription,
      blocks: lesson.bn.blocks,
      toc: toc(lesson.bn.blocks),
    }
    const { data: existingTr } = await supabase.from('doc_translations').select('id').eq('doc_id', docId).eq('locale', 'bn').maybeSingle()
    if (existingTr) {
      const { error } = await supabase.from('doc_translations').update(trRow).eq('id', existingTr.id)
      if (error) { console.error(`FAIL translation update ${path}:`, error.message); continue }
    } else {
      const { error } = await supabase.from('doc_translations').insert(trRow)
      if (error) { console.error(`FAIL translation insert ${path}:`, error.message); continue }
    }

    console.log(`OK ${path}`)
  }

  console.log('\nDone.')
}

main()
