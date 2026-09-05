#!/usr/bin/env node
// Extends the existing "Python" category (29 lessons) with 9 more lessons
// covering real gaps found against a roadmap.sh "Python" roadmap PDF the
// user shared 2026-09-03 — asked "is everything in python in this document
// covered in our course". Checked actual content, not keyword hits — e.g.
// python/file-handling uses `with open(...)` constantly but never teaches
// the context-manager pattern itself; python/modules-and-imports has one
// passing `import re` mention, never teaches regex.
//
// 9 gaps found: decorators, context managers, regular expressions,
// recursion, concurrency (threading/asyncio/GIL), testing (taught with the
// stdlib unittest rather than picking pytest, mirroring the node:test /
// built-in-fetch discipline from the earlier Node.js gap batch),
// json.loads/json.dumps, virtual environments (mentioned only as a
// where-to-go-next pointer, never actually taught), and deeper type hints.
// The PDF's separate "Data Structures & Algorithms" branch (arrays/linked
// lists/hash tables/heaps/BST/sorting algorithms) is distinct from "Learn
// the Basics" in the PDF's own layout — DSA territory, left out. Package
// manager alternatives (Conda/uv/Poetry), formatters (black/ruff), doc
// generators (Sphinx), and frameworks (FastAPI/Django/Flask) judged
// ecosystem-choice/tooling, same boundary used across every PDF check
// today.
//
// User picked "build all 9" over AskUserQuestion.
//
// Inserted before python/where-to-go-next and python/practice-projects
// (both bumped to the new end, practice-projects staying the very last
// lesson as the capstone) — same "keep the closer last" pattern as the
// react and nodejs gap batches.
//
// Style: matches this category's own established house style (see
// python/iterators-and-generators). Bengali matches this category's
// script-transliteration convention, verified against that same lesson.
//
// sort_order: new lessons 28-36; where-to-go-next bumped 28->37,
// practice-projects bumped 29->38.
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-python-gap-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

function h(level, text, anchor) {
  const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor: a }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function code(language, source) { return { id: nanoid(12), type: 'code', language, code: source, runnable: false } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }

const lessons = []
let n = 28

// ═══ 1. DECORATORS ══════════════════════════════════════════════════════

lessons.push({
  slug: 'decorators', sortOrder: n++,
  en: {
    title: 'Decorators',
    metaTitle: 'Python Decorators | Learn Computer Academy',
    metaDescription: 'A function that wraps another function to add behavior without changing its code — the @ syntax, and why it\'s used constantly in real Python.',
    blocks: [
      p('<p>The earlier OOP lesson used <code>@property</code> without explaining the mechanism behind it. A <b>decorator</b> is a function that takes another function, wraps it with extra behavior, and returns the wrapped version — the <code>@</code> syntax is just a convenient way to apply one.</p>'),
      h(2, 'A Decorator Without the @ Syntax'),
      code('python', 'def shout(func):\n    def wrapper():\n        result = func()\n        return result.upper()\n    return wrapper\n\ndef greet():\n    return \'hello\'\n\nloud_greet = shout(greet)\nprint(loud_greet())   # HELLO'),
      h(2, 'The Same Thing, with @ Syntax'),
      code('python', 'def shout(func):\n    def wrapper():\n        result = func()\n        return result.upper()\n    return wrapper\n\n@shout\ndef greet():\n    return \'hello\'\n\nprint(greet())   # HELLO — @shout applied automatically'),
      p('<p><code>@shout</code> above <code>def greet():</code> is exactly equivalent to writing <code>greet = shout(greet)</code> right after defining it.</p>'),
      h(2, 'Handling Arguments — *args and **kwargs'),
      p('<p>A real decorator needs to pass through whatever arguments the wrapped function actually takes, without knowing them in advance.</p>'),
      code('python', 'import time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f\'{func.__name__} took {time.time() - start:.4f}s\')\n        return result\n    return wrapper\n\n@timer\ndef slow_add(a, b):\n    time.sleep(1)\n    return a + b\n\nslow_add(2, 3)   # prints: slow_add took 1.0003s'),
      h(2, 'Common Built-in Decorators'),
      table(['Decorator', 'What it does'], [
        ['@property', 'Lets a method be accessed like an attribute — covered in the earlier OOP lesson'],
        ['@staticmethod', 'Marks a method that doesn\'t use self at all'],
        ['@classmethod', 'Passes the class itself (cls) instead of an instance'],
        ['@functools.lru_cache', 'Caches a function\'s return value for repeated calls with the same arguments'],
      ]),
      callout('tip', '<p>A decorator is one of the cleanest ways to add cross-cutting behavior — logging, timing, caching, access checks — without repeating that logic inside every function it applies to.</p>', 'Why this pattern is everywhere in real code'),
    ],
  },
  bn: {
    title: 'Decorator',
    metaTitle: 'Python Decorator | Learn Computer Academy',
    metaDescription: 'একটি function যা কোড না বদলে behavior যোগ করতে অন্য একটি function-কে wrap করে — @ সিনট্যাক্স, আর কেন এটা আসল Python-এ ক্রমাগত ব্যবহৃত হয়।',
    blocks: [
      p('<p>আগের OOP lesson এর পেছনের mechanism ব্যাখ্যা না করেই <code>@property</code> ব্যবহার করেছিল। একটি <b>decorator</b> এমন একটি function যা অন্য একটি function নেয়, এটাকে অতিরিক্ত behavior দিয়ে wrap করে, আর wrap করা version return করে — <code>@</code> সিনট্যাক্স একটা প্রয়োগ করার একটা সুবিধাজনক উপায় মাত্র।</p>'),
      h(2, '@ সিনট্যাক্স ছাড়া একটা Decorator', '@-সিনট্যাক্স-ছাড়া-একটা-decorator'),
      code('python', 'def shout(func):\n    def wrapper():\n        result = func()\n        return result.upper()\n    return wrapper\n\ndef greet():\n    return \'hello\'\n\nloud_greet = shout(greet)\nprint(loud_greet())   # HELLO'),
      h(2, 'একই জিনিস, @ সিনট্যাক্স সহ', 'একই-জিনিস-সিনট্যাক্স-সহ'),
      code('python', 'def shout(func):\n    def wrapper():\n        result = func()\n        return result.upper()\n    return wrapper\n\n@shout\ndef greet():\n    return \'hello\'\n\nprint(greet())   # HELLO — @shout স্বয়ংক্রিয়ভাবে apply হয়'),
      p('<p><code>def greet():</code>-এর উপরে <code>@shout</code> ঠিক define করার পরে <code>greet = shout(greet)</code> লেখার সমতুল্য।</p>'),
      h(2, 'Argument Handle করা — *args ও **kwargs', 'argument-handle-করা-args-ও-kwargs'),
      p('<p>একটা আসল decorator-এর wrap করা function আগে থেকে না জেনেই যা যা argument নেয় তা pass through করা দরকার।</p>'),
      code('python', 'import time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f\'{func.__name__} took {time.time() - start:.4f}s\')\n        return result\n    return wrapper\n\n@timer\ndef slow_add(a, b):\n    time.sleep(1)\n    return a + b\n\nslow_add(2, 3)   # print করে: slow_add took 1.0003s'),
      h(2, 'সাধারণ Built-in Decorator', 'সাধারণ-built-in-decorator'),
      table(['Decorator', 'কী করে'], [
        ['@property', 'একটা method-কে attribute-এর মতো access করতে দেয় — আগের OOP lesson-এ কভার করা'],
        ['@staticmethod', 'একদম self ব্যবহার করে না এমন একটা method চিহ্নিত করে'],
        ['@classmethod', 'একটা instance-এর বদলে ক্লাস নিজেই (cls) পাঠায়'],
        ['@functools.lru_cache', 'একই argument দিয়ে বারবার call-এর জন্য একটা function-এর return মান cache করে'],
      ]),
      callout('tip', '<p>Logging, timing, caching, access check — এগুলো প্রয়োগ হওয়া প্রতিটা function-এর ভেতরে সেই logic না repeat করে cross-cutting behavior যোগ করার সবচেয়ে পরিষ্কার উপায়গুলোর একটা decorator।</p>', 'কেন এই pattern আসল কোডে সবখানে আছে'),
    ],
  },
})

// ═══ 2. CONTEXT MANAGERS ═════════════════════════════════════════════════

lessons.push({
  slug: 'context-managers', sortOrder: n++,
  en: {
    title: 'Context Managers — the with Statement',
    metaTitle: 'Python Context Managers | Learn Computer Academy',
    metaDescription: 'The pattern behind "with open(...) as f" — guaranteed setup and cleanup, and how to write a context manager of your own.',
    blocks: [
      p('<p>The earlier File Handling lesson used <code>with open(\'file.txt\') as f:</code> without explaining why. A <b>context manager</b> guarantees a cleanup step runs — closing a file, releasing a lock, closing a database connection — even if an error happens in between.</p>'),
      h(2, 'What with Actually Does'),
      code('python', 'with open(\'notes.txt\') as f:\n    content = f.read()\n# f.close() runs automatically here — even if the code above raised an error'),
      p('<p>Without <code>with</code>, the same safety needs a manual <code>try</code>/<code>finally</code> — the whole point of a context manager is not needing to write that by hand every time.</p>'),
      code('python', '# The manual equivalent, for comparison\nf = open(\'notes.txt\')\ntry:\n    content = f.read()\nfinally:\n    f.close()'),
      h(2, 'Writing a Context Manager — __enter__ and __exit__'),
      p('<p>Any class implementing these two methods can be used with <code>with</code>.</p>'),
      code('python', 'class Timer:\n    def __enter__(self):\n        import time\n        self.start = time.time()\n        return self\n\n    def __exit__(self, exc_type, exc_value, traceback):\n        import time\n        print(f\'Elapsed: {time.time() - self.start:.2f}s\')\n\nwith Timer():\n    slow_operation()\n# The elapsed time prints automatically when the block ends'),
      h(2, 'A Simpler Way — contextlib.contextmanager'),
      p('<p>For a simple case, a generator function decorated with <code>@contextmanager</code> avoids writing a whole class.</p>'),
      code('python', 'from contextlib import contextmanager\nimport time\n\n@contextmanager\ndef timer():\n    start = time.time()\n    yield\n    print(f\'Elapsed: {time.time() - start:.2f}s\')\n\nwith timer():\n    slow_operation()'),
      p('<p>Everything before <code>yield</code> runs as setup (like <code>__enter__</code>); everything after runs as cleanup (like <code>__exit__</code>), and always runs even if the block raises.</p>'),
      table(['Common context manager', 'What it cleans up'], [
        ['open()', 'Closes the file'],
        ['threading.Lock()', 'Releases the lock'],
        ['a database connection object', 'Closes the connection'],
        ['unittest.mock.patch()', 'Restores the original, un-mocked value'],
      ]),
      callout('note', '<p>__exit__ receiving exception details (exc_type, exc_value, traceback) lets a context manager react to — or even suppress — an error, not just clean up after a successful block. Most simple context managers ignore these and just do cleanup regardless.</p>', 'What those three __exit__ arguments are for'),
    ],
  },
  bn: {
    title: 'Context Manager — with Statement',
    metaTitle: 'Python Context Manager | Learn Computer Academy',
    metaDescription: '"with open(...) as f"-এর পেছনের pattern — নিশ্চিত setup ও cleanup, আর নিজের একটা context manager কীভাবে লিখবেন।',
    blocks: [
      p('<p>আগের File Handling lesson কেন তা ব্যাখ্যা না করেই <code>with open(\'file.txt\') as f:</code> ব্যবহার করেছিল। একটা <b>context manager</b> নিশ্চিত করে একটা cleanup step চলে — একটা file বন্ধ করা, একটা lock ছেড়ে দেওয়া, একটা database connection বন্ধ করা — মাঝখানে একটা error ঘটলেও।</p>'),
      h(2, 'with আসলে কী করে', 'with-আসলে-কী-করে'),
      code('python', 'with open(\'notes.txt\') as f:\n    content = f.read()\n# এখানে f.close() স্বয়ংক্রিয়ভাবে চলে — উপরের কোড error দিলেও'),
      p('<p><code>with</code> ছাড়া, একই safety-র জন্য একটা manual <code>try</code>/<code>finally</code> দরকার — একটা context manager-এর পুরো উদ্দেশ্য প্রতিবার এটা হাতে লেখার দরকার না হওয়া।</p>'),
      code('python', '# তুলনার জন্য, manual সমতুল্য\nf = open(\'notes.txt\')\ntry:\n    content = f.read()\nfinally:\n    f.close()'),
      h(2, 'একটা Context Manager লেখা — __enter__ ও __exit__', 'একটা-context-manager-লেখা-enter-ও-exit'),
      p('<p>এই দুটো method implement করা যেকোনো ক্লাস <code>with</code>-এর সাথে ব্যবহার করা যায়।</p>'),
      code('python', 'class Timer:\n    def __enter__(self):\n        import time\n        self.start = time.time()\n        return self\n\n    def __exit__(self, exc_type, exc_value, traceback):\n        import time\n        print(f\'Elapsed: {time.time() - self.start:.2f}s\')\n\nwith Timer():\n    slow_operation()\n# block শেষ হলে elapsed time স্বয়ংক্রিয়ভাবে print হয়'),
      h(2, 'একটা সহজ উপায় — contextlib.contextmanager', 'একটা-সহজ-উপায়-contextlibcontextmanager'),
      p('<p>একটা সহজ case-এর জন্য, <code>@contextmanager</code> দিয়ে decorate করা একটা generator function একটা পুরো ক্লাস লেখা এড়ায়।</p>'),
      code('python', 'from contextlib import contextmanager\nimport time\n\n@contextmanager\ndef timer():\n    start = time.time()\n    yield\n    print(f\'Elapsed: {time.time() - start:.2f}s\')\n\nwith timer():\n    slow_operation()'),
      p('<p><code>yield</code>-এর আগে সবকিছু setup হিসেবে চলে (<code>__enter__</code>-এর মতো); পরে সবকিছু cleanup হিসেবে চলে (<code>__exit__</code>-এর মতো), আর block raise করলেও সবসময় চলে।</p>'),
      table(['Common context manager', 'যা clean up করে'], [
        ['open()', 'File বন্ধ করে'],
        ['threading.Lock()', 'Lock ছেড়ে দেয়'],
        ['একটা database connection object', 'Connection বন্ধ করে'],
        ['unittest.mock.patch()', 'আসল, un-mocked মান ফিরিয়ে আনে'],
      ]),
      callout('note', '<p>Exception detail (exc_type, exc_value, traceback) পাওয়া __exit__ একটা context manager-কে শুধু একটা সফল block-এর পরে clean up না, একটা error-এ react করতে — এমনকি suppress করতেও দেয়। বেশিরভাগ সহজ context manager এগুলো ignore করে আর যাই হোক cleanup করে।</p>', 'সেই তিনটা __exit__ argument কীসের জন্য'),
    ],
  },
})

// ═══ 3. REGULAR EXPRESSIONS ═══════════════════════════════════════════════

lessons.push({
  slug: 'regular-expressions', sortOrder: n++,
  en: {
    title: 'Regular Expressions',
    metaTitle: 'Python Regular Expressions | Learn Computer Academy',
    metaDescription: 'Pattern matching in text with the re module — searching, matching, and replacing text that follows a shape rather than an exact string.',
    blocks: [
      p('<p>A regular expression (<b>regex</b>) describes a pattern of text rather than an exact string — matching "any email address" or "any phone number," not one specific value. Python\'s built-in <code>re</code> module handles all of it.</p>'),
      h(2, 'Basic Matching'),
      code('python', 'import re\n\ntext = \'My phone number is 555-1234\'\nmatch = re.search(r\'\\d{3}-\\d{4}\', text)\n\nif match:\n    print(match.group())   # 555-1234'),
      h(2, 'Common Pattern Symbols'),
      table(['Symbol', 'Matches'], [
        ['\\d', 'Any digit (0-9)'],
        ['\\w', 'Any word character (letter, digit, underscore)'],
        ['\\s', 'Any whitespace'],
        ['.', 'Any single character'],
        ['*', 'Zero or more of the previous character'],
        ['+', 'One or more of the previous character'],
        ['?', 'Zero or one of the previous character (optional)'],
        ['{n}', 'Exactly n repetitions'],
        ['^  $', 'Start of string / end of string'],
      ]),
      h(2, 'Finding Every Match'),
      code('python', 'text = \'Contact us at sam@example.com or admin@test.org\'\nemails = re.findall(r\'[\\w.]+@[\\w.]+\', text)\nprint(emails)   # [\'sam@example.com\', \'admin@test.org\']'),
      h(2, 'Replacing Text'),
      code('python', 'text = \'Call 555-1234 or 555-5678\'\nmasked = re.sub(r\'\\d{3}-\\d{4}\', \'XXX-XXXX\', text)\nprint(masked)   # Call XXX-XXXX or XXX-XXXX'),
      h(2, 'Capturing Groups'),
      p('<p>Parentheses mark a part of the match worth pulling out separately.</p>'),
      code('python', 'match = re.search(r\'(\\w+)@(\\w+)\\.com\', \'sam@example.com\')\nprint(match.group(1))   # sam\nprint(match.group(2))   # example'),
      table(['Function', 'Purpose'], [
        ['re.search()', 'Finds the first match anywhere in the string'],
        ['re.match()', 'Checks only at the very start of the string'],
        ['re.findall()', 'Returns every match as a list'],
        ['re.sub()', 'Replaces every match with new text'],
        ['re.split()', 'Splits a string wherever the pattern matches'],
      ]),
      callout('tip', '<p>A regex that becomes genuinely unreadable is a sign to reconsider it — a few named steps of plain string methods, or a dedicated parsing library for something structured like HTML, is often the better choice for complex cases.</p>', 'When not to reach for regex'),
    ],
  },
  bn: {
    title: 'Regular Expression',
    metaTitle: 'Python Regular Expression | Learn Computer Academy',
    metaDescription: 're module দিয়ে টেক্সটে pattern matching — একটা সঠিক string-এর বদলে একটা আকার অনুসরণ করা টেক্সট search, match, আর replace করা।',
    blocks: [
      p('<p>একটা regular expression (<b>regex</b>) একটা সঠিক string-এর বদলে টেক্সটের একটা pattern বর্ণনা করে — "যেকোনো email address" বা "যেকোনো phone number" match করা, একটা নির্দিষ্ট মান না। Python-এর built-in <code>re</code> module এসবই handle করে।</p>'),
      h(2, 'মৌলিক Matching', 'মৌলিক-matching'),
      code('python', 'import re\n\ntext = \'My phone number is 555-1234\'\nmatch = re.search(r\'\\d{3}-\\d{4}\', text)\n\nif match:\n    print(match.group())   # 555-1234'),
      h(2, 'সাধারণ Pattern চিহ্ন', 'সাধারণ-pattern-চিহ্ন'),
      table(['চিহ্ন', 'যা match করে'], [
        ['\\d', 'যেকোনো digit (0-9)'],
        ['\\w', 'যেকোনো word character (অক্ষর, digit, underscore)'],
        ['\\s', 'যেকোনো whitespace'],
        ['.', 'যেকোনো একক character'],
        ['*', 'আগের character-এর শূন্য বা বেশি'],
        ['+', 'আগের character-এর এক বা বেশি'],
        ['?', 'আগের character-এর শূন্য বা একটা (optional)'],
        ['{n}', 'ঠিক n বার repetition'],
        ['^  $', 'String-এর শুরু / string-এর শেষ'],
      ]),
      h(2, 'প্রতিটা Match খুঁজে বের করা', 'প্রতিটা-match-খুঁজে-বের-করা'),
      code('python', 'text = \'Contact us at sam@example.com or admin@test.org\'\nemails = re.findall(r\'[\\w.]+@[\\w.]+\', text)\nprint(emails)   # [\'sam@example.com\', \'admin@test.org\']'),
      h(2, 'টেক্সট Replace করা', 'টেক্সট-replace-করা'),
      code('python', 'text = \'Call 555-1234 or 555-5678\'\nmasked = re.sub(r\'\\d{3}-\\d{4}\', \'XXX-XXXX\', text)\nprint(masked)   # Call XXX-XXXX or XXX-XXXX'),
      h(2, 'Capturing Group'),
      p('<p>Parenthesis match-এর একটা অংশ চিহ্নিত করে যা আলাদাভাবে বের করার যোগ্য।</p>'),
      code('python', 'match = re.search(r\'(\\w+)@(\\w+)\\.com\', \'sam@example.com\')\nprint(match.group(1))   # sam\nprint(match.group(2))   # example'),
      table(['Function', 'উদ্দেশ্য'], [
        ['re.search()', 'string-এর যেকোনো জায়গায় প্রথম match খুঁজে'],
        ['re.match()', 'শুধু string-এর একদম শুরুতে check করে'],
        ['re.findall()', 'প্রতিটা match একটা list হিসেবে return করে'],
        ['re.sub()', 'প্রতিটা match নতুন টেক্সট দিয়ে replace করে'],
        ['re.split()', 'যেখানেই pattern match করে সেখানে একটা string ভাগ করে'],
      ]),
      callout('tip', '<p>সত্যিকারভাবে পড়ার অযোগ্য হয়ে যাওয়া একটা regex এটা আবার ভাবার একটা চিহ্ন — plain string method-এর কয়েকটা named step, বা HTML-এর মতো structured কিছুর জন্য একটা dedicated parsing library, জটিল case-এর জন্য প্রায়ই ভালো পছন্দ।</p>', 'কখন regex-এর জন্য যাবেন না'),
    ],
  },
})

// ═══ 4. RECURSION ═════════════════════════════════════════════════════════

lessons.push({
  slug: 'recursion', sortOrder: n++,
  en: {
    title: 'Recursion',
    metaTitle: 'Python Recursion | Learn Computer Academy',
    metaDescription: 'A function calling itself to solve a smaller version of the same problem — the base case, the call stack it builds, and Python\'s recursion limit.',
    blocks: [
      p('<p>Recursion is a function solving a problem by calling itself with a smaller version of that same problem, until it reaches a version simple enough to answer directly.</p>'),
      h(2, 'A Basic Example — Factorial'),
      code('python', 'def factorial(n):\n    if n <= 1:\n        return 1              # base case — stops the recursion\n    return n * factorial(n - 1)   # recursive case\n\nfactorial(5)   # 5 * 4 * 3 * 2 * 1 = 120'),
      h(2, 'The Base Case Is Not Optional'),
      code('python', 'def count_down(n):\n    # Missing base case — this never stops on its own\n    print(n)\n    count_down(n - 1)\n# count_down(5) eventually raises:\n# RecursionError: maximum recursion depth exceeded'),
      callout('warning', '<p>Every recursive function needs a base case that\'s actually reachable — a base case that never triggers fails exactly the same way as no base case at all.</p>', 'The most common recursion bug'),
      h(2, 'Python\'s Recursion Limit'),
      p('<p>Unlike some languages, Python enforces a default limit (usually 1000) on how deep a recursive call chain can go, specifically to catch runaway recursion before it crashes the interpreter.</p>'),
      code('python', 'import sys\nprint(sys.getrecursionlimit())   # 1000, by default\n\n# Raising it is possible but rarely the right fix —\n# it usually means the problem should be solved with a loop instead\nsys.setrecursionlimit(3000)'),
      h(2, 'A Classic Recursive Problem — Fibonacci'),
      code('python', 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\n[fibonacci(i) for i in range(8)]\n# [0, 1, 1, 2, 3, 5, 8, 13]'),
      h(2, 'Recursion vs. a Loop'),
      table(['Recursion', 'A loop'], [
        ['Often reads more naturally for a naturally recursive problem (traversing a tree, nested data)', 'Usually faster and uses less memory for a simple repeated task'],
        ['Each call adds a call stack frame — deep recursion can hit Python\'s recursion limit', 'No stack depth concern regardless of how many iterations'],
      ]),
      callout('tip', '<p>The Fibonacci example above recalculates the same values repeatedly — genuinely slow past small inputs. The earlier @functools.lru_cache decorator (from the Decorators lesson) fixes this specific problem by caching each result the first time it\'s computed.</p>', 'A real optimization for recursive functions'),
    ],
  },
  bn: {
    title: 'Recursion',
    metaTitle: 'Python Recursion | Learn Computer Academy',
    metaDescription: 'একই সমস্যার একটা ছোট version সমাধান করতে নিজেকে call করা একটা function — base case, এটা যে call stack বানায়, আর Python-এর recursion limit।',
    blocks: [
      p('<p>Recursion মানে একটা function একই সমস্যার একটা ছোট version দিয়ে নিজেকে call করে সমস্যা সমাধান করে, যতক্ষণ না এটা সরাসরি উত্তর দেওয়ার মতো যথেষ্ট সহজ একটা version-এ পৌঁছায়।</p>'),
      h(2, 'একটা মৌলিক উদাহরণ — Factorial', 'একটা-মৌলিক-উদাহরণ-factorial'),
      code('python', 'def factorial(n):\n    if n <= 1:\n        return 1              # base case — recursion থামায়\n    return n * factorial(n - 1)   # recursive case\n\nfactorial(5)   # 5 * 4 * 3 * 2 * 1 = 120'),
      h(2, 'Base Case Optional না', 'base-case-optional-না'),
      code('python', 'def count_down(n):\n    # base case নেই — এটা নিজে থেকে কখনো থামে না\n    print(n)\n    count_down(n - 1)\n# count_down(5) শেষ পর্যন্ত raise করে:\n# RecursionError: maximum recursion depth exceeded'),
      callout('warning', '<p>প্রতিটা recursive function-এর সত্যিকারভাবে পৌঁছানো যায় এমন একটা base case দরকার — কখনো trigger না হওয়া একটা base case কোনো base case না থাকার মতোই একই রকম ব্যর্থ হয়।</p>', 'সবচেয়ে common recursion bug'),
      h(2, 'Python-এর Recursion Limit', 'python-এর-recursion-limit'),
      p('<p>কিছু ভাষার মতো না, Python একটা recursive call chain কতটা গভীর যেতে পারে তার উপর একটা default limit (সাধারণত ১০০০) প্রয়োগ করে, specifically interpreter crash করার আগে runaway recursion ধরার জন্য।</p>'),
      code('python', 'import sys\nprint(sys.getrecursionlimit())   # default-এ 1000\n\n# এটা বাড়ানো সম্ভব কিন্তু কমই সঠিক সমাধান —\n# এর মানে সাধারণত সমস্যাটা এর বদলে একটা loop দিয়ে সমাধান করা উচিত\nsys.setrecursionlimit(3000)'),
      h(2, 'একটা ক্লাসিক Recursive সমস্যা — Fibonacci', 'একটা-ক্লাসিক-recursive-সমস্যা-fibonacci'),
      code('python', 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\n[fibonacci(i) for i in range(8)]\n# [0, 1, 1, 2, 3, 5, 8, 13]'),
      h(2, 'Recursion বনাম একটা Loop', 'recursion-বনাম-একটা-loop'),
      table(['Recursion', 'একটা Loop'], [
        ['স্বাভাবিকভাবে recursive একটা সমস্যার জন্য (একটা tree traverse করা, nested data) প্রায়ই বেশি স্বাভাবিক দেখায়', 'একটা সহজ repeated কাজের জন্য সাধারণত দ্রুত আর কম memory ব্যবহার করে'],
        ['প্রতিটা call একটা call stack frame যোগ করে — গভীর recursion Python-এর recursion limit-এ পৌঁছাতে পারে', 'যত iteration-ই হোক না কেন কোনো stack depth উদ্বেগ নেই'],
      ]),
      callout('tip', '<p>উপরের Fibonacci উদাহরণ একই মান বারবার আবার হিসাব করে — ছোট input-এর পরে সত্যিকারভাবে ধীর। আগের Decorators lesson থেকে @functools.lru_cache decorator প্রথমবার হিসাব হওয়ার সময় প্রতিটা ফলাফল cache করে এই নির্দিষ্ট সমস্যা ঠিক করে।</p>', 'Recursive function-এর জন্য একটা আসল optimization'),
    ],
  },
})

// ═══ 5. CONCURRENCY ═══════════════════════════════════════════════════════

lessons.push({
  slug: 'concurrency-threading-and-asyncio', sortOrder: n++,
  en: {
    title: 'Concurrency — Threading, asyncio, and the GIL',
    metaTitle: 'Python Concurrency — Threading and asyncio | Learn Computer Academy',
    metaDescription: 'Why Python\'s Global Interpreter Lock changes how concurrency works, and the two main tools — threading for I/O-bound waiting, asyncio for many concurrent tasks on one thread.',
    blocks: [
      p('<p>Doing more than one thing "at once" in Python is shaped by one specific detail most other languages don\'t have: the <b>GIL</b>.</p>'),
      h(2, 'The GIL — the Global Interpreter Lock'),
      p('<p>The GIL allows only one thread to execute Python bytecode at a time, even on a multi-core machine — a genuine limitation for CPU-heavy work split across threads, but far less of one for work that spends most of its time <i>waiting</i> (a network request, a file read), since the GIL is released during that wait.</p>'),
      h(2, 'threading — Good for I/O-Bound Waiting'),
      code('python', 'import threading\nimport time\n\ndef download(name):\n    print(f\'Starting {name}\')\n    time.sleep(2)   # stands in for a slow network request\n    print(f\'Finished {name}\')\n\nthreads = [threading.Thread(target=download, args=(f\'file{i}\',)) for i in range(3)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\n# All 3 "downloads" run concurrently — total time ~2s, not ~6s'),
      callout('warning', '<p>Because of the GIL, adding more threads does not speed up CPU-heavy computation (heavy math, image processing) — only genuinely I/O-bound waiting benefits. multiprocessing (separate processes, each with its own GIL) is the right tool for CPU-heavy parallelism, a topic beyond this lesson.</p>', 'What threading does not fix'),
      h(2, 'asyncio — Many Tasks, One Thread'),
      p('<p><code>asyncio</code> handles many waiting operations on a single thread, switching between them whenever one is waiting — no threads at all, similar in spirit to the event loop model from the JavaScript course.</p>'),
      code('python', 'import asyncio\n\nasync def download(name):\n    print(f\'Starting {name}\')\n    await asyncio.sleep(2)\n    print(f\'Finished {name}\')\n\nasync def main():\n    await asyncio.gather(\n        download(\'file1\'),\n        download(\'file2\'),\n        download(\'file3\'),\n    )\n\nasyncio.run(main())\n# Also ~2s total, no threads involved'),
      p('<p><code>async def</code> marks a function as a <b>coroutine</b> — it can be paused at an <code>await</code> and resumed later, without blocking anything else. <code>asyncio.gather()</code> runs several coroutines concurrently and waits for all of them.</p>'),
      h(2, 'threading vs. asyncio'),
      table(['threading', 'asyncio'], [
        ['Works with libraries that were never written with async in mind', 'Needs libraries built for it specifically (an async database driver, aiohttp instead of requests)'],
        ['Real OS threads, some overhead per thread', 'Lighter weight — thousands of coroutines are practical, threads are not'],
        ['Simpler to reason about for a handful of concurrent tasks', 'The standard modern choice for a server handling many concurrent connections'],
      ]),
    ],
  },
  bn: {
    title: 'Concurrency — Threading, asyncio, ও GIL',
    metaTitle: 'Python Concurrency — Threading ও asyncio | Learn Computer Academy',
    metaDescription: 'কেন Python-এর Global Interpreter Lock concurrency কীভাবে কাজ করে তা বদলে দেয়, আর দুটো প্রধান tool — I/O-bound অপেক্ষার জন্য threading, একটা thread-এ অনেক concurrent task-এর জন্য asyncio।',
    blocks: [
      p('<p>Python-এ একসাথে একটার বেশি কাজ করা বেশিরভাগ অন্য ভাষায় নেই এমন একটা নির্দিষ্ট detail দিয়ে আকৃতি পায়: <b>GIL</b>।</p>'),
      h(2, 'GIL — Global Interpreter Lock'),
      p('<p>GIL একবারে শুধু একটা thread-কে Python bytecode execute করতে দেয়, একটা multi-core machine-এও — thread জুড়ে ভাগ করা CPU-ভারী কাজের জন্য একটা আসল সীমাবদ্ধতা, কিন্তু বেশিরভাগ সময় <i>অপেক্ষা</i> করা (একটা network request, একটা file read) কাজের জন্য অনেক কম, কারণ সেই অপেক্ষার সময় GIL ছেড়ে দেওয়া হয়।</p>'),
      h(2, 'threading — I/O-Bound অপেক্ষার জন্য ভালো', 'threading-io-bound-অপেক্ষার-জন্য-ভালো'),
      code('python', 'import threading\nimport time\n\ndef download(name):\n    print(f\'Starting {name}\')\n    time.sleep(2)   # একটা ধীর network request-এর জায়গায়\n    print(f\'Finished {name}\')\n\nthreads = [threading.Thread(target=download, args=(f\'file{i}\',)) for i in range(3)]\nfor t in threads:\n    t.start()\nfor t in threads:\n    t.join()\n# তিনটা "download"-ই একসাথে চলে — মোট সময় ~2s, ~6s না'),
      callout('warning', '<p>GIL-এর কারণে, বেশি thread যোগ করা CPU-ভারী computation (ভারী math, image processing) দ্রুত করে না — শুধু সত্যিকারভাবে I/O-bound অপেক্ষা উপকৃত হয়। multiprocessing (আলাদা process, প্রতিটার নিজের GIL) CPU-ভারী parallelism-এর জন্য সঠিক tool, এই lesson-এর বাইরের একটা topic।</p>', 'threading যা ঠিক করে না'),
      h(2, 'asyncio — অনেক Task, একটা Thread', 'asyncio-অনেক-task-একটা-thread'),
      p('<p><code>asyncio</code> একটা একক thread-এ অনেক অপেক্ষার operation handle করে, একটা অপেক্ষা করার সময় এগুলোর মধ্যে switch করে — একদম কোনো thread ছাড়াই, JavaScript কোর্স থেকে event loop model-এর মতো ভাবনায়।</p>'),
      code('python', 'import asyncio\n\nasync def download(name):\n    print(f\'Starting {name}\')\n    await asyncio.sleep(2)\n    print(f\'Finished {name}\')\n\nasync def main():\n    await asyncio.gather(\n        download(\'file1\'),\n        download(\'file2\'),\n        download(\'file3\'),\n    )\n\nasyncio.run(main())\n# এটাও মোট ~2s, কোনো thread জড়িত না'),
      p('<p><code>async def</code> একটা function-কে একটা <b>coroutine</b> হিসেবে চিহ্নিত করে — এটা একটা <code>await</code>-এ থামানো যায় আর পরে resume করা যায়, অন্য কিছু block না করে। <code>asyncio.gather()</code> বেশ কয়েকটা coroutine একসাথে চালায় আর সবগুলোর জন্য অপেক্ষা করে।</p>'),
      h(2, 'threading বনাম asyncio', 'threading-বনাম-asyncio'),
      table(['threading', 'asyncio'], [
        ['async মাথায় রেখে কখনো লেখা হয়নি এমন library-র সাথে কাজ করে', 'specifically এর জন্য বানানো library দরকার (একটা async database driver, requests-এর বদলে aiohttp)'],
        ['আসল OS thread, প্রতি thread-এ কিছু overhead', 'হালকা — হাজার হাজার coroutine practical, thread না'],
        ['হাতেগোনা কয়েকটা concurrent task-এর জন্য reason করা সহজ', 'অনেক concurrent connection handle করা একটা server-এর জন্য standard modern পছন্দ'],
      ]),
    ],
  },
})

// ═══ 6. TESTING WITH UNITTEST ═════════════════════════════════════════════

lessons.push({
  slug: 'testing-with-unittest', sortOrder: n++,
  en: {
    title: 'Testing Python Code with unittest',
    metaTitle: 'Testing Python with unittest | Learn Computer Academy',
    metaDescription: "Writing automated tests with Python's own built-in unittest module — no extra package required — plus assert statements and test discovery.",
    blocks: [
      p('<p>Python ships its own testing framework built in — <code>unittest</code> — so a first real test needs no extra package at all. (pytest, mentioned in this site\'s Where to Go Next lesson, is a popular third-party alternative with a lighter syntax, worth exploring once the underlying ideas are comfortable.)</p>'),
      h(2, 'A First Test'),
      code('python', '# test_math.py\nimport unittest\n\ndef add(a, b):\n    return a + b\n\nclass TestAdd(unittest.TestCase):\n    def test_sums_two_numbers(self):\n        self.assertEqual(add(2, 3), 5)\n\nif __name__ == \'__main__\':\n    unittest.main()'),
      code('bash', 'python -m unittest test_math.py\n# .\n# ----------------------------------------------------------------------\n# Ran 1 test in 0.000s\n# OK'),
      h(2, 'The Common Assertion Methods'),
      table(['Method', 'Checks'], [
        ['assertEqual(a, b)', 'a == b'],
        ['assertNotEqual(a, b)', 'a != b'],
        ['assertTrue(x)', 'x is truthy'],
        ['assertIsNone(x)', 'x is None'],
        ['assertRaises(ExceptionType)', 'A block of code raises the given exception'],
        ['assertIn(item, container)', 'item is found inside container'],
      ]),
      h(2, 'Testing That an Exception Is Raised'),
      code('python', 'def divide(a, b):\n    if b == 0:\n        raise ValueError(\'Cannot divide by zero\')\n    return a / b\n\nclass TestDivide(unittest.TestCase):\n    def test_raises_on_zero(self):\n        with self.assertRaises(ValueError):\n            divide(10, 0)'),
      h(2, 'setUp and tearDown'),
      p('<p>Run automatically before and after every test method in a class — useful for repeated preparation, like creating a fresh object each time.</p>'),
      code('python', 'class TestShoppingCart(unittest.TestCase):\n    def setUp(self):\n        self.cart = ShoppingCart()   # a fresh cart before every test\n\n    def test_starts_empty(self):\n        self.assertEqual(len(self.cart.items), 0)\n\n    def test_add_item(self):\n        self.cart.add(\'apple\')\n        self.assertIn(\'apple\', self.cart.items)'),
      h(2, 'Running Every Test in a Project'),
      code('bash', 'python -m unittest discover\n# Finds and runs every file matching test_*.py automatically'),
      callout('tip', '<p>A test suite that only exercises the "happy path" (valid input, expected success) misses most real bugs — deliberately write at least one test for bad input, an edge case (an empty list, a zero), or an expected exception.</p>', 'Test the failure cases too'),
    ],
  },
  bn: {
    title: 'unittest দিয়ে Python কোড Test করা',
    metaTitle: 'unittest দিয়ে Python Test করা | Learn Computer Academy',
    metaDescription: 'Python-এর নিজের built-in unittest module দিয়ে automated test লেখা — কোনো অতিরিক্ত package ছাড়াই — সাথে assert statement আর test discovery।',
    blocks: [
      p('<p>Python নিজের testing framework built in নিয়ে আসে — <code>unittest</code> — তাই একটা প্রথম আসল test-এর জন্য কোনো অতিরিক্ত package লাগে না। (এই সাইটের Where to Go Next lesson-এ উল্লেখ করা pytest একটা জনপ্রিয় third-party বিকল্প হালকা সিনট্যাক্স সহ, underlying ধারণা স্বাচ্ছন্দ্য হয়ে গেলে explore করার যোগ্য।)</p>'),
      h(2, 'একটা প্রথম Test', 'একটা-প্রথম-test'),
      code('python', '# test_math.py\nimport unittest\n\ndef add(a, b):\n    return a + b\n\nclass TestAdd(unittest.TestCase):\n    def test_sums_two_numbers(self):\n        self.assertEqual(add(2, 3), 5)\n\nif __name__ == \'__main__\':\n    unittest.main()'),
      code('bash', 'python -m unittest test_math.py\n# .\n# ----------------------------------------------------------------------\n# Ran 1 test in 0.000s\n# OK'),
      h(2, 'সাধারণ Assertion Method', 'সাধারণ-assertion-method'),
      table(['Method', 'Check করে'], [
        ['assertEqual(a, b)', 'a == b'],
        ['assertNotEqual(a, b)', 'a != b'],
        ['assertTrue(x)', 'x truthy'],
        ['assertIsNone(x)', 'x None'],
        ['assertRaises(ExceptionType)', 'কোডের একটা block দেওয়া exception raise করে'],
        ['assertIn(item, container)', 'item container-এর ভেতরে পাওয়া যায়'],
      ]),
      h(2, 'একটা Exception Raise হওয়া Test করা', 'একটা-exception-raise-হওয়া-test-করা'),
      code('python', 'def divide(a, b):\n    if b == 0:\n        raise ValueError(\'Cannot divide by zero\')\n    return a / b\n\nclass TestDivide(unittest.TestCase):\n    def test_raises_on_zero(self):\n        with self.assertRaises(ValueError):\n            divide(10, 0)'),
      h(2, 'setUp ও tearDown'),
      p('<p>একটা ক্লাসের প্রতিটা test method-এর আগে আর পরে স্বয়ংক্রিয়ভাবে চলে — বারবার প্রস্তুতির জন্য useful, যেমন প্রতিবার একটা নতুন object তৈরি করা।</p>'),
      code('python', 'class TestShoppingCart(unittest.TestCase):\n    def setUp(self):\n        self.cart = ShoppingCart()   # প্রতিটা test-এর আগে একটা নতুন cart\n\n    def test_starts_empty(self):\n        self.assertEqual(len(self.cart.items), 0)\n\n    def test_add_item(self):\n        self.cart.add(\'apple\')\n        self.assertIn(\'apple\', self.cart.items)'),
      h(2, 'একটা Project-এর প্রতিটা Test চালানো', 'একটা-project-এর-প্রতিটা-test-চালানো'),
      code('bash', 'python -m unittest discover\n# test_*.py-তে মেলা প্রতিটা file স্বয়ংক্রিয়ভাবে খুঁজে চালায়'),
      callout('tip', '<p>একটা test suite যা শুধু "happy path" (বৈধ input, প্রত্যাশিত success) ব্যায়াম করে বেশিরভাগ আসল bug মিস করে — খারাপ input, একটা edge case (একটা খালি list, একটা zero), বা একটা প্রত্যাশিত exception-এর জন্য ইচ্ছাকৃতভাবে অন্তত একটা test লিখুন।</p>', 'Failure case-ও test করুন'),
    ],
  },
})

// ═══ 7. WORKING WITH JSON ═════════════════════════════════════════════════

lessons.push({
  slug: 'working-with-json', sortOrder: n++,
  en: {
    title: 'Working with JSON',
    metaTitle: 'Python JSON Handling | Learn Computer Academy',
    metaDescription: 'Converting a Python dict or list to JSON and back with the built-in json module — the standard format for a config file or an API response.',
    blocks: [
      p('<p>JSON is the standard format for exchanging data — an API response, a config file, data saved between program runs. Python\'s built-in <code>json</code> module handles converting between it and Python\'s own dicts and lists.</p>'),
      h(2, 'Python to JSON — json.dumps()'),
      code('python', 'import json\n\nuser = {\'name\': \'Sam\', \'age\': 28, \'active\': True}\njson_string = json.dumps(user)\nprint(json_string)\n# {"name": "Sam", "age": 28, "active": true}'),
      h(2, 'Pretty-Printing for Readability'),
      code('python', 'print(json.dumps(user, indent=2))'),
      h(2, 'JSON to Python — json.loads()'),
      code('python', 'json_string = \'{"name": "Sam", "age": 28}\'\nuser = json.loads(json_string)\nprint(user[\'name\'])   # Sam — a regular Python dict now'),
      h(2, 'Reading and Writing JSON Files'),
      code('python', '# Writing\nwith open(\'user.json\', \'w\') as f:\n    json.dump(user, f, indent=2)\n\n# Reading\nwith open(\'user.json\') as f:\n    user = json.load(f)'),
      p('<p><code>dump()</code>/<code>load()</code> (no "s") work directly with an open file; <code>dumps()</code>/<code>loads()</code> (with an "s", for "string") work with a Python string already in memory.</p>'),
      h(2, 'Python Types vs. JSON Types'),
      table(['Python', 'JSON'], [
        ['dict', 'object'],
        ['list, tuple', 'array'],
        ['str', 'string'],
        ['int, float', 'number'],
        ['True / False', 'true / false'],
        ['None', 'null'],
      ]),
      h(2, 'Handling Invalid JSON'),
      code('python', 'try:\n    data = json.loads(\'{invalid json}\')\nexcept json.JSONDecodeError as e:\n    print(f\'Invalid JSON: {e}\')'),
      callout('warning', '<p>A tuple converts to a JSON array and comes back as a Python list, not a tuple — JSON has no tuple type of its own, so that distinction is lost in the round trip.</p>', 'A one-way conversion for tuples'),
    ],
  },
  bn: {
    title: 'JSON নিয়ে কাজ করা',
    metaTitle: 'Python JSON Handling | Learn Computer Academy',
    metaDescription: 'built-in json module দিয়ে একটা Python dict বা list-কে JSON-এ আর ফিরিয়ে রূপান্তর করা — একটা config file বা একটা API response-এর standard format।',
    blocks: [
      p('<p>Data আদান-প্রদানের standard format JSON — একটা API response, একটা config file, program run-এর মধ্যে সংরক্ষণ করা data। Python-এর built-in <code>json</code> module এটা আর Python-এর নিজের dict আর list-এর মধ্যে রূপান্তর handle করে।</p>'),
      h(2, 'Python থেকে JSON — json.dumps()', 'python-থেকে-json-jsondumps'),
      code('python', 'import json\n\nuser = {\'name\': \'Sam\', \'age\': 28, \'active\': True}\njson_string = json.dumps(user)\nprint(json_string)\n# {"name": "Sam", "age": 28, "active": true}'),
      h(2, 'Readability-র জন্য Pretty-Printing', 'readability-র-জন্য-pretty-printing'),
      code('python', 'print(json.dumps(user, indent=2))'),
      h(2, 'JSON থেকে Python — json.loads()', 'json-থেকে-python-jsonloads'),
      code('python', 'json_string = \'{"name": "Sam", "age": 28}\'\nuser = json.loads(json_string)\nprint(user[\'name\'])   # Sam — এখন একটা সাধারণ Python dict'),
      h(2, 'JSON File পড়া ও লেখা', 'json-file-পড়া-ও-লেখা'),
      code('python', '# লেখা\nwith open(\'user.json\', \'w\') as f:\n    json.dump(user, f, indent=2)\n\n# পড়া\nwith open(\'user.json\') as f:\n    user = json.load(f)'),
      p('<p><code>dump()</code>/<code>load()</code> ("s" ছাড়া) সরাসরি একটা খোলা file নিয়ে কাজ করে; <code>dumps()</code>/<code>loads()</code> ("s" সহ, "string"-এর জন্য) memory-তে ইতিমধ্যে থাকা একটা Python string নিয়ে কাজ করে।</p>'),
      h(2, 'Python Type বনাম JSON Type', 'python-type-বনাম-json-type'),
      table(['Python', 'JSON'], [
        ['dict', 'object'],
        ['list, tuple', 'array'],
        ['str', 'string'],
        ['int, float', 'number'],
        ['True / False', 'true / false'],
        ['None', 'null'],
      ]),
      h(2, 'অবৈধ JSON Handle করা', 'অবৈধ-json-handle-করা'),
      code('python', 'try:\n    data = json.loads(\'{invalid json}\')\nexcept json.JSONDecodeError as e:\n    print(f\'Invalid JSON: {e}\')'),
      callout('warning', '<p>একটা tuple একটা JSON array-তে রূপান্তরিত হয় আর একটা Python list হিসেবে ফিরে আসে, একটা tuple না — JSON-এর নিজের কোনো tuple type নেই, তাই round trip-এ সেই পার্থক্য হারিয়ে যায়।</p>', 'Tuple-এর জন্য একটা one-way রূপান্তর'),
    ],
  },
})

// ═══ 8. VIRTUAL ENVIRONMENTS ═══════════════════════════════════════════════

lessons.push({
  slug: 'virtual-environments', sortOrder: n++,
  en: {
    title: 'Virtual Environments',
    metaTitle: 'Python Virtual Environments | Learn Computer Academy',
    metaDescription: 'Keeping each project\'s installed packages isolated from every other project\'s, using Python\'s own built-in venv module.',
    blocks: [
      p('<p>Installing a package with <code>pip</code> (from the earlier Modules and Imports lesson) normally installs it globally — shared across every Python project on the machine. A <b>virtual environment</b> gives one project its own isolated set of installed packages instead.</p>'),
      h(2, 'Why This Actually Matters'),
      p('<p>Project A needs version 1 of a library; Project B needs version 2 — installed globally, only one can be satisfied at a time. A virtual environment per project makes this a non-issue.</p>'),
      h(2, 'Creating One — venv'),
      p('<p><code>venv</code> is built into Python — no separate install needed.</p>'),
      code('bash', 'python -m venv venv\n# Creates a "venv" folder holding an isolated Python installation'),
      h(2, 'Activating It'),
      code('bash', '# macOS / Linux\nsource venv/bin/activate\n\n# Windows\nvenv\\Scripts\\activate\n\n# The terminal prompt changes to show it\'s active, e.g.:\n(venv) $'),
      p('<p>Once active, <code>pip install</code> only affects this environment — not the system-wide Python or any other project\'s environment.</p>'),
      code('bash', '(venv) $ pip install requests\n# Installed only inside this project\'s venv folder'),
      h(2, 'Deactivating'),
      code('bash', '(venv) $ deactivate'),
      h(2, 'Recording and Reinstalling Dependencies'),
      p('<p>A <code>requirements.txt</code> file lists exactly what a project needs, so a teammate — or a deployment server — can recreate the same environment.</p>'),
      code('bash', '# Save the current environment\'s packages to a file\npip freeze > requirements.txt\n\n# On another machine, recreate it\npython -m venv venv\nsource venv/bin/activate\npip install -r requirements.txt'),
      table(['Command', 'What it does'], [
        ['python -m venv venv', 'Creates a new virtual environment'],
        ['source venv/bin/activate (or venv\\Scripts\\activate on Windows)', 'Activates it for the current terminal session'],
        ['deactivate', 'Returns to the system-wide Python'],
        ['pip freeze > requirements.txt', 'Records exactly what\'s installed'],
        ['pip install -r requirements.txt', 'Reinstalls everything a requirements.txt lists'],
      ]),
      callout('warning', '<p>The venv folder itself should never be committed to version control — it\'s regenerated from requirements.txt on any machine. Add it to .gitignore from the start of a project.</p>', 'What not to commit'),
    ],
  },
  bn: {
    title: 'Virtual Environment',
    metaTitle: 'Python Virtual Environment | Learn Computer Academy',
    metaDescription: 'Python-এর নিজের built-in venv module ব্যবহার করে প্রতিটা project-এর installed package বাকি প্রতিটা project থেকে আলাদা রাখা।',
    blocks: [
      p('<p>(আগের Modules and Imports lesson থেকে) <code>pip</code> দিয়ে একটা package install করলে সাধারণত এটা globally install হয় — machine-এর প্রতিটা Python project জুড়ে শেয়ার করা। একটা <b>virtual environment</b> এর বদলে একটা project-কে installed package-এর নিজের আলাদা set দেয়।</p>'),
      h(2, 'এটা আসলে কেন গুরুত্বপূর্ণ', 'এটা-আসলে-কেন-গুরুত্বপূর্ণ'),
      p('<p>Project A-এর একটা library-র version 1 দরকার; Project B-এর version 2 দরকার — globally install করলে, একটা সময়ে শুধু একটা সন্তুষ্ট করা যায়। প্রতি project-এ একটা virtual environment এটাকে একটা সমস্যাই না বানায়।</p>'),
      h(2, 'একটা তৈরি করা — venv', 'একটা-তৈরি-করা-venv'),
      p('<p><code>venv</code> Python-এই built in — আলাদা install দরকার নেই।</p>'),
      code('bash', 'python -m venv venv\n# একটা isolated Python installation ধরে রাখা "venv" folder তৈরি করে'),
      h(2, 'এটা Activate করা', 'এটা-activate-করা'),
      code('bash', '# macOS / Linux\nsource venv/bin/activate\n\n# Windows\nvenv\\Scripts\\activate\n\n# terminal prompt এটা active তা দেখাতে বদলায়, যেমন:\n(venv) $'),
      p('<p>একবার active হলে, <code>pip install</code> শুধু এই environment-কে প্রভাবিত করে — system-wide Python বা অন্য কোনো project-এর environment-কে না।</p>'),
      code('bash', '(venv) $ pip install requests\n# শুধু এই project-এর venv folder-এর ভেতরে install হয়'),
      h(2, 'Deactivate করা', 'deactivate-করা'),
      code('bash', '(venv) $ deactivate'),
      h(2, 'Dependency রেকর্ড ও পুনরায় Install করা', 'dependency-রেকর্ড-ও-পুনরায়-install-করা'),
      p('<p>একটা <code>requirements.txt</code> file ঠিক একটা project-এর কী দরকার তা list করে, যাতে একজন teammate — বা একটা deployment server — একই environment আবার তৈরি করতে পারে।</p>'),
      code('bash', '# বর্তমান environment-এর package একটা file-এ save করুন\npip freeze > requirements.txt\n\n# অন্য একটা machine-এ, এটা আবার তৈরি করুন\npython -m venv venv\nsource venv/bin/activate\npip install -r requirements.txt'),
      table(['Command', 'কী করে'], [
        ['python -m venv venv', 'একটা নতুন virtual environment তৈরি করে'],
        ['source venv/bin/activate (বা Windows-এ venv\\Scripts\\activate)', 'বর্তমান terminal session-এর জন্য এটা activate করে'],
        ['deactivate', 'system-wide Python-এ ফিরে যায়'],
        ['pip freeze > requirements.txt', 'ঠিক কী install আছে তা রেকর্ড করে'],
        ['pip install -r requirements.txt', 'একটা requirements.txt-এ যা list আছে সবকিছু আবার install করে'],
      ]),
      callout('warning', '<p>venv folder নিজেই কখনো version control-এ commit করা উচিত না — যেকোনো machine-এ এটা requirements.txt থেকে regenerate হয়। একটা project-এর একদম শুরু থেকে এটা .gitignore-এ যোগ করুন।</p>', 'কী commit করবেন না'),
    ],
  },
})

// ═══ 9. TYPE HINTS DEEPER ══════════════════════════════════════════════════

lessons.push({
  slug: 'type-hints-in-depth', sortOrder: n++,
  en: {
    title: 'Type Hints in Depth',
    metaTitle: 'Python Type Hints | Learn Computer Academy',
    metaDescription: 'Beyond a basic -> int — typing a list, an optional value, several possible types, and checking it all with mypy.',
    blocks: [
      p('<p>The earlier Functions lesson used a basic type hint like <code>-&gt; int</code>. This lesson covers the fuller typing system — Python never enforces these at runtime on its own, but they document intent and let a separate tool catch real mistakes before the code even runs.</p>'),
      h(2, 'Basic Type Hints, Reviewed'),
      code('python', 'def greet(name: str) -> str:\n    return f\'Hello, {name}!\'\n\nage: int = 28\nprice: float = 19.99\nis_active: bool = True'),
      h(2, 'Typing a Collection'),
      code('python', 'names: list[str] = [\'Sam\', \'Alex\']\nscores: dict[str, int] = {\'Sam\': 90, \'Alex\': 85}\ncoordinates: tuple[float, float] = (12.5, 45.2)'),
      h(2, 'Optional — a Value That Might Be None'),
      code('python', 'from typing import Optional\n\ndef find_user(user_id: int) -> Optional[str]:\n    # Returns a username, or None if not found\n    ...\n\n# Python 3.10+ shorthand, no import needed:\ndef find_user(user_id: int) -> str | None:\n    ...'),
      h(2, 'Union — More Than One Possible Type'),
      code('python', 'def process(value: int | str) -> str:\n    return str(value)'),
      h(2, 'Typing a Function Passed as an Argument'),
      code('python', 'from typing import Callable\n\ndef apply(func: Callable[[int], int], value: int) -> int:\n    return func(value)'),
      h(2, 'Checking Types with mypy'),
      p('<p>Python itself never checks these hints while running — <code>mypy</code>, run separately, catches a mismatch before the code even executes.</p>'),
      code('bash', 'pip install mypy\nmypy my_script.py\n# my_script.py:5: error: Argument 1 to "greet" has incompatible type "int"; expected "str"'),
      table(['Hint', 'Means'], [
        ['list[str]', 'A list containing only strings'],
        ['dict[str, int]', 'A dict with string keys and integer values'],
        ['Optional[str] / str | None', 'A string, or None'],
        ['int | str', 'Either an int or a string'],
        ['Callable[[int], int]', 'A function taking an int and returning an int'],
      ]),
      callout('note', '<p>Type hints are optional documentation, not enforcement — running the code with a "wrong" type still works fine unless something like mypy is run separately to check. Their value is catching a real class of bugs before runtime, and making a function\'s expected inputs obvious to anyone reading it.</p>', 'What Python itself actually does with these'),
    ],
  },
  bn: {
    title: 'Type Hint বিস্তারিত',
    metaTitle: 'Python Type Hint | Learn Computer Academy',
    metaDescription: 'একটা মৌলিক -> int-এর বাইরে — একটা list, একটা optional মান, বেশ কয়েকটা সম্ভাব্য type type করা, আর mypy দিয়ে সবকিছু check করা।',
    blocks: [
      p('<p>আগের Function lesson <code>-&gt; int</code>-এর মতো একটা মৌলিক type hint ব্যবহার করেছিল। এই lesson পূর্ণ typing system কভার করে — Python নিজে থেকে কখনো runtime-এ এগুলো enforce করে না, কিন্তু এগুলো উদ্দেশ্য document করে আর কোড আসলে চলার আগেই একটা আলাদা tool-কে আসল ভুল ধরতে দেয়।</p>'),
      h(2, 'মৌলিক Type Hint, আবার দেখা', 'মৌলিক-type-hint-আবার-দেখা'),
      code('python', 'def greet(name: str) -> str:\n    return f\'Hello, {name}!\'\n\nage: int = 28\nprice: float = 19.99\nis_active: bool = True'),
      h(2, 'একটা Collection Type করা', 'একটা-collection-type-করা'),
      code('python', 'names: list[str] = [\'Sam\', \'Alex\']\nscores: dict[str, int] = {\'Sam\': 90, \'Alex\': 85}\ncoordinates: tuple[float, float] = (12.5, 45.2)'),
      h(2, 'Optional — None হতে পারে এমন একটা মান', 'optional-none-হতে-পারে-এমন-একটা-মান'),
      code('python', 'from typing import Optional\n\ndef find_user(user_id: int) -> Optional[str]:\n    # একটা username return করে, বা না পাওয়া গেলে None\n    ...\n\n# Python 3.10+ shorthand, কোনো import দরকার নেই:\ndef find_user(user_id: int) -> str | None:\n    ...'),
      h(2, 'Union — একাধিক সম্ভাব্য Type', 'union-একাধিক-সম্ভাব্য-type'),
      code('python', 'def process(value: int | str) -> str:\n    return str(value)'),
      h(2, 'একটা Argument হিসেবে পাঠানো Function Type করা', 'একটা-argument-হিসেবে-পাঠানো-function-type-করা'),
      code('python', 'from typing import Callable\n\ndef apply(func: Callable[[int], int], value: int) -> int:\n    return func(value)'),
      h(2, 'mypy দিয়ে Type Check করা', 'mypy-দিয়ে-type-check-করা'),
      p('<p>Python নিজে চলার সময় কখনো এই hint-গুলো check করে না — আলাদাভাবে চালানো <code>mypy</code>, কোড আসলে চলার আগেই একটা mismatch ধরে।</p>'),
      code('bash', 'pip install mypy\nmypy my_script.py\n# my_script.py:5: error: Argument 1 to "greet" has incompatible type "int"; expected "str"'),
      table(['Hint', 'মানে'], [
        ['list[str]', 'শুধু string ধারণ করা একটা list'],
        ['dict[str, int]', 'string key আর integer value সহ একটা dict'],
        ['Optional[str] / str | None', 'একটা string, বা None'],
        ['int | str', 'হয় একটা int বা একটা string'],
        ['Callable[[int], int]', 'একটা int নেওয়া আর একটা int return করা একটা function'],
      ]),
      callout('note', '<p>Type hint optional documentation, enforcement না — একটা "ভুল" type দিয়ে কোড চালানো এখনো ঠিকঠাক কাজ করে যতক্ষণ না mypy-র মতো কিছু আলাদাভাবে check করার জন্য চালানো হয়। এগুলোর value runtime-এর আগে বাস্তব একটা category-র bug ধরা, আর যে কেউ এটা পড়ছে তার কাছে একটা function-এর প্রত্যাশিত input স্পষ্ট করা।</p>', 'Python নিজে আসলে এগুলো দিয়ে কী করে'),
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
  console.log(`${lessons.length} lesson(s) to write, plus bumping where-to-go-next and practice-projects\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] python/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] python/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('  python/where-to-go-next -> sort_order 37')
    console.log('  python/practice-projects -> sort_order 38')
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

  const { error: bump1 } = await supabase.from('docs').update({ sort_order: 37 }).eq('category_id', category.id).eq('slug', 'where-to-go-next')
  if (bump1) console.error('Failed to bump where-to-go-next:', bump1.message)
  else console.log('  ✓ python/where-to-go-next -> sort_order 37')

  const { error: bump2 } = await supabase.from('docs').update({ sort_order: 38 }).eq('category_id', category.id).eq('slug', 'practice-projects')
  if (bump2) console.error('Failed to bump practice-projects:', bump2.message)
  else console.log('  ✓ python/practice-projects -> sort_order 38')

  console.log(`\n✅ Done. ${lessons.length} lessons written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
