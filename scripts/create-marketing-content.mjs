#!/usr/bin/env node
// New "marketing" category — 32 lessons, per the outline approved with the
// site owner 2026-08-05 (D-70, docs/CONTENT-PIPELINE.md). Companion to the
// `seo` category built the same day; SEO covers organic search, this covers
// everything else — content, email, social, and paid advertising.
//
// Original content — written fresh for this site (CONTENT-PIPELINE.md §3).
//
// ⚠️ Two subject-specific rules this run follows. Do not undo them casually.
//
// 1. PAID ADVERTISING IS TAUGHT CONCEPTUALLY, NEVER AS A WALKTHROUGH.
//    Site owner instruction, 2026-08-05: "no need to include how to since the
//    dashboard changes but the types of it." So: auction mechanics, pricing
//    models, campaign type categories, match types, targeting concepts — all
//    of which are stable for years. No screenshots, no menu paths, no
//    "click Settings then...", no current pricing. Platform *labels* drift
//    too (Google renamed Discovery to Demand Gen; Meta has reshuffled
//    objective names more than once), so lessons say so explicitly rather
//    than presenting a label as permanent.
//
// 2. NO INVENTED NUMBERS. Marketing writing is full of confident statistics
//    with no source ("email returns $42 for every $1", "users decide in 0.05
//    seconds"). None of those appear here. Where a figure would help but
//    cannot be verified, the lesson describes the direction instead of
//    fabricating a magnitude. Same rule as scripts/create-seo-content.mjs.
//
// Idempotent — upserts on `path` / `doc_id,locale`. Usage:
//   node scripts/create-marketing-content.mjs [--dry-run]

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
  slug: 'introduction',
  sortOrder: 1,
  en: {
    title: 'Introduction to Digital Marketing',
    metaTitle: 'Introduction to Digital Marketing | Learn Computer Academy',
    metaDescription: 'What digital marketing covers, how the main channels differ, and why no single one of them works well on its own.',
    blocks: [
      p('<p><b>Digital marketing</b> is everything you do to reach people, build interest, and turn that interest into action — using digital channels rather than print, radio, or billboards. It is a wide field, and most of the confusion around it comes from treating it as one thing when it is really several.</p>'),

      h(2, 'The Main Channels'),
      table(
        ['Channel', 'What it is', 'Speed', 'Cost shape'],
        [
          ['Search (SEO)', 'Earning organic search visibility', 'Slow', 'Effort now, traffic later, no per-visit cost'],
          ['Content', 'Articles, guides, videos that attract and inform', 'Slow', 'Effort, compounding'],
          ['Email', 'Direct messages to people who opted in', 'Fast', 'Very low per message'],
          ['Social media', 'Building an audience on a platform', 'Medium', 'Time-heavy, unpredictable reach'],
          ['Paid advertising', 'Buying placement in front of an audience', 'Immediate', 'Pay per click or per impression, stops when you stop'],
        ]
      ),

      img(
        'docs/img/marketing/introduction-1',
        'Diagram showing five marketing channels as separate paths all converging on a single website',
        1024, 768,
        'Separate channels, one destination — they work together rather than competing.'
      ),

      h(2, 'Why No Channel Works Alone'),
      p('<p>Each channel has a failure mode that another one covers:</p><ul><li><b>Paid advertising</b> works immediately but stops the day the budget does. Nothing accumulates.</li><li><b>SEO and content</b> accumulate but are slow, and you cannot make them faster by spending more.</li><li><b>Social media</b> builds an audience you do not own — the platform decides who sees your posts, and that can change without warning.</li><li><b>Email</b> reaches people directly and is the one audience you genuinely own, but you have to acquire those addresses from somewhere first.</li></ul><p>Notice how they fit: paid ads and social can bring people in quickly, content gives them a reason to stay, email captures them so you are not dependent on any platform, and SEO makes the whole thing compound over time.</p>'),

      callout('note', '<p>The single most useful idea in this course: <b>you own your website and your email list. You rent everything else.</b> A social platform can change its algorithm, an ad platform can change its pricing, a search engine can change its ranking. Building only on rented ground is the most common structural mistake in digital marketing.</p>', 'Owned versus rented'),

      h(2, 'How This Course Is Organised'),
      p('<p>It starts with the things that apply regardless of channel — understanding your audience, and the funnel that describes how someone moves from stranger to customer. Then the organic channels: content, copywriting, landing pages, email, and social. Then paid advertising, taught as concepts rather than dashboard walkthroughs. Then measurement, which is what tells you whether any of it worked.</p>'),

      callout('tip', '<p>Search is covered separately and in much more depth in this site\'s <a href="/seo/">SEO course</a> — 26 lessons on how search engines find, index, and rank pages. This course does not repeat it.</p>'),
    ],
  },
  bn: {
    title: 'ডিজিটাল মার্কেটিং পরিচিতি',
    metaTitle: 'ডিজিটাল মার্কেটিং পরিচিতি | Learn Computer Academy',
    metaDescription: 'ডিজিটাল মার্কেটিং কী কভার করে, প্রধান চ্যানেলগুলো কীভাবে আলাদা, আর কেন সেগুলোর কোনো একটিও একা ভালো কাজ করে না।',
    blocks: [
      p('<p><b>ডিজিটাল মার্কেটিং</b> হলো মানুষের কাছে পৌঁছাতে, আগ্রহ তৈরি করতে, আর সেই আগ্রহকে কাজে পরিণত করতে আপনি যা কিছু করেন — প্রিন্ট, রেডিও, বা বিলবোর্ডের বদলে ডিজিটাল চ্যানেল ব্যবহার করে। এটি একটি বিস্তৃত ক্ষেত্র, আর এটি নিয়ে বেশিরভাগ বিভ্রান্তি আসে এটিকে একটি জিনিস হিসেবে গণ্য করা থেকে যখন এটি আসলে কয়েকটি।</p>'),

      h(2, 'প্রধান চ্যানেলগুলো', 'the-main-channels'),
      table(
        ['চ্যানেল', 'এটি কী', 'গতি', 'খরচের আকৃতি'],
        [
          ['সার্চ (SEO)', 'Organic সার্চ দৃশ্যমানতা অর্জন', 'ধীর', 'এখন পরিশ্রম, পরে ট্রাফিক, প্রতি ভিজিটে খরচ নেই'],
          ['কন্টেন্ট', 'প্রবন্ধ, গাইড, ভিডিও যা আকর্ষণ করে আর জানায়', 'ধীর', 'পরিশ্রম, জমতে থাকে'],
          ['ইমেইল', 'যারা সম্মতি দিয়েছে তাদের সরাসরি বার্তা', 'দ্রুত', 'প্রতি বার্তায় খুব কম'],
          ['সোশ্যাল মিডিয়া', 'একটি প্ল্যাটফর্মে দর্শক তৈরি', 'মাঝারি', 'সময়সাপেক্ষ, অননুমানযোগ্য নাগাল'],
          ['পেইড বিজ্ঞাপন', 'একটি দর্শকের সামনে জায়গা কেনা', 'তাৎক্ষণিক', 'প্রতি ক্লিক বা impression-এ টাকা, থামলে থেমে যায়'],
        ]
      ),

      img(
        'docs/img/marketing/introduction-1',
        'ডায়াগ্রাম যেখানে পাঁচটি মার্কেটিং চ্যানেল আলাদা পথ হিসেবে সবগুলো একটি একক ওয়েবসাইটে মিলিত হচ্ছে',
        1024, 768,
        'আলাদা চ্যানেল, একটি গন্তব্য — সেগুলো প্রতিযোগিতা না করে একসাথে কাজ করে।'
      ),

      h(2, 'কোনো চ্যানেল একা কাজ করে না কেন', 'why-no-channel-works-alone'),
      p('<p>প্রতিটি চ্যানেলের একটি ব্যর্থতার ধরন আছে যা অন্যটি পূরণ করে:</p><ul><li><b>পেইড বিজ্ঞাপন</b> সাথে সাথে কাজ করে কিন্তু বাজেট শেষ হওয়ার দিনই থেমে যায়। কিছুই জমে না।</li><li><b>SEO আর কন্টেন্ট</b> জমতে থাকে কিন্তু ধীর, আর বেশি খরচ করে সেগুলো দ্রুত করা যায় না।</li><li><b>সোশ্যাল মিডিয়া</b> এমন একটি দর্শক তৈরি করে যা আপনার নয় — প্ল্যাটফর্ম ঠিক করে কে আপনার পোস্ট দেখবে, আর সেটি সতর্কতা ছাড়াই বদলাতে পারে।</li><li><b>ইমেইল</b> মানুষের কাছে সরাসরি পৌঁছায় আর এটিই একমাত্র দর্শক যা সত্যিই আপনার, কিন্তু সেই ঠিকানাগুলো আপনাকে আগে কোথাও থেকে সংগ্রহ করতে হয়।</li></ul><p>লক্ষ্য করুন সেগুলো কীভাবে খাপ খায়: পেইড বিজ্ঞাপন আর সোশ্যাল দ্রুত মানুষ আনতে পারে, কন্টেন্ট তাদের থাকার একটি কারণ দেয়, ইমেইল তাদের ধরে রাখে যাতে আপনি কোনো প্ল্যাটফর্মের উপর নির্ভরশীল না থাকেন, আর SEO পুরো জিনিসটিকে সময়ের সাথে জমতে দেয়।</p>'),

      callout('note', '<p>এই কোর্সের সবচেয়ে কাজের ধারণা: <b>আপনার ওয়েবসাইট আর আপনার ইমেইল তালিকা আপনার। বাকি সবকিছু আপনি ভাড়া নেন।</b> একটি সোশ্যাল প্ল্যাটফর্ম তার অ্যালগরিদম বদলাতে পারে, একটি বিজ্ঞাপন প্ল্যাটফর্ম তার দাম বদলাতে পারে, একটি সার্চ ইঞ্জিন তার ranking বদলাতে পারে। শুধু ভাড়া করা জমিতে গড়া ডিজিটাল মার্কেটিংয়ের সবচেয়ে সাধারণ কাঠামোগত ভুল।</p>', 'নিজের বনাম ভাড়া করা'),

      h(2, 'এই কোর্সটি কীভাবে সাজানো', 'how-this-course-is-organised'),
      p('<p>এটি শুরু হয় সেই জিনিসগুলো দিয়ে যা চ্যানেল নির্বিশেষে প্রযোজ্য — আপনার দর্শক বোঝা, আর সেই funnel যা বর্ণনা করে কেউ কীভাবে অচেনা থেকে গ্রাহকে পৌঁছায়। তারপর organic চ্যানেল: কন্টেন্ট, copywriting, landing পাতা, ইমেইল, আর সোশ্যাল। তারপর পেইড বিজ্ঞাপন, dashboard walkthrough-এর বদলে ধারণা হিসেবে শেখানো। তারপর পরিমাপ, যা আপনাকে বলে এর কিছু কাজ করেছে কিনা।</p>'),

      callout('tip', '<p>সার্চ আলাদাভাবে আর অনেক বেশি গভীরভাবে এই সাইটের <a href="/bn/seo/">SEO কোর্সে</a> কভার করা হয়েছে — সার্চ ইঞ্জিন কীভাবে পাতা খুঁজে পায়, index করে, আর র‍্যাংক করে তা নিয়ে ২৬টি পাঠ। এই কোর্স সেটি পুনরাবৃত্তি করে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'understanding-your-audience',
  sortOrder: 2,
  en: {
    title: 'Understanding Your Audience',
    metaTitle: 'Understanding Your Audience | Learn Computer Academy',
    metaDescription: 'How to work out who you are actually talking to, using evidence rather than assumptions, and why "everyone" is the worst possible answer.',
    blocks: [
      p('<p>Every decision in this course — what to write, which platform to use, what an ad should say — depends on knowing who you are talking to. Get this wrong and everything downstream is guesswork dressed up as strategy.</p>'),

      h(2, 'Why "Everyone" Fails'),
      p('<p>The instinct is to keep the audience broad so as not to exclude anyone. In practice, messaging written for everyone speaks to no one — it has to stay so general that it stops being useful to any particular person.</p><p>A page saying "we provide quality computer services for all your needs" gives a reader nothing to recognise themselves in. "We recover data from water-damaged laptops, usually within 48 hours" is narrower and far more effective, because the person with a water-damaged laptop knows immediately that it is about them.</p>'),

      h(2, 'Finding Out, Rather Than Guessing'),
      p('<p>Most audience descriptions are invented at a desk. The useful ones come from evidence you already have access to:</p><ul><li><b>Your existing customers.</b> Who actually buys? What did they ask before buying? What almost stopped them?</li><li><b>Support and enquiry messages.</b> The questions people ask repeatedly are the gaps your marketing should close.</li><li><b>Search Console queries.</b> The literal phrases people typed before finding you. This is unfiltered evidence of how your audience describes their problem.</li><li><b>Analytics.</b> Which pages hold attention, which get abandoned, which devices people use.</li><li><b>Talking to people.</b> Five real conversations with customers usually beat any amount of speculation.</li></ul>'),

      h(2, 'What Is Worth Writing Down'),
      p('<p>A useful audience description is short and decision-shaped. For each group you serve:</p><ul><li><b>The problem they have</b>, in their words rather than your industry\'s.</li><li><b>What they have already tried</b>, and why it did not work.</li><li><b>What would make them hesitate</b> — price, trust, effort, risk of being wrong.</li><li><b>Where they already spend time</b>, which decides which channels are worth your effort.</li><li><b>How they judge whether you are any good</b> — reviews, credentials, portfolio, someone they know.</li></ul>'),

      callout('warning', '<p>Detailed personas with invented names, ages, and stock photos are popular and frequently useless. A persona is only worth having if it changes a decision. If your marketing would be identical with or without it, the document is decoration.</p>', 'Personas earn their keep or they do not'),

      h(2, 'More Than One Audience'),
      p('<p>Most businesses serve several distinct groups with different problems. A computer training institute might serve students choosing a first course, working professionals adding a skill, and employers looking for trained staff. Those three want different things and would not respond to the same page.</p><p>The answer is not one message that covers all three — it is separate pages, each written for one of them. This is the same principle as the SEO course\'s "one page, one topic", arriving from a different direction.</p>'),

      h(2, 'Revisit It'),
      p('<p>Audiences change. The problem people came to you with three years ago may have been solved by something else, or replaced by a different one. Re-reading your own enquiry messages once or twice a year catches drift that is invisible day to day.</p>'),
    ],
  },
  bn: {
    title: 'আপনার দর্শক বোঝা',
    metaTitle: 'আপনার দর্শক বোঝা | Learn Computer Academy',
    metaDescription: 'অনুমানের বদলে প্রমাণ ব্যবহার করে আপনি আসলে কার সাথে কথা বলছেন তা কীভাবে বের করবেন, আর "সবাই" কেন সম্ভাব্য সবচেয়ে খারাপ উত্তর।',
    blocks: [
      p('<p>এই কোর্সের প্রতিটি সিদ্ধান্ত — কী লিখবেন, কোন প্ল্যাটফর্ম ব্যবহার করবেন, একটি বিজ্ঞাপনে কী বলা উচিত — নির্ভর করে আপনি কার সাথে কথা বলছেন তা জানার উপর। এটি ভুল করলে পরের সবকিছু কৌশলের সাজে সাজানো অনুমান।</p>'),

      h(2, '"সবাই" কেন ব্যর্থ হয়', 'why-everyone-fails'),
      p('<p>প্রবৃত্তি হলো দর্শক বিস্তৃত রাখা যাতে কাউকে বাদ না দেওয়া হয়। বাস্তবে, সবার জন্য লেখা বার্তা কারো সাথেই কথা বলে না — এটিকে এত সাধারণ থাকতে হয় যে এটি কোনো নির্দিষ্ট ব্যক্তির কাজে আসা বন্ধ করে।</p><p>"we provide quality computer services for all your needs" বলা একটি পাতা পাঠককে নিজেকে চেনার মতো কিছু দেয় না। "We recover data from water-damaged laptops, usually within 48 hours" সংকীর্ণ আর অনেক বেশি কার্যকর, কারণ জলে নষ্ট হওয়া ল্যাপটপযুক্ত ব্যক্তিটি সাথে সাথেই জানে এটি তার সম্পর্কে।</p>'),

      h(2, 'অনুমানের বদলে জেনে নেওয়া', 'finding-out-rather-than-guessing'),
      p('<p>বেশিরভাগ দর্শকের বর্ণনা একটি ডেস্কে বসে আবিষ্কার করা। কাজেরগুলো আসে এমন প্রমাণ থেকে যা আপনার ইতিমধ্যে হাতে আছে:</p><ul><li><b>আপনার বিদ্যমান গ্রাহক।</b> আসলে কে কেনে? কেনার আগে তারা কী জিজ্ঞাসা করেছিল? কী প্রায় তাদের থামিয়ে দিয়েছিল?</li><li><b>সাপোর্ট আর জিজ্ঞাসার বার্তা।</b> মানুষ বারবার যে প্রশ্ন করে সেগুলোই সেই ফাঁক যা আপনার মার্কেটিংয়ের বন্ধ করা উচিত।</li><li><b>Search Console query।</b> আপনাকে খুঁজে পাওয়ার আগে মানুষ যে আক্ষরিক বাক্যাংশ টাইপ করেছে। এটি আপনার দর্শক তাদের সমস্যা কীভাবে বর্ণনা করে তার অপরিশোধিত প্রমাণ।</li><li><b>Analytics।</b> কোন পাতা মনোযোগ ধরে রাখে, কোনগুলো পরিত্যক্ত হয়, মানুষ কোন ডিভাইস ব্যবহার করে।</li><li><b>মানুষের সাথে কথা বলা।</b> গ্রাহকের সাথে পাঁচটি বাস্তব কথোপকথন সাধারণত যেকোনো পরিমাণ জল্পনাকে হারায়।</li></ul>'),

      h(2, 'কী লিখে রাখার যোগ্য', 'what-is-worth-writing-down'),
      p('<p>একটি কাজের দর্শকের বর্ণনা ছোট আর সিদ্ধান্ত-আকৃতির। আপনি যে প্রতিটি দলকে সেবা দেন তার জন্য:</p><ul><li><b>তাদের যে সমস্যা</b>, আপনার শিল্পের বদলে তাদের ভাষায়।</li><li><b>তারা ইতিমধ্যে কী চেষ্টা করেছে</b>, আর সেটি কেন কাজ করেনি।</li><li><b>কী তাদের দ্বিধায় ফেলবে</b> — দাম, বিশ্বাস, পরিশ্রম, ভুল হওয়ার ঝুঁকি।</li><li><b>তারা ইতিমধ্যে কোথায় সময় কাটায়</b>, যা ঠিক করে কোন চ্যানেল আপনার পরিশ্রমের যোগ্য।</li><li><b>আপনি ভালো কিনা তারা কীভাবে বিচার করে</b> — রিভিউ, যোগ্যতা, পোর্টফোলিও, তাদের চেনা কেউ।</li></ul>'),

      callout('warning', '<p>আবিষ্কৃত নাম, বয়স, আর stock ছবিসহ বিস্তারিত persona জনপ্রিয় আর প্রায়ই অকেজো। একটি persona শুধু তখনই রাখার যোগ্য যদি এটি একটি সিদ্ধান্ত বদলায়। এটি থাকলে বা না থাকলে আপনার মার্কেটিং একই হলে, ডকুমেন্টটি সাজসজ্জা।</p>', 'Persona নিজের খরচ তোলে নয়তো তোলে না'),

      h(2, 'একাধিক দর্শক', 'more-than-one-audience'),
      p('<p>বেশিরভাগ ব্যবসা ভিন্ন সমস্যাযুক্ত কয়েকটি স্বতন্ত্র দলকে সেবা দেয়। একটি কম্পিউটার প্রশিক্ষণ প্রতিষ্ঠান প্রথম কোর্স বাছাই করা শিক্ষার্থী, একটি দক্ষতা যোগ করা কর্মজীবী পেশাদার, আর প্রশিক্ষিত কর্মী খোঁজা নিয়োগকর্তাদের সেবা দিতে পারে। সেই তিনজন ভিন্ন জিনিস চায় আর একই পাতায় সাড়া দেবে না।</p><p>উত্তরটি তিনটিকেই কভার করা একটি বার্তা নয় — এটি আলাদা পাতা, প্রতিটি তাদের একজনের জন্য লেখা। এটি SEO কোর্সের "এক পাতা, এক বিষয়"-এর একই নীতি, একটি ভিন্ন দিক থেকে আসা।</p>'),

      h(2, 'এটি আবার দেখুন', 'revisit-it'),
      p('<p>দর্শক বদলায়। তিন বছর আগে মানুষ যে সমস্যা নিয়ে আপনার কাছে এসেছিল তা অন্য কিছু দিয়ে সমাধান হয়ে থাকতে পারে, বা একটি ভিন্ন সমস্যা দিয়ে প্রতিস্থাপিত হতে পারে। বছরে একবার বা দুবার নিজের জিজ্ঞাসার বার্তাগুলো আবার পড়লে এমন সরে যাওয়া ধরা পড়ে যা দৈনন্দিন অদৃশ্য।</p>'),
    ],
  },
})

lessons.push({
  slug: 'the-marketing-funnel',
  sortOrder: 3,
  en: {
    title: 'The Marketing Funnel',
    metaTitle: 'The Marketing Funnel | Learn Computer Academy',
    metaDescription: 'How people move from not knowing you exist to becoming a customer, and why content aimed at only one stage underperforms.',
    blocks: [
      p('<p>Almost nobody encounters a business for the first time and buys immediately. There is a sequence — becoming aware, getting interested, comparing options, deciding — and the <b>marketing funnel</b> is the standard way of describing it.</p>'),

      img(
        'docs/img/marketing/funnel-1',
        'A funnel diagram divided into four narrowing horizontal bands representing awareness, interest, consideration, and action',
        1024, 768,
        'Many people enter at the top; a smaller number reach each stage below it.'
      ),

      h(2, 'The Stages'),
      table(
        ['Stage', 'The person is…', 'What they need from you'],
        [
          ['<b>Awareness</b>', 'Discovering the problem or that you exist', 'Something useful with no strings attached'],
          ['<b>Interest</b>', 'Learning more about the problem', 'Depth, explanation, evidence you know the subject'],
          ['<b>Consideration</b>', 'Comparing you against alternatives', 'Specifics, proof, honest comparison, reassurance'],
          ['<b>Action</b>', 'Ready to decide', 'A clear, easy, low-friction next step'],
        ]
      ),
      p('<p>It is called a funnel because the numbers shrink at each stage. Far more people will read an introductory article than will ever buy — that is normal and expected, not a failure of the article.</p>'),

      h(2, 'Why It Matters Practically'),
      p('<p>The funnel explains a very common failure: a business whose entire online presence is aimed at the Action stage. Every page is a sales page. Nothing exists for someone who is merely curious, or comparing, or still working out what their problem is.</p><p>The effect is that only people already ready to buy find anything useful — which is the smallest group at any given moment. Everyone earlier in the sequence bounces, and the business concludes that marketing does not work.</p>'),

      h(2, 'What Fits Where'),
      table(
        ['Stage', 'Typical content'],
        [
          ['Awareness', 'Introductory articles, social posts, videos answering common questions'],
          ['Interest', 'In-depth guides, tutorials, newsletters, comparison explainers'],
          ['Consideration', 'Case studies, testimonials, detailed service or product pages, pricing'],
          ['Action', 'Landing pages, clear calls to action, simple enquiry or checkout flows'],
        ]
      ),

      callout('note', '<p>The stages map closely onto the search intent types in the <a href="/seo/search-intent/">SEO course</a> — informational searches sit at awareness and interest, commercial at consideration, transactional at action. They are two descriptions of the same underlying thing, which is why content built around one usually serves the other.</p>'),

      h(2, 'The Funnel Is a Simplification'),
      p('<p>Real behaviour is messier than four tidy bands. People enter partway down, leave and return months later, move backwards when a new option appears, or skip straight to buying on a personal recommendation. The funnel is a planning tool, not a description of how any individual actually behaves.</p><p>Used honestly it answers one question well: <b>if someone found me today at this stage, is there anything here for them?</b> That is what it is for.</p>'),

      h(2, 'Connecting the Stages'),
      p('<p>The pieces only work as a funnel if they link. An introductory article should lead somewhere — to a deeper guide, to a newsletter signup, to a relevant service page. Content that attracts attention and then offers no next step wastes the attention it earned.</p>'),
    ],
  },
  bn: {
    title: 'মার্কেটিং Funnel',
    metaTitle: 'মার্কেটিং Funnel | Learn Computer Academy',
    metaDescription: 'মানুষ আপনার অস্তিত্ব না জানা থেকে গ্রাহক হওয়া পর্যন্ত কীভাবে এগোয়, আর কেন শুধু একটি পর্যায়ের দিকে লক্ষ্য করা কন্টেন্ট কম ফল দেয়।',
    blocks: [
      p('<p>প্রায় কেউই প্রথমবার একটি ব্যবসার মুখোমুখি হয়ে সাথে সাথে কেনে না। একটি ক্রম আছে — সচেতন হওয়া, আগ্রহী হওয়া, বিকল্প তুলনা করা, সিদ্ধান্ত নেওয়া — আর <b>মার্কেটিং funnel</b> হলো সেটি বর্ণনার আদর্শ উপায়।</p>'),

      img(
        'docs/img/marketing/funnel-1',
        'একটি funnel ডায়াগ্রাম যা awareness, interest, consideration, আর action প্রতিনিধিত্ব করা চারটি সরু হতে থাকা অনুভূমিক ব্যান্ডে বিভক্ত',
        1024, 768,
        'অনেক মানুষ উপরে প্রবেশ করে; এর নিচের প্রতিটি পর্যায়ে কম সংখ্যক পৌঁছায়।'
      ),

      h(2, 'পর্যায়গুলো', 'the-stages'),
      table(
        ['পর্যায়', 'ব্যক্তিটি…', 'আপনার কাছে তাদের যা দরকার'],
        [
          ['<b>Awareness</b>', 'সমস্যাটি বা আপনার অস্তিত্ব আবিষ্কার করছে', 'কোনো শর্ত ছাড়া কাজের কিছু'],
          ['<b>Interest</b>', 'সমস্যাটি সম্পর্কে আরও শিখছে', 'গভীরতা, ব্যাখ্যা, আপনি বিষয়টি জানেন তার প্রমাণ'],
          ['<b>Consideration</b>', 'বিকল্পের বিরুদ্ধে আপনাকে তুলনা করছে', 'নির্দিষ্টতা, প্রমাণ, সৎ তুলনা, আশ্বাস'],
          ['<b>Action</b>', 'সিদ্ধান্ত নিতে প্রস্তুত', 'একটি স্পষ্ট, সহজ, কম বাধার পরবর্তী ধাপ'],
        ]
      ),
      p('<p>এটিকে funnel বলা হয় কারণ প্রতিটি পর্যায়ে সংখ্যা কমে। কখনো কিনবে তার চেয়ে অনেক বেশি মানুষ একটি ভূমিকামূলক প্রবন্ধ পড়বে — এটি স্বাভাবিক আর প্রত্যাশিত, প্রবন্ধটির ব্যর্থতা নয়।</p>'),

      h(2, 'এটি ব্যবহারিকভাবে কেন গুরুত্বপূর্ণ', 'why-it-matters-practically'),
      p('<p>Funnel একটি খুব সাধারণ ব্যর্থতা ব্যাখ্যা করে: এমন একটি ব্যবসা যার পুরো অনলাইন উপস্থিতি Action পর্যায়ের দিকে লক্ষ্য করা। প্রতিটি পাতা একটি বিক্রির পাতা। যে শুধু কৌতূহলী, বা তুলনা করছে, বা এখনো তার সমস্যা কী তা বের করছে তার জন্য কিছুই নেই।</p><p>প্রভাবটি হলো শুধু যারা ইতিমধ্যে কিনতে প্রস্তুত তারাই কাজের কিছু পায় — যা যেকোনো মুহূর্তে সবচেয়ে ছোট দল। ক্রমের আগের দিকের সবাই চলে যায়, আর ব্যবসাটি সিদ্ধান্তে আসে যে মার্কেটিং কাজ করে না।</p>'),

      h(2, 'কোথায় কী মানায়', 'what-fits-where'),
      table(
        ['পর্যায়', 'সাধারণ কন্টেন্ট'],
        [
          ['Awareness', 'ভূমিকামূলক প্রবন্ধ, সোশ্যাল পোস্ট, সাধারণ প্রশ্নের উত্তর দেওয়া ভিডিও'],
          ['Interest', 'গভীর গাইড, টিউটোরিয়াল, নিউজলেটার, তুলনামূলক ব্যাখ্যা'],
          ['Consideration', 'কেস স্টাডি, প্রশংসাপত্র, বিস্তারিত সেবা বা পণ্যের পাতা, দাম'],
          ['Action', 'Landing পাতা, স্পষ্ট call to action, সহজ জিজ্ঞাসা বা checkout প্রবাহ'],
        ]
      ),

      callout('note', '<p>পর্যায়গুলো <a href="/bn/seo/search-intent/">SEO কোর্সের</a> search intent-এর ধরনের সাথে ঘনিষ্ঠভাবে মেলে — informational সার্চ awareness আর interest-এ থাকে, commercial consideration-এ, transactional action-এ। সেগুলো একই অন্তর্নিহিত জিনিসের দুটি বর্ণনা, তাই একটির চারপাশে তৈরি কন্টেন্ট সাধারণত অন্যটিকেও সেবা দেয়।</p>'),

      h(2, 'Funnel একটি সরলীকরণ', 'the-funnel-is-a-simplification'),
      p('<p>বাস্তব আচরণ চারটি পরিপাটি ব্যান্ডের চেয়ে এলোমেলো। মানুষ মাঝপথে ঢোকে, চলে যায় আর মাস পরে ফেরে, একটি নতুন বিকল্প এলে পেছনে যায়, বা একটি ব্যক্তিগত সুপারিশে সোজা কেনায় লাফ দেয়। Funnel একটি পরিকল্পনার টুল, কোনো ব্যক্তি আসলে কীভাবে আচরণ করে তার বর্ণনা নয়।</p><p>সৎভাবে ব্যবহার করলে এটি একটি প্রশ্নের ভালো উত্তর দেয়: <b>কেউ যদি আজ এই পর্যায়ে আমাকে খুঁজে পেত, তাদের জন্য কি এখানে কিছু আছে?</b> এটিই এর কাজ।</p>'),

      h(2, 'পর্যায়গুলো সংযুক্ত করা', 'connecting-the-stages'),
      p('<p>অংশগুলো একটি funnel হিসেবে তখনই কাজ করে যখন সেগুলো যুক্ত থাকে। একটি ভূমিকামূলক প্রবন্ধের কোথাও নিয়ে যাওয়া উচিত — একটি গভীর গাইডে, একটি নিউজলেটার signup-এ, একটি প্রাসঙ্গিক সেবার পাতায়। যে কন্টেন্ট মনোযোগ আকর্ষণ করে আর তারপর কোনো পরবর্তী ধাপ দেয় না তা অর্জিত মনোযোগ নষ্ট করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'content-marketing',
  sortOrder: 4,
  en: {
    title: 'Content Marketing Fundamentals',
    metaTitle: 'Content Marketing Fundamentals | Learn Computer Academy',
    metaDescription: 'Why publishing genuinely useful material attracts customers, what makes content work, and the realistic timescale involved.',
    blocks: [
      p('<p><b>Content marketing</b> means attracting an audience by publishing things that are useful in themselves — guides, explanations, tools, videos — rather than by interrupting people with advertising. It is the engine behind most of the other channels in this course.</p>'),

      h(2, 'The Underlying Trade'),
      p('<p>The exchange is simple: you give away something genuinely valuable, and in return you earn attention, credibility, and eventually the chance to do business. Someone who learned something useful from you is far more likely to consider you than someone who saw an advertisement.</p><p>The catch is that it only works if the content is actually useful on its own. Content written purely as a vehicle for a sales pitch is transparent, and it fails at both jobs.</p>'),

      h(2, 'Why It Compounds'),
      p('<p>Content marketing is slow, and the reason people persist with it is that its effects accumulate in ways advertising does not:</p><ul><li>An article published two years ago can still be attracting readers today.</li><li>Each new piece adds to a growing body of work, and a site with depth on a subject is more credible than one with three pages.</li><li>Good content earns links and shares, which help search visibility, which brings more readers.</li><li>Everything published stays available to be found — the cost is paid once.</li></ul><p>Advertising has the opposite shape: fast, controllable, and gone the moment the budget stops.</p>'),

      callout('warning', '<p>The honest expectation: content marketing typically takes months to show meaningful results, and there is no way to buy speed. Most people who abandon it do so after a handful of posts, well before anything could reasonably have worked. If you need results this month, this is the wrong channel and paid advertising is the right one.</p>', 'The timescale is the hard part'),

      h(2, 'What Makes Content Work'),
      p('<ol><li><b>It answers a question people actually have.</b> The keyword research and audience lessons both feed directly into this.</li><li><b>It is genuinely useful on its own.</b> If someone reads it and gets what they needed without buying anything, that is success, not leakage.</li><li><b>It is specific.</b> "Tips for better photos" is forgettable; "why your indoor photos look yellow, and the two settings that fix it" is not.</li><li><b>It comes from real experience.</b> Content that could have been written by anyone about anything reads exactly that way.</li><li><b>It is findable.</b> Excellent content nobody discovers has failed at the marketing part, which is what the SEO course exists to fix.</li></ol>'),

      h(2, 'Formats Worth Considering'),
      table(
        ['Format', 'Good for'],
        [
          ['How-to guides', 'Capturing people actively searching for a solution'],
          ['Explainers', 'Awareness-stage readers who do not yet know the vocabulary'],
          ['Case studies', 'Consideration-stage readers who want proof'],
          ['Comparisons', 'People weighing options, including against competitors'],
          ['Free tools', 'Attracting links and repeat visits; expensive to build, durable once built'],
          ['Video', 'Anything easier to show than describe'],
        ]
      ),

      h(2, 'Consistency Over Volume'),
      p('<p>A steady pace that you can actually sustain beats a burst of publishing followed by six months of silence. Consistency compounds; bursts do not. It also matters for the practical reason that an audience which has learned to expect something from you is worth far more than one that has forgotten you exist.</p><p>Planning that pace is the subject of the next lesson.</p>'),
    ],
  },
  bn: {
    title: 'কন্টেন্ট মার্কেটিংয়ের মূল বিষয়',
    metaTitle: 'কন্টেন্ট মার্কেটিংয়ের মূল বিষয় | Learn Computer Academy',
    metaDescription: 'সত্যিই কাজের উপাদান প্রকাশ কেন গ্রাহক আকর্ষণ করে, কী কন্টেন্টকে কার্যকর করে, আর এতে জড়িত বাস্তবসম্মত সময়সীমা।',
    blocks: [
      p('<p><b>কন্টেন্ট মার্কেটিং</b> মানে বিজ্ঞাপন দিয়ে মানুষকে বাধা দেওয়ার বদলে নিজেই কাজের জিনিস প্রকাশ করে একটি দর্শক আকর্ষণ করা — গাইড, ব্যাখ্যা, টুল, ভিডিও। এই কোর্সের বাকি বেশিরভাগ চ্যানেলের পেছনের ইঞ্জিন এটিই।</p>'),

      h(2, 'অন্তর্নিহিত বিনিময়', 'the-underlying-trade'),
      p('<p>বিনিময়টি সহজ: আপনি সত্যিই মূল্যবান কিছু বিনামূল্যে দেন, আর বিনিময়ে মনোযোগ, বিশ্বাসযোগ্যতা, আর শেষে ব্যবসা করার সুযোগ অর্জন করেন। যে আপনার কাছ থেকে কাজের কিছু শিখেছে সে বিজ্ঞাপন দেখা কারো চেয়ে আপনাকে বিবেচনা করার সম্ভাবনা অনেক বেশি।</p><p>শর্তটি হলো এটি তখনই কাজ করে যখন কন্টেন্টটি নিজে সত্যিই কাজের। শুধু একটি বিক্রির বক্তব্যের বাহন হিসেবে লেখা কন্টেন্ট স্বচ্ছ, আর এটি দুটি কাজেই ব্যর্থ হয়।</p>'),

      h(2, 'এটি কেন জমতে থাকে', 'why-it-compounds'),
      p('<p>কন্টেন্ট মার্কেটিং ধীর, আর মানুষ এতে লেগে থাকার কারণ হলো এর প্রভাব এমনভাবে জমে যা বিজ্ঞাপনের হয় না:</p><ul><li>দুই বছর আগে প্রকাশিত একটি প্রবন্ধ আজও পাঠক আকর্ষণ করতে পারে।</li><li>প্রতিটি নতুন অংশ একটি বাড়তে থাকা কাজের সংগ্রহে যোগ হয়, আর একটি বিষয়ে গভীরতাযুক্ত একটি সাইট তিনটি পাতাযুক্ত একটির চেয়ে বেশি বিশ্বাসযোগ্য।</li><li>ভালো কন্টেন্ট লিংক আর শেয়ার অর্জন করে, যা সার্চ দৃশ্যমানতায় সাহায্য করে, যা আরও পাঠক আনে।</li><li>প্রকাশিত সবকিছু খুঁজে পাওয়ার জন্য উপলব্ধ থাকে — খরচটি একবার দেওয়া হয়।</li></ul><p>বিজ্ঞাপনের উল্টো আকৃতি: দ্রুত, নিয়ন্ত্রণযোগ্য, আর বাজেট থামা মাত্র শেষ।</p>'),

      callout('warning', '<p>সৎ প্রত্যাশা: কন্টেন্ট মার্কেটিংয়ে অর্থপূর্ণ ফল দেখাতে সাধারণত মাস লাগে, আর গতি কেনার কোনো উপায় নেই। যারা এটি ছেড়ে দেয় তাদের বেশিরভাগ মুষ্টিমেয় কয়েকটি পোস্টের পরেই দেয়, যুক্তিসঙ্গতভাবে কিছু কাজ করার অনেক আগে। এই মাসেই ফল দরকার হলে, এটি ভুল চ্যানেল আর পেইড বিজ্ঞাপন সঠিকটি।</p>', 'সময়সীমাই কঠিন অংশ'),

      h(2, 'কী কন্টেন্টকে কার্যকর করে', 'what-makes-content-work'),
      p('<ol><li><b>এটি এমন একটি প্রশ্নের উত্তর দেয় যা মানুষের সত্যিই আছে।</b> Keyword research আর দর্শকের পাঠ দুটোই সরাসরি এতে যোগ দেয়।</li><li><b>এটি নিজে সত্যিই কাজের।</b> কেউ যদি এটি পড়ে কিছু না কিনেই তার যা দরকার তা পায়, সেটি সাফল্য, ফাঁস নয়।</li><li><b>এটি নির্দিষ্ট।</b> "Tips for better photos" ভুলে যাওয়ার মতো; "why your indoor photos look yellow, and the two settings that fix it" নয়।</li><li><b>এটি বাস্তব অভিজ্ঞতা থেকে আসে।</b> যে কন্টেন্ট যে কেউ যেকোনো বিষয়ে লিখতে পারত তা ঠিক সেভাবেই পড়া যায়।</li><li><b>এটি খুঁজে পাওয়া যায়।</b> কেউ আবিষ্কার করে না এমন চমৎকার কন্টেন্ট মার্কেটিংয়ের অংশে ব্যর্থ, যা ঠিক করতেই SEO কোর্সের অস্তিত্ব।</li></ol>'),

      h(2, 'বিবেচনার যোগ্য ফরম্যাট', 'formats-worth-considering'),
      table(
        ['ফরম্যাট', 'যার জন্য ভালো'],
        [
          ['How-to গাইড', 'সক্রিয়ভাবে সমাধান খোঁজা মানুষ ধরা'],
          ['ব্যাখ্যা', 'Awareness-পর্যায়ের পাঠক যারা এখনো শব্দভাণ্ডার জানে না'],
          ['কেস স্টাডি', 'Consideration-পর্যায়ের পাঠক যারা প্রমাণ চায়'],
          ['তুলনা', 'বিকল্প ওজন করা মানুষ, প্রতিযোগীর বিরুদ্ধেসহ'],
          ['বিনামূল্যের টুল', 'লিংক আর বারবার ভিজিট আকর্ষণ; তৈরিতে ব্যয়বহুল, একবার তৈরি হলে টেকসই'],
          ['ভিডিও', 'বর্ণনার চেয়ে দেখানো সহজ এমন যেকোনো কিছু'],
        ]
      ),

      h(2, 'পরিমাণের চেয়ে ধারাবাহিকতা', 'consistency-over-volume'),
      p('<p>আপনি সত্যিই বজায় রাখতে পারেন এমন একটি স্থির গতি ছয় মাসের নীরবতা অনুসৃত একগুচ্ছ প্রকাশনাকে হারায়। ধারাবাহিকতা জমে; গুচ্ছ জমে না। এটি ব্যবহারিক কারণেও গুরুত্বপূর্ণ যে যে দর্শক আপনার কাছ থেকে কিছু আশা করতে শিখেছে তা আপনার অস্তিত্ব ভুলে যাওয়া একটির চেয়ে অনেক বেশি মূল্যবান।</p><p>সেই গতি পরিকল্পনা করা পরের পাঠের বিষয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'content-calendar',
  sortOrder: 5,
  en: {
    title: 'Planning a Content Calendar',
    metaTitle: 'Planning a Content Calendar | Learn Computer Academy',
    metaDescription: 'How to plan what to publish and when, at a pace you can sustain, without the calendar becoming its own full-time job.',
    blocks: [
      p('<p>A <b>content calendar</b> is simply a plan of what you will publish and when. Its real purpose is not organisation for its own sake — it is to stop the two failure modes that kill content marketing: publishing nothing because you cannot decide what to write, and publishing frantically for a month and then stopping.</p>'),

      h(2, 'Start With a Sustainable Pace'),
      p('<p>Decide the frequency you can genuinely maintain during a busy week, not an ideal one. One thoughtful article a month, every month, beats four a week for six weeks followed by nothing. The audience notices consistency far more than volume, and so does search.</p><p>It is easy to increase a pace later. Recovering from having visibly abandoned a blog is harder.</p>'),

      h(2, 'What Goes In It'),
      p('<p>Keep it minimal. A calendar that takes effort to maintain will be abandoned along with everything else:</p><ul><li><b>Publish date</b></li><li><b>Working title</b> and the question it answers</li><li><b>Funnel stage</b> — so you notice if everything is aimed at buyers</li><li><b>Target search phrase</b>, if it has one</li><li><b>Status</b> — idea, drafting, ready, published</li></ul><p>A spreadsheet is entirely adequate. Dedicated tools exist and are rarely the difference between publishing and not.</p>'),

      h(2, 'Filling It — Where Ideas Come From'),
      p('<ul><li><b>Questions you get asked repeatedly.</b> If three people asked, three hundred searched.</li><li><b>Search Console queries</b> where you already appear but rank poorly — evidence of demand you are not yet serving well.</li><li><b>Keyword research</b>, as covered in the SEO course.</li><li><b>Things you had to work out yourself.</b> If it took you an afternoon to figure out, it will save someone else an afternoon.</li><li><b>Existing content that needs updating.</b> Refreshing a strong page is often worth more than a new weak one, and it belongs on the calendar as real work.</li></ul>'),

      callout('tip', '<p>Keep a running list of ideas somewhere you can add to in ten seconds. The hardest moment in content marketing is sitting down to write with no idea what to write about — and that moment is entirely avoidable if you captured the idea when you had it.</p>'),

      h(2, 'Balance Across the Funnel'),
      p('<p>Review the calendar occasionally and check the spread of funnel stages. Most people discover their plan is heavily weighted toward the bottom — sales-oriented pieces — because those feel most directly connected to revenue.</p><p>The correction is to deliberately schedule awareness and interest content, which brings in the people who will eventually reach the bottom. Without them, the bottom-of-funnel content has nobody to convert.</p>'),

      h(2, 'Seasonal and Recurring Items'),
      p('<p>Some content is time-anchored: an annual event, an exam period, a seasonal peak in demand. Those pieces need to be published <i>before</i> the demand arrives, not during it — search visibility takes weeks to establish, so an article published the week of a peak is too late to rank for it.</p><p>Working backwards from known dates is one of the few genuinely predictable planning advantages available in this field.</p>'),

      h(2, 'Repurposing'),
      p('<p>One substantial piece can supply several smaller ones: a long guide becomes a series of social posts, a short video, an email, and a section of a newsletter. This is not padding — it is recognising that different people encounter you in different places, and that almost nobody sees everything you publish.</p>'),
    ],
  },
  bn: {
    title: 'একটি কন্টেন্ট ক্যালেন্ডার পরিকল্পনা',
    metaTitle: 'একটি কন্টেন্ট ক্যালেন্ডার পরিকল্পনা | Learn Computer Academy',
    metaDescription: 'কী আর কখন প্রকাশ করবেন তা কীভাবে পরিকল্পনা করবেন, এমন গতিতে যা আপনি বজায় রাখতে পারেন, ক্যালেন্ডারটি নিজেই একটি পূর্ণকালীন কাজ না হয়ে।',
    blocks: [
      p('<p>একটি <b>কন্টেন্ট ক্যালেন্ডার</b> কেবল আপনি কী আর কখন প্রকাশ করবেন তার একটি পরিকল্পনা। এর আসল উদ্দেশ্য নিজের জন্য সংগঠন নয় — এটি সেই দুটি ব্যর্থতার ধরন থামানো যা কন্টেন্ট মার্কেটিং মেরে ফেলে: কী লিখবেন ঠিক করতে না পেরে কিছুই প্রকাশ না করা, আর এক মাস উন্মত্তভাবে প্রকাশ করে তারপর থেমে যাওয়া।</p>'),

      h(2, 'একটি টেকসই গতি দিয়ে শুরু করুন', 'start-with-a-sustainable-pace'),
      p('<p>একটি আদর্শ সপ্তাহ নয়, একটি ব্যস্ত সপ্তাহে আপনি সত্যিই যে ফ্রিকোয়েন্সি বজায় রাখতে পারেন তা ঠিক করুন। মাসে একটি চিন্তাশীল প্রবন্ধ, প্রতি মাসে, ছয় সপ্তাহ ধরে সপ্তাহে চারটির পর কিছুই না-কে হারায়। দর্শক পরিমাণের চেয়ে ধারাবাহিকতা অনেক বেশি লক্ষ্য করে, আর সার্চও তাই।</p><p>পরে গতি বাড়ানো সহজ। দৃশ্যত একটি ব্লগ ছেড়ে দেওয়া থেকে ফেরা কঠিন।</p>'),

      h(2, 'এতে কী থাকে', 'what-goes-in-it'),
      p('<p>এটি ন্যূনতম রাখুন। যে ক্যালেন্ডার রক্ষণাবেক্ষণে পরিশ্রম লাগে তা বাকি সবকিছুর সাথে পরিত্যক্ত হবে:</p><ul><li><b>প্রকাশের তারিখ</b></li><li><b>কাজ চালানোর শিরোনাম</b> আর এটি যে প্রশ্নের উত্তর দেয়</li><li><b>Funnel পর্যায়</b> — যাতে সবকিছু ক্রেতার দিকে লক্ষ্য করা কিনা লক্ষ্য করেন</li><li><b>লক্ষ্য সার্চ বাক্যাংশ</b>, থাকলে</li><li><b>অবস্থা</b> — ধারণা, খসড়া, প্রস্তুত, প্রকাশিত</li></ul><p>একটি spreadsheet সম্পূর্ণ যথেষ্ট। নির্দিষ্ট টুল আছে আর সেগুলো খুব কমই প্রকাশ করা আর না করার মধ্যে পার্থক্য।</p>'),

      h(2, 'এটি পূরণ করা — ধারণা কোথা থেকে আসে', 'filling-it-where-ideas-come-from'),
      p('<ul><li><b>যে প্রশ্ন আপনাকে বারবার করা হয়।</b> তিনজন জিজ্ঞাসা করলে, তিনশো সার্চ করেছে।</li><li><b>Search Console query</b> যেখানে আপনি ইতিমধ্যে দেখা যান কিন্তু খারাপ র‍্যাংক করেন — এমন চাহিদার প্রমাণ যা আপনি এখনো ভালোভাবে সেবা দিচ্ছেন না।</li><li><b>Keyword research</b>, SEO কোর্সে কভার করা।</li><li><b>যা আপনাকে নিজে বের করতে হয়েছে।</b> এটি বের করতে আপনার একটি বিকেল লাগলে, এটি অন্য কারো একটি বিকেল বাঁচাবে।</li><li><b>আপডেট দরকার এমন বিদ্যমান কন্টেন্ট।</b> একটি শক্তিশালী পাতা সতেজ করা প্রায়ই একটি নতুন দুর্বল পাতার চেয়ে বেশি মূল্যবান, আর এটি বাস্তব কাজ হিসেবে ক্যালেন্ডারে থাকা উচিত।</li></ul>'),

      callout('tip', '<p>ধারণার একটি চলমান তালিকা এমন কোথাও রাখুন যেখানে আপনি দশ সেকেন্ডে যোগ করতে পারেন। কন্টেন্ট মার্কেটিংয়ের সবচেয়ে কঠিন মুহূর্ত হলো কী নিয়ে লিখবেন কোনো ধারণা ছাড়া লিখতে বসা — আর সেই মুহূর্ত সম্পূর্ণ এড়ানো যায় যদি ধারণাটি যখন এসেছিল তখন ধরে রাখতেন।</p>'),

      h(2, 'Funnel জুড়ে ভারসাম্য', 'balance-across-the-funnel'),
      p('<p>মাঝে মাঝে ক্যালেন্ডার পর্যালোচনা করুন আর funnel পর্যায়ের বিস্তার যাচাই করুন। বেশিরভাগ মানুষ আবিষ্কার করে তাদের পরিকল্পনা নিচের দিকে ভারীভাবে ঝুঁকে আছে — বিক্রি-কেন্দ্রিক অংশ — কারণ সেগুলো আয়ের সাথে সবচেয়ে সরাসরি সংযুক্ত মনে হয়।</p><p>সংশোধনটি হলো ইচ্ছাকৃতভাবে awareness আর interest কন্টেন্ট সূচিত করা, যা সেই মানুষদের আনে যারা শেষে নিচে পৌঁছাবে। তাদের ছাড়া, funnel-এর নিচের কন্টেন্টের রূপান্তর করার কেউ নেই।</p>'),

      h(2, 'ঋতুনির্ভর আর পুনরাবৃত্ত জিনিস', 'seasonal-and-recurring-items'),
      p('<p>কিছু কন্টেন্ট সময়-নোঙর করা: একটি বার্ষিক ইভেন্ট, একটি পরীক্ষার সময়, চাহিদার একটি ঋতুনির্ভর শিখর। সেই অংশগুলো চাহিদা আসার <i>আগে</i> প্রকাশ করতে হয়, এর সময় নয় — সার্চ দৃশ্যমানতা প্রতিষ্ঠায় সপ্তাহ লাগে, তাই একটি শিখরের সপ্তাহে প্রকাশিত একটি প্রবন্ধ এর জন্য র‍্যাংক করতে দেরি হয়ে যায়।</p><p>জানা তারিখ থেকে পেছনে হিসাব করা এই ক্ষেত্রে উপলব্ধ অল্প কয়েকটি সত্যিই অনুমানযোগ্য পরিকল্পনার সুবিধার একটি।</p>'),

      h(2, 'পুনর্ব্যবহার', 'repurposing'),
      p('<p>একটি বড় অংশ কয়েকটি ছোট অংশ সরবরাহ করতে পারে: একটি দীর্ঘ গাইড একগুচ্ছ সোশ্যাল পোস্ট, একটি ছোট ভিডিও, একটি ইমেইল, আর একটি নিউজলেটারের একটি অংশ হয়ে ওঠে। এটি ভরাট নয় — এটি স্বীকার করা যে ভিন্ন মানুষ ভিন্ন জায়গায় আপনার মুখোমুখি হয়, আর প্রায় কেউই আপনার প্রকাশিত সবকিছু দেখে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'blogging-for-business',
  sortOrder: 6,
  en: {
    title: 'Blogging for Business',
    metaTitle: 'Blogging for Business | Learn Computer Academy',
    metaDescription: 'What a business blog is actually for, what to write on it, and the common mistakes that make most business blogs pointless.',
    blocks: [
      p('<p>A business blog is the most common form content marketing takes, and also the most commonly wasted. The difference between one that works and one that does not is almost entirely a question of who it is written for.</p>'),

      h(2, 'What It Is Actually For'),
      p('<p>A business blog exists to answer the questions your potential customers have <i>before</i> they are ready to buy. Every article should be findable by someone searching for a problem you can help with.</p><p>It is not a company news feed. Announcements of office moves, staff birthdays, and anniversary celebrations serve the business, not the reader — nobody searches for them, and they attract nobody.</p>'),

      callout('warning', '<p>The clearest sign of a blog written for the wrong audience: every post begins "We are pleased to announce". Those posts do no harm, but they also do nothing, and they consume exactly the effort that could have gone into something a stranger might find.</p>'),

      h(2, 'What to Write'),
      p('<ul><li><b>Answers to questions you get asked.</b> The most reliable source of good topics, and the easiest to write, because you have already answered them out loud many times.</li><li><b>How-to guides</b> for problems in your field.</li><li><b>Explanations of things people misunderstand</b>, especially where the misunderstanding costs them money.</li><li><b>Comparisons</b> — including honest ones where you are not always the answer.</li><li><b>Case studies</b> showing real work, with real detail.</li><li><b>Mistakes to avoid</b>, drawn from what you actually see go wrong.</li></ul>'),

      h(2, 'Writing It Well'),
      p('<ol><li><b>Answer early.</b> Give the answer near the top, then explain. Readers who wanted the answer got it; readers who want depth keep reading.</li><li><b>Write to one person.</b> "You" rather than "our valued clients". Vague plural address is a reliable way to sound like nobody in particular.</li><li><b>Be specific.</b> Real numbers, real examples, real screenshots. Generality is what makes content forgettable.</li><li><b>Break it up.</b> Headings, short paragraphs, lists. Nobody reads a wall of text on a phone.</li><li><b>Include a next step.</b> A related article, a service page, a newsletter signup. Attention without a destination is wasted.</li></ol>'),

      h(2, 'Being Honest Works Better'),
      p('<p>The instinct is to present your service as right for everyone. Content that admits limitations — who this is not for, when a cheaper option is fine, what you are not good at — is consistently more persuasive, because it is obviously not just sales copy. It also filters out enquiries that were never going to work out, which saves everyone time.</p>'),

      h(2, 'Maintaining It'),
      p('<p>An old post that still ranks and still brings readers is a real asset, and it decays if the information in it goes out of date. Revisiting the handful of posts that actually get traffic — checking facts, updating anything stale, improving what is thin — is usually a better use of an hour than writing something new.</p><p>This is the same argument the SEO course makes about content freshness, and it is worth acting on because almost nobody does.</p>'),
    ],
  },
  bn: {
    title: 'ব্যবসার জন্য ব্লগিং',
    metaTitle: 'ব্যবসার জন্য ব্লগিং | Learn Computer Academy',
    metaDescription: 'একটি ব্যবসায়িক ব্লগ আসলে কীসের জন্য, এতে কী লিখবেন, আর যে সাধারণ ভুলগুলো বেশিরভাগ ব্যবসায়িক ব্লগকে অর্থহীন করে।',
    blocks: [
      p('<p>একটি ব্যবসায়িক ব্লগ কন্টেন্ট মার্কেটিংয়ের সবচেয়ে সাধারণ রূপ, আর সবচেয়ে বেশি নষ্ট হওয়াও। যেটি কাজ করে আর যেটি করে না তার মধ্যে পার্থক্য প্রায় সম্পূর্ণভাবে এটি কার জন্য লেখা তার প্রশ্ন।</p>'),

      h(2, 'এটি আসলে কীসের জন্য', 'what-it-is-actually-for'),
      p('<p>একটি ব্যবসায়িক ব্লগের অস্তিত্ব আপনার সম্ভাব্য গ্রাহকদের কেনার জন্য প্রস্তুত হওয়ার <i>আগে</i> যে প্রশ্ন থাকে তার উত্তর দিতে। প্রতিটি প্রবন্ধ আপনি সাহায্য করতে পারেন এমন একটি সমস্যা সার্চ করা কারো কাছে খুঁজে পাওয়ার যোগ্য হওয়া উচিত।</p><p>এটি একটি কোম্পানির সংবাদ ফিড নয়। অফিস সরানো, কর্মীর জন্মদিন, আর বার্ষিকী উদযাপনের ঘোষণা ব্যবসাকে সেবা দেয়, পাঠককে নয় — কেউ সেগুলো সার্চ করে না, আর সেগুলো কাউকে আকর্ষণ করে না।</p>'),

      callout('warning', '<p>ভুল দর্শকের জন্য লেখা একটি ব্লগের সবচেয়ে স্পষ্ট চিহ্ন: প্রতিটি পোস্ট "We are pleased to announce" দিয়ে শুরু হয়। সেই পোস্টগুলো ক্ষতি করে না, কিন্তু সেগুলো কিছুও করে না, আর সেগুলো ঠিক সেই পরিশ্রম খায় যা এমন কিছুতে যেতে পারত যা একজন অচেনা মানুষ খুঁজে পেতে পারত।</p>'),

      h(2, 'কী লিখবেন', 'what-to-write'),
      p('<ul><li><b>আপনাকে যে প্রশ্ন করা হয় তার উত্তর।</b> ভালো বিষয়ের সবচেয়ে নির্ভরযোগ্য উৎস, আর লিখতে সবচেয়ে সহজ, কারণ আপনি ইতিমধ্যে সেগুলোর উত্তর মুখে অনেকবার দিয়েছেন।</li><li>আপনার ক্ষেত্রের সমস্যার জন্য <b>How-to গাইড</b>।</li><li><b>মানুষ যা ভুল বোঝে তার ব্যাখ্যা</b>, বিশেষত যেখানে ভুল বোঝাটি তাদের টাকা খরচ করায়।</li><li><b>তুলনা</b> — সৎগুলোসহ যেখানে আপনি সবসময় উত্তর নন।</li><li><b>কেস স্টাডি</b> যা বাস্তব কাজ দেখায়, বাস্তব বিবরণসহ।</li><li><b>এড়ানোর মতো ভুল</b>, আপনি আসলে যা ভুল হতে দেখেন তা থেকে নেওয়া।</li></ul>'),

      h(2, 'এটি ভালোভাবে লেখা', 'writing-it-well'),
      p('<ol><li><b>আগে উত্তর দিন।</b> উপরের দিকে উত্তরটি দিন, তারপর ব্যাখ্যা করুন। যে পাঠক উত্তরটি চেয়েছিল সে পেয়েছে; যে পাঠক গভীরতা চায় সে পড়তে থাকে।</li><li><b>একজন ব্যক্তির উদ্দেশে লিখুন।</b> "our valued clients"-এর বদলে "আপনি"। অস্পষ্ট বহুবচনে সম্বোধন কারো মতো না শোনানোর একটি নির্ভরযোগ্য উপায়।</li><li><b>নির্দিষ্ট হন।</b> বাস্তব সংখ্যা, বাস্তব উদাহরণ, বাস্তব স্ক্রিনশট। সাধারণতাই কন্টেন্টকে ভুলে যাওয়ার মতো করে।</li><li><b>এটি ভাগ করুন।</b> Heading, ছোট অনুচ্ছেদ, তালিকা। ফোনে কেউ টেক্সটের একটি দেয়াল পড়ে না।</li><li><b>একটি পরবর্তী ধাপ রাখুন।</b> একটি সম্পর্কিত প্রবন্ধ, একটি সেবার পাতা, একটি নিউজলেটার signup। গন্তব্য ছাড়া মনোযোগ নষ্ট হয়।</li></ol>'),

      h(2, 'সৎ হওয়া ভালো কাজ করে', 'being-honest-works-better'),
      p('<p>প্রবৃত্তি হলো আপনার সেবাকে সবার জন্য সঠিক হিসেবে উপস্থাপন করা। যে কন্টেন্ট সীমাবদ্ধতা স্বীকার করে — এটি কার জন্য নয়, কখন একটি সস্তা বিকল্প ঠিক আছে, আপনি কীসে ভালো নন — তা ধারাবাহিকভাবে বেশি প্ররোচক, কারণ এটি স্পষ্টতই শুধু বিক্রির লেখা নয়। এটি এমন জিজ্ঞাসাও ছেঁকে ফেলে যা কখনো ফলপ্রসূ হতো না, যা সবার সময় বাঁচায়।</p>'),

      h(2, 'এটি রক্ষণাবেক্ষণ', 'maintaining-it'),
      p('<p>যে পুরোনো পোস্ট এখনো র‍্যাংক করে আর এখনো পাঠক আনে তা একটি বাস্তব সম্পদ, আর এতে থাকা তথ্য সেকেলে হলে এটি ক্ষয় হয়। যে মুষ্টিমেয় পোস্ট আসলে ট্রাফিক পায় সেগুলো আবার দেখা — তথ্য যাচাই, বাসি যেকোনো কিছু আপডেট, পাতলা যা তা উন্নত করা — সাধারণত নতুন কিছু লেখার চেয়ে এক ঘণ্টার ভালো ব্যবহার।</p><p>এটি কন্টেন্টের সতেজতা নিয়ে SEO কোর্সের একই যুক্তি, আর এতে কাজ করা সার্থক কারণ প্রায় কেউই করে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'web-copywriting',
  sortOrder: 7,
  en: {
    title: 'Web Copywriting Basics',
    metaTitle: 'Web Copywriting Basics | Learn Computer Academy',
    metaDescription: 'How to write text for the web that people actually read — clear, specific, focused on the reader rather than the business.',
    blocks: [
      p('<p><b>Copywriting</b> is writing intended to get someone to do something. On the web it competes with a back button that is always one click away, which changes how it has to be written.</p>'),

      h(2, 'Write About the Reader, Not Yourself'),
      p('<p>The most common weakness in business writing is that it describes the business rather than the reader\'s situation.</p>'),
      table(
        ['Business-focused', 'Reader-focused'],
        [
          ['We are a leading provider of IT solutions', 'Your laptop, fixed in 48 hours'],
          ['Our team has 20 years of combined experience', 'We have seen this problem before, and we know what causes it'],
          ['We offer a comprehensive range of services', 'Tell us what stopped working and we will tell you what it costs'],
        ]
      ),
      p('<p>Experience and credentials still matter — but they land far better as evidence supporting a claim the reader cares about than as an opening statement about yourself.</p>'),

      h(2, 'Features and Benefits'),
      p('<p>A <b>feature</b> is what something is. A <b>benefit</b> is what it does for the person. Both belong on a page, but the benefit has to come first, because it is what makes the feature worth reading about.</p><ul><li><i>Feature:</i> 500GB solid state drive. <i>Benefit:</i> your computer starts in seconds instead of minutes.</li><li><i>Feature:</i> evening classes. <i>Benefit:</i> you can train without leaving your current job.</li></ul>'),

      h(2, 'Be Specific'),
      p('<p>Vague claims are invisible because every competitor makes the same ones. "High quality", "affordable", "professional", "reliable" — these words appear on every business website and therefore distinguish none of them.</p><p>Specificity is what makes a claim believable: not "fast service" but "most repairs done same day"; not "affordable courses" but the actual price; not "experienced trainers" but what they have actually built.</p>'),

      callout('tip', '<p>A useful test: could a competitor put this exact sentence on their site without changing anything? If yes, it is not saying anything. Rewrite it until only you could have written it.</p>', 'The competitor test'),

      h(2, 'Structure for Scanning'),
      p('<p>People scan web pages before deciding whether to read them. Copy has to survive that first pass:</p><ul><li><b>Front-load the point.</b> The first sentence of a paragraph should carry its meaning.</li><li><b>Short paragraphs.</b> Two to four lines. Long blocks get skipped whole.</li><li><b>Descriptive subheadings</b> so someone skimming can find their section.</li><li><b>Bold the phrase that matters</b>, not whole sentences — bolding everything bolds nothing.</li><li><b>Lists for things that are genuinely lists.</b></li></ul>'),

      h(2, 'Plain Language'),
      p('<p>Industry vocabulary excludes exactly the people who most need explaining to. If a term is necessary, define it the first time. If it is not necessary, remove it.</p><p>This is not about writing simplistically — it is about not making a reader work to decode a sentence when a clearer one was available. Complexity in the subject is fine; complexity in the sentence is a choice.</p>'),

      h(2, 'Edit Downwards'),
      p('<p>First drafts are always longer than they need to be. The most reliable improvement available to any piece of writing is cutting it: remove qualifiers, delete sentences that restate the previous one, and take out anything the reader already assumed.</p>'),
    ],
  },
  bn: {
    title: 'ওয়েব Copywriting-এর মূল বিষয়',
    metaTitle: 'ওয়েব Copywriting-এর মূল বিষয় | Learn Computer Academy',
    metaDescription: 'ওয়েবের জন্য এমন টেক্সট কীভাবে লিখবেন যা মানুষ সত্যিই পড়ে — স্পষ্ট, নির্দিষ্ট, ব্যবসার বদলে পাঠকের উপর কেন্দ্রীভূত।',
    blocks: [
      p('<p><b>Copywriting</b> হলো কাউকে কিছু করানোর উদ্দেশ্যে লেখা। ওয়েবে এটি এমন একটি back বোতামের সাথে প্রতিযোগিতা করে যা সবসময় এক ক্লিক দূরে, যা এটি কীভাবে লিখতে হবে তা বদলে দেয়।</p>'),

      h(2, 'নিজের নয়, পাঠকের সম্পর্কে লিখুন', 'write-about-the-reader-not-yourself'),
      p('<p>ব্যবসায়িক লেখার সবচেয়ে সাধারণ দুর্বলতা হলো এটি পাঠকের পরিস্থিতির বদলে ব্যবসাটি বর্ণনা করে।</p>'),
      table(
        ['ব্যবসা-কেন্দ্রিক', 'পাঠক-কেন্দ্রিক'],
        [
          ['We are a leading provider of IT solutions', 'Your laptop, fixed in 48 hours'],
          ['Our team has 20 years of combined experience', 'We have seen this problem before, and we know what causes it'],
          ['We offer a comprehensive range of services', 'Tell us what stopped working and we will tell you what it costs'],
        ]
      ),
      p('<p>অভিজ্ঞতা আর যোগ্যতা এখনো গুরুত্বপূর্ণ — কিন্তু সেগুলো নিজের সম্পর্কে একটি প্রারম্ভিক বিবৃতির চেয়ে পাঠক যে দাবির পরোয়া করে তার সমর্থনে প্রমাণ হিসেবে অনেক ভালো লাগে।</p>'),

      h(2, 'Feature আর Benefit', 'features-and-benefits'),
      p('<p>একটি <b>feature</b> হলো কিছু কী। একটি <b>benefit</b> হলো এটি ব্যক্তিটির জন্য কী করে। দুটোই একটি পাতায় থাকে, কিন্তু benefit আগে আসতে হবে, কারণ এটিই feature-টিকে পড়ার যোগ্য করে।</p><ul><li><i>Feature:</i> ৫০০GB solid state drive। <i>Benefit:</i> আপনার কম্পিউটার মিনিটের বদলে সেকেন্ডে চালু হয়।</li><li><i>Feature:</i> সন্ধ্যাকালীন ক্লাস। <i>Benefit:</i> আপনি বর্তমান চাকরি না ছেড়ে প্রশিক্ষণ নিতে পারেন।</li></ul>'),

      h(2, 'নির্দিষ্ট হন', 'be-specific'),
      p('<p>অস্পষ্ট দাবি অদৃশ্য কারণ প্রতিটি প্রতিযোগী একই দাবি করে। "High quality", "affordable", "professional", "reliable" — এই শব্দগুলো প্রতিটি ব্যবসায়িক ওয়েবসাইটে দেখা যায় আর তাই কোনোটিকেই আলাদা করে না।</p><p>নির্দিষ্টতাই একটি দাবিকে বিশ্বাসযোগ্য করে: "fast service" নয় বরং "most repairs done same day"; "affordable courses" নয় বরং আসল দাম; "experienced trainers" নয় বরং তারা আসলে কী তৈরি করেছে।</p>'),

      callout('tip', '<p>একটি কাজের পরীক্ষা: একজন প্রতিযোগী কি কিছু না বদলে এই হুবহু বাক্যটি তাদের সাইটে রাখতে পারত? হ্যাঁ হলে, এটি কিছুই বলছে না। এটি এমনভাবে পুনর্লিখন করুন যতক্ষণ না শুধু আপনিই এটি লিখতে পারতেন।</p>', 'প্রতিযোগীর পরীক্ষা'),

      h(2, 'স্ক্যানের জন্য গঠন', 'structure-for-scanning'),
      p('<p>মানুষ পড়বে কিনা সিদ্ধান্ত নেওয়ার আগে ওয়েব পাতা স্ক্যান করে। লেখাকে সেই প্রথম পাস টিকে থাকতে হয়:</p><ul><li><b>মূল কথা সামনে আনুন।</b> একটি অনুচ্ছেদের প্রথম বাক্য এর অর্থ বহন করা উচিত।</li><li><b>ছোট অনুচ্ছেদ।</b> দুই থেকে চার লাইন। লম্বা ব্লক পুরোটাই বাদ পড়ে।</li><li><b>বর্ণনামূলক উপশিরোনাম</b> যাতে স্ক্যান করা কেউ তার অংশ খুঁজে পায়।</li><li><b>যে বাক্যাংশ গুরুত্বপূর্ণ তাতে bold</b>, পুরো বাক্যে নয় — সবকিছু bold করা মানে কিছুই bold না করা।</li><li><b>যা সত্যিই তালিকা তার জন্য তালিকা।</b></li></ul>'),

      h(2, 'সহজ ভাষা', 'plain-language'),
      p('<p>শিল্পের শব্দভাণ্ডার ঠিক সেই মানুষদের বাদ দেয় যাদের সবচেয়ে বেশি ব্যাখ্যা দরকার। একটি term প্রয়োজনীয় হলে, প্রথমবার সংজ্ঞা দিন। প্রয়োজনীয় না হলে, সরিয়ে দিন।</p><p>এটি সরলভাবে লেখা নিয়ে নয় — এটি একটি স্পষ্টতর বাক্য উপলব্ধ থাকতে একজন পাঠককে একটি বাক্য বুঝতে খাটতে না দেওয়া নিয়ে। বিষয়ে জটিলতা ঠিক আছে; বাক্যে জটিলতা একটি পছন্দ।</p>'),

      h(2, 'কমিয়ে সম্পাদনা করুন', 'edit-downwards'),
      p('<p>প্রথম খসড়া সবসময় প্রয়োজনের চেয়ে দীর্ঘ হয়। যেকোনো লেখার জন্য উপলব্ধ সবচেয়ে নির্ভরযোগ্য উন্নতি হলো এটি কাটা: qualifier সরান, আগেরটি পুনরায় বলা বাক্য মুছুন, আর পাঠক ইতিমধ্যে ধরে নিয়েছে এমন যেকোনো কিছু বাদ দিন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'landing-pages',
  sortOrder: 8,
  en: {
    title: 'Landing Pages',
    metaTitle: 'Landing Pages | Learn Computer Academy',
    metaDescription: 'What makes a landing page different from an ordinary page, why message match matters, and the elements that belong on one.',
    blocks: [
      p('<p>A <b>landing page</b> is a page built around one action. Someone arrives from an ad, an email, or a social post, and the page has one job: make that specific next step as easy and obvious as possible.</p>'),

      h(2, 'How It Differs From a Normal Page'),
      p('<p>An ordinary website page serves many purposes — informing, navigating, linking onward. A landing page deliberately narrows all of that:</p>'),
      table(
        ['', 'Ordinary page', 'Landing page'],
        [
          ['Number of goals', 'Several', 'One'],
          ['Navigation', 'Full site menu', 'Often reduced or removed'],
          ['Traffic source', 'Anywhere', 'One specific campaign'],
          ['Success measure', 'Varies', 'Conversion rate for the single action'],
        ]
      ),
      p('<p>The reduced navigation is the part people find counterintuitive. It is deliberate: every additional link is another way to leave without doing the thing the page exists for.</p>'),

      h(2, 'Message Match'),
      p('<p>The most common landing page failure is a mismatch between what brought someone there and what greets them. If an ad promises "50% off beginner Python courses" and the landing page is a general homepage listing every course, the visitor has to hunt — and most will not.</p><p>The promise that got the click should be the first thing visible after it. Same offer, same wording, same subject. This one alignment does more for conversion than most design changes.</p>'),

      img(
        'docs/img/marketing/landing-page-1',
        'Diagram of a landing page layout showing a headline, supporting text, an image, trust signals, and a single prominent call-to-action button',
        1024, 768,
        'One page, one action — everything on it either supports the decision or gets removed.'
      ),

      h(2, 'What Belongs On One'),
      p('<ol><li><b>A headline that matches the promise</b> that brought them there.</li><li><b>A short supporting line</b> explaining what this is and who it is for.</li><li><b>The benefit, stated plainly</b> — what changes for them.</li><li><b>Evidence</b> — testimonials, examples of work, numbers, credentials. This is where trust is built or lost.</li><li><b>An answer to the obvious objection.</b> Price, time commitment, difficulty, risk. Ignoring it does not make the reader stop thinking about it.</li><li><b>One clear call to action</b>, repeated if the page is long, but always the same action.</li></ol>'),

      h(2, 'Keep the Form Short'),
      p('<p>Every field on a form is a reason to abandon it. Ask only for what you genuinely need at this step — usually a name and an email address. Phone number, company, job title, and "how did you hear about us" can all be asked later, once there is a relationship.</p>'),

      callout('note', '<p>A useful way to think about it: each field costs you some proportion of the people who would otherwise have completed the form. Sometimes that cost is worth paying — a field that qualifies serious enquiries can be worth losing casual ones. But it should be a deliberate trade, not a form that grew field by field because each seemed harmless.</p>'),

      h(2, 'Test One Thing at a Time'),
      p('<p>Landing pages are the easiest thing in marketing to test, because the goal is a single measurable action. Change one element — the headline, the button text, the image — and compare. Changing several at once tells you the result but not the cause.</p>'),
    ],
  },
  bn: {
    title: 'Landing পাতা',
    metaTitle: 'Landing পাতা | Learn Computer Academy',
    metaDescription: 'একটি landing পাতাকে সাধারণ পাতা থেকে কী আলাদা করে, message match কেন গুরুত্বপূর্ণ, আর একটিতে কোন উপাদানগুলো থাকে।',
    blocks: [
      p('<p>একটি <b>landing পাতা</b> হলো একটি কাজের চারপাশে তৈরি একটি পাতা। কেউ একটি বিজ্ঞাপন, একটি ইমেইল, বা একটি সোশ্যাল পোস্ট থেকে আসে, আর পাতাটির একটি কাজ: সেই নির্দিষ্ট পরবর্তী ধাপটিকে যতটা সম্ভব সহজ আর স্পষ্ট করা।</p>'),

      h(2, 'এটি একটি স্বাভাবিক পাতা থেকে কীভাবে আলাদা', 'how-it-differs-from-a-normal-page'),
      p('<p>একটি সাধারণ ওয়েবসাইটের পাতা অনেক উদ্দেশ্য সেবা দেয় — জানানো, চলাচল, সামনে লিংক করা। একটি landing পাতা ইচ্ছাকৃতভাবে সেই সবকিছু সংকীর্ণ করে:</p>'),
      table(
        ['', 'সাধারণ পাতা', 'Landing পাতা'],
        [
          ['লক্ষ্যের সংখ্যা', 'কয়েকটি', 'একটি'],
          ['Navigation', 'সম্পূর্ণ সাইট মেনু', 'প্রায়ই কমানো বা সরানো'],
          ['ট্রাফিকের উৎস', 'যেকোনো জায়গা', 'একটি নির্দিষ্ট campaign'],
          ['সাফল্যের মাপ', 'ভিন্ন হয়', 'একক কাজটির conversion rate'],
        ]
      ),
      p('<p>কমানো navigation-টিই মানুষ বিপরীতমুখী মনে করে। এটি ইচ্ছাকৃত: প্রতিটি অতিরিক্ত লিংক পাতাটি যার জন্য আছে সেটি না করে চলে যাওয়ার আরেকটি উপায়।</p>'),

      h(2, 'Message Match', 'message-match'),
      p('<p>সবচেয়ে সাধারণ landing পাতার ব্যর্থতা হলো কেউ কী নিয়ে সেখানে এসেছে আর তাকে কী স্বাগত জানায় তার মধ্যে অমিল। একটি বিজ্ঞাপন যদি "50% off beginner Python courses" প্রতিশ্রুতি দেয় আর landing পাতাটি প্রতিটি কোর্স তালিকাভুক্ত করা একটি সাধারণ হোমপেজ হয়, ভিজিটরকে খুঁজতে হয় — আর বেশিরভাগ খুঁজবে না।</p><p>যে প্রতিশ্রুতি ক্লিক এনেছে সেটিই এর পরে দৃশ্যমান প্রথম জিনিস হওয়া উচিত। একই অফার, একই শব্দ, একই বিষয়। এই একটি সারিবদ্ধতা বেশিরভাগ ডিজাইন পরিবর্তনের চেয়ে conversion-এর জন্য বেশি করে।</p>'),

      img(
        'docs/img/marketing/landing-page-1',
        'একটি landing পাতার লেআউটের ডায়াগ্রাম যেখানে একটি শিরোনাম, সহায়ক টেক্সট, একটি ছবি, বিশ্বাসের সংকেত, আর একটি একক প্রকট call-to-action বোতাম দেখানো হয়েছে',
        1024, 768,
        'এক পাতা, এক কাজ — এতে থাকা সবকিছু হয় সিদ্ধান্তকে সমর্থন করে নয়তো সরিয়ে দেওয়া হয়।'
      ),

      h(2, 'একটিতে কী থাকে', 'what-belongs-on-one'),
      p('<ol><li><b>একটি শিরোনাম যা সেই প্রতিশ্রুতির সাথে মেলে</b> যা তাদের এনেছে।</li><li><b>একটি ছোট সহায়ক লাইন</b> ব্যাখ্যা করে এটি কী আর কার জন্য।</li><li><b>Benefit, সরলভাবে বলা</b> — তাদের জন্য কী বদলায়।</li><li><b>প্রমাণ</b> — প্রশংসাপত্র, কাজের উদাহরণ, সংখ্যা, যোগ্যতা। এখানেই বিশ্বাস তৈরি হয় বা হারায়।</li><li><b>স্পষ্ট আপত্তির একটি উত্তর।</b> দাম, সময়ের প্রতিশ্রুতি, কঠিনতা, ঝুঁকি। এটি উপেক্ষা করলে পাঠক এটি নিয়ে ভাবা বন্ধ করে না।</li><li><b>একটি স্পষ্ট call to action</b>, পাতাটি দীর্ঘ হলে পুনরাবৃত্ত, কিন্তু সবসময় একই কাজ।</li></ol>'),

      h(2, 'Form ছোট রাখুন', 'keep-the-form-short'),
      p('<p>একটি form-এর প্রতিটি ফিল্ড এটি ছেড়ে যাওয়ার একটি কারণ। এই ধাপে আপনার সত্যিই যা দরকার শুধু তাই চান — সাধারণত একটি নাম আর একটি ইমেইল ঠিকানা। ফোন নম্বর, কোম্পানি, পদবি, আর "how did you hear about us" সবই পরে জিজ্ঞাসা করা যায়, একবার একটি সম্পর্ক হলে।</p>'),

      callout('note', '<p>এটি নিয়ে ভাবার একটি কাজের উপায়: প্রতিটি ফিল্ড আপনার সেই মানুষদের একটি অনুপাত খরচ করায় যারা অন্যথায় form-টি সম্পূর্ণ করত। কখনো কখনো সেই খরচ দেওয়ার যোগ্য — যে ফিল্ড গুরুতর জিজ্ঞাসা যাচাই করে তা সাধারণগুলো হারানোর যোগ্য হতে পারে। কিন্তু এটি একটি ইচ্ছাকৃত বিনিময় হওয়া উচিত, এমন একটি form নয় যা ফিল্ড ধরে ধরে বেড়েছে কারণ প্রতিটি নিরীহ মনে হয়েছিল।</p>'),

      h(2, 'একবারে একটি জিনিস পরীক্ষা করুন', 'test-one-thing-at-a-time'),
      p('<p>Landing পাতা মার্কেটিংয়ে পরীক্ষা করার সবচেয়ে সহজ জিনিস, কারণ লক্ষ্যটি একটি একক মাপযোগ্য কাজ। একটি উপাদান বদলান — শিরোনাম, বোতামের টেক্সট, ছবি — আর তুলনা করুন। একসাথে কয়েকটি বদলালে আপনি ফলাফল জানবেন কিন্তু কারণ নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'calls-to-action',
  sortOrder: 9,
  en: {
    title: 'Calls to Action',
    metaTitle: 'Calls to Action | Learn Computer Academy',
    metaDescription: 'How to ask clearly for the next step, why one strong ask beats several weak ones, and what makes button text work.',
    blocks: [
      p('<p>A <b>call to action</b> is the moment you ask someone to do something. It is a small piece of a page and a disproportionate share of whether the page works, because content that never asks for anything reliably gets nothing.</p>'),

      h(2, 'Ask for One Thing'),
      p('<p>A page offering three equally-weighted options — buy now, subscribe, contact us, follow us — makes the reader decide which matters, and the most common resolution to that decision is doing none of them.</p><p>Pick the single most valuable action for that page and make it visually dominant. Secondary options can exist, but they should look secondary.</p>'),

      h(2, 'Write the Button for the Person Clicking It'),
      p('<p>Generic button text makes the reader work out what will happen. Specific text tells them.</p>'),
      table(
        ['Weak', 'Better'],
        [
          ['Submit', 'Send my enquiry'],
          ['Click here', 'Download the checklist'],
          ['Learn more', 'See the course syllabus'],
          ['Sign up', 'Start the free trial'],
        ]
      ),
      p('<p>A useful pattern is to complete the sentence "I want to…" from the reader\'s point of view. "I want to… see the course syllabus" reads naturally; "I want to… submit" does not.</p>'),

      h(2, 'Reduce the Perceived Cost'),
      p('<p>Every action has a cost in the reader\'s mind — time, money, effort, or the risk of being contacted repeatedly afterwards. Naming and lowering that cost directly increases the number of people who act:</p><ul><li>"Takes two minutes"</li><li>"No card required"</li><li>"One email a month, unsubscribe any time"</li><li>"We will reply within one working day"</li></ul><p>These lines look small. They address the specific hesitation that was actually stopping someone.</p>'),

      h(2, 'Placement'),
      p('<p>A call to action should appear where the reader is likely to be convinced, which is not always at the bottom. On a short page, once near the top is often right. On a long page, repeat the same action at natural decision points — after the benefits, after the evidence, at the end.</p><p>Repeating it is fine. Changing what it asks for partway down is not.</p>'),

      callout('warning', '<p>Do not hide the primary action below a long page of text on mobile. A button that requires eight scrolls to reach is functionally invisible to most visitors, however well written it is.</p>'),

      h(2, 'Match the Ask to the Stage'),
      p('<p>Someone at the awareness stage is not ready to buy, and asking them to is the fastest way to lose them. The right call to action depends on where they are in the funnel:</p>'),
      table(
        ['Stage', 'A reasonable ask'],
        [
          ['Awareness', 'Read a related guide, subscribe to the newsletter'],
          ['Interest', 'Download something useful, watch a demonstration'],
          ['Consideration', 'See pricing, book a call, read case studies'],
          ['Action', 'Buy, enrol, send the enquiry'],
        ]
      ),
      p('<p>An introductory article ending in "Buy now" is asking for a commitment nobody at that stage is ready to make. Ending it with a link to the next logical thing keeps the person moving.</p>'),
    ],
  },
  bn: {
    title: 'Call to Action',
    metaTitle: 'Call to Action | Learn Computer Academy',
    metaDescription: 'পরবর্তী ধাপের জন্য কীভাবে স্পষ্টভাবে চাইবেন, কেন একটি জোরালো চাওয়া কয়েকটি দুর্বল চাওয়াকে হারায়, আর কী বোতামের টেক্সটকে কার্যকর করে।',
    blocks: [
      p('<p>একটি <b>call to action</b> হলো সেই মুহূর্ত যখন আপনি কাউকে কিছু করতে বলেন। এটি একটি পাতার একটি ছোট অংশ আর পাতাটি কাজ করে কিনা তার অসামঞ্জস্যপূর্ণভাবে বড় অংশ, কারণ যে কন্টেন্ট কখনো কিছু চায় না তা নির্ভরযোগ্যভাবে কিছুই পায় না।</p>'),

      h(2, 'একটি জিনিস চান', 'ask-for-one-thing'),
      p('<p>সমান-ওজনের তিনটি বিকল্প দেওয়া একটি পাতা — এখনই কিনুন, সাবস্ক্রাইব করুন, যোগাযোগ করুন, আমাদের follow করুন — পাঠককে ঠিক করতে বাধ্য করে কোনটি গুরুত্বপূর্ণ, আর সেই সিদ্ধান্তের সবচেয়ে সাধারণ সমাধান হলো কোনোটিই না করা।</p><p>সেই পাতার জন্য সবচেয়ে মূল্যবান একক কাজটি বাছুন আর সেটিকে দৃশ্যত প্রধান করুন। গৌণ বিকল্প থাকতে পারে, কিন্তু সেগুলো গৌণ দেখানো উচিত।</p>'),

      h(2, 'যে ক্লিক করছে তার জন্য বোতাম লিখুন', 'write-the-button-for-the-person-clicking-it'),
      p('<p>সাধারণ বোতামের টেক্সট পাঠককে কী ঘটবে তা বের করতে বাধ্য করে। নির্দিষ্ট টেক্সট তাদের বলে দেয়।</p>'),
      table(
        ['দুর্বল', 'ভালো'],
        [
          ['Submit', 'Send my enquiry'],
          ['Click here', 'Download the checklist'],
          ['Learn more', 'See the course syllabus'],
          ['Sign up', 'Start the free trial'],
        ]
      ),
      p('<p>একটি কাজের প্যাটার্ন হলো পাঠকের দৃষ্টিকোণ থেকে "I want to…" বাক্যটি সম্পূর্ণ করা। "I want to… see the course syllabus" স্বাভাবিকভাবে পড়া যায়; "I want to… submit" যায় না।</p>'),

      h(2, 'অনুভূত খরচ কমান', 'reduce-the-perceived-cost'),
      p('<p>পাঠকের মনে প্রতিটি কাজের একটি খরচ আছে — সময়, টাকা, পরিশ্রম, বা পরে বারবার যোগাযোগ করার ঝুঁকি। সেই খরচের নাম দেওয়া আর কমানো সরাসরি কাজ করা মানুষের সংখ্যা বাড়ায়:</p><ul><li>"দুই মিনিট লাগে"</li><li>"কোনো কার্ড লাগবে না"</li><li>"মাসে একটি ইমেইল, যেকোনো সময় unsubscribe করুন"</li><li>"আমরা এক কর্মদিবসের মধ্যে জবাব দেব"</li></ul><p>এই লাইনগুলো ছোট দেখায়। সেগুলো সেই নির্দিষ্ট দ্বিধার সমাধান করে যা আসলে কাউকে থামাচ্ছিল।</p>'),

      h(2, 'অবস্থান', 'placement'),
      p('<p>একটি call to action সেখানে দেখা যাওয়া উচিত যেখানে পাঠক নিশ্চিত হওয়ার সম্ভাবনা আছে, যা সবসময় নিচে নয়। একটি ছোট পাতায়, উপরের দিকে একবারই প্রায়ই সঠিক। একটি দীর্ঘ পাতায়, স্বাভাবিক সিদ্ধান্তের বিন্দুতে একই কাজ পুনরাবৃত্তি করুন — benefit-এর পরে, প্রমাণের পরে, শেষে।</p><p>এটি পুনরাবৃত্তি করা ঠিক আছে। মাঝপথে এটি কী চায় তা বদলানো নয়।</p>'),

      callout('warning', '<p>মোবাইলে দীর্ঘ টেক্সটের একটি পাতার নিচে প্রাথমিক কাজটি লুকাবেন না। যে বোতামে পৌঁছাতে আটবার স্ক্রল লাগে তা যত ভালোই লেখা হোক বেশিরভাগ ভিজিটরের কাছে কার্যত অদৃশ্য।</p>'),

      h(2, 'চাওয়াকে পর্যায়ের সাথে মেলান', 'match-the-ask-to-the-stage'),
      p('<p>Awareness পর্যায়ের কেউ কিনতে প্রস্তুত নয়, আর তাদের কিনতে বলা তাদের হারানোর দ্রুততম উপায়। সঠিক call to action নির্ভর করে তারা funnel-এ কোথায় আছে তার উপর:</p>'),
      table(
        ['পর্যায়', 'একটি যুক্তিসঙ্গত চাওয়া'],
        [
          ['Awareness', 'একটি সম্পর্কিত গাইড পড়ুন, নিউজলেটারে সাবস্ক্রাইব করুন'],
          ['Interest', 'কাজের কিছু ডাউনলোড করুন, একটি প্রদর্শনী দেখুন'],
          ['Consideration', 'দাম দেখুন, একটি কল বুক করুন, কেস স্টাডি পড়ুন'],
          ['Action', 'কিনুন, ভর্তি হন, জিজ্ঞাসা পাঠান'],
        ]
      ),
      p('<p>"Buy now" দিয়ে শেষ হওয়া একটি ভূমিকামূলক প্রবন্ধ এমন একটি প্রতিশ্রুতি চাইছে যা সেই পর্যায়ে কেউ দিতে প্রস্তুত নয়। পরবর্তী যৌক্তিক জিনিসের একটি লিংক দিয়ে শেষ করলে ব্যক্তিটি এগোতে থাকে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'email-marketing',
  sortOrder: 10,
  en: {
    title: 'Email Marketing Fundamentals',
    metaTitle: 'Email Marketing Fundamentals | Learn Computer Academy',
    metaDescription: 'Why email remains one of the most effective marketing channels, how it differs from social media, and what makes it work.',
    blocks: [
      p('<p>Email is old, unglamorous, and consistently one of the most effective marketing channels available. The reason is structural rather than technological: it is the only audience you actually own.</p>'),

      h(2, 'Why It Is Different'),
      p('<p>On a social platform, you build an audience and the platform decides how many of them see any given post. That decision can change at any time, and has, repeatedly. If the platform declines or changes its rules, the audience you built goes with it.</p><p>An email list is a set of addresses in a file. Nobody stands between you and the people on it. If your email provider disappoints you, you export the list and move — the relationship survives the tooling.</p>'),

      callout('note', '<p>This is the practical form of the owned-versus-rented distinction from the first lesson, and it is the strongest single argument for taking email seriously even when it feels less exciting than social media.</p>'),

      h(2, 'Permission Is the Foundation'),
      p('<p>Email marketing only works with people who agreed to hear from you. Everything else — buying lists, adding people who gave you a business card, importing contacts from elsewhere — produces complaints, spam reports, and damage to your ability to reach the people who did want to hear from you.</p><p>Beyond effectiveness, this is a legal matter in many jurisdictions. Consent, clear identification of the sender, and a working unsubscribe link are baseline requirements rather than courtesies. The next lesson covers list building specifically.</p>'),

      h(2, 'What to Send'),
      table(
        ['Type', 'Purpose'],
        [
          ['Newsletter', 'Regular useful content, keeping you in mind'],
          ['Welcome sequence', 'Automatic messages after someone subscribes, introducing what you do'],
          ['Announcement', 'A new course, product, or event'],
          ['Educational series', 'A multi-part sequence teaching something worth learning'],
          ['Re-engagement', 'Reaching people who have gone quiet, before removing them'],
        ]
      ),

      h(2, 'The Rule That Governs All of It'),
      p('<p>Every email should be worth the recipient\'s time on its own, before it is worth yours. A list that receives something useful regularly stays subscribed and stays attentive. A list that only ever hears from you when you want something learns to ignore you, and eventually unsubscribes.</p><p>This is the same trade as content marketing, applied to a channel where the audience has explicitly invited you in — which raises the standard rather than lowering it.</p>'),

      h(2, 'Frequency'),
      p('<p>There is no universally correct sending frequency. What matters more is that it is <b>predictable</b> and that you actually maintain it. A monthly email that arrives monthly is better than a weekly one that arrives three times and stops.</p><p>Say what to expect when someone subscribes, then do that. Most unsubscribes come from surprise — either far more email than expected, or a long silence followed by a sudden sales message.</p>'),
    ],
  },
  bn: {
    title: 'ইমেইল মার্কেটিংয়ের মূল বিষয়',
    metaTitle: 'ইমেইল মার্কেটিংয়ের মূল বিষয় | Learn Computer Academy',
    metaDescription: 'ইমেইল কেন সবচেয়ে কার্যকর মার্কেটিং চ্যানেলগুলোর একটি থেকে গেছে, এটি সোশ্যাল মিডিয়া থেকে কীভাবে আলাদা, আর কী এটিকে কার্যকর করে।',
    blocks: [
      p('<p>ইমেইল পুরোনো, জৌলুসহীন, আর ধারাবাহিকভাবে উপলব্ধ সবচেয়ে কার্যকর মার্কেটিং চ্যানেলগুলোর একটি। কারণটি প্রযুক্তিগত নয় বরং কাঠামোগত: এটিই একমাত্র দর্শক যা আসলে আপনার।</p>'),

      h(2, 'এটি কেন আলাদা', 'why-it-is-different'),
      p('<p>একটি সোশ্যাল প্ল্যাটফর্মে, আপনি একটি দর্শক তৈরি করেন আর প্ল্যাটফর্ম ঠিক করে তাদের কতজন যেকোনো একটি পোস্ট দেখবে। সেই সিদ্ধান্ত যেকোনো সময় বদলাতে পারে, আর বারবার বদলেছে। প্ল্যাটফর্মটি পড়ে গেলে বা তার নিয়ম বদলালে, আপনার তৈরি দর্শক সেটির সাথেই যায়।</p><p>একটি ইমেইল তালিকা একটি ফাইলে ঠিকানার একটি সেট। আপনার আর তাতে থাকা মানুষের মাঝে কেউ দাঁড়ায় না। আপনার ইমেইল প্রদানকারী আপনাকে হতাশ করলে, আপনি তালিকা export করে সরে যান — সরঞ্জাম বদলালেও সম্পর্কটি টিকে থাকে।</p>'),

      callout('note', '<p>এটি প্রথম পাঠের নিজের-বনাম-ভাড়া করা পার্থক্যের ব্যবহারিক রূপ, আর সোশ্যাল মিডিয়ার চেয়ে কম উত্তেজনাপূর্ণ মনে হলেও ইমেইলকে গুরুত্ব সহকারে নেওয়ার সবচেয়ে জোরালো একক যুক্তি এটাই।</p>'),

      h(2, 'অনুমতিই ভিত্তি', 'permission-is-the-foundation'),
      p('<p>ইমেইল মার্কেটিং শুধু সেই মানুষদের সাথে কাজ করে যারা আপনার কাছ থেকে শুনতে রাজি হয়েছে। বাকি সবকিছু — তালিকা কেনা, যারা আপনাকে একটি ভিজিটিং কার্ড দিয়েছে তাদের যোগ করা, অন্যত্র থেকে যোগাযোগ import করা — অভিযোগ, spam রিপোর্ট, আর যারা সত্যিই শুনতে চেয়েছিল তাদের কাছে পৌঁছানোর ক্ষমতার ক্ষতি তৈরি করে।</p><p>কার্যকারিতার বাইরেও, এটি অনেক এখতিয়ারে একটি আইনি বিষয়। সম্মতি, প্রেরকের স্পষ্ট পরিচয়, আর একটি কার্যকর unsubscribe লিংক সৌজন্যের বদলে ভিত্তিগত প্রয়োজনীয়তা। পরের পাঠ বিশেষভাবে তালিকা তৈরি কভার করে।</p>'),

      h(2, 'কী পাঠাবেন', 'what-to-send'),
      table(
        ['ধরন', 'উদ্দেশ্য'],
        [
          ['নিউজলেটার', 'নিয়মিত কাজের কন্টেন্ট, আপনাকে মনে রাখা'],
          ['Welcome ক্রম', 'কেউ সাবস্ক্রাইব করার পর স্বয়ংক্রিয় বার্তা, আপনি কী করেন তা পরিচয় করিয়ে'],
          ['ঘোষণা', 'একটি নতুন কোর্স, পণ্য, বা ইভেন্ট'],
          ['শিক্ষামূলক সিরিজ', 'শেখার যোগ্য কিছু শেখানো একটি বহু-অংশের ক্রম'],
          ['পুনরায় সংযোগ', 'যারা চুপ হয়ে গেছে তাদের কাছে পৌঁছানো, সরানোর আগে'],
        ]
      ),

      h(2, 'যে নিয়ম এর সবকিছু পরিচালনা করে', 'the-rule-that-governs-all-of-it'),
      p('<p>প্রতিটি ইমেইল আপনার সময়ের যোগ্য হওয়ার আগে প্রাপকের সময়ের নিজে যোগ্য হওয়া উচিত। যে তালিকা নিয়মিত কাজের কিছু পায় তা সাবস্ক্রাইব থাকে আর মনোযোগী থাকে। যে তালিকা শুধু আপনি কিছু চাইলেই আপনার কাছ থেকে শোনে তা আপনাকে উপেক্ষা করতে শেখে, আর শেষে unsubscribe করে।</p><p>এটি কন্টেন্ট মার্কেটিংয়ের একই বিনিময়, এমন একটি চ্যানেলে প্রয়োগ করা যেখানে দর্শক স্পষ্টভাবে আপনাকে ভেতরে ডেকেছে — যা মান কমানোর বদলে বাড়ায়।</p>'),

      h(2, 'ফ্রিকোয়েন্সি', 'frequency'),
      p('<p>কোনো সর্বজনীনভাবে সঠিক পাঠানোর ফ্রিকোয়েন্সি নেই। বেশি গুরুত্বপূর্ণ হলো এটি <b>অনুমানযোগ্য</b> আর আপনি সত্যিই এটি বজায় রাখেন। যে মাসিক ইমেইল মাসে আসে তা এমন একটি সাপ্তাহিকের চেয়ে ভালো যা তিনবার এসে থেমে যায়।</p><p>কেউ সাবস্ক্রাইব করলে কী আশা করতে হবে বলুন, তারপর সেটিই করুন। বেশিরভাগ unsubscribe আসে বিস্ময় থেকে — হয় প্রত্যাশার চেয়ে অনেক বেশি ইমেইল, নয়তো একটি দীর্ঘ নীরবতার পর হঠাৎ একটি বিক্রির বার্তা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'building-an-email-list',
  sortOrder: 11,
  en: {
    title: 'Building an Email List',
    metaTitle: 'Building an Email List | Learn Computer Academy',
    metaDescription: 'How to grow a list of people who genuinely want to hear from you, and why buying addresses damages more than it helps.',
    blocks: [
      p('<p>An email list is built one person at a time, by giving each of them a reason to hand over an address. There is no shortcut that works, and the shortcuts that exist are actively harmful.</p>'),

      h(2, 'Why Buying a List Fails'),
      p('<p>Purchased lists look like an obvious answer and are consistently a mistake:</p><ul><li>The people on it never asked to hear from you, so they mark it as spam.</li><li>Spam complaints damage your sending reputation, which affects whether your email reaches <i>everyone</i> — including the people who did opt in.</li><li>Purchased lists commonly contain dead addresses and spam traps, which compound the reputation problem.</li><li>In many jurisdictions it is illegal without consent.</li></ul><p>The damage is not limited to the wasted list. A poisoned sending reputation affects the entire channel afterwards, which is a large cost for something that was supposed to be a shortcut.</p>'),

      h(2, 'Give Them a Reason'),
      p('<p>"Subscribe to our newsletter" asks for something and offers nothing. It converts poorly because it is not a trade — it is a request.</p><p>What works is offering something specific and immediately useful in exchange:</p><ul><li>A checklist or template someone can use today</li><li>A short guide that solves one problem properly</li><li>A free course delivered over several emails</li><li>Early or exclusive access to something</li><li>A genuinely useful tool or calculator</li></ul><p>The offer should be closely related to what you do. A giveaway unrelated to your business attracts people who want the giveaway and have no interest in anything else — a larger list that performs worse.</p>'),

      callout('tip', '<p>Even keeping the plain newsletter signup, changing the wording from "subscribe to our newsletter" to a specific description of what arrives and how often — "one email a month with a new tutorial, unsubscribe any time" — sets an expectation and gives a reason. It costs nothing to write.</p>'),

      h(2, 'Where to Ask'),
      p('<ul><li><b>At the end of articles</b>, where someone has just found your writing useful. This is the highest-intent moment available.</li><li><b>A dedicated page</b> you can link to from anywhere.</li><li><b>In the site footer</b>, present but not intrusive.</li><li><b>Within relevant content</b>, where the offer directly relates to what they are reading.</li><li><b>After a purchase or enquiry</b>, when the relationship already exists.</li></ul>'),

      h(2, 'Popups, Honestly'),
      p('<p>Popups do increase signups, which is why they are everywhere. They also annoy people and, on mobile, an intrusive one appearing immediately can be penalised by search engines as an interstitial that blocks content.</p><p>If used at all: trigger on intent or after some engagement rather than instantly, make the close button obvious and large, do not show it again to someone who dismissed it, and never let it cover the content on a small screen. A popup that fails those conditions costs more in goodwill and search visibility than it earns in addresses.</p>'),

      h(2, 'Confirming Subscriptions'),
      p('<p><b>Double opt-in</b> sends a confirmation email that the subscriber must click before being added. It produces a smaller list and a substantially better one: every address is verified, typos are eliminated, and nobody is on it by accident.</p><p>It also gives you evidence of consent, which matters if a complaint is ever raised.</p>'),

      h(2, 'Quality Over Size'),
      p('<p>List size is a vanity metric. A list of 200 people who open and act on your emails is worth more than 5,000 who ignore them — and the second list actively costs more, since most providers charge by subscriber count and low engagement worsens deliverability for everyone on it.</p><p>Removing people who have not opened anything in a long time feels like going backwards and usually improves results.</p>'),
    ],
  },
  bn: {
    title: 'একটি ইমেইল তালিকা তৈরি',
    metaTitle: 'একটি ইমেইল তালিকা তৈরি | Learn Computer Academy',
    metaDescription: 'যারা সত্যিই আপনার কাছ থেকে শুনতে চায় তাদের একটি তালিকা কীভাবে বাড়াবেন, আর ঠিকানা কেনা কেন সাহায্যের চেয়ে বেশি ক্ষতি করে।',
    blocks: [
      p('<p>একটি ইমেইল তালিকা একবারে একজন করে তৈরি হয়, প্রত্যেককে একটি ঠিকানা দেওয়ার একটি কারণ দিয়ে। কাজ করে এমন কোনো শর্টকাট নেই, আর যে শর্টকাটগুলো আছে সেগুলো সক্রিয়ভাবে ক্ষতিকর।</p>'),

      h(2, 'একটি তালিকা কেনা কেন ব্যর্থ হয়', 'why-buying-a-list-fails'),
      p('<p>কেনা তালিকা একটি স্পষ্ট উত্তর মনে হয় আর ধারাবাহিকভাবে একটি ভুল:</p><ul><li>এতে থাকা মানুষ কখনো আপনার কাছ থেকে শুনতে চায়নি, তাই তারা এটিকে spam চিহ্নিত করে।</li><li>Spam অভিযোগ আপনার পাঠানোর সুনাম নষ্ট করে, যা প্রভাবিত করে আপনার ইমেইল <i>সবার</i> কাছে পৌঁছায় কিনা — যারা সম্মতি দিয়েছিল তাদেরসহ।</li><li>কেনা তালিকায় সাধারণত মৃত ঠিকানা আর spam trap থাকে, যা সুনামের সমস্যা বাড়ায়।</li><li>অনেক এখতিয়ারে সম্মতি ছাড়া এটি অবৈধ।</li></ul><p>ক্ষতি নষ্ট হওয়া তালিকায় সীমাবদ্ধ নয়। একটি বিষাক্ত পাঠানোর সুনাম এরপর পুরো চ্যানেলকে প্রভাবিত করে, যা একটি শর্টকাট হওয়ার কথা ছিল এমন কিছুর জন্য একটি বড় খরচ।</p>'),

      h(2, 'তাদের একটি কারণ দিন', 'give-them-a-reason'),
      p('<p>"Subscribe to our newsletter" কিছু চায় আর কিছুই দেয় না। এটি খারাপ রূপান্তর করে কারণ এটি একটি বিনিময় নয় — এটি একটি অনুরোধ।</p><p>যা কাজ করে তা হলো বিনিময়ে নির্দিষ্ট আর সাথে সাথে কাজের কিছু দেওয়া:</p><ul><li>একটি চেকলিস্ট বা টেমপ্লেট যা কেউ আজই ব্যবহার করতে পারে</li><li>একটি ছোট গাইড যা একটি সমস্যা ঠিকভাবে সমাধান করে</li><li>কয়েকটি ইমেইলে দেওয়া একটি বিনামূল্যের কোর্স</li><li>কিছুতে আগাম বা একচেটিয়া প্রবেশাধিকার</li><li>সত্যিই কাজের একটি টুল বা ক্যালকুলেটর</li></ul><p>অফারটি আপনি যা করেন তার সাথে ঘনিষ্ঠভাবে সম্পর্কিত হওয়া উচিত। আপনার ব্যবসার সাথে অসম্পর্কিত একটি উপহার এমন মানুষ আকর্ষণ করে যারা উপহারটি চায় আর বাকি কিছুতে আগ্রহী নয় — একটি বড় তালিকা যা খারাপ পারফর্ম করে।</p>'),

      callout('tip', '<p>সাধারণ নিউজলেটার signup রেখেও, "subscribe to our newsletter" থেকে কী আসে আর কত ঘন ঘন তার একটি নির্দিষ্ট বর্ণনায় শব্দ বদলানো — "মাসে একটি ইমেইল একটি নতুন টিউটোরিয়ালসহ, যেকোনো সময় unsubscribe করুন" — একটি প্রত্যাশা তৈরি করে আর একটি কারণ দেয়। এটি লিখতে কোনো খরচ নেই।</p>'),

      h(2, 'কোথায় চাইবেন', 'where-to-ask'),
      p('<ul><li><b>প্রবন্ধের শেষে</b>, যেখানে কেউ সবে আপনার লেখা কাজের পেয়েছে। এটি উপলব্ধ সবচেয়ে উঁচু-উদ্দেশ্যের মুহূর্ত।</li><li><b>একটি নির্দিষ্ট পাতা</b> যাতে আপনি যেকোনো জায়গা থেকে লিংক করতে পারেন।</li><li><b>সাইটের footer-এ</b>, উপস্থিত কিন্তু বিরক্তিকর নয়।</li><li><b>প্রাসঙ্গিক কন্টেন্টের ভেতরে</b>, যেখানে অফারটি তারা যা পড়ছে তার সাথে সরাসরি সম্পর্কিত।</li><li><b>একটি কেনা বা জিজ্ঞাসার পরে</b>, যখন সম্পর্কটি ইতিমধ্যে আছে।</li></ul>'),

      h(2, 'Popup, সৎভাবে', 'popups-honestly'),
      p('<p>Popup signup বাড়ায়, যে কারণে সেগুলো সর্বত্র। সেগুলো মানুষকে বিরক্তও করে আর, মোবাইলে, সাথে সাথে দেখা দেওয়া একটি বিরক্তিকর popup কন্টেন্ট ব্লক করা একটি interstitial হিসেবে সার্চ ইঞ্জিন দ্বারা শাস্তি পেতে পারে।</p><p>একেবারে ব্যবহার করলে: তাৎক্ষণিকভাবে না করে উদ্দেশ্যে বা কিছু সম্পৃক্ততার পরে চালু করুন, close বোতামটি স্পষ্ট আর বড় করুন, যে এটি সরিয়ে দিয়েছে তাকে আবার দেখাবেন না, আর একটি ছোট স্ক্রিনে কখনো কন্টেন্ট ঢাকতে দেবেন না। যে popup সেই শর্তগুলো পূরণ করে না তা ঠিকানায় যা অর্জন করে তার চেয়ে বেশি সদিচ্ছা আর সার্চ দৃশ্যমানতায় খরচ করায়।</p>'),

      h(2, 'সাবস্ক্রিপশন নিশ্চিত করা', 'confirming-subscriptions'),
      p('<p><b>Double opt-in</b> একটি নিশ্চিতকরণ ইমেইল পাঠায় যা যোগ হওয়ার আগে সাবস্ক্রাইবারকে ক্লিক করতে হয়। এটি একটি ছোট তালিকা আর যথেষ্ট ভালো একটি তালিকা তৈরি করে: প্রতিটি ঠিকানা যাচাই করা, টাইপো দূর হয়, আর কেউ দুর্ঘটনাক্রমে এতে থাকে না।</p><p>এটি আপনাকে সম্মতির প্রমাণও দেয়, যা কখনো একটি অভিযোগ উঠলে গুরুত্বপূর্ণ।</p>'),

      h(2, 'আকারের চেয়ে গুণমান', 'quality-over-size'),
      p('<p>তালিকার আকার একটি অহংকারের মেট্রিক। যে ২০০ জন আপনার ইমেইল খোলে আর তাতে কাজ করে তাদের একটি তালিকা ৫,০০০ জন যারা উপেক্ষা করে তাদের চেয়ে বেশি মূল্যবান — আর দ্বিতীয় তালিকাটি সক্রিয়ভাবে বেশি খরচ করায়, কারণ বেশিরভাগ প্রদানকারী সাবস্ক্রাইবার সংখ্যায় চার্জ করে আর কম সম্পৃক্ততা এতে থাকা সবার জন্য deliverability খারাপ করে।</p><p>যারা অনেকদিন কিছু খোলেনি তাদের সরানো পিছিয়ে যাওয়ার মতো মনে হয় আর সাধারণত ফলাফল উন্নত করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'writing-emails',
  sortOrder: 12,
  en: {
    title: 'Writing Emails & Newsletters',
    metaTitle: 'Writing Emails and Newsletters | Learn Computer Academy',
    metaDescription: 'Subject lines, structure, and the practical details that decide whether an email gets opened, read, and acted on.',
    blocks: [
      p('<p>An email has to clear three separate hurdles: arriving in the inbox, being opened, and being read. Each is a different problem, and failing any one of them makes the others irrelevant.</p>'),

      h(2, 'Subject Lines'),
      p('<p>The subject line decides whether anything else happens. What works:</p><ul><li><b>Be specific.</b> "Three things that break WordPress sites after an update" beats "Our monthly newsletter".</li><li><b>Keep it short.</b> Mobile inboxes truncate aggressively, and most email is read on a phone.</li><li><b>Be honest.</b> A subject line that oversells produces an open followed by immediate deletion, and trains people to ignore the next one.</li><li><b>Avoid the spam signals.</b> All capitals, rows of exclamation marks, and "FREE!!!" get filtered before a human sees them.</li></ul>'),

      callout('note', '<p>The preview text — the line the inbox shows after the subject — is the second most-read thing and the most commonly wasted. Left alone it often shows "View this email in your browser". Setting it deliberately gives you a second line to earn the open.</p>', 'Do not waste the preview text'),

      h(2, 'Structure'),
      p('<ol><li><b>Open with the point.</b> No lengthy preamble. The reader decided to open it; do not make them wait.</li><li><b>One main idea per email.</b> Several competing messages means none of them land.</li><li><b>Short paragraphs.</b> Email is read faster and more distractedly than a webpage.</li><li><b>One clear action.</b> Same principle as the calls-to-action lesson, and it matters more here because attention is briefer.</li><li><b>Write as a person.</b> Email is a personal medium; corporate voice reads as an intrusion in a place where people expect messages from individuals.</li></ol>'),

      h(2, 'Practical Details That Matter'),
      p('<ul><li><b>Send from a real person\'s name</b> where possible. It performs better than a company name and it is honest about who is writing.</li><li><b>Make the unsubscribe link easy to find.</b> Hiding it produces spam complaints instead of unsubscribes, which is far worse for you.</li><li><b>Test on a phone</b> before sending. Most recipients will read it there.</li><li><b>Do not rely on images.</b> Many clients block them by default; an email that is one large image says nothing when blocked.</li><li><b>Use a plain-text alternative.</b> Most tools generate one automatically — check that it makes sense.</li></ul>'),

      h(2, 'What to Measure'),
      table(
        ['Metric', 'What it indicates'],
        [
          ['Delivery rate', 'Whether the email arrived at all — a list quality signal'],
          ['Open rate', 'Whether the subject line worked (approximate, see below)'],
          ['Click rate', 'Whether the content persuaded anyone to act'],
          ['Unsubscribe rate', 'Whether you are sending what people expected'],
          ['Spam complaints', 'A serious warning — investigate immediately'],
        ]
      ),

      callout('warning', '<p>Open rates have become unreliable. Privacy features in several major email clients pre-load tracking images, which registers as an open whether or not anyone read anything. Treat open rate as a rough directional signal, and rely on <b>click rate</b> as the more honest measure of whether an email worked.</p>'),

      h(2, 'Automated Sequences'),
      p('<p>A <b>welcome sequence</b> — a few emails sent automatically after someone subscribes — is the highest-value automation available, because new subscribers are at their most interested immediately after signing up.</p><p>A simple version: an immediate email delivering whatever was promised, then one introducing what you do, then one pointing at your most useful existing content. Written once, it works for every future subscriber without further effort.</p>'),
    ],
  },
  bn: {
    title: 'ইমেইল আর নিউজলেটার লেখা',
    metaTitle: 'ইমেইল আর নিউজলেটার লেখা | Learn Computer Academy',
    metaDescription: 'Subject line, গঠন, আর সেই ব্যবহারিক বিবরণ যা ঠিক করে একটি ইমেইল খোলা হয়, পড়া হয়, আর তাতে কাজ হয় কিনা।',
    blocks: [
      p('<p>একটি ইমেইলকে তিনটি আলাদা বাধা পেরোতে হয়: inbox-এ পৌঁছানো, খোলা হওয়া, আর পড়া হওয়া। প্রতিটি একটি ভিন্ন সমস্যা, আর যেকোনো একটিতে ব্যর্থ হলে বাকিগুলো অপ্রাসঙ্গিক হয়ে যায়।</p>'),

      h(2, 'Subject Line', 'subject-lines'),
      p('<p>Subject line ঠিক করে আর কিছু ঘটবে কিনা। যা কাজ করে:</p><ul><li><b>নির্দিষ্ট হন।</b> "Three things that break WordPress sites after an update" "Our monthly newsletter"-কে হারায়।</li><li><b>ছোট রাখুন।</b> মোবাইল inbox আক্রমণাত্মকভাবে কাটে, আর বেশিরভাগ ইমেইল একটি ফোনে পড়া হয়।</li><li><b>সৎ হন।</b> অতিরিক্ত বিক্রি করা একটি subject line একটি খোলা তৈরি করে যার পরেই সাথে সাথে মুছে ফেলা হয়, আর মানুষকে পরেরটি উপেক্ষা করতে শেখায়।</li><li><b>Spam সংকেত এড়ান।</b> সব বড় হাতের অক্ষর, বিস্ময়বোধক চিহ্নের সারি, আর "FREE!!!" একজন মানুষ দেখার আগেই ছেঁকে ফেলা হয়।</li></ul>'),

      callout('note', '<p>Preview টেক্সট — subject-এর পরে inbox যে লাইনটি দেখায় — দ্বিতীয় সবচেয়ে বেশি পড়া জিনিস আর সবচেয়ে বেশি নষ্ট হওয়াটি। একা ছেড়ে দিলে এটি প্রায়ই "View this email in your browser" দেখায়। ইচ্ছাকৃতভাবে সেট করলে খোলা অর্জনের জন্য আপনি একটি দ্বিতীয় লাইন পান।</p>', 'Preview টেক্সট নষ্ট করবেন না'),

      h(2, 'গঠন', 'structure'),
      p('<ol><li><b>মূল কথা দিয়ে শুরু করুন।</b> কোনো দীর্ঘ ভূমিকা নয়। পাঠক এটি খোলার সিদ্ধান্ত নিয়েছে; তাদের অপেক্ষা করাবেন না।</li><li><b>প্রতি ইমেইলে একটি প্রধান ধারণা।</b> কয়েকটি প্রতিযোগী বার্তার অর্থ কোনোটিই পৌঁছায় না।</li><li><b>ছোট অনুচ্ছেদ।</b> ইমেইল একটি ওয়েবপাতার চেয়ে দ্রুত আর বেশি অন্যমনস্কভাবে পড়া হয়।</li><li><b>একটি স্পষ্ট কাজ।</b> Call-to-action পাঠের একই নীতি, আর এখানে এটি বেশি গুরুত্বপূর্ণ কারণ মনোযোগ ক্ষণস্থায়ী।</li><li><b>একজন মানুষ হিসেবে লিখুন।</b> ইমেইল একটি ব্যক্তিগত মাধ্যম; কর্পোরেট কণ্ঠ এমন একটি জায়গায় অনুপ্রবেশ হিসেবে পড়া যায় যেখানে মানুষ ব্যক্তির কাছ থেকে বার্তা আশা করে।</li></ol>'),

      h(2, 'যে ব্যবহারিক বিবরণ গুরুত্বপূর্ণ', 'practical-details-that-matter'),
      p('<ul><li>সম্ভব হলে <b>একজন বাস্তব ব্যক্তির নাম থেকে পাঠান</b>। এটি একটি কোম্পানির নামের চেয়ে ভালো পারফর্ম করে আর কে লিখছে সে বিষয়ে সৎ।</li><li><b>Unsubscribe লিংক খুঁজে পাওয়া সহজ করুন।</b> এটি লুকালে unsubscribe-এর বদলে spam অভিযোগ তৈরি হয়, যা আপনার জন্য অনেক খারাপ।</li><li>পাঠানোর আগে <b>একটি ফোনে পরীক্ষা করুন</b>। বেশিরভাগ প্রাপক সেখানেই এটি পড়বে।</li><li><b>ছবির উপর নির্ভর করবেন না।</b> অনেক client ডিফল্টভাবে সেগুলো ব্লক করে; যে ইমেইল একটি বড় ছবি তা ব্লক হলে কিছুই বলে না।</li><li><b>একটি plain-text বিকল্প ব্যবহার করুন।</b> বেশিরভাগ টুল স্বয়ংক্রিয়ভাবে একটি তৈরি করে — যাচাই করুন এটি অর্থপূর্ণ কিনা।</li></ul>'),

      h(2, 'কী মাপবেন', 'what-to-measure'),
      table(
        ['মেট্রিক', 'এটি কী নির্দেশ করে'],
        [
          ['Delivery rate', 'ইমেইলটি আদৌ পৌঁছেছে কিনা — একটি তালিকার গুণমানের সংকেত'],
          ['Open rate', 'Subject line কাজ করেছে কিনা (আনুমানিক, নিচে দেখুন)'],
          ['Click rate', 'কন্টেন্ট কাউকে কাজ করতে রাজি করিয়েছে কিনা'],
          ['Unsubscribe rate', 'আপনি মানুষের প্রত্যাশিত জিনিস পাঠাচ্ছেন কিনা'],
          ['Spam অভিযোগ', 'একটি গুরুতর সতর্কতা — সাথে সাথে তদন্ত করুন'],
        ]
      ),

      callout('warning', '<p>Open rate অনির্ভরযোগ্য হয়ে গেছে। কয়েকটি প্রধান ইমেইল client-এর গোপনীয়তা ফিচার ট্র্যাকিং ছবি আগেই লোড করে, যা কেউ কিছু পড়ুক বা না পড়ুক একটি খোলা হিসেবে নথিভুক্ত হয়। Open rate-কে একটি মোটামুটি দিকনির্দেশক সংকেত হিসেবে নিন, আর একটি ইমেইল কাজ করেছে কিনা তার বেশি সৎ মাপ হিসেবে <b>click rate</b>-এর উপর নির্ভর করুন।</p>'),

      h(2, 'স্বয়ংক্রিয় ক্রম', 'automated-sequences'),
      p('<p>একটি <b>welcome ক্রম</b> — কেউ সাবস্ক্রাইব করার পর স্বয়ংক্রিয়ভাবে পাঠানো কয়েকটি ইমেইল — উপলব্ধ সবচেয়ে বেশি মূল্যের অটোমেশন, কারণ নতুন সাবস্ক্রাইবার signup করার সাথে সাথেই সবচেয়ে বেশি আগ্রহী থাকে।</p><p>একটি সরল সংস্করণ: যা প্রতিশ্রুতি দেওয়া হয়েছিল তা দেওয়া একটি তাৎক্ষণিক ইমেইল, তারপর আপনি কী করেন তার পরিচয় দেওয়া একটি, তারপর আপনার সবচেয়ে কাজের বিদ্যমান কন্টেন্টের দিকে নির্দেশ করা একটি। একবার লিখলে, এটি আরও পরিশ্রম ছাড়াই প্রতিটি ভবিষ্যৎ সাবস্ক্রাইবারের জন্য কাজ করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'social-media-overview',
  sortOrder: 13,
  en: {
    title: 'Social Media Marketing Overview',
    metaTitle: 'Social Media Marketing Overview | Learn Computer Academy',
    metaDescription: 'What organic social media can realistically do for a business, how reach actually works, and why it should never be your only channel.',
    blocks: [
      p('<p>Social media is where most people start with marketing, and where most people become discouraged. Understanding what it is genuinely good at — and what it is not — prevents a lot of wasted effort.</p>'),

      h(2, 'What Organic Social Is Good At'),
      p('<ul><li><b>Being visible regularly</b> to people who already know you exist.</li><li><b>Showing personality</b> in a way a website cannot.</li><li><b>Conversation</b> — answering questions publicly, which others then see.</li><li><b>Distribution</b> of content you published elsewhere.</li><li><b>Occasional wide reach</b> when something is shared beyond your own audience.</li></ul>'),

      h(2, 'What It Is Not Good At'),
      p('<ul><li><b>Reliably reaching your own followers.</b> The platform decides who sees a post, and typically only a fraction of followers do.</li><li><b>Direct selling.</b> People are not on social platforms to buy, and posts that only sell get ignored.</li><li><b>Being an asset you own.</b> Covered in the first lesson and worth repeating: the audience belongs to the platform.</li><li><b>Predictable results.</b> Reach varies enormously post to post for reasons that are not visible to you.</li></ul>'),

      callout('warning', '<p>Organic reach on most established platforms has declined substantially over the years, and the general direction has been consistent: platforms increasingly favour paid placement over free distribution to followers you already have. Any strategy that depends on free reach staying at today\'s level is building on ground that has moved before and will move again.</p>', 'The trend worth planning around'),

      h(2, 'How Reach Actually Works'),
      p('<p>Platforms show a post to a small portion of the audience first, then decide whether to show it more widely based on how those people respond. Engagement early on — people stopping, reacting, commenting, sharing, watching to the end — is what causes wider distribution.</p><p>Two practical consequences follow. First, content that prompts a genuine response outperforms content that is merely present. Second, posting more often does not straightforwardly mean more reach; several weak posts can perform worse in total than one good one.</p>'),

      h(2, 'The Sensible Way to Use It'),
      p('<ol><li><b>Pick platforms deliberately</b> rather than joining all of them. Covered in the next lesson.</li><li><b>Use it to distribute, not to store.</b> Publish the substantial version on your own site, then point to it.</li><li><b>Convert followers into subscribers.</b> Move people from rented ground to owned ground — this is the single highest-value thing social media can do for you.</li><li><b>Be consistent rather than intense.</b> The same argument as the content calendar lesson.</li><li><b>Actually engage.</b> Replying to comments is not an optional extra; it is the part that builds anything.</li></ol>'),

      h(2, 'A Realistic Expectation'),
      p('<p>For most small businesses, organic social media is a support channel rather than a primary source of customers. It keeps you visible, it distributes your work, and occasionally it reaches far beyond your audience. Expecting it to be the main engine — with no website content, no email list, and no paid spend behind it — is the most common way people conclude that marketing does not work.</p>'),
    ],
  },
  bn: {
    title: 'সোশ্যাল মিডিয়া মার্কেটিং সংক্ষেপে',
    metaTitle: 'সোশ্যাল মিডিয়া মার্কেটিং সংক্ষেপে | Learn Computer Academy',
    metaDescription: 'Organic সোশ্যাল মিডিয়া একটি ব্যবসার জন্য বাস্তবসম্মতভাবে কী করতে পারে, নাগাল আসলে কীভাবে কাজ করে, আর এটি কেন কখনো আপনার একমাত্র চ্যানেল হওয়া উচিত নয়।',
    blocks: [
      p('<p>সোশ্যাল মিডিয়া হলো যেখানে বেশিরভাগ মানুষ মার্কেটিং শুরু করে, আর যেখানে বেশিরভাগ মানুষ নিরুৎসাহিত হয়। এটি সত্যিই কীসে ভালো — আর কীসে নয় — তা বোঝা অনেক অপচয় ঠেকায়।</p>'),

      h(2, 'Organic সোশ্যাল কীসে ভালো', 'what-organic-social-is-good-at'),
      p('<ul><li>যারা ইতিমধ্যে আপনার অস্তিত্ব জানে তাদের কাছে <b>নিয়মিত দৃশ্যমান থাকা</b>।</li><li>একটি ওয়েবসাইট যেভাবে পারে না সেভাবে <b>ব্যক্তিত্ব দেখানো</b>।</li><li><b>কথোপকথন</b> — প্রকাশ্যে প্রশ্নের উত্তর দেওয়া, যা অন্যরা তারপর দেখে।</li><li>অন্যত্র প্রকাশিত কন্টেন্টের <b>বিতরণ</b>।</li><li>কিছু আপনার নিজের দর্শকের বাইরে শেয়ার হলে <b>মাঝে মাঝে বিস্তৃত নাগাল</b>।</li></ul>'),

      h(2, 'এটি কীসে ভালো নয়', 'what-it-is-not-good-at'),
      p('<ul><li><b>নির্ভরযোগ্যভাবে আপনার নিজের follower-দের কাছে পৌঁছানো।</b> প্ল্যাটফর্ম ঠিক করে কে একটি পোস্ট দেখবে, আর সাধারণত follower-দের একটি ভগ্নাংশই দেখে।</li><li><b>সরাসরি বিক্রি।</b> মানুষ কিনতে সোশ্যাল প্ল্যাটফর্মে থাকে না, আর যে পোস্ট শুধু বিক্রি করে তা উপেক্ষিত হয়।</li><li><b>আপনার নিজের একটি সম্পদ হওয়া।</b> প্রথম পাঠে কভার করা আর পুনরাবৃত্তির যোগ্য: দর্শকটি প্ল্যাটফর্মের।</li><li><b>অনুমানযোগ্য ফলাফল।</b> আপনার কাছে অদৃশ্য কারণে পোস্ট থেকে পোস্টে নাগাল বিপুলভাবে বদলায়।</li></ul>'),

      callout('warning', '<p>বেশিরভাগ প্রতিষ্ঠিত প্ল্যাটফর্মে organic নাগাল বছরের পর বছর যথেষ্ট কমেছে, আর সাধারণ দিকটি ধারাবাহিক: প্ল্যাটফর্ম ক্রমশ আপনার ইতিমধ্যে থাকা follower-দের কাছে বিনামূল্যের বিতরণের চেয়ে পেইড placement-কে অগ্রাধিকার দেয়। যে কৌশল বিনামূল্যের নাগাল আজকের স্তরে থাকার উপর নির্ভর করে তা এমন জমিতে গড়ছে যা আগেও সরেছে আর আবার সরবে।</p>', 'যে প্রবণতা মাথায় রেখে পরিকল্পনা করা উচিত'),

      h(2, 'নাগাল আসলে কীভাবে কাজ করে', 'how-reach-actually-works'),
      p('<p>প্ল্যাটফর্ম প্রথমে দর্শকের একটি ছোট অংশকে একটি পোস্ট দেখায়, তারপর সেই মানুষরা কীভাবে সাড়া দেয় তার উপর ভিত্তি করে ঠিক করে এটি আরও বিস্তৃতভাবে দেখাবে কিনা। শুরুতে সম্পৃক্ততা — মানুষ থামছে, প্রতিক্রিয়া দিচ্ছে, মন্তব্য করছে, শেয়ার করছে, শেষ পর্যন্ত দেখছে — যা বিস্তৃত বিতরণ ঘটায়।</p><p>দুটি ব্যবহারিক পরিণতি আসে। প্রথমত, যে কন্টেন্ট একটি সত্যিকারের সাড়া জাগায় তা শুধু উপস্থিত থাকা কন্টেন্টকে হারায়। দ্বিতীয়ত, বেশি ঘন ঘন পোস্ট করার সরল অর্থ বেশি নাগাল নয়; কয়েকটি দুর্বল পোস্ট মোটে একটি ভালো পোস্টের চেয়ে খারাপ পারফর্ম করতে পারে।</p>'),

      h(2, 'এটি ব্যবহারের যুক্তিসঙ্গত উপায়', 'the-sensible-way-to-use-it'),
      p('<ol><li>সবগুলোতে যোগ না দিয়ে <b>ইচ্ছাকৃতভাবে প্ল্যাটফর্ম বাছুন</b>। পরের পাঠে কভার করা।</li><li><b>বিতরণে ব্যবহার করুন, সংরক্ষণে নয়।</b> বড় সংস্করণটি নিজের সাইটে প্রকাশ করুন, তারপর সেদিকে নির্দেশ করুন।</li><li><b>Follower-দের সাবস্ক্রাইবারে পরিণত করুন।</b> মানুষকে ভাড়া করা জমি থেকে নিজের জমিতে সরান — সোশ্যাল মিডিয়া আপনার জন্য যা করতে পারে তার মধ্যে এটিই সবচেয়ে বেশি মূল্যের।</li><li><b>তীব্র না হয়ে ধারাবাহিক হন।</b> কন্টেন্ট ক্যালেন্ডার পাঠের একই যুক্তি।</li><li><b>সত্যিই যুক্ত হন।</b> মন্তব্যের জবাব দেওয়া একটি ঐচ্ছিক অতিরিক্ত নয়; এটিই সেই অংশ যা কিছু গড়ে তোলে।</li></ol>'),

      h(2, 'একটি বাস্তবসম্মত প্রত্যাশা', 'a-realistic-expectation'),
      p('<p>বেশিরভাগ ছোট ব্যবসার জন্য, organic সোশ্যাল মিডিয়া গ্রাহকের একটি প্রাথমিক উৎসের বদলে একটি সহায়ক চ্যানেল। এটি আপনাকে দৃশ্যমান রাখে, এটি আপনার কাজ বিতরণ করে, আর মাঝে মাঝে এটি আপনার দর্শকের অনেক বাইরে পৌঁছায়। এটিকে প্রধান ইঞ্জিন হওয়ার আশা করা — কোনো ওয়েবসাইট কন্টেন্ট, কোনো ইমেইল তালিকা, আর পেছনে কোনো পেইড খরচ ছাড়া — মানুষের মার্কেটিং কাজ করে না সিদ্ধান্তে আসার সবচেয়ে সাধারণ উপায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'choosing-platforms',
  sortOrder: 14,
  en: {
    title: 'Choosing the Right Platforms',
    metaTitle: 'Choosing Social Media Platforms | Learn Computer Academy',
    metaDescription: 'Why being on fewer platforms usually works better, and how to decide which ones are worth your time.',
    blocks: [
      p('<p>The instinct is to be everywhere, so as not to miss anyone. In practice, spreading limited effort across six platforms produces six neglected accounts, and a neglected account is worse than no account — it looks abandoned to anyone who finds it.</p>'),

      h(2, 'Two Questions That Decide It'),
      p('<ol><li><b>Is your audience actually there?</b> Not "are lots of people there" — are <i>your</i> people there, in the mindset where what you offer makes sense.</li><li><b>Can you produce what the platform rewards, repeatedly?</b> Each platform favours a format. If you cannot sustainably make short video, a platform built around short video is not for you regardless of its size.</li></ol><p>A platform has to pass both. Passing only the first produces an account you cannot maintain; passing only the second produces content nobody relevant sees.</p>'),

      h(2, 'What Each Is Broadly Suited To'),
      table(
        ['Platform', 'Typically works for', 'Main format'],
        [
          ['Facebook', 'Local businesses, communities, older demographics, groups', 'Mixed — text, image, video, events'],
          ['Instagram', 'Visual work, products, food, design, personal brands', 'Image and short video'],
          ['LinkedIn', 'B2B, professional services, recruitment, industry expertise', 'Text posts and articles'],
          ['YouTube', 'Anything that benefits from being demonstrated', 'Long and short video'],
          ['WhatsApp / messaging', 'Direct customer contact, local service businesses', 'One-to-one and broadcast'],
        ]
      ),

      callout('note', '<p>Treat this table as a starting orientation, not a rule. Platform demographics and dominant formats shift over time, and there are successful accounts on every platform that ignore the conventional advice. The two questions above matter more than any table.</p>'),

      h(2, 'Start With One or Two'),
      p('<p>Choose the platform where the two questions give the clearest yes, and commit to it properly for several months. One well-maintained account with real engagement is worth more than five dormant ones, and it teaches you what actually works before you scale the effort.</p><p>Expanding later is straightforward. Recovering an account that has visibly been abandoned for a year is harder than starting fresh.</p>'),

      h(2, 'Do Not Post Identical Content Everywhere'),
      p('<p>Automatically cross-posting the same thing to every platform is efficient and performs poorly. Each platform has its own conventions — length, tone, format, how links are treated — and content obviously formatted for somewhere else reads as exactly that.</p><p>Repurposing is different from cross-posting: same underlying idea, rewritten to suit where it is going. That takes a few extra minutes and consistently outperforms automation.</p>'),

      h(2, 'Reserve the Names Anyway'),
      p('<p>One thing worth doing even for platforms you will not use: claim your name on them. It costs nothing, prevents someone else from taking it, and leaves the option open. Just do not leave a completely empty profile — a short description and a link to your site is enough to make it look intentional rather than abandoned.</p>'),
    ],
  },
  bn: {
    title: 'সঠিক প্ল্যাটফর্ম বাছাই',
    metaTitle: 'সোশ্যাল মিডিয়া প্ল্যাটফর্ম বাছাই | Learn Computer Academy',
    metaDescription: 'কম প্ল্যাটফর্মে থাকা কেন সাধারণত ভালো কাজ করে, আর কোনগুলো আপনার সময়ের যোগ্য তা কীভাবে ঠিক করবেন।',
    blocks: [
      p('<p>প্রবৃত্তি হলো সর্বত্র থাকা, যাতে কাউকে না হারানো হয়। বাস্তবে, ছয়টি প্ল্যাটফর্মে সীমিত পরিশ্রম ছড়ালে ছয়টি অবহেলিত অ্যাকাউন্ট তৈরি হয়, আর একটি অবহেলিত অ্যাকাউন্ট কোনো অ্যাকাউন্ট না থাকার চেয়ে খারাপ — যে এটি খুঁজে পায় তার কাছে এটি পরিত্যক্ত দেখায়।</p>'),

      h(2, 'দুটি প্রশ্ন যা এটি ঠিক করে', 'two-questions-that-decide-it'),
      p('<ol><li><b>আপনার দর্শক কি সত্যিই সেখানে?</b> "সেখানে কি অনেক মানুষ আছে" নয় — <i>আপনার</i> মানুষ কি সেখানে, এমন মানসিকতায় যেখানে আপনি যা দেন তা অর্থপূর্ণ।</li><li><b>প্ল্যাটফর্ম যা পুরস্কৃত করে তা কি আপনি বারবার তৈরি করতে পারেন?</b> প্রতিটি প্ল্যাটফর্ম একটি ফরম্যাটকে অগ্রাধিকার দেয়। আপনি যদি টেকসইভাবে ছোট ভিডিও বানাতে না পারেন, ছোট ভিডিওর চারপাশে তৈরি একটি প্ল্যাটফর্ম তার আকার নির্বিশেষে আপনার জন্য নয়।</li></ol><p>একটি প্ল্যাটফর্মকে দুটোই পাস করতে হবে। শুধু প্রথমটি পাস করলে এমন একটি অ্যাকাউন্ট হয় যা আপনি বজায় রাখতে পারেন না; শুধু দ্বিতীয়টি পাস করলে এমন কন্টেন্ট হয় যা প্রাসঙ্গিক কেউ দেখে না।</p>'),

      h(2, 'প্রতিটি ব্যাপকভাবে কীসের উপযোগী', 'what-each-is-broadly-suited-to'),
      table(
        ['প্ল্যাটফর্ম', 'সাধারণত যার জন্য কাজ করে', 'প্রধান ফরম্যাট'],
        [
          ['Facebook', 'স্থানীয় ব্যবসা, কমিউনিটি, বয়স্ক জনগোষ্ঠী, group', 'মিশ্র — টেক্সট, ছবি, ভিডিও, ইভেন্ট'],
          ['Instagram', 'দৃশ্যগত কাজ, পণ্য, খাবার, ডিজাইন, ব্যক্তিগত ব্র‍্যান্ড', 'ছবি আর ছোট ভিডিও'],
          ['LinkedIn', 'B2B, পেশাদার সেবা, নিয়োগ, শিল্পে দক্ষতা', 'টেক্সট পোস্ট আর প্রবন্ধ'],
          ['YouTube', 'দেখানো থেকে উপকৃত হয় এমন যেকোনো কিছু', 'দীর্ঘ আর ছোট ভিডিও'],
          ['WhatsApp / মেসেজিং', 'সরাসরি গ্রাহক যোগাযোগ, স্থানীয় সেবা ব্যবসা', 'এক-জনে-এক আর broadcast'],
        ]
      ),

      callout('note', '<p>এই টেবিলটিকে একটি শুরুর দিকনির্দেশনা হিসেবে নিন, একটি নিয়ম হিসেবে নয়। প্ল্যাটফর্মের জনগোষ্ঠী আর প্রধান ফরম্যাট সময়ের সাথে সরে, আর প্রতিটি প্ল্যাটফর্মে সফল অ্যাকাউন্ট আছে যারা প্রচলিত পরামর্শ উপেক্ষা করে। উপরের দুটি প্রশ্ন যেকোনো টেবিলের চেয়ে বেশি গুরুত্বপূর্ণ।</p>'),

      h(2, 'এক বা দুটি দিয়ে শুরু করুন', 'start-with-one-or-two'),
      p('<p>যে প্ল্যাটফর্মে দুটি প্রশ্ন সবচেয়ে স্পষ্ট হ্যাঁ দেয় সেটি বাছুন, আর কয়েক মাস ঠিকভাবে এতে লেগে থাকুন। বাস্তব সম্পৃক্ততাযুক্ত একটি ভালোভাবে রক্ষণাবেক্ষণ করা অ্যাকাউন্ট পাঁচটি নিষ্ক্রিয় অ্যাকাউন্টের চেয়ে বেশি মূল্যবান, আর পরিশ্রম বাড়ানোর আগে এটি আপনাকে শেখায় আসলে কী কাজ করে।</p><p>পরে বিস্তৃত করা সহজ। এক বছর দৃশ্যত পরিত্যক্ত একটি অ্যাকাউন্ট পুনরুদ্ধার নতুন করে শুরুর চেয়ে কঠিন।</p>'),

      h(2, 'সর্বত্র একই কন্টেন্ট পোস্ট করবেন না', 'do-not-post-identical-content-everywhere'),
      p('<p>প্রতিটি প্ল্যাটফর্মে একই জিনিস স্বয়ংক্রিয়ভাবে cross-post করা দক্ষ আর খারাপ পারফর্ম করে। প্রতিটি প্ল্যাটফর্মের নিজস্ব প্রথা আছে — দৈর্ঘ্য, সুর, ফরম্যাট, লিংক কীভাবে গণ্য হয় — আর স্পষ্টতই অন্য কোথাওর জন্য ফরম্যাট করা কন্টেন্ট ঠিক সেভাবেই পড়া যায়।</p><p>পুনর্ব্যবহার cross-posting থেকে আলাদা: একই অন্তর্নিহিত ধারণা, যেখানে যাচ্ছে তার উপযোগী করে পুনর্লিখিত। এতে কয়েক মিনিট বেশি লাগে আর এটি ধারাবাহিকভাবে অটোমেশনকে হারায়।</p>'),

      h(2, 'নাম যাই হোক সংরক্ষণ করুন', 'reserve-the-names-anyway'),
      p('<p>যে প্ল্যাটফর্ম আপনি ব্যবহার করবেন না তার জন্যও একটি জিনিস করার যোগ্য: সেগুলোতে আপনার নাম দাবি করুন। এতে কোনো খরচ নেই, এটি অন্য কাউকে নেওয়া থেকে ঠেকায়, আর বিকল্পটি খোলা রাখে। শুধু একটি সম্পূর্ণ খালি প্রোফাইল রাখবেন না — একটি ছোট বর্ণনা আর আপনার সাইটের একটি লিংক এটিকে পরিত্যক্তের বদলে ইচ্ছাকৃত দেখাতে যথেষ্ট।</p>'),
    ],
  },
})

lessons.push({
  slug: 'facebook-and-instagram',
  sortOrder: 15,
  en: {
    title: 'Facebook & Instagram (Organic)',
    metaTitle: 'Facebook and Instagram Organic Marketing | Learn Computer Academy',
    metaDescription: 'How to use Facebook and Instagram without paying for reach — what to post, what the platforms reward, and what to avoid.',
    blocks: [
      p('<p>Facebook and Instagram are run by the same company and share an advertising system, but they behave quite differently for organic content. This lesson is about the free side; paid advertising on both is covered later in this course.</p>'),

      h(2, 'What They Are Each Good For'),
      p('<p><b>Facebook</b> retains strengths that are easy to overlook: Groups, Events, Marketplace, and a genuinely local reach that suits businesses serving a specific area. Its audience skews older than Instagram\'s in many markets, which is an advantage or a disadvantage depending entirely on who you serve.</p><p><b>Instagram</b> is visual first. It suits work that can be shown — food, design, physical products, before-and-after results, spaces, craft. A business whose value is hard to photograph will find it a harder fit, and that is worth admitting early rather than fighting.</p>'),

      h(2, 'What Both Platforms Reward'),
      p('<ul><li><b>Content people stop for.</b> Dwell time is a strong signal — something that holds attention travels further.</li><li><b>Saves and shares</b>, which indicate genuine value more strongly than a like.</li><li><b>Comments and replies</b>, especially conversation rather than one-word reactions.</li><li><b>Video, and particularly short vertical video</b>, which both platforms have pushed heavily.</li><li><b>Consistency.</b> Accounts that post regularly are treated better than accounts that appear sporadically.</li></ul>'),

      callout('warning', '<p>Both platforms reduce distribution for posts that send people away — external links in particular. This does not mean never linking; it means a link-only post is usually the weakest thing you can publish. Common workarounds are putting the link in the profile or the first comment, and making the post itself worth reading on its own so the link is a bonus rather than the whole point.</p>', 'Links get less reach'),

      h(2, 'What to Post'),
      table(
        ['Type', 'Why it works'],
        [
          ['Behind the scenes', 'Shows the people and process; builds familiarity'],
          ['Before and after', 'Immediately understandable proof of what you do'],
          ['Answering a common question', 'Useful on its own, and others had the same question'],
          ['Customer results', 'Evidence, with permission'],
          ['Short how-to video', 'High save rate; people keep it for later'],
          ['Local content', 'Community relevance, which Facebook in particular favours'],
        ]
      ),

      h(2, 'Practical Points'),
      p('<ul><li><b>Write the first line to earn the second.</b> Captions are truncated; the visible part decides whether anyone expands it.</li><li><b>Post natively.</b> Upload video directly rather than linking to it elsewhere — native content is distributed more widely.</li><li><b>Reply to comments</b>, quickly. It increases engagement mechanically and it is the part that builds a relationship.</li><li><b>Use a business account</b> rather than a personal one, so you get the analytics.</li><li><b>Do not buy followers.</b> A follower count that does not engage actively harms reach, because the platform measures response rate against audience size.</li></ul>'),

      h(2, 'On Hashtags'),
      p('<p>Hashtag advice ages badly and their importance has been repeatedly overstated and revised. The stable version: a small number of genuinely relevant hashtags is reasonable, thirty barely-related ones look like spam, and no quantity of hashtags rescues content nobody wants to engage with. They are a minor discovery aid, not a growth strategy.</p>'),
    ],
  },
  bn: {
    title: 'Facebook আর Instagram (Organic)',
    metaTitle: 'Facebook আর Instagram Organic মার্কেটিং | Learn Computer Academy',
    metaDescription: 'নাগালের জন্য টাকা না দিয়ে Facebook আর Instagram কীভাবে ব্যবহার করবেন — কী পোস্ট করবেন, প্ল্যাটফর্ম কী পুরস্কৃত করে, আর কী এড়াবেন।',
    blocks: [
      p('<p>Facebook আর Instagram একই কোম্পানি চালায় আর একটি বিজ্ঞাপন সিস্টেম ভাগ করে, কিন্তু organic কন্টেন্টের জন্য সেগুলো বেশ ভিন্নভাবে আচরণ করে। এই পাঠটি বিনামূল্যের দিক নিয়ে; দুটোতেই পেইড বিজ্ঞাপন এই কোর্সে পরে কভার করা হয়েছে।</p>'),

      h(2, 'প্রতিটি কীসের জন্য ভালো', 'what-they-are-each-good-for'),
      p('<p><b>Facebook</b> এমন শক্তি ধরে রেখেছে যা সহজে চোখ এড়ায়: Group, Event, Marketplace, আর একটি সত্যিকারের স্থানীয় নাগাল যা একটি নির্দিষ্ট এলাকায় সেবা দেওয়া ব্যবসার উপযোগী। অনেক বাজারে এর দর্শক Instagram-এর চেয়ে বয়স্ক দিকে ঝোঁকে, যা আপনি কাকে সেবা দেন তার উপর সম্পূর্ণ নির্ভর করে একটি সুবিধা বা অসুবিধা।</p><p><b>Instagram</b> আগে দৃশ্যগত। এটি এমন কাজের উপযোগী যা দেখানো যায় — খাবার, ডিজাইন, ভৌত পণ্য, আগে-পরের ফলাফল, স্থান, কারুকাজ। যে ব্যবসার মূল্য ছবি তোলা কঠিন সেটি এটিকে কঠিন মিল পাবে, আর সেটি লড়াই না করে আগেই স্বীকার করা ভালো।</p>'),

      h(2, 'দুটি প্ল্যাটফর্মই কী পুরস্কৃত করে', 'what-both-platforms-reward'),
      p('<ul><li><b>যে কন্টেন্টের জন্য মানুষ থামে।</b> Dwell time একটি জোরালো সংকেত — যা মনোযোগ ধরে রাখে তা আরও দূরে যায়।</li><li><b>Save আর share</b>, যা একটি like-এর চেয়ে বেশি জোরালোভাবে প্রকৃত মূল্য নির্দেশ করে।</li><li><b>মন্তব্য আর জবাব</b>, বিশেষত এক-শব্দের প্রতিক্রিয়ার বদলে কথোপকথন।</li><li><b>ভিডিও, আর বিশেষত ছোট উল্লম্ব ভিডিও</b>, যা দুটি প্ল্যাটফর্মই জোরালোভাবে ঠেলেছে।</li><li><b>ধারাবাহিকতা।</b> যে অ্যাকাউন্ট নিয়মিত পোস্ট করে তাকে বিক্ষিপ্তভাবে দেখা দেওয়া অ্যাকাউন্টের চেয়ে ভালোভাবে গণ্য করা হয়।</li></ul>'),

      callout('warning', '<p>দুটি প্ল্যাটফর্মই মানুষকে দূরে পাঠানো পোস্টের বিতরণ কমায় — বিশেষত বাইরের লিংক। এর অর্থ কখনো লিংক না করা নয়; এর অর্থ শুধু-লিংক একটি পোস্ট সাধারণত আপনার প্রকাশ করা সবচেয়ে দুর্বল জিনিস। সাধারণ সমাধান হলো লিংকটি প্রোফাইলে বা প্রথম মন্তব্যে রাখা, আর পোস্টটিকে নিজেই পড়ার যোগ্য করা যাতে লিংকটি পুরো উদ্দেশ্যের বদলে একটি বোনাস হয়।</p>', 'লিংক কম নাগাল পায়'),

      h(2, 'কী পোস্ট করবেন', 'what-to-post'),
      table(
        ['ধরন', 'এটি কেন কাজ করে'],
        [
          ['পর্দার পেছনে', 'মানুষ আর প্রক্রিয়া দেখায়; পরিচিতি তৈরি করে'],
          ['আগে আর পরে', 'আপনি কী করেন তার সাথে সাথে বোধগম্য প্রমাণ'],
          ['একটি সাধারণ প্রশ্নের উত্তর', 'নিজে কাজের, আর অন্যদেরও একই প্রশ্ন ছিল'],
          ['গ্রাহকের ফলাফল', 'প্রমাণ, অনুমতি সহ'],
          ['ছোট how-to ভিডিও', 'উঁচু save rate; মানুষ পরের জন্য রাখে'],
          ['স্থানীয় কন্টেন্ট', 'কমিউনিটির প্রাসঙ্গিকতা, যা বিশেষত Facebook অগ্রাধিকার দেয়'],
        ]
      ),

      h(2, 'ব্যবহারিক বিষয়', 'practical-points'),
      p('<ul><li><b>দ্বিতীয় লাইন অর্জনের জন্য প্রথম লাইন লিখুন।</b> Caption কাটা হয়; দৃশ্যমান অংশটি ঠিক করে কেউ এটি খুলবে কিনা।</li><li><b>Native-ভাবে পোস্ট করুন।</b> অন্যত্র লিংক না করে সরাসরি ভিডিও আপলোড করুন — native কন্টেন্ট আরও বিস্তৃতভাবে বিতরণ হয়।</li><li><b>মন্তব্যের জবাব দিন</b>, দ্রুত। এটি যান্ত্রিকভাবে সম্পৃক্ততা বাড়ায় আর এটিই সেই অংশ যা একটি সম্পর্ক গড়ে।</li><li>একটি ব্যক্তিগত অ্যাকাউন্টের বদলে <b>একটি business অ্যাকাউন্ট ব্যবহার করুন</b>, যাতে আপনি analytics পান।</li><li><b>Follower কিনবেন না।</b> যে follower সংখ্যা যুক্ত হয় না তা সক্রিয়ভাবে নাগালের ক্ষতি করে, কারণ প্ল্যাটফর্ম দর্শকের আকারের বিপরীতে সাড়ার হার মাপে।</li></ul>'),

      h(2, 'Hashtag প্রসঙ্গে', 'on-hashtags'),
      p('<p>Hashtag পরামর্শ খারাপভাবে পুরোনো হয় আর সেগুলোর গুরুত্ব বারবার অতিরঞ্জিত আর সংশোধিত হয়েছে। স্থিতিশীল সংস্করণ: অল্প সংখ্যক সত্যিই প্রাসঙ্গিক hashtag যুক্তিসঙ্গত, ত্রিশটি সামান্য-সম্পর্কিত hashtag spam-এর মতো দেখায়, আর কোনো পরিমাণ hashtag এমন কন্টেন্ট বাঁচায় না যাতে কেউ যুক্ত হতে চায় না। সেগুলো একটি গৌণ আবিষ্কারের সহায়ক, একটি বৃদ্ধির কৌশল নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'linkedin',
  sortOrder: 16,
  en: {
    title: 'LinkedIn',
    metaTitle: 'LinkedIn Marketing | Learn Computer Academy',
    metaDescription: 'How LinkedIn differs from other social platforms, what works there, and why personal profiles outperform company pages.',
    blocks: [
      p('<p>LinkedIn is where people go in a professional frame of mind, which makes it different from platforms people scroll for entertainment. That difference determines almost everything about what works there.</p>'),

      h(2, 'Who It Suits'),
      p('<p>LinkedIn is a strong fit for businesses selling to other businesses, professional and consulting services, recruitment, training, and anyone whose credibility is a large part of what they are selling. It is a poor fit for most consumer products bought on impulse.</p><p>For a training institute, it reaches two distinct audiences: working professionals considering additional skills, and employers who hire people with those skills.</p>'),

      h(2, 'Personal Profiles Beat Company Pages'),
      p('<p>Content posted from a personal profile consistently reaches further than the same content from a company page. This is not a quirk to work around — it reflects how people use the platform. They follow individuals they find worth reading; company pages read as corporate broadcasting.</p><p>The practical approach is for the people in a business to post as themselves, with the company page used for official information, jobs, and a credible profile for anyone who checks.</p>'),

      h(2, 'What Works'),
      p('<ul><li><b>Specific professional insight.</b> Something you learned doing the work that a reader could apply.</li><li><b>Honest accounts of what went wrong.</b> These consistently outperform success stories, because everyone has read enough success stories.</li><li><b>Explaining industry changes</b> in plain language for people who need to understand but do not follow it closely.</li><li><b>Genuine commentary on other people\'s posts.</b> A thoughtful comment on a widely-read post can reach more relevant people than your own post.</li><li><b>Native text posts.</b> LinkedIn favours content that stays on LinkedIn, as most platforms do.</li></ul>'),

      callout('warning', '<p>LinkedIn has a recognisable and widely-mocked writing style — one-line paragraphs, a manufactured emotional hook, a trivial anecdote leading to a grand business lesson. It is imitated because it once worked. It is now familiar enough that many readers recognise the formula immediately, and the reaction is not admiration. Write like a person who knows something, not like the format.</p>', 'Avoid the parody style'),

      h(2, 'The Profile Itself'),
      p('<p>Unlike most platforms, a LinkedIn profile is itself marketing — people check it before meetings, after a first contact, and when deciding whether to reply. Worth getting right:</p><ul><li>A headline that says what you do for people, not just a job title.</li><li>An About section written in plain first person, describing the problems you solve.</li><li>Specific, real detail in your experience rather than generic responsibilities.</li><li>A current photo. Profiles without one get substantially less engagement.</li></ul>'),

      h(2, 'Consistency Over Volume, Again'),
      p('<p>The same principle as every other channel in this course: a genuinely useful post once a week, sustained, builds a professional reputation over months. A burst of daily posting for two weeks builds nothing, and the abandoned profile that follows is visible to anyone who checks.</p>'),
    ],
  },
  bn: {
    title: 'LinkedIn',
    metaTitle: 'LinkedIn মার্কেটিং | Learn Computer Academy',
    metaDescription: 'LinkedIn অন্য সোশ্যাল প্ল্যাটফর্ম থেকে কীভাবে আলাদা, সেখানে কী কাজ করে, আর কেন ব্যক্তিগত প্রোফাইল কোম্পানির পাতাকে হারায়।',
    blocks: [
      p('<p>LinkedIn হলো যেখানে মানুষ একটি পেশাদার মানসিকতায় যায়, যা এটিকে সেই প্ল্যাটফর্ম থেকে আলাদা করে যেগুলোতে মানুষ বিনোদনের জন্য স্ক্রল করে। সেই পার্থক্যই সেখানে কী কাজ করে তার প্রায় সবকিছু নির্ধারণ করে।</p>'),

      h(2, 'এটি কার উপযোগী', 'who-it-suits'),
      p('<p>LinkedIn অন্য ব্যবসার কাছে বিক্রি করা ব্যবসা, পেশাদার আর পরামর্শ সেবা, নিয়োগ, প্রশিক্ষণ, আর যাদের বিশ্বাসযোগ্যতা তারা যা বিক্রি করছে তার একটি বড় অংশ তাদের জন্য একটি শক্তিশালী মিল। এটি আবেগে কেনা বেশিরভাগ ভোক্তা পণ্যের জন্য একটি দুর্বল মিল।</p><p>একটি প্রশিক্ষণ প্রতিষ্ঠানের জন্য, এটি দুটি স্বতন্ত্র দর্শকে পৌঁছায়: অতিরিক্ত দক্ষতা বিবেচনা করা কর্মজীবী পেশাদার, আর যে নিয়োগকর্তারা সেই দক্ষতাযুক্ত মানুষ নিয়োগ করে।</p>'),

      h(2, 'ব্যক্তিগত প্রোফাইল কোম্পানির পাতাকে হারায়', 'personal-profiles-beat-company-pages'),
      p('<p>একটি ব্যক্তিগত প্রোফাইল থেকে পোস্ট করা কন্টেন্ট ধারাবাহিকভাবে একটি কোম্পানির পাতা থেকে একই কন্টেন্টের চেয়ে দূরে পৌঁছায়। এটি কাজ চালিয়ে নেওয়ার মতো একটি খামখেয়াল নয় — এটি প্রতিফলিত করে মানুষ প্ল্যাটফর্মটি কীভাবে ব্যবহার করে। তারা এমন ব্যক্তিদের follow করে যাদের পড়ার যোগ্য মনে করে; কোম্পানির পাতা কর্পোরেট সম্প্রচার হিসেবে পড়া যায়।</p><p>ব্যবহারিক পদ্ধতি হলো একটি ব্যবসার মানুষরা নিজেদের হিসেবে পোস্ট করবে, কোম্পানির পাতা আনুষ্ঠানিক তথ্য, চাকরি, আর যে কেউ যাচাই করলে একটি বিশ্বাসযোগ্য প্রোফাইলের জন্য ব্যবহার করে।</p>'),

      h(2, 'কী কাজ করে', 'what-works'),
      p('<ul><li><b>নির্দিষ্ট পেশাদার অন্তর্দৃষ্টি।</b> কাজ করতে গিয়ে আপনি যা শিখেছেন তা একজন পাঠক প্রয়োগ করতে পারে।</li><li><b>কী ভুল হয়েছিল তার সৎ বিবরণ।</b> এগুলো ধারাবাহিকভাবে সাফল্যের গল্পকে হারায়, কারণ সবাই যথেষ্ট সাফল্যের গল্প পড়েছে।</li><li>যাদের বুঝতে হয় কিন্তু ঘনিষ্ঠভাবে অনুসরণ করে না তাদের জন্য সহজ ভাষায় <b>শিল্পের পরিবর্তন ব্যাখ্যা করা</b>।</li><li><b>অন্যের পোস্টে সত্যিকারের মন্তব্য।</b> একটি ব্যাপকভাবে পড়া পোস্টে একটি চিন্তাশীল মন্তব্য আপনার নিজের পোস্টের চেয়ে বেশি প্রাসঙ্গিক মানুষে পৌঁছাতে পারে।</li><li><b>Native টেক্সট পোস্ট।</b> LinkedIn এমন কন্টেন্টকে অগ্রাধিকার দেয় যা LinkedIn-এ থাকে, বেশিরভাগ প্ল্যাটফর্মের মতোই।</li></ul>'),

      callout('warning', '<p>LinkedIn-এর একটি চেনা আর ব্যাপকভাবে উপহাস করা লেখার ধরন আছে — এক-লাইনের অনুচ্ছেদ, একটি কৃত্রিম আবেগের টোপ, একটি তুচ্ছ ঘটনা থেকে একটি বিশাল ব্যবসায়িক শিক্ষা। এটি অনুকরণ করা হয় কারণ এটি একসময় কাজ করেছিল। এটি এখন যথেষ্ট পরিচিত যে অনেক পাঠক সাথে সাথে সূত্রটি চিনে ফেলে, আর প্রতিক্রিয়াটি প্রশংসা নয়। ফরম্যাটের মতো নয়, এমন একজন মানুষের মতো লিখুন যে কিছু জানে।</p>', 'ব্যঙ্গের ধরন এড়ান'),

      h(2, 'প্রোফাইল নিজেই', 'the-profile-itself'),
      p('<p>বেশিরভাগ প্ল্যাটফর্মের মতো নয়, একটি LinkedIn প্রোফাইল নিজেই মার্কেটিং — মানুষ মিটিংয়ের আগে, একটি প্রথম যোগাযোগের পরে, আর জবাব দেবে কিনা ঠিক করার সময় এটি যাচাই করে। ঠিক করার যোগ্য:</p><ul><li>একটি শিরোনাম যা বলে আপনি মানুষের জন্য কী করেন, শুধু একটি পদবি নয়।</li><li>সহজ প্রথম পুরুষে লেখা একটি About অংশ, আপনি যে সমস্যা সমাধান করেন তা বর্ণনা করে।</li><li>সাধারণ দায়িত্বের বদলে আপনার অভিজ্ঞতায় নির্দিষ্ট, বাস্তব বিবরণ।</li><li>একটি বর্তমান ছবি। ছবি ছাড়া প্রোফাইল যথেষ্ট কম সম্পৃক্ততা পায়।</li></ul>'),

      h(2, 'আবারও, পরিমাণের চেয়ে ধারাবাহিকতা', 'consistency-over-volume-again'),
      p('<p>এই কোর্সের অন্য প্রতিটি চ্যানেলের একই নীতি: সপ্তাহে একবার একটি সত্যিই কাজের পোস্ট, বজায় রাখা, মাসের পর মাসে একটি পেশাদার সুনাম গড়ে। দুই সপ্তাহ দৈনিক পোস্টের একটি গুচ্ছ কিছুই গড়ে না, আর এরপরের পরিত্যক্ত প্রোফাইলটি যে কেউ যাচাই করলে দৃশ্যমান।</p>'),
    ],
  },
})

lessons.push({
  slug: 'youtube-and-video',
  sortOrder: 17,
  en: {
    title: 'YouTube & Video Marketing',
    metaTitle: 'YouTube and Video Marketing | Learn Computer Academy',
    metaDescription: 'Why YouTube behaves more like a search engine than a social network, and what that changes about how to use it.',
    blocks: [
      p('<p>YouTube is usually grouped with social media and behaves quite differently. It is closer to a search engine: people arrive looking for something specific, videos surface in results for years afterwards, and the back catalogue keeps working long after publication.</p>'),

      h(2, 'Why That Distinction Matters'),
      p('<p>A social post has a lifespan measured in hours. A YouTube video answering a real question can accumulate views for years — much closer to how an article ranks in search than to how a post performs in a feed.</p><p>The practical consequence: <b>plan YouTube content the way you would plan search content.</b> Answer questions people actually type. The keyword research approach from the SEO course applies directly here, because the same behaviour drives both.</p>'),

      h(2, 'What Works on Video'),
      p('<ul><li><b>Anything easier to show than describe.</b> Software walkthroughs, physical processes, before-and-after work.</li><li><b>How-to content</b> answering a specific question, titled the way someone would search for it.</li><li><b>Explanations of things people find confusing</b>, where seeing it makes it click.</li><li><b>Reviews and comparisons.</b></li></ul><p>A useful test: if a written article would serve the reader better, write the article. Video for its own sake is expensive and adds nothing.</p>'),

      h(2, 'Titles and Thumbnails'),
      p('<p>These two decide whether a video is watched, and they do different jobs. The <b>title</b> should match how someone would search — clear and descriptive rather than clever. The <b>thumbnail</b> has to be readable at a small size, which means a few large words at most and one clear focal point.</p><p>Both should be honest. Overstating what a video contains produces clicks followed by immediate exits, and the platform measures exactly that.</p>'),

      callout('note', '<p>The single most important measure on YouTube is how long people keep watching. A video that holds attention gets recommended; one people leave quickly does not, regardless of how many clicked. This is why the opening seconds matter disproportionately — get to the point immediately rather than opening with a long introduction.</p>', 'Watch time is the metric that matters'),

      h(2, 'Production Quality, Honestly'),
      p('<p>Clear audio matters more than picture quality. Viewers tolerate imperfect video and abandon bad sound quickly, so a basic microphone is the highest-value equipment purchase available.</p><p>Beyond that, most useful business video is made with a phone, reasonable light, and preparation. Waiting until you can afford a proper setup is a common way of never starting — and the videos that answer real questions outperform polished videos that answer none.</p>'),

      h(2, 'Video Beyond YouTube'),
      p('<p>Video also serves as content elsewhere: embedded on your own pages, where it increases time on page and explains things text struggles with; in emails, usually as a thumbnail linking out; and as source material for the short-form clips covered in the next lesson.</p><p>One caution: uploading directly to a social platform gets better distribution there than linking to YouTube, so a video worth publishing in both places is usually worth uploading twice rather than linking.</p>'),
    ],
  },
  bn: {
    title: 'YouTube আর ভিডিও মার্কেটিং',
    metaTitle: 'YouTube আর ভিডিও মার্কেটিং | Learn Computer Academy',
    metaDescription: 'YouTube কেন একটি সোশ্যাল নেটওয়ার্কের চেয়ে একটি সার্চ ইঞ্জিনের মতো আচরণ করে, আর এটি ব্যবহারের ক্ষেত্রে তা কী বদলায়।',
    blocks: [
      p('<p>YouTube সাধারণত সোশ্যাল মিডিয়ার সাথে দলবদ্ধ করা হয় আর বেশ ভিন্নভাবে আচরণ করে। এটি একটি সার্চ ইঞ্জিনের কাছাকাছি: মানুষ নির্দিষ্ট কিছু খুঁজতে আসে, ভিডিও বছরের পর বছর ফলাফলে দেখা যায়, আর পুরোনো সংগ্রহ প্রকাশের অনেক পরেও কাজ করতে থাকে।</p>'),

      h(2, 'সেই পার্থক্য কেন গুরুত্বপূর্ণ', 'why-that-distinction-matters'),
      p('<p>একটি সোশ্যাল পোস্টের আয়ু ঘণ্টায় মাপা হয়। একটি বাস্তব প্রশ্নের উত্তর দেওয়া একটি YouTube ভিডিও বছরের পর বছর ভিউ জমাতে পারে — একটি ফিডে একটি পোস্ট কেমন পারফর্ম করে তার চেয়ে একটি প্রবন্ধ সার্চে কীভাবে র‍্যাংক করে তার অনেক কাছাকাছি।</p><p>ব্যবহারিক পরিণতি: <b>YouTube কন্টেন্ট এমনভাবে পরিকল্পনা করুন যেভাবে আপনি সার্চ কন্টেন্ট পরিকল্পনা করতেন।</b> মানুষ আসলে যা টাইপ করে তার উত্তর দিন। SEO কোর্সের keyword research পদ্ধতি এখানে সরাসরি প্রযোজ্য, কারণ একই আচরণ দুটোই চালায়।</p>'),

      h(2, 'ভিডিওতে কী কাজ করে', 'what-works-on-video'),
      p('<ul><li><b>বর্ণনার চেয়ে দেখানো সহজ এমন যেকোনো কিছু।</b> সফটওয়্যার walkthrough, ভৌত প্রক্রিয়া, আগে-পরের কাজ।</li><li>একটি নির্দিষ্ট প্রশ্নের উত্তর দেওয়া <b>How-to কন্টেন্ট</b>, কেউ যেভাবে সার্চ করবে সেভাবে শিরোনাম দেওয়া।</li><li><b>মানুষ যা বিভ্রান্তিকর মনে করে তার ব্যাখ্যা</b>, যেখানে দেখলে বোঝা যায়।</li><li><b>রিভিউ আর তুলনা।</b></li></ul><p>একটি কাজের পরীক্ষা: একটি লিখিত প্রবন্ধ পাঠকের বেশি সেবা দিলে, প্রবন্ধটি লিখুন। নিজের জন্য ভিডিও ব্যয়বহুল আর কিছুই যোগ করে না।</p>'),

      h(2, 'শিরোনাম আর Thumbnail', 'titles-and-thumbnails'),
      p('<p>এই দুটি ঠিক করে একটি ভিডিও দেখা হয় কিনা, আর সেগুলো ভিন্ন কাজ করে। <b>শিরোনাম</b> কেউ কীভাবে সার্চ করবে তার সাথে মেলা উচিত — চতুরের বদলে স্পষ্ট আর বর্ণনামূলক। <b>Thumbnail</b> একটি ছোট আকারে পঠনযোগ্য হতে হবে, যার অর্থ বড়জোর কয়েকটি বড় শব্দ আর একটি স্পষ্ট কেন্দ্রবিন্দু।</p><p>দুটোই সৎ হওয়া উচিত। একটি ভিডিওতে কী আছে তা অতিরঞ্জিত করলে ক্লিক তৈরি হয় যার পরেই সাথে সাথে প্রস্থান হয়, আর প্ল্যাটফর্ম ঠিক সেটিই মাপে।</p>'),

      callout('note', '<p>YouTube-এ সবচেয়ে গুরুত্বপূর্ণ একক মাপ হলো মানুষ কতক্ষণ দেখতে থাকে। যে ভিডিও মনোযোগ ধরে রাখে তা সুপারিশ পায়; যেটি মানুষ দ্রুত ছেড়ে যায় তা পায় না, কতজন ক্লিক করেছে তা নির্বিশেষে। এই কারণেই শুরুর সেকেন্ডগুলো অসামঞ্জস্যপূর্ণভাবে গুরুত্বপূর্ণ — একটি দীর্ঘ ভূমিকা দিয়ে শুরু না করে সাথে সাথে মূল কথায় আসুন।</p>', 'Watch time-ই সেই মেট্রিক যা গুরুত্বপূর্ণ'),

      h(2, 'প্রোডাকশনের গুণমান, সৎভাবে', 'production-quality-honestly'),
      p('<p>ছবির মানের চেয়ে স্পষ্ট অডিও বেশি গুরুত্বপূর্ণ। দর্শক অপূর্ণ ভিডিও সহ্য করে আর খারাপ শব্দ দ্রুত ছেড়ে দেয়, তাই একটি সাধারণ মাইক্রোফোন উপলব্ধ সবচেয়ে বেশি মূল্যের সরঞ্জাম কেনা।</p><p>এর বাইরে, বেশিরভাগ কাজের ব্যবসায়িক ভিডিও একটি ফোন, যুক্তিসঙ্গত আলো, আর প্রস্তুতি দিয়ে বানানো হয়। একটি ঠিকঠাক সেটআপের সামর্থ্য না হওয়া পর্যন্ত অপেক্ষা করা কখনো শুরু না করার একটি সাধারণ উপায় — আর যে ভিডিও বাস্তব প্রশ্নের উত্তর দেয় তা কোনো প্রশ্নের উত্তর না দেওয়া পরিপাটি ভিডিওকে হারায়।</p>'),

      h(2, 'YouTube-এর বাইরে ভিডিও', 'video-beyond-youtube'),
      p('<p>ভিডিও অন্যত্রও কন্টেন্ট হিসেবে কাজ করে: নিজের পাতায় embed করা, যেখানে এটি পাতায় সময় বাড়ায় আর টেক্সট যা ব্যাখ্যা করতে হিমশিম খায় তা ব্যাখ্যা করে; ইমেইলে, সাধারণত বাইরে লিংক করা একটি thumbnail হিসেবে; আর পরের পাঠে কভার করা ছোট-দৈর্ঘ্যের ক্লিপের উৎস উপাদান হিসেবে।</p><p>একটি সতর্কতা: একটি সোশ্যাল প্ল্যাটফর্মে সরাসরি আপলোড করলে YouTube-এ লিংক করার চেয়ে সেখানে ভালো বিতরণ পাওয়া যায়, তাই দুটি জায়গাতেই প্রকাশের যোগ্য একটি ভিডিও সাধারণত লিংক করার বদলে দুবার আপলোড করার যোগ্য।</p>'),
    ],
  },
})

lessons.push({
  slug: 'short-form-video',
  sortOrder: 18,
  en: {
    title: 'Short-Form Video',
    metaTitle: 'Short-Form Video Marketing | Learn Computer Academy',
    metaDescription: 'Why short vertical video reaches beyond your followers, how the format differs, and what makes one work.',
    blocks: [
      p('<p>Short vertical video — Reels, Shorts, TikTok — is the one place where organic reach beyond your existing followers is still readily available. That is the whole reason it is worth the effort, and it is why every major platform has pushed the format hard.</p>'),

      h(2, 'Why It Reaches Further'),
      p('<p>Ordinary social posts are shown mostly to people who already follow you. Short-form video is distributed primarily through recommendation feeds, where the platform shows content to people based on interest rather than connection.</p><p>The practical consequence is unusual: a new account with no followers can reach a large audience, because follower count is not the main input. That makes it the most accessible growth channel currently available, and also the least predictable.</p>'),

      h(2, 'The Format Is Genuinely Different'),
      p('<ul><li><b>Vertical.</b> Filmed for a phone held upright, not cropped from horizontal footage.</li><li><b>Fast.</b> The first second or two decides whether someone keeps watching. There is no room for a title card or an introduction.</li><li><b>Self-contained.</b> Viewers arrive with no context about who you are.</li><li><b>Watched without sound, often.</b> Captions are not optional.</li><li><b>Looping.</b> A video that ends where it began gets rewatched, which counts in your favour.</li></ul>'),

      callout('warning', '<p>Re-posting a horizontal YouTube clip with black bars, or a video that opens with five seconds of logo animation, will not work. The format punishes both immediately. Content genuinely made for short-form is a different production, not a crop.</p>'),

      h(2, 'What Works'),
      table(
        ['Type', 'Why'],
        [
          ['One tip, delivered fast', 'Complete value in under a minute; high save rate'],
          ['A common mistake and the fix', 'Curiosity plus utility'],
          ['Before and after', 'Instantly understandable, no explanation needed'],
          ['A process, sped up', 'Satisfying to watch, shows competence without claiming it'],
          ['Answering a real question', 'Same principle as everywhere else in this course'],
        ]
      ),

      h(2, 'The Opening Seconds'),
      p('<p>Everything depends on the first moment. Practical approaches: start mid-action rather than introducing yourself; state the specific thing the viewer will get; show the end result first and then explain how; or open with the mistake you are about to correct.</p><p>What does not work: "Hi everyone, in today\'s video…". By the time that sentence finishes, most viewers have scrolled.</p>'),

      h(2, 'A Realistic View'),
      p('<p>Short-form reach is volatile in a way other channels are not. A video can reach a very large number of people and produce almost nothing measurable; another can reach far fewer and bring real enquiries. Views are the least meaningful metric available here.</p><p>It is also the most time-consuming format per unit of content. It is worth doing if you can produce it consistently and if the reach converts into something you own — followers who become subscribers, viewers who visit your site. Reach that goes nowhere is a hobby, not marketing.</p>'),
    ],
  },
  bn: {
    title: 'ছোট-দৈর্ঘ্যের ভিডিও',
    metaTitle: 'ছোট-দৈর্ঘ্যের ভিডিও মার্কেটিং | Learn Computer Academy',
    metaDescription: 'ছোট উল্লম্ব ভিডিও কেন আপনার follower-দের বাইরে পৌঁছায়, ফরম্যাটটি কীভাবে আলাদা, আর কী একটিকে কার্যকর করে।',
    blocks: [
      p('<p>ছোট উল্লম্ব ভিডিও — Reels, Shorts, TikTok — একমাত্র জায়গা যেখানে আপনার বিদ্যমান follower-দের বাইরে organic নাগাল এখনো সহজে উপলব্ধ। এটাই এর পুরো কারণ যে এটি পরিশ্রমের যোগ্য, আর এই কারণেই প্রতিটি প্রধান প্ল্যাটফর্ম ফরম্যাটটিকে জোরালোভাবে ঠেলেছে।</p>'),

      h(2, 'এটি কেন দূরে পৌঁছায়', 'why-it-reaches-further'),
      p('<p>সাধারণ সোশ্যাল পোস্ট বেশিরভাগ সেই মানুষদের দেখানো হয় যারা ইতিমধ্যে আপনাকে follow করে। ছোট-দৈর্ঘ্যের ভিডিও প্রধানত সুপারিশের ফিডের মাধ্যমে বিতরণ হয়, যেখানে প্ল্যাটফর্ম সংযোগের বদলে আগ্রহের ভিত্তিতে মানুষকে কন্টেন্ট দেখায়।</p><p>ব্যবহারিক পরিণতিটি অস্বাভাবিক: কোনো follower ছাড়া একটি নতুন অ্যাকাউন্ট একটি বড় দর্শকে পৌঁছাতে পারে, কারণ follower সংখ্যা প্রধান input নয়। এটি এটিকে বর্তমানে উপলব্ধ সবচেয়ে সহজলভ্য বৃদ্ধির চ্যানেল করে, আর সবচেয়ে কম অনুমানযোগ্যও।</p>'),

      h(2, 'ফরম্যাটটি সত্যিই আলাদা', 'the-format-is-genuinely-different'),
      p('<ul><li><b>উল্লম্ব।</b> সোজা ধরা একটি ফোনের জন্য শুট করা, অনুভূমিক ফুটেজ থেকে crop করা নয়।</li><li><b>দ্রুত।</b> প্রথম এক-দুই সেকেন্ড ঠিক করে কেউ দেখতে থাকবে কিনা। একটি শিরোনাম কার্ড বা একটি ভূমিকার জায়গা নেই।</li><li><b>স্বয়ংসম্পূর্ণ।</b> দর্শক আপনি কে সে সম্পর্কে কোনো প্রেক্ষাপট ছাড়াই আসে।</li><li><b>প্রায়ই শব্দ ছাড়া দেখা হয়।</b> Caption ঐচ্ছিক নয়।</li><li><b>Loop হয়।</b> যে ভিডিও যেখানে শুরু হয়েছিল সেখানে শেষ হয় তা আবার দেখা হয়, যা আপনার পক্ষে গণনা হয়।</li></ul>'),

      callout('warning', '<p>কালো বারসহ একটি অনুভূমিক YouTube ক্লিপ পুনরায় পোস্ট করা, বা পাঁচ সেকেন্ডের logo অ্যানিমেশন দিয়ে শুরু হওয়া একটি ভিডিও কাজ করবে না। ফরম্যাটটি দুটোকেই সাথে সাথে শাস্তি দেয়। সত্যিই ছোট-দৈর্ঘ্যের জন্য বানানো কন্টেন্ট একটি ভিন্ন প্রোডাকশন, একটি crop নয়।</p>'),

      h(2, 'কী কাজ করে', 'what-works'),
      table(
        ['ধরন', 'কেন'],
        [
          ['একটি টিপ, দ্রুত দেওয়া', 'এক মিনিটের কমে সম্পূর্ণ মূল্য; উঁচু save rate'],
          ['একটি সাধারণ ভুল আর সমাধান', 'কৌতূহল সাথে উপযোগিতা'],
          ['আগে আর পরে', 'সাথে সাথে বোধগম্য, কোনো ব্যাখ্যার প্রয়োজন নেই'],
          ['একটি প্রক্রিয়া, দ্রুত করা', 'দেখতে তৃপ্তিদায়ক, দাবি না করে দক্ষতা দেখায়'],
          ['একটি বাস্তব প্রশ্নের উত্তর', 'এই কোর্সের অন্য সর্বত্রের একই নীতি'],
        ]
      ),

      h(2, 'শুরুর সেকেন্ডগুলো', 'the-opening-seconds'),
      p('<p>সবকিছু প্রথম মুহূর্তের উপর নির্ভর করে। ব্যবহারিক পদ্ধতি: নিজের পরিচয় দেওয়ার বদলে কাজের মাঝখান থেকে শুরু করুন; দর্শক যে নির্দিষ্ট জিনিসটি পাবে তা বলুন; আগে শেষ ফলাফল দেখান তারপর কীভাবে তা ব্যাখ্যা করুন; বা আপনি যে ভুলটি সংশোধন করতে যাচ্ছেন তা দিয়ে শুরু করুন।</p><p>যা কাজ করে না: "Hi everyone, in today\'s video…"। সেই বাক্যটি শেষ হতে হতে, বেশিরভাগ দর্শক স্ক্রল করে চলে গেছে।</p>'),

      h(2, 'একটি বাস্তবসম্মত দৃষ্টিভঙ্গি', 'a-realistic-view'),
      p('<p>ছোট-দৈর্ঘ্যের নাগাল এমনভাবে অস্থির যা অন্য চ্যানেল নয়। একটি ভিডিও খুব বড় সংখ্যক মানুষে পৌঁছে প্রায় কোনো মাপযোগ্য কিছু তৈরি না করতে পারে; আরেকটি অনেক কম মানুষে পৌঁছে বাস্তব জিজ্ঞাসা আনতে পারে। এখানে ভিউ উপলব্ধ সবচেয়ে কম অর্থপূর্ণ মেট্রিক।</p><p>এটি প্রতি ইউনিট কন্টেন্টে সবচেয়ে সময়সাপেক্ষ ফরম্যাটও। আপনি ধারাবাহিকভাবে এটি তৈরি করতে পারলে আর নাগালটি আপনার নিজের কিছুতে রূপান্তরিত হলে এটি করার যোগ্য — follower যারা সাবস্ক্রাইবার হয়, দর্শক যারা আপনার সাইটে যায়। যে নাগাল কোথাও যায় না তা একটি শখ, মার্কেটিং নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'social-content-strategy',
  sortOrder: 19,
  en: {
    title: 'Building a Social Content Strategy',
    metaTitle: 'Building a Social Content Strategy | Learn Computer Academy',
    metaDescription: 'How to plan social content so it is sustainable and purposeful, rather than posting whatever occurs to you on the day.',
    blocks: [
      p('<p>Most social media accounts are run reactively — someone remembers to post, thinks of something, posts it. That produces inconsistent output, a scramble every time, and no way to tell whether any of it is working. A strategy is mostly about removing those three problems.</p>'),

      h(2, 'Start From a Goal'),
      p('<p>"Grow our social media" is not a goal, because it does not tell you what to do or how to tell if it worked. Something narrower does:</p><ul><li>Get more people onto the email list.</li><li>Bring more visitors to a specific set of pages.</li><li>Generate enquiries for one particular service.</li><li>Become recognised for expertise in one specific subject.</li></ul><p>The goal determines the content. An account aiming at email signups posts differently from one building recognition, and neither looks like an account that has no stated aim at all.</p>'),

      h(2, 'Content Pillars'),
      p('<p>A <b>pillar</b> is a recurring theme you post about. Three or four is usually right — enough variety to avoid repetition, few enough to build a recognisable identity.</p><p>For a computer training institute, pillars might be: practical tips people can use immediately, student work and outcomes, explanations of industry concepts, and behind-the-scenes at the institute.</p><p>The benefit is entirely practical: sitting down to write "a post" is hard, while sitting down to write "a practical tip" is a much smaller problem. Pillars turn a blank page into a prompt.</p>'),

      callout('tip', '<p>Check that your pillars are not all bottom-of-funnel. If every theme is about your services, the account has nothing to offer someone who is not currently buying — which is almost everyone who sees it.</p>'),

      h(2, 'A Simple Working Rhythm'),
      p('<p>Batch the work rather than doing it daily. A common pattern: set aside time once a week or once a month, plan and produce several posts at once, schedule them, then spend a few minutes daily on replies and comments.</p><p>Batching removes the daily decision, which is the part that most often fails. It also produces more consistent quality, because you are not writing under time pressure between other tasks.</p>'),

      h(2, 'Engagement Is Part of the Work'),
      p('<p>Posting and then leaving is half a strategy. Replying to comments, answering questions, and commenting genuinely on other people\'s posts all contribute directly to reach — platforms measure conversation — and they are the part that actually builds relationships rather than impressions.</p><p>Budget time for it explicitly, or it will be the thing that gets skipped.</p>'),

      h(2, 'Review Honestly'),
      p('<p>Every month or so, look at what actually performed and what did not, and adjust the pillars accordingly. This sounds obvious and is skipped constantly — most accounts keep posting the same mix indefinitely regardless of results.</p><p>One caution when reviewing: judge against the goal, not against vanity numbers. A post with modest reach that produced five email signups did more than one with wide reach that produced nothing.</p>'),
    ],
  },
  bn: {
    title: 'একটি সোশ্যাল কন্টেন্ট কৌশল তৈরি',
    metaTitle: 'একটি সোশ্যাল কন্টেন্ট কৌশল তৈরি | Learn Computer Academy',
    metaDescription: 'সোশ্যাল কন্টেন্ট কীভাবে পরিকল্পনা করবেন যাতে এটি টেকসই আর উদ্দেশ্যপূর্ণ হয়, সেদিন যা মনে আসে তাই পোস্ট করার বদলে।',
    blocks: [
      p('<p>বেশিরভাগ সোশ্যাল মিডিয়া অ্যাকাউন্ট প্রতিক্রিয়াশীলভাবে চালানো হয় — কেউ পোস্ট করার কথা মনে করে, কিছু ভাবে, পোস্ট করে। এটি অসামঞ্জস্যপূর্ণ output, প্রতিবার একটি হুড়োহুড়ি, আর এর কিছু কাজ করছে কিনা বলার কোনো উপায় তৈরি করে। একটি কৌশল বেশিরভাগ এই তিনটি সমস্যা সরানো নিয়ে।</p>'),

      h(2, 'একটি লক্ষ্য থেকে শুরু করুন', 'start-from-a-goal'),
      p('<p>"আমাদের সোশ্যাল মিডিয়া বাড়ানো" একটি লক্ষ্য নয়, কারণ এটি আপনাকে বলে না কী করতে হবে বা এটি কাজ করেছে কিনা কীভাবে বলবেন। সংকীর্ণ কিছু বলে:</p><ul><li>ইমেইল তালিকায় আরও মানুষ আনুন।</li><li>একটি নির্দিষ্ট পাতার সেটে আরও ভিজিটর আনুন।</li><li>একটি নির্দিষ্ট সেবার জন্য জিজ্ঞাসা তৈরি করুন।</li><li>একটি নির্দিষ্ট বিষয়ে দক্ষতার জন্য স্বীকৃত হন।</li></ul><p>লক্ষ্যটি কন্টেন্ট নির্ধারণ করে। ইমেইল signup-এর দিকে লক্ষ্য করা একটি অ্যাকাউন্ট স্বীকৃতি গড়ে তোলা একটির চেয়ে ভিন্নভাবে পোস্ট করে, আর কোনোটিই এমন একটি অ্যাকাউন্টের মতো দেখায় না যার কোনো ঘোষিত উদ্দেশ্যই নেই।</p>'),

      h(2, 'কন্টেন্ট Pillar', 'content-pillars'),
      p('<p>একটি <b>pillar</b> হলো একটি পুনরাবৃত্ত থিম যা নিয়ে আপনি পোস্ট করেন। তিন বা চারটি সাধারণত সঠিক — পুনরাবৃত্তি এড়াতে যথেষ্ট বৈচিত্র্য, একটি চেনা পরিচয় গড়তে যথেষ্ট কম।</p><p>একটি কম্পিউটার প্রশিক্ষণ প্রতিষ্ঠানের জন্য, pillar হতে পারে: মানুষ সাথে সাথে ব্যবহার করতে পারে এমন ব্যবহারিক টিপ, শিক্ষার্থীর কাজ আর ফলাফল, শিল্পের ধারণার ব্যাখ্যা, আর প্রতিষ্ঠানের পর্দার পেছনে।</p><p>সুবিধাটি সম্পূর্ণ ব্যবহারিক: "একটি পোস্ট" লিখতে বসা কঠিন, যেখানে "একটি ব্যবহারিক টিপ" লিখতে বসা অনেক ছোট একটি সমস্যা। Pillar একটি খালি পাতাকে একটি প্রম্পটে পরিণত করে।</p>'),

      callout('tip', '<p>যাচাই করুন আপনার pillar-গুলো সবগুলো funnel-এর নিচের দিকে কিনা। প্রতিটি থিম যদি আপনার সেবা নিয়ে হয়, অ্যাকাউন্টটির এমন কারো জন্য কিছু নেই যে বর্তমানে কিনছে না — যা এটি দেখা প্রায় সবাই।</p>'),

      h(2, 'একটি সরল কাজের ছন্দ', 'a-simple-working-rhythm'),
      p('<p>দৈনিক করার বদলে কাজটি batch করুন। একটি সাধারণ প্যাটার্ন: সপ্তাহে বা মাসে একবার সময় আলাদা করুন, একসাথে কয়েকটি পোস্ট পরিকল্পনা আর তৈরি করুন, সেগুলো সূচিবদ্ধ করুন, তারপর জবাব আর মন্তব্যে দৈনিক কয়েক মিনিট দিন।</p><p>Batching দৈনিক সিদ্ধান্তটি সরায়, যা সবচেয়ে বেশি ব্যর্থ হওয়া অংশ। এটি আরও ধারাবাহিক গুণমানও তৈরি করে, কারণ আপনি অন্য কাজের মাঝে সময়ের চাপে লিখছেন না।</p>'),

      h(2, 'সম্পৃক্ততা কাজের অংশ', 'engagement-is-part-of-the-work'),
      p('<p>পোস্ট করে চলে যাওয়া অর্ধেক একটি কৌশল। মন্তব্যের জবাব দেওয়া, প্রশ্নের উত্তর দেওয়া, আর অন্যের পোস্টে সত্যিকারের মন্তব্য করা সবই সরাসরি নাগালে অবদান রাখে — প্ল্যাটফর্ম কথোপকথন মাপে — আর সেগুলোই সেই অংশ যা impression-এর বদলে আসলে সম্পর্ক গড়ে।</p><p>এর জন্য স্পষ্টভাবে সময় বরাদ্দ করুন, নয়তো এটিই সেই জিনিস হবে যা বাদ পড়ে।</p>'),

      h(2, 'সৎভাবে পর্যালোচনা করুন', 'review-honestly'),
      p('<p>প্রতি মাসে বা তার কাছাকাছি, আসলে কী পারফর্ম করেছে আর কী করেনি তা দেখুন, আর সেই অনুযায়ী pillar সমন্বয় করুন। এটি স্পষ্ট শোনায় আর ক্রমাগত বাদ পড়ে — বেশিরভাগ অ্যাকাউন্ট ফলাফল নির্বিশেষে অনির্দিষ্টকাল একই মিশ্রণ পোস্ট করতে থাকে।</p><p>পর্যালোচনার সময় একটি সতর্কতা: অহংকারের সংখ্যার বিপরীতে নয়, লক্ষ্যের বিপরীতে বিচার করুন। যে পোস্টের মাঝারি নাগাল ছিল কিন্তু পাঁচটি ইমেইল signup তৈরি করেছে তা বিস্তৃত নাগালের কিন্তু কিছুই তৈরি না করা একটির চেয়ে বেশি করেছে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'community-management',
  sortOrder: 20,
  en: {
    title: 'Community Management',
    metaTitle: 'Community Management | Learn Computer Academy',
    metaDescription: 'Replying, moderating, and handling criticism in public — the part of social media that actually builds relationships.',
    blocks: [
      p('<p><b>Community management</b> is everything that happens after you post: replies, questions, complaints, and conversation. It is less visible than content and often matters more, because it is where a following turns into a relationship.</p>'),

      h(2, 'Replying Is Not Optional'),
      p('<p>Someone taking the time to comment or ask a question has volunteered attention. Ignoring it wastes the most engaged person in your audience, and it is visible — a page full of unanswered questions tells every future visitor what to expect.</p><p>Replies also serve a mechanical purpose: platforms measure conversation, so a post with an active comment thread is distributed further than one without.</p>'),

      h(2, 'Answer the Question Properly'),
      p('<p>When someone asks something publicly, answer it in public and answer it fully. "DM us for details" is a common reply and a weak one — it moves a useful public answer into a private channel where nobody else benefits.</p><p>A complete public answer does three things at once: helps the person who asked, helps everyone else with the same question, and demonstrates that you know the subject. That is a considerable return for one reply.</p>'),

      h(2, 'Handling Criticism'),
      p('<p>Negative comments feel like a problem and are usually an opportunity, because the response is read by far more people than the complaint.</p><ol><li><b>Reply, do not delete.</b> Deleting legitimate criticism escalates it reliably.</li><li><b>Do not argue publicly.</b> Nobody reading it decides you were right; they decide you are difficult.</li><li><b>Acknowledge what is true.</b> If a mistake was made, saying so plainly is more persuasive than any defence.</li><li><b>Be specific about the fix</b>, not vaguely apologetic.</li><li><b>Move the detail private, resolve it, then close the loop publicly</b> if appropriate.</li></ol>'),

      callout('note', '<p>A calm, specific, non-defensive reply to a complaint is one of the most persuasive things a business can publish. It is evidence of how you behave when something goes wrong, which is exactly what a cautious potential customer is trying to work out.</p>'),

      h(2, 'What Genuinely Warrants Deletion'),
      p('<p>The presumption should be against deleting, with a short list of exceptions: abuse and harassment, spam, content that is illegal or discloses someone\'s private information, and off-topic promotion by others.</p><p>Criticism of your business is not on that list, however unwelcome. It is worth being clear with yourself about the difference, because the temptation to reclassify one as the other is strong in the moment.</p>'),

      h(2, 'Response Time'),
      p('<p>Speed matters more on social than in most channels — people expect it, and platforms sometimes display response times publicly. If you cannot monitor continuously, say so: a note about when you are available sets an expectation and is better than unexplained silence.</p>'),

      h(2, 'Groups and Communities'),
      p('<p>Participating in communities you did not create — industry groups, local forums, subject-specific communities — reaches people who have never heard of you. It only works one way: contribute genuinely and consistently, and mention your business only where it is directly relevant and permitted.</p><p>Joining a community to promote is transparent, usually against the rules, and reliably counterproductive.</p>'),
    ],
  },
  bn: {
    title: 'কমিউনিটি ব্যবস্থাপনা',
    metaTitle: 'কমিউনিটি ব্যবস্থাপনা | Learn Computer Academy',
    metaDescription: 'জবাব দেওয়া, মডারেশন, আর প্রকাশ্যে সমালোচনা সামলানো — সোশ্যাল মিডিয়ার যে অংশ আসলে সম্পর্ক গড়ে।',
    blocks: [
      p('<p><b>কমিউনিটি ব্যবস্থাপনা</b> হলো আপনি পোস্ট করার পরে যা কিছু ঘটে: জবাব, প্রশ্ন, অভিযোগ, আর কথোপকথন। এটি কন্টেন্টের চেয়ে কম দৃশ্যমান আর প্রায়ই বেশি গুরুত্বপূর্ণ, কারণ এখানেই একটি অনুসরণ একটি সম্পর্কে পরিণত হয়।</p>'),

      h(2, 'জবাব দেওয়া ঐচ্ছিক নয়', 'replying-is-not-optional'),
      p('<p>যে মন্তব্য করতে বা একটি প্রশ্ন করতে সময় নিয়েছে সে স্বেচ্ছায় মনোযোগ দিয়েছে। এটি উপেক্ষা করলে আপনার দর্শকের সবচেয়ে যুক্ত ব্যক্তিটি নষ্ট হয়, আর এটি দৃশ্যমান — উত্তরহীন প্রশ্নে ভরা একটি পাতা প্রতিটি ভবিষ্যৎ ভিজিটরকে বলে কী আশা করতে হবে।</p><p>জবাব একটি যান্ত্রিক উদ্দেশ্যও সাধন করে: প্ল্যাটফর্ম কথোপকথন মাপে, তাই একটি সক্রিয় মন্তব্যের thread যুক্ত পোস্ট তা ছাড়া একটির চেয়ে দূরে বিতরণ হয়।</p>'),

      h(2, 'প্রশ্নটির ঠিকভাবে উত্তর দিন', 'answer-the-question-properly'),
      p('<p>কেউ প্রকাশ্যে কিছু জিজ্ঞাসা করলে, প্রকাশ্যে উত্তর দিন আর সম্পূর্ণভাবে উত্তর দিন। "DM us for details" একটি সাধারণ জবাব আর একটি দুর্বল জবাব — এটি একটি কাজের প্রকাশ্য উত্তরকে একটি ব্যক্তিগত চ্যানেলে সরায় যেখানে আর কেউ উপকৃত হয় না।</p><p>একটি সম্পূর্ণ প্রকাশ্য উত্তর একসাথে তিনটি কাজ করে: যে জিজ্ঞাসা করেছে তাকে সাহায্য করে, একই প্রশ্নযুক্ত বাকি সবাইকে সাহায্য করে, আর দেখায় যে আপনি বিষয়টি জানেন। একটি জবাবের জন্য এটি যথেষ্ট বড় একটি প্রতিদান।</p>'),

      h(2, 'সমালোচনা সামলানো', 'handling-criticism'),
      p('<p>নেতিবাচক মন্তব্য একটি সমস্যা মনে হয় আর সাধারণত একটি সুযোগ, কারণ জবাবটি অভিযোগের চেয়ে অনেক বেশি মানুষ পড়ে।</p><ol><li><b>জবাব দিন, মুছবেন না।</b> বৈধ সমালোচনা মোছা নির্ভরযোগ্যভাবে এটি বাড়ায়।</li><li><b>প্রকাশ্যে তর্ক করবেন না।</b> এটি পড়া কেউ সিদ্ধান্ত নেয় না আপনি ঠিক ছিলেন; তারা সিদ্ধান্ত নেয় আপনি কঠিন।</li><li><b>যা সত্য তা স্বীকার করুন।</b> একটি ভুল হয়ে থাকলে, সরলভাবে সেটি বলা যেকোনো আত্মপক্ষ সমর্থনের চেয়ে বেশি প্ররোচক।</li><li><b>সমাধান সম্পর্কে নির্দিষ্ট হন</b>, অস্পষ্টভাবে ক্ষমাপ্রার্থী নয়।</li><li><b>বিবরণ ব্যক্তিগতে সরান, সমাধান করুন, তারপর উপযুক্ত হলে প্রকাশ্যে loop বন্ধ করুন।</b></li></ol>'),

      callout('note', '<p>একটি অভিযোগের একটি শান্ত, নির্দিষ্ট, আত্মপক্ষ-সমর্থনহীন জবাব একটি ব্যবসার প্রকাশ করতে পারা সবচেয়ে প্ররোচক জিনিসগুলোর একটি। এটি কিছু ভুল হলে আপনি কীভাবে আচরণ করেন তার প্রমাণ, যা ঠিক সেটিই একজন সতর্ক সম্ভাব্য গ্রাহক বের করার চেষ্টা করছে।</p>'),

      h(2, 'কী সত্যিই মোছার যোগ্য', 'what-genuinely-warrants-deletion'),
      p('<p>অনুমানটি মোছার বিরুদ্ধে হওয়া উচিত, ব্যতিক্রমের একটি ছোট তালিকাসহ: অপব্যবহার আর হয়রানি, spam, অবৈধ বা কারো ব্যক্তিগত তথ্য প্রকাশ করা কন্টেন্ট, আর অন্যদের প্রসঙ্গ-বহির্ভূত প্রচার।</p><p>আপনার ব্যবসার সমালোচনা সেই তালিকায় নেই, যতই অপ্রীতিকর হোক। পার্থক্যটি নিয়ে নিজের সাথে স্পষ্ট থাকা সার্থক, কারণ সেই মুহূর্তে একটিকে অন্যটি হিসেবে পুনর্শ্রেণীবদ্ধ করার প্রলোভন প্রবল।</p>'),

      h(2, 'সাড়া দেওয়ার সময়', 'response-time'),
      p('<p>বেশিরভাগ চ্যানেলের চেয়ে সোশ্যালে গতি বেশি গুরুত্বপূর্ণ — মানুষ এটি আশা করে, আর প্ল্যাটফর্ম কখনো কখনো প্রকাশ্যে সাড়ার সময় দেখায়। আপনি ক্রমাগত নজর রাখতে না পারলে, সেটি বলুন: আপনি কখন উপলব্ধ সে সম্পর্কে একটি নোট একটি প্রত্যাশা তৈরি করে আর অব্যাখ্যাত নীরবতার চেয়ে ভালো।</p>'),

      h(2, 'Group আর কমিউনিটি', 'groups-and-communities'),
      p('<p>আপনার তৈরি নয় এমন কমিউনিটিতে অংশগ্রহণ — শিল্পের group, স্থানীয় ফোরাম, বিষয়-নির্দিষ্ট কমিউনিটি — এমন মানুষে পৌঁছায় যারা কখনো আপনার কথা শোনেনি। এটি শুধু একভাবেই কাজ করে: সত্যিকারভাবে আর ধারাবাহিকভাবে অবদান রাখুন, আর শুধু যেখানে সরাসরি প্রাসঙ্গিক আর অনুমোদিত সেখানেই আপনার ব্যবসার উল্লেখ করুন।</p><p>প্রচারের জন্য একটি কমিউনিটিতে যোগ দেওয়া স্বচ্ছ, সাধারণত নিয়মের বিরুদ্ধে, আর নির্ভরযোগ্যভাবে বিপরীত ফলদায়ক।</p>'),
    ],
  },
})

lessons.push({
  slug: 'paid-advertising-intro',
  sortOrder: 21,
  en: {
    title: 'Introduction to Paid Advertising',
    metaTitle: 'Introduction to Paid Advertising | Learn Computer Academy',
    metaDescription: 'What paid advertising can and cannot do, when it makes sense to spend, and why it works best alongside organic channels rather than instead of them.',
    blocks: [
      p('<p><b>Paid advertising</b> means buying placement in front of an audience rather than earning it. It is the fastest channel available and the only one that stops the moment you stop paying — and both of those facts should shape how you use it.</p>'),

      callout('note', '<p><b>How these lessons are written.</b> Advertising platforms redesign their interfaces constantly, and any walkthrough of where to click goes out of date within months. So this section teaches the concepts underneath — how auctions work, what the pricing models mean, what the campaign types are for, how targeting works. Those are stable for years. Even the <i>names</i> drift: Google renamed Discovery campaigns to Demand Gen, and Meta has reshuffled its objective names more than once. Learn the category and its purpose, and a renamed button will not confuse you.</p>', 'Concepts, not click-paths'),

      h(2, 'What Paid Advertising Is Good At'),
      p('<ul><li><b>Speed.</b> Traffic today, not in six months.</li><li><b>Testing.</b> You can find out whether a message or an offer works in days rather than waiting for organic content to rank.</li><li><b>Precision.</b> You choose who sees it — by location, interests, behaviour, or by targeting people who already visited your site.</li><li><b>Scale on demand.</b> If something works, spending more generally produces more of it, within limits.</li><li><b>Reaching people who are not searching</b> — social advertising puts you in front of people who did not know they wanted what you offer.</li></ul>'),

      h(2, 'What It Cannot Do'),
      p('<ul><li><b>Accumulate.</b> Turn off the budget and the traffic stops the same day. Nothing carries forward.</li><li><b>Fix a bad offer.</b> Advertising a product nobody wants efficiently reaches more people who do not want it.</li><li><b>Rescue a bad landing page.</b> You pay for the click regardless of what happens next, which makes wasted clicks expensive rather than merely disappointing.</li><li><b>Build trust on its own.</b> An advertisement from a business with no other visible presence is a weaker signal than one from a business someone can look up.</li></ul>'),

      h(2, 'When It Makes Sense'),
      p('<p>Paid advertising is a reasonable choice when you need results sooner than organic can deliver, when you are testing an idea and want an answer quickly, when there is a time-limited event or offer, or when you want to reach people again who already showed interest.</p><p>It is a poor choice when the money would be better spent fixing the destination — a slow, unclear, or untrustworthy page converts paid traffic just as badly as organic traffic, but you paid for it.</p>'),

      h(2, 'Paid and Organic Together'),
      p('<p>The two are frequently framed as alternatives and work considerably better as a pair. Paid brings people in immediately while organic builds; organic content gives paid traffic something worth arriving at; a strong organic presence makes an advertisement more credible when someone checks you out; and paid campaigns generate data about which messages work, which is directly useful for organic content.</p>'),

      h(2, 'Start Small'),
      p('<p>The single most common mistake is spending a large budget before knowing what works. A small budget spent deliberately on one clear offer with one clear audience answers questions that a large budget spent broadly does not — because with broad spending you cannot tell which part worked.</p><p>Scale after something is proven, not before.</p>'),
    ],
  },
  bn: {
    title: 'পেইড বিজ্ঞাপন পরিচিতি',
    metaTitle: 'পেইড বিজ্ঞাপন পরিচিতি | Learn Computer Academy',
    metaDescription: 'পেইড বিজ্ঞাপন কী করতে পারে আর পারে না, কখন খরচ করা অর্থপূর্ণ, আর কেন এটি organic চ্যানেলের বদলে সেগুলোর পাশাপাশি সবচেয়ে ভালো কাজ করে।',
    blocks: [
      p('<p><b>পেইড বিজ্ঞাপন</b> মানে একটি দর্শকের সামনে জায়গা অর্জনের বদলে কেনা। এটি উপলব্ধ দ্রুততম চ্যানেল আর একমাত্র চ্যানেল যা আপনি টাকা দেওয়া থামানো মাত্র থেমে যায় — আর এই দুটি তথ্যই আপনি কীভাবে এটি ব্যবহার করবেন তা গঠন করা উচিত।</p>'),

      callout('note', '<p><b>এই পাঠগুলো কীভাবে লেখা।</b> বিজ্ঞাপনের প্ল্যাটফর্ম ক্রমাগত তাদের ইন্টারফেস নতুন করে ডিজাইন করে, আর কোথায় ক্লিক করতে হবে তার যেকোনো walkthrough মাসের মধ্যে সেকেলে হয়ে যায়। তাই এই অংশটি নিচের ধারণাগুলো শেখায় — auction কীভাবে কাজ করে, pricing মডেলগুলো কী বোঝায়, campaign-এর ধরন কীসের জন্য, targeting কীভাবে কাজ করে। সেগুলো বছরের পর বছর স্থিতিশীল। এমনকি <i>নামও</i> সরে: Google Discovery campaign-এর নাম বদলে Demand Gen করেছে, আর Meta একাধিকবার তার objective-এর নাম পাল্টেছে। শ্রেণী আর এর উদ্দেশ্য শিখুন, আর একটি নাম বদলানো বোতাম আপনাকে বিভ্রান্ত করবে না।</p>', 'ধারণা, click-path নয়'),

      h(2, 'পেইড বিজ্ঞাপন কীসে ভালো', 'what-paid-advertising-is-good-at'),
      p('<ul><li><b>গতি।</b> আজ ট্রাফিক, ছয় মাসে নয়।</li><li><b>পরীক্ষা।</b> Organic কন্টেন্ট র‍্যাংক করার অপেক্ষা না করে দিনের মধ্যে জানতে পারেন একটি বার্তা বা একটি অফার কাজ করে কিনা।</li><li><b>নির্ভুলতা।</b> আপনি বাছেন কে এটি দেখবে — অবস্থান, আগ্রহ, আচরণ দিয়ে, বা যারা ইতিমধ্যে আপনার সাইটে গেছে তাদের লক্ষ্য করে।</li><li><b>চাহিদামতো স্কেল।</b> কিছু কাজ করলে, বেশি খরচ করলে সাধারণত এর বেশি তৈরি হয়, সীমার মধ্যে।</li><li><b>যারা সার্চ করছে না তাদের কাছে পৌঁছানো</b> — সোশ্যাল বিজ্ঞাপন আপনাকে এমন মানুষের সামনে রাখে যারা জানত না তারা আপনি যা দেন তা চায়।</li></ul>'),

      h(2, 'এটি যা করতে পারে না', 'what-it-cannot-do'),
      p('<ul><li><b>জমা করা।</b> বাজেট বন্ধ করুন আর ট্রাফিক সেদিনই থেমে যায়। কিছুই সামনে বহন হয় না।</li><li><b>একটি খারাপ অফার ঠিক করা।</b> কেউ চায় না এমন একটি পণ্যের বিজ্ঞাপন দক্ষভাবে আরও বেশি মানুষে পৌঁছায় যারা এটি চায় না।</li><li><b>একটি খারাপ landing পাতা উদ্ধার করা।</b> এরপর যাই হোক আপনি ক্লিকের জন্য টাকা দেন, যা নষ্ট ক্লিককে কেবল হতাশাজনকের বদলে ব্যয়বহুল করে।</li><li><b>নিজে থেকে বিশ্বাস গড়া।</b> অন্য কোনো দৃশ্যমান উপস্থিতি নেই এমন একটি ব্যবসার বিজ্ঞাপন এমন একটি ব্যবসার চেয়ে দুর্বল সংকেত যাকে কেউ খুঁজে দেখতে পারে।</li></ul>'),

      h(2, 'কখন এটি অর্থপূর্ণ', 'when-it-makes-sense'),
      p('<p>Organic যত দ্রুত দিতে পারে তার চেয়ে দ্রুত ফল দরকার হলে, আপনি একটি ধারণা পরীক্ষা করছেন আর দ্রুত উত্তর চাইলে, একটি সময়-সীমিত ইভেন্ট বা অফার থাকলে, বা যারা ইতিমধ্যে আগ্রহ দেখিয়েছে তাদের কাছে আবার পৌঁছাতে চাইলে পেইড বিজ্ঞাপন একটি যুক্তিসঙ্গত পছন্দ।</p><p>এটি একটি দুর্বল পছন্দ যখন টাকাটি গন্তব্য ঠিক করতে ভালোভাবে ব্যয় হতো — একটি ধীর, অস্পষ্ট, বা অবিশ্বস্ত পাতা পেইড ট্রাফিককে organic ট্রাফিকের মতোই খারাপভাবে রূপান্তর করে, কিন্তু আপনি এর জন্য টাকা দিয়েছেন।</p>'),

      h(2, 'পেইড আর Organic একসাথে', 'paid-and-organic-together'),
      p('<p>দুটোকে প্রায়ই বিকল্প হিসেবে দেখানো হয় আর সেগুলো জোড়া হিসেবে যথেষ্ট ভালো কাজ করে। Organic গড়ে ওঠার সময় পেইড সাথে সাথে মানুষ আনে; organic কন্টেন্ট পেইড ট্রাফিককে পৌঁছানোর যোগ্য কিছু দেয়; কেউ যাচাই করলে একটি শক্তিশালী organic উপস্থিতি একটি বিজ্ঞাপনকে বেশি বিশ্বাসযোগ্য করে; আর পেইড campaign কোন বার্তা কাজ করে সে সম্পর্কে ডেটা তৈরি করে, যা organic কন্টেন্টের জন্য সরাসরি কাজের।</p>'),

      h(2, 'ছোট করে শুরু করুন', 'start-small'),
      p('<p>সবচেয়ে সাধারণ একক ভুল হলো কী কাজ করে তা জানার আগে একটি বড় বাজেট খরচ করা। এক স্পষ্ট দর্শকসহ এক স্পষ্ট অফারে ইচ্ছাকৃতভাবে খরচ করা একটি ছোট বাজেট এমন প্রশ্নের উত্তর দেয় যা বিস্তৃতভাবে খরচ করা একটি বড় বাজেট দেয় না — কারণ বিস্তৃত খরচে আপনি বলতে পারবেন না কোন অংশটি কাজ করেছে।</p><p>কিছু প্রমাণিত হওয়ার পরে স্কেল করুন, আগে নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'how-ad-auctions-work',
  sortOrder: 22,
  en: {
    title: 'How Ad Auctions Work',
    metaTitle: 'How Ad Auctions Work | Learn Computer Academy',
    metaDescription: 'Why the highest bid does not automatically win, how relevance affects what you pay, and what CPC, CPM, CPA, and CPV actually mean.',
    blocks: [
      p('<p>Almost all digital advertising is sold by auction, and almost everyone assumes those auctions work by highest bid wins. They do not — and understanding why is the single most useful piece of knowledge in paid advertising.</p>'),

      h(2, 'The Auction Runs Every Time'),
      p('<p>When someone performs a search, or a slot opens in a feed, an auction happens in the moment. Every advertiser eligible for that person and that placement is entered, the platform ranks them, and one is shown. This happens billions of times a day, entirely automatically.</p>'),

      img(
        'docs/img/marketing/ad-auction-1',
        'Diagram showing three advertisers with different bid amounts and different relevance scores, with the winner being the one whose combination ranks highest rather than the highest bidder',
        1024, 768,
        'Bid times relevance decides the winner — which is why a lower bid can beat a higher one.'
      ),

      h(2, 'Why the Highest Bid Does Not Simply Win'),
      p('<p>Platforms combine your bid with an assessment of <b>quality and relevance</b> — how likely the ad is to be useful to this specific person. The exact formulas differ by platform and are not published, but the principle is consistent across all of them.</p><p>The reason is straightforward commercial self-interest. A platform showing irrelevant ads earns money once and loses users. A platform showing ads people find useful can keep doing it. So relevance is rewarded, and it is rewarded in two ways: relevant ads win auctions they would lose on bid alone, and they typically cost less per click.</p>'),

      callout('note', '<p>This is why "just outbid them" is not a strategy. An advertiser with a well-matched ad, a relevant landing page, and a clear audience can pay less per click than a competitor bidding more with a generic ad. Improving relevance is usually cheaper than raising bids, and it is the lever most people ignore.</p>', 'The practical implication'),

      h(2, 'What You Actually Pay'),
      p('<p>In most auction systems you do not pay your full bid — you pay the minimum needed to hold your position against the next advertiser. Your bid sets a ceiling, not a price.</p>'),

      h(2, 'The Pricing Models'),
      table(
        ['Model', 'You pay when', 'Suits'],
        [
          ['<b>CPC</b> — cost per click', 'Someone clicks the ad', 'Driving traffic; you pay only for interest'],
          ['<b>CPM</b> — cost per thousand impressions', 'The ad is shown, clicked or not', 'Awareness, where being seen is the point'],
          ['<b>CPA</b> — cost per acquisition', 'A defined action completes', 'Conversions; requires tracking to be set up correctly'],
          ['<b>CPV</b> — cost per view', 'Someone watches a defined portion of a video', 'Video campaigns'],
        ]
      ),
      p('<p>The right model follows from the goal. Paying per impression for a campaign meant to generate enquiries means paying for people who never engaged; paying per click for a pure awareness campaign undercounts the value of being seen.</p>'),

      h(2, 'Why Costs Vary So Much'),
      p('<p>There is no standard price for a click. What you pay depends on how many advertisers want the same audience, how valuable that audience is commercially, the season, the location, and your own relevance.</p><p>This is why quoted average costs are close to meaningless — a click in a competitive commercial field and a click in a niche one can differ by an order of magnitude. Your own data, after a small test, is the only figure that describes your situation.</p>'),
    ],
  },
  bn: {
    title: 'বিজ্ঞাপনের Auction কীভাবে কাজ করে',
    metaTitle: 'বিজ্ঞাপনের Auction কীভাবে কাজ করে | Learn Computer Academy',
    metaDescription: 'সর্বোচ্চ দর কেন স্বয়ংক্রিয়ভাবে জেতে না, প্রাসঙ্গিকতা কীভাবে আপনার খরচ প্রভাবিত করে, আর CPC, CPM, CPA, আর CPV আসলে কী বোঝায়।',
    blocks: [
      p('<p>প্রায় সব ডিজিটাল বিজ্ঞাপন auction-এ বিক্রি হয়, আর প্রায় সবাই ধরে নেয় সেই auction সর্বোচ্চ দর জেতে নিয়মে কাজ করে। সেগুলো করে না — আর কেন করে না তা বোঝা পেইড বিজ্ঞাপনের সবচেয়ে কাজের একক জ্ঞান।</p>'),

      h(2, 'Auction প্রতিবার চলে', 'the-auction-runs-every-time'),
      p('<p>কেউ একটি সার্চ করলে, বা একটি ফিডে একটি স্লট খুললে, সেই মুহূর্তে একটি auction হয়। সেই ব্যক্তি আর সেই placement-এর জন্য যোগ্য প্রতিটি বিজ্ঞাপনদাতা এতে ঢোকে, প্ল্যাটফর্ম তাদের ক্রমে সাজায়, আর একটি দেখানো হয়। এটি দিনে কোটি কোটি বার ঘটে, সম্পূর্ণ স্বয়ংক্রিয়ভাবে।</p>'),

      img(
        'docs/img/marketing/ad-auction-1',
        'ডায়াগ্রাম যেখানে ভিন্ন দরের পরিমাণ আর ভিন্ন প্রাসঙ্গিকতার স্কোরসহ তিনজন বিজ্ঞাপনদাতা দেখানো হয়েছে, বিজয়ী সেই যার সমন্বয় সর্বোচ্চ, সর্বোচ্চ দরদাতা নয়',
        1024, 768,
        'দর গুণ প্রাসঙ্গিকতা বিজয়ী ঠিক করে — যে কারণে একটি কম দর একটি বেশি দরকে হারাতে পারে।'
      ),

      h(2, 'সর্বোচ্চ দর কেন সহজভাবে জেতে না', 'why-the-highest-bid-does-not-simply-win'),
      p('<p>প্ল্যাটফর্ম আপনার দরের সাথে <b>গুণমান আর প্রাসঙ্গিকতার</b> একটি মূল্যায়ন মেলায় — বিজ্ঞাপনটি এই নির্দিষ্ট ব্যক্তির কাজে আসার সম্ভাবনা কতটা। সঠিক সূত্র প্ল্যাটফর্ম ভেদে ভিন্ন আর প্রকাশিত নয়, কিন্তু নীতিটি সেগুলোর সবগুলোতে ধারাবাহিক।</p><p>কারণটি সোজাসাপ্টা বাণিজ্যিক স্বার্থ। যে প্ল্যাটফর্ম অপ্রাসঙ্গিক বিজ্ঞাপন দেখায় তা একবার টাকা আয় করে আর ব্যবহারকারী হারায়। যে প্ল্যাটফর্ম মানুষ কাজের মনে করে এমন বিজ্ঞাপন দেখায় তা এটি করতে থাকতে পারে। তাই প্রাসঙ্গিকতা পুরস্কৃত হয়, আর দুইভাবে পুরস্কৃত হয়: প্রাসঙ্গিক বিজ্ঞাপন এমন auction জেতে যা শুধু দরে হারত, আর সেগুলোর সাধারণত প্রতি ক্লিকে খরচ কম।</p>'),

      callout('note', '<p>এই কারণেই "শুধু তাদের চেয়ে বেশি দর দিন" একটি কৌশল নয়। একটি ভালোভাবে মেলানো বিজ্ঞাপন, একটি প্রাসঙ্গিক landing পাতা, আর একটি স্পষ্ট দর্শকযুক্ত একজন বিজ্ঞাপনদাতা একটি সাধারণ বিজ্ঞাপনে বেশি দর দেওয়া প্রতিযোগীর চেয়ে প্রতি ক্লিকে কম দিতে পারে। প্রাসঙ্গিকতা উন্নত করা সাধারণত দর বাড়ানোর চেয়ে সস্তা, আর এটিই সেই লিভার যা বেশিরভাগ মানুষ উপেক্ষা করে।</p>', 'ব্যবহারিক তাৎপর্য'),

      h(2, 'আপনি আসলে কী দেন', 'what-you-actually-pay'),
      p('<p>বেশিরভাগ auction সিস্টেমে আপনি আপনার পূর্ণ দর দেন না — আপনি পরের বিজ্ঞাপনদাতার বিরুদ্ধে আপনার অবস্থান ধরে রাখতে প্রয়োজনীয় ন্যূনতম দেন। আপনার দর একটি সিলিং ঠিক করে, একটি দাম নয়।</p>'),

      h(2, 'Pricing মডেলগুলো', 'the-pricing-models'),
      table(
        ['মডেল', 'আপনি কখন দেন', 'যার উপযোগী'],
        [
          ['<b>CPC</b> — প্রতি ক্লিকে খরচ', 'কেউ বিজ্ঞাপনে ক্লিক করে', 'ট্রাফিক আনা; আপনি শুধু আগ্রহের জন্য দেন'],
          ['<b>CPM</b> — প্রতি হাজার impression-এ খরচ', 'বিজ্ঞাপনটি দেখানো হয়, ক্লিক হোক বা না হোক', 'Awareness, যেখানে দেখা যাওয়াই মূল কথা'],
          ['<b>CPA</b> — প্রতি acquisition-এ খরচ', 'একটি নির্ধারিত কাজ সম্পূর্ণ হয়', 'Conversion; ট্র্যাকিং সঠিকভাবে সেট আপ করা প্রয়োজন'],
          ['<b>CPV</b> — প্রতি ভিউতে খরচ', 'কেউ একটি ভিডিওর একটি নির্ধারিত অংশ দেখে', 'ভিডিও campaign'],
        ]
      ),
      p('<p>সঠিক মডেল লক্ষ্য থেকে আসে। জিজ্ঞাসা তৈরির উদ্দেশ্যে একটি campaign-এ প্রতি impression-এ টাকা দেওয়ার অর্থ এমন মানুষের জন্য টাকা দেওয়া যারা কখনো যুক্ত হয়নি; একটি বিশুদ্ধ awareness campaign-এ প্রতি ক্লিকে টাকা দিলে দেখা যাওয়ার মূল্য কম গণনা হয়।</p>'),

      h(2, 'খরচ এত বদলায় কেন', 'why-costs-vary-so-much'),
      p('<p>একটি ক্লিকের কোনো আদর্শ দাম নেই। আপনি কী দেন তা নির্ভর করে কতজন বিজ্ঞাপনদাতা একই দর্শক চায়, সেই দর্শক বাণিজ্যিকভাবে কতটা মূল্যবান, ঋতু, অবস্থান, আর আপনার নিজের প্রাসঙ্গিকতার উপর।</p><p>এই কারণেই উদ্ধৃত গড় খরচ প্রায় অর্থহীন — একটি প্রতিযোগিতামূলক বাণিজ্যিক ক্ষেত্রে একটি ক্লিক আর একটি সংকীর্ণ ক্ষেত্রে একটি ক্লিক দশগুণ ভিন্ন হতে পারে। একটি ছোট পরীক্ষার পর আপনার নিজের ডেটাই একমাত্র সংখ্যা যা আপনার পরিস্থিতি বর্ণনা করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'google-ads-campaign-types',
  sortOrder: 23,
  en: {
    title: 'Google Ads — Campaign Types',
    metaTitle: 'Google Ads Campaign Types | Learn Computer Academy',
    metaDescription: 'What each Google Ads campaign type is for — Search, Display, Video, Shopping, and the automated ones — and how to pick between them.',
    blocks: [
      p('<p>Google Ads is not one advertising product. It is several, each reaching people in a different context, and choosing the wrong one is a common and expensive mistake. This lesson covers what each type is <i>for</i>.</p>'),

      callout('warning', '<p>Campaign type names change. Google has renamed and merged types more than once — Discovery became Demand Gen, and other consolidations have happened over the years. What each category <i>does</i> has been far more stable than what it is called. If a name here does not match what you see, look for the type serving the same purpose.</p>', 'Names drift, purposes do not'),

      h(2, 'The Main Types'),
      table(
        ['Type', 'Where the ad appears', 'The person is…'],
        [
          ['<b>Search</b>', 'Search results, as text ads', 'Actively looking for something now'],
          ['<b>Display</b>', 'Banner ads across millions of websites', 'Reading something else entirely'],
          ['<b>Video</b>', 'YouTube and video partners', 'Watching something'],
          ['<b>Shopping</b>', 'Product listings with image and price in results', 'Looking to buy a specific product'],
          ['<b>Performance Max</b>', 'Automated across all of the above', 'Anywhere Google decides'],
          ['<b>Demand Gen</b>', 'Feeds — YouTube, Discover, Gmail', 'Browsing, not searching'],
        ]
      ),

      h(2, 'Search — The Highest-Intent Option'),
      p('<p>Search ads appear when someone types a query. This is the fundamental difference from every other type: <b>the person is already looking for what you sell.</b> That makes it the most direct and usually the most expensive per click, because that intent is what everyone is bidding for.</p><p>For most businesses starting with Google Ads, Search is the sensible first campaign — the intent is clear, the results are easy to interpret, and it does not require creative production.</p>'),

      h(2, 'Display — Reach Without Intent'),
      p('<p>Display ads appear on websites across a very large network. The audience is enormous and cheap to reach; the catch is that nobody was looking for you. Click rates are far lower than Search and the traffic is generally less ready to act.</p><p>Display works best for two specific jobs: broad awareness where being seen is the point, and <b>retargeting</b> — showing ads to people who already visited your site. The second is by far the more reliable use, covered in its own lesson shortly.</p>'),

      h(2, 'Video and Shopping'),
      p('<p><b>Video</b> ads run on YouTube. They suit demonstration, storytelling, and awareness rather than immediate action, and they need actual video production, which is a real cost to plan for.</p><p><b>Shopping</b> ads show a product image, price, and merchant directly in search results. They apply to online retail specifically and require a product data feed to be set up. Where they apply, they tend to work well, because the person sees the product and the price before clicking.</p>'),

      h(2, 'The Automated Types'),
      p('<p><b>Performance Max</b> hands most decisions to Google\'s automation — you supply assets, a budget, and a conversion goal, and the system decides placement, audience, and format across every channel.</p><p>The trade is real. It can perform well and it reduces the work substantially. It also gives you much less visibility into what is happening and much less control when something is not working. For a small budget or a first campaign, the reduced control makes it harder to learn anything — which is why starting with Search is generally the better teacher.</p>'),

      callout('note', '<p>Automation across these platforms improves steadily and is genuinely capable. But it optimises toward the goal you set, using the data you give it. If conversion tracking is wrong, or the goal is defined loosely, automation will efficiently pursue the wrong thing — and it will do so faster than manual campaigns would.</p>'),

      h(2, 'Choosing'),
      p('<p>Work from the intent you want to reach. Someone actively searching for your service is a Search campaign. Someone who visited and left is retargeting through Display. Something that needs showing rather than describing is Video. Products with prices are Shopping. Broad discovery among people not yet looking is Demand Gen.</p>'),
    ],
  },
  bn: {
    title: 'Google Ads — Campaign-এর ধরন',
    metaTitle: 'Google Ads Campaign-এর ধরন | Learn Computer Academy',
    metaDescription: 'প্রতিটি Google Ads campaign-এর ধরন কীসের জন্য — Search, Display, Video, Shopping, আর স্বয়ংক্রিয়গুলো — আর সেগুলোর মধ্যে কীভাবে বাছবেন।',
    blocks: [
      p('<p>Google Ads একটি বিজ্ঞাপনের পণ্য নয়। এটি কয়েকটি, প্রতিটি একটি ভিন্ন প্রেক্ষাপটে মানুষে পৌঁছায়, আর ভুলটি বাছা একটি সাধারণ আর ব্যয়বহুল ভুল। এই পাঠ কভার করে প্রতিটি ধরন <i>কীসের জন্য</i>।</p>'),

      callout('warning', '<p>Campaign-এর ধরনের নাম বদলায়। Google একাধিকবার ধরন নতুন নাম দিয়েছে আর একত্র করেছে — Discovery হয়েছে Demand Gen, আর বছরের পর বছর অন্য একত্রীকরণ ঘটেছে। প্রতিটি শ্রেণী <i>কী করে</i> তা এটিকে কী বলা হয় তার চেয়ে অনেক বেশি স্থিতিশীল থেকেছে। এখানে একটি নাম আপনি যা দেখেন তার সাথে না মিললে, একই উদ্দেশ্য সাধন করা ধরনটি খুঁজুন।</p>', 'নাম সরে, উদ্দেশ্য নয়'),

      h(2, 'প্রধান ধরনগুলো', 'the-main-types'),
      table(
        ['ধরন', 'বিজ্ঞাপন কোথায় দেখা যায়', 'ব্যক্তিটি…'],
        [
          ['<b>Search</b>', 'সার্চ ফলাফলে, টেক্সট বিজ্ঞাপন হিসেবে', 'এখনই সক্রিয়ভাবে কিছু খুঁজছে'],
          ['<b>Display</b>', 'কোটি কোটি ওয়েবসাইট জুড়ে ব্যানার বিজ্ঞাপন', 'সম্পূর্ণ অন্য কিছু পড়ছে'],
          ['<b>Video</b>', 'YouTube আর ভিডিও অংশীদার', 'কিছু দেখছে'],
          ['<b>Shopping</b>', 'ফলাফলে ছবি আর দামসহ পণ্যের তালিকা', 'একটি নির্দিষ্ট পণ্য কিনতে খুঁজছে'],
          ['<b>Performance Max</b>', 'উপরের সবগুলো জুড়ে স্বয়ংক্রিয়', 'Google যেখানে ঠিক করে'],
          ['<b>Demand Gen</b>', 'ফিড — YouTube, Discover, Gmail', 'ব্রাউজ করছে, সার্চ করছে না'],
        ]
      ),

      h(2, 'Search — সর্বোচ্চ-উদ্দেশ্যের বিকল্প', 'search-the-highest-intent-option'),
      p('<p>Search বিজ্ঞাপন দেখা যায় যখন কেউ একটি query টাইপ করে। এটিই অন্য প্রতিটি ধরন থেকে মৌলিক পার্থক্য: <b>ব্যক্তিটি ইতিমধ্যে আপনি যা বিক্রি করেন তা খুঁজছে।</b> এটি এটিকে সবচেয়ে সরাসরি আর সাধারণত প্রতি ক্লিকে সবচেয়ে ব্যয়বহুল করে, কারণ সেই উদ্দেশ্যের জন্যই সবাই দর দিচ্ছে।</p><p>Google Ads দিয়ে শুরু করা বেশিরভাগ ব্যবসার জন্য, Search যুক্তিসঙ্গত প্রথম campaign — উদ্দেশ্য স্পষ্ট, ফলাফল ব্যাখ্যা করা সহজ, আর এতে creative প্রোডাকশন লাগে না।</p>'),

      h(2, 'Display — উদ্দেশ্য ছাড়া নাগাল', 'display-reach-without-intent'),
      p('<p>Display বিজ্ঞাপন একটি খুব বড় নেটওয়ার্ক জুড়ে ওয়েবসাইটে দেখা যায়। দর্শক বিশাল আর পৌঁছাতে সস্তা; শর্তটি হলো কেউ আপনাকে খুঁজছিল না। ক্লিকের হার Search-এর চেয়ে অনেক কম আর ট্রাফিক সাধারণত কাজ করতে কম প্রস্তুত।</p><p>Display দুটি নির্দিষ্ট কাজে সবচেয়ে ভালো কাজ করে: বিস্তৃত awareness যেখানে দেখা যাওয়াই মূল কথা, আর <b>retargeting</b> — যারা ইতিমধ্যে আপনার সাইটে গেছে তাদের বিজ্ঞাপন দেখানো। দ্বিতীয়টি অনেক বেশি নির্ভরযোগ্য ব্যবহার, শীঘ্রই নিজস্ব একটি পাঠে কভার করা।</p>'),

      h(2, 'Video আর Shopping', 'video-and-shopping'),
      p('<p><b>Video</b> বিজ্ঞাপন YouTube-এ চলে। সেগুলো তাৎক্ষণিক কাজের বদলে প্রদর্শনী, গল্প বলা, আর awareness-এর উপযোগী, আর সেগুলোর আসল ভিডিও প্রোডাকশন লাগে, যা পরিকল্পনার জন্য একটি বাস্তব খরচ।</p><p><b>Shopping</b> বিজ্ঞাপন সার্চ ফলাফলে সরাসরি একটি পণ্যের ছবি, দাম, আর বিক্রেতা দেখায়। সেগুলো বিশেষভাবে অনলাইন খুচরা বিক্রিতে প্রযোজ্য আর একটি পণ্যের ডেটা feed সেট আপ করা প্রয়োজন। যেখানে প্রযোজ্য, সেগুলো ভালো কাজ করে, কারণ ব্যক্তিটি ক্লিক করার আগে পণ্য আর দাম দেখে।</p>'),

      h(2, 'স্বয়ংক্রিয় ধরনগুলো', 'the-automated-types'),
      p('<p><b>Performance Max</b> বেশিরভাগ সিদ্ধান্ত Google-এর অটোমেশনকে দেয় — আপনি asset, একটি বাজেট, আর একটি conversion লক্ষ্য দেন, আর সিস্টেম প্রতিটি চ্যানেল জুড়ে placement, দর্শক, আর ফরম্যাট ঠিক করে।</p><p>বিনিময়টি বাস্তব। এটি ভালো পারফর্ম করতে পারে আর এটি কাজ যথেষ্ট কমায়। এটি আপনাকে কী ঘটছে তাতে অনেক কম দৃশ্যমানতাও দেয় আর কিছু কাজ না করলে অনেক কম নিয়ন্ত্রণ দেয়। একটি ছোট বাজেট বা একটি প্রথম campaign-এর জন্য, কম নিয়ন্ত্রণ কিছু শেখা কঠিন করে — যে কারণে Search দিয়ে শুরু করা সাধারণত ভালো শিক্ষক।</p>'),

      callout('note', '<p>এই প্ল্যাটফর্মগুলো জুড়ে অটোমেশন ক্রমাগত উন্নত হয় আর সত্যিই সক্ষম। কিন্তু এটি আপনার সেট করা লক্ষ্যের দিকে অপ্টিমাইজ করে, আপনার দেওয়া ডেটা ব্যবহার করে। Conversion ট্র্যাকিং ভুল হলে, বা লক্ষ্যটি ঢিলেভাবে সংজ্ঞায়িত হলে, অটোমেশন দক্ষভাবে ভুল জিনিসের পেছনে ছুটবে — আর ম্যানুয়াল campaign যত দ্রুত করত তার চেয়ে দ্রুত করবে।</p>'),

      h(2, 'বাছাই', 'choosing'),
      p('<p>আপনি যে উদ্দেশ্যে পৌঁছাতে চান তা থেকে কাজ করুন। যে সক্রিয়ভাবে আপনার সেবা সার্চ করছে সে একটি Search campaign। যে গিয়েছিল আর চলে গেছে সে Display-এর মাধ্যমে retargeting। যা বর্ণনার বদলে দেখানো দরকার তা Video। দামসহ পণ্য Shopping। এখনো খুঁজছে না এমন মানুষের মধ্যে বিস্তৃত আবিষ্কার Demand Gen।</p>'),
    ],
  },
})

lessons.push({
  slug: 'search-ads-match-types',
  sortOrder: 24,
  en: {
    title: 'Search Ads & Keyword Match Types',
    metaTitle: 'Search Ads and Keyword Match Types | Learn Computer Academy',
    metaDescription: 'How keywords map to real searches through match types, why negative keywords matter, and what a search terms report tells you.',
    blocks: [
      p('<p>A search campaign runs on keywords, but a keyword is not a search — it is an instruction about which searches your ad should enter the auction for. <b>Match types</b> control how loose or tight that instruction is, and getting them wrong is the fastest way to waste a budget.</p>'),

      h(2, 'The Match Types'),
      table(
        ['Type', 'Written as', 'Matches'],
        [
          ['<b>Broad</b>', '<code>laptop repair</code>', 'Anything the platform judges related — including terms with no shared words'],
          ['<b>Phrase</b>', '<code>"laptop repair"</code>', 'Searches containing that meaning, with words before or after'],
          ['<b>Exact</b>', '<code>[laptop repair]</code>', 'That search and close variants — misspellings, plurals, reorderings'],
        ]
      ),
      p('<p>The trade is straightforward. Broad reaches the most people and wastes the most money. Exact wastes the least and reaches the fewest. Neither extreme is right on its own.</p>'),

      callout('warning', '<p>All three match types have loosened over the years — even exact match now includes what platforms call "close variants", which is a wider net than the name suggests. The practical implication is that you cannot assume your ads only show for what you typed. Checking what they <i>actually</i> matched is not optional.</p>'),

      h(2, 'The Search Terms Report'),
      p('<p>This is the most important report in a search campaign, and the most commonly ignored. It shows the <b>actual queries people typed</b> that triggered your ads — as distinct from the keywords you entered.</p><p>The gap between the two is regularly startling. An advertiser bidding on "laptop repair" on broad match may find they paid for "laptop repair jobs", "free laptop repair tutorial", "how to repair a laptop yourself", and "laptop repair course" — none of which are customers.</p><p>Reading this report and acting on it is the single highest-value routine task in paid search.</p>'),

      h(2, 'Negative Keywords'),
      p('<p>A <b>negative keyword</b> prevents your ad from showing for searches containing that word. It is how you close the gaps the search terms report reveals.</p><p>Common negatives for most businesses: <code>free</code>, <code>jobs</code>, <code>salary</code>, <code>course</code>, <code>tutorial</code>, <code>diy</code>, <code>how to</code>, and the names of competitors you do not want to bid against. Each one prevents an entire category of irrelevant clicks.</p>'),

      callout('tip', '<p>Negative keywords are the closest thing to free money in paid search. Every one you add stops paying for clicks that were never going to convert, and the effect is permanent rather than requiring ongoing management.</p>'),

      h(2, 'Ad Relevance'),
      p('<p>From the auction lesson: relevance affects both whether you win and what you pay. In search specifically, that means the chain from keyword to ad to landing page should be consistent. Someone searching for laptop repair should see an ad about laptop repair, and land on a page about laptop repair — not a homepage.</p><p>Breaking that chain is the most common cause of expensive clicks that go nowhere, and it is entirely within your control to fix.</p>'),

      h(2, 'A Sensible Structure'),
      p('<p>Group closely-related keywords together, and give each group its own ads and its own landing page. Twenty loosely-related keywords in one group means the ads cannot be specific to any of them — which lowers relevance, raises cost, and reduces results simultaneously.</p>'),
    ],
  },
  bn: {
    title: 'Search বিজ্ঞাপন আর Keyword Match Type',
    metaTitle: 'Search বিজ্ঞাপন আর Keyword Match Type | Learn Computer Academy',
    metaDescription: 'Match type-এর মাধ্যমে keyword কীভাবে বাস্তব সার্চের সাথে মেলে, negative keyword কেন গুরুত্বপূর্ণ, আর একটি search terms রিপোর্ট আপনাকে কী বলে।',
    blocks: [
      p('<p>একটি search campaign keyword-এ চলে, কিন্তু একটি keyword একটি সার্চ নয় — এটি আপনার বিজ্ঞাপন কোন সার্চের জন্য auction-এ ঢুকবে সে বিষয়ে একটি নির্দেশ। <b>Match type</b> নিয়ন্ত্রণ করে সেই নির্দেশ কতটা ঢিলে বা আঁটসাঁট, আর সেগুলো ভুল করা একটি বাজেট নষ্ট করার দ্রুততম উপায়।</p>'),

      h(2, 'Match Type-গুলো', 'the-match-types'),
      table(
        ['ধরন', 'যেভাবে লেখা', 'যার সাথে মেলে'],
        [
          ['<b>Broad</b>', '<code>laptop repair</code>', 'প্ল্যাটফর্ম যা সম্পর্কিত বিচার করে — কোনো শেয়ার করা শব্দ নেই এমন term সহ'],
          ['<b>Phrase</b>', '<code>"laptop repair"</code>', 'সেই অর্থযুক্ত সার্চ, আগে বা পরে শব্দসহ'],
          ['<b>Exact</b>', '<code>[laptop repair]</code>', 'সেই সার্চ আর কাছাকাছি রূপভেদ — বানান ভুল, বহুবচন, ক্রম পরিবর্তন'],
        ]
      ),
      p('<p>বিনিময়টি সোজাসাপ্টা। Broad সবচেয়ে বেশি মানুষে পৌঁছায় আর সবচেয়ে বেশি টাকা নষ্ট করে। Exact সবচেয়ে কম নষ্ট করে আর সবচেয়ে কম মানুষে পৌঁছায়। কোনো চরমই একা সঠিক নয়।</p>'),

      callout('warning', '<p>তিনটি match type-ই বছরের পর বছর ঢিলে হয়েছে — এমনকি exact match এখন প্ল্যাটফর্ম যাকে "close variants" বলে তা অন্তর্ভুক্ত করে, যা নামটি যা বোঝায় তার চেয়ে বিস্তৃত একটি জাল। ব্যবহারিক তাৎপর্য হলো আপনি ধরে নিতে পারেন না আপনার বিজ্ঞাপন শুধু আপনার টাইপ করা জিনিসের জন্য দেখানো হয়। সেগুলো <i>আসলে</i> কীসের সাথে মিলেছে তা যাচাই করা ঐচ্ছিক নয়।</p>'),

      h(2, 'Search Terms রিপোর্ট', 'the-search-terms-report'),
      p('<p>এটি একটি search campaign-এর সবচেয়ে গুরুত্বপূর্ণ রিপোর্ট, আর সবচেয়ে বেশি উপেক্ষিত। এটি দেখায় <b>মানুষ আসলে যে query টাইপ করেছে</b> যা আপনার বিজ্ঞাপন চালু করেছে — আপনার ঢোকানো keyword থেকে আলাদা।</p><p>দুটির মধ্যে ফাঁকটি নিয়মিত চমকপ্রদ। Broad match-এ "laptop repair"-এ দর দেওয়া একজন বিজ্ঞাপনদাতা দেখতে পারে তারা "laptop repair jobs", "free laptop repair tutorial", "how to repair a laptop yourself", আর "laptop repair course"-এর জন্য টাকা দিয়েছে — যার কোনোটিই গ্রাহক নয়।</p><p>এই রিপোর্ট পড়া আর এতে কাজ করা পেইড সার্চের সবচেয়ে বেশি মূল্যের একক নিয়মিত কাজ।</p>'),

      h(2, 'Negative Keyword', 'negative-keywords'),
      p('<p>একটি <b>negative keyword</b> সেই শব্দযুক্ত সার্চের জন্য আপনার বিজ্ঞাপন দেখানো ঠেকায়। Search terms রিপোর্ট যে ফাঁক প্রকাশ করে এভাবেই আপনি সেগুলো বন্ধ করেন।</p><p>বেশিরভাগ ব্যবসার জন্য সাধারণ negative: <code>free</code>, <code>jobs</code>, <code>salary</code>, <code>course</code>, <code>tutorial</code>, <code>diy</code>, <code>how to</code>, আর যেসব প্রতিযোগীর বিরুদ্ধে আপনি দর দিতে চান না তাদের নাম। প্রতিটি একটি সম্পূর্ণ শ্রেণীর অপ্রাসঙ্গিক ক্লিক ঠেকায়।</p>'),

      callout('tip', '<p>Negative keyword পেইড সার্চে বিনামূল্যের টাকার সবচেয়ে কাছাকাছি জিনিস। আপনার যোগ করা প্রতিটি এমন ক্লিকের জন্য টাকা দেওয়া থামায় যা কখনো রূপান্তরিত হতো না, আর প্রভাবটি চলমান ব্যবস্থাপনার প্রয়োজনের বদলে স্থায়ী।</p>'),

      h(2, 'বিজ্ঞাপনের প্রাসঙ্গিকতা', 'ad-relevance'),
      p('<p>Auction পাঠ থেকে: প্রাসঙ্গিকতা আপনি জেতেন কিনা আর কী দেন দুটোই প্রভাবিত করে। বিশেষভাবে search-এ, এর অর্থ keyword থেকে বিজ্ঞাপন থেকে landing পাতা পর্যন্ত শৃঙ্খলটি ধারাবাহিক হওয়া উচিত। যে laptop repair সার্চ করছে তার laptop repair নিয়ে একটি বিজ্ঞাপন দেখা উচিত, আর laptop repair নিয়ে একটি পাতায় পৌঁছানো উচিত — একটি হোমপেজে নয়।</p><p>সেই শৃঙ্খল ভাঙা কোথাও না যাওয়া ব্যয়বহুল ক্লিকের সবচেয়ে সাধারণ কারণ, আর এটি ঠিক করা সম্পূর্ণ আপনার নিয়ন্ত্রণে।</p>'),

      h(2, 'একটি যুক্তিসঙ্গত গঠন', 'a-sensible-structure'),
      p('<p>ঘনিষ্ঠভাবে সম্পর্কিত keyword একসাথে দলবদ্ধ করুন, আর প্রতিটি দলকে নিজস্ব বিজ্ঞাপন আর নিজস্ব landing পাতা দিন। এক দলে বিশটি ঢিলেভাবে সম্পর্কিত keyword মানে বিজ্ঞাপনগুলো সেগুলোর কোনোটির জন্যই নির্দিষ্ট হতে পারে না — যা একসাথে প্রাসঙ্গিকতা কমায়, খরচ বাড়ায়, আর ফলাফল কমায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'meta-ads',
  sortOrder: 25,
  en: {
    title: 'Meta Ads — Objectives, Formats & Placements',
    metaTitle: 'Meta Ads Objectives and Formats | Learn Computer Academy',
    metaDescription: 'How advertising on Facebook and Instagram differs from search advertising, and what campaign objectives, formats, and placements actually mean.',
    blocks: [
      p('<p>Meta Ads covers Facebook, Instagram, and Messenger through one system. The fundamental difference from search advertising: <b>nobody on these platforms is looking for you.</b> They are scrolling, and your ad interrupts that.</p>'),

      h(2, 'What That Difference Means'),
      p('<p>Search advertising captures existing demand — someone already decided they want something. Social advertising creates it, which is a harder job and changes what works.</p><p>The consequences are practical: the creative matters far more, because it has to earn attention that was not offered; you generally need to reach people more than once; and expectations should be calibrated to a longer path from first sight to action.</p>'),

      h(2, 'Campaign Objectives'),
      p('<p>The first choice in any Meta campaign is the <b>objective</b> — what you are asking the system to optimise toward. This matters more than almost any other setting, because the platform will deliver exactly what you asked for.</p>'),
      table(
        ['Objective category', 'The system optimises for'],
        [
          ['Awareness', 'Showing the ad to as many relevant people as possible'],
          ['Traffic', 'Clicks through to your site'],
          ['Engagement', 'Reactions, comments, shares, video views'],
          ['Leads', 'Form submissions or enquiries'],
          ['App promotion', 'App installs and in-app actions'],
          ['Sales', 'Purchases or defined conversions'],
        ]
      ),

      callout('warning', '<p>Choosing the wrong objective is the most expensive common mistake on this platform. Optimise for Traffic when you want sales and the system will faithfully find people who click a lot and buy nothing — it did exactly what you asked. Objective names have been reorganised more than once; match the <i>purpose</i>, not a name you remember.</p>', 'The objective is the instruction'),

      h(2, 'Formats'),
      p('<ul><li><b>Single image</b> — simplest, still effective, easiest to produce and test.</li><li><b>Video</b> — strong for demonstration and attention; short and captioned.</li><li><b>Carousel</b> — several images or videos someone can swipe, good for multiple products or a sequence of steps.</li><li><b>Collection</b> — a browsable product layout for retail.</li></ul><p>Start with the simplest format that communicates the idea. Elaborate production is not what makes an ad work, and it makes testing slower and more expensive.</p>'),

      h(2, 'Placements'),
      p('<p>A <b>placement</b> is where the ad appears — feeds, Stories, Reels, and various others across the apps. The important practical point is that these have different shapes: a Story or Reel is full-screen vertical, a feed placement is not.</p><p>An ad designed for one and stretched into another looks wrong and performs accordingly. If you use automatic placements, which is often reasonable, supply assets sized for the main formats rather than letting one image be cropped into all of them.</p>'),

      h(2, 'Creative Is the Main Lever'),
      p('<p>On search, relevance and bidding do much of the work. On social, the creative does. The image or video, the first line of text, and the offer determine most of the outcome — targeting and budget settings matter considerably less than people expect.</p><p>This has a direct implication for how to work: test creative continuously, and treat several variations as the normal state rather than a special exercise. It is also why creative fatigue is a real phenomenon here — an ad that performed well will decline as the same audience sees it repeatedly, and refreshing it is routine maintenance rather than a sign something went wrong.</p>'),
    ],
  },
  bn: {
    title: 'Meta Ads — Objective, ফরম্যাট আর Placement',
    metaTitle: 'Meta Ads Objective আর ফরম্যাট | Learn Computer Academy',
    metaDescription: 'Facebook আর Instagram-এ বিজ্ঞাপন search বিজ্ঞাপন থেকে কীভাবে আলাদা, আর campaign objective, ফরম্যাট, আর placement আসলে কী বোঝায়।',
    blocks: [
      p('<p>Meta Ads একটি সিস্টেমের মাধ্যমে Facebook, Instagram, আর Messenger কভার করে। Search বিজ্ঞাপন থেকে মৌলিক পার্থক্য: <b>এই প্ল্যাটফর্মে কেউ আপনাকে খুঁজছে না।</b> তারা স্ক্রল করছে, আর আপনার বিজ্ঞাপন তাতে বাধা দেয়।</p>'),

      h(2, 'সেই পার্থক্যের অর্থ কী', 'what-that-difference-means'),
      p('<p>Search বিজ্ঞাপন বিদ্যমান চাহিদা ধরে — কেউ ইতিমধ্যে ঠিক করেছে তারা কিছু চায়। সোশ্যাল বিজ্ঞাপন সেটি তৈরি করে, যা একটি কঠিন কাজ আর কী কাজ করে তা বদলায়।</p><p>পরিণতিগুলো ব্যবহারিক: creative অনেক বেশি গুরুত্বপূর্ণ, কারণ এটিকে এমন মনোযোগ অর্জন করতে হয় যা দেওয়া হয়নি; আপনার সাধারণত একাধিকবার মানুষে পৌঁছাতে হয়; আর প্রত্যাশা প্রথম দেখা থেকে কাজ পর্যন্ত একটি দীর্ঘ পথে সমন্বয় করা উচিত।</p>'),

      h(2, 'Campaign Objective', 'campaign-objectives'),
      p('<p>যেকোনো Meta campaign-এর প্রথম পছন্দ হলো <b>objective</b> — আপনি সিস্টেমকে কীসের দিকে অপ্টিমাইজ করতে বলছেন। এটি প্রায় অন্য যেকোনো সেটিংয়ের চেয়ে বেশি গুরুত্বপূর্ণ, কারণ প্ল্যাটফর্ম আপনি ঠিক যা চেয়েছেন তাই দেবে।</p>'),
      table(
        ['Objective শ্রেণী', 'সিস্টেম যার জন্য অপ্টিমাইজ করে'],
        [
          ['Awareness', 'যত বেশি সম্ভব প্রাসঙ্গিক মানুষকে বিজ্ঞাপন দেখানো'],
          ['Traffic', 'আপনার সাইটে ক্লিক'],
          ['Engagement', 'প্রতিক্রিয়া, মন্তব্য, শেয়ার, ভিডিও ভিউ'],
          ['Leads', 'Form জমা বা জিজ্ঞাসা'],
          ['App promotion', 'App ইনস্টল আর app-এর ভেতরে কাজ'],
          ['Sales', 'কেনা বা নির্ধারিত conversion'],
        ]
      ),

      callout('warning', '<p>ভুল objective বাছা এই প্ল্যাটফর্মের সবচেয়ে ব্যয়বহুল সাধারণ ভুল। আপনি বিক্রি চাইলে Traffic-এর জন্য অপ্টিমাইজ করুন আর সিস্টেম বিশ্বস্তভাবে এমন মানুষ খুঁজে দেবে যারা অনেক ক্লিক করে আর কিছুই কেনে না — এটি ঠিক আপনি যা চেয়েছেন তাই করেছে। Objective-এর নাম একাধিকবার পুনর্বিন্যস্ত হয়েছে; আপনার মনে থাকা একটি নাম নয়, <i>উদ্দেশ্য</i> মেলান।</p>', 'Objective-ই নির্দেশ'),

      h(2, 'ফরম্যাট', 'formats'),
      p('<ul><li><b>একক ছবি</b> — সবচেয়ে সরল, এখনো কার্যকর, তৈরি আর পরীক্ষা করা সবচেয়ে সহজ।</li><li><b>ভিডিও</b> — প্রদর্শনী আর মনোযোগের জন্য শক্তিশালী; ছোট আর caption সহ।</li><li><b>Carousel</b> — কয়েকটি ছবি বা ভিডিও যা কেউ swipe করতে পারে, একাধিক পণ্য বা ধাপের একটি ক্রমের জন্য ভালো।</li><li><b>Collection</b> — খুচরা বিক্রির জন্য একটি ব্রাউজ করার যোগ্য পণ্যের লেআউট।</li></ul><p>ধারণাটি যোগাযোগ করে এমন সবচেয়ে সরল ফরম্যাট দিয়ে শুরু করুন। বিস্তৃত প্রোডাকশন একটি বিজ্ঞাপনকে কার্যকর করে না, আর এটি পরীক্ষা ধীর আর ব্যয়বহুল করে।</p>'),

      h(2, 'Placement', 'placements'),
      p('<p>একটি <b>placement</b> হলো বিজ্ঞাপনটি কোথায় দেখা যায় — ফিড, Stories, Reels, আর অ্যাপগুলো জুড়ে অন্যান্য। গুরুত্বপূর্ণ ব্যবহারিক বিষয় হলো এগুলোর ভিন্ন আকৃতি আছে: একটি Story বা Reel পূর্ণ-স্ক্রিন উল্লম্ব, একটি ফিড placement নয়।</p><p>একটির জন্য ডিজাইন করা আর অন্যটিতে টেনে বড় করা একটি বিজ্ঞাপন ভুল দেখায় আর সেই অনুযায়ী পারফর্ম করে। আপনি স্বয়ংক্রিয় placement ব্যবহার করলে, যা প্রায়ই যুক্তিসঙ্গত, একটি ছবিকে সবগুলোতে crop হতে না দিয়ে প্রধান ফরম্যাটের জন্য আকার দেওয়া asset দিন।</p>'),

      h(2, 'Creative-ই প্রধান লিভার', 'creative-is-the-main-lever'),
      p('<p>Search-এ, প্রাসঙ্গিকতা আর দর দেওয়া বেশিরভাগ কাজ করে। সোশ্যালে, creative করে। ছবি বা ভিডিও, টেক্সটের প্রথম লাইন, আর অফার বেশিরভাগ ফলাফল নির্ধারণ করে — targeting আর বাজেটের সেটিং মানুষ যা আশা করে তার চেয়ে যথেষ্ট কম গুরুত্বপূর্ণ।</p><p>কীভাবে কাজ করতে হবে তাতে এর একটি সরাসরি তাৎপর্য আছে: ক্রমাগত creative পরীক্ষা করুন, আর একটি বিশেষ অনুশীলনের বদলে কয়েকটি রূপভেদকে স্বাভাবিক অবস্থা হিসেবে গণ্য করুন। এই কারণেই creative fatigue এখানে একটি বাস্তব ঘটনা — যে বিজ্ঞাপন ভালো পারফর্ম করেছে তা একই দর্শক বারবার দেখলে কমতে থাকবে, আর এটি সতেজ করা কিছু ভুল হওয়ার চিহ্নের বদলে নিয়মিত রক্ষণাবেক্ষণ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'targeting-and-retargeting',
  sortOrder: 26,
  en: {
    title: 'Audience Targeting & Retargeting',
    metaTitle: 'Audience Targeting and Retargeting | Learn Computer Academy',
    metaDescription: 'The main ways to define who sees an ad, how retargeting works, and why it usually outperforms targeting strangers.',
    blocks: [
      p('<p><b>Targeting</b> is how you tell a platform who should see your ad. The options fall into a few broad categories, and one of them consistently outperforms the others.</p>'),

      h(2, 'The Main Kinds'),
      table(
        ['Type', 'Based on', 'Typical use'],
        [
          ['Demographic', 'Age, location, language, sometimes job or education', 'Basic filtering — usually a floor, not a strategy'],
          ['Interest', 'Topics and pages a person engages with', 'Reaching people likely to care about your subject'],
          ['Behavioural', 'Actions taken, such as recent purchases or device use', 'Narrowing to demonstrated behaviour'],
          ['<b>Custom</b>', 'Your own data — site visitors, customer list, video viewers', 'Retargeting; usually the strongest'],
          ['<b>Lookalike</b>', 'People resembling one of your custom audiences', 'Scaling once you know who converts'],
        ]
      ),

      h(2, 'Retargeting'),
      p('<p><b>Retargeting</b> means showing ads to people who already interacted with you — visited your site, watched a video, opened an email, or added something to a basket without buying.</p><p>It reliably outperforms advertising to strangers, for an obvious reason: these people already demonstrated interest. They are not being introduced to you; they are being reminded. Cost per result is usually substantially lower.</p>'),

      img(
        'docs/img/marketing/retargeting-1',
        'Diagram showing a visitor arriving at a website, leaving without acting, and later being shown an ad elsewhere that brings them back',
        1344, 752,
        'Retargeting reaches people who already showed interest but did not act the first time.'
      ),

      h(2, 'How It Works Technically'),
      p('<p>A small piece of code on your site — commonly called a pixel or tag — records that a browser visited a particular page. The advertising platform can then include that browser in an audience you target later.</p><p>Two practical notes. First, install it <i>before</i> you need it: audiences build over time, so a pixel added the day you start a campaign has no history to work with. Second, this is personal data and is subject to privacy law in most jurisdictions — consent requirements, a privacy policy that describes it, and honouring browser and platform privacy settings are obligations, not optional extras.</p>'),

      callout('note', '<p>Retargeting has become less precise as browsers and operating systems restrict cross-site tracking. It still works, but audience sizes are smaller than they once were and matching is less reliable. Any advice written a few years ago overstates how much of your traffic you can expect to reach.</p>'),

      h(2, 'Lookalike Audiences'),
      p('<p>A <b>lookalike</b> asks the platform to find people who resemble an audience you supply — typically your customers or your best site visitors. It is the main way to scale beyond people who already know you, and it works considerably better than guessing at interests.</p><p>Its quality depends entirely on the source. A lookalike built from a small or mixed list produces a vague audience; one built from a clean list of actual paying customers produces a much better one.</p>'),

      h(2, 'Do Not Over-Narrow'),
      p('<p>The instinct with targeting options is to stack them — a specific age, in one city, interested in three things, who recently did a fourth thing. Each addition shrinks the audience, and past a point the platform has too few people to optimise across, which makes results worse and costs higher.</p><p>On modern platforms, the systems are generally better at finding responsive people than manual interest stacking is. Give reasonable constraints and enough room to work.</p>'),
    ],
  },
  bn: {
    title: 'দর্শক Targeting আর Retargeting',
    metaTitle: 'দর্শক Targeting আর Retargeting | Learn Computer Academy',
    metaDescription: 'কে একটি বিজ্ঞাপন দেখবে তা সংজ্ঞায়িত করার প্রধান উপায়, retargeting কীভাবে কাজ করে, আর কেন এটি সাধারণত অচেনাদের targeting-কে হারায়।',
    blocks: [
      p('<p><b>Targeting</b> হলো আপনি কীভাবে একটি প্ল্যাটফর্মকে বলেন কার আপনার বিজ্ঞাপন দেখা উচিত। বিকল্পগুলো কয়েকটি বিস্তৃত শ্রেণীতে পড়ে, আর সেগুলোর একটি ধারাবাহিকভাবে বাকিগুলোকে হারায়।</p>'),

      h(2, 'প্রধান ধরনগুলো', 'the-main-kinds'),
      table(
        ['ধরন', 'যার ভিত্তিতে', 'সাধারণ ব্যবহার'],
        [
          ['Demographic', 'বয়স, অবস্থান, ভাষা, কখনো চাকরি বা শিক্ষা', 'মৌলিক ছাঁকনি — সাধারণত একটি মেঝে, একটি কৌশল নয়'],
          ['Interest', 'একজন ব্যক্তি যে বিষয় আর পাতায় যুক্ত হয়', 'আপনার বিষয়ে আগ্রহী হওয়ার সম্ভাবনাযুক্ত মানুষে পৌঁছানো'],
          ['Behavioural', 'নেওয়া পদক্ষেপ, যেমন সাম্প্রতিক কেনাকাটা বা ডিভাইস ব্যবহার', 'প্রদর্শিত আচরণে সংকীর্ণ করা'],
          ['<b>Custom</b>', 'আপনার নিজের ডেটা — সাইট ভিজিটর, গ্রাহকের তালিকা, ভিডিও দর্শক', 'Retargeting; সাধারণত সবচেয়ে শক্তিশালী'],
          ['<b>Lookalike</b>', 'আপনার একটি custom দর্শকের সাথে সাদৃশ্যপূর্ণ মানুষ', 'কারা রূপান্তরিত হয় জানার পর স্কেল করা'],
        ]
      ),

      h(2, 'Retargeting', 'retargeting'),
      p('<p><b>Retargeting</b> মানে যারা ইতিমধ্যে আপনার সাথে যুক্ত হয়েছে তাদের বিজ্ঞাপন দেখানো — আপনার সাইটে গেছে, একটি ভিডিও দেখেছে, একটি ইমেইল খুলেছে, বা না কিনে একটি ঝুড়িতে কিছু যোগ করেছে।</p><p>এটি নির্ভরযোগ্যভাবে অচেনাদের কাছে বিজ্ঞাপনকে হারায়, একটি স্পষ্ট কারণে: এই মানুষরা ইতিমধ্যে আগ্রহ দেখিয়েছে। তাদের আপনার সাথে পরিচয় করানো হচ্ছে না; তাদের মনে করিয়ে দেওয়া হচ্ছে। প্রতি ফলাফলে খরচ সাধারণত যথেষ্ট কম।</p>'),

      img(
        'docs/img/marketing/retargeting-1',
        'ডায়াগ্রাম যেখানে একজন ভিজিটর একটি ওয়েবসাইটে আসছে, কিছু না করে চলে যাচ্ছে, আর পরে অন্যত্র একটি বিজ্ঞাপন দেখানো হচ্ছে যা তাদের ফিরিয়ে আনে',
        1344, 752,
        'Retargeting সেই মানুষদের কাছে পৌঁছায় যারা ইতিমধ্যে আগ্রহ দেখিয়েছে কিন্তু প্রথমবার কাজ করেনি।'
      ),

      h(2, 'এটি কারিগরিভাবে কীভাবে কাজ করে', 'how-it-works-technically'),
      p('<p>আপনার সাইটে কোডের একটি ছোট অংশ — সাধারণত pixel বা tag বলা হয় — নথিভুক্ত করে যে একটি ব্রাউজার একটি নির্দিষ্ট পাতায় গেছে। বিজ্ঞাপনের প্ল্যাটফর্ম তারপর সেই ব্রাউজারকে আপনি পরে লক্ষ্য করা একটি দর্শকে অন্তর্ভুক্ত করতে পারে।</p><p>দুটি ব্যবহারিক নোট। প্রথমত, আপনার এটি দরকার হওয়ার <i>আগে</i> এটি ইনস্টল করুন: দর্শক সময়ের সাথে গড়ে, তাই আপনি একটি campaign শুরুর দিন যোগ করা একটি pixel-এর কাজ করার মতো কোনো ইতিহাস নেই। দ্বিতীয়ত, এটি ব্যক্তিগত ডেটা আর বেশিরভাগ এখতিয়ারে গোপনীয়তা আইনের অধীন — সম্মতির প্রয়োজনীয়তা, এটি বর্ণনা করা একটি গোপনীয়তা নীতি, আর ব্রাউজার আর প্ল্যাটফর্মের গোপনীয়তার সেটিং মানা বাধ্যবাধকতা, ঐচ্ছিক অতিরিক্ত নয়।</p>'),

      callout('note', '<p>ব্রাউজার আর অপারেটিং সিস্টেম cross-site ট্র্যাকিং সীমাবদ্ধ করায় retargeting কম নির্ভুল হয়েছে। এটি এখনো কাজ করে, কিন্তু দর্শকের আকার একসময়ের চেয়ে ছোট আর মেলানো কম নির্ভরযোগ্য। কয়েক বছর আগে লেখা যেকোনো পরামর্শ আপনি আপনার ট্রাফিকের কতটা কাছে পৌঁছানোর আশা করতে পারেন তা অতিরঞ্জিত করে।</p>'),

      h(2, 'Lookalike দর্শক', 'lookalike-audiences'),
      p('<p>একটি <b>lookalike</b> প্ল্যাটফর্মকে আপনার দেওয়া একটি দর্শকের সাথে সাদৃশ্যপূর্ণ মানুষ খুঁজতে বলে — সাধারণত আপনার গ্রাহক বা আপনার সেরা সাইট ভিজিটর। যারা ইতিমধ্যে আপনাকে চেনে তাদের বাইরে স্কেল করার এটিই প্রধান উপায়, আর এটি আগ্রহ অনুমান করার চেয়ে যথেষ্ট ভালো কাজ করে।</p><p>এর গুণমান সম্পূর্ণভাবে উৎসের উপর নির্ভর করে। একটি ছোট বা মিশ্র তালিকা থেকে তৈরি একটি lookalike একটি অস্পষ্ট দর্শক তৈরি করে; আসল টাকা দেওয়া গ্রাহকের একটি পরিষ্কার তালিকা থেকে তৈরি একটি অনেক ভালো একটি তৈরি করে।</p>'),

      h(2, 'অতিরিক্ত সংকীর্ণ করবেন না', 'do-not-over-narrow'),
      p('<p>Targeting-এর বিকল্প নিয়ে প্রবৃত্তি হলো সেগুলো স্তূপ করা — একটি নির্দিষ্ট বয়স, এক শহরে, তিনটি জিনিসে আগ্রহী, যারা সম্প্রতি একটি চতুর্থ জিনিস করেছে। প্রতিটি সংযোজন দর্শক ছোট করে, আর একটি বিন্দুর পরে প্ল্যাটফর্মের অপ্টিমাইজ করার মতো খুব কম মানুষ থাকে, যা ফলাফল খারাপ আর খরচ বেশি করে।</p><p>আধুনিক প্ল্যাটফর্মে, সিস্টেমগুলো সাধারণত ম্যানুয়াল আগ্রহ স্তূপ করার চেয়ে সাড়া দেওয়া মানুষ খুঁজতে ভালো। যুক্তিসঙ্গত সীমা আর কাজ করার যথেষ্ট জায়গা দিন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'budgets-and-bidding',
  sortOrder: 27,
  en: {
    title: 'Budgets & Bidding Strategies',
    metaTitle: 'Ad Budgets and Bidding Strategies | Learn Computer Academy',
    metaDescription: 'How daily and lifetime budgets differ, what manual and automated bidding actually do, and why changing settings too often makes results worse.',
    blocks: [
      p('<p>Budget controls how much you spend. Bidding controls how that budget competes in the auctions from the earlier lesson. They are separate settings and people routinely confuse them.</p>'),

      h(2, 'Daily and Lifetime Budgets'),
      table(
        ['', 'Daily budget', 'Lifetime budget'],
        [
          ['You set', 'An amount per day', 'A total for the whole campaign'],
          ['The platform', 'May exceed on a good day, balancing over time', 'Paces spending across the period'],
          ['Suits', 'Ongoing campaigns with no end date', 'Fixed-period campaigns — an event, a promotion'],
        ]
      ),
      p('<p>One point that surprises people: a daily budget is an average, not a ceiling. Platforms commonly spend more on days where opportunity is better and less on others, balancing out over the period. A single day above the number is normal behaviour rather than a fault.</p>'),

      h(2, 'Manual and Automated Bidding'),
      p('<p><b>Manual bidding</b> means you set the maximum you will pay. It gives direct control and requires attention, and it cannot react to conditions between your adjustments.</p><p><b>Automated bidding</b> hands the decision to the platform, which adjusts bids for each individual auction based on how likely that person is to do what you want. It uses far more signals than you have access to, and it is generally the better choice once there is enough conversion data to learn from.</p>'),

      h(2, 'The Main Automated Approaches'),
      table(
        ['Approach', 'Optimises for', 'Needs'],
        [
          ['Maximise clicks', 'The most traffic for the budget', 'Very little; a reasonable starting point'],
          ['Maximise conversions', 'The most conversions for the budget', 'Working conversion tracking'],
          ['Target cost per action', 'Conversions at roughly a cost you name', 'Enough conversion history to be stable'],
          ['Target return on ad spend', 'Revenue relative to spend', 'Conversion values, not just conversion counts'],
        ]
      ),

      callout('warning', '<p>Every automated strategy aimed at conversions depends on conversion tracking being correct. If tracking is broken, or counts the wrong thing, automation will optimise confidently toward a goal that does not reflect your business — and it will do it faster and more thoroughly than a manual campaign would. Verify tracking before trusting automation.</p>', 'Automation amplifies whatever you measure'),

      h(2, 'The Learning Period'),
      p('<p>When a campaign starts, or when you change it substantially, the platform needs data before it can optimise well. Results during this period are unrepresentative — often worse, sometimes misleadingly better.</p><p>The common mistake follows directly: seeing poor early numbers, changing the settings, which restarts learning, seeing poor numbers again, and changing again. A campaign kept permanently in that state never gets the chance to work.</p>'),

      callout('tip', '<p>Set a campaign up carefully, then leave it alone long enough to produce meaningful data before judging it. Resisting the urge to adjust daily is one of the more valuable disciplines in paid advertising, and one of the harder ones.</p>'),

      h(2, 'Deciding a Budget'),
      p('<p>Work backwards from what a customer is worth rather than forwards from what you feel comfortable spending. If a customer is worth a certain amount to you, and roughly one in ten enquiries becomes a customer, and roughly one in twenty clicks becomes an enquiry, you can estimate what a click can be worth paying for.</p><p>Those ratios are unknown before you start — which is the argument for a small test budget whose purpose is to produce those numbers, not to generate profit. Once you know them, scaling is arithmetic instead of guesswork.</p>'),
    ],
  },
  bn: {
    title: 'বাজেট আর Bidding কৌশল',
    metaTitle: 'বিজ্ঞাপনের বাজেট আর Bidding কৌশল | Learn Computer Academy',
    metaDescription: 'দৈনিক আর lifetime বাজেট কীভাবে আলাদা, ম্যানুয়াল আর স্বয়ংক্রিয় bidding আসলে কী করে, আর কেন খুব ঘন ঘন সেটিং বদলালে ফলাফল খারাপ হয়।',
    blocks: [
      p('<p>বাজেট নিয়ন্ত্রণ করে আপনি কত খরচ করেন। Bidding নিয়ন্ত্রণ করে সেই বাজেট আগের পাঠের auction-এ কীভাবে প্রতিযোগিতা করে। সেগুলো আলাদা সেটিং আর মানুষ নিয়মিত সেগুলো গুলিয়ে ফেলে।</p>'),

      h(2, 'দৈনিক আর Lifetime বাজেট', 'daily-and-lifetime-budgets'),
      table(
        ['', 'দৈনিক বাজেট', 'Lifetime বাজেট'],
        [
          ['আপনি সেট করেন', 'প্রতিদিন একটি পরিমাণ', 'পুরো campaign-এর জন্য একটি মোট'],
          ['প্ল্যাটফর্ম', 'একটি ভালো দিনে বেশি হতে পারে, সময়ের সাথে ভারসাম্য করে', 'সময়কাল জুড়ে খরচের গতি ঠিক করে'],
          ['উপযোগী', 'শেষ তারিখ ছাড়া চলমান campaign', 'নির্দিষ্ট-সময়ের campaign — একটি ইভেন্ট, একটি প্রচার'],
        ]
      ),
      p('<p>একটি বিষয় যা মানুষকে অবাক করে: একটি দৈনিক বাজেট একটি গড়, একটি সিলিং নয়। প্ল্যাটফর্ম সাধারণত যেসব দিনে সুযোগ ভালো সেদিন বেশি আর অন্যদিন কম খরচ করে, সময়কাল জুড়ে ভারসাম্য করে। সংখ্যার উপরে একটি একক দিন একটি ত্রুটির বদলে স্বাভাবিক আচরণ।</p>'),

      h(2, 'ম্যানুয়াল আর স্বয়ংক্রিয় Bidding', 'manual-and-automated-bidding'),
      p('<p><b>ম্যানুয়াল bidding</b> মানে আপনি সর্বোচ্চ কত দেবেন তা সেট করেন। এটি সরাসরি নিয়ন্ত্রণ দেয় আর মনোযোগ দাবি করে, আর এটি আপনার সমন্বয়ের মধ্যে পরিস্থিতিতে প্রতিক্রিয়া করতে পারে না।</p><p><b>স্বয়ংক্রিয় bidding</b> সিদ্ধান্তটি প্ল্যাটফর্মকে দেয়, যা সেই ব্যক্তির আপনি যা চান তা করার সম্ভাবনার উপর ভিত্তি করে প্রতিটি একক auction-এর জন্য দর সমন্বয় করে। এটি আপনার প্রবেশাধিকারের চেয়ে অনেক বেশি সংকেত ব্যবহার করে, আর শেখার মতো যথেষ্ট conversion ডেটা থাকলে এটি সাধারণত ভালো পছন্দ।</p>'),

      h(2, 'প্রধান স্বয়ংক্রিয় পদ্ধতিগুলো', 'the-main-automated-approaches'),
      table(
        ['পদ্ধতি', 'যার জন্য অপ্টিমাইজ করে', 'যা দরকার'],
        [
          ['Maximise clicks', 'বাজেটের জন্য সবচেয়ে বেশি ট্রাফিক', 'খুব কম; একটি যুক্তিসঙ্গত শুরুর বিন্দু'],
          ['Maximise conversions', 'বাজেটের জন্য সবচেয়ে বেশি conversion', 'কার্যকর conversion ট্র্যাকিং'],
          ['Target cost per action', 'আপনার বলা মোটামুটি একটি খরচে conversion', 'স্থিতিশীল হতে যথেষ্ট conversion ইতিহাস'],
          ['Target return on ad spend', 'খরচের সাপেক্ষে আয়', 'শুধু conversion সংখ্যা নয়, conversion-এর মান'],
        ]
      ),

      callout('warning', '<p>Conversion-এর দিকে লক্ষ্য করা প্রতিটি স্বয়ংক্রিয় কৌশল conversion ট্র্যাকিং সঠিক হওয়ার উপর নির্ভর করে। ট্র্যাকিং ভাঙা থাকলে, বা ভুল জিনিস গণনা করলে, অটোমেশন আত্মবিশ্বাসের সাথে এমন একটি লক্ষ্যের দিকে অপ্টিমাইজ করবে যা আপনার ব্যবসা প্রতিফলিত করে না — আর এটি একটি ম্যানুয়াল campaign যত দ্রুত আর পুঙ্খানুপুঙ্খভাবে করত তার চেয়ে বেশি করবে। অটোমেশনকে বিশ্বাস করার আগে ট্র্যাকিং যাচাই করুন।</p>', 'আপনি যা মাপেন অটোমেশন তা বাড়িয়ে দেয়'),

      h(2, 'শেখার সময়কাল', 'the-learning-period'),
      p('<p>একটি campaign শুরু হলে, বা আপনি এটি যথেষ্ট বদলালে, প্ল্যাটফর্মের ভালোভাবে অপ্টিমাইজ করার আগে ডেটা দরকার। এই সময়কালের ফলাফল অপ্রতিনিধিত্বমূলক — প্রায়ই খারাপ, কখনো বিভ্রান্তিকরভাবে ভালো।</p><p>সাধারণ ভুলটি সরাসরি আসে: খারাপ প্রাথমিক সংখ্যা দেখে, সেটিং বদলানো, যা শেখা পুনরায় শুরু করে, আবার খারাপ সংখ্যা দেখা, আর আবার বদলানো। স্থায়ীভাবে সেই অবস্থায় রাখা একটি campaign কখনো কাজ করার সুযোগ পায় না।</p>'),

      callout('tip', '<p>একটি campaign যত্নের সাথে সেট আপ করুন, তারপর এটি বিচার করার আগে অর্থপূর্ণ ডেটা তৈরি করতে যথেষ্ট সময় একা ছেড়ে দিন। দৈনিক সমন্বয়ের তাগিদ প্রতিরোধ করা পেইড বিজ্ঞাপনের বেশি মূল্যবান শৃঙ্খলাগুলোর একটি, আর কঠিনগুলোরও একটি।</p>'),

      h(2, 'একটি বাজেট ঠিক করা', 'deciding-a-budget'),
      p('<p>আপনি খরচ করতে স্বাচ্ছন্দ্য বোধ করেন তা থেকে সামনে নয়, একজন গ্রাহকের মূল্য কত তা থেকে পেছনে কাজ করুন। একজন গ্রাহক আপনার কাছে একটি নির্দিষ্ট পরিমাণ মূল্যবান হলে, আর মোটামুটি দশটি জিজ্ঞাসার একটি গ্রাহক হলে, আর মোটামুটি বিশটি ক্লিকের একটি জিজ্ঞাসা হলে, আপনি আন্দাজ করতে পারেন একটি ক্লিকের জন্য কত দেওয়ার যোগ্য।</p><p>শুরু করার আগে সেই অনুপাত অজানা — যা একটি ছোট পরীক্ষার বাজেটের যুক্তি যার উদ্দেশ্য সেই সংখ্যাগুলো তৈরি করা, লাভ তৈরি করা নয়। একবার সেগুলো জানলে, স্কেল করা অনুমানের বদলে গাণিতিক।</p>'),
    ],
  },
})

lessons.push({
  slug: 'measuring-ad-performance',
  sortOrder: 28,
  en: {
    title: 'Measuring Ad Performance',
    metaTitle: 'Measuring Ad Performance | Learn Computer Academy',
    metaDescription: 'Which advertising metrics actually indicate success, how to calculate return on ad spend, and why conversion tracking has to come first.',
    blocks: [
      p('<p>Advertising platforms report a large number of metrics, and most of them do not answer the only question that matters: did this make more money than it cost?</p>'),

      h(2, 'Conversion Tracking Comes First'),
      p('<p>A <b>conversion</b> is the action you actually want — a purchase, an enquiry, a signup, a call. Until the platform can record when one happens, every other number is decoration. Clicks, impressions, and engagement all describe activity rather than outcome.</p><p>This is also the foundation everything else in the previous lesson depends on: automated bidding aimed at conversions cannot work if conversions are not measured correctly.</p>'),

      h(2, 'The Metrics Worth Watching'),
      table(
        ['Metric', 'What it tells you'],
        [
          ['Click-through rate', 'Whether the ad is relevant and appealing to who sees it'],
          ['Conversion rate', 'Whether the landing page delivers on what the ad promised'],
          ['Cost per click', 'What competition and relevance are costing you'],
          ['Cost per conversion', 'What one actual result costs — far more useful than cost per click'],
          ['<b>Return on ad spend</b>', 'Revenue produced for each unit spent — the closest thing to the real answer'],
        ]
      ),

      h(2, 'Return on Ad Spend'),
      p('<p><b>ROAS</b> is revenue divided by advertising cost. Spend 10,000 and generate 30,000 in revenue, and ROAS is 3 — three units of revenue for each one spent.</p><p>The important caveat: ROAS uses <i>revenue</i>, not profit. A ROAS of 3 on a product with a thin margin can still lose money. Knowing your margin is what turns ROAS from a number into a decision.</p>'),

      h(2, 'Reading the Numbers Together'),
      p('<p>Individual metrics mislead; combinations diagnose. Some common patterns:</p><ul><li><b>High click-through, low conversion.</b> The ad is working and the page is not — a message match problem, most often.</li><li><b>Low click-through, high conversion.</b> The few people who click are exactly right. Worth expanding the audience carefully rather than changing the offer.</li><li><b>High cost per click, good cost per conversion.</b> Expensive clicks that convert well. This is fine — cost per click alone would have wrongly suggested a problem.</li><li><b>Good conversion volume, poor ROAS.</b> Converting the wrong customers, or converting them at the wrong price.</li></ul>'),

      callout('note', '<p>Cost per click is the metric people watch most and it is one of the least informative on its own. A campaign with expensive clicks that produce customers is outperforming a campaign with cheap clicks that produce nothing, every time.</p>'),

      h(2, 'Attribution, Honestly'),
      p('<p>Platforms report the conversions they believe they caused, and this is systematically generous. Each platform sees only its own contribution and tends to claim credit for journeys that involved several touchpoints — an ad, a search, an email, a direct visit days later.</p><p>Add up the conversions claimed by every platform and the total commonly exceeds the conversions that actually happened. Privacy restrictions have also made tracking less complete than it once was.</p><p>The practical response is to treat platform-reported numbers as directional, and to sanity-check them against something independent — your own sales records, enquiry counts, or a simple question on your enquiry form asking how someone found you. If the platforms claim thirty conversions and you had eleven enquiries, the platforms are wrong.</p>'),

      h(2, 'Give It Enough Data'),
      p('<p>Small numbers are noise. Three conversions from two hundred clicks tells you almost nothing, and reacting to it produces the constant-adjustment problem from the previous lesson. Wait for enough volume to be confident a difference is real before acting on it.</p>'),
    ],
  },
  bn: {
    title: 'বিজ্ঞাপনের পারফরম্যান্স মাপা',
    metaTitle: 'বিজ্ঞাপনের পারফরম্যান্স মাপা | Learn Computer Academy',
    metaDescription: 'কোন বিজ্ঞাপনের মেট্রিক আসলে সাফল্য নির্দেশ করে, return on ad spend কীভাবে হিসাব করবেন, আর কেন conversion ট্র্যাকিং আগে আসতে হবে।',
    blocks: [
      p('<p>বিজ্ঞাপনের প্ল্যাটফর্ম বিপুল সংখ্যক মেট্রিক জানায়, আর সেগুলোর বেশিরভাগ একমাত্র যে প্রশ্নটি গুরুত্বপূর্ণ তার উত্তর দেয় না: এটি কি খরচের চেয়ে বেশি টাকা এনেছে?</p>'),

      h(2, 'Conversion ট্র্যাকিং আগে আসে', 'conversion-tracking-comes-first'),
      p('<p>একটি <b>conversion</b> হলো আপনি আসলে যে কাজটি চান — একটি কেনা, একটি জিজ্ঞাসা, একটি signup, একটি কল। প্ল্যাটফর্ম কখন একটি ঘটে তা নথিভুক্ত করতে না পারা পর্যন্ত, অন্য প্রতিটি সংখ্যা সাজসজ্জা। ক্লিক, impression, আর সম্পৃক্ততা সবই ফলাফলের বদলে কার্যকলাপ বর্ণনা করে।</p><p>এটিই সেই ভিত্তি যার উপর আগের পাঠের বাকি সবকিছু নির্ভর করে: conversion সঠিকভাবে না মাপলে conversion-এর দিকে লক্ষ্য করা স্বয়ংক্রিয় bidding কাজ করতে পারে না।</p>'),

      h(2, 'দেখার যোগ্য মেট্রিক', 'the-metrics-worth-watching'),
      table(
        ['মেট্রিক', 'যা বলে'],
        [
          ['Click-through rate', 'বিজ্ঞাপনটি যে দেখে তার কাছে প্রাসঙ্গিক আর আকর্ষণীয় কিনা'],
          ['Conversion rate', 'বিজ্ঞাপন যা প্রতিশ্রুতি দিয়েছিল landing পাতা তা দেয় কিনা'],
          ['প্রতি ক্লিকে খরচ', 'প্রতিযোগিতা আর প্রাসঙ্গিকতা আপনার কত খরচ করাচ্ছে'],
          ['প্রতি conversion-এ খরচ', 'একটি আসল ফলাফলে কত খরচ — প্রতি ক্লিকে খরচের চেয়ে অনেক বেশি কাজের'],
          ['<b>Return on ad spend</b>', 'প্রতিটি খরচ করা এককে তৈরি আয় — আসল উত্তরের সবচেয়ে কাছের জিনিস'],
        ]
      ),

      h(2, 'Return on Ad Spend', 'return-on-ad-spend'),
      p('<p><b>ROAS</b> হলো আয় ভাগ বিজ্ঞাপনের খরচ। ১০,০০০ খরচ করে ৩০,০০০ আয় করলে, ROAS হলো ৩ — প্রতিটি খরচ করা এককে তিন একক আয়।</p><p>গুরুত্বপূর্ণ সতর্কতা: ROAS <i>আয়</i> ব্যবহার করে, লাভ নয়। একটি পাতলা মার্জিনের পণ্যে ৩ ROAS-এও টাকা হারাতে পারে। আপনার মার্জিন জানাই ROAS-কে একটি সংখ্যা থেকে একটি সিদ্ধান্তে পরিণত করে।</p>'),

      h(2, 'সংখ্যাগুলো একসাথে পড়া', 'reading-the-numbers-together'),
      p('<p>একক মেট্রিক বিভ্রান্ত করে; সমন্বয় নির্ণয় করে। কিছু সাধারণ প্যাটার্ন:</p><ul><li><b>উঁচু click-through, নিচু conversion।</b> বিজ্ঞাপন কাজ করছে আর পাতা করছে না — বেশিরভাগ ক্ষেত্রে একটি message match সমস্যা।</li><li><b>নিচু click-through, উঁচু conversion।</b> যে অল্প কজন ক্লিক করে তারা ঠিক সঠিক। অফার বদলানোর বদলে সাবধানে দর্শক বাড়ানোর যোগ্য।</li><li><b>উঁচু প্রতি-ক্লিক খরচ, ভালো প্রতি-conversion খরচ।</b> ব্যয়বহুল ক্লিক যা ভালো রূপান্তর করে। এটি ঠিক আছে — শুধু প্রতি ক্লিকে খরচ ভুলভাবে একটি সমস্যার ইঙ্গিত দিত।</li><li><b>ভালো conversion পরিমাণ, খারাপ ROAS।</b> ভুল গ্রাহক রূপান্তর করা, বা তাদের ভুল দামে রূপান্তর করা।</li></ul>'),

      callout('note', '<p>প্রতি ক্লিকে খরচ সেই মেট্রিক যা মানুষ সবচেয়ে বেশি দেখে আর এটি নিজে সবচেয়ে কম তথ্যবহুলগুলোর একটি। ব্যয়বহুল ক্লিকযুক্ত যে campaign গ্রাহক তৈরি করে তা সস্তা ক্লিকযুক্ত যে campaign কিছুই তৈরি করে না তাকে প্রতিবারই হারাচ্ছে।</p>'),

      h(2, 'Attribution, সৎভাবে', 'attribution-honestly'),
      p('<p>প্ল্যাটফর্ম তারা যেসব conversion ঘটিয়েছে বলে বিশ্বাস করে সেগুলো জানায়, আর এটি ব্যবস্থাগতভাবে উদার। প্রতিটি প্ল্যাটফর্ম শুধু নিজের অবদান দেখে আর এমন যাত্রার কৃতিত্ব দাবি করার প্রবণতা রাখে যাতে কয়েকটি স্পর্শবিন্দু জড়িত ছিল — একটি বিজ্ঞাপন, একটি সার্চ, একটি ইমেইল, দিন কয়েক পরে একটি সরাসরি ভিজিট।</p><p>প্রতিটি প্ল্যাটফর্মের দাবি করা conversion যোগ করলে মোটটি সাধারণত আসলে ঘটা conversion ছাড়িয়ে যায়। গোপনীয়তার বিধিনিষেধও ট্র্যাকিংকে একসময়ের চেয়ে কম সম্পূর্ণ করেছে।</p><p>ব্যবহারিক প্রতিক্রিয়া হলো প্ল্যাটফর্ম-জানানো সংখ্যাকে দিকনির্দেশক হিসেবে গণ্য করা, আর স্বাধীন কিছুর বিপরীতে সেগুলো যাচাই করা — আপনার নিজের বিক্রির রেকর্ড, জিজ্ঞাসার সংখ্যা, বা আপনার জিজ্ঞাসার form-এ কেউ আপনাকে কীভাবে খুঁজে পেয়েছে জিজ্ঞাসা করা একটি সরল প্রশ্ন। প্ল্যাটফর্ম ত্রিশটি conversion দাবি করলে আর আপনার এগারোটি জিজ্ঞাসা থাকলে, প্ল্যাটফর্মগুলো ভুল।</p>'),

      h(2, 'এটিকে যথেষ্ট ডেটা দিন', 'give-it-enough-data'),
      p('<p>ছোট সংখ্যা শব্দ। দুইশো ক্লিক থেকে তিনটি conversion আপনাকে প্রায় কিছুই বলে না, আর এতে প্রতিক্রিয়া করলে আগের পাঠের ক্রমাগত-সমন্বয়ের সমস্যা তৈরি হয়। একটি পার্থক্য বাস্তব সে বিষয়ে আত্মবিশ্বাসী হতে যথেষ্ট পরিমাণের জন্য অপেক্ষা করুন এতে কাজ করার আগে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'brand-basics',
  sortOrder: 29,
  en: {
    title: 'Brand Basics',
    metaTitle: 'Brand Basics | Learn Computer Academy',
    metaDescription: 'What a brand actually is beyond a logo, why consistency matters across channels, and how to define a voice you can sustain.',
    blocks: [
      p('<p>A <b>brand</b> is not a logo. It is what people expect from you before they deal with you — built from every interaction they have had, or heard about, over time. The logo is a label attached to that expectation.</p>'),

      h(2, 'What Actually Builds It'),
      p('<p>Brand is the accumulated result of things that mostly are not design decisions:</p><ul><li>Whether you do what you said you would</li><li>How you respond when something goes wrong</li><li>Whether your prices and terms are clear or hidden</li><li>Whether the experience matches what the marketing implied</li><li>How you speak to people who are not yet customers</li></ul><p>A business with a beautiful identity and unreliable delivery has a bad brand. The design was never the load-bearing part.</p>'),

      h(2, 'Consistency Is the Practical Requirement'),
      p('<p>Someone might encounter you on a search result, then a social profile, then a website, then an email. If those feel like four different organisations, each encounter starts from zero instead of building on the last.</p><p>What needs to stay consistent is narrower than people assume:</p><ul><li><b>Name and visual identity</b> — the same logo, colours, and typefaces everywhere.</li><li><b>Voice</b> — the same personality in the writing.</li><li><b>What you claim to do</b> — the same description of your work, not five different ones.</li><li><b>Quality level</b> — a polished website and a careless social account undermine each other.</li></ul>'),

      h(2, 'Defining a Voice'),
      p('<p>Voice is how you sound. It is the most useful brand decision for marketing purposes, because it applies to every word you publish and it is free to define.</p><p>A practical way to pin it down is by choosing between pairs: formal or conversational, serious or light, direct or gentle, expert or peer. Write down three or four choices, and one line of what you avoid — for example, "we do not use jargon without explaining it" or "we do not exaggerate what a course will do for someone".</p>'),

      callout('tip', '<p>The test of a defined voice is whether someone else could write in it. If your description is vague enough that two people would produce completely different text from it, it is not defined yet — and it will not survive anyone else writing on your behalf.</p>'),

      h(2, 'Be Findable and Recognisable'),
      p('<p>Practical, unglamorous things that matter more than they sound:</p><ul><li>Use the same handle across platforms where possible.</li><li>Use the same profile image everywhere.</li><li>Describe yourself the same way in every bio.</li><li>Make sure your name, address, and phone number match everywhere they appear — the same NAP consistency the SEO course covers for local search.</li></ul>'),

      h(2, 'Do Not Over-Invest Early'),
      p('<p>New businesses commonly spend heavily on identity design before knowing what they are selling, to whom, or how they will describe it. Brand emerges from doing the work and finding out what people respond to.</p><p>A clear name, a simple consistent visual treatment, and a voice you can actually sustain are enough to start. Refinement is much easier once you have real customers to learn from.</p>'),
    ],
  },
  bn: {
    title: 'ব্র‍্যান্ডের মূল বিষয়',
    metaTitle: 'ব্র‍্যান্ডের মূল বিষয় | Learn Computer Academy',
    metaDescription: 'একটি logo-র বাইরে একটি ব্র‍্যান্ড আসলে কী, চ্যানেল জুড়ে ধারাবাহিকতা কেন গুরুত্বপূর্ণ, আর আপনি বজায় রাখতে পারেন এমন একটি কণ্ঠ কীভাবে সংজ্ঞায়িত করবেন।',
    blocks: [
      p('<p>একটি <b>ব্র‍্যান্ড</b> একটি logo নয়। এটি হলো আপনার সাথে লেনদেনের আগে মানুষ আপনার কাছ থেকে যা আশা করে — সময়ের সাথে তাদের হওয়া, বা শোনা, প্রতিটি মিথস্ক্রিয়া থেকে তৈরি। Logo সেই প্রত্যাশার সাথে যুক্ত একটি লেবেল।</p>'),

      h(2, 'আসলে কী এটি গড়ে', 'what-actually-builds-it'),
      p('<p>ব্র‍্যান্ড হলো এমন জিনিসের জমা ফল যেগুলোর বেশিরভাগ ডিজাইনের সিদ্ধান্ত নয়:</p><ul><li>আপনি যা বলেছিলেন করবেন তা করেন কিনা</li><li>কিছু ভুল হলে আপনি কীভাবে সাড়া দেন</li><li>আপনার দাম আর শর্ত স্পষ্ট নাকি লুকানো</li><li>অভিজ্ঞতাটি মার্কেটিং যা ইঙ্গিত করেছিল তার সাথে মেলে কিনা</li><li>যারা এখনো গ্রাহক নয় তাদের সাথে আপনি কীভাবে কথা বলেন</li></ul><p>একটি সুন্দর পরিচয় আর অনির্ভরযোগ্য সরবরাহযুক্ত একটি ব্যবসার একটি খারাপ ব্র‍্যান্ড আছে। ডিজাইন কখনোই ভার বহনকারী অংশ ছিল না।</p>'),

      h(2, 'ধারাবাহিকতাই ব্যবহারিক প্রয়োজনীয়তা', 'consistency-is-the-practical-requirement'),
      p('<p>কেউ আপনার সাথে একটি সার্চ ফলাফলে, তারপর একটি সোশ্যাল প্রোফাইলে, তারপর একটি ওয়েবসাইটে, তারপর একটি ইমেইলে মুখোমুখি হতে পারে। সেগুলো চারটি ভিন্ন প্রতিষ্ঠান মনে হলে, প্রতিটি সাক্ষাৎ আগেরটির উপর গড়ার বদলে শূন্য থেকে শুরু হয়।</p><p>যা ধারাবাহিক থাকা দরকার তা মানুষ যা ধরে নেয় তার চেয়ে সংকীর্ণ:</p><ul><li><b>নাম আর দৃশ্যগত পরিচয়</b> — সর্বত্র একই logo, রং, আর টাইপফেস।</li><li><b>কণ্ঠ</b> — লেখায় একই ব্যক্তিত্ব।</li><li><b>আপনি যা করেন বলে দাবি করেন</b> — আপনার কাজের একই বর্ণনা, পাঁচটি ভিন্ন নয়।</li><li><b>গুণমানের স্তর</b> — একটি পরিপাটি ওয়েবসাইট আর একটি অযত্নের সোশ্যাল অ্যাকাউন্ট একে অপরকে দুর্বল করে।</li></ul>'),

      h(2, 'একটি কণ্ঠ সংজ্ঞায়িত করা', 'defining-a-voice'),
      p('<p>কণ্ঠ হলো আপনি কেমন শোনান। মার্কেটিংয়ের উদ্দেশ্যে এটি সবচেয়ে কাজের ব্র‍্যান্ড সিদ্ধান্ত, কারণ এটি আপনার প্রকাশ করা প্রতিটি শব্দে প্রযোজ্য আর এটি সংজ্ঞায়িত করা বিনামূল্যে।</p><p>এটি নির্দিষ্ট করার একটি ব্যবহারিক উপায় হলো জোড়ার মধ্যে বাছাই: আনুষ্ঠানিক নাকি কথোপকথনমূলক, গম্ভীর নাকি হালকা, সরাসরি নাকি কোমল, বিশেষজ্ঞ নাকি সমকক্ষ। তিন-চারটি পছন্দ লিখে রাখুন, আর আপনি কী এড়ান তার একটি লাইন — যেমন, "আমরা ব্যাখ্যা না করে পরিভাষা ব্যবহার করি না" বা "একটি কোর্স কারো জন্য কী করবে আমরা তা অতিরঞ্জিত করি না"।</p>'),

      callout('tip', '<p>একটি সংজ্ঞায়িত কণ্ঠের পরীক্ষা হলো অন্য কেউ এতে লিখতে পারবে কিনা। আপনার বর্ণনা যদি এতটাই অস্পষ্ট হয় যে দুজন মানুষ এটি থেকে সম্পূর্ণ ভিন্ন টেক্সট তৈরি করবে, এটি এখনো সংজ্ঞায়িত নয় — আর আপনার হয়ে অন্য কেউ লিখলে এটি টিকবে না।</p>'),

      h(2, 'খুঁজে পাওয়ার যোগ্য আর চেনা যায় এমন হন', 'be-findable-and-recognisable'),
      p('<p>ব্যবহারিক, জৌলুসহীন জিনিস যা শোনার চেয়ে বেশি গুরুত্বপূর্ণ:</p><ul><li>সম্ভব হলে প্ল্যাটফর্ম জুড়ে একই handle ব্যবহার করুন।</li><li>সর্বত্র একই প্রোফাইল ছবি ব্যবহার করুন।</li><li>প্রতিটি bio-তে নিজেকে একইভাবে বর্ণনা করুন।</li><li>নিশ্চিত করুন আপনার নাম, ঠিকানা, আর ফোন নম্বর যেখানেই দেখা যায় সেখানে মেলে — local সার্চের জন্য SEO কোর্স যে একই NAP ধারাবাহিকতা কভার করে।</li></ul>'),

      h(2, 'শুরুতে অতিরিক্ত বিনিয়োগ করবেন না', 'do-not-over-invest-early'),
      p('<p>নতুন ব্যবসা সাধারণত তারা কী বিক্রি করছে, কার কাছে, বা কীভাবে বর্ণনা করবে তা জানার আগেই পরিচয়ের ডিজাইনে প্রচুর খরচ করে। ব্র‍্যান্ড কাজ করা আর মানুষ কীসে সাড়া দেয় তা খুঁজে পাওয়া থেকে উদ্ভূত হয়।</p><p>একটি স্পষ্ট নাম, একটি সরল ধারাবাহিক দৃশ্যগত চিকিৎসা, আর আপনি সত্যিই বজায় রাখতে পারেন এমন একটি কণ্ঠ শুরু করতে যথেষ্ট। শেখার মতো বাস্তব গ্রাহক থাকলে পরিশীলন অনেক সহজ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'web-analytics',
  sortOrder: 30,
  en: {
    title: 'Web Analytics',
    metaTitle: 'Web Analytics | Learn Computer Academy',
    metaDescription: 'What analytics can tell you across all channels, which numbers matter, and why traffic sources are the most useful report available.',
    blocks: [
      p('<p><b>Analytics</b> records what people do on your site. Its value in marketing is specific: it is the one place where every channel in this course can be compared on the same terms.</p>'),

      h(2, 'The Report That Matters Most'),
      p('<p><b>Traffic sources</b> — often called acquisition — shows where visitors came from, grouped into channels:</p>'),
      table(
        ['Channel', 'Means'],
        [
          ['Organic search', 'Found you through a search engine, unpaid'],
          ['Direct', 'Typed the address or used a bookmark — also where untagged links often land'],
          ['Referral', 'Followed a link from another website'],
          ['Social', 'Came from a social platform'],
          ['Paid', 'Arrived through an advertisement'],
          ['Email', 'Clicked a link in an email you sent'],
        ]
      ),
      p('<p>This is the report that answers "is any of this working?" — and it is the reason all the other numbers become interpretable, since 500 visitors means something different depending on whether you paid for them.</p>'),

      h(2, 'Metrics Worth Understanding'),
      p('<ul><li><b>Users and sessions.</b> People, and visits. One person visiting three times is one user and three sessions.</li><li><b>Engagement.</b> Whether visitors did anything beyond arriving. Modern analytics tools measure this in various ways; the underlying question is the same.</li><li><b>Pages per session.</b> Whether people explored or left immediately.</li><li><b>Conversions.</b> The actions you defined as mattering — the only metric that connects to the business directly.</li><li><b>Landing pages.</b> Which pages people arrive on, which is often not the pages you expect.</li></ul>'),

      callout('warning', '<p>Bounce rate — the share of visits with no further interaction — is widely misread. A high bounce rate on a page that answers a question completely is a success: the visitor got what they needed and left satisfied. Judge it against what the page is <i>for</i>, not against a universal target.</p>'),

      h(2, 'Tag Your Campaign Links'),
      p('<p>Without tagging, analytics guesses where traffic came from, and often guesses wrong — a link clicked in a messaging app or a PDF frequently shows up as "direct".</p><p><b>UTM parameters</b> are labels added to a URL that tell analytics exactly where a click came from:</p>'),
      code('text', 'https://example.com/course?utm_source=facebook&utm_medium=social&utm_campaign=spring-enrolment'),
      p('<p>The three that matter: <code>utm_source</code> (which site), <code>utm_medium</code> (what kind of link), <code>utm_campaign</code> (which campaign). Tag every link you place deliberately — in emails, social posts, and advertisements — and the traffic sources report becomes genuinely accurate instead of approximate.</p>'),

      h(2, 'Set Up Conversions First'),
      p('<p>Analytics with no conversions defined reports activity without outcome. Define the actions that actually matter to you — an enquiry submitted, a purchase, a signup, a call button tapped — before spending time reading anything else.</p>'),

      h(2, 'A Caution About Precision'),
      p('<p>Analytics numbers are estimates, not exact counts. Ad blockers, privacy settings, consent choices, and people switching devices all mean some activity goes unrecorded. Different tools will disagree with each other, and both will disagree with the advertising platforms.</p><p>This is fine as long as you use them for what they are good at: comparing periods, comparing channels, and spotting trends and sudden changes. Treating a number as an exact fact is what leads to bad decisions.</p>'),
    ],
  },
  bn: {
    title: 'ওয়েব Analytics',
    metaTitle: 'ওয়েব Analytics | Learn Computer Academy',
    metaDescription: 'Analytics সব চ্যানেল জুড়ে আপনাকে কী বলতে পারে, কোন সংখ্যা গুরুত্বপূর্ণ, আর ট্রাফিকের উৎস কেন উপলব্ধ সবচেয়ে কাজের রিপোর্ট।',
    blocks: [
      p('<p><b>Analytics</b> নথিভুক্ত করে মানুষ আপনার সাইটে কী করে। মার্কেটিংয়ে এর মূল্য নির্দিষ্ট: এটিই একমাত্র জায়গা যেখানে এই কোর্সের প্রতিটি চ্যানেল একই শর্তে তুলনা করা যায়।</p>'),

      h(2, 'যে রিপোর্ট সবচেয়ে গুরুত্বপূর্ণ', 'the-report-that-matters-most'),
      p('<p><b>ট্রাফিকের উৎস</b> — প্রায়ই acquisition বলা হয় — দেখায় ভিজিটর কোথা থেকে এসেছে, চ্যানেলে দলবদ্ধ:</p>'),
      table(
        ['চ্যানেল', 'যার অর্থ'],
        [
          ['Organic search', 'একটি সার্চ ইঞ্জিনের মাধ্যমে আপনাকে পেয়েছে, বিনামূল্যে'],
          ['Direct', 'ঠিকানা টাইপ করেছে বা একটি বুকমার্ক ব্যবহার করেছে — ট্যাগ না করা লিংকও প্রায়ই এখানে পড়ে'],
          ['Referral', 'অন্য একটি ওয়েবসাইট থেকে একটি লিংক অনুসরণ করেছে'],
          ['Social', 'একটি সোশ্যাল প্ল্যাটফর্ম থেকে এসেছে'],
          ['Paid', 'একটি বিজ্ঞাপনের মাধ্যমে এসেছে'],
          ['Email', 'আপনার পাঠানো একটি ইমেইলে একটি লিংকে ক্লিক করেছে'],
        ]
      ),
      p('<p>এই রিপোর্টটিই "এর কিছু কি কাজ করছে?"-র উত্তর দেয় — আর এই কারণেই অন্য সব সংখ্যা ব্যাখ্যাযোগ্য হয়ে ওঠে, যেহেতু ৫০০ ভিজিটরের অর্থ আপনি তাদের জন্য টাকা দিয়েছেন কিনা তার উপর ভিন্ন।</p>'),

      h(2, 'বোঝার যোগ্য মেট্রিক', 'metrics-worth-understanding'),
      p('<ul><li><b>User আর session।</b> মানুষ, আর ভিজিট। একজন ব্যক্তি তিনবার এলে এটি একজন user আর তিনটি session।</li><li><b>Engagement।</b> ভিজিটর আসার বাইরে কিছু করেছে কিনা। আধুনিক analytics টুল এটি বিভিন্নভাবে মাপে; অন্তর্নিহিত প্রশ্নটি একই।</li><li><b>প্রতি session-এ পাতা।</b> মানুষ ঘুরে দেখেছে নাকি সাথে সাথে চলে গেছে।</li><li><b>Conversion।</b> আপনি যেসব কাজকে গুরুত্বপূর্ণ হিসেবে সংজ্ঞায়িত করেছেন — একমাত্র মেট্রিক যা সরাসরি ব্যবসার সাথে যুক্ত।</li><li><b>Landing পাতা।</b> মানুষ কোন পাতায় আসে, যা প্রায়ই আপনার প্রত্যাশিত পাতা নয়।</li></ul>'),

      callout('warning', '<p>Bounce rate — আর কোনো মিথস্ক্রিয়া ছাড়া ভিজিটের অংশ — ব্যাপকভাবে ভুল পড়া হয়। যে পাতা একটি প্রশ্নের সম্পূর্ণ উত্তর দেয় তাতে একটি উঁচু bounce rate একটি সাফল্য: ভিজিটর যা দরকার ছিল তা পেয়েছে আর সন্তুষ্ট হয়ে চলে গেছে। একটি সর্বজনীন লক্ষ্যের বিপরীতে নয়, পাতাটি <i>কীসের জন্য</i> তার বিপরীতে এটি বিচার করুন।</p>'),

      h(2, 'আপনার Campaign-এর লিংক ট্যাগ করুন', 'tag-your-campaign-links'),
      p('<p>ট্যাগিং ছাড়া, analytics অনুমান করে ট্রাফিক কোথা থেকে এসেছে, আর প্রায়ই ভুল অনুমান করে — একটি মেসেজিং অ্যাপ বা একটি PDF-এ ক্লিক করা একটি লিংক প্রায়ই "direct" হিসেবে দেখা যায়।</p><p><b>UTM প্যারামিটার</b> হলো একটি URL-এ যোগ করা লেবেল যা analytics-কে ঠিক বলে একটি ক্লিক কোথা থেকে এসেছে:</p>'),
      code('text', 'https://example.com/course?utm_source=facebook&utm_medium=social&utm_campaign=spring-enrolment'),
      p('<p>যে তিনটি গুরুত্বপূর্ণ: <code>utm_source</code> (কোন সাইট), <code>utm_medium</code> (কী ধরনের লিংক), <code>utm_campaign</code> (কোন campaign)। আপনার ইচ্ছাকৃতভাবে রাখা প্রতিটি লিংক ট্যাগ করুন — ইমেইলে, সোশ্যাল পোস্টে, আর বিজ্ঞাপনে — আর ট্রাফিকের উৎসের রিপোর্ট আনুমানিকের বদলে সত্যিই সঠিক হয়ে ওঠে।</p>'),

      h(2, 'আগে Conversion সেট আপ করুন', 'set-up-conversions-first'),
      p('<p>কোনো conversion সংজ্ঞায়িত না করা analytics ফলাফল ছাড়া কার্যকলাপ জানায়। আপনার কাছে আসলে যে কাজগুলো গুরুত্বপূর্ণ তা সংজ্ঞায়িত করুন — একটি জিজ্ঞাসা জমা, একটি কেনা, একটি signup, একটি কল বোতামে ট্যাপ — অন্য কিছু পড়তে সময় দেওয়ার আগে।</p>'),

      h(2, 'নির্ভুলতা সম্পর্কে একটি সতর্কতা', 'a-caution-about-precision'),
      p('<p>Analytics-এর সংখ্যা আনুমানিক, সঠিক গণনা নয়। Ad blocker, গোপনীয়তার সেটিং, সম্মতির পছন্দ, আর মানুষের ডিভাইস বদলানো সবই মানে কিছু কার্যকলাপ অনথিভুক্ত থাকে। ভিন্ন টুল একে অপরের সাথে দ্বিমত করবে, আর দুটোই বিজ্ঞাপনের প্ল্যাটফর্মের সাথে দ্বিমত করবে।</p><p>এটি ঠিক আছে যতক্ষণ আপনি সেগুলো যা ভালো তার জন্য ব্যবহার করেন: সময়কাল তুলনা, চ্যানেল তুলনা, আর প্রবণতা আর হঠাৎ পরিবর্তন ধরা। একটি সংখ্যাকে একটি সঠিক তথ্য হিসেবে গণ্য করাই খারাপ সিদ্ধান্তে নিয়ে যায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'goals-and-kpis',
  sortOrder: 31,
  en: {
    title: 'Goals & KPIs',
    metaTitle: 'Marketing Goals and KPIs | Learn Computer Academy',
    metaDescription: 'How to set goals that can actually be measured, which indicators are worth tracking, and how to avoid optimising for the wrong number.',
    blocks: [
      p('<p>Marketing without a defined goal produces activity that cannot be judged. You can always report that posts went out and traffic arrived; whether any of it mattered is a different question, and it requires deciding in advance what mattering would look like.</p>'),

      h(2, 'Make Goals Specific and Measurable'),
      p('<p>"Grow the business" cannot be measured, so it cannot be acted on. Compare:</p>'),
      table(
        ['Vague', 'Usable'],
        [
          ['Get more traffic', 'Increase organic search visits by 30% within six months'],
          ['Improve social media', 'Add 200 email subscribers from social by the end of the quarter'],
          ['Sell more courses', 'Generate 40 enquiries a month for the beginner course'],
          ['Build the brand', 'Publish two useful articles a month and rank on page one for five target phrases'],
        ]
      ),
      p('<p>The usable versions all share three properties: a number, a timeframe, and a way to check. Anything missing one of the three will quietly become unmeasurable.</p>'),

      h(2, 'Leading and Lagging Indicators'),
      p('<p>A <b>lagging</b> indicator reports an outcome after the fact — revenue, customers, enrolments. It is what you actually care about, and it moves slowly and tells you nothing about what to do next.</p><p>A <b>leading</b> indicator moves earlier and predicts the lagging one — email subscribers, enquiries, search impressions, content published. These are the ones you can act on week to week.</p><p>Track both. Only lagging indicators means finding out too late; only leading indicators means being busy without knowing whether it produced anything.</p>'),

      h(2, 'A Small Set of KPIs'),
      p('<p>A <b>KPI</b> is a key performance indicator — the small number of measures you actually watch. The emphasis is on <i>small</i>. A dashboard with forty metrics gets ignored; four or five get looked at.</p><p>A reasonable set for a small business might be: organic search visits, email subscribers, enquiries from all sources, cost per enquiry where advertising is running, and customers. That is enough to see whether the top of the funnel, the middle, and the bottom are all functioning.</p>'),

      callout('warning', '<p>Whatever you measure becomes what people optimise for, including yourself. Choose a KPI badly and you will get exactly it: measure article count and you will get thin articles; measure follower growth and you will get an audience that does not buy; measure traffic and you will get visitors who leave. Pick measures that are hard to improve without doing the real work.</p>', 'The number becomes the goal'),

      h(2, 'Review on the Right Timescale'),
      p('<p>Different things move at different speeds, and reviewing them all weekly produces noise:</p><ul><li><b>Weekly</b> — advertising performance, which changes fast and costs money continuously.</li><li><b>Monthly</b> — traffic, subscribers, enquiries, content output.</li><li><b>Quarterly</b> — whether the strategy is working and what to change.</li></ul><p>Judging SEO or content marketing weekly guarantees a wrong conclusion, because neither moves on that timescale.</p>'),

      h(2, 'Be Willing to Stop Things'),
      p('<p>A goal is also permission to abandon what is not meeting it. Channels that have had a fair trial and produced nothing should be stopped rather than continued out of habit or sunk cost.</p><p>This is the practical purpose of setting goals in advance: it makes that decision an assessment rather than an argument.</p>'),
    ],
  },
  bn: {
    title: 'লক্ষ্য আর KPI',
    metaTitle: 'মার্কেটিং লক্ষ্য আর KPI | Learn Computer Academy',
    metaDescription: 'এমন লক্ষ্য কীভাবে ঠিক করবেন যা সত্যিই মাপা যায়, কোন নির্দেশক ট্র্যাক করার যোগ্য, আর ভুল সংখ্যার জন্য অপ্টিমাইজ করা কীভাবে এড়াবেন।',
    blocks: [
      p('<p>একটি সংজ্ঞায়িত লক্ষ্য ছাড়া মার্কেটিং এমন কার্যকলাপ তৈরি করে যা বিচার করা যায় না। আপনি সবসময় জানাতে পারেন পোস্ট গেছে আর ট্রাফিক এসেছে; এর কিছু গুরুত্বপূর্ণ ছিল কিনা তা একটি ভিন্ন প্রশ্ন, আর এর জন্য আগে থেকে ঠিক করা দরকার গুরুত্বপূর্ণ হওয়া দেখতে কেমন হবে।</p>'),

      h(2, 'লক্ষ্য নির্দিষ্ট আর মাপযোগ্য করুন', 'make-goals-specific-and-measurable'),
      p('<p>"ব্যবসা বাড়ানো" মাপা যায় না, তাই এতে কাজ করা যায় না। তুলনা করুন:</p>'),
      table(
        ['অস্পষ্ট', 'ব্যবহারযোগ্য'],
        [
          ['আরও ট্রাফিক পাওয়া', 'ছয় মাসের মধ্যে organic সার্চ ভিজিট ৩০% বাড়ানো'],
          ['সোশ্যাল মিডিয়া উন্নত করা', 'ত্রৈমাসিকের শেষে সোশ্যাল থেকে ২০০ ইমেইল সাবস্ক্রাইবার যোগ করা'],
          ['আরও কোর্স বিক্রি', 'শিক্ষানবিস কোর্সের জন্য মাসে ৪০টি জিজ্ঞাসা তৈরি করা'],
          ['ব্র‍্যান্ড গড়া', 'মাসে দুটি কাজের প্রবন্ধ প্রকাশ আর পাঁচটি লক্ষ্য বাক্যাংশে প্রথম পাতায় র‍্যাংক করা'],
        ]
      ),
      p('<p>ব্যবহারযোগ্য সংস্করণগুলো তিনটি বৈশিষ্ট্য ভাগ করে: একটি সংখ্যা, একটি সময়সীমা, আর যাচাইয়ের একটি উপায়। তিনটির একটি অনুপস্থিত যেকোনো কিছু চুপচাপ অমাপযোগ্য হয়ে যাবে।</p>'),

      h(2, 'Leading আর Lagging নির্দেশক', 'leading-and-lagging-indicators'),
      p('<p>একটি <b>lagging</b> নির্দেশক ঘটনার পরে একটি ফলাফল জানায় — আয়, গ্রাহক, ভর্তি। এটিই আপনি আসলে যা নিয়ে চিন্তিত, আর এটি ধীরে নড়ে আর এরপর কী করতে হবে সে বিষয়ে আপনাকে কিছুই বলে না।</p><p>একটি <b>leading</b> নির্দেশক আগে নড়ে আর lagging-টির পূর্বাভাস দেয় — ইমেইল সাবস্ক্রাইবার, জিজ্ঞাসা, সার্চ impression, প্রকাশিত কন্টেন্ট। এগুলোতেই আপনি সপ্তাহে সপ্তাহে কাজ করতে পারেন।</p><p>দুটোই ট্র্যাক করুন। শুধু lagging নির্দেশকের অর্থ খুব দেরিতে জানা; শুধু leading নির্দেশকের অর্থ ব্যস্ত থাকা কিন্তু এটি কিছু তৈরি করেছে কিনা না জানা।</p>'),

      h(2, 'KPI-এর একটি ছোট সেট', 'a-small-set-of-kpis'),
      p('<p>একটি <b>KPI</b> হলো একটি key performance indicator — যে অল্প সংখ্যক মাপ আপনি সত্যিই দেখেন। জোরটি <i>ছোট</i>-এর উপর। চল্লিশটি মেট্রিকযুক্ত একটি dashboard উপেক্ষিত হয়; চার-পাঁচটি দেখা হয়।</p><p>একটি ছোট ব্যবসার জন্য একটি যুক্তিসঙ্গত সেট হতে পারে: organic সার্চ ভিজিট, ইমেইল সাবস্ক্রাইবার, সব উৎস থেকে জিজ্ঞাসা, বিজ্ঞাপন চললে প্রতি জিজ্ঞাসায় খরচ, আর গ্রাহক। Funnel-এর উপর, মাঝ, আর নিচ সবগুলো কাজ করছে কিনা দেখতে এটি যথেষ্ট।</p>'),

      callout('warning', '<p>আপনি যা মাপেন তাই হয়ে ওঠে মানুষ যার জন্য অপ্টিমাইজ করে, নিজেসহ। একটি KPI খারাপভাবে বাছুন আর আপনি ঠিক সেটাই পাবেন: প্রবন্ধের সংখ্যা মাপুন আর আপনি পাতলা প্রবন্ধ পাবেন; follower বৃদ্ধি মাপুন আর আপনি এমন দর্শক পাবেন যারা কেনে না; ট্রাফিক মাপুন আর আপনি এমন ভিজিটর পাবেন যারা চলে যায়। এমন মাপ বাছুন যা আসল কাজ না করে উন্নত করা কঠিন।</p>', 'সংখ্যাটিই লক্ষ্য হয়ে ওঠে'),

      h(2, 'সঠিক সময়সীমায় পর্যালোচনা করুন', 'review-on-the-right-timescale'),
      p('<p>ভিন্ন জিনিস ভিন্ন গতিতে নড়ে, আর সবগুলো সাপ্তাহিক পর্যালোচনা করলে শব্দ তৈরি হয়:</p><ul><li><b>সাপ্তাহিক</b> — বিজ্ঞাপনের পারফরম্যান্স, যা দ্রুত বদলায় আর ক্রমাগত টাকা খরচ করায়।</li><li><b>মাসিক</b> — ট্রাফিক, সাবস্ক্রাইবার, জিজ্ঞাসা, কন্টেন্ট output।</li><li><b>ত্রৈমাসিক</b> — কৌশলটি কাজ করছে কিনা আর কী বদলাতে হবে।</li></ul><p>SEO বা কন্টেন্ট মার্কেটিং সাপ্তাহিক বিচার করলে একটি ভুল সিদ্ধান্ত নিশ্চিত, কারণ কোনোটিই সেই সময়সীমায় নড়ে না।</p>'),

      h(2, 'জিনিস থামাতে ইচ্ছুক হন', 'be-willing-to-stop-things'),
      p('<p>একটি লক্ষ্য যা এটি পূরণ করছে না তা ছেড়ে দেওয়ার অনুমতিও। যেসব চ্যানেল একটি ন্যায্য সুযোগ পেয়েছে আর কিছুই তৈরি করেনি সেগুলো অভ্যাস বা ডুবে যাওয়া খরচের কারণে চালিয়ে যাওয়ার বদলে থামানো উচিত।</p><p>আগে থেকে লক্ষ্য ঠিক করার ব্যবহারিক উদ্দেশ্য এটাই: এটি সেই সিদ্ধান্তটিকে একটি তর্কের বদলে একটি মূল্যায়ন করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'where-this-leaves-you',
  sortOrder: 32,
  en: {
    title: 'Where This Leaves You',
    metaTitle: 'Digital Marketing — Where This Leaves You | Learn Computer Academy',
    metaDescription: 'A recap of the course, how the channels fit together, and a realistic order to do things in if you are starting from nothing.',
    blocks: [
      p('<p>This course covered a lot of separate channels. This lesson puts them back together, and suggests an order to work in — because doing everything at once is the most common way of doing none of it properly.</p>'),

      h(2, 'The Ideas That Carried Through'),
      p('<ul><li><b>Own your audience where you can.</b> Your site and your email list are yours; every platform is rented.</li><li><b>Be useful first.</b> Content, email, and social all work on the same trade: give something worth having, earn attention in return.</li><li><b>Match the stage.</b> People at the top of the funnel need something different from people ready to buy, and content aimed only at the bottom reaches almost nobody.</li><li><b>Be specific.</b> Vague claims are invisible because every competitor makes them.</li><li><b>Measure what matters</b>, on a timescale that suits the channel, and be honest about how approximate the numbers are.</li></ul>'),

      h(2, 'How the Channels Fit'),
      p('<p>None of them work well alone, and the way they support each other is fairly consistent:</p><ul><li><b>Content</b> gives every other channel something worth pointing at.</li><li><b>SEO</b> makes that content findable for years, at no cost per visitor.</li><li><b>Social</b> distributes it and keeps you visible, but on rented ground.</li><li><b>Email</b> converts that visibility into an audience you own.</li><li><b>Paid advertising</b> buys speed and reach while the slower channels build.</li><li><b>Analytics</b> tells you which of the above is actually working.</li></ul>'),

      h(2, 'A Realistic Order to Start In'),
      p('<p>If you are starting from very little, roughly this sequence avoids the most wasted effort:</p><ol><li><b>Fix the destination first.</b> A clear website that explains what you do, for whom, and what to do next. Everything else sends people here, and sending traffic to a bad page wastes it.</li><li><b>Set up analytics and define conversions</b>, so that from this point on you can tell what worked.</li><li><b>Start collecting email addresses</b>, even before you have anything to send. The list compounds and cannot be built retroactively.</li><li><b>Publish content consistently</b>, answering real questions. This is slow, so start it early.</li><li><b>Pick one social platform</b> and maintain it properly.</li><li><b>Add paid advertising</b> once you know what message works and where it should land.</li></ol><p>Most people do this in reverse — starting with advertising and social, pointing both at a weak site, with no measurement and no list.</p>'),

      callout('note', '<p>Nothing in this course works quickly except paid advertising, and paid advertising stops working the moment you stop paying. Everything durable is slow. That is not a discouraging fact — it is the reason a competitor cannot buy their way past you overnight either.</p>'),

      h(2, 'Where to Go From Here'),
      table(
        ['Course', 'How it connects'],
        [
          ['<a href="/seo/">SEO</a>', 'The organic search channel in full — 26 lessons on how search engines find, index, and rank pages'],
          ['<a href="/design/">Design</a>', 'Visual fundamentals for the creative this course keeps asking you to produce'],
          ['<a href="/wordpress/">WordPress</a>', 'Building and maintaining the site everything here points at'],
        ]
      ),

      h(2, 'The Most Useful Next Step'),
      p('<p>Pick one channel and one measurable goal, and work on it properly for three months. Marketing knowledge accumulates from watching one thing closely enough to see what actually changed — not from reading about all of it. Everything in this course becomes considerably clearer after you have run one campaign, published a few articles, or sent a few emails and seen what happened.</p>'),
    ],
  },
  bn: {
    title: 'এখান থেকে আপনি কোথায়',
    metaTitle: 'ডিজিটাল মার্কেটিং — এখান থেকে আপনি কোথায় | Learn Computer Academy',
    metaDescription: 'কোর্সের একটি সারসংক্ষেপ, চ্যানেলগুলো কীভাবে একসাথে খাপ খায়, আর শূন্য থেকে শুরু করলে কাজ করার একটি বাস্তবসম্মত ক্রম।',
    blocks: [
      p('<p>এই কোর্স অনেকগুলো আলাদা চ্যানেল কভার করেছে। এই পাঠ সেগুলোকে আবার একত্র করে, আর কাজ করার একটি ক্রম প্রস্তাব করে — কারণ একসাথে সবকিছু করা কোনোটিই ঠিকভাবে না করার সবচেয়ে সাধারণ উপায়।</p>'),

      h(2, 'যে ধারণাগুলো জুড়ে চলেছে', 'the-ideas-that-carried-through'),
      p('<ul><li><b>যেখানে পারেন আপনার দর্শকের মালিক হন।</b> আপনার সাইট আর আপনার ইমেইল তালিকা আপনার; প্রতিটি প্ল্যাটফর্ম ভাড়া করা।</li><li><b>আগে কাজে আসুন।</b> কন্টেন্ট, ইমেইল, আর সোশ্যাল সবই একই বিনিময়ে কাজ করে: রাখার যোগ্য কিছু দিন, বিনিময়ে মনোযোগ অর্জন করুন।</li><li><b>পর্যায়ের সাথে মেলান।</b> Funnel-এর উপরের মানুষের কিনতে প্রস্তুত মানুষের চেয়ে ভিন্ন কিছু দরকার, আর শুধু নিচের দিকে লক্ষ্য করা কন্টেন্ট প্রায় কারো কাছে পৌঁছায় না।</li><li><b>নির্দিষ্ট হন।</b> অস্পষ্ট দাবি অদৃশ্য কারণ প্রতিটি প্রতিযোগী সেগুলো করে।</li><li><b>যা গুরুত্বপূর্ণ তা মাপুন</b>, চ্যানেলের উপযোগী একটি সময়সীমায়, আর সংখ্যাগুলো কতটা আনুমানিক সে বিষয়ে সৎ থাকুন।</li></ul>'),

      h(2, 'চ্যানেলগুলো কীভাবে খাপ খায়', 'how-the-channels-fit'),
      p('<p>সেগুলোর কোনোটিই একা ভালো কাজ করে না, আর সেগুলো একে অপরকে যেভাবে সমর্থন করে তা মোটামুটি ধারাবাহিক:</p><ul><li><b>কন্টেন্ট</b> অন্য প্রতিটি চ্যানেলকে নির্দেশ করার যোগ্য কিছু দেয়।</li><li><b>SEO</b> সেই কন্টেন্টকে বছরের পর বছর খুঁজে পাওয়ার যোগ্য করে, প্রতি ভিজিটরে কোনো খরচ ছাড়াই।</li><li><b>সোশ্যাল</b> এটি বিতরণ করে আর আপনাকে দৃশ্যমান রাখে, কিন্তু ভাড়া করা জমিতে।</li><li><b>ইমেইল</b> সেই দৃশ্যমানতাকে আপনার নিজের একটি দর্শকে রূপান্তর করে।</li><li><b>পেইড বিজ্ঞাপন</b> ধীর চ্যানেলগুলো গড়ে ওঠার সময় গতি আর নাগাল কেনে।</li><li><b>Analytics</b> আপনাকে বলে উপরের কোনটি আসলে কাজ করছে।</li></ul>'),

      h(2, 'শুরু করার একটি বাস্তবসম্মত ক্রম', 'a-realistic-order-to-start-in'),
      p('<p>আপনি যদি খুব কম কিছু থেকে শুরু করছেন, মোটামুটি এই ক্রমটি সবচেয়ে বেশি নষ্ট পরিশ্রম এড়ায়:</p><ol><li><b>আগে গন্তব্য ঠিক করুন।</b> একটি স্পষ্ট ওয়েবসাইট যা ব্যাখ্যা করে আপনি কী করেন, কার জন্য, আর এরপর কী করতে হবে। বাকি সবকিছু মানুষকে এখানে পাঠায়, আর একটি খারাপ পাতায় ট্রাফিক পাঠালে তা নষ্ট হয়।</li><li><b>Analytics সেট আপ করুন আর conversion সংজ্ঞায়িত করুন</b>, যাতে এই বিন্দু থেকে আপনি বলতে পারেন কী কাজ করেছে।</li><li><b>ইমেইল ঠিকানা সংগ্রহ শুরু করুন</b>, পাঠানোর মতো কিছু থাকার আগেও। তালিকা জমে আর পূর্ববর্তীভাবে তৈরি করা যায় না।</li><li><b>ধারাবাহিকভাবে কন্টেন্ট প্রকাশ করুন</b>, বাস্তব প্রশ্নের উত্তর দিয়ে। এটি ধীর, তাই আগেই শুরু করুন।</li><li><b>একটি সোশ্যাল প্ল্যাটফর্ম বাছুন</b> আর সেটি ঠিকভাবে বজায় রাখুন।</li><li><b>পেইড বিজ্ঞাপন যোগ করুন</b> একবার জানলে কোন বার্তা কাজ করে আর এটি কোথায় পৌঁছানো উচিত।</li></ol><p>বেশিরভাগ মানুষ এটি উল্টো করে — বিজ্ঞাপন আর সোশ্যাল দিয়ে শুরু করে, দুটোকেই একটি দুর্বল সাইটের দিকে নির্দেশ করে, কোনো পরিমাপ আর কোনো তালিকা ছাড়া।</p>'),

      callout('note', '<p>পেইড বিজ্ঞাপন ছাড়া এই কোর্সের কিছুই দ্রুত কাজ করে না, আর পেইড বিজ্ঞাপন আপনি টাকা দেওয়া থামানো মাত্র কাজ করা বন্ধ করে। টেকসই সবকিছু ধীর। এটি একটি নিরুৎসাহজনক তথ্য নয় — এই কারণেই একজন প্রতিযোগীও রাতারাতি টাকা দিয়ে আপনাকে পেরিয়ে যেতে পারে না।</p>'),

      h(2, 'এখান থেকে কোথায় যাবেন', 'where-to-go-from-here'),
      table(
        ['কোর্স', 'এটি কীভাবে সংযুক্ত'],
        [
          ['<a href="/bn/seo/">SEO</a>', 'Organic সার্চ চ্যানেল সম্পূর্ণভাবে — সার্চ ইঞ্জিন কীভাবে পাতা খুঁজে পায়, index করে, আর র‍্যাংক করে তা নিয়ে ২৬টি পাঠ'],
          ['<a href="/bn/design/">ডিজাইন</a>', 'এই কোর্স আপনাকে যে creative তৈরি করতে বলতে থাকে তার দৃশ্যগত মূল বিষয়'],
          ['<a href="/bn/wordpress/">WordPress</a>', 'এখানে সবকিছু যে সাইটের দিকে নির্দেশ করে সেটি তৈরি আর রক্ষণাবেক্ষণ'],
        ]
      ),

      h(2, 'সবচেয়ে কাজের পরবর্তী ধাপ', 'the-most-useful-next-step'),
      p('<p>একটি চ্যানেল আর একটি মাপযোগ্য লক্ষ্য বাছুন, আর তিন মাস ঠিকভাবে এতে কাজ করুন। মার্কেটিংয়ের জ্ঞান একটি জিনিসকে যথেষ্ট ঘনিষ্ঠভাবে দেখা থেকে জমে যাতে আসলে কী বদলেছে দেখা যায় — এর সবকিছু নিয়ে পড়া থেকে নয়। একটি campaign চালানো, কয়েকটি প্রবন্ধ প্রকাশ করা, বা কয়েকটি ইমেইল পাঠিয়ে কী হলো দেখার পর এই কোর্সের সবকিছু যথেষ্ট স্পষ্ট হয়ে ওঠে।</p>'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'marketing').single()
  if (catErr || !category) {
    console.error('Category "marketing" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] marketing/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] marketing/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `marketing/${lesson.slug}`
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
