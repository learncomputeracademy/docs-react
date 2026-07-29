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

lessons.push({
  slug: 'generations-of-computers',
  sortOrder: 2,
  en: {
    title: 'Generations of Computers',
    metaTitle: 'Generations of Computers | Learn Computer Academy',
    metaDescription: 'How computers evolved through five generations — from room-sized vacuum-tube machines to today\'s AI-capable systems — and what defined each one.',
    blocks: [
      p('<p>Computers have not always looked or worked the way they do today. Historians and engineers group the evolution of computers into five broad "generations," each defined by the core technology used to build the machine\'s circuitry. Understanding these generations explains why a phone in your pocket today is more powerful than a machine that once filled an entire room.</p>'),

      h(2, 'First Generation (1940s-1950s): Vacuum Tubes'),
      p('<p>The earliest electronic computers used <b>vacuum tubes</b> to store and process information. A vacuum tube worked like an early electronic switch, but each one was roughly the size of a light bulb, generated a large amount of heat, and burned out often. As a result, first-generation computers were enormous — often filling an entire room — extremely expensive to build and run, and prone to breaking down.</p><p>Programs were entered using <b>punch cards</b>, and results came out on printouts; there were no keyboards or screens as we know them. <b>ENIAC</b>, completed in 1945, is one of the best-known examples, and used thousands of vacuum tubes.</p>'),

      h(2, 'Second Generation (1950s-1960s): Transistors'),
      p('<p>The invention of the <b>transistor</b> replaced the bulky vacuum tube with a much smaller, more reliable electronic switch. Transistors used far less power, produced far less heat, and rarely failed compared to vacuum tubes — which meant computers could shrink significantly while becoming faster and more dependable at the same time.</p><p>This generation also introduced early <b>programming languages</b> that were closer to English than raw machine instructions, making it easier for people to write software without working directly with a machine\'s internal wiring.</p>'),

      h(2, 'Third Generation (1960s-1970s): Integrated Circuits'),
      p('<p>Engineers found a way to place many transistors onto a single small chip of silicon, called an <b>integrated circuit</b>. Instead of wiring together thousands of individual transistors by hand, a single chip could now do the work of many — shrinking computers further, dropping their cost, and improving their reliability at the same time.</p><p>This is also the generation where computers first became something an operator could interact with directly, using a <b>keyboard</b> and a <b>monitor</b>, rather than only punch cards and printouts.</p>'),

      h(2, 'Fourth Generation (1970s-Present): Microprocessors'),
      p('<p>The fourth generation arrived when engineers managed to fit an entire <b>processor</b> — the "brain" of a computer — onto one single chip, called a <b>microprocessor</b>. This was the breakthrough that made the <b>personal computer</b> possible: a computer small and affordable enough to sit on a desk, or eventually a lap, instead of filling a room.</p><p>Nearly every computer you interact with today — desktops, laptops, smartphones, tablets, and even smart appliances — is a product of this generation, which is still ongoing. What has changed since the 1970s is not the basic idea of a microprocessor, but how much smaller, faster, and more power-efficient each new chip becomes.</p>'),

      h(2, 'Fifth Generation (Present and Beyond): Artificial Intelligence'),
      p('<p>The fifth generation does not have a single, agreed starting point the way earlier generations do, because it is defined less by a specific physical part and more by a shift in what computers are being built to do: understand natural language, recognize images and speech, and make decisions using techniques from <b>artificial intelligence</b>. You will look at this generation\'s ideas in much more depth later in this section.</p>'),

      h(2, 'At a Glance'),
      p('<p>Here\'s the same story, compressed into one table:</p>'),
      table(
        ['Generation', 'Approximate Period', 'Core Technology', 'Example'],
        [
          ['First', '1940s – 1950s', 'Vacuum tubes', 'ENIAC'],
          ['Second', '1950s – 1960s', 'Transistors', 'IBM 1401'],
          ['Third', '1960s – 1970s', 'Integrated circuits', 'IBM System/360'],
          ['Fourth', '1970s – present', 'Microprocessors', 'Personal computers, smartphones'],
          ['Fifth', 'Present and beyond', 'Artificial intelligence', 'Voice assistants, AI systems'],
        ]
      ),
      img(
        'docs/img/basics/generations-of-computers-1',
        'Timeline diagram showing the five generations of computers, from vacuum tubes through transistors, integrated circuits, and microprocessors, to artificial intelligence',
        1344, 752,
        'Each generation is defined by the core technology used to build it, not by a hard cutoff date.'
      ),

      callout('note', '<p>Different textbooks give slightly different start and end years for each generation, and there was never a single day the world switched from one to the next — the technologies overlapped for years while older machines were phased out. Treat the years above as a rough guide to the order things happened, not an exact boundary.</p>', 'The years are approximate, not exact cutoffs'),

      p('<p>Each generation\'s story is really the same idea repeated: fit more computing power into less space, using less electricity, at a lower cost. The next lesson looks at what a computer is actually made of today — the physical hardware inside the machines this history produced.</p>'),
    ],
  },
  bn: {
    title: 'কম্পিউটারের প্রজন্মসমূহ',
    metaTitle: 'কম্পিউটারের প্রজন্মসমূহ | Learn Computer Academy',
    metaDescription: 'ভ্যাকুয়াম টিউব দিয়ে তৈরি ঘর-ভর্তি যন্ত্র থেকে শুরু করে আজকের AI-সক্ষম সিস্টেম পর্যন্ত — কম্পিউটার কীভাবে পাঁচটি প্রজন্মের মধ্য দিয়ে বিবর্তিত হয়েছে, আর প্রতিটি প্রজন্মকে কী আলাদা করে তার পরিচিতি।',
    blocks: [
      p('<p>কম্পিউটার সবসময় আজকের মতো দেখতে বা কাজ করত না। ইতিহাসবিদ আর ইঞ্জিনিয়াররা কম্পিউটারের বিবর্তনকে পাঁচটি বড় "প্রজন্মে" ভাগ করেন, প্রতিটি প্রজন্ম নির্ধারিত হয় যন্ত্রের সার্কিট তৈরিতে ব্যবহৃত মূল প্রযুক্তি দিয়ে। এই প্রজন্মগুলো বুঝলে বোঝা যায় কেন আপনার পকেটের ফোনটি একসময় পুরো একটি ঘর জুড়ে থাকা যন্ত্রের চেয়েও বেশি শক্তিশালী।</p>'),

      h(2, 'প্রথম প্রজন্ম (1940-এর দশক-1950-এর দশক): ভ্যাকুয়াম টিউব', 'first-generation-1940s-1950s-vacuum-tubes'),
      p('<p>প্রথম দিকের ইলেকট্রনিক কম্পিউটারগুলো তথ্য জমা রাখতে আর প্রসেস করতে <b>ভ্যাকুয়াম টিউব</b> ব্যবহার করত। একটি ভ্যাকুয়াম টিউব একটি প্রাথমিক ইলেকট্রনিক সুইচের মতো কাজ করত, কিন্তু প্রতিটির আকার প্রায় একটি বাল্বের সমান ছিল, প্রচুর তাপ তৈরি করত, আর প্রায়ই নষ্ট হয়ে যেত। ফলে প্রথম-প্রজন্মের কম্পিউটার ছিল বিশাল আকারের — প্রায়ই একটি সম্পূর্ণ ঘর জুড়ে থাকত — তৈরি ও চালাতে অত্যন্ত ব্যয়বহুল, আর ঘনঘন খারাপ হয়ে যেত।</p><p>প্রোগ্রাম ইনপুট দেওয়া হতো <b>পাঞ্চ কার্ড</b> দিয়ে, আর ফলাফল বের হতো প্রিন্টআউটে — আজকের মতো কীবোর্ড বা স্ক্রিন তখন ছিল না। <b>ENIAC</b>, যা 1945 সালে সম্পন্ন হয়, এর অন্যতম সুপরিচিত উদাহরণ, যাতে হাজার হাজার ভ্যাকুয়াম টিউব ব্যবহার করা হয়েছিল।</p>'),

      h(2, 'দ্বিতীয় প্রজন্ম (1950-এর দশক-1960-এর দশক): ট্রানজিস্টর', 'second-generation-1950s-1960s-transistors'),
      p('<p><b>ট্রানজিস্টর</b>-এর আবিষ্কার ভারী ভ্যাকুয়াম টিউবের জায়গায় নিয়ে এলো অনেক ছোট আর অনেক বেশি নির্ভরযোগ্য একটি ইলেকট্রনিক সুইচ। ট্রানজিস্টর অনেক কম পাওয়ার খরচ করত, অনেক কম তাপ তৈরি করত, আর ভ্যাকুয়াম টিউবের তুলনায় খুব কমই নষ্ট হতো — যার মানে কম্পিউটার একই সাথে অনেক ছোট, দ্রুত, আর নির্ভরযোগ্য হয়ে উঠতে পারল।</p><p>এই প্রজন্মেই এলো প্রাথমিক প্রোগ্রামিং ভাষা, যা যন্ত্রের সরাসরি নির্দেশাবলীর চেয়ে ইংরেজির অনেক কাছাকাছি ছিল, ফলে মানুষের পক্ষে যন্ত্রের ভেতরের ওয়্যারিং নিয়ে সরাসরি কাজ না করেই সফটওয়্যার লেখা সহজ হয়ে গেল।</p>'),

      h(2, 'তৃতীয় প্রজন্ম (1960-এর দশক-1970-এর দশক): ইন্টিগ্রেটেড সার্কিট', 'third-generation-1960s-1970s-integrated-circuits'),
      p('<p>ইঞ্জিনিয়াররা এমন একটি উপায় খুঁজে বের করলেন যাতে অনেকগুলো ট্রানজিস্টর সিলিকনের একটি ছোট চিপের উপর বসানো যায়, যাকে বলা হয় <b>ইন্টিগ্রেটেড সার্কিট</b>। হাজার হাজার আলাদা ট্রানজিস্টর হাতে জোড়া লাগানোর বদলে, এখন একটি মাত্র চিপ অনেকগুলোর কাজ করতে পারত — এতে কম্পিউটার আরও ছোট হলো, খরচ কমল, আর নির্ভরযোগ্যতাও একই সাথে বাড়ল।</p><p>এই প্রজন্মেই কম্পিউটার প্রথমবারের মতো এমন কিছু হয়ে উঠল যার সাথে একজন অপারেটর সরাসরি মিথস্ক্রিয়া করতে পারতেন — <b>কীবোর্ড</b> আর <b>মনিটর</b> ব্যবহার করে, শুধু পাঞ্চ কার্ড আর প্রিন্টআউটের বদলে।</p>'),

      h(2, 'চতুর্থ প্রজন্ম (1970-এর দশক-বর্তমান): মাইক্রোপ্রসেসর', 'fourth-generation-1970s-present-microprocessors'),
      p('<p>চতুর্থ প্রজন্ম এলো যখন ইঞ্জিনিয়াররা একটি সম্পূর্ণ <b>প্রসেসর</b> — কম্পিউটারের "মস্তিষ্ক" — একটি মাত্র চিপে বসাতে সক্ষম হলেন, যাকে বলা হয় <b>মাইক্রোপ্রসেসর</b>। এটাই ছিল সেই যুগান্তকারী আবিষ্কার যা <b>পার্সোনাল কম্পিউটার</b>-কে সম্ভব করে তুলল — এমন একটি কম্পিউটার যা একটি ঘর জুড়ে না থেকে একটি ডেস্কে, এমনকি পরবর্তীতে একটি কোলে বসার মতো ছোট আর সাশ্রয়ী হয়ে উঠল।</p><p>আজ আপনি যে প্রায় প্রতিটি কম্পিউটারের সাথে কাজ করেন — ডেস্কটপ, ল্যাপটপ, স্মার্টফোন, ট্যাবলেট, এমনকি স্মার্ট যন্ত্রপাতি — সবই এই এখনও-চলমান প্রজন্মের ফসল। 1970-এর দশক থেকে যা বদলেছে তা মাইক্রোপ্রসেসরের মূল ধারণা নয়, বরং প্রতিটি নতুন চিপ কতটা ছোট, দ্রুত, আর কম বিদ্যুৎ খরচ করে তৈরি হচ্ছে, সেটাই।</p>'),

      h(2, 'পঞ্চম প্রজন্ম (বর্তমান আর ভবিষ্যৎ): কৃত্রিম বুদ্ধিমত্তা', 'fifth-generation-present-and-beyond-artificial-intelligence'),
      p('<p>পঞ্চম প্রজন্মের কোনো একক, সর্বসম্মত শুরুর সময় নেই, যেভাবে আগের প্রজন্মগুলোর ছিল, কারণ এটি নির্দিষ্ট কোনো শারীরিক অংশ দিয়ে নয়, বরং কম্পিউটার আসলে কী করার জন্য তৈরি হচ্ছে তার একটি পরিবর্তন দিয়ে সংজ্ঞায়িত — স্বাভাবিক ভাষা বোঝা, ছবি আর কণ্ঠস্বর চেনা, আর <b>কৃত্রিম বুদ্ধিমত্তা (AI)</b>-র কৌশল ব্যবহার করে সিদ্ধান্ত নেওয়া। এই প্রজন্মের ধারণাগুলো নিয়ে এই অংশের পরের দিকে আরও গভীরে যাওয়া হবে।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      p('<p>একই গল্প, একটি টেবিলে সংক্ষিপ্ত আকারে:</p>'),
      table(
        ['প্রজন্ম', 'আনুমানিক সময়কাল', 'মূল প্রযুক্তি', 'উদাহরণ'],
        [
          ['প্রথম', '1940-এর দশক – 1950-এর দশক', 'ভ্যাকুয়াম টিউব', 'ENIAC'],
          ['দ্বিতীয়', '1950-এর দশক – 1960-এর দশক', 'ট্রানজিস্টর', 'IBM 1401'],
          ['তৃতীয়', '1960-এর দশক – 1970-এর দশক', 'ইন্টিগ্রেটেড সার্কিট', 'IBM System/360'],
          ['চতুর্থ', '1970-এর দশক – বর্তমান', 'মাইক্রোপ্রসেসর', 'পার্সোনাল কম্পিউটার, স্মার্টফোন'],
          ['পঞ্চম', 'বর্তমান আর ভবিষ্যৎ', 'কৃত্রিম বুদ্ধিমত্তা', 'ভয়েস অ্যাসিস্ট্যান্ট, AI সিস্টেম'],
        ]
      ),
      img(
        'docs/img/basics/generations-of-computers-1',
        'ভ্যাকুয়াম টিউব থেকে শুরু করে ট্রানজিস্টর, ইন্টিগ্রেটেড সার্কিট, মাইক্রোপ্রসেসর, আর কৃত্রিম বুদ্ধিমত্তা পর্যন্ত কম্পিউটারের পাঁচটি প্রজন্ম দেখানো টাইমলাইন ডায়াগ্রাম',
        1344, 752,
        'প্রতিটি প্রজন্ম নির্ধারিত হয় তৈরিতে ব্যবহৃত মূল প্রযুক্তি দিয়ে, কোনো নির্দিষ্ট সীমা-তারিখ দিয়ে নয়।'
      ),

      callout('note', '<p>বিভিন্ন পাঠ্যবই প্রতিটি প্রজন্মের জন্য কিছুটা ভিন্ন শুরু আর শেষের বছর উল্লেখ করে, আর এমন কোনো একক দিন কখনো ছিল না যেদিন পুরো বিশ্ব এক প্রজন্ম থেকে পরের প্রজন্মে বদলে গিয়েছিল — পুরনো যন্ত্র বাদ দেওয়ার সময় প্রযুক্তিগুলো বছরের পর বছর একসাথে চলত। উপরের বছরগুলোকে জিনিসগুলো কোন ক্রমে ঘটেছিল তার একটি মোটামুটি নির্দেশিকা হিসেবে দেখুন, কোনো নির্দিষ্ট সীমারেখা হিসেবে নয়।</p>', 'বছরগুলো আনুমানিক, নির্দিষ্ট সীমা নয়'),

      p('<p>প্রতিটি প্রজন্মের গল্প আসলে একই ধারণার পুনরাবৃত্তি: কম জায়গায়, কম বিদ্যুৎ খরচ করে, কম খরচে আরও বেশি কম্পিউটিং শক্তি ভরে দেওয়া। পরের পাঠে দেখা হবে আজকের কম্পিউটার আসলে কী দিয়ে তৈরি — এই ইতিহাস যে যন্ত্রগুলো তৈরি করেছে তার ভেতরের শারীরিক হার্ডওয়্যার।</p>'),
    ],
  },
})

lessons.push({
  slug: 'computer-hardware',
  sortOrder: 3,
  en: {
    title: 'Computer Hardware',
    metaTitle: 'Computer Hardware | Learn Computer Academy',
    metaDescription: 'A tour of the physical parts inside a computer — the motherboard, CPU, RAM, storage, and power supply — and how they work together.',
    blocks: [
      p('<p><b>Hardware</b> is every physical part of a computer you could actually pick up and hold — as opposed to <b>software</b>, the programs and instructions that tell that hardware what to do. This lesson opens up the case and looks at the core physical components almost every computer shares, from a budget laptop to a powerful desktop.</p>'),

      h(2, 'What Hardware Actually Means'),
      p('<p>If you removed every program from a computer — the operating system, every app, everything — you would still be left with a working collection of physical parts. That collection is the hardware. It is completely useless without software to give it instructions, and software is completely useless without hardware to actually run on — the two only do anything when paired together.</p>'),

      h(2, 'The Motherboard: Where Everything Connects'),
      p('<p>The <b>motherboard</b> is the main circuit board inside a computer, and it is best thought of as the foundation everything else plugs into. The processor, memory, storage drives, and power supply all connect to the motherboard, which contains the wiring that lets them communicate with each other. If a computer were a city, the motherboard would be its road network — every other part depends on it to reach every other part.</p>'),

      h(2, 'The CPU: The Computer\'s Brain'),
      p('<p>The <b>CPU</b> (Central Processing Unit), or <b>processor</b>, is the component that actually carries out instructions — it is what does the "processing" step you read about in the first lesson of this section. A CPU\'s speed is often measured in <b>gigahertz (GHz)</b>, roughly how many basic operations it can perform per second, and modern CPUs contain multiple <b>cores</b>, letting them work on more than one task at the same time rather than doing everything one step at a time.</p>'),

      h(2, 'RAM vs. Storage: Two Different Kinds of Memory'),
      p('<p>These two terms confuse almost every beginner, because both are places a computer keeps data — but they serve completely different jobs.</p><p><b>RAM</b> (Random Access Memory) is short-term working space. When you open an app, the computer loads what it needs into RAM so the CPU can access it instantly. RAM is extremely fast, but it is also <b>temporary</b> — everything in it disappears the moment the power turns off, which is exactly why an unsaved document vanishes if the computer crashes.</p><p><b>Storage</b> (a hard drive or solid-state drive) is where files live permanently, whether the computer is on or off — your photos, documents, and installed programs all sit in storage until you delete them. Storage is much slower than RAM, but nothing in it disappears when you turn the computer off. You will look at storage devices in detail in an upcoming lesson.</p>'),

      h(2, 'The Power Supply Unit (PSU)'),
      p('<p>The <b>power supply unit</b> takes the electricity from a wall outlet and converts it into the specific, steady voltages every other component actually needs to run. Without it, nothing else in the case would receive any power at all — it is easy to overlook because it rarely fails, but every other component depends on it working correctly.</p>'),

      h(2, 'At a Glance'),
      p('<p>Here\'s how the core components relate:</p>'),
      table(
        ['Component', 'Role'],
        [
          ['Motherboard', 'Connects every other component so they can communicate'],
          ['CPU', 'Carries out instructions — the "processing" step'],
          ['RAM', 'Fast, temporary working space for whatever is currently in use'],
          ['Storage', 'Slower, permanent home for files, even when the power is off'],
          ['Power Supply', 'Converts wall power into what every component actually needs'],
        ]
      ),
      img(
        'docs/img/basics/computer-hardware-1',
        'Labelled diagram of the inside of a desktop computer case showing the motherboard, CPU, RAM, storage drive, and power supply',
        1024, 768,
        'The core components inside almost every computer, from a budget laptop to a powerful desktop.'
      ),

      callout('note', '<p>A laptop or smartphone contains the exact same core components — a processor, memory, storage, and a way to manage power — just built smaller, often combined onto fewer chips, and permanently sealed inside a case you are not meant to open. The parts are the same idea at a different scale, not a different kind of machine.</p>', 'Your Laptop and Phone Have These Too'),

      p('<p>Now that you know what a computer is physically made of, the next two lessons look at how you actually get information into it and back out of it — starting with input devices.</p>'),
    ],
  },
  bn: {
    title: 'কম্পিউটার হার্ডওয়্যার',
    metaTitle: 'কম্পিউটার হার্ডওয়্যার | Learn Computer Academy',
    metaDescription: 'কম্পিউটারের ভেতরের শারীরিক অংশগুলোর একটি ভ্রমণ — মাদারবোর্ড, CPU, RAM, স্টোরেজ, আর পাওয়ার সাপ্লাই — আর তারা একসাথে কীভাবে কাজ করে।',
    blocks: [
      p('<p><b>হার্ডওয়্যার</b> হলো কম্পিউটারের প্রতিটি শারীরিক অংশ যা আপনি সত্যিই হাতে ধরতে পারবেন — এর বিপরীতে থাকে <b>সফটওয়্যার</b>, যে প্রোগ্রাম আর নির্দেশাবলী সেই হার্ডওয়্যারকে বলে দেয় কী করতে হবে। এই পাঠে আমরা কেসিং খুলে দেখব প্রায় প্রতিটি কম্পিউটারে থাকা মূল শারীরিক অংশগুলো — একটি সাশ্রয়ী ল্যাপটপ থেকে শুরু করে একটি শক্তিশালী ডেস্কটপ পর্যন্ত।</p>'),

      h(2, 'হার্ডওয়্যার আসলে কী বোঝায়', 'what-hardware-actually-means'),
      p('<p>যদি একটি কম্পিউটার থেকে প্রতিটি প্রোগ্রাম সরিয়ে ফেলা হয় — অপারেটিং সিস্টেম, প্রতিটি অ্যাপ, সবকিছু — তাহলেও আপনার হাতে থাকবে শারীরিক অংশগুলোর একটি কার্যকর সংগ্রহ। সেটাই হার্ডওয়্যার। নির্দেশাবলী দেওয়ার জন্য সফটওয়্যার ছাড়া এটি সম্পূর্ণ অকেজো, আবার সফটওয়্যারও অকেজো যদি তা চালানোর জন্য কোনো হার্ডওয়্যার না থাকে — এই দুটো একসাথে থাকলেই তবে কিছু করতে পারে।</p>'),

      h(2, 'মাদারবোর্ড: যেখানে সবকিছু সংযুক্ত হয়', 'the-motherboard-where-everything-connects'),
      p('<p><b>মাদারবোর্ড</b> হলো কম্পিউটারের ভেতরের প্রধান সার্কিট বোর্ড, আর এটাকে সবচেয়ে ভালোভাবে বোঝা যায় এমন একটি ভিত্তি হিসেবে যার সাথে বাকি সবকিছু যুক্ত হয়। প্রসেসর, মেমরি, স্টোরেজ ড্রাইভ, আর পাওয়ার সাপ্লাই — সবই মাদারবোর্ডের সাথে সংযুক্ত হয়, যাতে থাকে সেই ওয়্যারিং যা তাদের একে অপরের সাথে যোগাযোগ করতে দেয়। কম্পিউটারকে যদি একটি শহর ধরা হয়, মাদারবোর্ড হবে তার রাস্তার নেটওয়ার্ক — বাকি প্রতিটি অংশ একে অপরের কাছে পৌঁছাতে এর উপরেই নির্ভর করে।</p>'),

      h(2, 'CPU: কম্পিউটারের মস্তিষ্ক', 'the-cpu-the-computers-brain'),
      p('<p><b>CPU</b> (সেন্ট্রাল প্রসেসিং ইউনিট), বা <b>প্রসেসর</b>, হলো সেই অংশ যা প্রকৃতপক্ষে নির্দেশাবলী কার্যকর করে — এটাই সেই "প্রসেস" ধাপ যা আপনি এই অংশের প্রথম পাঠে পড়েছিলেন। একটি CPU-এর গতি প্রায়ই মাপা হয় <b>গিগাহার্টজ (GHz)</b>-এ, অর্থাৎ এটি প্রতি সেকেন্ডে মোটামুটি কতগুলো মৌলিক কাজ করতে পারে; আর আধুনিক CPU-তে একাধিক <b>কোর</b> থাকে, যার ফলে সেগুলো একবারে একটি কাজ না করে একই সময়ে একাধিক কাজ করতে পারে।</p>'),

      h(2, 'RAM বনাম স্টোরেজ: দুই ধরনের ভিন্ন মেমরি', 'ram-vs-storage-two-different-kinds-of-memory'),
      p('<p>এই দুটো শব্দ প্রায় প্রতিটি নতুন শিক্ষার্থীকে বিভ্রান্ত করে, কারণ দুটোই কম্পিউটারের তথ্য রাখার জায়গা — কিন্তু তাদের কাজ সম্পূর্ণ আলাদা।</p><p><b>RAM</b> (Random Access Memory) হলো স্বল্পমেয়াদী কাজের জায়গা। আপনি যখন কোনো অ্যাপ খোলেন, কম্পিউটার তার প্রয়োজনীয় জিনিসগুলো RAM-এ লোড করে যাতে CPU সেগুলোতে সাথে সাথে পৌঁছাতে পারে। RAM অত্যন্ত দ্রুত, কিন্তু এটি <b>সাময়িক</b> — পাওয়ার বন্ধ হয়ে গেলেই এতে থাকা সবকিছু মুছে যায়, ঠিক এই কারণেই কম্পিউটার ক্র্যাশ করলে সেভ না করা একটি ডকুমেন্ট হারিয়ে যায়।</p><p><b>স্টোরেজ</b> (একটি হার্ড ড্রাইভ বা সলিড-স্টেট ড্রাইভ) হলো যেখানে ফাইল স্থায়ীভাবে থাকে, কম্পিউটার চালু বা বন্ধ যাই থাকুক না কেন — আপনার ছবি, ডকুমেন্ট, আর ইনস্টল করা প্রোগ্রাম, সবই স্টোরেজে থাকে যতক্ষণ না আপনি সেগুলো মুছে ফেলেন। স্টোরেজ RAM-এর চেয়ে অনেক ধীর, কিন্তু কম্পিউটার বন্ধ করলে এতে থাকা কিছুই হারায় না। স্টোরেজ ডিভাইস নিয়ে বিস্তারিত জানবেন আসন্ন একটি পাঠে।</p>'),

      h(2, 'পাওয়ার সাপ্লাই ইউনিট (PSU)', 'the-power-supply-unit-psu'),
      p('<p><b>পাওয়ার সাপ্লাই ইউনিট</b> দেয়ালের সকেট থেকে বিদ্যুৎ নিয়ে সেটিকে নির্দিষ্ট, স্থিতিশীল ভোল্টেজে রূপান্তর করে যা বাকি প্রতিটি অংশের আসলে প্রয়োজন হয়। এটি ছাড়া কেসিং-এর ভেতরের আর কোনো অংশই কোনো পাওয়ার পেত না — এটি প্রায়ই খেয়াল করা হয় না কারণ এটি খুব কমই নষ্ট হয়, কিন্তু বাকি প্রতিটি অংশ এটি ঠিকভাবে কাজ করার উপরই নির্ভরশীল।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      p('<p>মূল অংশগুলো কীভাবে সম্পর্কিত, দেখে নিন:</p>'),
      table(
        ['অংশ', 'ভূমিকা'],
        [
          ['মাদারবোর্ড', 'বাকি প্রতিটি অংশকে সংযুক্ত করে যাতে তারা একে অপরের সাথে যোগাযোগ করতে পারে'],
          ['CPU', 'নির্দেশাবলী কার্যকর করে — "প্রসেস" ধাপটি'],
          ['RAM', 'বর্তমানে যা ব্যবহার হচ্ছে তার জন্য দ্রুত, সাময়িক কাজের জায়গা'],
          ['স্টোরেজ', 'ধীরগতির, স্থায়ী ফাইলের ঠিকানা, পাওয়ার বন্ধ থাকলেও'],
          ['পাওয়ার সাপ্লাই', 'দেয়ালের বিদ্যুৎকে রূপান্তর করে যা প্রতিটি অংশের আসলে প্রয়োজন'],
        ]
      ),
      img(
        'docs/img/basics/computer-hardware-1',
        'ডেস্কটপ কম্পিউটার কেসিং-এর ভেতরের একটি লেবেলযুক্ত ডায়াগ্রাম, যেখানে মাদারবোর্ড, CPU, RAM, স্টোরেজ ড্রাইভ, আর পাওয়ার সাপ্লাই দেখানো হয়েছে',
        1024, 768,
        'প্রায় প্রতিটি কম্পিউটারের ভেতরের মূল অংশগুলো, একটি সাশ্রয়ী ল্যাপটপ থেকে শুরু করে একটি শক্তিশালী ডেস্কটপ পর্যন্ত।'
      ),

      callout('note', '<p>একটি ল্যাপটপ বা স্মার্টফোনেও একই মূল অংশগুলো থাকে — একটি প্রসেসর, মেমরি, স্টোরেজ, আর পাওয়ার ব্যবস্থাপনার একটি উপায় — শুধু সেগুলো ছোট আকারে তৈরি, প্রায়ই কম সংখ্যক চিপে একত্রিত, আর এমন একটি কেসিং-এর ভেতরে স্থায়ীভাবে সিল করা যা খোলার কথা নয়। অংশগুলো একই ধারণা, শুধু ভিন্ন মাপে — সম্পূর্ণ আলাদা কোনো ধরনের যন্ত্র নয়।</p>', 'আপনার ল্যাপটপ আর ফোনেও এগুলো আছে'),

      p('<p>কম্পিউটার শারীরিকভাবে কী দিয়ে তৈরি তা জানার পর, পরের দুটো পাঠে দেখা হবে আপনি আসলে কীভাবে এতে তথ্য প্রবেশ করান আর বের করেন — শুরু হবে ইনপুট ডিভাইস দিয়ে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'input-devices',
  sortOrder: 4,
  en: {
    title: 'Input Devices',
    metaTitle: 'Input Devices | Learn Computer Academy',
    metaDescription: 'A guide to the hardware that gets information into a computer — keyboards, mice, scanners, microphones, webcams, and more — and how to tell input devices apart.',
    blocks: [
      p('<p>Back in the first lesson of this section you learned that every computer runs on four basic operations, and the very first one is <b>input</b> — getting information into the computer in the first place. This lesson looks at the physical devices that actually do that job.</p>'),

      h(2, 'What Counts as an Input Device?'),
      p('<p>An <b>input device</b> is any piece of hardware that sends data or commands into a computer for it to process. The test is simple: if the device is sending information <i>to</i> the computer, it is an input device. A keyboard sends the letters you type; a microphone sends the sound it picks up. What the computer does with that information afterward — the "process" step — is a separate question, covered elsewhere in this section.</p>'),

      h(2, 'Text and Pointing: Keyboard and Mouse'),
      p('<p>The <b>keyboard</b> is the most common way to enter text and commands, with each key press sending a specific character or instruction to the computer. The <b>mouse</b> lets you point, click, and select things on screen by moving a cursor — most laptops replace it with a <b>touchpad</b>, which does the same job using your finger directly on a flat surface instead of a separate device. A <b>trackball</b> is an older, less common alternative that works like an upside-down mouse: you roll the ball with your fingers instead of moving the whole device.</p>'),

      h(2, 'Capturing Images and Video'),
      p('<p>A <b>scanner</b> converts a physical document or photo into a digital image the computer can store and display. A <b>webcam</b> does something similar in real time, capturing live video for video calls, streaming, or recording. Digital <b>cameras</b> capture still photos or video that can later be transferred to a computer, and work on the same basic principle — light in, digital data out.</p>'),

      h(2, 'Capturing Sound'),
      p('<p>A <b>microphone</b> converts sound waves into an electrical signal the computer can turn into digital audio. This is how voice calls, voice assistants, voice typing, and recorded audio all get into a computer in the first place — nothing else in the input category deals with sound.</p>'),

      h(2, 'Specialized Input Devices'),
      p('<p>Plenty of input devices exist for specific jobs rather than everyday use. A <b>barcode scanner</b> reads the pattern on a product label — common at store checkouts. A <b>fingerprint reader</b> or <b>face-recognition camera</b> reads a physical trait to confirm who you are, a category called <b>biometric input</b>. A <b>joystick</b> or <b>game controller</b> sends movement and button presses for games and simulations. Each of these is still just a device sending information into the computer — only the kind of information changes.</p>'),

      h(2, 'At a Glance'),
      table(
        ['Device', 'What it captures', 'Common use'],
        [
          ['Keyboard', 'Key presses', 'Typing text and commands'],
          ['Mouse / touchpad', 'Pointer movement and clicks', 'Selecting and navigating on screen'],
          ['Scanner', 'A physical document or photo', 'Digitizing paper documents'],
          ['Webcam / camera', 'Still images or video', 'Video calls, photos, recordings'],
          ['Microphone', 'Sound', 'Voice calls, voice typing, recording'],
          ['Barcode scanner', 'A printed barcode pattern', 'Store checkouts, inventory'],
          ['Fingerprint / face reader', 'A physical biometric trait', 'Unlocking a device, confirming identity'],
        ]
      ),
      img(
        'docs/img/basics/input-devices-1',
        'Diagram showing common input devices — keyboard, mouse, microphone, webcam, and barcode scanner — with arrows pointing into a central computer',
        1024, 768,
        'Every input device shares one job: sending information into the computer.'
      ),

      callout('note', '<p>A touchscreen is unusual because it works as both an input device (it detects where you tap) and an output device (it also displays the screen) at the same time, built into a single piece of hardware. You will meet output devices — the hardware that sends information back <i>out</i> of the computer — in the next lesson.</p>', 'A Touchscreen Is Two Devices in One'),

      p('<p>Input gets information in. The next lesson covers the other half of the cycle: how a computer sends results back out to you.</p>'),
    ],
  },
  bn: {
    title: 'ইনপুট ডিভাইস',
    metaTitle: 'ইনপুট ডিভাইস | Learn Computer Academy',
    metaDescription: 'কম্পিউটারে তথ্য প্রবেশ করানোর হার্ডওয়্যার নিয়ে একটি গাইড — কীবোর্ড, মাউস, স্ক্যানার, মাইক্রোফোন, ওয়েবক্যাম, আর আরও অনেক কিছু — আর ইনপুট ডিভাইসগুলো কীভাবে আলাদা করে চেনা যায়।',
    blocks: [
      p('<p>এই অংশের প্রথম পাঠে আপনি শিখেছিলেন যে প্রতিটি কম্পিউটার চারটি মৌলিক কাজের উপর চলে, আর প্রথমটি হলো <b>ইনপুট</b> — সবার আগে কম্পিউটারে তথ্য প্রবেশ করানো। এই পাঠে আমরা দেখব সেই কাজটি আসলে কোন শারীরিক ডিভাইসগুলো করে।</p>'),

      h(2, 'কোন জিনিসকে ইনপুট ডিভাইস বলা হয়?', 'what-counts-as-an-input-device'),
      p('<p><b>ইনপুট ডিভাইস</b> এমন যেকোনো হার্ডওয়্যার যা প্রসেস করার জন্য কম্পিউটারে তথ্য বা কমান্ড পাঠায়। পরীক্ষাটা সহজ: ডিভাইসটি যদি কম্পিউটারের <i>দিকে</i> তথ্য পাঠায়, তাহলে সেটি একটি ইনপুট ডিভাইস। একটি কীবোর্ড আপনি যে অক্ষর টাইপ করেন তা পাঠায়; একটি মাইক্রোফোন যে শব্দ ধরে তা পাঠায়। এরপর কম্পিউটার সেই তথ্য দিয়ে কী করে — অর্থাৎ "প্রসেস" ধাপ — সেটি একটি আলাদা বিষয়, যা এই অংশের অন্য পাঠে আলোচনা করা হয়েছে।</p>'),

      h(2, 'টেক্সট আর পয়েন্টিং: কীবোর্ড আর মাউস', 'text-and-pointing-keyboard-and-mouse'),
      p('<p><b>কীবোর্ড</b> টেক্সট আর কমান্ড প্রবেশ করানোর সবচেয়ে সাধারণ উপায়, যেখানে প্রতিটি কী চাপলে একটি নির্দিষ্ট অক্ষর বা নির্দেশ কম্পিউটারে পাঠানো হয়। <b>মাউস</b> স্ক্রিনে একটি কার্সার নাড়িয়ে আপনাকে জিনিস পয়েন্ট, ক্লিক, আর সিলেক্ট করতে দেয় — বেশিরভাগ ল্যাপটপে এর বদলে থাকে একটি <b>টাচপ্যাড</b>, যা আলাদা ডিভাইসের বদলে সরাসরি আপনার আঙুল দিয়ে একটি সমতল পৃষ্ঠে একই কাজ করে। <b>ট্র্যাকবল</b> হলো একটি পুরনো, কম প্রচলিত বিকল্প যা উল্টানো মাউসের মতো কাজ করে: পুরো ডিভাইসটি নাড়ানোর বদলে আপনি আঙুল দিয়ে বলটি ঘোরান।</p>'),

      h(2, 'ছবি আর ভিডিও ধারণ করা', 'capturing-images-and-video'),
      p('<p><b>স্ক্যানার</b> একটি কাগজের ডকুমেন্ট বা ছবিকে ডিজিটাল ছবিতে রূপান্তর করে, যা কম্পিউটার সংরক্ষণ আর প্রদর্শন করতে পারে। একটি <b>ওয়েবক্যাম</b> প্রায় একই কাজ করে রিয়েল টাইমে, ভিডিও কল, স্ট্রিমিং, বা রেকর্ডিং-এর জন্য লাইভ ভিডিও ধারণ করে। ডিজিটাল <b>ক্যামেরা</b> স্থির ছবি বা ভিডিও ধারণ করে যা পরে কম্পিউটারে স্থানান্তর করা যায়, আর এটিও একই মূল নীতিতে কাজ করে — আলো প্রবেশ করে, ডিজিটাল তথ্য বের হয়।</p>'),

      h(2, 'শব্দ ধারণ করা', 'capturing-sound'),
      p('<p><b>মাইক্রোফোন</b> শব্দ তরঙ্গকে একটি বৈদ্যুতিক সিগন্যালে রূপান্তর করে, যা কম্পিউটার ডিজিটাল অডিওতে বদলাতে পারে। ভয়েস কল, ভয়েস অ্যাসিস্ট্যান্ট, ভয়েস টাইপিং, আর রেকর্ড করা অডিও — এসব সবকিছুই এভাবে কম্পিউটারে প্রবেশ করে; ইনপুট বিভাগের আর কোনো ডিভাইস শব্দ নিয়ে কাজ করে না।</p>'),

      h(2, 'বিশেষায়িত ইনপুট ডিভাইস', 'specialized-input-devices'),
      p('<p>নিয়মিত ব্যবহারের বদলে নির্দিষ্ট কাজের জন্য তৈরি অনেক ইনপুট ডিভাইস আছে। একটি <b>বারকোড স্ক্যানার</b> একটি পণ্যের লেবেলের প্যাটার্ন পড়ে — দোকানের চেকআউটে সাধারণ। একটি <b>ফিঙ্গারপ্রিন্ট রিডার</b> বা <b>ফেস-রিকগনিশন ক্যামেরা</b> আপনার পরিচয় নিশ্চিত করতে একটি শারীরিক বৈশিষ্ট্য পড়ে, একে বলা হয় <b>বায়োমেট্রিক ইনপুট</b>। একটি <b>জয়স্টিক</b> বা <b>গেম কন্ট্রোলার</b> গেম আর সিমুলেশনের জন্য নড়াচড়া আর বাটন চাপার তথ্য পাঠায়। এদের প্রতিটিই আসলে কম্পিউটারে তথ্য পাঠানো একটি ডিভাইস — শুধু তথ্যের ধরনটাই বদলায়।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['ডিভাইস', 'এটি কী ধারণ করে', 'সাধারণ ব্যবহার'],
        [
          ['কীবোর্ড', 'কী চাপা', 'টেক্সট আর কমান্ড টাইপ করা'],
          ['মাউস / টাচপ্যাড', 'কার্সারের নড়াচড়া আর ক্লিক', 'স্ক্রিনে সিলেক্ট আর নেভিগেট করা'],
          ['স্ক্যানার', 'একটি কাগজের ডকুমেন্ট বা ছবি', 'কাগজের ডকুমেন্ট ডিজিটাইজ করা'],
          ['ওয়েবক্যাম / ক্যামেরা', 'স্থির ছবি বা ভিডিও', 'ভিডিও কল, ছবি, রেকর্ডিং'],
          ['মাইক্রোফোন', 'শব্দ', 'ভয়েস কল, ভয়েস টাইপিং, রেকর্ডিং'],
          ['বারকোড স্ক্যানার', 'একটি ছাপানো বারকোড প্যাটার্ন', 'দোকানের চেকআউট, ইনভেন্টরি'],
          ['ফিঙ্গারপ্রিন্ট / ফেস রিডার', 'একটি শারীরিক বায়োমেট্রিক বৈশিষ্ট্য', 'ডিভাইস আনলক করা, পরিচয় নিশ্চিত করা'],
        ]
      ),
      img(
        'docs/img/basics/input-devices-1',
        'কীবোর্ড, মাউস, মাইক্রোফোন, ওয়েবক্যাম, আর বারকোড স্ক্যানারসহ সাধারণ ইনপুট ডিভাইসগুলো দেখানো ডায়াগ্রাম, যেখানে তীরগুলো একটি কেন্দ্রীয় কম্পিউটারের দিকে নির্দেশ করছে',
        1024, 768,
        'প্রতিটি ইনপুট ডিভাইসের একটিই কাজ: কম্পিউটারে তথ্য পাঠানো।'
      ),

      callout('note', '<p>একটি টাচস্ক্রিন অস্বাভাবিক, কারণ এটি একই সাথে একটি ইনপুট ডিভাইস (আপনি কোথায় ট্যাপ করছেন তা শনাক্ত করে) আর একটি আউটপুট ডিভাইস (স্ক্রিনও প্রদর্শন করে) হিসেবে কাজ করে, একটিই হার্ডওয়্যারের মধ্যে। আউটপুট ডিভাইস — যে হার্ডওয়্যার কম্পিউটার থেকে তথ্য আবার <i>বাইরে</i> পাঠায় — নিয়ে জানবেন পরের পাঠে।</p>', 'একটি টাচস্ক্রিন আসলে দুটি ডিভাইস'),

      p('<p>ইনপুট তথ্য ভেতরে আনে। পরের পাঠে থাকবে চক্রের বাকি অর্ধেক: কম্পিউটার কীভাবে ফলাফল আপনার কাছে আবার বাইরে পাঠায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'output-devices',
  sortOrder: 5,
  en: {
    title: 'Output Devices',
    metaTitle: 'Output Devices | Learn Computer Academy',
    metaDescription: 'A guide to the hardware that sends information out of a computer — monitors, printers, speakers, headphones, and projectors — completing the input-process-output cycle.',
    blocks: [
      p('<p>The previous lesson covered input — how information gets into a computer. This lesson covers the opposite direction: <b>output</b>, the hardware that sends a result back out so a person can actually see, hear, or hold it. Every input eventually leads to some output; this is where the four-operation cycle from the first lesson finishes.</p>'),

      h(2, 'What Counts as an Output Device?'),
      p('<p>An <b>output device</b> is any piece of hardware that presents information coming <i>from</i> the computer to a person. The direction is the whole test: a keyboard sends data in, so it is input; a monitor displays data that came from the computer, so it is output. Some devices, as you will see below, manage to do both.</p>'),

      h(2, 'Seeing Output: Monitors and Projectors'),
      p('<p>The <b>monitor</b> (or built-in screen on a laptop or phone) is the most common output device — it displays text, images, and video by lighting up millions of tiny points called pixels. A <b>projector</b> does the same basic job at a much larger scale, shining an image onto a wall or screen so a room full of people can see it at once, commonly used for presentations and classrooms.</p>'),

      h(2, 'Hearing Output: Speakers and Headphones'),
      p('<p><b>Speakers</b> and <b>headphones</b> both convert a computer\'s digital audio signal back into sound waves you can hear — the only real difference is that speakers share sound with a whole room while headphones keep it private to one listener. This is how music, videos, voice calls, and notification sounds all reach your ears.</p>'),

      h(2, 'Output on Paper: The Printer'),
      p('<p>A <b>printer</b> is the main way a computer produces a permanent, physical copy of a document or image — turning a digital file into something you can hold, file away, or hand to someone else. Unlike a screen, printed output does not disappear when the power turns off, which is exactly why paper is still used for contracts, receipts, and official documents.</p>'),

      h(2, 'Devices That Are Both Input and Output'),
      p('<p>A few devices don\'t fit neatly into just one category. A <b>touchscreen</b> displays output while also accepting taps as input, in one piece of hardware. A modern <b>printer that also scans</b> combines an output device (printing) and an input device (scanning) in a single machine. When you look at a device like this, it helps to think about each of its jobs separately rather than trying to label the whole device as only "input" or only "output."</p>'),

      h(2, 'At a Glance'),
      table(
        ['Device', 'What it produces', 'Common use'],
        [
          ['Monitor / screen', 'Visual display', 'Viewing text, images, and video'],
          ['Projector', 'A large projected image', 'Presentations, classrooms, home theaters'],
          ['Speakers', 'Sound, shared with a room', 'Music, videos, calls'],
          ['Headphones', 'Sound, private to one listener', 'Music, calls, focused listening'],
          ['Printer', 'A physical, permanent copy', 'Documents, receipts, photos'],
        ]
      ),
      img(
        'docs/img/basics/output-devices-1',
        'Diagram showing common output devices — a monitor, printer, speakers, and headphones — with arrows pointing out from a central computer',
        1024, 768,
        'Every output device shares one job: sending information out of the computer for a person to use.'
      ),

      callout('tip', '<p>Input and output together are the two halves of how you and a computer communicate with each other: input carries your instructions in, and output carries the computer\'s response back out. Everything a computer does between those two moments is the "process" step covered in this section\'s later lessons.</p>', 'Input and Output Are Two Halves of One Conversation'),

      p('<p>Now that you\'ve seen how information moves in and out of a computer, the next lesson goes back inside the machine to look at memory — where a computer keeps information while it is working with it.</p>'),
    ],
  },
  bn: {
    title: 'আউটপুট ডিভাইস',
    metaTitle: 'আউটপুট ডিভাইস | Learn Computer Academy',
    metaDescription: 'কম্পিউটার থেকে তথ্য বাইরে পাঠানোর হার্ডওয়্যার নিয়ে একটি গাইড — মনিটর, প্রিন্টার, স্পিকার, হেডফোন, আর প্রজেক্টর — যা ইনপুট-প্রসেস-আউটপুট চক্র সম্পূর্ণ করে।',
    blocks: [
      p('<p>আগের পাঠে আলোচনা হয়েছিল ইনপুট নিয়ে — কীভাবে তথ্য কম্পিউটারে প্রবেশ করে। এই পাঠে আলোচনা হবে উল্টো দিক নিয়ে: <b>আউটপুট</b>, যে হার্ডওয়্যার ফলাফল আবার বাইরে পাঠায় যাতে একজন মানুষ সেটা দেখতে, শুনতে, বা হাতে ধরতে পারে। প্রতিটি ইনপুট শেষ পর্যন্ত কোনো না কোনো আউটপুটে পৌঁছায়; এখানেই প্রথম পাঠের সেই চার-ধাপের চক্র সম্পূর্ণ হয়।</p>'),

      h(2, 'কোন জিনিসকে আউটপুট ডিভাইস বলা হয়?', 'what-counts-as-an-output-device'),
      p('<p><b>আউটপুট ডিভাইস</b> এমন যেকোনো হার্ডওয়্যার যা কম্পিউটার <i>থেকে</i> আসা তথ্য একজন মানুষের সামনে উপস্থাপন করে। দিকটাই এখানে আসল পরীক্ষা: একটি কীবোর্ড তথ্য ভেতরে পাঠায়, তাই এটি ইনপুট; একটি মনিটর কম্পিউটার থেকে আসা তথ্য প্রদর্শন করে, তাই এটি আউটপুট। নিচে দেখবেন, কিছু ডিভাইস আসলে দুটোই করে।</p>'),

      h(2, 'দেখার আউটপুট: মনিটর আর প্রজেক্টর', 'seeing-output-monitors-and-projectors'),
      p('<p><b>মনিটর</b> (বা ল্যাপটপ/ফোনের বিল্ট-ইন স্ক্রিন) সবচেয়ে সাধারণ আউটপুট ডিভাইস — এটি লক্ষ লক্ষ ছোট ছোট বিন্দু, যাকে বলা হয় পিক্সেল, আলোকিত করে টেক্সট, ছবি, আর ভিডিও প্রদর্শন করে। একটি <b>প্রজেক্টর</b> একই কাজ অনেক বড় পরিসরে করে, দেয়াল বা স্ক্রিনে একটি ছবি ফেলে যাতে একটি ঘর ভর্তি মানুষ একসাথে দেখতে পারে — সাধারণত প্রেজেন্টেশন আর ক্লাসরুমে ব্যবহৃত হয়।</p>'),

      h(2, 'শোনার আউটপুট: স্পিকার আর হেডফোন', 'hearing-output-speakers-and-headphones'),
      p('<p><b>স্পিকার</b> আর <b>হেডফোন</b> দুটোই কম্পিউটারের ডিজিটাল অডিও সিগন্যালকে আবার শব্দ তরঙ্গে রূপান্তর করে যা আপনি শুনতে পারেন — মূল পার্থক্য হলো স্পিকার একটি পুরো ঘরের সাথে শব্দ ভাগ করে নেয়, আর হেডফোন সেটি একজন শ্রোতার জন্য ব্যক্তিগত রাখে। এভাবেই গান, ভিডিও, ভয়েস কল, আর নোটিফিকেশনের শব্দ আপনার কানে পৌঁছায়।</p>'),

      h(2, 'কাগজে আউটপুট: প্রিন্টার', 'output-on-paper-the-printer'),
      p('<p><b>প্রিন্টার</b> হলো কম্পিউটার থেকে একটি ডকুমেন্ট বা ছবির স্থায়ী, শারীরিক কপি তৈরি করার প্রধান উপায় — একটি ডিজিটাল ফাইলকে এমন কিছুতে বদলে দেয় যা আপনি হাতে ধরতে, ফাইল করে রাখতে, বা অন্য কাউকে দিতে পারেন। স্ক্রিনের বিপরীতে, প্রিন্ট করা আউটপুট পাওয়ার বন্ধ হলে হারিয়ে যায় না — ঠিক এই কারণেই চুক্তিপত্র, রসিদ, আর সরকারি নথির জন্য এখনও কাগজ ব্যবহার করা হয়।</p>'),

      h(2, 'যেসব ডিভাইস ইনপুট আর আউটপুট দুটোই', 'devices-that-are-both-input-and-output'),
      p('<p>কিছু ডিভাইস ঠিক একটি বিভাগে পুরোপুরি মানানসই নয়। একটি <b>টাচস্ক্রিন</b> আউটপুট প্রদর্শন করে, আবার ট্যাপকে ইনপুট হিসেবেও গ্রহণ করে — একটিই হার্ডওয়্যারে। একটি আধুনিক <b>প্রিন্টার যা স্ক্যানও করে</b> একটি মেশিনে আউটপুট ডিভাইস (প্রিন্টিং) আর ইনপুট ডিভাইস (স্ক্যানিং) দুটোই একত্র করে। এমন কোনো ডিভাইস দেখলে পুরো ডিভাইসটিকে শুধু "ইনপুট" বা শুধু "আউটপুট" বলার বদলে প্রতিটি কাজ আলাদা করে ভাবাই ভালো।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['ডিভাইস', 'এটি কী তৈরি করে', 'সাধারণ ব্যবহার'],
        [
          ['মনিটর / স্ক্রিন', 'ভিজ্যুয়াল ডিসপ্লে', 'টেক্সট, ছবি, আর ভিডিও দেখা'],
          ['প্রজেক্টর', 'একটি বড় প্রজেক্ট করা ছবি', 'প্রেজেন্টেশন, ক্লাসরুম, হোম থিয়েটার'],
          ['স্পিকার', 'শব্দ, একটি ঘরের সাথে ভাগ করা', 'গান, ভিডিও, কল'],
          ['হেডফোন', 'শব্দ, একজন শ্রোতার জন্য ব্যক্তিগত', 'গান, কল, মনোযোগী শোনা'],
          ['প্রিন্টার', 'একটি শারীরিক, স্থায়ী কপি', 'ডকুমেন্ট, রসিদ, ছবি'],
        ]
      ),
      img(
        'docs/img/basics/output-devices-1',
        'একটি মনিটর, প্রিন্টার, স্পিকার, আর হেডফোনসহ সাধারণ আউটপুট ডিভাইসগুলো দেখানো ডায়াগ্রাম, যেখানে তীরগুলো একটি কেন্দ্রীয় কম্পিউটার থেকে বাইরের দিকে নির্দেশ করছে',
        1024, 768,
        'প্রতিটি আউটপুট ডিভাইসের একটিই কাজ: কম্পিউটার থেকে তথ্য বাইরে পাঠানো, যাতে একজন মানুষ তা ব্যবহার করতে পারে।'
      ),

      callout('tip', '<p>ইনপুট আর আউটপুট মিলে আপনার আর কম্পিউটারের মধ্যে যোগাযোগের দুটি অর্ধেক তৈরি করে: ইনপুট আপনার নির্দেশ ভেতরে নিয়ে যায়, আর আউটপুট কম্পিউটারের উত্তর আবার বাইরে নিয়ে আসে। এই দুই মুহূর্তের মাঝে কম্পিউটার যা কিছু করে, তা-ই "প্রসেস" ধাপ, যা এই অংশের পরের পাঠগুলোতে আলোচনা করা হয়েছে।</p>', 'ইনপুট আর আউটপুট একই কথোপকথনের দুটি অর্ধেক'),

      p('<p>তথ্য কম্পিউটারে কীভাবে ভেতরে-বাইরে যায় তা দেখার পর, পরের পাঠে আমরা আবার যন্ত্রের ভেতরে ফিরে যাব মেমরি দেখতে — যেখানে কম্পিউটার তথ্য নিয়ে কাজ করার সময় সেটি জমিয়ে রাখে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'computer-memory',
  sortOrder: 6,
  en: {
    title: 'Computer Memory',
    metaTitle: 'Computer Memory | Learn Computer Academy',
    metaDescription: 'RAM, ROM, and cache explained — the three kinds of primary memory a computer uses while it works, and why each one exists.',
    blocks: [
      p('<p>The <a href="/basics/computer-hardware">Computer Hardware</a> lesson introduced RAM as the computer\'s fast, temporary working space. This lesson goes further into <b>memory</b> as a whole — the kinds of storage a computer\'s processor reaches for constantly while it works, as opposed to the long-term storage covered in the next lesson.</p>'),

      h(2, 'Primary Memory vs. Secondary Storage'),
      p('<p>Computing draws a line between <b>primary memory</b> — memory the processor can use directly and instantly, built to be fast — and <b>secondary storage</b> — where files live permanently, built to be large and affordable rather than fast. RAM, ROM, and cache are all primary memory. Hard drives, SSDs, and pen drives are secondary storage, covered in the next lesson.</p>'),

      h(2, 'RAM: Fast but Temporary'),
      p('<p>As covered in the hardware lesson, <b>RAM</b> (Random Access Memory) holds whatever the CPU is actively working with — open apps, open documents, anything in use right now. It is fast, but <b>volatile</b>, meaning everything inside it disappears the instant the power turns off. More RAM generally lets a computer keep more programs open at once without slowing down.</p>'),

      h(2, 'ROM: Permanent Instructions'),
      p('<p><b>ROM</b> (Read-Only Memory) is the opposite of RAM in almost every way. It is <b>non-volatile</b> — its contents survive with the power off — but it is designed to be written once (or rarely) and then just read, over and over, never changed during normal use. A computer\'s ROM chip holds the small startup program that runs the instant you press the power button, before the operating system has even loaded, checking the hardware and locating where to load the rest of the system from.</p><p>A few related terms you may come across: <b>PROM</b> (Programmable ROM) can be written to once after manufacturing; <b>EPROM</b> and <b>EEPROM</b> can be erased and rewritten a limited number of times using special methods — useful for updating a device\'s built-in startup software without replacing the chip entirely.</p>'),

      h(2, 'Cache: Memory Built for Speed'),
      p('<p><b>Cache</b> (pronounced "cash") is a very small, very fast slice of memory sitting even closer to the CPU than RAM — often built directly into the processor chip itself. Its job is to hold the small pieces of data and instructions the CPU is most likely to need next, so it does not have to wait for the comparatively slower trip to RAM every single time.</p><p>Cache is typically organized in layers — <b>L1</b> (smallest and fastest, closest to the CPU core), <b>L2</b>, and <b>L3</b> (larger but slightly slower) — each one trading some speed for more capacity. You do not need to memorize these layers to use a computer well; the idea to keep is simply that cache is the fastest, smallest layer of memory a computer has.</p>'),

      h(2, 'At a Glance'),
      table(
        ['Type', 'Speed', 'Keeps data without power?', 'Typical job'],
        [
          ['Cache', 'Fastest', 'No', 'Holds what the CPU needs right now'],
          ['RAM', 'Fast', 'No', 'Holds whatever is currently open or running'],
          ['ROM', 'Slower', 'Yes', 'Holds the fixed startup instructions'],
        ]
      ),
      img(
        'docs/img/basics/computer-memory-1',
        'Diagram comparing cache, RAM, and ROM memory chips arranged from fastest to slowest',
        1024, 768,
        'Cache, RAM, and ROM all serve the processor directly, but trade speed, size, and permanence differently.'
      ),

      callout('note', '<p>It is easy to confuse "memory" and "storage" because both hold data — the difference this lesson and the last one both point to is speed and permanence. Memory (RAM, ROM, cache) is what the processor touches directly while working; storage (covered next) is where files actually live long-term.</p>', 'Memory Is Not the Same as Storage'),

      p('<p>The next lesson looks at secondary storage in detail — hard drives, SSDs, pen drives, and cloud storage — the devices that keep your files safe even when the computer is completely switched off.</p>'),
    ],
  },
  bn: {
    title: 'কম্পিউটার মেমরি',
    metaTitle: 'কম্পিউটার মেমরি | Learn Computer Academy',
    metaDescription: 'RAM, ROM, আর ক্যাশ ব্যাখ্যা করা হয়েছে — কম্পিউটার কাজ করার সময় যে তিন ধরনের প্রাইমারি মেমরি ব্যবহার করে, আর কেন প্রতিটির প্রয়োজন।',
    blocks: [
      p('<p><a href="/basics/computer-hardware">কম্পিউটার হার্ডওয়্যার</a> পাঠে RAM-কে কম্পিউটারের দ্রুত, সাময়িক কাজের জায়গা হিসেবে পরিচয় করানো হয়েছিল। এই পাঠে আমরা <b>মেমরি</b>-কে সামগ্রিকভাবে আরও গভীরে দেখব — যে ধরনের স্টোরেজ কম্পিউটারের প্রসেসর কাজ করার সময় ক্রমাগত ব্যবহার করে, দীর্ঘমেয়াদী স্টোরেজের বিপরীতে, যা পরের পাঠে আলোচনা করা হয়েছে।</p>'),

      h(2, 'প্রাইমারি মেমরি বনাম সেকেন্ডারি স্টোরেজ', 'primary-memory-vs-secondary-storage'),
      p('<p>কম্পিউটিং-এ একটি স্পষ্ট সীমারেখা টানা হয় <b>প্রাইমারি মেমরি</b> — যা প্রসেসর সরাসরি আর তাৎক্ষণিকভাবে ব্যবহার করতে পারে, দ্রুততার জন্য তৈরি — আর <b>সেকেন্ডারি স্টোরেজ</b> — যেখানে ফাইল স্থায়ীভাবে থাকে, দ্রুততার বদলে বড় আকার আর সাশ্রয়ী মূল্যের জন্য তৈরি, এই দুইয়ের মধ্যে। RAM, ROM, আর ক্যাশ সবই প্রাইমারি মেমরি। হার্ড ড্রাইভ, SSD, আর পেন ড্রাইভ সেকেন্ডারি স্টোরেজ, যা পরের পাঠে আলোচনা করা হয়েছে।</p>'),

      h(2, 'RAM: দ্রুত কিন্তু সাময়িক', 'ram-fast-but-temporary'),
      p('<p>হার্ডওয়্যার পাঠে যেমন বলা হয়েছিল, <b>RAM</b> (Random Access Memory) CPU যা নিয়ে সক্রিয়ভাবে কাজ করছে তা ধরে রাখে — খোলা অ্যাপ, খোলা ডকুমেন্ট, এই মুহূর্তে ব্যবহৃত যেকোনো কিছু। এটি দ্রুত, কিন্তু <b>ভোলাটাইল</b>, অর্থাৎ পাওয়ার বন্ধ হওয়ার সাথে সাথেই এর ভেতরের সবকিছু হারিয়ে যায়। বেশি RAM থাকলে সাধারণত কম্পিউটার ধীর না হয়ে একসাথে আরও বেশি প্রোগ্রাম খোলা রাখতে পারে।</p>'),

      h(2, 'ROM: স্থায়ী নির্দেশাবলী', 'rom-permanent-instructions'),
      p('<p><b>ROM</b> (Read-Only Memory) প্রায় প্রতিটি দিক থেকে RAM-এর বিপরীত। এটি <b>নন-ভোলাটাইল</b> — পাওয়ার বন্ধ থাকলেও এর তথ্য টিকে থাকে — কিন্তু এটি তৈরি করা হয়েছে একবার (বা খুব কম) লেখার জন্য, আর তারপর শুধু বারবার পড়ার জন্য, স্বাভাবিক ব্যবহারে কখনো পরিবর্তন হয় না। একটি কম্পিউটারের ROM চিপে থাকে সেই ছোট স্টার্টআপ প্রোগ্রাম যা পাওয়ার বাটন চাপার সাথে সাথে চলে, অপারেটিং সিস্টেম লোড হওয়ার আগেই, যা হার্ডওয়্যার পরীক্ষা করে আর বাকি সিস্টেম কোথা থেকে লোড করতে হবে তা খুঁজে বের করে।</p><p>কয়েকটি সম্পর্কিত শব্দ আপনি দেখতে পারেন: <b>PROM</b> (Programmable ROM) তৈরির পর একবার লেখা যায়; <b>EPROM</b> আর <b>EEPROM</b> বিশেষ পদ্ধতি ব্যবহার করে সীমিত কয়েকবার মুছে আবার লেখা যায় — একটি ডিভাইসের বিল্ট-ইন স্টার্টআপ সফটওয়্যার আপডেট করার সময় পুরো চিপ বদলানো ছাড়াই এটি কাজে লাগে।</p>'),

      h(2, 'ক্যাশ: গতির জন্য তৈরি মেমরি', 'cache-memory-built-for-speed'),
      p('<p><b>ক্যাশ</b> হলো খুবই ছোট, খুবই দ্রুত এক টুকরো মেমরি যা RAM-এর চেয়েও CPU-এর আরও কাছে থাকে — প্রায়ই সরাসরি প্রসেসর চিপের ভেতরেই তৈরি করা হয়। এর কাজ হলো CPU-এর পরবর্তীতে যে ছোট তথ্য আর নির্দেশাবলী লাগার সম্ভাবনা সবচেয়ে বেশি, তা ধরে রাখা, যাতে প্রতিবার RAM-এ তুলনামূলক ধীর যাত্রার জন্য অপেক্ষা করতে না হয়।</p><p>ক্যাশ সাধারণত স্তরে সাজানো থাকে — <b>L1</b> (সবচেয়ে ছোট আর দ্রুত, CPU কোরের সবচেয়ে কাছে), <b>L2</b>, আর <b>L3</b> (বড় কিন্তু কিছুটা ধীর) — প্রতিটি স্তর কিছুটা গতির বিনিময়ে বেশি ক্ষমতা দেয়। কম্পিউটার ভালোভাবে ব্যবহার করতে এই স্তরগুলো মুখস্থ করার দরকার নেই; মনে রাখার মতো ধারণাটি হলো, ক্যাশ কম্পিউটারের সবচেয়ে দ্রুত, সবচেয়ে ছোট মেমরি স্তর।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['ধরন', 'গতি', 'পাওয়ার ছাড়া তথ্য থাকে?', 'সাধারণ কাজ'],
        [
          ['ক্যাশ', 'সবচেয়ে দ্রুত', 'না', 'CPU-এর এই মুহূর্তে যা প্রয়োজন তা ধরে রাখা'],
          ['RAM', 'দ্রুত', 'না', 'এই মুহূর্তে খোলা বা চলমান যেকোনো কিছু ধরে রাখা'],
          ['ROM', 'ধীর', 'হ্যাঁ', 'নির্দিষ্ট স্টার্টআপ নির্দেশাবলী ধরে রাখা'],
        ]
      ),
      img(
        'docs/img/basics/computer-memory-1',
        'সবচেয়ে দ্রুত থেকে সবচেয়ে ধীর ক্রমে সাজানো ক্যাশ, RAM, আর ROM মেমরি চিপ তুলনা করার ডায়াগ্রাম',
        1024, 768,
        'ক্যাশ, RAM, আর ROM সবই সরাসরি প্রসেসরের সেবা করে, কিন্তু গতি, আকার, আর স্থায়িত্বের ক্ষেত্রে ভিন্নভাবে ট্রেড-অফ করে।'
      ),

      callout('note', '<p>"মেমরি" আর "স্টোরেজ" গুলিয়ে ফেলা সহজ কারণ দুটোই তথ্য ধরে রাখে — এই পাঠ আর আগের পাঠ দুটোই যে পার্থক্যের কথা বলে তা হলো গতি আর স্থায়িত্ব। মেমরি (RAM, ROM, ক্যাশ) হলো যা প্রসেসর কাজ করার সময় সরাসরি স্পর্শ করে; স্টোরেজ (পরের পাঠে) হলো যেখানে ফাইল আসলে দীর্ঘমেয়াদে থাকে।</p>', 'মেমরি স্টোরেজের মতো নয়'),

      p('<p>পরের পাঠে সেকেন্ডারি স্টোরেজ নিয়ে বিস্তারিত আলোচনা হবে — হার্ড ড্রাইভ, SSD, পেন ড্রাইভ, আর ক্লাউড স্টোরেজ — যে ডিভাইসগুলো কম্পিউটার সম্পূর্ণ বন্ধ থাকলেও আপনার ফাইল নিরাপদ রাখে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'storage-devices',
  sortOrder: 7,
  en: {
    title: 'Storage Devices',
    metaTitle: 'Storage Devices | Learn Computer Academy',
    metaDescription: 'Hard drives, SSDs, pen drives, and cloud storage compared — how each one keeps your files safe permanently, and how to choose between them.',
    blocks: [
      p('<p>The <a href="/basics/computer-memory">Computer Memory</a> lesson drew a line between primary memory (fast, temporary — RAM, ROM, cache) and secondary storage (permanent, but slower). This lesson is a closer look at that second category: the devices that hold your files even when the computer is completely switched off.</p>'),

      h(2, 'Hard Disk Drives (HDD)'),
      p('<p>A <b>hard disk drive</b> stores data magnetically on a spinning metal disk (called a platter), read and written by a moving arm — similar in principle to how a record player reads a vinyl record. HDDs offer a lot of storage space for a relatively low cost, which is why they are still common in desktop computers and external backup drives, but the moving parts make them slower than newer alternatives and more vulnerable to damage from drops or shocks.</p>'),

      h(2, 'Solid-State Drives (SSD)'),
      p('<p>A <b>solid-state drive</b> stores data electronically in flash memory chips, with no moving or spinning parts at all. This makes SSDs significantly faster than HDDs, more resistant to physical shock, and quieter — which is why most modern laptops now use an SSD instead of an HDD as their main drive. The trade-off is cost: SSD storage is generally more expensive per gigabyte than HDD storage.</p>'),

      h(2, 'Pen Drives and Memory Cards'),
      p('<p>A <b>pen drive</b> (also called a USB flash drive or thumb drive) uses the same flash memory technology as an SSD, packed into a small, portable stick that plugs directly into a USB port — useful for moving files between computers or keeping a portable backup. <b>Memory cards</b> (like the SD cards used in cameras) work on the same underlying technology, just in a smaller, different physical format built for devices like cameras and some phones.</p>'),

      h(2, 'Cloud Storage'),
      p('<p><b>Cloud storage</b> keeps your files on servers owned and maintained by a company, accessed over the internet rather than sitting on a physical device you carry around. This means you can reach your files from any device with an internet connection, and the storage provider typically handles backups for you. The trade-off is that you need an internet connection to access your files, and you are trusting another company to keep them safe.</p>'),

      h(2, 'At a Glance'),
      table(
        ['Device', 'How it stores data', 'Best for'],
        [
          ['HDD', 'A spinning magnetic disk', 'Large amounts of storage at low cost'],
          ['SSD', 'Flash memory chips, no moving parts', 'Speed and durability'],
          ['Pen drive', 'Flash memory in a portable stick', 'Moving files between computers'],
          ['Cloud storage', 'Remote servers, accessed online', 'Access from anywhere, automatic backup'],
        ]
      ),
      img(
        'docs/img/basics/storage-devices-1',
        'Diagram comparing four storage devices — a hard disk drive, a solid-state drive, a pen drive, and cloud storage',
        1024, 768,
        'Every storage device trades off speed, cost, and portability differently.'
      ),

      callout('tip', '<p>None of these are mutually exclusive — most people today use several at once: an SSD as the computer\'s main drive for speed, an HDD or pen drive for extra backup space, and cloud storage to keep the most important files reachable from any device.</p>', 'Most People Use More Than One'),

      p('<p>You now know both halves of how a computer handles data — memory while it works, storage for the long term. The next lesson steps back to look at something more fundamental: the binary number system every one of these devices actually stores data in.</p>'),
    ],
  },
  bn: {
    title: 'স্টোরেজ ডিভাইস',
    metaTitle: 'স্টোরেজ ডিভাইস | Learn Computer Academy',
    metaDescription: 'হার্ড ড্রাইভ, SSD, পেন ড্রাইভ, আর ক্লাউড স্টোরেজের তুলনা — প্রতিটি কীভাবে আপনার ফাইল স্থায়ীভাবে নিরাপদ রাখে, আর এদের মধ্যে কীভাবে বেছে নেবেন।',
    blocks: [
      p('<p><a href="/basics/computer-memory">কম্পিউটার মেমরি</a> পাঠে প্রাইমারি মেমরি (দ্রুত, সাময়িক — RAM, ROM, ক্যাশ) আর সেকেন্ডারি স্টোরেজ (স্থায়ী, কিন্তু ধীর)-এর মধ্যে একটি সীমারেখা টানা হয়েছিল। এই পাঠে আমরা সেই দ্বিতীয় বিভাগটি আরও কাছ থেকে দেখব: যে ডিভাইসগুলো কম্পিউটার সম্পূর্ণ বন্ধ থাকলেও আপনার ফাইল ধরে রাখে।</p>'),

      h(2, 'হার্ড ডিস্ক ড্রাইভ (HDD)', 'hard-disk-drives-hdd'),
      p('<p><b>হার্ড ডিস্ক ড্রাইভ</b> একটি ঘূর্ণায়মান ধাতব ডিস্কে (যাকে বলা হয় প্ল্যাটার) চৌম্বকীয়ভাবে তথ্য জমা রাখে, যা একটি চলমান আর্ম দিয়ে পড়া আর লেখা হয় — অনেকটা রেকর্ড প্লেয়ার যেভাবে ভিনাইল রেকর্ড পড়ে তার মতো। HDD তুলনামূলক কম খরচে অনেক বেশি স্টোরেজ জায়গা দেয়, তাই এখনও ডেস্কটপ কম্পিউটার আর এক্সটার্নাল ব্যাকআপ ড্রাইভে সাধারণ, কিন্তু চলমান অংশগুলোর কারণে এটি নতুন বিকল্পগুলোর চেয়ে ধীর, আর পড়ে যাওয়া বা ধাক্কা লাগলে ক্ষতিগ্রস্ত হওয়ার সম্ভাবনাও বেশি।</p>'),

      h(2, 'সলিড-স্টেট ড্রাইভ (SSD)', 'solid-state-drives-ssd'),
      p('<p><b>সলিড-স্টেট ড্রাইভ</b> ফ্ল্যাশ মেমরি চিপে ইলেকট্রনিকভাবে তথ্য জমা রাখে, কোনো চলমান বা ঘূর্ণায়মান অংশ ছাড়াই। এটি SSD-কে HDD-এর চেয়ে উল্লেখযোগ্যভাবে দ্রুত, শারীরিক ধাক্কার বিরুদ্ধে বেশি প্রতিরোধী, আর নিঃশব্দ করে তোলে — এই কারণেই বেশিরভাগ আধুনিক ল্যাপটপ এখন প্রধান ড্রাইভ হিসেবে HDD-এর বদলে SSD ব্যবহার করে। এর বিনিময়ে খরচ বেশি: প্রতি গিগাবাইটে SSD স্টোরেজ সাধারণত HDD স্টোরেজের চেয়ে বেশি ব্যয়বহুল।</p>'),

      h(2, 'পেন ড্রাইভ আর মেমরি কার্ড', 'pen-drives-and-memory-cards'),
      p('<p><b>পেন ড্রাইভ</b> (যাকে USB ফ্ল্যাশ ড্রাইভ বা থাম্ব ড্রাইভও বলা হয়) SSD-এর মতোই ফ্ল্যাশ মেমরি প্রযুক্তি ব্যবহার করে, একটি ছোট, বহনযোগ্য স্টিকে বন্দি, যা সরাসরি একটি USB পোর্টে লাগানো যায় — কম্পিউটারের মধ্যে ফাইল স্থানান্তর করতে বা একটি বহনযোগ্য ব্যাকআপ রাখতে কাজে লাগে। <b>মেমরি কার্ড</b> (যেমন ক্যামেরায় ব্যবহৃত SD কার্ড) একই মূল প্রযুক্তিতে কাজ করে, শুধু ক্যামেরা আর কিছু ফোনের মতো ডিভাইসের জন্য তৈরি একটি ছোট, ভিন্ন শারীরিক আকারে।</p>'),

      h(2, 'ক্লাউড স্টোরেজ', 'cloud-storage'),
      p('<p><b>ক্লাউড স্টোরেজ</b> আপনার ফাইল একটি কোম্পানির মালিকানাধীন আর রক্ষণাবেক্ষণ করা সার্ভারে রাখে, যা আপনি বহন করা কোনো শারীরিক ডিভাইসের বদলে ইন্টারনেটের মাধ্যমে অ্যাক্সেস করেন। এর মানে ইন্টারনেট সংযোগ থাকা যেকোনো ডিভাইস থেকে আপনি আপনার ফাইলে পৌঁছাতে পারেন, আর স্টোরেজ প্রোভাইডার সাধারণত আপনার হয়ে ব্যাকআপ সামলায়। এর বিনিময়ে, ফাইল অ্যাক্সেস করতে আপনার ইন্টারনেট সংযোগ প্রয়োজন, আর আপনি সেগুলো নিরাপদ রাখার দায়িত্ব অন্য একটি কোম্পানির উপর ছেড়ে দিচ্ছেন।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['ডিভাইস', 'তথ্য কীভাবে জমা রাখে', 'সবচেয়ে ভালো যেক্ষেত্রে'],
        [
          ['HDD', 'একটি ঘূর্ণায়মান চৌম্বকীয় ডিস্ক', 'কম খরচে প্রচুর স্টোরেজ'],
          ['SSD', 'ফ্ল্যাশ মেমরি চিপ, কোনো চলমান অংশ নেই', 'গতি আর স্থায়িত্ব'],
          ['পেন ড্রাইভ', 'একটি বহনযোগ্য স্টিকে ফ্ল্যাশ মেমরি', 'কম্পিউটারের মধ্যে ফাইল স্থানান্তর'],
          ['ক্লাউড স্টোরেজ', 'দূরবর্তী সার্ভার, অনলাইনে অ্যাক্সেস করা হয়', 'যেকোনো জায়গা থেকে অ্যাক্সেস, স্বয়ংক্রিয় ব্যাকআপ'],
        ]
      ),
      img(
        'docs/img/basics/storage-devices-1',
        'হার্ড ডিস্ক ড্রাইভ, সলিড-স্টেট ড্রাইভ, পেন ড্রাইভ, আর ক্লাউড স্টোরেজ — চারটি স্টোরেজ ডিভাইস তুলনা করা ডায়াগ্রাম',
        1024, 768,
        'প্রতিটি স্টোরেজ ডিভাইস গতি, খরচ, আর বহনযোগ্যতার ক্ষেত্রে ভিন্নভাবে ট্রেড-অফ করে।'
      ),

      callout('tip', '<p>এদের কোনোটিই একে অপরকে বাদ দেয় না — আজকাল বেশিরভাগ মানুষ একই সাথে একাধিক ব্যবহার করেন: গতির জন্য কম্পিউটারের প্রধান ড্রাইভ হিসেবে একটি SSD, অতিরিক্ত ব্যাকআপ জায়গার জন্য একটি HDD বা পেন ড্রাইভ, আর সবচেয়ে গুরুত্বপূর্ণ ফাইলগুলো যেকোনো ডিভাইস থেকে পাওয়ার জন্য ক্লাউড স্টোরেজ।</p>', 'বেশিরভাগ মানুষ একাধিক ব্যবহার করেন'),

      p('<p>এখন আপনি জানেন কম্পিউটার তথ্য নিয়ে কীভাবে কাজ করে তার দুটি অর্ধেকই — কাজ করার সময় মেমরি, আর দীর্ঘমেয়াদে স্টোরেজ। পরের পাঠে আমরা আরও মৌলিক একটি বিষয়ে ফিরে যাব: বাইনারি সংখ্যা পদ্ধতি, যাতে এই প্রতিটি ডিভাইসই আসলে তথ্য জমা রাখে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'number-systems',
  sortOrder: 8,
  en: {
    title: 'Number Systems',
    metaTitle: 'Number Systems | Learn Computer Academy',
    metaDescription: 'Why computers use binary instead of the decimal numbers people use every day, plus a beginner-friendly look at hexadecimal and how to convert between them.',
    blocks: [
      p('<p>Every piece of data a computer works with — text, images, sound, video, the programs themselves — is ultimately stored and processed as numbers. This lesson looks at the different <b>number systems</b> involved: the decimal system you already use every day, the binary system a computer actually runs on, and hexadecimal, a shorthand humans use to make binary easier to read.</p>'),

      h(2, 'Decimal: The System You Already Know'),
      p('<p>The number system people use in everyday life is <b>decimal</b>, or <b>base 10</b> — it has ten possible digits (0 through 9) in each position, and each position represents a power of ten. In the number present, moving right to left, each place is worth ten times the one before it: ones, tens, hundreds, and so on. You already do this automatically without thinking about it; base 10 is simply the number of digits humans have on their hands.</p>'),

      h(2, 'Binary: The System Computers Actually Use'),
      p('<p><b>Binary</b>, or <b>base 2</b>, has only two possible digits in each position: 0 and 1. Each of these digits is called a <b>bit</b> (short for "binary digit"). Instead of place values based on powers of ten, binary place values are based on powers of two: ones, twos, fours, eights, sixteens, and so on, doubling each time you move left.</p><p>For example, the binary number <b>1101</b> means one eight, one four, no twos, and one one — added together, that\'s 8 + 4 + 0 + 1, which equals <b>13</b> in decimal.</p>'),

      h(2, 'Why Computers Use Binary at All'),
      p('<p>A computer\'s circuits are built from billions of tiny electronic switches called transistors, and a switch only has two reliable states: <b>on</b> or <b>off</b>. Binary\'s two digits map perfectly onto this — 1 for "on," 0 for "off" — which makes it simple, fast, and extremely reliable to build in hardware. Trying to reliably detect ten different voltage levels (to match decimal) in a tiny, fast circuit would be far harder and much more error-prone than detecting just two.</p>'),

      h(2, 'Hexadecimal: A Shorthand for Binary'),
      p('<p>Long strings of 1s and 0s are hard for humans to read and easy to mistype, so programmers often use <b>hexadecimal</b>, or <b>base 16</b>, as a more compact stand-in for binary. Hexadecimal uses sixteen digits: 0 through 9, then the letters A through F to represent the values 10 through 15. Because 16 is a power of 2, exactly four binary digits always convert cleanly into a single hexadecimal digit, which is why hex shows up in places like color codes in design software and memory addresses in programming.</p>'),

      h(2, 'At a Glance'),
      p('<p>The number thirteen, written in each system:</p>'),
      table(
        ['System', 'Base', 'Digits used', 'Example (thirteen)'],
        [
          ['Decimal', '10', '0–9', '13'],
          ['Binary', '2', '0–1', '1101'],
          ['Hexadecimal', '16', '0–9, A–F', 'D'],
        ]
      ),
      img(
        'docs/img/basics/number-systems-1',
        'Diagram comparing the number thirteen written in decimal, binary, and hexadecimal number systems',
        1024, 768,
        'The same value, written in decimal, binary, and hexadecimal — three different ways of counting the same thing.'
      ),

      callout('note', '<p>You do not need to convert numbers between these systems by hand to use a computer well — this lesson exists so that terms like "bit," "binary," and "hex code" make sense the next time you run into them, not to turn you into a human calculator.</p>', 'You Won’t Need to Do This by Hand Day to Day'),

      p('<p>You have now covered how a computer stores and represents data at its most fundamental level. The next lesson moves up a level, to software — the instructions that tell all this hardware what to actually do.</p>'),
    ],
  },
  bn: {
    title: 'সংখ্যা পদ্ধতি',
    metaTitle: 'সংখ্যা পদ্ধতি | Learn Computer Academy',
    metaDescription: 'মানুষ প্রতিদিন যে দশমিক সংখ্যা ব্যবহার করে তার বদলে কম্পিউটার কেন বাইনারি ব্যবহার করে, সাথে হেক্সাডেসিমেল আর এদের মধ্যে রূপান্তরের একটি সহজবোধ্য পরিচিতি।',
    blocks: [
      p('<p>কম্পিউটার যে তথ্য নিয়ে কাজ করে — টেক্সট, ছবি, শব্দ, ভিডিও, এমনকি প্রোগ্রামগুলো নিজেই — সবকিছুই শেষ পর্যন্ত সংখ্যা হিসেবে জমা রাখা আর প্রসেস করা হয়। এই পাঠে আমরা বিভিন্ন <b>সংখ্যা পদ্ধতি</b> দেখব: দশমিক পদ্ধতি যা আপনি প্রতিদিন ব্যবহার করেন, বাইনারি পদ্ধতি যাতে কম্পিউটার আসলে চলে, আর হেক্সাডেসিমেল, যা মানুষের বাইনারি সহজে পড়ার জন্য একটি সংক্ষিপ্ত রূপ।</p>'),

      h(2, 'দশমিক: যে পদ্ধতি আপনি ইতিমধ্যেই জানেন', 'decimal-the-system-you-already-know'),
      p('<p>মানুষ দৈনন্দিন জীবনে যে সংখ্যা পদ্ধতি ব্যবহার করে তা হলো <b>দশমিক</b>, বা <b>বেস 10</b> — প্রতিটি অবস্থানে দশটি সম্ভাব্য অঙ্ক থাকে (0 থেকে 9), আর প্রতিটি অবস্থান দশের একটি ঘাত প্রতিনিধিত্ব করে। ডানদিক থেকে বামদিকে গেলে, প্রতিটি স্থান আগেরটির চেয়ে দশগুণ বেশি মূল্যের হয়: একক, দশক, শতক, এভাবে চলতে থাকে। আপনি না ভেবেই এটি স্বয়ংক্রিয়ভাবে করেন; বেস 10 আসলে মানুষের হাতের আঙুলের সংখ্যা থেকেই এসেছে।</p>'),

      h(2, 'বাইনারি: যে পদ্ধতিতে কম্পিউটার আসলে চলে', 'binary-the-system-computers-actually-use'),
      p('<p><b>বাইনারি</b>, বা <b>বেস 2</b>-তে প্রতিটি অবস্থানে মাত্র দুটি সম্ভাব্য অঙ্ক থাকে: 0 আর 1। এই প্রতিটি অঙ্ককে বলা হয় একটি <b>বিট</b> ("বাইনারি ডিজিট"-এর সংক্ষিপ্ত রূপ)। দশের ঘাতের বদলে, বাইনারির স্থানীয় মান নির্ভর করে দুইয়ের ঘাতের উপর: এক, দুই, চার, আট, ষোলো, এভাবে বামে গেলে প্রতিবার দ্বিগুণ হতে থাকে।</p><p>উদাহরণস্বরূপ, বাইনারি সংখ্যা <b>1101</b>-এর মানে একটি আট, একটি চার, কোনো দুই নেই, আর একটি এক — এগুলো যোগ করলে হয় 8 + 4 + 0 + 1, যা দশমিকে সমান <b>13</b>।</p>'),

      h(2, 'কম্পিউটার কেন আসলে বাইনারি ব্যবহার করে', 'why-computers-use-binary-at-all'),
      p('<p>একটি কম্পিউটারের সার্কিট তৈরি হয় শত কোটি ছোট ছোট ইলেকট্রনিক সুইচ, যাদের বলা হয় ট্রানজিস্টর, দিয়ে, আর একটি সুইচের নির্ভরযোগ্যভাবে মাত্র দুটি অবস্থা থাকে: <b>চালু</b> বা <b>বন্ধ</b>। বাইনারির দুটি অঙ্ক এর সাথে পুরোপুরি মিলে যায় — "চালু"-র জন্য 1, "বন্ধ"-এর জন্য 0 — যা হার্ডওয়্যারে তৈরি করা সহজ, দ্রুত, আর অত্যন্ত নির্ভরযোগ্য করে তোলে। একটি ছোট, দ্রুত সার্কিটে নির্ভরযোগ্যভাবে দশটি ভিন্ন ভোল্টেজ স্তর (দশমিকের সাথে মেলাতে) শনাক্ত করার চেষ্টা করা মাত্র দুটি শনাক্ত করার চেয়ে অনেক বেশি কঠিন আর ভুল হওয়ার সম্ভাবনাযুক্ত হতো।</p>'),

      h(2, 'হেক্সাডেসিমেল: বাইনারির একটি সংক্ষিপ্ত রূপ', 'hexadecimal-a-shorthand-for-binary'),
      p('<p>1 আর 0-এর লম্বা সারি মানুষের পড়া কঠিন আর ভুল টাইপ করা সহজ, তাই প্রোগ্রামাররা প্রায়ই বাইনারির একটি আরও সংক্ষিপ্ত বিকল্প হিসেবে <b>হেক্সাডেসিমেল</b>, বা <b>বেস 16</b> ব্যবহার করেন। হেক্সাডেসিমেলে ষোলোটি অঙ্ক ব্যবহৃত হয়: 0 থেকে 9, তারপর 10 থেকে 15 মান প্রকাশ করতে A থেকে F অক্ষর। যেহেতু 16 দুইয়ের একটি ঘাত, ঠিক চারটি বাইনারি অঙ্ক সবসময় নির্ভুলভাবে একটি মাত্র হেক্সাডেসিমেল অঙ্কে রূপান্তরিত হয়, এই কারণেই ডিজাইন সফটওয়্যারের কালার কোড আর প্রোগ্রামিং-এর মেমরি অ্যাড্রেসের মতো জায়গায় হেক্স দেখা যায়।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      p('<p>প্রতিটি পদ্ধতিতে লেখা সংখ্যা তেরো:</p>'),
      table(
        ['পদ্ধতি', 'বেস', 'ব্যবহৃত অঙ্ক', 'উদাহরণ (তেরো)'],
        [
          ['দশমিক', '10', '0–9', '13'],
          ['বাইনারি', '2', '0–1', '1101'],
          ['হেক্সাডেসিমেল', '16', '0–9, A–F', 'D'],
        ]
      ),
      img(
        'docs/img/basics/number-systems-1',
        'দশমিক, বাইনারি, আর হেক্সাডেসিমেল সংখ্যা পদ্ধতিতে লেখা সংখ্যা তেরো তুলনা করা ডায়াগ্রাম',
        1024, 768,
        'একই মান, দশমিক, বাইনারি, আর হেক্সাডেসিমেলে লেখা — একই জিনিস গোনার তিনটি ভিন্ন উপায়।'
      ),

      callout('note', '<p>কম্পিউটার ভালোভাবে ব্যবহার করতে আপনার হাতে করে এই পদ্ধতিগুলোর মধ্যে সংখ্যা রূপান্তর করার দরকার নেই — এই পাঠের উদ্দেশ্য হলো যাতে "বিট," "বাইনারি," আর "হেক্স কোড"-এর মতো শব্দ পরেরবার সামনে এলে বোধগম্য হয়, আপনাকে মানুষ-ক্যালকুলেটরে পরিণত করা নয়।</p>', 'দৈনন্দিন জীবনে হাতে করে এটি করতে হবে না'),

      p('<p>কম্পিউটার সবচেয়ে মৌলিক স্তরে তথ্য কীভাবে জমা রাখে আর প্রকাশ করে তা এখন আপনার জানা হয়ে গেল। পরের পাঠে আমরা এক স্তর উপরে যাব, সফটওয়্যারের দিকে — যে নির্দেশাবলী এই সব হার্ডওয়্যারকে বলে দেয় আসলে কী করতে হবে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'computer-software',
  sortOrder: 9,
  en: {
    title: 'Computer Software',
    metaTitle: 'Computer Software | Learn Computer Academy',
    metaDescription: 'System software vs. application software explained, with real examples of each, and how software actually relates to the hardware underneath it.',
    blocks: [
      p('<p>Everything covered so far in this section has been <b>hardware</b> — the physical parts of a computer. But hardware on its own does nothing; it needs <b>software</b>, the instructions that tell it what to do, to actually be useful. This lesson looks at the two broad categories software falls into.</p>'),

      h(2, 'What Software Actually Is'),
      p('<p><b>Software</b> is a set of instructions, called a <b>program</b>, that tells hardware exactly what steps to carry out. Software has no physical form of its own — you cannot hold it — but it is stored as data on a storage device, loaded into memory when needed, and carried out by the CPU, tying together nearly everything covered earlier in this section.</p>'),

      h(2, 'System Software: Running the Computer Itself'),
      p('<p><b>System software</b> manages the computer itself and gives other software a stable platform to run on, rather than solving a task for the end user directly. The most important example is the <b>operating system</b> (covered in depth in the next lesson) — Windows, macOS, Linux, Android, and iOS are all operating systems. Other examples of system software include <b>utility software</b>, which performs maintenance tasks like disk cleanup or antivirus scanning, and <b>device drivers</b>, small programs that let the operating system communicate with a specific piece of hardware, like a printer or graphics card.</p>'),

      h(2, 'Application Software: Doing a Specific Job for You'),
      p('<p><b>Application software</b> (often just called an "app") is built to help a person do a specific, real-world task. A word processor helps you write documents, a spreadsheet program helps you work with numbers, a web browser helps you view websites, and a media player helps you watch or listen to files. Unlike system software, application software is not required for the computer to function — you install exactly the applications you personally need, and different people commonly have entirely different sets installed.</p>'),

      h(2, 'How the Two Layers Depend on Each Other'),
      p('<p>Application software never talks to hardware directly — it relies on system software, particularly the operating system, to handle that connection on its behalf. When a word processor sends a file to a printer, it hands the job to the operating system, which uses the correct device driver to actually communicate with the printer. This layering is what lets the same word processor run on very different computers without being rewritten for every possible piece of hardware.</p>'),

      h(2, 'At a Glance'),
      table(
        ['Category', 'Job', 'Examples'],
        [
          ['System software', 'Manages the computer and supports other software', 'Operating system, device drivers, utility software'],
          ['Application software', 'Helps a person do a specific task', 'Word processor, web browser, media player, spreadsheet'],
        ]
      ),
      img(
        'docs/img/basics/computer-software-1',
        'Diagram dividing software into two categories — system software with an operating system, utility software, and device drivers, and application software with a word processor, spreadsheet, and media player',
        1024, 768,
        'System software runs the computer itself; application software helps a person do a specific task.'
      ),

      callout('note', '<p>A single piece of software can sometimes blur this line — a file manager, for instance, feels like an everyday app but is often bundled as part of the operating system itself. When in doubt, ask what the software is really for: keeping the computer running, or getting a specific job done for a person. That question sorts almost anything correctly.</p>', 'The Line Can Blur, But the Question Still Works'),

      p('<p>The next lesson zooms in on the single most important piece of system software — the operating system — and what it actually does every time you turn a computer on.</p>'),
    ],
  },
  bn: {
    title: 'কম্পিউটার সফটওয়্যার',
    metaTitle: 'কম্পিউটার সফটওয়্যার | Learn Computer Academy',
    metaDescription: 'সিস্টেম সফটওয়্যার বনাম অ্যাপ্লিকেশন সফটওয়্যার ব্যাখ্যা করা হয়েছে, উভয়ের বাস্তব উদাহরণসহ, আর সফটওয়্যার আসলে নিচের হার্ডওয়্যারের সাথে কীভাবে সম্পর্কিত।',
    blocks: [
      p('<p>এই অংশে এখন পর্যন্ত যা আলোচনা হয়েছে তার সবকিছুই ছিল <b>হার্ডওয়্যার</b> — কম্পিউটারের শারীরিক অংশ। কিন্তু হার্ডওয়্যার একা কিছুই করে না; একে সত্যিকারের কাজে লাগানোর জন্য প্রয়োজন <b>সফটওয়্যার</b>, সেই নির্দেশাবলী যা তাকে বলে দেয় কী করতে হবে। এই পাঠে আমরা দেখব সফটওয়্যার যে দুটি বড় বিভাগে পড়ে।</p>'),

      h(2, 'সফটওয়্যার আসলে কী', 'what-software-actually-is'),
      p('<p><b>সফটওয়্যার</b> হলো নির্দেশাবলীর একটি সেট, যাকে বলা হয় <b>প্রোগ্রাম</b>, যা হার্ডওয়্যারকে ঠিক কোন কোন ধাপ পালন করতে হবে তা বলে দেয়। সফটওয়্যারের নিজস্ব কোনো শারীরিক রূপ নেই — আপনি এটি হাতে ধরতে পারবেন না — কিন্তু এটি একটি স্টোরেজ ডিভাইসে তথ্য হিসেবে জমা থাকে, প্রয়োজনে মেমরিতে লোড হয়, আর CPU দিয়ে কার্যকর হয়, যা এই অংশে আগে আলোচিত প্রায় সবকিছুকে একসাথে যুক্ত করে।</p>'),

      h(2, 'সিস্টেম সফটওয়্যার: কম্পিউটার নিজেকে চালানো', 'system-software-running-the-computer-itself'),
      p('<p><b>সিস্টেম সফটওয়্যার</b> সরাসরি ব্যবহারকারীর জন্য কোনো কাজ সমাধান করার বদলে কম্পিউটার নিজেকে পরিচালনা করে আর অন্য সফটওয়্যারকে চালানোর জন্য একটি স্থিতিশীল প্ল্যাটফর্ম দেয়। সবচেয়ে গুরুত্বপূর্ণ উদাহরণ হলো <b>অপারেটিং সিস্টেম</b> (যা পরের পাঠে বিস্তারিত আলোচনা করা হবে) — Windows, macOS, Linux, Android, আর iOS সবগুলোই অপারেটিং সিস্টেম। সিস্টেম সফটওয়্যারের অন্য উদাহরণের মধ্যে আছে <b>ইউটিলিটি সফটওয়্যার</b>, যা ডিস্ক ক্লিনআপ বা অ্যান্টিভাইরাস স্ক্যানিং-এর মতো রক্ষণাবেক্ষণের কাজ করে, আর <b>ডিভাইস ড্রাইভার</b>, ছোট প্রোগ্রাম যা অপারেটিং সিস্টেমকে একটি নির্দিষ্ট হার্ডওয়্যার, যেমন প্রিন্টার বা গ্রাফিক্স কার্ড, এর সাথে যোগাযোগ করতে দেয়।</p>'),

      h(2, 'অ্যাপ্লিকেশন সফটওয়্যার: আপনার জন্য নির্দিষ্ট একটি কাজ করা', 'application-software-doing-a-specific-job-for-you'),
      p('<p><b>অ্যাপ্লিকেশন সফটওয়্যার</b> (প্রায়ই শুধু "অ্যাপ" বলা হয়) একজন মানুষকে একটি নির্দিষ্ট, বাস্তব-জগতের কাজ করতে সাহায্য করার জন্য তৈরি। একটি ওয়ার্ড প্রসেসর আপনাকে ডকুমেন্ট লিখতে সাহায্য করে, একটি স্প্রেডশিট প্রোগ্রাম সংখ্যা নিয়ে কাজ করতে সাহায্য করে, একটি ওয়েব ব্রাউজার ওয়েবসাইট দেখতে সাহায্য করে, আর একটি মিডিয়া প্লেয়ার ফাইল দেখতে বা শুনতে সাহায্য করে। সিস্টেম সফটওয়্যারের বিপরীতে, কম্পিউটার চালাতে অ্যাপ্লিকেশন সফটওয়্যার আবশ্যক নয় — আপনি ঠিক সেই অ্যাপ্লিকেশনগুলোই ইনস্টল করেন যা আপনার ব্যক্তিগতভাবে প্রয়োজন, আর ভিন্ন ভিন্ন মানুষের কাছে সাধারণত সম্পূর্ণ ভিন্ন সেট ইনস্টল করা থাকে।</p>'),

      h(2, 'দুটি স্তর কীভাবে একে অপরের উপর নির্ভরশীল', 'how-the-two-layers-depend-on-each-other'),
      p('<p>অ্যাপ্লিকেশন সফটওয়্যার কখনো সরাসরি হার্ডওয়্যারের সাথে কথা বলে না — এটি সেই সংযোগ সামলানোর জন্য সিস্টেম সফটওয়্যার, বিশেষ করে অপারেটিং সিস্টেমের উপর নির্ভর করে। একটি ওয়ার্ড প্রসেসর যখন একটি ফাইল প্রিন্টারে পাঠায়, তখন এটি কাজটি অপারেটিং সিস্টেমের হাতে তুলে দেয়, যা সঠিক ডিভাইস ড্রাইভার ব্যবহার করে আসলে প্রিন্টারের সাথে যোগাযোগ করে। এই স্তরায়নের কারণেই একই ওয়ার্ড প্রসেসর প্রতিটি সম্ভাব্য হার্ডওয়্যারের জন্য আবার লেখা ছাড়াই খুব ভিন্ন ভিন্ন কম্পিউটারে চলতে পারে।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['বিভাগ', 'কাজ', 'উদাহরণ'],
        [
          ['সিস্টেম সফটওয়্যার', 'কম্পিউটার পরিচালনা করে আর অন্য সফটওয়্যারকে সহায়তা করে', 'অপারেটিং সিস্টেম, ডিভাইস ড্রাইভার, ইউটিলিটি সফটওয়্যার'],
          ['অ্যাপ্লিকেশন সফটওয়্যার', 'একজন মানুষকে একটি নির্দিষ্ট কাজ করতে সাহায্য করে', 'ওয়ার্ড প্রসেসর, ওয়েব ব্রাউজার, মিডিয়া প্লেয়ার, স্প্রেডশিট'],
        ]
      ),
      img(
        'docs/img/basics/computer-software-1',
        'সফটওয়্যারকে দুটি বিভাগে ভাগ করা ডায়াগ্রাম — অপারেটিং সিস্টেম, ইউটিলিটি সফটওয়্যার, আর ডিভাইস ড্রাইভারসহ সিস্টেম সফটওয়্যার, আর ওয়ার্ড প্রসেসর, স্প্রেডশিট, আর মিডিয়া প্লেয়ারসহ অ্যাপ্লিকেশন সফটওয়্যার',
        1024, 768,
        'সিস্টেম সফটওয়্যার কম্পিউটার নিজেকে চালায়; অ্যাপ্লিকেশন সফটওয়্যার একজন মানুষকে একটি নির্দিষ্ট কাজ করতে সাহায্য করে।'
      ),

      callout('note', '<p>একটি একক সফটওয়্যার মাঝে মাঝে এই সীমারেখা ঝাপসা করে দিতে পারে — যেমন একটি ফাইল ম্যানেজার একটি দৈনন্দিন অ্যাপের মতো মনে হয়, কিন্তু প্রায়ই এটি অপারেটিং সিস্টেমেরই অংশ হিসেবে বান্ডিল করা থাকে। সন্দেহ হলে জিজ্ঞাসা করুন সফটওয়্যারটি আসলে কীসের জন্য: কম্পিউটার চালু রাখার জন্য, নাকি একজন মানুষের জন্য একটি নির্দিষ্ট কাজ সম্পন্ন করার জন্য। এই প্রশ্নটি প্রায় সবকিছুই সঠিকভাবে আলাদা করে দেয়।</p>', 'সীমারেখা ঝাপসা হতে পারে, কিন্তু প্রশ্নটি তবুও কাজ করে'),

      p('<p>পরের পাঠে আমরা সিস্টেম সফটওয়্যারের সবচেয়ে গুরুত্বপূর্ণ অংশটি নিয়ে গভীরে যাব — অপারেটিং সিস্টেম — আর কম্পিউটার চালু করার প্রতিবার এটি আসলে কী করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'operating-systems',
  sortOrder: 10,
  en: {
    title: 'Operating Systems',
    metaTitle: 'Operating Systems | Learn Computer Academy',
    metaDescription: 'What an operating system actually does, why every computer needs one, and a look at the major OS families — Windows, macOS, Linux, Android, and iOS.',
    blocks: [
      p('<p>The previous lesson placed the <b>operating system</b> at the top of system software — the most important piece of software on any computer. This lesson looks at what an operating system actually does, and the major families you will encounter.</p>'),

      h(2, 'What an Operating System Actually Does'),
      p('<p>An <b>operating system (OS)</b> is the software that manages a computer\'s hardware and provides a common platform for every other program to run on. Without one, every single app would need to know how to talk directly to your exact model of CPU, memory, storage, and screen — an impossible task, since no two computers are built identically. The OS handles four core jobs: managing memory (deciding what goes into RAM and when), managing the processor (deciding which program gets the CPU\'s attention and for how long), managing files (organizing storage into files and folders), and managing devices (using drivers to talk to hardware like printers and webcams).</p>'),

      h(2, 'The User Interface'),
      p('<p>The operating system is also what you actually see and interact with — the desktop, the icons, the taps and swipes on a phone. This visual layer is called the <b>user interface</b>, and it is the OS translating your clicks and taps into instructions the hardware can carry out, and translating the computer\'s responses back into something you can see and understand.</p>'),

      h(2, 'Desktop Operating Systems'),
      p('<p><b>Windows</b>, made by Microsoft, is the most widely used desktop operating system, known for broad compatibility with hardware and software. <b>macOS</b>, made by Apple, runs exclusively on Apple\'s own Mac computers and is known for tight integration between hardware and software. <b>Linux</b> is a free, open-source operating system that anyone can inspect, modify, and distribute — it powers a large share of the world\'s servers and is popular with developers, even though it is less common on everyday desktop computers.</p>'),

      h(2, 'Mobile Operating Systems'),
      p('<p><b>Android</b>, made by Google, is the most widely used mobile operating system worldwide and runs on phones and tablets from many different manufacturers. <b>iOS</b>, made by Apple, runs exclusively on the iPhone, mirroring the same closed, tightly integrated approach macOS takes on the desktop.</p>'),

      h(2, 'At a Glance'),
      table(
        ['Operating system', 'Made by', 'Mainly runs on'],
        [
          ['Windows', 'Microsoft', 'Desktops and laptops'],
          ['macOS', 'Apple', 'Mac computers'],
          ['Linux', 'Open-source community', 'Servers, developer machines, some desktops'],
          ['Android', 'Google', 'Phones and tablets (many brands)'],
          ['iOS', 'Apple', 'iPhone'],
        ]
      ),
      img(
        'docs/img/basics/operating-systems-1',
        'Diagram showing the major operating system families and a layered stack showing applications running on top of the operating system, which runs on top of hardware',
        1024, 768,
        'The operating system sits between your applications and the raw hardware, translating between the two.'
      ),

      callout('tip', '<p>You can usually tell if something is the operating system itself, versus an app running on it, by asking one question: would the computer still turn on and be usable at all without it? Remove Windows or Android and nothing works. Remove a single app, like a calculator, and everything else keeps running fine.</p>', 'One Question Tells You What Is the OS'),

      p('<p>You now have a complete picture of how computers handle instructions, from raw hardware up through the operating system that manages it. The next lesson moves outward, to how individual computers connect and talk to each other over a network.</p>'),
    ],
  },
  bn: {
    title: 'অপারেটিং সিস্টেম',
    metaTitle: 'অপারেটিং সিস্টেম | Learn Computer Academy',
    metaDescription: 'একটি অপারেটিং সিস্টেম আসলে কী করে, প্রতিটি কম্পিউটারের কেন একটি প্রয়োজন, আর প্রধান OS পরিবার — Windows, macOS, Linux, Android, আর iOS — এর একটি পরিচিতি।',
    blocks: [
      p('<p>আগের পাঠে <b>অপারেটিং সিস্টেম</b>-কে সিস্টেম সফটওয়্যারের শীর্ষে রাখা হয়েছিল — যেকোনো কম্পিউটারের সবচেয়ে গুরুত্বপূর্ণ সফটওয়্যার। এই পাঠে আমরা দেখব একটি অপারেটিং সিস্টেম আসলে কী করে, আর কোন প্রধান পরিবারগুলোর সাথে আপনার দেখা হবে।</p>'),

      h(2, 'একটি অপারেটিং সিস্টেম আসলে কী করে', 'what-an-operating-system-actually-does'),
      p('<p><b>অপারেটিং সিস্টেম (OS)</b> হলো সেই সফটওয়্যার যা কম্পিউটারের হার্ডওয়্যার পরিচালনা করে আর বাকি প্রতিটি প্রোগ্রাম চালানোর জন্য একটি সাধারণ প্ল্যাটফর্ম দেয়। এটি ছাড়া, প্রতিটি অ্যাপকে জানতে হতো আপনার নির্দিষ্ট মডেলের CPU, মেমরি, স্টোরেজ, আর স্ক্রিনের সাথে সরাসরি কীভাবে কথা বলতে হয় — একটি অসম্ভব কাজ, কারণ কোনো দুটি কম্পিউটার একইভাবে তৈরি হয় না। OS চারটি মূল কাজ সামলায়: মেমরি ব্যবস্থাপনা (কখন কী RAM-এ যাবে তা ঠিক করা), প্রসেসর ব্যবস্থাপনা (কোন প্রোগ্রাম কতক্ষণ CPU-এর মনোযোগ পাবে তা ঠিক করা), ফাইল ব্যবস্থাপনা (স্টোরেজকে ফাইল আর ফোল্ডারে সাজানো), আর ডিভাইস ব্যবস্থাপনা (প্রিন্টার আর ওয়েবক্যামের মতো হার্ডওয়্যারের সাথে কথা বলতে ড্রাইভার ব্যবহার করা)।</p>'),

      h(2, 'ইউজার ইন্টারফেস', 'the-user-interface'),
      p('<p>অপারেটিং সিস্টেমই আসলে যা আপনি দেখেন আর যার সাথে মিথস্ক্রিয়া করেন — ডেস্কটপ, আইকন, একটি ফোনে ট্যাপ আর সোয়াইপ। এই ভিজ্যুয়াল স্তরকে বলা হয় <b>ইউজার ইন্টারফেস</b>, আর এটি হলো OS আপনার ক্লিক আর ট্যাপকে হার্ডওয়্যার বুঝতে পারে এমন নির্দেশে রূপান্তর করা, আর কম্পিউটারের উত্তর আপনি দেখতে আর বুঝতে পারেন এমন কিছুতে ফিরিয়ে আনা।</p>'),

      h(2, 'ডেস্কটপ অপারেটিং সিস্টেম', 'desktop-operating-systems'),
      p('<p>মাইক্রোসফটের তৈরি <b>Windows</b> সবচেয়ে বেশি ব্যবহৃত ডেস্কটপ অপারেটিং সিস্টেম, যা হার্ডওয়্যার আর সফটওয়্যারের সাথে বিস্তৃত সামঞ্জস্যের জন্য পরিচিত। অ্যাপলের তৈরি <b>macOS</b> শুধুমাত্র অ্যাপলের নিজস্ব Mac কম্পিউটারে চলে, আর হার্ডওয়্যার-সফটওয়্যারের নিবিড় সংযোগের জন্য পরিচিত। <b>Linux</b> একটি ফ্রি, ওপেন-সোর্স অপারেটিং সিস্টেম যা যে কেউ পরীক্ষা করতে, পরিবর্তন করতে, আর বিতরণ করতে পারে — এটি বিশ্বের অনেক সার্ভার চালায় আর ডেভেলপারদের কাছে জনপ্রিয়, যদিও দৈনন্দিন ডেস্কটপ কম্পিউটারে এটি কম প্রচলিত।</p>'),

      h(2, 'মোবাইল অপারেটিং সিস্টেম', 'mobile-operating-systems'),
      p('<p>গুগলের তৈরি <b>Android</b> বিশ্বব্যাপী সবচেয়ে বেশি ব্যবহৃত মোবাইল অপারেটিং সিস্টেম, আর বিভিন্ন ভিন্ন প্রস্তুতকারকের ফোন আর ট্যাবলেটে চলে। অ্যাপলের তৈরি <b>iOS</b> শুধুমাত্র iPhone-এ চলে, ডেস্কটপে macOS যেভাবে বন্ধ, নিবিড়ভাবে সংযুক্ত পদ্ধতি অনুসরণ করে সেটিরই প্রতিফলন।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['অপারেটিং সিস্টেম', 'নির্মাতা', 'প্রধানত চলে'],
        [
          ['Windows', 'মাইক্রোসফট', 'ডেস্কটপ আর ল্যাপটপ'],
          ['macOS', 'অ্যাপল', 'Mac কম্পিউটার'],
          ['Linux', 'ওপেন-সোর্স কমিউনিটি', 'সার্ভার, ডেভেলপার মেশিন, কিছু ডেস্কটপ'],
          ['Android', 'গুগল', 'ফোন আর ট্যাবলেট (অনেক ব্র্যান্ড)'],
          ['iOS', 'অ্যাপল', 'iPhone'],
        ]
      ),
      img(
        'docs/img/basics/operating-systems-1',
        'প্রধান অপারেটিং সিস্টেম পরিবারগুলো দেখানো ডায়াগ্রাম, সাথে একটি স্তরযুক্ত চিত্র যেখানে অ্যাপ্লিকেশন অপারেটিং সিস্টেমের উপরে চলে, আর অপারেটিং সিস্টেম হার্ডওয়্যারের উপরে চলে',
        1024, 768,
        'অপারেটিং সিস্টেম আপনার অ্যাপ্লিকেশন আর কাঁচা হার্ডওয়্যারের মাঝখানে থাকে, দুইয়ের মধ্যে অনুবাদ করে।'
      ),

      callout('tip', '<p>কোনো কিছু অপারেটিং সিস্টেম নিজেই, নাকি এর উপর চলা একটি অ্যাপ, তা সাধারণত একটি প্রশ্ন জিজ্ঞাসা করে বোঝা যায়: এটি ছাড়া কি কম্পিউটার তবুও চালু হবে আর ব্যবহারযোগ্য থাকবে? Windows বা Android সরিয়ে ফেলুন, কিছুই কাজ করবে না। একটি মাত্র অ্যাপ, যেমন ক্যালকুলেটর, সরিয়ে ফেলুন, বাকি সবকিছু ঠিকভাবে চলতেই থাকবে।</p>', 'একটি প্রশ্নই বলে দেয় কোনটি OS'),

      p('<p>কাঁচা হার্ডওয়্যার থেকে শুরু করে সেটি পরিচালনা করা অপারেটিং সিস্টেম পর্যন্ত, কম্পিউটার কীভাবে নির্দেশাবলী সামলায় তার একটি সম্পূর্ণ ছবি এখন আপনার কাছে আছে। পরের পাঠে আমরা বাইরের দিকে যাব, দেখব আলাদা আলাদা কম্পিউটার কীভাবে একটি নেটওয়ার্কের মাধ্যমে একে অপরের সাথে সংযুক্ত হয় আর কথা বলে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'computer-networking',
  sortOrder: 11,
  en: {
    title: 'Computer Networking',
    metaTitle: 'Computer Networking | Learn Computer Academy',
    metaDescription: 'How computers connect and communicate with each other — LANs, WANs, IP addresses, and the hardware that makes networking possible.',
    blocks: [
      p('<p>Every lesson so far has looked at a single computer. But most computers today rarely work alone — they are connected to other computers, sharing files, printers, and internet access. This lesson covers <b>networking</b>: how that connection actually works.</p>'),

      h(2, 'What Is a Network?'),
      p('<p>A <b>network</b> is simply two or more computers connected together so they can share data and resources. That connection can be a physical cable or a wireless radio signal like Wi-Fi, but either way, the goal is the same: let devices exchange information without a person manually carrying a file between them on a drive.</p>'),

      h(2, 'LAN: Networking a Small Area'),
      p('<p>A <b>LAN</b> (Local Area Network) connects computers within a small, single physical area — a home, a classroom, or a single office building. Most home Wi-Fi setups are a LAN: your laptop, phone, and smart TV all connect to the same router, forming a small local network that also happens to share one internet connection.</p>'),

      h(2, 'WAN: Networking Across Distance'),
      p('<p>A <b>WAN</b> (Wide Area Network) connects computers across a much larger area — a city, a country, or the entire planet — usually by linking many smaller LANs together. The <b>internet</b>, which you will look at in detail in the next lesson, is the largest WAN in existence: a network of networks spanning the whole world.</p>'),

      h(2, 'The Hardware That Makes Networking Work'),
      p('<p>A <b>router</b> directs data between devices on a network and connects that network to others, such as the internet. A <b>switch</b> connects multiple wired devices within a single LAN, letting them talk to each other directly. A <b>modem</b> converts the signal from an internet service provider into a format your router and devices can use. In many home setups, a single device combines a modem and router into one box, which is why people sometimes use the two words interchangeably even though they do different jobs.</p>'),

      h(2, 'How Computers Find Each Other: IP Addresses'),
      p('<p>Every device on a network needs a unique address so data knows where to go — this is called an <b>IP address</b> (Internet Protocol address), a set of numbers that works much like a postal address for a device. When you load a webpage, your request travels across the network carrying the destination\'s IP address, and the response finds its way back to your device\'s own IP address.</p>'),

      h(2, 'At a Glance'),
      table(
        ['Term', 'What it means'],
        [
          ['LAN', 'A network covering a small area, like a home or office'],
          ['WAN', 'A network covering a large area, like a country or the world'],
          ['Router', 'Directs data between devices and connects a network to others'],
          ['IP address', 'A unique number identifying a device on a network'],
        ]
      ),
      img(
        'docs/img/basics/computer-networking-1',
        'Diagram comparing a LAN, computers connected within one building, and a WAN, networks connected across a long distance',
        1024, 768,
        'A LAN covers one small area; a WAN links smaller networks together across much greater distances.'
      ),

      callout('note', '<p>Networking can sound abstract, but you rely on it constantly without noticing: printing from a laptop to a shared office printer, casting a video from your phone to a smart TV, and loading any website all depend on the LAN and WAN concepts covered in this lesson.</p>', 'You Use This Every Day, Even If You Don’t See It'),

      p('<p>Now that you understand how computers connect to each other in general, the next lesson zooms in on the largest network of all — the internet — and what actually happens when you visit a website.</p>'),
    ],
  },
  bn: {
    title: 'কম্পিউটার নেটওয়ার্কিং',
    metaTitle: 'কম্পিউটার নেটওয়ার্কিং | Learn Computer Academy',
    metaDescription: 'কম্পিউটার কীভাবে একে অপরের সাথে সংযুক্ত হয় আর যোগাযোগ করে — LAN, WAN, IP অ্যাড্রেস, আর নেটওয়ার্কিং সম্ভব করে তোলা হার্ডওয়্যার।',
    blocks: [
      p('<p>এখন পর্যন্ত প্রতিটি পাঠে একটি একক কম্পিউটার নিয়ে আলোচনা হয়েছে। কিন্তু আজকের বেশিরভাগ কম্পিউটার খুব কমই একা কাজ করে — এরা অন্য কম্পিউটারের সাথে সংযুক্ত থাকে, ফাইল, প্রিন্টার, আর ইন্টারনেট অ্যাক্সেস ভাগ করে নেয়। এই পাঠে আলোচনা হবে <b>নেটওয়ার্কিং</b> নিয়ে: সেই সংযোগ আসলে কীভাবে কাজ করে।</p>'),

      h(2, 'নেটওয়ার্ক কী?', 'what-is-a-network'),
      p('<p><b>নেটওয়ার্ক</b> মানে সহজভাবে দুই বা ততোধিক কম্পিউটার একসাথে সংযুক্ত, যাতে তারা তথ্য আর রিসোর্স ভাগ করে নিতে পারে। এই সংযোগ একটি শারীরিক তার হতে পারে, বা Wi-Fi-এর মতো একটি ওয়্যারলেস রেডিও সিগন্যাল, কিন্তু যেভাবেই হোক, লক্ষ্য একই: একজন মানুষকে হাতে করে একটি ড্রাইভে ফাইল বহন না করেই ডিভাইসগুলোকে তথ্য বিনিময় করতে দেওয়া।</p>'),

      h(2, 'LAN: একটি ছোট এলাকা নেটওয়ার্ক করা', 'lan-networking-a-small-area'),
      p('<p><b>LAN</b> (Local Area Network) একটি ছোট, একক শারীরিক এলাকার মধ্যে কম্পিউটার সংযুক্ত করে — একটি বাড়ি, একটি ক্লাসরুম, বা একটি একক অফিস ভবন। বেশিরভাগ বাড়ির Wi-Fi সেটআপ একটি LAN: আপনার ল্যাপটপ, ফোন, আর স্মার্ট টিভি সবই একই রাউটারের সাথে সংযুক্ত থাকে, যা একটি ছোট স্থানীয় নেটওয়ার্ক তৈরি করে যা একই সাথে একটি ইন্টারনেট সংযোগও ভাগ করে নেয়।</p>'),

      h(2, 'WAN: দূরত্ব জুড়ে নেটওয়ার্ক করা', 'wan-networking-across-distance'),
      p('<p><b>WAN</b> (Wide Area Network) অনেক বড় একটি এলাকা জুড়ে কম্পিউটার সংযুক্ত করে — একটি শহর, একটি দেশ, বা পুরো পৃথিবী — সাধারণত অনেকগুলো ছোট LAN-কে একসাথে যুক্ত করে। <b>ইন্টারনেট</b>, যা নিয়ে পরের পাঠে বিস্তারিত আলোচনা হবে, বিদ্যমান সবচেয়ে বড় WAN: নেটওয়ার্কের একটি নেটওয়ার্ক যা পুরো পৃথিবী জুড়ে বিস্তৃত।</p>'),

      h(2, 'যে হার্ডওয়্যার নেটওয়ার্কিং সম্ভব করে', 'the-hardware-that-makes-networking-work'),
      p('<p><b>রাউটার</b> একটি নেটওয়ার্কের ডিভাইসগুলোর মধ্যে তথ্য পরিচালনা করে আর সেই নেটওয়ার্ককে ইন্টারনেটের মতো অন্যদের সাথে সংযুক্ত করে। একটি <b>সুইচ</b> একটি একক LAN-এর মধ্যে একাধিক তারযুক্ত ডিভাইস সংযুক্ত করে, যাতে তারা সরাসরি একে অপরের সাথে কথা বলতে পারে। একটি <b>মডেম</b> একটি ইন্টারনেট সার্ভিস প্রোভাইডারের সিগন্যালকে এমন একটি ফরম্যাটে রূপান্তর করে যা আপনার রাউটার আর ডিভাইস ব্যবহার করতে পারে। অনেক বাড়ির সেটআপে, একটি একক ডিভাইস একটি মডেম আর রাউটারকে একটি বাক্সে একত্র করে, এই কারণেই মানুষ মাঝে মাঝে দুটো শব্দ একে অপরের বদলে ব্যবহার করে, যদিও তারা ভিন্ন ভিন্ন কাজ করে।</p>'),

      h(2, 'কম্পিউটার কীভাবে একে অপরকে খুঁজে পায়: IP অ্যাড্রেস', 'how-computers-find-each-other-ip-addresses'),
      p('<p>একটি নেটওয়ার্কের প্রতিটি ডিভাইসের একটি অনন্য ঠিকানা প্রয়োজন যাতে তথ্য জানে কোথায় যেতে হবে — একে বলা হয় <b>IP অ্যাড্রেস</b> (Internet Protocol address), সংখ্যার একটি সেট যা অনেকটা একটি ডিভাইসের ডাক ঠিকানার মতো কাজ করে। আপনি যখন একটি ওয়েবপেজ লোড করেন, আপনার রিকোয়েস্ট গন্তব্যের IP অ্যাড্রেস বহন করে নেটওয়ার্ক জুড়ে ভ্রমণ করে, আর উত্তরটি আপনার ডিভাইসের নিজস্ব IP অ্যাড্রেসে ফিরে আসার পথ খুঁজে নেয়।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['শব্দ', 'এর মানে কী'],
        [
          ['LAN', 'একটি ছোট এলাকা জুড়ে নেটওয়ার্ক, যেমন একটি বাড়ি বা অফিস'],
          ['WAN', 'একটি বড় এলাকা জুড়ে নেটওয়ার্ক, যেমন একটি দেশ বা পুরো পৃথিবী'],
          ['রাউটার', 'ডিভাইসগুলোর মধ্যে তথ্য পরিচালনা করে আর একটি নেটওয়ার্ককে অন্যদের সাথে সংযুক্ত করে'],
          ['IP অ্যাড্রেস', 'একটি নেটওয়ার্কে একটি ডিভাইস শনাক্তকারী একটি অনন্য সংখ্যা'],
        ]
      ),
      img(
        'docs/img/basics/computer-networking-1',
        'একটি LAN, একটি ভবনের মধ্যে সংযুক্ত কম্পিউটার, আর একটি WAN, অনেক দূরত্ব জুড়ে সংযুক্ত নেটওয়ার্ক তুলনা করা ডায়াগ্রাম',
        1024, 768,
        'একটি LAN একটি ছোট এলাকা জুড়ে থাকে; একটি WAN অনেক বেশি দূরত্ব জুড়ে ছোট নেটওয়ার্কগুলোকে একসাথে যুক্ত করে।'
      ),

      callout('note', '<p>নেটওয়ার্কিং শুনতে বিমূর্ত মনে হতে পারে, কিন্তু আপনি খেয়াল না করেই ক্রমাগত এর উপর নির্ভর করেন: একটি ল্যাপটপ থেকে অফিসের ভাগাভাগি করা প্রিন্টারে প্রিন্ট করা, আপনার ফোন থেকে একটি স্মার্ট টিভিতে ভিডিও কাস্ট করা, আর যেকোনো ওয়েবসাইট লোড করা — সবই এই পাঠে আলোচিত LAN আর WAN ধারণার উপর নির্ভর করে।</p>', 'আপনি প্রতিদিন এটি ব্যবহার করেন, দেখতে না পেলেও'),

      p('<p>কম্পিউটার সাধারণভাবে কীভাবে একে অপরের সাথে সংযুক্ত হয় তা বোঝার পর, পরের পাঠে আমরা সবচেয়ে বড় নেটওয়ার্কটি নিয়ে গভীরে যাব — ইন্টারনেট — আর আপনি যখন একটি ওয়েবসাইটে যান তখন আসলে কী ঘটে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'internet-basics',
  sortOrder: 12,
  en: {
    title: 'Internet Basics',
    metaTitle: 'Internet Basics | Learn Computer Academy',
    metaDescription: 'What the internet actually is, how browsers, URLs, and ISPs fit together, and what really happens between typing a web address and seeing the page.',
    blocks: [
      p('<p>The previous lesson called the internet the largest WAN in existence. This lesson opens that up: what the internet is made of, the tools you use to reach it, and what actually happens in the moments after you type a web address.</p>'),

      h(2, 'What the Internet Actually Is'),
      p('<p>The <b>internet</b> is a global network of interconnected computer networks, all agreeing to communicate using the same shared set of rules. No single company or country owns it — it is millions of separate networks around the world, linked together and cooperating to move data between them. This is different from the <b>World Wide Web</b>, a common source of confusion: the web (pages, images, videos you view in a browser) is just one of many things that runs on top of the internet — email and messaging apps use the same underlying internet without being "the web" at all.</p>'),

      h(2, 'ISPs: Your On-Ramp to the Internet'),
      p('<p>An <b>ISP</b> (Internet Service Provider) is the company that connects your home, office, or phone to the wider internet — you pay an ISP for that access the same way you\'d pay a utility company for electricity or water. Your ISP hands your device an IP address (covered in the previous lesson) and routes your traffic out to the rest of the internet\'s networks.</p>'),

      h(2, 'Browsers: Your Window Into the Web'),
      p('<p>A <b>web browser</b> is the application software that requests, receives, and displays web pages — Chrome, Safari, Firefox, and Edge are all browsers. When you open a browser, it is acting as a translator: turning your clicks and typed addresses into requests the internet understands, and turning the response back into the readable page you see.</p>'),

      h(2, 'URLs: Addresses for Web Pages'),
      p('<p>A <b>URL</b> (Uniform Resource Locator) is the address of a specific page or file on the web — what you type or click to go somewhere. A URL like <code>https://www.example.com/about</code> breaks into parts: <code>https</code> is the protocol (the rules used for the exchange), <code>www.example.com</code> is the domain (the site\'s address, translated into an IP address behind the scenes), and <code>/about</code> is the specific page on that site.</p>'),

      h(2, 'What Happens When You Load a Page'),
      p('<p>Typing a URL and pressing enter sets off a fast sequence: your browser asks a system called <b>DNS</b> (Domain Name System) to translate the domain name into an IP address, since computers route traffic by IP address, not by name — DNS acts like a phone book for the internet. Your request then travels, through your ISP, across the internet\'s networks, to the server hosting that site. The server sends the page data back along the same kind of path, and your browser assembles and displays it. All of this typically happens in well under a second.</p>'),

      h(2, 'At a Glance'),
      table(
        ['Term', 'What it means'],
        [
          ['Internet', 'The global network of networks that everything else runs on'],
          ['ISP', 'The company that connects you to the internet'],
          ['Browser', 'The app used to view web pages'],
          ['URL', 'The address of a specific page or file on the web'],
          ['DNS', 'The system that translates domain names into IP addresses'],
        ]
      ),
      img(
        'docs/img/basics/internet-basics-1',
        'Four-step flow diagram showing what happens when a website loads: typing a URL, DNS finding the IP address, the request traveling over the internet, and the website loading',
        1344, 752,
        'Loading a webpage is a fast, four-step round trip across the internet — usually finished in under a second.'
      ),

      callout('tip', '<p>Next time a page loads, you now know roughly what just happened behind the scenes: your browser, your ISP, DNS, and a distant server all cooperated in a fraction of a second to get you that page — the same basic process behind every website you\'ve ever visited.</p>', 'You Now Know What Happens Behind Every Page Load'),

      p('<p>Now that you understand how data reaches you safely over a network, the next lesson covers the other side of that coin: keeping yourself safe while you\'re online.</p>'),
    ],
  },
  bn: {
    title: 'ইন্টারনেটের প্রাথমিক ধারণা',
    metaTitle: 'ইন্টারনেটের প্রাথমিক ধারণা | Learn Computer Academy',
    metaDescription: 'ইন্টারনেট আসলে কী, ব্রাউজার, URL, আর ISP কীভাবে একসাথে কাজ করে, আর একটি ওয়েব অ্যাড্রেস টাইপ করা থেকে পেজ দেখা পর্যন্ত আসলে কী ঘটে।',
    blocks: [
      p('<p>আগের পাঠে ইন্টারনেটকে বিদ্যমান সবচেয়ে বড় WAN বলা হয়েছিল। এই পাঠে আমরা সেটি খুলে দেখব: ইন্টারনেট আসলে কী দিয়ে তৈরি, এটিতে পৌঁছাতে আপনি যে টুল ব্যবহার করেন, আর একটি ওয়েব অ্যাড্রেস টাইপ করার পরের মুহূর্তগুলোতে আসলে কী ঘটে।</p>'),

      h(2, 'ইন্টারনেট আসলে কী', 'what-the-internet-actually-is'),
      p('<p><b>ইন্টারনেট</b> হলো পরস্পর-সংযুক্ত কম্পিউটার নেটওয়ার্কের একটি বৈশ্বিক নেটওয়ার্ক, যারা সবাই একই ভাগাভাগি করা নিয়ম ব্যবহার করে যোগাযোগ করতে সম্মত। কোনো একক কোম্পানি বা দেশ এর মালিক নয় — এটি বিশ্বজুড়ে লক্ষ লক্ষ আলাদা নেটওয়ার্ক, একসাথে যুক্ত আর একে অপরের সাথে সহযোগিতা করে তথ্য চলাচল করায়। এটি <b>ওয়ার্ল্ড ওয়াইড ওয়েব</b> থেকে ভিন্ন, একটি সাধারণ বিভ্রান্তির উৎস: ওয়েব (আপনি ব্রাউজারে যে পেজ, ছবি, ভিডিও দেখেন) ইন্টারনেটের উপর চলা অনেক জিনিসের একটি মাত্র — ইমেইল আর মেসেজিং অ্যাপ একই অন্তর্নিহিত ইন্টারনেট ব্যবহার করে, কিন্তু মোটেও "ওয়েব" নয়।</p>'),

      h(2, 'ISP: ইন্টারনেটে আপনার প্রবেশপথ', 'isps-your-on-ramp-to-the-internet'),
      p('<p><b>ISP</b> (Internet Service Provider) হলো সেই কোম্পানি যা আপনার বাড়ি, অফিস, বা ফোনকে বৃহত্তর ইন্টারনেটের সাথে সংযুক্ত করে — আপনি একটি ইউটিলিটি কোম্পানিকে বিদ্যুৎ বা পানির জন্য যেভাবে টাকা দেন, ঠিক সেভাবেই একটি ISP-কে সেই অ্যাক্সেসের জন্য টাকা দেন। আপনার ISP আপনার ডিভাইসকে একটি IP অ্যাড্রেস দেয় (আগের পাঠে আলোচিত) আর আপনার ট্র্যাফিক ইন্টারনেটের বাকি নেটওয়ার্কে পাঠায়।</p>'),

      h(2, 'ব্রাউজার: ওয়েবে আপনার জানালা', 'browsers-your-window-into-the-web'),
      p('<p><b>ওয়েব ব্রাউজার</b> হলো সেই অ্যাপ্লিকেশন সফটওয়্যার যা ওয়েব পেজ রিকোয়েস্ট করে, গ্রহণ করে, আর প্রদর্শন করে — Chrome, Safari, Firefox, আর Edge সবই ব্রাউজার। আপনি যখন একটি ব্রাউজার খোলেন, এটি একজন অনুবাদক হিসেবে কাজ করে: আপনার ক্লিক আর টাইপ করা অ্যাড্রেসকে এমন রিকোয়েস্টে রূপান্তর করে যা ইন্টারনেট বোঝে, আর উত্তরকে আবার আপনার দেখা পড়ার-যোগ্য পেজে ফিরিয়ে আনে।</p>'),

      h(2, 'URL: ওয়েব পেজের ঠিকানা', 'urls-addresses-for-web-pages'),
      p('<p><b>URL</b> (Uniform Resource Locator) হলো ওয়েবের একটি নির্দিষ্ট পেজ বা ফাইলের ঠিকানা — যা আপনি টাইপ করেন বা ক্লিক করেন কোথাও যেতে। <code>https://www.example.com/about</code>-এর মতো একটি URL কয়েকটি অংশে ভাগ হয়: <code>https</code> হলো প্রোটোকল (বিনিময়ের জন্য ব্যবহৃত নিয়ম), <code>www.example.com</code> হলো ডোমেইন (সাইটের ঠিকানা, পর্দার আড়ালে একটি IP অ্যাড্রেসে অনুবাদ করা হয়), আর <code>/about</code> হলো সেই সাইটের নির্দিষ্ট পেজ।</p>'),

      h(2, 'একটি পেজ লোড করলে কী ঘটে', 'what-happens-when-you-load-a-page'),
      p('<p>একটি URL টাইপ করে এন্টার চাপলে একটি দ্রুত ধারাবাহিক ঘটনা শুরু হয়: আপনার ব্রাউজার <b>DNS</b> (Domain Name System) নামের একটি সিস্টেমকে ডোমেইন নামটি একটি IP অ্যাড্রেসে অনুবাদ করতে বলে, কারণ কম্পিউটার নাম দিয়ে নয়, IP অ্যাড্রেস দিয়ে ট্র্যাফিক পরিচালনা করে — DNS ইন্টারনেটের একটি ফোন বইয়ের মতো কাজ করে। এরপর আপনার রিকোয়েস্ট আপনার ISP-এর মধ্য দিয়ে, ইন্টারনেটের নেটওয়ার্ক জুড়ে, সেই সাইট হোস্ট করা সার্ভারে পৌঁছায়। সার্ভার একই ধরনের পথ ধরে পেজের তথ্য ফেরত পাঠায়, আর আপনার ব্রাউজার সেটি একত্র করে প্রদর্শন করে। এই পুরো প্রক্রিয়াটি সাধারণত এক সেকেন্ডেরও অনেক কম সময়ে ঘটে।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['শব্দ', 'এর মানে কী'],
        [
          ['ইন্টারনেট', 'নেটওয়ার্কের বৈশ্বিক নেটওয়ার্ক যার উপর বাকি সবকিছু চলে'],
          ['ISP', 'যে কোম্পানি আপনাকে ইন্টারনেটের সাথে সংযুক্ত করে'],
          ['ব্রাউজার', 'ওয়েব পেজ দেখার জন্য ব্যবহৃত অ্যাপ'],
          ['URL', 'ওয়েবের একটি নির্দিষ্ট পেজ বা ফাইলের ঠিকানা'],
          ['DNS', 'ডোমেইন নামকে IP অ্যাড্রেসে অনুবাদ করা সিস্টেম'],
        ]
      ),
      img(
        'docs/img/basics/internet-basics-1',
        'একটি ওয়েবসাইট লোড হলে কী ঘটে তা দেখানো চার-ধাপের ফ্লো ডায়াগ্রাম: URL টাইপ করা, DNS দিয়ে IP অ্যাড্রেস খোঁজা, রিকোয়েস্ট ইন্টারনেট জুড়ে ভ্রমণ করা, আর ওয়েবসাইট লোড হওয়া',
        1344, 752,
        'একটি ওয়েবপেজ লোড করা ইন্টারনেট জুড়ে একটি দ্রুত, চার-ধাপের যাত্রা — সাধারণত এক সেকেন্ডেরও কম সময়ে শেষ হয়।'
      ),

      callout('tip', '<p>পরেরবার যখন একটি পেজ লোড হবে, আপনি এখন মোটামুটি জানেন পর্দার আড়ালে কী ঘটেছিল: আপনার ব্রাউজার, আপনার ISP, DNS, আর একটি দূরবর্তী সার্ভার — সবাই মিলে সেকেন্ডের একটি ভগ্নাংশে সহযোগিতা করে আপনাকে সেই পেজটি এনে দিয়েছে — আপনি যে কোনো ওয়েবসাইট দেখেছেন তার পেছনেই এই একই মৌলিক প্রক্রিয়া কাজ করেছে।</p>', 'প্রতিটি পেজ লোডের পেছনে কী ঘটে তা এখন আপনি জানেন'),

      p('<p>নেটওয়ার্কের মাধ্যমে তথ্য কীভাবে নিরাপদে আপনার কাছে পৌঁছায় তা বোঝার পর, পরের পাঠে আলোচনা হবে সেই মুদ্রার অন্য পিঠ নিয়ে: অনলাইনে থাকার সময় নিজেকে নিরাপদ রাখা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'cybersecurity-basics',
  sortOrder: 13,
  en: {
    title: 'Cybersecurity Basics',
    metaTitle: 'Cybersecurity Basics | Learn Computer Academy',
    metaDescription: 'The core habits that keep you safe online — strong passwords, spotting malware and phishing, and why keeping software updated matters more than people think.',
    blocks: [
      p('<p>Being connected to a network, as covered in the last two lessons, brings a real risk alongside the convenience: other people on that same internet trying to access your data, your accounts, or your device without permission. <b>Cybersecurity</b> is the practice of protecting computers, networks, and data from exactly that. This lesson covers the everyday habits that matter most.</p>'),

      h(2, 'Strong, Unique Passwords'),
      p('<p>A weak password is one of the easiest ways into an account, so a strong one should be long, avoid obvious words or personal details like a birthday, and mix letters, numbers, and symbols. Just as important: use a <b>different</b> password for every account. If you reuse one password everywhere and a single site is ever breached, every other account using that same password becomes vulnerable too. A <b>password manager</b> — software that generates and remembers strong, unique passwords for you — makes this realistic to actually do.</p>'),

      h(2, 'Malware: Software Designed to Harm'),
      p('<p><b>Malware</b> (short for "malicious software") is any program written to damage a device, steal data, or gain unauthorized access. It comes in several common forms: a <b>virus</b> attaches itself to legitimate files and spreads when they are shared; <b>ransomware</b> locks or encrypts your files and demands payment to release them; and <b>spyware</b> quietly watches what you do and reports it back to someone else. Antivirus software (a type of utility software, covered in the software lesson) helps detect and remove these threats.</p>'),

      h(2, 'Phishing: Tricking You Into Handing Over Access'),
      p('<p><b>Phishing</b> is a fake message, usually an email or text, designed to trick you into revealing a password, clicking a dangerous link, or sending money — by pretending to be a bank, a colleague, or a service you actually use. Common warning signs include an urgent or threatening tone, a sender address that looks almost-but-not-quite right, and a request for information a legitimate organization would never actually ask for over email.</p>'),

      h(2, 'Keeping Software Updated'),
      p('<p>Software updates often exist specifically to patch security weaknesses that have been discovered since the last version — postponing an update doesn\'t just delay new features, it leaves a known door unlocked. Keeping your operating system, browser, and apps up to date is one of the simplest, most effective habits in this entire lesson.</p>'),

      h(2, 'At a Glance'),
      table(
        ['Habit', 'Why it matters'],
        [
          ['Unique passwords', 'Stops one breached site from compromising every other account'],
          ['Recognizing malware', 'Limits the damage a virus, ransomware, or spyware infection can do'],
          ['Spotting phishing', 'Prevents handing over passwords or money to an attacker directly'],
          ['Updating software', 'Closes known security holes before they can be exploited'],
        ]
      ),
      img(
        'docs/img/basics/cybersecurity-basics-1',
        'Diagram showing four core cybersecurity habits — strong unique passwords, watching for malware, spotting phishing emails, and keeping software updated',
        1024, 768,
        'Four everyday habits cover most of what keeps an average person safe online.'
      ),

      callout('tip', '<p>None of this requires deep technical knowledge — the habits above are the same ones security professionals rely on themselves. Good cybersecurity is mostly about consistency in a few simple habits, not complexity.</p>', 'Safety Here Is About Habits, Not Expertise'),

      p('<p>You have now covered how computers work, how they connect, and how to stay safe while using them. The final lessons in this section zoom out even further, to where computers show up in daily life and where computing is headed next.</p>'),
    ],
  },
  bn: {
    title: 'সাইবার নিরাপত্তার প্রাথমিক ধারণা',
    metaTitle: 'সাইবার নিরাপত্তার প্রাথমিক ধারণা | Learn Computer Academy',
    metaDescription: 'অনলাইনে নিরাপদ থাকার মূল অভ্যাসগুলো — শক্তিশালী পাসওয়ার্ড, ম্যালওয়্যার আর ফিশিং শনাক্ত করা, আর সফটওয়্যার আপডেট রাখা কেন মানুষ যতটা ভাবে তার চেয়ে বেশি গুরুত্বপূর্ণ।',
    blocks: [
      p('<p>আগের দুটো পাঠে আলোচিত নেটওয়ার্কের সাথে সংযুক্ত থাকা সুবিধার পাশাপাশি একটি বাস্তব ঝুঁকিও নিয়ে আসে: একই ইন্টারনেটে থাকা অন্য মানুষ অনুমতি ছাড়াই আপনার তথ্য, আপনার অ্যাকাউন্ট, বা আপনার ডিভাইসে পৌঁছানোর চেষ্টা করতে পারে। <b>সাইবার নিরাপত্তা</b> হলো কম্পিউটার, নেটওয়ার্ক, আর তথ্যকে ঠিক এই থেকে রক্ষা করার চর্চা। এই পাঠে সবচেয়ে গুরুত্বপূর্ণ দৈনন্দিন অভ্যাসগুলো আলোচনা করা হবে।</p>'),

      h(2, 'শক্তিশালী, অনন্য পাসওয়ার্ড', 'strong-unique-passwords'),
      p('<p>একটি দুর্বল পাসওয়ার্ড একটি অ্যাকাউন্টে ঢোকার সবচেয়ে সহজ উপায়গুলোর একটি, তাই একটি শক্তিশালী পাসওয়ার্ড লম্বা হওয়া উচিত, স্পষ্ট শব্দ বা জন্মদিনের মতো ব্যক্তিগত তথ্য এড়িয়ে চলা উচিত, আর অক্ষর, সংখ্যা, আর প্রতীক মিশিয়ে রাখা উচিত। ঠিক ততটাই গুরুত্বপূর্ণ: প্রতিটি অ্যাকাউন্টের জন্য <b>ভিন্ন</b> পাসওয়ার্ড ব্যবহার করা। আপনি যদি সব জায়গায় একই পাসওয়ার্ড ব্যবহার করেন আর কোনো একটি সাইট কখনো লঙ্ঘিত হয়, তাহলে সেই একই পাসওয়ার্ড ব্যবহার করা বাকি প্রতিটি অ্যাকাউন্টও ঝুঁকিতে পড়ে যায়। একটি <b>পাসওয়ার্ড ম্যানেজার</b> — যে সফটওয়্যার আপনার জন্য শক্তিশালী, অনন্য পাসওয়ার্ড তৈরি করে আর মনে রাখে — এটিকে বাস্তবে করা সম্ভব করে তোলে।</p>'),

      h(2, 'ম্যালওয়্যার: ক্ষতি করার জন্য তৈরি সফটওয়্যার', 'malware-software-designed-to-harm'),
      p('<p><b>ম্যালওয়্যার</b> ("malicious software"-এর সংক্ষিপ্ত রূপ) হলো এমন যেকোনো প্রোগ্রাম যা একটি ডিভাইসের ক্ষতি করতে, তথ্য চুরি করতে, বা অননুমোদিত অ্যাক্সেস পেতে লেখা হয়। এটি বিভিন্ন সাধারণ রূপে আসে: একটি <b>ভাইরাস</b> নিজেকে বৈধ ফাইলের সাথে যুক্ত করে আর সেগুলো শেয়ার হলে ছড়িয়ে পড়ে; <b>র‍্যানসমওয়্যার</b> আপনার ফাইল লক বা এনক্রিপ্ট করে দেয় আর সেগুলো ছেড়ে দেওয়ার জন্য টাকা দাবি করে; আর <b>স্পাইওয়্যার</b> নিঃশব্দে আপনি কী করছেন তা দেখে আর অন্য কাউকে রিপোর্ট করে। অ্যান্টিভাইরাস সফটওয়্যার (এক ধরনের ইউটিলিটি সফটওয়্যার, সফটওয়্যার পাঠে আলোচিত) এই হুমকিগুলো শনাক্ত আর দূর করতে সাহায্য করে।</p>'),

      h(2, 'ফিশিং: আপনাকে ফাঁদে ফেলে অ্যাক্সেস হাতিয়ে নেওয়া', 'phishing-tricking-you-into-handing-over-access'),
      p('<p><b>ফিশিং</b> হলো একটি ভুয়া বার্তা, সাধারণত একটি ইমেইল বা টেক্সট, যা আপনাকে একটি পাসওয়ার্ড প্রকাশ করতে, একটি বিপজ্জনক লিংকে ক্লিক করতে, বা টাকা পাঠাতে বোকা বানানোর জন্য তৈরি — একটি ব্যাংক, একজন সহকর্মী, বা আপনি সত্যিই ব্যবহার করেন এমন একটি সার্ভিসের ভান করে। সাধারণ সতর্কতা চিহ্নের মধ্যে আছে একটি জরুরি বা হুমকিমূলক সুর, একটি প্রেরকের ঠিকানা যা প্রায়-কিন্তু-ঠিক-নয় মনে হয়, আর এমন তথ্যের অনুরোধ যা একটি বৈধ প্রতিষ্ঠান ইমেইলে কখনো সত্যিই জিজ্ঞাসা করবে না।</p>'),

      h(2, 'সফটওয়্যার আপডেট রাখা', 'keeping-software-updated'),
      p('<p>সফটওয়্যার আপডেট প্রায়ই বিশেষভাবে সেই নিরাপত্তা দুর্বলতাগুলো ঠিক করার জন্য আসে যা শেষ ভার্সনের পর থেকে আবিষ্কৃত হয়েছে — একটি আপডেট পিছিয়ে দেওয়া শুধু নতুন ফিচার দেরি করায় না, এটি একটি পরিচিত দরজা খোলা রাখে। আপনার অপারেটিং সিস্টেম, ব্রাউজার, আর অ্যাপ আপডেট রাখা এই পুরো পাঠের সবচেয়ে সহজ, সবচেয়ে কার্যকর অভ্যাসগুলোর একটি।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['অভ্যাস', 'কেন গুরুত্বপূর্ণ'],
        [
          ['অনন্য পাসওয়ার্ড', 'একটি লঙ্ঘিত সাইট বাকি প্রতিটি অ্যাকাউন্ট ঝুঁকিতে ফেলা থামায়'],
          ['ম্যালওয়্যার চেনা', 'ভাইরাস, র‍্যানসমওয়্যার, বা স্পাইওয়্যার সংক্রমণের ক্ষতি সীমিত করে'],
          ['ফিশিং শনাক্ত করা', 'সরাসরি একজন আক্রমণকারীকে পাসওয়ার্ড বা টাকা তুলে দেওয়া থেকে বাঁচায়'],
          ['সফটওয়্যার আপডেট করা', 'পরিচিত নিরাপত্তা ফাঁক ব্যবহার হওয়ার আগেই বন্ধ করে'],
        ]
      ),
      img(
        'docs/img/basics/cybersecurity-basics-1',
        'চারটি মূল সাইবার নিরাপত্তা অভ্যাস দেখানো ডায়াগ্রাম — শক্তিশালী অনন্য পাসওয়ার্ড, ম্যালওয়্যার সতর্কতা, ফিশিং ইমেইল শনাক্তকরণ, আর সফটওয়্যার আপডেট রাখা',
        1024, 768,
        'একজন সাধারণ মানুষকে অনলাইনে নিরাপদ রাখার বেশিরভাগ কাজ এই চারটি দৈনন্দিন অভ্যাসই করে দেয়।'
      ),

      callout('tip', '<p>এর কোনোটির জন্যই গভীর প্রযুক্তিগত জ্ঞানের দরকার নেই — উপরের অভ্যাসগুলো নিরাপত্তা পেশাদাররা নিজেরাও একই ভাবে অনুসরণ করেন। ভালো সাইবার নিরাপত্তা বেশিরভাগ ক্ষেত্রে জটিলতা নয়, বরং কয়েকটি সহজ অভ্যাসে ধারাবাহিকতা নিয়ে।</p>', 'নিরাপত্তা এখানে দক্ষতা নয়, অভ্যাসের বিষয়'),

      p('<p>কম্পিউটার কীভাবে কাজ করে, কীভাবে সংযুক্ত হয়, আর সেগুলো ব্যবহারের সময় কীভাবে নিরাপদ থাকতে হয় — এই পুরোটা এখন আপনার আলোচনা করা হয়ে গেছে। এই অংশের শেষ পাঠগুলো আরও দূরে তাকাবে — দৈনন্দিন জীবনে কম্পিউটার কোথায় দেখা যায়, আর কম্পিউটিং এরপর কোন দিকে যাচ্ছে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'computer-applications',
  sortOrder: 14,
  en: {
    title: 'Computer Applications in Everyday Life',
    metaTitle: 'Computer Applications in Everyday Life | Learn Computer Academy',
    metaDescription: 'Where computers actually show up in daily life — education, business, healthcare, entertainment, and retail — beyond the desk or the phone in your pocket.',
    blocks: [
      p('<p>Every lesson in this section has built toward one idea: computers are general-purpose machines that do whatever their software tells them to. This lesson looks at what that actually means in practice — the real, everyday fields where computing quietly does the work.</p>'),

      h(2, 'Education'),
      p('<p>Computers now shape nearly every stage of learning: students research topics and submit assignments online, teachers track grades and attendance digitally, and interactive lessons — like the ones in this very course — let people learn at their own pace from anywhere with an internet connection. Distance learning, impossible without computers and networking, has made education reachable for people who could never attend a physical classroom.</p>'),

      h(2, 'Business'),
      p('<p>From a small shop\'s billing software to a multinational company\'s inventory and payroll systems, computers run the everyday machinery of business. Email and video calls replaced much of the need for in-person meetings, spreadsheets handle calculations that used to take hours by hand, and data analysis helps companies make decisions based on evidence instead of guesswork.</p>'),

      h(2, 'Healthcare'),
      p('<p>Hospitals use computers to store patient records securely and make them instantly available to authorized staff, to run diagnostic equipment like MRI and CT scanners, and to schedule appointments and manage medicine inventories. Telemedicine — seeing a doctor over a video call — depends entirely on the networking concepts covered earlier in this section.</p>'),

      h(2, 'Entertainment'),
      p('<p>Streaming video and music, video games, and digital art and film production all run on computing power. Even entertainment that feels completely offline, like a live concert, usually relies on computers behind the scenes for lighting, sound mixing, and ticketing.</p>'),

      h(2, 'Retail'),
      p('<p>Online shopping, in-store checkout systems, and inventory tracking all depend on computers to work at the scale modern retail operates at. A single online order quietly involves a website, a payment processor, and an inventory database all communicating with each other in the seconds it takes to click "buy."</p>'),

      h(2, 'At a Glance'),
      table(
        ['Field', 'A typical use'],
        [
          ['Education', 'Online learning, digital grading and attendance'],
          ['Business', 'Billing, payroll, spreadsheets, data analysis'],
          ['Healthcare', 'Patient records, diagnostic equipment, telemedicine'],
          ['Entertainment', 'Streaming, gaming, digital film and music production'],
          ['Retail', 'Online shopping, checkout systems, inventory tracking'],
        ]
      ),
      img(
        'docs/img/basics/computer-applications-1',
        'Diagram showing computers connected to five fields of everyday life — education, business, healthcare, entertainment, and retail',
        1024, 768,
        'The same general-purpose computer, running different software, does the work behind every one of these fields.'
      ),

      callout('note', '<p>Notice that no new kind of "special" computer appears in any of these fields — the same hardware and software concepts from earlier in this section (input, processing, storage, networking) are simply pointed at a different job each time. This is the general-purpose idea from the very first lesson, playing out at the scale of an entire economy.</p>', 'It’s the Same Computer, Doing a Different Job'),

      p('<p>You have now seen where computing already is. The final two lessons in this section look ahead — to quantum computing and artificial intelligence, two of the biggest forces shaping where computing goes next.</p>'),
    ],
  },
  bn: {
    title: 'দৈনন্দিন জীবনে কম্পিউটার অ্যাপ্লিকেশন',
    metaTitle: 'দৈনন্দিন জীবনে কম্পিউটার অ্যাপ্লিকেশন | Learn Computer Academy',
    metaDescription: 'কম্পিউটার আসলে দৈনন্দিন জীবনে কোথায় দেখা যায় — শিক্ষা, ব্যবসা, স্বাস্থ্যসেবা, বিনোদন, আর খুচরা বিক্রয় — শুধু ডেস্ক বা আপনার পকেটের ফোনের বাইরেও।',
    blocks: [
      p('<p>এই অংশের প্রতিটি পাঠ একটি ধারণার দিকে এগিয়েছে: কম্পিউটার জেনারেল-পারপাস যন্ত্র যা তাদের সফটওয়্যার যা বলে তা-ই করে। এই পাঠে আমরা দেখব এর মানে আসলে বাস্তবে কী — সেই সত্যিকারের, দৈনন্দিন ক্ষেত্রগুলো যেখানে কম্পিউটিং নিঃশব্দে কাজ করে চলে।</p>'),

      h(2, 'শিক্ষা', 'education'),
      p('<p>কম্পিউটার এখন শেখার প্রায় প্রতিটি ধাপ গড়ে তোলে: শিক্ষার্থীরা বিষয় নিয়ে গবেষণা করে আর অনলাইনে অ্যাসাইনমেন্ট জমা দেয়, শিক্ষকরা ডিজিটালভাবে গ্রেড আর উপস্থিতি ট্র্যাক করেন, আর ইন্টারঅ্যাক্টিভ পাঠ — এই কোর্সের মতোই — মানুষকে ইন্টারনেট সংযোগ থাকা যেকোনো জায়গা থেকে নিজের গতিতে শিখতে দেয়। দূরশিক্ষণ, কম্পিউটার আর নেটওয়ার্কিং ছাড়া অসম্ভব, শিক্ষাকে এমন মানুষের কাছে পৌঁছে দিয়েছে যারা কখনো একটি শারীরিক ক্লাসরুমে যেতে পারতেন না।</p>'),

      h(2, 'ব্যবসা', 'business'),
      p('<p>একটি ছোট দোকানের বিলিং সফটওয়্যার থেকে শুরু করে একটি বহুজাতিক কোম্পানির ইনভেন্টরি আর পে-রোল সিস্টেম পর্যন্ত, কম্পিউটার ব্যবসার দৈনন্দিন যন্ত্রপাতি চালায়। ইমেইল আর ভিডিও কল সামনাসামনি মিটিংয়ের অনেক প্রয়োজন প্রতিস্থাপন করেছে, স্প্রেডশিট এমন হিসাব সামলায় যা আগে হাতে ঘণ্টার পর ঘণ্টা লাগত, আর ডেটা বিশ্লেষণ কোম্পানিগুলোকে অনুমানের বদলে প্রমাণের ভিত্তিতে সিদ্ধান্ত নিতে সাহায্য করে।</p>'),

      h(2, 'স্বাস্থ্যসেবা', 'healthcare'),
      p('<p>হাসপাতাল কম্পিউটার ব্যবহার করে রোগীর রেকর্ড নিরাপদে সংরক্ষণ করতে আর অনুমোদিত কর্মীদের জন্য তাৎক্ষণিকভাবে উপলব্ধ করতে, MRI আর CT স্ক্যানারের মতো ডায়াগনস্টিক যন্ত্রপাতি চালাতে, আর অ্যাপয়েন্টমেন্ট আর ওষুধের ইনভেন্টরি পরিচালনা করতে। টেলিমেডিসিন — একটি ভিডিও কলে ডাক্তার দেখানো — সম্পূর্ণভাবে এই অংশে আগে আলোচিত নেটওয়ার্কিং ধারণার উপর নির্ভরশীল।</p>'),

      h(2, 'বিনোদন', 'entertainment'),
      p('<p>ভিডিও আর গান স্ট্রিমিং, ভিডিও গেম, আর ডিজিটাল আর্ট আর ফিল্ম প্রোডাকশন — সবই কম্পিউটিং শক্তির উপর চলে। এমনকি এমন বিনোদন যা সম্পূর্ণ অফলাইন মনে হয়, যেমন একটি লাইভ কনসার্ট, সাধারণত লাইটিং, সাউন্ড মিক্সিং, আর টিকিটিং-এর জন্য পর্দার আড়ালে কম্পিউটারের উপর নির্ভর করে।</p>'),

      h(2, 'খুচরা বিক্রয়', 'retail'),
      p('<p>অনলাইন শপিং, দোকানের চেকআউট সিস্টেম, আর ইনভেন্টরি ট্র্যাকিং — সবই আধুনিক খুচরা ব্যবসা যে স্কেলে চলে সেখানে কাজ করতে কম্পিউটারের উপর নির্ভর করে। একটি একক অনলাইন অর্ডারে নিঃশব্দে একটি ওয়েবসাইট, একটি পেমেন্ট প্রসেসর, আর একটি ইনভেন্টরি ডেটাবেস জড়িত থাকে, যারা "কিনুন" ক্লিক করতে যে কয়েক সেকেন্ড লাগে তার মধ্যেই একে অপরের সাথে যোগাযোগ করে।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['ক্ষেত্র', 'একটি সাধারণ ব্যবহার'],
        [
          ['শিক্ষা', 'অনলাইন লার্নিং, ডিজিটাল গ্রেডিং আর উপস্থিতি'],
          ['ব্যবসা', 'বিলিং, পে-রোল, স্প্রেডশিট, ডেটা বিশ্লেষণ'],
          ['স্বাস্থ্যসেবা', 'রোগীর রেকর্ড, ডায়াগনস্টিক যন্ত্রপাতি, টেলিমেডিসিন'],
          ['বিনোদন', 'স্ট্রিমিং, গেমিং, ডিজিটাল ফিল্ম আর মিউজিক প্রোডাকশন'],
          ['খুচরা বিক্রয়', 'অনলাইন শপিং, চেকআউট সিস্টেম, ইনভেন্টরি ট্র্যাকিং'],
        ]
      ),
      img(
        'docs/img/basics/computer-applications-1',
        'দৈনন্দিন জীবনের পাঁচটি ক্ষেত্রের সাথে সংযুক্ত কম্পিউটার দেখানো ডায়াগ্রাম — শিক্ষা, ব্যবসা, স্বাস্থ্যসেবা, বিনোদন, আর খুচরা বিক্রয়',
        1024, 768,
        'একই জেনারেল-পারপাস কম্পিউটার, ভিন্ন সফটওয়্যার চালিয়ে, এই প্রতিটি ক্ষেত্রের পেছনের কাজ করে।'
      ),

      callout('note', '<p>লক্ষ্য করুন এই কোনো ক্ষেত্রেই নতুন কোনো "বিশেষ" কম্পিউটার দেখা যায় না — এই অংশে আগে আলোচিত একই হার্ডওয়্যার আর সফটওয়্যার ধারণাগুলো (ইনপুট, প্রসেসিং, স্টোরেজ, নেটওয়ার্কিং) শুধু প্রতিবার একটি ভিন্ন কাজের দিকে নির্দেশিত হয়। এটাই প্রথম পাঠের সেই জেনারেল-পারপাস ধারণা, যা এখন একটি সম্পূর্ণ অর্থনীতির স্কেলে ঘটছে।</p>', 'এটা একই কম্পিউটার, শুধু ভিন্ন কাজ করছে'),

      p('<p>কম্পিউটিং এখন কোথায় আছে তা আপনি দেখেছেন। এই অংশের শেষ দুটো পাঠে আমরা সামনের দিকে তাকাব — কোয়ান্টাম কম্পিউটিং আর কৃত্রিম বুদ্ধিমত্তা, কম্পিউটিং এরপর কোন দিকে যাচ্ছে তা গড়ে তোলা দুটি সবচেয়ে বড় শক্তি।</p>'),
    ],
  },
})

lessons.push({
  slug: 'quantum-computing-intro',
  sortOrder: 15,
  en: {
    title: 'Introduction to Quantum Computing',
    metaTitle: 'Introduction to Quantum Computing | Learn Computer Academy',
    metaDescription: 'A beginner-safe introduction to quantum computing — what a qubit is, how it differs from a classical bit, and what kinds of problems it might eventually help with.',
    blocks: [
      p('<p>Every computer covered so far in this section — from the first vacuum-tube machines to the laptop or phone you\'re reading this on — is a <b>classical computer</b>, built on the binary bits covered in the number systems lesson. <b>Quantum computing</b> is a very different, much newer approach that is still mostly experimental. This lesson keeps things at a beginner-safe level: the core idea, not the physics.</p>'),

      h(2, 'A Quick Reminder: The Classical Bit'),
      p('<p>As covered earlier in this section, a classical <b>bit</b> is always in exactly one of two states: 0 or 1, on or off. Every classical computer, no matter how powerful, processes information one definite state at a time, even when it does so billions of times per second.</p>'),

      h(2, 'The Qubit: Quantum Computing\'s Basic Unit'),
      p('<p>A quantum computer\'s basic unit is called a <b>qubit</b> (quantum bit). Instead of being locked into 0 or 1 the way a classical bit is, a qubit can exist in a special in-between state — commonly described as being 0 and 1 "at the same time" — until it is measured, at which point it settles into a definite 0 or 1. This property is called <b>superposition</b>, and it is the single most important idea to take from this lesson: it is also a simplification of genuinely strange physics that even professional physicists describe carefully, so treat "at the same time" as a beginner-friendly approximation, not a literal, complete description.</p>'),

      h(2, 'Why This Could Matter'),
      p('<p>Because a group of qubits in superposition can represent many possible combinations of 0s and 1s simultaneously, a quantum computer may be able to explore a huge number of possibilities in parallel for certain specific problems — rather than checking them one at a time, the way a classical computer must. This does not make quantum computers faster at everyday tasks like browsing the web or editing a document; the advantage, where it exists, is narrow and specific.</p>'),

      h(2, 'Where Quantum Computing Might Help'),
      p('<p>Researchers are exploring quantum computing for a handful of specific problem types: simulating molecules and chemical reactions for drug and materials research, optimization problems with enormous numbers of possible combinations (like complex logistics or scheduling), and certain areas of cryptography. It is not expected to replace the classical computer on your desk — the two are built for different kinds of problems entirely.</p>'),

      h(2, 'At a Glance'),
      table(
        ['Classical bit', 'Qubit'],
        [
          ['Always exactly 0 or 1', 'Can exist in superposition — an in-between state until measured'],
          ['Processes one state at a time', 'Can represent many combinations of states at once'],
          ['Powers every computer covered in this section', 'Powers experimental, specialized quantum computers'],
        ]
      ),
      img(
        'docs/img/basics/quantum-computing-intro-1',
        'Diagram comparing a classical bit, which is always either 0 or 1, with a qubit, which can exist as a blend of 0 and 1 at the same time',
        1024, 768,
        'A classical bit is always one state or the other; a qubit can exist as a blend of both until measured.'
      ),

      callout('note', '<p>Quantum computers are still experimental, expensive, and difficult to build reliably — they are not sold as everyday consumer devices, and this is unlikely to change soon. Nothing about the classical computers covered in the rest of this section is going away; quantum computing is a specialized tool for a narrow set of very hard problems, not a general replacement.</p>', 'This Is Not Coming to Your Desk Anytime Soon'),

      p('<p>The final lesson in this section looks at a very different but equally future-facing topic: artificial intelligence, and why it has become such a major part of how people think about computing today.</p>'),
    ],
  },
  bn: {
    title: 'কোয়ান্টাম কম্পিউটিং পরিচিতি',
    metaTitle: 'কোয়ান্টাম কম্পিউটিং পরিচিতি | Learn Computer Academy',
    metaDescription: 'কোয়ান্টাম কম্পিউটিং-এর একটি সহজবোধ্য পরিচিতি — একটি কিউবিট কী, এটি একটি সাধারণ বিট থেকে কীভাবে আলাদা, আর এটি কোন ধরনের সমস্যায় ভবিষ্যতে সাহায্য করতে পারে।',
    blocks: [
      p('<p>এই অংশে এখন পর্যন্ত আলোচিত প্রতিটি কম্পিউটার — প্রথম ভ্যাকুয়াম-টিউব যন্ত্র থেকে শুরু করে আপনি এখন যে ল্যাপটপ বা ফোনে এটি পড়ছেন — একটি <b>ক্লাসিক্যাল কম্পিউটার</b>, যা সংখ্যা পদ্ধতি পাঠে আলোচিত বাইনারি বিটের উপর তৈরি। <b>কোয়ান্টাম কম্পিউটিং</b> একটি সম্পূর্ণ ভিন্ন, অনেক নতুন পদ্ধতি যা এখনও বেশিরভাগ পরীক্ষামূলক। এই পাঠে আমরা বিষয়টি একটি সহজবোধ্য স্তরেই রাখব: মূল ধারণা, পদার্থবিজ্ঞান নয়।</p>'),

      h(2, 'একটি দ্রুত স্মরণ: ক্লাসিক্যাল বিট', 'a-quick-reminder-the-classical-bit'),
      p('<p>এই অংশে আগে আলোচিত হয়েছে, একটি ক্লাসিক্যাল <b>বিট</b> সবসময় দুটি অবস্থার একটিতে থাকে: 0 বা 1, চালু বা বন্ধ। প্রতিটি ক্লাসিক্যাল কম্পিউটার, যত শক্তিশালীই হোক না কেন, একবারে একটি নির্দিষ্ট অবস্থার তথ্য প্রসেস করে, এমনকি প্রতি সেকেন্ডে শত কোটি বার করলেও।</p>'),

      h(2, 'কিউবিট: কোয়ান্টাম কম্পিউটিং-এর মৌলিক একক', 'the-qubit-quantum-computings-basic-unit'),
      p('<p>একটি কোয়ান্টাম কম্পিউটারের মৌলিক এককের নাম <b>কিউবিট</b> (quantum bit)। একটি ক্লাসিক্যাল বিটের মতো 0 বা 1-এ আটকে থাকার বদলে, একটি কিউবিট একটি বিশেষ মাঝামাঝি অবস্থায় থাকতে পারে — সাধারণত বর্ণনা করা হয় "একই সাথে" 0 আর 1 হিসেবে — যতক্ষণ না এটি পরিমাপ করা হয়, তখন এটি একটি নির্দিষ্ট 0 বা 1-এ স্থির হয়ে যায়। এই বৈশিষ্ট্যকে বলা হয় <b>সুপারপজিশন</b>, আর এই পাঠ থেকে নেওয়ার সবচেয়ে গুরুত্বপূর্ণ ধারণা এটাই: এটি সত্যিকারের অদ্ভুত পদার্থবিজ্ঞানের একটি সরলীকরণও, যা পেশাদার পদার্থবিদরাও সাবধানে বর্ণনা করেন, তাই "একই সাথে"-কে একটি শিক্ষার্থী-বান্ধব আনুমানিক বর্ণনা হিসেবে ধরুন, একটি আক্ষরিক, সম্পূর্ণ বর্ণনা হিসেবে নয়।</p>'),

      h(2, 'এটি কেন গুরুত্বপূর্ণ হতে পারে', 'why-this-could-matter'),
      p('<p>সুপারপজিশনে থাকা একদল কিউবিট একই সাথে 0 আর 1-এর অনেক সম্ভাব্য সমন্বয় প্রতিনিধিত্ব করতে পারে বলে, একটি কোয়ান্টাম কম্পিউটার নির্দিষ্ট কিছু সমস্যার জন্য একসাথে অনেক সম্ভাবনা খুঁজে দেখতে সক্ষম হতে পারে — একটি ক্লাসিক্যাল কম্পিউটারের মতো একবারে একটি করে পরীক্ষা করার বদলে। এর মানে এই নয় যে কোয়ান্টাম কম্পিউটার ওয়েব ব্রাউজ করা বা একটি ডকুমেন্ট এডিট করার মতো দৈনন্দিন কাজে দ্রুত — যেখানে এই সুবিধা আছে, তা সংকীর্ণ আর নির্দিষ্ট।</p>'),

      h(2, 'কোয়ান্টাম কম্পিউটিং কোথায় সাহায্য করতে পারে', 'where-quantum-computing-might-help'),
      p('<p>গবেষকরা নির্দিষ্ট কয়েক ধরনের সমস্যার জন্য কোয়ান্টাম কম্পিউটিং নিয়ে গবেষণা করছেন: ওষুধ আর উপাদান গবেষণার জন্য অণু আর রাসায়নিক বিক্রিয়া সিমুলেট করা, বিশাল সংখ্যক সম্ভাব্য সমন্বয়যুক্ত অপ্টিমাইজেশন সমস্যা (যেমন জটিল লজিস্টিক্স বা শিডিউলিং), আর ক্রিপ্টোগ্রাফির কিছু নির্দিষ্ট ক্ষেত্র। এটি আপনার ডেস্কের ক্লাসিক্যাল কম্পিউটারকে প্রতিস্থাপন করবে বলে আশা করা হয় না — দুটোই সম্পূর্ণ ভিন্ন ধরনের সমস্যার জন্য তৈরি।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['ক্লাসিক্যাল বিট', 'কিউবিট'],
        [
          ['সবসময় ঠিক 0 বা 1', 'সুপারপজিশনে থাকতে পারে — পরিমাপ না হওয়া পর্যন্ত একটি মাঝামাঝি অবস্থা'],
          ['একবারে একটি অবস্থা প্রসেস করে', 'একই সাথে অনেক অবস্থার সমন্বয় প্রতিনিধিত্ব করতে পারে'],
          ['এই অংশে আলোচিত প্রতিটি কম্পিউটার চালায়', 'পরীক্ষামূলক, বিশেষায়িত কোয়ান্টাম কম্পিউটার চালায়'],
        ]
      ),
      img(
        'docs/img/basics/quantum-computing-intro-1',
        'একটি ক্লাসিক্যাল বিট, যা সবসময় 0 বা 1, আর একটি কিউবিট, যা একই সাথে 0 আর 1-এর মিশ্রণ হিসেবে থাকতে পারে, তুলনা করা ডায়াগ্রাম',
        1024, 768,
        'একটি ক্লাসিক্যাল বিট সবসময় একটি অবস্থা বা অন্যটি; একটি কিউবিট পরিমাপ না হওয়া পর্যন্ত দুটোরই মিশ্রণ হিসেবে থাকতে পারে।'
      ),

      callout('note', '<p>কোয়ান্টাম কম্পিউটার এখনও পরীক্ষামূলক, ব্যয়বহুল, আর নির্ভরযোগ্যভাবে তৈরি করা কঠিন — এগুলো দৈনন্দিন ভোক্তা ডিভাইস হিসেবে বিক্রি হয় না, আর শীঘ্রই এটি বদলানোর সম্ভাবনা কম। এই অংশে আলোচিত ক্লাসিক্যাল কম্পিউটার নিয়ে কিছুই হারিয়ে যাচ্ছে না; কোয়ান্টাম কম্পিউটিং খুব কঠিন সমস্যার একটি সংকীর্ণ সেটের জন্য একটি বিশেষায়িত টুল, একটি সাধারণ প্রতিস্থাপন নয়।</p>', 'এটি শীঘ্রই আপনার ডেস্কে আসছে না'),

      p('<p>এই অংশের শেষ পাঠে আমরা একটি সম্পূর্ণ ভিন্ন কিন্তু সমানভাবে ভবিষ্যৎমুখী বিষয় দেখব: কৃত্রিম বুদ্ধিমত্তা, আর কেন এটি আজকের দিনে মানুষ কম্পিউটিং নিয়ে কীভাবে ভাবে তার এত বড় একটি অংশ হয়ে উঠেছে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'artificial-intelligence-basics',
  sortOrder: 16,
  en: {
    title: 'Artificial Intelligence Basics',
    metaTitle: 'Artificial Intelligence Basics | Learn Computer Academy',
    metaDescription: 'What artificial intelligence actually means, where it already shows up in daily life, and the honest limits and ethical questions worth keeping in mind.',
    blocks: [
      p('<p>Back in the generations-of-computers lesson, artificial intelligence was named as the technology defining the fifth generation of computing. This final lesson in the Computer Basics section looks at what that actually means — what AI is, where you already encounter it, and its honest limits.</p>'),

      h(2, 'What Artificial Intelligence Actually Is'),
      p('<p><b>Artificial intelligence (AI)</b> is software built to perform tasks that normally require human-like judgment — recognizing an image, understanding language, or making a prediction — rather than simply following a fixed, step-by-step set of instructions for every possible situation. A traditional program is explicitly told exactly what to do for each case; AI systems are instead <b>trained</b> on large amounts of example data, and they learn patterns from those examples that let them handle new, unseen situations reasonably well.</p>'),

      h(2, 'Machine Learning: How Most AI Today Actually Learns'),
      p('<p>The most common approach behind today\'s AI is called <b>machine learning</b>: instead of a programmer writing exact rules, the software is shown enormous amounts of example data — millions of labeled photos to learn what a cat looks like, for instance — and it gradually adjusts itself to get better at the task. The "learning" is really a mathematical process of adjustment, repeated an enormous number of times, not learning in the human sense of understanding.</p>'),

      h(2, 'Where You Already Use AI'),
      p('<p>AI is already woven into tools you likely use daily. <b>Voice assistants</b> use AI to understand spoken language. <b>Search engines and recommendation systems</b> use it to guess what you\'re looking for or might want to watch next. <b>Navigation apps</b> use it to predict traffic and suggest routes. <b>Chatbots</b> use it to hold a conversation. <b>Photo apps</b> use it to recognize faces and objects in your pictures. In each case, the same core idea applies: the software was trained on huge amounts of past examples rather than explicitly programmed with a rule for every situation.</p>'),

      h(2, 'What AI Cannot Actually Do'),
      p('<p>Despite how convincingly it can sometimes perform, today\'s AI does not genuinely understand meaning, have beliefs, or think the way a person does — it recognizes and reproduces patterns from its training data, extremely well in many cases, but without comprehension behind it. It can also be confidently wrong, and it can reflect biases present in the data it was trained on. Treating AI output as always correct, rather than as a well-informed guess, is one of the most common mistakes people make with it today.</p>'),

      h(2, 'A Note on Ethics'),
      p('<p>Because AI systems learn from real-world data, they can pick up and repeat unfair patterns already present in that data. Because they can generate convincing text, images, and video, they can also be misused to spread misinformation or impersonate real people. None of this makes AI inherently good or bad — like every technology covered in this section, it is a tool, and the responsibility for using it well sits with the people building and using it.</p>'),

      h(2, 'At a Glance'),
      table(
        ['Term', 'What it means'],
        [
          ['Artificial intelligence', 'Software that performs tasks normally requiring human-like judgment'],
          ['Machine learning', 'The most common technique behind modern AI — learning patterns from example data'],
          ['Training data', 'The large set of examples an AI system learns from'],
        ]
      ),
      img(
        'docs/img/basics/artificial-intelligence-basics-1',
        'Diagram showing where artificial intelligence already shows up in daily life — voice assistants, search and recommendations, navigation apps, chatbots, and photo recognition',
        1024, 768,
        'AI already sits quietly behind several tools most people use every single day.'
      ),

      callout('note', '<p>This is a fast-moving field, and specific tools and capabilities change quickly — but the core idea in this lesson does not: AI systems learn patterns from data rather than following explicit, hand-written rules, and that single distinction is what separates them from every other type of software covered in this section.</p>', 'The Core Idea Outlasts Any Specific Tool'),

      p('<p>This closes out the Computer Basics section. You have gone from "what is a computer" all the way to the technologies shaping where computing is headed next — a foundation the rest of this site\'s lessons build on directly.</p>'),
    ],
  },
  bn: {
    title: 'কৃত্রিম বুদ্ধিমত্তার প্রাথমিক ধারণা',
    metaTitle: 'কৃত্রিম বুদ্ধিমত্তার প্রাথমিক ধারণা | Learn Computer Academy',
    metaDescription: 'কৃত্রিম বুদ্ধিমত্তা আসলে কী বোঝায়, দৈনন্দিন জীবনে এটি ইতিমধ্যে কোথায় দেখা যায়, আর মনে রাখার মতো সৎ সীমাবদ্ধতা আর নৈতিক প্রশ্ন।',
    blocks: [
      p('<p>কম্পিউটারের প্রজন্মসমূহ পাঠে, কৃত্রিম বুদ্ধিমত্তাকে কম্পিউটিং-এর পঞ্চম প্রজন্ম নির্ধারণকারী প্রযুক্তি হিসেবে উল্লেখ করা হয়েছিল। Computer Basics অংশের এই শেষ পাঠে আমরা দেখব এর মানে আসলে কী — AI কী, আপনি ইতিমধ্যে কোথায় এর মুখোমুখি হন, আর এর সৎ সীমাবদ্ধতা।</p>'),

      h(2, 'কৃত্রিম বুদ্ধিমত্তা আসলে কী', 'what-artificial-intelligence-actually-is'),
      p('<p><b>কৃত্রিম বুদ্ধিমত্তা (AI)</b> হলো এমন সফটওয়্যার যা সাধারণত মানুষের মতো বিচার-বুদ্ধি প্রয়োজন এমন কাজ সম্পন্ন করার জন্য তৈরি — একটি ছবি চেনা, ভাষা বোঝা, বা একটি পূর্বাভাস দেওয়া — প্রতিটি সম্ভাব্য পরিস্থিতির জন্য একটি নির্দিষ্ট, ধাপে-ধাপে নির্দেশাবলীর সেট অনুসরণ করার বদলে। একটি প্রচলিত প্রোগ্রামকে প্রতিটি ক্ষেত্রে ঠিক কী করতে হবে স্পষ্টভাবে বলে দেওয়া হয়; AI সিস্টেম এর বদলে প্রচুর পরিমাণ উদাহরণ তথ্যের উপর <b>প্রশিক্ষিত</b> হয়, আর সেই উদাহরণগুলো থেকে প্যাটার্ন শেখে যা তাদের নতুন, অদেখা পরিস্থিতি মোটামুটি ভালোভাবে সামলাতে দেয়।</p>'),

      h(2, 'মেশিন লার্নিং: আজকের বেশিরভাগ AI আসলে যেভাবে শেখে', 'machine-learning-how-most-ai-today-actually-learns'),
      p('<p>আজকের AI-এর পেছনে সবচেয়ে সাধারণ পদ্ধতিকে বলা হয় <b>মেশিন লার্নিং</b>: একজন প্রোগ্রামার সঠিক নিয়ম লেখার বদলে, সফটওয়্যারকে বিশাল পরিমাণ উদাহরণ তথ্য দেখানো হয় — যেমন একটি বিড়াল দেখতে কেমন তা শেখার জন্য লাখ লাখ লেবেল করা ছবি — আর এটি ধীরে ধীরে নিজেকে সমন্বয় করে কাজে আরও ভালো হয়ে ওঠে। এই "শেখা" আসলে একটি গাণিতিক সমন্বয় প্রক্রিয়া, বিপুল সংখ্যক বার পুনরাবৃত্তি করা, মানুষের অর্থে "বোঝা" নয়।</p>'),

      h(2, 'আপনি ইতিমধ্যেই যেখানে AI ব্যবহার করছেন', 'where-you-already-use-ai'),
      p('<p>AI ইতিমধ্যেই আপনি সম্ভবত প্রতিদিন ব্যবহার করেন এমন টুলে বোনা হয়ে আছে। <b>ভয়েস অ্যাসিস্ট্যান্ট</b> কথ্য ভাষা বুঝতে AI ব্যবহার করে। <b>সার্চ ইঞ্জিন আর সুপারিশ সিস্টেম</b> আপনি কী খুঁজছেন বা পরে কী দেখতে চাইতে পারেন তা অনুমান করতে এটি ব্যবহার করে। <b>নেভিগেশন অ্যাপ</b> ট্র্যাফিক পূর্বাভাস আর রুট সুপারিশ করতে এটি ব্যবহার করে। <b>চ্যাটবট</b> একটি কথোপকথন চালিয়ে যেতে এটি ব্যবহার করে। <b>ফটো অ্যাপ</b> আপনার ছবিতে মুখ আর বস্তু চিনতে এটি ব্যবহার করে। প্রতিটি ক্ষেত্রেই একই মূল ধারণা প্রযোজ্য: সফটওয়্যারটি প্রতিটি পরিস্থিতির জন্য একটি নিয়ম দিয়ে স্পষ্টভাবে প্রোগ্রাম করার বদলে অতীতের বিশাল পরিমাণ উদাহরণের উপর প্রশিক্ষিত হয়েছিল।</p>'),

      h(2, 'AI আসলে কী করতে পারে না', 'what-ai-cannot-actually-do'),
      p('<p>এটি মাঝে মাঝে যতই বিশ্বাসযোগ্যভাবে কাজ করুক না কেন, আজকের AI সত্যিকারের অর্থ বোঝে না, বিশ্বাস রাখে না, বা মানুষের মতো চিন্তা করে না — এটি তার প্রশিক্ষণ তথ্য থেকে প্যাটার্ন চেনে আর পুনরুৎপাদন করে, অনেক ক্ষেত্রেই অত্যন্ত ভালোভাবে, কিন্তু এর পেছনে কোনো উপলব্ধি ছাড়াই। এটি আত্মবিশ্বাসের সাথে ভুলও হতে পারে, আর এটি যে তথ্যের উপর প্রশিক্ষিত হয়েছে তাতে থাকা পক্ষপাতও প্রতিফলিত করতে পারে। AI-এর আউটপুটকে সবসময় সঠিক ধরে নেওয়া, একটি ভালোভাবে জানা অনুমানের বদলে, আজকের দিনে মানুষ AI নিয়ে যে সবচেয়ে সাধারণ ভুলগুলো করে তার একটি।</p>'),

      h(2, 'নৈতিকতা নিয়ে একটি নোট', 'a-note-on-ethics'),
      p('<p>যেহেতু AI সিস্টেম বাস্তব-জগতের তথ্য থেকে শেখে, তারা সেই তথ্যে ইতিমধ্যে থাকা অন্যায্য প্যাটার্নও গ্রহণ আর পুনরাবৃত্তি করতে পারে। যেহেতু তারা বিশ্বাসযোগ্য টেক্সট, ছবি, আর ভিডিও তৈরি করতে পারে, তাদের অপব্যবহার করে ভুল তথ্য ছড়ানো বা প্রকৃত মানুষের ছদ্মবেশ ধারণ করাও সম্ভব। এর কোনোটিই AI-কে সহজাতভাবে ভালো বা খারাপ করে তোলে না — এই অংশে আলোচিত প্রতিটি প্রযুক্তির মতোই, এটি একটি টুল, আর এটি ভালোভাবে ব্যবহার করার দায়িত্ব যারা এটি তৈরি করছে আর ব্যবহার করছে তাদের উপর বর্তায়।</p>'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['শব্দ', 'এর মানে কী'],
        [
          ['কৃত্রিম বুদ্ধিমত্তা', 'সফটওয়্যার যা সাধারণত মানুষের মতো বিচার-বুদ্ধি প্রয়োজন এমন কাজ সম্পন্ন করে'],
          ['মেশিন লার্নিং', 'আধুনিক AI-এর পেছনের সবচেয়ে সাধারণ কৌশল — উদাহরণ তথ্য থেকে প্যাটার্ন শেখা'],
          ['প্রশিক্ষণ তথ্য', 'একটি AI সিস্টেম যা থেকে শেখে সেই বিশাল উদাহরণের সেট'],
        ]
      ),
      img(
        'docs/img/basics/artificial-intelligence-basics-1',
        'দৈনন্দিন জীবনে কৃত্রিম বুদ্ধিমত্তা ইতিমধ্যে কোথায় দেখা যায় তা দেখানো ডায়াগ্রাম — ভয়েস অ্যাসিস্ট্যান্ট, সার্চ আর সুপারিশ, নেভিগেশন অ্যাপ, চ্যাটবট, আর ফটো রিকগনিশন',
        1024, 768,
        'বেশিরভাগ মানুষ প্রতিদিন ব্যবহার করেন এমন বেশ কয়েকটি টুলের পেছনে AI ইতিমধ্যেই নিঃশব্দে বসে আছে।'
      ),

      callout('note', '<p>এটি একটি দ্রুত পরিবর্তনশীল ক্ষেত্র, আর নির্দিষ্ট টুল আর ক্ষমতা দ্রুত বদলায় — কিন্তু এই পাঠের মূল ধারণাটি বদলায় না: AI সিস্টেম স্পষ্ট, হাতে-লেখা নিয়ম অনুসরণ করার বদলে তথ্য থেকে প্যাটার্ন শেখে, আর এই একটি পার্থক্যই তাদের এই অংশে আলোচিত অন্য প্রতিটি ধরনের সফটওয়্যার থেকে আলাদা করে।</p>', 'মূল ধারণাটি যেকোনো নির্দিষ্ট টুলের চেয়ে বেশি দিন টিকে থাকে'),

      p('<p>এখানেই Computer Basics অংশ শেষ হচ্ছে। "কম্পিউটার কী" থেকে শুরু করে কম্পিউটিং এরপর কোন দিকে যাচ্ছে তা গড়ে তোলা প্রযুক্তি পর্যন্ত আপনি পুরো পথ পার হয়েছেন — একটি ভিত্তি যার উপর এই সাইটের বাকি পাঠগুলো সরাসরি গড়ে উঠবে।</p>'),
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
