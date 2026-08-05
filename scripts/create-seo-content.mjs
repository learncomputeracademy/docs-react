#!/usr/bin/env node
// New "seo" category — 26 lessons, per the outline approved with the site
// owner 2026-08-05 (docs/CONTENT-PIPELINE.md). The first non-code subject
// on the site: no runnable examples, no Try-It blocks, since there's no
// code to run.
//
// Original content — written fresh for this site (CONTENT-PIPELINE.md §3).
//
// ⚠️ Accuracy note, specific to this subject. SEO writing is full of
// confidently-repeated folklore: exact character limits, invented
// percentages, "200 ranking factors", tactics that stopped working a
// decade ago. Per CONTENT-PIPELINE.md §3 ("never invent facts, verify or
// omit") this course deliberately:
//   - gives no fabricated statistics or made-up percentages
//   - describes pixel-width truncation as approximate, never an exact
//     character count, because that is how it actually works
//   - teaches mechanisms (crawl → index → rank) which are stable, not
//     algorithm specifics which are not published and change constantly
//   - says plainly where something is contested or unknowable, instead of
//     picking a side to sound authoritative
// If a future edit adds a number to this file, it needs a source.
//
// Idempotent — upserts on `path` / `doc_id,locale`. Usage:
//   node scripts/create-seo-content.mjs [--dry-run]

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
    title: 'Introduction to SEO',
    metaTitle: 'Introduction to SEO | Learn Computer Academy',
    metaDescription: 'What search engine optimization actually is, how organic results differ from ads, and why a well-built website can still get no visitors.',
    blocks: [
      p('<p>You can build a fast, well-designed, genuinely useful website and have almost nobody visit it. Building a site and being <i>found</i> are two separate problems. <b>SEO</b> — search engine optimization — is the work of solving the second one.</p>'),

      h(2, 'What SEO Actually Means'),
      p('<p>When someone types a question into a search engine, the engine picks a handful of pages out of billions and puts them in an order. SEO is everything you do to make your pages eligible for that list, and to help them place well in it.</p><p>It is not a trick, and it is not a setting you switch on. It is a collection of ordinary, mostly unglamorous decisions — what your page is about, how it is structured, whether it loads, whether anything links to it — that together determine whether a search engine can understand your page well enough to show it to anyone.</p>'),

      img(
        'docs/img/seo/introduction-1',
        'Diagram showing a search results page with paid ad results marked at the top and organic results below, illustrating the difference between the two',
        1024, 768,
        'Paid results are bought. Organic results are earned — SEO is about the second kind.'
      ),

      h(2, 'Organic vs. Paid Results'),
      p('<p>A search results page usually mixes two very different things.</p>'),
      table(
        ['', 'Organic results', 'Paid results (ads)'],
        [
          ['How you get there', 'Earned — the engine chose your page', 'Bought — you paid for the placement'],
          ['Cost per visitor', 'No direct cost', 'You pay each time someone clicks'],
          ['How fast it works', 'Slow — weeks to months', 'Immediately, as soon as the ad runs'],
          ['What happens when you stop', 'Traffic continues', 'Traffic stops the same day'],
        ]
      ),
      p('<p>This course is entirely about the organic side. Ads are covered separately in the Digital Marketing course.</p>'),

      h(2, 'Why It Is Worth Learning'),
      p('<p>Organic search traffic has a property nothing else does: it compounds and it persists. A page that ranks well keeps bringing visitors months or years after you wrote it, without further spending. That is a very different economic shape from advertising, where traffic stops the moment the budget does.</p><p>It also matters because search is how most people look for things they do not already know about. Someone who already knows your business will type your name. Everyone else types a description of their problem — and whether you appear for that is decided by SEO.</p>'),

      h(2, 'What SEO Cannot Do'),
      p('<p>Being honest about the limits up front saves a lot of wasted effort:</p><ul><li><b>It cannot make a bad page rank.</b> Search engines are trying to satisfy the person searching. A page that does not do that will not hold a position for long, whatever was done to it technically.</li><li><b>It is not instant.</b> Changes take time to be crawled, re-evaluated, and reflected in results. Expecting next-day movement leads people to keep changing things before anything has had a chance to work.</li><li><b>Nobody can guarantee a ranking.</b> The ranking systems are not published, they change constantly, and no one outside the search engine controls them. Anyone promising a specific position is either guessing or lying.</li></ul>'),

      callout('note', '<p>A useful frame for the whole course: search engines are trying to answer a question well. Almost everything that works in SEO works because it helps them do that — and almost everything that stops working was a way of appearing to help while not actually doing so.</p>', 'The one idea to keep'),

      h(2, 'How This Course Is Organised'),
      p('<p>The next lesson covers how search engines actually work, because nearly every later decision follows from that. After that: finding what people search for, the on-page work (titles, headings, content, links), the technical layer (sitemaps, canonicals, structured data, speed), the tools that show you what is happening, and finally the off-page and local dimensions.</p>'),
    ],
  },
  bn: {
    title: 'SEO পরিচিতি',
    metaTitle: 'SEO পরিচিতি | Learn Computer Academy',
    metaDescription: 'সার্চ ইঞ্জিন অপ্টিমাইজেশন আসলে কী, organic ফলাফল বিজ্ঞাপন থেকে কীভাবে আলাদা, আর একটি ভালোভাবে তৈরি ওয়েবসাইটেও কেন কোনো ভিজিটর না আসতে পারে।',
    blocks: [
      p('<p>আপনি একটি দ্রুত, সুন্দর ডিজাইন করা, সত্যিই কাজের ওয়েবসাইট তৈরি করতে পারেন আর তাতে প্রায় কেউই না আসতে পারে। একটি সাইট তৈরি করা আর <i>খুঁজে পাওয়া যাওয়া</i> দুটি আলাদা সমস্যা। <b>SEO</b> — search engine optimization — হলো দ্বিতীয়টি সমাধান করার কাজ।</p>'),

      h(2, 'SEO আসলে কী বোঝায়', 'what-seo-actually-means'),
      p('<p>কেউ যখন একটি সার্চ ইঞ্জিনে একটি প্রশ্ন টাইপ করে, ইঞ্জিনটি কোটি কোটি পাতা থেকে মুষ্টিমেয় কয়েকটি বেছে নিয়ে সেগুলোকে একটি ক্রমে সাজায়। SEO হলো সেই তালিকার জন্য আপনার পাতাগুলোকে যোগ্য করে তুলতে, আর সেগুলোকে তাতে ভালো অবস্থান পেতে সাহায্য করতে আপনি যা কিছু করেন।</p><p>এটি কোনো কৌশল নয়, আর এটি এমন কোনো সেটিং নয় যা আপনি চালু করে দেন। এটি সাধারণ, বেশিরভাগই সাদামাটা সিদ্ধান্তের একটি সংগ্রহ — আপনার পাতাটি কী নিয়ে, এটি কীভাবে গঠিত, এটি লোড হয় কিনা, এতে কিছু লিংক করে কিনা — যা একসাথে নির্ধারণ করে একটি সার্চ ইঞ্জিন আপনার পাতাটি কাউকে দেখানোর মতো যথেষ্ট ভালোভাবে বুঝতে পারে কিনা।</p>'),

      img(
        'docs/img/seo/introduction-1',
        'ডায়াগ্রাম যেখানে একটি সার্চ ফলাফলের পাতা দেখানো হয়েছে, উপরে পেইড বিজ্ঞাপনের ফলাফল চিহ্নিত আর নিচে organic ফলাফল, দুটির মধ্যে পার্থক্য বোঝাচ্ছে',
        1024, 768,
        'পেইড ফলাফল কেনা হয়। Organic ফলাফল অর্জন করা হয় — SEO দ্বিতীয় ধরনটি নিয়ে।'
      ),

      h(2, 'Organic বনাম পেইড ফলাফল', 'organic-vs-paid-results'),
      p('<p>একটি সার্চ ফলাফলের পাতা সাধারণত দুটি খুব আলাদা জিনিস মিশিয়ে দেখায়।</p>'),
      table(
        ['', 'Organic ফলাফল', 'পেইড ফলাফল (বিজ্ঞাপন)'],
        [
          ['কীভাবে সেখানে পৌঁছান', 'অর্জিত — ইঞ্জিন আপনার পাতাটি বেছে নিয়েছে', 'কেনা — আপনি অবস্থানটির জন্য টাকা দিয়েছেন'],
          ['প্রতি ভিজিটরে খরচ', 'কোনো সরাসরি খরচ নেই', 'প্রতিবার কেউ ক্লিক করলে আপনি টাকা দেন'],
          ['কত দ্রুত কাজ করে', 'ধীরে — সপ্তাহ থেকে মাস', 'সাথে সাথে, বিজ্ঞাপন চালু হওয়া মাত্র'],
          ['থামালে কী হয়', 'ট্রাফিক চলতে থাকে', 'ট্রাফিক সেদিনই থেমে যায়'],
        ]
      ),
      p('<p>এই কোর্সটি সম্পূর্ণভাবে organic দিক নিয়ে। বিজ্ঞাপন আলাদাভাবে Digital Marketing কোর্সে কভার করা হয়েছে।</p>'),

      h(2, 'এটি শেখার যোগ্য কেন', 'why-it-is-worth-learning'),
      p('<p>Organic সার্চ ট্রাফিকের এমন একটি বৈশিষ্ট্য আছে যা আর কিছুর নেই: এটি জমতে থাকে আর টিকে থাকে। ভালো র‍্যাংক করা একটি পাতা আপনি লেখার মাস বা বছর পরেও আরও খরচ ছাড়াই ভিজিটর আনতে থাকে। এটি বিজ্ঞাপনের চেয়ে খুব আলাদা একটি অর্থনৈতিক আকৃতি, যেখানে বাজেট শেষ হওয়া মাত্র ট্রাফিক থেমে যায়।</p><p>এটি আরও গুরুত্বপূর্ণ কারণ মানুষ যা আগে থেকে জানে না তা খোঁজার প্রধান উপায় হলো সার্চ। যে ইতিমধ্যে আপনার ব্যবসা চেনে সে আপনার নাম টাইপ করবে। বাকি সবাই তাদের সমস্যার একটি বর্ণনা টাইপ করে — আর তাতে আপনি দেখা যাবেন কিনা তা SEO ঠিক করে।</p>'),

      h(2, 'SEO যা করতে পারে না', 'what-seo-cannot-do'),
      p('<p>শুরুতেই সীমাবদ্ধতা নিয়ে সৎ থাকা অনেক অপচয় বাঁচায়:</p><ul><li><b>এটি একটি খারাপ পাতাকে র‍্যাংক করাতে পারে না।</b> সার্চ ইঞ্জিন যে ব্যক্তি সার্চ করছে তাকে সন্তুষ্ট করার চেষ্টা করছে। যে পাতা সেটি করে না, তা যতই কারিগরিভাবে কিছু করা হোক, বেশিদিন একটি অবস্থান ধরে রাখবে না।</li><li><b>এটি তাৎক্ষণিক নয়।</b> পরিবর্তন crawl হতে, পুনরায় মূল্যায়িত হতে, আর ফলাফলে প্রতিফলিত হতে সময় লাগে। পরদিনই নড়াচড়া আশা করলে মানুষ কিছু কাজ করার সুযোগ পাওয়ার আগেই জিনিস বদলাতে থাকে।</li><li><b>কেউ একটি র‍্যাংকিং নিশ্চিত করতে পারে না।</b> র‍্যাংকিং সিস্টেম প্রকাশিত নয়, সেগুলো ক্রমাগত বদলায়, আর সার্চ ইঞ্জিনের বাইরের কেউ সেগুলো নিয়ন্ত্রণ করে না। যে কেউ একটি নির্দিষ্ট অবস্থানের প্রতিশ্রুতি দিচ্ছে সে হয় অনুমান করছে নয়তো মিথ্যা বলছে।</li></ul>'),

      callout('note', '<p>পুরো কোর্সের জন্য একটি কাজের কাঠামো: সার্চ ইঞ্জিন একটি প্রশ্নের ভালো উত্তর দেওয়ার চেষ্টা করছে। SEO-তে যা কিছু কাজ করে তার প্রায় সবই কাজ করে কারণ এটি তাদের সেটি করতে সাহায্য করে — আর যা কিছু কাজ করা বন্ধ করেছে তার প্রায় সবই ছিল সাহায্য করার ভান করার একটি উপায়, আসলে না করে।</p>', 'যে একটি ধারণা মনে রাখবেন'),

      h(2, 'এই কোর্সটি কীভাবে সাজানো', 'how-this-course-is-organised'),
      p('<p>পরের পাঠ সার্চ ইঞ্জিন আসলে কীভাবে কাজ করে তা কভার করে, কারণ পরবর্তী প্রায় প্রতিটি সিদ্ধান্ত সেখান থেকেই আসে। তারপর: মানুষ কী সার্চ করে তা খুঁজে বের করা, on-page কাজ (title, heading, কন্টেন্ট, লিংক), কারিগরি স্তর (sitemap, canonical, structured data, গতি), কী ঘটছে তা দেখানো টুলগুলো, আর শেষে off-page আর local দিক।</p>'),
    ],
  },
})

lessons.push({
  slug: 'how-search-engines-work',
  sortOrder: 2,
  en: {
    title: 'How Search Engines Work',
    metaTitle: 'How Search Engines Work | Learn Computer Academy',
    metaDescription: 'Crawling, indexing, and ranking are three separate stages — understanding where a page is stuck is the foundation of every SEO decision.',
    blocks: [
      p('<p>Almost every SEO problem is really a problem at one of three stages. A search engine has to <b>find</b> your page, <b>store and understand</b> it, and then <b>choose</b> it for a particular search. These are separate steps, and a page can fail at any one of them for completely different reasons.</p>'),

      img(
        'docs/img/seo/how-search-engines-work-1',
        'Diagram showing the three stages of search: a crawler following links to discover pages, an index storing and organising them, and a ranking stage ordering results for a query',
        1024, 768,
        'Crawling, indexing, and ranking are three separate stages — a page can fail at any one.'
      ),

      h(2, 'Stage 1 — Crawling'),
      p('<p>Search engines run programs, usually called <b>crawlers</b> or <b>spiders</b>, that move around the web following links. A crawler arrives at a page, reads it, notes every link on it, and adds those links to a list of pages to visit later. Repeated at enormous scale, this is how a search engine discovers what exists.</p><p>The practical consequence: <b>a page nothing links to is very hard to discover.</b> If a page is not linked from anywhere — not from your own navigation, not from another page, not from a sitemap — a crawler has no path to it and may never find it.</p>'),

      h(2, 'Stage 2 — Indexing'),
      p('<p>Finding a page is not the same as storing it. After crawling, the engine tries to work out what the page is about — its topic, its content, its language, how it relates to other pages — and stores that in a giant database called the <b>index</b>. Only pages in the index can appear in results.</p><p>A page can be crawled and still not indexed. Common reasons: the engine judged it too thin to be worth storing, it is a near-duplicate of another page, or the page explicitly asked not to be indexed.</p>'),

      callout('warning', '<p>This distinction matters more than almost anything else in this course. "Google visited my page" and "Google will show my page" are different claims. Search Console (covered later) reports them separately, and confusing the two sends people fixing the wrong problem.</p>', 'Crawled is not indexed'),

      h(2, 'Stage 3 — Ranking'),
      p('<p>When someone searches, the engine looks through its index for pages that could answer the query, and puts them in an order. That ordering is what people mean by <b>ranking</b>.</p><p>The systems that decide the order are not published, and they change frequently. What is publicly known is broad: engines weigh how well the content matches what the person seems to want, signals of quality and trustworthiness, whether the page works well on the device being used, and how other sites reference it. Anyone claiming to know the precise formula does not.</p>'),

      h(2, 'Why This Order Matters'),
      p('<p>Because the stages are sequential, the fix for "my page is not showing up" depends entirely on where it stopped:</p>'),
      table(
        ['Where it stopped', 'What that means', 'Where to look'],
        [
          ['Never crawled', 'The engine has no path to the page', 'Internal links, sitemap, robots.txt'],
          ['Crawled, not indexed', 'Found, but not judged worth storing', 'Content quality, duplication, noindex tags'],
          ['Indexed, ranks poorly', 'Stored, but losing to other pages', 'Relevance, content depth, links, speed'],
        ]
      ),
      p('<p>Working on content quality when the real problem is a blocked crawler achieves nothing. Later lessons cover the tools that tell you which stage you are actually stuck at.</p>'),

      h(2, 'A Note on "Real Time"'),
      p('<p>None of this happens the moment you press publish. A new page has to be discovered, queued, crawled, evaluated, and indexed, and then compete for position — a process measured in days or weeks, not minutes. There are ways to nudge discovery along, covered later in this course, but nothing makes the whole pipeline instant.</p>'),
    ],
  },
  bn: {
    title: 'সার্চ ইঞ্জিন কীভাবে কাজ করে',
    metaTitle: 'সার্চ ইঞ্জিন কীভাবে কাজ করে | Learn Computer Academy',
    metaDescription: 'Crawling, indexing, আর ranking তিনটি আলাদা পর্যায় — একটি পাতা কোথায় আটকে আছে তা বোঝাই প্রতিটি SEO সিদ্ধান্তের ভিত্তি।',
    blocks: [
      p('<p>প্রায় প্রতিটি SEO সমস্যা আসলে তিনটি পর্যায়ের একটিতে সমস্যা। একটি সার্চ ইঞ্জিনকে আপনার পাতা <b>খুঁজে পেতে</b> হয়, সেটি <b>সংরক্ষণ ও বুঝতে</b> হয়, আর তারপর একটি নির্দিষ্ট সার্চের জন্য সেটি <b>বেছে নিতে</b> হয়। এগুলো আলাদা ধাপ, আর একটি পাতা সম্পূর্ণ ভিন্ন কারণে যেকোনো একটিতে ব্যর্থ হতে পারে।</p>'),

      img(
        'docs/img/seo/how-search-engines-work-1',
        'ডায়াগ্রাম যেখানে সার্চের তিনটি পর্যায় দেখানো হয়েছে: একটি crawler লিংক অনুসরণ করে পাতা আবিষ্কার করছে, একটি index সেগুলো সংরক্ষণ ও সাজাচ্ছে, আর একটি ranking পর্যায় একটি query-র জন্য ফলাফল ক্রমে সাজাচ্ছে',
        1024, 768,
        'Crawling, indexing, আর ranking তিনটি আলাদা পর্যায় — একটি পাতা যেকোনো একটিতে ব্যর্থ হতে পারে।'
      ),

      h(2, 'পর্যায় ১ — Crawling', 'stage-1-crawling'),
      p('<p>সার্চ ইঞ্জিন এমন প্রোগ্রাম চালায়, সাধারণত <b>crawler</b> বা <b>spider</b> বলা হয়, যা লিংক অনুসরণ করে ওয়েবে ঘুরে বেড়ায়। একটি crawler একটি পাতায় পৌঁছায়, সেটি পড়ে, তাতে থাকা প্রতিটি লিংক নোট করে, আর সেই লিংকগুলো পরে দেখার জন্য একটি তালিকায় যোগ করে। বিশাল মাপে পুনরাবৃত্তি করে, এভাবেই একটি সার্চ ইঞ্জিন কী কী আছে তা আবিষ্কার করে।</p><p>ব্যবহারিক পরিণতি: <b>যে পাতায় কিছুই লিংক করে না তা খুঁজে পাওয়া খুব কঠিন।</b> একটি পাতা যদি কোথাও থেকে লিংক করা না থাকে — আপনার নিজের navigation থেকে নয়, অন্য একটি পাতা থেকে নয়, একটি sitemap থেকে নয় — একটি crawler-এর সেখানে যাওয়ার কোনো পথ নেই আর এটি কখনো সেটি খুঁজে না-ও পেতে পারে।</p>'),

      h(2, 'পর্যায় ২ — Indexing', 'stage-2-indexing'),
      p('<p>একটি পাতা খুঁজে পাওয়া আর সেটি সংরক্ষণ করা এক নয়। Crawl করার পর, ইঞ্জিন বোঝার চেষ্টা করে পাতাটি কী নিয়ে — এর বিষয়, এর কন্টেন্ট, এর ভাষা, এটি অন্য পাতার সাথে কীভাবে সম্পর্কিত — আর সেটি <b>index</b> নামের একটি বিশাল ডেটাবেসে সংরক্ষণ করে। শুধু index-এ থাকা পাতাই ফলাফলে দেখা যেতে পারে।</p><p>একটি পাতা crawl হয়েও index না হতে পারে। সাধারণ কারণ: ইঞ্জিন সেটিকে সংরক্ষণের যোগ্য হওয়ার মতো যথেষ্ট নয় বলে বিচার করেছে, এটি অন্য একটি পাতার প্রায়-হুবহু নকল, অথবা পাতাটি স্পষ্টভাবে index না হওয়ার অনুরোধ করেছে।</p>'),

      callout('warning', '<p>এই পার্থক্যটি এই কোর্সের প্রায় অন্য যেকোনো কিছুর চেয়ে বেশি গুরুত্বপূর্ণ। "Google আমার পাতায় এসেছে" আর "Google আমার পাতা দেখাবে" আলাদা দাবি। Search Console (পরে কভার করা হয়েছে) সেগুলো আলাদাভাবে জানায়, আর দুটি গুলিয়ে ফেললে মানুষ ভুল সমস্যা ঠিক করতে চলে যায়।</p>', 'Crawl হওয়া মানে index হওয়া নয়'),

      h(2, 'পর্যায় ৩ — Ranking', 'stage-3-ranking'),
      p('<p>কেউ সার্চ করলে, ইঞ্জিন তার index-এ এমন পাতা খোঁজে যা query-র উত্তর দিতে পারে, আর সেগুলোকে একটি ক্রমে সাজায়। সেই ক্রম সাজানোকেই মানুষ <b>ranking</b> বলে।</p><p>যে সিস্টেমগুলো ক্রম ঠিক করে সেগুলো প্রকাশিত নয়, আর সেগুলো ঘন ঘন বদলায়। প্রকাশ্যে যা জানা তা ব্যাপক: ইঞ্জিন বিবেচনা করে কন্টেন্টটি ব্যক্তিটি যা চাইছে বলে মনে হয় তার সাথে কতটা মেলে, গুণমান আর নির্ভরযোগ্যতার সংকেত, ব্যবহৃত ডিভাইসে পাতাটি ভালো কাজ করে কিনা, আর অন্য সাইট এটিকে কীভাবে উল্লেখ করে। যে কেউ সঠিক সূত্র জানার দাবি করছে সে জানে না।</p>'),

      h(2, 'এই ক্রম কেন গুরুত্বপূর্ণ', 'why-this-order-matters'),
      p('<p>পর্যায়গুলো ক্রমিক হওয়ায়, "আমার পাতা দেখা যাচ্ছে না"-এর সমাধান সম্পূর্ণভাবে নির্ভর করে এটি কোথায় থেমেছে তার উপর:</p>'),
      table(
        ['কোথায় থেমেছে', 'এর অর্থ কী', 'কোথায় দেখবেন'],
        [
          ['কখনো crawl হয়নি', 'ইঞ্জিনের পাতাটিতে যাওয়ার কোনো পথ নেই', 'Internal লিংক, sitemap, robots.txt'],
          ['Crawl হয়েছে, index হয়নি', 'পাওয়া গেছে, কিন্তু সংরক্ষণের যোগ্য বিচার হয়নি', 'কন্টেন্টের গুণমান, নকল, noindex ট্যাগ'],
          ['Index হয়েছে, খারাপ র‍্যাংক', 'সংরক্ষিত, কিন্তু অন্য পাতার কাছে হারছে', 'প্রাসঙ্গিকতা, কন্টেন্টের গভীরতা, লিংক, গতি'],
        ]
      ),
      p('<p>আসল সমস্যা যখন একটি ব্লক করা crawler, তখন কন্টেন্টের গুণমান নিয়ে কাজ করে কিছুই হয় না। পরের পাঠগুলো সেই টুলগুলো কভার করে যা আপনাকে বলে আপনি আসলে কোন পর্যায়ে আটকে আছেন।</p>'),

      h(2, '"রিয়েল টাইম" সম্পর্কে একটি নোট', 'a-note-on-real-time'),
      p('<p>আপনি publish চাপা মাত্র এর কিছুই ঘটে না। একটি নতুন পাতাকে আবিষ্কৃত হতে, সারিতে যেতে, crawl হতে, মূল্যায়িত হতে, আর index হতে হয়, তারপর অবস্থানের জন্য প্রতিযোগিতা করতে হয় — একটি প্রক্রিয়া যা মিনিটে নয়, দিন বা সপ্তাহে মাপা হয়। আবিষ্কারকে একটু এগিয়ে দেওয়ার উপায় আছে, এই কোর্সে পরে কভার করা হয়েছে, কিন্তু কিছুই পুরো পাইপলাইনটিকে তাৎক্ষণিক করে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'keyword-research',
  sortOrder: 3,
  en: {
    title: 'Keyword Research',
    metaTitle: 'Keyword Research for SEO | Learn Computer Academy',
    metaDescription: 'How to find the words people actually type into search engines, and how to judge which of those are worth writing for.',
    blocks: [
      p('<p>The words you would naturally use to describe what you do are frequently not the words your audience types into a search box. <b>Keyword research</b> is the work of closing that gap — finding the actual phrases people search for, and deciding which ones you can realistically compete for.</p>'),

      h(2, 'Why Guessing Fails'),
      p('<p>People inside a field use its vocabulary. People outside it describe symptoms. A repair shop might think of itself as offering "laptop hardware diagnostics"; the person who needs it searches "laptop not turning on". Both describe the same service. Only one matches what gets typed.</p><p>This is the core reason keyword research exists as a separate activity from writing. You are not looking for the most accurate description of your work — you are looking for the description your audience already uses.</p>'),

      h(2, 'Where to Find Real Search Terms'),
      p('<ul><li><b>The search box itself.</b> Start typing a phrase and the engine suggests completions. Those suggestions come from real searches.</li><li><b>Related searches.</b> Most results pages list related queries at the bottom, and often a "people also ask" block. Both are free, direct evidence of what else people want to know.</li><li><b>Google Search Console.</b> Once your site has any traffic, it reports the actual queries that brought people to you — including ones you never thought to target. This is the highest-quality source available, because it is your own data. Covered properly in its own lesson later.</li><li><b>Your customers and their questions.</b> Support emails, comments, and the questions people ask in person are all phrased the way real people phrase things.</li><li><b>Dedicated keyword tools.</b> Google\'s own Keyword Planner and various third-party tools give volume and competition estimates. Useful, but not a prerequisite to starting.</li></ul>'),

      img(
        'docs/img/seo/keyword-research-1',
        'Diagram showing a broad head term at the top branching into progressively longer and more specific long-tail search phrases below it',
        1024, 768,
        'Broad terms get more searches but are far harder to rank for; specific phrases convert better.'
      ),

      h(2, 'Head Terms vs. Long-Tail'),
      table(
        ['', 'Head terms', 'Long-tail'],
        [
          ['Example', '"laptop"', '"laptop not turning on after power cut"'],
          ['Search volume', 'High', 'Low individually'],
          ['Competition', 'Very high', 'Much lower'],
          ['Clarity of intent', 'Vague — impossible to tell what they want', 'Very clear'],
          ['Realistic for a new site', 'No', 'Yes'],
        ]
      ),
      p('<p>Long-tail phrases each bring fewer visitors, but there are vastly more of them, they are far easier to rank for, and the people typing them know exactly what they want. For a new site, they are essentially the only viable starting point — competing head-on for a one-word term against established sites is not a winnable fight early on.</p>'),

      h(2, 'Judging Whether a Keyword Is Worth It'),
      p('<p>Three questions, in this order:</p><ol><li><b>Can I genuinely serve this search?</b> If someone searching that phrase would not be well served by a page you can honestly write, stop here regardless of the numbers.</li><li><b>Who currently ranks for it?</b> Search the phrase and look. If the first page is entirely large, established, authoritative sites, a new site is unlikely to break in soon. If it is a mix, including smaller sites and forum threads, there is room.</li><li><b>Is there enough demand to matter?</b> A phrase nobody searches will not bring traffic no matter how well you rank. Tools give estimates here — treat them as rough indicators, not precise figures.</li></ol>'),

      callout('tip', '<p>Looking at who currently ranks is more informative than any volume number, and it costs nothing. A results page full of thin, outdated pages is an opportunity. A results page full of thorough, recently-updated pages from established sites is a warning.</p>', 'The cheapest useful check'),

      h(2, 'One Page, One Primary Topic'),
      p('<p>A common early mistake is trying to make one page rank for many unrelated phrases. It usually results in a page that serves none of them well. The more effective pattern is one page per topic, targeting one primary phrase plus the closely-related variations that naturally belong with it.</p><p>If two phrases would genuinely need different content to answer well, they are two pages. If they are different ways of asking the same question, they are one.</p>'),

      callout('warning', '<p>Repeating a phrase over and over to seem more relevant — <b>keyword stuffing</b> — does not work and has not for a very long time. Search engines detect it, and it makes pages unpleasant to read. Write the phrase naturally where it belongs, then stop thinking about it.</p>', 'Do not stuff'),
    ],
  },
  bn: {
    title: 'Keyword Research',
    metaTitle: 'SEO-র জন্য Keyword Research | Learn Computer Academy',
    metaDescription: 'মানুষ আসলে সার্চ ইঞ্জিনে যে শব্দগুলো টাইপ করে তা কীভাবে খুঁজে বের করবেন, আর সেগুলোর মধ্যে কোনটির জন্য লেখা সার্থক তা কীভাবে বিচার করবেন।',
    blocks: [
      p('<p>আপনি যা করেন তা বর্ণনা করতে আপনি স্বাভাবিকভাবে যে শব্দ ব্যবহার করবেন, তা প্রায়ই আপনার দর্শক সার্চ বক্সে যে শব্দ টাইপ করে তা নয়। <b>Keyword research</b> হলো সেই ব্যবধান কমানোর কাজ — মানুষ আসলে যে বাক্যাংশ সার্চ করে তা খুঁজে বের করা, আর কোনগুলোর জন্য আপনি বাস্তবসম্মতভাবে প্রতিযোগিতা করতে পারেন তা ঠিক করা।</p>'),

      h(2, 'অনুমান কেন ব্যর্থ হয়', 'why-guessing-fails'),
      p('<p>একটি ক্ষেত্রের ভেতরের মানুষ তার পরিভাষা ব্যবহার করে। বাইরের মানুষ লক্ষণ বর্ণনা করে। একটি মেরামতের দোকান নিজেকে "laptop hardware diagnostics" দেওয়া হিসেবে ভাবতে পারে; যার এটি দরকার সে সার্চ করে "laptop not turning on"। দুটোই একই সেবা বর্ণনা করে। শুধু একটি যা টাইপ করা হয় তার সাথে মেলে।</p><p>লেখা থেকে আলাদা একটি কাজ হিসেবে keyword research কেন আছে তার মূল কারণ এটাই। আপনি আপনার কাজের সবচেয়ে সঠিক বর্ণনা খুঁজছেন না — আপনি আপনার দর্শক ইতিমধ্যে যে বর্ণনা ব্যবহার করে তা খুঁজছেন।</p>'),

      h(2, 'আসল সার্চ টার্ম কোথায় পাবেন', 'where-to-find-real-search-terms'),
      p('<ul><li><b>সার্চ বক্স নিজেই।</b> একটি বাক্যাংশ টাইপ করা শুরু করুন আর ইঞ্জিন সম্পূর্ণ রূপ প্রস্তাব করে। সেই প্রস্তাবগুলো আসল সার্চ থেকে আসে।</li><li><b>সম্পর্কিত সার্চ।</b> বেশিরভাগ ফলাফলের পাতা নিচে সম্পর্কিত query তালিকাভুক্ত করে, আর প্রায়ই একটি "people also ask" ব্লক থাকে। দুটোই বিনামূল্যে, মানুষ আর কী জানতে চায় তার সরাসরি প্রমাণ।</li><li><b>Google Search Console।</b> আপনার সাইটে কিছু ট্রাফিক আসা শুরু হলে, এটি জানায় আসলে কোন query মানুষকে আপনার কাছে এনেছে — যেগুলোর কথা আপনি কখনো ভাবেননি সেগুলোসহ। এটি সবচেয়ে উঁচু মানের উৎস, কারণ এটি আপনার নিজের ডেটা। পরে নিজস্ব একটি পাঠে ভালোভাবে কভার করা হয়েছে।</li><li><b>আপনার গ্রাহক আর তাদের প্রশ্ন।</b> সাপোর্ট ইমেইল, মন্তব্য, আর মানুষ সামনাসামনি যে প্রশ্ন করে সবই আসল মানুষ যেভাবে বলে সেভাবে বলা।</li><li><b>নির্দিষ্ট keyword টুল।</b> Google-এর নিজস্ব Keyword Planner আর বিভিন্ন থার্ড-পার্টি টুল ভলিউম আর প্রতিযোগিতার আনুমানিক হিসাব দেয়। কাজের, কিন্তু শুরু করার পূর্বশর্ত নয়।</li></ul>'),

      img(
        'docs/img/seo/keyword-research-1',
        'ডায়াগ্রাম যেখানে উপরে একটি বিস্তৃত head term ক্রমে নিচে আরও দীর্ঘ আর নির্দিষ্ট long-tail সার্চ বাক্যাংশে শাখা বিস্তার করছে',
        1024, 768,
        'বিস্তৃত টার্মে বেশি সার্চ হয় কিন্তু র‍্যাংক করা অনেক কঠিন; নির্দিষ্ট বাক্যাংশ ভালো রূপান্তর করে।'
      ),

      h(2, 'Head Term বনাম Long-Tail', 'head-terms-vs-long-tail'),
      table(
        ['', 'Head term', 'Long-tail'],
        [
          ['উদাহরণ', '"laptop"', '"laptop not turning on after power cut"'],
          ['সার্চ ভলিউম', 'বেশি', 'আলাদাভাবে কম'],
          ['প্রতিযোগিতা', 'খুব বেশি', 'অনেক কম'],
          ['উদ্দেশ্যের স্পষ্টতা', 'অস্পষ্ট — তারা কী চায় বলা অসম্ভব', 'খুব স্পষ্ট'],
          ['নতুন সাইটের জন্য বাস্তবসম্মত', 'না', 'হ্যাঁ'],
        ]
      ),
      p('<p>Long-tail বাক্যাংশ প্রতিটি কম ভিজিটর আনে, কিন্তু সেগুলো অনেক বেশি সংখ্যায় আছে, সেগুলোতে র‍্যাংক করা অনেক সহজ, আর যারা সেগুলো টাইপ করে তারা ঠিক জানে তারা কী চায়। একটি নতুন সাইটের জন্য, সেগুলোই মূলত একমাত্র কার্যকর শুরুর বিন্দু — প্রতিষ্ঠিত সাইটের বিরুদ্ধে একটি এক-শব্দের টার্মের জন্য সরাসরি প্রতিযোগিতা শুরুতে জেতার মতো লড়াই নয়।</p>'),

      h(2, 'একটি Keyword সার্থক কিনা বিচার করা', 'judging-whether-a-keyword-is-worth-it'),
      p('<p>তিনটি প্রশ্ন, এই ক্রমে:</p><ol><li><b>আমি কি সত্যিই এই সার্চের সেবা দিতে পারি?</b> সেই বাক্যাংশ সার্চ করা কেউ যদি আপনি সৎভাবে লিখতে পারেন এমন একটি পাতা দিয়ে ভালোভাবে সেবা না পায়, সংখ্যা যাই হোক এখানেই থামুন।</li><li><b>এখন এতে কারা র‍্যাংক করছে?</b> বাক্যাংশটি সার্চ করে দেখুন। প্রথম পাতা যদি সম্পূর্ণভাবে বড়, প্রতিষ্ঠিত, কর্তৃত্বসম্পন্ন সাইটে ভরা হয়, একটি নতুন সাইটের শীঘ্রই ঢোকার সম্ভাবনা কম। এটি যদি মিশ্র হয়, ছোট সাইট আর ফোরাম থ্রেডসহ, তাহলে জায়গা আছে।</li><li><b>যথেষ্ট চাহিদা আছে কি?</b> যে বাক্যাংশ কেউ সার্চ করে না তা আপনি যত ভালোই র‍্যাংক করুন ট্রাফিক আনবে না। টুল এখানে আনুমানিক হিসাব দেয় — সেগুলোকে মোটামুটি ইঙ্গিত হিসেবে নিন, নির্ভুল সংখ্যা হিসেবে নয়।</li></ol>'),

      callout('tip', '<p>এখন কারা র‍্যাংক করছে তা দেখা যেকোনো ভলিউম সংখ্যার চেয়ে বেশি তথ্যবহুল, আর এতে কোনো খরচ নেই। পাতলা, পুরোনো পাতায় ভরা একটি ফলাফলের পাতা একটি সুযোগ। প্রতিষ্ঠিত সাইটের পুঙ্খানুপুঙ্খ, সম্প্রতি আপডেট করা পাতায় ভরা একটি ফলাফলের পাতা একটি সতর্কবার্তা।</p>', 'সবচেয়ে সস্তা কাজের যাচাই'),

      h(2, 'এক পাতা, এক মূল বিষয়', 'one-page-one-primary-topic'),
      p('<p>একটি সাধারণ প্রাথমিক ভুল হলো একটি পাতাকে অনেক অসম্পর্কিত বাক্যাংশে র‍্যাংক করানোর চেষ্টা করা। এর ফলে সাধারণত এমন একটি পাতা হয় যা কোনোটিরই ভালো সেবা দেয় না। বেশি কার্যকর প্যাটার্ন হলো প্রতি বিষয়ে একটি পাতা, একটি মূল বাক্যাংশ আর স্বাভাবিকভাবে এর সাথে যায় এমন ঘনিষ্ঠ সম্পর্কিত রূপভেদ লক্ষ্য করে।</p><p>দুটি বাক্যাংশের যদি ভালো উত্তর দিতে সত্যিই ভিন্ন কন্টেন্ট লাগে, সেগুলো দুটি পাতা। সেগুলো যদি একই প্রশ্ন জিজ্ঞাসার ভিন্ন উপায় হয়, সেগুলো একটি।</p>'),

      callout('warning', '<p>বেশি প্রাসঙ্গিক মনে হতে একটি বাক্যাংশ বারবার পুনরাবৃত্তি করা — <b>keyword stuffing</b> — কাজ করে না আর অনেক আগে থেকেই করে না। সার্চ ইঞ্জিন এটি ধরে ফেলে, আর এটি পাতাগুলো পড়তে অপ্রীতিকর করে তোলে। বাক্যাংশটি যেখানে যায় সেখানে স্বাভাবিকভাবে লিখুন, তারপর সেটি নিয়ে ভাবা বন্ধ করুন।</p>', 'Stuff করবেন না'),
    ],
  },
})

lessons.push({
  slug: 'search-intent',
  sortOrder: 4,
  en: {
    title: 'Search Intent',
    metaTitle: 'Search Intent in SEO | Learn Computer Academy',
    metaDescription: 'The four kinds of thing people want when they search, and why matching intent matters more than matching keywords.',
    blocks: [
      p('<p>Two people can type nearly the same words and want completely different things. <b>Search intent</b> is what the person is actually trying to accomplish — and matching it is more important than matching the keyword itself.</p>'),

      h(2, 'The Four Kinds of Intent'),
      table(
        ['Intent', 'The person wants to…', 'Example search'],
        [
          ['<b>Informational</b>', 'Learn or understand something', '"what is a solid state drive"'],
          ['<b>Navigational</b>', 'Get to a specific site or page', '"gmail login"'],
          ['<b>Commercial</b>', 'Compare options before deciding', '"best budget laptop for students"'],
          ['<b>Transactional</b>', 'Do or buy something now', '"buy 16gb ram online"'],
        ]
      ),
      p('<p>The boundaries are not always sharp, and a single search can sit between two. The categories are useful as a way of asking "what does this person want to happen next?", not as a rigid taxonomy.</p>'),

      h(2, 'Why Intent Beats Keywords'),
      p('<p>Suppose you sell laptops and you write a product page targeting "how to choose a laptop". You have matched the words. But someone searching that phrase is trying to <i>learn</i>, not to buy right now — they are at the informational stage. A product page answers a question they have not asked yet, so they leave, and the engine notices that this page does not satisfy this search.</p><p>The same keyword served with a genuine guide — one that explains what actually matters and helps them decide — matches the intent. That page can rank, hold its position, and still send interested people toward your products afterward.</p>'),

      img(
        'docs/img/seo/search-intent-1',
        'Diagram showing four labelled paths from a search box, each leading to a different kind of page: an article, a homepage, a comparison list, and a product page',
        1024, 768,
        'The same topic needs a different kind of page depending on what the searcher is trying to do.'
      ),

      h(2, 'How to Find the Intent Behind a Search'),
      p('<p>The most reliable method costs nothing: <b>search the phrase and look at what already ranks.</b> Search engines have enormous amounts of data about which results satisfy which queries, and the page they return is their answer to "what does this person want".</p><ul><li>Results are mostly articles and guides → informational.</li><li>Results are mostly product or category pages → transactional.</li><li>Results are mostly "best X" and comparison lists → commercial.</li><li>Results are dominated by one brand\'s own pages → navigational.</li></ul><p>If every result on page one is a listicle and you were planning a product page, that is the search telling you what kind of page it wants.</p>'),

      callout('tip', '<p>This check also tells you the expected <i>format</i>, not just the type — whether results are long guides or short answers, whether they include video, whether they are step-by-step. Matching the format that already wins is a much smaller leap than inventing a new one.</p>'),

      h(2, 'Intent and the Buying Journey'),
      p('<p>Intent types roughly track how close someone is to acting. Informational searches sit early — the person is defining their problem. Commercial searches sit in the middle — they have decided to act and are comparing. Transactional searches sit at the end.</p><p>Content aimed only at the last stage misses everyone still working out what they need, which is most people at any given moment. Content aimed only at the first stage attracts readers who never convert. A healthy site has pages at more than one stage, and links between them.</p>'),
    ],
  },
  bn: {
    title: 'Search Intent',
    metaTitle: 'SEO-তে Search Intent | Learn Computer Academy',
    metaDescription: 'মানুষ সার্চ করার সময় চার ধরনের যা চায়, আর keyword মেলানোর চেয়ে intent মেলানো কেন বেশি গুরুত্বপূর্ণ।',
    blocks: [
      p('<p>দুজন মানুষ প্রায় একই শব্দ টাইপ করে সম্পূর্ণ ভিন্ন জিনিস চাইতে পারে। <b>Search intent</b> হলো ব্যক্তিটি আসলে কী অর্জন করার চেষ্টা করছে — আর সেটি মেলানো keyword নিজে মেলানোর চেয়ে বেশি গুরুত্বপূর্ণ।</p>'),

      h(2, 'চার ধরনের Intent', 'the-four-kinds-of-intent'),
      table(
        ['Intent', 'ব্যক্তিটি চায়…', 'উদাহরণ সার্চ'],
        [
          ['<b>Informational</b>', 'কিছু শিখতে বা বুঝতে', '"what is a solid state drive"'],
          ['<b>Navigational</b>', 'একটি নির্দিষ্ট সাইট বা পাতায় যেতে', '"gmail login"'],
          ['<b>Commercial</b>', 'সিদ্ধান্তের আগে বিকল্প তুলনা করতে', '"best budget laptop for students"'],
          ['<b>Transactional</b>', 'এখনই কিছু করতে বা কিনতে', '"buy 16gb ram online"'],
        ]
      ),
      p('<p>সীমানা সবসময় স্পষ্ট নয়, আর একটি একক সার্চ দুটির মাঝে থাকতে পারে। শ্রেণীগুলো "এই ব্যক্তিটি এরপর কী ঘটাতে চায়?" জিজ্ঞাসার একটি উপায় হিসেবে কাজের, একটি কঠোর শ্রেণীবিন্যাস হিসেবে নয়।</p>'),

      h(2, 'Intent কেন Keyword-কে হারায়', 'why-intent-beats-keywords'),
      p('<p>ধরুন আপনি ল্যাপটপ বিক্রি করেন আর "how to choose a laptop" লক্ষ্য করে একটি পণ্যের পাতা লিখলেন। আপনি শব্দগুলো মিলিয়েছেন। কিন্তু সেই বাক্যাংশ সার্চ করা কেউ <i>শেখার</i> চেষ্টা করছে, এখনই কেনার নয় — তারা informational পর্যায়ে আছে। একটি পণ্যের পাতা তারা এখনো করেনি এমন একটি প্রশ্নের উত্তর দেয়, তাই তারা চলে যায়, আর ইঞ্জিন লক্ষ্য করে এই পাতাটি এই সার্চকে সন্তুষ্ট করে না।</p><p>একই keyword একটি সত্যিকারের গাইড দিয়ে পরিবেশন করলে — যা আসলে কী গুরুত্বপূর্ণ তা ব্যাখ্যা করে আর তাদের সিদ্ধান্ত নিতে সাহায্য করে — intent-এর সাথে মেলে। সেই পাতা র‍্যাংক করতে পারে, এর অবস্থান ধরে রাখতে পারে, আর তারপরও আগ্রহী মানুষকে আপনার পণ্যের দিকে পাঠাতে পারে।</p>'),

      img(
        'docs/img/seo/search-intent-1',
        'ডায়াগ্রাম যেখানে একটি সার্চ বক্স থেকে চারটি চিহ্নিত পথ দেখানো হয়েছে, প্রতিটি ভিন্ন ধরনের পাতায় যাচ্ছে: একটি প্রবন্ধ, একটি হোমপেজ, একটি তুলনার তালিকা, আর একটি পণ্যের পাতা',
        1024, 768,
        'সার্চকারী কী করার চেষ্টা করছে তার উপর ভিত্তি করে একই বিষয়ে ভিন্ন ধরনের পাতা দরকার।'
      ),

      h(2, 'একটি সার্চের পেছনের Intent কীভাবে খুঁজবেন', 'how-to-find-the-intent-behind-a-search'),
      p('<p>সবচেয়ে নির্ভরযোগ্য পদ্ধতিতে কোনো খরচ নেই: <b>বাক্যাংশটি সার্চ করুন আর ইতিমধ্যে যা র‍্যাংক করছে তা দেখুন।</b> কোন ফলাফল কোন query সন্তুষ্ট করে সে সম্পর্কে সার্চ ইঞ্জিনের বিপুল পরিমাণ ডেটা আছে, আর তারা যে পাতা ফেরত দেয় সেটিই "এই ব্যক্তি কী চায়"-এর তাদের উত্তর।</p><ul><li>ফলাফল বেশিরভাগ প্রবন্ধ আর গাইড → informational।</li><li>ফলাফল বেশিরভাগ পণ্য বা ক্যাটাগরির পাতা → transactional।</li><li>ফলাফল বেশিরভাগ "best X" আর তুলনার তালিকা → commercial।</li><li>ফলাফলে একটি ব্র‍্যান্ডের নিজস্ব পাতার প্রাধান্য → navigational।</li></ul><p>প্রথম পাতার প্রতিটি ফলাফল যদি একটি তালিকা-প্রবন্ধ হয় আর আপনি একটি পণ্যের পাতার পরিকল্পনা করছিলেন, সেটি সার্চ আপনাকে বলছে এটি কী ধরনের পাতা চায়।</p>'),

      callout('tip', '<p>এই যাচাই আপনাকে শুধু ধরন নয়, প্রত্যাশিত <i>ফরম্যাট</i>-ও বলে — ফলাফল দীর্ঘ গাইড না ছোট উত্তর, তাতে ভিডিও আছে কিনা, সেগুলো ধাপে ধাপে কিনা। যে ফরম্যাট ইতিমধ্যে জিতছে সেটি মেলানো একটি নতুন ফরম্যাট আবিষ্কারের চেয়ে অনেক ছোট লাফ।</p>'),

      h(2, 'Intent আর ক্রয়ের যাত্রা', 'intent-and-the-buying-journey'),
      p('<p>Intent-এর ধরন মোটামুটি অনুসরণ করে কেউ কাজ করার কতটা কাছাকাছি। Informational সার্চ শুরুর দিকে থাকে — ব্যক্তিটি তার সমস্যা সংজ্ঞায়িত করছে। Commercial সার্চ মাঝখানে থাকে — তারা কাজ করার সিদ্ধান্ত নিয়েছে আর তুলনা করছে। Transactional সার্চ শেষে থাকে।</p><p>শুধু শেষ পর্যায়ের দিকে লক্ষ্য করা কন্টেন্ট তাদের সবাইকে হারায় যারা এখনো ঠিক করছে তাদের কী দরকার, যা যেকোনো মুহূর্তে বেশিরভাগ মানুষ। শুধু প্রথম পর্যায়ের দিকে লক্ষ্য করা কন্টেন্ট এমন পাঠক আনে যারা কখনো রূপান্তরিত হয় না। একটি স্বাস্থ্যকর সাইটে একাধিক পর্যায়ে পাতা থাকে, আর সেগুলোর মধ্যে লিংক থাকে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'title-tags',
  sortOrder: 5,
  en: {
    title: 'Title Tags',
    metaTitle: 'Title Tags for SEO | Learn Computer Academy',
    metaDescription: 'The single highest-leverage on-page element — what a title tag is, where it appears, and how to write one that earns the click.',
    blocks: [
      p('<p>The <b>title tag</b> is a single line of HTML in a page\'s <code>&lt;head&gt;</code>. It is also, page for page, the most consequential on-page element in SEO: it tells search engines what the page is about, and it is usually the headline someone reads before deciding whether to click.</p>'),

      code('html', '<head>\n  <title>How to Choose a Laptop for Students | TechShop</title>\n</head>'),

      h(2, 'Where It Appears'),
      p('<ul><li>As the clickable headline in search results</li><li>In the browser tab</li><li>As the default text when the page is bookmarked</li><li>Often as the link text when the page is shared</li></ul><p>It does <b>not</b> appear anywhere in the visible page content — that is the <code>&lt;h1&gt;</code>, which is a separate thing covered in the headings lesson.</p>'),

      h(2, 'Writing a Good One'),
      p('<ol><li><b>Put the important words first.</b> Titles get truncated in results, and people scan the beginning. "Laptop Buying Guide for Students" survives truncation better than "The Complete and Definitive 2026 Guide to Laptop Buying for Students".</li><li><b>Be specific.</b> "Our Services" tells nobody anything. "Laptop Repair Services in Kolkata" tells both a person and a search engine exactly what the page is.</li><li><b>Include the phrase people actually search</b>, naturally — not repeated, just present.</li><li><b>Make it unique per page.</b> Duplicate titles across a site make pages look interchangeable to search engines and are a common cause of the wrong page ranking.</li><li><b>Write it for a human.</b> It is an advertisement for the page. A technically optimised title nobody wants to click has failed.</li></ol>'),

      h(2, 'How Long Should It Be?'),
      p('<p>Search engines truncate titles based on the <b>pixel width</b> of the rendered text, not a character count — so a title full of wide capital letters gets cut sooner than one of the same length in narrow lowercase ones. Any exact character limit you see quoted is an approximation of that, not a rule the engine applies.</p><p>The practical guidance that follows: keep titles reasonably short, and front-load the part that must survive. If the meaning still lands when the tail is cut off, the length is fine.</p>'),

      callout('note', '<p>Search engines sometimes rewrite the title shown in results — using your <code>&lt;h1&gt;</code>, your site name, or other text on the page — when they judge their version more useful for that particular query. You cannot force your title to be displayed. A clear, accurate, specific title is rewritten less often than a vague or misleading one.</p>', 'Your title is a strong suggestion, not a guarantee'),

      h(2, 'A Common Pattern'),
      p('<p>Most sites use a consistent structure, with the site name appended:</p>'),
      code('html', '<!-- Page-specific part first, brand last -->\n<title>Laptop Repair Services in Kolkata | TechShop</title>\n<title>How to Choose a Laptop for Students | TechShop</title>\n\n<!-- The homepage is the one place brand-first makes sense -->\n<title>TechShop — Laptop Sales and Repair in Kolkata</title>'),
      p('<p>The brand goes last on inner pages because the page-specific part is what someone is searching for; on the homepage it goes first because the brand <i>is</i> the subject.</p>'),

      callout('warning', '<p>Two habits to avoid: stuffing the title with repeated keywords ("Laptop Repair, Laptop Service, Laptop Fix, Cheap Laptop Repair"), and writing a title that promises something the page does not deliver. Both hurt — the first looks like spam, the second sends people straight back to the results page.</p>'),
    ],
  },
  bn: {
    title: 'Title Tag',
    metaTitle: 'SEO-র জন্য Title Tag | Learn Computer Academy',
    metaDescription: 'সবচেয়ে বেশি প্রভাবশালী on-page উপাদান — একটি title tag কী, এটি কোথায় দেখা যায়, আর ক্লিক অর্জন করে এমন একটি কীভাবে লিখবেন।',
    blocks: [
      p('<p><b>Title tag</b> হলো একটি পাতার <code>&lt;head&gt;</code>-এ HTML-এর একটি একক লাইন। এটি পাতা হিসেবে SEO-র সবচেয়ে ফলপ্রসূ on-page উপাদানও: এটি সার্চ ইঞ্জিনকে বলে পাতাটি কী নিয়ে, আর সাধারণত এটিই সেই শিরোনাম যা কেউ ক্লিক করবে কিনা সিদ্ধান্ত নেওয়ার আগে পড়ে।</p>'),

      code('html', '<head>\n  <title>How to Choose a Laptop for Students | TechShop</title>\n</head>'),

      h(2, 'এটি কোথায় দেখা যায়', 'where-it-appears'),
      p('<ul><li>সার্চ ফলাফলে ক্লিকযোগ্য শিরোনাম হিসেবে</li><li>ব্রাউজার ট্যাবে</li><li>পাতাটি বুকমার্ক করলে ডিফল্ট টেক্সট হিসেবে</li><li>প্রায়ই পাতাটি শেয়ার করলে লিংক টেক্সট হিসেবে</li></ul><p>এটি দৃশ্যমান পাতার কন্টেন্টে কোথাও দেখা যায় <b>না</b> — সেটি <code>&lt;h1&gt;</code>, যা heading পাঠে কভার করা একটি আলাদা জিনিস।</p>'),

      h(2, 'একটি ভালো Title লেখা', 'writing-a-good-one'),
      p('<ol><li><b>গুরুত্বপূর্ণ শব্দগুলো আগে রাখুন।</b> ফলাফলে title কেটে যায়, আর মানুষ শুরুটা স্ক্যান করে। "Laptop Buying Guide for Students" "The Complete and Definitive 2026 Guide to Laptop Buying for Students"-এর চেয়ে কাটা পড়েও ভালো টেকে।</li><li><b>নির্দিষ্ট হন।</b> "Our Services" কাউকে কিছুই বলে না। "Laptop Repair Services in Kolkata" একজন মানুষ আর একটি সার্চ ইঞ্জিন দুজনকেই ঠিক বলে পাতাটি কী।</li><li><b>মানুষ আসলে যে বাক্যাংশ সার্চ করে তা অন্তর্ভুক্ত করুন</b>, স্বাভাবিকভাবে — পুনরাবৃত্তি নয়, শুধু উপস্থিত।</li><li><b>প্রতি পাতায় অনন্য করুন।</b> একটি সাইট জুড়ে একই title পাতাগুলোকে সার্চ ইঞ্জিনের কাছে বিনিময়যোগ্য দেখায় আর ভুল পাতা র‍্যাংক করার একটি সাধারণ কারণ।</li><li><b>একজন মানুষের জন্য লিখুন।</b> এটি পাতাটির একটি বিজ্ঞাপন। কারিগরিভাবে অপ্টিমাইজ করা title যা কেউ ক্লিক করতে চায় না, সেটি ব্যর্থ।</li></ol>'),

      h(2, 'এটি কত লম্বা হওয়া উচিত?', 'how-long-should-it-be'),
      p('<p>সার্চ ইঞ্জিন title কাটে রেন্ডার করা টেক্সটের <b>পিক্সেল প্রস্থ</b>-এর উপর ভিত্তি করে, ক্যারেক্টার সংখ্যায় নয় — তাই চওড়া বড় হাতের অক্ষরে ভরা একটি title একই দৈর্ঘ্যের সরু ছোট হাতের অক্ষরের একটির চেয়ে আগে কাটা পড়ে। আপনি যে সঠিক ক্যারেক্টার সীমা উদ্ধৃত দেখেন তা সেটিরই একটি আনুমানিক হিসাব, ইঞ্জিনের প্রয়োগ করা কোনো নিয়ম নয়।</p><p>এর থেকে যে ব্যবহারিক নির্দেশনা আসে: title যুক্তিসঙ্গতভাবে ছোট রাখুন, আর যে অংশটি টিকতে হবে তা সামনে আনুন। লেজ কেটে গেলেও অর্থ ঠিক থাকলে, দৈর্ঘ্য ঠিক আছে।</p>'),

      callout('note', '<p>সার্চ ইঞ্জিন কখনো কখনো ফলাফলে দেখানো title পুনর্লিখন করে — আপনার <code>&lt;h1&gt;</code>, আপনার সাইটের নাম, বা পাতার অন্য টেক্সট ব্যবহার করে — যখন তারা সেই নির্দিষ্ট query-র জন্য তাদের সংস্করণ বেশি কাজের বিচার করে। আপনি জোর করে আপনার title দেখাতে পারেন না। একটি স্পষ্ট, সঠিক, নির্দিষ্ট title একটি অস্পষ্ট বা বিভ্রান্তিকরটির চেয়ে কম পুনর্লিখিত হয়।</p>', 'আপনার title একটি জোরালো পরামর্শ, নিশ্চয়তা নয়'),

      h(2, 'একটি সাধারণ প্যাটার্ন', 'a-common-pattern'),
      p('<p>বেশিরভাগ সাইট একটি ধারাবাহিক গঠন ব্যবহার করে, সাইটের নাম যুক্ত করে:</p>'),
      code('html', '<!-- পাতা-নির্দিষ্ট অংশ আগে, ব্র‍্যান্ড শেষে -->\n<title>Laptop Repair Services in Kolkata | TechShop</title>\n<title>How to Choose a Laptop for Students | TechShop</title>\n\n<!-- হোমপেজই একমাত্র জায়গা যেখানে ব্র‍্যান্ড আগে অর্থপূর্ণ -->\n<title>TechShop — Laptop Sales and Repair in Kolkata</title>'),
      p('<p>ভেতরের পাতায় ব্র‍্যান্ড শেষে যায় কারণ পাতা-নির্দিষ্ট অংশটিই কেউ সার্চ করছে; হোমপেজে এটি আগে যায় কারণ ব্র‍্যান্ডই বিষয়।</p>'),

      callout('warning', '<p>এড়ানোর মতো দুটি অভ্যাস: title-এ পুনরাবৃত্ত keyword ভরা ("Laptop Repair, Laptop Service, Laptop Fix, Cheap Laptop Repair"), আর এমন একটি title লেখা যা পাতাটি যা দেয় না তার প্রতিশ্রুতি দেয়। দুটোই ক্ষতি করে — প্রথমটি স্প্যামের মতো দেখায়, দ্বিতীয়টি মানুষকে সোজা ফলাফলের পাতায় ফেরত পাঠায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'meta-descriptions',
  sortOrder: 6,
  en: {
    title: 'Meta Descriptions',
    metaTitle: 'Meta Descriptions for SEO | Learn Computer Academy',
    metaDescription: 'What a meta description does, what it does not do, and how to write one that increases clicks even though it is not a ranking factor.',
    blocks: [
      p('<p>The <b>meta description</b> is a short summary of a page, placed in the <code>&lt;head&gt;</code>. Search engines often use it as the grey snippet of text under the title in results.</p>'),

      code('html', '<head>\n  <title>How to Choose a Laptop for Students | TechShop</title>\n  <meta name="description" content="A practical guide to picking a student laptop — what specifications actually matter, what to skip, and how much you need to spend.">\n</head>'),

      h(2, 'It Is Not a Ranking Factor'),
      p('<p>Google has stated publicly that meta descriptions are not used as a ranking signal. Writing a keyword-packed description will not move a page up.</p><p>That does not make it pointless. The description is advertising copy sitting directly under your headline at the moment someone is choosing between results. It affects <b>whether people click</b>, and clicks are the whole point of ranking in the first place.</p>'),

      callout('note', '<p>This is a genuinely useful distinction to hold onto: some things affect <i>where you appear</i>, and other things affect <i>whether anyone chooses you once you appear</i>. Meta descriptions are entirely the second kind.</p>'),

      h(2, 'Writing One'),
      p('<ul><li><b>Summarise honestly.</b> Describe what the page actually contains. A description that oversells produces clicks followed by immediate exits, which helps nobody.</li><li><b>Answer "why should I read this?"</b> The title says what the page is; the description says what the reader gets from it.</li><li><b>Include the search phrase naturally.</b> Not for ranking — search engines bold matching words in the snippet, which makes it visually obvious the page is relevant.</li><li><b>Keep it reasonably short.</b> As with titles, snippets are truncated on width, and the limit shifts. Front-load the meaning.</li><li><b>One per page.</b> Duplicated descriptions across pages waste the opportunity to differentiate them.</li></ul>'),

      h(2, 'Search Engines Often Ignore It'),
      p('<p>If a search engine judges that a different piece of text from the page answers a particular query better, it will show that instead of your description. This happens often, and it is normal — the same page may show different snippets for different searches, because different parts of it are relevant to each.</p><p>Writing a good description is still worth doing: it is what gets used when nothing on the page fits better, which is most of the time for your main target query.</p>'),

      h(2, 'When to Skip It'),
      p('<p>For a large site with thousands of similar pages — product listings, for instance — hand-writing a unique description for every page is often not a good use of time. A search engine generating a snippet from the page content is usually better than a thin templated description repeated across hundreds of pages.</p><p>Write them by hand where it matters: the homepage, key landing pages, and any page you are actively trying to rank.</p>'),
    ],
  },
  bn: {
    title: 'Meta Description',
    metaTitle: 'SEO-র জন্য Meta Description | Learn Computer Academy',
    metaDescription: 'একটি meta description কী করে, কী করে না, আর ranking factor না হওয়া সত্ত্বেও ক্লিক বাড়ায় এমন একটি কীভাবে লিখবেন।',
    blocks: [
      p('<p><b>Meta description</b> হলো একটি পাতার একটি সংক্ষিপ্ত সারসংক্ষেপ, <code>&lt;head&gt;</code>-এ রাখা। সার্চ ইঞ্জিন প্রায়ই এটিকে ফলাফলে title-এর নিচে ধূসর টেক্সটের অংশ হিসেবে ব্যবহার করে।</p>'),

      code('html', '<head>\n  <title>How to Choose a Laptop for Students | TechShop</title>\n  <meta name="description" content="A practical guide to picking a student laptop — what specifications actually matter, what to skip, and how much you need to spend.">\n</head>'),

      h(2, 'এটি একটি Ranking Factor নয়', 'it-is-not-a-ranking-factor'),
      p('<p>Google প্রকাশ্যে বলেছে meta description একটি ranking সংকেত হিসেবে ব্যবহৃত হয় না। keyword-ভরা একটি description লিখলে একটি পাতা উপরে উঠবে না।</p><p>এতে এটি অর্থহীন হয়ে যায় না। Description হলো বিজ্ঞাপনের লেখা যা ঠিক আপনার শিরোনামের নিচে বসে থাকে যখন কেউ ফলাফলগুলোর মধ্যে বাছাই করছে। এটি প্রভাবিত করে <b>মানুষ ক্লিক করবে কিনা</b>, আর ক্লিকই তো প্রথমত র‍্যাংক করার পুরো উদ্দেশ্য।</p>'),

      callout('note', '<p>এটি ধরে রাখার মতো একটি সত্যিই কাজের পার্থক্য: কিছু জিনিস প্রভাবিত করে <i>আপনি কোথায় দেখা যাবেন</i>, আর অন্য জিনিস প্রভাবিত করে <i>দেখা যাওয়ার পর কেউ আপনাকে বাছবে কিনা</i>। Meta description সম্পূর্ণভাবে দ্বিতীয় ধরনের।</p>'),

      h(2, 'একটি লেখা', 'writing-one'),
      p('<ul><li><b>সৎভাবে সারসংক্ষেপ করুন।</b> পাতাটিতে আসলে কী আছে তা বর্ণনা করুন। অতিরিক্ত বিক্রি করা একটি description ক্লিক তৈরি করে যার পরেই সাথে সাথে প্রস্থান হয়, যা কারো উপকারে আসে না।</li><li><b>"আমি কেন এটি পড়ব?" উত্তর দিন।</b> Title বলে পাতাটি কী; description বলে পাঠক এটি থেকে কী পায়।</li><li><b>সার্চ বাক্যাংশ স্বাভাবিকভাবে অন্তর্ভুক্ত করুন।</b> র‍্যাংকিংয়ের জন্য নয় — সার্চ ইঞ্জিন snippet-এ মিলে যাওয়া শব্দ bold করে, যা দৃশ্যত স্পষ্ট করে পাতাটি প্রাসঙ্গিক।</li><li><b>যুক্তিসঙ্গতভাবে ছোট রাখুন।</b> Title-এর মতোই, snippet প্রস্থ অনুযায়ী কাটা হয়, আর সীমা বদলায়। অর্থ সামনে আনুন।</li><li><b>প্রতি পাতায় একটি।</b> পাতাগুলো জুড়ে একই description সেগুলোকে আলাদা করার সুযোগ নষ্ট করে।</li></ul>'),

      h(2, 'সার্চ ইঞ্জিন প্রায়ই এটি উপেক্ষা করে', 'search-engines-often-ignore-it'),
      p('<p>একটি সার্চ ইঞ্জিন যদি বিচার করে পাতার অন্য একটি টেক্সট একটি নির্দিষ্ট query-র উত্তর ভালো দেয়, তাহলে এটি আপনার description-এর বদলে সেটি দেখাবে। এটি প্রায়ই ঘটে, আর এটি স্বাভাবিক — একই পাতা ভিন্ন সার্চের জন্য ভিন্ন snippet দেখাতে পারে, কারণ এর ভিন্ন অংশ প্রতিটির জন্য প্রাসঙ্গিক।</p><p>একটি ভালো description লেখা তবুও সার্থক: পাতার কিছু ভালোভাবে না মিললে এটিই ব্যবহৃত হয়, যা আপনার মূল লক্ষ্য query-র জন্য বেশিরভাগ সময়ই হয়।</p>'),

      h(2, 'কখন এটি বাদ দেবেন', 'when-to-skip-it'),
      p('<p>হাজার হাজার একই রকম পাতাযুক্ত একটি বড় সাইটের জন্য — যেমন পণ্যের তালিকা — প্রতিটি পাতার জন্য হাতে একটি অনন্য description লেখা প্রায়ই সময়ের ভালো ব্যবহার নয়। পাতার কন্টেন্ট থেকে একটি সার্চ ইঞ্জিনের তৈরি করা snippet সাধারণত শত শত পাতায় পুনরাবৃত্ত একটি পাতলা টেমপ্লেট description-এর চেয়ে ভালো।</p><p>যেখানে গুরুত্বপূর্ণ সেখানে হাতে লিখুন: হোমপেজ, মূল landing পাতা, আর যেকোনো পাতা যেটি আপনি সক্রিয়ভাবে র‍্যাংক করানোর চেষ্টা করছেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'heading-structure',
  sortOrder: 7,
  en: {
    title: 'Heading Structure',
    metaTitle: 'Heading Structure for SEO | Learn Computer Academy',
    metaDescription: 'Why H1 to H6 are a document outline rather than a styling choice, and how correct heading order helps both search engines and screen readers.',
    blocks: [
      p('<p>HTML headings, <code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code>, describe the <b>structure</b> of a document — what its sections are and how they nest. They are not a way to make text bigger. Using them correctly helps search engines understand your page, and it is one of the clearest overlaps between SEO and accessibility.</p>'),

      h(2, 'Headings Are an Outline'),
      p('<p>Think of headings the way you would think of a table of contents. An <code>&lt;h2&gt;</code> is a major section. An <code>&lt;h3&gt;</code> inside it is a sub-point of that section. Skipping from <code>&lt;h2&gt;</code> straight to <code>&lt;h4&gt;</code> is the equivalent of a contents page with a missing level.</p>'),
      code('html', '<h1>How to Choose a Laptop for Students</h1>\n\n  <h2>What Specifications Actually Matter</h2>\n    <h3>Processor</h3>\n    <h3>Memory</h3>\n    <h3>Storage</h3>\n\n  <h2>What You Can Safely Ignore</h2>\n\n  <h2>How Much to Spend</h2>'),
      p('<p>Read the headings alone and you should still understand roughly what the page covers. If they do not make sense in isolation, the structure is wrong.</p>'),

      h(2, 'The H1'),
      p('<p>The <code>&lt;h1&gt;</code> is the page\'s main heading — the visible title of the content. Conventionally there is one per page, matching what the page is actually about.</p><p>It is related to but separate from the <code>&lt;title&gt;</code> tag: the title appears in search results and browser tabs, the H1 appears on the page itself. They are often similar, and they do not have to be identical. A title may include the brand name and be written to earn a click; an H1 usually reads more naturally as a headline.</p>'),
      code('html', '<title>How to Choose a Laptop for Students | TechShop</title>\n...\n<h1>How to Choose a Laptop for Students</h1>'),

      h(2, 'Never Use Headings for Styling'),
      p('<p>The mistake is picking a heading level because of how it looks — using <code>&lt;h4&gt;</code> for a subtitle because <code>&lt;h2&gt;</code> renders too large. Size is CSS\'s job. Choose the level that reflects the section\'s place in the outline, then style it however you like.</p>'),
      code('css', '/* Right: correct level, styled to taste */\nh2 { font-size: 1.25rem; }\n\n/* Wrong: picking h4 because it happened to look right */'),

      callout('note', '<p>Screen reader users navigate pages by jumping between headings — it is one of the primary ways of moving through a long document without reading every word. A page whose heading levels are chosen for appearance is genuinely harder to use, not just technically incorrect. This is the same structure search engines read, which is why the two concerns line up so neatly here.</p>', 'Accessibility and SEO agree here'),

      h(2, 'Practical Guidance'),
      p('<ul><li>One <code>&lt;h1&gt;</code> per page, describing the whole page.</li><li>Do not skip levels going down — <code>&lt;h2&gt;</code> then <code>&lt;h3&gt;</code>, not <code>&lt;h2&gt;</code> then <code>&lt;h4&gt;</code>.</li><li>Write headings that describe their section usefully. "Storage" beats "Point 3".</li><li>Include relevant search phrases where they fit naturally — headings signal what a section covers — but write them for readers first.</li><li>Do not wrap logos or navigation in headings just because they are prominent.</li></ul>'),
    ],
  },
  bn: {
    title: 'Heading গঠন',
    metaTitle: 'SEO-র জন্য Heading গঠন | Learn Computer Academy',
    metaDescription: 'H1 থেকে H6 কেন একটি স্টাইলিং পছন্দ নয় বরং একটি ডকুমেন্ট আউটলাইন, আর সঠিক heading ক্রম কীভাবে সার্চ ইঞ্জিন আর স্ক্রিন রিডার উভয়কে সাহায্য করে।',
    blocks: [
      p('<p>HTML heading, <code>&lt;h1&gt;</code> থেকে <code>&lt;h6&gt;</code>, একটি ডকুমেন্টের <b>গঠন</b> বর্ণনা করে — এর অংশগুলো কী আর সেগুলো কীভাবে nest করে। এগুলো টেক্সট বড় করার উপায় নয়। সঠিকভাবে ব্যবহার করলে সার্চ ইঞ্জিনকে আপনার পাতা বুঝতে সাহায্য করে, আর এটি SEO আর accessibility-র মধ্যে সবচেয়ে স্পষ্ট মিলগুলোর একটি।</p>'),

      h(2, 'Heading একটি আউটলাইন', 'headings-are-an-outline'),
      p('<p>Heading-কে একটি সূচিপত্রের মতো ভাবুন। একটি <code>&lt;h2&gt;</code> একটি প্রধান অংশ। এর ভেতরে একটি <code>&lt;h3&gt;</code> সেই অংশের একটি উপ-বিন্দু। <code>&lt;h2&gt;</code> থেকে সরাসরি <code>&lt;h4&gt;</code>-এ লাফ দেওয়া একটি স্তর অনুপস্থিত সূচিপত্রের সমতুল্য।</p>'),
      code('html', '<h1>How to Choose a Laptop for Students</h1>\n\n  <h2>What Specifications Actually Matter</h2>\n    <h3>Processor</h3>\n    <h3>Memory</h3>\n    <h3>Storage</h3>\n\n  <h2>What You Can Safely Ignore</h2>\n\n  <h2>How Much to Spend</h2>'),
      p('<p>শুধু heading-গুলো পড়ে আপনার এখনো মোটামুটি বোঝা উচিত পাতাটি কী কভার করে। সেগুলো আলাদাভাবে অর্থপূর্ণ না হলে, গঠনটি ভুল।</p>'),

      h(2, 'H1'),
      p('<p><code>&lt;h1&gt;</code> হলো পাতার প্রধান heading — কন্টেন্টের দৃশ্যমান শিরোনাম। প্রথাগতভাবে প্রতি পাতায় একটি থাকে, পাতাটি আসলে যা নিয়ে তার সাথে মিলিয়ে।</p><p>এটি <code>&lt;title&gt;</code> ট্যাগের সাথে সম্পর্কিত কিন্তু আলাদা: title সার্চ ফলাফল আর ব্রাউজার ট্যাবে দেখা যায়, H1 পাতাটিতেই দেখা যায়। সেগুলো প্রায়ই একই রকম হয়, আর সেগুলোর হুবহু এক হওয়ার প্রয়োজন নেই। একটি title-এ ব্র‍্যান্ডের নাম থাকতে পারে আর একটি ক্লিক অর্জনের জন্য লেখা হতে পারে; একটি H1 সাধারণত একটি শিরোনাম হিসেবে বেশি স্বাভাবিকভাবে পড়া যায়।</p>'),
      code('html', '<title>How to Choose a Laptop for Students | TechShop</title>\n...\n<h1>How to Choose a Laptop for Students</h1>'),

      h(2, 'কখনো স্টাইলিংয়ের জন্য Heading ব্যবহার করবেন না', 'never-use-headings-for-styling'),
      p('<p>ভুলটি হলো দেখতে কেমন লাগে তার কারণে একটি heading স্তর বাছা — <code>&lt;h2&gt;</code> খুব বড় দেখায় বলে একটি উপশিরোনামের জন্য <code>&lt;h4&gt;</code> ব্যবহার করা। আকার CSS-এর কাজ। আউটলাইনে অংশটির স্থান প্রতিফলিত করে এমন স্তর বাছুন, তারপর যেভাবে ইচ্ছা স্টাইল করুন।</p>'),
      code('css', '/* সঠিক: সঠিক স্তর, পছন্দমতো স্টাইল করা */\nh2 { font-size: 1.25rem; }\n\n/* ভুল: দেখতে ঠিক লাগছিল বলে h4 বাছা */'),

      callout('note', '<p>স্ক্রিন রিডার ব্যবহারকারীরা heading-এর মধ্যে লাফ দিয়ে পাতায় চলাচল করেন — প্রতিটি শব্দ না পড়ে একটি দীর্ঘ ডকুমেন্টে চলাচলের এটি প্রধান উপায়গুলোর একটি। যে পাতার heading স্তর চেহারার জন্য বাছা হয়েছে তা ব্যবহার করা সত্যিই কঠিন, শুধু কারিগরিভাবে ভুল নয়। এটি সেই একই গঠন যা সার্চ ইঞ্জিন পড়ে, তাই এখানে দুটি বিষয় এত সুন্দরভাবে মিলে যায়।</p>', 'Accessibility আর SEO এখানে একমত'),

      h(2, 'ব্যবহারিক নির্দেশনা', 'practical-guidance'),
      p('<ul><li>প্রতি পাতায় একটি <code>&lt;h1&gt;</code>, পুরো পাতা বর্ণনা করে।</li><li>নিচে নামার সময় স্তর বাদ দেবেন না — <code>&lt;h2&gt;</code> তারপর <code>&lt;h3&gt;</code>, <code>&lt;h2&gt;</code> তারপর <code>&lt;h4&gt;</code> নয়।</li><li>এমন heading লিখুন যা তাদের অংশ কাজের ভাবে বর্ণনা করে। "Storage" "Point 3"-এর চেয়ে ভালো।</li><li>প্রাসঙ্গিক সার্চ বাক্যাংশ যেখানে স্বাভাবিকভাবে যায় সেখানে অন্তর্ভুক্ত করুন — heading সংকেত দেয় একটি অংশ কী কভার করে — কিন্তু আগে পাঠকের জন্য লিখুন।</li><li>শুধু প্রকট বলে logo বা navigation heading-এ মুড়বেন না।</li></ul>'),
    ],
  },
})

lessons.push({
  slug: 'url-structure',
  sortOrder: 8,
  en: {
    title: 'URL Structure',
    metaTitle: 'URL Structure for SEO | Learn Computer Academy',
    metaDescription: 'What makes a URL readable and useful, how to structure paths sensibly, and why changing a URL after publishing carries a real cost.',
    blocks: [
      p('<p>A URL is a page\'s address. It is seen by people deciding whether to click, used by search engines as a mild signal of what a page covers, and — crucially — it is the thing everything else points at.</p>'),

      h(2, 'Readable Beats Clever'),
      table(
        ['', 'URL'],
        [
          ['Poor', '<code>site.com/p?id=8842&cat=3</code>'],
          ['Better', '<code>site.com/laptop-buying-guide</code>'],
          ['Better still', '<code>site.com/guides/laptop-buying-guide</code>'],
        ]
      ),
      p('<p>A person can guess what the last one contains before clicking. That is the whole goal — a URL that describes its page is more clickable when shared, easier to remember, and gives a search engine one more small, consistent hint about the topic.</p>'),

      h(2, 'Practical Rules'),
      p('<ul><li><b>Use hyphens between words</b>, not underscores or nothing. <code>laptop-buying-guide</code>, not <code>laptop_buying_guide</code> or <code>laptopbuyingguide</code>.</li><li><b>Lowercase only.</b> Some servers treat <code>/Guide</code> and <code>/guide</code> as different pages, which creates accidental duplicates.</li><li><b>Keep it short.</b> Include what is needed to identify the page and stop. Long URLs get truncated in results and are awkward to share.</li><li><b>Skip filler words</b> where they add nothing — <code>a</code>, <code>the</code>, <code>and</code> rarely earn their place.</li><li><b>No spaces or special characters.</b> They get percent-encoded into unreadable sequences.</li><li><b>Group logically with folders</b> where it reflects real structure: <code>/guides/</code>, <code>/services/</code>, <code>/blog/</code>. Do not invent depth for its own sake.</li></ul>'),

      h(2, 'Changing a URL Has a Real Cost'),
      p('<p>This is the part people underestimate. When you change a published page\'s URL, the old address stops working. Everything pointing at it breaks at once:</p><ul><li>Links from other sites — which took effort to earn — now lead to a dead page</li><li>Bookmarks stop working</li><li>The search engine\'s stored record of that address becomes stale</li><li>Any accumulated ranking signals for that address are put at risk</li></ul><p>The tool for handling this is a <b>301 redirect</b> — a server instruction that permanently forwards the old address to the new one, passing along most of the accumulated value. If you must change a URL, a 301 is not optional.</p>'),

      callout('warning', '<p>The lesson to take from this is not "never change URLs" but <b>get them right before publishing</b>, because that is the only moment the change is free. Once a page is live and linked, every change costs something even when handled correctly.</p>', 'Decide early'),

      h(2, 'Dates in URLs'),
      p('<p>Putting a publication date in the path — <code>/2026/08/laptop-guide</code> — is a common blogging convention, and it has a downside worth knowing: it makes the content look dated even after you update it, and it means a genuinely evergreen article carries a timestamp forever. Unless the date is meaningfully part of what the page <i>is</i>, such as news, leaving it out ages better.</p>'),
    ],
  },
  bn: {
    title: 'URL গঠন',
    metaTitle: 'SEO-র জন্য URL গঠন | Learn Computer Academy',
    metaDescription: 'কী একটি URL-কে পঠনযোগ্য আর কাজের করে, path কীভাবে যুক্তিসঙ্গতভাবে সাজাবেন, আর প্রকাশের পর একটি URL বদলালে কেন বাস্তব মূল্য দিতে হয়।',
    blocks: [
      p('<p>একটি URL হলো একটি পাতার ঠিকানা। ক্লিক করবে কিনা সিদ্ধান্ত নেওয়া মানুষ এটি দেখে, সার্চ ইঞ্জিন একটি পাতা কী কভার করে তার একটি মৃদু সংকেত হিসেবে এটি ব্যবহার করে, আর — সবচেয়ে গুরুত্বপূর্ণ — এটিই সেই জিনিস যেদিকে বাকি সবকিছু নির্দেশ করে।</p>'),

      h(2, 'পঠনযোগ্য চতুরতাকে হারায়', 'readable-beats-clever'),
      table(
        ['', 'URL'],
        [
          ['দুর্বল', '<code>site.com/p?id=8842&cat=3</code>'],
          ['ভালো', '<code>site.com/laptop-buying-guide</code>'],
          ['আরও ভালো', '<code>site.com/guides/laptop-buying-guide</code>'],
        ]
      ),
      p('<p>একজন মানুষ ক্লিক করার আগেই অনুমান করতে পারে শেষেরটিতে কী আছে। এটাই পুরো লক্ষ্য — যে URL তার পাতা বর্ণনা করে তা শেয়ার করলে বেশি ক্লিকযোগ্য, মনে রাখা সহজ, আর একটি সার্চ ইঞ্জিনকে বিষয় সম্পর্কে আরেকটি ছোট, ধারাবাহিক ইঙ্গিত দেয়।</p>'),

      h(2, 'ব্যবহারিক নিয়ম', 'practical-rules'),
      p('<ul><li><b>শব্দের মধ্যে হাইফেন ব্যবহার করুন</b>, underscore বা কিছুই না নয়। <code>laptop-buying-guide</code>, <code>laptop_buying_guide</code> বা <code>laptopbuyingguide</code> নয়।</li><li><b>শুধু ছোট হাতের অক্ষর।</b> কিছু সার্ভার <code>/Guide</code> আর <code>/guide</code>-কে ভিন্ন পাতা হিসেবে গণ্য করে, যা দুর্ঘটনাক্রমে নকল তৈরি করে।</li><li><b>ছোট রাখুন।</b> পাতাটি শনাক্ত করতে যা দরকার তা রাখুন আর থামুন। লম্বা URL ফলাফলে কেটে যায় আর শেয়ার করতে অস্বস্তিকর।</li><li><b>ভরাট শব্দ বাদ দিন</b> যেখানে সেগুলো কিছু যোগ করে না — <code>a</code>, <code>the</code>, <code>and</code> খুব কমই জায়গা অর্জন করে।</li><li><b>কোনো space বা বিশেষ ক্যারেক্টার নয়।</b> সেগুলো percent-encode হয়ে অপঠনযোগ্য ক্রমে পরিণত হয়।</li><li><b>ফোল্ডার দিয়ে যুক্তিসঙ্গতভাবে গ্রুপ করুন</b> যেখানে এটি বাস্তব গঠন প্রতিফলিত করে: <code>/guides/</code>, <code>/services/</code>, <code>/blog/</code>। নিজের জন্য গভীরতা আবিষ্কার করবেন না।</li></ul>'),

      h(2, 'একটি URL বদলানোর বাস্তব মূল্য আছে', 'changing-a-url-has-a-real-cost'),
      p('<p>এই অংশটি মানুষ কম মূল্যায়ন করে। আপনি যখন একটি প্রকাশিত পাতার URL বদলান, পুরোনো ঠিকানাটি কাজ করা বন্ধ করে। এর দিকে নির্দেশ করা সবকিছু একসাথে ভেঙে যায়:</p><ul><li>অন্য সাইট থেকে লিংক — যা অর্জন করতে পরিশ্রম লেগেছে — এখন একটি মৃত পাতায় নিয়ে যায়</li><li>বুকমার্ক কাজ করা বন্ধ করে</li><li>সেই ঠিকানার সার্চ ইঞ্জিনের সংরক্ষিত রেকর্ড বাসি হয়ে যায়</li><li>সেই ঠিকানার জন্য জমা হওয়া যেকোনো ranking সংকেত ঝুঁকিতে পড়ে</li></ul><p>এটি সামলানোর টুল হলো একটি <b>301 redirect</b> — একটি সার্ভার নির্দেশ যা পুরোনো ঠিকানাকে স্থায়ীভাবে নতুনটিতে ফরওয়ার্ড করে, জমা হওয়া বেশিরভাগ মূল্য সাথে নিয়ে। আপনাকে যদি একটি URL বদলাতেই হয়, একটি 301 ঐচ্ছিক নয়।</p>'),

      callout('warning', '<p>এখান থেকে নেওয়ার শিক্ষা "কখনো URL বদলাবেন না" নয় বরং <b>প্রকাশের আগে সেগুলো ঠিক করুন</b>, কারণ সেটিই একমাত্র মুহূর্ত যখন পরিবর্তনটি বিনামূল্যে। একটি পাতা একবার লাইভ আর লিংক হয়ে গেলে, সঠিকভাবে সামলালেও প্রতিটি পরিবর্তনে কিছু খরচ হয়।</p>', 'আগেই সিদ্ধান্ত নিন'),

      h(2, 'URL-এ তারিখ', 'dates-in-urls'),
      p('<p>Path-এ প্রকাশের তারিখ রাখা — <code>/2026/08/laptop-guide</code> — একটি সাধারণ ব্লগিং প্রথা, আর এর একটি জানার মতো অসুবিধা আছে: এটি আপডেট করার পরেও কন্টেন্টকে পুরোনো দেখায়, আর এর অর্থ সত্যিকারের চিরসবুজ একটি প্রবন্ধ চিরকাল একটি টাইমস্ট্যাম্প বহন করে। তারিখটি পাতাটি <i>কী</i> তার অর্থপূর্ণ অংশ না হলে, যেমন খবর, এটি বাদ দিলে বয়সের সাথে ভালো থাকে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'content-quality',
  sortOrder: 9,
  en: {
    title: 'Content Quality',
    metaTitle: 'Content Quality for SEO | Learn Computer Academy',
    metaDescription: 'What search engines mean by useful content, why word count is the wrong target, and how to write pages that hold their position.',
    blocks: [
      p('<p>Everything technical in this course helps a search engine find, read, and trust your page. None of it makes a page worth reading. Content is the part that actually has to satisfy the person who arrives — and over time, it is the part that decides whether a page keeps its position.</p>'),

      h(2, 'Answer the Question the Search Asked'),
      p('<p>Someone arrives at your page from a specific search. The single most important thing the page can do is answer that search, clearly, without making them hunt for it.</p><p>This argues against a very common structure: three paragraphs of throat-clearing before the answer. If the search was "how much RAM does a student laptop need", the answer should be visible almost immediately, with the reasoning and detail after it. People who want depth will read on. People who wanted the answer got it, and did not bounce back to the results page.</p>'),

      h(2, 'Word Count Is Not the Goal'),
      p('<p>Longer pages often rank well, which gets misread as "long pages rank because they are long". The more likely explanation runs the other way: thorough treatments of a topic tend to satisfy more of what people want, and thorough treatments tend to be longer as a side effect.</p><p>Padding a 400-word answer out to 2,000 words does not make it more thorough — it makes it worse, because the answer is now buried. Write until the question is genuinely answered, then stop.</p>'),

      callout('note', '<p>There is no target word count, no ideal keyword density, and no minimum length that guarantees anything. Any specific number quoted for these is someone\'s guess presented as a rule. The useful question is "does this fully answer what the reader came for?", which has no numeric answer.</p>', 'Numbers you will see quoted, and should not trust'),

      h(2, 'Make It Possible to Scan'),
      p('<p>Most people do not read a web page start to finish. They scan for the part relevant to them. Structure that supports scanning:</p><ul><li>Descriptive headings that let someone skip to their section</li><li>Short paragraphs — a wall of text gets skipped entirely</li><li>Lists where the content is genuinely a list</li><li>Tables for comparisons</li><li>Bold on the phrase that matters, not on whole sentences</li></ul>'),

      h(2, 'Experience, Expertise, and Trust'),
      p('<p>Search engines have said publicly that they try to favour content that demonstrates real experience and expertise, particularly on topics where bad information causes harm — health, finance, safety, legal matters. The precise mechanisms are not published, but the direction is clear and consistent.</p><p>In practice this means: say who wrote it and why they would know; be specific rather than general; show real examples, real numbers, real screenshots where relevant; cite sources when making factual claims; and keep pages accurate as things change.</p>'),

      h(2, 'Keeping Content Current'),
      p('<p>Content that was accurate three years ago may not be now. Pages that quietly go stale tend to lose ground to pages that are maintained — not because freshness is a ranking bonus in itself, but because an out-of-date page stops satisfying the people who land on it.</p><p>Updating a strong existing page is very often a better investment than writing a new one. The page already has whatever standing it earned; improving it builds on that rather than starting from zero.</p>'),

      callout('tip', '<p>A practical habit: keep a list of your pages that get real traffic, and revisit them on a schedule. Most sites find that a small number of pages account for most of their search visitors — those are the ones worth maintaining carefully.</p>'),
    ],
  },
  bn: {
    title: 'কন্টেন্টের গুণমান',
    metaTitle: 'SEO-র জন্য কন্টেন্টের গুণমান | Learn Computer Academy',
    metaDescription: 'সার্চ ইঞ্জিন কাজের কন্টেন্ট বলতে কী বোঝায়, শব্দসংখ্যা কেন ভুল লক্ষ্য, আর অবস্থান ধরে রাখে এমন পাতা কীভাবে লিখবেন।',
    blocks: [
      p('<p>এই কোর্সের প্রতিটি কারিগরি জিনিস একটি সার্চ ইঞ্জিনকে আপনার পাতা খুঁজে পেতে, পড়তে, আর বিশ্বাস করতে সাহায্য করে। এর কোনোটিই একটি পাতাকে পড়ার যোগ্য করে না। কন্টেন্ট হলো সেই অংশ যা আসলে যে আসে তাকে সন্তুষ্ট করতে হয় — আর সময়ের সাথে, এটিই সেই অংশ যা ঠিক করে একটি পাতা তার অবস্থান ধরে রাখে কিনা।</p>'),

      h(2, 'সার্চ যে প্রশ্ন করেছে তার উত্তর দিন', 'answer-the-question-the-search-asked'),
      p('<p>কেউ একটি নির্দিষ্ট সার্চ থেকে আপনার পাতায় আসে। পাতাটি সবচেয়ে গুরুত্বপূর্ণ যে কাজটি করতে পারে তা হলো সেই সার্চের উত্তর দেওয়া, স্পষ্টভাবে, তাদের খুঁজতে না বাধ্য করে।</p><p>এটি একটি খুব সাধারণ গঠনের বিরুদ্ধে যুক্তি দেয়: উত্তরের আগে তিন অনুচ্ছেদ গলা পরিষ্কার করা। সার্চ যদি ছিল "how much RAM does a student laptop need", উত্তরটি প্রায় সাথে সাথেই দৃশ্যমান হওয়া উচিত, যুক্তি আর বিস্তারিত এর পরে। যারা গভীরতা চায় তারা পড়তে থাকবে। যারা উত্তরটি চেয়েছিল তারা সেটি পেয়েছে, আর ফলাফলের পাতায় ফিরে যায়নি।</p>'),

      h(2, 'শব্দসংখ্যা লক্ষ্য নয়', 'word-count-is-not-the-goal'),
      p('<p>দীর্ঘ পাতা প্রায়ই ভালো র‍্যাংক করে, যা ভুলভাবে পড়া হয় "দীর্ঘ পাতা র‍্যাংক করে কারণ সেগুলো দীর্ঘ" হিসেবে। বেশি সম্ভাব্য ব্যাখ্যা উল্টো দিকে চলে: একটি বিষয়ের পুঙ্খানুপুঙ্খ আলোচনা মানুষ যা চায় তার বেশি সন্তুষ্ট করে, আর পুঙ্খানুপুঙ্খ আলোচনা পার্শ্বপ্রতিক্রিয়া হিসেবে দীর্ঘ হয়।</p><p>একটি ৪০০-শব্দের উত্তরকে ২,০০০ শব্দে ভরাট করলে সেটি বেশি পুঙ্খানুপুঙ্খ হয় না — এটি খারাপ হয়, কারণ উত্তরটি এখন চাপা পড়েছে। প্রশ্নটির সত্যিই উত্তর হওয়া পর্যন্ত লিখুন, তারপর থামুন।</p>'),

      callout('note', '<p>কোনো লক্ষ্য শব্দসংখ্যা নেই, কোনো আদর্শ keyword ঘনত্ব নেই, আর এমন কোনো ন্যূনতম দৈর্ঘ্য নেই যা কিছু নিশ্চিত করে। এগুলোর জন্য উদ্ধৃত যেকোনো নির্দিষ্ট সংখ্যা কারো অনুমান যা নিয়ম হিসেবে উপস্থাপিত। কাজের প্রশ্নটি হলো "পাঠক যার জন্য এসেছে এটি কি তার পূর্ণ উত্তর দেয়?", যার কোনো সাংখ্যিক উত্তর নেই।</p>', 'যে সংখ্যা আপনি উদ্ধৃত দেখবেন, আর বিশ্বাস করা উচিত নয়'),

      h(2, 'স্ক্যান করা সম্ভব করুন', 'make-it-possible-to-scan'),
      p('<p>বেশিরভাগ মানুষ একটি ওয়েব পাতা শুরু থেকে শেষ পড়ে না। তারা তাদের জন্য প্রাসঙ্গিক অংশটি স্ক্যান করে। স্ক্যানিং সমর্থন করে এমন গঠন:</p><ul><li>বর্ণনামূলক heading যা কাউকে তাদের অংশে যেতে দেয়</li><li>ছোট অনুচ্ছেদ — টেক্সটের একটি দেয়াল সম্পূর্ণ বাদ পড়ে</li><li>কন্টেন্ট সত্যিই একটি তালিকা হলে তালিকা</li><li>তুলনার জন্য টেবিল</li><li>যে বাক্যাংশটি গুরুত্বপূর্ণ তাতে bold, পুরো বাক্যে নয়</li></ul>'),

      h(2, 'অভিজ্ঞতা, দক্ষতা, আর বিশ্বাস', 'experience-expertise-and-trust'),
      p('<p>সার্চ ইঞ্জিন প্রকাশ্যে বলেছে তারা এমন কন্টেন্টকে অগ্রাধিকার দেওয়ার চেষ্টা করে যা বাস্তব অভিজ্ঞতা আর দক্ষতা দেখায়, বিশেষত এমন বিষয়ে যেখানে খারাপ তথ্য ক্ষতি করে — স্বাস্থ্য, অর্থ, নিরাপত্তা, আইনি বিষয়। সঠিক প্রক্রিয়া প্রকাশিত নয়, কিন্তু দিকটি স্পষ্ট আর ধারাবাহিক।</p><p>বাস্তবে এর অর্থ: কে লিখেছে আর তারা কেন জানবে তা বলুন; সাধারণ না হয়ে নির্দিষ্ট হন; প্রাসঙ্গিক জায়গায় বাস্তব উদাহরণ, বাস্তব সংখ্যা, বাস্তব স্ক্রিনশট দেখান; তথ্যগত দাবি করার সময় উৎস উল্লেখ করুন; আর জিনিস বদলানোর সাথে পাতা সঠিক রাখুন।</p>'),

      h(2, 'কন্টেন্ট বর্তমান রাখা', 'keeping-content-current'),
      p('<p>তিন বছর আগে যা সঠিক ছিল তা এখন না-ও হতে পারে। যে পাতা চুপচাপ বাসি হয়ে যায় তা রক্ষণাবেক্ষণ করা পাতার কাছে জায়গা হারাতে থাকে — কারণ সতেজতা নিজেই একটি ranking বোনাস তা নয়, বরং একটি সেকেলে পাতা যারা সেখানে আসে তাদের সন্তুষ্ট করা বন্ধ করে।</p><p>একটি শক্তিশালী বিদ্যমান পাতা আপডেট করা প্রায়ই একটি নতুন লেখার চেয়ে ভালো বিনিয়োগ। পাতাটির ইতিমধ্যে যা অবস্থান অর্জিত আছে তা আছে; এটি উন্নত করা শূন্য থেকে শুরু না করে তার উপর গড়ে তোলে।</p>'),

      callout('tip', '<p>একটি ব্যবহারিক অভ্যাস: আপনার যেসব পাতায় বাস্তব ট্রাফিক আসে তার একটি তালিকা রাখুন, আর একটি সূচি অনুযায়ী সেগুলো আবার দেখুন। বেশিরভাগ সাইট দেখে অল্প সংখ্যক পাতা তাদের বেশিরভাগ সার্চ ভিজিটরের জন্য দায়ী — সেগুলোই যত্নের সাথে রক্ষণাবেক্ষণের যোগ্য।</p>'),
    ],
  },
})

lessons.push({
  slug: 'internal-linking',
  sortOrder: 10,
  en: {
    title: 'Internal Linking',
    metaTitle: 'Internal Linking for SEO | Learn Computer Academy',
    metaDescription: 'How links between your own pages help search engines discover content, understand structure, and distribute authority across a site.',
    blocks: [
      p('<p>An <b>internal link</b> is a link from one page on your site to another. They are one of the few SEO levers entirely under your control — no other site has to agree, no tool is needed — and they do three separate jobs.</p>'),

      img(
        'docs/img/seo/internal-linking-1',
        'Diagram of a site structure showing a homepage linking to category pages, which link to individual article pages, with cross-links between related articles',
        1024, 768,
        'Internal links give crawlers a path to every page and show how pages relate to each other.'
      ),

      h(2, 'Job 1 — Discovery'),
      p('<p>Crawlers find pages by following links. A page with no internal links pointing at it — an "orphan page" — is genuinely hard for a search engine to find, even if it is excellent. Every page worth indexing should be reachable by following links from somewhere.</p>'),

      h(2, 'Job 2 — Showing Relationships'),
      p('<p>Links tell search engines which pages relate to which. A guide about choosing a laptop that links to specific pages about processors and memory signals that those pages are part of a related cluster on the same subject. This helps engines understand the shape of your site, not just its individual pages.</p>'),

      h(2, 'Job 3 — Passing Authority'),
      p('<p>When a page has value in a search engine\'s eyes, some of that value flows along the links it contains to the pages it points at. This is why a link from your homepage — usually your strongest page — carries more weight than one buried deep in an old post.</p><p>The practical use: if you have a page you want to perform better, link to it from your strongest, most-linked pages.</p>'),

      h(2, 'Anchor Text'),
      p('<p>The clickable words in a link — the <b>anchor text</b> — tell both people and search engines what to expect on the other side.</p>'),
      code('html', '<!-- Tells you nothing -->\n<a href="/laptop-guide">Click here</a>\n<a href="/laptop-guide">Read more</a>\n\n<!-- Describes the destination -->\n<a href="/laptop-guide">how to choose a student laptop</a>'),
      p('<p>Write anchor text that would still make sense if read on its own, out of context. This is also an accessibility point — screen reader users can pull up a list of a page\'s links, and a list of twelve entries all reading "click here" is useless.</p>'),

      h(2, 'Practical Guidance'),
      p('<ul><li><b>Link where it genuinely helps the reader.</b> A link that answers "but what does that mean?" at the moment the question arises is good for both people and search engines.</li><li><b>Do not link the same phrase to different pages</b> — it makes the relationship ambiguous.</li><li><b>Avoid stuffing links.</b> A paragraph where every other phrase is a link is hard to read and looks manipulative.</li><li><b>Keep important pages close to the homepage.</b> A page reachable in one or two clicks is treated as more significant than one buried six levels deep.</li><li><b>Fix broken internal links.</b> They waste crawl effort and frustrate readers.</li></ul>'),

      callout('tip', '<p>When you publish a new page, spend a moment adding links <i>to</i> it from existing relevant pages. This is the step most people skip — they link outward from the new page and never link inward to it, leaving it poorly connected from the start.</p>'),
    ],
  },
  bn: {
    title: 'Internal Linking',
    metaTitle: 'SEO-র জন্য Internal Linking | Learn Computer Academy',
    metaDescription: 'আপনার নিজের পাতাগুলোর মধ্যে লিংক কীভাবে সার্চ ইঞ্জিনকে কন্টেন্ট আবিষ্কার করতে, গঠন বুঝতে, আর একটি সাইট জুড়ে কর্তৃত্ব বিতরণ করতে সাহায্য করে।',
    blocks: [
      p('<p>একটি <b>internal link</b> হলো আপনার সাইটের একটি পাতা থেকে অন্যটিতে একটি লিংক। এগুলো সম্পূর্ণভাবে আপনার নিয়ন্ত্রণে থাকা অল্প কয়েকটি SEO লিভারের একটি — অন্য কোনো সাইটের সম্মত হওয়ার দরকার নেই, কোনো টুল লাগে না — আর এগুলো তিনটি আলাদা কাজ করে।</p>'),

      img(
        'docs/img/seo/internal-linking-1',
        'একটি সাইট গঠনের ডায়াগ্রাম যেখানে একটি হোমপেজ ক্যাটাগরির পাতায় লিংক করছে, যেগুলো একক প্রবন্ধের পাতায় লিংক করছে, সম্পর্কিত প্রবন্ধের মধ্যে ক্রস-লিংকসহ',
        1024, 768,
        'Internal লিংক crawler-কে প্রতিটি পাতায় যাওয়ার পথ দেয় আর দেখায় পাতাগুলো একে অপরের সাথে কীভাবে সম্পর্কিত।'
      ),

      h(2, 'কাজ ১ — আবিষ্কার', 'job-1-discovery'),
      p('<p>Crawler লিংক অনুসরণ করে পাতা খুঁজে পায়। যে পাতার দিকে কোনো internal লিংক নেই — একটি "orphan page" — একটি সার্চ ইঞ্জিনের পক্ষে খুঁজে পাওয়া সত্যিই কঠিন, সেটি চমৎকার হলেও। Index করার যোগ্য প্রতিটি পাতা কোথাও থেকে লিংক অনুসরণ করে পৌঁছানো যাওয়া উচিত।</p>'),

      h(2, 'কাজ ২ — সম্পর্ক দেখানো', 'job-2-showing-relationships'),
      p('<p>লিংক সার্চ ইঞ্জিনকে বলে কোন পাতা কোনটির সাথে সম্পর্কিত। ল্যাপটপ বাছাই নিয়ে একটি গাইড যা processor আর memory নিয়ে নির্দিষ্ট পাতায় লিংক করে, তা সংকেত দেয় সেই পাতাগুলো একই বিষয়ে একটি সম্পর্কিত গুচ্ছের অংশ। এটি ইঞ্জিনকে শুধু আপনার একক পাতা নয়, আপনার সাইটের আকৃতি বুঝতে সাহায্য করে।</p>'),

      h(2, 'কাজ ৩ — কর্তৃত্ব পাস করা', 'job-3-passing-authority'),
      p('<p>একটি সার্চ ইঞ্জিনের চোখে একটি পাতার মূল্য থাকলে, সেই মূল্যের কিছু অংশ এতে থাকা লিংক ধরে যেসব পাতার দিকে এটি নির্দেশ করে সেগুলোতে প্রবাহিত হয়। এই কারণেই আপনার হোমপেজ থেকে একটি লিংক — সাধারণত আপনার সবচেয়ে শক্তিশালী পাতা — একটি পুরোনো পোস্টে গভীরে চাপা পড়া একটির চেয়ে বেশি ওজন বহন করে।</p><p>ব্যবহারিক প্রয়োগ: আপনার যদি এমন একটি পাতা থাকে যা আপনি ভালো পারফর্ম করাতে চান, আপনার সবচেয়ে শক্তিশালী, সবচেয়ে বেশি লিংক পাওয়া পাতাগুলো থেকে সেটিতে লিংক করুন।</p>'),

      h(2, 'Anchor Text', 'anchor-text'),
      p('<p>একটি লিংকের ক্লিকযোগ্য শব্দগুলো — <b>anchor text</b> — মানুষ আর সার্চ ইঞ্জিন দুজনকেই বলে অন্য পাশে কী আশা করতে হবে।</p>'),
      code('html', '<!-- আপনাকে কিছুই বলে না -->\n<a href="/laptop-guide">Click here</a>\n<a href="/laptop-guide">Read more</a>\n\n<!-- গন্তব্য বর্ণনা করে -->\n<a href="/laptop-guide">how to choose a student laptop</a>'),
      p('<p>এমন anchor text লিখুন যা প্রসঙ্গের বাইরে, একা পড়লেও অর্থপূর্ণ হবে। এটি একটি accessibility বিষয়ও — স্ক্রিন রিডার ব্যবহারকারীরা একটি পাতার লিংকের একটি তালিকা তুলতে পারেন, আর সবগুলোতে "click here" লেখা বারোটি এন্ট্রির একটি তালিকা অকেজো।</p>'),

      h(2, 'ব্যবহারিক নির্দেশনা', 'practical-guidance'),
      p('<ul><li><b>যেখানে এটি সত্যিই পাঠককে সাহায্য করে সেখানে লিংক করুন।</b> প্রশ্নটি ওঠার মুহূর্তে "কিন্তু এর মানে কী?"-র উত্তর দেওয়া একটি লিংক মানুষ আর সার্চ ইঞ্জিন দুজনের জন্যই ভালো।</li><li><b>একই বাক্যাংশ ভিন্ন পাতায় লিংক করবেন না</b> — এটি সম্পর্কটি অস্পষ্ট করে।</li><li><b>লিংক ঠাসাঠাসি এড়ান।</b> যে অনুচ্ছেদে প্রতি দ্বিতীয় বাক্যাংশ একটি লিংক তা পড়া কঠিন আর কারসাজির মতো দেখায়।</li><li><b>গুরুত্বপূর্ণ পাতা হোমপেজের কাছে রাখুন।</b> এক বা দুই ক্লিকে পৌঁছানো একটি পাতাকে ছয় স্তর গভীরে চাপা পড়া একটির চেয়ে বেশি গুরুত্বপূর্ণ হিসেবে গণ্য করা হয়।</li><li><b>ভাঙা internal লিংক ঠিক করুন।</b> সেগুলো crawl পরিশ্রম নষ্ট করে আর পাঠককে বিরক্ত করে।</li></ul>'),

      callout('tip', '<p>আপনি যখন একটি নতুন পাতা প্রকাশ করেন, বিদ্যমান প্রাসঙ্গিক পাতা থেকে সেটির <i>দিকে</i> লিংক যোগ করতে একটু সময় দিন। এটিই সেই ধাপ যা বেশিরভাগ মানুষ বাদ দেয় — তারা নতুন পাতা থেকে বাইরের দিকে লিংক করে আর কখনো এটির দিকে ভেতরে লিংক করে না, শুরু থেকেই এটিকে খারাপভাবে সংযুক্ত রেখে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'image-seo',
  sortOrder: 11,
  en: {
    title: 'Image SEO',
    metaTitle: 'Image SEO — Alt Text, Filenames, Compression | Learn Computer Academy',
    metaDescription: 'How to make images findable in image search and keep them from slowing your pages down — alt text, filenames, formats, and lazy loading.',
    blocks: [
      p('<p>Search engines cannot see what is in a picture the way you can. Image SEO is about giving them enough context to understand your images, and making sure those images do not make the page slow enough to hurt everything else.</p>'),

      h(2, 'Alt Text'),
      p('<p>The <code>alt</code> attribute describes an image in words. It is read aloud by screen readers, displayed if the image fails to load, and used by search engines to understand image content.</p>'),
      code('html', '<!-- Useless -->\n<img src="img1.jpg" alt="image">\n<img src="img1.jpg" alt="laptop laptop buy laptop cheap laptop">\n\n<!-- Useful -->\n<img src="thin-laptop-desk.jpg" alt="A thin silver laptop open on a wooden desk beside a notebook">'),
      p('<p>Write what you would say if you were describing the image to someone who cannot see it. Be specific and factual. Do not stuff keywords — it is the clearest possible signal of manipulation, and it makes the page actively hostile to screen reader users.</p>'),

      callout('note', '<p>One exception worth knowing: purely decorative images that add no information should have an <b>empty</b> alt — <code>alt=""</code>. This tells screen readers to skip them entirely. Omitting the attribute is not the same thing; some screen readers then read out the filename instead.</p>', 'Decorative images'),

      h(2, 'Filenames'),
      p('<p>The filename is a small but free signal. <code>DSC_0042.jpg</code> says nothing; <code>thin-silver-laptop-on-desk.jpg</code> describes the content. Use lowercase, hyphens between words, and describe what is actually pictured.</p>'),

      h(2, 'File Size and Format'),
      p('<p>Images are usually the largest thing on a page by size, which makes them the most common cause of slow loading — and page speed is covered as a ranking consideration later in this course.</p><ul><li><b>Compress before uploading.</b> A photo straight from a phone camera can be several megabytes; the same image at display size is usually a small fraction of that with no visible difference.</li><li><b>Use modern formats.</b> WebP and AVIF produce substantially smaller files than JPEG and PNG at comparable quality, and are widely supported.</li><li><b>Do not serve oversized images.</b> Uploading a 4000px-wide image to display in a 600px column wastes most of the bytes downloaded.</li></ul>'),

      h(2, 'Width, Height, and Layout Shift'),
      p('<p>Always set <code>width</code> and <code>height</code> attributes. Without them the browser does not know how much space to reserve, so the page reflows when each image loads — content jumps around while someone is trying to read it. That behaviour is measured directly as a page experience signal.</p>'),
      code('html', '<img src="laptop.webp" alt="A thin silver laptop on a desk" width="1200" height="800" loading="lazy">'),

      h(2, 'Lazy Loading'),
      p('<p><code>loading="lazy"</code> tells the browser to hold off downloading an image until it is about to come into view. On a page with many images below the fold, this makes a substantial difference to how fast the visible part appears.</p><p>One caveat: do <b>not</b> lazy-load images that are visible immediately when the page opens. Deferring the main image at the top of the page delays exactly the thing you want to appear fastest.</p>'),
    ],
  },
  bn: {
    title: 'Image SEO',
    metaTitle: 'Image SEO — Alt Text, ফাইলনেম, কম্প্রেশন | Learn Computer Academy',
    metaDescription: 'ছবি image search-এ কীভাবে খুঁজে পাওয়ার যোগ্য করবেন আর সেগুলো যাতে আপনার পাতা ধীর না করে — alt text, ফাইলনেম, ফরম্যাট, আর lazy loading।',
    blocks: [
      p('<p>সার্চ ইঞ্জিন আপনার মতো করে একটি ছবিতে কী আছে তা দেখতে পারে না। Image SEO হলো আপনার ছবি বোঝার জন্য তাদের যথেষ্ট প্রেক্ষাপট দেওয়া, আর নিশ্চিত করা যে সেই ছবিগুলো পাতাটিকে এত ধীর করে না যে বাকি সবকিছুর ক্ষতি হয়।</p>'),

      h(2, 'Alt Text', 'alt-text'),
      p('<p><code>alt</code> অ্যাট্রিবিউট একটি ছবিকে শব্দে বর্ণনা করে। এটি স্ক্রিন রিডার জোরে পড়ে, ছবি লোড না হলে দেখানো হয়, আর সার্চ ইঞ্জিন ছবির কন্টেন্ট বুঝতে ব্যবহার করে।</p>'),
      code('html', '<!-- অকেজো -->\n<img src="img1.jpg" alt="image">\n<img src="img1.jpg" alt="laptop laptop buy laptop cheap laptop">\n\n<!-- কাজের -->\n<img src="thin-laptop-desk.jpg" alt="A thin silver laptop open on a wooden desk beside a notebook">'),
      p('<p>যে দেখতে পায় না তাকে ছবিটি বর্ণনা করলে আপনি যা বলতেন তা লিখুন। নির্দিষ্ট আর তথ্যনির্ভর হন। Keyword ঠাসবেন না — এটি কারসাজির সবচেয়ে স্পষ্ট সংকেত, আর এটি পাতাটিকে স্ক্রিন রিডার ব্যবহারকারীদের প্রতি সক্রিয়ভাবে বৈরী করে তোলে।</p>'),

      callout('note', '<p>জানার মতো একটি ব্যতিক্রম: সম্পূর্ণ সাজসজ্জার ছবি যা কোনো তথ্য যোগ করে না তার একটি <b>খালি</b> alt থাকা উচিত — <code>alt=""</code>। এটি স্ক্রিন রিডারকে সেগুলো সম্পূর্ণ বাদ দিতে বলে। অ্যাট্রিবিউটটি বাদ দেওয়া একই জিনিস নয়; কিছু স্ক্রিন রিডার তখন এর বদলে ফাইলনেম পড়ে শোনায়।</p>', 'সাজসজ্জার ছবি'),

      h(2, 'ফাইলনেম', 'filenames'),
      p('<p>ফাইলনেম একটি ছোট কিন্তু বিনামূল্যের সংকেত। <code>DSC_0042.jpg</code> কিছুই বলে না; <code>thin-silver-laptop-on-desk.jpg</code> কন্টেন্ট বর্ণনা করে। ছোট হাতের অক্ষর, শব্দের মধ্যে হাইফেন ব্যবহার করুন, আর আসলে যা ছবিতে আছে তা বর্ণনা করুন।</p>'),

      h(2, 'ফাইলের আকার আর ফরম্যাট', 'file-size-and-format'),
      p('<p>ছবি সাধারণত আকারে একটি পাতার সবচেয়ে বড় জিনিস, যা সেগুলোকে ধীর লোডিংয়ের সবচেয়ে সাধারণ কারণ করে তোলে — আর পাতার গতি এই কোর্সে পরে একটি ranking বিবেচনা হিসেবে কভার করা হয়েছে।</p><ul><li><b>আপলোডের আগে কম্প্রেস করুন।</b> একটি ফোনের ক্যামেরা থেকে সরাসরি একটি ছবি কয়েক মেগাবাইট হতে পারে; একই ছবি প্রদর্শনের আকারে সাধারণত কোনো দৃশ্যমান পার্থক্য ছাড়াই এর একটি ছোট ভগ্নাংশ।</li><li><b>আধুনিক ফরম্যাট ব্যবহার করুন।</b> WebP আর AVIF তুলনীয় গুণমানে JPEG আর PNG-র চেয়ে যথেষ্ট ছোট ফাইল তৈরি করে, আর ব্যাপকভাবে সমর্থিত।</li><li><b>অতিরিক্ত বড় ছবি পরিবেশন করবেন না।</b> একটি 600px কলামে দেখানোর জন্য একটি 4000px-চওড়া ছবি আপলোড করলে ডাউনলোড হওয়া বেশিরভাগ বাইট নষ্ট হয়।</li></ul>'),

      h(2, 'প্রস্থ, উচ্চতা, আর Layout Shift', 'width-height-and-layout-shift'),
      p('<p>সবসময় <code>width</code> আর <code>height</code> অ্যাট্রিবিউট সেট করুন। সেগুলো ছাড়া ব্রাউজার জানে না কতটা জায়গা সংরক্ষণ করতে হবে, তাই প্রতিটি ছবি লোড হলে পাতাটি reflow করে — কেউ পড়ার চেষ্টা করার সময় কন্টেন্ট লাফায়। সেই আচরণ সরাসরি একটি page experience সংকেত হিসেবে মাপা হয়।</p>'),
      code('html', '<img src="laptop.webp" alt="A thin silver laptop on a desk" width="1200" height="800" loading="lazy">'),

      h(2, 'Lazy Loading', 'lazy-loading'),
      p('<p><code>loading="lazy"</code> ব্রাউজারকে বলে একটি ছবি দৃশ্যে আসার আগ পর্যন্ত ডাউনলোড করা থামিয়ে রাখতে। নিচে অনেক ছবিযুক্ত একটি পাতায়, এটি দৃশ্যমান অংশ কত দ্রুত দেখা যায় তাতে যথেষ্ট পার্থক্য করে।</p><p>একটি সতর্কতা: পাতা খোলা মাত্র যে ছবিগুলো দৃশ্যমান সেগুলো lazy-load করবেন <b>না</b>। পাতার উপরের প্রধান ছবিটি পিছিয়ে দিলে আপনি যা সবচেয়ে দ্রুত দেখাতে চান ঠিক সেটিই দেরি হয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'robots-txt',
  sortOrder: 12,
  en: {
    title: 'robots.txt',
    metaTitle: 'robots.txt Explained | Learn Computer Academy',
    metaDescription: 'What robots.txt controls, what it does not control, and the common mistake that accidentally hides an entire site from search engines.',
    blocks: [
      p('<p><code>robots.txt</code> is a plain text file at the root of a site — <code>example.com/robots.txt</code> — that tells crawlers which parts of the site they should not request. It is the first thing most crawlers look for when they arrive.</p>'),

      h(2, 'The Syntax'),
      code('text', '# Applies to all crawlers\nUser-agent: *\nDisallow: /admin/\nDisallow: /cart/\nDisallow: /search?\n\n# Where the sitemap lives\nSitemap: https://example.com/sitemap.xml'),
      p('<ul><li><code>User-agent</code> — which crawler the following rules apply to. <code>*</code> means all of them.</li><li><code>Disallow</code> — a path prefix crawlers should not request.</li><li><code>Allow</code> — an exception carved out of a broader <code>Disallow</code>.</li><li><code>Sitemap</code> — where your sitemap is. Covered in the next lesson.</li></ul>'),

      h(2, 'What It Is Actually For'),
      p('<p>The genuine uses are narrower than people assume:</p><ul><li>Keeping crawlers out of areas with no value in search — admin panels, checkout flows, internal search result pages</li><li>Preventing crawlers from wasting effort on infinite URL patterns, such as filtered listings with endless parameter combinations</li><li>Pointing crawlers at your sitemap</li></ul>'),

      callout('warning', '<p><b>robots.txt does not make a page private and does not reliably keep it out of search results.</b> It asks well-behaved crawlers not to <i>fetch</i> a URL. A blocked page can still appear in results if other sites link to it, because the engine knows the address exists even though it has not read the content. To keep a page out of the index, use a <code>noindex</code> meta tag — and note that a page blocked in robots.txt can never be seen to <i>have</i> that tag, since the crawler is not allowed to read it.</p>', 'The most misunderstood point in SEO'),

      h(2, 'The Catastrophic Mistake'),
      code('text', 'User-agent: *\nDisallow: /'),
      p('<p>Those two lines ask every crawler to stay away from the entire site. This is a completely legitimate configuration for a staging or development site — and it is disastrous when it reaches production, which happens more often than it should, usually because a staging file was copied across during a launch.</p><p>Checking <code>yoursite.com/robots.txt</code> immediately after any launch or migration takes ten seconds and catches this before it costs months.</p>'),

      h(2, 'Keeping Private Things Private'),
      p('<p>robots.txt is publicly readable by anyone. Listing <code>Disallow: /secret-admin-panel/</code> in it announces the existence of that path to the whole world. Anything genuinely sensitive needs authentication, not a crawler directive.</p>'),
    ],
  },
  bn: {
    title: 'robots.txt',
    metaTitle: 'robots.txt ব্যাখ্যা | Learn Computer Academy',
    metaDescription: 'robots.txt কী নিয়ন্ত্রণ করে, কী করে না, আর যে সাধারণ ভুলটি দুর্ঘটনাক্রমে একটি পুরো সাইট সার্চ ইঞ্জিন থেকে লুকিয়ে ফেলে।',
    blocks: [
      p('<p><code>robots.txt</code> হলো একটি সাইটের রুটে একটি সাধারণ টেক্সট ফাইল — <code>example.com/robots.txt</code> — যা crawler-কে বলে সাইটের কোন অংশ তাদের অনুরোধ করা উচিত নয়। পৌঁছানোর পর বেশিরভাগ crawler প্রথমে এটিই খোঁজে।</p>'),

      h(2, 'সিনট্যাক্স', 'the-syntax'),
      code('text', '# সব crawler-এর জন্য প্রযোজ্য\nUser-agent: *\nDisallow: /admin/\nDisallow: /cart/\nDisallow: /search?\n\n# sitemap কোথায় আছে\nSitemap: https://example.com/sitemap.xml'),
      p('<ul><li><code>User-agent</code> — নিচের নিয়মগুলো কোন crawler-এর জন্য প্রযোজ্য। <code>*</code> মানে সবগুলো।</li><li><code>Disallow</code> — একটি path প্রিফিক্স যা crawler-এর অনুরোধ করা উচিত নয়।</li><li><code>Allow</code> — একটি বৃহত্তর <code>Disallow</code> থেকে কেটে নেওয়া একটি ব্যতিক্রম।</li><li><code>Sitemap</code> — আপনার sitemap কোথায়। পরের পাঠে কভার করা হয়েছে।</li></ul>'),

      h(2, 'এটি আসলে কীসের জন্য', 'what-it-is-actually-for'),
      p('<p>প্রকৃত ব্যবহার মানুষ যা ভাবে তার চেয়ে সংকীর্ণ:</p><ul><li>সার্চে কোনো মূল্য নেই এমন এলাকা থেকে crawler দূরে রাখা — admin প্যানেল, checkout প্রবাহ, ভেতরের সার্চ ফলাফলের পাতা</li><li>Crawler-কে অসীম URL প্যাটার্নে পরিশ্রম নষ্ট করা থেকে ঠেকানো, যেমন অন্তহীন প্যারামিটার সমন্বয়যুক্ত ফিল্টার করা তালিকা</li><li>Crawler-কে আপনার sitemap-এর দিকে নির্দেশ করা</li></ul>'),

      callout('warning', '<p><b>robots.txt একটি পাতাকে ব্যক্তিগত করে না আর নির্ভরযোগ্যভাবে সার্চ ফলাফলের বাইরে রাখে না।</b> এটি ভালো আচরণের crawler-কে একটি URL <i>না আনতে</i> অনুরোধ করে। অন্য সাইট এতে লিংক করলে একটি ব্লক করা পাতা এখনো ফলাফলে দেখা যেতে পারে, কারণ ইঞ্জিন জানে ঠিকানাটি আছে যদিও এটি কন্টেন্ট পড়েনি। একটি পাতা index-এর বাইরে রাখতে, একটি <code>noindex</code> meta ট্যাগ ব্যবহার করুন — আর লক্ষ্য করুন robots.txt-এ ব্লক করা একটি পাতার সেই ট্যাগ <i>আছে</i> তা কখনো দেখা যায় না, কারণ crawler-কে এটি পড়ার অনুমতি নেই।</p>', 'SEO-তে সবচেয়ে ভুল বোঝা বিষয়'),

      h(2, 'বিপর্যয়কর ভুল', 'the-catastrophic-mistake'),
      code('text', 'User-agent: *\nDisallow: /'),
      p('<p>ওই দুই লাইন প্রতিটি crawler-কে পুরো সাইট থেকে দূরে থাকতে অনুরোধ করে। একটি staging বা development সাইটের জন্য এটি সম্পূর্ণ বৈধ একটি কনফিগারেশন — আর প্রোডাকশনে পৌঁছালে এটি বিপর্যয়কর, যা হওয়া উচিতের চেয়ে বেশি ঘটে, সাধারণত কারণ একটি লঞ্চের সময় একটি staging ফাইল কপি হয়ে গেছে।</p><p>যেকোনো লঞ্চ বা migration-এর পরপরই <code>yoursite.com/robots.txt</code> যাচাই করতে দশ সেকেন্ড লাগে আর এটি মাসের ক্ষতি হওয়ার আগে ধরে ফেলে।</p>'),

      h(2, 'ব্যক্তিগত জিনিস ব্যক্তিগত রাখা', 'keeping-private-things-private'),
      p('<p>robots.txt যে কেউ প্রকাশ্যে পড়তে পারে। এতে <code>Disallow: /secret-admin-panel/</code> তালিকাভুক্ত করা পুরো পৃথিবীকে সেই path-এর অস্তিত্ব ঘোষণা করে। সত্যিই সংবেদনশীল যেকোনো কিছুর জন্য authentication দরকার, একটি crawler নির্দেশ নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'xml-sitemaps',
  sortOrder: 13,
  en: {
    title: 'XML Sitemaps',
    metaTitle: 'XML Sitemaps for SEO | Learn Computer Academy',
    metaDescription: 'What an XML sitemap is, what it can and cannot do for indexing, and how to keep one accurate without maintaining it by hand.',
    blocks: [
      p('<p>An <b>XML sitemap</b> is a file listing the pages on your site that you want search engines to know about. It is a direct way of saying "here is what exists", rather than relying entirely on crawlers finding everything by following links.</p>'),

      h(2, 'What One Looks Like'),
      code('xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://example.com/</loc>\n    <lastmod>2026-08-01</lastmod>\n  </url>\n  <url>\n    <loc>https://example.com/guides/laptop-buying-guide</loc>\n    <lastmod>2026-07-15</lastmod>\n  </url>\n</urlset>'),
      p('<p><code>&lt;loc&gt;</code> is the full URL. <code>&lt;lastmod&gt;</code> is when it last meaningfully changed — useful to engines deciding what to re-crawl, but only if it is honest. Setting every page\'s <code>lastmod</code> to today\'s date on every build teaches engines to ignore the field entirely.</p>'),

      h(2, 'What a Sitemap Does'),
      p('<ul><li>Tells engines about pages they might not otherwise discover — new pages, pages with few internal links</li><li>Helps large sites get crawled more completely</li><li>Signals which version of a URL you consider canonical</li><li>Gives you a place to report against: Search Console will tell you how many submitted URLs were actually indexed</li></ul>'),

      callout('warning', '<p><b>A sitemap does not guarantee indexing.</b> It is a suggestion, not an instruction. Pages in a sitemap are still evaluated on their merits, and thin or duplicate pages listed there will still be skipped. If a page is not being indexed, adding it to the sitemap again is rarely the fix.</p>'),

      h(2, 'Generate It, Do Not Write It'),
      p('<p>A hand-maintained sitemap goes out of date the first time someone forgets to update it, and a sitemap full of URLs that no longer exist is worse than none — it wastes crawl effort and signals carelessness.</p><p>Every serious content system can generate one automatically from its actual content. WordPress does it through plugins; modern frameworks generate it at build time or on request. Whatever the platform, the sitemap should be produced from the same source of truth as the site itself.</p>'),

      h(2, 'Telling Engines Where It Is'),
      p('<p>Two ways, and you should do both:</p><ol><li>Reference it in <code>robots.txt</code>, which every crawler reads:<br><code>Sitemap: https://example.com/sitemap.xml</code></li><li>Submit it directly in Google Search Console and Bing Webmaster Tools. This also unlocks the reporting on how many of its URLs got indexed.</li></ol>'),

      h(2, 'What to Include'),
      p('<p>Only URLs you actually want in search results, and only ones that return a normal <code>200</code> response. Leave out redirects, error pages, pages marked <code>noindex</code>, and non-canonical duplicates. A sitemap contradicting your other signals — listing a page you have also told engines not to index — is a confusing message, and engines resolve the contradiction however they choose.</p>'),

      callout('tip', '<p>Very large sites can split their sitemap into several files with a sitemap index pointing to them. Below the tens of thousands of URLs mark, one file is fine and simpler.</p>'),
    ],
  },
  bn: {
    title: 'XML Sitemap',
    metaTitle: 'SEO-র জন্য XML Sitemap | Learn Computer Academy',
    metaDescription: 'একটি XML sitemap কী, indexing-এর জন্য এটি কী করতে পারে আর পারে না, আর হাতে রক্ষণাবেক্ষণ না করে কীভাবে একটি সঠিক রাখবেন।',
    blocks: [
      p('<p>একটি <b>XML sitemap</b> হলো একটি ফাইল যা আপনার সাইটের সেসব পাতা তালিকাভুক্ত করে যেগুলো সম্পর্কে আপনি সার্চ ইঞ্জিনকে জানাতে চান। এটি "এখানে যা আছে" বলার একটি সরাসরি উপায়, সম্পূর্ণভাবে crawler-এর লিংক অনুসরণ করে সবকিছু খুঁজে পাওয়ার উপর নির্ভর না করে।</p>'),

      h(2, 'একটি দেখতে কেমন', 'what-one-looks-like'),
      code('xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://example.com/</loc>\n    <lastmod>2026-08-01</lastmod>\n  </url>\n  <url>\n    <loc>https://example.com/guides/laptop-buying-guide</loc>\n    <lastmod>2026-07-15</lastmod>\n  </url>\n</urlset>'),
      p('<p><code>&lt;loc&gt;</code> হলো সম্পূর্ণ URL। <code>&lt;lastmod&gt;</code> হলো এটি শেষ কবে অর্থপূর্ণভাবে বদলেছে — কী পুনরায় crawl করবে তা ঠিক করা ইঞ্জিনের জন্য কাজের, কিন্তু শুধু এটি সৎ হলে। প্রতিটি বিল্ডে প্রতিটি পাতার <code>lastmod</code> আজকের তারিখে সেট করলে ইঞ্জিনকে ফিল্ডটি সম্পূর্ণ উপেক্ষা করতে শেখায়।</p>'),

      h(2, 'একটি Sitemap কী করে', 'what-a-sitemap-does'),
      p('<ul><li>ইঞ্জিনকে এমন পাতা সম্পর্কে বলে যা তারা অন্যভাবে খুঁজে না-ও পেতে পারে — নতুন পাতা, কম internal লিংকযুক্ত পাতা</li><li>বড় সাইট আরও সম্পূর্ণভাবে crawl হতে সাহায্য করে</li><li>সংকেত দেয় আপনি একটি URL-এর কোন সংস্করণকে canonical মনে করেন</li><li>আপনাকে রিপোর্ট করার একটি জায়গা দেয়: Search Console আপনাকে বলবে জমা দেওয়া কতগুলো URL আসলে index হয়েছে</li></ul>'),

      callout('warning', '<p><b>একটি sitemap indexing নিশ্চিত করে না।</b> এটি একটি পরামর্শ, নির্দেশ নয়। একটি sitemap-এর পাতাগুলো এখনো তাদের যোগ্যতায় মূল্যায়িত হয়, আর সেখানে তালিকাভুক্ত পাতলা বা নকল পাতা এখনো বাদ পড়বে। একটি পাতা index না হলে, সেটি আবার sitemap-এ যোগ করা খুব কমই সমাধান।</p>'),

      h(2, 'এটি তৈরি করুন, লিখবেন না', 'generate-it-do-not-write-it'),
      p('<p>হাতে রক্ষণাবেক্ষণ করা একটি sitemap প্রথমবার কেউ আপডেট করতে ভুলে গেলেই সেকেলে হয়ে যায়, আর আর নেই এমন URL-এ ভরা একটি sitemap না থাকার চেয়ে খারাপ — এটি crawl পরিশ্রম নষ্ট করে আর অযত্নের সংকেত দেয়।</p><p>প্রতিটি গুরুতর কন্টেন্ট সিস্টেম এর আসল কন্টেন্ট থেকে স্বয়ংক্রিয়ভাবে একটি তৈরি করতে পারে। WordPress প্লাগইনের মাধ্যমে করে; আধুনিক ফ্রেমওয়ার্ক বিল্ডের সময় বা অনুরোধে তৈরি করে। প্ল্যাটফর্ম যাই হোক, sitemap সাইটের নিজের একই সত্যের উৎস থেকে তৈরি হওয়া উচিত।</p>'),

      h(2, 'ইঞ্জিনকে বলা এটি কোথায়', 'telling-engines-where-it-is'),
      p('<p>দুটি উপায়, আর আপনার দুটোই করা উচিত:</p><ol><li><code>robots.txt</code>-এ এটির উল্লেখ করুন, যা প্রতিটি crawler পড়ে:<br><code>Sitemap: https://example.com/sitemap.xml</code></li><li>Google Search Console আর Bing Webmaster Tools-এ সরাসরি জমা দিন। এটি এর কতগুলো URL index হয়েছে তার রিপোর্টিংও খুলে দেয়।</li></ol>'),

      h(2, 'কী অন্তর্ভুক্ত করবেন', 'what-to-include'),
      p('<p>শুধু সেই URL যেগুলো আপনি সত্যিই সার্চ ফলাফলে চান, আর শুধু সেগুলো যেগুলো একটি স্বাভাবিক <code>200</code> রেসপন্স দেয়। Redirect, error পাতা, <code>noindex</code> চিহ্নিত পাতা, আর non-canonical নকল বাদ দিন। আপনার অন্য সংকেতের বিপরীতে যাওয়া একটি sitemap — এমন একটি পাতা তালিকাভুক্ত করা যেটি index না করতে আপনি ইঞ্জিনকে বলেছেন — একটি বিভ্রান্তিকর বার্তা, আর ইঞ্জিন যেভাবে ইচ্ছা দ্বন্দ্বটি সমাধান করে।</p>'),

      callout('tip', '<p>খুব বড় সাইট তাদের sitemap কয়েকটি ফাইলে ভাগ করতে পারে, সেগুলোর দিকে নির্দেশ করা একটি sitemap index সহ। কয়েক হাজার URL-এর নিচে, একটি ফাইলই ঠিক আছে আর সহজ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'canonical-tags',
  sortOrder: 14,
  en: {
    title: 'Canonical Tags & Duplicate Content',
    metaTitle: 'Canonical Tags and Duplicate Content | Learn Computer Academy',
    metaDescription: 'How the same content ends up at several URLs without anyone intending it, and how a canonical tag tells search engines which one counts.',
    blocks: [
      p('<p>Search engines want one URL per piece of content. Websites, left alone, produce several — usually by accident. A <b>canonical tag</b> is how you say "several addresses reach this content; this one is the real one".</p>'),

      h(2, 'How Duplicates Happen Accidentally'),
      p('<p>Nobody sets out to publish the same page four times. It happens structurally:</p>'),
      code('text', 'https://example.com/product\nhttps://example.com/product/\nhttp://example.com/product\nhttps://www.example.com/product\nhttps://example.com/product?ref=newsletter\nhttps://example.com/product?colour=blue'),
      p('<p>To a person these are obviously the same page. To a search engine they are six distinct addresses that happen to return identical content — and it has to decide which to index and which to ignore.</p>'),

      h(2, 'Why It Matters'),
      p('<p>Two consequences, both quiet:</p><ul><li><b>Signals get split.</b> If some sites link to the <code>www</code> version and others to the non-<code>www</code>, the value is divided between two addresses instead of accumulating on one.</li><li><b>The engine picks for you.</b> Left with no guidance it will choose a version to show, and it may not be the one you would have chosen.</li></ul>'),

      img(
        'docs/img/seo/canonical-tags-1',
        'Diagram showing several different URL variations all converging with arrows onto a single canonical URL',
        1024, 768,
        'Several addresses reach the same content; the canonical tag names which one counts.'
      ),

      h(2, 'The Canonical Tag'),
      code('html', '<head>\n  <link rel="canonical" href="https://example.com/product">\n</head>'),
      p('<p>Placed in the <code>&lt;head&gt;</code> of every variant, this says: whatever address you reached this by, treat <code>https://example.com/product</code> as the one that counts. Signals consolidate there, and that is the version shown in results.</p>'),

      callout('note', '<p>A page should carry a canonical tag pointing at <b>itself</b> when it is the canonical version. This is normal and correct — a self-referencing canonical removes ambiguity when the page is reached through a tracking parameter or an alternative path.</p>', 'Self-referencing canonicals'),

      h(2, 'Getting It Wrong'),
      p('<ul><li><b>Pointing every page at the homepage.</b> A surprisingly common configuration error, and it effectively tells search engines that no other page on the site is worth indexing.</li><li><b>Canonical pointing at a redirecting or missing URL.</b> The signal is discarded.</li><li><b>Contradicting yourself.</b> A canonical saying one thing while a redirect, sitemap entry, or internal links say another. Engines resolve contradictions on their own terms.</li><li><b>Using canonical when you mean noindex.</b> They are different tools: canonical consolidates duplicates, <code>noindex</code> removes a page from results entirely.</li></ul>'),

      h(2, 'Related Situations'),
      table(
        ['Situation', 'Right tool'],
        [
          ['Same content at several URLs', '<code>rel="canonical"</code>'],
          ['Page permanently moved', '301 redirect'],
          ['Page should not be in results at all', '<code>noindex</code> meta tag'],
          ['Same content in several languages', '<code>hreflang</code>, plus canonical per language'],
        ]
      ),
      p('<p>A site serving the same content in more than one language — as this site does in English and Bengali — uses <code>hreflang</code> to tell engines the pages are translations of one another rather than duplicates, so the right language version is shown to the right person.</p>'),
    ],
  },
  bn: {
    title: 'Canonical Tag আর নকল কন্টেন্ট',
    metaTitle: 'Canonical Tag আর নকল কন্টেন্ট | Learn Computer Academy',
    metaDescription: 'কেউ না চাইতেই একই কন্টেন্ট কীভাবে কয়েকটি URL-এ পৌঁছে যায়, আর একটি canonical tag কীভাবে সার্চ ইঞ্জিনকে বলে কোনটি গণনায় ধরতে হবে।',
    blocks: [
      p('<p>সার্চ ইঞ্জিন প্রতি কন্টেন্টে একটি URL চায়। ওয়েবসাইট, নিজের মতো ছেড়ে দিলে, কয়েকটি তৈরি করে — সাধারণত দুর্ঘটনাক্রমে। একটি <b>canonical tag</b> হলো "কয়েকটি ঠিকানা এই কন্টেন্টে পৌঁছায়; এটিই আসল" বলার উপায়।</p>'),

      h(2, 'নকল কীভাবে দুর্ঘটনাক্রমে হয়', 'how-duplicates-happen-accidentally'),
      p('<p>কেউ একই পাতা চারবার প্রকাশ করতে বের হয় না। এটি কাঠামোগতভাবে ঘটে:</p>'),
      code('text', 'https://example.com/product\nhttps://example.com/product/\nhttp://example.com/product\nhttps://www.example.com/product\nhttps://example.com/product?ref=newsletter\nhttps://example.com/product?colour=blue'),
      p('<p>একজন মানুষের কাছে এগুলো স্পষ্টতই একই পাতা। একটি সার্চ ইঞ্জিনের কাছে এগুলো ছয়টি স্বতন্ত্র ঠিকানা যেগুলো ঘটনাক্রমে হুবহু একই কন্টেন্ট ফেরত দেয় — আর এটিকে ঠিক করতে হয় কোনটি index করবে আর কোনটি উপেক্ষা করবে।</p>'),

      h(2, 'এটি কেন গুরুত্বপূর্ণ', 'why-it-matters'),
      p('<p>দুটি পরিণতি, দুটোই নীরব:</p><ul><li><b>সংকেত ভাগ হয়ে যায়।</b> কিছু সাইট যদি <code>www</code> সংস্করণে আর অন্যরা non-<code>www</code>-তে লিংক করে, মূল্য একটিতে জমা না হয়ে দুটি ঠিকানার মধ্যে ভাগ হয়ে যায়।</li><li><b>ইঞ্জিন আপনার হয়ে বাছে।</b> কোনো নির্দেশনা না থাকলে এটি দেখানোর জন্য একটি সংস্করণ বাছবে, আর সেটি আপনি যেটি বাছতেন তা না-ও হতে পারে।</li></ul>'),

      img(
        'docs/img/seo/canonical-tags-1',
        'ডায়াগ্রাম যেখানে কয়েকটি ভিন্ন URL রূপভেদ তীর দিয়ে একটি একক canonical URL-এ মিলিত হচ্ছে',
        1024, 768,
        'কয়েকটি ঠিকানা একই কন্টেন্টে পৌঁছায়; canonical tag নাম দেয় কোনটি গণনায় ধরা হবে।'
      ),

      h(2, 'Canonical Tag', 'the-canonical-tag'),
      code('html', '<head>\n  <link rel="canonical" href="https://example.com/product">\n</head>'),
      p('<p>প্রতিটি রূপভেদের <code>&lt;head&gt;</code>-এ রাখা, এটি বলে: আপনি যে ঠিকানা দিয়েই এখানে পৌঁছান, <code>https://example.com/product</code>-কে গণনায় ধরার মতো একটি হিসেবে গণ্য করুন। সংকেত সেখানে একত্র হয়, আর ফলাফলে সেই সংস্করণটিই দেখানো হয়।</p>'),

      callout('note', '<p>একটি পাতা canonical সংস্করণ হলে সেটির <b>নিজের</b> দিকে নির্দেশ করা একটি canonical tag বহন করা উচিত। এটি স্বাভাবিক আর সঠিক — একটি ট্র্যাকিং প্যারামিটার বা একটি বিকল্প path দিয়ে পাতাটিতে পৌঁছালে একটি self-referencing canonical অস্পষ্টতা দূর করে।</p>', 'Self-referencing canonical'),

      h(2, 'ভুল করা', 'getting-it-wrong'),
      p('<ul><li><b>প্রতিটি পাতাকে হোমপেজের দিকে নির্দেশ করা।</b> আশ্চর্যজনকভাবে সাধারণ একটি কনফিগারেশন ভুল, আর এটি কার্যত সার্চ ইঞ্জিনকে বলে সাইটের অন্য কোনো পাতা index করার যোগ্য নয়।</li><li><b>Canonical একটি redirect হওয়া বা অনুপস্থিত URL-এর দিকে নির্দেশ করা।</b> সংকেতটি বাতিল হয়।</li><li><b>নিজের বিরোধিতা করা।</b> একটি canonical এক কথা বলছে যখন একটি redirect, sitemap এন্ট্রি, বা internal লিংক অন্য কথা বলছে। ইঞ্জিন নিজের শর্তে দ্বন্দ্ব মেটায়।</li><li><b>noindex বোঝাতে canonical ব্যবহার করা।</b> সেগুলো ভিন্ন টুল: canonical নকল একত্র করে, <code>noindex</code> একটি পাতাকে ফলাফল থেকে সম্পূর্ণ সরায়।</li></ul>'),

      h(2, 'সম্পর্কিত পরিস্থিতি', 'related-situations'),
      table(
        ['পরিস্থিতি', 'সঠিক টুল'],
        [
          ['কয়েকটি URL-এ একই কন্টেন্ট', '<code>rel="canonical"</code>'],
          ['পাতা স্থায়ীভাবে সরানো হয়েছে', '301 redirect'],
          ['পাতাটি ফলাফলে একেবারেই থাকা উচিত নয়', '<code>noindex</code> meta ট্যাগ'],
          ['কয়েকটি ভাষায় একই কন্টেন্ট', '<code>hreflang</code>, সাথে প্রতি ভাষায় canonical'],
        ]
      ),
      p('<p>একাধিক ভাষায় একই কন্টেন্ট পরিবেশন করা একটি সাইট — যেমন এই সাইট ইংরেজি আর বাংলায় করে — <code>hreflang</code> ব্যবহার করে ইঞ্জিনকে বলে পাতাগুলো একে অপরের অনুবাদ, নকল নয়, যাতে সঠিক ব্যক্তিকে সঠিক ভাষার সংস্করণ দেখানো হয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'structured-data',
  sortOrder: 15,
  en: {
    title: 'Structured Data',
    metaTitle: 'Structured Data and Schema.org | Learn Computer Academy',
    metaDescription: 'How JSON-LD and Schema.org let you describe a page in machine-readable terms, and what rich results you can earn with it.',
    blocks: [
      p('<p>A search engine reading a recipe page can see text and images, but it cannot reliably tell which number is the cooking time and which is the servings count. <b>Structured data</b> is a way of labelling that information explicitly, in a format built for machines rather than people.</p>'),

      h(2, 'Schema.org and JSON-LD'),
      p('<p><b>Schema.org</b> is a shared vocabulary — an agreed set of types (<code>Article</code>, <code>Product</code>, <code>Recipe</code>, <code>Organization</code>, <code>FAQPage</code>, <code>LocalBusiness</code>) and the properties each one can have. It is maintained collaboratively by the major search engines, so the same markup works across all of them.</p><p><b>JSON-LD</b> is the recommended format for expressing it: a block of JSON in a script tag, separate from your visible HTML.</p>'),

      code('html', '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "How to Choose a Laptop for Students",\n  "author": {\n    "@type": "Person",\n    "name": "Amarta Dey"\n  },\n  "datePublished": "2026-07-15",\n  "dateModified": "2026-08-01",\n  "image": "https://example.com/images/laptop-guide.webp"\n}\n</script>'),
      p('<p>JSON-LD is preferred over the older alternatives precisely because it sits apart from the markup — you can add, change, or remove it without touching the HTML that renders the page.</p>'),

      h(2, 'What You Get From It'),
      p('<p>Structured data is not itself a ranking factor. What it can earn is a <b>rich result</b> — an enhanced appearance in search results:</p><ul><li>Star ratings under a product or review</li><li>FAQ questions expandable directly in results</li><li>Recipe cards with cooking time and images</li><li>Event dates and locations</li><li>Breadcrumb trails instead of a raw URL</li></ul><p>A result that takes up more space and answers more of the question before the click tends to attract more attention than a plain one next to it. That is the practical benefit — visibility, not position.</p>'),

      callout('warning', '<p>Marking up content that is not actually on the page — inventing reviews, adding FAQ markup for questions the page does not answer — is a policy violation and can result in rich results being removed from a site entirely. The markup must describe what is genuinely there.</p>', 'Describe what exists'),

      h(2, 'Common Types Worth Adding'),
      table(
        ['Type', 'Use it for'],
        [
          ['<code>Organization</code>', 'Your business identity — name, logo, social profiles'],
          ['<code>LocalBusiness</code>', 'A physical location, with address and opening hours'],
          ['<code>Article</code> / <code>BlogPosting</code>', 'Written content, with author and dates'],
          ['<code>Product</code>', 'Items for sale, with price and availability'],
          ['<code>BreadcrumbList</code>', 'The page\'s position in the site hierarchy'],
          ['<code>FAQPage</code>', 'A page genuinely built around questions and answers'],
        ]
      ),

      h(2, 'Testing It'),
      p('<p>Structured data is easy to get subtly wrong — a mistyped property name fails silently. Both Google\'s Rich Results Test and the Schema.org validator will parse a page or a snippet and report errors and warnings. Check the markup when you add it, rather than assuming it worked.</p><p>Search Console also reports structured data problems across a whole site once it is verified, which catches issues introduced later by a template change.</p>'),

      callout('tip', '<p>Do not add every type you can. Start with what genuinely describes your site — <code>Organization</code> for almost everyone, plus <code>Article</code> if you publish writing or <code>LocalBusiness</code> if you have a physical location. Markup nobody benefits from is maintenance with no payoff.</p>'),
    ],
  },
  bn: {
    title: 'Structured Data',
    metaTitle: 'Structured Data আর Schema.org | Learn Computer Academy',
    metaDescription: 'JSON-LD আর Schema.org কীভাবে আপনাকে মেশিন-পঠনযোগ্য ভাষায় একটি পাতা বর্ণনা করতে দেয়, আর এটি দিয়ে আপনি কী rich result অর্জন করতে পারেন।',
    blocks: [
      p('<p>একটি রেসিপির পাতা পড়া একটি সার্চ ইঞ্জিন টেক্সট আর ছবি দেখতে পারে, কিন্তু নির্ভরযোগ্যভাবে বলতে পারে না কোন সংখ্যাটি রান্নার সময় আর কোনটি পরিবেশনের সংখ্যা। <b>Structured data</b> হলো সেই তথ্য স্পষ্টভাবে লেবেল করার একটি উপায়, মানুষের বদলে মেশিনের জন্য তৈরি একটি ফরম্যাটে।</p>'),

      h(2, 'Schema.org আর JSON-LD', 'schemaorg-and-json-ld'),
      p('<p><b>Schema.org</b> একটি শেয়ার করা শব্দভাণ্ডার — সম্মত একটি ধরনের সেট (<code>Article</code>, <code>Product</code>, <code>Recipe</code>, <code>Organization</code>, <code>FAQPage</code>, <code>LocalBusiness</code>) আর প্রতিটির যে প্রপার্টি থাকতে পারে। এটি প্রধান সার্চ ইঞ্জিনগুলো সহযোগিতামূলকভাবে রক্ষণাবেক্ষণ করে, তাই একই markup সবগুলোতে কাজ করে।</p><p><b>JSON-LD</b> হলো এটি প্রকাশের প্রস্তাবিত ফরম্যাট: একটি script ট্যাগে JSON-এর একটি ব্লক, আপনার দৃশ্যমান HTML থেকে আলাদা।</p>'),

      code('html', '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "How to Choose a Laptop for Students",\n  "author": {\n    "@type": "Person",\n    "name": "Amarta Dey"\n  },\n  "datePublished": "2026-07-15",\n  "dateModified": "2026-08-01",\n  "image": "https://example.com/images/laptop-guide.webp"\n}\n</script>'),
      p('<p>JSON-LD পুরোনো বিকল্পগুলোর চেয়ে পছন্দনীয় ঠিক এই কারণে যে এটি markup থেকে আলাদা বসে — পাতাটি রেন্ডার করা HTML স্পর্শ না করেই আপনি এটি যোগ, পরিবর্তন, বা সরাতে পারেন।</p>'),

      h(2, 'এটি থেকে আপনি কী পান', 'what-you-get-from-it'),
      p('<p>Structured data নিজে একটি ranking factor নয়। এটি যা অর্জন করতে পারে তা হলো একটি <b>rich result</b> — সার্চ ফলাফলে একটি উন্নত উপস্থিতি:</p><ul><li>একটি পণ্য বা রিভিউর নিচে স্টার রেটিং</li><li>ফলাফলে সরাসরি খোলা যায় এমন FAQ প্রশ্ন</li><li>রান্নার সময় আর ছবিসহ রেসিপি কার্ড</li><li>ইভেন্টের তারিখ আর অবস্থান</li><li>একটি কাঁচা URL-এর বদলে breadcrumb পথ</li></ul><p>যে ফলাফল বেশি জায়গা নেয় আর ক্লিকের আগেই প্রশ্নের বেশি উত্তর দেয় তা পাশের একটি সাদামাটা ফলাফলের চেয়ে বেশি মনোযোগ আকর্ষণ করে। এটাই ব্যবহারিক সুবিধা — দৃশ্যমানতা, অবস্থান নয়।</p>'),

      callout('warning', '<p>পাতায় আসলে নেই এমন কন্টেন্ট markup করা — রিভিউ বানানো, পাতাটি উত্তর দেয় না এমন প্রশ্নের জন্য FAQ markup যোগ করা — একটি নীতি লঙ্ঘন আর এর ফলে একটি সাইট থেকে rich result সম্পূর্ণ সরিয়ে নেওয়া হতে পারে। Markup-কে যা সত্যিই আছে তা বর্ণনা করতে হবে।</p>', 'যা আছে তা বর্ণনা করুন'),

      h(2, 'যোগ করার যোগ্য সাধারণ ধরন', 'common-types-worth-adding'),
      table(
        ['ধরন', 'যার জন্য ব্যবহার করবেন'],
        [
          ['<code>Organization</code>', 'আপনার ব্যবসার পরিচয় — নাম, logo, সামাজিক প্রোফাইল'],
          ['<code>LocalBusiness</code>', 'একটি ভৌত অবস্থান, ঠিকানা আর খোলার সময়সহ'],
          ['<code>Article</code> / <code>BlogPosting</code>', 'লিখিত কন্টেন্ট, লেখক আর তারিখসহ'],
          ['<code>Product</code>', 'বিক্রির জিনিস, দাম আর প্রাপ্যতাসহ'],
          ['<code>BreadcrumbList</code>', 'সাইটের ক্রমবিন্যাসে পাতাটির অবস্থান'],
          ['<code>FAQPage</code>', 'সত্যিই প্রশ্ন আর উত্তরের উপর তৈরি একটি পাতা'],
        ]
      ),

      h(2, 'এটি পরীক্ষা করা', 'testing-it'),
      p('<p>Structured data সূক্ষ্মভাবে ভুল করা সহজ — একটি ভুল টাইপ করা প্রপার্টির নাম নীরবে ব্যর্থ হয়। Google-এর Rich Results Test আর Schema.org validator দুটোই একটি পাতা বা একটি অংশ পার্স করে error আর warning জানাবে। আপনি যখন markup যোগ করেন তখন এটি কাজ করেছে ধরে না নিয়ে যাচাই করুন।</p><p>Search Console যাচাই হয়ে গেলে একটি পুরো সাইট জুড়ে structured data সমস্যাও জানায়, যা পরে একটি টেমপ্লেট পরিবর্তনে ঢোকা সমস্যা ধরে ফেলে।</p>'),

      callout('tip', '<p>আপনি পারেন এমন প্রতিটি ধরন যোগ করবেন না। যা সত্যিই আপনার সাইট বর্ণনা করে তা দিয়ে শুরু করুন — প্রায় সবার জন্য <code>Organization</code>, সাথে আপনি লেখা প্রকাশ করলে <code>Article</code> বা একটি ভৌত অবস্থান থাকলে <code>LocalBusiness</code>। যে markup-এ কারো উপকার হয় না তা কোনো লাভ ছাড়া রক্ষণাবেক্ষণ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'open-graph',
  sortOrder: 16,
  en: {
    title: 'Open Graph & Social Previews',
    metaTitle: 'Open Graph Tags and Social Previews | Learn Computer Academy',
    metaDescription: 'How to control the title, description, and image that appear when someone shares a link to your page on social media or messaging apps.',
    blocks: [
      p('<p>When someone shares a link, the platform tries to build a preview card — a title, a description, an image. Left to guess, it picks whatever it can find, often badly. <b>Open Graph</b> tags let you specify exactly what appears.</p>'),

      h(2, 'The Tags'),
      code('html', '<head>\n  <meta property="og:title" content="How to Choose a Laptop for Students">\n  <meta property="og:description" content="What specifications actually matter, what to skip, and how much you need to spend.">\n  <meta property="og:image" content="https://example.com/images/laptop-guide-og.jpg">\n  <meta property="og:url" content="https://example.com/guides/laptop-buying-guide">\n  <meta property="og:type" content="article">\n  <meta property="og:site_name" content="TechShop">\n</head>'),
      p('<p>Open Graph originated at Facebook but is now read by most platforms that render link previews — messaging apps, Slack, LinkedIn, and others. Adding it once covers most places a link can be shared.</p>'),

      h(2, 'Twitter/X Card Tags'),
      p('<p>A small number of extra tags control the card format on X specifically. If they are absent, the platform falls back to the Open Graph tags, so these are optional refinement rather than a requirement:</p>'),
      code('html', '<meta name="twitter:card" content="summary_large_image">'),

      h(2, 'The Image Matters Most'),
      p('<p>In a feed of text, the preview image is what stops the scroll. A few practical points:</p><ul><li><b>Use a wide landscape image.</b> A 1200×630 pixel image is the widely-used convention and renders correctly in most places.</li><li><b>Use an absolute URL.</b> A relative path will not resolve — the platform fetching it is not on your domain.</li><li><b>Keep important content away from the edges.</b> Different platforms crop differently.</li><li><b>Text in the image should be large.</b> Previews are often displayed small.</li></ul>'),

      callout('note', '<p>These tags have no effect on search rankings. They exist entirely to control how a link looks when shared. They earn their place through clicks from social and messaging, which is a different channel from search — but the same page benefits from both.</p>'),

      h(2, 'Testing and Caching'),
      p('<p>Platforms cache previews aggressively. If you share a link, then fix the tags, the old preview will usually persist — sometimes for a long time. Most major platforms provide a debugging tool that fetches the page fresh and refreshes their cached copy.</p><p>The practical implication: get the tags right <i>before</i> a link is widely shared, rather than fixing them after. Recovering from a bad cached preview is more work than setting it correctly the first time.</p>'),

      h(2, 'A Sensible Default'),
      p('<p>For most pages, Open Graph tags can be generated from data you already have — the page title, the meta description, and a representative image. Hand-writing them per page is only worth it for pages you expect to be shared heavily. Having a reasonable site-wide default image, so that no link ever previews with nothing at all, matters more than perfecting each one.</p>'),
    ],
  },
  bn: {
    title: 'Open Graph আর সোশ্যাল প্রিভিউ',
    metaTitle: 'Open Graph ট্যাগ আর সোশ্যাল প্রিভিউ | Learn Computer Academy',
    metaDescription: 'কেউ সোশ্যাল মিডিয়া বা মেসেজিং অ্যাপে আপনার পাতার একটি লিংক শেয়ার করলে যে title, description, আর ছবি দেখা যায় তা কীভাবে নিয়ন্ত্রণ করবেন।',
    blocks: [
      p('<p>কেউ একটি লিংক শেয়ার করলে, প্ল্যাটফর্ম একটি প্রিভিউ কার্ড তৈরির চেষ্টা করে — একটি title, একটি description, একটি ছবি। অনুমানের উপর ছেড়ে দিলে, এটি যা পায় তাই বাছে, প্রায়ই খারাপভাবে। <b>Open Graph</b> ট্যাগ আপনাকে ঠিক কী দেখা যাবে তা নির্দিষ্ট করতে দেয়।</p>'),

      h(2, 'ট্যাগগুলো', 'the-tags'),
      code('html', '<head>\n  <meta property="og:title" content="How to Choose a Laptop for Students">\n  <meta property="og:description" content="What specifications actually matter, what to skip, and how much you need to spend.">\n  <meta property="og:image" content="https://example.com/images/laptop-guide-og.jpg">\n  <meta property="og:url" content="https://example.com/guides/laptop-buying-guide">\n  <meta property="og:type" content="article">\n  <meta property="og:site_name" content="TechShop">\n</head>'),
      p('<p>Open Graph Facebook-এ শুরু হয়েছিল কিন্তু এখন লিংক প্রিভিউ রেন্ডার করা বেশিরভাগ প্ল্যাটফর্ম এটি পড়ে — মেসেজিং অ্যাপ, Slack, LinkedIn, আর অন্যান্য। একবার যোগ করলে একটি লিংক যেসব জায়গায় শেয়ার হতে পারে তার বেশিরভাগ কভার হয়।</p>'),

      h(2, 'Twitter/X কার্ড ট্যাগ', 'twitterx-card-tags'),
      p('<p>অল্প কয়েকটি অতিরিক্ত ট্যাগ বিশেষভাবে X-এ কার্ডের ফরম্যাট নিয়ন্ত্রণ করে। সেগুলো না থাকলে, প্ল্যাটফর্ম Open Graph ট্যাগে ফিরে যায়, তাই এগুলো প্রয়োজনীয়তা নয় বরং ঐচ্ছিক পরিশীলন:</p>'),
      code('html', '<meta name="twitter:card" content="summary_large_image">'),

      h(2, 'ছবিটিই সবচেয়ে গুরুত্বপূর্ণ', 'the-image-matters-most'),
      p('<p>টেক্সটের একটি ফিডে, প্রিভিউ ছবিটিই স্ক্রল থামায়। কয়েকটি ব্যবহারিক বিষয়:</p><ul><li><b>একটি চওড়া landscape ছবি ব্যবহার করুন।</b> একটি 1200×630 পিক্সেল ছবি ব্যাপকভাবে ব্যবহৃত প্রথা আর বেশিরভাগ জায়গায় সঠিকভাবে রেন্ডার হয়।</li><li><b>একটি absolute URL ব্যবহার করুন।</b> একটি relative path রিজলভ হবে না — যে প্ল্যাটফর্ম এটি আনছে সে আপনার domain-এ নেই।</li><li><b>গুরুত্বপূর্ণ কন্টেন্ট প্রান্ত থেকে দূরে রাখুন।</b> ভিন্ন প্ল্যাটফর্ম ভিন্নভাবে crop করে।</li><li><b>ছবির টেক্সট বড় হওয়া উচিত।</b> প্রিভিউ প্রায়ই ছোট দেখানো হয়।</li></ul>'),

      callout('note', '<p>এই ট্যাগগুলোর সার্চ র‍্যাংকিংয়ে কোনো প্রভাব নেই। শেয়ার করলে একটি লিংক কেমন দেখায় তা নিয়ন্ত্রণ করতেই এগুলোর অস্তিত্ব। এগুলো সোশ্যাল আর মেসেজিং থেকে ক্লিকের মাধ্যমে জায়গা অর্জন করে, যা সার্চ থেকে একটি ভিন্ন চ্যানেল — কিন্তু একই পাতা দুটো থেকেই উপকৃত হয়।</p>'),

      h(2, 'পরীক্ষা আর ক্যাশিং', 'testing-and-caching'),
      p('<p>প্ল্যাটফর্ম প্রিভিউ আক্রমণাত্মকভাবে ক্যাশ করে। আপনি যদি একটি লিংক শেয়ার করেন, তারপর ট্যাগ ঠিক করেন, পুরোনো প্রিভিউটি সাধারণত থেকে যাবে — কখনো কখনো অনেকদিন। বেশিরভাগ প্রধান প্ল্যাটফর্ম একটি debugging টুল দেয় যা পাতাটি নতুন করে আনে আর তাদের ক্যাশ করা কপি রিফ্রেশ করে।</p><p>ব্যবহারিক তাৎপর্য: একটি লিংক ব্যাপকভাবে শেয়ার হওয়ার <i>আগে</i> ট্যাগ ঠিক করুন, পরে ঠিক করার বদলে। একটি খারাপ ক্যাশ করা প্রিভিউ থেকে বেরোনো প্রথমবার সঠিকভাবে সেট করার চেয়ে বেশি কাজ।</p>'),

      h(2, 'একটি যুক্তিসঙ্গত ডিফল্ট', 'a-sensible-default'),
      p('<p>বেশিরভাগ পাতার জন্য, Open Graph ট্যাগ আপনার ইতিমধ্যে থাকা ডেটা থেকে তৈরি করা যায় — পাতার title, meta description, আর একটি প্রতিনিধিত্বমূলক ছবি। প্রতি পাতায় হাতে লেখা শুধু সেই পাতাগুলোর জন্য সার্থক যেগুলো আপনি বেশি শেয়ার হবে বলে আশা করেন। একটি যুক্তিসঙ্গত সাইট-ব্যাপী ডিফল্ট ছবি থাকা, যাতে কোনো লিংক কখনো একেবারে কিছু ছাড়া প্রিভিউ না হয়, প্রতিটি নিখুঁত করার চেয়ে বেশি গুরুত্বপূর্ণ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'mobile-friendliness',
  sortOrder: 17,
  en: {
    title: 'Mobile-Friendliness',
    metaTitle: 'Mobile-Friendliness and Mobile-First Indexing | Learn Computer Academy',
    metaDescription: 'Why search engines evaluate the mobile version of your site rather than the desktop one, and what that changes about how you build.',
    blocks: [
      p('<p>Google indexes the web <b>mobile-first</b>: the mobile version of a page is the version used for indexing and ranking. If your site behaves differently on a phone than on a desktop, the phone version is the one that counts.</p>'),

      h(2, 'What Mobile-First Indexing Means in Practice'),
      p('<p>The consequence people miss: content that exists only on the desktop layout is effectively invisible. If a responsive design hides a section on small screens, or a mobile template omits text the desktop one includes, that content is not what the engine is evaluating.</p><p>This makes "hide it on mobile to save space" a decision with SEO consequences, not just a layout choice. Collapsing content behind a tap to expand is generally fine — the content is still in the HTML. Removing it from the mobile markup entirely is not.</p>'),

      callout('warning', '<p>The same logic applies to structured data, headings, internal links, and images. Whatever is missing from the mobile version is missing, full stop. Checking your page on a narrow viewport is checking the version that matters.</p>'),

      h(2, 'Responsive Design Is the Recommended Approach'),
      p('<p>Serving one set of HTML that adapts through CSS avoids the whole class of problem: there is only one version, so it cannot diverge. It also means one URL per page, which keeps canonicals and links simple.</p>'),
      code('html', '<!-- Required for responsive layouts to work at all -->\n<meta name="viewport" content="width=device-width, initial-scale=1">'),
      p('<p>Without that viewport tag a mobile browser assumes a desktop-width page and zooms out, producing the tiny unreadable rendering that responsive CSS was meant to prevent. It is one line, and omitting it undoes everything else.</p>'),

      h(2, 'What Makes a Page Usable on a Phone'),
      p('<ul><li><b>Text readable without zooming.</b> If someone has to pinch to read a paragraph, the font is too small.</li><li><b>Tap targets large enough and spaced apart.</b> Links crowded together get mis-tapped.</li><li><b>No horizontal scrolling.</b> Content wider than the screen is a common symptom of a fixed-width element that never got a responsive treatment — wide tables and code blocks are the usual culprits, and they should scroll inside their own container rather than pushing the page sideways.</li><li><b>Interstitials that do not block the content.</b> A popup covering the page immediately on arrival is bad for people and is explicitly discouraged by search engines.</li><li><b>Forms that work with a touch keyboard.</b> Correct <code>type</code> attributes bring up the right keyboard and save real frustration.</li></ul>'),

      h(2, 'Testing It'),
      p('<p>Browser developer tools can simulate a narrow viewport, which catches layout problems quickly. But a simulator does not reproduce a real phone\'s processor speed, network conditions, or touch accuracy — testing on an actual device, ideally a mid-range one on a mobile connection rather than the newest flagship on office Wi-Fi, reveals problems a desktop simulation never will.</p>'),
    ],
  },
  bn: {
    title: 'মোবাইল-বান্ধবতা',
    metaTitle: 'মোবাইল-বান্ধবতা আর Mobile-First Indexing | Learn Computer Academy',
    metaDescription: 'সার্চ ইঞ্জিন কেন ডেস্কটপের বদলে আপনার সাইটের মোবাইল সংস্করণ মূল্যায়ন করে, আর আপনি কীভাবে তৈরি করেন তাতে এটি কী বদলায়।',
    blocks: [
      p('<p>Google ওয়েব index করে <b>mobile-first</b>: একটি পাতার মোবাইল সংস্করণটিই indexing আর ranking-এর জন্য ব্যবহৃত সংস্করণ। আপনার সাইট একটি ফোনে ডেস্কটপের চেয়ে ভিন্নভাবে আচরণ করলে, ফোন সংস্করণটিই গণনায় ধরা হয়।</p>'),

      h(2, 'Mobile-First Indexing বাস্তবে কী বোঝায়', 'what-mobile-first-indexing-means-in-practice'),
      p('<p>মানুষ যে পরিণতিটি বাদ দেয়: শুধু ডেস্কটপ লেআউটে থাকা কন্টেন্ট কার্যত অদৃশ্য। একটি responsive ডিজাইন যদি ছোট স্ক্রিনে একটি অংশ লুকায়, বা একটি মোবাইল টেমপ্লেট ডেস্কটপে থাকা টেক্সট বাদ দেয়, সেই কন্টেন্ট ইঞ্জিন যা মূল্যায়ন করছে তা নয়।</p><p>এটি "জায়গা বাঁচাতে মোবাইলে এটি লুকিয়ে রাখুন"-কে শুধু একটি লেআউট পছন্দ নয়, SEO পরিণতিযুক্ত একটি সিদ্ধান্ত করে তোলে। খোলার জন্য একটি ট্যাপের পেছনে কন্টেন্ট গুটিয়ে রাখা সাধারণত ঠিক আছে — কন্টেন্ট এখনো HTML-এ আছে। মোবাইল markup থেকে সম্পূর্ণ সরিয়ে দেওয়া নয়।</p>'),

      callout('warning', '<p>একই যুক্তি structured data, heading, internal লিংক, আর ছবিতে প্রযোজ্য। মোবাইল সংস্করণে যা অনুপস্থিত তা অনুপস্থিত, ব্যাস। একটি সরু viewport-এ আপনার পাতা যাচাই করা মানে যে সংস্করণটি গুরুত্বপূর্ণ সেটি যাচাই করা।</p>'),

      h(2, 'Responsive ডিজাইনই প্রস্তাবিত পদ্ধতি', 'responsive-design-is-the-recommended-approach'),
      p('<p>CSS-এর মাধ্যমে অভিযোজিত হয় এমন এক সেট HTML পরিবেশন করা পুরো সমস্যার শ্রেণীটি এড়ায়: শুধু একটি সংস্করণ আছে, তাই এটি আলাদা হতে পারে না। এর অর্থ প্রতি পাতায় একটি URL-ও, যা canonical আর লিংক সহজ রাখে।</p>'),
      code('html', '<!-- Responsive লেআউট কাজ করতেই এটি আবশ্যক -->\n<meta name="viewport" content="width=device-width, initial-scale=1">'),
      p('<p>সেই viewport ট্যাগ ছাড়া একটি মোবাইল ব্রাউজার একটি ডেস্কটপ-প্রস্থের পাতা ধরে নিয়ে zoom out করে, সেই ক্ষুদ্র অপঠনযোগ্য রেন্ডারিং তৈরি করে যা responsive CSS ঠেকানোর জন্যই ছিল। এটি এক লাইন, আর এটি বাদ দিলে বাকি সবকিছু বাতিল হয়ে যায়।</p>'),

      h(2, 'একটি পাতাকে ফোনে ব্যবহারযোগ্য কী করে', 'what-makes-a-page-usable-on-a-phone'),
      p('<ul><li><b>Zoom ছাড়াই পঠনযোগ্য টেক্সট।</b> একটি অনুচ্ছেদ পড়তে কাউকে যদি pinch করতে হয়, ফন্ট খুব ছোট।</li><li><b>যথেষ্ট বড় আর ফাঁক রেখে বসানো tap target।</b> একসাথে ভিড় করা লিংকে ভুল ট্যাপ হয়।</li><li><b>কোনো অনুভূমিক স্ক্রলিং নয়।</b> স্ক্রিনের চেয়ে চওড়া কন্টেন্ট এমন একটি নির্দিষ্ট-প্রস্থের উপাদানের সাধারণ লক্ষণ যা কখনো responsive চিকিৎসা পায়নি — চওড়া টেবিল আর কোড ব্লক সাধারণ অপরাধী, আর সেগুলো পাতাটিকে পাশে ঠেলে না দিয়ে নিজের container-এর ভেতরে স্ক্রল করা উচিত।</li><li><b>কন্টেন্ট ব্লক করে না এমন interstitial।</b> পৌঁছানো মাত্র পাতা ঢেকে দেওয়া একটি popup মানুষের জন্য খারাপ আর সার্চ ইঞ্জিন স্পষ্টভাবে নিরুৎসাহিত করে।</li><li><b>টাচ কীবোর্ডে কাজ করে এমন form।</b> সঠিক <code>type</code> অ্যাট্রিবিউট সঠিক কীবোর্ড আনে আর বাস্তব বিরক্তি বাঁচায়।</li></ul>'),

      h(2, 'এটি পরীক্ষা করা', 'testing-it'),
      p('<p>ব্রাউজার developer tool একটি সরু viewport সিমুলেট করতে পারে, যা দ্রুত লেআউট সমস্যা ধরে। কিন্তু একটি সিমুলেটর একটি বাস্তব ফোনের প্রসেসরের গতি, নেটওয়ার্ক পরিস্থিতি, বা টাচ নির্ভুলতা পুনরুৎপাদন করে না — একটি আসল ডিভাইসে পরীক্ষা, আদর্শভাবে অফিস Wi-Fi-তে নতুন ফ্ল্যাগশিপের বদলে একটি মোবাইল সংযোগে একটি মধ্য-পর্যায়ের ডিভাইসে, এমন সমস্যা প্রকাশ করে যা একটি ডেস্কটপ সিমুলেশন কখনো করবে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'page-speed',
  sortOrder: 18,
  en: {
    title: 'Page Speed & Core Web Vitals',
    metaTitle: 'Page Speed and Core Web Vitals | Learn Computer Academy',
    metaDescription: 'The three Core Web Vitals metrics, their published thresholds, and the changes that most often make a slow page fast.',
    blocks: [
      p('<p>How fast a page loads and how smoothly it responds are part of how search engines judge page experience — and independently, they decide whether people stay long enough to read anything. Google publishes a specific set of metrics for this, the <b>Core Web Vitals</b>.</p>'),

      h(2, 'The Three Metrics'),
      table(
        ['Metric', 'Measures', 'Good'],
        [
          ['<b>LCP</b> — Largest Contentful Paint', 'How long until the main content is visible', '2.5 seconds or less'],
          ['<b>INP</b> — Interaction to Next Paint', 'How quickly the page responds when someone interacts', '200 milliseconds or less'],
          ['<b>CLS</b> — Cumulative Layout Shift', 'How much content jumps around while loading', '0.1 or less'],
        ]
      ),
      p('<p>These thresholds are published by Google, which is why they can be quoted precisely — unlike most ranking specifics. INP replaced an earlier metric, First Input Delay, in 2024; older material still referring to FID is out of date.</p>'),

      img(
        'docs/img/seo/page-speed-1',
        'Diagram illustrating the three Core Web Vitals: a page painting its main content, a click responding quickly, and a layout shifting as an image loads',
        1344, 752,
        'Loading speed, responsiveness, and visual stability — measured separately because they fail separately.'
      ),

      h(2, 'What Usually Causes Each'),
      p('<p><b>Poor LCP</b> is nearly always a large image or a slow server response. The single most common cause is an uncompressed hero image at the top of the page.</p><p><b>Poor INP</b> is JavaScript. When the main thread is busy executing scripts, it cannot respond to a tap — the page looks loaded but does not react. Large frameworks, heavy third-party scripts, and analytics or chat widgets are common contributors.</p><p><b>Poor CLS</b> is content appearing and pushing other content down: images without <code>width</code> and <code>height</code>, ads or embeds inserted after load, and web fonts swapping in at a different size than the fallback.</p>'),

      h(2, 'The Changes With the Biggest Effect'),
      p('<ol><li><b>Compress and resize images.</b> Almost always the largest single win, and the easiest.</li><li><b>Set width and height on every image.</b> Fixes CLS directly, costs nothing.</li><li><b>Remove third-party scripts you do not need.</b> Each one is someone else\'s code executing on your page, on their schedule. Audit what is actually there — sites accumulate these.</li><li><b>Lazy-load below-the-fold images</b>, but never the top one.</li><li><b>Serve modern image formats</b> — WebP or AVIF over JPEG and PNG.</li><li><b>Enable caching and compression on the server.</b> Usually a configuration change rather than a code change.</li></ol>'),

      h(2, 'Measuring It'),
      p('<p>Two kinds of data, and the difference matters:</p><ul><li><b>Lab data</b> — a single test run in controlled conditions. Lighthouse in browser developer tools and PageSpeed Insights both provide this. Useful for diagnosis, because it tells you exactly what is slow.</li><li><b>Field data</b> — measurements from real visitors on real devices and connections. Search Console\'s Core Web Vitals report shows this. It is what actually reflects your visitors\' experience.</li></ul><p>A page can score well in a lab test and poorly in the field, usually because real users are on slower devices and networks than the machine running the test.</p>'),

      callout('note', '<p>Speed is a genuine ranking consideration, but a modest one — it will not lift a page above a substantially more relevant competitor. The stronger argument for fixing it is that slow pages lose visitors before they read anything, which no amount of ranking can compensate for.</p>', 'Keep it in proportion'),
    ],
  },
  bn: {
    title: 'পাতার গতি আর Core Web Vitals',
    metaTitle: 'পাতার গতি আর Core Web Vitals | Learn Computer Academy',
    metaDescription: 'তিনটি Core Web Vitals মেট্রিক, তাদের প্রকাশিত সীমা, আর যে পরিবর্তনগুলো সবচেয়ে বেশি একটি ধীর পাতাকে দ্রুত করে।',
    blocks: [
      p('<p>একটি পাতা কত দ্রুত লোড হয় আর কত সহজে সাড়া দেয় তা সার্চ ইঞ্জিন page experience বিচারের অংশ — আর স্বতন্ত্রভাবে, সেগুলো ঠিক করে মানুষ কিছু পড়ার মতো যথেষ্ট সময় থাকে কিনা। Google এর জন্য একটি নির্দিষ্ট মেট্রিকের সেট প্রকাশ করে, <b>Core Web Vitals</b>।</p>'),

      h(2, 'তিনটি মেট্রিক', 'the-three-metrics'),
      table(
        ['মেট্রিক', 'কী মাপে', 'ভালো'],
        [
          ['<b>LCP</b> — Largest Contentful Paint', 'প্রধান কন্টেন্ট দৃশ্যমান হতে কত সময়', '২.৫ সেকেন্ড বা কম'],
          ['<b>INP</b> — Interaction to Next Paint', 'কেউ ইন্টারঅ্যাক্ট করলে পাতা কত দ্রুত সাড়া দেয়', '২০০ মিলিসেকেন্ড বা কম'],
          ['<b>CLS</b> — Cumulative Layout Shift', 'লোড হওয়ার সময় কন্টেন্ট কতটা লাফায়', '০.১ বা কম'],
        ]
      ),
      p('<p>এই সীমাগুলো Google প্রকাশ করে, তাই এগুলো নির্ভুলভাবে উদ্ধৃত করা যায় — বেশিরভাগ ranking নির্দিষ্টতার মতো নয়। INP ২০২৪-এ একটি পুরোনো মেট্রিক, First Input Delay, প্রতিস্থাপন করেছে; এখনো FID উল্লেখ করা পুরোনো উপাদান সেকেলে।</p>'),

      img(
        'docs/img/seo/page-speed-1',
        'তিনটি Core Web Vitals ব্যাখ্যা করা ডায়াগ্রাম: একটি পাতা তার প্রধান কন্টেন্ট আঁকছে, একটি ক্লিক দ্রুত সাড়া দিচ্ছে, আর একটি ছবি লোড হওয়ার সাথে একটি লেআউট সরে যাচ্ছে',
        1344, 752,
        'লোডিং গতি, সাড়া দেওয়া, আর দৃশ্যগত স্থিরতা — আলাদাভাবে মাপা হয় কারণ সেগুলো আলাদাভাবে ব্যর্থ হয়।'
      ),

      h(2, 'সাধারণত প্রতিটির কারণ কী', 'what-usually-causes-each'),
      p('<p><b>খারাপ LCP</b> প্রায় সবসময় একটি বড় ছবি বা একটি ধীর সার্ভার রেসপন্স। সবচেয়ে সাধারণ কারণ হলো পাতার উপরে একটি কম্প্রেস না করা hero ছবি।</p><p><b>খারাপ INP</b> হলো JavaScript। মূল থ্রেড যখন স্ক্রিপ্ট চালাতে ব্যস্ত, এটি একটি ট্যাপে সাড়া দিতে পারে না — পাতাটি লোড হওয়া দেখায় কিন্তু প্রতিক্রিয়া করে না। বড় ফ্রেমওয়ার্ক, ভারী থার্ড-পার্টি স্ক্রিপ্ট, আর analytics বা chat widget সাধারণ অবদানকারী।</p><p><b>খারাপ CLS</b> হলো কন্টেন্ট দেখা দিয়ে অন্য কন্টেন্ট নিচে ঠেলে দেওয়া: <code>width</code> আর <code>height</code> ছাড়া ছবি, লোডের পর ঢোকানো বিজ্ঞাপন বা embed, আর fallback-এর চেয়ে ভিন্ন আকারে web font বদলে যাওয়া।</p>'),

      h(2, 'সবচেয়ে বেশি প্রভাবযুক্ত পরিবর্তন', 'the-changes-with-the-biggest-effect'),
      p('<ol><li><b>ছবি কম্প্রেস আর রিসাইজ করুন।</b> প্রায় সবসময় সবচেয়ে বড় একক জয়, আর সবচেয়ে সহজ।</li><li><b>প্রতিটি ছবিতে width আর height সেট করুন।</b> সরাসরি CLS ঠিক করে, কোনো খরচ নেই।</li><li><b>আপনার দরকার নেই এমন থার্ড-পার্টি স্ক্রিপ্ট সরান।</b> প্রতিটি অন্য কারো কোড যা আপনার পাতায় চলছে, তাদের সময়সূচিতে। আসলে কী আছে তা নিরীক্ষা করুন — সাইটে এগুলো জমতে থাকে।</li><li><b>নিচের ছবি lazy-load করুন</b>, কিন্তু কখনো উপরেরটি নয়।</li><li><b>আধুনিক ছবির ফরম্যাট পরিবেশন করুন</b> — JPEG আর PNG-র বদলে WebP বা AVIF।</li><li><b>সার্ভারে caching আর compression চালু করুন।</b> সাধারণত একটি কোড পরিবর্তন নয় বরং একটি কনফিগারেশন পরিবর্তন।</li></ol>'),

      h(2, 'এটি মাপা', 'measuring-it'),
      p('<p>দুই ধরনের ডেটা, আর পার্থক্যটি গুরুত্বপূর্ণ:</p><ul><li><b>Lab ডেটা</b> — নিয়ন্ত্রিত পরিস্থিতিতে একটি একক পরীক্ষা। ব্রাউজার developer tool-এ Lighthouse আর PageSpeed Insights দুটোই এটি দেয়। নির্ণয়ের জন্য কাজের, কারণ এটি আপনাকে ঠিক বলে কী ধীর।</li><li><b>Field ডেটা</b> — বাস্তব ডিভাইস আর সংযোগে বাস্তব ভিজিটরের মাপ। Search Console-এর Core Web Vitals রিপোর্ট এটি দেখায়। এটিই আসলে আপনার ভিজিটরের অভিজ্ঞতা প্রতিফলিত করে।</li></ul><p>একটি পাতা একটি lab পরীক্ষায় ভালো আর field-এ খারাপ স্কোর করতে পারে, সাধারণত কারণ বাস্তব ব্যবহারকারীরা পরীক্ষা চালানো মেশিনের চেয়ে ধীর ডিভাইস আর নেটওয়ার্কে থাকে।</p>'),

      callout('note', '<p>গতি একটি প্রকৃত ranking বিবেচনা, কিন্তু একটি মাঝারি বিবেচনা — এটি একটি পাতাকে যথেষ্ট বেশি প্রাসঙ্গিক একটি প্রতিযোগীর উপরে তুলবে না। এটি ঠিক করার জোরালো যুক্তি হলো ধীর পাতা মানুষ কিছু পড়ার আগেই ভিজিটর হারায়, যা কোনো পরিমাণ ranking পূরণ করতে পারে না।</p>', 'এটি অনুপাতে রাখুন'),
    ],
  },
})

lessons.push({
  slug: 'https-and-security',
  sortOrder: 19,
  en: {
    title: 'HTTPS & Site Security',
    metaTitle: 'HTTPS and Site Security for SEO | Learn Computer Academy',
    metaDescription: 'Why HTTPS is a baseline requirement rather than an optimisation, and the redirect mistakes that commonly follow a certificate installation.',
    blocks: [
      p('<p><b>HTTPS</b> encrypts the connection between a visitor\'s browser and your server, so nobody in between can read or alter what is sent. Google confirmed years ago that it is used as a ranking signal — but by now the more important point is that it has become a baseline expectation rather than an advantage.</p>'),

      h(2, 'Why It Is No Longer Optional'),
      p('<p>Browsers mark pages served over plain HTTP as "Not Secure" in the address bar. Forms on such pages trigger additional warnings. Some browser features — geolocation, camera access, service workers — are simply unavailable without a secure context.</p><p>The result is that the ranking benefit is almost beside the point. A visible security warning costs you visitors directly, and it does so at the exact moment someone is deciding whether to trust you with a form submission.</p>'),

      h(2, 'Getting a Certificate'),
      p('<p>Certificates are free. <b>Let\'s Encrypt</b> issues them at no cost, and most hosting providers integrate it directly — often as a single toggle in a control panel, with automatic renewal handled for you. There is no longer a cost argument for staying on HTTP.</p>'),

      h(2, 'The Migration Mistakes'),
      p('<p>Installing a certificate is the easy part. What follows is where sites lose ground:</p><ul><li><b>Not redirecting HTTP to HTTPS.</b> Both versions now serve the site, creating a full duplicate of every page. Every URL needs a permanent (301) redirect from the <code>http://</code> version to the <code>https://</code> one.</li><li><b>Mixed content.</b> An HTTPS page loading an image, script, or stylesheet over HTTP. Browsers block or warn about this, and it often breaks layout or functionality in ways that are easy to miss.</li><li><b>Internal links still hardcoded to <code>http://</code>.</b> They will redirect, but every redirect is a wasted round trip, and it accumulates across a site.</li><li><b>Canonical tags, sitemap entries, and structured data still referencing HTTP URLs.</b> These contradict the redirects and confuse the signal.</li><li><b>Not adding the HTTPS version in Search Console.</b> Search Console treats <code>http://</code> and <code>https://</code> as separate properties — data for the new one will not appear until it is added.</li></ul>'),

      callout('tip', '<p>After any HTTP-to-HTTPS migration, load the site and check the browser console for mixed-content warnings, then check that <code>http://yoursite.com</code> actually lands on the HTTPS version rather than serving a parallel copy. Both checks take a minute and catch the majority of migration problems.</p>'),

      h(2, 'Security Beyond the Certificate'),
      p('<p>A certificate encrypts traffic; it does not make a site secure. A site that gets compromised and starts serving spam or malware can be flagged with a warning in search results, or removed from them entirely — a far larger problem than any ranking factor.</p><p>The basics that prevent this are ordinary maintenance: keep the platform and any plugins updated, use strong unique passwords with two-factor authentication on admin accounts, remove software you no longer use, and keep backups you have actually tested restoring.</p>'),
    ],
  },
  bn: {
    title: 'HTTPS আর সাইট নিরাপত্তা',
    metaTitle: 'SEO-র জন্য HTTPS আর সাইট নিরাপত্তা | Learn Computer Academy',
    metaDescription: 'HTTPS কেন একটি অপ্টিমাইজেশন নয় বরং একটি ভিত্তিগত প্রয়োজনীয়তা, আর একটি সার্টিফিকেট ইনস্টলেশনের পর সাধারণত যে redirect ভুলগুলো হয়।',
    blocks: [
      p('<p><b>HTTPS</b> একজন ভিজিটরের ব্রাউজার আর আপনার সার্ভারের মধ্যে সংযোগ এনক্রিপ্ট করে, যাতে মাঝখানে কেউ যা পাঠানো হচ্ছে তা পড়তে বা বদলাতে না পারে। Google বছর কয়েক আগে নিশ্চিত করেছে এটি একটি ranking সংকেত হিসেবে ব্যবহৃত হয় — কিন্তু এতদিনে বেশি গুরুত্বপূর্ণ বিষয় হলো এটি একটি সুবিধার বদলে একটি ভিত্তিগত প্রত্যাশা হয়ে উঠেছে।</p>'),

      h(2, 'এটি আর ঐচ্ছিক নয় কেন', 'why-it-is-no-longer-optional'),
      p('<p>ব্রাউজার সাধারণ HTTP-তে পরিবেশিত পাতাগুলোকে ঠিকানা বারে "Not Secure" চিহ্নিত করে। এমন পাতার form অতিরিক্ত সতর্কতা তৈরি করে। কিছু ব্রাউজার ফিচার — geolocation, ক্যামেরা অ্যাক্সেস, service worker — একটি নিরাপদ প্রেক্ষাপট ছাড়া সহজভাবে পাওয়া যায় না।</p><p>ফলে ranking সুবিধা প্রায় প্রসঙ্গের বাইরে। একটি দৃশ্যমান নিরাপত্তা সতর্কতা আপনার সরাসরি ভিজিটর নষ্ট করে, আর ঠিক সেই মুহূর্তে করে যখন কেউ একটি form জমা দিয়ে আপনাকে বিশ্বাস করবে কিনা ঠিক করছে।</p>'),

      h(2, 'একটি সার্টিফিকেট পাওয়া', 'getting-a-certificate'),
      p('<p>সার্টিফিকেট বিনামূল্যে। <b>Let\'s Encrypt</b> সেগুলো বিনা খরচে ইস্যু করে, আর বেশিরভাগ hosting প্রদানকারী সরাসরি এটি একীভূত করে — প্রায়ই একটি কন্ট্রোল প্যানেলে একটি একক toggle হিসেবে, আপনার জন্য স্বয়ংক্রিয় নবায়ন সামলে। HTTP-তে থেকে যাওয়ার আর কোনো খরচের যুক্তি নেই।</p>'),

      h(2, 'Migration-এর ভুল', 'the-migration-mistakes'),
      p('<p>একটি সার্টিফিকেট ইনস্টল করা সহজ অংশ। এরপর যা আসে সেখানেই সাইট জায়গা হারায়:</p><ul><li><b>HTTP-কে HTTPS-এ redirect না করা।</b> এখন দুটি সংস্করণই সাইট পরিবেশন করে, প্রতিটি পাতার একটি সম্পূর্ণ নকল তৈরি করে। প্রতিটি URL-এর <code>http://</code> সংস্করণ থেকে <code>https://</code>-এ একটি স্থায়ী (301) redirect দরকার।</li><li><b>Mixed content।</b> একটি HTTPS পাতা HTTP-তে একটি ছবি, স্ক্রিপ্ট, বা stylesheet লোড করছে। ব্রাউজার এটি ব্লক করে বা সতর্ক করে, আর এটি প্রায়ই এমনভাবে লেআউট বা কার্যকারিতা ভাঙে যা সহজে চোখ এড়ায়।</li><li><b>Internal লিংক এখনো <code>http://</code>-এ hardcode করা।</b> সেগুলো redirect হবে, কিন্তু প্রতিটি redirect একটি নষ্ট round trip, আর এটি একটি সাইট জুড়ে জমতে থাকে।</li><li><b>Canonical tag, sitemap এন্ট্রি, আর structured data এখনো HTTP URL উল্লেখ করছে।</b> এগুলো redirect-এর বিরোধিতা করে আর সংকেত বিভ্রান্ত করে।</li><li><b>Search Console-এ HTTPS সংস্করণ যোগ না করা।</b> Search Console <code>http://</code> আর <code>https://</code>-কে আলাদা property হিসেবে গণ্য করে — নতুনটির ডেটা যোগ না করা পর্যন্ত দেখা যাবে না।</li></ul>'),

      callout('tip', '<p>যেকোনো HTTP-থেকে-HTTPS migration-এর পর, সাইটটি লোড করে mixed-content সতর্কতার জন্য ব্রাউজার কনসোল দেখুন, তারপর যাচাই করুন <code>http://yoursite.com</code> একটি সমান্তরাল কপি পরিবেশন না করে আসলে HTTPS সংস্করণে পৌঁছায় কিনা। দুটি যাচাইয়ে এক মিনিট লাগে আর বেশিরভাগ migration সমস্যা ধরে ফেলে।</p>'),

      h(2, 'সার্টিফিকেটের বাইরে নিরাপত্তা', 'security-beyond-the-certificate'),
      p('<p>একটি সার্টিফিকেট ট্রাফিক এনক্রিপ্ট করে; এটি একটি সাইটকে নিরাপদ করে না। যে সাইট আপস হয়ে spam বা malware পরিবেশন করা শুরু করে তাকে সার্চ ফলাফলে একটি সতর্কতা দিয়ে চিহ্নিত করা যেতে পারে, বা সম্পূর্ণ সরিয়ে নেওয়া যেতে পারে — যেকোনো ranking factor-এর চেয়ে অনেক বড় সমস্যা।</p><p>এটি ঠেকানো মূল বিষয়গুলো সাধারণ রক্ষণাবেক্ষণ: প্ল্যাটফর্ম আর যেকোনো plugin আপডেট রাখুন, admin অ্যাকাউন্টে two-factor authentication সহ শক্তিশালী অনন্য পাসওয়ার্ড ব্যবহার করুন, আর ব্যবহার করেন না এমন সফটওয়্যার সরান, আর এমন ব্যাকআপ রাখুন যা আপনি আসলে restore করে পরীক্ষা করেছেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'google-search-console',
  sortOrder: 20,
  en: {
    title: 'Google Search Console',
    metaTitle: 'Google Search Console | Learn Computer Academy',
    metaDescription: 'The free tool that shows what Google actually sees on your site — how to set it up and which reports are worth your attention.',
    blocks: [
      p('<p>Everything so far in this course has been about what you do to a site. <b>Google Search Console</b> is how you find out whether any of it worked. It is free, it is the only source of this data, and it reports things nothing else can tell you.</p>'),

      h(2, 'Setting It Up'),
      p('<p>Add your site as a property and prove you control it. The verification options are:</p><ul><li><b>DNS record</b> — add a TXT record at your domain registrar. Verifies the whole domain including all subdomains, which is why it is generally the best choice.</li><li><b>HTML file</b> — upload a file to your site root.</li><li><b>HTML tag</b> — add a meta tag to your homepage.</li><li><b>Google Analytics or Tag Manager</b> — if either is already installed.</li></ul>'),

      callout('warning', '<p><code>http://</code> and <code>https://</code>, and <code>www</code> and non-<code>www</code>, count as <b>separate properties</b> unless you verify at the domain level with DNS. A common source of confusion is looking at a property that receives none of your actual traffic and concluding the site has no visitors.</p>'),

      h(2, 'The Performance Report'),
      p('<p>This is the one most people use, and it answers questions no other tool can:</p><ul><li><b>Queries</b> — the actual phrases people searched before seeing your site. This is real data, not an estimate, and it regularly reveals terms you never targeted.</li><li><b>Impressions</b> — how often your pages appeared in results.</li><li><b>Clicks</b> — how often someone clicked through.</li><li><b>Average position</b> — where you typically appeared.</li></ul><p>The most useful pattern to look for: pages with many impressions and few clicks. Those are ranking but not being chosen — usually a title and meta description problem, which is a much easier fix than trying to rank higher.</p>'),

      h(2, 'The Pages Report'),
      p('<p>This is where the crawling-versus-indexing distinction from earlier becomes concrete. It splits your URLs into indexed and not-indexed, and for the not-indexed ones it gives a reason — discovered but not crawled, crawled but not indexed, blocked by robots.txt, marked <code>noindex</code>, duplicate without a canonical, and so on.</p><p>When a page is not appearing in search, this report tells you which of those situations you are in, which determines the fix.</p>'),

      h(2, 'Other Reports Worth Knowing'),
      table(
        ['Report', 'Tells you'],
        [
          ['Sitemaps', 'Whether your sitemap was read, and how many of its URLs were indexed'],
          ['Core Web Vitals', 'Real-visitor speed data, grouped into good / needs improvement / poor'],
          ['Enhancements', 'Whether your structured data is valid and which rich results it qualifies for'],
          ['Links', 'Which sites link to you, and which of your pages they link to'],
          ['Manual actions', 'Whether a human reviewer has penalised the site — normally empty, and worth checking if traffic collapses'],
        ]
      ),

      h(2, 'The URL Inspection Tool'),
      p('<p>Paste any URL from your site and it reports that specific page: whether it is indexed, when it was last crawled, which canonical Google chose, whether the mobile version renders correctly, and any structured data found. It also offers a "Request indexing" button, which nudges a new or updated page into the crawl queue.</p>'),

      callout('note', '<p>Search Console only reports data from the point of verification onward — it does not backfill history. That makes setting it up an early task rather than one you get to eventually. A site running for two years without it has two years of unrecoverable data.</p>', 'Set it up sooner rather than later'),
    ],
  },
  bn: {
    title: 'Google Search Console',
    metaTitle: 'Google Search Console | Learn Computer Academy',
    metaDescription: 'বিনামূল্যের টুল যা দেখায় Google আসলে আপনার সাইটে কী দেখে — কীভাবে সেট আপ করবেন আর কোন রিপোর্ট আপনার মনোযোগের যোগ্য।',
    blocks: [
      p('<p>এই কোর্সে এখন পর্যন্ত সবকিছু ছিল আপনি একটি সাইটে কী করেন তা নিয়ে। <b>Google Search Console</b> হলো আপনি কীভাবে জানবেন এর কিছু কাজ করেছে কিনা। এটি বিনামূল্যে, এটিই এই ডেটার একমাত্র উৎস, আর এটি এমন জিনিস জানায় যা আর কিছু আপনাকে বলতে পারে না।</p>'),

      h(2, 'এটি সেট আপ করা', 'setting-it-up'),
      p('<p>আপনার সাইট একটি property হিসেবে যোগ করুন আর প্রমাণ করুন আপনি এটি নিয়ন্ত্রণ করেন। যাচাইয়ের বিকল্পগুলো:</p><ul><li><b>DNS রেকর্ড</b> — আপনার domain registrar-এ একটি TXT রেকর্ড যোগ করুন। সব subdomain সহ পুরো domain যাচাই করে, তাই এটি সাধারণত সেরা পছন্দ।</li><li><b>HTML ফাইল</b> — আপনার সাইট রুটে একটি ফাইল আপলোড করুন।</li><li><b>HTML ট্যাগ</b> — আপনার হোমপেজে একটি meta ট্যাগ যোগ করুন।</li><li><b>Google Analytics বা Tag Manager</b> — এর যেকোনো একটি ইতিমধ্যে ইনস্টল থাকলে।</li></ul>'),

      callout('warning', '<p><code>http://</code> আর <code>https://</code>, আর <code>www</code> আর non-<code>www</code>, <b>আলাদা property</b> হিসেবে গণ্য হয় যদি না আপনি DNS দিয়ে domain স্তরে যাচাই করেন। বিভ্রান্তির একটি সাধারণ উৎস হলো এমন একটি property দেখা যা আপনার আসল ট্রাফিকের কিছুই পায় না আর সিদ্ধান্তে আসা যে সাইটে কোনো ভিজিটর নেই।</p>'),

      h(2, 'Performance রিপোর্ট', 'the-performance-report'),
      p('<p>এটিই বেশিরভাগ মানুষ ব্যবহার করে, আর এটি এমন প্রশ্নের উত্তর দেয় যা অন্য কোনো টুল পারে না:</p><ul><li><b>Query</b> — আপনার সাইট দেখার আগে মানুষ আসলে যে বাক্যাংশ সার্চ করেছে। এটি বাস্তব ডেটা, অনুমান নয়, আর এটি নিয়মিত এমন term প্রকাশ করে যা আপনি কখনো লক্ষ্য করেননি।</li><li><b>Impression</b> — আপনার পাতা কত ঘন ঘন ফলাফলে দেখা গেছে।</li><li><b>Click</b> — কত ঘন ঘন কেউ ক্লিক করেছে।</li><li><b>গড় অবস্থান</b> — আপনি সাধারণত কোথায় দেখা গেছেন।</li></ul><p>খোঁজার মতো সবচেয়ে কাজের প্যাটার্ন: অনেক impression আর কম click যুক্ত পাতা। সেগুলো র‍্যাংক করছে কিন্তু বাছা হচ্ছে না — সাধারণত একটি title আর meta description সমস্যা, যা বেশি উঁচুতে র‍্যাংক করার চেষ্টার চেয়ে অনেক সহজ সমাধান।</p>'),

      h(2, 'Pages রিপোর্ট', 'the-pages-report'),
      p('<p>এখানেই আগের crawling-বনাম-indexing পার্থক্যটি বাস্তব হয়ে ওঠে। এটি আপনার URL-গুলোকে index হওয়া আর না-হওয়ায় ভাগ করে, আর না-হওয়াগুলোর জন্য একটি কারণ দেয় — আবিষ্কৃত কিন্তু crawl হয়নি, crawl হয়েছে কিন্তু index হয়নি, robots.txt দিয়ে ব্লক, <code>noindex</code> চিহ্নিত, canonical ছাড়া নকল, ইত্যাদি।</p><p>একটি পাতা সার্চে না দেখা গেলে, এই রিপোর্ট আপনাকে বলে আপনি সেই পরিস্থিতিগুলোর কোনটিতে আছেন, যা সমাধান নির্ধারণ করে।</p>'),

      h(2, 'জানার মতো অন্য রিপোর্ট', 'other-reports-worth-knowing'),
      table(
        ['রিপোর্ট', 'যা বলে'],
        [
          ['Sitemaps', 'আপনার sitemap পড়া হয়েছে কিনা, আর এর কতগুলো URL index হয়েছে'],
          ['Core Web Vitals', 'বাস্তব-ভিজিটরের গতির ডেটা, ভালো / উন্নতি দরকার / খারাপে দলবদ্ধ'],
          ['Enhancements', 'আপনার structured data বৈধ কিনা আর এটি কোন rich result-এর যোগ্য'],
          ['Links', 'কোন সাইট আপনাকে লিংক করে, আর আপনার কোন পাতায় তারা লিংক করে'],
          ['Manual actions', 'একজন মানুষ পর্যালোচক সাইটটিকে শাস্তি দিয়েছে কিনা — সাধারণত খালি, আর ট্রাফিক ধসে পড়লে দেখার যোগ্য'],
        ]
      ),

      h(2, 'URL Inspection টুল', 'the-url-inspection-tool'),
      p('<p>আপনার সাইটের যেকোনো URL paste করুন আর এটি সেই নির্দিষ্ট পাতাটি জানায়: এটি index হয়েছে কিনা, শেষ কবে crawl হয়েছে, Google কোন canonical বেছেছে, মোবাইল সংস্করণ সঠিকভাবে রেন্ডার হয় কিনা, আর পাওয়া যেকোনো structured data। এটি একটি "Request indexing" বোতামও দেয়, যা একটি নতুন বা আপডেট করা পাতাকে crawl সারিতে ঠেলে দেয়।</p>'),

      callout('note', '<p>Search Console শুধু যাচাইয়ের বিন্দু থেকে ডেটা জানায় — এটি ইতিহাস পূরণ করে না। এটি সেট আপ করাকে শেষে করার বদলে একটি প্রাথমিক কাজ করে তোলে। এটি ছাড়া দুই বছর চলা একটি সাইটের দুই বছরের অপুনরুদ্ধারযোগ্য ডেটা আছে।</p>', 'পরে না করে আগেই সেট আপ করুন'),
    ],
  },
})

lessons.push({
  slug: 'bing-webmaster-tools-and-indexnow',
  sortOrder: 21,
  en: {
    title: 'Bing Webmaster Tools & IndexNow',
    metaTitle: 'Bing Webmaster Tools and IndexNow | Learn Computer Academy',
    metaDescription: 'The search engines beyond Google, and IndexNow — a protocol that lets you tell them about a changed page immediately instead of waiting to be crawled.',
    blocks: [
      p('<p>Google is not the only search engine, and it is not the only one worth setting up for. <b>Bing Webmaster Tools</b> is the equivalent free toolset for Bing, and it comes with something Google does not offer: a way to push updates rather than wait to be crawled.</p>'),

      h(2, 'Why Bother With Bing'),
      p('<p>Bing has a smaller share of search than Google, but three things make it worth the setup time, which is minimal:</p><ul><li>Bing\'s index also powers other search experiences, so coverage extends further than the Bing site itself.</li><li>Bing Webmaster Tools imports your site directly from Search Console, so setup is often a couple of clicks rather than a fresh verification.</li><li>It reports its own crawl and index data, which sometimes surfaces problems Google\'s tools have not flagged.</li></ul><p>The reports mirror Search Console\'s closely — queries and clicks, crawl status, index coverage, sitemap submission — so nothing new has to be learned.</p>'),

      h(2, 'IndexNow'),
      p('<p>Normally, discovery is passive: you publish, and eventually a crawler comes back, notices the change, and updates the index. <b>IndexNow</b> inverts that. It is an open protocol that lets a site notify participating search engines the moment a URL is added, changed, or deleted.</p><p>It is supported by Bing, Yandex, Seznam, and Naver. <b>Google does not participate</b> — this is worth being clear about, because material that implies otherwise is common. For Google, the tools remain your sitemap and the URL Inspection tool.</p>'),

      h(2, 'How It Works'),
      p('<p>The mechanism is deliberately simple. You generate a key, host it as a plain text file at your site root so the engines can verify you control the domain, and then POST a list of changed URLs whenever something changes.</p>'),
      code('json', '{\n  "host": "example.com",\n  "key": "your-generated-key-here",\n  "keyLocation": "https://example.com/your-generated-key-here.txt",\n  "urlList": [\n    "https://example.com/guides/laptop-buying-guide",\n    "https://example.com/guides/new-article"\n  ]\n}'),
      p('<p>That JSON is posted to the IndexNow endpoint. There is no account, no dashboard, and no authentication beyond the key file — hosting the file at the stated location <i>is</i> the proof of ownership.</p>'),

      h(2, 'Where It Fits'),
      p('<p>IndexNow is worth wiring into the publishing process itself rather than running by hand: when a page is published, edited, or deleted, the notification goes out automatically as part of that action. Done that way it costs nothing ongoing and never gets forgotten.</p>'),

      callout('note', '<p>This site does exactly that. Publishing or editing a lesson triggers a webhook that regenerates the affected page and, in the same step, submits its URL to IndexNow. The key file sits at the site root, and a separate one-off script exists for submitting every URL in the sitemap in bulk — useful once, when the integration was first added.</p>', 'How this site does it'),

      h(2, 'A Cautionary Case Study'),
      p('<p>This site is also a useful example of the opposite problem. Before it was rebuilt, it ran for years on its previous platform with no Search Console property, no sitemap, no canonical tags — and, as it turned out, a <code>noindex</code> tag on every single page, left in place from an earlier stage and never removed.</p><p>The site was live, the content was real and useful, and essentially none of it was in Google\'s index. Not because of competition or content quality, but because nothing had ever asked to be indexed, and one stray tag was actively asking not to be.</p><p>The lesson generalises: a site can be entirely invisible for reasons that have nothing to do with ranking. Before optimising anything, confirm that your pages are actually eligible to appear — which is precisely what the tools in this lesson and the last one are for.</p>'),
    ],
  },
  bn: {
    title: 'Bing Webmaster Tools আর IndexNow',
    metaTitle: 'Bing Webmaster Tools আর IndexNow | Learn Computer Academy',
    metaDescription: 'Google-এর বাইরের সার্চ ইঞ্জিন, আর IndexNow — একটি প্রোটোকল যা আপনাকে crawl হওয়ার অপেক্ষা না করে সাথে সাথে একটি বদলে যাওয়া পাতার কথা জানাতে দেয়।',
    blocks: [
      p('<p>Google একমাত্র সার্চ ইঞ্জিন নয়, আর সেট আপ করার যোগ্য একমাত্রও নয়। <b>Bing Webmaster Tools</b> হলো Bing-এর জন্য সমতুল্য বিনামূল্যের টুলসেট, আর এর সাথে এমন কিছু আসে যা Google দেয় না: crawl হওয়ার অপেক্ষা না করে আপডেট push করার একটি উপায়।</p>'),

      h(2, 'Bing নিয়ে মাথা ঘামাবেন কেন', 'why-bother-with-bing'),
      p('<p>Google-এর চেয়ে Bing-এর সার্চের অংশ ছোট, কিন্তু তিনটি জিনিস এটিকে সেট আপের সময়ের যোগ্য করে, যা সামান্য:</p><ul><li>Bing-এর index অন্য সার্চ অভিজ্ঞতাও চালায়, তাই কভারেজ Bing সাইটের নিজের চেয়ে দূরে বিস্তৃত।</li><li>Bing Webmaster Tools সরাসরি Search Console থেকে আপনার সাইট import করে, তাই সেটআপ প্রায়ই একটি নতুন যাচাইয়ের বদলে কয়েকটি ক্লিক।</li><li>এটি নিজস্ব crawl আর index ডেটা জানায়, যা কখনো কখনো এমন সমস্যা সামনে আনে যা Google-এর টুল চিহ্নিত করেনি।</li></ul><p>রিপোর্টগুলো Search Console-এর সাথে ঘনিষ্ঠভাবে মেলে — query আর click, crawl অবস্থা, index কভারেজ, sitemap জমা — তাই নতুন কিছু শিখতে হয় না।</p>'),

      h(2, 'IndexNow'),
      p('<p>সাধারণত, আবিষ্কার নিষ্ক্রিয়: আপনি প্রকাশ করেন, আর শেষে একটি crawler ফিরে আসে, পরিবর্তন লক্ষ্য করে, আর index আপডেট করে। <b>IndexNow</b> এটি উল্টে দেয়। এটি একটি খোলা প্রোটোকল যা একটি সাইটকে একটি URL যোগ, পরিবর্তন, বা মুছে ফেলার মুহূর্তে অংশগ্রহণকারী সার্চ ইঞ্জিনকে জানাতে দেয়।</p><p>এটি Bing, Yandex, Seznam, আর Naver সমর্থন করে। <b>Google অংশগ্রহণ করে না</b> — এই বিষয়ে স্পষ্ট থাকা দরকার, কারণ অন্যরকম ইঙ্গিত দেওয়া উপাদান সাধারণ। Google-এর জন্য, টুল থাকে আপনার sitemap আর URL Inspection টুল।</p>'),

      h(2, 'এটি কীভাবে কাজ করে', 'how-it-works'),
      p('<p>প্রক্রিয়াটি ইচ্ছাকৃতভাবে সহজ। আপনি একটি key তৈরি করেন, সেটি আপনার সাইট রুটে একটি সাধারণ টেক্সট ফাইল হিসেবে রাখেন যাতে ইঞ্জিন যাচাই করতে পারে আপনি domain নিয়ন্ত্রণ করেন, আর তারপর কিছু বদলালেই বদলে যাওয়া URL-এর একটি তালিকা POST করেন।</p>'),
      code('json', '{\n  "host": "example.com",\n  "key": "your-generated-key-here",\n  "keyLocation": "https://example.com/your-generated-key-here.txt",\n  "urlList": [\n    "https://example.com/guides/laptop-buying-guide",\n    "https://example.com/guides/new-article"\n  ]\n}'),
      p('<p>সেই JSON IndexNow endpoint-এ post করা হয়। কোনো অ্যাকাউন্ট নেই, কোনো dashboard নেই, আর key ফাইলের বাইরে কোনো authentication নেই — উল্লিখিত অবস্থানে ফাইলটি রাখাই মালিকানার প্রমাণ।</p>'),

      h(2, 'এটি কোথায় ফিট করে', 'where-it-fits'),
      p('<p>IndexNow হাতে চালানোর বদলে প্রকাশনার প্রক্রিয়ার সাথেই যুক্ত করা সার্থক: একটি পাতা প্রকাশ, সম্পাদনা, বা মুছে ফেলা হলে, বিজ্ঞপ্তিটি সেই কাজের অংশ হিসেবে স্বয়ংক্রিয়ভাবে চলে যায়। এভাবে করলে চলমান কোনো খরচ নেই আর কখনো ভুলে যাওয়া হয় না।</p>'),

      callout('note', '<p>এই সাইট ঠিক তাই করে। একটি পাঠ প্রকাশ বা সম্পাদনা করলে একটি webhook চালু হয় যা প্রভাবিত পাতাটি পুনরায় তৈরি করে আর, একই ধাপে, এর URL IndexNow-তে জমা দেয়। Key ফাইলটি সাইট রুটে থাকে, আর sitemap-এর প্রতিটি URL একসাথে জমা দেওয়ার জন্য একটি আলাদা এক-বারের স্ক্রিপ্ট আছে — একবার কাজে লেগেছিল, যখন সংযোগটি প্রথম যোগ করা হয়।</p>', 'এই সাইট কীভাবে করে'),

      h(2, 'একটি সতর্কতামূলক কেস স্টাডি', 'a-cautionary-case-study'),
      p('<p>এই সাইটটি উল্টো সমস্যারও একটি কাজের উদাহরণ। পুনর্নির্মাণের আগে, এটি বছরের পর বছর আগের প্ল্যাটফর্মে চলেছে কোনো Search Console property ছাড়া, কোনো sitemap ছাড়া, কোনো canonical tag ছাড়া — আর, দেখা গেল, প্রতিটি একক পাতায় একটি <code>noindex</code> ট্যাগসহ, একটি আগের পর্যায় থেকে রয়ে যাওয়া আর কখনো না সরানো।</p><p>সাইটটি লাইভ ছিল, কন্টেন্ট বাস্তব আর কাজের ছিল, আর মূলত এর কিছুই Google-এর index-এ ছিল না। প্রতিযোগিতা বা কন্টেন্টের গুণমানের কারণে নয়, বরং কারণ কিছুই কখনো index হতে বলেনি, আর একটি বিপথগামী ট্যাগ সক্রিয়ভাবে না হতে বলছিল।</p><p>শিক্ষাটি সাধারণীকৃত হয়: একটি সাইট এমন কারণে সম্পূর্ণ অদৃশ্য থাকতে পারে যার ranking-এর সাথে কোনো সম্পর্ক নেই। কিছু অপ্টিমাইজ করার আগে, নিশ্চিত করুন আপনার পাতাগুলো আসলে দেখা যাওয়ার যোগ্য কিনা — যা ঠিক এই পাঠ আর আগেরটির টুলগুলোর কাজ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'measuring-organic-traffic',
  sortOrder: 22,
  en: {
    title: 'Measuring Organic Traffic',
    metaTitle: 'Measuring Organic Search Traffic | Learn Computer Academy',
    metaDescription: 'Which numbers actually tell you whether SEO is working, which ones mislead, and how to judge progress on a realistic timescale.',
    blocks: [
      p('<p>SEO takes long enough to work that it is easy to fool yourself in either direction — declaring success from noise, or abandoning something that was about to pay off. Measuring the right things, over the right timescale, is what prevents both.</p>'),

      h(2, 'The Numbers That Matter'),
      table(
        ['Metric', 'What it tells you', 'Where'],
        [
          ['Organic sessions', 'How many visits came from search', 'Analytics'],
          ['Impressions', 'How often you appeared in results', 'Search Console'],
          ['Clicks', 'How often someone chose you', 'Search Console'],
          ['Click-through rate', 'Whether your listing is compelling', 'Search Console'],
          ['Indexed pages', 'How much of your site is eligible at all', 'Search Console'],
          ['Conversions from organic', 'Whether the traffic is worth anything', 'Analytics'],
        ]
      ),

      h(2, 'Impressions Move First'),
      p('<p>A useful sequence to know, because it stops people giving up too early. When SEO work starts taking effect, <b>impressions</b> usually rise before clicks do — you are appearing for more searches, but often at positions too low to be clicked. Clicks follow as positions improve.</p><p>So rising impressions with flat clicks is not failure. It is the normal first stage, and it means the direction is right.</p>'),

      h(2, 'High Impressions, Low Clicks'),
      p('<p>The single most actionable pattern in Search Console. A page appearing often but rarely clicked is ranking adequately and being passed over. That is usually a listing problem, not a ranking problem — the title is vague, the description does not match what the searcher wanted, or a competitor\'s listing simply reads better.</p><p>Rewriting a title and description is a small change with a fast feedback loop, and it is a far cheaper win than trying to climb positions.</p>'),

      h(2, 'What Not to Chase'),
      p('<ul><li><b>Raw ranking position for one keyword.</b> Rankings vary by location, device, personalisation, and time. A single reported number is a snapshot of one context, not a fact about your site. Whole tools exist to report this precisely, and the precision is somewhat illusory.</li><li><b>Total traffic without segmenting.</b> If you cannot separate organic from direct, referral, and social, you cannot tell what SEO did.</li><li><b>Vanity totals.</b> A page attracting large numbers of visitors who immediately leave and never return is not succeeding, whatever the total says.</li></ul>'),

      callout('note', '<p>Search Console reports a query as a search phrase and reports position averaged across all the contexts it appeared in. That average is more honest than a single rank-tracker number, but it also means small movements in it are often noise rather than signal.</p>'),

      h(2, 'The Right Timescale'),
      p('<p>Meaningful SEO comparisons are month over month, or year over year — not day to day. Daily numbers move for reasons that have nothing to do with your work: weekends, holidays, seasonality, a single link from somewhere busy.</p><p>Year-over-year comparison is particularly useful for anything seasonal, because it compares like with like. A December that is down on November may still be a December well up on last December.</p>'),

      h(2, 'Connecting It to Something Real'),
      p('<p>Traffic is a proxy, not a goal. The question that actually matters is whether search visitors do the thing the site exists for — enquire, buy, sign up, read more, come back. A page bringing modest traffic that converts is worth more than one bringing large traffic that does not.</p><p>This is also the argument for the intent lesson earlier: traffic attracted by content matching the wrong intent tends to look fine in the totals and do nothing useful.</p>'),
    ],
  },
  bn: {
    title: 'Organic ট্রাফিক মাপা',
    metaTitle: 'Organic সার্চ ট্রাফিক মাপা | Learn Computer Academy',
    metaDescription: 'কোন সংখ্যাগুলো আসলে বলে SEO কাজ করছে কিনা, কোনগুলো বিভ্রান্ত করে, আর একটি বাস্তবসম্মত সময়সীমায় অগ্রগতি কীভাবে বিচার করবেন।',
    blocks: [
      p('<p>SEO কাজ করতে যথেষ্ট সময় নেয় যে দুই দিকেই নিজেকে বোকা বানানো সহজ — শব্দ থেকে সাফল্য ঘোষণা করা, বা এমন কিছু ছেড়ে দেওয়া যা ফল দিতে যাচ্ছিল। সঠিক জিনিস, সঠিক সময়সীমায় মাপাই দুটোই ঠেকায়।</p>'),

      h(2, 'যে সংখ্যাগুলো গুরুত্বপূর্ণ', 'the-numbers-that-matter'),
      table(
        ['মেট্রিক', 'যা বলে', 'কোথায়'],
        [
          ['Organic session', 'সার্চ থেকে কতগুলো ভিজিট এসেছে', 'Analytics'],
          ['Impression', 'আপনি কত ঘন ঘন ফলাফলে দেখা গেছেন', 'Search Console'],
          ['Click', 'কত ঘন ঘন কেউ আপনাকে বেছেছে', 'Search Console'],
          ['Click-through rate', 'আপনার listing আকর্ষণীয় কিনা', 'Search Console'],
          ['Index হওয়া পাতা', 'আপনার সাইটের কতটা আদৌ যোগ্য', 'Search Console'],
          ['Organic থেকে conversion', 'ট্রাফিকের কোনো মূল্য আছে কিনা', 'Analytics'],
        ]
      ),

      h(2, 'Impression আগে নড়ে', 'impressions-move-first'),
      p('<p>জানার মতো একটি কাজের ক্রম, কারণ এটি মানুষকে খুব তাড়াতাড়ি হাল ছাড়া থেকে ঠেকায়। SEO কাজ প্রভাব ফেলা শুরু করলে, <b>impression</b> সাধারণত click-এর আগে বাড়ে — আপনি বেশি সার্চের জন্য দেখা যাচ্ছেন, কিন্তু প্রায়ই ক্লিক হওয়ার মতো খুব নিচু অবস্থানে। অবস্থান উন্নত হওয়ার সাথে click আসে।</p><p>তাই সমতল click সহ বাড়তে থাকা impression ব্যর্থতা নয়। এটি স্বাভাবিক প্রথম পর্যায়, আর এর অর্থ দিকটি সঠিক।</p>'),

      h(2, 'বেশি Impression, কম Click', 'high-impressions-low-clicks'),
      p('<p>Search Console-এ সবচেয়ে কাজে লাগানোর মতো প্যাটার্ন। ঘন ঘন দেখা যাওয়া কিন্তু কদাচিৎ ক্লিক হওয়া একটি পাতা যথেষ্ট ভালো র‍্যাংক করছে আর এড়িয়ে যাওয়া হচ্ছে। এটি সাধারণত একটি listing সমস্যা, একটি ranking সমস্যা নয় — title অস্পষ্ট, description সার্চকারী যা চেয়েছিল তার সাথে মেলে না, বা একটি প্রতিযোগীর listing সহজভাবে ভালো পড়া যায়।</p><p>একটি title আর description পুনর্লিখন একটি ছোট পরিবর্তন যার দ্রুত ফিডব্যাক লুপ আছে, আর এটি অবস্থানে ওঠার চেষ্টার চেয়ে অনেক সস্তা জয়।</p>'),

      h(2, 'কী তাড়া করবেন না', 'what-not-to-chase'),
      p('<ul><li><b>একটি keyword-এর কাঁচা ranking অবস্থান।</b> Ranking অবস্থান, ডিভাইস, ব্যক্তিগতকরণ, আর সময় অনুযায়ী বদলায়। একটি একক রিপোর্ট করা সংখ্যা একটি প্রেক্ষাপটের একটি স্ন্যাপশট, আপনার সাইট সম্পর্কে একটি তথ্য নয়। এটি নির্ভুলভাবে জানাতে পুরো টুল আছে, আর নির্ভুলতাটি কিছুটা মায়াবী।</li><li><b>ভাগ না করে মোট ট্রাফিক।</b> Organic-কে direct, referral, আর social থেকে আলাদা করতে না পারলে, SEO কী করেছে তা বলতে পারবেন না।</li><li><b>অহংকারের মোট।</b> যে পাতা বিপুল সংখ্যক ভিজিটর আনে যারা সাথে সাথে চলে যায় আর কখনো ফেরে না তা সফল হচ্ছে না, মোট যাই বলুক।</li></ul>'),

      callout('note', '<p>Search Console একটি query-কে একটি সার্চ বাক্যাংশ হিসেবে জানায় আর এটি যেসব প্রেক্ষাপটে দেখা গেছে সেগুলোর গড় হিসেবে অবস্থান জানায়। সেই গড়টি একটি একক rank-tracker সংখ্যার চেয়ে বেশি সৎ, কিন্তু এর অর্থও যে এতে ছোট নড়াচড়া প্রায়ই সংকেতের বদলে শব্দ।</p>'),

      h(2, 'সঠিক সময়সীমা', 'the-right-timescale'),
      p('<p>অর্থপূর্ণ SEO তুলনা মাসের সাথে মাস, বা বছরের সাথে বছর — দিনে দিনে নয়। দৈনিক সংখ্যা এমন কারণে নড়ে যার আপনার কাজের সাথে কোনো সম্পর্ক নেই: সপ্তাহান্ত, ছুটি, ঋতু, কোনো ব্যস্ত জায়গা থেকে একটি একক লিংক।</p><p>বছরের সাথে বছর তুলনা যেকোনো ঋতুনির্ভর জিনিসের জন্য বিশেষভাবে কাজের, কারণ এটি একই ধরনের সাথে একই ধরনের তুলনা করে। নভেম্বরের চেয়ে নিচে থাকা একটি ডিসেম্বর তবুও গত ডিসেম্বরের চেয়ে অনেক উপরে একটি ডিসেম্বর হতে পারে।</p>'),

      h(2, 'এটি বাস্তব কিছুর সাথে যুক্ত করা', 'connecting-it-to-something-real'),
      p('<p>ট্রাফিক একটি প্রক্সি, একটি লক্ষ্য নয়। আসলে যে প্রশ্নটি গুরুত্বপূর্ণ তা হলো সার্চ ভিজিটররা সাইটটি যার জন্য আছে সেই কাজটি করে কিনা — জিজ্ঞাসা করা, কেনা, সাইন আপ করা, আরও পড়া, ফিরে আসা। যে পাতা মাঝারি ট্রাফিক আনে কিন্তু রূপান্তর করে তা এমন একটির চেয়ে বেশি মূল্যবান যা বিপুল ট্রাফিক আনে কিন্তু করে না।</p><p>এটি আগের intent পাঠেরও যুক্তি: ভুল intent-এর সাথে মেলা কন্টেন্ট দিয়ে আনা ট্রাফিক মোট হিসেবে ভালো দেখায় আর কোনো কাজের কিছু করে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'local-seo',
  sortOrder: 23,
  en: {
    title: 'Local SEO',
    metaTitle: 'Local SEO and Google Business Profile | Learn Computer Academy',
    metaDescription: 'How search works differently for businesses with a physical location, and what actually influences whether you appear in local results.',
    blocks: [
      p('<p>When someone searches for something with a location attached — explicitly ("dentist in Kolkata") or implicitly ("dentist near me") — search engines produce a different kind of result, drawing on a separate set of signals. <b>Local SEO</b> is the work of competing there.</p>'),

      h(2, 'What Makes Local Different'),
      p('<p>Local results typically appear as a map with a small set of businesses listed beside it, above the ordinary organic results. Getting into that set is a distinct problem from ranking a web page, because it draws primarily on a business listing rather than on your website.</p><p>The practical consequence: a business can have a mediocre website and still appear prominently in local results, and a business with an excellent website can be absent from them entirely. They are separate systems that happen to appear on the same page.</p>'),

      img(
        'docs/img/seo/local-seo-1',
        'Diagram of a search results page showing a map with pinned business listings beside it, sitting above the ordinary organic results below',
        1024, 768,
        'Local results draw on a business listing, separately from the organic results beneath them.'
      ),

      h(2, 'Google Business Profile'),
      p('<p>This is the foundation. It is a free listing that controls what appears in the map results and in the panel that shows beside a search for your business name. Without one, you are largely absent from local results regardless of your website.</p><p>What to get right:</p><ul><li><b>Complete every field.</b> Category, address, phone, hours, website, description, services. Incomplete listings compete poorly against complete ones.</li><li><b>Pick the most specific primary category</b> that genuinely fits. "Laptop repair service" is better than "Electronics store" if that is what you do.</li><li><b>Add real photos.</b> Of the actual premises, staff, and work — not stock imagery.</li><li><b>Keep hours accurate</b>, including holidays. Wrong hours produce a very specific kind of unhappy customer.</li><li><b>Verify the listing.</b> Usually by postcard, phone, or email depending on the business type.</li></ul>'),

      h(2, 'NAP Consistency'),
      p('<p><b>NAP</b> stands for Name, Address, Phone — and the point is that these should be written identically everywhere they appear: your website, your Business Profile, directories, social profiles, and any listing site.</p><p>Inconsistencies are usually accidental and small — "Street" in one place and "St." in another, an old phone number left on a directory from years ago, a suite number present in some listings and missing in others. Search engines use these details to work out whether listings refer to the same business, and conflicting information makes that harder to establish.</p>'),

      h(2, 'Reviews'),
      p('<p>Reviews influence both whether people choose you and how prominently you appear. The sustainable approach is straightforward: do work worth reviewing, ask satisfied customers to leave one, make it easy by sending the direct link, and reply to reviews — including negative ones, where a calm and specific response is read by far more people than the reviewer.</p>'),

      callout('warning', '<p>Buying reviews, writing them yourself, or offering incentives in exchange for positive ones violates the policies of every major platform. Beyond the risk of the listing being penalised or removed, review patterns are exactly the kind of thing automated systems are good at detecting.</p>'),

      h(2, 'On Your Own Site'),
      p('<ul><li><b>Put the full address and phone number in the HTML</b>, as text — not inside an image, where nothing can read it.</li><li><b>Add <code>LocalBusiness</code> structured data</b> with address, hours, and phone, as covered in the structured data lesson.</li><li><b>Create a page per location</b> if there is more than one, each with its own address and details, rather than one page listing them all.</li><li><b>Write genuinely local content</b> where it makes sense. Pages about the area you serve are useful to real visitors and reinforce location relevance — but only if they say something. A page repeating a service name against a list of neighbourhoods is a well-known low-quality pattern.</li></ul>'),
    ],
  },
  bn: {
    title: 'Local SEO',
    metaTitle: 'Local SEO আর Google Business Profile | Learn Computer Academy',
    metaDescription: 'ভৌত অবস্থানযুক্ত ব্যবসার জন্য সার্চ কীভাবে ভিন্নভাবে কাজ করে, আর আপনি local ফলাফলে দেখা যাবেন কিনা তা আসলে কী প্রভাবিত করে।',
    blocks: [
      p('<p>কেউ যখন একটি অবস্থান যুক্ত করে কিছু সার্চ করে — স্পষ্টভাবে ("dentist in Kolkata") বা পরোক্ষভাবে ("dentist near me") — সার্চ ইঞ্জিন একটি ভিন্ন ধরনের ফলাফল তৈরি করে, একটি আলাদা সংকেতের সেট থেকে নিয়ে। <b>Local SEO</b> হলো সেখানে প্রতিযোগিতার কাজ।</p>'),

      h(2, 'Local-কে কী ভিন্ন করে', 'what-makes-local-different'),
      p('<p>Local ফলাফল সাধারণত একটি মানচিত্র হিসেবে দেখা যায় যার পাশে অল্প কিছু ব্যবসা তালিকাভুক্ত, সাধারণ organic ফলাফলের উপরে। সেই সেটে ঢোকা একটি ওয়েব পাতা র‍্যাংক করানো থেকে একটি স্বতন্ত্র সমস্যা, কারণ এটি প্রধানত আপনার ওয়েবসাইটের বদলে একটি ব্যবসার listing থেকে নেয়।</p><p>ব্যবহারিক পরিণতি: একটি ব্যবসার একটি মাঝারি ওয়েবসাইট থাকতে পারে আর তবুও local ফলাফলে প্রকটভাবে দেখা যেতে পারে, আর একটি চমৎকার ওয়েবসাইটযুক্ত একটি ব্যবসা সেগুলো থেকে সম্পূর্ণ অনুপস্থিত থাকতে পারে। সেগুলো আলাদা সিস্টেম যেগুলো ঘটনাক্রমে একই পাতায় দেখা যায়।</p>'),

      img(
        'docs/img/seo/local-seo-1',
        'একটি সার্চ ফলাফলের পাতার ডায়াগ্রাম যেখানে পাশে পিন করা ব্যবসার listing সহ একটি মানচিত্র দেখানো হয়েছে, নিচের সাধারণ organic ফলাফলের উপরে',
        1024, 768,
        'Local ফলাফল একটি ব্যবসার listing থেকে নেয়, নিচের organic ফলাফল থেকে আলাদাভাবে।'
      ),

      h(2, 'Google Business Profile', 'google-business-profile'),
      p('<p>এটিই ভিত্তি। এটি একটি বিনামূল্যের listing যা মানচিত্রের ফলাফলে আর আপনার ব্যবসার নামের সার্চের পাশে দেখানো প্যানেলে কী দেখা যায় তা নিয়ন্ত্রণ করে। একটি ছাড়া, আপনার ওয়েবসাইট যাই হোক আপনি local ফলাফল থেকে অনেকটাই অনুপস্থিত।</p><p>যা ঠিক করতে হবে:</p><ul><li><b>প্রতিটি ফিল্ড সম্পূর্ণ করুন।</b> ক্যাটাগরি, ঠিকানা, ফোন, সময়, ওয়েবসাইট, বর্ণনা, সেবা। অসম্পূর্ণ listing সম্পূর্ণগুলোর বিরুদ্ধে খারাপ প্রতিযোগিতা করে।</li><li><b>সবচেয়ে নির্দিষ্ট প্রাথমিক ক্যাটাগরি বাছুন</b> যা সত্যিই মেলে। আপনি যা করেন তা হলে "Electronics store"-এর চেয়ে "Laptop repair service" ভালো।</li><li><b>বাস্তব ছবি যোগ করুন।</b> আসল প্রাঙ্গণ, কর্মী, আর কাজের — stock ছবি নয়।</li><li><b>সময় সঠিক রাখুন</b>, ছুটিসহ। ভুল সময় খুব নির্দিষ্ট একধরনের অসন্তুষ্ট গ্রাহক তৈরি করে।</li><li><b>Listing যাচাই করুন।</b> ব্যবসার ধরন অনুযায়ী সাধারণত পোস্টকার্ড, ফোন, বা ইমেইলে।</li></ul>'),

      h(2, 'NAP ধারাবাহিকতা', 'nap-consistency'),
      p('<p><b>NAP</b> মানে Name, Address, Phone — আর মূল কথা হলো এগুলো যেখানেই দেখা যায় সেখানেই হুবহু একইভাবে লেখা উচিত: আপনার ওয়েবসাইট, আপনার Business Profile, ডিরেক্টরি, সামাজিক প্রোফাইল, আর যেকোনো listing সাইট।</p><p>অসঙ্গতি সাধারণত দুর্ঘটনাজনিত আর ছোট — এক জায়গায় "Street" আর অন্যটিতে "St.", বছর কয়েক আগের একটি ডিরেক্টরিতে রয়ে যাওয়া একটি পুরোনো ফোন নম্বর, কিছু listing-এ উপস্থিত আর অন্যগুলোতে অনুপস্থিত একটি suite নম্বর। সার্চ ইঞ্জিন এই বিবরণ ব্যবহার করে বের করে listing-গুলো একই ব্যবসাকে বোঝায় কিনা, আর পরস্পরবিরোধী তথ্য সেটি প্রতিষ্ঠা করা কঠিন করে।</p>'),

      h(2, 'রিভিউ', 'reviews'),
      p('<p>রিভিউ প্রভাবিত করে মানুষ আপনাকে বাছে কিনা আর আপনি কতটা প্রকটভাবে দেখা যান দুটোই। টেকসই পদ্ধতিটি সরল: রিভিউ করার যোগ্য কাজ করুন, সন্তুষ্ট গ্রাহকদের একটি দিতে বলুন, সরাসরি লিংক পাঠিয়ে সহজ করুন, আর রিভিউর জবাব দিন — নেতিবাচকগুলোসহ, যেখানে একটি শান্ত আর নির্দিষ্ট জবাব রিভিউকারীর চেয়ে অনেক বেশি মানুষ পড়ে।</p>'),

      callout('warning', '<p>রিভিউ কেনা, নিজে লেখা, বা ইতিবাচকগুলোর বিনিময়ে প্রণোদনা দেওয়া প্রতিটি প্রধান প্ল্যাটফর্মের নীতি লঙ্ঘন করে। Listing শাস্তি পাওয়া বা সরিয়ে নেওয়ার ঝুঁকির বাইরেও, রিভিউর প্যাটার্ন ঠিক সেই ধরনের জিনিস যা স্বয়ংক্রিয় সিস্টেম ধরতে ভালো।</p>'),

      h(2, 'আপনার নিজের সাইটে', 'on-your-own-site'),
      p('<ul><li><b>সম্পূর্ণ ঠিকানা আর ফোন নম্বর HTML-এ রাখুন</b>, টেক্সট হিসেবে — একটি ছবির ভেতরে নয়, যেখানে কিছুই সেটি পড়তে পারে না।</li><li><b><code>LocalBusiness</code> structured data যোগ করুন</b> ঠিকানা, সময়, আর ফোনসহ, যেমন structured data পাঠে কভার করা হয়েছে।</li><li><b>একাধিক থাকলে প্রতি অবস্থানে একটি পাতা তৈরি করুন</b>, প্রতিটির নিজস্ব ঠিকানা আর বিবরণসহ, সবগুলো তালিকাভুক্ত একটি পাতার বদলে।</li><li><b>সত্যিকারের local কন্টেন্ট লিখুন</b> যেখানে অর্থপূর্ণ। আপনি যে এলাকায় সেবা দেন সে সম্পর্কে পাতা বাস্তব ভিজিটরের কাজে আসে আর অবস্থানের প্রাসঙ্গিকতা জোরদার করে — কিন্তু শুধু যদি সেগুলো কিছু বলে। পাড়ার একটি তালিকার বিপরীতে একটি সেবার নাম পুনরাবৃত্তি করা একটি পাতা একটি সুপরিচিত নিম্নমানের প্যাটার্ন।</li></ul>'),
    ],
  },
})

lessons.push({
  slug: 'link-building',
  sortOrder: 24,
  en: {
    title: 'Off-Page SEO & Link Building',
    metaTitle: 'Off-Page SEO and Link Building | Learn Computer Academy',
    metaDescription: 'Why links from other sites matter, how to earn them without buying them, and which link tactics carry real risk.',
    blocks: [
      p('<p>Everything so far has been about your own site. <b>Off-page SEO</b> is about signals from elsewhere — principally links from other sites, which have been a core part of how search engines assess pages since the beginning.</p>'),

      h(2, 'Why Links Count'),
      p('<p>A link from one site to another is a kind of vote. Search engines treat it as evidence that someone thought a page was worth pointing at — and because links come from independent parties, they are harder to fake than anything on your own page.</p><p>Not all links weigh the same. A link from a well-established, relevant site carries substantially more than one from an unknown site with no relationship to your subject. A hundred links from low-quality directories are worth less than one from a respected publication in your field.</p>'),

      h(2, 'Ways Links Are Actually Earned'),
      p('<ul><li><b>Publish something worth linking to.</b> Original research, a genuinely useful tool, a thorough guide that does not exist elsewhere. This is slow and it is the only approach that compounds.</li><li><b>Write for other publications.</b> Guest articles on relevant industry sites, where the article is genuinely worth publishing on its own merits.</li><li><b>Be a source.</b> Journalists and bloggers need people who know things. Being reachable and responsive gets you cited.</li><li><b>Local and organisational links.</b> Suppliers, partners, professional bodies, local business associations, sponsorships. These are legitimate, easy to overlook, and often already available to you.</li><li><b>Fix broken links pointing at you.</b> If a site links to a page of yours that has moved, a polite note often gets it corrected.</li><li><b>Unlinked mentions.</b> If someone has written about you without linking, asking usually works.</li></ul>'),

      callout('note', '<p>Every one of these has the same shape: give someone a reason to link, then make it easy. Nothing on the list is a trick, and nothing on it is fast.</p>'),

      h(2, 'What Carries Real Risk'),
      p('<p>Search engine guidelines are explicit that links intended to manipulate rankings are a violation. The main categories:</p><ul><li><b>Buying links</b> that pass ranking credit</li><li><b>Link exchanges</b> at scale — "link to me and I will link to you", repeated</li><li><b>Private blog networks</b> — sites built solely to link to other sites</li><li><b>Automated link building</b> — software posting links across forums and comment sections</li><li><b>Low-quality directory submissions</b> in bulk</li></ul><p>The consequences range from the links simply being ignored, through algorithmic devaluation, to a manual penalty against the site. The risk is real, and it is asymmetric: the upside is a temporary boost, the downside can take a long time to recover from.</p>'),

      h(2, 'Sponsored and User-Generated Links'),
      p('<p>Paying for a link is not automatically a violation — what matters is disclosure. A paid or sponsored link should be marked so search engines know not to treat it as an editorial endorsement:</p>'),
      code('html', '<!-- Paid or sponsored placement -->\n<a href="https://example.com" rel="sponsored">Partner site</a>\n\n<!-- User-submitted content: comments, forum posts -->\n<a href="https://example.com" rel="ugc">A link someone posted</a>\n\n<!-- Generic: do not pass ranking credit -->\n<a href="https://example.com" rel="nofollow">Some link</a>'),
      p('<p>Marked correctly, a paid link is a legitimate advertising arrangement. Unmarked, it is the violation.</p>'),

      h(2, 'A Realistic Expectation'),
      p('<p>Link building is the slowest and least controllable part of SEO, which is precisely why so many shortcuts are sold for it. For most small sites, the honest sequence is: get the on-page and technical work right first, because it is entirely within your control, then earn links gradually by being worth linking to.</p><p>A site with excellent content and few links will usually outperform a site with poor content and purchased links over any meaningful timeframe — and it will not be carrying a risk that surfaces later.</p>'),
    ],
  },
  bn: {
    title: 'Off-Page SEO আর Link Building',
    metaTitle: 'Off-Page SEO আর Link Building | Learn Computer Academy',
    metaDescription: 'অন্য সাইট থেকে লিংক কেন গুরুত্বপূর্ণ, না কিনে কীভাবে সেগুলো অর্জন করবেন, আর কোন লিংক কৌশলে বাস্তব ঝুঁকি আছে।',
    blocks: [
      p('<p>এখন পর্যন্ত সবকিছু ছিল আপনার নিজের সাইট নিয়ে। <b>Off-page SEO</b> অন্যত্র থেকে আসা সংকেত নিয়ে — প্রধানত অন্য সাইট থেকে লিংক, যা শুরু থেকেই সার্চ ইঞ্জিন কীভাবে পাতা মূল্যায়ন করে তার একটি মূল অংশ।</p>'),

      h(2, 'লিংক কেন গণনায় ধরা হয়', 'why-links-count'),
      p('<p>এক সাইট থেকে অন্যটিতে একটি লিংক একধরনের ভোট। সার্চ ইঞ্জিন এটিকে প্রমাণ হিসেবে গণ্য করে যে কেউ ভেবেছে একটি পাতা নির্দেশ করার যোগ্য — আর লিংক স্বাধীন পক্ষ থেকে আসায়, সেগুলো আপনার নিজের পাতার যেকোনো কিছুর চেয়ে নকল করা কঠিন।</p><p>সব লিংকের ওজন এক নয়। একটি সুপ্রতিষ্ঠিত, প্রাসঙ্গিক সাইট থেকে একটি লিংক আপনার বিষয়ের সাথে কোনো সম্পর্ক নেই এমন একটি অজানা সাইটের চেয়ে যথেষ্ট বেশি বহন করে। নিম্নমানের ডিরেক্টরি থেকে একশো লিংক আপনার ক্ষেত্রের একটি সম্মানিত প্রকাশনা থেকে একটির চেয়ে কম মূল্যবান।</p>'),

      h(2, 'লিংক আসলে যেভাবে অর্জিত হয়', 'ways-links-are-actually-earned'),
      p('<ul><li><b>লিংক করার যোগ্য কিছু প্রকাশ করুন।</b> মৌলিক গবেষণা, সত্যিই কাজের একটি টুল, অন্যত্র নেই এমন একটি পুঙ্খানুপুঙ্খ গাইড। এটি ধীর আর এটিই একমাত্র পদ্ধতি যা জমতে থাকে।</li><li><b>অন্য প্রকাশনার জন্য লিখুন।</b> প্রাসঙ্গিক শিল্প সাইটে অতিথি প্রবন্ধ, যেখানে প্রবন্ধটি নিজের যোগ্যতায় প্রকাশের যোগ্য।</li><li><b>একটি উৎস হন।</b> সাংবাদিক আর ব্লগারদের এমন মানুষ দরকার যারা জিনিস জানে। পৌঁছানো যায় আর সাড়া দেন এমন হলে আপনাকে উদ্ধৃত করা হয়।</li><li><b>Local আর প্রাতিষ্ঠানিক লিংক।</b> সরবরাহকারী, অংশীদার, পেশাদার সংস্থা, স্থানীয় ব্যবসায়িক সমিতি, স্পনসরশিপ। এগুলো বৈধ, চোখ এড়ানো সহজ, আর প্রায়ই ইতিমধ্যে আপনার কাছে উপলব্ধ।</li><li><b>আপনার দিকে নির্দেশ করা ভাঙা লিংক ঠিক করুন।</b> একটি সাইট যদি আপনার এমন একটি পাতায় লিংক করে যা সরে গেছে, একটি ভদ্র নোট প্রায়ই সেটি ঠিক করিয়ে দেয়।</li><li><b>লিংক ছাড়া উল্লেখ।</b> কেউ যদি লিংক না করে আপনার সম্পর্কে লিখে থাকে, জিজ্ঞাসা করলে সাধারণত কাজ হয়।</li></ul>'),

      callout('note', '<p>এগুলোর প্রতিটির একই আকৃতি: কাউকে লিংক করার একটি কারণ দিন, তারপর সহজ করে দিন। তালিকার কিছুই একটি কৌশল নয়, আর কিছুই দ্রুত নয়।</p>'),

      h(2, 'কীসে বাস্তব ঝুঁকি', 'what-carries-real-risk'),
      p('<p>সার্চ ইঞ্জিনের নির্দেশিকা স্পষ্ট যে ranking কারসাজির উদ্দেশ্যে লিংক একটি লঙ্ঘন। প্রধান শ্রেণীগুলো:</p><ul><li><b>Ranking কৃতিত্ব পাস করে এমন লিংক কেনা</b></li><li><b>বড় মাপে লিংক বিনিময়</b> — "আমাকে লিংক করুন আর আমি আপনাকে করব", পুনরাবৃত্ত</li><li><b>Private blog network</b> — শুধু অন্য সাইটে লিংক করার জন্য তৈরি সাইট</li><li><b>স্বয়ংক্রিয় link building</b> — ফোরাম আর মন্তব্যের অংশ জুড়ে লিংক পোস্ট করা সফটওয়্যার</li><li><b>একসাথে বিপুল নিম্নমানের ডিরেক্টরি জমা</b></li></ul><p>পরিণতি লিংকগুলো সহজভাবে উপেক্ষিত হওয়া থেকে, অ্যালগরিদমিক অবমূল্যায়ন হয়ে, সাইটের বিরুদ্ধে একটি manual শাস্তি পর্যন্ত বিস্তৃত। ঝুঁকিটি বাস্তব, আর এটি অসম: উপরের দিকটি একটি সাময়িক উত্থান, নিচের দিকটি থেকে বেরোতে অনেক সময় লাগতে পারে।</p>'),

      h(2, 'Sponsored আর User-Generated লিংক', 'sponsored-and-user-generated-links'),
      p('<p>একটি লিংকের জন্য টাকা দেওয়া স্বয়ংক্রিয়ভাবে একটি লঙ্ঘন নয় — যা গুরুত্বপূর্ণ তা হলো প্রকাশ। একটি পেইড বা sponsored লিংক চিহ্নিত করা উচিত যাতে সার্চ ইঞ্জিন জানে এটিকে একটি সম্পাদকীয় সমর্থন হিসেবে গণ্য না করতে:</p>'),
      code('html', '<!-- পেইড বা sponsored placement -->\n<a href="https://example.com" rel="sponsored">Partner site</a>\n\n<!-- ব্যবহারকারী-জমা কন্টেন্ট: মন্তব্য, ফোরাম পোস্ট -->\n<a href="https://example.com" rel="ugc">A link someone posted</a>\n\n<!-- সাধারণ: ranking কৃতিত্ব পাস করবেন না -->\n<a href="https://example.com" rel="nofollow">Some link</a>'),
      p('<p>সঠিকভাবে চিহ্নিত করলে, একটি পেইড লিংক একটি বৈধ বিজ্ঞাপন ব্যবস্থা। চিহ্নিত না করলে, সেটিই লঙ্ঘন।</p>'),

      h(2, 'একটি বাস্তবসম্মত প্রত্যাশা', 'a-realistic-expectation'),
      p('<p>Link building হলো SEO-র সবচেয়ে ধীর আর সবচেয়ে কম নিয়ন্ত্রণযোগ্য অংশ, যে কারণেই এর জন্য এত শর্টকাট বিক্রি হয়। বেশিরভাগ ছোট সাইটের জন্য, সৎ ক্রমটি হলো: আগে on-page আর কারিগরি কাজ ঠিক করুন, কারণ সেটি সম্পূর্ণভাবে আপনার নিয়ন্ত্রণে, তারপর লিংক করার যোগ্য হয়ে ধীরে ধীরে লিংক অর্জন করুন।</p><p>চমৎকার কন্টেন্ট আর কম লিংকযুক্ত একটি সাইট যেকোনো অর্থপূর্ণ সময়সীমায় খারাপ কন্টেন্ট আর কেনা লিংকযুক্ত একটি সাইটকে সাধারণত হারাবে — আর এটি এমন একটি ঝুঁকি বহন করবে না যা পরে সামনে আসে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'seo-mistakes',
  sortOrder: 25,
  en: {
    title: 'SEO Mistakes & Tactics to Avoid',
    metaTitle: 'Common SEO Mistakes and Black-Hat Tactics | Learn Computer Academy',
    metaDescription: 'The errors that quietly cost sites traffic, the outdated advice still circulating, and the tactics that get sites penalised.',
    blocks: [
      p('<p>Three separate categories get mixed together under "SEO mistakes": accidents that cost you traffic, advice that used to be true and no longer is, and deliberate manipulation that carries real risk. They need different responses, so this lesson keeps them apart.</p>'),

      h(2, 'Accidents That Cost Traffic'),
      table(
        ['Mistake', 'Effect'],
        [
          ['<code>Disallow: /</code> left in robots.txt after launch', 'Whole site blocked from crawling'],
          ['<code>noindex</code> left on from staging', 'Pages crawled but never indexed'],
          ['No redirects after changing URLs', 'Links, bookmarks, and accumulated signals all break'],
          ['HTTP not redirected to HTTPS', 'Every page duplicated across two protocols'],
          ['Duplicate titles across many pages', 'Pages look interchangeable; the wrong one ranks'],
          ['Images with no compression', 'Slow pages, poor Core Web Vitals'],
          ['Content only in the desktop layout', 'Invisible under mobile-first indexing'],
        ]
      ),
      p('<p>Every one of these is invisible from the front end — the site looks perfectly fine to a visitor. They are found by checking, which is what the next lesson is about.</p>'),

      h(2, 'Advice That Expired'),
      p('<p>SEO writing has a long tail of material that was accurate years ago and is repeated indefinitely. Things you may still be told to do, which no longer help:</p><ul><li><b>Meta keywords tag.</b> Long ignored by major search engines. Filling it in does nothing at all.</li><li><b>Targeting an exact keyword density.</b> There is no such target, and writing to hit one produces worse text.</li><li><b>Submitting your site to hundreds of directories.</b> A tactic from an earlier web; now, at best, ignored.</li><li><b>Exact-match domains.</b> Buying <code>bestcheaplaptopskolkata.com</code> does not confer ranking on its own.</li><li><b>Article spinning.</b> Rewriting one article into many near-duplicates. Detected easily and treated as spam.</li><li><b>Chasing a single "SEO score" from a tool.</b> These are heuristics invented by tool vendors, not measurements of anything a search engine calculates.</li></ul>'),

      callout('note', '<p>A reliable way to date SEO advice: if it describes a specific number to hit, a checklist that guarantees results, or a way to signal relevance without actually being relevant, it is either old or wrong. The direction of travel has been consistently away from all three.</p>'),

      h(2, 'Tactics That Carry Real Risk'),
      p('<p>These are violations of search engine guidelines, not grey areas:</p><ul><li><b>Hidden text</b> — keywords in white on a white background, positioned off-screen, or set to zero opacity.</li><li><b>Cloaking</b> — showing search engines different content from what visitors see.</li><li><b>Doorway pages</b> — many near-identical pages built to capture variations of a search, all funnelling to the same place.</li><li><b>Buying links</b> that pass ranking credit, without disclosure.</li><li><b>Scraped content</b> — republishing other sites’ material as your own.</li><li><b>Mass-generated content</b> produced at scale with no editing, review, or added value.</li></ul><p>The consequence can be an algorithmic devaluation or a manual penalty. Recovering from either means finding and removing everything involved, then requesting review, and it can take a long time. The trade is a short-term gain against a durable risk.</p>'),

      h(2, 'The Test Worth Applying'),
      p('<p>Before doing anything for SEO reasons, ask: <b>would I still do this if search engines did not exist?</b></p><p>Writing a clear title, structuring a page well, compressing images, making a site fast, linking to a related page where it helps — all of these pass. They are good for visitors, and the search benefit follows from that.</p><p>Repeating a phrase twelve times, generating pages nobody would read, buying links, hiding text — none of them pass. They exist only to influence a machine, and that is precisely the category search engines spend their engineering effort detecting.</p>'),
    ],
  },
  bn: {
    title: 'SEO ভুল আর এড়ানোর কৌশল',
    metaTitle: 'সাধারণ SEO ভুল আর Black-Hat কৌশল | Learn Computer Academy',
    metaDescription: 'যে ভুলগুলো নীরবে সাইটের ট্রাফিক নষ্ট করে, এখনো প্রচলিত সেকেলে পরামর্শ, আর যে কৌশলে সাইট শাস্তি পায়।',
    blocks: [
      p('<p>"SEO ভুল"-এর অধীনে তিনটি আলাদা শ্রেণী মিশে যায়: যে দুর্ঘটনা আপনার ট্রাফিক নষ্ট করে, যে পরামর্শ আগে সত্য ছিল আর এখন নয়, আর ইচ্ছাকৃত কারসাজি যাতে বাস্তব ঝুঁকি আছে। সেগুলোর ভিন্ন প্রতিক্রিয়া দরকার, তাই এই পাঠ সেগুলো আলাদা রাখে।</p>'),

      h(2, 'যে দুর্ঘটনা ট্রাফিক নষ্ট করে', 'accidents-that-cost-traffic'),
      table(
        ['ভুল', 'প্রভাব'],
        [
          ['লঞ্চের পর robots.txt-এ <code>Disallow: /</code> রয়ে যাওয়া', 'পুরো সাইট crawl থেকে ব্লক'],
          ['Staging থেকে <code>noindex</code> রয়ে যাওয়া', 'পাতা crawl হয় কিন্তু কখনো index হয় না'],
          ['URL বদলানোর পর কোনো redirect নেই', 'লিংক, বুকমার্ক, আর জমা সংকেত সব ভেঙে যায়'],
          ['HTTP HTTPS-এ redirect হয়নি', 'প্রতিটি পাতা দুটি প্রোটোকলে নকল'],
          ['অনেক পাতায় একই title', 'পাতা বিনিময়যোগ্য দেখায়; ভুলটি র‍্যাংক করে'],
          ['কম্প্রেশন ছাড়া ছবি', 'ধীর পাতা, খারাপ Core Web Vitals'],
          ['শুধু ডেস্কটপ লেআউটে কন্টেন্ট', 'Mobile-first indexing-এ অদৃশ্য'],
        ]
      ),
      p('<p>এগুলোর প্রতিটি সামনের দিক থেকে অদৃশ্য — সাইটটি একজন ভিজিটরের কাছে পুরোপুরি ঠিক দেখায়। সেগুলো যাচাই করে পাওয়া যায়, যা নিয়েই পরের পাঠ।</p>'),

      h(2, 'যে পরামর্শের মেয়াদ শেষ', 'advice-that-expired'),
      p('<p>SEO লেখায় এমন উপাদানের একটি দীর্ঘ লেজ আছে যা বছর কয়েক আগে সঠিক ছিল আর অনির্দিষ্টকাল পুনরাবৃত্ত হয়। যা করতে আপনাকে এখনো বলা হতে পারে, যা আর সাহায্য করে না:</p><ul><li><b>Meta keywords ট্যাগ।</b> প্রধান সার্চ ইঞ্জিন অনেক আগে থেকে উপেক্ষা করে। এটি পূরণ করলে কিছুই হয় না।</li><li><b>একটি নির্দিষ্ট keyword ঘনত্ব লক্ষ্য করা।</b> এমন কোনো লক্ষ্য নেই, আর একটিতে পৌঁছাতে লিখলে খারাপ লেখা তৈরি হয়।</li><li><b>আপনার সাইট শত শত ডিরেক্টরিতে জমা দেওয়া।</b> একটি আগের ওয়েবের কৌশল; এখন, সর্বোত্তমভাবে, উপেক্ষিত।</li><li><b>Exact-match domain।</b> <code>bestcheaplaptopskolkata.com</code> কেনা নিজে থেকে ranking দেয় না।</li><li><b>Article spinning।</b> একটি প্রবন্ধকে অনেক প্রায়-নকলে পুনর্লিখন। সহজে ধরা পড়ে আর spam হিসেবে গণ্য হয়।</li><li><b>একটি টুল থেকে একটি একক "SEO score" তাড়া করা।</b> এগুলো টুল বিক্রেতাদের আবিষ্কৃত heuristic, একটি সার্চ ইঞ্জিন যা হিসাব করে তার মাপ নয়।</li></ul>'),

      callout('note', '<p>SEO পরামর্শের বয়স বোঝার একটি নির্ভরযোগ্য উপায়: এটি যদি পৌঁছানোর একটি নির্দিষ্ট সংখ্যা, ফলাফল নিশ্চিত করা একটি চেকলিস্ট, বা আসলে প্রাসঙ্গিক না হয়ে প্রাসঙ্গিকতার সংকেত দেওয়ার একটি উপায় বর্ণনা করে, তা হয় পুরোনো নয়তো ভুল। যাত্রার দিক ধারাবাহিকভাবে এই তিনটি থেকেই দূরে সরেছে।</p>'),

      h(2, 'যে কৌশলে বাস্তব ঝুঁকি', 'tactics-that-carry-real-risk'),
      p('<p>এগুলো সার্চ ইঞ্জিন নির্দেশিকার লঙ্ঘন, ধূসর এলাকা নয়:</p><ul><li><b>লুকানো টেক্সট</b> — সাদা পটভূমিতে সাদা keyword, পর্দার বাইরে বসানো, বা শূন্য opacity-তে সেট করা।</li><li><b>Cloaking</b> — ভিজিটর যা দেখে তার থেকে সার্চ ইঞ্জিনকে ভিন্ন কন্টেন্ট দেখানো।</li><li><b>Doorway পাতা</b> — একটি সার্চের রূপভেদ ধরতে তৈরি অনেক প্রায়-একই পাতা, সবগুলো একই জায়গায় পাঠায়।</li><li><b>Ranking কৃতিত্ব পাস করে এমন লিংক কেনা</b>, প্রকাশ ছাড়া।</li><li><b>Scrape করা কন্টেন্ট</b> — অন্য সাইটের উপাদান নিজের বলে পুনঃপ্রকাশ।</li><li><b>বিপুলভাবে তৈরি কন্টেন্ট</b> যা কোনো সম্পাদনা, পর্যালোচনা, বা যোগ করা মূল্য ছাড়া বড় মাপে তৈরি।</li></ul><p>পরিণতি একটি অ্যালগরিদমিক অবমূল্যায়ন বা একটি manual শাস্তি হতে পারে। যেকোনো একটি থেকে বেরোনোর অর্থ জড়িত সবকিছু খুঁজে সরানো, তারপর পর্যালোচনার অনুরোধ, আর এতে অনেক সময় লাগতে পারে। বিনিময়টি একটি স্বল্পমেয়াদি লাভের বিপরীতে একটি স্থায়ী ঝুঁকি।</p>'),

      h(2, 'প্রয়োগের যোগ্য পরীক্ষা', 'the-test-worth-applying'),
      p('<p>SEO-র কারণে কিছু করার আগে, জিজ্ঞাসা করুন: <b>সার্চ ইঞ্জিন না থাকলেও কি আমি এটি করতাম?</b></p><p>একটি স্পষ্ট title লেখা, একটি পাতা ভালোভাবে সাজানো, ছবি কম্প্রেস করা, একটি সাইট দ্রুত করা, যেখানে সাহায্য করে সেখানে একটি সম্পর্কিত পাতায় লিংক করা — এগুলোর সবই পাস করে। সেগুলো ভিজিটরের জন্য ভালো, আর সার্চের সুবিধা তা থেকেই আসে।</p><p>একটি বাক্যাংশ বারো বার পুনরাবৃত্তি করা, কেউ পড়বে না এমন পাতা তৈরি করা, লিংক কেনা, টেক্সট লুকানো — কোনোটিই পাস করে না। সেগুলোর অস্তিত্ব শুধু একটি মেশিনকে প্রভাবিত করতে, আর ঠিক সেই শ্রেণীটিই সার্চ ইঞ্জিন তাদের প্রকৌশল পরিশ্রম ব্যয় করে ধরতে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'seo-audit-checklist',
  sortOrder: 26,
  en: {
    title: 'SEO Audit Checklist — Where This Leaves You',
    metaTitle: 'SEO Audit Checklist | Learn Computer Academy',
    metaDescription: 'A practical checklist pulling the whole course together, ordered so that the things which block everything else get checked first.',
    blocks: [
      p('<p>This course covered a lot of separate pieces. This lesson puts them in the order you would actually work through them on a real site — starting with the things that make everything else irrelevant if they are wrong.</p>'),

      img(
        'docs/img/seo/audit-checklist-1',
        'Diagram of four stacked stages forming a pyramid, from findability at the base through on-page and technical layers up to content at the top',
        1024, 768,
        'Work in stage order — each layer only matters once the one beneath it passes.'
      ),

      h(2, 'Stage 1 — Can It Be Found At All?'),
      p('<p>Nothing else matters until these pass. Every one of them can make an entire site invisible.</p><ul><li>Does <code>yoursite.com/robots.txt</code> exist, and does it <i>not</i> contain <code>Disallow: /</code>?</li><li>Do your pages lack a <code>noindex</code> tag? Check the actual HTML, not the CMS setting.</li><li>Does a sitemap exist and list your real URLs?</li><li>Is the site verified in Google Search Console and Bing Webmaster Tools?</li><li>Does the Pages report show your pages as indexed?</li><li>Does <code>http://</code> redirect to <code>https://</code>, and <code>www</code> resolve consistently one way?</li></ul>'),

      callout('warning', '<p>If a site is getting no search traffic at all, the cause is almost always in this stage — not in content quality or competition. Check these before optimising anything.</p>'),

      h(2, 'Stage 2 — On-Page Fundamentals'),
      p('<ul><li>Does every page have a unique, specific, descriptive <code>&lt;title&gt;</code>?</li><li>Does every important page have a written meta description?</li><li>Is there one <code>&lt;h1&gt;</code> per page, and do heading levels form a sensible outline without skipping?</li><li>Are URLs readable, lowercase, hyphenated, and stable?</li><li>Does each page target one clear topic, matching the intent behind the searches it aims at?</li><li>Do images have descriptive <code>alt</code> text, sensible filenames, and <code>width</code>/<code>height</code> set?</li><li>Are internal links present, descriptive, and not broken?</li></ul>'),

      h(2, 'Stage 3 — Technical Health'),
      p('<ul><li>Do canonical tags point where they should, including self-referencing ones?</li><li>Is there a <code>viewport</code> meta tag, and does the mobile version contain all the content?</li><li>Do Core Web Vitals pass in Search Console’s field data?</li><li>Is structured data present where it applies, and does it validate?</li><li>Are Open Graph tags set so shared links preview properly?</li><li>Do redirects work, and is there no chain of them?</li></ul>'),

      h(2, 'Stage 4 — Content and Beyond'),
      p('<ul><li>Does each page actually answer the search that brings people to it?</li><li>Is the content accurate and current, and is there a habit of revisiting the pages that matter?</li><li>Is there a Google Business Profile, complete and verified, if the business has a location?</li><li>Is NAP information consistent everywhere it appears?</li><li>Are links being earned through work worth linking to, rather than bought?</li></ul>'),

      h(2, 'How to Prioritise'),
      p('<p>Work strictly in stage order. A site failing Stage 1 gains nothing from perfect structured data. A site with excellent technical health and pages that do not answer their search will plateau regardless.</p><p>Within a stage, prioritise by reach: something affecting every page on the site is worth more than something affecting one page, even when the single-page fix looks more satisfying.</p>'),

      h(2, 'What to Expect'),
      p('<p>Results arrive on a scale of weeks and months. Impressions move before clicks. Some things you change will have no measurable effect, and you often will not know which. This is normal, and it is why the discipline of measuring over months rather than days matters so much in this field.</p>'),

      callout('note', '<p>The single most durable idea in this course: search engines are trying to answer questions well. Work that genuinely helps them do that keeps working. Work that only simulates helping stops working, usually without warning. When a new tactic appears, that is the test to apply to it.</p>', 'The thing worth remembering'),
    ],
  },
  bn: {
    title: 'SEO অডিট চেকলিস্ট — এখান থেকে আপনি কোথায়',
    metaTitle: 'SEO অডিট চেকলিস্ট | Learn Computer Academy',
    metaDescription: 'পুরো কোর্স একত্র করা একটি ব্যবহারিক চেকলিস্ট, এমনভাবে সাজানো যাতে যেগুলো বাকি সবকিছু আটকায় সেগুলো আগে যাচাই হয়।',
    blocks: [
      p('<p>এই কোর্স অনেকগুলো আলাদা অংশ কভার করেছে। এই পাঠ সেগুলোকে সেই ক্রমে রাখে যে ক্রমে আপনি আসলে একটি বাস্তব সাইটে কাজ করতেন — সেই জিনিসগুলো দিয়ে শুরু করে যেগুলো ভুল হলে বাকি সবকিছু অপ্রাসঙ্গিক হয়ে যায়।</p>'),

      img(
        'docs/img/seo/audit-checklist-1',
        'একটি পিরামিড তৈরি করা চারটি স্তূপীকৃত পর্যায়ের ডায়াগ্রাম, ভিত্তিতে খুঁজে পাওয়া থেকে on-page আর কারিগরি স্তর হয়ে উপরে কন্টেন্ট পর্যন্ত',
        1024, 768,
        'পর্যায়ের ক্রমে কাজ করুন — প্রতিটি স্তর তখনই গুরুত্বপূর্ণ যখন এর নিচেরটি পাস করে।'
      ),

      h(2, 'পর্যায় ১ — এটি আদৌ খুঁজে পাওয়া যায়?', 'stage-1-can-it-be-found-at-all'),
      p('<p>এগুলো পাস না করা পর্যন্ত আর কিছুই গুরুত্বপূর্ণ নয়। এগুলোর প্রতিটি একটি পুরো সাইটকে অদৃশ্য করতে পারে।</p><ul><li><code>yoursite.com/robots.txt</code> আছে কি, আর এতে <code>Disallow: /</code> <i>নেই</i> তো?</li><li>আপনার পাতায় একটি <code>noindex</code> ট্যাগ নেই তো? CMS সেটিং নয়, আসল HTML যাচাই করুন।</li><li>একটি sitemap আছে আর আপনার আসল URL তালিকাভুক্ত করে?</li><li>সাইটটি Google Search Console আর Bing Webmaster Tools-এ যাচাই করা?</li><li>Pages রিপোর্ট আপনার পাতাগুলো index হওয়া দেখায়?</li><li><code>http://</code> <code>https://</code>-এ redirect হয়, আর <code>www</code> ধারাবাহিকভাবে একদিকে রিজলভ হয়?</li></ul>'),

      callout('warning', '<p>একটি সাইট যদি একেবারেই কোনো সার্চ ট্রাফিক না পায়, কারণটি প্রায় সবসময় এই পর্যায়ে — কন্টেন্টের গুণমান বা প্রতিযোগিতায় নয়। কিছু অপ্টিমাইজ করার আগে এগুলো যাচাই করুন।</p>'),

      h(2, 'পর্যায় ২ — On-Page মূল বিষয়', 'stage-2-on-page-fundamentals'),
      p('<ul><li>প্রতিটি পাতার একটি অনন্য, নির্দিষ্ট, বর্ণনামূলক <code>&lt;title&gt;</code> আছে?</li><li>প্রতিটি গুরুত্বপূর্ণ পাতার একটি লেখা meta description আছে?</li><li>প্রতি পাতায় একটি <code>&lt;h1&gt;</code> আছে, আর heading স্তর কিছু বাদ না দিয়ে একটি যুক্তিসঙ্গত আউটলাইন তৈরি করে?</li><li>URL পঠনযোগ্য, ছোট হাতের, হাইফেনযুক্ত, আর স্থিতিশীল?</li><li>প্রতিটি পাতা একটি স্পষ্ট বিষয় লক্ষ্য করে, যে সার্চের দিকে এটি লক্ষ্য করে তার পেছনের intent-এর সাথে মিলিয়ে?</li><li>ছবিতে বর্ণনামূলক <code>alt</code> টেক্সট, যুক্তিসঙ্গত ফাইলনেম, আর <code>width</code>/<code>height</code> সেট আছে?</li><li>Internal লিংক উপস্থিত, বর্ণনামূলক, আর ভাঙা নয়?</li></ul>'),

      h(2, 'পর্যায় ৩ — কারিগরি স্বাস্থ্য', 'stage-3-technical-health'),
      p('<ul><li>Canonical tag যেখানে উচিত সেখানে নির্দেশ করে, self-referencing গুলোসহ?</li><li>একটি <code>viewport</code> meta ট্যাগ আছে, আর মোবাইল সংস্করণে সব কন্টেন্ট আছে?</li><li>Search Console-এর field ডেটায় Core Web Vitals পাস করে?</li><li>যেখানে প্রযোজ্য সেখানে structured data উপস্থিত, আর এটি validate হয়?</li><li>Open Graph ট্যাগ সেট করা যাতে শেয়ার করা লিংক ঠিকভাবে প্রিভিউ হয়?</li><li>Redirect কাজ করে, আর সেগুলোর কোনো চেইন নেই?</li></ul>'),

      h(2, 'পর্যায় ৪ — কন্টেন্ট আর তার বাইরে', 'stage-4-content-and-beyond'),
      p('<ul><li>প্রতিটি পাতা কি আসলে সেই সার্চের উত্তর দেয় যা মানুষকে এতে আনে?</li><li>কন্টেন্ট সঠিক আর বর্তমান, আর যে পাতাগুলো গুরুত্বপূর্ণ সেগুলো আবার দেখার অভ্যাস আছে?</li><li>ব্যবসার একটি অবস্থান থাকলে একটি Google Business Profile আছে, সম্পূর্ণ আর যাচাই করা?</li><li>NAP তথ্য যেখানেই দেখা যায় সেখানে ধারাবাহিক?</li><li>লিংক কেনার বদলে লিংক করার যোগ্য কাজের মাধ্যমে অর্জিত হচ্ছে?</li></ul>'),

      h(2, 'কীভাবে অগ্রাধিকার দেবেন', 'how-to-prioritise'),
      p('<p>কঠোরভাবে পর্যায়ের ক্রমে কাজ করুন। পর্যায় ১-এ ব্যর্থ একটি সাইট নিখুঁত structured data থেকে কিছুই পায় না। চমৎকার কারিগরি স্বাস্থ্য আর তাদের সার্চের উত্তর দেয় না এমন পাতাযুক্ত একটি সাইট যাই হোক থেমে যাবে।</p><p>একটি পর্যায়ের ভেতরে, নাগাল অনুযায়ী অগ্রাধিকার দিন: সাইটের প্রতিটি পাতাকে প্রভাবিত করে এমন কিছু একটি পাতাকে প্রভাবিত করে এমন কিছুর চেয়ে বেশি মূল্যবান, এমনকি যখন এক-পাতার সমাধানটি বেশি সন্তোষজনক দেখায়।</p>'),

      h(2, 'কী আশা করবেন', 'what-to-expect'),
      p('<p>ফলাফল সপ্তাহ আর মাসের মাপে আসে। Click-এর আগে impression নড়ে। আপনার বদলানো কিছু জিনিসের কোনো মাপযোগ্য প্রভাব থাকবে না, আর আপনি প্রায়ই জানবেন না কোনগুলোর। এটি স্বাভাবিক, আর এই কারণেই এই ক্ষেত্রে দিনের বদলে মাসে মাপার শৃঙ্খলা এত গুরুত্বপূর্ণ।</p>'),

      callout('note', '<p>এই কোর্সের সবচেয়ে স্থায়ী ধারণাটি: সার্চ ইঞ্জিন প্রশ্নের ভালো উত্তর দেওয়ার চেষ্টা করছে। যে কাজ সত্যিই তাদের সেটি করতে সাহায্য করে তা কাজ করতে থাকে। যে কাজ শুধু সাহায্যের ভান করে তা কাজ করা বন্ধ করে, সাধারণত সতর্কতা ছাড়াই। একটি নতুন কৌশল এলে, সেটিই তাতে প্রয়োগের পরীক্ষা।</p>', 'মনে রাখার মতো জিনিস'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'seo').single()
  if (catErr || !category) {
    console.error('Category "seo" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] seo/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] seo/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `seo/${lesson.slug}`
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
