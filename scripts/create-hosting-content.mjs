#!/usr/bin/env node
// New "hosting" category — ~38 lessons, per the outline approved with the
// site owner 2026-08-05 (docs/CONTENT-PIPELINE.md). Prompted directly by a
// gap the site itself created: the Career Skills category (D-72) tells
// students their portfolio needs live, deployed projects, and nothing on
// the site taught how to actually put a site online. This closes that.
//
// Original content — written fresh for this site (CONTENT-PIPELINE.md §3).
//
// ⚠️ PRICING DISCIPLINE — read before editing any lesson with numbers in it.
// Hosting content ages faster than almost anything else on this site:
// provider dashboards, free-tier quotas, and prices change yearly or
// faster. Two rules, agreed with the site owner:
//   1. TEACH TIERS AND RATIOS, NOT FIXED PRICES. "A VPS typically costs
//      several times what shared hosting does" stays true for years.
//      "Provider X costs ₹149/month" is wrong within months. Where a
//      concrete number would genuinely help, it's phrased as an order of
//      magnitude ("a few hundred rupees a month"), never a specific quoted
//      price for a specific named plan.
//   2. FOR FREE TIERS, TEACH THE SHAPE OF THE LIMITS, NOT THE QUOTAS.
//      Every free tier follows the same pattern — generous until a specific
//      wall (bandwidth cap, build minutes, sleeping on idle, no custom
//      domain, no email, no support). The walls are stable and teachable.
//      The exact numbers (100GB vs 100GB vs 1TB) are not, and go stale.
//   3. NEVER RANK OR RECOMMEND A "BEST" PROVIDER. Name providers only as
//      neutral, illustrative examples of a category (shared/VPS/managed/
//      static/CDN), never as a recommendation — that reads as affiliate
//      content and dates instantly as the market shifts.
// Lessons where this discipline is load-bearing are marked with a ⚠️
// PRICE-SENSITIVE comment at the top of their block array — check those
// first on any future refresh pass, per D-73's note that this category
// needs revisiting yearly.
//
// Idempotent — upserts on `path` / `doc_id,locale`. Usage:
//   node scripts/create-hosting-content.mjs [--dry-run]

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
  slug: 'what-happens-when-you-visit-a-website',
  sortOrder: 1,
  en: {
    title: 'What Actually Happens When You Visit a Website',
    metaTitle: 'What Happens When You Visit a Website | Learn Computer Academy',
    metaDescription: 'Typing a URL and getting a page back involves several distinct steps and several separate services. Understanding the whole chain makes everything after this lesson easier.',
    blocks: [
      p('<p>You have built things — HTML pages, PHP scripts, React apps, WordPress sites. All of it, so far, has run on your own computer. This category is about the gap between "it works on my machine" and "anyone in the world can visit it" — and that gap has more pieces than most beginners expect.</p>'),

      h(2, 'The Chain of Events'),
      p('<p>Typing <code>example.com</code> into a browser and getting a page back involves several distinct steps, each handled by a different piece of infrastructure:</p><ol><li>Your browser asks a <b>DNS</b> system to translate the human-readable name <code>example.com</code> into a numeric address.</li><li>That numeric address points to a <b>server</b> — a computer, somewhere, that is turned on and connected to the internet all the time.</li><li>Your browser sends a request to that server, over the internet.</li><li>The server runs whatever software is on it — reads a static file, runs a PHP script, queries a database — and builds a response.</li><li>The response travels back to your browser, which renders it.</li></ol>'),

      img(
        'docs/img/hosting/website-chain-1',
        'Isometric diagram showing a browser sending a request through a DNS lookup step to a server, and the server sending a response back',
        1024, 768,
        'Five steps, several separate systems — none of them run on your own computer.'
      ),

      h(2, 'Why This Matters Before Anything Else'),
      p('<p>Every term in this category attaches to one link in that chain. A <b>domain</b> is the human-readable name. <b>DNS</b> is the translation step. <b>Hosting</b> is the always-on server. <b>Deployment</b> is getting your code onto that server. A <b>CDN</b>, covered later, sits partway along the chain to speed it up. Knowing which piece each term refers to prevents most of the confusion that follows.</p>'),

      h(2, 'What Your Own Computer Cannot Do'),
      p('<p>A website needs to be reachable at any hour, from anywhere, by anyone. Your own laptop fails all three: it is off sometimes, it is usually behind a home network that was never set up to accept outside connections, and even when it is on, your home internet connection was not built to serve thousands of strangers at once.</p><p>Hosting solves exactly this: it is someone else\'s computer, built and configured specifically to stay on and stay reachable, that you rent space on.</p>'),

      callout('note', '<p>Nothing in this category requires deep networking knowledge. It requires knowing what each piece is for, so that when something breaks — and things do break — you know which of these five steps to check first instead of guessing randomly.</p>'),

      h(2, 'Where This Category Goes From Here'),
      p('<p>The next two lessons finish the foundation: the fact that domain, hosting, and email are three separate purchases that only look bundled, and a plain list of what "going live" actually requires. After that, domains and DNS in depth, then hosting types, then the practical work of connecting and deploying, then a walkthrough for each stack you\'ve learned on this site.</p>'),
    ],
  },
  bn: {
    title: 'একটি ওয়েবসাইট ভিজিট করলে আসলে কী ঘটে',
    metaTitle: 'একটি ওয়েবসাইট ভিজিট করলে কী ঘটে | Learn Computer Academy',
    metaDescription: 'একটি URL টাইপ করে একটি পাতা ফেরত পাওয়ার মধ্যে কয়েকটি স্বতন্ত্র ধাপ আর কয়েকটি আলাদা সেবা জড়িত। পুরো শৃঙ্খলটি বোঝা এই পাঠের পরের সবকিছু সহজ করে।',
    blocks: [
      p('<p>আপনি জিনিস তৈরি করেছেন — HTML পাতা, PHP স্ক্রিপ্ট, React অ্যাপ, WordPress সাইট। এখন পর্যন্ত, সবকিছু আপনার নিজের কম্পিউটারে চলেছে। এই বিভাগটি "it works on my machine" আর "পৃথিবীর যে কেউ এটি ভিজিট করতে পারে"-এর মধ্যে ফাঁক নিয়ে — আর সেই ফাঁকে বেশিরভাগ শিক্ষানবিসের প্রত্যাশার চেয়ে বেশি অংশ আছে।</p>'),

      h(2, 'ঘটনার শৃঙ্খল', 'the-chain-of-events'),
      p('<p>একটি ব্রাউজারে <code>example.com</code> টাইপ করা আর একটি পাতা ফেরত পাওয়ায় কয়েকটি স্বতন্ত্র ধাপ জড়িত, প্রতিটি ভিন্ন এক অবকাঠামো দ্বারা সামলানো:</p><ol><li>আপনার ব্রাউজার একটি <b>DNS</b> সিস্টেমকে মানুষের পড়ার যোগ্য নাম <code>example.com</code>-কে একটি সাংখ্যিক ঠিকানায় অনুবাদ করতে বলে।</li><li>সেই সাংখ্যিক ঠিকানাটি একটি <b>সার্ভার</b>-এর দিকে নির্দেশ করে — কোথাও একটি কম্পিউটার, যা সবসময় চালু আর ইন্টারনেটে সংযুক্ত।</li><li>আপনার ব্রাউজার ইন্টারনেটের মাধ্যমে সেই সার্ভারে একটি অনুরোধ পাঠায়।</li><li>সার্ভারটি এতে যা সফটওয়্যার আছে তা চালায় — একটি static ফাইল পড়ে, একটি PHP স্ক্রিপ্ট চালায়, একটি ডেটাবেস কোয়েরি করে — আর একটি রেসপন্স তৈরি করে।</li><li>রেসপন্সটি আপনার ব্রাউজারে ফিরে যায়, যা এটি render করে।</li></ol>'),

      img(
        'docs/img/hosting/website-chain-1',
        'Isometric ডায়াগ্রাম যেখানে একটি ব্রাউজার একটি DNS lookup ধাপের মাধ্যমে একটি সার্ভারে একটি অনুরোধ পাঠাচ্ছে, আর সার্ভারটি একটি রেসপন্স ফেরত পাঠাচ্ছে',
        1024, 768,
        'পাঁচটি ধাপ, কয়েকটি আলাদা সিস্টেম — তাদের কোনোটিই আপনার নিজের কম্পিউটারে চলে না।'
      ),

      h(2, 'অন্য কিছুর আগে এটি কেন গুরুত্বপূর্ণ', 'why-this-matters-before-anything-else'),
      p('<p>এই বিভাগের প্রতিটি term সেই শৃঙ্খলের একটি লিংকের সাথে যুক্ত। একটি <b>ডোমেইন</b> মানুষের পড়ার যোগ্য নাম। <b>DNS</b> অনুবাদ ধাপ। <b>হোস্টিং</b> সবসময়-চালু সার্ভার। <b>ডিপ্লয়মেন্ট</b> সেই সার্ভারে আপনার কোড আনা। পরে কভার করা একটি <b>CDN</b> শৃঙ্খলের মাঝপথে এটি দ্রুত করতে বসে। প্রতিটি term কোন অংশ নির্দেশ করে তা জানা এরপর যা আসে তার বেশিরভাগ বিভ্রান্তি ঠেকায়।</p>'),

      h(2, 'আপনার নিজের কম্পিউটার যা করতে পারে না', 'what-your-own-computer-cannot-do'),
      p('<p>একটি ওয়েবসাইটকে যেকোনো সময়, যেকোনো জায়গা থেকে, যে কারো কাছে পৌঁছানোর যোগ্য হতে হয়। আপনার নিজের ল্যাপটপ তিনটিতেই ব্যর্থ হয়: এটি কখনো কখনো বন্ধ থাকে, এটি সাধারণত একটি হোম নেটওয়ার্কের পেছনে থাকে যা কখনো বাইরের সংযোগ গ্রহণ করার জন্য সেট আপ করা হয়নি, আর এটি চালু থাকলেও, আপনার বাড়ির ইন্টারনেট সংযোগ একসাথে হাজার হাজার অচেনা মানুষকে সেবা দেওয়ার জন্য তৈরি হয়নি।</p><p>হোস্টিং ঠিক এটিই সমাধান করে: এটি অন্য কারো কম্পিউটার, বিশেষভাবে চালু আর পৌঁছানোর যোগ্য থাকতে তৈরি আর কনফিগার করা, যাতে আপনি জায়গা ভাড়া নেন।</p>'),

      callout('note', '<p>এই বিভাগের কিছুতেই গভীর নেটওয়ার্কিং জ্ঞানের প্রয়োজন নেই। এর প্রয়োজন প্রতিটি অংশ কীসের জন্য তা জানা, যাতে কিছু ভেঙে গেলে — আর জিনিস ভাঙে — আপনি জানেন এই পাঁচটি ধাপের কোনটি প্রথমে চেক করতে হবে, এলোমেলো অনুমান না করে।</p>'),

      h(2, 'এই বিভাগ এখান থেকে কোথায় যায়', 'where-this-category-goes-from-here'),
      p('<p>পরের দুই পাঠ ভিত্তি শেষ করে: ডোমেইন, হোস্টিং, আর ইমেইল তিনটি আলাদা কেনাকাটা যা শুধু একত্র দেখায়, আর "লাইভ হওয়া" আসলে কী চায় তার একটি সরল তালিকা। এরপর, গভীরে ডোমেইন আর DNS, তারপর হোস্টিং-এর ধরন, তারপর সংযুক্ত করা আর deploy করার ব্যবহারিক কাজ, তারপর এই সাইটে আপনার শেখা প্রতিটি stack-এর জন্য একটি walkthrough।</p>'),
    ],
  },
})

lessons.push({
  slug: 'domain-hosting-email-are-separate',
  sortOrder: 2,
  en: {
    title: 'Domain, Hosting, and Email Are Three Separate Things',
    metaTitle: 'Domain, Hosting, and Email Are Separate Things | Learn Computer Academy',
    metaDescription: 'The single most confusing thing about going online is that domain, hosting, and email are usually sold together but are genuinely three separate services.',
    blocks: [
      p('<p>Most of the confusion students have about going live traces back to one thing: domain, hosting, and email are usually sold bundled together by the same company, in the same checkout flow, which makes them feel like one purchase. They are not. They are three separate services that happen to be convenient to buy together.</p>'),

      h(2, 'The Three, Separately'),
      table(
        ['Service', 'What it actually is', 'Who commonly sells it'],
        [
          ['Domain', 'A name registered in a global directory, pointing to something', 'Domain registrars'],
          ['Hosting', 'A computer, always on, that runs your website\'s code', 'Hosting companies'],
          ['Email', 'A mailbox and mail server tied to your domain name', 'Email providers'],
        ]
      ),
      p('<p>A single company frequently sells all three as one bundle, which is convenient — but it is a business decision, not a technical requirement. Nothing about how the internet works ties them together.</p>'),

      h(2, 'What Being Separate Actually Means'),
      p('<ul><li>You can buy a domain from one company and host the site with a completely different one.</li><li>You can have hosting with no domain pointed at it yet (accessible only by a temporary address).</li><li>You can have a domain that isn\'t pointed at any hosting at all — it exists, but nothing loads when someone visits it.</li><li>You can run your email through a completely different provider than the one hosting your website — this is extremely common, and often the right choice.</li><li>Moving one does not require moving the others. Changing hosting companies does not mean losing your domain or your email.</li></ul>'),

      img(
        'docs/img/hosting/three-separate-things-1',
        'Isometric diagram showing three distinct labelled blocks — a domain nameplate, a server rack, and a mail envelope icon — connected by dashed lines to a single website, showing they can be swapped independently',
        1024, 768,
        'Domain, hosting, and email are independent pieces that happen to be sold as a bundle.'
      ),

      callout('note', '<p>This single idea resolves most of the "do they come in a package" confusion. They <i>can</i> come in a package, for convenience. They do not <i>have</i> to. Understanding that they are separable is what makes every later decision in this category — which hosting, which registrar, whether to use a third-party email provider — make sense as an independent choice rather than a fixed bundle.</p>', 'The one idea that unlocks the rest'),

      h(2, 'Why This Separation Is Actually Useful'),
      p('<p>Being able to mix and match means you can pick the best fit for each piece rather than accepting whatever one company bundles together: a domain registrar known for low renewal prices, hosting chosen specifically for your tech stack, and an email provider with reliable deliverability — three specialised choices instead of one compromise.</p>'),

      h(2, 'What Connects Them'),
      p('<p>The thing that actually links a domain to hosting and to email is <b>DNS</b> — a set of instructions attached to the domain that says "for web traffic, go here; for email, go there." DNS is covered in depth in its own lessons shortly. For now, the important idea is just that DNS is the connector, and the connector is configurable — which is exactly what makes the three pieces independently swappable.</p>'),
    ],
  },
  bn: {
    title: 'ডোমেইন, হোস্টিং, আর ইমেইল তিনটি আলাদা জিনিস',
    metaTitle: 'ডোমেইন, হোস্টিং, আর ইমেইল আলাদা জিনিস | Learn Computer Academy',
    metaDescription: 'অনলাইনে যাওয়া নিয়ে সবচেয়ে বিভ্রান্তিকর একক জিনিস হলো ডোমেইন, হোস্টিং, আর ইমেইল সাধারণত একসাথে বিক্রি হয় কিন্তু সত্যিই তিনটি আলাদা সেবা।',
    blocks: [
      p('<p>লাইভ হওয়া নিয়ে শিক্ষার্থীদের বেশিরভাগ বিভ্রান্তি একটি জিনিসে ফিরে যায়: ডোমেইন, হোস্টিং, আর ইমেইল সাধারণত একই কোম্পানি একই checkout প্রবাহে একসাথে বান্ডিল করে বিক্রি করে, যা তাদের একটি কেনাকাটার মতো অনুভব করায়। সেগুলো নয়। সেগুলো তিনটি আলাদা সেবা যা ঘটনাক্রমে একসাথে কেনা সুবিধাজনক।</p>'),

      h(2, 'তিনটি, আলাদাভাবে', 'the-three-separately'),
      table(
        ['সেবা', 'এটি আসলে কী', 'সাধারণত কে বিক্রি করে'],
        [
          ['ডোমেইন', 'একটি বৈশ্বিক ডিরেক্টরিতে নিবন্ধিত একটি নাম, কিছুর দিকে নির্দেশ করা', 'Domain registrar'],
          ['হোস্টিং', 'সবসময় চালু একটি কম্পিউটার, যা আপনার ওয়েবসাইটের কোড চালায়', 'হোস্টিং কোম্পানি'],
          ['ইমেইল', 'আপনার ডোমেইন নামের সাথে যুক্ত একটি মেইলবক্স আর মেইল সার্ভার', 'ইমেইল প্রদানকারী'],
        ]
      ),
      p('<p>একটি একক কোম্পানি প্রায়ই তিনটিই একটি বান্ডেল হিসেবে বিক্রি করে, যা সুবিধাজনক — কিন্তু এটি একটি ব্যবসায়িক সিদ্ধান্ত, একটি টেকনিক্যাল প্রয়োজনীয়তা নয়। ইন্টারনেট কীভাবে কাজ করে তার কিছুই তাদের একসাথে বাঁধে না।</p>'),

      h(2, 'আলাদা হওয়ার আসল অর্থ কী', 'what-being-separate-actually-means'),
      p('<ul><li>আপনি একটি কোম্পানি থেকে একটি ডোমেইন কিনতে পারেন আর সম্পূর্ণ ভিন্ন একটি দিয়ে সাইট host করতে পারেন।</li><li>আপনার হোস্টিং থাকতে পারে যাতে এখনো কোনো ডোমেইন নির্দেশ করা নেই (শুধু একটি অস্থায়ী ঠিকানা দিয়ে প্রবেশযোগ্য)।</li><li>আপনার একটি ডোমেইন থাকতে পারে যা একেবারেই কোনো হোস্টিং-এর দিকে নির্দেশ করা নেই — এটির অস্তিত্ব আছে, কিন্তু কেউ ভিজিট করলে কিছুই লোড হয় না।</li><li>আপনি আপনার ওয়েবসাইট host করা প্রদানকারীর চেয়ে সম্পূর্ণ ভিন্ন একটি দিয়ে আপনার ইমেইল চালাতে পারেন — এটি অত্যন্ত সাধারণ, আর প্রায়ই সঠিক পছন্দ।</li><li>একটি সরানো বাকিগুলো সরানো দাবি করে না। হোস্টিং কোম্পানি বদলানোর অর্থ আপনার ডোমেইন বা ইমেইল হারানো নয়।</li></ul>'),

      img(
        'docs/img/hosting/three-separate-things-1',
        'Isometric ডায়াগ্রাম যেখানে তিনটি স্বতন্ত্র লেবেল করা ব্লক — একটি ডোমেইন নেমপ্লেট, একটি সার্ভার rack, আর একটি মেইল খামের আইকন — একটি একক ওয়েবসাইটের সাথে ড্যাশ করা লাইন দিয়ে সংযুক্ত, দেখাচ্ছে সেগুলো স্বাধীনভাবে বদলানো যায়',
        1024, 768,
        'ডোমেইন, হোস্টিং, আর ইমেইল স্বাধীন অংশ যা ঘটনাক্রমে একটি বান্ডেল হিসেবে বিক্রি হয়।'
      ),

      callout('note', '<p>এই একটি ধারণা বেশিরভাগ "do they come in a package" বিভ্রান্তি সমাধান করে। সেগুলো সুবিধার জন্য একটি প্যাকেজে <i>আসতে পারে</i>। সেগুলোর <i>আসতেই হবে</i> এমন নয়। সেগুলো আলাদা করা যায় তা বোঝাই এই বিভাগের পরের প্রতিটি সিদ্ধান্তকে — কোন হোস্টিং, কোন registrar, তৃতীয়-পক্ষের ইমেইল প্রদানকারী ব্যবহার করবেন কিনা — একটি নির্দিষ্ট বান্ডেলের বদলে একটি স্বাধীন পছন্দ হিসেবে অর্থপূর্ণ করে।</p>', 'যে একটি ধারণা বাকিটা খুলে দেয়'),

      h(2, 'এই আলাদাকরণ আসলে কেন কাজের', 'why-this-separation-is-actually-useful'),
      p('<p>মিশিয়ে আর মিলিয়ে বাছতে পারা মানে একটি কোম্পানি একসাথে যা বান্ডিল করে তা মেনে নেওয়ার বদলে প্রতিটি অংশের জন্য সবচেয়ে ভালো মিল বাছতে পারা: কম renewal দামের জন্য পরিচিত একটি domain registrar, বিশেষভাবে আপনার tech stack-এর জন্য বাছা হোস্টিং, আর নির্ভরযোগ্য deliverability-সহ একটি ইমেইল প্রদানকারী — একটি আপসের বদলে তিনটি বিশেষায়িত পছন্দ।</p>'),

      h(2, 'যা তাদের সংযুক্ত করে', 'what-connects-them'),
      p('<p>যা আসলে একটি ডোমেইনকে হোস্টিং আর ইমেইলের সাথে যুক্ত করে তা হলো <b>DNS</b> — ডোমেইনের সাথে যুক্ত নির্দেশনার একটি সেট যা বলে "ওয়েব ট্রাফিকের জন্য, এখানে যাও; ইমেইলের জন্য, ওখানে যাও।" DNS শীঘ্রই নিজস্ব পাঠে গভীরে কভার করা হয়েছে। এখনকার জন্য, গুরুত্বপূর্ণ ধারণাটি শুধু এই যে DNS-ই সংযোগকারী, আর সংযোগকারীটি কনফিগারযোগ্য — যা ঠিক তিনটি অংশকে স্বাধীনভাবে বদলানোর যোগ্য করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'what-going-live-actually-requires',
  sortOrder: 3,
  en: {
    title: 'What "Going Live" Actually Requires',
    metaTitle: 'What Going Live Actually Requires | Learn Computer Academy',
    metaDescription: 'A plain checklist of every piece needed to take a finished project from your own computer to a real, working, public website.',
    blocks: [
      p('<p>Before going deep on each piece individually, here is the whole list in one place — what genuinely has to happen between "the code works on my computer" and "anyone can visit it."</p>'),

      h(2, 'The Full List'),
      table(
        ['Piece', 'What it does', 'Covered in'],
        [
          ['A domain name', 'The address people type or click', 'Domains lessons'],
          ['DNS pointed correctly', 'Tells the internet which server the domain means', 'Domains + Connecting lessons'],
          ['Hosting that fits your stack', 'A server that can actually run your kind of project', 'Hosting lessons'],
          ['Your code, deployed', 'The actual files/app placed on that server', 'Connecting + stack-specific lessons'],
          ['HTTPS / an SSL certificate', 'Encrypts the connection; browsers now expect this by default', 'Security lesson'],
          ['A working database, if your project needs one', 'PHP, WordPress, and most Node apps need this connected and configured', 'Stack-specific lessons'],
          ['Environment variables / secrets set correctly', 'API keys, database passwords — configured on the server, not hardcoded', 'Running-it lessons'],
        ]
      ),

      h(2, 'What Is Optional, At Least at First'),
      p('<p>Email at your domain, a CDN, staging environments, and automated deployment pipelines are all genuinely useful and all covered in this category — but none of them block a first launch. A simple static portfolio site needs only the first five rows of that table. Do not let the full list feel like a prerequisite for starting; it is closer to a map of everything you might eventually need.</p>'),

      callout('note', '<p>Different projects need different subsets of this list. A static HTML portfolio needs almost none of the database and secrets rows. A WordPress site or a Node.js API needs nearly all of it. Part of choosing hosting, covered soon, is matching the hosting to what your specific project actually requires — not over-buying capability you\'ll never use.</p>'),

      h(2, 'A Realistic First Launch'),
      p('<p>For most students\' first real deployment, the honest minimum is: a domain (or a free subdomain from your host, to start), hosting matched to your stack, your code actually placed on that server, and HTTPS turned on. Everything else in this category — CDNs, staging, automated deployment — is worth learning, and worth adding once the basics are comfortable, not before.</p>'),

      h(2, 'How This Category Is Organised'),
      p('<p>Domains and DNS first, since almost everything else refers back to them. Then the different kinds of hosting and how to choose between them, including what things actually cost and what free tiers really offer. Then the practical mechanics of connecting a domain to hosting and getting code onto a server — FTP, SSH, control panels, Git-based deployment. Then a dedicated walkthrough for each stack taught on this site. Then CDNs and edge, security and email, and finally the operational things that matter once a site is live: staging, secrets, backups, and what to do when something breaks.</p>'),
    ],
  },
  bn: {
    title: '"লাইভ হওয়া" আসলে কী দাবি করে',
    metaTitle: 'লাইভ হওয়া আসলে কী দাবি করে | Learn Computer Academy',
    metaDescription: 'আপনার নিজের কম্পিউটার থেকে একটি শেষ প্রোজেক্টকে একটি আসল, কার্যকর, প্রকাশ্য ওয়েবসাইটে নিয়ে যেতে দরকার প্রতিটি অংশের একটি সরল চেকলিস্ট।',
    blocks: [
      p('<p>প্রতিটি অংশ আলাদাভাবে গভীরে যাওয়ার আগে, এখানে পুরো তালিকা একটি জায়গায় — "কোডটি আমার কম্পিউটারে কাজ করে" আর "যে কেউ এটি ভিজিট করতে পারে"-এর মধ্যে আসলে কী ঘটতে হয়।</p>'),

      h(2, 'সম্পূর্ণ তালিকা', 'the-full-list'),
      table(
        ['অংশ', 'এটি কী করে', 'কোথায় কভার করা'],
        [
          ['একটি ডোমেইন নাম', 'মানুষ যে ঠিকানা টাইপ করে বা ক্লিক করে', 'ডোমেইন পাঠ'],
          ['সঠিকভাবে নির্দেশ করা DNS', 'ইন্টারনেটকে বলে ডোমেইনটি কোন সার্ভার বোঝায়', 'ডোমেইন + সংযোগ পাঠ'],
          ['আপনার stack-এর সাথে মানানসই হোস্টিং', 'এমন একটি সার্ভার যা আসলে আপনার ধরনের প্রোজেক্ট চালাতে পারে', 'হোস্টিং পাঠ'],
          ['আপনার কোড, deploy করা', 'সেই সার্ভারে রাখা আসল ফাইল/অ্যাপ', 'সংযোগ + stack-নির্দিষ্ট পাঠ'],
          ['HTTPS / একটি SSL সার্টিফিকেট', 'সংযোগ এনক্রিপ্ট করে; ব্রাউজার এখন ডিফল্টভাবে এটি আশা করে', 'নিরাপত্তা পাঠ'],
          ['একটি কার্যকর ডেটাবেস, আপনার প্রোজেক্টে দরকার হলে', 'PHP, WordPress, আর বেশিরভাগ Node অ্যাপের এটি সংযুক্ত আর কনফিগার করা দরকার', 'Stack-নির্দিষ্ট পাঠ'],
          ['সঠিকভাবে সেট করা environment variable / secret', 'API key, ডেটাবেস পাসওয়ার্ড — সার্ভারে কনফিগার করা, hardcode করা নয়', 'পরিচালনার পাঠ'],
        ]
      ),

      h(2, 'কী ঐচ্ছিক, অন্তত শুরুতে', 'what-is-optional-at-least-at-first'),
      p('<p>আপনার ডোমেইনে ইমেইল, একটি CDN, staging পরিবেশ, আর স্বয়ংক্রিয় deployment pipeline সবই সত্যিই কাজের আর সবই এই বিভাগে কভার করা — কিন্তু এগুলোর কোনোটিই একটি প্রথম launch আটকায় না। একটি সরল static portfolio সাইটে শুধু সেই টেবিলের প্রথম পাঁচ সারি দরকার। সম্পূর্ণ তালিকাটি শুরু করার একটি পূর্বশর্তের মতো মনে হতে দেবেন না; এটি আপনার শেষে যা দরকার হতে পারে তার একটি মানচিত্রের কাছাকাছি।</p>'),

      callout('note', '<p>ভিন্ন প্রোজেক্টে এই তালিকার ভিন্ন উপসেট দরকার। একটি static HTML portfolio-তে ডেটাবেস আর secret সারিগুলোর প্রায় কিছুই দরকার নেই। একটি WordPress সাইট বা একটি Node.js API-তে প্রায় সবকিছুই দরকার। শীঘ্রই কভার করা হোস্টিং বাছার একটি অংশ হলো আপনার নির্দিষ্ট প্রোজেক্ট আসলে কী দাবি করে তার সাথে হোস্টিং মেলানো — কখনো ব্যবহার করবেন না এমন সক্ষমতা বেশি না কেনা।</p>'),

      h(2, 'একটি বাস্তবসম্মত প্রথম Launch', 'a-realistic-first-launch'),
      p('<p>বেশিরভাগ শিক্ষার্থীর প্রথম আসল deployment-এর জন্য, সৎ ন্যূনতম হলো: একটি ডোমেইন (বা শুরু করতে আপনার host থেকে একটি বিনামূল্যের subdomain), আপনার stack-এর সাথে মেলানো হোস্টিং, সেই সার্ভারে আসলে রাখা আপনার কোড, আর চালু করা HTTPS। এই বিভাগের বাকি সবকিছু — CDN, staging, স্বয়ংক্রিয় deployment — শেখার যোগ্য, আর মূল বিষয়গুলো স্বাচ্ছন্দ্যময় হলে যোগ করার যোগ্য, তার আগে নয়।</p>'),

      h(2, 'এই বিভাগ কীভাবে সাজানো', 'how-this-category-is-organised'),
      p('<p>প্রথমে ডোমেইন আর DNS, কারণ প্রায় বাকি সবকিছু তাদের কাছে ফিরে যায়। তারপর বিভিন্ন ধরনের হোস্টিং আর তাদের মধ্যে কীভাবে বাছবেন, জিনিস আসলে কী খরচ করে আর বিনামূল্যের tier আসলে কী দেয় তাসহ। তারপর একটি ডোমেইনকে হোস্টিংয়ের সাথে সংযুক্ত করা আর একটি সার্ভারে কোড আনার ব্যবহারিক প্রক্রিয়া — FTP, SSH, control panel, Git-ভিত্তিক deployment। তারপর এই সাইটে শেখানো প্রতিটি stack-এর জন্য একটি নিবেদিত walkthrough। তারপর CDN আর edge, নিরাপত্তা আর ইমেইল, আর শেষে একটি সাইট লাইভ হলে যা গুরুত্বপূর্ণ হয়ে ওঠে এমন কার্যক্রম বিষয়: staging, secret, backup, আর কিছু ভাঙলে কী করবেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'what-a-domain-name-is',
  sortOrder: 4,
  en: {
    title: 'What a Domain Name Is',
    metaTitle: 'What a Domain Name Is | Learn Computer Academy',
    metaDescription: 'A domain name is a human-readable stand-in for a numeric address, registered in a global directory. What that means in practice, and what owning one entitles you to.',
    blocks: [
      p('<p>Computers on the internet find each other using numeric addresses. A domain name is a human-readable stand-in for one of those addresses — <code>example.com</code> instead of a string of numbers nobody could remember.</p>'),

      h(2, 'The Underlying Address'),
      p('<p>Every server on the internet has an <b>IP address</b> — a number like <code>192.0.2.10</code> that identifies it. That is what computers actually use to find each other. A domain name exists purely for humans; DNS, covered in the next few lessons, is the system that translates the name back into the number a computer needs.</p>'),

      h(2, 'A Global, Shared Directory'),
      p('<p>Domain names are registered in a shared global system, coordinated so that a given name — <code>example.com</code> — can only belong to one person or organisation at a time. Registering one reserves it for you, for as long as you keep renewing it.</p>'),

      callout('warning', '<p>You never truly "own" a domain the way you own a physical object. You are renting the exclusive right to use that name for a period of time — typically renewed yearly — from the registry system. Miss a renewal and it can become available for someone else to register, sometimes within days.</p>', 'Renting, not owning')  ,

      h(2, 'What a Domain Actually Gives You'),
      p('<p>On its own, a registered domain gives you exactly one thing: the exclusive right to that name, and the ability to say where it should point. It does not, by itself, host a website, send email, or do anything visible — it is inert until you connect it to hosting (for a website) and mail servers (for email), both covered later in this category.</p>'),

      h(2, 'Why the Same Name Can Look Different'),
      p('<p>You will often see the same brand with different domains — <code>example.com</code>, <code>example.in</code>, <code>example.co</code>. These are genuinely different domains, registered separately, each pointing wherever its owner configures it to. Owning one does not automatically grant any of the others; a business protecting its name often registers several deliberately.</p>'),

      h(2, 'Where This Leads'),
      p('<p>The next lesson breaks a domain name down into its actual parts — what the "www", the name itself, and the ending all mean structurally — followed by the different categories of endings and what registering one actually involves.</p>'),
    ],
  },
  bn: {
    title: 'একটি ডোমেইন নাম কী',
    metaTitle: 'একটি ডোমেইন নাম কী | Learn Computer Academy',
    metaDescription: 'একটি ডোমেইন নাম একটি সাংখ্যিক ঠিকানার জন্য একটি মানুষের পড়ার যোগ্য প্রতিনিধি, একটি বৈশ্বিক ডিরেক্টরিতে নিবন্ধিত। ব্যবহারিকভাবে এর অর্থ কী, আর একটি থাকা আপনাকে কীসের অধিকার দেয়।',
    blocks: [
      p('<p>ইন্টারনেটে কম্পিউটার সাংখ্যিক ঠিকানা ব্যবহার করে একে অপরকে খুঁজে পায়। একটি ডোমেইন নাম সেই ঠিকানাগুলোর একটির জন্য একটি মানুষের পড়ার যোগ্য প্রতিনিধি — <code>example.com</code>, সংখ্যার একটি স্ট্রিংয়ের বদলে যা কেউ মনে রাখতে পারত না।</p>'),

      h(2, 'অন্তর্নিহিত ঠিকানা', 'the-underlying-address'),
      p('<p>ইন্টারনেটে প্রতিটি সার্ভারের একটি <b>IP ঠিকানা</b> আছে — <code>192.0.2.10</code>-এর মতো একটি সংখ্যা যা এটিকে শনাক্ত করে। এটিই কম্পিউটার আসলে একে অপরকে খুঁজে পেতে ব্যবহার করে। একটি ডোমেইন নামের অস্তিত্ব শুধু মানুষের জন্য; পরের কয়েক পাঠে কভার করা DNS হলো সেই সিস্টেম যা নামটিকে একটি কম্পিউটারের দরকার সংখ্যায় ফিরিয়ে অনুবাদ করে।</p>'),

      h(2, 'একটি বৈশ্বিক, শেয়ার করা ডিরেক্টরি', 'a-global-shared-directory'),
      p('<p>ডোমেইন নাম একটি শেয়ার করা বৈশ্বিক সিস্টেমে নিবন্ধিত, এমনভাবে সমন্বিত যাতে একটি নির্দিষ্ট নাম — <code>example.com</code> — একবারে শুধু একজন ব্যক্তি বা প্রতিষ্ঠানের হতে পারে। একটি নিবন্ধন করা এটি আপনার জন্য সংরক্ষণ করে, যতক্ষণ আপনি renew করতে থাকেন।</p>'),

      callout('warning', '<p>আপনি কখনো সত্যিই একটি ডোমেইন "মালিকানা" পান না যেভাবে আপনি একটি ভৌত বস্তুর মালিকানা পান। আপনি একটি নির্দিষ্ট সময়ের জন্য — সাধারণত বছরে renew করা — সেই নাম ব্যবহারের একচেটিয়া অধিকার registry সিস্টেম থেকে ভাড়া নিচ্ছেন। একটি renewal মিস করুন আর এটি অন্য কারো নিবন্ধনের জন্য উপলব্ধ হয়ে যেতে পারে, কখনো কয়েক দিনের মধ্যে।</p>', 'ভাড়া, মালিকানা নয়'),

      h(2, 'একটি ডোমেইন আসলে আপনাকে কী দেয়', 'what-a-domain-actually-gives-you'),
      p('<p>নিজে থেকে, একটি নিবন্ধিত ডোমেইন আপনাকে ঠিক একটি জিনিস দেয়: সেই নামের একচেটিয়া অধিকার, আর এটি কোথায় নির্দেশ করা উচিত তা বলার ক্ষমতা। এটি নিজে থেকে একটি ওয়েবসাইট host করে না, ইমেইল পাঠায় না, বা দৃশ্যমান কিছু করে না — এটি নিষ্ক্রিয় থাকে যতক্ষণ না আপনি এটিকে হোস্টিং-এর সাথে (একটি ওয়েবসাইটের জন্য) আর মেইল সার্ভারের সাথে (ইমেইলের জন্য) সংযুক্ত করেন, দুটোই এই বিভাগে পরে কভার করা।</p>'),

      h(2, 'একই নাম কেন ভিন্ন দেখাতে পারে', 'why-the-same-name-can-look-different'),
      p('<p>আপনি প্রায়ই একই ব্র‍্যান্ডকে ভিন্ন ডোমেইনসহ দেখবেন — <code>example.com</code>, <code>example.in</code>, <code>example.co</code>। এগুলো সত্যিই ভিন্ন ডোমেইন, আলাদাভাবে নিবন্ধিত, প্রতিটি এর মালিক যেখানে কনফিগার করে সেখানে নির্দেশ করে। একটির মালিকানা স্বয়ংক্রিয়ভাবে অন্যগুলোর কোনোটির অধিকার দেয় না; নিজের নাম রক্ষা করা একটি ব্যবসা প্রায়ই ইচ্ছাকৃতভাবে কয়েকটি নিবন্ধন করে।</p>'),

      h(2, 'এটি কোথায় নিয়ে যায়', 'where-this-leads'),
      p('<p>পরের পাঠ একটি ডোমেইন নামকে এর আসল অংশে ভেঙে দেয় — "www", নাম নিজেই, আর শেষের অংশটি কাঠামোগতভাবে কী বোঝায় — তারপর শেষের ভিন্ন শ্রেণী আর একটি নিবন্ধন করা আসলে কী জড়িত।</p>'),
    ],
  },
})

lessons.push({
  slug: 'the-parts-of-a-domain',
  sortOrder: 5,
  en: {
    title: 'The Parts of a Domain',
    metaTitle: 'The Parts of a Domain Name | Learn Computer Academy',
    metaDescription: 'Breaking down blog.example.co.in into its actual named parts — subdomain, second-level domain, and top-level domain — and what each one means.',
    blocks: [
      p('<p>A domain like <code>blog.example.co.in</code> looks like one string, but it is built from named, nested parts, read right to left. Knowing the parts makes DNS records, in a later lesson, far easier to understand.</p>'),

      img(
        'docs/img/hosting/domain-parts-1',
        'Isometric diagram labelling the parts of a domain name blog.example.com from right to left: top-level domain, second-level domain, and subdomain, each as a stacked labelled block',
        1024, 768,
        'Read right to left: the top-level domain, then the name you registered, then any subdomain in front of it.'
      ),

      h(2, 'The Parts, Right to Left'),
      table(
        ['Part', 'In blog.example.com', 'What it is'],
        [
          ['Top-level domain (TLD)', '.com', 'The broadest category, assigned by a global authority — covered in depth next lesson'],
          ['Second-level domain (SLD)', 'example', 'The actual name you register and pay for'],
          ['Subdomain', 'blog.', 'A free, optional prefix you create yourself, pointing anywhere you like'],
        ]
      ),
      p('<p>You register the second-level domain plus the top-level domain together — <code>example.com</code> as a unit. Everything in front of that, like <code>blog.</code> or <code>shop.</code>, is a subdomain you create for free, entirely under your own control, once you own the base domain.</p>'),

      h(2, 'What Subdomains Are Actually For'),
      p('<p>A subdomain is a free way to split your site into logically separate sections that can even point at entirely different hosting:</p>'),
      table(
        ['Subdomain', 'Common use'],
        [
          ['www.example.com', 'The conventional address for the main site — often set to behave identically to the bare domain'],
          ['blog.example.com', 'A separate blog, sometimes on entirely different software or hosting'],
          ['shop.example.com', 'A separate store platform'],
          ['api.example.com', 'A backend API, served separately from the main website'],
          ['mail.example.com', 'Often used for webmail access'],
        ]
      ),
      p('<p>Because each subdomain can point anywhere independently, a single domain can quietly be serving several completely different platforms behind the scenes — a marketing site on one host, a blog on another, an API on a third — while looking like one seamless site to a visitor.</p>'),

      h(2, 'www or Not?'),
      p('<p><code>www.example.com</code> and the bare <code>example.com</code> are, technically, two different addresses — <code>www</code> is just a conventional subdomain, left over from the early web. Most sites configure both to work and redirect to one consistent version, so a visitor never notices the difference. Picking one as canonical and redirecting the other is a small, standard setup step covered in the connecting-a-domain lesson.</p>'),

      callout('note', '<p>A domain can technically be registered with more than one dot before the TLD in some cases — <code>example.co.in</code> is a real pattern, not a typo, covered in the next lesson on TLD types. The parts described here still apply; the base registered name is just slightly longer.</p>'),
    ],
  },
  bn: {
    title: 'একটি ডোমেইনের অংশ',
    metaTitle: 'একটি ডোমেইন নামের অংশ | Learn Computer Academy',
    metaDescription: 'blog.example.co.in-কে এর আসল নামযুক্ত অংশে ভেঙে দেওয়া — subdomain, second-level domain, আর top-level domain — আর প্রতিটির অর্থ কী।',
    blocks: [
      p('<p><code>blog.example.co.in</code>-এর মতো একটি ডোমেইন একটি স্ট্রিং-এর মতো দেখায়, কিন্তু এটি নামযুক্ত, নেস্ট করা অংশ দিয়ে তৈরি, ডান থেকে বাম পড়া। অংশগুলো জানা পরের একটি পাঠে DNS রেকর্ড অনেক সহজ বোঝায়।</p>'),

      img(
        'docs/img/hosting/domain-parts-1',
        'Isometric ডায়াগ্রাম যেখানে blog.example.com ডোমেইন নামের অংশগুলো ডান থেকে বামে লেবেল করা: top-level domain, second-level domain, আর subdomain, প্রতিটি একটি স্তূপীকৃত লেবেল করা ব্লক হিসেবে',
        1024, 768,
        'ডান থেকে বামে পড়ুন: top-level domain, তারপর আপনার নিবন্ধিত নাম, তারপর এর সামনে যেকোনো subdomain।'
      ),

      h(2, 'অংশগুলো, ডান থেকে বামে', 'the-parts-right-to-left'),
      table(
        ['অংশ', 'blog.example.com-এ', 'এটি কী'],
        [
          ['Top-level domain (TLD)', '.com', 'সবচেয়ে বিস্তৃত শ্রেণী, একটি বৈশ্বিক কর্তৃপক্ষ দ্বারা নির্ধারিত — পরের পাঠে গভীরে কভার করা'],
          ['Second-level domain (SLD)', 'example', 'আপনার নিবন্ধন আর টাকা দেওয়া আসল নাম'],
          ['Subdomain', 'blog.', 'একটি বিনামূল্যের, ঐচ্ছিক প্রিফিক্স যা আপনি নিজে তৈরি করেন, যেখানে ইচ্ছা নির্দেশ করে'],
        ]
      ),
      p('<p>আপনি second-level domain আর top-level domain একসাথে নিবন্ধন করেন — <code>example.com</code> একটি একক হিসেবে। এর সামনে সবকিছু, যেমন <code>blog.</code> বা <code>shop.</code>, একটি subdomain যা আপনি বিনামূল্যে তৈরি করেন, সম্পূর্ণ আপনার নিজের নিয়ন্ত্রণে, একবার আপনি বেস ডোমেইনের মালিক হলে।</p>'),

      h(2, 'Subdomain আসলে কীসের জন্য', 'what-subdomains-are-actually-for'),
      p('<p>একটি subdomain আপনার সাইটকে যৌক্তিকভাবে আলাদা অংশে ভাগ করার একটি বিনামূল্যের উপায় যা এমনকি সম্পূর্ণ ভিন্ন হোস্টিং-এর দিকেও নির্দেশ করতে পারে:</p>'),
      table(
        ['Subdomain', 'সাধারণ ব্যবহার'],
        [
          ['www.example.com', 'প্রধান সাইটের প্রথাগত ঠিকানা — প্রায়ই খালি ডোমেইনের মতো একই আচরণ করতে সেট করা'],
          ['blog.example.com', 'একটি আলাদা ব্লগ, কখনো সম্পূর্ণ ভিন্ন সফটওয়্যার বা হোস্টিংয়ে'],
          ['shop.example.com', 'একটি আলাদা দোকান প্ল্যাটফর্ম'],
          ['api.example.com', 'একটি backend API, প্রধান ওয়েবসাইট থেকে আলাদাভাবে পরিবেশিত'],
          ['mail.example.com', 'প্রায়ই webmail প্রবেশাধিকারের জন্য ব্যবহৃত'],
        ]
      ),
      p('<p>প্রতিটি subdomain স্বাধীনভাবে যেকোনো জায়গায় নির্দেশ করতে পারে বলে, একটি একক ডোমেইন পর্দার পেছনে চুপচাপ কয়েকটি সম্পূর্ণ ভিন্ন প্ল্যাটফর্ম সেবা দিতে পারে — একটি host-এ একটি মার্কেটিং সাইট, অন্যটিতে একটি ব্লগ, তৃতীয়টিতে একটি API — একজন ভিজিটরের কাছে একটি নির্বিঘ্ন সাইটের মতো দেখতে দেখতেই।</p>'),

      h(2, 'www নাকি না?', 'www-or-not'),
      p('<p><code>www.example.com</code> আর খালি <code>example.com</code> প্রযুক্তিগতভাবে দুটি ভিন্ন ঠিকানা — <code>www</code> শুধু একটি প্রথাগত subdomain, প্রাথমিক ওয়েব থেকে রয়ে যাওয়া। বেশিরভাগ সাইট দুটিকেই কাজ করতে আর একটি ধারাবাহিক সংস্করণে redirect করতে কনফিগার করে, তাই একজন ভিজিটর কখনো পার্থক্য লক্ষ্য করেন না। একটিকে canonical হিসেবে বাছা আর অন্যটি redirect করা একটি ছোট, আদর্শ সেটআপ ধাপ যা একটি ডোমেইন সংযুক্ত করার পাঠে কভার করা।</p>'),

      callout('note', '<p>কিছু ক্ষেত্রে একটি ডোমেইন প্রযুক্তিগতভাবে TLD-এর আগে একাধিক dot দিয়ে নিবন্ধিত হতে পারে — <code>example.co.in</code> একটি আসল প্যাটার্ন, টাইপো নয়, TLD ধরন নিয়ে পরের পাঠে কভার করা। এখানে বর্ণিত অংশগুলো তবুও প্রযোজ্য; বেস নিবন্ধিত নামটি শুধু সামান্য লম্বা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'types-of-domains',
  sortOrder: 6,
  en: {
    title: 'Types of Domains',
    metaTitle: 'Types of Domains — gTLD, ccTLD, and New TLDs | Learn Computer Academy',
    metaDescription: 'The difference between .com, .in, .dev, and everything else — what each category of top-level domain signals and how they are actually managed.',
    blocks: [
      p('<p>The part after the last dot — the top-level domain, or TLD — falls into a few broad categories. Knowing which is which helps when choosing a domain, and explains why some endings feel more "official" than others.</p>'),

      h(2, 'Generic TLDs (gTLDs)'),
      p('<p>Open to registration by anyone, anywhere, with no geographic or organisational restriction. <code>.com</code>, <code>.net</code>, and <code>.org</code> are the oldest and most familiar; <code>.com</code> in particular is often treated as the default by users, even when it has no special technical meaning.</p>'),

      h(2, 'Country-Code TLDs (ccTLDs)'),
      p('<p>Assigned to a specific country or territory — <code>.in</code> for India, <code>.uk</code> for the United Kingdom, <code>.us</code> for the United States. Each is managed by an organisation designated for that country, and rules vary: some ccTLDs are open to anyone worldwide, others require local presence or documentation to register.</p>'),
      table(
        ['TLD', 'Notes for India specifically'],
        [
          ['.in', 'India\'s general-purpose ccTLD, open registration, widely used by Indian businesses'],
          ['.co.in', 'A subcategory under .in, historically used similarly to .com'],
          ['.org.in', 'Intended for organisations, similar spirit to the generic .org'],
          ['.net.in', 'Intended for network/infrastructure-related entities, though used loosely in practice'],
        ]
      ),
      p('<p>A ccTLD like <code>.in</code> signals a connection to that country, which can build trust with a local audience specifically — genuinely useful for a business primarily serving Indian customers.</p>'),

      h(2, 'New/Sponsored/Specialty TLDs'),
      p('<p>In recent years, hundreds of new endings have become available — <code>.dev</code>, <code>.app</code>, <code>.io</code>, <code>.tech</code>, <code>.store</code>, <code>.blog</code>, and many more. Some are lightly restricted (<code>.dev</code> and <code>.app</code> require HTTPS to be enabled, for instance) and some carry a specific connotation (<code>.io</code> is popular with tech startups, <code>.store</code> signals a shop) without any strict eligibility rules attached.</p>'),

      img(
        'docs/img/hosting/tld-types-1',
        'Isometric diagram showing three labelled groups of domain endings — generic TLDs, country-code TLDs, and specialty TLDs — as separate clusters of small nameplate blocks',
        1024, 768,
        'Three broad categories of ending, each with different rules and different signals.'
      ),

      h(2, 'Does the TLD Affect Search Ranking?'),
      p('<p>Search engines do not give <code>.com</code> a general ranking advantage over other legitimate TLDs on the strength of the ending alone — this site\'s <a href="/seo/">SEO course</a> covers what actually matters for ranking, and TLD choice is not one of the significant factors. The main real-world consideration is what a human visitor assumes or trusts when they see it, not an algorithm.</p>'),

      callout('tip', '<p>For most students building a portfolio or a first small business site, availability and price usually decide it more than any technical difference between TLDs. <code>.com</code> tends to be the most contested and thus the most likely to already be taken; a ccTLD like <code>.in</code>, or a newer TLD that fits the project, is often both available and perfectly legitimate.</p>'),

      h(2, 'Who Actually Manages All of This'),
      p('<p>A global body coordinates the overall domain name system and delegates each TLD to a specific registry organisation responsible for it. Individual domain names within a TLD are then sold to the public through accredited registrars — the companies covered in the next lesson, where you\'ll actually register one.</p>'),
    ],
  },
  bn: {
    title: 'ডোমেইনের ধরন',
    metaTitle: 'ডোমেইনের ধরন — gTLD, ccTLD, আর নতুন TLD | Learn Computer Academy',
    metaDescription: '.com, .in, .dev, আর বাকি সবকিছুর মধ্যে পার্থক্য — top-level domain-এর প্রতিটি শ্রেণী কী সংকেত দেয় আর সেগুলো আসলে কীভাবে পরিচালিত হয়।',
    blocks: [
      p('<p>শেষ dot-এর পরের অংশ — top-level domain, বা TLD — কয়েকটি বিস্তৃত শ্রেণীতে পড়ে। কোনটি কী তা জানা একটি ডোমেইন বাছার সময় সাহায্য করে, আর ব্যাখ্যা করে কিছু শেষ কেন অন্যগুলোর চেয়ে বেশি "আনুষ্ঠানিক" মনে হয়।</p>'),

      h(2, 'Generic TLD (gTLD)', 'generic-tlds-gtlds'),
      p('<p>কোনো ভৌগোলিক বা প্রাতিষ্ঠানিক সীমাবদ্ধতা ছাড়া যে কেউ, যেকোনো জায়গা থেকে নিবন্ধনের জন্য খোলা। <code>.com</code>, <code>.net</code>, আর <code>.org</code> সবচেয়ে পুরোনো আর পরিচিত; <code>.com</code>-কে বিশেষভাবে প্রায়ই ব্যবহারকারীরা ডিফল্ট হিসেবে গণ্য করে, এমনকি এর কোনো বিশেষ টেকনিক্যাল অর্থ না থাকলেও।</p>'),

      h(2, 'Country-Code TLD (ccTLD)', 'country-code-tlds-cctlds'),
      p('<p>একটি নির্দিষ্ট দেশ বা অঞ্চলে নির্ধারিত — ভারতের জন্য <code>.in</code>, যুক্তরাজ্যের জন্য <code>.uk</code>, যুক্তরাষ্ট্রের জন্য <code>.us</code>। প্রতিটি সেই দেশের জন্য নির্ধারিত একটি প্রতিষ্ঠান পরিচালনা করে, আর নিয়ম ভিন্ন হয়: কিছু ccTLD বিশ্বজুড়ে যে কারো জন্য খোলা, অন্যগুলোর নিবন্ধনে স্থানীয় উপস্থিতি বা ডকুমেন্টেশন লাগে।</p>'),
      table(
        ['TLD', 'বিশেষভাবে ভারতের জন্য নোট'],
        [
          ['.in', 'ভারতের সাধারণ-উদ্দেশ্যের ccTLD, খোলা নিবন্ধন, ভারতীয় ব্যবসায় ব্যাপকভাবে ব্যবহৃত'],
          ['.co.in', '.in-এর অধীনে একটি উপশ্রেণী, ঐতিহাসিকভাবে .com-এর মতো ব্যবহৃত'],
          ['.org.in', 'প্রতিষ্ঠানের জন্য উদ্দিষ্ট, সাধারণ .org-এর একই মনোভাব'],
          ['.net.in', 'নেটওয়ার্ক/অবকাঠামো-সম্পর্কিত সত্তার জন্য উদ্দিষ্ট, যদিও বাস্তবে ঢিলেভাবে ব্যবহৃত'],
        ]
      ),
      p('<p><code>.in</code>-এর মতো একটি ccTLD সেই দেশের সাথে একটি সংযোগের সংকেত দেয়, যা বিশেষভাবে একটি স্থানীয় দর্শকের সাথে বিশ্বাস গড়তে পারে — প্রধানত ভারতীয় গ্রাহকদের সেবা দেওয়া একটি ব্যবসার জন্য সত্যিই কাজের।</p>'),

      h(2, 'নতুন/Sponsored/বিশেষায়িত TLD', 'newsponsoredspecialty-tlds'),
      p('<p>সাম্প্রতিক বছরগুলোতে, শত শত নতুন শেষ উপলব্ধ হয়েছে — <code>.dev</code>, <code>.app</code>, <code>.io</code>, <code>.tech</code>, <code>.store</code>, <code>.blog</code>, আর আরও অনেক। কিছু সামান্য সীমাবদ্ধ (<code>.dev</code> আর <code>.app</code>-এ HTTPS চালু থাকা দরকার, উদাহরণস্বরূপ) আর কিছু একটি নির্দিষ্ট অর্থ বহন করে (<code>.io</code> টেক স্টার্টআপে জনপ্রিয়, <code>.store</code> একটি দোকানের সংকেত দেয়) কোনো কঠোর যোগ্যতার নিয়ম যুক্ত ছাড়াই।</p>'),

      img(
        'docs/img/hosting/tld-types-1',
        'Isometric ডায়াগ্রাম যেখানে ডোমেইন শেষের তিনটি লেবেল করা দল দেখানো হয়েছে — generic TLD, country-code TLD, আর specialty TLD — ছোট নেমপ্লেট ব্লকের আলাদা গুচ্ছ হিসেবে',
        1024, 768,
        'শেষের তিনটি বিস্তৃত শ্রেণী, প্রতিটির ভিন্ন নিয়ম আর ভিন্ন সংকেত।'
      ),

      h(2, 'TLD কি সার্চ র‍্যাংকিং প্রভাবিত করে?', 'does-the-tld-affect-search-ranking'),
      p('<p>সার্চ ইঞ্জিন শুধু শেষের শক্তিতে অন্য বৈধ TLD-এর উপর <code>.com</code>-কে একটি সাধারণ ranking সুবিধা দেয় না — এই সাইটের <a href="/bn/seo/">SEO কোর্স</a> ranking-এর জন্য আসলে কী গুরুত্বপূর্ণ তা কভার করে, আর TLD পছন্দ উল্লেখযোগ্য কারণগুলোর একটি নয়। প্রধান বাস্তব বিবেচনা হলো একজন মানব ভিজিটর এটি দেখলে কী ধরে নেয় বা বিশ্বাস করে, একটি অ্যালগরিদম নয়।</p>'),

      callout('tip', '<p>একটি portfolio বা একটি প্রথম ছোট ব্যবসার সাইট তৈরি করা বেশিরভাগ শিক্ষার্থীর জন্য, উপলব্ধতা আর দাম সাধারণত TLD-এর মধ্যে যেকোনো টেকনিক্যাল পার্থক্যের চেয়ে বেশি সিদ্ধান্ত নেয়। <code>.com</code> সবচেয়ে বেশি প্রতিদ্বন্দ্বিতাপূর্ণ হতে থাকে আর তাই ইতিমধ্যে নেওয়া হওয়ার সম্ভাবনা বেশি; <code>.in</code>-এর মতো একটি ccTLD, বা প্রোজেক্টের সাথে মানানসই একটি নতুন TLD, প্রায়ই উপলব্ধ আর সম্পূর্ণ বৈধ দুটোই।</p>'),

      h(2, 'এই সবকিছু আসলে কে পরিচালনা করে', 'who-actually-manages-all-of-this'),
      p('<p>একটি বৈশ্বিক সংস্থা সামগ্রিক ডোমেইন নাম সিস্টেম সমন্বয় করে আর প্রতিটি TLD এর জন্য দায়ী একটি নির্দিষ্ট registry প্রতিষ্ঠানকে অর্পণ করে। একটি TLD-এর মধ্যে পৃথক ডোমেইন নাম তারপর স্বীকৃত registrar-এর মাধ্যমে জনসাধারণের কাছে বিক্রি হয় — পরের পাঠে কভার করা কোম্পানি, যেখানে আপনি আসলে একটি নিবন্ধন করবেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'registering-a-domain',
  sortOrder: 7,
  en: {
    title: 'Registering a Domain',
    metaTitle: 'Registering a Domain Name | Learn Computer Academy',
    metaDescription: 'What a registrar actually does, what to check before registering, and the renewal and privacy traps that catch first-time buyers.',
    blocks: [
      p('<p>A <b>registrar</b> is a company accredited to sell and manage domain registrations on behalf of the registries covered in the last lesson. Registering a domain in practice means picking a registrar, searching for a name, and paying for it — but a few details are worth understanding before doing that.</p>'),

      h(2, 'What a Registrar Actually Does'),
      p('<p>A registrar handles registering the name, renewing it, and giving you a control panel to manage where it points — the DNS settings covered in upcoming lessons. It does not host your website; that is a separate service, per the earlier lesson on the three separate pieces, even when the same company happens to also sell hosting.</p>'),

      h(2, 'Checking Availability'),
      p('<p>Every registrar\'s site offers a search box: type a name, and it reports whether it is already registered. A taken name is not available at any price through normal registration — it would need to be bought from its current owner, if they are willing to sell at all, which is a different and much more expensive process than registering a fresh name.</p>'),

      // ⚠️ PRICE-SENSITIVE — tiers/ratios only, no fixed prices. See file header.
      h(2, 'What Registering Actually Costs'),
      p('<p>Registration is priced per year, and cost varies significantly by TLD — a common gTLD is usually inexpensive, while some specialty and premium TLDs cost meaningfully more. Rather than quoting specific figures that will be wrong within a year, the pattern worth knowing is this: a first-year price is often discounted as an introductory offer, and the <b>renewal price the following year is frequently higher</b> than what you paid to register. Always check the renewal price before committing, not just the headline first-year price.</p>'),

      callout('warning', '<p>The classic first-time trap: registering at an attractive introductory price, forgetting to check what renewal actually costs, and being surprised a year later. Read the renewal price on the registrar\'s own pricing page before buying, not after the first invoice arrives.</p>', 'Check the renewal price, not just the first-year price'),

      h(2, 'WHOIS and Privacy Protection'),
      p('<p>Domain registration information — name, address, contact details — is recorded in a public-facing database called <b>WHOIS</b>. Historically this meant a registrant\'s personal details were publicly visible to anyone who looked up the domain. Most registrars now offer <b>WHOIS privacy</b> (sometimes called domain privacy), which substitutes the registrar\'s own contact details for yours in the public record — genuinely worth enabling, and often included at no extra cost.</p>'),

      h(2, 'A Practical Checklist Before Buying'),
      p('<ul><li>Check both the first-year and renewal price.</li><li>Confirm WHOIS privacy is included or can be added.</li><li>Check how transfers work, in case you want to move registrars later — most domains can transfer after an initial lock period, typically 60 days.</li><li>Avoid unnecessary paid add-ons pushed hard at checkout (many registrars upsell things you don\'t need for a basic site).</li><li>Use an email address you check regularly for the registration — renewal reminders and security notices go there.</li></ul>'),

      h(2, 'After Registering'),
      p('<p>A freshly registered domain does nothing on its own — it needs DNS records pointing it at hosting before a website appears, and at a mail service before email works. Both are covered in the lessons directly ahead.</p>'),
    ],
  },
  bn: {
    title: 'একটি ডোমেইন নিবন্ধন করা',
    metaTitle: 'একটি ডোমেইন নাম নিবন্ধন করা | Learn Computer Academy',
    metaDescription: 'একজন registrar আসলে কী করে, নিবন্ধনের আগে কী যাচাই করবেন, আর প্রথমবার কেনা মানুষদের ধরা renewal আর গোপনীয়তার ফাঁদ।',
    blocks: [
      p('<p>একজন <b>registrar</b> হলো একটি কোম্পানি যা আগের পাঠে কভার করা registry-র পক্ষে ডোমেইন নিবন্ধন বিক্রি আর পরিচালনা করতে স্বীকৃত। বাস্তবে একটি ডোমেইন নিবন্ধন করা মানে একটি registrar বাছা, একটি নাম খোঁজা, আর এর জন্য টাকা দেওয়া — কিন্তু সেটি করার আগে কয়েকটি বিবরণ বোঝা সার্থক।</p>'),

      h(2, 'একজন Registrar আসলে কী করে', 'what-a-registrar-actually-does'),
      p('<p>একজন registrar নাম নিবন্ধন সামলায়, এটি renew করে, আর আপনাকে এটি কোথায় নির্দেশ করে তা পরিচালনা করার একটি control panel দেয় — আসন্ন পাঠে কভার করা DNS সেটিং। এটি আপনার ওয়েবসাইট host করে না; সেটি একটি আলাদা সেবা, তিনটি আলাদা অংশ নিয়ে আগের পাঠ অনুযায়ী, একই কোম্পানি ঘটনাক্রমে হোস্টিংও বিক্রি করলেও।</p>'),

      h(2, 'উপলব্ধতা যাচাই করা', 'checking-availability'),
      p('<p>প্রতিটি registrar-এর সাইট একটি সার্চ বক্স দেয়: একটি নাম টাইপ করুন, আর এটি জানায় এটি ইতিমধ্যে নিবন্ধিত কিনা। একটি নেওয়া নাম স্বাভাবিক নিবন্ধনের মাধ্যমে কোনো দামেই উপলব্ধ নয় — এটি এর বর্তমান মালিকের কাছ থেকে কিনতে হবে, তারা বিক্রি করতে ইচ্ছুক হলে, যা একটি নতুন নাম নিবন্ধনের চেয়ে একটি ভিন্ন আর অনেক বেশি ব্যয়বহুল প্রক্রিয়া।</p>'),

      h(2, 'নিবন্ধন আসলে কী খরচ করে', 'what-registering-actually-costs'),
      p('<p>নিবন্ধন প্রতি বছর মূল্য নির্ধারিত, আর খরচ TLD অনুযায়ী উল্লেখযোগ্যভাবে ভিন্ন — একটি সাধারণ gTLD সাধারণত সস্তা, যেখানে কিছু specialty আর premium TLD অর্থপূর্ণভাবে বেশি খরচ করে। এক বছরের মধ্যে ভুল হয়ে যাবে এমন নির্দিষ্ট সংখ্যা উদ্ধৃত করার বদলে, জানার যোগ্য প্যাটার্নটি এই: একটি প্রথম-বছরের দাম প্রায়ই একটি প্রারম্ভিক অফার হিসেবে ছাড়যুক্ত, আর <b>পরের বছরের renewal দাম প্রায়ই</b> আপনি নিবন্ধনে যা দিয়েছেন তার চেয়ে বেশি হয়। কেনার আগে renewal দাম যাচাই করুন, শুধু headline প্রথম-বছরের দাম নয়।</p>'),

      callout('warning', '<p>ক্লাসিক প্রথমবারের ফাঁদ: একটি আকর্ষণীয় প্রারম্ভিক দামে নিবন্ধন করা, renewal আসলে কী খরচ করে তা যাচাই করতে ভুলে যাওয়া, আর এক বছর পরে অবাক হওয়া। কেনার আগে registrar-এর নিজের দামের পাতায় renewal দাম পড়ুন, প্রথম চালান আসার পরে নয়।</p>', 'শুধু প্রথম-বছরের দাম নয়, renewal দামও যাচাই করুন'),

      h(2, 'WHOIS আর গোপনীয়তা সুরক্ষা', 'whois-and-privacy-protection'),
      p('<p>ডোমেইন নিবন্ধনের তথ্য — নাম, ঠিকানা, যোগাযোগের বিবরণ — <b>WHOIS</b> নামের একটি প্রকাশ্য ডেটাবেসে নথিভুক্ত। ঐতিহাসিকভাবে এর অর্থ ছিল একজন নিবন্ধনকারীর ব্যক্তিগত বিবরণ ডোমেইনটি খুঁজে দেখা যে কারো কাছে প্রকাশ্যে দৃশ্যমান ছিল। বেশিরভাগ registrar এখন <b>WHOIS privacy</b> (কখনো domain privacy বলা হয়) দেয়, যা প্রকাশ্য রেকর্ডে আপনার বদলে registrar-এর নিজের যোগাযোগের বিবরণ প্রতিস্থাপন করে — চালু করা সত্যিই সার্থক, আর প্রায়ই অতিরিক্ত খরচ ছাড়া অন্তর্ভুক্ত।</p>'),

      h(2, 'কেনার আগে একটি ব্যবহারিক চেকলিস্ট', 'a-practical-checklist-before-buying'),
      p('<ul><li>প্রথম-বছর আর renewal দাম দুটোই যাচাই করুন।</li><li>WHOIS privacy অন্তর্ভুক্ত বা যোগ করা যায় কিনা নিশ্চিত করুন।</li><li>পরে registrar বদলাতে চাইলে transfer কীভাবে কাজ করে যাচাই করুন — বেশিরভাগ ডোমেইন একটি প্রাথমিক lock সময়ের পরে transfer করতে পারে, সাধারণত ৬০ দিন।</li><li>Checkout-এ জোরালোভাবে ঠেলা অপ্রয়োজনীয় পেইড add-on এড়ান (অনেক registrar একটি সাধারণ সাইটের জন্য আপনার দরকার নেই এমন জিনিস upsell করে)।</li><li>নিবন্ধনের জন্য নিয়মিত চেক করেন এমন একটি ইমেইল ঠিকানা ব্যবহার করুন — renewal অনুস্মারক আর নিরাপত্তা নোটিশ সেখানে যায়।</li></ul>'),

      h(2, 'নিবন্ধনের পরে', 'after-registering'),
      p('<p>একটি সদ্য নিবন্ধিত ডোমেইন নিজে থেকে কিছুই করে না — একটি ওয়েবসাইট দেখা দেওয়ার আগে এটিকে হোস্টিং-এর দিকে নির্দেশ করা DNS রেকর্ড দরকার, আর ইমেইল কাজ করার আগে একটি মেইল সেবার দিকে। দুটোই সরাসরি সামনের পাঠে কভার করা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'what-dns-is',
  sortOrder: 8,
  en: {
    title: 'What DNS Is',
    metaTitle: 'What DNS Is and How It Works | Learn Computer Academy',
    metaDescription: 'DNS is the system that translates a domain name into the numeric address a computer actually needs. How the lookup works, and why changes take time to spread.',
    blocks: [
      p('<p><b>DNS</b> — Domain Name System — is the system that translates a human-readable domain name into the numeric IP address a computer actually needs to connect to a server. It is, in effect, the internet\'s phone book, looked up automatically on every single request.</p>'),

      h(2, 'The Lookup, Step by Step'),
      p('<p>When your browser needs to load <code>example.com</code>, roughly this happens: it asks a <b>DNS resolver</b> (often run by your internet provider) whether it already knows the answer; if not, the resolver asks a chain of DNS servers, working from the most general down to the most specific, until it reaches the <b>nameservers</b> responsible for <code>example.com</code> specifically; those nameservers return the actual IP address; and the resolver hands that back to your browser, which finally makes the real connection to the server.</p>'),

      img(
        'docs/img/hosting/dns-lookup-1',
        'Isometric diagram showing a browser querying a DNS resolver, which queries a chain of nameservers, eventually returning an IP address that the browser uses to connect to a server',
        1024, 768,
        'A domain lookup happens automatically, in a fraction of a second, before every single page load.'
      ),

      h(2, 'Nameservers'),
      p('<p>A domain\'s <b>nameservers</b> are the specific servers that hold the authoritative DNS records for it — the actual source of truth for where that domain points. When you register a domain, it comes with default nameservers from your registrar; when you buy hosting elsewhere, you typically either point your domain at that host\'s nameservers, or keep the registrar\'s nameservers and add individual records instead. Both approaches are covered practically in the connecting-a-domain lesson.</p>'),

      h(2, 'Caching and Why Changes Take Time'),
      p('<p>Looking up DNS on every single request, all the way through that full chain, would be slow — so the answer is cached at multiple points along the way: your browser, your operating system, your internet provider\'s resolver, and others in between. Each cached copy has a <b>TTL</b> (time to live), a duration after which it is allowed to expire and be looked up fresh.</p><p>This is why a DNS change — pointing a domain at new hosting, for instance — does not take effect everywhere instantly. Some visitors see the change within minutes; others, whose resolver cached the old answer with a long TTL, may see it hours later. This delay is commonly called <b>propagation</b>, covered with practical timing guidance in the connecting-a-domain lesson.</p>'),

      callout('note', '<p>DNS changes are not risky to make, but they are not instant either. Plan any DNS change with the expectation that it may take anywhere from minutes to about 48 hours to be visible everywhere, and avoid making a change right before a critical moment (a launch event, a scheduled announcement) where you\'d have no room to fix a mistake.</p>'),

      h(2, 'Where This Goes Next'),
      p('<p>DNS itself is just the lookup mechanism. What it actually stores and returns are <b>records</b> — different types for different purposes, covered in full in the next lesson.</p>'),
    ],
  },
  bn: {
    title: 'DNS কী',
    metaTitle: 'DNS কী আর কীভাবে কাজ করে | Learn Computer Academy',
    metaDescription: 'DNS হলো সেই সিস্টেম যা একটি ডোমেইন নামকে একটি কম্পিউটারের আসলে দরকার সাংখ্যিক ঠিকানায় অনুবাদ করে। Lookup কীভাবে কাজ করে, আর বদল ছড়াতে সময় লাগে কেন।',
    blocks: [
      p('<p><b>DNS</b> — Domain Name System — হলো সেই সিস্টেম যা একটি মানুষের পড়ার যোগ্য ডোমেইন নামকে একটি কম্পিউটারের সার্ভারে সংযুক্ত হতে আসলে দরকার সাংখ্যিক IP ঠিকানায় অনুবাদ করে। এটি, কার্যকরভাবে, ইন্টারনেটের ফোন বই, প্রতিটি একক অনুরোধে স্বয়ংক্রিয়ভাবে খুঁজে দেখা হয়।</p>'),

      h(2, 'Lookup, ধাপে ধাপে', 'the-lookup-step-by-step'),
      p('<p>আপনার ব্রাউজারের যখন <code>example.com</code> লোড করা দরকার, মোটামুটি এটি ঘটে: এটি একটি <b>DNS resolver</b>-কে (প্রায়ই আপনার ইন্টারনেট প্রদানকারী চালায়) জিজ্ঞাসা করে এটি ইতিমধ্যে উত্তর জানে কিনা; না জানলে, resolver DNS সার্ভারের একটি শৃঙ্খলকে জিজ্ঞাসা করে, সবচেয়ে সাধারণ থেকে সবচেয়ে নির্দিষ্ট পর্যন্ত কাজ করে, যতক্ষণ না এটি বিশেষভাবে <code>example.com</code>-এর জন্য দায়ী <b>nameserver</b>-এ পৌঁছায়; সেই nameserver আসল IP ঠিকানা ফেরত দেয়; আর resolver সেটি আপনার ব্রাউজারে ফিরিয়ে দেয়, যা শেষে সার্ভারের সাথে আসল সংযোগ তৈরি করে।</p>'),

      img(
        'docs/img/hosting/dns-lookup-1',
        'Isometric ডায়াগ্রাম যেখানে একটি ব্রাউজার একটি DNS resolver-কে query করছে, যা nameserver-এর একটি শৃঙ্খলকে query করছে, শেষে একটি IP ঠিকানা ফেরত দিচ্ছে যা ব্রাউজার একটি সার্ভারে সংযুক্ত হতে ব্যবহার করে',
        1024, 768,
        'একটি ডোমেইন lookup প্রতিটি একক পাতা লোডের আগে স্বয়ংক্রিয়ভাবে, একটি সেকেন্ডের ভগ্নাংশে ঘটে।'
      ),

      h(2, 'Nameserver', 'nameservers'),
      p('<p>একটি ডোমেইনের <b>nameserver</b> হলো নির্দিষ্ট সার্ভার যা এর জন্য কর্তৃত্বপূর্ণ DNS রেকর্ড ধরে রাখে — সেই ডোমেইনটি কোথায় নির্দেশ করে তার আসল সত্যের উৎস। আপনি একটি ডোমেইন নিবন্ধন করলে, এটি আপনার registrar থেকে ডিফল্ট nameserver নিয়ে আসে; আপনি অন্যত্র হোস্টিং কিনলে, আপনি সাধারণত হয় আপনার ডোমেইনকে সেই host-এর nameserver-এর দিকে নির্দেশ করেন, অথবা registrar-এর nameserver রাখেন আর এর বদলে পৃথক রেকর্ড যোগ করেন। দুটো পদ্ধতিই ডোমেইন সংযুক্ত করার পাঠে ব্যবহারিকভাবে কভার করা।</p>'),

      h(2, 'Caching আর বদল কেন সময় নেয়', 'caching-and-why-changes-take-time'),
      p('<p>সেই পুরো শৃঙ্খল জুড়ে প্রতিটি একক অনুরোধে DNS খুঁজে দেখা ধীর হতো — তাই উত্তরটি পথের একাধিক বিন্দুতে ক্যাশ করা হয়: আপনার ব্রাউজার, আপনার অপারেটিং সিস্টেম, আপনার ইন্টারনেট প্রদানকারীর resolver, আর মাঝখানে অন্যরা। প্রতিটি ক্যাশ করা কপির একটি <b>TTL</b> (time to live) আছে, একটি সময়কাল যার পরে এটি মেয়াদ শেষ হয়ে নতুন করে খুঁজে দেখার অনুমতি পায়।</p><p>এই কারণেই একটি DNS পরিবর্তন — উদাহরণস্বরূপ, একটি ডোমেইনকে নতুন হোস্টিং-এর দিকে নির্দেশ করা — সর্বত্র সাথে সাথে কার্যকর হয় না। কিছু ভিজিটর মিনিটের মধ্যে পরিবর্তনটি দেখেন; অন্যরা, যাদের resolver একটি দীর্ঘ TTL সহ পুরোনো উত্তর ক্যাশ করেছে, ঘণ্টা পরে দেখতে পারেন। এই দেরিকে সাধারণত <b>propagation</b> বলা হয়, ডোমেইন সংযুক্ত করার পাঠে ব্যবহারিক সময়ের নির্দেশনাসহ কভার করা।</p>'),

      callout('note', '<p>DNS পরিবর্তন করা ঝুঁকিপূর্ণ নয়, কিন্তু তাৎক্ষণিকও নয়। যেকোনো DNS পরিবর্তন এই প্রত্যাশা নিয়ে পরিকল্পনা করুন যে এটি সর্বত্র দৃশ্যমান হতে মিনিট থেকে প্রায় ৪৮ ঘণ্টা পর্যন্ত সময় নিতে পারে, আর একটি গুরুত্বপূর্ণ মুহূর্তের (একটি launch ইভেন্ট, একটি নির্ধারিত ঘোষণা) ঠিক আগে একটি পরিবর্তন করা এড়ান যেখানে একটি ভুল ঠিক করার কোনো জায়গা থাকবে না।</p>'),

      h(2, 'এটি এরপর কোথায় যায়', 'where-this-goes-next'),
      p('<p>DNS নিজেই শুধু lookup প্রক্রিয়া। এটি আসলে যা সংরক্ষণ আর ফেরত দেয় তা হলো <b>রেকর্ড</b> — ভিন্ন উদ্দেশ্যের জন্য ভিন্ন ধরন, পরের পাঠে সম্পূর্ণভাবে কভার করা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'dns-record-types',
  sortOrder: 9,
  en: {
    title: 'DNS Record Types',
    metaTitle: 'DNS Record Types — A, CNAME, MX, TXT | Learn Computer Academy',
    metaDescription: 'The handful of DNS record types that do almost everything — A, CNAME, MX, and TXT — with what each one is for and a realistic example set.',
    blocks: [
      p('<p>DNS stores information as <b>records</b> — small, typed entries, each answering a specific kind of question. A handful of types cover almost everything a typical website and its email need.</p>'),

      h(2, 'The Core Types'),
      table(
        ['Record', 'Answers', 'Typical use'],
        [
          ['A', '"What IP address does this point to?"', 'Pointing a domain directly at a server\'s IPv4 address'],
          ['AAAA', 'Same as A, for IPv6', 'The newer, longer-format IP addresses'],
          ['CNAME', '"This name is really just an alias for another name"', 'Pointing a subdomain at another domain, e.g. a hosting platform\'s address'],
          ['MX', '"Which server handles email for this domain?"', 'Directing email to a mail provider, entirely separate from where the website lives'],
          ['TXT', '"Here is some arbitrary text tied to this domain"', 'Ownership verification, and email authentication (SPF/DKIM, covered in the email lessons)'],
          ['NS', '"These are the nameservers responsible for this domain"', 'Delegating a domain, or a subdomain, to a specific set of nameservers'],
        ]
      ),

      h(2, 'A Record vs. CNAME'),
      p('<p>These two are the ones that most often confuse beginners. An <b>A record</b> points directly at a numeric IP address. A <b>CNAME record</b> points at another domain name instead, which is then looked up again — an alias pointing at an alias, potentially several layers deep, until something resolves to an actual IP.</p><p>Many hosting platforms (particularly ones with infrastructure that can change IP addresses without notice) ask you to use a CNAME rather than an A record specifically so that if their underlying IP ever changes, your DNS keeps working without you having to update anything.</p>'),

      img(
        'docs/img/hosting/dns-records-1',
        'Isometric diagram showing a simple DNS records table with rows labelled A, CNAME, MX, and TXT, each with a small icon showing what it points to — a server, another domain, a mail icon, and a document',
        1024, 768,
        'A handful of record types, each answering one specific kind of question about a domain.'
      ),

      h(2, 'A Realistic Example Set'),
      code('text', 'A       @              → 203.0.113.10        (the main domain → hosting)\nCNAME   www            → example.com          (www redirects to the bare domain)\nMX      @              → mail.example.com    (where email for this domain goes)\nTXT     @              → "v=spf1 include:..." (email authentication, see the email lessons)\nA       api            → 203.0.113.20        (a separate server for a backend API)'),
      p('<p><code>@</code> is the conventional way to refer to the bare domain itself, without a subdomain in front of it, in most DNS control panels.</p>'),

      h(2, 'Where You Actually Manage These'),
      p('<p>DNS records are edited through whichever service holds your domain\'s nameservers — usually your registrar\'s control panel, or your hosting provider\'s, if you pointed your domain\'s nameservers there. Both are graphical forms in practice: a dropdown for record type, a field for the name, a field for what it points to, and a TTL setting.</p>'),

      callout('warning', '<p>A wrong DNS record does not usually announce itself with an obvious error — it just quietly makes something not work: a website that won\'t load, email that never arrives. When something DNS-related seems broken, checking the actual records against what they should be is almost always the fastest diagnosis, faster than guessing at the cause.</p>'),
    ],
  },
  bn: {
    title: 'DNS রেকর্ডের ধরন',
    metaTitle: 'DNS রেকর্ডের ধরন — A, CNAME, MX, TXT | Learn Computer Academy',
    metaDescription: 'মুষ্টিমেয় DNS রেকর্ড ধরন যা প্রায় সবকিছু করে — A, CNAME, MX, আর TXT — প্রতিটি কীসের জন্য আর একটি বাস্তবসম্মত উদাহরণ সেটসহ।',
    blocks: [
      p('<p>DNS তথ্য সংরক্ষণ করে <b>রেকর্ড</b> হিসেবে — ছোট, টাইপ করা এন্ট্রি, প্রতিটি একটি নির্দিষ্ট ধরনের প্রশ্নের উত্তর দেয়। মুষ্টিমেয় ধরন একটি সাধারণ ওয়েবসাইট আর এর ইমেইলের প্রায় সবকিছু কভার করে।</p>'),

      h(2, 'মূল ধরনগুলো', 'the-core-types'),
      table(
        ['রেকর্ড', 'উত্তর দেয়', 'সাধারণ ব্যবহার'],
        [
          ['A', '"এটি কোন IP ঠিকানায় নির্দেশ করে?"', 'একটি ডোমেইনকে সরাসরি একটি সার্ভারের IPv4 ঠিকানায় নির্দেশ করা'],
          ['AAAA', 'A-এর মতোই, IPv6-এর জন্য', 'নতুন, দীর্ঘ-ফরম্যাটের IP ঠিকানা'],
          ['CNAME', '"এই নামটি আসলে অন্য একটি নামের একটি alias"', 'একটি subdomain-কে অন্য একটি ডোমেইনে নির্দেশ করা, যেমন একটি হোস্টিং প্ল্যাটফর্মের ঠিকানা'],
          ['MX', '"এই ডোমেইনের ইমেইল কোন সার্ভার সামলায়?"', 'একটি মেইল প্রদানকারীর দিকে ইমেইল নির্দেশ করা, ওয়েবসাইট যেখানে থাকে তার থেকে সম্পূর্ণ আলাদা'],
          ['TXT', '"এই ডোমেইনের সাথে যুক্ত এখানে কিছু স্বেচ্ছাধীন টেক্সট"', 'মালিকানা যাচাই, আর ইমেইল প্রমাণীকরণ (SPF/DKIM, ইমেইল পাঠে কভার করা)'],
          ['NS', '"এগুলো এই ডোমেইনের জন্য দায়ী nameserver"', 'একটি ডোমেইন, বা একটি subdomain, একটি নির্দিষ্ট nameserver সেটে অর্পণ করা'],
        ]
      ),

      h(2, 'A রেকর্ড বনাম CNAME', 'a-record-vs-cname'),
      p('<p>এই দুটিই সবচেয়ে বেশি শিক্ষানবিসদের বিভ্রান্ত করে। একটি <b>A রেকর্ড</b> সরাসরি একটি সাংখ্যিক IP ঠিকানায় নির্দেশ করে। একটি <b>CNAME রেকর্ড</b> এর বদলে অন্য একটি ডোমেইন নামে নির্দেশ করে, যা তারপর আবার খুঁজে দেখা হয় — একটি alias একটি aliasকে নির্দেশ করছে, সম্ভবত কয়েক স্তর গভীরে, যতক্ষণ না কিছু একটি আসল IP-তে রিজলভ হয়।</p><p>অনেক হোস্টিং প্ল্যাটফর্ম (বিশেষত এমন অবকাঠামোসহ যা বিনা নোটিশে IP ঠিকানা বদলাতে পারে) আপনাকে A রেকর্ডের বদলে একটি CNAME ব্যবহার করতে বলে বিশেষভাবে যাতে তাদের অন্তর্নিহিত IP কখনো বদলালে, আপনার কিছু আপডেট করতে না হয়েই আপনার DNS কাজ করতে থাকে।</p>'),

      img(
        'docs/img/hosting/dns-records-1',
        'Isometric ডায়াগ্রাম যেখানে A, CNAME, MX, আর TXT লেবেল করা সারিসহ একটি সরল DNS রেকর্ড টেবিল দেখানো হয়েছে, প্রতিটি একটি ছোট আইকনসহ যা দেখায় এটি কী নির্দেশ করে — একটি সার্ভার, অন্য একটি ডোমেইন, একটি মেইল আইকন, আর একটি ডকুমেন্ট',
        1024, 768,
        'মুষ্টিমেয় রেকর্ড ধরন, প্রতিটি একটি ডোমেইন সম্পর্কে একটি নির্দিষ্ট ধরনের প্রশ্নের উত্তর দেয়।'
      ),

      h(2, 'একটি বাস্তবসম্মত উদাহরণ সেট', 'a-realistic-example-set'),
      code('text', 'A       @              → 203.0.113.10        (মূল ডোমেইন → হোস্টিং)\nCNAME   www            → example.com          (www খালি ডোমেইনে redirect করে)\nMX      @              → mail.example.com    (এই ডোমেইনের ইমেইল কোথায় যায়)\nTXT     @              → "v=spf1 include:..." (ইমেইল প্রমাণীকরণ, ইমেইল পাঠ দেখুন)\nA       api            → 203.0.113.20        (একটি backend API-এর জন্য আলাদা সার্ভার)'),
      p('<p>বেশিরভাগ DNS control panel-এ <code>@</code> খালি ডোমেইনকে নিজেই বোঝানোর প্রথাগত উপায়, সামনে কোনো subdomain ছাড়া।</p>'),

      h(2, 'আপনি আসলে এগুলো কোথায় পরিচালনা করেন', 'where-you-actually-manage-these'),
      p('<p>DNS রেকর্ড যে সেবাটি আপনার ডোমেইনের nameserver ধরে রাখে তার মাধ্যমে সম্পাদনা করা হয় — সাধারণত আপনার registrar-এর control panel, বা আপনার হোস্টিং প্রদানকারীর, আপনি সেখানে আপনার ডোমেইনের nameserver নির্দেশ করে থাকলে। বাস্তবে দুটোই গ্রাফিক্যাল form: রেকর্ড ধরনের জন্য একটি dropdown, নামের জন্য একটি ফিল্ড, এটি কী নির্দেশ করে তার জন্য একটি ফিল্ড, আর একটি TTL সেটিং।</p>'),

      callout('warning', '<p>একটি ভুল DNS রেকর্ড সাধারণত একটি স্পষ্ট error দিয়ে নিজেকে ঘোষণা করে না — এটি শুধু চুপচাপ কিছু কাজ না করায়: একটি ওয়েবসাইট যা লোড হবে না, ইমেইল যা কখনো পৌঁছায় না। DNS-সম্পর্কিত কিছু ভাঙা মনে হলে, সেগুলো কী হওয়া উচিত তার বিপরীতে আসল রেকর্ড যাচাই করা প্রায় সবসময় দ্রুততম নির্ণয়, কারণ অনুমান করার চেয়ে দ্রুত।</p>'),
    ],
  },
})

lessons.push({
  slug: 'what-youre-actually-renting',
  sortOrder: 10,
  en: {
    title: 'What You\'re Actually Renting',
    metaTitle: 'What Web Hosting Actually Is | Learn Computer Academy',
    metaDescription: 'Every kind of hosting is a variation on the same underlying thing: a computer, always on, that you are renting some share of. What actually varies between types.',
    blocks: [
      p('<p>Every kind of hosting — shared, VPS, cloud, managed, static — is a variation on the same underlying thing: a computer, kept on and connected to the internet at all times, that you rent some share of. What differs between types is <i>how much of that computer</i> is yours, and how much control you have over it.</p>'),

      h(2, 'The Resources Being Shared'),
      p('<p>A physical server has a fixed amount of processing power, memory, storage, and network bandwidth. Every hosting type is really just a different answer to "how is that fixed amount divided up, and among how many customers?"</p>'),

      img(
        'docs/img/hosting/hosting-spectrum-1',
        'Isometric diagram showing a spectrum of hosting types from left to right — many small tenants sharing one large server, to a few tenants on isolated virtual slices, to one tenant with an entire dedicated server',
        1024, 768,
        'The same underlying resource, divided differently — sharing widely, virtually isolated, or entirely your own.'
      ),

      h(2, 'The Spectrum'),
      table(
        ['Type', 'How resources are divided', 'Control you get'],
        [
          ['Shared hosting', 'Hundreds of sites split one physical server', 'Minimal — a control panel, not the server itself'],
          ['VPS', 'A handful of virtual, isolated slices of one physical server', 'Full control of your own slice'],
          ['Dedicated server', 'One customer, one entire physical server', 'Complete control of the whole machine'],
          ['Cloud / managed platforms', 'Resources allocated dynamically, often across many machines', 'Varies widely — some feel like shared hosting, some like a VPS, automated behind the scenes'],
          ['Static hosting', 'No server-side processing at all — just files, served from many locations at once', 'Minimal control needed, because there is no server to manage'],
        ]
      ),
      p('<p>Each of these is covered in its own lesson next. The pattern worth noticing now: more control and more dedicated resources generally cost more and require more technical knowledge to manage — there is a real, direct trade-off, not a strictly better or worse option.</p>'),

      h(2, 'What "Managing a Server" Actually Involves'),
      p('<p>The more of the server is yours, the more of its maintenance is also yours: security updates, monitoring for problems, configuring the software that runs your site, and recovering it if something goes wrong. Shared hosting and most managed platforms handle all of that for you, invisibly, as part of what you pay for. A VPS or dedicated server leaves it to you — full control and full responsibility arrive together.</p>'),

      callout('note', '<p>There is no universally "best" type. The right choice depends entirely on what you\'re running, how much traffic it expects, how comfortable you are managing a server yourself, and what you can afford — all covered concretely in the choosing-hosting-for-your-stack lesson later in this part.</p>'),

      h(2, 'Where This Part Goes'),
      p('<p>The next several lessons take each type in turn — shared, VPS and dedicated, cloud and managed, and static — followed by a direct decision guide matched to the specific stacks taught on this site, and then what each tier actually costs.</p>'),
    ],
  },
  bn: {
    title: 'আপনি আসলে কী ভাড়া নিচ্ছেন',
    metaTitle: 'ওয়েব হোস্টিং আসলে কী | Learn Computer Academy',
    metaDescription: 'প্রতিটি ধরনের হোস্টিং একই অন্তর্নিহিত জিনিসের একটি রূপভেদ: সবসময় চালু একটি কম্পিউটার, যার কিছু অংশ আপনি ভাড়া নিচ্ছেন। ধরনগুলোর মধ্যে আসলে কী ভিন্ন।',
    blocks: [
      p('<p>প্রতিটি ধরনের হোস্টিং — shared, VPS, cloud, managed, static — একই অন্তর্নিহিত জিনিসের একটি রূপভেদ: সবসময় চালু আর ইন্টারনেটে সংযুক্ত রাখা একটি কম্পিউটার, যার কিছু অংশ আপনি ভাড়া নেন। ধরনগুলোর মধ্যে যা ভিন্ন তা হলো <i>সেই কম্পিউটারের কতটা</i> আপনার, আর এর উপর আপনার কতটা নিয়ন্ত্রণ আছে।</p>'),

      h(2, 'শেয়ার করা রিসোর্স', 'the-resources-being-shared'),
      p('<p>একটি ভৌত সার্ভারের একটি নির্দিষ্ট পরিমাণ প্রসেসিং শক্তি, মেমরি, সংরক্ষণ, আর নেটওয়ার্ক bandwidth আছে। প্রতিটি হোস্টিং ধরন আসলে "সেই নির্দিষ্ট পরিমাণ কীভাবে ভাগ করা, আর কতজন গ্রাহকের মধ্যে?" এর একটি ভিন্ন উত্তর।</p>'),

      img(
        'docs/img/hosting/hosting-spectrum-1',
        'Isometric ডায়াগ্রাম যেখানে বাম থেকে ডানে হোস্টিং ধরনের একটি বর্ণালী দেখানো হয়েছে — একটি বড় সার্ভার শেয়ার করা অনেক ছোট ভাড়াটে থেকে, বিচ্ছিন্ন virtual অংশে কয়েকজন ভাড়াটে, একটি সম্পূর্ণ dedicated সার্ভারে একজন ভাড়াটে পর্যন্ত',
        1024, 768,
        'একই অন্তর্নিহিত রিসোর্স, ভিন্নভাবে ভাগ করা — ব্যাপকভাবে শেয়ার করা, virtually বিচ্ছিন্ন, বা সম্পূর্ণ আপনার নিজের।'
      ),

      h(2, 'বর্ণালী', 'the-spectrum'),
      table(
        ['ধরন', 'রিসোর্স কীভাবে ভাগ হয়', 'আপনি যে নিয়ন্ত্রণ পান'],
        [
          ['Shared হোস্টিং', 'শত শত সাইট একটি ভৌত সার্ভার ভাগ করে', 'ন্যূনতম — একটি control panel, সার্ভার নিজে নয়'],
          ['VPS', 'একটি ভৌত সার্ভারের মুষ্টিমেয় virtual, বিচ্ছিন্ন অংশ', 'আপনার নিজের অংশের পূর্ণ নিয়ন্ত্রণ'],
          ['Dedicated সার্ভার', 'একজন গ্রাহক, একটি সম্পূর্ণ ভৌত সার্ভার', 'পুরো মেশিনের সম্পূর্ণ নিয়ন্ত্রণ'],
          ['Cloud / managed প্ল্যাটফর্ম', 'রিসোর্স গতিশীলভাবে বরাদ্দ, প্রায়ই অনেক মেশিন জুড়ে', 'ব্যাপকভাবে ভিন্ন — কিছু shared হোস্টিংয়ের মতো লাগে, কিছু একটি VPS-এর মতো, পর্দার পেছনে স্বয়ংক্রিয়'],
          ['Static হোস্টিং', 'কোনো server-side প্রসেসিং নেই — শুধু ফাইল, একসাথে অনেক জায়গা থেকে পরিবেশিত', 'ন্যূনতম নিয়ন্ত্রণ দরকার, কারণ পরিচালনার মতো কোনো সার্ভার নেই'],
        ]
      ),
      p('<p>এগুলোর প্রতিটি এরপর নিজস্ব একটি পাঠে কভার করা। এখন লক্ষ্য করার যোগ্য প্যাটার্ন: বেশি নিয়ন্ত্রণ আর বেশি dedicated রিসোর্স সাধারণত বেশি খরচ করে আর পরিচালনা করতে বেশি টেকনিক্যাল জ্ঞান দাবি করে — একটি আসল, সরাসরি বিনিময় আছে, কঠোরভাবে ভালো বা খারাপ একটি বিকল্প নয়।</p>'),

      h(2, '"একটি সার্ভার পরিচালনা করা" আসলে কী জড়িত', 'what-managing-a-server-actually-involves'),
      p('<p>সার্ভারের যত বেশি অংশ আপনার, এর রক্ষণাবেক্ষণেরও তত বেশি অংশ আপনার: নিরাপত্তা আপডেট, সমস্যার জন্য নজরদারি, আপনার সাইট চালানো সফটওয়্যার কনফিগার করা, আর কিছু ভুল হলে এটি পুনরুদ্ধার করা। Shared হোস্টিং আর বেশিরভাগ managed প্ল্যাটফর্ম আপনার জন্য এর সবকিছু অদৃশ্যভাবে সামলায়, আপনি যা টাকা দেন তার অংশ হিসেবে। একটি VPS বা dedicated সার্ভার এটি আপনার উপর ছেড়ে দেয় — পূর্ণ নিয়ন্ত্রণ আর পূর্ণ দায়িত্ব একসাথে আসে।</p>'),

      callout('note', '<p>কোনো সর্বজনীনভাবে "সেরা" ধরন নেই। সঠিক পছন্দ সম্পূর্ণভাবে নির্ভর করে আপনি কী চালাচ্ছেন, এটি কত ট্রাফিক আশা করে, নিজে একটি সার্ভার পরিচালনা করতে আপনি কতটা স্বাচ্ছন্দ্যবোধ করেন, আর আপনি কী খরচ করতে পারেন তার উপর — এই অংশের পরে choosing-hosting-for-your-stack পাঠে বাস্তবভাবে কভার করা।</p>'),

      h(2, 'এই অংশ কোথায় যায়', 'where-this-part-goes'),
      p('<p>পরের কয়েকটি পাঠ প্রতিটি ধরন পালাক্রমে নেয় — shared, VPS আর dedicated, cloud আর managed, আর static — তারপর এই সাইটে শেখানো নির্দিষ্ট stack-এর সাথে মেলানো একটি সরাসরি সিদ্ধান্তের গাইড, আর তারপর প্রতিটি tier আসলে কী খরচ করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'shared-hosting',
  sortOrder: 11,
  en: {
    title: 'Shared Hosting',
    metaTitle: 'Shared Hosting Explained | Learn Computer Academy',
    metaDescription: 'The most common starting point for a first website. What shared hosting actually is, what it suits, and the specific limits worth knowing about.',
    blocks: [
      p('<p><b>Shared hosting</b> means many websites — often hundreds — running on the same physical server, each getting a slice of its resources. It is the most common starting point for a first website, and for good reason: it is inexpensive, requires no server administration, and is genuinely enough for a large share of real sites.</p>'),

      h(2, 'What You Actually Get'),
      p('<p>A shared hosting account almost always comes with a graphical <b>control panel</b> (covered in its own lesson shortly) for uploading files, managing databases, setting up email, and installing common software — no command line or server administration knowledge required. This is precisely what makes it accessible to beginners.</p>'),

      h(2, 'What It Suits'),
      p('<p>Shared hosting is a strong fit for a static site, a small-to-medium WordPress site, or a PHP site with modest traffic — the kinds of projects most students build first. This site\'s WordPress and PHP courses both assume this kind of hosting is a realistic destination.</p>'),

      h(2, 'The Real Limits'),
      p('<ul><li><b>"Noisy neighbours."</b> Because resources are shared, another site on the same server having a traffic spike or running inefficient code can genuinely slow yours down — a real, if uncommon, downside of sharing infrastructure with strangers.</li><li><b>Limited control.</b> You typically cannot install arbitrary server software, change core server configuration, or run things outside what the control panel exposes.</li><li><b>No support for Node.js, in most cases.</b> Traditional shared hosting is built around PHP and static files; a Node.js app generally needs a different hosting type, covered in its own lesson later.</li><li><b>Resource caps.</b> CPU, memory, and sometimes visitor counts are limited per account — usually generous enough for a small site, but a real ceiling that a genuinely popular site can hit.</li></ul>'),

      img(
        'docs/img/hosting/shared-hosting-1',
        'Isometric diagram showing one physical server with many small identical apartment-like compartments on it, each representing a different website sharing the same machine',
        1024, 768,
        'Many sites, one physical server, each with a bounded slice of its resources.'
      ),

      h(2, 'What It Costs, In Shape'),
      p('<p>Shared hosting is consistently the least expensive way to run a real site with real server-side processing — priced far below a VPS, and typically billed monthly or with a yearly discount, similar in shape to domain registration. Introductory pricing and renewal-price jumps are common here too, the same trap covered in the domain-registration lesson — check the renewal price, not just the headline offer.</p>'),

      callout('tip', '<p>For a first real project — a WordPress site, a PHP site with a database, a portfolio with a contact form — shared hosting is usually the right starting point, not a compromise to grow out of quickly. Moving to something more powerful is straightforward later, once (and if) you genuinely outgrow it.</p>'),
    ],
  },
  bn: {
    title: 'Shared হোস্টিং',
    metaTitle: 'Shared হোস্টিং ব্যাখ্যা | Learn Computer Academy',
    metaDescription: 'একটি প্রথম ওয়েবসাইটের সবচেয়ে সাধারণ শুরুর বিন্দু। Shared হোস্টিং আসলে কী, এটি কীসের উপযোগী, আর জানার যোগ্য নির্দিষ্ট সীমা।',
    blocks: [
      p('<p><b>Shared হোস্টিং</b> মানে অনেক ওয়েবসাইট — প্রায়ই শত শত — একই ভৌত সার্ভারে চলছে, প্রতিটি এর রিসোর্সের একটি অংশ পাচ্ছে। এটি একটি প্রথম ওয়েবসাইটের সবচেয়ে সাধারণ শুরুর বিন্দু, আর ভালো কারণে: এটি সস্তা, কোনো সার্ভার প্রশাসনের প্রয়োজন নেই, আর বাস্তব সাইটের একটি বড় অংশের জন্য সত্যিই যথেষ্ট।</p>'),

      h(2, 'আপনি আসলে কী পান', 'what-you-actually-get'),
      p('<p>একটি shared হোস্টিং অ্যাকাউন্ট প্রায় সবসময় ফাইল আপলোড, ডেটাবেস পরিচালনা, ইমেইল সেট আপ, আর সাধারণ সফটওয়্যার ইনস্টল করার জন্য একটি গ্রাফিক্যাল <b>control panel</b>-সহ আসে (শীঘ্রই নিজস্ব একটি পাঠে কভার করা) — কোনো command line বা সার্ভার প্রশাসনের জ্ঞানের প্রয়োজন নেই। এটিই ঠিক এটিকে শিক্ষানবিসদের কাছে প্রবেশযোগ্য করে।</p>'),

      h(2, 'এটি কীসের উপযোগী', 'what-it-suits'),
      p('<p>Shared হোস্টিং একটি static সাইট, একটি ছোট-থেকে-মাঝারি WordPress সাইট, বা মাঝারি ট্রাফিকযুক্ত একটি PHP সাইটের জন্য একটি শক্তিশালী মিল — বেশিরভাগ শিক্ষার্থী প্রথমে যে ধরনের প্রোজেক্ট তৈরি করে। এই সাইটের WordPress আর PHP কোর্স দুটোই ধরে নেয় এই ধরনের হোস্টিং একটি বাস্তবসম্মত গন্তব্য।</p>'),

      h(2, 'আসল সীমা', 'the-real-limits'),
      p('<ul><li><b>"Noisy neighbours।"</b> রিসোর্স শেয়ার করা হয় বলে, একই সার্ভারে অন্য একটি সাইটে একটি ট্রাফিক spike হওয়া বা অদক্ষ কোড চালানো সত্যিই আপনারটিকে ধীর করতে পারে — অচেনা মানুষের সাথে অবকাঠামো শেয়ার করার একটি আসল, যদিও অসাধারণ, অসুবিধা।</li><li><b>সীমিত নিয়ন্ত্রণ।</b> আপনি সাধারণত স্বেচ্ছাধীন সার্ভার সফটওয়্যার ইনস্টল করতে পারেন না, মূল সার্ভার কনফিগারেশন বদলাতে পারেন না, বা control panel যা দেখায় তার বাইরে কিছু চালাতে পারেন না।</li><li><b>বেশিরভাগ ক্ষেত্রে Node.js-এর জন্য কোনো সাপোর্ট নেই।</b> প্রথাগত shared হোস্টিং PHP আর static ফাইলের চারপাশে তৈরি; একটি Node.js অ্যাপে সাধারণত একটি ভিন্ন হোস্টিং ধরন দরকার, পরে নিজস্ব একটি পাঠে কভার করা।</li><li><b>রিসোর্স সীমা।</b> প্রতি অ্যাকাউন্টে CPU, মেমরি, আর কখনো ভিজিটর সংখ্যা সীমিত — সাধারণত একটি ছোট সাইটের জন্য যথেষ্ট উদার, কিন্তু একটি আসল সিলিং যা সত্যিই জনপ্রিয় একটি সাইট পেতে পারে।</li></ul>'),

      img(
        'docs/img/hosting/shared-hosting-1',
        'Isometric ডায়াগ্রাম যেখানে একটি ভৌত সার্ভারে অনেক ছোট অভিন্ন apartment-এর মতো compartment দেখানো হয়েছে, প্রতিটি একই মেশিন শেয়ার করা একটি ভিন্ন ওয়েবসাইট প্রতিনিধিত্ব করছে',
        1024, 768,
        'অনেক সাইট, একটি ভৌত সার্ভার, প্রতিটির রিসোর্সের একটি সীমাবদ্ধ অংশ।'
      ),

      h(2, 'এর খরচ, আকৃতিতে', 'what-it-costs-in-shape'),
      p('<p>Shared হোস্টিং ধারাবাহিকভাবে আসল server-side প্রসেসিংসহ একটি আসল সাইট চালানোর সবচেয়ে কম খরচের উপায় — একটি VPS-এর চেয়ে অনেক কম দামে, আর সাধারণত মাসিক বা একটি বার্ষিক ছাড়সহ বিল করা, ডোমেইন নিবন্ধনের মতো আকৃতিতে। প্রারম্ভিক দাম আর renewal-দাম লাফও এখানে সাধারণ, ডোমেইন-নিবন্ধন পাঠে কভার করা একই ফাঁদ — শুধু headline অফার নয়, renewal দাম যাচাই করুন।</p>'),

      callout('tip', '<p>একটি প্রথম আসল প্রোজেক্টের জন্য — একটি WordPress সাইট, ডেটাবেসসহ একটি PHP সাইট, একটি যোগাযোগ formসহ একটি portfolio — shared হোস্টিং সাধারণত সঠিক শুরুর বিন্দু, দ্রুত ছাড়িয়ে যাওয়ার একটি আপস নয়। পরে আরও শক্তিশালী কিছুতে যাওয়া সহজ, একবার (আর যদি) আপনি সত্যিই এটি ছাড়িয়ে যান।</p>'),
    ],
  },
})

lessons.push({
  slug: 'vps-and-dedicated-servers',
  sortOrder: 12,
  en: {
    title: 'VPS and Dedicated Servers',
    metaTitle: 'VPS and Dedicated Servers Explained | Learn Computer Academy',
    metaDescription: 'A VPS gives you an isolated, full-control slice of a shared server; a dedicated server gives you the whole machine. What that control actually means in practice.',
    blocks: [
      p('<p>A <b>VPS</b> (virtual private server) and a <b>dedicated server</b> both give you something shared hosting doesn\'t: full control over the server itself, not just a control panel sitting on top of it. The difference between the two is simply how much of the underlying hardware is actually yours.</p>'),

      h(2, 'VPS — An Isolated Slice'),
      p('<p>A VPS uses virtualisation to split one physical server into several independent virtual ones. Each VPS behaves like its own separate computer — it has its own operating system, its own resources, and no visibility into the other virtual servers sharing the same physical hardware — even though, underneath, it is still one machine divided up.</p>'),

      h(2, 'Dedicated Server — the Whole Machine'),
      p('<p>A dedicated server is exactly what it sounds like: one entire physical server, with nothing else running on it, entirely yours. It is the most resource and control a rented server can offer, and correspondingly the most expensive and least common choice for a student project.</p>'),

      img(
        'docs/img/hosting/vps-dedicated-1',
        'Isometric diagram contrasting one physical server split into several isolated virtual compartments labelled VPS, next to a single physical server entirely occupied by one dedicated tenant',
        1024, 768,
        'A VPS is an isolated slice of a shared machine; a dedicated server is the whole machine, to one customer.'
      ),

      h(2, 'What "Full Control" Actually Means'),
      p('<p>With both, you get <b>root access</b> — the ability to install any software, configure the server however you want, and run things a shared-hosting control panel would never expose. That includes Node.js, custom database configurations, background processes, and anything else shared hosting typically blocks.</p><p>The trade is direct: full control means full responsibility. You are the one applying security updates, configuring a firewall, setting up backups, and diagnosing problems when something breaks — none of it handled invisibly the way it is on shared hosting.</p>'),

      callout('warning', '<p>An unmanaged VPS with no one applying security updates is a genuine security liability, not just an inconvenience — it can be compromised and used to send spam or attack other systems without you noticing for a long time. If you choose this route, plan for ongoing maintenance from day one, not as an afterthought.</p>'),

      h(2, 'Managed vs. Unmanaged'),
      p('<p>Many providers offer a <b>managed VPS</b> option — you get full root access, but the provider handles security patching, monitoring, and baseline maintenance for an added cost. This narrows the gap with shared hosting\'s convenience while keeping most of a VPS\'s control and flexibility, and is often a sensible middle ground for someone past total beginner but not yet comfortable fully administering a server solo.</p>'),

      h(2, 'When This Level Actually Makes Sense'),
      p('<p>A VPS becomes worth it when a project outgrows shared hosting\'s limits, needs software shared hosting won\'t run (Node.js being the most common case for students on this site), or needs configuration control a shared control panel simply doesn\'t expose. For a first project, or a typical WordPress or PHP site with modest traffic, shared hosting is almost always still the better starting point — this is a step up to take once there is a concrete reason for it.</p>'),
    ],
  },
  bn: {
    title: 'VPS আর Dedicated সার্ভার',
    metaTitle: 'VPS আর Dedicated সার্ভার ব্যাখ্যা | Learn Computer Academy',
    metaDescription: 'একটি VPS আপনাকে একটি shared সার্ভারের একটি বিচ্ছিন্ন, পূর্ণ-নিয়ন্ত্রণ অংশ দেয়; একটি dedicated সার্ভার আপনাকে পুরো মেশিন দেয়। সেই নিয়ন্ত্রণ বাস্তবে আসলে কী বোঝায়।',
    blocks: [
      p('<p>একটি <b>VPS</b> (virtual private server) আর একটি <b>dedicated সার্ভার</b> দুটোই আপনাকে এমন কিছু দেয় যা shared হোস্টিং দেয় না: সার্ভার নিজের উপর পূর্ণ নিয়ন্ত্রণ, শুধু এর উপরে বসা একটি control panel নয়। দুটির মধ্যে পার্থক্য শুধু অন্তর্নিহিত হার্ডওয়্যারের কতটা আসলে আপনার।</p>'),

      h(2, 'VPS — একটি বিচ্ছিন্ন অংশ', 'vps-an-isolated-slice'),
      p('<p>একটি VPS একটি ভৌত সার্ভারকে কয়েকটি স্বাধীন virtual সার্ভারে ভাগ করতে virtualisation ব্যবহার করে। প্রতিটি VPS নিজস্ব একটি আলাদা কম্পিউটারের মতো আচরণ করে — এর নিজস্ব অপারেটিং সিস্টেম আছে, নিজস্ব রিসোর্স আছে, আর একই ভৌত হার্ডওয়্যার শেয়ার করা অন্য virtual সার্ভারে কোনো দৃশ্যমানতা নেই — যদিও, নিচে, এটি এখনো একটি মেশিন ভাগ করা।</p>'),

      h(2, 'Dedicated সার্ভার — পুরো মেশিন', 'dedicated-server-the-whole-machine'),
      p('<p>একটি dedicated সার্ভার ঠিক যা শোনায়: একটি সম্পূর্ণ ভৌত সার্ভার, এতে আর কিছু না চলা, সম্পূর্ণ আপনার। এটি একটি ভাড়া করা সার্ভার দিতে পারে সবচেয়ে বেশি রিসোর্স আর নিয়ন্ত্রণ, আর সেই অনুযায়ী একটি শিক্ষার্থী প্রোজেক্টের জন্য সবচেয়ে ব্যয়বহুল আর সবচেয়ে কম সাধারণ পছন্দ।</p>'),

      img(
        'docs/img/hosting/vps-dedicated-1',
        'Isometric ডায়াগ্রাম যেখানে VPS লেবেল করা কয়েকটি বিচ্ছিন্ন virtual compartment-এ ভাগ করা একটি ভৌত সার্ভারের বিপরীতে একজন dedicated ভাড়াটে দ্বারা সম্পূর্ণ দখল করা একটি একক ভৌত সার্ভার দেখানো হয়েছে',
        1024, 768,
        'একটি VPS একটি shared মেশিনের একটি বিচ্ছিন্ন অংশ; একটি dedicated সার্ভার পুরো মেশিন, একজন গ্রাহকের জন্য।'
      ),

      h(2, '"পূর্ণ নিয়ন্ত্রণ" আসলে কী বোঝায়', 'what-full-control-actually-means'),
      p('<p>দুটোতেই, আপনি <b>root access</b> পান — যেকোনো সফটওয়্যার ইনস্টল করার, যেভাবে ইচ্ছা সার্ভার কনফিগার করার, আর একটি shared-হোস্টিং control panel কখনো প্রকাশ করবে না এমন জিনিস চালানোর ক্ষমতা। এতে Node.js, কাস্টম ডেটাবেস কনফিগারেশন, ব্যাকগ্রাউন্ড প্রক্রিয়া, আর shared হোস্টিং সাধারণত ব্লক করে এমন অন্য যেকোনো কিছু অন্তর্ভুক্ত।</p><p>বিনিময়টি সরাসরি: পূর্ণ নিয়ন্ত্রণ মানে পূর্ণ দায়িত্ব। আপনিই নিরাপত্তা আপডেট প্রয়োগ করছেন, একটি firewall কনফিগার করছেন, backup সেট আপ করছেন, আর কিছু ভাঙলে সমস্যা নির্ণয় করছেন — shared হোস্টিং-এ যেভাবে অদৃশ্যভাবে সামলানো হয় তার কিছুই নয়।</p>'),

      callout('warning', '<p>কেউ নিরাপত্তা আপডেট প্রয়োগ না করা একটি unmanaged VPS শুধু একটি অসুবিধা নয়, একটি আসল নিরাপত্তা দায় — এটি আপস হতে পারে আর আপনি অনেকক্ষণ লক্ষ্য না করেই spam পাঠাতে বা অন্য সিস্টেম আক্রমণ করতে ব্যবহৃত হতে পারে। আপনি এই পথ বাছলে, প্রথম দিন থেকেই চলমান রক্ষণাবেক্ষণের পরিকল্পনা করুন, পরে ভাবার বিষয় হিসেবে নয়।</p>'),

      h(2, 'Managed বনাম Unmanaged', 'managed-vs-unmanaged'),
      p('<p>অনেক প্রদানকারী একটি <b>managed VPS</b> বিকল্প দেয় — আপনি পূর্ণ root access পান, কিন্তু প্রদানকারী একটি অতিরিক্ত খরচে নিরাপত্তা patching, নজরদারি, আর ভিত্তিগত রক্ষণাবেক্ষণ সামলায়। এটি বেশিরভাগ VPS-এর নিয়ন্ত্রণ আর নমনীয়তা রেখে shared হোস্টিং-এর সুবিধার সাথে ফাঁক সংকুচিত করে, আর প্রায়ই সম্পূর্ণ শিক্ষানবিসের বাইরে কিন্তু একা সম্পূর্ণভাবে একটি সার্ভার প্রশাসন করতে এখনো স্বাচ্ছন্দ্যবোধ করেন না এমন কারো জন্য একটি যুক্তিসঙ্গত মধ্যপন্থা।</p>'),

      h(2, 'এই স্তরটি আসলে কখন অর্থপূর্ণ হয়', 'when-this-level-actually-makes-sense'),
      p('<p>একটি VPS তখন সার্থক হয়ে ওঠে যখন একটি প্রোজেক্ট shared হোস্টিং-এর সীমা ছাড়িয়ে যায়, এমন সফটওয়্যার দরকার হয় যা shared হোস্টিং চালাবে না (এই সাইটের শিক্ষার্থীদের জন্য Node.js সবচেয়ে সাধারণ ক্ষেত্র), বা কনফিগারেশন নিয়ন্ত্রণ দরকার হয় যা একটি shared control panel সহজভাবে প্রকাশ করে না। একটি প্রথম প্রোজেক্ট, বা মাঝারি ট্রাফিকযুক্ত একটি সাধারণ WordPress বা PHP সাইটের জন্য, shared হোস্টিং প্রায় সবসময় এখনো ভালো শুরুর বিন্দু — এটি একটি নির্দিষ্ট কারণ থাকলে তোলার মতো একটি পদক্ষেপ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'cloud-and-managed-platforms',
  sortOrder: 13,
  en: {
    title: 'Cloud Hosting and Managed Platforms',
    metaTitle: 'Cloud Hosting and Managed Platforms | Learn Computer Academy',
    metaDescription: 'Cloud and managed platforms abstract the server away entirely — you deploy code, not configure machines. What that trade actually looks like.',
    blocks: [
      p('<p>Cloud hosting and managed platforms are the newest broad category, and the one most beginners actually use today without necessarily calling it by this name — Vercel, Netlify, Railway, and similar services all fall here. The shared idea: the underlying server is abstracted away almost entirely. You deploy code; the platform figures out where and how to run it.</p>'),

      h(2, 'What "Abstracted Away" Actually Means'),
      p('<p>With shared hosting or a VPS, you are always aware there is a specific server — you can name it, log into it, configure it. With most cloud and managed platforms, that concept mostly disappears. You connect a Git repository or upload a build, and the platform runs it somewhere, scales it automatically, and generally does not expose which physical machine is involved at all.</p>'),

      img(
        'docs/img/hosting/cloud-managed-1',
        'Isometric diagram showing a developer pushing code to a cloud icon, with the cloud automatically distributing it across several small server icons behind the scenes, no single server highlighted',
        1024, 768,
        'You deploy code; the platform decides where and how it actually runs.'
      ),

      h(2, 'What This Suits Especially Well'),
      p('<p>Modern React and Next.js hosting (this site itself runs this way) is built almost entirely around this model — connect a repository, and every push deploys automatically, with no server ever manually touched. Node.js APIs, static sites, and increasingly WordPress-as-a-managed-service all have strong offerings in this category too.</p>'),

      h(2, 'Managed WordPress, Specifically'),
      p('<p>Distinct from general cloud platforms, <b>managed WordPress hosting</b> is shared or cloud infrastructure specifically tuned for WordPress — with automatic updates, WordPress-specific caching, and specialised support, at a higher price than generic shared hosting but usually a smoother experience for a WordPress-only site.</p>'),

      h(2, 'The Trade-Off'),
      p('<p>The convenience is real: no server administration, automatic scaling, and deployment that\'s often as simple as pushing code to a Git repository. What you give up is deep control — you generally cannot install arbitrary system-level software, and you\'re working within whatever the platform\'s conventions and limits are, rather than a fully open server.</p>'),

      callout('note', '<p>This category overlaps heavily with what "the edge" and "serverless" mean in practice, both covered properly in their own lessons later. For now, the useful mental model is simple: cloud and managed platforms trade some control for a great deal of convenience, which is usually a good trade for a student project or a small business site.</p>'),

      h(2, 'A Realistic Fit for This Site\'s Courses'),
      p('<p>A React portfolio project deploys naturally to this kind of platform, often on a free tier — the deploying-a-react-app lesson later in this category walks through it directly. Node.js APIs fit well here too. WordPress and plain PHP sites more often still use shared hosting or managed WordPress hosting specifically, simply because that ecosystem grew up around traditional hosting first.</p>'),
    ],
  },
  bn: {
    title: 'Cloud হোস্টিং আর Managed প্ল্যাটফর্ম',
    metaTitle: 'Cloud হোস্টিং আর Managed প্ল্যাটফর্ম | Learn Computer Academy',
    metaDescription: 'Cloud আর managed প্ল্যাটফর্ম সার্ভারকে প্রায় সম্পূর্ণভাবে বিমূর্ত করে — আপনি কোড deploy করেন, মেশিন কনফিগার করেন না। সেই বিনিময়টি আসলে কেমন দেখায়।',
    blocks: [
      p('<p>Cloud হোস্টিং আর managed প্ল্যাটফর্ম সবচেয়ে নতুন বিস্তৃত শ্রেণী, আর যেটি বেশিরভাগ শিক্ষানবিস আজ এই নামে না ডেকেই আসলে ব্যবহার করে — Vercel, Netlify, Railway, আর একই ধরনের সেবা সবই এখানে পড়ে। শেয়ার করা ধারণা: অন্তর্নিহিত সার্ভার প্রায় সম্পূর্ণভাবে বিমূর্ত। আপনি কোড deploy করেন; প্ল্যাটফর্মটি বের করে কোথায় আর কীভাবে এটি চালাবে।</p>'),

      h(2, '"বিমূর্ত" আসলে কী বোঝায়', 'what-abstracted-away-actually-means'),
      p('<p>Shared হোস্টিং বা একটি VPS-এ, আপনি সবসময় জানেন একটি নির্দিষ্ট সার্ভার আছে — আপনি এটির নাম দিতে পারেন, এতে login করতে পারেন, এটি কনফিগার করতে পারেন। বেশিরভাগ cloud আর managed প্ল্যাটফর্মে, সেই ধারণাটি বেশিরভাগ অদৃশ্য হয়ে যায়। আপনি একটি Git repository সংযুক্ত করেন বা একটি build আপলোড করেন, আর প্ল্যাটফর্মটি এটি কোথাও চালায়, স্বয়ংক্রিয়ভাবে scale করে, আর সাধারণত কোন ভৌত মেশিন জড়িত তা একেবারেই প্রকাশ করে না।</p>'),

      img(
        'docs/img/hosting/cloud-managed-1',
        'Isometric ডায়াগ্রাম যেখানে একজন ডেভেলপার একটি cloud আইকনে কোড push করছেন, cloudটি পর্দার পেছনে স্বয়ংক্রিয়ভাবে এটি কয়েকটি ছোট সার্ভার আইকন জুড়ে বিতরণ করছে, কোনো একক সার্ভার হাইলাইট করা নেই',
        1024, 768,
        'আপনি কোড deploy করেন; প্ল্যাটফর্মটি ঠিক করে এটি আসলে কোথায় আর কীভাবে চলে।'
      ),

      h(2, 'এটি বিশেষভাবে কীসের উপযোগী', 'what-this-suits-especially-well'),
      p('<p>আধুনিক React আর Next.js হোস্টিং (এই সাইট নিজেই এভাবে চলে) প্রায় সম্পূর্ণভাবে এই মডেলের চারপাশে তৈরি — একটি repository সংযুক্ত করুন, আর প্রতিটি push স্বয়ংক্রিয়ভাবে deploy হয়, কোনো সার্ভার কখনো ম্যানুয়ালি স্পর্শ না করেই। Node.js API, static সাইট, আর ক্রমবর্ধমানভাবে WordPress-as-a-managed-service-এরও এই শ্রেণীতে শক্তিশালী অফার আছে।</p>'),

      h(2, 'বিশেষভাবে Managed WordPress', 'managed-wordpress-specifically'),
      p('<p>সাধারণ cloud প্ল্যাটফর্ম থেকে আলাদা, <b>managed WordPress হোস্টিং</b> হলো বিশেষভাবে WordPress-এর জন্য টিউন করা shared বা cloud অবকাঠামো — স্বয়ংক্রিয় আপডেট, WordPress-নির্দিষ্ট caching, আর বিশেষায়িত সাপোর্টসহ, সাধারণ shared হোস্টিংয়ের চেয়ে বেশি দামে কিন্তু একটি শুধু-WordPress সাইটের জন্য সাধারণত একটি মসৃণ অভিজ্ঞতা।</p>'),

      h(2, 'বিনিময়টি', 'the-trade-off'),
      p('<p>সুবিধাটি বাস্তব: কোনো সার্ভার প্রশাসন নেই, স্বয়ংক্রিয় scaling, আর deployment যা প্রায়ই একটি Git repository-তে কোড push করার মতোই সরল। আপনি যা ছাড় দেন তা হলো গভীর নিয়ন্ত্রণ — আপনি সাধারণত স্বেচ্ছাধীন সিস্টেম-স্তরের সফটওয়্যার ইনস্টল করতে পারেন না, আর আপনি একটি সম্পূর্ণ খোলা সার্ভারের বদলে প্ল্যাটফর্মের প্রথা আর সীমার মধ্যে কাজ করছেন।</p>'),

      callout('note', '<p>এই শ্রেণী "the edge" আর "serverless" বাস্তবে কী বোঝায় তার সাথে ব্যাপকভাবে ওভারল্যাপ করে, দুটোই পরে নিজস্ব পাঠে ঠিকভাবে কভার করা। এখনকার জন্য, কাজের মানসিক মডেলটি সরল: cloud আর managed প্ল্যাটফর্ম কিছু নিয়ন্ত্রণের বিনিময়ে অনেক সুবিধা দেয়, যা একটি শিক্ষার্থী প্রোজেক্ট বা একটি ছোট ব্যবসার সাইটের জন্য সাধারণত একটি ভালো বিনিময়।</p>'),

      h(2, 'এই সাইটের কোর্সের জন্য একটি বাস্তবসম্মত মিল', 'a-realistic-fit-for-this-sites-courses'),
      p('<p>একটি React portfolio প্রোজেক্ট স্বাভাবিকভাবে এই ধরনের প্ল্যাটফর্মে deploy হয়, প্রায়ই একটি বিনামূল্যের tier-এ — এই বিভাগে পরে deploying-a-react-app পাঠ সরাসরি এর মধ্য দিয়ে যায়। Node.js API-ও এখানে ভালোভাবে মানানসই। WordPress আর সাধারণ PHP সাইট বেশিরভাগ এখনো বিশেষভাবে shared হোস্টিং বা managed WordPress হোস্টিং ব্যবহার করে, শুধু কারণ সেই ইকোসিস্টেমটি প্রথমে প্রথাগত হোস্টিংয়ের চারপাশে বড় হয়েছে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'static-hosting',
  sortOrder: 14,
  en: {
    title: 'Static Hosting',
    metaTitle: 'Static Hosting Explained | Learn Computer Academy',
    metaDescription: 'When a site is just files with no server-side processing, hosting becomes dramatically simpler and often free. What static hosting is and where it stops being enough.',
    blocks: [
      p('<p>A <b>static site</b> is one with no server-side processing at all — plain HTML, CSS, and JavaScript files, sent to the browser exactly as they are stored, with no PHP, no database query, and no server-side logic deciding what to send. Hosting for this kind of site is dramatically simpler than everything covered so far, and often free.</p>'),

      h(2, 'Why Static Hosting Is So Much Simpler'),
      p('<p>A static host does not need to run any code at all — no PHP interpreter, no application server, no database. It just needs to store files and hand them out on request, which is one of the cheapest, most reliable things a server can do. That simplicity is exactly why static hosting is frequently free, and why it scales to enormous traffic with very little effort.</p>'),

      img(
        'docs/img/hosting/static-hosting-1',
        'Isometric diagram showing a folder of plain files — HTML, CSS, JS icons — being handed directly to a browser with no server processing step in between, in contrast to a server with a gear icon representing processing',
        1024, 768,
        'No processing step — the files sent are exactly the files stored, unchanged.'
      ),

      h(2, 'What Genuinely Counts as Static'),
      p('<ul><li>A plain HTML/CSS/JS site — this site\'s own HTML, CSS, and JavaScript courses build exactly this kind of project.</li><li>A React app, once <b>built</b> — the build process turns React source code into plain static files, which is why React apps commonly deploy to static-style hosting even though the source involves a build step.</li><li>Any site generated ahead of time into fixed files, even if the generation process itself was complex.</li></ul><p>What does <b>not</b> count: anything running PHP on each request, anything querying a database live, and anything needing server-side logic to decide what to send back. WordPress and PHP sites, by their nature, are not static — see the note on `getStaticProps`-style approaches for advanced cases, which are outside the scope of this introductory category.</p>'),

      h(2, 'Where It\'s Hosted'),
      p('<p>Static hosting is commonly offered free by cloud platforms (the same ones covered in the previous lesson), by dedicated static-hosting services, and as a basic feature of most CDNs, covered later in this category. Because there is no processing to manage, it is also naturally suited to being served from many locations at once, which is precisely the connection to CDNs made explicit soon.</p>'),

      callout('tip', '<p>For a portfolio site — the exact kind of project the <a href="/career/">Career Skills</a> course tells you to deploy — static hosting is very often the right, and free, choice. It is worth using for any project that genuinely does not need a database or server-side logic, regardless of how it was built.</p>'),

      h(2, 'Where Static Stops Being Enough'),
      p('<p>The moment a project needs to save data submitted by a user, query a database, or run any logic that must happen on a server rather than in the visitor\'s browser, it is no longer purely static. That doesn\'t mean starting over — many real projects combine a static frontend with a small separate backend API (exactly the Node.js pattern taught in this site\'s Node.js course), which is a different and increasingly common architecture, covered briefly in the edge and serverless lesson later in this part.</p>'),
    ],
  },
  bn: {
    title: 'Static হোস্টিং',
    metaTitle: 'Static হোস্টিং ব্যাখ্যা | Learn Computer Academy',
    metaDescription: 'একটি সাইট যখন কোনো server-side প্রসেসিং ছাড়া শুধু ফাইল, হোস্টিং নাটকীয়ভাবে সহজ আর প্রায়ই বিনামূল্যে হয়ে যায়। Static হোস্টিং কী আর কোথায় এটি যথেষ্ট থাকা বন্ধ করে।',
    blocks: [
      p('<p>একটি <b>static সাইট</b> এমন একটি যাতে একেবারেই কোনো server-side প্রসেসিং নেই — সাধারণ HTML, CSS, আর JavaScript ফাইল, ব্রাউজারে ঠিক যেভাবে সংরক্ষিত সেভাবে পাঠানো, কোনো PHP নেই, কোনো ডেটাবেস কোয়েরি নেই, আর কী পাঠাতে হবে তা ঠিক করা কোনো server-side লজিক নেই। এই ধরনের সাইটের জন্য হোস্টিং এখন পর্যন্ত কভার করা সবকিছুর চেয়ে নাটকীয়ভাবে সহজ, আর প্রায়ই বিনামূল্যে।</p>'),

      h(2, 'Static হোস্টিং কেন এত সহজ', 'why-static-hosting-is-so-much-simpler'),
      p('<p>একটি static host-এর একেবারেই কোনো কোড চালানোর প্রয়োজন নেই — কোনো PHP interpreter নেই, কোনো অ্যাপ্লিকেশন সার্ভার নেই, কোনো ডেটাবেস নেই। এর শুধু ফাইল সংরক্ষণ করতে হয় আর অনুরোধে বিতরণ করতে হয়, যা একটি সার্ভার করতে পারে এমন সবচেয়ে সস্তা, সবচেয়ে নির্ভরযোগ্য জিনিসগুলোর একটি। সেই সরলতাই ঠিক কারণ static হোস্টিং প্রায়ই বিনামূল্যে, আর কেন এটি খুব কম পরিশ্রমে বিশাল ট্রাফিকে scale করে।</p>'),

      img(
        'docs/img/hosting/static-hosting-1',
        'Isometric ডায়াগ্রাম যেখানে সাধারণ ফাইলের একটি ফোল্ডার — HTML, CSS, JS আইকন — মাঝখানে কোনো সার্ভার প্রসেসিং ধাপ ছাড়াই সরাসরি একটি ব্রাউজারে দেওয়া হচ্ছে, প্রসেসিং প্রতিনিধিত্বকারী একটি গিয়ার আইকনসহ একটি সার্ভারের বিপরীতে',
        1024, 768,
        'কোনো প্রসেসিং ধাপ নেই — পাঠানো ফাইলগুলো ঠিক সেই ফাইল যা সংরক্ষিত, অপরিবর্তিত।'
      ),

      h(2, 'সত্যিই static হিসেবে কী গণ্য হয়', 'what-genuinely-counts-as-static'),
      p('<p><ul><li>একটি সাধারণ HTML/CSS/JS সাইট — এই সাইটের নিজস্ব HTML, CSS, আর JavaScript কোর্স ঠিক এই ধরনের প্রোজেক্ট তৈরি করে।</li><li>একটি React অ্যাপ, একবার <b>build</b> হলে — build প্রক্রিয়া React সোর্স কোডকে সাধারণ static ফাইলে পরিণত করে, যে কারণে React অ্যাপ সাধারণত static-স্টাইল হোস্টিং-এ deploy হয় যদিও সোর্সে একটি build ধাপ জড়িত।</li><li>আগে থেকে নির্দিষ্ট ফাইলে তৈরি করা যেকোনো সাইট, তৈরির প্রক্রিয়াটি নিজে জটিল হলেও।</li></ul></p><p>যা static হিসেবে <b>গণ্য হয় না</b>: প্রতিটি অনুরোধে PHP চালানো যেকোনো কিছু, লাইভ একটি ডেটাবেস কোয়েরি করা যেকোনো কিছু, আর কী ফেরত পাঠাতে হবে তা ঠিক করতে server-side লজিক দরকার এমন যেকোনো কিছু। WordPress আর PHP সাইট, তাদের প্রকৃতি অনুযায়ী, static নয়।</p>'),

      h(2, 'এটি কোথায় host করা হয়', 'where-its-hosted'),
      p('<p>Static হোস্টিং সাধারণত cloud প্ল্যাটফর্ম দ্বারা বিনামূল্যে দেওয়া হয় (আগের পাঠে কভার করা একই গুলো), নিবেদিত static-হোস্টিং সেবা দ্বারা, আর এই বিভাগে পরে কভার করা বেশিরভাগ CDN-এর একটি মৌলিক ফিচার হিসেবে। পরিচালনার মতো কোনো প্রসেসিং না থাকায়, এটি একসাথে অনেক জায়গা থেকে পরিবেশিত হওয়ার জন্যও স্বাভাবিকভাবে উপযোগী, যা ঠিক শীঘ্রই স্পষ্ট করা CDN-এর সাথে সংযোগ।</p>'),

      callout('tip', '<p>একটি portfolio সাইটের জন্য — ঠিক সেই ধরনের প্রোজেক্ট যা <a href="/bn/career/">Career Skills</a> কোর্স আপনাকে deploy করতে বলে — static হোস্টিং প্রায়ই সঠিক, আর বিনামূল্যের, পছন্দ। এটি কীভাবে তৈরি হয়েছে তা নির্বিশেষে সত্যিই একটি ডেটাবেস বা server-side লজিক দরকার নেই এমন যেকোনো প্রোজেক্টের জন্য ব্যবহার করা সার্থক।</p>'),

      h(2, 'Static যেখানে যথেষ্ট থাকা বন্ধ করে', 'where-static-stops-being-enough'),
      p('<p>একটি প্রোজেক্টের যে মুহূর্তে একজন ব্যবহারকারীর জমা দেওয়া ডেটা সংরক্ষণ করা, একটি ডেটাবেস কোয়েরি করা, বা ভিজিটরের ব্রাউজারের বদলে একটি সার্ভারে ঘটতে হবে এমন কোনো লজিক চালানো দরকার, এটি আর বিশুদ্ধভাবে static নয়। এর অর্থ নতুন করে শুরু করা নয় — অনেক আসল প্রোজেক্ট একটি static frontend-কে একটি ছোট আলাদা backend API-এর সাথে একত্র করে (ঠিক এই সাইটের Node.js কোর্সে শেখানো প্যাটার্ন), যা একটি ভিন্ন আর ক্রমবর্ধমানভাবে সাধারণ স্থাপত্য, এই অংশে পরে edge আর serverless পাঠে সংক্ষেপে কভার করা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'choosing-hosting-for-your-stack',
  sortOrder: 15,
  en: {
    title: 'Choosing Hosting for Your Stack',
    metaTitle: 'Choosing Hosting for Your Stack | Learn Computer Academy',
    metaDescription: 'A direct decision guide matching each course taught on this site to the hosting type that actually fits it, and why.',
    blocks: [
      p('<p>The previous lessons covered each hosting type on its own. This one puts them together into a direct answer: for each stack taught on this site, which kind of hosting actually fits, and why.</p>'),

      h(2, 'The Decision Table'),
      table(
        ['What you built', 'Fits', 'Why'],
        [
          ['Plain HTML / CSS / JS', 'Static hosting', 'No server-side processing — the cheapest, simplest match'],
          ['A React app', 'Static or cloud/managed hosting', 'React builds down to static files; cloud platforms add easy automated deployment on top'],
          ['A PHP site with a database', 'Shared hosting', 'Shared hosting is built around exactly this combination — PHP plus MySQL is its default assumption'],
          ['WordPress', 'Shared or managed WordPress hosting', 'Same underlying need as plain PHP, with WordPress-specific conveniences layered on managed options'],
          ['A Node.js app or API', 'VPS or a cloud/managed platform built for Node', 'Traditional shared hosting generally cannot run a persistent Node.js process at all'],
          ['SQL / a database-backed project generally', 'Whatever hosts the application layer, plus a database service', 'Most hosting types bundle or connect to a database; the app\'s own hosting type usually decides this by default'],
        ]
      ),

      img(
        'docs/img/hosting/choosing-hosting-1',
        'Isometric diagram showing five different project icons — HTML files, a React logo, a PHP elephant-like icon, a WordPress icon, and a Node.js icon — each with an arrow pointing to a matching hosting-type icon',
        1024, 768,
        'Different projects need genuinely different hosting — matching them correctly avoids both wasted money and real technical dead ends.'
      ),

      h(2, 'Why Node.js Is the Odd One Out'),
      p('<p>PHP and WordPress work on shared hosting because a shared server can start a fresh PHP process for each incoming request and let it finish quickly. Node.js is built differently — an app typically needs to run as one continuous, always-on process, which is exactly the kind of thing traditional shared hosting was never designed to allow. This is precisely why the Node.js course\'s own content doesn\'t assume shared hosting as a destination — a VPS, a managed Node platform, or a cloud service built for exactly this is the realistic path.</p>'),

      h(2, 'What Happens If You Get It Wrong'),
      p('<p>Choosing the wrong hosting type doesn\'t usually fail quietly — buying shared hosting for a Node.js app typically means it simply won\'t run at all, not that it runs poorly. Buying an expensive VPS for a simple static portfolio site works, but wastes money and adds server-maintenance responsibility for no real benefit. Getting this match right the first time avoids both failure modes.</p>'),

      callout('tip', '<p>When genuinely unsure, static or shared hosting is almost always the safer, cheaper starting guess for anything that isn\'t Node.js — it is easy to move to something more powerful later, and hard to justify paying for VPS-level control before you actually need it.</p>'),

      h(2, 'Where This Leads'),
      p('<p>The next lesson covers what each of these tiers actually costs, in shape rather than fixed numbers. After that, the practical mechanics of connecting a domain and deploying code — and then a dedicated walkthrough for each stack, applying exactly this table to real steps.</p>'),
    ],
  },
  bn: {
    title: 'আপনার Stack-এর জন্য হোস্টিং বাছা',
    metaTitle: 'আপনার Stack-এর জন্য হোস্টিং বাছা | Learn Computer Academy',
    metaDescription: 'এই সাইটে শেখানো প্রতিটি কোর্সকে আসলে মানানসই হোস্টিং ধরনের সাথে মেলানো একটি সরাসরি সিদ্ধান্তের গাইড, আর কেন।',
    blocks: [
      p('<p>আগের পাঠগুলো প্রতিটি হোস্টিং ধরন নিজে থেকে কভার করেছে। এটি সেগুলোকে একসাথে একটি সরাসরি উত্তরে রাখে: এই সাইটে শেখানো প্রতিটি stack-এর জন্য, কোন ধরনের হোস্টিং আসলে মানানসই, আর কেন।</p>'),

      h(2, 'সিদ্ধান্তের টেবিল', 'the-decision-table'),
      table(
        ['আপনি কী তৈরি করেছেন', 'মানানসই', 'কেন'],
        [
          ['সাধারণ HTML / CSS / JS', 'Static হোস্টিং', 'কোনো server-side প্রসেসিং নেই — সবচেয়ে সস্তা, সবচেয়ে সরল মিল'],
          ['একটি React অ্যাপ', 'Static বা cloud/managed হোস্টিং', 'React static ফাইলে build হয়; cloud প্ল্যাটফর্ম এর উপর সহজ স্বয়ংক্রিয় deployment যোগ করে'],
          ['ডেটাবেসসহ একটি PHP সাইট', 'Shared হোস্টিং', 'Shared হোস্টিং ঠিক এই সমন্বয়ের চারপাশে তৈরি — PHP আর MySQL এর ডিফল্ট অনুমান'],
          ['WordPress', 'Shared বা managed WordPress হোস্টিং', 'সাধারণ PHP-এর একই অন্তর্নিহিত প্রয়োজন, managed বিকল্পে WordPress-নির্দিষ্ট সুবিধাসহ'],
          ['একটি Node.js অ্যাপ বা API', 'একটি VPS বা Node-এর জন্য তৈরি একটি cloud/managed প্ল্যাটফর্ম', 'প্রথাগত shared হোস্টিং সাধারণত একেবারেই একটি স্থায়ী Node.js প্রক্রিয়া চালাতে পারে না'],
          ['SQL / সাধারণভাবে একটি ডেটাবেস-চালিত প্রোজেক্ট', 'যা application স্তর host করে, সাথে একটি ডেটাবেস সেবা', 'বেশিরভাগ হোস্টিং ধরন একটি ডেটাবেস বান্ডিল বা সংযুক্ত করে; অ্যাপের নিজের হোস্টিং ধরন সাধারণত ডিফল্টভাবে এটি ঠিক করে'],
        ]
      ),

      img(
        'docs/img/hosting/choosing-hosting-1',
        'Isometric ডায়াগ্রাম যেখানে পাঁচটি ভিন্ন প্রোজেক্ট আইকন দেখানো হয়েছে — HTML ফাইল, একটি React logo, একটি PHP হাতির মতো আইকন, একটি WordPress আইকন, আর একটি Node.js আইকন — প্রতিটি একটি মিলে যাওয়া হোস্টিং-ধরনের আইকনের দিকে একটি তীরসহ',
        1024, 768,
        'ভিন্ন প্রোজেক্টে সত্যিই ভিন্ন হোস্টিং দরকার — সঠিকভাবে মেলানো নষ্ট টাকা আর আসল টেকনিক্যাল অচলাবস্থা দুটোই এড়ায়।'
      ),

      h(2, 'Node.js কেন ব্যতিক্রম', 'why-nodejs-is-the-odd-one-out'),
      p('<p>PHP আর WordPress shared হোস্টিং-এ কাজ করে কারণ একটি shared সার্ভার প্রতিটি আগত অনুরোধের জন্য একটি নতুন PHP প্রক্রিয়া শুরু করতে আর এটি দ্রুত শেষ হতে দিতে পারে। Node.js ভিন্নভাবে তৈরি — একটি অ্যাপের সাধারণত একটি একক, ক্রমাগত, সবসময়-চালু প্রক্রিয়া হিসেবে চলতে হয়, যা ঠিক সেই ধরনের জিনিস যা প্রথাগত shared হোস্টিং কখনো অনুমতি দেওয়ার জন্য ডিজাইন করা হয়নি। এই কারণেই Node.js কোর্সের নিজস্ব কন্টেন্ট shared হোস্টিংকে একটি গন্তব্য হিসেবে ধরে নেয় না — একটি VPS, একটি managed Node প্ল্যাটফর্ম, বা ঠিক এর জন্য তৈরি একটি cloud সেবা বাস্তবসম্মত পথ।</p>'),

      h(2, 'ভুল হলে কী ঘটে', 'what-happens-if-you-get-it-wrong'),
      p('<p>ভুল হোস্টিং ধরন বাছা সাধারণত চুপচাপ ব্যর্থ হয় না — একটি Node.js অ্যাপের জন্য shared হোস্টিং কেনা সাধারণত মানে এটি একেবারেই চলবে না, খারাপভাবে চলবে না। একটি সরল static portfolio সাইটের জন্য একটি ব্যয়বহুল VPS কেনা কাজ করে, কিন্তু কোনো আসল সুবিধা ছাড়াই টাকা নষ্ট করে আর সার্ভার-রক্ষণাবেক্ষণের দায়িত্ব যোগ করে। প্রথমবার এই মিলটি সঠিক করা দুটো ব্যর্থতার ধরনই এড়ায়।</p>'),

      callout('tip', '<p>সত্যিই নিশ্চিত না হলে, Node.js নয় এমন যেকোনো কিছুর জন্য static বা shared হোস্টিং প্রায় সবসময় নিরাপদ, সস্তা শুরুর অনুমান — পরে বেশি শক্তিশালী কিছুতে যাওয়া সহজ, আর আপনার আসলে দরকার হওয়ার আগে VPS-স্তরের নিয়ন্ত্রণের জন্য টাকা দেওয়া ন্যায্যতা দেওয়া কঠিন।</p>'),

      h(2, 'এটি কোথায় নিয়ে যায়', 'where-this-leads'),
      p('<p>পরের পাঠ কভার করে এই tier-গুলোর প্রতিটি আসলে কী খরচ করে, নির্দিষ্ট সংখ্যার বদলে আকৃতিতে। এরপর, একটি ডোমেইন সংযুক্ত করা আর কোড deploy করার ব্যবহারিক প্রক্রিয়া — আর তারপর প্রতিটি stack-এর জন্য একটি নিবেদিত walkthrough, ঠিক এই টেবিলটি বাস্তব ধাপে প্রয়োগ করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'what-hosting-actually-costs',
  sortOrder: 16,
  en: {
    title: 'What Hosting Actually Costs',
    metaTitle: 'What Web Hosting Actually Costs | Learn Computer Academy',
    metaDescription: 'What genuinely changes in cost as you move up the hosting tiers, taught as ratios and shape rather than numbers that go stale within a year.',
    blocks: [
      // ⚠️ PRICE-SENSITIVE — tiers/ratios only, no fixed prices. See file header.
      p('<p>Specific hosting prices go stale within months — a number quoted here would likely be wrong by the time you read it. What stays true for years is the <i>shape</i> of the cost: roughly how each tier compares to the ones next to it, and what you actually get for the jump.</p>'),

      h(2, 'The Relative Shape'),
      table(
        ['Tier', 'Roughly, compared to shared hosting', 'What the jump buys'],
        [
          ['Static hosting', 'Often free, sometimes cheaper than shared', 'Simplicity — no server to manage at all'],
          ['Shared hosting', 'The baseline', 'A real server-side runtime (PHP, a database) at the lowest realistic cost'],
          ['Managed WordPress', 'A few times shared hosting', 'WordPress-specific performance, automatic updates, specialised support'],
          ['VPS (unmanaged)', 'Several times shared hosting', 'Full control, dedicated (not shared) resources'],
          ['VPS (managed)', 'More than unmanaged VPS', 'Same control, with maintenance handled for you'],
          ['Dedicated server', 'Many times shared hosting', 'An entire physical machine, maximum resources and control'],
          ['Cloud / usage-based platforms', 'Highly variable — often free at small scale', 'Pay roughly for what you actually use, which can be very cheap or surprisingly expensive depending on traffic'],
        ]
      ),

      img(
        'docs/img/hosting/cost-tiers-1',
        'Isometric diagram showing ascending stacked platform blocks of increasing height representing hosting cost tiers from static hosting at the bottom to a dedicated server at the top, no currency symbols or numbers shown',
        1024, 768,
        'Cost rises with control and dedicated resources — a real trade-off, not a strictly better tier at each step.'
      ),

      h(2, 'What Actually Drives the Price Within a Tier'),
      p('<p>Inside any single tier, price mainly moves with resources — how much storage, memory, and bandwidth are included — and with extras bundled in, like a free domain for the first year, automated backups, or a security certificate included at no extra charge. Two shared hosting plans from different companies can differ meaningfully even though both are, structurally, "shared hosting."</p>'),

      h(2, 'The Renewal Pattern, Again'),
      p('<p>The same pattern flagged in the domain-registration lesson shows up across almost every hosting tier: an attractive introductory price for the first term, followed by a higher renewal rate. This is close to an industry-wide norm rather than one company being unusually aggressive — checking the renewal price before buying is worth doing at every tier, not just for domains.</p>'),

      callout('warning', '<p>Usage-based cloud platforms deserve a specific warning: unlike a fixed monthly plan, cost there can genuinely spike if traffic spikes — a project that goes viral or gets hit by unusual traffic can produce a bill far larger than expected. Most platforms offer spending caps or alerts; setting one is a genuinely sensible habit before relying on this kind of hosting for anything real.</p>', 'Usage-based pricing can surprise you')  ,

      h(2, 'The Honest Budgeting Advice'),
      p('<p>For a first student project, budget for the cheapest tier that genuinely fits the project — often free, per the next lesson\'s free-hosting rundown. Only move up a tier when there is a specific, concrete reason: real traffic outgrowing shared hosting\'s limits, a need for Node.js, or a client project with requirements shared hosting genuinely can\'t meet. Paying for more than the project needs is the single most common hosting mistake among beginners.</p>'),
    ],
  },
  bn: {
    title: 'হোস্টিং আসলে কী খরচ করে',
    metaTitle: 'ওয়েব হোস্টিং আসলে কী খরচ করে | Learn Computer Academy',
    metaDescription: 'হোস্টিং tier-এ উঠতে থাকলে খরচে আসলে কী বদলায়, এক বছরের মধ্যে সেকেলে হয়ে যাবে এমন সংখ্যার বদলে অনুপাত আর আকৃতি হিসেবে শেখানো।',
    blocks: [
      p('<p>নির্দিষ্ট হোস্টিং দাম কয়েক মাসের মধ্যে সেকেলে হয়ে যায় — এখানে উদ্ধৃত একটি সংখ্যা আপনি এটি পড়ার সময় সম্ভবত ভুল হয়ে যাবে। যা বছরের পর বছর সত্য থাকে তা হলো খরচের <i>আকৃতি</i>: মোটামুটি প্রতিটি tier পাশের গুলোর সাথে কীভাবে তুলনা করে, আর সেই লাফের জন্য আপনি আসলে কী পান।</p>'),

      h(2, 'আপেক্ষিক আকৃতি', 'the-relative-shape'),
      table(
        ['Tier', 'মোটামুটি, shared হোস্টিংয়ের সাথে তুলনায়', 'লাফটি কী কেনে'],
        [
          ['Static হোস্টিং', 'প্রায়ই বিনামূল্যে, কখনো shared-এর চেয়ে সস্তা', 'সরলতা — পরিচালনার মতো একেবারেই কোনো সার্ভার নেই'],
          ['Shared হোস্টিং', 'ভিত্তি', 'সবচেয়ে কম বাস্তবসম্মত খরচে একটি আসল server-side runtime (PHP, একটি ডেটাবেস)'],
          ['Managed WordPress', 'Shared হোস্টিংয়ের কয়েকগুণ', 'WordPress-নির্দিষ্ট পারফরম্যান্স, স্বয়ংক্রিয় আপডেট, বিশেষায়িত সাপোর্ট'],
          ['VPS (unmanaged)', 'Shared হোস্টিংয়ের অনেকগুণ', 'পূর্ণ নিয়ন্ত্রণ, dedicated (shared নয়) রিসোর্স'],
          ['VPS (managed)', 'Unmanaged VPS-এর চেয়ে বেশি', 'একই নিয়ন্ত্রণ, রক্ষণাবেক্ষণ আপনার জন্য সামলানো'],
          ['Dedicated সার্ভার', 'Shared হোস্টিংয়ের অনেকগুণ', 'একটি সম্পূর্ণ ভৌত মেশিন, সর্বোচ্চ রিসোর্স আর নিয়ন্ত্রণ'],
          ['Cloud / ব্যবহার-ভিত্তিক প্ল্যাটফর্ম', 'ব্যাপকভাবে ভিন্ন — প্রায়ই ছোট স্কেলে বিনামূল্যে', 'আপনি আসলে যা ব্যবহার করেন তার মোটামুটি জন্য টাকা দিন, যা ট্রাফিকের উপর নির্ভর করে খুব সস্তা বা আশ্চর্যজনকভাবে ব্যয়বহুল হতে পারে'],
        ]
      ),

      img(
        'docs/img/hosting/cost-tiers-1',
        'Isometric ডায়াগ্রাম যেখানে নিচে static হোস্টিং থেকে উপরে একটি dedicated সার্ভার পর্যন্ত হোস্টিং খরচ tier প্রতিনিধিত্ব করা ক্রমবর্ধমান উচ্চতার স্তূপীকৃত platform ব্লক দেখানো হয়েছে, কোনো মুদ্রার চিহ্ন বা সংখ্যা দেখানো নেই',
        1024, 768,
        'নিয়ন্ত্রণ আর dedicated রিসোর্সের সাথে খরচ বাড়ে — একটি আসল বিনিময়, প্রতিটি ধাপে কঠোরভাবে ভালো একটি tier নয়।'
      ),

      h(2, 'একটি Tier-এর মধ্যে আসলে কী দাম চালায়', 'what-actually-drives-the-price-within-a-tier'),
      p('<p>যেকোনো একক tier-এর ভেতরে, দাম প্রধানত রিসোর্সের সাথে নড়ে — কতটা সংরক্ষণ, মেমরি, আর bandwidth অন্তর্ভুক্ত — আর একসাথে বান্ডিল করা অতিরিক্তের সাথে, যেমন প্রথম বছরের জন্য একটি বিনামূল্যের ডোমেইন, স্বয়ংক্রিয় backup, বা কোনো অতিরিক্ত খরচ ছাড়া অন্তর্ভুক্ত একটি নিরাপত্তা সার্টিফিকেট। ভিন্ন কোম্পানির দুটি shared হোস্টিং পরিকল্পনা কাঠামোগতভাবে দুটোই "shared হোস্টিং" হলেও অর্থপূর্ণভাবে ভিন্ন হতে পারে।</p>'),

      h(2, 'Renewal প্যাটার্ন, আবারও', 'the-renewal-pattern-again'),
      p('<p>ডোমেইন-নিবন্ধন পাঠে চিহ্নিত একই প্যাটার্ন প্রায় প্রতিটি হোস্টিং tier জুড়ে দেখা যায়: প্রথম মেয়াদের জন্য একটি আকর্ষণীয় প্রারম্ভিক দাম, তারপর একটি বেশি renewal হার। এটি একটি কোম্পানি অস্বাভাবিকভাবে আক্রমণাত্মক হওয়ার চেয়ে একটি শিল্প-ব্যাপী নিয়মের কাছাকাছি — কেনার আগে renewal দাম যাচাই করা প্রতিটি tier-এ করা সার্থক, শুধু ডোমেইনের জন্য নয়।</p>'),

      callout('warning', '<p>ব্যবহার-ভিত্তিক cloud প্ল্যাটফর্ম একটি নির্দিষ্ট সতর্কতার যোগ্য: একটি নির্দিষ্ট মাসিক পরিকল্পনার বিপরীতে, ট্রাফিক spike হলে সেখানে খরচ সত্যিই spike হতে পারে — viral হয়ে যাওয়া বা অস্বাভাবিক ট্রাফিকে আঘাত পাওয়া একটি প্রোজেক্ট প্রত্যাশার চেয়ে অনেক বড় একটি বিল তৈরি করতে পারে। বেশিরভাগ প্ল্যাটফর্ম খরচের সীমা বা সতর্কতা দেয়; কোনো আসল কিছুর জন্য এই ধরনের হোস্টিংয়ের উপর নির্ভর করার আগে একটি সেট করা সত্যিই যুক্তিসঙ্গত অভ্যাস।</p>', 'ব্যবহার-ভিত্তিক দাম আপনাকে অবাক করতে পারে'),

      h(2, 'সৎ বাজেট পরামর্শ', 'the-honest-budgeting-advice'),
      p('<p>একটি প্রথম শিক্ষার্থী প্রোজেক্টের জন্য, প্রোজেক্টটির সাথে সত্যিই মানানসই সবচেয়ে সস্তা tier-এর জন্য বাজেট করুন — পরের পাঠের বিনামূল্যের-হোস্টিং বিশ্লেষণ অনুযায়ী প্রায়ই বিনামূল্যে। শুধু একটি নির্দিষ্ট, বাস্তব কারণ থাকলে একটি tier উপরে যান: আসল ট্রাফিক shared হোস্টিংয়ের সীমা ছাড়িয়ে যাওয়া, Node.js-এর প্রয়োজন, বা shared হোস্টিং সত্যিই পূরণ করতে পারে না এমন প্রয়োজনীয়তাসহ একটি ক্লায়েন্ট প্রোজেক্ট। প্রোজেক্টের দরকারের চেয়ে বেশি টাকা দেওয়া শিক্ষানবিসদের মধ্যে একক সবচেয়ে সাধারণ হোস্টিং ভুল।</p>'),
    ],
  },
})

lessons.push({
  slug: 'free-hosting-what-you-get',
  sortOrder: 17,
  en: {
    title: 'Free Hosting: What You Get and Where the Walls Are',
    metaTitle: 'Free Hosting — What You Get and the Limits | Learn Computer Academy',
    metaDescription: 'Every free hosting tier follows the same shape: genuinely generous until a specific wall. The walls are stable and worth learning, even though the exact numbers are not.',
    blocks: [
      // ⚠️ PRICE-SENSITIVE — teach the shape of the limits, not exact quotas. See file header.
      p('<p>Genuine free hosting exists, is not a trick, and is a completely reasonable choice for a huge share of student projects. What matters is understanding the shape of what "free" actually includes — which is stable — rather than memorising exact quotas, which change constantly and would be wrong within a year of being written down.</p>'),

      h(2, 'What Is Commonly Free'),
      table(
        ['What', 'Typically free for'],
        [
          ['Static hosting', 'Portfolio sites, React apps once built, any project with no server-side logic'],
          ['A subdomain from the host', 'e.g. yourproject.hostname.app, instead of your own domain'],
          ['Small cloud/serverless usage', 'Low-traffic Node.js APIs and small backend functions'],
          ['A basic CDN', 'Most cloud and static hosts include one by default at no extra cost'],
          ['A shared database tier', 'Small projects on many cloud platforms'],
        ]
      ),

      img(
        'docs/img/hosting/free-tier-walls-1',
        'Isometric diagram showing a generous open platform area labelled free tier that ends abruptly at a wall with icons representing common limits — a bandwidth gauge, a clock for build minutes, a sleeping icon, a crossed-out custom domain',
        1024, 768,
        'Free tiers are genuinely generous — until a specific, predictable wall.'
      ),

      h(2, 'The Shape of the Walls'),
      p('<p>Every free tier follows a recognisable pattern: generous for genuinely small projects, then a hard limit hit once a project gets real traffic or real requirements. The walls themselves are stable across providers, even though the exact numbers attached to each one are not:</p><ul><li><b>Bandwidth or traffic caps</b> — a ceiling on total data transferred per month.</li><li><b>Build minutes</b> — free tiers for platforms that build your code (React, for instance) often cap how many minutes of building are included.</li><li><b>Sleeping on idle</b> — some free backend services shut down after a period of no traffic and take a few seconds to wake back up on the next request, which is a real, noticeable delay for a visitor\'s first request.</li><li><b>No custom domain</b> — some free tiers only work on the platform\'s own subdomain, with a custom domain reserved for a paid plan.</li><li><b>No email</b> — free hosting essentially never includes email hosting; that is a separate service either way, per the earlier lesson.</li><li><b>Limited or no support</b> — free tiers typically offer community forums rather than direct support.</li></ul>'),

      h(2, 'Reading a Free Tier\'s Actual Limits'),
      p('<p>Before relying on any free tier for something real, actually read its limits page rather than assuming. The specific numbers matter for your specific project even though they aren\'t worth memorising in general — a portfolio site with modest traffic almost never comes close to a free tier\'s bandwidth cap, but it is worth confirming rather than guessing.</p>'),

      callout('note', '<p>Free tiers change their terms more often than paid plans do — a platform can and does adjust free-tier limits over time, sometimes tightening them. This is a real, if uncommon, risk worth knowing about, covered further in the next lesson on what free actually costs you.</p>'),

      h(2, 'When Free Is the Right Choice'),
      p('<p>For a portfolio site, a learning project, a small personal project, or anything genuinely low-traffic, free hosting is very often the correct choice, not a compromise — this is precisely the recommendation given throughout the <a href="/career/">Career Skills</a> course for deploying portfolio projects.</p>'),
    ],
  },
  bn: {
    title: 'বিনামূল্যের হোস্টিং: আপনি কী পান আর দেয়ালগুলো কোথায়',
    metaTitle: 'বিনামূল্যের হোস্টিং — আপনি কী পান আর সীমা | Learn Computer Academy',
    metaDescription: 'প্রতিটি বিনামূল্যের হোস্টিং tier একই আকৃতি অনুসরণ করে: একটি নির্দিষ্ট দেয়াল পর্যন্ত সত্যিই উদার। দেয়ালগুলো স্থিতিশীল আর জানার যোগ্য, যদিও সঠিক সংখ্যা নয়।',
    blocks: [
      p('<p>প্রকৃত বিনামূল্যের হোস্টিং আছে, এটি একটি কৌশল নয়, আর শিক্ষার্থী প্রোজেক্টের একটি বিশাল অংশের জন্য এটি একটি সম্পূর্ণ যুক্তিসঙ্গত পছন্দ। যা গুরুত্বপূর্ণ তা হলো "বিনামূল্যে" আসলে কী অন্তর্ভুক্ত করে তার আকৃতি বোঝা — যা স্থিতিশীল — সঠিক quota মুখস্থ করার বদলে, যা ক্রমাগত বদলায় আর লেখার এক বছরের মধ্যে ভুল হয়ে যাবে।</p>'),

      h(2, 'সাধারণত কী বিনামূল্যে', 'what-is-commonly-free'),
      table(
        ['কী', 'সাধারণত যার জন্য বিনামূল্যে'],
        [
          ['Static হোস্টিং', 'Portfolio সাইট, build হওয়ার পর React অ্যাপ, কোনো server-side লজিক নেই এমন যেকোনো প্রোজেক্ট'],
          ['Host থেকে একটি subdomain', 'যেমন yourproject.hostname.app, আপনার নিজের ডোমেইনের বদলে'],
          ['ছোট cloud/serverless ব্যবহার', 'কম-ট্রাফিক Node.js API আর ছোট backend function'],
          ['একটি মৌলিক CDN', 'বেশিরভাগ cloud আর static host ডিফল্টভাবে কোনো অতিরিক্ত খরচ ছাড়া একটি অন্তর্ভুক্ত করে'],
          ['একটি shared ডেটাবেস tier', 'অনেক cloud প্ল্যাটফর্মে ছোট প্রোজেক্ট'],
        ]
      ),

      img(
        'docs/img/hosting/free-tier-walls-1',
        'Isometric ডায়াগ্রাম যেখানে "free tier" লেবেল করা একটি উদার খোলা platform এলাকা দেখানো হয়েছে যা সাধারণ সীমা প্রতিনিধিত্ব করা আইকনসহ একটি দেয়ালে হঠাৎ শেষ হয় — একটি bandwidth গেজ, build মিনিটের জন্য একটি ঘড়ি, একটি ঘুমন্ত আইকন, একটি ক্রস করা কাস্টম ডোমেইন',
        1024, 768,
        'বিনামূল্যের tier সত্যিই উদার — একটি নির্দিষ্ট, অনুমানযোগ্য দেয়াল পর্যন্ত।'
      ),

      h(2, 'দেয়ালগুলোর আকৃতি', 'the-shape-of-the-walls'),
      p('<p>প্রতিটি বিনামূল্যের tier একটি চেনা প্যাটার্ন অনুসরণ করে: সত্যিই ছোট প্রোজেক্টের জন্য উদার, তারপর একটি প্রোজেক্ট আসল ট্রাফিক বা আসল প্রয়োজনীয়তা পেলে একটি কঠিন সীমা। দেয়ালগুলো নিজেরা প্রদানকারী জুড়ে স্থিতিশীল, যদিও প্রতিটির সাথে যুক্ত সঠিক সংখ্যা নয়:</p><ul><li><b>Bandwidth বা ট্রাফিক সীমা</b> — প্রতি মাসে মোট স্থানান্তরিত ডেটার একটি সিলিং।</li><li><b>Build মিনিট</b> — আপনার কোড build করা প্ল্যাটফর্মের (উদাহরণস্বরূপ, React) বিনামূল্যের tier প্রায়ই কত মিনিট building অন্তর্ভুক্ত তা সীমাবদ্ধ করে।</li><li><b>Idle-এ ঘুমিয়ে যাওয়া</b> — কিছু বিনামূল্যের backend সেবা কোনো ট্রাফিক না থাকার একটি সময়ের পরে বন্ধ হয়ে যায় আর পরের অনুরোধে জাগতে কয়েক সেকেন্ড নেয়, যা একজন ভিজিটরের প্রথম অনুরোধের জন্য একটি আসল, লক্ষণীয় দেরি।</li><li><b>কোনো কাস্টম ডোমেইন নেই</b> — কিছু বিনামূল্যের tier শুধু প্ল্যাটফর্মের নিজস্ব subdomain-এ কাজ করে, একটি কাস্টম ডোমেইন একটি পেইড পরিকল্পনার জন্য সংরক্ষিত।</li><li><b>কোনো ইমেইল নেই</b> — বিনামূল্যের হোস্টিং মূলত কখনো ইমেইল হোস্টিং অন্তর্ভুক্ত করে না; আগের পাঠ অনুযায়ী সেটি যেভাবেই হোক একটি আলাদা সেবা।</li><li><b>সীমিত বা কোনো সাপোর্ট নেই</b> — বিনামূল্যের tier সাধারণত সরাসরি সাপোর্টের বদলে কমিউনিটি ফোরাম দেয়।</li></ul>'),

      h(2, 'একটি বিনামূল্যের Tier-এর আসল সীমা পড়া', 'reading-a-free-tiers-actual-limits'),
      p('<p>আসল কিছুর জন্য কোনো বিনামূল্যের tier-এর উপর নির্ভর করার আগে, অনুমান না করে আসলে এর সীমার পাতা পড়ুন। সাধারণভাবে মুখস্থ করার যোগ্য না হলেও আপনার নির্দিষ্ট প্রোজেক্টের জন্য সঠিক সংখ্যা গুরুত্বপূর্ণ — মাঝারি ট্রাফিকযুক্ত একটি portfolio সাইট প্রায় কখনো একটি বিনামূল্যের tier-এর bandwidth সীমার কাছাকাছি যায় না, কিন্তু অনুমান না করে নিশ্চিত করা সার্থক।</p>'),

      callout('note', '<p>বিনামূল্যের tier পেইড পরিকল্পনার চেয়ে বেশি ঘন ঘন তাদের শর্ত বদলায় — একটি প্ল্যাটফর্ম সময়ের সাথে বিনামূল্যের-tier সীমা সমন্বয় করতে পারে আর করে, কখনো সেগুলো কঠোর করে। এটি একটি আসল, যদিও অসাধারণ, ঝুঁকি জানার যোগ্য, পরের পাঠে বিনামূল্যে আসলে আপনার কী খরচ করায় তা নিয়ে আরও কভার করা।</p>'),

      h(2, 'বিনামূল্যে যখন সঠিক পছন্দ', 'when-free-is-the-right-choice'),
      p('<p>একটি portfolio সাইট, একটি শেখার প্রোজেক্ট, একটি ছোট ব্যক্তিগত প্রোজেক্ট, বা সত্যিই কম-ট্রাফিক যেকোনো কিছুর জন্য, বিনামূল্যের হোস্টিং প্রায়ই সঠিক পছন্দ, একটি আপস নয় — এটিই ঠিক সেই সুপারিশ যা portfolio প্রোজেক্ট deploy করার জন্য <a href="/bn/career/">Career Skills</a> কোর্স জুড়ে দেওয়া হয়েছে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'what-free-actually-costs-you',
  sortOrder: 18,
  en: {
    title: 'What Free Actually Costs You',
    metaTitle: 'What Free Hosting Actually Costs You | Learn Computer Academy',
    metaDescription: 'Free hosting is not free of trade-offs. What you genuinely give up, and specifically why a client project should rarely sit on a free tier.',
    blocks: [
      p('<p>Free hosting is real and often the right choice, per the previous lesson — but "free" is not the same as "no trade-offs." Understanding what you actually give up matters before choosing it, especially for anything more serious than a personal learning project.</p>'),

      h(2, 'What You Genuinely Give Up'),
      p('<ul><li><b>No guaranteed uptime.</b> Free tiers typically carry no service-level commitment — if it goes down, there is often no obligation on the provider\'s part to fix it quickly, or at all.</li><li><b>No real support.</b> When something breaks, you are generally on your own with community forums and documentation, not a support ticket someone is obligated to answer.</li><li><b>Cold starts.</b> A service that sleeps on idle (from the previous lesson) means a real visitor can hit a multi-second delay on the very first request after a quiet period — a genuinely bad first impression for a business site specifically.</li><li><b>Policy changes with no notice.</b> A provider can and sometimes does tighten free-tier limits, add new restrictions, or discontinue a free tier entirely, with limited warning.</li><li><b>Weaker credibility signals.</b> A URL on the platform\'s own subdomain, rather than your own domain, can read as less professional to a visitor unfamiliar with how hosting actually works — a real, if unfair, perception.</li></ul>'),

      img(
        'docs/img/hosting/free-hosting-cost-1',
        'Isometric diagram showing a free-looking website icon with small hidden weight icons attached beneath it labelled with a clock (cold start), a broken support ticket, and a warning triangle, representing hidden trade-offs beneath a free surface',
        1024, 768,
        'Free hosting has no invoice — it still has real costs, just paid in a different currency.'
      ),

      h(2, 'The Specific Warning: Client Work'),
      p('<p>Putting a <i>client\'s</i> business site on a free tier is where these trade-offs stop being abstract. A client\'s site going down with no support to call, or quietly breaking because a free tier\'s limits changed, is a real professional problem — and it is the client\'s reputation and revenue at stake, not just a personal side project.</p>'),

      callout('warning', '<p>For any project where someone else\'s business depends on it — the exact situation covered in this site\'s <a href="/marketing/">Digital Marketing course</a>\'s freelancing material and the <a href="/career/">Career Skills</a> course\'s freelancing lesson — paid hosting with a real support channel and a real uptime expectation is worth the modest cost. This is one of the clearest cases in this entire category where "free" is the wrong choice, not the default good one.</p>', 'Do not put a client\'s site on a free tier')  ,

      h(2, 'Where Free Genuinely Remains the Right Choice'),
      p('<p>None of this argues against free hosting generally — it argues for matching the choice to what is actually at stake. A personal portfolio, a learning project, an experiment, or anything where downtime costs you nothing but your own inconvenience is exactly what free hosting is for, and using it there is not a compromise.</p>'),

      h(2, 'A Middle Ground Worth Knowing About'),
      p('<p>Many platforms offer an inexpensive paid tier just above free — removing the sleep-on-idle behaviour and adding a custom domain and basic support, at a fraction of what a VPS or dedicated server would cost. For a small real project that has outgrown "purely personal" but isn\'t yet a serious business, this tier is often the actual sensible landing point, rather than jumping straight to enterprise-grade hosting.</p>'),
    ],
  },
  bn: {
    title: 'বিনামূল্যে আসলে আপনার কী খরচ করায়',
    metaTitle: 'বিনামূল্যের হোস্টিং আসলে আপনার কী খরচ করায় | Learn Computer Academy',
    metaDescription: 'বিনামূল্যের হোস্টিং বিনিময় মুক্ত নয়। আপনি সত্যিই কী ছাড় দেন, আর বিশেষভাবে কেন একটি ক্লায়েন্ট প্রোজেক্টের খুব কমই একটি বিনামূল্যের tier-এ বসা উচিত।',
    blocks: [
      p('<p>আগের পাঠ অনুযায়ী বিনামূল্যের হোস্টিং বাস্তব আর প্রায়ই সঠিক পছন্দ — কিন্তু "বিনামূল্যে" "কোনো বিনিময় নেই"-এর সমান নয়। এটি বাছার আগে আপনি সত্যিই কী ছাড় দেন তা বোঝা গুরুত্বপূর্ণ, বিশেষত একটি ব্যক্তিগত শেখার প্রোজেক্টের চেয়ে বেশি গুরুতর যেকোনো কিছুর জন্য।</p>'),

      h(2, 'আপনি সত্যিই কী ছাড় দেন', 'what-you-genuinely-give-up'),
      p('<p><ul><li><b>নিশ্চিত uptime নেই।</b> বিনামূল্যের tier সাধারণত কোনো service-level প্রতিশ্রুতি বহন করে না — এটি বন্ধ হয়ে গেলে, প্রায়ই প্রদানকারীর পক্ষ থেকে এটি দ্রুত ঠিক করার, বা আদৌ ঠিক করার কোনো বাধ্যবাধকতা নেই।</li><li><b>কোনো আসল সাপোর্ট নেই।</b> কিছু ভাঙলে, আপনি সাধারণত কমিউনিটি ফোরাম আর ডকুমেন্টেশন নিয়ে একা থাকেন, কেউ উত্তর দিতে বাধ্য এমন একটি সাপোর্ট টিকিট নয়।</li><li><b>Cold start।</b> Idle-এ ঘুমিয়ে যাওয়া একটি সেবা (আগের পাঠ থেকে) মানে একজন আসল ভিজিটর একটি শান্ত সময়ের পরে ঠিক প্রথম অনুরোধে কয়েক-সেকেন্ডের একটি দেরির মুখোমুখি হতে পারে — বিশেষভাবে একটি ব্যবসার সাইটের জন্য সত্যিই একটি খারাপ প্রথম ধারণা।</li><li><b>বিনা নোটিশে নীতি পরিবর্তন।</b> একটি প্রদানকারী বিনামূল্যের-tier সীমা কঠোর করতে পারে আর কখনো করে, নতুন বিধিনিষেধ যোগ করতে পারে, বা সীমিত সতর্কতাসহ একটি বিনামূল্যের tier সম্পূর্ণ বন্ধ করতে পারে।</li><li><b>দুর্বল বিশ্বাসযোগ্যতার সংকেত।</b> আপনার নিজের ডোমেইনের বদলে প্ল্যাটফর্মের নিজস্ব subdomain-এ একটি URL, হোস্টিং আসলে কীভাবে কাজ করে তার সাথে অপরিচিত একজন ভিজিটরের কাছে কম পেশাদার হিসেবে পড়া যেতে পারে — একটি আসল, যদিও অন্যায্য, ধারণা।</li></ul></p>'),

      img(
        'docs/img/hosting/free-hosting-cost-1',
        'Isometric ডায়াগ্রাম যেখানে একটি বিনামূল্যে-দেখতে ওয়েবসাইট আইকন দেখানো হয়েছে যার নিচে ছোট লুকানো ওজনের আইকন যুক্ত, একটি ঘড়ি (cold start), একটি ভাঙা সাপোর্ট টিকিট, আর একটি সতর্কতা ত্রিভুজ দিয়ে লেবেল করা, একটি বিনামূল্যের পৃষ্ঠতলের নিচে লুকানো বিনিময় প্রতিনিধিত্ব করছে',
        1024, 768,
        'বিনামূল্যের হোস্টিংয়ে কোনো চালান নেই — এতে এখনো আসল খরচ আছে, শুধু ভিন্ন মুদ্রায় দেওয়া।'
      ),

      h(2, 'নির্দিষ্ট সতর্কতা: ক্লায়েন্টের কাজ', 'the-specific-warning-client-work'),
      p('<p>একজন <i>ক্লায়েন্টের</i> ব্যবসার সাইট একটি বিনামূল্যের tier-এ রাখা এমন জায়গা যেখানে এই বিনিময়গুলো বিমূর্ত হওয়া বন্ধ করে। একজন ক্লায়েন্টের সাইট ডাকার মতো কোনো সাপোর্ট ছাড়া বন্ধ হয়ে যাওয়া, বা একটি বিনামূল্যের tier-এর সীমা বদলে যাওয়ায় চুপচাপ ভেঙে যাওয়া একটি আসল পেশাদার সমস্যা — আর এতে ক্লায়েন্টের সুনাম আর আয় ঝুঁকিতে, শুধু একটি ব্যক্তিগত পার্শ্ব-প্রোজেক্ট নয়।</p>'),

      callout('warning', '<p>এমন যেকোনো প্রোজেক্টের জন্য যেখানে অন্য কারো ব্যবসা এর উপর নির্ভর করে — এই সাইটের <a href="/bn/marketing/">Digital Marketing কোর্সের</a> freelancing উপাদান আর <a href="/bn/career/">Career Skills</a> কোর্সের freelancing পাঠে কভার করা ঠিক এই পরিস্থিতি — একটি আসল সাপোর্ট চ্যানেল আর একটি আসল uptime প্রত্যাশাসহ পেইড হোস্টিং সামান্য খরচের যোগ্য। এই সম্পূর্ণ বিভাগে সবচেয়ে স্পষ্ট ক্ষেত্রগুলোর একটি এটি যেখানে "বিনামূল্যে" ভুল পছন্দ, ডিফল্ট ভালো একটি নয়।</p>', 'একজন ক্লায়েন্টের সাইট একটি বিনামূল্যের tier-এ রাখবেন না'),

      h(2, 'বিনামূল্যে যেখানে সত্যিই সঠিক পছন্দ থাকে', 'where-free-genuinely-remains-the-right-choice'),
      p('<p>এর কিছুই সাধারণভাবে বিনামূল্যের হোস্টিংয়ের বিরুদ্ধে যুক্তি দেয় না — এটি আসলে যা ঝুঁকিতে তার সাথে পছন্দ মেলানোর যুক্তি দেয়। একটি ব্যক্তিগত portfolio, একটি শেখার প্রোজেক্ট, একটি পরীক্ষা, বা এমন যেকোনো কিছু যেখানে downtime আপনার নিজের অসুবিধা ছাড়া কিছু খরচ করায় না ঠিক তাই যার জন্য বিনামূল্যের হোস্টিং, আর সেখানে এটি ব্যবহার করা কোনো আপস নয়।</p>'),

      h(2, 'জানার যোগ্য একটি মধ্যপন্থা', 'a-middle-ground-worth-knowing-about'),
      p('<p>অনেক প্ল্যাটফর্ম বিনামূল্যের ঠিক উপরে একটি সস্তা পেইড tier দেয় — sleep-on-idle আচরণ সরিয়ে আর একটি কাস্টম ডোমেইন আর মৌলিক সাপোর্ট যোগ করে, একটি VPS বা dedicated সার্ভারের খরচের একটি ভগ্নাংশে। "সম্পূর্ণ ব্যক্তিগত" ছাড়িয়ে গেছে কিন্তু এখনো একটি গুরুতর ব্যবসা নয় এমন একটি ছোট আসল প্রোজেক্টের জন্য, সরাসরি enterprise-গ্রেড হোস্টিংয়ে লাফ দেওয়ার বদলে এই tier-টি প্রায়ই আসল যুক্তিসঙ্গত অবতরণ বিন্দু।</p>'),
    ],
  },
})

lessons.push({
  slug: 'pointing-a-domain-at-hosting',
  sortOrder: 19,
  en: {
    title: 'Pointing a Domain at Hosting',
    metaTitle: 'Pointing a Domain at Hosting | Learn Computer Academy',
    metaDescription: 'The two practical ways to connect a registered domain to hosting — changing nameservers or adding individual DNS records — and how long to expect it to take.',
    blocks: [
      p('<p>With a domain registered and hosting chosen, connecting the two is genuinely one of two approaches, both building directly on the DNS lessons earlier in this category.</p>'),

      h(2, 'Approach 1 — Change the Nameservers'),
      p('<p>Your hosting provider gives you a set of nameservers (something like <code>ns1.yourhost.com</code>, <code>ns2.yourhost.com</code>). In your domain registrar\'s control panel, you replace the default nameservers with these. This hands complete DNS control over to the host — from that point on, all DNS records, not just the website-pointing ones, are managed in the hosting provider\'s panel rather than the registrar\'s.</p>'),

      h(2, 'Approach 2 — Keep the Registrar, Add Records'),
      p('<p>Alternatively, keep the registrar\'s default nameservers and instead add the specific records the host needs directly in the registrar\'s DNS panel — typically an A record pointing at the host\'s IP address, or a CNAME pointing at an address the host gives you. This keeps DNS management with the registrar while still connecting to the host.</p>'),

      img(
        'docs/img/hosting/connecting-domain-1',
        'Isometric diagram showing two paths from a domain registrar to a hosting server: one labelled changing nameservers pointing directly to the host, another labelled adding records showing individual DNS entries pointing to the same host',
        1024, 768,
        'Two equally valid approaches — hand over full DNS control, or keep it and add specific records.'
      ),

      h(2, 'Which to Use'),
      table(
        ['Situation', 'Better approach'],
        [
          ['Hosting and domain are otherwise unrelated, simple setup', 'Change nameservers — simpler, the host manages everything'],
          ['You want email through one provider and the website through another', 'Keep the registrar, add records — more granular control'],
          ['A platform explicitly tells you to add one specific record (very common for cloud/managed platforms)', 'Follow that platform\'s instruction directly — usually a CNAME or a specific A record'],
        ]
      ),
      p('<p>Most modern cloud and managed platforms (the kind covered earlier in this category) walk you through exactly which record to add when you connect a custom domain — the underlying concept is always one of these two approaches, even when the interface hides the terminology.</p>'),

      h(2, 'What to Actually Expect Afterward'),
      p('<p>This is <b>DNS propagation</b>, mentioned in the earlier what-DNS-is lesson: the change does not appear everywhere instantly. Most people see it within minutes to a few hours; some resolvers, holding an old cached answer with a long TTL, can take up to about 48 hours. This is normal, expected, and not a sign anything went wrong.</p>'),

      callout('tip', '<p>Make DNS changes with a comfortable buffer before anything time-sensitive — a launch date, a demo, a deadline — rather than right before it. If something needs to be fixed, a same-day DNS change might not be visible to everyone in time.</p>'),

      h(2, 'Checking It Actually Worked'),
      p('<p>Once you\'ve made the change, a DNS lookup tool (many free ones exist online, and command-line tools like <code>nslookup</code> or <code>dig</code> work too) lets you check what a given DNS server currently reports for your domain, without waiting to see if your own browser has picked up the change yet.</p>'),
    ],
  },
  bn: {
    title: 'একটি ডোমেইনকে হোস্টিং-এর দিকে নির্দেশ করা',
    metaTitle: 'একটি ডোমেইনকে হোস্টিং-এর দিকে নির্দেশ করা | Learn Computer Academy',
    metaDescription: 'একটি নিবন্ধিত ডোমেইনকে হোস্টিং-এর সাথে সংযুক্ত করার দুটি ব্যবহারিক উপায় — nameserver বদলানো বা পৃথক DNS রেকর্ড যোগ করা — আর কতক্ষণ সময় লাগবে বলে আশা করবেন।',
    blocks: [
      p('<p>একটি ডোমেইন নিবন্ধিত আর হোস্টিং বাছা থাকলে, দুটিকে সংযুক্ত করা সত্যিই দুটি পদ্ধতির একটি, দুটোই এই বিভাগের আগের DNS পাঠের উপর সরাসরি গড়ে ওঠা।</p>'),

      h(2, 'পদ্ধতি ১ — Nameserver বদলান', 'approach-1-change-the-nameservers'),
      p('<p>আপনার হোস্টিং প্রদানকারী আপনাকে nameserver-এর একটি সেট দেয় (<code>ns1.yourhost.com</code>, <code>ns2.yourhost.com</code>-এর মতো কিছু)। আপনার domain registrar-এর control panel-এ, আপনি ডিফল্ট nameserver-গুলো এগুলো দিয়ে প্রতিস্থাপন করেন। এটি সম্পূর্ণ DNS নিয়ন্ত্রণ host-কে হস্তান্তর করে — সেই বিন্দু থেকে, শুধু ওয়েবসাইট-নির্দেশ করাগুলো নয়, সব DNS রেকর্ড, registrar-এর বদলে হোস্টিং প্রদানকারীর panel-এ পরিচালিত হয়।</p>'),

      h(2, 'পদ্ধতি ২ — Registrar রাখুন, রেকর্ড যোগ করুন', 'approach-2-keep-the-registrar-add-records'),
      p('<p>বিকল্পভাবে, registrar-এর ডিফল্ট nameserver রাখুন আর এর বদলে registrar-এর DNS panel-এ সরাসরি host-এর দরকার নির্দিষ্ট রেকর্ড যোগ করুন — সাধারণত host-এর IP ঠিকানার দিকে নির্দেশ করা একটি A রেকর্ড, বা host আপনাকে দেওয়া একটি ঠিকানার দিকে নির্দেশ করা একটি CNAME। এটি host-এর সাথে সংযুক্ত থাকতে থাকতেই DNS পরিচালনা registrar-এর কাছে রাখে।</p>'),

      img(
        'docs/img/hosting/connecting-domain-1',
        'Isometric ডায়াগ্রাম যেখানে একটি domain registrar থেকে একটি হোস্টিং সার্ভারে দুটি পথ দেখানো হয়েছে: একটি "nameserver বদলানো" লেবেল করা সরাসরি host-এর দিকে নির্দেশ করছে, অন্যটি "রেকর্ড যোগ করা" লেবেল করা একই host-এর দিকে নির্দেশ করা পৃথক DNS এন্ট্রি দেখাচ্ছে',
        1024, 768,
        'দুটি সমানভাবে বৈধ পদ্ধতি — সম্পূর্ণ DNS নিয়ন্ত্রণ হস্তান্তর করুন, বা এটি রেখে নির্দিষ্ট রেকর্ড যোগ করুন।'
      ),

      h(2, 'কোনটি ব্যবহার করবেন', 'which-to-use'),
      table(
        ['পরিস্থিতি', 'ভালো পদ্ধতি'],
        [
          ['হোস্টিং আর ডোমেইন অন্যথায় অসম্পর্কিত, সরল সেটআপ', 'Nameserver বদলান — সহজ, host সবকিছু পরিচালনা করে'],
          ['আপনি একটি প্রদানকারীর মাধ্যমে ইমেইল আর অন্যটির মাধ্যমে ওয়েবসাইট চান', 'Registrar রাখুন, রেকর্ড যোগ করুন — বেশি সূক্ষ্ম নিয়ন্ত্রণ'],
          ['একটি প্ল্যাটফর্ম স্পষ্টভাবে আপনাকে একটি নির্দিষ্ট রেকর্ড যোগ করতে বলে (cloud/managed প্ল্যাটফর্মের জন্য খুব সাধারণ)', 'সরাসরি সেই প্ল্যাটফর্মের নির্দেশনা অনুসরণ করুন — সাধারণত একটি CNAME বা একটি নির্দিষ্ট A রেকর্ড'],
        ]
      ),
      p('<p>বেশিরভাগ আধুনিক cloud আর managed প্ল্যাটফর্ম (এই বিভাগে আগে কভার করা ধরনের) আপনি একটি কাস্টম ডোমেইন সংযুক্ত করার সময় ঠিক কোন রেকর্ড যোগ করতে হবে তার মধ্য দিয়ে আপনাকে নিয়ে যায় — ইন্টারফেস পরিভাষা লুকিয়ে রাখলেও, অন্তর্নিহিত ধারণাটি সবসময় এই দুটি পদ্ধতির একটি।</p>'),

      h(2, 'পরে আসলে কী আশা করবেন', 'what-to-actually-expect-afterward'),
      p('<p>এটি <b>DNS propagation</b>, আগের what-DNS-is পাঠে উল্লেখ করা: পরিবর্তনটি সর্বত্র সাথে সাথে দেখা যায় না। বেশিরভাগ মানুষ মিনিট থেকে কয়েক ঘণ্টার মধ্যে এটি দেখেন; কিছু resolver, একটি দীর্ঘ TTL সহ একটি পুরোনো ক্যাশ করা উত্তর ধরে রেখে, প্রায় ৪৮ ঘণ্টা পর্যন্ত নিতে পারে। এটি স্বাভাবিক, প্রত্যাশিত, আর কিছু ভুল হয়ে যাওয়ার চিহ্ন নয়।</p>'),

      callout('tip', '<p>সময়-সংবেদনশীল কিছুর ঠিক আগে না করে — একটি launch তারিখ, একটি demo, একটি deadline — এর আগে একটি স্বাচ্ছন্দ্যময় বাফারসহ DNS পরিবর্তন করুন। কিছু ঠিক করতে হলে, একই-দিনের একটি DNS পরিবর্তন সময়মতো সবার কাছে দৃশ্যমান নাও হতে পারে।</p>'),

      h(2, 'এটি আসলে কাজ করেছে কিনা যাচাই করা', 'checking-it-actually-worked'),
      p('<p>একবার আপনি পরিবর্তনটি করলে, একটি DNS lookup টুল (অনলাইনে অনেক বিনামূল্যেরটি আছে, আর <code>nslookup</code> বা <code>dig</code>-এর মতো command-line টুলও কাজ করে) আপনাকে যাচাই করতে দেয় আপনার নিজের ব্রাউজার এখনো পরিবর্তনটি ধরেছে কিনা তার জন্য অপেক্ষা না করেই একটি নির্দিষ্ট DNS সার্ভার এখন আপনার ডোমেইনের জন্য কী জানায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'ftp-and-sftp',
  sortOrder: 20,
  en: {
    title: 'FTP and SFTP',
    metaTitle: 'FTP and SFTP Explained | Learn Computer Academy',
    metaDescription: 'The classic way to move files onto a server: FTP and its secure successor SFTP. What they are, how to use one, and why plain FTP should be avoided.',
    blocks: [
      p('<p><b>FTP</b> (File Transfer Protocol) is one of the oldest and still most common ways to move files from your own computer onto a server — the literal mechanism behind "uploading your website."</p>'),

      h(2, 'What It Actually Does'),
      p('<p>An FTP client — a piece of software on your computer — connects to your server using credentials your host gives you (a hostname, a username, a password, sometimes a port number), and presents two file listings side by side: your local computer\'s files and the server\'s files. Dragging a file from one side to the other uploads or downloads it.</p>'),

      img(
        'docs/img/hosting/ftp-1',
        'Isometric diagram showing a laptop and a remote server connected by a line labelled FTP, with a folder icon transferring between the two, side-by-side file listing panels visible on each',
        1024, 768,
        'An FTP client connects your computer directly to a folder on the server, side by side.'
      ),

      h(2, 'FTP vs. SFTP'),
      p('<p>Plain <b>FTP</b> sends your username, password, and every file completely unencrypted — anyone intercepting the connection on the network in between can read it all, credentials included. <b>SFTP</b> (SSH File Transfer Protocol — related to SSH, covered in its own lesson shortly) does the same job over an encrypted connection.</p>'),

      callout('warning', '<p>Use SFTP, not plain FTP, whenever your host offers it — which is nearly always, today. Sending a server password over plain, unencrypted FTP on an untrusted network is a genuine, avoidable security risk, not a theoretical one.</p>', 'Prefer SFTP over plain FTP')  ,

      h(2, 'A Typical Workflow'),
      p('<ol><li>Get your connection details from your host\'s control panel — hostname, username, password, port.</li><li>Open an FTP client and enter those details to connect.</li><li>Navigate to the correct folder on the server — commonly named <code>public_html</code> or <code>www</code>, the folder your host actually serves to visitors.</li><li>Drag your project\'s files into that folder.</li><li>Visit your domain to confirm the upload worked.</li></ol>'),

      callout('note', '<p>Every file destined to be visible on your site has to actually be inside the server\'s designated web folder — usually <code>public_html</code>. Files uploaded elsewhere on the server exist, but nothing on the internet can reach them. This single detail causes a large share of "I uploaded it but nothing changed" confusion.</p>'),

      h(2, 'Where FTP Fits Among the Other Options'),
      p('<p>FTP/SFTP is the standard way to deploy to shared hosting and many control-panel-based hosts specifically, since that is what those platforms are built to expect. It is not how cloud and managed platforms typically work — those generally use Git-based deployment instead, covered in its own lesson later in this part.</p>'),
    ],
  },
  bn: {
    title: 'FTP আর SFTP',
    metaTitle: 'FTP আর SFTP ব্যাখ্যা | Learn Computer Academy',
    metaDescription: 'একটি সার্ভারে ফাইল সরানোর ক্লাসিক উপায়: FTP আর এর নিরাপদ উত্তরসূরি SFTP। সেগুলো কী, একটি কীভাবে ব্যবহার করবেন, আর সাধারণ FTP কেন এড়ানো উচিত।',
    blocks: [
      p('<p><b>FTP</b> (File Transfer Protocol) আপনার নিজের কম্পিউটার থেকে একটি সার্ভারে ফাইল সরানোর সবচেয়ে পুরোনো আর এখনো সবচেয়ে সাধারণ উপায়গুলোর একটি — "আপনার ওয়েবসাইট আপলোড করা"-র পেছনের আক্ষরিক প্রক্রিয়া।</p>'),

      h(2, 'এটি আসলে কী করে', 'what-it-actually-does'),
      p('<p>একটি FTP client — আপনার কম্পিউটারে একটি সফটওয়্যার — আপনার host আপনাকে দেওয়া credential ব্যবহার করে (একটি hostname, একটি username, একটি password, কখনো একটি port নম্বর) আপনার সার্ভারে সংযুক্ত হয়, আর পাশাপাশি দুটি ফাইল তালিকা উপস্থাপন করে: আপনার স্থানীয় কম্পিউটারের ফাইল আর সার্ভারের ফাইল। একপাশ থেকে অন্যপাশে একটি ফাইল টেনে আনা এটি আপলোড বা ডাউনলোড করে।</p>'),

      img(
        'docs/img/hosting/ftp-1',
        'Isometric ডায়াগ্রাম যেখানে একটি ল্যাপটপ আর একটি দূরবর্তী সার্ভার "FTP" লেবেল করা একটি লাইন দিয়ে সংযুক্ত দেখানো হয়েছে, দুটির মধ্যে একটি ফোল্ডার আইকন স্থানান্তরিত হচ্ছে, প্রতিটিতে পাশাপাশি ফাইল তালিকা প্যানেল দৃশ্যমান',
        1024, 768,
        'একটি FTP client আপনার কম্পিউটারকে সরাসরি সার্ভারের একটি ফোল্ডারের সাথে সংযুক্ত করে, পাশাপাশি।'
      ),

      h(2, 'FTP বনাম SFTP', 'ftp-vs-sftp'),
      p('<p>সাধারণ <b>FTP</b> আপনার username, password, আর প্রতিটি ফাইল সম্পূর্ণ অনএনক্রিপ্টেড পাঠায় — মাঝখানে নেটওয়ার্কে সংযোগটি আটকানো যে কেউ credential সহ সবকিছু পড়তে পারে। <b>SFTP</b> (SSH File Transfer Protocol — শীঘ্রই নিজস্ব একটি পাঠে কভার করা SSH-এর সাথে সম্পর্কিত) একটি এনক্রিপ্ট করা সংযোগে একই কাজ করে।</p>'),

      callout('warning', '<p>আপনার host এটি দিলে সাধারণ FTP নয়, SFTP ব্যবহার করুন — যা আজ প্রায় সবসময়। একটি অবিশ্বস্ত নেটওয়ার্কে সাধারণ, অনএনক্রিপ্টেড FTP-এর উপর একটি সার্ভার পাসওয়ার্ড পাঠানো একটি আসল, এড়ানো যায় এমন নিরাপত্তা ঝুঁকি, তাত্ত্বিক একটি নয়।</p>', 'সাধারণ FTP-এর চেয়ে SFTP পছন্দ করুন'),

      h(2, 'একটি সাধারণ workflow', 'a-typical-workflow'),
      p('<p><ol><li>আপনার host-এর control panel থেকে আপনার সংযোগের বিবরণ নিন — hostname, username, password, port।</li><li>একটি FTP client খুলুন আর সংযুক্ত হতে সেই বিবরণ দিন।</li><li>সার্ভারের সঠিক ফোল্ডারে navigate করুন — সাধারণত <code>public_html</code> বা <code>www</code> নামে, যে ফোল্ডারটি আপনার host আসলে ভিজিটরদের পরিবেশন করে।</li><li>আপনার প্রোজেক্টের ফাইলগুলো সেই ফোল্ডারে টেনে আনুন।</li><li>আপলোড কাজ করেছে কিনা নিশ্চিত করতে আপনার ডোমেইন ভিজিট করুন।</li></ol></p>'),

      callout('note', '<p>আপনার সাইটে দৃশ্যমান হওয়ার জন্য নির্ধারিত প্রতিটি ফাইল আসলে সার্ভারের নির্ধারিত web ফোল্ডারের ভেতরে থাকতে হয় — সাধারণত <code>public_html</code>। সার্ভারে অন্য কোথাও আপলোড করা ফাইল আছে, কিন্তু ইন্টারনেটে কিছুই সেগুলোতে পৌঁছাতে পারে না। এই একটি বিবরণ "আমি এটি আপলোড করেছি কিন্তু কিছুই বদলায়নি" বিভ্রান্তির একটি বড় অংশ ঘটায়।</p>'),

      h(2, 'অন্য বিকল্পগুলোর মধ্যে FTP কোথায় মানানসই', 'where-ftp-fits-among-the-other-options'),
      p('<p>FTP/SFTP বিশেষভাবে shared হোস্টিং আর অনেক control-panel-ভিত্তিক host-এ deploy করার আদর্শ উপায়, কারণ সেই প্ল্যাটফর্মগুলো এটিই আশা করার জন্য তৈরি। Cloud আর managed প্ল্যাটফর্ম সাধারণত এভাবে কাজ করে না — সেগুলো সাধারণত এর বদলে Git-ভিত্তিক deployment ব্যবহার করে, এই অংশে পরে নিজস্ব একটি পাঠে কভার করা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'control-panels',
  sortOrder: 21,
  en: {
    title: 'Control Panels (cPanel and Alternatives)',
    metaTitle: 'Hosting Control Panels — cPanel and Alternatives | Learn Computer Academy',
    metaDescription: 'The graphical dashboard most shared hosting is managed through. What a control panel actually lets you do, and the common alternatives to cPanel.',
    blocks: [
      p('<p>A <b>control panel</b> is the graphical dashboard most shared hosting is managed through — the tool that makes shared hosting accessible without server administration knowledge, referenced throughout the earlier hosting-type lessons.</p>'),

      h(2, 'What a Control Panel Actually Lets You Do'),
      table(
        ['Task', 'Typically handled through'],
        [
          ['Uploading files', 'A built-in file manager, as an alternative to FTP'],
          ['Managing databases', 'A MySQL/database manager, often paired with phpMyAdmin'],
          ['Setting up email accounts', 'An email management section, tied to your domain'],
          ['Installing software', 'One-click installers, commonly including WordPress'],
          ['Managing domains and subdomains', 'A domains section, including basic DNS editing'],
          ['Checking resource usage', 'Dashboards showing storage, bandwidth, and visitor stats'],
          ['SSL certificates', 'Usually a one-click or automatic option, covered in the security lesson'],
        ]
      ),

      img(
        'docs/img/hosting/control-panel-1',
        'Isometric diagram showing a dashboard screen with several labelled icon tiles — files, databases, email, domains, and one-click installers — representing a typical hosting control panel',
        1024, 768,
        'A control panel bundles server administration into a graphical dashboard, no command line needed.'
      ),

      h(2, 'cPanel and Its Alternatives'),
      p('<p><b>cPanel</b> is the most widely used control panel across the shared hosting industry — familiar enough that skills learned on one host\'s cPanel transfer directly to another\'s. Alternatives exist (Plesk is another common one, and many hosts also build their own custom panels), and while the exact layout differs, the underlying categories of tools — files, databases, email, domains — are consistent across nearly all of them.</p>'),

      h(2, 'phpMyAdmin, Specifically'),
      p('<p>Most control panels bundle <b>phpMyAdmin</b> — a web-based tool for viewing and editing MySQL databases directly, without writing SQL by hand for every action. This is directly relevant to this site\'s <a href="/sql/">SQL course</a> and <a href="/php/">PHP course</a> — it is very often the actual tool used to inspect or fix a live database on shared hosting.</p>'),

      h(2, 'One-Click Installers'),
      p('<p>Most control panels include one-click installers for common software — WordPress being the most relevant one for this site\'s <a href="/wordpress/">WordPress course</a>. This automates what would otherwise be a manual multi-step setup: creating a database, downloading WordPress, and connecting the two — genuinely useful, and worth knowing is happening automatically underneath, not magic.</p>'),

      callout('note', '<p>A control panel is a convenience layer over the same server underneath — every real, useful task it does could technically be done by hand, over SSH, with more effort. That is precisely the trade shared hosting makes for accessibility, and precisely what a VPS gives up the convenience of, covered in the SSH lesson next.</p>'),
    ],
  },
  bn: {
    title: 'Control Panel (cPanel আর বিকল্প)',
    metaTitle: 'হোস্টিং Control Panel — cPanel আর বিকল্প | Learn Computer Academy',
    metaDescription: 'গ্রাফিক্যাল dashboard যার মাধ্যমে বেশিরভাগ shared হোস্টিং পরিচালিত হয়। একটি control panel আসলে আপনাকে কী করতে দেয়, আর cPanel-এর সাধারণ বিকল্প।',
    blocks: [
      p('<p>একটি <b>control panel</b> হলো গ্রাফিক্যাল dashboard যার মাধ্যমে বেশিরভাগ shared হোস্টিং পরিচালিত হয় — যে টুলটি সার্ভার প্রশাসনের জ্ঞান ছাড়াই shared হোস্টিংকে প্রবেশযোগ্য করে, আগের হোস্টিং-ধরনের পাঠ জুড়ে উল্লেখ করা।</p>'),

      h(2, 'একটি Control Panel আসলে আপনাকে কী করতে দেয়', 'what-a-control-panel-actually-lets-you-do'),
      table(
        ['কাজ', 'সাধারণত যার মাধ্যমে সামলানো'],
        [
          ['ফাইল আপলোড', 'একটি বিল্ট-ইন ফাইল ম্যানেজার, FTP-এর একটি বিকল্প হিসেবে'],
          ['ডেটাবেস পরিচালনা', 'একটি MySQL/ডেটাবেস ম্যানেজার, প্রায়ই phpMyAdmin-এর সাথে জোড়া'],
          ['ইমেইল অ্যাকাউন্ট সেট আপ', 'একটি ইমেইল পরিচালনা অংশ, আপনার ডোমেইনের সাথে যুক্ত'],
          ['সফটওয়্যার ইনস্টল', 'এক-ক্লিক ইনস্টলার, সাধারণত WordPress সহ'],
          ['ডোমেইন আর subdomain পরিচালনা', 'একটি ডোমেইন অংশ, মৌলিক DNS সম্পাদনাসহ'],
          ['রিসোর্স ব্যবহার যাচাই', 'সংরক্ষণ, bandwidth, আর ভিজিটর পরিসংখ্যান দেখানো dashboard'],
          ['SSL সার্টিফিকেট', 'সাধারণত একটি এক-ক্লিক বা স্বয়ংক্রিয় বিকল্প, নিরাপত্তা পাঠে কভার করা'],
        ]
      ),

      img(
        'docs/img/hosting/control-panel-1',
        'Isometric ডায়াগ্রাম যেখানে কয়েকটি লেবেল করা আইকন টাইলসহ একটি dashboard স্ক্রিন দেখানো হয়েছে — ফাইল, ডেটাবেস, ইমেইল, ডোমেইন, আর এক-ক্লিক ইনস্টলার — একটি সাধারণ হোস্টিং control panel প্রতিনিধিত্ব করছে',
        1024, 768,
        'একটি control panel সার্ভার প্রশাসনকে একটি গ্রাফিক্যাল dashboard-এ বান্ডিল করে, কোনো command line প্রয়োজন নেই।'
      ),

      h(2, 'cPanel আর এর বিকল্প', 'cpanel-and-its-alternatives'),
      p('<p><b>cPanel</b> shared হোস্টিং শিল্প জুড়ে সবচেয়ে ব্যাপকভাবে ব্যবহৃত control panel — যথেষ্ট পরিচিত যে এক host-এর cPanel-এ শেখা দক্ষতা সরাসরি অন্যটিতে স্থানান্তরিত হয়। বিকল্প আছে (Plesk আরেকটি সাধারণ, আর অনেক host নিজেদের কাস্টম panel-ও তৈরি করে), আর সঠিক লেআউট ভিন্ন হলেও, টুলের অন্তর্নিহিত শ্রেণী — ফাইল, ডেটাবেস, ইমেইল, ডোমেইন — প্রায় সবগুলো জুড়ে ধারাবাহিক।</p>'),

      h(2, 'বিশেষভাবে phpMyAdmin', 'phpmyadmin-specifically'),
      p('<p>বেশিরভাগ control panel <b>phpMyAdmin</b> বান্ডিল করে — সরাসরি MySQL ডেটাবেস দেখা আর সম্পাদনার জন্য একটি ওয়েব-ভিত্তিক টুল, প্রতিটি কাজের জন্য হাতে SQL না লিখেই। এটি এই সাইটের <a href="/bn/sql/">SQL কোর্স</a> আর <a href="/bn/php/">PHP কোর্সের</a> সাথে সরাসরি প্রাসঙ্গিক — shared হোস্টিং-এ একটি লাইভ ডেটাবেস পরিদর্শন বা ঠিক করতে ব্যবহৃত এটিই প্রায়ই আসল টুল।</p>'),

      h(2, 'এক-ক্লিক ইনস্টলার', 'one-click-installers'),
      p('<p>বেশিরভাগ control panel সাধারণ সফটওয়্যারের জন্য এক-ক্লিক ইনস্টলার অন্তর্ভুক্ত করে — এই সাইটের <a href="/bn/wordpress/">WordPress কোর্সের</a> জন্য সবচেয়ে প্রাসঙ্গিক WordPress। এটি অন্যথায় একটি ম্যানুয়াল বহু-ধাপের সেটআপ হতো তা স্বয়ংক্রিয় করে: একটি ডেটাবেস তৈরি করা, WordPress ডাউনলোড করা, আর দুটি সংযুক্ত করা — সত্যিই কাজের, আর জানার যোগ্য এটি নিচে স্বয়ংক্রিয়ভাবে ঘটছে, জাদু নয়।</p>'),

      callout('note', '<p>একটি control panel নিচে একই সার্ভারের উপর একটি সুবিধার স্তর — এটি করা প্রতিটি আসল, কাজের কাজ প্রযুক্তিগতভাবে SSH-এর মাধ্যমে হাতে, বেশি পরিশ্রমে করা যেত। এটিই ঠিক সেই বিনিময় যা shared হোস্টিং প্রবেশযোগ্যতার জন্য করে, আর ঠিক যা একটি VPS-এর সুবিধা ছেড়ে দেয়, পরের SSH পাঠে কভার করা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'ssh-and-working-on-a-server',
  sortOrder: 22,
  en: {
    title: 'SSH and Working on a Server',
    metaTitle: 'SSH and Working on a Server | Learn Computer Academy',
    metaDescription: 'SSH gives you a real command line on a remote server. What it actually is, how to connect, and the handful of commands that cover most real work.',
    blocks: [
      p('<p><b>SSH</b> (Secure Shell) gives you a real, direct command line on a remote server — the same kind of terminal access you\'d have sitting physically in front of the machine, over an encrypted connection. It is the standard way of genuinely administering a VPS or dedicated server, where there is no control panel abstracting the work away.</p>'),

      h(2, 'What Connecting Looks Like'),
      code('bash', 'ssh username@your-server-ip\n# or, using a domain already pointed at the server\nssh username@example.com'),
      p('<p>After authenticating — with a password, or more securely with an <b>SSH key</b> (a cryptographic key pair, covered briefly below) — you land at a command prompt running directly on the remote server, exactly as if you had opened a terminal on that machine yourself.</p>'),

      img(
        'docs/img/hosting/ssh-1',
        'Isometric diagram showing a laptop with a terminal window connected via an encrypted line labelled SSH directly to a remote server, with a command prompt visible on the server itself',
        1024, 768,
        'SSH puts you directly at a command prompt on the remote machine, not a layer of abstraction above it.'
      ),

      h(2, 'SSH Keys, Briefly'),
      p('<p>An SSH key pair is a more secure alternative to a password: a <b>private key</b> stays on your own computer, never shared, and a matching <b>public key</b> is placed on the server. The server can verify you hold the matching private key without that key ever being transmitted — meaningfully more secure than a password alone, and the standard, expected way to connect for any serious server work.</p>'),

      h(2, 'Commands That Cover Most Real Work'),
      table(
        ['Command', 'Does'],
        [
          ['ls', 'Lists files in the current directory'],
          ['cd foldername', 'Changes into a directory'],
          ['pwd', 'Shows the current directory\'s full path'],
          ['nano filename or vim filename', 'Opens a file in a terminal-based text editor'],
          ['cp / mv / rm', 'Copies, moves/renames, or deletes a file'],
          ['sudo command', 'Runs a command with administrator privileges'],
        ]
      ),
      p('<p>This is a genuinely small set. A large share of real server work — deploying an app, checking logs, restarting a service, editing a configuration file — is built from just these commands, repeated and combined.</p>'),

      callout('warning', '<p>There is real risk here that a control panel deliberately prevents by design: a mistyped command with <code>sudo</code>, especially involving <code>rm</code> (delete), can genuinely damage a server with no confirmation prompt and no undo. Move carefully, double-check any command before running it with elevated privileges, and keep backups (covered in a later lesson) before experimenting on anything that matters.</p>', 'SSH gives you real power, with no safety net')  ,

      h(2, 'When You Actually Need SSH'),
      p('<p>Shared hosting rarely requires it — the control panel from the previous lesson covers nearly everything a shared hosting user needs. SSH becomes necessary once you\'re on a VPS or dedicated server, or when a cloud platform\'s deployment or debugging tools specifically require it. It is also directly relevant to the Node.js and connecting-to-a-database material on this site, where a live server session is often the fastest way to diagnose a real problem.</p>'),
    ],
  },
  bn: {
    title: 'SSH আর একটি সার্ভারে কাজ করা',
    metaTitle: 'SSH আর একটি সার্ভারে কাজ করা | Learn Computer Academy',
    metaDescription: 'SSH আপনাকে একটি দূরবর্তী সার্ভারে একটি আসল command line দেয়। এটি আসলে কী, কীভাবে সংযুক্ত হবেন, আর বেশিরভাগ আসল কাজ কভার করা মুষ্টিমেয় কমান্ড।',
    blocks: [
      p('<p><b>SSH</b> (Secure Shell) আপনাকে একটি দূরবর্তী সার্ভারে একটি আসল, সরাসরি command line দেয় — মেশিনের সামনে ভৌতভাবে বসে থাকলে যে ধরনের terminal প্রবেশাধিকার পেতেন, একটি এনক্রিপ্ট করা সংযোগে। এটি সত্যিই একটি VPS বা dedicated সার্ভার প্রশাসনের আদর্শ উপায়, যেখানে কাজটি বিমূর্ত করার মতো কোনো control panel নেই।</p>'),

      h(2, 'সংযুক্ত হওয়া দেখতে কেমন', 'what-connecting-looks-like'),
      code('bash', 'ssh username@your-server-ip\n# অথবা, ইতিমধ্যে সার্ভারের দিকে নির্দেশ করা একটি ডোমেইন ব্যবহার করে\nssh username@example.com'),
      p('<p>প্রমাণীকরণের পরে — একটি পাসওয়ার্ড দিয়ে, বা বেশি নিরাপদে একটি <b>SSH key</b> দিয়ে (একটি ক্রিপ্টোগ্রাফিক key জোড়া, নিচে সংক্ষেপে কভার করা) — আপনি সরাসরি দূরবর্তী সার্ভারে চলা একটি command prompt-এ পৌঁছান, ঠিক যেন আপনি নিজে সেই মেশিনে একটি terminal খুলেছেন।</p>'),

      img(
        'docs/img/hosting/ssh-1',
        'Isometric ডায়াগ্রাম যেখানে একটি terminal উইন্ডোসহ একটি ল্যাপটপ "SSH" লেবেল করা একটি এনক্রিপ্ট করা লাইনের মাধ্যমে সরাসরি একটি দূরবর্তী সার্ভারে সংযুক্ত দেখানো হয়েছে, সার্ভারে নিজেই একটি command prompt দৃশ্যমান',
        1024, 768,
        'SSH আপনাকে সরাসরি দূরবর্তী মেশিনের একটি command prompt-এ রাখে, এর উপরে বিমূর্ততার একটি স্তর নয়।'
      ),

      h(2, 'SSH Key, সংক্ষেপে', 'ssh-keys-briefly'),
      p('<p>একটি SSH key জোড়া একটি পাসওয়ার্ডের একটি বেশি নিরাপদ বিকল্প: একটি <b>private key</b> আপনার নিজের কম্পিউটারে থাকে, কখনো শেয়ার করা হয় না, আর একটি মিলে যাওয়া <b>public key</b> সার্ভারে রাখা হয়। সার্ভার সেই key কখনো পাঠানো ছাড়াই যাচাই করতে পারে আপনার কাছে মিলে যাওয়া private key আছে কিনা — শুধু একটি পাসওয়ার্ডের চেয়ে অর্থপূর্ণভাবে বেশি নিরাপদ, আর যেকোনো গুরুতর সার্ভার কাজের জন্য সংযুক্ত হওয়ার আদর্শ, প্রত্যাশিত উপায়।</p>'),

      h(2, 'বেশিরভাগ আসল কাজ কভার করা কমান্ড', 'commands-that-cover-most-real-work'),
      table(
        ['কমান্ড', 'যা করে'],
        [
          ['ls', 'বর্তমান ডিরেক্টরিতে ফাইল তালিকাভুক্ত করে'],
          ['cd foldername', 'একটি ডিরেক্টরিতে বদলায়'],
          ['pwd', 'বর্তমান ডিরেক্টরির সম্পূর্ণ path দেখায়'],
          ['nano filename বা vim filename', 'একটি terminal-ভিত্তিক টেক্সট editor-এ একটি ফাইল খোলে'],
          ['cp / mv / rm', 'একটি ফাইল কপি, সরায়/নাম বদলায়, বা মুছে'],
          ['sudo command', 'প্রশাসক অধিকারসহ একটি কমান্ড চালায়'],
        ]
      ),
      p('<p>এটি সত্যিই একটি ছোট সেট। আসল সার্ভার কাজের একটি বড় অংশ — একটি অ্যাপ deploy করা, log যাচাই করা, একটি সেবা পুনরায় চালু করা, একটি কনফিগারেশন ফাইল সম্পাদনা করা — শুধু এই কমান্ডগুলো থেকে তৈরি, পুনরাবৃত্ত আর একত্র করা।</p>'),

      callout('warning', '<p>এখানে একটি আসল ঝুঁকি আছে যা একটি control panel ইচ্ছাকৃতভাবে ডিজাইন দিয়ে প্রতিরোধ করে: <code>sudo</code>-সহ একটি ভুল টাইপ করা কমান্ড, বিশেষত <code>rm</code> (মুছে ফেলা) জড়িত, কোনো নিশ্চিতকরণ প্রম্পট আর কোনো undo ছাড়াই সত্যিই একটি সার্ভারের ক্ষতি করতে পারে। সাবধানে চলুন, উন্নত অধিকারসহ এটি চালানোর আগে যেকোনো কমান্ড দুবার যাচাই করুন, আর গুরুত্বপূর্ণ কিছুতে পরীক্ষা করার আগে backup রাখুন (একটি পরের পাঠে কভার করা)।</p>', 'SSH আপনাকে আসল শক্তি দেয়, কোনো নিরাপত্তা জাল ছাড়াই'),

      h(2, 'আপনার আসলে কখন SSH দরকার', 'when-you-actually-need-ssh'),
      p('<p>Shared হোস্টিং-এ এটি খুব কমই দরকার — আগের পাঠের control panel একজন shared হোস্টিং ব্যবহারকারীর প্রায় সবকিছু দরকার তা কভার করে। একবার আপনি একটি VPS বা dedicated সার্ভারে থাকলে, বা একটি cloud প্ল্যাটফর্মের deployment বা debugging টুল বিশেষভাবে এটি দাবি করলে SSH প্রয়োজনীয় হয়ে ওঠে। এটি এই সাইটের Node.js আর connecting-to-a-database উপাদানের সাথেও সরাসরি প্রাসঙ্গিক, যেখানে একটি লাইভ সার্ভার session প্রায়ই একটি আসল সমস্যা নির্ণয়ের দ্রুততম উপায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'git-based-and-automated-deployment',
  sortOrder: 23,
  en: {
    title: 'Git-Based and Automated Deployment',
    metaTitle: 'Git-Based and Automated Deployment | Learn Computer Academy',
    metaDescription: 'Instead of manually uploading files, connect a Git repository once and let every push deploy automatically. How the modern deployment workflow actually works.',
    blocks: [
      p('<p>Cloud and managed platforms, covered earlier in this category, typically replace manual file uploads with something more automatic: connect a <b>Git</b> repository once, and every push to it deploys automatically, with no FTP client and no manual file transfer involved at all.</p>'),

      h(2, 'The Basic Workflow'),
      p('<p>You connect your GitHub (or similar) repository to the hosting platform once, through its dashboard. From then on, the pattern is simply: write code locally, commit it, push it to the repository — and the platform detects the push, builds the project if a build step is needed, and deploys the result automatically, usually within a minute or two.</p>'),

      img(
        'docs/img/hosting/git-deployment-1',
        'Isometric diagram showing a developer pushing code from a laptop to a Git repository icon, with an arrow automatically continuing from the repository to a live deployed website icon, no manual file transfer step shown',
        1024, 768,
        'Push to the repository; the platform handles the build and deployment automatically from there.'
      ),

      h(2, 'Why This Is a Real Improvement, Not Just a Convenience'),
      p('<ul><li><b>A history of every deployment.</b> Since deployment tracks Git commits, you can see exactly what changed in each release and roll back to any previous one if something breaks.</li><li><b>Preview deployments.</b> Many platforms build a separate, shareable preview URL for a branch or a pull request, before it ever reaches the live site — a safe way to review a change before it\'s public.</li><li><b>Fewer manual mistakes.</b> No forgetting to upload one changed file, no accidentally overwriting the wrong folder on the server.</li><li><b>Team-friendly by default.</b> Multiple people pushing to the same repository naturally deploy through the same consistent process, with no separate manual step for each person.</li></ul>'),

      h(2, 'What "Build" Means Here'),
      p('<p>For a project that needs one — a React app, most notably — the platform runs the project\'s build step (turning source code into the static files covered in the static-hosting lesson) automatically as part of deployment, rather than you running it locally and uploading the output by hand. This is exactly the deploying-a-react-app lesson\'s workflow, described in full shortly.</p>'),

      callout('note', '<p>This site itself deploys exactly this way — a push to its repository triggers an automatic build and, per its own architecture described in the project\'s technical documentation, publishes the updated pages without anyone manually touching a server.</p>'),

      h(2, 'Continuous Deployment vs. a Manual Trigger'),
      p('<p>Most platforms default to deploying automatically on every push to a specific branch (commonly <code>main</code>) — this is what "continuous deployment" means in practice. Some setups instead require a manual click to promote a build to the live site, which trades a little speed for an extra deliberate checkpoint before something goes live — a reasonable choice for a project where an accidental push shouldn\'t immediately go public.</p>'),

      h(2, 'Where This Fits Among the Other Options'),
      p('<p>Git-based deployment is the default and expected workflow for cloud/managed platforms and React/Node.js projects specifically. Shared hosting for PHP or WordPress can sometimes be configured for it too, but FTP/SFTP and control-panel-based deployment, covered in the previous two lessons, remain far more common there in practice.</p>'),
    ],
  },
  bn: {
    title: 'Git-ভিত্তিক আর স্বয়ংক্রিয় Deployment',
    metaTitle: 'Git-ভিত্তিক আর স্বয়ংক্রিয় Deployment | Learn Computer Academy',
    metaDescription: 'ম্যানুয়ালি ফাইল আপলোড করার বদলে, একবার একটি Git repository সংযুক্ত করুন আর প্রতিটি push স্বয়ংক্রিয়ভাবে deploy হতে দিন। আধুনিক deployment workflow আসলে কীভাবে কাজ করে।',
    blocks: [
      p('<p>এই বিভাগে আগে কভার করা Cloud আর managed প্ল্যাটফর্ম সাধারণত ম্যানুয়াল ফাইল আপলোডকে আরও স্বয়ংক্রিয় কিছু দিয়ে প্রতিস্থাপন করে: একবার একটি <b>Git</b> repository সংযুক্ত করুন, আর এতে প্রতিটি push স্বয়ংক্রিয়ভাবে deploy হয়, কোনো FTP client আর কোনো ম্যানুয়াল ফাইল স্থানান্তর একেবারেই জড়িত না থাকে।</p>'),

      h(2, 'মৌলিক Workflow', 'the-basic-workflow'),
      p('<p>আপনি একবার, এর dashboard-এর মাধ্যমে, আপনার GitHub (বা একই ধরনের) repository হোস্টিং প্ল্যাটফর্মের সাথে সংযুক্ত করেন। তখন থেকে, প্যাটার্নটি সহজভাবে: স্থানীয়ভাবে কোড লিখুন, এটি commit করুন, repository-তে push করুন — আর প্ল্যাটফর্মটি push সনাক্ত করে, একটি build ধাপ দরকার হলে প্রোজেক্ট build করে, আর ফলাফল স্বয়ংক্রিয়ভাবে deploy করে, সাধারণত এক বা দুই মিনিটের মধ্যে।</p>'),

      img(
        'docs/img/hosting/git-deployment-1',
        'Isometric ডায়াগ্রাম যেখানে একজন ডেভেলপার একটি ল্যাপটপ থেকে একটি Git repository আইকনে কোড push করছেন, repository থেকে স্বয়ংক্রিয়ভাবে একটি live deploy করা ওয়েবসাইট আইকন পর্যন্ত চলতে থাকা একটি তীরসহ, কোনো ম্যানুয়াল ফাইল স্থানান্তর ধাপ দেখানো নেই',
        1024, 768,
        'Repository-তে push করুন; প্ল্যাটফর্মটি সেখান থেকে স্বয়ংক্রিয়ভাবে build আর deployment সামলায়।'
      ),

      h(2, 'এটি কেন শুধু একটি সুবিধা নয়, একটি আসল উন্নতি', 'why-this-is-a-real-improvement-not-just-a-convenience'),
      p('<p><ul><li><b>প্রতিটি deployment-এর একটি ইতিহাস।</b> Deployment Git commit ট্র্যাক করে বলে, প্রতিটি release-এ ঠিক কী বদলেছে দেখতে পারেন আর কিছু ভাঙলে যেকোনো আগেরটিতে ফিরে যেতে পারেন।</li><li><b>Preview deployment।</b> অনেক প্ল্যাটফর্ম এটি live সাইটে পৌঁছানোর আগে একটি branch বা একটি pull request-এর জন্য একটি আলাদা, শেয়ার করার যোগ্য preview URL তৈরি করে — একটি পরিবর্তন প্রকাশ্য হওয়ার আগে পর্যালোচনার একটি নিরাপদ উপায়।</li><li><b>কম ম্যানুয়াল ভুল।</b> একটি বদলে যাওয়া ফাইল আপলোড করতে ভুলে যাওয়া নেই, দুর্ঘটনাক্রমে সার্ভারে ভুল ফোল্ডার ওভাররাইট করা নেই।</li><li><b>ডিফল্টভাবে team-বান্ধব।</b> একই repository-তে push করা একাধিক মানুষ স্বাভাবিকভাবে একই ধারাবাহিক প্রক্রিয়ার মাধ্যমে deploy করে, প্রতিটি ব্যক্তির জন্য কোনো আলাদা ম্যানুয়াল ধাপ ছাড়াই।</li></ul></p>'),

      h(2, '"Build" এখানে কী বোঝায়', 'what-build-means-here'),
      p('<p>যে প্রোজেক্টের একটি দরকার — সবচেয়ে উল্লেখযোগ্যভাবে একটি React অ্যাপ — এর জন্য, প্ল্যাটফর্মটি deployment-এর অংশ হিসেবে স্বয়ংক্রিয়ভাবে প্রোজেক্টের build ধাপ চালায় (সোর্স কোডকে static-হোস্টিং পাঠে কভার করা static ফাইলে পরিণত করা), আপনি স্থানীয়ভাবে এটি চালিয়ে হাতে output আপলোড করার বদলে। এটি ঠিক deploying-a-react-app পাঠের workflow, শীঘ্রই সম্পূর্ণভাবে বর্ণিত।</p>'),

      callout('note', '<p>এই সাইট নিজেই ঠিক এভাবে deploy হয় — এর repository-তে একটি push একটি স্বয়ংক্রিয় build চালু করে আর, প্রোজেক্টের টেকনিক্যাল ডকুমেন্টেশনে বর্ণিত এর নিজস্ব স্থাপত্য অনুযায়ী, কেউ ম্যানুয়ালি একটি সার্ভার স্পর্শ না করেই আপডেট করা পাতা প্রকাশ করে।</p>'),

      h(2, 'Continuous Deployment বনাম একটি ম্যানুয়াল Trigger', 'continuous-deployment-vs-a-manual-trigger'),
      p('<p>বেশিরভাগ প্ল্যাটফর্ম ডিফল্টভাবে একটি নির্দিষ্ট branch-এ (সাধারণত <code>main</code>) প্রতিটি push-এ স্বয়ংক্রিয়ভাবে deploy করে — বাস্তবে এটিই "continuous deployment" বোঝায়। কিছু সেটআপ এর বদলে একটি build-কে live সাইটে উন্নীত করতে একটি ম্যানুয়াল ক্লিক দাবি করে, যা কিছু লাইভ হওয়ার আগে একটি অতিরিক্ত ইচ্ছাকৃত চেকপয়েন্টের বিনিময়ে সামান্য গতি বিনিময় করে — এমন একটি প্রোজেক্টের জন্য একটি যুক্তিসঙ্গত পছন্দ যেখানে একটি দুর্ঘটনাজনিত push সাথে সাথে প্রকাশ্য হওয়া উচিত নয়।</p>'),

      h(2, 'অন্য বিকল্পগুলোর মধ্যে এটি কোথায় মানানসই', 'where-this-fits-among-the-other-options'),
      p('<p>Git-ভিত্তিক deployment বিশেষভাবে cloud/managed প্ল্যাটফর্ম আর React/Node.js প্রোজেক্টের জন্য ডিফল্ট আর প্রত্যাশিত workflow। PHP বা WordPress-এর জন্য shared হোস্টিংও কখনো কখনো এর জন্য কনফিগার করা যায়, কিন্তু আগের দুই পাঠে কভার করা FTP/SFTP আর control-panel-ভিত্তিক deployment বাস্তবে সেখানে অনেক বেশি সাধারণ থেকে যায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'deploying-a-static-site',
  sortOrder: 24,
  en: {
    title: 'Deploying a Static Site',
    metaTitle: 'Deploying a Static HTML/CSS/JS Site | Learn Computer Academy',
    metaDescription: 'A concrete, start-to-finish walkthrough for putting a plain HTML/CSS/JS project online, using everything covered earlier in this category.',
    blocks: [
      p('<p>This lesson applies everything covered so far to the simplest real case: a plain HTML/CSS/JS project — exactly what this site\'s <a href="/html/">HTML</a>, <a href="/css/">CSS</a>, and <a href="/javascript/">JavaScript</a> courses build.</p>'),

      h(2, 'What You Need, From the Earlier Checklist'),
      p('<p>Per the what-going-live-actually-requires lesson, a static site needs almost the shortest list in this category: hosting (static hosting fits perfectly, per the hosting-types lessons), and optionally a domain — a platform\'s free subdomain is a completely reasonable starting point.</p>'),

      h(2, 'Option A — A Cloud/Static Hosting Platform (Recommended for Most Students)'),
      p('<ol><li>Push your project\'s files to a Git repository.</li><li>Connect that repository to a static or cloud hosting platform.</li><li>The platform detects there is no build step needed (or runs a trivial one) and serves the files directly.</li><li>You get a free URL on the platform\'s subdomain immediately.</li><li>Optionally, connect your own domain, per the pointing-a-domain-at-hosting lesson.</li></ol><p>This is the fastest path, requires no FTP client, and is very often entirely free — the realistic default for a portfolio project.</p>'),

      img(
        'docs/img/hosting/deploy-static-1',
        'Isometric diagram showing a simple project folder with HTML CSS and JS file icons being pushed to a repository and appearing live on a browser window, a short direct path with no server configuration step',
        1024, 768,
        'A static site\'s deployment path is the shortest in this category — no server to configure at all.'
      ),

      h(2, 'Option B — Shared Hosting via FTP'),
      p('<ol><li>Get your FTP/SFTP credentials from your host\'s control panel.</li><li>Connect with an FTP client, per the FTP/SFTP lesson.</li><li>Navigate to the <code>public_html</code> folder (or your host\'s equivalent).</li><li>Upload your project\'s files — typically an <code>index.html</code> at the root, plus your CSS, JS, and any assets.</li><li>Visit your domain to confirm it loads.</li></ol><p>This route makes sense mainly if you already have shared hosting for another reason (a WordPress or PHP site, for instance) and want to add a static project alongside it.</p>'),

      h(2, 'A Common Beginner Mistake'),
      callout('warning', '<p>The homepage file must be named exactly <code>index.html</code> and sit in the root of the folder your host actually serves. A file named anything else, or nested inside an extra subfolder, will not load automatically when someone visits your bare domain — this single detail causes a large share of "I uploaded my site and it shows a blank page or an error" confusion.</p>', 'index.html, in the right folder')  ,

      h(2, 'Verifying It Actually Worked'),
      p('<p>Visit the live URL in an incognito/private browser window, to rule out your own browser cache showing you something stale. Check that CSS and images load — a common secondary mistake is linking to assets with a path that worked locally but breaks once deployed, because the folder structure or the base URL is different in production.</p>'),
    ],
  },
  bn: {
    title: 'একটি Static সাইট Deploy করা',
    metaTitle: 'একটি Static HTML/CSS/JS সাইট Deploy করা | Learn Computer Academy',
    metaDescription: 'একটি সাধারণ HTML/CSS/JS প্রোজেক্ট অনলাইনে রাখার একটি সুনির্দিষ্ট, শুরু-থেকে-শেষ walkthrough, এই বিভাগে আগে কভার করা সবকিছু ব্যবহার করে।',
    blocks: [
      p('<p>এই পাঠ এখন পর্যন্ত কভার করা সবকিছু সবচেয়ে সরল আসল ক্ষেত্রে প্রয়োগ করে: একটি সাধারণ HTML/CSS/JS প্রোজেক্ট — ঠিক এই সাইটের <a href="/bn/html/">HTML</a>, <a href="/bn/css/">CSS</a>, আর <a href="/bn/javascript/">JavaScript</a> কোর্স যা তৈরি করে।</p>'),

      h(2, 'আগের চেকলিস্ট থেকে আপনার কী দরকার', 'what-you-need-from-the-earlier-checklist'),
      p('<p>what-going-live-actually-requires পাঠ অনুযায়ী, একটি static সাইটে এই বিভাগের প্রায় সবচেয়ে ছোট তালিকা দরকার: হোস্টিং (static হোস্টিং নিখুঁতভাবে মানানসই, হোস্টিং-ধরনের পাঠ অনুযায়ী), আর ঐচ্ছিকভাবে একটি ডোমেইন — একটি প্ল্যাটফর্মের বিনামূল্যের subdomain একটি সম্পূর্ণ যুক্তিসঙ্গত শুরুর বিন্দু।</p>'),

      h(2, 'বিকল্প A — একটি Cloud/Static হোস্টিং প্ল্যাটফর্ম (বেশিরভাগ শিক্ষার্থীর জন্য প্রস্তাবিত)', 'option-a-a-cloudstatic-hosting-platform-recommended-for-most-students'),
      p('<p><ol><li>আপনার প্রোজেক্টের ফাইল একটি Git repository-তে push করুন।</li><li>সেই repository একটি static বা cloud হোস্টিং প্ল্যাটফর্মের সাথে সংযুক্ত করুন।</li><li>প্ল্যাটফর্মটি সনাক্ত করে কোনো build ধাপ দরকার নেই (বা একটি তুচ্ছ একটি চালায়) আর সরাসরি ফাইল পরিবেশন করে।</li><li>আপনি সাথে সাথে প্ল্যাটফর্মের subdomain-এ একটি বিনামূল্যের URL পান।</li><li>ঐচ্ছিকভাবে, pointing-a-domain-at-hosting পাঠ অনুযায়ী আপনার নিজের ডোমেইন সংযুক্ত করুন।</li></ol></p><p>এটি দ্রুততম পথ, কোনো FTP client দাবি করে না, আর প্রায়ই সম্পূর্ণ বিনামূল্যে — একটি portfolio প্রোজেক্টের জন্য বাস্তবসম্মত ডিফল্ট।</p>'),

      img(
        'docs/img/hosting/deploy-static-1',
        'Isometric ডায়াগ্রাম যেখানে HTML CSS আর JS ফাইল আইকনসহ একটি সরল প্রোজেক্ট ফোল্ডার একটি repository-তে push হচ্ছে আর একটি ব্রাউজার উইন্ডোতে live দেখা যাচ্ছে, কোনো সার্ভার কনফিগারেশন ধাপ ছাড়া একটি ছোট সরাসরি পথ',
        1024, 768,
        'একটি static সাইটের deployment পথ এই বিভাগে সবচেয়ে ছোট — পরিচালনা করার মতো একেবারেই কোনো সার্ভার নেই।'
      ),

      h(2, 'বিকল্প B — FTP-এর মাধ্যমে Shared হোস্টিং', 'option-b-shared-hosting-via-ftp'),
      p('<p><ol><li>আপনার host-এর control panel থেকে আপনার FTP/SFTP credential নিন।</li><li>FTP/SFTP পাঠ অনুযায়ী একটি FTP client দিয়ে সংযুক্ত হন।</li><li><code>public_html</code> ফোল্ডারে (বা আপনার host-এর সমতুল্যে) navigate করুন।</li><li>আপনার প্রোজেক্টের ফাইল আপলোড করুন — সাধারণত রুটে একটি <code>index.html</code>, সাথে আপনার CSS, JS, আর যেকোনো asset।</li><li>এটি লোড হয় কিনা নিশ্চিত করতে আপনার ডোমেইন ভিজিট করুন।</li></ol></p><p>এই পথটি প্রধানত অর্থপূর্ণ যদি আপনার ইতিমধ্যে অন্য কারণে shared হোস্টিং থাকে (উদাহরণস্বরূপ, একটি WordPress বা PHP সাইট) আর এর পাশে একটি static প্রোজেক্ট যোগ করতে চান।</p>'),

      h(2, 'একটি সাধারণ শিক্ষানবিসের ভুল', 'a-common-beginner-mistake'),
      callout('warning', '<p>হোমপেজ ফাইলের নাম ঠিক <code>index.html</code> হতে হবে আর আপনার host আসলে পরিবেশন করা ফোল্ডারের root-এ বসতে হবে। অন্য কোনো নামের একটি ফাইল, বা একটি অতিরিক্ত subfolder-এর ভেতরে nest করা, কেউ আপনার খালি ডোমেইন ভিজিট করলে স্বয়ংক্রিয়ভাবে লোড হবে না — এই একটি বিবরণ "আমি আমার সাইট আপলোড করেছি আর এটি একটি খালি পাতা বা একটি error দেখাচ্ছে" বিভ্রান্তির একটি বড় অংশ ঘটায়।</p>', 'সঠিক ফোল্ডারে, index.html'),

      h(2, 'এটি আসলে কাজ করেছে কিনা যাচাই করা', 'verifying-it-actually-worked'),
      p('<p>আপনার নিজের ব্রাউজার ক্যাশ আপনাকে বাসি কিছু দেখাচ্ছে তা বাতিল করতে একটি incognito/private ব্রাউজার উইন্ডোতে live URL ভিজিট করুন। CSS আর ছবি লোড হয় কিনা যাচাই করুন — একটি সাধারণ দ্বিতীয় ভুল হলো এমন একটি path দিয়ে asset লিংক করা যা স্থানীয়ভাবে কাজ করেছিল কিন্তু deploy হওয়ার পরে ভেঙে যায়, কারণ ফোল্ডার গঠন বা base URL প্রোডাকশনে ভিন্ন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'deploying-php-with-a-database',
  sortOrder: 25,
  en: {
    title: 'Deploying PHP with a Database',
    metaTitle: 'Deploying a PHP Site with a Database | Learn Computer Academy',
    metaDescription: 'A start-to-finish walkthrough for deploying a PHP project that needs a live MySQL database, including the connection-details step every student trips on.',
    blocks: [
      p('<p>A PHP project with a database — the kind built across this site\'s <a href="/php/">PHP</a> and <a href="/sql/">SQL</a> courses — needs one more piece than a static site: a real, live database on the server, not just uploaded files.</p>'),

      h(2, 'What You Need'),
      p('<p>Shared hosting, per the choosing-hosting-for-your-stack lesson — it is built around exactly this combination. You\'ll use the control panel\'s file manager or FTP for the code, and its database tools for the database itself.</p>'),

      h(2, 'The Walkthrough'),
      p('<ol><li><b>Create a database</b> through your host\'s control panel — this generates a database name, and usually a dedicated database username and password, separate from your hosting login.</li><li><b>Import your database structure and data</b>, typically through phpMyAdmin\'s import feature, uploading a <code>.sql</code> file exported from your local development database.</li><li><b>Upload your PHP files</b> via FTP/SFTP or the control panel\'s file manager, into <code>public_html</code>.</li><li><b>Update your database connection details in the code</b> — this is the step almost everyone forgets, covered next.</li><li><b>Test the live site</b>, specifically any page or feature that touches the database.</li></ol>'),

      img(
        'docs/img/hosting/deploy-php-1',
        'Isometric diagram showing PHP files being uploaded to a server folder on the left, and a separate database icon being filled from an imported SQL file on the right, with a small connecting line labelled credentials linking the two',
        1024, 768,
        'Two separate things have to land correctly: the code, and the database — connected by credentials that must match.'
      ),

      h(2, 'The Step Almost Everyone Forgets'),
      callout('warning', '<p>Your local development database and your live server\'s database are two entirely different databases, with different connection details — a different host, username, password, and often a different database name entirely. Code that worked locally will fail on the live server until the connection details in your code are updated to match the live database\'s actual credentials, not your local ones.</p>', 'Local and live database credentials are always different')  ,
      code('php', '// A pattern worth using specifically to avoid this trap —\n// keep credentials in one place, changed once per environment,\n// rather than hardcoded and forgotten in multiple files\n$host = \'localhost\'; // usually correct on shared hosting itself\n$dbname = \'youraccount_dbname\'; // shared hosts often prefix this with your account name\n$username = \'youraccount_dbuser\';\n$password = \'the-password-you-set-when-creating-it\';'),
      p('<p>Shared hosts commonly prefix both the database name and username with your account name — a detail that trips up students expecting the exact name they typed when creating it.</p>'),

      h(2, 'Common Failure Points'),
      table(
        ['Symptom', 'Likely cause'],
        [
          ['A blank white page', 'A PHP error with error display turned off — check your host\'s error log'],
          ['"Access denied for user"', 'Wrong database username or password in your connection code'],
          ['Site loads but no data appears', 'Database imported but empty, or connected to the wrong database name'],
          ['Works on some pages, not others', 'A specific query or table missing from the imported database'],
        ]
      ),

      h(2, 'Verifying It Actually Worked'),
      p('<p>Per this category\'s pipeline standard: check that a page reading from the database actually shows real data, that a form writing to the database actually saves something (check it in phpMyAdmin afterward), and check your host\'s error log for anything unexpected — most control panels expose this directly.</p>'),
    ],
  },
  bn: {
    title: 'ডেটাবেসসহ PHP Deploy করা',
    metaTitle: 'একটি ডেটাবেসসহ একটি PHP সাইট Deploy করা | Learn Computer Academy',
    metaDescription: 'একটি লাইভ MySQL ডেটাবেস দরকার এমন একটি PHP প্রোজেক্ট deploy করার একটি শুরু-থেকে-শেষ walkthrough, প্রতিটি শিক্ষার্থী হোঁচট খায় এমন সংযোগ-বিবরণ ধাপসহ।',
    blocks: [
      p('<p>একটি ডেটাবেসসহ একটি PHP প্রোজেক্ট — এই সাইটের <a href="/bn/php/">PHP</a> আর <a href="/bn/sql/">SQL</a> কোর্স জুড়ে তৈরি ধরনের — একটি static সাইটের চেয়ে একটি বেশি অংশ দরকার: সার্ভারে একটি আসল, লাইভ ডেটাবেস, শুধু আপলোড করা ফাইল নয়।</p>'),

      h(2, 'আপনার কী দরকার', 'what-you-need'),
      p('<p>Choosing-hosting-for-your-stack পাঠ অনুযায়ী shared হোস্টিং — এটি ঠিক এই সমন্বয়ের চারপাশে তৈরি। কোডের জন্য আপনি control panel-এর ফাইল ম্যানেজার বা FTP ব্যবহার করবেন, আর ডেটাবেস নিজের জন্য এর ডেটাবেস টুল।</p>'),

      h(2, 'Walkthrough', 'the-walkthrough'),
      p('<p><ol><li>আপনার host-এর control panel-এর মাধ্যমে <b>একটি ডেটাবেস তৈরি করুন</b> — এটি একটি ডেটাবেস নাম তৈরি করে, আর সাধারণত আপনার হোস্টিং login থেকে আলাদা একটি নিবেদিত ডেটাবেস username আর password।</li><li>সাধারণত phpMyAdmin-এর import ফিচারের মাধ্যমে <b>আপনার ডেটাবেস গঠন আর ডেটা import করুন</b>, আপনার স্থানীয় development ডেটাবেস থেকে export করা একটি <code>.sql</code> ফাইল আপলোড করে।</li><li>FTP/SFTP বা control panel-এর ফাইল ম্যানেজারের মাধ্যমে, <code>public_html</code>-এ <b>আপনার PHP ফাইল আপলোড করুন</b>।</li><li><b>কোডে আপনার ডেটাবেস সংযোগের বিবরণ আপডেট করুন</b> — এই ধাপটি প্রায় সবাই ভুলে যায়, পরে কভার করা।</li><li>বিশেষভাবে ডেটাবেস স্পর্শ করে এমন যেকোনো পাতা বা ফিচার, <b>live সাইট পরীক্ষা করুন</b>।</li></ol></p>'),

      img(
        'docs/img/hosting/deploy-php-1',
        'Isometric ডায়াগ্রাম যেখানে বামে একটি সার্ভার ফোল্ডারে PHP ফাইল আপলোড হচ্ছে দেখানো হয়েছে, আর ডানে একটি import করা SQL ফাইল থেকে ভরা একটি আলাদা ডেটাবেস আইকন, দুটিকে সংযুক্ত করা "credentials" লেবেল করা একটি ছোট সংযোগকারী লাইনসহ',
        1024, 768,
        'দুটি আলাদা জিনিস সঠিকভাবে পৌঁছাতে হয়: কোড, আর ডেটাবেস — credentials দিয়ে সংযুক্ত যা মিলতে হবে।'
      ),

      h(2, 'যা প্রায় সবাই ভুলে যায়', 'the-step-almost-everyone-forgets'),
      callout('warning', '<p>আপনার স্থানীয় development ডেটাবেস আর আপনার live সার্ভারের ডেটাবেস সম্পূর্ণ দুটি ভিন্ন ডেটাবেস, ভিন্ন সংযোগের বিবরণসহ — একটি ভিন্ন host, username, password, আর প্রায়ই সম্পূর্ণ একটি ভিন্ন ডেটাবেস নাম। স্থানীয়ভাবে কাজ করা কোড live সার্ভারে ব্যর্থ হবে যতক্ষণ না আপনার কোডে সংযোগের বিবরণ live ডেটাবেসের আসল credentials-এর সাথে মেলাতে আপডেট করা হয়, আপনার স্থানীয়টির সাথে নয়।</p>', 'স্থানীয় আর live ডেটাবেস credentials সবসময় ভিন্ন'),
      code('php', '// এই ফাঁদ বিশেষভাবে এড়াতে ব্যবহারের যোগ্য একটি প্যাটার্ন —\n// credentials একটি জায়গায় রাখুন, প্রতি পরিবেশে একবার বদলানো,\n// একাধিক ফাইলে hardcode করা আর ভুলে যাওয়া না হয়ে\n$host = \'localhost\'; // সাধারণত shared হোস্টিং-এই সঠিক\n$dbname = \'youraccount_dbname\'; // shared host প্রায়ই আপনার অ্যাকাউন্টের নাম দিয়ে এটি prefix করে\n$username = \'youraccount_dbuser\';\n$password = \'তৈরি করার সময় আপনি সেট করা পাসওয়ার্ড\';'),
      p('<p>Shared host সাধারণত ডেটাবেস নাম আর username দুটোই আপনার অ্যাকাউন্টের নাম দিয়ে prefix করে — একটি বিবরণ যা শিক্ষার্থীদের হোঁচট খাওয়ায় যারা তৈরি করার সময় তারা টাইপ করা ঠিক নামটি আশা করে।</p>'),

      h(2, 'সাধারণ ব্যর্থতার বিন্দু', 'common-failure-points'),
      table(
        ['লক্ষণ', 'সম্ভাব্য কারণ'],
        [
          ['একটি খালি সাদা পাতা', 'Error প্রদর্শন বন্ধ থাকা একটি PHP error — আপনার host-এর error log যাচাই করুন'],
          ['"Access denied for user"', 'আপনার সংযোগ কোডে ভুল ডেটাবেস username বা password'],
          ['সাইট লোড হয় কিন্তু কোনো ডেটা দেখা যায় না', 'ডেটাবেস import করা হয়েছে কিন্তু খালি, বা ভুল ডেটাবেস নামের সাথে সংযুক্ত'],
          ['কিছু পাতায় কাজ করে, অন্যগুলোতে না', 'Import করা ডেটাবেস থেকে একটি নির্দিষ্ট কোয়েরি বা table অনুপস্থিত'],
        ]
      ),

      h(2, 'এটি আসলে কাজ করেছে কিনা যাচাই করা', 'verifying-it-actually-worked'),
      p('<p>এই বিভাগের pipeline মান অনুযায়ী: যাচাই করুন ডেটাবেস থেকে পড়া একটি পাতা আসলে বাস্তব ডেটা দেখায়, ডেটাবেসে লেখা একটি form আসলে কিছু সংরক্ষণ করে (পরে phpMyAdmin-এ যাচাই করুন), আর অপ্রত্যাশিত কিছুর জন্য আপনার host-এর error log যাচাই করুন — বেশিরভাগ control panel সরাসরি এটি প্রকাশ করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'deploying-wordpress',
  sortOrder: 26,
  en: {
    title: 'Deploying WordPress',
    metaTitle: 'Deploying WordPress | Learn Computer Academy',
    metaDescription: 'The one-click path most students actually use, what it does underneath, and the manual path and migration considerations worth knowing about.',
    blocks: [
      p('<p>WordPress deployment usually means one of two paths: a one-click installer doing the work automatically, or a manual setup that makes visible exactly what that installer is doing underneath — directly relevant to this site\'s <a href="/wordpress/">WordPress course</a>.</p>'),

      h(2, 'Path A — The One-Click Installer'),
      p('<p>Nearly every shared host\'s control panel includes a one-click WordPress installer. It asks for a site title, an admin username and password, and which domain or subdomain to install to — then automatically creates the database, downloads WordPress, and configures the connection between them. For a fresh WordPress site, this is genuinely the easiest and most common real-world path, not a shortcut to graduate from.</p>'),

      img(
        'docs/img/hosting/deploy-wordpress-1',
        'Isometric diagram showing a one-click installer button on the left automatically producing a configured database, downloaded WordPress files, and a live site on the right, contrasted with a longer manual path below showing the same three steps done by hand',
        1024, 768,
        'The one-click installer automates exactly the steps the manual path does by hand.'
      ),

      h(2, 'Path B — Manual Setup'),
      p('<p>Understanding the manual version clarifies what the installer automates, and matters when moving an existing site rather than starting fresh:</p><ol><li>Create a database and database user through the control panel.</li><li>Download WordPress and upload its files via FTP/SFTP.</li><li>Visit the site in a browser, which triggers WordPress\'s own setup wizard.</li><li>Enter the database connection details when prompted — the same connection-details step from the previous lesson, since WordPress is, underneath, a PHP application with a MySQL database.</li><li>Create the admin account and complete the setup wizard.</li></ol>'),

      h(2, 'Migrating an Existing WordPress Site'),
      p('<p>Moving a WordPress site already built elsewhere (a local development environment, or between hosts) involves the same underlying database-and-files pattern from the PHP lesson, plus one WordPress-specific wrinkle: the site URL is stored inside the database itself, in specific database rows, not just in a configuration file — so simply moving the files and database as-is often leaves the site pointing at the old address. Dedicated WordPress migration plugins exist specifically to handle this correctly, and are the practical, recommended path rather than editing the database by hand.</p>'),

      callout('warning', '<p>Never edit WordPress core files directly to make a site-specific change — updates will silently overwrite them, undoing your change with no warning. Site-specific changes belong in a theme, a child theme, or a plugin, never in WordPress\'s own core code. This is a repeated point in this site\'s WordPress course, and it matters just as much once a site is live as it does in local development.</p>')  ,

      h(2, 'The Launch Checklist'),
      p('<p>This site\'s WordPress course has its own dedicated launch-checklist lesson covering WordPress-specific pre-launch steps — search engine visibility settings, permalink structure, and similar — worth reviewing directly alongside this one rather than duplicating it here.</p>'),
    ],
  },
  bn: {
    title: 'WordPress Deploy করা',
    metaTitle: 'WordPress Deploy করা | Learn Computer Academy',
    metaDescription: 'বেশিরভাগ শিক্ষার্থী আসলে ব্যবহার করে এমন এক-ক্লিক পথ, এটি নিচে কী করে, আর জানার যোগ্য ম্যানুয়াল পথ আর migration বিবেচনা।',
    blocks: [
      p('<p>WordPress deployment সাধারণত দুটি পথের একটি বোঝায়: একটি এক-ক্লিক ইনস্টলার স্বয়ংক্রিয়ভাবে কাজ করা, বা একটি ম্যানুয়াল সেটআপ যা সেই ইনস্টলারটি নিচে ঠিক কী করছে তা দৃশ্যমান করে — এই সাইটের <a href="/bn/wordpress/">WordPress কোর্সের</a> সাথে সরাসরি প্রাসঙ্গিক।</p>'),

      h(2, 'পথ A — এক-ক্লিক ইনস্টলার', 'path-a-the-one-click-installer'),
      p('<p>প্রায় প্রতিটি shared host-এর control panel একটি এক-ক্লিক WordPress ইনস্টলার অন্তর্ভুক্ত করে। এটি একটি সাইটের title, একটি admin username আর password, আর কোন ডোমেইন বা subdomain-এ ইনস্টল করতে হবে তা জিজ্ঞাসা করে — তারপর স্বয়ংক্রিয়ভাবে ডেটাবেস তৈরি করে, WordPress ডাউনলোড করে, আর তাদের মধ্যে সংযোগ কনফিগার করে। একটি নতুন WordPress সাইটের জন্য, এটি সত্যিই সবচেয়ে সহজ আর সবচেয়ে সাধারণ বাস্তব-জগতের পথ, স্নাতক হওয়ার একটি শর্টকাট নয়।</p>'),

      img(
        'docs/img/hosting/deploy-wordpress-1',
        'Isometric ডায়াগ্রাম যেখানে বামে একটি এক-ক্লিক ইনস্টলার বোতাম স্বয়ংক্রিয়ভাবে একটি কনফিগার করা ডেটাবেস, ডাউনলোড করা WordPress ফাইল, আর ডানে একটি live সাইট তৈরি করছে, নিচে একটি দীর্ঘ ম্যানুয়াল পথের সাথে বৈসাদৃশ্য যা হাতে করা একই তিনটি ধাপ দেখাচ্ছে',
        1024, 768,
        'এক-ক্লিক ইনস্টলার ঠিক সেই ধাপগুলো স্বয়ংক্রিয় করে যা ম্যানুয়াল পথ হাতে করে।'
      ),

      h(2, 'পথ B — ম্যানুয়াল সেটআপ', 'path-b-manual-setup'),
      p('<p>ম্যানুয়াল সংস্করণ বোঝা ইনস্টলার কী স্বয়ংক্রিয় করে তা স্পষ্ট করে, আর নতুন করে শুরু করার বদলে একটি বিদ্যমান সাইট সরানোর সময় গুরুত্বপূর্ণ:</p><ol><li>Control panel-এর মাধ্যমে একটি ডেটাবেস আর ডেটাবেস user তৈরি করুন।</li><li>WordPress ডাউনলোড করুন আর FTP/SFTP-এর মাধ্যমে এর ফাইল আপলোড করুন।</li><li>একটি ব্রাউজারে সাইট ভিজিট করুন, যা WordPress-এর নিজস্ব সেটআপ wizard চালু করে।</li><li>জিজ্ঞাসা করা হলে ডেটাবেস সংযোগের বিবরণ দিন — আগের পাঠের একই সংযোগ-বিবরণ ধাপ, কারণ WordPress, নিচে, একটি MySQL ডেটাবেসসহ একটি PHP অ্যাপ্লিকেশন।</li><li>Admin অ্যাকাউন্ট তৈরি করুন আর সেটআপ wizard সম্পূর্ণ করুন।</li></ol>'),

      h(2, 'একটি বিদ্যমান WordPress সাইট Migrate করা', 'migrating-an-existing-wordpress-site'),
      p('<p>অন্যত্র ইতিমধ্যে তৈরি একটি WordPress সাইট সরানো (একটি স্থানীয় development পরিবেশ, বা host-এর মধ্যে) PHP পাঠের একই অন্তর্নিহিত ডেটাবেস-আর-ফাইল প্যাটার্ন জড়িত, সাথে একটি WordPress-নির্দিষ্ট বিশেষত্ব: সাইটের URL ডেটাবেসের ভেতরেই সংরক্ষিত, নির্দিষ্ট ডেটাবেস সারিতে, শুধু একটি কনফিগারেশন ফাইলে নয় — তাই শুধু ফাইল আর ডেটাবেস যেমন আছে তেমন সরালে প্রায়ই সাইটটি পুরোনো ঠিকানার দিকে নির্দেশ করে থেকে যায়। নিবেদিত WordPress migration plugin বিশেষভাবে এটি সঠিকভাবে সামলাতে আছে, আর হাতে ডেটাবেস সম্পাদনার বদলে ব্যবহারিক, প্রস্তাবিত পথ।</p>'),

      callout('warning', '<p>একটি সাইট-নির্দিষ্ট পরিবর্তন করতে কখনো সরাসরি WordPress core ফাইল সম্পাদনা করবেন না — আপডেট চুপচাপ সেগুলো ওভাররাইট করবে, কোনো সতর্কতা ছাড়াই আপনার পরিবর্তন বাতিল করবে। সাইট-নির্দিষ্ট পরিবর্তন একটি theme, একটি child theme, বা একটি plugin-এ থাকে, কখনো WordPress-এর নিজস্ব core কোডে নয়। এটি এই সাইটের WordPress কোর্সে একটি পুনরাবৃত্ত বিষয়, আর একটি সাইট live হয়ে গেলে এটি স্থানীয় development-এ যতটা গুরুত্বপূর্ণ ততটাই গুরুত্বপূর্ণ।</p>'),

      h(2, 'Launch চেকলিস্ট', 'the-launch-checklist'),
      p('<p>এই সাইটের WordPress কোর্সের নিজস্ব একটি নিবেদিত launch-checklist পাঠ আছে যা WordPress-নির্দিষ্ট প্রাক-launch ধাপ কভার করে — সার্চ ইঞ্জিন দৃশ্যমানতার সেটিং, permalink গঠন, আর একই ধরনের — এখানে পুনরাবৃত্তি না করে এটির পাশাপাশি সরাসরি পর্যালোচনার যোগ্য।</p>'),
    ],
  },
})

lessons.push({
  slug: 'deploying-a-react-app',
  sortOrder: 27,
  en: {
    title: 'Deploying a React App',
    metaTitle: 'Deploying a React App | Learn Computer Academy',
    metaDescription: 'React builds down to static files, which is why it deploys through the Git-based cloud workflow — a start-to-finish walkthrough, including the routing wrinkle that catches beginners.',
    blocks: [
      p('<p>This is the direct, practical version of an idea introduced in the static-hosting lesson: a React app, once built, is just static files — HTML, CSS, and JavaScript — which is why it deploys through the Git-based cloud workflow covered earlier in this category, not through FTP.</p>'),

      h(2, 'What "Building" Actually Produces'),
      code('bash', 'npm run build\n# produces a folder (commonly "build" or "dist") full of\n# plain HTML, CSS, and JS — no React-specific server needed to serve it'),
      p('<p>That output folder is a fully static site in every sense covered in the static-hosting lesson — it could, in principle, be uploaded via plain FTP like any other static project. In practice, almost nobody does that by hand.</p>'),

      h(2, 'The Walkthrough'),
      p('<ol><li>Push your React project to a Git repository.</li><li>Connect that repository to a cloud/static hosting platform.</li><li>The platform detects it\'s a React project, runs <code>npm run build</code> automatically, and serves the output.</li><li>You get a free URL immediately, on the platform\'s own subdomain.</li><li>Connect your own domain, if you have one, per the pointing-a-domain-at-hosting lesson.</li></ol><p>From this point on, every push to your repository\'s main branch redeploys automatically — exactly the Git-based deployment workflow covered earlier, with nothing React-specific about the mechanism itself.</p>'),

      img(
        'docs/img/hosting/deploy-react-1',
        'Isometric diagram showing React source code being pushed to a repository, an automatic build step turning it into plain static file icons, and those files appearing live on a browser',
        1024, 768,
        'The build step is what turns React source into the plain static files a browser actually receives.'
      ),

      h(2, 'The Routing Wrinkle'),
      p('<p>A React app using client-side routing (moving between pages without a full reload) needs one specific server configuration to work correctly once deployed: every URL path needs to serve the same <code>index.html</code> file, letting React\'s own router handle which content to show based on the URL, rather than the server looking for a matching physical file at each path and returning a 404 when it doesn\'t find one.</p>'),

      callout('warning', '<p>Without this configuration, the homepage works fine, but refreshing the browser on any other page — or sharing a direct link to one — produces a 404 error, because the server looked for a file at that exact path and found nothing. Most cloud hosting platforms handle this automatically for a recognised React project; if using plain static hosting without that detection, this needs to be configured explicitly, usually through a small redirect or rewrite rule the platform\'s documentation will name directly.</p>', 'Client-side routing needs a specific server rule')  ,

      h(2, 'Environment Variables'),
      p('<p>A React app often needs configuration that differs between local development and production — an API URL, for instance. These are set through the hosting platform\'s dashboard rather than hardcoded, covered properly in the environment-variables-and-secrets lesson later in this category — the same underlying idea as a database password, just for a different kind of value.</p>'),

      h(2, 'Verifying It Actually Worked'),
      p('<p>Beyond checking the homepage, specifically test navigating to an inner route and then refreshing the browser on it — that single action is the most reliable way to catch the routing wrinkle before a real visitor does.</p>'),
    ],
  },
  bn: {
    title: 'একটি React অ্যাপ Deploy করা',
    metaTitle: 'একটি React অ্যাপ Deploy করা | Learn Computer Academy',
    metaDescription: 'React static ফাইলে build হয়, যে কারণে এটি Git-ভিত্তিক cloud workflow-এর মাধ্যমে deploy হয় — শিক্ষানবিসদের ধরা routing বিশেষত্বসহ একটি শুরু-থেকে-শেষ walkthrough।',
    blocks: [
      p('<p>এটি static-হোস্টিং পাঠে পরিচয় করানো একটি ধারণার সরাসরি, ব্যবহারিক সংস্করণ: একটি React অ্যাপ, একবার build হলে, শুধু static ফাইল — HTML, CSS, আর JavaScript — যে কারণে এটি এই বিভাগে আগে কভার করা Git-ভিত্তিক cloud workflow-এর মাধ্যমে deploy হয়, FTP-এর মাধ্যমে নয়।</p>'),

      h(2, '"Building" আসলে কী তৈরি করে', 'what-building-actually-produces'),
      code('bash', 'npm run build\n# সাধারণ HTML, CSS, আর JS-এ ভরা একটি ফোল্ডার তৈরি করে\n# (সাধারণত "build" বা "dist") — এটি পরিবেশন করতে কোনো\n# React-নির্দিষ্ট সার্ভারের প্রয়োজন নেই'),
      p('<p>সেই output ফোল্ডারটি static-হোস্টিং পাঠে কভার করা প্রতিটি অর্থে একটি সম্পূর্ণ static সাইট — এটি, নীতিগতভাবে, অন্য যেকোনো static প্রোজেক্টের মতো সাধারণ FTP-এর মাধ্যমে আপলোড করা যেত। বাস্তবে, প্রায় কেউ এটি হাতে করে না।</p>'),

      h(2, 'Walkthrough', 'the-walkthrough'),
      p('<p><ol><li>আপনার React প্রোজেক্ট একটি Git repository-তে push করুন।</li><li>সেই repository একটি cloud/static হোস্টিং প্ল্যাটফর্মের সাথে সংযুক্ত করুন।</li><li>প্ল্যাটফর্মটি সনাক্ত করে এটি একটি React প্রোজেক্ট, স্বয়ংক্রিয়ভাবে <code>npm run build</code> চালায়, আর output পরিবেশন করে।</li><li>আপনি সাথে সাথে প্ল্যাটফর্মের নিজস্ব subdomain-এ একটি বিনামূল্যের URL পান।</li><li>আপনার একটি থাকলে, pointing-a-domain-at-hosting পাঠ অনুযায়ী আপনার নিজের ডোমেইন সংযুক্ত করুন।</li></ol></p><p>এই বিন্দু থেকে, আপনার repository-র main branch-এ প্রতিটি push স্বয়ংক্রিয়ভাবে পুনরায় deploy হয় — ঠিক আগে কভার করা Git-ভিত্তিক deployment workflow, প্রক্রিয়াটি নিজে সম্পর্কে React-নির্দিষ্ট কিছু ছাড়াই।</p>'),

      img(
        'docs/img/hosting/deploy-react-1',
        'Isometric ডায়াগ্রাম যেখানে React সোর্স কোড একটি repository-তে push হচ্ছে দেখানো হয়েছে, একটি স্বয়ংক্রিয় build ধাপ এটিকে সাধারণ static ফাইল আইকনে পরিণত করছে, আর সেই ফাইলগুলো একটি ব্রাউজারে live দেখা যাচ্ছে',
        1024, 768,
        'Build ধাপটিই React সোর্সকে ব্রাউজার আসলে যে সাধারণ static ফাইল পায় তাতে পরিণত করে।'
      ),

      h(2, 'Routing বিশেষত্ব', 'the-routing-wrinkle'),
      p('<p>Client-side routing ব্যবহার করা একটি React অ্যাপে (একটি সম্পূর্ণ reload ছাড়া পাতার মধ্যে চলাচল) deploy হওয়ার পরে সঠিকভাবে কাজ করতে একটি নির্দিষ্ট সার্ভার কনফিগারেশন দরকার: প্রতিটি URL path-এ একই <code>index.html</code> ফাইল পরিবেশন করতে হয়, প্রতিটি path-এ একটি মিলে যাওয়া ভৌত ফাইল খুঁজে না পেয়ে একটি 404 ফেরত দেওয়া সার্ভারের বদলে React-এর নিজস্ব router-কে URL-এর ভিত্তিতে কোন কন্টেন্ট দেখাবে তা সামলাতে দিতে হয়।</p>'),

      callout('warning', '<p>এই কনফিগারেশন ছাড়া, হোমপেজ ঠিকভাবে কাজ করে, কিন্তু অন্য যেকোনো পাতায় ব্রাউজার refresh করলে — বা একটির সরাসরি একটি লিংক শেয়ার করলে — একটি 404 error তৈরি হয়, কারণ সার্ভারটি ঠিক সেই path-এ একটি ফাইল খুঁজেছে আর কিছুই পায়নি। বেশিরভাগ cloud হোস্টিং প্ল্যাটফর্ম একটি স্বীকৃত React প্রোজেক্টের জন্য এটি স্বয়ংক্রিয়ভাবে সামলায়; সেই সনাক্তকরণ ছাড়া সাধারণ static হোস্টিং ব্যবহার করলে, এটি স্পষ্টভাবে কনফিগার করতে হবে, সাধারণত একটি ছোট redirect বা rewrite নিয়মের মাধ্যমে যা প্ল্যাটফর্মের ডকুমেন্টেশন সরাসরি নাম দেবে।</p>', 'Client-side routing-এ একটি নির্দিষ্ট সার্ভার নিয়ম দরকার'),

      h(2, 'Environment Variable', 'environment-variables'),
      p('<p>একটি React অ্যাপে প্রায়ই কনফিগারেশন দরকার যা স্থানীয় development আর প্রোডাকশনের মধ্যে ভিন্ন — উদাহরণস্বরূপ, একটি API URL। এগুলো hardcode করার বদলে হোস্টিং প্ল্যাটফর্মের dashboard-এর মাধ্যমে সেট করা হয়, এই বিভাগে পরে environment-variables-and-secrets পাঠে ঠিকভাবে কভার করা — একটি ডেটাবেস পাসওয়ার্ডের একই অন্তর্নিহিত ধারণা, শুধু একটি ভিন্ন ধরনের মানের জন্য।</p>'),

      h(2, 'এটি আসলে কাজ করেছে কিনা যাচাই করা', 'verifying-it-actually-worked'),
      p('<p>হোমপেজ যাচাই করার বাইরে, বিশেষভাবে একটি ভেতরের route-এ navigate করা আর তারপর সেটিতে ব্রাউজার refresh করা পরীক্ষা করুন — সেই একক কাজটি একজন আসল ভিজিটরের আগে routing বিশেষত্ব ধরার সবচেয়ে নির্ভরযোগ্য উপায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'deploying-a-nodejs-app',
  sortOrder: 28,
  en: {
    title: 'Deploying a Node.js App',
    metaTitle: 'Deploying a Node.js App | Learn Computer Academy',
    metaDescription: 'Why Node.js cannot use traditional shared hosting, and a start-to-finish walkthrough for the two paths that actually work — managed platforms and a VPS.',
    blocks: [
      p('<p>Node.js deployment is genuinely different from every stack covered so far, for the reason established in the choosing-hosting-for-your-stack lesson: a Node.js app typically runs as one continuous, always-on process, not a fresh process started per request the way PHP works — which is exactly what traditional shared hosting cannot accommodate.</p>'),

      h(2, 'Path A — A Managed Node.js Platform (Recommended for Most Students)'),
      p('<p>Platforms built specifically for Node.js hosting handle the "keep the process running" problem for you entirely, using the same Git-based deployment workflow covered earlier in this category:</p><ol><li>Push your Node.js project to a Git repository.</li><li>Connect it to a platform that supports Node.js specifically.</li><li>The platform installs your dependencies (<code>npm install</code>), starts your app, and keeps the process running — restarting it automatically if it ever crashes.</li><li>You get a live URL, with the same free-tier considerations from the free-hosting lessons applying here too.</li></ol>'),

      img(
        'docs/img/hosting/deploy-nodejs-1',
        'Isometric diagram contrasting two paths: on the left, code pushed to a managed platform that keeps a process running automatically with a restart icon; on the right, a terminal window connected via SSH to a VPS running the same process manually',
        1024, 768,
        'Two real paths — let a managed platform keep the process alive, or manage that yourself on a VPS.'
      ),

      h(2, 'Path B — A VPS'),
      p('<p>Running Node.js on your own VPS means genuinely keeping the process alive yourself. A process manager — <b>PM2</b> is the most common choice — handles this specifically: it restarts your app automatically if it crashes, keeps it running after you disconnect from SSH, and starts it again automatically if the whole server reboots.</p>'),
      code('bash', '# Install PM2 once\nnpm install -g pm2\n\n# Start your app through PM2 instead of running it directly\npm2 start server.js\n\n# It now survives you closing the SSH session\npm2 status'),
      p('<p>A VPS also typically needs a <b>reverse proxy</b> (commonly Nginx) sitting in front of the Node.js app — handling incoming traffic on the standard web ports and forwarding it to the port your Node app actually listens on internally. This is a genuinely more involved setup than Path A, appropriate once there\'s a specific reason for the extra control, per the VPS lesson earlier in this category.</p>'),

      h(2, 'Environment Variables and the Database'),
      p('<p>Exactly the same principle as the PHP lesson\'s database credentials: a Node.js app\'s database connection string, API keys, and similar secrets are set as environment variables on the hosting platform, not hardcoded into the source — covered in full in its own lesson later in this category, directly building on this site\'s <a href="/nodejs/">Node.js course</a> material on environment variables.</p>'),

      callout('note', '<p>The port a Node.js app listens on locally during development is often not the port the hosting platform expects in production. Most platforms provide this as an environment variable (commonly named <code>PORT</code>) rather than a fixed number — reading it from <code>process.env.PORT</code>, with a local fallback, is the standard pattern that works correctly in both places.</p>')  ,

      h(2, 'Verifying It Actually Worked'),
      p('<p>Beyond loading the site, specifically check that the process actually stays running after some time has passed — a common Node deployment failure is an app that starts successfully but crashes shortly after on real traffic, which a quick initial check right after deploying won\'t catch.</p>'),
    ],
  },
  bn: {
    title: 'একটি Node.js অ্যাপ Deploy করা',
    metaTitle: 'একটি Node.js অ্যাপ Deploy করা | Learn Computer Academy',
    metaDescription: 'Node.js কেন প্রথাগত shared হোস্টিং ব্যবহার করতে পারে না, আর যে দুটি পথ আসলে কাজ করে তার জন্য একটি শুরু-থেকে-শেষ walkthrough — managed প্ল্যাটফর্ম আর একটি VPS।',
    blocks: [
      p('<p>Node.js deployment এখন পর্যন্ত কভার করা প্রতিটি stack থেকে সত্যিই ভিন্ন, choosing-hosting-for-your-stack পাঠে প্রতিষ্ঠিত কারণে: একটি Node.js অ্যাপ সাধারণত একটি একক, ক্রমাগত, সবসময়-চালু প্রক্রিয়া হিসেবে চলে, PHP যেভাবে কাজ করে সেভাবে প্রতি অনুরোধে শুরু হওয়া একটি নতুন প্রক্রিয়া নয় — যা ঠিক প্রথাগত shared হোস্টিং সামলাতে পারে না।</p>'),

      h(2, 'পথ A — একটি Managed Node.js প্ল্যাটফর্ম (বেশিরভাগ শিক্ষার্থীর জন্য প্রস্তাবিত)', 'path-a-a-managed-nodejs-platform-recommended-for-most-students'),
      p('<p>বিশেষভাবে Node.js হোস্টিংয়ের জন্য তৈরি প্ল্যাটফর্ম "প্রক্রিয়াটি চালু রাখা" সমস্যাটি সম্পূর্ণভাবে আপনার জন্য সামলায়, এই বিভাগে আগে কভার করা একই Git-ভিত্তিক deployment workflow ব্যবহার করে:</p><ol><li>আপনার Node.js প্রোজেক্ট একটি Git repository-তে push করুন।</li><li>বিশেষভাবে Node.js সমর্থন করে এমন একটি প্ল্যাটফর্মের সাথে এটি সংযুক্ত করুন।</li><li>প্ল্যাটফর্মটি আপনার dependency ইনস্টল করে (<code>npm install</code>), আপনার অ্যাপ শুরু করে, আর প্রক্রিয়াটি চালু রাখে — এটি কখনো crash হলে স্বয়ংক্রিয়ভাবে পুনরায় চালু করে।</li><li>আপনি একটি live URL পান, বিনামূল্যের-হোস্টিং পাঠের একই বিনামূল্যের-tier বিবেচনা এখানেও প্রযোজ্য।</li></ol>'),

      img(
        'docs/img/hosting/deploy-nodejs-1',
        'Isometric ডায়াগ্রাম যেখানে দুটি পথের বৈসাদৃশ্য দেখানো হয়েছে: বামে, একটি managed প্ল্যাটফর্মে push করা কোড যা একটি restart আইকনসহ স্বয়ংক্রিয়ভাবে একটি প্রক্রিয়া চালু রাখে; ডানে, SSH-এর মাধ্যমে একটি VPS-এর সাথে সংযুক্ত একটি terminal উইন্ডো যা ম্যানুয়ালি একই প্রক্রিয়া চালাচ্ছে',
        1024, 768,
        'দুটি আসল পথ — একটি managed প্ল্যাটফর্মকে প্রক্রিয়াটি জীবিত রাখতে দিন, বা একটি VPS-এ নিজে এটি পরিচালনা করুন।'
      ),

      h(2, 'পথ B — একটি VPS', 'path-b-a-vps'),
      p('<p>আপনার নিজের VPS-এ Node.js চালানো মানে সত্যিই নিজে প্রক্রিয়াটি জীবিত রাখা। একটি প্রক্রিয়া ম্যানেজার — <b>PM2</b> সবচেয়ে সাধারণ পছন্দ — বিশেষভাবে এটি সামলায়: এটি crash হলে স্বয়ংক্রিয়ভাবে আপনার অ্যাপ পুনরায় চালু করে, আপনি SSH থেকে সংযোগ বিচ্ছিন্ন করার পরেও এটি চালু রাখে, আর পুরো সার্ভার reboot হলে এটি আবার স্বয়ংক্রিয়ভাবে চালু করে।</p>'),
      code('bash', '# একবার PM2 ইনস্টল করুন\nnpm install -g pm2\n\n# সরাসরি চালানোর বদলে PM2-এর মাধ্যমে আপনার অ্যাপ শুরু করুন\npm2 start server.js\n\n# এটি এখন আপনি SSH session বন্ধ করলেও টিকে থাকে\npm2 status'),
      p('<p>একটি VPS-এ সাধারণত Node.js অ্যাপের সামনে বসা একটি <b>reverse proxy</b>-ও দরকার (সাধারণত Nginx) — আদর্শ web port-এ আগত ট্রাফিক সামলানো আর আপনার Node অ্যাপ আসলে অভ্যন্তরীণভাবে যে port-এ শোনে সেখানে ফরওয়ার্ড করা। এটি পথ A-এর চেয়ে সত্যিই একটি বেশি জড়িত সেটআপ, এই বিভাগের আগের VPS পাঠ অনুযায়ী অতিরিক্ত নিয়ন্ত্রণের একটি নির্দিষ্ট কারণ থাকলে উপযুক্ত।</p>'),

      h(2, 'Environment Variable আর ডেটাবেস', 'environment-variables-and-the-database'),
      p('<p>PHP পাঠের ডেটাবেস credentials-এর ঠিক একই নীতি: একটি Node.js অ্যাপের ডেটাবেস সংযোগ স্ট্রিং, API key, আর একই ধরনের secret হোস্টিং প্ল্যাটফর্মে environment variable হিসেবে সেট করা হয়, সোর্সে hardcode করা নয় — এই বিভাগে পরে নিজস্ব একটি পাঠে সম্পূর্ণভাবে কভার করা, এই সাইটের <a href="/bn/nodejs/">Node.js কোর্সের</a> environment variable-এর উপাদানের উপর সরাসরি গড়ে ওঠা।</p>'),

      callout('note', '<p>Development-এর সময় একটি Node.js অ্যাপ স্থানীয়ভাবে যে port-এ শোনে তা প্রায়ই প্রোডাকশনে হোস্টিং প্ল্যাটফর্ম যে port আশা করে তা নয়। বেশিরভাগ প্ল্যাটফর্ম এটি একটি নির্দিষ্ট সংখ্যার বদলে একটি environment variable হিসেবে দেয় (সাধারণত <code>PORT</code> নামে) — একটি স্থানীয় fallback সহ <code>process.env.PORT</code> থেকে এটি পড়া আদর্শ প্যাটার্ন যা দুই জায়গাতেই সঠিকভাবে কাজ করে।</p>'),

      h(2, 'এটি আসলে কাজ করেছে কিনা যাচাই করা', 'verifying-it-actually-worked'),
      p('<p>সাইট লোড হওয়ার বাইরে, বিশেষভাবে যাচাই করুন কিছু সময় পার হওয়ার পরও প্রক্রিয়াটি আসলে চলতে থাকে কিনা — একটি সাধারণ Node deployment ব্যর্থতা হলো একটি অ্যাপ যা সফলভাবে শুরু হয় কিন্তু আসল ট্রাফিকে কিছুক্ষণ পরে crash করে, যা deploy করার ঠিক পরে একটি দ্রুত প্রাথমিক যাচাই ধরবে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'what-a-cdn-is',
  sortOrder: 29,
  en: {
    title: 'What a CDN Is',
    metaTitle: 'What a CDN Is and Why Geography Matters | Learn Computer Academy',
    metaDescription: 'A single server is physically far from most of your visitors, and distance costs real time. A CDN solves this by copying your content to many locations at once.',
    blocks: [
      p('<p>Every hosting type covered so far has one thing in common: your site lives on a server in one physical location. A <b>CDN</b> (content delivery network) addresses a real, physical consequence of that fact — distance costs time.</p>'),

      h(2, 'Why Physical Distance Actually Matters'),
      p('<p>Data travels over real cables and real infrastructure, at a real, finite speed. A visitor in Kolkata loading a site hosted on a server in the United States genuinely waits longer for the first byte to arrive than a visitor physically near that server does — not because of anything wrong with the code, purely because of the physical distance the request and response have to travel, twice, round trip.</p>'),

      h(2, 'What a CDN Actually Does'),
      p('<p>A CDN keeps copies of your content on servers spread across many physical locations worldwide — commonly called <b>edge locations</b> or points of presence. When someone visits your site, they are automatically served from whichever copy is physically nearest to them, rather than always reaching back to your one original server.</p>'),

      img(
        'docs/img/hosting/cdn-concept-1',
        'Isometric world map diagram showing one origin server in one location, with several smaller edge server icons distributed across different continents, each connected to nearby visitor icons with short lines instead of one long line back to the origin',
        1024, 768,
        'The same content, copied to many locations — each visitor reaches the nearest one, not the one original server.'
      ),

      h(2, 'What Actually Gets Sped Up'),
      p('<p>CDNs are most effective for content that does not change per visitor — images, CSS, JavaScript, fonts, and entire static sites, all covered in the static-hosting lesson earlier in this category. This is exactly why a static site is so naturally suited to CDN distribution: with nothing that needs to be computed per request, there is nothing stopping every edge location from holding an identical, ready-to-serve copy.</p>'),

      h(2, 'Beyond Raw Speed'),
      p('<p>A CDN also absorbs a meaningful share of traffic before it ever reaches your actual server — genuinely useful during a sudden traffic spike, and a real, if partial, layer of protection against certain kinds of malicious traffic floods, since the origin server never sees most of it directly.</p>'),

      callout('note', '<p>This connects directly to the SEO course\'s page-speed lesson: <b>LCP</b> (Largest Contentful Paint), one of the three Core Web Vitals, is measured from the moment a request starts — and physical distance to the server is one of the concrete, fixable things that affects it. A CDN is one of the most direct available fixes for a slow LCP caused by geography rather than code.</p>'),

      h(2, 'Where This Goes Next'),
      p('<p>The next lesson covers the practical side: how a CDN actually gets put in front of existing hosting, and why it is very often free.</p>'),
    ],
  },
  bn: {
    title: 'একটি CDN কী',
    metaTitle: 'একটি CDN কী আর ভূগোল কেন গুরুত্বপূর্ণ | Learn Computer Academy',
    metaDescription: 'একটি একক সার্ভার আপনার বেশিরভাগ ভিজিটরের কাছ থেকে ভৌতভাবে দূরে, আর দূরত্বে আসল সময় খরচ হয়। একটি CDN আপনার কন্টেন্ট একসাথে অনেক জায়গায় কপি করে এটি সমাধান করে।',
    blocks: [
      p('<p>এখন পর্যন্ত কভার করা প্রতিটি হোস্টিং ধরনের একটি সাধারণ বিষয় আছে: আপনার সাইট একটি ভৌত অবস্থানে একটি সার্ভারে থাকে। একটি <b>CDN</b> (content delivery network) সেই তথ্যের একটি আসল, ভৌত পরিণতি সমাধান করে — দূরত্বে সময় খরচ হয়।</p>'),

      h(2, 'ভৌত দূরত্ব আসলে কেন গুরুত্বপূর্ণ', 'why-physical-distance-actually-matters'),
      p('<p>ডেটা আসল cable আর আসল অবকাঠামোর উপর দিয়ে, একটি আসল, সীমিত গতিতে ভ্রমণ করে। যুক্তরাষ্ট্রে একটি সার্ভারে host করা একটি সাইট লোড করা কলকাতার একজন ভিজিটর সেই সার্ভারের ভৌতভাবে কাছের একজন ভিজিটরের চেয়ে সত্যিই প্রথম byte পৌঁছানোর জন্য বেশি অপেক্ষা করেন — কোডে কোনো ভুলের কারণে নয়, শুধু ভৌত দূরত্বের কারণে যা অনুরোধ আর রেসপন্সকে দুবার, round trip-এ ভ্রমণ করতে হয়।</p>'),

      h(2, 'একটি CDN আসলে কী করে', 'what-a-cdn-actually-does'),
      p('<p>একটি CDN বিশ্বজুড়ে অনেক ভৌত অবস্থানে ছড়িয়ে থাকা সার্ভারে আপনার কন্টেন্টের কপি রাখে — সাধারণত <b>edge location</b> বা points of presence বলা হয়। কেউ আপনার সাইট ভিজিট করলে, সবসময় আপনার একক আসল সার্ভারে ফিরে না গিয়ে, তাদের ভৌতভাবে সবচেয়ে কাছের কপি থেকে তারা স্বয়ংক্রিয়ভাবে সেবা পান।</p>'),

      img(
        'docs/img/hosting/cdn-concept-1',
        'Isometric বিশ্ব মানচিত্র ডায়াগ্রাম যেখানে একটি অবস্থানে একটি origin সার্ভার দেখানো হয়েছে, বিভিন্ন মহাদেশ জুড়ে বিতরণ করা কয়েকটি ছোট edge সার্ভার আইকনসহ, প্রতিটি origin-এ ফিরে যাওয়া একটি লম্বা লাইনের বদলে কাছের ভিজিটর আইকনের সাথে ছোট লাইনে সংযুক্ত',
        1024, 768,
        'একই কন্টেন্ট, অনেক অবস্থানে কপি করা — প্রতিটি ভিজিটর সবচেয়ে কাছেরটিতে পৌঁছায়, একক আসল সার্ভারে নয়।'
      ),

      h(2, 'আসলে কী দ্রুত হয়', 'what-actually-gets-sped-up'),
      p('<p>CDN প্রতি ভিজিটরে বদলায় না এমন কন্টেন্টের জন্য সবচেয়ে কার্যকর — ছবি, CSS, JavaScript, font, আর সম্পূর্ণ static সাইট, সবই এই বিভাগে আগে static-হোস্টিং পাঠে কভার করা। এই কারণেই একটি static সাইট CDN বিতরণের জন্য এত স্বাভাবিকভাবে উপযোগী: প্রতি অনুরোধে গণনা করার মতো কিছু না থাকায়, প্রতিটি edge অবস্থানকে একটি অভিন্ন, পরিবেশনের জন্য প্রস্তুত কপি রাখা থেকে কিছুই থামায় না।</p>'),

      h(2, 'কাঁচা গতির বাইরে', 'beyond-raw-speed'),
      p('<p>একটি CDN আপনার আসল সার্ভারে পৌঁছানোর আগেই ট্রাফিকের একটি অর্থপূর্ণ অংশও শোষণ করে — একটি হঠাৎ ট্রাফিক spike-এর সময় সত্যিই কাজের, আর কিছু ধরনের ক্ষতিকর ট্রাফিক বন্যার বিরুদ্ধে একটি আসল, যদিও আংশিক, সুরক্ষার স্তর, কারণ origin সার্ভার এর বেশিরভাগ সরাসরি কখনো দেখে না।</p>'),

      callout('note', '<p>এটি সরাসরি SEO কোর্সের page-speed পাঠের সাথে সংযুক্ত: তিনটি Core Web Vitals-এর একটি <b>LCP</b> (Largest Contentful Paint), একটি অনুরোধ শুরু হওয়ার মুহূর্ত থেকে মাপা হয় — আর সার্ভারের ভৌত দূরত্ব এমন একটি সুনির্দিষ্ট, ঠিক করার যোগ্য জিনিস যা এটিকে প্রভাবিত করে। কোডের বদলে ভূগোলের কারণে সৃষ্ট একটি ধীর LCP-এর জন্য একটি CDN সবচেয়ে সরাসরি উপলব্ধ সমাধানগুলোর একটি।</p>'),

      h(2, 'এটি এরপর কোথায় যায়', 'where-this-goes-next'),
      p('<p>পরের পাঠ ব্যবহারিক দিক কভার করে: একটি CDN আসলে কীভাবে বিদ্যমান হোস্টিংয়ের সামনে বসানো হয়, আর কেন এটি প্রায়ই বিনামূল্যে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'cdn-in-front-of-your-hosting',
  sortOrder: 30,
  en: {
    title: 'Putting a CDN in Front of Your Hosting',
    metaTitle: 'Putting a CDN in Front of Your Hosting | Learn Computer Academy',
    metaDescription: 'A free CDN in front of cheap hosting often outperforms expensive hosting alone. The practical mechanics of adding one, and what to check afterward.',
    blocks: [
      p('<p>Adding a CDN does not usually mean replacing your hosting — it means placing a CDN in front of the hosting you already have, so that it handles serving your content while your original server becomes the backup source it occasionally checks in with.</p>'),

      h(2, 'The Practical Mechanics'),
      p('<p>Setting one up commonly follows one of two patterns: DNS-level (the most common for a standalone CDN service — you change your domain\'s nameservers, per the connecting-a-domain lesson, to the CDN provider\'s, and it sits transparently between every visitor and your actual server), or built-in (many cloud and static hosting platforms, covered earlier, include a CDN automatically by default, with nothing separate to configure at all).</p>'),

      img(
        'docs/img/hosting/cdn-setup-1',
        'Isometric diagram showing a visitor icon connecting to a nearby CDN edge server, which is shown checking back to a single origin server icon only occasionally, with most requests served directly from the edge',
        1024, 768,
        'The CDN serves most requests directly from the edge, only checking back to your original server when it needs to.'
      ),

      h(2, 'Caching, and What It Means for Updates'),
      p('<p>A CDN stores a copy of your content and serves that copy for a period of time before checking your original server again — this is <b>caching</b>, and it is exactly why a CDN is fast: most requests never have to travel back to the original server at all. The trade-off is that a change to your site does not appear everywhere instantly — cached copies at each edge location need to expire or be manually cleared, a step usually called a <b>purge</b> or <b>cache invalidation</b>, offered as a button or an API call in most CDN dashboards.</p>'),

      callout('tip', '<p>After updating a site sitting behind a CDN and not seeing the change, check for a stale cached copy before assuming the deployment itself failed — a manual purge, where the platform offers one, resolves this immediately, and is a genuinely common step to forget.</p>'),

      h(2, 'The Real Cost Argument'),
      p('<p>This is where the "cheap hosting plus a free CDN" combination genuinely earns its place: most of your traffic\'s bandwidth and server load moves to the CDN\'s edge network, which frequently means a modest, inexpensive hosting plan can comfortably serve a much larger audience than it could unassisted — often outperforming a considerably more expensive hosting plan running with no CDN at all.</p>'),

      h(2, 'What a CDN Does Not Fix'),
      p('<p>A CDN speeds up delivering content, but it cannot speed up a slow database query or inefficient server-side logic — those still run entirely on your original server, on every single request that reaches it, exactly as before. A CDN complements good backend performance; it does not replace the need for it.</p>'),
    ],
  },
  bn: {
    title: 'আপনার হোস্টিংয়ের সামনে একটি CDN বসানো',
    metaTitle: 'আপনার হোস্টিংয়ের সামনে একটি CDN বসানো | Learn Computer Academy',
    metaDescription: 'সস্তা হোস্টিংয়ের সামনে একটি বিনামূল্যের CDN প্রায়ই একা ব্যয়বহুল হোস্টিংকে হারায়। একটি যোগ করার ব্যবহারিক প্রক্রিয়া, আর পরে কী যাচাই করবেন।',
    blocks: [
      p('<p>একটি CDN যোগ করা সাধারণত আপনার হোস্টিং প্রতিস্থাপন বোঝায় না — এর অর্থ আপনার ইতিমধ্যে থাকা হোস্টিংয়ের সামনে একটি CDN বসানো, যাতে এটি আপনার কন্টেন্ট পরিবেশন সামলায় যখন আপনার আসল সার্ভারটি backup উৎস হয়ে ওঠে যা এটি মাঝে মাঝে যাচাই করে।</p>'),

      h(2, 'ব্যবহারিক প্রক্রিয়া', 'the-practical-mechanics'),
      p('<p>একটি সেট আপ করা সাধারণত দুটি প্যাটার্নের একটি অনুসরণ করে: DNS-স্তর (একটি স্বতন্ত্র CDN সেবার জন্য সবচেয়ে সাধারণ — connecting-a-domain পাঠ অনুযায়ী, আপনি আপনার ডোমেইনের nameserver CDN প্রদানকারীরটিতে বদলান, আর এটি প্রতিটি ভিজিটর আর আপনার আসল সার্ভারের মধ্যে স্বচ্ছভাবে বসে), বা built-in (আগে কভার করা অনেক cloud আর static হোস্টিং প্ল্যাটফর্ম ডিফল্টভাবে স্বয়ংক্রিয়ভাবে একটি CDN অন্তর্ভুক্ত করে, আলাদাভাবে কনফিগার করার কিছুই নেই)।</p>'),

      img(
        'docs/img/hosting/cdn-setup-1',
        'Isometric ডায়াগ্রাম যেখানে একটি ভিজিটর আইকন কাছের একটি CDN edge সার্ভারে সংযুক্ত হচ্ছে দেখানো হয়েছে, যা শুধু মাঝে মাঝে একটি একক origin সার্ভার আইকনে ফিরে যাচাই করছে দেখানো হয়েছে, বেশিরভাগ অনুরোধ সরাসরি edge থেকে পরিবেশিত',
        1024, 768,
        'CDN বেশিরভাগ অনুরোধ সরাসরি edge থেকে পরিবেশন করে, শুধু প্রয়োজন হলে আপনার আসল সার্ভারে ফিরে যাচাই করে।'
      ),

      h(2, 'Caching, আর আপডেটের জন্য এর অর্থ কী', 'caching-and-what-it-means-for-updates'),
      p('<p>একটি CDN আপনার কন্টেন্টের একটি কপি সংরক্ষণ করে আর আপনার আসল সার্ভার আবার যাচাই করার আগে কিছু সময় সেই কপি পরিবেশন করে — এটি <b>caching</b>, আর এটিই ঠিক কারণ একটি CDN দ্রুত: বেশিরভাগ অনুরোধ আসল সার্ভারে একেবারেই ফিরে যাওয়ার প্রয়োজন হয় না। বিনিময়টি হলো আপনার সাইটে একটি পরিবর্তন সর্বত্র সাথে সাথে দেখা যায় না — প্রতিটি edge অবস্থানে ক্যাশ করা কপির মেয়াদ শেষ হতে হবে বা ম্যানুয়ালি পরিষ্কার করতে হবে, সাধারণত একটি <b>purge</b> বা <b>cache invalidation</b> বলা একটি ধাপ, বেশিরভাগ CDN dashboard-এ একটি বোতাম বা একটি API কল হিসেবে দেওয়া।</p>'),

      callout('tip', '<p>একটি CDN-এর পেছনে বসা একটি সাইট আপডেট করার পরে আর পরিবর্তনটি না দেখলে, deployment নিজেই ব্যর্থ হয়েছে ধরে নেওয়ার আগে একটি বাসি ক্যাশ করা কপির জন্য যাচাই করুন — প্ল্যাটফর্মটি একটি দিলে একটি ম্যানুয়াল purge সাথে সাথে এটি সমাধান করে, আর ভুলে যাওয়ার মতো সত্যিই একটি সাধারণ ধাপ।</p>'),

      h(2, 'আসল খরচের যুক্তি', 'the-real-cost-argument'),
      p('<p>এখানেই "সস্তা হোস্টিং সাথে একটি বিনামূল্যের CDN" সমন্বয় সত্যিই তার জায়গা অর্জন করে: আপনার ট্রাফিকের বেশিরভাগ bandwidth আর সার্ভার লোড CDN-এর edge নেটওয়ার্কে সরে যায়, যা প্রায়ই মানে একটি মাঝারি, সস্তা হোস্টিং পরিকল্পনা সহায়তা ছাড়া সম্ভবের চেয়ে অনেক বড় দর্শককে স্বাচ্ছন্দ্যে সেবা দিতে পারে — প্রায়ই একেবারে কোনো CDN ছাড়া চলা যথেষ্ট বেশি ব্যয়বহুল একটি হোস্টিং পরিকল্পনাকে হারায়।</p>'),

      h(2, 'একটি CDN যা ঠিক করে না', 'what-a-cdn-does-not-fix'),
      p('<p>একটি CDN কন্টেন্ট পৌঁছানো দ্রুত করে, কিন্তু এটি একটি ধীর ডেটাবেস কোয়েরি বা অদক্ষ server-side লজিক দ্রুত করতে পারে না — সেগুলো এখনো সম্পূর্ণভাবে আপনার আসল সার্ভারে চলে, এটিতে পৌঁছানো প্রতিটি একক অনুরোধে, ঠিক আগের মতো। একটি CDN ভালো backend পারফরম্যান্সের পরিপূরক; এর প্রয়োজনীয়তা প্রতিস্থাপন করে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'edge-and-serverless',
  sortOrder: 31,
  en: {
    title: 'Edge and Serverless',
    metaTitle: 'Edge and Serverless Hosting Explained | Learn Computer Academy',
    metaDescription: 'What platforms actually mean by "the edge" and "serverless" when they describe modern hosting, and why this is how most new React and Node.js hosting works today.',
    blocks: [
      p('<p>"The edge" and "serverless" are two of the most overused, least-explained terms in modern hosting marketing. Both describe real, useful ideas — this lesson is what the marketing usually skips.</p>'),

      h(2, 'Serverless — Not Actually Serverless'),
      p('<p>"Serverless" does not mean no server is involved — one always is. It means <i>you</i> never provision, configure, or maintain that server yourself. You write a function; the platform runs it, on infrastructure it manages entirely, only when a request actually needs it, and automatically stops running it when the request is done.</p>'),

      h(2, 'How This Differs From What Came Before'),
      table(
        ['Model', 'How it runs', 'You pay for'],
        [
          ['Traditional server (VPS, shared)', 'Continuously, whether or not anyone is visiting', 'Time — a fixed period, regardless of use'],
          ['Serverless function', 'Only while actively handling a specific request', 'Usage — roughly how often and how long your code actually ran'],
        ]
      ),
      p('<p>This is precisely why serverless free tiers can be so generous for a low-traffic project — per the free-hosting lesson, a function that runs rarely costs the provider very little to offer for free, since it consumes real resources only in short bursts, not continuously.</p>'),

      h(2, 'The Edge, Specifically'),
      p('<p>"The edge" extends the CDN idea from the previous two lessons beyond just static files: instead of running your server-side code in one central location, some platforms can now run small pieces of it directly at those same distributed edge locations, physically close to each visitor — reducing not just static-content delivery time, but the time some server-side logic itself takes to run.</p>'),

      img(
        'docs/img/hosting/edge-serverless-1',
        'Isometric diagram showing small function icons distributed across several edge locations on a world map, each one activating briefly only when a nearby visitor icon sends a request, then disappearing',
        1024, 768,
        'Small pieces of code, running briefly and only when needed, physically close to whoever triggered them.'
      ),

      h(2, 'Where This Connects to This Site\'s Courses'),
      p('<p>This is exactly the model most modern React/Next.js hosting is built around — this site itself runs this way, and the deploying-a-react-app lesson\'s Git-push-to-live workflow is the practical surface of this underlying architecture. It is also increasingly common for Node.js APIs specifically suited to short, independent operations, as an alternative to the always-on VPS process model covered in the deploying-a-node.js-app lesson.</p>'),

      callout('note', '<p>Not everything fits this model well. A serverless function that needs to finish within a short time limit is a poor fit for a long-running task — video processing, a large batch job — and a traditional always-on server (a VPS, or a managed platform explicitly built for continuous processes) remains the better choice there. This is a genuine trade-off, not a strictly newer-is-better upgrade path.</p>'),

      h(2, 'The Practical Takeaway'),
      p('<p>For a typical student project — a portfolio, a small API, a React app — edge and serverless hosting is very often the default you land on simply by using a modern cloud platform, without needing to understand the underlying mechanics deeply to benefit from it. Understanding what these terms actually mean mostly helps you read a platform\'s pricing and documentation with real comprehension, rather than choosing based on the word alone.</p>'),
    ],
  },
  bn: {
    title: 'Edge আর Serverless',
    metaTitle: 'Edge আর Serverless হোস্টিং ব্যাখ্যা | Learn Computer Academy',
    metaDescription: 'আধুনিক হোস্টিং বর্ণনা করার সময় প্ল্যাটফর্ম "the edge" আর "serverless" দিয়ে আসলে কী বোঝায়, আর কেন বেশিরভাগ নতুন React আর Node.js হোস্টিং আজ এভাবে কাজ করে।',
    blocks: [
      p('<p>"The edge" আর "serverless" আধুনিক হোস্টিং মার্কেটিংয়ে সবচেয়ে বেশি ব্যবহৃত, সবচেয়ে কম ব্যাখ্যা করা term-গুলোর দুটি। দুটোই আসল, কাজের ধারণা বর্ণনা করে — এই পাঠটি হলো যা মার্কেটিং সাধারণত বাদ দেয়।</p>'),

      h(2, 'Serverless — আসলে Serverless নয়', 'serverless-not-actually-serverless'),
      p('<p>"Serverless"-এর অর্থ কোনো সার্ভার জড়িত নয় তা নয় — একটি সবসময় থাকে। এর অর্থ <i>আপনি</i> কখনো নিজে সেই সার্ভার সরবরাহ, কনফিগার, বা রক্ষণাবেক্ষণ করেন না। আপনি একটি function লেখেন; প্ল্যাটফর্মটি এটি চালায়, সম্পূর্ণভাবে এটি পরিচালনা করা অবকাঠামোতে, শুধু একটি অনুরোধ আসলে এটি দরকার হলে, আর অনুরোধ শেষ হলে স্বয়ংক্রিয়ভাবে এটি চালানো বন্ধ করে।</p>'),

      h(2, 'এটি আগের থেকে কীভাবে ভিন্ন', 'how-this-differs-from-what-came-before'),
      table(
        ['মডেল', 'এটি কীভাবে চলে', 'আপনি যার জন্য টাকা দেন'],
        [
          ['প্রথাগত সার্ভার (VPS, shared)', 'ক্রমাগত, কেউ ভিজিট করুক বা না করুক', 'সময় — একটি নির্দিষ্ট সময়কাল, ব্যবহার নির্বিশেষে'],
          ['Serverless function', 'শুধু সক্রিয়ভাবে একটি নির্দিষ্ট অনুরোধ সামলানোর সময়', 'ব্যবহার — মোটামুটি আপনার কোড আসলে কত ঘন ঘন আর কতক্ষণ চলেছে'],
        ]
      ),
      p('<p>এই কারণেই serverless বিনামূল্যের tier একটি কম-ট্রাফিক প্রোজেক্টের জন্য এত উদার হতে পারে — বিনামূল্যের-হোস্টিং পাঠ অনুযায়ী, কদাচিৎ চলা একটি function বিনামূল্যে দিতে প্রদানকারীর খুব কম খরচ হয়, কারণ এটি ক্রমাগত নয়, শুধু ছোট বিস্ফোরণে আসল রিসোর্স ব্যবহার করে।</p>'),

      h(2, 'বিশেষভাবে Edge', 'the-edge-specifically'),
      p('<p>"The edge" আগের দুই পাঠের CDN ধারণাকে শুধু static ফাইলের বাইরে বিস্তৃত করে: একটি কেন্দ্রীয় অবস্থানে আপনার server-side কোড চালানোর বদলে, কিছু প্ল্যাটফর্ম এখন এর ছোট অংশ সরাসরি সেই একই বিতরণ করা edge অবস্থানে চালাতে পারে, প্রতিটি ভিজিটরের ভৌতভাবে কাছে — শুধু static-কন্টেন্ট পৌঁছানোর সময় নয়, কিছু server-side লজিক নিজে চলতে যে সময় নেয় তাও কমায়।</p>'),

      img(
        'docs/img/hosting/edge-serverless-1',
        'Isometric ডায়াগ্রাম যেখানে একটি বিশ্ব মানচিত্রে কয়েকটি edge অবস্থান জুড়ে ছোট function আইকন বিতরণ করা দেখানো হয়েছে, প্রতিটি শুধু কাছের একটি ভিজিটর আইকন একটি অনুরোধ পাঠালে সংক্ষেপে সক্রিয় হয়, তারপর অদৃশ্য হয়ে যায়',
        1024, 768,
        'কোডের ছোট অংশ, সংক্ষেপে আর শুধু প্রয়োজন হলে চলে, যে কেউ এটি চালু করেছে তার ভৌতভাবে কাছে।'
      ),

      h(2, 'এটি এই সাইটের কোর্সের সাথে কোথায় সংযুক্ত', 'where-this-connects-to-this-sites-courses'),
      p('<p>এটি ঠিক সেই মডেল যার চারপাশে বেশিরভাগ আধুনিক React/Next.js হোস্টিং তৈরি — এই সাইট নিজেই এভাবে চলে, আর deploying-a-react-app পাঠের Git-push-to-live workflow এই অন্তর্নিহিত স্থাপত্যের ব্যবহারিক পৃষ্ঠতল। এটি বিশেষভাবে ছোট, স্বাধীন অপারেশনের জন্য উপযুক্ত Node.js API-এর জন্যও ক্রমবর্ধমানভাবে সাধারণ, deploying-a-nodejs-app পাঠে কভার করা সবসময়-চালু VPS প্রক্রিয়া মডেলের একটি বিকল্প হিসেবে।</p>'),

      callout('note', '<p>সবকিছু এই মডেলে ভালোভাবে মানানসই নয়। একটি সংক্ষিপ্ত সময় সীমার মধ্যে শেষ করতে হবে এমন একটি serverless function একটি দীর্ঘ-চলমান কাজের জন্য একটি খারাপ মিল — ভিডিও প্রসেসিং, একটি বড় batch কাজ — আর একটি প্রথাগত সবসময়-চালু সার্ভার (একটি VPS, বা ক্রমাগত প্রক্রিয়ার জন্য স্পষ্টভাবে তৈরি একটি managed প্ল্যাটফর্ম) সেখানে ভালো পছন্দ থেকে যায়। এটি একটি আসল বিনিময়, কঠোরভাবে নতুন-মানে-ভালো একটি আপগ্রেড পথ নয়।</p>'),

      h(2, 'ব্যবহারিক শিক্ষা', 'the-practical-takeaway'),
      p('<p>একটি সাধারণ শিক্ষার্থী প্রোজেক্টের জন্য — একটি portfolio, একটি ছোট API, একটি React অ্যাপ — একটি আধুনিক cloud প্ল্যাটফর্ম ব্যবহার করেই edge আর serverless হোস্টিং প্রায়ই সেই ডিফল্ট যেখানে আপনি পৌঁছান, এর থেকে উপকৃত হতে অন্তর্নিহিত প্রক্রিয়া গভীরভাবে বোঝার প্রয়োজন ছাড়াই। এই term-গুলো আসলে কী বোঝায় তা বোঝা বেশিরভাগ আপনাকে একটি প্ল্যাটফর্মের দাম আর ডকুমেন্টেশন আসল বোঝাপড়া নিয়ে পড়তে সাহায্য করে, শুধু শব্দের ভিত্তিতে বাছার বদলে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'https-and-ssl-certificates',
  sortOrder: 32,
  en: {
    title: 'HTTPS and SSL Certificates',
    metaTitle: 'HTTPS and SSL Certificates Explained | Learn Computer Academy',
    metaDescription: 'What actually happens when a site uses HTTPS, why it is now essentially mandatory, and how to actually get a certificate — usually for free.',
    blocks: [
      p('<p>This site\'s <a href="/seo/">SEO course</a> already covers HTTPS as a baseline requirement. This lesson covers the hosting side directly: what a certificate actually is, and how to get one onto your own server.</p>'),

      h(2, 'What HTTPS Actually Does'),
      p('<p>Plain HTTP sends everything — including anything typed into a form — as readable plain text, visible to anything positioned between the browser and the server. <b>HTTPS</b> encrypts that connection, so the content is unreadable to anyone intercepting it in between, even though it still travels over the same network path.</p>'),

      h(2, 'What a Certificate Actually Is'),
      p('<p>An <b>SSL/TLS certificate</b> (the terms are used interchangeably in casual conversation; TLS is the modern, correct name for what most people still call SSL) is a small file, issued by a trusted <b>certificate authority</b>, that proves a server genuinely controls the domain it claims to represent, and enables the encryption itself.</p>'),

      img(
        'docs/img/hosting/https-1',
        'Isometric diagram showing a browser and a server connected by a line, with a padlock icon on the connection representing HTTPS encryption, contrasted with an open unlocked padlock on a separate plain HTTP connection',
        1024, 768,
        'A certificate proves identity and enables encryption — the padlock browsers show is this working correctly.'
      ),

      h(2, 'Getting One — Usually Free Today'),
      p('<p><b>Let\'s Encrypt</b> issues certificates at no cost, and most hosting control panels integrate it directly — often a single toggle, with automatic renewal handled entirely behind the scenes. There is no longer a real cost argument for a site running on plain HTTP. Most cloud and managed platforms covered earlier in this category provision HTTPS automatically for any domain you connect, with no separate step at all.</p>'),

      h(2, 'Why This Is No Longer Optional'),
      p('<p>Browsers now mark plain-HTTP pages as "Not Secure" directly in the address bar, and some browser features (camera and location access, service workers, among others) are simply unavailable without HTTPS. Combined with the SEO course\'s point that HTTPS is a baseline ranking signal, this is a case where there is genuinely no remaining reason to skip it — every hosting type covered in this category supports it, usually for free.</p>'),

      h(2, 'A Common Migration Mistake'),
      callout('warning', '<p>Enabling HTTPS without also redirecting the old plain-HTTP version to it leaves both versions of your site live at once — a duplicate that confuses search engines and splits any accumulated ranking signals between two addresses. A permanent (301) redirect from <code>http://</code> to <code>https://</code> is a required companion step, not an optional extra, every time HTTPS is turned on for an existing site.</p>', 'Redirect HTTP to HTTPS, always')  ,

      h(2, 'Certificate Renewal'),
      p('<p>Certificates expire, typically after a period of months, specifically so a compromised or outdated one cannot remain trusted indefinitely. Modern free certificate services renew automatically with no action from you; if using an older manual process, an expired certificate is a real, visible failure — visitors see a security warning rather than a working site, so tracking renewal dates matters if this isn\'t automated for you.</p>'),
    ],
  },
  bn: {
    title: 'HTTPS আর SSL সার্টিফিকেট',
    metaTitle: 'HTTPS আর SSL সার্টিফিকেট ব্যাখ্যা | Learn Computer Academy',
    metaDescription: 'একটি সাইট HTTPS ব্যবহার করলে আসলে কী ঘটে, এটি এখন মূলত বাধ্যতামূলক কেন, আর একটি সার্টিফিকেট আসলে কীভাবে পাবেন — সাধারণত বিনামূল্যে।',
    blocks: [
      p('<p>এই সাইটের <a href="/bn/seo/">SEO কোর্স</a> ইতিমধ্যে একটি ভিত্তিগত প্রয়োজনীয়তা হিসেবে HTTPS কভার করে। এই পাঠ সরাসরি হোস্টিং দিক কভার করে: একটি সার্টিফিকেট আসলে কী, আর আপনার নিজের সার্ভারে কীভাবে একটি পাবেন।</p>'),

      h(2, 'HTTPS আসলে কী করে', 'what-https-actually-does'),
      p('<p>সাধারণ HTTP সবকিছু — একটি form-এ টাইপ করা যেকোনো কিছুসহ — পড়ার যোগ্য সাধারণ টেক্সট হিসেবে পাঠায়, ব্রাউজার আর সার্ভারের মাঝখানে অবস্থিত যেকোনো কিছুর কাছে দৃশ্যমান। <b>HTTPS</b> সেই সংযোগ এনক্রিপ্ট করে, তাই মাঝখানে আটকানো যে কারো কাছে কন্টেন্টটি অপঠনযোগ্য, এটি একই নেটওয়ার্ক পথে ভ্রমণ করলেও।</p>'),

      h(2, 'একটি সার্টিফিকেট আসলে কী', 'what-a-certificate-actually-is'),
      p('<p>একটি <b>SSL/TLS সার্টিফিকেট</b> (নৈমিত্তিক কথোপকথনে term-গুলো বিনিময়যোগ্যভাবে ব্যবহৃত; TLS বেশিরভাগ মানুষ এখনো SSL বলে যা তার আধুনিক, সঠিক নাম) হলো একটি ছোট ফাইল, একটি বিশ্বস্ত <b>certificate authority</b> দ্বারা ইস্যু করা, যা প্রমাণ করে একটি সার্ভার আসলেই সেই ডোমেইন নিয়ন্ত্রণ করে যা এটি প্রতিনিধিত্ব করার দাবি করে, আর এনক্রিপশন নিজেই সক্ষম করে।</p>'),

      img(
        'docs/img/hosting/https-1',
        'Isometric ডায়াগ্রাম যেখানে একটি লাইন দিয়ে সংযুক্ত একটি ব্রাউজার আর একটি সার্ভার দেখানো হয়েছে, সংযোগে HTTPS এনক্রিপশন প্রতিনিধিত্বকারী একটি padlock আইকনসহ, একটি আলাদা সাধারণ HTTP সংযোগে একটি খোলা unlocked padlock-এর বিপরীতে',
        1024, 768,
        'একটি সার্টিফিকেট পরিচয় প্রমাণ করে আর এনক্রিপশন সক্ষম করে — ব্রাউজার যে padlock দেখায় তা এটি সঠিকভাবে কাজ করছে।'
      ),

      h(2, 'একটি পাওয়া — আজ সাধারণত বিনামূল্যে', 'getting-one-usually-free-today'),
      p('<p><b>Let\'s Encrypt</b> বিনা খরচে সার্টিফিকেট ইস্যু করে, আর বেশিরভাগ হোস্টিং control panel সরাসরি এটি একীভূত করে — প্রায়ই একটি একক toggle, স্বয়ংক্রিয় renewal সম্পূর্ণভাবে পর্দার পেছনে সামলানো। সাধারণ HTTP-তে চলা একটি সাইটের আর কোনো আসল খরচের যুক্তি নেই। এই বিভাগে আগে কভার করা বেশিরভাগ cloud আর managed প্ল্যাটফর্ম আপনার সংযুক্ত করা যেকোনো ডোমেইনের জন্য স্বয়ংক্রিয়ভাবে HTTPS সরবরাহ করে, একেবারেই কোনো আলাদা ধাপ ছাড়া।</p>'),

      h(2, 'এটি কেন আর ঐচ্ছিক নয়', 'why-this-is-no-longer-optional'),
      p('<p>ব্রাউজার এখন সরাসরি ঠিকানা বারে সাধারণ-HTTP পাতাগুলো "Not Secure" চিহ্নিত করে, আর কিছু ব্রাউজার ফিচার (ক্যামেরা আর অবস্থান প্রবেশাধিকার, service worker, অন্যদের মধ্যে) HTTPS ছাড়া সহজভাবে অনুপলব্ধ। SEO কোর্সের বিষয়ের সাথে মিলিয়ে যে HTTPS একটি ভিত্তিগত ranking সংকেত, এটি এমন একটি ক্ষেত্র যেখানে এটি বাদ দেওয়ার সত্যিই কোনো অবশিষ্ট কারণ নেই — এই বিভাগে কভার করা প্রতিটি হোস্টিং ধরন এটি সমর্থন করে, সাধারণত বিনামূল্যে।</p>'),

      h(2, 'একটি সাধারণ Migration ভুল', 'a-common-migration-mistake'),
      callout('warning', '<p>পুরোনো সাধারণ-HTTP সংস্করণকে এতে redirect না করে HTTPS চালু করা একই সাথে আপনার সাইটের দুটি সংস্করণ live রাখে — একটি নকল যা সার্চ ইঞ্জিনকে বিভ্রান্ত করে আর জমা হওয়া যেকোনো ranking সংকেত দুটি ঠিকানার মধ্যে ভাগ করে। <code>http://</code> থেকে <code>https://</code>-এ একটি স্থায়ী (301) redirect একটি প্রয়োজনীয় সহযোগী ধাপ, একটি ঐচ্ছিক অতিরিক্ত নয়, একটি বিদ্যমান সাইটের জন্য প্রতিবার HTTPS চালু করার সময়।</p>', 'সবসময় HTTP-কে HTTPS-এ redirect করুন'),

      h(2, 'সার্টিফিকেট Renewal', 'certificate-renewal'),
      p('<p>সার্টিফিকেটের মেয়াদ শেষ হয়, সাধারণত কয়েক মাস পরে, বিশেষভাবে যাতে একটি আপস হওয়া বা সেকেলে একটি অনির্দিষ্টকাল বিশ্বস্ত থাকতে না পারে। আধুনিক বিনামূল্যের সার্টিফিকেট সেবা আপনার কোনো কাজ ছাড়াই স্বয়ংক্রিয়ভাবে renew হয়; একটি পুরোনো ম্যানুয়াল প্রক্রিয়া ব্যবহার করলে, একটি মেয়াদ শেষ হওয়া সার্টিফিকেট একটি আসল, দৃশ্যমান ব্যর্থতা — ভিজিটর একটি কার্যকর সাইটের বদলে একটি নিরাপত্তা সতর্কতা দেখেন, তাই এটি আপনার জন্য স্বয়ংক্রিয় না হলে renewal তারিখ ট্র্যাক করা গুরুত্বপূর্ণ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'how-email-hosting-works',
  sortOrder: 33,
  en: {
    title: 'How Email Hosting Actually Works',
    metaTitle: 'How Email Hosting Actually Works | Learn Computer Academy',
    metaDescription: 'Email at your own domain is a separate service from website hosting, sent through completely different protocols. How it actually gets set up.',
    blocks: [
      p('<p>Per the third lesson in this category, email is a genuinely separate service from website hosting — this lesson covers how it actually works and how to set it up, closing that particular loop.</p>'),

      h(2, 'The Protocols Involved'),
      table(
        ['Protocol', 'What it does'],
        [
          ['SMTP', 'Sending mail — from your email client to a mail server, and between mail servers'],
          ['IMAP', 'Reading mail — syncs with the server, so mail and folders stay consistent across every device you check email from'],
          ['POP3', 'An older way of reading mail — downloads messages to one device and often removes them from the server; largely superseded by IMAP today'],
        ]
      ),
      p('<p>None of these are the same protocol a website uses (HTTP/HTTPS) — email is an entirely separate system with its own servers, its own software, and its own set of DNS records, which is exactly why it is sold and configured separately from web hosting even when the same company happens to offer both.</p>'),

      h(2, 'How a Domain Gets Connected to Email'),
      p('<p>The connection is the <b>MX record</b>, covered in the DNS-record-types lesson — it tells the wider internet which mail server is responsible for handling <code>you@yourdomain.com</code>. Whichever provider that record points to is your actual email provider for that domain, regardless of who hosts your website.</p>'),

      img(
        'docs/img/hosting/email-hosting-1',
        'Isometric diagram showing a domain nameplate with an arrow labelled MX record pointing to a separate mail server icon, entirely apart from a second arrow pointing to a website hosting server icon',
        1024, 768,
        'One domain, two entirely separate destinations — an MX record for mail, hosting for the website.'
      ),

      h(2, 'Where Email Actually Comes From'),
      table(
        ['Source', 'Typical fit'],
        [
          ['Included with shared hosting', 'Basic mailboxes, often limited in storage and features, fine for a small site\'s contact address'],
          ['A dedicated business email provider', 'A more reliable, feature-complete inbox, generally the better choice once email genuinely matters to the business'],
          ['A free personal email provider, aliased', 'Not the same as a real mailbox at your own domain — a common beginner shortcut worth understanding the limits of'],
        ]
      ),
      p('<p>A dedicated email provider is very often a better real-world choice than whatever a hosting plan includes for free — deliverability (covered in the next lesson), storage, and spam filtering are usually meaningfully better on a service built specifically for email, rather than as a minor bundled feature of a web hosting plan.</p>'),

      h(2, 'Setting It Up, In Outline'),
      p('<ol><li>Choose an email provider — your web host\'s included option, or a dedicated separate one.</li><li>The provider gives you MX records (and usually accompanying TXT records, covered in the next lesson) to add to your domain\'s DNS.</li><li>Add those records through whichever DNS panel currently manages your domain, per the connecting-a-domain lesson.</li><li>Wait for propagation, same as any other DNS change.</li><li>Create individual mailboxes through the provider\'s own dashboard.</li></ol>'),

      callout('note', '<p>This is precisely why you can run your website on one host and your email through a completely different provider, with no conflict — they connect to the same domain through entirely different DNS record types, A/CNAME for the website and MX for mail, which is the practical proof of the three-separate-things idea from earlier in this category.</p>'),
    ],
  },
  bn: {
    title: 'ইমেইল হোস্টিং আসলে কীভাবে কাজ করে',
    metaTitle: 'ইমেইল হোস্টিং আসলে কীভাবে কাজ করে | Learn Computer Academy',
    metaDescription: 'আপনার নিজের ডোমেইনে ইমেইল ওয়েবসাইট হোস্টিং থেকে একটি আলাদা সেবা, সম্পূর্ণ ভিন্ন প্রোটোকলের মাধ্যমে পাঠানো। এটি আসলে কীভাবে সেট আপ হয়।',
    blocks: [
      p('<p>এই বিভাগের তৃতীয় পাঠ অনুযায়ী, ইমেইল ওয়েবসাইট হোস্টিং থেকে সত্যিই একটি আলাদা সেবা — এই পাঠ কভার করে এটি আসলে কীভাবে কাজ করে আর কীভাবে সেট আপ করবেন, সেই নির্দিষ্ট loop বন্ধ করে।</p>'),

      h(2, 'জড়িত প্রোটোকল', 'the-protocols-involved'),
      table(
        ['প্রোটোকল', 'এটি কী করে'],
        [
          ['SMTP', 'মেইল পাঠানো — আপনার ইমেইল client থেকে একটি মেইল সার্ভারে, আর মেইল সার্ভারের মধ্যে'],
          ['IMAP', 'মেইল পড়া — সার্ভারের সাথে sync করে, তাই আপনি যে প্রতিটি ডিভাইস থেকে ইমেইল চেক করেন তাতে মেইল আর ফোল্ডার ধারাবাহিক থাকে'],
          ['POP3', 'মেইল পড়ার একটি পুরোনো উপায় — বার্তা একটি ডিভাইসে ডাউনলোড করে আর প্রায়ই সার্ভার থেকে সরিয়ে দেয়; আজ বেশিরভাগ IMAP দ্বারা প্রতিস্থাপিত'],
        ]
      ),
      p('<p>এগুলোর কোনোটিই একটি ওয়েবসাইট ব্যবহার করা একই প্রোটোকল নয় (HTTP/HTTPS) — ইমেইল নিজস্ব সার্ভার, নিজস্ব সফটওয়্যার, আর নিজস্ব DNS রেকর্ডের সেটসহ একটি সম্পূর্ণ আলাদা সিস্টেম, যে কারণেই একই কোম্পানি ঘটনাক্রমে দুটোই দিলেও এটি web হোস্টিং থেকে আলাদাভাবে বিক্রি আর কনফিগার করা হয়।</p>'),

      h(2, 'একটি ডোমেইন কীভাবে ইমেইলের সাথে সংযুক্ত হয়', 'how-a-domain-gets-connected-to-email'),
      p('<p>সংযোগটি হলো <b>MX রেকর্ড</b>, DNS-record-types পাঠে কভার করা — এটি বৃহত্তর ইন্টারনেটকে বলে <code>you@yourdomain.com</code> সামলানোর জন্য কোন মেইল সার্ভার দায়ী। যে প্রদানকারী সেই রেকর্ডটি নির্দেশ করে সেটিই সেই ডোমেইনের জন্য আপনার আসল ইমেইল প্রদানকারী, আপনার ওয়েবসাইট কে host করে তা নির্বিশেষে।</p>'),

      img(
        'docs/img/hosting/email-hosting-1',
        'Isometric ডায়াগ্রাম যেখানে একটি ডোমেইন নেমপ্লেট দেখানো হয়েছে যাতে "MX record" লেবেল করা একটি তীর একটি আলাদা মেইল সার্ভার আইকনের দিকে নির্দেশ করছে, একটি ওয়েবসাইট হোস্টিং সার্ভার আইকনের দিকে নির্দেশ করা দ্বিতীয় তীর থেকে সম্পূর্ণ আলাদা',
        1024, 768,
        'একটি ডোমেইন, দুটি সম্পূর্ণ আলাদা গন্তব্য — মেইলের জন্য একটি MX রেকর্ড, ওয়েবসাইটের জন্য হোস্টিং।'
      ),

      h(2, 'ইমেইল আসলে কোথা থেকে আসে', 'where-email-actually-comes-from'),
      table(
        ['উৎস', 'সাধারণ মিল'],
        [
          ['Shared হোস্টিং-এর সাথে অন্তর্ভুক্ত', 'মৌলিক mailbox, প্রায়ই সংরক্ষণ আর ফিচারে সীমিত, একটি ছোট সাইটের যোগাযোগ ঠিকানার জন্য ঠিক আছে'],
          ['একটি নিবেদিত ব্যবসায়িক ইমেইল প্রদানকারী', 'একটি বেশি নির্ভরযোগ্য, ফিচার-সম্পূর্ণ ইনবক্স, সাধারণত ব্যবসার কাছে ইমেইল সত্যিই গুরুত্বপূর্ণ হলে ভালো পছন্দ'],
          ['একটি বিনামূল্যের ব্যক্তিগত ইমেইল প্রদানকারী, alias করা', 'আপনার নিজের ডোমেইনে একটি আসল mailbox-এর মতো নয় — এর সীমা বোঝার যোগ্য একটি সাধারণ শিক্ষানবিস শর্টকাট'],
        ]
      ),
      p('<p>একটি নিবেদিত ইমেইল প্রদানকারী প্রায়ই একটি হোস্টিং পরিকল্পনা বিনামূল্যে যা অন্তর্ভুক্ত করে তার চেয়ে বাস্তব-জগতে একটি ভালো পছন্দ — deliverability (পরের পাঠে কভার করা), সংরক্ষণ, আর spam ফিল্টারিং সাধারণত একটি web হোস্টিং পরিকল্পনার একটি ছোট বান্ডিল করা ফিচারের বদলে বিশেষভাবে ইমেইলের জন্য তৈরি একটি সেবায় অর্থপূর্ণভাবে ভালো।</p>'),

      h(2, 'এটি সেট আপ করা, রূপরেখায়', 'setting-it-up-in-outline'),
      p('<p><ol><li>একটি ইমেইল প্রদানকারী বাছুন — আপনার web host-এর অন্তর্ভুক্ত বিকল্প, বা একটি নিবেদিত আলাদা একটি।</li><li>প্রদানকারী আপনাকে আপনার ডোমেইনের DNS-এ যোগ করার জন্য MX রেকর্ড দেয় (আর সাধারণত সহগামী TXT রেকর্ড, পরের পাঠে কভার করা)।</li><li>connecting-a-domain পাঠ অনুযায়ী, বর্তমানে আপনার ডোমেইন পরিচালনা করে এমন যেকোনো DNS panel-এর মাধ্যমে সেই রেকর্ড যোগ করুন।</li><li>অন্য যেকোনো DNS পরিবর্তনের মতো propagation-এর জন্য অপেক্ষা করুন।</li><li>প্রদানকারীর নিজস্ব dashboard-এর মাধ্যমে পৃথক mailbox তৈরি করুন।</li></ol></p>'),

      callout('note', '<p>এটিই ঠিক কারণ আপনি একটি host-এ আপনার ওয়েবসাইট আর সম্পূর্ণ ভিন্ন একটি প্রদানকারীর মাধ্যমে আপনার ইমেইল চালাতে পারেন, কোনো দ্বন্দ্ব ছাড়াই — তারা সম্পূর্ণ ভিন্ন DNS রেকর্ড ধরনের মাধ্যমে একই ডোমেইনের সাথে সংযুক্ত হয়, ওয়েবসাইটের জন্য A/CNAME আর মেইলের জন্য MX, যা এই বিভাগের আগের তিন-আলাদা-জিনিস ধারণার ব্যবহারিক প্রমাণ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'why-emails-land-in-spam',
  sortOrder: 34,
  en: {
    title: 'Why Emails Land in Spam',
    metaTitle: 'Why Emails Land in Spam | Learn Computer Academy',
    metaDescription: 'Deliverability is a trust problem, not a technical one — the DNS records and habits that get email from your domain into the inbox instead of spam.',
    blocks: [
      p('<p>A working mail server is not the same as reliable delivery. This lesson covers <b>deliverability</b> — why mail from a brand-new domain routinely lands in spam, and the records that fix it.</p>'),

      h(2, 'Deliverability Is a Trust Problem'),
      p('<p>Every major mail provider (Gmail, Outlook, and the rest) runs incoming mail through spam filters that score it on sender reputation before it ever reaches an inbox. A domain with no history, no verification records, and no sending pattern to judge looks exactly like what spam typically looks like — new, unverified, unpredictable — regardless of how legitimate the actual content is.</p>'),

      h(2, 'The Three Verification Records'),
      table(
        ['Record', 'What it proves'],
        [
          ['SPF', 'Which mail servers are allowed to send mail claiming to be from your domain — a receiving server checks the sending server against this list'],
          ['DKIM', 'A cryptographic signature added to outgoing mail, proving it genuinely came from your domain and was not altered in transit'],
          ['DMARC', 'A policy telling receiving servers what to do when SPF or DKIM fails — reject the mail, quarantine it as spam, or merely report the failure'],
        ]
      ),
      p('<p>All three are TXT records, added to the same DNS panel covered in the connecting-a-domain lesson, and your email provider (from the previous lesson) supplies the exact values — this is not something to construct by hand.</p>'),

      img(
        'docs/img/hosting/spam-1',
        'Isometric diagram showing an email envelope passing through three checkpoint gates labelled SPF, DKIM, and DMARC before reaching an inbox tray, with a rejected envelope diverted to a spam folder icon',
        1024, 768,
        'Three checks a receiving mail server runs before deciding inbox or spam.'
      ),

      h(2, 'Reputation Beyond the Records'),
      p('<p>Correct records are necessary but not sufficient. Ongoing sending behavior matters just as much: a sudden volume spike, a high bounce rate from sending to invalid addresses, or a high complaint rate (recipients marking mail as spam) all damage a domain\'s reputation over time, independent of whether SPF and DKIM technically pass.</p>'),

      h(2, 'A New Domain Starts With No Reputation'),
      callout('note', '<p>This is why a brand-new domain sending its first bulk email often lands in spam even with every record configured correctly — reputation is built over time by consistent, low-complaint sending, not established instantly by DNS records alone. It is a genuine reason to expect early friction, not a sign that something is misconfigured.</p>', 'New domains need time, not just correct records'),

      h(2, 'Transactional vs. Bulk Mail'),
      p('<p>A contact-form notification or a password-reset email (transactional mail, sent one at a time in response to a user action) behaves very differently from a newsletter sent to a large list at once (bulk mail) — mail providers watch for the volume and pattern differences, and bulk sending is held to a noticeably stricter reputation standard. A dedicated transactional-email service is a common, worthwhile choice specifically for the contact-form and account-notification mail a website sends, separate from whatever handles a newsletter, if one exists at all.</p>'),
    ],
  },
  bn: {
    title: 'ইমেইল কেন Spam-এ যায়',
    metaTitle: 'ইমেইল কেন Spam-এ যায় | Learn Computer Academy',
    metaDescription: 'Deliverability একটি বিশ্বাসের সমস্যা, প্রযুক্তিগত নয় — যে DNS রেকর্ড আর অভ্যাস আপনার ডোমেইন থেকে ইমেইলকে spam-এর বদলে ইনবক্সে পৌঁছে দেয়।',
    blocks: [
      p('<p>একটি কার্যকর মেইল সার্ভার নির্ভরযোগ্য ডেলিভারির মতো একই জিনিস নয়। এই পাঠ কভার করে <b>deliverability</b> — একটি একেবারে নতুন ডোমেইনের মেইল নিয়মিতভাবে spam-এ যায় কেন, আর যে রেকর্ড এটি ঠিক করে।</p>'),

      h(2, 'Deliverability একটি বিশ্বাসের সমস্যা', 'deliverability-is-a-trust-problem'),
      p('<p>প্রতিটি বড় মেইল প্রদানকারী (Gmail, Outlook, আর বাকিরা) আগত মেইল spam ফিল্টারের মধ্য দিয়ে চালায় যা এটি ইনবক্সে পৌঁছানোর আগে sender reputation-এর উপর score করে। কোনো ইতিহাস, কোনো verification রেকর্ড, আর বিচার করার মতো কোনো sending pattern ছাড়া একটি ডোমেইন ঠিক তেমনই দেখায় যেমন spam সাধারণত দেখায় — নতুন, অভাবনীয়, অপ্রত্যাশিত — আসল কন্টেন্ট যতই বৈধ হোক না কেন তা নির্বিশেষে।</p>'),

      h(2, 'তিনটি Verification রেকর্ড', 'the-three-verification-records'),
      table(
        ['রেকর্ড', 'এটি কী প্রমাণ করে'],
        [
          ['SPF', 'কোন মেইল সার্ভারগুলো আপনার ডোমেইন থেকে বলে দাবি করা মেইল পাঠাতে অনুমোদিত — একটি গ্রহণকারী সার্ভার এই তালিকার বিরুদ্ধে পাঠানো সার্ভার চেক করে'],
          ['DKIM', 'বাইরে যাওয়া মেইলে যোগ করা একটি ক্রিপ্টোগ্রাফিক signature, প্রমাণ করে এটি আসলেই আপনার ডোমেইন থেকে এসেছে আর ট্রানজিটে পরিবর্তিত হয়নি'],
          ['DMARC', 'গ্রহণকারী সার্ভারকে বলা একটি নীতি SPF বা DKIM ব্যর্থ হলে কী করতে হবে — মেইল প্রত্যাখ্যান করুন, spam হিসেবে quarantine করুন, বা শুধু ব্যর্থতা রিপোর্ট করুন'],
        ]
      ),
      p('<p>তিনটিই TXT রেকর্ড, connecting-a-domain পাঠে কভার করা একই DNS panel-এ যোগ করা, আর আপনার ইমেইল প্রদানকারী (আগের পাঠ থেকে) সঠিক মান সরবরাহ করে — এটি হাতে তৈরি করার মতো কিছু নয়।</p>'),

      img(
        'docs/img/hosting/spam-1',
        'Isometric ডায়াগ্রাম যেখানে একটি ইমেইল খাম SPF, DKIM, আর DMARC লেবেল করা তিনটি checkpoint গেটের মধ্য দিয়ে একটি ইনবক্স ট্রেতে পৌঁছানোর আগে যাচ্ছে দেখানো হয়েছে, একটি প্রত্যাখ্যাত খাম একটি spam ফোল্ডার আইকনে ঘুরিয়ে দেওয়া হয়েছে',
        1024, 768,
        'ইনবক্স নাকি spam সিদ্ধান্ত নেওয়ার আগে একটি গ্রহণকারী মেইল সার্ভার যে তিনটি চেক চালায়।'
      ),

      h(2, 'রেকর্ডের বাইরে Reputation', 'reputation-beyond-the-records'),
      p('<p>সঠিক রেকর্ড প্রয়োজনীয় কিন্তু যথেষ্ট নয়। চলমান sending আচরণও ঠিক ততটাই গুরুত্বপূর্ণ: একটি হঠাৎ volume spike, অবৈধ ঠিকানায় পাঠানো থেকে একটি উচ্চ bounce rate, বা একটি উচ্চ complaint rate (প্রাপকরা মেইল spam হিসেবে চিহ্নিত করা) সবই সময়ের সাথে একটি ডোমেইনের reputation ক্ষতি করে, SPF আর DKIM প্রযুক্তিগতভাবে পাস করে কিনা তা নির্বিশেষে।</p>'),

      h(2, 'একটি নতুন ডোমেইন কোনো Reputation ছাড়া শুরু হয়', 'a-new-domain-starts-with-no-reputation'),
      callout('note', '<p>এই কারণেই একটি একেবারে নতুন ডোমেইন তার প্রথম bulk ইমেইল পাঠানোর সময় প্রায়ই spam-এ যায় প্রতিটি রেকর্ড সঠিকভাবে কনফিগার করা থাকলেও — reputation সময়ের সাথে ধারাবাহিক, কম-complaint sending দ্বারা তৈরি হয়, শুধু DNS রেকর্ড দিয়ে তাৎক্ষণিকভাবে প্রতিষ্ঠিত হয় না। এটি প্রাথমিক ঘর্ষণ আশা করার একটি আসল কারণ, কিছু ভুল কনফিগার করা আছে তার লক্ষণ নয়।</p>', 'নতুন ডোমেইনের সময় দরকার, শুধু সঠিক রেকর্ড নয়'),

      h(2, 'Transactional বনাম Bulk মেইল', 'transactional-vs-bulk-mail'),
      p('<p>একটি contact-form বিজ্ঞপ্তি বা একটি password-reset ইমেইল (transactional মেইল, একটি ব্যবহারকারীর কাজের প্রতিক্রিয়ায় একবারে একটি পাঠানো) একটি বৃহৎ তালিকায় একসাথে পাঠানো একটি নিউজলেটার (bulk মেইল) থেকে খুব ভিন্নভাবে আচরণ করে — মেইল প্রদানকারীরা volume আর pattern পার্থক্যের জন্য নজর রাখে, আর bulk sending লক্ষণীয়ভাবে কঠোর reputation মানে রাখা হয়। একটি নিবেদিত transactional-email সেবা বিশেষভাবে একটি ওয়েবসাইট পাঠানো contact-form আর account-notification মেইলের জন্য একটি সাধারণ, মূল্যবান পছন্দ, একটি নিউজলেটার যা সামলায় তা থেকে আলাদা, যদি একটি থাকেও।</p>'),
    ],
  },
})

lessons.push({
  slug: 'staging-vs-production',
  sortOrder: 35,
  en: {
    title: 'Staging vs. Production',
    metaTitle: 'Staging vs. Production Explained | Learn Computer Academy',
    metaDescription: 'Why real teams never edit the live site directly, and how a staging copy — or a Git-based preview deployment — prevents that.',
    blocks: [
      p('<p>Everything in this category so far has described getting one copy of a site live. Once that site matters to real users, editing that live copy directly stops being a safe way to work — this lesson covers why, and what replaces it.</p>'),

      h(2, 'What "Production" Means'),
      p('<p><b>Production</b> is simply the term for whatever copy of a site real visitors are currently using. Anything that breaks production is visible immediately, to everyone, with no warning — a typo in a price, a broken checkout button, a page that fails to load.</p>'),

      h(2, 'What "Staging" Means'),
      p('<p>A <b>staging</b> environment is a separate, near-identical copy of the site — same code, same hosting setup, usually a separate database with realistic-but-fake data — reachable only at a private or unlisted address, where changes are tested before they ever reach production. A mistake on staging is invisible to real visitors, by design.</p>'),

      img(
        'docs/img/hosting/staging-1',
        'Isometric diagram showing two parallel identical-looking website server stacks side by side, one labelled staging behind a padlock icon accessible only to a developer figure, the other labelled production open to many visitor figures',
        1024, 768,
        'Staging and production run the same code — only who can reach them differs.'
      ),

      h(2, 'How Teams Actually Structure This'),
      table(
        ['Setup', 'How it works'],
        [
          ['A second hosting environment', 'A literal second copy of the site, deployed the same way as production, at a subdomain like staging.yourdomain.com'],
          ['Git branch environments', 'A "staging" or "develop" branch, separate from the "main" branch that production deploys from — merging staging into main is what promotes it to live'],
          ['Preview deployments', 'Automatic, throwaway environments for every proposed change, covered next — the modern default on most Git-based hosting'],
        ]
      ),

      h(2, 'Preview Deployments'),
      p('<p>The Git-based deployment lesson mentioned every pull request getting its own temporary URL automatically. That is staging taken to its logical end — not one fixed staging copy shared and possibly fought over by an entire team, but a fresh disposable environment for every single proposed change, deleted once it merges or closes. Most modern cloud and managed platforms covered earlier in this category include this by default at no extra cost.</p>'),

      h(2, 'A Beginner\'s Reasonable Middle Ground'),
      p('<p>A full staging setup is not always justified for a small personal project with no other collaborators and low stakes if something breaks briefly. But even then, testing changes locally before deploying — running the site on your own computer first, the most basic form of an environment separate from production — is a version of the same discipline, worth adopting well before a project grows to the point where a proper staging environment becomes necessary.</p>'),
    ],
  },
  bn: {
    title: 'Staging বনাম Production',
    metaTitle: 'Staging বনাম Production ব্যাখ্যা | Learn Computer Academy',
    metaDescription: 'আসল দল কেন কখনো সরাসরি live সাইট সম্পাদনা করে না, আর একটি staging কপি — বা একটি Git-based preview deployment — কীভাবে এটি প্রতিরোধ করে।',
    blocks: [
      p('<p>এই বিভাগের এখন পর্যন্ত সবকিছু একটি সাইটের একটি কপি live করা বর্ণনা করেছে। একবার সেই সাইট আসল ব্যবহারকারীদের কাছে গুরুত্বপূর্ণ হয়ে গেলে, সেই live কপি সরাসরি সম্পাদনা করা কাজ করার একটি নিরাপদ উপায় থাকা বন্ধ করে দেয় — এই পাঠ কভার করে কেন, আর এটির জায়গায় কী আসে।</p>'),

      h(2, '"Production" মানে কী', 'what-production-means'),
      p('<p><b>Production</b> শুধু সেই term যা বর্ণনা করে সাইটের যে কপি আসল ভিজিটররা বর্তমানে ব্যবহার করছে। যা কিছু production ভাঙে তা তাৎক্ষণিকভাবে দৃশ্যমান, সবার কাছে, কোনো সতর্কতা ছাড়াই — একটি দামে একটি বানান ভুল, একটি ভাঙা checkout button, একটি পাতা যা লোড হতে ব্যর্থ হয়।</p>'),

      h(2, '"Staging" মানে কী', 'what-staging-means'),
      p('<p>একটি <b>staging</b> পরিবেশ হলো সাইটের একটি আলাদা, প্রায়-অভিন্ন কপি — একই কোড, একই হোস্টিং সেটআপ, সাধারণত বাস্তবসম্মত-কিন্তু-নকল ডেটাসহ একটি আলাদা database — শুধুমাত্র একটি ব্যক্তিগত বা তালিকাভুক্ত-নয় ঠিকানায় পৌঁছানো যায়, যেখানে পরিবর্তনগুলো production-এ পৌঁছানোর আগে পরীক্ষা করা হয়। staging-এ একটি ভুল আসল ভিজিটরদের কাছে অদৃশ্য, ডিজাইন অনুসারে।</p>'),

      img(
        'docs/img/hosting/staging-1',
        'Isometric ডায়াগ্রাম যেখানে পাশাপাশি দুটি সমান্তরাল অভিন্ন-দেখতে ওয়েবসাইট সার্ভার স্ট্যাক দেখানো হয়েছে, একটি "staging" লেবেল করা একটি padlock আইকনের পেছনে শুধু একটি ডেভেলপার চরিত্রের কাছে প্রবেশযোগ্য, অন্যটি "production" লেবেল করা অনেক ভিজিটর চরিত্রের কাছে খোলা',
        1024, 768,
        'Staging আর production একই কোড চালায় — শুধু কে পৌঁছাতে পারে তা ভিন্ন।'
      ),

      h(2, 'দলগুলো আসলে এটি কীভাবে গঠন করে', 'how-teams-actually-structure-this'),
      table(
        ['সেটআপ', 'এটি কীভাবে কাজ করে'],
        [
          ['একটি দ্বিতীয় হোস্টিং পরিবেশ', 'সাইটের একটি আক্ষরিক দ্বিতীয় কপি, production-এর মতো একই উপায়ে deploy করা, staging.yourdomain.com-এর মতো একটি subdomain-এ'],
          ['Git branch পরিবেশ', '"main" branch থেকে আলাদা একটি "staging" বা "develop" branch যা থেকে production deploy হয় — staging-কে main-এ merge করা এটিকে live-এ promote করে'],
          ['Preview deployment', 'প্রতিটি প্রস্তাবিত পরিবর্তনের জন্য স্বয়ংক্রিয়, ফেলে দেওয়ার মতো পরিবেশ, পরে কভার করা — বেশিরভাগ Git-based হোস্টিং-এ আধুনিক default'],
        ]
      ),

      h(2, 'Preview Deployment', 'preview-deployments'),
      p('<p>Git-based deployment পাঠ উল্লেখ করেছিল প্রতিটি pull request স্বয়ংক্রিয়ভাবে নিজস্ব সাময়িক URL পাওয়া। সেটিই staging তার যৌক্তিক শেষ পর্যন্ত নেওয়া — একটি নির্দিষ্ট staging কপি একটি সম্পূর্ণ দল দ্বারা ভাগ করা আর সম্ভবত ঝগড়া করা নয়, বরং প্রতিটি একক প্রস্তাবিত পরিবর্তনের জন্য একটি নতুন নিষ্পত্তিযোগ্য পরিবেশ, merge বা close হওয়ার পর মুছে ফেলা। এই বিভাগে আগে কভার করা বেশিরভাগ আধুনিক cloud আর managed প্ল্যাটফর্ম কোনো অতিরিক্ত খরচ ছাড়াই default হিসেবে এটি অন্তর্ভুক্ত করে।</p>'),

      h(2, 'একজন শিক্ষানবিসের যুক্তিসঙ্গত মধ্যম পথ', 'a-beginners-reasonable-middle-ground'),
      p('<p>কোনো অন্য সহযোগী ছাড়া আর কিছু সংক্ষেপে ভাঙলে কম ঝুঁকিসহ একটি ছোট ব্যক্তিগত প্রকল্পের জন্য একটি সম্পূর্ণ staging সেটআপ সবসময় ন্যায়সঙ্গত নয়। কিন্তু তখনও, deploy করার আগে স্থানীয়ভাবে পরিবর্তন পরীক্ষা করা — প্রথমে আপনার নিজের কম্পিউটারে সাইট চালানো, production থেকে আলাদা একটি পরিবেশের সবচেয়ে মৌলিক রূপ — একই শৃঙ্খলার একটি সংস্করণ, একটি প্রকল্প সেই বিন্দুতে বাড়ার অনেক আগে গ্রহণ করার যোগ্য যেখানে একটি সঠিক staging পরিবেশ প্রয়োজনীয় হয়ে ওঠে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'environment-variables-and-secrets',
  sortOrder: 36,
  en: {
    title: 'Environment Variables and Secrets on a Server',
    metaTitle: 'Environment Variables and Secrets on a Server | Learn Computer Academy',
    metaDescription: 'Why passwords and API keys never belong in code, and how a live server is actually given them without exposing them to visitors.',
    blocks: [
      p('<p>Database passwords, API keys, and similar credentials need to exist somewhere for a live site to function — this lesson covers where they actually go, and why the wrong answer is a serious, common mistake.</p>'),

      h(2, 'Why Secrets Never Belong in Code'),
      p('<p>Code is typically stored in a Git repository, and if that repository is ever pushed to a public host, made public later, or simply read by anyone with access, any credential written directly into it is exposed — permanently, since old commits remain in Git\'s history even after the line is later deleted. This is a genuinely common real-world mistake, not a hypothetical one.</p>'),

      h(2, 'What an Environment Variable Is'),
      p('<p>An <b>environment variable</b> is a named value supplied to a running program by its surrounding environment (the operating system or hosting platform) rather than written into the code itself. The code reads a name like <code>DATABASE_PASSWORD</code> and receives whatever value the environment has for it — the actual value lives entirely outside the codebase.</p>'),

      code('bash', `# The code never contains the actual password —
# only the name of a variable it expects to find:
DATABASE_URL=$DATABASE_URL
API_KEY=$STRIPE_SECRET_KEY`),

      img(
        'docs/img/hosting/env-vars-1',
        'Isometric diagram showing a code file icon with a locked padlock replacing a visible password, connected by an arrow to a separate secure vault icon labelled environment variables holding the actual credential',
        1024, 768,
        'The code names what it needs; the platform supplies the actual value separately.'
      ),

      h(2, 'Where They Actually Get Set'),
      table(
        ['Setup', 'Where secrets live'],
        [
          ['Cloud and managed platforms', 'A dedicated "Environment Variables" section in the project dashboard, set per-environment (production, staging, preview)'],
          ['A traditional server (VPS, shared hosting)', 'A local <code>.env</code> file on the server itself, or the control panel\'s own environment-variable settings, kept out of the Git repository'],
          ['Local development', 'A <code>.env</code> file on your own machine, containing test or placeholder values, never committed'],
        ]
      ),

      h(2, 'The Companion Habit: .gitignore'),
      p('<p>A <code>.env</code> file holding real secrets must be listed in <code>.gitignore</code> so Git never tracks it in the first place — the platform-level environment variables above are what actually reach the live server; the local <code>.env</code> file is only for your own machine and must never be pushed alongside the code.</p>'),

      callout('warning', '<p>If a real credential is ever accidentally committed to Git, changing the code afterward is not enough — the credential itself must be rotated (changed at the source, such as regenerating an API key), because the old value remains permanently visible in the repository\'s history regardless of later edits.</p>', 'A leaked secret must be rotated, not just removed'),
    ],
  },
  bn: {
    title: 'সার্ভারে Environment Variable আর Secret',
    metaTitle: 'সার্ভারে Environment Variable আর Secret | Learn Computer Academy',
    metaDescription: 'পাসওয়ার্ড আর API key কখনো কোডে কেন থাকে না, আর একটি live সার্ভার আসলে কীভাবে এগুলো পায় ভিজিটরদের কাছে প্রকাশ না করে।',
    blocks: [
      p('<p>Database পাসওয়ার্ড, API key, আর অনুরূপ credential একটি live সাইট কাজ করার জন্য কোথাও থাকতে হবে — এই পাঠ কভার করে এগুলো আসলে কোথায় যায়, আর ভুল উত্তর কেন একটি গুরুতর, সাধারণ ভুল।</p>'),

      h(2, 'Secret কেন কখনো কোডে থাকে না', 'why-secrets-never-belong-in-code'),
      p('<p>কোড সাধারণত একটি Git repository-তে সংরক্ষিত হয়, আর যদি সেই repository কখনো একটি পাবলিক host-এ push করা হয়, পরে পাবলিক করা হয়, বা শুধু প্রবেশাধিকার আছে এমন যে কারো দ্বারা পড়া হয়, তবে সরাসরি এতে লেখা যেকোনো credential প্রকাশিত হয়ে যায় — স্থায়ীভাবে, কারণ পুরোনো commit Git-এর ইতিহাসে থেকে যায় লাইনটি পরে মুছে ফেলা হলেও। এটি সত্যিই একটি সাধারণ বাস্তব-জগতের ভুল, একটি কাল্পনিক ভুল নয়।</p>'),

      h(2, 'একটি Environment Variable কী', 'what-an-environment-variable-is'),
      p('<p>একটি <b>environment variable</b> হলো একটি নামযুক্ত মান একটি চলমান প্রোগ্রামকে তার আশেপাশের পরিবেশ দ্বারা সরবরাহ করা (operating system বা হোস্টিং প্ল্যাটফর্ম) কোডে নিজেই লেখার বদলে। কোড <code>DATABASE_PASSWORD</code>-এর মতো একটি নাম পড়ে আর পরিবেশে যা মান আছে তা গ্রহণ করে — আসল মানটি সম্পূর্ণভাবে codebase-এর বাইরে থাকে।</p>'),

      code('bash', `# কোডে কখনো আসল পাসওয়ার্ড থাকে না —
# শুধু একটি variable-এর নাম যা এটি খুঁজে পাবে বলে আশা করে:
DATABASE_URL=$DATABASE_URL
API_KEY=$STRIPE_SECRET_KEY`),

      img(
        'docs/img/hosting/env-vars-1',
        'Isometric ডায়াগ্রাম যেখানে একটি কোড ফাইল আইকন দেখানো হয়েছে যাতে একটি দৃশ্যমান পাসওয়ার্ড প্রতিস্থাপনকারী একটি লক করা padlock আছে, একটি তীর দিয়ে একটি আলাদা নিরাপদ vault আইকনের সাথে সংযুক্ত "environment variables" লেবেল করা যা আসল credential ধরে রাখে',
        1024, 768,
        'কোড নাম বলে দেয় এটির কী দরকার; প্ল্যাটফর্ম আসল মান আলাদাভাবে সরবরাহ করে।'
      ),

      h(2, 'এগুলো আসলে কোথায় সেট করা হয়', 'where-they-actually-get-set'),
      table(
        ['সেটআপ', 'Secret কোথায় থাকে'],
        [
          ['Cloud আর managed প্ল্যাটফর্ম', 'প্রকল্প dashboard-এ একটি নিবেদিত "Environment Variables" বিভাগ, প্রতি-পরিবেশ সেট করা (production, staging, preview)'],
          ['একটি প্রথাগত সার্ভার (VPS, shared হোস্টিং)', 'সার্ভারে নিজেই একটি স্থানীয় <code>.env</code> ফাইল, বা control panel-এর নিজস্ব environment-variable সেটিং, Git repository-র বাইরে রাখা'],
          ['স্থানীয় development', 'আপনার নিজের মেশিনে একটি <code>.env</code> ফাইল, test বা placeholder মান ধারণ করে, কখনো commit করা হয় না'],
        ]
      ),

      h(2, 'সহযোগী অভ্যাস: .gitignore', 'the-companion-habit-gitignore'),
      p('<p>আসল secret ধরে রাখা একটি <code>.env</code> ফাইল অবশ্যই <code>.gitignore</code>-এ তালিকাভুক্ত হতে হবে যাতে Git প্রথম স্থানে কখনো এটি track না করে — উপরের প্ল্যাটফর্ম-স্তরের environment variable-গুলো যা আসলে live সার্ভারে পৌঁছায়; স্থানীয় <code>.env</code> ফাইলটি শুধু আপনার নিজের মেশিনের জন্য আর কোডের সাথে কখনো push করা উচিত নয়।</p>'),

      callout('warning', '<p>যদি একটি আসল credential কখনো দুর্ঘটনাক্রমে Git-এ commit করা হয়, পরে কোড পরিবর্তন করা যথেষ্ট নয় — credential নিজেই ঘোরাতে (rotate) হবে (উৎসে পরিবর্তিত, যেমন একটি API key পুনরায় তৈরি করা), কারণ পুরোনো মান পরের সম্পাদনা নির্বিশেষে repository-র ইতিহাসে স্থায়ীভাবে দৃশ্যমান থাকে।</p>', 'একটি ফাঁস হওয়া secret অবশ্যই rotate করতে হবে, শুধু সরানো নয়'),
    ],
  },
})

lessons.push({
  slug: 'backups-renewals-and-what-breaks',
  sortOrder: 37,
  en: {
    title: 'Backups, Renewals, and What Breaks',
    metaTitle: 'Backups and Renewals — What Breaks a Live Site | Learn Computer Academy',
    metaDescription: 'The ongoing maintenance a live site actually needs — backups, expiry dates, and updates — and what happens when each is neglected.',
    blocks: [
      p('<p>A site going live is not the end of the work — a small, recurring set of maintenance tasks keeps it that way. This lesson lists what they are and what actually happens when each one is skipped.</p>'),

      h(2, 'Backups'),
      p('<p>A backup is a separate, restorable copy of a site\'s files and database, taken on a schedule. Without one, a hacked site, a bad update, or a mistaken deletion has no way back — the site is simply gone or broken until it is rebuilt from scratch, which is often far more expensive in time than the backup ever would have cost.</p>'),
      table(
        ['Source', 'What it typically covers'],
        [
          ['Hosting-provider backups', 'Often included automatically on managed platforms, sometimes as a paid add-on on shared or VPS hosting — worth confirming rather than assuming'],
          ['Application-level backups', 'A WordPress backup plugin or similar, exporting the database and files on its own schedule, independent of what the host does'],
          ['This site\'s own approach', 'Per this project\'s own <a href="/hosting/">CLAUDE.md</a> practice, a daily automated job that exports content as versioned files — the same idea applied at the content layer rather than the whole server'],
        ]
      ),

      img(
        'docs/img/hosting/backups-1',
        'Isometric diagram showing a website server with a clock icon labelled daily backup, an arrow pointing to a stack of separate archived copies of the site stored safely apart from the live server',
        1024, 768,
        'A backup is only useful if it is separate from what it is backing up.'
      ),

      h(2, 'Expiry Dates That Actually Matter'),
      table(
        ['What expires', 'What happens if it lapses'],
        [
          ['Domain registration', 'The domain becomes available for anyone else to register, after a grace period — the single most severe expiry on this list, since it can mean losing the domain entirely'],
          ['SSL certificate', 'Covered in the HTTPS lesson — visitors see a security warning; modern free certificates renew automatically, but older manual setups do not'],
          ['Hosting plan', 'The site typically goes offline once a paid plan lapses, though most providers give some warning first'],
        ]
      ),

      h(2, 'Updates'),
      p('<p>The security-basics lesson in this site\'s <a href="/design/">design category</a> covers this from the security side; the point here is purely operational — CMS platforms (WordPress especially), plugins, and server software all receive security patches over time, and an unpatched, out-of-date installation is a genuinely common way real sites get compromised. This is ongoing maintenance, not a one-time setup task.</p>'),

      callout('note', '<p>None of this is difficult individually — it is easy to overlook precisely because nothing goes wrong for a long stretch, until the one time a backup would have mattered and none exists. Setting a calendar reminder for domain renewal is a genuinely sufficient defense against the most severe item on this list.</p>'),
    ],
  },
  bn: {
    title: 'Backup, Renewal, আর কী ভাঙে',
    metaTitle: 'Backup আর Renewal — একটি Live সাইট কী ভাঙে | Learn Computer Academy',
    metaDescription: 'একটি live সাইটের আসলে যে চলমান রক্ষণাবেক্ষণ দরকার — backup, মেয়াদ শেষের তারিখ, আর আপডেট — আর প্রতিটি অবহেলিত হলে কী ঘটে।',
    blocks: [
      p('<p>একটি সাইট live হওয়া কাজের শেষ নয় — রক্ষণাবেক্ষণ কাজের একটি ছোট, বারবার ঘটা সেট এটিকে সেভাবে রাখে। এই পাঠ তালিকাভুক্ত করে সেগুলো কী আর প্রতিটি বাদ দেওয়া হলে আসলে কী ঘটে।</p>'),

      h(2, 'Backup', 'backups'),
      p('<p>একটি backup হলো একটি সাইটের ফাইল আর database-এর একটি আলাদা, পুনরুদ্ধারযোগ্য কপি, একটি সময়সূচীতে নেওয়া। একটি ছাড়া, একটি hack হওয়া সাইট, একটি খারাপ আপডেট, বা একটি ভুল মুছে ফেলা ফিরে আসার কোনো উপায় নেই — সাইটটি শুধু চলে গেছে বা ভাঙা যতক্ষণ না শুরু থেকে পুনর্নির্মাণ করা হয়, যা প্রায়ই সময়ে backup কখনো খরচ করতো তার চেয়ে অনেক বেশি ব্যয়বহুল।</p>'),
      table(
        ['উৎস', 'এটি সাধারণত কী কভার করে'],
        [
          ['হোস্টিং-প্রদানকারী backup', 'প্রায়ই managed প্ল্যাটফর্মে স্বয়ংক্রিয়ভাবে অন্তর্ভুক্ত, কখনো কখনো shared বা VPS হোস্টিং-এ একটি পেইড অ্যাড-অন হিসেবে — অনুমান করার বদলে নিশ্চিত করার যোগ্য'],
          ['Application-স্তরের backup', 'একটি WordPress backup plugin বা অনুরূপ, নিজস্ব সময়সূচীতে database আর ফাইল export করা, host যা করে তা থেকে স্বাধীন'],
          ['এই সাইটের নিজস্ব পদ্ধতি', 'এই প্রকল্পের নিজস্ব <a href="/bn/hosting/">CLAUDE.md</a> অনুশীলন অনুযায়ী, একটি দৈনিক স্বয়ংক্রিয় কাজ যা কন্টেন্টকে সংস্করণযুক্ত ফাইল হিসেবে export করে — একই ধারণা পুরো সার্ভারের বদলে কন্টেন্ট স্তরে প্রয়োগ করা'],
        ]
      ),

      img(
        'docs/img/hosting/backups-1',
        'Isometric ডায়াগ্রাম যেখানে "daily backup" লেবেল করা একটি ঘড়ি আইকনসহ একটি ওয়েবসাইট সার্ভার দেখানো হয়েছে, একটি তীর live সার্ভার থেকে নিরাপদে আলাদা সংরক্ষিত সাইটের আলাদা archived কপির একটি স্তূপের দিকে নির্দেশ করছে',
        1024, 768,
        'একটি backup তখনই দরকারী যখন এটি যা backup করছে তা থেকে আলাদা।'
      ),

      h(2, 'মেয়াদ শেষের তারিখ যা আসলে গুরুত্বপূর্ণ', 'expiry-dates-that-actually-matter'),
      table(
        ['কীসের মেয়াদ শেষ হয়', 'মেয়াদ শেষ হলে কী ঘটে'],
        [
          ['ডোমেইন নিবন্ধন', 'একটি grace period পরে, ডোমেইন যে কারো নিবন্ধন করার জন্য উপলব্ধ হয়ে যায় — এই তালিকার সবচেয়ে গুরুতর মেয়াদ শেষ, কারণ এর অর্থ হতে পারে ডোমেইন সম্পূর্ণভাবে হারানো'],
          ['SSL সার্টিফিকেট', 'HTTPS পাঠে কভার করা — ভিজিটররা একটি নিরাপত্তা সতর্কতা দেখে; আধুনিক বিনামূল্যের সার্টিফিকেট স্বয়ংক্রিয়ভাবে renew হয়, কিন্তু পুরোনো ম্যানুয়াল সেটআপ হয় না'],
          ['হোস্টিং পরিকল্পনা', 'একটি পেইড পরিকল্পনার মেয়াদ শেষ হলে সাইট সাধারণত অফলাইনে যায়, যদিও বেশিরভাগ প্রদানকারী প্রথমে কিছু সতর্কতা দেয়'],
        ]
      ),

      h(2, 'আপডেট', 'updates'),
      p('<p>এই সাইটের <a href="/bn/design/">design বিভাগ</a>-এর security-basics পাঠ এটি নিরাপত্তা দিক থেকে কভার করে; এখানে বিষয়টি সম্পূর্ণভাবে অপারেশনাল — CMS প্ল্যাটফর্ম (বিশেষভাবে WordPress), plugin, আর সার্ভার সফটওয়্যার সবই সময়ের সাথে নিরাপত্তা patch পায়, আর একটি প্যাচবিহীন, সেকেলে ইনস্টলেশন আসল সাইট আপস হওয়ার একটি সত্যিই সাধারণ উপায়। এটি চলমান রক্ষণাবেক্ষণ, একটি একবারের সেটআপ কাজ নয়।</p>'),

      callout('note', '<p>এর কোনোটিই আলাদাভাবে কঠিন নয় — এটি ঠিক এই কারণে উপেক্ষা করা সহজ যে অনেক দীর্ঘ সময় ধরে কিছুই ভুল হয় না, যতক্ষণ না একবার যখন একটি backup গুরুত্বপূর্ণ হতো আর কোনোটি নেই। ডোমেইন renewal-এর জন্য একটি ক্যালেন্ডার রিমাইন্ডার সেট করা এই তালিকার সবচেয়ে গুরুতর আইটেমের বিরুদ্ধে সত্যিই একটি যথেষ্ট প্রতিরক্ষা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'migrating-between-providers',
  sortOrder: 38,
  en: {
    title: 'Migrating Between Providers',
    metaTitle: 'How to Migrate a Website Between Hosts | Learn Computer Academy',
    metaDescription: 'Moving a live site to a new host or registrar without downtime or lost email — the order of operations that actually matters.',
    blocks: [
      p('<p>Outgrowing a host, chasing a better price, or simply switching providers is common — this lesson covers how to do it without the site or its email going down in the process.</p>'),

      h(2, 'Two Separate Migrations, Often Confused'),
      table(
        ['Migration', 'What actually moves'],
        [
          ['Domain transfer', 'Moving a domain\'s registration from one registrar to another — the domain itself does not change, only who you renew it through'],
          ['Hosting migration', 'Moving a site\'s actual files and database to a new hosting provider — the domain can stay registered exactly where it is throughout'],
        ]
      ),
      p('<p>These are independent — a domain can be registered with one company while hosting lives with a completely different one, exactly as established in the domain-hosting-email-are-separate lesson early in this category. Most moves only require one of the two, not both.</p>'),

      h(2, 'The Safe Order of Operations for a Hosting Migration'),
      p('<ol><li>Set up the site on the new host, fully, without touching the domain\'s DNS yet — old and new both exist at this point, but only the old one is publicly reachable.</li><li>Test the new copy thoroughly using the new host\'s temporary URL, or by editing your own computer\'s hosts file to preview it before DNS changes.</li><li>Copy over the database, if any, as close to the cutover as possible so nothing entered on the old site in between is lost.</li><li>Update the DNS records (per the connecting-a-domain lesson) to point at the new host.</li><li>Wait for propagation, keeping the old host active and untouched throughout — do not cancel or delete it yet.</li><li>Confirm the new site is live and correct for visitors before cancelling the old hosting plan.</li></ol>'),

      img(
        'docs/img/hosting/migration-1',
        'Isometric diagram showing a website being copied from an old server icon to a new server icon while a domain nameplate above both still points to the old server, with a dotted arrow showing the DNS switch happening only after the copy completes',
        1024, 768,
        'The domain keeps pointing at the old host until the new one is verified working.'
      ),

      h(2, 'Why This Order Prevents Downtime'),
      p('<p>DNS propagation, covered earlier in this category, means a change is never instant across every visitor — pointing DNS at a new host before it is fully ready and tested guarantees some visitors see a broken site during that window. Keeping the old host live and untouched until the new one is confirmed working removes that risk entirely; the old copy is the fallback for the exact period propagation is unpredictable.</p>'),

      h(2, 'Email During a Migration'),
      p('<p>If email is hosted separately from the website (the common case, per the earlier email lesson), it is entirely unaffected by a hosting migration — only the A/CNAME records controlling the website change, not the MX records controlling mail. Email only needs attention here if the migration specifically involves switching email providers too, in which case it follows this same safe-order principle on its own MX records.</p>'),
    ],
  },
  bn: {
    title: 'প্রদানকারীর মধ্যে Migration',
    metaTitle: 'কীভাবে একটি ওয়েবসাইট প্রদানকারীর মধ্যে Migrate করবেন | Learn Computer Academy',
    metaDescription: 'একটি live সাইটকে downtime বা হারানো ইমেইল ছাড়া একটি নতুন host বা registrar-এ সরানো — অপারেশনের ক্রম যা আসলে গুরুত্বপূর্ণ।',
    blocks: [
      p('<p>একটি host ছাড়িয়ে যাওয়া, একটি ভালো দামের পিছনে ছোটা, বা শুধু প্রদানকারী পরিবর্তন করা সাধারণ — এই পাঠ কভার করে প্রক্রিয়ায় সাইট বা এর ইমেইল বন্ধ না করে কীভাবে এটি করবেন।</p>'),

      h(2, 'দুটি আলাদা Migration, প্রায়ই বিভ্রান্ত হয়', 'two-separate-migrations-often-confused'),
      table(
        ['Migration', 'আসলে কী সরে'],
        [
          ['ডোমেইন transfer', 'একটি ডোমেইনের নিবন্ধন এক registrar থেকে অন্যটিতে সরানো — ডোমেইন নিজেই পরিবর্তন হয় না, শুধু আপনি কার মাধ্যমে renew করেন'],
          ['হোস্টিং migration', 'একটি সাইটের আসল ফাইল আর database একটি নতুন হোস্টিং প্রদানকারীর কাছে সরানো — ডোমেইন পুরো সময় ঠিক যেখানে আছে সেখানেই নিবন্ধিত থাকতে পারে'],
        ]
      ),
      p('<p>এগুলো স্বাধীন — একটি ডোমেইন এক কোম্পানির সাথে নিবন্ধিত হতে পারে যখন হোস্টিং সম্পূর্ণ ভিন্ন একটির সাথে থাকে, ঠিক যেমন এই বিভাগের শুরুর দিকে domain-hosting-email-are-separate পাঠে প্রতিষ্ঠিত। বেশিরভাগ সরানোর জন্য শুধু দুটির একটি দরকার, দুটোই নয়।</p>'),

      h(2, 'একটি হোস্টিং Migration-এর জন্য নিরাপদ অপারেশনের ক্রম', 'the-safe-order-of-operations-for-a-hosting-migration'),
      p('<p><ol><li>নতুন host-এ সাইট সম্পূর্ণভাবে সেট আপ করুন, এখনও ডোমেইনের DNS স্পর্শ না করে — এই মুহূর্তে পুরোনো আর নতুন দুটোই আছে, কিন্তু শুধু পুরোনোটি পাবলিকভাবে পৌঁছানো যায়।</li><li>নতুন host-এর সাময়িক URL ব্যবহার করে, বা DNS পরিবর্তনের আগে এটি preview করতে আপনার নিজের কম্পিউটারের hosts ফাইল সম্পাদনা করে নতুন কপি পুঙ্খানুপুঙ্খভাবে পরীক্ষা করুন।</li><li>যদি কোনো database থাকে, তা cutover-এর যতটা কাছাকাছি সম্ভব কপি করুন যাতে মাঝখানে পুরোনো সাইটে প্রবেশ করা কিছু হারিয়ে না যায়।</li><li>নতুন host নির্দেশ করতে DNS রেকর্ড আপডেট করুন (connecting-a-domain পাঠ অনুযায়ী)।</li><li>propagation-এর জন্য অপেক্ষা করুন, পুরো সময় পুরোনো host সক্রিয় আর অস্পৃষ্ট রেখে — এটি এখনও বাতিল বা মুছবেন না।</li><li>পুরোনো হোস্টিং পরিকল্পনা বাতিল করার আগে নিশ্চিত করুন নতুন সাইট ভিজিটরদের জন্য live আর সঠিক।</li></ol></p>'),

      img(
        'docs/img/hosting/migration-1',
        'Isometric ডায়াগ্রাম যেখানে একটি ওয়েবসাইট একটি পুরোনো সার্ভার আইকন থেকে একটি নতুন সার্ভার আইকনে কপি হচ্ছে দেখানো হয়েছে যখন দুটোর উপরে একটি ডোমেইন নেমপ্লেট এখনও পুরোনো সার্ভারের দিকে নির্দেশ করছে, একটি ডটেড তীর দেখাচ্ছে DNS পরিবর্তন শুধু কপি সম্পূর্ণ হওয়ার পরে ঘটছে',
        1024, 768,
        'নতুনটি কাজ করছে যাচাই না হওয়া পর্যন্ত ডোমেইন পুরোনো host-এর দিকে নির্দেশ করতে থাকে।'
      ),

      h(2, 'এই ক্রম কেন Downtime প্রতিরোধ করে', 'why-this-order-prevents-downtime'),
      p('<p>DNS propagation, এই বিভাগে আগে কভার করা, মানে একটি পরিবর্তন প্রতিটি ভিজিটরের জুড়ে কখনো তাৎক্ষণিক নয় — এটি সম্পূর্ণভাবে প্রস্তুত আর পরীক্ষিত হওয়ার আগে একটি নতুন host-এ DNS নির্দেশ করা নিশ্চিত করে যে সেই সময়ে কিছু ভিজিটর একটি ভাঙা সাইট দেখে। নতুনটি কাজ করছে নিশ্চিত না হওয়া পর্যন্ত পুরোনো host live আর অস্পৃষ্ট রাখা সেই ঝুঁকি সম্পূর্ণভাবে দূর করে; পুরোনো কপি হলো ঠিক সেই সময়ের জন্য fallback যখন propagation অপ্রত্যাশিত।</p>'),

      h(2, 'একটি Migration-এর সময় ইমেইল', 'email-during-a-migration'),
      p('<p>যদি ইমেইল ওয়েবসাইট থেকে আলাদাভাবে host করা হয় (সাধারণ ক্ষেত্র, আগের ইমেইল পাঠ অনুযায়ী), এটি একটি হোস্টিং migration দ্বারা সম্পূর্ণভাবে অপ্রভাবিত থাকে — শুধু A/CNAME রেকর্ড যা ওয়েবসাইট নিয়ন্ত্রণ করে পরিবর্তন হয়, মেইল নিয়ন্ত্রণকারী MX রেকর্ড নয়। ইমেইলের এখানে শুধু মনোযোগ দরকার যদি migration নির্দিষ্টভাবে ইমেইল প্রদানকারীও পরিবর্তন করা জড়িত থাকে, সেক্ষেত্রে এটি তার নিজের MX রেকর্ডে এই একই নিরাপদ-ক্রম নীতি অনুসরণ করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'when-your-site-goes-down',
  sortOrder: 39,
  en: {
    title: 'When Your Site Goes Down',
    metaTitle: 'Website Down? How to Diagnose It | Learn Computer Academy',
    metaDescription: 'A calm, ordered way to figure out what actually broke — domain, DNS, hosting, or the site itself — before reacting.',
    blocks: [
      p('<p>Every concept needed to diagnose a down site has already appeared somewhere in this category. This lesson is a single ordered checklist that ties them together for the moment it actually happens.</p>'),

      h(2, 'Step 1: Confirm It Is Actually Down'),
      p('<p>Check the site from a different network — mobile data instead of the current Wi-Fi, or a site-checking tool that loads the page from an outside server. A single device or network having trouble is a very different problem from the whole site being down for everyone.</p>'),

      h(2, 'Step 2: Check the Domain'),
      p('<p>Confirm the domain has not expired — a lapsed registration, covered in the previous lesson, is one of the most common causes of a suddenly-dead site and one of the easiest to overlook, since nothing about the site\'s files or hosting changed at all.</p>'),

      h(2, 'Step 3: Check DNS'),
      p('<p>Confirm the domain\'s DNS records still point where they should — a records lesson covered how to inspect these; an accidentally changed or deleted record is a common cause, especially right after a migration or a provider switch.</p>'),

      h(2, 'Step 4: Check the Host Directly'),
      p('<p>Try reaching the hosting provider\'s own status page or dashboard — an outage on the provider\'s side, a lapsed hosting plan, or a suspended account (sometimes triggered by exceeding a free-tier limit, covered in the free-hosting lesson) all live here, independent of DNS or the domain.</p>'),

      img(
        'docs/img/hosting/downtime-1',
        'Isometric flowchart diagram showing a decision tree starting from a red down website icon, branching through checkpoints labelled domain, DNS, and host, each with a yes or no path leading toward a found problem icon',
        1024, 768,
        'Working through causes in order, instead of guessing, finds the actual problem faster.'
      ),

      h(2, 'Step 5: Check the Application Itself'),
      p('<p>If the domain, DNS, and host all check out, the problem is likely in the site\'s own code, a recent update, or its database — check the host\'s error logs, and consider whether a recent change (a new plugin, an update, a deploy) lines up with when the problem started.</p>'),

      h(2, 'Why This Order Specifically'),
      p('<p>The list moves from the most catastrophic and most overlooked cause (domain expiry) toward the most granular (application code), and each step is something the earlier lessons in this category already explained how to check. Reacting immediately by rebuilding or restoring from a backup, before actually confirming the cause, risks losing time on a fix that does not match the real problem — or discarding work that a calmer diagnosis would have shown was never actually lost.</p>'),

      callout('note', '<p>This is precisely why the backups lesson matters as much as it does — once the actual cause is found, a backup is frequently the fastest real fix, but only after the cause is known, not as the first reflexive step.</p>'),
    ],
  },
  bn: {
    title: 'যখন আপনার সাইট ডাউন হয়ে যায়',
    metaTitle: 'ওয়েবসাইট ডাউন? এটি কীভাবে নির্ণয় করবেন | Learn Computer Academy',
    metaDescription: 'আসলে কী ভেঙেছে তা বের করার একটি শান্ত, ক্রমযুক্ত উপায় — ডোমেইন, DNS, হোস্টিং, বা সাইট নিজেই — প্রতিক্রিয়া জানানোর আগে।',
    blocks: [
      p('<p>একটি ডাউন সাইট নির্ণয় করতে প্রয়োজনীয় প্রতিটি ধারণা এই বিভাগে ইতিমধ্যে কোথাও উপস্থিত হয়েছে। এই পাঠ একটি একক ক্রমযুক্ত checklist যা এটি আসলে ঘটার মুহূর্তের জন্য তাদের একসাথে বাঁধে।</p>'),

      h(2, 'ধাপ ১: নিশ্চিত করুন এটি আসলে ডাউন', 'step-1-confirm-it-is-actually-down'),
      p('<p>একটি ভিন্ন নেটওয়ার্ক থেকে সাইট চেক করুন — বর্তমান Wi-Fi-এর বদলে মোবাইল ডেটা, বা একটি সাইট-চেকিং টুল যা একটি বাইরের সার্ভার থেকে পাতা লোড করে। একটি একক ডিভাইস বা নেটওয়ার্কের সমস্যা হওয়া পুরো সাইট সবার জন্য ডাউন হওয়া থেকে একটি খুব ভিন্ন সমস্যা।</p>'),

      h(2, 'ধাপ ২: ডোমেইন চেক করুন', 'step-2-check-the-domain'),
      p('<p>নিশ্চিত করুন ডোমেইনের মেয়াদ শেষ হয়নি — আগের পাঠে কভার করা একটি মেয়াদ শেষ হওয়া নিবন্ধন, হঠাৎ-মৃত সাইটের সবচেয়ে সাধারণ কারণগুলোর একটি আর উপেক্ষা করার সবচেয়ে সহজগুলোর একটি, কারণ সাইটের ফাইল বা হোস্টিং সম্পর্কে কিছুই পরিবর্তন হয়নি।</p>'),

      h(2, 'ধাপ ৩: DNS চেক করুন', 'step-3-check-dns'),
      p('<p>নিশ্চিত করুন ডোমেইনের DNS রেকর্ড এখনও যেখানে থাকা উচিত সেখানে নির্দেশ করে — একটি records পাঠ কভার করেছিল এগুলো কীভাবে পরিদর্শন করতে হয়; একটি দুর্ঘটনাক্রমে পরিবর্তিত বা মুছে ফেলা রেকর্ড একটি সাধারণ কারণ, বিশেষভাবে একটি migration বা প্রদানকারী পরিবর্তনের ঠিক পরে।</p>'),

      h(2, 'ধাপ ৪: সরাসরি Host চেক করুন', 'step-4-check-the-host-directly'),
      p('<p>হোস্টিং প্রদানকারীর নিজস্ব status পাতা বা dashboard-এ পৌঁছানোর চেষ্টা করুন — প্রদানকারীর দিকে একটি আউটেজ, একটি মেয়াদ শেষ হওয়া হোস্টিং পরিকল্পনা, বা একটি স্থগিত অ্যাকাউন্ট (কখনো কখনো একটি free-tier সীমা অতিক্রম করে trigger হয়, free-hosting পাঠে কভার করা) সবই এখানে থাকে, DNS বা ডোমেইন থেকে স্বাধীন।</p>'),

      img(
        'docs/img/hosting/downtime-1',
        'Isometric ফ্লোচার্ট ডায়াগ্রাম যেখানে একটি লাল ডাউন ওয়েবসাইট আইকন থেকে শুরু হওয়া একটি সিদ্ধান্ত গাছ দেখানো হয়েছে, "domain", "DNS", আর "host" লেবেল করা checkpoint-এর মধ্য দিয়ে branch হয়ে, প্রতিটির একটি yes বা no পথ একটি "found problem" আইকনের দিকে নিয়ে যাচ্ছে',
        1024, 768,
        'অনুমান করার বদলে ক্রমানুসারে কারণগুলো পরীক্ষা করা আসল সমস্যা দ্রুত খুঁজে পায়।'
      ),

      h(2, 'ধাপ ৫: Application নিজেই চেক করুন', 'step-5-check-the-application-itself'),
      p('<p>যদি ডোমেইন, DNS, আর host সব ঠিক থাকে, সমস্যাটি সম্ভবত সাইটের নিজস্ব কোডে, একটি সাম্প্রতিক আপডেটে, বা এর database-এ — host-এর error log চেক করুন, আর বিবেচনা করুন একটি সাম্প্রতিক পরিবর্তন (একটি নতুন plugin, একটি আপডেট, একটি deploy) সমস্যা শুরু হওয়ার সময়ের সাথে মেলে কিনা।</p>'),

      h(2, 'এই ক্রম নির্দিষ্টভাবে কেন', 'why-this-order-specifically'),
      p('<p>তালিকাটি সবচেয়ে বিপর্যয়কর আর সবচেয়ে উপেক্ষিত কারণ (ডোমেইন মেয়াদ শেষ) থেকে সবচেয়ে দানাদার (application কোড) দিকে চলে যায়, আর প্রতিটি ধাপ এমন কিছু যা এই বিভাগের আগের পাঠগুলো ইতিমধ্যে ব্যাখ্যা করেছে কীভাবে চেক করতে হয়। আসলে কারণ নিশ্চিত করার আগে তাৎক্ষণিকভাবে পুনর্নির্মাণ করে বা একটি backup থেকে পুনরুদ্ধার করে প্রতিক্রিয়া জানানো একটি সমাধানে সময় হারানোর ঝুঁকি নেয় যা আসল সমস্যার সাথে মেলে না — বা এমন কাজ বাতিল করা যা একটি শান্ত নির্ণয় দেখাতো যে আসলে হারায়নি।</p>'),

      callout('note', '<p>এটিই ঠিক কেন backup পাঠ এত গুরুত্বপূর্ণ — একবার আসল কারণ খুঁজে পাওয়া গেলে, একটি backup প্রায়ই সবচেয়ে দ্রুত আসল সমাধান, কিন্তু শুধু কারণ জানা হলে, প্রথম প্রতিবর্তী ধাপ হিসেবে নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'going-live-where-this-leaves-you',
  sortOrder: 40,
  en: {
    title: 'Going Live — Where This Leaves You',
    metaTitle: 'Going Live — Where This Leaves You | Learn Computer Academy',
    metaDescription: 'A closing checklist tying together domains, hosting, DNS, and deployment, plus what to actually learn next.',
    blocks: [
      p('<p>This category opened with a single question a student asks after finishing a course here: how do you actually make a site live? Forty lessons later, here is the shape of the full answer, and where to go from it.</p>'),

      h(2, 'The Full Picture, In One Table'),
      table(
        ['Piece', 'What it does'],
        [
          ['Domain', 'A human-readable name for a site, registered through a registrar, renewed on a schedule'],
          ['DNS', 'The system that points a domain at wherever the site actually lives'],
          ['Hosting', 'The computer, of whatever type fits the project, actually running the site'],
          ['Email', 'A separate service, connected to the domain via its own record type, entirely independent of hosting'],
          ['HTTPS', 'Encryption and identity verification, now essentially free and mandatory'],
          ['CDN / edge', 'Optional infrastructure that puts a site\'s content physically closer to visitors'],
        ]
      ),

      img(
        'docs/img/hosting/going-live-1',
        'Isometric diagram showing all the pieces from this course — a domain nameplate, a DNS server, a hosting server, an email server, a padlock for HTTPS, and a CDN globe icon — connected together into one complete working website system',
        1024, 768,
        'Every piece from this category, assembled into the one system a live site actually is.'
      ),

      h(2, 'A Launch Checklist'),
      p('<p><ol><li>Domain registered, with auto-renewal on, or a reminder set well before expiry.</li><li>Hosting chosen to match the project\'s actual stack, per the choosing-hosting-for-your-stack lesson.</li><li>DNS records pointed correctly, and propagation confirmed complete.</li><li>HTTPS enabled, with HTTP redirecting to it.</li><li>Email, if needed, connected with SPF, DKIM, and DMARC all configured.</li><li>Secrets kept in environment variables, never in code.</li><li>A backup schedule confirmed to actually be running, not just assumed.</li></ol></p>'),

      h(2, 'Where This Connects to the Rest of the Site'),
      p('<p>This category assumed a finished project from one of the course tracks — HTML/CSS/JS, PHP, WordPress, React, or Node.js — and covered getting it live. The <a href="/career/">Career Skills</a> category, which this category exists specifically to support, covers what comes after: turning a live, deployed project into <a href="/career/proof-of-work/">proof of work</a> for a job search. A finished project that only exists on a local machine cannot do that job — this category is what closes that specific gap.</p>'),

      callout('note', '<p>Not every project needs everything in this category on day one. A first portfolio piece genuinely only needs static hosting, a working domain, and HTTPS — the deeper lessons on VPS servers, CDNs, and multi-environment staging are for when a project grows into needing them, not a checklist to complete before a first site is allowed to go live.</p>', 'Start with the basics — the rest is here when you need it'),
    ],
  },
  bn: {
    title: 'Live হওয়া — এটি আপনাকে কোথায় রেখে যায়',
    metaTitle: 'Live হওয়া — এটি আপনাকে কোথায় রেখে যায় | Learn Computer Academy',
    metaDescription: 'ডোমেইন, হোস্টিং, DNS, আর deployment একসাথে বাঁধা একটি সমাপনী checklist, আর এরপর আসলে কী শিখবেন।',
    blocks: [
      p('<p>এই বিভাগ একটি একক প্রশ্ন দিয়ে খুলেছিল যা একজন শিক্ষার্থী এখানে একটি কোর্স শেষ করার পরে জিজ্ঞাসা করে: আপনি আসলে কীভাবে একটি সাইট live করবেন? চল্লিশটি পাঠ পরে, এখানে সম্পূর্ণ উত্তরের আকৃতি, আর এখান থেকে কোথায় যেতে হবে।</p>'),

      h(2, 'সম্পূর্ণ ছবি, একটি টেবিলে', 'the-full-picture-in-one-table'),
      table(
        ['অংশ', 'এটি কী করে'],
        [
          ['ডোমেইন', 'একটি সাইটের জন্য একটি মানুষ-পঠনযোগ্য নাম, একটি registrar-এর মাধ্যমে নিবন্ধিত, একটি সময়সূচীতে renew করা'],
          ['DNS', 'সিস্টেম যা একটি ডোমেইনকে নির্দেশ করে সাইটটি আসলে যেখানে থাকে সেখানে'],
          ['হোস্টিং', 'প্রকল্পের সাথে মানানসই যেকোনো ধরনের কম্পিউটার, আসলে সাইট চালাচ্ছে'],
          ['ইমেইল', 'একটি আলাদা সেবা, ডোমেইনের সাথে এর নিজস্ব রেকর্ড ধরনের মাধ্যমে সংযুক্ত, হোস্টিং থেকে সম্পূর্ণ স্বাধীন'],
          ['HTTPS', 'এনক্রিপশন আর পরিচয় যাচাইকরণ, এখন মূলত বিনামূল্যে আর বাধ্যতামূলক'],
          ['CDN / edge', 'ঐচ্ছিক অবকাঠামো যা একটি সাইটের কন্টেন্টকে শারীরিকভাবে ভিজিটরদের কাছাকাছি রাখে'],
        ]
      ),

      img(
        'docs/img/hosting/going-live-1',
        'Isometric ডায়াগ্রাম যেখানে এই কোর্সের সব অংশ দেখানো হয়েছে — একটি ডোমেইন নেমপ্লেট, একটি DNS সার্ভার, একটি হোস্টিং সার্ভার, একটি ইমেইল সার্ভার, HTTPS-এর জন্য একটি padlock, আর একটি CDN globe আইকন — একসাথে সংযুক্ত একটি সম্পূর্ণ কার্যকরী ওয়েবসাইট সিস্টেমে',
        1024, 768,
        'এই বিভাগের প্রতিটি অংশ, একটি live সাইট আসলে যে সিস্টেম তাতে একত্রিত।'
      ),

      h(2, 'একটি Launch Checklist', 'a-launch-checklist'),
      p('<p><ol><li>ডোমেইন নিবন্ধিত, auto-renewal চালু, বা মেয়াদ শেষের অনেক আগে একটি রিমাইন্ডার সেট করা।</li><li>choosing-hosting-for-your-stack পাঠ অনুযায়ী, প্রকল্পের আসল stack-এর সাথে মিলিয়ে হোস্টিং বাছাই করা।</li><li>DNS রেকর্ড সঠিকভাবে নির্দেশিত, আর propagation সম্পূর্ণ নিশ্চিত।</li><li>HTTPS সক্রিয়, HTTP এতে redirect হচ্ছে।</li><li>প্রয়োজনে, SPF, DKIM, আর DMARC সব কনফিগার করে ইমেইল সংযুক্ত।</li><li>Secret environment variable-এ রাখা, কখনো কোডে নয়।</li><li>একটি backup সময়সূচী আসলে চলছে তা নিশ্চিত করা, শুধু অনুমান করা নয়।</li></ol></p>'),

      h(2, 'এটি সাইটের বাকি অংশের সাথে কীভাবে সংযুক্ত', 'where-this-connects-to-the-rest-of-the-site'),
      p('<p>এই বিভাগ কোর্স ট্র্যাকগুলোর একটি থেকে একটি সমাপ্ত প্রকল্প ধরে নিয়েছিল — HTML/CSS/JS, PHP, WordPress, React, বা Node.js — আর এটি live করা কভার করেছিল। <a href="/bn/career/">Career Skills</a> বিভাগ, যা এই বিভাগ নির্দিষ্টভাবে সমর্থন করার জন্য বিদ্যমান, কভার করে এরপর কী আসে: একটি live, deploy করা প্রকল্পকে চাকরি খোঁজার জন্য <a href="/bn/career/proof-of-work/">proof of work</a>-এ পরিণত করা। একটি সমাপ্ত প্রকল্প যা শুধু একটি স্থানীয় মেশিনে বিদ্যমান তা সেই কাজ করতে পারে না — এই বিভাগ সেই নির্দিষ্ট ফাঁক বন্ধ করে।</p>'),

      callout('note', '<p>প্রতিটি প্রকল্পের প্রথম দিনেই এই বিভাগে সবকিছু দরকার হয় না। একটি প্রথম portfolio অংশের সত্যিই শুধু static হোস্টিং, একটি কার্যকর ডোমেইন, আর HTTPS দরকার — VPS সার্ভার, CDN, আর multi-environment staging-এর গভীর পাঠগুলো তখনের জন্য যখন একটি প্রকল্প সেগুলোর প্রয়োজনে বেড়ে ওঠে, একটি প্রথম সাইট live হতে দেওয়ার আগে সম্পূর্ণ করার একটি checklist নয়।</p>', 'মৌলিক বিষয় দিয়ে শুরু করুন — বাকিটা এখানে আছে যখন আপনার দরকার হবে'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'hosting').single()
  if (catErr || !category) {
    console.error('Category "hosting" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] hosting/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] hosting/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `hosting/${lesson.slug}`
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
