#!/usr/bin/env node
// New "UI/UX Design Principles" category (created by
// scripts/create-ui-ux-category.mjs) — 22 lessons across 5 phases:
// Foundations, Usability & Interaction, Visual Hierarchy for Product UI,
// UX Research & Structure, and Practice & Systems. Scoped with the site
// owner before writing (2026-08-18):
//   - Distinct from the existing `design` category, which is print/graphic
//     design fundamentals (color theory, typography, vector/raster,
//     brochure/flyer/poster exercises). This course covers the digital
//     PRODUCT design process instead — usability, interaction, research,
//     wireframing/prototyping, design systems, accessibility — and does not
//     re-teach color theory or typography from scratch.
//   - Slug `ui-ux`, joins the existing "Design" homepage group (Design,
//     Photoshop, Figma) — no new homepage group.
//   - Images: isometric concept illustrations (site's standard AI-generated
//     style, 6 of them) PLUS two REAL Figma screenshots — a hand-built
//     low-fi wireframe and a two-screen prototype flow with a connector
//     arrow, built directly in the Figma web app via browser automation,
//     same approach as the Figma category's real-app screenshots.
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-ui-ux-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Block builders (same shape as every other content script) ───────────

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
let n = 1

// ═══ PHASE 1 — FOUNDATIONS ══════════════════════════════════════════════

lessons.push({
  slug: 'what-ui-vs-ux-actually-means', sortOrder: n++,
  en: {
    title: 'What UI vs UX Actually Means',
    metaTitle: 'What UI vs UX Actually Means | Learn Computer Academy',
    metaDescription: 'The real difference between UI and UX, why they are two separate jobs that overlap constantly, and where this course fits next to Graphic Design and Figma.',
    blocks: [
      p('<p>"UI/UX" gets said as one word so often that the two halves blur together. They are related but genuinely different jobs, and knowing which is which changes what a designer actually spends their day doing.</p>'),
      img('docs/img/ui-ux/ui-ux-hero', 'An isometric illustration of a designer working at a desk with wireframe screens on a monitor and a mood board of UI components nearby', 1024, 768, 'UI is what it looks like. UX is whether it works.'),
      h(2, 'UI — User Interface'),
      p('<p><b>UI</b> is everything a user actually sees and touches: buttons, colors, typography, icons, layout, spacing. It is the visual and interactive surface of a product — the part a screenshot can capture.</p>'),
      h(2, 'UX — User Experience'),
      p('<p><b>UX</b> is the whole experience of using a product to accomplish a goal: how easy it is to find something, how confusing a checkout flow feels, whether an error message actually helps. UX is judged by outcome and feeling, not appearance — a beautiful screen with a confusing flow is bad UX with good UI.</p>'),
      table(['Question', 'This is...'], [
        ['Is this button the right shade of orange?', 'UI'],
        ['Does the user know what happens when they click it?', 'UX'],
        ['Is the type size readable?', 'UI'],
        ['Can a new user finish signup without getting stuck?', 'UX'],
      ]),
      h(2, 'Where This Course Fits'),
      p('<p>This site\'s Graphic Design course covers visual fundamentals — color theory, typography, layout — that both UI and UX design lean on. Its Figma course covers the tool used to actually build screens. This course sits between them: the <i>process and thinking</i> that turns visual skill and a design tool into a product that actually works for the people using it.</p>'),
      callout('note', '<p>A good UI designer and a good UX designer overlap enormously in practice — most people doing this work daily call themselves just "a designer" and do both. The distinction matters mainly for understanding what problem is actually being solved at any given moment.</p>', 'In practice, most people do both'),
    ],
  },
  bn: {
    title: 'UI বনাম UX আসলে কী মানে',
    metaTitle: 'UI বনাম UX আসলে কী মানে | Learn Computer Academy',
    metaDescription: 'UI আর UX-এর মধ্যে আসল পার্থক্য, কেন এগুলো ক্রমাগত overlap করা দুটো আলাদা কাজ, আর Graphic Design আর Figma-এর পাশে এই কোর্স কোথায় খাপ খায়।',
    blocks: [
      p('<p>"UI/UX" এতবার একটা শব্দ হিসেবে বলা হয় যে দুটো অর্ধেক একসাথে মিশে যায়। এগুলো সম্পর্কিত কিন্তু আসলেই ভিন্ন কাজ, আর কোনটা কোনটা তা জানা একজন designer আসলে সারাদিন কী করে তা বদলে দেয়।</p>'),
      img('docs/img/ui-ux/ui-ux-hero', 'একটা মনিটরে wireframe screen আর কাছে UI component-এর একটা mood board সহ একটা ডেস্কে কাজ করা একজন designer-এর isometric illustration', 1024, 768, 'UI হলো এটা দেখতে কেমন। UX হলো এটা কাজ করে কিনা।'),
      h(2, 'UI — User Interface', 'ui-user-interface'),
      p('<p><b>UI</b> হলো একজন user আসলে যা দেখে আর স্পর্শ করে সবকিছু: button, রং, typography, icon, layout, spacing। এটা একটা product-এর visual আর interactive পৃষ্ঠ — একটা screenshot যে অংশ ধরতে পারে।</p>'),
      h(2, 'UX — User Experience', 'ux-user-experience'),
      p('<p><b>UX</b> হলো একটা লক্ষ্য অর্জন করতে একটা product ব্যবহার করার পুরো অভিজ্ঞতা: কিছু খুঁজে পাওয়া কতটা সহজ, একটা checkout flow কতটা বিভ্রান্তিকর মনে হয়, একটা error message আসলে সাহায্য করে কিনা। UX বিচার হয় outcome আর অনুভূতি দিয়ে, চেহারা দিয়ে না — একটা confusing flow সহ একটা সুন্দর screen ভালো UI সহ খারাপ UX।</p>'),
      table(['প্রশ্ন', 'এটা...'], [
        ['এই button-টা কি ঠিক shade-এর orange?', 'UI'],
        ['User কি জানে click করলে কী হবে?', 'UX'],
        ['Type size কি পড়ার যোগ্য?', 'UI'],
        ['একজন নতুন user কি আটকে না গিয়ে signup শেষ করতে পারে?', 'UX'],
      ]),
      h(2, 'এই কোর্স কোথায় খাপ খায়', 'এই-কোর্স-কোথায়-খাপ-খায়'),
      p('<p>এই সাইটের Graphic Design কোর্স visual মূলনীতি কভার করে — color theory, typography, layout — যার উপর UI আর UX design দুটোই নির্ভর করে। এর Figma কোর্স আসলে screen বানানোর জন্য ব্যবহৃত টুল কভার করে। এই কোর্স এদের মাঝখানে বসে: <i>process আর চিন্তাভাবনা</i> যা visual দক্ষতা আর একটা design টুলকে একটা product-এ পরিণত করে যা ব্যবহারকারীদের জন্য আসলেই কাজ করে।</p>'),
      callout('note', '<p>একজন ভালো UI designer আর একজন ভালো UX designer বাস্তবে অনেক overlap করে — এই কাজ প্রতিদিন করা বেশিরভাগ মানুষ নিজেদের শুধু "একজন designer" বলে আর দুটোই করে। পার্থক্যটা মূলত বোঝার জন্য গুরুত্বপূর্ণ যে যেকোনো মুহূর্তে আসলে কোন সমস্যা সমাধান হচ্ছে।</p>', 'বাস্তবে, বেশিরভাগ মানুষ দুটোই করে'),
    ],
  },
})

lessons.push({
  slug: 'the-design-process', sortOrder: n++,
  en: {
    title: 'The Design Process — The Double Diamond',
    metaTitle: 'The Design Process — The Double Diamond | Learn Computer Academy',
    metaDescription: 'The Double Diamond framework — discover, define, develop, deliver — and why jumping straight to visuals is the most common mistake new designers make.',
    blocks: [
      p('<p>The most common mistake a new designer makes is opening Figma and starting to design before the actual problem is understood. The <b>Double Diamond</b> is a simple, widely-used framework for the process that comes before and after that.</p>'),
      h(2, 'The Four Stages'),
      table(['Stage', 'Question being asked', 'What happens'], [
        ['Discover', 'What is the real problem?', 'Research, talk to users, gather information — widening the view before narrowing it'],
        ['Define', 'Which problem are we actually solving?', 'Narrow all that research down to one clear, specific problem statement'],
        ['Develop', 'What are the possible solutions?', 'Sketch, wireframe, and prototype multiple different approaches — widening again'],
        ['Deliver', 'Which solution actually works?', 'Test, refine, and ship the one solution that tested best — narrowing to a final answer'],
      ]),
      h(2, 'Why It\'s Shaped Like Two Diamonds'),
      p('<p>Each diamond has a wide-then-narrow shape: widen first (explore broadly, don\'t settle early), then narrow (commit to one direction). Doing this twice — once for the <i>problem</i>, once for the <i>solution</i> — is what keeps a designer from solving the wrong problem beautifully, which happens constantly when the process is skipped.</p>'),
      h(2, 'This Isn\'t Always a Big Formal Process'),
      p('<p>For a small project, this can be a 20-minute mental exercise, not a week of formal research. The value is the <i>order</i> — problem before solution, exploration before commitment — not the amount of ceremony around it.</p>'),
      callout('tip', '<p>Before opening any design tool, write one sentence: "The problem I\'m solving is ___." If that sentence is hard to write, more discovery is needed before more design.</p>', 'A fast personal check'),
    ],
  },
  bn: {
    title: 'Design Process — Double Diamond',
    metaTitle: 'Design Process — Double Diamond | Learn Computer Academy',
    metaDescription: 'Double Diamond framework — discover, define, develop, deliver — আর কেন সরাসরি visual-এ ঝাঁপ দেওয়া নতুন designer-দের সবচেয়ে সাধারণ ভুল।',
    blocks: [
      p('<p>একজন নতুন designer-এর সবচেয়ে সাধারণ ভুল হলো আসল সমস্যা বোঝার আগে Figma খুলে design শুরু করা। <b>Double Diamond</b> হলো এর আগে আর পরে যা ঘটে সেই process-এর একটা সরল, ব্যাপকভাবে-ব্যবহৃত framework।</p>'),
      h(2, 'চারটা পর্যায়', 'চারটা-পর্যায়'),
      table(['পর্যায়', 'জিজ্ঞাসা করা প্রশ্ন', 'কী ঘটে'], [
        ['Discover', 'আসল সমস্যা কী?', 'গবেষণা, user-দের সাথে কথা বলা, তথ্য সংগ্রহ — সংকীর্ণ করার আগে দৃষ্টিভঙ্গি প্রশস্ত করা'],
        ['Define', 'আমরা আসলে কোন সমস্যা সমাধান করছি?', 'সেই সব গবেষণা একটা স্পষ্ট, নির্দিষ্ট সমস্যা বিবৃতিতে সংকুচিত করা'],
        ['Develop', 'সম্ভাব্য সমাধানগুলো কী?', 'একাধিক ভিন্ন পদ্ধতি sketch, wireframe, আর prototype করা — আবার প্রশস্ত করা'],
        ['Deliver', 'কোন সমাধানটা আসলে কাজ করে?', 'পরীক্ষা, পরিমার্জন করা, আর যেটা সবচেয়ে ভালো পরীক্ষায় উত্তীর্ণ হয়েছে সেই একটা সমাধান ship করা — একটা চূড়ান্ত উত্তরে সংকুচিত করা'],
      ]),
      h(2, 'কেন এটা দুটো Diamond-এর মতো আকৃতির', 'কেন-এটা-দুটো-diamond-এর-মতো-আকৃতির'),
      p('<p>প্রতিটা diamond-এর একটা প্রশস্ত-তারপর-সংকীর্ণ আকৃতি আছে: আগে প্রশস্ত করুন (ব্যাপকভাবে অন্বেষণ করুন, তাড়াতাড়ি স্থির হবেন না), তারপর সংকুচিত করুন (একটা দিকে প্রতিশ্রুতিবদ্ধ হন)। এটা দুবার করা — একবার <i>সমস্যা</i>-র জন্য, একবার <i>সমাধান</i>-এর জন্য — একজন designer-কে সুন্দরভাবে ভুল সমস্যা সমাধান করা থেকে আটকায়, যা process বাদ দিলে ক্রমাগত ঘটে।</p>'),
      h(2, 'এটা সবসময় একটা বড় আনুষ্ঠানিক process না', 'এটা-সবসময়-একটা-বড়-আনুষ্ঠানিক-process-না'),
      p('<p>একটা ছোট প্রজেক্টের জন্য, এটা একটা সপ্তাহের আনুষ্ঠানিক গবেষণা না বরং একটা ২০-মিনিটের মানসিক ব্যায়াম হতে পারে। মূল্য হলো <i>ক্রমটা</i> — সমাধানের আগে সমস্যা, প্রতিশ্রুতির আগে অন্বেষণ — এর চারপাশের আনুষ্ঠানিকতার পরিমাণ না।</p>'),
      callout('tip', '<p>কোনো design টুল খোলার আগে, একটা বাক্য লিখুন: "আমি যে সমস্যাটা সমাধান করছি তা হলো ___।" যদি সেই বাক্যটা লেখা কঠিন হয়, বেশি design-এর আগে বেশি discovery দরকার।</p>', 'একটা দ্রুত ব্যক্তিগত পরীক্ষা'),
    ],
  },
})

lessons.push({
  slug: 'user-centered-design', sortOrder: n++,
  en: {
    title: 'User-Centered Design',
    metaTitle: 'User-Centered Design | Learn Computer Academy',
    metaDescription: 'What "user-centered" actually means in practice, how it differs from designing for personal taste, and a simple habit that keeps a designer honest.',
    blocks: [
      p('<p><b>User-centered design</b> means every real decision — layout, wording, flow — gets made by asking what serves the person actually using the product, not what the designer personally finds most impressive or interesting.</p>'),
      h(2, 'The Trap: Designing for Yourself'),
      p('<p>It\'s natural to design toward personal taste — a layout that feels clever, an interaction that feels novel. The problem is that a designer is almost never the target user: they know the product intimately, use the latest devices, and have design training the actual audience doesn\'t have. What feels obvious to a designer is very often not obvious to a first-time user.</p>'),
      h(2, 'What "User-Centered" Looks Like in Practice'),
      table(['Designer-centered instinct', 'User-centered question instead'], [
        ['"This animation looks impressive."', '"Does this animation help the user understand what happened, or just slow them down?"'],
        ['"I\'ll add every feature I can think of."', '"What does this specific user actually need to accomplish their one goal?"'],
        ['"This icon is visually interesting."', '"Will a first-time user instantly understand what this icon means?"'],
      ]),
      h(2, 'A Simple Habit: Ask "Who Is This For?"'),
      p('<p>Before any design decision, naming the actual user (not "everyone" — a specific type of person, in a specific situation) turns a vague taste call into an answerable question. "Would a first-time visitor on a slow phone connection understand this?" is answerable. "Do I like this?" isn\'t the right question at all.</p>'),
      callout('note', '<p>User-centered design doesn\'t mean ignoring aesthetics — a product can be both beautiful and genuinely usable. It means aesthetics serve the user\'s task rather than existing for their own sake.</p>', 'Not the opposite of good visual design'),
    ],
  },
  bn: {
    title: 'User-Centered Design',
    metaTitle: 'User-Centered Design | Learn Computer Academy',
    metaDescription: '"User-centered" আসলে বাস্তবে কী মানে, এটা ব্যক্তিগত রুচির জন্য design করা থেকে কীভাবে ভিন্ন, আর একটা সরল অভ্যাস যা একজন designer-কে সৎ রাখে।',
    blocks: [
      p('<p><b>User-centered design</b> মানে প্রতিটা আসল সিদ্ধান্ত — layout, শব্দচয়ন, flow — একজন designer ব্যক্তিগতভাবে সবচেয়ে চিত্তাকর্ষক বা আকর্ষণীয় কী মনে করেন তা না জিজ্ঞাসা করে product আসলে ব্যবহার করা ব্যক্তির কী কাজে লাগবে তা জিজ্ঞাসা করে নেওয়া হয়।</p>'),
      h(2, 'ফাঁদ: নিজের জন্য Design করা', 'ফাঁদ-নিজের-জন্য-design-করা'),
      p('<p>ব্যক্তিগত রুচির দিকে design করা স্বাভাবিক — একটা layout যা চতুর মনে হয়, একটা interaction যা নতুন মনে হয়। সমস্যা হলো একজন designer প্রায় কখনোই target user না: তারা product ঘনিষ্ঠভাবে জানে, সর্বশেষ device ব্যবহার করে, আর design training আছে যা আসল audience-এর নেই। একজন designer-এর কাছে যা স্পষ্ট মনে হয় তা প্রায়ই প্রথমবার আসা user-এর কাছে স্পষ্ট না।</p>'),
      h(2, '"User-Centered" বাস্তবে যেমন দেখায়', 'user-centered-বাস্তবে-যেমন-দেখায়'),
      table(['Designer-কেন্দ্রিক প্রবৃত্তি', 'তার বদলে User-কেন্দ্রিক প্রশ্ন'], [
        ['"এই animation-টা চিত্তাকর্ষক দেখাচ্ছে।"', '"এই animation কি user-কে কী ঘটেছে বুঝতে সাহায্য করে, নাকি শুধু তাদের ধীর করে?"'],
        ['"আমি যা ভাবতে পারি সব feature যোগ করবো।"', '"এই নির্দিষ্ট user-এর তাদের একটা লক্ষ্য পূরণ করতে আসলে কী দরকার?"'],
        ['"এই icon-টা visually আকর্ষণীয়।"', '"একজন প্রথমবার আসা user কি সাথে সাথে বুঝবে এই icon-এর মানে কী?"'],
      ]),
      h(2, 'একটা সরল অভ্যাস: "এটা কার জন্য?" জিজ্ঞাসা করুন', 'একটা-সরল-অভ্যাস-এটা-কার-জন্য-জিজ্ঞাসা-করুন'),
      p('<p>যেকোনো design সিদ্ধান্তের আগে, আসল user-এর নাম বলা ("সবাই" না — একটা নির্দিষ্ট পরিস্থিতিতে একটা নির্দিষ্ট ধরনের মানুষ) একটা অস্পষ্ট রুচির সিদ্ধান্তকে একটা উত্তর-দেওয়ার-যোগ্য প্রশ্নে পরিণত করে। "একজন ধীর ফোন সংযোগে প্রথমবার আসা visitor কি এটা বুঝবে?" উত্তর দেওয়া যায়। "আমার কি এটা ভালো লাগে?" মোটেও সঠিক প্রশ্ন না।</p>'),
      callout('note', '<p>User-centered design সৌন্দর্য উপেক্ষা করা মানে না — একটা product সুন্দর আর আসলেই ব্যবহারযোগ্য দুটোই হতে পারে। এর মানে সৌন্দর্য নিজের জন্য থাকার বদলে user-এর কাজে সাহায্য করে।</p>', 'ভালো visual design-এর বিপরীত না'),
    ],
  },
})

lessons.push({
  slug: 'good-vs-bad-ux-real-examples', sortOrder: n++,
  en: {
    title: 'Good vs Bad UX — Real Examples',
    metaTitle: 'Good vs Bad UX — Real Examples | Learn Computer Academy',
    metaDescription: 'Concrete, everyday examples of good and bad UX — from confirmation dialogs to error messages — to build a practical eye before the more technical lessons.',
    blocks: [
      p('<p>Before the more technical lessons ahead, a few concrete before/after examples make "good UX" tangible instead of abstract — it\'s something noticeable in ordinary daily use, once you know what to look for.</p>'),
      table(['Situation', 'Bad UX', 'Good UX'], [
        ['Deleting something important', 'Instantly deletes with no confirmation — one misclick, gone forever', 'A brief confirmation ("Delete this? Can\'t be undone") for anything irreversible'],
        ['A form field with an error', '"Error: invalid input" with no indication of which field or why', 'The specific field is highlighted with a clear reason: "Email must include an @"'],
        ['A loading state', 'A frozen screen with no feedback — looks broken', 'A spinner or skeleton screen, so the user knows something is happening'],
        ['A long form', 'All fields required, no indication of progress', 'Marked optional fields, and a progress indicator on multi-step forms'],
        ['Search with no results', 'A blank page with no explanation', '"No results for \'xyz\' — try a broader search" plus a suggestion'],
      ]),
      h(2, 'The Pattern Underneath All of These'),
      p('<p>Every "good UX" example above does the same thing: it tells the user what\'s happening, what went wrong, or what to do next, instead of leaving them to guess. Bad UX isn\'t usually about ugly visuals — it\'s about silence at the exact moment a user needs information.</p>'),
      callout('tip', '<p>A useful daily exercise: notice one frustrating moment in any app used today, and name specifically what information was missing at that moment. That\'s the beginning of a UX eye.</p>', 'Practice this everywhere, not just in class'),
    ],
  },
  bn: {
    title: 'ভালো বনাম খারাপ UX — আসল উদাহরণ',
    metaTitle: 'ভালো বনাম খারাপ UX — আসল উদাহরণ | Learn Computer Academy',
    metaDescription: 'ভালো আর খারাপ UX-এর concrete, প্রাত্যহিক উদাহরণ — confirmation dialog থেকে error message পর্যন্ত — আরো technical lesson-এর আগে একটা বাস্তব চোখ তৈরি করতে।',
    blocks: [
      p('<p>সামনের আরো technical lesson-এর আগে, কয়েকটা concrete before/after উদাহরণ "ভালো UX"-কে বিমূর্তের বদলে বাস্তব করে তোলে — কী খুঁজতে হবে তা জানা হয়ে গেলে এটা সাধারণ দৈনন্দিন ব্যবহারে লক্ষণীয় কিছু।</p>'),
      table(['পরিস্থিতি', 'খারাপ UX', 'ভালো UX'], [
        ['গুরুত্বপূর্ণ কিছু delete করা', 'কোনো confirmation ছাড়াই সাথে সাথে delete হয়ে যায় — একটা ভুল click, চিরতরে চলে গেছে', 'যেকোনো অপরিবর্তনীয় কাজের জন্য একটা সংক্ষিপ্ত confirmation ("এটা Delete করবেন? Undo করা যাবে না")'],
        ['একটা error সহ একটা form field', '"Error: invalid input" কোন field বা কেন তার কোনো ইঙ্গিত ছাড়াই', 'নির্দিষ্ট field একটা স্পষ্ট কারণ সহ highlight করা: "Email-এ অবশ্যই @ থাকতে হবে"'],
        ['একটা loading state', 'কোনো feedback ছাড়া একটা জমাট screen — নষ্ট দেখায়', 'একটা spinner বা skeleton screen, যাতে user জানে কিছু ঘটছে'],
        ['একটা লম্বা form', 'সব field আবশ্যক, progress-এর কোনো ইঙ্গিত নেই', 'ঐচ্ছিক field চিহ্নিত করা, আর multi-step form-এ একটা progress indicator'],
        ['কোনো ফলাফল ছাড়া search', 'কোনো ব্যাখ্যা ছাড়া একটা ফাঁকা page', '"\'xyz\'-এর জন্য কোনো ফলাফল নেই — একটা বিস্তৃত search চেষ্টা করুন" সহ একটা পরামর্শ'],
      ]),
      h(2, 'এই সবকিছুর নিচের প্যাটার্ন', 'এই-সবকিছুর-নিচের-প্যাটার্ন'),
      p('<p>উপরের প্রতিটা "ভালো UX" উদাহরণ একই কাজ করে: এটা user-কে বলে কী ঘটছে, কী ভুল হয়েছে, বা পরে কী করতে হবে, তাদের অনুমান করতে ছেড়ে না দিয়ে। খারাপ UX সাধারণত কুৎসিত visual সম্পর্কে না — এটা user-এর ঠিক তথ্য দরকার এমন মুহূর্তে নীরবতা সম্পর্কে।</p>'),
      callout('tip', '<p>একটা useful দৈনন্দিন ব্যায়াম: আজ ব্যবহার করা যেকোনো app-এ একটা হতাশাজনক মুহূর্ত লক্ষ্য করুন, আর সেই মুহূর্তে নির্দিষ্টভাবে কী তথ্য অনুপস্থিত ছিল তা নাম দিন। এটাই একটা UX চোখের শুরু।</p>', 'শুধু class-এ না, সর্বত্র এটা অনুশীলন করুন'),
    ],
  },
})

// ═══ PHASE 2 — USABILITY & INTERACTION ══════════════════════════════════

lessons.push({
  slug: 'nielsens-10-usability-heuristics', sortOrder: n++,
  en: {
    title: "Nielsen's 10 Usability Heuristics",
    metaTitle: "Nielsen's 10 Usability Heuristics | Learn Computer Academy",
    metaDescription: "Jakob Nielsen's 10 general usability heuristics, explained in plain language with a practical example for each — the closest thing UX design has to a checklist.",
    blocks: [
      p('<p>In 1994, usability researcher Jakob Nielsen published 10 broad rules of thumb for good interface design. Three decades later, they\'re still the closest thing UX design has to a shared checklist — useful for critiquing any screen, including someone else\'s or your own.</p>'),
      img('docs/img/ui-ux/usability-testing', 'An isometric illustration of a person testing a smartphone app with a magnifying glass and checkmark and X icons floating nearby', 1024, 768, 'A heuristic evaluation is basically running this checklist against a real screen.'),
      table(['#', 'Heuristic', 'In plain language'], [
        ['1', 'Visibility of system status', 'Always show the user what\'s happening — loading, saved, in progress'],
        ['2', 'Match between system and the real world', 'Use language and concepts the user already knows, not internal jargon'],
        ['3', 'User control and freedom', 'Always give an obvious way to undo or back out of an action'],
        ['4', 'Consistency and standards', 'The same word or icon should mean the same thing everywhere in the product'],
        ['5', 'Error prevention', 'Design so mistakes are hard to make, not just easy to recover from'],
        ['6', 'Recognition rather than recall', 'Show options rather than making a user remember what to type'],
        ['7', 'Flexibility and efficiency of use', 'Let beginners get by easily, while giving experts shortcuts'],
        ['8', 'Aesthetic and minimalist design', 'Every extra element competes for attention with what actually matters'],
        ['9', 'Help users recognize, diagnose, and recover from errors', 'Error messages in plain language, with a clear next step'],
        ['10', 'Help and documentation', 'Ideally not needed, but available and easy to search when it is'],
      ]),
      h(2, 'Using This as a Real Tool'),
      p('<p>A <b>heuristic evaluation</b> means walking through a real screen or flow and checking it against this list, one item at a time, noting where it fails. It\'s one of the fastest, cheapest ways to catch usability problems — no users or testing sessions required, just this list and a critical eye.</p>'),
      callout('tip', '<p>Pick any app on your phone right now and run through all 10 — most real products fail at least two or three of them. Spotting that is the actual skill this lesson is teaching.</p>', 'Try it immediately'),
    ],
  },
  bn: {
    title: "Nielsen-এর ১০টা Usability Heuristics",
    metaTitle: "Nielsen-এর ১০টা Usability Heuristics | Learn Computer Academy",
    metaDescription: "Jakob Nielsen-এর ১০টা সাধারণ usability heuristics, প্রতিটার জন্য একটা বাস্তব উদাহরণ সহ সহজ ভাষায় ব্যাখ্যা করা — UX design-এ একটা checklist-এর সবচেয়ে কাছের জিনিস।",
    blocks: [
      p('<p>১৯৯৪ সালে, usability গবেষক Jakob Nielsen ভালো interface design-এর ১০টা বিস্তৃত rule of thumb প্রকাশ করেছিলেন। তিন দশক পরেও, UX design-এ একটা শেয়ার করা checklist-এর সবচেয়ে কাছের জিনিস এগুলোই — যেকোনো screen সমালোচনা করার জন্য useful, অন্য কারো বা নিজের সহ।</p>'),
      img('docs/img/ui-ux/usability-testing', 'একটা magnifying glass আর checkmark আর X icon কাছে ভাসতে ভাসতে একটা smartphone app পরীক্ষা করা একজন ব্যক্তির isometric illustration', 1024, 768, 'একটা heuristic evaluation মূলত একটা আসল screen-এর বিরুদ্ধে এই checklist চালানো।'),
      table(['#', 'Heuristic', 'সহজ ভাষায়'], [
        ['১', 'System status-এর visibility', 'সবসময় user-কে দেখান কী ঘটছে — loading, saved, চলমান'],
        ['২', 'System আর বাস্তব জগতের মধ্যে মিল', 'internal jargon না, user ইতিমধ্যে জানে এমন ভাষা আর concept ব্যবহার করুন'],
        ['৩', 'User control আর স্বাধীনতা', 'একটা কাজ undo বা থেকে বের হওয়ার জন্য সবসময় একটা স্পষ্ট উপায় দিন'],
        ['৪', 'ধারাবাহিকতা আর মানদণ্ড', 'একই শব্দ বা icon-এর product-এর সর্বত্র একই মানে হওয়া উচিত'],
        ['৫', 'ভুল প্রতিরোধ', 'এমনভাবে design করুন যাতে ভুল করা কঠিন হয়, শুধু recover করা সহজ না'],
        ['৬', 'মনে রাখার বদলে চেনা', 'user-কে কী type করতে হবে মনে রাখতে বাধ্য না করে বিকল্প দেখান'],
        ['৭', 'ব্যবহারের নমনীয়তা আর দক্ষতা', 'নতুনদের সহজে চলতে দিন, আর expert-দের shortcut দিন'],
        ['৮', 'নান্দনিক আর ন্যূনতম design', 'প্রতিটা বাড়তি element যা আসলে গুরুত্বপূর্ণ তার সাথে মনোযোগের জন্য প্রতিযোগিতা করে'],
        ['৯', 'User-দের ভুল চিনতে, নির্ণয় করতে, আর recover করতে সাহায্য করুন', 'সহজ ভাষায় error message, একটা স্পষ্ট পরের ধাপ সহ'],
        ['১০', 'সাহায্য আর documentation', 'আদর্শভাবে দরকার নেই, কিন্তু যখন দরকার তখন পাওয়া যায় আর সহজে search করা যায়'],
      ]),
      h(2, 'এটাকে একটা আসল টুল হিসেবে ব্যবহার করা', 'এটাকে-একটা-আসল-টুল-হিসেবে-ব্যবহার-করা'),
      p('<p>একটা <b>heuristic evaluation</b> মানে একটা আসল screen বা flow-এর মধ্য দিয়ে হাঁটা আর এই তালিকার বিরুদ্ধে এটা পরীক্ষা করা, একবারে একটা item, কোথায় এটা ব্যর্থ হয় তা নোট করা। এটা usability সমস্যা ধরার সবচেয়ে দ্রুত, সস্তা উপায়গুলোর একটা — কোনো user বা testing session দরকার নেই, শুধু এই তালিকা আর একটা সমালোচনামূলক চোখ।</p>'),
      callout('tip', '<p>এখনই আপনার ফোনে যেকোনো app বেছে নিন আর সব ১০টা চালান — বেশিরভাগ আসল product এগুলোর অন্তত দুই বা তিনটাতে ব্যর্থ হয়। এটা লক্ষ্য করাই এই lesson শেখাচ্ছে এমন আসল দক্ষতা।</p>', 'এখনই চেষ্টা করুন'),
    ],
  },
})

lessons.push({
  slug: 'affordances-and-signifiers', sortOrder: n++,
  en: {
    title: 'Affordances & Signifiers',
    metaTitle: 'Affordances & Signifiers | Learn Computer Academy',
    metaDescription: 'What affordances and signifiers mean in interface design, and why a button that does not look clickable is one of the most common UI failures.',
    blocks: [
      p('<p>A door handle you pull is shaped differently from one you push — the shape itself communicates the action, without a label. That\'s an <b>affordance</b>: a property of an object that suggests how it can be used. Interfaces work the same way.</p>'),
      h(2, 'Affordance vs. Signifier'),
      table(['Term', 'Meaning', 'Example'], [
        ['Affordance', 'What an element can actually do', 'A button can be clicked'],
        ['Signifier', 'The visual clue that communicates the affordance', 'A raised, shadowed shape and a hand cursor on hover that tells you it\'s clickable'],
      ]),
      p('<p>An element can technically be clickable (the affordance exists) while looking completely flat and static (no signifier) — this is one of the most common real UI failures: a perfectly functional button that nobody realizes is a button.</p>'),
      h(2, 'Common Signifiers Worth Knowing'),
      table(['Signifier', 'What it communicates'], [
        ['Raised shape / shadow / fill color', 'This is clickable'],
        ['Underline on text', 'This is a link'],
        ['Cursor changes to a pointer on hover', 'This is interactive'],
        ['A chevron or arrow icon', 'This expands, navigates, or reveals more'],
        ['Grayed-out, lower contrast', 'This is currently disabled'],
      ]),
      h(2, 'The Flat-Design Trade-off'),
      p('<p>Modern flat design deliberately removed heavy shadows and 3D bevels for a cleaner look — but it also removed a lot of free signifiers designers used to get automatically. A flat interface has to work harder with color, spacing, and subtle borders to signal "this is clickable" without those older visual cues.</p>'),
      callout('tip', '<p>When in doubt about whether an element reads as interactive, test it on someone who hasn\'t seen the design — if they hesitate or don\'t try clicking it, the signifier isn\'t strong enough yet.</p>', 'A fast, honest test'),
    ],
  },
  bn: {
    title: 'Affordances আর Signifiers',
    metaTitle: 'Affordances আর Signifiers | Learn Computer Academy',
    metaDescription: 'Interface design-এ affordance আর signifier মানে কী, আর কেন clickable মনে না হওয়া একটা button সবচেয়ে সাধারণ UI ব্যর্থতাগুলোর একটা।',
    blocks: [
      p('<p>আপনি যে দরজার হাতল টানেন তা যেটা ঠেলেন তার থেকে ভিন্নভাবে আকৃতির — আকৃতিটাই কাজটা জানায়, কোনো label ছাড়াই। এটাই একটা <b>affordance</b>: একটা বস্তুর একটা বৈশিষ্ট্য যা কীভাবে এটা ব্যবহার করা যায় তার ইঙ্গিত দেয়। Interface একইভাবে কাজ করে।</p>'),
      h(2, 'Affordance বনাম Signifier', 'affordance-বনাম-signifier'),
      table(['শব্দ', 'অর্থ', 'উদাহরণ'], [
        ['Affordance', 'একটা element আসলে কী করতে পারে', 'একটা button click করা যায়'],
        ['Signifier', 'visual clue যা affordance জানায়', 'একটা উঁচু, ছায়াযুক্ত আকৃতি আর hover-এ একটা হাতের cursor যা বলে এটা clickable'],
      ]),
      p('<p>একটা element কারিগরিভাবে clickable হতে পারে (affordance আছে) কিন্তু সম্পূর্ণ সমতল আর স্থির দেখাতে পারে (কোনো signifier না) — এটা সবচেয়ে সাধারণ আসল UI ব্যর্থতাগুলোর একটা: একটা সম্পূর্ণ কার্যকরী button যা কেউ বুঝতে পারে না এটা একটা button।</p>'),
      h(2, 'জানার মতো সাধারণ Signifier', 'জানার-মতো-সাধারণ-signifier'),
      table(['Signifier', 'এটা কী জানায়'], [
        ['উঁচু আকৃতি / ছায়া / fill রং', 'এটা clickable'],
        ['টেক্সটে underline', 'এটা একটা link'],
        ['hover-এ cursor একটা pointer-এ বদলায়', 'এটা interactive'],
        ['একটা chevron বা arrow icon', 'এটা প্রসারিত হয়, navigate করে, বা আরো প্রকাশ করে'],
        ['ধূসর, কম contrast', 'এটা বর্তমানে disabled'],
      ]),
      h(2, 'Flat-Design Trade-off', 'flat-design-trade-off'),
      p('<p>আধুনিক flat design ইচ্ছাকৃতভাবে একটা পরিষ্কার চেহারার জন্য ভারী ছায়া আর 3D bevel সরিয়ে দিয়েছে — কিন্তু এটা অনেক বিনামূল্যের signifier-ও সরিয়ে দিয়েছে যা designer-রা আগে স্বয়ংক্রিয়ভাবে পেতেন। একটা flat interface-কে সেই পুরনো visual cue ছাড়াই "এটা clickable" সংকেত দিতে রং, spacing, আর সূক্ষ্ম border দিয়ে কঠোর পরিশ্রম করতে হয়।</p>'),
      callout('tip', '<p>একটা element interactive পড়ে কিনা সন্দেহ হলে, design দেখেননি এমন কারো উপর এটা পরীক্ষা করুন — যদি তারা ইতস্তত করে বা click করার চেষ্টা না করে, signifier এখনো যথেষ্ট শক্তিশালী না।</p>', 'একটা দ্রুত, সৎ পরীক্ষা'),
    ],
  },
})

lessons.push({
  slug: 'feedback-states-and-microinteractions', sortOrder: n++,
  en: {
    title: 'Feedback, States & Micro-interactions',
    metaTitle: 'Feedback, States & Micro-interactions | Learn Computer Academy',
    metaDescription: 'The interface states every interactive element needs (default, hover, active, disabled, loading, error) and what a micro-interaction actually is.',
    blocks: [
      p('<p>Every interactive element in a real interface exists in more than one state — most beginner designs only ever design the default state, then wonder why the built product feels unfinished.</p>'),
      h(2, 'The States Every Interactive Element Needs'),
      table(['State', 'When it shows', 'Why it matters'], [
        ['Default', 'Normal, at rest', 'The baseline'],
        ['Hover', 'Cursor over it (desktop only)', 'Confirms the element is interactive before clicking'],
        ['Active / Pressed', 'The moment of clicking', 'Confirms the click registered'],
        ['Focus', 'Selected via keyboard tab', 'Essential for accessibility — covered in depth later in this course'],
        ['Disabled', 'Not currently usable', 'Prevents a frustrating dead click'],
        ['Loading', 'Waiting on something', 'Prevents the user from thinking the app is frozen'],
        ['Error', 'Something went wrong', 'Tells the user what happened and what to do'],
      ]),
      h(2, 'Micro-interactions'),
      p('<p>A <b>micro-interaction</b> is a small, single-purpose piece of feedback — a button that subtly scales on press, a checkbox that animates a checkmark in, a heart icon that briefly bursts when liked. They\'re small on purpose: their whole job is confirming an action happened, not drawing attention to themselves.</p>'),
      h(2, 'The Anatomy of a Micro-interaction'),
      table(['Part', 'What it is'], [
        ['Trigger', 'What starts it — a click, a value changing, a page loading'],
        ['Rules', 'What happens — what changes, in what order'],
        ['Feedback', 'What the user sees or feels — the visual or motion response'],
        ['Loop/Mode', 'Does it repeat, and does it change behavior after repeated use? (often skipped for simple ones)'],
      ]),
      callout('note', '<p>A micro-interaction that takes more than a fraction of a second, or draws real attention to itself, has usually overstepped its job. The best ones are barely noticed consciously — they\'re felt as "this feels responsive" rather than seen as "an animation happened."</p>', 'Subtlety is the point'),
    ],
  },
  bn: {
    title: 'Feedback, State আর Micro-interaction',
    metaTitle: 'Feedback, State আর Micro-interaction | Learn Computer Academy',
    metaDescription: 'প্রতিটা interactive element-এর দরকার এমন interface state (default, hover, active, disabled, loading, error) আর একটা micro-interaction আসলে কী।',
    blocks: [
      p('<p>একটা আসল interface-এ প্রতিটা interactive element একের বেশি state-এ থাকে — বেশিরভাগ শিক্ষানবিস design শুধু default state design করে, তারপর ভাবে কেন বানানো product অসম্পূর্ণ মনে হয়।</p>'),
      h(2, 'প্রতিটা Interactive Element-এর দরকার এমন State', 'প্রতিটা-interactive-element-এর-দরকার-এমন-state'),
      table(['State', 'কখন দেখায়', 'কেন গুরুত্বপূর্ণ'], [
        ['Default', 'স্বাভাবিক, বিশ্রামে', 'ভিত্তি'],
        ['Hover', 'Cursor এর উপর (শুধু desktop)', 'click করার আগে element interactive তা নিশ্চিত করে'],
        ['Active / Pressed', 'click করার মুহূর্ত', 'click নিবন্ধিত হয়েছে তা নিশ্চিত করে'],
        ['Focus', 'keyboard tab দিয়ে বেছে নেওয়া', 'accessibility-এর জন্য অপরিহার্য — এই কোর্সে পরে বিস্তারিত কভার করা'],
        ['Disabled', 'বর্তমানে ব্যবহারযোগ্য না', 'একটা হতাশাজনক মৃত click প্রতিরোধ করে'],
        ['Loading', 'কিছুর জন্য অপেক্ষা করা', 'user-কে app জমে গেছে ভাবা থেকে আটকায়'],
        ['Error', 'কিছু ভুল হয়েছে', 'user-কে কী ঘটেছে আর কী করতে হবে তা বলে'],
      ]),
      h(2, 'Micro-interaction', 'micro-interaction'),
      p('<p>একটা <b>micro-interaction</b> হলো feedback-এর একটা ছোট, একক-উদ্দেশ্যের অংশ — একটা button যা press-এ সূক্ষ্মভাবে scale করে, একটা checkbox যা একটা checkmark animate করে, একটা heart icon যা like করা হলে সংক্ষেপে ফেটে যায়। এগুলো ইচ্ছাকৃতভাবে ছোট: তাদের পুরো কাজ একটা কাজ ঘটেছে তা নিশ্চিত করা, নিজেদের দিকে মনোযোগ আকর্ষণ করা না।</p>'),
      h(2, 'একটা Micro-interaction-এর গঠন', 'একটা-micro-interaction-এর-গঠন'),
      table(['অংশ', 'এটা কী'], [
        ['Trigger', 'এটা কী শুরু করে — একটা click, একটা value বদলানো, একটা page load হওয়া'],
        ['Rules', 'কী ঘটে — কী বদলায়, কোন ক্রমে'],
        ['Feedback', 'user কী দেখে বা অনুভব করে — visual বা motion সাড়া'],
        ['Loop/Mode', 'এটা কি পুনরাবৃত্ত হয়, আর বারবার ব্যবহারের পরে এটা কি আচরণ বদলায়? (সরল গুলোর জন্য প্রায়ই বাদ দেওয়া হয়)'],
      ]),
      callout('note', '<p>একটা micro-interaction যা এক সেকেন্ডের ভগ্নাংশের বেশি সময় নেয়, বা নিজের দিকে আসল মনোযোগ টানে, সাধারণত তার কাজ ছাড়িয়ে গেছে। সেরাগুলো সচেতনভাবে খুব কমই লক্ষ্য করা হয় — সেগুলো "একটা animation ঘটেছে" হিসেবে দেখার বদলে "এটা প্রতিক্রিয়াশীল মনে হয়" হিসেবে অনুভব করা হয়।</p>', 'সূক্ষ্মতাই মূল বিষয়'),
    ],
  },
})

lessons.push({
  slug: 'navigation-patterns', sortOrder: n++,
  en: {
    title: 'Navigation Patterns',
    metaTitle: 'Navigation Patterns | Learn Computer Academy',
    metaDescription: 'The most common navigation patterns — tab bars, hamburger menus, breadcrumbs, and more — and when each one actually fits.',
    blocks: [
      p('<p>Navigation is how a user moves through a product and always knows where they are. Reaching for a familiar, well-tested pattern is almost always better than inventing a clever new one — novelty in navigation usually costs more usability than it\'s worth.</p>'),
      table(['Pattern', 'What it looks like', 'Best fit for'], [
        ['Tab bar (bottom or top)', '3-5 icons/labels for top-level sections, always visible', 'Mobile apps with a handful of core, equally-important sections'],
        ['Hamburger menu', 'A hidden slide-out list behind a "≡" icon', 'Secondary items, or when screen space is genuinely tight — costs discoverability'],
        ['Sidebar navigation', 'A persistent vertical list, usually desktop', 'Content-heavy apps and dashboards with many sections'],
        ['Breadcrumbs', '"Home > Category > Page" trail', 'Deep, hierarchical content where users need to know their exact location'],
        ['Pagination / Load more', 'Numbered pages, or a button to reveal more', 'Long lists of similar items — search results, product listings'],
        ['Search-first', 'A prominent search bar as the primary way in', 'Content libraries too large to browse comfortably'],
      ]),
      h(2, 'The Hamburger Menu Trade-off, Specifically'),
      p('<p>Hidden navigation is one of the most debated patterns in UX for good reason: it saves screen space but real usage data consistently shows lower engagement with anything tucked behind it, simply because users can\'t see what\'s there. It\'s a real tool, not a mistake — but it should hold secondary items, not the core sections a user needs constantly.</p>'),
      h(2, 'The One Rule That Covers Most of This'),
      p('<p>A user should always be able to answer three questions without thinking hard: Where am I? Where can I go? How do I get back? Any navigation pattern that keeps those three answers obvious is doing its job, regardless of which specific pattern is used.</p>'),
      callout('tip', '<p>When unsure which pattern fits, look at what the market leader in that product category actually uses — navigation is one of the few areas where following convention is usually the right call, not a lack of creativity.</p>', 'Convention is a feature here, not a limitation'),
    ],
  },
  bn: {
    title: 'Navigation Pattern',
    metaTitle: 'Navigation Pattern | Learn Computer Academy',
    metaDescription: 'সবচেয়ে সাধারণ navigation pattern — tab bar, hamburger menu, breadcrumb, আরো — আর কখন প্রতিটা আসলে মানানসই।',
    blocks: [
      p('<p>Navigation হলো একজন user কীভাবে একটা product-এর মধ্য দিয়ে চলে আর সবসময় জানে তারা কোথায়। একটা পরিচিত, ভালো-পরীক্ষিত pattern-এ যাওয়া প্রায় সবসময় একটা চতুর নতুন কিছু আবিষ্কার করার চেয়ে ভালো — navigation-এ নতুনত্ব সাধারণত এটার মূল্যের চেয়ে বেশি usability খরচ করে।</p>'),
      table(['Pattern', 'দেখতে কেমন', 'সবচেয়ে ভালো যার জন্য'], [
        ['Tab bar (নিচে বা উপরে)', 'top-level section-এর জন্য ৩-৫টা icon/label, সবসময় দৃশ্যমান', 'একমুঠো মূল, সমান-গুরুত্বপূর্ণ section সহ mobile app'],
        ['Hamburger menu', '"≡" icon-এর পিছনে একটা লুকানো slide-out তালিকা', 'গৌণ item, বা যখন screen space আসলেই টান — discoverability খরচ করে'],
        ['Sidebar navigation', 'একটা স্থায়ী vertical তালিকা, সাধারণত desktop', 'অনেক section সহ content-ভারী app আর dashboard'],
        ['Breadcrumb', '"Home > Category > Page" trail', 'গভীর, hierarchical content যেখানে user-দের তাদের সঠিক অবস্থান জানা দরকার'],
        ['Pagination / Load more', 'সংখ্যাযুক্ত page, বা আরো প্রকাশ করার একটা button', 'অনুরূপ item-এর লম্বা তালিকা — search result, product listing'],
        ['Search-first', 'প্রবেশের প্রধান উপায় হিসেবে একটা প্রকট search bar', 'আরামে browse করার জন্য খুব বড় content library'],
      ]),
      h(2, 'Hamburger Menu Trade-off, নির্দিষ্টভাবে', 'hamburger-menu-trade-off-নির্দিষ্টভাবে'),
      p('<p>লুকানো navigation ভালো কারণে UX-এ সবচেয়ে বিতর্কিত pattern-গুলোর একটা: এটা screen space বাঁচায় কিন্তু আসল ব্যবহার data ধারাবাহিকভাবে দেখায় এর পিছনে গোঁজা যেকোনো কিছুর সাথে কম engagement, শুধু কারণ user-রা সেখানে কী আছে তা দেখতে পায় না। এটা একটা আসল টুল, একটা ভুল না — কিন্তু এতে গৌণ item থাকা উচিত, একজন user-এর ক্রমাগত দরকার এমন মূল section না।</p>'),
      h(2, 'এই সবকিছু কভার করে এমন একটা নিয়ম', 'এই-সবকিছু-কভার-করে-এমন-একটা-নিয়ম'),
      p('<p>একজন user-এর সবসময় খুব বেশি না ভেবে তিনটা প্রশ্নের উত্তর দিতে পারা উচিত: আমি কোথায়? আমি কোথায় যেতে পারি? আমি কীভাবে ফিরে যাবো? যেকোনো navigation pattern যা এই তিনটা উত্তর স্পষ্ট রাখে সেটা তার কাজ করছে, নির্দিষ্ট কোন pattern ব্যবহার করা হচ্ছে তা নির্বিশেষে।</p>'),
      callout('tip', '<p>কোন pattern মানানসই তা নিশ্চিত না হলে, সেই product category-তে market leader আসলে কী ব্যবহার করে তা দেখুন — navigation হলো কয়েকটা এলাকার একটা যেখানে convention অনুসরণ করা সাধারণত সঠিক সিদ্ধান্ত, সৃজনশীলতার অভাব না।</p>', 'Convention এখানে একটা feature, সীমাবদ্ধতা না'),
    ],
  },
})

lessons.push({
  slug: 'forms-and-input-design', sortOrder: n++,
  en: {
    title: 'Forms & Input Design',
    metaTitle: 'Forms & Input Design | Learn Computer Academy',
    metaDescription: 'Practical rules for designing forms people actually complete — label placement, field order, validation timing, and reducing friction.',
    blocks: [
      p('<p>Forms are where the most real business value is won or lost — a signup, a checkout, a lead capture — and where small design mistakes cost the most in actual abandoned conversions.</p>'),
      h(2, 'Core Rules That Consistently Help'),
      table(['Rule', 'Why it works'], [
        ['Labels above fields, not inside them as placeholder-only text', 'A label that disappears on typing (placeholder-as-label) means the user forgets what field they\'re in'],
        ['Ask for only what\'s actually needed', 'Every extra field is a chance to abandon — a shorter form consistently converts better'],
        ['One column, not multi-column layouts', 'A single vertical flow is read and completed faster than the eye jumping between columns'],
        ['Group related fields visually', 'Address fields together, payment fields together — reduces perceived complexity'],
        ['Match input type to the data', 'A numeric keypad for a phone number field, not a full keyboard — small friction, real impact at scale'],
      ]),
      h(2, 'Validation Timing'),
      table(['Approach', 'What happens', 'Verdict'], [
        ['On submit only', 'All errors appear at once after clicking submit', 'Frustrating — forces a second pass through the whole form'],
        ['On every keystroke', 'Errors appear while still typing, even mid-word', 'Also frustrating — flags "invalid email" before the user has finished typing it'],
        ['On field blur (leaving the field)', 'Errors appear once the user moves to the next field', 'The best default — timely without being premature'],
      ]),
      h(2, 'Error Messages Worth Writing Well'),
      p('<p>"Invalid input" tells a user nothing useful. "Password must be at least 8 characters" tells them exactly what to fix. The difference in wording is small; the difference in whether the user succeeds on the next attempt is large.</p>'),
      callout('tip', '<p>Mark optional fields as "(optional)" rather than marking every required field with an asterisk — in a form where most fields are required, that\'s less visual noise for the same information.</p>', 'A small, often-missed detail'),
    ],
  },
  bn: {
    title: 'Form আর Input Design',
    metaTitle: 'Form আর Input Design | Learn Computer Academy',
    metaDescription: 'মানুষ আসলে শেষ করে এমন form design করার বাস্তব নিয়ম — label বসানো, field ক্রম, validation সময়, আর friction কমানো।',
    blocks: [
      p('<p>Form হলো যেখানে সবচেয়ে বেশি আসল ব্যবসায়িক মূল্য জেতা বা হারানো হয় — একটা signup, একটা checkout, একটা lead capture — আর যেখানে ছোট design ভুল আসল পরিত্যক্ত conversion-এ সবচেয়ে বেশি খরচ করে।</p>'),
      h(2, 'মূল নিয়ম যা ধারাবাহিকভাবে সাহায্য করে', 'মূল-নিয়ম-যা-ধারাবাহিকভাবে-সাহায্য-করে'),
      table(['নিয়ম', 'কেন এটা কাজ করে'], [
        ['Field-এর উপরে label, শুধু placeholder-হিসেবে-label না', 'একটা label যা type করার সময় অদৃশ্য হয়ে যায় (placeholder-as-label) মানে user ভুলে যায় তারা কোন field-এ আছে'],
        ['শুধু আসলে যা দরকার তা চান', 'প্রতিটা বাড়তি field ছেড়ে দেওয়ার একটা সুযোগ — একটা ছোট form ধারাবাহিকভাবে ভালো convert করে'],
        ['একটা column, multi-column layout না', 'চোখ column-এর মধ্যে লাফানোর চেয়ে একটা একক vertical flow দ্রুত পড়া আর শেষ করা যায়'],
        ['সম্পর্কিত field visually গ্রুপ করুন', 'address field একসাথে, payment field একসাথে — অনুভূত জটিলতা কমায়'],
        ['Data-এর সাথে input type মেলান', 'একটা phone number field-এর জন্য একটা numeric keypad, পুরো keyboard না — ছোট friction, বড় scale-এ আসল প্রভাব'],
      ]),
      h(2, 'Validation সময়', 'validation-সময়'),
      table(['পদ্ধতি', 'কী ঘটে', 'রায়'], [
        ['শুধু submit-এ', 'submit click করার পরে সব error একসাথে দেখা যায়', 'হতাশাজনক — পুরো form-এর মধ্য দিয়ে দ্বিতীয়বার যেতে বাধ্য করে'],
        ['প্রতিটা keystroke-এ', 'এখনো type করার সময় error দেখা যায়, শব্দের মাঝখানেও', 'এটাও হতাশাজনক — user type শেষ করার আগেই "invalid email" flag করে'],
        ['Field blur-এ (field ছাড়ার সময়)', 'user পরের field-এ গেলে error দেখা যায়', 'সেরা default — অকালপক্ব না হয়ে সময়োপযোগী'],
      ]),
      h(2, 'ভালোভাবে লেখার যোগ্য Error Message', 'ভালোভাবে-লেখার-যোগ্য-error-message'),
      p('<p>"Invalid input" একজন user-কে useful কিছু বলে না। "Password অন্তত ৮ character হতে হবে" তাদের ঠিক কী ঠিক করতে হবে বলে। শব্দচয়নের পার্থক্য ছোট; পরের চেষ্টায় user সফল হবে কিনা তার পার্থক্য বড়।</p>'),
      callout('tip', '<p>প্রতিটা প্রয়োজনীয় field-কে একটা asterisk দিয়ে চিহ্নিত করার বদলে ঐচ্ছিক field-গুলো "(ঐচ্ছিক)" হিসেবে চিহ্নিত করুন — একটা form-এ যেখানে বেশিরভাগ field প্রয়োজনীয়, সেটা একই তথ্যের জন্য কম visual শব্দ।</p>', 'একটা ছোট, প্রায়ই-মিস-করা detail'),
    ],
  },
})

// ═══ PHASE 3 — VISUAL HIERARCHY FOR PRODUCT UI ═══════════════════════════

lessons.push({
  slug: 'layout-and-grid-systems', sortOrder: n++,
  en: {
    title: 'Layout & Grid Systems',
    metaTitle: 'Layout & Grid Systems | Learn Computer Academy',
    metaDescription: 'Why product interfaces are built on invisible grids, how a 12-column grid works, and how it keeps a screen feeling ordered without a rigid, boxed-in look.',
    blocks: [
      p('<p>Every well-built interface is secretly built on a grid, even when nothing on screen looks boxed-in. The grid is invisible in the final product — its job is discipline, not decoration.</p>'),
      h(2, 'The 12-Column Grid'),
      p('<p>The most common layout grid divides the screen width into 12 equal columns with consistent gutters (gaps) between them. 12 is popular specifically because it divides evenly into halves, thirds, and quarters — a 2-column layout, a 3-column layout, and a 4-column layout can all share the same underlying grid without redesigning it.</p>'),
      table(['Layout need', 'Columns used (of 12)'], [
        ['Two equal side-by-side sections', '6 + 6'],
        ['A sidebar plus a main content area', '3 + 9, or 4 + 8'],
        ['Three equal cards in a row', '4 + 4 + 4'],
        ['Four equal cards in a row', '3 + 3 + 3 + 3'],
      ]),
      h(2, 'Why This Matters More Than It Looks Like'),
      p('<p>Elements aligned to a shared grid look intentional and ordered even without any visible lines — the eye picks up on the consistent edges. Elements placed "by eye" without a grid tend to look almost-but-not-quite aligned, which reads as sloppy even when the difference is only a few pixels.</p>'),
      h(2, 'Responsive Grids'),
      p('<p>The same 12-column logic typically collapses to fewer columns on smaller screens (commonly 4 on mobile, 8 on tablet) — covered in depth in the later responsive design lesson. The grid concept doesn\'t change; only the column count and gutter size adjust per breakpoint.</p>'),
      callout('tip', '<p>Figma\'s layout grid feature (under a frame\'s Layout Grid settings) can overlay a real 12-column grid directly on the canvas while designing — turning this from theory into a visible guide.</p>', 'A tool that makes this concrete'),
    ],
  },
  bn: {
    title: 'Layout আর Grid System',
    metaTitle: 'Layout আর Grid System | Learn Computer Academy',
    metaDescription: 'কেন product interface অদৃশ্য grid-এর উপর বানানো হয়, একটা 12-column grid কীভাবে কাজ করে, আর এটা কীভাবে একটা কঠোর, বাক্সবন্দী চেহারা ছাড়াই একটা screen-কে সুশৃঙ্খল রাখে।',
    blocks: [
      p('<p>প্রতিটা ভালোভাবে-বানানো interface গোপনে একটা grid-এর উপর বানানো, এমনকি যখন screen-এ কিছুই বাক্সবন্দী দেখায় না। চূড়ান্ত product-এ grid অদৃশ্য — এর কাজ শৃঙ্খলা, সাজসজ্জা না।</p>'),
      h(2, '12-Column Grid', '12-column-grid'),
      p('<p>সবচেয়ে সাধারণ layout grid screen প্রস্থকে সামঞ্জস্যপূর্ণ gutter (ফাঁক) সহ ১২টা সমান column-এ ভাগ করে। ১২ বিশেষভাবে জনপ্রিয় কারণ এটা অর্ধেক, তৃতীয়াংশ, আর চতুর্থাংশে সমানভাবে ভাগ হয় — একটা 2-column layout, একটা 3-column layout, আর একটা 4-column layout সবগুলো এটা redesign না করে একই অন্তর্নিহিত grid শেয়ার করতে পারে।</p>'),
      table(['Layout দরকার', 'ব্যবহৃত Column (১২টার মধ্যে)'], [
        ['দুটো সমান পাশাপাশি section', '6 + 6'],
        ['একটা sidebar আর একটা main content এলাকা', '3 + 9, বা 4 + 8'],
        ['একটা সারিতে তিনটা সমান card', '4 + 4 + 4'],
        ['একটা সারিতে চারটা সমান card', '3 + 3 + 3 + 3'],
      ]),
      h(2, 'কেন এটা যেমন দেখায় তার চেয়ে বেশি গুরুত্বপূর্ণ', 'কেন-এটা-যেমন-দেখায়-তার-চেয়ে-বেশি-গুরুত্বপূর্ণ'),
      p('<p>একটা শেয়ার করা grid-এ align করা element কোনো দৃশ্যমান লাইন ছাড়াই ইচ্ছাকৃত আর সুশৃঙ্খল দেখায় — চোখ সামঞ্জস্যপূর্ণ প্রান্ত ধরে ফেলে। কোনো grid ছাড়া "চোখ দিয়ে" বসানো element প্রায়-কিন্তু-ঠিক-না align করা দেখায় ঝোঁক রাখে, যা পার্থক্য মাত্র কয়েক পিক্সেল হলেও অগোছালো পড়ে।</p>'),
      h(2, 'Responsive Grid', 'responsive-grid'),
      p('<p>একই 12-column logic সাধারণত ছোট screen-এ কম column-এ সংকুচিত হয় (সাধারণত mobile-এ ৪, tablet-এ ৮) — পরের responsive design lesson-এ বিস্তারিত কভার করা। Grid concept বদলায় না; শুধু column সংখ্যা আর gutter আকার প্রতি breakpoint-এ সমন্বয় হয়।</p>'),
      callout('tip', '<p>Figma-এর layout grid feature (একটা frame-এর Layout Grid setting-এর অধীনে) design করার সময় সরাসরি canvas-এ একটা আসল 12-column grid overlay করতে পারে — এটাকে theory থেকে একটা দৃশ্যমান গাইডে পরিণত করে।</p>', 'একটা টুল যা এটা concrete করে'),
    ],
  },
})

lessons.push({
  slug: 'visual-hierarchy-and-contrast', sortOrder: n++,
  en: {
    title: 'Visual Hierarchy & Contrast',
    metaTitle: 'Visual Hierarchy & Contrast | Learn Computer Academy',
    metaDescription: 'How size, weight, color, and spacing create visual hierarchy in product UI, and why "everything is important" design ends up communicating nothing.',
    blocks: [
      p('<p><b>Visual hierarchy</b> is the order in which a user\'s eye is guided through a screen. A screen without hierarchy — where every element competes equally for attention — actually communicates less, not more, because nothing tells the eye where to start.</p>'),
      h(2, 'The Tools That Create Hierarchy'),
      table(['Tool', 'How it draws attention'], [
        ['Size', 'Bigger elements are noticed first — the most reliable hierarchy tool there is'],
        ['Weight (bold vs. regular)', 'Bold text reads as more important without changing size'],
        ['Color / contrast', 'A high-contrast element against a muted background pulls the eye first'],
        ['Whitespace around an element', 'Isolation makes something feel important — a busy area feels secondary'],
        ['Position', 'Top-left is read first in left-to-right languages; primary actions usually live there or bottom-right'],
      ]),
      h(2, 'A Practical Example: A Product Card'),
      p('<p>A typical e-commerce card has a clear intended hierarchy: product image (largest, first), then price (bold, high contrast), then title (medium), then a secondary detail like shipping info (smallest, muted). Flattening all of these to the same size and weight would technically show the same information — but a user would have to work to figure out what matters.</p>'),
      h(2, 'The "Everything Is Important" Trap'),
      p('<p>A common client or stakeholder request is to make several elements simultaneously bold, large, and colorful because each one feels important to them individually. The result cancels itself out — when everything is emphasized, nothing is, and the screen reads as noisy rather than clear.</p>'),
      callout('tip', '<p>A useful test: squint at a screen (or blur it) until only the shapes and darkest areas are visible. What still stands out is the real hierarchy — if it doesn\'t match the intended priority, the hierarchy needs work.</p>', 'The squint test'),
    ],
  },
  bn: {
    title: 'Visual Hierarchy আর Contrast',
    metaTitle: 'Visual Hierarchy আর Contrast | Learn Computer Academy',
    metaDescription: 'একটা product UI-তে আকার, weight, রং, আর spacing কীভাবে visual hierarchy তৈরি করে, আর কেন "সবকিছু গুরুত্বপূর্ণ" design শেষে কিছুই জানায় না।',
    blocks: [
      p('<p><b>Visual hierarchy</b> হলো ক্রম যেখানে একজন user-এর চোখ একটা screen-এর মধ্য দিয়ে পরিচালিত হয়। কোনো hierarchy ছাড়া একটা screen — যেখানে প্রতিটা element সমানভাবে মনোযোগের জন্য প্রতিযোগিতা করে — আসলে বেশি না, কম জানায়, কারণ কিছুই চোখকে বলে না কোথা থেকে শুরু করতে হবে।</p>'),
      h(2, 'Hierarchy তৈরি করা টুল', 'hierarchy-তৈরি-করা-টুল'),
      table(['টুল', 'এটা কীভাবে মনোযোগ টানে'], [
        ['আকার', 'বড় element প্রথমে লক্ষ্য করা হয় — এটাই সবচেয়ে নির্ভরযোগ্য hierarchy টুল'],
        ['Weight (bold বনাম regular)', 'Bold টেক্সট আকার না বদলেই বেশি গুরুত্বপূর্ণ হিসেবে পড়ে'],
        ['রং / contrast', 'একটা মৃদু background-এর বিপরীতে একটা উচ্চ-contrast element প্রথমে চোখ টানে'],
        ['একটা element-এর চারপাশে whitespace', 'বিচ্ছিন্নতা কিছুকে গুরুত্বপূর্ণ মনে করায় — একটা ব্যস্ত এলাকা গৌণ মনে হয়'],
        ['অবস্থান', 'বাম-থেকে-ডান ভাষায় top-left প্রথমে পড়া হয়; primary action সাধারণত সেখানে বা bottom-right-এ থাকে'],
      ]),
      h(2, 'একটা বাস্তব উদাহরণ: একটা Product Card', 'একটা-বাস্তব-উদাহরণ-একটা-product-card'),
      p('<p>একটা সাধারণ e-commerce card-এর একটা স্পষ্ট উদ্দিষ্ট hierarchy আছে: product image (সবচেয়ে বড়, প্রথম), তারপর price (bold, উচ্চ contrast), তারপর title (মাঝারি), তারপর shipping info-এর মতো একটা গৌণ detail (সবচেয়ে ছোট, মৃদু)। এগুলো সবকে একই আকার আর weight-এ সমতল করলে কারিগরিভাবে একই তথ্য দেখাবে — কিন্তু একজন user-কে কী গুরুত্বপূর্ণ তা বুঝতে কাজ করতে হবে।</p>'),
      h(2, '"সবকিছু গুরুত্বপূর্ণ" ফাঁদ', 'সবকিছু-গুরুত্বপূর্ণ-ফাঁদ'),
      p('<p>একটা সাধারণ client বা stakeholder request হলো একসাথে বেশ কয়েকটা element bold, বড়, আর রঙিন করা কারণ প্রতিটা তাদের কাছে ব্যক্তিগতভাবে গুরুত্বপূর্ণ মনে হয়। ফলাফল নিজেকে বাতিল করে দেয় — যখন সবকিছুতে জোর দেওয়া হয়, কিছুতেই দেওয়া হয় না, আর screen পরিষ্কারের বদলে কোলাহলপূর্ণ পড়ে।</p>'),
      callout('tip', '<p>একটা useful পরীক্ষা: একটা screen-এ চোখ কুঁচকে তাকান (বা এটা blur করুন) যতক্ষণ না শুধু আকৃতি আর সবচেয়ে গাঢ় এলাকা দৃশ্যমান থাকে। যা তখনো আলাদা দেখা যায় সেটাই আসল hierarchy — যদি এটা উদ্দিষ্ট priority-এর সাথে না মেলে, hierarchy-তে কাজ দরকার।</p>', 'কুঁচকে তাকানোর পরীক্ষা'),
    ],
  },
})

lessons.push({
  slug: 'consistency-and-design-patterns', sortOrder: n++,
  en: {
    title: 'Consistency & Design Patterns',
    metaTitle: 'Consistency & Design Patterns | Learn Computer Academy',
    metaDescription: 'Why consistency is one of the cheapest ways to make an interface feel more usable, and the difference between internal and external consistency.',
    blocks: [
      p('<p>Consistency is one of the cheapest, highest-leverage things a designer controls — it costs nothing extra to make and directly reduces how much a user has to relearn on every new screen.</p>'),
      h(2, 'Internal vs. External Consistency'),
      table(['Type', 'Meaning', 'Example'], [
        ['Internal consistency', 'The same element behaves and looks the same everywhere within one product', 'A "primary button" style is used identically on every screen, not reinvented per page'],
        ['External consistency', 'Following patterns users already know from other products', 'A shopping cart icon in the top-right, a hamburger menu behaving the way every other app\'s does'],
      ]),
      h(2, 'Why Breaking Consistency Is Expensive'),
      p('<p>Once a user learns that a certain icon, color, or position means a certain thing in a product, every exception to that rule costs real mental effort to notice and relearn — this is why a "unique" one-off design choice on a single screen often makes the whole product feel less usable, even if that one screen looks great in isolation.</p>'),
      h(2, 'Where Consistency Actually Comes From: Design Patterns'),
      p('<p>A <b>design pattern</b> is a reusable, proven solution to a common interface problem — a dropdown for choosing one of many options, a modal for a focused single task, a card for a repeatable content unit. Reaching for an established pattern rather than inventing a new interaction for a common problem is what actually produces consistency, both within a product and against user expectations from the wider web.</p>'),
      callout('note', '<p>Consistency doesn\'t mean never innovating — it means reserving genuine innovation for the parts of a product that are actually novel, and using boring, proven patterns everywhere else. A product that\'s "creative" in every single interaction is usually exhausting to use.</p>', 'Save creativity for what actually needs it'),
    ],
  },
  bn: {
    title: 'Consistency আর Design Pattern',
    metaTitle: 'Consistency আর Design Pattern | Learn Computer Academy',
    metaDescription: 'কেন consistency একটা interface-কে বেশি ব্যবহারযোগ্য মনে করানোর সবচেয়ে সস্তা উপায়গুলোর একটা, আর internal আর external consistency-এর মধ্যে পার্থক্য।',
    blocks: [
      p('<p>Consistency একজন designer-এর নিয়ন্ত্রণে থাকা সবচেয়ে সস্তা, সবচেয়ে বেশি leverage-এর জিনিসগুলোর একটা — এটা বানাতে বাড়তি কিছু খরচ হয় না আর সরাসরি একজন user-কে প্রতিটা নতুন screen-এ কতটা পুনরায় শিখতে হয় তা কমায়।</p>'),
      h(2, 'Internal বনাম External Consistency', 'internal-বনাম-external-consistency'),
      table(['ধরন', 'অর্থ', 'উদাহরণ'], [
        ['Internal consistency', 'একটা product-এর মধ্যে সর্বত্র একই element একইভাবে আচরণ করে আর দেখায়', 'একটা "primary button" style প্রতিটা screen-এ অভিন্নভাবে ব্যবহার করা হয়, প্রতি page-এ পুনরাবিষ্কার না'],
        ['External consistency', 'অন্য product থেকে user-রা ইতিমধ্যে জানে এমন pattern অনুসরণ করা', 'top-right-এ একটা shopping cart icon, একটা hamburger menu যা অন্য প্রতিটা app-এর মতোই আচরণ করে'],
      ]),
      h(2, 'কেন Consistency ভাঙা ব্যয়বহুল', 'কেন-consistency-ভাঙা-ব্যয়বহুল'),
      p('<p>একবার একজন user শিখে ফেললে যে একটা product-এ একটা নির্দিষ্ট icon, রং, বা অবস্থান একটা নির্দিষ্ট জিনিস মানে, সেই নিয়মের প্রতিটা ব্যতিক্রম লক্ষ্য করতে আর পুনরায় শিখতে আসল মানসিক পরিশ্রম খরচ করে — এই কারণেই একটা একক screen-এ একটা "unique" এককালীন design সিদ্ধান্ত প্রায়ই পুরো product-কে কম ব্যবহারযোগ্য মনে করায়, এমনকি যদি সেই একটা screen বিচ্ছিন্নভাবে দুর্দান্ত দেখায়।</p>'),
      h(2, 'Consistency আসলে কোথা থেকে আসে: Design Pattern', 'consistency-আসলে-কোথা-থেকে-আসে-design-pattern'),
      p('<p>একটা <b>design pattern</b> হলো একটা সাধারণ interface সমস্যার একটা পুনর্ব্যবহারযোগ্য, প্রমাণিত সমাধান — অনেকগুলোর মধ্যে একটা বেছে নেওয়ার জন্য একটা dropdown, একটা কেন্দ্রীভূত একক কাজের জন্য একটা modal, একটা পুনরাবৃত্তিযোগ্য content unit-এর জন্য একটা card। একটা সাধারণ সমস্যার জন্য একটা নতুন interaction আবিষ্কার করার বদলে একটা প্রতিষ্ঠিত pattern-এর দিকে যাওয়াই আসলে consistency তৈরি করে, একটা product-এর মধ্যে আর বৃহত্তর web থেকে user প্রত্যাশার বিরুদ্ধে দুটোতেই।</p>'),
      callout('note', '<p>Consistency মানে কখনো innovate না করা না — এর মানে একটা product-এর অংশগুলোর জন্য আসল innovation সংরক্ষণ করা যা আসলে নতুন, আর বাকি সব জায়গায় বিরক্তিকর, প্রমাণিত pattern ব্যবহার করা। একটা product যা প্রতিটা একক interaction-এ "সৃজনশীল" সাধারণত ব্যবহার করা ক্লান্তিকর।</p>', 'যা আসলে দরকার তার জন্য সৃজনশীলতা রাখুন'),
    ],
  },
})

lessons.push({
  slug: 'whitespace-and-density', sortOrder: n++,
  en: {
    title: 'Whitespace & Density',
    metaTitle: 'Whitespace & Density | Learn Computer Academy',
    metaDescription: 'Why whitespace is an active design tool rather than wasted space, and how to choose between a dense and a spacious layout for a given product.',
    blocks: [
      p('<p><b>Whitespace</b> (also called negative space) is the empty area between and around elements. New designers often see it as wasted room to be filled — experienced designers treat it as one of the most powerful tools available.</p>'),
      h(2, 'What Whitespace Actually Does'),
      table(['Effect', 'How'], [
        ['Improves readability', 'Text with generous line-height and margins is measurably easier to read than cramped text'],
        ['Creates grouping', 'Elements close together read as related; elements far apart read as separate (this is a real principle, covered again in the Figma course\'s layout lessons)'],
        ['Signals quality and focus', 'Generous whitespace is strongly associated with premium, confident brands — cramped layouts read as budget or rushed'],
        ['Reduces cognitive load', 'Fewer things visible at once means less for the eye and brain to process simultaneously'],
      ]),
      h(2, 'Dense vs. Spacious — Both Are Valid, for Different Products'),
      table(['Product type', 'Typical density', 'Why'], [
        ['A trading platform, an analytics dashboard', 'Dense', 'Power users value seeing more data at once over comfort — density is a feature there'],
        ['A marketing landing page, an onboarding flow', 'Spacious', 'A first-time or casual user needs focus and low pressure, not maximum information density'],
      ]),
      h(2, 'The Real Skill: Matching Density to the User\'s Expertise and Task'),
      p('<p>There is no universally "correct" amount of whitespace — a dense financial dashboard isn\'t bad design, and a spacious landing page isn\'t lazy design. The skill is choosing the right density for who\'s using the screen and what they\'re trying to do, not defaulting to one style everywhere.</p>'),
      callout('tip', '<p>When in doubt, add more whitespace than feels comfortable, then pull it back slightly. Most beginner layouts are too cramped, not too spacious — the instinct to fill every gap is worth actively resisting.</p>', 'The default bias to correct for'),
    ],
  },
  bn: {
    title: 'Whitespace আর Density',
    metaTitle: 'Whitespace আর Density | Learn Computer Academy',
    metaDescription: 'কেন whitespace নষ্ট হওয়া জায়গার বদলে একটা সক্রিয় design টুল, আর একটা নির্দিষ্ট product-এর জন্য dense আর spacious layout-এর মধ্যে কীভাবে বেছে নেবেন।',
    blocks: [
      p('<p><b>Whitespace</b> (negative space-ও বলা হয়) হলো element-গুলোর মধ্যে আর চারপাশের ফাঁকা এলাকা। নতুন designer-রা প্রায়ই এটাকে ভরাট করার জন্য নষ্ট হওয়া জায়গা হিসেবে দেখে — অভিজ্ঞ designer-রা এটাকে উপলব্ধ সবচেয়ে শক্তিশালী টুলগুলোর একটা হিসেবে ধরে।</p>'),
      h(2, 'Whitespace আসলে কী করে', 'whitespace-আসলে-কী-করে'),
      table(['প্রভাব', 'কীভাবে'], [
        ['পঠনযোগ্যতা উন্নত করে', 'উদার line-height আর margin সহ টেক্সট গাদাগাদি টেক্সটের চেয়ে পরিমাপযোগ্যভাবে সহজে পড়া যায়'],
        ['গ্রুপিং তৈরি করে', 'কাছাকাছি element সম্পর্কিত হিসেবে পড়ে; দূরের element আলাদা হিসেবে পড়ে (এটা একটা আসল principle, Figma কোর্সের layout lesson-এ আবার কভার করা)'],
        ['মান আর ফোকাস জানায়', 'উদার whitespace প্রিমিয়াম, আত্মবিশ্বাসী brand-এর সাথে শক্তিশালীভাবে যুক্ত — গাদাগাদি layout বাজেট বা তাড়াহুড়ো হিসেবে পড়ে'],
        ['Cognitive load কমায়', 'একবারে কম জিনিস দৃশ্যমান মানে চোখ আর মস্তিষ্কের একসাথে প্রক্রিয়া করার কম কিছু'],
      ]),
      h(2, 'Dense বনাম Spacious — দুটোই বৈধ, ভিন্ন product-এর জন্য', 'dense-বনাম-spacious-দুটোই-বৈধ-ভিন্ন-product-এর-জন্য'),
      table(['Product ধরন', 'সাধারণ density', 'কেন'], [
        ['একটা trading platform, একটা analytics dashboard', 'Dense', 'Power user-রা আরামের চেয়ে একসাথে বেশি data দেখতে মূল্য দেয় — সেখানে density একটা feature'],
        ['একটা marketing landing page, একটা onboarding flow', 'Spacious', 'একজন প্রথমবার আসা বা casual user-এর সর্বোচ্চ তথ্য density না, ফোকাস আর কম চাপ দরকার'],
      ]),
      h(2, 'আসল দক্ষতা: User-এর দক্ষতা আর কাজের সাথে Density মেলানো', 'আসল-দক্ষতা-user-এর-দক্ষতা-আর-কাজের-সাথে-density-মেলানো'),
      p('<p>Whitespace-এর কোনো সর্বজনীনভাবে "সঠিক" পরিমাণ নেই — একটা dense financial dashboard খারাপ design না, আর একটা spacious landing page অলস design না। দক্ষতা হলো কে screen ব্যবহার করছে আর তারা কী করার চেষ্টা করছে তার জন্য সঠিক density বেছে নেওয়া, সব জায়গায় একটা style default না করা।</p>'),
      callout('tip', '<p>সন্দেহ হলে, যা আরামদায়ক মনে হয় তার চেয়ে বেশি whitespace যোগ করুন, তারপর সামান্য কমিয়ে আনুন। বেশিরভাগ শিক্ষানবিস layout খুব গাদাগাদি, খুব spacious না — প্রতিটা ফাঁক ভরাট করার প্রবৃত্তি সক্রিয়ভাবে প্রতিরোধ করার যোগ্য।</p>', 'সংশোধন করার default পক্ষপাত'),
    ],
  },
})

// ═══ PHASE 4 — UX RESEARCH & STRUCTURE ═══════════════════════════════════

lessons.push({
  slug: 'user-personas', sortOrder: n++,
  en: {
    title: 'User Personas',
    metaTitle: 'User Personas | Learn Computer Academy',
    metaDescription: 'What a user persona actually is, how to build a useful one without fabricating demographics, and the most common ways personas go wrong.',
    blocks: [
      p('<p>A <b>persona</b> is a semi-fictional profile representing a real segment of a product\'s users, built from actual patterns rather than guesswork — a tool for keeping a whole team designing for the same real person instead of an unspoken assumption in each person\'s head.</p>'),
      img('docs/img/ui-ux/user-persona', 'An isometric illustration of a large user profile card with a silhouette icon surrounded by sticky notes and a clipboard', 1024, 768, 'A persona is a stand-in for a real, researched user pattern, not an invented character.'),
      h(2, 'What a Useful Persona Actually Contains'),
      table(['Section', 'What goes here'], [
        ['Name and a representative photo', 'Makes the persona feel like a real person the team can reference by name in conversation'],
        ['Goals', 'What this person is actually trying to accomplish with the product'],
        ['Frustrations / pain points', 'What currently gets in their way — the real problems being designed against'],
        ['Behaviors', 'How they actually use technology — device, context, technical comfort level'],
        ['A representative quote', 'One sentence, in their own voice, that captures their core need'],
      ]),
      h(2, 'The Most Common Mistake: Inventing Demographics Instead of Behavior'),
      p('<p>A weak persona is built around surface demographics — age, job title, hobbies — that rarely predict actual product behavior. A strong persona is built around behavior and goals relevant to the product: how tech-comfortable they are, what they\'re trying to accomplish, what\'s stopping them — the details that actually change a design decision.</p>'),
      h(2, 'Where Personas Should Come From'),
      p('<p>Ideally, personas are built from real user interviews or support data — actual patterns noticed across real people. When no research exists yet (common for a small project or a course exercise), a "provisional persona" built from reasonable assumptions is a fine starting point, as long as it\'s treated as a guess to be tested, not a fact.</p>'),
      callout('note', '<p>A persona\'s value isn\'t the document itself — it\'s the discipline of asking "would this actually help [persona name] achieve their goal?" during design decisions, instead of designing for an unstated assumption of "the average user."</p>', 'The document is a means, not the goal'),
    ],
  },
  bn: {
    title: 'User Persona',
    metaTitle: 'User Persona | Learn Computer Academy',
    metaDescription: 'একটা user persona আসলে কী, অনুমান-ভিত্তিক ডেমোগ্রাফিক বানানো ছাড়াই কীভাবে একটা useful persona বানাবেন, আর persona ভুল হওয়ার সবচেয়ে সাধারণ উপায়।',
    blocks: [
      p('<p>একটা <b>persona</b> হলো একটা product-এর user-দের একটা আসল segment প্রতিনিধিত্ব করা একটা আধা-কাল্পনিক profile, অনুমানের বদলে আসল প্যাটার্ন থেকে বানানো — একটা পুরো team-কে প্রত্যেকের মাথায় একটা অব্যক্ত অনুমানের বদলে একই আসল ব্যক্তির জন্য design করে রাখার একটা টুল।</p>'),
      img('docs/img/ui-ux/user-persona', 'sticky note আর একটা clipboard দ্বারা ঘেরা একটা silhouette icon সহ একটা বড় user profile card-এর একটা isometric illustration', 1024, 768, 'একটা persona একটা আবিষ্কৃত চরিত্র না, একটা আসল, গবেষণা-করা user প্যাটার্নের একটা প্রতিনিধি।'),
      h(2, 'একটা Useful Persona-তে আসলে কী থাকে', 'একটা-useful-persona-তে-আসলে-কী-থাকে'),
      table(['অংশ', 'এখানে কী থাকে'], [
        ['নাম আর একটা প্রতিনিধিত্বমূলক ছবি', 'Persona-কে একটা আসল ব্যক্তির মতো মনে করায় যাকে team কথোপকথনে নাম ধরে উল্লেখ করতে পারে'],
        ['লক্ষ্য', 'এই ব্যক্তি আসলে product দিয়ে কী অর্জন করার চেষ্টা করছে'],
        ['হতাশা / pain point', 'বর্তমানে তাদের পথে কী আসে — যে আসল সমস্যার বিরুদ্ধে design করা হচ্ছে'],
        ['আচরণ', 'তারা আসলে প্রযুক্তি কীভাবে ব্যবহার করে — device, context, প্রযুক্তিগত স্বাচ্ছন্দ্যের স্তর'],
        ['একটা প্রতিনিধিত্বমূলক উক্তি', 'তাদের নিজের কণ্ঠে একটা বাক্য যা তাদের মূল প্রয়োজন ধরে'],
      ]),
      h(2, 'সবচেয়ে সাধারণ ভুল: আচরণের বদলে Demographic আবিষ্কার করা', 'সবচেয়ে-সাধারণ-ভুল-আচরণের-বদলে-demographic-আবিষ্কার-করা'),
      p('<p>একটা দুর্বল persona পৃষ্ঠস্তরের demographic-এর চারপাশে বানানো — বয়স, চাকরির title, শখ — যা কদাচিৎ আসল product আচরণ পূর্বাভাস দেয়। একটা শক্তিশালী persona product-এর প্রাসঙ্গিক আচরণ আর লক্ষ্যের চারপাশে বানানো: তারা কতটা প্রযুক্তি-স্বাচ্ছন্দ্য, তারা কী অর্জন করার চেষ্টা করছে, তাদের কী থামাচ্ছে — যে detail আসলে একটা design সিদ্ধান্ত বদলায়।</p>'),
      h(2, 'Persona কোথা থেকে আসা উচিত', 'persona-কোথা-থেকে-আসা-উচিত'),
      p('<p>আদর্শভাবে, persona আসল user interview বা support data থেকে বানানো হয় — আসল মানুষ জুড়ে লক্ষ্য করা আসল প্যাটার্ন। যখন এখনো কোনো গবেষণা নেই (একটা ছোট প্রজেক্ট বা course exercise-এর জন্য সাধারণ), যুক্তিসঙ্গত অনুমান থেকে বানানো একটা "provisional persona" একটা ভালো শুরুর বিন্দু, যতক্ষণ এটাকে একটা সত্য হিসেবে না নিয়ে পরীক্ষা করার একটা অনুমান হিসেবে ধরা হয়।</p>'),
      callout('note', '<p>একটা persona-এর মূল্য document নিজেই না — এটা design সিদ্ধান্তের সময় "গড় user"-এর একটা অব্যক্ত অনুমানের জন্য design করার বদলে "এটা কি আসলে [persona নাম]-কে তাদের লক্ষ্য অর্জন করতে সাহায্য করবে?" জিজ্ঞাসা করার শৃঙ্খলা।</p>', 'Document একটা মাধ্যম, লক্ষ্য না'),
    ],
  },
})

lessons.push({
  slug: 'user-journey-mapping', sortOrder: n++,
  en: {
    title: 'User Journey Mapping',
    metaTitle: 'User Journey Mapping | Learn Computer Academy',
    metaDescription: 'What a user journey map is, the parts every good one includes, and how mapping the full journey reveals problems a single screen never would.',
    blocks: [
      p('<p>A <b>user journey map</b> traces a persona\'s full path toward a goal — every step, thought, and emotion — not just the screens inside one product. It often reveals that the real problem is happening before or after the app even opens.</p>'),
      img('docs/img/ui-ux/journey-map', 'An isometric illustration of a winding dotted path with icons for a phone, a shopping cart, and a checkmark placed along it', 1024, 768, 'The journey usually starts before the app opens and continues after it closes.'),
      h(2, 'The Core Parts of a Journey Map'),
      table(['Part', 'What it captures'], [
        ['Stages', 'The broad phases of the journey — e.g. Awareness, Research, Purchase, Onboarding, Ongoing use'],
        ['Actions', 'What the user is actually doing at each stage'],
        ['Thoughts', 'What\'s going through their mind — questions, doubts, expectations'],
        ['Emotions', 'Often plotted as a simple line — confident, confused, frustrated, satisfied — that rises and falls across the journey'],
        ['Pain points', 'Where the emotion line dips — the specific moments worth fixing first'],
        ['Opportunities', 'Ideas for improving each pain point, added once the map is complete'],
      ]),
      h(2, 'Why Mapping the Whole Journey Matters'),
      p('<p>A team focused only on their own app\'s screens can perfect every one of them and still lose users — because the real friction was in the step before ("I couldn\'t figure out which plan to buy from the marketing page") or after ("I got the confirmation email but couldn\'t find my way back to actually use the product"). The journey map forces the full picture into view.</p>'),
      h(2, 'A Simple Way to Start'),
      p('<p>For a small project, this doesn\'t need special software — a shared document with one column per stage and a row each for actions/thoughts/emotions covers the essentials. The value is the exercise of walking through the whole journey in order, not the polish of the artifact.</p>'),
      callout('tip', '<p>Journey mapping pairs naturally with the previous persona lesson — map the journey for one specific persona at a time, not a vague "the user" that blends several different real user types together.</p>', 'One persona per map'),
    ],
  },
  bn: {
    title: 'User Journey Mapping',
    metaTitle: 'User Journey Mapping | Learn Computer Academy',
    metaDescription: 'একটা user journey map আসলে কী, প্রতিটা ভালো একটাতে থাকা অংশ, আর পুরো journey mapping কীভাবে একটা একক screen কখনো দেখাতো না এমন সমস্যা প্রকাশ করে।',
    blocks: [
      p('<p>একটা <b>user journey map</b> একটা লক্ষ্যের দিকে একটা persona-এর পুরো পথ ধরে রাখে — প্রতিটা ধাপ, চিন্তা, আর আবেগ — শুধু একটা product-এর ভিতরের screen না। এটা প্রায়ই প্রকাশ করে যে আসল সমস্যা app খোলার আগে বা পরে ঘটছে।</p>'),
      img('docs/img/ui-ux/journey-map', 'একটা phone, একটা shopping cart, আর একটা checkmark-এর icon সহ একটা এলোমেলো dotted path-এর একটা isometric illustration', 1024, 768, 'Journey সাধারণত app খোলার আগে শুরু হয় আর বন্ধ হওয়ার পরেও চলতে থাকে।'),
      h(2, 'একটা Journey Map-এর মূল অংশ', 'একটা-journey-map-এর-মূল-অংশ'),
      table(['অংশ', 'এটা কী ধরে রাখে'], [
        ['পর্যায়', 'journey-এর বিস্তৃত পর্যায় — যেমন Awareness, Research, Purchase, Onboarding, চলমান ব্যবহার'],
        ['কাজ', 'প্রতিটা পর্যায়ে user আসলে কী করছে'],
        ['চিন্তা', 'তাদের মনে কী চলছে — প্রশ্ন, সন্দেহ, প্রত্যাশা'],
        ['আবেগ', 'প্রায়ই একটা সরল লাইন হিসেবে প্লট করা — আত্মবিশ্বাসী, বিভ্রান্ত, হতাশ, সন্তুষ্ট — যা journey জুড়ে ওঠানামা করে'],
        ['Pain point', 'যেখানে আবেগের লাইন নামে — প্রথমে ঠিক করার যোগ্য নির্দিষ্ট মুহূর্ত'],
        ['সুযোগ', 'প্রতিটা pain point উন্নত করার ধারণা, map সম্পূর্ণ হয়ে গেলে যোগ করা'],
      ]),
      h(2, 'কেন পুরো Journey Mapping গুরুত্বপূর্ণ', 'কেন-পুরো-journey-mapping-গুরুত্বপূর্ণ'),
      p('<p>একটা team শুধু তাদের নিজস্ব app-এর screen-এ ফোকাস করে প্রতিটা নিখুঁত করতে পারে আর তবুও user হারাতে পারে — কারণ আসল ঘর্ষণ আগের ধাপে ছিল ("marketing page থেকে কোন plan কিনবো তা বুঝতে পারিনি") বা পরে ("confirmation email পেলাম কিন্তু আসলে product ব্যবহার করার পথ খুঁজে পাইনি")। Journey map পুরো ছবিকে দৃষ্টিতে বাধ্য করে।</p>'),
      h(2, 'শুরু করার একটা সরল উপায়', 'শুরু-করার-একটা-সরল-উপায়'),
      p('<p>একটা ছোট প্রজেক্টের জন্য, এতে বিশেষ software দরকার নেই — প্রতি পর্যায়ে একটা column আর কাজ/চিন্তা/আবেগের জন্য একটা করে row সহ একটা শেয়ার করা document মূল বিষয়গুলো কভার করে। মূল্য হলো ক্রমানুসারে পুরো journey-এর মধ্য দিয়ে হাঁটার ব্যায়াম, artifact-এর polish না।</p>'),
      callout('tip', '<p>Journey mapping স্বাভাবিকভাবে আগের persona lesson-এর সাথে জোড়া লাগে — একবারে একটা নির্দিষ্ট persona-এর journey map করুন, বেশ কয়েকটা ভিন্ন আসল user ধরনকে একসাথে মিশিয়ে ফেলা একটা অস্পষ্ট "user" না।</p>', 'প্রতি map-এ একটা persona'),
    ],
  },
})

lessons.push({
  slug: 'information-architecture-and-sitemaps', sortOrder: n++,
  en: {
    title: 'Information Architecture & Sitemaps',
    metaTitle: 'Information Architecture & Sitemaps | Learn Computer Academy',
    metaDescription: 'What information architecture actually means, how to structure content into a sitemap, and why getting this wrong makes every screen fight an uphill battle.',
    blocks: [
      p('<p><b>Information architecture (IA)</b> is how a product\'s content and features are organized and labeled — the structure a user navigates through, decided before a single screen gets designed. Getting IA wrong means every individual screen ends up fighting an uphill, structural battle no amount of visual polish can fix.</p>'),
      h(2, 'A Sitemap — IA Made Visible'),
      p('<p>A <b>sitemap</b> is a simple diagram showing every page or screen in a product and how they connect — effectively a family tree of the whole product. It\'s usually the first concrete artifact built after research, before any wireframing starts.</p>'),
      h(2, 'Common Organization Schemes'),
      table(['Scheme', 'How content is grouped', 'Example'], [
        ['By topic/category', 'Content grouped by subject matter', 'A recipe site organized by cuisine type'],
        ['By task', 'Content grouped by what the user is trying to do', 'A banking app organized by "Pay," "Save," "Borrow"'],
        ['By audience', 'Separate paths for different user types', 'A university site split into "Prospective students," "Current students," "Faculty"'],
        ['Chronological', 'Content ordered by time', 'A news site, a project timeline'],
      ]),
      h(2, 'Card Sorting — A Simple Way to Validate Structure'),
      p('<p>Card sorting means giving real users a set of content items (on physical or digital cards) and asking them to group them in a way that makes sense to them, without dictating categories. The resulting groupings — not the designer\'s own instinct — reveal the labels and structure users actually expect.</p>'),
      callout('tip', '<p>A quick rule of thumb for depth: a user should reach almost anything in a product within 3 clicks. Past that, either the structure is too deep, or the categories at each level aren\'t the ones users would actually guess.</p>', 'The 3-click rule of thumb'),
    ],
  },
  bn: {
    title: 'Information Architecture আর Sitemap',
    metaTitle: 'Information Architecture আর Sitemap | Learn Computer Academy',
    metaDescription: 'Information architecture আসলে কী মানে, content-কে কীভাবে একটা sitemap-এ গঠন করবেন, আর কেন এটা ভুল করলে প্রতিটা screen একটা কঠিন যুদ্ধ লড়ে।',
    blocks: [
      p('<p><b>Information architecture (IA)</b> হলো একটা product-এর content আর feature কীভাবে সংগঠিত আর label করা — একটা user যে গঠনের মধ্য দিয়ে navigate করে, একটা একক screen design হওয়ার আগেই ঠিক করা। IA ভুল করা মানে প্রতিটা পৃথক screen একটা কঠিন, গঠনগত যুদ্ধ লড়ে যা কোনো পরিমাণ visual polish ঠিক করতে পারে না।</p>'),
      h(2, 'একটা Sitemap — IA দৃশ্যমান করা', 'একটা-sitemap-ia-দৃশ্যমান-করা'),
      p('<p>একটা <b>sitemap</b> হলো একটা সরল diagram যা একটা product-এর প্রতিটা page বা screen আর তারা কীভাবে সংযুক্ত তা দেখায় — কার্যকরভাবে পুরো product-এর একটা family tree। যেকোনো wireframing শুরু হওয়ার আগে গবেষণার পরে এটা সাধারণত প্রথম concrete artifact।</p>'),
      h(2, 'সাধারণ সংগঠন Scheme', 'সাধারণ-সংগঠন-scheme'),
      table(['Scheme', 'Content কীভাবে গ্রুপ করা', 'উদাহরণ'], [
        ['বিষয় অনুযায়ী', 'বিষয়বস্তু অনুযায়ী গ্রুপ করা content', 'রান্নার ধরন অনুযায়ী সংগঠিত একটা recipe site'],
        ['কাজ অনুযায়ী', 'user কী করার চেষ্টা করছে তা অনুযায়ী গ্রুপ করা content', '"Pay," "Save," "Borrow" অনুযায়ী সংগঠিত একটা banking app'],
        ['দর্শক অনুযায়ী', 'ভিন্ন user ধরনের জন্য আলাদা path', '"Prospective students," "Current students," "Faculty"-তে বিভক্ত একটা university site'],
        ['কালানুক্রমিক', 'সময় অনুযায়ী সাজানো content', 'একটা news site, একটা project timeline'],
      ]),
      h(2, 'Card Sorting — গঠন যাচাই করার একটা সরল উপায়', 'card-sorting-গঠন-যাচাই-করার-একটা-সরল-উপায়'),
      p('<p>Card sorting মানে আসল user-দের content item-এর একটা সেট (physical বা digital card-এ) দেওয়া আর তাদের কাছে অর্থবহ এমনভাবে গ্রুপ করতে বলা, category নির্দেশ না করে। ফলাফল গ্রুপিং — designer-এর নিজের প্রবৃত্তি না — প্রকাশ করে user-রা আসলে কী label আর গঠন প্রত্যাশা করে।</p>'),
      callout('tip', '<p>গভীরতার জন্য একটা দ্রুত rule of thumb: একজন user-এর একটা product-এ প্রায় যেকোনো কিছু ৩টা click-এর মধ্যে পৌঁছানো উচিত। এর বাইরে, হয় গঠন খুব গভীর, বা প্রতিটা স্তরের category সেগুলো না যা user-রা আসলে অনুমান করবে।</p>', '৩-click rule of thumb'),
    ],
  },
})

lessons.push({
  slug: 'wireframing-low-fi', sortOrder: n++,
  en: {
    title: 'Wireframing (Low-Fi)',
    metaTitle: 'Wireframing (Low-Fi) | Learn Computer Academy',
    metaDescription: 'What a low-fidelity wireframe is, why leaving out color and real content on purpose speeds up feedback, and how to build one in Figma.',
    blocks: [
      p('<p>A <b>wireframe</b> is a rough, low-detail layout of a screen — boxes, lines, and placeholder text standing in for real content and visuals. It answers "where does everything go and in what order," deliberately before answering "what does it look like."</p>'),
      img('docs/img/ui-ux/wireframe-figma-screenshot', 'A real low-fidelity wireframe built in Figma showing a mobile screen with a header bar, an image placeholder with a diagonal cross, three text lines, and an orange call-to-action button', 1024, 768, 'A real low-fi wireframe — grey boxes and placeholder text standing in for a header, an image, some copy, and a button.'),
      h(2, 'Why Leave Out Color and Real Content on Purpose'),
      p('<p>Grey boxes and Latin filler text aren\'t laziness — they\'re a deliberate choice to keep feedback focused on structure and flow. A reviewer looking at a full-color, polished-looking wireframe tends to comment on colors and fonts; a reviewer looking at grey boxes comments on layout and flow, which is exactly the feedback this stage needs.</p>'),
      h(2, 'Standard Wireframe Elements'),
      table(['Element', 'How it\'s represented'], [
        ['Image or photo', 'A box with a diagonal X through it'],
        ['Body text', 'Horizontal grey lines of varying width'],
        ['A heading', 'A single, slightly thicker or wider grey line'],
        ['A button', 'A rectangle, sometimes just outlined'],
        ['Navigation', 'Simple boxes or a labeled bar, not final icon designs'],
      ]),
      h(2, 'Low-Fi vs. High-Fi'),
      p('<p>Low-fidelity wireframes are fast to make and fast to throw away — several rough versions can be sketched and compared in the time it takes to polish one. This is intentional: the earlier a bad structural idea gets caught, the cheaper it is to fix. The next lesson covers high-fidelity prototyping, once the structure is settled.</p>'),
      callout('tip', '<p>Many designers start wireframes on paper before ever opening Figma — a pencil sketch takes seconds to redraw, encouraging genuinely fast iteration in a way a digital tool sometimes doesn\'t.</p>', 'Paper is a legitimate wireframing tool'),
    ],
  },
  bn: {
    title: 'Wireframing (Low-Fi)',
    metaTitle: 'Wireframing (Low-Fi) | Learn Computer Academy',
    metaDescription: 'একটা low-fidelity wireframe কী, কেন ইচ্ছাকৃতভাবে রং আর আসল content বাদ দেওয়া feedback দ্রুত করে, আর Figma-তে কীভাবে একটা বানাবেন।',
    blocks: [
      p('<p>একটা <b>wireframe</b> হলো একটা screen-এর একটা মোটামুটি, কম-detail layout — box, লাইন, আর placeholder টেক্সট আসল content আর visual-এর জায়গায়। এটা ইচ্ছাকৃতভাবে "এটা দেখতে কেমন" উত্তর দেওয়ার আগে "সবকিছু কোথায় যায় আর কোন ক্রমে" উত্তর দেয়।</p>'),
      img('docs/img/ui-ux/wireframe-figma-screenshot', 'Figma-তে বানানো একটা আসল low-fidelity wireframe একটা mobile screen দেখাচ্ছে একটা header bar, একটা diagonal cross সহ একটা image placeholder, তিনটা টেক্সট লাইন, আর একটা orange call-to-action button সহ', 1024, 768, 'একটা আসল low-fi wireframe — ধূসর box আর placeholder টেক্সট একটা header, একটা image, কিছু copy, আর একটা button-এর জায়গায়।'),
      h(2, 'কেন ইচ্ছাকৃতভাবে রং আর আসল Content বাদ দেওয়া', 'কেন-ইচ্ছাকৃতভাবে-রং-আর-আসল-content-বাদ-দেওয়া'),
      p('<p>ধূসর box আর Latin filler টেক্সট অলসতা না — এগুলো structure আর flow-এ feedback কেন্দ্রীভূত রাখার একটা ইচ্ছাকৃত সিদ্ধান্ত। একটা পুরো-রঙের, পালিশ করা wireframe দেখা একজন reviewer রং আর font নিয়ে মন্তব্য করার ঝোঁক রাখে; ধূসর box দেখা একজন reviewer layout আর flow নিয়ে মন্তব্য করে, যা ঠিক এই পর্যায়ের দরকার এমন feedback।</p>'),
      h(2, 'মানক Wireframe Element', 'মানক-wireframe-element'),
      table(['Element', 'কীভাবে প্রতিনিধিত্ব করা'], [
        ['একটা image বা ছবি', 'এর মধ্য দিয়ে একটা diagonal X সহ একটা box'],
        ['Body টেক্সট', 'বিভিন্ন প্রস্থের horizontal ধূসর লাইন'],
        ['একটা heading', 'একটা একক, সামান্য মোটা বা প্রশস্ত ধূসর লাইন'],
        ['একটা button', 'একটা rectangle, কখনো কখনো শুধু outline করা'],
        ['Navigation', 'সরল box বা একটা label করা bar, চূড়ান্ত icon design না'],
      ]),
      h(2, 'Low-Fi বনাম High-Fi', 'low-fi-বনাম-high-fi'),
      p('<p>Low-fidelity wireframe বানাতে দ্রুত আর ফেলে দিতে দ্রুত — একটা পালিশ করার সময়ে বেশ কয়েকটা মোটামুটি version sketch আর তুলনা করা যায়। এটা ইচ্ছাকৃত: যত আগে একটা খারাপ structural ধারণা ধরা পড়ে, ঠিক করা তত সস্তা। পরের lesson high-fidelity prototyping কভার করে, structure স্থির হয়ে গেলে।</p>'),
      callout('tip', '<p>অনেক designer Figma খোলার আগেই কাগজে wireframe শুরু করে — একটা pencil sketch পুনরায় আঁকতে কয়েক সেকেন্ড লাগে, একটা digital টুল কখনো কখনো যেভাবে করে না সেভাবে আসলেই দ্রুত iteration উৎসাহিত করে।</p>', 'কাগজ একটা বৈধ wireframing টুল'),
    ],
  },
})

lessons.push({
  slug: 'prototyping-and-usability-testing-basics', sortOrder: n++,
  en: {
    title: 'Prototyping (Hi-Fi) & Usability Testing Basics',
    metaTitle: 'Prototyping & Usability Testing Basics | Learn Computer Academy',
    metaDescription: 'How high-fidelity prototypes connect real screens into a clickable flow, and the basics of running a simple usability test to check the work.',
    blocks: [
      p('<p>A <b>prototype</b> connects real (or near-real) screens together into something a person can actually click through — the step where a static design starts behaving like a real product, before any code gets written.</p>'),
      img('docs/img/ui-ux/prototype-figma-screenshot', 'Two connected mobile wireframe screens in Figma with an orange connector arrow showing a prototype link from a button on the first screen to the second screen', 1024, 768, 'A prototype connection — clicking that button actually advances to the next real screen.'),
      h(2, 'Low-Fi Wireframe vs. Hi-Fi Prototype'),
      table(['', 'Low-fi wireframe', 'Hi-fi prototype'], [
        ['Visual detail', 'Grey boxes, placeholder text', 'Real colors, real copy, close to final visuals'],
        ['Interactivity', 'Static, one screen at a time', 'Clickable — screens are connected, buttons actually navigate'],
        ['Used for', 'Fast structural feedback, early exploration', 'Realistic testing, stakeholder demos, developer handoff reference'],
        ['Built in', 'Paper, or simple shapes in Figma', 'Figma\'s Prototype tab, connecting frames with interactions'],
      ]),
      h(2, 'Building One in Figma'),
      p('<p>In Figma\'s Prototype tab, selecting an element reveals a connection node — dragging it onto another frame creates a clickable link. Stacking several of these across a flow (a button that goes to a detail screen, a back arrow that returns) produces something a real person can click through as if it were the finished app, covered hands-on in this site\'s Figma course.</p>'),
      h(2, 'A Simple Usability Test'),
      p('<p>Testing doesn\'t require a lab or dozens of participants — even 5 people trying a task on a prototype reliably surfaces most major usability problems. The core method: give someone a specific task ("find and add this item to your cart"), watch them attempt it without helping, and note exactly where they hesitate, click the wrong thing, or get stuck.</p>'),
      callout('tip', '<p>Never explain how the prototype works before a test — if a real user would be confused without an explanation, a real customer will be too. Silence during the test is where the honest feedback lives.</p>', 'Resist the urge to help'),
    ],
  },
  bn: {
    title: 'Prototyping (Hi-Fi) আর Usability Testing-এর মূল বিষয়',
    metaTitle: 'Prototyping আর Usability Testing-এর মূল বিষয় | Learn Computer Academy',
    metaDescription: 'High-fidelity prototype কীভাবে আসল screen-কে একটা clickable flow-এ সংযুক্ত করে, আর কাজ পরীক্ষা করতে একটা সরল usability test চালানোর মূল বিষয়।',
    blocks: [
      p('<p>একটা <b>prototype</b> আসল (বা প্রায়-আসল) screen-কে একসাথে সংযুক্ত করে এমন কিছুতে পরিণত করে যা একজন ব্যক্তি আসলে click করে দেখতে পারে — যে ধাপে একটা static design কোনো code লেখার আগে একটা আসল product-এর মতো আচরণ শুরু করে।</p>'),
      img('docs/img/ui-ux/prototype-figma-screenshot', 'Figma-তে দুটো সংযুক্ত mobile wireframe screen একটা orange connector arrow সহ প্রথম screen-এর একটা button থেকে দ্বিতীয় screen-এ একটা prototype link দেখাচ্ছে', 1024, 768, 'একটা prototype connection — সেই button click করলে আসলে পরের আসল screen-এ এগিয়ে যায়।'),
      h(2, 'Low-Fi Wireframe বনাম Hi-Fi Prototype', 'low-fi-wireframe-বনাম-hi-fi-prototype'),
      table(['', 'Low-fi wireframe', 'Hi-fi prototype'], [
        ['Visual detail', 'ধূসর box, placeholder টেক্সট', 'আসল রং, আসল copy, চূড়ান্ত visual-এর কাছাকাছি'],
        ['Interactivity', 'Static, একবারে একটা screen', 'Clickable — screen সংযুক্ত, button আসলে navigate করে'],
        ['যার জন্য ব্যবহৃত', 'দ্রুত structural feedback, প্রাথমিক অন্বেষণ', 'বাস্তবসম্মত testing, stakeholder demo, developer handoff reference'],
        ['যাতে বানানো', 'কাগজ, বা Figma-তে সরল আকৃতি', "Figma-এর Prototype tab, interaction দিয়ে frame সংযুক্ত করা"],
      ]),
      h(2, 'Figma-তে একটা বানানো', 'figma-তে-একটা-বানানো'),
      p('<p>Figma-এর Prototype tab-এ, একটা element বেছে নিলে একটা connection node দেখা যায় — এটা আরেকটা frame-এ drag করলে একটা clickable link তৈরি হয়। একটা flow জুড়ে এরকম বেশ কয়েকটা স্তুপ করলে (একটা button যা একটা detail screen-এ যায়, একটা back arrow যা ফিরে আসে) এমন কিছু তৈরি হয় যা একজন আসল ব্যক্তি click করে দেখতে পারে যেন এটা শেষ হওয়া app, এই সাইটের Figma কোর্সে হাতে-কলমে কভার করা।</p>'),
      h(2, 'একটা সরল Usability Test', 'একটা-সরল-usability-test'),
      p('<p>Testing-এ কোনো lab বা ডজন ডজন participant দরকার নেই — একটা prototype-এ একটা কাজ চেষ্টা করা মাত্র ৫ জন মানুষও নির্ভরযোগ্যভাবে বেশিরভাগ বড় usability সমস্যা প্রকাশ করে। মূল পদ্ধতি: কাউকে একটা নির্দিষ্ট কাজ দিন ("এই item-টা খুঁজে আপনার cart-এ যোগ করুন"), সাহায্য না করে তাদের চেষ্টা দেখুন, আর ঠিক কোথায় তারা ইতস্তত করে, ভুল জিনিস click করে, বা আটকে যায় তা নোট করুন।</p>'),
      callout('tip', '<p>একটা test-এর আগে কখনো prototype কীভাবে কাজ করে তা ব্যাখ্যা করবেন না — যদি একজন আসল user ব্যাখ্যা ছাড়া বিভ্রান্ত হয়, একজন আসল customer-ও হবে। Test-এর সময় নীরবতাই যেখানে সৎ feedback থাকে।</p>', 'সাহায্য করার তাড়না প্রতিরোধ করুন'),
    ],
  },
})

// ═══ PHASE 5 — PRACTICE & SYSTEMS ═════════════════════════════════════════

lessons.push({
  slug: 'responsive-and-mobile-first-design', sortOrder: n++,
  en: {
    title: 'Responsive & Mobile-First Design',
    metaTitle: 'Responsive & Mobile-First Design | Learn Computer Academy',
    metaDescription: 'What responsive design and mobile-first design actually mean, common breakpoints, and why designing small screens first produces better large-screen designs too.',
    blocks: [
      p('<p><b>Responsive design</b> means one design that adapts to different screen sizes, rather than separate designs built for each device. <b>Mobile-first</b> is a specific way of approaching that: designing the smallest, most constrained screen first, then expanding.</p>'),
      h(2, 'Common Breakpoints'),
      table(['Breakpoint', 'Typical width', 'Common device'], [
        ['Mobile', '< 600px', 'Phones'],
        ['Tablet', '600–1024px', 'Tablets, small laptops'],
        ['Desktop', '1024px+', 'Laptops, desktop monitors'],
      ]),
      h(2, 'Why Mobile-First, Specifically'),
      p('<p>Designing for the smallest screen first forces real prioritization from the start — there\'s no room to fit "everything," so only what actually matters survives. Designing desktop-first and then trying to cram it onto mobile tends to produce a cluttered, compromised mobile experience, since nothing was cut, only shrunk.</p>'),
      h(2, 'What Actually Changes Between Breakpoints'),
      table(['Element', 'How it typically adapts'], [
        ['Navigation', 'Full menu bar on desktop often collapses to a hamburger menu on mobile'],
        ['Grid columns', 'A 3-4 column desktop layout often becomes a single column on mobile (see the earlier grid systems lesson)'],
        ['Touch targets', 'Buttons and tappable areas need to be larger on touchscreens — a mouse cursor is far more precise than a fingertip'],
        ['Images', 'Often cropped or resized differently per breakpoint, not just scaled uniformly'],
      ]),
      callout('tip', '<p>Design and test on a real phone, not just a resized browser window on a desktop — actual touch targets, actual thumb reach, and actual load times on mobile data reveal problems a desktop preview never will.</p>', 'Test on the real thing when possible'),
    ],
  },
  bn: {
    title: 'Responsive আর Mobile-First Design',
    metaTitle: 'Responsive আর Mobile-First Design | Learn Computer Academy',
    metaDescription: 'Responsive design আর mobile-first design আসলে কী মানে, সাধারণ breakpoint, আর কেন ছোট screen প্রথমে design করা বড় screen design-ও ভালো করে।',
    blocks: [
      p('<p><b>Responsive design</b> মানে একটা design যা ভিন্ন screen আকারের সাথে খাপ খায়, প্রতিটা device-এর জন্য আলাদা design বানানোর বদলে। <b>Mobile-first</b> এটার কাছে যাওয়ার একটা নির্দিষ্ট উপায়: সবচেয়ে ছোট, সবচেয়ে সীমাবদ্ধ screen প্রথমে design করা, তারপর প্রসারিত করা।</p>'),
      h(2, 'সাধারণ Breakpoint', 'সাধারণ-breakpoint'),
      table(['Breakpoint', 'সাধারণ প্রস্থ', 'সাধারণ device'], [
        ['Mobile', '< 600px', 'ফোন'],
        ['Tablet', '600–1024px', 'Tablet, ছোট laptop'],
        ['Desktop', '1024px+', 'Laptop, desktop monitor'],
      ]),
      h(2, 'কেন নির্দিষ্টভাবে Mobile-First', 'কেন-নির্দিষ্টভাবে-mobile-first'),
      p('<p>সবচেয়ে ছোট screen প্রথমে design করা শুরু থেকেই আসল priority নির্ধারণ করতে বাধ্য করে — "সবকিছু" ফিট করার জায়গা নেই, তাই শুধু যা আসলে গুরুত্বপূর্ণ তাই টিকে থাকে। Desktop-first design করে তারপর mobile-এ গুঁজে দেওয়ার চেষ্টা একটা এলোমেলো, আপোসকৃত mobile অভিজ্ঞতা তৈরি করার ঝোঁক রাখে, কারণ কিছুই কাটা হয়নি, শুধু সংকুচিত।</p>'),
      h(2, 'Breakpoint-এর মধ্যে আসলে কী বদলায়', 'breakpoint-এর-মধ্যে-আসলে-কী-বদলায়'),
      table(['Element', 'সাধারণত কীভাবে খাপ খায়'], [
        ['Navigation', 'Desktop-এ পূর্ণ menu bar প্রায়ই mobile-এ একটা hamburger menu-তে সংকুচিত হয়'],
        ['Grid column', 'একটা 3-4 column desktop layout প্রায়ই mobile-এ একটা একক column হয়ে যায় (আগের grid systems lesson দেখুন)'],
        ['Touch target', 'Touchscreen-এ button আর tap-করা-যায় এমন এলাকা বড় হতে হবে — একটা mouse cursor একটা আঙুলের ডগার চেয়ে অনেক বেশি নিখুঁত'],
        ['Image', 'প্রায়ই প্রতি breakpoint-এ শুধু সমানভাবে scale না, ভিন্নভাবে crop বা resize করা'],
      ]),
      callout('tip', '<p>একটা আসল ফোনে design আর পরীক্ষা করুন, শুধু একটা desktop-এ resize করা browser window না — আসল touch target, আসল বুড়ো আঙুলের নাগাল, আর mobile data-তে আসল load time একটা desktop preview কখনো প্রকাশ করবে না এমন সমস্যা প্রকাশ করে।</p>', 'যখন সম্ভব আসল জিনিসে পরীক্ষা করুন'),
    ],
  },
})

lessons.push({
  slug: 'accessibility-basics', sortOrder: n++,
  en: {
    title: 'Accessibility Basics (WCAG Essentials)',
    metaTitle: 'Accessibility Basics (WCAG Essentials) | Learn Computer Academy',
    metaDescription: 'Practical, beginner-level accessibility rules every designer should know — contrast ratios, not relying on color alone, and designing for keyboard use.',
    blocks: [
      p('<p>Accessible design means a product genuinely works for people with visual, motor, auditory, or cognitive differences — not an edge case, but a real and large share of any product\'s actual users. The <b>WCAG</b> (Web Content Accessibility Guidelines) is the standard reference; this lesson covers the essentials a designer touches daily.</p>'),
      img('docs/img/ui-ux/accessibility', 'An isometric illustration of a few simple human figures interacting with a large accessible screen showing high-contrast interface elements and a large-text icon', 1024, 768, 'Accessible design is good design for everyone — high contrast and clear labeling help every user, not only some.'),
      h(2, 'Color Contrast'),
      p('<p>WCAG defines minimum contrast ratios between text and its background — commonly 4.5:1 for normal text, 3:1 for large text, at the "AA" level most products target. Low-contrast light-grey-on-white text may look modern, but it\'s genuinely unreadable for many users, not a stylistic preference to defend.</p>'),
      h(2, 'Never Rely on Color Alone'),
      p('<p>Roughly 1 in 12 men have some form of color vision deficiency. A form that only marks an error field in red, with no icon or text, is invisible to a meaningful share of users. Always pair color with a second signal — an icon, an underline, explicit text.</p>'),
      h(2, 'Keyboard and Focus'),
      p('<p>Not every user can use a mouse or touchscreen. Every interactive element needs a visible <b>focus state</b> (covered in the earlier feedback/states lesson) so someone navigating by keyboard alone can see exactly where they are — and every action reachable by click needs to be reachable by keyboard too.</p>'),
      h(2, 'Alt Text and Labels'),
      p('<p>Every meaningful image needs alt text describing what it conveys, for screen reader users. Every form field needs a real, programmatically-associated label — not just a visually nearby placeholder that a screen reader can\'t reliably connect to the field.</p>'),
      callout('note', '<p>Accessibility is not a final polish step to add if time allows — retrofitting it after a design is finished is far more expensive than building it in from the start, the same way it\'s far cheaper to fix a structural wireframe problem than a finished visual design.</p>', 'Build it in from the start, not after'),
    ],
  },
  bn: {
    title: 'Accessibility মূল বিষয় (WCAG Essentials)',
    metaTitle: 'Accessibility মূল বিষয় (WCAG Essentials) | Learn Computer Academy',
    metaDescription: 'প্রতিটা designer-এর জানা উচিত এমন বাস্তব, শিক্ষানবিস-স্তরের accessibility নিয়ম — contrast ratio, শুধু রং-এর উপর নির্ভর না করা, আর keyboard ব্যবহারের জন্য design করা।',
    blocks: [
      p('<p>Accessible design মানে একটা product visual, motor, auditory, বা cognitive পার্থক্য সহ মানুষদের জন্য আসলেই কাজ করে — একটা edge case না, বরং যেকোনো product-এর আসল user-দের একটা আসল আর বড় অংশ। <b>WCAG</b> (Web Content Accessibility Guidelines) হলো মানক reference; এই lesson একজন designer প্রতিদিন স্পর্শ করে এমন essentials কভার করে।</p>'),
      img('docs/img/ui-ux/accessibility', 'উচ্চ-contrast interface element আর একটা large-text icon দেখানো একটা বড় accessible screen-এর সাথে interact করা কয়েকটা সরল মানুষ figure-এর একটা isometric illustration', 1024, 768, 'Accessible design সবার জন্য ভালো design — উচ্চ contrast আর স্পষ্ট labeling প্রতিটা user-কে সাহায্য করে, শুধু কিছুকে না।'),
      h(2, 'রং Contrast', 'রং-contrast'),
      p('<p>WCAG টেক্সট আর তার background-এর মধ্যে ন্যূনতম contrast ratio সংজ্ঞায়িত করে — বেশিরভাগ product যে "AA" স্তর লক্ষ্য করে তাতে সাধারণত normal টেক্সটের জন্য 4.5:1, বড় টেক্সটের জন্য 3:1। কম-contrast সাদার-উপর-হালকা-ধূসর টেক্সট আধুনিক দেখাতে পারে, কিন্তু এটা অনেক user-এর জন্য আসলেই পড়া যায় না, রক্ষা করার মতো একটা স্টাইলিস্টিক পছন্দ না।</p>'),
      h(2, 'কখনো শুধু রং-এর উপর নির্ভর করবেন না', 'কখনো-শুধু-রং-এর-উপর-নির্ভর-করবেন-না'),
      p('<p>প্রায় ১২ জন পুরুষের মধ্যে ১ জনের কোনো না কোনো ধরনের color vision deficiency আছে। একটা form যা শুধু লাল রঙে একটা error field চিহ্নিত করে, কোনো icon বা টেক্সট ছাড়া, user-দের একটা অর্থপূর্ণ অংশের কাছে অদৃশ্য। সবসময় রং-কে দ্বিতীয় সংকেতের সাথে জোড়া দিন — একটা icon, একটা underline, স্পষ্ট টেক্সট।</p>'),
      h(2, 'Keyboard আর Focus', 'keyboard-আর-focus'),
      p('<p>প্রতিটা user mouse বা touchscreen ব্যবহার করতে পারে না। প্রতিটা interactive element-এর একটা দৃশ্যমান <b>focus state</b> দরকার (আগের feedback/state lesson-এ কভার করা) যাতে শুধু keyboard দিয়ে navigate করা কেউ ঠিক দেখতে পারে তারা কোথায় — আর click দিয়ে পৌঁছানো যায় এমন প্রতিটা কাজ keyboard দিয়েও পৌঁছানো যেতে হবে।</p>'),
      h(2, 'Alt Text আর Label', 'alt-text-আর-label'),
      p('<p>screen reader user-দের জন্য প্রতিটা অর্থপূর্ণ image-এর alt text দরকার যা এটা কী জানায় তা বর্ণনা করে। প্রতিটা form field-এর একটা আসল, programmatically-সংযুক্ত label দরকার — শুধু একটা visually কাছের placeholder না যা একটা screen reader নির্ভরযোগ্যভাবে field-এর সাথে সংযুক্ত করতে পারে না।</p>'),
      callout('note', '<p>Accessibility সময় থাকলে যোগ করার একটা চূড়ান্ত polish ধাপ না — একটা design শেষ হয়ে যাওয়ার পরে এটা retrofit করা শুরু থেকে এটা বানানোর চেয়ে অনেক বেশি ব্যয়বহুল, ঠিক যেভাবে একটা শেষ হওয়া visual design-এর চেয়ে একটা structural wireframe সমস্যা ঠিক করা অনেক সস্তা।</p>', 'শুরু থেকেই এটা বানান, পরে না'),
    ],
  },
})

lessons.push({
  slug: 'design-systems-and-component-libraries', sortOrder: n++,
  en: {
    title: 'Design Systems & Component Libraries',
    metaTitle: 'Design Systems & Component Libraries | Learn Computer Academy',
    metaDescription: 'What a design system actually is, how it differs from a simple style guide, and why reusable components are what makes consistency actually maintainable.',
    blocks: [
      p('<p>Once a product grows past a handful of screens, redesigning every button and dropdown from scratch each time becomes both slow and a direct threat to the consistency covered earlier in this course. A <b>design system</b> solves this at the root.</p>'),
      img('docs/img/ui-ux/design-system', 'An isometric illustration of organized building blocks representing a design system: button shapes, color swatch tiles, icon tiles, and typography cards arranged on a floating platform', 1024, 768, 'A design system turns every recurring UI decision into a reusable, already-solved piece.'),
      h(2, 'What a Design System Actually Contains'),
      table(['Layer', 'What it includes'], [
        ['Design tokens', 'The smallest values — specific colors, spacing units, font sizes — defined once, referenced everywhere'],
        ['Components', 'Reusable, pre-built pieces — a button, an input field, a card, a modal — each with all its states already designed'],
        ['Patterns', 'Established solutions to common problems — a checkout flow, a settings page layout — built from the components above'],
        ['Guidelines', 'Written rules for when and how to use each piece, so the system stays consistent as new people join a team'],
      ]),
      h(2, 'Design System vs. a Simple Style Guide'),
      p('<p>A style guide is usually just a static document — a page showing the color palette and font choices. A design system is a living, connected library, typically built directly in Figma using components and variants (covered hands-on in this site\'s Figma course), so a single update to the master button component updates every instance of it across every screen automatically.</p>'),
      h(2, 'Why This Matters at Scale'),
      p('<p>Without a system, updating a button style means manually finding and editing it on every screen it appears — slow, and error-prone enough that inconsistencies creep in constantly. With a system, that same update happens once, in one place, and propagates everywhere the component is used.</p>'),
      callout('tip', '<p>Even a solo project benefits from a small, personal component library — save time the first project, and every project after that reuses the same solved pieces instead of rebuilding them.</p>', 'Worth building even for small projects'),
    ],
  },
  bn: {
    title: 'Design System আর Component Library',
    metaTitle: 'Design System আর Component Library | Learn Computer Academy',
    metaDescription: 'একটা design system আসলে কী, এটা একটা সরল style guide থেকে কীভাবে ভিন্ন, আর কেন পুনর্ব্যবহারযোগ্য component consistency-কে আসলে বজায়যোগ্য করে।',
    blocks: [
      p('<p>একবার একটা product একমুঠো screen ছাড়িয়ে বাড়লে, প্রতিবার শুরু থেকে প্রতিটা button আর dropdown redesign করা ধীর আর এই কোর্সে আগে কভার করা consistency-এর জন্য একটা সরাসরি হুমকি দুটোই হয়ে যায়। একটা <b>design system</b> এটা মূলে সমাধান করে।</p>'),
      img('docs/img/ui-ux/design-system', 'একটা design system প্রতিনিধিত্ব করা সংগঠিত building block-এর একটা isometric illustration: button আকৃতি, color swatch tile, icon tile, আর একটা floating platform-এ সাজানো typography card', 1024, 768, 'একটা design system প্রতিটা পুনরাবৃত্ত UI সিদ্ধান্তকে একটা পুনর্ব্যবহারযোগ্য, ইতিমধ্যে-সমাধান-করা অংশে পরিণত করে।'),
      h(2, 'একটা Design System-এ আসলে কী থাকে', 'একটা-design-system-এ-আসলে-কী-থাকে'),
      table(['স্তর', 'এতে কী অন্তর্ভুক্ত'], [
        ['Design token', 'সবচেয়ে ছোট value — নির্দিষ্ট রং, spacing unit, font size — একবার সংজ্ঞায়িত, সর্বত্র reference করা'],
        ['Component', 'পুনর্ব্যবহারযোগ্য, পূর্ব-বানানো অংশ — একটা button, একটা input field, একটা card, একটা modal — প্রতিটার সব state ইতিমধ্যে design করা'],
        ['Pattern', 'সাধারণ সমস্যার প্রতিষ্ঠিত সমাধান — একটা checkout flow, একটা settings page layout — উপরের component থেকে বানানো'],
        ['Guideline', 'কখন আর কীভাবে প্রতিটা অংশ ব্যবহার করতে হবে তার লিখিত নিয়ম, যাতে নতুন মানুষ একটা team-এ যোগ দিলেও system সামঞ্জস্যপূর্ণ থাকে'],
      ]),
      h(2, 'Design System বনাম একটা সরল Style Guide', 'design-system-বনাম-একটা-সরল-style-guide'),
      p('<p>একটা style guide সাধারণত শুধু একটা static document — color palette আর font পছন্দ দেখানো একটা page। একটা design system একটা জীবন্ত, সংযুক্ত library, সাধারণত component আর variant ব্যবহার করে সরাসরি Figma-তে বানানো (এই সাইটের Figma কোর্সে হাতে-কলমে কভার করা), তাই master button component-এর একটা একক update স্বয়ংক্রিয়ভাবে প্রতিটা screen জুড়ে এর প্রতিটা instance update করে।</p>'),
      h(2, 'কেন এটা Scale-এ গুরুত্বপূর্ণ', 'কেন-এটা-scale-এ-গুরুত্বপূর্ণ'),
      p('<p>একটা system ছাড়া, একটা button style update করা মানে এটা যে প্রতিটা screen-এ দেখা যায় সেখানে ম্যানুয়ালি খুঁজে editing করা — ধীর, আর যথেষ্ট ভুল-প্রবণ যে অসামঞ্জস্য ক্রমাগত ঢুকে যায়। একটা system-এর সাথে, একই update একবার, একটা জায়গায় ঘটে, আর component যেখানে ব্যবহৃত হয় সর্বত্র ছড়িয়ে পড়ে।</p>'),
      callout('tip', '<p>এমনকি একটা একক প্রজেক্টও একটা ছোট, ব্যক্তিগত component library থেকে উপকৃত হয় — প্রথম প্রজেক্টে সময় বাঁচান, আর এর পরের প্রতিটা প্রজেক্ট সেগুলো পুনর্নির্মাণের বদলে একই সমাধান-করা অংশ পুনর্ব্যবহার করে।</p>', 'ছোট প্রজেক্টের জন্যও বানানোর যোগ্য'),
    ],
  },
})

lessons.push({
  slug: 'building-a-ux-case-study', sortOrder: n++,
  en: {
    title: 'Building a UX Case Study for Your Portfolio',
    metaTitle: 'Building a UX Case Study for Your Portfolio | Learn Computer Academy',
    metaDescription: 'How to turn a UX project into a case study that actually gets someone hired — the structure, what to show, and the most common mistakes.',
    blocks: [
      p('<p>For UI/UX work specifically, a portfolio of pretty final screens isn\'t enough — a hiring manager wants to see the <i>thinking</i> behind the screens, using every concept covered across this course. A <b>case study</b> is how that thinking gets shown.</p>'),
      h(2, 'The Structure That Works'),
      table(['Section', 'What it covers'], [
        ['The problem', 'What was broken or missing, and for whom — grounds the whole case study in a real need'],
        ['Research', 'Personas, journey maps, or other research done (see the earlier lessons in this phase) — even a small, honest amount is worth showing'],
        ['The process', 'Sketches, low-fi wireframes, and how the idea evolved — not just the final polished screens'],
        ['The solution', 'The final hi-fi screens and prototype, explained in terms of the problem they solve'],
        ['The outcome', 'What changed, ideally with a number — or, for a course/practice project, what was learned'],
      ]),
      h(2, 'Show the Process, Not Just the Polish'),
      p('<p>The single biggest gap between a weak and a strong UX case study is process visibility. A case study that jumps straight from "the problem" to "the beautiful final screen" reads as decoration; one that shows messy sketches, a rejected direction, and the reasoning for the final choice reads as real design thinking — which is specifically what a UX hiring process is trying to evaluate.</p>'),
      h(2, 'Where This Content Comes From'),
      p('<p>Every project completed across this course\'s exercises can become a case study: a persona and journey map from Phase 4, a wireframe and prototype from those same lessons, an accessibility pass and a small component set from this final phase. None of it needs a real client — a well-documented practice project, clearly labeled as such, is a completely legitimate case study.</p>'),
      callout('tip', '<p>3-4 strong, well-documented case studies consistently beat 10 thin ones — the same "quality over quantity" principle covered in this site\'s Freelancing course\'s portfolio lesson applies here too.</p>', 'Fewer, deeper case studies win'),
    ],
  },
  bn: {
    title: 'আপনার Portfolio-এর জন্য একটা UX Case Study বানানো',
    metaTitle: 'আপনার Portfolio-এর জন্য একটা UX Case Study বানানো | Learn Computer Academy',
    metaDescription: 'কীভাবে একটা UX প্রজেক্টকে একটা case study-তে পরিণত করবেন যা আসলে কাউকে চাকরি পাইয়ে দেয় — গঠন, কী দেখাবেন, আর সবচেয়ে সাধারণ ভুল।',
    blocks: [
      p('<p>বিশেষভাবে UI/UX কাজের জন্য, সুন্দর চূড়ান্ত screen-এর একটা portfolio যথেষ্ট না — একজন hiring manager screen-এর পিছনের <i>চিন্তাভাবনা</i> দেখতে চায়, এই কোর্স জুড়ে কভার করা প্রতিটা concept ব্যবহার করে। একটা <b>case study</b> হলো সেই চিন্তাভাবনা কীভাবে দেখানো হয়।</p>'),
      h(2, 'যে গঠন কাজ করে', 'যে-গঠন-কাজ-করে'),
      table(['অংশ', 'এটা কী কভার করে'], [
        ['সমস্যা', 'কী ভাঙা বা অনুপস্থিত ছিল, আর কার জন্য — পুরো case study-কে একটা আসল প্রয়োজনে ভিত্তি করে'],
        ['গবেষণা', 'Persona, journey map, বা করা অন্য গবেষণা (এই phase-এর আগের lesson দেখুন) — এমনকি একটা ছোট, সৎ পরিমাণও দেখানোর যোগ্য'],
        ['Process', 'Sketch, low-fi wireframe, আর ধারণাটা কীভাবে বিকশিত হয়েছে — শুধু চূড়ান্ত পালিশ করা screen না'],
        ['সমাধান', 'চূড়ান্ত hi-fi screen আর prototype, যে সমস্যা এগুলো সমাধান করে তার পরিপ্রেক্ষিতে ব্যাখ্যা করা'],
        ['ফলাফল', 'কী বদলেছে, আদর্শভাবে একটা সংখ্যা সহ — বা, একটা course/practice প্রজেক্টের জন্য, কী শেখা হয়েছে'],
      ]),
      h(2, 'শুধু Polish না, Process দেখান', 'শুধু-polish-না-process-দেখান'),
      p('<p>একটা দুর্বল আর শক্তিশালী UX case study-এর মধ্যে একক সবচেয়ে বড় ফাঁক হলো process visibility। একটা case study যা সরাসরি "সমস্যা" থেকে "সুন্দর চূড়ান্ত screen"-এ লাফ দেয় তা সাজসজ্জা হিসেবে পড়ে; যেটা এলোমেলো sketch, একটা প্রত্যাখ্যাত দিক, আর চূড়ান্ত পছন্দের যুক্তি দেখায় তা আসল design চিন্তাভাবনা হিসেবে পড়ে — যা বিশেষভাবে একটা UX hiring process মূল্যায়ন করার চেষ্টা করছে।</p>'),
      h(2, 'এই content কোথা থেকে আসে', 'এই-content-কোথা-থেকে-আসে'),
      p('<p>এই কোর্সের exercise জুড়ে সম্পন্ন করা প্রতিটা প্রজেক্ট একটা case study হয়ে উঠতে পারে: Phase 4 থেকে একটা persona আর journey map, সেই একই lesson থেকে একটা wireframe আর prototype, এই শেষ phase থেকে একটা accessibility pass আর একটা ছোট component set। এর কোনোটারই একজন আসল client দরকার নেই — একটা ভালোভাবে-নথিভুক্ত practice প্রজেক্ট, স্পষ্টভাবে তেমন label করা, একটা সম্পূর্ণ বৈধ case study।</p>'),
      callout('tip', '<p>৩-৪টা শক্তিশালী, ভালোভাবে-নথিভুক্ত case study ধারাবাহিকভাবে ১০টা পাতলার চেয়ে ভালো — এই সাইটের Freelancing কোর্সের portfolio lesson-এ কভার করা একই "পরিমাণের চেয়ে মান" principle এখানেও প্রযোজ্য।</p>', 'কম, গভীর case study জেতে'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'ui-ux').single()
  if (catErr || !category) {
    console.error('Category "ui-ux" not found — run scripts/create-ui-ux-category.mjs first.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] ui-ux/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] ui-ux/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `ui-ux/${lesson.slug}`
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

  console.log(`\n✅ Done. ${lessons.length} lessons written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
