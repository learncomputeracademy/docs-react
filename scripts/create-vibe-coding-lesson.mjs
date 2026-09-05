#!/usr/bin/env node
// Adds one new lesson to the "ai" category: "Vibe Coding — Working With AI
// Coding Tools Well". Source: roadmap.sh's Vibe Coding roadmap PDF
// (user-supplied 2026-09-03) — practical workflow-discipline content
// (planning, standards, prompting, context hygiene, debugging, git, testing,
// security), deliberately distinct from the companion Claude Code roadmap
// PDF, which was judged too deep/tool-reference-y for this course and was
// NOT built (see D-126 discussion in DECISIONS.md).
//
// Inserted at sort_order 12, right after ai/ai-coding-assistants (11) and
// before ai/building-an-ai-chatbot-for-a-website (was 12) — this script
// bumps every existing ai/* doc with sort_order >= 12 up by one first, then
// inserts the new lesson. Idempotent: safe to re-run (bump step only moves
// docs that are still below their target, insert step is upsert-by-path).
//
// Usage: node scripts/create-vibe-coding-lesson.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

function h(level, text, anchor) {
  const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor: a }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function code(language, codeText) { return { id: nanoid(12), type: 'code', language, code: codeText.trim() } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function table(header, rows, caption) { return { id: nanoid(12), type: 'table', header, rows, caption } }
function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }
function ul(items) { return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>` }

const lesson = {
  slug: 'vibe-coding',
  sortOrder: 12,
  en: {
    title: 'Vibe Coding — Working With AI Coding Tools Well',
    metaTitle: 'Vibe Coding — Working With AI Coding Tools Well | Learn Computer Academy',
    metaDescription: 'How to actually work with AI coding tools like Claude Code, Cursor, and v0 — planning, prompting, context management, debugging, version control, testing, and security habits.',
    blocks: [
      p('<p><b>Vibe coding</b> is building software by describing what you want in plain language and letting an AI tool write and edit the code, rather than typing every line yourself. The name comes from just going with the "vibe" of an idea and iterating with the AI instead of planning every detail up front.</p>'),
      p('<p>It works — a lot of real software today is built this way. But "just describe it and hope" only gets you so far. Past a small demo, vibe coding without discipline produces code that breaks in ways neither you nor the AI can explain. This lesson is that discipline: a set of habits that make AI-assisted coding actually reliable.</p>'),

      h(2, 'The Vibe Coder Mindset'),
      p('<p>You are still the one responsible for the result. The AI is fast and tireless, but it doesn\'t know your product, your users, or your standards unless you tell it — and it will confidently produce code that looks right and isn\'t. Treat it like a very capable junior developer: give clear direction, review the work, and catch problems before they compound.</p>'),
      callout('note', '<p>Popular AI coding tools today include <b>Claude Code</b>, ChatGPT, Gemini, Cursor, and Windsurf for general-purpose coding, and <b>v0</b>, Lovable, and Replit for fast frontend/full-app prototyping. This lesson isn\'t a comparison of them — the habits below apply to whichever one you use.</p>', 'Which Tool?'),

      h(2, 'Plan Before You Code'),
      p('<p>The biggest difference between a smooth AI-assisted build and a messy one is whether planning happened first.</p>'),
      p(ul([
        'Plan what you actually need (a minimum viable version, then the phases after it) before asking for code.',
        'Work step by step — build and verify one piece at a time rather than asking for the whole app at once.',
        'Give the AI examples, not just descriptions: mockups, sample data, reference code, screenshots of a similar UI.',
      ])),
      p('<p>For example: tell the tool what you\'re building, ask it to help refine the idea and break it into phases, then ask it to write that plan into a document. You can point back at that document for the rest of the build instead of re-explaining the idea every session.</p>'),

      h(2, 'Establish Standards Early'),
      p('<p>AI repeats whatever pattern it starts with. If the first few files it writes have a bad habit — inconsistent naming, one giant file instead of small modules, no error handling — every file after that copies the same habit, and it compounds fast.</p>'),
      p(ul([
        'Pick a popular, well-documented tech stack rather than something new or niche — the AI has seen far more of it in training.',
        'If you have style or structure preferences, write them down and give them to the AI rather than assuming it will guess.',
        'Ask explicitly for modular code — smaller files and functions instead of one file that keeps growing.',
        'Review the AI\'s first outputs carefully. Catching a bad pattern in file one is cheap; catching it in file thirty is a rewrite.',
        'Ask the AI to review and refactor the codebase periodically — it will happily keep appending code and skip cleanup unless you ask.',
      ])),

      h(2, 'Prompting Practices That Actually Help'),
      table(
        ['Do', 'Instead of'],
        [
          ['One specific task per message', 'Five different requests bundled together'],
          ['Concrete detail: "add a submit button that disables while saving"', 'Vague direction: "make the form better"'],
          ['Tell it what NOT to do, based on past mistakes it made', 'Assuming it remembers what went wrong last time'],
          ['Attach a mockup, file, or sample when one exists', 'Describing a visual in words only'],
          ['Ask it to "think it through" before a genuinely hard problem', 'Expecting a first-try correct answer on something tricky'],
        ]
      ),
      p('<p>A useful framing prompt when it helps: ask the AI to <b>"act as"</b> a specific role — a UX researcher, a security reviewer, a senior backend engineer — before asking your actual question. It focuses the kind of answer you get.</p>'),

      h(2, 'Keep a Context Document'),
      p('<p>Most AI coding tools can read a project instructions file automatically — Claude Code uses <code>CLAUDE.md</code>, other tools use similar conventions. Put your stack, conventions, and any recurring instructions there once, instead of repeating them in every conversation.</p>'),
      p('<p>If you catch yourself typing the same instruction more than once, that\'s the signal to add it to the document instead. After a long session where the AI learned something useful about your codebase, it can help to ask it to summarise that learning into the document itself.</p>'),

      h(2, 'Manage Context Deliberately'),
      p('<p>AI tools work from a limited window of recent conversation — the more unrelated stuff is in it, the worse and slower the answers get.</p>'),
      p(ul([
        'Starting an unrelated task? Clear the conversation or start a new one rather than continuing the old thread.',
        'If the AI fails after about three attempts at the same problem, stop — start a fresh chat instead of digging deeper into a confused one.',
        'Clearing context regularly also keeps token costs down, since every message re-sends the whole conversation so far.',
      ])),

      h(2, 'Let AI Debug — But Understand the Fix'),
      p('<p>When something breaks, paste the actual error message and the relevant code, and let the AI explain what went wrong before it fixes it. Don\'t just accept a patch you don\'t understand — ask for a plain-language explanation if the first one is too technical. If a fix doesn\'t hold, ask for a list of other possible causes instead of trying random changes.</p>'),
      callout('tip', '<p>Adding a log line or two near the failing code and re-running it before asking the AI to guess often finds the real cause faster than several rounds of back-and-forth.</p>', 'Add Logs First'),

      h(2, 'Master Version Control'),
      p('<p>AI-generated changes can go wrong in ways that are hard to spot at a glance. Git is your safety net — use it like one.</p>'),
      p(ul([
        'Start each new feature from a clean, committed state, so a bad AI attempt is easy to throw away.',
        'Commit after every working step — small, frequent commits, not one giant commit at the end.',
        'Ask the AI to write the commit message: a short summary of what changed and why. It has full context on what it just did.',
        'If something goes wrong, revert with Git rather than asking the AI to "undo" — its own undo isn\'t as reliable as a real version history.',
      ])),
      p('<p>Most AI coding tools can run Git and GitHub CLI commands directly when asked — committing, branching, opening a pull request — so you don\'t have to switch out of the conversation to do it yourself.</p>'),

      h(2, 'Test What Gets Built'),
      p('<p>Left alone, an AI tool\'s default is to write the feature and stop — minimal or no tests. That\'s exactly backwards for code you didn\'t write by hand and can\'t fully verify by reading.</p>'),
      p(ul([
        'Whenever a feature is built, ask for basic tests right away, not "later."',
        'For anything with a real user flow, ask for end-to-end tests too — they catch a wider class of real breakage than unit tests alone.',
        'Consider test-driven development for tricky logic: ask for a test first, watch it fail, then ask for the code that makes it pass.',
        'Found a bug? Ask the AI to write a test that reproduces it before fixing it — that test then guards against the same bug coming back.',
      ])),
      p('<p>Once tests exist, refactoring stops being scary — a passing test suite is what tells you a cleanup didn\'t quietly break something.</p>'),

      h(2, 'Security: Never Hardcode Secrets'),
      callout('warning', '<p>Never let an AI tool put a password, API key, or token directly in your code. If you notice it doing this, stop and ask it to use an environment variable instead — this is one of the most common beginner mistakes, and one of the most dangerous, since a hardcoded secret committed to Git is exposed the moment the repo is shared or pushed anywhere public.</p>', 'The One Rule That Matters Most'),
      p('<p>Beyond secrets, it\'s worth explicitly asking the AI to do a security pass on anything handling user input, authentication, or payments before it ships — it won\'t volunteer this on its own unless asked.</p>'),

      h(2, 'Where This Leaves You'),
      p('<p>None of this replaces understanding what the code does — it\'s the set of habits that make working with an AI coding tool feel like working with a fast, careful collaborator instead of a slot machine. Plan first, set standards early, prompt specifically, manage context, verify fixes, commit often, test by default, and never let a secret slip into the code. Everything else is picking whichever tool fits the job.</p>')
    ],
  },
  bn: {
    title: 'ভাইব কোডিং — AI কোডিং টুল ভালোভাবে ব্যবহার করা',
    metaTitle: 'ভাইব কোডিং — AI কোডিং টুল ভালোভাবে ব্যবহার করা | Learn Computer Academy',
    metaDescription: 'Claude Code, Cursor, আর v0-এর মতো AI কোডিং টুল আসলে কীভাবে ব্যবহার করবেন — পরিকল্পনা, প্রম্পটিং, কনটেক্সট ম্যানেজমেন্ট, ডিবাগিং, ভার্সন কন্ট্রোল, টেস্টিং, আর নিরাপত্তা অভ্যাস।',
    blocks: [
      p('<p><b>ভাইব কোডিং</b> হলো সাধারণ ভাষায় আপনি কী চান তা বর্ণনা করে সফটওয়্যার তৈরি করা, প্রতিটি লাইন নিজে না লিখে একটি AI টুলকে কোড লিখতে আর সম্পাদনা করতে দেওয়া। নামটি এসেছে প্রতিটি খুঁটিনাটি আগে থেকে পরিকল্পনা না করে একটি আইডিয়ার "ভাইব" অনুসরণ করে AI-এর সাথে ধাপে ধাপে এগোনো থেকে।</p>'),
      p('<p>এটি কাজ করে — আজকের অনেক বাস্তব সফটওয়্যার এভাবেই তৈরি। কিন্তু শুধু "বর্ণনা করো আর আশা করো" একটা ছোট ডেমোর বেশি নিয়ে যায় না। শৃঙ্খলা ছাড়া ভাইব কোডিং এমন কোড তৈরি করে যা এমনভাবে ভাঙে যা আপনি বা AI কেউই ব্যাখ্যা করতে পারবে না। এই পাঠ সেই শৃঙ্খলা — এমন কিছু অভ্যাস যা AI-সহায়ক কোডিংকে আসলেই নির্ভরযোগ্য করে তোলে।</p>'),

      h(2, 'ভাইব কোডারের মানসিকতা', 'the-vibe-coder-mindset'),
      p('<p>ফলাফলের দায়িত্ব এখনও আপনারই। AI দ্রুত আর ক্লান্তিহীন, কিন্তু আপনি না বললে এটি আপনার প্রোডাক্ট, ইউজার, বা মান জানে না — আর এটি আত্মবিশ্বাসের সাথে এমন কোড তৈরি করবে যা দেখতে ঠিক মনে হয় কিন্তু আসলে নয়। এটিকে একজন খুব দক্ষ জুনিয়র ডেভেলপারের মতো ভাবুন: স্পষ্ট দিকনির্দেশনা দিন, কাজ পর্যালোচনা করুন, আর সমস্যা জমে ওঠার আগেই ধরুন।</p>'),
      callout('note', '<p>আজকের জনপ্রিয় AI কোডিং টুলের মধ্যে আছে সাধারণ-উদ্দেশ্যের কোডিংয়ের জন্য <b>Claude Code</b>, ChatGPT, Gemini, Cursor, আর Windsurf, আর দ্রুত ফ্রন্টএন্ড/ফুল-অ্যাপ প্রোটোটাইপিংয়ের জন্য <b>v0</b>, Lovable, আর Replit। এই পাঠ এগুলোর তুলনা নয় — নিচের অভ্যাসগুলো আপনি যেটাই ব্যবহার করুন না কেন প্রযোজ্য।</p>', 'কোন টুল?'),

      h(2, 'কোড লেখার আগে পরিকল্পনা করুন', 'plan-before-you-code'),
      p('<p>একটা মসৃণ AI-সহায়ক নির্মাণ আর একটা এলোমেলো নির্মাণের মধ্যে সবচেয়ে বড় পার্থক্য হলো আগে পরিকল্পনা হয়েছিল কিনা।</p>'),
      p(ul([
        'কোড চাওয়ার আগে আপনার আসলে কী দরকার তা পরিকল্পনা করুন (একটি ন্যূনতম ভায়েবল ভার্সন, তারপর এর পরের ধাপগুলো)।',
        'ধাপে ধাপে কাজ করুন — একবারে পুরো অ্যাপ চাওয়ার বদলে একটা করে অংশ তৈরি আর যাচাই করুন।',
        'শুধু বর্ণনা না দিয়ে AI-কে উদাহরণ দিন: মকআপ, নমুনা ডেটা, রেফারেন্স কোড, একই ধরনের UI-এর স্ক্রিনশট।',
      ])),
      p('<p>উদাহরণ হিসেবে: টুলকে বলুন আপনি কী তৈরি করছেন, আইডিয়াটা পরিমার্জন করতে আর ধাপে ভাগ করতে সাহায্য চান, তারপর সেই পরিকল্পনাটা একটা ডকুমেন্টে লিখতে বলুন। নির্মাণের বাকি অংশে প্রতিবার আইডিয়া নতুন করে ব্যাখ্যা না করে সেই ডকুমেন্টের দিকে ইঙ্গিত করতে পারবেন।</p>'),

      h(2, 'শুরুতেই মান স্থাপন করুন', 'establish-standards-early'),
      p('<p>AI যে প্যাটার্ন দিয়ে শুরু করে সেটাই বারবার পুনরাবৃত্তি করে। প্রথম কয়েকটা ফাইলে যদি একটা খারাপ অভ্যাস থাকে — অসামঞ্জস্যপূর্ণ নামকরণ, একটা বিশাল ফাইল ছোট মডিউলের বদলে, কোনো এরর হ্যান্ডলিং না থাকা — তার পরের প্রতিটা ফাইল একই অভ্যাস কপি করে, আর এটা দ্রুত জমতে থাকে।</p>'),
      p(ul([
        'নতুন বা নিশ (niche) কিছুর বদলে জনপ্রিয়, ভালোভাবে ডকুমেন্টেড টেক স্ট্যাক বেছে নিন — AI প্রশিক্ষণে এটা অনেক বেশি দেখেছে।',
        'আপনার স্টাইল বা স্ট্রাকচার পছন্দ থাকলে, AI অনুমান করবে ধরে না নিয়ে সেগুলো লিখে দিন।',
        'সরাসরি মডিউলার কোড চান — একটা ক্রমবর্ধমান ফাইলের বদলে ছোট ফাইল আর ফাংশন।',
        'AI-এর প্রথম আউটপুট মনোযোগ দিয়ে পর্যালোচনা করুন। প্রথম ফাইলে একটা খারাপ প্যাটার্ন ধরা সস্তা; ত্রিশতম ফাইলে ধরা একটা পুনর্লিখন।',
        'নিয়মিত AI-কে কোডবেস পর্যালোচনা আর রিফ্যাক্টর করতে বলুন — না বললে এটি খুশি মনে কোড জুড়তেই থাকবে আর পরিষ্কার করা এড়িয়ে যাবে।',
      ])),

      h(2, 'যে প্রম্পটিং অভ্যাস আসলে সাহায্য করে', 'prompting-practices-that-actually-help'),
      table(
        ['করুন', 'এর বদলে না'],
        [
          ['এক বার্তায় একটা নির্দিষ্ট কাজ', 'একসাথে পাঁচটা ভিন্ন অনুরোধ'],
          ['সুনির্দিষ্ট বিবরণ: "সেভ করার সময় নিষ্ক্রিয় থাকা একটা সাবমিট বাটন যোগ করো"', 'অস্পষ্ট নির্দেশনা: "ফর্মটা আরও ভালো করো"'],
          ['আগের ভুলের ভিত্তিতে কী করা উচিত না তা বলুন', 'ধরে নেওয়া যে এটি গত বারের ভুল মনে রেখেছে'],
          ['থাকলে একটা মকআপ, ফাইল, বা নমুনা যুক্ত করুন', 'শুধু শব্দে একটা ভিজ্যুয়াল বর্ণনা করা'],
          ['সত্যিকারের কঠিন সমস্যার আগে "চিন্তা করে দেখো" বলতে বলুন', 'কঠিন কিছুতে প্রথম চেষ্টাতেই সঠিক উত্তর আশা করা'],
        ]
      ),
      p('<p>একটা কার্যকর ফ্রেমিং প্রম্পট, যখন কাজে লাগে: আপনার আসল প্রশ্ন জিজ্ঞাসা করার আগে AI-কে একটা নির্দিষ্ট ভূমিকায় <b>"অভিনয় করতে"</b> বলুন — একজন UX গবেষক, একজন নিরাপত্তা পর্যালোচক, একজন সিনিয়র ব্যাকএন্ড ইঞ্জিনিয়ার। এটা আপনি কী ধরনের উত্তর পাচ্ছেন তা নির্দিষ্ট করে।</p>'),

      h(2, 'একটা কনটেক্সট ডকুমেন্ট রাখুন', 'keep-a-context-document'),
      p('<p>বেশিরভাগ AI কোডিং টুল স্বয়ংক্রিয়ভাবে একটা প্রোজেক্ট নির্দেশনা ফাইল পড়তে পারে — Claude Code ব্যবহার করে <code>CLAUDE.md</code>, অন্য টুল একই ধরনের কনভেনশন ব্যবহার করে। প্রতিটা কথোপকথনে পুনরাবৃত্তি না করে আপনার স্ট্যাক, কনভেনশন, আর বারবার আসা নির্দেশনা একবার সেখানে রাখুন।</p>'),
      p('<p>একই নির্দেশনা একাধিকবার টাইপ করছেন বুঝলে, সেটাই ডকুমেন্টে যোগ করার সংকেত। কোডবেস সম্পর্কে AI যদি একটা দীর্ঘ সেশনে কিছু দরকারি শিখে থাকে, সেশনের পর সেই শিক্ষাটা ডকুমেন্টে সংক্ষিপ্ত করতে বলা সাহায্য করতে পারে।</p>'),

      h(2, 'সচেতনভাবে কনটেক্সট পরিচালনা করুন', 'manage-context-deliberately'),
      p('<p>AI টুল সাম্প্রতিক কথোপকথনের একটা সীমিত উইন্ডো থেকে কাজ করে — এতে যত বেশি অপ্রাসঙ্গিক জিনিস থাকে, উত্তর তত খারাপ আর ধীর হয়।</p>'),
      p(ul([
        'অপ্রাসঙ্গিক কাজ শুরু করছেন? পুরনো থ্রেড চালিয়ে যাওয়ার বদলে কথোপকথন সাফ করুন বা নতুন একটা শুরু করুন।',
        'একই সমস্যায় প্রায় তিনবার চেষ্টার পর AI ব্যর্থ হলে, থামুন — একটা বিভ্রান্ত চ্যাটে আরও গভীরে যাওয়ার বদলে নতুন একটা শুরু করুন।',
        'নিয়মিত কনটেক্সট সাফ করা টোকেন খরচও কম রাখে, কারণ প্রতিটা বার্তা এখন পর্যন্ত পুরো কথোপকথন আবার পাঠায়।',
      ])),

      h(2, 'AI-কে ডিবাগ করতে দিন — কিন্তু সমাধান বুঝুন', 'let-ai-debug-but-understand-the-fix'),
      p('<p>কিছু ভাঙলে, আসল এরর মেসেজ আর প্রাসঙ্গিক কোড পেস্ট করুন, আর ঠিক করার আগে AI-কে ব্যাখ্যা করতে দিন কী ভুল হয়েছে। না বুঝে একটা প্যাচ গ্রহণ করবেন না — প্রথম ব্যাখ্যা খুব টেকনিক্যাল হলে সহজ ভাষায় ব্যাখ্যা চান। একটা ফিক্স যদি না টেকে, র‍্যান্ডম পরিবর্তন চেষ্টা করার বদলে অন্য সম্ভাব্য কারণের একটা তালিকা চান।</p>'),
      callout('tip', '<p>AI-কে অনুমান করতে বলার আগে ব্যর্থ কোডের কাছে এক-দুইটা লগ লাইন যোগ করে আবার চালানো প্রায়ই বেশ কয়েক দফা কথোপকথনের চেয়ে দ্রুত আসল কারণ খুঁজে পায়।</p>', 'আগে লগ যোগ করুন'),

      h(2, 'ভার্সন কন্ট্রোলে দক্ষ হন', 'master-version-control'),
      p('<p>AI-জেনারেট করা পরিবর্তন এমনভাবে ভুল হতে পারে যা এক নজরে ধরা কঠিন। Git আপনার নিরাপত্তা জাল — এটাকে সেভাবেই ব্যবহার করুন।</p>'),
      p(ul([
        'প্রতিটা নতুন ফিচার একটা পরিষ্কার, কমিট করা অবস্থা থেকে শুরু করুন, যাতে একটা খারাপ AI চেষ্টা সহজে ফেলে দেওয়া যায়।',
        'প্রতিটা কাজ করা ধাপের পর কমিট করুন — শেষে একটা বিশাল কমিটের বদলে ছোট, ঘন ঘন কমিট।',
        'কমিট মেসেজ AI-কে লিখতে বলুন: কী পরিবর্তন হলো আর কেন তার একটা সংক্ষিপ্ত সারাংশ। এইমাত্র কী করেছে সে বিষয়ে এটির পূর্ণ কনটেক্সট আছে।',
        'কিছু ভুল হলে, AI-কে "আনডু" করতে বলার বদলে Git দিয়ে revert করুন — এর নিজস্ব আনডু একটা আসল ভার্সন হিস্টরির মতো নির্ভরযোগ্য নয়।',
      ])),
      p('<p>বেশিরভাগ AI কোডিং টুল বললে সরাসরি Git আর GitHub CLI কমান্ড চালাতে পারে — কমিট করা, ব্রাঞ্চ করা, একটা পুল রিকোয়েস্ট খোলা — তাই এটা নিজে করতে কথোপকথন থেকে বের হতে হয় না।</p>'),

      h(2, 'যা তৈরি হয় তা টেস্ট করুন', 'test-what-gets-built'),
      p('<p>একা ছেড়ে দিলে, একটা AI টুলের ডিফল্ট আচরণ হলো ফিচারটা লিখে থেমে যাওয়া — ন্যূনতম বা কোনো টেস্ট ছাড়াই। যে কোড আপনি নিজে হাতে লেখেননি আর পড়ে পুরোপুরি যাচাই করতে পারেন না, তার জন্য এটা ঠিক উল্টো।</p>'),
      p(ul([
        'যখনই একটা ফিচার তৈরি হয়, "পরে" নয়, তখনই বেসিক টেস্ট চান।',
        'বাস্তব ইউজার ফ্লো থাকা যেকোনো কিছুর জন্য এন্ড-টু-এন্ড টেস্টও চান — এগুলো একা ইউনিট টেস্টের চেয়ে বেশি ধরনের প্রকৃত ভাঙন ধরে।',
        'জটিল লজিকের জন্য টেস্ট-ড্রিভেন ডেভেলপমেন্ট বিবেচনা করুন: আগে একটা টেস্ট চান, সেটা ব্যর্থ হতে দেখুন, তারপর সেটা পাস করানোর কোড চান।',
        'একটা বাগ পেয়েছেন? ঠিক করার আগে AI-কে সেটা পুনরুৎপাদন করা একটা টেস্ট লিখতে বলুন — সেই টেস্ট তখন একই বাগ ফিরে আসা থেকে রক্ষা করে।',
      ])),
      p('<p>টেস্ট থাকলে রিফ্যাক্টরিং আর ভীতিকর থাকে না — একটা পাস করা টেস্ট স্যুটই বলে দেয় যে একটা পরিষ্কার করা চুপচাপ কিছু ভাঙেনি।</p>'),

      h(2, 'নিরাপত্তা: কখনো সিক্রেট হার্ডকোড করবেন না', 'security-never-hardcode-secrets'),
      callout('warning', '<p>কখনো একটা AI টুলকে সরাসরি আপনার কোডে পাসওয়ার্ড, API কী, বা টোকেন বসাতে দেবেন না। এটা করতে দেখলে, থামুন আর এর বদলে একটা এনভায়রনমেন্ট ভেরিয়েবল ব্যবহার করতে বলুন — এটা সবচেয়ে সাধারণ শিক্ষানবিশ ভুলগুলোর একটা, আর সবচেয়ে বিপজ্জনকও, কারণ Git-এ কমিট হওয়া একটা হার্ডকোড করা সিক্রেট রিপো যেকোনো জায়গায় পাবলিকলি শেয়ার বা পুশ হওয়ার মুহূর্তেই উন্মুক্ত হয়ে যায়।</p>', 'সবচেয়ে গুরুত্বপূর্ণ একটা নিয়ম'),
      p('<p>সিক্রেটের বাইরেও, ইউজার ইনপুট, অথেন্টিকেশন, বা পেমেন্ট নিয়ে কাজ করা যেকোনো কিছুর জন্য শিপ করার আগে সরাসরি AI-কে একটা নিরাপত্তা পাস করতে বলা ভালো — না বললে এটি নিজে থেকে এটা করবে না।</p>'),

      h(2, 'এরপর কোথায়', 'where-this-leaves-you'),
      p('<p>এসবের কিছুই কোড কী করে তা বোঝার বিকল্প নয় — এটা এমন কিছু অভ্যাসের সেট যা একটা AI কোডিং টুলের সাথে কাজ করাকে একটা স্লট মেশিনের বদলে একজন দ্রুত, যত্নশীল সহকর্মীর সাথে কাজ করার মতো মনে করায়। আগে পরিকল্পনা করুন, শুরুতেই মান স্থাপন করুন, সুনির্দিষ্টভাবে প্রম্পট করুন, কনটেক্সট পরিচালনা করুন, ফিক্স যাচাই করুন, ঘন ঘন কমিট করুন, ডিফল্টভাবে টেস্ট করুন, আর কখনো একটা সিক্রেট কোডে ঢুকতে দেবেন না। বাকি সব হলো কাজের সাথে মানানসই যেকোনো টুল বেছে নেওয়া।</p>')
    ],
  },
}

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'ai').single()
  if (catErr || !category) { console.error('Category "ai" not found.'); process.exit(1) }

  // Bump every existing ai/* doc with sort_order >= 12 up by one, to make
  // room. Highest first so no two rows collide mid-shift.
  const { data: toBump, error: bumpSelErr } = await supabase.from('docs').select('id,path,sort_order').eq('category_id', category.id).gte('sort_order', lesson.sortOrder).order('sort_order', { ascending: false })
  if (bumpSelErr) { console.error('Failed to read existing ai docs:', bumpSelErr.message); process.exit(1) }

  console.log(`Category id: ${category.id}`)
  console.log(`${toBump.length} existing doc(s) with sort_order >= ${lesson.sortOrder} to bump by +1\n`)

  if (DRY_RUN) {
    for (const d of toBump) console.log(`  [bump] ${d.path}: ${d.sort_order} -> ${d.sort_order + 1}`)
    console.log(`\n  [en] ai/${lesson.slug} — ${lesson.en.title} (${lesson.en.blocks.length} blocks, sort_order ${lesson.sortOrder})`)
    console.log(`  [bn] ai/${lesson.slug} — ${lesson.bn.title} (${lesson.bn.blocks.length} blocks)`)
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const d of toBump) {
    // Already-bumped from a prior partial run — skip.
    if (d.sort_order >= lesson.sortOrder && d.path !== `ai/${lesson.slug}`) {
      const { error } = await supabase.from('docs').update({ sort_order: d.sort_order + 1 }).eq('id', d.id)
      if (error) { console.error(`Failed to bump ${d.path}:`, error.message); process.exit(1) }
      console.log(`  ↑ ${d.path}: ${d.sort_order} -> ${d.sort_order + 1}`)
    }
  }

  const path = `ai/${lesson.slug}`
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

  const { data: existing } = await supabase.from('docs').select('id').eq('path', path).maybeSingle()
  let docId = existing?.id
  if (docId) {
    const { error: docErr } = await supabase.from('docs').update(row).eq('id', docId)
    if (docErr) { console.error(`Failed ${lesson.slug} (en update):`, docErr.message); process.exit(1) }
  } else {
    const { data: inserted, error: docErr } = await supabase.from('docs').insert(row).select('id').single()
    if (docErr) { console.error(`Failed ${lesson.slug} (en insert):`, docErr.message); process.exit(1) }
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
  if (trErr) { console.error(`Failed ${lesson.slug} (bn):`, trErr.message); process.exit(1) }
  console.log(`  ✓ bn  ${path}`)

  console.log('\n✅ Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
