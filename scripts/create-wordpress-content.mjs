#!/usr/bin/env node
// New "WordPress" category — 26 lessons, per the outline approved with the
// site owner 2026-07-30 (docs/CONTENT-PIPELINE.md). Scope is deliberately
// custom theme development, not general WordPress usage: no Gutenberg (the
// site owner's real build pipeline installs the Classic Editor plugin on
// every project), no page builders (Elementor/Divi are shown to students
// separately but are not what this category teaches), and the two plugins
// that carry the custom-post-type/custom-field workload are CPT UI and
// Secure Custom Fields (SCF) — the actively-maintained, open-source fork of
// ACF. Builds on the existing `php` category for PHP syntax itself, which
// isn't re-taught here.
//
// Grounded in the site owner's own real theme conventions (read from
// github.com/amartadey/wordpress — the wgh-starter reference theme and its
// auto-setup plugin: Classic Editor + Secure Custom Fields installed by
// default, a minimal file set, add_theme_support/register_nav_menus in
// functions.php) rather than a generic tutorial shape. Original prose
// throughout — CONTENT-PIPELINE.md §3 — patterns are inspired by that real
// theme, not copied from it.
//
// Run incrementally as lessons are written — idempotent, safe to re-run;
// upserts on `path` / `doc_id,locale`.
//
// Usage: node scripts/create-wordpress-content.mjs [--dry-run]

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
    title: 'Introduction to Custom WordPress Theme Development',
    metaTitle: 'Introduction to Custom WordPress Theme Development | Learn Computer Academy',
    metaDescription: 'What building a custom WordPress theme actually means, why this section skips the block editor and page builders, and the three plugins that carry the workload instead.',
    blocks: [
      p('<p>WordPress powers a huge share of the websites on the internet, but there are two very different ways to build with it. One is dragging blocks or page-builder widgets onto a page and never opening a code editor. The other — what this section teaches — is writing the actual PHP template files yourself, so you control exactly what a theme does, down to the last detail.</p>'),

      h(2, 'What Makes a Theme "Custom"'),
      p('<p>A WordPress <b>theme</b> is the set of files that decides how a site looks and how its content is arranged on the page. An off-the-shelf theme from the WordPress theme directory is built to work for thousands of different sites at once, which means it\'s full of settings, options, and compromises it has to make to stay generic.</p><p>A <b>custom theme</b> is built for one site. Every template file exists because that specific site needs it, and nothing else is in the way. That\'s the trade you\'re making by learning to build one by hand: more work up front, in exchange for a site that does exactly what it needs to and nothing more.</p>'),

      h(2, 'Why This Section Skips the Block Editor'),
      p('<p>Since WordPress 5.0, the default way to write a page has been the <b>block editor</b> (also called Gutenberg) — a drag-and-drop interface for arranging content in blocks, built directly into the pages and posts screens. It\'s genuinely useful for a lot of sites, especially ones a non-technical owner needs to edit themselves without any help.</p><p>It\'s a poor fit for custom theme work, though. A block-based page stores its layout as HTML markup mixed into the post content itself, which fights against a theme built to control layout through its own PHP templates instead. This section builds themes the other way: content stays simple (plain text and structured custom fields), and the <b>theme\'s PHP files</b> — not the editor — decide how everything is laid out and displayed.</p>'),

      callout('note', '<p>Page builder plugins like Elementor and Divi solve a similar problem a different way — visual, drag-and-drop page building, but as a plugin layered on top of any theme. They\'re useful tools and worth knowing about, but they\'re a separate skill from what this section teaches. Here, the theme\'s own PHP code is what controls the page.</p>', 'What about Elementor or Divi?'),

      h(2, 'The Toolkit'),
      p('<p>Three plugins do almost all of the heavy lifting for the kind of custom theme this section builds:</p>'),
      table(
        ['Plugin', 'What it does', 'Why it\'s used here'],
        [
          ['Classic Editor', 'Replaces the block editor with the older, plain content editor', 'Keeps post content simple — plain text, not layout markup — so the theme\'s templates stay in charge of layout'],
          ['CPT UI', 'Registers custom post types and custom taxonomies through an admin screen, no PHP required', 'Lets a theme model real content types — "Projects," "Team Members," "Testimonials" — instead of stretching regular posts to fit'],
          ['Secure Custom Fields (SCF)', 'Adds structured custom fields (text, images, repeaters, and more) to any content type', 'Gives editors real structured fields to fill in, and gives templates a reliable, typed way to read that data back out'],
        ]
      ),
      p('<p>None of these are strictly required — WordPress can register post types and custom fields with plain PHP code alone — but all three are genuinely the practical, real-world way this kind of theme gets built, and they\'re what the rest of this section uses throughout.</p>'),

      img(
        'docs/img/wordpress/introduction-1',
        'Isometric diagram of a browser request reaching a server running WordPress, PHP template files and a database producing a finished page, and that page being sent back to the browser',
        1024, 768,
        'A custom theme is PHP files deciding what a page looks like — not blocks, not a page builder.'
      ),

      h(2, 'What You Should Already Know'),
      p('<p>This section assumes you\'re already comfortable with HTML, CSS, and PHP\'s own syntax — variables, conditionals, loops, and functions. If PHP itself still feels shaky, it\'s worth spending time in the <a href="/php/introduction/">PHP section</a> first; everything from here on assumes that part is second nature, and focuses purely on how WordPress uses PHP to build a site.</p>'),

      p('<p>The next lesson gets an actual WordPress install running locally, so every example from here on is something you can build and click through yourself.</p>'),
    ],
  },
  bn: {
    title: 'কাস্টম WordPress থিম ডেভেলপমেন্ট পরিচিতি',
    metaTitle: 'কাস্টম WordPress থিম ডেভেলপমেন্ট পরিচিতি | Learn Computer Academy',
    metaDescription: 'একটি কাস্টম WordPress থিম বানানো আসলে কী, এই অংশটি কেন ব্লক এডিটর আর পেজ বিল্ডার বাদ দেয়, আর সেই তিনটি প্লাগইন যা এর বদলে কাজটা করে।',
    blocks: [
      p('<p>ইন্টারনেটের একটা বিশাল অংশ WordPress দিয়ে চলে, কিন্তু এটি দিয়ে বানানোর দুটো একদম আলাদা উপায় আছে। একটি হলো ব্লক বা পেজ-বিল্ডার widget টেনে এনে একটি পাতায় বসিয়ে দেওয়া, কোনোদিন কোড এডিটর না খুলে। আরেকটি — যা এই অংশে শেখানো হবে — হলো আসল PHP টেমপ্লেট ফাইলগুলো নিজে লেখা, যাতে একটি থিম ঠিক কী করবে তার শেষ খুঁটিনাটি পর্যন্ত আপনার নিয়ন্ত্রণে থাকে।</p>'),

      h(2, '"কাস্টম" থিম মানে কী', 'what-makes-a-theme-custom'),
      p('<p>একটি WordPress <b>থিম</b> হলো ফাইলগুলোর একটি সেট যা ঠিক করে একটি সাইট দেখতে কেমন হবে আর তার কন্টেন্ট পাতায় কীভাবে সাজানো থাকবে। WordPress থিম ডিরেক্টরির একটি রেডিমেড থিম হাজার হাজার আলাদা সাইটে একসাথে কাজ করার জন্য তৈরি, যার মানে এতে অনেক সেটিংস, অপশন, আর জেনেরিক থাকার জন্য প্রয়োজনীয় নানা সমঝোতা ভরা থাকে।</p><p>একটি <b>কাস্টম থিম</b> একটি নির্দিষ্ট সাইটের জন্য বানানো হয়। প্রতিটি টেমপ্লেট ফাইল আছে কারণ সেই নির্দিষ্ট সাইটের এটি দরকার, আর অন্য কিছু বাধা দেয় না। এটাই সেই বিনিময় যা আপনি করছেন হাতে-কলমে একটি থিম বানানো শিখে: শুরুতে বেশি কাজ, বিনিময়ে এমন একটি সাইট যা ঠিক যা দরকার তাই করে, এর বেশি কিছু নয়।</p>'),

      h(2, 'এই অংশটি কেন ব্লক এডিটর বাদ দেয়', 'why-this-section-skips-the-block-editor'),
      p('<p>WordPress 5.0 থেকে, একটি পাতা লেখার ডিফল্ট উপায় হলো <b>ব্লক এডিটর</b> (Gutenberg নামেও পরিচিত) — কন্টেন্টকে ব্লকে সাজানোর একটি ড্র্যাগ-অ্যান্ড-ড্রপ ইন্টারফেস, যা সরাসরি পেজ আর পোস্ট স্ক্রিনের মধ্যে বসানো আছে। এটি অনেক সাইটের জন্য সত্যিই কাজের, বিশেষত যেখানে একজন টেকনিক্যাল-না-হওয়া owner-কে কোনো সাহায্য ছাড়াই নিজে এডিট করতে হয়।</p><p>তবে কাস্টম থিম কাজের জন্য এটি একটি খারাপ ফিট। একটি ব্লক-ভিত্তিক পাতা তার লেআউট HTML মার্কআপ হিসেবে পোস্ট কন্টেন্টের ভেতরেই মিশিয়ে সংরক্ষণ করে, যা একটি থিমের বদলে নিজের PHP টেমপ্লেট দিয়ে লেআউট নিয়ন্ত্রণ করার বিরুদ্ধে যায়। এই অংশটি অন্যভাবে থিম বানায়: কন্টেন্ট সহজ থাকে (সাধারণ টেক্সট আর গঠনবদ্ধ কাস্টম ফিল্ড), আর <b>থিমের PHP ফাইলগুলো</b> — এডিটর নয় — ঠিক করে সবকিছু কীভাবে সাজানো আর দেখানো হবে।</p>'),

      callout('note', '<p>Elementor আর Divi-এর মতো পেজ বিল্ডার প্লাগইনগুলো একই সমস্যা ভিন্নভাবে সমাধান করে — ভিজ্যুয়াল, ড্র্যাগ-অ্যান্ড-ড্রপ পেজ বিল্ডিং, কিন্তু যেকোনো থিমের উপর একটি প্লাগইন হিসেবে বসানো। এগুলো কাজের টুল আর জানা ভালো, কিন্তু এটি এই অংশে যা শেখানো হয় তা থেকে আলাদা একটি দক্ষতা। এখানে, থিমের নিজের PHP কোডই পাতা নিয়ন্ত্রণ করে।</p>', 'Elementor বা Divi সম্পর্কে কী?'),

      h(2, 'টুলকিট', 'the-toolkit'),
      p('<p>তিনটি প্লাগইন এই অংশে যে ধরনের কাস্টম থিম বানানো হয় তার প্রায় সব ভারী কাজ করে দেয়:</p>'),
      table(
        ['প্লাগইন', 'এটি কী করে', 'এখানে কেন ব্যবহার হয়'],
        [
          ['Classic Editor', 'ব্লক এডিটরের বদলে পুরনো, সাধারণ কন্টেন্ট এডিটর ফিরিয়ে আনে', 'পোস্ট কন্টেন্ট সহজ রাখে — সাধারণ টেক্সট, লেআউট মার্কআপ নয় — যাতে থিমের টেমপ্লেটগুলোই লেআউটের দায়িত্বে থাকে'],
          ['CPT UI', 'কোনো PHP ছাড়াই একটি অ্যাডমিন স্ক্রিন দিয়ে কাস্টম পোস্ট টাইপ আর কাস্টম ট্যাক্সোনমি রেজিস্টার করে', 'একটি থিমকে আসল কন্টেন্ট টাইপ মডেল করতে দেয় — "Projects," "Team Members," "Testimonials" — সাধারণ পোস্টকে টেনে-হিঁচড়ে ফিট করানোর বদলে'],
          ['Secure Custom Fields (SCF)', 'যেকোনো কন্টেন্ট টাইপে গঠনবদ্ধ কাস্টম ফিল্ড যোগ করে (টেক্সট, ছবি, রিপিটার, আরও অনেক কিছু)', 'এডিটরদের পূরণ করার জন্য আসল গঠনবদ্ধ ফিল্ড দেয়, আর টেমপ্লেটগুলোকে সেই ডেটা ফিরিয়ে পড়ার একটি নির্ভরযোগ্য উপায় দেয়'],
        ]
      ),
      p('<p>এগুলোর কোনোটাই কঠোরভাবে বাধ্যতামূলক নয় — WordPress শুধু সাধারণ PHP কোড দিয়েই পোস্ট টাইপ আর কাস্টম ফিল্ড রেজিস্টার করতে পারে — কিন্তু এই তিনটিই সত্যিকারভাবে বাস্তব-জগতে এই ধরনের থিম যেভাবে বানানো হয়, আর এই অংশের বাকি পুরোটা জুড়ে এগুলোই ব্যবহার হবে।</p>'),

      img(
        'docs/img/wordpress/introduction-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে একটি ব্রাউজার রিকোয়েস্ট WordPress চালানো একটি সার্ভারে পৌঁছাচ্ছে, PHP টেমপ্লেট ফাইল আর একটি ডেটাবেস মিলে একটি পাতা তৈরি করছে, আর সেই পাতা ব্রাউজারে ফেরত পাঠানো হচ্ছে',
        1024, 768,
        'একটি কাস্টম থিম মানে PHP ফাইল ঠিক করে দিচ্ছে একটি পাতা কেমন দেখাবে — ব্লক নয়, পেজ বিল্ডার নয়।'
      ),

      h(2, 'আগে থেকে আপনার যা জানা থাকা উচিত', 'what-you-should-already-know'),
      p('<p>এই অংশটি ধরে নেয় আপনি ইতিমধ্যেই HTML, CSS, আর PHP-এর নিজস্ব সিনট্যাক্স — ভ্যারিয়েবল, কন্ডিশনাল, লুপ, আর ফাংশন নিয়ে স্বাচ্ছন্দ্য বোধ করছেন। PHP নিজে যদি এখনও অনিশ্চিত মনে হয়, আগে <a href="/bn/php/introduction/">PHP অংশে</a> সময় কাটানো ভালো; এখান থেকে বাকি সবকিছু ধরে নেয় সেই অংশটি আপনার কাছে সহজাত, আর একদম শুধু WordPress কীভাবে PHP ব্যবহার করে একটি সাইট বানায় তার উপর ফোকাস করে।</p>'),

      p('<p>পরের পাঠে আসলেই একটি লোকাল WordPress ইনস্টল চালু করা হবে, যাতে এখান থেকে প্রতিটি উদাহরণ আপনি নিজে বানিয়ে আর ক্লিক করে দেখতে পারেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'local-environment',
  sortOrder: 2,
  en: {
    title: 'Setting Up a Local WordPress Environment',
    metaTitle: 'Setting Up a Local WordPress Environment | Learn Computer Academy',
    metaDescription: 'Getting a real WordPress install running on your own computer, and installing the three plugins this section builds around.',
    blocks: [
      p('<p>Theme development happens against a real, running WordPress site — not a live one. Building and testing directly on a live site risks breaking it for real visitors, and every reload takes a round trip to a server somewhere else. A <b>local environment</b> runs WordPress entirely on your own computer instead, so it\'s fast, disposable, and safe to break.</p>'),

      h(2, 'Picking a Local Server Tool'),
      p('<p>WordPress needs PHP, a MySQL (or MariaDB) database, and a web server to run — normally three separate pieces of software to install and configure by hand. A local WordPress tool bundles all three together and manages them for you.</p>'),
      table(
        ['Tool', 'What it is'],
        [
          ['Local', 'A free, purpose-built app for running WordPress sites locally — one click creates a fresh site with everything already configured. The most direct route for WordPress specifically.'],
          ['XAMPP / MAMP', 'General-purpose local server stacks (PHP + MySQL + Apache) not specific to WordPress — you install WordPress into them yourself. More setup, but useful if you\'re already running other PHP projects the same way.'],
        ]
      ),
      p('<p>Either works fine; the rest of this section assumes Local, since it\'s the fastest path to an actual running site.</p>'),

      h(2, 'Creating a Site'),
      p('<p>After installing Local, creating a site takes three steps: give it a name, accept the default PHP/web server/database versions (recent defaults are fine for everything this section covers), and set an admin username and password. Local then downloads and installs WordPress itself and starts the site running — no manual download, no database setup.</p>'),

      h(2, 'Finding Your Way Around'),
      p('<p>Every WordPress site has two sides:</p>'),
      table(
        ['', 'What it is', 'Typical URL'],
        [
          ['The front end', 'What a visitor actually sees', 'yoursite.local/'],
          ['The admin (wp-admin)', 'Where you manage content, plugins, and settings', 'yoursite.local/wp-admin/'],
        ]
      ),
      p('<p>Log into <code>wp-admin</code> with the admin account created above — that\'s the screen every remaining step in this section happens from.</p>'),

      h(2, 'Installing the Plugins This Section Uses'),
      p('<p>From <b>Plugins → Add New</b> in the admin, search for and install (then activate) each of these:</p>'),
      table(
        ['Plugin', 'Search term'],
        [
          ['Classic Editor', '"Classic Editor"'],
          ['CPT UI', '"Custom Post Type UI"'],
          ['Secure Custom Fields', '"Secure Custom Fields"'],
        ]
      ),

      callout('note', '<p>Secure Custom Fields is the actively-maintained continuation of the plugin most tutorials still call "ACF" (Advanced Custom Fields). The two became separate projects after a licensing dispute in 2024 — SCF kept the same function names (<code>get_field()</code>, <code>the_field()</code>, and the rest), so anything written for ACF still applies here, just under a different plugin name.</p>', 'SCF vs. ACF'),

      p('<p>With plugins installed and Classic Editor active, the next lesson opens up the theme\'s own files and looks at what actually has to exist for WordPress to recognize something as a theme at all.</p>'),
    ],
  },
  bn: {
    title: 'লোকাল WordPress এনভায়রনমেন্ট সেটআপ করা',
    metaTitle: 'লোকাল WordPress এনভায়রনমেন্ট সেটআপ করা | Learn Computer Academy',
    metaDescription: 'নিজের কম্পিউটারে একটি আসল WordPress ইনস্টল চালু করা, আর এই অংশ যে তিনটি প্লাগইনের উপর নির্ভর করে বানানো তা ইনস্টল করা।',
    blocks: [
      p('<p>থিম ডেভেলপমেন্ট হয় একটি আসল, চলমান WordPress সাইটের বিরুদ্ধে — কোনো লাইভ সাইট নয়। সরাসরি একটি লাইভ সাইটে বানানো আর টেস্ট করা আসল ভিজিটরদের জন্য সাইটটি সত্যিই ভেঙে ফেলার ঝুঁকি নেয়, আর প্রতিটি রিলোড অন্য কোথাও থাকা একটি সার্ভারে যাওয়া-আসা করে। একটি <b>লোকাল এনভায়রনমেন্ট</b> এর বদলে সম্পূর্ণভাবে আপনার নিজের কম্পিউটারে WordPress চালায়, তাই এটি দ্রুত, ফেলে দেওয়ার মতো, আর ভাঙার জন্য নিরাপদ।</p>'),

      h(2, 'একটি লোকাল সার্ভার টুল বেছে নেওয়া', 'picking-a-local-server-tool'),
      p('<p>WordPress চালাতে PHP, একটি MySQL (বা MariaDB) ডেটাবেস, আর একটি ওয়েব সার্ভার লাগে — সাধারণত হাতে ইনস্টল আর কনফিগার করার জন্য তিনটি আলাদা সফটওয়্যার। একটি লোকাল WordPress টুল এই তিনটিকে একসাথে বান্ডেল করে আর আপনার হয়ে ম্যানেজ করে।</p>'),
      table(
        ['টুল', 'এটি কী'],
        [
          ['Local', 'লোকালি WordPress সাইট চালানোর জন্য একটি ফ্রি, বিশেষভাবে বানানো অ্যাপ — এক ক্লিকেই সবকিছু আগে থেকে কনফিগার করা একটি নতুন সাইট তৈরি হয়ে যায়। বিশেষভাবে WordPress-এর জন্য সবচেয়ে সরাসরি পথ।'],
          ['XAMPP / MAMP', 'সাধারণ-উদ্দেশ্যের লোকাল সার্ভার স্ট্যাক (PHP + MySQL + Apache), বিশেষভাবে WordPress-এর জন্য নয় — আপনাকে নিজে এগুলোতে WordPress ইনস্টল করতে হয়। বেশি সেটআপ, কিন্তু আপনি যদি ইতিমধ্যে একইভাবে অন্য PHP প্রজেক্ট চালান তাহলে কাজে লাগে।'],
        ]
      ),
      p('<p>দুটোই ঠিকভাবে কাজ করে; এই অংশের বাকি অংশ Local ধরে নিয়ে এগোবে, কারণ এটি একটি আসল চলমান সাইট পাওয়ার সবচেয়ে দ্রুত পথ।</p>'),

      h(2, 'একটি সাইট তৈরি করা', 'creating-a-site'),
      p('<p>Local ইনস্টল করার পর, একটি সাইট তৈরি করতে তিনটি ধাপ লাগে: এটিকে একটি নাম দিন, ডিফল্ট PHP/ওয়েব সার্ভার/ডেটাবেস ভার্সন মেনে নিন (সাম্প্রতিক ডিফল্টগুলো এই অংশে যা কাভার করা হয় তার জন্য যথেষ্ট), আর একটি অ্যাডমিন ইউজারনেম আর পাসওয়ার্ড সেট করুন। এরপর Local নিজেই WordPress ডাউনলোড আর ইনস্টল করে আর সাইটটি চালু করে দেয় — কোনো ম্যানুয়াল ডাউনলোড নেই, কোনো ডেটাবেস সেটআপ নেই।</p>'),

      h(2, 'কোথায় কী খুঁজে পাবেন', 'finding-your-way-around'),
      p('<p>প্রতিটি WordPress সাইটের দুটো দিক আছে:</p>'),
      table(
        ['', 'এটি কী', 'সাধারণ URL'],
        [
          ['ফ্রন্ট এন্ড', 'একজন ভিজিটর আসলে যা দেখে', 'yoursite.local/'],
          ['অ্যাডমিন (wp-admin)', 'যেখানে আপনি কন্টেন্ট, প্লাগইন, আর সেটিংস ম্যানেজ করেন', 'yoursite.local/wp-admin/'],
        ]
      ),
      p('<p>উপরে তৈরি করা অ্যাডমিন অ্যাকাউন্ট দিয়ে <code>wp-admin</code>-এ লগ-ইন করুন — এই অংশের বাকি প্রতিটি ধাপ এই স্ক্রিন থেকেই হবে।</p>'),

      h(2, 'এই অংশ যে প্লাগইনগুলো ব্যবহার করে সেগুলো ইনস্টল করা', 'installing-the-plugins-this-section-uses'),
      p('<p>অ্যাডমিনে <b>Plugins → Add New</b>-এ গিয়ে, নিচের প্রতিটি খুঁজে ইনস্টল করুন (তারপর activate করুন):</p>'),
      table(
        ['প্লাগইন', 'সার্চ টার্ম'],
        [
          ['Classic Editor', '"Classic Editor"'],
          ['CPT UI', '"Custom Post Type UI"'],
          ['Secure Custom Fields', '"Secure Custom Fields"'],
        ]
      ),

      callout('note', '<p>Secure Custom Fields হলো সেই প্লাগইনটির সক্রিয়ভাবে-রক্ষণাবেক্ষণ করা ধারাবাহিকতা যাকে বেশিরভাগ টিউটোরিয়াল এখনও "ACF" (Advanced Custom Fields) বলে ডাকে। 2024 সালে একটি লাইসেন্সিং বিরোধের পর দুটো আলাদা প্রজেক্ট হয়ে যায় — SCF একই ফাংশনের নাম রেখে দেয় (<code>get_field()</code>, <code>the_field()</code>, আর বাকিগুলো), তাই ACF-এর জন্য লেখা যেকোনো কিছু এখানেও কাজ করে, শুধু একটি আলাদা প্লাগইনের নামে।</p>', 'SCF বনাম ACF'),

      p('<p>প্লাগইন ইনস্টল হয়ে যাওয়ার আর Classic Editor সক্রিয় হয়ে যাওয়ার পর, পরের পাঠে থিমের নিজের ফাইলগুলো খোলা হবে আর দেখা হবে WordPress কিছুকে থিম হিসেবে চিনতে আসলে কী থাকতেই হয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'theme-anatomy',
  sortOrder: 3,
  en: {
    title: 'Anatomy of a WordPress Theme',
    metaTitle: 'Anatomy of a WordPress Theme | Learn Computer Academy',
    metaDescription: 'The files WordPress actually requires for something to count as a theme, and the fuller set of files a real custom theme ends up with.',
    blocks: [
      p('<p>A WordPress theme is, at its simplest, just a folder of files inside <code>wp-content/themes/</code>. What makes WordPress recognize that folder as a theme — and let you activate it from <b>Appearance → Themes</b> — comes down to two specific files.</p>'),

      h(2, 'The Only Two Required Files'),
      p('<p><code>style.css</code> is the one file every theme must have, and not for its CSS — WordPress reads a comment block at the very top of it to get the theme\'s name, author, and version:</p>'),
      code('css', '/*\nTheme Name: My Custom Theme\nTheme URI: https://example.com/\nAuthor: Your Name\nDescription: A custom theme built from scratch.\nVersion: 1.0.0\nRequires PHP: 7.4\nText Domain: my-custom-theme\n*/'),
      p('<p>The second required piece is a template file capable of rendering <i>something</i> — in practice this is always <code>index.php</code>, since it also doubles as WordPress\'s catch-all fallback (more on that in the template hierarchy lesson). A folder with just these two files is technically a valid, activatable theme, even though it would look identical on every single page.</p>'),

      h(2, 'The Files a Real Theme Has'),
      p('<p>In practice, a working custom theme has quite a few more files, each with a specific job:</p>'),
      table(
        ['File', 'Purpose'],
        [
          ['style.css', 'Theme metadata (above) — often the main stylesheet too, though enqueuing separate files is common (see the enqueuing lesson)'],
          ['functions.php', 'Theme setup and custom logic — effectively a plugin that\'s scoped to this theme'],
          ['header.php', 'The opening HTML shared by every page — <code>&lt;head&gt;</code>, site header, navigation'],
          ['footer.php', 'The closing HTML shared by every page — footer content, closing tags'],
          ['index.php', 'The universal fallback template — WordPress falls back to this when nothing more specific matches'],
          ['page.php', 'Template for standalone pages'],
          ['single.php', 'Template for individual blog posts'],
          ['404.php', 'Shown when no content matches the requested URL'],
          ['screenshot.png', 'Theme preview shown in Appearance → Themes — not required, but every real theme has one'],
        ]
      ),

      h(2, 'Creating the Folder'),
      p('<p>Create a new folder inside <code>wp-content/themes/</code>, named after your theme (lowercase, hyphenated — this becomes the theme\'s <b>slug</b>, referenced throughout PHP code and used for text translations). Add <code>style.css</code> with the header comment above and a bare <code>index.php</code>, and the theme already shows up — and can be activated — in <b>Appearance → Themes</b>.</p>'),

      img(
        'docs/img/wordpress/theme-anatomy-1',
        'Isometric diagram of an open folder containing several labeled theme file icons, representing a WordPress theme\'s folder structure',
        1024, 768,
        'A theme\'s folder — this lesson\'s list is the shape almost every custom theme grows into.'
      ),

      callout('tip', '<p><code>screenshot.png</code> should be 1200×900 pixels (a 4:3 ratio) — WordPress crops anything else, sometimes awkwardly. It\'s cosmetic only, but worth getting right once rather than fixing later.</p>', 'Screenshot dimensions'),

      p('<p>Every remaining lesson in this section fills in one of these files properly, starting with <code>functions.php</code> — the file that sets up everything else.</p>'),
    ],
  },
  bn: {
    title: 'একটি WordPress থিমের অ্যানাটমি',
    metaTitle: 'একটি WordPress থিমের অ্যানাটমি | Learn Computer Academy',
    metaDescription: 'কোনো কিছুকে থিম হিসেবে গণ্য হতে WordPress আসলে কোন ফাইলগুলো চায়, আর একটি আসল কাস্টম থিম শেষ পর্যন্ত যে পূর্ণ সেট ফাইলে পৌঁছায়।',
    blocks: [
      p('<p>একটি WordPress থিম, সবচেয়ে সহজভাবে বললে, <code>wp-content/themes/</code>-এর ভেতরে ফাইলের একটি ফোল্ডার মাত্র। WordPress-কে সেই ফোল্ডারটি থিম হিসেবে চিনতে দেয় — আর <b>Appearance → Themes</b> থেকে সেটি সক্রিয় করতে দেয় — তা নির্ভর করে দুটো নির্দিষ্ট ফাইলের উপর।</p>'),

      h(2, 'শুধু দুটো বাধ্যতামূলক ফাইল', 'the-only-two-required-files'),
      p('<p><code>style.css</code> হলো একমাত্র ফাইল যা প্রতিটি থিমের থাকতেই হয়, আর তার CSS-এর জন্য নয় — WordPress এর একদম উপরের একটি কমেন্ট ব্লক পড়ে থিমের নাম, লেখক, আর ভার্সন জানতে:</p>'),
      code('css', '/*\nTheme Name: My Custom Theme\nTheme URI: https://example.com/\nAuthor: Your Name\nDescription: A custom theme built from scratch.\nVersion: 1.0.0\nRequires PHP: 7.4\nText Domain: my-custom-theme\n*/'),
      p('<p>দ্বিতীয় বাধ্যতামূলক অংশটি হলো <i>কিছু একটা</i> রেন্ডার করতে সক্ষম একটি টেমপ্লেট ফাইল — বাস্তবে এটি সবসময় <code>index.php</code>, কারণ এটি WordPress-এর ক্যাচ-অল ফলব্যাক হিসেবেও কাজ করে (টেমপ্লেট হায়ারার্কি পাঠে আরও বিস্তারিত)। শুধু এই দুটো ফাইলসহ একটি ফোল্ডার টেকনিক্যালি একটি বৈধ, সক্রিয়যোগ্য থিম, যদিও এটি প্রতিটি পাতায় একদম একইরকম দেখাবে।</p>'),

      h(2, 'একটি আসল থিমের ফাইলগুলো', 'the-files-a-real-theme-has'),
      p('<p>বাস্তবে, একটি কার্যকর কাস্টম থিমে আরও বেশ কয়েকটি ফাইল থাকে, প্রতিটির একটি নির্দিষ্ট কাজ:</p>'),
      table(
        ['ফাইল', 'উদ্দেশ্য'],
        [
          ['style.css', 'থিম মেটাডেটা (উপরে) — প্রায়ই মূল স্টাইলশিটও, যদিও আলাদা ফাইল enqueue করা প্রচলিত (enqueuing পাঠ দেখুন)'],
          ['functions.php', 'থিম সেটআপ আর কাস্টম লজিক — কার্যকরভাবে এমন একটি প্লাগইন যা এই থিমের মধ্যে সীমাবদ্ধ'],
          ['header.php', 'প্রতিটি পাতায় শেয়ার করা শুরুর HTML — <code>&lt;head&gt;</code>, সাইট হেডার, নেভিগেশন'],
          ['footer.php', 'প্রতিটি পাতায় শেয়ার করা শেষের HTML — ফুটার কন্টেন্ট, ক্লোজিং ট্যাগ'],
          ['index.php', 'সার্বজনীন ফলব্যাক টেমপ্লেট — আরও নির্দিষ্ট কিছু না মিললে WordPress এতে ফিরে আসে'],
          ['page.php', 'স্ট্যান্ডঅ্যালোন পেজের টেমপ্লেট'],
          ['single.php', 'পৃথক ব্লগ পোস্টের টেমপ্লেট'],
          ['404.php', 'অনুরোধ করা URL-এর সাথে কোনো কন্টেন্ট না মিললে দেখানো হয়'],
          ['screenshot.png', 'Appearance → Themes-এ দেখানো থিম প্রিভিউ — বাধ্যতামূলক নয়, কিন্তু প্রতিটি আসল থিমে থাকে'],
        ]
      ),

      h(2, 'ফোল্ডার তৈরি করা', 'creating-the-folder'),
      p('<p><code>wp-content/themes/</code>-এর ভেতরে আপনার থিমের নামে একটি নতুন ফোল্ডার তৈরি করুন (lowercase, হাইফেন দিয়ে যুক্ত — এটি থিমের <b>slug</b> হয়ে যায়, যা পুরো PHP কোড জুড়ে ব্যবহৃত হয় আর টেক্সট অনুবাদের জন্য ব্যবহৃত হয়)। উপরের হেডার কমেন্টসহ <code>style.css</code> আর একটি খালি <code>index.php</code> যোগ করুন, আর থিমটি ইতিমধ্যে দেখা যাবে — আর সক্রিয় করা যাবে — <b>Appearance → Themes</b>-এ।</p>'),

      img(
        'docs/img/wordpress/theme-anatomy-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে একটি খোলা ফোল্ডারে বেশ কয়েকটি লেবেলযুক্ত থিম ফাইল আইকন দেখানো হয়েছে, একটি WordPress থিমের ফোল্ডার গঠন বোঝাতে',
        1024, 768,
        'একটি থিমের ফোল্ডার — এই পাঠের তালিকাটাই প্রায় প্রতিটি কাস্টম থিম শেষ পর্যন্ত যে আকারে পৌঁছায়।'
      ),

      callout('tip', '<p><code>screenshot.png</code> হওয়া উচিত 1200×900 পিক্সেল (4:3 অনুপাত) — অন্য কিছু হলে WordPress এটি ক্রপ করে, কখনো কখনো বিশ্রীভাবে। এটি শুধু কসমেটিক, কিন্তু পরে ঠিক করার বদলে একবারেই ঠিক করা ভালো।</p>', 'স্ক্রিনশটের মাপ'),

      p('<p>এই অংশের বাকি প্রতিটি পাঠ এই ফাইলগুলোর একটি করে সঠিকভাবে পূরণ করবে, শুরু হবে <code>functions.php</code> দিয়ে — যে ফাইলটি বাকি সবকিছুর সেটআপ করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'functions-php-setup',
  sortOrder: 4,
  en: {
    title: 'functions.php — Theme Setup Essentials',
    metaTitle: 'functions.php — Theme Setup Essentials | Learn Computer Academy',
    metaDescription: 'What functions.php is for, the theme-support features every custom theme turns on, and how to hook your own setup code into WordPress safely.',
    blocks: [
      p('<p><code>functions.php</code> runs automatically on every request, the same way a plugin does — except it\'s scoped to whichever theme is active. This is where a theme declares what it supports, sets up menus and image sizes, and defines any custom logic the templates will lean on.</p>'),

      h(2, 'Declaring Support with add_theme_support()'),
      p('<p>WordPress ships with a long list of features a theme can opt into, one call at a time:</p>'),
      code('php', '<?php\nfunction mytheme_setup() {\n    add_theme_support( \'title-tag\' );\n    add_theme_support( \'post-thumbnails\' );\n    add_theme_support( \'custom-logo\' );\n    add_theme_support( \'html5\', [ \'search-form\', \'comment-form\', \'comment-list\', \'gallery\', \'caption\' ] );\n}\nadd_action( \'after_setup_theme\', \'mytheme_setup\' );'),
      table(
        ['Feature', 'What it enables'],
        [
          ['title-tag', 'Lets WordPress manage the <code>&lt;title&gt;</code> tag itself, instead of the theme writing it by hand'],
          ['post-thumbnails', 'Featured images — without this, <code>has_post_thumbnail()</code> never returns true'],
          ['custom-logo', 'A logo upload/crop screen in the Customizer, read back with <code>the_custom_logo()</code>'],
          ['html5', 'Modern HTML5 markup for the listed elements instead of WordPress\'s older default markup'],
        ]
      ),

      h(2, 'Why after_setup_theme'),
      p('<p>Theme setup code never runs directly at the top level of <code>functions.php</code> — it\'s wrapped in a function and attached to the <code>after_setup_theme</code> <b>action hook</b>, which WordPress fires once it has finished loading the active theme. Some features (like <code>add_theme_support()</code>) genuinely require this — calling them too early fails silently.</p>'),

      callout('warning', '<p>Every function you define in <code>functions.php</code> shares one global namespace with WordPress core, every active plugin, and (if it\'s ever changed) any other theme. Two functions with the same name crash the site with a fatal error. Always prefix your own function names with something specific to the theme — <code>mytheme_setup()</code>, not <code>setup()</code>.</p>', 'Prefix everything'),

      h(2, 'What Else Lives Here'),
      p('<p>Beyond initial setup, <code>functions.php</code> is also where a theme registers navigation menus (a later lesson), enqueues its stylesheets and scripts (also a later lesson), and defines any custom helper functions the template files call. As a theme grows, it\'s common to split these into separate included files rather than letting one <code>functions.php</code> sprawl — but everything still ultimately loads through it.</p>'),

      p('<p>The next lesson puts some of this to use directly — building <code>header.php</code> and <code>footer.php</code>, the two files every other template shares.</p>'),
    ],
  },
  bn: {
    title: 'functions.php — থিম সেটআপের অত্যাবশ্যকীয় বিষয়',
    metaTitle: 'functions.php — থিম সেটআপের অত্যাবশ্যকীয় বিষয় | Learn Computer Academy',
    metaDescription: 'functions.php কীসের জন্য, প্রতিটি কাস্টম থিম যে থিম-সাপোর্ট ফিচারগুলো চালু করে, আর কীভাবে নিরাপদে নিজের সেটআপ কোড WordPress-এ hook করবেন।',
    blocks: [
      p('<p><code>functions.php</code> প্রতিটি রিকোয়েস্টে স্বয়ংক্রিয়ভাবে চলে, একটি প্লাগইনের মতোই — শুধু এটি যেই থিম সক্রিয় আছে তার মধ্যে সীমাবদ্ধ। এখানেই একটি থিম ঘোষণা করে সে কী সাপোর্ট করে, মেনু আর ইমেজ সাইজ সেটআপ করে, আর যেকোনো কাস্টম লজিক ডিফাইন করে যার উপর টেমপ্লেটগুলো নির্ভর করবে।</p>'),

      h(2, 'add_theme_support() দিয়ে সাপোর্ট ঘোষণা করা', 'declaring-support-with-add_theme_support'),
      p('<p>WordPress-এর সাথে অনেক ফিচারের একটি দীর্ঘ তালিকা আসে যা একটি থিম একে একে অপ্ট-ইন করতে পারে:</p>'),
      code('php', '<?php\nfunction mytheme_setup() {\n    add_theme_support( \'title-tag\' );\n    add_theme_support( \'post-thumbnails\' );\n    add_theme_support( \'custom-logo\' );\n    add_theme_support( \'html5\', [ \'search-form\', \'comment-form\', \'comment-list\', \'gallery\', \'caption\' ] );\n}\nadd_action( \'after_setup_theme\', \'mytheme_setup\' );'),
      table(
        ['ফিচার', 'এটি কী চালু করে'],
        [
          ['title-tag', 'WordPress-কে নিজেই <code>&lt;title&gt;</code> ট্যাগ ম্যানেজ করতে দেয়, থিমকে হাতে লেখার বদলে'],
          ['post-thumbnails', 'ফিচার্ড ইমেজ — এটি ছাড়া <code>has_post_thumbnail()</code> কখনো true রিটার্ন করে না'],
          ['custom-logo', 'Customizer-এ একটি লোগো আপলোড/ক্রপ স্ক্রিন, <code>the_custom_logo()</code> দিয়ে ফিরিয়ে পড়া যায়'],
          ['html5', 'তালিকাভুক্ত এলিমেন্টগুলোর জন্য আধুনিক HTML5 মার্কআপ, WordPress-এর পুরনো ডিফল্ট মার্কআপের বদলে'],
        ]
      ),

      h(2, 'after_setup_theme কেন', 'why-after_setup_theme'),
      p('<p>থিম সেটআপ কোড কখনো সরাসরি <code>functions.php</code>-এর টপ লেভেলে চলে না — এটি একটি ফাংশনে মোড়ানো থাকে আর <code>after_setup_theme</code> <b>অ্যাকশন হুকে</b> সংযুক্ত থাকে, যা WordPress সক্রিয় থিম লোড করা শেষ হলে একবার ফায়ার করে। কিছু ফিচার (যেমন <code>add_theme_support()</code>) সত্যিই এটি দাবি করে — খুব তাড়াতাড়ি কল করলে চুপচাপ ব্যর্থ হয়।</p>'),

      callout('warning', '<p>আপনি <code>functions.php</code>-এ যে প্রতিটি ফাংশন ডিফাইন করেন তা WordPress কোর, প্রতিটি সক্রিয় প্লাগইন, আর (কখনো বদলালে) অন্য যেকোনো থিমের সাথে একটি গ্লোবাল নেমস্পেস শেয়ার করে। একই নামের দুটো ফাংশন সাইটকে একটি ফেটাল এররে ক্র্যাশ করায়। সবসময় নিজের ফাংশনের নামের আগে থিমের জন্য নির্দিষ্ট কিছু বসান — <code>mytheme_setup()</code>, শুধু <code>setup()</code> নয়।</p>', 'সবকিছুতে প্রিফিক্স দিন'),

      h(2, 'আর কী থাকে এখানে', 'what-else-lives-here'),
      p('<p>শুরুর সেটআপের বাইরেও, <code>functions.php</code> হলো সেই জায়গা যেখানে একটি থিম নেভিগেশন মেনু রেজিস্টার করে (পরের একটি পাঠ), নিজের স্টাইলশিট আর স্ক্রিপ্ট enqueue করে (এটিও পরের একটি পাঠ), আর যেকোনো কাস্টম হেল্পার ফাংশন ডিফাইন করে যা টেমপ্লেট ফাইলগুলো কল করে। একটি থিম বড় হওয়ার সাথে সাথে, একটি <code>functions.php</code>-কে ছড়িয়ে যেতে না দিয়ে এগুলোকে আলাদা include করা ফাইলে ভাগ করা প্রচলিত — কিন্তু সবকিছু শেষ পর্যন্ত এর মধ্য দিয়েই লোড হয়।</p>'),

      p('<p>পরের পাঠ এর কিছুটা সরাসরি ব্যবহার করে দেখায় — <code>header.php</code> আর <code>footer.php</code> বানানো, সেই দুটো ফাইল যা বাকি প্রতিটি টেমপ্লেট শেয়ার করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'header-footer',
  sortOrder: 5,
  en: {
    title: 'Building header.php and footer.php',
    metaTitle: 'Building header.php and footer.php | Learn Computer Academy',
    metaDescription: 'The two files shared by every page in a theme — what wp_head() and wp_footer() actually do, and why skipping them breaks plugins.',
    blocks: [
      p('<p>Almost every page a theme renders shares the same opening and closing markup — the <code>&lt;head&gt;</code>, the site header and navigation at the top, the footer at the bottom. Rather than repeating that in every template file, it lives in exactly two places: <code>header.php</code> and <code>footer.php</code>.</p>'),

      h(2, 'A Minimal header.php'),
      code('php', '<!DOCTYPE html>\n<html <?php language_attributes(); ?>>\n<head>\n<meta charset="<?php bloginfo( \'charset\' ); ?>">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<?php wp_head(); ?>\n</head>\n<body <?php body_class(); ?>>\n\n<header id="site-header">\n    <a href="<?php echo esc_url( home_url( \'/\' ) ); ?>"><?php bloginfo( \'name\' ); ?></a>\n</header>'),
      p('<p>Three functions here matter more than the rest of the markup:</p>'),
      table(
        ['Function', 'What it does'],
        [
          ['<code>wp_head()</code>', 'Fires a hook that WordPress core, every plugin, and SEO tools all attach to — stylesheets, meta tags, tracking scripts, and more all get injected here'],
          ['<code>body_class()</code>', 'Outputs a set of CSS classes describing the current page (<code>home</code>, <code>single-post</code>, <code>page-id-12</code>, and more) — useful for page-specific styling without extra PHP logic'],
          ['<code>language_attributes()</code>', 'Outputs the correct <code>lang</code> and text-direction attributes for the site\'s configured language'],
        ]
      ),

      h(2, 'A Minimal footer.php'),
      code('php', '<footer id="site-footer">\n    <p>&copy; <?php echo esc_html( date( \'Y\' ) ); ?> <?php bloginfo( \'name\' ); ?></p>\n</footer>\n\n<?php wp_footer(); ?>\n</body>\n</html>'),
      p('<p><code>wp_footer()</code> is <code>wp_head()</code>\'s counterpart — plugins that need to output JavaScript near the closing <code>&lt;/body&gt;</code> tag (most of them, for performance reasons) hook in here instead of the head.</p>'),

      callout('warning', '<p>Never leave out <code>wp_head()</code> or <code>wp_footer()</code>. Plugins genuinely depend on both firing on every page — leaving one out doesn\'t just look wrong, it silently breaks plugin functionality with no obvious error message pointing at the cause.</p>', 'These two hooks are not optional'),

      h(2, 'Including Them from Other Templates'),
      p('<p>Every other template file starts with <code>get_header()</code> and ends with <code>get_footer()</code> — WordPress functions that simply include the matching file:</p>'),
      code('php', '<?php get_header(); ?>\n\n<p>Page-specific content goes here.</p>\n\n<?php get_footer(); ?>'),

      p('<p>With the shared shell in place, the next lesson looks at what actually goes between <code>get_header()</code> and <code>get_footer()</code> — the Loop, the piece of code that outputs a post or page\'s actual content.</p>'),
    ],
  },
  bn: {
    title: 'header.php আর footer.php বানানো',
    metaTitle: 'header.php আর footer.php বানানো | Learn Computer Academy',
    metaDescription: 'একটি থিমের প্রতিটি পাতা শেয়ার করা দুটো ফাইল — wp_head() আর wp_footer() আসলে কী করে, আর এগুলো বাদ দিলে কেন প্লাগইন ভেঙে যায়।',
    blocks: [
      p('<p>একটি থিম যে প্রায় প্রতিটি পাতা রেন্ডার করে তারা একই শুরুর আর শেষের মার্কআপ শেয়ার করে — <code>&lt;head&gt;</code>, উপরের সাইট হেডার আর নেভিগেশন, নিচের ফুটার। প্রতিটি টেমপ্লেট ফাইলে এটি বারবার লেখার বদলে, এটি ঠিক দুটো জায়গায় থাকে: <code>header.php</code> আর <code>footer.php</code>।</p>'),

      h(2, 'একটি ন্যূনতম header.php', 'a-minimal-headerphp'),
      code('php', '<!DOCTYPE html>\n<html <?php language_attributes(); ?>>\n<head>\n<meta charset="<?php bloginfo( \'charset\' ); ?>">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<?php wp_head(); ?>\n</head>\n<body <?php body_class(); ?>>\n\n<header id="site-header">\n    <a href="<?php echo esc_url( home_url( \'/\' ) ); ?>"><?php bloginfo( \'name\' ); ?></a>\n</header>'),
      p('<p>এখানে বাকি মার্কআপের চেয়ে তিনটি ফাংশন বেশি গুরুত্বপূর্ণ:</p>'),
      table(
        ['ফাংশন', 'এটি কী করে'],
        [
          ['<code>wp_head()</code>', 'একটি হুক ফায়ার করে যাতে WordPress কোর, প্রতিটি প্লাগইন, আর SEO টুল সবাই সংযুক্ত হয় — স্টাইলশিট, মেটা ট্যাগ, ট্র্যাকিং স্ক্রিপ্ট, আরও অনেক কিছু এখানেই inject হয়'],
          ['<code>body_class()</code>', 'বর্তমান পাতা বর্ণনা করা একগুচ্ছ CSS ক্লাস আউটপুট করে (<code>home</code>, <code>single-post</code>, <code>page-id-12</code>, আরও) — অতিরিক্ত PHP লজিক ছাড়াই পাতা-নির্দিষ্ট স্টাইলিংয়ের জন্য কাজের'],
          ['<code>language_attributes()</code>', 'সাইটের কনফিগার করা ভাষার জন্য সঠিক <code>lang</code> আর টেক্সট-ডিরেকশন অ্যাট্রিবিউট আউটপুট করে'],
        ]
      ),

      h(2, 'একটি ন্যূনতম footer.php', 'a-minimal-footerphp'),
      code('php', '<footer id="site-footer">\n    <p>&copy; <?php echo esc_html( date( \'Y\' ) ); ?> <?php bloginfo( \'name\' ); ?></p>\n</footer>\n\n<?php wp_footer(); ?>\n</body>\n</html>'),
      p('<p><code>wp_footer()</code> হলো <code>wp_head()</code>-এর প্রতিরূপ — যেসব প্লাগইনের ক্লোজিং <code>&lt;/body&gt;</code> ট্যাগের কাছে JavaScript আউটপুট করা দরকার (পারফরম্যান্সের কারণে বেশিরভাগই) সেগুলো হেডের বদলে এখানে hook করে।</p>'),

      callout('warning', '<p><code>wp_head()</code> বা <code>wp_footer()</code> কখনো বাদ দেবেন না। প্লাগইনগুলো সত্যিই প্রতিটি পাতায় দুটোই ফায়ার হওয়ার উপর নির্ভর করে — একটি বাদ দিলে শুধু দেখতে ভুল লাগে তা না, এটি চুপচাপ প্লাগইনের কার্যকারিতা ভেঙে দেয়, কারণ নির্দেশক কোনো স্পষ্ট এরর মেসেজ ছাড়াই।</p>', 'এই দুটো হুক ঐচ্ছিক নয়'),

      h(2, 'অন্য টেমপ্লেট থেকে এগুলো include করা', 'including-them-from-other-templates'),
      p('<p>বাকি প্রতিটি টেমপ্লেট ফাইল শুরু হয় <code>get_header()</code> দিয়ে আর শেষ হয় <code>get_footer()</code> দিয়ে — WordPress ফাংশন যা শুধু মিলে যাওয়া ফাইলটি include করে:</p>'),
      code('php', '<?php get_header(); ?>\n\n<p>Page-specific content goes here.</p>\n\n<?php get_footer(); ?>'),

      p('<p>শেয়ার করা শেল তৈরি হয়ে যাওয়ার পর, পরের পাঠে দেখা হবে <code>get_header()</code> আর <code>get_footer()</code>-এর মাঝে আসলে কী থাকে — the Loop, যে কোডটি একটি পোস্ট বা পাতার আসল কন্টেন্ট আউটপুট করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'the-loop',
  sortOrder: 6,
  en: {
    title: 'The Loop and Core Template Tags',
    metaTitle: 'The Loop and Core Template Tags | Learn Computer Academy',
    metaDescription: 'How WordPress\'s Loop actually works, and the template tags used inside it to output a post\'s title, content, and other data.',
    blocks: [
      p('<p>Every template that shows post or page content — <code>index.php</code>, <code>page.php</code>, <code>single.php</code>, and more — does it through the same pattern, called <b>the Loop</b>. It\'s not a special WordPress feature so much as a naming convention for a specific, always-the-same <code>while</code> loop.</p>'),

      h(2, 'The Basic Shape'),
      code('php', '<?php if ( have_posts() ) : ?>\n    <?php while ( have_posts() ) : the_post(); ?>\n\n        <h1><?php the_title(); ?></h1>\n        <?php the_content(); ?>\n\n    <?php endwhile; ?>\n<?php endif; ?>'),
      p('<p><code>have_posts()</code> checks whether there\'s another post left to show. <code>the_post()</code> advances to it and sets up all the "current post" data that the tags inside the loop read from. On a single page this only runs once; on an archive or the homepage, it runs once per post in the list.</p>'),

      h(2, 'Template Tags Used Inside the Loop'),
      p('<p>These only work <i>inside</i> the Loop — call them outside it and there\'s no "current post" for them to read from:</p>'),
      table(
        ['Tag', 'Outputs'],
        [
          ['<code>the_title()</code>', 'The post/page title'],
          ['<code>the_content()</code>', 'The full post/page content'],
          ['<code>the_excerpt()</code>', 'A short auto-generated (or manually set) summary'],
          ['<code>the_permalink()</code>', 'The post/page\'s URL'],
          ['<code>the_ID()</code>', 'The post/page\'s numeric ID — useful for passing to other functions'],
          ['<code>get_the_date()</code>', 'The publish date, formatted (returns rather than outputs, so it\'s wrapped in <code>echo</code>)'],
        ]
      ),

      h(2, 'Conditional Tags'),
      p('<p>Conditional tags answer "what kind of page is this?" and work anywhere in a template, not just inside the Loop — they\'re what makes a single <code>header.php</code> able to behave differently across the whole site:</p>'),
      table(
        ['Tag', 'True when'],
        [
          ['<code>is_front_page()</code>', 'The site\'s configured homepage is being shown'],
          ['<code>is_home()</code>', 'The main blog listing is being shown (same as <code>is_front_page()</code> unless a static homepage is set)'],
          ['<code>is_single()</code>', 'A single blog post is being shown'],
          ['<code>is_page()</code>', 'A standalone page is being shown'],
          ['<code>is_archive()</code>', 'Any archive listing — category, tag, date, or custom taxonomy — is being shown'],
        ]
      ),

      callout('tip', '<p><code>is_home()</code> and <code>is_front_page()</code> trip people up constantly. They\'re identical only when a site\'s homepage <i>is</i> the blog listing. The moment a site uses a static page as its homepage (Settings → Reading), the two split apart — <code>is_front_page()</code> follows that setting, <code>is_home()</code> always means "the blog listing," wherever it ends up living.</p>', 'is_home() vs. is_front_page()'),

      p('<p>With posts and pages actually rendering, the next lesson steps back and looks at how WordPress decided which template file to use in the first place — the template hierarchy.</p>'),
    ],
  },
  bn: {
    title: 'The Loop আর মূল টেমপ্লেট ট্যাগ',
    metaTitle: 'The Loop আর মূল টেমপ্লেট ট্যাগ | Learn Computer Academy',
    metaDescription: 'WordPress-এর Loop আসলে কীভাবে কাজ করে, আর এর ভেতরে একটি পোস্টের title, content, আর অন্যান্য ডেটা আউটপুট করতে যেসব টেমপ্লেট ট্যাগ ব্যবহার হয়।',
    blocks: [
      p('<p>পোস্ট বা পাতার কন্টেন্ট দেখানো প্রতিটি টেমপ্লেট — <code>index.php</code>, <code>page.php</code>, <code>single.php</code>, আরও — একই প্যাটার্নের মধ্য দিয়ে করে, যাকে বলা হয় <b>the Loop</b>। এটি কোনো বিশেষ WordPress ফিচার নয় যতটা না একটি নির্দিষ্ট, সবসময় একইরকম <code>while</code> লুপের জন্য একটি নামকরণ প্রথা।</p>'),

      h(2, 'মূল গঠন', 'the-basic-shape'),
      code('php', '<?php if ( have_posts() ) : ?>\n    <?php while ( have_posts() ) : the_post(); ?>\n\n        <h1><?php the_title(); ?></h1>\n        <?php the_content(); ?>\n\n    <?php endwhile; ?>\n<?php endif; ?>'),
      p('<p><code>have_posts()</code> চেক করে দেখানোর জন্য আর কোনো পোস্ট বাকি আছে কিনা। <code>the_post()</code> তাতে এগিয়ে যায় আর সব "বর্তমান পোস্ট" ডেটা সেট করে যা লুপের ভেতরের ট্যাগগুলো পড়ে। একটি সিঙ্গেল পাতায় এটি শুধু একবার চলে; একটি আর্কাইভ বা হোমপেজে, তালিকার প্রতিটি পোস্টের জন্য একবার করে চলে।</p>'),

      h(2, 'Loop-এর ভেতরে ব্যবহৃত টেমপ্লেট ট্যাগ', 'template-tags-used-inside-the-loop'),
      p('<p>এগুলো শুধু Loop-এর <i>ভেতরে</i> কাজ করে — এর বাইরে কল করলে এগুলোর পড়ার মতো কোনো "বর্তমান পোস্ট" থাকে না:</p>'),
      table(
        ['ট্যাগ', 'আউটপুট করে'],
        [
          ['<code>the_title()</code>', 'পোস্ট/পেজের title'],
          ['<code>the_content()</code>', 'সম্পূর্ণ পোস্ট/পেজ কন্টেন্ট'],
          ['<code>the_excerpt()</code>', 'একটি ছোট স্বয়ংক্রিয়ভাবে-তৈরি (বা হাতে সেট করা) সারসংক্ষেপ'],
          ['<code>the_permalink()</code>', 'পোস্ট/পেজের URL'],
          ['<code>the_ID()</code>', 'পোস্ট/পেজের সংখ্যাসূচক ID — অন্য ফাংশনে পাস করার জন্য কাজের'],
          ['<code>get_the_date()</code>', 'প্রকাশের তারিখ, ফরম্যাট করা (আউটপুট নয়, রিটার্ন করে, তাই এটি <code>echo</code>-তে মোড়ানো থাকে)'],
        ]
      ),

      h(2, 'কন্ডিশনাল ট্যাগ', 'conditional-tags'),
      p('<p>কন্ডিশনাল ট্যাগ উত্তর দেয় "এটা কী ধরনের পাতা?" আর টেমপ্লেটের যেকোনো জায়গায় কাজ করে, শুধু Loop-এর ভেতরে নয় — এগুলোই একটি একক <code>header.php</code>-কে পুরো সাইট জুড়ে ভিন্নভাবে আচরণ করতে সক্ষম করে:</p>'),
      table(
        ['ট্যাগ', 'যখন true হয়'],
        [
          ['<code>is_front_page()</code>', 'সাইটের কনফিগার করা হোমপেজ দেখানো হচ্ছে'],
          ['<code>is_home()</code>', 'মূল ব্লগ লিস্টিং দেখানো হচ্ছে (<code>is_front_page()</code>-এর মতোই, যদি না একটি স্ট্যাটিক হোমপেজ সেট করা থাকে)'],
          ['<code>is_single()</code>', 'একটি একক ব্লগ পোস্ট দেখানো হচ্ছে'],
          ['<code>is_page()</code>', 'একটি স্ট্যান্ডঅ্যালোন পেজ দেখানো হচ্ছে'],
          ['<code>is_archive()</code>', 'যেকোনো আর্কাইভ লিস্টিং — ক্যাটাগরি, ট্যাগ, তারিখ, বা কাস্টম ট্যাক্সোনমি — দেখানো হচ্ছে'],
        ]
      ),

      callout('tip', '<p><code>is_home()</code> আর <code>is_front_page()</code> মানুষকে প্রায়ই বিভ্রান্ত করে। এগুলো তখনই একরকম যখন একটি সাইটের হোমপেজ <i>হলো</i> ব্লগ লিস্টিং। যে মুহূর্তে একটি সাইট তার হোমপেজ হিসেবে একটি স্ট্যাটিক পেজ ব্যবহার করে (Settings → Reading), দুটো আলাদা হয়ে যায় — <code>is_front_page()</code> সেই সেটিং অনুসরণ করে, <code>is_home()</code> সবসময় মানে "ব্লগ লিস্টিং," এটি যেখানেই থাকুক না কেন।</p>', 'is_home() বনাম is_front_page()'),

      p('<p>পোস্ট আর পেজ আসলেই রেন্ডার হওয়ার পর, পরের পাঠ একটু পেছনে গিয়ে দেখে WordPress প্রথমে কীভাবে ঠিক করলো কোন টেমপ্লেট ফাইল ব্যবহার করবে — template hierarchy।</p>'),
    ],
  },
})

lessons.push({
  slug: 'template-hierarchy',
  sortOrder: 7,
  en: {
    title: 'The Template Hierarchy',
    metaTitle: 'The Template Hierarchy | Learn Computer Academy',
    metaDescription: 'How WordPress decides which template file to load for a given URL — the search order every custom theme has to design around.',
    blocks: [
      p('<p>Every time WordPress serves a page, it has to decide which of a theme\'s template files should render it. That decision isn\'t random or configured anywhere — it follows a fixed, predictable search order called the <b>template hierarchy</b>, and understanding it is what turns "a folder of PHP files" into a theme that actually knows what to show where.</p>'),

      h(2, 'The Basic Idea'),
      p('<p>For any given request, WordPress works out what\'s being asked for (a single post? a category archive? the homepage?) and then checks for a series of increasingly generic file names, in order, using the first one that actually exists in the theme. If none of the specific ones exist, it always falls back to <code>index.php</code> — which is exactly why that file is the one truly required template.</p>'),

      h(2, 'A Few Concrete Examples'),
      table(
        ['Requested URL', 'Files checked, in order'],
        [
          ['A single blog post', '<code>single-{post-type}.php</code> → <code>single.php</code> → <code>index.php</code>'],
          ['A standalone page', '<code>page-{slug}.php</code> → <code>page-{id}.php</code> → <code>page.php</code> → <code>index.php</code>'],
          ['A category archive', '<code>category-{slug}.php</code> → <code>category-{id}.php</code> → <code>category.php</code> → <code>archive.php</code> → <code>index.php</code>'],
          ['A 404 (not found)', '<code>404.php</code> → <code>index.php</code>'],
          ['The site\'s homepage', '<code>front-page.php</code> → <code>home.php</code> → <code>page.php</code> (if a static page is set) → <code>index.php</code>'],
        ]
      ),

      img(
        'docs/img/wordpress/template-hierarchy-1',
        'Isometric flowchart diagram showing a page request branching down through decision points into different template file blocks, illustrating the WordPress template hierarchy',
        1024, 768,
        'WordPress always checks the most specific possible file name first, falling back one step at a time until something matches.'
      ),

      h(2, 'Why This Matters for a Custom Theme'),
      p('<p>This is what makes it possible to give one specific page — a single category, a single page, even a single post — its own completely different layout, just by adding a more specifically-named file. No settings screen, no conditional logic inside a shared template required; the file name alone tells WordPress when to use it.</p>'),

      callout('note', '<p>The full hierarchy covers many more cases than the table above — tag archives, author archives, date archives, search results, and every custom post type and taxonomy gets its own equivalent chain. The <a href="https://developer.wordpress.org/themes/basics/template-hierarchy/" target="_blank" rel="noopener noreferrer">official WordPress template hierarchy diagram</a> is worth keeping bookmarked; this lesson covers the pattern, not every single branch.</p>', 'This is the pattern, not the full list'),

      p('<p>With the decision-making logic clear, the next lesson builds the actual files this hierarchy points to most often — <code>index.php</code>, <code>page.php</code>, <code>single.php</code>, and <code>404.php</code>.</p>'),
    ],
  },
  bn: {
    title: 'The Template Hierarchy',
    metaTitle: 'The Template Hierarchy | Learn Computer Academy',
    metaDescription: 'একটি নির্দিষ্ট URL-এর জন্য কোন টেমপ্লেট ফাইল লোড করতে হবে WordPress কীভাবে ঠিক করে — যে সার্চ অর্ডার ঘিরে প্রতিটি কাস্টম থিম ডিজাইন করতে হয়।',
    blocks: [
      p('<p>WordPress যখনই একটি পাতা সার্ভ করে, তাকে ঠিক করতে হয় থিমের কোন টেমপ্লেট ফাইলটি এটি রেন্ডার করবে। এই সিদ্ধান্ত এলোমেলো নয় বা কোথাও কনফিগার করা নয় — এটি একটি নির্দিষ্ট, অনুমানযোগ্য সার্চ অর্ডার অনুসরণ করে যাকে বলা হয় <b>template hierarchy</b>, আর এটি বোঝাই "PHP ফাইলের একটি ফোল্ডার"-কে এমন একটি থিমে পরিণত করে যা আসলে জানে কোথায় কী দেখাতে হবে।</p>'),

      h(2, 'মূল ধারণা', 'the-basic-idea'),
      p('<p>যেকোনো নির্দিষ্ট রিকোয়েস্টের জন্য, WordPress বের করে কী চাওয়া হচ্ছে (একটি একক পোস্ট? একটি ক্যাটাগরি আর্কাইভ? হোমপেজ?) আর তারপর ক্রমান্বয়ে আরও সাধারণ ফাইলের নামের একটি সিরিজ চেক করে, ক্রমানুসারে, থিমে সত্যিই আছে এমন প্রথমটি ব্যবহার করে। নির্দিষ্টগুলোর কোনোটাই না থাকলে, এটি সবসময় <code>index.php</code>-এ ফিরে আসে — এই কারণেই এই ফাইলটি সত্যিকারভাবে একমাত্র বাধ্যতামূলক টেমপ্লেট।</p>'),

      h(2, 'কয়েকটি বাস্তব উদাহরণ', 'a-few-concrete-examples'),
      table(
        ['অনুরোধ করা URL', 'যে ফাইলগুলো ক্রমানুসারে চেক হয়'],
        [
          ['একটি একক ব্লগ পোস্ট', '<code>single-{post-type}.php</code> → <code>single.php</code> → <code>index.php</code>'],
          ['একটি স্ট্যান্ডঅ্যালোন পেজ', '<code>page-{slug}.php</code> → <code>page-{id}.php</code> → <code>page.php</code> → <code>index.php</code>'],
          ['একটি ক্যাটাগরি আর্কাইভ', '<code>category-{slug}.php</code> → <code>category-{id}.php</code> → <code>category.php</code> → <code>archive.php</code> → <code>index.php</code>'],
          ['একটি 404 (not found)', '<code>404.php</code> → <code>index.php</code>'],
          ['সাইটের হোমপেজ', '<code>front-page.php</code> → <code>home.php</code> → <code>page.php</code> (একটি স্ট্যাটিক পেজ সেট থাকলে) → <code>index.php</code>'],
        ]
      ),

      img(
        'docs/img/wordpress/template-hierarchy-1',
        'একটি আইসোমেট্রিক ফ্লোচার্ট ডায়াগ্রাম যেখানে একটি পাতার রিকোয়েস্ট বিভিন্ন সিদ্ধান্ত পয়েন্ট দিয়ে ভিন্ন ভিন্ন টেমপ্লেট ফাইল ব্লকে শাখা-প্রশাখায় বিভক্ত হচ্ছে, WordPress template hierarchy বোঝাতে',
        1024, 768,
        'WordPress সবসময় প্রথমে সবচেয়ে নির্দিষ্ট সম্ভাব্য ফাইলের নাম চেক করে, কিছু না মেলা পর্যন্ত একবারে এক ধাপ করে ফিরে আসে।'
      ),

      h(2, 'একটি কাস্টম থিমের জন্য এটি কেন গুরুত্বপূর্ণ', 'why-this-matters-for-a-custom-theme'),
      p('<p>এটাই একটি নির্দিষ্ট পাতাকে — একটি একক ক্যাটাগরি, একটি একক পেজ, এমনকি একটি একক পোস্টকে — তার নিজের সম্পূর্ণ ভিন্ন লেআউট দেওয়া সম্ভব করে, শুধু একটি আরও নির্দিষ্টভাবে নামকরণ করা ফাইল যোগ করে। কোনো সেটিংস স্ক্রিন লাগে না, একটি শেয়ার করা টেমপ্লেটের ভেতরে কোনো কন্ডিশনাল লজিক লাগে না; শুধু ফাইলের নামই WordPress-কে বলে দেয় কখন এটি ব্যবহার করতে হবে।</p>'),

      callout('note', '<p>পুরো hierarchy উপরের টেবিলের চেয়ে আরও অনেক বেশি কেস কাভার করে — ট্যাগ আর্কাইভ, লেখক আর্কাইভ, তারিখ আর্কাইভ, সার্চ রেজাল্ট, আর প্রতিটি কাস্টম পোস্ট টাইপ আর ট্যাক্সোনমি তার নিজস্ব সমতুল্য চেইন পায়। <a href="https://developer.wordpress.org/themes/basics/template-hierarchy/" target="_blank" rel="noopener noreferrer">অফিসিয়াল WordPress template hierarchy ডায়াগ্রাম</a> বুকমার্ক করে রাখা ভালো; এই পাঠ প্যাটার্নটি কাভার করে, প্রতিটি একক শাখা নয়।</p>', 'এটি প্যাটার্ন, পূর্ণ তালিকা নয়'),

      p('<p>সিদ্ধান্ত নেওয়ার লজিক স্পষ্ট হয়ে যাওয়ার পর, পরের পাঠ আসল ফাইলগুলো বানায় যেখানে এই hierarchy সবচেয়ে বেশি নির্দেশ করে — <code>index.php</code>, <code>page.php</code>, <code>single.php</code>, আর <code>404.php</code>।</p>'),
    ],
  },
})

lessons.push({
  slug: 'core-templates',
  sortOrder: 8,
  en: {
    title: 'Building index.php, page.php, single.php, and 404.php',
    metaTitle: 'Building index.php, page.php, single.php, and 404.php | Learn Computer Academy',
    metaDescription: 'Putting the Loop and template hierarchy together to build the four template files nearly every request ends up passing through.',
    blocks: [
      p('<p>With the Loop and the template hierarchy both covered, these four files are just a matter of combining them. Each one exists because the hierarchy checks for it by name — none of this is magic, just the pattern from the last two lessons applied a few times over.</p>'),

      h(2, 'index.php — the Universal Fallback'),
      code('php', '<?php get_header(); ?>\n\n<main>\n<?php if ( have_posts() ) : ?>\n    <?php while ( have_posts() ) : the_post(); ?>\n        <article>\n            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>\n            <?php the_excerpt(); ?>\n        </article>\n    <?php endwhile; ?>\n<?php else : ?>\n    <p>Nothing found.</p>\n<?php endif; ?>\n</main>\n\n<?php get_footer(); ?>'),
      p('<p>Because <code>index.php</code> is the fallback for lists of posts (the blog listing, category archives, search results, and more), it loops over <i>multiple</i> posts and shows an excerpt and a link — not the full content, which belongs on the single post itself.</p>'),

      h(2, 'page.php and single.php'),
      p('<p>Both follow the same shape: one item, full content, no excerpt. The only real difference between them in practice is often the surrounding markup:</p>'),
      code('php', '<?php get_header(); ?>\n\n<main>\n<?php while ( have_posts() ) : the_post(); ?>\n    <article>\n        <h1><?php the_title(); ?></h1>\n        <?php the_content(); ?>\n    </article>\n<?php endwhile; ?>\n</main>\n\n<?php get_footer(); ?>'),
      p('<p>A single post commonly adds the publish date, author, or category alongside the title; a page usually doesn\'t need any of that. Beyond that, the files are close to identical, which is exactly why the hierarchy treats them as two separate template slots in the first place.</p>'),

      h(2, '404.php — No Loop Needed'),
      p('<p>A 404 page has nothing to loop over — there\'s no post that matched — so it skips the Loop entirely and just shows a message and something useful to do next:</p>'),
      code('php', '<?php get_header(); ?>\n\n<main>\n    <h1>Page Not Found</h1>\n    <p>Sorry, nothing matched that address.</p>\n    <?php get_search_form(); ?>\n</main>\n\n<?php get_footer(); ?>'),
      p('<p><code>get_search_form()</code> outputs WordPress\'s built-in search box — genuinely useful on a 404 page, since a visitor who hit a broken link often knows roughly what they were looking for.</p>'),

      callout('tip', '<p>All four of these files can — and usually should — grow well beyond this minimal shape: pagination on <code>index.php</code>, comments on <code>single.php</code>, a featured image at the top of <code>page.php</code>. What\'s here is the skeleton every real version starts from, not the ceiling.</p>', 'This is a starting point'),

      p('<p>With the core templates in place, the next lesson looks at a different kind of page template — one you assign by hand to a specific page, rather than one WordPress picks automatically.</p>'),
    ],
  },
  bn: {
    title: 'index.php, page.php, single.php, আর 404.php বানানো',
    metaTitle: 'index.php, page.php, single.php, আর 404.php বানানো | Learn Computer Academy',
    metaDescription: 'Loop আর template hierarchy একসাথে ব্যবহার করে সেই চারটি টেমপ্লেট ফাইল বানানো যার মধ্য দিয়ে প্রায় প্রতিটি রিকোয়েস্ট শেষ পর্যন্ত যায়।',
    blocks: [
      p('<p>Loop আর template hierarchy দুটোই কাভার হয়ে যাওয়ার পর, এই চারটি ফাইল শুধু এগুলোকে একসাথে মেশানোর বিষয়। প্রতিটি আছে কারণ hierarchy নামে এটি খোঁজে — এখানে কোনো জাদু নেই, শুধু শেষ দুই পাঠের প্যাটার্ন কয়েকবার প্রয়োগ করা।</p>'),

      h(2, 'index.php — সার্বজনীন ফলব্যাক', 'indexphp--the-universal-fallback'),
      code('php', '<?php get_header(); ?>\n\n<main>\n<?php if ( have_posts() ) : ?>\n    <?php while ( have_posts() ) : the_post(); ?>\n        <article>\n            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>\n            <?php the_excerpt(); ?>\n        </article>\n    <?php endwhile; ?>\n<?php else : ?>\n    <p>Nothing found.</p>\n<?php endif; ?>\n</main>\n\n<?php get_footer(); ?>'),
      p('<p>যেহেতু <code>index.php</code> পোস্টের তালিকার জন্য ফলব্যাক (ব্লগ লিস্টিং, ক্যাটাগরি আর্কাইভ, সার্চ রেজাল্ট, আরও), এটি <i>একাধিক</i> পোস্টের উপর লুপ করে আর একটি এক্সসার্প্ট আর একটি লিংক দেখায় — সম্পূর্ণ কন্টেন্ট নয়, যা একক পোস্টের নিজের জায়গা।</p>'),

      h(2, 'page.php আর single.php', 'pagephp-and-singlephp'),
      p('<p>দুটোই একই আকার অনুসরণ করে: একটি আইটেম, সম্পূর্ণ কন্টেন্ট, কোনো এক্সসার্প্ট নয়। বাস্তবে এদের মধ্যে একমাত্র আসল পার্থক্য প্রায়ই আশেপাশের মার্কআপ:</p>'),
      code('php', '<?php get_header(); ?>\n\n<main>\n<?php while ( have_posts() ) : the_post(); ?>\n    <article>\n        <h1><?php the_title(); ?></h1>\n        <?php the_content(); ?>\n    </article>\n<?php endwhile; ?>\n</main>\n\n<?php get_footer(); ?>'),
      p('<p>একটি একক পোস্ট প্রায়ই title-এর পাশে প্রকাশের তারিখ, লেখক, বা ক্যাটাগরি যোগ করে; একটি পেজের সাধারণত এসবের কিছুই লাগে না। এর বাইরে, ফাইলগুলো প্রায় অভিন্ন, এই কারণেই hierarchy প্রথম থেকেই এদের দুটো আলাদা টেমপ্লেট স্লট হিসেবে গণ্য করে।</p>'),

      h(2, '404.php — কোনো Loop লাগে না', '404php--no-loop-needed'),
      p('<p>একটি 404 পাতায় লুপ করার মতো কিছু নেই — কোনো পোস্ট মেলেনি — তাই এটি সম্পূর্ণভাবে Loop এড়িয়ে যায় আর শুধু একটি মেসেজ আর পরে করার মতো কিছু দরকারি জিনিস দেখায়:</p>'),
      code('php', '<?php get_header(); ?>\n\n<main>\n    <h1>Page Not Found</h1>\n    <p>Sorry, nothing matched that address.</p>\n    <?php get_search_form(); ?>\n</main>\n\n<?php get_footer(); ?>'),
      p('<p><code>get_search_form()</code> WordPress-এর বিল্ট-ইন সার্চ বক্স আউটপুট করে — একটি 404 পাতায় সত্যিই কাজের, কারণ একটি ভাঙা লিংকে পৌঁছানো ভিজিটর প্রায়ই মোটামুটি জানেন তারা কী খুঁজছিলেন।</p>'),

      callout('tip', '<p>এই চারটি ফাইলই এই ন্যূনতম আকার ছাড়িয়ে অনেক বড় হতে পারে — আর সাধারণত হওয়া উচিত: <code>index.php</code>-এ pagination, <code>single.php</code>-এ কমেন্ট, <code>page.php</code>-এর উপরে একটি ফিচার্ড ইমেজ। এখানে যা আছে তা প্রতিটি আসল ভার্সন যে কঙ্কাল থেকে শুরু করে, সেটাই — এটাই সীমা নয়।</p>', 'এটি একটি শুরুর বিন্দু'),

      p('<p>মূল টেমপ্লেটগুলো তৈরি হয়ে যাওয়ার পর, পরের পাঠ ভিন্ন এক ধরনের পেজ টেমপ্লেট দেখে — এমন একটি যা আপনি হাতে একটি নির্দিষ্ট পেজে বরাদ্দ করেন, WordPress স্বয়ংক্রিয়ভাবে বেছে নেয় এমন একটি নয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'page-templates',
  sortOrder: 9,
  en: {
    title: 'Custom Page Templates',
    metaTitle: 'Custom Page Templates | Learn Computer Academy',
    metaDescription: 'How to build a page template that only applies where you assign it by hand — the pattern behind a totally different homepage layout.',
    blocks: [
      p('<p>The template hierarchy picks a file automatically based on a page\'s slug or ID, but sometimes you want a completely custom layout that has nothing to do with either — a homepage with a hero banner, a landing page with a different structure entirely. That\'s what a <b>custom page template</b> is for.</p>'),

      h(2, 'Registering a Template'),
      p('<p>Any PHP file in the theme becomes a selectable page template just by adding one comment at the top:</p>'),
      code('php', '<?php\n/**\n * Template Name: Home Page\n */\nget_header();\n?>\n\n<section class="hero">\n    <?php while ( have_posts() ) : the_post(); ?>\n        <?php the_content(); ?>\n    <?php endwhile; ?>\n</section>\n\n<?php get_footer(); ?>'),
      p('<p>That single <code>Template Name:</code> line is the entire registration step — no <code>functions.php</code> code needed. A common naming convention is <code>template-{name}.php</code>, but the file name itself doesn\'t matter to WordPress; only the comment does.</p>'),

      h(2, 'Assigning It to a Page'),
      p('<p>In the editor for any page, the <b>Page Attributes</b> panel has a <b>Template</b> dropdown — every file with a <code>Template Name:</code> comment shows up there by its given name. Pick it, update the page, and that one page now renders through the custom file instead of <code>page.php</code>.</p>'),

      callout('note', '<p>A custom page template completely replaces <code>page.php</code> for that one page — the hierarchy checks for it <i>first</i>, ahead of everything else. Nothing from <code>page.php</code> carries over automatically; if the custom template needs the same header, footer, or other shared markup, it calls <code>get_header()</code>/<code>get_footer()</code> itself, same as any other template.</p>', 'It replaces page.php entirely, for that page only'),

      h(2, 'A Real Use: the Homepage'),
      p('<p>The most common real-world use is exactly the example above: a "Home Page" template, assigned to whichever page is set as the site\'s static homepage in <b>Settings → Reading</b>. It lets the homepage have a completely different structure — a hero section, featured content, whatever the design calls for — without any of that logic leaking into the regular <code>page.php</code> that every other page still uses.</p>'),

      p('<p>The next lesson steps away from templates for a moment to fix something every one of them has been doing wrong so far — loading CSS and JavaScript the right way, instead of hardcoding <code>&lt;link&gt;</code> and <code>&lt;script&gt;</code> tags directly in <code>header.php</code>.</p>'),
    ],
  },
  bn: {
    title: 'কাস্টম পেজ টেমপ্লেট',
    metaTitle: 'কাস্টম পেজ টেমপ্লেট | Learn Computer Academy',
    metaDescription: 'কীভাবে এমন একটি পেজ টেমপ্লেট বানাবেন যা শুধু আপনি হাতে বরাদ্দ করা জায়গায় প্রযোজ্য হয় — সম্পূর্ণ ভিন্ন একটি হোমপেজ লেআউটের পেছনের প্যাটার্ন।',
    blocks: [
      p('<p>Template hierarchy একটি পেজের slug বা ID-এর ভিত্তিতে স্বয়ংক্রিয়ভাবে একটি ফাইল বেছে নেয়, কিন্তু কখনো কখনো আপনার একদম কাস্টম একটি লেআউট দরকার যার দুটোর কোনোটার সাথেই সম্পর্ক নেই — একটি হিরো ব্যানারসহ হোমপেজ, সম্পূর্ণ ভিন্ন গঠনের একটি ল্যান্ডিং পেজ। এটাই একটি <b>কাস্টম পেজ টেমপ্লেট</b>-এর কাজ।</p>'),

      h(2, 'একটি টেমপ্লেট রেজিস্টার করা', 'registering-a-template'),
      p('<p>থিমের যেকোনো PHP ফাইল উপরে শুধু একটি কমেন্ট যোগ করে একটি বাছাইযোগ্য পেজ টেমপ্লেট হয়ে যায়:</p>'),
      code('php', '<?php\n/**\n * Template Name: Home Page\n */\nget_header();\n?>\n\n<section class="hero">\n    <?php while ( have_posts() ) : the_post(); ?>\n        <?php the_content(); ?>\n    <?php endwhile; ?>\n</section>\n\n<?php get_footer(); ?>'),
      p('<p>এই একক <code>Template Name:</code> লাইনটাই পুরো রেজিস্ট্রেশন ধাপ — কোনো <code>functions.php</code> কোড লাগে না। একটি প্রচলিত নামকরণ প্রথা হলো <code>template-{name}.php</code>, কিন্তু ফাইলের নাম নিজে WordPress-এর কাছে গুরুত্বপূর্ণ নয়; শুধু কমেন্টটাই।</p>'),

      h(2, 'এটি একটি পেজে বরাদ্দ করা', 'assigning-it-to-a-page'),
      p('<p>যেকোনো পেজের এডিটরে, <b>Page Attributes</b> প্যানেলে একটি <b>Template</b> ড্রপডাউন থাকে — <code>Template Name:</code> কমেন্টসহ প্রতিটি ফাইল সেখানে তার দেওয়া নামে দেখা যায়। এটি বেছে নিন, পেজ আপডেট করুন, আর সেই একটি পেজ এখন <code>page.php</code>-এর বদলে কাস্টম ফাইলের মাধ্যমে রেন্ডার হবে।</p>'),

      callout('note', '<p>একটি কাস্টম পেজ টেমপ্লেট সেই একটি পেজের জন্য <code>page.php</code>-কে সম্পূর্ণভাবে প্রতিস্থাপন করে — hierarchy বাকি সবকিছুর <i>আগে</i> এটি চেক করে। <code>page.php</code> থেকে কিছুই স্বয়ংক্রিয়ভাবে বহন হয় না; কাস্টম টেমপ্লেটের যদি একই header, footer, বা অন্য শেয়ার করা মার্কআপ দরকার হয়, তাহলে এটি নিজেই <code>get_header()</code>/<code>get_footer()</code> কল করে, অন্য যেকোনো টেমপ্লেটের মতোই।</p>', 'এটি সেই একটি পেজের জন্য page.php-কে সম্পূর্ণভাবে প্রতিস্থাপন করে'),

      h(2, 'একটি আসল ব্যবহার: হোমপেজ', 'a-real-use-the-homepage'),
      p('<p>সবচেয়ে সাধারণ বাস্তব-জগতের ব্যবহার ঠিক উপরের উদাহরণটিই: একটি "Home Page" টেমপ্লেট, <b>Settings → Reading</b>-এ সাইটের স্ট্যাটিক হোমপেজ হিসেবে সেট করা যে পেজেই বরাদ্দ করা হোক না কেন। এটি হোমপেজকে সম্পূর্ণ ভিন্ন একটি গঠন দিতে দেয় — একটি হিরো সেকশন, ফিচার্ড কন্টেন্ট, ডিজাইন যা দাবি করে — সেই লজিকের কোনোটাই বাকি প্রতিটি পেজ এখনও ব্যবহার করা সাধারণ <code>page.php</code>-এ না মিশিয়ে।</p>'),

      p('<p>পরের পাঠ কিছুক্ষণের জন্য টেমপ্লেট থেকে সরে গিয়ে এখন পর্যন্ত প্রতিটিতে যা ভুলভাবে করা হচ্ছিল তা ঠিক করে — CSS আর JavaScript সঠিক উপায়ে লোড করা, <code>header.php</code>-এ সরাসরি <code>&lt;link&gt;</code> আর <code>&lt;script&gt;</code> ট্যাগ হার্ডকোড করার বদলে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'enqueuing-assets',
  sortOrder: 10,
  en: {
    title: 'Enqueuing Styles & Scripts the Right Way',
    metaTitle: 'Enqueuing Styles & Scripts the Right Way | Learn Computer Academy',
    metaDescription: 'Why WordPress themes never hardcode a <link> or <script> tag, and how wp_enqueue_style/script actually works.',
    blocks: [
      p('<p>Every earlier example in this section wrote a plain <code>&lt;link&gt;</code> or <code>&lt;script&gt;</code> tag directly, to keep the focus on one idea at a time. A real theme never does this — CSS and JavaScript get loaded through <code>wp_enqueue_style()</code> and <code>wp_enqueue_script()</code> instead.</p>'),

      h(2, 'Why Not Just Write the Tag?'),
      p('<p>WordPress sites routinely run a dozen or more plugins, each with their own CSS and JS. Hardcoded tags have no way to know about any of that — a plugin might load the same library twice, or your theme\'s script might run before a library it depends on has loaded. Enqueuing puts every stylesheet and script through one shared system that can track dependencies and avoid duplicates automatically.</p>'),

      h(2, 'The Pattern'),
      code('php', '<?php\nfunction mytheme_enqueue_assets() {\n    $uri = get_template_directory_uri();\n    $dir = get_template_directory();\n\n    wp_enqueue_style( \'mytheme-style\', $uri . \'/css/style.css\', [], filemtime( $dir . \'/css/style.css\' ) );\n    wp_enqueue_script( \'mytheme-main\', $uri . \'/js/main.js\', [ \'jquery\' ], filemtime( $dir . \'/js/main.js\' ), true );\n}\nadd_action( \'wp_enqueue_scripts\', \'mytheme_enqueue_assets\' );'),
      p('<p>Both functions take roughly the same arguments: a unique handle, the file\'s URL, an array of dependency handles, a version number, and (for scripts) whether to load it in the footer.</p>'),
      table(
        ['Argument', 'What it\'s for'],
        [
          ['handle', 'A unique name other code can reference — <code>\'jquery\'</code> as a dependency above refers to WordPress\'s own bundled copy, so it loads first automatically'],
          ['src', 'Built with <code>get_template_directory_uri()</code>, never a hardcoded path — this keeps the theme portable if it\'s ever renamed or moved'],
          ['deps', 'An array of handles that must load first — WordPress sorts the final load order for you'],
          ['version', '<code>filemtime()</code> (the file\'s last-modified time) is a common trick: it changes automatically every time the file is edited, which busts browser caches without hand-bumping a version number'],
          ['in_footer (scripts only)', '<code>true</code> loads the script near <code>wp_footer()</code> instead of in <code>&lt;head&gt;</code> — almost always what you want, since it doesn\'t block the page from rendering while the script downloads'],
        ]
      ),

      callout('warning', '<p><code>wp_enqueue_scripts</code> is the correct hook for the public-facing site. It\'s easy to mix up with <code>admin_enqueue_scripts</code> (for <code>wp-admin</code> screens) — using the wrong one means your assets simply never load, with no error to explain why.</p>', 'Not admin_enqueue_scripts'),

      p('<p>With assets loading properly, the next lesson covers the other thing every theme needs from <code>functions.php</code> — registering and outputting navigation menus.</p>'),
    ],
  },
  bn: {
    title: 'স্টাইল আর স্ক্রিপ্ট সঠিকভাবে Enqueue করা',
    metaTitle: 'স্টাইল আর স্ক্রিপ্ট সঠিকভাবে Enqueue করা | Learn Computer Academy',
    metaDescription: 'WordPress থিম কেন কখনো সরাসরি একটি <link> বা <script> ট্যাগ হার্ডকোড করে না, আর wp_enqueue_style/script আসলে কীভাবে কাজ করে।',
    blocks: [
      p('<p>এই অংশের আগের প্রতিটি উদাহরণ সরাসরি একটি সাধারণ <code>&lt;link&gt;</code> বা <code>&lt;script&gt;</code> ট্যাগ লিখেছে, একবারে একটি ধারণার উপর ফোকাস রাখার জন্য। একটি আসল থিম এটি কখনো করে না — CSS আর JavaScript এর বদলে <code>wp_enqueue_style()</code> আর <code>wp_enqueue_script()</code>-এর মাধ্যমে লোড হয়।</p>'),

      h(2, 'শুধু ট্যাগ লিখলেই কেন হয় না', 'why-not-just-write-the-tag'),
      p('<p>WordPress সাইট নিয়মিতভাবে ডজনখানেক বা তার বেশি প্লাগইন চালায়, প্রতিটির নিজস্ব CSS আর JS। হার্ডকোড করা ট্যাগের এসব কিছু জানার কোনো উপায় নেই — একটি প্লাগইন একই লাইব্রেরি দুবার লোড করতে পারে, বা আপনার থিমের স্ক্রিপ্ট এমন একটি লাইব্রেরি লোড হওয়ার আগেই চলতে পারে যার উপর এটি নির্ভর করে। Enqueue করা প্রতিটি স্টাইলশিট আর স্ক্রিপ্টকে একটি শেয়ার করা সিস্টেমের মধ্য দিয়ে পাঠায় যা স্বয়ংক্রিয়ভাবে ডিপেন্ডেন্সি ট্র্যাক করতে আর ডুপ্লিকেট এড়াতে পারে।</p>'),

      h(2, 'প্যাটার্ন', 'the-pattern'),
      code('php', '<?php\nfunction mytheme_enqueue_assets() {\n    $uri = get_template_directory_uri();\n    $dir = get_template_directory();\n\n    wp_enqueue_style( \'mytheme-style\', $uri . \'/css/style.css\', [], filemtime( $dir . \'/css/style.css\' ) );\n    wp_enqueue_script( \'mytheme-main\', $uri . \'/js/main.js\', [ \'jquery\' ], filemtime( $dir . \'/js/main.js\' ), true );\n}\nadd_action( \'wp_enqueue_scripts\', \'mytheme_enqueue_assets\' );'),
      p('<p>দুটো ফাংশনই প্রায় একই আর্গুমেন্ট নেয়: একটি ইউনিক হ্যান্ডেল, ফাইলের URL, ডিপেন্ডেন্সি হ্যান্ডেলের একটি অ্যারে, একটি ভার্সন নাম্বার, আর (স্ক্রিপ্টের জন্য) এটি ফুটারে লোড করা হবে কিনা।</p>'),
      table(
        ['আর্গুমেন্ট', 'কীসের জন্য'],
        [
          ['handle', 'একটি ইউনিক নাম যা অন্য কোড রেফারেন্স করতে পারে — উপরে ডিপেন্ডেন্সি হিসেবে <code>\'jquery\'</code> WordPress-এর নিজস্ব বান্ডেল করা কপিকে বোঝায়, তাই এটি স্বয়ংক্রিয়ভাবে প্রথমে লোড হয়'],
          ['src', '<code>get_template_directory_uri()</code> দিয়ে বানানো, কখনো হার্ডকোড করা পাথ নয় — থিমের নাম বদলালে বা সরালেও এটি এটিকে পোর্টেবল রাখে'],
          ['deps', 'হ্যান্ডেলের একটি অ্যারে যা প্রথমে লোড হতে হবে — WordPress আপনার জন্য চূড়ান্ত লোড অর্ডার সাজিয়ে দেয়'],
          ['version', '<code>filemtime()</code> (ফাইলের সর্বশেষ-পরিবর্তিত সময়) একটি প্রচলিত কৌশল: ফাইল এডিট হওয়ার প্রতিবার এটি স্বয়ংক্রিয়ভাবে বদলায়, যা হাতে ভার্সন নাম্বার না বাড়িয়েই ব্রাউজার ক্যাশ ভেঙে দেয়'],
          ['in_footer (শুধু স্ক্রিপ্টের জন্য)', '<code>true</code> স্ক্রিপ্টটিকে <code>&lt;head&gt;</code>-এর বদলে <code>wp_footer()</code>-এর কাছে লোড করে — প্রায় সবসময় যা আপনি চান, কারণ স্ক্রিপ্ট ডাউনলোড হওয়ার সময় এটি পাতা রেন্ডার হতে বাধা দেয় না'],
        ]
      ),

      callout('warning', '<p>পাবলিক-ফেসিং সাইটের জন্য সঠিক হুক হলো <code>wp_enqueue_scripts</code>। এটি <code>admin_enqueue_scripts</code>-এর (<code>wp-admin</code> স্ক্রিনের জন্য) সাথে গুলিয়ে ফেলা সহজ — ভুলটা ব্যবহার করলে মানে আপনার অ্যাসেট কখনোই লোড হয় না, কেন তা ব্যাখ্যা করার মতো কোনো এরর ছাড়াই।</p>', 'admin_enqueue_scripts নয়'),

      p('<p>অ্যাসেট সঠিকভাবে লোড হওয়ার পর, পরের পাঠ প্রতিটি থিমের <code>functions.php</code>-এর কাছে আর যা দরকার তা কাভার করে — নেভিগেশন মেনু রেজিস্টার আর আউটপুট করা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'navigation-menus',
  sortOrder: 11,
  en: {
    title: 'Navigation Menus In Depth',
    metaTitle: 'Navigation Menus In Depth | Learn Computer Academy',
    metaDescription: 'Registering multiple menu locations, outputting a menu with wp_nav_menu, and marking the current page\'s link as active.',
    blocks: [
      p('<p>WordPress separates "where a menu can appear" (defined by the theme) from "what\'s in that menu" (defined by whoever\'s managing the site) — which is what lets a client rearrange their own navigation without ever touching a template file.</p>'),

      h(2, 'Registering Menu Locations'),
      code('php', '<?php\nfunction mytheme_menus() {\n    register_nav_menus( [\n        \'primary\' => __( \'Primary Menu\', \'mytheme\' ),\n        \'footer\'  => __( \'Footer Menu\', \'mytheme\' ),\n    ] );\n}\nadd_action( \'after_setup_theme\', \'mytheme_menus\' );'),
      p('<p>Each entry is a location <b>slug</b> (<code>primary</code>, <code>footer</code> — referenced in template code) paired with a human-readable label (shown in the admin, where an editor assigns an actual menu to that slot from <b>Appearance → Menus</b>).</p>'),

      h(2, 'Outputting a Menu'),
      code('php', '<?php\nwp_nav_menu( [\n    \'theme_location\' => \'primary\',\n    \'container\'      => false,\n    \'menu_class\'     => \'primary-menu\',\n    \'fallback_cb\'    => false,\n] );\n?>'),
      table(
        ['Argument', 'What it does'],
        [
          ['theme_location', 'Which registered slot to output — must match a key from <code>register_nav_menus()</code>'],
          ['container', '<code>false</code> skips the extra wrapping <code>&lt;div&gt;</code> WordPress adds by default'],
          ['menu_class', 'The CSS class on the output <code>&lt;ul&gt;</code>'],
          ['fallback_cb', '<code>false</code> means "output nothing if no menu is assigned yet" — the alternative default tries to guess a menu from your pages, which is rarely what a finished site wants'],
        ]
      ),

      h(2, 'Highlighting the Current Page'),
      p('<p>WordPress already adds a <code>current-menu-item</code> class to whichever link matches the page being viewed — no extra code needed for that part. If your CSS framework expects a different class name (commonly <code>active</code>), a filter renames it without touching the menu markup itself:</p>'),
      code('php', '<?php\nfunction mytheme_nav_active_class( $classes, $item ) {\n    if ( in_array( \'current-menu-item\', $classes, true ) ) {\n        $classes[] = \'active\';\n    }\n    return $classes;\n}\nadd_filter( \'nav_menu_css_class\', \'mytheme_nav_active_class\', 10, 2 );'),

      callout('tip', '<p>Until at least one menu is assigned to a location in <b>Appearance → Menus</b>, <code>wp_nav_menu()</code> with <code>fallback_cb: false</code> simply outputs nothing — that\'s expected, not a bug. Assign a menu before judging whether the navigation code actually works.</p>', 'Nothing shows until a menu is assigned'),

      p('<p>Menus handled, the next lesson looks at the Customizer — WordPress\'s built-in, live-preview settings screen, and a lightweight alternative to a full custom fields setup for small site-wide options.</p>'),
    ],
  },
  bn: {
    title: 'নেভিগেশন মেনু বিস্তারিত',
    metaTitle: 'নেভিগেশন মেনু বিস্তারিত | Learn Computer Academy',
    metaDescription: 'একাধিক মেনু লোকেশন রেজিস্টার করা, wp_nav_menu দিয়ে একটি মেনু আউটপুট করা, আর বর্তমান পাতার লিংক active হিসেবে চিহ্নিত করা।',
    blocks: [
      p('<p>WordPress "একটি মেনু কোথায় দেখাতে পারে" (থিম দ্বারা নির্ধারিত) থেকে "সেই মেনুতে কী আছে" (সাইট ম্যানেজ করা যে কেউ নির্ধারণ করে) আলাদা করে — এটাই একজন ক্লায়েন্টকে কোনো টেমপ্লেট ফাইল স্পর্শ না করেই নিজের নেভিগেশন সাজাতে দেয়।</p>'),

      h(2, 'মেনু লোকেশন রেজিস্টার করা', 'registering-menu-locations'),
      code('php', '<?php\nfunction mytheme_menus() {\n    register_nav_menus( [\n        \'primary\' => __( \'Primary Menu\', \'mytheme\' ),\n        \'footer\'  => __( \'Footer Menu\', \'mytheme\' ),\n    ] );\n}\nadd_action( \'after_setup_theme\', \'mytheme_menus\' );'),
      p('<p>প্রতিটি এন্ট্রি একটি লোকেশন <b>slug</b> (<code>primary</code>, <code>footer</code> — টেমপ্লেট কোডে রেফারেন্স করা হয়) একটি মানুষের পড়ার মতো লেবেলের সাথে জোড়া (অ্যাডমিনে দেখানো হয়, যেখানে একজন এডিটর <b>Appearance → Menus</b> থেকে সেই স্লটে একটি আসল মেনু বরাদ্দ করেন)।</p>'),

      h(2, 'একটি মেনু আউটপুট করা', 'outputting-a-menu'),
      code('php', '<?php\nwp_nav_menu( [\n    \'theme_location\' => \'primary\',\n    \'container\'      => false,\n    \'menu_class\'     => \'primary-menu\',\n    \'fallback_cb\'    => false,\n] );\n?>'),
      table(
        ['আর্গুমেন্ট', 'এটি কী করে'],
        [
          ['theme_location', 'কোন রেজিস্টার করা স্লট আউটপুট হবে — <code>register_nav_menus()</code>-এর একটি কী-র সাথে মিলতে হবে'],
          ['container', '<code>false</code> WordPress ডিফল্টভাবে যোগ করা অতিরিক্ত মোড়ানো <code>&lt;div&gt;</code> বাদ দেয়'],
          ['menu_class', 'আউটপুট <code>&lt;ul&gt;</code>-এর CSS ক্লাস'],
          ['fallback_cb', '<code>false</code> মানে "এখনও কোনো মেনু বরাদ্দ না থাকলে কিছুই আউটপুট করো না" — বিকল্প ডিফল্ট আপনার পেজ থেকে একটি মেনু অনুমান করার চেষ্টা করে, যা একটি সম্পূর্ণ সাইট কালেভদ্রেই চায়'],
        ]
      ),

      h(2, 'বর্তমান পাতা হাইলাইট করা', 'highlighting-the-current-page'),
      p('<p>WordPress ইতিমধ্যে যে লিংকটি দেখা হচ্ছে সেই পাতার সাথে মেলে তাতে একটি <code>current-menu-item</code> ক্লাস যোগ করে দেয় — এই অংশের জন্য অতিরিক্ত কোনো কোড লাগে না। আপনার CSS ফ্রেমওয়ার্ক যদি ভিন্ন একটি ক্লাসের নাম আশা করে (সাধারণত <code>active</code>), একটি ফিল্টার মেনু মার্কআপ স্পর্শ না করেই এটির নাম বদলে দেয়:</p>'),
      code('php', '<?php\nfunction mytheme_nav_active_class( $classes, $item ) {\n    if ( in_array( \'current-menu-item\', $classes, true ) ) {\n        $classes[] = \'active\';\n    }\n    return $classes;\n}\nadd_filter( \'nav_menu_css_class\', \'mytheme_nav_active_class\', 10, 2 );'),

      callout('tip', '<p><b>Appearance → Menus</b>-এ কমপক্ষে একটি মেনু কোনো লোকেশনে বরাদ্দ না হওয়া পর্যন্ত, <code>fallback_cb: false</code>-সহ <code>wp_nav_menu()</code> শুধু কিছুই আউটপুট করে না — এটাই প্রত্যাশিত, কোনো বাগ নয়। নেভিগেশন কোড আসলে কাজ করছে কিনা তা বিচার করার আগে একটি মেনু বরাদ্দ করুন।</p>', 'একটি মেনু বরাদ্দ না হওয়া পর্যন্ত কিছুই দেখা যায় না'),

      p('<p>মেনু সামলানো হয়ে গেলে, পরের পাঠ Customizer দেখে — WordPress-এর বিল্ট-ইন, live-preview সেটিংস স্ক্রিন, আর ছোট সাইট-জোড়া অপশনের জন্য একটি সম্পূর্ণ কাস্টম ফিল্ড সেটআপের একটি হালকা বিকল্প।</p>'),
    ],
  },
})

lessons.push({
  slug: 'customizer',
  sortOrder: 12,
  en: {
    title: 'The WordPress Customizer',
    metaTitle: 'The WordPress Customizer | Learn Computer Academy',
    metaDescription: 'Adding a live-preview setting to the Customizer and reading its saved value back inside a template.',
    blocks: [
      p('<p>The <b>Customizer</b> (<b>Appearance → Customize</b>) is WordPress\'s built-in screen for small, site-wide settings, with a live preview alongside the settings panel. A custom theme can add its own settings to it — a secondary logo, a phone number, a social link — anything that\'s a single value used site-wide rather than per-page content.</p>'),

      h(2, 'Adding a Setting'),
      code('php', '<?php\nfunction mytheme_customize_register( $wp_customize ) {\n    $wp_customize->add_section( \'mytheme_contact\', [\n        \'title\'    => __( \'Contact Info\', \'mytheme\' ),\n        \'priority\' => 30,\n    ] );\n\n    $wp_customize->add_setting( \'mytheme_phone\' );\n\n    $wp_customize->add_control( \'mytheme_phone\', [\n        \'label\'   => __( \'Phone Number\', \'mytheme\' ),\n        \'section\' => \'mytheme_contact\',\n        \'type\'    => \'text\',\n    ] );\n}\nadd_action( \'customize_register\', \'mytheme_customize_register\' );'),
      p('<p>Three pieces, always in this order: a <b>section</b> to group related settings under a heading, a <b>setting</b> to store the actual value, and a <b>control</b> to give that setting an input field in the panel. An image upload works the same way, using <code>WP_Customize_Image_Control</code> in place of a plain text control.</p>'),

      h(2, 'Reading It Back in a Template'),
      code('php', '<?php $phone = get_theme_mod( \'mytheme_phone\' ); ?>\n<?php if ( $phone ) : ?>\n    <a href="tel:<?php echo esc_attr( preg_replace( \'/[^\\d+]/\', \'\', $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>\n<?php endif; ?>'),
      p('<p><code>get_theme_mod()</code> reads whatever was saved — it returns <code>false</code> (or your own chosen default, passed as a second argument) if the setting has never been set, so it\'s always worth checking before using the value.</p>'),

      callout('note', '<p>The Customizer is genuinely the right tool for a handful of small, global settings — but it doesn\'t scale well past that. A settings screen with a dozen fields, repeatable content, or anything more structured belongs in an SCF options page instead, covered later in this section — it\'s built for exactly that case, with a much richer set of field types.</p>', 'When to reach for SCF instead'),

      p('<p>With the site-wide chrome — header, footer, menus, small settings — all covered, the next lesson closes out this first part of the section: turning off the block editor for good, so every content screen behaves the way the rest of this section has assumed all along.</p>'),
    ],
  },
  bn: {
    title: 'WordPress Customizer',
    metaTitle: 'WordPress Customizer | Learn Computer Academy',
    metaDescription: 'Customizer-এ একটি live-preview সেটিং যোগ করা আর একটি টেমপ্লেটের ভেতরে এর সংরক্ষিত মান ফিরিয়ে পড়া।',
    blocks: [
      p('<p><b>Customizer</b> (<b>Appearance → Customize</b>) হলো ছোট, সাইট-জোড়া সেটিংসের জন্য WordPress-এর বিল্ট-ইন স্ক্রিন, সেটিংস প্যানেলের পাশে একটি live preview সহ। একটি কাস্টম থিম এতে নিজের সেটিংস যোগ করতে পারে — একটি সেকেন্ডারি লোগো, একটি ফোন নাম্বার, একটি সোশ্যাল লিংক — এমন যেকোনো কিছু যা একটি একক মান, পাতা-প্রতি কন্টেন্টের বদলে সাইট-জোড়া ব্যবহৃত।</p>'),

      h(2, 'একটি সেটিং যোগ করা', 'adding-a-setting'),
      code('php', '<?php\nfunction mytheme_customize_register( $wp_customize ) {\n    $wp_customize->add_section( \'mytheme_contact\', [\n        \'title\'    => __( \'Contact Info\', \'mytheme\' ),\n        \'priority\' => 30,\n    ] );\n\n    $wp_customize->add_setting( \'mytheme_phone\' );\n\n    $wp_customize->add_control( \'mytheme_phone\', [\n        \'label\'   => __( \'Phone Number\', \'mytheme\' ),\n        \'section\' => \'mytheme_contact\',\n        \'type\'    => \'text\',\n    ] );\n}\nadd_action( \'customize_register\', \'mytheme_customize_register\' );'),
      p('<p>তিনটি অংশ, সবসময় এই ক্রমে: একটি <b>section</b> সম্পর্কিত সেটিংসকে একটি হেডিংয়ের নিচে গ্রুপ করতে, একটি <b>setting</b> আসল মান সংরক্ষণ করতে, আর একটি <b>control</b> সেই সেটিংকে প্যানেলে একটি ইনপুট ফিল্ড দিতে। একটি ইমেজ আপলোড একইভাবে কাজ করে, একটি সাধারণ টেক্সট কন্ট্রোলের বদলে <code>WP_Customize_Image_Control</code> ব্যবহার করে।</p>'),

      h(2, 'একটি টেমপ্লেটে এটি ফিরিয়ে পড়া', 'reading-it-back-in-a-template'),
      code('php', '<?php $phone = get_theme_mod( \'mytheme_phone\' ); ?>\n<?php if ( $phone ) : ?>\n    <a href="tel:<?php echo esc_attr( preg_replace( \'/[^\\d+]/\', \'\', $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>\n<?php endif; ?>'),
      p('<p><code>get_theme_mod()</code> যা সংরক্ষিত হয়েছে তা পড়ে — সেটিং কখনো সেট না হলে এটি <code>false</code> (বা আপনার নিজের বেছে নেওয়া ডিফল্ট, দ্বিতীয় আর্গুমেন্ট হিসেবে পাস করা) রিটার্ন করে, তাই মান ব্যবহারের আগে চেক করা সবসময়ই ভালো।</p>'),

      callout('note', '<p>Customizer সত্যিই কয়েকটা ছোট, গ্লোবাল সেটিংসের জন্য সঠিক টুল — কিন্তু এর বাইরে এটি ভালোভাবে স্কেল করে না। ডজনখানেক ফিল্ডসহ একটি সেটিংস স্ক্রিন, রিপিটেবল কন্টেন্ট, বা আরও গঠনবদ্ধ কিছু এর বদলে একটি SCF options page-এর জায়গা, এই অংশে পরে কাভার করা হবে — এটি ঠিক সেই কেসের জন্য বানানো, আরও অনেক সমৃদ্ধ ফিল্ড টাইপ সহ।</p>', 'কখন এর বদলে SCF ব্যবহার করবেন'),

      p('<p>সাইট-জোড়া ফ্রেম — header, footer, মেনু, ছোট সেটিংস — সব কাভার হয়ে যাওয়ার পর, পরের পাঠ এই অংশের প্রথম ভাগ শেষ করে: চিরদিনের জন্য ব্লক এডিটর বন্ধ করা, যাতে প্রতিটি কন্টেন্ট স্ক্রিন এই অংশ শুরু থেকে যেভাবে ধরে নিয়েছে সেভাবেই আচরণ করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'disabling-gutenberg',
  sortOrder: 13,
  en: {
    title: 'Disabling Gutenberg with Classic Editor',
    metaTitle: 'Disabling Gutenberg with Classic Editor | Learn Computer Academy',
    metaDescription: 'What the Classic Editor plugin actually changes, how to configure it, and why a custom theme is more predictable without the block editor.',
    blocks: [
      p('<p>Every earlier lesson assumed post and page content is plain text and HTML, not a block-based layout. This lesson makes that assumption actually true, site-wide, by configuring the Classic Editor plugin installed back in the setup lesson.</p>'),

      h(2, 'What Classic Editor Changes'),
      p('<p>Since WordPress 5.0, the default content editor is the <b>block editor</b> — every paragraph, image, and heading becomes its own block, and that structure is saved as HTML comments mixed into the post content itself. Classic Editor replaces it with the older, plain content editor: one text area, formatted with a simple toolbar, saved as ordinary HTML with no block markup at all.</p>'),

      h(2, 'Configuring It'),
      p('<p>From <b>Settings → Writing</b>, two options appear once the plugin is active:</p>'),
      table(
        ['Setting', 'What it controls'],
        [
          ['Default editor for all users', '<b>Classic Editor</b> — makes it the editor every post and page opens with'],
          ['Allow users to switch editors', '<b>No</b> — removes the option to switch back to the block editor per-post, keeping every editor consistent'],
        ]
      ),
      p('<p>With both set this way, the block editor is effectively gone from the site — every content screen behaves exactly like the examples throughout this section assume.</p>'),

      h(2, 'Why This Matters for a Custom Theme'),
      p('<p>It comes back to the same point from the very first lesson: a block-based post stores layout markup inside its content, which fights against a theme that wants to control layout through its own PHP templates. With Classic Editor active, <code>the_content()</code> reliably returns exactly what an editor typed — plain HTML, nothing a block ever injected — which is what every template in this section has been assuming all along.</p>'),

      callout('tip', '<p>WordPress core itself doesn\'t currently plan to remove the classic editing mode from the block editor entirely, but plugin support timelines shift — it\'s worth periodically checking the Classic Editor plugin page for its supported-until date, especially on a long-lived client site.</p>', 'Worth revisiting occasionally'),

      p('<p>That closes out the foundational part of this section — a working theme with proper templates, assets, menus, and settings, and Gutenberg out of the way. From here, the section moves on to modeling real content types with CPT UI, starting with what a custom post type actually is and why regular posts and pages eventually stop being enough.</p>'),
    ],
  },
  bn: {
    title: 'Classic Editor দিয়ে Gutenberg বন্ধ করা',
    metaTitle: 'Classic Editor দিয়ে Gutenberg বন্ধ করা | Learn Computer Academy',
    metaDescription: 'Classic Editor প্লাগইন আসলে কী বদলায়, কীভাবে এটি কনফিগার করবেন, আর ব্লক এডিটর ছাড়া একটি কাস্টম থিম কেন বেশি অনুমানযোগ্য।',
    blocks: [
      p('<p>আগের প্রতিটি পাঠ ধরে নিয়েছে পোস্ট আর পেজ কন্টেন্ট হলো সাধারণ টেক্সট আর HTML, একটি ব্লক-ভিত্তিক লেআউট নয়। এই পাঠ সেই ধারণাটিকে আসলেই সত্যি করে, পুরো সাইট জুড়ে, সেটআপ পাঠে ইনস্টল করা Classic Editor প্লাগইন কনফিগার করে।</p>'),

      h(2, 'Classic Editor কী বদলায়', 'what-classic-editor-changes'),
      p('<p>WordPress 5.0 থেকে, ডিফল্ট কন্টেন্ট এডিটর হলো <b>ব্লক এডিটর</b> — প্রতিটি প্যারাগ্রাফ, ছবি, আর হেডিং তার নিজের ব্লক হয়ে যায়, আর সেই গঠন পোস্ট কন্টেন্টের ভেতরেই মেশানো HTML কমেন্ট হিসেবে সংরক্ষিত হয়। Classic Editor এটিকে পুরনো, সাধারণ কন্টেন্ট এডিটর দিয়ে প্রতিস্থাপন করে: একটি টেক্সট এরিয়া, একটি সাধারণ টুলবার দিয়ে ফরম্যাট করা, কোনো ব্লক মার্কআপ ছাড়াই সাধারণ HTML হিসেবে সংরক্ষিত।</p>'),

      h(2, 'এটি কনফিগার করা', 'configuring-it'),
      p('<p>প্লাগইন সক্রিয় হয়ে গেলে, <b>Settings → Writing</b>-এ দুটো অপশন দেখা যায়:</p>'),
      table(
        ['সেটিং', 'এটি কী নিয়ন্ত্রণ করে'],
        [
          ['Default editor for all users', '<b>Classic Editor</b> — এটিকে প্রতিটি পোস্ট আর পেজ যে এডিটর দিয়ে খোলে তা বানায়'],
          ['Allow users to switch editors', '<b>No</b> — পোস্ট-প্রতি ব্লক এডিটরে ফিরে যাওয়ার অপশন সরিয়ে দেয়, প্রতিটি এডিটরকে সামঞ্জস্যপূর্ণ রাখে'],
        ]
      ),
      p('<p>দুটোই এভাবে সেট করা থাকলে, ব্লক এডিটর কার্যকরভাবে সাইট থেকে চলে যায় — প্রতিটি কন্টেন্ট স্ক্রিন ঠিক এই অংশ জুড়ে উদাহরণগুলো যেভাবে ধরে নিয়েছে সেভাবেই আচরণ করে।</p>'),

      h(2, 'একটি কাস্টম থিমের জন্য এটি কেন গুরুত্বপূর্ণ', 'why-this-matters-for-a-custom-theme'),
      p('<p>এটি একদম প্রথম পাঠের একই বিষয়ে ফিরে আসে: একটি ব্লক-ভিত্তিক পোস্ট তার কন্টেন্টের ভেতরে লেআউট মার্কআপ সংরক্ষণ করে, যা একটি থিম নিজের PHP টেমপ্লেট দিয়ে লেআউট নিয়ন্ত্রণ করতে চাওয়ার বিরুদ্ধে যায়। Classic Editor সক্রিয় থাকলে, <code>the_content()</code> নির্ভরযোগ্যভাবে ঠিক তাই ফেরত দেয় যা একজন এডিটর টাইপ করেছেন — সাধারণ HTML, কোনো ব্লক inject করা কিছু নয় — যা এই অংশের প্রতিটি টেমপ্লেট শুরু থেকে ধরে নিয়েছে।</p>'),

      callout('tip', '<p>WordPress কোর নিজে বর্তমানে ব্লক এডিটর থেকে ক্লাসিক এডিটিং মোড সম্পূর্ণভাবে সরানোর পরিকল্পনা করছে না, কিন্তু প্লাগইন সাপোর্টের সময়সীমা বদলাতে পারে — বিশেষত একটি দীর্ঘমেয়াদী ক্লায়েন্ট সাইটে, মাঝেমধ্যে Classic Editor প্লাগইনের পেজে এর সাপোর্টেড-পর্যন্ত তারিখ চেক করা ভালো।</p>', 'মাঝেমধ্যে আবার দেখা ভালো'),

      p('<p>এটি এই অংশের ভিত্তি অংশ শেষ করে দেয় — সঠিক টেমপ্লেট, অ্যাসেট, মেনু, আর সেটিংসসহ একটি কার্যকর থিম, আর Gutenberg পথ থেকে সরানো। এখান থেকে, অংশটি CPT UI দিয়ে আসল কন্টেন্ট টাইপ মডেল করার দিকে এগোয়, শুরু হয় একটি কাস্টম পোস্ট টাইপ আসলে কী আর কেন সাধারণ পোস্ট আর পেজ শেষমেশ যথেষ্ট হয়ে ওঠে না তা দিয়ে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'custom-post-types-intro',
  sortOrder: 14,
  en: {
    title: 'Introduction to Custom Post Types',
    metaTitle: 'Introduction to Custom Post Types | Learn Computer Academy',
    metaDescription: 'What a custom post type actually is, when a site needs one instead of regular posts or pages, and how it fits alongside them under the hood.',
    blocks: [
      p('<p>WordPress ships with exactly two content types out of the box: <b>posts</b> (blog entries, organized by category and date) and <b>pages</b> (standalone, hierarchical content like an About or Contact page). Most real sites need a third kind of content that fits neither mold — projects in a portfolio, team member profiles, testimonials, products. That\'s what a <b>custom post type</b> is for.</p>'),

      h(2, 'What Makes It "Custom"'),
      p('<p>A custom post type behaves exactly like a regular post — it gets an editor screen, a URL, an admin listing — but under its own name, with its own admin menu, and without dragging along everything that comes bundled with regular posts (categories and tags, for one, which rarely make sense for a list of team members).</p>'),

      table(
        ['', 'Built for', 'Organized by'],
        [
          ['Post', 'Blog-style, date-ordered content', 'Categories and tags'],
          ['Page', 'Standalone, mostly-static content', 'Parent/child page hierarchy'],
          ['Custom Post Type', 'Any other repeating content type a site needs', 'Whatever custom taxonomy you attach to it (next lesson) — or none at all'],
        ]
      ),

      h(2, 'A Concrete Example'),
      p('<p>A portfolio site needs "Projects" — each with its own title, description, images, and client name. Trying to force that into regular posts means either polluting the blog with non-blog content, or using a category as a stand-in for "this is a project," which breaks down fast: there\'s no dedicated admin screen, no way to add project-specific fields cleanly, and no clean separation from actual blog posts. A <code>project</code> custom post type solves all of that at once.</p>'),

      img(
        'docs/img/wordpress/custom-post-types-intro-1',
        'Isometric diagram showing three separate stacked groups of content cards side by side, representing regular posts, pages, and a custom post type organized separately',
        1024, 768,
        'Custom post types sit alongside posts and pages as their own, independently organized content type.'
      ),

      callout('note', '<p>Under the hood, a custom post type isn\'t a separate database table — it\'s stored in the exact same <code>wp_posts</code> table as regular posts and pages, just tagged with a different <code>post_type</code> value. That\'s why it inherits so much for free: an editor screen, revisions, featured images, custom fields — all of it already knows how to work with any post type, not just the built-in two.</p>', 'Same table, different post_type'),

      p('<p>The next lesson registers an actual custom post type — no PHP required, using the CPT UI plugin installed back in the setup lesson.</p>'),
    ],
  },
  bn: {
    title: 'কাস্টম পোস্ট টাইপ পরিচিতি',
    metaTitle: 'কাস্টম পোস্ট টাইপ পরিচিতি | Learn Computer Academy',
    metaDescription: 'একটি কাস্টম পোস্ট টাইপ আসলে কী, কখন একটি সাইটের সাধারণ পোস্ট বা পেজের বদলে একটি দরকার, আর ভেতরে ভেতরে এটি তাদের পাশে কীভাবে বসে।',
    blocks: [
      p('<p>WordPress ঠিক দুই ধরনের কন্টেন্ট টাইপ নিয়ে আসে সরাসরি: <b>পোস্ট</b> (ব্লগ এন্ট্রি, ক্যাটাগরি আর তারিখ দিয়ে সংগঠিত) আর <b>পেজ</b> (স্ট্যান্ডঅ্যালোন, হায়ারার্কিক্যাল কন্টেন্ট যেমন একটি About বা Contact পেজ)। বেশিরভাগ আসল সাইটের তৃতীয় এক ধরনের কন্টেন্ট দরকার যা কোনোটার সাথেই মেলে না — একটি পোর্টফোলিওতে প্রজেক্ট, টিম মেম্বার প্রোফাইল, টেস্টিমোনিয়াল, প্রোডাক্ট। এটাই একটি <b>কাস্টম পোস্ট টাইপ</b>-এর কাজ।</p>'),

      h(2, '"কাস্টম" কী এটাকে বানায়', 'what-makes-it-custom'),
      p('<p>একটি কাস্টম পোস্ট টাইপ ঠিক একটি সাধারণ পোস্টের মতোই আচরণ করে — এটি একটি এডিটর স্ক্রিন, একটি URL, একটি অ্যাডমিন লিস্টিং পায় — কিন্তু নিজের নামে, নিজের অ্যাডমিন মেনুতে, আর সাধারণ পোস্টের সাথে বান্ডেল করা সবকিছু না টেনে (যেমন ক্যাটাগরি আর ট্যাগ, যা টিম মেম্বারের একটি তালিকার জন্য কালেভদ্রে অর্থবহ হয়)।</p>'),

      table(
        ['', 'যার জন্য বানানো', 'যা দিয়ে সংগঠিত'],
        [
          ['Post', 'ব্লগ-স্টাইল, তারিখ-ক্রমানুসারী কন্টেন্ট', 'ক্যাটাগরি আর ট্যাগ'],
          ['Page', 'স্ট্যান্ডঅ্যালোন, বেশিরভাগ-স্ট্যাটিক কন্টেন্ট', 'Parent/child পেজ হায়ারার্কি'],
          ['Custom Post Type', 'একটি সাইটের দরকার এমন আর যেকোনো পুনরাবৃত্ত কন্টেন্ট টাইপ', 'আপনি যা কাস্টম ট্যাক্সোনমি সংযুক্ত করেন (পরের পাঠ) — বা একেবারেই কিছু না'],
        ]
      ),

      h(2, 'একটি বাস্তব উদাহরণ', 'a-concrete-example'),
      p('<p>একটি পোর্টফোলিও সাইটের "Projects" দরকার — প্রতিটির নিজস্ব title, description, ছবি, আর ক্লায়েন্টের নাম সহ। সাধারণ পোস্টে এটি জোর করে ঢোকানোর মানে হয় হয় ব্লগকে নন-ব্লগ কন্টেন্ট দিয়ে দূষিত করা, বা "এটি একটি প্রজেক্ট" বোঝাতে একটি ক্যাটাগরিকে বিকল্প হিসেবে ব্যবহার করা, যা দ্রুত ভেঙে পড়ে: কোনো নিবেদিত অ্যাডমিন স্ক্রিন থাকে না, প্রজেক্ট-নির্দিষ্ট ফিল্ড পরিষ্কারভাবে যোগ করার কোনো উপায় থাকে না, আর আসল ব্লগ পোস্ট থেকে কোনো পরিষ্কার আলাদাকরণ থাকে না। একটি <code>project</code> কাস্টম পোস্ট টাইপ এই সবকিছু একসাথে সমাধান করে।</p>'),

      img(
        'docs/img/wordpress/custom-post-types-intro-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে পাশাপাশি তিনটি আলাদা স্তূপীকৃত কন্টেন্ট কার্ডের গ্রুপ দেখানো হয়েছে, সাধারণ পোস্ট, পেজ, আর আলাদাভাবে সংগঠিত একটি কাস্টম পোস্ট টাইপ বোঝাতে',
        1024, 768,
        'কাস্টম পোস্ট টাইপ পোস্ট আর পেজের পাশে নিজস্ব, স্বাধীনভাবে সংগঠিত একটি কন্টেন্ট টাইপ হিসেবে বসে।'
      ),

      callout('note', '<p>ভেতরে ভেতরে, একটি কাস্টম পোস্ট টাইপ আলাদা কোনো ডেটাবেস টেবিল নয় — এটি সাধারণ পোস্ট আর পেজের মতো ঠিক একই <code>wp_posts</code> টেবিলে সংরক্ষিত, শুধু একটি ভিন্ন <code>post_type</code> মান দিয়ে চিহ্নিত। এই কারণেই এটি বিনামূল্যে এত কিছু উত্তরাধিকার সূত্রে পায়: একটি এডিটর স্ক্রিন, রিভিশন, ফিচার্ড ইমেজ, কাস্টম ফিল্ড — এসব সবকিছু ইতিমধ্যে জানে যেকোনো পোস্ট টাইপের সাথে কাজ করতে, শুধু বিল্ট-ইন দুটোর সাথে নয়।</p>', 'একই টেবিল, ভিন্ন post_type'),

      p('<p>পরের পাঠ একটি আসল কাস্টম পোস্ট টাইপ রেজিস্টার করে — কোনো PHP লাগবে না, সেটআপ পাঠে ইনস্টল করা CPT UI প্লাগইন ব্যবহার করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'cpt-ui-post-types',
  sortOrder: 15,
  en: {
    title: 'Registering Post Types with CPT UI',
    metaTitle: 'Registering Post Types with CPT UI | Learn Computer Academy',
    metaDescription: 'Building a real custom post type through the CPT UI plugin\'s admin screen, and the settings that actually matter.',
    blocks: [
      p('<p>With CPT UI active (installed back in the setup lesson), a new <b>CPT UI</b> menu appears in the admin sidebar. Registering a post type is a form, not code — <b>CPT UI → Add/Edit Post Types</b>.</p>'),

      h(2, 'The Settings That Matter'),
      table(
        ['Field', 'What it controls'],
        [
          ['Post Type Slug', 'The internal name used in code and URLs — lowercase, no spaces, e.g. <code>project</code>'],
          ['Plural / Singular Labels', 'What shows in the admin menu and screens — "Projects" / "Project"'],
          ['Public', 'Whether this content type has a public-facing URL at all — almost always <b>True</b>'],
          ['Has Archive', 'Whether an automatic listing page exists at <code>/projects/</code> — needed for <code>archive-project.php</code> to ever be used (next lesson)'],
          ['Show in Menu', 'Whether it gets its own top-level admin menu item — usually <b>True</b>'],
          ['Supports', 'Which editor features are available — Title, Editor, Featured Image are the common baseline; only enable what the content type actually needs'],
        ]
      ),

      h(2, 'What This Generates'),
      p('<p>Filling out that form and saving is functionally equivalent to writing a <code>register_post_type()</code> call in <code>functions.php</code> by hand — CPT UI just gives it a form instead of PHP syntax to get wrong. It even has an "Export/Get Code" option that shows the generated PHP, worth a look once just to see what the plugin\'s doing on your behalf.</p>'),

      callout('tip', '<p>After adding a new post type, visit <b>Settings → Permalinks</b> and click <b>Save Changes</b> — even without changing anything. WordPress caches its URL-routing rules, and a newly registered post type\'s URLs (especially its archive) can 404 until that cache is refreshed.</p>', 'Flush permalinks after adding a post type'),

      p('<p>With a post type registered, the next lesson covers its natural companion — a custom taxonomy, for organizing that content type the way categories organize posts.</p>'),
    ],
  },
  bn: {
    title: 'CPT UI দিয়ে পোস্ট টাইপ রেজিস্টার করা',
    metaTitle: 'CPT UI দিয়ে পোস্ট টাইপ রেজিস্টার করা | Learn Computer Academy',
    metaDescription: 'CPT UI প্লাগইনের অ্যাডমিন স্ক্রিন দিয়ে একটি আসল কাস্টম পোস্ট টাইপ বানানো, আর যে সেটিংস আসলে গুরুত্বপূর্ণ।',
    blocks: [
      p('<p>CPT UI সক্রিয় থাকলে (সেটআপ পাঠে ইনস্টল করা), অ্যাডমিন সাইডবারে একটি নতুন <b>CPT UI</b> মেনু দেখা যায়। একটি পোস্ট টাইপ রেজিস্টার করা একটি ফর্ম, কোড নয় — <b>CPT UI → Add/Edit Post Types</b>।</p>'),

      h(2, 'যে সেটিংস গুরুত্বপূর্ণ', 'the-settings-that-matter'),
      table(
        ['ফিল্ড', 'এটি কী নিয়ন্ত্রণ করে'],
        [
          ['Post Type Slug', 'কোড আর URL-এ ব্যবহৃত ভেতরের নাম — lowercase, কোনো স্পেস নেই, যেমন <code>project</code>'],
          ['Plural / Singular Labels', 'অ্যাডমিন মেনু আর স্ক্রিনে যা দেখা যায় — "Projects" / "Project"'],
          ['Public', 'এই কন্টেন্ট টাইপের আদৌ একটি পাবলিক-ফেসিং URL আছে কিনা — প্রায় সবসময় <b>True</b>'],
          ['Has Archive', '<code>/projects/</code>-এ একটি স্বয়ংক্রিয় লিস্টিং পেজ আছে কিনা — <code>archive-project.php</code> কখনো ব্যবহার হতে দরকার (পরের পাঠ)'],
          ['Show in Menu', 'এটি নিজের একটি টপ-লেভেল অ্যাডমিন মেনু আইটেম পায় কিনা — সাধারণত <b>True</b>'],
          ['Supports', 'কোন এডিটর ফিচার পাওয়া যায় — Title, Editor, Featured Image সাধারণ বেসলাইন; কন্টেন্ট টাইপের আসলে যা দরকার শুধু তাই সক্রিয় করুন'],
        ]
      ),

      h(2, 'এটি কী তৈরি করে', 'what-this-generates'),
      p('<p>সেই ফর্মটি পূরণ করা আর সংরক্ষণ করা কার্যকরভাবে হাতে <code>functions.php</code>-এ একটি <code>register_post_type()</code> কল লেখার সমতুল্য — CPT UI শুধু PHP সিনট্যাক্স ভুল হওয়ার বদলে এর জন্য একটি ফর্ম দেয়। এমনকি এতে একটি "Export/Get Code" অপশন আছে যা তৈরি হওয়া PHP দেখায়, একবার দেখা মূল্যবান শুধু প্লাগইনটি আপনার হয়ে কী করছে তা দেখতে।</p>'),

      callout('tip', '<p>একটি নতুন পোস্ট টাইপ যোগ করার পর, <b>Settings → Permalinks</b>-এ যান আর <b>Save Changes</b>-এ ক্লিক করুন — কিছু না বদলেও। WordPress তার URL-রাউটিং নিয়ম ক্যাশ করে, আর একটি নতুন রেজিস্টার করা পোস্ট টাইপের URL (বিশেষত এর archive) সেই ক্যাশ রিফ্রেশ না হওয়া পর্যন্ত 404 করতে পারে।</p>', 'পোস্ট টাইপ যোগ করার পর permalinks ফ্লাশ করুন'),

      p('<p>একটি পোস্ট টাইপ রেজিস্টার হয়ে যাওয়ার পর, পরের পাঠ এর স্বাভাবিক সঙ্গী কাভার করে — একটি কাস্টম ট্যাক্সোনমি, ক্যাটাগরি যেভাবে পোস্ট সংগঠিত করে সেভাবে এই কন্টেন্ট টাইপ সংগঠিত করতে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'cpt-ui-taxonomies',
  sortOrder: 16,
  en: {
    title: 'Custom Taxonomies with CPT UI',
    metaTitle: 'Custom Taxonomies with CPT UI | Learn Computer Academy',
    metaDescription: 'Building a custom taxonomy to organize a custom post type, and the hierarchical/non-hierarchical choice that shapes how it behaves.',
    blocks: [
      p('<p>Categories and tags are themselves just <b>taxonomies</b> — a general WordPress system for grouping content — built in and pre-attached to posts. A custom post type doesn\'t get either by default, but CPT UI can attach a brand new taxonomy to it just as easily as it registered the post type itself.</p>'),

      h(2, 'Hierarchical or Not'),
      p('<p>Every taxonomy is one of two shapes, chosen when it\'s created:</p>'),
      table(
        ['Type', 'Behaves like', 'Good for'],
        [
          ['Hierarchical', 'Categories — can have parent/child terms, shown as checkboxes in the editor', 'Nested groupings — "Web Design" under "Services"'],
          ['Non-hierarchical', 'Tags — flat, no parent/child, shown as a free-form comma-separated field', 'Loose labels — skills, keywords, anything without a natural nesting'],
        ]
      ),

      h(2, 'Creating One'),
      p('<p>From <b>CPT UI → Add/Edit Taxonomies</b>, the process mirrors the post type screen: a taxonomy slug (e.g. <code>project_type</code>), plural and singular labels, the hierarchical/non-hierarchical choice above, and — the one setting that actually connects it to anything — an <b>Attached to Post Types</b> list, where you check off <code>project</code> (or whichever custom post type it should organize).</p>'),

      callout('note', '<p>A single taxonomy can attach to more than one post type at once, and a single post type can have more than one taxonomy attached — a <code>project</code> post type might reasonably have both a hierarchical <code>project_type</code> taxonomy and a non-hierarchical <code>skill</code> taxonomy at the same time.</p>', 'Attachments aren\'t one-to-one'),

      h(2, 'Using It in a Template'),
      p('<p>Once attached, a custom taxonomy works with the same functions categories and tags already use — <code>get_the_terms()</code> to list a post\'s terms, <code>has_term()</code> to check for a specific one:</p>'),
      code('php', '<?php\n$terms = get_the_terms( get_the_ID(), \'project_type\' );\nif ( $terms && ! is_wp_error( $terms ) ) {\n    foreach ( $terms as $term ) {\n        echo esc_html( $term->name ) . \' \';\n    }\n}\n?>'),

      p('<p>With both a post type and a taxonomy registered, the next lesson builds the template files that actually display them — following the exact same template hierarchy pattern from earlier, extended with a custom post type\'s own naming.</p>'),
    ],
  },
  bn: {
    title: 'CPT UI দিয়ে কাস্টম ট্যাক্সোনমি',
    metaTitle: 'CPT UI দিয়ে কাস্টম ট্যাক্সোনমি | Learn Computer Academy',
    metaDescription: 'একটি কাস্টম পোস্ট টাইপ সংগঠিত করতে একটি কাস্টম ট্যাক্সোনমি বানানো, আর hierarchical/non-hierarchical পছন্দ যা এর আচরণ ঠিক করে।',
    blocks: [
      p('<p>ক্যাটাগরি আর ট্যাগ নিজেরাই আসলে শুধু <b>ট্যাক্সোনমি</b> — কন্টেন্ট গ্রুপ করার জন্য একটি সাধারণ WordPress সিস্টেম — বিল্ট-ইন আর পোস্টের সাথে আগে থেকে সংযুক্ত। একটি কাস্টম পোস্ট টাইপ ডিফল্টভাবে কোনোটাই পায় না, কিন্তু CPT UI পোস্ট টাইপ নিজে রেজিস্টার করার মতোই সহজে এতে একদম নতুন একটি ট্যাক্সোনমি সংযুক্ত করতে পারে।</p>'),

      h(2, 'Hierarchical নাকি নয়', 'hierarchical-or-not'),
      p('<p>প্রতিটি ট্যাক্সোনমি তৈরির সময় বেছে নেওয়া দুটো আকারের একটি:</p>'),
      table(
        ['টাইপ', 'যেমন আচরণ করে', 'যার জন্য ভালো'],
        [
          ['Hierarchical', 'ক্যাটাগরি — parent/child টার্ম থাকতে পারে, এডিটরে চেকবক্স হিসেবে দেখানো হয়', 'নেস্টেড গ্রুপিং — "Services"-এর নিচে "Web Design"'],
          ['Non-hierarchical', 'ট্যাগ — সমতল, কোনো parent/child নেই, একটি মুক্ত-আকারের কমা-দিয়ে-আলাদা করা ফিল্ড হিসেবে দেখানো হয়', 'ঢিলা লেবেল — স্কিল, কীওয়ার্ড, স্বাভাবিক নেস্টিং নেই এমন যেকোনো কিছু'],
        ]
      ),

      h(2, 'একটি তৈরি করা', 'creating-one'),
      p('<p><b>CPT UI → Add/Edit Taxonomies</b> থেকে, প্রক্রিয়াটি পোস্ট টাইপ স্ক্রিনের মতোই: একটি ট্যাক্সোনমি slug (যেমন <code>project_type</code>), প্লুরাল আর সিঙ্গুলার লেবেল, উপরের hierarchical/non-hierarchical পছন্দ, আর — একমাত্র সেটিং যা আসলে এটিকে কিছুর সাথে সংযুক্ত করে — একটি <b>Attached to Post Types</b> তালিকা, যেখানে আপনি <code>project</code> (বা যে কাস্টম পোস্ট টাইপ এটি সংগঠিত করবে) চেক করেন।</p>'),

      callout('note', '<p>একটি একক ট্যাক্সোনমি একসাথে একাধিক পোস্ট টাইপের সাথে সংযুক্ত হতে পারে, আর একটি একক পোস্ট টাইপে একাধিক ট্যাক্সোনমি সংযুক্ত থাকতে পারে — একটি <code>project</code> পোস্ট টাইপে যুক্তিসঙ্গতভাবে একই সাথে একটি hierarchical <code>project_type</code> ট্যাক্সোনমি আর একটি non-hierarchical <code>skill</code> ট্যাক্সোনমি দুটোই থাকতে পারে।</p>', 'সংযুক্তি এক-থেকে-এক নয়'),

      h(2, 'একটি টেমপ্লেটে এটি ব্যবহার করা', 'using-it-in-a-template'),
      p('<p>একবার সংযুক্ত হয়ে গেলে, একটি কাস্টম ট্যাক্সোনমি ক্যাটাগরি আর ট্যাগ ইতিমধ্যে ব্যবহার করা একই ফাংশনের সাথে কাজ করে — একটি পোস্টের টার্ম তালিকা করতে <code>get_the_terms()</code>, একটি নির্দিষ্টটি আছে কিনা চেক করতে <code>has_term()</code>:</p>'),
      code('php', '<?php\n$terms = get_the_terms( get_the_ID(), \'project_type\' );\nif ( $terms && ! is_wp_error( $terms ) ) {\n    foreach ( $terms as $term ) {\n        echo esc_html( $term->name ) . \' \';\n    }\n}\n?>'),

      p('<p>একটি পোস্ট টাইপ আর একটি ট্যাক্সোনমি দুটোই রেজিস্টার হয়ে যাওয়ার পর, পরের পাঠ সেই টেমপ্লেট ফাইলগুলো বানায় যা আসলে এগুলো দেখায় — আগের ঠিক একই template hierarchy প্যাটার্ন অনুসরণ করে, একটি কাস্টম পোস্ট টাইপের নিজস্ব নামকরণ দিয়ে বর্ধিত।</p>'),
    ],
  },
})

lessons.push({
  slug: 'cpt-templates',
  sortOrder: 17,
  en: {
    title: 'Template Files for Custom Post Types',
    metaTitle: 'Template Files for Custom Post Types | Learn Computer Academy',
    metaDescription: 'Extending the template hierarchy to a custom post type — single-{post-type}.php, archive-{post-type}.php, and taxonomy-{taxonomy}.php.',
    blocks: [
      p('<p>A custom post type slots into the exact same template hierarchy from earlier in this section — it just extends the naming pattern with the post type\'s own slug.</p>'),

      table(
        ['Requested URL', 'Files checked, in order'],
        [
          ['A single project', '<code>single-project.php</code> → <code>single.php</code> → <code>index.php</code>'],
          ['The projects archive (<code>/projects/</code>)', '<code>archive-project.php</code> → <code>archive.php</code> → <code>index.php</code>'],
          ['A project_type term archive', '<code>taxonomy-project_type.php</code> → <code>taxonomy.php</code> → <code>archive.php</code> → <code>index.php</code>'],
        ]
      ),

      h(2, 'single-project.php'),
      code('php', '<?php get_header(); ?>\n\n<main>\n<?php while ( have_posts() ) : the_post(); ?>\n    <article>\n        <h1><?php the_title(); ?></h1>\n        <?php if ( has_post_thumbnail() ) : ?>\n            <?php the_post_thumbnail( \'large\' ); ?>\n        <?php endif; ?>\n        <?php the_content(); ?>\n    </article>\n<?php endwhile; ?>\n</main>\n\n<?php get_footer(); ?>'),
      p('<p>Nothing here is new — it\'s the same shape <code>single.php</code> used earlier. WordPress reaches for this file automatically purely because of its name; there\'s no extra registration step to make it apply only to projects.</p>'),

      h(2, 'archive-project.php'),
      code('php', '<?php get_header(); ?>\n\n<main>\n<h1><?php post_type_archive_title(); ?></h1>\n\n<?php if ( have_posts() ) : ?>\n    <?php while ( have_posts() ) : the_post(); ?>\n        <article>\n            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>\n            <?php the_excerpt(); ?>\n        </article>\n    <?php endwhile; ?>\n<?php endif; ?>\n</main>\n\n<?php get_footer(); ?>'),
      p('<p><code>post_type_archive_title()</code> is the post-type equivalent of <code>the_title()</code> for an archive listing — it outputs the plural label set back in CPT UI ("Projects"), without hardcoding it into the template.</p>'),

      callout('warning', '<p>This file is only ever used if <b>Has Archive</b> was enabled for the post type in CPT UI. If it was left off, <code>/projects/</code> doesn\'t exist as a route at all, and this file sits unused — worth checking that setting first if an archive page seems to be missing.</p>', 'Requires "Has Archive" to be on'),

      p('<p>With content types, taxonomies, and their templates all working, this closes out the CPT UI part of the section. From here, the focus shifts to giving those content types real structured data beyond a title and a body — Secure Custom Fields.</p>'),
    ],
  },
  bn: {
    title: 'কাস্টম পোস্ট টাইপের জন্য টেমপ্লেট ফাইল',
    metaTitle: 'কাস্টম পোস্ট টাইপের জন্য টেমপ্লেট ফাইল | Learn Computer Academy',
    metaDescription: 'একটি কাস্টম পোস্ট টাইপে template hierarchy বিস্তৃত করা — single-{post-type}.php, archive-{post-type}.php, আর taxonomy-{taxonomy}.php।',
    blocks: [
      p('<p>একটি কাস্টম পোস্ট টাইপ এই অংশের আগের ঠিক একই template hierarchy-তে বসে — এটি শুধু পোস্ট টাইপের নিজস্ব slug দিয়ে নামকরণের প্যাটার্ন বিস্তৃত করে।</p>'),

      table(
        ['অনুরোধ করা URL', 'যে ফাইলগুলো ক্রমানুসারে চেক হয়'],
        [
          ['একটি একক project', '<code>single-project.php</code> → <code>single.php</code> → <code>index.php</code>'],
          ['প্রজেক্ট আর্কাইভ (<code>/projects/</code>)', '<code>archive-project.php</code> → <code>archive.php</code> → <code>index.php</code>'],
          ['একটি project_type টার্ম আর্কাইভ', '<code>taxonomy-project_type.php</code> → <code>taxonomy.php</code> → <code>archive.php</code> → <code>index.php</code>'],
        ]
      ),

      h(2, 'single-project.php'),
      code('php', '<?php get_header(); ?>\n\n<main>\n<?php while ( have_posts() ) : the_post(); ?>\n    <article>\n        <h1><?php the_title(); ?></h1>\n        <?php if ( has_post_thumbnail() ) : ?>\n            <?php the_post_thumbnail( \'large\' ); ?>\n        <?php endif; ?>\n        <?php the_content(); ?>\n    </article>\n<?php endwhile; ?>\n</main>\n\n<?php get_footer(); ?>'),
      p('<p>এখানে নতুন কিছু নেই — এটি আগে ব্যবহার করা <code>single.php</code>-এর একই আকার। WordPress এই ফাইলটি স্বয়ংক্রিয়ভাবে শুধু এর নামের কারণে ব্যবহার করে; এটি শুধু project-এর জন্য প্রযোজ্য করতে কোনো অতিরিক্ত রেজিস্ট্রেশন ধাপ লাগে না।</p>'),

      h(2, 'archive-project.php'),
      code('php', '<?php get_header(); ?>\n\n<main>\n<h1><?php post_type_archive_title(); ?></h1>\n\n<?php if ( have_posts() ) : ?>\n    <?php while ( have_posts() ) : the_post(); ?>\n        <article>\n            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>\n            <?php the_excerpt(); ?>\n        </article>\n    <?php endwhile; ?>\n<?php endif; ?>\n</main>\n\n<?php get_footer(); ?>'),
      p('<p><code>post_type_archive_title()</code> একটি আর্কাইভ লিস্টিংয়ের জন্য <code>the_title()</code>-এর পোস্ট-টাইপ সমতুল্য — এটি CPT UI-তে সেট করা প্লুরাল লেবেল ("Projects") আউটপুট করে, টেমপ্লেটে এটি হার্ডকোড না করেই।</p>'),

      callout('warning', '<p>এই ফাইলটি শুধুমাত্র তখনই ব্যবহার হয় যদি CPT UI-তে পোস্ট টাইপের জন্য <b>Has Archive</b> সক্রিয় করা থাকে। এটি বন্ধ রাখা হলে, <code>/projects/</code> একটি রুট হিসেবে আদৌ থাকে না, আর এই ফাইলটি অব্যবহৃত থাকে — একটি আর্কাইভ পেজ অনুপস্থিত মনে হলে প্রথমে এই সেটিং চেক করা ভালো।</p>', '"Has Archive" চালু থাকা দরকার'),

      p('<p>কন্টেন্ট টাইপ, ট্যাক্সোনমি, আর তাদের টেমপ্লেট সবকিছু কাজ করার পর, এটি এই অংশের CPT UI ভাগ শেষ করে দেয়। এখান থেকে, ফোকাস সরে যায় সেই কন্টেন্ট টাইপগুলোকে একটি title আর body-এর বাইরে আসল গঠনবদ্ধ ডেটা দেওয়ার দিকে — Secure Custom Fields।</p>'),
    ],
  },
})

lessons.push({
  slug: 'scf-intro',
  sortOrder: 18,
  en: {
    title: 'Introduction to Custom Fields & Secure Custom Fields',
    metaTitle: 'Introduction to Custom Fields & Secure Custom Fields | Learn Computer Academy',
    metaDescription: 'Why a title and a content area eventually aren\'t enough, and what Secure Custom Fields adds to solve it.',
    blocks: [
      p('<p>Every post type covered so far — posts, pages, a custom <code>project</code> type — has exactly two pieces of content: a title, and one big content area. That\'s genuinely enough for a blog post. It falls apart fast for a project that needs a client name, a completion date, and a gallery of images as separate, structured pieces of data rather than paragraphs mixed into one block of text.</p>'),

      h(2, 'What a Custom Field Is'),
      p('<p>A <b>custom field</b> is exactly what it sounds like: an extra, named piece of data attached to a post, alongside its title and content. WordPress has supported basic custom fields since very early versions, through a plain key/value box in the editor — functional, but with no field types, no validation, and a genuinely rough editing experience.</p>'),

      h(2, 'What Secure Custom Fields Adds'),
      p('<p>SCF (installed back in the setup lesson) replaces that with real, typed fields, organized into <b>field groups</b> that show up as a proper part of the editor screen — not a generic box at the bottom. A handful of the field types available:</p>'),
      table(
        ['Field Type', 'Stores'],
        [
          ['Text / Textarea', 'A single line or paragraph of plain text'],
          ['Number', 'A numeric value, with optional min/max/step validation'],
          ['Image', 'A reference to a media library image, with its URL, alt text, and dimensions'],
          ['True / False', 'A single checkbox — a yes/no toggle'],
          ['Select', 'One choice from a predefined list'],
          ['Link', 'A URL, paired with its own label and open-in-new-tab setting'],
          ['Repeater', 'A repeatable set of sub-fields — rows an editor can add or remove freely (its own lesson ahead)'],
        ]
      ),

      img(
        'docs/img/wordpress/custom-fields-intro-1',
        'Isometric diagram showing a form panel with several input field shapes connected by an arrow to a template code block, which produces a finished webpage section',
        1024, 768,
        'A field group gives an editor structured inputs; a template reads them back out wherever it needs that data.'
      ),

      callout('note', '<p>As covered in the setup lesson, SCF is the actively-maintained continuation of what most documentation and tutorials still call ACF (Advanced Custom Fields) — same function names, same underlying concepts, different plugin name after a 2024 licensing split.</p>', 'A reminder from earlier'),

      p('<p>The next lesson builds an actual field group and attaches it to the <code>project</code> post type from earlier, so every project gets its own client name, completion date, and gallery fields right in its editor screen.</p>'),
    ],
  },
  bn: {
    title: 'কাস্টম ফিল্ড আর Secure Custom Fields পরিচিতি',
    metaTitle: 'কাস্টম ফিল্ড আর Secure Custom Fields পরিচিতি | Learn Computer Academy',
    metaDescription: 'একটি title আর একটি content এরিয়া কেন শেষমেশ যথেষ্ট নয়, আর এটি সমাধান করতে Secure Custom Fields কী যোগ করে।',
    blocks: [
      p('<p>এখন পর্যন্ত কাভার করা প্রতিটি পোস্ট টাইপ — পোস্ট, পেজ, একটি কাস্টম <code>project</code> টাইপ — এর ঠিক দুটো কন্টেন্টের অংশ আছে: একটি title, আর একটি বড় content এরিয়া। একটি ব্লগ পোস্টের জন্য এটি সত্যিই যথেষ্ট। একটি প্রজেক্টের জন্য এটি দ্রুত ভেঙে পড়ে যার একটি ক্লায়েন্টের নাম, একটি সমাপ্তির তারিখ, আর একগুচ্ছ ছবি দরকার আলাদা, গঠনবদ্ধ ডেটার টুকরো হিসেবে, এক টুকরো টেক্সটের মধ্যে মেশানো প্যারাগ্রাফ হিসেবে নয়।</p>'),

      h(2, 'একটি কাস্টম ফিল্ড কী', 'what-a-custom-field-is'),
      p('<p>একটি <b>কাস্টম ফিল্ড</b> ঠিক তাই যা শোনায়: একটি অতিরিক্ত, নামযুক্ত ডেটার টুকরো একটি পোস্টের সাথে সংযুক্ত, তার title আর content-এর পাশে। WordPress-এ খুব প্রথম দিকের ভার্সন থেকে সাধারণ কাস্টম ফিল্ড সাপোর্ট আছে, এডিটরে একটি সাধারণ key/value বক্সের মাধ্যমে — কার্যকর, কিন্তু কোনো ফিল্ড টাইপ নেই, কোনো ভ্যালিডেশন নেই, আর সত্যিই একটি রুক্ষ এডিটিং অভিজ্ঞতা।</p>'),

      h(2, 'Secure Custom Fields কী যোগ করে', 'what-secure-custom-fields-adds'),
      p('<p>SCF (সেটআপ পাঠে ইনস্টল করা) এটিকে আসল, টাইপযুক্ত ফিল্ড দিয়ে প্রতিস্থাপন করে, <b>field group</b>-এ সংগঠিত যা এডিটর স্ক্রিনের একটি প্রকৃত অংশ হিসেবে দেখা যায় — নিচে একটি জেনেরিক বক্স নয়। উপলব্ধ কয়েকটি ফিল্ড টাইপ:</p>'),
      table(
        ['ফিল্ড টাইপ', 'যা সংরক্ষণ করে'],
        [
          ['Text / Textarea', 'সাধারণ টেক্সটের একটি লাইন বা প্যারাগ্রাফ'],
          ['Number', 'একটি সংখ্যাসূচক মান, ঐচ্ছিক min/max/step ভ্যালিডেশন সহ'],
          ['Image', 'মিডিয়া লাইব্রেরির একটি ছবির রেফারেন্স, এর URL, alt টেক্সট, আর মাপসহ'],
          ['True / False', 'একটি একক চেকবক্স — একটি হ্যাঁ/না টগল'],
          ['Select', 'একটি পূর্বনির্ধারিত তালিকা থেকে একটি পছন্দ'],
          ['Link', 'একটি URL, নিজের লেবেল আর open-in-new-tab সেটিং সহ জোড়া'],
          ['Repeater', 'সাব-ফিল্ডের একটি পুনরাবৃত্তিযোগ্য সেট — সারি যা একজন এডিটর স্বাধীনভাবে যোগ বা সরাতে পারেন (সামনে এর নিজস্ব একটি পাঠ)'],
        ]
      ),

      img(
        'docs/img/wordpress/custom-fields-intro-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে বেশ কয়েকটি ইনপুট ফিল্ড আকারসহ একটি ফর্ম প্যানেল একটি টেমপ্লেট কোড ব্লকের সাথে একটি তীর দিয়ে সংযুক্ত, যা একটি সম্পন্ন ওয়েবপেজ সেকশন তৈরি করছে',
        1024, 768,
        'একটি field group একজন এডিটরকে গঠনবদ্ধ ইনপুট দেয়; একটি টেমপ্লেট যেখানে সেই ডেটা দরকার সেখানে ফিরিয়ে পড়ে।'
      ),

      callout('note', '<p>সেটআপ পাঠে যেমন কাভার করা হয়েছে, SCF হলো সেই প্লাগইনটির সক্রিয়ভাবে-রক্ষণাবেক্ষণ করা ধারাবাহিকতা যাকে বেশিরভাগ ডকুমেন্টেশন আর টিউটোরিয়াল এখনও ACF (Advanced Custom Fields) বলে ডাকে — একই ফাংশনের নাম, একই মূল ধারণা, 2024-এর একটি লাইসেন্সিং বিভক্তির পর ভিন্ন প্লাগইনের নাম।</p>', 'আগের একটি স্মরণ করিয়ে দেওয়া'),

      p('<p>পরের পাঠ একটি আসল field group বানায় আর আগের <code>project</code> পোস্ট টাইপে সংযুক্ত করে, যাতে প্রতিটি প্রজেক্ট তার নিজস্ব ক্লায়েন্টের নাম, সমাপ্তির তারিখ, আর গ্যালারি ফিল্ড সরাসরি তার এডিটর স্ক্রিনে পায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'scf-field-groups',
  sortOrder: 19,
  en: {
    title: 'Building Field Groups with SCF',
    metaTitle: 'Building Field Groups with SCF | Learn Computer Academy',
    metaDescription: 'Adding fields to a field group and using location rules to attach it to the right post type.',
    blocks: [
      p('<p>From <b>Custom Fields → Add New</b> in the admin, a field group starts as just a name and a blank list — everything else is adding fields to it one at a time.</p>'),

      h(2, 'Adding a Field'),
      p('<p>Each field needs a <b>Field Label</b> (what an editor sees — "Client Name"), a <b>Field Name</b> (the key used to read it back in code, auto-filled from the label but worth checking), and a <b>Field Type</b> from the list in the previous lesson.</p>'),

      callout('tip', '<p>Field Name and Field Label look similar but do different jobs — the Label is what an editor sees, the Name is what your template code refers to (<code>get_field( \'client_name\' )</code>). Renaming a Label later is free; renaming a Name after fields have real data in them means updating every template that reads it.</p>', 'Get the Field Name right early'),

      h(2, 'Location Rules'),
      p('<p>A field group does nothing until it\'s told where to appear — the <b>Location Rules</b> section at the bottom, built as a simple "Show this field group if..." condition:</p>'),
      code('text', 'Show this field group if\nPost Type    is equal to    Project'),
      p('<p>Location rules can combine multiple conditions, and can target far more than just a post type — a specific page template, a taxonomy term, even a user role. For a <code>project</code>-specific field group, though, "Post Type is equal to Project" is usually the whole rule.</p>'),

      h(2, 'A Practical Field Group'),
      p('<p>For the <code>project</code> post type from earlier, a reasonable field group might be:</p>'),
      table(
        ['Field Label', 'Field Name', 'Type'],
        [
          ['Client Name', 'client_name', 'Text'],
          ['Completion Date', 'completion_date', 'Text (or Date Picker, if available)'],
          ['Project Gallery', 'project_gallery', 'Gallery / Repeater of Image fields'],
        ]
      ),

      p('<p>Save the field group, open (or create) a project, and those three fields now appear right below the content editor — ready to fill in. The next lesson gets that data back out, into an actual template.</p>'),
    ],
  },
  bn: {
    title: 'SCF দিয়ে Field Group বানানো',
    metaTitle: 'SCF দিয়ে Field Group বানানো | Learn Computer Academy',
    metaDescription: 'একটি field group-এ ফিল্ড যোগ করা আর সঠিক পোস্ট টাইপে এটি সংযুক্ত করতে location rules ব্যবহার করা।',
    blocks: [
      p('<p>অ্যাডমিনে <b>Custom Fields → Add New</b> থেকে, একটি field group শুধু একটি নাম আর একটি খালি তালিকা দিয়ে শুরু হয় — বাকি সবকিছু একে একে এতে ফিল্ড যোগ করা।</p>'),

      h(2, 'একটি ফিল্ড যোগ করা', 'adding-a-field'),
      p('<p>প্রতিটি ফিল্ডের একটি <b>Field Label</b> দরকার (একজন এডিটর যা দেখেন — "Client Name"), একটি <b>Field Name</b> (কোডে ফিরিয়ে পড়তে ব্যবহৃত কী, লেবেল থেকে স্বয়ংক্রিয়ভাবে পূরণ কিন্তু চেক করা ভালো), আর আগের পাঠের তালিকা থেকে একটি <b>Field Type</b>।</p>'),

      callout('tip', '<p>Field Name আর Field Label দেখতে একইরকম কিন্তু ভিন্ন কাজ করে — Label হলো একজন এডিটর যা দেখেন, Name হলো যা আপনার টেমপ্লেট কোড রেফারেন্স করে (<code>get_field( \'client_name\' )</code>)। পরে একটি Label বদলানো বিনামূল্যে; ফিল্ডে আসল ডেটা থাকার পর একটি Name বদলানো মানে যে প্রতিটি টেমপ্লেট এটি পড়ে সবগুলো আপডেট করা।</p>', 'শুরুতেই Field Name ঠিক করুন'),

      h(2, 'Location Rules', 'location-rules'),
      p('<p>একটি field group কিছুই করে না যতক্ষণ না তাকে বলা হয় কোথায় দেখা যাবে — নিচের <b>Location Rules</b> সেকশন, একটি সাধারণ "Show this field group if..." কন্ডিশন হিসেবে বানানো:</p>'),
      code('text', 'Show this field group if\nPost Type    is equal to    Project'),
      p('<p>Location rules একাধিক কন্ডিশন একসাথে করতে পারে, আর শুধু একটি পোস্ট টাইপের চেয়ে অনেক বেশি টার্গেট করতে পারে — একটি নির্দিষ্ট পেজ টেমপ্লেট, একটি ট্যাক্সোনমি টার্ম, এমনকি একটি ইউজার রোল। তবে একটি <code>project</code>-নির্দিষ্ট field group-এর জন্য, "Post Type is equal to Project" সাধারণত পুরো নিয়মটাই।</p>'),

      h(2, 'একটি ব্যবহারিক Field Group', 'a-practical-field-group'),
      p('<p>আগের <code>project</code> পোস্ট টাইপের জন্য, একটি যুক্তিসঙ্গত field group হতে পারে:</p>'),
      table(
        ['Field Label', 'Field Name', 'Type'],
        [
          ['Client Name', 'client_name', 'Text'],
          ['Completion Date', 'completion_date', 'Text (বা Date Picker, উপলব্ধ থাকলে)'],
          ['Project Gallery', 'project_gallery', 'Gallery / Image ফিল্ডের Repeater'],
        ]
      ),

      p('<p>Field group সংরক্ষণ করুন, একটি project খুলুন (বা তৈরি করুন), আর সেই তিনটি ফিল্ড এখন content এডিটরের ঠিক নিচে দেখা যায় — পূরণ করার জন্য তৈরি। পরের পাঠ সেই ডেটা ফিরিয়ে বের করে, একটি আসল টেমপ্লেটে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'scf-display-fields',
  sortOrder: 20,
  en: {
    title: 'Displaying SCF Fields in Templates',
    metaTitle: 'Displaying SCF Fields in Templates | Learn Computer Academy',
    metaDescription: 'get_field() vs. the_field(), and what each field type actually returns when you read it back in a template.',
    blocks: [
      p('<p>Every custom field created in the last lesson is just sitting in the database until a template actually reads it back out. Two functions do that, and the choice between them comes down to one question: do you need to <i>use</i> the value, or just <i>print</i> it?</p>'),

      h(2, 'the_field() vs. get_field()'),
      code('php', '<?php the_field( \'client_name\' ); ?>\n\n<?php $client = get_field( \'client_name\' ); ?>'),
      table(
        ['Function', 'Use it when'],
        [
          ['<code>the_field()</code>', 'You just want the value echoed straight into the page, right where you call it — the field-level equivalent of <code>the_title()</code>'],
          ['<code>get_field()</code>', 'You need the value in a variable first — to check it, format it, or pass it to another function'],
        ]
      ),
      p('<p>In practice, <code>get_field()</code> covers nearly everything, since even simple output usually wants an <code>if</code> check first (below). <code>the_field()</code> is really only for the simplest, always-present case.</p>'),

      h(2, 'What Each Type Returns'),
      p('<p>A field\'s type decides the shape of the value <code>get_field()</code> hands back — this is the part that trips people up first:</p>'),
      table(
        ['Field Type', 'Return value'],
        [
          ['Text / Textarea / Number', 'A plain string or number — safe to echo directly (after escaping)'],
          ['True / False', 'A plain PHP boolean — use directly in an <code>if</code>'],
          ['Image', 'An array by default — <code>[\'url\'], [\'alt\'], [\'width\'], [\'height\'], [\'ID\']</code>, among others'],
          ['Link', 'An array — <code>[\'url\'], [\'title\'], [\'target\']</code>'],
        ]
      ),

      h(2, 'A Realistic Example'),
      code('php', '<?php $client = get_field( \'client_name\' ); ?>\n<?php if ( $client ) : ?>\n    <p>Client: <?php echo esc_html( $client ); ?></p>\n<?php endif; ?>\n\n<?php $photo = get_field( \'featured_photo\' ); ?>\n<?php if ( $photo ) : ?>\n    <img src="<?php echo esc_url( $photo[\'url\'] ); ?>" alt="<?php echo esc_attr( $photo[\'alt\'] ); ?>">\n<?php endif; ?>'),

      callout('warning', '<p>Custom fields are almost never required — an editor can always leave one blank. Every read should be checked before it\'s used, the same way <code>$client</code> and <code>$photo</code> are checked above. Skipping the check doesn\'t crash the page outright, but it does produce empty <code>&lt;img&gt;</code> tags and stray labels with nothing after them on any post where the field was left blank.</p>', 'Fields are optional — always check before using'),

      p('<p>With a way to both write and read structured data, the next lesson covers the field type built specifically for <i>repeating</i> structured data — a gallery of images, a list of features, anything that isn\'t just one value.</p>'),
    ],
  },
  bn: {
    title: 'টেমপ্লেটে SCF ফিল্ড দেখানো',
    metaTitle: 'টেমপ্লেটে SCF ফিল্ড দেখানো | Learn Computer Academy',
    metaDescription: 'get_field() বনাম the_field(), আর একটি টেমপ্লেটে ফিরিয়ে পড়ার সময় প্রতিটি ফিল্ড টাইপ আসলে কী রিটার্ন করে।',
    blocks: [
      p('<p>শেষ পাঠে তৈরি করা প্রতিটি কাস্টম ফিল্ড শুধু ডেটাবেসে বসে আছে যতক্ষণ না একটি টেমপ্লেট আসলে সেটি ফিরিয়ে পড়ে। দুটো ফাংশন এটি করে, আর দুটোর মধ্যে পছন্দ একটি প্রশ্নে নেমে আসে: আপনার মানটি <i>ব্যবহার</i> করা দরকার, নাকি শুধু <i>প্রিন্ট</i> করা?</p>'),

      h(2, 'the_field() বনাম get_field()', 'the_field-vs-get_field'),
      code('php', '<?php the_field( \'client_name\' ); ?>\n\n<?php $client = get_field( \'client_name\' ); ?>'),
      table(
        ['ফাংশন', 'কখন ব্যবহার করবেন'],
        [
          ['<code>the_field()</code>', 'আপনি শুধু চান মানটি সরাসরি পাতায় echo হয়ে যাক, ঠিক যেখানে আপনি এটি কল করেন — <code>the_title()</code>-এর ফিল্ড-লেভেল সমতুল্য'],
          ['<code>get_field()</code>', 'আপনার আগে একটি ভ্যারিয়েবলে মানটি দরকার — এটি চেক করতে, ফরম্যাট করতে, বা অন্য ফাংশনে পাস করতে'],
        ]
      ),
      p('<p>বাস্তবে, <code>get_field()</code> প্রায় সবকিছু কাভার করে, কারণ সাধারণ আউটপুটও সাধারণত আগে একটি <code>if</code> চেক চায় (নিচে)। <code>the_field()</code> সত্যিই শুধু সবচেয়ে সহজ, সবসময়-উপস্থিত কেসের জন্য।</p>'),

      h(2, 'প্রতিটি টাইপ কী রিটার্ন করে', 'what-each-type-returns'),
      p('<p>একটি ফিল্ডের টাইপ ঠিক করে <code>get_field()</code> যে আকারের মান ফেরত দেয় — এই অংশটাই মানুষকে প্রথমে বিভ্রান্ত করে:</p>'),
      table(
        ['ফিল্ড টাইপ', 'রিটার্ন মান'],
        [
          ['Text / Textarea / Number', 'একটি সাধারণ string বা number — সরাসরি echo করা নিরাপদ (escape করার পর)'],
          ['True / False', 'একটি সাধারণ PHP boolean — সরাসরি একটি <code>if</code>-এ ব্যবহার করুন'],
          ['Image', 'ডিফল্টভাবে একটি অ্যারে — <code>[\'url\'], [\'alt\'], [\'width\'], [\'height\'], [\'ID\']</code>, আরও কিছুসহ'],
          ['Link', 'একটি অ্যারে — <code>[\'url\'], [\'title\'], [\'target\']</code>'],
        ]
      ),

      h(2, 'একটি বাস্তবসম্মত উদাহরণ', 'a-realistic-example'),
      code('php', '<?php $client = get_field( \'client_name\' ); ?>\n<?php if ( $client ) : ?>\n    <p>Client: <?php echo esc_html( $client ); ?></p>\n<?php endif; ?>\n\n<?php $photo = get_field( \'featured_photo\' ); ?>\n<?php if ( $photo ) : ?>\n    <img src="<?php echo esc_url( $photo[\'url\'] ); ?>" alt="<?php echo esc_attr( $photo[\'alt\'] ); ?>">\n<?php endif; ?>'),

      callout('warning', '<p>কাস্টম ফিল্ড প্রায় কখনোই বাধ্যতামূলক নয় — একজন এডিটর সবসময় একটি খালি রাখতে পারেন। প্রতিটি রিড ব্যবহারের আগে চেক করা উচিত, উপরে <code>$client</code> আর <code>$photo</code> যেভাবে চেক করা হয়েছে সেভাবে। চেক বাদ দিলে পাতাটি সরাসরি ক্র্যাশ করে না, কিন্তু যে পোস্টে ফিল্ডটি খালি রাখা হয়েছে তাতে এটি খালি <code>&lt;img&gt;</code> ট্যাগ আর পরে কিছু ছাড়া বিচ্ছিন্ন লেবেল তৈরি করে।</p>', 'ফিল্ড ঐচ্ছিক — ব্যবহারের আগে সবসময় চেক করুন'),

      p('<p>গঠনবদ্ধ ডেটা লেখা আর পড়া দুটোরই উপায় হয়ে যাওয়ার পর, পরের পাঠ বিশেষভাবে <i>পুনরাবৃত্ত</i> গঠনবদ্ধ ডেটার জন্য বানানো ফিল্ড টাইপ কাভার করে — ছবির একটি গ্যালারি, ফিচারের একটি তালিকা, শুধু একটি মান নয় এমন যেকোনো কিছু।</p>'),
    ],
  },
})

lessons.push({
  slug: 'scf-repeater-group',
  sortOrder: 21,
  en: {
    title: 'Repeater & Group Fields',
    metaTitle: 'Repeater & Group Fields | Learn Computer Academy',
    metaDescription: 'Building repeatable rows of structured content with SCF\'s Repeater field, and bundling related fields together with a Group field.',
    blocks: [
      p('<p>Every field type so far stores exactly one value. A <b>Repeater</b> field stores a whole list of them — rows an editor can add, remove, and reorder freely, each containing the same set of sub-fields.</p>'),

      h(2, 'A Repeater in the Editor'),
      p('<p>A "Features" repeater on a product, for example, might have two sub-fields per row: <code>feature_title</code> and <code>feature_description</code>. An editor sees an "Add Row" button and can end up with three rows, ten rows, or zero — the template code stays exactly the same regardless of how many.</p>'),

      img(
        'docs/img/wordpress/repeater-fields-1',
        'Isometric diagram showing a vertical repeating stack of identical small card modules, each containing a couple of simple field shapes',
        1024, 768,
        'A repeater is one set of sub-fields, repeated as many times as an editor adds a row.'
      ),

      h(2, 'Looping Over It'),
      code('php', '<?php if ( have_rows( \'features\' ) ) : ?>\n    <ul>\n    <?php while ( have_rows( \'features\' ) ) : the_row(); ?>\n        <li>\n            <strong><?php the_sub_field( \'feature_title\' ); ?></strong>\n            <?php the_sub_field( \'feature_description\' ); ?>\n        </li>\n    <?php endwhile; ?>\n    </ul>\n<?php endif; ?>'),
      p('<p>The pattern deliberately echoes the Loop from earlier: <code>have_rows()</code> checks for another row, <code>the_row()</code> advances to it, and <code>the_sub_field()</code> / <code>get_sub_field()</code> read a sub-field from the current row — the same <code>the_</code>/<code>get_</code> split as regular fields, just scoped to one row at a time.</p>'),

      h(2, 'Group Fields'),
      p('<p>A <b>Group</b> field looks similar but solves a different problem — it bundles a fixed, non-repeating set of related sub-fields under one field, mostly to keep a large field group organized rather than to repeat anything:</p>'),
      code('php', '<?php $address = get_field( \'company_address\' ); ?>\n<p><?php echo esc_html( $address[\'street\'] ); ?>, <?php echo esc_html( $address[\'city\'] ); ?></p>'),
      p('<p><code>get_field()</code> on a Group returns one array with every sub-field as a key — no looping needed, since there\'s always exactly one of it.</p>'),

      callout('tip', '<p>Repeaters can technically be nested inside each other, but it\'s worth resisting past one level. A repeater-inside-a-repeater is a genuinely awkward editing experience for whoever fills it in — if the data needs that much structure, a second custom post type (linked with a Post Object or Relationship field) is usually the better fit.</p>', 'Keep repeaters shallow'),

      p('<p>With structured, repeatable content covered, the next lesson looks at data that doesn\'t belong to any single post at all — site-wide settings, using an SCF options page.</p>'),
    ],
  },
  bn: {
    title: 'Repeater আর Group ফিল্ড',
    metaTitle: 'Repeater আর Group ফিল্ড | Learn Computer Academy',
    metaDescription: 'SCF-এর Repeater ফিল্ড দিয়ে গঠনবদ্ধ কন্টেন্টের পুনরাবৃত্তিযোগ্য সারি বানানো, আর একটি Group ফিল্ড দিয়ে সম্পর্কিত ফিল্ড একসাথে বান্ডেল করা।',
    blocks: [
      p('<p>এখন পর্যন্ত প্রতিটি ফিল্ড টাইপ ঠিক একটি মান সংরক্ষণ করে। একটি <b>Repeater</b> ফিল্ড এদের একটি সম্পূর্ণ তালিকা সংরক্ষণ করে — সারি যা একজন এডিটর স্বাধীনভাবে যোগ, সরাতে, আর পুনর্বিন্যাস করতে পারেন, প্রতিটিতে একই সেট সাব-ফিল্ড থাকে।</p>'),

      h(2, 'এডিটরে একটি Repeater', 'a-repeater-in-the-editor'),
      p('<p>উদাহরণস্বরূপ, একটি প্রোডাক্টে একটি "Features" repeater-এ প্রতি সারিতে দুটো সাব-ফিল্ড থাকতে পারে: <code>feature_title</code> আর <code>feature_description</code>। একজন এডিটর একটি "Add Row" বাটন দেখেন আর তিনটি সারি, দশটি সারি, বা শূন্যতে শেষ করতে পারেন — টেমপ্লেট কোড ঠিক একই থাকে যতগুলোই হোক না কেন।</p>'),

      img(
        'docs/img/wordpress/repeater-fields-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে অভিন্ন ছোট কার্ড মডিউলের একটি উল্লম্ব পুনরাবৃত্ত স্তূপ দেখানো হয়েছে, প্রতিটিতে কয়েকটি সাধারণ ফিল্ড আকার আছে',
        1024, 768,
        'একটি repeater হলো সাব-ফিল্ডের একটি সেট, একজন এডিটর যতবার একটি সারি যোগ করেন ততবার পুনরাবৃত্ত।'
      ),

      h(2, 'এর উপর লুপ করা', 'looping-over-it'),
      code('php', '<?php if ( have_rows( \'features\' ) ) : ?>\n    <ul>\n    <?php while ( have_rows( \'features\' ) ) : the_row(); ?>\n        <li>\n            <strong><?php the_sub_field( \'feature_title\' ); ?></strong>\n            <?php the_sub_field( \'feature_description\' ); ?>\n        </li>\n    <?php endwhile; ?>\n    </ul>\n<?php endif; ?>'),
      p('<p>প্যাটার্নটি ইচ্ছাকৃতভাবে আগের Loop-এর প্রতিধ্বনি করে: <code>have_rows()</code> আরেকটি সারি আছে কিনা চেক করে, <code>the_row()</code> তাতে এগিয়ে যায়, আর <code>the_sub_field()</code> / <code>get_sub_field()</code> বর্তমান সারি থেকে একটি সাব-ফিল্ড পড়ে — সাধারণ ফিল্ডের একই <code>the_</code>/<code>get_</code> বিভাজন, শুধু একবারে একটি সারিতে সীমাবদ্ধ।</p>'),

      h(2, 'Group ফিল্ড', 'group-fields'),
      p('<p>একটি <b>Group</b> ফিল্ড দেখতে একইরকম কিন্তু ভিন্ন একটি সমস্যা সমাধান করে — এটি একটি ফিল্ডের নিচে সম্পর্কিত সাব-ফিল্ডের একটি নির্দিষ্ট, non-repeating সেট বান্ডেল করে, বেশিরভাগ কিছু পুনরাবৃত্তি করার বদলে একটি বড় field group সংগঠিত রাখতে:</p>'),
      code('php', '<?php $address = get_field( \'company_address\' ); ?>\n<p><?php echo esc_html( $address[\'street\'] ); ?>, <?php echo esc_html( $address[\'city\'] ); ?></p>'),
      p('<p>একটি Group-এ <code>get_field()</code> প্রতিটি সাব-ফিল্ডকে একটি কী হিসেবে রেখে একটি অ্যারে রিটার্ন করে — কোনো looping লাগে না, কারণ সবসময় ঠিক একটিই থাকে।</p>'),

      callout('tip', '<p>Repeater টেকনিক্যালি একে অপরের ভেতরে নেস্ট করা যায়, কিন্তু এক লেভেলের বেশি এড়িয়ে যাওয়া ভালো। একটি repeater-এর-ভেতরে-repeater যে কেউ এটি পূরণ করেন তার জন্য সত্যিই একটি বিশ্রী এডিটিং অভিজ্ঞতা — ডেটার যদি এতটা গঠন দরকার হয়, একটি দ্বিতীয় কাস্টম পোস্ট টাইপ (একটি Post Object বা Relationship ফিল্ড দিয়ে সংযুক্ত) সাধারণত ভালো ফিট।</p>', 'Repeater অগভীর রাখুন'),

      p('<p>গঠনবদ্ধ, পুনরাবৃত্তিযোগ্য কন্টেন্ট কাভার হয়ে যাওয়ার পর, পরের পাঠ এমন ডেটা দেখে যা আদৌ কোনো একক পোস্টের অন্তর্গত নয় — সাইট-জোড়া সেটিংস, একটি SCF options page ব্যবহার করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'scf-options-pages',
  sortOrder: 22,
  en: {
    title: 'SCF Options Pages',
    metaTitle: 'SCF Options Pages | Learn Computer Academy',
    metaDescription: 'Building a dedicated admin settings screen for site-wide data with acf_add_options_page(), for settings too big for the Customizer.',
    blocks: [
      p('<p>Every field group so far attaches to a post — it needs a specific post to belong to. Some data genuinely doesn\'t: a company phone number, a default social sharing image, a footer disclaimer. The Customizer lesson covered a lightweight way to handle a couple of values like that; an <b>options page</b> is the fuller version, built for a whole settings screen with as many fields as a site needs.</p>'),

      h(2, 'Registering the Page'),
      code('php', '<?php\nif ( function_exists( \'acf_add_options_page\' ) ) {\n    acf_add_options_page( [\n        \'page_title\' => \'Theme Settings\',\n        \'menu_title\' => \'Theme Settings\',\n        \'menu_slug\'  => \'theme-settings\',\n        \'capability\' => \'manage_options\',\n    ] );\n}\n'),
      p('<p>Despite the function name still starting with <code>acf_</code> — a holdover from before the ACF/SCF split, kept for compatibility — this call works exactly the same way under Secure Custom Fields. It adds a new top-level admin menu item; nothing shows up in it until a field group is pointed at it.</p>'),

      h(2, 'Attaching Fields to It'),
      p('<p>Same field group screen as always (<b>Custom Fields → Add New</b>), just with a different location rule:</p>'),
      code('text', 'Show this field group if\nOptions Page    is equal to    Theme Settings'),
      p('<p>Add whatever fields the settings screen needs — a phone number, an address, a default Open Graph image — the same field types covered throughout this section, just not attached to any particular post.</p>'),

      h(2, 'Reading Options Page Fields'),
      p('<p>The one real difference from every other field read so far: pass <code>\'option\'</code> as a second argument, since there\'s no current post to default to:</p>'),
      code('php', '<?php $phone = get_field( \'phone_number\', \'option\' ); ?>\n<?php if ( $phone ) : ?>\n    <a href="tel:<?php echo esc_attr( $phone ); ?>"><?php echo esc_html( $phone ); ?></a>\n<?php endif; ?>'),

      callout('note', '<p>This is the practical answer to the question the Customizer lesson raised: a handful of simple values → the Customizer, with its live preview. A real settings screen, with structured or repeatable fields → an SCF options page. Most real theme builds end up using both, for different things.</p>', 'Customizer vs. options page, settled'),

      p('<p>That closes out the custom fields part of this section — post-level fields, repeaters, and now site-wide settings, all read the same consistent way. From here, the section moves into finishing touches every real theme needs before it\'s ready to hand off.</p>'),
    ],
  },
  bn: {
    title: 'SCF Options Pages',
    metaTitle: 'SCF Options Pages | Learn Computer Academy',
    metaDescription: 'acf_add_options_page() দিয়ে সাইট-জোড়া ডেটার জন্য একটি নিবেদিত অ্যাডমিন সেটিংস স্ক্রিন বানানো, Customizer-এর জন্য যা অনেক বড় সেই সেটিংসের জন্য।',
    blocks: [
      p('<p>এখন পর্যন্ত প্রতিটি field group একটি পোস্টের সাথে সংযুক্ত হয় — এর একটি নির্দিষ্ট পোস্টের অন্তর্গত হওয়া দরকার। কিছু ডেটা সত্যিই তা নয়: একটি কোম্পানির ফোন নাম্বার, একটি ডিফল্ট সোশ্যাল শেয়ারিং ইমেজ, একটি ফুটার ডিসক্লেইমার। Customizer পাঠ এই ধরনের কয়েকটি মান সামলানোর একটি হালকা উপায় কাভার করেছে; একটি <b>options page</b> হলো এর পূর্ণাঙ্গ ভার্সন, একটি সাইটের যত ফিল্ড দরকার তার পুরো একটি সেটিংস স্ক্রিনের জন্য বানানো।</p>'),

      h(2, 'পেজ রেজিস্টার করা', 'registering-the-page'),
      code('php', '<?php\nif ( function_exists( \'acf_add_options_page\' ) ) {\n    acf_add_options_page( [\n        \'page_title\' => \'Theme Settings\',\n        \'menu_title\' => \'Theme Settings\',\n        \'menu_slug\'  => \'theme-settings\',\n        \'capability\' => \'manage_options\',\n    ] );\n}\n'),
      p('<p>ফাংশনের নাম এখনও <code>acf_</code> দিয়ে শুরু হওয়া সত্ত্বেও — ACF/SCF বিভক্তির আগের একটি অবশিষ্টাংশ, সামঞ্জস্যের জন্য রাখা হয়েছে — এই কলটি Secure Custom Fields-এর অধীনে ঠিক একইভাবে কাজ করে। এটি একটি নতুন টপ-লেভেল অ্যাডমিন মেনু আইটেম যোগ করে; একটি field group এতে নির্দেশ না করা পর্যন্ত এতে কিছুই দেখা যায় না।</p>'),

      h(2, 'এতে ফিল্ড সংযুক্ত করা', 'attaching-fields-to-it'),
      p('<p>সবসময়ের মতো একই field group স্ক্রিন (<b>Custom Fields → Add New</b>), শুধু একটি ভিন্ন location rule সহ:</p>'),
      code('text', 'Show this field group if\nOptions Page    is equal to    Theme Settings'),
      p('<p>সেটিংস স্ক্রিনের যা দরকার তাই যোগ করুন — একটি ফোন নাম্বার, একটি ঠিকানা, একটি ডিফল্ট Open Graph ইমেজ — এই অংশ জুড়ে কাভার করা একই ফিল্ড টাইপ, শুধু কোনো নির্দিষ্ট পোস্টের সাথে সংযুক্ত নয়।</p>'),

      h(2, 'Options Page ফিল্ড পড়া', 'reading-options-page-fields'),
      p('<p>এখন পর্যন্ত পড়া বাকি প্রতিটি ফিল্ড থেকে একমাত্র আসল পার্থক্য: দ্বিতীয় আর্গুমেন্ট হিসেবে <code>\'option\'</code> পাস করুন, কারণ ডিফল্ট হওয়ার মতো কোনো বর্তমান পোস্ট নেই:</p>'),
      code('php', '<?php $phone = get_field( \'phone_number\', \'option\' ); ?>\n<?php if ( $phone ) : ?>\n    <a href="tel:<?php echo esc_attr( $phone ); ?>"><?php echo esc_html( $phone ); ?></a>\n<?php endif; ?>'),

      callout('note', '<p>Customizer পাঠ যে প্রশ্ন তুলেছিল তার ব্যবহারিক উত্তর এটাই: কয়েকটি সাধারণ মান → Customizer, তার live preview সহ। একটি আসল সেটিংস স্ক্রিন, গঠনবদ্ধ বা পুনরাবৃত্তিযোগ্য ফিল্ডসহ → একটি SCF options page। বেশিরভাগ আসল থিম বিল্ড শেষ পর্যন্ত ভিন্ন ভিন্ন জিনিসের জন্য দুটোই ব্যবহার করে।</p>', 'Customizer বনাম options page, নিষ্পত্তি হলো'),

      p('<p>এটি এই অংশের কাস্টম ফিল্ড ভাগ শেষ করে দেয় — পোস্ট-লেভেল ফিল্ড, repeater, আর এখন সাইট-জোড়া সেটিংস, সবকিছু একই সামঞ্জস্যপূর্ণ উপায়ে পড়া হয়। এখান থেকে, অংশটি সেই ফিনিশিং টাচগুলোতে চলে যায় যা প্রতিটি আসল থিমের হস্তান্তরের জন্য প্রস্তুত হওয়ার আগে দরকার।</p>'),
    ],
  },
})

lessons.push({
  slug: 'featured-images',
  sortOrder: 23,
  en: {
    title: 'Featured Images & Custom Image Sizes',
    metaTitle: 'Featured Images & Custom Image Sizes | Learn Computer Academy',
    metaDescription: 'Outputting a post\'s featured image correctly, and registering custom crop sizes so a theme never has to resize images by hand.',
    blocks: [
      p('<p>The <code>add_theme_support( \'post-thumbnails\' )</code> call back in the theme setup lesson is what turns on featured images at all — this lesson covers actually using them.</p>'),

      h(2, 'Outputting a Featured Image'),
      code('php', '<?php if ( has_post_thumbnail() ) : ?>\n    <?php the_post_thumbnail( \'large\' ); ?>\n<?php endif; ?>'),
      p('<p><code>has_post_thumbnail()</code> checks whether one was ever set — never assume it was, an editor can always skip it. <code>the_post_thumbnail()</code> takes an optional size name; leaving it out uses <code>\'thumbnail\'</code>, almost never what you actually want.</p>'),

      h(2, 'The Built-In Sizes'),
      table(
        ['Size', 'Default dimensions'],
        [
          ['thumbnail', '150×150, cropped'],
          ['medium', '300×300 max, not cropped (keeps aspect ratio)'],
          ['large', '1024×1024 max, not cropped'],
          ['full', 'The original uploaded image, unresized'],
        ]
      ),

      h(2, 'Registering a Custom Size'),
      p('<p>The built-in sizes rarely match a specific design exactly — a card grid might need a consistent 400×300 crop, for instance. <code>add_image_size()</code> registers a new one, in <code>functions.php</code>:</p>'),
      code('php', '<?php\nfunction mytheme_image_sizes() {\n    add_image_size( \'card-thumb\', 400, 300, true );\n}\nadd_action( \'after_setup_theme\', \'mytheme_image_sizes\' );'),
      p('<p>The fourth argument (<code>true</code>) means <b>hard crop</b> — exactly 400×300, cropping whatever doesn\'t fit, rather than shrinking to fit within those dimensions while keeping the original aspect ratio.</p>'),
      code('php', '<?php the_post_thumbnail( \'card-thumb\' ); ?>'),

      callout('tip', '<p>A custom size registered <i>after</i> images already exist only applies to newly-uploaded ones — WordPress generates every registered size at upload time, not on demand. Adding a size to an existing site with existing content usually means running the free Regenerate Thumbnails plugin once, to backfill the new crop for every already-uploaded image.</p>', 'New sizes don\'t retroactively apply'),

      p('<p>With images handled properly, the next lesson covers something that applies to everything built so far, not just images — escaping and sanitizing any data a template outputs.</p>'),
    ],
  },
  bn: {
    title: 'ফিচার্ড ইমেজ আর কাস্টম ইমেজ সাইজ',
    metaTitle: 'ফিচার্ড ইমেজ আর কাস্টম ইমেজ সাইজ | Learn Computer Academy',
    metaDescription: 'একটি পোস্টের ফিচার্ড ইমেজ সঠিকভাবে আউটপুট করা, আর কাস্টম ক্রপ সাইজ রেজিস্টার করা যাতে একটি থিমকে কখনো হাতে ছবির আকার বদলাতে না হয়।',
    blocks: [
      p('<p>থিম সেটআপ পাঠে <code>add_theme_support( \'post-thumbnails\' )</code> কলটাই ফিচার্ড ইমেজ আদৌ চালু করে — এই পাঠ কাভার করে আসলে সেগুলো ব্যবহার করা।</p>'),

      h(2, 'একটি ফিচার্ড ইমেজ আউটপুট করা', 'outputting-a-featured-image'),
      code('php', '<?php if ( has_post_thumbnail() ) : ?>\n    <?php the_post_thumbnail( \'large\' ); ?>\n<?php endif; ?>'),
      p('<p><code>has_post_thumbnail()</code> চেক করে একটি কখনো সেট হয়েছিল কিনা — কখনো ধরে নেবেন না হয়েছে, একজন এডিটর সবসময় এটি এড়িয়ে যেতে পারেন। <code>the_post_thumbnail()</code> একটি ঐচ্ছিক সাইজ নাম নেয়; এটি বাদ দিলে <code>\'thumbnail\'</code> ব্যবহার হয়, যা প্রায় কখনোই আপনি আসলে চান না।</p>'),

      h(2, 'বিল্ট-ইন সাইজগুলো', 'the-built-in-sizes'),
      table(
        ['সাইজ', 'ডিফল্ট মাপ'],
        [
          ['thumbnail', '150×150, ক্রপ করা'],
          ['medium', 'সর্বোচ্চ 300×300, ক্রপ করা নয় (অ্যাসপেক্ট রেশিও রাখে)'],
          ['large', 'সর্বোচ্চ 1024×1024, ক্রপ করা নয়'],
          ['full', 'মূল আপলোড করা ছবি, আকার পরিবর্তন না করা'],
        ]
      ),

      h(2, 'একটি কাস্টম সাইজ রেজিস্টার করা', 'registering-a-custom-size'),
      p('<p>বিল্ট-ইন সাইজ কালেভদ্রেই একটি নির্দিষ্ট ডিজাইনের সাথে ঠিক মেলে — উদাহরণস্বরূপ, একটি কার্ড গ্রিডে একটি সামঞ্জস্যপূর্ণ 400×300 ক্রপ দরকার হতে পারে। <code>add_image_size()</code> <code>functions.php</code>-এ একটি নতুন রেজিস্টার করে:</p>'),
      code('php', '<?php\nfunction mytheme_image_sizes() {\n    add_image_size( \'card-thumb\', 400, 300, true );\n}\nadd_action( \'after_setup_theme\', \'mytheme_image_sizes\' );'),
      p('<p>চতুর্থ আর্গুমেন্ট (<code>true</code>) মানে <b>hard crop</b> — ঠিক 400×300, যা মেলে না তা ক্রপ করে, মূল অ্যাসপেক্ট রেশিও রেখে সেই মাপের মধ্যে ফিট করার জন্য সংকুচিত করার বদলে।</p>'),
      code('php', '<?php the_post_thumbnail( \'card-thumb\' ); ?>'),

      callout('tip', '<p>ছবি ইতিমধ্যে থাকার <i>পরে</i> রেজিস্টার করা একটি কাস্টম সাইজ শুধু নতুন-আপলোড করা ছবিতে প্রযোজ্য হয় — WordPress আপলোডের সময় প্রতিটি রেজিস্টার করা সাইজ তৈরি করে, চাহিদা অনুযায়ী নয়। বিদ্যমান কন্টেন্টসহ একটি বিদ্যমান সাইটে একটি সাইজ যোগ করার মানে সাধারণত একবার ফ্রি Regenerate Thumbnails প্লাগইন চালানো, প্রতিটি আগে-আপলোড করা ছবির জন্য নতুন ক্রপ ব্যাকফিল করতে।</p>', 'নতুন সাইজ পূর্ববর্তীভাবে প্রযোজ্য হয় না'),

      p('<p>ছবি সঠিকভাবে সামলানো হয়ে যাওয়ার পর, পরের পাঠ এমন কিছু কাভার করে যা এখন পর্যন্ত বানানো সবকিছুতে প্রযোজ্য, শুধু ছবিতে নয় — একটি টেমপ্লেট আউটপুট করা যেকোনো ডেটা escape আর sanitize করা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'escaping-sanitizing',
  sortOrder: 24,
  en: {
    title: 'Escaping & Sanitizing Output',
    metaTitle: 'Escaping & Sanitizing Output | Learn Computer Academy',
    metaDescription: 'Why every value a template echoes needs to pass through an escaping function first, and which one to use for which context.',
    blocks: [
      p('<p>Every earlier lesson\'s code examples already used <code>esc_html()</code>, <code>esc_attr()</code>, and <code>esc_url()</code> without fully explaining why. This lesson covers the reason directly: escaping is what stands between a theme and a genuinely serious security hole.</p>'),

      h(2, 'The Problem'),
      p('<p>Any value that ultimately comes from user input — a custom field, a comment, a URL parameter, a title someone typed into the editor — could theoretically contain HTML or JavaScript instead of plain text. Echo it straight into a page without escaping, and that code doesn\'t just display as text; it executes. That\'s a <b>Cross-Site Scripting (XSS)</b> vulnerability, and it\'s the single most common security issue in hand-written WordPress themes.</p>'),

      h(2, 'Escaping on Output'),
      p('<p>Escaping converts a value into a form that\'s always safe to display in a specific context — the function to use depends entirely on <i>where</i> the value is going:</p>'),
      table(
        ['Function', 'Use for'],
        [
          ['<code>esc_html()</code>', 'Plain text between HTML tags — <code>&lt;p&gt;&lt;?php echo esc_html( $x ); ?&gt;&lt;/p&gt;</code>'],
          ['<code>esc_attr()</code>', 'A value inside an HTML attribute — <code>alt="&lt;?php echo esc_attr( $x ); ?&gt;"</code>'],
          ['<code>esc_url()</code>', 'A URL, in an <code>href</code> or <code>src</code>'],
          ['<code>wp_kses_post()</code>', 'Content that\'s allowed to contain <i>some</i> HTML (bold, links, and so on) — used for rich content like <code>the_content()</code>, which handles this internally already'],
        ]
      ),
      code('php', '<a href="<?php echo esc_url( $link ); ?>" title="<?php echo esc_attr( $title ); ?>">\n    <?php echo esc_html( $label ); ?>\n</a>'),

      callout('warning', '<p>Every single one of these functions is used correctly in every code example across this entire section, on purpose — go back and look at any of them again with this in mind, and the pattern (escape everything, choose the function by context) is already there, repeated dozens of times.</p>', 'This has been the pattern all along'),

      h(2, 'When It\'s Safe to Skip'),
      p('<p>The one common exception: values that came from your own code, never from any kind of input — a hardcoded string, a number from <code>count()</code>. Escaping those isn\'t wrong, just unnecessary. When in doubt about where a value originated, escape it; the cost of an unneeded <code>esc_html()</code> call is nothing, and the cost of a missing one on real user input is a security bug.</p>'),

      p('<p>With output secured, the next lesson collects a handful of smaller, genuinely useful <code>functions.php</code> utilities that come up in almost every real theme build.</p>'),
    ],
  },
  bn: {
    title: 'আউটপুট Escape আর Sanitize করা',
    metaTitle: 'আউটপুট Escape আর Sanitize করা | Learn Computer Academy',
    metaDescription: 'একটি টেমপ্লেট echo করা প্রতিটি মানের আগে কেন একটি escaping ফাংশনের মধ্য দিয়ে যাওয়া দরকার, আর কোন প্রসঙ্গের জন্য কোনটি ব্যবহার করবেন।',
    blocks: [
      p('<p>আগের প্রতিটি পাঠের কোড উদাহরণ ইতিমধ্যে <code>esc_html()</code>, <code>esc_attr()</code>, আর <code>esc_url()</code> ব্যবহার করেছে সম্পূর্ণভাবে কেন তা ব্যাখ্যা না করেই। এই পাঠ সরাসরি কারণটি কাভার করে: escaping হলো সেই জিনিস যা একটি থিম আর একটি সত্যিকারের গুরুতর নিরাপত্তা ছিদ্রের মধ্যে দাঁড়িয়ে থাকে।</p>'),

      h(2, 'সমস্যাটি', 'the-problem'),
      p('<p>শেষ পর্যন্ত ইউজার ইনপুট থেকে আসা যেকোনো মান — একটি কাস্টম ফিল্ড, একটি কমেন্ট, একটি URL প্যারামিটার, কেউ এডিটরে টাইপ করা একটি title — তাত্ত্বিকভাবে সাধারণ টেক্সটের বদলে HTML বা JavaScript থাকতে পারে। Escape না করে এটি সরাসরি একটি পাতায় echo করুন, আর সেই কোড শুধু টেক্সট হিসেবে দেখা যায় না; এটি এক্সিকিউট হয়। এটি একটি <b>Cross-Site Scripting (XSS)</b> দুর্বলতা, আর এটি হাতে-লেখা WordPress থিমে একক সবচেয়ে সাধারণ নিরাপত্তা সমস্যা।</p>'),

      h(2, 'আউটপুটে Escaping', 'escaping-on-output'),
      p('<p>Escaping একটি মানকে এমন একটি রূপে রূপান্তর করে যা একটি নির্দিষ্ট প্রসঙ্গে দেখানোর জন্য সবসময় নিরাপদ — কোন ফাংশন ব্যবহার করবেন তা সম্পূর্ণভাবে নির্ভর করে মানটি <i>কোথায়</i> যাচ্ছে তার উপর:</p>'),
      table(
        ['ফাংশন', 'যার জন্য ব্যবহার'],
        [
          ['<code>esc_html()</code>', 'HTML ট্যাগের মাঝে সাধারণ টেক্সট — <code>&lt;p&gt;&lt;?php echo esc_html( $x ); ?&gt;&lt;/p&gt;</code>'],
          ['<code>esc_attr()</code>', 'একটি HTML অ্যাট্রিবিউটের ভেতরে একটি মান — <code>alt="&lt;?php echo esc_attr( $x ); ?&gt;"</code>'],
          ['<code>esc_url()</code>', 'একটি URL, একটি <code>href</code> বা <code>src</code>-তে'],
          ['<code>wp_kses_post()</code>', '<i>কিছু</i> HTML থাকার অনুমতি আছে এমন কন্টেন্ট (bold, লিংক, ইত্যাদি) — <code>the_content()</code>-এর মতো রিচ কন্টেন্টের জন্য ব্যবহৃত, যা এটি ইতিমধ্যে অভ্যন্তরীণভাবে সামলায়'],
        ]
      ),
      code('php', '<a href="<?php echo esc_url( $link ); ?>" title="<?php echo esc_attr( $title ); ?>">\n    <?php echo esc_html( $label ); ?>\n</a>'),

      callout('warning', '<p>এই ফাংশনগুলোর প্রতিটি এই সম্পূর্ণ অংশ জুড়ে প্রতিটি কোড উদাহরণে সঠিকভাবে ব্যবহার হয়েছে, ইচ্ছাকৃতভাবে — এটি মাথায় রেখে যেকোনোটি আবার দেখুন, আর প্যাটার্নটি (সবকিছু escape করুন, প্রসঙ্গ অনুযায়ী ফাংশন বেছে নিন) ইতিমধ্যে সেখানে, ডজন ডজন বার পুনরাবৃত্ত।</p>', 'এটাই শুরু থেকে প্যাটার্ন ছিল'),

      h(2, 'কখন বাদ দেওয়া নিরাপদ', 'when-its-safe-to-skip'),
      p('<p>একটি সাধারণ ব্যতিক্রম: এমন মান যা আপনার নিজের কোড থেকে এসেছে, কোনো ধরনের ইনপুট থেকে কখনোই নয় — একটি হার্ডকোড করা string, <code>count()</code> থেকে একটি সংখ্যা। এগুলো escape করা ভুল নয়, শুধু অপ্রয়োজনীয়। একটি মান কোথা থেকে এসেছে তা নিয়ে সন্দেহ থাকলে, এটি escape করুন; একটি অপ্রয়োজনীয় <code>esc_html()</code> কলের খরচ কিছুই না, আর আসল ইউজার ইনপুটে একটি অনুপস্থিত কলের খরচ একটি নিরাপত্তা বাগ।</p>'),

      p('<p>আউটপুট সুরক্ষিত হয়ে যাওয়ার পর, পরের পাঠ কয়েকটি ছোট, সত্যিই কাজের <code>functions.php</code> ইউটিলিটি সংগ্রহ করে যা প্রায় প্রতিটি আসল থিম বিল্ডে আসে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'functions-php-utilities',
  sortOrder: 25,
  en: {
    title: 'Useful functions.php Utilities',
    metaTitle: 'Useful functions.php Utilities | Learn Computer Academy',
    metaDescription: 'A handful of small, genuinely practical functions.php additions that show up in almost every real custom theme build.',
    blocks: [
      p('<p>A few small additions that don\'t fit neatly into any single earlier lesson, but come up often enough in real theme builds to be worth collecting here.</p>'),

      h(2, 'Cleaning Up wp_head()'),
      p('<p>By default, <code>wp_head()</code> outputs a few things most sites don\'t need — a meta tag announcing the exact WordPress version (a minor information-disclosure risk) and legacy links few tools still use:</p>'),
      code('php', '<?php\nremove_action( \'wp_head\', \'wp_generator\' );          // WordPress version meta tag\nremove_action( \'wp_head\', \'rsd_link\' );              // legacy remote-publishing link\nremove_action( \'wp_head\', \'wlwmanifest_link\' );       // legacy Windows Live Writer link\n'),
      p('<p>None of this changes how the site looks or behaves for a visitor — it just trims a handful of lines a browser never renders anyway.</p>'),

      h(2, 'A Simple Breadcrumb Helper'),
      p('<p>WordPress has no built-in breadcrumb function. A small custom one, called from within a template, covers the common case:</p>'),
      code('php', '<?php\nfunction mytheme_breadcrumb() {\n    echo \'<nav aria-label="Breadcrumb"><ol>\';\n    echo \'<li><a href="\' . esc_url( home_url( \'/\' ) ) . \'">Home</a></li>\';\n\n    if ( is_page() && $post->post_parent ) {\n        echo \'<li><a href="\' . esc_url( get_permalink( $post->post_parent ) ) . \'">\' . esc_html( get_the_title( $post->post_parent ) ) . \'</a></li>\';\n    }\n\n    echo \'<li aria-current="page">\' . esc_html( get_the_title() ) . \'</li>\';\n    echo \'</ol></nav>\';\n}\n'),
      p('<p>Called simply as <code>&lt;?php mytheme_breadcrumb(); ?&gt;</code> anywhere in <code>page.php</code> or <code>single.php</code>. Real sites usually extend this to also handle single posts\' categories and archive pages — this covers the shape, not every branch.</p>'),

      h(2, 'A tel: / mailto: Link Helper'),
      p('<p>A custom field storing a phone number or email as plain text still needs the right <code>href</code> scheme to actually be clickable as a phone call or email draft — easy to forget on a busy contact page with several such links:</p>'),
      code('php', '<?php\nfunction mytheme_contact_href( $value ) {\n    if ( is_email( $value ) ) {\n        return \'mailto:\' . antispambot( $value );\n    }\n    $digits = preg_replace( \'/[^\\d+]/\', \'\', $value );\n    return $digits ? \'tel:\' . $digits : \'\';\n}\n'),
      code('php', '<?php $phone = get_field( \'phone_number\', \'option\' ); ?>\n<a href="<?php echo esc_attr( mytheme_contact_href( $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>'),
      p('<p><code>antispambot()</code> is a built-in WordPress function that obfuscates an email address\'s HTML slightly, to make it a little harder for basic scrapers to harvest — a small, free precaution worth using anywhere an email address is printed in plain sight.</p>'),

      callout('tip', '<p>None of these three are required — a site works without them. They\'re the kind of small polish that separates a theme that merely functions from one that feels finished, and every one of them lives in exactly one place: <code>functions.php</code>.</p>', 'Small, optional, worth doing anyway'),

      p('<p>With the theme functionally complete, the final lesson in this section covers what\'s left before handing it to a client or pushing it live.</p>'),
    ],
  },
  bn: {
    title: 'কাজের functions.php ইউটিলিটি',
    metaTitle: 'কাজের functions.php ইউটিলিটি | Learn Computer Academy',
    metaDescription: 'কয়েকটি ছোট, সত্যিই ব্যবহারিক functions.php সংযোজন যা প্রায় প্রতিটি আসল কাস্টম থিম বিল্ডে দেখা যায়।',
    blocks: [
      p('<p>কয়েকটি ছোট সংযোজন যা আগের কোনো একক পাঠে ভালোভাবে ফিট করে না, কিন্তু আসল থিম বিল্ডে এত ঘন ঘন আসে যে এখানে সংগ্রহ করা মূল্যবান।</p>'),

      h(2, 'wp_head() পরিষ্কার করা', 'cleaning-up-wp_head'),
      p('<p>ডিফল্টভাবে, <code>wp_head()</code> কয়েকটি জিনিস আউটপুট করে যা বেশিরভাগ সাইটের দরকার নেই — একটি মেটা ট্যাগ যা সঠিক WordPress ভার্সন ঘোষণা করে (একটি ছোট তথ্য-প্রকাশের ঝুঁকি) আর পুরনো লিংক যা খুব কম টুল এখনও ব্যবহার করে:</p>'),
      code('php', '<?php\nremove_action( \'wp_head\', \'wp_generator\' );          // WordPress version meta tag\nremove_action( \'wp_head\', \'rsd_link\' );              // legacy remote-publishing link\nremove_action( \'wp_head\', \'wlwmanifest_link\' );       // legacy Windows Live Writer link\n'),
      p('<p>এর কোনোটাই একজন ভিজিটরের জন্য সাইটটি কেমন দেখাচ্ছে বা আচরণ করছে তা বদলায় না — এটি শুধু কয়েকটি লাইন ছেঁটে দেয় যা একটি ব্রাউজার যেভাবেই হোক কখনো রেন্ডার করে না।</p>'),

      h(2, 'একটি সাধারণ Breadcrumb Helper', 'a-simple-breadcrumb-helper'),
      p('<p>WordPress-এ কোনো বিল্ট-ইন breadcrumb ফাংশন নেই। একটি টেমপ্লেটের ভেতর থেকে কল করা একটি ছোট কাস্টম ফাংশন সাধারণ কেসটি কাভার করে:</p>'),
      code('php', '<?php\nfunction mytheme_breadcrumb() {\n    echo \'<nav aria-label="Breadcrumb"><ol>\';\n    echo \'<li><a href="\' . esc_url( home_url( \'/\' ) ) . \'">Home</a></li>\';\n\n    if ( is_page() && $post->post_parent ) {\n        echo \'<li><a href="\' . esc_url( get_permalink( $post->post_parent ) ) . \'">\' . esc_html( get_the_title( $post->post_parent ) ) . \'</a></li>\';\n    }\n\n    echo \'<li aria-current="page">\' . esc_html( get_the_title() ) . \'</li>\';\n    echo \'</ol></nav>\';\n}\n'),
      p('<p><code>page.php</code> বা <code>single.php</code>-এর যেকোনো জায়গায় শুধু <code>&lt;?php mytheme_breadcrumb(); ?&gt;</code> হিসেবে কল করা হয়। আসল সাইট সাধারণত এটিকে একক পোস্টের ক্যাটাগরি আর আর্কাইভ পেজও সামলাতে বর্ধিত করে — এটি আকারটি কাভার করে, প্রতিটি শাখা নয়।</p>'),

      h(2, 'একটি tel: / mailto: লিংক Helper', 'a-tel--mailto-link-helper'),
      p('<p>একটি ফোন নাম্বার বা ইমেইল সাধারণ টেক্সট হিসেবে সংরক্ষণ করা একটি কাস্টম ফিল্ডের এখনও একটি ফোন কল বা ইমেইল ড্রাফট হিসেবে আসলে ক্লিকযোগ্য হতে সঠিক <code>href</code> স্কিম দরকার — এমন কয়েকটি লিংকসহ একটি ব্যস্ত কন্টাক্ট পেজে ভুলে যাওয়া সহজ:</p>'),
      code('php', '<?php\nfunction mytheme_contact_href( $value ) {\n    if ( is_email( $value ) ) {\n        return \'mailto:\' . antispambot( $value );\n    }\n    $digits = preg_replace( \'/[^\\d+]/\', \'\', $value );\n    return $digits ? \'tel:\' . $digits : \'\';\n}\n'),
      code('php', '<?php $phone = get_field( \'phone_number\', \'option\' ); ?>\n<a href="<?php echo esc_attr( mytheme_contact_href( $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>'),
      p('<p><code>antispambot()</code> একটি বিল্ট-ইন WordPress ফাংশন যা একটি ইমেইল ঠিকানার HTML সামান্য অস্পষ্ট করে দেয়, সাধারণ স্ক্র্যাপারদের জন্য এটি সংগ্রহ করা একটু কঠিন করতে — একটি ছোট, ফ্রি সতর্কতা যা যেখানেই একটি ইমেইল ঠিকানা প্রকাশ্যে প্রিন্ট করা হয় সেখানে ব্যবহার করা মূল্যবান।</p>'),

      callout('tip', '<p>এই তিনটির কোনোটাই বাধ্যতামূলক নয় — এগুলো ছাড়াও একটি সাইট কাজ করে। এগুলো সেই ধরনের ছোট পালিশ যা একটি থিমকে শুধু কাজ করা থেকে সম্পন্ন মনে হওয়ায় আলাদা করে, আর এদের প্রতিটি ঠিক একটি জায়গায় থাকে: <code>functions.php</code>।</p>', 'ছোট, ঐচ্ছিক, তবুও করা মূল্যবান'),

      p('<p>থিমটি কার্যকরীভাবে সম্পূর্ণ হয়ে যাওয়ার পর, এই অংশের শেষ পাঠ কাভার করে একটি ক্লায়েন্টের হাতে তুলে দেওয়া বা লাইভ পুশ করার আগে আর কী বাকি আছে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'launch-checklist',
  sortOrder: 26,
  en: {
    title: 'Preparing a Theme for Launch',
    metaTitle: 'Preparing a Theme for Launch | Learn Computer Academy',
    metaDescription: 'The last checks worth running through before a custom theme goes live — from debug settings to a final pass over every template.',
    blocks: [
      p('<p>A theme that works on a local install still needs a final pass before it\'s genuinely ready for a live site. None of this is complicated, but skipping it is exactly how small, avoidable problems make it to production.</p>'),

      h(2, 'The Checklist'),
      table(
        ['Check', 'Why'],
        [
          ['<code>WP_DEBUG</code> is <code>false</code> in <code>wp-config.php</code>', 'A debug-enabled site can print raw PHP errors and warnings straight onto the page — visible to any visitor, and a real information leak'],
          ['<code>screenshot.png</code> is a real, current screenshot', 'Cosmetic, but the first thing anyone sees in Appearance → Themes'],
          ['Every template file was actually tested', 'A single post, a page, the homepage, an archive, a 404, and every custom post type\'s single and archive views — each is a separate file that can fail independently'],
          ['No leftover debug code', 'Stray <code>var_dump()</code>, <code>print_r()</code>, or <code>console.log()</code> calls left in from development'],
          ['Browser console is free of errors', 'A broken enqueue or a missing dependency often only shows up here, not visually'],
          ['Permalinks were re-saved once', 'Settings → Permalinks → Save Changes, to make sure every custom post type and taxonomy\'s URLs are actually registered'],
        ]
      ),

      h(2, 'A Final Content Pass'),
      p('<p>With Classic Editor and Gutenberg both out of the picture, it\'s worth double-checking that every custom field a template reads actually has real, sensible fallback behavior when left blank — an empty options-page phone number shouldn\'t leave a dangling, empty <code>&lt;a&gt;</code> tag anywhere on the live site.</p>'),

      callout('tip', '<p>If a hosting environment supports it, testing on an actual staging copy of the live server — not just a local install — catches the class of bugs that only show up under real server config: PHP version differences, missing extensions, file permission issues. Worth doing at least once before a genuine launch.</p>', 'Local isn\'t the same as production'),

      p('<p>That\'s the full path this section set out to cover — from an empty theme folder to a working, custom-built WordPress theme with its own post types, structured content, and settings, built entirely on plain PHP templates and three focused plugins, with no page builder and no block editor anywhere in the way.</p>'),
    ],
  },
  bn: {
    title: 'একটি থিম লঞ্চের জন্য প্রস্তুত করা',
    metaTitle: 'একটি থিম লঞ্চের জন্য প্রস্তুত করা | Learn Computer Academy',
    metaDescription: 'একটি কাস্টম থিম লাইভ হওয়ার আগে চালানো মূল্যবান শেষ চেক — ডিবাগ সেটিংস থেকে প্রতিটি টেমপ্লেটের উপর একটি চূড়ান্ত পাস পর্যন্ত।',
    blocks: [
      p('<p>একটি লোকাল ইনস্টলে কাজ করা একটি থিমের এখনও একটি লাইভ সাইটের জন্য সত্যিই প্রস্তুত হওয়ার আগে একটি চূড়ান্ত পাস দরকার। এর কোনোটাই জটিল নয়, কিন্তু এটি এড়িয়ে যাওয়াই ঠিক যেভাবে ছোট, এড়ানো যায় এমন সমস্যা প্রোডাকশনে পৌঁছায়।</p>'),

      h(2, 'চেকলিস্ট', 'the-checklist'),
      table(
        ['চেক', 'কেন'],
        [
          ['<code>wp-config.php</code>-এ <code>WP_DEBUG</code> হলো <code>false</code>', 'একটি ডিবাগ-সক্রিয় সাইট কাঁচা PHP এরর আর ওয়ার্নিং সরাসরি পাতায় প্রিন্ট করতে পারে — যেকোনো ভিজিটরের কাছে দৃশ্যমান, আর একটি আসল তথ্য ফাঁস'],
          ['<code>screenshot.png</code> একটি আসল, বর্তমান স্ক্রিনশট', 'কসমেটিক, কিন্তু Appearance → Themes-এ যে কেউ প্রথমে যা দেখেন'],
          ['প্রতিটি টেমপ্লেট ফাইল আসলে টেস্ট করা হয়েছে', 'একটি একক পোস্ট, একটি পেজ, হোমপেজ, একটি আর্কাইভ, একটি 404, আর প্রতিটি কাস্টম পোস্ট টাইপের single আর archive ভিউ — প্রতিটি একটি আলাদা ফাইল যা স্বাধীনভাবে ব্যর্থ হতে পারে'],
          ['কোনো অবশিষ্ট ডিবাগ কোড নেই', 'ডেভেলপমেন্ট থেকে থেকে যাওয়া বিচ্ছিন্ন <code>var_dump()</code>, <code>print_r()</code>, বা <code>console.log()</code> কল'],
          ['ব্রাউজার কনসোল এরর-মুক্ত', 'একটি ভাঙা enqueue বা একটি অনুপস্থিত ডিপেন্ডেন্সি প্রায়ই শুধু এখানেই দেখা যায়, দৃশ্যত নয়'],
          ['Permalinks একবার আবার সংরক্ষণ করা হয়েছে', 'Settings → Permalinks → Save Changes, নিশ্চিত করতে যে প্রতিটি কাস্টম পোস্ট টাইপ আর ট্যাক্সোনমির URL আসলে রেজিস্টার করা আছে'],
        ]
      ),

      h(2, 'একটি চূড়ান্ত কন্টেন্ট পাস', 'a-final-content-pass'),
      p('<p>Classic Editor আর Gutenberg দুটোই ছবির বাইরে থাকায়, দুবার চেক করা মূল্যবান যে একটি টেমপ্লেট যে প্রতিটি কাস্টম ফিল্ড পড়ে তার আসলেই খালি রাখা হলে সত্যিকারের, যুক্তিসঙ্গত ফলব্যাক আচরণ আছে — একটি খালি options-page ফোন নাম্বার লাইভ সাইটের কোথাও একটি ঝুলন্ত, খালি <code>&lt;a&gt;</code> ট্যাগ রেখে যাওয়া উচিত না।</p>'),

      callout('tip', '<p>একটি হোস্টিং এনভায়রনমেন্ট যদি সাপোর্ট করে, লাইভ সার্ভারের একটি আসল স্টেজিং কপিতে টেস্ট করা — শুধু একটি লোকাল ইনস্টল নয় — সেই শ্রেণীর বাগ ধরে যা শুধু আসল সার্ভার কনফিগে দেখা যায়: PHP ভার্সনের পার্থক্য, অনুপস্থিত এক্সটেনশন, ফাইল পারমিশন সমস্যা। একটি প্রকৃত লঞ্চের আগে কমপক্ষে একবার করা মূল্যবান।</p>', 'লোকাল প্রোডাকশনের মতো নয়'),

      p('<p>এটাই সেই সম্পূর্ণ পথ যা এই অংশ কাভার করার লক্ষ্য নিয়েছিল — একটি খালি থিম ফোল্ডার থেকে একটি কার্যকর, কাস্টম-বানানো WordPress থিম পর্যন্ত, নিজস্ব পোস্ট টাইপ, গঠনবদ্ধ কন্টেন্ট, আর সেটিংসসহ, সম্পূর্ণভাবে সাধারণ PHP টেমপ্লেট আর তিনটি নির্দিষ্ট প্লাগইনের উপর বানানো, কোথাও কোনো পেজ বিল্ডার বা ব্লক এডিটর পথে না এসে।</p>'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'wordpress').single()
  if (catErr || !category) {
    console.error('Category "wordpress" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] wordpress/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] wordpress/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `wordpress/${lesson.slug}`
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

  console.log(`\n✅ Done.`)
}

main().catch(err => { console.error(err); process.exit(1) })
