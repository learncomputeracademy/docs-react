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

// ── Insert ────────────────────────────────────────────────────────────────