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
