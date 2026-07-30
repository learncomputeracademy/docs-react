#!/usr/bin/env node
// Rebuilds the "React" category — 25 lessons, per the outline approved with
// the site owner 2026-07-30 (docs/CONTENT-PIPELINE.md). Third and last of
// the PHP -> Python -> React run (D-61/D-62).
//
// Unlike PHP/Python (new categories), `react` already existed with 2
// Jekyll-era stub docs: `introduction` (a real but informal lesson) and
// `syllabus` (a "Chapter 1, Chapter 2..." outline whose chapters mostly had
// no real content behind them). Per the site owner's explicit decision,
// this is a full rebuild, not an add-alongside:
//   - `react/introduction` is overwritten in place by lesson 1 below (same
//     path, so the select-then-update logic in main() naturally replaces
//     it — no separate delete needed).
//   - `react/syllabus` is soft-deleted explicitly in main(), since by the
//     time this script finishes its content is fully superseded by real
//     lessons 1-25. This is different from the Computer Basics rebuild,
//     where the old monolith was deliberately left alongside until every
//     replacement lesson existed across several sessions — this run
//     replaces the whole category in one script, so there's no partial
//     state to protect.
//
// Builds on the existing `html`, `css`, and `javascript` categories —
// React assumes real JS fluency, not just "you've seen a script tag."
//
// Original content — written fresh for this site (CONTENT-PIPELINE.md §3:
// never copied from react.dev, W3Schools, GeeksforGeeks, Wikipedia, etc).
// Links to the official docs (react.dev) where a full reference beats
// reproducing one here, per the site owner's own instruction.
//
// Run incrementally as lessons are written — idempotent, safe to re-run;
// upserts on `path` / `doc_id,locale`.
//
// Usage: node scripts/create-react-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Block builders ──────────────────────────────────────────────────────
// Field name is `code`, per lib/types.ts's Block type — got this wrong in
// the PHP script (D-61), correct here from line one.

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
    title: 'Introduction to React',
    metaTitle: 'Introduction to React | Learn Computer Academy',
    metaDescription: 'What React is, the problem it solves compared to plain JavaScript DOM manipulation, and how it thinks about building a user interface.',
    blocks: [
      p('<p><b>React</b> is a JavaScript library for building user interfaces. Unlike PHP or Python, it isn\'t a general-purpose language — it\'s a tool that runs on top of the JavaScript you already know, specifically for building the interactive parts of a webpage.</p>'),

      h(2, 'The Problem React Solves'),
      p('<p>In the <a href="/javascript/dom/">JavaScript DOM lesson</a>, you learned to update a page by directly finding elements and changing them — <code>document.querySelector(...).textContent = ...</code>. That works fine for a small change, but as an interface grows — a shopping cart, a live comment feed, a dashboard — manually tracking every element that needs to update, and exactly when, becomes genuinely hard to keep correct.</p>'),
      p('<p>React takes a different approach: you describe <b>what the interface should look like for a given set of data</b>, and React figures out how to update the actual page to match, whenever that data changes. You stop writing step-by-step DOM instructions and start writing a description of the end result — this shift is usually called moving from <b>imperative</b> to <b>declarative</b> UI code.</p>'),

      h(2, 'Components: The Core Idea'),
      p('<p>A React interface is built from <b>components</b> — small, self-contained, reusable pieces, each responsible for one part of the page. A product card, a navigation bar, a comment, a button — each becomes its own component, built once and reused wherever it\'s needed, each with its own data plugged in.</p>'),

      img(
        'docs/img/react/introduction-1',
        'Isometric diagram showing a webpage layout broken down into a tree of smaller labeled component blocks, illustrating how a full interface is assembled from smaller reusable pieces',
        1024, 768,
        'A React interface is a tree of components, each a small, reusable, self-contained piece.'
      ),

      h(2, 'Why It Became So Widely Used'),
      p('<p>React was built at Facebook and open-sourced in 2013, and has since become one of the most widely used tools for building web interfaces — which matters practically the same way PHP\'s popularity does: React skills transfer directly to a huge number of real jobs and existing codebases, and the same core ideas carry over into React Native for building mobile apps.</p>'),

      callout('note', '<p>This section assumes real comfort with JavaScript — functions, arrays, objects, and especially <a href="/javascript/es6-and-modern-features/">ES6+ features</a> like arrow functions and destructuring, plus <a href="/javascript/promises-and-async/">promises and async/await</a> for the data-fetching lessons later on. If any of that feels shaky, it\'s worth a detour through the <a href="/javascript/">JavaScript section</a> first — React leans on all of it constantly.</p>', 'Coming from JavaScript'),

      p('<p>The next lesson gets a real React project running on your machine, so every example from here on is something you can try yourself.</p>'),
    ],
  },
  bn: {
    title: 'React পরিচিতি',
    metaTitle: 'React পরিচিতি | Learn Computer Academy',
    metaDescription: 'React আসলে কী, প্লেইন JavaScript DOM ম্যানিপুলেশনের তুলনায় এটি যে সমস্যার সমাধান করে, আর এটি একটি ইউজার ইন্টারফেস বানানো নিয়ে কীভাবে চিন্তা করে।',
    blocks: [
      p('<p><b>React</b> ইউজার ইন্টারফেস বানানোর একটি JavaScript লাইব্রেরি। PHP বা Python-এর থেকে আলাদা, এটি একটি জেনারেল-পারপাস ভাষা নয় — এটি এমন একটি টুল যা আপনার ইতিমধ্যে জানা JavaScript-এর উপর চলে, বিশেষভাবে একটি ওয়েবপেজের ইন্টারঅ্যাক্টিভ অংশগুলো বানানোর জন্য।</p>'),

      h(2, 'React যে সমস্যা সমাধান করে', 'the-problem-react-solves'),
      p('<p><a href="/bn/javascript/dom/">JavaScript DOM পাঠে</a>, আপনি সরাসরি এলিমেন্ট খুঁজে বদলে একটি পাতা আপডেট করতে শিখেছেন — <code>document.querySelector(...).textContent = ...</code>। এটি একটি ছোট পরিবর্তনের জন্য ঠিকঠাক কাজ করে, কিন্তু একটি ইন্টারফেস বড় হলে — একটি শপিং কার্ট, একটি লাইভ কমেন্ট ফিড, একটি ড্যাশবোর্ড — কোন এলিমেন্ট কখন আপডেট করতে হবে তা হাতে হাতে ট্র্যাক করা সঠিকভাবে বজায় রাখা সত্যিকারভাবে কঠিন হয়ে ওঠে।</p>'),
      p('<p>React একটি ভিন্ন পদ্ধতি নেয়: আপনি বর্ণনা করেন <b>একটি নির্দিষ্ট ডেটার জন্য ইন্টারফেসটি কেমন দেখতে হওয়া উচিত</b>, আর সেই ডেটা যখনই বদলায় তখন React বের করে নেয় আসল পাতাটি কীভাবে সেটার সাথে মিলিয়ে আপডেট করতে হবে। আপনি ধাপে ধাপে DOM নির্দেশনা লেখা বন্ধ করে চূড়ান্ত ফলাফলের একটি বর্ণনা লেখা শুরু করেন — এই পরিবর্তনকে সাধারণত <b>imperative</b> থেকে <b>declarative</b> UI কোডে যাওয়া বলা হয়।</p>'),

      h(2, 'কম্পোনেন্ট: মূল ধারণা', 'components-the-core-idea'),
      p('<p>একটি React ইন্টারফেস <b>কম্পোনেন্ট</b> দিয়ে তৈরি — ছোট, স্বয়ংসম্পূর্ণ, পুনঃব্যবহারযোগ্য অংশ, প্রতিটি পাতার একটি অংশের জন্য দায়ী। একটি প্রোডাক্ট কার্ড, একটি নেভিগেশন বার, একটি কমেন্ট, একটি বাটন — প্রতিটি নিজের একটি কম্পোনেন্ট হয়ে ওঠে, একবার বানানো আর যেখানে প্রয়োজন সেখানে পুনঃব্যবহৃত, প্রতিটিতে নিজের ডেটা বসানো।</p>'),

      img(
        'docs/img/react/introduction-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে একটি ওয়েবপেজ লেআউটকে ছোট ছোট লেবেলযুক্ত কম্পোনেন্ট ব্লকের একটি ট্রি-তে ভাঙা দেখানো হয়েছে, একটি সম্পূর্ণ ইন্টারফেস ছোট পুনঃব্যবহারযোগ্য অংশ দিয়ে কীভাবে তৈরি হয় তা তুলে ধরছে',
        1024, 768,
        'একটি React ইন্টারফেস কম্পোনেন্টের একটি ট্রি, প্রতিটি একটি ছোট, পুনঃব্যবহারযোগ্য, স্বয়ংসম্পূর্ণ অংশ।'
      ),

      h(2, 'এটি কেন এত ব্যাপকভাবে ব্যবহৃত হয়ে উঠল', 'why-it-became-so-widely-used'),
      p('<p>React তৈরি হয়েছিল Facebook-এ আর 2013 সালে ওপেন-সোর্স করা হয়, আর তখন থেকে এটি ওয়েব ইন্টারফেস বানানোর সবচেয়ে ব্যাপকভাবে ব্যবহৃত টুলগুলোর একটি হয়ে উঠেছে — যা ব্যবহারিকভাবে গুরুত্বপূর্ণ ঠিক PHP-এর জনপ্রিয়তার মতোই: React দক্ষতা সরাসরি প্রচুর বাস্তব চাকরি আর বিদ্যমান কোডবেসে কাজে লাগে, আর একই মূল ধারণাগুলো মোবাইল অ্যাপ বানানোর জন্য React Native-এও ব্যবহৃত হয়।</p>'),

      callout('note', '<p>এই অংশটি ধরে নেয় JavaScript নিয়ে সত্যিকারের স্বাচ্ছন্দ্য আছে — ফাংশন, অ্যারে, অবজেক্ট, আর বিশেষভাবে <a href="/bn/javascript/es6-and-modern-features/">ES6+ ফিচার</a> যেমন অ্যারো ফাংশন আর ডিস্ট্রাকচারিং, সাথে পরের দিকের ডেটা-fetching পাঠের জন্য <a href="/bn/javascript/promises-and-async/">প্রমিস আর async/await</a>। এর কোনোটা নিয়ে অনিশ্চিত থাকলে, আগে <a href="/bn/javascript/">JavaScript অংশ</a> দিয়ে একবার ঘুরে আসা ভালো — React এর সবকিছুর উপর ক্রমাগত নির্ভর করে।</p>', 'JavaScript থেকে আসছেন'),

      p('<p>পরের পাঠে আপনার মেশিনে একটি প্রকৃত React প্রজেক্ট আসলেই চালু করা হবে, যাতে এখান থেকে প্রতিটি উদাহরণ আপনি নিজে চেষ্টা করে দেখতে পারেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'setup',
  sortOrder: 2,
  en: {
    title: 'Setting Up a React Project',
    metaTitle: 'Setting Up a React Project | Learn Computer Academy',
    metaDescription: 'Creating a new React project with Vite, the current standard tooling, and running it for the first time.',
    blocks: [
      p('<p>Unlike plain HTML/CSS/JS, React isn\'t something you can just link with a <code>&lt;script&gt;</code> tag for real, ongoing development — it works best with a build tool that handles JSX and modern JavaScript. <b>Vite</b> is the current standard choice for starting a new React project.</p>'),

      h(2, 'Prerequisites'),
      p('<p>You\'ll need <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">Node.js</a> installed — it provides <code>npm</code>, the package manager used to install React and the build tooling.</p>'),
      code('bash', 'node --version\nnpm --version'),

      h(2, 'Creating a New Project'),
      code('bash', 'npm create vite@latest my-react-app -- --template react\ncd my-react-app\nnpm install\nnpm run dev'),
      p('<p><code>npm run dev</code> starts a local development server, usually at <code>http://localhost:5173</code>, and reloads the page automatically whenever you save a file.</p>'),

      h(2, 'What Got Created'),
      table(
        ['File/folder', 'What it\'s for'],
        [
          ['src/main.jsx', 'The entry point — renders the root App component into the actual HTML page'],
          ['src/App.jsx', 'The root component — you\'ll spend most of your time here and in files you create alongside it'],
          ['index.html', 'The one real HTML file — contains a single empty <div>, which React fills in'],
          ['package.json', 'Lists installed packages and scripts (like npm run dev)'],
        ]
      ),

      callout('note', '<p><b>Create React App</b>, an older tool you\'ll still see referenced in a lot of existing tutorials and Stack Overflow answers, is no longer the recommended way to start a new project — it\'s been officially deprecated. Vite is faster and is what this section, and most current React learning material, uses.</p>', 'Not Create React App'),

      p('<p>With a project actually running, the next lesson looks at JSX — the syntax you\'ll see inside every component from here on.</p>'),
    ],
  },
  bn: {
    title: 'একটি React প্রজেক্ট সেটআপ করা',
    metaTitle: 'একটি React প্রজেক্ট সেটআপ করা | Learn Computer Academy',
    metaDescription: 'Vite দিয়ে একটি নতুন React প্রজেক্ট তৈরি করা, বর্তমান স্ট্যান্ডার্ড টুলিং, আর এটি প্রথমবার চালানো।',
    blocks: [
      p('<p>সাধারণ HTML/CSS/JS-এর থেকে আলাদা, React সত্যিকারের, চলমান ডেভেলপমেন্টের জন্য এমন কিছু নয় যা আপনি শুধু একটি <code>&lt;script&gt;</code> ট্যাগ দিয়ে লিংক করতে পারেন — এটি JSX আর আধুনিক JavaScript হ্যান্ডেল করে এমন একটি বিল্ড টুলের সাথে সবচেয়ে ভালো কাজ করে। একটি নতুন React প্রজেক্ট শুরু করার জন্য বর্তমান স্ট্যান্ডার্ড পছন্দ হলো <b>Vite</b>।</p>'),

      h(2, 'পূর্বশর্ত', 'prerequisites'),
      p('<p>আপনার <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">Node.js</a> ইনস্টল থাকতে হবে — এটি <code>npm</code> দেয়, React আর বিল্ড টুলিং ইনস্টল করতে ব্যবহৃত প্যাকেজ ম্যানেজার।</p>'),
      code('bash', 'node --version\nnpm --version'),

      h(2, 'একটি নতুন প্রজেক্ট তৈরি করা', 'creating-a-new-project'),
      code('bash', 'npm create vite@latest my-react-app -- --template react\ncd my-react-app\nnpm install\nnpm run dev'),
      p('<p><code>npm run dev</code> একটি লোকাল ডেভেলপমেন্ট সার্ভার চালু করে, সাধারণত <code>http://localhost:5173</code>-এ, আর আপনি একটি ফাইল সেভ করলেই স্বয়ংক্রিয়ভাবে পাতাটি রিলোড করে।</p>'),

      h(2, 'কী তৈরি হলো', 'what-got-created'),
      table(
        ['ফাইল/ফোল্ডার', 'কীসের জন্য'],
        [
          ['src/main.jsx', 'এন্ট্রি পয়েন্ট — root App কম্পোনেন্টকে আসল HTML পাতায় রেন্ডার করে'],
          ['src/App.jsx', 'root কম্পোনেন্ট — এখানে আর এর পাশে আপনার তৈরি ফাইলে আপনি বেশিরভাগ সময় কাটাবেন'],
          ['index.html', 'একমাত্র প্রকৃত HTML ফাইল — একটি একক খালি <div> ধারণ করে, যা React পূরণ করে'],
          ['package.json', 'ইনস্টল করা প্যাকেজ আর স্ক্রিপ্ট তালিকাবদ্ধ করে (যেমন npm run dev)'],
        ]
      ),

      callout('note', '<p><b>Create React App</b>, একটি পুরনো টুল যা আপনি এখনও অনেক বিদ্যমান টিউটোরিয়াল আর Stack Overflow উত্তরে উল্লেখ দেখবেন, একটি নতুন প্রজেক্ট শুরু করার প্রস্তাবিত উপায় আর নেই — এটি আনুষ্ঠানিকভাবে deprecated হয়ে গেছে। Vite দ্রুত, আর এই অংশ, আর বেশিরভাগ বর্তমান React শেখার উপকরণ, এটাই ব্যবহার করে।</p>', 'Create React App নয়'),

      p('<p>একটি প্রজেক্ট আসলেই চলার পর, পরের পাঠে JSX দেখানো হবে — এখন থেকে প্রতিটি কম্পোনেন্টের ভেতরে যে সিনট্যাক্স আপনি দেখবেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'jsx',
  sortOrder: 3,
  en: {
    title: 'JSX Syntax',
    metaTitle: 'JSX Syntax | Learn Computer Academy',
    metaDescription: 'What JSX is, how it lets you write HTML-like markup inside JavaScript, and the key differences from real HTML.',
    blocks: [
      p('<p><b>JSX</b> is a syntax extension that lets you write HTML-like markup directly inside JavaScript. It looks like HTML, but it isn\'t — it gets converted into regular JavaScript function calls before it ever reaches a browser.</p>'),

      h(2, 'What JSX Looks Like'),
      code('jsx', 'const element = <h1>Hello, world!</h1>;'),
      p('<p>This isn\'t a string, and it isn\'t HTML — it\'s JavaScript, compiled by the build tooling from your last lesson into something like <code>React.createElement(\'h1\', null, \'Hello, world!\')</code>. You\'ll never write that longer form yourself; JSX is simply a more readable way to write the same thing.</p>'),

      h(2, 'Embedding JavaScript Expressions'),
      p('<p>Curly braces <code>{ }</code> drop any JavaScript expression directly into JSX:</p>'),
      code('jsx', 'const name = "Priya";\nconst element = <h1>Hello, {name}!</h1>;\n\nconst total = <p>Total: {2 + 2}</p>;'),
      callout('note', '<p>Only <b>expressions</b> work inside <code>{ }</code> — something that produces a value. Statements like <code>if</code> or a <code>for</code> loop don\'t fit directly; the Conditional Rendering lesson later in this section covers the expression-based patterns JSX actually uses instead.</p>', 'Expressions, not statements'),

      h(2, 'JSX Isn\'t Quite HTML'),
      p('<p>A handful of real differences trip up almost everyone coming from HTML:</p>'),
      table(
        ['HTML', 'JSX', 'Why'],
        [
          ['class="box"', 'className="box"', '`class` is a reserved word in JavaScript'],
          ['<label for="name">', '<label htmlFor="name">', '`for` is also reserved'],
          ['<img src="...">', '<img src="..." />', 'Every tag must be closed, even ones HTML allows to stay open'],
          ['onclick="..."', 'onClick={...}', 'Event names are camelCase, and take a real function, not a string'],
        ]
      ),

      h(2, 'One Root Element'),
      p('<p>A component can only return one top-level element — this trips up nearly everyone the first time:</p>'),
      code('jsx', '// This is an error — two sibling elements with no single parent:\n// return (\n//   <h1>Title</h1>\n//   <p>Text</p>\n// );\n\n// Wrap them in one element instead:\nreturn (\n  <div>\n    <h1>Title</h1>\n    <p>Text</p>\n  </div>\n);'),
      p('<p>The Fragments and Portals lesson later in this section covers a way to satisfy this rule without adding an extra, meaningless <code>&lt;div&gt;</code> to the actual page.</p>'),
    ],
  },
  bn: {
    title: 'JSX সিনট্যাক্স',
    metaTitle: 'JSX সিনট্যাক্স | Learn Computer Academy',
    metaDescription: 'JSX আসলে কী, এটি কীভাবে JavaScript-এর ভেতরে HTML-এর মতো মার্কআপ লিখতে দেয়, আর প্রকৃত HTML থেকে মূল পার্থক্যগুলো।',
    blocks: [
      p('<p><b>JSX</b> একটি সিনট্যাক্স এক্সটেনশন যা আপনাকে সরাসরি JavaScript-এর ভেতরে HTML-এর মতো মার্কআপ লিখতে দেয়। এটি HTML-এর মতো দেখতে, কিন্তু এটি তা নয় — ব্রাউজারে পৌঁছানোর আগেই এটি সাধারণ JavaScript ফাংশন কলে রূপান্তরিত হয়ে যায়।</p>'),

      h(2, 'JSX দেখতে কেমন', 'what-jsx-looks-like'),
      code('jsx', 'const element = <h1>Hello, world!</h1>;'),
      p('<p>এটি কোনো স্ট্রিং নয়, আর এটি HTML-ও নয় — এটি JavaScript, আপনার আগের পাঠের বিল্ড টুলিং দিয়ে <code>React.createElement(\'h1\', null, \'Hello, world!\')</code>-এর মতো কিছুতে কম্পাইল করা। আপনি কখনো নিজে সেই লম্বা রূপটি লিখবেন না; JSX শুধু একই জিনিস লেখার একটি বেশি পঠনযোগ্য উপায়।</p>'),

      h(2, 'JavaScript এক্সপ্রেশন এম্বেড করা', 'embedding-javascript-expressions'),
      p('<p>কার্লি ব্রেস <code>{ }</code> সরাসরি JSX-এ যেকোনো JavaScript এক্সপ্রেশন বসিয়ে দেয়:</p>'),
      code('jsx', 'const name = "Priya";\nconst element = <h1>Hello, {name}!</h1>;\n\nconst total = <p>Total: {2 + 2}</p>;'),
      callout('note', '<p><code>{ }</code>-এর ভেতরে শুধু <b>এক্সপ্রেশন</b> কাজ করে — এমন কিছু যা একটি মান তৈরি করে। <code>if</code> বা একটি <code>for</code> লুপের মতো স্টেটমেন্ট সরাসরি ফিট হয় না; এই অংশের পরের Conditional Rendering পাঠে JSX আসলে যে এক্সপ্রেশন-ভিত্তিক প্যাটার্ন ব্যবহার করে তা দেখানো হবে।</p>', 'এক্সপ্রেশন, স্টেটমেন্ট নয়'),

      h(2, 'JSX ঠিক HTML নয়', 'jsx-isnt-quite-html'),
      p('<p>HTML থেকে আসার সময় কয়েকটি আসল পার্থক্য প্রায় সবাইকে হোঁচট খাওয়ায়:</p>'),
      table(
        ['HTML', 'JSX', 'কেন'],
        [
          ['class="box"', 'className="box"', '`class` JavaScript-এ একটি সংরক্ষিত শব্দ'],
          ['<label for="name">', '<label htmlFor="name">', '`for`-ও সংরক্ষিত'],
          ['<img src="...">', '<img src="..." />', 'প্রতিটি ট্যাগ বন্ধ করতে হয়, এমনকি যেগুলো HTML খোলা থাকতে দেয়'],
          ['onclick="..."', 'onClick={...}', 'ইভেন্টের নাম camelCase, আর একটি স্ট্রিং নয়, একটি প্রকৃত ফাংশন নেয়'],
        ]
      ),

      h(2, 'একটি Root এলিমেন্ট', 'one-root-element'),
      p('<p>একটি কম্পোনেন্ট শুধু একটি top-level এলিমেন্ট রিটার্ন করতে পারে — প্রথমবার এটি প্রায় সবাইকে হোঁচট খাওয়ায়:</p>'),
      code('jsx', '// This is an error — two sibling elements with no single parent:\n// return (\n//   <h1>Title</h1>\n//   <p>Text</p>\n// );\n\n// Wrap them in one element instead:\nreturn (\n  <div>\n    <h1>Title</h1>\n    <p>Text</p>\n  </div>\n);'),
      p('<p>এই অংশের পরের Fragments and Portals পাঠে আসল পাতায় একটি অতিরিক্ত, অর্থহীন <code>&lt;div&gt;</code> যোগ না করে এই নিয়ম মানার একটি উপায় দেখানো হবে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'first-component',
  sortOrder: 4,
  en: {
    title: 'Your First Component',
    metaTitle: 'Your First React Component | Learn Computer Academy',
    metaDescription: 'Writing, exporting, and importing a function component — the basic building block of every React application.',
    blocks: [
      p('<p>A <b>component</b> is a JavaScript function that returns JSX. That\'s the entire definition — everything else you\'ll learn in this section is what you can do with that one idea.</p>'),

      h(2, 'A Minimal Component'),
      code('jsx', 'function Welcome() {\n  return <h1>Hello, world!</h1>;\n}'),
      callout('warning', '<p>Component names <b>must</b> start with a capital letter — <code>Welcome</code>, not <code>welcome</code>. React uses this exact rule to tell a component apart from a regular HTML tag; <code>&lt;welcome /&gt;</code> would be treated as an (invalid) HTML element, not your component.</p>', 'Capitalize component names — always'),

      h(2, 'Using a Component'),
      p('<p>Once defined, a component is used like any other JSX tag:</p>'),
      code('jsx', 'function App() {\n  return (\n    <div>\n      <Welcome />\n    </div>\n  );\n}'),

      h(2, 'One Component Per File, Exported'),
      p('<p>Real React projects put each component in its own file, using the ES module <code>export</code>/<code>import</code> you met in the <a href="/javascript/module-import-export/">JavaScript Modules lesson</a>:</p>'),
      code('jsx', '// Welcome.jsx\nexport default function Welcome() {\n  return <h1>Hello, world!</h1>;\n}'),
      code('jsx', '// App.jsx\nimport Welcome from \'./Welcome\';\n\nexport default function App() {\n  return (\n    <div>\n      <Welcome />\n    </div>\n  );\n}'),

      h(2, 'Components Can Use Other Components'),
      p('<p>This is the whole idea in practice — small pieces combine into bigger ones:</p>'),
      code('jsx', 'function Header() {\n  return <h1>My Site</h1>;\n}\n\nfunction Footer() {\n  return <p>&copy; 2026</p>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Header />\n      <p>Page content goes here.</p>\n      <Footer />\n    </div>\n  );\n}'),
    ],
  },
  bn: {
    title: 'আপনার প্রথম কম্পোনেন্ট',
    metaTitle: 'আপনার প্রথম React কম্পোনেন্ট | Learn Computer Academy',
    metaDescription: 'একটি ফাংশন কম্পোনেন্ট লেখা, এক্সপোর্ট করা, আর ইম্পোর্ট করা — প্রতিটি React অ্যাপ্লিকেশনের মূল বিল্ডিং ব্লক।',
    blocks: [
      p('<p>একটি <b>কম্পোনেন্ট</b> হলো JSX রিটার্ন করা একটি JavaScript ফাংশন। এটাই পুরো সংজ্ঞা — এই অংশে আপনি যা কিছু শিখবেন তা এই একটি ধারণা দিয়ে আপনি কী করতে পারেন তাই।</p>'),

      h(2, 'একটি ন্যূনতম কম্পোনেন্ট', 'a-minimal-component'),
      code('jsx', 'function Welcome() {\n  return <h1>Hello, world!</h1>;\n}'),
      callout('warning', '<p>কম্পোনেন্টের নাম <b>অবশ্যই</b> বড় হাতের অক্ষর দিয়ে শুরু হতে হবে — <code>Welcome</code>, <code>welcome</code> নয়। একটি কম্পোনেন্টকে একটি সাধারণ HTML ট্যাগ থেকে আলাদা চিনতে React ঠিক এই নিয়মটাই ব্যবহার করে; <code>&lt;welcome /&gt;</code>-কে একটি (অবৈধ) HTML এলিমেন্ট হিসেবে গণ্য করা হবে, আপনার কম্পোনেন্ট হিসেবে নয়।</p>', 'কম্পোনেন্টের নাম সবসময় ক্যাপিটালাইজ করুন'),

      h(2, 'একটি কম্পোনেন্ট ব্যবহার করা', 'using-a-component'),
      p('<p>একবার সংজ্ঞায়িত হয়ে গেলে, একটি কম্পোনেন্ট অন্য যেকোনো JSX ট্যাগের মতো ব্যবহৃত হয়:</p>'),
      code('jsx', 'function App() {\n  return (\n    <div>\n      <Welcome />\n    </div>\n  );\n}'),

      h(2, 'প্রতি ফাইলে একটি কম্পোনেন্ট, এক্সপোর্ট করা', 'one-component-per-file-exported'),
      p('<p>বাস্তব React প্রজেক্ট প্রতিটি কম্পোনেন্টকে নিজের ফাইলে রাখে, <a href="/bn/javascript/module-import-export/">JavaScript মডিউল পাঠে</a> শেখা ES module <code>export</code>/<code>import</code> ব্যবহার করে:</p>'),
      code('jsx', '// Welcome.jsx\nexport default function Welcome() {\n  return <h1>Hello, world!</h1>;\n}'),
      code('jsx', '// App.jsx\nimport Welcome from \'./Welcome\';\n\nexport default function App() {\n  return (\n    <div>\n      <Welcome />\n    </div>\n  );\n}'),

      h(2, 'কম্পোনেন্ট অন্য কম্পোনেন্ট ব্যবহার করতে পারে', 'components-can-use-other-components'),
      p('<p>বাস্তবে পুরো ধারণাটা এটাই — ছোট অংশ একত্রিত হয়ে বড় কিছু হয়ে ওঠে:</p>'),
      code('jsx', 'function Header() {\n  return <h1>My Site</h1>;\n}\n\nfunction Footer() {\n  return <p>&copy; 2026</p>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Header />\n      <p>Page content goes here.</p>\n      <Footer />\n    </div>\n  );\n}'),
    ],
  },
})

lessons.push({
  slug: 'props',
  sortOrder: 5,
  en: {
    title: 'Props',
    metaTitle: 'React Props | Learn Computer Academy',
    metaDescription: 'Passing data into a component with props — how a single component becomes reusable with different data.',
    blocks: [
      p('<p><b>Props</b> (short for "properties") are how data gets passed into a component — the mechanism that turns one component definition into something reusable with different data each time.</p>'),

      h(2, 'Passing and Reading Props'),
      code('jsx', 'function Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Welcome name="Priya" />\n      <Welcome name="Amit" />\n    </div>\n  );\n}\n// Renders: Hello, Priya! and Hello, Amit! — same component, different data'),
      p('<p>Props arrive as a single object — <code>{name: "Priya"}</code> for the first call above — with one key per attribute you passed on the JSX tag.</p>'),

      h(2, 'Destructuring Props'),
      p('<p>Real React code almost always destructures props directly in the function signature, using the <a href="/javascript/es6-and-modern-features/">destructuring</a> you already know from JavaScript:</p>'),
      code('jsx', 'function Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}'),

      h(2, 'Props Are Read-Only'),
      p('<p>A component must never modify the props it receives — they belong to whichever component passed them in. This isn\'t just a style rule; React relies on props being unchanged to know when a re-render is actually needed:</p>'),
      code('jsx', 'function Welcome({ name }) {\n  // name = "Someone else"; // Never do this — props are read-only\n  return <h1>Hello, {name}!</h1>;\n}'),

      h(2, 'The children Prop'),
      p('<p>Whatever\'s placed between a component\'s opening and closing tags is automatically passed in as a special prop called <code>children</code>:</p>'),
      code('jsx', 'function Card({ children }) {\n  return <div className="card">{children}</div>;\n}\n\nfunction App() {\n  return (\n    <Card>\n      <p>This paragraph becomes the Card\'s children.</p>\n    </Card>\n  );\n}'),
      p('<p>The Component Composition lesson later in this section builds on <code>children</code> a lot further — it\'s one of the most useful patterns in the whole language.</p>'),
    ],
  },
  bn: {
    title: 'প্রপস',
    metaTitle: 'React প্রপস | Learn Computer Academy',
    metaDescription: 'props দিয়ে একটি কম্পোনেন্টে ডেটা পাস করা — যে প্রক্রিয়া একটি একক কম্পোনেন্ট সংজ্ঞাকে প্রতিবার ভিন্ন ডেটাসহ পুনঃব্যবহারযোগ্য করে তোলে।',
    blocks: [
      p('<p><b>প্রপস</b> ("properties"-এর সংক্ষিপ্ত রূপ) হলো একটি কম্পোনেন্টে ডেটা পাস করার উপায় — যে প্রক্রিয়া একটি কম্পোনেন্ট সংজ্ঞাকে প্রতিবার ভিন্ন ডেটাসহ পুনঃব্যবহারযোগ্য কিছুতে রূপান্তরিত করে।</p>'),

      h(2, 'প্রপস পাস করা আর পড়া', 'passing-and-reading-props'),
      code('jsx', 'function Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Welcome name="Priya" />\n      <Welcome name="Amit" />\n    </div>\n  );\n}\n// Renders: Hello, Priya! and Hello, Amit! — same component, different data'),
      p('<p>প্রপস একটি একক অবজেক্ট হিসেবে আসে — উপরের প্রথম কলের জন্য <code>{name: "Priya"}</code> — JSX ট্যাগে আপনার পাস করা প্রতিটি অ্যাট্রিবিউটের জন্য একটি করে key।</p>'),

      h(2, 'প্রপস ডিস্ট্রাকচারিং করা', 'destructuring-props'),
      p('<p>বাস্তব React কোড প্রায় সবসময় ফাংশন সিগনেচারেই সরাসরি প্রপস ডিস্ট্রাকচার করে, JavaScript থেকে ইতিমধ্যে জানা <a href="/bn/javascript/es6-and-modern-features/">ডিস্ট্রাকচারিং</a> ব্যবহার করে:</p>'),
      code('jsx', 'function Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}'),

      h(2, 'প্রপস রিড-অনলি', 'props-are-read-only'),
      p('<p>একটি কম্পোনেন্ট যে প্রপস পায় তা কখনো পরিবর্তন করা উচিত নয় — সেগুলো যে কম্পোনেন্ট পাস করেছে তার অন্তর্গত। এটি শুধু একটি স্টাইল নিয়ম নয়; একটি re-render আসলেই প্রয়োজন কিনা তা জানতে React প্রপস অপরিবর্তিত থাকার উপর নির্ভর করে:</p>'),
      code('jsx', 'function Welcome({ name }) {\n  // name = "Someone else"; // Never do this — props are read-only\n  return <h1>Hello, {name}!</h1>;\n}'),

      h(2, 'children প্রপ', 'the-children-prop'),
      p('<p>একটি কম্পোনেন্টের ওপেনিং আর ক্লোজিং ট্যাগের মাঝে যা রাখা হয় তা স্বয়ংক্রিয়ভাবে <code>children</code> নামের একটি বিশেষ প্রপ হিসেবে পাস হয়:</p>'),
      code('jsx', 'function Card({ children }) {\n  return <div className="card">{children}</div>;\n}\n\nfunction App() {\n  return (\n    <Card>\n      <p>This paragraph becomes the Card\'s children.</p>\n    </Card>\n  );\n}'),
      p('<p>এই অংশের পরের Component Composition পাঠে <code>children</code>-এর উপর আরও অনেক বেশি ভিত্তি করে তৈরি করা হবে — এটি পুরো ভাষার সবচেয়ে দরকারি প্যাটার্নগুলোর একটি।</p>'),
    ],
  },
})

lessons.push({
  slug: 'lists-and-keys',
  sortOrder: 6,
  en: {
    title: 'Rendering Lists and Keys',
    metaTitle: 'Rendering Lists and Keys in React | Learn Computer Academy',
    metaDescription: 'Rendering a list of components from an array with .map(), and why React requires a unique key on each item.',
    blocks: [
      p('<p>Most real interfaces show a list of something — products, comments, lessons. React renders lists with plain JavaScript\'s <code>.map()</code>, the array method from the <a href="/javascript/arrays/">JavaScript Arrays lesson</a>, not a special template loop syntax.</p>'),

      h(2, 'Mapping Data to JSX'),
      code('jsx', 'function FruitList() {\n  const fruits = [\'apple\', \'banana\', \'mango\'];\n\n  return (\n    <ul>\n      {fruits.map((fruit) => (\n        <li>{fruit}</li>\n      ))}\n    </ul>\n  );\n}'),
      p('<p>The curly braces around <code>.map(...)</code> work exactly like embedding any other expression, from the JSX lesson — <code>.map()</code> here returns an array of <code>&lt;li&gt;</code> elements, and React renders an array of elements just fine.</p>'),

      h(2, 'The key Prop'),
      p('<p>Running the code above logs a console warning: <i>"Each child in a list should have a unique key prop."</i> React needs a stable <code>key</code> on each item to correctly track which item is which across re-renders — without it, React can only guess by position, which causes real bugs when a list gets reordered, filtered, or has an item removed from the middle.</p>'),
      code('jsx', 'function FruitList() {\n  const fruits = [\'apple\', \'banana\', \'mango\'];\n\n  return (\n    <ul>\n      {fruits.map((fruit) => (\n        <li key={fruit}>{fruit}</li>\n      ))}\n    </ul>\n  );\n}'),

      h(2, 'What Makes a Good key'),
      p('<p>A <code>key</code> needs to be a string or number that\'s unique among siblings, and stable across re-renders — a database ID or a slug is ideal:</p>'),
      code('jsx', 'function StudentList({ students }) {\n  return (\n    <ul>\n      {students.map((student) => (\n        <li key={student.id}>{student.name}</li>\n      ))}\n    </ul>\n  );\n}'),

      callout('warning', '<p>Using the array <b>index</b> as a key (<code>fruits.map((fruit, i) => &lt;li key={i}&gt;)</code>) works, but only safely when the list never reorders, filters, or has items inserted/removed anywhere but the end. Reordering with index keys causes React to mismatch state to the wrong item after the reorder — a real, easy-to-miss bug. Use a real, stable ID whenever the data has one.</p>', 'Index as key is a trap, not a shortcut'),

      h(2, 'key Is Not a Prop the Component Receives'),
      p('<p><code>key</code> is metadata for React itself, not something your component can read — <code>props.key</code> is always <code>undefined</code>. If a component needs the same value for its own logic, pass it again under a different name.</p>'),
    ],
  },
  bn: {
    title: 'লিস্ট আর Key রেন্ডার করা',
    metaTitle: 'React-এ লিস্ট আর Key রেন্ডার করা | Learn Computer Academy',
    metaDescription: '.map() দিয়ে একটি অ্যারে থেকে কম্পোনেন্টের একটি লিস্ট রেন্ডার করা, আর কেন React প্রতিটি আইটেমে একটি ইউনিক key দাবি করে।',
    blocks: [
      p('<p>বেশিরভাগ বাস্তব ইন্টারফেস কোনো কিছুর একটি লিস্ট দেখায় — প্রোডাক্ট, কমেন্ট, পাঠ। React সাধারণ JavaScript-এর <code>.map()</code> দিয়ে লিস্ট রেন্ডার করে, <a href="/bn/javascript/arrays/">JavaScript Arrays পাঠ</a>-এর অ্যারে মেথড, কোনো বিশেষ টেমপ্লেট লুপ সিনট্যাক্স নয়।</p>'),

      h(2, 'ডেটাকে JSX-এ ম্যাপ করা', 'mapping-data-to-jsx'),
      code('jsx', 'function FruitList() {\n  const fruits = [\'apple\', \'banana\', \'mango\'];\n\n  return (\n    <ul>\n      {fruits.map((fruit) => (\n        <li>{fruit}</li>\n      ))}\n    </ul>\n  );\n}'),
      p('<p><code>.map(...)</code>-এর চারপাশের কার্লি ব্রেস ঠিক JSX পাঠের অন্য যেকোনো এক্সপ্রেশন এম্বেড করার মতোই কাজ করে — এখানে <code>.map()</code> <code>&lt;li&gt;</code> এলিমেন্টের একটি অ্যারে রিটার্ন করে, আর React এলিমেন্টের একটি অ্যারে দিব্যি রেন্ডার করে।</p>'),

      h(2, 'key প্রপ', 'the-key-prop'),
      p('<p>উপরের কোড চালালে একটি কনসোল warning লগ হয়: <i>"Each child in a list should have a unique key prop."</i> re-render জুড়ে কোন আইটেম কোনটা তা সঠিকভাবে ট্র্যাক করতে React-এর প্রতিটি আইটেমে একটি স্থিতিশীল <code>key</code> দরকার — এটা ছাড়া, React শুধু অবস্থান দিয়ে অনুমান করতে পারে, যা একটি লিস্ট পুনর্বিন্যস্ত, ফিল্টার, বা মাঝখান থেকে একটি আইটেম সরানো হলে আসল বাগ তৈরি করে।</p>'),
      code('jsx', 'function FruitList() {\n  const fruits = [\'apple\', \'banana\', \'mango\'];\n\n  return (\n    <ul>\n      {fruits.map((fruit) => (\n        <li key={fruit}>{fruit}</li>\n      ))}\n    </ul>\n  );\n}'),

      h(2, 'কী একটি ভালো key তৈরি করে', 'what-makes-a-good-key'),
      p('<p>একটি <code>key</code>-কে সিবলিংদের মধ্যে ইউনিক, আর re-render জুড়ে স্থিতিশীল একটি স্ট্রিং বা সংখ্যা হতে হবে — একটি ডেটাবেস ID বা একটি slug আদর্শ:</p>'),
      code('jsx', 'function StudentList({ students }) {\n  return (\n    <ul>\n      {students.map((student) => (\n        <li key={student.id}>{student.name}</li>\n      ))}\n    </ul>\n  );\n}'),

      callout('warning', '<p>অ্যারে <b>index</b>-কে key হিসেবে ব্যবহার করা (<code>fruits.map((fruit, i) => &lt;li key={i}&gt;)</code>) কাজ করে, কিন্তু শুধু নিরাপদে যখন লিস্ট কখনো পুনর্বিন্যস্ত হয় না, ফিল্টার হয় না, বা শেষ ছাড়া অন্য কোথাও আইটেম insert/remove হয় না। Index key দিয়ে পুনর্বিন্যাস করলে পুনর্বিন্যাসের পর React স্টেটকে ভুল আইটেমের সাথে মিলিয়ে ফেলে — একটি আসল, সহজে-এড়িয়ে-যাওয়া বাগ। ডেটার একটি প্রকৃত, স্থিতিশীল ID থাকলে সেটাই ব্যবহার করুন।</p>', 'Index-কে key হিসেবে ব্যবহার একটি শর্টকাট নয়, একটি ফাঁদ'),

      h(2, 'key কম্পোনেন্ট যে প্রপ পায় তার একটি নয়', 'key-is-not-a-prop-the-component-receives'),
      p('<p><code>key</code> React নিজের জন্য মেটাডেটা, আপনার কম্পোনেন্ট পড়তে পারে এমন কিছু নয় — <code>props.key</code> সবসময় <code>undefined</code>। একটি কম্পোনেন্টের নিজের লজিকের জন্য একই মান প্রয়োজন হলে, একটি ভিন্ন নামে সেটা আবার পাস করুন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'conditional-rendering',
  sortOrder: 7,
  en: {
    title: 'Conditional Rendering',
    metaTitle: 'Conditional Rendering in React | Learn Computer Academy',
    metaDescription: 'Showing or hiding parts of a component with &&, the ternary operator, and early returns.',
    blocks: [
      p('<p>The JSX Syntax lesson mentioned that only expressions work inside <code>{ }</code>, not statements like <code>if</code>. This lesson covers the expression-based patterns React actually uses to show or hide content.</p>'),

      h(2, 'The && Operator'),
      p('<p>The most common pattern for "render this, or render nothing" — relies on the same short-circuit behavior from the <a href="/javascript/control-flow/">JavaScript lesson</a>: if the left side is falsy, JavaScript never evaluates the right side at all:</p>'),
      code('jsx', 'function Notification({ hasUnread }) {\n  return (\n    <div>\n      {hasUnread && <span className="badge">New!</span>}\n    </div>\n  );\n}'),
      callout('warning', '<p><code>{count && <span>...</span>}</code> is a real, common bug: if <code>count</code> is <code>0</code>, React renders the literal number <b>0</b> on the page, since <code>0</code> is falsy but is still a value React knows how to render — it\'s not the same as rendering nothing. Convert to a real boolean first: <code>{count > 0 && ...}</code>.</p>', 'The 0 && trap'),

      h(2, 'The Ternary Operator'),
      p('<p>For an either/or choice — not "something or nothing" — the ternary from the <a href="/javascript/control-flow/">JavaScript Control Flow lesson</a> is the standard tool:</p>'),
      code('jsx', 'function LoginButton({ isLoggedIn }) {\n  return isLoggedIn ? <button>Log out</button> : <button>Log in</button>;\n}'),

      h(2, 'Early Returns'),
      p('<p>For more involved logic, returning early from the component function entirely is often clearer than nesting ternaries:</p>'),
      code('jsx', 'function UserGreeting({ user }) {\n  if (!user) {\n    return <p>Please log in.</p>;\n  }\n\n  return <h1>Welcome back, {user.name}!</h1>;\n}'),

      h(2, 'Rendering Nothing'),
      p('<p>Returning <code>null</code> from a component renders nothing at all — no empty <code>&lt;div&gt;</code>, nothing in the DOM:</p>'),
      code('jsx', 'function Warning({ show, message }) {\n  if (!show) return null;\n  return <p className="warning">{message}</p>;\n}'),
    ],
  },
  bn: {
    title: 'কন্ডিশনাল রেন্ডারিং',
    metaTitle: 'React-এ কন্ডিশনাল রেন্ডারিং | Learn Computer Academy',
    metaDescription: '&&, ternary অপারেটর, আর early return দিয়ে একটি কম্পোনেন্টের অংশ দেখানো বা লুকানো।',
    blocks: [
      p('<p>JSX Syntax পাঠে উল্লেখ করা হয়েছিল যে <code>{ }</code>-এর ভেতরে শুধু এক্সপ্রেশন কাজ করে, <code>if</code>-এর মতো স্টেটমেন্ট নয়। এই পাঠে সেই এক্সপ্রেশন-ভিত্তিক প্যাটার্ন দেখানো হবে যা React আসলে কন্টেন্ট দেখাতে বা লুকাতে ব্যবহার করে।</p>'),

      h(2, '&& অপারেটর', 'the-operator'),
      p('<p>"এটা রেন্ডার করো, বা কিছুই না" -এর সবচেয়ে সাধারণ প্যাটার্ন — <a href="/bn/javascript/control-flow/">JavaScript পাঠের</a> একই short-circuit আচরণের উপর নির্ভর করে: বাম পাশ falsy হলে, JavaScript ডান পাশ একদমই মূল্যায়ন করে না:</p>'),
      code('jsx', 'function Notification({ hasUnread }) {\n  return (\n    <div>\n      {hasUnread && <span className="badge">New!</span>}\n    </div>\n  );\n}'),
      callout('warning', '<p><code>{count && <span>...</span>}</code> একটি আসল, সাধারণ বাগ: <code>count</code> যদি <code>0</code> হয়, React পাতায় আক্ষরিক সংখ্যা <b>0</b> রেন্ডার করে, কারণ <code>0</code> falsy কিন্তু তবুও একটি মান যা React রেন্ডার করতে জানে — এটা কিছুই রেন্ডার না করার মতো নয়। আগে একটি প্রকৃত boolean-এ রূপান্তর করুন: <code>{count > 0 && ...}</code>।</p>', '0 && ফাঁদ'),

      h(2, 'Ternary অপারেটর', 'the-ternary-operator'),
      p('<p>একটি either/or পছন্দের জন্য — "কিছু অথবা কিছুই না" নয় — <a href="/bn/javascript/control-flow/">JavaScript Control Flow পাঠ</a>-এর ternary হলো প্রচলিত টুল:</p>'),
      code('jsx', 'function LoginButton({ isLoggedIn }) {\n  return isLoggedIn ? <button>Log out</button> : <button>Log in</button>;\n}'),

      h(2, 'Early Return', 'early-returns'),
      p('<p>বেশি জটিল লজিকের জন্য, কম্পোনেন্ট ফাংশন থেকে পুরোপুরি আগেই রিটার্ন করা প্রায়ই নেস্টেড ternary-র চেয়ে বেশি পরিষ্কার:</p>'),
      code('jsx', 'function UserGreeting({ user }) {\n  if (!user) {\n    return <p>Please log in.</p>;\n  }\n\n  return <h1>Welcome back, {user.name}!</h1>;\n}'),

      h(2, 'কিছুই রেন্ডার না করা', 'rendering-nothing'),
      p('<p>একটি কম্পোনেন্ট থেকে <code>null</code> রিটার্ন করলে একদমই কিছু রেন্ডার হয় না — কোনো খালি <code>&lt;div&gt;</code> নয়, DOM-এ কিছুই নেই:</p>'),
      code('jsx', 'function Warning({ show, message }) {\n  if (!show) return null;\n  return <p className="warning">{message}</p>;\n}'),
    ],
  },
})

lessons.push({
  slug: 'events',
  sortOrder: 8,
  en: {
    title: 'Handling Events',
    metaTitle: 'Handling Events in React | Learn Computer Academy',
    metaDescription: 'Responding to clicks and other events in React with camelCase event props and real function references.',
    blocks: [
      p('<p>The JSX Syntax lesson already flagged the two headline differences from HTML: event names are camelCase, and take a real function instead of a string.</p>'),

      h(2, 'A Basic Click Handler'),
      code('jsx', 'function Button() {\n  function handleClick() {\n    alert(\'Button clicked!\');\n  }\n\n  return <button onClick={handleClick}>Click me</button>;\n}'),
      callout('warning', '<p><code>onClick={handleClick()}</code> — with parentheses — calls the function immediately during render, not when clicked, and passes whatever it returns (usually <code>undefined</code>) as the handler instead. Pass the function itself: <code>onClick={handleClick}</code>.</p>', 'Pass the function, don\'t call it'),

      h(2, 'Inline Arrow Functions'),
      p('<p>For a handler that needs an argument, an inline arrow function is the standard way to pass one along without calling the handler immediately:</p>'),
      code('jsx', 'function FruitList({ fruits, onSelect }) {\n  return (\n    <ul>\n      {fruits.map((fruit) => (\n        <li key={fruit} onClick={() => onSelect(fruit)}>\n          {fruit}\n        </li>\n      ))}\n    </ul>\n  );\n}'),

      h(2, 'The Event Object'),
      p('<p>React passes a <b>synthetic event</b> to every handler — a cross-browser wrapper around the native browser event, with the same familiar properties and methods you already know from the <a href="/javascript/events/">JavaScript Events lesson</a>:</p>'),
      code('jsx', 'function Form() {\n  function handleSubmit(e) {\n    e.preventDefault(); // same method, same purpose, as plain JS\n    console.log(\'Submitted\');\n  }\n\n  return <form onSubmit={handleSubmit}><button type="submit">Send</button></form>;\n}'),

      h(2, 'Common Events'),
      table(
        ['Prop', 'Fires when'],
        [
          ['onClick', 'An element is clicked'],
          ['onChange', 'An input\'s value changes'],
          ['onSubmit', 'A form is submitted'],
          ['onMouseEnter / onMouseLeave', 'The pointer enters or leaves an element'],
          ['onKeyDown', 'A key is pressed'],
        ]
      ),
      p('<p>The Forms in React lesson right after this one puts <code>onChange</code> and <code>onSubmit</code> to real use.</p>'),
    ],
  },
  bn: {
    title: 'ইভেন্ট হ্যান্ডলিং',
    metaTitle: 'React-এ ইভেন্ট হ্যান্ডলিং | Learn Computer Academy',
    metaDescription: 'camelCase ইভেন্ট প্রপ আর প্রকৃত ফাংশন রেফারেন্স দিয়ে React-এ ক্লিক আর অন্যান্য ইভেন্টে সাড়া দেওয়া।',
    blocks: [
      p('<p>JSX Syntax পাঠ ইতিমধ্যে HTML থেকে দুটো প্রধান পার্থক্য উল্লেখ করেছে: ইভেন্টের নাম camelCase, আর একটি স্ট্রিং-এর বদলে একটি প্রকৃত ফাংশন নেয়।</p>'),

      h(2, 'একটি বেসিক ক্লিক হ্যান্ডলার', 'a-basic-click-handler'),
      code('jsx', 'function Button() {\n  function handleClick() {\n    alert(\'Button clicked!\');\n  }\n\n  return <button onClick={handleClick}>Click me</button>;\n}'),
      callout('warning', '<p><code>onClick={handleClick()}</code> — বন্ধনীসহ — ফাংশনটি ক্লিক করার সময় নয়, render-এর সময় সাথে সাথে কল করে, আর এটি যা রিটার্ন করে (সাধারণত <code>undefined</code>) তা হ্যান্ডলার হিসেবে পাস করে। ফাংশনটি নিজেই পাস করুন: <code>onClick={handleClick}</code>।</p>', 'ফাংশন পাস করুন, কল করবেন না'),

      h(2, 'ইনলাইন অ্যারো ফাংশন', 'inline-arrow-functions'),
      p('<p>একটি আর্গুমেন্ট প্রয়োজন এমন একটি হ্যান্ডলারের জন্য, হ্যান্ডলারটি সাথে সাথে কল না করে একটি পাস করার প্রচলিত উপায় একটি ইনলাইন অ্যারো ফাংশন:</p>'),
      code('jsx', 'function FruitList({ fruits, onSelect }) {\n  return (\n    <ul>\n      {fruits.map((fruit) => (\n        <li key={fruit} onClick={() => onSelect(fruit)}>\n          {fruit}\n        </li>\n      ))}\n    </ul>\n  );\n}'),

      h(2, 'ইভেন্ট অবজেক্ট', 'the-event-object'),
      p('<p>React প্রতিটি হ্যান্ডলারে একটি <b>synthetic event</b> পাস করে — নেটিভ ব্রাউজার ইভেন্টের চারপাশে একটি ক্রস-ব্রাউজার wrapper, <a href="/bn/javascript/events/">JavaScript Events পাঠ</a> থেকে ইতিমধ্যে জানা একই পরিচিত প্রপার্টি আর মেথডসহ:</p>'),
      code('jsx', 'function Form() {\n  function handleSubmit(e) {\n    e.preventDefault(); // same method, same purpose, as plain JS\n    console.log(\'Submitted\');\n  }\n\n  return <form onSubmit={handleSubmit}><button type="submit">Send</button></form>;\n}'),

      h(2, 'সাধারণ ইভেন্ট', 'common-events'),
      table(
        ['প্রপ', 'কখন ফায়ার করে'],
        [
          ['onClick', 'একটি এলিমেন্ট ক্লিক করা হলে'],
          ['onChange', 'একটি input-এর মান বদলালে'],
          ['onSubmit', 'একটি ফর্ম সাবমিট হলে'],
          ['onMouseEnter / onMouseLeave', 'পয়েন্টার একটি এলিমেন্টে ঢোকা বা বের হওয়া'],
          ['onKeyDown', 'একটি কী চাপা হলে'],
        ]
      ),
      p('<p>এর ঠিক পরের Forms in React পাঠে <code>onChange</code> আর <code>onSubmit</code> সত্যিকারভাবে ব্যবহার করা হবে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'state',
  sortOrder: 9,
  en: {
    title: 'Introduction to State',
    metaTitle: 'React State: useState | Learn Computer Academy',
    metaDescription: 'The useState hook — how a component remembers a value between renders, and why updating it triggers React to re-render.',
    blocks: [
      p('<p>Props (from the earlier Props lesson) let data flow into a component from outside, but a component can\'t change its own props. <b>State</b> is the other half: data a component owns and can change itself, over time — a counter, a form field, whether a menu is open.</p>'),

      h(2, 'Why a Plain Variable Doesn\'t Work'),
      p('<p>A regular JavaScript variable inside a component gets reset to its initial value every single time the component re-renders, and changing it doesn\'t even trigger a re-render in the first place — React has no way to know the value changed:</p>'),
      code('jsx', 'function Counter() {\n  let count = 0; // resets to 0 on every render — this does not work\n\n  function increment() {\n    count = count + 1; // React never finds out this happened\n  }\n\n  return <button onClick={increment}>Clicked {count} times</button>;\n}'),

      h(2, 'useState'),
      p('<p><code>useState</code> solves both problems: it gives a component a value that survives between renders, and a way to update it that tells React to re-render:</p>'),
      code('jsx', 'import { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  function increment() {\n    setCount(count + 1);\n  }\n\n  return <button onClick={increment}>Clicked {count} times</button>;\n}'),
      p('<p><code>useState(0)</code> takes the initial value and returns a pair: the current value (<code>count</code>) and a function to update it (<code>setCount</code>) — the <code>[a, b]</code> array destructuring here is the same syntax from the <a href="/javascript/es6-and-modern-features/">JavaScript ES6 lesson</a>.</p>'),

      h(2, 'Calling the Setter Triggers a Re-Render'),
      p('<p>Calling <code>setCount(...)</code> does two things: it updates the stored value, <i>and</i> tells React to re-run the component function so the UI reflects the new value. This is the actual mechanism behind the "declarative" idea from the Introduction lesson — you never manually touch the DOM; you update state, and React re-renders to match.</p>'),

      h(2, 'Each Component Instance Has Its Own State'),
      code('jsx', 'function App() {\n  return (\n    <div>\n      <Counter />\n      <Counter />\n    </div>\n  );\n}\n// Clicking one Counter never affects the other — each has its own independent state.'),

      callout('note', '<p>A component can have as many <code>useState</code> calls as it needs — one per independent piece of state is the normal pattern, rather than bundling everything into one big object. <code>const [name, setName] = useState(\'\'); const [age, setAge] = useState(0);</code> is completely normal.</p>', 'Multiple useState calls are fine'),
    ],
  },
  bn: {
    title: 'State পরিচিতি',
    metaTitle: 'React State: useState | Learn Computer Academy',
    metaDescription: 'useState হুক — একটি কম্পোনেন্ট কীভাবে render-এর মধ্যে একটি মান মনে রাখে, আর কেন এটি আপডেট করলে React re-render করতে বাধ্য হয়।',
    blocks: [
      p('<p>প্রপস (আগের Props পাঠ থেকে) বাইরে থেকে একটি কম্পোনেন্টে ডেটা প্রবাহিত হতে দেয়, কিন্তু একটি কম্পোনেন্ট নিজের প্রপস বদলাতে পারে না। <b>State</b> হলো অন্য অর্ধেক: এমন ডেটা যা একটি কম্পোনেন্ট নিজে ধরে রাখে আর সময়ের সাথে নিজেই বদলাতে পারে — একটি কাউন্টার, একটি ফর্ম ফিল্ড, একটি মেনু খোলা আছে কিনা।</p>'),

      h(2, 'একটি সাধারণ ভ্যারিয়েবল কেন কাজ করে না', 'why-a-plain-variable-doesnt-work'),
      p('<p>একটি কম্পোনেন্টের ভেতরের একটি সাধারণ JavaScript ভ্যারিয়েবল প্রতিবার কম্পোনেন্ট re-render হলে তার শুরুর মানে রিসেট হয়ে যায়, আর এটি বদলালে প্রথমেই একটি re-render ট্রিগারও হয় না — React জানার কোনো উপায় নেই যে মানটা বদলেছে:</p>'),
      code('jsx', 'function Counter() {\n  let count = 0; // resets to 0 on every render — this does not work\n\n  function increment() {\n    count = count + 1; // React never finds out this happened\n  }\n\n  return <button onClick={increment}>Clicked {count} times</button>;\n}'),

      h(2, 'useState', 'usestate'),
      p('<p><code>useState</code> দুটো সমস্যাই সমাধান করে: এটি একটি কম্পোনেন্টকে render-এর মধ্যে টিকে থাকা একটি মান দেয়, আর সেটা আপডেট করার একটি উপায় দেয় যা React-কে re-render করতে বলে:</p>'),
      code('jsx', 'import { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  function increment() {\n    setCount(count + 1);\n  }\n\n  return <button onClick={increment}>Clicked {count} times</button>;\n}'),
      p('<p><code>useState(0)</code> শুরুর মান নেয় আর একটি জোড়া রিটার্ন করে: বর্তমান মান (<code>count</code>) আর সেটা আপডেট করার একটি ফাংশন (<code>setCount</code>) — এখানে <code>[a, b]</code> অ্যারে ডিস্ট্রাকচারিং <a href="/bn/javascript/es6-and-modern-features/">JavaScript ES6 পাঠ</a>-এর একই সিনট্যাক্স।</p>'),

      h(2, 'Setter কল করলে একটি Re-Render ট্রিগার হয়', 'calling-the-setter-triggers-a-re-render'),
      p('<p><code>setCount(...)</code> কল করলে দুটো জিনিস ঘটে: এটি সংরক্ষিত মান আপডেট করে, <i>আর</i> React-কে বলে কম্পোনেন্ট ফাংশন আবার চালাতে যাতে UI নতুন মান প্রতিফলিত করে। Introduction পাঠের "declarative" ধারণার আসল প্রক্রিয়া এটাই — আপনি কখনো ম্যানুয়ালি DOM স্পর্শ করেন না; আপনি state আপডেট করেন, আর React মিলিয়ে re-render করে।</p>'),

      h(2, 'প্রতিটি কম্পোনেন্ট instance-এর নিজস্ব State আছে', 'each-component-instance-has-its-own-state'),
      code('jsx', 'function App() {\n  return (\n    <div>\n      <Counter />\n      <Counter />\n    </div>\n  );\n}\n// Clicking one Counter never affects the other — each has its own independent state.'),

      callout('note', '<p>একটি কম্পোনেন্টে প্রয়োজন অনুযায়ী যত ইচ্ছা <code>useState</code> কল থাকতে পারে — সবকিছু একটি বড় অবজেক্টে বান্ডেল করার বদলে প্রতিটি স্বাধীন state-এর জন্য একটি করে সাধারণ প্যাটার্ন। <code>const [name, setName] = useState(\'\'); const [age, setAge] = useState(0);</code> সম্পূর্ণ স্বাভাবিক।</p>', 'একাধিক useState কল ঠিক আছে'),
    ],
  },
})

lessons.push({
  slug: 'updating-state',
  sortOrder: 10,
  en: {
    title: 'Updating State: Objects and Arrays',
    metaTitle: 'Updating Object and Array State in React | Learn Computer Academy',
    metaDescription: 'Why React state must be treated as immutable, and the spread-operator patterns for updating objects and arrays without mutating them.',
    blocks: [
      p('<p>Updating a number or string in state is straightforward — <code>setCount(count + 1)</code>. Objects and arrays need one more rule: React state must never be <b>mutated</b> directly.</p>'),

      h(2, 'Why Mutation Breaks React'),
      p('<p>React decides whether to re-render partly by checking if the state value is a <i>different</i> object than before. Mutating the existing object in place keeps it the exact same object reference — React can\'t tell anything changed, and silently skips the re-render:</p>'),
      code('jsx', 'function Profile() {\n  const [user, setUser] = useState({ name: \'Priya\', age: 21 });\n\n  function haveBirthday() {\n    user.age = user.age + 1; // mutates the existing object — DOES NOT re-render\n    setUser(user);            // same reference as before, React sees no change\n  }\n\n  return <button onClick={haveBirthday}>{user.name} is {user.age}</button>;\n}'),

      h(2, 'The Fix: Spread and Replace'),
      p('<p>Create a <i>new</i> object (or array) with the change applied, using the spread operator from the <a href="/javascript/es6-and-modern-features/">JavaScript ES6 lesson</a>, and pass that new object to the setter:</p>'),
      code('jsx', 'function haveBirthday() {\n  setUser({ ...user, age: user.age + 1 }); // a new object, one field changed\n}'),
      p('<p><code>{ ...user, age: user.age + 1 }</code> copies every field from <code>user</code> into a brand-new object, then overwrites <code>age</code> — a genuinely new reference React can compare against the old one.</p>'),

      h(2, 'Updating Arrays the Same Way'),
      table(
        ['Task', 'Don\'t', 'Do'],
        [
          ['Add an item', 'items.push(newItem)', 'setItems([...items, newItem])'],
          ['Remove an item', 'items.splice(i, 1)', 'setItems(items.filter((_, idx) => idx !== i))'],
          ['Update an item', 'items[i].done = true', 'setItems(items.map((item, idx) => idx === i ? { ...item, done: true } : item))'],
        ]
      ),
      code('jsx', 'function TodoList() {\n  const [todos, setTodos] = useState([\n    { id: 1, text: \'Learn React\', done: false },\n  ]);\n\n  function toggleTodo(id) {\n    setTodos(todos.map((todo) =>\n      todo.id === id ? { ...todo, done: !todo.done } : todo\n    ));\n  }\n\n  return (\n    <ul>\n      {todos.map((todo) => (\n        <li key={todo.id} onClick={() => toggleTodo(todo.id)}>\n          {todo.done ? \'✓\' : \'○\'} {todo.text}\n        </li>\n      ))}\n    </ul>\n  );\n}'),

      callout('tip', '<p>Array methods split cleanly into two groups: <code>map()</code>, <code>filter()</code>, and the spread operator (<code>[...arr]</code>) all return a <b>new</b> array, safe for state. <code>push()</code>, <code>splice()</code>, <code>sort()</code>, and direct index assignment (<code>arr[0] = x</code>) all mutate the <b>existing</b> array — never use these directly on state.</p>', 'Non-mutating vs. mutating array methods'),
    ],
  },
  bn: {
    title: 'State আপডেট করা: অবজেক্ট আর অ্যারে',
    metaTitle: 'React-এ অবজেক্ট আর অ্যারে State আপডেট করা | Learn Computer Academy',
    metaDescription: 'কেন React state-কে immutable হিসেবে গণ্য করতে হয়, আর mutate না করে অবজেক্ট আর অ্যারে আপডেট করার spread-অপারেটর প্যাটার্ন।',
    blocks: [
      p('<p>State-এ একটি সংখ্যা বা স্ট্রিং আপডেট করা সহজ — <code>setCount(count + 1)</code>। অবজেক্ট আর অ্যারের জন্য আরও একটি নিয়ম দরকার: React state কখনো সরাসরি <b>mutate</b> করা উচিত নয়।</p>'),

      h(2, 'Mutation কেন React ভেঙে দেয়', 'why-mutation-breaks-react'),
      p('<p>React আংশিকভাবে re-render করবে কিনা তা চেক করে state মান আগের চেয়ে একটি <i>ভিন্ন</i> অবজেক্ট কিনা দেখে। বিদ্যমান অবজেক্ট in place mutate করলে এটি একই অবজেক্ট রেফারেন্স থেকে যায় — React কিছু বদলেছে বলতে পারে না, আর চুপচাপ re-render বাদ দিয়ে দেয়:</p>'),
      code('jsx', 'function Profile() {\n  const [user, setUser] = useState({ name: \'Priya\', age: 21 });\n\n  function haveBirthday() {\n    user.age = user.age + 1; // mutates the existing object — DOES NOT re-render\n    setUser(user);            // same reference as before, React sees no change\n  }\n\n  return <button onClick={haveBirthday}>{user.name} is {user.age}</button>;\n}'),

      h(2, 'সমাধান: Spread আর Replace', 'the-fix-spread-and-replace'),
      p('<p><a href="/bn/javascript/es6-and-modern-features/">JavaScript ES6 পাঠ</a>-এর spread অপারেটর ব্যবহার করে পরিবর্তনসহ একটি <i>নতুন</i> অবজেক্ট (বা অ্যারে) তৈরি করুন, আর সেই নতুন অবজেক্ট setter-এ পাস করুন:</p>'),
      code('jsx', 'function haveBirthday() {\n  setUser({ ...user, age: user.age + 1 }); // a new object, one field changed\n}'),
      p('<p><code>{ ...user, age: user.age + 1 }</code> <code>user</code>-এর প্রতিটি ফিল্ড একটি সম্পূর্ণ নতুন অবজেক্টে কপি করে, তারপর <code>age</code> ওভাররাইট করে — একটি সত্যিকারের নতুন রেফারেন্স যা React পুরনোটার সাথে তুলনা করতে পারে।</p>'),

      h(2, 'অ্যারে একই উপায়ে আপডেট করা', 'updating-arrays-the-same-way'),
      table(
        ['কাজ', 'করবেন না', 'করুন'],
        [
          ['একটি আইটেম যোগ করা', 'items.push(newItem)', 'setItems([...items, newItem])'],
          ['একটি আইটেম সরানো', 'items.splice(i, 1)', 'setItems(items.filter((_, idx) => idx !== i))'],
          ['একটি আইটেম আপডেট করা', 'items[i].done = true', 'setItems(items.map((item, idx) => idx === i ? { ...item, done: true } : item))'],
        ]
      ),
      code('jsx', 'function TodoList() {\n  const [todos, setTodos] = useState([\n    { id: 1, text: \'Learn React\', done: false },\n  ]);\n\n  function toggleTodo(id) {\n    setTodos(todos.map((todo) =>\n      todo.id === id ? { ...todo, done: !todo.done } : todo\n    ));\n  }\n\n  return (\n    <ul>\n      {todos.map((todo) => (\n        <li key={todo.id} onClick={() => toggleTodo(todo.id)}>\n          {todo.done ? \'✓\' : \'○\'} {todo.text}\n        </li>\n      ))}\n    </ul>\n  );\n}'),

      callout('tip', '<p>অ্যারে মেথড পরিষ্কারভাবে দুই ভাগে ভাগ হয়: <code>map()</code>, <code>filter()</code>, আর spread অপারেটর (<code>[...arr]</code>) সবগুলো একটি <b>নতুন</b> অ্যারে রিটার্ন করে, state-এর জন্য নিরাপদ। <code>push()</code>, <code>splice()</code>, <code>sort()</code>, আর সরাসরি index assignment (<code>arr[0] = x</code>) সবগুলো <b>বিদ্যমান</b> অ্যারে mutate করে — state-এ এগুলো সরাসরি কখনো ব্যবহার করবেন না।</p>', 'Non-mutating বনাম mutating অ্যারে মেথড'),
    ],
  },
})

lessons.push({
  slug: 'forms',
  sortOrder: 11,
  en: {
    title: 'Forms in React',
    metaTitle: 'React Forms | Learn Computer Academy',
    metaDescription: 'Building controlled form inputs in React, where state is the single source of truth for what an input displays.',
    blocks: [
      p('<p>An HTML input normally manages its own value internally. In React, the standard pattern — a <b>controlled input</b> — makes state the single source of truth instead, with the input just displaying whatever state says.</p>'),

      h(2, 'A Controlled Text Input'),
      code('jsx', 'function NameForm() {\n  const [name, setName] = useState(\'\');\n\n  return (\n    <input\n      value={name}\n      onChange={(e) => setName(e.target.value)}\n    />\n  );\n}'),
      p('<p>Every keystroke fires <code>onChange</code>, which updates state, which re-renders the input with the new value — visually instant, but it\'s genuinely a round trip through state every time, not the browser\'s own default typing behavior.</p>'),
      callout('warning', '<p>Setting <code>value</code> without an <code>onChange</code> handler makes the input permanently stuck at that value — typing does nothing, since nothing ever updates the state driving <code>value</code>. This is one of the most common early mistakes with controlled inputs.</p>', 'value needs onChange to actually work'),

      h(2, 'Handling Submission'),
      code('jsx', 'function NameForm() {\n  const [name, setName] = useState(\'\');\n\n  function handleSubmit(e) {\n    e.preventDefault(); // stop the browser\'s default full-page reload\n    console.log(\'Submitted:\', name);\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={name} onChange={(e) => setName(e.target.value)} />\n      <button type="submit">Submit</button>\n    </form>\n  );\n}'),

      h(2, 'Multiple Fields'),
      p('<p>One <code>useState</code> object with all the fields, updated by field name, is the common pattern once a form grows past one or two inputs:</p>'),
      code('jsx', 'function SignupForm() {\n  const [formData, setFormData] = useState({ name: \'\', email: \'\' });\n\n  function handleChange(e) {\n    const { name, value } = e.target;\n    setFormData({ ...formData, [name]: value }); // computed property name, from ES6\n  }\n\n  return (\n    <form>\n      <input name="name" value={formData.name} onChange={handleChange} />\n      <input name="email" value={formData.email} onChange={handleChange} />\n    </form>\n  );\n}'),
      p('<p><code>{ ...formData, [name]: value }</code> is exactly the immutable-update pattern from the previous lesson — a new object, one field replaced, using the <code>name</code> attribute to pick which key to update dynamically.</p>'),

      h(2, 'Checkboxes and Selects'),
      code('jsx', 'function Preferences() {\n  const [subscribed, setSubscribed] = useState(false);\n\n  return (\n    <input\n      type="checkbox"\n      checked={subscribed}\n      onChange={(e) => setSubscribed(e.target.checked)} // checked, not value\n    />\n  );\n}'),
    ],
  },
  bn: {
    title: 'React-এ ফর্ম',
    metaTitle: 'React ফর্ম | Learn Computer Academy',
    metaDescription: 'React-এ কন্ট্রোল করা ফর্ম ইনপুট বানানো, যেখানে একটি ইনপুট কী দেখাবে তার একমাত্র সোর্স অফ ট্রুথ হলো state।',
    blocks: [
      p('<p>একটি HTML input সাধারণত নিজের মান নিজে ভেতরে ভেতরে ম্যানেজ করে। React-এ, প্রচলিত প্যাটার্ন — একটি <b>controlled input</b> — এর বদলে state-কে একমাত্র সোর্স অফ ট্রুথ বানায়, ইনপুট শুধু state যা বলে তাই দেখায়।</p>'),

      h(2, 'একটি Controlled টেক্সট ইনপুট', 'a-controlled-text-input'),
      code('jsx', 'function NameForm() {\n  const [name, setName] = useState(\'\');\n\n  return (\n    <input\n      value={name}\n      onChange={(e) => setName(e.target.value)}\n    />\n  );\n}'),
      p('<p>প্রতিটি কীস্ট্রোক <code>onChange</code> ফায়ার করে, যা state আপডেট করে, যা নতুন মান দিয়ে ইনপুট re-render করে — দৃশ্যত তাৎক্ষণিক, কিন্তু এটা প্রতিবার সত্যিকারভাবে state-এর মধ্য দিয়ে একটি round trip, ব্রাউজারের নিজস্ব ডিফল্ট টাইপিং আচরণ নয়।</p>'),
      callout('warning', '<p>একটি <code>onChange</code> হ্যান্ডলার ছাড়া <code>value</code> সেট করলে ইনপুট স্থায়ীভাবে সেই মানে আটকে যায় — টাইপ করলে কিছু হয় না, কারণ <code>value</code> নিয়ন্ত্রণ করা state কখনো আপডেট হয় না। Controlled ইনপুটের সবচেয়ে সাধারণ শুরুর ভুলগুলোর একটি এটি।</p>', 'value আসলেই কাজ করতে onChange দরকার'),

      h(2, 'সাবমিশন হ্যান্ডেল করা', 'handling-submission'),
      code('jsx', 'function NameForm() {\n  const [name, setName] = useState(\'\');\n\n  function handleSubmit(e) {\n    e.preventDefault(); // stop the browser\'s default full-page reload\n    console.log(\'Submitted:\', name);\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={name} onChange={(e) => setName(e.target.value)} />\n      <button type="submit">Submit</button>\n    </form>\n  );\n}'),

      h(2, 'একাধিক ফিল্ড', 'multiple-fields'),
      p('<p>সব ফিল্ডসহ একটি <code>useState</code> অবজেক্ট, ফিল্ডের নাম দিয়ে আপডেট করা, একটি ফর্ম এক-দুইটি ইনপুটের বেশি বড় হয়ে গেলে প্রচলিত প্যাটার্ন:</p>'),
      code('jsx', 'function SignupForm() {\n  const [formData, setFormData] = useState({ name: \'\', email: \'\' });\n\n  function handleChange(e) {\n    const { name, value } = e.target;\n    setFormData({ ...formData, [name]: value }); // computed property name, from ES6\n  }\n\n  return (\n    <form>\n      <input name="name" value={formData.name} onChange={handleChange} />\n      <input name="email" value={formData.email} onChange={handleChange} />\n    </form>\n  );\n}'),
      p('<p><code>{ ...formData, [name]: value }</code> ঠিক আগের পাঠের immutable-আপডেট প্যাটার্ন — একটি নতুন অবজেক্ট, একটি ফিল্ড বদলানো, কোন key ডাইনামিকভাবে আপডেট হবে তা বেছে নিতে <code>name</code> অ্যাট্রিবিউট ব্যবহার করে।</p>'),

      h(2, 'চেকবক্স আর সিলেক্ট', 'checkboxes-and-selects'),
      code('jsx', 'function Preferences() {\n  const [subscribed, setSubscribed] = useState(false);\n\n  return (\n    <input\n      type="checkbox"\n      checked={subscribed}\n      onChange={(e) => setSubscribed(e.target.checked)} // checked, not value\n    />\n  );\n}'),
    ],
  },
})

lessons.push({
  slug: 'useeffect',
  sortOrder: 12,
  en: {
    title: 'The useEffect Hook',
    metaTitle: 'The useEffect Hook in React | Learn Computer Academy',
    metaDescription: 'Running code in response to rendering with useEffect — the dependency array, and cleanup functions.',
    blocks: [
      p('<p>Everything so far happens either during render (computing JSX) or in response to a user event (a click, a keystroke). <b>Effects</b> are for a third case: code that needs to run because a component rendered — talking to something outside React entirely, like an API, a timer, or the browser\'s <code>document</code>.</p>'),

      h(2, 'A Basic Effect'),
      code('jsx', 'import { useState, useEffect } from \'react\';\n\nfunction PageTitle({ title }) {\n  useEffect(() => {\n    document.title = title;\n  });\n\n  return <h1>{title}</h1>;\n}'),
      p('<p>With no second argument, this effect runs after <i>every</i> render — usually more often than actually needed.</p>'),

      h(2, 'The Dependency Array'),
      p('<p>A second argument — an array of values — tells React to only re-run the effect when one of those values has actually changed since the last render:</p>'),
      code('jsx', 'useEffect(() => {\n  document.title = title;\n}, [title]); // only re-runs when title changes, not on every render'),
      table(
        ['Dependency array', 'Runs'],
        [
          ['(none)', 'After every single render'],
          ['[]', 'Once, right after the first render, never again'],
          ['[title]', 'After the first render, and again whenever title changes'],
        ]
      ),
      callout('warning', '<p>ESLint\'s React rules will flag a dependency array that\'s missing a value the effect actually uses — this isn\'t pedantry, it\'s catching a real bug: the effect would keep using a stale, outdated value from an earlier render instead of the current one. Include everything the effect reads from outside itself.</p>', 'Don\'t silence the exhaustive-deps warning'),

      h(2, 'Cleanup Functions'),
      p('<p>Returning a function from an effect gives React something to run before the effect runs again, and when the component is removed from the page — the standard place to cancel a timer, close a connection, or remove an event listener:</p>'),
      code('jsx', 'function Timer() {\n  const [seconds, setSeconds] = useState(0);\n\n  useEffect(() => {\n    const id = setInterval(() => setSeconds((s) => s + 1), 1000);\n    return () => clearInterval(id); // cleanup — runs when the component unmounts\n  }, []);\n\n  return <p>{seconds} seconds elapsed</p>;\n}'),
      p('<p>Without this cleanup, the interval would keep running forever, even after the <code>Timer</code> component is gone — a genuine memory leak, not just a style issue.</p>'),

      h(2, 'What useEffect Is Not For'),
      p('<p>If a value can be calculated directly from props or state during render, calculate it during render — don\'t reach for <code>useEffect</code> to sync one piece of state from another. The next lesson, Fetching Data, is <code>useEffect</code>\'s single most common legitimate use.</p>'),
    ],
  },
  bn: {
    title: 'useEffect হুক',
    metaTitle: 'React-এ useEffect হুক | Learn Computer Academy',
    metaDescription: 'useEffect দিয়ে render-এর সাড়ায় কোড চালানো — dependency array, আর cleanup ফাংশন।',
    blocks: [
      p('<p>এখন পর্যন্ত সবকিছু হয় render-এর সময় (JSX হিসাব করা) নয়তো একটি ব্যবহারকারীর ইভেন্টের সাড়ায় (একটি ক্লিক, একটি কীস্ট্রোক) ঘটে। <b>Effect</b> তৃতীয় একটি কেসের জন্য: এমন কোড যা একটি কম্পোনেন্ট render হয়েছে বলে চালানো দরকার — একেবারে React-এর বাইরের কিছুর সাথে কথা বলা, যেমন একটি API, একটি টাইমার, বা ব্রাউজারের <code>document</code>।</p>'),

      h(2, 'একটি বেসিক Effect', 'a-basic-effect'),
      code('jsx', 'import { useState, useEffect } from \'react\';\n\nfunction PageTitle({ title }) {\n  useEffect(() => {\n    document.title = title;\n  });\n\n  return <h1>{title}</h1>;\n}'),
      p('<p>দ্বিতীয় আর্গুমেন্ট ছাড়া, এই effect <i>প্রতিটি</i> render-এর পরে চলে — সাধারণত আসলে যা প্রয়োজন তার চেয়ে বেশি বার।</p>'),

      h(2, 'Dependency Array', 'the-dependency-array'),
      p('<p>দ্বিতীয় একটি আর্গুমেন্ট — মানের একটি অ্যারে — React-কে বলে শুধু তখনই effect আবার চালাতে যখন সেই মানগুলোর একটি শেষ render থেকে আসলেই বদলেছে:</p>'),
      code('jsx', 'useEffect(() => {\n  document.title = title;\n}, [title]); // only re-runs when title changes, not on every render'),
      table(
        ['Dependency array', 'চলে'],
        [
          ['(কোনোটা নেই)', 'প্রতিটি একক render-এর পরে'],
          ['[]', 'একবার, প্রথম render-এর ঠিক পরে, আর কখনো না'],
          ['[title]', 'প্রথম render-এর পরে, আর যখনই title বদলায় তখনও'],
        ]
      ),
      callout('warning', '<p>ESLint-এর React নিয়ম এমন একটি dependency array flag করবে যাতে effect আসলে ব্যবহার করে এমন একটি মান নেই — এটা কোনো খুঁতখুঁতে নিয়ম নয়, এটা একটি আসল বাগ ধরছে: effect বর্তমান মানের বদলে আগের render-এর একটি stale, পুরনো মান ব্যবহার করতে থাকবে। effect নিজের বাইরে থেকে যা পড়ে তার সবকিছু অন্তর্ভুক্ত করুন।</p>', 'exhaustive-deps warning চুপ করাবেন না'),

      h(2, 'Cleanup ফাংশন', 'cleanup-functions'),
      p('<p>একটি effect থেকে একটি ফাংশন রিটার্ন করলে React-কে এটি আবার চালানোর আগে, আর কম্পোনেন্টটি পাতা থেকে সরানো হলে চালানোর মতো কিছু দেয় — একটি টাইমার বাতিল করা, একটি কানেকশন বন্ধ করা, বা একটি ইভেন্ট লিসেনার সরানোর প্রচলিত জায়গা:</p>'),
      code('jsx', 'function Timer() {\n  const [seconds, setSeconds] = useState(0);\n\n  useEffect(() => {\n    const id = setInterval(() => setSeconds((s) => s + 1), 1000);\n    return () => clearInterval(id); // cleanup — runs when the component unmounts\n  }, []);\n\n  return <p>{seconds} seconds elapsed</p>;\n}'),
      p('<p>এই cleanup ছাড়া, <code>Timer</code> কম্পোনেন্ট চলে যাওয়ার পরেও ইন্টারভালটা চলতেই থাকবে — একটি প্রকৃত মেমরি লিক, শুধু একটি স্টাইল সমস্যা নয়।</p>'),

      h(2, 'useEffect কীসের জন্য নয়', 'what-useeffect-is-not-for'),
      p('<p>একটি মান যদি render-এর সময় props বা state থেকে সরাসরি হিসাব করা যায়, render-এর সময় সেটা হিসাব করুন — এক state থেকে আরেকটি sync করতে <code>useEffect</code>-এর দিকে যাবেন না। পরের পাঠ, Fetching Data, <code>useEffect</code>-এর সবচেয়ে সাধারণ বৈধ ব্যবহার।</p>'),
    ],
  },
})

lessons.push({
  slug: 'fetching-data',
  sortOrder: 13,
  en: {
    title: 'Fetching Data from an API',
    metaTitle: 'Fetching Data in React | Learn Computer Academy',
    metaDescription: 'The useEffect + fetch pattern for loading data from an API, and handling loading and error states.',
    blocks: [
      p('<p>This is <code>useEffect</code>\'s single most common real use: fetching data isn\'t something a component does <i>during</i> render (render must stay a pure calculation of JSX) — it\'s a side effect that happens <i>because</i> the component rendered, which is exactly what effects are for.</p>'),

      h(2, 'The Basic Pattern'),
      p('<p>Three pieces of state — the data itself, whether it\'s still loading, and any error — plus a <code>fetch</code> call inside an effect, using the <code>fetch()</code> and <code>async</code>/<code>await</code> you already know from the <a href="/javascript/fetch-api/">JavaScript Fetch API lesson</a>:</p>'),
      code('jsx', 'function UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    setLoading(true);\n    fetch(`/api/users/${userId}`)\n      .then((res) => res.json())\n      .then((data) => setUser(data))\n      .catch((err) => setError(err.message))\n      .finally(() => setLoading(false));\n  }, [userId]);\n\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>Error: {error}</p>;\n  return <h1>{user.name}</h1>;\n}'),
      p('<p><code>[userId]</code> as the dependency matters specifically here: without it, the effect only fetches once, ever — switching to a different user\'s profile would keep showing the first user\'s data.</p>'),

      img(
        'docs/img/react/fetching-data-1',
        'Isometric diagram showing a component rendering, an effect firing off a request to a small API server icon, and the response flowing back to update the component\'s state',
        1024, 768,
        'A component renders, an effect fires the request, and the response updates state — which triggers another render.'
      ),

      h(2, 'Handling a Changed or Unmounted Component'),
      p('<p>If <code>userId</code> changes again before the first request finishes, or the component unmounts entirely, the earlier request\'s result can still arrive and incorrectly update state that no longer applies. A cleanup flag (from the useEffect lesson) guards against this:</p>'),
      code('jsx', 'useEffect(() => {\n  let ignore = false;\n  setLoading(true);\n\n  fetch(`/api/users/${userId}`)\n    .then((res) => res.json())\n    .then((data) => {\n      if (!ignore) setUser(data); // skip if this effect is stale\n    })\n    .finally(() => {\n      if (!ignore) setLoading(false);\n    });\n\n  return () => {\n    ignore = true; // marks this specific request as stale\n  };\n}, [userId]);'),

      h(2, 'async Directly Inside useEffect'),
      p('<p>The effect function itself can\'t be <code>async</code> (it would return a Promise instead of a cleanup function), so an inner function is the standard workaround:</p>'),
      code('jsx', 'useEffect(() => {\n  async function loadUser() {\n    const res = await fetch(`/api/users/${userId}`);\n    const data = await res.json();\n    setUser(data);\n  }\n  loadUser();\n}, [userId]);'),
    ],
  },
  bn: {
    title: 'একটি API থেকে ডেটা Fetch করা',
    metaTitle: 'React-এ ডেটা Fetch করা | Learn Computer Academy',
    metaDescription: 'একটি API থেকে ডেটা লোড করার useEffect + fetch প্যাটার্ন, আর loading আর error স্টেট হ্যান্ডেল করা।',
    blocks: [
      p('<p>এটাই <code>useEffect</code>-এর সবচেয়ে সাধারণ বাস্তব ব্যবহার: ডেটা fetch করা render-এর <i>সময়</i> একটি কম্পোনেন্টের করার মতো কিছু নয় (render-কে JSX-এর একটি pure হিসাব থাকতে হবে) — এটি একটি side effect যা কম্পোনেন্ট render হয়েছে <i>বলে</i> ঘটে, effect ঠিক এটার জন্যই।</p>'),

      h(2, 'বেসিক প্যাটার্ন', 'the-basic-pattern'),
      p('<p>তিনটি state — ডেটা নিজেই, এটা এখনও লোড হচ্ছে কিনা, আর যেকোনো error — সাথে effect-এর ভেতরে একটি <code>fetch</code> কল, <a href="/bn/javascript/fetch-api/">JavaScript Fetch API পাঠ</a> থেকে ইতিমধ্যে জানা <code>fetch()</code> আর <code>async</code>/<code>await</code> ব্যবহার করে:</p>'),
      code('jsx', 'function UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    setLoading(true);\n    fetch(`/api/users/${userId}`)\n      .then((res) => res.json())\n      .then((data) => setUser(data))\n      .catch((err) => setError(err.message))\n      .finally(() => setLoading(false));\n  }, [userId]);\n\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>Error: {error}</p>;\n  return <h1>{user.name}</h1>;\n}'),
      p('<p>dependency হিসেবে <code>[userId]</code> এখানে নির্দিষ্টভাবে গুরুত্বপূর্ণ: এটা ছাড়া, effect শুধু একবারই fetch করে, চিরকালের জন্য — একটি ভিন্ন ব্যবহারকারীর প্রোফাইলে বদলালে প্রথম ব্যবহারকারীর ডেটা দেখাতেই থাকবে।</p>'),

      img(
        'docs/img/react/fetching-data-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে একটি কম্পোনেন্ট render হচ্ছে, একটি effect একটি ছোট API সার্ভার আইকনে একটি রিকোয়েস্ট পাঠাচ্ছে, আর রেসপন্স ফিরে এসে কম্পোনেন্টের state আপডেট করছে',
        1024, 768,
        'একটি কম্পোনেন্ট render হয়, একটি effect রিকোয়েস্ট পাঠায়, আর রেসপন্স state আপডেট করে — যা আরেকটি render ট্রিগার করে।'
      ),

      h(2, 'একটি বদলে যাওয়া বা Unmount হওয়া কম্পোনেন্ট হ্যান্ডেল করা', 'handling-a-changed-or-unmounted-component'),
      p('<p>প্রথম রিকোয়েস্ট শেষ হওয়ার আগেই <code>userId</code> আবার বদলালে, বা কম্পোনেন্টটি পুরোপুরি unmount হয়ে গেলে, আগের রিকোয়েস্টের ফলাফল তখনও এসে ভুলভাবে এমন state আপডেট করতে পারে যা আর প্রযোজ্য নয়। (useEffect পাঠ থেকে) একটি cleanup ফ্ল্যাগ এটা থেকে রক্ষা করে:</p>'),
      code('jsx', 'useEffect(() => {\n  let ignore = false;\n  setLoading(true);\n\n  fetch(`/api/users/${userId}`)\n    .then((res) => res.json())\n    .then((data) => {\n      if (!ignore) setUser(data); // skip if this effect is stale\n    })\n    .finally(() => {\n      if (!ignore) setLoading(false);\n    });\n\n  return () => {\n    ignore = true; // marks this specific request as stale\n  };\n}, [userId]);'),

      h(2, 'সরাসরি useEffect-এর ভেতরে async', 'async-directly-inside-useeffect'),
      p('<p>effect ফাংশন নিজে <code>async</code> হতে পারে না (এটা একটি cleanup ফাংশনের বদলে একটি Promise রিটার্ন করবে), তাই একটি ভেতরের ফাংশন প্রচলিত সমাধান:</p>'),
      code('jsx', 'useEffect(() => {\n  async function loadUser() {\n    const res = await fetch(`/api/users/${userId}`);\n    const data = await res.json();\n    setUser(data);\n  }\n  loadUser();\n}, [userId]);'),
    ],
  },
})

lessons.push({
  slug: 'lifting-state-up',
  sortOrder: 14,
  en: {
    title: 'Lifting State Up',
    metaTitle: 'Lifting State Up in React | Learn Computer Academy',
    metaDescription: 'Sharing state between sibling components by moving it to their closest common parent — React\'s standard pattern for coordinated components.',
    blocks: [
      p('<p>State lives inside one component by default, invisible to every other component — including its own siblings. When two components need to share or coordinate on the same piece of state, the standard fix is <b>lifting state up</b>: moving it to their closest common parent.</p>'),

      h(2, 'The Problem'),
      p('<p>Two sibling components, each with their own separate state, can\'t see or affect each other at all:</p>'),
      code('jsx', 'function TemperatureInput() {\n  const [value, setValue] = useState(\'\');\n  return <input value={value} onChange={(e) => setValue(e.target.value)} />;\n}\n\nfunction App() {\n  return (\n    <div>\n      <TemperatureInput />\n      <TemperatureInput /> {/* Completely separate state — they can\'t stay in sync */}\n    </div>\n  );\n}'),

      h(2, 'The Fix: Move State to the Parent'),
      p('<p>Move the <code>useState</code> call up to <code>App</code>, and pass both the value and a way to change it down as props:</p>'),
      code('jsx', 'function TemperatureInput({ value, onChange }) {\n  return <input value={value} onChange={(e) => onChange(e.target.value)} />;\n}\n\nfunction App() {\n  const [temperature, setTemperature] = useState(\'\');\n\n  return (\n    <div>\n      <TemperatureInput value={temperature} onChange={setTemperature} />\n      <p>Current: {temperature}</p> {/* Now this can see it too */}\n    </div>\n  );\n}'),
      p('<p><code>TemperatureInput</code> no longer owns any state at all — it just displays whatever <code>value</code> it\'s given, and reports changes upward through <code>onChange</code>. A component like this, with no state of its own, is often called a <b>controlled component</b> — the same idea as a controlled form input from the earlier Forms lesson, generalized to any component.</p>'),

      img(
        'docs/img/react/lifting-state-up-1',
        'Isometric diagram showing a parent component box at the top holding a piece of state, with an arrow labeled props flowing down to two child component boxes, and a second arrow labeled callback flowing back up from one child to the parent',
        1024, 768,
        'State lives in the shared parent; data flows down as props, changes flow back up through callback functions.'
      ),

      h(2, 'Data Down, Events Up'),
      p('<p>This is the general shape of how data moves through a React tree, and it\'s worth naming explicitly: <b>data flows down</b> through props, and <b>changes flow up</b> through callback functions passed as props. React deliberately has no built-in way for a child to directly reach up and change a parent\'s state — this one-way flow is what keeps a large component tree\'s behavior traceable.</p>'),

      callout('note', '<p>The Context API lesson later in this section covers the other tool for sharing state — useful specifically when lifting state up would mean passing props through many layers of components that don\'t otherwise need them.</p>', 'When lifting state up isn\'t enough'),
    ],
  },
  bn: {
    title: 'State উপরে তোলা',
    metaTitle: 'React-এ State উপরে তোলা | Learn Computer Academy',
    metaDescription: 'সিবলিং কম্পোনেন্টের মধ্যে state শেয়ার করা তাদের নিকটতম সাধারণ parent-এ সরিয়ে — সমন্বিত কম্পোনেন্টের জন্য React-এর প্রচলিত প্যাটার্ন।',
    blocks: [
      p('<p>State ডিফল্টভাবে একটি কম্পোনেন্টের ভেতরে থাকে, বাকি প্রতিটি কম্পোনেন্টের কাছে অদৃশ্য — এমনকি নিজের সিবলিংদের কাছেও। দুটো কম্পোনেন্টের একই state শেয়ার বা সমন্বয় করার দরকার হলে, প্রচলিত সমাধান হলো <b>state উপরে তোলা</b>: এটাকে তাদের নিকটতম সাধারণ parent-এ সরানো।</p>'),

      h(2, 'সমস্যা', 'the-problem'),
      p('<p>দুটো সিবলিং কম্পোনেন্ট, প্রতিটির নিজস্ব আলাদা state, একে অপরকে একদমই দেখতে বা প্রভাবিত করতে পারে না:</p>'),
      code('jsx', 'function TemperatureInput() {\n  const [value, setValue] = useState(\'\');\n  return <input value={value} onChange={(e) => setValue(e.target.value)} />;\n}\n\nfunction App() {\n  return (\n    <div>\n      <TemperatureInput />\n      <TemperatureInput /> {/* Completely separate state — they can\'t stay in sync */}\n    </div>\n  );\n}'),

      h(2, 'সমাধান: State-কে Parent-এ সরানো', 'the-fix-move-state-to-the-parent'),
      p('<p><code>useState</code> কলটি <code>App</code>-এ তুলুন, আর মান আর সেটা বদলানোর একটি উপায় দুটোই props হিসেবে নিচে পাস করুন:</p>'),
      code('jsx', 'function TemperatureInput({ value, onChange }) {\n  return <input value={value} onChange={(e) => onChange(e.target.value)} />;\n}\n\nfunction App() {\n  const [temperature, setTemperature] = useState(\'\');\n\n  return (\n    <div>\n      <TemperatureInput value={temperature} onChange={setTemperature} />\n      <p>Current: {temperature}</p> {/* Now this can see it too */}\n    </div>\n  );\n}'),
      p('<p><code>TemperatureInput</code> আর একদমই কোনো state ধরে রাখে না — এটা শুধু যে <code>value</code> দেওয়া হয়েছে তা দেখায়, আর <code>onChange</code>-এর মাধ্যমে উপরে পরিবর্তন জানায়। এরকম একটি কম্পোনেন্ট, নিজের কোনো state ছাড়া, প্রায়ই একটি <b>controlled component</b> বলা হয় — আগের Forms পাঠের একটি controlled form input-এর একই ধারণা, যেকোনো কম্পোনেন্টে সাধারণীকৃত।</p>'),

      img(
        'docs/img/react/lifting-state-up-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে উপরে একটি parent কম্পোনেন্ট বক্স একটি state ধরে আছে, props লেবেলযুক্ত একটি তীর দুটো child কম্পোনেন্ট বক্সে নিচে যাচ্ছে, আর callback লেবেলযুক্ত একটি দ্বিতীয় তীর একটি child থেকে parent-এ ফিরে আসছে',
        1024, 768,
        'State থাকে শেয়ার করা parent-এ; ডেটা props হিসেবে নিচে যায়, পরিবর্তন callback ফাংশনের মাধ্যমে ফিরে উপরে আসে।'
      ),

      h(2, 'ডেটা নিচে, ইভেন্ট উপরে', 'data-down-events-up'),
      p('<p>একটি React ট্রি জুড়ে ডেটা কীভাবে চলে তার এটাই সাধারণ আকৃতি, আর এটা স্পষ্টভাবে নাম দেওয়ার মতো: <b>ডেটা নিচে যায়</b> props-এর মাধ্যমে, আর <b>পরিবর্তন উপরে আসে</b> props হিসেবে পাস করা callback ফাংশনের মাধ্যমে। একটি child-এর সরাসরি উপরে পৌঁছে একটি parent-এর state বদলানোর কোনো বিল্ট-ইন উপায় React-এ ইচ্ছাকৃতভাবে নেই — এই এক-মুখী প্রবাহই একটি বড় কম্পোনেন্ট ট্রির আচরণকে ট্রেসযোগ্য রাখে।</p>'),

      callout('note', '<p>এই অংশের পরের Context API পাঠে state শেয়ার করার অন্য টুল দেখানো হবে — নির্দিষ্টভাবে দরকারি যখন state উপরে তোলার মানে হবে অনেকগুলো কম্পোনেন্ট স্তর জুড়ে props পাস করা যাদের অন্যথায় এটার দরকারই নেই।</p>', 'যখন state উপরে তোলা যথেষ্ট নয়'),
    ],
  },
})

lessons.push({
  slug: 'composition',
  sortOrder: 15,
  en: {
    title: 'Component Composition',
    metaTitle: 'Component Composition in React | Learn Computer Academy',
    metaDescription: 'Building flexible components by composing them with the children prop, instead of reaching for inheritance.',
    blocks: [
      p('<p>Coming from class-based OOP (the <a href="/javascript/classes-oop/">JavaScript Classes and OOP lesson</a>), reusing behavior across components might suggest inheritance — one component extending another. React deliberately doesn\'t work that way; <b>composition</b>, building components out of other components, is the idiomatic approach for basically everything.</p>'),

      h(2, 'Composing with children'),
      p('<p>The <code>children</code> prop from the Props lesson is the main composition tool — a wrapper component that doesn\'t need to know anything about what\'s inside it:</p>'),
      code('jsx', 'function Card({ children }) {\n  return <div className="card">{children}</div>;\n}\n\nfunction App() {\n  return (\n    <Card>\n      <h2>Title</h2>\n      <p>Any content at all can go here.</p>\n    </Card>\n  );\n}'),
      p('<p><code>Card</code> works identically whether it wraps a paragraph, a form, or another component entirely — it never needed to know.</p>'),

      h(2, 'Multiple Named Slots'),
      p('<p>When a component needs more than one distinct content area, passing JSX through regular props (not just <code>children</code>) covers it — any prop can hold JSX, not only strings and numbers:</p>'),
      code('jsx', 'function SplitPanel({ left, right }) {\n  return (\n    <div style={{ display: \'flex\' }}>\n      <div>{left}</div>\n      <div>{right}</div>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <SplitPanel\n      left={<Sidebar />}\n      right={<MainContent />}\n    />\n  );\n}'),

      h(2, 'Specialization Through Composition'),
      p('<p>A more specific component can be built by wrapping a more general one, instead of extending it:</p>'),
      code('jsx', 'function Dialog({ title, children }) {\n  return (\n    <div className="dialog">\n      <h2>{title}</h2>\n      {children}\n    </div>\n  );\n}\n\nfunction WelcomeDialog() {\n  return (\n    <Dialog title="Welcome!">\n      <p>Thanks for signing up.</p>\n    </Dialog>\n  );\n}'),

      callout('tip', '<p>If you find yourself wanting a base component with several near-identical variants, composing a specific component around a general one (as above) is almost always simpler to reason about in React than a class hierarchy would be — there\'s no chain of parent behavior to trace through, just components calling components.</p>', 'Prefer composition over a class-style hierarchy'),
    ],
  },
  bn: {
    title: 'কম্পোনেন্ট কম্পোজিশন',
    metaTitle: 'React-এ কম্পোনেন্ট কম্পোজিশন | Learn Computer Academy',
    metaDescription: 'ইনহেরিটেন্সের দিকে না গিয়ে children প্রপ দিয়ে কম্পোনেন্ট কম্পোজ করে নমনীয় কম্পোনেন্ট বানানো।',
    blocks: [
      p('<p>ক্লাস-ভিত্তিক OOP (<a href="/bn/javascript/classes-oop/">JavaScript Classes and OOP পাঠ</a>) থেকে আসার সময়, কম্পোনেন্ট জুড়ে আচরণ পুনঃব্যবহার করা হয়তো ইনহেরিটেন্সের কথা মনে করাতে পারে — একটি কম্পোনেন্ট আরেকটিকে extend করছে। React ইচ্ছাকৃতভাবে সেভাবে কাজ করে না; <b>কম্পোজিশন</b>, অন্য কম্পোনেন্ট দিয়ে কম্পোনেন্ট তৈরি করা, মোটামুটি সবকিছুর জন্য idiomatic পদ্ধতি।</p>'),

      h(2, 'children দিয়ে কম্পোজ করা', 'composing-with-children'),
      p('<p>Props পাঠের <code>children</code> প্রপ মূল কম্পোজিশন টুল — একটি wrapper কম্পোনেন্ট যার ভেতরে কী আছে তা নিয়ে কিছু জানার দরকার নেই:</p>'),
      code('jsx', 'function Card({ children }) {\n  return <div className="card">{children}</div>;\n}\n\nfunction App() {\n  return (\n    <Card>\n      <h2>Title</h2>\n      <p>Any content at all can go here.</p>\n    </Card>\n  );\n}'),
      p('<p><code>Card</code> এটা একটি প্যারাগ্রাফ মোড়ায়, একটি ফর্ম, বা সম্পূর্ণ আরেকটি কম্পোনেন্ট — একইভাবে কাজ করে — এটা কখনো জানার দরকার হয়নি।</p>'),

      h(2, 'একাধিক নামযুক্ত স্লট', 'multiple-named-slots'),
      p('<p>একটি কম্পোনেন্টের একাধিক আলাদা কন্টেন্ট এরিয়া দরকার হলে, সাধারণ props-এর মাধ্যমে (শুধু <code>children</code> নয়) JSX পাস করা এটা কভার করে — শুধু স্ট্রিং আর সংখ্যা নয়, যেকোনো প্রপ JSX ধরে রাখতে পারে:</p>'),
      code('jsx', 'function SplitPanel({ left, right }) {\n  return (\n    <div style={{ display: \'flex\' }}>\n      <div>{left}</div>\n      <div>{right}</div>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <SplitPanel\n      left={<Sidebar />}\n      right={<MainContent />}\n    />\n  );\n}'),

      h(2, 'কম্পোজিশনের মাধ্যমে বিশেষায়ন', 'specialization-through-composition'),
      p('<p>একটি বেশি নির্দিষ্ট কম্পোনেন্ট extend না করে একটি বেশি সাধারণ কম্পোনেন্ট মুড়িয়ে তৈরি করা যায়:</p>'),
      code('jsx', 'function Dialog({ title, children }) {\n  return (\n    <div className="dialog">\n      <h2>{title}</h2>\n      {children}\n    </div>\n  );\n}\n\nfunction WelcomeDialog() {\n  return (\n    <Dialog title="Welcome!">\n      <p>Thanks for signing up.</p>\n    </Dialog>\n  );\n}'),

      callout('tip', '<p>একটি বেস কম্পোনেন্ট আর এর বেশ কয়েকটি প্রায়-অভিন্ন ভ্যারিয়েন্ট চাইলে, একটি সাধারণ কম্পোনেন্টের চারপাশে একটি নির্দিষ্ট কম্পোনেন্ট কম্পোজ করা (উপরের মতো) React-এ প্রায় সবসময় একটি ক্লাস hierarchy-র চেয়ে যুক্তি করা সহজ — ট্রেস করার মতো parent আচরণের কোনো চেইন নেই, শুধু কম্পোনেন্ট কম্পোনেন্ট কল করছে।</p>', 'ক্লাস-স্টাইল hierarchy-র চেয়ে কম্পোজিশন প্রাধান্য দিন'),
    ],
  },
})

lessons.push({
  slug: 'fragments-and-portals',
  sortOrder: 16,
  en: {
    title: 'Fragments and Portals',
    metaTitle: 'React Fragments and Portals | Learn Computer Academy',
    metaDescription: 'Grouping elements without adding an extra wrapper DOM node with Fragments, and rendering outside the normal component tree with Portals.',
    blocks: [
      p('<p>Two small, specific tools that solve two unrelated problems: satisfying JSX\'s one-root-element rule without adding clutter to the page, and rendering something outside where it\'s written in the component tree.</p>'),

      h(2, 'The Problem Fragments Solve'),
      p('<p>The JSX Syntax lesson showed that a component can only return one root element — the usual fix is wrapping everything in a <code>&lt;div&gt;</code>. But that extra <code>&lt;div&gt;</code> becomes a real element in the actual page, which can break CSS that expects specific parent-child relationships (a CSS grid, for instance, where every direct child matters):</p>'),
      code('jsx', 'function TableRow() {\n  return (\n    <tr>\n      {/* An extra <div> here would be invalid HTML inside a <tr> */}\n    </tr>\n  );\n}'),

      h(2, 'Fragment Syntax'),
      p('<p>A <b>Fragment</b> groups elements the same way a <code>&lt;div&gt;</code> would, but leaves no trace in the actual DOM:</p>'),
      code('jsx', 'import { Fragment } from \'react\';\n\nfunction ItemDetails() {\n  return (\n    <Fragment>\n      <dt>Name</dt>\n      <dd>Priya</dd>\n    </Fragment>\n  );\n}\n\n// The shorthand — used almost everywhere in real code:\nfunction ItemDetails() {\n  return (\n    <>\n      <dt>Name</dt>\n      <dd>Priya</dd>\n    </>\n  );\n}'),
      callout('note', '<p>The <code>&lt;&gt;...&lt;/&gt;</code> shorthand can\'t take a <code>key</code> prop — inside a <code>.map()</code> that needs one (from the Rendering Lists and Keys lesson), use the full <code>&lt;Fragment key={...}&gt;</code> form instead.</p>', 'Shorthand has one limitation'),

      h(2, 'Portals: Rendering Outside the Tree'),
      p('<p>A <b>portal</b> renders a component\'s output into a different DOM node entirely, while it stays in its normal place in the React component tree for everything else (props, context, event bubbling). This solves a real CSS problem: a modal or tooltip nested deep inside a component with <code>overflow: hidden</code> or a constrained <code>z-index</code> can visually escape that container by rendering directly into <code>document.body</code> instead:</p>'),
      code('jsx', 'import { createPortal } from \'react-dom\';\n\nfunction Modal({ children }) {\n  return createPortal(\n    <div className="modal-overlay">{children}</div>,\n    document.body\n  );\n}'),
      p('<p><code>Modal</code> can still be written and used exactly like any other component — <code>&lt;Modal&gt;...&lt;/Modal&gt;</code> — nothing about how it\'s called changes; only where its markup physically ends up in the DOM does.</p>'),
    ],
  },
  bn: {
    title: 'Fragment আর Portal',
    metaTitle: 'React Fragment আর Portal | Learn Computer Academy',
    metaDescription: 'Fragment দিয়ে একটি অতিরিক্ত wrapper DOM node যোগ না করে এলিমেন্ট গ্রুপ করা, আর Portal দিয়ে সাধারণ কম্পোনেন্ট ট্রির বাইরে রেন্ডার করা।',
    blocks: [
      p('<p>দুটো ছোট, নির্দিষ্ট টুল যা দুটো অসম্পর্কিত সমস্যা সমাধান করে: পাতায় জঞ্জাল যোগ না করে JSX-এর এক-root-এলিমেন্ট নিয়ম মেনে চলা, আর কম্পোনেন্ট ট্রিতে যেখানে লেখা আছে তার বাইরে কিছু রেন্ডার করা।</p>'),

      h(2, 'Fragment যে সমস্যা সমাধান করে', 'the-problem-fragments-solve'),
      p('<p>JSX Syntax পাঠে দেখানো হয়েছিল একটি কম্পোনেন্ট শুধু একটি root এলিমেন্ট রিটার্ন করতে পারে — সাধারণ সমাধান হলো সবকিছু একটি <code>&lt;div&gt;</code>-এ মোড়ানো। কিন্তু সেই অতিরিক্ত <code>&lt;div&gt;</code> আসল পাতায় একটি প্রকৃত এলিমেন্ট হয়ে যায়, যা নির্দিষ্ট parent-child সম্পর্ক প্রত্যাশা করা CSS ভেঙে দিতে পারে (উদাহরণস্বরূপ একটি CSS grid, যেখানে প্রতিটি সরাসরি child গুরুত্বপূর্ণ):</p>'),
      code('jsx', 'function TableRow() {\n  return (\n    <tr>\n      {/* An extra <div> here would be invalid HTML inside a <tr> */}\n    </tr>\n  );\n}'),

      h(2, 'Fragment সিনট্যাক্স', 'fragment-syntax'),
      p('<p>একটি <b>Fragment</b> একটি <code>&lt;div&gt;</code> যেভাবে করত সেভাবেই এলিমেন্ট গ্রুপ করে, কিন্তু আসল DOM-এ কোনো চিহ্ন রেখে যায় না:</p>'),
      code('jsx', 'import { Fragment } from \'react\';\n\nfunction ItemDetails() {\n  return (\n    <Fragment>\n      <dt>Name</dt>\n      <dd>Priya</dd>\n    </Fragment>\n  );\n}\n\n// The shorthand — used almost everywhere in real code:\nfunction ItemDetails() {\n  return (\n    <>\n      <dt>Name</dt>\n      <dd>Priya</dd>\n    </>\n  );\n}'),
      callout('note', '<p><code>&lt;&gt;...&lt;/&gt;</code> শর্টহ্যান্ড একটি <code>key</code> প্রপ নিতে পারে না — (Rendering Lists and Keys পাঠ থেকে) একটির দরকার এমন একটি <code>.map()</code>-এর ভেতরে, এর বদলে সম্পূর্ণ <code>&lt;Fragment key={...}&gt;</code> রূপ ব্যবহার করুন।</p>', 'শর্টহ্যান্ডের একটি সীমাবদ্ধতা আছে'),

      h(2, 'Portal: ট্রির বাইরে রেন্ডার করা', 'portals-rendering-outside-the-tree'),
      p('<p>একটি <b>portal</b> একটি কম্পোনেন্টের আউটপুট সম্পূর্ণ ভিন্ন একটি DOM node-এ রেন্ডার করে, যদিও এটা বাকি সবকিছুর জন্য (props, context, ইভেন্ট bubbling) React কম্পোনেন্ট ট্রিতে তার স্বাভাবিক জায়গায় থাকে। এটা একটি আসল CSS সমস্যা সমাধান করে: <code>overflow: hidden</code> বা একটি সীমাবদ্ধ <code>z-index</code>-সহ একটি কম্পোনেন্টের গভীরে নেস্ট করা একটি মোডাল বা টুলটিপ এর বদলে সরাসরি <code>document.body</code>-তে রেন্ডার করে সেই কন্টেইনার থেকে দৃশ্যত পালাতে পারে:</p>'),
      code('jsx', 'import { createPortal } from \'react-dom\';\n\nfunction Modal({ children }) {\n  return createPortal(\n    <div className="modal-overlay">{children}</div>,\n    document.body\n  );\n}'),
      p('<p><code>Modal</code> তবুও ঠিক অন্য যেকোনো কম্পোনেন্টের মতো লেখা আর ব্যবহার করা যায় — <code>&lt;Modal&gt;...&lt;/Modal&gt;</code> — এটা কীভাবে কল করা হয় তা নিয়ে কিছু বদলায় না; শুধু এর মার্কআপ শারীরিকভাবে DOM-এ কোথায় শেষ হয় তা বদলায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'context-api',
  sortOrder: 17,
  en: {
    title: 'The Context API',
    metaTitle: 'The React Context API | Learn Computer Academy',
    metaDescription: 'Sharing state across many components without passing props through every level in between — the Context API and useContext.',
    blocks: [
      p('<p>Lifting state up works well when the components that need to share data are close together. It breaks down when a value — the current theme, the logged-in user, the selected language — is needed by components scattered deep across the tree, with layers of unrelated components in between that would have to pass it through for no reason of their own.</p>'),

      h(2, 'The Problem: Prop Drilling'),
      code('jsx', 'function App() {\n  const [theme, setTheme] = useState(\'light\');\n  return <Page theme={theme} />;\n}\nfunction Page({ theme }) {\n  return <Sidebar theme={theme} />; // Page never actually uses theme itself\n}\nfunction Sidebar({ theme }) {\n  return <Avatar theme={theme} />; // neither does Sidebar\n}\nfunction Avatar({ theme }) {\n  return <img className={theme} />; // only this one actually needs it\n}'),
      p('<p>This chain — passing a prop through components that don\'t use it themselves, purely to reach one that does — is called <b>prop drilling</b>. It works, but it makes every component in the middle depend on something that isn\'t really its concern.</p>'),

      img(
        'docs/img/react/context-1',
        'Isometric diagram split into two halves: on the left, a prop passed manually through a tall stack of nested boxes labeled prop drilling; on the right, the same value delivered directly from a top-level provider straight to one deeply nested box via context',
        1024, 768,
        'Prop drilling passes a value through every layer in between; context skips straight to whichever component actually needs it.'
      ),

      h(2, 'Creating and Providing Context'),
      code('jsx', 'import { createContext, useState, useContext } from \'react\';\n\nconst ThemeContext = createContext(null);\n\nfunction App() {\n  const [theme, setTheme] = useState(\'light\');\n  return (\n    <ThemeContext.Provider value={theme}>\n      <Page />\n    </ThemeContext.Provider>\n  );\n}'),

      h(2, 'Reading Context with useContext'),
      p('<p>Any component anywhere inside the <code>Provider</code> can read the value directly — no props passed through the components in between at all:</p>'),
      code('jsx', 'function Page() {\n  return <Sidebar />; // no theme prop needed here anymore\n}\nfunction Sidebar() {\n  return <Avatar />; // or here\n}\nfunction Avatar() {\n  const theme = useContext(ThemeContext); // reads it directly\n  return <img className={theme} />;\n}'),

      h(2, 'When to Reach for Context'),
      p('<p>Context is the right tool for genuinely global, rarely-changing values — theme, logged-in user, current locale. For state that\'s only shared between two or three closely related components, lifting state up (the earlier lesson) is usually simpler and keeps the data flow easier to trace. Reaching for context by default, everywhere, trades one problem (prop drilling) for another (hard-to-trace implicit dependencies).</p>'),
    ],
  },
  bn: {
    title: 'Context API',
    metaTitle: 'React Context API | Learn Computer Academy',
    metaDescription: 'মাঝখানের প্রতিটি স্তর দিয়ে props পাস না করে অনেক কম্পোনেন্ট জুড়ে state শেয়ার করা — Context API আর useContext।',
    blocks: [
      p('<p>যে কম্পোনেন্টগুলোর ডেটা শেয়ার করা দরকার তারা কাছাকাছি থাকলে state উপরে তোলা ভালো কাজ করে। একটি মান — বর্তমান থিম, লগইন করা ব্যবহারকারী, বেছে নেওয়া ভাষা — ট্রি জুড়ে গভীরে ছড়িয়ে থাকা কম্পোনেন্টের দরকার হলে এটা ভেঙে পড়ে, মাঝখানে এমন কম্পোনেন্টের স্তর থাকে যাদের নিজেদের কোনো কারণ ছাড়াই এটা পাস করতে হবে।</p>'),

      h(2, 'সমস্যা: Prop Drilling', 'the-problem-prop-drilling'),
      code('jsx', 'function App() {\n  const [theme, setTheme] = useState(\'light\');\n  return <Page theme={theme} />;\n}\nfunction Page({ theme }) {\n  return <Sidebar theme={theme} />; // Page never actually uses theme itself\n}\nfunction Sidebar({ theme }) {\n  return <Avatar theme={theme} />; // neither does Sidebar\n}\nfunction Avatar({ theme }) {\n  return <img className={theme} />; // only this one actually needs it\n}'),
      p('<p>এই চেইন — নিজেরা ব্যবহার করে না এমন কম্পোনেন্টের মধ্য দিয়ে একটি প্রপ পাস করা, শুধু যেটা ব্যবহার করে সেটাতে পৌঁছাতে — একে বলা হয় <b>prop drilling</b>। এটা কাজ করে, কিন্তু মাঝখানের প্রতিটি কম্পোনেন্টকে এমন কিছুর উপর নির্ভরশীল করে তোলে যা আসলে তার বিষয় না।</p>'),

      img(
        'docs/img/react/context-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম দুই ভাগে বিভক্ত: বামদিকে, একটি প্রপ হাতে হাতে নেস্টেড বক্সের একটি লম্বা স্তূপের মধ্য দিয়ে যাচ্ছে যাকে prop drilling লেবেল করা; ডানদিকে, একই মান একটি টপ-লেভেল provider থেকে সরাসরি context-এর মাধ্যমে একটি গভীরে নেস্ট করা বক্সে পৌঁছাচ্ছে',
        1024, 768,
        'Prop drilling মাঝখানের প্রতিটি স্তরের মধ্য দিয়ে একটি মান পাস করে; context সরাসরি যে কম্পোনেন্টের আসলে দরকার সেখানে চলে যায়।'
      ),

      h(2, 'Context তৈরি করা আর Provide করা', 'creating-and-providing-context'),
      code('jsx', 'import { createContext, useState, useContext } from \'react\';\n\nconst ThemeContext = createContext(null);\n\nfunction App() {\n  const [theme, setTheme] = useState(\'light\');\n  return (\n    <ThemeContext.Provider value={theme}>\n      <Page />\n    </ThemeContext.Provider>\n  );\n}'),

      h(2, 'useContext দিয়ে Context পড়া', 'reading-context-with-usecontext'),
      p('<p><code>Provider</code>-এর ভেতরে যেকোনো জায়গার যেকোনো কম্পোনেন্ট সরাসরি মানটা পড়তে পারে — মাঝখানের কম্পোনেন্টের মধ্য দিয়ে একদমই কোনো props পাস করা ছাড়া:</p>'),
      code('jsx', 'function Page() {\n  return <Sidebar />; // no theme prop needed here anymore\n}\nfunction Sidebar() {\n  return <Avatar />; // or here\n}\nfunction Avatar() {\n  const theme = useContext(ThemeContext); // reads it directly\n  return <img className={theme} />;\n}'),

      h(2, 'কখন Context-এর দিকে যাবেন', 'when-to-reach-for-context'),
      p('<p>Context সত্যিকারভাবে গ্লোবাল, কমই-বদলায়-এমন মানের জন্য সঠিক টুল — থিম, লগইন করা ব্যবহারকারী, বর্তমান locale। শুধু দুই-তিনটি কাছাকাছি-সম্পর্কিত কম্পোনেন্টের মধ্যে শেয়ার করা state-এর জন্য, state উপরে তোলা (আগের পাঠ) সাধারণত সহজ আর ডেটা প্রবাহ ট্রেস করা সহজ রাখে। ডিফল্টভাবে, সব জায়গায় context-এর দিকে যাওয়া একটি সমস্যা (prop drilling) আরেকটির (ট্রেস-করা-কঠিন implicit নির্ভরতা) সাথে বদলে ফেলে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'custom-hooks',
  sortOrder: 18,
  en: {
    title: 'Custom Hooks',
    metaTitle: 'Custom Hooks in React | Learn Computer Academy',
    metaDescription: 'Extracting reusable stateful logic into your own custom hooks, built from useState and useEffect.',
    blocks: [
      p('<p>The Fetching Data lesson\'s loading/error/data pattern is useful — and also something you\'d end up retyping in every component that fetches anything. A <b>custom hook</b> extracts that logic into a reusable function, exactly the same reason you\'d extract any repeated logic into a regular function.</p>'),

      h(2, 'A Hook Is Just a Function'),
      p('<p>The only real rule: its name starts with <code>use</code>. That\'s what lets React (and the linter) verify the Rules of Hooks are being followed — hooks can only be called at the top level of a component or another hook, never inside a condition, loop, or nested function.</p>'),

      h(2, 'Extracting useFetch'),
      code('jsx', 'function useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    let ignore = false;\n    setLoading(true);\n\n    fetch(url)\n      .then((res) => res.json())\n      .then((json) => {\n        if (!ignore) setData(json);\n      })\n      .catch((err) => {\n        if (!ignore) setError(err.message);\n      })\n      .finally(() => {\n        if (!ignore) setLoading(false);\n      });\n\n    return () => {\n      ignore = true;\n    };\n  }, [url]);\n\n  return { data, loading, error };\n}'),
      p('<p>This is line-for-line the same logic from the Fetching Data lesson — just wrapped in a function of its own.</p>'),

      h(2, 'Using It'),
      code('jsx', 'function UserProfile({ userId }) {\n  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);\n\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>Error: {error}</p>;\n  return <h1>{user.name}</h1>;\n}\n\nfunction PostList() {\n  const { data: posts, loading } = useFetch(\'/api/posts\'); // same hook, reused\n  if (loading) return <p>Loading...</p>;\n  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;\n}'),
      p('<p>Both components get their own independent call to <code>useFetch</code> — same as two <code>useState</code> calls never sharing state, calling a custom hook twice creates two completely separate instances of its internal state.</p>'),

      h(2, 'A Simpler Example: useToggle'),
      code('jsx', 'function useToggle(initialValue = false) {\n  const [value, setValue] = useState(initialValue);\n  const toggle = () => setValue((v) => !v);\n  return [value, toggle];\n}\n\nfunction Menu() {\n  const [isOpen, toggleOpen] = useToggle();\n  return <button onClick={toggleOpen}>{isOpen ? \'Close\' : \'Open\'}</button>;\n}'),

      callout('tip', '<p>Extract a custom hook once the same stateful logic shows up in a second component — not before. A one-off <code>useState</code> call doesn\'t need its own hook; the win comes specifically from not repeating logic that would otherwise be copy-pasted.</p>', 'Extract on the second use, not the first'),
    ],
  },
  bn: {
    title: 'কাস্টম হুক',
    metaTitle: 'React-এ কাস্টম হুক | Learn Computer Academy',
    metaDescription: 'useState আর useEffect দিয়ে তৈরি, পুনঃব্যবহারযোগ্য stateful লজিককে নিজের কাস্টম হুকে বের করে আনা।',
    blocks: [
      p('<p>Fetching Data পাঠের loading/error/data প্যাটার্নটি দরকারি — আর এমন কিছুও যা আপনি যেকোনো কিছু fetch করা প্রতিটি কম্পোনেন্টে বারবার টাইপ করে ফেলবেন। একটি <b>কাস্টম হুক</b> সেই লজিককে একটি পুনঃব্যবহারযোগ্য ফাংশনে বের করে আনে, ঠিক একই কারণ যে কারণে আপনি যেকোনো পুনরাবৃত্ত লজিক একটি সাধারণ ফাংশনে বের করে আনতেন।</p>'),

      h(2, 'একটি হুক শুধু একটি ফাংশন', 'a-hook-is-just-a-function'),
      p('<p>একমাত্র আসল নিয়ম: এর নাম <code>use</code> দিয়ে শুরু হয়। এটাই React-কে (আর linter-কে) Rules of Hooks মানা হচ্ছে কিনা যাচাই করতে দেয় — হুক শুধু একটি কম্পোনেন্টের বা আরেকটি হুকের top level-এ কল করা যায়, কখনো একটি কন্ডিশন, লুপ, বা নেস্টেড ফাংশনের ভেতরে নয়।</p>'),

      h(2, 'useFetch বের করে আনা', 'extracting-usefetch'),
      code('jsx', 'function useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    let ignore = false;\n    setLoading(true);\n\n    fetch(url)\n      .then((res) => res.json())\n      .then((json) => {\n        if (!ignore) setData(json);\n      })\n      .catch((err) => {\n        if (!ignore) setError(err.message);\n      })\n      .finally(() => {\n        if (!ignore) setLoading(false);\n      });\n\n    return () => {\n      ignore = true;\n    };\n  }, [url]);\n\n  return { data, loading, error };\n}'),
      p('<p>এটা Fetching Data পাঠের একই লজিক, লাইন বাই লাইন — শুধু নিজের একটি ফাংশনে মোড়ানো।</p>'),

      h(2, 'এটা ব্যবহার করা', 'using-it'),
      code('jsx', 'function UserProfile({ userId }) {\n  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);\n\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>Error: {error}</p>;\n  return <h1>{user.name}</h1>;\n}\n\nfunction PostList() {\n  const { data: posts, loading } = useFetch(\'/api/posts\'); // same hook, reused\n  if (loading) return <p>Loading...</p>;\n  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;\n}'),
      p('<p>দুটো কম্পোনেন্টই <code>useFetch</code>-এ নিজস্ব স্বাধীন কল পায় — দুটো <code>useState</code> কল কখনো state শেয়ার না করার মতোই, একটি কাস্টম হুক দুইবার কল করলে এর অভ্যন্তরীণ state-এর দুটো সম্পূর্ণ আলাদা instance তৈরি হয়।</p>'),

      h(2, 'একটি সহজ উদাহরণ: useToggle', 'a-simpler-example-usetoggle'),
      code('jsx', 'function useToggle(initialValue = false) {\n  const [value, setValue] = useState(initialValue);\n  const toggle = () => setValue((v) => !v);\n  return [value, toggle];\n}\n\nfunction Menu() {\n  const [isOpen, toggleOpen] = useToggle();\n  return <button onClick={toggleOpen}>{isOpen ? \'Close\' : \'Open\'}</button>;\n}'),

      callout('tip', '<p>একই stateful লজিক দ্বিতীয় একটি কম্পোনেন্টে দেখা দিলে একটি কাস্টম হুক বের করে আনুন — তার আগে নয়। একটি এক-বারের <code>useState</code> কলের নিজের হুক দরকার নেই; লাভটা নির্দিষ্টভাবে আসে এমন লজিক পুনরাবৃত্তি না করা থেকে যা নাহলে কপি-পেস্ট হতো।</p>', 'প্রথম ব্যবহারে নয়, দ্বিতীয় ব্যবহারে বের করে আনুন'),
    ],
  },
})

lessons.push({
  slug: 'useref',
  sortOrder: 19,
  en: {
    title: 'useRef',
    metaTitle: 'The useRef Hook in React | Learn Computer Academy',
    metaDescription: 'Accessing a real DOM node directly, and storing a value that persists between renders without causing a re-render, with useRef.',
    blocks: [
      p('<p><code>useRef</code> solves two unrelated problems that happen to share one hook: reaching a real DOM element directly, and holding a value across renders that changing shouldn\'t trigger a re-render for.</p>'),

      h(2, 'Accessing a DOM Node'),
      p('<p>Sometimes you need the actual DOM element — focusing an input, measuring an element\'s size, integrating a non-React library. Attaching a ref to a JSX element gives you exactly that:</p>'),
      code('jsx', 'function SearchBox() {\n  const inputRef = useRef(null);\n\n  function focusInput() {\n    inputRef.current.focus(); // .current is the real <input> DOM node\n  }\n\n  return (\n    <div>\n      <input ref={inputRef} />\n      <button onClick={focusInput}>Focus the input</button>\n    </div>\n  );\n}'),
      p('<p><code>inputRef.current</code> is <code>null</code> until React actually renders the <code>&lt;input&gt;</code>, then becomes the real DOM node — the same <code>HTMLInputElement</code> you\'d get from <code>document.querySelector</code> in the <a href="/javascript/dom/">JavaScript DOM lesson</a>.</p>'),

      h(2, 'A Value That Survives Renders, Without Triggering One'),
      p('<p>This is the part that trips people up coming from <code>useState</code>: changing <code>ref.current</code> does <b>not</b> cause a re-render. That\'s a feature, not a limitation — for something like tracking an interval ID or a previous value, you specifically don\'t want a re-render every time it changes:</p>'),
      code('jsx', 'function Stopwatch() {\n  const [running, setRunning] = useState(false);\n  const intervalRef = useRef(null);\n\n  function start() {\n    setRunning(true);\n    intervalRef.current = setInterval(() => {\n      console.log(\'tick\');\n    }, 1000);\n  }\n\n  function stop() {\n    setRunning(false);\n    clearInterval(intervalRef.current); // reading it back later, no re-render involved either way\n  }\n\n  return <button onClick={running ? stop : start}>{running ? \'Stop\' : \'Start\'}</button>;\n}'),

      h(2, 'useRef vs. useState'),
      table(
        ['', 'Changing it triggers a re-render?', 'Use for'],
        [
          ['useState', 'Yes', 'Anything the UI should visibly reflect'],
          ['useRef', 'No', 'DOM access, or a value the component needs to remember but never displays directly'],
        ]
      ),
      callout('warning', '<p>Reading or writing <code>ref.current</code> during render (not inside an event handler or an effect) is a mistake to watch for — since it doesn\'t trigger a re-render, the UI can silently get out of sync with what the ref actually holds. Keep ref reads/writes inside handlers and effects.</p>', 'Don\'t read/write refs during render'),
    ],
  },
  bn: {
    title: 'useRef',
    metaTitle: 'React-এ useRef হুক | Learn Computer Academy',
    metaDescription: 'সরাসরি একটি প্রকৃত DOM node অ্যাক্সেস করা, আর useRef দিয়ে re-render ট্রিগার না করে render জুড়ে টিকে থাকা একটি মান সংরক্ষণ করা।',
    blocks: [
      p('<p><code>useRef</code> দুটো অসম্পর্কিত সমস্যা সমাধান করে যা কাকতালীয়ভাবে একটি হুক শেয়ার করে: সরাসরি একটি প্রকৃত DOM এলিমেন্টে পৌঁছানো, আর render জুড়ে একটি মান ধরে রাখা যা বদলালে re-render ট্রিগার করা উচিত নয়।</p>'),

      h(2, 'একটি DOM Node অ্যাক্সেস করা', 'accessing-a-dom-node'),
      p('<p>কখনো কখনো আপনার আসল DOM এলিমেন্ট দরকার — একটি input-এ ফোকাস করা, একটি এলিমেন্টের আকার মাপা, একটি non-React লাইব্রেরি একত্রিত করা। একটি JSX এলিমেন্টে একটি ref যুক্ত করলে ঠিক এটাই পাওয়া যায়:</p>'),
      code('jsx', 'function SearchBox() {\n  const inputRef = useRef(null);\n\n  function focusInput() {\n    inputRef.current.focus(); // .current is the real <input> DOM node\n  }\n\n  return (\n    <div>\n      <input ref={inputRef} />\n      <button onClick={focusInput}>Focus the input</button>\n    </div>\n  );\n}'),
      p('<p>React সত্যিই <code>&lt;input&gt;</code> render না করা পর্যন্ত <code>inputRef.current</code> <code>null</code>, এরপর প্রকৃত DOM node হয়ে যায় — <a href="/bn/javascript/dom/">JavaScript DOM পাঠে</a> <code>document.querySelector</code> থেকে আপনি যে একই <code>HTMLInputElement</code> পেতেন।</p>'),

      h(2, 'একটি মান যা render টিকে থাকে, ট্রিগার না করে', 'a-value-that-survives-renders-without-triggering-one'),
      p('<p>এই অংশটাই <code>useState</code> থেকে আসা মানুষদের হোঁচট খাওয়ায়: <code>ref.current</code> বদলালে re-render হয় <b>না</b>। এটা একটি সীমাবদ্ধতা নয়, একটি ফিচার — একটি ইন্টারভাল ID বা একটি আগের মান ট্র্যাক করার মতো কিছুর জন্য, প্রতিবার বদলালে একটি re-render নির্দিষ্টভাবে আপনি চান না:</p>'),
      code('jsx', 'function Stopwatch() {\n  const [running, setRunning] = useState(false);\n  const intervalRef = useRef(null);\n\n  function start() {\n    setRunning(true);\n    intervalRef.current = setInterval(() => {\n      console.log(\'tick\');\n    }, 1000);\n  }\n\n  function stop() {\n    setRunning(false);\n    clearInterval(intervalRef.current); // reading it back later, no re-render involved either way\n  }\n\n  return <button onClick={running ? stop : start}>{running ? \'Stop\' : \'Start\'}</button>;\n}'),

      h(2, 'useRef বনাম useState', 'useref-vs-usestate'),
      table(
        ['', 'এটা বদলালে re-render ট্রিগার হয়?', 'কীসের জন্য ব্যবহার'],
        [
          ['useState', 'হ্যাঁ', 'UI-তে দৃশ্যত প্রতিফলিত হওয়া উচিত এমন যেকোনো কিছু'],
          ['useRef', 'না', 'DOM অ্যাক্সেস, বা এমন একটি মান যা কম্পোনেন্টের মনে রাখা দরকার কিন্তু সরাসরি দেখায় না'],
        ]
      ),
      callout('warning', '<p>Render-এর সময় (একটি ইভেন্ট হ্যান্ডলার বা একটি effect-এর ভেতরে নয়) <code>ref.current</code> পড়া বা লেখা একটি ভুল যা খেয়াল রাখতে হবে — এটা re-render ট্রিগার না করায়, UI চুপচাপ ref আসলে কী ধরে আছে তার সাথে সামঞ্জস্যহীন হয়ে যেতে পারে। ref পড়া/লেখা হ্যান্ডলার আর effect-এর ভেতরেই রাখুন।</p>', 'render-এর সময় ref পড়বেন/লিখবেন না'),
    ],
  },
})

lessons.push({
  slug: 'usememo-usecallback',
  sortOrder: 20,
  en: {
    title: 'useMemo and useCallback',
    metaTitle: 'useMemo and useCallback in React | Learn Computer Academy',
    metaDescription: 'Memoizing an expensive calculation with useMemo, and a stable function reference with useCallback — and when bothering with either is actually worth it.',
    blocks: [
      p('<p>Both hooks do the same underlying thing — skip redoing work if the inputs haven\'t changed since last time — applied to two different kinds of value: a calculated result, and a function.</p>'),

      h(2, 'The Problem: Recalculating on Every Render'),
      p('<p>A component function re-runs on every render, which means anything computed inside it gets recomputed every time too — including work that\'s genuinely expensive and didn\'t need to change:</p>'),
      code('jsx', 'function ProductList({ products, filter }) {\n  const filtered = products.filter((p) => p.category === filter); // recalculated every render\n  return <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;\n}'),

      h(2, 'useMemo'),
      p('<p><code>useMemo</code> caches a calculated value, only recomputing it when something in the dependency array (the same pattern from useEffect) has actually changed:</p>'),
      code('jsx', 'function ProductList({ products, filter }) {\n  const filtered = useMemo(\n    () => products.filter((p) => p.category === filter),\n    [products, filter]\n  );\n  return <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;\n}'),

      h(2, 'useCallback'),
      p('<p>A new function is created on every render too, by default — usually harmless, but it matters when that function is passed as a prop to a memoized child component (via <code>React.memo</code>, from the Performance Basics lesson next), since a "new" function prop looks like a change even when the logic is identical. <code>useCallback</code> keeps the same function reference across renders unless its dependencies change:</p>'),
      code('jsx', 'function Parent({ items }) {\n  const handleSelect = useCallback((id) => {\n    console.log(\'Selected:\', id);\n  }, []); // same function reference every render\n\n  return <ExpensiveList items={items} onSelect={handleSelect} />;\n}'),

      h(2, 'When These Are Actually Worth Using'),
      p('<p>Both add real overhead of their own — comparing the dependency array, storing the cached value. For most components, that overhead outweighs any saving, since most calculations and function creations are cheap. Reach for either specifically when a profiler has actually shown a real slowdown, or you know a calculation is genuinely expensive (sorting or filtering a large list) — not as a default habit applied to every value and function.</p>'),
      callout('warning', '<p>Wrapping everything in <code>useMemo</code>/<code>useCallback</code> "just in case" is a common overcorrection — it adds real complexity and its own small performance cost for a benefit that, in most components, doesn\'t exist. Measure before optimizing.</p>', 'Not a default habit'),
    ],
  },
  bn: {
    title: 'useMemo আর useCallback',
    metaTitle: 'React-এ useMemo আর useCallback | Learn Computer Academy',
    metaDescription: 'useMemo দিয়ে একটি ব্যয়বহুল হিসাব, আর useCallback দিয়ে একটি স্থিতিশীল ফাংশন রেফারেন্স memoize করা — আর কখন এদের কোনোটা নিয়ে মাথা ঘামানো আসলে যুক্তিসঙ্গত।',
    blocks: [
      p('<p>দুটো হুকই একই অন্তর্নিহিত কাজ করে — শেষবারের পর ইনপুট না বদলালে কাজ আবার না করা — দুই ভিন্ন ধরনের মানে প্রয়োগ করা: একটি হিসাব করা ফলাফল, আর একটি ফাংশন।</p>'),

      h(2, 'সমস্যা: প্রতিটি Render-এ পুনরায় হিসাব করা', 'the-problem-recalculating-on-every-render'),
      p('<p>একটি কম্পোনেন্ট ফাংশন প্রতিটি render-এ আবার চলে, মানে এর ভেতরে হিসাব করা যেকোনো কিছু প্রতিবার আবার হিসাব হয় — সত্যিকারভাবে ব্যয়বহুল আর বদলানোর দরকার নেই এমন কাজসহ:</p>'),
      code('jsx', 'function ProductList({ products, filter }) {\n  const filtered = products.filter((p) => p.category === filter); // recalculated every render\n  return <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;\n}'),

      h(2, 'useMemo', 'usememo'),
      p('<p><code>useMemo</code> একটি হিসাব করা মান ক্যাশ করে, শুধু dependency array-তে (useEffect থেকে একই প্যাটার্ন) কিছু আসলে বদলালে তা পুনরায় হিসাব করে:</p>'),
      code('jsx', 'function ProductList({ products, filter }) {\n  const filtered = useMemo(\n    () => products.filter((p) => p.category === filter),\n    [products, filter]\n  );\n  return <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;\n}'),

      h(2, 'useCallback', 'usecallback'),
      p('<p>ডিফল্টভাবে প্রতিটি render-এও একটি নতুন ফাংশন তৈরি হয় — সাধারণত ক্ষতিকর নয়, কিন্তু এটা গুরুত্বপূর্ণ হয়ে ওঠে যখন সেই ফাংশন একটি memoized child কম্পোনেন্টে (পরের Performance Basics পাঠের <code>React.memo</code>-এর মাধ্যমে) একটি প্রপ হিসেবে পাস করা হয়, কারণ লজিক অভিন্ন হলেও একটি "নতুন" ফাংশন প্রপ একটি পরিবর্তনের মতো দেখায়। <code>useCallback</code> এর dependency না বদলালে render জুড়ে একই ফাংশন রেফারেন্স রাখে:</p>'),
      code('jsx', 'function Parent({ items }) {\n  const handleSelect = useCallback((id) => {\n    console.log(\'Selected:\', id);\n  }, []); // same function reference every render\n\n  return <ExpensiveList items={items} onSelect={handleSelect} />;\n}'),

      h(2, 'এগুলো আসলে কখন ব্যবহার করার যোগ্য', 'when-these-are-actually-worth-using'),
      p('<p>দুটোই নিজেদের আসল overhead যোগ করে — dependency array তুলনা করা, ক্যাশ করা মান সংরক্ষণ করা। বেশিরভাগ কম্পোনেন্টের জন্য, সেই overhead যেকোনো সাশ্রয়ের চেয়ে বেশি, কারণ বেশিরভাগ হিসাব আর ফাংশন তৈরি সস্তা। নির্দিষ্টভাবে তখনই এদের দিকে যান যখন একটি profiler সত্যিই একটি আসল ধীরগতি দেখিয়েছে, বা আপনি জানেন একটি হিসাব সত্যিকারভাবে ব্যয়বহুল (একটি বড় লিস্ট সর্ট বা ফিল্টার করা) — প্রতিটি মান আর ফাংশনে প্রয়োগ করা একটি ডিফল্ট অভ্যাস হিসেবে নয়।</p>'),
      callout('warning', '<p>"just in case" সবকিছু <code>useMemo</code>/<code>useCallback</code>-এ মুড়িয়ে দেওয়া একটি সাধারণ অতি-সংশোধন — এটা আসল জটিলতা আর নিজের একটি ছোট পারফরম্যান্স খরচ যোগ করে এমন একটি সুবিধার জন্য যা বেশিরভাগ কম্পোনেন্টে আসলে নেই। অপ্টিমাইজ করার আগে মাপুন।</p>', 'কোনো ডিফল্ট অভ্যাস নয়'),
    ],
  },
})

lessons.push({
  slug: 'react-router',
  sortOrder: 21,
  en: {
    title: 'React Router',
    metaTitle: 'React Router Basics | Learn Computer Academy',
    metaDescription: 'Client-side routing basics with React Router — matching a URL to a component, without the browser reloading the page.',
    blocks: [
      p('<p>Everything so far has lived on one page. A real application usually needs multiple views — a home page, a profile page, a settings page — each at its own URL. <b>React Router</b> is the standard library for this: it matches the current URL to a component, without the browser doing a full page reload the way a plain <code>&lt;a href&gt;</code> normally would.</p>'),

      h(2, 'Installing It'),
      code('bash', 'npm install react-router-dom'),

      h(2, 'Defining Routes'),
      code('jsx', 'import { BrowserRouter, Routes, Route } from \'react-router-dom\';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/about" element={<About />} />\n        <Route path="/users/:id" element={<UserProfile />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}'),
      p('<p><code>BrowserRouter</code> wraps the whole app once, near the root; <code>Routes</code> looks at the current URL and renders whichever single <code>Route</code>\'s <code>path</code> matches.</p>'),

      img(
        'docs/img/react/react-router-1',
        'Isometric diagram showing three different URL path labels each pointing with an arrow to a different labeled component box, illustrating a router matching a URL to the component it renders',
        1024, 768,
        'The router matches the current URL against each route and renders the one component that matches.'
      ),

      h(2, 'Navigating Between Routes'),
      p('<p>A plain <code>&lt;a href="/about"&gt;</code> would trigger a full page reload — exactly what client-side routing exists to avoid. <code>Link</code> looks like an anchor tag but updates the URL and swaps the rendered route without one:</p>'),
      code('jsx', 'import { Link } from \'react-router-dom\';\n\nfunction Nav() {\n  return (\n    <nav>\n      <Link to="/">Home</Link>\n      <Link to="/about">About</Link>\n    </nav>\n  );\n}'),

      h(2, 'Reading URL Parameters'),
      p('<p><code>:id</code> in the route path from earlier becomes available inside the matched component via <code>useParams</code>:</p>'),
      code('jsx', 'import { useParams } from \'react-router-dom\';\n\nfunction UserProfile() {\n  const { id } = useParams(); // reads the :id segment from the current URL\n  const { data: user } = useFetch(`/api/users/${id}`); // the custom hook from earlier\n  return user ? <h1>{user.name}</h1> : <p>Loading...</p>;\n}'),

      h(2, 'Navigating Programmatically'),
      p('<p>For redirecting after an action — a successful form submission, for instance — rather than in response to a click on a <code>Link</code>:</p>'),
      code('jsx', 'import { useNavigate } from \'react-router-dom\';\n\nfunction LoginForm() {\n  const navigate = useNavigate();\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    navigate(\'/dashboard\');\n  }\n\n  return <form onSubmit={handleSubmit}>{/* ... */}</form>;\n}'),
    ],
  },
  bn: {
    title: 'React Router',
    metaTitle: 'React Router বেসিক্স | Learn Computer Academy',
    metaDescription: 'React Router দিয়ে ক্লায়েন্ট-সাইড রাউটিং বেসিক্স — ব্রাউজার পাতা রিলোড না করেই একটি URL-কে একটি কম্পোনেন্টের সাথে মেলানো।',
    blocks: [
      p('<p>এখন পর্যন্ত সবকিছু একটি পাতায় ছিল। একটি বাস্তব অ্যাপ্লিকেশনে সাধারণত একাধিক view দরকার — একটি হোম পাতা, একটি প্রোফাইল পাতা, একটি সেটিংস পাতা — প্রতিটি নিজের URL-এ। এর জন্য প্রচলিত লাইব্রেরি হলো <b>React Router</b>: এটি বর্তমান URL-কে একটি কম্পোনেন্টের সাথে মেলায়, একটি সাধারণ <code>&lt;a href&gt;</code> সাধারণত যেভাবে করত সেভাবে ব্রাউজার সম্পূর্ণ পাতা রিলোড না করেই।</p>'),

      h(2, 'এটি ইনস্টল করা', 'installing-it'),
      code('bash', 'npm install react-router-dom'),

      h(2, 'রুট সংজ্ঞায়িত করা', 'defining-routes'),
      code('jsx', 'import { BrowserRouter, Routes, Route } from \'react-router-dom\';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/about" element={<About />} />\n        <Route path="/users/:id" element={<UserProfile />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}'),
      p('<p><code>BrowserRouter</code> পুরো অ্যাপকে একবার, root-এর কাছে মুড়ে দেয়; <code>Routes</code> বর্তমান URL দেখে আর যে একটি <code>Route</code>-এর <code>path</code> মেলে সেটাই রেন্ডার করে।</p>'),

      img(
        'docs/img/react/react-router-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে তিনটি ভিন্ন URL path লেবেল প্রতিটি একটি তীর দিয়ে একটি ভিন্ন লেবেলযুক্ত কম্পোনেন্ট বক্সের দিকে নির্দেশ করছে, একটি রাউটার একটি URL-কে যে কম্পোনেন্ট রেন্ডার করে তার সাথে মেলানো তুলে ধরছে',
        1024, 768,
        'রাউটার বর্তমান URL-কে প্রতিটি রুটের সাথে মেলায় আর যেটা মেলে সেই একটি কম্পোনেন্ট রেন্ডার করে।'
      ),

      h(2, 'রুটের মধ্যে নেভিগেট করা', 'navigating-between-routes'),
      p('<p>একটি সাধারণ <code>&lt;a href="/about"&gt;</code> একটি সম্পূর্ণ পাতা রিলোড ট্রিগার করবে — ক্লায়েন্ট-সাইড রাউটিং ঠিক এটাই এড়াতে আছে। <code>Link</code> একটি anchor ট্যাগের মতো দেখতে কিন্তু একটা ছাড়াই URL আপডেট করে আর render করা রুট বদলে দেয়:</p>'),
      code('jsx', 'import { Link } from \'react-router-dom\';\n\nfunction Nav() {\n  return (\n    <nav>\n      <Link to="/">Home</Link>\n      <Link to="/about">About</Link>\n    </nav>\n  );\n}'),

      h(2, 'URL প্যারামিটার পড়া', 'reading-url-parameters'),
      p('<p>আগের রুট path-এর <code>:id</code> <code>useParams</code>-এর মাধ্যমে মেলা কম্পোনেন্টের ভেতরে উপলব্ধ হয়ে যায়:</p>'),
      code('jsx', 'import { useParams } from \'react-router-dom\';\n\nfunction UserProfile() {\n  const { id } = useParams(); // reads the :id segment from the current URL\n  const { data: user } = useFetch(`/api/users/${id}`); // the custom hook from earlier\n  return user ? <h1>{user.name}</h1> : <p>Loading...</p>;\n}'),

      h(2, 'প্রোগ্রাম্যাটিকভাবে নেভিগেট করা', 'navigating-programmatically'),
      p('<p>একটি <code>Link</code>-এ ক্লিকের সাড়ায় না বরং একটি কাজের পরে রিডাইরেক্ট করার জন্য — উদাহরণস্বরূপ, একটি সফল ফর্ম সাবমিশন:</p>'),
      code('jsx', 'import { useNavigate } from \'react-router-dom\';\n\nfunction LoginForm() {\n  const navigate = useNavigate();\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    navigate(\'/dashboard\');\n  }\n\n  return <form onSubmit={handleSubmit}>{/* ... */}</form>;\n}'),
    ],
  },
})

lessons.push({
  slug: 'error-boundaries',
  sortOrder: 22,
  en: {
    title: 'Error Boundaries',
    metaTitle: 'Error Boundaries in React | Learn Computer Academy',
    metaDescription: 'Catching rendering errors in a part of the component tree with an error boundary, instead of a crash taking down the whole page.',
    blocks: [
      p('<p>The <a href="/javascript/error-handling/">JavaScript Error Handling lesson</a>\'s <code>try</code>/<code>catch</code> doesn\'t catch errors thrown <i>during rendering</i> inside a component — by default, an error there crashes the entire React app, showing a blank page. An <b>error boundary</b> is React\'s tool for containing that damage to one part of the tree instead.</p>'),

      h(2, 'What an Error Boundary Is'),
      p('<p>An error boundary is a component that catches JavaScript errors thrown by its children during rendering, logs them, and displays a fallback UI instead of the crashed tree. As of the current version of React, this specifically requires a class component — the one place in modern React you\'ll still write one, since no hook-based equivalent exists yet:</p>'),
      code('jsx', 'import { Component } from \'react\';\n\nclass ErrorBoundary extends Component {\n  state = { hasError: false };\n\n  static getDerivedStateFromError() {\n    return { hasError: true };\n  }\n\n  componentDidCatch(error, info) {\n    console.error(\'Caught by ErrorBoundary:\', error, info);\n  }\n\n  render() {\n    if (this.state.hasError) {\n      return <h2>Something went wrong.</h2>;\n    }\n    return this.props.children;\n  }\n}'),

      h(2, 'Using It'),
      p('<p>Wrap it around whatever part of the tree should fail independently — composed with <code>children</code>, exactly like the Component Composition lesson:</p>'),
      code('jsx', 'function App() {\n  return (\n    <div>\n      <Header /> {/* stays up even if the widget below crashes */}\n      <ErrorBoundary>\n        <UnstableWidget />\n      </ErrorBoundary>\n      <Footer />\n    </div>\n  );\n}'),

      h(2, 'What an Error Boundary Does Not Catch'),
      table(
        ['Doesn\'t catch', 'Handle it with'],
        [
          ['Errors inside event handlers', 'A regular try/catch inside the handler itself'],
          ['Errors inside a fetch() call', 'The .catch() / try-catch pattern from the Fetching Data lesson'],
          ['Errors during server-side rendering', 'Framework-specific error handling (outside the scope of this section)'],
        ]
      ),
      p('<p>An error boundary is specifically for the case those other tools don\'t cover: something going wrong while a component is actually rendering.</p>'),

      callout('tip', '<p>A handful of well-placed error boundaries — around a page\'s major independent sections — usually beats wrapping every single small component individually. The goal is containing a crash to the section that broke, not eliminating every possible failure.</p>', 'A few boundaries, placed deliberately'),
    ],
  },
  bn: {
    title: 'এরর বাউন্ডারি',
    metaTitle: 'React-এ এরর বাউন্ডারি | Learn Computer Academy',
    metaDescription: 'একটি ক্র্যাশ পুরো পাতা নামিয়ে দেওয়ার বদলে, একটি এরর বাউন্ডারি দিয়ে কম্পোনেন্ট ট্রির একটি অংশে render এরর ধরা।',
    blocks: [
      p('<p><a href="/bn/javascript/error-handling/">JavaScript Error Handling পাঠ</a>-এর <code>try</code>/<code>catch</code> একটি কম্পোনেন্টের ভেতরে <i>render-এর সময়</i> তোলা এরর ধরে না — ডিফল্টভাবে, সেখানে একটি এরর পুরো React অ্যাপকে ক্র্যাশ করে দেয়, একটি খালি পাতা দেখায়। একটি <b>এরর বাউন্ডারি</b> সেই ক্ষতিকে এর বদলে ট্রির একটি অংশে সীমাবদ্ধ রাখার React-এর টুল।</p>'),

      h(2, 'একটি এরর বাউন্ডারি কী', 'what-an-error-boundary-is'),
      p('<p>একটি এরর বাউন্ডারি হলো একটি কম্পোনেন্ট যা render-এর সময় এর children-এর তোলা JavaScript এরর ধরে, সেগুলো লগ করে, আর ভেঙে পড়া ট্রির বদলে একটি fallback UI দেখায়। React-এর বর্তমান ভার্সন অনুযায়ী, এর জন্য নির্দিষ্টভাবে একটি ক্লাস কম্পোনেন্ট দরকার — আধুনিক React-এ একমাত্র জায়গা যেখানে আপনি এখনও একটি লিখবেন, কারণ এখনও কোনো হুক-ভিত্তিক সমতুল্য নেই:</p>'),
      code('jsx', 'import { Component } from \'react\';\n\nclass ErrorBoundary extends Component {\n  state = { hasError: false };\n\n  static getDerivedStateFromError() {\n    return { hasError: true };\n  }\n\n  componentDidCatch(error, info) {\n    console.error(\'Caught by ErrorBoundary:\', error, info);\n  }\n\n  render() {\n    if (this.state.hasError) {\n      return <h2>Something went wrong.</h2>;\n    }\n    return this.props.children;\n  }\n}'),

      h(2, 'এটি ব্যবহার করা', 'using-it'),
      p('<p>ট্রির যে অংশটি স্বাধীনভাবে ব্যর্থ হওয়া উচিত তার চারপাশে এটা মুড়িয়ে দিন — <code>children</code>-এর সাথে কম্পোজ করা, ঠিক Component Composition পাঠের মতো:</p>'),
      code('jsx', 'function App() {\n  return (\n    <div>\n      <Header /> {/* stays up even if the widget below crashes */}\n      <ErrorBoundary>\n        <UnstableWidget />\n      </ErrorBoundary>\n      <Footer />\n    </div>\n  );\n}'),

      h(2, 'একটি এরর বাউন্ডারি কী ধরে না', 'what-an-error-boundary-does-not-catch'),
      table(
        ['ধরে না', 'যা দিয়ে হ্যান্ডেল করবেন'],
        [
          ['ইভেন্ট হ্যান্ডলারের ভেতরের এরর', 'হ্যান্ডলারের ভেতরে নিজে একটি সাধারণ try/catch'],
          ['একটি fetch() কলের ভেতরের এরর', 'Fetching Data পাঠের .catch() / try-catch প্যাটার্ন'],
          ['সার্ভার-সাইড রেন্ডারিংয়ের সময়ের এরর', 'ফ্রেমওয়ার্ক-নির্দিষ্ট এরর হ্যান্ডলিং (এই অংশের সুযোগের বাইরে)'],
        ]
      ),
      p('<p>একটি এরর বাউন্ডারি নির্দিষ্টভাবে সেই ক্ষেত্রের জন্য যা অন্য টুলগুলো কভার করে না: একটি কম্পোনেন্ট আসলে render হওয়ার সময় কিছু ভুল হওয়া।</p>'),

      callout('tip', '<p>একটি পাতার প্রধান স্বাধীন সেকশনের চারপাশে কয়েকটি ভালোভাবে-রাখা এরর বাউন্ডারি সাধারণত প্রতিটি ছোট কম্পোনেন্ট আলাদাভাবে মোড়ানোর চেয়ে ভালো। লক্ষ্য হলো একটি ক্র্যাশকে যে সেকশন ভেঙেছে তাতে সীমাবদ্ধ রাখা, প্রতিটি সম্ভাব্য ব্যর্থতা দূর করা নয়।</p>', 'কয়েকটি বাউন্ডারি, ইচ্ছাকৃতভাবে রাখা'),
    ],
  },
})

lessons.push({
  slug: 'styling',
  sortOrder: 23,
  en: {
    title: 'Styling in React',
    metaTitle: 'Styling in React | Learn Computer Academy',
    metaDescription: 'The main approaches to styling a React component — plain CSS files, CSS Modules for scoped styles, and inline style objects.',
    blocks: [
      p('<p>React doesn\'t require any one styling approach — it\'s unopinionated here, and several genuinely common patterns exist side by side in real projects.</p>'),

      h(2, 'Plain CSS'),
      p('<p>A regular <code>.css</code> file, imported directly into a component, works with the build tooling from the Setup lesson — the same CSS you already know from the <a href="/css/">CSS section</a>, applied with <code>className</code> instead of HTML\'s <code>class</code>:</p>'),
      code('jsx', 'import \'./Button.css\';\n\nfunction Button({ children }) {\n  return <button className="btn-primary">{children}</button>;\n}'),
      code('css', '.btn-primary {\n  background: #3b82f6;\n  color: white;\n  padding: 8px 16px;\n  border-radius: 6px;\n}'),
      callout('warning', '<p>Plain CSS class names are <b>global</b> across the whole app — a class named <code>.card</code> in one file collides with any other file that also defines <code>.card</code>. This is exactly the problem CSS Modules solves.</p>', 'Plain CSS has no scoping'),

      h(2, 'CSS Modules'),
      p('<p>A file named <code>*.module.css</code> gets special handling from the build tool: each class name is automatically rewritten to something unique, so styles never leak between components:</p>'),
      code('jsx', 'import styles from \'./Button.module.css\';\n\nfunction Button({ children }) {\n  return <button className={styles.primary}>{children}</button>;\n}'),
      code('css', '/* Button.module.css */\n.primary {\n  background: #3b82f6;\n  color: white;\n  padding: 8px 16px;\n  border-radius: 6px;\n}'),
      p('<p><code>styles.primary</code> resolves to something like <code>Button_primary__a1b2c</code> at build time — genuinely unique, no manual naming convention needed to avoid collisions.</p>'),

      h(2, 'Inline Styles'),
      p('<p>The <code>style</code> prop takes a JavaScript object, not a CSS string — property names are camelCase, matching JavaScript convention rather than CSS\'s hyphenated one:</p>'),
      code('jsx', 'function Box({ color }) {\n  return <div style={{ backgroundColor: color, padding: \'16px\' }}>Content</div>;\n}'),
      callout('note', '<p>Inline styles are the right tool specifically for a value computed at runtime (a color from props, a position from a drag interaction) — for anything static, a CSS file or CSS Module is easier to maintain and supports things inline styles can\'t, like <code>:hover</code> or media queries.</p>', 'Inline styles for dynamic values, CSS files for the rest'),

      h(2, 'Conditional Class Names'),
      p('<p>Combining classes based on state or props is common enough that most real projects reach for a small helper library (<code>clsx</code> or <code>classnames</code>) rather than string-concatenating by hand:</p>'),
      code('jsx', 'function Button({ variant, children }) {\n  return (\n    <button className={variant === \'danger\' ? \'btn btn-danger\' : \'btn\'}>\n      {children}\n    </button>\n  );\n}'),
    ],
  },
  bn: {
    title: 'React-এ স্টাইলিং',
    metaTitle: 'React-এ স্টাইলিং | Learn Computer Academy',
    metaDescription: 'একটি React কম্পোনেন্ট স্টাইল করার প্রধান পদ্ধতি — সাধারণ CSS ফাইল, স্কোপড স্টাইলের জন্য CSS Module, আর inline style অবজেক্ট।',
    blocks: [
      p('<p>React কোনো একটি স্টাইলিং পদ্ধতি দাবি করে না — এখানে এটি নিরপেক্ষ, আর বাস্তব প্রজেক্টে বেশ কয়েকটি সত্যিকারভাবে সাধারণ প্যাটার্ন পাশাপাশি বিদ্যমান।</p>'),

      h(2, 'সাধারণ CSS', 'plain-css'),
      p('<p>একটি সাধারণ <code>.css</code> ফাইল, সরাসরি একটি কম্পোনেন্টে ইম্পোর্ট করা, Setup পাঠের বিল্ড টুলিংয়ের সাথে কাজ করে — <a href="/bn/css/">CSS অংশ</a> থেকে ইতিমধ্যে জানা একই CSS, HTML-এর <code>class</code>-এর বদলে <code>className</code> দিয়ে প্রয়োগ করা:</p>'),
      code('jsx', 'import \'./Button.css\';\n\nfunction Button({ children }) {\n  return <button className="btn-primary">{children}</button>;\n}'),
      code('css', '.btn-primary {\n  background: #3b82f6;\n  color: white;\n  padding: 8px 16px;\n  border-radius: 6px;\n}'),
      callout('warning', '<p>সাধারণ CSS ক্লাসের নাম পুরো অ্যাপ জুড়ে <b>গ্লোবাল</b> — একটি ফাইলে <code>.card</code> নামের একটি ক্লাস আরেকটি ফাইলের সাথে সংঘর্ষ করে যা একই <code>.card</code> সংজ্ঞায়িত করে। CSS Module ঠিক এই সমস্যাটাই সমাধান করে।</p>', 'সাধারণ CSS-এ কোনো স্কোপিং নেই'),

      h(2, 'CSS Module', 'css-modules'),
      p('<p><code>*.module.css</code> নামের একটি ফাইল বিল্ড টুল থেকে বিশেষ হ্যান্ডলিং পায়: প্রতিটি ক্লাসের নাম স্বয়ংক্রিয়ভাবে ইউনিক কিছুতে পুনর্লিখিত হয়, তাই স্টাইল কখনো কম্পোনেন্টের মধ্যে leak করে না:</p>'),
      code('jsx', 'import styles from \'./Button.module.css\';\n\nfunction Button({ children }) {\n  return <button className={styles.primary}>{children}</button>;\n}'),
      code('css', '/* Button.module.css */\n.primary {\n  background: #3b82f6;\n  color: white;\n  padding: 8px 16px;\n  border-radius: 6px;\n}'),
      p('<p><code>styles.primary</code> বিল্ড টাইমে <code>Button_primary__a1b2c</code>-এর মতো কিছুতে resolve হয় — সত্যিকারভাবে ইউনিক, সংঘর্ষ এড়াতে কোনো ম্যানুয়াল নামকরণ প্রথার দরকার নেই।</p>'),

      h(2, 'Inline স্টাইল', 'inline-styles'),
      p('<p><code>style</code> প্রপ একটি CSS স্ট্রিং নয়, একটি JavaScript অবজেক্ট নেয় — প্রপার্টির নাম camelCase, CSS-এর হাইফেনেটেড কনভেনশনের বদলে JavaScript প্রথার সাথে মেলে:</p>'),
      code('jsx', 'function Box({ color }) {\n  return <div style={{ backgroundColor: color, padding: \'16px\' }}>Content</div>;\n}'),
      callout('note', '<p>Inline স্টাইল নির্দিষ্টভাবে রানটাইমে হিসাব করা একটি মানের জন্য সঠিক টুল (props থেকে একটি রঙ, একটি ড্র্যাগ ইন্টারঅ্যাকশন থেকে একটি position) — স্ট্যাটিক যেকোনো কিছুর জন্য, একটি CSS ফাইল বা CSS Module বজায় রাখা সহজ আর <code>:hover</code> বা media query-র মতো জিনিস সাপোর্ট করে যা inline স্টাইল পারে না।</p>', 'ডাইনামিক মানের জন্য inline স্টাইল, বাকিদের জন্য CSS ফাইল'),

      h(2, 'কন্ডিশনাল ক্লাসের নাম', 'conditional-class-names'),
      p('<p>state বা props-এর উপর ভিত্তি করে ক্লাস একত্রিত করা যথেষ্ট সাধারণ যে বেশিরভাগ বাস্তব প্রজেক্ট হাতে স্ট্রিং-কনক্যাটেনেট করার বদলে একটি ছোট হেল্পার লাইব্রেরির (<code>clsx</code> বা <code>classnames</code>) দিকে যায়:</p>'),
      code('jsx', 'function Button({ variant, children }) {\n  return (\n    <button className={variant === \'danger\' ? \'btn btn-danger\' : \'btn\'}>\n      {children}\n    </button>\n  );\n}'),
    ],
  },
})

lessons.push({
  slug: 'performance',
  sortOrder: 24,
  en: {
    title: 'Performance Basics',
    metaTitle: 'React Performance Basics | Learn Computer Academy',
    metaDescription: 'How React re-renders actually work, and using React.memo to skip re-rendering a component when its props haven\'t changed.',
    blocks: [
      p('<p>Understanding what actually triggers a re-render is the foundation for reasoning about React performance at all — most of it comes down to one fact worth stating plainly.</p>'),

      h(2, 'What Triggers a Re-Render'),
      p('<p>When a component\'s state changes (via a <code>useState</code> setter), React re-renders that component <b>and every one of its child components</b> — regardless of whether those children\'s own props actually changed. This is deliberate, and correct by default: it\'s cheap in the vast majority of real components.</p>'),
      code('jsx', 'function Parent() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <button onClick={() => setCount(count + 1)}>{count}</button>\n      <ExpensiveChild /> {/* re-renders every time count changes, even with no props of its own */}\n    </div>\n  );\n}'),

      h(2, 'React.memo'),
      p('<p>For a component that\'s genuinely expensive to re-render and receives the same props most of the time, <code>React.memo</code> skips re-rendering it when its props haven\'t changed:</p>'),
      code('jsx', 'const ExpensiveChild = React.memo(function ExpensiveChild({ data }) {\n  // only re-renders when `data` actually changes\n  return <ComplexVisualization data={data} />;\n});'),
      callout('warning', '<p><code>React.memo</code> compares props with <code>===</code> — the same reference check from the Updating State lesson. A new object or array literal created fresh on every parent render (<code>&lt;ExpensiveChild data={{ x: 1 }} /&gt;</code>) defeats it completely, since it\'s never actually equal to the previous render\'s object even when the values inside look identical. This is exactly where <code>useMemo</code>, from the earlier lesson, earns its keep — memoizing the object itself, not just the child\'s render.</p>', 'React.memo needs stable prop references to help at all'),

      h(2, 'Measure Before Optimizing'),
      p('<p>React DevTools\' <b>Profiler</b> tab shows exactly which components re-rendered and how long each one took — the right first step whenever something feels slow, rather than guessing which component to wrap in <code>React.memo</code>.</p>'),

      h(2, 'The Practical Default'),
      p('<p>Most components never need <code>React.memo</code>, <code>useMemo</code>, or <code>useCallback</code> at all — write plain components first, and reach for these specifically once the Profiler has shown a real, measured problem. This mirrors the same warning from the useMemo/useCallback lesson: optimization tools that get reached for by default add real complexity for a benefit that, most of the time, doesn\'t exist.</p>'),
    ],
  },
  bn: {
    title: 'পারফরম্যান্স বেসিক্স',
    metaTitle: 'React পারফরম্যান্স বেসিক্স | Learn Computer Academy',
    metaDescription: 'React-এর re-render আসলে কীভাবে কাজ করে, আর props না বদলালে একটি কম্পোনেন্ট re-render এড়াতে React.memo ব্যবহার করা।',
    blocks: [
      p('<p>আসলে কী একটি re-render ট্রিগার করে তা বোঝাই React পারফরম্যান্স নিয়ে যুক্তি করার ভিত্তি — এর বেশিরভাগই স্পষ্টভাবে বলার মতো একটি তথ্যে নেমে আসে।</p>'),

      h(2, 'কী একটি Re-Render ট্রিগার করে', 'what-triggers-a-re-render'),
      p('<p>একটি কম্পোনেন্টের state বদলালে (একটি <code>useState</code> setter-এর মাধ্যমে), React সেই কম্পোনেন্ট <b>আর এর প্রতিটি child কম্পোনেন্ট</b> re-render করে — সেই child-দের নিজস্ব props আসলে বদলেছে কিনা তা নির্বিশেষে। এটা ইচ্ছাকৃত, আর ডিফল্টভাবে সঠিক: বেশিরভাগ বাস্তব কম্পোনেন্টে এটা সস্তা।</p>'),
      code('jsx', 'function Parent() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <button onClick={() => setCount(count + 1)}>{count}</button>\n      <ExpensiveChild /> {/* re-renders every time count changes, even with no props of its own */}\n    </div>\n  );\n}'),

      h(2, 'React.memo', 'reactmemo'),
      p('<p>এমন একটি কম্পোনেন্টের জন্য যা re-render করা সত্যিকারভাবে ব্যয়বহুল আর বেশিরভাগ সময় একই props পায়, <code>React.memo</code> এর props না বদলালে এটা re-render করা এড়িয়ে যায়:</p>'),
      code('jsx', 'const ExpensiveChild = React.memo(function ExpensiveChild({ data }) {\n  // only re-renders when `data` actually changes\n  return <ComplexVisualization data={data} />;\n});'),
      callout('warning', '<p><code>React.memo</code> <code>===</code> দিয়ে props তুলনা করে — Updating State পাঠের একই রেফারেন্স চেক। প্রতিটি parent render-এ নতুনভাবে তৈরি একটি নতুন অবজেক্ট বা অ্যারে লিটারেল (<code>&lt;ExpensiveChild data={{ x: 1 }} /&gt;</code>) এটাকে সম্পূর্ণভাবে অকার্যকর করে দেয়, কারণ ভেতরের মান একই রকম দেখতে হলেও এটা আসলে কখনো আগের render-এর অবজেক্টের সমান হয় না। এখানেই আগের পাঠের <code>useMemo</code> নিজের জায়গা করে নেয় — শুধু child-এর render নয়, অবজেক্টটাকেই memoize করে।</p>', 'React.memo সাহায্য করতে স্থিতিশীল প্রপ রেফারেন্স দরকার'),

      h(2, 'অপ্টিমাইজ করার আগে মাপুন', 'measure-before-optimizing'),
      p('<p>React DevTools-এর <b>Profiler</b> ট্যাব ঠিক দেখায় কোন কম্পোনেন্ট re-render হয়েছে আর প্রতিটিতে কত সময় লেগেছে — কিছু ধীর মনে হলে কোন কম্পোনেন্টকে <code>React.memo</code>-এ মোড়াবেন তা অনুমান করার বদলে এটাই সঠিক প্রথম ধাপ।</p>'),

      h(2, 'ব্যবহারিক ডিফল্ট', 'the-practical-default'),
      p('<p>বেশিরভাগ কম্পোনেন্টের একদমই <code>React.memo</code>, <code>useMemo</code>, বা <code>useCallback</code>-এর দরকার হয় না — আগে সাধারণ কম্পোনেন্ট লিখুন, আর Profiler একটি আসল, মাপা সমস্যা দেখানোর পরেই নির্দিষ্টভাবে এদের দিকে যান। এটা useMemo/useCallback পাঠের একই সতর্কতার প্রতিফলন: ডিফল্টভাবে ব্যবহৃত অপ্টিমাইজেশন টুল এমন একটি সুবিধার জন্য আসল জটিলতা যোগ করে যা বেশিরভাগ সময় আসলে নেই।</p>'),
    ],
  },
})

lessons.push({
  slug: 'where-to-go-next',
  sortOrder: 25,
  en: {
    title: 'Where to Go Next',
    metaTitle: 'React: Where to Go Next | Learn Computer Academy',
    metaDescription: 'A look at TypeScript, testing, and full frameworks like Next.js — the natural next steps once core React feels comfortable.',
    blocks: [
      p('<p>This section has covered core React — components, props, state, hooks, and the tools around them. This closing lesson points toward what a real project usually adds on top.</p>'),

      h(2, 'TypeScript'),
      p('<p>Most production React code today is written in TypeScript rather than plain JavaScript — adding type declarations to props, state, and function signatures, catching a whole category of mistakes (a missing prop, a typo\'d field name) before the code ever runs. This site\'s own JavaScript section doesn\'t cover TypeScript, and it\'s a large enough topic to deserve its own dedicated learning path once React itself feels comfortable — the <a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener noreferrer">official TypeScript docs</a> are the best starting point.</p>'),

      h(2, 'Testing'),
      p('<p>React Testing Library (usually paired with a test runner like Vitest or Jest) is the standard tool for testing components — deliberately built around testing what a user actually sees and does, rather than a component\'s internal implementation details.</p>'),

      h(2, 'Full Frameworks'),
      p('<p>Everything in this section is "just React" — rendering in the browser, one page. Real production sites very often sit on top of a framework that adds server-side rendering, file-based routing, and image/font optimization:</p>'),
      table(
        ['Framework', 'Known for'],
        [
          ['Next.js', 'The most widely used React framework — server rendering, file-based routing, both fully static and dynamic pages in one project'],
          ['Remix', 'Deeply built around web fundamentals — forms and data loading tied closely to standard HTTP'],
          ['Astro', 'Ships zero JavaScript by default — React components hydrate only where a page actually needs interactivity'],
        ]
      ),

      h(2, 'State Management, at a Larger Scale'),
      p('<p>Context (from the Context API lesson) covers a lot of real cases, but very large applications sometimes reach for a dedicated state management library — Redux, Zustand, and Jotai are the most common — when state genuinely needs to be shared and updated from many unrelated places across a big app.</p>'),

      h(2, 'Where the Official Docs Help'),
      p('<p>This section can\'t track every detail of a library that keeps evolving. The <a href="https://react.dev" target="_blank" rel="noopener noreferrer">official React documentation</a> is the authoritative, always-current reference — worth bookmarking, and worth reaching for whenever you need something more exhaustive than a lesson here provides.</p>'),

      p('<p>The fundamentals in this section — components, props, state, effects, and the rules around them — are the same whichever of these you reach for next.</p>'),
    ],
  },
  bn: {
    title: 'এরপর কোথায় যাবেন',
    metaTitle: 'React: এরপর কোথায় যাবেন | Learn Computer Academy',
    metaDescription: 'TypeScript, টেস্টিং, আর Next.js-এর মতো সম্পূর্ণ ফ্রেমওয়ার্কের দিকে একটি নজর — core React স্বাচ্ছন্দ্যজনক মনে হলে স্বাভাবিক পরের ধাপ।',
    blocks: [
      p('<p>এই অংশটি core React কভার করেছে — কম্পোনেন্ট, props, state, হুক, আর তাদের চারপাশের টুল। এই শেষ পাঠটি একটি বাস্তব প্রজেক্ট সাধারণত এর উপরে কী যোগ করে তার দিকে নির্দেশ করে।</p>'),

      h(2, 'TypeScript', 'typescript'),
      p('<p>আজকের বেশিরভাগ প্রোডাকশন React কোড সাধারণ JavaScript-এর বদলে TypeScript-এ লেখা হয় — props, state, আর ফাংশন সিগনেচারে টাইপ ডিক্লারেশন যোগ করে, কোড চলার আগেই ভুলের একটি পুরো শ্রেণী (একটি অনুপস্থিত prop, একটি ভুল বানানের ফিল্ড নাম) ধরে ফেলে। এই সাইটের নিজের JavaScript অংশ TypeScript কভার করে না, আর React নিজে স্বাচ্ছন্দ্যজনক মনে হলে এটা নিজের আলাদা শেখার পথ পাওয়ার মতো যথেষ্ট বড় একটি বিষয় — <a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener noreferrer">অফিসিয়াল TypeScript ডকুমেন্টেশন</a> সবচেয়ে ভালো শুরুর জায়গা।</p>'),

      h(2, 'টেস্টিং', 'testing'),
      p('<p>React Testing Library (সাধারণত Vitest বা Jest-এর মতো একটি টেস্ট রানারের সাথে জোড়া) কম্পোনেন্ট টেস্ট করার প্রচলিত টুল — একটি কম্পোনেন্টের অভ্যন্তরীণ implementation বিবরণের বদলে একজন ব্যবহারকারী আসলে কী দেখেন আর করেন তা টেস্ট করার চারপাশে ইচ্ছাকৃতভাবে তৈরি।</p>'),

      h(2, 'সম্পূর্ণ ফ্রেমওয়ার্ক', 'full-frameworks'),
      p('<p>এই অংশের সবকিছু "শুধু React" — ব্রাউজারে রেন্ডার করা, একটি পাতা। বাস্তব প্রোডাকশন সাইট প্রায়ই এমন একটি ফ্রেমওয়ার্কের উপরে বসে যা সার্ভার-সাইড রেন্ডারিং, ফাইল-ভিত্তিক রাউটিং, আর ইমেজ/ফন্ট অপ্টিমাইজেশন যোগ করে:</p>'),
      table(
        ['ফ্রেমওয়ার্ক', 'যার জন্য পরিচিত'],
        [
          ['Next.js', 'সবচেয়ে ব্যাপকভাবে ব্যবহৃত React ফ্রেমওয়ার্ক — সার্ভার রেন্ডারিং, ফাইল-ভিত্তিক রাউটিং, একটি প্রজেক্টে সম্পূর্ণ স্ট্যাটিক আর ডাইনামিক উভয় পাতা'],
          ['Remix', 'ওয়েব fundamentals-এর চারপাশে গভীরভাবে তৈরি — ফর্ম আর ডেটা লোডিং স্ট্যান্ডার্ড HTTP-এর সাথে ঘনিষ্ঠভাবে সংযুক্ত'],
          ['Astro', 'ডিফল্টভাবে শূন্য JavaScript পাঠায় — React কম্পোনেন্ট শুধু যেখানে একটি পাতার সত্যিই ইন্টারঅ্যাক্টিভিটি দরকার সেখানেই hydrate হয়'],
        ]
      ),

      h(2, 'বড় স্কেলে State ম্যানেজমেন্ট', 'state-management-at-a-larger-scale'),
      p('<p>Context (Context API পাঠ থেকে) অনেক বাস্তব ক্ষেত্র কভার করে, কিন্তু খুব বড় অ্যাপ্লিকেশন কখনো কখনো একটি নিবেদিত state ম্যানেজমেন্ট লাইব্রেরির দিকে যায় — Redux, Zustand, আর Jotai সবচেয়ে সাধারণ — যখন state সত্যিকারভাবে একটি বড় অ্যাপ জুড়ে অনেক অসম্পর্কিত জায়গা থেকে শেয়ার আর আপডেট হওয়া দরকার।</p>'),

      h(2, 'অফিসিয়াল ডকুমেন্টেশন যেখানে সাহায্য করে', 'where-the-official-docs-help'),
      p('<p>এই অংশটি একটি ক্রমাগত বিবর্তিত লাইব্রেরির প্রতিটি খুঁটিনাটি ট্র্যাক করতে পারে না। <a href="https://react.dev" target="_blank" rel="noopener noreferrer">অফিসিয়াল React ডকুমেন্টেশন</a> প্রামাণ্য, সবসময়-বর্তমান রেফারেন্স — বুকমার্ক করার মতো, আর এখানকার একটি পাঠ যা দেয় তার চেয়ে বেশি বিস্তারিত কিছু প্রয়োজন হলেই এটার দিকে যাওয়ার মতো।</p>'),

      p('<p>এই অংশের মূল বিষয়গুলো — কম্পোনেন্ট, props, state, effect, আর তাদের চারপাশের নিয়ম — এখান থেকে আপনি এদের মধ্যে যেটাই বেছে নিন না কেন একই থাকে।</p>'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'react').single()
  if (catErr || !category) {
    console.error('Category "react" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] react/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] react/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] react/syllabus would be soft-deleted (superseded — see the file header comment).')
    console.log('[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `react/${lesson.slug}`
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

  // react/introduction was overwritten in place above (same path as lesson
  // 1). react/syllabus has no replacement lesson with that slug, so it's
  // superseded here — but soft-delete (deleted_at) is blocked for a
  // service-role script by docs_delete_restore_guard, which requires a
  // genuine authenticated admin session (public.is_admin() reads
  // auth.uid(), which is null for the service role — same constraint
  // hit in a past session's O-20, resolved there via the /admin panel).
  // Unpublishing instead achieves the same practical result immediately:
  // "public reads published docs" already requires status = 'published',
  // so a draft doc is invisible on the live site either way. Hard-delete
  // via /admin is still the right final step, just not blocking.
  const { data: syllabusDoc } = await supabase.from('docs').select('id').eq('path', 'react/syllabus').is('deleted_at', null).maybeSingle()
  if (syllabusDoc) {
    const { error: unpubErr } = await supabase.from('docs').update({ status: 'draft' }).eq('id', syllabusDoc.id)
    if (unpubErr) console.error('Failed to unpublish react/syllabus:', unpubErr.message)
    else console.log('  ✓ unpublished react/syllabus (superseded — hard-delete via /admin when convenient)')
  } else {
    console.log('  – react/syllabus already gone, nothing to unpublish')
  }

  console.log(`\n✅ Done.`)
}

main().catch(err => { console.error(err); process.exit(1) })