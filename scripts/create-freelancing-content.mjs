#!/usr/bin/env node
// New "Freelancing & Client Work" category (created by
// scripts/create-freelancing-category.mjs) — 29 lessons across 7 phases:
// Foundations, Getting Set Up, Landing & Scoping Work, Contracts & Getting
// Paid, Running the Work, Growing, and Mindset. Discussed and scoped with the
// site owner before writing (2026-08-17):
//   - Weighted toward the major platforms (Fiverr, Upwork, Freelancer.com)
//     since those are what's actually easy for a new student to get into.
//   - Audience is India-based (not Bangladesh) — payments content covers
//     PayPal (works from India, unlike Bangladesh, with its own real
//     restrictions), Payoneer, Wise, and a light GST/income-tax mention for
//     exported services, without leaning into any one country too hard.
//   - Images: isometric concept illustrations (same style as every other
//     category) PLUS realistic marketplace/dashboard UI mockups. The owner
//     has no post-login access to real Fiverr/Upwork dashboards to
//     screenshot, so these are deliberately GENERIC, fictional-branded
//     mockups ("Freelance Marketplace", "Payments Dashboard") — same
//     trade-dress-avoidance approach as the Office Skills category's
//     software mockups, not real platform screenshots or logos.
//
// Shipped across two sessions (2026-08-17 discussed with the owner): Phase
// 1-4 (17 lessons) written and run first; Phase 5-7 (12 lessons, Running the
// Work / Growing / Mindset) appended and run 2026-08-18. All 29 lessons now
// in this file. Re-running this script is safe — same select-then-
// insert/update pattern every content script in this repo uses.
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-freelancing-content.mjs [--dry-run]

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
  slug: 'what-freelancing-actually-is', sortOrder: n++,
  en: {
    title: 'What Freelancing Actually Is',
    metaTitle: 'What Freelancing Actually Is | Learn Computer Academy',
    metaDescription: 'What freelancing really means, the honest pros and cons, and how to tell if it fits how you want to work before you start.',
    blocks: [
      p('<p><b>Freelancing</b> means selling your skills directly to clients as an independent contractor, project by project, instead of drawing a fixed salary from one employer. A web developer freelancing might build one client\'s website this month and another client\'s app the next — same skill, different employers, no long-term commitment on either side.</p>'),
      img('docs/img/freelancing/freelancing-hero', 'An isometric illustration of a freelancer working at a laptop on a desk', 1024, 768, 'Freelancing — the same skills, sold directly to clients instead of through one employer.'),
      h(2, 'The Real Upsides'),
      table(['Upside', 'Why it\'s real'], [
        ['Choose your clients', 'A bad-fit project can simply be turned down — no manager assigns it to you'],
        ['Set your own hours', 'Work is judged by output delivered, not hours logged at a desk'],
        ['No income ceiling from one employer', 'Rates and client count both scale with skill and reputation, not a fixed salary band'],
        ['Work from anywhere', 'A laptop and internet connection are the only real requirements for most digital skills'],
      ]),
      h(2, 'The Real Downsides — Said Plainly'),
      table(['Downside', 'Why it\'s real'], [
        ['Income is irregular', 'No work this week can genuinely mean no income this week'],
        ['No paid leave or benefits', 'Sick days, holidays, and insurance are self-funded, not provided'],
        ['You are also the business', 'Finding clients, invoicing, and handling disputes are now part of the job, not someone else\'s department'],
        ['Isolation is real', 'No coworkers, no office — freelancing can be genuinely lonely for some people'],
      ]),
      h(2, 'Who Freelancing Actually Suits'),
      p('<p>It suits someone with a real, sellable skill (this course assumes you already have one — coding, design, writing, or similar), who can handle a few months of inconsistent income while building a client base, and who doesn\'t mind wearing every hat in a small business. It does <i>not</i> require quitting a job on day one — most successful freelancers start part-time, alongside study or a job, and only go full-time once client work reliably covers their needs.</p>'),
      callout('note', '<p>This course does not teach a skill to sell — it assumes one (from the rest of this site\'s courses, or elsewhere) and teaches everything around turning that skill into paid client work.</p>', 'What this course covers'),
    ],
  },
  bn: {
    title: 'Freelancing আসলে কী',
    metaTitle: 'Freelancing আসলে কী | Learn Computer Academy',
    metaDescription: 'Freelancing আসলে কী বোঝায়, সৎ pros আর cons, আর শুরু করার আগে কীভাবে বুঝবেন এটা আপনার কাজের ধরনের সাথে মানানসই কিনা।',
    blocks: [
      p('<p><b>Freelancing</b> মানে আপনার দক্ষতা সরাসরি client-দের কাছে independent contractor হিসেবে বিক্রি করা, প্রজেক্ট ধরে ধরে, একটা employer থেকে fixed salary নেওয়ার বদলে। একজন freelancing করা web developer এই মাসে একটা client-এর website বানাতে পারে আর পরের মাসে অন্য client-এর app — একই দক্ষতা, ভিন্ন employer, কোনো পক্ষেরই দীর্ঘমেয়াদী প্রতিশ্রুতি নেই।</p>'),
      img('docs/img/freelancing/freelancing-hero', 'একটা ডেস্কে ল্যাপটপে কাজ করা একজন freelancer-এর isometric illustration', 1024, 768, 'Freelancing — একই দক্ষতা, একটা employer-এর মাধ্যমে না গিয়ে সরাসরি client-দের কাছে বিক্রি করা।'),
      h(2, 'আসল সুবিধাগুলো', 'আসল-সুবিধাগুলো'),
      table(['সুবিধা', 'কেন এটা আসল'], [
        ['আপনার client বেছে নেওয়া', 'একটা বেমানান প্রজেক্ট সহজেই ফিরিয়ে দেওয়া যায় — কোনো manager এটা আপনাকে assign করে না'],
        ['নিজের সময় ঠিক করা', 'কাজ ডেস্কে কত ঘণ্টা কাটানো হলো তার বদলে কতটা delivered হলো তা দিয়ে বিচার হয়'],
        ['একটা employer থেকে income ceiling নেই', 'rate আর client সংখ্যা দুটোই একটা fixed salary band না, দক্ষতা আর সুনাম অনুযায়ী বাড়ে'],
        ['যেকোনো জায়গা থেকে কাজ', 'বেশিরভাগ digital দক্ষতার জন্য একটা laptop আর internet connection-ই আসল দরকার'],
      ]),
      h(2, 'আসল অসুবিধাগুলো — সরাসরি বলা', 'আসল-অসুবিধাগুলো-সরাসরি-বলা'),
      table(['অসুবিধা', 'কেন এটা আসল'], [
        ['Income অনিয়মিত', 'এই সপ্তাহে কোনো কাজ না থাকা মানে সত্যিকারেই এই সপ্তাহে কোনো income না থাকা'],
        ['কোনো paid leave বা benefit নেই', 'অসুস্থতার ছুটি, ছুটির দিন, আর বীমা নিজেকেই যোগাড় করতে হয়, কেউ দেয় না'],
        ['আপনিই ব্যবসাটাও', 'client খুঁজে বের করা, invoice করা, আর dispute সামলানো এখন কাজের অংশ, অন্য কারো department না'],
        ['একাকীত্ব আসল', 'কোনো সহকর্মী নেই, কোনো office নেই — কিছু মানুষের জন্য freelancing সত্যিকারেই একাকী হতে পারে'],
      ]),
      h(2, 'Freelancing আসলে কার জন্য মানানসই', 'freelancing-আসলে-কার-জন্য-মানানসই'),
      p('<p>এটা এমন কারো জন্য মানানসই যার একটা আসল, বিক্রয়যোগ্য দক্ষতা আছে (এই কোর্স ধরে নেয় আপনার ইতিমধ্যেই একটা আছে — coding, design, writing, বা অনুরূপ), যে একটা client base বানানোর সময় কয়েক মাস অনিয়মিত income সামলাতে পারে, আর যে একটা ছোট ব্যবসার প্রতিটা কাজ করতে আপত্তি করে না। এর জন্য প্রথম দিনেই চাকরি ছাড়তে হয় না — বেশিরভাগ সফল freelancer part-time শুরু করে, পড়াশোনা বা চাকরির পাশাপাশি, আর client কাজ নির্ভরযোগ্যভাবে তাদের প্রয়োজন মেটালেই শুধু full-time হয়।</p>'),
      callout('note', '<p>এই কোর্স বিক্রি করার মতো কোনো দক্ষতা শেখায় না — এটা একটা ধরে নেয় (এই সাইটের বাকি কোর্স থেকে, বা অন্য কোথাও থেকে) আর সেই দক্ষতাকে টাকা-দেওয়া client কাজে পরিণত করার চারপাশের সবকিছু শেখায়।</p>', 'এই কোর্স যা কভার করে'),
    ],
  },
})

lessons.push({
  slug: 'picking-your-freelance-niche', sortOrder: n++,
  en: {
    title: 'Picking Your Freelance Niche',
    metaTitle: 'Picking Your Freelance Niche | Learn Computer Academy',
    metaDescription: 'How narrow to go when deciding what to sell as a freelancer, and why "I do everything" is usually the harder sell, not the easier one.',
    blocks: [
      p('<p>A <b>niche</b> is the specific slice of your skill that you\'re known for — not "I do web development" but "I build WordPress websites for local restaurants and clinics." Counterintuitively, narrower usually gets hired faster than broader.</p>'),
      h(2, 'Why Narrow Beats Broad, Starting Out'),
      p('<p>A client searching for help rarely wants a generalist — they want someone who has clearly solved their exact problem before. "Full-stack developer" competes with thousands of identical profiles; "React dashboards for logistics companies" competes with almost no one, and reads as expertise rather than a guess.</p>'),
      h(2, 'Two Ways to Define a Niche'),
      table(['Approach', 'Example'], [
        ['By skill + deliverable', '"Responsive landing pages in HTML/CSS," "Excel dashboards for small business owners"'],
        ['By skill + industry', '"WordPress sites for medical clinics," "Social media graphics for restaurants"'],
      ]),
      h(2, 'Starting Broad Is Fine — Staying Broad Isn\'t'),
      p('<p>Nobody picks the perfect niche on day one. Taking varied early jobs to learn what\'s actually enjoyable and in demand is normal and useful. The mistake is staying general a year in, once there\'s enough completed work to see a real pattern in what clients keep hiring for and what actually pays well.</p>'),
      h(2, 'A Practical Starting Exercise'),
      p('<p>List every piece of work completed so far (course projects count) and mark which ones felt easiest and which paid or would\'ve paid best. The overlap between "easiest for me" and "clients pay well for this" is usually the honest starting niche — not the most interesting-sounding one, the one at that actual intersection.</p>'),
      callout('tip', '<p>A niche isn\'t permanent. It\'s fine to narrow, widen, or pivot entirely as real client work reveals what the market actually wants from you.</p>', 'It can change'),
    ],
  },
  bn: {
    title: 'আপনার Freelance Niche বেছে নেওয়া',
    metaTitle: 'আপনার Freelance Niche বেছে নেওয়া | Learn Computer Academy',
    metaDescription: 'একজন freelancer হিসেবে কী বিক্রি করবেন তা ঠিক করতে কতটা সরু হতে হবে, আর কেন "আমি সবকিছু করি" সাধারণত সহজ বিক্রয় না, কঠিনটাই।',
    blocks: [
      p('<p>একটা <b>niche</b> হলো আপনার দক্ষতার নির্দিষ্ট একটা অংশ যার জন্য আপনি পরিচিত — "আমি web development করি" না, বরং "আমি স্থানীয় restaurant আর clinic-এর জন্য WordPress website বানাই।" বিপরীতভাবে, শুরুতে সরু সাধারণত বিস্তৃতের চেয়ে দ্রুত কাজ পায়।</p>'),
      h(2, 'কেন সরু বিস্তৃতকে হারায়, শুরুতে', 'কেন-সরু-বিস্তৃতকে-হারায়-শুরুতে'),
      p('<p>সাহায্য খুঁজতে থাকা একজন client কদাচিৎ একজন generalist চায় — তারা এমন কাউকে চায় যে স্পষ্টভাবে আগে তাদের ঠিক এই সমস্যাটাই সমাধান করেছে। "Full-stack developer" হাজার হাজার একই রকম প্রোফাইলের সাথে প্রতিযোগিতা করে; "logistics কোম্পানির জন্য React dashboard" প্রায় কারো সাথেই প্রতিযোগিতা করে না, আর একটা অনুমানের বদলে দক্ষতা হিসেবে পড়ে।</p>'),
      h(2, 'একটা Niche সংজ্ঞায়িত করার দুই উপায়', 'একটা-niche-সংজ্ঞায়িত-করার-দুই-উপায়'),
      table(['পদ্ধতি', 'উদাহরণ'], [
        ['দক্ষতা + deliverable দিয়ে', '"HTML/CSS-এ responsive landing page," "ছোট ব্যবসার মালিকদের জন্য Excel dashboard"'],
        ['দক্ষতা + industry দিয়ে', '"medical clinic-এর জন্য WordPress site," "restaurant-এর জন্য social media graphic"'],
      ]),
      h(2, 'বিস্তৃতভাবে শুরু করা ঠিক আছে — বিস্তৃত থেকে যাওয়া না', 'বিস্তৃতভাবে-শুরু-করা-ঠিক-আছে-বিস্তৃত-থেকে-যাওয়া-না'),
      p('<p>প্রথম দিনেই কেউ নিখুঁত niche বেছে নেয় না। আসলে কী উপভোগ্য আর চাহিদা আছে তা শিখতে শুরুতে বিভিন্ন কাজ নেওয়া স্বাভাবিক আর useful। ভুলটা হলো এক বছর পরেও general থেকে যাওয়া, যখন client-রা কী নিয়োগ করতে থাকে আর আসলে কী ভালো টাকা দেয় তার একটা আসল প্যাটার্ন দেখার মতো যথেষ্ট কাজ শেষ হয়ে গেছে।</p>'),
      h(2, 'একটা বাস্তব শুরুর ব্যায়াম', 'একটা-বাস্তব-শুরুর-ব্যায়াম'),
      p('<p>এখন পর্যন্ত শেষ করা প্রতিটা কাজের তালিকা করুন (কোর্স প্রজেক্টও গোনে) আর চিহ্নিত করুন কোনগুলো সবচেয়ে সহজ মনে হয়েছিল আর কোনগুলো সবচেয়ে ভালো টাকা দিয়েছে বা দিতে পারতো। "আমার জন্য সবচেয়ে সহজ" আর "client-রা এর জন্য ভালো টাকা দেয়" এর মধ্যে যে overlap, সেটাই সাধারণত সৎ শুরুর niche — সবচেয়ে আকর্ষণীয় শোনাচ্ছে এমনটা না, ঠিক সেই ছেদবিন্দুতে থাকা টা।</p>'),
      callout('tip', '<p>একটা niche স্থায়ী না। আসল client কাজ বাজার আসলে আপনার কাছে কী চায় তা প্রকাশ করার সাথে সাথে সরু করা, চওড়া করা, বা পুরোপুরি pivot করা ঠিক আছে।</p>', 'এটা বদলাতে পারে'),
    ],
  },
})

lessons.push({
  slug: 'freelance-platforms-overview', sortOrder: n++,
  en: {
    title: 'Freelance Platforms Overview',
    metaTitle: 'Freelance Platforms Overview | Learn Computer Academy',
    metaDescription: 'A comparison of the major freelance platforms — Fiverr, Upwork, and Freelancer.com — and where direct clients fit in once you have a track record.',
    blocks: [
      p('<p>For someone starting out with no client history, a freelance marketplace is almost always the easiest entry point — the platform brings the buyers, handles payment, and gives new freelancers a way to be found without an existing network. This lesson compares the major ones.</p>'),
      img('docs/img/freelancing/marketplace-profile-mockup', 'A realistic mockup of a generic freelance marketplace profile page in a browser, showing a profile photo, star rating, hourly rate, portfolio thumbnails, and a Contact Me button', 1024, 768, 'A typical freelance-marketplace profile page — rating, rate, and portfolio all visible before a client even messages.'),
      h(2, 'The Two Buying Models'),
      table(['Model', 'How it works', 'Platforms that use it'], [
        ['Gig-based (you list, they buy)', 'The freelancer creates fixed-price "packages" (a Logo Design gig at 3 price tiers); clients browse and purchase directly', 'Fiverr'],
        ['Job-based (they post, you apply)', 'The client posts a job with a budget; freelancers submit proposals and get chosen', 'Upwork, Freelancer.com'],
      ]),
      h(2, 'Fiverr'),
      p('<p>Best fit for clearly packageable services (logo design, a landing page, a short explainer video) where a client can compare fixed price tiers at a glance. New sellers are discoverable through search and category browsing without needing to actively apply to anything — the tradeoff is less control over scope, since a client buys a pre-defined package.</p>'),
      h(2, 'Upwork'),
      p('<p>Best fit for more custom, ongoing, or higher-budget work — clients post detailed briefs, freelancers submit tailored proposals. Generally considered to have a higher average project value than Fiverr, but new accounts start with limited monthly "Connects" (proposal credits), making each application worth more thought.</p>'),
      h(2, 'Freelancer.com'),
      p('<p>Similar job-posting model to Upwork, often with lower competition for the same job post simply because it has a smaller active user base — sometimes an easier place to land a first few projects while a portfolio and reviews are still thin.</p>'),
      h(2, 'Other Platforms Worth Knowing'),
      table(['Platform', 'What it\'s known for'], [
        ['Toptal', 'Highly selective (rigorous vetting), higher rates, not realistic for a first freelance job'],
        ['PeoplePerHour', 'UK-leaning client base, similar job-posting model to Upwork'],
        ['LinkedIn (direct outreach)', 'Not a marketplace, but where many experienced freelancers eventually find repeat, higher-trust clients'],
      ]),
      h(2, 'Where Direct Clients Fit In'),
      p('<p>Marketplaces are the realistic starting point — they solve the "nobody knows me yet" problem. Once there\'s a portfolio and a few reviews, direct outreach and referrals typically become more profitable, since no platform commission is taken and rates can be negotiated freely. Most experienced freelancers eventually run a mix of both.</p>'),
    ],
  },
  bn: {
    title: 'Freelance Platform-এর সারসংক্ষেপ',
    metaTitle: 'Freelance Platform-এর সারসংক্ষেপ | Learn Computer Academy',
    metaDescription: 'প্রধান freelance platform-গুলোর একটা তুলনা — Fiverr, Upwork, আর Freelancer.com — আর একটা track record হয়ে গেলে direct client কোথায় খাপ খায়।',
    blocks: [
      p('<p>কোনো client history ছাড়া শুরু করা কারো জন্য, একটা freelance marketplace প্রায় সবসময় সবচেয়ে সহজ প্রবেশপথ — platform buyer আনে, payment সামলায়, আর নতুন freelancer-কে বিদ্যমান কোনো network ছাড়াই খুঁজে পাওয়ার একটা উপায় দেয়। এই lesson প্রধানগুলো তুলনা করে।</p>'),
      img('docs/img/freelancing/marketplace-profile-mockup', 'একটা browser-এ একটা সাধারণ freelance marketplace profile page-এর একটা বাস্তব mockup, একটা profile photo, star rating, hourly rate, portfolio thumbnail, আর একটা Contact Me button দেখাচ্ছে', 1024, 768, 'একটা সাধারণ freelance-marketplace profile page — client message করার আগেই rating, rate, আর portfolio সবই দৃশ্যমান।'),
      h(2, 'দুই ধরনের কেনার মডেল', 'দুই-ধরনের-কেনার-মডেল'),
      table(['মডেল', 'কীভাবে কাজ করে', 'যে platform ব্যবহার করে'], [
        ['Gig-based (আপনি লিস্ট করেন, তারা কেনে)', 'freelancer fixed-price "package" তৈরি করে (৩টা price tier-এ একটা Logo Design gig); client browse করে সরাসরি কেনে', 'Fiverr'],
        ['Job-based (তারা post করে, আপনি apply করেন)', 'client একটা budget সহ একটা কাজ post করে; freelancer proposal জমা দেয় আর বেছে নেওয়া হয়', 'Upwork, Freelancer.com'],
      ]),
      h(2, 'Fiverr', 'fiverr'),
      p('<p>স্পষ্টভাবে package-করা যায় এমন service-এর জন্য সবচেয়ে ভালো মানানসই (logo design, একটা landing page, একটা ছোট explainer video) যেখানে একজন client এক নজরে fixed price tier তুলনা করতে পারে। নতুন seller-রা কোনো কিছুতে সক্রিয়ভাবে apply না করেই search আর category browsing-এর মাধ্যমে discoverable — trade-off হলো scope-এর উপর কম নিয়ন্ত্রণ, কারণ client একটা পূর্ব-সংজ্ঞায়িত package কেনে।</p>'),
      h(2, 'Upwork', 'upwork'),
      p('<p>আরো custom, চলমান, বা বেশি-budget-এর কাজের জন্য সবচেয়ে ভালো মানানসই — client বিস্তারিত brief post করে, freelancer উপযুক্ত proposal জমা দেয়। সাধারণত Fiverr-এর চেয়ে বেশি গড় প্রজেক্ট মূল্যের বলে মনে করা হয়, কিন্তু নতুন account সীমিত মাসিক "Connects" (proposal credit) দিয়ে শুরু করে, প্রতিটা application-কে বেশি চিন্তা-করা যোগ্য করে তোলে।</p>'),
      h(2, 'Freelancer.com', 'freelancercom'),
      p('<p>Upwork-এর মতোই job-posting মডেল, প্রায়ই একই job post-এর জন্য কম প্রতিযোগিতা, শুধু ছোট active user base থাকার কারণে — কখনো কখনো প্রথম কয়েকটা প্রজেক্ট পাওয়ার জন্য সহজ জায়গা, portfolio আর review এখনো পাতলা থাকা অবস্থায়।</p>'),
      h(2, 'জানার মতো অন্য Platform', 'জানার-মতো-অন্য-platform'),
      table(['Platform', 'যা এর জন্য পরিচিত'], [
        ['Toptal', 'অত্যন্ত নির্বাচনী (কঠোর vetting), বেশি rate, প্রথম freelance কাজের জন্য বাস্তবসম্মত না'],
        ['PeoplePerHour', 'UK-ঘেঁষা client base, Upwork-এর মতোই job-posting মডেল'],
        ['LinkedIn (সরাসরি outreach)', 'কোনো marketplace না, কিন্তু যেখানে অনেক অভিজ্ঞ freelancer শেষ পর্যন্ত পুনরাবৃত্ত, বেশি-বিশ্বাসের client খুঁজে পায়'],
      ]),
      h(2, 'Direct Client কোথায় খাপ খায়', 'direct-client-কোথায়-খাপ-খায়'),
      p('<p>Marketplace বাস্তবসম্মত শুরুর বিন্দু — এরা "এখনো কেউ আমাকে চেনে না" সমস্যার সমাধান করে। একবার একটা portfolio আর কয়েকটা review হয়ে গেলে, সরাসরি outreach আর referral সাধারণত বেশি লাভজনক হয়ে ওঠে, কারণ কোনো platform commission নেওয়া হয় না আর rate অবাধে negotiate করা যায়। বেশিরভাগ অভিজ্ঞ freelancer শেষ পর্যন্ত দুটোর একটা মিশ্রণ চালায়।</p>'),
    ],
  },
})

// ═══ PHASE 2 — GETTING SET UP ═══════════════════════════════════════════

lessons.push({
  slug: 'building-a-portfolio-with-zero-experience', sortOrder: n++,
  en: {
    title: 'Building a Portfolio With Zero Experience',
    metaTitle: 'Building a Portfolio With Zero Experience | Learn Computer Academy',
    metaDescription: 'How to build a real, credible freelance portfolio before any paid client work exists, using spec work, personal projects, and free pro-bono jobs.',
    blocks: [
      p('<p>Every client wants proof before hiring, and "no experience yet" is the single biggest thing standing between a new freelancer and their first job. A portfolio solves it without needing a single paid client first.</p>'),
      h(2, 'Three Legitimate Ways to Fill a Portfolio'),
      table(['Source', 'What it looks like'], [
        ['Course/practice projects', 'Real work built while learning — a functioning website, a designed app screen, a working script — presented as a finished piece, not labeled "homework"'],
        ['Spec work', 'A self-initiated redesign of a real, existing brand — "Redesigned XYZ Restaurant\'s website" — clearly labeled as unsolicited concept work, never implying the client hired you'],
        ['Pro-bono / discounted first projects', 'One or two real projects done for a friend, a local business, or a nonprofit at low or no cost, explicitly to get a genuine case study and testimonial'],
      ]),
      h(2, 'What Actually Belongs in a Portfolio'),
      p('<p>Quality over quantity — 4-6 strong pieces beat 15 mediocre ones, since a client judges the weakest piece shown, not the average. Each piece should show the <i>problem</i> being solved, not just the final image: what the client (real or spec) needed, and how the work addressed it.</p>'),
      h(2, 'Where to Host It'),
      p('<p>A simple personal website is ideal long-term (full control, professional), but isn\'t required to start — a well-organized Behance, Dribbble, or GitHub profile (depending on the skill) works immediately and is often where clients already look first anyway.</p>'),
      callout('tip', '<p>Never present spec or practice work as if a real client paid for and shipped it — being upfront about "self-initiated project" or "practice piece" builds more trust than a small lie a client can easily catch.</p>', 'Honesty matters here'),
    ],
  },
  bn: {
    title: 'শূন্য অভিজ্ঞতা নিয়ে একটা Portfolio বানানো',
    metaTitle: 'শূন্য অভিজ্ঞতা নিয়ে একটা Portfolio বানানো | Learn Computer Academy',
    metaDescription: 'কোনো paid client কাজ থাকার আগেই কীভাবে একটা আসল, বিশ্বাসযোগ্য freelance portfolio বানাবেন, spec work, নিজস্ব প্রজেক্ট, আর বিনামূল্যে pro-bono কাজ ব্যবহার করে।',
    blocks: [
      p('<p>প্রতিটা client নিয়োগ দেওয়ার আগে প্রমাণ চায়, আর "এখনো কোনো অভিজ্ঞতা নেই" হলো একজন নতুন freelancer আর তাদের প্রথম কাজের মধ্যে সবচেয়ে বড় বাধা। একটা portfolio প্রথমে একটাও paid client ছাড়াই এটা সমাধান করে।</p>'),
      h(2, 'একটা Portfolio ভরার তিনটা বৈধ উপায়', 'একটা-portfolio-ভরার-তিনটা-বৈধ-উপায়'),
      table(['উৎস', 'দেখতে কেমন'], [
        ['কোর্স/অনুশীলন প্রজেক্ট', 'শেখার সময় বানানো আসল কাজ — একটা কার্যকরী website, একটা design করা app screen, একটা কাজ-করা script — "homework" লেবেল না করে একটা শেষ করা কাজ হিসেবে উপস্থাপন করা'],
        ['Spec work', 'একটা আসল, বিদ্যমান brand-এর নিজস্ব-উদ্যোগে redesign — "XYZ Restaurant-এর website redesign করেছি" — স্পষ্টভাবে অনাহুত concept কাজ হিসেবে লেবেল করা, client আপনাকে নিয়োগ দিয়েছে এমন কখনো ইঙ্গিত না দিয়ে'],
        ['Pro-bono / discounted প্রথম প্রজেক্ট', 'একজন বন্ধু, একটা স্থানীয় ব্যবসা, বা একটা nonprofit-এর জন্য কম বা বিনামূল্যে করা এক বা দুটো আসল প্রজেক্ট, স্পষ্টভাবে একটা আসল case study আর testimonial পাওয়ার জন্য'],
      ]),
      h(2, 'একটা Portfolio-তে আসলে কী থাকা উচিত', 'একটা-portfolio-তে-আসলে-কী-থাকা-উচিত'),
      p('<p>পরিমাণের চেয়ে মান — ৪-৬টা শক্তিশালী কাজ ১৫টা মাঝারি কাজের চেয়ে ভালো, কারণ একজন client দেখানো সবচেয়ে দুর্বল কাজটা দিয়ে বিচার করে, গড়টা দিয়ে না। প্রতিটা কাজ শুধু শেষ image না, <i>সমস্যাটা</i> সমাধান হচ্ছে তা দেখানো উচিত: client-এর (আসল বা spec) কী দরকার ছিল, আর কাজটা কীভাবে সেটার সমাধান করেছে।</p>'),
      h(2, 'কোথায় Host করবেন', 'কোথায়-host-করবেন'),
      p('<p>দীর্ঘমেয়াদে একটা সাধারণ personal website আদর্শ (পূর্ণ নিয়ন্ত্রণ, professional), কিন্তু শুরু করতে দরকার নেই — একটা ভালোভাবে সাজানো Behance, Dribbble, বা GitHub profile (দক্ষতা অনুযায়ী) সাথে সাথে কাজ করে আর প্রায়ই সেখানেই client-রা আগে থেকেই প্রথমে দেখে।</p>'),
      callout('tip', '<p>Spec বা practice কাজ কখনো এমনভাবে উপস্থাপন করবেন না যেন একজন আসল client এর জন্য টাকা দিয়ে এটা ship করেছে — "নিজস্ব-উদ্যোগে প্রজেক্ট" বা "practice piece" সম্পর্কে খোলাখুলি থাকা একটা ছোট মিথ্যার চেয়ে বেশি বিশ্বাস তৈরি করে, যা একজন client সহজেই ধরতে পারে।</p>', 'সততা এখানে গুরুত্বপূর্ণ'),
    ],
  },
})

lessons.push({
  slug: 'writing-a-profile-that-gets-hired', sortOrder: n++,
  en: {
    title: 'Writing a Profile That Gets Hired',
    metaTitle: 'Writing a Profile That Gets Hired | Learn Computer Academy',
    metaDescription: 'How to write a freelance platform profile and bio that a client actually reads to the end, and the details that build trust before the first message.',
    blocks: [
      p('<p>A profile is read for seconds before a client decides whether to click into the portfolio or scroll past — every part of it is a small trust signal, not just decoration.</p>'),
      h(2, 'The Photo'),
      p('<p>A real, clear, friendly headshot — not a logo, not a cartoon avatar, not a group photo. Profiles with a real human face consistently perform better across every major platform; it\'s one of the fastest trust signals a client reads before anything else.</p>'),
      h(2, 'The Headline'),
      p('<p>The one line under the name is prime real estate — "Web Developer" wastes it. "React Developer Building Fast, Responsive Business Websites" tells a client in one glance exactly what they\'re getting, using the niche language from the earlier lesson.</p>'),
      h(2, 'The Bio — Lead With the Client, Not Yourself'),
      p('<p>A weak bio opens with "I am a passionate developer with 3 years of experience." A strong one opens with the client\'s problem: "Struggling with a slow, outdated website that\'s losing customers? I build fast, modern sites that convert visitors into buyers." Credentials still belong in the bio — just after the hook, not instead of it.</p>'),
      table(['Weak opening', 'Strong opening'], [
        ['"I am a hardworking freelancer who..."', '"Your landing page should be making sales, not losing them."'],
        ['"I have been doing graphic design for 2 years."', '"Struggling to make your brand look as good on screen as it does in person?"'],
      ]),
      h(2, 'Skills and Certifications'),
      p('<p>List only skills that show up in the actual portfolio — an unbacked skill tag reads as padding, not proof. Any real, relevant certification (including from this site\'s own courses, once completed) is worth adding; it costs nothing and adds one more concrete trust signal.</p>'),
      callout('tip', '<p>Write the profile, then read it as if you were the client with the exact problem it\'s meant to solve — if it doesn\'t immediately sound like the answer, it needs another pass.</p>', 'A quick test'),
    ],
  },
  bn: {
    title: 'নিয়োগ পাওয়ার মতো একটা Profile লেখা',
    metaTitle: 'নিয়োগ পাওয়ার মতো একটা Profile লেখা | Learn Computer Academy',
    metaDescription: 'কীভাবে একটা freelance platform profile আর bio লিখবেন যা একজন client আসলে শেষ পর্যন্ত পড়ে, আর যে detail-গুলো প্রথম message-এর আগেই বিশ্বাস তৈরি করে।',
    blocks: [
      p('<p>একটা profile কয়েক সেকেন্ডের জন্য পড়া হয় client portfolio-তে click করবে না scroll করে এগিয়ে যাবে তা ঠিক করার আগে — এর প্রতিটা অংশ একটা ছোট বিশ্বাসের সংকেত, শুধু সাজসজ্জা না।</p>'),
      h(2, 'ছবি', 'ছবি'),
      p('<p>একটা আসল, স্পষ্ট, বন্ধুত্বপূর্ণ headshot — কোনো logo না, কোনো cartoon avatar না, কোনো group photo না। একটা আসল মানুষের মুখ সহ profile সব প্রধান platform জুড়ে ধারাবাহিকভাবে ভালো কাজ করে; এটা client অন্য কিছুর আগে পড়া সবচেয়ে দ্রুত বিশ্বাসের সংকেতগুলোর একটা।</p>'),
      h(2, 'Headline', 'headline'),
      p('<p>নামের নিচের একটা লাইন মূল্যবান জায়গা — "Web Developer" এটা নষ্ট করে। "দ্রুত, Responsive Business Website বানানো React Developer" এক নজরে client-কে ঠিক জানায় তারা কী পাচ্ছে, আগের lesson-এর niche ভাষা ব্যবহার করে।</p>'),
      h(2, 'Bio — নিজের বদলে Client দিয়ে শুরু করা', 'bio-নিজের-বদলে-client-দিয়ে-শুরু-করা'),
      p('<p>একটা দুর্বল bio "আমি ৩ বছরের অভিজ্ঞতা সহ একজন passionate developer" দিয়ে শুরু হয়। একটা শক্তিশালী bio client-এর সমস্যা দিয়ে শুরু হয়: "একটা ধীর, পুরনো website নিয়ে সমস্যায় আছেন যা customer হারাচ্ছে? আমি দ্রুত, আধুনিক site বানাই যা visitor-কে buyer-এ পরিণত করে।" Credential তখনো bio-তে থাকে — hook-এর পরে, তার বদলে না।</p>'),
      table(['দুর্বল শুরু', 'শক্তিশালী শুরু'], [
        ['"আমি একজন পরিশ্রমী freelancer যে..."', '"আপনার landing page বিক্রি করানো উচিত, হারানো না।"'],
        ['"আমি ২ বছর ধরে graphic design করছি।"', '"আপনার brand-কে ব্যক্তিগতভাবে যেমন দেখায় স্ক্রিনেও তেমন ভালো দেখানোর জন্য সংগ্রাম করছেন?"'],
      ]),
      h(2, 'দক্ষতা আর Certification', 'দক্ষতা-আর-certification'),
      p('<p>শুধু সেই দক্ষতাগুলো তালিকাভুক্ত করুন যা আসল portfolio-তে দেখা যায় — একটা unbacked skill tag padding হিসেবে পড়ে, প্রমাণ হিসেবে না। যেকোনো আসল, প্রাসঙ্গিক certification (এই সাইটের নিজস্ব কোর্স থেকেও, শেষ হয়ে গেলে) যোগ করার যোগ্য; এতে কিছু খরচ হয় না আর আরেকটা concrete বিশ্বাসের সংকেত যোগ করে।</p>'),
      callout('tip', '<p>Profile লিখুন, তারপর এটা এমনভাবে পড়ুন যেন আপনি ঠিক সেই সমস্যার client যা এটা সমাধান করার কথা — যদি এটা সাথে সাথেই উত্তরের মতো না শোনায়, এতে আরেকটা pass দরকার।</p>', 'একটা দ্রুত পরীক্ষা'),
    ],
  },
})

lessons.push({
  slug: 'pricing-yourself', sortOrder: n++,
  en: {
    title: 'Pricing Yourself',
    metaTitle: 'Pricing Yourself | Learn Computer Academy',
    metaDescription: 'Hourly vs. fixed-price freelance work, how to actually calculate a starting rate, and the real cost of pricing too low.',
    blocks: [
      p('<p>Pricing is the single most anxiety-inducing part of starting out — too high and there\'s no work, too low and the work isn\'t worth doing. This lesson gives an actual starting method instead of a guess.</p>'),
      h(2, 'Hourly vs. Fixed Price'),
      table(['Model', 'Best for', 'Risk'], [
        ['Hourly', 'Open-ended or evolving work where scope isn\'t fully known upfront', 'A client may worry about an open-ended bill; requires honest time tracking'],
        ['Fixed price', 'Well-defined deliverables (a logo, a 5-page website, a specific feature)', 'Scope creep (covered later in this course) can quietly turn a good rate into a bad one'],
      ]),
      h(2, 'Calculating a Real Starting Hourly Rate'),
      p('<p>A simple, honest formula for a starting rate: figure out a target monthly income, divide by realistic <i>billable</i> hours per month (not total hours — administrative time, proposals, and finding clients aren\'t billable), then adjust down slightly to stay competitive while still new. Billable hours are almost always lower than expected once non-billable work is accounted for — often only 20-25 hours a week even for someone working full-time hours.</p>'),
      h(2, 'Converting Hourly Into a Fixed Quote'),
      p('<p>Estimate realistic hours for the whole project, multiply by the hourly rate, then add a buffer (commonly 15-20%) for the inevitable back-and-forth and small revisions a fixed-price project always includes.</p>'),
      h(2, 'Why Pricing Too Low Backfires'),
      p('<p>A rate far below market rate doesn\'t just mean less money — it actively attracts clients who value cheapness over quality, invites more revision requests (since the perceived stakes feel lower), and makes raising rates later feel like a bigger jump than it should. Charging a fair, if modest, rate from the start attracts better clients and sets a healthier trajectory.</p>'),
      callout('tip', '<p>It\'s normal and expected to price lower in the very first few projects to build reviews and a track record — the goal is a clear plan to raise rates as soon as that track record exists, not staying at the introductory rate indefinitely.</p>', 'Starting low is a strategy, not a trap — if it has an exit plan'),
    ],
  },
  bn: {
    title: 'নিজেকে Price করা',
    metaTitle: 'নিজেকে Price করা | Learn Computer Academy',
    metaDescription: 'Hourly বনাম fixed-price freelance কাজ, আসলে কীভাবে একটা শুরুর rate হিসাব করবেন, আর খুব কম price করার আসল খরচ।',
    blocks: [
      p('<p>Pricing শুরু করার সবচেয়ে দুশ্চিন্তা-জাগানো অংশ — বেশি হলে কোনো কাজ নেই, কম হলে কাজটা করার যোগ্য না। এই lesson একটা অনুমানের বদলে একটা আসল শুরুর পদ্ধতি দেয়।</p>'),
      h(2, 'Hourly বনাম Fixed Price', 'hourly-বনাম-fixed-price'),
      table(['মডেল', 'সবচেয়ে ভালো যার জন্য', 'ঝুঁকি'], [
        ['Hourly', 'খোলা-প্রান্তের বা বিবর্তিত কাজ যেখানে scope আগে থেকে পুরোপুরি জানা নেই', 'একজন client একটা খোলা-প্রান্তের bill নিয়ে চিন্তিত হতে পারে; সৎ time tracking দরকার'],
        ['Fixed price', 'ভালোভাবে সংজ্ঞায়িত deliverable (একটা logo, একটা ৫-page website, একটা নির্দিষ্ট feature)', 'Scope creep (এই কোর্সে পরে কভার করা) চুপচাপ একটা ভালো rate-কে খারাপে পরিণত করতে পারে'],
      ]),
      h(2, 'একটা আসল শুরুর Hourly Rate হিসাব করা', 'একটা-আসল-শুরুর-hourly-rate-হিসাব-করা'),
      p('<p>একটা শুরুর rate-এর জন্য একটা সরল, সৎ সূত্র: একটা লক্ষ্য মাসিক income ঠিক করুন, প্রতি মাসে বাস্তবসম্মত <i>billable</i> ঘণ্টা দিয়ে ভাগ করুন (মোট ঘণ্টা না — প্রশাসনিক সময়, proposal, আর client খোঁজা billable না), তারপর এখনো নতুন থাকা অবস্থায় প্রতিযোগিতামূলক থাকতে সামান্য কমিয়ে নিন। non-billable কাজ হিসাবে নেওয়ার পর billable ঘণ্টা প্রায় সবসময় প্রত্যাশার চেয়ে কম হয় — full-time ঘণ্টা কাজ করা কারো জন্যও প্রায়ই মাত্র সপ্তাহে ২০-২৫ ঘণ্টা।</p>'),
      h(2, 'Hourly-কে Fixed Quote-এ রূপান্তর করা', 'hourly-কে-fixed-quote-এ-রূপান্তর-করা'),
      p('<p>পুরো প্রজেক্টের জন্য বাস্তবসম্মত ঘণ্টা অনুমান করুন, hourly rate দিয়ে গুণ করুন, তারপর একটা fixed-price প্রজেক্ট সবসময় যে অনিবার্য দেন-দরবার আর ছোট revision অন্তর্ভুক্ত করে তার জন্য একটা buffer (সাধারণত ১৫-২০%) যোগ করুন।</p>'),
      h(2, 'কেন খুব কম price করা উল্টো ফল দেয়', 'কেন-খুব-কম-price-করা-উল্টো-ফল-দেয়'),
      p('<p>বাজারের rate-এর চেয়ে অনেক কম একটা rate শুধু কম টাকা মানে না — এটা সক্রিয়ভাবে এমন client আকর্ষণ করে যারা মান-এর চেয়ে সস্তা-কে বেশি গুরুত্ব দেয়, বেশি revision request আমন্ত্রণ জানায় (কারণ যা মনে করা হয় তার stakes কম মনে হয়), আর পরে rate বাড়ানো যা হওয়া উচিত তার চেয়ে বড় লাফ মনে করায়। শুরু থেকে একটা fair, যদিও সামান্য, rate charge করা ভালো client আকর্ষণ করে আর একটা স্বাস্থ্যকর গতিপথ তৈরি করে।</p>'),
      callout('tip', '<p>Review আর একটা track record বানাতে প্রথম কয়েকটা প্রজেক্টে কম price করা স্বাভাবিক আর প্রত্যাশিত — লক্ষ্য হলো সেই track record হয়ে গেলেই rate বাড়ানোর একটা স্পষ্ট পরিকল্পনা, অনির্দিষ্টকালের জন্য পরিচায়ক rate-এ থেকে যাওয়া না।</p>', 'কম দিয়ে শুরু করা একটা কৌশল, ফাঁদ না — যদি এর একটা exit plan থাকে'),
    ],
  },
})

lessons.push({
  slug: 'writing-proposals-that-win-jobs', sortOrder: n++,
  en: {
    title: 'Writing Proposals That Win Jobs',
    metaTitle: 'Writing Proposals That Win Jobs | Learn Computer Academy',
    metaDescription: 'How to write a job proposal on Upwork or Freelancer.com that actually gets read and responded to, not skipped past like every generic one.',
    blocks: [
      p('<p>On a job-posting platform, a client often opens dozens of proposals for one job. A generic, copy-pasted one gets skimmed and skipped in seconds — this lesson covers what actually gets read.</p>'),
      img('docs/img/freelancing/proposal-mockup', 'A realistic mockup of a job proposal submission screen with a cover letter text box, bid amount, delivery time fields, and a Send Proposal button', 1024, 768, 'A typical proposal submission form — the cover letter is where a generic pitch gets skipped or a specific one gets read.'),
      h(2, 'The Structure That Works'),
      table(['Part', 'What it does'], [
        ['Opening line', 'References something specific from THEIR job post — proves it was actually read'],
        ['The problem, restated', 'Shows understanding of what they actually need, in their own words where possible'],
        ['The approach', '2-3 sentences on how you\'d specifically tackle it — not a generic list of skills'],
        ['Relevant proof', 'One line pointing to the single most relevant portfolio piece, not the whole portfolio'],
        ['Clear next step', 'A specific question or a simple call to action — "Happy to hop on a quick call this week" beats a vague "let me know"'],
      ]),
      h(2, 'The One Habit That Beats Everyone Else'),
      p('<p>Most proposals are visibly copy-pasted templates with the client\'s name swapped in. Writing even two sentences that could <i>only</i> apply to this specific job post — referencing their actual product, their actual stated problem — puts a proposal in a different tier than 90% of the competition, at almost no extra cost in time.</p>'),
      h(2, 'Length'),
      p('<p>Short enough to read on a phone in under a minute. A proposal\'s job is to earn a reply or an interview, not to explain everything upfront — save the full detail for the conversation that follows.</p>'),
      h(2, 'Managing Limited Proposal Credits'),
      p('<p>Upwork\'s Connects system means each proposal has a real cost — this is exactly why a generic, mass-sent proposal is a bad trade. Applying to fewer, better-matched jobs with a genuinely tailored proposal each time consistently outperforms applying to everything.</p>'),
      callout('note', '<p>On Fiverr, a "proposal" is closer to a package listing plus responding to buyer requests — the same core principle (specific over generic) still applies to any custom offer sent to a buyer.</p>', 'A Fiverr difference worth knowing'),
    ],
  },
  bn: {
    title: 'কাজ জেতা Proposal লেখা',
    metaTitle: 'কাজ জেতা Proposal লেখা | Learn Computer Academy',
    metaDescription: 'Upwork বা Freelancer.com-এ কীভাবে একটা job proposal লিখবেন যা আসলে পড়া আর সাড়া পায়, প্রতিটা generic-এর মতো এড়িয়ে যাওয়া না।',
    blocks: [
      p('<p>একটা job-posting platform-এ, একজন client প্রায়ই একটা কাজের জন্য কয়েক ডজন proposal খোলে। একটা generic, copy-paste করা proposal কয়েক সেকেন্ডে চোখ বুলিয়ে এড়িয়ে যাওয়া হয় — এই lesson আসলে যা পড়া হয় তা কভার করে।</p>'),
      img('docs/img/freelancing/proposal-mockup', 'একটা cover letter text box, bid amount, delivery time field, আর একটা Send Proposal button সহ একটা job proposal submission screen-এর একটা বাস্তব mockup', 1024, 768, 'একটা সাধারণ proposal submission form — cover letter-ই যেখানে একটা generic pitch এড়িয়ে যাওয়া হয় বা একটা নির্দিষ্টটা পড়া হয়।'),
      h(2, 'যে গঠন কাজ করে', 'যে-গঠন-কাজ-করে'),
      table(['অংশ', 'এটা কী করে'], [
        ['শুরুর লাইন', 'তাদের job post থেকে নির্দিষ্ট কিছু উল্লেখ করে — প্রমাণ করে এটা আসলে পড়া হয়েছিল'],
        ['সমস্যা, পুনরায় বলা', 'যতটা সম্ভব তাদের নিজের ভাষায়, তাদের আসলে কী দরকার তার বোঝাপড়া দেখায়'],
        ['পদ্ধতি', 'আপনি এটা নির্দিষ্টভাবে কীভাবে সামলাবেন তার উপর ২-৩টা বাক্য — দক্ষতার একটা generic তালিকা না'],
        ['প্রাসঙ্গিক প্রমাণ', 'একটা লাইন সবচেয়ে প্রাসঙ্গিক একটা portfolio কাজের দিকে নির্দেশ করে, পুরো portfolio না'],
        ['স্পষ্ট পরবর্তী ধাপ', 'একটা নির্দিষ্ট প্রশ্ন বা একটা সরল call to action — "এই সপ্তাহে একটা দ্রুত call করতে খুশি" একটা অস্পষ্ট "জানাবেন"-কে হারায়'],
      ]),
      h(2, 'একটা অভ্যাস যা সবাইকে হারায়', 'একটা-অভ্যাস-যা-সবাইকে-হারায়'),
      p('<p>বেশিরভাগ proposal দৃশ্যত copy-paste করা template যেখানে শুধু client-এর নাম বদলানো। এমন দুটো বাক্যও লেখা যা <i>শুধু</i> এই নির্দিষ্ট job post-এর জন্য প্রযোজ্য হতে পারে — তাদের আসল product, তাদের আসল বলা সমস্যা উল্লেখ করে — একটা proposal-কে প্রতিযোগিতার ৯০%-এর থেকে আলাদা স্তরে রাখে, সময়ের প্রায় কোনো বাড়তি খরচ ছাড়াই।</p>'),
      h(2, 'দৈর্ঘ্য', 'দৈর্ঘ্য'),
      p('<p>এক মিনিটের কমে একটা ফোনে পড়ার মতো যথেষ্ট ছোট। একটা proposal-এর কাজ হলো একটা reply বা interview পাওয়া, আগেই সবকিছু ব্যাখ্যা করা না — পূর্ণ detail পরের কথোপকথনের জন্য রেখে দিন।</p>'),
      h(2, 'সীমিত Proposal Credit সামলানো', 'সীমিত-proposal-credit-সামলানো'),
      p('<p>Upwork-এর Connects system মানে প্রতিটা proposal-এর একটা আসল খরচ আছে — এই কারণেই একটা generic, ব্যাপকভাবে-পাঠানো proposal একটা খারাপ লেনদেন। কম, ভালো-মিলে যাওয়া কাজে প্রতিবার একটা সত্যিকারে উপযুক্ত proposal দিয়ে apply করা সবকিছুতে apply করার চেয়ে ধারাবাহিকভাবে ভালো করে।</p>'),
      callout('note', '<p>Fiverr-এ, একটা "proposal" package listing আর buyer request-এ সাড়া দেওয়ার কাছাকাছি — একই মূল নীতি (generic-এর চেয়ে নির্দিষ্ট) একজন buyer-কে পাঠানো যেকোনো custom offer-এ তখনো প্রযোজ্য।</p>', 'জানার মতো একটা Fiverr পার্থক্য'),
    ],
  },
})

// ═══ PHASE 3 — LANDING & SCOPING WORK ═══════════════════════════════════

lessons.push({
  slug: 'finding-your-first-client', sortOrder: n++,
  en: {
    title: 'Finding Your First Client',
    metaTitle: 'Finding Your First Client | Learn Computer Academy',
    metaDescription: 'Practical, realistic ways to land a first paying freelance client when there are no reviews and no track record yet.',
    blocks: [
      p('<p>The first client is the hardest one to get — every review-based system creates a chicken-and-egg problem where new profiles need reviews to get hired, but need to get hired first to earn reviews. This lesson is specifically about breaking that first barrier.</p>'),
      h(2, 'Start Inside an Existing Network'),
      p('<p>Before touching a marketplace, ask directly: does anyone already known — family, friends, classmates, a local business — need this skill? A first client from an existing relationship starts with built-in trust a stranger never has, and often becomes the very first portfolio piece and testimonial.</p>'),
      h(2, 'On Marketplaces — Price for the First Few, Not Forever'),
      p('<p>As covered in the pricing lesson, a lower introductory rate on the first 1-3 marketplace jobs is a reasonable, time-limited strategy purely to earn the first reviews — the rate that unlocks visibility and trust, not the rate to stay at.</p>'),
      h(2, 'Answer Buyer/Job Requests, Don\'t Only Wait'),
      p('<p>Fiverr\'s "Buyer Requests" and Upwork/Freelancer.com\'s job feeds are both worth checking daily early on — new profiles rarely get found by search alone yet, so actively responding to open requests matters more at the start than it will later.</p>'),
      h(2, 'Local and Offline Counts Too'),
      p('<p>Local businesses without a freelancer relationship yet — a shop needing a logo, a clinic needing a simple website — are often reachable directly, with less competition than an online platform and no marketplace commission taken.</p>'),
      callout('tip', '<p>The goal of client #1 is rarely maximum profit — it\'s a genuine case study, a real testimonial, and proof (to future clients and to yourself) that the work can actually be delivered for money.</p>', 'What the first client is really for'),
    ],
  },
  bn: {
    title: 'আপনার প্রথম Client খুঁজে বের করা',
    metaTitle: 'আপনার প্রথম Client খুঁজে বের করা | Learn Computer Academy',
    metaDescription: 'যখন এখনো কোনো review বা track record নেই, তখন প্রথম টাকা-দেওয়া freelance client পাওয়ার বাস্তব, বাস্তবসম্মত উপায়।',
    blocks: [
      p('<p>প্রথম client পাওয়া সবচেয়ে কঠিন — প্রতিটা review-ভিত্তিক system একটা মুরগি-না-ডিম সমস্যা তৈরি করে যেখানে নতুন profile-এর নিয়োগ পেতে review দরকার, কিন্তু review পেতে আগে নিয়োগ পাওয়া দরকার। এই lesson নির্দিষ্টভাবে সেই প্রথম বাধা ভাঙার বিষয়ে।</p>'),
      h(2, 'একটা বিদ্যমান Network-এর ভেতর থেকে শুরু করুন', 'একটা-বিদ্যমান-network-এর-ভেতর-থেকে-শুরু-করুন'),
      p('<p>কোনো marketplace-এ যাওয়ার আগে, সরাসরি জিজ্ঞাসা করুন: ইতিমধ্যে পরিচিত কারো — পরিবার, বন্ধু, সহপাঠী, একটা স্থানীয় ব্যবসা — এই দক্ষতাটা দরকার কিনা? একটা বিদ্যমান সম্পর্ক থেকে একটা প্রথম client একটা অচেনা ব্যক্তির কখনো না থাকা বিল্ট-ইন বিশ্বাস দিয়ে শুরু হয়, আর প্রায়ই একদম প্রথম portfolio কাজ আর testimonial হয়ে ওঠে।</p>'),
      h(2, 'Marketplace-এ — প্রথম কয়েকটার জন্য Price করুন, চিরকালের জন্য না', 'marketplace-এ-প্রথম-কয়েকটার-জন্য-price-করুন-চিরকালের-জন্য-না'),
      p('<p>pricing lesson-এ কভার করা মতো, প্রথম ১-৩টা marketplace কাজে একটা কম পরিচায়ক rate শুধুমাত্র প্রথম review পাওয়ার জন্য একটা যুক্তিসঙ্গত, সময়-সীমিত কৌশল — এমন rate যা visibility আর বিশ্বাস আনলক করে, যে rate-এ থাকতে হবে তা না।</p>'),
      h(2, 'Buyer/Job Request-এর উত্তর দিন, শুধু অপেক্ষা করবেন না', 'buyerjob-request-এর-উত্তর-দিন-শুধু-অপেক্ষা-করবেন-না'),
      p('<p>Fiverr-এর "Buyer Requests" আর Upwork/Freelancer.com-এর job feed শুরুতে প্রতিদিন চেক করার যোগ্য — নতুন profile এখনো শুধু search দিয়ে কদাচিৎ খুঁজে পাওয়া যায়, তাই খোলা request-এ সক্রিয়ভাবে সাড়া দেওয়া শুরুতে পরে হওয়ার চেয়ে বেশি গুরুত্বপূর্ণ।</p>'),
      h(2, 'স্থানীয় আর Offline-ও গোনে', 'স্থানীয়-আর-offline-ও-গোনে'),
      p('<p>এখনো কোনো freelancer সম্পর্ক নেই এমন স্থানীয় ব্যবসা — একটা logo দরকার এমন একটা দোকান, একটা সাধারণ website দরকার এমন একটা clinic — প্রায়ই সরাসরি পৌঁছানো যায়, একটা online platform-এর চেয়ে কম প্রতিযোগিতা আর কোনো marketplace commission ছাড়াই।</p>'),
      callout('tip', '<p>Client #1-এর লক্ষ্য কদাচিৎ সর্বোচ্চ লাভ — এটা একটা আসল case study, একটা আসল testimonial, আর প্রমাণ (ভবিষ্যতের client-দের আর নিজের কাছে) যে কাজটা আসলে টাকার বিনিময়ে delivered করা যায়।</p>', 'প্রথম client আসলে কীসের জন্য'),
    ],
  },
})

lessons.push({
  slug: 'client-communication-basics', sortOrder: n++,
  en: {
    title: 'Client Communication Basics',
    metaTitle: 'Client Communication Basics | Learn Computer Academy',
    metaDescription: 'How to communicate with freelance clients — tone, response time, and the small professional habits that separate a hired freelancer from a skipped one.',
    blocks: [
      p('<p>A client is often choosing between several similarly-skilled freelancers, and communication is frequently the actual tiebreaker — how a message is answered matters as much as what work is eventually delivered.</p>'),
      img('docs/img/freelancing/client-communication', 'An isometric illustration of two speech bubble chat icons floating above a laptop screen', 1024, 768, 'Client communication — often the real tiebreaker between two similarly skilled freelancers.'),
      h(2, 'Response Time'),
      p('<p>Fast, not instant. Responding within a few hours during working hours consistently outperforms same-minute replies at odd hours (which can read as having no other clients) and multi-day silence (which reads as unreliable). Setting a realistic expectation upfront ("I typically reply within a day") beats promising instant availability and then missing it.</p>'),
      h(2, 'Tone — Professional, Not Stiff'),
      p('<p>Friendly and clear beats either overly casual ("hey what\'s up") or overly formal ("Dear Esteemed Sir/Madam"). Matching the client\'s own tone is a safe default — a casual client\'s message deserves a warmer reply than a clearly formal corporate one.</p>'),
      h(2, 'Writing Clearly'),
      table(['Weak', 'Clear'], [
        ['"I\'ll try to get to it soon"', '"I\'ll have the first draft to you by Thursday"'],
        ['"It should mostly work now"', '"Fixed — tested on Chrome and Safari, both working"'],
        ['"Let me know what you think"', '"Let me know if the header color works, or if you\'d like it changed before I move to the next section"'],
      ]),
      h(2, 'Get Everything in Writing'),
      p('<p>A verbal or voice-call agreement on scope, price, or a deadline change should always get a follow-up written summary — a short "Just to confirm what we discussed..." message. It protects both sides and removes any later "that\'s not what we agreed" disputes.</p>'),
      h(2, 'Delivering Bad News'),
      p('<p>A missed deadline or a real problem should be communicated as soon as it\'s known, with a plan attached — not hidden until the client asks. "I\'m going to be a day late because of X, here\'s the new delivery time" preserves trust; silence followed by a missed deadline destroys it.</p>'),
    ],
  },
  bn: {
    title: 'Client Communication-এর মূল বিষয়',
    metaTitle: 'Client Communication-এর মূল বিষয় | Learn Computer Academy',
    metaDescription: 'freelance client-দের সাথে কীভাবে communicate করবেন — tone, response time, আর ছোট professional অভ্যাস যা একজন নিয়োগ পাওয়া freelancer-কে একজন এড়িয়ে যাওয়া থেকে আলাদা করে।',
    blocks: [
      p('<p>একজন client প্রায়ই কয়েকজন প্রায়-সমান-দক্ষ freelancer-এর মধ্যে বেছে নিচ্ছে, আর communication প্রায়ই আসল tiebreaker — একটা message-এর উত্তর কীভাবে দেওয়া হয় তা শেষ পর্যন্ত কী কাজ delivered হয় তার সমান গুরুত্বপূর্ণ।</p>'),
      img('docs/img/freelancing/client-communication', 'একটা ল্যাপটপ স্ক্রিনের উপরে ভাসমান দুটো speech bubble chat icon-এর isometric illustration', 1024, 768, 'Client communication — প্রায়ই দুইজন প্রায়-সমান-দক্ষ freelancer-এর মধ্যে আসল tiebreaker।'),
      h(2, 'Response Time', 'response-time'),
      p('<p>দ্রুত, তাৎক্ষণিক না। কাজের সময়ে কয়েক ঘণ্টার মধ্যে সাড়া দেওয়া অসময়ে সেই-মিনিটেই উত্তর দেওয়ার চেয়ে (যা অন্য কোনো client না থাকা বলে পড়তে পারে) আর কয়েক-দিনের নীরবতার চেয়ে (যা অনির্ভরযোগ্য বলে পড়ে) ধারাবাহিকভাবে ভালো করে। আগে থেকে একটা বাস্তবসম্মত প্রত্যাশা সেট করা ("আমি সাধারণত একদিনের মধ্যে উত্তর দিই") তাৎক্ষণিক availability প্রতিশ্রুতি দিয়ে তারপর মিস করার চেয়ে ভালো।</p>'),
      h(2, 'Tone — Professional, শক্ত না', 'tone-professional-শক্ত-না'),
      p('<p>বন্ধুত্বপূর্ণ আর স্পষ্ট অতিরিক্ত casual ("hey what\'s up") বা অতিরিক্ত formal ("Dear Esteemed Sir/Madam") দুটোকেই হারায়। client-এর নিজের tone মেলানো একটা নিরাপদ default — একজন casual client-এর message একটা স্পষ্টভাবে formal corporate message-এর চেয়ে বেশি উষ্ণ উত্তর পাওয়ার যোগ্য।</p>'),
      h(2, 'স্পষ্টভাবে লেখা', 'স্পষ্টভাবে-লেখা'),
      table(['দুর্বল', 'স্পষ্ট'], [
        ['"আমি শীঘ্রই এটা করার চেষ্টা করব"', '"বৃহস্পতিবারের মধ্যে আপনাকে প্রথম draft দেব"'],
        ['"এটা এখন মোটামুটি কাজ করা উচিত"', '"Fixed — Chrome আর Safari-তে test করা হয়েছে, দুটোই কাজ করছে"'],
        ['"আপনার কী মনে হয় জানাবেন"', '"header color কাজ করছে কিনা জানাবেন, বা পরের section-এ যাওয়ার আগে এটা বদলাতে চান কিনা"'],
      ]),
      h(2, 'সবকিছু লিখে রাখুন', 'সবকিছু-লিখে-রাখুন'),
      p('<p>scope, price, বা deadline বদলানো নিয়ে একটা মৌখিক বা voice-call চুক্তি সবসময় একটা follow-up লিখিত সারসংক্ষেপ পাওয়া উচিত — একটা ছোট "শুধু আমরা যা আলোচনা করেছি তা নিশ্চিত করতে..." message। এটা দুই পক্ষকেই রক্ষা করে আর পরের যেকোনো "এটা আমরা যা রাজি হয়েছিলাম তা না" বিরোধ দূর করে।</p>'),
      h(2, 'খারাপ খবর দেওয়া', 'খারাপ-খবর-দেওয়া'),
      p('<p>একটা মিস করা deadline বা একটা আসল সমস্যা জানার সাথে সাথে জানানো উচিত, একটা পরিকল্পনা সহ — client জিজ্ঞাসা না করা পর্যন্ত লুকিয়ে না রেখে। "X-এর কারণে আমি একদিন দেরি করব, এখানে নতুন delivery time" বিশ্বাস রক্ষা করে; নীরবতার পর একটা মিস করা deadline সেটা ধ্বংস করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'scoping-a-project', sortOrder: n++,
  en: {
    title: 'Scoping a Project — The Questions to Ask Before You Say Yes',
    metaTitle: 'Scoping a Project | Learn Computer Academy',
    metaDescription: 'The questions a freelancer should ask before accepting any project, and why skipping this step is where scope creep and disputes actually start.',
    blocks: [
      p('<p>Almost every bad freelance experience traces back to the same root cause: accepting a project before genuinely understanding what it involves. Scoping is the conversation that prevents it.</p>'),
      h(2, 'The Core Questions'),
      table(['Question', 'Why it matters'], [
        ['What does "done" look like, specifically?', 'A vague brief ("make it modern") leads to endless, undefined revisions later'],
        ['What\'s the real deadline, and is it flexible?', 'A "flexible" deadline that turns out not to be causes rushed, worse work'],
        ['How many rounds of revisions are included?', 'Unlimited revisions, unstated, is the single most common source of scope creep'],
        ['Who is the actual decision-maker?', 'Feedback filtered through 3 people with different opinions takes far longer than one clear approver'],
        ['What existing assets/access are provided?', 'Missing logins, brand assets, or content can silently stall a project that was otherwise ready to start'],
      ]),
      h(2, 'Turning Answers Into a Written Scope'),
      p('<p>A short written scope summary sent back to the client before starting — even 5-6 bullet points — does two things: catches misunderstandings while they\'re still cheap to fix, and becomes the reference point later if the project drifts from what was agreed.</p>'),
      h(2, 'When to Say No'),
      p('<p>Vague answers, an unwillingness to define "done," or a rushed "just start, we\'ll figure it out" are all signs worth pausing on — a project without a clear scope rarely gets easier once work begins, and a small amount of upfront friction here is far cheaper than a dispute later.</p>'),
      callout('tip', '<p>Scoping questions aren\'t interrogation — framed well, they read as competence. A client generally trusts a freelancer who asks sharp questions upfront more than one who says yes to everything immediately.</p>', 'Asking questions builds trust, it doesn\'t cost it'),
    ],
  },
  bn: {
    title: 'একটা প্রজেক্ট Scope করা — হ্যাঁ বলার আগে যে প্রশ্ন করবেন',
    metaTitle: 'একটা প্রজেক্ট Scope করা | Learn Computer Academy',
    metaDescription: 'যেকোনো প্রজেক্ট গ্রহণ করার আগে একজন freelancer-এর যে প্রশ্ন করা উচিত, আর কেন এই ধাপ এড়িয়ে যাওয়া আসলে scope creep আর বিরোধ শুরু হওয়ার জায়গা।',
    blocks: [
      p('<p>প্রায় প্রতিটা খারাপ freelance অভিজ্ঞতা একই মূল কারণে ফিরে যায়: একটা প্রজেক্টে কী জড়িত তা সত্যিকারে বোঝার আগে সেটা গ্রহণ করা। Scoping হলো সেই কথোপকথন যা এটা প্রতিরোধ করে।</p>'),
      h(2, 'মূল প্রশ্নগুলো', 'মূল-প্রশ্নগুলো'),
      table(['প্রশ্ন', 'কেন এটা গুরুত্বপূর্ণ'], [
        ['"শেষ" নির্দিষ্টভাবে দেখতে কেমন?', 'একটা অস্পষ্ট brief ("এটাকে আধুনিক করুন") পরে অসীম, অসংজ্ঞায়িত revision-এর দিকে নিয়ে যায়'],
        ['আসল deadline কী, আর এটা কি flexible?', 'একটা "flexible" deadline যা আসলে না, তাড়াহুড়ো করা, খারাপ কাজের কারণ হয়'],
        ['কতগুলো revision round অন্তর্ভুক্ত?', 'unlimited revision, না-বলা, scope creep-এর সবচেয়ে সাধারণ উৎস'],
        ['আসল সিদ্ধান্ত-গ্রহণকারী কে?', 'ভিন্ন মতামত সহ ৩ জনের মধ্য দিয়ে filter হওয়া feedback একজন স্পষ্ট অনুমোদনকারীর চেয়ে অনেক বেশি সময় নেয়'],
        ['কী বিদ্যমান asset/access দেওয়া হচ্ছে?', 'অনুপস্থিত login, brand asset, বা content অন্যথায় শুরু করার জন্য প্রস্তুত একটা প্রজেক্টকে চুপচাপ থামিয়ে দিতে পারে'],
      ]),
      h(2, 'উত্তরগুলোকে একটা লিখিত Scope-এ রূপান্তর করা', 'উত্তরগুলোকে-একটা-লিখিত-scope-এ-রূপান্তর-করা'),
      p('<p>শুরু করার আগে client-কে ফেরত পাঠানো একটা ছোট লিখিত scope সারসংক্ষেপ — এমনকি ৫-৬টা bullet point-ও — দুটো কাজ করে: ভুল বোঝাবুঝি এখনো সস্তায় ঠিক করা যায় থাকতেই ধরে, আর পরে প্রজেক্টটা যা রাজি হওয়া হয়েছিল তা থেকে সরে গেলে তখনকার সূত্র বিন্দু হয়ে ওঠে।</p>'),
      h(2, 'কখন না বলবেন', 'কখন-না-বলবেন'),
      p('<p>অস্পষ্ট উত্তর, "শেষ" সংজ্ঞায়িত করতে অনিচ্ছা, বা একটা তাড়াহুড়ো করা "শুধু শুরু করুন, আমরা বের করব" সবই থামার যোগ্য সংকেত — একটা স্পষ্ট scope ছাড়া একটা প্রজেক্ট কাজ শুরু হলে কদাচিৎ সহজ হয়ে ওঠে, আর এখানে সামান্য পরিমাণ আগাম ঘর্ষণ পরের একটা বিরোধের চেয়ে অনেক সস্তা।</p>'),
      callout('tip', '<p>Scoping প্রশ্ন জিজ্ঞাসাবাদ না — ভালোভাবে সাজালে, এগুলো দক্ষতা হিসেবে পড়ে। একজন client সাধারণত এমন একজন freelancer-কে বেশি বিশ্বাস করে যে আগে থেকে তীক্ষ্ণ প্রশ্ন করে, তার চেয়ে যে সাথে সাথে সবকিছুতে হ্যাঁ বলে।</p>', 'প্রশ্ন করা বিশ্বাস তৈরি করে, এটা খরচ করে না'),
    ],
  },
})

lessons.push({
  slug: 'red-flags-to-avoid', sortOrder: n++,
  en: {
    title: 'Red Flags — Clients and Jobs Worth Walking Away From',
    metaTitle: 'Red Flags in Freelancing | Learn Computer Academy',
    metaDescription: 'The warning signs in a client message or job post that predict a bad project, and why turning down a bad-fit job is a real skill worth building.',
    blocks: [
      p('<p>Not every job is worth taking, and the ability to recognize a bad one <i>before</i> accepting it is one of the most valuable, underrated freelance skills — far cheaper than learning the lesson mid-project.</p>'),
      h(2, 'In the Job Post or First Message'),
      table(['Red flag', 'What it usually predicts'], [
        ['"Just a small, simple job" for a genuinely large scope', 'Chronic underestimating of effort, likely to continue through revisions'],
        ['Refusing to state a budget at all', 'Often a sign of hoping to negotiate a freelancer far below fair value'],
        ['Wanting free "test work" before hiring', 'Free speculative work rarely leads to a paid job — a paid small trial task is a fair alternative'],
        ['Extreme urgency ("need it by tomorrow") on a first message', 'Often a pattern that continues after hiring — chronic last-minute demands'],
        ['Vague, shifting requirements even in the first exchange', 'A strong preview of scope creep once work actually begins'],
      ]),
      h(2, 'Payment-Related Red Flags'),
      table(['Red flag', 'Why it matters'], [
        ['Insisting on payment outside the platform, on a marketplace job', 'Removes the platform\'s dispute protection and payment guarantee entirely'],
        ['Wanting all work delivered before any payment on a large project', 'No leverage left if the client simply disappears after delivery'],
        ['A history of many one-star or no reviews from other freelancers', 'Past behavior toward other freelancers is a real predictor'],
      ]),
      h(2, 'It\'s Fine to Say No'),
      p('<p>A firm but polite decline ("This doesn\'t look like the right fit for this project — wishing you luck finding the right freelancer") costs nothing and closes the door cleanly. Turning down one bad-fit job is almost always cheaper, in time and stress, than accepting it and living through it.</p>'),
      callout('note', '<p>None of these are certainties — they\'re probabilities. A single red flag is worth a closer look, not an automatic decline; several stacked together is a much stronger signal.</p>', 'Red flags are signals, not verdicts'),
    ],
  },
  bn: {
    title: 'Red Flag — যে Client আর কাজ এড়িয়ে যাওয়ার যোগ্য',
    metaTitle: 'Freelancing-এ Red Flag | Learn Computer Academy',
    metaDescription: 'একটা client message বা job post-এ যে সতর্কতা সংকেত একটা খারাপ প্রজেক্টের পূর্বাভাস দেয়, আর কেন একটা বেমানান কাজ প্রত্যাখ্যান করা একটা আসল দক্ষতা যা তৈরি করার যোগ্য।',
    blocks: [
      p('<p>প্রতিটা কাজ নেওয়ার যোগ্য না, আর গ্রহণ করার <i>আগে</i> একটা খারাপ কাজ চিনতে পারার ক্ষমতা সবচেয়ে মূল্যবান, কম-মূল্যায়িত freelance দক্ষতাগুলোর একটা — প্রজেক্টের মাঝখানে এই পাঠ শেখার চেয়ে অনেক সস্তা।</p>'),
      h(2, 'Job Post বা প্রথম Message-এ', 'job-post-বা-প্রথম-message-এ'),
      table(['Red flag', 'সাধারণত এটা কী পূর্বাভাস দেয়'], [
        ['সত্যিকারে বড় একটা scope-এর জন্য "শুধু একটা ছোট, সরল কাজ"', 'প্রচেষ্টার দীর্ঘস্থায়ী অবমূল্যায়ন, revision-এর মধ্য দিয়ে চলতে থাকার সম্ভাবনা'],
        ['একদম budget বলতে অস্বীকার করা', 'প্রায়ই একজন freelancer-কে fair value-এর অনেক নিচে negotiate করার আশার সংকেত'],
        ['নিয়োগের আগে বিনামূল্যে "test work" চাওয়া', 'বিনামূল্যে speculative কাজ কদাচিৎ একটা paid কাজে নিয়ে যায় — একটা paid ছোট trial কাজ একটা fair বিকল্প'],
        ['প্রথম message-এই চরম urgency ("আগামীকালের মধ্যে দরকার")', 'প্রায়ই নিয়োগের পরেও চলতে থাকা একটা প্যাটার্ন — দীর্ঘস্থায়ী শেষ-মুহূর্তের দাবি'],
        ['প্রথম exchange-এই অস্পষ্ট, বদলাতে থাকা প্রয়োজনীয়তা', 'আসল কাজ শুরু হলে scope creep-এর একটা শক্তিশালী পূর্বাভাস'],
      ]),
      h(2, 'Payment-সম্পর্কিত Red Flag', 'payment-সম্পর্কিত-red-flag'),
      table(['Red flag', 'কেন এটা গুরুত্বপূর্ণ'], [
        ['একটা marketplace কাজে platform-এর বাইরে payment-এর উপর জোর দেওয়া', 'platform-এর dispute সুরক্ষা আর payment গ্যারান্টি সম্পূর্ণ সরিয়ে দেয়'],
        ['একটা বড় প্রজেক্টে কোনো payment-এর আগে সব কাজ delivered চাওয়া', 'client শুধু delivery-এর পরে অদৃশ্য হয়ে গেলে কোনো leverage থাকে না'],
        ['অন্য freelancer-দের কাছ থেকে অনেক one-star বা কোনো review-এর ইতিহাস না থাকা', 'অন্য freelancer-দের প্রতি অতীত আচরণ একটা আসল পূর্বাভাসক'],
      ]),
      h(2, 'না বলা ঠিক আছে', 'না-বলা-ঠিক-আছে'),
      p('<p>একটা দৃঢ় কিন্তু ভদ্র প্রত্যাখ্যান ("এই প্রজেক্টের জন্য এটা সঠিক মানানসই মনে হচ্ছে না — সঠিক freelancer খুঁজে পাওয়ার জন্য শুভকামনা") কিছুই খরচ করে না আর দরজা পরিষ্কারভাবে বন্ধ করে দেয়। একটা বেমানান কাজ প্রত্যাখ্যান করা প্রায় সবসময়ই সময় আর চাপের দিক থেকে এটা গ্রহণ করে সহ্য করার চেয়ে সস্তা।</p>'),
      callout('note', '<p>এগুলোর কোনোটাই নিশ্চিততা না — এগুলো সম্ভাবনা। একটা একক red flag একটা কাছ থেকে দেখার যোগ্য, স্বয়ংক্রিয় প্রত্যাখ্যান না; একসাথে জমা হওয়া কয়েকটা অনেক বেশি শক্তিশালী সংকেত।</p>', 'Red flag সংকেত, রায় না'),
    ],
  },
})

lessons.push({
  slug: 'negotiating-rate-and-scope', sortOrder: n++,
  en: {
    title: 'Negotiating Rate and Scope',
    metaTitle: 'Negotiating Rate and Scope | Learn Computer Academy',
    metaDescription: 'How to negotiate price and scope with a freelance client without underselling yourself, and how to respond when a client asks for a lower rate.',
    blocks: [
      p('<p>Negotiation isn\'t a confrontation — it\'s a normal part of most freelance deals, and handling it calmly and confidently is a learnable skill, not a personality trait some freelancers happen to have.</p>'),
      h(2, 'When a Client Asks for a Lower Rate'),
      table(['Weak response', 'Stronger response'], [
        ['Immediately agreeing to the lower number', '"I can work with that budget if we adjust the scope to [smaller version] — or the full scope at my original rate."'],
        ['Getting defensive about the rate', '"My rate reflects [specific relevant experience/results] — happy to explain the value in more detail."'],
        ['A flat, unexplained no', '"That\'s below what I can take this project on for, but I could offer [alternative] instead."'],
      ]),
      h(2, 'The Core Move: Trade, Don\'t Just Concede'),
      p('<p>Every discount given up should trade for something — a reduced scope, a longer deadline, an upfront deposit, or a testimonial/case-study commitment. A rate cut with nothing given up in return quietly trains a client (and every future client they might refer) to expect the same next time.</p>'),
      h(2, 'Negotiating Scope, Not Just Price'),
      p('<p>A request for "just one more small thing" mid-project is really a negotiation, even when it isn\'t framed as one. Responding with "Happy to add that — since it\'s outside the original scope, that\'ll be an additional [X]" reframes it honestly without conflict.</p>'),
      h(2, 'Knowing the Floor Before the Conversation'),
      p('<p>Walking into any negotiation with a real minimum acceptable rate decided in advance prevents an in-the-moment "sure, I guess that works" that\'s regretted an hour later. If the number goes below that floor, the honest answer is no, not a rushed yes.</p>'),
      callout('tip', '<p>A negotiation ending in "no deal" is a fine outcome, not a failure — a client unwilling to pay a fair rate for fair scope was never going to be a good client to work with.</p>', 'Walking away is a valid result'),
    ],
  },
  bn: {
    title: 'Rate আর Scope Negotiate করা',
    metaTitle: 'Rate আর Scope Negotiate করা | Learn Computer Academy',
    metaDescription: 'নিজেকে কম দামে বিক্রি না করে কীভাবে একজন freelance client-এর সাথে price আর scope negotiate করবেন, আর একজন client কম rate চাইলে কীভাবে সাড়া দেবেন।',
    blocks: [
      p('<p>Negotiation একটা সংঘর্ষ না — এটা বেশিরভাগ freelance চুক্তির একটা স্বাভাবিক অংশ, আর এটা শান্তভাবে আর আত্মবিশ্বাসের সাথে সামলানো একটা শেখার যোগ্য দক্ষতা, কিছু freelancer-এর কাকতালীয়ভাবে থাকা একটা ব্যক্তিত্বের বৈশিষ্ট্য না।</p>'),
      h(2, 'একজন Client কম Rate চাইলে', 'একজন-client-কম-rate-চাইলে'),
      table(['দুর্বল উত্তর', 'শক্তিশালী উত্তর'], [
        ['সাথে সাথে কম সংখ্যায় রাজি হওয়া', '"যদি আমরা scope [ছোট version]-এ সামঞ্জস্য করি তাহলে আমি সেই budget-এ কাজ করতে পারি — বা আমার আসল rate-এ পুরো scope।"'],
        ['rate নিয়ে defensive হওয়া', '"আমার rate [নির্দিষ্ট প্রাসঙ্গিক অভিজ্ঞতা/ফলাফল] প্রতিফলিত করে — আরো বিস্তারিতভাবে মূল্য ব্যাখ্যা করতে খুশি।"'],
        ['একটা সরল, ব্যাখ্যাহীন না', '"এটা আমি এই প্রজেক্ট নেওয়ার জন্য যা পারি তার নিচে, কিন্তু আমি এর বদলে [বিকল্প] অফার করতে পারি।"'],
      ]),
      h(2, 'মূল পদক্ষেপ: বিনিময় করুন, শুধু ছাড় দেবেন না', 'মূল-পদক্ষেপ-বিনিময়-করুন-শুধু-ছাড়-দেবেন-না'),
      p('<p>প্রতিটা দেওয়া discount কিছুর বিনিময়ে হওয়া উচিত — একটা কমানো scope, একটা লম্বা deadline, একটা আগাম deposit, বা একটা testimonial/case-study প্রতিশ্রুতি। বিনিময়ে কিছু না দিয়ে একটা rate কমানো চুপচাপ একজন client-কে (আর তারা refer করতে পারে এমন প্রতিটা ভবিষ্যত client-কে) পরের বার একই আশা করতে শেখায়।</p>'),
      h(2, 'শুধু Price না, Scope-ও Negotiate করা', 'শুধু-price-না-scope-ও-negotiate-করা'),
      p('<p>প্রজেক্টের মাঝখানে "শুধু আরেকটা ছোট জিনিস"-এর একটা request আসলে একটা negotiation, এমনকি যখন এটা সেভাবে সাজানো হয় না তখনও। "এটা যোগ করতে খুশি — যেহেতু এটা আসল scope-এর বাইরে, এটা একটা অতিরিক্ত [X] হবে" দিয়ে সাড়া দেওয়া কোনো সংঘাত ছাড়াই সততার সাথে এটা পুনরায় সাজায়।</p>'),
      h(2, 'কথোপকথনের আগে সর্বনিম্ন সীমা জানা', 'কথোপকথনের-আগে-সর্বনিম্ন-সীমা-জানা'),
      p('<p>আগে থেকে ঠিক করা একটা আসল সর্বনিম্ন গ্রহণযোগ্য rate নিয়ে যেকোনো negotiation-এ ঢোকা একটা মুহূর্তের-মধ্যে "হ্যাঁ, মনে হয় এটা কাজ করবে" প্রতিরোধ করে যা এক ঘণ্টা পরে অনুশোচনা হয়। যদি সংখ্যাটা সেই সীমার নিচে যায়, সৎ উত্তর হলো না, একটা তাড়াহুড়ো করা হ্যাঁ না।</p>'),
      callout('tip', '<p>একটা negotiation "কোনো চুক্তি না"-তে শেষ হওয়া একটা ভালো ফলাফল, ব্যর্থতা না — fair scope-এর জন্য fair rate দিতে অনিচ্ছুক একজন client কখনোই কাজ করার জন্য একজন ভালো client হতো না।</p>', 'সরে যাওয়া একটা বৈধ ফলাফল'),
    ],
  },
})

// ═══ PHASE 4 — CONTRACTS & GETTING PAID ═════════════════════════════════

lessons.push({
  slug: 'contracts-and-agreements-basics', sortOrder: n++,
  en: {
    title: 'Contracts and Agreements — The Basics',
    metaTitle: 'Freelance Contracts and Agreements Basics | Learn Computer Academy',
    metaDescription: 'What a freelance contract actually needs to cover, in plain language, and why even a small project deserves something in writing.',
    blocks: [
      p('<p>A contract doesn\'t need to be intimidating legal document — its real job is making sure both sides agree, in writing, on the same understanding of the deal, before any work or money changes hands.</p>'),
      img('docs/img/freelancing/contract-mockup', 'A realistic mockup of a simple freelance service agreement document with sections for scope of work, payment terms, deadline, and signature lines for client and freelancer', 1024, 768, 'A minimal freelance agreement covers scope, payment, deadline, and revisions — nothing more is strictly required to protect both sides.'),
      h(2, 'What a Minimal Contract Needs'),
      table(['Section', 'What it should say'], [
        ['Scope of work', 'Exactly what\'s being delivered — specific enough that "is this included?" has an obvious answer'],
        ['Payment terms', 'Total price, payment schedule (upfront deposit? milestones?), and accepted payment method'],
        ['Timeline', 'Start date, delivery date, and what happens if the client causes a delay (late feedback, missing assets)'],
        ['Revisions', 'How many rounds are included, and the cost of additional rounds beyond that'],
        ['Ownership/usage rights', 'When the client actually owns the final work — usually only after full payment clears'],
        ['Cancellation terms', 'What happens, and what\'s owed, if either side ends the project early'],
      ]),
      h(2, 'Platform Contracts vs. Standalone Contracts'),
      p('<p>Work found through Fiverr, Upwork, or Freelancer.com is already covered by that platform\'s own terms of service and payment protection when payment happens on-platform — a separate signed contract is often unnecessary there. Direct clients, found outside any platform, are exactly where a real written contract matters most, since no marketplace safety net exists.</p>'),
      h(2, 'Getting a Contract Signed Without a Lawyer'),
      p('<p>Free e-signature tools (like a basic template filled in and signed through a service such as DocuSign\'s free tier, or even a mutually-confirmed written email agreement) are enough for most small freelance projects — a lawyer-drafted contract becomes worth the cost only once project values are large enough to justify it.</p>'),
      callout('note', '<p>This lesson explains what a contract should contain, not legal advice for any specific dispute — for anything with serious money or risk involved, a real lawyer is worth consulting.</p>', 'Not legal advice'),
    ],
  },
  bn: {
    title: 'Contract আর চুক্তি — মূল বিষয়',
    metaTitle: 'Freelance Contract আর চুক্তির মূল বিষয় | Learn Computer Academy',
    metaDescription: 'সহজ ভাষায়, একটা freelance contract-এ আসলে কী কভার করা দরকার, আর কেন একটা ছোট প্রজেক্টও লিখিত কিছুর যোগ্য।',
    blocks: [
      p('<p>একটা contract একটা ভয় দেখানো আইনি নথি হওয়ার দরকার নেই — এর আসল কাজ হলো নিশ্চিত করা যে দুই পক্ষই, লিখিতভাবে, কাজ বা টাকা হাত বদলানোর আগে চুক্তির একই বোঝাপড়ায় রাজি।</p>'),
      img('docs/img/freelancing/contract-mockup', 'scope of work, payment terms, deadline, আর client আর freelancer-এর জন্য signature line সহ একটা সাধারণ freelance service agreement নথির একটা বাস্তব mockup', 1024, 768, 'একটা ন্যূনতম freelance agreement scope, payment, deadline, আর revision কভার করে — দুই পক্ষকে রক্ষা করতে এর বেশি কিছু কঠোরভাবে দরকার নেই।'),
      h(2, 'একটা ন্যূনতম Contract-এ কী দরকার', 'একটা-ন্যূনতম-contract-এ-কী-দরকার'),
      table(['Section', 'এটাতে কী বলা উচিত'], [
        ['Scope of work', 'ঠিক কী delivered হচ্ছে — যথেষ্ট নির্দিষ্ট যে "এটা কি অন্তর্ভুক্ত?"-এর একটা স্পষ্ট উত্তর আছে'],
        ['Payment terms', 'মোট price, payment schedule (আগাম deposit? milestone?), আর গ্রহণযোগ্য payment method'],
        ['Timeline', 'শুরুর তারিখ, delivery তারিখ, আর client দেরির কারণ হলে কী হয় (দেরিতে feedback, অনুপস্থিত asset)'],
        ['Revisions', 'কতগুলো round অন্তর্ভুক্ত, আর তার বাইরে অতিরিক্ত round-এর খরচ'],
        ['Ownership/ব্যবহারের অধিকার', 'client আসলে কখন শেষ কাজের মালিক হয় — সাধারণত শুধু পূর্ণ payment clear হওয়ার পরে'],
        ['বাতিলের শর্ত', 'যেকোনো পক্ষ প্রজেক্ট আগে শেষ করলে কী হয়, আর কী পাওনা'],
      ]),
      h(2, 'Platform Contract বনাম আলাদা Contract', 'platform-contract-বনাম-আলাদা-contract'),
      p('<p>Fiverr, Upwork, বা Freelancer.com-এর মাধ্যমে পাওয়া কাজ ইতিমধ্যে সেই platform-এর নিজের terms of service আর payment protection দিয়ে কভার করা, যখন payment on-platform হয় — সেখানে একটা আলাদা signed contract প্রায়ই অপ্রয়োজনীয়। কোনো platform-এর বাইরে পাওয়া direct client, ঠিক যেখানে একটা আসল লিখিত contract সবচেয়ে বেশি গুরুত্বপূর্ণ, কারণ কোনো marketplace নিরাপত্তা জাল নেই।</p>'),
      h(2, 'একজন Lawyer ছাড়া একটা Contract Sign করানো', 'একজন-lawyer-ছাড়া-একটা-contract-sign-করানো'),
      p('<p>বিনামূল্যে e-signature টুল (যেমন DocuSign-এর free tier-এর মতো একটা service-এর মাধ্যমে একটা basic template ভরাট আর sign করা, বা এমনকি একটা পারস্পরিকভাবে-নিশ্চিত লিখিত email agreement) বেশিরভাগ ছোট freelance প্রজেক্টের জন্য যথেষ্ট — একটা lawyer-লেখা contract শুধুমাত্র প্রজেক্টের মূল্য যথেষ্ট বড় হলেই খরচের যোগ্য হয়ে ওঠে।</p>'),
      callout('note', '<p>এই lesson একটা contract-এ কী থাকা উচিত তা ব্যাখ্যা করে, কোনো নির্দিষ্ট বিরোধের জন্য আইনি পরামর্শ না — গুরুতর টাকা বা ঝুঁকি জড়িত যেকোনো কিছুর জন্য, একজন আসল lawyer-এর সাথে পরামর্শ করার যোগ্য।</p>', 'আইনি পরামর্শ না'),
    ],
  },
})

lessons.push({
  slug: 'getting-paid-internationally', sortOrder: n++,
  en: {
    title: 'Getting Paid Internationally',
    metaTitle: 'Getting Paid Internationally as a Freelancer | Learn Computer Academy',
    metaDescription: 'How Indian freelancers actually receive payment from international clients — platform escrow, PayPal, Payoneer, Wise, and bank transfer compared.',
    blocks: [
      p('<p>Freelance clients are often in a different country entirely, and getting paid across borders has its own real mechanics worth understanding upfront, rather than figuring out after the first invoice is already due.</p>'),
      img('docs/img/freelancing/payment-dashboard-mockup', 'A realistic mockup of an online payments dashboard for freelancers, showing a balance, a Withdraw to Bank button, and a recent transactions list', 1024, 768, 'A typical freelancer payments dashboard — balance, withdrawal, and a transaction history.'),
      h(2, 'Platform Escrow — The Default on Marketplaces'),
      p('<p>On Fiverr, Upwork, and Freelancer.com, the client\'s payment is usually held by the platform itself (escrow) and released to the freelancer on delivery/approval — the freelancer never has to separately invoice or chase the client directly. The platform then pays the freelancer out via one of a few supported withdrawal methods, and takes its commission before that payout happens.</p>'),
      h(2, 'The Main Withdrawal/Payment Methods'),
      table(['Method', 'Notes for an India-based freelancer'], [
        ['Payoneer', 'Very commonly supported across freelance platforms; funds land in a Payoneer account, then transfer to a local Indian bank account, usually with a modest fee'],
        ['Wise (formerly TransferWise)', 'Known for transparent, generally lower conversion fees than a traditional bank; works well for direct-client international bank transfers'],
        ['PayPal', 'Usable for receiving international payments from India, but with real restrictions — money generally can\'t sit in the account and must be withdrawn to a bank within a set number of days, and PayPal isn\'t supported on every freelance platform'],
        ['Direct bank transfer (SWIFT/wire)', 'Common for larger direct-client payments; usually has a higher fixed fee per transfer, better suited to bigger, less frequent payments than many small ones'],
      ]),
      h(2, 'Currency Conversion — Where Money Quietly Gets Lost'),
      p('<p>Every method converts foreign currency to INR at some point, and the conversion rate/fee varies meaningfully between providers — comparing the actual received amount (not just the advertised rate) across 2-3 methods on a real payment is worth the ten minutes it takes, especially once payment volume grows.</p>'),
      h(2, 'Setting Up Before the First Client, Not After'),
      p('<p>Whichever method is chosen, opening and verifying the account (Payoneer, Wise, etc.) before it\'s actually needed avoids a stressful scramble once a client is ready to pay and the payout method still isn\'t set up.</p>'),
      callout('note', '<p>Received freelance income counts as taxable income and, past a certain export-of-services threshold, may have GST implications — covered honestly and simply in the Taxes for Freelancers lesson later in this course.</p>', 'This connects to the tax lesson'),
    ],
  },
  bn: {
    title: 'আন্তর্জাতিকভাবে টাকা পাওয়া',
    metaTitle: 'একজন Freelancer হিসেবে আন্তর্জাতিকভাবে টাকা পাওয়া | Learn Computer Academy',
    metaDescription: 'ভারতীয় freelancer-রা আসলে কীভাবে আন্তর্জাতিক client থেকে payment পায় — platform escrow, PayPal, Payoneer, Wise, আর bank transfer তুলনা।',
    blocks: [
      p('<p>Freelance client-রা প্রায়ই সম্পূর্ণ ভিন্ন একটা দেশে থাকে, আর সীমানা জুড়ে টাকা পাওয়ার নিজস্ব আসল mechanics আছে যা প্রথম invoice-এর সময় হয়ে যাওয়ার পরে বের করার বদলে আগে থেকে বোঝার যোগ্য।</p>'),
      img('docs/img/freelancing/payment-dashboard-mockup', 'একটা balance, একটা Withdraw to Bank button, আর একটা recent transaction তালিকা দেখানো freelancer-দের জন্য একটা online payment dashboard-এর একটা বাস্তব mockup', 1024, 768, 'একটা সাধারণ freelancer payment dashboard — balance, withdrawal, আর একটা transaction ইতিহাস।'),
      h(2, 'Platform Escrow — Marketplace-এ Default', 'platform-escrow-marketplace-এ-default'),
      p('<p>Fiverr, Upwork, আর Freelancer.com-এ, client-এর payment সাধারণত platform নিজেই ধরে রাখে (escrow) আর delivery/approval-এ freelancer-কে release করে — freelancer-কে কখনো আলাদাভাবে invoice করতে বা সরাসরি client-এর পিছনে ছুটতে হয় না। তারপর platform কয়েকটা সমর্থিত withdrawal method-এর একটার মাধ্যমে freelancer-কে টাকা দেয়, আর সেই payout হওয়ার আগে তার commission নিয়ে নেয়।</p>'),
      h(2, 'প্রধান Withdrawal/Payment Method', 'প্রধান-withdrawalpayment-method'),
      table(['পদ্ধতি', 'একজন ভারত-ভিত্তিক freelancer-এর জন্য নোট'], [
        ['Payoneer', 'freelance platform জুড়ে খুব সাধারণভাবে সমর্থিত; টাকা একটা Payoneer account-এ আসে, তারপর একটা সাধারণ fee সহ একটা স্থানীয় ভারতীয় bank account-এ transfer হয়'],
        ['Wise (আগে TransferWise)', 'একটা প্রথাগত bank-এর চেয়ে স্বচ্ছ, সাধারণত কম conversion fee-এর জন্য পরিচিত; direct-client আন্তর্জাতিক bank transfer-এর জন্য ভালো কাজ করে'],
        ['PayPal', 'ভারত থেকে আন্তর্জাতিক payment পাওয়ার জন্য ব্যবহারযোগ্য, কিন্তু আসল বিধিনিষেধ সহ — টাকা সাধারণত account-এ থাকতে পারে না আর একটা নির্দিষ্ট দিনের মধ্যে bank-এ withdraw করতে হয়, আর PayPal প্রতিটা freelance platform-এ সমর্থিত না'],
        ['সরাসরি Bank transfer (SWIFT/wire)', 'বড় direct-client payment-এর জন্য সাধারণ; সাধারণত প্রতি transfer-এ বেশি fixed fee থাকে, অনেক ছোট payment-এর চেয়ে বড়, কম ঘন ঘন payment-এর জন্য বেশি উপযুক্ত'],
      ]),
      h(2, 'Currency Conversion — যেখানে চুপচাপ টাকা হারায়', 'currency-conversion-যেখানে-চুপচাপ-টাকা-হারায়'),
      p('<p>প্রতিটা পদ্ধতি কোনো না কোনো সময়ে বিদেশি currency-কে INR-এ রূপান্তর করে, আর conversion rate/fee provider-এর মধ্যে অর্থপূর্ণভাবে ভিন্ন হয় — একটা আসল payment-এ ২-৩টা পদ্ধতি জুড়ে আসল প্রাপ্ত পরিমাণ (শুধু বিজ্ঞাপিত rate না) তুলনা করা যে দশ মিনিট নেয় তার যোগ্য, বিশেষ করে payment পরিমাণ বাড়ার সাথে সাথে।</p>'),
      h(2, 'প্রথম Client-এর আগে সেট আপ করুন, পরে না', 'প্রথম-client-এর-আগে-সেট-আপ-করুন-পরে-না'),
      p('<p>যে পদ্ধতিই বেছে নেওয়া হোক না কেন, এটা আসলে দরকার হওয়ার আগে account (Payoneer, Wise, ইত্যাদি) খোলা আর যাচাই করা একজন client টাকা দিতে প্রস্তুত হয়ে গেলে আর payout পদ্ধতি এখনো সেট আপ না হলে একটা চাপযুক্ত তাড়াহুড়ো এড়ায়।</p>'),
      callout('note', '<p>পাওয়া freelance income কর-যোগ্য income হিসেবে গণ্য হয় আর, একটা নির্দিষ্ট export-of-services সীমার পরে, GST-এর প্রভাব থাকতে পারে — এই কোর্সের পরে Taxes for Freelancers lesson-এ সৎভাবে আর সহজভাবে কভার করা হয়েছে।</p>', 'এটা tax lesson-এর সাথে সংযুক্ত'),
    ],
  },
})

lessons.push({
  slug: 'invoicing-professionally', sortOrder: n++,
  en: {
    title: 'Invoicing Professionally',
    metaTitle: 'Invoicing Professionally as a Freelancer | Learn Computer Academy',
    metaDescription: 'What a freelance invoice needs to include, when to send it, and free tools that make invoicing direct clients simple.',
    blocks: [
      p('<p>Marketplace work often skips this entirely (payment happens through the platform), but any direct client relationship needs a real invoice — it\'s the formal, professional record of what\'s owed and why.</p>'),
      h(2, 'What Every Invoice Needs'),
      table(['Field', 'Why it\'s needed'], [
        ['Invoice number and date', 'For both sides\' record-keeping, and required for any real bookkeeping or tax filing later'],
        ['Freelancer\'s name/business name and contact details', 'Identifies who\'s being paid'],
        ['Client\'s name and details', 'Identifies who owes it'],
        ['Itemized description of work', 'Not just "Website — ₹15,000" but what that covers, referencing the agreed scope'],
        ['Amount, currency, and due date', 'Removes any ambiguity about how much, in what currency, and by when'],
        ['Accepted payment method(s)', 'Tells the client exactly how to actually pay'],
      ]),
      h(2, 'When to Send It'),
      p('<p>For milestone or project-based work, invoice at each agreed payment point (e.g., 50% upfront, 50% on delivery) rather than waiting until the very end — sending it promptly, the same day a milestone is hit, keeps payment cycles predictable for both sides.</p>'),
      h(2, 'Free Invoicing Tools'),
      table(['Tool', 'Good for'], [
        ['Wave', 'Genuinely free invoicing and basic bookkeeping, a solid starting point'],
        ['A clean template in Google Docs/Sheets', 'Zero cost, full control, fine for very early, low-volume freelancing'],
        ['Built-in invoicing in Payoneer/PayPal', 'Convenient if already using that platform for payment, one less tool to manage'],
      ]),
      callout('tip', '<p>Keep a copy of every invoice sent — beyond just being professional, it becomes the actual record needed at tax time, covered in a later lesson.</p>', 'Invoices double as your bookkeeping'),
    ],
  },
  bn: {
    title: 'Professionally Invoice করা',
    metaTitle: 'একজন Freelancer হিসেবে Professionally Invoice করা | Learn Computer Academy',
    metaDescription: 'একটা freelance invoice-এ কী অন্তর্ভুক্ত থাকা দরকার, কখন এটা পাঠাবেন, আর direct client-দের invoice করা সহজ করে এমন বিনামূল্যে টুল।',
    blocks: [
      p('<p>Marketplace কাজ প্রায়ই এটা সম্পূর্ণ এড়িয়ে যায় (payment platform-এর মাধ্যমে হয়), কিন্তু যেকোনো direct client সম্পর্কের একটা আসল invoice দরকার — এটা কী পাওনা আর কেন তার formal, professional রেকর্ড।</p>'),
      h(2, 'প্রতিটা Invoice-এ কী দরকার', 'প্রতিটা-invoice-এ-কী-দরকার'),
      table(['Field', 'কেন এটা দরকার'], [
        ['Invoice number আর তারিখ', 'দুই পক্ষের রেকর্ড-রাখার জন্য, আর পরে যেকোনো আসল bookkeeping বা tax filing-এর জন্য দরকার'],
        ['Freelancer-এর নাম/business নাম আর যোগাযোগের তথ্য', 'কাকে টাকা দেওয়া হচ্ছে তা শনাক্ত করে'],
        ['Client-এর নাম আর তথ্য', 'কে এটা পাওনা তা শনাক্ত করে'],
        ['কাজের item-ভিত্তিক বিবরণ', 'শুধু "Website — ₹১৫,০০০" না, বরং এটা কী কভার করে, রাজি হওয়া scope উল্লেখ করে'],
        ['পরিমাণ, currency, আর due date', 'কত, কোন currency-তে, আর কবের মধ্যে তা নিয়ে যেকোনো অস্পষ্টতা দূর করে'],
        ['গ্রহণযোগ্য payment পদ্ধতি', 'client-কে ঠিক কীভাবে আসলে টাকা দিতে হবে তা বলে'],
      ]),
      h(2, 'কখন এটা পাঠাবেন', 'কখন-এটা-পাঠাবেন'),
      p('<p>Milestone বা প্রজেক্ট-ভিত্তিক কাজের জন্য, একদম শেষ পর্যন্ত অপেক্ষা না করে প্রতিটা রাজি হওয়া payment point-এ invoice করুন (যেমন, আগাম ৫০%, delivery-তে ৫০%) — একটা milestone পূরণ হওয়ার একই দিনে দ্রুত পাঠানো দুই পক্ষের জন্যই payment cycle অনুমানযোগ্য রাখে।</p>'),
      h(2, 'বিনামূল্যে Invoicing টুল', 'বিনামূল্যে-invoicing-টুল'),
      table(['টুল', 'যার জন্য ভালো'], [
        ['Wave', 'সত্যিকারে বিনামূল্যে invoicing আর basic bookkeeping, একটা শক্ত শুরুর বিন্দু'],
        ['Google Docs/Sheets-এ একটা পরিষ্কার template', 'শূন্য খরচ, পূর্ণ নিয়ন্ত্রণ, খুব প্রাথমিক, কম-পরিমাণ freelancing-এর জন্য ঠিক'],
        ['Payoneer/PayPal-এ বিল্ট-ইন invoicing', 'payment-এর জন্য ইতিমধ্যে সেই platform ব্যবহার করলে সুবিধাজনক, সামলানোর জন্য একটা কম টুল'],
      ]),
      callout('tip', '<p>পাঠানো প্রতিটা invoice-এর একটা কপি রাখুন — শুধু professional হওয়ার বাইরে, এটা tax সময়ে দরকার হওয়া আসল রেকর্ড হয়ে ওঠে, একটা পরের lesson-এ কভার করা।</p>', 'Invoice আপনার bookkeeping হিসেবেও কাজ করে'),
    ],
  },
})

lessons.push({
  slug: 'handling-late-or-non-paying-clients', sortOrder: n++,
  en: {
    title: 'Handling Late or Non-Paying Clients',
    metaTitle: 'Handling Late or Non-Paying Freelance Clients | Learn Computer Academy',
    metaDescription: 'A calm, practical escalation process for a freelance client who\'s late on payment or refuses to pay, from a friendly reminder to a real dispute.',
    blocks: [
      p('<p>Not every client pays on time, and a small number won\'t pay at all — this happens to almost every freelancer eventually. A calm, staged process handles it far better than panic or an angry email.</p>'),
      h(2, 'The Escalation Ladder'),
      table(['Stage', 'What to do'], [
        ['A few days late', 'A brief, friendly reminder — "Just checking in, wanted to make sure invoice #12 came through okay"'],
        ['A week+ late, no response', 'A firmer follow-up referencing the agreed due date directly, and asking for a specific new payment date'],
        ['Still unresponsive', 'A final written notice stating the next step clearly (platform dispute, pausing further work, or a collections/legal step for a large amount)'],
        ['On a marketplace, still unresolved', 'Open a formal dispute through the platform\'s own resolution process — this is exactly what it exists for'],
      ]),
      h(2, 'Prevention Is Cheaper Than Collection'),
      p('<p>Most non-payment problems are prevented upfront, not solved after the fact: an upfront deposit before starting work, milestone-based payments on larger projects rather than one lump sum at the end, and simply not releasing final files/source access until payment clears.</p>'),
      h(2, 'Marketplace Protection vs. Direct Clients'),
      p('<p>Payment through Fiverr, Upwork, or Freelancer.com is generally safer specifically because of platform escrow and a formal dispute process — this is one of the strongest real arguments for keeping early client relationships on-platform rather than moving to direct payment before there\'s a track record.</p>'),
      h(2, 'When to Cut Losses'),
      p('<p>For a small amount, continuing to chase payment can cost more in time and stress than the amount itself is worth. Recognizing that point and moving on — while learning the lesson (usually: get a deposit next time) — is often the more rational choice than an extended, draining pursuit.</p>'),
      callout('note', '<p>This is exactly why the Contracts lesson and this lesson connect directly — a clear written agreement is what a dispute process, on or off a platform, is actually evaluated against.</p>', 'This is why contracts matter'),
    ],
  },
  bn: {
    title: 'দেরি করা বা টাকা-না-দেওয়া Client সামলানো',
    metaTitle: 'দেরি করা বা টাকা-না-দেওয়া Freelance Client সামলানো | Learn Computer Academy',
    metaDescription: 'একজন freelance client যে payment-এ দেরি করছে বা দিতে অস্বীকার করছে তার জন্য একটা শান্ত, বাস্তব escalation প্রক্রিয়া, একটা বন্ধুত্বপূর্ণ reminder থেকে একটা আসল বিরোধ পর্যন্ত।',
    blocks: [
      p('<p>প্রতিটা client সময়মতো টাকা দেয় না, আর একটা ছোট সংখ্যা একদমই দেবে না — শেষ পর্যন্ত এটা প্রায় প্রতিটা freelancer-এর সাথে হয়। একটা শান্ত, ধাপে-ধাপে প্রক্রিয়া এটাকে আতঙ্ক বা একটা রাগী email-এর চেয়ে অনেক ভালোভাবে সামলায়।</p>'),
      h(2, 'Escalation-এর সিঁড়ি', 'escalation-এর-সিঁড়ি'),
      table(['ধাপ', 'কী করবেন'], [
        ['কয়েক দিন দেরি', 'একটা সংক্ষিপ্ত, বন্ধুত্বপূর্ণ reminder — "শুধু চেক করছি, নিশ্চিত করতে চেয়েছিলাম invoice #12 ঠিকমতো এসেছে কিনা"'],
        ['এক সপ্তাহ+ দেরি, কোনো সাড়া নেই', 'রাজি হওয়া due date সরাসরি উল্লেখ করে একটা দৃঢ় follow-up, আর একটা নির্দিষ্ট নতুন payment তারিখ চাওয়া'],
        ['এখনো সাড়া নেই', 'পরের ধাপ স্পষ্টভাবে বলা একটা চূড়ান্ত লিখিত নোটিশ (platform dispute, আরো কাজ থামানো, বা বড় পরিমাণের জন্য একটা collections/আইনি ধাপ)'],
        ['একটা marketplace-এ, তখনো অমীমাংসিত', 'platform-এর নিজের resolution প্রক্রিয়ার মাধ্যমে একটা formal dispute খুলুন — এটাই ঠিক যার জন্য এটা আছে'],
      ]),
      h(2, 'প্রতিরোধ Collection-এর চেয়ে সস্তা', 'প্রতিরোধ-collection-এর-চেয়ে-সস্তা'),
      p('<p>বেশিরভাগ non-payment সমস্যা পরে সমাধান করার বদলে আগে থেকে প্রতিরোধ করা হয়: কাজ শুরুর আগে একটা আগাম deposit, বড় প্রজেক্টে শেষে একটা lump sum-এর বদলে milestone-ভিত্তিক payment, আর payment clear না হওয়া পর্যন্ত শেষ file/source access release না করা।</p>'),
      h(2, 'Marketplace সুরক্ষা বনাম Direct Client', 'marketplace-সুরক্ষা-বনাম-direct-client'),
      p('<p>Fiverr, Upwork, বা Freelancer.com-এর মাধ্যমে payment সাধারণত বেশি নিরাপদ নির্দিষ্টভাবে platform escrow আর একটা formal dispute প্রক্রিয়ার কারণে — একটা track record হওয়ার আগে direct payment-এ যাওয়ার বদলে প্রাথমিক client সম্পর্ক platform-এ রাখার এটা সবচেয়ে শক্তিশালী আসল যুক্তিগুলোর একটা।</p>'),
      h(2, 'কখন ক্ষতি মেনে নেবেন', 'কখন-ক্ষতি-মেনে-নেবেন'),
      p('<p>একটা ছোট পরিমাণের জন্য, payment-এর পিছনে চলতে থাকা সময় আর চাপে পরিমাণটার নিজের চেয়ে বেশি খরচ করতে পারে। সেই বিন্দুটা চিনে এগিয়ে যাওয়া — পাঠ শিখতে শিখতে (সাধারণত: পরের বার একটা deposit নিন) — প্রায়ই একটা দীর্ঘায়িত, ক্লান্তিকর পিছনে-ছোটার চেয়ে বেশি যুক্তিসঙ্গত পছন্দ।</p>'),
      callout('note', '<p>এই কারণেই Contracts lesson আর এই lesson সরাসরি সংযুক্ত — একটা স্পষ্ট লিখিত চুক্তিই যা দিয়ে একটা dispute প্রক্রিয়া, platform-এ বা বাইরে, আসলে মূল্যায়ন করা হয়।</p>', 'এই কারণেই contract গুরুত্বপূর্ণ'),
    ],
  },
})

lessons.push({
  slug: 'taxes-for-freelancers', sortOrder: n++,
  en: {
    title: 'Taxes for Freelancers — The Basics',
    metaTitle: 'Taxes for Freelancers in India | Learn Computer Academy',
    metaDescription: 'A plain-language introduction to how freelance income is taxed in India — income tax, presumptive taxation, and when GST applies to exported services.',
    blocks: [
      p('<p>Freelance income is real, taxable income — it doesn\'t stop being taxable just because it arrived from a foreign client via Payoneer instead of a local employer\'s payroll. This lesson is a plain-language starting map, not a substitute for a real accountant once income becomes meaningful.</p>'),
      h(2, 'Freelance Income Is Business Income'),
      p('<p>For Indian income tax purposes, freelance/consulting income is generally treated as "profits and gains from business or profession," reported and taxed differently from a salaried employee\'s income — this is normal and simply a different filing category, not a red flag.</p>'),
      h(2, 'Presumptive Taxation — A Simplification Worth Knowing'),
      p('<p>India\'s presumptive taxation scheme (Section 44ADA, for eligible professionals) lets many freelancers declare a flat percentage of gross receipts as taxable profit, without needing to maintain detailed books of account — a meaningful simplification for a new freelancer\'s first few years, worth discussing with a tax professional to confirm eligibility.</p>'),
      h(2, 'GST — When It Applies'),
      p('<p>Freelance services sold to clients outside India are generally treated as an "export of services," which is usually zero-rated for GST rather than exempt — meaning GST registration can still be required past a certain annual turnover, even though no GST is actually charged to the foreign client. This threshold and the exact rules are worth confirming directly, since they\'re the kind of detail that changes with policy.</p>'),
      h(2, 'Simple Habits That Make Tax Time Easy'),
      table(['Habit', 'Why it helps'], [
        ['Keep every invoice and payment record', 'The actual paper trail needed for any filing, presumptive or not'],
        ['Track income in INR, not just the foreign currency received', 'Tax is filed in INR — the conversion rate on the day of receipt matters'],
        ['Set aside a percentage of every payment for tax', 'Avoids a large, unplanned-for lump sum owed at filing time'],
        ['Get a real CA once income is meaningful', 'A qualified accountant\'s fee is usually far cheaper than a costly mistake or a missed deduction'],
      ]),
      callout('note', '<p>Tax rules change and depend on individual circumstances — this lesson is a starting orientation, not tax advice. A chartered accountant is worth the cost as soon as freelance income becomes a real, ongoing part of a person\'s finances.</p>', 'Not tax advice'),
    ],
  },
  bn: {
    title: 'Freelancer-দের জন্য Tax — মূল বিষয়',
    metaTitle: 'ভারতে Freelancer-দের জন্য Tax | Learn Computer Academy',
    metaDescription: 'ভারতে freelance income কীভাবে tax করা হয় তার একটা সহজ ভাষায় পরিচিতি — income tax, presumptive taxation, আর export করা service-এ কখন GST প্রযোজ্য।',
    blocks: [
      p('<p>Freelance income একটা আসল, কর-যোগ্য income — এটা একটা স্থানীয় employer-এর payroll-এর বদলে Payoneer-এর মাধ্যমে একটা বিদেশি client থেকে এসেছে বলেই কর-যোগ্য হওয়া বন্ধ হয় না। এই lesson একটা সহজ ভাষায় শুরুর মানচিত্র, income অর্থপূর্ণ হয়ে গেলে একজন আসল accountant-এর বিকল্প না।</p>'),
      h(2, 'Freelance Income হলো Business Income', 'freelance-income-হলো-business-income'),
      p('<p>ভারতীয় income tax-এর উদ্দেশ্যে, freelance/consulting income সাধারণত "business বা profession থেকে profit আর gain" হিসেবে গণ্য হয়, একজন salaried employee-এর income থেকে ভিন্নভাবে রিপোর্ট আর tax করা হয় — এটা স্বাভাবিক আর শুধু একটা ভিন্ন filing category, কোনো red flag না।</p>'),
      h(2, 'Presumptive Taxation — জানার যোগ্য একটা সরলীকরণ', 'presumptive-taxation-জানার-যোগ্য-একটা-সরলীকরণ'),
      p('<p>ভারতের presumptive taxation scheme (Section 44ADA, যোগ্য পেশাজীবীদের জন্য) অনেক freelancer-কে বিস্তারিত account বই রাখার দরকার ছাড়াই gross receipt-এর একটা flat শতাংশকে কর-যোগ্য profit হিসেবে ঘোষণা করতে দেয় — একজন নতুন freelancer-এর প্রথম কয়েক বছরের জন্য একটা অর্থপূর্ণ সরলীকরণ, যোগ্যতা নিশ্চিত করতে একজন tax পেশাজীবীর সাথে আলোচনার যোগ্য।</p>'),
      h(2, 'GST — কখন প্রযোজ্য', 'gst-কখন-প্রযোজ্য'),
      p('<p>ভারতের বাইরের client-দের কাছে বিক্রি করা freelance service সাধারণত একটা "export of services" হিসেবে গণ্য হয়, যা সাধারণত exempt না বরং GST-এর জন্য zero-rated — মানে একটা নির্দিষ্ট বার্ষিক turnover-এর পরে GST registration তখনো দরকার হতে পারে, যদিও বিদেশি client-কে আসলে কোনো GST charge করা হয় না। এই সীমা আর সঠিক নিয়ম সরাসরি নিশ্চিত করার যোগ্য, কারণ এগুলো policy-এর সাথে বদলানো ধরনের detail।</p>'),
      h(2, 'সরল অভ্যাস যা Tax সময় সহজ করে', 'সরল-অভ্যাস-যা-tax-সময়-সহজ-করে'),
      table(['অভ্যাস', 'কেন এটা সাহায্য করে'], [
        ['প্রতিটা invoice আর payment রেকর্ড রাখুন', 'যেকোনো filing-এর জন্য দরকার আসল কাগজের path, presumptive হোক বা না'],
        ['শুধু পাওয়া বিদেশি currency না, INR-এ income track করুন', 'Tax INR-এ filed হয় — পাওয়ার দিনের conversion rate গুরুত্বপূর্ণ'],
        ['প্রতিটা payment থেকে tax-এর জন্য একটা শতাংশ আলাদা রাখুন', 'filing সময়ে একটা বড়, অপরিকল্পিত lump sum পাওনা এড়ায়'],
        ['income অর্থপূর্ণ হয়ে গেলে একজন আসল CA নিন', 'একজন যোগ্য accountant-এর fee সাধারণত একটা ব্যয়বহুল ভুল বা একটা মিস করা deduction-এর চেয়ে অনেক সস্তা'],
      ]),
      callout('note', '<p>Tax নিয়ম বদলায় আর ব্যক্তিগত পরিস্থিতির উপর নির্ভর করে — এই lesson একটা শুরুর orientation, tax পরামর্শ না। freelance income একজন ব্যক্তির অর্থের একটা আসল, চলমান অংশ হয়ে গেলেই একজন chartered accountant-এর খরচ যোগ্য।</p>', 'Tax পরামর্শ না'),
    ],
  },
})

// ═══ PHASE 5 — RUNNING THE WORK ═════════════════════════════════════════

lessons.push({
  slug: 'scope-creep', sortOrder: n++,
  en: {
    title: 'Scope Creep — And How to Stop It',
    metaTitle: 'Scope Creep — And How to Stop It | Learn Computer Academy',
    metaDescription: 'What scope creep is, why it quietly kills margins on fixed-price freelance work, and simple habits that keep a project scoped to what was agreed.',
    blocks: [
      p('<p><b>Scope creep</b> is the slow, often well-meaning expansion of a project past what was originally agreed — one small extra request at a time, none of them seeming worth an argument, until a fixed-price project has quietly doubled in actual hours for the same original fee.</p>'),
      h(2, 'Why It Happens'),
      p('<p>It rarely comes from a dishonest client. It comes from a vague original scope ("a website for my business" instead of a specific page list) and a freelancer who\'s too new or too eager-to-please to push back on the first small ask — by the fifth small ask, the pattern is already set.</p>'),
      h(2, 'The Real Fix Starts Before the Project'),
      p('<p>A clear, written scope in the proposal or contract (covered in the earlier contracts lesson) is the actual defense — it gives a neutral document to point back to instead of a personal opinion about what\'s "fair," which is a much harder conversation to have in the moment.</p>'),
      table(['Situation', 'What to do'], [
        ['A small extra ask ("just one more page")', 'Acknowledge it positively, note it\'s outside the agreed scope, and send a quick separate quote'],
        ['Client insists it\'s "basically the same thing"', 'Point to the written scope document — a shared reference, not a personal judgment call'],
        ['Several small extras adding up over weeks', 'Track them; small unpaid extras compound into real lost hours and real lost income'],
      ]),
      callout('tip', '<p>Frame every scope change as "happy to do that — here\'s a quick add-on quote," not as a flat no. It protects the fee without souring the relationship.</p>', 'Say yes to the ask, not to it being free'),
    ],
  },
  bn: {
    title: 'Scope Creep — আর কীভাবে এটা থামাবেন',
    metaTitle: 'Scope Creep — আর কীভাবে এটা থামাবেন | Learn Computer Academy',
    metaDescription: 'Scope creep কী, কেন এটা চুপচাপ fixed-price freelance কাজের margin মেরে ফেলে, আর সরল অভ্যাস যা একটা প্রজেক্টকে যা agreed হয়েছিল তাতেই সীমাবদ্ধ রাখে।',
    blocks: [
      p('<p><b>Scope creep</b> হলো একটা প্রজেক্টের ধীর, প্রায়ই সৎ-উদ্দেশ্যে সম্প্রসারণ যা মূলত সম্মত হওয়ার বাইরে চলে যায় — একবারে একটা ছোট বাড়তি request, কোনোটাই তর্ক করার মতো মনে হয় না, যতক্ষণ না একটা fixed-price প্রজেক্ট একই মূল fee-তে চুপচাপ আসল ঘণ্টায় দ্বিগুণ হয়ে যায়।</p>'),
      h(2, 'কেন এটা হয়', 'কেন-এটা-হয়'),
      p('<p>এটা কদাচিৎ একজন অসৎ client থেকে আসে। এটা আসে একটা অস্পষ্ট মূল scope থেকে ("আমার ব্যবসার জন্য একটা website" একটা নির্দিষ্ট page তালিকার বদলে) আর একজন freelancer যে প্রথম ছোট request-এ ফিরে তর্ক করার জন্য খুব নতুন বা খুব খুশি-করতে-আগ্রহী — পঞ্চম ছোট request-এর মধ্যে, প্যাটার্নটা ইতিমধ্যে সেট হয়ে গেছে।</p>'),
      h(2, 'আসল সমাধান প্রজেক্ট শুরুর আগেই শুরু হয়', 'আসল-সমাধান-প্রজেক্ট-শুরুর-আগেই-শুরু-হয়'),
      p('<p>Proposal বা contract-এ একটা স্পষ্ট, লিখিত scope (আগের contracts lesson-এ কভার করা) আসল রক্ষা — এটা "fair" কী তার একটা ব্যক্তিগত মতামতের বদলে ফিরে তাকানোর জন্য একটা নিরপেক্ষ document দেয়, যা মুহূর্তে অনেক কঠিন কথোপকথন।</p>'),
      table(['পরিস্থিতি', 'কী করবেন'], [
        ['একটা ছোট বাড়তি request ("শুধু আরেকটা page")', 'ইতিবাচকভাবে স্বীকার করুন, উল্লেখ করুন এটা agreed scope-এর বাইরে, আর একটা দ্রুত আলাদা quote পাঠান'],
        ['Client জোর দেয় এটা "মূলত একই জিনিস"', 'লিখিত scope document-এর দিকে নির্দেশ করুন — একটা শেয়ার করা reference, একটা ব্যক্তিগত রায় না'],
        ['সপ্তাহ ধরে কয়েকটা ছোট বাড়তি জমা হওয়া', 'ট্র্যাক করুন; ছোট unpaid বাড়তি জমে আসল হারানো ঘণ্টা আর আসল হারানো income-এ পরিণত হয়'],
      ]),
      callout('tip', '<p>প্রতিটা scope পরিবর্তনকে "খুশি মনে করবো — এই যে একটা দ্রুত add-on quote" হিসেবে সাজান, একটা সরাসরি না হিসেবে না। এটা সম্পর্ক নষ্ট না করে fee রক্ষা করে।</p>', 'Request-কে হ্যাঁ বলুন, এটা বিনামূল্যে হওয়াকে না'),
    ],
  },
})

lessons.push({
  slug: 'managing-multiple-clients-and-deadlines', sortOrder: n++,
  en: {
    title: 'Managing Multiple Clients and Deadlines',
    metaTitle: 'Managing Multiple Clients and Deadlines | Learn Computer Academy',
    metaDescription: 'Practical habits for juggling several freelance clients at once without missing deadlines or letting one project quietly starve the others.',
    blocks: [
      p('<p>One client is easy to manage in your head. Three or four, each with their own deadline and expectations, is where a system stops being optional.</p>'),
      img('docs/img/freelancing/managing-deadlines', 'An isometric illustration of a person managing a calendar and multiple task cards representing several client projects at once', 1024, 768, 'Juggling several clients works when it runs on a visible system, not memory.'),
      h(2, 'The Core Habits'),
      table(['Habit', 'Why it helps'], [
        ['One shared calendar for every deadline', 'A deadline that only exists in an email thread is a deadline that gets forgotten'],
        ['Block dedicated time per client, not just "whenever"', 'Prevents the loudest client from silently eating every other client\'s hours'],
        ['Build in buffer before each deadline', 'Every project runs into a small surprise — buffer absorbs it without a late delivery'],
        ['Communicate delays the moment they\'re known', 'A client told early can adjust; a client told late just loses trust'],
      ]),
      h(2, 'Simple Tools Are Enough'),
      p('<p>A calendar app and a basic Kanban board (Trello, Notion, or similar — covered more in the next lesson) genuinely cover this need for most solo freelancers. Nothing more elaborate is required until a team is involved.</p>'),
      callout('tip', '<p>When two deadlines truly collide, tell both clients as soon as it\'s known and offer a clear revised date — a proactive heads-up almost always lands better than silence followed by a missed deadline.</p>', 'Collisions happen — hiding them makes it worse'),
    ],
  },
  bn: {
    title: 'একাধিক Client আর Deadline সামলানো',
    metaTitle: 'একাধিক Client আর Deadline সামলানো | Learn Computer Academy',
    metaDescription: 'একসাথে বেশ কয়েকটা freelance client সামলানোর বাস্তব অভ্যাস, কোনো deadline না মিস করে বা একটা প্রজেক্টকে চুপচাপ বাকিগুলোকে অভুক্ত রাখতে না দিয়ে।',
    blocks: [
      p('<p>একটা client মাথায় সামলানো সহজ। তিন বা চারটা, প্রত্যেকের নিজস্ব deadline আর প্রত্যাশা সহ, এখানেই একটা system ঐচ্ছিক থাকা বন্ধ হয়ে যায়।</p>'),
      img('docs/img/freelancing/managing-deadlines', 'একজন ব্যক্তি একটা calendar আর একাধিক task card সামলাচ্ছেন এমন একটা isometric illustration, একসাথে বেশ কয়েকটা client প্রজেক্ট প্রতিনিধিত্ব করছে', 1024, 768, 'বেশ কয়েকটা client সামলানো কাজ করে যখন এটা একটা দৃশ্যমান system-এ চলে, স্মৃতিতে না।'),
      h(2, 'মূল অভ্যাসগুলো', 'মূল-অভ্যাসগুলো'),
      table(['অভ্যাস', 'কেন সাহায্য করে'], [
        ['প্রতিটা deadline-এর জন্য একটা শেয়ার করা calendar', 'একটা deadline যা শুধু একটা email thread-এ থাকে সেটা ভুলে যাওয়া হয়'],
        ['প্রতি client-এর জন্য নির্দিষ্ট সময় block করুন, শুধু "যখন সময় হবে" না', 'সবচেয়ে জোরালো client-কে চুপচাপ বাকি সব client-এর ঘণ্টা খেয়ে ফেলা থেকে আটকায়'],
        ['প্রতিটা deadline-এর আগে buffer রাখুন', 'প্রতিটা প্রজেক্ট একটা ছোট surprise-এর মুখোমুখি হয় — buffer একটা দেরি করা delivery ছাড়াই এটা শুষে নেয়'],
        ['জানার মুহূর্তেই দেরি জানান', 'আগে জানানো একজন client adjust করতে পারে; দেরিতে জানানো একজন client শুধু বিশ্বাস হারায়'],
      ]),
      h(2, 'সরল টুল যথেষ্ট', 'সরল-টুল-যথেষ্ট'),
      p('<p>একটা calendar app আর একটা basic Kanban board (Trello, Notion, বা অনুরূপ — পরের lesson-এ আরো কভার করা) বেশিরভাগ একা কাজ করা freelancer-এর জন্য আসলেই এই প্রয়োজন কভার করে। একটা team জড়িত না হওয়া পর্যন্ত আরো বিস্তারিত কিছুর দরকার নেই।</p>'),
      callout('tip', '<p>যখন দুটো deadline সত্যিই সংঘর্ষে আসে, জানার সাথে সাথে দুই client-কেই বলুন আর একটা স্পষ্ট সংশোধিত date দিন — একটা সক্রিয় আগাম-জানানো প্রায় সবসময় নীরবতার পরে একটা মিস করা deadline-এর চেয়ে ভালো ফল দেয়।</p>', 'সংঘর্ষ হয় — লুকানো এটাকে আরো খারাপ করে'),
    ],
  },
})

lessons.push({
  slug: 'tools-of-the-trade', sortOrder: n++,
  en: {
    title: 'Tools of the Trade',
    metaTitle: 'Freelance Tools of the Trade | Learn Computer Academy',
    metaDescription: 'The small, practical toolkit — time tracking, project boards, e-signatures, and file sharing — that keeps freelance work organized without any bloat.',
    blocks: [
      p('<p>None of this needs to be elaborate. A handful of free or cheap tools cover almost everything a solo freelancer actually needs day to day.</p>'),
      table(['Category', 'Example tools', 'What it\'s for'], [
        ['Time tracking', 'Toggl, Clockify', 'Honest hourly billing, and seeing where time actually goes on fixed-price work too'],
        ['Project/task boards', 'Trello, Notion, Asana', 'One visible place per client for what\'s due and what\'s done — covered in the previous lesson'],
        ['E-signatures', 'DocuSign, Zoho Sign, or a simple typed-signature clause in a PDF', 'Getting a contract genuinely signed without a printer or a scanner'],
        ['File sharing', 'Google Drive, Dropbox', 'One shared folder per client beats email attachments scattered across a year of threads'],
        ['Invoicing', 'Platform-built invoicing, or a simple template — covered in the earlier invoicing lesson', 'A professional, trackable paper trail for every payment'],
      ]),
      h(2, 'Start Free, Upgrade Only When It Actually Hurts'),
      p('<p>Every tool above has a genuinely usable free tier. Paying for a "pro" plan makes sense once a real limit is actually being hit — not before, and not because a tool looks more professional in a screenshot.</p>'),
      callout('note', '<p>The tool matters far less than actually using it consistently. A free spreadsheet used every day beats a paid tool opened once a month.</p>', 'Consistency beats the tool'),
    ],
  },
  bn: {
    title: 'কাজের টুল',
    metaTitle: 'Freelance কাজের টুল | Learn Computer Academy',
    metaDescription: 'ছোট, বাস্তব toolkit — time tracking, project board, e-signature, আর file sharing — যা কোনো বাহুল্য ছাড়াই freelance কাজকে সংগঠিত রাখে।',
    blocks: [
      p('<p>এর কোনোটাই বিস্তারিত হওয়ার দরকার নেই। একমুঠো বিনামূল্যে বা সস্তা টুল প্রতিদিন একজন একা কাজ করা freelancer-এর আসলে যা দরকার তার প্রায় সবকিছু কভার করে।</p>'),
      table(['ক্যাটাগরি', 'উদাহরণ টুল', 'কীসের জন্য'], [
        ['Time tracking', 'Toggl, Clockify', 'সৎ hourly billing, আর fixed-price কাজেও সময় আসলে কোথায় যাচ্ছে তা দেখা'],
        ['Project/task board', 'Trello, Notion, Asana', 'প্রতি client-এর জন্য একটা দৃশ্যমান জায়গা কী বাকি আর কী শেষ তার জন্য — আগের lesson-এ কভার করা'],
        ['E-signature', 'DocuSign, Zoho Sign, বা একটা PDF-এ একটা সরল typed-signature clause', 'কোনো printer বা scanner ছাড়াই একটা contract আসলেই signed করানো'],
        ['File sharing', 'Google Drive, Dropbox', 'এক বছরের thread জুড়ে ছড়িয়ে থাকা email attachment-এর চেয়ে প্রতি client-এর জন্য একটা শেয়ার করা folder ভালো'],
        ['Invoicing', 'Platform-built invoicing, বা একটা সরল template — আগের invoicing lesson-এ কভার করা', 'প্রতিটা payment-এর জন্য একটা professional, ট্র্যাক-করা কাগজের path'],
      ]),
      h(2, 'বিনামূল্যে শুরু করুন, শুধু তখনই upgrade করুন যখন আসলে কষ্ট হয়', 'বিনামূল্যে-শুরু-করুন-শুধু-তখনই-upgrade-করুন-যখন-আসলে-কষ্ট-হয়'),
      p('<p>উপরের প্রতিটা টুলের একটা আসলেই ব্যবহারযোগ্য free tier আছে। একটা "pro" plan-এর জন্য টাকা দেওয়া তখনই বোঝায় যখন একটা আসল সীমা আসলে ছুঁয়ে ফেলা হয়েছে — তার আগে না, আর একটা টুল একটা screenshot-এ বেশি professional দেখায় বলেও না।</p>'),
      callout('note', '<p>টুলটা এটা ধারাবাহিকভাবে ব্যবহার করার চেয়ে অনেক কম গুরুত্বপূর্ণ। প্রতিদিন ব্যবহার করা একটা বিনামূল্যের spreadsheet মাসে একবার খোলা একটা paid টুলের চেয়ে ভালো।</p>', 'ধারাবাহিকতা টুলকে হারায়'),
    ],
  },
})

lessons.push({
  slug: 'handling-revisions', sortOrder: n++,
  en: {
    title: 'Handling Revisions Professionally',
    metaTitle: 'Handling Revisions Professionally | Learn Computer Academy',
    metaDescription: 'The difference between a normal revision and scope creep, how to set sane revision limits, and how to handle revision requests without friction.',
    blocks: [
      p('<p>Revisions are a normal, expected part of client work — no one gets it exactly right on the first pass, and a client is entitled to ask for adjustments to what was actually agreed. The problems start when "revision" quietly becomes a word for "unlimited new work."</p>'),
      h(2, 'Revision vs. Scope Creep — Telling Them Apart'),
      table(['This is a revision', 'This is scope creep'], [
        ['"Can the logo be a bit bigger?"', '"Can you also design a business card while you\'re at it?"'],
        ['"This paragraph doesn\'t quite match the tone we discussed"', '"Can you add a whole new page we didn\'t talk about?"'],
        ['Adjusting something already covered by the agreed scope', 'Adding something never in the agreed scope'],
      ]),
      h(2, 'Setting a Revision Limit Upfront'),
      p('<p>Stating a number of included revision rounds (commonly 2-3) in the proposal or contract isn\'t stingy — it\'s normal industry practice, and it protects a fixed-price project from quietly becoming unbounded. Revisions beyond that limit are simply billed as small add-ons, the same way scope creep is handled.</p>'),
      callout('tip', '<p>Never say "unlimited revisions" in a listing or proposal to sound more appealing — it\'s the single most common way a fixed-price project turns into a loss.</p>', 'A real trap worth naming'),
      h(2, 'Handling a Revision Request Well'),
      p('<p>Acknowledge it without defensiveness, ask a clarifying question if the request is vague, and confirm the turnaround time for the revised version. A revision request isn\'t criticism of the whole project — treating it that way makes an easy, normal exchange feel tense for both sides.</p>'),
    ],
  },
  bn: {
    title: 'Revision পেশাদারভাবে সামলানো',
    metaTitle: 'Revision পেশাদারভাবে সামলানো | Learn Computer Academy',
    metaDescription: 'একটা সাধারণ revision আর scope creep-এর মধ্যে পার্থক্য, কীভাবে যুক্তিসঙ্গত revision সীমা নির্ধারণ করবেন, আর কোনো ঘর্ষণ ছাড়াই revision request সামলানো।',
    blocks: [
      p('<p>Revision client কাজের একটা স্বাভাবিক, প্রত্যাশিত অংশ — কেউ প্রথম পাসেই ঠিক ঠিক করে না, আর একজন client আসলে যা সম্মত হয়েছিল তাতে সমন্বয় চাওয়ার অধিকার রাখে। সমস্যা তখন শুরু হয় যখন "revision" চুপচাপ "সীমাহীন নতুন কাজ"-এর একটা শব্দ হয়ে যায়।</p>'),
      h(2, 'Revision বনাম Scope Creep — আলাদা করে চেনা', 'revision-বনাম-scope-creep-আলাদা-করে-চেনা'),
      table(['এটা একটা revision', 'এটা scope creep'], [
        ['"Logo-টা একটু বড় করা যাবে?"', '"এর সাথে একটা business card-ও design করে দেবেন?"'],
        ['"এই paragraph-টা আমরা আলোচনা করা tone-এর সাথে ঠিক মিলছে না"', '"আমরা কথা বলিনি এমন একটা পুরো নতুন page যোগ করা যাবে?"'],
        ['agreed scope-এ ইতিমধ্যে কভার করা কিছু সমন্বয় করা', 'agreed scope-এ কখনো ছিল না এমন কিছু যোগ করা'],
      ]),
      h(2, 'আগে থেকে একটা Revision সীমা নির্ধারণ করা', 'আগে-থেকে-একটা-revision-সীমা-নির্ধারণ-করা'),
      p('<p>Proposal বা contract-এ অন্তর্ভুক্ত revision round-এর একটা সংখ্যা (সাধারণত ২-৩) বলা কৃপণতা না — এটা স্বাভাবিক industry practice, আর এটা একটা fixed-price প্রজেক্টকে চুপচাপ সীমাহীন হয়ে যাওয়া থেকে রক্ষা করে। সেই সীমার বাইরে revision কেবল ছোট add-on হিসেবে বিল করা হয়, scope creep যেভাবে সামলানো হয় ঠিক সেভাবে।</p>'),
      callout('tip', '<p>বেশি আকর্ষণীয় শোনানোর জন্য কোনো listing বা proposal-এ কখনো "unlimited revisions" বলবেন না — এটা একটা fixed-price প্রজেক্ট ক্ষতিতে পরিণত হওয়ার সবচেয়ে সাধারণ একক উপায়।</p>', 'নাম বলার যোগ্য একটা আসল ফাঁদ'),
      h(2, 'একটা Revision Request ভালোভাবে সামলানো', 'একটা-revision-request-ভালোভাবে-সামলানো'),
      p('<p>প্রতিরক্ষামূলক না হয়ে এটা স্বীকার করুন, request অস্পষ্ট হলে একটা স্পষ্টীকরণ প্রশ্ন করুন, আর সংশোধিত version-এর turnaround time নিশ্চিত করুন। একটা revision request পুরো প্রজেক্টের সমালোচনা না — এভাবে এটা ধরলে একটা সহজ, স্বাভাবিক আদান-প্রদান দুই পক্ষের জন্যই টানটান মনে হয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'delivering-and-closing-a-project', sortOrder: n++,
  en: {
    title: 'Delivering and Closing a Project',
    metaTitle: 'Delivering and Closing a Project | Learn Computer Academy',
    metaDescription: 'A simple final-delivery checklist that gets a project properly signed off, paid, and closed — and why the closing moment is the best time to ask for a review.',
    blocks: [
      p('<p>How a project ends shapes whether a client comes back and whether they leave a good review — closing well is worth as much attention as starting well.</p>'),
      h(2, 'A Simple Closing Checklist'),
      table(['Step', 'Why it matters'], [
        ['Confirm final deliverables against the original scope', 'Catches any gap before the client has to point it out'],
        ['Get explicit sign-off ("looks good, approved")', 'A clear, written approval — not silence — is what actually closes a project'],
        ['Send the final invoice (or release the milestone payment)', 'Covered in the earlier invoicing lesson — do this immediately, not "eventually"'],
        ['Hand over all files and access cleanly', 'Source files, credentials, admin access — organized, not scattered across old messages'],
        ['Ask for a review or testimonial', 'The moment right after a happy delivery is the best time this will ever come — covered in depth next lesson'],
      ]),
      h(2, 'Why the Ending Matters as Much as the Start'),
      p('<p>A client\'s final impression is what they remember when deciding whether to hire again or refer someone — a project that delivers great work but ends messily (a slow handover, an awkward final invoice) leaves a worse impression than the actual work quality deserves.</p>'),
      callout('tip', '<p>A short, warm closing message — thanking the client and noting availability for future work — costs a minute and quietly keeps the door open for repeat business.</p>', 'A small habit worth keeping'),
    ],
  },
  bn: {
    title: 'একটা প্রজেক্ট Deliver আর Close করা',
    metaTitle: 'একটা প্রজেক্ট Deliver আর Close করা | Learn Computer Academy',
    metaDescription: 'একটা সরল final-delivery checklist যা একটা প্রজেক্টকে ঠিকভাবে sign off, পরিশোধ, আর close করায় — আর কেন closing মুহূর্ত একটা review চাওয়ার সেরা সময়।',
    blocks: [
      p('<p>একটা প্রজেক্ট কীভাবে শেষ হয় তা ঠিক করে একজন client ফিরে আসবে কিনা আর তারা একটা ভালো review রেখে যাবে কিনা — ভালোভাবে শুরু করার মতোই ভালোভাবে close করাও মনোযোগের যোগ্য।</p>'),
      h(2, 'একটা সরল Closing Checklist', 'একটা-সরল-closing-checklist'),
      table(['ধাপ', 'কেন গুরুত্বপূর্ণ'], [
        ['মূল scope-এর বিরুদ্ধে final deliverable নিশ্চিত করুন', 'client-কে নির্দেশ করতে হওয়ার আগেই যেকোনো ফাঁক ধরে ফেলে'],
        ['স্পষ্ট sign-off পান ("ভালো লাগছে, approved")', 'একটা স্পষ্ট, লিখিত approval — নীরবতা না — যা আসলে একটা প্রজেক্ট close করে'],
        ['Final invoice পাঠান (বা milestone payment release করুন)', 'আগের invoicing lesson-এ কভার করা — এটা সাথে সাথে করুন, "কোনো এক সময়" না'],
        ['সব file আর access পরিষ্কারভাবে হস্তান্তর করুন', 'Source file, credential, admin access — সংগঠিত, পুরনো message জুড়ে ছড়িয়ে না'],
        ['একটা review বা testimonial চান', 'একটা খুশি delivery-র ঠিক পরের মুহূর্তটা এটা আসার সেরা সময় — পরের lesson-এ বিস্তারিত কভার করা'],
      ]),
      h(2, 'কেন শেষটা শুরুর মতোই গুরুত্বপূর্ণ', 'কেন-শেষটা-শুরুর-মতোই-গুরুত্বপূর্ণ'),
      p('<p>একজন client-এর শেষ ছাপটাই তারা মনে রাখে আবার নিয়োগ দেবে কিনা বা কাউকে refer করবে কিনা ঠিক করার সময় — দারুণ কাজ deliver করা কিন্তু এলোমেলোভাবে শেষ হওয়া একটা প্রজেক্ট (একটা ধীর handover, একটা বিশ্রী final invoice) আসল কাজের মানের চেয়ে খারাপ ছাপ রেখে যায়।</p>'),
      callout('tip', '<p>একটা ছোট, উষ্ণ closing message — client-কে ধন্যবাদ জানিয়ে আর ভবিষ্যতের কাজের জন্য availability উল্লেখ করে — এক মিনিট খরচ করে আর repeat business-এর জন্য দরজা চুপচাপ খোলা রাখে।</p>', 'রাখার যোগ্য একটা ছোট অভ্যাস'),
    ],
  },
})

// ═══ PHASE 6 — GROWING ══════════════════════════════════════════════════

lessons.push({
  slug: 'getting-reviews-that-help', sortOrder: n++,
  en: {
    title: 'Getting Reviews That Actually Help',
    metaTitle: 'Getting Reviews That Actually Help | Learn Computer Academy',
    metaDescription: 'When and how to ask for a platform review without being pushy, and how to respond professionally when a review is anything less than glowing.',
    blocks: [
      p('<p>On a marketplace platform, reviews are close to the single biggest factor in whether a new client picks one profile over another — they matter more than almost anything else covered so far in this course.</p>'),
      img('docs/img/freelancing/reviews-mockup', 'A realistic mockup of a freelance platform review section showing star ratings, written client feedback, and a completed-projects count', 1024, 768, 'Star ratings and written feedback are often the very first thing a new client actually reads.'),
      h(2, 'When to Ask'),
      p('<p>Right after final delivery and sign-off (see the previous lesson) — while the good feeling of a finished project is fresh, not weeks later when the request feels random and the client has moved on mentally.</p>'),
      h(2, 'How to Ask Without Sounding Pushy'),
      p('<p>A short, specific message works best: thank the client, mention that reviews genuinely help a freelancer\'s business grow, and make it easy — a direct platform link, not a vague "if you have time." Most happy clients are glad to leave one; they simply forget unless asked.</p>'),
      h(2, 'Handling a Less-Than-Perfect Review'),
      table(['Situation', 'What to do'], [
        ['A fair but critical review', 'Respond professionally and briefly — acknowledge the point, avoid defensiveness; future clients read the response too'],
        ['An unfair or inaccurate review', 'Most platforms have a dispute/appeal process — use it calmly, with evidence, rather than arguing publicly with the client'],
        ['One bad review among many good ones', 'Resist the urge to fixate — a strong overall pattern outweighs a single outlier to most clients reading it'],
      ]),
      callout('note', '<p>Never offer a discount or refund explicitly in exchange for a positive review — most platforms prohibit it, and it undermines the honesty a review system depends on.</p>', 'A boundary worth respecting'),
    ],
  },
  bn: {
    title: 'আসলে সাহায্য করে এমন Review পাওয়া',
    metaTitle: 'আসলে সাহায্য করে এমন Review পাওয়া | Learn Computer Academy',
    metaDescription: 'জোর না করে কখন আর কীভাবে একটা platform review চাইবেন, আর একটা review উজ্জ্বলের চেয়ে কম হলে কীভাবে পেশাদারভাবে সাড়া দেবেন।',
    blocks: [
      p('<p>একটা marketplace platform-এ, একজন নতুন client একটা profile-এর বদলে আরেকটা বেছে নেবে কিনা তার একক সবচেয়ে বড় factor-এর কাছাকাছি review — এই কোর্সে এখন পর্যন্ত কভার করা প্রায় সবকিছুর চেয়ে এগুলো বেশি গুরুত্বপূর্ণ।</p>'),
      img('docs/img/freelancing/reviews-mockup', 'star rating, লিখিত client feedback, আর একটা completed-projects count দেখানো একটা freelance platform review section-এর একটা বাস্তব mockup', 1024, 768, 'Star rating আর লিখিত feedback প্রায়ই আসলে একজন নতুন client প্রথম যা পড়ে।'),
      h(2, 'কখন চাইবেন', 'কখন-চাইবেন'),
      p('<p>final delivery আর sign-off-এর ঠিক পরে (আগের lesson দেখুন) — যখন একটা শেষ হওয়া প্রজেক্টের ভালো লাগাটা এখনো তাজা, সপ্তাহ পরে না যখন request-টা random মনে হয় আর client মানসিকভাবে এগিয়ে গেছে।</p>'),
      h(2, 'জোরাজুরি না মনে হয়ে কীভাবে চাইবেন', 'জোরাজুরি-না-মনে়-হয়ে-কীভাবে-চাইবেন'),
      p('<p>একটা ছোট, নির্দিষ্ট message সবচেয়ে ভালো কাজ করে: client-কে ধন্যবাদ দিন, উল্লেখ করুন review আসলেই একজন freelancer-এর ব্যবসা বাড়তে সাহায্য করে, আর এটা সহজ করুন — একটা সরাসরি platform link, একটা অস্পষ্ট "সময় থাকলে" না। বেশিরভাগ খুশি client একটা রেখে যেতে খুশি; তারা শুধু না চাওয়া পর্যন্ত ভুলে যায়।</p>'),
      h(2, 'একটা কম-নিখুঁত Review সামলানো', 'একটা-কম-নিখুঁত-review-সামলানো'),
      table(['পরিস্থিতি', 'কী করবেন'], [
        ['একটা fair কিন্তু সমালোচনামূলক review', 'পেশাদারভাবে আর সংক্ষেপে সাড়া দিন — পয়েন্টটা স্বীকার করুন, প্রতিরক্ষামূলক হওয়া এড়ান; ভবিষ্যতের client সেই response-ও পড়ে'],
        ['একটা অন্যায্য বা ভুল review', 'বেশিরভাগ platform-এর একটা dispute/appeal process আছে — client-এর সাথে প্রকাশ্যে তর্ক করার বদলে শান্তভাবে, প্রমাণ সহ এটা ব্যবহার করুন'],
        ['অনেকগুলো ভালোর মধ্যে একটা খারাপ review', 'আটকে থাকার তাড়না প্রতিরোধ করুন — এটা পড়া বেশিরভাগ client-এর কাছে একটা শক্তিশালী সার্বিক প্যাটার্ন একক outlier-কে ছাড়িয়ে যায়'],
      ]),
      callout('note', '<p>একটা ইতিবাচক review-এর বিনিময়ে কখনো স্পষ্টভাবে একটা discount বা refund দেবেন না — বেশিরভাগ platform এটা নিষিদ্ধ করে, আর এটা একটা review system যে সততার উপর নির্ভর করে তা ক্ষুণ্ণ করে।</p>', 'সম্মান করার যোগ্য একটা সীমা'),
    ],
  },
})

lessons.push({
  slug: 'repeat-clients-and-retainers', sortOrder: n++,
  en: {
    title: 'Repeat Clients and Retainers',
    metaTitle: 'Repeat Clients and Retainers | Learn Computer Academy',
    metaDescription: 'Why a repeat client is worth more than a new one, and how a simple monthly retainer turns one-off projects into stable, recurring income.',
    blocks: [
      p('<p>Finding a new client takes real time and effort every single time. A client who returns skips all of that — repeat business is quietly the most efficient kind of freelance income there is.</p>'),
      h(2, 'Why Repeat Clients Are Worth Extra Effort'),
      table(['Advantage', 'Why it matters'], [
        ['No proposal or pitching needed', 'The trust and vetting work is already done'],
        ['Faster projects', 'Less time explaining context they already know'],
        ['More predictable income', 'A known, recurring source beats constantly finding the next one-off job'],
      ]),
      h(2, 'Staying on a Past Client\'s Radar'),
      p('<p>A brief, genuine check-in every few months — not a sales pitch, just a real "how\'s the site doing?" — keeps a freelancer top of mind for the next piece of work without feeling like a cold pitch.</p>'),
      h(2, 'What a Retainer Actually Is'),
      p('<p>A <b>retainer</b> is a fixed monthly fee for an agreed, ongoing amount of work or availability — say, 10 hours a month of website updates, or a set number of social posts, billed the same every month regardless of small week-to-week variation. It trades a little flexibility for real income stability, and it\'s usually only offered once trust with a client is already established.</p>'),
      h(2, 'When to Suggest One'),
      p('<p>A client who keeps coming back with small, similar requests every month is a natural retainer candidate — proposing it isn\'t pushy, it\'s solving a pattern that\'s already happening informally with a cleaner, more predictable arrangement for both sides.</p>'),
      callout('tip', '<p>A small handful of retainer clients is what lets many established freelancers stop chasing new work constantly — it\'s worth building toward, not just accepting if it happens to come up.</p>', 'The real long-term goal'),
    ],
  },
  bn: {
    title: 'Repeat Client আর Retainer',
    metaTitle: 'Repeat Client আর Retainer | Learn Computer Academy',
    metaDescription: 'কেন একজন repeat client একজন নতুনের চেয়ে বেশি মূল্যবান, আর কীভাবে একটা সরল মাসিক retainer এককালীন প্রজেক্টকে স্থিতিশীল, পুনরাবৃত্ত income-এ পরিণত করে।',
    blocks: [
      p('<p>একজন নতুন client খুঁজতে প্রতিবার আসল সময় আর শ্রম লাগে। একজন client যে ফিরে আসে সেই সবটা এড়িয়ে যায় — repeat business চুপচাপ সবচেয়ে দক্ষ ধরনের freelance income।</p>'),
      h(2, 'কেন Repeat Client বাড়তি শ্রমের যোগ্য', 'কেন-repeat-client-বাড়তি-শ্রমের-যোগ্য'),
      table(['সুবিধা', 'কেন গুরুত্বপূর্ণ'], [
        ['কোনো proposal বা pitching লাগে না', 'বিশ্বাস আর vetting কাজ ইতিমধ্যে হয়ে গেছে'],
        ['দ্রুত প্রজেক্ট', 'তারা ইতিমধ্যে জানা context ব্যাখ্যা করতে কম সময় লাগে'],
        ['বেশি অনুমানযোগ্য income', 'একটা পরিচিত, পুনরাবৃত্ত উৎস প্রতিনিয়ত পরের এককালীন কাজ খোঁজার চেয়ে ভালো'],
      ]),
      h(2, 'একজন পুরনো Client-এর Radar-এ থাকা', 'একজন-পুরনো-client-এর-radar-এ-থাকা'),
      p('<p>প্রতি কয়েক মাসে একটা সংক্ষিপ্ত, সত্যিকারের check-in — কোনো sales pitch না, শুধু একটা আসল "site কেমন চলছে?" — একটা freelancer-কে কোল্ড pitch-এর মতো মনে না করিয়ে পরের কাজের জন্য মাথায় শীর্ষে রাখে।</p>'),
      h(2, 'একটা Retainer আসলে কী', 'একটা-retainer-আসলে-কী'),
      p('<p>একটা <b>retainer</b> হলো সম্মত, চলমান পরিমাণ কাজ বা availability-এর জন্য একটা fixed মাসিক fee — যেমন, মাসে ১০ ঘণ্টা website update, বা একটা নির্দিষ্ট সংখ্যক social post, ছোটখাটো সাপ্তাহিক ভিন্নতা নির্বিশেষে প্রতি মাসে একই রকম বিল করা। এটা কিছুটা flexibility-এর বদলে আসল income স্থিতিশীলতা দেয়, আর সাধারণত শুধু একজন client-এর সাথে বিশ্বাস ইতিমধ্যে প্রতিষ্ঠিত হয়ে গেলেই দেওয়া হয়।</p>'),
      h(2, 'কখন একটা প্রস্তাব দেবেন', 'কখন-একটা-প্রস্তাব-দেবেন'),
      p('<p>একজন client যে প্রতি মাসে ছোট, একই ধরনের request নিয়ে ফিরে আসতে থাকে সে একটা স্বাভাবিক retainer candidate — এটা প্রস্তাব করা জোরাজুরি না, এটা একটা প্যাটার্ন সমাধান করা যা ইতিমধ্যে অনানুষ্ঠানিকভাবে ঘটছে, দুই পক্ষের জন্যই একটা পরিষ্কার, বেশি অনুমানযোগ্য ব্যবস্থা দিয়ে।</p>'),
      callout('tip', '<p>একমুঠো retainer client-ই অনেক প্রতিষ্ঠিত freelancer-কে প্রতিনিয়ত নতুন কাজ তাড়া করা থামাতে দেয় — এটা এলে শুধু গ্রহণ করার বদলে এর দিকে গড়ে তোলার যোগ্য।</p>', 'আসল দীর্ঘমেয়াদী লক্ষ্য'),
    ],
  },
})

lessons.push({
  slug: 'raising-your-rates', sortOrder: n++,
  en: {
    title: 'Raising Your Rates',
    metaTitle: 'Raising Your Rates | Learn Computer Academy',
    metaDescription: 'The real signals that it\'s time to raise a freelance rate, and how to actually communicate an increase to new and existing clients.',
    blocks: [
      p('<p>Rates set on day one, as a new freelancer with no track record, are not meant to be permanent — they\'re a starting point (see the earlier pricing lesson). Recognizing when to move past them is its own skill.</p>'),
      h(2, 'Signals It\'s Time'),
      table(['Signal', 'What it means'], [
        ['Consistently fully booked, turning down work', 'Demand now exceeds supply at the current rate — the market is telling you something'],
        ['A strong, growing portfolio and review history', 'The original "no track record" rate no longer matches the actual risk a client takes on'],
        ['It\'s been 6-12 months at the same rate', 'A reasonable default review cadence even without another specific trigger'],
      ]),
      h(2, 'Raising Rates for New Clients'),
      p('<p>The easiest kind of raise — simply update the listed rate. No conversation or negotiation is needed since no existing relationship or expectation is being changed.</p>'),
      h(2, 'Raising Rates for Existing Clients'),
      p('<p>Give real notice (a month is common), state it plainly and confidently rather than apologetically, and briefly note the value delivered so far. A short, direct message works better than a long justification: "Starting [date], my rate will be [X] to reflect [brief reason]. Let me know if you\'d like to discuss."</p>'),
      callout('tip', '<p>A "grandfather" period — extending the old rate for a few more months for a long-standing client — softens the change and rarely costs much, since a genuinely loyal client is unlikely to leave over a fair, well-communicated increase anyway.</p>', 'A softer landing, if it\'s wanted'),
    ],
  },
  bn: {
    title: 'আপনার Rate বাড়ানো',
    metaTitle: 'আপনার Rate বাড়ানো | Learn Computer Academy',
    metaDescription: 'একটা freelance rate বাড়ানোর সময় এসেছে তার আসল সংকেত, আর আসলে কীভাবে নতুন আর বিদ্যমান client-দের কাছে একটা বৃদ্ধি জানাবেন।',
    blocks: [
      p('<p>প্রথম দিনে সেট করা rate, কোনো track record ছাড়া একজন নতুন freelancer হিসেবে, স্থায়ী হওয়ার কথা না — এগুলো একটা শুরুর বিন্দু (আগের pricing lesson দেখুন)। কখন এগুলো ছাড়িয়ে যাবেন তা চেনা নিজস্ব একটা দক্ষতা।</p>'),
      h(2, 'সময় হয়ে গেছে এমন সংকেত', 'সময়-হয়ে-গেছে-এমন-সংকেত'),
      table(['সংকেত', 'এটা কী মানে'], [
        ['ধারাবাহিকভাবে সম্পূর্ণ booked, কাজ ফিরিয়ে দিচ্ছেন', 'এখন চাহিদা বর্তমান rate-এ সরবরাহ ছাড়িয়ে গেছে — বাজার আপনাকে কিছু বলছে'],
        ['একটা শক্তিশালী, বাড়তে থাকা portfolio আর review history', 'মূল "কোনো track record নেই" rate আর একজন client যে আসল ঝুঁকি নেয় তার সাথে মেলে না'],
        ['একই rate-এ ৬-১২ মাস হয়ে গেছে', 'আরেকটা নির্দিষ্ট trigger ছাড়াও একটা যুক্তিসঙ্গত default review cadence'],
      ]),
      h(2, 'নতুন Client-দের জন্য Rate বাড়ানো', 'নতুন-client-দের-জন্য-rate-বাড়ানো'),
      p('<p>বাড়ানোর সবচেয়ে সহজ ধরন — শুধু listed rate update করুন। কোনো কথোপকথন বা negotiation দরকার নেই কারণ কোনো বিদ্যমান সম্পর্ক বা প্রত্যাশা বদলানো হচ্ছে না।</p>'),
      h(2, 'বিদ্যমান Client-দের জন্য Rate বাড়ানো', 'বিদ্যমান-client-দের-জন্য-rate-বাড়ানো'),
      p('<p>আসল নোটিশ দিন (এক মাস সাধারণ), ক্ষমাপ্রার্থীর মতো না বরং সরলভাবে আর আত্মবিশ্বাসের সাথে বলুন, আর এখন পর্যন্ত দেওয়া value সংক্ষেপে উল্লেখ করুন। একটা লম্বা justification-এর চেয়ে একটা ছোট, সরাসরি message ভালো কাজ করে: "[তারিখ] থেকে, আমার rate হবে [X] [সংক্ষিপ্ত কারণ] প্রতিফলিত করতে। আলোচনা করতে চাইলে জানাবেন।"</p>'),
      callout('tip', '<p>একটা "grandfather" সময়কাল — একজন দীর্ঘদিনের client-এর জন্য আরো কয়েক মাস পুরনো rate বাড়িয়ে দেওয়া — পরিবর্তনটা নরম করে আর কদাচিৎ বেশি খরচ করে, কারণ একজন সত্যিকারের অনুগত client একটা fair, ভালোভাবে জানানো বৃদ্ধির জন্য চলে যাওয়ার সম্ভাবনা কম।</p>', 'চাইলে একটা নরম অবতরণ'),
    ],
  },
})

lessons.push({
  slug: 'freelancer-to-agency', sortOrder: n++,
  en: {
    title: 'From Freelancer to Agency',
    metaTitle: 'From Freelancer to Agency | Learn Computer Academy',
    metaDescription: 'The signs it might be time to stop working alone, the difference between subcontracting and hiring, and the real risks of growing past solo freelancing.',
    blocks: [
      p('<p>Not every freelancer wants to grow beyond working solo — that\'s a completely valid choice. For those who do, this is what the next step usually looks like.</p>'),
      img('docs/img/freelancing/freelancer-to-agency', 'An isometric illustration of a single freelancer figure growing into a small team of people working together at desks, symbolizing the transition to an agency', 1024, 768, 'Turning down work every week is often the first real signal that solo capacity has been reached.'),
      h(2, 'The Signal It\'s Time'),
      p('<p>Consistently turning down good work, not because it\'s a bad fit but purely because there aren\'t enough hours, is the clearest sign that demand has outgrown solo capacity.</p>'),
      h(2, 'Subcontracting vs. Hiring'),
      table(['Approach', 'How it works', 'Best for'], [
        ['Subcontracting', 'Bring in another freelancer for a specific project or task, paid per project, no ongoing commitment', 'Testing growth without a fixed cost — the natural first step'],
        ['Hiring', 'A part-time or full-time team member with an ongoing salary and role', 'Once workflow is consistent enough to justify a fixed, recurring cost'],
      ]),
      h(2, 'The Real Risks'),
      p('<p>Quality control gets harder once someone else\'s work carries your name to the client — a clear review process before anything ships is non-negotiable. The client relationship itself can also get diluted if a client who hired "you" specifically starts working mostly with someone else, which is why introducing team involvement clearly and early matters.</p>'),
      callout('note', '<p>This is a genuinely optional path, not a required "next level" of freelancing — plenty of experienced, well-paid freelancers stay solo by choice, for the exact independence covered in the very first lesson of this course.</p>', 'Solo is a complete, valid destination'),
    ],
  },
  bn: {
    title: 'Freelancer থেকে Agency-তে',
    metaTitle: 'Freelancer থেকে Agency-তে | Learn Computer Academy',
    metaDescription: 'একা কাজ করা থামানোর সময় হতে পারে এমন সংকেত, subcontracting আর hiring-এর মধ্যে পার্থক্য, আর একা freelancing ছাড়িয়ে বাড়ার আসল ঝুঁকি।',
    blocks: [
      p('<p>প্রতিটা freelancer একা কাজ করা ছাড়িয়ে বাড়তে চায় না — এটা সম্পূর্ণভাবে বৈধ একটা পছন্দ। যারা চায় তাদের জন্য, পরের ধাপটা সাধারণত এমন দেখায়।</p>'),
      img('docs/img/freelancing/freelancer-to-agency', 'একটা একক freelancer figure ডেস্কে একসাথে কাজ করা একটা ছোট team of people-এ বেড়ে ওঠার একটা isometric illustration, agency-তে রূপান্তর প্রতীকী করছে', 1024, 768, 'প্রতি সপ্তাহে কাজ ফিরিয়ে দেওয়া প্রায়ই একা capacity পৌঁছে গেছে তার প্রথম আসল সংকেত।'),
      h(2, 'সময় হয়েছে তার সংকেত', 'সময়-হয়েছে-তার-সংকেত'),
      p('<p>ধারাবাহিকভাবে ভালো কাজ ফিরিয়ে দেওয়া, এটা খারাপ মানানসই বলে না বরং শুধু যথেষ্ট ঘণ্টা নেই বলে, সবচেয়ে স্পষ্ট সংকেত যে চাহিদা একা capacity ছাড়িয়ে গেছে।</p>'),
      h(2, 'Subcontracting বনাম Hiring', 'subcontracting-বনাম-hiring'),
      table(['পদ্ধতি', 'কীভাবে কাজ করে', 'সবচেয়ে ভালো যার জন্য'], [
        ['Subcontracting', 'একটা নির্দিষ্ট প্রজেক্ট বা task-এর জন্য আরেকজন freelancer আনা, প্রতি প্রজেক্ট পরিশোধ, কোনো চলমান প্রতিশ্রুতি না', 'কোনো fixed খরচ ছাড়াই বৃদ্ধি পরীক্ষা করা — স্বাভাবিক প্রথম ধাপ'],
        ['Hiring', 'একটা চলমান salary আর role সহ একজন part-time বা full-time team সদস্য', 'একবার workflow একটা fixed, পুনরাবৃত্ত খরচ যুক্তিসঙ্গত করার মতো ধারাবাহিক হয়ে গেলে'],
      ]),
      h(2, 'আসল ঝুঁকি', 'আসল-ঝুঁকি'),
      p('<p>একবার অন্য কারো কাজ client-এর কাছে আপনার নাম বহন করলে quality control কঠিন হয়ে যায় — কিছু ship হওয়ার আগে একটা স্পষ্ট review প্রক্রিয়া অপরিহার্য। Client সম্পর্কও দুর্বল হতে পারে যদি একজন client যে নির্দিষ্টভাবে "আপনাকে" নিয়োগ দিয়েছিল তারা মূলত অন্য কারো সাথে কাজ শুরু করে, এই কারণেই team জড়িত থাকা স্পষ্টভাবে আর তাড়াতাড়ি জানানো গুরুত্বপূর্ণ।</p>'),
      callout('note', '<p>এটা আসলেই একটা ঐচ্ছিক path, freelancing-এর একটা বাধ্যতামূলক "পরবর্তী স্তর" না — অনেক অভিজ্ঞ, ভালো-বেতনের freelancer এই কোর্সের একেবারে প্রথম lesson-এ কভার করা ঠিক সেই স্বাধীনতার জন্য পছন্দ করে একা থাকে।</p>', 'একা থাকা একটা সম্পূর্ণ, বৈধ গন্তব্য'),
    ],
  },
})

// ═══ PHASE 7 — MINDSET ══════════════════════════════════════════════════

lessons.push({
  slug: 'avoiding-burnout', sortOrder: n++,
  en: {
    title: 'Avoiding Burnout',
    metaTitle: 'Avoiding Freelance Burnout | Learn Computer Academy',
    metaDescription: 'Why freelance burnout happens more easily than employee burnout, and practical boundaries that keep freelance work sustainable long-term.',
    blocks: [
      p('<p>With no manager setting hours and no colleague noticing when someone\'s overworked, freelancing removes most of the built-in guardrails a regular job has against burnout — it has to be self-imposed instead.</p>'),
      img('docs/img/freelancing/avoiding-burnout', 'An isometric illustration of a person taking a calm break away from their laptop, representing healthy work-life boundaries for a freelancer', 1024, 768, 'The boundaries a job used to set by default now have to be set on purpose.'),
      h(2, 'Why It Happens Faster in Freelancing'),
      table(['Cause', 'Why it\'s worse for a freelancer'], [
        ['"Always on" availability', 'A client message at 11pm feels urgent to answer when there\'s no separation between work and personal time'],
        ['Feast-or-famine overwork', 'Every "yes" during a busy stretch feels necessary in case the next slow stretch runs long (covered in depth next lesson)'],
        ['No coworker to notice', 'Overwork in an office gets flagged by someone else; alone, it often isn\'t noticed until it\'s already a problem'],
      ]),
      h(2, 'Practical Boundaries That Actually Work'),
      p('<p>Set real working hours and communicate them to clients, so an off-hours message doesn\'t create an implicit obligation to answer immediately. Take real, full days off — not just fewer hours, actual days with no client contact. Learn to say no to a project or a deadline that doesn\'t fit, rather than treating every "yes" as required to keep income flowing.</p>'),
      h(2, 'Warning Signs Worth Taking Seriously'),
      p('<p>Dreading opening messages from a specific client, working through weekends as a default rather than an exception, and a growing sense that no amount of finished work ever feels like enough — these are signals to actually adjust, not just push through.</p>'),
      callout('tip', '<p>A day off is not the same as "no income that day" — treat it as a real cost of doing sustainable business, the same way rent or a subscription is, not as wasted time.</p>', 'Rest is a real expense, not a luxury'),
    ],
  },
  bn: {
    title: 'Burnout এড়ানো',
    metaTitle: 'Freelance Burnout এড়ানো | Learn Computer Academy',
    metaDescription: 'কেন freelance burnout একজন employee-এর burnout-এর চেয়ে বেশি সহজে হয়, আর বাস্তব সীমা যা দীর্ঘমেয়াদে freelance কাজকে টেকসই রাখে।',
    blocks: [
      p('<p>কোনো manager সময় ঠিক না করা আর কোনো সহকর্মী কেউ overworked হলে লক্ষ্য না করার সাথে, freelancing burnout-এর বিরুদ্ধে একটা নিয়মিত চাকরির বেশিরভাগ built-in guardrail সরিয়ে দেয় — এটা পরিবর্তে নিজে থেকে চাপাতে হয়।</p>'),
      img('docs/img/freelancing/avoiding-burnout', 'একজন ব্যক্তি ল্যাপটপ থেকে দূরে একটা শান্ত বিরতি নিচ্ছেন এমন একটা isometric illustration, একজন freelancer-এর জন্য স্বাস্থ্যকর work-life সীমা প্রতিনিধিত্ব করছে', 1024, 768, 'একটা চাকরি default হিসেবে যে সীমা ঠিক করতো তা এখন উদ্দেশ্যমূলকভাবে ঠিক করতে হয়।'),
      h(2, 'কেন এটা Freelancing-এ দ্রুত হয়', 'কেন-এটা-freelancing-এ-দ্রুত-হয়'),
      table(['কারণ', 'কেন এটা একজন freelancer-এর জন্য খারাপ'], [
        ['"সবসময় চালু" availability', 'কাজ আর ব্যক্তিগত সময়ের মধ্যে কোনো আলাদাকরণ না থাকলে রাত ১১টায় একটা client message উত্তর দেওয়ার জরুরি মনে হয়'],
        ['Feast-or-famine overwork', 'একটা ব্যস্ত সময়ে প্রতিটা "হ্যাঁ" দরকারি মনে হয় যদি পরের ধীর সময়টা লম্বা হয় সেই ভয়ে (পরের lesson-এ বিস্তারিত কভার করা)'],
        ['লক্ষ্য করার কোনো সহকর্মী নেই', 'একটা office-এ overwork অন্য কেউ flag করে; একা, এটা প্রায়ই ইতিমধ্যে একটা সমস্যা না হওয়া পর্যন্ত লক্ষ্য করা হয় না'],
      ]),
      h(2, 'বাস্তব সীমা যা আসলে কাজ করে', 'বাস্তব-সীমা-যা-আসলে-কাজ-করে'),
      p('<p>আসল working hours ঠিক করুন আর client-দের জানান, যাতে off-hours message সাথে সাথে উত্তর দেওয়ার একটা প্রচ্ছন্ন বাধ্যবাধকতা তৈরি না করে। আসল, পুরো দিন ছুটি নিন — শুধু কম ঘণ্টা না, কোনো client যোগাযোগ ছাড়া আসল দিন। এমন একটা প্রজেক্ট বা deadline-এ না বলতে শিখুন যা মানানসই না, income প্রবাহিত রাখতে প্রতিটা "হ্যাঁ"-কে বাধ্যতামূলক মনে করার বদলে।</p>'),
      h(2, 'গুরুত্ব সহকারে নেওয়ার মতো সতর্কতার সংকেত', 'গুরুত্ব-সহকারে-নেওয়ার-মতো-সতর্কতার-সংকেত'),
      p('<p>একটা নির্দিষ্ট client থেকে message খোলার ভয় পাওয়া, ব্যতিক্রমের বদলে default হিসেবে সপ্তাহান্তে কাজ করা, আর একটা বাড়তে থাকা অনুভূতি যে কোনো পরিমাণ শেষ করা কাজই কখনো যথেষ্ট মনে হয় না — এগুলো আসলে সমন্বয় করার সংকেত, শুধু জোর করে চালিয়ে যাওয়ার না।</p>'),
      callout('tip', '<p>একটা ছুটির দিন "সেদিন কোনো income না"-এর মতো না — এটাকে টেকসই ব্যবসা করার একটা আসল খরচ হিসেবে ধরুন, ঠিক যেভাবে ভাড়া বা একটা subscription হয়, নষ্ট হওয়া সময় হিসেবে না।</p>', 'বিশ্রাম একটা আসল খরচ, বিলাসিতা না'),
    ],
  },
})

lessons.push({
  slug: 'feast-or-famine-income', sortOrder: n++,
  en: {
    title: 'Feast-or-Famine Income',
    metaTitle: 'Feast-or-Famine Freelance Income | Learn Computer Academy',
    metaDescription: 'Why freelance income swings between too much work and too little, and the practical habits — an emergency fund, a steady pipeline, self-paid salary — that smooth it out.',
    blocks: [
      p('<p>The <b>feast-or-famine cycle</b> — months of overwhelming busyness followed by unsettling quiet — is one of the most common complaints among freelancers, and almost always has the same root cause.</p>'),
      h(2, 'Why It Happens'),
      p('<p>During a busy "feast" stretch, there\'s no time left to find the next client — all the effort goes into delivering current work. Once that work finishes, there\'s nothing lined up, and a "famine" stretch follows. The cycle repeats because client-finding only happens during the quiet periods, exactly when it feels least urgent and hardest to focus on.</p>'),
      h(2, 'Breaking the Cycle — Always Be Finding, Even When Busy'),
      p('<p>The real fix is spending a small, consistent amount of time on finding new clients every single week — even a genuinely busy one — rather than only during a slow patch. A steady trickle of new leads smooths out the swings far better than sporadic bursts of intense outreach.</p>'),
      h(2, 'Financial Habits That Make the Swings Survivable'),
      table(['Habit', 'Why it helps'], [
        ['A 3-6 month emergency fund', 'The single most important buffer — turns a quiet month into an inconvenience instead of a crisis'],
        ['Paying yourself a fixed "salary"', 'Move a consistent amount from a business account to personal use each month, regardless of that month\'s actual income — smooths spending even when income itself is uneven'],
        ['Budgeting off a rolling average, not the best month', 'Planning spending around a peak "feast" month\'s income all but guarantees a shortfall in the next "famine" one'],
      ]),
      callout('note', '<p>Some swing is genuinely normal in freelance income — the goal isn\'t perfectly flat income, it\'s having enough buffer that the swings stop being stressful.</p>', 'It doesn\'t have to be perfectly smooth, just survivable'),
    ],
  },
  bn: {
    title: 'Feast-or-Famine Income',
    metaTitle: 'Feast-or-Famine Freelance Income | Learn Computer Academy',
    metaDescription: 'কেন freelance income খুব বেশি কাজ আর খুব কম কাজের মধ্যে দোলে, আর বাস্তব অভ্যাস — একটা emergency fund, একটা স্থির pipeline, নিজেকে-পরিশোধ করা salary — যা এটা মসৃণ করে।',
    blocks: [
      p('<p><b>Feast-or-famine cycle</b> — অভিভূতকারী ব্যস্ততার মাস তারপর অস্বস্তিকর নীরবতা — freelancer-দের মধ্যে সবচেয়ে সাধারণ অভিযোগগুলোর একটা, আর প্রায় সবসময় একই মূল কারণ থাকে।</p>'),
      h(2, 'কেন এটা হয়', 'কেন-এটা-হয়'),
      p('<p>একটা ব্যস্ত "feast" সময়ে, পরের client খোঁজার জন্য কোনো সময় বাকি থাকে না — সব শ্রম বর্তমান কাজ deliver করায় যায়। সেই কাজ শেষ হয়ে গেলে, কিছুই সাজানো থাকে না, আর একটা "famine" সময় আসে। চক্রটা পুনরাবৃত্ত হয় কারণ client-খোঁজা শুধু নীরব সময়েই ঘটে, ঠিক যখন এটা সবচেয়ে কম জরুরি আর ফোকাস করা সবচেয়ে কঠিন মনে হয়।</p>'),
      h(2, 'চক্র ভাঙা — ব্যস্ত থাকলেও সবসময় খুঁজতে থাকুন', 'চক্র-ভাঙা-ব্যস্ত-থাকলেও-সবসময়-খুঁজতে-থাকুন'),
      p('<p>আসল সমাধান হলো শুধু একটা ধীর সময়ে না বরং প্রতি একটা সপ্তাহে — এমনকি একটা আসলেই ব্যস্ত সপ্তাহেও — নতুন client খোঁজার জন্য একটা ছোট, ধারাবাহিক সময় ব্যয় করা। নতুন leads-এর একটা স্থির প্রবাহ intense outreach-এর বিক্ষিপ্ত ঝাপটার চেয়ে দোলাচল অনেক ভালো মসৃণ করে।</p>'),
      h(2, 'আর্থিক অভ্যাস যা দোলাচল সহনীয় করে', 'আর্থিক-অভ্যাস-যা-দোলাচল-সহনীয়-করে'),
      table(['অভ্যাস', 'কেন সাহায্য করে'], [
        ['৩-৬ মাসের একটা emergency fund', 'একক সবচেয়ে গুরুত্বপূর্ণ buffer — একটা নীরব মাসকে একটা সংকটের বদলে একটা অসুবিধায় পরিণত করে'],
        ['নিজেকে একটা fixed "salary" দেওয়া', 'সেই মাসের আসল income নির্বিশেষে প্রতি মাসে একটা business account থেকে ব্যক্তিগত ব্যবহারে একটা ধারাবাহিক পরিমাণ সরান — income নিজেই অসমান থাকলেও খরচ মসৃণ করে'],
        ['সেরা মাসের বদলে একটা rolling average থেকে budget করা', 'একটা শীর্ষ "feast" মাসের income-এর চারপাশে খরচ পরিকল্পনা করা পরের "famine" মাসে প্রায় নিশ্চিতভাবে একটা ঘাটতি নিশ্চিত করে'],
      ]),
      callout('note', '<p>Freelance income-এ কিছু দোলাচল আসলেই স্বাভাবিক — লক্ষ্য নিখুঁতভাবে সমতল income না, এটা যথেষ্ট buffer থাকা যাতে দোলাচল চাপযুক্ত হওয়া বন্ধ হয়।</p>', 'এটা নিখুঁতভাবে মসৃণ হতে হবে না, শুধু সহনীয়'),
    ],
  },
})

lessons.push({
  slug: 'common-freelancer-mistakes', sortOrder: n++,
  en: {
    title: 'Common Freelancer Mistakes to Avoid',
    metaTitle: 'Common Freelancer Mistakes to Avoid | Learn Computer Academy',
    metaDescription: 'A closing round-up of the mistakes new freelancers make most often, pulling together the lessons from across this entire course.',
    blocks: [
      p('<p>This closing lesson pulls together the most common mistakes covered throughout this course into one quick reference — a good page to revisit before starting a new client relationship.</p>'),
      table(['Mistake', 'Covered in'], [
        ['Not getting scope and terms in writing before starting', 'Contracts and Agreements Basics'],
        ['Pricing far below market rate with no plan to raise it', 'Pricing Yourself, Raising Your Rates'],
        ['Sending generic, copy-pasted proposals', 'Writing Proposals That Win Jobs'],
        ['Letting small extra requests pile up unpaid', 'Scope Creep'],
        ['Saying "unlimited revisions" to sound appealing', 'Handling Revisions Professionally'],
        ['No emergency fund for a slow month', 'Feast-or-Famine Income'],
        ['Ignoring taxes until they become a real problem', 'Taxes for Freelancers'],
        ['Never asking happy clients for a review', 'Getting Reviews That Actually Help'],
        ['Treating every message as urgent, every hour as billable', 'Avoiding Burnout'],
      ]),
      h(2, 'The One Thread Running Through All of It'),
      p('<p>Nearly every mistake on this list comes down to the same root cause: something that should have been written down, said out loud, or planned for in advance instead got handled reactively, in the moment, under pressure. Slowing down at the start of a relationship or a project consistently prevents more problems than any amount of skill fixes after the fact.</p>'),
      callout('tip', '<p>This course covered getting started, getting hired, getting paid, and staying sane doing it — the actual skill being sold is still the most important ingredient. Everything here just makes sure that skill is what a client sees and pays fairly for.</p>', 'That\'s the whole course — go build a client base'),
    ],
  },
  bn: {
    title: 'এড়ানোর মতো সাধারণ Freelancer ভুল',
    metaTitle: 'এড়ানোর মতো সাধারণ Freelancer ভুল | Learn Computer Academy',
    metaDescription: 'নতুন freelancer-রা সবচেয়ে বেশি যে ভুলগুলো করে তার একটা শেষ সারসংক্ষেপ, এই পুরো কোর্স জুড়ে lesson-গুলো একসাথে টেনে এনে।',
    blocks: [
      p('<p>এই শেষ lesson এই কোর্স জুড়ে কভার করা সবচেয়ে সাধারণ ভুলগুলো একটা দ্রুত reference-এ একসাথে টেনে আনে — একটা নতুন client সম্পর্ক শুরু করার আগে আবার দেখার মতো একটা ভালো page।</p>'),
      table(['ভুল', 'কভার করা হয়েছে'], [
        ['শুরু করার আগে scope আর terms লিখে না নেওয়া', 'Contracts and Agreements Basics'],
        ['বাজারের rate-এর চেয়ে অনেক কম price করা কোনো বাড়ানোর পরিকল্পনা ছাড়াই', 'Pricing Yourself, Raising Your Rates'],
        ['Generic, copy-paste করা proposal পাঠানো', 'Writing Proposals That Win Jobs'],
        ['ছোট বাড়তি request unpaid জমা হতে দেওয়া', 'Scope Creep'],
        ['আকর্ষণীয় শোনানোর জন্য "unlimited revisions" বলা', 'Handling Revisions Professionally'],
        ['একটা ধীর মাসের জন্য কোনো emergency fund নেই', 'Feast-or-Famine Income'],
        ['একটা আসল সমস্যা না হওয়া পর্যন্ত tax উপেক্ষা করা', 'Taxes for Freelancers'],
        ['খুশি client-দের কখনো review চাওয়া হয় না', 'Getting Reviews That Actually Help'],
        ['প্রতিটা message-কে জরুরি, প্রতিটা ঘণ্টাকে billable মনে করা', 'Avoiding Burnout'],
      ]),
      h(2, 'সবকিছুর মধ্য দিয়ে যাওয়া একটা সুতো', 'সবকিছুর-মধ্য-দিয়ে-যাওয়া-একটা-সুতো'),
      p('<p>এই তালিকার প্রায় প্রতিটা ভুল একই মূল কারণে নেমে আসে: এমন কিছু যা লিখে রাখা, উচ্চস্বরে বলা, বা আগে থেকে পরিকল্পনা করা উচিত ছিল তার বদলে চাপের মধ্যে, মুহূর্তে, প্রতিক্রিয়াশীলভাবে সামলানো হয়েছিল। একটা সম্পর্ক বা একটা প্রজেক্টের শুরুতে ধীর হওয়া পরে যেকোনো পরিমাণ দক্ষতা ঠিক করার চেয়ে ধারাবাহিকভাবে বেশি সমস্যা প্রতিরোধ করে।</p>'),
      callout('tip', '<p>এই কোর্স শুরু করা, নিয়োগ পাওয়া, টাকা পাওয়া, আর এটা করতে গিয়ে সুস্থ থাকা কভার করেছে — বিক্রি হওয়া আসল দক্ষতাটাই তখনো সবচেয়ে গুরুত্বপূর্ণ উপাদান। এখানের সবকিছু শুধু নিশ্চিত করে যে সেই দক্ষতাটাই একজন client দেখে আর যার জন্য fair টাকা দেয়।</p>', 'পুরো কোর্স এটাই — এখন একটা client base বানাতে যান'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'freelancing').single()
  if (catErr || !category) {
    console.error('Category "freelancing" not found — run scripts/create-freelancing-category.mjs first.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] freelancing/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] freelancing/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `freelancing/${lesson.slug}`
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
