#!/usr/bin/env node
// Extends the existing "PHP" category (29 lessons) with 12 more lessons
// covering real gaps found against a roadmap.sh "PHP" roadmap PDF the user
// shared 2026-09-03 — asked "are everything in this document regarding php
// covered". That PDF is really a full Backend Development roadmap for
// PHP — roughly half of it (Laravel/Symfony, PHPUnit/Pest, PHPStan/Psalm,
// Xdebug, ORM, connection pooling, migrations, MySQLi, PHP-FPM, opcode
// caching, PSR-FIG) is tooling/ops scope the PDF's own layout treats as
// separate advanced tracks — out of scope here, matching the boundary
// already used for the ui-ux/html/css gap batches this session.
//
// Verified real gaps by content (not keyword mentions) before building —
// e.g. php/mysql-querying mentions "prepared statement" as a technique but
// never frames it as SQL-injection prevention; no lesson anywhere covers
// password_hash/password_verify, XSS, or CSRF at all.
//
// User picked "build all 12" over AskUserQuestion, security named as the
// most important single gap — a PHP course that never covers SQL
// injection, XSS, CSRF, or password hashing is a real problem, not a
// nice-to-have, so php-security-basics gets real depth, not a token
// mention.
//
// Style: matches this category's own modern house style (php/oop-*
// lessons — moderate prose, code examples, callouts) since PHP was never
// part of the original Jekyll site — this is extending 2026-07-era
// newly-authored content, not old migrated content (unlike the html/css
// gap batches). Bengali matches this category's script-transliteration
// convention, verified against php/oop-inheritance bn.
//
// sort_order continues from 30 (existing max is 29).
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-php-gap-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Block builders (same shape as every other content script) ───────────

function h(level, text, anchor) {
  const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor: a }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function code(language, source) { return { id: nanoid(12), type: 'code', language, code: source, runnable: false } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// ── Lessons ──────────────────────────────────────────────────────────────

const lessons = []
let n = 30

// ═══ 1. MATCH & NULL-SAFE OPERATOR ════════════════════════════════════════

lessons.push({
  slug: 'match-expression-and-null-safe-operator', sortOrder: n++,
  en: {
    title: 'Match Expression and the Null-Safe Operator',
    metaTitle: 'PHP Match Expression and Null-Safe Operator | Learn Computer Academy',
    metaDescription: "PHP 8's match expression — a stricter, more concise alternative to switch — and the null-safe operator for chaining property or method access safely.",
    blocks: [
      p('<p>PHP 8 added two small features that clean up two very common patterns: choosing between several values, and safely reading a property that might not exist.</p>'),
      h(2, 'match — A Stricter switch'),
      p('<p><code>match</code> compares with strict equality (<code>===</code>, no type juggling), never falls through to the next case, and returns a value directly instead of needing <code>break</code> in every branch.</p>'),
      code('php', '$statusText = match ($statusCode) {\n    200, 201 => \'Success\',\n    404 => \'Not Found\',\n    500 => \'Server Error\',\n    default => \'Unknown Status\',\n};'),
      h(2, 'match vs. switch'),
      table(['switch', 'match'], [
        ['Loose comparison (==)', 'Strict comparison (===)'],
        ['Falls through without break', 'Never falls through'],
        ['A statement — doesn\'t return a value', 'An expression — returns a value directly'],
        ['An unmatched case with no default is silently skipped', 'An unmatched case with no default throws an error'],
      ]),
      h(2, 'The Null-Safe Operator — ?->'),
      p('<p>Without it, reading a property several levels deep on something that might be <code>null</code> requires a chain of manual checks.</p>'),
      code('php', '// The old way\n$city = null;\nif ($user !== null) {\n    if ($user->address !== null) {\n        $city = $user->address->city;\n    }\n}'),
      p('<p>With <code>?-&gt;</code>, the whole expression short-circuits to <code>null</code> the moment any link in the chain is <code>null</code>, without a single manual check.</p>'),
      code('php', '// The null-safe way\n$city = $user?->address?->city;'),
      callout('note', '<p>The null-safe operator only protects against the exact chain it\'s used on — a typo in a property name still causes a normal error. It replaces null-checking, not all error handling.</p>', 'What ?-> does not do'),
    ],
  },
  bn: {
    title: 'Match Expression আর Null-Safe Operator',
    metaTitle: 'PHP Match Expression আর Null-Safe Operator | Learn Computer Academy',
    metaDescription: 'PHP 8-এর match expression — switch-এর একটি stricter, বেশি concise বিকল্প — আর সম্ভবত নেই এমন একটি property বা method নিরাপদে access করার জন্য null-safe operator।',
    blocks: [
      p('<p>PHP 8 দুটো ছোট feature যোগ করেছে যা দুটো খুব common pattern পরিষ্কার করে: বেশ কয়েকটি মানের মধ্যে বেছে নেওয়া, আর হয়তো নেই এমন একটি property নিরাপদে পড়া।</p>'),
      h(2, 'match — একটি Stricter switch', 'match-একটি-stricter-switch'),
      p('<p><code>match</code> strict equality-তে তুলনা করে (<code>===</code>, কোনো type juggling না), পরের case-এ কখনো fall through করে না, আর প্রতিটি branch-এ <code>break</code> দরকার না হয়েই সরাসরি একটি মান return করে।</p>'),
      code('php', '$statusText = match ($statusCode) {\n    200, 201 => \'Success\',\n    404 => \'Not Found\',\n    500 => \'Server Error\',\n    default => \'Unknown Status\',\n};'),
      h(2, 'switch বনাম match', 'switch-বনাম-match'),
      table(['switch', 'match'], [
        ['Loose comparison (==)', 'Strict comparison (===)'],
        ['break ছাড়া fall through করে', 'কখনো fall through করে না'],
        ['একটি statement — মান return করে না', 'একটি expression — সরাসরি মান return করে'],
        ['default ছাড়া একটি unmatched case চুপচাপ skip হয়', 'default ছাড়া একটি unmatched case একটি error throw করে'],
      ]),
      h(2, 'Null-Safe Operator — ?->', 'null-safe-operator'),
      p('<p>এটা ছাড়া, <code>null</code> হতে পারে এমন কিছুর উপর বেশ কয়েক level গভীরে একটি property পড়তে হাতে check-এর একটি chain দরকার।</p>'),
      code('php', '// পুরনো উপায়\n$city = null;\nif ($user !== null) {\n    if ($user->address !== null) {\n        $city = $user->address->city;\n    }\n}'),
      p('<p><code>?-&gt;</code> দিয়ে, chain-এর যেকোনো link <code>null</code> হওয়া মাত্র পুরো expression একটি হাতে check ছাড়াই <code>null</code>-এ short-circuit করে।</p>'),
      code('php', '// Null-safe উপায়\n$city = $user?->address?->city;'),
      callout('note', '<p>Null-safe operator শুধু এটা যে chain-এ ব্যবহৃত হয় ঠিক সেটাকেই রক্ষা করে — একটি property নামে একটি typo এখনো একটি সাধারণ error ঘটায়। এটা null-checking replace করে, সব error handling না।</p>', '?-> যা করে না'),
    ],
  },
})

// ═══ 2. ANONYMOUS FUNCTIONS, CLOSURES & CALLBACKS ═══════════════════════

lessons.push({
  slug: 'anonymous-functions-and-closures', sortOrder: n++,
  en: {
    title: 'Anonymous Functions, Closures, and Callbacks',
    metaTitle: 'PHP Anonymous Functions and Closures | Learn Computer Academy',
    metaDescription: 'Functions without a name, closures that capture outside variables, callback functions passed as arguments, recursion, and variadic parameters.',
    blocks: [
      p('<p>The earlier Functions lesson covered named functions and arrow functions. This one covers functions used as values — passed around, stored in variables, and passed into other functions.</p>'),
      h(2, 'Anonymous Functions'),
      p('<p>A function with no name, assigned directly to a variable or passed inline.</p>'),
      code('php', '$greet = function ($name) {\n    return "Hello, $name!";\n};\n\necho $greet(\'Sam\');   // Hello, Sam!'),
      h(2, 'Closures — Capturing Outside Variables with use'),
      p('<p>An anonymous function normally can\'t see variables from outside its own body — <code>use</code> explicitly imports one.</p>'),
      code('php', '$taxRate = 0.08;\n\n$addTax = function ($price) use ($taxRate) {\n    return $price * (1 + $taxRate);\n};\n\necho $addTax(100);   // 108'),
      h(2, 'Callback Functions — Passing a Function as an Argument'),
      p('<p>Several built-in PHP functions accept a function as an argument, to run once per item.</p>'),
      code('php', '$numbers = [1, 2, 3, 4, 5];\n\n$doubled = array_map(function ($n) {\n    return $n * 2;\n}, $numbers);\n// [2, 4, 6, 8, 10]\n\n$evens = array_filter($numbers, function ($n) {\n    return $n % 2 === 0;\n});\n// [2, 4]'),
      callout('tip', '<p>The arrow functions from the earlier Functions lesson (<code>fn($n) => $n * 2</code>) work as callbacks too, and automatically capture outside variables without needing <code>use</code> — often the shorter choice for a simple one-line callback.</p>', 'Arrow functions as a shortcut'),
      h(2, 'Recursion — A Function Calling Itself'),
      code('php', 'function factorial(int $n): int {\n    if ($n <= 1) {\n        return 1;\n    }\n    return $n * factorial($n - 1);\n}\n\necho factorial(5);   // 120'),
      callout('warning', '<p>Every recursive function needs a base case — a condition that stops it calling itself. Without one, it recurses until PHP runs out of memory.</p>', 'Always have a base case'),
      h(2, 'Variadic Functions — Accepting Any Number of Arguments'),
      p('<p>A parameter prefixed with <code>...</code> collects every remaining argument into an array.</p>'),
      code('php', 'function sum(...$numbers): int {\n    return array_sum($numbers);\n}\n\necho sum(1, 2, 3);        // 6\necho sum(1, 2, 3, 4, 5);  // 15'),
      h(2, 'Named Arguments'),
      p('<p>Arguments can be passed by parameter name instead of position — useful for a function with several optional parameters, so it\'s clear at the call site what each value means.</p>'),
      code('php', 'function makeUser(string $name, string $role = \'user\', bool $active = true) {\n    // ...\n}\n\nmakeUser(name: \'Sam\', active: false);\n// role keeps its default value, active is explicitly set — order doesn\'t matter'),
    ],
  },
  bn: {
    title: 'Anonymous Function, Closure, আর Callback',
    metaTitle: 'PHP Anonymous Function ও Closure | Learn Computer Academy',
    metaDescription: 'নাম ছাড়া function, বাইরের variable capture করা closure, argument হিসেবে পাঠানো callback function, recursion, আর variadic parameter।',
    blocks: [
      p('<p>আগের Function lesson নাম-ওয়ালা function আর arrow function কভার করেছে। এটা value হিসেবে ব্যবহৃত function কভার করে — ঘোরানো, variable-এ রাখা, আর অন্য function-এ পাঠানো।</p>'),
      h(2, 'Anonymous Function'),
      p('<p>কোনো নাম ছাড়া একটি function, সরাসরি একটি variable-এ assign করা বা inline পাঠানো।</p>'),
      code('php', '$greet = function ($name) {\n    return "Hello, $name!";\n};\n\necho $greet(\'Sam\');   // Hello, Sam!'),
      h(2, 'Closure — use দিয়ে বাইরের Variable Capture করা', 'closure-use-দিয়ে-বাইরের-variable-capture-করা'),
      p('<p>একটি anonymous function সাধারণত নিজের body-র বাইরের variable দেখতে পায় না — <code>use</code> স্পষ্টভাবে একটি import করে।</p>'),
      code('php', '$taxRate = 0.08;\n\n$addTax = function ($price) use ($taxRate) {\n    return $price * (1 + $taxRate);\n};\n\necho $addTax(100);   // 108'),
      h(2, 'Callback Function — একটি Argument হিসেবে Function পাঠানো', 'callback-function-একটি-argument-হিসেবে-function-পাঠানো'),
      p('<p>বেশ কয়েকটি built-in PHP function একটি function-কে argument হিসেবে accept করে, প্রতি item-এ একবার চালানোর জন্য।</p>'),
      code('php', '$numbers = [1, 2, 3, 4, 5];\n\n$doubled = array_map(function ($n) {\n    return $n * 2;\n}, $numbers);\n// [2, 4, 6, 8, 10]\n\n$evens = array_filter($numbers, function ($n) {\n    return $n % 2 === 0;\n});\n// [2, 4]'),
      callout('tip', '<p>আগের Function lesson থেকে arrow function (<code>fn($n) => $n * 2</code>) callback হিসেবেও কাজ করে, আর <code>use</code> ছাড়াই স্বয়ংক্রিয়ভাবে বাইরের variable capture করে — একটি সহজ one-line callback-এর জন্য প্রায়ই ছোট পছন্দ।</p>', 'শর্টকাট হিসেবে Arrow function'),
      h(2, 'Recursion — নিজেকে Call করা একটি Function', 'recursion-নিজেকে-call-করা-একটি-function'),
      code('php', 'function factorial(int $n): int {\n    if ($n <= 1) {\n        return 1;\n    }\n    return $n * factorial($n - 1);\n}\n\necho factorial(5);   // 120'),
      callout('warning', '<p>প্রতিটি recursive function-এর একটি base case দরকার — নিজেকে call করা বন্ধ করে এমন একটি শর্ত। এটা ছাড়া, PHP-র memory শেষ না হওয়া পর্যন্ত এটা recurse করতে থাকে।</p>', 'সবসময় একটি base case রাখুন'),
      h(2, 'Variadic Function — যেকোনো সংখ্যক Argument Accept করা', 'variadic-function-যেকোনো-সংখ্যক-argument-accept-করা'),
      p('<p><code>...</code> দিয়ে prefix করা একটি parameter বাকি প্রতিটি argument একটি array-তে সংগ্রহ করে।</p>'),
      code('php', 'function sum(...$numbers): int {\n    return array_sum($numbers);\n}\n\necho sum(1, 2, 3);        // 6\necho sum(1, 2, 3, 4, 5);  // 15'),
      h(2, 'Named Argument'),
      p('<p>Position-এর বদলে argument parameter নাম দিয়ে পাঠানো যায় — বেশ কয়েকটি optional parameter সহ একটি function-এর জন্য useful, যাতে call site-এ প্রতিটি মান কী বোঝায় তা স্পষ্ট থাকে।</p>'),
      code('php', 'function makeUser(string $name, string $role = \'user\', bool $active = true) {\n    // ...\n}\n\nmakeUser(name: \'Sam\', active: false);\n// role এর default মান রাখে, active স্পষ্টভাবে সেট করা — ক্রম গুরুত্বপূর্ণ না'),
    ],
  },
})

// ═══ 3. PHP SECURITY BASICS ═══════════════════════════════════════════════

lessons.push({
  slug: 'php-security-basics', sortOrder: n++,
  en: {
    title: 'PHP Security Basics — SQL Injection, XSS, CSRF & Password Hashing',
    metaTitle: 'PHP Security Basics | Learn Computer Academy',
    metaDescription: "The four security issues every PHP developer runs into eventually — SQL injection, cross-site scripting, CSRF, and how to store passwords safely — and how to actually prevent each one.",
    blocks: [
      p('<p>PHP scripts commonly handle user input, a database, and a login system — which means they\'re also commonly the target of a handful of well-understood attacks. Each one has a specific, practical defense.</p>'),
      h(2, 'SQL Injection'),
      p('<p>Building a query by directly inserting user input into the SQL string lets an attacker inject their own SQL — the earlier MySQL lessons\' use of PDO <b>prepared statements</b> is exactly what prevents this, and it\'s worth understanding why.</p>'),
      code('php', '// VULNERABLE — never do this\n$username = $_GET[\'username\'];\n$sql = "SELECT * FROM users WHERE username = \'$username\'";\n// An attacker submitting: \' OR \'1\'=\'1\n// turns this into a query that matches every row'),
      code('php', '// SAFE — a prepared statement\n$stmt = $pdo->prepare(\'SELECT * FROM users WHERE username = ?\');\n$stmt->execute([$_GET[\'username\']]);\n// The input is sent separately from the SQL — it can never be\n// interpreted as part of the query itself, no matter what it contains'),
      callout('danger', '<p>String-concatenating any user input directly into a SQL query is the single most common serious PHP security bug. A prepared statement isn\'t an optional improvement — treat it as mandatory for every query that includes user input.</p>', 'The one rule that matters most here'),
      h(2, 'Cross-Site Scripting (XSS)'),
      p('<p>If user input is echoed back into a page without escaping it, an attacker can submit HTML or JavaScript that runs in another visitor\'s browser — stealing their session, or acting on their behalf.</p>'),
      code('php', '// VULNERABLE\necho "Welcome, " . $_GET[\'name\'];\n// A name of <script>stealCookies()</script> runs as real JavaScript\n\n// SAFE — escape before output\necho "Welcome, " . htmlspecialchars($_GET[\'name\']);\n// The script tag is displayed as harmless text, not executed'),
      callout('tip', '<p>The rule of thumb: escape on output, every time, with <code>htmlspecialchars()</code> — not just for input that "looks risky." It costs nothing when the input was harmless anyway.</p>', 'Escape everything, not just the suspicious parts'),
      h(2, 'CSRF (Cross-Site Request Forgery)'),
      p('<p>Without protection, a malicious site can trick a logged-in user\'s browser into submitting a form to your site — the browser automatically includes the user\'s session cookie, making the request look legitimate. A CSRF token defeats this: a random value stored in the session and required on every form submission.</p>'),
      code('php', '// When rendering the form\nif (empty($_SESSION[\'csrf_token\'])) {\n    $_SESSION[\'csrf_token\'] = bin2hex(random_bytes(32));\n}\necho \'<input type="hidden" name="csrf_token" value="\' . $_SESSION[\'csrf_token\'] . \'">\';\n\n// When processing the form submission\nif (!hash_equals($_SESSION[\'csrf_token\'], $_POST[\'csrf_token\'] ?? \'\')) {\n    die(\'Invalid request.\');\n}'),
      h(2, 'Password Hashing'),
      p('<p>A password must never be stored as plain text or with a simple hash like MD5 — PHP\'s built-in <code>password_hash()</code> uses a strong, salted, deliberately slow algorithm designed specifically for this.</p>'),
      code('php', '// When a user registers\n$hashed = password_hash($_POST[\'password\'], PASSWORD_DEFAULT);\n// Store $hashed in the database — never the plain password\n\n// When a user logs in\nif (password_verify($_POST[\'password\'], $storedHash)) {\n    // Correct password\n}'),
      table(['Issue', 'Defense'], [
        ['SQL Injection', 'Prepared statements — never concatenate input into SQL'],
        ['XSS', 'htmlspecialchars() on every piece of output that includes user input'],
        ['CSRF', 'A random token in the session, checked on every state-changing form submission'],
        ['Plain-text passwords', 'password_hash() to store, password_verify() to check'],
      ]),
      callout('note', '<p>This lesson covers the specific PHP-level defenses. The Cybersecurity course elsewhere on this site covers phishing, password managers, and account security from the user\'s side — worth pairing with this one.</p>', 'Related, from the other side'),
    ],
  },
  bn: {
    title: 'PHP Security Basics — SQL Injection, XSS, CSRF ও Password Hashing',
    metaTitle: 'PHP Security Basics | Learn Computer Academy',
    metaDescription: 'প্রতিটি PHP developer শেষ পর্যন্ত যে চারটি security সমস্যায় পড়ে — SQL injection, cross-site scripting, CSRF, আর password নিরাপদে সংরক্ষণ করা — আর প্রতিটি আসলে কীভাবে প্রতিরোধ করবেন।',
    blocks: [
      p('<p>PHP script সাধারণত user input, একটি database, আর একটি login system handle করে — যার মানে এগুলো হাতেগোনা কিছু ভালোভাবে বোঝা attack-এরও সাধারণ target। প্রতিটার একটি নির্দিষ্ট, practical defense আছে।</p>'),
      h(2, 'SQL Injection'),
      p('<p>SQL string-এ সরাসরি user input insert করে একটি query বানালে একজন attacker নিজের SQL inject করতে পারে — আগের MySQL lesson-এ PDO <b>prepared statement</b>-এর ব্যবহার ঠিক এটাই প্রতিরোধ করে, আর কেন তা বোঝার যোগ্য।</p>'),
      code('php', '// দুর্বল — কখনো এটা করবেন না\n$username = $_GET[\'username\'];\n$sql = "SELECT * FROM users WHERE username = \'$username\'";\n// একজন attacker জমা দিলে: \' OR \'1\'=\'1\n// এটা প্রতিটি row match করা একটি query-তে পরিণত হয়'),
      code('php', '// নিরাপদ — একটি prepared statement\n$stmt = $pdo->prepare(\'SELECT * FROM users WHERE username = ?\');\n$stmt->execute([$_GET[\'username\']]);\n// Input SQL থেকে আলাদাভাবে পাঠানো হয় — এটাতে যাই থাকুক\n// কখনো query-র অংশ হিসেবে interpret করা যায় না'),
      callout('danger', '<p>যেকোনো user input সরাসরি একটি SQL query-তে string-concatenate করা একক সবচেয়ে common গুরুতর PHP security bug। একটি prepared statement কোনো optional উন্নতি না — user input থাকা প্রতিটি query-র জন্য এটাকে বাধ্যতামূলক ধরুন।</p>', 'এখানে সবচেয়ে গুরুত্বপূর্ণ একটি নিয়ম'),
      h(2, 'Cross-Site Scripting (XSS)'),
      p('<p>Escape না করে user input একটি পেজে echo করে ফেরত দেওয়া হলে, একজন attacker HTML বা JavaScript জমা দিতে পারে যা অন্য একজন visitor-এর browser-এ চলে — তাদের session চুরি করে, বা তাদের হয়ে কাজ করে।</p>'),
      code('php', '// দুর্বল\necho "Welcome, " . $_GET[\'name\'];\n// একটি নাম <script>stealCookies()</script> আসল JavaScript হিসেবে চলে\n\n// নিরাপদ — output-এর আগে escape করুন\necho "Welcome, " . htmlspecialchars($_GET[\'name\']);\n// script tag নিরীহ টেক্সট হিসেবে দেখানো হয়, চালানো হয় না'),
      callout('tip', '<p>মূল নিয়ম: "risky দেখতে" input-এর জন্যই না, প্রতিবার <code>htmlspecialchars()</code> দিয়ে output-এ escape করুন। Input নিরীহ হলেও এতে কিছু খরচ হয় না।</p>', 'শুধু সন্দেহজনক অংশ না, সবকিছু escape করুন'),
      h(2, 'CSRF (Cross-Site Request Forgery)'),
      p('<p>Protection ছাড়া, একটি malicious site একটি logged-in user-এর browser-কে আপনার site-এ একটি form জমা দিতে trick করতে পারে — browser স্বয়ংক্রিয়ভাবে user-এর session cookie যোগ করে, যা request-কে বৈধ দেখায়। একটি CSRF token এটা হারায়: session-এ সংরক্ষিত আর প্রতিটি form submission-এ দরকার হওয়া একটি random মান।</p>'),
      code('php', '// Form render করার সময়\nif (empty($_SESSION[\'csrf_token\'])) {\n    $_SESSION[\'csrf_token\'] = bin2hex(random_bytes(32));\n}\necho \'<input type="hidden" name="csrf_token" value="\' . $_SESSION[\'csrf_token\'] . \'">\';\n\n// Form submission process করার সময়\nif (!hash_equals($_SESSION[\'csrf_token\'], $_POST[\'csrf_token\'] ?? \'\')) {\n    die(\'Invalid request.\');\n}'),
      h(2, 'Password Hashing'),
      p('<p>একটি password কখনো plain text হিসেবে বা MD5-এর মতো একটি সাধারণ hash দিয়ে সংরক্ষণ করা উচিত না — PHP-র built-in <code>password_hash()</code> ঠিক এই জন্য বানানো একটি শক্তিশালী, salted, ইচ্ছাকৃতভাবে ধীর algorithm ব্যবহার করে।</p>'),
      code('php', '// একজন user register করলে\n$hashed = password_hash($_POST[\'password\'], PASSWORD_DEFAULT);\n// $hashed database-এ সংরক্ষণ করুন — কখনো plain password না\n\n// একজন user login করলে\nif (password_verify($_POST[\'password\'], $storedHash)) {\n    // সঠিক password\n}'),
      table(['সমস্যা', 'Defense'], [
        ['SQL Injection', 'Prepared statement — কখনো SQL-এ input concatenate করবেন না'],
        ['XSS', 'User input থাকা output-এর প্রতিটি অংশে htmlspecialchars()'],
        ['CSRF', 'Session-এ একটি random token, প্রতিটি state-বদলানো form submission-এ check করা'],
        ['Plain-text password', 'সংরক্ষণ করতে password_hash(), check করতে password_verify()'],
      ]),
      callout('note', '<p>এই lesson নির্দিষ্ট PHP-level defense কভার করে। এই সাইটের অন্য জায়গায় Cybersecurity কোর্স phishing, password manager, আর account security user-এর দিক থেকে কভার করে — এটার সাথে জোড়ার যোগ্য।</p>', 'সম্পর্কিত, অন্য দিক থেকে'),
    ],
  },
})

// ═══ 4. OOP — STATIC MEMBERS ═══════════════════════════════════════════════

lessons.push({
  slug: 'oop-static-members', sortOrder: n++,
  en: {
    title: 'OOP — Static Properties and Methods',
    metaTitle: 'PHP Static Properties and Methods | Learn Computer Academy',
    metaDescription: 'Properties and methods that belong to the class itself rather than any one object, accessed with :: instead of ->.',
    blocks: [
      p('<p>Every property and method covered so far belongs to a specific object — <code>$user1</code> and <code>$user2</code> each have their own separate copy. A <b>static</b> member belongs to the class itself, shared identically across every object of that class.</p>'),
      h(2, 'A Static Property'),
      code('php', 'class User {\n    public static int $totalUsers = 0;\n\n    public function __construct() {\n        self::$totalUsers++;\n    }\n}\n\nnew User();\nnew User();\nnew User();\n\necho User::$totalUsers;   // 3'),
      p('<p>Note the syntax difference: a static property is accessed with <code>::</code> and no <code>$</code> before the name (<code>User::$totalUsers</code>), never with <code>-&gt;</code> on an object.</p>'),
      h(2, 'self:: vs. the Class Name'),
      p('<p>Inside the class, <code>self::</code> refers to the static member — using the class name directly works too, but <code>self::</code> stays correct even if the class is later renamed.</p>'),
      h(2, 'A Static Method'),
      p('<p>Called on the class itself, without needing an object instance at all.</p>'),
      code('php', 'class MathHelper {\n    public static function square(int $n): int {\n        return $n * $n;\n    }\n}\n\necho MathHelper::square(5);   // 25 — no "new MathHelper()" needed'),
      h(2, 'When a Static Method Makes Sense'),
      table(['Use static when...', 'Use a regular (instance) method when...'], [
        ['The logic doesn\'t depend on any particular object\'s data', 'The logic reads or changes a specific object\'s properties'],
        ['A utility function grouped inside a class for organization', 'The method genuinely represents something a single object does'],
        ['A counter or shared value across every instance', 'Each object needs its own independent value'],
      ]),
      callout('warning', '<p>A static method can\'t access <code>$this</code> — it has no specific object to refer to. Reaching for static as a default, rather than when it genuinely fits, is a common beginner overuse.</p>', 'The main limitation'),
    ],
  },
  bn: {
    title: 'OOP — Static Property ও Method',
    metaTitle: 'PHP Static Property ও Method | Learn Computer Academy',
    metaDescription: 'কোনো একটি object-এর বদলে ক্লাস নিজের সাথে সম্পর্কিত property ও method, -> এর বদলে :: দিয়ে access করা।',
    blocks: [
      p('<p>এখন পর্যন্ত কভার করা প্রতিটি property আর method একটি নির্দিষ্ট object-এর — <code>$user1</code> আর <code>$user2</code>-এর প্রতিটার নিজের আলাদা কপি আছে। একটি <b>static</b> member ক্লাস নিজের সাথে সম্পর্কিত, সেই ক্লাসের প্রতিটি object জুড়ে একইভাবে শেয়ার করা।</p>'),
      h(2, 'একটি Static Property', 'একটি-static-property'),
      code('php', 'class User {\n    public static int $totalUsers = 0;\n\n    public function __construct() {\n        self::$totalUsers++;\n    }\n}\n\nnew User();\nnew User();\nnew User();\n\necho User::$totalUsers;   // 3'),
      p('<p>সিনট্যাক্সের পার্থক্য লক্ষ্য করুন: একটি static property <code>::</code> দিয়ে আর নামের আগে কোনো <code>$</code> ছাড়াই access হয় (<code>User::$totalUsers</code>), একটি object-এ <code>-&gt;</code> দিয়ে কখনো না।</p>'),
      h(2, 'self:: বনাম ক্লাসের নাম', 'self-বনাম-ক্লাসের-নাম'),
      p('<p>ক্লাসের ভেতরে, <code>self::</code> static member-কে refer করে — সরাসরি ক্লাসের নাম ব্যবহার করাও কাজ করে, কিন্তু ক্লাসের নাম পরে বদলালেও <code>self::</code> সঠিক থাকে।</p>'),
      h(2, 'একটি Static Method', 'একটি-static-method'),
      p('<p>ক্লাসের উপর নিজেই call করা হয়, একটা object instance এর কোনো দরকার ছাড়াই।</p>'),
      code('php', 'class MathHelper {\n    public static function square(int $n): int {\n        return $n * $n;\n    }\n}\n\necho MathHelper::square(5);   // 25 — কোনো "new MathHelper()" দরকার নেই'),
      h(2, 'কখন একটি Static Method মানানসই', 'কখন-একটি-static-method-মানানসই'),
      table(['যখন static ব্যবহার করবেন...', 'যখন একটি সাধারণ (instance) method ব্যবহার করবেন...'], [
        ['Logic কোনো নির্দিষ্ট object-এর data-র উপর নির্ভর করে না', 'Logic একটি নির্দিষ্ট object-এর property পড়ে বা বদলায়'],
        ['Organization-এর জন্য একটি ক্লাসের ভেতরে group করা একটি utility function', 'Method সত্যিকারভাবে একটি single object যা করে তা represent করে'],
        ['প্রতিটি instance জুড়ে একটি counter বা শেয়ার করা মান', 'প্রতিটি object-এর নিজের স্বাধীন মান দরকার'],
      ]),
      callout('warning', '<p>একটি static method <code>$this</code> access করতে পারে না — এর refer করার মতো কোনো নির্দিষ্ট object নেই। আসলে যেখানে মানায় তার বদলে default হিসেবে static-এ যাওয়া একটি common শুরুর দিকের overuse।</p>', 'প্রধান সীমাবদ্ধতা'),
    ],
  },
})

// ═══ 5. OOP — TRAITS ═══════════════════════════════════════════════════════

lessons.push({
  slug: 'oop-traits', sortOrder: n++,
  en: {
    title: 'OOP — Traits',
    metaTitle: 'PHP Traits | Learn Computer Academy',
    metaDescription: 'Sharing a set of methods across unrelated classes with traits — PHP\'s answer to not having multiple inheritance.',
    blocks: [
      p('<p>PHP classes can only extend one parent — no multiple inheritance. A <b>trait</b> solves the specific problem that limitation creates: sharing the same set of methods across classes that aren\'t related by inheritance at all.</p>'),
      h(2, 'Defining a Trait'),
      code('php', 'trait Loggable {\n    public function log(string $message): void {\n        echo \'[\' . date(\'Y-m-d H:i:s\') . \'] \' . $message . PHP_EOL;\n    }\n}'),
      h(2, 'Using a Trait — use'),
      p('<p>A class pulls in a trait\'s methods with <code>use</code>, as if they were written directly in the class.</p>'),
      code('php', 'class Order {\n    use Loggable;\n\n    public function ship(): void {\n        $this->log(\'Order shipped\');\n    }\n}\n\nclass User {\n    use Loggable;   // same trait, an unrelated class\n\n    public function register(): void {\n        $this->log(\'User registered\');\n    }\n}'),
      h(2, 'Using Multiple Traits'),
      code('php', 'class Order {\n    use Loggable, Cacheable, Notifiable;\n}'),
      h(2, 'When to Reach for a Trait Instead of Inheritance'),
      table(['Inheritance (extends)', 'A trait (use)'], [
        ['"Is-a" relationship — a Dog is an Animal', 'A shared capability across otherwise unrelated classes'],
        ['One parent only', 'Multiple traits at once'],
        ['Models a real hierarchy', 'A reusable bundle of behavior, not a hierarchy'],
      ]),
      callout('note', '<p>A trait method can be overridden by the class using it — the class\'s own version always wins if both define the same method name.</p>', 'Traits don\'t force behavior'),
    ],
  },
  bn: {
    title: 'OOP — Trait',
    metaTitle: 'PHP Trait | Learn Computer Academy',
    metaDescription: 'Trait দিয়ে অসম্পর্কিত ক্লাস জুড়ে method-এর একটি সেট শেয়ার করা — multiple inheritance না থাকার PHP-র উত্তর।',
    blocks: [
      p('<p>PHP ক্লাস শুধু একটি parent extend করতে পারে — কোনো multiple inheritance না। একটি <b>trait</b> সেই সীমাবদ্ধতা তৈরি করা নির্দিষ্ট সমস্যাটা সমাধান করে: inheritance দিয়ে একেবারেই সম্পর্কিত না এমন ক্লাস জুড়ে একই method-এর সেট শেয়ার করা।</p>'),
      h(2, 'একটি Trait Define করা', 'একটি-trait-define-করা'),
      code('php', 'trait Loggable {\n    public function log(string $message): void {\n        echo \'[\' . date(\'Y-m-d H:i:s\') . \'] \' . $message . PHP_EOL;\n    }\n}'),
      h(2, 'একটি Trait ব্যবহার করা — use', 'একটি-trait-ব্যবহার-করা-use'),
      p('<p>একটি ক্লাস <code>use</code> দিয়ে একটি trait-এর method টেনে আনে, যেন সেগুলো সরাসরি ক্লাসে লেখা হয়েছে।</p>'),
      code('php', 'class Order {\n    use Loggable;\n\n    public function ship(): void {\n        $this->log(\'Order shipped\');\n    }\n}\n\nclass User {\n    use Loggable;   // একই trait, একটি অসম্পর্কিত ক্লাস\n\n    public function register(): void {\n        $this->log(\'User registered\');\n    }\n}'),
      h(2, 'একাধিক Trait ব্যবহার করা', 'একাধিক-trait-ব্যবহার-করা'),
      code('php', 'class Order {\n    use Loggable, Cacheable, Notifiable;\n}'),
      h(2, 'কখন Inheritance-এর বদলে একটি Trait-এ যাবেন', 'কখন-inheritance-এর-বদলে-একটি-trait-এ-যাবেন'),
      table(['Inheritance (extends)', 'একটি trait (use)'], [
        ['"Is-a" সম্পর্ক — একটি Dog একটি Animal', 'অন্যথায় অসম্পর্কিত ক্লাস জুড়ে একটি শেয়ার করা ক্ষমতা'],
        ['শুধু একটি parent', 'একসাথে একাধিক trait'],
        ['একটি আসল hierarchy model করে', 'behavior-এর একটি reusable bundle, কোনো hierarchy না'],
      ]),
      callout('note', '<p>একটি trait method সেটা ব্যবহার করা ক্লাস দিয়ে override করা যায় — দুটোই একই method নাম define করলে ক্লাসের নিজের version সবসময় জেতে।</p>', 'Trait behavior বাধ্য করে না'),
    ],
  },
})

// ═══ 6. OOP — NAMESPACES ═══════════════════════════════════════════════════

lessons.push({
  slug: 'oop-namespaces', sortOrder: n++,
  en: {
    title: 'OOP — Namespaces',
    metaTitle: 'PHP Namespaces | Learn Computer Academy',
    metaDescription: 'Organizing classes into named groups to avoid naming collisions, especially once a project uses external packages.',
    blocks: [
      p('<p>As soon as a project has more than a handful of classes — or uses any external package (covered in the Composer lesson ahead) — two classes with the same name is a real risk. A <b>namespace</b> prevents that collision.</p>'),
      h(2, 'Declaring a Namespace'),
      p('<p>A namespace declaration must be the very first statement in a PHP file.</p>'),
      code('php', '<?php\nnamespace App\\Models;\n\nclass User {\n    // this class\'s full name is App\\Models\\User\n}'),
      h(2, 'Why This Matters'),
      code('php', '<?php\nnamespace App\\Models;\nclass User { /* ... */ }\n\nnamespace App\\Auth;\nclass User { /* ... */ }   // a completely different class,\n                            // fully named App\\Auth\\User —\n                            // no naming conflict at all'),
      h(2, 'Using a Class from Another Namespace — use'),
      code('php', '<?php\nnamespace App\\Controllers;\n\nuse App\\Models\\User;\n\n$user = new User();   // resolves to App\\Models\\User'),
      h(2, 'Aliasing with as'),
      p('<p>Useful when two classes from different namespaces would otherwise share the same short name.</p>'),
      code('php', 'use App\\Models\\User;\nuse App\\Legacy\\User as LegacyUser;\n\n$user = new User();\n$oldUser = new LegacyUser();'),
      callout('tip', '<p>The convention followed by nearly every modern PHP project — and the one Composer\'s autoloading (next lesson) expects — is one namespace matching the folder structure: <code>App\\Models\\User</code> lives in <code>app/Models/User.php</code>.</p>', 'Namespaces usually mirror folders'),
    ],
  },
  bn: {
    title: 'OOP — Namespace',
    metaTitle: 'PHP Namespace | Learn Computer Academy',
    metaDescription: 'নাম-সংঘর্ষ এড়াতে ক্লাসকে নামযুক্ত group-এ organize করা, বিশেষত একটি project external package ব্যবহার করলে।',
    blocks: [
      p('<p>একটি project-এ হাতেগোনা কয়েকটার বেশি ক্লাস হলেই — বা কোনো external package ব্যবহার করলেই (সামনের Composer lesson-এ কভার করা), একই নামের দুটি ক্লাস একটি আসল ঝুঁকি। একটি <b>namespace</b> সেই সংঘর্ষ প্রতিরোধ করে।</p>'),
      h(2, 'একটি Namespace Declare করা', 'একটি-namespace-declare-করা'),
      p('<p>একটি namespace declaration একটি PHP file-এর একদম প্রথম statement হতে হবে।</p>'),
      code('php', '<?php\nnamespace App\\Models;\n\nclass User {\n    // এই ক্লাসের পুরো নাম App\\Models\\User\n}'),
      h(2, 'কেন এটা গুরুত্বপূর্ণ', 'কেন-এটা-গুরুত্বপূর্ণ'),
      code('php', '<?php\nnamespace App\\Models;\nclass User { /* ... */ }\n\nnamespace App\\Auth;\nclass User { /* ... */ }   // সম্পূর্ণ ভিন্ন একটি ক্লাস,\n                            // পুরো নাম App\\Auth\\User —\n                            // কোনো নাম সংঘর্ষ নেই'),
      h(2, 'অন্য একটি Namespace থেকে একটি ক্লাস ব্যবহার করা — use', 'অন্য-একটি-namespace-থেকে-একটি-ক্লাস-ব্যবহার-করা-use'),
      code('php', '<?php\nnamespace App\\Controllers;\n\nuse App\\Models\\User;\n\n$user = new User();   // App\\Models\\User-এ resolve হয়'),
      h(2, 'as দিয়ে Alias করা', 'as-দিয়ে-alias-করা'),
      p('<p>ভিন্ন namespace-এর দুটি ক্লাস অন্যথায় একই ছোট নাম শেয়ার করলে useful।</p>'),
      code('php', 'use App\\Models\\User;\nuse App\\Legacy\\User as LegacyUser;\n\n$user = new User();\n$oldUser = new LegacyUser();'),
      callout('tip', '<p>প্রায় প্রতিটি modern PHP project অনুসরণ করা convention — আর Composer-এর autoloading (পরের lesson) যেটা আশা করে — folder structure-এর সাথে মেলা একটি namespace: <code>App\\Models\\User</code> থাকে <code>app/Models/User.php</code>-তে।</p>', 'Namespace সাধারণত folder mirror করে'),
    ],
  },
})

// ═══ 7. OOP — MAGIC METHODS ════════════════════════════════════════════════

lessons.push({
  slug: 'oop-magic-methods', sortOrder: n++,
  en: {
    title: 'OOP — Magic Methods',
    metaTitle: 'PHP Magic Methods | Learn Computer Academy',
    metaDescription: "PHP's special __-prefixed methods that run automatically for certain operations — reading an undefined property, converting an object to a string, and more.",
    blocks: [
      p('<p>PHP calls a small set of specially-named methods automatically, in response to specific operations on an object — reading a property that doesn\'t exist, treating an object as a string, and a few others. <code>__construct()</code> from earlier lessons is the most common one; here are the rest worth knowing.</p>'),
      h(2, '__toString() — Converting an Object to a String'),
      code('php', 'class Money {\n    public function __construct(private int $cents) {}\n\n    public function __toString(): string {\n        return \'$\' . number_format($this->cents / 100, 2);\n    }\n}\n\n$price = new Money(1999);\necho $price;   // $19.99 — echo calls __toString() automatically'),
      h(2, '__get() and __set() — Reading and Writing Undefined Properties'),
      p('<p>Runs when code tries to read or write a property that isn\'t explicitly declared — useful for computed or dynamically-stored properties.</p>'),
      code('php', 'class Config {\n    private array $data = [];\n\n    public function __get(string $name) {\n        return $this->data[$name] ?? null;\n    }\n\n    public function __set(string $name, $value): void {\n        $this->data[$name] = $value;\n    }\n}\n\n$config = new Config();\n$config->siteName = \'My App\';   // triggers __set()\necho $config->siteName;         // triggers __get() — "My App"'),
      h(2, '__call() — Handling a Call to an Undefined Method'),
      code('php', 'class ApiClient {\n    public function __call(string $method, array $args) {\n        return "Called $method with " . count($args) . " argument(s)";\n    }\n}\n\n$client = new ApiClient();\necho $client->getUsers(1, 2);   // "Called getUsers with 2 argument(s)"'),
      table(['Method', 'Runs when...'], [
        ['__construct()', 'An object is created'],
        ['__destruct()', 'An object is destroyed or the script ends'],
        ['__toString()', 'An object is used in a string context (echo, concatenation)'],
        ['__get() / __set()', 'An undefined property is read or written'],
        ['__call()', 'An undefined method is called'],
      ]),
      callout('warning', '<p>Magic methods make code harder to trace — a click-to-definition on <code>$config->siteName</code> won\'t lead anywhere obvious. Use them for a genuine, specific need (a config object, a lightweight ORM), not as a default way to write a class.</p>', 'A real trade-off, not a free upgrade'),
    ],
  },
  bn: {
    title: 'OOP — Magic Method',
    metaTitle: 'PHP Magic Method | Learn Computer Academy',
    metaDescription: 'PHP-র বিশেষ __-prefixed method যা নির্দিষ্ট operation-এর জন্য স্বয়ংক্রিয়ভাবে চলে — একটি undefined property পড়া, একটি object-কে string-এ রূপান্তর করা, আরো।',
    blocks: [
      p('<p>PHP একটি object-এর উপর নির্দিষ্ট operation-এর প্রতিক্রিয়ায় স্বয়ংক্রিয়ভাবে বিশেষভাবে-নামকরণ করা হাতেগোনা কিছু method call করে — নেই এমন একটি property পড়া, একটি object-কে string হিসেবে treat করা, আর আরো কয়েকটা। আগের lesson থেকে <code>__construct()</code> সবচেয়ে common একটা; বাকিগুলো জানার যোগ্য।</p>'),
      h(2, '__toString() — একটি Object-কে String-এ রূপান্তর করা', 'tostring-একটি-object-কে-string-এ-রূপান্তর-করা'),
      code('php', 'class Money {\n    public function __construct(private int $cents) {}\n\n    public function __toString(): string {\n        return \'$\' . number_format($this->cents / 100, 2);\n    }\n}\n\n$price = new Money(1999);\necho $price;   // $19.99 — echo স্বয়ংক্রিয়ভাবে __toString() call করে'),
      h(2, '__get() ও __set() — Undefined Property পড়া ও লেখা', 'get-ও-set-undefined-property-পড়া-ও-লেখা'),
      p('<p>স্পষ্টভাবে declare করা না এমন একটি property পড়া বা লেখার চেষ্টা করলে চলে — computed বা dynamically-সংরক্ষিত property-র জন্য useful।</p>'),
      code('php', 'class Config {\n    private array $data = [];\n\n    public function __get(string $name) {\n        return $this->data[$name] ?? null;\n    }\n\n    public function __set(string $name, $value): void {\n        $this->data[$name] = $value;\n    }\n}\n\n$config = new Config();\n$config->siteName = \'My App\';   // __set() trigger করে\necho $config->siteName;         // __get() trigger করে — "My App"'),
      h(2, '__call() — একটি Undefined Method-এ Call Handle করা', 'call-একটি-undefined-method-এ-call-handle-করা'),
      code('php', 'class ApiClient {\n    public function __call(string $method, array $args) {\n        return "Called $method with " . count($args) . " argument(s)";\n    }\n}\n\n$client = new ApiClient();\necho $client->getUsers(1, 2);   // "Called getUsers with 2 argument(s)"'),
      table(['Method', 'কখন চলে...'], [
        ['__construct()', 'একটি object তৈরি হলে'],
        ['__destruct()', 'একটি object destroy হলে বা script শেষ হলে'],
        ['__toString()', 'একটি object একটি string context-এ ব্যবহৃত হলে (echo, concatenation)'],
        ['__get() / __set()', 'একটি undefined property পড়া বা লেখা হলে'],
        ['__call()', 'একটি undefined method call করা হলে'],
      ]),
      callout('warning', '<p>Magic method কোড trace করা কঠিন করে — <code>$config->siteName</code>-এ একটি click-to-definition কোথাও স্পষ্ট নিয়ে যায় না। একটি সত্যিকারের, নির্দিষ্ট দরকারে এগুলো ব্যবহার করুন (একটি config object, একটি lightweight ORM), একটি ক্লাস লেখার default উপায় হিসেবে না।</p>', 'একটি আসল trade-off, ফ্রি upgrade না'),
    ],
  },
})

// ═══ 8. OOP — POLYMORPHISM & TYPE DECLARATIONS ═══════════════════════════

lessons.push({
  slug: 'oop-polymorphism', sortOrder: n++,
  en: {
    title: 'OOP — Polymorphism and Type Declarations',
    metaTitle: 'PHP Polymorphism and Type Declarations | Learn Computer Academy',
    metaDescription: "Calling the same method on different object types and getting each one's own correct behavior — and the type declarations that make code relying on this safe.",
    blocks: [
      p('<p><b>Polymorphism</b> means code can call the same method name on different types of objects, and each one runs its own version — the earlier Interfaces lesson already builds this in practice; this lesson names the concept and covers the type declarations that make it safe to rely on.</p>'),
      h(2, 'Polymorphism in Practice'),
      code('php', 'interface Shape {\n    public function area(): float;\n}\n\nclass Circle implements Shape {\n    public function __construct(private float $radius) {}\n    public function area(): float {\n        return pi() * $this->radius ** 2;\n    }\n}\n\nclass Rectangle implements Shape {\n    public function __construct(private float $width, private float $height) {}\n    public function area(): float {\n        return $this->width * $this->height;\n    }\n}\n\nfunction printArea(Shape $shape): void {\n    echo $shape->area() . PHP_EOL;\n}\n\nprintArea(new Circle(5));\nprintArea(new Rectangle(4, 6));\n// printArea doesn\'t know or care which shape it received —\n// each one calculates its own area() correctly'),
      h(2, 'Why the Type Hint Matters Here'),
      p('<p>The <code>Shape $shape</code> parameter type is what makes this safe — PHP guarantees anything passed in has an <code>area()</code> method, without <code>printArea</code> needing to check what kind of shape it received.</p>'),
      h(2, 'Type Declarations — A Fuller Picture'),
      table(['Where', 'Example'], [
        ['Parameter type', 'function area(Shape $shape)'],
        ['Return type', 'function area(): float'],
        ['Property type', 'private float $radius;'],
        ['Union type — more than one allowed', 'function process(int|string $id)'],
        ['Nullable type', 'function find(int $id): ?User'],
      ]),
      h(2, 'A Brief Note on Dependency Injection'),
      p('<p>Type-hinting an interface, as <code>printArea(Shape $shape)</code> does, is also the foundation of <b>dependency injection</b> — a class that depends on an interface rather than one specific class can have any matching implementation "injected" into it, which is what makes swapping a real database for a test double possible without changing the class itself. It\'s a full topic on its own, worth knowing the name and the idea now.</p>'),
      callout('note', '<p>PHP checks types at runtime, not compile time — a wrong type still causes an error, just when that line of code actually runs rather than before the script starts.</p>', 'PHP\'s typing is runtime-checked'),
    ],
  },
  bn: {
    title: 'OOP — Polymorphism ও Type Declaration',
    metaTitle: 'PHP Polymorphism ও Type Declaration | Learn Computer Academy',
    metaDescription: 'ভিন্ন object type-এ একই method call করা আর প্রতিটির নিজের সঠিক behavior পাওয়া — আর এর উপর নির্ভর করা কোড নিরাপদ করা type declaration।',
    blocks: [
      p('<p><b>Polymorphism</b> মানে কোড ভিন্ন type-এর object-এ একই method নাম call করতে পারে, আর প্রতিটি নিজের version চালায় — আগের Interfaces lesson ইতিমধ্যে বাস্তবে এটা বানায়; এই lesson concept-টার নাম দেয় আর এর উপর নির্ভর করা নিরাপদ বানায় এমন type declaration কভার করে।</p>'),
      h(2, 'বাস্তবে Polymorphism', 'বাস্তবে-polymorphism'),
      code('php', 'interface Shape {\n    public function area(): float;\n}\n\nclass Circle implements Shape {\n    public function __construct(private float $radius) {}\n    public function area(): float {\n        return pi() * $this->radius ** 2;\n    }\n}\n\nclass Rectangle implements Shape {\n    public function __construct(private float $width, private float $height) {}\n    public function area(): float {\n        return $this->width * $this->height;\n    }\n}\n\nfunction printArea(Shape $shape): void {\n    echo $shape->area() . PHP_EOL;\n}\n\nprintArea(new Circle(5));\nprintArea(new Rectangle(4, 6));\n// printArea কোন shape পেয়েছে জানে না বা পরোয়া করে না —\n// প্রতিটি নিজের area() সঠিকভাবে হিসাব করে'),
      h(2, 'কেন এখানে Type Hint গুরুত্বপূর্ণ', 'কেন-এখানে-type-hint-গুরুত্বপূর্ণ'),
      p('<p><code>Shape $shape</code> parameter type-ই এটাকে নিরাপদ বানায় — PHP গ্যারান্টি দেয় পাঠানো যেকোনো কিছুর একটি <code>area()</code> method আছে, <code>printArea</code>-কে এটা কোন ধরনের shape পেয়েছে তা check করতে হয় না।</p>'),
      h(2, 'Type Declaration — একটি পূর্ণ ছবি', 'type-declaration-একটি-পূর্ণ-ছবি'),
      table(['কোথায়', 'উদাহরণ'], [
        ['Parameter type', 'function area(Shape $shape)'],
        ['Return type', 'function area(): float'],
        ['Property type', 'private float $radius;'],
        ['Union type — একাধিক অনুমোদিত', 'function process(int|string $id)'],
        ['Nullable type', 'function find(int $id): ?User'],
      ]),
      h(2, 'Dependency Injection নিয়ে একটি সংক্ষিপ্ত নোট', 'dependency-injection-নিয়ে-একটি-সংক্ষিপ্ত-নোট'),
      p('<p><code>printArea(Shape $shape)</code> যেমন করে একটি interface type-hint করা <b>dependency injection</b>-এরও ভিত্তি — একটি নির্দিষ্ট ক্লাসের বদলে একটি interface-এর উপর নির্ভর করা একটি ক্লাসে যেকোনো মিলে যাওয়া implementation "inject" করা যায়, যা ক্লাস নিজে না বদলেই একটি আসল database-কে একটি test double দিয়ে বদলানো সম্ভব করে। এটা নিজেই একটি পূর্ণ topic, এখন নাম আর ধারণাটা জানার যোগ্য।</p>'),
      callout('note', '<p>PHP compile time-এ না, runtime-এ type check করে — একটি ভুল type এখনো একটি error ঘটায়, শুধু script শুরু হওয়ার আগে না, ওই কোড লাইনটা আসলে চলার সময়।</p>', 'PHP-র typing runtime-checked'),
    ],
  },
})

// ═══ 9. COMPOSER & AUTOLOADING ═════════════════════════════════════════════

lessons.push({
  slug: 'composer-and-autoloading', sortOrder: n++,
  en: {
    title: 'Composer and Autoloading',
    metaTitle: 'PHP Composer and Autoloading | Learn Computer Academy',
    metaDescription: 'PHP\'s package manager — installing a library, managing dependencies, and letting classes load automatically without a manual require for each one.',
    blocks: [
      p('<p><b>Composer</b> is PHP\'s standard package manager — it installs and manages external libraries, and (just as usefully) handles loading a project\'s own classes automatically, without a manual <code>require</code> for every file.</p>'),
      h(2, 'Installing a Package'),
      code('bash', 'composer require guzzlehttp/guzzle'),
      p('<p>This downloads the package into a <code>vendor/</code> folder and records it (with its version) in a <code>composer.json</code> file, so the exact same dependencies can be reinstalled anywhere.</p>'),
      h(2, 'composer.json'),
      code('json', '{\n    "require": {\n        "guzzlehttp/guzzle": "^7.0"\n    },\n    "autoload": {\n        "psr-4": {\n            "App\\\\": "app/"\n        }\n    }\n}'),
      h(2, 'Using an Installed Package'),
      p('<p>One line, at the top of the entry file, loads every installed package\'s classes.</p>'),
      code('php', 'require \'vendor/autoload.php\';\n\nuse GuzzleHttp\\Client;\n\n$client = new Client();'),
      h(2, 'Autoloading a Project\'s Own Classes — PSR-4'),
      p('<p>The <code>"App\\\\": "app/"</code> line in <code>composer.json</code> above tells Composer that any class in the <code>App</code> namespace lives in the <code>app/</code> folder, following the same path — no manual <code>require</code> needed for a project\'s own files either.</p>'),
      code('php', '// app/Models/User.php\nnamespace App\\Models;\n\nclass User {\n    // ...\n}\n\n// anywhere else in the project, after \'vendor/autoload.php\':\nuse App\\Models\\User;\n$user = new User();   // Composer finds and loads the file automatically'),
      p('<p>After adding or moving a class, running <code>composer dump-autoload</code> rebuilds the autoloader\'s internal class map.</p>'),
      code('bash', 'composer dump-autoload'),
      table(['Command', 'What it does'], [
        ['composer init', 'Creates a new composer.json for a project'],
        ['composer require <package>', 'Installs a package and adds it to composer.json'],
        ['composer install', 'Installs everything listed in composer.json — used when cloning a project'],
        ['composer update', 'Updates packages to their latest allowed versions'],
        ['composer dump-autoload', 'Rebuilds the autoloader after adding/moving classes'],
      ]),
      callout('tip', '<p>Packagist (packagist.org) is the official package registry Composer searches — worth checking there before writing something from scratch that a well-maintained package already solves.</p>', 'Where packages come from'),
    ],
  },
  bn: {
    title: 'Composer ও Autoloading',
    metaTitle: 'PHP Composer ও Autoloading | Learn Computer Academy',
    metaDescription: 'PHP-র package manager — একটি library install করা, dependency manage করা, আর প্রতিটির জন্য একটি manual require ছাড়াই ক্লাস স্বয়ংক্রিয়ভাবে load হতে দেওয়া।',
    blocks: [
      p('<p><b>Composer</b> PHP-র standard package manager — এটা external library install আর manage করে, আর (একই রকম useful) একটি project-এর নিজের ক্লাস স্বয়ংক্রিয়ভাবে load করা handle করে, প্রতিটি file-এর জন্য একটি manual <code>require</code> ছাড়াই।</p>'),
      h(2, 'একটি Package Install করা', 'একটি-package-install-করা'),
      code('bash', 'composer require guzzlehttp/guzzle'),
      p('<p>এটা package-টা একটি <code>vendor/</code> folder-এ download করে আর (এর version সহ) একটি <code>composer.json</code> file-এ রেকর্ড করে, যাতে ঠিক একই dependency যেকোনো জায়গায় আবার install করা যায়।</p>'),
      h(2, 'composer.json'),
      code('json', '{\n    "require": {\n        "guzzlehttp/guzzle": "^7.0"\n    },\n    "autoload": {\n        "psr-4": {\n            "App\\\\": "app/"\n        }\n    }\n}'),
      h(2, 'একটি Installed Package ব্যবহার করা', 'একটি-installed-package-ব্যবহার-করা'),
      p('<p>Entry file-এর উপরে একটি লাইন, প্রতিটি installed package-এর ক্লাস load করে।</p>'),
      code('php', 'require \'vendor/autoload.php\';\n\nuse GuzzleHttp\\Client;\n\n$client = new Client();'),
      h(2, 'একটি Project-এর নিজের ক্লাস Autoload করা — PSR-4', 'একটি-project-এর-নিজের-ক্লাস-autoload-করা-psr-4'),
      p('<p>উপরের <code>composer.json</code>-এ <code>"App\\\\": "app/"</code> লাইন Composer-কে বলে <code>App</code> namespace-এর যেকোনো ক্লাস <code>app/</code> folder-এ থাকে, একই path অনুসরণ করে — একটি project-এর নিজের file-এর জন্যও কোনো manual <code>require</code> দরকার নেই।</p>'),
      code('php', '// app/Models/User.php\nnamespace App\\Models;\n\nclass User {\n    // ...\n}\n\n// project-এর অন্য যেকোনো জায়গায়, \'vendor/autoload.php\'-এর পরে:\nuse App\\Models\\User;\n$user = new User();   // Composer স্বয়ংক্রিয়ভাবে file খুঁজে load করে'),
      p('<p>একটি ক্লাস যোগ বা move করার পর, <code>composer dump-autoload</code> চালালে autoloader-এর internal class map পুনর্গঠন হয়।</p>'),
      code('bash', 'composer dump-autoload'),
      table(['Command', 'কী করে'], [
        ['composer init', 'একটি project-এর জন্য একটি নতুন composer.json তৈরি করে'],
        ['composer require <package>', 'একটি package install করে আর composer.json-এ যোগ করে'],
        ['composer install', 'composer.json-এ list করা সবকিছু install করে — একটি project clone করার সময় ব্যবহৃত'],
        ['composer update', 'package-কে তাদের সর্বশেষ অনুমোদিত version-এ আপডেট করে'],
        ['composer dump-autoload', 'ক্লাস যোগ/move করার পর autoloader পুনর্গঠন করে'],
      ]),
      callout('tip', '<p>Packagist (packagist.org) হলো official package registry যা Composer search করে — একটি ভালো-maintained package ইতিমধ্যে সমাধান করেছে এমন কিছু শুরু থেকে লেখার আগে সেখানে check করার যোগ্য।</p>', 'Package কোথা থেকে আসে'),
    ],
  },
})

// ═══ 10. JSON PROCESSING ═══════════════════════════════════════════════════

lessons.push({
  slug: 'json-processing', sortOrder: n++,
  en: {
    title: 'Working with JSON in PHP',
    metaTitle: 'PHP JSON Processing | Learn Computer Academy',
    metaDescription: 'Converting a PHP array or object to JSON and back — the standard format for an API request or response.',
    blocks: [
      p('<p>JSON is the standard format for exchanging data between a PHP backend and a frontend, or between two servers — nearly every API request and response uses it. PHP has JSON support built in, no package required.</p>'),
      h(2, 'PHP to JSON — json_encode()'),
      code('php', '$user = [\n    \'name\' => \'Sam\',\n    \'age\' => 28,\n    \'active\' => true,\n];\n\necho json_encode($user);\n// {"name":"Sam","age":28,"active":true}'),
      h(2, 'Pretty-Printing for Readability'),
      code('php', 'echo json_encode($user, JSON_PRETTY_PRINT);'),
      h(2, 'JSON to PHP — json_decode()'),
      p('<p>By default, this returns an <code>stdClass</code> object — pass <code>true</code> as the second argument to get an associative array instead, usually the more convenient choice.</p>'),
      code('php', '$json = \'{"name":"Sam","age":28}\';\n\n$object = json_decode($json);\necho $object->name;        // Sam — object access\n\n$array = json_decode($json, true);\necho $array[\'name\'];        // Sam — array access'),
      h(2, 'A Complete API Response Example'),
      code('php', 'header(\'Content-Type: application/json\');\n\n$users = getUsersFromDatabase();   // an array of associative arrays\n\necho json_encode([\n    \'success\' => true,\n    \'data\' => $users,\n]);'),
      h(2, 'Checking for Errors'),
      p('<p>Invalid JSON makes <code>json_decode()</code> return <code>null</code> — worth checking explicitly, since a genuinely empty result also decodes to something falsy.</p>'),
      code('php', '$data = json_decode($json);\nif (json_last_error() !== JSON_ERROR_NONE) {\n    die(\'Invalid JSON: \' . json_last_error_msg());\n}'),
      callout('note', '<p>Not every PHP value converts cleanly — a resource (like an open file handle) can\'t be represented in JSON at all, and encoding one silently produces <code>0</code> rather than an error.</p>', 'What json_encode() can\'t do'),
    ],
  },
  bn: {
    title: 'PHP-তে JSON নিয়ে কাজ করা',
    metaTitle: 'PHP JSON Processing | Learn Computer Academy',
    metaDescription: 'একটি PHP array বা object-কে JSON-এ আর ফিরিয়ে রূপান্তর করা — একটি API request বা response-এর standard format।',
    blocks: [
      p('<p>একটি PHP backend আর একটি frontend-এর মধ্যে, বা দুটি server-এর মধ্যে data আদান-প্রদানের standard format JSON — প্রায় প্রতিটি API request আর response এটা ব্যবহার করে। PHP-তে built-in JSON support আছে, কোনো package দরকার নেই।</p>'),
      h(2, 'PHP থেকে JSON — json_encode()', 'php-থেকে-json-json_encode'),
      code('php', '$user = [\n    \'name\' => \'Sam\',\n    \'age\' => 28,\n    \'active\' => true,\n];\n\necho json_encode($user);\n// {"name":"Sam","age":28,"active":true}'),
      h(2, 'Readability-র জন্য Pretty-Printing', 'readability-র-জন্য-pretty-printing'),
      code('php', 'echo json_encode($user, JSON_PRETTY_PRINT);'),
      h(2, 'JSON থেকে PHP — json_decode()', 'json-থেকে-php-json_decode'),
      p('<p>Default-এ, এটা একটি <code>stdClass</code> object return করে — এর বদলে একটি associative array পেতে দ্বিতীয় argument হিসেবে <code>true</code> পাঠান, সাধারণত বেশি সুবিধাজনক পছন্দ।</p>'),
      code('php', '$json = \'{"name":"Sam","age":28}\';\n\n$object = json_decode($json);\necho $object->name;        // Sam — object access\n\n$array = json_decode($json, true);\necho $array[\'name\'];        // Sam — array access'),
      h(2, 'একটি পূর্ণ API Response উদাহরণ', 'একটি-পূর্ণ-api-response-উদাহরণ'),
      code('php', 'header(\'Content-Type: application/json\');\n\n$users = getUsersFromDatabase();   // associative array-এর একটি array\n\necho json_encode([\n    \'success\' => true,\n    \'data\' => $users,\n]);'),
      h(2, 'Error Check করা', 'error-check-করা'),
      p('<p>অবৈধ JSON <code>json_decode()</code>-কে <code>null</code> return করায় — স্পষ্টভাবে check করার যোগ্য, কারণ একটি সত্যিকারের খালি result-ও falsy কিছুতে decode হয়।</p>'),
      code('php', '$data = json_decode($json);\nif (json_last_error() !== JSON_ERROR_NONE) {\n    die(\'Invalid JSON: \' . json_last_error_msg());\n}'),
      callout('note', '<p>প্রতিটি PHP মান পরিষ্কারভাবে convert হয় না — একটি resource (যেমন একটি খোলা file handle) JSON-এ একেবারেই represent করা যায় না, আর একটা encode করলে চুপচাপ একটি error-এর বদলে <code>0</code> তৈরি হয়।</p>', 'json_encode() যা করতে পারে না'),
    ],
  },
})

// ═══ 11. CURL REQUESTS ═════════════════════════════════════════════════════

lessons.push({
  slug: 'curl-requests', sortOrder: n++,
  en: {
    title: 'Making HTTP Requests with cURL',
    metaTitle: 'PHP cURL Requests | Learn Computer Academy',
    metaDescription: 'Calling another server\'s API from PHP with cURL — GET and POST requests, sending JSON, and reading the response.',
    blocks: [
      p('<p>A PHP script often needs to talk to another service — a payment provider, a weather API, a third-party service\'s data. <b>cURL</b> is PHP\'s built-in way to make that outgoing HTTP request.</p>'),
      h(2, 'A Basic GET Request'),
      code('php', '$ch = curl_init(\'https://api.example.com/users\');\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n\n$response = curl_exec($ch);\ncurl_close($ch);\n\n$data = json_decode($response, true);'),
      h(2, 'Common curl_setopt() Options'),
      table(['Option', 'What it does'], [
        ['CURLOPT_RETURNTRANSFER', 'Returns the response as a string instead of printing it directly'],
        ['CURLOPT_POST', 'Sends the request as POST instead of GET'],
        ['CURLOPT_POSTFIELDS', 'The data to send in a POST request'],
        ['CURLOPT_HTTPHEADER', 'An array of custom headers, like Content-Type or Authorization'],
        ['CURLOPT_TIMEOUT', 'Maximum seconds to wait before giving up'],
      ]),
      h(2, 'A POST Request, Sending JSON'),
      code('php', '$payload = json_encode([\'name\' => \'Sam\', \'email\' => \'sam@example.com\']);\n\n$ch = curl_init(\'https://api.example.com/users\');\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $payload);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n    \'Content-Type: application/json\',\n    \'Authorization: Bearer \' . $apiToken,\n]);\n\n$response = curl_exec($ch);\n$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);\ncurl_close($ch);'),
      h(2, 'Checking for a Connection Error'),
      p('<p>A network failure — a timeout, a DNS error — needs to be checked for separately from a bad HTTP status code.</p>'),
      code('php', 'if (curl_errno($ch)) {\n    echo \'cURL error: \' . curl_error($ch);\n} elseif ($statusCode !== 200) {\n    echo "Request failed with status $statusCode";\n}'),
      callout('tip', '<p>The Guzzle package (installed via Composer, from the earlier lesson) wraps cURL in a much friendlier API and is the standard choice for a real project — raw cURL is still worth understanding since it\'s what Guzzle itself uses underneath.</p>', 'Guzzle, for real projects'),
    ],
  },
  bn: {
    title: 'cURL দিয়ে HTTP Request করা',
    metaTitle: 'PHP cURL Request | Learn Computer Academy',
    metaDescription: 'cURL দিয়ে PHP থেকে অন্য একটি server-এর API call করা — GET আর POST request, JSON পাঠানো, আর response পড়া।',
    blocks: [
      p('<p>একটি PHP script-এর প্রায়ই অন্য একটি service-এর সাথে কথা বলা দরকার — একটি payment provider, একটি weather API, একটি third-party service-এর data। <b>cURL</b> সেই বাইরে যাওয়া HTTP request করার PHP-র built-in উপায়।</p>'),
      h(2, 'একটি মৌলিক GET Request', 'একটি-মৌলিক-get-request'),
      code('php', '$ch = curl_init(\'https://api.example.com/users\');\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n\n$response = curl_exec($ch);\ncurl_close($ch);\n\n$data = json_decode($response, true);'),
      h(2, 'সাধারণ curl_setopt() Option', 'সাধারণ-curl_setopt-option'),
      table(['Option', 'কী করে'], [
        ['CURLOPT_RETURNTRANSFER', 'সরাসরি print করার বদলে response-কে একটি string হিসেবে return করে'],
        ['CURLOPT_POST', 'GET-এর বদলে request POST হিসেবে পাঠায়'],
        ['CURLOPT_POSTFIELDS', 'একটি POST request-এ পাঠানোর data'],
        ['CURLOPT_HTTPHEADER', 'Content-Type বা Authorization-এর মতো custom header-এর একটি array'],
        ['CURLOPT_TIMEOUT', 'ছেড়ে দেওয়ার আগে সর্বোচ্চ কত সেকেন্ড অপেক্ষা করবে'],
      ]),
      h(2, 'একটি POST Request, JSON পাঠানো', 'একটি-post-request-json-পাঠানো'),
      code('php', '$payload = json_encode([\'name\' => \'Sam\', \'email\' => \'sam@example.com\']);\n\n$ch = curl_init(\'https://api.example.com/users\');\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $payload);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n    \'Content-Type: application/json\',\n    \'Authorization: Bearer \' . $apiToken,\n]);\n\n$response = curl_exec($ch);\n$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);\ncurl_close($ch);'),
      h(2, 'একটি Connection Error Check করা', 'একটি-connection-error-check-করা'),
      p('<p>একটি network failure — একটি timeout, একটি DNS error — একটি খারাপ HTTP status code থেকে আলাদাভাবে check করা দরকার।</p>'),
      code('php', 'if (curl_errno($ch)) {\n    echo \'cURL error: \' . curl_error($ch);\n} elseif ($statusCode !== 200) {\n    echo "Request failed with status $statusCode";\n}'),
      callout('tip', '<p>Guzzle package (আগের lesson থেকে Composer দিয়ে install করা) cURL-কে অনেক বেশি বন্ধুত্বপূর্ণ একটি API-তে wrap করে আর একটি আসল project-এর জন্য standard পছন্দ — raw cURL এখনো বোঝার যোগ্য কারণ Guzzle নিজেই ভেতরে এটা ব্যবহার করে।</p>', 'আসল project-এর জন্য Guzzle'),
    ],
  },
})

// ═══ 12. ENVIRONMENT VARIABLES ═════════════════════════════════════════════

lessons.push({
  slug: 'environment-variables', sortOrder: n++,
  en: {
    title: 'Environment Variables and Configuration',
    metaTitle: 'PHP Environment Variables | Learn Computer Academy',
    metaDescription: 'Keeping secrets and per-environment settings out of the codebase with environment variables and a .env file.',
    blocks: [
      p('<p>A database password, an API key, or a setting that differs between a local machine and a live server doesn\'t belong hardcoded in a PHP file — an <b>environment variable</b> keeps it outside the codebase entirely.</p>'),
      h(2, 'Reading an Environment Variable'),
      code('php', '$dbHost = getenv(\'DB_HOST\');\n$dbPassword = getenv(\'DB_PASSWORD\');\n\n// or, depending on server configuration:\n$dbHost = $_ENV[\'DB_HOST\'] ?? $_SERVER[\'DB_HOST\'];'),
      h(2, 'A .env File for Local Development'),
      p('<p>A plain text file, kept out of version control, listing key-value pairs — the standard way to set environment variables on a local machine without configuring the whole OS.</p>'),
      code('bash', '# .env\nDB_HOST=localhost\nDB_NAME=myapp\nDB_USER=root\nDB_PASSWORD=secret123\nAPI_KEY=sk_test_abc123'),
      h(2, 'Loading a .env File — vlucas/phpdotenv'),
      p('<p>PHP doesn\'t read <code>.env</code> files natively — the standard package for it, installed via Composer, loads the file\'s values into <code>getenv()</code>/<code>$_ENV</code>.</p>'),
      code('bash', 'composer require vlucas/phpdotenv'),
      code('php', 'require \'vendor/autoload.php\';\n\n$dotenv = Dotenv\\Dotenv::createImmutable(__DIR__);\n$dotenv->load();\n\necho getenv(\'DB_HOST\');   // localhost'),
      h(2, 'Never Commit .env'),
      code('bash', '# .gitignore\n.env'),
      callout('danger', '<p>A <code>.env</code> file committed to a public repository is one of the most common real-world causes of a leaked API key or database password — add it to <code>.gitignore</code> from the very first commit, not after the fact.</p>', 'The most important habit in this lesson'),
      h(2, 'A .env.example File'),
      p('<p>A version of the file with the keys but placeholder values, committed to the repo — shows every teammate what variables are needed, without exposing any real secret.</p>'),
      code('bash', '# .env.example — safe to commit\nDB_HOST=localhost\nDB_NAME=\nDB_USER=\nDB_PASSWORD=\nAPI_KEY='),
    ],
  },
  bn: {
    title: 'Environment Variable ও Configuration',
    metaTitle: 'PHP Environment Variable | Learn Computer Academy',
    metaDescription: 'Environment variable আর একটি .env file দিয়ে codebase-এর বাইরে secret আর per-environment setting রাখা।',
    blocks: [
      p('<p>একটি database password, একটি API key, বা একটি local machine আর একটি live server-এর মধ্যে ভিন্ন একটি setting একটি PHP file-এ hardcode থাকার যোগ্য না — একটি <b>environment variable</b> এটাকে সম্পূর্ণভাবে codebase-এর বাইরে রাখে।</p>'),
      h(2, 'একটি Environment Variable পড়া', 'একটি-environment-variable-পড়া'),
      code('php', '$dbHost = getenv(\'DB_HOST\');\n$dbPassword = getenv(\'DB_PASSWORD\');\n\n// অথবা, server configuration-এর উপর নির্ভর করে:\n$dbHost = $_ENV[\'DB_HOST\'] ?? $_SERVER[\'DB_HOST\'];'),
      h(2, 'Local Development-এর জন্য একটি .env File', 'local-development-এর-জন্য-একটি-env-file'),
      p('<p>Version control-এর বাইরে রাখা একটি plain text file, key-value pair list করা — পুরো OS configure না করেই একটি local machine-এ environment variable সেট করার standard উপায়।</p>'),
      code('bash', '# .env\nDB_HOST=localhost\nDB_NAME=myapp\nDB_USER=root\nDB_PASSWORD=secret123\nAPI_KEY=sk_test_abc123'),
      h(2, 'একটি .env File Load করা — vlucas/phpdotenv', 'একটি-env-file-load-করা-vlucasphpdotenv'),
      p('<p>PHP native ভাবে <code>.env</code> file পড়ে না — এর জন্য standard package, Composer দিয়ে install করা, file-এর মান <code>getenv()</code>/<code>$_ENV</code>-তে load করে।</p>'),
      code('bash', 'composer require vlucas/phpdotenv'),
      code('php', 'require \'vendor/autoload.php\';\n\n$dotenv = Dotenv\\Dotenv::createImmutable(__DIR__);\n$dotenv->load();\n\necho getenv(\'DB_HOST\');   // localhost'),
      h(2, 'কখনো .env Commit করবেন না', 'কখনো-env-commit-করবেন-না'),
      code('bash', '# .gitignore\n.env'),
      callout('danger', '<p>একটি public repository-তে commit করা একটি <code>.env</code> file একটি leak হওয়া API key বা database password-এর সবচেয়ে common real-world কারণগুলোর একটা — প্রথম commit থেকেই এটা <code>.gitignore</code>-এ যোগ করুন, পরে না।</p>', 'এই lesson-এর সবচেয়ে গুরুত্বপূর্ণ habit'),
      h(2, 'একটি .env.example File'),
      p('<p>Key সহ কিন্তু placeholder মান সহ file-এর একটি version, repo-তে commit করা — কোনো আসল secret expose না করে প্রতিটি teammate-কে কোন variable দরকার তা দেখায়।</p>'),
      code('bash', '# .env.example — commit করা নিরাপদ\nDB_HOST=localhost\nDB_NAME=\nDB_USER=\nDB_PASSWORD=\nAPI_KEY='),
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

  console.log(`\n✅ Done. ${lessons.length} lessons written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
