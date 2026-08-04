#!/usr/bin/env node
// New "Python" category — 28 lessons, per the outline approved with the
// site owner 2026-07-30 (docs/CONTENT-PIPELINE.md). Second of a
// three-language run (PHP done, Python here, React next). Builds on the
// existing `programming` category (variables/loops/functions aren't
// re-taught from scratch) and the existing `sql` category for the
// Python-and-Databases lesson.
//
// Unlike PHP, core Python has no web-request machinery of its own
// (superglobals, sessions) — those PHP-specific lessons are replaced here
// with genuinely Python-specific topics (list comprehensions, iterators/
// generators, modules and pip) rather than assuming any one web framework.
//
// Original content — written fresh for this site (CONTENT-PIPELINE.md §3:
// never copied from python.org, W3Schools, GeeksforGeeks, Wikipedia, etc).
// Links to the official docs (python.org) where a full reference beats
// reproducing one here, per the site owner's own instruction.
//
// Run incrementally as lessons are written — idempotent, safe to re-run;
// upserts on `path` / `doc_id,locale`.
//
// Usage: node scripts/create-python-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Block builders ──────────────────────────────────────────────────────
// Note the field name is `code`, not `source` — components/blocks/
// block-renderer.tsx and lib/types.ts's Block type both expect `code`.
// (PHP's script shipped with this wrong and crashed Shiki at build time —
// see D-61. Getting it right here from the start.)

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
    title: 'Introduction to Python',
    metaTitle: 'Introduction to Python | Learn Computer Academy',
    metaDescription: 'What Python is, why it\'s become one of the most widely used programming languages, and the kinds of things it\'s actually used for.',
    blocks: [
      p('<p><b>Python</b> is a general-purpose programming language known for reading almost like plain English. Unlike PHP, which is specifically built for the web, Python is used across a huge range of domains — the same language, and largely the same syntax, whether you\'re automating a task, analyzing data, building a website, or training a machine learning model.</p>'),

      h(2, 'Why Python Looks Different'),
      p('<p>The first thing you\'ll notice coming from PHP or JavaScript: Python has no curly braces and no semicolons. It uses <b>indentation</b> — the spacing at the start of a line — to mark where a block of code starts and ends. This isn\'t just a style choice; it\'s a real part of the language\'s syntax, and you\'ll look at it properly in the next lesson.</p>'),
      code('python', 'if 5 > 2:\n    print("Five is greater than two!")'),

      h(2, 'What Python Is Actually Used For'),
      table(
        ['Domain', 'What Python is used for there'],
        [
          ['Automation & scripting', 'Renaming files, scraping websites, automating repetitive tasks'],
          ['Data & AI', 'Data analysis, machine learning, and most AI research code'],
          ['Web development', 'Server-side web apps, typically via a framework like Django or Flask'],
          ['General software', 'Command-line tools, small utilities, glue code between other systems'],
        ]
      ),
      p('<p>This section covers <b>the language itself</b> — the part that\'s identical no matter which of these you eventually do. Frameworks and libraries for any specific domain are a natural next step once you\'re comfortable here, not something to learn at the same time as the fundamentals.</p>'),

      img(
        'docs/img/python/introduction-1',
        'Isometric diagram showing a single Python logo icon in the center, with arrows branching out to four surrounding icons representing automation, data analysis, web development, and general software',
        1024, 768,
        'The same core language, used across genuinely different kinds of work.'
      ),

      h(2, 'Interpreted, Not Compiled'),
      p('<p>Python is an <b>interpreted</b> language — you run a <code>.py</code> file directly, and Python reads and executes it line by line, rather than compiling it into a separate program first. This makes the write-and-run cycle fast, which is a big part of why Python is popular for quick scripts and experimentation.</p>'),

      callout('note', '<p>This category assumes you\'re already comfortable with general programming ideas — variables, loops, functions — from the <a href="/programming/intro/">Intro to Programming</a> section. If any of that feels shaky, it\'s worth a detour there first; this section moves straight into Python\'s own syntax.</p>', 'Coming from Intro to Programming'),

      h(2, 'A Taste of Python\'s Philosophy'),
      p('<p>Python has an unusually explicit set of design principles, half-jokingly called <b>"the Zen of Python."</b> Type this into any Python prompt and it prints all nineteen of them:</p>'),
      code('python', 'import this'),
      p('<p>Two lines from it show up constantly in real Python code and discussions: <i>"Simple is better than complex"</i> and <i>"There should be one — and preferably only one — obvious way to do it."</i> Keep an eye out for both as this section goes on; they explain a lot of Python\'s specific design choices.</p>'),

      p('<p>The next lesson gets Python actually running on your machine, so every example from here on is something you can try yourself.</p>'),
    ],
  },
  bn: {
    title: 'Python পরিচিতি',
    metaTitle: 'Python পরিচিতি | Learn Computer Academy',
    metaDescription: 'Python আসলে কী, কেন এটি সবচেয়ে বেশি ব্যবহৃত প্রোগ্রামিং ভাষাগুলোর একটি হয়ে উঠেছে, আর এটি আসলে কোন ধরনের কাজে ব্যবহৃত হয়।',
    blocks: [
      p('<p><b>Python</b> একটি জেনারেল-পারপাস প্রোগ্রামিং ভাষা, যা প্রায় সাধারণ ইংরেজির মতো পড়ার জন্য পরিচিত। PHP-এর থেকে আলাদা, যা বিশেষভাবে ওয়েবের জন্য তৈরি, Python বিস্তৃত পরিসরের ডোমেইন জুড়ে ব্যবহৃত হয় — একই ভাষা, আর বেশিরভাগ ক্ষেত্রে একই সিনট্যাক্স, তা আপনি একটি কাজ স্বয়ংক্রিয় করছেন, ডেটা বিশ্লেষণ করছেন, একটি ওয়েবসাইট বানাচ্ছেন, বা একটি মেশিন লার্নিং মডেল প্রশিক্ষণ দিচ্ছেন যাই হোক না কেন।</p>'),

      h(2, 'Python কেন আলাদা দেখতে', 'why-python-looks-different'),
      p('<p>PHP বা JavaScript থেকে আসার পর প্রথম যে জিনিসটা লক্ষ্য করবেন: Python-এ কোনো কার্লি ব্রেস আর সেমিকোলন নেই। এটি একটি কোড ব্লক কোথায় শুরু আর শেষ হচ্ছে তা চিহ্নিত করতে <b>ইনডেন্টেশন</b> — একটি লাইনের শুরুর স্পেসিং — ব্যবহার করে। এটি শুধু একটি স্টাইল পছন্দ নয়; এটি ভাষার সিনট্যাক্সের একটি আসল অংশ, আর পরের পাঠে এটি ভালোভাবে দেখবেন।</p>'),
      code('python', 'if 5 > 2:\n    print("Five is greater than two!")'),

      h(2, 'Python আসলে কীসের জন্য ব্যবহৃত হয়', 'what-python-is-actually-used-for'),
      table(
        ['ডোমেইন', 'সেখানে Python কীসের জন্য ব্যবহৃত হয়'],
        [
          ['অটোমেশন আর স্ক্রিপ্টিং', 'ফাইলের নাম বদলানো, ওয়েবসাইট স্ক্র্যাপ করা, পুনরাবৃত্তিমূলক কাজ স্বয়ংক্রিয় করা'],
          ['ডেটা আর AI', 'ডেটা বিশ্লেষণ, মেশিন লার্নিং, আর বেশিরভাগ AI গবেষণা কোড'],
          ['ওয়েব ডেভেলপমেন্ট', 'সার্ভার-সাইড ওয়েব অ্যাপ, সাধারণত Django বা Flask-এর মতো একটি ফ্রেমওয়ার্কের মাধ্যমে'],
          ['সাধারণ সফটওয়্যার', 'কমান্ড-লাইন টুল, ছোট ইউটিলিটি, অন্য সিস্টেমের মধ্যে সংযোগকারী কোড'],
        ]
      ),
      p('<p>এই অংশটি কভার করে <b>ভাষাটি নিজেই</b> — যে অংশটি আপনি শেষমেশ এদের মধ্যে যেটাই করেন না কেন একই থাকে। যেকোনো নির্দিষ্ট ডোমেইনের জন্য ফ্রেমওয়ার্ক আর লাইব্রেরি এখানে স্বাচ্ছন্দ্য পাওয়ার পর একটি স্বাভাবিক পরের ধাপ, বেসিকের সাথে একসাথে শেখার কিছু নয়।</p>'),

      img(
        'docs/img/python/introduction-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে কেন্দ্রে একটি একক Python লোগো আইকন দেখানো হয়েছে, আর তীরচিহ্ন চারপাশের চারটি আইকনের দিকে যাচ্ছে যা অটোমেশন, ডেটা বিশ্লেষণ, ওয়েব ডেভেলপমেন্ট, আর সাধারণ সফটওয়্যার বোঝায়',
        1024, 768,
        'একই মূল ভাষা, সত্যিকারভাবে ভিন্ন ধরনের কাজ জুড়ে ব্যবহৃত।'
      ),

      h(2, 'ইন্টারপ্রেটেড, কম্পাইলড নয়', 'interpreted-not-compiled'),
      p('<p>Python একটি <b>ইন্টারপ্রেটেড</b> ভাষা — আপনি সরাসরি একটি <code>.py</code> ফাইল চালান, আর Python সেটাকে আগে একটি আলাদা প্রোগ্রামে কম্পাইল না করে লাইন বাই লাইন পড়ে আর এক্সিকিউট করে। এটি লেখা-আর-চালানোর চক্রটা দ্রুত করে তোলে, যা দ্রুত স্ক্রিপ্ট আর পরীক্ষা-নিরীক্ষার জন্য Python-এর জনপ্রিয়তার একটি বড় কারণ।</p>'),

      callout('note', '<p>এই অংশটি ধরে নেয় আপনি ইতিমধ্যেই সাধারণ প্রোগ্রামিং ধারণাগুলোতে — ভ্যারিয়েবল, লুপ, ফাংশন — <a href="/bn/programming/intro/">প্রোগ্রামিং পরিচিতি</a> অংশ থেকে স্বাচ্ছন্দ্য বোধ করছেন। এর কোনোটা নিয়ে অনিশ্চিত থাকলে, আগে সেখানে একবার ঘুরে আসা ভালো; এই অংশটি সরাসরি Python-এর নিজস্ব সিনট্যাক্সে চলে যাবে।</p>', 'Intro to Programming থেকে আসছেন'),

      h(2, 'Python-এর দর্শনের একটি ঝলক', 'a-taste-of-pythons-philosophy'),
      p('<p>Python-এর একটি অস্বাভাবিকভাবে স্পষ্ট ডিজাইন নীতির সেট আছে, অর্ধেক-রসিকতা করে বলা হয় <b>"Python-এর Zen."</b> যেকোনো Python প্রম্পটে এটি টাইপ করলে এর সবগুলো ঊনিশটি নীতি প্রিন্ট হয়:</p>'),
      code('python', 'import this'),
      p('<p>এর থেকে দুটো লাইন বাস্তব Python কোড আর আলোচনায় ক্রমাগত দেখা যায়: <i>"Simple is better than complex"</i> (সরল জটিলের চেয়ে ভালো) আর <i>"There should be one — and preferably only one — obvious way to do it"</i> (এটা করার একটি — আর বিশেষত শুধু একটি — স্পষ্ট উপায় থাকা উচিত)। এই অংশ যত এগোবে দুটোর দিকেই নজর রাখুন; এগুলো Python-এর অনেক নির্দিষ্ট ডিজাইন পছন্দ ব্যাখ্যা করে।</p>'),

      p('<p>পরের পাঠে আপনার নিজের মেশিনে Python আসলেই চালু করা হবে, যাতে এখান থেকে প্রতিটি উদাহরণ আপনি নিজে চেষ্টা করে দেখতে পারেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'setup',
  sortOrder: 2,
  en: {
    title: 'Setting Up Python',
    metaTitle: 'Setting Up Python | Learn Computer Academy',
    metaDescription: 'Installing Python, using the interactive REPL, and running your first Python script.',
    blocks: [
      p('<p>Getting Python running is simpler than PHP — no separate development server is needed, since Python isn\'t inherently a web technology. You just install it and run files directly.</p>'),

      h(2, 'Installing Python'),
      p('<p>Download Python from <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer">python.org/downloads</a> (Windows/macOS), or install it through your system\'s package manager on Linux (<code>apt install python3</code> on most distributions). Once installed, confirm it from a terminal:</p>'),
      code('bash', 'python3 --version'),
      callout('note', '<p>On Windows, the command is often just <code>python</code> rather than <code>python3</code>. Either way, confirm you\'re running Python 3 — Python 2 reached end of life in 2020 and none of this section applies to it.</p>', 'python vs. python3'),

      h(2, 'The Interactive REPL'),
      p('<p>Typing <code>python3</code> alone (no filename) opens an interactive prompt where you can try code one line at a time and see the result immediately — extremely useful for quickly testing an idea:</p>'),
      code('bash', '$ python3\n>>> 2 + 2\n4\n>>> print("Hello!")\nHello!\n>>> exit()'),

      h(2, 'Your First Script'),
      p('<p>Create a file named <code>hello.py</code>:</p>'),
      code('python', 'print("Hello, world!")'),
      p('<p>Then run it from a terminal in the same folder:</p>'),
      code('bash', 'python3 hello.py'),
      p('<p>Unlike PHP, there\'s no special opening tag needed — a <code>.py</code> file is Python from the very first line.</p>'),

      h(2, 'Checking pip Is Installed Too'),
      p('<p><b>pip</b> — Python\'s package installer, covered properly in the Modules and Imports lesson — ships with Python 3.4 and later, so it\'s almost always already there. Confirm it the same way:</p>'),
      code('bash', 'pip3 --version'),
      p('<p>If that command isn\'t found, reinstalling Python from python.org (making sure the "Add to PATH" / "install pip" option is checked during setup) fixes it on nearly every system.</p>'),

      callout('tip', '<p>Most real Python development happens in a code editor with Python support (VS Code\'s Python extension is the most common choice) rather than a plain text editor — it catches obvious mistakes as you type instead of only when you run the file.</p>', 'A proper editor helps early'),
    ],
  },
  bn: {
    title: 'Python সেটআপ করা',
    metaTitle: 'Python সেটআপ করা | Learn Computer Academy',
    metaDescription: 'Python ইনস্টল করা, ইন্টারঅ্যাক্টিভ REPL ব্যবহার করা, আর আপনার প্রথম Python স্ক্রিপ্ট চালানো।',
    blocks: [
      p('<p>Python চালু করা PHP-এর চেয়ে সহজ — কোনো আলাদা ডেভেলপমেন্ট সার্ভারের দরকার নেই, কারণ Python মূলত একটি ওয়েব প্রযুক্তি নয়। আপনি শুধু এটি ইনস্টল করেন আর সরাসরি ফাইল চালান।</p>'),

      h(2, 'Python ইনস্টল করা', 'installing-python'),
      p('<p><a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer">python.org/downloads</a> থেকে Python ডাউনলোড করুন (Windows/macOS), অথবা Linux-এ নিজের সিস্টেমের প্যাকেজ ম্যানেজার দিয়ে ইনস্টল করুন (বেশিরভাগ ডিস্ট্রিবিউশনে <code>apt install python3</code>)। ইনস্টল হয়ে গেলে, টার্মিনাল থেকে নিশ্চিত হয়ে নিন:</p>'),
      code('bash', 'python3 --version'),
      callout('note', '<p>Windows-এ, কমান্ডটি প্রায়ই <code>python3</code>-এর বদলে শুধু <code>python</code>। যেভাবেই হোক, নিশ্চিত করুন আপনি Python 3 চালাচ্ছেন — Python 2-এর end of life 2020 সালে হয়ে গেছে আর এই অংশের কিছুই এতে প্রযোজ্য নয়।</p>', 'python বনাম python3'),

      h(2, 'ইন্টারঅ্যাক্টিভ REPL', 'the-interactive-repl'),
      p('<p>শুধু <code>python3</code> টাইপ করলে (কোনো ফাইলনেম ছাড়া) একটি ইন্টারঅ্যাক্টিভ প্রম্পট খোলে যেখানে আপনি একবারে একটি লাইন কোড চেষ্টা করে সাথে সাথে ফলাফল দেখতে পারেন — একটি ধারণা দ্রুত পরীক্ষা করার জন্য অত্যন্ত দরকারি:</p>'),
      code('bash', '$ python3\n>>> 2 + 2\n4\n>>> print("Hello!")\nHello!\n>>> exit()'),

      h(2, 'আপনার প্রথম স্ক্রিপ্ট', 'your-first-script'),
      p('<p><code>hello.py</code> নামে একটি ফাইল তৈরি করুন:</p>'),
      code('python', 'print("Hello, world!")'),
      p('<p>এরপর একই ফোল্ডার থেকে টার্মিনালে এটি চালান:</p>'),
      code('bash', 'python3 hello.py'),
      p('<p>PHP-এর থেকে আলাদা, কোনো বিশেষ ওপেনিং ট্যাগের দরকার নেই — একটি <code>.py</code> ফাইল প্রথম লাইন থেকেই Python।</p>'),

      h(2, 'pip-ও ইনস্টল আছে কিনা চেক করা', 'checking-pip-is-installed-too'),
      p('<p><b>pip</b> — Python-এর প্যাকেজ ইনস্টলার, Modules and Imports পাঠে ভালোভাবে দেখানো হবে — Python 3.4 আর তার পরের ভার্সনের সাথেই আসে, তাই এটি প্রায় সবসময় আগে থেকেই থাকে। একইভাবে নিশ্চিত করুন:</p>'),
      code('bash', 'pip3 --version'),
      p('<p>কমান্ডটি না পাওয়া গেলে, python.org থেকে Python পুনরায় ইনস্টল করলে (সেটআপের সময় "Add to PATH" / "install pip" অপশনটি চেক করা আছে তা নিশ্চিত করে) প্রায় প্রতিটি সিস্টেমে এটি ঠিক হয়ে যায়।</p>'),

      callout('tip', '<p>বেশিরভাগ বাস্তব Python ডেভেলপমেন্ট একটি সাধারণ টেক্সট এডিটরের বদলে Python সাপোর্টসহ একটি কোড এডিটরে হয় (VS Code-এর Python এক্সটেনশন সবচেয়ে সাধারণ পছন্দ) — এটি ফাইল চালানোর সময়ের বদলে টাইপ করার সময়েই সুস্পষ্ট ভুল ধরে ফেলে।</p>', 'একটি ঠিকঠাক এডিটর শুরুতেই সাহায্য করে'),
    ],
  },
})

lessons.push({
  slug: 'syntax-basics',
  sortOrder: 3,
  en: {
    title: 'Python Syntax Basics',
    metaTitle: 'Python Syntax Basics | Learn Computer Academy',
    metaDescription: 'Python\'s indentation-based syntax, comments, and print() — the ground rules before writing anything more complex.',
    blocks: [
      p('<p>Python\'s syntax is unusually minimal, and almost all of that comes from one decision: using indentation instead of braces.</p>'),

      h(2, 'Indentation Defines Blocks'),
      p('<p>In PHP or JavaScript, <code>{ }</code> marks where a block of code starts and ends. Python uses indentation — consistent spacing at the start of a line — for the exact same purpose:</p>'),
      code('python', 'if 5 > 2:\n    print("Five is greater than two!")\n    print("This line is part of the if too.")\nprint("This line is not — it lines up with if, not the code inside it.")'),
      callout('warning', '<p>Mixing tabs and spaces, or using inconsistent indentation width, causes an <code>IndentationError</code> — this isn\'t a style suggestion, it\'s enforced by the language. The standard convention is <b>4 spaces</b> per indentation level; most editors can be configured to insert 4 spaces automatically when you press Tab.</p>', 'Indentation is enforced, not optional'),

      h(2, 'No Semicolons Required'),
      p('<p>A Python statement normally ends at the end of the line — no semicolon needed. You <i>can</i> put a semicolon between two statements to fit them on one line, but it\'s rarely done in real code:</p>'),
      code('python', 'x = 5\ny = 10\nprint(x + y)  # normal style — one statement per line'),

      h(2, 'Comments'),
      p('<p>Python has one comment style, <code>#</code>, for single-line comments. Multi-line comments aren\'t a dedicated feature, though a triple-quoted string not assigned to anything is commonly used the same way:</p>'),
      code('python', '# This is a single-line comment\n\n"""\nThis is often used as a multi-line comment,\neven though it\'s technically just an unused string.\n"""'),

      h(2, 'print()'),
      p('<p><code>print()</code> is Python\'s equivalent of PHP\'s <code>echo</code> — the standard way to output text. Unlike <code>echo</code>, it\'s a real function, always called with parentheses:</p>'),
      code('python', 'print("Hello, world!")\nprint("Multiple", "values", "get", "joined", "with spaces")'),

      h(2, 'Splitting a Long Line'),
      p('<p>A line inside unclosed parentheses, brackets, or braces can continue onto the next line with no extra syntax — this is the normal way to keep a long function call or collection readable:</p>'),
      code('python', 'total = (\n    1 + 2 + 3\n    + 4 + 5\n)\n\nnames = [\n    "Priya",\n    "Amit",\n    "Sara",\n]'),
      p('<p>A backslash (<code>\\</code>) at the end of a line does the same thing outside of brackets, but it\'s rarely used in real code — restructuring the line to use parentheses instead is almost always considered cleaner.</p>'),

      p('<p>With the ground rules out of the way, the next lesson looks at how Python stores data — starting with variables.</p>'),
    ],
  },
  bn: {
    title: 'Python সিনট্যাক্স বেসিক্স',
    metaTitle: 'Python সিনট্যাক্স বেসিক্স | Learn Computer Academy',
    metaDescription: 'Python-এর ইনডেন্টেশন-ভিত্তিক সিনট্যাক্স, কমেন্ট, আর print() — আরও জটিল কিছু লেখার আগে মূল নিয়ম।',
    blocks: [
      p('<p>Python-এর সিনট্যাক্স অস্বাভাবিকভাবে সংক্ষিপ্ত, আর প্রায় সবটাই আসে একটি সিদ্ধান্ত থেকে: ব্রেসের বদলে ইনডেন্টেশন ব্যবহার করা।</p>'),

      h(2, 'ইনডেন্টেশন ব্লক নির্ধারণ করে', 'indentation-defines-blocks'),
      p('<p>PHP বা JavaScript-এ, <code>{ }</code> একটি কোড ব্লক কোথায় শুরু আর শেষ হচ্ছে তা চিহ্নিত করে। Python ঠিক একই উদ্দেশ্যে ইনডেন্টেশন — একটি লাইনের শুরুর সামঞ্জস্যপূর্ণ স্পেসিং — ব্যবহার করে:</p>'),
      code('python', 'if 5 > 2:\n    print("Five is greater than two!")\n    print("This line is part of the if too.")\nprint("This line is not — it lines up with if, not the code inside it.")'),
      callout('warning', '<p>ট্যাব আর স্পেস মিশিয়ে ফেললে, বা অসামঞ্জস্যপূর্ণ ইনডেন্টেশন প্রস্থ ব্যবহার করলে একটি <code>IndentationError</code> হয় — এটি কোনো স্টাইল পরামর্শ নয়, ভাষা এটি প্রয়োগ করে। প্রচলিত নিয়ম হলো প্রতি ইনডেন্টেশন লেভেলে <b>4 স্পেস</b>; বেশিরভাগ এডিটর Tab চাপলে স্বয়ংক্রিয়ভাবে 4 স্পেস বসাতে কনফিগার করা যায়।</p>', 'ইনডেন্টেশন প্রয়োগ করা হয়, ঐচ্ছিক নয়'),

      h(2, 'কোনো সেমিকোলন প্রয়োজন নেই', 'no-semicolons-required'),
      p('<p>একটি Python স্টেটমেন্ট সাধারণত লাইনের শেষে শেষ হয় — কোনো সেমিকোলন প্রয়োজন নেই। আপনি <i>পারেন</i> দুটো স্টেটমেন্টের মাঝে একটি সেমিকোলন বসিয়ে সেগুলো একই লাইনে ফিট করতে, কিন্তু বাস্তব কোডে এটি কমই করা হয়:</p>'),
      code('python', 'x = 5\ny = 10\nprint(x + y)  # normal style — one statement per line'),

      h(2, 'কমেন্ট', 'comments'),
      p('<p>Python-এর একটি কমেন্ট স্টাইল আছে, <code>#</code>, একক-লাইন কমেন্টের জন্য। মাল্টি-লাইন কমেন্ট একটি আলাদা ফিচার নয়, যদিও কোনো কিছুতে assign না করা একটি ট্রিপল-কোটেড স্ট্রিং সাধারণত একই কাজে ব্যবহৃত হয়:</p>'),
      code('python', '# This is a single-line comment\n\n"""\nThis is often used as a multi-line comment,\neven though it\'s technically just an unused string.\n"""'),

      h(2, 'print()', 'print'),
      p('<p><code>print()</code> হলো PHP-এর <code>echo</code>-এর সমতুল্য — টেক্সট আউটপুট করার প্রচলিত উপায়। <code>echo</code>-এর থেকে আলাদা, এটি একটি প্রকৃত ফাংশন, সবসময় বন্ধনী দিয়ে কল করা হয়:</p>'),
      code('python', 'print("Hello, world!")\nprint("Multiple", "values", "get", "joined", "with spaces")'),

      h(2, 'একটি লম্বা লাইন ভাগ করা', 'splitting-a-long-line'),
      p('<p>বন্ধনী, ব্র্যাকেট, বা ব্রেসের ভেতরে না-বন্ধ হওয়া একটি লাইন কোনো অতিরিক্ত সিনট্যাক্স ছাড়াই পরের লাইনে চলতে পারে — একটি লম্বা ফাংশন কল বা কালেকশনকে পঠনযোগ্য রাখার এটাই প্রচলিত উপায়:</p>'),
      code('python', 'total = (\n    1 + 2 + 3\n    + 4 + 5\n)\n\nnames = [\n    "Priya",\n    "Amit",\n    "Sara",\n]'),
      p('<p>একটি লাইনের শেষে একটি ব্যাকস্ল্যাশ (<code>\\</code>) ব্র্যাকেটের বাইরে একই কাজ করে, কিন্তু বাস্তব কোডে এটি কমই ব্যবহৃত হয় — বন্ধনী ব্যবহার করে লাইনটি পুনর্গঠন করা প্রায় সবসময় বেশি পরিষ্কার মনে করা হয়।</p>'),

      p('<p>মূল নিয়মগুলো জানা হয়ে যাওয়ার পর, পরের পাঠে দেখা হবে Python কীভাবে ডেটা সংরক্ষণ করে — শুরু হবে ভ্যারিয়েবল দিয়ে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'variables',
  sortOrder: 4,
  en: {
    title: 'Variables in Python',
    metaTitle: 'Variables in Python | Learn Computer Academy',
    metaDescription: 'How Python variables work — dynamic typing, naming rules, and the UPPER_CASE convention for values that shouldn\'t change.',
    blocks: [
      p('<p>A Python variable stores a value you can use and change later — the same idea from <a href="/programming/variables/">Intro to Programming</a>, with Python\'s own syntax, which is about as minimal as it gets.</p>'),

      h(2, 'Creating a Variable'),
      p('<p>No <code>$</code> sigil, no keyword — just a name and a value:</p>'),
      code('python', 'name = "Amit"\nage = 21\nprint(f"{name} is {age} years old.")'),
      p('<p>The <code>f</code> before the string in <code>f"{name} is {age}..."</code> is an <b>f-string</b> — Python\'s way of embedding variables directly in a string, similar to PHP\'s double-quote interpolation. You\'ll look at f-strings properly in the Strings lesson.</p>'),

      h(2, 'Naming Rules'),
      table(
        ['Rule', 'Example'],
        [
          ['Must start with a letter or underscore (never a number)', '_id — valid, 1id — invalid'],
          ['Can contain letters, numbers, and underscores after that', 'user_2 — valid'],
          ['No spaces or hyphens allowed', 'user name — invalid'],
          ['Case-sensitive', 'Name and name are different variables'],
          ['Convention: snake_case, all lowercase', 'first_name, not firstName'],
        ]
      ),
      callout('note', '<p><code>snake_case</code> (lowercase words joined by underscores) is the standard Python naming convention for variables and functions — this is different from PHP\'s common <code>camelCase</code> style, and from JavaScript\'s. It\'s a convention, not a rule the language enforces, but real Python code follows it consistently.</p>', 'snake_case, not camelCase'),

      h(2, 'Python Is Dynamically Typed'),
      p('<p>Just like PHP, you never declare a variable\'s type — Python figures it out from the value, and a variable can hold a different type later:</p>'),
      code('python', 'value = 10       # an integer\nvalue = "ten"    # now a string — perfectly legal'),

      h(2, 'Constants, by Convention Only'),
      p('<p>Python has no <code>const</code> keyword or <code>define()</code> the way PHP does — there\'s no way to make a variable truly unchangeable. Instead, the convention is to name a value that shouldn\'t be changed in <code>UPPER_SNAKE_CASE</code>, as a signal to anyone reading the code:</p>'),
      code('python', 'MAX_UPLOAD_SIZE = 5242880  # 5 MB — nothing stops this from being reassigned,\n                            # but the ALL_CAPS name says "please don\'t"'),

      h(2, 'Assigning Several Variables at Once'),
      p('<p>Python can assign multiple variables in a single line, which has no direct PHP equivalent:</p>'),
      code('python', 'x, y, z = 1, 2, 3\nprint(x, y, z)  # 1 2 3\n\n# Same value to several names at once:\na = b = c = 0\nprint(a, b, c)  # 0 0 0'),
      p('<p>This also produces Python\'s well-known one-line variable swap, with no temporary third variable needed:</p>'),
      code('python', 'a = 1\nb = 2\na, b = b, a\nprint(a, b)  # 2 1'),
    ],
  },
  bn: {
    title: 'Python-তে ভ্যারিয়েবল',
    metaTitle: 'Python-তে ভ্যারিয়েবল | Learn Computer Academy',
    metaDescription: 'Python ভ্যারিয়েবল কীভাবে কাজ করে — ডাইনামিক টাইপিং, নামকরণের নিয়ম, আর যে মান বদলানো উচিত নয় তার জন্য UPPER_CASE প্রথা।',
    blocks: [
      p('<p>একটি Python ভ্যারিয়েবল এমন একটি মান সংরক্ষণ করে যা আপনি পরে ব্যবহার করতে বা বদলাতে পারেন — <a href="/bn/programming/variables/">প্রোগ্রামিং পরিচিতি</a>-তে শেখা একই ধারণা, Python-এর নিজস্ব সিনট্যাক্সে, যা প্রায় যতটা সংক্ষিপ্ত হওয়া সম্ভব ততটাই সংক্ষিপ্ত।</p>'),

      h(2, 'একটি ভ্যারিয়েবল তৈরি করা', 'creating-a-variable'),
      p('<p>কোনো <code>$</code> সিজিল নেই, কোনো কীওয়ার্ড নেই — শুধু একটি নাম আর একটি মান:</p>'),
      code('python', 'name = "Amit"\nage = 21\nprint(f"{name} is {age} years old.")'),
      p('<p><code>f"{name} is {age}..."</code>-এ স্ট্রিংয়ের আগের <code>f</code> হলো একটি <b>f-string</b> — সরাসরি একটি স্ট্রিংয়ে ভ্যারিয়েবল বসানোর Python-এর উপায়, PHP-এর ডাবল-কোট ইন্টারপোলেশনের মতো। Strings পাঠে আপনি f-string ভালোভাবে দেখবেন।</p>'),

      h(2, 'নামকরণের নিয়ম', 'naming-rules'),
      table(
        ['নিয়ম', 'উদাহরণ'],
        [
          ['একটি অক্ষর বা আন্ডারস্কোর দিয়ে শুরু হতে হবে (কখনো সংখ্যা দিয়ে নয়)', '_id — বৈধ, 1id — অবৈধ'],
          ['এরপর অক্ষর, সংখ্যা, আর আন্ডারস্কোর থাকতে পারে', 'user_2 — বৈধ'],
          ['স্পেস বা হাইফেন অনুমোদিত নয়', 'user name — অবৈধ'],
          ['কেস-সেনসিটিভ', 'Name আর name আলাদা ভ্যারিয়েবল'],
          ['প্রথা: snake_case, সব lowercase', 'first_name, firstName নয়'],
        ]
      ),
      callout('note', '<p><code>snake_case</code> (আন্ডারস্কোর দিয়ে জোড়া লাগানো lowercase শব্দ) ভ্যারিয়েবল আর ফাংশনের জন্য প্রচলিত Python নামকরণ নিয়ম — এটি PHP-এর সাধারণ <code>camelCase</code> স্টাইল, আর JavaScript-এর থেকে আলাদা। এটি একটি প্রথা, ভাষা প্রয়োগ করা কোনো নিয়ম নয়, কিন্তু বাস্তব Python কোড এটি সামঞ্জস্যপূর্ণভাবে মেনে চলে।</p>', 'snake_case, camelCase নয়'),

      h(2, 'Python ডাইনামিক্যালি টাইপড', 'python-is-dynamically-typed'),
      p('<p>ঠিক PHP-এর মতো, আপনি কখনো একটি ভ্যারিয়েবলের টাইপ ঘোষণা করেন না — Python মান থেকে এটি বুঝে নেয়, আর একটি ভ্যারিয়েবল পরে ভিন্ন একটি টাইপও ধারণ করতে পারে:</p>'),
      code('python', 'value = 10       # an integer\nvalue = "ten"    # now a string — perfectly legal'),

      h(2, 'কনস্ট্যান্ট, শুধু প্রথা হিসেবে', 'constants-by-convention-only'),
      p('<p>PHP-এর মতো Python-এ কোনো <code>const</code> কীওয়ার্ড বা <code>define()</code> নেই — একটি ভ্যারিয়েবলকে সত্যিকারভাবে অপরিবর্তনীয় করার কোনো উপায় নেই। এর বদলে, প্রথা হলো এমন একটি মানকে যা বদলানো উচিত নয় তাকে <code>UPPER_SNAKE_CASE</code>-এ নামকরণ করা, কোড পড়া যে কাউকে একটি সংকেত হিসেবে:</p>'),
      code('python', 'MAX_UPLOAD_SIZE = 5242880  # 5 MB — nothing stops this from being reassigned,\n                            # but the ALL_CAPS name says "please don\'t"'),

      h(2, 'একসাথে একাধিক ভ্যারিয়েবল Assign করা', 'assigning-several-variables-at-once'),
      p('<p>Python একটি একক লাইনে একাধিক ভ্যারিয়েবল assign করতে পারে, যার PHP-তে কোনো সরাসরি সমতুল্য নেই:</p>'),
      code('python', 'x, y, z = 1, 2, 3\nprint(x, y, z)  # 1 2 3\n\n# Same value to several names at once:\na = b = c = 0\nprint(a, b, c)  # 0 0 0'),
      p('<p>এটি Python-এর সুপরিচিত এক-লাইনের ভ্যারিয়েবল swap-ও তৈরি করে, কোনো অস্থায়ী তৃতীয় ভ্যারিয়েবল ছাড়াই:</p>'),
      code('python', 'a = 1\nb = 2\na, b = b, a\nprint(a, b)  # 2 1'),
    ],
  },
})

lessons.push({
  slug: 'data-types',
  sortOrder: 5,
  en: {
    title: 'Data Types',
    metaTitle: 'Python Data Types | Learn Computer Academy',
    metaDescription: 'Python\'s core built-in data types — str, int, float, bool, None — and a first look at its built-in collections.',
    blocks: [
      p('<p>Python has several built-in data types. This lesson covers the simple ones in depth; the collection types (<code>list</code>, <code>tuple</code>, <code>dict</code>, <code>set</code>) get their own dedicated lessons shortly, since each has enough to it to deserve one.</p>'),

      h(2, 'The Simple Types'),
      table(
        ['Type', 'Holds', 'Example'],
        [
          ['str', 'Text', '"Hello"'],
          ['int', 'Whole numbers', '42'],
          ['float', 'Decimal numbers', '3.14'],
          ['bool', 'True or False', 'True'],
          ['NoneType', 'No value at all', 'None'],
        ]
      ),
      callout('note', '<p><code>True</code>, <code>False</code>, and <code>None</code> are capitalized in Python — unlike PHP\'s lowercase <code>true</code>/<code>false</code>/<code>null</code>, or JavaScript\'s. This trips up almost everyone coming from another language at least once.</p>', 'Capitalization matters here'),

      h(2, 'Checking a Value\'s Type'),
      code('python', 'x = 42\nprint(type(x))          # <class \'int\'>\nprint(isinstance(x, int)) # True'),

      h(2, 'The Collection Types, at a Glance'),
      table(
        ['Type', 'Ordered?', 'Changeable?', 'Duplicates allowed?'],
        [
          ['list', 'Yes', 'Yes', 'Yes'],
          ['tuple', 'Yes', 'No', 'Yes'],
          ['dict', 'Yes (insertion order)', 'Yes', 'Keys must be unique'],
          ['set', 'No', 'Yes', 'No'],
        ]
      ),
      p('<p>Each of these gets its own lesson soon. For now, the key thing to notice is that Python has four distinct built-in collection types with genuinely different rules — PHP, by contrast, uses one flexible <code>array</code> type for most of these jobs.</p>'),

      h(2, 'Python Doesn\'t Auto-Convert Types'),
      p('<p>This is a real, important difference from PHP\'s type juggling: Python raises an error rather than silently guessing when types don\'t match:</p>'),
      code('python', 'result = "5" + 3\n# TypeError: can only concatenate str (not "int") to str'),
      p('<p>The next lesson, Type Conversion, covers converting between types deliberately — which is required here, not optional the way it often is in PHP.</p>'),

      callout('note', '<p><code>None</code>, <code>False</code>, and <code>0</code> are three different values, even though all three are falsy in an <code>if</code> check. <code>None</code> means "no value was ever set," <code>False</code> means "a boolean, specifically false," and <code>0</code> means "the number zero." Mixing them up — for example, using <code>0</code> as a placeholder for "not set yet" — makes bugs harder to track down later, since <code>0</code> is a perfectly valid, meaningful number in a lot of code.</p>', 'None, False, and 0 are not the same thing'),
    ],
  },
  bn: {
    title: 'ডেটা টাইপ',
    metaTitle: 'Python ডেটা টাইপ | Learn Computer Academy',
    metaDescription: 'Python-এর মূল বিল্ট-ইন ডেটা টাইপ — str, int, float, bool, None — আর এর বিল্ট-ইন কালেকশনের একটি প্রথম নজর।',
    blocks: [
      p('<p>Python-এ বেশ কিছু বিল্ট-ইন ডেটা টাইপ আছে। এই পাঠে সহজগুলো বিস্তারিতভাবে দেখানো হবে; কালেকশন টাইপগুলো (<code>list</code>, <code>tuple</code>, <code>dict</code>, <code>set</code>) শীঘ্রই নিজেদের আলাদা পাঠ পাবে, কারণ প্রতিটির নিজস্ব একটি পাঠ পাওয়ার মতো যথেষ্ট বিষয় আছে।</p>'),

      h(2, 'সহজ টাইপগুলো', 'the-simple-types'),
      table(
        ['টাইপ', 'কী ধরে রাখে', 'উদাহরণ'],
        [
          ['str', 'টেক্সট', '"Hello"'],
          ['int', 'পূর্ণ সংখ্যা', '42'],
          ['float', 'দশমিক সংখ্যা', '3.14'],
          ['bool', 'True বা False', 'True'],
          ['NoneType', 'একেবারেই কোনো মান নেই', 'None'],
        ]
      ),
      callout('note', '<p>Python-এ <code>True</code>, <code>False</code>, আর <code>None</code>-এর প্রথম অক্ষর বড় হাতের — PHP-এর lowercase <code>true</code>/<code>false</code>/<code>null</code>, বা JavaScript-এর থেকে আলাদা। অন্য ভাষা থেকে আসা প্রায় প্রত্যেককে এটি অন্তত একবার হোঁচট খাওয়ায়।</p>', 'এখানে ক্যাপিটালাইজেশন গুরুত্বপূর্ণ'),

      h(2, 'একটি মানের টাইপ চেক করা', 'checking-a-values-type'),
      code('python', 'x = 42\nprint(type(x))          # <class \'int\'>\nprint(isinstance(x, int)) # True'),

      h(2, 'কালেকশন টাইপ, এক নজরে', 'the-collection-types-at-a-glance'),
      table(
        ['টাইপ', 'ক্রমানুসারে সাজানো?', 'পরিবর্তনযোগ্য?', 'ডুপ্লিকেট অনুমোদিত?'],
        [
          ['list', 'হ্যাঁ', 'হ্যাঁ', 'হ্যাঁ'],
          ['tuple', 'হ্যাঁ', 'না', 'হ্যাঁ'],
          ['dict', 'হ্যাঁ (insertion order)', 'হ্যাঁ', 'Key অবশ্যই ইউনিক হতে হবে'],
          ['set', 'না', 'হ্যাঁ', 'না'],
        ]
      ),
      p('<p>এদের প্রতিটি শীঘ্রই নিজের পাঠ পাবে। এখনকার জন্য, লক্ষ্য করার মূল বিষয়টি হলো Python-এ সত্যিকারভাবে ভিন্ন নিয়মের চারটি আলাদা বিল্ট-ইন কালেকশন টাইপ আছে — বিপরীতে, PHP এই কাজগুলোর বেশিরভাগের জন্য একটি নমনীয় <code>array</code> টাইপ ব্যবহার করে।</p>'),

      h(2, 'Python স্বয়ংক্রিয়ভাবে টাইপ রূপান্তর করে না', 'python-doesnt-auto-convert-types'),
      p('<p>PHP-এর টাইপ জাগলিং থেকে এটি একটি আসল, গুরুত্বপূর্ণ পার্থক্য: টাইপ না মিললে Python চুপচাপ অনুমান করার বদলে একটি এরর তোলে:</p>'),
      code('python', 'result = "5" + 3\n# TypeError: can only concatenate str (not "int") to str'),
      p('<p>পরের পাঠ, Type Conversion, ইচ্ছাকৃতভাবে টাইপের মধ্যে রূপান্তর করা দেখাবে — যা এখানে বাধ্যতামূলক, PHP-তে প্রায়ই যেমন ঐচ্ছিক তেমন নয়।</p>'),

      callout('note', '<p><code>None</code>, <code>False</code>, আর <code>0</code> তিনটি ভিন্ন মান, যদিও একটি <code>if</code> চেকে তিনটিই falsy। <code>None</code> মানে "কোনো মান কখনো সেট করা হয়নি," <code>False</code> মানে "একটি বুলিয়ান, নির্দিষ্টভাবে false," আর <code>0</code> মানে "সংখ্যা শূন্য।" এদের গুলিয়ে ফেলা — উদাহরণস্বরূপ, "এখনও সেট করা হয়নি"-র জন্য <code>0</code>-কে একটি placeholder হিসেবে ব্যবহার করা — পরে বাগ খুঁজে বের করা কঠিন করে তোলে, কারণ অনেক কোডে <code>0</code> একটি সম্পূর্ণ বৈধ, অর্থবহ সংখ্যা।</p>', 'None, False, আর 0 একই জিনিস নয়'),
    ],
  },
})

lessons.push({
  slug: 'type-conversion',
  sortOrder: 6,
  en: {
    title: 'Type Conversion',
    metaTitle: 'Python Type Conversion | Learn Computer Academy',
    metaDescription: 'Converting values between types in Python with int(), str(), float(), and bool() — required, since Python won\'t do it automatically.',
    blocks: [
      p('<p>Since Python doesn\'t auto-convert types the way PHP does, converting between them deliberately is something you\'ll do constantly — especially when reading text input that needs to become a number.</p>'),

      h(2, 'The Conversion Functions'),
      code('python', 'age_text = "21"\nage = int(age_text)      # 21, as an actual int\nprice = float("19.99")   # 19.99\ntext = str(42)            # "42"\nflag = bool(1)            # True'),

      h(2, 'A Common Real Pattern'),
      p('<p>Anything typed by a user — via <code>input()</code>, a form, a file — arrives as a string, even if it looks like a number. Converting it is not optional if you want to do math with it:</p>'),
      code('python', 'age_text = input("How old are you? ")\nage = int(age_text)\nprint(f"Next year you\'ll be {age + 1}.")'),
      callout('warning', '<p><code>int("21 years")</code> raises a <code>ValueError</code> — unlike PHP\'s <code>intval()</code>, which quietly reads the leading digits and ignores the rest, Python\'s <code>int()</code> demands the entire string be a valid number. Wrap conversions of untrusted input in <code>try</code>/<code>except</code> (covered in the Exception Handling lesson) rather than assuming they\'ll succeed.</p>', 'int() is strict, not forgiving'),

      h(2, 'Truthy and Falsy Values'),
      p('<p>Casting anything to <code>bool</code> follows a specific set of rules, which Python applies inside every <code>if</code> statement too:</p>'),
      table(
        ['Value', 'Casts to bool as'],
        [
          ['0, 0.0', 'False'],
          ['"" (empty string)', 'False'],
          ['[], (), {}, set() — any empty collection', 'False'],
          ['None', 'False'],
          ['Any other number or non-empty value', 'True'],
        ]
      ),
      p('<p>This table has the same shape as PHP\'s, with one difference worth flagging: in Python, the string <code>"0"</code> is <b>truthy</b> — it\'s a non-empty string, full stop, with no special-casing for what it contains. There\'s no "0" vs "0.0" trap here the way there was in PHP.</p>'),

      h(2, 'Converting Between Collections'),
      p('<p>The same <code>int()</code>/<code>str()</code> pattern works for collection types too — <code>list()</code>, <code>tuple()</code>, <code>set()</code>, and <code>dict()</code> each build one collection type from another:</p>'),
      code('python', 'numbers = [1, 2, 2, 3]\nunique = set(numbers)      # {1, 2, 3} — a set, so duplicates disappear\nback_to_list = list(unique) # a list again, order not guaranteed to match the original'),
      p('<p>Converting to a set and back is a fast, common trick for removing duplicates from a list.</p>'),
    ],
  },
  bn: {
    title: 'টাইপ কনভার্সন',
    metaTitle: 'Python টাইপ কনভার্সন | Learn Computer Academy',
    metaDescription: 'int(), str(), float(), আর bool() দিয়ে Python-এ মানকে এক টাইপ থেকে আরেকটিতে রূপান্তর করা — বাধ্যতামূলক, কারণ Python স্বয়ংক্রিয়ভাবে এটা করবে না।',
    blocks: [
      p('<p>Python যেহেতু PHP-এর মতো স্বয়ংক্রিয়ভাবে টাইপ রূপান্তর করে না, ইচ্ছাকৃতভাবে এদের মধ্যে রূপান্তর করা এমন কিছু যা আপনি ক্রমাগত করবেন — বিশেষ করে যখন টেক্সট ইনপুট পড়েন যা একটি সংখ্যা হয়ে উঠতে হবে।</p>'),

      h(2, 'রূপান্তর ফাংশন', 'the-conversion-functions'),
      code('python', 'age_text = "21"\nage = int(age_text)      # 21, as an actual int\nprice = float("19.99")   # 19.99\ntext = str(42)            # "42"\nflag = bool(1)            # True'),

      h(2, 'একটি সাধারণ বাস্তব প্যাটার্ন', 'a-common-real-pattern'),
      p('<p>একজন ব্যবহারকারী দ্বারা টাইপ করা যেকোনো কিছু — <code>input()</code>, একটি ফর্ম, একটি ফাইলের মাধ্যমে — একটি স্ট্রিং হিসেবে আসে, দেখতে একটি সংখ্যার মতো হলেও। এটি দিয়ে অঙ্ক করতে চাইলে এটি রূপান্তর করা ঐচ্ছিক নয়:</p>'),
      code('python', 'age_text = input("How old are you? ")\nage = int(age_text)\nprint(f"Next year you\'ll be {age + 1}.")'),
      callout('warning', '<p><code>int("21 years")</code> একটি <code>ValueError</code> তোলে — PHP-এর <code>intval()</code>-এর থেকে আলাদা, যা চুপচাপ শুরুর সংখ্যাগুলো পড়ে বাকিটা উপেক্ষা করে, Python-এর <code>int()</code> পুরো স্ট্রিংটাই একটি বৈধ সংখ্যা হওয়া দাবি করে। অবিশ্বস্ত ইনপুটের রূপান্তরকে <code>try</code>/<code>except</code>-এ মুড়ে দিন (Exception Handling পাঠে দেখানো হয়েছে), সফল হবে ধরে না নিয়ে।</p>', 'int() কঠোর, ক্ষমাশীল নয়'),

      h(2, 'Truthy আর Falsy মান', 'truthy-and-falsy-values'),
      p('<p>যেকোনো কিছুকে <code>bool</code>-এ কাস্ট করা একটি নির্দিষ্ট নিয়ম মেনে চলে, যা Python প্রতিটি <code>if</code> স্টেটমেন্টের ভেতরেও প্রয়োগ করে:</p>'),
      table(
        ['মান', 'bool-এ কাস্ট হয় এভাবে'],
        [
          ['0, 0.0', 'False'],
          ['"" (খালি স্ট্রিং)', 'False'],
          ['[], (), {}, set() — যেকোনো খালি কালেকশন', 'False'],
          ['None', 'False'],
          ['অন্য যেকোনো সংখ্যা বা অ-খালি মান', 'True'],
        ]
      ),
      p('<p>এই টেবিলটির আকৃতি PHP-এর মতোই, একটি পার্থক্য উল্লেখ করার মতো: Python-এ, স্ট্রিং <code>"0"</code> <b>truthy</b> — এটি একটি অ-খালি স্ট্রিং, ব্যাস, এতে কী আছে তার জন্য কোনো বিশেষ ব্যতিক্রম ছাড়াই। PHP-তে যেমন "0" বনাম "0.0" ফাঁদ ছিল তেমন কিছু এখানে নেই।</p>'),

      h(2, 'কালেকশনের মধ্যে রূপান্তর', 'converting-between-collections'),
      p('<p>একই <code>int()</code>/<code>str()</code> প্যাটার্ন কালেকশন টাইপের জন্যও কাজ করে — <code>list()</code>, <code>tuple()</code>, <code>set()</code>, আর <code>dict()</code> এক কালেকশন টাইপ থেকে আরেকটি তৈরি করে:</p>'),
      code('python', 'numbers = [1, 2, 2, 3]\nunique = set(numbers)      # {1, 2, 3} — a set, so duplicates disappear\nback_to_list = list(unique) # a list again, order not guaranteed to match the original'),
      p('<p>Set এ রূপান্তর করা একটি লিস্ট থেকে ডুপ্লিকেট বাদ দেওয়ার একটি দ্রুত, প্রচলিত কৌশল।</p>'),
    ],
  },
})

lessons.push({
  slug: 'operators',
  sortOrder: 7,
  en: {
    title: 'Operators',
    metaTitle: 'Python Operators | Learn Computer Academy',
    metaDescription: 'Python\'s arithmetic, comparison, and logical operators, plus the crucial difference between == and is.',
    blocks: [
      p('<p>Most Python operators will look familiar from PHP — a few of Python\'s own choices are worth flagging specifically.</p>'),

      h(2, 'Arithmetic Operators'),
      table(
        ['Operator', 'Meaning', 'Example'],
        [
          ['+', 'Addition', '5 + 2 → 7'],
          ['-', 'Subtraction', '5 - 2 → 3'],
          ['*', 'Multiplication', '5 * 2 → 10'],
          ['/', 'Division (always returns a float)', '5 / 2 → 2.5'],
          ['//', 'Floor division (rounds down to an int)', '5 // 2 → 2'],
          ['%', 'Modulus (remainder)', '5 % 2 → 1'],
          ['**', 'Exponent', '5 ** 2 → 25'],
        ]
      ),
      p('<p><code>//</code> is worth noting specifically — Python has no direct equivalent to PHP\'s automatic "int if it divides evenly" division behavior; <code>/</code> always gives a float, and <code>//</code> is how you deliberately get a whole number back.</p>'),

      h(2, 'String Concatenation'),
      p('<p>Python uses <code>+</code> for both arithmetic and joining strings — there\'s no separate dot operator like PHP\'s <code>.</code>. Python decides which one you mean from the types involved, which is exactly why mixing a string and a number with <code>+</code> raises an error rather than guessing (from the Data Types lesson):</p>'),
      code('python', 'greeting = "Hello, " + "world!"\nprint(greeting)\n\n# name = "Age: " + 21  # TypeError — use an f-string instead (next lesson)'),

      h(2, 'Comparison: == vs. is'),
      p('<p>This is Python\'s equivalent of PHP\'s <code>==</code> vs. <code>===</code> distinction, but it works differently. <code>==</code> compares <b>value</b>; <code>is</code> compares <b>identity</b> — whether two names point at the literal same object in memory:</p>'),
      code('python', 'a = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(a == b)  # True — same values\nprint(a is b)  # False — two different list objects, even though equal\nprint(a is c)  # True — c points at the exact same object as a'),
      callout('tip', '<p>Use <code>==</code> for comparing values, which is what you want almost all of the time. <code>is</code> is specifically for checking identity, and its one genuinely common use is comparing against <code>None</code>: <code>if value is None:</code> is the idiomatic Python way to do it, not <code>if value == None:</code>.</p>', 'Default to ==, use is for None checks'),

      h(2, 'Logical Operators'),
      p('<p>Python spells these out as words rather than symbols — there\'s no <code>&&</code>, <code>||</code>, or <code>!</code>:</p>'),
      code('python', 'age = 20\nhas_id = True\nif age >= 18 and has_id:\n    print("Entry allowed.")\n\nif not has_id:\n    print("ID required.")'),

      h(2, 'Assignment Operators'),
      p('<p>Every arithmetic operator has a compound form that updates a variable in place — the same idea as PHP\'s <code>+=</code> and friends:</p>'),
      table(
        ['Operator', 'Same as'],
        [
          ['x += 1', 'x = x + 1'],
          ['x -= 1', 'x = x - 1'],
          ['x *= 2', 'x = x * 2'],
          ['x /= 2', 'x = x / 2'],
          ['x //= 2', 'x = x // 2'],
          ['x **= 2', 'x = x ** 2'],
          ['x %= 2', 'x = x % 2'],
        ]
      ),
      p('<p>You already saw <code>count += 1</code> used as the standard way to increment a counter, since Python has no <code>++</code> — the same shortcut works for every operator in the table above.</p>'),
    ],
  },
  bn: {
    title: 'অপারেটর',
    metaTitle: 'Python অপারেটর | Learn Computer Academy',
    metaDescription: 'Python-এর অ্যারিথমেটিক, তুলনা, আর লজিক্যাল অপারেটর, সাথে == আর is-এর মধ্যে গুরুত্বপূর্ণ পার্থক্য।',
    blocks: [
      p('<p>বেশিরভাগ Python অপারেটর PHP থেকে পরিচিত মনে হবে — Python-এর নিজস্ব কিছু পছন্দ বিশেষভাবে উল্লেখ করার মতো।</p>'),

      h(2, 'অ্যারিথমেটিক অপারেটর', 'arithmetic-operators'),
      table(
        ['অপারেটর', 'অর্থ', 'উদাহরণ'],
        [
          ['+', 'যোগ', '5 + 2 → 7'],
          ['-', 'বিয়োগ', '5 - 2 → 3'],
          ['*', 'গুণ', '5 * 2 → 10'],
          ['/', 'ভাগ (সবসময় একটি float রিটার্ন করে)', '5 / 2 → 2.5'],
          ['//', 'ফ্লোর ডিভিশন (নিচের দিকে রাউন্ড করে একটি int)', '5 // 2 → 2'],
          ['%', 'মডুলাস (ভাগশেষ)', '5 % 2 → 1'],
          ['**', 'এক্সপোনেন্ট', '5 ** 2 → 25'],
        ]
      ),
      p('<p><code>//</code> বিশেষভাবে উল্লেখ করার মতো — PHP-এর স্বয়ংক্রিয় "সমানভাবে ভাগ হলে int" ভাগের আচরণের কোনো সরাসরি সমতুল্য Python-এ নেই; <code>/</code> সবসময় একটি float দেয়, আর <code>//</code> হলো ইচ্ছাকৃতভাবে একটি পূর্ণ সংখ্যা ফেরত পাওয়ার উপায়।</p>'),

      h(2, 'স্ট্রিং কনক্যাটেনেশন', 'string-concatenation'),
      p('<p>Python অ্যারিথমেটিক আর স্ট্রিং জোড়া লাগানো দুটোর জন্যই <code>+</code> ব্যবহার করে — PHP-এর <code>.</code>-এর মতো আলাদা কোনো ডট অপারেটর নেই। Python জড়িত টাইপ থেকে সিদ্ধান্ত নেয় আপনি কোনটা বোঝাচ্ছেন, যে কারণেই (Data Types পাঠ থেকে) <code>+</code> দিয়ে একটি স্ট্রিং আর একটি সংখ্যা মেশালে অনুমান করার বদলে একটি এরর ওঠে:</p>'),
      code('python', 'greeting = "Hello, " + "world!"\nprint(greeting)\n\n# name = "Age: " + 21  # TypeError — use an f-string instead (next lesson)'),

      h(2, 'তুলনা: == বনাম is', 'comparison-vs-is'),
      p('<p>এটি PHP-এর <code>==</code> বনাম <code>===</code> পার্থক্যের Python সমতুল্য, কিন্তু এটি ভিন্নভাবে কাজ করে। <code>==</code> <b>মান</b> তুলনা করে; <code>is</code> <b>identity</b> তুলনা করে — দুটো নাম মেমরিতে একেবারে একই অবজেক্টের দিকে নির্দেশ করছে কিনা:</p>'),
      code('python', 'a = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(a == b)  # True — same values\nprint(a is b)  # False — two different list objects, even though equal\nprint(a is c)  # True — c points at the exact same object as a'),
      callout('tip', '<p>মান তুলনা করতে <code>==</code> ব্যবহার করুন, যা প্রায় সবসময় আপনি চান। <code>is</code> নির্দিষ্টভাবে identity চেক করার জন্য, আর এর একটি সত্যিকারের সাধারণ ব্যবহার হলো <code>None</code>-এর সাথে তুলনা করা: <code>if value is None:</code> এটা করার idiomatic Python উপায়, <code>if value == None:</code> নয়।</p>', 'ডিফল্টভাবে ==, None চেকের জন্য is ব্যবহার করুন'),

      h(2, 'লজিক্যাল অপারেটর', 'logical-operators'),
      p('<p>Python এগুলো চিহ্নের বদলে শব্দ দিয়ে লেখে — কোনো <code>&&</code>, <code>||</code>, বা <code>!</code> নেই:</p>'),
      code('python', 'age = 20\nhas_id = True\nif age >= 18 and has_id:\n    print("Entry allowed.")\n\nif not has_id:\n    print("ID required.")'),

      h(2, 'অ্যাসাইনমেন্ট অপারেটর', 'assignment-operators'),
      p('<p>প্রতিটি অ্যারিথমেটিক অপারেটরের একটি compound রূপ আছে যা একটি ভ্যারিয়েবলকে in place আপডেট করে — PHP-এর <code>+=</code> আর তার মতোই একই ধারণা:</p>'),
      table(
        ['অপারেটর', 'যার সমান'],
        [
          ['x += 1', 'x = x + 1'],
          ['x -= 1', 'x = x - 1'],
          ['x *= 2', 'x = x * 2'],
          ['x /= 2', 'x = x / 2'],
          ['x //= 2', 'x = x // 2'],
          ['x **= 2', 'x = x ** 2'],
          ['x %= 2', 'x = x % 2'],
        ]
      ),
      p('<p>একটি কাউন্টার increment করার প্রচলিত উপায় হিসেবে আপনি ইতিমধ্যে <code>count += 1</code> ব্যবহার হতে দেখেছেন, কারণ Python-এ <code>++</code> নেই — উপরের টেবিলের প্রতিটি অপারেটরের জন্য একই শর্টকাট কাজ করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'strings',
  sortOrder: 8,
  en: {
    title: 'Strings in Python',
    metaTitle: 'Strings in Python | Learn Computer Academy',
    metaDescription: 'F-strings, string slicing, and the built-in string methods you\'ll use constantly in Python.',
    blocks: [
      p('<p>Python strings come with a genuinely useful embedding syntax and a large set of built-in methods — this lesson covers what you\'ll actually reach for day to day.</p>'),

      h(2, 'F-Strings'),
      p('<p>An <b>f-string</b> — a string literal prefixed with <code>f</code> — lets you embed any expression directly inside <code>{ }</code>:</p>'),
      code('python', 'name = "Priya"\nage = 21\nprint(f"{name} is {age} years old.")\nprint(f"Next year: {age + 1}")  # expressions work too, not just variables'),
      p('<p>This is Python\'s equivalent of PHP\'s double-quote interpolation, but more powerful — PHP can\'t embed an expression like <code>age + 1</code> directly inside a string the way this can.</p>'),

      h(2, 'Format Specifiers'),
      p('<p>Inside the <code>{ }</code>, a colon introduces a <b>format specifier</b> — controlling decimal places, padding, and alignment without a separate formatting function:</p>'),
      code('python', 'price = 3.14159\nprint(f"{price:.2f}")   # "3.14" — 2 decimal places\n\nname = "Amit"\nprint(f"{name:>10}|")   # "      Amit|" — right-align in a 10-character field\nprint(f"{name:<10}|")   # "Amit      |" — left-align\nprint(f"{name:^10}|")   # "   Amit   |" — center'),
      p('<p>You already saw a variant of this in the Numbers lesson — <code>f"{value:,.2f}"</code> combines a thousands separator with 2 decimal places in a single specifier.</p>'),
      callout('tip', '<p>Python 3.8 added a debugging shortcut — adding <code>=</code> right after a variable inside <code>{ }</code> prints both the variable\'s name and its value, saving you from typing it out by hand while tracking down a bug.</p>', 'The = debug specifier'),
      code('python', 'age = 21\nprint(f"{age=}")  # "age=21"'),

      h(2, 'Multi-Line Strings'),
      p('<p>Triple quotes (<code>"""</code> or <code>\'\'\'</code>) create a string that can span multiple lines, keeping every line break and space inside it exactly as written — useful for a paragraph of text or a block of formatted output:</p>'),
      code('python', 'message = """Dear Priya,\n\nYour course starts on Monday.\n\nRegards,\nLCA"""\nprint(message)'),
      p('<p>This is the same triple-quote syntax used for multi-line comments in the Syntax Basics lesson — the only difference is whether the result is assigned to something.</p>'),

      h(2, 'String Slicing'),
      p('<p>Python lets you pull out a range of characters using <code>[start:end]</code> — no separate function needed like PHP\'s <code>substr()</code>:</p>'),
      code('python', 'text = "Hello, world!"\nprint(text[0])     # "H"\nprint(text[0:5])   # "Hello"\nprint(text[-1])    # "!" — negative indexes count from the end\nprint(text[7:])    # "world!" — leaving off the end means "to the end"'),

      h(2, 'Common String Methods'),
      table(
        ['Method', 'What it does', 'Example'],
        [
          ['len(s)', 'Length of a string (a function, not a method)', 'len("hello") → 5'],
          ['s.upper() / s.lower()', 'Change case', '"hi".upper() → "HI"'],
          ['s.strip()', 'Removes whitespace from both ends', '" hi ".strip() → "hi"'],
          ['s.replace(old, new)', 'Replace all occurrences', '"I like cat".replace("cat", "dog")'],
          ['s.split(delimiter)', 'Split a string into a list', '"a,b,c".split(",") → [\'a\', \'b\', \'c\']'],
          ['delimiter.join(list)', 'Join a list into a string', '"-".join(["a", "b"]) → "a-b"'],
        ]
      ),
      callout('note', '<p>Notice most of these are <b>methods</b> called on the string itself (<code>s.upper()</code>), not standalone functions taking the string as an argument the way PHP\'s <code>strtoupper($s)</code> does — except <code>len()</code>, which is a function. This mixed pattern is just something to memorize; there\'s no rule predicting which is which.</p>', 'Methods vs. functions — no clean rule'),
      p('<p>Python has a large standard string method set — see the <a href="https://docs.python.org/3/library/stdtypes.html#string-methods" target="_blank" rel="noopener noreferrer">full string methods reference on python.org</a> for anything not covered here.</p>'),

      callout('warning', '<p>Python strings are <b>immutable</b> — <code>s.upper()</code> returns a new string, it doesn\'t change <code>s</code> itself. <code>s.upper()</code> alone, with the result thrown away, is a common beginner mistake; you need <code>s = s.upper()</code> to actually keep the change.</p>', 'String methods return a new string'),

      h(2, 'More String Methods'),
      p('<p>A few more that come up constantly, beyond the table above:</p>'),
      table(
        ['Method', 'What it does', 'Example'],
        [
          ['s.startswith(x) / s.endswith(x)', 'Checks the start/end of a string', '"file.pdf".endswith(".pdf") → True'],
          ['s.find(x)', 'Index of the first match, or -1 if not found', '"hello".find("l") → 2'],
          ['s.count(x)', 'How many times x appears', '"banana".count("a") → 3'],
          ['s.isdigit()', 'True if every character is a digit', '"123".isdigit() → True'],
          ['s.isalpha()', 'True if every character is a letter', '"abc".isalpha() → True'],
          ['s.title()', 'Capitalizes the first letter of each word', '"hello world".title() → "Hello World"'],
          ['s.zfill(n)', 'Pads with leading zeros to length n', '"7".zfill(3) → "007"'],
        ]
      ),
      p('<p>Between this table and the one above, most everyday string work is covered — anything else is in the full reference linked above.</p>'),
    ],
  },
  bn: {
    title: 'Python-তে স্ট্রিং',
    metaTitle: 'Python-তে স্ট্রিং | Learn Computer Academy',
    metaDescription: 'F-string, স্ট্রিং স্লাইসিং, আর Python-এ আপনি নিয়মিত ব্যবহার করবেন এমন বিল্ট-ইন স্ট্রিং মেথড।',
    blocks: [
      p('<p>Python স্ট্রিং একটি সত্যিকারের দরকারি এম্বেডিং সিনট্যাক্স আর প্রচুর বিল্ট-ইন মেথড নিয়ে আসে — এই পাঠে সেগুলো দেখানো হবে যা আপনি প্রতিদিন আসলেই ব্যবহার করবেন।</p>'),

      h(2, 'F-string', 'f-strings'),
      p('<p>একটি <b>f-string</b> — <code>f</code>-প্রিফিক্সযুক্ত একটি স্ট্রিং লিটারেল — আপনাকে সরাসরি <code>{ }</code>-এর ভেতরে যেকোনো এক্সপ্রেশন বসাতে দেয়:</p>'),
      code('python', 'name = "Priya"\nage = 21\nprint(f"{name} is {age} years old.")\nprint(f"Next year: {age + 1}")  # expressions work too, not just variables'),
      p('<p>এটি PHP-এর ডাবল-কোট ইন্টারপোলেশনের Python সমতুল্য, কিন্তু বেশি শক্তিশালী — PHP এটির মতো সরাসরি একটি স্ট্রিংয়ের ভেতরে <code>age + 1</code>-এর মতো একটি এক্সপ্রেশন বসাতে পারে না।</p>'),

      h(2, 'ফরম্যাট স্পেসিফায়ার', 'format-specifiers'),
      p('<p><code>{ }</code>-এর ভেতরে, একটি কোলন একটি <b>format specifier</b> শুরু করে — আলাদা কোনো ফরম্যাটিং ফাংশন ছাড়াই দশমিক স্থান, প্যাডিং, আর অ্যালাইনমেন্ট নিয়ন্ত্রণ করা যায়:</p>'),
      code('python', 'price = 3.14159\nprint(f"{price:.2f}")   # "3.14" — 2 decimal places\n\nname = "Amit"\nprint(f"{name:>10}|")   # "      Amit|" — right-align in a 10-character field\nprint(f"{name:<10}|")   # "Amit      |" — left-align\nprint(f"{name:^10}|")   # "   Amit   |" — center'),
      p('<p>Numbers পাঠে আপনি ইতিমধ্যে এর একটি ভ্যারিয়েন্ট দেখেছেন — <code>f"{value:,.2f}"</code> একটি একক specifier-এ হাজার-বিভাজক আর 2টি দশমিক স্থান একত্রিত করে।</p>'),
      callout('tip', '<p>Python 3.8 একটি ডিবাগিং শর্টকাট যোগ করেছে — <code>{ }</code>-এর ভেতরে একটি ভ্যারিয়েবলের ঠিক পরে <code>=</code> যোগ করলে ভ্যারিয়েবলের নাম আর মান দুটোই প্রিন্ট হয়, একটি বাগ খুঁজে বের করার সময় হাতে টাইপ করা থেকে বাঁচায়।</p>', '= ডিবাগ স্পেসিফায়ার'),
      code('python', 'age = 21\nprint(f"{age=}")  # "age=21"'),

      h(2, 'মাল্টি-লাইন স্ট্রিং', 'multi-line-strings'),
      p('<p>ট্রিপল কোট (<code>"""</code> বা <code>\'\'\'</code>) একটি স্ট্রিং তৈরি করে যা একাধিক লাইন জুড়ে থাকতে পারে, এর ভেতরের প্রতিটি লাইন ব্রেক আর স্পেস ঠিক যেভাবে লেখা হয়েছে সেভাবেই রেখে — একটি প্যারাগ্রাফ টেক্সট বা একটি ফরম্যাট করা আউটপুট ব্লকের জন্য দরকারি:</p>'),
      code('python', 'message = """Dear Priya,\n\nYour course starts on Monday.\n\nRegards,\nLCA"""\nprint(message)'),
      p('<p>এটি Syntax Basics পাঠে মাল্টি-লাইন কমেন্টের জন্য ব্যবহৃত একই ট্রিপল-কোট সিনট্যাক্স — একমাত্র পার্থক্য হলো ফলাফলটি কোনো কিছুতে assign করা হয়েছে কিনা।</p>'),

      h(2, 'স্ট্রিং স্লাইসিং', 'string-slicing'),
      p('<p>Python <code>[start:end]</code> ব্যবহার করে অক্ষরের একটি রেঞ্জ বের করতে দেয় — PHP-এর <code>substr()</code>-এর মতো আলাদা কোনো ফাংশনের দরকার নেই:</p>'),
      code('python', 'text = "Hello, world!"\nprint(text[0])     # "H"\nprint(text[0:5])   # "Hello"\nprint(text[-1])    # "!" — negative indexes count from the end\nprint(text[7:])    # "world!" — leaving off the end means "to the end"'),

      h(2, 'সাধারণ স্ট্রিং মেথড', 'common-string-methods'),
      table(
        ['মেথড', 'কী করে', 'উদাহরণ'],
        [
          ['len(s)', 'একটি স্ট্রিং-এর দৈর্ঘ্য (একটি ফাংশন, মেথড নয়)', 'len("hello") → 5'],
          ['s.upper() / s.lower()', 'কেস বদলানো', '"hi".upper() → "HI"'],
          ['s.strip()', 'দুই প্রান্ত থেকে whitespace সরায়', '" hi ".strip() → "hi"'],
          ['s.replace(old, new)', 'সব occurrence replace করে', '"I like cat".replace("cat", "dog")'],
          ['s.split(delimiter)', 'একটি স্ট্রিংকে list-এ ভাগ করে', '"a,b,c".split(",") → [\'a\', \'b\', \'c\']'],
          ['delimiter.join(list)', 'একটি list-কে স্ট্রিংয়ে জোড়া দেয়', '"-".join(["a", "b"]) → "a-b"'],
        ]
      ),
      callout('note', '<p>লক্ষ্য করুন এদের বেশিরভাগই স্ট্রিং নিজের উপর কল করা <b>মেথড</b> (<code>s.upper()</code>), PHP-এর <code>strtoupper($s)</code>-এর মতো স্ট্রিংকে আর্গুমেন্ট হিসেবে নেওয়া আলাদা ফাংশন নয় — শুধু <code>len()</code> ছাড়া, যা একটি ফাংশন। এই মিশ্র প্যাটার্নটা মুখস্থ রাখতে হবে; কোনটা কী তা অনুমান করার কোনো পরিষ্কার নিয়ম নেই।</p>', 'মেথড বনাম ফাংশন — কোনো পরিষ্কার নিয়ম নেই'),
      p('<p>Python-এর একটি বড় স্ট্যান্ডার্ড স্ট্রিং মেথড সেট আছে — এখানে যা নেই তার জন্য দেখুন <a href="https://docs.python.org/3/library/stdtypes.html#string-methods" target="_blank" rel="noopener noreferrer">python.org-এ সম্পূর্ণ স্ট্রিং মেথড রেফারেন্স</a>।</p>'),

      callout('warning', '<p>Python স্ট্রিং <b>immutable</b> — <code>s.upper()</code> একটি নতুন স্ট্রিং রিটার্ন করে, এটি <code>s</code>-কে নিজে বদলায় না। শুধু <code>s.upper()</code>, ফলাফল ফেলে দিয়ে, নতুনদের একটি সাধারণ ভুল; পরিবর্তনটা আসলে রাখতে আপনার <code>s = s.upper()</code> দরকার।</p>', 'স্ট্রিং মেথড একটি নতুন স্ট্রিং রিটার্ন করে'),

      h(2, 'আরও স্ট্রিং মেথড', 'more-string-methods'),
      p('<p>উপরের টেবিলের বাইরে, আরও কিছু যা ক্রমাগত দেখা যায়:</p>'),
      table(
        ['মেথড', 'কী করে', 'উদাহরণ'],
        [
          ['s.startswith(x) / s.endswith(x)', 'একটি স্ট্রিংয়ের শুরু/শেষ চেক করে', '"file.pdf".endswith(".pdf") → True'],
          ['s.find(x)', 'প্রথম মিলের index, বা না পেলে -1', '"hello".find("l") → 2'],
          ['s.count(x)', 'x কতবার আছে', '"banana".count("a") → 3'],
          ['s.isdigit()', 'প্রতিটি অক্ষর সংখ্যা হলে True', '"123".isdigit() → True'],
          ['s.isalpha()', 'প্রতিটি অক্ষর বর্ণ হলে True', '"abc".isalpha() → True'],
          ['s.title()', 'প্রতিটি শব্দের প্রথম অক্ষর বড় করে', '"hello world".title() → "Hello World"'],
          ['s.zfill(n)', 'দৈর্ঘ্য n পর্যন্ত শুরুতে শূন্য দিয়ে প্যাড করে', '"7".zfill(3) → "007"'],
        ]
      ),
      p('<p>এই টেবিল আর উপরের টেবিলের মধ্যে, বেশিরভাগ প্রতিদিনের স্ট্রিং কাজ কভার হয়ে যায় — বাকি যা কিছু উপরে লিংক করা সম্পূর্ণ রেফারেন্সে আছে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'numbers',
  sortOrder: 9,
  en: {
    title: 'Numbers and Math',
    metaTitle: 'Python Numbers and Math | Learn Computer Academy',
    metaDescription: 'Working with integers and floats in Python, the math module, and formatting numbers for display.',
    blocks: [
      p('<p>Python\'s number handling is close to PHP\'s, with one standout difference: Python integers have no size limit, growing as large as memory allows.</p>'),

      h(2, 'Rounding'),
      table(
        ['Function', 'What it does', 'Example'],
        [
          ['round(n)', 'Rounds to the nearest whole number', 'round(4.5) → 4 (see the callout below)'],
          ['round(n, decimals)', 'Rounds to a set number of decimal places', 'round(3.14159, 2) → 3.14'],
          ['math.floor(n)', 'Always rounds down', 'math.floor(4.9) → 4'],
          ['math.ceil(n)', 'Always rounds up', 'math.ceil(4.1) → 5'],
        ]
      ),
      callout('note', '<p>Python\'s <code>round()</code> uses "round half to even" (also called banker\'s rounding) — <code>round(4.5)</code> gives <code>4</code>, not <code>5</code>, and <code>round(5.5)</code> gives <code>6</code>. This is deliberately different from PHP\'s <code>round()</code>, which always rounds .5 up, and it surprises almost everyone the first time they hit it.</p>', 'round(4.5) is not what you\'d expect'),

      h(2, 'The math Module'),
      p('<p><code>floor()</code> and <code>ceil()</code>, along with most other math functions, live in Python\'s <code>math</code> module rather than being available by default — you\'ll look at <code>import</code> properly in an upcoming lesson, but the pattern is simple enough to use right away:</p>'),
      code('python', 'import math\n\nprint(math.floor(4.9))  # 4\nprint(math.ceil(4.1))   # 5\nprint(math.sqrt(64))    # 8.0\nprint(math.pi)          # 3.141592653589793'),

      h(2, 'Built-In Number Functions'),
      code('python', 'print(abs(-7))        # 7 — absolute value\nprint(max(3, 9, 2))   # 9 — largest of the arguments\nprint(min(3, 9, 2))   # 2 — smallest of the arguments\nprint(pow(2, 10))     # 1024 — same as 2 ** 10'),

      h(2, 'Formatting Numbers for Display'),
      p('<p>An f-string with a format specifier is the standard way to control decimal places and add thousands separators — the Strings lesson covers format specifiers in full:</p>'),
      code('python', 'value = 1234567.891\nprint(f"{value:,.2f}")  # "1,234,567.89"'),

      h(2, 'Random Numbers'),
      p('<p>The <code>random</code> module — another standard library module, like <code>math</code> — generates random numbers and makes random choices, similar to PHP\'s <code>rand()</code>/<code>random_int()</code>:</p>'),
      code('python', 'import random\n\nprint(random.randint(1, 6))          # a random integer from 1 to 6, both included\nprint(random.random())               # a random float from 0.0 up to (not including) 1.0\nprint(random.choice(["red", "green", "blue"]))  # picks one item at random'),
      callout('note', '<p><code>random</code> is fine for games, quizzes, and sampling — it is not secure enough for anything like a password reset token or an API key. For that, the standard library\'s <code>secrets</code> module exists specifically to generate values safe for security purposes.</p>', 'Not for security-sensitive values'),
    ],
  },
  bn: {
    title: 'সংখ্যা আর ম্যাথ',
    metaTitle: 'Python সংখ্যা আর ম্যাথ | Learn Computer Academy',
    metaDescription: 'Python-তে integer আর float নিয়ে কাজ করা, math মডিউল, আর ডিসপ্লের জন্য সংখ্যা ফরম্যাট করা।',
    blocks: [
      p('<p>Python-এর সংখ্যা হ্যান্ডলিং PHP-এর কাছাকাছি, একটি উল্লেখযোগ্য পার্থক্যসহ: Python integer-এর কোনো আকারের সীমা নেই, মেমরি যতটা অনুমতি দেয় ততটা বড় হতে পারে।</p>'),

      h(2, 'রাউন্ডিং', 'rounding'),
      table(
        ['ফাংশন', 'কী করে', 'উদাহরণ'],
        [
          ['round(n)', 'নিকটতম পূর্ণ সংখ্যায় রাউন্ড করে', 'round(4.5) → 4 (নিচের callout দেখুন)'],
          ['round(n, decimals)', 'নির্দিষ্ট সংখ্যক দশমিক স্থানে রাউন্ড করে', 'round(3.14159, 2) → 3.14'],
          ['math.floor(n)', 'সবসময় নিচের দিকে রাউন্ড করে', 'math.floor(4.9) → 4'],
          ['math.ceil(n)', 'সবসময় উপরের দিকে রাউন্ড করে', 'math.ceil(4.1) → 5'],
        ]
      ),
      callout('note', '<p>Python-এর <code>round()</code> "round half to even" (banker\'s rounding-ও বলা হয়) ব্যবহার করে — <code>round(4.5)</code> দেয় <code>4</code>, <code>5</code> নয়, আর <code>round(5.5)</code> দেয় <code>6</code>। এটি PHP-এর <code>round()</code>-এর থেকে ইচ্ছাকৃতভাবে আলাদা, যা সবসময় .5 উপরের দিকে রাউন্ড করে, আর প্রথমবার এটার মুখোমুখি হলে প্রায় সবাইকে অবাক করে।</p>', 'round(4.5) যা আপনি প্রত্যাশা করবেন তা নয়'),

      h(2, 'math মডিউল', 'the-math-module'),
      p('<p><code>floor()</code> আর <code>ceil()</code>, বেশিরভাগ অন্য ম্যাথ ফাংশনের সাথে, ডিফল্টভাবে পাওয়া যাওয়ার বদলে Python-এর <code>math</code> মডিউলে থাকে — আসন্ন একটি পাঠে আপনি <code>import</code> ভালোভাবে দেখবেন, কিন্তু প্যাটার্নটা এখনই ব্যবহার করার মতো যথেষ্ট সহজ:</p>'),
      code('python', 'import math\n\nprint(math.floor(4.9))  # 4\nprint(math.ceil(4.1))   # 5\nprint(math.sqrt(64))    # 8.0\nprint(math.pi)          # 3.141592653589793'),

      h(2, 'বিল্ট-ইন সংখ্যা ফাংশন', 'built-in-number-functions'),
      code('python', 'print(abs(-7))        # 7 — absolute value\nprint(max(3, 9, 2))   # 9 — largest of the arguments\nprint(min(3, 9, 2))   # 2 — smallest of the arguments\nprint(pow(2, 10))     # 1024 — same as 2 ** 10'),

      h(2, 'ডিসপ্লের জন্য সংখ্যা ফরম্যাট করা', 'formatting-numbers-for-display'),
      p('<p>একটি format specifier-সহ f-string দশমিক স্থান নিয়ন্ত্রণ করার আর হাজার-বিভাজক যোগ করার প্রচলিত উপায় — Strings পাঠে format specifier সম্পূর্ণভাবে দেখানো হয়েছে:</p>'),
      code('python', 'value = 1234567.891\nprint(f"{value:,.2f}")  # "1,234,567.89"'),

      h(2, 'র‍্যান্ডম সংখ্যা', 'random-numbers'),
      p('<p><code>random</code> মডিউল — <code>math</code>-এর মতো আরেকটি স্ট্যান্ডার্ড লাইব্রেরি মডিউল — র‍্যান্ডম সংখ্যা তৈরি করে আর র‍্যান্ডম পছন্দ করে, PHP-এর <code>rand()</code>/<code>random_int()</code>-এর কাছাকাছি:</p>'),
      code('python', 'import random\n\nprint(random.randint(1, 6))          # a random integer from 1 to 6, both included\nprint(random.random())               # a random float from 0.0 up to (not including) 1.0\nprint(random.choice(["red", "green", "blue"]))  # picks one item at random'),
      callout('note', '<p>গেম, কুইজ, আর স্যাম্পলিংয়ের জন্য <code>random</code> ঠিক আছে — এটি পাসওয়ার্ড রিসেট টোকেন বা একটি API key-এর মতো কিছুর জন্য যথেষ্ট নিরাপদ নয়। সেজন্য, স্ট্যান্ডার্ড লাইব্রেরির <code>secrets</code> মডিউল নির্দিষ্টভাবে সিকিউরিটি উদ্দেশ্যে নিরাপদ মান তৈরি করতে আছে।</p>', 'সিকিউরিটি-সংবেদনশীল মানের জন্য নয়'),
    ],
  },
})

lessons.push({
  slug: 'lists',
  sortOrder: 10,
  en: {
    title: 'Lists',
    metaTitle: 'Python Lists | Learn Computer Academy',
    metaDescription: 'Python\'s list type — an ordered, changeable collection — and the methods you\'ll use to work with one.',
    blocks: [
      p('<p>A <b>list</b> is Python\'s ordered, changeable collection — the closest equivalent to PHP\'s indexed array, and by far the most commonly used collection type.</p>'),

      h(2, 'Creating a List'),
      code('python', 'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])  # "apple"\nprint(fruits[2])  # "mango"\nprint(fruits[-1]) # "mango" — negative indexes count from the end'),

      h(2, 'Modifying a List'),
      code('python', 'fruits = ["apple", "banana"]\nfruits.append("mango")      # adds to the end\nfruits[0] = "green apple"   # overwrites index 0\nfruits.remove("banana")     # removes the first "banana" found\ndel fruits[0]                # removes by index instead'),

      h(2, 'Common List Methods'),
      table(
        ['Method', 'What it does'],
        [
          ['list.append(x)', 'Adds x to the end'],
          ['list.insert(i, x)', 'Inserts x at a specific index'],
          ['list.pop(i)', 'Removes and returns the item at index i (last item if i is omitted)'],
          ['list.extend(other)', 'Appends every item from another list'],
          ['list.index(x)', 'Index of the first x found (raises an error if missing)'],
          ['list.count(x)', 'How many times x appears'],
          ['list.sort()', 'Sorts the list in place'],
          ['list.reverse()', 'Reverses the list in place'],
          ['list.clear()', 'Removes every item, leaving an empty list'],
          ['len(list)', 'Number of items (a function, like with strings)'],
        ]
      ),

      h(2, 'Looping Over a List'),
      code('python', 'fruits = ["apple", "banana", "mango"]\nfor fruit in fruits:\n    print(fruit)\n\n# with the index too:\nfor index, fruit in enumerate(fruits):\n    print(index, fruit)'),
      p('<p><code>for x in list</code> is by far the most common way to loop in Python — you\'ll see it used constantly from here on. The Loops lesson later in this section covers Python\'s loops in full.</p>'),

      h(2, 'Slicing'),
      p('<p>The same <code>[start:end]</code> slicing from the Strings lesson works on lists too — this is a general Python pattern, not something specific to strings:</p>'),
      code('python', 'numbers = [10, 20, 30, 40, 50]\nprint(numbers[1:3])  # [20, 30]\nprint(numbers[:2])   # [10, 20]\nprint(numbers[-2:])  # [40, 50]'),

      h(2, 'Copying a List Safely'),
      p('<p>Assigning a list to a new name doesn\'t copy it — both names point at the exact same list, so changing one changes the other:</p>'),
      code('python', 'original = [1, 2, 3]\nalias = original\nalias.append(4)\nprint(original)  # [1, 2, 3, 4] — original changed too, since it\'s the same list'),
      p('<p><code>.copy()</code>, or the equivalent <code>list(original)</code>, creates a genuinely separate list:</p>'),
      code('python', 'original = [1, 2, 3]\ncopy = original.copy()\ncopy.append(4)\nprint(original)  # [1, 2, 3] — unaffected\nprint(copy)      # [1, 2, 3, 4]'),
    ],
  },
  bn: {
    title: 'লিস্ট',
    metaTitle: 'Python লিস্ট | Learn Computer Academy',
    metaDescription: 'Python-এর list টাইপ — একটি ক্রমানুসারে সাজানো, পরিবর্তনযোগ্য কালেকশন — আর যে মেথড দিয়ে আপনি এটা নিয়ে কাজ করবেন।',
    blocks: [
      p('<p>একটি <b>list</b> হলো Python-এর ক্রমানুসারে সাজানো, পরিবর্তনযোগ্য কালেকশন — PHP-এর ইনডেক্সড অ্যারের সবচেয়ে কাছাকাছি সমতুল্য, আর এখন পর্যন্ত সবচেয়ে বেশি ব্যবহৃত কালেকশন টাইপ।</p>'),

      h(2, 'একটি লিস্ট তৈরি করা', 'creating-a-list'),
      code('python', 'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])  # "apple"\nprint(fruits[2])  # "mango"\nprint(fruits[-1]) # "mango" — negative indexes count from the end'),

      h(2, 'একটি লিস্ট পরিবর্তন করা', 'modifying-a-list'),
      code('python', 'fruits = ["apple", "banana"]\nfruits.append("mango")      # adds to the end\nfruits[0] = "green apple"   # overwrites index 0\nfruits.remove("banana")     # removes the first "banana" found\ndel fruits[0]                # removes by index instead'),

      h(2, 'সাধারণ লিস্ট মেথড', 'common-list-methods'),
      table(
        ['মেথড', 'কী করে'],
        [
          ['list.append(x)', 'শেষে x যোগ করে'],
          ['list.insert(i, x)', 'একটি নির্দিষ্ট index-এ x insert করে'],
          ['list.pop(i)', 'index i-তে থাকা আইটেম সরায় আর রিটার্ন করে (i বাদ দিলে শেষ আইটেম)'],
          ['list.extend(other)', 'অন্য একটি লিস্টের প্রতিটি আইটেম যোগ করে'],
          ['list.index(x)', 'পাওয়া প্রথম x-এর index (না পেলে এরর তোলে)'],
          ['list.count(x)', 'x কতবার আছে'],
          ['list.sort()', 'লিস্টকে in place সর্ট করে'],
          ['list.reverse()', 'লিস্টকে in place উল্টে দেয়'],
          ['list.clear()', 'সব আইটেম সরিয়ে একটি খালি লিস্ট রাখে'],
          ['len(list)', 'আইটেমের সংখ্যা (স্ট্রিংয়ের মতো একটি ফাংশন)'],
        ]
      ),

      h(2, 'একটি লিস্টের উপর লুপ করা', 'looping-over-a-list'),
      code('python', 'fruits = ["apple", "banana", "mango"]\nfor fruit in fruits:\n    print(fruit)\n\n# with the index too:\nfor index, fruit in enumerate(fruits):\n    print(index, fruit)'),
      p('<p>Python-এ লুপ করার সবচেয়ে প্রচলিত উপায় হলো <code>for x in list</code> — এখন থেকে এটি ক্রমাগত ব্যবহার হতে দেখবেন। এই অংশের পরের Loops পাঠে Python-এর লুপ সম্পূর্ণভাবে দেখানো হবে।</p>'),

      h(2, 'স্লাইসিং', 'slicing'),
      p('<p>Strings পাঠের একই <code>[start:end]</code> স্লাইসিং লিস্টেও কাজ করে — এটি একটি সাধারণ Python প্যাটার্ন, শুধু স্ট্রিং-নির্দিষ্ট কিছু নয়:</p>'),
      code('python', 'numbers = [10, 20, 30, 40, 50]\nprint(numbers[1:3])  # [20, 30]\nprint(numbers[:2])   # [10, 20]\nprint(numbers[-2:])  # [40, 50]'),

      h(2, 'একটি লিস্ট নিরাপদে কপি করা', 'copying-a-list-safely'),
      p('<p>একটি লিস্টকে একটি নতুন নামে assign করলে সেটা কপি হয় না — দুটো নামই একদম একই লিস্টের দিকে নির্দেশ করে, তাই একটা বদলালে আরেকটাও বদলায়:</p>'),
      code('python', 'original = [1, 2, 3]\nalias = original\nalias.append(4)\nprint(original)  # [1, 2, 3, 4] — original changed too, since it\'s the same list'),
      p('<p><code>.copy()</code>, বা এর সমতুল্য <code>list(original)</code>, একটি সত্যিকারের আলাদা লিস্ট তৈরি করে:</p>'),
      code('python', 'original = [1, 2, 3]\ncopy = original.copy()\ncopy.append(4)\nprint(original)  # [1, 2, 3] — unaffected\nprint(copy)      # [1, 2, 3, 4]'),
    ],
  },
})

lessons.push({
  slug: 'tuples-and-sets',
  sortOrder: 11,
  en: {
    title: 'Tuples and Sets',
    metaTitle: 'Python Tuples and Sets | Learn Computer Academy',
    metaDescription: 'Python\'s tuple (an ordered, unchangeable collection) and set (an unordered collection of unique values) — when to reach for each.',
    blocks: [
      p('<p>Lists aren\'t always the right tool. A <b>tuple</b> and a <b>set</b> each trade away one of a list\'s properties in exchange for something useful.</p>'),

      h(2, 'Tuples: Ordered but Unchangeable'),
      p('<p>A tuple looks like a list but uses parentheses, and once created, its contents can\'t be changed:</p>'),
      code('python', 'point = (10, 20)\nprint(point[0])  # 10\n\n# point[0] = 5  # TypeError — tuples don\'t support item assignment'),
      p('<p>Use a tuple when a fixed, small group of values genuinely shouldn\'t change after creation — coordinates, an RGB color, a function returning more than one value:</p>'),
      code('python', 'def min_max(numbers):\n    return min(numbers), max(numbers)  # returns a tuple\n\nlowest, highest = min_max([4, 9, 1, 7])  # unpacked into two variables\nprint(lowest, highest)  # 1 7'),

      h(2, 'Sets: Unique, Unordered Values'),
      p('<p>A set automatically discards duplicates and has no guaranteed order — useful whenever "does this exist" and "no repeats" matter more than sequence:</p>'),
      code('python', 'numbers = {1, 2, 2, 3, 3, 3}\nprint(numbers)  # {1, 2, 3} — duplicates are gone\n\nprint(3 in numbers)  # True — checking membership is very fast on a set'),

      h(2, 'Set Operations'),
      p('<p>Sets support the same operations as sets in mathematics — genuinely useful for comparing two collections:</p>'),
      code('python', 'a = {1, 2, 3}\nb = {2, 3, 4}\n\nprint(a | b)  # {1, 2, 3, 4} — union: everything in either\nprint(a & b)  # {2, 3} — intersection: in both\nprint(a - b)  # {1} — difference: in a but not b'),

      h(2, 'Modifying a Set'),
      code('python', 'colors = {"red", "green"}\ncolors.add("blue")       # adds one item\ncolors.remove("red")     # removes it — raises an error if it isn\'t there\ncolors.discard("purple") # also removes it, but does nothing if it isn\'t there'),
      p('<p><code>.discard()</code> is the safer default when you\'re not sure the item exists — <code>.remove()</code> is for when its absence would itself be a bug worth knowing about.</p>'),

      h(2, 'Choosing Between Them'),
      table(
        ['Type', 'Choose when'],
        [
          ['list', 'Order matters, you\'ll change the contents, duplicates are fine'],
          ['tuple', 'Order matters, the contents should never change'],
          ['set', 'Order doesn\'t matter, duplicates should be impossible'],
        ]
      ),
    ],
  },
  bn: {
    title: 'টাপল আর সেট',
    metaTitle: 'Python টাপল আর সেট | Learn Computer Academy',
    metaDescription: 'Python-এর tuple (একটি ক্রমানুসারে সাজানো, অপরিবর্তনযোগ্য কালেকশন) আর set (ইউনিক মানের একটি ক্রমানুসারবিহীন কালেকশন) — কখন কোনটা ব্যবহার করবেন।',
    blocks: [
      p('<p>লিস্ট সবসময় সঠিক টুল নয়। একটি <b>tuple</b> আর একটি <b>set</b> প্রতিটি একটি লিস্টের একটি বৈশিষ্ট্য ছেড়ে দেয় দরকারি কিছুর বিনিময়ে।</p>'),

      h(2, 'Tuple: ক্রমানুসারে কিন্তু অপরিবর্তনযোগ্য', 'tuples-ordered-but-unchangeable'),
      p('<p>একটি tuple একটি লিস্টের মতো দেখতে কিন্তু বন্ধনী ব্যবহার করে, আর একবার তৈরি হয়ে গেলে, এর কন্টেন্ট বদলানো যায় না:</p>'),
      code('python', 'point = (10, 20)\nprint(point[0])  # 10\n\n# point[0] = 5  # TypeError — tuples don\'t support item assignment'),
      p('<p>একটি tuple ব্যবহার করুন যখন মানের একটি নির্দিষ্ট, ছোট গ্রুপ তৈরি হওয়ার পর সত্যিকারভাবে বদলানো উচিত নয় — কোঅর্ডিনেট, একটি RGB রঙ, একাধিক মান রিটার্ন করা একটি ফাংশন:</p>'),
      code('python', 'def min_max(numbers):\n    return min(numbers), max(numbers)  # returns a tuple\n\nlowest, highest = min_max([4, 9, 1, 7])  # unpacked into two variables\nprint(lowest, highest)  # 1 7'),

      h(2, 'Set: ইউনিক, ক্রমানুসারবিহীন মান', 'sets-unique-unordered-values'),
      p('<p>একটি set স্বয়ংক্রিয়ভাবে ডুপ্লিকেট বাদ দেয় আর এর কোনো নিশ্চিত ক্রম নেই — যখন "এটা কি আছে" আর "কোনো পুনরাবৃত্তি নেই" ক্রমের চেয়ে বেশি গুরুত্বপূর্ণ তখন দরকারি:</p>'),
      code('python', 'numbers = {1, 2, 2, 3, 3, 3}\nprint(numbers)  # {1, 2, 3} — duplicates are gone\n\nprint(3 in numbers)  # True — checking membership is very fast on a set'),

      h(2, 'সেট অপারেশন', 'set-operations'),
      p('<p>Set গণিতের সেটের মতো একই অপারেশন সাপোর্ট করে — দুটো কালেকশন তুলনা করার জন্য সত্যিকারভাবে দরকারি:</p>'),
      code('python', 'a = {1, 2, 3}\nb = {2, 3, 4}\n\nprint(a | b)  # {1, 2, 3, 4} — union: everything in either\nprint(a & b)  # {2, 3} — intersection: in both\nprint(a - b)  # {1} — difference: in a but not b'),

      h(2, 'একটি সেট পরিবর্তন করা', 'modifying-a-set'),
      code('python', 'colors = {"red", "green"}\ncolors.add("blue")       # adds one item\ncolors.remove("red")     # removes it — raises an error if it isn\'t there\ncolors.discard("purple") # also removes it, but does nothing if it isn\'t there'),
      p('<p>আইটেমটি আছে কিনা নিশ্চিত না থাকলে <code>.discard()</code> বেশি নিরাপদ ডিফল্ট — <code>.remove()</code> তখনকার জন্য যখন এর অনুপস্থিতি নিজেই জানার মতো একটি বাগ হবে।</p>'),

      h(2, 'এদের মধ্যে বেছে নেওয়া', 'choosing-between-them'),
      table(
        ['টাইপ', 'কখন বেছে নেবেন'],
        [
          ['list', 'ক্রম গুরুত্বপূর্ণ, কন্টেন্ট বদলাবেন, ডুপ্লিকেট ঠিক আছে'],
          ['tuple', 'ক্রম গুরুত্বপূর্ণ, কন্টেন্ট কখনো বদলানো উচিত নয়'],
          ['set', 'ক্রম গুরুত্বপূর্ণ নয়, ডুপ্লিকেট অসম্ভব হওয়া উচিত'],
        ]
      ),
    ],
  },
})

lessons.push({
  slug: 'dictionaries',
  sortOrder: 12,
  en: {
    title: 'Dictionaries',
    metaTitle: 'Python Dictionaries | Learn Computer Academy',
    metaDescription: 'Python\'s dict type — key-value pairs, the equivalent of PHP\'s associative arrays.',
    blocks: [
      p('<p>A <b>dictionary</b> (<code>dict</code>) stores key-value pairs — the direct equivalent of PHP\'s associative arrays. These show up everywhere in real Python code, and you\'ll meet them again immediately once you reach working with databases.</p>'),

      h(2, 'Creating One'),
      code('python', 'student = {\n    "name": "Priya",\n    "age": 21,\n    "course": "Web Development",\n}\nprint(student["name"])  # "Priya"'),

      h(2, 'Modifying a Dictionary'),
      code('python', 'student["email"] = "priya@example.com"  # adds a new key\nstudent["age"] = 22                       # overwrites an existing one\ndel student["email"]                      # removes a key'),

      h(2, 'Looping Over Key-Value Pairs'),
      code('python', 'for key, value in student.items():\n    print(f"{key}: {value}")\n# name: Priya\n# age: 21\n# course: Web Development'),

      h(2, 'Checking a Key Exists'),
      p('<p>Reading a missing key with <code>[ ]</code> raises a <code>KeyError</code> and stops the script — <code>.get()</code> returns <code>None</code> (or a fallback you choose) instead, which is usually what you actually want:</p>'),
      code('python', 'email = student.get("email")               # None — key doesn\'t exist, no crash\nemail = student.get("email", "no email")   # "no email" — a custom fallback'),

      h(2, 'Nested Dictionaries'),
      p('<p>Combining lists and dictionaries models real-world data naturally — this shape will look familiar once you reach the Python-and-Databases lesson, since a database row often lands in Python exactly this way:</p>'),
      code('python', 'students = [\n    {"name": "Priya", "age": 21},\n    {"name": "Amit", "age": 23},\n]\nprint(students[0]["name"])  # "Priya"'),

      h(2, 'More Dictionary Methods'),
      table(
        ['Method', 'What it does'],
        [
          ['d.keys()', 'All the keys'],
          ['d.values()', 'All the values'],
          ['d.pop(key)', 'Removes a key and returns its value'],
          ['d.update(other)', 'Merges another dictionary in, overwriting any matching keys'],
        ]
      ),
      code('python', 'a = {"name": "Priya", "age": 21}\nb = {"age": 22, "course": "Web Development"}\na.update(b)\nprint(a)  # {\'name\': \'Priya\', \'age\': 22, \'course\': \'Web Development\'}'),
    ],
  },
  bn: {
    title: 'ডিকশনারি',
    metaTitle: 'Python ডিকশনারি | Learn Computer Academy',
    metaDescription: 'Python-এর dict টাইপ — key-value জোড়া, PHP-এর অ্যাসোসিয়েটিভ অ্যারের সমতুল্য।',
    blocks: [
      p('<p>একটি <b>dictionary</b> (<code>dict</code>) key-value জোড়া সংরক্ষণ করে — PHP-এর অ্যাসোসিয়েটিভ অ্যারের সরাসরি সমতুল্য। এগুলো বাস্তব Python কোডে সব জায়গায় দেখা যায়, আর ডেটাবেস নিয়ে কাজ করার সময় আপনি এদের সাথে আবার সাথে সাথে পরিচিত হবেন।</p>'),

      h(2, 'একটি তৈরি করা', 'creating-one'),
      code('python', 'student = {\n    "name": "Priya",\n    "age": 21,\n    "course": "Web Development",\n}\nprint(student["name"])  # "Priya"'),

      h(2, 'একটি ডিকশনারি পরিবর্তন করা', 'modifying-a-dictionary'),
      code('python', 'student["email"] = "priya@example.com"  # adds a new key\nstudent["age"] = 22                       # overwrites an existing one\ndel student["email"]                      # removes a key'),

      h(2, 'Key-Value জোড়ার উপর লুপ করা', 'looping-over-key-value-pairs'),
      code('python', 'for key, value in student.items():\n    print(f"{key}: {value}")\n# name: Priya\n# age: 21\n# course: Web Development'),

      h(2, 'একটি Key আছে কিনা চেক করা', 'checking-a-key-exists'),
      p('<p><code>[ ]</code> দিয়ে একটি অনুপস্থিত key পড়লে একটি <code>KeyError</code> ওঠে আর স্ক্রিপ্ট থেমে যায় — <code>.get()</code> এর বদলে <code>None</code> (বা আপনার বেছে নেওয়া একটি ফলব্যাক) রিটার্ন করে, যা সাধারণত আপনি আসলে যা চান:</p>'),
      code('python', 'email = student.get("email")               # None — key doesn\'t exist, no crash\nemail = student.get("email", "no email")   # "no email" — a custom fallback'),

      h(2, 'নেস্টেড ডিকশনারি', 'nested-dictionaries'),
      p('<p>লিস্ট আর ডিকশনারি একত্রিত করলে বাস্তব-জগতের ডেটা স্বাভাবিকভাবে মডেল করা যায় — এই আকৃতিটি Python-এবং-ডেটাবেস পাঠে গিয়ে পরিচিত মনে হবে, কারণ একটি ডেটাবেস সারি প্রায়ই ঠিক এভাবেই Python-এ আসে:</p>'),
      code('python', 'students = [\n    {"name": "Priya", "age": 21},\n    {"name": "Amit", "age": 23},\n]\nprint(students[0]["name"])  # "Priya"'),

      h(2, 'আরও ডিকশনারি মেথড', 'more-dictionary-methods'),
      table(
        ['মেথড', 'কী করে'],
        [
          ['d.keys()', 'সব key'],
          ['d.values()', 'সব value'],
          ['d.pop(key)', 'একটি key সরায় আর তার value রিটার্ন করে'],
          ['d.update(other)', 'আরেকটি ডিকশনারি মার্জ করে, মিলে যাওয়া যেকোনো key ওভাররাইট করে'],
        ]
      ),
      code('python', 'a = {"name": "Priya", "age": 21}\nb = {"age": 22, "course": "Web Development"}\na.update(b)\nprint(a)  # {\'name\': \'Priya\', \'age\': 22, \'course\': \'Web Development\'}'),
    ],
  },
})

lessons.push({
  slug: 'list-comprehensions',
  sortOrder: 13,
  en: {
    title: 'List Comprehensions',
    metaTitle: 'Python List Comprehensions | Learn Computer Academy',
    metaDescription: 'Building a new list from an existing one in a single, readable line — one of Python\'s most distinctive and widely-used features.',
    blocks: [
      p('<p>A <b>list comprehension</b> builds a new list from an existing one in a single line — this is one of the most distinctly "Python" features in the language, and real Python code uses it constantly.</p>'),

      h(2, 'The Long Way vs. the Comprehension'),
      p('<p>Here\'s the same task — squaring every number in a list — written both ways:</p>'),
      code('python', '# The long way, with a regular loop:\nnumbers = [1, 2, 3, 4, 5]\nsquared = []\nfor n in numbers:\n    squared.append(n ** 2)\nprint(squared)  # [1, 4, 9, 16, 25]\n\n# The same thing, as a list comprehension:\nsquared = [n ** 2 for n in numbers]\nprint(squared)  # [1, 4, 9, 16, 25]'),
      p('<p>The pattern is <code>[expression for item in iterable]</code> — read it left to right as "the result of <i>expression</i>, for every <i>item</i> in <i>iterable</i>."</p>'),

      h(2, 'Adding a Condition'),
      p('<p>An optional <code>if</code> at the end filters which items get included — this is the comprehension equivalent of PHP\'s <code>array_filter()</code> combined with <code>array_map()</code>, in one expression:</p>'),
      code('python', 'numbers = [1, 2, 3, 4, 5, 6]\neven_squared = [n ** 2 for n in numbers if n % 2 == 0]\nprint(even_squared)  # [4, 16, 36]'),

      h(2, 'Dictionary Comprehensions'),
      p('<p>The same idea works for building a dictionary, using <code>{ }</code> and a <code>key: value</code> pair instead:</p>'),
      code('python', 'names = ["priya", "amit", "sara"]\ncapitalized = {name: name.capitalize() for name in names}\nprint(capitalized)  # {\'priya\': \'Priya\', \'amit\': \'Amit\', \'sara\': \'Sara\'}'),

      h(2, 'Transforming Instead of Filtering'),
      p('<p>The <code>if</code> covered above filters — it decides whether an item is included at all. Putting <code>if/else</code> <i>before</i> the expression instead changes what value gets used, keeping every item:</p>'),
      code('python', 'numbers = [1, 2, 3, 4, 5, 6]\nlabels = ["even" if n % 2 == 0 else "odd" for n in numbers]\nprint(labels)  # [\'odd\', \'even\', \'odd\', \'even\', \'odd\', \'even\'] — one label per number, none dropped'),
      p('<p>Position is what tells them apart: <code>if</code> after the loop filters, <code>if/else</code> before the expression transforms. Mixing the two up is an easy mistake when skimming someone else\'s code.</p>'),

      callout('tip', '<p>A comprehension is a readability win for a short, simple transformation. Once the logic inside it gets complicated — several conditions, nested loops, a multi-line transformation — a regular <code>for</code> loop is usually clearer. There\'s no rule for exactly where that line is; if you find yourself squinting at a comprehension to understand it, that\'s the signal to write it as a loop instead.</p>', 'When not to use one'),
    ],
  },
  bn: {
    title: 'লিস্ট কম্প্রিহেনশন',
    metaTitle: 'Python লিস্ট কম্প্রিহেনশন | Learn Computer Academy',
    metaDescription: 'একটি বিদ্যমান লিস্ট থেকে একটি একক, পঠনযোগ্য লাইনে একটি নতুন লিস্ট তৈরি করা — Python-এর সবচেয়ে বৈশিষ্ট্যপূর্ণ আর ব্যাপকভাবে ব্যবহৃত ফিচারগুলোর একটি।',
    blocks: [
      p('<p>একটি <b>list comprehension</b> একটি বিদ্যমান লিস্ট থেকে একটি একক লাইনে একটি নতুন লিস্ট তৈরি করে — এটি ভাষার সবচেয়ে স্বতন্ত্রভাবে "Python" ফিচারগুলোর একটি, আর বাস্তব Python কোড এটি ক্রমাগত ব্যবহার করে।</p>'),

      h(2, 'দীর্ঘ উপায় বনাম কম্প্রিহেনশন', 'the-long-way-vs-the-comprehension'),
      p('<p>এখানে একই কাজ — একটি লিস্টের প্রতিটি সংখ্যা স্কোয়ার করা — দুই উপায়ে লেখা:</p>'),
      code('python', '# The long way, with a regular loop:\nnumbers = [1, 2, 3, 4, 5]\nsquared = []\nfor n in numbers:\n    squared.append(n ** 2)\nprint(squared)  # [1, 4, 9, 16, 25]\n\n# The same thing, as a list comprehension:\nsquared = [n ** 2 for n in numbers]\nprint(squared)  # [1, 4, 9, 16, 25]'),
      p('<p>প্যাটার্নটি হলো <code>[expression for item in iterable]</code> — এটি বাম থেকে ডানে পড়ুন "<i>iterable</i>-এর প্রতিটি <i>item</i>-এর জন্য, <i>expression</i>-এর ফলাফল" হিসেবে।</p>'),

      h(2, 'একটি কন্ডিশন যোগ করা', 'adding-a-condition'),
      p('<p>শেষে একটি ঐচ্ছিক <code>if</code> কোন আইটেমগুলো অন্তর্ভুক্ত হবে তা ফিল্টার করে — এটি PHP-এর <code>array_filter()</code> আর <code>array_map()</code> একসাথে মেশানোর কম্প্রিহেনশন সমতুল্য, একটি এক্সপ্রেশনে:</p>'),
      code('python', 'numbers = [1, 2, 3, 4, 5, 6]\neven_squared = [n ** 2 for n in numbers if n % 2 == 0]\nprint(even_squared)  # [4, 16, 36]'),

      h(2, 'ডিকশনারি কম্প্রিহেনশন', 'dictionary-comprehensions'),
      p('<p>একই ধারণা একটি ডিকশনারি তৈরির জন্যও কাজ করে, এর বদলে <code>{ }</code> আর একটি <code>key: value</code> জোড়া ব্যবহার করে:</p>'),
      code('python', 'names = ["priya", "amit", "sara"]\ncapitalized = {name: name.capitalize() for name in names}\nprint(capitalized)  # {\'priya\': \'Priya\', \'amit\': \'Amit\', \'sara\': \'Sara\'}'),

      h(2, 'ফিল্টার করার বদলে রূপান্তর করা', 'transforming-instead-of-filtering'),
      p('<p>উপরে দেখানো <code>if</code> ফিল্টার করে — এটা সিদ্ধান্ত নেয় একটি আইটেম আদৌ অন্তর্ভুক্ত হবে কিনা। এক্সপ্রেশনের <i>আগে</i> <code>if/else</code> বসালে এর বদলে কোন মান ব্যবহৃত হবে তা বদলায়, প্রতিটি আইটেম রেখে দিয়ে:</p>'),
      code('python', 'numbers = [1, 2, 3, 4, 5, 6]\nlabels = ["even" if n % 2 == 0 else "odd" for n in numbers]\nprint(labels)  # [\'odd\', \'even\', \'odd\', \'even\', \'odd\', \'even\'] — one label per number, none dropped'),
      p('<p>অবস্থানই এদের আলাদা করে চেনায়: লুপের পরে <code>if</code> ফিল্টার করে, এক্সপ্রেশনের আগে <code>if/else</code> রূপান্তর করে। কারো কোড দ্রুত দেখার সময় এই দুটো গুলিয়ে ফেলা একটি সহজ ভুল।</p>'),

      callout('tip', '<p>একটি ছোট, সহজ রূপান্তরের জন্য একটি কম্প্রিহেনশন পাঠযোগ্যতার একটি জয়। একবার এর ভেতরের লজিক জটিল হয়ে গেলে — বেশ কয়েকটি কন্ডিশন, নেস্টেড লুপ, একটি মাল্টি-লাইন রূপান্তর — একটি সাধারণ <code>for</code> লুপ সাধারণত বেশি পরিষ্কার। ঠিক কোথায় সেই সীমা তার কোনো নিয়ম নেই; একটি কম্প্রিহেনশন বুঝতে যদি আপনাকে চোখ কুঁচকে তাকাতে হয়, তাহলে এটাই সংকেত যে এর বদলে একটি লুপ হিসেবে লেখা উচিত।</p>', 'কখন একটি ব্যবহার করবেন না'),
    ],
  },
})

lessons.push({
  slug: 'control-flow',
  sortOrder: 14,
  en: {
    title: 'If, Elif, Else',
    metaTitle: 'Python If, Elif, Else | Learn Computer Academy',
    metaDescription: 'Python\'s conditional statements — if, elif, else, and the ternary and walrus shortcuts.',
    blocks: [
      p('<p>Conditionals let a script make decisions — the same idea from <a href="/programming/if-statements/">Intro to Programming</a>, with Python\'s indentation-based syntax and no parentheses required around the condition.</p>'),

      h(2, 'if, elif, else'),
      code('python', 'score = 72\nif score >= 90:\n    print("Grade: A")\nelif score >= 75:\n    print("Grade: B")\nelif score >= 60:\n    print("Grade: C")\nelse:\n    print("Grade: F")'),
      p('<p>Python spells the middle case <code>elif</code> — not <code>elseif</code> (PHP) and not <code>else if</code> as two words. This is one of the most common typos coming from another language.</p>'),

      h(2, 'No switch Statement'),
      p('<p>Python has no direct equivalent to PHP\'s <code>switch</code> (a genuine <code>match</code> statement was added in Python 3.10, but a long <code>elif</code> chain remains the more common, portable way to write this):</p>'),
      code('python', 'day = "Mon"\nif day in ("Mon", "Tue", "Wed", "Thu", "Fri"):\n    print("Weekday")\nelif day in ("Sat", "Sun"):\n    print("Weekend")\nelse:\n    print("Not a valid day")'),
      p('<p><code>in (...)</code> — checking whether a value is one of several — is the idiomatic Python way to write what PHP\'s stacked <code>case</code> labels do.</p>'),

      h(2, 'The Ternary Shortcut'),
      p('<p>A compact one-line <code>if/else</code>, with the condition in the middle rather than PHP\'s <code>?</code>/<code>:</code>:</p>'),
      code('python', 'age = 20\nstatus = "adult" if age >= 18 else "minor"\nprint(status)  # "adult"'),

      h(2, 'Truthiness in Practice'),
      p('<p>Because of Python\'s truthy/falsy rules (from the Type Conversion lesson), checking whether a list or string is empty rarely needs a length check:</p>'),
      code('python', 'items = []\nif items:\n    print("Has items")\nelse:\n    print("Empty")  # this runs — an empty list is falsy'),

      h(2, 'The Walrus Operator'),
      p('<p><code>:=</code> — nicknamed the <b>walrus operator</b> for its resemblance to a pair of eyes and tusks — assigns a value <i>and</i> returns it in the same expression, added in Python 3.8. It has no PHP equivalent. Its most common use is avoiding calling the same thing twice:</p>'),
      code('python', '# Without the walrus — calling len() twice:\nnames = ["Priya", "Amit", "Sara"]\nif len(names) > 2:\n    print(f"{len(names)} names")\n\n# With the walrus — computed once, used twice:\nif (count := len(names)) > 2:\n    print(f"{count} names")'),
      p('<p>It\'s a small convenience, not a feature you\'ll need constantly — reach for it when the same value would otherwise be computed twice in an <code>if</code> condition and its body.</p>'),
    ],
  },
  bn: {
    title: 'If, Elif, Else',
    metaTitle: 'Python If, Elif, Else | Learn Computer Academy',
    metaDescription: 'Python-এর কন্ডিশনাল স্টেটমেন্ট — if, elif, else, আর ternary শর্টকাট।',
    blocks: [
      p('<p>কন্ডিশনাল একটি স্ক্রিপ্টকে সিদ্ধান্ত নিতে দেয় — <a href="/bn/programming/if-statements/">প্রোগ্রামিং পরিচিতি</a>-তে শেখা একই ধারণা, Python-এর ইনডেন্টেশন-ভিত্তিক সিনট্যাক্স আর কন্ডিশনের চারপাশে কোনো বন্ধনী ছাড়াই।</p>'),

      h(2, 'if, elif, else', 'if-elif-else'),
      code('python', 'score = 72\nif score >= 90:\n    print("Grade: A")\nelif score >= 75:\n    print("Grade: B")\nelif score >= 60:\n    print("Grade: C")\nelse:\n    print("Grade: F")'),
      p('<p>Python মাঝের কেসটাকে <code>elif</code> বলে — <code>elseif</code> (PHP) নয় আর দুই শব্দের <code>else if</code>-ও নয়। অন্য ভাষা থেকে আসার সময় এটি সবচেয়ে সাধারণ টাইপোগুলোর একটি।</p>'),

      h(2, 'কোনো switch স্টেটমেন্ট নেই', 'no-switch-statement'),
      p('<p>PHP-এর <code>switch</code>-এর কোনো সরাসরি সমতুল্য Python-এ নেই (একটি প্রকৃত <code>match</code> স্টেটমেন্ট Python 3.10-এ যোগ হয়েছিল, কিন্তু একটি লম্বা <code>elif</code> চেইন এটি লেখার বেশি সাধারণ, পোর্টেবল উপায়):</p>'),
      code('python', 'day = "Mon"\nif day in ("Mon", "Tue", "Wed", "Thu", "Fri"):\n    print("Weekday")\nelif day in ("Sat", "Sun"):\n    print("Weekend")\nelse:\n    print("Not a valid day")'),
      p('<p><code>in (...)</code> — একটি মান কয়েকটির মধ্যে একটি কিনা চেক করা — PHP-এর স্ট্যাক করা <code>case</code> লেবেল যা করে তা লেখার idiomatic Python উপায়।</p>'),

      h(2, 'Ternary শর্টকাট', 'the-ternary-shortcut'),
      p('<p>একটি সংক্ষিপ্ত এক-লাইনের <code>if/else</code>, PHP-এর <code>?</code>/<code>:</code>-এর বদলে মাঝে কন্ডিশন দিয়ে:</p>'),
      code('python', 'age = 20\nstatus = "adult" if age >= 18 else "minor"\nprint(status)  # "adult"'),

      h(2, 'ব্যবহারিকভাবে Truthiness', 'truthiness-in-practice'),
      p('<p>Python-এর truthy/falsy নিয়মের কারণে (Type Conversion পাঠ থেকে), একটি লিস্ট বা স্ট্রিং খালি কিনা চেক করতে খুব কমই একটি length চেকের দরকার হয়:</p>'),
      code('python', 'items = []\nif items:\n    print("Has items")\nelse:\n    print("Empty")  # this runs — an empty list is falsy'),

      h(2, 'Walrus অপারেটর', 'the-walrus-operator'),
      p('<p><code>:=</code> — একজোড়া চোখ আর দাঁতের সাথে মিল থাকার কারণে <b>walrus operator</b> নামে ডাকা হয় — একই এক্সপ্রেশনে একটি মান assign করে <i>আর</i> সেটা রিটার্ন করে, Python 3.8-এ যোগ হয়েছে। এর কোনো PHP সমতুল্য নেই। এর সবচেয়ে সাধারণ ব্যবহার হলো একই জিনিস দুইবার কল করা এড়ানো:</p>'),
      code('python', '# Without the walrus — calling len() twice:\nnames = ["Priya", "Amit", "Sara"]\nif len(names) > 2:\n    print(f"{len(names)} names")\n\n# With the walrus — computed once, used twice:\nif (count := len(names)) > 2:\n    print(f"{count} names")'),
      p('<p>এটি একটি ছোট সুবিধা, ক্রমাগত দরকার হওয়া কোনো ফিচার নয় — একটি <code>if</code> কন্ডিশন আর তার body-তে একই মান নাহলে দুইবার হিসাব হতো এমন ক্ষেত্রে এটার দিকে যান।</p>'),
    ],
  },
})

lessons.push({
  slug: 'loops',
  sortOrder: 15,
  en: {
    title: 'Loops',
    metaTitle: 'Python Loops | Learn Computer Academy',
    metaDescription: 'Python\'s for and while loops, the range() function, and break/continue.',
    blocks: [
      p('<p>Python has two loop keywords — <code>for</code> and <code>while</code> — compared to PHP\'s four. <code>for</code> covers what PHP splits across <code>for</code> and <code>foreach</code>, since Python\'s <code>for</code> always loops over an iterable.</p>'),

      h(2, 'for'),
      p('<p>You already used this looping over lists and dictionaries. Looping a fixed number of times uses <code>range()</code>:</p>'),
      code('python', 'for i in range(5):\n    print(f"Count: {i}")  # 0, 1, 2, 3, 4 — range(5) stops before 5\n\nfor i in range(1, 6):\n    print(f"Count: {i}")  # 1, 2, 3, 4, 5'),
      p('<p>There is no C-style <code>for (i = 0; i < 5; i++)</code> in Python — <code>range()</code> is how you get a counted loop.</p>'),

      h(2, 'while'),
      p('<p>Repeats as long as a condition stays true — same idea as PHP\'s <code>while</code>:</p>'),
      code('python', 'count = 0\nwhile count < 3:\n    print(f"Iteration {count}")\n    count += 1  # Python has no ++ operator — this is the idiomatic way'),
      callout('note', '<p>Python has no <code>++</code> or <code>--</code> increment/decrement operators at all — <code>count += 1</code> is the only way to increase a variable by one. This is a deliberate language design choice, not an oversight.</p>', 'No ++ in Python'),

      h(2, 'No do-while'),
      p('<p>Python doesn\'t have PHP\'s <code>do-while</code>. The common workaround is a <code>while True</code> loop with a <code>break</code> at the point where the condition would normally be checked:</p>'),
      code('python', 'count = 10\nwhile True:\n    print(f"This runs once, even though {count} is not < 3.")\n    if not (count < 3):\n        break'),

      h(2, 'break and continue'),
      code('python', 'for i in range(1, 11):\n    if i == 6:\n        break       # stops the loop entirely\n    if i % 2 == 0:\n        continue    # skips this iteration, keeps looping\n    print(i, end=" ")\n# Output: 1 3 5'),

      h(2, 'The else Clause on a Loop'),
      p('<p>This one is genuinely Python-specific, with no PHP equivalent: a loop can have its own <code>else</code>, which runs if the loop finished normally — that is, only if <code>break</code> was <b>never</b> hit:</p>'),
      code('python', 'numbers = [2, 4, 6, 8]\nfor n in numbers:\n    if n % 2 != 0:\n        print("Found an odd number.")\n        break\nelse:\n    print("All numbers are even.")  # runs, since break never fired'),
      p('<p>It reads oddly at first, but it\'s a clean way to express "search for something, and do X only if it wasn\'t found" without a separate flag variable to track whether <code>break</code> happened.</p>'),
    ],
  },
  bn: {
    title: 'লুপ',
    metaTitle: 'Python লুপ | Learn Computer Academy',
    metaDescription: 'Python-এর for আর while লুপ, range() ফাংশন, আর break/continue।',
    blocks: [
      p('<p>PHP-এর চারটির তুলনায় Python-এ দুটো লুপ কীওয়ার্ড আছে — <code>for</code> আর <code>while</code>। <code>for</code> PHP যা <code>for</code> আর <code>foreach</code>-এর মধ্যে ভাগ করে তা কভার করে, কারণ Python-এর <code>for</code> সবসময় একটি iterable-এর উপর লুপ করে।</p>'),

      h(2, 'for', 'for'),
      p('<p>লিস্ট আর ডিকশনারির উপর লুপ করার সময় আপনি ইতিমধ্যেই এটি ব্যবহার করেছেন। নির্দিষ্ট সংখ্যকবার লুপ করতে <code>range()</code> ব্যবহার করা হয়:</p>'),
      code('python', 'for i in range(5):\n    print(f"Count: {i}")  # 0, 1, 2, 3, 4 — range(5) stops before 5\n\nfor i in range(1, 6):\n    print(f"Count: {i}")  # 1, 2, 3, 4, 5'),
      p('<p>Python-এ C-স্টাইলের <code>for (i = 0; i < 5; i++)</code> নেই — একটি গোনা লুপ পাওয়ার উপায় হলো <code>range()</code>।</p>'),

      h(2, 'while', 'while'),
      p('<p>একটি শর্ত true থাকা পর্যন্ত পুনরাবৃত্তি করে — PHP-এর <code>while</code>-এর একই ধারণা:</p>'),
      code('python', 'count = 0\nwhile count < 3:\n    print(f"Iteration {count}")\n    count += 1  # Python has no ++ operator — this is the idiomatic way'),
      callout('note', '<p>Python-এ একেবারেই কোনো <code>++</code> বা <code>--</code> increment/decrement অপারেটর নেই — একটি ভ্যারিয়েবলকে এক বাড়ানোর একমাত্র উপায় <code>count += 1</code>। এটি একটি ইচ্ছাকৃত ভাষা ডিজাইন সিদ্ধান্ত, কোনো ভুল নয়।</p>', 'Python-এ ++ নেই'),

      h(2, 'কোনো do-while নেই', 'no-do-while'),
      p('<p>Python-এ PHP-এর <code>do-while</code> নেই। সাধারণ সমাধান হলো একটি <code>while True</code> লুপ, যেখানে শর্তটি সাধারণত চেক হতো সেখানে একটি <code>break</code> দিয়ে:</p>'),
      code('python', 'count = 10\nwhile True:\n    print(f"This runs once, even though {count} is not < 3.")\n    if not (count < 3):\n        break'),

      h(2, 'break আর continue', 'break-and-continue'),
      code('python', 'for i in range(1, 11):\n    if i == 6:\n        break       # stops the loop entirely\n    if i % 2 == 0:\n        continue    # skips this iteration, keeps looping\n    print(i, end=" ")\n# Output: 1 3 5'),

      h(2, 'একটি লুপের উপর else ব্লক', 'the-else-clause-on-a-loop'),
      p('<p>এটি সত্যিকারভাবে Python-নির্দিষ্ট, কোনো PHP সমতুল্য ছাড়াই: একটি লুপের নিজের <code>else</code> থাকতে পারে, যা চলে যদি লুপটি স্বাভাবিকভাবে শেষ হয় — অর্থাৎ, শুধু যদি <code>break</code> <b>কখনো</b> না ঘটে:</p>'),
      code('python', 'numbers = [2, 4, 6, 8]\nfor n in numbers:\n    if n % 2 != 0:\n        print("Found an odd number.")\n        break\nelse:\n    print("All numbers are even.")  # runs, since break never fired'),
      p('<p>প্রথমে এটা অদ্ভুত মনে হয়, কিন্তু <code>break</code> ঘটেছিল কিনা ট্র্যাক করার জন্য একটি আলাদা flag ভ্যারিয়েবল ছাড়াই "কিছু খোঁজা, আর সেটা না পাওয়া গেলে X করা" প্রকাশ করার এটি একটি পরিষ্কার উপায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'functions',
  sortOrder: 16,
  en: {
    title: 'Functions',
    metaTitle: 'Python Functions | Learn Computer Academy',
    metaDescription: 'Defining Python functions with def — parameters, default values, and *args/**kwargs for flexible argument lists.',
    blocks: [
      p('<p>A function packages up logic so it can be reused by name — the same idea from <a href="/programming/functions/">Intro to Programming</a>, defined in Python with the <code>def</code> keyword.</p>'),

      h(2, 'Defining and Calling a Function'),
      code('python', 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Priya"))  # "Hello, Priya!"'),

      h(2, 'Default Parameter Values'),
      code('python', 'def greet(name="Guest"):\n    return f"Hello, {name}!"\n\nprint(greet())         # "Hello, Guest!"\nprint(greet("Amit"))   # "Hello, Amit!"'),

      h(2, 'Type Hints'),
      p('<p>Python lets you optionally annotate parameter and return types — unlike PHP\'s type declarations, these are <b>not enforced at runtime</b>; they\'re documentation and tooling support (your editor can catch a mismatch), not a hard rule the way PHP\'s <code>function add(int $a, int $b): int</code> is:</p>'),
      code('python', 'def add(a: int, b: int) -> int:\n    return a + b\n\nprint(add(2, 3))       # 5\nprint(add("2", "3"))  # "23" — no error! type hints don\'t stop this at runtime'),

      h(2, 'Multiple Return Values'),
      p('<p>A Python function can return more than one value directly, separated by commas — under the hood, this is really returning a tuple (from the Tuples and Sets lesson):</p>'),
      code('python', 'def min_max(numbers):\n    return min(numbers), max(numbers)\n\nlow, high = min_max([4, 9, 1, 7])\nprint(low, high)  # 1 9'),

      h(2, '*args and **kwargs'),
      p('<p>These let a function accept any number of arguments — <code>*args</code> collects extra positional arguments into a tuple, <code>**kwargs</code> collects extra named arguments into a dict:</p>'),
      code('python', 'def total(*numbers):\n    return sum(numbers)\n\nprint(total(1, 2, 3))       # 6\nprint(total(1, 2, 3, 4, 5)) # 15 — works with any number of arguments\n\ndef describe(**details):\n    for key, value in details.items():\n        print(f"{key}: {value}")\n\ndescribe(name="Priya", course="Web Development")'),

      h(2, 'Docstrings'),
      p('<p>A string literal placed as the very first line inside a function becomes its <b>docstring</b> — Python\'s built-in way to document what a function does, retrievable at runtime instead of just sitting in a comment:</p>'),
      code('python', 'def greet(name):\n    """Return a friendly greeting for the given name."""\n    return f"Hello, {name}!"\n\nprint(greet.__doc__)  # "Return a friendly greeting for the given name."\nhelp(greet)            # shows the same text, formatted nicely'),
      p('<p>Real Python projects write one on every function that isn\'t completely obvious — this is closer to a formal expectation than a nice-to-have, and tools like Sphinx can generate full documentation pages straight from docstrings.</p>'),
    ],
  },
  bn: {
    title: 'ফাংশন',
    metaTitle: 'Python ফাংশন | Learn Computer Academy',
    metaDescription: 'def দিয়ে Python ফাংশন সংজ্ঞায়িত করা — প্যারামিটার, ডিফল্ট মান, আর নমনীয় আর্গুমেন্ট তালিকার জন্য *args/**kwargs।',
    blocks: [
      p('<p>একটি ফাংশন লজিক প্যাকেজ করে যাতে সেটা নাম দিয়ে পুনঃব্যবহার করা যায় — <a href="/bn/programming/functions/">প্রোগ্রামিং পরিচিতি</a>-তে শেখা একই ধারণা, Python-এ <code>def</code> কীওয়ার্ড দিয়ে সংজ্ঞায়িত।</p>'),

      h(2, 'একটি ফাংশন সংজ্ঞায়িত করা আর কল করা', 'defining-and-calling-a-function'),
      code('python', 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Priya"))  # "Hello, Priya!"'),

      h(2, 'ডিফল্ট প্যারামিটার মান', 'default-parameter-values'),
      code('python', 'def greet(name="Guest"):\n    return f"Hello, {name}!"\n\nprint(greet())         # "Hello, Guest!"\nprint(greet("Amit"))   # "Hello, Amit!"'),

      h(2, 'টাইপ হিন্ট', 'type-hints'),
      p('<p>Python আপনাকে ঐচ্ছিকভাবে প্যারামিটার আর রিটার্ন টাইপ annotate করতে দেয় — PHP-এর টাইপ ডিক্লারেশন থেকে আলাদা, এগুলো <b>রানটাইমে প্রয়োগ করা হয় না</b>; এগুলো ডকুমেন্টেশন আর টুলিং সাপোর্ট (আপনার এডিটর একটি অমিল ধরতে পারে), PHP-এর <code>function add(int $a, int $b): int</code>-এর মতো একটি কঠোর নিয়ম নয়:</p>'),
      code('python', 'def add(a: int, b: int) -> int:\n    return a + b\n\nprint(add(2, 3))       # 5\nprint(add("2", "3"))  # "23" — no error! type hints don\'t stop this at runtime'),

      h(2, 'একাধিক রিটার্ন মান', 'multiple-return-values'),
      p('<p>একটি Python ফাংশন সরাসরি একাধিক মান রিটার্ন করতে পারে, কমা দিয়ে আলাদা করে — ভেতরে, এটি আসলে একটি tuple রিটার্ন করছে (Tuples and Sets পাঠ থেকে):</p>'),
      code('python', 'def min_max(numbers):\n    return min(numbers), max(numbers)\n\nlow, high = min_max([4, 9, 1, 7])\nprint(low, high)  # 1 9'),

      h(2, '*args আর **kwargs', 'args-and-kwargs'),
      p('<p>এগুলো একটি ফাংশনকে যেকোনো সংখ্যক আর্গুমেন্ট গ্রহণ করতে দেয় — <code>*args</code> অতিরিক্ত positional আর্গুমেন্ট একটি tuple-এ জড়ো করে, <code>**kwargs</code> অতিরিক্ত named আর্গুমেন্ট একটি dict-এ জড়ো করে:</p>'),
      code('python', 'def total(*numbers):\n    return sum(numbers)\n\nprint(total(1, 2, 3))       # 6\nprint(total(1, 2, 3, 4, 5)) # 15 — works with any number of arguments\n\ndef describe(**details):\n    for key, value in details.items():\n        print(f"{key}: {value}")\n\ndescribe(name="Priya", course="Web Development")'),

      h(2, 'Docstring', 'docstrings'),
      p('<p>একটি ফাংশনের ভেতরে একদম প্রথম লাইন হিসেবে বসানো একটি স্ট্রিং লিটারেল এর <b>docstring</b> হয়ে যায় — একটি ফাংশন কী করে তা ডকুমেন্ট করার Python-এর বিল্ট-ইন উপায়, শুধু একটি কমেন্টে বসে থাকার বদলে রানটাইমে পাওয়া যায়:</p>'),
      code('python', 'def greet(name):\n    """Return a friendly greeting for the given name."""\n    return f"Hello, {name}!"\n\nprint(greet.__doc__)  # "Return a friendly greeting for the given name."\nhelp(greet)            # shows the same text, formatted nicely'),
      p('<p>বাস্তব Python প্রজেক্ট প্রতিটি ফাংশনে একটি করে লেখে যা সম্পূর্ণভাবে স্পষ্ট নয় — এটা একটি ভালো-থাকলে-হয়-এর চেয়ে বেশি একটি আনুষ্ঠানিক প্রত্যাশার কাছাকাছি, আর Sphinx-এর মতো টুল docstring থেকে সরাসরি সম্পূর্ণ ডকুমেন্টেশন পেজ তৈরি করতে পারে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'lambda-functions',
  sortOrder: 17,
  en: {
    title: 'Lambda Functions',
    metaTitle: 'Python Lambda Functions | Learn Computer Academy',
    metaDescription: 'Small, anonymous one-expression functions in Python, and where they\'re genuinely useful.',
    blocks: [
      p('<p>A <b>lambda</b> is a small, unnamed function limited to a single expression — Python\'s equivalent of PHP\'s arrow functions (<code>fn</code>).</p>'),

      h(2, 'Basic Syntax'),
      code('python', 'double = lambda n: n * 2\nprint(double(5))  # 10\n\n# Equivalent to:\ndef double(n):\n    return n * 2'),
      p('<p>A lambda can take multiple arguments, but its body is always exactly one expression — no statements, no multiple lines.</p>'),

      h(2, 'Where Lambdas Actually Get Used'),
      p('<p>Lambdas are rarely assigned to a variable the way the example above does (a regular <code>def</code> reads better for anything with a name) — their real use is as a throwaway function passed directly into something else, most commonly <code>sorted()</code>\'s <code>key</code> argument:</p>'),
      code('python', 'students = [\n    {"name": "Priya", "age": 21},\n    {"name": "Amit", "age": 19},\n]\n\n# Sort by age, using a lambda to say "compare by this"\nstudents_sorted = sorted(students, key=lambda s: s["age"])\nprint(students_sorted)'),
      p('<p><code>key=lambda s: s["age"]</code> tells <code>sorted()</code> what to compare, without needing a separately-named function defined elsewhere just for this one sort.</p>'),

      h(2, 'map() and filter()'),
      p('<p>PHP\'s <code>array_map()</code> and <code>array_filter()</code> have direct Python equivalents, often paired with a lambda — though a list comprehension (from the earlier lesson) does the same job and is usually considered more readable in modern Python:</p>'),
      code('python', 'numbers = [1, 2, 3, 4, 5]\n\ndoubled = list(map(lambda n: n * 2, numbers))\nprint(doubled)  # [2, 4, 6, 8, 10]\n\n# The more idiomatic Python way to write the same thing:\ndoubled = [n * 2 for n in numbers]'),
      p('<p><code>filter()</code> is the other half — it keeps only the items where the lambda returns something truthy, the same role as PHP\'s <code>array_filter()</code>:</p>'),
      code('python', 'numbers = [1, 2, 3, 4, 5, 6]\n\neven = list(filter(lambda n: n % 2 == 0, numbers))\nprint(even)  # [2, 4, 6]\n\n# The more idiomatic Python way to write the same thing:\neven = [n for n in numbers if n % 2 == 0]'),
      p('<p>Both <code>map()</code> and <code>filter()</code> return a lazy iterator, not a list directly — which is why <code>list(...)</code> wraps them above to actually see the results.</p>'),
    ],
  },
  bn: {
    title: 'ল্যাম্বডা ফাংশন',
    metaTitle: 'Python ল্যাম্বডা ফাংশন | Learn Computer Academy',
    metaDescription: 'Python-এ ছোট, anonymous একক-এক্সপ্রেশন ফাংশন, আর কোথায় এগুলো সত্যিকারভাবে দরকারি।',
    blocks: [
      p('<p>একটি <b>lambda</b> হলো একটি ছোট, নামহীন ফাংশন যা একটি একক এক্সপ্রেশনে সীমাবদ্ধ — PHP-এর অ্যারো ফাংশনের (<code>fn</code>) Python সমতুল্য।</p>'),

      h(2, 'বেসিক সিনট্যাক্স', 'basic-syntax'),
      code('python', 'double = lambda n: n * 2\nprint(double(5))  # 10\n\n# Equivalent to:\ndef double(n):\n    return n * 2'),
      p('<p>একটি lambda একাধিক আর্গুমেন্ট নিতে পারে, কিন্তু এর body সবসময় ঠিক একটি এক্সপ্রেশন — কোনো স্টেটমেন্ট নেই, একাধিক লাইন নেই।</p>'),

      h(2, 'Lambda আসলে কোথায় ব্যবহৃত হয়', 'where-lambdas-actually-get-used'),
      p('<p>উপরের উদাহরণের মতো একটি lambda খুব কমই একটি ভ্যারিয়েবলে assign করা হয় (নাম থাকা যেকোনো কিছুর জন্য একটি সাধারণ <code>def</code> ভালো পড়া যায়) — এদের আসল ব্যবহার হলো সরাসরি অন্য কিছুতে পাস করা একটি এক-বার-ব্যবহারযোগ্য ফাংশন হিসেবে, সবচেয়ে সাধারণভাবে <code>sorted()</code>-এর <code>key</code> আর্গুমেন্টে:</p>'),
      code('python', 'students = [\n    {"name": "Priya", "age": 21},\n    {"name": "Amit", "age": 19},\n]\n\n# Sort by age, using a lambda to say "compare by this"\nstudents_sorted = sorted(students, key=lambda s: s["age"])\nprint(students_sorted)'),
      p('<p><code>key=lambda s: s["age"]</code> <code>sorted()</code>-কে বলে দেয় কী তুলনা করতে হবে, শুধু এই একটি সর্টের জন্য অন্য কোথাও আলাদাভাবে-নামযুক্ত একটি ফাংশন সংজ্ঞায়িত করার দরকার ছাড়াই।</p>'),

      h(2, 'map() আর filter()', 'map-and-filter'),
      p('<p>PHP-এর <code>array_map()</code> আর <code>array_filter()</code>-এর সরাসরি Python সমতুল্য আছে, প্রায়ই একটি lambda-এর সাথে জোড়া — যদিও একটি list comprehension (আগের পাঠ থেকে) একই কাজ করে আর আধুনিক Python-এ সাধারণত বেশি পঠনযোগ্য মনে করা হয়:</p>'),
      code('python', 'numbers = [1, 2, 3, 4, 5]\n\ndoubled = list(map(lambda n: n * 2, numbers))\nprint(doubled)  # [2, 4, 6, 8, 10]\n\n# The more idiomatic Python way to write the same thing:\ndoubled = [n * 2 for n in numbers]'),
      p('<p><code>filter()</code> হলো বাকি অর্ধেক — এটি শুধু সেই আইটেমগুলো রাখে যেখানে lambda truthy কিছু রিটার্ন করে, PHP-এর <code>array_filter()</code>-এর একই ভূমিকা:</p>'),
      code('python', 'numbers = [1, 2, 3, 4, 5, 6]\n\neven = list(filter(lambda n: n % 2 == 0, numbers))\nprint(even)  # [2, 4, 6]\n\n# The more idiomatic Python way to write the same thing:\neven = [n for n in numbers if n % 2 == 0]'),
      p('<p><code>map()</code> আর <code>filter()</code> দুটোই সরাসরি একটি লিস্ট নয়, একটি lazy iterator রিটার্ন করে — যে কারণে ফলাফল আসলে দেখতে উপরে <code>list(...)</code> দিয়ে এদের মুড়িয়ে দেওয়া হয়েছে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'scope',
  sortOrder: 18,
  en: {
    title: 'Variable Scope',
    metaTitle: 'Python Variable Scope | Learn Computer Academy',
    metaDescription: 'Where a Python variable is visible from — local vs. global scope, and the global keyword.',
    blocks: [
      p('<p><b>Scope</b> is where in your code a variable can be seen and used — the same idea from <a href="/programming/scope/">Intro to Programming</a>, and Python\'s rules land close to PHP\'s, with one meaningful difference.</p>'),

      h(2, 'Local Scope'),
      p('<p>A variable created inside a function only exists inside that function, exactly like PHP:</p>'),
      code('python', 'def set_name():\n    name = "Priya"  # local to set_name()\n    print(name)      # works fine here\n\nset_name()\n# print(name)  # NameError — name doesn\'t exist out here'),

      h(2, 'Reading a Global Is Automatic'),
      p('<p>Here\'s the difference from PHP: a Python function <b>can</b> read a global variable without any special keyword — PHP requires <code>global</code> just to read one, Python only requires it to <i>reassign</i> one:</p>'),
      code('python', 'site_name = "Learn Computer Academy"\n\ndef show_name():\n    print(site_name)  # works — reading a global needs nothing special\n\nshow_name()'),

      h(2, 'The global Keyword — Only for Reassignment'),
      p('<p>Assigning to a name inside a function makes Python treat it as local by default — <i>even if</i> a global with the same name exists. <code>global</code> is required to override that and reassign the actual global variable:</p>'),
      code('python', 'count = 0\n\ndef increment_broken():\n    count = count + 1  # UnboundLocalError — count is treated as local here,\n                        # and it hasn\'t been assigned yet at this point\n\ndef increment():\n    global count\n    count = count + 1  # now this correctly modifies the global\n\nincrement()\nprint(count)  # 1'),
      callout('tip', '<p>Relying on <code>global</code> throughout a codebase makes it hard to trace where a value actually comes from — same caveat as PHP. The cleaner, more common pattern is passing the value in as a parameter and returning the new value, rather than mutating a global directly.</p>', 'Prefer parameters over global'),

      h(2, 'Function-Level Scope, Not Block-Level'),
      p('<p>One more real difference from some languages: a variable created inside an <code>if</code> or <code>for</code> block in Python is <b>not</b> limited to that block — it\'s visible for the rest of the enclosing function:</p>'),
      code('python', 'def check(n):\n    if n > 0:\n        result = "positive"\n    print(result)  # this works even outside the if block, as long as n > 0 ran\n\ncheck(5)  # "positive"'),

      h(2, 'nonlocal for a Function Inside a Function'),
      p('<p>A function defined inside another function can read its enclosing function\'s variables automatically — same rule as reading a global. To reassign one, <code>nonlocal</code> is the equivalent of <code>global</code> one level up, rather than jumping all the way to global scope:</p>'),
      code('python', 'def make_counter():\n    count = 0\n\n    def increment():\n        nonlocal count\n        count += 1\n        return count\n\n    return increment\n\ncounter = make_counter()\nprint(counter())  # 1\nprint(counter())  # 2 — count is remembered between calls'),
      p('<p>This pattern — a function returning another function that remembers state — is called a <b>closure</b>. It\'s a genuinely useful trick, but a niche one; don\'t worry if it takes a re-read to click.</p>'),
    ],
  },
  bn: {
    title: 'ভ্যারিয়েবল স্কোপ',
    metaTitle: 'Python ভ্যারিয়েবল স্কোপ | Learn Computer Academy',
    metaDescription: 'একটি Python ভ্যারিয়েবল কোথা থেকে দেখা যায় — লোকাল বনাম গ্লোবাল স্কোপ, আর global কীওয়ার্ড।',
    blocks: [
      p('<p><b>স্কোপ</b> মানে আপনার কোডের কোথা থেকে একটি ভ্যারিয়েবল দেখা আর ব্যবহার করা যায় — <a href="/bn/programming/scope/">প্রোগ্রামিং পরিচিতি</a>-তে শেখা একই ধারণা, আর Python-এর নিয়ম PHP-এর কাছাকাছি, একটি অর্থবহ পার্থক্যসহ।</p>'),

      h(2, 'লোকাল স্কোপ', 'local-scope'),
      p('<p>একটি ফাংশনের ভেতরে তৈরি হওয়া ভ্যারিয়েবল শুধু সেই ফাংশনের ভেতরেই থাকে, ঠিক PHP-এর মতো:</p>'),
      code('python', 'def set_name():\n    name = "Priya"  # local to set_name()\n    print(name)      # works fine here\n\nset_name()\n# print(name)  # NameError — name doesn\'t exist out here'),

      h(2, 'একটি গ্লোবাল পড়া স্বয়ংক্রিয়', 'reading-a-global-is-automatic'),
      p('<p>এখানেই PHP থেকে পার্থক্য: একটি Python ফাংশন কোনো বিশেষ কীওয়ার্ড ছাড়াই একটি গ্লোবাল ভ্যারিয়েবল পড়তে <b>পারে</b> — PHP-তে শুধু একটি পড়তেও <code>global</code> দরকার, Python-এ শুধু একটি <i>পুনরায় assign</i> করতে এটি দরকার:</p>'),
      code('python', 'site_name = "Learn Computer Academy"\n\ndef show_name():\n    print(site_name)  # works — reading a global needs nothing special\n\nshow_name()'),

      h(2, 'global কীওয়ার্ড — শুধু পুনরায় Assign করার জন্য', 'the-global-keyword-only-for-reassignment'),
      p('<p>একটি ফাংশনের ভেতরে একটি নামে assign করলে Python ডিফল্টভাবে সেটাকে লোকাল হিসেবে গণ্য করে — <i>এমনকি</i> একই নামের একটি গ্লোবাল থাকলেও। এটা override করে আসল গ্লোবাল ভ্যারিয়েবলে পুনরায় assign করতে <code>global</code> দরকার:</p>'),
      code('python', 'count = 0\n\ndef increment_broken():\n    count = count + 1  # UnboundLocalError — count is treated as local here,\n                        # and it hasn\'t been assigned yet at this point\n\ndef increment():\n    global count\n    count = count + 1  # now this correctly modifies the global\n\nincrement()\nprint(count)  # 1'),
      callout('tip', '<p>পুরো একটি কোডবেসে <code>global</code>-এর উপর নির্ভর করলে একটি মান আসলে কোথা থেকে আসছে তা খুঁজে বের করা কঠিন হয়ে যায় — PHP-এর মতো একই সতর্কতা। পরিষ্কার, বেশি প্রচলিত প্যাটার্ন হলো মানটিকে একটি প্যারামিটার হিসেবে পাস করা আর নতুন মান রিটার্ন করা, সরাসরি একটি গ্লোবাল পরিবর্তন করার বদলে।</p>', 'global-এর বদলে প্যারামিটার প্রাধান্য দিন'),

      h(2, 'ফাংশন-লেভেল স্কোপ, ব্লক-লেভেল নয়', 'function-level-scope-not-block-level'),
      p('<p>কিছু ভাষা থেকে আরেকটি আসল পার্থক্য: Python-এ একটি <code>if</code> বা <code>for</code> ব্লকের ভেতরে তৈরি হওয়া একটি ভ্যারিয়েবল সেই ব্লকে সীমাবদ্ধ <b>নয়</b> — এটি ঘিরে থাকা ফাংশনের বাকি অংশের জন্য দৃশ্যমান:</p>'),
      code('python', 'def check(n):\n    if n > 0:\n        result = "positive"\n    print(result)  # this works even outside the if block, as long as n > 0 ran\n\ncheck(5)  # "positive"'),

      h(2, 'একটি ফাংশনের ভেতরে একটি ফাংশনের জন্য nonlocal', 'nonlocal-for-a-function-inside-a-function'),
      p('<p>আরেকটি ফাংশনের ভেতরে সংজ্ঞায়িত একটি ফাংশন স্বয়ংক্রিয়ভাবে তার ঘিরে থাকা ফাংশনের ভ্যারিয়েবল পড়তে পারে — একটি গ্লোবাল পড়ার একই নিয়ম। একটিতে পুনরায় assign করতে, <code>nonlocal</code> সরাসরি গ্লোবাল স্কোপে না গিয়ে এক লেভেল উপরে <code>global</code>-এর সমতুল্য:</p>'),
      code('python', 'def make_counter():\n    count = 0\n\n    def increment():\n        nonlocal count\n        count += 1\n        return count\n\n    return increment\n\ncounter = make_counter()\nprint(counter())  # 1\nprint(counter())  # 2 — count is remembered between calls'),
      p('<p>এই প্যাটার্ন — একটি ফাংশন আরেকটি ফাংশন রিটার্ন করছে যা state মনে রাখে — একে বলা হয় একটি <b>closure</b>। এটি সত্যিকারভাবে দরকারি একটি কৌশল, কিন্তু একটি নিশ কৌশল; বুঝতে আরেকবার পড়তে হলে চিন্তা করবেন না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'modules-and-imports',
  sortOrder: 19,
  en: {
    title: 'Modules and Imports',
    metaTitle: 'Python Modules and Imports | Learn Computer Academy',
    metaDescription: 'Using Python\'s standard library and third-party packages with import, and installing packages with pip.',
    blocks: [
      p('<p>A huge part of Python\'s practical usefulness comes from code you don\'t have to write yourself — the <b>standard library</b> ships with Python itself, and <b>pip</b> installs anything else from the wider Python community.</p>'),

      h(2, 'Importing from the Standard Library'),
      p('<p>You already used this with the <code>math</code> module. <code>import</code> makes a whole module available; <code>from ... import ...</code> pulls out just what you need:</p>'),
      code('python', 'import math\nprint(math.sqrt(64))\n\nfrom math import sqrt\nprint(sqrt(64))  # same result, no math. prefix needed'),
      p('<p>The standard library is large and covers a lot of everyday needs — <code>random</code> (random numbers), <code>datetime</code> (dates, covered in its own lesson soon), <code>json</code> (reading/writing JSON), <code>os</code> (interacting with the operating system), among many others. The <a href="https://docs.python.org/3/library/index.html" target="_blank" rel="noopener noreferrer">full standard library reference is on python.org</a>.</p>'),

      img(
        'docs/img/python/modules-1',
        'Isometric diagram showing a Python script icon in the center with arrows pulling in modules from two labeled source groups on either side, one representing the built-in standard library and one representing external packages',
        1024, 768,
        'A script can pull in code from the built-in standard library, or from packages installed separately.'
      ),

      h(2, 'Aliasing an Import'),
      p('<p><code>as</code> renames an import — useful for a long module name you\'ll type repeatedly. It\'s so standard for a few libraries that the alias is effectively part of how everyone writes them:</p>'),
      code('python', 'import math as m\nprint(m.sqrt(64))  # 8.0 — same module, shorter name\n\n# You\'ll see these exact aliases constantly once you reach data/AI libraries:\n# import pandas as pd\n# import numpy as np'),

      h(2, 'Third-Party Packages with pip'),
      p('<p>Anything not in the standard library — a web framework, a data analysis library, an HTTP client — is installed with <b>pip</b>, Python\'s package manager, roughly equivalent to what npm is for JavaScript:</p>'),
      code('bash', 'pip install requests'),
      code('python', 'import requests\n\nresponse = requests.get("https://api.example.com/data")\nprint(response.status_code)'),

      h(2, 'Your Own Modules'),
      p('<p>Any <code>.py</code> file can be imported by another — this is Python\'s equivalent of PHP\'s <code>require_once</code> for splitting code across files:</p>'),
      code('python', '# helpers.py\ndef greet(name):\n    return f"Hello, {name}!"'),
      code('python', '# main.py\nfrom helpers import greet\n\nprint(greet("Priya"))'),

      callout('note', '<p>Real Python projects almost always use a <b>virtual environment</b> to keep each project\'s installed packages separate from every other project\'s — covered properly in the "Where to Go Next" lesson at the end of this section, since it\'s more of a workflow habit than a language feature.</p>', 'Virtual environments come later'),
    ],
  },
  bn: {
    title: 'মডিউল আর ইম্পোর্ট',
    metaTitle: 'Python মডিউল আর ইম্পোর্ট | Learn Computer Academy',
    metaDescription: 'import দিয়ে Python-এর স্ট্যান্ডার্ড লাইব্রেরি আর থার্ড-পার্টি প্যাকেজ ব্যবহার করা, আর pip দিয়ে প্যাকেজ ইনস্টল করা।',
    blocks: [
      p('<p>Python-এর ব্যবহারিক উপযোগিতার একটি বিশাল অংশ আসে এমন কোড থেকে যা আপনাকে নিজে লিখতে হয় না — <b>স্ট্যান্ডার্ড লাইব্রেরি</b> Python-এর সাথেই আসে, আর <b>pip</b> বৃহত্তর Python কমিউনিটি থেকে অন্য যেকোনো কিছু ইনস্টল করে।</p>'),

      h(2, 'স্ট্যান্ডার্ড লাইব্রেরি থেকে ইম্পোর্ট করা', 'importing-from-the-standard-library'),
      p('<p><code>math</code> মডিউলের সাথে আপনি এটি ইতিমধ্যেই ব্যবহার করেছেন। <code>import</code> একটি পুরো মডিউল উপলব্ধ করে; <code>from ... import ...</code> শুধু যা প্রয়োজন তা বের করে আনে:</p>'),
      code('python', 'import math\nprint(math.sqrt(64))\n\nfrom math import sqrt\nprint(sqrt(64))  # same result, no math. prefix needed'),
      p('<p>স্ট্যান্ডার্ড লাইব্রেরি বড় আর প্রতিদিনের অনেক প্রয়োজন কভার করে — <code>random</code> (র‍্যান্ডম সংখ্যা), <code>datetime</code> (তারিখ, শীঘ্রই নিজের পাঠে), <code>json</code> (JSON পড়া/লেখা), <code>os</code> (অপারেটিং সিস্টেমের সাথে ইন্টারঅ্যাক্ট করা), আরও অনেক কিছুর মধ্যে। <a href="https://docs.python.org/3/library/index.html" target="_blank" rel="noopener noreferrer">সম্পূর্ণ স্ট্যান্ডার্ড লাইব্রেরি রেফারেন্স python.org-এ</a> আছে।</p>'),

      img(
        'docs/img/python/modules-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে কেন্দ্রে একটি Python স্ক্রিপ্ট আইকন দেখানো হয়েছে, তীরচিহ্ন দুই পাশের দুটো লেবেলযুক্ত উৎস গ্রুপ থেকে মডিউল টেনে আনছে, একটি বিল্ট-ইন স্ট্যান্ডার্ড লাইব্রেরি বোঝায় আর একটি বাহ্যিক প্যাকেজ বোঝায়',
        1024, 768,
        'একটি স্ক্রিপ্ট বিল্ট-ইন স্ট্যান্ডার্ড লাইব্রেরি থেকে, অথবা আলাদাভাবে ইনস্টল করা প্যাকেজ থেকে কোড টেনে আনতে পারে।'
      ),

      h(2, 'একটি ইম্পোর্ট Alias করা', 'aliasing-an-import'),
      p('<p><code>as</code> একটি ইম্পোর্টের নাম বদলায় — একটি লম্বা মডিউল নামের জন্য দরকারি যা আপনি বারবার টাইপ করবেন। কয়েকটি লাইব্রেরির জন্য এটা এতটাই প্রচলিত যে alias-টাই কার্যকরভাবে সবাই এগুলো লেখার একটি অংশ হয়ে গেছে:</p>'),
      code('python', 'import math as m\nprint(m.sqrt(64))  # 8.0 — same module, shorter name\n\n# You\'ll see these exact aliases constantly once you reach data/AI libraries:\n# import pandas as pd\n# import numpy as np'),

      h(2, 'pip দিয়ে থার্ড-পার্টি প্যাকেজ', 'third-party-packages-with-pip'),
      p('<p>স্ট্যান্ডার্ড লাইব্রেরিতে নেই এমন যেকোনো কিছু — একটি ওয়েব ফ্রেমওয়ার্ক, একটি ডেটা বিশ্লেষণ লাইব্রেরি, একটি HTTP ক্লায়েন্ট — <b>pip</b> দিয়ে ইনস্টল করা হয়, Python-এর প্যাকেজ ম্যানেজার, মোটামুটি JavaScript-এর জন্য npm যা তার সমতুল্য:</p>'),
      code('bash', 'pip install requests'),
      code('python', 'import requests\n\nresponse = requests.get("https://api.example.com/data")\nprint(response.status_code)'),

      h(2, 'আপনার নিজের মডিউল', 'your-own-modules'),
      p('<p>যেকোনো <code>.py</code> ফাইল আরেকটি দিয়ে ইম্পোর্ট করা যায় — একাধিক ফাইল জুড়ে কোড ভাগ করার জন্য PHP-এর <code>require_once</code>-এর Python সমতুল্য:</p>'),
      code('python', '# helpers.py\ndef greet(name):\n    return f"Hello, {name}!"'),
      code('python', '# main.py\nfrom helpers import greet\n\nprint(greet("Priya"))'),

      callout('note', '<p>বাস্তব Python প্রজেক্ট প্রায় সবসময় একটি <b>virtual environment</b> ব্যবহার করে প্রতিটি প্রজেক্টের ইনস্টল করা প্যাকেজকে অন্য প্রতিটি প্রজেক্ট থেকে আলাদা রাখতে — এই অংশের শেষে "Where to Go Next" পাঠে ভালোভাবে দেখানো হবে, কারণ এটি একটি ভাষা ফিচারের চেয়ে বেশি একটি ওয়ার্কফ্লো অভ্যাস।</p>', 'Virtual environment পরে আসছে'),
    ],
  },
})

lessons.push({
  slug: 'exception-handling',
  sortOrder: 20,
  en: {
    title: 'Exception Handling',
    metaTitle: 'Python Exception Handling | Learn Computer Academy',
    metaDescription: 'Handling errors gracefully in Python with try, except, else, and finally.',
    blocks: [
      p('<p>Things go wrong at runtime — a file might not exist, user input might not be what was expected. Python\'s <code>try</code>/<code>except</code> handles this gracefully instead of crashing outright, the same idea as PHP\'s <code>try</code>/<code>catch</code>, with a couple of extra pieces.</p>'),

      h(2, 'try and except'),
      code('python', 'def divide(a, b):\n    if b == 0:\n        raise ValueError("Cannot divide by zero.")\n    return a / b\n\ntry:\n    print(divide(10, 0))\nexcept ValueError as e:\n    print(f"Error: {e}")'),
      p('<p><code>raise</code> is Python\'s equivalent of PHP\'s <code>throw</code>; <code>except</code> is the equivalent of <code>catch</code>.</p>'),

      h(2, 'Catching Specific Exception Types'),
      code('python', 'try:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f"Specifically caught: {e}")\nexcept Exception as e:\n    print(f"General error: {e}")'),
      p('<p>Just like PHP, order matters — a specific exception type should come before a more general one that would otherwise catch it first.</p>'),

      h(2, 'else and finally'),
      p('<p>Python adds an <code>else</code> block PHP doesn\'t have: it runs only if <b>no</b> exception was raised. <code>finally</code> runs either way, exactly like PHP\'s:</p>'),
      code('python', 'try:\n    result = divide(10, 2)\nexcept ValueError as e:\n    print(f"Error: {e}")\nelse:\n    print(f"Success: {result}")  # only runs if no exception happened\nfinally:\n    print("Done.")  # always runs'),

      h(2, 'Catching Multiple Types at Once'),
      code('python', 'try:\n    value = int("not a number")\nexcept (ValueError, TypeError) as e:\n    print(f"Bad input: {e}")'),

      h(2, 'Avoid a Bare except'),
      p('<p>Writing <code>except:</code> with no type at all catches literally everything, including mistakes you\'d actually want to see — a typo\'d variable name, a missing import. It silently hides bugs instead of surfacing them:</p>'),
      code('python', '# Avoid this — catches every possible error, including your own bugs:\ntry:\n    risky_operation()\nexcept:\n    pass\n\n# Prefer this — catches runtime problems, but a real code bug still surfaces:\ntry:\n    risky_operation()\nexcept Exception as e:\n    print(f"Something went wrong: {e}")'),
      p('<p><code>except Exception</code> is about as broad as you should normally go — it still lets Python\'s own internal signals (like the one used by <code>Ctrl+C</code>) through, which a bare <code>except:</code> would swallow too.</p>'),

      callout('warning', '<p>An uncaught exception on a real, deployed Python program prints a full traceback — file paths, line numbers, sometimes variable values — which is invaluable for you while developing, but should never be shown directly to an end user. Wrapping risky operations (file access, network requests, user input parsing) in <code>try</code>/<code>except</code> is what turns that into a clean, controlled message instead.</p>', 'Tracebacks are for developers, not users'),
    ],
  },
  bn: {
    title: 'এক্সসেপশন হ্যান্ডলিং',
    metaTitle: 'Python এক্সসেপশন হ্যান্ডলিং | Learn Computer Academy',
    metaDescription: 'try, except, else, আর finally দিয়ে Python-এ সুন্দরভাবে এরর হ্যান্ডেল করা।',
    blocks: [
      p('<p>রানটাইমে জিনিস ভুল হয় — একটি ফাইল হয়তো নেই, ব্যবহারকারীর ইনপুট হয়তো যা প্রত্যাশিত ছিল তা নয়। Python-এর <code>try</code>/<code>except</code> সরাসরি ক্র্যাশ করার বদলে এটি সুন্দরভাবে হ্যান্ডেল করে, PHP-এর <code>try</code>/<code>catch</code>-এর একই ধারণা, কয়েকটি অতিরিক্ত অংশসহ।</p>'),

      h(2, 'try আর except', 'try-and-except'),
      code('python', 'def divide(a, b):\n    if b == 0:\n        raise ValueError("Cannot divide by zero.")\n    return a / b\n\ntry:\n    print(divide(10, 0))\nexcept ValueError as e:\n    print(f"Error: {e}")'),
      p('<p><code>raise</code> হলো PHP-এর <code>throw</code>-এর Python সমতুল্য; <code>except</code> হলো <code>catch</code>-এর সমতুল্য।</p>'),

      h(2, 'নির্দিষ্ট Exception টাইপ ধরা', 'catching-specific-exception-types'),
      code('python', 'try:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f"Specifically caught: {e}")\nexcept Exception as e:\n    print(f"General error: {e}")'),
      p('<p>PHP-এর মতোই, ক্রম গুরুত্বপূর্ণ — একটি নির্দিষ্ট exception টাইপ একটি বেশি সাধারণ টাইপের আগে থাকা উচিত যা নাহলে সেটাকে আগে ধরে ফেলত।</p>'),

      h(2, 'else আর finally', 'else-and-finally'),
      p('<p>Python একটি <code>else</code> ব্লক যোগ করে যা PHP-তে নেই: এটি শুধু চলে যদি <b>কোনো</b> exception না ওঠে। <code>finally</code> যেকোনো অবস্থাতেই চলে, ঠিক PHP-এর মতো:</p>'),
      code('python', 'try:\n    result = divide(10, 2)\nexcept ValueError as e:\n    print(f"Error: {e}")\nelse:\n    print(f"Success: {result}")  # only runs if no exception happened\nfinally:\n    print("Done.")  # always runs'),

      h(2, 'একসাথে একাধিক টাইপ ধরা', 'catching-multiple-types-at-once'),
      code('python', 'try:\n    value = int("not a number")\nexcept (ValueError, TypeError) as e:\n    print(f"Bad input: {e}")'),

      h(2, 'একটি Bare except এড়িয়ে চলুন', 'avoid-a-bare-except'),
      p('<p>কোনো টাইপ ছাড়াই <code>except:</code> লেখা আক্ষরিক অর্থে সবকিছু ধরে, এমনকি এমন ভুলও যা আপনি আসলে দেখতে চাইতেন — একটি টাইপো হওয়া ভ্যারিয়েবল নাম, একটি অনুপস্থিত import। এটা বাগগুলো সামনে আনার বদলে চুপচাপ লুকিয়ে ফেলে:</p>'),
      code('python', '# Avoid this — catches every possible error, including your own bugs:\ntry:\n    risky_operation()\nexcept:\n    pass\n\n# Prefer this — catches runtime problems, but a real code bug still surfaces:\ntry:\n    risky_operation()\nexcept Exception as e:\n    print(f"Something went wrong: {e}")'),
      p('<p><code>except Exception</code> সাধারণত যতটা প্রশস্ত হওয়া উচিত ততটাই — এটি এখনও Python-এর নিজস্ব অভ্যন্তরীণ সংকেত (যেমন <code>Ctrl+C</code>-এর জন্য ব্যবহৃত একটি) দিয়ে যেতে দেয়, যা একটি bare <code>except:</code> সেটাও গিলে ফেলত।</p>'),

      callout('warning', '<p>একটি বাস্তব, ডিপ্লয় করা Python প্রোগ্রামে একটি না-ধরা exception একটি সম্পূর্ণ traceback প্রিন্ট করে — ফাইল পাথ, লাইন নাম্বার, কখনো কখনো ভ্যারিয়েবলের মান — যা ডেভেলপ করার সময় আপনার জন্য অমূল্য, কিন্তু কখনো সরাসরি একজন end user-কে দেখানো উচিত নয়। ঝুঁকিপূর্ণ অপারেশন (ফাইল অ্যাক্সেস, নেটওয়ার্ক রিকোয়েস্ট, user input পার্স করা) <code>try</code>/<code>except</code>-এ মুড়িয়ে দেওয়াই এটাকে একটি পরিষ্কার, নিয়ন্ত্রিত মেসেজে বদলে দেয়।</p>', 'Traceback ডেভেলপারদের জন্য, ব্যবহারকারীদের জন্য নয়'),
    ],
  },
})

lessons.push({
  slug: 'file-handling',
  sortOrder: 21,
  en: {
    title: 'File Handling',
    metaTitle: 'Python File Handling | Learn Computer Academy',
    metaDescription: 'Reading from and writing to files in Python with open() and the with statement.',
    blocks: [
      p('<p>Python reads and writes files with <code>open()</code> — the equivalent of PHP\'s <code>fopen()</code>/<code>file_get_contents()</code> family, unified into one function.</p>'),

      h(2, 'The with Statement'),
      p('<p>The idiomatic way to work with a file in Python is the <code>with</code> statement, which automatically closes the file when the block ends — even if an error happens partway through, unlike PHP\'s manual <code>fclose()</code>:</p>'),
      code('python', 'with open("notes.txt", "r") as file:\n    content = file.read()\n    print(content)\n# the file is automatically closed here, guaranteed'),
      callout('tip', '<p><code>with</code> is a <b>context manager</b> — a general Python pattern for "set something up, guarantee it gets cleaned up afterward," used for far more than just files (database connections and network sockets follow the same pattern). Prefer it over manually calling <code>.close()</code> yourself.</p>', 'Always prefer with over manual close()'),

      h(2, 'Writing to a File'),
      code('python', 'with open("notes.txt", "w") as file:\n    file.write("Hello, file!")       # "w" overwrites\n\nwith open("notes.txt", "a") as file:\n    file.write("\\nAnother line.")    # "a" appends instead'),

      h(2, 'Reading Line by Line'),
      p('<p>For a large file, looping over the file object directly reads one line at a time instead of loading everything into memory at once:</p>'),
      code('python', 'with open("notes.txt", "r") as file:\n    for line in file:\n        print(line.strip())  # .strip() removes the trailing newline'),

      h(2, 'File Modes'),
      table(
        ['Mode', 'Meaning'],
        [
          ['"r"', 'Read (default) — the file must already exist'],
          ['"w"', 'Write — creates the file if missing, overwrites if it exists'],
          ['"a"', 'Append — creates the file if missing, adds to the end if it exists'],
        ]
      ),

      h(2, 'Checking Whether a File Exists'),
      p('<p>Opening a missing file with <code>"r"</code> raises a <code>FileNotFoundError</code> — checking first with the standard library\'s <code>pathlib</code> avoids that, and is the modern, recommended way to work with file paths in Python:</p>'),
      code('python', 'from pathlib import Path\n\nfile = Path("notes.txt")\nif file.exists():\n    print(file.read_text())\nelse:\n    print("File not found.")'),
      p('<p><code>pathlib</code> can fully replace <code>open()</code> for reading and writing too (<code>file.read_text()</code>, <code>file.write_text(...)</code>) — worth knowing it exists, even though this lesson sticks with <code>open()</code> since it maps most directly onto PHP\'s own file functions.</p>'),

      callout('warning', '<p>Just like PHP, any file path used with these functions should never come directly from user input without careful validation — a user-controlled path is a real security risk. This matters even more once file uploads are involved.</p>', 'Never trust a user-supplied file path'),
    ],
  },
  bn: {
    title: 'ফাইল হ্যান্ডলিং',
    metaTitle: 'Python ফাইল হ্যান্ডলিং | Learn Computer Academy',
    metaDescription: 'Python-এ open() আর with স্টেটমেন্ট দিয়ে ফাইল থেকে পড়া আর লেখা।',
    blocks: [
      p('<p>Python <code>open()</code> দিয়ে ফাইল পড়ে আর লেখে — PHP-এর <code>fopen()</code>/<code>file_get_contents()</code> পরিবারের সমতুল্য, একটি ফাংশনে একত্রিত।</p>'),

      h(2, 'with স্টেটমেন্ট', 'the-with-statement'),
      p('<p>Python-এ একটি ফাইল নিয়ে কাজ করার idiomatic উপায় হলো <code>with</code> স্টেটমেন্ট, যা ব্লক শেষ হলে স্বয়ংক্রিয়ভাবে ফাইলটি বন্ধ করে দেয় — এমনকি মাঝপথে একটি এরর হলেও, PHP-এর ম্যানুয়াল <code>fclose()</code>-এর থেকে আলাদা:</p>'),
      code('python', 'with open("notes.txt", "r") as file:\n    content = file.read()\n    print(content)\n# the file is automatically closed here, guaranteed'),
      callout('tip', '<p><code>with</code> একটি <b>context manager</b> — "কিছু একটা সেট আপ করা, পরে সেটা পরিষ্কার হওয়া নিশ্চিত করা"-র জন্য একটি সাধারণ Python প্যাটার্ন, শুধু ফাইলের চেয়ে অনেক বেশি ব্যবহৃত (ডেটাবেস কানেকশন আর নেটওয়ার্ক সকেটও একই প্যাটার্ন মেনে চলে)। নিজে ম্যানুয়ালি <code>.close()</code> কল করার বদলে এটি প্রাধান্য দিন।</p>', 'ম্যানুয়াল close()-এর বদলে সবসময় with প্রাধান্য দিন'),

      h(2, 'একটি ফাইলে লেখা', 'writing-to-a-file'),
      code('python', 'with open("notes.txt", "w") as file:\n    file.write("Hello, file!")       # "w" overwrites\n\nwith open("notes.txt", "a") as file:\n    file.write("\\nAnother line.")    # "a" appends instead'),

      h(2, 'লাইন বাই লাইন পড়া', 'reading-line-by-line'),
      p('<p>একটি বড় ফাইলের জন্য, সরাসরি ফাইল অবজেক্টের উপর লুপ করলে একবারে সবকিছু মেমরিতে লোড না করে একবারে একটি লাইন পড়া যায়:</p>'),
      code('python', 'with open("notes.txt", "r") as file:\n    for line in file:\n        print(line.strip())  # .strip() removes the trailing newline'),

      h(2, 'ফাইল মোড', 'file-modes'),
      table(
        ['মোড', 'অর্থ'],
        [
          ['"r"', 'পড়া (ডিফল্ট) — ফাইলটি আগে থেকেই থাকতে হবে'],
          ['"w"', 'লেখা — না থাকলে ফাইল তৈরি করে, থাকলে ওভাররাইট করে'],
          ['"a"', 'যোগ করা — না থাকলে ফাইল তৈরি করে, থাকলে শেষে যোগ করে'],
        ]
      ),

      h(2, 'একটি ফাইল আছে কিনা চেক করা', 'checking-whether-a-file-exists'),
      p('<p><code>"r"</code> দিয়ে একটি অনুপস্থিত ফাইল খুললে একটি <code>FileNotFoundError</code> ওঠে — স্ট্যান্ডার্ড লাইব্রেরির <code>pathlib</code> দিয়ে আগে চেক করলে সেটা এড়ানো যায়, আর Python-এ ফাইল path নিয়ে কাজ করার এটাই আধুনিক, প্রস্তাবিত উপায়:</p>'),
      code('python', 'from pathlib import Path\n\nfile = Path("notes.txt")\nif file.exists():\n    print(file.read_text())\nelse:\n    print("File not found.")'),
      p('<p><code>pathlib</code> পড়া আর লেখার জন্যও <code>open()</code>-কে পুরোপুরি প্রতিস্থাপন করতে পারে (<code>file.read_text()</code>, <code>file.write_text(...)</code>) — এটা যে আছে জানা মূল্যবান, যদিও এই পাঠ <code>open()</code>-এ থাকছে কারণ এটা সরাসরি PHP-এর নিজস্ব ফাইল ফাংশনের সাথে মেলে।</p>'),

      callout('warning', '<p>PHP-এর মতোই, এই ফাংশনগুলোর সাথে ব্যবহৃত যেকোনো ফাইল path কখনো সতর্ক ভ্যালিডেশন ছাড়া সরাসরি user input থেকে আসা উচিত নয় — একটি user-নিয়ন্ত্রিত path একটি বাস্তব সিকিউরিটি ঝুঁকি। ফাইল আপলোড জড়িত হলে এটি আরও বেশি গুরুত্বপূর্ণ।</p>', 'user-সরবরাহকৃত ফাইল path কখনো বিশ্বাস করবেন না'),
    ],
  },
})

lessons.push({
  slug: 'oop-introduction',
  sortOrder: 22,
  en: {
    title: 'Introduction to OOP',
    metaTitle: 'Introduction to OOP in Python | Learn Computer Academy',
    metaDescription: 'The basics of object-oriented programming in Python — classes, objects, __init__, and self.',
    blocks: [
      p('<p>Everything up to this point has been <b>procedural</b> — a script running top to bottom. <b>Object-oriented programming (OOP)</b> groups related data and behavior together into a single unit called an <b>object</b> — the same core idea as PHP\'s OOP, with Python\'s own syntax.</p>'),

      h(2, 'Classes and Objects'),
      p('<p>A <b>class</b> is a blueprint; an <b>object</b> is one actual instance built from it — same relationship as an architectural plan and an actual house built from it.</p>'),
      code('python', 'class Student:\n    def __init__(self, name, course):\n        self.name = name\n        self.course = course\n\n    def introduce(self):\n        return f"Hi, I\'m {self.name}, studying {self.course}."\n\nstudent1 = Student("Priya", "Web Development")\nprint(student1.introduce())  # "Hi, I\'m Priya, studying Web Development."'),

      h(2, '__init__ and self'),
      p('<p><code>__init__</code> is Python\'s constructor — it runs automatically when <code>Student(...)</code> is called, exactly like PHP\'s <code>__construct()</code>. <code>self</code> refers to "this particular object," equivalent to PHP\'s <code>$this</code> — the difference is Python makes it an explicit first parameter on every method, rather than something implicitly available.</p>'),

      img(
        'docs/img/python/oop-introduction-1',
        'Isometric diagram showing a class blueprint labeled Student on one side, with dashed arrows producing multiple distinct object instances on the other side, each a similar shape but a different accent color variant',
        1024, 768,
        'A class is the blueprint; each object built from it is a separate, independent instance.'
      ),

      h(2, 'Multiple Independent Objects'),
      code('python', 'student2 = Student("Amit", "Graphic Design")\n\nprint(student1.name)  # still "Priya" — unaffected by student2\nprint(student2.name)  # "Amit"'),

      h(2, 'Properties and Methods, Direct Access'),
      p('<p>Unlike PHP\'s <code>-&gt;</code> arrow, Python uses a plain dot for both properties and methods — there\'s only one access syntax to remember, not a different one for objects vs. everything else:</p>'),
      code('python', 'print(student1.name)         # property access\nprint(student1.introduce())  # method call'),

      h(2, 'Class Variables vs. Instance Variables'),
      p('<p>Everything so far — <code>self.name</code>, <code>self.course</code> — is an <b>instance variable</b>: its own separate copy per object. A <b>class variable</b>, defined directly inside the class body instead of inside <code>__init__</code>, is shared by every instance:</p>'),
      code('python', 'class Student:\n    school = "Learn Computer Academy"  # class variable — one copy, shared by all\n\n    def __init__(self, name):\n        self.name = name  # instance variable — separate per object\n\ns1 = Student("Priya")\ns2 = Student("Amit")\nprint(s1.school, s2.school)  # both "Learn Computer Academy" — same shared value'),
      p('<p>Use a class variable for something genuinely shared by every instance (a constant, a shared counter) and an instance variable for anything that varies per object — which, in practice, is most of what a class holds.</p>'),

      callout('note', '<p>The next lesson builds directly on this one, covering <b>inheritance</b> (one class building on another) and <b>polymorphism</b> (different classes responding to the same method call in their own way).</p>', 'More is coming immediately'),
    ],
  },
  bn: {
    title: 'OOP পরিচিতি',
    metaTitle: 'Python-এ OOP পরিচিতি | Learn Computer Academy',
    metaDescription: 'Python-এ অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিংয়ের বেসিক — ক্লাস, অবজেক্ট, __init__, আর self।',
    blocks: [
      p('<p>এই পর্যন্ত সবকিছু ছিল <b>প্রোসিডিউরাল</b> — একটি স্ক্রিপ্ট উপর থেকে নিচে চলছে। <b>অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং (OOP)</b> সম্পর্কিত ডেটা আর আচরণকে <b>অবজেক্ট</b> নামের একটি একক ইউনিটে একসাথে গ্রুপ করে — PHP-এর OOP-এর একই মূল ধারণা, Python-এর নিজস্ব সিনট্যাক্সে।</p>'),

      h(2, 'ক্লাস আর অবজেক্ট', 'classes-and-objects'),
      p('<p>একটি <b>ক্লাস</b> একটি ব্লুপ্রিন্ট; একটি <b>অবজেক্ট</b> এটি থেকে তৈরি একটি প্রকৃত instance — একটি স্থাপত্য পরিকল্পনা আর তা থেকে তৈরি একটি প্রকৃত বাড়ির একই সম্পর্ক।</p>'),
      code('python', 'class Student:\n    def __init__(self, name, course):\n        self.name = name\n        self.course = course\n\n    def introduce(self):\n        return f"Hi, I\'m {self.name}, studying {self.course}."\n\nstudent1 = Student("Priya", "Web Development")\nprint(student1.introduce())  # "Hi, I\'m Priya, studying Web Development."'),

      h(2, '__init__ আর self', 'init-and-self'),
      p('<p><code>__init__</code> হলো Python-এর কনস্ট্রাক্টর — <code>Student(...)</code> কল হলে এটি স্বয়ংক্রিয়ভাবে চলে, ঠিক PHP-এর <code>__construct()</code>-এর মতো। <code>self</code> মানে "এই নির্দিষ্ট অবজেক্ট", PHP-এর <code>$this</code>-এর সমতুল্য — পার্থক্য হলো Python এটাকে প্রতিটি মেথডে একটি স্পষ্ট প্রথম প্যারামিটার করে, স্বয়ংক্রিয়ভাবে উপলব্ধ কিছু না রেখে।</p>'),

      img(
        'docs/img/python/oop-introduction-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে একদিকে Student লেবেলযুক্ত একটি ক্লাস ব্লুপ্রিন্ট দেখানো হয়েছে, আর তীরচিহ্ন অন্য দিকে একাধিক আলাদা অবজেক্ট instance তৈরি করছে, প্রতিটি একই রকম আকৃতি কিন্তু ভিন্ন অ্যাকসেন্ট রঙের ভ্যারিয়েন্ট',
        1024, 768,
        'একটি ক্লাস হলো ব্লুপ্রিন্ট; এটি থেকে তৈরি প্রতিটি অবজেক্ট একটি আলাদা, স্বাধীন instance।'
      ),

      h(2, 'একাধিক স্বাধীন অবজেক্ট', 'multiple-independent-objects'),
      code('python', 'student2 = Student("Amit", "Graphic Design")\n\nprint(student1.name)  # still "Priya" — unaffected by student2\nprint(student2.name)  # "Amit"'),

      h(2, 'প্রপার্টি আর মেথড, সরাসরি অ্যাক্সেস', 'properties-and-methods-direct-access'),
      p('<p>PHP-এর <code>-&gt;</code> অ্যারো থেকে আলাদা, Python প্রপার্টি আর মেথড দুটোর জন্যই একটি সাধারণ ডট ব্যবহার করে — মনে রাখার জন্য শুধু একটি অ্যাক্সেস সিনট্যাক্স আছে, অবজেক্ট বনাম বাকি সবকিছুর জন্য আলাদা আলাদা নয়:</p>'),
      code('python', 'print(student1.name)         # property access\nprint(student1.introduce())  # method call'),

      h(2, 'ক্লাস ভ্যারিয়েবল বনাম ইনস্ট্যান্স ভ্যারিয়েবল', 'class-variables-vs-instance-variables'),
      p('<p>এখন পর্যন্ত সবকিছু — <code>self.name</code>, <code>self.course</code> — একটি <b>instance variable</b>: প্রতিটি অবজেক্টের নিজস্ব আলাদা কপি। একটি <b>class variable</b>, <code>__init__</code>-এর ভেতরে না দিয়ে সরাসরি ক্লাস body-তে সংজ্ঞায়িত, প্রতিটি instance শেয়ার করে:</p>'),
      code('python', 'class Student:\n    school = "Learn Computer Academy"  # class variable — one copy, shared by all\n\n    def __init__(self, name):\n        self.name = name  # instance variable — separate per object\n\ns1 = Student("Priya")\ns2 = Student("Amit")\nprint(s1.school, s2.school)  # both "Learn Computer Academy" — same shared value'),
      p('<p>প্রতিটি instance দ্বারা সত্যিকারভাবে শেয়ার করা কিছুর জন্য (একটি ধ্রুবক, একটি শেয়ার করা কাউন্টার) একটি class variable ব্যবহার করুন আর প্রতি অবজেক্টে ভিন্ন হওয়া যেকোনো কিছুর জন্য একটি instance variable — যা, বাস্তবে, একটি ক্লাস যা ধরে রাখে তার বেশিরভাগ।</p>'),

      callout('note', '<p>পরের পাঠ সরাসরি এটার উপর ভিত্তি করে তৈরি, কভার করবে <b>inheritance</b> (একটি ক্লাস আরেকটির উপর ভিত্তি করে তৈরি) আর <b>polymorphism</b> (ভিন্ন ভিন্ন ক্লাস একই মেথড কলে নিজেদের মতো করে সাড়া দেওয়া)।</p>', 'আরও কিছু সাথে সাথেই আসছে'),
    ],
  },
})

lessons.push({
  slug: 'oop-inheritance',
  sortOrder: 23,
  en: {
    title: 'OOP — Inheritance and Polymorphism',
    metaTitle: 'Python OOP: Inheritance and Polymorphism | Learn Computer Academy',
    metaDescription: 'Sharing behavior between classes with inheritance, and letting different classes respond to the same method call in their own way.',
    blocks: [
      p('<p>These two features are what make classes genuinely powerful once you have more than one related class.</p>'),

      h(2, 'Inheritance'),
      p('<p><b>Inheritance</b> lets one class build on another, reusing its properties and methods instead of rewriting them — Python\'s syntax for this is putting the parent class name in parentheses:</p>'),
      code('python', 'class Person:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        return f"Hi, I\'m {self.name}."\n\nclass Student(Person):\n    def __init__(self, name, course):\n        super().__init__(name)  # reuse Person\'s constructor\n        self.course = course\n\ns = Student("Amit", "Graphic Design")\nprint(s.greet())  # "Hi, I\'m Amit." — inherited from Person, unchanged'),
      p('<p><code>super()</code> is Python\'s equivalent of PHP\'s <code>parent::</code> — it gives access to the parent class\'s own version of a method, most commonly used to reuse its <code>__init__</code>.</p>'),

      h(2, 'Overriding a Method'),
      p('<p>A subclass can also replace a parent\'s method entirely by defining one with the same name — no special keyword needed, unlike PHP, which sometimes wants an explicit marker for this:</p>'),
      code('python', 'class Student(Person):\n    def __init__(self, name, course):\n        super().__init__(name)\n        self.course = course\n\n    def greet(self):  # overrides Person.greet completely\n        return f"Hi, I\'m {self.name}, studying {self.course}."\n\ns = Student("Amit", "Graphic Design")\nprint(s.greet())  # "Hi, I\'m Amit, studying Graphic Design." — Student\'s version runs, not Person\'s'),
      p('<p><code>super().greet()</code> would still be available inside the override if you wanted to build on the parent\'s version rather than fully replace it — the same <code>super()</code> used above for <code>__init__</code>.</p>'),

      h(2, 'Polymorphism'),
      p('<p><b>Polymorphism</b> means different classes can implement the same method name in their own way, and calling code doesn\'t need to know which exact class it\'s working with:</p>'),
      code('python', 'class Dog:\n    def speak(self):\n        return "Woof!"\n\nclass Cat:\n    def speak(self):\n        return "Meow!"\n\nfor animal in [Dog(), Cat()]:\n    print(animal.speak())  # "Woof!" then "Meow!" — same call, different behavior'),
      p('<p>Notice <code>Dog</code> and <code>Cat</code> here aren\'t related by inheritance at all — Python doesn\'t require a shared parent class or interface for this to work, unlike PHP, which needs an explicit <code>interface</code> to guarantee a method exists before calling it. This looser style is often called <b>duck typing</b>: "if it walks like a duck and quacks like a duck" — if an object has a <code>.speak()</code> method, Python is happy to call it, regardless of the object\'s actual class.</p>'),

      h(2, 'Checking Types When It Matters'),
      code('python', 'print(isinstance(s, Student))  # True\nprint(isinstance(s, Person))   # True — Student is also a Person, via inheritance'),
    ],
  },
  bn: {
    title: 'OOP — ইনহেরিটেন্স আর পলিমরফিজম',
    metaTitle: 'Python OOP: ইনহেরিটেন্স আর পলিমরফিজম | Learn Computer Academy',
    metaDescription: 'ইনহেরিটেন্স দিয়ে ক্লাসের মধ্যে আচরণ শেয়ার করা, আর ভিন্ন ভিন্ন ক্লাসকে একই মেথড কলে নিজেদের মতো করে সাড়া দিতে দেওয়া।',
    blocks: [
      p('<p>একাধিক সম্পর্কিত ক্লাস হয়ে গেলে এই দুটো ফিচারই ক্লাসকে সত্যিকারভাবে শক্তিশালী করে তোলে।</p>'),

      h(2, 'ইনহেরিটেন্স', 'inheritance'),
      p('<p><b>ইনহেরিটেন্স</b> একটি ক্লাসকে আরেকটির উপর ভিত্তি করে তৈরি করতে দেয়, তার প্রপার্টি আর মেথড আবার না লিখে পুনঃব্যবহার করে — এর জন্য Python-এর সিনট্যাক্স হলো বন্ধনীতে parent ক্লাসের নাম বসানো:</p>'),
      code('python', 'class Person:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        return f"Hi, I\'m {self.name}."\n\nclass Student(Person):\n    def __init__(self, name, course):\n        super().__init__(name)  # reuse Person\'s constructor\n        self.course = course\n\ns = Student("Amit", "Graphic Design")\nprint(s.greet())  # "Hi, I\'m Amit." — inherited from Person, unchanged'),
      p('<p><code>super()</code> হলো PHP-এর <code>parent::</code>-এর Python সমতুল্য — এটি একটি মেথডের parent ক্লাসের নিজস্ব ভার্সনে অ্যাক্সেস দেয়, সবচেয়ে বেশি এর <code>__init__</code> পুনঃব্যবহার করতে ব্যবহৃত হয়।</p>'),

      h(2, 'একটি মেথড Override করা', 'overriding-a-method'),
      p('<p>একটি subclass একই নামের একটি মেথড সংজ্ঞায়িত করে parent-এর মেথডকে সম্পূর্ণভাবে প্রতিস্থাপনও করতে পারে — কোনো বিশেষ কীওয়ার্ডের দরকার নেই, PHP-এর থেকে আলাদা, যা কখনো কখনো এর জন্য একটি স্পষ্ট মার্কার চায়:</p>'),
      code('python', 'class Student(Person):\n    def __init__(self, name, course):\n        super().__init__(name)\n        self.course = course\n\n    def greet(self):  # overrides Person.greet completely\n        return f"Hi, I\'m {self.name}, studying {self.course}."\n\ns = Student("Amit", "Graphic Design")\nprint(s.greet())  # "Hi, I\'m Amit, studying Graphic Design." — Student\'s version runs, not Person\'s'),
      p('<p>Parent-এর ভার্সনটা সম্পূর্ণ প্রতিস্থাপন না করে তার উপর ভিত্তি করে তৈরি করতে চাইলে override-এর ভেতরে <code>super().greet()</code>-ও এখনও ব্যবহার করা যেত — <code>__init__</code>-এর জন্য উপরে ব্যবহৃত একই <code>super()</code>।</p>'),

      h(2, 'পলিমরফিজম', 'polymorphism'),
      p('<p><b>পলিমরফিজম</b> মানে ভিন্ন ভিন্ন ক্লাস একই মেথড নাম নিজেদের মতো করে কার্যকর করতে পারে, আর কল করা কোডকে জানতে হয় না ঠিক কোন ক্লাসের সাথে এটি কাজ করছে:</p>'),
      code('python', 'class Dog:\n    def speak(self):\n        return "Woof!"\n\nclass Cat:\n    def speak(self):\n        return "Meow!"\n\nfor animal in [Dog(), Cat()]:\n    print(animal.speak())  # "Woof!" then "Meow!" — same call, different behavior'),
      p('<p>লক্ষ্য করুন এখানে <code>Dog</code> আর <code>Cat</code> ইনহেরিটেন্স দিয়ে একদমই সম্পর্কিত নয় — এটা কাজ করতে Python-এর একটি শেয়ার করা parent ক্লাস বা ইন্টারফেসের দরকার নেই, PHP-এর থেকে আলাদা, যার একটি মেথড কল করার আগে সেটা আছে তা নিশ্চিত করতে একটি স্পষ্ট <code>interface</code> দরকার। এই বেশি নমনীয় স্টাইলকে প্রায়ই বলা হয় <b>duck typing</b>: "যদি এটা হাঁসের মতো হাঁটে আর হাঁসের মতো ডাকে" — একটি অবজেক্টের যদি একটি <code>.speak()</code> মেথড থাকে, Python খুশি মনে সেটা কল করবে, অবজেক্টের প্রকৃত ক্লাস যাই হোক না কেন।</p>'),

      h(2, 'গুরুত্বপূর্ণ হলে টাইপ চেক করা', 'checking-types-when-it-matters'),
      code('python', 'print(isinstance(s, Student))  # True\nprint(isinstance(s, Person))   # True — Student is also a Person, via inheritance'),
    ],
  },
})

lessons.push({
  slug: 'oop-encapsulation',
  sortOrder: 24,
  en: {
    title: 'OOP — Encapsulation and Dunder Methods',
    metaTitle: 'Python Encapsulation and Dunder Methods | Learn Computer Academy',
    metaDescription: 'Controlling access to a class\'s properties with Python\'s naming conventions, and customizing built-in behavior with special methods like __str__.',
    blocks: [
      p('<p>Two more OOP building blocks round out the section: how Python signals "don\'t touch this from outside," and how to make an object behave well with Python\'s own built-in functions.</p>'),

      h(2, 'Encapsulation — By Convention, Not Enforcement'),
      p('<p>PHP has real <code>private</code>/<code>protected</code> keywords the language enforces. Python has no true private properties — instead, a leading underscore is a <b>convention</b> signaling "internal, don\'t use this from outside," which Python trusts you to respect rather than blocking:</p>'),
      code('python', 'class BankAccount:\n    def __init__(self):\n        self._balance = 0  # single underscore: "internal, please don\'t touch"\n\n    def deposit(self, amount):\n        self._balance += amount\n\n    def get_balance(self):\n        return self._balance\n\naccount = BankAccount()\naccount.deposit(500)\nprint(account.get_balance())  # 500\nprint(account._balance)       # 500 — this works! Python doesn\'t block it, unlike PHP\'s private'),
      callout('note', '<p>A <b>double</b> underscore prefix (<code>__balance</code>) triggers "name mangling," which makes accidental access from outside genuinely awkward, though still not impossible. In practice, a single underscore plus trusting the convention is far more common in real Python code than trying to fully lock a property down.</p>', 'Single underscore is the normal habit'),

      h(2, 'Dunder (Double-Underscore) Methods'),
      p('<p>You already met one — <code>__init__</code>. Python has many more special methods, all following the <code>__name__</code> pattern, that let an object plug into the language\'s own built-in behavior:</p>'),
      code('python', 'class Student:\n    def __init__(self, name):\n        self.name = name\n\n    def __str__(self):\n        return f"Student: {self.name}"\n\ns = Student("Priya")\nprint(s)         # "Student: Priya" — print() calls __str__ automatically\nprint(str(s))    # same thing'),
      p('<p>Without <code>__str__</code>, <code>print(s)</code> would show something unhelpful like <code>&lt;__main__.Student object at 0x...&gt;</code>. Defining it is roughly equivalent to giving PHP\'s classes a custom <code>__toString()</code> method.</p>'),

      table(
        ['Dunder method', 'Lets an object work with'],
        [
          ['__init__', 'Student(...) — creating an instance'],
          ['__str__', 'print(obj), str(obj)'],
          ['__len__', 'len(obj)'],
          ['__eq__', 'obj1 == obj2'],
        ]
      ),
      p('<p>This section has covered the ones you\'ll hit constantly. The <a href="https://docs.python.org/3/reference/datamodel.html#special-method-names" target="_blank" rel="noopener noreferrer">full list of special methods is on python.org</a> for anything more advanced.</p>'),

      h(2, 'Controlled Access with @property'),
      p('<p><code>@property</code> lets a method be accessed like a plain attribute, with no parentheses — this is how Python builds a getter that can also run validation logic, without callers needing to know it\'s a method underneath:</p>'),
      code('python', 'class BankAccount:\n    def __init__(self):\n        self._balance = 0\n\n    @property\n    def balance(self):\n        return self._balance\n\n    @balance.setter\n    def balance(self, value):\n        if value < 0:\n            raise ValueError("Balance cannot be negative.")\n        self._balance = value\n\naccount = BankAccount()\naccount.balance = 500   # looks like a plain attribute, actually calls the setter\nprint(account.balance)  # 500 — looks like a plain attribute, actually calls the getter\n# account.balance = -10 # ValueError — the setter blocks this'),
      p('<p>This is Python\'s answer to PHP\'s explicit getter/setter methods (<code>getBalance()</code>/<code>setBalance()</code>) — the calling code stays as simple as a direct attribute, while the class still gets to enforce its own rules.</p>'),
    ],
  },
  bn: {
    title: 'OOP — এনক্যাপসুলেশন আর ডান্ডার মেথড',
    metaTitle: 'Python এনক্যাপসুলেশন আর ডান্ডার মেথড | Learn Computer Academy',
    metaDescription: 'Python-এর নামকরণ প্রথা দিয়ে একটি ক্লাসের প্রপার্টিতে অ্যাক্সেস নিয়ন্ত্রণ করা, আর __str__-এর মতো বিশেষ মেথড দিয়ে বিল্ট-ইন আচরণ কাস্টমাইজ করা।',
    blocks: [
      p('<p>আরও দুটো OOP building block এই অংশ সম্পূর্ণ করে: Python কীভাবে "এটা বাইরে থেকে ছোঁবেন না" সংকেত দেয়, আর Python-এর নিজস্ব বিল্ট-ইন ফাংশনের সাথে একটি অবজেক্টকে কীভাবে ভালোভাবে কাজ করাবেন।</p>'),

      h(2, 'এনক্যাপসুলেশন — প্রথা দিয়ে, প্রয়োগ দিয়ে নয়', 'encapsulation-by-convention-not-enforcement'),
      p('<p>PHP-তে আসল <code>private</code>/<code>protected</code> কীওয়ার্ড আছে যা ভাষা প্রয়োগ করে। Python-এ কোনো সত্যিকারের প্রাইভেট প্রপার্টি নেই — এর বদলে, একটি শুরুর আন্ডারস্কোর একটি <b>প্রথা</b> যা সংকেত দেয় "internal, এটা বাইরে থেকে ব্যবহার করবেন না", যা Python ব্লক করার বদলে আপনাকে সম্মান করতে বিশ্বাস করে:</p>'),
      code('python', 'class BankAccount:\n    def __init__(self):\n        self._balance = 0  # single underscore: "internal, please don\'t touch"\n\n    def deposit(self, amount):\n        self._balance += amount\n\n    def get_balance(self):\n        return self._balance\n\naccount = BankAccount()\naccount.deposit(500)\nprint(account.get_balance())  # 500\nprint(account._balance)       # 500 — this works! Python doesn\'t block it, unlike PHP\'s private'),
      callout('note', '<p>একটি <b>দুটো</b> আন্ডারস্কোর প্রিফিক্স (<code>__balance</code>) "name mangling" ট্রিগার করে, যা বাইরে থেকে দুর্ঘটনাক্রমে অ্যাক্সেসকে সত্যিকারভাবে বিশ্রী করে তোলে, যদিও তখনও অসম্ভব নয়। বাস্তবে, একটি একক আন্ডারস্কোর আর প্রথাকে বিশ্বাস করা বাস্তব Python কোডে একটি প্রপার্টিকে পুরোপুরি লক করার চেষ্টার চেয়ে অনেক বেশি প্রচলিত।</p>', 'একক আন্ডারস্কোর স্বাভাবিক অভ্যাস'),

      h(2, 'ডান্ডার (ডাবল-আন্ডারস্কোর) মেথড', 'dunder-double-underscore-methods'),
      p('<p>আপনি ইতিমধ্যে একটি দেখেছেন — <code>__init__</code>। Python-এ আরও অনেক বিশেষ মেথড আছে, সবগুলো <code>__name__</code> প্যাটার্ন মেনে চলে, যা একটি অবজেক্টকে ভাষার নিজস্ব বিল্ট-ইন আচরণে যুক্ত হতে দেয়:</p>'),
      code('python', 'class Student:\n    def __init__(self, name):\n        self.name = name\n\n    def __str__(self):\n        return f"Student: {self.name}"\n\ns = Student("Priya")\nprint(s)         # "Student: Priya" — print() calls __str__ automatically\nprint(str(s))    # same thing'),
      p('<p><code>__str__</code> ছাড়া, <code>print(s)</code> <code>&lt;__main__.Student object at 0x...&gt;</code>-এর মতো অসহায়ক কিছু দেখাত। এটি সংজ্ঞায়িত করা মোটামুটি PHP-এর ক্লাসকে একটি কাস্টম <code>__toString()</code> মেথড দেওয়ার সমতুল্য।</p>'),

      table(
        ['ডান্ডার মেথড', 'একটি অবজেক্টকে যার সাথে কাজ করতে দেয়'],
        [
          ['__init__', 'Student(...) — একটি instance তৈরি করা'],
          ['__str__', 'print(obj), str(obj)'],
          ['__len__', 'len(obj)'],
          ['__eq__', 'obj1 == obj2'],
        ]
      ),
      p('<p>এই অংশে সেগুলো দেখানো হয়েছে যা আপনি ক্রমাগত ব্যবহার করবেন। আরও উন্নত যেকোনো কিছুর জন্য <a href="https://docs.python.org/3/reference/datamodel.html#special-method-names" target="_blank" rel="noopener noreferrer">বিশেষ মেথডের সম্পূর্ণ তালিকা python.org-এ</a> আছে।</p>'),

      h(2, '@property দিয়ে নিয়ন্ত্রিত অ্যাক্সেস', 'controlled-access-with-property'),
      p('<p><code>@property</code> একটি মেথডকে কোনো বন্ধনী ছাড়াই একটি সাধারণ attribute-এর মতো অ্যাক্সেস করতে দেয় — এভাবেই Python একটি getter তৈরি করে যা validation লজিকও চালাতে পারে, কলিং কোডকে না জানিয়েই যে এটা ভেতরে একটি মেথড:</p>'),
      code('python', 'class BankAccount:\n    def __init__(self):\n        self._balance = 0\n\n    @property\n    def balance(self):\n        return self._balance\n\n    @balance.setter\n    def balance(self, value):\n        if value < 0:\n            raise ValueError("Balance cannot be negative.")\n        self._balance = value\n\naccount = BankAccount()\naccount.balance = 500   # looks like a plain attribute, actually calls the setter\nprint(account.balance)  # 500 — looks like a plain attribute, actually calls the getter\n# account.balance = -10 # ValueError — the setter blocks this'),
      p('<p>এটি PHP-এর স্পষ্ট getter/setter মেথডের (<code>getBalance()</code>/<code>setBalance()</code>) Python উত্তর — কলিং কোড একটি সরাসরি attribute-এর মতোই সহজ থাকে, আর ক্লাসটি তখনও নিজের নিয়ম প্রয়োগ করতে পারে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'iterators-and-generators',
  sortOrder: 25,
  en: {
    title: 'Iterators and Generators',
    metaTitle: 'Python Iterators and Generators | Learn Computer Academy',
    metaDescription: 'How Python\'s for loops actually work under the hood, and using yield to produce values one at a time instead of building a whole list in memory.',
    blocks: [
      p('<p>Every <code>for</code> loop you\'ve written in this section has relied on a mechanism worth understanding directly: Python\'s <b>iterator</b> protocol. A <b>generator</b> is a simple, common way to build your own.</p>'),

      h(2, 'What "Iterable" Actually Means'),
      p('<p>Lists, tuples, dictionaries, and strings are all <b>iterable</b> — <code>for x in ...</code> works on all of them because each knows how to produce its items one at a time when asked, via <code>iter()</code> and <code>next()</code> under the hood:</p>'),
      code('python', 'numbers = [1, 2, 3]\niterator = iter(numbers)\nprint(next(iterator))  # 1\nprint(next(iterator))  # 2\nprint(next(iterator))  # 3\n# next(iterator)       # StopIteration — nothing left'),
      p('<p>A <code>for</code> loop is really just this pattern, wrapped in convenient syntax — it calls <code>next()</code> repeatedly until it runs out.</p>'),

      h(2, 'The Problem Generators Solve'),
      p('<p>Building a full list to loop over it once wastes memory if the list is huge, or impossible if it\'s infinite. A <b>generator function</b> — using <code>yield</code> instead of <code>return</code> — produces values one at a time, on demand, without ever holding the whole sequence in memory at once:</p>'),
      code('python', 'def count_up_to(n):\n    i = 1\n    while i <= n:\n        yield i\n        i += 1\n\nfor number in count_up_to(5):\n    print(number)  # 1, 2, 3, 4, 5 — computed one at a time, not built as a list first'),

      img(
        'docs/img/python/generators-1',
        'Isometric diagram contrasting two approaches: on the left, a full stack of blocks being built all at once before use; on the right, a single block being produced, used, and replaced one at a time in a continuous small loop',
        1024, 768,
        'A regular function builds the whole result up front; a generator produces one value at a time, on demand.'
      ),

      h(2, 'Generator Expressions'),
      p('<p>A generator expression is the lazy cousin of the list comprehension from earlier in this section — swap the square brackets for parentheses:</p>'),
      code('python', 'squares_list = [n ** 2 for n in range(1000000)]   # builds all million values right now\nsquares_gen  = (n ** 2 for n in range(1000000))   # builds nothing yet — values come one at a time'),

      callout('tip', '<p>Use a list when you need to loop over the data more than once, check its length, or index into it. Reach for a generator when you\'re processing a large or open-ended sequence just once, in order — reading a huge file line by line is a classic real-world case.</p>', 'List vs. generator — when each makes sense'),

      h(2, 'A Generator Only Runs Once'),
      p('<p>This is the gotcha that catches almost everyone the first time: once a generator has been fully looped over, it\'s exhausted — looping over it again produces nothing, silently, with no error:</p>'),
      code('python', 'squares = (n ** 2 for n in range(3))\n\nprint(list(squares))  # [0, 1, 4]\nprint(list(squares))  # [] — already exhausted, nothing left to produce'),
      p('<p>A list can be looped over as many times as you like; a generator is single-use by design. If you need the data more than once, either convert it to a list (<code>list(...)</code>) or build a fresh generator each time you need it.</p>'),
    ],
  },
  bn: {
    title: 'ইটারেটর আর জেনারেটর',
    metaTitle: 'Python ইটারেটর আর জেনারেটর | Learn Computer Academy',
    metaDescription: 'Python-এর for লুপ আসলে ভেতরে কীভাবে কাজ করে, আর মেমরিতে একটি সম্পূর্ণ লিস্ট তৈরি না করে একবারে একটি মান তৈরি করতে yield ব্যবহার করা।',
    blocks: [
      p('<p>এই অংশে আপনি যে প্রতিটি <code>for</code> লুপ লিখেছেন তা একটি প্রক্রিয়ার উপর নির্ভর করেছে যা সরাসরি বোঝার মতো: Python-এর <b>ইটারেটর</b> প্রোটোকল। একটি <b>জেনারেটর</b> নিজের একটি তৈরি করার একটি সহজ, সাধারণ উপায়।</p>'),

      h(2, '"Iterable" আসলে কী মানে', 'what-iterable-actually-means'),
      p('<p>লিস্ট, tuple, ডিকশনারি, আর স্ট্রিং সবগুলোই <b>iterable</b> — <code>for x in ...</code> এদের সবার উপর কাজ করে কারণ প্রতিটি জানে জিজ্ঞাসা করা হলে ভেতরে ভেতরে <code>iter()</code> আর <code>next()</code>-এর মাধ্যমে একবারে একটি করে আইটেম কীভাবে তৈরি করতে হয়:</p>'),
      code('python', 'numbers = [1, 2, 3]\niterator = iter(numbers)\nprint(next(iterator))  # 1\nprint(next(iterator))  # 2\nprint(next(iterator))  # 3\n# next(iterator)       # StopIteration — nothing left'),
      p('<p>একটি <code>for</code> লুপ আসলে এই প্যাটার্নটাই, সুবিধাজনক সিনট্যাক্সে মোড়ানো — এটি শেষ না হওয়া পর্যন্ত বারবার <code>next()</code> কল করে।</p>'),

      h(2, 'জেনারেটর যে সমস্যা সমাধান করে', 'the-problem-generators-solve'),
      p('<p>একবার লুপ করার জন্য একটি সম্পূর্ণ লিস্ট তৈরি করা মেমরি অপচয় করে যদি লিস্টটি বিশাল হয়, বা অসম্ভব যদি এটি অসীম হয়। একটি <b>জেনারেটর ফাংশন</b> — <code>return</code>-এর বদলে <code>yield</code> ব্যবহার করে — একবারে সম্পূর্ণ ক্রম মেমরিতে না রেখেই, চাহিদা অনুযায়ী একবারে একটি করে মান তৈরি করে:</p>'),
      code('python', 'def count_up_to(n):\n    i = 1\n    while i <= n:\n        yield i\n        i += 1\n\nfor number in count_up_to(5):\n    print(number)  # 1, 2, 3, 4, 5 — computed one at a time, not built as a list first'),

      img(
        'docs/img/python/generators-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যা দুটো পদ্ধতির তুলনা করছে: বামদিকে, ব্যবহারের আগে একবারে তৈরি করা ব্লকের একটি সম্পূর্ণ স্তূপ; ডানদিকে, একটি ছোট ক্রমাগত লুপে একবারে একটি করে তৈরি, ব্যবহার, আর প্রতিস্থাপিত হওয়া একটি একক ব্লক',
        1024, 768,
        'একটি সাধারণ ফাংশন আগে থেকেই পুরো ফলাফল তৈরি করে; একটি জেনারেটর চাহিদা অনুযায়ী একবারে একটি মান তৈরি করে।'
      ),

      h(2, 'জেনারেটর এক্সপ্রেশন', 'generator-expressions'),
      p('<p>একটি জেনারেটর এক্সপ্রেশন এই অংশের আগের দিকের list comprehension-এর lazy কাজিন — স্কয়ার ব্র্যাকেটের বদলে বন্ধনী ব্যবহার করুন:</p>'),
      code('python', 'squares_list = [n ** 2 for n in range(1000000)]   # builds all million values right now\nsquares_gen  = (n ** 2 for n in range(1000000))   # builds nothing yet — values come one at a time'),

      callout('tip', '<p>ডেটার উপর একাধিকবার লুপ করতে হলে, দৈর্ঘ্য চেক করতে হলে, বা এতে ইনডেক্স করতে হলে একটি লিস্ট ব্যবহার করুন। একটি বড় বা open-ended ক্রম একবারে, ক্রম অনুযায়ী প্রসেস করার সময় একটি জেনারেটরের দিকে যান — একটি বিশাল ফাইল লাইন বাই লাইন পড়া একটি ধ্রুপদী বাস্তব-জগতের উদাহরণ।</p>', 'লিস্ট বনাম জেনারেটর — কখন কোনটা যুক্তিসঙ্গত'),

      h(2, 'একটি জেনারেটর শুধু একবারই চলে', 'a-generator-only-runs-once'),
      p('<p>এটাই সেই ফাঁদ যা প্রথমবার প্রায় সবাইকে ধরে ফেলে: একটি জেনারেটরের উপর একবার সম্পূর্ণভাবে লুপ হয়ে গেলে, এটা exhausted — আবার এর উপর লুপ করলে চুপচাপ কিছুই তৈরি হয় না, কোনো এরর ছাড়াই:</p>'),
      code('python', 'squares = (n ** 2 for n in range(3))\n\nprint(list(squares))  # [0, 1, 4]\nprint(list(squares))  # [] — already exhausted, nothing left to produce'),
      p('<p>একটি লিস্ট আপনি যতবার ইচ্ছা ততবার লুপ করতে পারেন; একটি জেনারেটর ডিজাইন অনুযায়ী একবার-ব্যবহারযোগ্য। ডেটাটা একবারের বেশি দরকার হলে, হয় এটাকে একটি লিস্টে রূপান্তর করুন (<code>list(...)</code>) অথবা দরকার হলে প্রতিবার একটি নতুন জেনারেটর তৈরি করুন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'dates-and-times',
  sortOrder: 26,
  en: {
    title: 'Working with Dates and Times',
    metaTitle: 'Python Dates and Times | Learn Computer Academy',
    metaDescription: 'Getting and formatting the current date and time in Python with the datetime module.',
    blocks: [
      p('<p>The <code>datetime</code> module — from the standard library, per the Modules and Imports lesson — is Python\'s tool for working with dates and times.</p>'),

      h(2, 'Getting the Current Date and Time'),
      code('python', 'from datetime import datetime\n\nnow = datetime.now()\nprint(now)                          # 2026-07-30 14:30:00.123456\nprint(now.strftime("%Y-%m-%d"))     # "2026-07-30"\nprint(now.strftime("%d/%m/%Y"))     # "30/07/2026"\nprint(now.strftime("%A, %B %d, %Y"))# "Thursday, July 30, 2026"'),
      table(
        ['Code', 'Means'],
        [
          ['%Y', '4-digit year'],
          ['%m', '2-digit month'],
          ['%d', '2-digit day'],
          ['%H:%M:%S', 'Hour:minute:second, 24-hour'],
          ['%A', 'Full day name'],
          ['%B', 'Full month name'],
        ]
      ),
      p('<p>The full set of format codes is in the <a href="https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes" target="_blank" rel="noopener noreferrer">strftime() reference on python.org</a>.</p>'),

      h(2, 'Creating a Specific Date'),
      code('python', 'from datetime import datetime\n\ndeadline = datetime(2026, 12, 31)\nprint(deadline.strftime("%Y-%m-%d"))  # "2026-12-31"'),

      h(2, 'Comparing and Calculating with Dates'),
      code('python', 'from datetime import datetime, timedelta\n\nnow = datetime.now()\ndeadline = datetime(2026, 12, 31)\n\ndifference = deadline - now\nprint(f"{difference.days} days remaining")\n\nnext_week = now + timedelta(days=7)\nprint(next_week.strftime("%Y-%m-%d"))'),
      p('<p><code>timedelta</code> represents a span of time, and can be added to or subtracted from a <code>datetime</code> directly — there\'s no separate "modify" method the way PHP\'s <code>DateTime::modify()</code> works.</p>'),

      h(2, 'Parsing a Date From Text'),
      p('<p><code>strptime()</code> is the reverse of <code>strftime()</code> — it reads a date <i>out of</i> a string, using the same format codes to say what shape to expect:</p>'),
      code('python', 'from datetime import datetime\n\ntext = "30/07/2026"\nparsed = datetime.strptime(text, "%d/%m/%Y")\nprint(parsed.year)   # 2026\nprint(parsed.month)  # 7'),
      callout('warning', '<p>The format string must match the input exactly, or <code>strptime()</code> raises a <code>ValueError</code> — <code>"30/07/2026"</code> parsed with <code>"%Y-%m-%d"</code> fails outright rather than guessing. Wrap this in <code>try</code>/<code>except</code> whenever the text is coming from a user rather than a source you fully control.</p>', 'strptime() does not guess the format'),

      callout('note', '<p>Just like PHP, dates and times in Python default to "naive" — no time zone attached at all, rather than automatically using the server\'s configured zone. For anything where the difference matters (a scheduled event across regions), look at the <code>zoneinfo</code> module in the standard library.</p>', 'No time zone by default'),
    ],
  },
  bn: {
    title: 'ডেট আর টাইম নিয়ে কাজ করা',
    metaTitle: 'Python ডেট আর টাইম | Learn Computer Academy',
    metaDescription: 'datetime মডিউল দিয়ে Python-এ বর্তমান তারিখ আর সময় পাওয়া আর ফরম্যাট করা।',
    blocks: [
      p('<p><code>datetime</code> মডিউল — Modules and Imports পাঠ অনুযায়ী স্ট্যান্ডার্ড লাইব্রেরি থেকে — তারিখ আর সময় নিয়ে কাজ করার Python-এর টুল।</p>'),

      h(2, 'বর্তমান তারিখ আর সময় পাওয়া', 'getting-the-current-date-and-time'),
      code('python', 'from datetime import datetime\n\nnow = datetime.now()\nprint(now)                          # 2026-07-30 14:30:00.123456\nprint(now.strftime("%Y-%m-%d"))     # "2026-07-30"\nprint(now.strftime("%d/%m/%Y"))     # "30/07/2026"\nprint(now.strftime("%A, %B %d, %Y"))# "Thursday, July 30, 2026"'),
      table(
        ['কোড', 'অর্থ'],
        [
          ['%Y', '4-সংখ্যার বছর'],
          ['%m', '2-সংখ্যার মাস'],
          ['%d', '2-সংখ্যার দিন'],
          ['%H:%M:%S', 'ঘণ্টা:মিনিট:সেকেন্ড, 24-ঘণ্টা'],
          ['%A', 'পুরো দিনের নাম'],
          ['%B', 'পুরো মাসের নাম'],
        ]
      ),
      p('<p>ফরম্যাট কোডের সম্পূর্ণ সেট আছে <a href="https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes" target="_blank" rel="noopener noreferrer">python.org-এ strftime() রেফারেন্সে</a>।</p>'),

      h(2, 'একটি নির্দিষ্ট তারিখ তৈরি করা', 'creating-a-specific-date'),
      code('python', 'from datetime import datetime\n\ndeadline = datetime(2026, 12, 31)\nprint(deadline.strftime("%Y-%m-%d"))  # "2026-12-31"'),

      h(2, 'তারিখ তুলনা আর হিসাব করা', 'comparing-and-calculating-with-dates'),
      code('python', 'from datetime import datetime, timedelta\n\nnow = datetime.now()\ndeadline = datetime(2026, 12, 31)\n\ndifference = deadline - now\nprint(f"{difference.days} days remaining")\n\nnext_week = now + timedelta(days=7)\nprint(next_week.strftime("%Y-%m-%d"))'),
      p('<p><code>timedelta</code> একটি সময়ের ব্যাপ্তি বোঝায়, আর সরাসরি একটি <code>datetime</code>-এর সাথে যোগ বা বিয়োগ করা যায় — PHP-এর <code>DateTime::modify()</code>-এর মতো আলাদা কোনো "modify" মেথড নেই।</p>'),

      h(2, 'টেক্সট থেকে একটি তারিখ পার্স করা', 'parsing-a-date-from-text'),
      p('<p><code>strptime()</code> হলো <code>strftime()</code>-এর বিপরীত — এটি একটি স্ট্রিং <i>থেকে</i> একটি তারিখ পড়ে, কী আকৃতি প্রত্যাশিত তা বলতে একই ফরম্যাট কোড ব্যবহার করে:</p>'),
      code('python', 'from datetime import datetime\n\ntext = "30/07/2026"\nparsed = datetime.strptime(text, "%d/%m/%Y")\nprint(parsed.year)   # 2026\nprint(parsed.month)  # 7'),
      callout('warning', '<p>ফরম্যাট স্ট্রিং ইনপুটের সাথে ঠিক মিলতে হবে, নাহলে <code>strptime()</code> একটি <code>ValueError</code> তোলে — <code>"%Y-%m-%d"</code> দিয়ে পার্স করা <code>"30/07/2026"</code> অনুমান করার বদলে সরাসরি ব্যর্থ হয়। টেক্সটটা আপনার পুরোপুরি নিয়ন্ত্রণ করা কোনো উৎসের বদলে একজন ব্যবহারকারীর থেকে এলে এটাকে <code>try</code>/<code>except</code>-এ মুড়িয়ে দিন।</p>', 'strptime() ফরম্যাট অনুমান করে না'),

      callout('note', '<p>PHP-এর মতোই, Python-এ তারিখ আর সময় ডিফল্টভাবে "naive" — কোনো টাইম জোন যুক্ত নেই, সার্ভারের কনফিগার করা জোন স্বয়ংক্রিয়ভাবে ব্যবহার না করে। যেখানে পার্থক্যটা গুরুত্বপূর্ণ (বিভিন্ন অঞ্চল জুড়ে একটি নির্ধারিত ইভেন্ট), স্ট্যান্ডার্ড লাইব্রেরির <code>zoneinfo</code> মডিউল দেখুন।</p>', 'ডিফল্টভাবে কোনো টাইম জোন নেই'),
    ],
  },
})

lessons.push({
  slug: 'databases',
  sortOrder: 27,
  en: {
    title: 'Python and Databases',
    metaTitle: 'Python and Databases | Learn Computer Academy',
    metaDescription: 'Connecting Python to a database with sqlite3 and MySQL connectors, running queries safely, and why prepared statements matter here too.',
    blocks: [
      p('<p>This is where Python\'s ability to store and retrieve real data becomes practical. If you haven\'t looked at the <a href="/sql/intro/">Introduction to SQL</a> lesson yet, this is the right point to do it — from here on, this lesson assumes you know what a table, row, and basic <code>SELECT</code> statement are.</p>'),

      h(2, 'sqlite3: Built Into Python'),
      p('<p>Unlike PHP, which needs a separate extension for database access, Python\'s standard library includes <code>sqlite3</code> — a connector for SQLite, a simple database stored in a single file, no separate server needed. It\'s the easiest way to start:</p>'),
      code('python', 'import sqlite3\n\nconn = sqlite3.connect("school.db")\ncursor = conn.cursor()\n\ncursor.execute("SELECT name, course FROM students")\nfor row in cursor.fetchall():\n    print(row)\n\nconn.close()'),

      h(2, 'Connecting to MySQL'),
      p('<p>For MySQL specifically — the same database this site\'s own <a href="/sql/">SQL section</a> teaches — a third-party package handles the connection, installed with pip (from the Modules and Imports lesson):</p>'),
      code('bash', 'pip install mysql-connector-python'),
      code('python', 'import mysql.connector\n\ntry:\n    conn = mysql.connector.connect(\n        host="localhost",\n        user="root",\n        password="",\n        database="school",\n    )\n    print("Connected successfully.")\nexcept mysql.connector.Error as e:\n    print(f"Connection failed: {e}")'),
      p('<p>Wrapping the connection in <code>try</code>/<code>except</code> (from the Exception Handling lesson) matters here for the same reason it did in PHP — a database can be temporarily unreachable for reasons unrelated to your code.</p>'),

      img(
        'docs/img/python/databases-1',
        'Isometric diagram showing a Python script icon connected through a small key/plug connector shape to a cylindrical database icon, illustrating a secure connection between a script and a database',
        1024, 768,
        'A connector library sits between a Python script and a database, whether SQLite or MySQL.'
      ),

      h(2, 'Parameterized Queries — the Safe Way to Use Variables'),
      p('<p>Never build a query by directly gluing a variable into the SQL string — exactly the same warning as PHP\'s PDO lesson, and just as important here. Python\'s database connectors use <code>%s</code> placeholders instead of gluing variables in directly:</p>'),
      code('python', 'cursor = conn.cursor()\n\n# NEVER do this:\n# cursor.execute(f"SELECT * FROM students WHERE name = \'{name}\'")\n\n# Do this instead:\ncursor.execute("SELECT * FROM students WHERE name = %s", (name,))\nresult = cursor.fetchone()'),
      callout('warning', '<p>Gluing a variable directly into a SQL string opens the door to <b>SQL injection</b> — a visitor entering something like <code>anything\' OR \'1\'=\'1</code> could rewrite your query\'s logic entirely. Parameterized queries close this off completely, because the database driver itself keeps data and code separate — this is not something to skip "for simple cases," in Python any more than it was in PHP.</p>', 'This is not optional'),

      h(2, 'INSERT, UPDATE, and DELETE'),
      code('python', '# INSERT\ncursor.execute("INSERT INTO students (name, course) VALUES (%s, %s)", ("Priya", "Web Development"))\nconn.commit()  # writes are not saved until you commit\n\n# UPDATE\ncursor.execute("UPDATE students SET course = %s WHERE name = %s", ("Graphic Design", "Priya"))\nconn.commit()\n\n# DELETE\ncursor.execute("DELETE FROM students WHERE name = %s", ("Priya",))\nconn.commit()'),
      p('<p><code>conn.commit()</code> is a real difference from PHP\'s PDO, which commits automatically by default: Python\'s connectors require an explicit <code>commit()</code> after a write, or the change won\'t actually be saved.</p>'),

      h(2, 'Fetching One Row vs. Many'),
      p('<p>The sqlite3 example earlier used <code>fetchall()</code> — the cursor actually offers three ways to pull back results, and picking the right one avoids loading more into memory than you need:</p>'),
      table(
        ['Method', 'Returns'],
        [
          ['cursor.fetchone()', 'A single row (or None if there are no more) — use when you expect exactly one result'],
          ['cursor.fetchmany(n)', 'Up to n rows at once — useful for paging through a large result set in chunks'],
          ['cursor.fetchall()', 'Every remaining row, as a list — fine for small result sets, wasteful for huge ones'],
        ]
      ),
      code('python', 'cursor.execute("SELECT * FROM students WHERE name = %s", ("Priya",))\nstudent = cursor.fetchone()  # a single row, since names should be unique here\nprint(student)'),
    ],
  },
  bn: {
    title: 'Python আর ডেটাবেস',
    metaTitle: 'Python আর ডেটাবেস | Learn Computer Academy',
    metaDescription: 'sqlite3 আর MySQL কানেক্টর দিয়ে Python-কে একটি ডেটাবেসের সাথে কানেক্ট করা, নিরাপদে কোয়েরি চালানো, আর এখানেও কেন prepared statement গুরুত্বপূর্ণ।',
    blocks: [
      p('<p>এখানেই Python-এর প্রকৃত ডেটা সংরক্ষণ আর পুনরুদ্ধার করার ক্ষমতা ব্যবহারিক হয়ে ওঠে। এখনও <a href="/bn/sql/intro/">SQL পরিচিতি</a> পাঠটি না দেখে থাকলে, এখনই সেটা দেখার সঠিক সময় — এখান থেকে, এই পাঠটি ধরে নেয় আপনি জানেন একটি টেবিল, সারি, আর একটি সাধারণ <code>SELECT</code> স্টেটমেন্ট কী।</p>'),

      h(2, 'sqlite3: Python-এর সাথেই আসে', 'sqlite3-built-into-python'),
      p('<p>PHP-এর থেকে আলাদা, যার ডেটাবেস অ্যাক্সেসের জন্য একটি আলাদা এক্সটেনশন দরকার, Python-এর স্ট্যান্ডার্ড লাইব্রেরিতে <code>sqlite3</code> অন্তর্ভুক্ত — SQLite-এর জন্য একটি কানেক্টর, একটি সাধারণ ডেটাবেস একটি একক ফাইলে সংরক্ষিত, কোনো আলাদা সার্ভারের দরকার নেই। এটি শুরু করার সবচেয়ে সহজ উপায়:</p>'),
      code('python', 'import sqlite3\n\nconn = sqlite3.connect("school.db")\ncursor = conn.cursor()\n\ncursor.execute("SELECT name, course FROM students")\nfor row in cursor.fetchall():\n    print(row)\n\nconn.close()'),

      h(2, 'MySQL-এর সাথে কানেক্ট করা', 'connecting-to-mysql'),
      p('<p>নির্দিষ্টভাবে MySQL-এর জন্য — এই সাইটের নিজের <a href="/bn/sql/">SQL অংশ</a> যা শেখায় সেই একই ডেটাবেস — একটি থার্ড-পার্টি প্যাকেজ কানেকশন হ্যান্ডেল করে, pip দিয়ে ইনস্টল করা (Modules and Imports পাঠ থেকে):</p>'),
      code('bash', 'pip install mysql-connector-python'),
      code('python', 'import mysql.connector\n\ntry:\n    conn = mysql.connector.connect(\n        host="localhost",\n        user="root",\n        password="",\n        database="school",\n    )\n    print("Connected successfully.")\nexcept mysql.connector.Error as e:\n    print(f"Connection failed: {e}")'),
      p('<p>কানেকশনকে (Exception Handling পাঠের) <code>try</code>/<code>except</code>-এ মোড়ানো এখানেও একই কারণে গুরুত্বপূর্ণ যেমন PHP-তে ছিল — একটি ডেটাবেস আপনার কোডের সাথে সম্পর্কহীন কারণে সাময়িকভাবে অপ্রাপ্য হতে পারে।</p>'),

      img(
        'docs/img/python/databases-1',
        'একটি আইসোমেট্রিক ডায়াগ্রাম যেখানে একটি Python স্ক্রিপ্ট আইকন একটি ছোট চাবি/প্লাগ কানেক্টর আকৃতির মাধ্যমে একটি সিলিন্ডার-আকৃতির ডেটাবেস আইকনের সাথে সংযুক্ত, একটি স্ক্রিপ্ট আর একটি ডেটাবেসের মধ্যে একটি নিরাপদ কানেকশন বোঝাচ্ছে',
        1024, 768,
        'একটি কানেক্টর লাইব্রেরি একটি Python স্ক্রিপ্ট আর একটি ডেটাবেসের মাঝখানে থাকে, SQLite হোক বা MySQL।'
      ),

      h(2, 'প্যারামিটারাইজড কোয়েরি — ভ্যারিয়েবল ব্যবহারের নিরাপদ উপায়', 'parameterized-queries-the-safe-way-to-use-variables'),
      p('<p>কখনো সরাসরি একটি ভ্যারিয়েবল SQL স্ট্রিং-এ জোড়া লাগিয়ে একটি কোয়েরি তৈরি করবেন না — PHP-এর PDO পাঠের ঠিক একই সতর্কতা, আর এখানেও ঠিক ততটাই গুরুত্বপূর্ণ। Python-এর ডেটাবেস কানেক্টর সরাসরি ভ্যারিয়েবল জোড়া লাগানোর বদলে <code>%s</code> প্লেসহোল্ডার ব্যবহার করে:</p>'),
      code('python', 'cursor = conn.cursor()\n\n# NEVER do this:\n# cursor.execute(f"SELECT * FROM students WHERE name = \'{name}\'")\n\n# Do this instead:\ncursor.execute("SELECT * FROM students WHERE name = %s", (name,))\nresult = cursor.fetchone()'),
      callout('warning', '<p>একটি ভ্যারিয়েবল সরাসরি একটি SQL স্ট্রিংয়ে জোড়া লাগালে <b>SQL injection</b>-এর দরজা খুলে যায় — একজন visitor <code>anything\' OR \'1\'=\'1</code>-এর মতো কিছু দিলে আপনার কোয়েরির লজিক সম্পূর্ণভাবে পুনর্লিখন করে ফেলতে পারে। প্যারামিটারাইজড কোয়েরি এটা পুরোপুরি বন্ধ করে দেয়, কারণ ডেটাবেস ড্রাইভার নিজেই ডেটা আর কোডকে আলাদা রাখে — Python-এও এটা "সহজ ক্ষেত্রে" বাদ দেওয়ার মতো কিছু নয়, PHP-তে যেমন ছিল না।</p>', 'এটি ঐচ্ছিক নয়'),

      h(2, 'INSERT, UPDATE, আর DELETE', 'insert-update-and-delete'),
      code('python', '# INSERT\ncursor.execute("INSERT INTO students (name, course) VALUES (%s, %s)", ("Priya", "Web Development"))\nconn.commit()  # writes are not saved until you commit\n\n# UPDATE\ncursor.execute("UPDATE students SET course = %s WHERE name = %s", ("Graphic Design", "Priya"))\nconn.commit()\n\n# DELETE\ncursor.execute("DELETE FROM students WHERE name = %s", ("Priya",))\nconn.commit()'),
      p('<p><code>conn.commit()</code> PHP-এর PDO থেকে একটি আসল পার্থক্য, যা ডিফল্টভাবে স্বয়ংক্রিয়ভাবে commit করে: Python-এর কানেক্টরে একটি লেখার পর একটি স্পষ্ট <code>commit()</code> দরকার, নাহলে পরিবর্তনটা আসলে সংরক্ষিত হবে না।</p>'),

      h(2, 'একটি সারি আনা বনাম অনেকগুলো', 'fetching-one-row-vs-many'),
      p('<p>আগের sqlite3 উদাহরণটি <code>fetchall()</code> ব্যবহার করেছিল — cursor আসলে ফলাফল ফেরত আনার তিনটি উপায় দেয়, আর সঠিকটা বেছে নিলে প্রয়োজনের চেয়ে বেশি মেমরিতে লোড হওয়া এড়ানো যায়:</p>'),
      table(
        ['মেথড', 'রিটার্ন করে'],
        [
          ['cursor.fetchone()', 'একটি একক সারি (বা আর না থাকলে None) — যখন আপনি ঠিক একটি ফলাফল প্রত্যাশা করেন তখন ব্যবহার করুন'],
          ['cursor.fetchmany(n)', 'একবারে সর্বোচ্চ n সারি — খণ্ডে একটি বড় ফলাফল সেটের মধ্যে দিয়ে paging করার জন্য দরকারি'],
          ['cursor.fetchall()', 'বাকি প্রতিটি সারি, একটি লিস্ট হিসেবে — ছোট ফলাফল সেটের জন্য ঠিক আছে, বিশাল সেটের জন্য অপচয়ী'],
        ]
      ),
      code('python', 'cursor.execute("SELECT * FROM students WHERE name = %s", ("Priya",))\nstudent = cursor.fetchone()  # a single row, since names should be unique here\nprint(student)'),
    ],
  },
})

lessons.push({
  slug: 'where-to-go-next',
  sortOrder: 28,
  en: {
    title: 'Where to Go Next',
    metaTitle: 'Python: Where to Go Next | Learn Computer Academy',
    metaDescription: 'Virtual environments and pip in practice, and a pointer to the frameworks and libraries built on top of core Python — Flask, Django, and pandas.',
    blocks: [
      p('<p>This section has covered core Python — the part that stays the same no matter which of the domains from the first lesson you go on to work in. This closing lesson covers one practical workflow habit, and points toward what comes next.</p>'),

      h(2, 'Virtual Environments — Practical, Not Optional'),
      p('<p>Different projects often need different, sometimes conflicting, versions of the same package. A <b>virtual environment</b> gives each project its own isolated set of installed packages, instead of one shared pile for your entire machine:</p>'),
      code('bash', 'python3 -m venv myproject-env      # create it, once per project\nsource myproject-env/bin/activate  # activate it (Windows: myproject-env\\Scripts\\activate)\npip install requests               # installs only into this project\'s environment\ndeactivate                          # done for now'),
      callout('tip', '<p>Real Python projects create a virtual environment as one of the very first steps, before installing anything with pip. It\'s not a language feature, just a strong, near-universal convention — worth building the habit early.</p>', 'Do this from your very first real project'),

      h(2, 'What Comes Next, by Domain'),
      table(
        ['If you want to...', 'Look at'],
        [
          ['Build web applications', 'Flask (small, flexible) or Django (larger, more built-in structure)'],
          ['Work with data', 'pandas (data analysis), NumPy (numerical computing)'],
          ['Do machine learning / AI', 'scikit-learn, PyTorch, TensorFlow'],
          ['Automate tasks', 'The standard library alone often covers this — os, shutil, subprocess'],
        ]
      ),
      p('<p>None of these are covered in this section on purpose — each is substantial enough to deserve its own dedicated learning path once core Python feels comfortable, and picking one before you\'re ready to use it well tends to slow learning down rather than speed it up.</p>'),

      h(2, 'Where the Official Docs Help'),
      p('<p>This section can\'t track every detail of a language that keeps evolving. The <a href="https://docs.python.org/3/" target="_blank" rel="noopener noreferrer">official Python documentation</a> is the authoritative, always-current reference — worth bookmarking, and worth reaching for whenever you need something more exhaustive than a lesson here provides.</p>'),

      h(2, 'A Few Habits Worth Building Early'),
      table(
        ['Tool', 'What it\'s for'],
        [
          ['pytest', 'Writing automated tests — catches a broken function before a user does'],
          ['black', 'Automatic code formatting — one consistent style, no debate needed'],
          ['ruff', 'Fast linting — flags unused imports, likely bugs, and style issues as you write'],
        ]
      ),
      p('<p>None of these are required to write working Python, and none are covered elsewhere in this section — they\'re mentioned here because real, professional Python codebases use all three routinely, and picking them up early is far cheaper than retrofitting them onto a large project later.</p>'),

      p('<p>The fundamentals in this section — data types, control flow, functions, OOP, files, and databases — are the same whichever direction you take from here.</p>'),
    ],
  },
  bn: {
    title: 'এরপর কোথায় যাবেন',
    metaTitle: 'Python: এরপর কোথায় যাবেন | Learn Computer Academy',
    metaDescription: 'বাস্তবে virtual environment আর pip, আর core Python-এর উপর তৈরি ফ্রেমওয়ার্ক আর লাইব্রেরির দিকে একটি নির্দেশনা — Flask, Django, আর pandas।',
    blocks: [
      p('<p>এই অংশটি core Python কভার করেছে — সেই অংশ যা প্রথম পাঠের যে ডোমেইনেই আপনি এগিয়ে যান না কেন একই থাকে। এই শেষ পাঠটি একটি ব্যবহারিক ওয়ার্কফ্লো অভ্যাস কভার করে, আর এরপর কী আসছে তার দিকে নির্দেশ করে।</p>'),

      h(2, 'Virtual Environment — ব্যবহারিক, ঐচ্ছিক নয়', 'virtual-environments-practical-not-optional'),
      p('<p>বিভিন্ন প্রজেক্টে প্রায়ই একই প্যাকেজের ভিন্ন, কখনো কখনো সাংঘর্ষিক ভার্সন দরকার হয়। একটি <b>virtual environment</b> প্রতিটি প্রজেক্টকে ইনস্টল করা প্যাকেজের নিজস্ব আলাদা সেট দেয়, আপনার পুরো মেশিনের জন্য একটি শেয়ার করা স্তূপের বদলে:</p>'),
      code('bash', 'python3 -m venv myproject-env      # create it, once per project\nsource myproject-env/bin/activate  # activate it (Windows: myproject-env\\Scripts\\activate)\npip install requests               # installs only into this project\'s environment\ndeactivate                          # done for now'),
      callout('tip', '<p>বাস্তব Python প্রজেক্ট pip দিয়ে কিছু ইনস্টল করার আগে, প্রথম কয়েকটি ধাপের একটি হিসেবে একটি virtual environment তৈরি করে। এটি কোনো ভাষা ফিচার নয়, শুধু একটি শক্তিশালী, প্রায়-সার্বজনীন প্রথা — তাড়াতাড়ি এই অভ্যাসটি গড়ে তোলা মূল্যবান।</p>', 'আপনার প্রথম বাস্তব প্রজেক্ট থেকেই এটা করুন'),

      h(2, 'ডোমেইন অনুযায়ী এরপর কী আসছে', 'what-comes-next-by-domain'),
      table(
        ['আপনি যদি চান...', 'দেখুন'],
        [
          ['ওয়েব অ্যাপ্লিকেশন বানাতে', 'Flask (ছোট, নমনীয়) বা Django (বড়, বেশি বিল্ট-ইন গঠন)'],
          ['ডেটা নিয়ে কাজ করতে', 'pandas (ডেটা বিশ্লেষণ), NumPy (numerical computing)'],
          ['মেশিন লার্নিং / AI করতে', 'scikit-learn, PyTorch, TensorFlow'],
          ['কাজ স্বয়ংক্রিয় করতে', 'শুধু স্ট্যান্ডার্ড লাইব্রেরিই প্রায়ই এটা কভার করে — os, shutil, subprocess'],
        ]
      ),
      p('<p>এদের কোনোটাই ইচ্ছাকৃতভাবে এই অংশে কভার করা হয়নি — core Python স্বাচ্ছন্দ্যজনক মনে হলে প্রতিটির নিজস্ব আলাদা শেখার পথ পাওয়ার মতো যথেষ্ট বিষয় আছে, আর ভালোভাবে ব্যবহার করার জন্য প্রস্তুত হওয়ার আগে একটি বেছে নেওয়া শেখাকে দ্রুত করার বদলে ধীর করে দেয়।</p>'),

      h(2, 'অফিসিয়াল ডকুমেন্টেশন যেখানে সাহায্য করে', 'where-the-official-docs-help'),
      p('<p>এই অংশটি একটি ক্রমাগত বিবর্তিত ভাষার প্রতিটি খুঁটিনাটি ট্র্যাক করতে পারে না। <a href="https://docs.python.org/3/" target="_blank" rel="noopener noreferrer">অফিসিয়াল Python ডকুমেন্টেশন</a> প্রামাণ্য, সবসময়-বর্তমান রেফারেন্স — বুকমার্ক করার মতো, আর এখানকার একটি পাঠ যা দেয় তার চেয়ে বেশি বিস্তারিত কিছু প্রয়োজন হলেই এটার দিকে যাওয়ার মতো।</p>'),

      h(2, 'তাড়াতাড়ি গড়ে তোলার মতো কিছু অভ্যাস', 'a-few-habits-worth-building-early'),
      table(
        ['টুল', 'কীসের জন্য'],
        [
          ['pytest', 'স্বয়ংক্রিয় টেস্ট লেখা — একজন ব্যবহারকারীর আগেই একটি ভাঙা ফাংশন ধরে ফেলে'],
          ['black', 'স্বয়ংক্রিয় কোড ফরম্যাটিং — একটি সামঞ্জস্যপূর্ণ স্টাইল, কোনো বিতর্কের দরকার নেই'],
          ['ruff', 'দ্রুত linting — লেখার সময়ই ব্যবহার না হওয়া import, সম্ভাব্য বাগ, আর স্টাইল সমস্যা চিহ্নিত করে'],
        ]
      ),
      p('<p>এদের কোনোটাই কার্যকর Python লেখার জন্য বাধ্যতামূলক নয়, আর এই অংশে অন্য কোথাও কভার করা হয়নি — এখানে উল্লেখ করা হয়েছে কারণ বাস্তব, পেশাদার Python কোডবেস নিয়মিতভাবে তিনটাই ব্যবহার করে, আর তাড়াতাড়ি এগুলো তুলে নেওয়া পরে একটি বড় প্রজেক্টে সেগুলো যোগ করার চেয়ে অনেক সস্তা।</p>'),

      p('<p>এই অংশের মূল বিষয়গুলো — ডেটা টাইপ, কন্ট্রোল ফ্লো, ফাংশন, OOP, ফাইল, আর ডেটাবেস — এখান থেকে আপনি যে দিকেই যান না কেন একই থাকে।</p>'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'python').single()
  if (catErr || !category) {
    console.error('Category "python" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] python/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] python/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `python/${lesson.slug}`
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
