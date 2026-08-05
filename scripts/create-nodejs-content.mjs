#!/usr/bin/env node
// New "nodejs" category — 26 lessons, outline approved with the site owner
// 2026-08-05 (docs/CONTENT-PIPELINE.md). Builds on the existing
// `javascript` category (variables/functions/async syntax aren't re-taught
// here — Node's runtime and APIs are the focus) and links out to `sql` for
// database querying once a connection is made.
//
// Original content — written fresh for this site (CONTENT-PIPELINE.md §3).
// Deliberately does NOT compare Node to PHP or Python (site owner
// instruction, 2026-08-05) — contrasts, where useful, are against
// client-side JavaScript, which every reader already knows from the JS
// course.
//
// Idempotent — upserts on `path` / `doc_id,locale`. Usage:
//   node scripts/create-nodejs-content.mjs [--dry-run]

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
    title: 'Introduction to Node.js',
    metaTitle: 'Introduction to Node.js | Learn Computer Academy',
    metaDescription: 'What Node.js actually is, why JavaScript can run outside a browser at all, and what kinds of programs people build with it.',
    blocks: [
      p('<p>Every JavaScript program you\'ve written so far runs inside a browser — a webpage loads it, and the browser\'s built-in JavaScript engine executes it. <b>Node.js</b> takes that same engine out of the browser entirely, so JavaScript can run directly on a computer, as its own standalone program.</p>'),

      h(2, 'The Engine Underneath'),
      p('<p>Every browser has a JavaScript engine buried inside it — Chrome\'s is called <b>V8</b>. V8\'s job is to read JavaScript code and turn it into instructions the computer can actually run. It doesn\'t care where the code came from; it just executes it.</p><p>Node.js is built around that same V8 engine, wrapped with extra tools for things a browser deliberately doesn\'t allow: reading and writing files, listening for network connections, talking to a database. The language is identical — the same variables, functions, and syntax you already know — only what it\'s <i>allowed to touch</i> changes.</p>'),

      img(
        'docs/img/nodejs/introduction-1',
        'Diagram showing the same V8 JavaScript engine running inside a browser on one side and inside Node.js on a server on the other side',
        1024, 768,
        'Node.js runs the same JavaScript engine as your browser — just without a browser around it.'
      ),

      h(2, 'Browser JavaScript vs. Node.js'),
      p('<p>The two environments give JavaScript access to different things, because they solve different problems.</p>'),
      table(
        ['', 'Runs where', 'Can access', 'Cannot access'],
        [
          ['Browser JavaScript', 'Inside a webpage', 'The page\'s HTML/CSS (the DOM), browser APIs', 'The computer\'s file system, arbitrary network ports'],
          ['Node.js', 'Directly on a computer', 'Files, the file system, network connections, environment variables', 'A DOM — there is no page or window to manipulate'],
        ]
      ),
      p('<p>This is why a Node.js program can never call <code>document.querySelector()</code> — there\'s no document. And why browser JavaScript can never read a file from your hard drive directly — letting a random webpage do that would be a serious security problem.</p>'),

      h(2, 'What People Build With It'),
      p('<p>Because Node.js can read files, open network connections, and keep a program running indefinitely, it\'s well suited to exactly the things a browser can\'t do:</p><ul><li><b>Web servers</b> — a program that listens for incoming requests and sends back a webpage, an image, or data.</li><li><b>APIs</b> — a server that a website (or a mobile app) can ask for data over the network.</li><li><b>Command-line tools</b> — the <code>npm</code> command you\'ll use in the next lesson is itself written in Node.js.</li><li><b>Build tools</b> — many of the tools that bundle and optimize websites before they\'re published run on Node.js behind the scenes.</li></ul>'),

      callout('note', '<p>Node.js isn\'t a language — it\'s a <i>runtime</i>. The language is still JavaScript. Node.js is the program that runs it outside a browser, plus the extra built-in tools that make that useful.</p>', 'Runtime, not a language'),

      h(2, 'Where This Fits'),
      p('<p>You\'ve already used JavaScript to make a webpage interactive on the visitor\'s side. Node.js is what lets that same language sit on the <i>other</i> side — the server — deciding what to send a visitor before their browser ever sees it. The rest of this course builds that up piece by piece: running scripts, organizing code into modules, reading files, and eventually building a real server that responds to requests.</p>'),
    ],
  },
  bn: {
    title: 'Node.js পরিচিতি',
    metaTitle: 'Node.js পরিচিতি | Learn Computer Academy',
    metaDescription: 'Node.js আসলে কী, ব্রাউজারের বাইরে JavaScript চলতে পারে কেন, আর এটি দিয়ে সাধারণত কী ধরনের প্রোগ্রাম তৈরি করা হয়।',
    blocks: [
      p('<p>এখন পর্যন্ত আপনি যত JavaScript প্রোগ্রাম লিখেছেন সবই ব্রাউজারের ভেতরে চলে — একটি ওয়েবপেজ সেটি লোড করে, আর ব্রাউজারের বিল্ট-ইন JavaScript ইঞ্জিন সেটি এক্সিকিউট করে। <b>Node.js</b> সেই একই ইঞ্জিনকে ব্রাউজার থেকে সম্পূর্ণ বের করে আনে, যাতে JavaScript সরাসরি একটি কম্পিউটারে, নিজস্ব একটি স্বতন্ত্র প্রোগ্রাম হিসেবে চলতে পারে।</p>'),

      h(2, 'নিচে থাকা ইঞ্জিন', 'the-engine-underneath'),
      p('<p>প্রতিটি ব্রাউজারের ভেতরে একটি JavaScript ইঞ্জিন লুকানো থাকে — Chrome-এরটির নাম <b>V8</b>। V8-এর কাজ হলো JavaScript কোড পড়ে সেটিকে এমন নির্দেশনায় রূপান্তর করা যা কম্পিউটার সত্যিই চালাতে পারে। কোডটি কোথা থেকে এসেছে সেটি নিয়ে এর কোনো মাথাব্যথা নেই; এটি শুধু সেটি এক্সিকিউট করে।</p><p>Node.js সেই একই V8 ইঞ্জিনের চারপাশে তৈরি, সাথে এমন কিছু অতিরিক্ত টুল যুক্ত যা ব্রাউজার ইচ্ছাকৃতভাবে অনুমতি দেয় না: ফাইল পড়া ও লেখা, নেটওয়ার্ক সংযোগের জন্য অপেক্ষা করা, একটি ডেটাবেসের সাথে কথা বলা। ভাষাটি একদম একই — আপনার ইতিমধ্যে জানা একই ভেরিয়েবল, ফাংশন, আর সিনট্যাক্স — শুধু এটি <i>কী স্পর্শ করার অনুমতি পায়</i> তা বদলায়।</p>'),

      img(
        'docs/img/nodejs/introduction-1',
        'ডায়াগ্রাম যেখানে একদিকে একটি ব্রাউজারের ভেতরে আর অন্যদিকে একটি সার্ভারে Node.js-এ একই V8 JavaScript ইঞ্জিন চলছে দেখানো হয়েছে',
        1024, 768,
        'Node.js আপনার ব্রাউজারের মতো একই JavaScript ইঞ্জিন চালায় — শুধু চারপাশে কোনো ব্রাউজার ছাড়া।'
      ),

      h(2, 'ব্রাউজার JavaScript বনাম Node.js', 'browser-javascript-vs-nodejs'),
      p('<p>দুটি পরিবেশ JavaScript-কে ভিন্ন জিনিসে প্রবেশাধিকার দেয়, কারণ তারা ভিন্ন সমস্যা সমাধান করে।</p>'),
      table(
        ['', 'কোথায় চলে', 'কী অ্যাক্সেস করতে পারে', 'কী অ্যাক্সেস করতে পারে না'],
        [
          ['ব্রাউজার JavaScript', 'একটি ওয়েবপেজের ভেতরে', 'পেজের HTML/CSS (DOM), ব্রাউজার API', 'কম্পিউটারের ফাইল সিস্টেম, যেকোনো নেটওয়ার্ক পোর্ট'],
          ['Node.js', 'সরাসরি একটি কম্পিউটারে', 'ফাইল, ফাইল সিস্টেম, নেটওয়ার্ক সংযোগ, এনভায়রনমেন্ট ভেরিয়েবল', 'কোনো DOM নেই — ম্যানিপুলেট করার মতো কোনো পেজ বা উইন্ডো নেই'],
        ]
      ),
      p('<p>এই কারণেই একটি Node.js প্রোগ্রাম কখনো <code>document.querySelector()</code> কল করতে পারে না — কোনো ডকুমেন্ট নেই। আর ব্রাউজার JavaScript কখনো সরাসরি আপনার হার্ড ড্রাইভ থেকে একটি ফাইল পড়তে পারে না — একটি র‍্যান্ডম ওয়েবপেজকে সেটি করতে দিলে সেটি একটি গুরুতর নিরাপত্তা সমস্যা হতো।</p>'),

      h(2, 'এটি দিয়ে মানুষ কী তৈরি করে', 'what-people-build-with-it'),
      p('<p>Node.js ফাইল পড়তে পারে, নেটওয়ার্ক সংযোগ খুলতে পারে, আর একটি প্রোগ্রামকে অনির্দিষ্টকাল চালু রাখতে পারে বলে, ব্রাউজার যা পারে না ঠিক সেই কাজগুলোর জন্য এটি বেশ উপযোগী:</p><ul><li><b>ওয়েব সার্ভার</b> — এমন একটি প্রোগ্রাম যা আগত রিকোয়েস্টের জন্য অপেক্ষা করে আর একটি ওয়েবপেজ, ছবি, বা ডেটা ফেরত পাঠায়।</li><li><b>API</b> — এমন একটি সার্ভার যাকে একটি ওয়েবসাইট (বা মোবাইল অ্যাপ) নেটওয়ার্কের মাধ্যমে ডেটার জন্য অনুরোধ করতে পারে।</li><li><b>কমান্ড-লাইন টুল</b> — পরের পাঠে ব্যবহার করা <code>npm</code> কমান্ডটি নিজেই Node.js-এ লেখা।</li><li><b>বিল্ড টুল</b> — অনেক টুল যা ওয়েবসাইটগুলো প্রকাশের আগে বান্ডল আর অপ্টিমাইজ করে, পেছনে Node.js-এর উপর চলে।</li></ul>'),

      callout('note', '<p>Node.js কোনো ভাষা নয় — এটি একটি <i>রানটাইম</i>। ভাষাটি এখনো JavaScript-ই। Node.js হলো সেই প্রোগ্রাম যা এটিকে ব্রাউজারের বাইরে চালায়, সাথে বিল্ট-ইন অতিরিক্ত টুলগুলো যা সেটিকে কাজে লাগায়।</p>', 'ভাষা নয়, রানটাইম'),

      h(2, 'এটি কোথায় ফিট করে', 'where-this-fits'),
      p('<p>আপনি ইতিমধ্যে JavaScript ব্যবহার করে ভিজিটরের পাশে একটি ওয়েবপেজকে ইন্টারেক্টিভ করেছেন। Node.js হলো যা একই ভাষাকে <i>অন্য</i> পাশে — সার্ভারে — বসতে দেয়, একজন ভিজিটরের ব্রাউজার কিছু দেখার আগেই তাকে কী পাঠানো হবে তা ঠিক করে। এই কোর্সের বাকি অংশ এটিকে ধাপে ধাপে গড়ে তোলে: স্ক্রিপ্ট চালানো, কোডকে মডিউলে সাজানো, ফাইল পড়া, আর শেষে একটি বাস্তব সার্ভার তৈরি করা যা রিকোয়েস্টের জবাব দেয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'setup',
  sortOrder: 2,
  en: {
    title: 'Installing Node.js',
    metaTitle: 'Installing Node.js | Learn Computer Academy',
    metaDescription: 'Install Node.js, confirm it worked, and run your first script with the node command and the interactive REPL.',
    blocks: [
      p('<p>Node.js is a program you install on your computer, the same way you\'d install any other application. Once it\'s installed, you get two new commands in your terminal: <code>node</code> and <code>npm</code>.</p>'),

      h(2, 'Installing'),
      p('<p>Download the installer from <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">nodejs.org</a>. You\'ll see two options — always pick the one labeled <b>LTS</b> (Long-Term Support). It\'s the version that\'s had the most testing and is what most real projects run in production; the other option changes too often to be worth the risk while you\'re learning.</p>'),

      h(2, 'Confirming It Worked'),
      p('<p>Open a terminal and run:</p>'),
      code('bash', 'node --version\nnpm --version'),
      p('<p>Both commands should print a version number. If you see "command not found" instead, the installer likely needs your terminal restarted, or on Windows, a system restart, before the new commands are recognized.</p>'),

      h(2, 'Running Your First Script'),
      p('<p>Create a file called <code>hello.js</code> with one line:</p>'),
      code('javascript', 'console.log("Hello from Node.js")'),
      p('<p>Then run it from the terminal, in the same folder:</p>'),
      code('bash', 'node hello.js'),
      p('<p>That\'s the entire workflow: write JavaScript in a file, hand the file to <code>node</code>, and it runs — no browser, no HTML page, nothing else involved.</p>'),

      h(2, 'The REPL'),
      p('<p>Running <code>node</code> with no filename drops you into the <b>REPL</b> (Read-Eval-Print Loop) — a prompt where you can type JavaScript one line at a time and see the result immediately. It\'s useful for quickly testing a small piece of code without creating a file.</p>'),
      code('bash', '$ node\n> 2 + 2\n4\n> "hello".toUpperCase()\n\'HELLO\'\n> .exit'),
      callout('tip', '<p>Type <code>.exit</code>, or press <code>Ctrl+C</code> twice, to leave the REPL.</p>'),
    ],
  },
  bn: {
    title: 'Node.js ইনস্টল করা',
    metaTitle: 'Node.js ইনস্টল করা | Learn Computer Academy',
    metaDescription: 'Node.js ইনস্টল করুন, এটি কাজ করছে কিনা নিশ্চিত করুন, আর node কমান্ড এবং ইন্টারঅ্যাক্টিভ REPL দিয়ে আপনার প্রথম স্ক্রিপ্ট চালান।',
    blocks: [
      p('<p>Node.js এমন একটি প্রোগ্রাম যা আপনি আপনার কম্পিউটারে ইনস্টল করেন, ঠিক যেভাবে আপনি অন্য যেকোনো অ্যাপ্লিকেশন ইনস্টল করতেন। একবার ইনস্টল হয়ে গেলে, আপনার টার্মিনালে দুটি নতুন কমান্ড পাবেন: <code>node</code> আর <code>npm</code>।</p>'),

      h(2, 'ইনস্টল করা', 'installing'),
      p('<p><a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">nodejs.org</a> থেকে ইনস্টলার ডাউনলোড করুন। আপনি দুটি অপশন দেখবেন — সবসময় <b>LTS</b> (Long-Term Support) লেবেলযুক্তটি বাছুন। এটি সেই ভার্সন যেটি সবচেয়ে বেশি টেস্ট করা হয়েছে আর যা বাস্তব প্রোজেক্টে প্রোডাকশনে চলে; অন্য অপশনটি এতটাই ঘন ঘন বদলায় যে শেখার সময় ঝুঁকি নেওয়ার মতো নয়।</p>'),

      h(2, 'এটি কাজ করেছে কিনা নিশ্চিত করা', 'confirming-it-worked'),
      p('<p>একটি টার্মিনাল খুলে এটি চালান:</p>'),
      code('bash', 'node --version\nnpm --version'),
      p('<p>দুটি কমান্ডই একটি ভার্সন নম্বর দেখানো উচিত। এর বদলে "command not found" দেখলে, ইনস্টলারের সম্ভবত আপনার টার্মিনাল পুনরায় চালু করা, অথবা Windows-এ, সিস্টেম রিস্টার্ট করা প্রয়োজন, নতুন কমান্ডগুলো চেনার আগে।</p>'),

      h(2, 'আপনার প্রথম স্ক্রিপ্ট চালানো', 'running-your-first-script'),
      p('<p>এক লাইনের <code>hello.js</code> নামে একটি ফাইল তৈরি করুন:</p>'),
      code('javascript', 'console.log("Hello from Node.js")'),
      p('<p>তারপর একই ফোল্ডার থেকে টার্মিনাল থেকে সেটি চালান:</p>'),
      code('bash', 'node hello.js'),
      p('<p>এটাই পুরো ওয়ার্কফ্লো: একটি ফাইলে JavaScript লিখুন, ফাইলটি <code>node</code>-কে দিন, আর এটি চলে — কোনো ব্রাউজার নেই, কোনো HTML পেজ নেই, আর কিছুই জড়িত নেই।</p>'),

      h(2, 'REPL', 'the-repl'),
      p('<p>কোনো ফাইলনেম ছাড়া <code>node</code> চালালে আপনি <b>REPL</b>-এ (Read-Eval-Print Loop) প্রবেশ করেন — একটি প্রম্পট যেখানে আপনি একবারে এক লাইন করে JavaScript টাইপ করতে পারেন আর ফলাফল সাথে সাথে দেখতে পারেন। কোনো ফাইল তৈরি না করেই দ্রুত ছোট একটি কোডের টুকরো টেস্ট করার জন্য এটি কাজে আসে।</p>'),
      code('bash', '$ node\n> 2 + 2\n4\n> "hello".toUpperCase()\n\'HELLO\'\n> .exit'),
      callout('tip', '<p>REPL ছাড়তে <code>.exit</code> টাইপ করুন, অথবা দুইবার <code>Ctrl+C</code> চাপুন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'modules-commonjs',
  sortOrder: 3,
  en: {
    title: 'The Module System (CommonJS)',
    metaTitle: 'Node.js Modules — CommonJS | Learn Computer Academy',
    metaDescription: 'Split Node.js code across multiple files with require() and module.exports, and understand what a module actually is.',
    blocks: [
      p('<p>A real program is never one giant file. Node.js lets you split code across separate files called <b>modules</b>, and pull pieces from one file into another with <code>require()</code>. This is CommonJS — Node\'s original, still very common module system.</p>'),

      h(2, 'Every File Is Its Own Module'),
      p('<p>In Node.js, each <code>.js</code> file is automatically wrapped as a separate module. Variables and functions declared in one file are <b>private to that file</b> by default — another file can\'t see them unless the first file deliberately shares them.</p>'),

      h(2, 'Exporting From a File'),
      p('<p>Attach anything you want another file to be able to use to <code>module.exports</code>:</p>'),
      code('javascript', '// math.js\nfunction add(a, b) {\n  return a + b\n}\n\nfunction multiply(a, b) {\n  return a * b\n}\n\nmodule.exports = { add, multiply }'),

      h(2, 'Importing With require()'),
      p('<p>Another file pulls that in with <code>require()</code>, giving it a path to the file (starting with <code>./</code> for "in this same folder"):</p>'),
      code('javascript', '// app.js\nconst { add, multiply } = require(\'./math\')\n\nconsole.log(add(2, 3))       // 5\nconsole.log(multiply(2, 3))  // 6'),
      p('<p>Note there\'s no <code>.js</code> extension in the <code>require()</code> call — Node adds it automatically when the path doesn\'t already have one.</p>'),

      img(
        'docs/img/nodejs/module-system-1',
        'Diagram showing two separate JavaScript files, one exporting functions with module.exports and another importing them with require, connected by an arrow',
        1024, 768,
        'One file shares functions through module.exports; another pulls them in with require().'
      ),

      h(2, 'Exporting a Single Thing'),
      p('<p>If a file only has one thing worth sharing, you can export it directly instead of wrapping it in an object:</p>'),
      code('javascript', '// greet.js\nmodule.exports = function greet(name) {\n  return `Hello, ${name}!`\n}\n\n// app.js\nconst greet = require(\'./greet\')\nconsole.log(greet(\'Priya\'))'),

      h(2, 'Built-in Modules'),
      p('<p>Node also ships with modules already built in — you <code>require()</code> them by name instead of a file path, no installation needed:</p>'),
      code('javascript', 'const path = require(\'path\')\nconsole.log(path.extname(\'photo.png\'))  // \'.png\''),
      p('<p>The next several lessons cover the most useful of these built-in modules one at a time.</p>'),

      callout('note', '<p>Requiring the same module twice doesn\'t run its code twice — Node caches the result after the first <code>require()</code> and reuses it. This matters once you start sharing state, like a database connection, across files.</p>', 'Modules are cached'),
    ],
  },
  bn: {
    title: 'মডিউল সিস্টেম (CommonJS)',
    metaTitle: 'Node.js মডিউল — CommonJS | Learn Computer Academy',
    metaDescription: 'require() আর module.exports দিয়ে একাধিক ফাইলে Node.js কোড ভাগ করুন, আর একটি মডিউল আসলে কী তা বুঝুন।',
    blocks: [
      p('<p>একটি বাস্তব প্রোগ্রাম কখনো একটি বিশাল ফাইল হয় না। Node.js আপনাকে <b>মডিউল</b> নামের আলাদা ফাইলে কোড ভাগ করতে দেয়, আর <code>require()</code> দিয়ে এক ফাইল থেকে অন্য ফাইলে অংশ টেনে আনতে দেয়। এটিই CommonJS — Node-এর মূল, এখনো অনেক প্রচলিত মডিউল সিস্টেম।</p>'),

      h(2, 'প্রতিটি ফাইল নিজেই একটি মডিউল', 'every-file-is-its-own-module'),
      p('<p>Node.js-এ, প্রতিটি <code>.js</code> ফাইল স্বয়ংক্রিয়ভাবে একটি আলাদা মডিউল হিসেবে wrap হয়। একটি ফাইলে ঘোষিত ভেরিয়েবল আর ফাংশন ডিফল্টভাবে <b>সেই ফাইলের জন্য ব্যক্তিগত</b> — অন্য একটি ফাইল সেগুলো দেখতে পায় না যতক্ষণ না প্রথম ফাইলটি ইচ্ছাকৃতভাবে সেগুলো শেয়ার করে।</p>'),

      h(2, 'একটি ফাইল থেকে এক্সপোর্ট করা', 'exporting-from-a-file'),
      p('<p>অন্য একটি ফাইল ব্যবহার করতে পারবে এমন যেকোনো কিছু <code>module.exports</code>-এর সাথে যুক্ত করুন:</p>'),
      code('javascript', '// math.js\nfunction add(a, b) {\n  return a + b\n}\n\nfunction multiply(a, b) {\n  return a * b\n}\n\nmodule.exports = { add, multiply }'),

      h(2, 'require() দিয়ে ইম্পোর্ট করা', 'importing-with-require'),
      p('<p>অন্য একটি ফাইল <code>require()</code> দিয়ে সেটি টেনে আনে, ফাইলের একটি পাথ দিয়ে (এই একই ফোল্ডারে "থাকার জন্য <code>./</code> দিয়ে শুরু):</p>'),
      code('javascript', '// app.js\nconst { add, multiply } = require(\'./math\')\n\nconsole.log(add(2, 3))       // 5\nconsole.log(multiply(2, 3))  // 6'),
      p('<p>লক্ষ্য করুন <code>require()</code> কলে কোনো <code>.js</code> এক্সটেনশন নেই — পাথে ইতিমধ্যে একটি না থাকলে Node স্বয়ংক্রিয়ভাবে সেটি যোগ করে।</p>'),

      img(
        'docs/img/nodejs/module-system-1',
        'ডায়াগ্রাম যেখানে দুটি আলাদা JavaScript ফাইল দেখানো হয়েছে, একটি module.exports দিয়ে ফাংশন এক্সপোর্ট করছে আর অন্যটি require দিয়ে সেগুলো ইম্পোর্ট করছে, একটি তীর দিয়ে সংযুক্ত',
        1024, 768,
        'একটি ফাইল module.exports-এর মাধ্যমে ফাংশন শেয়ার করে; অন্যটি require() দিয়ে সেগুলো টেনে আনে।'
      ),

      h(2, 'একটি একক জিনিস এক্সপোর্ট করা', 'exporting-a-single-thing'),
      p('<p>একটি ফাইলে যদি শেয়ার করার মতো শুধু একটি জিনিস থাকে, তাহলে সেটিকে একটি অবজেক্টে না মুড়িয়ে সরাসরি এক্সপোর্ট করতে পারেন:</p>'),
      code('javascript', '// greet.js\nmodule.exports = function greet(name) {\n  return `Hello, ${name}!`\n}\n\n// app.js\nconst greet = require(\'./greet\')\nconsole.log(greet(\'Priya\'))'),

      h(2, 'বিল্ট-ইন মডিউল', 'built-in-modules'),
      p('<p>Node-এ আগে থেকেই তৈরি মডিউলও থাকে — আপনি সেগুলো ফাইল পাথের বদলে নাম দিয়ে <code>require()</code> করেন, কোনো ইনস্টলেশনের প্রয়োজন নেই:</p>'),
      code('javascript', 'const path = require(\'path\')\nconsole.log(path.extname(\'photo.png\'))  // \'.png\''),
      p('<p>পরবর্তী বেশ কয়েকটি পাঠ এই বিল্ট-ইন মডিউলগুলোর মধ্যে সবচেয়ে কাজের কিছু একে একে কভার করে।</p>'),

      callout('note', '<p>একই মডিউল দুইবার require করলে এর কোড দুইবার চলে না — প্রথম <code>require()</code>-এর পর Node ফলাফল ক্যাশে রাখে আর সেটি পুনরায় ব্যবহার করে। এটি গুরুত্বপূর্ণ হয়ে ওঠে যখন আপনি ফাইলগুলোর মধ্যে অবস্থা, যেমন একটি ডেটাবেস সংযোগ, শেয়ার করা শুরু করেন।</p>', 'মডিউল ক্যাশ করা থাকে'),
    ],
  },
})

lessons.push({
  slug: 'es-modules',
  sortOrder: 4,
  en: {
    title: 'ES Modules in Node.js',
    metaTitle: 'ES Modules in Node.js | Learn Computer Academy',
    metaDescription: 'Use import and export instead of require() in Node.js — the modern module syntax and how to turn it on.',
    blocks: [
      p('<p>The previous lesson used <code>require()</code> and <code>module.exports</code> — CommonJS. Node also supports <b>ES Modules</b>, the <code>import</code>/<code>export</code> syntax you may already recognize from writing browser JavaScript. They do the same job with different syntax, and Node needs to be told which one a project is using.</p>'),

      h(2, 'Turning It On'),
      p('<p>By default, Node treats every <code>.js</code> file as CommonJS. To use <code>import</code>/<code>export</code> instead, add this to <code>package.json</code>:</p>'),
      code('json', '{\n  "type": "module"\n}'),
      p('<p>(<code>package.json</code> is covered properly in the next lesson — for now, it\'s enough to know this one field switches the whole project\'s module style.)</p>'),

      h(2, 'Exporting'),
      code('javascript', '// math.js\nexport function add(a, b) {\n  return a + b\n}\n\nexport function multiply(a, b) {\n  return a * b\n}'),

      h(2, 'Importing'),
      code('javascript', '// app.js\nimport { add, multiply } from \'./math.js\'\n\nconsole.log(add(2, 3))'),
      p('<p>One real difference from CommonJS: ES Module imports need the <b>full filename</b>, including <code>.js</code>. Leaving it off, out of CommonJS habit, is the single most common mistake when switching.</p>'),

      h(2, 'Default Exports'),
      p('<p>Just like in browser JavaScript, a file can have one <code>default</code> export alongside any number of named ones:</p>'),
      code('javascript', '// greet.js\nexport default function greet(name) {\n  return `Hello, ${name}!`\n}\n\n// app.js — no curly braces for a default import\nimport greet from \'./greet.js\'\nconsole.log(greet(\'Priya\'))'),

      h(2, 'Which One Should You Use?'),
      table(
        ['', 'CommonJS', 'ES Modules'],
        [
          ['Syntax', 'require() / module.exports', 'import / export'],
          ['File extension needed?', 'No', 'Yes, always'],
          ['Where it\'s common', 'Older Node projects, some npm packages', 'New projects, matches browser JS syntax'],
        ]
      ),
      callout('tip', '<p>For a brand-new project, ES Modules is the more consistent choice — it\'s the same syntax you already use in the browser. You\'ll still run into CommonJS constantly, though, since a huge number of existing npm packages are written with it. The rest of this course uses CommonJS, since it works with zero configuration and is what you\'ll see most often in tutorials and existing code.</p>', 'Which this course uses'),
    ],
  },
  bn: {
    title: 'Node.js-এ ES Modules',
    metaTitle: 'Node.js-এ ES Modules | Learn Computer Academy',
    metaDescription: 'Node.js-এ require()-এর বদলে import আর export ব্যবহার করুন — আধুনিক মডিউল সিনট্যাক্স আর এটি কীভাবে চালু করবেন।',
    blocks: [
      p('<p>আগের পাঠে <code>require()</code> আর <code>module.exports</code> ব্যবহার হয়েছে — CommonJS। Node <b>ES Modules</b>-ও সাপোর্ট করে, <code>import</code>/<code>export</code> সিনট্যাক্স যা আপনি হয়তো ব্রাউজার JavaScript লেখা থেকে ইতিমধ্যে চেনেন। এগুলো ভিন্ন সিনট্যাক্সে একই কাজ করে, আর একটি প্রোজেক্ট কোনটি ব্যবহার করছে তা Node-কে বলে দিতে হয়।</p>'),

      h(2, 'এটি চালু করা', 'turning-it-on'),
      p('<p>ডিফল্টভাবে, Node প্রতিটি <code>.js</code> ফাইলকে CommonJS হিসেবে গণ্য করে। এর বদলে <code>import</code>/<code>export</code> ব্যবহার করতে, <code>package.json</code>-এ এটি যোগ করুন:</p>'),
      code('json', '{\n  "type": "module"\n}'),
      p('<p>(<code>package.json</code> পরের পাঠে ভালোভাবে কভার করা হয়েছে — আপাতত, এটুকু জানাই যথেষ্ট যে এই একটি ফিল্ড পুরো প্রোজেক্টের মডিউল স্টাইল পাল্টে দেয়।)</p>'),

      h(2, 'এক্সপোর্ট করা', 'exporting'),
      code('javascript', '// math.js\nexport function add(a, b) {\n  return a + b\n}\n\nexport function multiply(a, b) {\n  return a * b\n}'),

      h(2, 'ইম্পোর্ট করা', 'importing'),
      code('javascript', '// app.js\nimport { add, multiply } from \'./math.js\'\n\nconsole.log(add(2, 3))'),
      p('<p>CommonJS থেকে একটি বাস্তব পার্থক্য: ES Module ইম্পোর্টে <code>.js</code>সহ <b>পুরো ফাইলনেম</b> লাগে। CommonJS-এর অভ্যাস থেকে এটি বাদ দেওয়া, স্যুইচ করার সময় সবচেয়ে সাধারণ ভুল।</p>'),

      h(2, 'ডিফল্ট এক্সপোর্ট', 'default-exports'),
      p('<p>ব্রাউজার JavaScript-এর মতোই, একটি ফাইলে যেকোনো সংখ্যক নামযুক্ত এক্সপোর্টের পাশাপাশি একটি <code>default</code> এক্সপোর্ট থাকতে পারে:</p>'),
      code('javascript', '// greet.js\nexport default function greet(name) {\n  return `Hello, ${name}!`\n}\n\n// app.js — ডিফল্ট ইম্পোর্টে কোনো curly braces নেই\nimport greet from \'./greet.js\'\nconsole.log(greet(\'Priya\'))'),

      h(2, 'কোনটি ব্যবহার করবেন?', 'which-one-should-you-use'),
      table(
        ['', 'CommonJS', 'ES Modules'],
        [
          ['সিনট্যাক্স', 'require() / module.exports', 'import / export'],
          ['ফাইল এক্সটেনশন লাগে?', 'না', 'হ্যাঁ, সবসময়'],
          ['কোথায় সাধারণ', 'পুরোনো Node প্রোজেক্ট, কিছু npm প্যাকেজ', 'নতুন প্রোজেক্ট, ব্রাউজার JS সিনট্যাক্সের সাথে মেলে'],
        ]
      ),
      callout('tip', '<p>একদম নতুন একটি প্রোজেক্টের জন্য, ES Modules বেশি ধারাবাহিক পছন্দ — এটি আপনি ব্রাউজারে ইতিমধ্যে ব্যবহার করা একই সিনট্যাক্স। তবুও আপনি CommonJS-এর মুখোমুখি হতেই থাকবেন, কারণ বিদ্যমান বিপুল সংখ্যক npm প্যাকেজ এটি দিয়ে লেখা। এই কোর্সের বাকি অংশ CommonJS ব্যবহার করে, কারণ এটি শূন্য কনফিগারেশনে কাজ করে আর টিউটোরিয়াল আর বিদ্যমান কোডে আপনি এটিই সবচেয়ে বেশি দেখবেন।</p>', 'এই কোর্স কোনটি ব্যবহার করে'),
    ],
  },
})

lessons.push({
  slug: 'npm-and-package-json',
  sortOrder: 5,
  en: {
    title: 'npm & package.json',
    metaTitle: 'npm and package.json | Learn Computer Academy',
    metaDescription: 'Install and manage third-party packages with npm, and understand what package.json and package-lock.json actually do.',
    blocks: [
      p('<p><b>npm</b> (Node Package Manager) installs code other people have written and published, so you don\'t have to write everything yourself. It comes bundled with Node.js — you already have it.</p>'),

      h(2, 'package.json'),
      p('<p>Every Node project has a <code>package.json</code> file at its root — a plain JSON file describing the project: its name, version, dependencies, and the scripts you can run. Create one with:</p>'),
      code('bash', 'npm init -y'),
      p('<p>The <code>-y</code> accepts all the defaults instead of asking questions one at a time. It produces something like:</p>'),
      code('json', '{\n  "name": "my-app",\n  "version": "1.0.0",\n  "main": "index.js",\n  "scripts": {\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  }\n}'),

      img(
        'docs/img/nodejs/npm-1',
        'Diagram showing package.json at the center connected to node_modules folder full of installed packages, with an arrow from npm install',
        1024, 768,
        'npm install reads package.json, downloads what it lists, and puts the code in node_modules.'
      ),

      h(2, 'Installing a Package'),
      code('bash', 'npm install express'),
      p('<p>This does three things: downloads the <code>express</code> package into a new <code>node_modules</code> folder, adds it to the <code>"dependencies"</code> list in <code>package.json</code>, and writes exact version numbers to <code>package-lock.json</code>.</p>'),

      h(2, 'Why the Lock File Matters'),
      p('<p><code>package.json</code> can list a dependency loosely, like "any version 4.x.x." <code>package-lock.json</code> records the <i>exact</i> version that was actually installed, for every package and everything those packages depend on. Committing this file means everyone on a team — and the server the app eventually runs on — installs the identical set of versions, instead of whatever happens to be newest on install day.</p>'),

      h(2, 'What Never Gets Committed'),
      p('<p><code>node_modules</code> can easily reach hundreds of megabytes and is never committed to version control — anyone can rebuild it from <code>package.json</code> and <code>package-lock.json</code> with one command:</p>'),
      code('bash', 'npm install'),
      p('<p>Run with no package name, <code>npm install</code> reads <code>package.json</code> and installs everything listed. This is the command a teammate runs after cloning the project, and it\'s why the lock file is committed but the folder it fills isn\'t.</p>'),

      h(2, 'npm Scripts'),
      p('<p>The <code>"scripts"</code> section in <code>package.json</code> gives shell commands short names:</p>'),
      code('json', '{\n  "scripts": {\n    "start": "node index.js",\n    "dev": "node --watch index.js"\n  }\n}'),
      code('bash', 'npm run dev'),
      callout('note', '<p><code>npm start</code> and <code>npm test</code> can drop the word "run" — those two are special-cased. Every other script needs it: <code>npm run &lt;name&gt;</code>.</p>'),
    ],
  },
  bn: {
    title: 'npm আর package.json',
    metaTitle: 'npm আর package.json | Learn Computer Academy',
    metaDescription: 'npm দিয়ে থার্ড-পার্টি প্যাকেজ ইনস্টল আর পরিচালনা করুন, আর package.json আর package-lock.json আসলে কী করে তা বুঝুন।',
    blocks: [
      p('<p><b>npm</b> (Node Package Manager) অন্যরা লিখে প্রকাশ করা কোড ইনস্টল করে, যাতে আপনাকে সবকিছু নিজে লিখতে না হয়। এটি Node.js-এর সাথেই বান্ডল হয়ে আসে — আপনার কাছে এটি ইতিমধ্যেই আছে।</p>'),

      h(2, 'package.json'),
      p('<p>প্রতিটি Node প্রোজেক্টের রুটে একটি <code>package.json</code> ফাইল থাকে — একটি সাধারণ JSON ফাইল যা প্রোজেক্ট বর্ণনা করে: এর নাম, ভার্সন, ডিপেন্ডেন্সি, আর আপনি যে স্ক্রিপ্টগুলো চালাতে পারেন। এটি তৈরি করুন:</p>'),
      code('bash', 'npm init -y'),
      p('<p><code>-y</code> একে একে প্রশ্ন জিজ্ঞাসা করার বদলে সব ডিফল্ট গ্রহণ করে। এটি এরকম কিছু তৈরি করে:</p>'),
      code('json', '{\n  "name": "my-app",\n  "version": "1.0.0",\n  "main": "index.js",\n  "scripts": {\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  }\n}'),

      img(
        'docs/img/nodejs/npm-1',
        'ডায়াগ্রাম যেখানে package.json কেন্দ্রে দেখানো হয়েছে, ইনস্টল করা প্যাকেজে ভরা node_modules ফোল্ডারের সাথে সংযুক্ত, npm install থেকে একটি তীর সহ',
        1024, 768,
        'npm install package.json পড়ে, তাতে যা তালিকাভুক্ত তা ডাউনলোড করে, আর কোড node_modules-এ রাখে।'
      ),

      h(2, 'একটি প্যাকেজ ইনস্টল করা', 'installing-a-package'),
      code('bash', 'npm install express'),
      p('<p>এটি তিনটি কাজ করে: নতুন একটি <code>node_modules</code> ফোল্ডারে <code>express</code> প্যাকেজ ডাউনলোড করে, <code>package.json</code>-এর <code>"dependencies"</code> তালিকায় এটি যোগ করে, আর <code>package-lock.json</code>-এ সঠিক ভার্সন নম্বর লেখে।</p>'),

      h(2, 'লক ফাইল কেন গুরুত্বপূর্ণ', 'why-the-lock-file-matters'),
      p('<p><code>package.json</code> একটি ডিপেন্ডেন্সিকে ঢিলেভাবে তালিকাভুক্ত করতে পারে, যেমন "যেকোনো 4.x.x ভার্সন।" <code>package-lock.json</code> প্রতিটি প্যাকেজের জন্য, আর সেই প্যাকেজগুলো যার উপর নির্ভর করে তার সবকিছুর জন্য, আসলে যে <i>সঠিক</i> ভার্সন ইনস্টল হয়েছিল তা রেকর্ড করে। এই ফাইলটি কমিট করার অর্থ একটি টিমের সবাই — আর অ্যাপটি শেষে যে সার্ভারে চলবে — ইনস্টল করার দিন যা নতুন থাকে তার বদলে একই সেট ভার্সন ইনস্টল করে।</p>'),

      h(2, 'যা কখনো কমিট হয় না', 'what-never-gets-committed'),
      p('<p><code>node_modules</code> সহজেই কয়েকশো মেগাবাইট হয়ে যেতে পারে আর এটি কখনো ভার্সন কন্ট্রোলে কমিট হয় না — যে কেউ এটি <code>package.json</code> আর <code>package-lock.json</code> থেকে একটি কমান্ড দিয়ে পুনর্নির্মাণ করতে পারে:</p>'),
      code('bash', 'npm install'),
      p('<p>কোনো প্যাকেজ নাম ছাড়া চালালে, <code>npm install</code> <code>package.json</code> পড়ে আর তালিকাভুক্ত সবকিছু ইনস্টল করে। এটিই সেই কমান্ড যা একজন টিমমেট প্রোজেক্ট ক্লোন করার পর চালায়, আর এই কারণেই লক ফাইল কমিট হয় কিন্তু যে ফোল্ডারটি এটি ভরে দেয় তা হয় না।</p>'),

      h(2, 'npm স্ক্রিপ্ট', 'npm-scripts'),
      p('<p><code>package.json</code>-এর <code>"scripts"</code> অংশ শেল কমান্ডকে ছোট নাম দেয়:</p>'),
      code('json', '{\n  "scripts": {\n    "start": "node index.js",\n    "dev": "node --watch index.js"\n  }\n}'),
      code('bash', 'npm run dev'),
      callout('note', '<p><code>npm start</code> আর <code>npm test</code> "run" শব্দটি বাদ দিতে পারে — এই দুটি বিশেষভাবে ছাড় পায়। বাকি প্রতিটি স্ক্রিপ্টের জন্য এটি লাগে: <code>npm run &lt;name&gt;</code>।</p>'),
    ],
  },
})

lessons.push({
  slug: 'core-modules-tour',
  sortOrder: 6,
  en: {
    title: 'A Tour of Core Modules',
    metaTitle: 'Node.js Core Modules Tour | Learn Computer Academy',
    metaDescription: 'A quick map of the modules Node.js ships with built in, before covering the most important ones in depth.',
    blocks: [
      p('<p>Node.js ships with dozens of built-in modules — no <code>npm install</code> needed, just <code>require()</code> them by name. This lesson is a map of the ones worth knowing exist before the next few lessons cover the most-used ones properly.</p>'),

      table(
        ['Module', 'What it\'s for'],
        [
          ['<code>fs</code>', 'Reading and writing files'],
          ['<code>path</code>', 'Building and parsing file paths safely across operating systems'],
          ['<code>os</code>', 'Information about the computer Node is running on'],
          ['<code>http</code>', 'Creating web servers and making HTTP requests'],
          ['<code>events</code>', 'The EventEmitter class most of Node\'s async APIs are built on'],
          ['<code>crypto</code>', 'Hashing, encryption, and generating random values'],
          ['<code>url</code>', 'Parsing and building URLs'],
          ['<code>util</code>', 'Small helper functions used throughout Node itself'],
        ]
      ),

      h(2, 'Checking What\'s Available'),
      p('<p>Every built-in module is documented on <a href="https://nodejs.org/api/" target="_blank" rel="noopener noreferrer">nodejs.org/api</a> — that page is the authoritative reference for exactly what each one can do; nothing here tries to replace it.</p>'),

      callout('tip', '<p>Newer Node versions prefix built-in modules with <code>node:</code>, e.g. <code>require(\'node:fs\')</code>. It\'s optional but makes it instantly clear, when reading someone else\'s code, that a name refers to a built-in module rather than an installed package.</p>', 'The node: prefix'),

      p('<p>The next four lessons work through <code>fs</code>, <code>path</code>/<code>os</code>, and then <code>http</code> — the module that turns everything so far into an actual running server.</p>'),
    ],
  },
  bn: {
    title: 'কোর মডিউলের একটি ট্যুর',
    metaTitle: 'Node.js কোর মডিউল ট্যুর | Learn Computer Academy',
    metaDescription: 'Node.js বিল্ট-ইন যেসব মডিউল নিয়ে আসে তার একটি দ্রুত মানচিত্র, পরবর্তী পাঠগুলোতে সবচেয়ে গুরুত্বপূর্ণগুলো বিস্তারিত কভার করার আগে।',
    blocks: [
      p('<p>Node.js ডজনখানেক বিল্ট-ইন মডিউল নিয়ে আসে — কোনো <code>npm install</code>-এর প্রয়োজন নেই, শুধু নাম দিয়ে <code>require()</code> করুন। এই পাঠটি এমন মডিউলগুলোর একটি মানচিত্র যা সম্পর্কে জানা উচিত, পরের কয়েকটি পাঠ সবচেয়ে বেশি ব্যবহৃতগুলো ভালোভাবে কভার করার আগে।</p>'),

      table(
        ['মডিউল', 'কীসের জন্য'],
        [
          ['<code>fs</code>', 'ফাইল পড়া আর লেখা'],
          ['<code>path</code>', 'বিভিন্ন অপারেটিং সিস্টেমে নিরাপদভাবে ফাইল পাথ তৈরি আর পার্স করা'],
          ['<code>os</code>', 'যে কম্পিউটারে Node চলছে তার তথ্য'],
          ['<code>http</code>', 'ওয়েব সার্ভার তৈরি করা আর HTTP রিকোয়েস্ট পাঠানো'],
          ['<code>events</code>', 'EventEmitter ক্লাস যার উপর Node-এর বেশিরভাগ async API তৈরি'],
          ['<code>crypto</code>', 'হ্যাশিং, এনক্রিপশন, আর র‍্যান্ডম মান তৈরি করা'],
          ['<code>url</code>', 'URL পার্স আর তৈরি করা'],
          ['<code>util</code>', 'Node নিজের মধ্যেই ব্যবহৃত ছোট হেল্পার ফাংশন'],
        ]
      ),

      h(2, 'কী পাওয়া যায় তা যাচাই করা', 'checking-whats-available'),
      p('<p>প্রতিটি বিল্ট-ইন মডিউল <a href="https://nodejs.org/api/" target="_blank" rel="noopener noreferrer">nodejs.org/api</a>-তে ডকুমেন্টেড — সেই পেজটি প্রতিটি ঠিক কী করতে পারে তার প্রামাণিক রেফারেন্স; এখানে কিছুই সেটি প্রতিস্থাপন করার চেষ্টা করে না।</p>'),

      callout('tip', '<p>নতুন Node ভার্সনগুলো বিল্ট-ইন মডিউলের আগে <code>node:</code> প্রিফিক্স যোগ করে, যেমন <code>require(\'node:fs\')</code>। এটি ঐচ্ছিক কিন্তু অন্য কারো কোড পড়ার সময় সাথে সাথে স্পষ্ট করে দেয় যে একটি নাম একটি ইনস্টল করা প্যাকেজের বদলে একটি বিল্ট-ইন মডিউলকে নির্দেশ করছে।</p>', 'node: প্রিফিক্স'),

      p('<p>পরের চারটি পাঠ <code>fs</code>, <code>path</code>/<code>os</code>, আর তারপর <code>http</code> নিয়ে কাজ করে — যে মডিউলটি এখন পর্যন্ত সবকিছুকে একটি বাস্তব চলমান সার্ভারে পরিণত করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'file-system',
  sortOrder: 7,
  en: {
    title: 'The File System Module',
    metaTitle: 'Node.js File System (fs) Module | Learn Computer Academy',
    metaDescription: 'Read, write, and check files with the built-in fs module, and understand the difference between its sync, callback, and promise versions.',
    blocks: [
      p('<p>The <code>fs</code> (file system) module reads and writes files — something browser JavaScript is never allowed to do. It\'s one of the clearest examples of what makes Node.js different from JavaScript running in a page.</p>'),

      h(2, 'Reading a File'),
      code('javascript', 'const fs = require(\'fs\')\n\nconst data = fs.readFileSync(\'notes.txt\', \'utf8\')\nconsole.log(data)'),
      p('<p>The second argument, <code>\'utf8\'</code>, tells Node to return text instead of raw bytes. Leave it off and you get a <code>Buffer</code> — covered later in this course — instead of a readable string.</p>'),

      h(2, 'Writing a File'),
      code('javascript', 'fs.writeFileSync(\'output.txt\', \'Hello, file!\')'),
      p('<p><code>writeFileSync</code> creates the file if it doesn\'t exist, and <b>overwrites it completely</b> if it does. To add to a file instead of replacing it, use <code>fs.appendFileSync()</code>.</p>'),

      h(2, 'Sync vs. Async'),
      p('<p>Every method ending in <code>Sync</code> blocks the program — nothing else runs until the file operation finishes. For a quick script that\'s fine. For a running server handling many requests at once, blocking on disk access stalls every other request too.</p><p>The non-blocking version takes a callback function instead of returning a value directly:</p>'),
      code('javascript', 'fs.readFile(\'notes.txt\', \'utf8\', (err, data) => {\n  if (err) {\n    console.error(\'Failed to read file:\', err)\n    return\n  }\n  console.log(data)\n})'),
      p('<p>Node keeps running other code while the file is being read, and calls the function you passed in once it\'s done. This callback pattern — <code>(err, result)</code> as the first two parameters — shows up throughout Node\'s built-in APIs.</p>'),

      h(2, 'The Promise Version'),
      p('<p><code>fs/promises</code> gives the same non-blocking behavior with <code>async</code>/<code>await</code> instead of a callback:</p>'),
      code('javascript', 'const fs = require(\'fs/promises\')\n\nasync function readNotes() {\n  const data = await fs.readFile(\'notes.txt\', \'utf8\')\n  console.log(data)\n}\n\nreadNotes()'),

      table(
        ['Style', 'How you call it', 'Blocks the program?'],
        [
          ['<code>fs.readFileSync()</code>', 'Returns the value directly', 'Yes'],
          ['<code>fs.readFile()</code>', 'Takes a callback', 'No'],
          ['<code>fs/promises</code>\'s <code>readFile()</code>', '<code>await</code>able', 'No'],
        ]
      ),
      callout('tip', '<p>Reach for the promise-based version by default in real code — it\'s non-blocking and reads cleanly with <code>async</code>/<code>await</code>. Sync methods are fine for one-off scripts and startup code that genuinely needs to finish before anything else runs.</p>'),

      h(2, 'Checking If a File Exists'),
      code('javascript', 'if (fs.existsSync(\'config.json\')) {\n  console.log(\'Found it\')\n}'),
    ],
  },
  bn: {
    title: 'ফাইল সিস্টেম মডিউল',
    metaTitle: 'Node.js ফাইল সিস্টেম (fs) মডিউল | Learn Computer Academy',
    metaDescription: 'বিল্ট-ইন fs মডিউল দিয়ে ফাইল পড়ুন, লিখুন, আর চেক করুন, আর এর sync, callback, আর promise ভার্সনের মধ্যে পার্থক্য বুঝুন।',
    blocks: [
      p('<p><code>fs</code> (file system) মডিউল ফাইল পড়ে আর লেখে — এমন কিছু যা ব্রাউজার JavaScript-কে কখনো করতে দেওয়া হয় না। এটি সবচেয়ে স্পষ্ট উদাহরণগুলোর একটি যা Node.js-কে একটি পেজে চলা JavaScript থেকে আলাদা করে।</p>'),

      h(2, 'একটি ফাইল পড়া', 'reading-a-file'),
      code('javascript', 'const fs = require(\'fs\')\n\nconst data = fs.readFileSync(\'notes.txt\', \'utf8\')\nconsole.log(data)'),
      p('<p>দ্বিতীয় আর্গুমেন্ট, <code>\'utf8\'</code>, Node-কে কাঁচা বাইটের বদলে টেক্সট ফেরত দিতে বলে। এটি বাদ দিলে আপনি পড়ার যোগ্য একটি স্ট্রিং-এর বদলে একটি <code>Buffer</code> পাবেন — এই কোর্সে পরে কভার করা হয়েছে।</p>'),

      h(2, 'একটি ফাইলে লেখা', 'writing-a-file'),
      code('javascript', 'fs.writeFileSync(\'output.txt\', \'Hello, file!\')'),
      p('<p><code>writeFileSync</code> ফাইলটি না থাকলে তৈরি করে, আর থাকলে সেটিকে <b>সম্পূর্ণভাবে ওভাররাইট</b> করে। প্রতিস্থাপনের বদলে একটি ফাইলে যোগ করতে, <code>fs.appendFileSync()</code> ব্যবহার করুন।</p>'),

      h(2, 'Sync বনাম Async', 'sync-vs-async'),
      p('<p><code>Sync</code>-এ শেষ হওয়া প্রতিটি মেথড প্রোগ্রামটিকে ব্লক করে — ফাইল অপারেশন শেষ না হওয়া পর্যন্ত আর কিছু চলে না। একটি দ্রুত স্ক্রিপ্টের জন্য এটি ঠিক আছে। একসাথে অনেক রিকোয়েস্ট হ্যান্ডেল করা একটি চলমান সার্ভারের জন্য, ডিস্ক অ্যাক্সেসে ব্লক হওয়া অন্য প্রতিটি রিকোয়েস্টকেও থামিয়ে দেয়।</p><p>নন-ব্লকিং ভার্সনটি সরাসরি একটি মান ফেরত দেওয়ার বদলে একটি callback ফাংশন নেয়:</p>'),
      code('javascript', 'fs.readFile(\'notes.txt\', \'utf8\', (err, data) => {\n  if (err) {\n    console.error(\'Failed to read file:\', err)\n    return\n  }\n  console.log(data)\n})'),
      p('<p>ফাইলটি পড়া হওয়ার সময় Node অন্য কোড চালাতে থাকে, আর এটি শেষ হলে আপনার পাস করা ফাংশনটি কল করে। এই callback প্যাটার্ন — প্রথম দুই প্যারামিটার হিসেবে <code>(err, result)</code> — Node-এর বিল্ট-ইন API জুড়ে দেখা যায়।</p>'),

      h(2, 'Promise ভার্সন', 'the-promise-version'),
      p('<p><code>fs/promises</code> একটি callback-এর বদলে <code>async</code>/<code>await</code> দিয়ে একই নন-ব্লকিং আচরণ দেয়:</p>'),
      code('javascript', 'const fs = require(\'fs/promises\')\n\nasync function readNotes() {\n  const data = await fs.readFile(\'notes.txt\', \'utf8\')\n  console.log(data)\n}\n\nreadNotes()'),

      table(
        ['স্টাইল', 'কীভাবে কল করবেন', 'প্রোগ্রাম ব্লক করে?'],
        [
          ['<code>fs.readFileSync()</code>', 'সরাসরি মান ফেরত দেয়', 'হ্যাঁ'],
          ['<code>fs.readFile()</code>', 'একটি callback নেয়', 'না'],
          ['<code>fs/promises</code>-এর <code>readFile()</code>', '<code>await</code> করা যায়', 'না'],
        ]
      ),
      callout('tip', '<p>বাস্তব কোডে ডিফল্টভাবে promise-ভিত্তিক ভার্সনের দিকে যান — এটি নন-ব্লকিং আর <code>async</code>/<code>await</code> দিয়ে পরিষ্কারভাবে পড়া যায়। Sync মেথড এক-বারের স্ক্রিপ্ট আর স্টার্টআপ কোডের জন্য ঠিক আছে যেগুলোর সত্যিই অন্য কিছু চলার আগে শেষ হওয়া প্রয়োজন।</p>'),

      h(2, 'একটি ফাইল আছে কিনা যাচাই করা', 'checking-if-a-file-exists'),
      code('javascript', 'if (fs.existsSync(\'config.json\')) {\n  console.log(\'Found it\')\n}'),
    ],
  },
})

lessons.push({
  slug: 'path-and-os',
  sortOrder: 8,
  en: {
    title: 'Path & OS Modules',
    metaTitle: 'Node.js path and os Modules | Learn Computer Academy',
    metaDescription: 'Build file paths safely across operating systems with the path module, and read system information with the os module.',
    blocks: [
      p('<p>File paths look different on different operating systems — Windows uses backslashes (<code>C:\\Users\\name</code>), Mac and Linux use forward slashes (<code>/home/name</code>). The <code>path</code> module builds and reads paths in a way that works correctly regardless of which one Node happens to be running on.</p>'),

      h(2, 'Joining Paths'),
      p('<p>Never build a path by joining strings with <code>+</code> — use <code>path.join()</code>:</p>'),
      code('javascript', 'const path = require(\'path\')\n\nconst filePath = path.join(\'data\', \'users\', \'list.json\')\nconsole.log(filePath)  // \'data/users/list.json\' on Mac/Linux, \'data\\\\users\\\\list.json\' on Windows'),
      p('<p><code>path.join()</code> automatically uses the right separator for whichever system the code is running on — code written this way behaves the same on every operating system.</p>'),

      h(2, 'Pulling a Path Apart'),
      code('javascript', 'const filePath = \'/projects/site/photo.png\'\n\npath.basename(filePath)   // \'photo.png\'\npath.extname(filePath)    // \'.png\'\npath.dirname(filePath)    // \'/projects/site\''),

      h(2, 'Absolute vs. Relative Paths'),
      p('<p>A relative path like <code>\'data.json\'</code> is resolved against the current working directory — wherever the terminal happened to be when the script started, which isn\'t always where the script file itself lives. <code>__dirname</code> always points to the folder containing the current file, so combining it with <code>path.join()</code> gives a path that works no matter where the script is run from:</p>'),
      code('javascript', 'const configPath = path.join(__dirname, \'config.json\')'),

      h(2, 'The os Module'),
      p('<p><code>os</code> reports information about the machine Node is running on:</p>'),
      code('javascript', 'const os = require(\'os\')\n\nconsole.log(os.platform())    // \'win32\', \'darwin\', \'linux\'\nconsole.log(os.cpus().length) // number of CPU cores\nconsole.log(os.freemem())     // free memory, in bytes'),
      callout('note', '<p>You won\'t reach for <code>os</code> often in everyday app code — it\'s mostly useful in command-line tools and scripts that need to behave differently depending on the machine they\'re running on.</p>'),
    ],
  },
  bn: {
    title: 'Path আর OS মডিউল',
    metaTitle: 'Node.js path আর os মডিউল | Learn Computer Academy',
    metaDescription: 'path মডিউল দিয়ে বিভিন্ন অপারেটিং সিস্টেমে নিরাপদভাবে ফাইল পাথ তৈরি করুন, আর os মডিউল দিয়ে সিস্টেম তথ্য পড়ুন।',
    blocks: [
      p('<p>বিভিন্ন অপারেটিং সিস্টেমে ফাইল পাথ দেখতে ভিন্ন — Windows ব্যাকস্ল্যাশ ব্যবহার করে (<code>C:\\Users\\name</code>), Mac আর Linux ফরওয়ার্ড স্ল্যাশ ব্যবহার করে (<code>/home/name</code>)। <code>path</code> মডিউল এমনভাবে পাথ তৈরি আর পড়ে যা Node আসলে কোন সিস্টেমে চলছে তা নির্বিশেষে সঠিকভাবে কাজ করে।</p>'),

      h(2, 'পাথ জোড়া দেওয়া', 'joining-paths'),
      p('<p><code>+</code> দিয়ে স্ট্রিং জোড়া দিয়ে কখনো একটি পাথ তৈরি করবেন না — <code>path.join()</code> ব্যবহার করুন:</p>'),
      code('javascript', 'const path = require(\'path\')\n\nconst filePath = path.join(\'data\', \'users\', \'list.json\')\nconsole.log(filePath)  // Mac/Linux-এ \'data/users/list.json\', Windows-এ \'data\\\\users\\\\list.json\''),
      p('<p><code>path.join()</code> স্বয়ংক্রিয়ভাবে যে সিস্টেমেই কোডটি চলছে তার জন্য সঠিক সেপারেটর ব্যবহার করে — এভাবে লেখা কোড প্রতিটি অপারেটিং সিস্টেমে একইভাবে আচরণ করে।</p>'),

      h(2, 'একটি পাথ আলাদা করা', 'pulling-a-path-apart'),
      code('javascript', 'const filePath = \'/projects/site/photo.png\'\n\npath.basename(filePath)   // \'photo.png\'\npath.extname(filePath)    // \'.png\'\npath.dirname(filePath)    // \'/projects/site\''),

      h(2, 'অ্যাবসোলিউট বনাম রিলেটিভ পাথ', 'absolute-vs-relative-paths'),
      p('<p><code>\'data.json\'</code>-এর মতো একটি রিলেটিভ পাথ বর্তমান working directory-এর বিপরীতে রিজলভ হয় — স্ক্রিপ্ট শুরু হওয়ার সময় টার্মিনালটি যেখানে ছিল, যা সবসময় স্ক্রিপ্ট ফাইলটি নিজে যেখানে থাকে তা নয়। <code>__dirname</code> সবসময় বর্তমান ফাইল ধারণকারী ফোল্ডারের দিকে নির্দেশ করে, তাই এটিকে <code>path.join()</code>-এর সাথে মেলালে এমন একটি পাথ পাওয়া যায় যা স্ক্রিপ্টটি যেখান থেকেই চালানো হোক না কেন কাজ করে:</p>'),
      code('javascript', 'const configPath = path.join(__dirname, \'config.json\')'),

      h(2, 'os মডিউল', 'the-os-module'),
      p('<p><code>os</code> Node যে মেশিনে চলছে সে সম্পর্কে তথ্য জানায়:</p>'),
      code('javascript', 'const os = require(\'os\')\n\nconsole.log(os.platform())    // \'win32\', \'darwin\', \'linux\'\nconsole.log(os.cpus().length) // CPU কোরের সংখ্যা\nconsole.log(os.freemem())     // ফ্রি মেমরি, বাইটে'),
      callout('note', '<p>প্রতিদিনের অ্যাপ কোডে আপনি খুব একটা <code>os</code>-এর দিকে যাবেন না — এটি বেশিরভাগ কমান্ড-লাইন টুল আর স্ক্রিপ্টে কাজে আসে যেগুলোর কোন মেশিনে চলছে তার উপর ভিত্তি করে ভিন্নভাবে আচরণ করা প্রয়োজন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'http-server',
  sortOrder: 9,
  en: {
    title: 'Creating a Web Server',
    metaTitle: 'Creating a Web Server with Node.js | Learn Computer Academy',
    metaDescription: 'Build a real web server from scratch with the built-in http module, and understand the request/response cycle that every web framework is built on.',
    blocks: [
      p('<p>Every website you\'ve ever visited works the same basic way: your browser <b>sends a request</b> to a server, and the server <b>sends back a response</b>. The <code>http</code> module lets Node.js play the server side of that exchange, with no external packages needed.</p>'),

      img(
        'docs/img/nodejs/http-server-1',
        'Diagram showing a browser sending an HTTP request to a Node.js server, and the server sending back an HTTP response with HTML content',
        1344, 752,
        'A browser sends a request; a Node.js server decides what response to send back.'
      ),

      h(2, 'The Simplest Server'),
      code('javascript', 'const http = require(\'http\')\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { \'Content-Type\': \'text/plain\' })\n  res.end(\'Hello from Node!\')\n})\n\nserver.listen(3000, () => {\n  console.log(\'Server running at http://localhost:3000\')\n})'),
      p('<p>Run this file with <code>node</code>, then open <code>http://localhost:3000</code> in a browser. Unlike the scripts you\'ve run so far, this one doesn\'t finish — <code>server.listen()</code> keeps the program alive, waiting for requests, until you stop it with <code>Ctrl+C</code>.</p>'),

      h(2, 'The Callback: req and res'),
      p('<p>The function passed to <code>createServer()</code> runs once for every incoming request, and receives two objects:</p>'),
      table(
        ['Object', 'What it holds'],
        [
          ['<code>req</code> (request)', 'What the browser asked for — <code>req.url</code>, <code>req.method</code>, <code>req.headers</code>'],
          ['<code>res</code> (response)', 'What you send back — <code>res.writeHead()</code>, <code>res.write()</code>, <code>res.end()</code>'],
        ]
      ),
      p('<p><code>res.end()</code> is required — the browser keeps waiting until it\'s called, and the connection never finishes without it.</p>'),

      h(2, 'Responding Differently by URL'),
      code('javascript', 'const server = http.createServer((req, res) => {\n  if (req.url === \'/\') {\n    res.writeHead(200, { \'Content-Type\': \'text/plain\' })\n    res.end(\'Welcome home\')\n  } else if (req.url === \'/about\') {\n    res.writeHead(200, { \'Content-Type\': \'text/plain\' })\n    res.end(\'About this site\')\n  } else {\n    res.writeHead(404, { \'Content-Type\': \'text/plain\' })\n    res.end(\'Not found\')\n  }\n})'),
      p('<p>This <code>if</code>/<code>else</code> chain checking <code>req.url</code> is, at its core, exactly what a web framework\'s "router" does — just with a much friendlier syntax and a lot more built in. You\'ll see that properly in the Express lessons later in this course.</p>'),

      h(2, 'Sending HTML Instead of Plain Text'),
      code('javascript', 'res.writeHead(200, { \'Content-Type\': \'text/html\' })\nres.end(\'<h1>Hello!</h1><p>This is a real webpage.</p>\')'),
      callout('note', '<p>The <code>Content-Type</code> header tells the browser how to interpret what follows. Set it to <code>text/html</code> and the browser renders the tags; leave it as <code>text/plain</code> and it shows the raw <code>&lt;h1&gt;</code> text instead of rendering it.</p>'),

      h(2, 'Status Codes'),
      p('<p>The first argument to <code>writeHead()</code> is the <b>status code</b> — a number that tells the browser how the request went. <code>200</code> means success; <code>404</code> means "not found"; <code>500</code> means the server hit an error. Getting these right matters — a page that failed but returns <code>200</code> looks successful to search engines and monitoring tools even when it isn\'t.</p>'),
    ],
  },
  bn: {
    title: 'একটি ওয়েব সার্ভার তৈরি করা',
    metaTitle: 'Node.js দিয়ে একটি ওয়েব সার্ভার তৈরি করা | Learn Computer Academy',
    metaDescription: 'বিল্ট-ইন http মডিউল দিয়ে শূন্য থেকে একটি বাস্তব ওয়েব সার্ভার তৈরি করুন, আর request/response সাইকেল বুঝুন যার উপর প্রতিটি ওয়েব ফ্রেমওয়ার্ক তৈরি।',
    blocks: [
      p('<p>আপনি যে কোনো ওয়েবসাইটে গিয়েছেন তা একই মূল উপায়ে কাজ করে: আপনার ব্রাউজার একটি সার্ভারে <b>একটি রিকোয়েস্ট পাঠায়</b>, আর সার্ভার <b>একটি রেসপন্স ফেরত পাঠায়</b>। <code>http</code> মডিউল Node.js-কে সেই আদান-প্রদানের সার্ভার পাশে খেলতে দেয়, কোনো এক্সটার্নাল প্যাকেজের প্রয়োজন ছাড়াই।</p>'),

      img(
        'docs/img/nodejs/http-server-1',
        'ডায়াগ্রাম যেখানে একটি ব্রাউজার একটি Node.js সার্ভারে একটি HTTP রিকোয়েস্ট পাঠাচ্ছে, আর সার্ভারটি HTML কন্টেন্টসহ একটি HTTP রেসপন্স ফেরত পাঠাচ্ছে',
        1344, 752,
        'একটি ব্রাউজার একটি রিকোয়েস্ট পাঠায়; একটি Node.js সার্ভার ঠিক করে কোন রেসপন্স ফেরত পাঠাবে।'
      ),

      h(2, 'সবচেয়ে সহজ সার্ভার', 'the-simplest-server'),
      code('javascript', 'const http = require(\'http\')\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { \'Content-Type\': \'text/plain\' })\n  res.end(\'Hello from Node!\')\n})\n\nserver.listen(3000, () => {\n  console.log(\'Server running at http://localhost:3000\')\n})'),
      p('<p>এই ফাইলটি <code>node</code> দিয়ে চালান, তারপর একটি ব্রাউজারে <code>http://localhost:3000</code> খুলুন। আপনি এখন পর্যন্ত চালানো স্ক্রিপ্টগুলোর মতো নয়, এটি শেষ হয় না — <code>server.listen()</code> প্রোগ্রামটিকে জীবিত রাখে, রিকোয়েস্টের জন্য অপেক্ষা করে, যতক্ষণ না আপনি <code>Ctrl+C</code> দিয়ে এটি থামান।</p>'),

      h(2, 'Callback: req আর res', 'the-callback-req-and-res'),
      p('<p><code>createServer()</code>-এ পাস করা ফাংশনটি প্রতিটি আগত রিকোয়েস্টের জন্য একবার চলে, আর দুটি অবজেক্ট পায়:</p>'),
      table(
        ['অবজেক্ট', 'এতে কী থাকে'],
        [
          ['<code>req</code> (request)', 'ব্রাউজার কী চেয়েছে — <code>req.url</code>, <code>req.method</code>, <code>req.headers</code>'],
          ['<code>res</code> (response)', 'আপনি কী ফেরত পাঠাচ্ছেন — <code>res.writeHead()</code>, <code>res.write()</code>, <code>res.end()</code>'],
        ]
      ),
      p('<p><code>res.end()</code> আবশ্যক — এটি কল না হওয়া পর্যন্ত ব্রাউজার অপেক্ষা করতে থাকে, আর এটি ছাড়া সংযোগ কখনো শেষ হয় না।</p>'),

      h(2, 'URL অনুযায়ী ভিন্ন রেসপন্স দেওয়া', 'responding-differently-by-url'),
      code('javascript', 'const server = http.createServer((req, res) => {\n  if (req.url === \'/\') {\n    res.writeHead(200, { \'Content-Type\': \'text/plain\' })\n    res.end(\'Welcome home\')\n  } else if (req.url === \'/about\') {\n    res.writeHead(200, { \'Content-Type\': \'text/plain\' })\n    res.end(\'About this site\')\n  } else {\n    res.writeHead(404, { \'Content-Type\': \'text/plain\' })\n    res.end(\'Not found\')\n  }\n})'),
      p('<p><code>req.url</code> চেক করা এই <code>if</code>/<code>else</code> চেইনটি মূলত ঠিক তাই যা একটি ওয়েব ফ্রেমওয়ার্কের "রাউটার" করে — শুধু অনেক বেশি বন্ধুত্বপূর্ণ সিনট্যাক্স আর অনেক বেশি বিল্ট-ইন সুবিধা সহ। এই কোর্সের পরে Express পাঠগুলোতে আপনি এটি ভালোভাবে দেখবেন।</p>'),

      h(2, 'প্লেইন টেক্সটের বদলে HTML পাঠানো', 'sending-html-instead-of-plain-text'),
      code('javascript', 'res.writeHead(200, { \'Content-Type\': \'text/html\' })\nres.end(\'<h1>Hello!</h1><p>This is a real webpage.</p>\')'),
      callout('note', '<p><code>Content-Type</code> হেডার ব্রাউজারকে বলে দেয় এরপর যা আসবে তা কীভাবে বুঝতে হবে। এটিকে <code>text/html</code> সেট করলে ব্রাউজার ট্যাগগুলো রেন্ডার করে; <code>text/plain</code> রেখে দিলে এটি রেন্ডার না করে কাঁচা <code>&lt;h1&gt;</code> টেক্সট দেখায়।</p>'),

      h(2, 'স্ট্যাটাস কোড', 'status-codes'),
      p('<p><code>writeHead()</code>-এর প্রথম আর্গুমেন্ট হলো <b>স্ট্যাটাস কোড</b> — একটি সংখ্যা যা ব্রাউজারকে বলে রিকোয়েস্টটি কেমন হয়েছে। <code>200</code>-এর অর্থ সফল; <code>404</code>-এর অর্থ "পাওয়া যায়নি"; <code>500</code>-এর অর্থ সার্ভার একটি error-এর মুখোমুখি হয়েছে। এগুলো সঠিক করা গুরুত্বপূর্ণ — ব্যর্থ হওয়া কিন্তু <code>200</code> ফেরত দেওয়া একটি পেজ সার্চ ইঞ্জিন আর মনিটরিং টুলের কাছে সফল দেখায় এমনকি যখন এটি না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'event-loop',
  sortOrder: 10,
  en: {
    title: 'The Event Loop',
    metaTitle: 'The Node.js Event Loop | Learn Computer Academy',
    metaDescription: 'How Node.js runs on a single thread yet still handles thousands of connections at once, without one slow request blocking the rest.',
    blocks: [
      p('<p>The server in the last lesson can handle many browsers hitting it at the same time, without waiting for one request to finish before starting the next. This lesson explains how — and why Node was designed this way in the first place.</p>'),

      h(2, 'One Thread, Not Many'),
      p('<p>Many server platforms handle concurrent requests by starting a new thread — a separate line of execution — for each one. Node does the opposite: your JavaScript code runs on a <b>single thread</b>. Only one line of your code executes at any instant, ever.</p>'),

      h(2, 'So How Does It Handle Many Requests?'),
      p('<p>The trick is that most of what a server spends time on isn\'t actually computing — it\'s <i>waiting</i>: waiting for a file to finish reading off disk, waiting for a database to respond, waiting for another server\'s API to reply. Node hands that waiting off to the operating system in the background, and immediately moves on to the next piece of code, rather than sitting idle until the wait is over.</p><p>When the wait finishes — the file is read, the database replies — Node queues up the callback you provided, and runs it as soon as the single thread is free.</p>'),

      img(
        'docs/img/nodejs/event-loop-1',
        'Diagram of the Node.js event loop showing the call stack running JavaScript, a callback queue waiting, and background operations like file reads and network requests feeding completed callbacks back into the queue',
        1024, 768,
        'Slow operations run in the background; the event loop pulls their callbacks back onto the single thread once they finish.'
      ),

      h(2, 'Why This Matters in Practice'),
      p('<p>This is why the previous lesson\'s server can serve a second visitor while the first visitor\'s request is still being handled — as long as the handling involves waiting (for a file, a database, a network call) rather than heavy computation, the single thread is free to work on other requests during that wait.</p>'),

      callout('warning', '<p>The flip side: genuinely heavy <i>computation</i> — sorting a huge array, running a complex calculation — blocks that one thread completely while it runs, and <i>every other request has to wait</i>, since there\'s no second thread to pick up the slack. Node is excellent at juggling many waiting operations; it is a poor fit for CPU-heavy work.</p>', 'What can still block the thread'),

      h(2, 'The Takeaway'),
      p('<p>You rarely write "event loop" code directly — it runs automatically, underneath every callback, promise, and <code>async</code>/<code>await</code> you write. But understanding that it\'s there explains a lot: why Node.js code is written the way it is, why blocking file operations are discouraged in servers, and why the next several lessons on events, callbacks, and promises all matter as much as they do.</p>'),
    ],
  },
  bn: {
    title: 'ইভেন্ট লুপ',
    metaTitle: 'Node.js ইভেন্ট লুপ | Learn Computer Academy',
    metaDescription: 'একটি single থ্রেডে চলেও Node.js কীভাবে একসাথে হাজার হাজার সংযোগ সামলায়, একটি ধীর রিকোয়েস্টও বাকিদের আটকে না রেখে।',
    blocks: [
      p('<p>আগের পাঠের সার্ভারটি একসাথে অনেক ব্রাউজার এতে আঘাত করলেও সামলাতে পারে, একটি রিকোয়েস্ট শেষ হওয়ার জন্য অপেক্ষা না করেই পরেরটি শুরু করে। এই পাঠটি ব্যাখ্যা করে কীভাবে — আর Node শুরুতেই কেন এভাবে ডিজাইন করা হয়েছিল।</p>'),

      h(2, 'একটি থ্রেড, অনেকগুলো নয়', 'one-thread-not-many'),
      p('<p>অনেক সার্ভার প্ল্যাটফর্ম প্রতিটির জন্য একটি নতুন থ্রেড — এক্সিকিউশনের একটি আলাদা লাইন — শুরু করে concurrent রিকোয়েস্ট সামলায়। Node ঠিক উল্টোটা করে: আপনার JavaScript কোড একটি <b>একক থ্রেডে</b> চলে। যেকোনো মুহূর্তে আপনার কোডের শুধু একটি লাইন এক্সিকিউট হয়, কখনোই একাধিক নয়।</p>'),

      h(2, 'তাহলে এটি কীভাবে অনেক রিকোয়েস্ট সামলায়?', 'so-how-does-it-handle-many-requests'),
      p('<p>কৌশলটি হলো একটি সার্ভার সময়ের বেশিরভাগ যা করে তা আসলে গণনা নয় — এটি <i>অপেক্ষা করা</i>: ডিস্ক থেকে একটি ফাইল পড়া শেষ হওয়ার অপেক্ষা, একটি ডেটাবেসের সাড়া দেওয়ার অপেক্ষা, অন্য একটি সার্ভারের API-এর উত্তর দেওয়ার অপেক্ষা। Node সেই অপেক্ষাটি পেছনে অপারেটিং সিস্টেমকে হাতে দেয়, আর অপেক্ষা শেষ না হওয়া পর্যন্ত অলস বসে না থেকে সাথে সাথে পরের কোডের অংশে চলে যায়।</p><p>অপেক্ষা শেষ হলে — ফাইল পড়া হয়ে যায়, ডেটাবেস সাড়া দেয় — Node আপনার দেওয়া callback-টি সারিতে রাখে, আর একক থ্রেডটি ফাঁকা হওয়া মাত্র সেটি চালায়।</p>'),

      img(
        'docs/img/nodejs/event-loop-1',
        'Node.js ইভেন্ট লুপের ডায়াগ্রাম যেখানে JavaScript চালানো call stack, অপেক্ষারত একটি callback queue, আর ফাইল পড়া আর নেটওয়ার্ক রিকোয়েস্টের মতো ব্যাকগ্রাউন্ড অপারেশন সম্পন্ন callback-গুলো ফিরিয়ে queue-তে দিচ্ছে দেখানো হয়েছে',
        1024, 768,
        'ধীর অপারেশন ব্যাকগ্রাউন্ডে চলে; ইভেন্ট লুপ সেগুলো শেষ হলে তাদের callback একক থ্রেডে ফিরিয়ে আনে।'
      ),

      h(2, 'বাস্তবে এটি কেন গুরুত্বপূর্ণ', 'why-this-matters-in-practice'),
      p('<p>এই কারণেই আগের পাঠের সার্ভারটি প্রথম ভিজিটরের রিকোয়েস্ট এখনো হ্যান্ডেল হতে থাকা অবস্থায় দ্বিতীয় ভিজিটরকে সেবা দিতে পারে — যতক্ষণ হ্যান্ডলিংয়ে ভারী গণনার বদলে অপেক্ষা জড়িত থাকে (একটি ফাইল, একটি ডেটাবেস, একটি নেটওয়ার্ক কলের জন্য), সেই অপেক্ষার সময় একক থ্রেডটি অন্য রিকোয়েস্টে কাজ করতে মুক্ত থাকে।</p>'),

      callout('warning', '<p>উল্টো দিকটা হলো: সত্যিই ভারী <i>গণনা</i> — একটি বিশাল অ্যারে সর্ট করা, একটি জটিল হিসাব চালানো — চলার সময় সেই একক থ্রেডটিকে সম্পূর্ণভাবে ব্লক করে, আর <i>বাকি প্রতিটি রিকোয়েস্টকে অপেক্ষা করতে হয়</i>, কারণ চাপ নেওয়ার মতো দ্বিতীয় কোনো থ্রেড নেই। Node অনেক অপেক্ষারত অপারেশন একসাথে সামলাতে চমৎকার; CPU-ভারী কাজের জন্য এটি একটি খারাপ মিল।</p>', 'যা এখনো থ্রেডকে ব্লক করতে পারে'),

      h(2, 'মূল কথা', 'the-takeaway'),
      p('<p>আপনি খুব কমই সরাসরি "ইভেন্ট লুপ" কোড লেখেন — এটি স্বয়ংক্রিয়ভাবে চলে, আপনার লেখা প্রতিটি callback, promise, আর <code>async</code>/<code>await</code>-এর নিচে। কিন্তু এটি আছে তা বোঝা অনেক কিছু ব্যাখ্যা করে: কেন Node.js কোড এভাবে লেখা হয়, কেন সার্ভারে ব্লকিং ফাইল অপারেশন নিরুৎসাহিত করা হয়, আর কেন ইভেন্ট, callback, আর promise নিয়ে পরের বেশ কয়েকটি পাঠ যতটা গুরুত্বপূর্ণ মনে হয় ঠিক ততটাই গুরুত্বপূর্ণ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'events',
  sortOrder: 11,
  en: {
    title: 'Events & EventEmitter',
    metaTitle: 'Node.js Events and EventEmitter | Learn Computer Academy',
    metaDescription: 'Use the built-in EventEmitter class to build code that reacts to named events — the pattern much of Node itself is built on.',
    blocks: [
      p('<p>You\'ve used events before in browser JavaScript — <code>button.addEventListener(\'click\', ...)</code>. Node has its own version of the same idea, built around a class called <b>EventEmitter</b>, and a lot of Node\'s own built-in APIs are built on top of it.</p>'),

      h(2, 'Creating an Emitter'),
      code('javascript', 'const EventEmitter = require(\'events\')\n\nconst emitter = new EventEmitter()'),

      h(2, 'Listening and Emitting'),
      p('<p><code>on()</code> registers a function to run when a named event happens. <code>emit()</code> triggers it:</p>'),
      code('javascript', 'emitter.on(\'greet\', (name) => {\n  console.log(`Hello, ${name}!`)\n})\n\nemitter.emit(\'greet\', \'Priya\')  // logs: Hello, Priya!'),
      p('<p>Any extra arguments passed to <code>emit()</code> get forwarded to every listener. And a single event can have more than one listener — all of them run, in the order they were registered.</p>'),

      h(2, 'A Practical Example'),
      code('javascript', 'const EventEmitter = require(\'events\')\n\nclass OrderSystem extends EventEmitter {\n  placeOrder(item) {\n    console.log(`Order placed: ${item}`)\n    this.emit(\'order-placed\', item)\n  }\n}\n\nconst orders = new OrderSystem()\n\norders.on(\'order-placed\', (item) => {\n  console.log(`Sending confirmation email for: ${item}`)\n})\n\norders.on(\'order-placed\', (item) => {\n  console.log(`Updating inventory for: ${item}`)\n})\n\norders.placeOrder(\'Laptop Stand\')'),
      p('<p>The <code>placeOrder</code> method doesn\'t need to know anything about emails or inventory — it just announces that an order happened. Anything that cares can listen for it. New behavior can be added later just by attaching another <code>on()</code> listener, with no changes to <code>placeOrder</code> itself.</p>'),

      h(2, 'Why This Pattern Matters'),
      p('<p>This is exactly the shape Node itself uses internally. A file stream emits <code>\'data\'</code> as chunks arrive and <code>\'end\'</code> when it\'s done; an HTTP server emits <code>\'request\'</code> for every incoming request. Understanding <code>EventEmitter</code> here makes those built-in APIs — covered in the next several lessons — far less mysterious.</p>'),

      callout('note', '<p>An event name is just a string you choose — there\'s no fixed list. <code>\'order-placed\'</code> works because both the emitter and the listener agree to use that exact spelling; a typo in either place means the listener silently never runs.</p>'),
    ],
  },
  bn: {
    title: 'ইভেন্ট আর EventEmitter',
    metaTitle: 'Node.js ইভেন্ট আর EventEmitter | Learn Computer Academy',
    metaDescription: 'নামযুক্ত ইভেন্টে সাড়া দেওয়া কোড তৈরি করতে বিল্ট-ইন EventEmitter ক্লাস ব্যবহার করুন — যে প্যাটার্নের উপর Node নিজেই অনেকটা তৈরি।',
    blocks: [
      p('<p>আপনি আগে ব্রাউজার JavaScript-এ ইভেন্ট ব্যবহার করেছেন — <code>button.addEventListener(\'click\', ...)</code>। Node-এর একই ধারণার নিজস্ব সংস্করণ আছে, <b>EventEmitter</b> নামের একটি ক্লাসের চারপাশে তৈরি, আর Node-এর নিজের অনেক বিল্ট-ইন API এর উপরেই তৈরি।</p>'),

      h(2, 'একটি Emitter তৈরি করা', 'creating-an-emitter'),
      code('javascript', 'const EventEmitter = require(\'events\')\n\nconst emitter = new EventEmitter()'),

      h(2, 'শোনা আর emit করা', 'listening-and-emitting'),
      p('<p>একটি নামযুক্ত ইভেন্ট ঘটলে চালানোর জন্য <code>on()</code> একটি ফাংশন রেজিস্টার করে। <code>emit()</code> সেটি ট্রিগার করে:</p>'),
      code('javascript', 'emitter.on(\'greet\', (name) => {\n  console.log(`Hello, ${name}!`)\n})\n\nemitter.emit(\'greet\', \'Priya\')  // লগ করে: Hello, Priya!'),
      p('<p><code>emit()</code>-এ পাস করা যেকোনো অতিরিক্ত আর্গুমেন্ট প্রতিটি listener-এ ফরওয়ার্ড হয়। আর একটি একক ইভেন্টের একাধিক listener থাকতে পারে — সবগুলো চলে, যে ক্রমে সেগুলো রেজিস্টার হয়েছিল সেই ক্রমে।</p>'),

      h(2, 'একটি ব্যবহারিক উদাহরণ', 'a-practical-example'),
      code('javascript', 'const EventEmitter = require(\'events\')\n\nclass OrderSystem extends EventEmitter {\n  placeOrder(item) {\n    console.log(`Order placed: ${item}`)\n    this.emit(\'order-placed\', item)\n  }\n}\n\nconst orders = new OrderSystem()\n\norders.on(\'order-placed\', (item) => {\n  console.log(`Sending confirmation email for: ${item}`)\n})\n\norders.on(\'order-placed\', (item) => {\n  console.log(`Updating inventory for: ${item}`)\n})\n\norders.placeOrder(\'Laptop Stand\')'),
      p('<p><code>placeOrder</code> মেথডের ইমেইল বা ইনভেন্টরি সম্পর্কে কিছু জানার প্রয়োজন নেই — এটি শুধু ঘোষণা করে যে একটি অর্ডার হয়েছে। যা কিছু এতে আগ্রহী তা এটি শুনতে পারে। <code>placeOrder</code>-এ কোনো পরিবর্তন ছাড়াই শুধু আরেকটি <code>on()</code> listener যুক্ত করে পরে নতুন আচরণ যোগ করা যায়।</p>'),

      h(2, 'এই প্যাটার্ন কেন গুরুত্বপূর্ণ', 'why-this-pattern-matters'),
      p('<p>এটি ঠিক সেই আকার যা Node নিজেই ভেতরে ব্যবহার করে। একটি ফাইল স্ট্রিম chunk আসার সাথে সাথে <code>\'data\'</code> emit করে আর শেষ হলে <code>\'end\'</code>; একটি HTTP সার্ভার প্রতিটি আগত রিকোয়েস্টের জন্য <code>\'request\'</code> emit করে। এখানে <code>EventEmitter</code> বোঝা পরের বেশ কয়েকটি পাঠে কভার করা সেই বিল্ট-ইন API-গুলোকে অনেক কম রহস্যময় করে তোলে।</p>'),

      callout('note', '<p>একটি ইভেন্ট নাম শুধু আপনার বেছে নেওয়া একটি স্ট্রিং — কোনো নির্দিষ্ট তালিকা নেই। <code>\'order-placed\'</code> কাজ করে কারণ emitter আর listener উভয়ই ঠিক সেই বানানটি ব্যবহার করতে একমত। যেকোনো একটিতে একটি টাইপো মানে listener চুপচাপ কখনো চলে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'callbacks',
  sortOrder: 12,
  en: {
    title: 'Callbacks',
    metaTitle: 'Callbacks in Node.js | Learn Computer Academy',
    metaDescription: 'What a callback function actually is, why Node.js relies on them so heavily, and the specific problem they eventually run into.',
    blocks: [
      p('<p>You\'ve already used callbacks several times in this course — <code>fs.readFile()</code>\'s last argument, every listener passed to <code>on()</code>. This lesson makes the pattern explicit and names the problem that led to promises, covered next.</p>'),

      h(2, 'What a Callback Actually Is'),
      p('<p>A callback is nothing special — it\'s just a function passed as an argument to another function, to be called later instead of immediately.</p>'),
      code('javascript', 'function processOrder(item, callback) {\n  console.log(`Processing order: ${item}`)\n  callback(item)\n}\n\nprocessOrder(\'Laptop Stand\', (item) => {\n  console.log(`Done processing: ${item}`)\n})'),

      h(2, 'Error-First Callbacks'),
      p('<p>Node\'s own built-in async functions all follow one convention: the callback\'s <b>first parameter is always an error</b> (or <code>null</code> if nothing went wrong), and the actual result comes after it.</p>'),
      code('javascript', 'fs.readFile(\'data.txt\', \'utf8\', (err, data) => {\n  if (err) {\n    console.error(\'Something went wrong:\', err)\n    return\n  }\n  console.log(data)\n})'),
      p('<p>Checking <code>err</code> first, before touching <code>data</code>, is the convention every Node callback follows — skip the check and a failed read crashes the program on the next line instead of failing gracefully.</p>'),

      h(2, 'The Problem: Callback Hell'),
      p('<p>One async step calling another quickly nests:</p>'),
      code('javascript', 'fs.readFile(\'user.json\', \'utf8\', (err, userData) => {\n  if (err) return console.error(err)\n  fs.readFile(\'settings.json\', \'utf8\', (err, settingsData) => {\n    if (err) return console.error(err)\n    fs.readFile(\'preferences.json\', \'utf8\', (err, prefData) => {\n      if (err) return console.error(err)\n      console.log(\'All data loaded\')\n    })\n  })\n})'),
      p('<p>Three steps deep and this is already hard to follow — each step is indented inside the last, error handling repeats at every level, and adding a fourth step means nesting even further. This shape earned its own nickname: <b>callback hell</b>. It doesn\'t get better with scale; it gets worse.</p>'),

      callout('note', '<p>This is the exact problem Promises were invented to solve — flattening this pyramid back into something that reads top to bottom. The next lesson picks up right here.</p>'),
    ],
  },
  bn: {
    title: 'Callback',
    metaTitle: 'Node.js-এ Callback | Learn Computer Academy',
    metaDescription: 'একটি callback ফাংশন আসলে কী, Node.js কেন এগুলোর উপর এত বেশি নির্ভর করে, আর যে নির্দিষ্ট সমস্যায় এগুলো শেষে গিয়ে পড়ে।',
    blocks: [
      p('<p>এই কোর্সে আপনি ইতিমধ্যে বেশ কয়েকবার callback ব্যবহার করেছেন — <code>fs.readFile()</code>-এর শেষ আর্গুমেন্ট, <code>on()</code>-এ পাস করা প্রতিটি listener। এই পাঠটি প্যাটার্নটিকে স্পষ্ট করে আর সেই সমস্যার নাম দেয় যা promise-এ নিয়ে গিয়েছিল, যা পরে কভার করা হয়েছে।</p>'),

      h(2, 'একটি callback আসলে কী', 'what-a-callback-actually-is'),
      p('<p>একটি callback বিশেষ কিছু নয় — এটি শুধু অন্য একটি ফাংশনে আর্গুমেন্ট হিসেবে পাস করা একটি ফাংশন, সাথে সাথে না হয়ে পরে কল করার জন্য।</p>'),
      code('javascript', 'function processOrder(item, callback) {\n  console.log(`Processing order: ${item}`)\n  callback(item)\n}\n\nprocessOrder(\'Laptop Stand\', (item) => {\n  console.log(`Done processing: ${item}`)\n})'),

      h(2, 'Error-First Callback', 'error-first-callbacks'),
      p('<p>Node-এর নিজস্ব বিল্ট-ইন async ফাংশনগুলো সবগুলো একটি প্রথা মেনে চলে: callback-এর <b>প্রথম প্যারামিটার সবসময় একটি error</b> (অথবা কিছু ভুল না হলে <code>null</code>), আর আসল ফলাফল এর পরে আসে।</p>'),
      code('javascript', 'fs.readFile(\'data.txt\', \'utf8\', (err, data) => {\n  if (err) {\n    console.error(\'Something went wrong:\', err)\n    return\n  }\n  console.log(data)\n})'),
      p('<p><code>data</code> স্পর্শ করার আগে প্রথমে <code>err</code> চেক করা, এটিই সেই প্রথা যা প্রতিটি Node callback মেনে চলে — চেকটি বাদ দিলে একটি ব্যর্থ read সুন্দরভাবে ব্যর্থ হওয়ার বদলে পরের লাইনে প্রোগ্রামটিকে ক্র্যাশ করায়।</p>'),

      h(2, 'সমস্যা: Callback Hell', 'the-problem-callback-hell'),
      p('<p>একটি async ধাপ অন্যটিকে কল করলে তা দ্রুত nest হয়ে যায়:</p>'),
      code('javascript', 'fs.readFile(\'user.json\', \'utf8\', (err, userData) => {\n  if (err) return console.error(err)\n  fs.readFile(\'settings.json\', \'utf8\', (err, settingsData) => {\n    if (err) return console.error(err)\n    fs.readFile(\'preferences.json\', \'utf8\', (err, prefData) => {\n      if (err) return console.error(err)\n      console.log(\'All data loaded\')\n    })\n  })\n})'),
      p('<p>তিন ধাপ গভীরে গিয়েই এটি অনুসরণ করা কঠিন হয়ে গেছে — প্রতিটি ধাপ শেষটির ভেতরে ইনডেন্ট করা, error হ্যান্ডলিং প্রতিটি স্তরে পুনরাবৃত্তি হয়, আর চতুর্থ একটি ধাপ যোগ করার অর্থ আরও গভীরে nest করা। এই আকৃতিটি নিজস্ব একটি ডাকনাম অর্জন করেছে: <b>callback hell</b>। এটি স্কেলের সাথে ভালো হয় না; এটি আরও খারাপ হয়।</p>'),

      callout('note', '<p>এটিই ঠিক সেই সমস্যা যা সমাধান করতে Promise আবিষ্কার হয়েছিল — এই পিরামিডটিকে আবার এমন কিছুতে সমতল করা যা উপর থেকে নিচে পড়া যায়। পরের পাঠ ঠিক এখান থেকে শুরু হয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'promises-in-node',
  sortOrder: 13,
  en: {
    title: 'Promises in Node.js',
    metaTitle: 'Promises in Node.js | Learn Computer Academy',
    metaDescription: 'Use Node.js\'s promise-based APIs to flatten callback hell, and turn any callback-style function into one that returns a promise with util.promisify.',
    blocks: [
      p('<p>You already know what a promise is from the JavaScript course — an object representing a value that isn\'t ready yet. This lesson is about where promises show up specifically in Node, and how to get one when an API only offers callbacks.</p>'),

      h(2, 'The Callback-Hell Example, With Promises'),
      p('<p>The nested <code>fs.readFile()</code> calls from the last lesson use <code>fs</code>\'s callback API. Switching to <code>fs/promises</code> flattens it with <code>.then()</code> chains instead of nesting:</p>'),
      code('javascript', 'const fs = require(\'fs/promises\')\n\nfs.readFile(\'user.json\', \'utf8\')\n  .then((userData) => fs.readFile(\'settings.json\', \'utf8\'))\n  .then((settingsData) => fs.readFile(\'preferences.json\', \'utf8\'))\n  .then((prefData) => console.log(\'All data loaded\'))\n  .catch((err) => console.error(\'Something failed:\', err))'),
      p('<p>One <code>.catch()</code> at the end now handles a failure from <i>any</i> step, instead of repeating the same error check in every callback.</p>'),

      h(2, 'Running Things in Parallel'),
      p('<p>Those three reads don\'t actually depend on each other — each one waits for the previous one to finish for no real reason. <code>Promise.all()</code> starts them all at once and waits for every one to finish:</p>'),
      code('javascript', 'Promise.all([\n  fs.readFile(\'user.json\', \'utf8\'),\n  fs.readFile(\'settings.json\', \'utf8\'),\n  fs.readFile(\'preferences.json\', \'utf8\'),\n])\n  .then(([userData, settingsData, prefData]) => {\n    console.log(\'All data loaded\')\n  })\n  .catch((err) => console.error(\'Something failed:\', err))'),
      p('<p>This finishes roughly as fast as the slowest single read, instead of the sum of all three — a real difference once a server is handling many requests.</p>'),

      h(2, 'Turning a Callback API Into a Promise'),
      p('<p>Not every function offers a promise version. Node\'s built-in <code>util.promisify()</code> converts any error-first callback function into one that returns a promise:</p>'),
      code('javascript', 'const util = require(\'util\')\nconst fs = require(\'fs\')\n\nconst readFileAsync = util.promisify(fs.readFile)\n\nreadFileAsync(\'data.txt\', \'utf8\')\n  .then((data) => console.log(data))\n  .catch((err) => console.error(err))'),
      callout('tip', '<p><code>util.promisify()</code> only works on functions that follow Node\'s error-first callback convention from the last lesson — the callback\'s first parameter must be the error. Most of Node\'s own APIs qualify.</p>'),

      h(2, 'Common Node Promise Rejections'),
      table(
        ['Situation', 'What typically rejects the promise'],
        [
          ['Reading a file', 'File doesn\'t exist, or the program lacks permission to read it'],
          ['Making a network request', 'The other server is unreachable, or times out'],
          ['Parsing JSON', 'The text isn\'t valid JSON'],
        ]
      ),
    ],
  },
  bn: {
    title: 'Node.js-এ Promise',
    metaTitle: 'Node.js-এ Promise | Learn Computer Academy',
    metaDescription: 'callback hell সমতল করতে Node.js-এর promise-ভিত্তিক API ব্যবহার করুন, আর util.promisify দিয়ে যেকোনো callback-স্টাইল ফাংশনকে promise ফেরত দেওয়া ফাংশনে পরিণত করুন।',
    blocks: [
      p('<p>JavaScript কোর্স থেকে আপনি ইতিমধ্যে জানেন একটি promise কী — এমন একটি অবজেক্ট যা এখনো প্রস্তুত নয় এমন একটি মানকে প্রতিনিধিত্ব করে। এই পাঠটি নিয়ে যে Node-এ ঠিক কোথায় promise দেখা যায়, আর একটি API যদি শুধু callback দেয় তাহলে কীভাবে একটি promise পাওয়া যায়।</p>'),

      h(2, 'Callback-Hell উদাহরণ, Promise সহ', 'the-callback-hell-example-with-promises'),
      p('<p>আগের পাঠের nested <code>fs.readFile()</code> কলগুলো <code>fs</code>-এর callback API ব্যবহার করে। <code>fs/promises</code>-এ স্যুইচ করলে nest করার বদলে <code>.then()</code> চেইন দিয়ে এটি সমতল হয়ে যায়:</p>'),
      code('javascript', 'const fs = require(\'fs/promises\')\n\nfs.readFile(\'user.json\', \'utf8\')\n  .then((userData) => fs.readFile(\'settings.json\', \'utf8\'))\n  .then((settingsData) => fs.readFile(\'preferences.json\', \'utf8\'))\n  .then((prefData) => console.log(\'All data loaded\'))\n  .catch((err) => console.error(\'Something failed:\', err))'),
      p('<p>শেষে একটি <code>.catch()</code> এখন প্রতিটি callback-এ একই error চেক পুনরাবৃত্তি করার বদলে <i>যেকোনো</i> ধাপ থেকে একটি ব্যর্থতা সামলায়।</p>'),

      h(2, 'সমান্তরালে জিনিসগুলো চালানো', 'running-things-in-parallel'),
      p('<p>সেই তিনটি read আসলে একে অপরের উপর নির্ভর করে না — প্রতিটি কোনো বাস্তব কারণ ছাড়াই আগেরটি শেষ হওয়ার জন্য অপেক্ষা করে। <code>Promise.all()</code> সবগুলো একসাথে শুরু করে আর প্রতিটি শেষ হওয়ার জন্য অপেক্ষা করে:</p>'),
      code('javascript', 'Promise.all([\n  fs.readFile(\'user.json\', \'utf8\'),\n  fs.readFile(\'settings.json\', \'utf8\'),\n  fs.readFile(\'preferences.json\', \'utf8\'),\n])\n  .then(([userData, settingsData, prefData]) => {\n    console.log(\'All data loaded\')\n  })\n  .catch((err) => console.error(\'Something failed:\', err))'),
      p('<p>এটি তিনটির যোগফলের বদলে মোটামুটি সবচেয়ে ধীর একক read-এর মতো দ্রুত শেষ হয় — একটি সার্ভার অনেক রিকোয়েস্ট সামলানোর সময় এটি একটি বাস্তব পার্থক্য।</p>'),

      h(2, 'একটি Callback API-কে Promise-এ পরিণত করা', 'turning-a-callback-api-into-a-promise'),
      p('<p>প্রতিটি ফাংশন promise ভার্সন দেয় না। Node-এর বিল্ট-ইন <code>util.promisify()</code> যেকোনো error-first callback ফাংশনকে এমন একটিতে রূপান্তর করে যা একটি promise ফেরত দেয়:</p>'),
      code('javascript', 'const util = require(\'util\')\nconst fs = require(\'fs\')\n\nconst readFileAsync = util.promisify(fs.readFile)\n\nreadFileAsync(\'data.txt\', \'utf8\')\n  .then((data) => console.log(data))\n  .catch((err) => console.error(err))'),
      callout('tip', '<p><code>util.promisify()</code> শুধু সেই ফাংশনগুলোতে কাজ করে যা আগের পাঠের Node-এর error-first callback প্রথা মেনে চলে — callback-এর প্রথম প্যারামিটার অবশ্যই error হতে হবে। Node-এর নিজের বেশিরভাগ API এই যোগ্যতা পূরণ করে।</p>'),

      h(2, 'সাধারণ Node Promise Rejection', 'common-node-promise-rejections'),
      table(
        ['পরিস্থিতি', 'সাধারণত যা promise-টি reject করে'],
        [
          ['একটি ফাইল পড়া', 'ফাইলটি নেই, অথবা প্রোগ্রামের এটি পড়ার অনুমতি নেই'],
          ['একটি নেটওয়ার্ক রিকোয়েস্ট করা', 'অন্য সার্ভারটি অপ্রাপ্য, অথবা টাইমআউট হয়'],
          ['JSON পার্স করা', 'টেক্সটটি বৈধ JSON নয়'],
        ]
      ),
    ],
  },
})

lessons.push({
  slug: 'async-await',
  sortOrder: 14,
  en: {
    title: 'Async/Await in Node.js',
    metaTitle: 'Async/Await in Node.js | Learn Computer Academy',
    metaDescription: 'Write Node.js\'s promise-based code with async/await instead of .then() chains, and handle errors with try/catch.',
    blocks: [
      p('<p><code>async</code>/<code>await</code> is the syntax most real Node.js code is written with today. It doesn\'t replace promises — every <code>async</code> function still returns one — it just gives you a way to write promise-based code that reads top to bottom, like ordinary synchronous code.</p>'),

      h(2, 'The Callback-Hell Example, Once More'),
      p('<p>The same three-file read from the last two lessons, this time with <code>async</code>/<code>await</code>:</p>'),
      code('javascript', 'const fs = require(\'fs/promises\')\n\nasync function loadAllData() {\n  const userData = await fs.readFile(\'user.json\', \'utf8\')\n  const settingsData = await fs.readFile(\'settings.json\', \'utf8\')\n  const prefData = await fs.readFile(\'preferences.json\', \'utf8\')\n  console.log(\'All data loaded\')\n}\n\nloadAllData()'),
      p('<p>Compare this to the nested version two lessons back — same three operations, now reading as a plain sequence of statements instead of a pyramid.</p>'),

      h(2, 'Error Handling With try/catch'),
      p('<p><code>.catch()</code> is replaced by an ordinary <code>try</code>/<code>catch</code> block wrapped around the <code>await</code> calls:</p>'),
      code('javascript', 'async function loadAllData() {\n  try {\n    const userData = await fs.readFile(\'user.json\', \'utf8\')\n    const settingsData = await fs.readFile(\'settings.json\', \'utf8\')\n    console.log(\'All data loaded\')\n  } catch (err) {\n    console.error(\'Something failed:\', err)\n  }\n}'),

      h(2, 'Still Use Promise.all() for Parallel Work'),
      p('<p><code>await</code>ing three calls one after another still runs them in sequence — <code>async</code>/<code>await</code> is just syntax over promises, it doesn\'t change when things actually run. To get the parallel behavior from the last lesson, <code>await</code> a single <code>Promise.all()</code>:</p>'),
      code('javascript', 'async function loadAllData() {\n  const [userData, settingsData, prefData] = await Promise.all([\n    fs.readFile(\'user.json\', \'utf8\'),\n    fs.readFile(\'settings.json\', \'utf8\'),\n    fs.readFile(\'preferences.json\', \'utf8\'),\n  ])\n  console.log(\'All data loaded\')\n}'),

      callout('warning', '<p>An <code>await</code> only pauses the function it\'s written inside — it never blocks the rest of the program the way a <code>Sync</code> method does. Other requests keep being handled by the event loop while one function is paused on an <code>await</code>.</p>', 'await pauses a function, not the whole program'),

      h(2, 'A Note on Top-Level await'),
      p('<p>Modern Node also allows <code>await</code> directly in a file\'s top-level code — no wrapping <code>async</code> function needed — but only in ES Modules (the previous lesson on <code>import</code>/<code>export</code>). It\'s convenient for quick scripts; inside real application code, wrapping logic in named <code>async</code> functions, as above, stays clearer.</p>'),
    ],
  },
  bn: {
    title: 'Node.js-এ Async/Await',
    metaTitle: 'Node.js-এ Async/Await | Learn Computer Academy',
    metaDescription: '.then() চেইনের বদলে async/await দিয়ে Node.js-এর promise-ভিত্তিক কোড লিখুন, আর try/catch দিয়ে error হ্যান্ডেল করুন।',
    blocks: [
      p('<p>আজ বেশিরভাগ বাস্তব Node.js কোড <code>async</code>/<code>await</code> সিনট্যাক্স দিয়ে লেখা হয়। এটি promise প্রতিস্থাপন করে না — প্রতিটি <code>async</code> ফাংশন এখনো একটি ফেরত দেয় — এটি শুধু আপনাকে promise-ভিত্তিক কোড লেখার একটি উপায় দেয় যা সাধারণ synchronous কোডের মতো উপর থেকে নিচে পড়া যায়।</p>'),

      h(2, 'Callback-Hell উদাহরণ, আবারও', 'the-callback-hell-example-once-more'),
      p('<p>আগের দুই পাঠের একই তিন-ফাইল read, এবার <code>async</code>/<code>await</code> দিয়ে:</p>'),
      code('javascript', 'const fs = require(\'fs/promises\')\n\nasync function loadAllData() {\n  const userData = await fs.readFile(\'user.json\', \'utf8\')\n  const settingsData = await fs.readFile(\'settings.json\', \'utf8\')\n  const prefData = await fs.readFile(\'preferences.json\', \'utf8\')\n  console.log(\'All data loaded\')\n}\n\nloadAllData()'),
      p('<p>দুই পাঠ আগের nested ভার্সনের সাথে এটি তুলনা করুন — একই তিনটি অপারেশন, এখন একটি পিরামিডের বদলে সাধারণ স্টেটমেন্টের ক্রম হিসেবে পড়া যাচ্ছে।</p>'),

      h(2, 'try/catch দিয়ে Error হ্যান্ডলিং', 'error-handling-with-trycatch'),
      p('<p><code>.catch()</code>-এর বদলে <code>await</code> কলগুলোর চারপাশে একটি সাধারণ <code>try</code>/<code>catch</code> ব্লক থাকে:</p>'),
      code('javascript', 'async function loadAllData() {\n  try {\n    const userData = await fs.readFile(\'user.json\', \'utf8\')\n    const settingsData = await fs.readFile(\'settings.json\', \'utf8\')\n    console.log(\'All data loaded\')\n  } catch (err) {\n    console.error(\'Something failed:\', err)\n  }\n}'),

      h(2, 'সমান্তরাল কাজের জন্য এখনও Promise.all() ব্যবহার করুন', 'still-use-promiseall-for-parallel-work'),
      p('<p>একের পর এক তিনটি কল <code>await</code> করলেও সেগুলো এখনো ধারাবাহিকভাবে চলে — <code>async</code>/<code>await</code> শুধু promise-এর উপর সিনট্যাক্স, এটি জিনিসগুলো আসলে কখন চলে তা বদলায় না। আগের পাঠের সমান্তরাল আচরণ পেতে, একটি একক <code>Promise.all()</code> <code>await</code> করুন:</p>'),
      code('javascript', 'async function loadAllData() {\n  const [userData, settingsData, prefData] = await Promise.all([\n    fs.readFile(\'user.json\', \'utf8\'),\n    fs.readFile(\'settings.json\', \'utf8\'),\n    fs.readFile(\'preferences.json\', \'utf8\'),\n  ])\n  console.log(\'All data loaded\')\n}'),

      callout('warning', '<p>একটি <code>await</code> শুধু যে ফাংশনের ভেতরে এটি লেখা তাকে বিরতি দেয় — এটি কখনো একটি <code>Sync</code> মেথডের মতো বাকি প্রোগ্রামকে ব্লক করে না। একটি ফাংশন একটি <code>await</code>-এ বিরতিতে থাকা অবস্থায় ইভেন্ট লুপ অন্য রিকোয়েস্ট সামলাতে থাকে।</p>', 'await একটি ফাংশনকে বিরতি দেয়, পুরো প্রোগ্রামকে নয়'),

      h(2, 'টপ-লেভেল await সম্পর্কে একটি নোট', 'a-note-on-top-level-await'),
      p('<p>আধুনিক Node একটি ফাইলের টপ-লেভেল কোডে সরাসরি <code>await</code>-ও অনুমতি দেয় — কোনো wrapping <code>async</code> ফাংশনের প্রয়োজন নেই — কিন্তু শুধু ES Modules-এ (<code>import</code>/<code>export</code> নিয়ে আগের পাঠ)। দ্রুত স্ক্রিপ্টের জন্য এটি সুবিধাজনক; বাস্তব অ্যাপ্লিকেশন কোডের ভেতরে, উপরের মতো লজিককে নামযুক্ত <code>async</code> ফাংশনে মোড়ানো বেশি পরিষ্কার থাকে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'streams',
  sortOrder: 15,
  en: {
    title: 'Streams',
    metaTitle: 'Node.js Streams | Learn Computer Academy',
    metaDescription: 'Process data piece by piece as it arrives with Node.js streams, instead of waiting for an entire file to load into memory first.',
    blocks: [
      p('<p>Every <code>fs.readFile()</code> call so far loads the entire file into memory before your code can touch any of it. That\'s fine for a small text file. For a 4 GB video, it means holding all 4 GB in memory at once just to start processing it. <b>Streams</b> solve this by handling data in small pieces, as those pieces arrive, instead of all at once.</p>'),

      img(
        'docs/img/nodejs/streams-1',
        'Diagram showing a large file being broken into small sequential chunks flowing one at a time from a readable stream into a writable stream',
        1024, 768,
        'A stream moves data in small chunks instead of loading the whole thing into memory at once.'
      ),

      h(2, 'Reading a File as a Stream'),
      code('javascript', 'const fs = require(\'fs\')\n\nconst stream = fs.createReadStream(\'huge-file.txt\', \'utf8\')\n\nstream.on(\'data\', (chunk) => {\n  console.log(`Received ${chunk.length} characters`)\n})\n\nstream.on(\'end\', () => {\n  console.log(\'Finished reading the file\')\n})\n\nstream.on(\'error\', (err) => {\n  console.error(\'Something went wrong:\', err)\n})'),
      p('<p>This is <code>EventEmitter</code> from a few lessons back, applied directly — a readable stream <i>is</i> an <code>EventEmitter</code> that emits <code>\'data\'</code> for every chunk and <code>\'end\'</code> once the file is fully read.</p>'),

      h(2, 'Writing a File as a Stream'),
      code('javascript', 'const writeStream = fs.createWriteStream(\'output.txt\')\n\nwriteStream.write(\'First line\\n\')\nwriteStream.write(\'Second line\\n\')\nwriteStream.end()'),

      h(2, 'Piping — Connecting a Readable to a Writable'),
      p('<p>Reading from one stream and writing each chunk to another is common enough to have its own shortcut: <code>.pipe()</code>.</p>'),
      code('javascript', 'const readStream = fs.createReadStream(\'input.txt\')\nconst writeStream = fs.createWriteStream(\'output.txt\')\n\nreadStream.pipe(writeStream)'),
      p('<p>This one line copies a file of any size, at any speed the disk can manage, without ever holding the whole thing in memory. It\'s the same mechanism <code>http</code> uses under the hood — <code>req</code> and <code>res</code> in the web server lessons are themselves streams.</p>'),

      h(2, 'When Streams Actually Matter'),
      table(
        ['Situation', 'Worth streaming?'],
        [
          ['A small config file (a few KB)', 'No — readFile is simpler and the difference is unmeasurable'],
          ['A large video or log file', 'Yes — loading it whole could exhaust available memory'],
          ['Serving a file over an HTTP response', 'Yes — the browser can start rendering before the whole file arrives'],
        ]
      ),
      callout('note', '<p>Streams are one of the areas where Node\'s design shows through most clearly: memory is a shared, limited resource, and a server handling many requests at once can\'t afford to load a large file into memory for each one.</p>'),
    ],
  },
  bn: {
    title: 'স্ট্রিম',
    metaTitle: 'Node.js স্ট্রিম | Learn Computer Academy',
    metaDescription: 'পুরো ফাইল মেমরিতে লোড হওয়ার জন্য অপেক্ষা করার বদলে Node.js স্ট্রিম দিয়ে ডেটা আসার সাথে সাথে টুকরো টুকরো করে প্রসেস করুন।',
    blocks: [
      p('<p>এখন পর্যন্ত প্রতিটি <code>fs.readFile()</code> কল আপনার কোড এর কোনো অংশ স্পর্শ করার আগে পুরো ফাইলটি মেমরিতে লোড করে। একটি ছোট টেক্সট ফাইলের জন্য এটি ঠিক আছে। একটি 4 GB ভিডিওর জন্য, এর অর্থ শুধু এটি প্রসেস করা শুরু করতে একবারে পুরো 4 GB মেমরিতে ধরে রাখা। <b>স্ট্রিম</b> এটি সমাধান করে ডেটাকে ছোট টুকরোয়, সেই টুকরোগুলো আসার সাথে সাথে, একবারে সবটা না করে হ্যান্ডেল করে।</p>'),

      img(
        'docs/img/nodejs/streams-1',
        'ডায়াগ্রাম যেখানে একটি বড় ফাইল ছোট ছোট ক্রমিক chunk-এ ভেঙে একটি readable স্ট্রিম থেকে একটি writable স্ট্রিমে একবারে একটি করে প্রবাহিত হচ্ছে দেখানো হয়েছে',
        1024, 768,
        'একটি স্ট্রিম একবারে পুরো জিনিস মেমরিতে লোড না করে ছোট chunk-এ ডেটা সরায়।'
      ),

      h(2, 'একটি ফাইলকে স্ট্রিম হিসেবে পড়া', 'reading-a-file-as-a-stream'),
      code('javascript', 'const fs = require(\'fs\')\n\nconst stream = fs.createReadStream(\'huge-file.txt\', \'utf8\')\n\nstream.on(\'data\', (chunk) => {\n  console.log(`Received ${chunk.length} characters`)\n})\n\nstream.on(\'end\', () => {\n  console.log(\'Finished reading the file\')\n})\n\nstream.on(\'error\', (err) => {\n  console.error(\'Something went wrong:\', err)\n})'),
      p('<p>এটি কয়েক পাঠ আগের <code>EventEmitter</code>, সরাসরি প্রয়োগ করা — একটি readable স্ট্রিম <i>হলো</i> একটি <code>EventEmitter</code> যা প্রতিটি chunk-এর জন্য <code>\'data\'</code> আর ফাইলটি সম্পূর্ণ পড়া হয়ে গেলে <code>\'end\'</code> emit করে।</p>'),

      h(2, 'একটি ফাইলকে স্ট্রিম হিসেবে লেখা', 'writing-a-file-as-a-stream'),
      code('javascript', 'const writeStream = fs.createWriteStream(\'output.txt\')\n\nwriteStream.write(\'First line\\n\')\nwriteStream.write(\'Second line\\n\')\nwriteStream.end()'),

      h(2, 'Piping — একটি Readable-কে একটি Writable-এর সাথে সংযুক্ত করা', 'piping-connecting-a-readable-to-a-writable'),
      p('<p>একটি স্ট্রিম থেকে পড়ে প্রতিটি chunk অন্যটিতে লেখা যথেষ্ট সাধারণ যে এর নিজস্ব শর্টকাট আছে: <code>.pipe()</code>।</p>'),
      code('javascript', 'const readStream = fs.createReadStream(\'input.txt\')\nconst writeStream = fs.createWriteStream(\'output.txt\')\n\nreadStream.pipe(writeStream)'),
      p('<p>এই এক লাইন যেকোনো আকারের একটি ফাইল কপি করে, ডিস্ক যত গতিতে সামলাতে পারে ততে, পুরো জিনিসটি কখনো মেমরিতে না রেখেই। এটি একই মেকানিজম যা <code>http</code> ভেতরে ব্যবহার করে — ওয়েব সার্ভার পাঠের <code>req</code> আর <code>res</code> নিজেরাই স্ট্রিম।</p>'),

      h(2, 'স্ট্রিম আসলে কখন গুরুত্বপূর্ণ', 'when-streams-actually-matter'),
      table(
        ['পরিস্থিতি', 'স্ট্রিম করার যোগ্য?'],
        [
          ['একটি ছোট কনফিগ ফাইল (কয়েক KB)', 'না — readFile সহজ আর পার্থক্যটি মাপা যায় না'],
          ['একটি বড় ভিডিও বা লগ ফাইল', 'হ্যাঁ — পুরোটা লোড করলে উপলব্ধ মেমরি শেষ হয়ে যেতে পারে'],
          ['একটি HTTP রেসপন্সের মাধ্যমে একটি ফাইল সার্ভ করা', 'হ্যাঁ — পুরো ফাইলটি আসার আগেই ব্রাউজার রেন্ডার শুরু করতে পারে'],
        ]
      ),
      callout('note', '<p>স্ট্রিম এমন একটি ক্ষেত্র যেখানে Node-এর ডিজাইন সবচেয়ে স্পষ্টভাবে দেখা যায়: মেমরি একটি শেয়ার করা, সীমিত রিসোর্স, আর একসাথে অনেক রিকোয়েস্ট সামলানো একটি সার্ভার প্রতিটির জন্য একটি বড় ফাইল মেমরিতে লোড করার সামর্থ্য রাখে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'buffers',
  sortOrder: 16,
  en: {
    title: 'Buffers',
    metaTitle: 'Node.js Buffers | Learn Computer Academy',
    metaDescription: 'What a Buffer is, why Node.js needs a separate type for raw binary data, and how it relates to the streams and files covered so far.',
    blocks: [
      p('<p>Not all data is text. Images, videos, and PDFs are <b>binary data</b> — raw bytes that don\'t map to readable characters. JavaScript strings are built for text; Node needs a different type to hold binary data, and that\'s what a <b>Buffer</b> is.</p>'),

      h(2, 'Where Buffers Show Up'),
      p('<p>You\'ve actually already produced one, without naming it. Leave off the encoding when reading a file:</p>'),
      code('javascript', 'const fs = require(\'fs\')\n\nconst data = fs.readFileSync(\'photo.png\')\nconsole.log(data)  // <Buffer 89 50 4e 47 0d 0a 1a 0a ...>'),
      p('<p>Without <code>\'utf8\'</code> as a second argument, <code>readFileSync</code> returns the file\'s raw bytes as a <code>Buffer</code> instead of trying to decode them as text — appropriate here, since PNG data isn\'t meant to be read as characters at all.</p>'),

      h(2, 'Creating a Buffer Directly'),
      code('javascript', 'const buf = Buffer.from(\'Hello\')\nconsole.log(buf)          // <Buffer 48 65 6c 6c 6f>\nconsole.log(buf.length)   // 5\nconsole.log(buf.toString())  // \'Hello\''),
      p('<p><code>Buffer.from()</code> converts a string into its raw byte representation; <code>.toString()</code> converts it back. Each byte is shown in hexadecimal when a Buffer is logged.</p>'),

      h(2, 'Buffers and Streams'),
      p('<p>The <code>\'data\'</code> event from the streams lesson delivers each chunk as a <code>Buffer</code> by default — that\'s the actual type flowing through <code>readStream.pipe(writeStream)</code>. Passing <code>\'utf8\'</code> as an encoding to <code>createReadStream()</code>, as in the streams lesson, tells Node to convert each chunk to a string before your <code>\'data\'</code> handler ever sees it.</p>'),

      callout('note', '<p>You won\'t create Buffers directly very often in typical application code — most of the time they arrive already handed to you, from a file read, a network response, or a stream\'s <code>\'data\'</code> event. Knowing what they are is what matters, so a <code>&lt;Buffer ...&gt;</code> in your console output isn\'t a mystery when it shows up.</p>'),
    ],
  },
  bn: {
    title: 'বাফার',
    metaTitle: 'Node.js বাফার | Learn Computer Academy',
    metaDescription: 'একটি Buffer কী, কাঁচা বাইনারি ডেটার জন্য Node.js-এর কেন একটি আলাদা টাইপের প্রয়োজন, আর এটি এখন পর্যন্ত কভার করা স্ট্রিম আর ফাইলের সাথে কীভাবে সম্পর্কিত।',
    blocks: [
      p('<p>সব ডেটা টেক্সট নয়। ছবি, ভিডিও, আর PDF হলো <b>বাইনারি ডেটা</b> — কাঁচা বাইট যা পড়ার যোগ্য অক্ষরের সাথে মেলে না। JavaScript স্ট্রিং টেক্সটের জন্য তৈরি; বাইনারি ডেটা ধরে রাখতে Node-এর একটি ভিন্ন টাইপ প্রয়োজন, আর এটিই একটি <b>Buffer</b>।</p>'),

      h(2, 'Buffer কোথায় দেখা যায়', 'where-buffers-show-up'),
      p('<p>আসলে আপনি ইতিমধ্যে একটি তৈরি করেছেন, নাম না জেনেই। একটি ফাইল পড়ার সময় এনকোডিং বাদ দিন:</p>'),
      code('javascript', 'const fs = require(\'fs\')\n\nconst data = fs.readFileSync(\'photo.png\')\nconsole.log(data)  // <Buffer 89 50 4e 47 0d 0a 1a 0a ...>'),
      p('<p>দ্বিতীয় আর্গুমেন্ট হিসেবে <code>\'utf8\'</code> ছাড়া, <code>readFileSync</code> সেগুলোকে টেক্সট হিসেবে ডিকোড করার চেষ্টা না করে ফাইলের কাঁচা বাইট একটি <code>Buffer</code> হিসেবে ফেরত দেয় — এখানে উপযুক্ত, কারণ PNG ডেটা মোটেও অক্ষর হিসেবে পড়ার উদ্দেশ্যে নয়।</p>'),

      h(2, 'সরাসরি একটি Buffer তৈরি করা', 'creating-a-buffer-directly'),
      code('javascript', 'const buf = Buffer.from(\'Hello\')\nconsole.log(buf)          // <Buffer 48 65 6c 6c 6f>\nconsole.log(buf.length)   // 5\nconsole.log(buf.toString())  // \'Hello\''),
      p('<p><code>Buffer.from()</code> একটি স্ট্রিংকে এর কাঁচা বাইট রিপ্রেজেন্টেশনে রূপান্তর করে; <code>.toString()</code> এটি ফিরিয়ে আনে। একটি Buffer লগ করলে প্রতিটি বাইট hexadecimal-এ দেখানো হয়।</p>'),

      h(2, 'Buffer আর স্ট্রিম', 'buffers-and-streams'),
      p('<p>স্ট্রিম পাঠের <code>\'data\'</code> ইভেন্ট ডিফল্টভাবে প্রতিটি chunk একটি <code>Buffer</code> হিসেবে দেয় — এটিই আসল টাইপ যা <code>readStream.pipe(writeStream)</code>-এর মধ্য দিয়ে প্রবাহিত হয়। স্ট্রিম পাঠের মতো <code>createReadStream()</code>-এ একটি এনকোডিং হিসেবে <code>\'utf8\'</code> পাস করলে, আপনার <code>\'data\'</code> হ্যান্ডলার এটি দেখার আগেই Node প্রতিটি chunk-কে একটি স্ট্রিং-এ রূপান্তর করতে বলে।</p>'),

      callout('note', '<p>সাধারণ অ্যাপ্লিকেশন কোডে আপনি খুব একটা সরাসরি Buffer তৈরি করবেন না — বেশিরভাগ সময় সেগুলো আপনার কাছে ইতিমধ্যে হাতে দেওয়া অবস্থায় আসে, একটি ফাইল read, একটি নেটওয়ার্ক রেসপন্স, অথবা একটি স্ট্রিমের <code>\'data\'</code> ইভেন্ট থেকে। এগুলো কী তা জানাটাই গুরুত্বপূর্ণ, যাতে আপনার কনসোল আউটপুটে একটি <code>&lt;Buffer ...&gt;</code> দেখা গেলে সেটি রহস্যময় মনে না হয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'process-and-env',
  sortOrder: 17,
  en: {
    title: 'process & Environment Variables',
    metaTitle: 'Node.js process and Environment Variables | Learn Computer Academy',
    metaDescription: 'Read command-line arguments and environment variables with the global process object, and keep secrets like API keys out of your source code.',
    blocks: [
      p('<p><code>process</code> is a global object, always available with no <code>require()</code> needed, that represents the currently running Node program itself — information about it, and ways to control it.</p>'),

      h(2, 'Command-Line Arguments'),
      p('<p><code>process.argv</code> is an array of everything typed on the command line:</p>'),
      code('bash', 'node app.js hello world'),
      code('javascript', 'console.log(process.argv)\n// [\'/path/to/node\', \'/path/to/app.js\', \'hello\', \'world\']'),
      p('<p>The first two entries are always the path to Node itself and the path to the script — actual arguments start at index 2:</p>'),
      code('javascript', 'const args = process.argv.slice(2)\nconsole.log(args)  // [\'hello\', \'world\']'),

      h(2, 'Environment Variables'),
      p('<p><code>process.env</code> is an object holding <b>environment variables</b> — values set outside the program, by the operating system or whoever launches it, rather than hardcoded in the source:</p>'),
      code('javascript', 'console.log(process.env.HOME)  // e.g. /home/priya\nconsole.log(process.env.NODE_ENV)  // e.g. \'production\', or undefined'),
      code('bash', 'PORT=4000 node app.js'),
      code('javascript', 'const port = process.env.PORT || 3000\nconsole.log(`Using port ${port}`)'),

      h(2, 'Why This Matters: Secrets'),
      p('<p>Database passwords, API keys, and similar secrets should never be written directly into a source file — anyone who can see the code (a teammate, a public repository, an AI code review tool) sees the secret too. Environment variables solve this: the secret lives outside the code, and the code just reads whatever <code>process.env</code> happens to hold at runtime.</p>'),
      code('javascript', 'const apiKey = process.env.API_KEY\nif (!apiKey) {\n  throw new Error(\'API_KEY environment variable is required\')\n}'),
      callout('warning', '<p>A hardcoded secret that gets committed to version control is extremely hard to fully remove — even deleting it later, it stays in the project\'s history forever unless that history is rewritten. Reading it from <code>process.env</code> from the start avoids the problem entirely.</p>', 'Never hardcode a secret'),

      h(2, 'Exiting the Program'),
      p('<p><code>process.exit(code)</code> ends the program immediately. <code>0</code> means success; any other number signals an error to whatever launched the script:</p>'),
      code('javascript', 'if (!apiKey) {\n  console.error(\'Missing API_KEY\')\n  process.exit(1)\n}'),
    ],
  },
  bn: {
    title: 'process আর এনভায়রনমেন্ট ভেরিয়েবল',
    metaTitle: 'Node.js process আর এনভায়রনমেন্ট ভেরিয়েবল | Learn Computer Academy',
    metaDescription: 'গ্লোবাল process অবজেক্ট দিয়ে কমান্ড-লাইন আর্গুমেন্ট আর এনভায়রনমেন্ট ভেরিয়েবল পড়ুন, আর API key-এর মতো সিক্রেট আপনার সোর্স কোডের বাইরে রাখুন।',
    blocks: [
      p('<p><code>process</code> একটি গ্লোবাল অবজেক্ট, কোনো <code>require()</code> ছাড়াই সবসময় উপলব্ধ, যা বর্তমানে চলমান Node প্রোগ্রামটি নিজেকে প্রতিনিধিত্ব করে — এ সম্পর্কে তথ্য, আর এটি নিয়ন্ত্রণ করার উপায়।</p>'),

      h(2, 'কমান্ড-লাইন আর্গুমেন্ট', 'command-line-arguments'),
      p('<p><code>process.argv</code> কমান্ড লাইনে টাইপ করা সবকিছুর একটি অ্যারে:</p>'),
      code('bash', 'node app.js hello world'),
      code('javascript', 'console.log(process.argv)\n// [\'/path/to/node\', \'/path/to/app.js\', \'hello\', \'world\']'),
      p('<p>প্রথম দুটি এন্ট্রি সবসময় Node নিজের পাথ আর স্ক্রিপ্টের পাথ — আসল আর্গুমেন্ট index 2 থেকে শুরু হয়:</p>'),
      code('javascript', 'const args = process.argv.slice(2)\nconsole.log(args)  // [\'hello\', \'world\']'),

      h(2, 'এনভায়রনমেন্ট ভেরিয়েবল', 'environment-variables'),
      p('<p><code>process.env</code> একটি অবজেক্ট যা <b>এনভায়রনমেন্ট ভেরিয়েবল</b> ধরে রাখে — এমন মান যা প্রোগ্রামের বাইরে, অপারেটিং সিস্টেম বা যে এটি চালু করে তার দ্বারা সেট করা, সোর্সে হার্ডকোড করা নয়:</p>'),
      code('javascript', 'console.log(process.env.HOME)  // যেমন /home/priya\nconsole.log(process.env.NODE_ENV)  // যেমন \'production\', অথবা undefined'),
      code('bash', 'PORT=4000 node app.js'),
      code('javascript', 'const port = process.env.PORT || 3000\nconsole.log(`Using port ${port}`)'),

      h(2, 'এটি কেন গুরুত্বপূর্ণ: সিক্রেট', 'why-this-matters-secrets'),
      p('<p>ডেটাবেস পাসওয়ার্ড, API key, আর একই ধরনের সিক্রেট কখনো সরাসরি একটি সোর্স ফাইলে লেখা উচিত নয় — যে কেউ কোডটি দেখতে পারে (একজন টিমমেট, একটি পাবলিক রিপোজিটরি, একটি AI কোড রিভিউ টুল) সিক্রেটটিও দেখে ফেলে। এনভায়রনমেন্ট ভেরিয়েবল এটি সমাধান করে: সিক্রেটটি কোডের বাইরে থাকে, আর কোড শুধু রানটাইমে <code>process.env</code>-এ যা থাকে তা পড়ে।</p>'),
      code('javascript', 'const apiKey = process.env.API_KEY\nif (!apiKey) {\n  throw new Error(\'API_KEY environment variable is required\')\n}'),
      callout('warning', '<p>ভার্সন কন্ট্রোলে কমিট হয়ে যাওয়া একটি হার্ডকোড করা সিক্রেট পুরোপুরি সরানো অত্যন্ত কঠিন — পরে এটি মুছে ফেললেও, ইতিহাস পুনরায় না লিখলে এটি প্রোজেক্টের ইতিহাসে চিরকাল থেকে যায়। শুরু থেকেই <code>process.env</code> থেকে এটি পড়া সমস্যাটি সম্পূর্ণভাবে এড়িয়ে যায়।</p>', 'কখনো একটি সিক্রেট হার্ডকোড করবেন না'),

      h(2, 'প্রোগ্রাম থেকে বের হওয়া', 'exiting-the-program'),
      p('<p><code>process.exit(code)</code> প্রোগ্রামটি সাথে সাথে শেষ করে দেয়। <code>0</code> মানে সফল; অন্য যেকোনো সংখ্যা স্ক্রিপ্টটি যা চালু করেছে তাকে একটি error সংকেত দেয়:</p>'),
      code('javascript', 'if (!apiKey) {\n  console.error(\'Missing API_KEY\')\n  process.exit(1)\n}'),
    ],
  },
})

lessons.push({
  slug: 'error-handling',
  sortOrder: 18,
  en: {
    title: 'Error Handling in Node.js',
    metaTitle: 'Error Handling in Node.js | Learn Computer Academy',
    metaDescription: 'Handle errors in synchronous code, callbacks, and promises correctly in Node.js, and prevent one unhandled error from crashing the whole server.',
    blocks: [
      p('<p>You\'ve already handled errors throughout this course — checking <code>err</code> in a callback, wrapping <code>await</code> in <code>try</code>/<code>catch</code>. This lesson pulls those together and covers the one Node-specific consequence of getting it wrong: an unhandled error can bring down the <i>entire</i> server, not just the one request that caused it.</p>'),

      h(2, 'Synchronous Errors'),
      code('javascript', 'try {\n  const data = JSON.parse(\'not valid json\')\n} catch (err) {\n  console.error(\'Failed to parse:\', err.message)\n}'),
      p('<p>Ordinary <code>try</code>/<code>catch</code> — nothing Node-specific here, this works the same as any other JavaScript.</p>'),

      h(2, 'Callback Errors — Always Check err'),
      p('<p>An error in a callback-style function doesn\'t throw — it arrives as the callback\'s first argument, and <code>try</code>/<code>catch</code> around the call does nothing to catch it:</p>'),
      code('javascript', 'fs.readFile(\'missing.txt\', \'utf8\', (err, data) => {\n  if (err) {\n    console.error(\'Read failed:\', err.message)\n    return  // stop here — data is undefined\n  }\n  console.log(data)\n})'),

      h(2, 'Promise and async/await Errors'),
      code('javascript', 'async function loadConfig() {\n  try {\n    const data = await fs.readFile(\'config.json\', \'utf8\')\n    return JSON.parse(data)\n  } catch (err) {\n    console.error(\'Failed to load config:\', err.message)\n    return null\n  }\n}'),

      h(2, 'Why an Unhandled Error Is Worse in Node'),
      p('<p>A single Node process is usually handling many requests from many different visitors at once. An error that escapes every <code>try</code>/<code>catch</code> — thrown but never caught — crashes the <b>entire process</b>, which means every visitor currently being served loses their connection, not just the one whose request triggered the error.</p>'),

      code('javascript', 'const server = http.createServer((req, res) => {\n  try {\n    const result = riskyOperation(req)\n    res.end(result)\n  } catch (err) {\n    console.error(err)\n    res.writeHead(500)\n    res.end(\'Internal Server Error\')\n  }\n})'),
      p('<p>Wrapping request handling in <code>try</code>/<code>catch</code> like this is what keeps one bad request from taking the whole server down — it turns a process crash into a single failed response.</p>'),

      callout('warning', '<p>A common real-world gap: a request handler wraps its own logic in <code>try</code>/<code>catch</code>, but calls an <code>async</code> function inside it without <code>await</code>ing it. If that function later rejects, the rejection happens outside the <code>try</code> block entirely and goes unhandled. Always <code>await</code> an async call you want a surrounding <code>try</code>/<code>catch</code> to actually catch.</p>', 'A gotcha worth watching for'),
    ],
  },
  bn: {
    title: 'Node.js-এ Error হ্যান্ডলিং',
    metaTitle: 'Node.js-এ Error হ্যান্ডলিং | Learn Computer Academy',
    metaDescription: 'Node.js-এ synchronous কোড, callback, আর promise-এ সঠিকভাবে error হ্যান্ডেল করুন, আর একটি unhandled error পুরো সার্ভার ক্র্যাশ করা থেকে ঠেকান।',
    blocks: [
      p('<p>এই কোর্স জুড়ে আপনি ইতিমধ্যে error হ্যান্ডেল করেছেন — একটি callback-এ <code>err</code> চেক করা, <code>try</code>/<code>catch</code>-এ <code>await</code> মোড়ানো। এই পাঠটি সেগুলো একত্র করে আর ভুল করলে Node-নির্দিষ্ট একটি পরিণতি কভার করে: একটি unhandled error শুধু যে রিকোয়েস্টটি এটি ঘটিয়েছে তা নয়, <i>পুরো</i> সার্ভারকে নামিয়ে দিতে পারে।</p>'),

      h(2, 'Synchronous Error', 'synchronous-errors'),
      code('javascript', 'try {\n  const data = JSON.parse(\'not valid json\')\n} catch (err) {\n  console.error(\'Failed to parse:\', err.message)\n}'),
      p('<p>সাধারণ <code>try</code>/<code>catch</code> — এখানে Node-নির্দিষ্ট কিছু নেই, এটি অন্য যেকোনো JavaScript-এর মতোই কাজ করে।</p>'),

      h(2, 'Callback Error — সবসময় err চেক করুন', 'callback-errors-always-check-err'),
      p('<p>একটি callback-স্টাইল ফাংশনে একটি error throw হয় না — এটি callback-এর প্রথম আর্গুমেন্ট হিসেবে আসে, আর কলের চারপাশে <code>try</code>/<code>catch</code> এটি ধরার জন্য কিছুই করে না:</p>'),
      code('javascript', 'fs.readFile(\'missing.txt\', \'utf8\', (err, data) => {\n  if (err) {\n    console.error(\'Read failed:\', err.message)\n    return  // এখানেই থামুন — data undefined\n  }\n  console.log(data)\n})'),

      h(2, 'Promise আর async/await Error', 'promise-and-asyncawait-errors'),
      code('javascript', 'async function loadConfig() {\n  try {\n    const data = await fs.readFile(\'config.json\', \'utf8\')\n    return JSON.parse(data)\n  } catch (err) {\n    console.error(\'Failed to load config:\', err.message)\n    return null\n  }\n}'),

      h(2, 'Node-এ একটি Unhandled Error কেন খারাপ', 'why-an-unhandled-error-is-worse-in-node'),
      p('<p>একটি একক Node প্রসেস সাধারণত একসাথে অনেক ভিন্ন ভিজিটরের অনেক রিকোয়েস্ট সামলায়। প্রতিটি <code>try</code>/<code>catch</code> থেকে পালিয়ে যাওয়া একটি error — throw হয়েছে কিন্তু কখনো ধরা হয়নি — <b>পুরো প্রসেসটি</b> ক্র্যাশ করে, যার অর্থ বর্তমানে সেবা পাওয়া প্রতিটি ভিজিটর তাদের সংযোগ হারায়, শুধু যার রিকোয়েস্ট error-টি ট্রিগার করেছে সে নয়।</p>'),

      code('javascript', 'const server = http.createServer((req, res) => {\n  try {\n    const result = riskyOperation(req)\n    res.end(result)\n  } catch (err) {\n    console.error(err)\n    res.writeHead(500)\n    res.end(\'Internal Server Error\')\n  }\n})'),
      p('<p>রিকোয়েস্ট হ্যান্ডলিং এভাবে <code>try</code>/<code>catch</code>-এ মোড়ানো একটি খারাপ রিকোয়েস্টকে পুরো সার্ভার নামিয়ে দেওয়া থেকে ঠেকায় — এটি একটি প্রসেস ক্র্যাশকে একটি একক ব্যর্থ রেসপন্সে পরিণত করে।</p>'),

      callout('warning', '<p>একটি সাধারণ বাস্তব-জগতের ফাঁক: একটি রিকোয়েস্ট হ্যান্ডলার নিজের লজিক <code>try</code>/<code>catch</code>-এ মোড়ায়, কিন্তু এর ভেতরে <code>await</code> ছাড়া একটি <code>async</code> ফাংশন কল করে। সেই ফাংশনটি পরে reject হলে, rejection-টি <code>try</code> ব্লকের সম্পূর্ণ বাইরে ঘটে আর unhandled থেকে যায়। আপনি চান এমন একটি ঘিরে থাকা <code>try</code>/<code>catch</code> সত্যিই ধরুক এমন একটি async কল সবসময় <code>await</code> করুন।</p>', 'নজরে রাখার মতো একটি ফাঁদ'),
    ],
  },
})

lessons.push({
  slug: 'express-intro',
  sortOrder: 19,
  en: {
    title: 'Introduction to Express.js',
    metaTitle: 'Introduction to Express.js | Learn Computer Academy',
    metaDescription: 'Rebuild the http-module server with Express, and see exactly what a web framework saves you from writing by hand.',
    blocks: [
      p('<p>The <code>if</code>/<code>else</code> chain checking <code>req.url</code> in the http-server lesson works, but it doesn\'t scale — a real site has dozens of routes, needs to read data out of the URL, and has to handle several HTTP methods per route. <b>Express</b> is a package, installed with <code>npm</code>, that handles all of this for you.</p>'),

      h(2, 'Installing It'),
      code('bash', 'npm install express'),

      h(2, 'The Same Server, With Express'),
      p('<p>Compare this to the raw <code>http</code> version from earlier in the course:</p>'),
      code('javascript', 'const express = require(\'express\')\nconst app = express()\n\napp.get(\'/\', (req, res) => {\n  res.send(\'Welcome home\')\n})\n\napp.get(\'/about\', (req, res) => {\n  res.send(\'About this site\')\n})\n\napp.listen(3000, () => {\n  console.log(\'Server running at http://localhost:3000\')\n})'),
      p('<p>No manual <code>req.url</code> checking, no manually calling <code>writeHead()</code> and <code>end()</code> — <code>app.get(path, handler)</code> registers a route directly, and <code>res.send()</code> figures out the right <code>Content-Type</code> on its own.</p>'),

      h(2, 'What Express Actually Is'),
      p('<p>Underneath, Express is still built on the same <code>http</code> module from earlier in this course — it isn\'t a replacement for what you\'ve learned, it\'s a much friendlier layer on top of it. Everything about <code>req</code> and <code>res</code> you already know still applies; Express just adds convenience methods like <code>res.send()</code> and <code>res.json()</code> around them.</p>'),

      h(2, 'A 404 for Anything Else'),
      code('javascript', 'app.use((req, res) => {\n  res.status(404).send(\'Not found\')\n})'),
      p('<p>Placed after every other route, this catches any request that didn\'t match one of them above it — Express checks routes in the order they\'re defined, top to bottom.</p>'),

      callout('note', '<p>Express isn\'t part of Node.js itself — it\'s the single most widely used third-party package for building servers in Node, but it\'s a normal npm dependency like any other, not something built in.</p>'),

      p('<p>The next few lessons build this out properly: multiple routes, middleware, and reading data the browser sends along with a request.</p>'),
    ],
  },
  bn: {
    title: 'Express.js পরিচিতি',
    metaTitle: 'Express.js পরিচিতি | Learn Computer Academy',
    metaDescription: 'Express দিয়ে http-মডিউল সার্ভারটি পুনর্নির্মাণ করুন, আর একটি ওয়েব ফ্রেমওয়ার্ক হাতে লেখা থেকে ঠিক কী বাঁচায় তা দেখুন।',
    blocks: [
      p('<p>http-সার্ভার পাঠে <code>req.url</code> চেক করা <code>if</code>/<code>else</code> চেইনটি কাজ করে, কিন্তু এটি স্কেল করে না — একটি বাস্তব সাইটে ডজনখানেক রুট থাকে, URL থেকে ডেটা পড়ার প্রয়োজন হয়, আর প্রতি রুটে একাধিক HTTP মেথড সামলাতে হয়। <b>Express</b> একটি প্যাকেজ, <code>npm</code> দিয়ে ইনস্টল করা, যা এই সবকিছু আপনার জন্য সামলায়।</p>'),

      h(2, 'এটি ইনস্টল করা', 'installing-it'),
      code('bash', 'npm install express'),

      h(2, 'একই সার্ভার, Express সহ', 'the-same-server-with-express'),
      p('<p>কোর্সের আগের কাঁচা <code>http</code> ভার্সনের সাথে এটি তুলনা করুন:</p>'),
      code('javascript', 'const express = require(\'express\')\nconst app = express()\n\napp.get(\'/\', (req, res) => {\n  res.send(\'Welcome home\')\n})\n\napp.get(\'/about\', (req, res) => {\n  res.send(\'About this site\')\n})\n\napp.listen(3000, () => {\n  console.log(\'Server running at http://localhost:3000\')\n})'),
      p('<p>কোনো ম্যানুয়াল <code>req.url</code> চেকিং নেই, ম্যানুয়ালি <code>writeHead()</code> আর <code>end()</code> কল করা নেই — <code>app.get(path, handler)</code> সরাসরি একটি রুট রেজিস্টার করে, আর <code>res.send()</code> নিজে থেকেই সঠিক <code>Content-Type</code> বের করে নেয়।</p>'),

      h(2, 'Express আসলে কী', 'what-express-actually-is'),
      p('<p>ভেতরে, Express এখনো এই কোর্সের আগের সেই একই <code>http</code> মডিউলের উপর তৈরি — এটি আপনার শেখা জিনিসের প্রতিস্থাপন নয়, এটি এর উপরে অনেক বেশি বন্ধুত্বপূর্ণ একটি স্তর। <code>req</code> আর <code>res</code> সম্পর্কে আপনার ইতিমধ্যে জানা সবকিছু এখনো প্রযোজ্য; Express শুধু এগুলোর চারপাশে <code>res.send()</code> আর <code>res.json()</code>-এর মতো সুবিধাজনক মেথড যোগ করে।</p>'),

      h(2, 'অন্য যেকোনো কিছুর জন্য একটি 404', 'a-404-for-anything-else'),
      code('javascript', 'app.use((req, res) => {\n  res.status(404).send(\'Not found\')\n})'),
      p('<p>প্রতিটি অন্য রুটের পরে বসানো, এটি এমন যেকোনো রিকোয়েস্ট ধরে যা এর উপরের কোনোটির সাথে মেলেনি — Express রুটগুলো যে ক্রমে ডিফাইন করা হয়েছে, উপর থেকে নিচে, সেই ক্রমে চেক করে।</p>'),

      callout('note', '<p>Express Node.js-এর নিজের অংশ নয় — এটি Node-এ সার্ভার তৈরির জন্য সবচেয়ে বেশি ব্যবহৃত থার্ড-পার্টি প্যাকেজ, কিন্তু এটি বিল্ট-ইন কিছু নয়, অন্য যেকোনো একটির মতো একটি সাধারণ npm ডিপেন্ডেন্সি।</p>'),

      p('<p>পরের কয়েকটি পাঠ এটিকে সঠিকভাবে গড়ে তোলে: একাধিক রুট, middleware, আর ব্রাউজার একটি রিকোয়েস্টের সাথে পাঠানো ডেটা পড়া।</p>'),
    ],
  },
})

lessons.push({
  slug: 'express-routing',
  sortOrder: 20,
  en: {
    title: 'Routing with Express',
    metaTitle: 'Routing with Express.js | Learn Computer Academy',
    metaDescription: 'Handle different HTTP methods and read dynamic values out of a URL with Express route parameters and query strings.',
    blocks: [
      p('<p>A <b>route</b> pairs an HTTP method and a URL pattern with a function to run when a request matches both. This lesson covers the pieces beyond the plain <code>app.get()</code> calls from the last lesson.</p>'),

      h(2, 'HTTP Methods'),
      p('<p>Express has a matching method for each HTTP verb:</p>'),
      code('javascript', 'app.get(\'/products\', (req, res) => { /* fetch and list products */ })\napp.post(\'/products\', (req, res) => { /* create a new product */ })\napp.put(\'/products/:id\', (req, res) => { /* replace a product */ })\napp.delete(\'/products/:id\', (req, res) => { /* delete a product */ })'),
      table(
        ['Method', 'Conventionally used for'],
        [
          ['GET', 'Reading data — should never change anything on the server'],
          ['POST', 'Creating something new'],
          ['PUT', 'Replacing an existing item entirely'],
          ['DELETE', 'Removing something'],
        ]
      ),

      h(2, 'Route Parameters'),
      p('<p>A colon in a route path captures part of the URL as a named value:</p>'),
      code('javascript', 'app.get(\'/products/:id\', (req, res) => {\n  res.send(`Product ID: ${req.params.id}`)\n})\n\n// GET /products/42  →  req.params.id is \'42\''),
      p('<p>A route can capture more than one:</p>'),
      code('javascript', 'app.get(\'/users/:userId/orders/:orderId\', (req, res) => {\n  res.send(`User ${req.params.userId}, order ${req.params.orderId}`)\n})'),

      h(2, 'Query Strings'),
      p('<p>Everything after a <code>?</code> in a URL — <code>/search?q=laptop&sort=price</code> — is parsed automatically into <code>req.query</code>:</p>'),
      code('javascript', 'app.get(\'/search\', (req, res) => {\n  res.send(`Searching for: ${req.query.q}, sorted by: ${req.query.sort}`)\n})'),

      callout('note', '<p>Route parameters (<code>/products/:id</code>) identify a specific resource — usually required for the route to make sense at all. Query strings (<code>?sort=price</code>) are optional modifiers — filters, sorting, pagination — that change how the results come back.</p>', 'Params vs. query strings'),

      h(2, 'Grouping Related Routes with Router'),
      p('<p>As routes grow past a handful, <code>express.Router()</code> lets them live in their own file instead of piling up in one:</p>'),
      code('javascript', '// routes/products.js\nconst express = require(\'express\')\nconst router = express.Router()\n\nrouter.get(\'/\', (req, res) => { res.send(\'All products\') })\nrouter.get(\'/:id\', (req, res) => { res.send(`Product ${req.params.id}`) })\n\nmodule.exports = router\n\n// app.js\nconst productsRouter = require(\'./routes/products\')\napp.use(\'/products\', productsRouter)'),
      p('<p>Every path inside <code>routes/products.js</code> is relative to whatever prefix it\'s mounted at — <code>router.get(\'/:id\')</code> here actually matches <code>/products/:id</code>.</p>'),
    ],
  },
  bn: {
    title: 'Express দিয়ে রাউটিং',
    metaTitle: 'Express.js দিয়ে রাউটিং | Learn Computer Academy',
    metaDescription: 'Express route parameter আর query string দিয়ে ভিন্ন ভিন্ন HTTP মেথড সামলান আর একটি URL থেকে ডাইনামিক মান পড়ুন।',
    blocks: [
      p('<p>একটি <b>রুট</b> একটি HTTP মেথড আর একটি URL প্যাটার্নকে একটি রিকোয়েস্ট উভয়ের সাথে মিললে চালানোর জন্য একটি ফাংশনের সাথে জোড়া দেয়। এই পাঠটি আগের পাঠের সাধারণ <code>app.get()</code> কলের বাইরের অংশগুলো কভার করে।</p>'),

      h(2, 'HTTP মেথড', 'http-methods'),
      p('<p>প্রতিটি HTTP verb-এর জন্য Express-এর একটি মিলে যাওয়া মেথড আছে:</p>'),
      code('javascript', 'app.get(\'/products\', (req, res) => { /* পণ্য fetch করুন আর তালিকা করুন */ })\napp.post(\'/products\', (req, res) => { /* একটি নতুন পণ্য তৈরি করুন */ })\napp.put(\'/products/:id\', (req, res) => { /* একটি পণ্য সম্পূর্ণ প্রতিস্থাপন করুন */ })\napp.delete(\'/products/:id\', (req, res) => { /* একটি পণ্য মুছুন */ })'),
      table(
        ['মেথড', 'প্রথাগতভাবে যার জন্য ব্যবহৃত'],
        [
          ['GET', 'ডেটা পড়া — সার্ভারে কখনো কিছু বদলানো উচিত নয়'],
          ['POST', 'নতুন কিছু তৈরি করা'],
          ['PUT', 'একটি বিদ্যমান আইটেম সম্পূর্ণ প্রতিস্থাপন করা'],
          ['DELETE', 'কিছু সরিয়ে ফেলা'],
        ]
      ),

      h(2, 'রুট প্যারামিটার', 'route-parameters'),
      p('<p>একটি রুট পাথে একটি কোলন URL-এর একটি অংশকে একটি নামযুক্ত মান হিসেবে ক্যাপচার করে:</p>'),
      code('javascript', 'app.get(\'/products/:id\', (req, res) => {\n  res.send(`Product ID: ${req.params.id}`)\n})\n\n// GET /products/42  →  req.params.id হলো \'42\''),
      p('<p>একটি রুট একাধিক ক্যাপচার করতে পারে:</p>'),
      code('javascript', 'app.get(\'/users/:userId/orders/:orderId\', (req, res) => {\n  res.send(`User ${req.params.userId}, order ${req.params.orderId}`)\n})'),

      h(2, 'কোয়েরি স্ট্রিং', 'query-strings'),
      p('<p>একটি URL-এ <code>?</code>-এর পরে সবকিছু — <code>/search?q=laptop&sort=price</code> — স্বয়ংক্রিয়ভাবে <code>req.query</code>-তে পার্স হয়:</p>'),
      code('javascript', 'app.get(\'/search\', (req, res) => {\n  res.send(`Searching for: ${req.query.q}, sorted by: ${req.query.sort}`)\n})'),

      callout('note', '<p>রুট প্যারামিটার (<code>/products/:id</code>) একটি নির্দিষ্ট রিসোর্স শনাক্ত করে — রুটটি একেবারেই অর্থপূর্ণ হতে সাধারণত প্রয়োজনীয়। কোয়েরি স্ট্রিং (<code>?sort=price</code>) ঐচ্ছিক পরিবর্তক — ফিল্টার, সর্টিং, পেজিনেশন — যা ফলাফল কীভাবে ফিরে আসে তা বদলায়।</p>', 'Param বনাম কোয়েরি স্ট্রিং'),

      h(2, 'Router দিয়ে সম্পর্কিত রুট গ্রুপ করা', 'grouping-related-routes-with-router'),
      p('<p>রুট মুষ্টিমেয় সংখ্যা ছাড়িয়ে বাড়লে, <code>express.Router()</code> সেগুলোকে একটিতে জমা হওয়ার বদলে নিজস্ব ফাইলে থাকতে দেয়:</p>'),
      code('javascript', '// routes/products.js\nconst express = require(\'express\')\nconst router = express.Router()\n\nrouter.get(\'/\', (req, res) => { res.send(\'All products\') })\nrouter.get(\'/:id\', (req, res) => { res.send(`Product ${req.params.id}`) })\n\nmodule.exports = router\n\n// app.js\nconst productsRouter = require(\'./routes/products\')\napp.use(\'/products\', productsRouter)'),
      p('<p><code>routes/products.js</code>-এর ভেতরের প্রতিটি পাথ এটি যেখানে মাউন্ট করা হয়েছে সেই প্রিফিক্সের সাপেক্ষে — এখানে <code>router.get(\'/:id\')</code> আসলে <code>/products/:id</code>-এর সাথে মেলে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'middleware',
  sortOrder: 21,
  en: {
    title: 'Middleware',
    metaTitle: 'Express.js Middleware | Learn Computer Academy',
    metaDescription: 'Run shared logic — logging, authentication, parsing — in front of every route with Express middleware, instead of repeating it in each handler.',
    blocks: [
      p('<p><b>Middleware</b> is a function that runs <i>before</i> a route\'s handler, with the chance to inspect or modify the request, and then either pass it along or stop it there. It\'s how Express handles anything that needs to happen on more than one route without repeating the code in every handler.</p>'),

      img(
        'docs/img/nodejs/middleware-1',
        'Diagram showing an incoming HTTP request passing through a chain of middleware functions in sequence before reaching the final route handler',
        1024, 768,
        'A request passes through each middleware function in order before reaching its route handler.'
      ),

      h(2, 'The Shape of Middleware'),
      p('<p>A middleware function takes three parameters — <code>req</code>, <code>res</code>, and one more: <code>next</code>.</p>'),
      code('javascript', 'function logger(req, res, next) {\n  console.log(`${req.method} ${req.url}`)\n  next()\n}\n\napp.use(logger)'),
      p('<p>Calling <code>next()</code> passes control to whatever comes after — the next middleware, or the matching route\'s own handler. <b>Forget to call it</b>, and the request just hangs — the browser waits forever for a response that never comes.</p>'),

      h(2, 'Built-in Middleware'),
      p('<p>Express ships with some middleware already included. <code>express.json()</code> is the most common — it reads a JSON request body and makes it available as <code>req.body</code>. The next lesson covers it in full.</p>'),
      code('javascript', 'app.use(express.json())'),

      h(2, 'Applying Middleware to One Route Only'),
      p('<p><code>app.use()</code> applies to every route that follows it. To scope middleware to a single route, pass it as an extra argument:</p>'),
      code('javascript', 'function requireLogin(req, res, next) {\n  if (!req.headers.authorization) {\n    return res.status(401).send(\'Login required\')\n  }\n  next()\n}\n\napp.get(\'/dashboard\', requireLogin, (req, res) => {\n  res.send(\'Welcome to your dashboard\')\n})'),
      p('<p>This is why route handlers themselves take the same <code>(req, res)</code> shape — a route handler is really just the last middleware in the chain, the one that doesn\'t call <code>next()</code> and instead sends the response.</p>'),

      h(2, 'Error-Handling Middleware'),
      p('<p>A middleware function with <b>four</b> parameters instead of three is treated specially by Express — it only runs when something earlier calls <code>next(error)</code> or throws:</p>'),
      code('javascript', 'app.use((err, req, res, next) => {\n  console.error(err.stack)\n  res.status(500).send(\'Something went wrong\')\n})'),
      callout('tip', '<p>This kind of middleware always goes <b>last</b>, after every route — Express matches middleware in the order it\'s registered, so an error handler placed earlier would never see requests that come after it.</p>'),
    ],
  },
  bn: {
    title: 'Middleware',
    metaTitle: 'Express.js Middleware | Learn Computer Academy',
    metaDescription: 'প্রতিটি হ্যান্ডলারে পুনরাবৃত্তি করার বদলে Express middleware দিয়ে প্রতিটি রুটের সামনে শেয়ার করা লজিক — লগিং, অথেন্টিকেশন, পার্সিং — চালান।',
    blocks: [
      p('<p><b>Middleware</b> হলো এমন একটি ফাংশন যা একটি রুটের হ্যান্ডলারের <i>আগে</i> চলে, রিকোয়েস্ট পরীক্ষা বা পরিবর্তন করার সুযোগসহ, তারপর হয় এটি এগিয়ে দেয় নয়তো সেখানেই থামায়। এভাবেই Express এমন কিছু সামলায় যা একাধিক রুটে ঘটা প্রয়োজন, প্রতিটি হ্যান্ডলারে কোড পুনরাবৃত্তি না করে।</p>'),

      img(
        'docs/img/nodejs/middleware-1',
        'ডায়াগ্রাম যেখানে একটি আগত HTTP রিকোয়েস্ট চূড়ান্ত রুট হ্যান্ডলারে পৌঁছানোর আগে ক্রমানুসারে middleware ফাংশনের একটি চেইনের মধ্য দিয়ে যাচ্ছে দেখানো হয়েছে',
        1024, 768,
        'একটি রিকোয়েস্ট এর রুট হ্যান্ডলারে পৌঁছানোর আগে ক্রমানুসারে প্রতিটি middleware ফাংশনের মধ্য দিয়ে যায়।'
      ),

      h(2, 'Middleware-এর আকৃতি', 'the-shape-of-middleware'),
      p('<p>একটি middleware ফাংশন তিনটি প্যারামিটার নেয় — <code>req</code>, <code>res</code>, আর একটি আরও: <code>next</code>।</p>'),
      code('javascript', 'function logger(req, res, next) {\n  console.log(`${req.method} ${req.url}`)\n  next()\n}\n\napp.use(logger)'),
      p('<p><code>next()</code> কল করা এরপর যা আসে তার কাছে নিয়ন্ত্রণ পাস করে — পরের middleware, অথবা মিলে যাওয়া রুটের নিজস্ব হ্যান্ডলার। <b>এটি কল করতে ভুলে গেলে</b>, রিকোয়েস্টটি শুধু ঝুলে থাকে — ব্রাউজার এমন একটি রেসপন্সের জন্য চিরকাল অপেক্ষা করে যা কখনো আসে না।</p>'),

      h(2, 'বিল্ট-ইন Middleware', 'built-in-middleware'),
      p('<p>Express কিছু middleware ইতিমধ্যে অন্তর্ভুক্ত করে নিয়ে আসে। <code>express.json()</code> সবচেয়ে সাধারণ — এটি একটি JSON রিকোয়েস্ট বডি পড়ে আর সেটিকে <code>req.body</code> হিসেবে উপলব্ধ করে। পরের পাঠ এটি সম্পূর্ণভাবে কভার করে।</p>'),
      code('javascript', 'app.use(express.json())'),

      h(2, 'শুধু একটি রুটে Middleware প্রয়োগ করা', 'applying-middleware-to-one-route-only'),
      p('<p><code>app.use()</code> এর পরে আসা প্রতিটি রুটে প্রযোজ্য। একটি একক রুটে middleware সীমাবদ্ধ করতে, এটিকে একটি অতিরিক্ত আর্গুমেন্ট হিসেবে পাস করুন:</p>'),
      code('javascript', 'function requireLogin(req, res, next) {\n  if (!req.headers.authorization) {\n    return res.status(401).send(\'Login required\')\n  }\n  next()\n}\n\napp.get(\'/dashboard\', requireLogin, (req, res) => {\n  res.send(\'Welcome to your dashboard\')\n})'),
      p('<p>এই কারণেই রুট হ্যান্ডলারগুলো নিজেরাই একই <code>(req, res)</code> আকৃতি নেয় — একটি রুট হ্যান্ডলার আসলে চেইনের শেষ middleware মাত্র, যেটি <code>next()</code> কল না করে এর বদলে রেসপন্স পাঠায়।</p>'),

      h(2, 'Error-হ্যান্ডলিং Middleware', 'error-handling-middleware'),
      p('<p>তিনটির বদলে <b>চারটি</b> প্যারামিটারযুক্ত একটি middleware ফাংশনকে Express বিশেষভাবে গণ্য করে — এটি শুধু তখনই চলে যখন আগে কিছু <code>next(error)</code> কল করে অথবা throw করে:</p>'),
      code('javascript', 'app.use((err, req, res, next) => {\n  console.error(err.stack)\n  res.status(500).send(\'Something went wrong\')\n})'),
      callout('tip', '<p>এই ধরনের middleware সবসময় <b>শেষে</b> যায়, প্রতিটি রুটের পরে — Express middleware রেজিস্টার হওয়ার ক্রমে মেলায়, তাই আগে বসানো একটি error হ্যান্ডলার এর পরে আসা রিকোয়েস্ট কখনো দেখতে পাবে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'forms-and-json-bodies',
  sortOrder: 22,
  en: {
    title: 'Handling Forms & JSON Request Bodies',
    metaTitle: 'Handling Forms and JSON in Express | Learn Computer Academy',
    metaDescription: 'Read data a browser sends along with a POST request — both JSON and HTML form submissions — with Express\'s built-in body-parsing middleware.',
    blocks: [
      p('<p>A GET request\'s data lives entirely in the URL — route parameters and the query string, both covered already. A POST request typically carries data in its <b>body</b> instead, which needs its own step to read.</p>'),

      h(2, 'Reading a JSON Body'),
      p('<p><code>express.json()</code>, from the middleware lesson, reads a JSON request body and parses it onto <code>req.body</code>:</p>'),
      code('javascript', 'app.use(express.json())\n\napp.post(\'/products\', (req, res) => {\n  console.log(req.body)  // { name: \'Laptop Stand\', price: 25 }\n  res.status(201).send(`Created: ${req.body.name}`)\n})'),
      p('<p>Without <code>express.json()</code> registered, <code>req.body</code> is simply <code>undefined</code> — this is the single most common reason a POST route "isn\'t receiving any data" while testing.</p>'),

      h(2, 'Reading an HTML Form Submission'),
      p('<p>A plain HTML <code>&lt;form&gt;</code> doesn\'t send JSON by default — it sends <code>application/x-www-form-urlencoded</code> data instead, which needs a different piece of middleware:</p>'),
      code('html', '<form method="POST" action="/contact">\n  <input name="email" type="email">\n  <textarea name="message"></textarea>\n  <button type="submit">Send</button>\n</form>'),
      code('javascript', 'app.use(express.urlencoded({ extended: true }))\n\napp.post(\'/contact\', (req, res) => {\n  console.log(req.body)  // { email: \'...\', message: \'...\' }\n  res.send(\'Thanks for your message\')\n})'),
      p('<p>Registering both <code>express.json()</code> and <code>express.urlencoded()</code> at once is normal — each only activates for requests whose <code>Content-Type</code> header matches what it handles, so they don\'t conflict.</p>'),

      h(2, 'Sending a JSON Response'),
      p('<p><code>res.json()</code> is the response-side equivalent — it sets the correct <code>Content-Type</code> and converts a JavaScript object to a JSON string automatically:</p>'),
      code('javascript', 'app.get(\'/products/:id\', (req, res) => {\n  res.json({ id: req.params.id, name: \'Laptop Stand\', price: 25 })\n})'),

      callout('note', '<p><code>res.send()</code> works for JSON too, technically, but <code>res.json()</code> is more explicit about intent and handles a couple of edge cases (like sending <code>null</code>) more predictably. Use <code>res.json()</code> whenever the response is meant to be data rather than text or HTML.</p>'),
    ],
  },
  bn: {
    title: 'Form আর JSON রিকোয়েস্ট বডি সামলানো',
    metaTitle: 'Express-এ Form আর JSON সামলানো | Learn Computer Academy',
    metaDescription: 'একটি ব্রাউজার একটি POST রিকোয়েস্টের সাথে যে ডেটা পাঠায় তা পড়ুন — JSON আর HTML form সাবমিশন উভয়ই — Express-এর বিল্ট-ইন body-পার্সিং middleware দিয়ে।',
    blocks: [
      p('<p>একটি GET রিকোয়েস্টের ডেটা সম্পূর্ণভাবে URL-এ থাকে — রুট প্যারামিটার আর কোয়েরি স্ট্রিং, দুটোই ইতিমধ্যে কভার করা হয়েছে। একটি POST রিকোয়েস্ট সাধারণত এর <b>বডি</b>-তে ডেটা বহন করে, যা পড়তে নিজস্ব একটি ধাপ প্রয়োজন।</p>'),

      h(2, 'একটি JSON বডি পড়া', 'reading-a-json-body'),
      p('<p>Middleware পাঠের <code>express.json()</code>, একটি JSON রিকোয়েস্ট বডি পড়ে আর সেটি <code>req.body</code>-তে পার্স করে:</p>'),
      code('javascript', 'app.use(express.json())\n\napp.post(\'/products\', (req, res) => {\n  console.log(req.body)  // { name: \'Laptop Stand\', price: 25 }\n  res.status(201).send(`Created: ${req.body.name}`)\n})'),
      p('<p><code>express.json()</code> রেজিস্টার না করলে, <code>req.body</code> শুধু <code>undefined</code> হয় — টেস্ট করার সময় একটি POST রুট "কোনো ডেটা পাচ্ছে না" হওয়ার এটিই সবচেয়ে সাধারণ কারণ।</p>'),

      h(2, 'একটি HTML Form সাবমিশন পড়া', 'reading-an-html-form-submission'),
      p('<p>একটি সাধারণ HTML <code>&lt;form&gt;</code> ডিফল্টভাবে JSON পাঠায় না — এটি এর বদলে <code>application/x-www-form-urlencoded</code> ডেটা পাঠায়, যার জন্য একটি ভিন্ন middleware প্রয়োজন:</p>'),
      code('html', '<form method="POST" action="/contact">\n  <input name="email" type="email">\n  <textarea name="message"></textarea>\n  <button type="submit">Send</button>\n</form>'),
      code('javascript', 'app.use(express.urlencoded({ extended: true }))\n\napp.post(\'/contact\', (req, res) => {\n  console.log(req.body)  // { email: \'...\', message: \'...\' }\n  res.send(\'Thanks for your message\')\n})'),
      p('<p><code>express.json()</code> আর <code>express.urlencoded()</code> দুটোই একসাথে রেজিস্টার করা স্বাভাবিক — প্রতিটি শুধু সেই রিকোয়েস্টের জন্য সক্রিয় হয় যার <code>Content-Type</code> হেডার এটি যা সামলায় তার সাথে মেলে, তাই এগুলো দ্বন্দ্বে যায় না।</p>'),

      h(2, 'একটি JSON রেসপন্স পাঠানো', 'sending-a-json-response'),
      p('<p><code>res.json()</code> রেসপন্স-পাশের সমতুল্য — এটি সঠিক <code>Content-Type</code> সেট করে আর একটি JavaScript অবজেক্টকে স্বয়ংক্রিয়ভাবে একটি JSON স্ট্রিং-এ রূপান্তর করে:</p>'),
      code('javascript', 'app.get(\'/products/:id\', (req, res) => {\n  res.json({ id: req.params.id, name: \'Laptop Stand\', price: 25 })\n})'),

      callout('note', '<p><code>res.send()</code> প্রযুক্তিগতভাবে JSON-এর জন্যও কাজ করে, কিন্তু <code>res.json()</code> উদ্দেশ্য সম্পর্কে বেশি স্পষ্ট আর কয়েকটি edge case (যেমন <code>null</code> পাঠানো) বেশি অনুমানযোগ্যভাবে সামলায়। রেসপন্সটি টেক্সট বা HTML-এর বদলে ডেটা হওয়ার উদ্দেশ্যে হলেই <code>res.json()</code> ব্যবহার করুন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'rest-api',
  sortOrder: 23,
  en: {
    title: 'Building a REST API',
    metaTitle: 'Building a REST API with Node.js | Learn Computer Academy',
    metaDescription: 'Put routing, middleware, and JSON bodies together into a complete REST API with all four CRUD operations.',
    blocks: [
      p('<p>Every piece needed is already covered — routes, HTTP methods, route parameters, JSON bodies. This lesson combines them into a complete, working <b>REST API</b>: a set of URLs that let another program create, read, update, and delete data over HTTP.</p>'),

      h(2, 'What "REST" Means Here'),
      p('<p>REST is a set of conventions, not a library or a piece of code. The core idea: a URL identifies a <i>resource</i> (a product, a user, an order), and the HTTP method says what to <i>do</i> to it. <code>/products/7</code> is always "product number 7" — whether you\'re reading it, replacing it, or deleting it depends on the method, not the URL.</p>'),

      img(
        'docs/img/nodejs/rest-api-1',
        'Diagram showing a client sending GET, POST, PUT, and DELETE requests to the same /products URL pattern, with a Node.js API translating each into an operation on a data store',
        1344, 752,
        'The same URL pattern, four different HTTP methods, four different operations on the same resource.'
      ),

      h(2, 'The Four Operations — CRUD'),
      p('<p>For simplicity, this example keeps products in an in-memory array rather than a real database — the next lesson replaces this with an actual one.</p>'),
      code('javascript', 'const express = require(\'express\')\nconst app = express()\napp.use(express.json())\n\nlet products = [\n  { id: 1, name: \'Laptop Stand\', price: 25 },\n  { id: 2, name: \'Wireless Mouse\', price: 15 },\n]\n\n// READ all\napp.get(\'/products\', (req, res) => {\n  res.json(products)\n})\n\n// READ one\napp.get(\'/products/:id\', (req, res) => {\n  const product = products.find(p => p.id === Number(req.params.id))\n  if (!product) return res.status(404).json({ error: \'Product not found\' })\n  res.json(product)\n})\n\n// CREATE\napp.post(\'/products\', (req, res) => {\n  const newProduct = { id: products.length + 1, ...req.body }\n  products.push(newProduct)\n  res.status(201).json(newProduct)\n})\n\n// UPDATE\napp.put(\'/products/:id\', (req, res) => {\n  const product = products.find(p => p.id === Number(req.params.id))\n  if (!product) return res.status(404).json({ error: \'Product not found\' })\n  Object.assign(product, req.body)\n  res.json(product)\n})\n\n// DELETE\napp.delete(\'/products/:id\', (req, res) => {\n  products = products.filter(p => p.id !== Number(req.params.id))\n  res.status(204).end()\n})\n\napp.listen(3000)'),

      h(2, 'Status Codes That Match the Outcome'),
      table(
        ['Code', 'Meaning', 'Used above for'],
        [
          ['200', 'OK', 'A successful GET or PUT'],
          ['201', 'Created', 'A successful POST that added something new'],
          ['204', 'No Content', 'A successful DELETE — nothing meaningful to send back'],
          ['404', 'Not Found', 'A requested product ID that doesn\'t exist'],
        ]
      ),
      callout('tip', '<p>Always check for a missing resource before working with it, as every handler above does with <code>if (!product)</code>. Skipping that check means a request for a nonexistent ID crashes the handler trying to read a property off <code>undefined</code>, instead of returning a clean 404.</p>'),

      h(2, 'This Is a Foundation, Not the Whole Picture'),
      p('<p>A real API adds more on top of this: validating that <code>req.body</code> actually contains what\'s expected before using it, authentication so not just anyone can delete a product, and — the next lesson\'s topic — a real database instead of an array that resets every time the server restarts.</p>'),
    ],
  },
  bn: {
    title: 'একটি REST API তৈরি করা',
    metaTitle: 'Node.js দিয়ে একটি REST API তৈরি করা | Learn Computer Academy',
    metaDescription: 'সব চারটি CRUD অপারেশনসহ রাউটিং, middleware, আর JSON বডিকে একত্র করে একটি সম্পূর্ণ REST API তৈরি করুন।',
    blocks: [
      p('<p>প্রয়োজনীয় প্রতিটি অংশ ইতিমধ্যে কভার করা হয়েছে — রুট, HTTP মেথড, রুট প্যারামিটার, JSON বডি। এই পাঠ সেগুলোকে একত্র করে একটি সম্পূর্ণ, কার্যকর <b>REST API</b>-তে পরিণত করে: URL-এর একটি সেট যা অন্য একটি প্রোগ্রামকে HTTP-এর মাধ্যমে ডেটা তৈরি, পড়া, আপডেট, আর মুছতে দেয়।</p>'),

      h(2, 'এখানে "REST" মানে কী', 'what-rest-means-here'),
      p('<p>REST একটি প্রথার সেট, কোনো লাইব্রেরি বা কোডের টুকরো নয়। মূল ধারণা: একটি URL একটি <i>রিসোর্স</i> (একটি পণ্য, একজন ব্যবহারকারী, একটি অর্ডার) শনাক্ত করে, আর HTTP মেথড বলে দেয় এতে কী <i>করা হবে</i>। <code>/products/7</code> সবসময় "পণ্য নম্বর 7" — আপনি এটি পড়ছেন, প্রতিস্থাপন করছেন, নাকি মুছছেন তা URL-এর উপর নয়, মেথডের উপর নির্ভর করে।</p>'),

      img(
        'docs/img/nodejs/rest-api-1',
        'ডায়াগ্রাম যেখানে একটি ক্লায়েন্ট একই /products URL প্যাটার্নে GET, POST, PUT, আর DELETE রিকোয়েস্ট পাঠাচ্ছে, একটি Node.js API প্রতিটিকে একটি ডেটা স্টোরে একটি অপারেশনে রূপান্তর করছে',
        1344, 752,
        'একই URL প্যাটার্ন, চারটি ভিন্ন HTTP মেথড, একই রিসোর্সের উপর চারটি ভিন্ন অপারেশন।'
      ),

      h(2, 'চারটি অপারেশন — CRUD', 'the-four-operations-crud'),
      p('<p>সহজ করার জন্য, এই উদাহরণটি একটি বাস্তব ডেটাবেসের বদলে পণ্যগুলো একটি in-memory অ্যারেতে রাখে — পরের পাঠ এটিকে একটি আসল দিয়ে প্রতিস্থাপন করে।</p>'),
      code('javascript', 'const express = require(\'express\')\nconst app = express()\napp.use(express.json())\n\nlet products = [\n  { id: 1, name: \'Laptop Stand\', price: 25 },\n  { id: 2, name: \'Wireless Mouse\', price: 15 },\n]\n\n// সব READ করা\napp.get(\'/products\', (req, res) => {\n  res.json(products)\n})\n\n// একটি READ করা\napp.get(\'/products/:id\', (req, res) => {\n  const product = products.find(p => p.id === Number(req.params.id))\n  if (!product) return res.status(404).json({ error: \'Product not found\' })\n  res.json(product)\n})\n\n// CREATE\napp.post(\'/products\', (req, res) => {\n  const newProduct = { id: products.length + 1, ...req.body }\n  products.push(newProduct)\n  res.status(201).json(newProduct)\n})\n\n// UPDATE\napp.put(\'/products/:id\', (req, res) => {\n  const product = products.find(p => p.id === Number(req.params.id))\n  if (!product) return res.status(404).json({ error: \'Product not found\' })\n  Object.assign(product, req.body)\n  res.json(product)\n})\n\n// DELETE\napp.delete(\'/products/:id\', (req, res) => {\n  products = products.filter(p => p.id !== Number(req.params.id))\n  res.status(204).end()\n})\n\napp.listen(3000)'),

      h(2, 'ফলাফলের সাথে মেলা স্ট্যাটাস কোড', 'status-codes-that-match-the-outcome'),
      table(
        ['কোড', 'অর্থ', 'উপরে যার জন্য ব্যবহৃত'],
        [
          ['200', 'OK', 'একটি সফল GET বা PUT'],
          ['201', 'Created', 'একটি সফল POST যা নতুন কিছু যোগ করেছে'],
          ['204', 'No Content', 'একটি সফল DELETE — ফেরত পাঠানোর মতো অর্থপূর্ণ কিছু নেই'],
          ['404', 'Not Found', 'একটি অনুরোধকৃত পণ্য ID যা নেই'],
        ]
      ),
      callout('tip', '<p>কোনো রিসোর্স নিয়ে কাজ করার আগে সবসময় এটি অনুপস্থিত কিনা চেক করুন, যেমনটি উপরের প্রতিটি হ্যান্ডলার <code>if (!product)</code> দিয়ে করে। সেই চেকটি বাদ দেওয়ার অর্থ একটি অস্তিত্বহীন ID-এর জন্য একটি রিকোয়েস্ট পরিষ্কারভাবে 404 ফেরত দেওয়ার বদলে <code>undefined</code>-এর উপর একটি প্রপার্টি পড়ার চেষ্টা করে হ্যান্ডলারটি ক্র্যাশ করে।</p>'),

      h(2, 'এটি একটি ভিত্তি, পুরো চিত্র নয়', 'this-is-a-foundation-not-the-whole-picture'),
      p('<p>একটি বাস্তব API এর উপরে আরও যোগ করে: <code>req.body</code> ব্যবহারের আগে এতে আসলে প্রত্যাশিত জিনিসই আছে কিনা যাচাই করা, অথেন্টিকেশন যাতে যে কেউ একটি পণ্য মুছতে না পারে, আর — পরের পাঠের বিষয় — সার্ভার প্রতিবার রিস্টার্ট হলে রিসেট হওয়া একটি অ্যারের বদলে একটি বাস্তব ডেটাবেস।</p>'),
    ],
  },
})

lessons.push({
  slug: 'connecting-to-a-database',
  sortOrder: 24,
  en: {
    title: 'Connecting to a Database',
    metaTitle: 'Connecting Node.js to a Database | Learn Computer Academy',
    metaDescription: 'Replace an in-memory array with a real database in a Node.js API, using a driver package and async/await.',
    blocks: [
      p('<p>The REST API two lessons back stores products in a plain array — data that vanishes the instant the server restarts. A real application stores data in a <b>database</b> instead, so it survives restarts and can be shared safely across many requests at once.</p>'),

      img(
        'docs/img/nodejs/database-1',
        'Diagram showing a Node.js application connected to a database, with the application sending SQL queries and the database returning result rows',
        1024, 768,
        'The Node.js app sends queries through a driver package; the database sends rows back.'
      ),

      h(2, 'The Driver Package'),
      p('<p>Node.js has no built-in database support — connecting to one requires an npm package written for that specific database. A couple of common ones:</p>'),
      table(
        ['Database', 'Common driver package'],
        [
          ['PostgreSQL', '<code>pg</code>'],
          ['MySQL', '<code>mysql2</code>'],
          ['SQLite', '<code>better-sqlite3</code>'],
        ]
      ),
      p('<p>The examples below use <code>pg</code> for PostgreSQL — the pattern (connect, then query with placeholders) looks nearly identical with the others, just with a different package name.</p>'),

      h(2, 'Connecting'),
      code('javascript', 'const { Pool } = require(\'pg\')\n\nconst pool = new Pool({\n  host: process.env.DB_HOST,\n  user: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_NAME,\n})'),
      p('<p>Notice every value comes from <code>process.env</code>, not a hardcoded string — exactly the pattern from the earlier lesson on environment variables. A database password is precisely the kind of secret that should never appear directly in a source file.</p>'),

      h(2, 'Querying'),
      p('<p>Every query method returns a promise, so it fits naturally with <code>async</code>/<code>await</code>:</p>'),
      code('javascript', 'app.get(\'/products\', async (req, res) => {\n  try {\n    const result = await pool.query(\'SELECT * FROM products\')\n    res.json(result.rows)\n  } catch (err) {\n    console.error(err)\n    res.status(500).json({ error: \'Database query failed\' })\n  }\n})'),

      h(2, 'Never Build a Query With String Concatenation'),
      p('<p>A value from a request must never be inserted directly into a query string:</p>'),
      code('javascript', '// NEVER do this\nconst id = req.params.id\nawait pool.query(`SELECT * FROM products WHERE id = ${id}`)'),
      p('<p>A visitor who sends a crafted <code>id</code> value instead of a number can use this to run arbitrary SQL against the database — a <b>SQL injection</b> attack. Use a placeholder instead, and pass the value as a separate parameter:</p>'),
      code('javascript', 'const id = req.params.id\nconst result = await pool.query(\'SELECT * FROM products WHERE id = $1\', [id])'),
      p('<p>The driver handles escaping the value safely — this single habit is the difference between a normal query and an exploitable one.</p>'),

      callout('warning', '<p>This lesson only covers connecting Node to a database that already exists. Writing the SQL itself — <code>SELECT</code>, <code>WHERE</code>, joins, and everything else in a query — is covered in full in this site\'s <a href="/sql/">SQL course</a>.</p>', 'Where the SQL syntax itself is taught'),
    ],
  },
  bn: {
    title: 'একটি ডেটাবেসের সাথে সংযুক্ত হওয়া',
    metaTitle: 'Node.js-কে একটি ডেটাবেসের সাথে সংযুক্ত করা | Learn Computer Academy',
    metaDescription: 'একটি ড্রাইভার প্যাকেজ আর async/await ব্যবহার করে একটি Node.js API-তে in-memory অ্যারের বদলে একটি বাস্তব ডেটাবেস ব্যবহার করুন।',
    blocks: [
      p('<p>দুই পাঠ আগের REST API একটি সাধারণ অ্যারেতে পণ্য সংরক্ষণ করে — এমন ডেটা যা সার্ভার রিস্টার্ট হওয়া মাত্রই উধাও হয়ে যায়। একটি বাস্তব অ্যাপ্লিকেশন এর বদলে একটি <b>ডেটাবেসে</b> ডেটা সংরক্ষণ করে, যাতে এটি রিস্টার্টের পরও টিকে থাকে আর একসাথে অনেক রিকোয়েস্ট জুড়ে নিরাপদে শেয়ার করা যায়।</p>'),

      img(
        'docs/img/nodejs/database-1',
        'ডায়াগ্রাম যেখানে একটি Node.js অ্যাপ্লিকেশন একটি ডেটাবেসের সাথে সংযুক্ত দেখানো হয়েছে, অ্যাপ্লিকেশন SQL কোয়েরি পাঠাচ্ছে আর ডেটাবেস ফলাফলের সারি ফেরত দিচ্ছে',
        1024, 768,
        'Node.js অ্যাপটি একটি ড্রাইভার প্যাকেজের মাধ্যমে কোয়েরি পাঠায়; ডেটাবেস সারি ফিরিয়ে দেয়।'
      ),

      h(2, 'ড্রাইভার প্যাকেজ', 'the-driver-package'),
      p('<p>Node.js-এ কোনো বিল্ট-ইন ডেটাবেস সাপোর্ট নেই — একটির সাথে সংযুক্ত হতে সেই নির্দিষ্ট ডেটাবেসের জন্য লেখা একটি npm প্যাকেজ প্রয়োজন। কয়েকটি সাধারণ প্যাকেজ:</p>'),
      table(
        ['ডেটাবেস', 'সাধারণ ড্রাইভার প্যাকেজ'],
        [
          ['PostgreSQL', '<code>pg</code>'],
          ['MySQL', '<code>mysql2</code>'],
          ['SQLite', '<code>better-sqlite3</code>'],
        ]
      ),
      p('<p>নিচের উদাহরণগুলো PostgreSQL-এর জন্য <code>pg</code> ব্যবহার করে — প্যাটার্নটি (সংযুক্ত হওয়া, তারপর placeholder দিয়ে কোয়েরি করা) অন্যগুলোর সাথে প্রায় একই রকম দেখায়, শুধু ভিন্ন একটি প্যাকেজ নামে।</p>'),

      h(2, 'সংযুক্ত হওয়া', 'connecting'),
      code('javascript', 'const { Pool } = require(\'pg\')\n\nconst pool = new Pool({\n  host: process.env.DB_HOST,\n  user: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_NAME,\n})'),
      p('<p>লক্ষ্য করুন প্রতিটি মান একটি হার্ডকোড করা স্ট্রিং থেকে নয়, <code>process.env</code> থেকে আসে — ঠিক এনভায়রনমেন্ট ভেরিয়েবল নিয়ে আগের পাঠের প্যাটার্ন। একটি ডেটাবেস পাসওয়ার্ড ঠিক সেই ধরনের সিক্রেট যা কখনো সরাসরি একটি সোর্স ফাইলে থাকা উচিত নয়।</p>'),

      h(2, 'কোয়েরি করা', 'querying'),
      p('<p>প্রতিটি কোয়েরি মেথড একটি promise ফেরত দেয়, তাই এটি স্বাভাবিকভাবে <code>async</code>/<code>await</code>-এর সাথে খাপ খায়:</p>'),
      code('javascript', 'app.get(\'/products\', async (req, res) => {\n  try {\n    const result = await pool.query(\'SELECT * FROM products\')\n    res.json(result.rows)\n  } catch (err) {\n    console.error(err)\n    res.status(500).json({ error: \'Database query failed\' })\n  }\n})'),

      h(2, 'কখনো স্ট্রিং কনক্যাটেনেশন দিয়ে একটি কোয়েরি তৈরি করবেন না', 'never-build-a-query-with-string-concatenation'),
      p('<p>একটি রিকোয়েস্ট থেকে আসা মান কখনো সরাসরি একটি কোয়েরি স্ট্রিং-এ ঢোকানো উচিত নয়:</p>'),
      code('javascript', '// কখনো এটি করবেন না\nconst id = req.params.id\nawait pool.query(`SELECT * FROM products WHERE id = ${id}`)'),
      p('<p>একজন ভিজিটর যে একটি সংখ্যার বদলে একটি সাজানো <code>id</code> মান পাঠায় সে এটি ব্যবহার করে ডেটাবেসের বিরুদ্ধে যেকোনো SQL চালাতে পারে — একটি <b>SQL injection</b> আক্রমণ। এর বদলে একটি placeholder ব্যবহার করুন, আর মানটি একটি আলাদা প্যারামিটার হিসেবে পাস করুন:</p>'),
      code('javascript', 'const id = req.params.id\nconst result = await pool.query(\'SELECT * FROM products WHERE id = $1\', [id])'),
      p('<p>ড্রাইভারটি মানটি নিরাপদে escape করা সামলায় — এই একটি অভ্যাসই একটি সাধারণ কোয়েরি আর একটি exploitable কোয়েরির মধ্যে পার্থক্য তৈরি করে।</p>'),

      callout('warning', '<p>এই পাঠটি শুধু Node-কে ইতিমধ্যে বিদ্যমান একটি ডেটাবেসের সাথে সংযুক্ত করা কভার করে। SQL নিজেই লেখা — <code>SELECT</code>, <code>WHERE</code>, join, আর একটি কোয়েরির বাকি সবকিছু — এই সাইটের <a href="/bn/sql/">SQL কোর্সে</a> সম্পূর্ণভাবে কভার করা হয়েছে।</p>', 'যেখানে SQL সিনট্যাক্স নিজেই শেখানো হয়'),
    ],
  },
})

lessons.push({
  slug: 'debugging',
  sortOrder: 25,
  en: {
    title: 'Debugging Node.js Applications',
    metaTitle: 'Debugging Node.js Applications | Learn Computer Academy',
    metaDescription: 'Go beyond console.log to find bugs in a Node.js program, using the built-in inspector, Node\'s own error output, and a few common failure patterns.',
    blocks: [
      p('<p><code>console.log()</code> has gotten you this far in the course, and it\'s a legitimate tool — not just a beginner\'s crutch. This lesson adds a few more, for the situations where scattering <code>console.log()</code> calls stops being enough.</p>'),

      h(2, 'Reading a Stack Trace'),
      p('<p>When Node crashes on an uncaught error, it prints a <b>stack trace</b> — not noise to skip past, but a map of exactly where things went wrong:</p>'),
      code('bash', 'TypeError: Cannot read properties of undefined (reading \'name\')\n    at getProductName (/app/products.js:12:20)\n    at /app/app.js:8:15'),
      p('<p>Read it top to bottom: the error type and message first, then the exact file and line where it happened, then every function call that led there. <code>products.js:12:20</code> means line 12, character 20 — that\'s where to look first, not the last line of the trace.</p>'),

      h(2, 'The Built-in Inspector'),
      p('<p>Node ships with a real debugger — no extra package needed. Run a script with <code>--inspect</code>:</p>'),
      code('bash', 'node --inspect app.js'),
      p('<p>Then open Chrome and go to <code>chrome://inspect</code> — it connects to the running Node process, and gives you real breakpoints, the ability to step through code line by line, and inspect variables at each point, in the same DevTools you\'d already use to debug a webpage.</p>'),

      h(2, 'Adding a Breakpoint From Code'),
      p('<p>The <code>debugger</code> keyword pauses execution right there, if a debugger is attached:</p>'),
      code('javascript', 'function calculateTotal(items) {\n  debugger  // execution pauses here when run with --inspect\n  return items.reduce((sum, item) => sum + item.price, 0)\n}'),

      h(2, 'A Few Common Node Bugs'),
      table(
        ['Symptom', 'Likely cause'],
        [
          ['<code>req.body</code> is <code>undefined</code>', '<code>express.json()</code> (or <code>urlencoded()</code>) isn\'t registered'],
          ['A request just hangs forever', 'A middleware function never called <code>next()</code>, or a route handler never called <code>res.end()</code>/<code>res.send()</code>'],
          ['"Cannot find module"', 'A typo in a <code>require()</code> path, or the package genuinely isn\'t installed — check <code>node_modules</code>'],
          ['The whole server crashed from one bad request', 'An error inside a route handler wasn\'t wrapped in <code>try</code>/<code>catch</code> — see the error-handling lesson'],
        ]
      ),

      callout('tip', '<p>When a bug isn\'t obvious, narrow it before reaching for the debugger: comment out code until the error disappears, then add it back piece by piece. It\'s slower than intuition but it always finds the actual line, and it works on bugs no amount of staring at the code solves.</p>'),
    ],
  },
  bn: {
    title: 'Node.js অ্যাপ্লিকেশন ডিবাগ করা',
    metaTitle: 'Node.js অ্যাপ্লিকেশন ডিবাগ করা | Learn Computer Academy',
    metaDescription: 'বিল্ট-ইন inspector, Node-এর নিজস্ব error আউটপুট, আর কয়েকটি সাধারণ ব্যর্থতার প্যাটার্ন ব্যবহার করে console.log-এর বাইরে গিয়ে একটি Node.js প্রোগ্রামে বাগ খুঁজুন।',
    blocks: [
      p('<p><code>console.log()</code> কোর্সে এখন পর্যন্ত আপনাকে এগিয়ে নিয়ে এসেছে, আর এটি একটি বৈধ টুল — শুধু একজন শিক্ষানবিসের ভরসা নয়। এই পাঠ আরও কয়েকটি যোগ করে, যেসব পরিস্থিতিতে <code>console.log()</code> কল ছড়িয়ে দেওয়া আর যথেষ্ট হয় না।</p>'),

      h(2, 'একটি Stack Trace পড়া', 'reading-a-stack-trace'),
      p('<p>Node একটি ধরা-না-পড়া error-এ ক্র্যাশ করলে, এটি একটি <b>stack trace</b> প্রিন্ট করে — এড়িয়ে যাওয়ার মতো শব্দ নয়, বরং জিনিসগুলো ঠিক কোথায় ভুল হয়েছে তার একটি মানচিত্র:</p>'),
      code('bash', 'TypeError: Cannot read properties of undefined (reading \'name\')\n    at getProductName (/app/products.js:12:20)\n    at /app/app.js:8:15'),
      p('<p>এটি উপর থেকে নিচে পড়ুন: প্রথমে error টাইপ আর মেসেজ, তারপর এটি ঠিক যে ফাইল আর লাইনে ঘটেছে, তারপর সেখানে নিয়ে যাওয়া প্রতিটি ফাংশন কল। <code>products.js:12:20</code> মানে লাইন 12, ক্যারেক্টার 20 — এটিই প্রথমে দেখার জায়গা, ট্রেসের শেষ লাইন নয়।</p>'),

      h(2, 'বিল্ট-ইন Inspector', 'the-built-in-inspector'),
      p('<p>Node একটি বাস্তব debugger নিয়ে আসে — কোনো অতিরিক্ত প্যাকেজের প্রয়োজন নেই। <code>--inspect</code> দিয়ে একটি স্ক্রিপ্ট চালান:</p>'),
      code('bash', 'node --inspect app.js'),
      p('<p>তারপর Chrome খুলুন আর <code>chrome://inspect</code>-এ যান — এটি চলমান Node প্রসেসের সাথে সংযুক্ত হয়, আর আপনাকে বাস্তব breakpoint, লাইন বাই লাইন কোডের মধ্য দিয়ে যাওয়ার ক্ষমতা, আর প্রতিটি পয়েন্টে ভেরিয়েবল পরীক্ষা করার সুযোগ দেয়, ঠিক সেই একই DevTools-এ যা আপনি একটি ওয়েবপেজ ডিবাগ করতে ইতিমধ্যে ব্যবহার করেছেন।</p>'),

      h(2, 'কোড থেকে একটি Breakpoint যোগ করা', 'adding-a-breakpoint-from-code'),
      p('<p>একটি debugger সংযুক্ত থাকলে, <code>debugger</code> কীওয়ার্ড ঠিক সেখানে এক্সিকিউশন বিরতি দেয়:</p>'),
      code('javascript', 'function calculateTotal(items) {\n  debugger  // --inspect দিয়ে চালানোর সময় এক্সিকিউশন এখানে বিরতি নেয়\n  return items.reduce((sum, item) => sum + item.price, 0)\n}'),

      h(2, 'কয়েকটি সাধারণ Node বাগ', 'a-few-common-node-bugs'),
      table(
        ['লক্ষণ', 'সম্ভাব্য কারণ'],
        [
          ['<code>req.body</code> হলো <code>undefined</code>', '<code>express.json()</code> (অথবা <code>urlencoded()</code>) রেজিস্টার করা নেই'],
          ['একটি রিকোয়েস্ট শুধু চিরকাল ঝুলে থাকে', 'একটি middleware ফাংশন কখনো <code>next()</code> কল করেনি, অথবা একটি রুট হ্যান্ডলার কখনো <code>res.end()</code>/<code>res.send()</code> কল করেনি'],
          ['"Cannot find module"', 'একটি <code>require()</code> পাথে একটি টাইপো, অথবা প্যাকেজটি আসলেই ইনস্টল করা নেই — <code>node_modules</code> চেক করুন'],
          ['একটি খারাপ রিকোয়েস্ট থেকে পুরো সার্ভার ক্র্যাশ হয়েছে', 'একটি রুট হ্যান্ডলারের ভেতরের একটি error <code>try</code>/<code>catch</code>-এ মোড়ানো ছিল না — error-হ্যান্ডলিং পাঠ দেখুন'],
        ]
      ),

      callout('tip', '<p>একটি বাগ স্পষ্ট না হলে, debugger-এর দিকে যাওয়ার আগে এটি সংকুচিত করুন: error অদৃশ্য না হওয়া পর্যন্ত কোড কমেন্ট আউট করুন, তারপর একে একে এটি ফিরিয়ে আনুন। এটি অন্তর্দৃষ্টির চেয়ে ধীর কিন্তু এটি সবসময় আসল লাইনটি খুঁজে পায়, আর এটি এমন বাগেও কাজ করে যা কোডের দিকে যতই তাকান না কেন সমাধান হয় না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'where-this-leaves-you',
  sortOrder: 26,
  en: {
    title: 'Where This Leaves You',
    metaTitle: 'Node.js — Where This Leaves You | Learn Computer Academy',
    metaDescription: 'A recap of the Node.js course, and the practical next step: putting a routing, middleware, and database knowledge together into one real project.',
    blocks: [
      p('<p>This course took JavaScript out of the browser entirely and put it on the server: reading and writing files, listening for network requests, and eventually a complete REST API talking to a real database. Here\'s how the pieces fit together.</p>'),

      h(2, 'The Shape of What You Learned'),
      p('<p>Everything in this course builds toward one idea: a server that receives a request and decides how to respond. <code>http</code> showed the raw mechanism; Express made it practical with routing and middleware; the event loop explained why Node can do this for many visitors at once without slowing down; and streams, buffers, and the file system module gave you the tools to move data around efficiently while it happens.</p>'),

      h(2, 'How This Connects to the Rest of the Site'),
      table(
        ['Course', 'How it connects'],
        [
          ['<a href="/javascript/">JavaScript</a>', 'Every function, array method, and async pattern from that course works identically in Node — nothing about the language itself changes'],
          ['<a href="/sql/">SQL</a>', 'The full syntax for the queries this course\'s <code>pool.query()</code> calls send'],
          ['<a href="/react/">React</a>', 'A React frontend is exactly the kind of client that talks to the REST API built in this course'],
        ]
      ),

      h(2, 'A Practical Next Step'),
      p('<p>The most useful thing to do with everything in this course is combine it into one small, real project — a to-do list API, a simple blog backend, a guestbook — with actual routes, a real database, and a frontend (even a simple HTML page) that talks to it. Reading about routing and building it yourself surface completely different problems; the second kind is where this actually sinks in.</p>'),

      callout('note', '<p>Node.js has a large ecosystem beyond what fits in an introductory course — testing frameworks, real-time communication with WebSockets, authentication libraries, deployment platforms. Everything here is the foundation those all sit on top of; comfortable with this, the rest is far more approachable than it looks from the outside.</p>'),
    ],
  },
  bn: {
    title: 'এখান থেকে আপনি কোথায়',
    metaTitle: 'Node.js — এখান থেকে আপনি কোথায় | Learn Computer Academy',
    metaDescription: 'Node.js কোর্সের একটি সারসংক্ষেপ, আর ব্যবহারিক পরের ধাপ: রাউটিং, middleware, আর ডেটাবেসের জ্ঞানকে একটি বাস্তব প্রোজেক্টে একত্র করা।',
    blocks: [
      p('<p>এই কোর্সটি JavaScript-কে ব্রাউজার থেকে সম্পূর্ণভাবে বের করে সার্ভারে নিয়ে গেছে: ফাইল পড়া আর লেখা, নেটওয়ার্ক রিকোয়েস্টের জন্য অপেক্ষা করা, আর শেষে একটি বাস্তব ডেটাবেসের সাথে কথা বলা একটি সম্পূর্ণ REST API। এখানে অংশগুলো কীভাবে একসাথে ফিট করে তা দেখুন।</p>'),

      h(2, 'আপনার শেখা জিনিসের আকৃতি', 'the-shape-of-what-you-learned'),
      p('<p>এই কোর্সের সবকিছু একটি ধারণার দিকে গড়ে ওঠে: একটি সার্ভার যা একটি রিকোয়েস্ট পায় আর কীভাবে সাড়া দেবে তা ঠিক করে। <code>http</code> কাঁচা মেকানিজম দেখিয়েছে; Express রাউটিং আর middleware দিয়ে এটিকে ব্যবহারিক করেছে; ইভেন্ট লুপ ব্যাখ্যা করেছে কেন Node একসাথে অনেক ভিজিটরের জন্য ধীর না হয়ে এটি করতে পারে; আর স্ট্রিম, বাফার, আর ফাইল সিস্টেম মডিউল আপনাকে ডেটা ঘটার সময় দক্ষভাবে সরানোর টুল দিয়েছে।</p>'),

      h(2, 'এটি সাইটের বাকি অংশের সাথে কীভাবে সংযুক্ত', 'how-this-connects-to-the-rest-of-the-site'),
      table(
        ['কোর্স', 'এটি কীভাবে সংযুক্ত'],
        [
          ['<a href="/bn/javascript/">JavaScript</a>', 'সেই কোর্সের প্রতিটি ফাংশন, অ্যারে মেথড, আর async প্যাটার্ন Node-এ একইভাবে কাজ করে — ভাষাটি সম্পর্কে নিজেই কিছু বদলায় না'],
          ['<a href="/bn/sql/">SQL</a>', 'এই কোর্সের <code>pool.query()</code> কলগুলো যে কোয়েরি পাঠায় তার সম্পূর্ণ সিনট্যাক্স'],
          ['<a href="/bn/react/">React</a>', 'একটি React ফ্রন্টএন্ড ঠিক সেই ধরনের ক্লায়েন্ট যা এই কোর্সে তৈরি করা REST API-এর সাথে কথা বলে'],
        ]
      ),

      h(2, 'একটি ব্যবহারিক পরের ধাপ', 'a-practical-next-step'),
      p('<p>এই কোর্সের সবকিছু দিয়ে সবচেয়ে কাজের জিনিস হলো এগুলোকে একটি ছোট, বাস্তব প্রোজেক্টে একত্র করা — একটি to-do list API, একটি সাধারণ ব্লগ ব্যাকএন্ড, একটি গেস্টবুক — আসল রুট, একটি বাস্তব ডেটাবেস, আর এর সাথে কথা বলা একটি ফ্রন্টএন্ড (এমনকি একটি সাধারণ HTML পেজ) সহ। রাউটিং সম্পর্কে পড়া আর নিজে এটি তৈরি করা সম্পূর্ণ ভিন্ন সমস্যা সামনে আনে; দ্বিতীয় ধরনটিই যেখানে এটি আসলে বসে যায়।</p>'),

      callout('note', '<p>একটি ভূমিকামূলক কোর্সে যা ধরে তার বাইরে Node.js-এর একটি বড় ইকোসিস্টেম আছে — টেস্টিং ফ্রেমওয়ার্ক, WebSocket দিয়ে রিয়েল-টাইম যোগাযোগ, অথেন্টিকেশন লাইব্রেরি, ডিপ্লয়মেন্ট প্ল্যাটফর্ম। এখানে সবকিছুই সেই ভিত্তি যার উপর সেগুলো সব বসে; এটির সাথে স্বাচ্ছন্দ্য থাকলে, বাকিটা বাইরে থেকে যতটা মনে হয় তার চেয়ে অনেক বেশি সহজলভ্য।</p>'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'nodejs').single()
  if (catErr || !category) {
    console.error('Category "nodejs" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] nodejs/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] nodejs/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `nodejs/${lesson.slug}`
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
