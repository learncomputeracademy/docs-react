#!/usr/bin/env node
// New "PHP" category — 28 lessons, per the outline approved with the site
// owner 2026-07-30 (docs/CONTENT-PIPELINE.md). Builds on the existing
// `programming` category (variables/loops/functions aren't re-taught from
// scratch here — PHP's own syntax and quirks are the focus) and the
// existing `sql` category for the PDO/MySQL lessons near the end.
//
// Original content — written fresh for this site (CONTENT-PIPELINE.md §3:
// never copied from php.net, W3Schools, GeeksforGeeks, Wikipedia, etc).
// Links to the official docs (php.net) where a full function reference
// beats reproducing one here, per the site owner's own instruction.
//
// Run incrementally as lessons are written — idempotent, safe to re-run;
// upserts on `path` / `doc_id,locale`.
//
// Usage: node scripts/create-php-content.mjs [--dry-run]

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
    title: 'Introduction to PHP',
    metaTitle: 'Introduction to PHP | Learn Computer Academy',
    metaDescription: 'What PHP is, why it still powers a huge share of the web, and where it fits next to HTML, CSS, and JavaScript in building a website.',
    blocks: [
      p('<p><b>PHP</b> is a scripting language built specifically for the web. Unlike HTML, CSS, and JavaScript — which all run in the visitor\'s browser — PHP runs on the <b>server</b>, before the page ever reaches a browser. It reads data, talks to a database, decides what content to show, and hands the finished HTML off to be displayed.</p>'),

      h(2, 'Server-Side vs. Client-Side'),
      p('<p>Every website you\'ve built so far with HTML, CSS, and JavaScript runs entirely on the visitor\'s device — that\'s <b>client-side</b>. Open the page, and the browser does all the work locally.</p><p>PHP is different. It runs on the <b>server</b> — the computer hosting the website — before anything is sent to the visitor. By the time a PHP-powered page reaches a browser, PHP has already finished its job; the browser only ever sees the plain HTML it produced. This is why "View Source" on a PHP page never shows any PHP code, only the HTML it generated.</p>'),
      table(
        ['', 'Runs where', 'Can it see a database directly?', 'Examples'],
        [
          ['Client-side', 'The visitor\'s browser', 'No', 'HTML, CSS, JavaScript'],
          ['Server-side', 'The web server', 'Yes', 'PHP, Python, Node.js'],
        ]
      ),

      h(2, 'Why PHP Still Matters'),
      p('<p>PHP has been around since 1995, and despite plenty of newer competition, it still powers a huge share of the web — including WordPress, which alone runs a large percentage of all websites. That matters practically: PHP skills are directly useful for building, customizing, or troubleshooting WordPress sites, e-commerce platforms, and countless custom web applications still running in production today.</p>'),

      h(2, 'What You Can Build With It'),
      p('<p>Because PHP runs on the server, it can do things a browser alone never could: read and write files, remember who\'s logged in between page visits, and — most importantly — talk to a database. That last one is the real reason PHP exists: it\'s what lets a website show <i>different</i> content to different people, pulled from stored data, instead of the same fixed HTML every time.</p>'),

      img(
        'docs/img/php/introduction-1',
        'Isometric diagram showing a browser sending a request to a web server, PHP running on the server to build a page, and HTML being sent back to the browser',
        1024, 768,
        'PHP runs on the server, between the request and the HTML that finally reaches your browser.'
      ),

      callout('note', '<p>This category assumes you\'re already comfortable with the general programming ideas — variables, loops, functions, and so on — from the <a href="/programming/intro/">Intro to Programming</a> section, and with HTML from the <a href="/html/intro/">HTML</a> section. If either of those feels shaky, it\'s worth a detour there first; this section moves straight into PHP\'s own syntax.</p>', 'Coming from Intro to Programming'),

      p('<p>The next lesson gets PHP actually running on your machine, so every example from here on is something you can try yourself.</p>'),
    ],
  },
  bn: {
    title: 'PHP পরিচিতি',
    metaTitle: 'PHP পরিচিতি | Learn Computer Academy',
    metaDescription: 'PHP আসলে কী, কেন এটি এখনও ওয়েবের একটা বিশাল অংশ চালায়, আর একটি ওয়েবসাইট বানানোর সময় HTML, CSS, আর JavaScript-এর পাশে এর জায়গা কোথায়।',
    blocks: [
      p('<p><b>PHP</b> ওয়েবের জন্য বিশেষভাবে তৈরি একটি স্ক্রিপ্টিং ভাষা। HTML, CSS, আর JavaScript — এই সবগুলোই visitor-এর ব্রাউজারে চলে — তার থেকে আলাদা, PHP চলে <b>সার্ভারে</b>, পাতাটি ব্রাউজারে পৌঁছানোর আগেই। এটি ডেটা পড়ে, একটি ডেটাবেসের সাথে কথা বলে, কী কন্টেন্ট দেখাতে হবে সিদ্ধান্ত নেয়, আর চূড়ান্ত HTML দেখানোর জন্য পাঠিয়ে দেয়।</p>'),

      h(2, 'সার্ভার-সাইড বনাম ক্লায়েন্ট-সাইড', 'server-side-vs-client-side'),
      p('<p>এখন পর্যন্ত আপনি HTML, CSS, আর JavaScript দিয়ে যে ওয়েবসাইট বানিয়েছেন, সবই সম্পূর্ণভাবে visitor-এর ডিভাইসে চলে — একেই বলে <b>ক্লায়েন্ট-সাইড</b>। পাতাটি খুললেই ব্রাউজার লোকালি সব কাজ করে ফেলে।</p><p>PHP আলাদা। এটি চলে <b>সার্ভারে</b> — যে কম্পিউটার ওয়েবসাইটটি হোস্ট করছে — visitor-এর কাছে কিছু পাঠানোর আগেই। একটি PHP-চালিত পাতা ব্রাউজারে পৌঁছানোর সময় PHP-এর কাজ ততক্ষণে শেষ; ব্রাউজার শুধু সেই সাধারণ HTML দেখে যা PHP তৈরি করেছে। এই কারণেই একটি PHP পাতায় "View Source" করলে কখনও কোনো PHP কোড দেখা যায় না, শুধু সেই HTML দেখা যায় যা এটি তৈরি করেছে।</p>'),
      table(
        ['', 'কোথায় চলে', 'সরাসরি ডেটাবেস দেখতে পারে?', 'উদাহরণ'],
        [
          ['ক্লায়েন্ট-সাইড', 'visitor-এর ব্রাউজার', 'না', 'HTML, CSS, JavaScript'],
          ['সার্ভার-সাইড', 'ওয়েব সার্ভার', 'হ্যাঁ', 'PHP, Python, Node.js'],
        ]
      ),

      h(2, 'PHP এখনও কেন গুরুত্বপূর্ণ', 'why-php-still-matters'),
      p('<p>PHP আছে 1995 সাল থেকে, আর অনেক নতুন প্রতিদ্বন্দ্বী সত্ত্বেও এটি এখনও ওয়েবের একটা বিশাল অংশ চালায় — যার মধ্যে আছে WordPress, যা একাই বেশিরভাগ ওয়েবসাইট চালায়। এটা বাস্তবে গুরুত্বপূর্ণ: PHP-এর দক্ষতা সরাসরি কাজে লাগে WordPress সাইট বানাতে, কাস্টমাইজ করতে বা সমস্যা সমাধান করতে, ই-কমার্স প্ল্যাটফর্মে, আর আজও প্রোডাকশনে চলা অসংখ্য কাস্টম ওয়েব অ্যাপ্লিকেশনে।</p>'),

      h(2, 'এটি দিয়ে আপনি কী বানাতে পারেন', 'what-you-can-build-with-it'),
      p('<p>PHP সার্ভারে চলে বলে এটি এমন কাজ করতে পারে যা শুধু একটি ব্রাউজার কখনো একা পারত না: ফাইল পড়া আর লেখা, পাতা visit-এর মধ্যে কে লগ-ইন করে আছে তা মনে রাখা, আর — সবচেয়ে গুরুত্বপূর্ণ — একটি ডেটাবেসের সাথে কথা বলা। এই শেষটাই আসলে PHP থাকার আসল কারণ: এটাই একটি ওয়েবসাইটকে প্রতিবার একই ফিক্সড HTML-এর বদলে, সংরক্ষিত ডেটা থেকে বিভিন্ন মানুষকে <i>ভিন্ন ভিন্ন</i> কন্টেন্ট দেখাতে দেয়।</p>'),

      img(
        'docs/img/php/introduction-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে দেখানো হয়েছে ব্রাউজার একটি রিকোয়েস্ট সার্ভারে পাঠাচ্ছে, সার্ভারে PHP চলে একটি পাতা তৈরি করছে, আর HTML ব্রাউজারে ফেরত পাঠানো হচ্ছে',
        1024, 768,
        'PHP চলে সার্ভারে, রিকোয়েস্ট আর সেই HTML-এর মাঝখানে যা শেষমেশ আপনার ব্রাউজারে পৌঁছায়।'
      ),

      callout('note', '<p>এই অংশটি ধরে নেয় আপনি ইতিমধ্যেই সাধারণ প্রোগ্রামিং ধারণাগুলোতে — ভ্যারিয়েবল, লুপ, ফাংশন ইত্যাদি — <a href="/bn/programming/intro/">প্রোগ্রামিং পরিচিতি</a> অংশ থেকে, আর HTML নিয়ে <a href="/bn/html/intro/">HTML</a> অংশ থেকে স্বাচ্ছন্দ্য বোধ করছেন। এর কোনোটা নিয়ে অনিশ্চিত থাকলে, আগে সেখানে একবার ঘুরে আসা ভালো; এই অংশটি সরাসরি PHP-এর নিজস্ব সিনট্যাক্সে চলে যাবে।</p>', 'Intro to Programming থেকে আসছেন'),

      p('<p>পরের পাঠে আপনার নিজের মেশিনে PHP আসলেই চালু করা হবে, যাতে এখান থেকে প্রতিটি উদাহরণ আপনি নিজে চেষ্টা করে দেখতে পারেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'setup',
  sortOrder: 2,
  en: {
    title: 'Setting Up PHP',
    metaTitle: 'Setting Up PHP | Learn Computer Academy',
    metaDescription: 'How to get PHP running on your own computer using its built-in development server, and write your first Hello, World script.',
    blocks: [
      p('<p>Because PHP runs on a server, you need something acting as a server to try it out — but that doesn\'t mean installing complicated software. PHP ships with a small <b>built-in development server</b> that\'s more than enough for learning and local testing.</p>'),

      h(2, 'Installing PHP'),
      p('<p>Download PHP from <a href="https://www.php.net/downloads" target="_blank" rel="noopener noreferrer">php.net/downloads</a> (Windows) or install it through your system\'s package manager (<code>brew install php</code> on macOS, <code>apt install php</code> on most Linux distributions). Once it\'s installed, confirm it worked by checking the version from a terminal:</p>'),
      code('bash', 'php --version'),
      p('<p>If that prints a version number, PHP is ready to use.</p>'),

      h(2, 'Your First Script'),
      p('<p>Create a file named <code>index.php</code> with the following content:</p>'),
      code('php', '<?php\n  echo "Hello, world!";\n?>'),
      p('<p>Every PHP script needs to be inside <code>&lt;?php ... ?&gt;</code> tags — that\'s how the server knows where PHP code starts and stops (you\'ll look at this properly in the next lesson). <code>echo</code> is the command that outputs text.</p>'),

      h(2, 'Running It with the Built-In Server'),
      p('<p>From the same folder as <code>index.php</code>, run:</p>'),
      code('bash', 'php -S localhost:8000'),
      p('<p>Then open <code>http://localhost:8000</code> in a browser. You should see <b>Hello, world!</b> — that text was generated by PHP running on your machine, not typed directly into an HTML file.</p>'),

      callout('tip', '<p>The built-in server (<code>php -S</code>) is perfect for learning and local development, but it\'s not meant for a real, public website — a live site needs a proper web server like Apache or Nginx alongside PHP. That\'s a deployment topic, not something you need to worry about while learning the language itself.</p>', 'Built-in server = local only'),

      p('<p>With PHP actually running, the next lesson looks at the syntax rules you just used — the <code>&lt;?php ?&gt;</code> tags, statements, and comments — in proper detail.</p>'),
    ],
  },
  bn: {
    title: 'PHP সেটআপ করা',
    metaTitle: 'PHP সেটআপ করা | Learn Computer Academy',
    metaDescription: 'নিজের কম্পিউটারে PHP-এর বিল্ট-ইন ডেভেলপমেন্ট সার্ভার ব্যবহার করে কীভাবে PHP চালু করবেন, আর আপনার প্রথম Hello, World স্ক্রিপ্ট লিখবেন।',
    blocks: [
      p('<p>PHP যেহেতু সার্ভারে চলে, তাই এটি চেষ্টা করে দেখার জন্য সার্ভারের মতো কিছু একটা লাগবে — কিন্তু এর মানে জটিল সফটওয়্যার ইনস্টল করা নয়। PHP-এর সাথে একটি ছোট <b>বিল্ট-ইন ডেভেলপমেন্ট সার্ভার</b> আসে, যা শেখা আর লোকাল টেস্টিংয়ের জন্য যথেষ্টের চেয়েও বেশি।</p>'),

      h(2, 'PHP ইনস্টল করা', 'installing-php'),
      p('<p><a href="https://www.php.net/downloads" target="_blank" rel="noopener noreferrer">php.net/downloads</a> থেকে PHP ডাউনলোড করুন (Windows), অথবা নিজের সিস্টেমের প্যাকেজ ম্যানেজার দিয়ে ইনস্টল করুন (macOS-এ <code>brew install php</code>, বেশিরভাগ Linux ডিস্ট্রিবিউশনে <code>apt install php</code>)। ইনস্টল হয়ে গেলে, টার্মিনাল থেকে ভার্সন চেক করে নিশ্চিত হয়ে নিন কাজ করেছে কিনা:</p>'),
      code('bash', 'php --version'),
      p('<p>এটি যদি একটি ভার্সন নাম্বার প্রিন্ট করে, তাহলে PHP ব্যবহারের জন্য তৈরি।</p>'),

      h(2, 'আপনার প্রথম স্ক্রিপ্ট', 'your-first-script'),
      p('<p>নিচের কন্টেন্ট দিয়ে <code>index.php</code> নামে একটি ফাইল তৈরি করুন:</p>'),
      code('php', '<?php\n  echo "Hello, world!";\n?>'),
      p('<p>প্রতিটি PHP স্ক্রিপ্টকে অবশ্যই <code>&lt;?php ... ?&gt;</code> ট্যাগের ভেতরে থাকতে হবে — এভাবেই সার্ভার জানে কোথায় PHP কোড শুরু আর শেষ হচ্ছে (পরের পাঠে এটি বিস্তারিত দেখবেন)। <code>echo</code> হলো টেক্সট আউটপুট করার কমান্ড।</p>'),

      h(2, 'বিল্ট-ইন সার্ভার দিয়ে চালানো', 'running-it-with-the-built-in-server'),
      p('<p><code>index.php</code>-এর একই ফোল্ডার থেকে রান করুন:</p>'),
      code('bash', 'php -S localhost:8000'),
      p('<p>এরপর ব্রাউজারে <code>http://localhost:8000</code> খুলুন। আপনি <b>Hello, world!</b> দেখতে পাবেন — এই টেক্সটটি আপনার মেশিনে চলা PHP তৈরি করেছে, সরাসরি একটি HTML ফাইলে টাইপ করা হয়নি।</p>'),

      callout('tip', '<p>বিল্ট-ইন সার্ভার (<code>php -S</code>) শেখা আর লোকাল ডেভেলপমেন্টের জন্য একদম উপযুক্ত, কিন্তু এটি সত্যিকারের পাবলিক ওয়েবসাইটের জন্য নয় — একটি লাইভ সাইটের জন্য PHP-এর পাশাপাশি Apache বা Nginx-এর মতো একটি প্রকৃত ওয়েব সার্ভার লাগে। এটি একটি ডিপ্লয়মেন্ট বিষয়, ভাষাটি শেখার সময় এটা নিয়ে চিন্তা করার দরকার নেই।</p>', 'বিল্ট-ইন সার্ভার = শুধু লোকাল'),

      p('<p>PHP সত্যিই চালু হয়ে যাওয়ার পর, পরের পাঠে আপনি এইমাত্র যে সিনট্যাক্স ব্যবহার করলেন তা ভালোভাবে দেখবেন — <code>&lt;?php ?&gt;</code> ট্যাগ, স্টেটমেন্ট, আর কমেন্ট।</p>'),
    ],
  },
})

lessons.push({
  slug: 'syntax-basics',
  sortOrder: 3,
  en: {
    title: 'PHP Syntax Basics',
    metaTitle: 'PHP Syntax Basics | Learn Computer Academy',
    metaDescription: 'The ground rules of PHP syntax — opening and closing tags, statements, semicolons, and comments — before writing anything more complex.',
    blocks: [
      p('<p>Before going any further, it\'s worth nailing down the small rules that every single PHP file follows, so they stop being a distraction once real logic starts.</p>'),

      h(2, 'The PHP Tag'),
      p('<p>PHP code always lives between <code>&lt;?php</code> and <code>?&gt;</code>. Everything inside those tags is executed as PHP; everything outside them — even in the same file — is sent straight through as plain HTML.</p>'),
      code('php', '<h1>My Page</h1>\n\n<?php\n  echo "This part is PHP.";\n?>\n\n<p>This part is plain HTML again.</p>'),
      p('<p>This is what makes PHP genuinely useful for building web pages: a single file can freely mix static HTML with dynamic PHP, switching between the two as often as needed. If a file contains <i>only</i> PHP (like a script you\'ll never mix with HTML), it\'s common practice to leave off the closing <code>?&gt;</code> tag entirely — it avoids an easy-to-miss bug where a stray blank line after it causes unexpected output.</p>'),

      h(2, 'Statements End with a Semicolon'),
      p('<p>Every PHP statement ends with a semicolon (<code>;</code>) — the same rule as JavaScript. Forgetting one is one of the most common beginner mistakes, and PHP will refuse to run the script until it\'s fixed.</p>'),
      code('php', '<?php\n  echo "Line one";\n  echo "Line two"; // both statements need their own semicolon\n?>'),

      h(2, 'Case Sensitivity'),
      p('<p>PHP is a mix of case-sensitive and case-insensitive, and it catches people out: <b>variable names are case-sensitive</b> (<code>$name</code> and <code>$Name</code> are two different variables), but <b>function and keyword names are not</b> (<code>echo</code>, <code>ECHO</code>, and <code>Echo</code> all work identically). The safe habit is to always write everything in lowercase anyway, and treat variables as strictly case-sensitive.</p>'),

      h(2, 'Comments'),
      p('<p>PHP supports three comment styles, borrowed from other languages you may already recognize:</p>'),
      code('php', '<?php\n  // single-line comment\n  # also a single-line comment\n  /* multi-line\n     comment */\n?>'),
      p('<p><code>//</code> is by far the most common in practice. Comments are never sent to the browser — they exist purely for anyone reading the source code later, including future you.</p>'),

      callout('tip', '<p>Whitespace (spaces, tabs, blank lines) between statements doesn\'t matter to PHP the way it does in some other languages — it\'s there purely to help humans read the code. Consistent indentation is still worth keeping as a habit, even though PHP itself won\'t enforce it.</p>', 'Whitespace is for you, not PHP'),

      p('<p>With the ground rules out of the way, the next lesson looks at how PHP actually stores data — starting with variables.</p>'),
    ],
  },
  bn: {
    title: 'PHP সিনট্যাক্স বেসিক্স',
    metaTitle: 'PHP সিনট্যাক্স বেসিক্স | Learn Computer Academy',
    metaDescription: 'প্রতিটি PHP ফাইল যে ছোটখাটো নিয়ম মেনে চলে — ওপেনিং আর ক্লোজিং ট্যাগ, স্টেটমেন্ট, সেমিকোলন, আর কমেন্ট — আরও জটিল কিছু লেখার আগে সেগুলো ভালোভাবে জেনে নেওয়া।',
    blocks: [
      p('<p>আরও এগোনোর আগে, প্রতিটি PHP ফাইল যে ছোট নিয়মগুলো মেনে চলে তা ঠিকভাবে জেনে নেওয়া ভালো, যাতে আসল লজিক লেখা শুরু হলে এগুলো আর মনোযোগ বিঘ্নিত না করে।</p>'),

      h(2, 'PHP ট্যাগ', 'the-php-tag'),
      p('<p>PHP কোড সবসময় থাকে <code>&lt;?php</code> আর <code>?&gt;</code>-এর মাঝে। এই ট্যাগের ভেতরের সবকিছু PHP হিসেবে এক্সিকিউট হয়; এর বাইরের সবকিছু — এমনকি একই ফাইলেও — সরাসরি সাধারণ HTML হিসেবে পাঠানো হয়।</p>'),
      code('php', '<h1>My Page</h1>\n\n<?php\n  echo "This part is PHP.";\n?>\n\n<p>This part is plain HTML again.</p>'),
      p('<p>এটাই PHP-কে ওয়েব পেজ বানানোর জন্য সত্যিকারভাবে উপযোগী করে তোলে: একটি ফাইলে স্বাধীনভাবে স্ট্যাটিক HTML আর ডাইনামিক PHP মেশানো যায়, যতবার প্রয়োজন ততবার একটি থেকে আরেকটিতে বদলানো যায়। যদি একটি ফাইলে <i>শুধু</i> PHP থাকে (যেমন এমন একটি স্ক্রিপ্ট যা আপনি কখনো HTML-এর সাথে মেশাবেন না), তাহলে ক্লোজিং <code>?&gt;</code> ট্যাগ পুরোপুরি বাদ দেওয়া একটি প্রচলিত অভ্যাস — এটি এমন একটি সহজে-এড়িয়ে-যাওয়া বাগ এড়াতে সাহায্য করে, যেখানে এর পরে একটি ভুলবশত খালি লাইন অপ্রত্যাশিত আউটপুট তৈরি করে।</p>'),

      h(2, 'স্টেটমেন্ট সেমিকোলন দিয়ে শেষ হয়', 'statements-end-with-a-semicolon'),
      p('<p>প্রতিটি PHP স্টেটমেন্ট একটি সেমিকোলন (<code>;</code>) দিয়ে শেষ হয় — JavaScript-এর মতোই একই নিয়ম। এটি ভুলে যাওয়া নতুনদের সবচেয়ে সাধারণ ভুলগুলোর একটি, আর PHP এটি ঠিক না করা পর্যন্ত স্ক্রিপ্ট চালাতে অস্বীকার করবে।</p>'),
      code('php', '<?php\n  echo "Line one";\n  echo "Line two"; // both statements need their own semicolon\n?>'),

      h(2, 'কেস সেনসিটিভিটি', 'case-sensitivity'),
      p('<p>PHP কেস-সেনসিটিভ আর কেস-ইনসেনসিটিভের একটা মিশ্রণ, আর এটি অনেককে ভুল করায়: <b>ভ্যারিয়েবলের নাম কেস-সেনসিটিভ</b> (<code>$name</code> আর <code>$Name</code> দুটো আলাদা ভ্যারিয়েবল), কিন্তু <b>ফাংশন আর কীওয়ার্ডের নাম কেস-সেনসিটিভ নয়</b> (<code>echo</code>, <code>ECHO</code>, আর <code>Echo</code> সবগুলোই একইভাবে কাজ করে)। নিরাপদ অভ্যাস হলো সবসময় সবকিছু lowercase-এ লেখা, আর ভ্যারিয়েবলগুলোকে কঠোরভাবে কেস-সেনসিটিভ ধরে নেওয়া।</p>'),

      h(2, 'কমেন্ট', 'comments'),
      p('<p>PHP তিনটি কমেন্ট স্টাইল সাপোর্ট করে, যা আপনি অন্য ভাষা থেকে হয়তো আগে থেকেই চেনেন:</p>'),
      code('php', '<?php\n  // single-line comment\n  # also a single-line comment\n  /* multi-line\n     comment */\n?>'),
      p('<p><code>//</code> বাস্তবে সবচেয়ে বেশি ব্যবহৃত হয়। কমেন্ট কখনো ব্রাউজারে পাঠানো হয় না — এগুলো শুধু পরে সোর্স কোড পড়া যে কারো জন্য, যার মধ্যে ভবিষ্যতের আপনিও আছেন।</p>'),

      callout('tip', '<p>স্টেটমেন্টের মধ্যে whitespace (স্পেস, ট্যাব, খালি লাইন) PHP-এর কাছে সেই অর্থে গুরুত্বপূর্ণ নয় যেভাবে কিছু অন্য ভাষায় হয় — এটি শুধু মানুষের কোড পড়তে সাহায্য করার জন্য থাকে। তবুও নিয়মিত ইন্ডেন্টেশন একটি অভ্যাস হিসেবে রাখা ভালো, যদিও PHP নিজে এটি জোর করবে না।</p>', 'Whitespace আপনার জন্য, PHP-এর জন্য নয়'),

      p('<p>মূল নিয়মগুলো জানা হয়ে যাওয়ার পর, পরের পাঠে দেখা হবে PHP আসলে কীভাবে ডেটা সংরক্ষণ করে — শুরু হবে ভ্যারিয়েবল দিয়ে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'variables',
  sortOrder: 4,
  en: {
    title: 'Variables in PHP',
    metaTitle: 'Variables in PHP | Learn Computer Academy',
    metaDescription: 'How PHP variables work — the $ sigil, loose typing, and the naming rules every variable has to follow.',
    blocks: [
      p('<p>A PHP variable stores a value you can use and change later — the same idea you met in <a href="/programming/variables/">Intro to Programming</a>, with PHP\'s own syntax on top.</p>'),

      h(2, 'The $ Sigil'),
      p('<p>Every PHP variable name starts with a dollar sign (<code>$</code>). This isn\'t optional decoration — it\'s how PHP tells a variable apart from a function name, a constant, or a keyword.</p>'),
      code('php', '<?php\n  $name = "Amit";\n  $age = 21;\n  echo "$name is $age years old.";\n?>'),
      p('<p>Notice that variables can be dropped directly inside a double-quoted string and PHP will substitute their value — this is called <b>string interpolation</b>, and it only works with double quotes, not single quotes (you\'ll look at strings properly in an upcoming lesson).</p>'),

      h(2, 'Naming Rules'),
      table(
        ['Rule', 'Example'],
        [
          ['Must start with a letter or underscore (never a number)', '$_id — valid, $1id — invalid'],
          ['Can contain letters, numbers, and underscores after that', '$user_2 — valid'],
          ['No spaces or hyphens allowed', '$user name — invalid'],
          ['Case-sensitive', '$Name and $name are different variables'],
        ]
      ),

      h(2, 'PHP Is Loosely Typed'),
      p('<p>You never declare a variable\'s type in PHP — no <code>int</code>, <code>string</code>, or similar keyword up front. PHP figures out the type from the value you assign, and a variable can hold a completely different type later if you reassign it:</p>'),
      code('php', '<?php\n  $value = 10;       // an integer\n  $value = "ten";    // now a string — perfectly legal\n?>'),
      p('<p>This flexibility is convenient, but it\'s also a common source of subtle bugs — the next lesson covers PHP\'s data types properly, including exactly how PHP decides what a value "really" is when it needs to.</p>'),

      callout('note', '<p>PHP variables don\'t need to be declared before use the way some languages require — assigning a value to <code>$whatever</code> for the first time is enough to create it. There\'s no separate "declaration" step.</p>', 'No separate declaration step'),
    ],
  },
  bn: {
    title: 'PHP-তে ভ্যারিয়েবল',
    metaTitle: 'PHP-তে ভ্যারিয়েবল | Learn Computer Academy',
    metaDescription: 'PHP ভ্যারিয়েবল কীভাবে কাজ করে — $ সিজিল, লুজ টাইপিং, আর প্রতিটি ভ্যারিয়েবলকে যে নামকরণের নিয়ম মানতে হয়।',
    blocks: [
      p('<p>একটি PHP ভ্যারিয়েবল এমন একটি মান সংরক্ষণ করে যা আপনি পরে ব্যবহার করতে বা বদলাতে পারেন — <a href="/bn/programming/variables/">প্রোগ্রামিং পরিচিতি</a>-তে যে ধারণা আপনি শিখেছেন, তার উপর PHP-এর নিজস্ব সিনট্যাক্স।</p>'),

      h(2, '$ সিজিল', 'the-sigil'),
      p('<p>প্রতিটি PHP ভ্যারিয়েবলের নাম একটি ডলার সাইন (<code>$</code>) দিয়ে শুরু হয়। এটি কোনো ঐচ্ছিক সাজসজ্জা নয় — এভাবেই PHP একটি ভ্যারিয়েবলকে একটি ফাংশনের নাম, একটি কনস্ট্যান্ট, বা একটি কীওয়ার্ড থেকে আলাদা করে চেনে।</p>'),
      code('php', '<?php\n  $name = "Amit";\n  $age = 21;\n  echo "$name is $age years old.";\n?>'),
      p('<p>লক্ষ্য করুন ভ্যারিয়েবল সরাসরি একটি ডাবল-কোটেড স্ট্রিং-এর ভেতরে রাখা যায় আর PHP তার মান বসিয়ে দেবে — একে বলে <b>স্ট্রিং ইন্টারপোলেশন</b>, আর এটি শুধু ডাবল কোটে কাজ করে, সিঙ্গেল কোটে নয় (আসন্ন একটি পাঠে স্ট্রিং ভালোভাবে দেখবেন)।</p>'),

      h(2, 'নামকরণের নিয়ম', 'naming-rules'),
      table(
        ['নিয়ম', 'উদাহরণ'],
        [
          ['একটি অক্ষর বা আন্ডারস্কোর দিয়ে শুরু হতে হবে (কখনো সংখ্যা দিয়ে নয়)', '$_id — বৈধ, $1id — অবৈধ'],
          ['এরপর অক্ষর, সংখ্যা, আর আন্ডারস্কোর থাকতে পারে', '$user_2 — বৈধ'],
          ['স্পেস বা হাইফেন অনুমোদিত নয়', '$user name — অবৈধ'],
          ['কেস-সেনসিটিভ', '$Name আর $name আলাদা ভ্যারিয়েবল'],
        ]
      ),

      h(2, 'PHP লুজলি টাইপড', 'php-is-loosely-typed'),
      p('<p>PHP-তে আপনি কখনো একটি ভ্যারিয়েবলের টাইপ আগে থেকে ঘোষণা করেন না — শুরুতে কোনো <code>int</code>, <code>string</code>, বা এরকম কীওয়ার্ড নেই। আপনি যে মান assign করেন তা থেকেই PHP টাইপ বুঝে নেয়, আর পরে আবার assign করলে একই ভ্যারিয়েবল সম্পূর্ণ ভিন্ন একটি টাইপও ধারণ করতে পারে:</p>'),
      code('php', '<?php\n  $value = 10;       // an integer\n  $value = "ten";    // now a string — perfectly legal\n?>'),
      p('<p>এই নমনীয়তা সুবিধাজনক, কিন্তু এটি সূক্ষ্ম বাগেরও একটি সাধারণ উৎস — পরের পাঠে PHP-এর ডেটা টাইপ ভালোভাবে দেখানো হবে, যার মধ্যে থাকবে PHP কীভাবে একটি মান "আসলে" কী তা সিদ্ধান্ত নেয়, প্রয়োজন হলে।</p>'),

      callout('note', '<p>কিছু ভাষার মতো PHP ভ্যারিয়েবলে ব্যবহারের আগে আলাদা করে ঘোষণা করার দরকার নেই — <code>$whatever</code>-এ প্রথমবার একটি মান assign করাই এটি তৈরি করার জন্য যথেষ্ট। আলাদা কোনো "ঘোষণা" ধাপ নেই।</p>', 'আলাদা ঘোষণা ধাপ নেই'),
    ],
  },
})

lessons.push({
  slug: 'data-types',
  sortOrder: 5,
  en: {
    title: 'Data Types',
    metaTitle: 'PHP Data Types | Learn Computer Academy',
    metaDescription: 'PHP\'s eight data types — string, int, float, bool, array, object, null, and callable — and PHP\'s "type juggling" between them.',
    blocks: [
      p('<p>PHP has eight data types. You\'ll use most of them constantly; a couple (<code>object</code>, <code>callable</code>) get their own dedicated lessons later in this section.</p>'),
      table(
        ['Type', 'Holds', 'Example'],
        [
          ['string', 'Text', '"Hello"'],
          ['int', 'Whole numbers', '42'],
          ['float', 'Decimal numbers', '3.14'],
          ['bool', 'true or false', 'true'],
          ['array', 'An ordered collection of values', '[1, 2, 3]'],
          ['object', 'An instance of a class', 'new Person()'],
          ['null', 'No value at all', 'null'],
          ['callable', 'A reference to a function', 'strtoupper(...)'],
        ]
      ),

      h(2, 'Checking a Variable\'s Type'),
      p('<p><code>gettype()</code> tells you what type a variable currently holds — useful while learning, and occasionally in real debugging:</p>'),
      code('php', '<?php\n  $x = 42;\n  echo gettype($x); // "integer"\n?>'),

      h(2, 'Type Juggling'),
      p('<p>PHP automatically converts between types when an operation needs it to — this is called <b>type juggling</b>. Add a string that looks like a number to an actual number, and PHP converts the string for you:</p>'),
      code('php', '<?php\n  $result = "5" + 3;  // 8 (the string "5" is converted to an int)\n  echo $result;\n?>'),
      p('<p>This is convenient, but it can also produce surprising results if you\'re not paying attention — <code>"5 apples" + 3</code> throws a warning in modern PHP rather than silently guessing. The next lesson, Type Casting, covers how to convert between types <i>deliberately</i>, instead of leaving it to PHP\'s automatic rules.</p>'),

      callout('warning', '<p><code>null</code> is not the same as an empty string <code>""</code>, and it isn\'t the same as <code>0</code> or <code>false</code> either — even though PHP will treat all of them as "falsy" in certain comparisons. <code>null</code> specifically means <i>no value was ever set</i>. This distinction matters more once you start working with databases, where a missing value and an empty one mean genuinely different things.</p>', 'null is its own thing'),
    ],
  },
  bn: {
    title: 'ডেটা টাইপ',
    metaTitle: 'PHP ডেটা টাইপ | Learn Computer Academy',
    metaDescription: 'PHP-এর আটটি ডেটা টাইপ — string, int, float, bool, array, object, null, আর callable — আর এদের মধ্যে PHP-এর "টাইপ জাগলিং"।',
    blocks: [
      p('<p>PHP-তে আটটি ডেটা টাইপ আছে। আপনি এদের বেশিরভাগ ক্রমাগত ব্যবহার করবেন; দুটো (<code>object</code>, <code>callable</code>) এই অংশের পরে নিজেদের আলাদা পাঠ পাবে।</p>'),
      table(
        ['টাইপ', 'কী ধরে রাখে', 'উদাহরণ'],
        [
          ['string', 'টেক্সট', '"Hello"'],
          ['int', 'পূর্ণ সংখ্যা', '42'],
          ['float', 'দশমিক সংখ্যা', '3.14'],
          ['bool', 'true বা false', 'true'],
          ['array', 'মানের একটি ক্রমানুসারে সাজানো সংগ্রহ', '[1, 2, 3]'],
          ['object', 'একটি ক্লাসের একটি instance', 'new Person()'],
          ['null', 'একেবারেই কোনো মান নেই', 'null'],
          ['callable', 'একটি ফাংশনের রেফারেন্স', 'strtoupper(...)'],
        ]
      ),

      h(2, 'একটি ভ্যারিয়েবলের টাইপ চেক করা', 'checking-a-variables-type'),
      p('<p><code>gettype()</code> আপনাকে বলে দেয় একটি ভ্যারিয়েবলে বর্তমানে কী টাইপ আছে — শেখার সময় দরকারি, আর মাঝেমধ্যে আসল ডিবাগিংয়েও:</p>'),
      code('php', '<?php\n  $x = 42;\n  echo gettype($x); // "integer"\n?>'),

      h(2, 'টাইপ জাগলিং', 'type-juggling'),
      p('<p>কোনো অপারেশনের প্রয়োজন হলে PHP স্বয়ংক্রিয়ভাবে টাইপের মধ্যে রূপান্তর করে দেয় — একে বলে <b>টাইপ জাগলিং</b>। একটি সংখ্যার মতো দেখতে একটি স্ট্রিং একটি প্রকৃত সংখ্যার সাথে যোগ করুন, PHP আপনার জন্য স্ট্রিংটি রূপান্তর করে দেবে:</p>'),
      code('php', '<?php\n  $result = "5" + 3;  // 8 (the string "5" is converted to an int)\n  echo $result;\n?>'),
      p('<p>এটি সুবিধাজনক, কিন্তু খেয়াল না রাখলে চমকপ্রদ ফলাফলও দিতে পারে — <code>"5 apples" + 3</code> আধুনিক PHP-তে চুপচাপ অনুমান করার বদলে একটি warning দেয়। পরের পাঠ, Type Casting, দেখাবে কীভাবে PHP-এর স্বয়ংক্রিয় নিয়মের উপর ছেড়ে না দিয়ে <i>ইচ্ছাকৃতভাবে</i> টাইপের মধ্যে রূপান্তর করা যায়।</p>'),

      callout('warning', '<p><code>null</code> একটি খালি স্ট্রিং <code>""</code>-এর মতো নয়, আর এটি <code>0</code> বা <code>false</code>-এরও মতো নয় — যদিও নির্দিষ্ট কিছু তুলনায় PHP এদের সবাইকে "falsy" হিসেবে গণ্য করবে। <code>null</code> নির্দিষ্টভাবে মানে <i>কখনো কোনো মান সেট করাই হয়নি</i>। এই পার্থক্যটা আরও গুরুত্বপূর্ণ হয়ে ওঠে যখন আপনি ডেটাবেস নিয়ে কাজ শুরু করবেন, যেখানে একটি অনুপস্থিত মান আর একটি খালি মান সত্যিকারভাবেই ভিন্ন জিনিস বোঝায়।</p>', 'null নিজেই একটি আলাদা জিনিস'),
    ],
  },
})

lessons.push({
  slug: 'type-casting',
  sortOrder: 6,
  en: {
    title: 'Type Casting',
    metaTitle: 'PHP Type Casting | Learn Computer Academy',
    metaDescription: 'How to deliberately convert a PHP value from one type to another, instead of leaving it to automatic type juggling.',
    blocks: [
      p('<p>The previous lesson showed PHP converting types automatically. <b>Type casting</b> is doing that conversion yourself, on purpose, so the result is predictable rather than left to PHP\'s own rules.</p>'),

      h(2, 'Casting with (type)'),
      p('<p>Put the target type in parentheses in front of a value to cast it:</p>'),
      code('php', '<?php\n  $price = "19.99";\n  $number = (float) $price;   // 19.99 as an actual float\n  $whole  = (int) $price;      // 19 (int cast truncates, doesn\'t round)\n  $text   = (string) 42;       // "42"\n  $flag   = (bool) 1;          // true\n?>'),
      p('<p>Note that casting to <code>int</code> <b>truncates</b> rather than rounds — <code>(int) 19.99</code> gives <code>19</code>, not <code>20</code>. Use <code>round()</code> first if you actually need rounding.</p>'),

      h(2, 'Helper Functions'),
      p('<p>PHP also provides named functions that do the same job and read a little more clearly in context:</p>'),
      code('php', '<?php\n  $n = intval("42abc");    // 42 — reads leading digits, ignores the rest\n  $f = floatval("3.14");   // 3.14\n  $s = strval(100);        // "100"\n?>'),

      h(2, 'Truthy and Falsy Values'),
      p('<p>Casting anything to <code>bool</code> follows a specific set of rules worth memorizing, since PHP applies this same logic inside every <code>if</code> statement:</p>'),
      table(
        ['Value', 'Casts to bool as'],
        [
          ['0, 0.0, "0"', 'false'],
          ['"" (empty string)', 'false'],
          ['[] (empty array)', 'false'],
          ['null', 'false'],
          ['Any other number or non-empty string', 'true'],
        ]
      ),
      callout('warning', '<p>The string <code>"0"</code> is falsy, but the string <code>"0.0"</code> is <b>truthy</b> — it\'s a non-empty string that just happens to contain the characters "0.0". This exact gotcha has caused real bugs in real PHP code; when in doubt, compare explicitly (<code>$value === "0"</code>) rather than relying on truthiness.</p>', 'The "0" vs "0.0" trap'),
    ],
  },
  bn: {
    title: 'টাইপ কাস্টিং',
    metaTitle: 'PHP টাইপ কাস্টিং | Learn Computer Academy',
    metaDescription: 'স্বয়ংক্রিয় টাইপ জাগলিংয়ের উপর না ছেড়ে দিয়ে, কীভাবে ইচ্ছাকৃতভাবে একটি PHP মান এক টাইপ থেকে আরেকটিতে রূপান্তর করবেন।',
    blocks: [
      p('<p>আগের পাঠে PHP-কে স্বয়ংক্রিয়ভাবে টাইপ রূপান্তর করতে দেখেছেন। <b>টাইপ কাস্টিং</b> মানে সেই রূপান্তরটা নিজে, ইচ্ছাকৃতভাবে করা, যাতে ফলাফল PHP-এর নিজস্ব নিয়মের উপর নির্ভর না করে অনুমানযোগ্য থাকে।</p>'),

      h(2, '(type) দিয়ে কাস্টিং', 'casting-with-type'),
      p('<p>একটি মানকে কাস্ট করতে তার সামনে বন্ধনীতে টার্গেট টাইপটি বসান:</p>'),
      code('php', '<?php\n  $price = "19.99";\n  $number = (float) $price;   // 19.99 as an actual float\n  $whole  = (int) $price;      // 19 (int cast truncates, doesn\'t round)\n  $text   = (string) 42;       // "42"\n  $flag   = (bool) 1;          // true\n?>'),
      p('<p>খেয়াল করুন <code>int</code>-এ কাস্ট করলে এটি রাউন্ড না করে <b>truncate</b> করে — <code>(int) 19.99</code> দেয় <code>19</code>, <code>20</code> নয়। সত্যিই রাউন্ডিং প্রয়োজন হলে আগে <code>round()</code> ব্যবহার করুন।</p>'),

      h(2, 'হেল্পার ফাংশন', 'helper-functions'),
      p('<p>PHP নামযুক্ত কিছু ফাংশনও দেয় যা একই কাজ করে আর প্রেক্ষাপটে একটু বেশি পরিষ্কারভাবে পড়া যায়:</p>'),
      code('php', '<?php\n  $n = intval("42abc");    // 42 — reads leading digits, ignores the rest\n  $f = floatval("3.14");   // 3.14\n  $s = strval(100);        // "100"\n?>'),

      h(2, 'Truthy আর Falsy মান', 'truthy-and-falsy-values'),
      p('<p>যেকোনো কিছুকে <code>bool</code>-এ কাস্ট করা একটি নির্দিষ্ট নিয়ম মেনে চলে যা মুখস্থ রাখা ভালো, কারণ PHP প্রতিটি <code>if</code> স্টেটমেন্টের ভেতরে ঠিক এই একই লজিক প্রয়োগ করে:</p>'),
      table(
        ['মান', 'bool-এ কাস্ট হয় এভাবে'],
        [
          ['0, 0.0, "0"', 'false'],
          ['"" (খালি স্ট্রিং)', 'false'],
          ['[] (খালি array)', 'false'],
          ['null', 'false'],
          ['অন্য যেকোনো সংখ্যা বা অ-খালি স্ট্রিং', 'true'],
        ]
      ),
      callout('warning', '<p>স্ট্রিং <code>"0"</code> falsy, কিন্তু স্ট্রিং <code>"0.0"</code> <b>truthy</b> — এটি একটি অ-খালি স্ট্রিং যাতে কাকতালীয়ভাবে "0.0" অক্ষরগুলো আছে। এই ঠিক এই ফাঁদটাই আসল PHP কোডে সত্যিকারের বাগ তৈরি করেছে; সন্দেহ থাকলে, truthiness-এর উপর নির্ভর না করে সরাসরি তুলনা করুন (<code>$value === "0"</code>)।</p>', '"0" বনাম "0.0" ফাঁদ'),
    ],
  },
})

lessons.push({
  slug: 'constants',
  sortOrder: 7,
  en: {
    title: 'Constants',
    metaTitle: 'PHP Constants | Learn Computer Academy',
    metaDescription: 'How to define values in PHP that can never change once set, using define() and const.',
    blocks: [
      p('<p>A <b>constant</b> is a named value that, unlike a variable, can never be changed once it\'s set. Use one whenever a value genuinely should never change while the script runs — a maximum file size, a tax rate, a site name.</p>'),

      h(2, 'define()'),
      code('php', '<?php\n  define("SITE_NAME", "Learn Computer Academy");\n  echo SITE_NAME;\n?>'),
      p('<p>Notice constants don\'t use the <code>$</code> sigil, and by convention are written in <code>UPPER_SNAKE_CASE</code> to make them visually stand out from ordinary variables at a glance.</p>'),

      h(2, 'const'),
      p('<p>The <code>const</code> keyword does the same job, with slightly different rules — it can only be used at the top level of a file or inside a class (you\'ll meet classes later in this section), and its value must be known at compile time rather than computed:</p>'),
      code('php', '<?php\n  const MAX_UPLOAD_SIZE = 5242880; // 5 MB, in bytes\n  echo MAX_UPLOAD_SIZE;\n?>'),

      h(2, 'Attempting to Reassign'),
      code('php', '<?php\n  define("PI", 3.14159);\n  // define("PI", 3.14); // Fatal error — PI is already defined\n?>'),
      p('<p>Trying to redefine a constant is a fatal error, not a warning — PHP stops the script entirely. That\'s the whole point of a constant: once set, it\'s a guarantee, not a suggestion.</p>'),

      callout('note', '<p>In everyday PHP code, <code>const</code> is more common than <code>define()</code> for values known ahead of time, since it\'s slightly faster and reads more consistently with other languages. <code>define()</code> is still useful when a constant\'s value needs to be computed conditionally, which <code>const</code> doesn\'t allow.</p>', 'const vs define() in practice'),
    ],
  },
  bn: {
    title: 'কনস্ট্যান্ট',
    metaTitle: 'PHP কনস্ট্যান্ট | Learn Computer Academy',
    metaDescription: 'define() আর const ব্যবহার করে PHP-তে এমন মান কীভাবে সংজ্ঞায়িত করবেন যা একবার সেট হয়ে গেলে আর কখনো বদলাতে পারবে না।',
    blocks: [
      p('<p>একটি <b>কনস্ট্যান্ট</b> হলো একটি নামযুক্ত মান যা, একটি ভ্যারিয়েবলের থেকে আলাদাভাবে, একবার সেট হয়ে গেলে আর কখনো বদলানো যায় না। যখনই কোনো মান স্ক্রিপ্ট চলার সময় সত্যিকারভাবে কখনো বদলানো উচিত না — যেমন একটি সর্বোচ্চ ফাইল সাইজ, একটি ট্যাক্স রেট, একটি সাইটের নাম — তখন এটি ব্যবহার করুন।</p>'),

      h(2, 'define()', 'define'),
      code('php', '<?php\n  define("SITE_NAME", "Learn Computer Academy");\n  echo SITE_NAME;\n?>'),
      p('<p>লক্ষ্য করুন কনস্ট্যান্টে <code>$</code> সিজিল থাকে না, আর প্রথা অনুযায়ী এগুলো <code>UPPER_SNAKE_CASE</code>-এ লেখা হয়, যাতে এক নজরে সাধারণ ভ্যারিয়েবল থেকে দৃশ্যত আলাদা বোঝা যায়।</p>'),

      h(2, 'const', 'const'),
      p('<p><code>const</code> কীওয়ার্ড একই কাজ করে, একটু ভিন্ন নিয়মে — এটি শুধু একটি ফাইলের top level-এ বা একটি ক্লাসের ভেতরে ব্যবহার করা যায় (এই অংশের পরে ক্লাস নিয়ে আপনি পরিচিত হবেন), আর এর মান হিসাব করার বদলে compile time-এই জানা থাকতে হবে:</p>'),
      code('php', '<?php\n  const MAX_UPLOAD_SIZE = 5242880; // 5 MB, in bytes\n  echo MAX_UPLOAD_SIZE;\n?>'),

      h(2, 'পুনরায় Assign করার চেষ্টা', 'attempting-to-reassign'),
      code('php', '<?php\n  define("PI", 3.14159);\n  // define("PI", 3.14); // Fatal error — PI is already defined\n?>'),
      p('<p>একটি কনস্ট্যান্ট পুনরায় সংজ্ঞায়িত করার চেষ্টা একটি warning নয়, একটি fatal error — PHP পুরো স্ক্রিপ্ট থামিয়ে দেয়। এটাই একটি কনস্ট্যান্টের আসল উদ্দেশ্য: একবার সেট হয়ে গেলে, এটি একটি গ্যারান্টি, কোনো পরামর্শ নয়।</p>'),

      callout('note', '<p>প্রতিদিনের PHP কোডে, আগে থেকে জানা মানের জন্য <code>define()</code>-এর চেয়ে <code>const</code> বেশি প্রচলিত, কারণ এটি একটু দ্রুত আর অন্য ভাষার সাথে বেশি সামঞ্জস্যপূর্ণভাবে পড়া যায়। <code>define()</code> তখনও দরকারি যখন একটি কনস্ট্যান্টের মান শর্তসাপেক্ষে হিসাব করা প্রয়োজন, যা <code>const</code> অনুমতি দেয় না।</p>', 'বাস্তবে const বনাম define()'),
    ],
  },
})

lessons.push({
  slug: 'operators',
  sortOrder: 8,
  en: {
    title: 'Operators',
    metaTitle: 'PHP Operators | Learn Computer Academy',
    metaDescription: 'PHP\'s arithmetic, comparison, logical, and string operators — including the crucial difference between == and ===.',
    blocks: [
      p('<p>Operators combine or compare values. Most will look familiar from other languages — a few of PHP\'s own quirks are worth flagging specifically.</p>'),

      h(2, 'Arithmetic Operators'),
      table(
        ['Operator', 'Meaning', 'Example'],
        [
          ['+', 'Addition', '5 + 2 → 7'],
          ['-', 'Subtraction', '5 - 2 → 3'],
          ['*', 'Multiplication', '5 * 2 → 10'],
          ['/', 'Division', '5 / 2 → 2.5'],
          ['%', 'Modulus (remainder)', '5 % 2 → 1'],
          ['**', 'Exponent', '5 ** 2 → 25'],
        ]
      ),

      h(2, 'String Concatenation'),
      p('<p>PHP uses a dot (<code>.</code>) to join strings together — not <code>+</code>, which is reserved purely for arithmetic:</p>'),
      code('php', '<?php\n  $first = "Learn";\n  $second = "Computer";\n  echo $first . " " . $second; // "Learn Computer"\n\n  $greeting = "Hello, ";\n  $greeting .= "world!"; // .= appends, same idea as +=\n  echo $greeting;\n?>'),

      h(2, 'Comparison: == vs. ==='),
      p('<p>This is the single most important operator distinction in PHP. <code>==</code> compares values only, allowing type juggling first; <code>===</code> compares both value <i>and</code> type, with no conversion at all.</p>'),
      code('php', '<?php\n  var_dump(0 == "abc");   // false in modern PHP (was true pre-8.0 — a famous gotcha)\n  var_dump(0 == "0");     // true — "0" converts to 0\n  var_dump(0 === "0");    // false — different types, no conversion\n  var_dump("5" == 5);     // true\n  var_dump("5" === 5);    // false\n?>'),
      callout('tip', '<p>Default to <code>===</code> (and <code>!==</code> for "not equal") unless you have a specific reason to want type juggling. It removes an entire category of subtle bugs before they can happen.</p>', 'Prefer === by default'),

      h(2, 'Logical Operators'),
      table(
        ['Operator', 'Meaning'],
        [
          ['&& (or and)', 'True only if both sides are true'],
          ['|| (or or)', 'True if either side is true'],
          ['!', 'Flips true to false and vice versa'],
        ]
      ),
      code('php', '<?php\n  $age = 20;\n  $hasId = true;\n  if ($age >= 18 && $hasId) {\n    echo "Entry allowed.";\n  }\n?>'),
    ],
  },
  bn: {
    title: 'অপারেটর',
    metaTitle: 'PHP অপারেটর | Learn Computer Academy',
    metaDescription: 'PHP-এর অ্যারিথমেটিক, তুলনা, লজিক্যাল, আর স্ট্রিং অপারেটর — সহ == আর ===-এর মধ্যে গুরুত্বপূর্ণ পার্থক্য।',
    blocks: [
      p('<p>অপারেটর মানকে একত্রিত করে বা তুলনা করে। বেশিরভাগই অন্য ভাষা থেকে পরিচিত মনে হবে — PHP-এর নিজস্ব কিছু বৈশিষ্ট্য বিশেষভাবে উল্লেখ করার মতো।</p>'),

      h(2, 'অ্যারিথমেটিক অপারেটর', 'arithmetic-operators'),
      table(
        ['অপারেটর', 'অর্থ', 'উদাহরণ'],
        [
          ['+', 'যোগ', '5 + 2 → 7'],
          ['-', 'বিয়োগ', '5 - 2 → 3'],
          ['*', 'গুণ', '5 * 2 → 10'],
          ['/', 'ভাগ', '5 / 2 → 2.5'],
          ['%', 'মডুলাস (ভাগশেষ)', '5 % 2 → 1'],
          ['**', 'এক্সপোনেন্ট', '5 ** 2 → 25'],
        ]
      ),

      h(2, 'স্ট্রিং কনক্যাটেনেশন', 'string-concatenation'),
      p('<p>PHP স্ট্রিং জোড়া লাগাতে একটি ডট (<code>.</code>) ব্যবহার করে — <code>+</code> নয়, যা শুধুমাত্র অ্যারিথমেটিকের জন্য সংরক্ষিত।</p>'),
      code('php', '<?php\n  $first = "Learn";\n  $second = "Computer";\n  echo $first . " " . $second; // "Learn Computer"\n\n  $greeting = "Hello, ";\n  $greeting .= "world!"; // .= appends, same idea as +=\n  echo $greeting;\n?>'),

      h(2, 'তুলনা: == বনাম ===', 'comparison-vs'),
      p('<p>এটি PHP-এর সবচেয়ে গুরুত্বপূর্ণ একক অপারেটর পার্থক্য। <code>==</code> শুধু মান তুলনা করে, আগে টাইপ জাগলিংয়ের অনুমতি দিয়ে; <code>===</code> মান <i>আর</i> টাইপ দুটোই তুলনা করে, কোনো রূপান্তর ছাড়াই।</p>'),
      code('php', '<?php\n  var_dump(0 == "abc");   // false in modern PHP (was true pre-8.0 — a famous gotcha)\n  var_dump(0 == "0");     // true — "0" converts to 0\n  var_dump(0 === "0");    // false — different types, no conversion\n  var_dump("5" == 5);     // true\n  var_dump("5" === 5);    // false\n?>'),
      callout('tip', '<p>টাইপ জাগলিং চাওয়ার নির্দিষ্ট কোনো কারণ না থাকলে ডিফল্ট হিসেবে <code>===</code> (আর "not equal"-এর জন্য <code>!==</code>) ব্যবহার করুন। এটি ঘটার আগেই এক পুরো শ্রেণীর সূক্ষ্ম বাগ দূর করে দেয়।</p>', 'ডিফল্ট হিসেবে === প্রাধান্য দিন'),

      h(2, 'লজিক্যাল অপারেটর', 'logical-operators'),
      table(
        ['অপারেটর', 'অর্থ'],
        [
          ['&& (বা and)', 'দুটো পাশই true হলে তবেই true'],
          ['|| (বা or)', 'যেকোনো একটি পাশ true হলেই true'],
          ['!', 'true-কে false আর false-কে true করে দেয়'],
        ]
      ),
      code('php', '<?php\n  $age = 20;\n  $hasId = true;\n  if ($age >= 18 && $hasId) {\n    echo "Entry allowed.";\n  }\n?>'),
    ],
  },
})

lessons.push({
  slug: 'strings',
  sortOrder: 9,
  en: {
    title: 'Strings in PHP',
    metaTitle: 'Strings in PHP | Learn Computer Academy',
    metaDescription: 'Single vs. double quotes, heredoc syntax, and the PHP string functions you\'ll reach for constantly.',
    blocks: [
      p('<p>PHP strings come with a few quoting styles and a large library of built-in functions — this lesson covers the ones you\'ll actually use day to day.</p>'),

      h(2, 'Single Quotes vs. Double Quotes'),
      p('<p>Single quotes take everything literally; double quotes interpret variables and a handful of escape sequences like <code>\\n</code> (newline):</p>'),
      code('php', '<?php\n  $name = "Priya";\n  echo \'Hello, $name\';  // literally: Hello, $name\n  echo "Hello, $name";  // Hello, Priya\n  echo "Line one\\nLine two"; // \\n becomes an actual newline\n?>'),
      p('<p>When a string has no variables to interpolate, single quotes are marginally faster and a common style choice — but this is a minor detail, not a rule.</p>'),

      h(2, 'Heredoc: Multi-Line Strings'),
      p('<p>For a long block of text with variables mixed in, <b>heredoc</b> syntax avoids piling up quotes and dots:</p>'),
      code('php', '<?php\n  $user = "Amit";\n  $message = <<<EOT\n  Hello, $user.\n  Thanks for signing up.\n  EOT;\n  echo $message;\n?>'),

      h(2, 'Common String Functions'),
      table(
        ['Function', 'What it does', 'Example'],
        [
          ['strlen($s)', 'Length of a string', 'strlen("hello") → 5'],
          ['strtoupper($s) / strtolower($s)', 'Change case', 'strtoupper("hi") → "HI"'],
          ['trim($s)', 'Removes whitespace from both ends', 'trim(" hi ") → "hi"'],
          ['str_replace($find, $replace, $s)', 'Replace all occurrences', 'str_replace("cat", "dog", "I like cat") → "I like dog"'],
          ['substr($s, $start, $length)', 'Extract part of a string', 'substr("hello", 1, 3) → "ell"'],
          ['explode($delimiter, $s)', 'Split a string into an array', 'explode(",", "a,b,c") → ["a","b","c"]'],
          ['implode($glue, $array)', 'Join an array into a string', 'implode("-", ["a","b"]) → "a-b"'],
        ]
      ),
      p('<p>PHP has well over a hundred string functions in total — see the full <a href="https://www.php.net/manual/en/ref.strings.php" target="_blank" rel="noopener noreferrer">string function reference on php.net</a> for anything not covered here.</p>'),

      callout('note', '<p>PHP array and string indexes both start at <b>0</b>, not 1 — the first character of a string is at position 0. This matches almost every language you\'re likely to learn next.</p>', 'Strings are zero-indexed too'),
    ],
  },
  bn: {
    title: 'PHP-তে স্ট্রিং',
    metaTitle: 'PHP-তে স্ট্রিং | Learn Computer Academy',
    metaDescription: 'সিঙ্গেল বনাম ডাবল কোট, heredoc সিনট্যাক্স, আর যে PHP স্ট্রিং ফাংশনগুলো আপনি নিয়মিত ব্যবহার করবেন।',
    blocks: [
      p('<p>PHP স্ট্রিং কয়েকটি কোটিং স্টাইল আর প্রচুর বিল্ট-ইন ফাংশন নিয়ে আসে — এই পাঠে সেগুলো দেখানো হবে যা আপনি প্রতিদিন আসলেই ব্যবহার করবেন।</p>'),

      h(2, 'সিঙ্গেল কোট বনাম ডাবল কোট', 'single-quotes-vs-double-quotes'),
      p('<p>সিঙ্গেল কোট সবকিছু আক্ষরিকভাবে নেয়; ডাবল কোট ভ্যারিয়েবল আর <code>\\n</code> (নতুন লাইন)-এর মতো কিছু escape sequence ব্যাখ্যা করে:</p>'),
      code('php', '<?php\n  $name = "Priya";\n  echo \'Hello, $name\';  // literally: Hello, $name\n  echo "Hello, $name";  // Hello, Priya\n  echo "Line one\\nLine two"; // \\n becomes an actual newline\n?>'),
      p('<p>যখন একটি স্ট্রিং-এ ইন্টারপোলেট করার মতো কোনো ভ্যারিয়েবল নেই, তখন সিঙ্গেল কোট সামান্য দ্রুত আর একটি প্রচলিত স্টাইল পছন্দ — কিন্তু এটি একটি ছোট বিষয়, কোনো নিয়ম নয়।</p>'),

      h(2, 'Heredoc: মাল্টি-লাইন স্ট্রিং', 'heredoc-multi-line-strings'),
      p('<p>ভ্যারিয়েবল মেশানো একটি লম্বা টেক্সট ব্লকের জন্য, <b>heredoc</b> সিনট্যাক্স অনেক কোট আর ডট জমতে দেয় না:</p>'),
      code('php', '<?php\n  $user = "Amit";\n  $message = <<<EOT\n  Hello, $user.\n  Thanks for signing up.\n  EOT;\n  echo $message;\n?>'),

      h(2, 'সাধারণ স্ট্রিং ফাংশন', 'common-string-functions'),
      table(
        ['ফাংশন', 'কী করে', 'উদাহরণ'],
        [
          ['strlen($s)', 'একটি স্ট্রিং-এর দৈর্ঘ্য', 'strlen("hello") → 5'],
          ['strtoupper($s) / strtolower($s)', 'কেস বদলানো', 'strtoupper("hi") → "HI"'],
          ['trim($s)', 'দুই প্রান্ত থেকে whitespace সরায়', 'trim(" hi ") → "hi"'],
          ['str_replace($find, $replace, $s)', 'সব occurrence replace করে', 'str_replace("cat", "dog", "I like cat") → "I like dog"'],
          ['substr($s, $start, $length)', 'স্ট্রিং-এর একটি অংশ বের করে', 'substr("hello", 1, 3) → "ell"'],
          ['explode($delimiter, $s)', 'একটি স্ট্রিংকে array-তে ভাগ করে', 'explode(",", "a,b,c") → ["a","b","c"]'],
          ['implode($glue, $array)', 'একটি array-কে স্ট্রিংয়ে জোড়া দেয়', 'implode("-", ["a","b"]) → "a-b"'],
        ]
      ),
      p('<p>PHP-তে মোট শতাধিক স্ট্রিং ফাংশন আছে — এখানে যা নেই তার জন্য দেখুন <a href="https://www.php.net/manual/en/ref.strings.php" target="_blank" rel="noopener noreferrer">php.net-এ সম্পূর্ণ স্ট্রিং ফাংশন রেফারেন্স</a>।</p>'),

      callout('note', '<p>PHP array আর স্ট্রিং, দুটোরই ইনডেক্স <b>0</b> থেকে শুরু হয়, 1 থেকে নয় — একটি স্ট্রিং-এর প্রথম অক্ষরটি থাকে position 0-এ। এটি আপনি পরে যে প্রায় প্রতিটি ভাষা শিখবেন তার সাথে মিলে যায়।</p>', 'স্ট্রিংও জিরো-ইনডেক্সড'),
    ],
  },
})

lessons.push({
  slug: 'numbers',
  sortOrder: 10,
  en: {
    title: 'Numbers and Math Functions',
    metaTitle: 'PHP Numbers and Math | Learn Computer Academy',
    metaDescription: 'Working with integers and floats in PHP, plus the built-in math functions for rounding, random numbers, and more.',
    blocks: [
      p('<p>PHP handles integers (<code>int</code>) and decimals (<code>float</code>, also called <code>double</code>) as separate types, and provides a set of built-in functions for the operations that come up constantly.</p>'),

      h(2, 'Rounding'),
      table(
        ['Function', 'What it does', 'Example'],
        [
          ['round($n)', 'Rounds to the nearest whole number', 'round(4.5) → 5'],
          ['round($n, $decimals)', 'Rounds to a set number of decimal places', 'round(3.14159, 2) → 3.14'],
          ['floor($n)', 'Always rounds down', 'floor(4.9) → 4'],
          ['ceil($n)', 'Always rounds up', 'ceil(4.1) → 5'],
        ]
      ),

      h(2, 'Other Common Math Functions'),
      code('php', '<?php\n  echo abs(-7);        // 7 — absolute value\n  echo max(3, 9, 2);   // 9 — largest of the arguments\n  echo min(3, 9, 2);   // 2 — smallest of the arguments\n  echo pow(2, 10);     // 1024 — same as 2 ** 10\n  echo sqrt(64);        // 8\n  echo rand(1, 100);   // a random integer between 1 and 100\n?>'),

      h(2, 'Formatting Numbers for Display'),
      p('<p><code>number_format()</code> is worth knowing specifically — it\'s the standard way to turn a raw number into something readable, with thousands separators and a fixed number of decimals:</p>'),
      code('php', '<?php\n  echo number_format(1234567.891, 2); // "1,234,567.89"\n?>'),

      callout('note', '<p>Division always returns a <code>float</code> in PHP unless both operands are integers and divide evenly (<code>10 / 2</code> gives the int <code>5</code>, but <code>10 / 3</code> gives a float). Use the modulus operator <code>%</code> from the Operators lesson if you specifically need the integer remainder.</p>', 'Division and floats'),
    ],
  },
  bn: {
    title: 'সংখ্যা আর ম্যাথ ফাংশন',
    metaTitle: 'PHP সংখ্যা আর ম্যাথ | Learn Computer Academy',
    metaDescription: 'PHP-তে integer আর float নিয়ে কাজ করা, সাথে রাউন্ডিং, র‍্যান্ডম সংখ্যা আর আরও অনেক কিছুর জন্য বিল্ট-ইন ম্যাথ ফাংশন।',
    blocks: [
      p('<p>PHP integer (<code>int</code>) আর দশমিক (<code>float</code>, যাকে <code>double</code>-ও বলা হয়) কে আলাদা টাইপ হিসেবে গণ্য করে, আর ক্রমাগত প্রয়োজন হয় এমন অপারেশনের জন্য বিল্ট-ইন ফাংশনের একটি সেট দেয়।</p>'),

      h(2, 'রাউন্ডিং', 'rounding'),
      table(
        ['ফাংশন', 'কী করে', 'উদাহরণ'],
        [
          ['round($n)', 'নিকটতম পূর্ণ সংখ্যায় রাউন্ড করে', 'round(4.5) → 5'],
          ['round($n, $decimals)', 'নির্দিষ্ট সংখ্যক দশমিক স্থানে রাউন্ড করে', 'round(3.14159, 2) → 3.14'],
          ['floor($n)', 'সবসময় নিচের দিকে রাউন্ড করে', 'floor(4.9) → 4'],
          ['ceil($n)', 'সবসময় উপরের দিকে রাউন্ড করে', 'ceil(4.1) → 5'],
        ]
      ),

      h(2, 'অন্যান্য সাধারণ ম্যাথ ফাংশন', 'other-common-math-functions'),
      code('php', '<?php\n  echo abs(-7);        // 7 — absolute value\n  echo max(3, 9, 2);   // 9 — largest of the arguments\n  echo min(3, 9, 2);   // 2 — smallest of the arguments\n  echo pow(2, 10);     // 1024 — same as 2 ** 10\n  echo sqrt(64);        // 8\n  echo rand(1, 100);   // a random integer between 1 and 100\n?>'),

      h(2, 'ডিসপ্লের জন্য সংখ্যা ফরম্যাট করা', 'formatting-numbers-for-display'),
      p('<p><code>number_format()</code> বিশেষভাবে জেনে রাখার মতো — এটি একটি সাধারণ সংখ্যাকে হাজার-বিভাজক আর নির্দিষ্ট সংখ্যক দশমিকসহ পঠনযোগ্য কিছুতে বদলানোর প্রচলিত উপায়:</p>'),
      code('php', '<?php\n  echo number_format(1234567.891, 2); // "1,234,567.89"\n?>'),

      callout('note', '<p>PHP-তে ভাগ সবসময় একটি <code>float</code> রিটার্ন করে, যদি না দুটো operand-ই integer হয় আর সমানভাবে ভাগ হয় (<code>10 / 2</code> দেয় int <code>5</code>, কিন্তু <code>10 / 3</code> দেয় একটি float)। নির্দিষ্টভাবে integer ভাগশেষ প্রয়োজন হলে Operators পাঠের modulus অপারেটর <code>%</code> ব্যবহার করুন।</p>', 'ভাগ আর float'),
    ],
  },
})

lessons.push({
  slug: 'indexed-arrays',
  sortOrder: 11,
  en: {
    title: 'Indexed Arrays',
    metaTitle: 'PHP Indexed Arrays | Learn Computer Academy',
    metaDescription: 'Creating and working with PHP\'s indexed arrays — ordered lists of values accessed by numeric position.',
    blocks: [
      p('<p>An <b>indexed array</b> is an ordered list of values, each automatically numbered starting from 0 — the same array concept from <a href="/programming/arrays/">Intro to Programming</a>, in PHP\'s specific syntax.</p>'),

      h(2, 'Creating an Array'),
      code('php', '<?php\n  $fruits = ["apple", "banana", "mango"];\n  echo $fruits[0]; // "apple"\n  echo $fruits[2]; // "mango"\n?>'),
      p('<p>The older <code>array(...)</code> syntax still works identically to <code>[...]</code> — you\'ll see both in real code, but square brackets are the modern standard.</p>'),

      h(2, 'Modifying an Array'),
      code('php', '<?php\n  $fruits = ["apple", "banana"];\n  $fruits[] = "mango";        // appends to the end\n  $fruits[0] = "green apple"; // overwrites index 0\n  unset($fruits[1]);          // removes "banana" — leaves a gap in the indexes\n?>'),
      callout('note', '<p><code>unset()</code> removes an element but does <b>not</b> renumber the remaining indexes to close the gap. If you need a clean, re-indexed array afterward, wrap it in <code>array_values($fruits)</code>.</p>', 'unset() leaves gaps'),

      h(2, 'Counting and Looping'),
      code('php', '<?php\n  $fruits = ["apple", "banana", "mango"];\n  echo count($fruits); // 3\n\n  foreach ($fruits as $fruit) {\n    echo $fruit . "\\n";\n  }\n?>'),
      p('<p><code>foreach</code> is by far the most common way to loop over a PHP array — you\'ll see it used constantly from here on. The Loops lesson later in this section covers it, and PHP\'s other loop types, in full.</p>'),

      h(2, 'Multi-Dimensional Arrays'),
      p('<p>An array can hold other arrays, letting you model grid-like or nested data:</p>'),
      code('php', '<?php\n  $matrix = [\n    [1, 2, 3],\n    [4, 5, 6],\n  ];\n  echo $matrix[1][2]; // 6 — second row, third column\n?>'),
    ],
  },
  bn: {
    title: 'ইনডেক্সড অ্যারে',
    metaTitle: 'PHP ইনডেক্সড অ্যারে | Learn Computer Academy',
    metaDescription: 'PHP-এর ইনডেক্সড অ্যারে তৈরি করা আর তা নিয়ে কাজ করা — সংখ্যাগত অবস্থান দিয়ে অ্যাক্সেস করা মানের একটি ক্রমানুসারে সাজানো তালিকা।',
    blocks: [
      p('<p>একটি <b>ইনডেক্সড অ্যারে</b> হলো মানের একটি ক্রমানুসারে সাজানো তালিকা, প্রতিটি স্বয়ংক্রিয়ভাবে 0 থেকে সংখ্যায়িত — <a href="/bn/programming/arrays/">প্রোগ্রামিং পরিচিতি</a>-তে শেখা একই অ্যারে ধারণা, PHP-এর নির্দিষ্ট সিনট্যাক্সে।</p>'),

      h(2, 'একটি অ্যারে তৈরি করা', 'creating-an-array'),
      code('php', '<?php\n  $fruits = ["apple", "banana", "mango"];\n  echo $fruits[0]; // "apple"\n  echo $fruits[2]; // "mango"\n?>'),
      p('<p>পুরনো <code>array(...)</code> সিনট্যাক্স এখনও <code>[...]</code>-এর মতোই কাজ করে — বাস্তব কোডে দুটোই দেখবেন, তবে স্কয়ার ব্র্যাকেট আধুনিক মান।</p>'),

      h(2, 'একটি অ্যারে পরিবর্তন করা', 'modifying-an-array'),
      code('php', '<?php\n  $fruits = ["apple", "banana"];\n  $fruits[] = "mango";        // appends to the end\n  $fruits[0] = "green apple"; // overwrites index 0\n  unset($fruits[1]);          // removes "banana" — leaves a gap in the indexes\n?>'),
      callout('note', '<p><code>unset()</code> একটি এলিমেন্ট সরিয়ে দেয় কিন্তু ফাঁকটা বন্ধ করতে বাকি ইনডেক্সগুলো পুনরায় নম্বর <b>দেয় না</b>। এরপর একটি পরিষ্কার, পুনরায়-ইনডেক্স করা অ্যারে প্রয়োজন হলে সেটাকে <code>array_values($fruits)</code>-এ মুড়ে দিন।</p>', 'unset() ফাঁক রেখে দেয়'),

      h(2, 'গণনা করা আর লুপ করা', 'counting-and-looping'),
      code('php', '<?php\n  $fruits = ["apple", "banana", "mango"];\n  echo count($fruits); // 3\n\n  foreach ($fruits as $fruit) {\n    echo $fruit . "\\n";\n  }\n?>'),
      p('<p>একটি PHP অ্যারের উপর লুপ করার সবচেয়ে প্রচলিত উপায় হলো <code>foreach</code> — এখন থেকে এটি ক্রমাগত ব্যবহার হতে দেখবেন। এই অংশের পরের Loops পাঠে এটি, আর PHP-এর অন্যান্য লুপ টাইপ, সম্পূর্ণভাবে দেখানো হবে।</p>'),

      h(2, 'মাল্টি-ডাইমেনশনাল অ্যারে', 'multi-dimensional-arrays'),
      p('<p>একটি অ্যারে অন্য অ্যারে ধারণ করতে পারে, যা দিয়ে গ্রিডের মতো বা নেস্টেড ডেটা মডেল করা যায়:</p>'),
      code('php', '<?php\n  $matrix = [\n    [1, 2, 3],\n    [4, 5, 6],\n  ];\n  echo $matrix[1][2]; // 6 — second row, third column\n?>'),
    ],
  },
})

lessons.push({
  slug: 'associative-arrays',
  sortOrder: 12,
  en: {
    title: 'Associative Arrays',
    metaTitle: 'PHP Associative Arrays | Learn Computer Academy',
    metaDescription: 'PHP\'s associative arrays — key-value pairs instead of numeric positions — and why they\'re used constantly in real PHP code.',
    blocks: [
      p('<p>An <b>associative array</b> uses named keys instead of numeric positions — the same array, just addressed by a meaningful label instead of "the third item." These show up everywhere in real PHP code, including in superglobals you\'ll meet soon.</p>'),

      h(2, 'Creating One'),
      code('php', '<?php\n  $student = [\n    "name" => "Priya",\n    "age" => 21,\n    "course" => "Web Development",\n  ];\n  echo $student["name"]; // "Priya"\n?>'),
      p('<p>The <code>=&gt;</code> symbol pairs each key with its value. Keys are usually strings, but can also be integers.</p>'),

      h(2, 'Looping Over Key-Value Pairs'),
      code('php', '<?php\n  foreach ($student as $key => $value) {\n    echo "$key: $value\\n";\n  }\n  // name: Priya\n  // age: 21\n  // course: Web Development\n?>'),

      h(2, 'Checking a Key Exists'),
      p('<p>Reading a key that isn\'t there produces a warning, not a crash — but it\'s good practice to check first, especially with data from outside your own script (forms, a database, an API):</p>'),
      code('php', '<?php\n  if (array_key_exists("email", $student)) {\n    echo $student["email"];\n  } else {\n    echo "No email on file.";\n  }\n?>'),

      h(2, 'Nested Associative Arrays'),
      p('<p>Combining arrays and associative arrays models real-world data naturally — this shape will look familiar once you reach the PHP-and-MySQL lessons, since a database row often lands in PHP exactly this way:</p>'),
      code('php', '<?php\n  $students = [\n    ["name" => "Priya", "age" => 21],\n    ["name" => "Amit", "age" => 23],\n  ];\n  echo $students[0]["name"]; // "Priya"\n?>'),
    ],
  },
  bn: {
    title: 'অ্যাসোসিয়েটিভ অ্যারে',
    metaTitle: 'PHP অ্যাসোসিয়েটিভ অ্যারে | Learn Computer Academy',
    metaDescription: 'PHP-এর অ্যাসোসিয়েটিভ অ্যারে — সংখ্যাগত অবস্থানের বদলে key-value জোড়া — আর কেন এগুলো আসল PHP কোডে ক্রমাগত ব্যবহৃত হয়।',
    blocks: [
      p('<p>একটি <b>অ্যাসোসিয়েটিভ অ্যারে</b> সংখ্যাগত অবস্থানের বদলে নামযুক্ত key ব্যবহার করে — একই অ্যারে, শুধু "তৃতীয় আইটেম"-এর বদলে একটি অর্থবহ লেবেল দিয়ে অ্যাক্সেস করা। এগুলো আসল PHP কোডে সব জায়গায় দেখা যায়, যার মধ্যে আছে শীঘ্রই আপনি যে superglobals-এর সাথে পরিচিত হবেন।</p>'),

      h(2, 'একটি তৈরি করা', 'creating-one'),
      code('php', '<?php\n  $student = [\n    "name" => "Priya",\n    "age" => 21,\n    "course" => "Web Development",\n  ];\n  echo $student["name"]; // "Priya"\n?>'),
      p('<p><code>=&gt;</code> চিহ্নটি প্রতিটি key-কে তার মানের সাথে জোড়া দেয়। Key সাধারণত স্ট্রিং হয়, তবে integer-ও হতে পারে।</p>'),

      h(2, 'Key-Value জোড়ার উপর লুপ করা', 'looping-over-key-value-pairs'),
      code('php', '<?php\n  foreach ($student as $key => $value) {\n    echo "$key: $value\\n";\n  }\n  // name: Priya\n  // age: 21\n  // course: Web Development\n?>'),

      h(2, 'একটি Key আছে কিনা চেক করা', 'checking-a-key-exists'),
      p('<p>যে key নেই তা পড়লে একটি warning হয়, ক্র্যাশ নয় — কিন্তু আগে চেক করা ভালো অভ্যাস, বিশেষ করে নিজের স্ক্রিপ্টের বাইরে থেকে আসা ডেটার ক্ষেত্রে (ফর্ম, একটি ডেটাবেস, একটি API):</p>'),
      code('php', '<?php\n  if (array_key_exists("email", $student)) {\n    echo $student["email"];\n  } else {\n    echo "No email on file.";\n  }\n?>'),

      h(2, 'নেস্টেড অ্যাসোসিয়েটিভ অ্যারে', 'nested-associative-arrays'),
      p('<p>অ্যারে আর অ্যাসোসিয়েটিভ অ্যারে একত্রিত করলে বাস্তব-জগতের ডেটা স্বাভাবিকভাবে মডেল করা যায় — এই আকৃতিটি PHP-এবং-MySQL পাঠে গিয়ে পরিচিত মনে হবে, কারণ একটি ডেটাবেস সারি প্রায়ই ঠিক এভাবেই PHP-তে আসে:</p>'),
      code('php', '<?php\n  $students = [\n    ["name" => "Priya", "age" => 21],\n    ["name" => "Amit", "age" => 23],\n  ];\n  echo $students[0]["name"]; // "Priya"\n?>'),
    ],
  },
})

lessons.push({
  slug: 'array-functions',
  sortOrder: 13,
  en: {
    title: 'Array Functions',
    metaTitle: 'PHP Array Functions | Learn Computer Academy',
    metaDescription: 'The PHP array functions you\'ll reach for constantly — array_map, array_filter, sorting, searching, and more.',
    blocks: [
      p('<p>PHP has an enormous built-in array function library — over 80 functions. This lesson covers the handful that come up in almost every real script; the <a href="https://www.php.net/manual/en/ref.array.php" target="_blank" rel="noopener noreferrer">full array function reference is on php.net</a>.</p>'),

      h(2, 'Transforming: array_map()'),
      p('<p>Applies a function to every element and returns a new array of the results:</p>'),
      code('php', '<?php\n  $prices = [100, 200, 300];\n  $withTax = array_map(fn($p) => $p * 1.18, $prices);\n  print_r($withTax); // [118, 236, 354]\n?>'),

      h(2, 'Filtering: array_filter()'),
      p('<p>Keeps only the elements that pass a test:</p>'),
      code('php', '<?php\n  $numbers = [1, 2, 3, 4, 5, 6];\n  $even = array_filter($numbers, fn($n) => $n % 2 === 0);\n  print_r($even); // [1 => 2, 3 => 4, 5 => 6] — note the original indexes stick around\n?>'),

      h(2, 'Searching'),
      code('php', '<?php\n  $fruits = ["apple", "banana", "mango"];\n  var_dump(in_array("banana", $fruits));  // true\n  var_dump(array_search("mango", $fruits)); // 2 (its index)\n?>'),

      h(2, 'Sorting'),
      table(
        ['Function', 'What it does'],
        [
          ['sort($arr)', 'Sorts values ascending, re-indexes from 0'],
          ['rsort($arr)', 'Sorts values descending, re-indexes from 0'],
          ['asort($arr)', 'Sorts values ascending, keeps original keys'],
          ['ksort($arr)', 'Sorts by key instead of value'],
        ]
      ),
      code('php', '<?php\n  $scores = [40, 10, 30, 20];\n  sort($scores);\n  print_r($scores); // [10, 20, 30, 40]\n?>'),
      callout('warning', '<p>Sorting functions like <code>sort()</code> modify the array <b>in place</b> and don\'t return the sorted array — they return <code>true</code>/<code>false</code> for success. Assigning their result to a variable is a common beginner mistake.</p>', 'sort() modifies in place'),

      h(2, 'Combining and Merging'),
      code('php', '<?php\n  $a = ["red", "green"];\n  $b = ["blue", "yellow"];\n  $all = array_merge($a, $b);\n  print_r($all); // ["red", "green", "blue", "yellow"]\n?>'),
    ],
  },
  bn: {
    title: 'অ্যারে ফাংশন',
    metaTitle: 'PHP অ্যারে ফাংশন | Learn Computer Academy',
    metaDescription: 'যে PHP অ্যারে ফাংশনগুলো আপনি ক্রমাগত ব্যবহার করবেন — array_map, array_filter, সর্টিং, সার্চিং, আর আরও অনেক কিছু।',
    blocks: [
      p('<p>PHP-তে একটি বিশাল বিল্ট-ইন অ্যারে ফাংশন লাইব্রেরি আছে — 80-এরও বেশি ফাংশন। এই পাঠে সেগুলো দেখানো হবে যা প্রায় প্রতিটি বাস্তব স্ক্রিপ্টে আসে; <a href="https://www.php.net/manual/en/ref.array.php" target="_blank" rel="noopener noreferrer">সম্পূর্ণ অ্যারে ফাংশন রেফারেন্স php.net-এ</a> আছে।</p>'),

      h(2, 'রূপান্তর: array_map()', 'transforming-array_map'),
      p('<p>প্রতিটি এলিমেন্টে একটি ফাংশন প্রয়োগ করে আর ফলাফলের একটি নতুন অ্যারে রিটার্ন করে:</p>'),
      code('php', '<?php\n  $prices = [100, 200, 300];\n  $withTax = array_map(fn($p) => $p * 1.18, $prices);\n  print_r($withTax); // [118, 236, 354]\n?>'),

      h(2, 'ফিল্টারিং: array_filter()', 'filtering-array_filter'),
      p('<p>শুধু সেই এলিমেন্টগুলো রাখে যা একটি টেস্ট পাস করে:</p>'),
      code('php', '<?php\n  $numbers = [1, 2, 3, 4, 5, 6];\n  $even = array_filter($numbers, fn($n) => $n % 2 === 0);\n  print_r($even); // [1 => 2, 3 => 4, 5 => 6] — note the original indexes stick around\n?>'),

      h(2, 'সার্চিং', 'searching'),
      code('php', '<?php\n  $fruits = ["apple", "banana", "mango"];\n  var_dump(in_array("banana", $fruits));  // true\n  var_dump(array_search("mango", $fruits)); // 2 (its index)\n?>'),

      h(2, 'সর্টিং', 'sorting'),
      table(
        ['ফাংশন', 'কী করে'],
        [
          ['sort($arr)', 'মান অনুযায়ী ascending সর্ট করে, 0 থেকে পুনরায় ইনডেক্স করে'],
          ['rsort($arr)', 'মান অনুযায়ী descending সর্ট করে, 0 থেকে পুনরায় ইনডেক্স করে'],
          ['asort($arr)', 'মান অনুযায়ী ascending সর্ট করে, মূল key রেখে দেয়'],
          ['ksort($arr)', 'মানের বদলে key অনুযায়ী সর্ট করে'],
        ]
      ),
      code('php', '<?php\n  $scores = [40, 10, 30, 20];\n  sort($scores);\n  print_r($scores); // [10, 20, 30, 40]\n?>'),
      callout('warning', '<p><code>sort()</code>-এর মতো সর্টিং ফাংশন অ্যারেকে <b>in place</b>-এ পরিবর্তন করে আর সর্ট করা অ্যারে রিটার্ন করে না — এরা সফলতার জন্য <code>true</code>/<code>false</code> রিটার্ন করে। এদের ফলাফল একটি ভ্যারিয়েবলে assign করা নতুনদের একটি সাধারণ ভুল।</p>', 'sort() in place পরিবর্তন করে'),

      h(2, 'একত্রিত করা আর মার্জ করা', 'combining-and-merging'),
      code('php', '<?php\n  $a = ["red", "green"];\n  $b = ["blue", "yellow"];\n  $all = array_merge($a, $b);\n  print_r($all); // ["red", "green", "blue", "yellow"]\n?>'),
    ],
  },
})

lessons.push({
  slug: 'control-flow',
  sortOrder: 14,
  en: {
    title: 'If, Else, and Switch',
    metaTitle: 'PHP If, Else, and Switch | Learn Computer Academy',
    metaDescription: 'PHP\'s conditional statements — if, else, elseif, switch, and the ternary and null coalescing shortcuts.',
    blocks: [
      p('<p>Conditionals let a script make decisions — the same idea from <a href="/programming/if-statements/">Intro to Programming</a>, with PHP\'s syntax and a couple of PHP-specific shortcuts worth knowing.</p>'),

      h(2, 'if, elseif, else'),
      code('php', '<?php\n  $score = 72;\n  if ($score >= 90) {\n    echo "Grade: A";\n  } elseif ($score >= 75) {\n    echo "Grade: B";\n  } elseif ($score >= 60) {\n    echo "Grade: C";\n  } else {\n    echo "Grade: F";\n  }\n?>'),
      p('<p>Note PHP uses <code>elseif</code> as one word (though <code>else if</code> as two words also works) — a small but common source of typos coming from other languages.</p>'),

      h(2, 'switch'),
      p('<p>Cleaner than a long <code>elseif</code> chain when comparing one value against several exact possibilities:</p>'),
      code('php', '<?php\n  $day = "Mon";\n  switch ($day) {\n    case "Mon":\n    case "Tue":\n    case "Wed":\n    case "Thu":\n    case "Fri":\n      echo "Weekday";\n      break;\n    case "Sat":\n    case "Sun":\n      echo "Weekend";\n      break;\n    default:\n      echo "Not a valid day";\n  }\n?>'),
      callout('warning', '<p>Forgetting <code>break;</code> is one of the most common <code>switch</code> mistakes — without it, execution "falls through" into the next case instead of stopping. Stacking cases with no code between them (like Mon through Fri above) is a deliberate, valid use of that fall-through behavior; forgetting a break where you didn\'t mean to is the bug.</p>', 'Don\'t forget break;'),

      h(2, 'The Ternary Shortcut'),
      p('<p>A compact one-line <code>if/else</code> for simple cases:</p>'),
      code('php', '<?php\n  $age = 20;\n  $status = ($age >= 18) ? "adult" : "minor";\n  echo $status; // "adult"\n?>'),

      h(2, 'Null Coalescing'),
      p('<p><code>??</code> returns the left side if it\'s set and not <code>null</code>, otherwise the right side — extremely common when reading data that might not exist, like a form field:</p>'),
      code('php', '<?php\n  $name = $_GET["name"] ?? "Guest";\n  echo $name; // "Guest" if no ?name= was in the URL\n?>'),
    ],
  },
  bn: {
    title: 'If, Else, আর Switch',
    metaTitle: 'PHP If, Else, আর Switch | Learn Computer Academy',
    metaDescription: 'PHP-এর কন্ডিশনাল স্টেটমেন্ট — if, else, elseif, switch, আর ternary আর null coalescing শর্টকাট।',
    blocks: [
      p('<p>কন্ডিশনাল একটি স্ক্রিপ্টকে সিদ্ধান্ত নিতে দেয় — <a href="/bn/programming/if-statements/">প্রোগ্রামিং পরিচিতি</a>-তে শেখা একই ধারণা, PHP-এর সিনট্যাক্স আর কয়েকটি PHP-নির্দিষ্ট শর্টকাট নিয়ে যা জানা ভালো।</p>'),

      h(2, 'if, elseif, else', 'if-elseif-else'),
      code('php', '<?php\n  $score = 72;\n  if ($score >= 90) {\n    echo "Grade: A";\n  } elseif ($score >= 75) {\n    echo "Grade: B";\n  } elseif ($score >= 60) {\n    echo "Grade: C";\n  } else {\n    echo "Grade: F";\n  }\n?>'),
      p('<p>লক্ষ্য করুন PHP <code>elseif</code>-কে একটি শব্দ হিসেবে ব্যবহার করে (যদিও দুই শব্দের <code>else if</code>-ও কাজ করে) — অন্য ভাষা থেকে আসার সময় এটি টাইপোর একটি ছোট কিন্তু সাধারণ উৎস।</p>'),

      h(2, 'switch', 'switch'),
      p('<p>একটি মানকে কয়েকটি সুনির্দিষ্ট সম্ভাবনার সাথে তুলনা করার সময় একটি লম্বা <code>elseif</code> চেইনের চেয়ে পরিষ্কার:</p>'),
      code('php', '<?php\n  $day = "Mon";\n  switch ($day) {\n    case "Mon":\n    case "Tue":\n    case "Wed":\n    case "Thu":\n    case "Fri":\n      echo "Weekday";\n      break;\n    case "Sat":\n    case "Sun":\n      echo "Weekend";\n      break;\n    default:\n      echo "Not a valid day";\n  }\n?>'),
      callout('warning', '<p><code>break;</code> ভুলে যাওয়া <code>switch</code>-এর সবচেয়ে সাধারণ ভুলগুলোর একটি — এটি ছাড়া, এক্সিকিউশন থামার বদলে পরের case-এ "fall through" করে। কোনো কোড ছাড়া কেসগুলো একসাথে রাখা (উপরে Mon থেকে Fri যেমন) সেই fall-through আচরণের একটি ইচ্ছাকৃত, বৈধ ব্যবহার; যেখানে আপনি চাননি সেখানে একটি break ভুলে যাওয়াই আসল বাগ।</p>', 'break; ভুলবেন না'),

      h(2, 'Ternary শর্টকাট', 'the-ternary-shortcut'),
      p('<p>সাধারণ ক্ষেত্রের জন্য একটি সংক্ষিপ্ত এক-লাইনের <code>if/else</code>:</p>'),
      code('php', '<?php\n  $age = 20;\n  $status = ($age >= 18) ? "adult" : "minor";\n  echo $status; // "adult"\n?>'),

      h(2, 'Null Coalescing', 'null-coalescing'),
      p('<p><code>??</code> বাম পাশ set আর <code>null</code> না হলে সেটা রিটার্ন করে, নাহলে ডান পাশ — এমন ডেটা পড়ার সময় অত্যন্ত সাধারণ যা হয়তো নেই, যেমন একটি ফর্ম ফিল্ড:</p>'),
      code('php', '<?php\n  $name = $_GET["name"] ?? "Guest";\n  echo $name; // "Guest" if no ?name= was in the URL\n?>'),
    ],
  },
})

lessons.push({
  slug: 'loops',
  sortOrder: 15,
  en: {
    title: 'Loops',
    metaTitle: 'PHP Loops | Learn Computer Academy',
    metaDescription: 'PHP\'s four loop types — for, while, do-while, and foreach — and when to reach for each one.',
    blocks: [
      p('<p>PHP has four loop types. <code>foreach</code> is what you\'ll use for arrays constantly; the other three cover everything else.</p>'),

      h(2, 'for'),
      p('<p>Best when you know exactly how many times to repeat, or need a counter:</p>'),
      code('php', '<?php\n  for ($i = 1; $i <= 5; $i++) {\n    echo "Count: $i\\n";\n  }\n?>'),

      h(2, 'while'),
      p('<p>Repeats as long as a condition stays true — used when you don\'t know the number of iterations ahead of time:</p>'),
      code('php', '<?php\n  $count = 0;\n  while ($count < 3) {\n    echo "Iteration $count\\n";\n    $count++;\n  }\n?>'),

      h(2, 'do-while'),
      p('<p>Identical to <code>while</code>, except the condition is checked <i>after</i> the loop body runs — guaranteeing at least one run, even if the condition starts false:</p>'),
      code('php', '<?php\n  $count = 10;\n  do {\n    echo "This runs once, even though $count is not < 3.\\n";\n  } while ($count < 3);\n?>'),

      h(2, 'foreach'),
      p('<p>Purpose-built for arrays — you already used this in the Indexed Arrays and Associative Arrays lessons:</p>'),
      code('php', '<?php\n  $fruits = ["apple", "banana", "mango"];\n  foreach ($fruits as $index => $fruit) {\n    echo "$index: $fruit\\n";\n  }\n?>'),

      h(2, 'break and continue'),
      code('php', '<?php\n  for ($i = 1; $i <= 10; $i++) {\n    if ($i === 6) break;      // stops the loop entirely\n    if ($i % 2 === 0) continue; // skips this iteration, keeps looping\n    echo $i . " ";\n  }\n  // Output: 1 3 5\n?>'),

      callout('tip', '<p>Reaching for <code>for</code> or <code>while</code> to loop over an array — using a manual counter and <code>$fruits[$i]</code> — works, but <code>foreach</code> is almost always clearer and less error-prone for that specific job. Save <code>for</code>/<code>while</code> for cases that aren\'t really "go through this list."</p>', 'foreach for arrays, almost always'),
    ],
  },
  bn: {
    title: 'লুপ',
    metaTitle: 'PHP লুপ | Learn Computer Academy',
    metaDescription: 'PHP-এর চারটি লুপ টাইপ — for, while, do-while, আর foreach — আর কোনটা কখন ব্যবহার করবেন।',
    blocks: [
      p('<p>PHP-তে চারটি লুপ টাইপ আছে। অ্যারের জন্য আপনি সবচেয়ে বেশি <code>foreach</code> ব্যবহার করবেন; বাকি তিনটি বাকি সবকিছু কভার করে।</p>'),

      h(2, 'for', 'for'),
      p('<p>আপনি যখন ঠিক জানেন কতবার পুনরাবৃত্তি করতে হবে, বা একটি কাউন্টার প্রয়োজন, তখন সবচেয়ে ভালো:</p>'),
      code('php', '<?php\n  for ($i = 1; $i <= 5; $i++) {\n    echo "Count: $i\\n";\n  }\n?>'),

      h(2, 'while', 'while'),
      p('<p>একটি শর্ত true থাকা পর্যন্ত পুনরাবৃত্তি করে — যখন আপনি আগে থেকে পুনরাবৃত্তির সংখ্যা জানেন না তখন ব্যবহৃত হয়:</p>'),
      code('php', '<?php\n  $count = 0;\n  while ($count < 3) {\n    echo "Iteration $count\\n";\n    $count++;\n  }\n?>'),

      h(2, 'do-while', 'do-while'),
      p('<p><code>while</code>-এর মতোই, শুধু শর্তটি লুপ বডি রান হওয়ার <i>পরে</i> চেক করা হয় — শর্ত শুরুতে false হলেও কমপক্ষে একবার রান নিশ্চিত করে:</p>'),
      code('php', '<?php\n  $count = 10;\n  do {\n    echo "This runs once, even though $count is not < 3.\\n";\n  } while ($count < 3);\n?>'),

      h(2, 'foreach', 'foreach'),
      p('<p>বিশেষভাবে অ্যারের জন্য তৈরি — Indexed Arrays আর Associative Arrays পাঠে আপনি এটি ইতিমধ্যে ব্যবহার করেছেন:</p>'),
      code('php', '<?php\n  $fruits = ["apple", "banana", "mango"];\n  foreach ($fruits as $index => $fruit) {\n    echo "$index: $fruit\\n";\n  }\n?>'),

      h(2, 'break আর continue', 'break-and-continue'),
      code('php', '<?php\n  for ($i = 1; $i <= 10; $i++) {\n    if ($i === 6) break;      // stops the loop entirely\n    if ($i % 2 === 0) continue; // skips this iteration, keeps looping\n    echo $i . " ";\n  }\n  // Output: 1 3 5\n?>'),

      callout('tip', '<p>একটি ম্যানুয়াল কাউন্টার আর <code>$fruits[$i]</code> ব্যবহার করে একটি অ্যারের উপর লুপ করতে <code>for</code> বা <code>while</code> নেওয়া কাজ করে, কিন্তু সেই নির্দিষ্ট কাজের জন্য <code>foreach</code> প্রায় সবসময় বেশি পরিষ্কার আর কম ভুল-প্রবণ। <code>for</code>/<code>while</code> এমন ক্ষেত্রের জন্য রাখুন যা আসলে "এই তালিকার মধ্য দিয়ে যাওয়া" নয়।</p>', 'অ্যারের জন্য প্রায় সবসময় foreach'),
    ],
  },
})

lessons.push({
  slug: 'functions',
  sortOrder: 16,
  en: {
    title: 'Functions',
    metaTitle: 'PHP Functions | Learn Computer Academy',
    metaDescription: 'Defining your own PHP functions — parameters, default values, return types, and arrow functions.',
    blocks: [
      p('<p>A function packages up a piece of logic so it can be reused by name instead of retyped — the same idea from <a href="/programming/functions/">Intro to Programming</a>, with PHP\'s syntax.</p>'),

      h(2, 'Defining and Calling a Function'),
      code('php', '<?php\n  function greet($name) {\n    return "Hello, $name!";\n  }\n\n  echo greet("Priya"); // "Hello, Priya!"\n?>'),

      h(2, 'Default Parameter Values'),
      code('php', '<?php\n  function greet($name = "Guest") {\n    return "Hello, $name!";\n  }\n\n  echo greet();        // "Hello, Guest!"\n  echo greet("Amit");  // "Hello, Amit!"\n?>'),

      h(2, 'Type Declarations'),
      p('<p>PHP lets you optionally declare parameter and return types — not required, but a good habit for catching mistakes early:</p>'),
      code('php', '<?php\n  function add(int $a, int $b): int {\n    return $a + $b;\n  }\n\n  echo add(2, 3); // 5\n  // add("two", 3); // TypeError — "two" cannot be coerced to an int\n?>'),

      h(2, 'Multiple Return Values via Arrays'),
      p('<p>PHP functions only return one value directly, but that value can be an array — a common way to send back several related pieces of data at once:</p>'),
      code('php', '<?php\n  function minMax(array $numbers): array {\n    return ["min" => min($numbers), "max" => max($numbers)];\n  }\n\n  $result = minMax([4, 9, 1, 7]);\n  echo $result["min"] . " / " . $result["max"]; // "1 / 9"\n?>'),

      h(2, 'Arrow Functions'),
      p('<p>A compact syntax for short, single-expression functions — you already saw these with <code>array_map()</code> and <code>array_filter()</code> in the Array Functions lesson:</p>'),
      code('php', '<?php\n  $double = fn($n) => $n * 2;\n  echo $double(5); // 10\n?>'),

      callout('note', '<p>An arrow function (<code>fn</code>) automatically has access to variables from the surrounding scope, without needing to explicitly import them — a regular anonymous function needs a <code>use (...)</code> clause to do the same thing. This is the main practical difference between the two.</p>', 'fn vs. an anonymous function'),
    ],
  },
  bn: {
    title: 'ফাংশন',
    metaTitle: 'PHP ফাংশন | Learn Computer Academy',
    metaDescription: 'নিজের PHP ফাংশন সংজ্ঞায়িত করা — প্যারামিটার, ডিফল্ট মান, রিটার্ন টাইপ, আর অ্যারো ফাংশন।',
    blocks: [
      p('<p>একটি ফাংশন লজিকের একটি অংশ প্যাকেজ করে, যাতে সেটা আবার টাইপ না করে নাম দিয়ে পুনঃব্যবহার করা যায় — <a href="/bn/programming/functions/">প্রোগ্রামিং পরিচিতি</a>-তে শেখা একই ধারণা, PHP-এর সিনট্যাক্সে।</p>'),

      h(2, 'একটি ফাংশন সংজ্ঞায়িত করা আর কল করা', 'defining-and-calling-a-function'),
      code('php', '<?php\n  function greet($name) {\n    return "Hello, $name!";\n  }\n\n  echo greet("Priya"); // "Hello, Priya!"\n?>'),

      h(2, 'ডিফল্ট প্যারামিটার মান', 'default-parameter-values'),
      code('php', '<?php\n  function greet($name = "Guest") {\n    return "Hello, $name!";\n  }\n\n  echo greet();        // "Hello, Guest!"\n  echo greet("Amit");  // "Hello, Amit!"\n?>'),

      h(2, 'টাইপ ডিক্লারেশন', 'type-declarations'),
      p('<p>PHP আপনাকে ঐচ্ছিকভাবে প্যারামিটার আর রিটার্ন টাইপ ঘোষণা করতে দেয় — বাধ্যতামূলক নয়, কিন্তু ভুল আগেই ধরার জন্য একটি ভালো অভ্যাস:</p>'),
      code('php', '<?php\n  function add(int $a, int $b): int {\n    return $a + $b;\n  }\n\n  echo add(2, 3); // 5\n  // add("two", 3); // TypeError — "two" cannot be coerced to an int\n?>'),

      h(2, 'অ্যারের মাধ্যমে একাধিক রিটার্ন মান', 'multiple-return-values-via-arrays'),
      p('<p>PHP ফাংশন সরাসরি শুধু একটি মান রিটার্ন করে, কিন্তু সেই মানটি একটি অ্যারে হতে পারে — একসাথে একাধিক সম্পর্কিত ডেটা ফেরত পাঠানোর একটি সাধারণ উপায়:</p>'),
      code('php', '<?php\n  function minMax(array $numbers): array {\n    return ["min" => min($numbers), "max" => max($numbers)];\n  }\n\n  $result = minMax([4, 9, 1, 7]);\n  echo $result["min"] . " / " . $result["max"]; // "1 / 9"\n?>'),

      h(2, 'অ্যারো ফাংশন', 'arrow-functions'),
      p('<p>ছোট, একক-এক্সপ্রেশন ফাংশনের জন্য একটি সংক্ষিপ্ত সিনট্যাক্স — Array Functions পাঠে <code>array_map()</code> আর <code>array_filter()</code>-এ আপনি এগুলো আগেই দেখেছেন:</p>'),
      code('php', '<?php\n  $double = fn($n) => $n * 2;\n  echo $double(5); // 10\n?>'),

      callout('note', '<p>একটি অ্যারো ফাংশন (<code>fn</code>) স্বয়ংক্রিয়ভাবে চারপাশের scope-এর ভ্যারিয়েবলে অ্যাক্সেস পায়, স্পষ্টভাবে import করার দরকার ছাড়াই — একটি সাধারণ anonymous ফাংশনে একই কাজের জন্য একটি <code>use (...)</code> ক্লজ লাগে। এটাই এই দুটোর মধ্যে মূল ব্যবহারিক পার্থক্য।</p>', 'fn বনাম একটি anonymous ফাংশন'),
    ],
  },
})

lessons.push({
  slug: 'scope',
  sortOrder: 17,
  en: {
    title: 'Variable Scope',
    metaTitle: 'PHP Variable Scope | Learn Computer Academy',
    metaDescription: 'Where a PHP variable is visible from — local vs. global scope, and the global keyword.',
    blocks: [
      p('<p><b>Scope</b> is where in your code a variable can actually be seen and used — the same idea from <a href="/programming/scope/">Intro to Programming</a>, and PHP is stricter about it than some languages you may have used.</p>'),

      h(2, 'Local Scope'),
      p('<p>A variable created inside a function only exists inside that function. It disappears the moment the function finishes, and is completely invisible to code outside it:</p>'),
      code('php', '<?php\n  function setName() {\n    $name = "Priya"; // local to setName()\n    echo $name;       // works fine here\n  }\n\n  setName();\n  // echo $name; // Error — $name doesn\'t exist out here\n?>'),

      h(2, 'Global Scope'),
      p('<p>A variable declared outside every function is in the <b>global</b> scope — but, unlike many languages, a PHP function <b>cannot</b> see a global variable automatically just because it exists:</p>'),
      code('php', '<?php\n  $siteName = "Learn Computer Academy";\n\n  function showName() {\n    // echo $siteName; // does NOT work — functions don\'t see globals by default\n  }\n?>'),

      h(2, 'The global Keyword'),
      p('<p>To use a global variable inside a function, it has to be explicitly pulled in with <code>global</code>:</p>'),
      code('php', '<?php\n  $siteName = "Learn Computer Academy";\n\n  function showName() {\n    global $siteName;\n    echo $siteName; // now this works\n  }\n\n  showName();\n?>'),
      callout('tip', '<p>Relying on <code>global</code> throughout a codebase makes it hard to trace where a value actually comes from. The more common, cleaner pattern — used in nearly every example from here on — is to pass the value in as a parameter instead: <code>function showName($siteName) { echo $siteName; }</code>.</p>', 'Prefer parameters over global'),

      h(2, 'static Variables'),
      p('<p>A <code>static</code> variable inside a function keeps its value between calls, instead of resetting every time — useful for counters that live inside a single function:</p>'),
      code('php', '<?php\n  function countCalls() {\n    static $count = 0;\n    $count++;\n    echo $count . "\\n";\n  }\n\n  countCalls(); // 1\n  countCalls(); // 2\n  countCalls(); // 3\n?>'),
    ],
  },
  bn: {
    title: 'ভ্যারিয়েবল স্কোপ',
    metaTitle: 'PHP ভ্যারিয়েবল স্কোপ | Learn Computer Academy',
    metaDescription: 'একটি PHP ভ্যারিয়েবল কোথা থেকে দেখা যায় — লোকাল বনাম গ্লোবাল স্কোপ, আর global কীওয়ার্ড।',
    blocks: [
      p('<p><b>স্কোপ</b> মানে আপনার কোডের কোথা থেকে একটি ভ্যারিয়েবল আসলেই দেখা আর ব্যবহার করা যায় — <a href="/bn/programming/scope/">প্রোগ্রামিং পরিচিতি</a>-তে শেখা একই ধারণা, আর PHP এই বিষয়ে আপনার ব্যবহৃত কিছু ভাষার চেয়ে বেশি কঠোর।</p>'),

      h(2, 'লোকাল স্কোপ', 'local-scope'),
      p('<p>একটি ফাংশনের ভেতরে তৈরি হওয়া ভ্যারিয়েবল শুধু সেই ফাংশনের ভেতরেই থাকে। ফাংশনটি শেষ হওয়া মাত্র সেটা হারিয়ে যায়, আর এর বাইরের কোডের কাছে সম্পূর্ণ অদৃশ্য:</p>'),
      code('php', '<?php\n  function setName() {\n    $name = "Priya"; // local to setName()\n    echo $name;       // works fine here\n  }\n\n  setName();\n  // echo $name; // Error — $name doesn\'t exist out here\n?>'),

      h(2, 'গ্লোবাল স্কোপ', 'global-scope'),
      p('<p>প্রতিটি ফাংশনের বাইরে ঘোষিত একটি ভ্যারিয়েবল <b>গ্লোবাল</b> স্কোপে থাকে — কিন্তু, অনেক ভাষার মতো নয়, একটি PHP ফাংশন শুধু একটি গ্লোবাল ভ্যারিয়েবল আছে বলেই স্বয়ংক্রিয়ভাবে সেটা দেখতে <b>পারে না</b>:</p>'),
      code('php', '<?php\n  $siteName = "Learn Computer Academy";\n\n  function showName() {\n    // echo $siteName; // does NOT work — functions don\'t see globals by default\n  }\n?>'),

      h(2, 'global কীওয়ার্ড', 'the-global-keyword'),
      p('<p>একটি ফাংশনের ভেতরে একটি গ্লোবাল ভ্যারিয়েবল ব্যবহার করতে, এটিকে স্পষ্টভাবে <code>global</code> দিয়ে টেনে আনতে হয়:</p>'),
      code('php', '<?php\n  $siteName = "Learn Computer Academy";\n\n  function showName() {\n    global $siteName;\n    echo $siteName; // now this works\n  }\n\n  showName();\n?>'),
      callout('tip', '<p>পুরো একটি কোডবেসে <code>global</code>-এর উপর নির্ভর করলে একটি মান আসলে কোথা থেকে আসছে তা খুঁজে বের করা কঠিন হয়ে যায়। এখান থেকে প্রায় প্রতিটি উদাহরণে ব্যবহৃত বেশি প্রচলিত, পরিষ্কার প্যাটার্ন হলো মানটিকে বদলে একটি প্যারামিটার হিসেবে পাস করা: <code>function showName($siteName) { echo $siteName; }</code>।</p>', 'global-এর বদলে প্যারামিটার প্রাধান্য দিন'),

      h(2, 'static ভ্যারিয়েবল', 'static-variables'),
      p('<p>একটি ফাংশনের ভেতরের একটি <code>static</code> ভ্যারিয়েবল প্রতিবার রিসেট হওয়ার বদলে কলগুলোর মধ্যে তার মান ধরে রাখে — একটি একক ফাংশনের ভেতরে থাকা কাউন্টারের জন্য দরকারি:</p>'),
      code('php', '<?php\n  function countCalls() {\n    static $count = 0;\n    $count++;\n    echo $count . "\\n";\n  }\n\n  countCalls(); // 1\n  countCalls(); // 2\n  countCalls(); // 3\n?>'),
    ],
  },
})

lessons.push({
  slug: 'superglobals',
  sortOrder: 18,
  en: {
    title: 'Superglobals Overview',
    metaTitle: 'PHP Superglobals | Learn Computer Academy',
    metaDescription: 'PHP\'s superglobal arrays — $_GET, $_POST, $_SESSION, $_SERVER, and $_COOKIE — the built-in variables that connect PHP to the web request itself.',
    blocks: [
      p('<p>Everything so far has been about variables <i>you</i> create. <b>Superglobals</b> are different — they\'re built-in associative arrays PHP fills in automatically, carrying information about the actual web request currently being handled. This is where PHP stops being "just a scripting language" and starts being specifically a <i>web</i> scripting language.</p>'),

      h(2, 'The Superglobal Family'),
      table(
        ['Superglobal', 'Contains'],
        [
          ['$_GET', 'Data sent in the URL\'s query string (?name=value)'],
          ['$_POST', 'Data sent in a form submission\'s body'],
          ['$_SERVER', 'Information about the server and the current request (URL, method, headers)'],
          ['$_SESSION', 'Data that persists across multiple page visits for one visitor (needs session_start())'],
          ['$_COOKIE', 'Small pieces of data stored in the visitor\'s browser between visits'],
          ['$_FILES', 'Information about any file the visitor uploaded'],
        ]
      ),
      p('<p>The next several lessons cover the most-used ones — <code>$_GET</code>/<code>$_POST</code>, then <code>$_SESSION</code>/<code>$_COOKIE</code> — in real depth. This lesson is the map before the detail.</p>'),

      h(2, 'Reading a Query String Value'),
      code('php', '<?php\n  // If the URL is page.php?name=Priya\n  echo $_GET["name"]; // "Priya"\n?>'),

      h(2, 'A Few Useful $_SERVER Values'),
      code('php', '<?php\n  echo $_SERVER["REQUEST_METHOD"]; // "GET" or "POST"\n  echo $_SERVER["PHP_SELF"];        // the current script\'s path\n?>'),

      img(
        'docs/img/php/superglobals-1',
        'Isometric diagram showing a browser request arriving at a PHP server, with arrows splitting into the $_GET, $_POST, $_SESSION, and $_SERVER superglobal arrays',
        1024, 768,
        'Superglobals are how PHP hands you the details of the current request.'
      ),

      callout('warning', '<p>Every superglobal holds data that came from <b>outside your script</b> — the visitor, their browser, or the request itself. Never trust it blindly: a value in <code>$_GET</code> or <code>$_POST</code> can be absolutely anything, including something malicious, regardless of what a form was designed to send. Validation and security get their own lesson later in this section.</p>', 'Superglobal data is never trusted by default'),
    ],
  },
  bn: {
    title: 'সুপারগ্লোবাল ওভারভিউ',
    metaTitle: 'PHP সুপারগ্লোবাল | Learn Computer Academy',
    metaDescription: 'PHP-এর সুপারগ্লোবাল অ্যারে — $_GET, $_POST, $_SESSION, $_SERVER, আর $_COOKIE — বিল্ট-ইন ভ্যারিয়েবল যা PHP-কে আসল ওয়েব রিকোয়েস্টের সাথে যুক্ত করে।',
    blocks: [
      p('<p>এখন পর্যন্ত সবকিছু ছিল <i>আপনি</i> নিজে তৈরি করা ভ্যারিয়েবল নিয়ে। <b>সুপারগ্লোবাল</b> আলাদা — এগুলো বিল্ট-ইন অ্যাসোসিয়েটিভ অ্যারে যা PHP স্বয়ংক্রিয়ভাবে পূরণ করে, যাতে থাকে বর্তমানে হ্যান্ডেল হওয়া আসল ওয়েব রিকোয়েস্ট সম্পর্কে তথ্য। এখানেই PHP "শুধু একটি স্ক্রিপ্টিং ভাষা" হওয়া বন্ধ করে বিশেষভাবে একটি <i>ওয়েব</i> স্ক্রিপ্টিং ভাষা হয়ে ওঠে।</p>'),

      h(2, 'সুপারগ্লোবাল পরিবার', 'the-superglobal-family'),
      table(
        ['সুপারগ্লোবাল', 'ধারণ করে'],
        [
          ['$_GET', 'URL-এর query string-এ পাঠানো ডেটা (?name=value)'],
          ['$_POST', 'একটি ফর্ম সাবমিশনের body-তে পাঠানো ডেটা'],
          ['$_SERVER', 'সার্ভার আর বর্তমান রিকোয়েস্ট সম্পর্কে তথ্য (URL, মেথড, হেডার)'],
          ['$_SESSION', 'একজন visitor-এর একাধিক পাতা visit জুড়ে টিকে থাকা ডেটা (session_start() প্রয়োজন)'],
          ['$_COOKIE', 'visitor-এর ব্রাউজারে visit-এর মধ্যে সংরক্ষিত ছোট ছোট ডেটা'],
          ['$_FILES', 'visitor আপলোড করা যেকোনো ফাইল সম্পর্কে তথ্য'],
        ]
      ),
      p('<p>পরের কয়েকটি পাঠে সবচেয়ে বেশি ব্যবহৃতগুলো — <code>$_GET</code>/<code>$_POST</code>, এরপর <code>$_SESSION</code>/<code>$_COOKIE</code> — সত্যিকারের বিস্তারিতভাবে দেখানো হবে। এই পাঠটি বিস্তারিত যাওয়ার আগে একটি মানচিত্র মাত্র।</p>'),

      h(2, 'একটি Query String মান পড়া', 'reading-a-query-string-value'),
      code('php', '<?php\n  // If the URL is page.php?name=Priya\n  echo $_GET["name"]; // "Priya"\n?>'),

      h(2, 'কয়েকটি দরকারি $_SERVER মান', 'a-few-useful-_server-values'),
      code('php', '<?php\n  echo $_SERVER["REQUEST_METHOD"]; // "GET" or "POST"\n  echo $_SERVER["PHP_SELF"];        // the current script\'s path\n?>'),

      img(
        'docs/img/php/superglobals-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে দেখানো হয়েছে একটি ব্রাউজার রিকোয়েস্ট PHP সার্ভারে আসছে, আর তীরচিহ্ন $_GET, $_POST, $_SESSION, আর $_SERVER সুপারগ্লোবাল অ্যারেতে ভাগ হয়ে যাচ্ছে',
        1024, 768,
        'সুপারগ্লোবাল হলো PHP যেভাবে বর্তমান রিকোয়েস্টের বিস্তারিত আপনার হাতে তুলে দেয়।'
      ),

      callout('warning', '<p>প্রতিটি সুপারগ্লোবালে <b>আপনার স্ক্রিপ্টের বাইরে থেকে</b> আসা ডেটা থাকে — visitor, তাদের ব্রাউজার, বা রিকোয়েস্ট নিজেই। এটাকে অন্ধভাবে বিশ্বাস করবেন না: একটি ফর্ম যা পাঠানোর জন্য ডিজাইন করা হয়েছিল তা যাই হোক না কেন, <code>$_GET</code> বা <code>$_POST</code>-এর একটি মান একেবারে যেকোনো কিছু হতে পারে, এমনকি ক্ষতিকর কিছুও। ভ্যালিডেশন আর সিকিউরিটি এই অংশের পরে নিজেদের আলাদা পাঠ পাবে।</p>', 'সুপারগ্লোবাল ডেটা ডিফল্টভাবে কখনোই বিশ্বাস করা হয় না'),
    ],
  },
})

lessons.push({
  slug: 'forms',
  sortOrder: 19,
  en: {
    title: 'Handling Forms',
    metaTitle: 'Handling Forms in PHP | Learn Computer Academy',
    metaDescription: 'Processing an HTML form submission in PHP with $_GET and $_POST — the most common thing server-side PHP actually does.',
    blocks: [
      p('<p>Processing a form submission is one of the single most common things PHP is used for — a visitor fills in fields, submits, and PHP reads what they typed.</p>'),

      h(2, 'GET vs. POST Forms'),
      p('<p>An HTML <code>&lt;form&gt;</code>\'s <code>method</code> attribute decides which superglobal PHP receives the data in. <b>GET</b> puts the data visibly in the URL (good for search, filters — anything shareable or bookmarkable); <b>POST</b> sends it hidden in the request body (required for anything sensitive, or that changes data, like a login or a purchase).</p>'),
      code('html', '<form action="process.php" method="post">\n  <input type="text" name="username">\n  <input type="email" name="email">\n  <button type="submit">Submit</button>\n</form>'),

      h(2, 'Reading the Submitted Data'),
      code('php', '<?php\n  // process.php\n  $username = $_POST["username"] ?? "";\n  $email = $_POST["email"] ?? "";\n\n  if ($username && $email) {\n    echo "Thanks, $username! We\'ll email you at $email.";\n  } else {\n    echo "Please fill in both fields.";\n  }\n?>'),
      p('<p>The <code>?? ""</code> pattern from the Control Flow lesson matters here specifically: if someone reaches <code>process.php</code> directly, without submitting the form, <code>$_POST["username"]</code> won\'t exist at all — reading it without a fallback would produce a warning instead of a clean, handled case.</p>'),

      h(2, 'A Form That Submits to Itself'),
      p('<p>A common, simpler pattern for small scripts: one file that shows the form <i>and</i> processes it, checking the request method to decide which:</p>'),
      code('php', '<?php\n  if ($_SERVER["REQUEST_METHOD"] === "POST") {\n    $name = $_POST["name"] ?? "";\n    echo "Hello, $name!";\n  } else {\n?>\n    <form method="post">\n      <input type="text" name="name">\n      <button type="submit">Submit</button>\n    </form>\n<?php\n  }\n?>'),

      callout('note', '<p>Nothing here checks whether <code>$name</code> actually contains something safe to display or store — that\'s deliberate, to keep this lesson focused on the mechanics of receiving form data. The PHP and MySQL lessons later in this section cover the specific, most important case: never building a database query by directly pasting form data into it.</p>', 'Validation is coming, in context'),
    ],
  },
  bn: {
    title: 'ফর্ম হ্যান্ডলিং',
    metaTitle: 'PHP-তে ফর্ম হ্যান্ডলিং | Learn Computer Academy',
    metaDescription: 'PHP-তে $_GET আর $_POST দিয়ে একটি HTML ফর্ম সাবমিশন প্রসেস করা — সার্ভার-সাইড PHP আসলে সবচেয়ে বেশি যে কাজটি করে।',
    blocks: [
      p('<p>একটি ফর্ম সাবমিশন প্রসেস করা PHP সবচেয়ে বেশি যে কাজে ব্যবহৃত হয় তার একটি — একজন visitor ফিল্ড পূরণ করেন, সাবমিট করেন, আর PHP পড়ে তারা কী টাইপ করেছেন।</p>'),

      h(2, 'GET বনাম POST ফর্ম', 'get-vs-post-forms'),
      p('<p>একটি HTML <code>&lt;form&gt;</code>-এর <code>method</code> অ্যাট্রিবিউট ঠিক করে PHP কোন সুপারগ্লোবালে ডেটা পাবে। <b>GET</b> ডেটাকে URL-এ দৃশ্যমানভাবে রাখে (সার্চ, ফিল্টারের জন্য ভালো — যা শেয়ার বা বুকমার্ক করা যায়); <b>POST</b> এটি request body-তে লুকিয়ে পাঠায় (স্পর্শকাতর কিছুর জন্য, বা ডেটা বদলায় এমন কিছুর জন্য, যেমন একটি লগইন বা একটি কেনাকাটা, এটিই প্রয়োজন)।</p>'),
      code('html', '<form action="process.php" method="post">\n  <input type="text" name="username">\n  <input type="email" name="email">\n  <button type="submit">Submit</button>\n</form>'),

      h(2, 'সাবমিট করা ডেটা পড়া', 'reading-the-submitted-data'),
      code('php', '<?php\n  // process.php\n  $username = $_POST["username"] ?? "";\n  $email = $_POST["email"] ?? "";\n\n  if ($username && $email) {\n    echo "Thanks, $username! We\'ll email you at $email.";\n  } else {\n    echo "Please fill in both fields.";\n  }\n?>'),
      p('<p>Control Flow পাঠের <code>?? ""</code> প্যাটার্ন এখানে নির্দিষ্টভাবে গুরুত্বপূর্ণ: কেউ ফর্ম সাবমিট না করে সরাসরি <code>process.php</code>-এ পৌঁছালে, <code>$_POST["username"]</code> একদমই থাকবে না — ফলব্যাক ছাড়া এটি পড়লে একটি পরিষ্কার, হ্যান্ডেল করা কেসের বদলে একটি warning হবে।</p>'),

      h(2, 'একটি ফর্ম যা নিজের কাছেই সাবমিট হয়', 'a-form-that-submits-to-itself'),
      p('<p>ছোট স্ক্রিপ্টের জন্য একটি সাধারণ, সহজ প্যাটার্ন: একটি ফাইল যা ফর্ম দেখায় <i>আর</i> সেটা প্রসেসও করে, কোনটা করবে তা ঠিক করতে request মেথড চেক করে:</p>'),
      code('php', '<?php\n  if ($_SERVER["REQUEST_METHOD"] === "POST") {\n    $name = $_POST["name"] ?? "";\n    echo "Hello, $name!";\n  } else {\n?>\n    <form method="post">\n      <input type="text" name="name">\n      <button type="submit">Submit</button>\n    </form>\n<?php\n  }\n?>'),

      callout('note', '<p>এখানে <code>$name</code>-এ আসলে দেখানোর বা সংরক্ষণ করার জন্য নিরাপদ কিছু আছে কিনা তা কিছুই চেক করে না — এটি ইচ্ছাকৃত, এই পাঠটি ফর্ম ডেটা গ্রহণের প্রক্রিয়ার উপর কেন্দ্রীভূত রাখার জন্য। এই অংশের পরের PHP আর MySQL পাঠে সবচেয়ে গুরুত্বপূর্ণ নির্দিষ্ট কেসটি দেখানো হবে: ফর্ম ডেটা সরাসরি একটি ডেটাবেস কোয়েরিতে বসিয়ে সেটা কখনো তৈরি না করা।</p>', 'ভ্যালিডেশন আসছে, প্রসঙ্গ অনুযায়ী'),
    ],
  },
})

lessons.push({
  slug: 'sessions-and-cookies',
  sortOrder: 20,
  en: {
    title: 'Sessions and Cookies',
    metaTitle: 'PHP Sessions and Cookies | Learn Computer Academy',
    metaDescription: 'How PHP remembers a visitor across multiple page loads using $_SESSION and $_COOKIE, and when to use each.',
    blocks: [
      p('<p>By default, each web request is completely independent — a server has no memory of who visited a moment ago. <b>Sessions</b> and <b>cookies</b> are the two tools PHP gives you to bridge that gap, and they solve it differently.</p>'),

      h(2, 'The Problem They Solve'),
      p('<p>Without either one, a website couldn\'t keep you logged in between pages, remember what\'s in your shopping cart, or recall a language preference. Every request would start from a completely blank slate.</p>'),

      h(2, 'Cookies: Stored in the Browser'),
      p('<p>A <b>cookie</b> is a small piece of data PHP asks the visitor\'s browser to store, which the browser then sends back automatically on every future request to that site:</p>'),
      code('php', '<?php\n  // Set a cookie that lasts 30 days\n  setcookie("username", "Priya", time() + (30 * 24 * 60 * 60));\n\n  // On a later request:\n  echo $_COOKIE["username"] ?? "No cookie set";\n?>'),
      callout('warning', '<p><code>setcookie()</code> must be called before <b>any</b> HTML or other output — even a single blank line before <code>&lt;?php</code> in the file is enough to cause a "headers already sent" error, since cookies are sent as HTTP headers.</p>', 'Cookies must be set before any output'),

      h(2, 'Sessions: Stored on the Server'),
      p('<p>A <b>session</b> keeps data on the <i>server</i> instead, and only sends the visitor a small ID pointing at it — meaning the actual data never passes through the visitor\'s browser at all, which matters for anything sensitive.</p>'),
      code('php', '<?php\n  session_start(); // must be the very first thing in the script\n\n  $_SESSION["username"] = "Priya";\n\n  // On a later request, after session_start() again:\n  echo $_SESSION["username"] ?? "Not logged in";\n?>'),
      p('<p><code>session_start()</code> has the same "before any output" requirement as <code>setcookie()</code>, and needs to run on <i>every</i> page that wants access to the session, not just the one that created it.</p>'),

      h(2, 'Which One to Use'),
      table(
        ['', 'Where data lives', 'Good for'],
        [
          ['Cookie', 'The visitor\'s browser', 'Non-sensitive preferences (theme, language) that should survive even after closing the browser'],
          ['Session', 'The server', 'Login state, cart contents — anything sensitive or that shouldn\'t be tamperable from the browser'],
        ]
      ),

      img(
        'docs/img/php/sessions-cookies-1',
        'Isometric diagram comparing a cookie stored in a browser icon versus session data stored on a server icon, connected by a small session ID token',
        1024, 768,
        'A cookie lives in the browser; a session lives on the server, with only a small ID shared with the browser.'
      ),

      h(2, 'Destroying a Session'),
      code('php', '<?php\n  session_start();\n  session_destroy(); // used for a "log out" action\n?>'),
    ],
  },
  bn: {
    title: 'সেশন আর কুকি',
    metaTitle: 'PHP সেশন আর কুকি | Learn Computer Academy',
    metaDescription: '$_SESSION আর $_COOKIE ব্যবহার করে PHP কীভাবে একাধিক পাতা লোড জুড়ে একজন visitor-কে মনে রাখে, আর কোনটা কখন ব্যবহার করবেন।',
    blocks: [
      p('<p>ডিফল্টভাবে, প্রতিটি ওয়েব রিকোয়েস্ট সম্পূর্ণ স্বাধীন — একটি সার্ভারের কিছুক্ষণ আগে কে visit করেছিল তার কোনো স্মৃতি নেই। <b>সেশন</b> আর <b>কুকি</b> হলো সেই দুটো টুল যা PHP এই ফাঁকটা পূরণ করতে দেয়, আর এরা এটা ভিন্নভাবে সমাধান করে।</p>'),

      h(2, 'এরা যে সমস্যা সমাধান করে', 'the-problem-they-solve'),
      p('<p>এই দুটো ছাড়া, একটি ওয়েবসাইট পাতার মধ্যে আপনাকে লগইন রাখতে পারত না, আপনার শপিং কার্টে কী আছে মনে রাখতে পারত না, বা একটি ভাষার পছন্দ মনে রাখতে পারত না। প্রতিটি রিকোয়েস্ট সম্পূর্ণ খালি অবস্থা থেকে শুরু হতো।</p>'),

      h(2, 'কুকি: ব্রাউজারে সংরক্ষিত', 'cookies-stored-in-the-browser'),
      p('<p>একটি <b>কুকি</b> হলো ছোট একটি ডেটা যা PHP visitor-এর ব্রাউজারকে সংরক্ষণ করতে বলে, যা ব্রাউজার তারপর সেই সাইটের প্রতিটি ভবিষ্যৎ রিকোয়েস্টে স্বয়ংক্রিয়ভাবে ফেরত পাঠায়:</p>'),
      code('php', '<?php\n  // Set a cookie that lasts 30 days\n  setcookie("username", "Priya", time() + (30 * 24 * 60 * 60));\n\n  // On a later request:\n  echo $_COOKIE["username"] ?? "No cookie set";\n?>'),
      callout('warning', '<p><code>setcookie()</code> অবশ্যই যেকোনো HTML বা অন্য আউটপুটের <b>আগে</b> কল করতে হবে — এমনকি ফাইলে <code>&lt;?php</code>-এর আগে একটি একক খালি লাইনও একটি "headers already sent" এরর তৈরি করতে যথেষ্ট, কারণ কুকি HTTP হেডার হিসেবে পাঠানো হয়।</p>', 'কুকি অবশ্যই যেকোনো আউটপুটের আগে সেট করতে হবে'),

      h(2, 'সেশন: সার্ভারে সংরক্ষিত', 'sessions-stored-on-the-server'),
      p('<p>একটি <b>সেশন</b> এর বদলে ডেটা <i>সার্ভারে</i> রাখে, আর visitor-কে শুধু একটি ছোট ID পাঠায় যা সেটার দিকে নির্দেশ করে — মানে আসল ডেটা visitor-এর ব্রাউজারের মধ্য দিয়ে একেবারেই যায় না, যা স্পর্শকাতর যেকোনো কিছুর জন্য গুরুত্বপূর্ণ।</p>'),
      code('php', '<?php\n  session_start(); // must be the very first thing in the script\n\n  $_SESSION["username"] = "Priya";\n\n  // On a later request, after session_start() again:\n  echo $_SESSION["username"] ?? "Not logged in";\n?>'),
      p('<p><code>session_start()</code>-এরও <code>setcookie()</code>-এর মতো "যেকোনো আউটপুটের আগে" শর্ত আছে, আর যে পাতাটি সেশন তৈরি করেছে শুধু সেটাতেই নয়, সেশন অ্যাক্সেস করতে চায় এমন <i>প্রতিটি</i> পাতাতেই এটি চালাতে হয়।</p>'),

      h(2, 'কোনটা কখন ব্যবহার করবেন', 'which-one-to-use'),
      table(
        ['', 'ডেটা কোথায় থাকে', 'কীসের জন্য ভালো'],
        [
          ['কুকি', 'visitor-এর ব্রাউজার', 'অ-স্পর্শকাতর পছন্দ (থিম, ভাষা) যা ব্রাউজার বন্ধ করার পরেও টিকে থাকা উচিত'],
          ['সেশন', 'সার্ভার', 'লগইন স্টেট, কার্টের কন্টেন্ট — যা স্পর্শকাতর বা ব্রাউজার থেকে পরিবর্তনযোগ্য হওয়া উচিত নয়'],
        ]
      ),

      img(
        'docs/img/php/sessions-cookies-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে একটি ব্রাউজার আইকনে সংরক্ষিত একটি কুকি বনাম একটি সার্ভার আইকনে সংরক্ষিত সেশন ডেটার তুলনা দেখানো হয়েছে, একটি ছোট সেশন ID টোকেন দিয়ে সংযুক্ত',
        1024, 768,
        'একটি কুকি থাকে ব্রাউজারে; একটি সেশন থাকে সার্ভারে, শুধু একটি ছোট ID ব্রাউজারের সাথে শেয়ার করা হয়।'
      ),

      h(2, 'একটি সেশন ধ্বংস করা', 'destroying-a-session'),
      code('php', '<?php\n  session_start();\n  session_destroy(); // used for a "log out" action\n?>'),
    ],
  },
})

lessons.push({
  slug: 'includes',
  sortOrder: 21,
  en: {
    title: 'Includes and Requires',
    metaTitle: 'PHP Includes and Requires | Learn Computer Academy',
    metaDescription: 'Splitting PHP code across multiple files with include, require, and their _once variants, and why that matters for real projects.',
    blocks: [
      p('<p>Real websites are never one giant PHP file — headers, footers, and reusable logic get split into their own files and pulled in wherever they\'re needed. PHP has four keywords for this, and the differences between them matter.</p>'),

      h(2, 'include and require'),
      p('<p>Both pull the contents of another PHP file into the current one, as if it had been typed there directly:</p>'),
      code('php', '// header.php\n<?php\n  $siteName = "Learn Computer Academy";\n?>\n<header><h1><?php echo $siteName; ?></h1></header>'),
      code('php', '// index.php\n<?php\n  include "header.php";\n?>\n<p>Page content goes here.</p>'),
      p('<p>The difference is what happens if the file is missing: <code>include</code> raises a warning and the script keeps running; <code>require</code> raises a fatal error and stops the script entirely.</p>'),

      h(2, 'Which One to Use'),
      table(
        ['Keyword', 'If the file is missing', 'Use for'],
        [
          ['include', 'Warning, script continues', 'Optional pieces — the page still works without it'],
          ['require', 'Fatal error, script stops', 'Essential pieces — the page is broken without it (like a database connection file)'],
        ]
      ),

      h(2, 'The _once Variants'),
      p('<p><code>include_once</code> and <code>require_once</code> do the same job, but skip re-including a file that\'s already been included once during this request — essential for files that define a function or class, since defining the same function twice is a fatal error:</p>'),
      code('php', '<?php\n  require_once "db-connection.php";\n  require_once "db-connection.php"; // silently skipped, no error\n?>'),
      callout('tip', '<p>As a practical default: use <code>require_once</code> for anything defining functions or classes, and plain <code>include</code> for optional display fragments like a promotional banner. This single rule covers the vast majority of real cases.</p>', 'A practical default'),
    ],
  },
  bn: {
    title: 'Include আর Require',
    metaTitle: 'PHP Include আর Require | Learn Computer Academy',
    metaDescription: 'include, require, আর তাদের _once ভ্যারিয়েন্ট দিয়ে একাধিক ফাইল জুড়ে PHP কোড ভাগ করা, আর বাস্তব প্রজেক্টে এটি কেন গুরুত্বপূর্ণ।',
    blocks: [
      p('<p>বাস্তব ওয়েবসাইট কখনো একটি বিশাল PHP ফাইল হয় না — হেডার, ফুটার, আর পুনঃব্যবহারযোগ্য লজিক নিজেদের ফাইলে ভাগ করা হয় আর যেখানে প্রয়োজন সেখানে টেনে আনা হয়। PHP-তে এর জন্য চারটি কীওয়ার্ড আছে, আর এদের মধ্যে পার্থক্যগুলো গুরুত্বপূর্ণ।</p>'),

      h(2, 'include আর require', 'include-and-require'),
      p('<p>দুটোই আরেকটি PHP ফাইলের কন্টেন্ট বর্তমান ফাইলে টেনে আনে, যেন এটা সরাসরি সেখানেই টাইপ করা হয়েছিল:</p>'),
      code('php', '// header.php\n<?php\n  $siteName = "Learn Computer Academy";\n?>\n<header><h1><?php echo $siteName; ?></h1></header>'),
      code('php', '// index.php\n<?php\n  include "header.php";\n?>\n<p>Page content goes here.</p>'),
      p('<p>পার্থক্যটা হলো ফাইলটি না থাকলে কী ঘটে: <code>include</code> একটি warning তৈরি করে আর স্ক্রিপ্ট চলতে থাকে; <code>require</code> একটি fatal error তৈরি করে আর স্ক্রিপ্ট সম্পূর্ণভাবে থেমে যায়।</p>'),

      h(2, 'কোনটা কখন ব্যবহার করবেন', 'which-one-to-use'),
      table(
        ['কীওয়ার্ড', 'ফাইল না থাকলে', 'যেখানে ব্যবহার করবেন'],
        [
          ['include', 'Warning, স্ক্রিপ্ট চলতে থাকে', 'ঐচ্ছিক অংশ — এটা ছাড়াও পাতাটি কাজ করে'],
          ['require', 'Fatal error, স্ক্রিপ্ট থেমে যায়', 'অপরিহার্য অংশ — এটা ছাড়া পাতাটি ভাঙা (যেমন একটি ডেটাবেস কানেকশন ফাইল)'],
        ]
      ),

      h(2, '_once ভ্যারিয়েন্ট', 'the-_once-variants'),
      p('<p><code>include_once</code> আর <code>require_once</code> একই কাজ করে, কিন্তু এই রিকোয়েস্টে ইতিমধ্যে একবার include হওয়া একটি ফাইল আবার include করা এড়িয়ে যায় — একটি ফাংশন বা ক্লাস সংজ্ঞায়িত করা ফাইলের জন্য এটি অপরিহার্য, কারণ একই ফাংশন দুইবার সংজ্ঞায়িত করা একটি fatal error:</p>'),
      code('php', '<?php\n  require_once "db-connection.php";\n  require_once "db-connection.php"; // silently skipped, no error\n?>'),
      callout('tip', '<p>একটি ব্যবহারিক ডিফল্ট হিসেবে: ফাংশন বা ক্লাস সংজ্ঞায়িত করে এমন যেকোনো কিছুর জন্য <code>require_once</code> ব্যবহার করুন, আর একটি প্রোমোশনাল ব্যানারের মতো ঐচ্ছিক ডিসপ্লে অংশের জন্য সাধারণ <code>include</code>। এই একক নিয়মটি বেশিরভাগ বাস্তব ক্ষেত্র কভার করে।</p>', 'একটি ব্যবহারিক ডিফল্ট'),
    ],
  },
})

lessons.push({
  slug: 'error-handling',
  sortOrder: 22,
  en: {
    title: 'Error Handling',
    metaTitle: 'PHP Error Handling | Learn Computer Academy',
    metaDescription: 'Handling problems gracefully in PHP with try, catch, and throw, instead of letting a script crash outright.',
    blocks: [
      p('<p>Things go wrong at runtime — a file might not exist, a value from a form might not be what was expected. PHP\'s <code>try</code>/<code>catch</code> lets a script handle that gracefully instead of crashing outright.</p>'),

      h(2, 'try and catch'),
      code('php', '<?php\n  function divide($a, $b) {\n    if ($b === 0) {\n      throw new Exception("Cannot divide by zero.");\n    }\n    return $a / $b;\n  }\n\n  try {\n    echo divide(10, 0);\n  } catch (Exception $e) {\n    echo "Error: " . $e->getMessage();\n  }\n?>'),
      p('<p><code>throw</code> raises an exception; the nearest surrounding <code>catch</code> block that matches its type intercepts it, and the script keeps running from there instead of stopping.</p>'),

      h(2, 'finally'),
      p('<p>Code inside <code>finally</code> always runs, whether an exception was thrown or not — useful for cleanup that must happen either way, like closing a file:</p>'),
      code('php', '<?php\n  try {\n    echo divide(10, 2);\n  } catch (Exception $e) {\n    echo "Error: " . $e->getMessage();\n  } finally {\n    echo "\\nDone.";\n  }\n?>'),

      h(2, 'Catching Specific Exception Types'),
      p('<p>PHP has several built-in exception types, and you can catch a more specific one before a general <code>Exception</code>:</p>'),
      code('php', '<?php\n  try {\n    $result = 10 / 0; // DivisionByZeroError, not a regular Exception\n  } catch (DivisionByZeroError $e) {\n    echo "Specifically caught: " . $e->getMessage();\n  } catch (Exception $e) {\n    echo "General error: " . $e->getMessage();\n  }\n?>'),
      callout('note', '<p>Order matters when catching multiple types — PHP checks <code>catch</code> blocks top to bottom and uses the first one that matches, so a specific type should always come before a more general one that would otherwise catch it first.</p>', 'Specific catch blocks go first'),

      h(2, 'Why This Matters for Real Sites'),
      p('<p>An uncaught error on a live PHP site can expose a raw error message — sometimes including file paths or database details — directly to a visitor. Wrapping risky operations (file access, database queries, anything talking to something outside your own script) in <code>try</code>/<code>catch</code> is what turns that into a clean, controlled message instead.</p>'),
    ],
  },
  bn: {
    title: 'এরর হ্যান্ডলিং',
    metaTitle: 'PHP এরর হ্যান্ডলিং | Learn Computer Academy',
    metaDescription: 'একটি স্ক্রিপ্টকে সরাসরি ক্র্যাশ করতে দেওয়ার বদলে, try, catch, আর throw দিয়ে PHP-তে সমস্যা সুন্দরভাবে হ্যান্ডেল করা।',
    blocks: [
      p('<p>রানটাইমে জিনিস ভুল হয় — একটি ফাইল হয়তো নেই, একটি ফর্মের মান হয়তো যা প্রত্যাশিত ছিল তা নয়। PHP-এর <code>try</code>/<code>catch</code> একটি স্ক্রিপ্টকে সরাসরি ক্র্যাশ করতে দেওয়ার বদলে সুন্দরভাবে হ্যান্ডেল করতে দেয়।</p>'),

      h(2, 'try আর catch', 'try-and-catch'),
      code('php', '<?php\n  function divide($a, $b) {\n    if ($b === 0) {\n      throw new Exception("Cannot divide by zero.");\n    }\n    return $a / $b;\n  }\n\n  try {\n    echo divide(10, 0);\n  } catch (Exception $e) {\n    echo "Error: " . $e->getMessage();\n  }\n?>'),
      p('<p><code>throw</code> একটি exception তৈরি করে; এর টাইপের সাথে মেলে এমন নিকটতম চারপাশের <code>catch</code> ব্লক সেটা ধরে ফেলে, আর স্ক্রিপ্ট থামার বদলে সেখান থেকে চলতে থাকে।</p>'),

      h(2, 'finally', 'finally'),
      p('<p><code>finally</code>-এর ভেতরের কোড সবসময় চলে, একটি exception তৈরি হোক বা না হোক — যা যেকোনো অবস্থাতেই ঘটতে হবে এমন cleanup-এর জন্য দরকারি, যেমন একটি ফাইল বন্ধ করা:</p>'),
      code('php', '<?php\n  try {\n    echo divide(10, 2);\n  } catch (Exception $e) {\n    echo "Error: " . $e->getMessage();\n  } finally {\n    echo "\\nDone.";\n  }\n?>'),

      h(2, 'নির্দিষ্ট Exception টাইপ ধরা', 'catching-specific-exception-types'),
      p('<p>PHP-তে বেশ কিছু বিল্ট-ইন exception টাইপ আছে, আর আপনি একটি সাধারণ <code>Exception</code>-এর আগে একটি বেশি নির্দিষ্ট টাইপ ধরতে পারেন:</p>'),
      code('php', '<?php\n  try {\n    $result = 10 / 0; // DivisionByZeroError, not a regular Exception\n  } catch (DivisionByZeroError $e) {\n    echo "Specifically caught: " . $e->getMessage();\n  } catch (Exception $e) {\n    echo "General error: " . $e->getMessage();\n  }\n?>'),
      callout('note', '<p>একাধিক টাইপ ধরার সময় ক্রম গুরুত্বপূর্ণ — PHP উপর থেকে নিচে <code>catch</code> ব্লক চেক করে আর প্রথম মিলে যাওয়াটা ব্যবহার করে, তাই একটি নির্দিষ্ট টাইপ সবসময় একটি বেশি সাধারণ টাইপের আগে থাকা উচিত যা নাহলে সেটাকে আগে ধরে ফেলত।</p>', 'নির্দিষ্ট catch ব্লক আগে থাকে'),

      h(2, 'বাস্তব সাইটের জন্য এটি কেন গুরুত্বপূর্ণ', 'why-this-matters-for-real-sites'),
      p('<p>একটি লাইভ PHP সাইটে একটি না-ধরা এরর একটি visitor-এর কাছে সরাসরি একটি raw এরর মেসেজ প্রকাশ করে দিতে পারে — কখনো কখনো ফাইল পাথ বা ডেটাবেসের বিবরণসহ। ঝুঁকিপূর্ণ অপারেশন (ফাইল অ্যাক্সেস, ডেটাবেস কোয়েরি, নিজের স্ক্রিপ্টের বাইরের কিছুর সাথে কথা বলা) <code>try</code>/<code>catch</code>-এ মুড়িয়ে দেওয়াই এটাকে একটি পরিষ্কার, নিয়ন্ত্রিত মেসেজে বদলে দেয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'oop-introduction',
  sortOrder: 23,
  en: {
    title: 'Introduction to OOP',
    metaTitle: 'Introduction to OOP in PHP | Learn Computer Academy',
    metaDescription: 'The basics of object-oriented programming in PHP — classes, objects, properties, and methods.',
    blocks: [
      p('<p>Everything up to this point has been <b>procedural</b> — a script running top to bottom, calling functions along the way. <b>Object-oriented programming (OOP)</b> is a different way of organizing code: instead of separate functions and variables floating around, you group related data and behavior together into a single unit called an <b>object</b>.</p>'),

      h(2, 'Classes and Objects'),
      p('<p>A <b>class</b> is a blueprint describing what an object of that kind will have and do. An <b>object</b> is one actual instance built from that blueprint. This is exactly like the difference between a house\'s architectural plan and an actual house built from it — one plan, any number of real houses.</p>'),
      code('php', '<?php\n  class Student {\n    public $name;\n    public $course;\n\n    public function introduce() {\n      return "Hi, I\'m {$this->name}, studying {$this->course}.";\n    }\n  }\n\n  $student1 = new Student();\n  $student1->name = "Priya";\n  $student1->course = "Web Development";\n\n  echo $student1->introduce(); // "Hi, I\'m Priya, studying Web Development."\n?>'),

      h(2, 'Properties and Methods'),
      p('<p>A <b>property</b> is a variable that belongs to an object (<code>$name</code>, <code>$course</code> above); a <b>method</b> is a function that belongs to one (<code>introduce()</code>). The <code>-&gt;</code> arrow accesses both from outside the class, and <code>$this-&gt;</code> accesses them from inside a method.</p>'),

      img(
        'docs/img/php/oop-introduction-1',
        'Isometric diagram showing a class blueprint labeled Student on one side, with arrows producing multiple distinct object instances on the other side, each with its own name and course property',
        1024, 768,
        'A class is the blueprint; each object built from it is a separate, independent instance.'
      ),

      h(2, 'Multiple Independent Objects'),
      p('<p>Each object created from a class has its own separate copy of every property — changing one object never affects another:</p>'),
      code('php', '<?php\n  $student2 = new Student();\n  $student2->name = "Amit";\n  $student2->course = "Graphic Design";\n\n  echo $student1->name; // still "Priya" — unaffected by $student2\n  echo $student2->name; // "Amit"\n?>'),

      callout('note', '<p>The next lesson builds directly on this one, adding <b>constructors</b> (setting up an object\'s starting state automatically), <b>inheritance</b> (one class building on another), and <b>visibility</b> (controlling what\'s accessible from outside a class).</p>', 'More is coming immediately'),
    ],
  },
  bn: {
    title: 'OOP পরিচিতি',
    metaTitle: 'PHP-তে OOP পরিচিতি | Learn Computer Academy',
    metaDescription: 'PHP-তে অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিংয়ের বেসিক — ক্লাস, অবজেক্ট, প্রপার্টি, আর মেথড।',
    blocks: [
      p('<p>এই পর্যন্ত সবকিছু ছিল <b>প্রোসিডিউরাল</b> — একটি স্ক্রিপ্ট উপর থেকে নিচে চলছে, পথে ফাংশন কল করছে। <b>অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং (OOP)</b> কোড সংগঠিত করার একটি ভিন্ন উপায়: এদিক-ওদিক ভাসমান আলাদা ফাংশন আর ভ্যারিয়েবলের বদলে, আপনি সম্পর্কিত ডেটা আর আচরণকে <b>অবজেক্ট</b> নামের একটি একক ইউনিটে একসাথে গ্রুপ করেন।</p>'),

      h(2, 'ক্লাস আর অবজেক্ট', 'classes-and-objects'),
      p('<p>একটি <b>ক্লাস</b> হলো একটি ব্লুপ্রিন্ট যা বর্ণনা করে সেই ধরনের একটি অবজেক্টের কী থাকবে আর এটি কী করবে। একটি <b>অবজেক্ট</b> হলো সেই ব্লুপ্রিন্ট থেকে তৈরি একটি প্রকৃত instance। এটি ঠিক একটি বাড়ির স্থাপত্য পরিকল্পনা আর তা থেকে তৈরি একটি প্রকৃত বাড়ির মধ্যে পার্থক্যের মতো — একটি পরিকল্পনা, যেকোনো সংখ্যক প্রকৃত বাড়ি।</p>'),
      code('php', '<?php\n  class Student {\n    public $name;\n    public $course;\n\n    public function introduce() {\n      return "Hi, I\'m {$this->name}, studying {$this->course}.";\n    }\n  }\n\n  $student1 = new Student();\n  $student1->name = "Priya";\n  $student1->course = "Web Development";\n\n  echo $student1->introduce(); // "Hi, I\'m Priya, studying Web Development."\n?>'),

      h(2, 'প্রপার্টি আর মেথড', 'properties-and-methods'),
      p('<p>একটি <b>প্রপার্টি</b> হলো একটি অবজেক্টের নিজস্ব ভ্যারিয়েবল (উপরের <code>$name</code>, <code>$course</code>); একটি <b>মেথড</b> হলো একটি অবজেক্টের নিজস্ব ফাংশন (<code>introduce()</code>)। <code>-&gt;</code> অ্যারো ক্লাসের বাইরে থেকে দুটোই অ্যাক্সেস করে, আর <code>$this-&gt;</code> একটি মেথডের ভেতর থেকে এগুলো অ্যাক্সেস করে।</p>'),

      img(
        'docs/img/php/oop-introduction-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে একদিকে Student লেবেলযুক্ত একটি ক্লাস ব্লুপ্রিন্ট দেখানো হয়েছে, আর তীরচিহ্ন অন্য দিকে একাধিক আলাদা অবজেক্ট instance তৈরি করছে, প্রতিটির নিজস্ব name আর course প্রপার্টি',
        1024, 768,
        'একটি ক্লাস হলো ব্লুপ্রিন্ট; এটি থেকে তৈরি প্রতিটি অবজেক্ট একটি আলাদা, স্বাধীন instance।'
      ),

      h(2, 'একাধিক স্বাধীন অবজেক্ট', 'multiple-independent-objects'),
      p('<p>একটি ক্লাস থেকে তৈরি প্রতিটি অবজেক্টের প্রতিটি প্রপার্টির নিজস্ব আলাদা কপি থাকে — একটি অবজেক্ট বদলালে আরেকটি কখনো প্রভাবিত হয় না:</p>'),
      code('php', '<?php\n  $student2 = new Student();\n  $student2->name = "Amit";\n  $student2->course = "Graphic Design";\n\n  echo $student1->name; // still "Priya" — unaffected by $student2\n  echo $student2->name; // "Amit"\n?>'),

      callout('note', '<p>পরের পাঠ সরাসরি এটার উপর ভিত্তি করে তৈরি, যোগ করবে <b>constructor</b> (স্বয়ংক্রিয়ভাবে একটি অবজেক্টের শুরুর অবস্থা সেট করা), <b>inheritance</b> (একটি ক্লাস আরেকটির উপর ভিত্তি করে তৈরি), আর <b>visibility</b> (একটি ক্লাসের বাইরে থেকে কী অ্যাক্সেসযোগ্য তা নিয়ন্ত্রণ করা)।</p>', 'আরও কিছু সাথে সাথেই আসছে'),
    ],
  },
})

lessons.push({
  slug: 'oop-inheritance',
  sortOrder: 24,
  en: {
    title: 'OOP — Constructors, Inheritance, and Visibility',
    metaTitle: 'PHP OOP: Constructors, Inheritance, Visibility | Learn Computer Academy',
    metaDescription: 'Setting up objects automatically with constructors, sharing behavior between classes with inheritance, and controlling access with public, private, and protected.',
    blocks: [
      p('<p>The previous lesson built a class by hand, property by property. This one covers the three features that make classes genuinely powerful in practice.</p>'),

      h(2, 'Constructors'),
      p('<p>A <b>constructor</b> — a special method named <code>__construct()</code> — runs automatically the moment an object is created, so you never have to set every property manually afterward:</p>'),
      code('php', '<?php\n  class Student {\n    public $name;\n    public $course;\n\n    public function __construct($name, $course) {\n      $this->name = $name;\n      $this->course = $course;\n    }\n  }\n\n  $student = new Student("Priya", "Web Development"); // set in one line\n?>'),

      h(2, 'Visibility: public, private, protected'),
      table(
        ['Keyword', 'Accessible from'],
        [
          ['public', 'Anywhere — inside the class, and from outside it'],
          ['private', 'Only from inside this exact class'],
          ['protected', 'This class, and any class that inherits from it'],
        ]
      ),
      code('php', '<?php\n  class BankAccount {\n    private $balance = 0;\n\n    public function deposit($amount) {\n      $this->balance += $amount;\n    }\n\n    public function getBalance() {\n      return $this->balance;\n    }\n  }\n\n  $account = new BankAccount();\n  $account->deposit(500);\n  echo $account->getBalance(); // 500\n  // echo $account->balance; // Error — private, not accessible from outside\n?>'),
      callout('tip', '<p>Making a property <code>private</code> and only exposing it through methods like <code>getBalance()</code> is called <b>encapsulation</b> — it stops outside code from setting <code>$balance</code> to an invalid value directly, since every change has to go through a method you control.</p>', 'Why bother with private?'),

      h(2, 'Inheritance'),
      p('<p><b>Inheritance</b> lets one class build on another with <code>extends</code>, reusing its properties and methods instead of rewriting them:</p>'),
      code('php', '<?php\n  class Person {\n    public $name;\n\n    public function __construct($name) {\n      $this->name = $name;\n    }\n\n    public function greet() {\n      return "Hi, I\'m {$this->name}.";\n    }\n  }\n\n  class Student extends Person {\n    public $course;\n\n    public function __construct($name, $course) {\n      parent::__construct($name); // reuse Person\'s constructor\n      $this->course = $course;\n    }\n  }\n\n  $s = new Student("Amit", "Graphic Design");\n  echo $s->greet(); // "Hi, I\'m Amit." — inherited from Person, unchanged\n?>'),
      p('<p><code>parent::</code> calls a method from the class being extended — commonly used, as above, to reuse a parent\'s constructor instead of duplicating its logic.</p>'),
    ],
  },
  bn: {
    title: 'OOP — কনস্ট্রাক্টর, ইনহেরিটেন্স, আর ভিজিবিলিটি',
    metaTitle: 'PHP OOP: কনস্ট্রাক্টর, ইনহেরিটেন্স, ভিজিবিলিটি | Learn Computer Academy',
    metaDescription: 'কনস্ট্রাক্টর দিয়ে স্বয়ংক্রিয়ভাবে অবজেক্ট সেট আপ করা, ইনহেরিটেন্স দিয়ে ক্লাসের মধ্যে আচরণ শেয়ার করা, আর public, private, আর protected দিয়ে অ্যাক্সেস নিয়ন্ত্রণ করা।',
    blocks: [
      p('<p>আগের পাঠে হাতে হাতে, প্রপার্টি ধরে ধরে একটি ক্লাস তৈরি করা হয়েছিল। এই পাঠে সেই তিনটি বৈশিষ্ট্য দেখানো হবে যা বাস্তবে ক্লাসকে সত্যিকারভাবে শক্তিশালী করে তোলে।</p>'),

      h(2, 'কনস্ট্রাক্টর', 'constructors'),
      p('<p>একটি <b>কনস্ট্রাক্টর</b> — <code>__construct()</code> নামের একটি বিশেষ মেথড — একটি অবজেক্ট তৈরি হওয়া মাত্র স্বয়ংক্রিয়ভাবে চলে, যাতে পরে আপনাকে হাতে হাতে প্রতিটি প্রপার্টি সেট করতে না হয়:</p>'),
      code('php', '<?php\n  class Student {\n    public $name;\n    public $course;\n\n    public function __construct($name, $course) {\n      $this->name = $name;\n      $this->course = $course;\n    }\n  }\n\n  $student = new Student("Priya", "Web Development"); // set in one line\n?>'),

      h(2, 'ভিজিবিলিটি: public, private, protected', 'visibility-public-private-protected'),
      table(
        ['কীওয়ার্ড', 'কোথা থেকে অ্যাক্সেসযোগ্য'],
        [
          ['public', 'যেকোনো জায়গা থেকে — ক্লাসের ভেতরে, আর বাইরে থেকেও'],
          ['private', 'শুধু এই নির্দিষ্ট ক্লাসের ভেতর থেকে'],
          ['protected', 'এই ক্লাস, আর এর থেকে inherit করা যেকোনো ক্লাস'],
        ]
      ),
      code('php', '<?php\n  class BankAccount {\n    private $balance = 0;\n\n    public function deposit($amount) {\n      $this->balance += $amount;\n    }\n\n    public function getBalance() {\n      return $this->balance;\n    }\n  }\n\n  $account = new BankAccount();\n  $account->deposit(500);\n  echo $account->getBalance(); // 500\n  // echo $account->balance; // Error — private, not accessible from outside\n?>'),
      callout('tip', '<p>একটি প্রপার্টিকে <code>private</code> করা আর শুধু <code>getBalance()</code>-এর মতো মেথডের মাধ্যমে সেটা প্রকাশ করাকে বলে <b>এনক্যাপসুলেশন</b> — এটি বাইরের কোডকে সরাসরি <code>$balance</code>-কে একটি অবৈধ মানে সেট করতে বাধা দেয়, কারণ প্রতিটি পরিবর্তন আপনার নিয়ন্ত্রিত একটি মেথডের মধ্য দিয়ে যেতে হয়।</p>', 'কেন private নিয়ে এত মাথাব্যথা?'),

      h(2, 'ইনহেরিটেন্স', 'inheritance'),
      p('<p><b>ইনহেরিটেন্স</b> একটি ক্লাসকে <code>extends</code> দিয়ে আরেকটির উপর ভিত্তি করে তৈরি করতে দেয়, সেটার প্রপার্টি আর মেথড আবার না লিখে পুনঃব্যবহার করে:</p>'),
      code('php', '<?php\n  class Person {\n    public $name;\n\n    public function __construct($name) {\n      $this->name = $name;\n    }\n\n    public function greet() {\n      return "Hi, I\'m {$this->name}.";\n    }\n  }\n\n  class Student extends Person {\n    public $course;\n\n    public function __construct($name, $course) {\n      parent::__construct($name); // reuse Person\'s constructor\n      $this->course = $course;\n    }\n  }\n\n  $s = new Student("Amit", "Graphic Design");\n  echo $s->greet(); // "Hi, I\'m Amit." — inherited from Person, unchanged\n?>'),
      p('<p><code>parent::</code> extend করা ক্লাস থেকে একটি মেথড কল করে — উপরের মতো, একটি parent-এর কনস্ট্রাক্টর ডুপ্লিকেট না করে পুনঃব্যবহার করতে সাধারণভাবে ব্যবহৃত হয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'oop-interfaces',
  sortOrder: 25,
  en: {
    title: 'OOP — Interfaces and Abstract Classes',
    metaTitle: 'PHP Interfaces and Abstract Classes | Learn Computer Academy',
    metaDescription: 'Using interfaces and abstract classes in PHP to guarantee that different classes share a common set of methods.',
    blocks: [
      p('<p>Both of these solve a similar problem: making sure a group of otherwise different classes all provide a certain set of methods, so code that uses them doesn\'t need to care which exact class it\'s working with.</p>'),

      h(2, 'Interfaces'),
      p('<p>An <b>interface</b> defines a set of method names a class promises to implement — it specifies <i>what</i> a class must be able to do, with no detail about <i>how</i>:</p>'),
      code('php', '<?php\n  interface Payable {\n    public function pay($amount);\n  }\n\n  class CreditCard implements Payable {\n    public function pay($amount) {\n      echo "Charged $amount to credit card.";\n    }\n  }\n\n  class Cash implements Payable {\n    public function pay($amount) {\n      echo "Received $amount in cash.";\n    }\n  }\n\n  function checkout(Payable $method, $amount) {\n    $method->pay($amount); // works with any Payable, regardless of exact class\n  }\n\n  checkout(new CreditCard(), 500);\n  checkout(new Cash(), 500);\n?>'),
      p('<p><code>checkout()</code> doesn\'t know or care whether it received a <code>CreditCard</code> or a <code>Cash</code> object — only that whatever it received honors the <code>Payable</code> interface. This is the practical payoff: code written once keeps working correctly even as new payment types are added later.</p>'),

      h(2, 'Abstract Classes'),
      p('<p>An <b>abstract class</b> is a class that can\'t be instantiated directly — it exists purely to be extended, and can mix fully-written methods with abstract ones (a method signature with no body, that every subclass must fill in):</p>'),
      code('php', '<?php\n  abstract class Shape {\n    abstract public function area(); // every subclass must define this\n\n    public function describe() { // shared by every subclass, as-is\n      return "This shape has an area of " . $this->area();\n    }\n  }\n\n  class Circle extends Shape {\n    public function __construct(private $radius) {}\n    public function area() {\n      return round(pi() * $this->radius ** 2, 2);\n    }\n  }\n\n  $circle = new Circle(5);\n  echo $circle->describe(); // "This shape has an area of 78.54"\n  // new Shape(); // Error — cannot instantiate an abstract class\n?>'),

      h(2, 'Interface vs. Abstract Class'),
      table(
        ['', 'Can include real method code?', 'A class can use how many?', 'Use when'],
        [
          ['Interface', 'No (method signatures only)', 'Several, at once', 'Unrelated classes need to guarantee the same capability'],
          ['Abstract class', 'Yes, mixed with abstract methods', 'One', 'Related classes should share real, common behavior'],
        ]
      ),
    ],
  },
  bn: {
    title: 'OOP — ইন্টারফেস আর অ্যাবস্ট্র্যাক্ট ক্লাস',
    metaTitle: 'PHP ইন্টারফেস আর অ্যাবস্ট্র্যাক্ট ক্লাস | Learn Computer Academy',
    metaDescription: 'অন্যথায় ভিন্ন ক্লাসগুলো সবাই একটি নির্দিষ্ট সেট মেথড শেয়ার করে তা নিশ্চিত করতে PHP-তে ইন্টারফেস আর অ্যাবস্ট্র্যাক্ট ক্লাস ব্যবহার করা।',
    blocks: [
      p('<p>এই দুটোই একই রকম একটি সমস্যা সমাধান করে: নিশ্চিত করা যে অন্যথায় ভিন্ন একদল ক্লাস সবাই একটি নির্দিষ্ট সেট মেথড দেয়, যাতে যে কোড এদের ব্যবহার করে তার ঠিক কোন ক্লাসের সাথে কাজ করছে তা নিয়ে মাথা ঘামাতে না হয়।</p>'),

      h(2, 'ইন্টারফেস', 'interfaces'),
      p('<p>একটি <b>ইন্টারফেস</b> একটি ক্লাস কার্যকর করার প্রতিশ্রুতি দেওয়া মেথডের নামের একটি সেট সংজ্ঞায়িত করে — এটি নির্দিষ্ট করে একটি ক্লাসকে <i>কী</i> করতে পারতে হবে, <i>কীভাবে</i> সে বিষয়ে কোনো বিস্তারিত ছাড়াই:</p>'),
      code('php', '<?php\n  interface Payable {\n    public function pay($amount);\n  }\n\n  class CreditCard implements Payable {\n    public function pay($amount) {\n      echo "Charged $amount to credit card.";\n    }\n  }\n\n  class Cash implements Payable {\n    public function pay($amount) {\n      echo "Received $amount in cash.";\n    }\n  }\n\n  function checkout(Payable $method, $amount) {\n    $method->pay($amount); // works with any Payable, regardless of exact class\n  }\n\n  checkout(new CreditCard(), 500);\n  checkout(new Cash(), 500);\n?>'),
      p('<p><code>checkout()</code> জানে না বা পাত্তা দেয় না যে এটি একটি <code>CreditCard</code> নাকি একটি <code>Cash</code> অবজেক্ট পেয়েছে — শুধু জানে যে যা পেয়েছে তা <code>Payable</code> ইন্টারফেস মেনে চলে। এটাই ব্যবহারিক লাভ: একবার লেখা কোড পরে নতুন পেমেন্ট টাইপ যোগ হলেও সঠিকভাবে কাজ করতে থাকে।</p>'),

      h(2, 'অ্যাবস্ট্র্যাক্ট ক্লাস', 'abstract-classes'),
      p('<p>একটি <b>অ্যাবস্ট্র্যাক্ট ক্লাস</b> এমন একটি ক্লাস যা সরাসরি instantiate করা যায় না — এটি শুধু extend হওয়ার জন্যই থাকে, আর সম্পূর্ণ-লেখা মেথডের সাথে অ্যাবস্ট্র্যাক্ট মেথড (কোনো body ছাড়া একটি মেথড সিগনেচার, যা প্রতিটি সাবক্লাসকে পূরণ করতে হয়) মেশাতে পারে:</p>'),
      code('php', '<?php\n  abstract class Shape {\n    abstract public function area(); // every subclass must define this\n\n    public function describe() { // shared by every subclass, as-is\n      return "This shape has an area of " . $this->area();\n    }\n  }\n\n  class Circle extends Shape {\n    public function __construct(private $radius) {}\n    public function area() {\n      return round(pi() * $this->radius ** 2, 2);\n    }\n  }\n\n  $circle = new Circle(5);\n  echo $circle->describe(); // "This shape has an area of 78.54"\n  // new Shape(); // Error — cannot instantiate an abstract class\n?>'),

      h(2, 'ইন্টারফেস বনাম অ্যাবস্ট্র্যাক্ট ক্লাস', 'interface-vs-abstract-class'),
      table(
        ['', 'আসল মেথড কোড থাকতে পারে?', 'একটি ক্লাস কতগুলো ব্যবহার করতে পারে?', 'কখন ব্যবহার করবেন'],
        [
          ['ইন্টারফেস', 'না (শুধু মেথড সিগনেচার)', 'একসাথে একাধিক', 'অসম্পর্কিত ক্লাসগুলোর একই ক্ষমতা থাকার নিশ্চয়তা প্রয়োজন'],
          ['অ্যাবস্ট্র্যাক্ট ক্লাস', 'হ্যাঁ, অ্যাবস্ট্র্যাক্ট মেথডের সাথে মেশানো', 'একটি', 'সম্পর্কিত ক্লাসগুলোর আসল, সাধারণ আচরণ শেয়ার করা উচিত'],
        ]
      ),
    ],
  },
})

lessons.push({
  slug: 'dates-and-times',
  sortOrder: 26,
  en: {
    title: 'Working with Dates and Times',
    metaTitle: 'PHP Dates and Times | Learn Computer Academy',
    metaDescription: 'Getting and formatting the current date and time in PHP, plus the DateTime class for anything more involved.',
    blocks: [
      p('<p>Nearly every real application needs to show or store a date somewhere — when a post was published, when an account was created. PHP has a quick functional way to do this, and a more capable object-oriented one.</p>'),

      h(2, 'The Quick Way: date()'),
      code('php', '<?php\n  echo date("Y-m-d");       // "2026-07-30"\n  echo date("d/m/Y");       // "30/07/2026"\n  echo date("l, F j, Y");   // "Thursday, July 30, 2026"\n  echo date("H:i:s");        // "14:30:00"\n?>'),
      table(
        ['Character', 'Means'],
        [
          ['Y', '4-digit year'],
          ['m', '2-digit month'],
          ['d', '2-digit day'],
          ['H:i:s', 'Hour:minute:second, 24-hour'],
          ['l', 'Full day name'],
          ['F', 'Full month name'],
        ]
      ),
      p('<p>The full set of format characters is in the <a href="https://www.php.net/manual/en/function.date.php" target="_blank" rel="noopener noreferrer">date() reference on php.net</a> — there are dozens, covering every format you\'re likely to need.</p>'),

      h(2, 'The DateTime Class'),
      p('<p>For anything beyond simple formatting — comparing dates, adding time, working across time zones — the object-oriented <code>DateTime</code> class is the better tool:</p>'),
      code('php', '<?php\n  $today = new DateTime();\n  $deadline = new DateTime("2026-12-31");\n\n  $interval = $today->diff($deadline);\n  echo $interval->days . " days remaining"; // e.g. "154 days remaining"\n\n  $today->modify("+7 days");\n  echo $today->format("Y-m-d"); // one week from today\n?>'),

      callout('note', '<p>PHP\'s date and time functions default to the server\'s configured time zone, which may not match a visitor\'s own. For anything where that matters — a scheduled event, a countdown — either set the time zone explicitly with <code>date_default_timezone_set()</code>, or handle the conversion in JavaScript on the visitor\'s own device.</p>', 'Time zones are the server\'s, by default'),
    ],
  },
  bn: {
    title: 'ডেট আর টাইম নিয়ে কাজ করা',
    metaTitle: 'PHP ডেট আর টাইম | Learn Computer Academy',
    metaDescription: 'PHP-তে বর্তমান তারিখ আর সময় পাওয়া আর ফরম্যাট করা, সাথে আরও জটিল কিছুর জন্য DateTime ক্লাস।',
    blocks: [
      p('<p>প্রায় প্রতিটি বাস্তব অ্যাপ্লিকেশনে কোথাও না কোথাও একটি তারিখ দেখানো বা সংরক্ষণ করা প্রয়োজন — কখন একটি পোস্ট প্রকাশিত হয়েছিল, কখন একটি অ্যাকাউন্ট তৈরি হয়েছিল। PHP-এর একটি দ্রুত ফাংশনাল উপায় আছে, আর একটি বেশি সক্ষম অবজেক্ট-ওরিয়েন্টেড উপায়ও আছে।</p>'),

      h(2, 'দ্রুত উপায়: date()', 'the-quick-way-date'),
      code('php', '<?php\n  echo date("Y-m-d");       // "2026-07-30"\n  echo date("d/m/Y");       // "30/07/2026"\n  echo date("l, F j, Y");   // "Thursday, July 30, 2026"\n  echo date("H:i:s");        // "14:30:00"\n?>'),
      table(
        ['ক্যারেক্টার', 'অর্থ'],
        [
          ['Y', '4-সংখ্যার বছর'],
          ['m', '2-সংখ্যার মাস'],
          ['d', '2-সংখ্যার দিন'],
          ['H:i:s', 'ঘণ্টা:মিনিট:সেকেন্ড, 24-ঘণ্টা'],
          ['l', 'পুরো দিনের নাম'],
          ['F', 'পুরো মাসের নাম'],
        ]
      ),
      p('<p>ফরম্যাট ক্যারেক্টারের সম্পূর্ণ সেট আছে <a href="https://www.php.net/manual/en/function.date.php" target="_blank" rel="noopener noreferrer">php.net-এ date() রেফারেন্সে</a> — সেখানে কয়েক ডজন আছে, আপনার প্রয়োজন হতে পারে এমন প্রতিটি ফরম্যাট কভার করে।</p>'),

      h(2, 'DateTime ক্লাস', 'the-datetime-class'),
      p('<p>সাধারণ ফরম্যাটিংয়ের বাইরে যেকোনো কিছুর জন্য — তারিখ তুলনা করা, সময় যোগ করা, টাইম জোন জুড়ে কাজ করা — অবজেক্ট-ওরিয়েন্টেড <code>DateTime</code> ক্লাস বেশি ভালো টুল:</p>'),
      code('php', '<?php\n  $today = new DateTime();\n  $deadline = new DateTime("2026-12-31");\n\n  $interval = $today->diff($deadline);\n  echo $interval->days . " days remaining"; // e.g. "154 days remaining"\n\n  $today->modify("+7 days");\n  echo $today->format("Y-m-d"); // one week from today\n?>'),

      callout('note', '<p>PHP-এর ডেট আর টাইম ফাংশন ডিফল্টভাবে সার্ভারের কনফিগার করা টাইম জোন ব্যবহার করে, যা একজন visitor-এর নিজেরটার সাথে নাও মিলতে পারে। যেখানে এটি গুরুত্বপূর্ণ — একটি নির্ধারিত ইভেন্ট, একটি কাউন্টডাউন — সেখানে হয় <code>date_default_timezone_set()</code> দিয়ে স্পষ্টভাবে টাইম জোন সেট করুন, বা visitor-এর নিজের ডিভাইসে JavaScript দিয়ে রূপান্তরটা হ্যান্ডেল করুন।</p>', 'ডিফল্টভাবে টাইম জোন সার্ভারের'),
    ],
  },
})

lessons.push({
  slug: 'file-handling',
  sortOrder: 27,
  en: {
    title: 'File Handling',
    metaTitle: 'PHP File Handling | Learn Computer Academy',
    metaDescription: 'Reading from and writing to files on the server with PHP\'s file functions.',
    blocks: [
      p('<p>Because PHP runs on the server, it can read and write files sitting on that same server — logs, cached data, simple text-based storage without needing a full database.</p>'),

      h(2, 'Reading an Entire File'),
      code('php', '<?php\n  $content = file_get_contents("notes.txt");\n  echo $content;\n?>'),

      h(2, 'Writing to a File'),
      code('php', '<?php\n  file_put_contents("notes.txt", "Hello, file!");         // overwrites\n  file_put_contents("notes.txt", "\\nAnother line.", FILE_APPEND); // appends instead\n?>'),

      h(2, 'Reading Line by Line'),
      p('<p>For a large file, reading it all into memory at once with <code>file_get_contents()</code> is wasteful — opening it as a handle and reading one line at a time is more efficient:</p>'),
      code('php', '<?php\n  $handle = fopen("notes.txt", "r");\n  while (($line = fgets($handle)) !== false) {\n    echo $line;\n  }\n  fclose($handle);\n?>'),
      callout('warning', '<p>Always call <code>fclose()</code> once you\'re done with a file handle opened via <code>fopen()</code> — leaving files open unnecessarily can lock them from other processes and leak resources on a long-running server.</p>', 'Always close what you fopen()'),

      h(2, 'Checking Before You Act'),
      code('php', '<?php\n  if (file_exists("notes.txt")) {\n    echo "File exists.";\n  }\n\n  if (is_writable("notes.txt")) {\n    echo "File can be written to.";\n  }\n?>'),

      callout('note', '<p>Any path used with these functions should never come directly from user input without careful validation — a visitor-controlled file path is a serious security risk (an attacker could potentially read or overwrite files well outside what you intended). This becomes especially relevant once file uploads are involved.</p>', 'Never trust a user-supplied file path'),
    ],
  },
  bn: {
    title: 'ফাইল হ্যান্ডলিং',
    metaTitle: 'PHP ফাইল হ্যান্ডলিং | Learn Computer Academy',
    metaDescription: 'PHP-এর ফাইল ফাংশন দিয়ে সার্ভারের ফাইল থেকে পড়া আর লেখা।',
    blocks: [
      p('<p>PHP যেহেতু সার্ভারে চলে, এটি সেই একই সার্ভারে থাকা ফাইল পড়তে আর লিখতে পারে — লগ, ক্যাশ করা ডেটা, একটি সম্পূর্ণ ডেটাবেস ছাড়াই সহজ টেক্সট-ভিত্তিক স্টোরেজ।</p>'),

      h(2, 'সম্পূর্ণ একটি ফাইল পড়া', 'reading-an-entire-file'),
      code('php', '<?php\n  $content = file_get_contents("notes.txt");\n  echo $content;\n?>'),

      h(2, 'একটি ফাইলে লেখা', 'writing-to-a-file'),
      code('php', '<?php\n  file_put_contents("notes.txt", "Hello, file!");         // overwrites\n  file_put_contents("notes.txt", "\\nAnother line.", FILE_APPEND); // appends instead\n?>'),

      h(2, 'লাইন বাই লাইন পড়া', 'reading-line-by-line'),
      p('<p>একটি বড় ফাইলের জন্য, <code>file_get_contents()</code> দিয়ে একবারে পুরোটা মেমরিতে পড়া অপচয়মূলক — এটাকে একটি handle হিসেবে খুলে একবারে একটি লাইন পড়া বেশি কার্যকর:</p>'),
      code('php', '<?php\n  $handle = fopen("notes.txt", "r");\n  while (($line = fgets($handle)) !== false) {\n    echo $line;\n  }\n  fclose($handle);\n?>'),
      callout('warning', '<p><code>fopen()</code> দিয়ে খোলা একটি ফাইল handle-এর কাজ শেষ হলে সবসময় <code>fclose()</code> কল করুন — অপ্রয়োজনীয়ভাবে ফাইল খোলা রাখলে অন্য প্রসেস থেকে সেগুলো লক হয়ে যেতে পারে আর একটি দীর্ঘ-চলমান সার্ভারে রিসোর্স leak করতে পারে।</p>', 'যা fopen() করেছেন তা সবসময় বন্ধ করুন'),

      h(2, 'কাজ করার আগে চেক করা', 'checking-before-you-act'),
      code('php', '<?php\n  if (file_exists("notes.txt")) {\n    echo "File exists.";\n  }\n\n  if (is_writable("notes.txt")) {\n    echo "File can be written to.";\n  }\n?>'),

      callout('note', '<p>এই ফাংশনগুলোর সাথে ব্যবহৃত যেকোনো path কখনো সতর্ক ভ্যালিডেশন ছাড়া সরাসরি user input থেকে আসা উচিত নয় — একটি visitor-নিয়ন্ত্রিত ফাইল path একটি গুরুতর সিকিউরিটি ঝুঁকি (একজন আক্রমণকারী সম্ভবত আপনার উদ্দেশ্যের বাইরের ফাইল পড়তে বা ওভাররাইট করতে পারে)। ফাইল আপলোড জড়িত হলে এটি বিশেষভাবে প্রাসঙ্গিক হয়ে ওঠে।</p>', 'user-সরবরাহকৃত ফাইল path কখনো বিশ্বাস করবেন না'),
    ],
  },
})

lessons.push({
  slug: 'mysql-connecting',
  sortOrder: 28,
  en: {
    title: 'PHP and MySQL — Connecting with PDO',
    metaTitle: 'PHP and MySQL: Connecting with PDO | Learn Computer Academy',
    metaDescription: 'Connecting a PHP script to a MySQL database using PDO, PHP\'s modern, safer database interface.',
    blocks: [
      p('<p>This is where the earlier lesson on why PHP matters — "it can talk to a database" — actually becomes real. If you haven\'t looked at the <a href="/sql/intro/">Introduction to SQL</a> lesson yet, this is the right point to do it; from here on, this section assumes you know what a table, row, and basic <code>SELECT</code> statement are.</p>'),

      h(2, 'PDO: PHP Data Objects'),
      p('<p>PHP has more than one way to talk to a database, but <b>PDO</b> is the modern, recommended one — it works with several different database systems through one consistent interface, and it makes writing safe queries straightforward, which matters a lot once real user input is involved.</p>'),

      h(2, 'Making the Connection'),
      code('php', '<?php\n  $host = "localhost";\n  $db   = "school";\n  $user = "root";\n  $pass = "";\n\n  try {\n    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);\n    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n    echo "Connected successfully.";\n  } catch (PDOException $e) {\n    echo "Connection failed: " . $e->getMessage();\n  }\n?>'),
      p('<p>Wrapping the connection in <code>try</code>/<code>catch</code> (from the Error Handling lesson) matters here specifically — a database can be temporarily unreachable for reasons that have nothing to do with your code, and a visitor should see a clean message, not a raw connection error.</p>'),

      img(
        'docs/img/php/mysql-connecting-1',
        'Isometric diagram showing a PHP script connecting through PDO to a MySQL database cylinder, with a small key icon representing credentials',
        1024, 768,
        'PDO sits between a PHP script and a MySQL database, providing one consistent interface.'
      ),

      h(2, 'Keeping Credentials Out of the Script'),
      p('<p>Hardcoding a database password directly in a file you might commit to version control or accidentally expose is a real, common mistake. A safer pattern is a separate config file, outside your project\'s public web root, pulled in with <code>require_once</code> (from the Includes lesson):</p>'),
      code('php', '// config.php — kept outside the web-accessible folder\n<?php\n  return [\n    "host" => "localhost",\n    "db" => "school",\n    "user" => "root",\n    "pass" => "",\n  ];\n?>'),

      callout('tip', '<p>These examples connect to a local MySQL install for learning. A real deployment almost always keeps credentials in environment variables rather than any file at all — a detail specific to hosting, not the PHP or SQL itself.</p>', 'Local learning vs. real deployment'),
    ],
  },
  bn: {
    title: 'PHP আর MySQL — PDO দিয়ে কানেক্ট করা',
    metaTitle: 'PHP আর MySQL: PDO দিয়ে কানেক্ট করা | Learn Computer Academy',
    metaDescription: 'PDO ব্যবহার করে একটি PHP স্ক্রিপ্টকে একটি MySQL ডেটাবেসের সাথে কানেক্ট করা — PHP-এর আধুনিক, নিরাপদ ডেটাবেস ইন্টারফেস।',
    blocks: [
      p('<p>এখানেই আগের পাঠের "এটি একটি ডেটাবেসের সাথে কথা বলতে পারে" — PHP কেন গুরুত্বপূর্ণ তার সেই কথাটা আসলে বাস্তব হয়ে ওঠে। এখনও <a href="/bn/sql/intro/">SQL পরিচিতি</a> পাঠটি না দেখে থাকলে, এখনই সেটা দেখার সঠিক সময়; এখান থেকে, এই অংশটি ধরে নেয় আপনি জানেন একটি টেবিল, সারি, আর একটি সাধারণ <code>SELECT</code> স্টেটমেন্ট কী।</p>'),

      h(2, 'PDO: PHP Data Objects', 'pdo-php-data-objects'),
      p('<p>একটি ডেটাবেসের সাথে কথা বলার জন্য PHP-এর একের অধিক উপায় আছে, কিন্তু <b>PDO</b> হলো আধুনিক, প্রস্তাবিত উপায় — এটি একটি সামঞ্জস্যপূর্ণ ইন্টারফেসের মাধ্যমে বিভিন্ন ডেটাবেস সিস্টেমের সাথে কাজ করে, আর এটি নিরাপদ কোয়েরি লেখা সহজ করে দেয়, যা আসল user input জড়িত হলে অনেক গুরুত্বপূর্ণ হয়ে ওঠে।</p>'),

      h(2, 'কানেকশন তৈরি করা', 'making-the-connection'),
      code('php', '<?php\n  $host = "localhost";\n  $db   = "school";\n  $user = "root";\n  $pass = "";\n\n  try {\n    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);\n    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n    echo "Connected successfully.";\n  } catch (PDOException $e) {\n    echo "Connection failed: " . $e->getMessage();\n  }\n?>'),
      p('<p>কানেকশনকে (Error Handling পাঠের) <code>try</code>/<code>catch</code>-এ মোড়ানো এখানে নির্দিষ্টভাবে গুরুত্বপূর্ণ — একটি ডেটাবেস আপনার কোডের সাথে সম্পর্কহীন কারণে সাময়িকভাবে অপ্রাপ্য হতে পারে, আর একজন visitor-এর একটি পরিষ্কার মেসেজ দেখা উচিত, কোনো raw কানেকশন এরর নয়।</p>'),

      img(
        'docs/img/php/mysql-connecting-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে একটি PHP স্ক্রিপ্ট PDO-এর মাধ্যমে একটি MySQL ডেটাবেস সিলিন্ডারের সাথে কানেক্ট হচ্ছে, credentials বোঝাতে একটি ছোট চাবির আইকনসহ',
        1024, 768,
        'PDO একটি PHP স্ক্রিপ্ট আর একটি MySQL ডেটাবেসের মাঝখানে থাকে, একটি সামঞ্জস্যপূর্ণ ইন্টারফেস দিয়ে।'
      ),

      h(2, 'Credentials স্ক্রিপ্টের বাইরে রাখা', 'keeping-credentials-out-of-the-script'),
      p('<p>একটি ডেটাবেস পাসওয়ার্ড সরাসরি এমন একটি ফাইলে হার্ডকোড করা যা আপনি হয়তো version control-এ কমিট করতে পারেন বা দুর্ঘটনাক্রমে প্রকাশ করে ফেলতে পারেন, একটি বাস্তব, সাধারণ ভুল। একটি নিরাপদ প্যাটার্ন হলো আপনার প্রজেক্টের পাবলিক web root-এর বাইরে একটি আলাদা কনফিগ ফাইল, (Includes পাঠের) <code>require_once</code> দিয়ে টেনে আনা:</p>'),
      code('php', '// config.php — kept outside the web-accessible folder\n<?php\n  return [\n    "host" => "localhost",\n    "db" => "school",\n    "user" => "root",\n    "pass" => "",\n  ];\n?>'),

      callout('tip', '<p>এই উদাহরণগুলো শেখার জন্য একটি লোকাল MySQL ইনস্টলে কানেক্ট করে। একটি বাস্তব ডিপ্লয়মেন্ট প্রায় সবসময় credentials একদমই কোনো ফাইলে না রেখে এনভায়রনমেন্ট ভ্যারিয়েবলে রাখে — এটি হোস্টিং-নির্দিষ্ট একটি বিষয়, PHP বা SQL নিজে নয়।</p>', 'লোকাল শেখা বনাম বাস্তব ডিপ্লয়মেন্ট'),
    ],
  },
})

lessons.push({
  slug: 'mysql-querying',
  sortOrder: 29,
  en: {
    title: 'PHP and MySQL — Querying Data with PDO',
    metaTitle: 'PHP and MySQL: Querying Data with PDO | Learn Computer Academy',
    metaDescription: 'Running SELECT, INSERT, UPDATE, and DELETE queries from PHP with PDO, and why prepared statements are essential for security.',
    blocks: [
      p('<p>With a connection open (from the previous lesson), PDO can run any SQL you already know from the <a href="/sql/dml/">SQL DML lesson</a> — <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> — all work the same way from PHP.</p>'),

      h(2, 'Running a SELECT Query'),
      code('php', '<?php\n  $stmt = $pdo->query("SELECT name, course FROM students");\n  $students = $stmt->fetchAll(PDO::FETCH_ASSOC);\n\n  foreach ($students as $student) {\n    echo $student["name"] . " — " . $student["course"] . "\\n";\n  }\n?>'),
      p('<p><code>fetchAll(PDO::FETCH_ASSOC)</code> returns exactly the shape you met in the Associative Arrays lesson — an array of associative arrays, one per row, keyed by column name.</p>'),

      h(2, 'Prepared Statements — the Safe Way to Use Variables'),
      p('<p>Never build a query by directly gluing a variable into the SQL string. A <b>prepared statement</b> sends the query and the data separately, so the database never confuses "data" with "SQL code" — this is the single most important security practice in this entire lesson.</p>'),
      code('php', '<?php\n  // NEVER do this:\n  // $stmt = $pdo->query("SELECT * FROM students WHERE name = \'$name\'");\n\n  // Do this instead:\n  $stmt = $pdo->prepare("SELECT * FROM students WHERE name = ?");\n  $stmt->execute([$name]);\n  $result = $stmt->fetch(PDO::FETCH_ASSOC);\n?>'),
      callout('warning', '<p>Gluing a variable directly into a SQL string opens the door to <b>SQL injection</b> — a visitor typing something like <code>anything\' OR \'1\'=\'1</code> into a form field could rewrite your query\'s logic entirely, potentially reading or deleting data they were never meant to touch. Prepared statements close this off completely, because the database engine itself is what keeps data and code separate — this is not something to memorize and skip "for simple cases."</p>', 'This is not optional'),

      h(2, 'INSERT, UPDATE, and DELETE'),
      code('php', '<?php\n  // INSERT\n  $stmt = $pdo->prepare("INSERT INTO students (name, course) VALUES (?, ?)");\n  $stmt->execute(["Priya", "Web Development"]);\n\n  // UPDATE\n  $stmt = $pdo->prepare("UPDATE students SET course = ? WHERE name = ?");\n  $stmt->execute(["Graphic Design", "Priya"]);\n\n  // DELETE\n  $stmt = $pdo->prepare("DELETE FROM students WHERE name = ?");\n  $stmt->execute(["Priya"]);\n?>'),
      p('<p>The <code>?</code> placeholders are filled in, in order, by the array passed to <code>execute()</code> — named placeholders (<code>:name</code> instead of <code>?</code>) are also available, and read more clearly once a query has several parameters.</p>'),

      h(2, 'Where This Leaves You'),
      p('<p>This lesson closes out the PHP section by connecting it back to everything else on this site: the HTML you already know renders the page, the PHP in this section decides what data goes into it, and the <a href="/sql/">SQL section</a> is the full reference for everything you can ask a database to do once PHP hands it a query. From here, the practical next step is a small real project — a guestbook, a simple to-do list stored in a database — that uses all of it together.</p>'),
    ],
  },
  bn: {
    title: 'PHP আর MySQL — PDO দিয়ে ডেটা কোয়েরি করা',
    metaTitle: 'PHP আর MySQL: PDO দিয়ে ডেটা কোয়েরি করা | Learn Computer Academy',
    metaDescription: 'PDO দিয়ে PHP থেকে SELECT, INSERT, UPDATE, আর DELETE কোয়েরি চালানো, আর সিকিউরিটির জন্য prepared statement কেন অপরিহার্য।',
    blocks: [
      p('<p>(আগের পাঠের) একটি কানেকশন খোলা থাকলে, PDO <a href="/bn/sql/dml/">SQL DML পাঠ</a> থেকে ইতিমধ্যে জানা যেকোনো SQL চালাতে পারে — <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> — সবই PHP থেকে একইভাবে কাজ করে।</p>'),

      h(2, 'একটি SELECT কোয়েরি চালানো', 'running-a-select-query'),
      code('php', '<?php\n  $stmt = $pdo->query("SELECT name, course FROM students");\n  $students = $stmt->fetchAll(PDO::FETCH_ASSOC);\n\n  foreach ($students as $student) {\n    echo $student["name"] . " — " . $student["course"] . "\\n";\n  }\n?>'),
      p('<p><code>fetchAll(PDO::FETCH_ASSOC)</code> ঠিক সেই আকৃতিই রিটার্ন করে যা আপনি Associative Arrays পাঠে দেখেছেন — অ্যাসোসিয়েটিভ অ্যারের একটি অ্যারে, প্রতি সারিতে একটি, কলামের নাম দিয়ে key করা।</p>'),

      h(2, 'Prepared Statement — ভ্যারিয়েবল ব্যবহারের নিরাপদ উপায়', 'prepared-statements-the-safe-way-to-use-variables'),
      p('<p>কখনো সরাসরি একটি ভ্যারিয়েবল SQL স্ট্রিং-এ জোড়া লাগিয়ে একটি কোয়েরি তৈরি করবেন না। একটি <b>prepared statement</b> কোয়েরি আর ডেটা আলাদাভাবে পাঠায়, যাতে ডেটাবেস কখনো "ডেটা"-কে "SQL কোড"-এর সাথে গুলিয়ে না ফেলে — এই পুরো পাঠের সবচেয়ে গুরুত্বপূর্ণ একক সিকিউরিটি অনুশীলন এটাই।</p>'),
      code('php', '<?php\n  // NEVER do this:\n  // $stmt = $pdo->query("SELECT * FROM students WHERE name = \'$name\'");\n\n  // Do this instead:\n  $stmt = $pdo->prepare("SELECT * FROM students WHERE name = ?");\n  $stmt->execute([$name]);\n  $result = $stmt->fetch(PDO::FETCH_ASSOC);\n?>'),
      callout('warning', '<p>একটি ভ্যারিয়েবল সরাসরি একটি SQL স্ট্রিংয়ে জোড়া লাগালে <b>SQL injection</b>-এর দরজা খুলে যায় — একজন visitor একটি ফর্ম ফিল্ডে <code>anything\' OR \'1\'=\'1</code>-এর মতো কিছু টাইপ করলে আপনার কোয়েরির লজিক সম্পূর্ণভাবে পুনর্লিখন করে ফেলতে পারে, সম্ভবত এমন ডেটা পড়তে বা মুছে ফেলতে পারে যা তাদের কখনো ছোঁয়ার কথা ছিল না। Prepared statement এটা পুরোপুরি বন্ধ করে দেয়, কারণ ডেটাবেস ইঞ্জিন নিজেই ডেটা আর কোডকে আলাদা রাখে — এটা মুখস্থ করে "সহজ ক্ষেত্রে" বাদ দেওয়ার মতো কিছু নয়।</p>', 'এটি ঐচ্ছিক নয়'),

      h(2, 'INSERT, UPDATE, আর DELETE', 'insert-update-and-delete'),
      code('php', '<?php\n  // INSERT\n  $stmt = $pdo->prepare("INSERT INTO students (name, course) VALUES (?, ?)");\n  $stmt->execute(["Priya", "Web Development"]);\n\n  // UPDATE\n  $stmt = $pdo->prepare("UPDATE students SET course = ? WHERE name = ?");\n  $stmt->execute(["Graphic Design", "Priya"]);\n\n  // DELETE\n  $stmt = $pdo->prepare("DELETE FROM students WHERE name = ?");\n  $stmt->execute(["Priya"]);\n?>'),
      p('<p><code>?</code> প্লেসহোল্ডারগুলো <code>execute()</code>-এ পাস করা অ্যারে দিয়ে, ক্রম অনুযায়ী পূরণ হয় — নামযুক্ত প্লেসহোল্ডার (<code>?</code>-এর বদলে <code>:name</code>)-ও পাওয়া যায়, আর একটি কোয়েরিতে বেশ কয়েকটি প্যারামিটার থাকলে বেশি পরিষ্কারভাবে পড়া যায়।</p>'),

      h(2, 'এখান থেকে আপনি কোথায়', 'where-this-leaves-you'),
      p('<p>এই পাঠটি এই সাইটের বাকি সবকিছুর সাথে সংযুক্ত করে PHP অংশটি শেষ করছে: আপনার ইতিমধ্যে জানা HTML পাতাটি রেন্ডার করে, এই অংশের PHP সিদ্ধান্ত নেয় তাতে কোন ডেটা যাবে, আর <a href="/bn/sql/">SQL অংশ</a> হলো PHP একটি কোয়েরি হাতে দেওয়ার পর একটি ডেটাবেসকে যা করতে বলা যায় তার সম্পূর্ণ রেফারেন্স। এখান থেকে, ব্যবহারিক পরের ধাপ হলো একটি ছোট বাস্তব প্রজেক্ট — একটি গেস্টবুক, একটি ডেটাবেসে সংরক্ষিত একটি সাধারণ to-do তালিকা — যা এই সবকিছু একসাথে ব্যবহার করে।</p>'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'php').single()
  if (catErr || !category) {
    console.error('Category "php" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] php/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] php/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `php/${lesson.slug}`
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
