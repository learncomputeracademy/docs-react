#!/usr/bin/env node
// Extends the existing "SQL" category (16 lessons) with 6 more lessons
// covering real gaps found against a roadmap.sh "SQL" roadmap PDF the user
// shared 2026-09-03 — asked "are all the topics in this pdf regarding sql
// covered". Checked actual lesson content and headings, not keyword hits —
// e.g. sql/ddl covers CREATE/DROP/TRUNCATE/ALTER with PRIMARY KEY inline,
// but FOREIGN KEY/UNIQUE/NOT NULL/CHECK never appear anywhere; sql/joins
// covers only INNER/LEFT/RIGHT/FULL, never SELF or CROSS.
//
// 6 gaps found: data constraints beyond PRIMARY KEY, self/cross joins,
// conditional expressions (CASE/COALESCE/NULLIF), transactions'
// ACID/isolation-level concepts (TCL already covers the commands, never
// the theory), relational database concepts (RDBMS/NoSQL — intro-level,
// currently absent), and query optimization techniques (beyond-the-basics
// has a light EXPLAIN mention, not the fuller technique list). PIVOT/
// UNPIVOT and Dynamic SQL judged niche/vendor-specific (mostly T-SQL) and
// left out, same boundary pattern as every other gap batch this session.
//
// User picked "build all 6" over AskUserQuestion.
//
// Style: matches this category's own established per-topic pattern —
// heading, short intro paragraph, one or more SQL examples, a bullet-list
// summary, a "Common Mistake" warning callout, closing with an "At a
// Glance" table (see sql/tcl, sql/ddl, sql/beyond-the-basics). Bengali
// matches this category's script-transliteration convention, verified
// against sql/tcl bn.
//
// sort_order continues from 17 (existing max is 16).
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-sql-gap-content.mjs [--dry-run]

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
let n = 17

// ═══ 1. DATA CONSTRAINTS ═══════════════════════════════════════════════

lessons.push({
  slug: 'data-constraints', sortOrder: n++,
  en: {
    title: 'Data Constraints — FOREIGN KEY, UNIQUE, NOT NULL, CHECK',
    metaTitle: 'SQL Data Constraints | Learn Computer Academy',
    metaDescription: 'The rules a table enforces on its own data beyond PRIMARY KEY — a foreign key linking tables, uniqueness, required values, and custom conditions.',
    blocks: [
      p('<p>The earlier DDL lesson\'s <code>CREATE TABLE</code> examples used <b>PRIMARY KEY</b> to uniquely identify each row. Four more constraints enforce rules on the data itself — the database refuses any change that would break them, rather than trusting the application to check.</p>'),
      h(2, 'FOREIGN KEY — Linking Two Tables'),
      p('<p>Ensures a column\'s value must already exist as a primary key in another table — the mechanism that actually connects related tables together.</p>'),
      code('sql', 'CREATE TABLE orders (\n  id INT PRIMARY KEY,\n  customer_id INT,\n  FOREIGN KEY (customer_id) REFERENCES customers(id)\n);\n\n-- This INSERT fails if customer_id 99 doesn\'t exist in customers\nINSERT INTO orders (id, customer_id) VALUES (1, 99);'),
      p('<ul><li>Prevents an order from ever referencing a customer that doesn\'t exist.</li><li>Also blocks deleting a customer who still has orders, unless the table explicitly allows it (e.g. <code>ON DELETE CASCADE</code>).</li></ul>'),
      callout('warning', '<p>Forgetting a foreign key doesn\'t cause an immediate error — it just silently allows "orphaned" rows that reference nothing, discovered much later as confusing bugs.</p>', 'Common Mistake'),
      h(2, 'UNIQUE — No Duplicate Values'),
      code('sql', 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  email VARCHAR(255) UNIQUE\n);\n\n-- Fails on the second row — the email already exists\nINSERT INTO users (id, email) VALUES (1, \'sam@example.com\');\nINSERT INTO users (id, email) VALUES (2, \'sam@example.com\');'),
      p('<ul><li>Unlike PRIMARY KEY, a table can have several UNIQUE columns.</li><li>Unlike PRIMARY KEY, a UNIQUE column can allow one NULL value (behavior varies slightly by database).</li></ul>'),
      h(2, 'NOT NULL — A Value Is Required'),
      code('sql', 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  email VARCHAR(255) NOT NULL\n);\n\n-- Fails — email is required\nINSERT INTO users (id) VALUES (1);'),
      callout('warning', '<p>A column with no NOT NULL constraint silently accepts NULL — a very common source of "why is this field empty" bugs traced back to a missing constraint, not application logic.</p>', 'Common Mistake'),
      h(2, 'CHECK — A Custom Condition'),
      p('<p>Enforces any boolean condition on a column\'s value — the most flexible constraint.</p>'),
      code('sql', 'CREATE TABLE products (\n  id INT PRIMARY KEY,\n  price DECIMAL(10,2) CHECK (price > 0),\n  quantity INT CHECK (quantity >= 0)\n);\n\n-- Fails — price must be positive\nINSERT INTO products (id, price, quantity) VALUES (1, -10, 5);'),
      table(['Constraint', 'Enforces'], [
        ['PRIMARY KEY', 'Uniquely identifies each row, never NULL (covered in the earlier DDL lesson)'],
        ['FOREIGN KEY', 'A value must exist as a primary key in another table'],
        ['UNIQUE', 'No two rows share the same value in this column'],
        ['NOT NULL', 'A value is required — cannot be left empty'],
        ['CHECK', 'A custom condition the value must satisfy'],
      ]),
    ],
  },
  bn: {
    title: 'Data Constraint — FOREIGN KEY, UNIQUE, NOT NULL, CHECK',
    metaTitle: 'SQL Data Constraint | Learn Computer Academy',
    metaDescription: 'PRIMARY KEY-এর বাইরে একটা table তার নিজের data-তে যে নিয়ম প্রয়োগ করে — table জুড়ে দেওয়া একটা foreign key, uniqueness, দরকারি মান, আর custom শর্ত।',
    blocks: [
      p('<p>আগের DDL lesson-এর <code>CREATE TABLE</code> উদাহরণ প্রতিটা row-কে uniquely identify করতে <b>PRIMARY KEY</b> ব্যবহার করেছে। আরো চারটা constraint নিজের data-তে নিয়ম প্রয়োগ করে — এগুলো ভাঙে এমন যেকোনো পরিবর্তন database প্রত্যাখ্যান করে, application check করবে বলে বিশ্বাস করার বদলে।</p>'),
      h(2, 'FOREIGN KEY — দুটি Table জোড়া দেওয়া', 'foreign-key-দুটি-table-জোড়া-দেওয়া'),
      p('<p>নিশ্চিত করে একটা column-এর মান অন্য একটা table-এ ইতিমধ্যে একটা primary key হিসেবে থাকতে হবে — সম্পর্কিত table-গুলোকে আসলে সংযুক্ত করা mechanism এটাই।</p>'),
      code('sql', 'CREATE TABLE orders (\n  id INT PRIMARY KEY,\n  customer_id INT,\n  FOREIGN KEY (customer_id) REFERENCES customers(id)\n);\n\n-- customers-এ customer_id 99 না থাকলে এই INSERT fail করে\nINSERT INTO orders (id, customer_id) VALUES (1, 99);'),
      p('<ul><li>একটা order-কে কখনো নেই এমন একটা customer reference করা থেকে আটকায়।</li><li>একজন customer-কে delete করা আটকায় যার এখনো order আছে, table স্পষ্টভাবে অনুমতি না দিলে (যেমন <code>ON DELETE CASCADE</code>)।</li></ul>'),
      callout('warning', '<p>একটা foreign key ভুলে যাওয়া তাৎক্ষণিক error ঘটায় না — এটা চুপচাপ কিছুই reference না করা "orphaned" row অনুমতি দেয়, অনেক পরে confusing bug হিসেবে আবিষ্কৃত হয়।</p>', 'Common Mistake'),
      h(2, 'UNIQUE — কোনো Duplicate মান না', 'unique-কোনো-duplicate-মান-না'),
      code('sql', 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  email VARCHAR(255) UNIQUE\n);\n\n-- দ্বিতীয় row-এ fail করে — email ইতিমধ্যে আছে\nINSERT INTO users (id, email) VALUES (1, \'sam@example.com\');\nINSERT INTO users (id, email) VALUES (2, \'sam@example.com\');'),
      p('<ul><li>PRIMARY KEY-এর মতো না, একটা table-এ বেশ কয়েকটা UNIQUE column থাকতে পারে।</li><li>PRIMARY KEY-এর মতো না, একটা UNIQUE column একটা NULL মান অনুমতি দিতে পারে (database অনুযায়ী সামান্য ভিন্ন behavior)।</li></ul>'),
      h(2, 'NOT NULL — একটা মান দরকারি', 'not-null-একটা-মান-দরকারি'),
      code('sql', 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  email VARCHAR(255) NOT NULL\n);\n\n-- Fail করে — email দরকারি\nINSERT INTO users (id) VALUES (1);'),
      callout('warning', '<p>কোনো NOT NULL constraint নেই এমন একটা column চুপচাপ NULL accept করে — "কেন এই field খালি" bug-এর একটা খুব common source যা application logic-এ না, একটা missing constraint-এ ফিরে যায়।</p>', 'Common Mistake'),
      h(2, 'CHECK — একটা Custom শর্ত', 'check-একটা-custom-শর্ত'),
      p('<p>একটা column-এর মানে যেকোনো boolean শর্ত প্রয়োগ করে — সবচেয়ে flexible constraint।</p>'),
      code('sql', 'CREATE TABLE products (\n  id INT PRIMARY KEY,\n  price DECIMAL(10,2) CHECK (price > 0),\n  quantity INT CHECK (quantity >= 0)\n);\n\n-- Fail করে — price positive হতে হবে\nINSERT INTO products (id, price, quantity) VALUES (1, -10, 5);'),
      table(['Constraint', 'যা প্রয়োগ করে'], [
        ['PRIMARY KEY', 'প্রতিটা row uniquely identify করে, কখনো NULL না (আগের DDL lesson-এ কভার করা)'],
        ['FOREIGN KEY', 'একটা মান অন্য একটা table-এ primary key হিসেবে থাকতে হবে'],
        ['UNIQUE', 'কোনো দুটি row এই column-এ একই মান শেয়ার করে না'],
        ['NOT NULL', 'একটা মান দরকারি — খালি রাখা যায় না'],
        ['CHECK', 'মান-কে সন্তুষ্ট করতে হবে এমন একটা custom শর্ত'],
      ]),
    ],
  },
})

// ═══ 2. SELF & CROSS JOINS ═══════════════════════════════════════════════

lessons.push({
  slug: 'self-and-cross-joins', sortOrder: n++,
  en: {
    title: 'Self Join and Cross Join',
    metaTitle: 'SQL Self Join and Cross Join | Learn Computer Academy',
    metaDescription: 'Two more join types beyond INNER/LEFT/RIGHT/FULL — a table joined to itself, and every possible combination of two tables\' rows.',
    blocks: [
      p('<p>The earlier Joins lesson covered INNER, LEFT, RIGHT, and FULL — every one of them combining rows from two different tables. These last two joins are a bit different.</p>'),
      h(2, 'SELF JOIN — A Table Joined to Itself'),
      p('<p>Not a distinct join type in SQL syntax — any of the earlier joins (usually INNER or LEFT) used on a table paired with itself, under two different aliases. The classic use case: a table where one row references another row in the same table, like an employee referencing their manager.</p>'),
      code('sql', 'CREATE TABLE employees (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  manager_id INT\n);\n\nSELECT\n  e.name AS employee,\n  m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;'),
      p('<ul><li>The same table appears twice in the FROM/JOIN clauses, each with its own alias (<code>e</code> and <code>m</code> here).</li><li>LEFT JOIN, rather than INNER, keeps employees with no manager (like the CEO) in the results, with a NULL manager.</li></ul>'),
      callout('warning', '<p>Forgetting to alias the two copies of the table makes it impossible for the query to know which "id" or "name" is being referred to — this is the one join type where an alias isn\'t optional.</p>', 'Common Mistake'),
      h(2, 'CROSS JOIN — Every Combination'),
      p('<p>Combines every row in one table with every row in another — no matching condition at all. A table of 3 rows CROSS JOINed with a table of 4 rows produces 12 rows.</p>'),
      code('sql', 'SELECT sizes.size, colors.color\nFROM sizes\nCROSS JOIN colors;\n-- If sizes has S/M/L and colors has Red/Blue,\n-- this produces all 6 combinations: S-Red, S-Blue, M-Red, M-Blue, L-Red, L-Blue'),
      p('<ul><li>Genuinely useful for generating every combination — a product\'s size/color variants, a calendar of every date times every store location.</li><li>On two large tables, the row count multiplies fast — a CROSS JOIN on two 10,000-row tables produces 100 million rows.</li></ul>'),
      table(['Join type', 'Rows produced'], [
        ['SELF JOIN', 'A regular join (INNER/LEFT/etc.), just on the same table twice'],
        ['CROSS JOIN', 'Every row × every row — no matching condition'],
      ]),
    ],
  },
  bn: {
    title: 'Self Join ও Cross Join',
    metaTitle: 'SQL Self Join ও Cross Join | Learn Computer Academy',
    metaDescription: 'INNER/LEFT/RIGHT/FULL-এর বাইরে আরো দুটি join type — নিজের সাথে জোড়া লাগানো একটা table, আর দুটি table-এর row-এর প্রতিটা সম্ভাব্য combination।',
    blocks: [
      p('<p>আগের Joins lesson INNER, LEFT, RIGHT, আর FULL কভার করেছে — এদের প্রতিটাই দুটি ভিন্ন table থেকে row একসাথে করে। এই শেষ দুটি join একটু ভিন্ন।</p>'),
      h(2, 'SELF JOIN — নিজের সাথে জোড়া লাগানো একটা Table', 'self-join-নিজের-সাথে-জোড়া-লাগানো-একটা-table'),
      p('<p>SQL সিনট্যাক্সে আলাদা একটা join type না — আগের যেকোনো join (সাধারণত INNER বা LEFT) দুটি ভিন্ন alias-এর অধীনে নিজের সাথে জোড়া লাগানো একটা table-এ ব্যবহৃত। ক্লাসিক use case: একটা table যেখানে একটা row একই table-এর আরেকটা row reference করে, যেমন একজন employee তাদের manager-কে reference করে।</p>'),
      code('sql', 'CREATE TABLE employees (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  manager_id INT\n);\n\nSELECT\n  e.name AS employee,\n  m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;'),
      p('<ul><li>একই table FROM/JOIN clause-এ দুবার দেখা যায়, প্রতিটার নিজের alias সহ (এখানে <code>e</code> আর <code>m</code>)।</li><li>INNER-এর বদলে LEFT JOIN কোনো manager নেই এমন employee-দের (CEO-র মতো) ফলাফলে রাখে, একটা NULL manager সহ।</li></ul>'),
      callout('warning', '<p>Table-এর দুটি কপি alias করতে ভুলে গেলে query-র জন্য কোন "id" বা "name"-এর কথা বলা হচ্ছে তা জানা অসম্ভব হয়ে যায় — এটাই একমাত্র join type যেখানে একটা alias optional না।</p>', 'Common Mistake'),
      h(2, 'CROSS JOIN — প্রতিটা Combination', 'cross-join-প্রতিটা-combination'),
      p('<p>একটা table-এর প্রতিটা row অন্য একটা table-এর প্রতিটা row-এর সাথে একসাথে করে — কোনো matching শর্ত ছাড়াই। ৩ row-এর একটা table ৪ row-এর একটা table-এর সাথে CROSS JOIN করলে ১২টা row তৈরি হয়।</p>'),
      code('sql', 'SELECT sizes.size, colors.color\nFROM sizes\nCROSS JOIN colors;\n-- sizes-এ S/M/L আর colors-এ Red/Blue থাকলে,\n-- এটা সব ৬টা combination তৈরি করে: S-Red, S-Blue, M-Red, M-Blue, L-Red, L-Blue'),
      p('<ul><li>প্রতিটা combination তৈরি করার জন্য সত্যিকারভাবে useful — একটা product-এর size/color variant, প্রতিটা date আর প্রতিটা store location-এর একটা calendar।</li><li>দুটি বড় table-এ, row সংখ্যা দ্রুত গুণ হয় — দুটি ১০,০০০-row table-এ একটা CROSS JOIN ১০ কোটি row তৈরি করে।</li></ul>'),
      table(['Join type', 'যে row তৈরি হয়'], [
        ['SELF JOIN', 'একটা সাধারণ join (INNER/LEFT/ইত্যাদি), শুধু একই table-এ দুবার'],
        ['CROSS JOIN', 'প্রতিটা row × প্রতিটা row — কোনো matching শর্ত নেই'],
      ]),
    ],
  },
})

// ═══ 3. CONDITIONAL EXPRESSIONS ═══════════════════════════════════════════

lessons.push({
  slug: 'conditional-expressions', sortOrder: n++,
  en: {
    title: 'Conditional Expressions — CASE, COALESCE, NULLIF',
    metaTitle: 'SQL Conditional Expressions | Learn Computer Academy',
    metaDescription: 'Branching logic inside a query — CASE for if/else-style output, COALESCE for a NULL fallback, and NULLIF to turn a specific value into NULL.',
    blocks: [
      p('<p>Some values need to change shape based on a condition, right inside the query, without a separate step in application code afterward. These three expressions cover nearly every case that comes up.</p>'),
      h(2, 'CASE — If/Else Logic in a Query'),
      p('<p>Evaluates conditions in order and returns the value tied to the first one that matches, falling back to ELSE if none do.</p>'),
      code('sql', 'SELECT\n  name,\n  price,\n  CASE\n    WHEN price < 10 THEN \'Budget\'\n    WHEN price < 50 THEN \'Mid-range\'\n    ELSE \'Premium\'\n  END AS price_tier\nFROM products;'),
      p('<ul><li>Conditions are checked top to bottom — the first matching WHEN wins, later ones are never checked.</li><li>ELSE is optional — without it, a row matching no condition gets NULL.</li></ul>'),
      callout('warning', '<p>Conditions that overlap can silently return the wrong branch — a common mistake is ordering price ranges so a later, more specific condition never gets reached because an earlier, broader one already matched.</p>', 'Common Mistake'),
      h(2, 'COALESCE — The First Non-NULL Value'),
      p('<p>Takes any number of arguments and returns the first one that isn\'t NULL — most often used to substitute a default when a value is missing.</p>'),
      code('sql', 'SELECT\n  name,\n  COALESCE(nickname, name) AS display_name\nFROM users;\n-- Shows the nickname if one exists, otherwise falls back to the real name'),
      code('sql', '-- Works with more than two arguments too, tried in order\nSELECT COALESCE(phone_mobile, phone_home, phone_work, \'No phone on file\')\nFROM contacts;'),
      h(2, 'NULLIF — Turn a Specific Value Into NULL'),
      p('<p>The reverse idea — compares two values, and returns NULL if they\'re equal, or the first value otherwise. Most commonly used to avoid a divide-by-zero error.</p>'),
      code('sql', 'SELECT\n  total_revenue / NULLIF(total_orders, 0) AS avg_order_value\nFROM sales_summary;\n-- If total_orders is 0, NULLIF returns NULL instead of 0,\n-- and dividing by NULL gives NULL instead of a divide-by-zero error'),
      table(['Expression', 'Purpose'], [
        ['CASE', 'Multi-branch conditional logic — an if/elseif/else for a query'],
        ['COALESCE(a, b, c, ...)', 'Returns the first non-NULL argument — a default value fallback'],
        ['NULLIF(a, b)', 'Returns NULL if a equals b, otherwise returns a — often used to prevent divide-by-zero'],
      ]),
    ],
  },
  bn: {
    title: 'Conditional Expression — CASE, COALESCE, NULLIF',
    metaTitle: 'SQL Conditional Expression | Learn Computer Academy',
    metaDescription: 'একটা query-র ভেতরে branching logic — if/else-style output-এর জন্য CASE, একটা NULL fallback-এর জন্য COALESCE, আর একটা নির্দিষ্ট মানকে NULL বানাতে NULLIF।',
    blocks: [
      p('<p>কিছু মানের পরে application code-এ একটা আলাদা step ছাড়াই, ঠিক query-র ভেতরে একটা শর্তের উপর ভিত্তি করে আকার বদলানো দরকার। এই তিনটা expression প্রায় প্রতিটা আসা case কভার করে।</p>'),
      h(2, 'CASE — একটা Query-তে If/Else Logic', 'case-একটা-query-তে-ifelse-logic'),
      p('<p>ক্রমানুসারে শর্ত evaluate করে আর প্রথম মিলে যাওয়াটার সাথে যুক্ত মান return করে, কোনোটা না মিললে ELSE-এ ফিরে যায়।</p>'),
      code('sql', 'SELECT\n  name,\n  price,\n  CASE\n    WHEN price < 10 THEN \'Budget\'\n    WHEN price < 50 THEN \'Mid-range\'\n    ELSE \'Premium\'\n  END AS price_tier\nFROM products;'),
      p('<ul><li>শর্ত উপর থেকে নিচে check হয় — প্রথম মিলে যাওয়া WHEN জেতে, পরেরগুলো কখনো check হয় না।</li><li>ELSE optional — এটা ছাড়া, কোনো শর্তে না মেলা একটা row NULL পায়।</li></ul>'),
      callout('warning', '<p>Overlap করা শর্ত চুপচাপ ভুল branch return করতে পারে — একটা common ভুল price range এমনভাবে সাজানো যে একটা আগের, বেশি broad শর্ত ইতিমধ্যে মিলে যাওয়ায় পরের, বেশি specific একটা শর্তে কখনো পৌঁছানো যায় না।</p>', 'Common Mistake'),
      h(2, 'COALESCE — প্রথম Non-NULL মান', 'coalesce-প্রথম-non-null-মান'),
      p('<p>যেকোনো সংখ্যক argument নেয় আর NULL না এমন প্রথমটা return করে — একটা মান না থাকলে একটা default substitute করতে প্রায়ই ব্যবহৃত।</p>'),
      code('sql', 'SELECT\n  name,\n  COALESCE(nickname, name) AS display_name\nFROM users;\n-- একটা nickname থাকলে দেখায়, না হলে আসল নামে ফিরে যায়'),
      code('sql', '-- দুটির বেশি argument-এর সাথেও কাজ করে, ক্রমানুসারে চেষ্টা করা\nSELECT COALESCE(phone_mobile, phone_home, phone_work, \'No phone on file\')\nFROM contacts;'),
      h(2, 'NULLIF — একটা নির্দিষ্ট মানকে NULL বানানো', 'nullif-একটা-নির্দিষ্ট-মানকে-null-বানানো'),
      p('<p>বিপরীত ধারণা — দুটি মান তুলনা করে, সমান হলে NULL return করে, না হলে প্রথম মান। সবচেয়ে বেশি divide-by-zero error এড়াতে ব্যবহৃত।</p>'),
      code('sql', 'SELECT\n  total_revenue / NULLIF(total_orders, 0) AS avg_order_value\nFROM sales_summary;\n-- total_orders 0 হলে, NULLIF 0-এর বদলে NULL return করে,\n-- আর NULL দিয়ে ভাগ করলে divide-by-zero error-এর বদলে NULL পাওয়া যায়'),
      table(['Expression', 'উদ্দেশ্য'], [
        ['CASE', 'Multi-branch conditional logic — একটা query-র জন্য if/elseif/else'],
        ['COALESCE(a, b, c, ...)', 'প্রথম non-NULL argument return করে — একটা default মান fallback'],
        ['NULLIF(a, b)', 'a আর b সমান হলে NULL return করে, না হলে a return করে — প্রায়ই divide-by-zero আটকাতে ব্যবহৃত'],
      ]),
    ],
  },
})

// ═══ 4. TRANSACTIONS, ACID & ISOLATION LEVELS ═════════════════════════════

lessons.push({
  slug: 'transactions-acid-and-isolation-levels', sortOrder: n++,
  en: {
    title: 'Transactions — ACID Properties and Isolation Levels',
    metaTitle: 'SQL Transactions — ACID and Isolation Levels | Learn Computer Academy',
    metaDescription: 'The theory behind BEGIN/COMMIT/ROLLBACK from the earlier TCL lesson — the four ACID guarantees, and how isolation levels trade consistency for speed.',
    blocks: [
      p('<p>The earlier TCL lesson covered the commands — BEGIN, COMMIT, ROLLBACK, SAVEPOINT. This lesson covers what those commands are actually guaranteeing, and why a database offers several different levels of that guarantee.</p>'),
      h(2, 'Starting a Transaction'),
      code('sql', 'BEGIN;\n\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\n\nCOMMIT;'),
      p('<p>Both updates succeed together, or neither does — this money-transfer example is the classic illustration of why transactions exist.</p>'),
      h(2, 'The Four ACID Guarantees'),
      table(['Guarantee', 'What it means'], [
        ['Atomicity', 'A transaction\'s changes all happen, or none of them do — no partial transfer where money leaves one account but never arrives at the other'],
        ['Consistency', 'A transaction can only move the database from one valid state to another — every constraint (from the earlier lesson) still holds afterward'],
        ['Isolation', 'Concurrent transactions don\'t see each other\'s uncommitted changes — covered in depth below'],
        ['Durability', 'Once committed, a change survives — even a server crash immediately after doesn\'t lose it'],
      ]),
      h(2, 'The Problem Isolation Solves'),
      p('<p>Multiple transactions often run at the same time. Without isolation, one transaction could read another\'s half-finished changes — a "dirty read" — and make a decision based on data that\'s about to be rolled back.</p>'),
      h(2, 'The Four Isolation Levels'),
      table(['Level', 'Prevents', 'Trade-off'], [
        ['Read Uncommitted', 'Nothing — dirty reads are possible', 'Fastest, least safe'],
        ['Read Committed', 'Dirty reads', 'The default in most databases (e.g. PostgreSQL, SQL Server)'],
        ['Repeatable Read', 'Dirty reads + non-repeatable reads (a row changing mid-transaction)', 'MySQL\'s default'],
        ['Serializable', 'Every concurrency issue — transactions behave as if run one at a time', 'Safest, slowest'],
      ]),
      code('sql', 'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nBEGIN;\n-- ... queries here run with the strictest isolation ...\nCOMMIT;'),
      callout('warning', '<p>A higher isolation level isn\'t automatically the right choice — Serializable can cause more transactions to fail and need retrying under heavy concurrent load. Most applications are well-served by the database\'s default.</p>', 'Common Mistake'),
    ],
  },
  bn: {
    title: 'Transaction — ACID Property ও Isolation Level',
    metaTitle: 'SQL Transaction — ACID ও Isolation Level | Learn Computer Academy',
    metaDescription: 'আগের TCL lesson থেকে BEGIN/COMMIT/ROLLBACK-এর পেছনের theory — চারটা ACID গ্যারান্টি, আর isolation level কীভাবে speed-এর জন্য consistency trade করে।',
    blocks: [
      p('<p>আগের TCL lesson command কভার করেছে — BEGIN, COMMIT, ROLLBACK, SAVEPOINT। এই lesson কভার করে সেই command-গুলো আসলে কী গ্যারান্টি দেয়, আর কেন একটা database সেই গ্যারান্টির কয়েকটা ভিন্ন level দেয়।</p>'),
      h(2, 'একটা Transaction শুরু করা', 'একটা-transaction-শুরু-করা'),
      code('sql', 'BEGIN;\n\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\n\nCOMMIT;'),
      p('<p>দুটি update একসাথে সফল হয়, বা কোনোটাই না — এই money-transfer উদাহরণ কেন transaction আছে তার ক্লাসিক illustration।</p>'),
      h(2, 'চারটা ACID গ্যারান্টি', 'চারটা-acid-গ্যারান্টি'),
      table(['গ্যারান্টি', 'এর মানে কী'], [
        ['Atomicity', 'একটা transaction-এর পরিবর্তন সবগুলো ঘটে, বা কোনোটাই না — টাকা একটা account থেকে বের হয়ে অন্যটাতে কখনো না পৌঁছানো আংশিক transfer না'],
        ['Consistency', 'একটা transaction database-কে শুধু একটা বৈধ state থেকে আরেকটাতে move করতে পারে — এরপরও প্রতিটা constraint (আগের lesson থেকে) টিকে থাকে'],
        ['Isolation', 'Concurrent transaction একে অপরের uncommitted পরিবর্তন দেখে না — নিচে বিস্তারিত কভার করা'],
        ['Durability', 'একবার commit হলে, একটা পরিবর্তন টিকে থাকে — এমনকি তার ঠিক পরে একটা server crash-ও এটা হারায় না'],
      ]),
      h(2, 'Isolation যে সমস্যা সমাধান করে', 'isolation-যে-সমস্যা-সমাধান-করে'),
      p('<p>একাধিক transaction প্রায়ই একই সময়ে চলে। Isolation ছাড়া, একটা transaction আরেকটার অর্ধেক-শেষ পরিবর্তন পড়তে পারত — একটা "dirty read" — আর rollback হতে যাওয়া data-র ভিত্তিতে একটা সিদ্ধান্ত নিতে পারত।</p>'),
      h(2, 'চারটা Isolation Level', 'চারটা-isolation-level'),
      table(['Level', 'যা আটকায়', 'Trade-off'], [
        ['Read Uncommitted', 'কিছুই না — dirty read সম্ভব', 'সবচেয়ে দ্রুত, সবচেয়ে কম নিরাপদ'],
        ['Read Committed', 'Dirty read', 'বেশিরভাগ database-এ default (যেমন PostgreSQL, SQL Server)'],
        ['Repeatable Read', 'Dirty read + non-repeatable read (transaction-এর মাঝে একটা row বদলে যাওয়া)', 'MySQL-এর default'],
        ['Serializable', 'প্রতিটা concurrency সমস্যা — transaction একবারে একটা করে চলার মতো behave করে', 'সবচেয়ে নিরাপদ, সবচেয়ে ধীর'],
      ]),
      code('sql', 'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nBEGIN;\n-- ... এখানে query সবচেয়ে কড়া isolation-এ চলে ...\nCOMMIT;'),
      callout('warning', '<p>একটা উচ্চতর isolation level স্বয়ংক্রিয়ভাবে সঠিক পছন্দ না — Serializable ভারী concurrent load-এ বেশি transaction fail আর retry দরকার হতে পারে। বেশিরভাগ application database-এর default দিয়ে ভালোভাবে কাজ চলে।</p>', 'Common Mistake'),
    ],
  },
})

// ═══ 5. RELATIONAL DATABASE CONCEPTS ══════════════════════════════════════

lessons.push({
  slug: 'relational-database-concepts', sortOrder: n++,
  en: {
    title: 'Relational Databases — Concepts and SQL vs. NoSQL',
    metaTitle: 'Relational Databases and SQL vs. NoSQL | Learn Computer Academy',
    metaDescription: 'What actually makes a database "relational," the real benefits and limitations of that model, and how it compares to a NoSQL database.',
    blocks: [
      p('<p>Every earlier lesson in this course used a relational database without stopping to define what that word means. This lesson is the conceptual grounding — worth reading even after the syntax is comfortable.</p>'),
      h(2, 'What Makes a Database "Relational"'),
      p('<p>Data is organized into tables (formally called <b>relations</b>), each with a fixed set of columns, and rows related to each other through shared keys — the foreign keys from the earlier Data Constraints lesson are exactly this relationship mechanism in practice.</p>'),
      h(2, 'RDBMS — What the Acronym Means'),
      p('<p>A <b>Relational Database Management System</b> is the software that stores, organizes, and lets a program query relational data — PostgreSQL, MySQL, SQL Server, and Oracle Database are all RDBMSes; SQL is the language nearly all of them use.</p>'),
      h(2, 'The Real Benefits'),
      table(['Benefit', 'Why it matters'], [
        ['Data integrity', 'Constraints (PRIMARY KEY, FOREIGN KEY, CHECK) enforce correctness at the database level, not just in application code'],
        ['No duplicate data', 'Normalization (organizing data to avoid repeating the same information in multiple places) keeps updates consistent'],
        ['A standard query language', 'SQL is broadly transferable between different RDBMSes, unlike most NoSQL query APIs'],
        ['Strong consistency', 'A transaction\'s ACID guarantees (from the earlier lesson) make the data trustworthy under concurrent use'],
      ]),
      h(2, 'The Real Limitations'),
      table(['Limitation', 'Why it matters'], [
        ['A fixed schema', 'Every row in a table must fit the same column structure — awkward for data that\'s naturally irregular'],
        ['Harder to scale horizontally', 'Splitting a relational database across many servers while keeping joins fast is a genuinely hard problem'],
        ['Joins get expensive', 'A query touching many related tables can slow down significantly as data grows, without careful indexing'],
      ]),
      h(2, 'SQL vs. NoSQL'),
      p('<p>A <b>NoSQL</b> database (MongoDB, Redis, Cassandra, and others) trades some of the relational model\'s guarantees for flexibility and easier horizontal scaling — commonly storing documents, key-value pairs, or graphs instead of fixed-schema tables.</p>'),
      table(['Question', 'Favors SQL', 'Favors NoSQL'], [
        ['Does the data have a clear, stable structure?', 'Yes', 'No — it varies row to row'],
        ['Do relationships between records matter a lot?', 'Yes — joins are a core tool', 'Less — data is often self-contained per document'],
        ['Is strict consistency (ACID) critical?', 'Yes — banking, inventory, anything money-related', 'Sometimes acceptable to relax for speed/scale'],
        ['Does it need to scale to huge, distributed volume?', 'Harder, though modern RDBMSes have improved this', 'Often designed for this from the start'],
      ]),
      callout('note', '<p>This site\'s MongoDB course covers the NoSQL side of this comparison in depth — worth a look once the relational model here feels solid, to see the same problems solved a genuinely different way.</p>', 'Where to go next'),
    ],
  },
  bn: {
    title: 'Relational Database — ধারণা ও SQL বনাম NoSQL',
    metaTitle: 'Relational Database ও SQL বনাম NoSQL | Learn Computer Academy',
    metaDescription: 'একটা database আসলে কী "relational" বানায়, সেই model-এর আসল সুবিধা আর সীমাবদ্ধতা, আর এটা একটা NoSQL database-এর সাথে কীভাবে তুলনীয়।',
    blocks: [
      p('<p>এই কোর্সের আগের প্রতিটা lesson সেই শব্দের মানে define না করেই একটা relational database ব্যবহার করেছে। এই lesson conceptual ভিত্তি — সিনট্যাক্স স্বাচ্ছন্দ্য হয়ে গেলেও পড়ার যোগ্য।</p>'),
      h(2, 'কী একটা Database-কে "Relational" বানায়', 'কী-একটা-database-কে-relational-বানায়'),
      p('<p>Data table-এ organize হয় (আনুষ্ঠানিকভাবে <b>relation</b> বলা হয়), প্রতিটার column-এর একটা fixed set আছে, আর row একে অপরের সাথে শেয়ার করা key দিয়ে সম্পর্কিত — আগের Data Constraints lesson-এর foreign key ঠিক এই সম্পর্ক mechanism-ই বাস্তবে।</p>'),
      h(2, 'RDBMS — Acronym-এর মানে', 'rdbms-acronym-এর-মানে'),
      p('<p>একটা <b>Relational Database Management System</b> হলো সেই software যা relational data সংরক্ষণ, organize, আর একটা program-কে query করতে দেয় — PostgreSQL, MySQL, SQL Server, আর Oracle Database সবই RDBMS; SQL প্রায় সবগুলোই ব্যবহার করা ভাষা।</p>'),
      h(2, 'আসল সুবিধা', 'আসল-সুবিধা'),
      table(['সুবিধা', 'কেন এটা গুরুত্বপূর্ণ'], [
        ['Data integrity', 'Constraint (PRIMARY KEY, FOREIGN KEY, CHECK) শুধু application code-এ না, database level-এ correctness প্রয়োগ করে'],
        ['Duplicate data নেই', 'Normalization (একই তথ্য একাধিক জায়গায় repeat করা এড়াতে data organize করা) update-কে consistent রাখে'],
        ['একটা standard query language', 'SQL ভিন্ন RDBMS-এর মধ্যে ব্যাপকভাবে transferable, বেশিরভাগ NoSQL query API-র মতো না'],
        ['শক্তিশালী consistency', 'আগের lesson থেকে একটা transaction-এর ACID গ্যারান্টি concurrent use-এ data-কে বিশ্বাসযোগ্য বানায়'],
      ]),
      h(2, 'আসল সীমাবদ্ধতা', 'আসল-সীমাবদ্ধতা'),
      table(['সীমাবদ্ধতা', 'কেন এটা গুরুত্বপূর্ণ'], [
        ['একটা fixed schema', 'একটা table-এর প্রতিটা row একই column structure-এ ফিট করতে হবে — স্বাভাবিকভাবে অনিয়মিত data-র জন্য বিশ্রী'],
        ['Horizontally scale করা কঠিন', 'join দ্রুত রেখে অনেক server জুড়ে একটা relational database ভাগ করা সত্যিকারভাবে কঠিন একটা সমস্যা'],
        ['Join খরচবহুল হয়ে যায়', 'অনেক সম্পর্কিত table স্পর্শ করা একটা query সাবধান indexing ছাড়া data বাড়ার সাথে সাথে অনেক ধীর হয়ে যেতে পারে'],
      ]),
      h(2, 'SQL বনাম NoSQL', 'sql-বনাম-nosql'),
      p('<p>একটা <b>NoSQL</b> database (MongoDB, Redis, Cassandra, আর অন্যান্য) flexibility আর সহজ horizontal scaling-এর জন্য relational model-এর কিছু গ্যারান্টি trade করে — সাধারণত fixed-schema table-এর বদলে document, key-value pair, বা graph সংরক্ষণ করে।</p>'),
      table(['প্রশ্ন', 'SQL-কে সমর্থন করে', 'NoSQL-কে সমর্থন করে'], [
        ['Data-র কি স্পষ্ট, স্থির structure আছে?', 'হ্যাঁ', 'না — এটা row থেকে row ভিন্ন'],
        ['Record-এর মধ্যে সম্পর্ক কি অনেক গুরুত্বপূর্ণ?', 'হ্যাঁ — join একটা মূল tool', 'কম — data প্রায়ই প্রতি document self-contained'],
        ['কঠোর consistency (ACID) কি critical?', 'হ্যাঁ — banking, inventory, টাকা-সম্পর্কিত যেকোনো কিছু', 'কখনো speed/scale-এর জন্য relax করা গ্রহণযোগ্য'],
        ['এটা কি বিশাল, distributed volume-এ scale করা দরকার?', 'কঠিন, যদিও modern RDBMS এটা উন্নত করেছে', 'প্রায়ই শুরু থেকেই এর জন্য design করা'],
      ]),
      callout('note', '<p>এই সাইটের MongoDB কোর্স এই তুলনার NoSQL দিকটা গভীরভাবে কভার করে — এখানের relational model শক্ত মনে হলে একবার দেখার যোগ্য, একই সমস্যা সত্যিকারভাবে ভিন্ন উপায়ে সমাধান করা দেখতে।</p>', 'এরপর কোথায় যাবেন'),
    ],
  },
})

// ═══ 6. QUERY OPTIMIZATION TECHNIQUES ═════════════════════════════════════

lessons.push({
  slug: 'query-optimization-techniques', sortOrder: n++,
  en: {
    title: 'Query Optimization Techniques',
    metaTitle: 'SQL Query Optimization Techniques | Learn Computer Academy',
    metaDescription: 'Practical habits that make a slow query fast — reading an EXPLAIN plan, indexing what actually gets filtered on, and rewriting subqueries as joins.',
    blocks: [
      p('<p>The earlier Beyond the Basics lesson introduced <code>EXPLAIN</code> and indexes briefly. This lesson is a fuller, practical set of techniques for actually making a slow query fast.</p>'),
      h(2, 'Reading an EXPLAIN Plan'),
      p('<p><code>EXPLAIN</code> shows how the database actually plans to run a query — which indexes it\'ll use, in what order it\'ll touch each table, and roughly how many rows it expects at each step.</p>'),
      code('sql', 'EXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n\n-- A "Seq Scan" (sequential scan) means it\'s reading every row —\n-- usually a sign a useful index is missing on customer_id\n-- An "Index Scan" means it found and used an index — the goal'),
      h(2, 'Indexing the Right Columns'),
      p('<p>An index speeds up finding rows by a column\'s value, at the cost of some extra storage and slightly slower writes. The columns worth indexing are the ones actually used to filter or join — not every column.</p>'),
      code('sql', '-- If this WHERE clause runs constantly and is slow, this index likely helps:\nCREATE INDEX idx_orders_customer_id ON orders(customer_id);\n\nSELECT * FROM orders WHERE customer_id = 42;'),
      callout('warning', '<p>Indexing every column "just in case" backfires — each index slows down every INSERT/UPDATE/DELETE on that table, since the index itself needs updating too. Index what queries actually filter or join on, not everything.</p>', 'Common Mistake'),
      h(2, 'Optimizing Joins'),
      p('<ul><li>Join on indexed columns — an unindexed join column forces the database to scan one side of the join row by row.</li><li>Filter before joining where possible — a WHERE clause that reduces one table\'s rows before the join means less data to combine.</li><li>Join only the tables actually needed — an unnecessary JOIN still costs work even if its columns are never selected.</li></ul>'),
      h(2, 'Reducing Subqueries'),
      p('<p>A subquery re-run for every row of the outer query (a correlated subquery, from the earlier Subqueries lesson) can often be rewritten as a JOIN, which the database can usually plan more efficiently.</p>'),
      code('sql', '-- Slower — the subquery runs once per row of products\nSELECT name FROM products p\nWHERE (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.id) > 0;\n\n-- Often faster — rewritten as a join\nSELECT DISTINCT p.name\nFROM products p\nJOIN order_items oi ON oi.product_id = p.id;'),
      h(2, 'Selective Projection — Don\'t SELECT *'),
      p('<p>Requesting only the columns actually needed, instead of every column, reduces the data the database has to read and send — a small habit that adds up significantly on a large table.</p>'),
      code('sql', '-- Wasteful if only the name is needed\nSELECT * FROM products WHERE category = \'electronics\';\n\n-- Better\nSELECT name FROM products WHERE category = \'electronics\';'),
      table(['Technique', 'What it saves'], [
        ['Index the right columns', 'Avoids scanning every row to find a match'],
        ['Join on indexed columns', 'Avoids a row-by-row scan on one side of a join'],
        ['Filter before joining', 'Reduces how much data gets combined'],
        ['Rewrite correlated subqueries as joins', 'Avoids re-running the same subquery once per outer row'],
        ['Select only needed columns', 'Reduces data read and transferred'],
      ]),
    ],
  },
  bn: {
    title: 'Query Optimization Technique',
    metaTitle: 'SQL Query Optimization Technique | Learn Computer Academy',
    metaDescription: 'একটা ধীর query-কে দ্রুত বানানো practical habit — একটা EXPLAIN plan পড়া, আসলে filter হওয়া জিনিস index করা, আর subquery-কে join হিসেবে পুনর্লিখন করা।',
    blocks: [
      p('<p>আগের Beyond the Basics lesson সংক্ষেপে <code>EXPLAIN</code> আর index পরিচয় করিয়েছে। এই lesson একটা ধীর query-কে আসলে দ্রুত বানানোর জন্য একটা পূর্ণ, practical technique-এর সেট।</p>'),
      h(2, 'একটা EXPLAIN Plan পড়া', 'একটা-explain-plan-পড়া'),
      p('<p><code>EXPLAIN</code> দেখায় database আসলে একটা query কীভাবে চালানোর পরিকল্পনা করে — এটা কোন index ব্যবহার করবে, কোন ক্রমে প্রতিটা table স্পর্শ করবে, আর প্রতিটা step-এ মোটামুটি কতগুলো row আশা করে।</p>'),
      code('sql', 'EXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n\n-- একটা "Seq Scan" (sequential scan) মানে এটা প্রতিটা row পড়ছে —\n-- সাধারণত customer_id-তে একটা useful index নেই এমন একটা চিহ্ন\n-- একটা "Index Scan" মানে এটা একটা index খুঁজে ব্যবহার করেছে — লক্ষ্য'),
      h(2, 'সঠিক Column Index করা', 'সঠিক-column-index-করা'),
      p('<p>একটা index একটা column-এর মান দিয়ে row খুঁজে বের করা দ্রুত করে, কিছু অতিরিক্ত storage আর সামান্য ধীর write-এর খরচে। Index করার যোগ্য column সেগুলো যা আসলে filter বা join করতে ব্যবহৃত হয় — প্রতিটা column না।</p>'),
      code('sql', '-- এই WHERE clause ক্রমাগত চললে আর ধীর হলে, এই index সম্ভবত সাহায্য করে:\nCREATE INDEX idx_orders_customer_id ON orders(customer_id);\n\nSELECT * FROM orders WHERE customer_id = 42;'),
      callout('warning', '<p>"just in case" প্রতিটা column index করা backfire করে — প্রতিটা index সেই table-এর প্রতিটা INSERT/UPDATE/DELETE ধীর করে, কারণ index নিজেও আপডেট করা দরকার। Query আসলে যা filter বা join করে তা index করুন, সবকিছু না।</p>', 'Common Mistake'),
      h(2, 'Join Optimize করা', 'join-optimize-করা'),
      p('<ul><li>Indexed column-এ join করুন — একটা unindexed join column database-কে join-এর একদিক row ধরে ধরে scan করতে বাধ্য করে।</li><li>যেখানে সম্ভব join করার আগে filter করুন — একটা WHERE clause যা join-এর আগে একটা table-এর row কমায় মানে একসাথে করার জন্য কম data।</li><li>শুধু আসলে দরকারি table-ই join করুন — একটা অপ্রয়োজনীয় JOIN এর column কখনো select না হলেও কাজের খরচ হয়।</li></ul>'),
      h(2, 'Subquery কমানো', 'subquery-কমানো'),
      p('<p>Outer query-র প্রতিটা row-এর জন্য আবার চলা একটা subquery (আগের Subqueries lesson থেকে একটা correlated subquery) প্রায়ই একটা JOIN হিসেবে পুনর্লিখন করা যায়, যা database সাধারণত আরো efficiently plan করতে পারে।</p>'),
      code('sql', '-- ধীর — subquery products-এর প্রতি row-এ একবার চলে\nSELECT name FROM products p\nWHERE (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.id) > 0;\n\n-- প্রায়ই দ্রুত — join হিসেবে পুনর্লিখন করা\nSELECT DISTINCT p.name\nFROM products p\nJOIN order_items oi ON oi.product_id = p.id;'),
      h(2, 'Selective Projection — SELECT * না', 'selective-projection-select-না'),
      p('<p>প্রতিটা column-এর বদলে শুধু আসলে দরকারি column চাওয়া database-কে যা পড়তে আর পাঠাতে হয় তা কমায় — একটা বড় table-এ যা অনেক জমা হয় এমন একটা ছোট habit।</p>'),
      code('sql', '-- শুধু name দরকার হলে অপচয়\nSELECT * FROM products WHERE category = \'electronics\';\n\n-- ভালো\nSELECT name FROM products WHERE category = \'electronics\';'),
      table(['Technique', 'যা বাঁচায়'], [
        ['সঠিক column index করা', 'একটা মিল খুঁজতে প্রতিটা row scan করা এড়ায়'],
        ['Indexed column-এ join করা', 'join-এর একদিকে row-ধরে-ধরে scan এড়ায়'],
        ['Join করার আগে filter করা', 'কতটা data একসাথে করা হয় তা কমায়'],
        ['Correlated subquery-কে join হিসেবে পুনর্লিখন', 'একই subquery outer row-এ একবার আবার চালানো এড়ায়'],
        ['শুধু দরকারি column select করা', 'পড়া আর transfer হওয়া data কমায়'],
      ]),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'sql').single()
  if (catErr || !category) {
    console.error('Category "sql" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] sql/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] sql/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `sql/${lesson.slug}`
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
