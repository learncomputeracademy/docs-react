#!/usr/bin/env node
// Builds the new "SQL" category (categories.slug = 'sql', created separately)
// as 16 lessons, following docs/CONTENT-PIPELINE.md and the outline approved
// with the site owner 2026-07-29.
//
// Source: the site owner's own prior student handbook
// (c:\Users\Raptor\Downloads\index (17).html) — original material already,
// not copied from another site (pipeline §3). Restructured from its
// custom "topic card" JS-data-object format into this site's block schema;
// English prose largely adapted directly from that source, Bengali written
// fresh.
//
// Content depth: full ("what" + syntax + example + output table where the
// source had one + explanations + common uses + common mistakes), per the
// site owner's explicit choice over a condensed style.
// Images: selective — only lessons with a genuinely visual concept get one
// (four SQL families, joins, window-function ranking, index lookup), not
// one per lesson.
//
// Run incrementally as each lesson is written — grows over several runs,
// not all at once. Idempotent: re-running is always safe.
//
// Usage: node scripts/create-sql-content.mjs [--dry-run]

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
function code(language, codeText) { return { id: nanoid(12), type: 'code', language, code: codeText.trim() } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function table(header, rows, caption) { return { id: nanoid(12), type: 'table', header, rows, caption } }
function img(publicId, alt, width, height, caption) { return { id: nanoid(12), type: 'image', publicId, alt, width, height, caption } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// Small helper: turn an array of strings into a <ul> for explanations/uses.
function ul(items) { return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>` }

// ── Lessons ──────────────────────────────────────────────────────────────

const lessons = []

lessons.push({
  slug: 'intro',
  sortOrder: 1,
  en: {
    title: 'Introduction to SQL',
    metaTitle: 'Introduction to SQL | Learn Computer Academy',
    metaDescription: 'What SQL actually is, why it reads like a description rather than a set of steps, and the four command families every SQL statement belongs to.',
    blocks: [
      p('<p><b>SQL</b> (Structured Query Language) is how you talk to a relational database — asking it to store, find, change, or remove data. Every SQL statement falls into one of four families, which is exactly how this section is organized, lesson by lesson.</p>'),

      h(2, 'What SQL Actually Does'),
      p('<p>SQL is a <b>declarative</b> language: you describe the result you want, not the steps to get it. The database engine decides how to actually fetch it.</p>'),
      code('sql', `SELECT name FROM Employee WHERE department = 'IT';`),
      p(ul([
        'You state the "what" (employees in IT), not the "how" (loop, compare, collect) — the engine works that part out.',
        'Every statement ends in a semicolon.',
      ])),
      callout('warning', ul([
        'Forgetting the semicolon in multi-statement scripts.',
        'Assuming SQL runs top-to-bottom like a normal program — it describes a result, it doesn’t execute as a sequence of steps the way a script does.',
      ]), 'Common Mistakes'),

      h(2, 'The Four SQL Families'),
      p('<p>Every SQL command belongs to one of four families, grouped by what they affect:</p>'),
      table(
        ['Family', 'Full name', 'Affects', 'Example commands'],
        [
          ['DDL', 'Data Definition Language', 'The structure — tables, columns', 'CREATE, ALTER, DROP, TRUNCATE'],
          ['DML', 'Data Manipulation Language', 'The data inside that structure', 'SELECT, INSERT, UPDATE, DELETE'],
          ['DCL', 'Data Control Language', 'Who can touch it', 'GRANT, REVOKE'],
          ['TCL', 'Transaction Control Language', 'When changes stick', 'COMMIT, ROLLBACK, SAVEPOINT'],
        ]
      ),
      img(
        'docs/img/sql/intro-1',
        'Diagram showing the four SQL command families — DDL, DML, DCL, and TCL — each with its full name and example commands',
        1024, 768,
        'Every SQL command you’ll meet belongs to exactly one of these four families.'
      ),
      callout('warning', '<p>Mixing up <code>DELETE</code> (DML, removes rows) with <code>DROP</code> (DDL, removes the whole table) — one of the most common beginner mistakes in SQL, and one of the most costly to get wrong.</p>', 'The Mistake Worth Remembering Most'),

      p('<p>This section walks through each family in its own lesson, plus the querying, functions, and advanced techniques built on top of them. Next up: databases and tables — the structure everything else in SQL operates on.</p>'),
    ],
  },
  bn: {
    title: 'SQL পরিচিতি',
    metaTitle: 'SQL পরিচিতি | Learn Computer Academy',
    metaDescription: 'SQL আসলে কী, এটি কেন ধাপে ধাপে নির্দেশের বদলে একটি বর্ণনার মতো পড়া যায়, আর প্রতিটি SQL স্টেটমেন্ট যে চারটি কমান্ড পরিবারের একটির অন্তর্গত।',
    blocks: [
      p('<p><b>SQL</b> (Structured Query Language) হলো একটি রিলেশনাল ডেটাবেসের সাথে কথা বলার উপায় — তথ্য জমা রাখা, খোঁজা, বদলানো, বা মুছে ফেলার জন্য অনুরোধ করা। প্রতিটি SQL স্টেটমেন্ট চারটি পরিবারের একটির অন্তর্গত, যেভাবে এই অংশটি পাঠে পাঠে সাজানো হয়েছে।</p>'),

      h(2, 'SQL আসলে কী করে', 'what-sql-actually-does'),
      p('<p>SQL একটি <b>ডিক্লারেটিভ</b> ভাষা: আপনি কী ফলাফল চান তা বর্ণনা করেন, সেটি পাওয়ার ধাপগুলো নয়। ডেটাবেস ইঞ্জিন নিজেই ঠিক করে সেটি আসলে কীভাবে আনতে হবে।</p>'),
      code('sql', `SELECT name FROM Employee WHERE department = 'IT';`),
      p(ul([
        'আপনি "কী চাই" তা বলেন (IT-তে থাকা কর্মচারী), "কীভাবে" (লুপ, তুলনা, সংগ্রহ) তা নয় — সেই অংশটি ইঞ্জিন নিজেই বের করে নেয়।',
        'প্রতিটি স্টেটমেন্ট একটি সেমিকোলন দিয়ে শেষ হয়।',
      ])),
      callout('warning', ul([
        'একাধিক স্টেটমেন্টের স্ক্রিপ্টে সেমিকোলন ভুলে যাওয়া।',
        'SQL-কে একটি সাধারণ প্রোগ্রামের মতো উপর থেকে নিচে চলে বলে ধরে নেওয়া — এটি আসলে একটি ফলাফল বর্ণনা করে, একটি স্ক্রিপ্টের মতো ধাপে ধাপে চলে না।',
      ]), 'সাধারণ ভুল'),

      h(2, 'চারটি SQL পরিবার', 'the-four-sql-families'),
      p('<p>প্রতিটি SQL কমান্ড চারটি পরিবারের একটির অন্তর্গত, তারা কী প্রভাবিত করে তা অনুযায়ী:</p>'),
      table(
        ['পরিবার', 'পূর্ণ নাম', 'যা প্রভাবিত করে', 'উদাহরণ কমান্ড'],
        [
          ['DDL', 'Data Definition Language', 'কাঠামো — টেবিল, কলাম', 'CREATE, ALTER, DROP, TRUNCATE'],
          ['DML', 'Data Manipulation Language', 'সেই কাঠামোর ভেতরের তথ্য', 'SELECT, INSERT, UPDATE, DELETE'],
          ['DCL', 'Data Control Language', 'কে এটি স্পর্শ করতে পারে', 'GRANT, REVOKE'],
          ['TCL', 'Transaction Control Language', 'পরিবর্তন কখন স্থায়ী হয়', 'COMMIT, ROLLBACK, SAVEPOINT'],
        ]
      ),
      img(
        'docs/img/sql/intro-1',
        'DDL, DML, DCL, আর TCL — চারটি SQL কমান্ড পরিবার দেখানো ডায়াগ্রাম, প্রতিটির পূর্ণ নাম আর উদাহরণ কমান্ডসহ',
        1024, 768,
        'আপনি যত SQL কমান্ডের মুখোমুখি হবেন, প্রতিটিই এই চারটি পরিবারের ঠিক একটির অন্তর্গত।'
      ),
      callout('warning', '<p><code>DELETE</code> (DML, সারি মুছে দেয়) আর <code>DROP</code> (DDL, পুরো টেবিল মুছে দেয়) গুলিয়ে ফেলা — SQL-এ সবচেয়ে সাধারণ শিক্ষানবিশ ভুলগুলোর একটি, আর ভুল হলে সবচেয়ে বেশি ক্ষতিকর।</p>', 'সবচেয়ে বেশি মনে রাখার মতো ভুল'),

      p('<p>এই অংশের প্রতিটি পাঠে একটি করে পরিবার নিয়ে বিস্তারিত আলোচনা হবে, সাথে থাকবে কোয়েরি করা, ফাংশন, আর এগুলোর উপর তৈরি উন্নত কৌশল। এরপর: ডেটাবেস আর টেবিল — সেই কাঠামো যার উপর বাকি সব SQL কাজ করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'databases-and-tables',
  sortOrder: 2,
  en: {
    title: 'Databases & Tables',
    metaTitle: 'Databases & Tables | Learn Computer Academy',
    metaDescription: 'How to create a database, switch between databases, and see what already exists — the structural basics every SQL session starts with.',
    blocks: [
      p('<p>Before you can query anything, you need a database to hold it and a table shaped to fit your data. This lesson covers the handful of commands you\'ll run before writing a single <code>SELECT</code>.</p>'),

      h(2, 'CREATE DATABASE'),
      p('<p>Creates a new, empty database on the server.</p>'),
      code('sql', 'CREATE DATABASE database_name;'),
      code('sql', 'CREATE DATABASE CompanyDB;'),
      p(ul([
        'Reserves a named space for tables, views, and other objects.',
        'Does not select the database for use — you still need to switch to it with <code>USE</code>.',
      ])),
      callout('warning', '<p>Creating a database with the same name as an existing one without checking first.</p>', 'Common Mistake'),

      h(2, 'USE'),
      p('<p>Switches the active database for the current session.</p>'),
      code('sql', 'USE database_name;'),
      code('sql', 'USE CompanyDB;'),
      p('<p>All statements that follow run against this database until you switch again.</p>'),
      callout('warning', '<p>Running a query against the wrong database because <code>USE</code> was never called first.</p>', 'Common Mistake'),

      h(2, 'SHOW DATABASES / TABLES'),
      p('<p>Lists the databases on the server, or the tables inside the current one.</p>'),
      code('sql', 'SHOW DATABASES;\nSHOW TABLES;'),
      table(['Tables_in_CompanyDB'], [['Employee'], ['Department']], 'SHOW TABLES;'),
      p('<p>A quick way to see what already exists before writing a query against it.</p>'),
      callout('warning', '<p>Assuming <code>SHOW TABLES</code> works identically across every database engine — the exact syntax varies between MySQL, PostgreSQL, and others.</p>', 'Common Mistake'),

      h(2, 'Data Types — a Quick Pointer'),
      p('<p>Every column is given a <b>type</b> that constrains what it can store and how much room it takes.</p>'),
      p(ul([
        'Numbers, text, dates, and flags each have their own type family.',
        'The next lesson covers sizing each of them for a real, memory-conscious schema — not just which type to use, but which specific size.',
      ])),

      p('<p>With a database and the idea of typed columns in place, the next lesson goes deep on choosing the right type and size for every column you\'ll ever define.</p>'),
    ],
  },
  bn: {
    title: 'ডেটাবেস আর টেবিল',
    metaTitle: 'ডেটাবেস আর টেবিল | Learn Computer Academy',
    metaDescription: 'কীভাবে একটি ডেটাবেস তৈরি করবেন, ডেটাবেসের মধ্যে সুইচ করবেন, আর ইতিমধ্যে কী আছে তা দেখবেন — প্রতিটি SQL সেশন যেখান থেকে শুরু হয় সেই কাঠামোগত মূল বিষয়।',
    blocks: [
      p('<p>কোনো কিছু কোয়েরি করার আগে, আপনার প্রয়োজন একটি ডেটাবেস যা তথ্য ধরে রাখবে, আর একটি টেবিল যা আপনার তথ্যের সাথে মানানসই। এই পাঠে সেই কয়েকটি কমান্ড আলোচনা করা হবে যা আপনি একটিও <code>SELECT</code> লেখার আগে চালাবেন।</p>'),

      h(2, 'CREATE DATABASE', 'create-database'),
      p('<p>সার্ভারে একটি নতুন, খালি ডেটাবেস তৈরি করে।</p>'),
      code('sql', 'CREATE DATABASE database_name;'),
      code('sql', 'CREATE DATABASE CompanyDB;'),
      p(ul([
        'টেবিল, ভিউ, আর অন্যান্য অবজেক্টের জন্য একটি নামযুক্ত জায়গা সংরক্ষণ করে।',
        'ডেটাবেসটি ব্যবহারের জন্য নির্বাচন করে না — এখনও আপনাকে <code>USE</code> দিয়ে সেটিতে সুইচ করতে হবে।',
      ])),
      callout('warning', '<p>আগে না দেখেই বিদ্যমান একটি ডেটাবেসের সাথে একই নামে নতুন ডেটাবেস তৈরি করা।</p>', 'সাধারণ ভুল'),

      h(2, 'USE', 'use'),
      p('<p>বর্তমান সেশনের জন্য সক্রিয় ডেটাবেস পরিবর্তন করে।</p>'),
      code('sql', 'USE database_name;'),
      code('sql', 'USE CompanyDB;'),
      p('<p>এরপরের প্রতিটি স্টেটমেন্ট, আবার সুইচ না করা পর্যন্ত, এই ডেটাবেসের বিরুদ্ধেই চলে।</p>'),
      callout('warning', '<p><code>USE</code> আগে কখনো না চালানোর কারণে ভুল ডেটাবেসের বিরুদ্ধে একটি কোয়েরি চালানো।</p>', 'সাধারণ ভুল'),

      h(2, 'SHOW DATABASES / TABLES', 'show-databases-tables'),
      p('<p>সার্ভারে থাকা ডেটাবেসগুলো, বা বর্তমান ডেটাবেসের ভেতরের টেবিলগুলো তালিকাভুক্ত করে।</p>'),
      code('sql', 'SHOW DATABASES;\nSHOW TABLES;'),
      table(['Tables_in_CompanyDB'], [['Employee'], ['Department']], 'SHOW TABLES;'),
      p('<p>একটি কোয়েরি লেখার আগে ইতিমধ্যে কী আছে তা দেখার একটি দ্রুত উপায়।</p>'),
      callout('warning', '<p><code>SHOW TABLES</code> প্রতিটি ডেটাবেস ইঞ্জিনে একইভাবে কাজ করে বলে ধরে নেওয়া — MySQL, PostgreSQL, আর অন্যান্যদের মধ্যে সঠিক সিনট্যাক্স আলাদা হয়।</p>', 'সাধারণ ভুল'),

      h(2, 'ডেটা টাইপ — একটি দ্রুত ইঙ্গিত', 'data-types-a-quick-pointer'),
      p('<p>প্রতিটি কলামকে একটি <b>টাইপ</b> দেওয়া হয় যা সীমাবদ্ধ করে এটি কী জমা রাখতে পারবে আর কতটা জায়গা নেবে।</p>'),
      p(ul([
        'সংখ্যা, টেক্সট, তারিখ, আর ফ্ল্যাগ — প্রতিটির নিজস্ব টাইপ পরিবার আছে।',
        'পরের পাঠে একটি বাস্তব, মেমরি-সচেতন স্কিমার জন্য প্রতিটির সঠিক আকার নির্ধারণ করা নিয়ে বিস্তারিত আলোচনা হবে — শুধু কোন টাইপ ব্যবহার করবেন তা নয়, কোন নির্দিষ্ট আকার ব্যবহার করবেন তাও।',
      ])),

      p('<p>একটি ডেটাবেস আর টাইপযুক্ত কলামের ধারণা প্রতিষ্ঠিত হওয়ার পর, পরের পাঠে আমরা গভীরে যাব আপনি যে প্রতিটি কলাম কখনো সংজ্ঞায়িত করবেন তার জন্য সঠিক টাইপ আর আকার বেছে নেওয়া নিয়ে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'data-types',
  sortOrder: 3,
  en: {
    title: 'Data Types & Memory Sizing',
    metaTitle: 'SQL Data Types & Memory Sizing | Learn Computer Academy',
    metaDescription: 'A practical guide to SQL data types — numeric, text, date/time, boolean/ENUM/JSON — plus a real-world sizing cheatsheet for common production columns.',
    blocks: [
      p('<p>The type you pick per column isn\'t just about correctness — it\'s a direct memory and storage decision. Oversized columns waste space and slow down every index that touches them; undersized ones truncate real data in production. This lesson gives you concrete types and limits to reach for.</p>'),

      h(2, 'Numeric Types'),
      p('<p>Whole and decimal numbers, sized from 1 byte to 8+ bytes depending on the range you actually need.</p>'),
      code('sql', 'TINYINT · SMALLINT · INT · BIGINT · DECIMAL(p,s) · FLOAT/DOUBLE'),
      code('sql', `CREATE TABLE Product (\n  id BIGINT UNSIGNED PRIMARY KEY,\n  stock_count SMALLINT UNSIGNED,\n  price DECIMAL(10,2)\n);`),
      p(ul([
        'TINYINT (1 byte, 0–255 unsigned) fits status codes and small counters.',
        'SMALLINT (2 bytes, up to ~65k unsigned) fits stock counts and short IDs.',
        'INT (4 bytes, ~4.2B unsigned) is the default safe choice for most primary keys.',
        'BIGINT (8 bytes) is for IDs that will genuinely exceed 4 billion rows — most tables never need it.',
        'DECIMAL(p,s) stores exact values with no floating-point rounding — always use it for money, never FLOAT/DOUBLE.',
      ])),
      callout('warning', ul([
        'Defaulting every ID to BIGINT "just in case," doubling index size for no reason.',
        'Storing money as FLOAT, which introduces silent rounding errors.',
      ]), 'Common Mistakes'),

      h(2, 'CHAR vs. VARCHAR'),
      p('<p>Both store text — <code>CHAR</code> is fixed-length and padded, <code>VARCHAR</code> is variable-length and stores only what you write plus a short length prefix.</p>'),
      code('sql', 'CHAR(n) — always uses n bytes\nVARCHAR(n) — uses actual length + 1–2 bytes overhead'),
      code('sql', `CREATE TABLE Employee (\n  country_code CHAR(2),\n  full_name VARCHAR(100),\n  email VARCHAR(254)\n);`),
      p(ul([
        'CHAR(2) always occupies exactly 2 bytes — ideal for fixed-width codes like country or currency codes.',
        'VARCHAR(n) only stores what\'s actually written, so it\'s the right default for names, emails, and anything variable-length.',
        'The (n) in VARCHAR is a maximum, not a reservation — a VARCHAR(255) column holding "Sam" uses roughly 4 bytes, not 255.',
      ])),
      callout('warning', '<p>Using CHAR for variable-length text, wasting space on padding for every short value.</p>', 'Common Mistake'),

      h(2, 'Date & Time Types'),
      p('<p>Purpose-built types for calendar dates, timestamps, and durations — smaller and safer than storing dates as text.</p>'),
      code('sql', 'DATE (3 bytes) · TIME (3 bytes) · DATETIME (8 bytes) · TIMESTAMP (4 bytes)'),
      code('sql', `CREATE TABLE Employee (\n  hire_date DATE,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`),
      p(ul([
        'DATE stores just the calendar date — the smallest option when time-of-day doesn\'t matter.',
        'TIMESTAMP is timezone-aware and more compact than DATETIME, but limited in range in some engines — check yours.',
        'DATETIME has no timezone awareness but a much wider valid range.',
      ])),
      callout('warning', '<p>Storing dates as VARCHAR, which breaks sorting, range queries, and date math entirely.</p>', 'Common Mistake'),

      h(2, 'Boolean, ENUM & JSON'),
      p('<p>Types for fixed small choices and semi-structured data, used sparingly to keep rows compact and queryable.</p>'),
      code('sql', `CREATE TABLE Employee (\n  is_active BOOLEAN DEFAULT TRUE,\n  status ENUM('active','on_leave','terminated'),\n  metadata JSON\n);`),
      p(ul([
        'BOOLEAN is really a 1-byte TINYINT under the hood in most engines — cheap and clear.',
        'ENUM stores a fixed list of string values as a compact integer internally, saving space over repeating text.',
        'JSON is flexible but not indexable the way normal columns are — reach for it only when the shape of the data genuinely varies row to row.',
      ])),
      callout('warning', '<p>Using JSON as a substitute for proper columns because it\'s "flexible," making common queries slow and hard to index.</p>', 'Common Mistake'),

      h(2, 'Production Sizing Cheatsheet'),
      p('<p>Concrete types and limits for the fields nearly every production schema has — a direct answer to "what should this column actually be."</p>'),
      table(
        ['Field', 'Recommended type', 'Why'],
        [
          ['full_name', 'VARCHAR(100)', '30 truncates real names — many run 40–80+ characters with middle names/titles'],
          ['first_name / last_name', 'VARCHAR(50) each', 'Splitting lets you sort, greet, and validate independently'],
          ['email', 'VARCHAR(254)', 'RFC 5321 hard limit for a valid email address'],
          ['password_hash', 'CHAR(60)', 'bcrypt output is always exactly 60 chars — CHAR avoids padding waste'],
          ['phone', 'VARCHAR(20)', 'Covers "+", country code, extensions — never store as INT'],
          ['uuid', 'CHAR(36) or BINARY(16)', '36 for readable text form, 16 binary for a 2x+ smaller index'],
          ['postal_code', 'VARCHAR(10)', 'International codes vary; some contain letters'],
          ['country_code', 'CHAR(2)', 'Fixed-width ISO 3166-1 alpha-2'],
          ['currency_amount', 'DECIMAL(19,4)', 'Exact precision, headroom for large sums and 4 decimal places'],
          ['url', 'VARCHAR(2048)', 'Practical browser-enforced upper bound for a URL'],
          ['ip_address', 'VARBINARY(16) or VARCHAR(45)', '16 bytes binary covers IPv4 + IPv6 compactly'],
          ['is_active', 'BOOLEAN', '1 byte instead of a TINYINT or VARCHAR flag'],
        ]
      ),
      p('<p>A common real-world bug: sizing <code>full_name VARCHAR(30)</code> — names like "Priyanka Chattopadhyay" or "Jean-Baptiste van der Berg" already exceed 30 characters. Since VARCHAR only costs what\'s used, sizing to VARCHAR(100) instead of VARCHAR(30) has effectively zero memory cost for short names — the cap only matters for the rare long one.</p>'),
      callout('tip', '<p>Pick the smallest fixed type that can never legitimately overflow (IDs, codes, flags), and be generous with VARCHAR caps since they don\'t pre-allocate space.</p>', 'Rule of Thumb'),
      callout('warning', ul([
        'Sizing VARCHAR columns to the average case instead of the real maximum case.',
        'Storing phone numbers or postal codes as INT, breaking leading zeros and "+" prefixes.',
      ]), 'Common Mistakes'),

      h(2, 'Memory Management Principles'),
      p('<p>A few rules that keep a schema lean at scale, beyond just picking types per column.</p>'),
      p(ul([
        'Fixed-width columns (CHAR, INT, DATE) pack more predictably into an engine\'s storage pages, which helps index performance.',
        'Every extra byte on an indexed column is multiplied across every row in that index — sizing matters most on indexed and frequently-joined columns.',
        'Repeated strings (department names, categories) are cheaper normalized into a lookup table referenced by a small INT foreign key than stored as text in every row.',
        'NULL-able columns typically cost a bit less than storing an empty string, and mean something different — use NULL for "unknown," not empty text.',
      ])),
      img(
        'docs/img/sql/data-types-1',
        'Diagram showing the four SQL data type families — numeric, text, date and time, and boolean/ENUM/JSON — each with example type names',
        1344, 752,
        'Every column\'s type comes from one of these four families, sized to the data it actually needs to hold.'
      ),

      p('<p>With the right types and sizes in place, the next four lessons cover each SQL family in turn, starting with DDL — the commands that actually create the tables you\'ve just learned to size.</p>'),
    ],
  },
  bn: {
    title: 'ডেটা টাইপ আর মেমরি সাইজিং',
    metaTitle: 'SQL ডেটা টাইপ আর মেমরি সাইজিং | Learn Computer Academy',
    metaDescription: 'SQL ডেটা টাইপের একটি ব্যবহারিক গাইড — সংখ্যাসূচক, টেক্সট, তারিখ/সময়, বুলিয়ান/ENUM/JSON — সাথে সাধারণ প্রোডাকশন কলামের জন্য একটি বাস্তব সাইজিং চিটশিট।',
    blocks: [
      p('<p>প্রতিটি কলামের জন্য আপনি যে টাইপ বেছে নেন তা শুধু সঠিকতার বিষয় নয় — এটি সরাসরি একটি মেমরি আর স্টোরেজ সিদ্ধান্ত। বেশি বড় কলাম জায়গা নষ্ট করে আর সেটি স্পর্শ করা প্রতিটি ইনডেক্সকে ধীর করে দেয়; কম বড় কলাম প্রোডাকশনে সত্যিকারের তথ্য কেটে ফেলে। এই পাঠে আপনি নির্দিষ্ট টাইপ আর সীমা পাবেন যা বেছে নেওয়া উচিত।</p>'),

      h(2, 'সংখ্যাসূচক টাইপ', 'numeric-types'),
      p('<p>পূর্ণসংখ্যা আর দশমিক সংখ্যা, 1 বাইট থেকে 8+ বাইট পর্যন্ত আকারের, আপনার আসলে যে সীমা প্রয়োজন তার উপর নির্ভর করে।</p>'),
      code('sql', 'TINYINT · SMALLINT · INT · BIGINT · DECIMAL(p,s) · FLOAT/DOUBLE'),
      code('sql', `CREATE TABLE Product (\n  id BIGINT UNSIGNED PRIMARY KEY,\n  stock_count SMALLINT UNSIGNED,\n  price DECIMAL(10,2)\n);`),
      p(ul([
        'TINYINT (1 বাইট, 0–255 আনসাইনড) স্ট্যাটাস কোড আর ছোট কাউন্টারের জন্য মানানসই।',
        'SMALLINT (2 বাইট, প্রায় 65k পর্যন্ত আনসাইনড) স্টক কাউন্ট আর ছোট আইডির জন্য মানানসই।',
        'INT (4 বাইট, প্রায় 4.2B আনসাইনড) বেশিরভাগ প্রাইমারি কী-র জন্য ডিফল্ট নিরাপদ পছন্দ।',
        'BIGINT (8 বাইট) সেই আইডির জন্য যা সত্যিই 4 বিলিয়ন সারি ছাড়িয়ে যাবে — বেশিরভাগ টেবিলের এটি কখনোই প্রয়োজন হয় না।',
        'DECIMAL(p,s) কোনো ফ্লোটিং-পয়েন্ট রাউন্ডিং ছাড়াই সঠিক মান জমা রাখে — টাকার জন্য সবসময় এটি ব্যবহার করুন, FLOAT/DOUBLE কখনো নয়।',
      ])),
      callout('warning', ul([
        '"যদি দরকার হয়" ভেবে প্রতিটি আইডি ডিফল্টভাবে BIGINT করে দেওয়া, কোনো কারণ ছাড়াই ইনডেক্সের আকার দ্বিগুণ করে দেওয়া।',
        'টাকা FLOAT হিসেবে জমা রাখা, যা নিঃশব্দে রাউন্ডিং ভুল তৈরি করে।',
      ]), 'সাধারণ ভুল'),

      h(2, 'CHAR বনাম VARCHAR', 'char-vs-varchar'),
      p('<p>দুটোই টেক্সট জমা রাখে — <code>CHAR</code> নির্দিষ্ট-দৈর্ঘ্যের আর প্যাডেড, <code>VARCHAR</code> পরিবর্তনশীল-দৈর্ঘ্যের আর আপনি যা লেখেন শুধু তাই প্লাস একটি ছোট দৈর্ঘ্য প্রিফিক্স জমা রাখে।</p>'),
      code('sql', 'CHAR(n) — সবসময় n বাইট ব্যবহার করে\nVARCHAR(n) — প্রকৃত দৈর্ঘ্য + 1–2 বাইট ওভারহেড ব্যবহার করে'),
      code('sql', `CREATE TABLE Employee (\n  country_code CHAR(2),\n  full_name VARCHAR(100),\n  email VARCHAR(254)\n);`),
      p(ul([
        'CHAR(2) সবসময় ঠিক 2 বাইট দখল করে — দেশ বা মুদ্রা কোডের মতো নির্দিষ্ট-প্রস্থের কোডের জন্য আদর্শ।',
        'VARCHAR(n) শুধু যা আসলে লেখা হয়েছে তাই জমা রাখে, তাই নাম, ইমেইল, আর পরিবর্তনশীল-দৈর্ঘ্যের যেকোনো কিছুর জন্য এটিই সঠিক ডিফল্ট।',
        'VARCHAR-এর (n) একটি সর্বোচ্চ সীমা, কোনো সংরক্ষণ নয় — একটি VARCHAR(255) কলামে "Sam" রাখলে প্রায় 4 বাইট লাগে, 255 নয়।',
      ])),
      callout('warning', '<p>পরিবর্তনশীল-দৈর্ঘ্যের টেক্সটের জন্য CHAR ব্যবহার করা, প্রতিটি ছোট মানের জন্য প্যাডিং-এ জায়গা নষ্ট করা।</p>', 'সাধারণ ভুল'),

      h(2, 'তারিখ আর সময়ের টাইপ', 'date-time-types'),
      p('<p>ক্যালেন্ডার তারিখ, টাইমস্ট্যাম্প, আর সময়কালের জন্য বিশেষভাবে তৈরি টাইপ — তারিখকে টেক্সট হিসেবে জমা রাখার চেয়ে ছোট আর নিরাপদ।</p>'),
      code('sql', 'DATE (3 বাইট) · TIME (3 বাইট) · DATETIME (8 বাইট) · TIMESTAMP (4 বাইট)'),
      code('sql', `CREATE TABLE Employee (\n  hire_date DATE,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`),
      p(ul([
        'DATE শুধু ক্যালেন্ডার তারিখ জমা রাখে — সময়-of-দিন গুরুত্বপূর্ণ না হলে সবচেয়ে ছোট বিকল্প।',
        'TIMESTAMP টাইমজোন-সচেতন আর DATETIME-এর চেয়ে বেশি কমপ্যাক্ট, কিন্তু কিছু ইঞ্জিনে সীমিত পরিসরের — নিজের ইঞ্জিন পরীক্ষা করুন।',
        'DATETIME-এর কোনো টাইমজোন সচেতনতা নেই, কিন্তু অনেক বিস্তৃত বৈধ পরিসর।',
      ])),
      callout('warning', '<p>তারিখকে VARCHAR হিসেবে জমা রাখা, যা সর্টিং, রেঞ্জ কোয়েরি, আর তারিখ গণনা সম্পূর্ণভাবে ভেঙে দেয়।</p>', 'সাধারণ ভুল'),

      h(2, 'বুলিয়ান, ENUM আর JSON', 'boolean-enum-json'),
      p('<p>নির্দিষ্ট ছোট পছন্দ আর আধা-কাঠামোগত তথ্যের জন্য টাইপ, সারিকে কমপ্যাক্ট আর কোয়েরিযোগ্য রাখতে সীমিতভাবে ব্যবহার করা হয়।</p>'),
      code('sql', `CREATE TABLE Employee (\n  is_active BOOLEAN DEFAULT TRUE,\n  status ENUM('active','on_leave','terminated'),\n  metadata JSON\n);`),
      p(ul([
        'BOOLEAN আসলে বেশিরভাগ ইঞ্জিনে ভেতরে ভেতরে একটি 1-বাইট TINYINT — সস্তা আর স্পষ্ট।',
        'ENUM ভেতরে ভেতরে একটি কমপ্যাক্ট ইন্টিজার হিসেবে স্ট্রিং মানের একটি নির্দিষ্ট তালিকা জমা রাখে, বারবার টেক্সট লেখার চেয়ে জায়গা বাঁচায়।',
        'JSON নমনীয়, কিন্তু সাধারণ কলামের মতো ইনডেক্স করা যায় না — শুধু তখনই এটি বেছে নিন যখন তথ্যের আকৃতি সারি ভেদে সত্যিই আলাদা হয়।',
      ])),
      callout('warning', '<p>"নমনীয়" বলে সঠিক কলামের বদলে JSON ব্যবহার করা, যা সাধারণ কোয়েরি ধীর আর ইনডেক্স করা কঠিন করে তোলে।</p>', 'সাধারণ ভুল'),

      h(2, 'প্রোডাকশন সাইজিং চিটশিট', 'production-sizing-cheatsheet'),
      p('<p>প্রায় প্রতিটি প্রোডাকশন স্কিমায় থাকা ফিল্ডের জন্য নির্দিষ্ট টাইপ আর সীমা — "এই কলামটি আসলে কী হওয়া উচিত" প্রশ্নের সরাসরি উত্তর।</p>'),
      table(
        ['ফিল্ড', 'সুপারিশকৃত টাইপ', 'কারণ'],
        [
          ['full_name', 'VARCHAR(100)', '30 প্রকৃত নাম কেটে ফেলে — অনেক নাম মিডল নেম/টাইটেলসহ 40–80+ অক্ষর হয়'],
          ['first_name / last_name', 'প্রতিটি VARCHAR(50)', 'আলাদা রাখলে স্বাধীনভাবে সর্ট, গ্রিট, আর ভ্যালিডেট করা যায়'],
          ['email', 'VARCHAR(254)', 'একটি বৈধ ইমেইল ঠিকানার জন্য RFC 5321-এর কঠোর সীমা'],
          ['password_hash', 'CHAR(60)', 'bcrypt আউটপুট সবসময় ঠিক 60 অক্ষর — CHAR প্যাডিং অপচয় এড়ায়'],
          ['phone', 'VARCHAR(20)', '"+", দেশের কোড, এক্সটেনশন কভার করে — কখনো INT হিসেবে জমা রাখবেন না'],
          ['uuid', 'CHAR(36) বা BINARY(16)', 'পড়া-যায় এমন টেক্সট রূপের জন্য 36, 2x+ ছোট ইনডেক্সের জন্য 16 বাইনারি'],
          ['postal_code', 'VARCHAR(10)', 'আন্তর্জাতিক কোড ভিন্ন হয়; কিছু অক্ষরও ধারণ করে'],
          ['country_code', 'CHAR(2)', 'নির্দিষ্ট-প্রস্থের ISO 3166-1 alpha-2'],
          ['currency_amount', 'DECIMAL(19,4)', 'সঠিক নির্ভুলতা, বড় অঙ্ক আর 4 দশমিক স্থানের জন্য জায়গা'],
          ['url', 'VARCHAR(2048)', 'একটি URL-এর জন্য ব্যবহারিক ব্রাউজার-প্রয়োগকৃত ঊর্ধ্বসীমা'],
          ['ip_address', 'VARBINARY(16) বা VARCHAR(45)', '16 বাইট বাইনারি IPv4 + IPv6 কমপ্যাক্টভাবে কভার করে'],
          ['is_active', 'BOOLEAN', 'একটি TINYINT বা VARCHAR ফ্ল্যাগের বদলে 1 বাইট'],
        ]
      ),
      p('<p>একটি সাধারণ বাস্তব-জগতের বাগ: <code>full_name VARCHAR(30)</code> সাইজ করা — "Priyanka Chattopadhyay" বা "Jean-Baptiste van der Berg"-এর মতো নাম ইতিমধ্যেই 30 অক্ষর ছাড়িয়ে যায়। যেহেতু VARCHAR শুধু যা ব্যবহৃত হয় তার খরচ নেয়, VARCHAR(30)-এর বদলে VARCHAR(100) সাইজ করলে ছোট নামের জন্য কার্যত কোনো মেমরি খরচ বাড়ে না — সীমাটি শুধু বিরল লম্বা নামের ক্ষেত্রেই গুরুত্বপূর্ণ।</p>'),
      callout('tip', '<p>সবচেয়ে ছোট নির্দিষ্ট টাইপ বেছে নিন যা কখনো বৈধভাবে ওভারফ্লো করবে না (আইডি, কোড, ফ্ল্যাগ), আর VARCHAR সীমার ক্ষেত্রে উদার হোন যেহেতু এগুলো আগে থেকে জায়গা সংরক্ষণ করে না।</p>', 'সাধারণ নিয়ম'),
      callout('warning', ul([
        'গড় ক্ষেত্রের হিসাবে VARCHAR কলাম সাইজ করা, প্রকৃত সর্বোচ্চ ক্ষেত্রের বদলে।',
        'ফোন নম্বর বা পোস্টাল কোড INT হিসেবে জমা রাখা, যা শুরুর শূন্য আর "+" প্রিফিক্স ভেঙে দেয়।',
      ]), 'সাধারণ ভুল'),

      h(2, 'মেমরি ব্যবস্থাপনার নীতি', 'memory-management-principles'),
      p('<p>শুধু প্রতিটি কলামের জন্য টাইপ বেছে নেওয়ার বাইরেও, একটি স্কিমাকে বড় স্কেলে সংক্ষিপ্ত রাখার কয়েকটি নিয়ম।</p>'),
      p(ul([
        'নির্দিষ্ট-প্রস্থের কলাম (CHAR, INT, DATE) একটি ইঞ্জিনের স্টোরেজ পেজে বেশি অনুমানযোগ্যভাবে সাজে, যা ইনডেক্স পারফরম্যান্সে সাহায্য করে।',
        'একটি ইনডেক্স করা কলামের প্রতিটি অতিরিক্ত বাইট সেই ইনডেক্সের প্রতিটি সারিতে গুণিত হয় — ইনডেক্স করা আর ঘনঘন জয়েন করা কলামেই সাইজিং সবচেয়ে বেশি গুরুত্বপূর্ণ।',
        'বারবার আসা স্ট্রিং (বিভাগের নাম, ক্যাটাগরি) প্রতিটি সারিতে টেক্সট হিসেবে জমা রাখার চেয়ে একটি ছোট INT ফরেন কী দিয়ে রেফারেন্স করা একটি লুকআপ টেবিলে নরমালাইজ করলে সস্তা।',
        'NULL-যোগ্য কলাম সাধারণত একটি খালি স্ট্রিং জমা রাখার চেয়ে একটু কম খরচ করে, আর ভিন্ন কিছু বোঝায় — "অজানা"-র জন্য NULL ব্যবহার করুন, খালি টেক্সট নয়।',
      ])),
      img(
        'docs/img/sql/data-types-1',
        'চারটি SQL ডেটা টাইপ পরিবার দেখানো ডায়াগ্রাম — সংখ্যাসূচক, টেক্সট, তারিখ ও সময়, আর বুলিয়ান/ENUM/JSON — প্রতিটির উদাহরণ টাইপ নামসহ',
        1344, 752,
        'প্রতিটি কলামের টাইপ এই চারটি পরিবারের একটি থেকে আসে, যা এটি আসলে যে তথ্য ধরে রাখতে হবে তার জন্য সাইজ করা।'
      ),

      p('<p>সঠিক টাইপ আর আকার প্রতিষ্ঠিত হওয়ার পর, পরের চারটি পাঠে প্রতিটি SQL পরিবার একে একে আলোচনা করা হবে, শুরু হবে DDL দিয়ে — সেই কমান্ড যা আপনি এইমাত্র সাইজ করতে শেখা টেবিলগুলো আসলে তৈরি করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'ddl',
  sortOrder: 4,
  en: {
    title: 'DDL — Data Definition Language',
    metaTitle: 'SQL DDL — Data Definition Language | Learn Computer Academy',
    metaDescription: 'CREATE TABLE, DROP TABLE, TRUNCATE TABLE, and ALTER TABLE — the SQL commands that define and reshape the structure of your database.',
    blocks: [
      p('<p><b>DDL</b> statements define and reshape the structure of your database: tables, columns, and constraints. This is the first of the four SQL families covered in its own lesson.</p>'),

      h(2, 'CREATE TABLE'),
      p('<p>Creates a new table with a defined set of columns and data types.</p>'),
      code('sql', `CREATE TABLE table_name (\n  column datatype constraints\n);`),
      code('sql', `CREATE TABLE Employee (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  department VARCHAR(50),\n  salary DECIMAL(10,2)\n);`),
      p(ul([
        'Creates a new table named Employee, with four typed columns, one marked as the primary key.',
      ])),
      callout('warning', '<p>Forgetting a <code>PRIMARY KEY</code>, which makes rows impossible to uniquely reference.</p>', 'Common Mistake'),

      h(2, 'DROP TABLE'),
      p('<p>Removes a table permanently — structure and data both.</p>'),
      code('sql', 'DROP TABLE table_name;'),
      code('sql', 'DROP TABLE Employee;'),
      p(ul([
        'Deletes the Employee table permanently.',
        'Both structure and data are removed — there is no undo.',
      ])),
      callout('warning', '<p>Running <code>DROP TABLE</code> when <code>TRUNCATE</code> (keep structure, clear rows) was actually intended.</p>', 'Common Mistake'),

      h(2, 'TRUNCATE TABLE'),
      p('<p>Deletes every row from a table but keeps the table itself.</p>'),
      code('sql', 'TRUNCATE TABLE table_name;'),
      code('sql', 'TRUNCATE TABLE Employee;'),
      p(ul([
        'Removes every record in the table.',
        'The table structure remains, ready to be filled again.',
      ])),
      callout('warning', '<p>Using <code>TRUNCATE</code> expecting a <code>WHERE</code> clause to work — it always clears the whole table.</p>', 'Common Mistake'),

      h(2, 'ALTER TABLE'),
      p('<p>Modifies the structure of an existing table.</p>'),
      code('sql', 'ALTER TABLE table_name ADD | DROP COLUMN | ALTER COLUMN ...;'),
      code('sql', `-- Add a column\nALTER TABLE Employee ADD email VARCHAR(100);\n\n-- Remove a column\nALTER TABLE Employee DROP COLUMN email;\n\n-- Change a data type\nALTER TABLE Employee ALTER COLUMN salary DECIMAL(12,2);`),
      p(ul([
        'Adding a column leaves existing rows untouched — new cells start NULL.',
        'Dropping a column deletes that column\'s data permanently.',
        'Changing a data type preserves existing data when the conversion is compatible.',
      ])),
      callout('warning', '<p>Narrowing a column\'s type (e.g. VARCHAR(100) → VARCHAR(10)) and silently truncating data.</p>', 'Common Mistake'),

      h(2, 'At a Glance'),
      table(
        ['Command', 'What it does'],
        [
          ['CREATE TABLE', 'Builds a new table with typed columns'],
          ['DROP TABLE', 'Removes a table permanently — structure and data'],
          ['TRUNCATE TABLE', 'Clears every row, keeps the table structure'],
          ['ALTER TABLE', 'Adds, removes, or changes columns on an existing table'],
        ]
      ),

      p('<p>DDL shapes the structure. The next lesson covers DML — the commands you\'ll actually type the most, for reading and changing the data inside that structure.</p>'),
    ],
  },
  bn: {
    title: 'DDL — ডেটা ডেফিনিশন ল্যাঙ্গুয়েজ',
    metaTitle: 'SQL DDL — Data Definition Language | Learn Computer Academy',
    metaDescription: 'CREATE TABLE, DROP TABLE, TRUNCATE TABLE, আর ALTER TABLE — যে SQL কমান্ডগুলো আপনার ডেটাবেসের কাঠামো সংজ্ঞায়িত আর পুনর্গঠন করে।',
    blocks: [
      p('<p><b>DDL</b> স্টেটমেন্ট আপনার ডেটাবেসের কাঠামো সংজ্ঞায়িত আর পুনর্গঠন করে: টেবিল, কলাম, আর কনস্ট্রেইন্ট। এটি চারটি SQL পরিবারের প্রথমটি, নিজস্ব একটি পাঠে আলোচিত।</p>'),

      h(2, 'CREATE TABLE', 'create-table'),
      p('<p>সংজ্ঞায়িত কলাম আর ডেটা টাইপের একটি সেট দিয়ে একটি নতুন টেবিল তৈরি করে।</p>'),
      code('sql', `CREATE TABLE table_name (\n  column datatype constraints\n);`),
      code('sql', `CREATE TABLE Employee (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  department VARCHAR(50),\n  salary DECIMAL(10,2)\n);`),
      p(ul([
        'Employee নামে একটি নতুন টেবিল তৈরি করে, চারটি টাইপযুক্ত কলামসহ, একটি প্রাইমারি কী হিসেবে চিহ্নিত।',
      ])),
      callout('warning', '<p>একটি <code>PRIMARY KEY</code> দিতে ভুলে যাওয়া, যা সারিগুলোকে অনন্যভাবে চিহ্নিত করা অসম্ভব করে তোলে।</p>', 'সাধারণ ভুল'),

      h(2, 'DROP TABLE', 'drop-table'),
      p('<p>একটি টেবিল স্থায়ীভাবে সরিয়ে দেয় — কাঠামো আর তথ্য দুটোই।</p>'),
      code('sql', 'DROP TABLE table_name;'),
      code('sql', 'DROP TABLE Employee;'),
      p(ul([
        'Employee টেবিলটি স্থায়ীভাবে মুছে দেয়।',
        'কাঠামো আর তথ্য দুটোই সরানো হয় — কোনো আনডু নেই।',
      ])),
      callout('warning', '<p>যখন আসলে <code>TRUNCATE</code> (কাঠামো রেখে সারি মোছা) দরকার ছিল, তখন <code>DROP TABLE</code> চালানো।</p>', 'সাধারণ ভুল'),

      h(2, 'TRUNCATE TABLE', 'truncate-table'),
      p('<p>একটি টেবিলের প্রতিটি সারি মুছে দেয় কিন্তু টেবিলটি নিজেই রাখে।</p>'),
      code('sql', 'TRUNCATE TABLE table_name;'),
      code('sql', 'TRUNCATE TABLE Employee;'),
      p(ul([
        'টেবিলের প্রতিটি রেকর্ড সরিয়ে দেয়।',
        'টেবিলের কাঠামো থেকে যায়, আবার পূরণ করার জন্য প্রস্তুত।',
      ])),
      callout('warning', '<p><code>TRUNCATE</code>-এ একটি <code>WHERE</code> ক্লজ কাজ করবে বলে আশা করা — এটি সবসময় পুরো টেবিল খালি করে দেয়।</p>', 'সাধারণ ভুল'),

      h(2, 'ALTER TABLE', 'alter-table'),
      p('<p>একটি বিদ্যমান টেবিলের কাঠামো পরিবর্তন করে।</p>'),
      code('sql', 'ALTER TABLE table_name ADD | DROP COLUMN | ALTER COLUMN ...;'),
      code('sql', `-- একটি কলাম যোগ করা\nALTER TABLE Employee ADD email VARCHAR(100);\n\n-- একটি কলাম সরানো\nALTER TABLE Employee DROP COLUMN email;\n\n-- একটি ডেটা টাইপ বদলানো\nALTER TABLE Employee ALTER COLUMN salary DECIMAL(12,2);`),
      p(ul([
        'একটি কলাম যোগ করলে বিদ্যমান সারিগুলো অপরিবর্তিত থাকে — নতুন সেল NULL দিয়ে শুরু হয়।',
        'একটি কলাম সরিয়ে দিলে সেই কলামের তথ্য স্থায়ীভাবে মুছে যায়।',
        'একটি ডেটা টাইপ বদলালে রূপান্তর সামঞ্জস্যপূর্ণ হলে বিদ্যমান তথ্য সংরক্ষিত থাকে।',
      ])),
      callout('warning', '<p>একটি কলামের টাইপ সংকীর্ণ করা (যেমন VARCHAR(100) → VARCHAR(10)) আর নিঃশব্দে তথ্য কেটে ফেলা।</p>', 'সাধারণ ভুল'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['কমান্ড', 'এটি কী করে'],
        [
          ['CREATE TABLE', 'টাইপযুক্ত কলাম দিয়ে একটি নতুন টেবিল তৈরি করে'],
          ['DROP TABLE', 'একটি টেবিল স্থায়ীভাবে সরিয়ে দেয় — কাঠামো আর তথ্য'],
          ['TRUNCATE TABLE', 'প্রতিটি সারি খালি করে, টেবিলের কাঠামো রাখে'],
          ['ALTER TABLE', 'একটি বিদ্যমান টেবিলে কলাম যোগ, সরানো, বা পরিবর্তন করে'],
        ]
      ),

      p('<p>DDL কাঠামো গড়ে তোলে। পরের পাঠে DML নিয়ে আলোচনা হবে — সেই কমান্ড যা আপনি আসলে সবচেয়ে বেশি টাইপ করবেন, সেই কাঠামোর ভেতরের তথ্য পড়া আর বদলানোর জন্য।</p>'),
    ],
  },
})

lessons.push({
  slug: 'dml',
  sortOrder: 5,
  en: {
    title: 'DML — Data Manipulation Language',
    metaTitle: 'SQL DML — Data Manipulation Language | Learn Computer Academy',
    metaDescription: 'SELECT, aliases, INSERT, UPDATE, and DELETE — the SQL commands you\'ll type the most, for reading and changing the rows inside a table.',
    blocks: [
      p('<p><b>DML</b> statements are how you read and change the rows inside a table — the commands you\'ll type the most, by far.</p>'),

      h(2, 'SELECT'),
      p('<p>Retrieves records from one or more tables.</p>'),
      code('sql', 'SELECT columns FROM table_name;'),
      code('sql', 'SELECT * FROM Employee;'),
      table(['id', 'name', 'salary'], [['1', 'John', '65000'], ['2', 'Alice', '70000']], 'Result'),
      p(ul([
        'Returns every row and every column.',
        'The most frequently used SQL statement by far.',
      ])),
      callout('warning', '<p>Using <code>SELECT *</code> in production code instead of naming the columns actually needed.</p>', 'Common Mistake'),

      h(2, 'Aliases (AS)'),
      p('<p>Gives a column or table a temporary, more readable name for the result set.</p>'),
      code('sql', 'SELECT column AS alias FROM table_name;'),
      code('sql', `SELECT name AS EmployeeName, salary AS MonthlySalary\nFROM Employee;`),
      p(ul([
        'Creates a temporary display name — the underlying column is unchanged.',
        'Makes calculated columns and joined results easier to read.',
      ])),
      callout('warning', '<p>Referencing an alias inside the same <code>SELECT</code>\'s <code>WHERE</code> clause, where it isn\'t yet available.</p>', 'Common Mistake'),

      h(2, 'INSERT'),
      p('<p>Adds a new row to a table.</p>'),
      code('sql', `INSERT INTO table_name (columns)\nVALUES (values);`),
      code('sql', `INSERT INTO Employee (name, department, salary)\nVALUES ('John', 'IT', 65000);`),
      p(ul([
        'Adds one new row to the table.',
        'Does not affect any existing records.',
      ])),
      callout('warning', '<p>Leaving out a required column with no default, causing a constraint error.</p>', 'Common Mistake'),

      h(2, 'UPDATE'),
      p('<p>Changes the values of existing rows.</p>'),
      code('sql', `UPDATE table_name\nSET column = value\nWHERE condition;`),
      code('sql', `UPDATE Employee\nSET salary = 70000\nWHERE id = 1;`),
      p(ul([
        'Updates only the rows matching the WHERE condition.',
        'Always use WHERE — omitting it updates every row in the table.',
      ])),
      callout('warning', '<p>Running <code>UPDATE</code> without a <code>WHERE</code> clause and rewriting the whole table.</p>', 'Common Mistake'),

      h(2, 'DELETE'),
      p('<p>Removes specific rows from a table.</p>'),
      code('sql', `DELETE FROM table_name\nWHERE condition;`),
      code('sql', `DELETE FROM Employee\nWHERE id = 1;`),
      p(ul([
        'Deletes only the rows that match the condition.',
        'The table structure remains intact for future inserts.',
      ])),
      callout('warning', '<p>Confusing <code>DELETE</code> (row-level, DML) with <code>DROP</code> or <code>TRUNCATE</code> (table-level, DDL) — see the DDL lesson.</p>', 'Common Mistake'),

      p('<p>DML is the family you\'ll reach for constantly once your tables exist. The next lesson covers DCL — the much smaller family that controls who is allowed to run any of these commands at all.</p>'),
    ],
  },
  bn: {
    title: 'DML — ডেটা ম্যানিপুলেশন ল্যাঙ্গুয়েজ',
    metaTitle: 'SQL DML — Data Manipulation Language | Learn Computer Academy',
    metaDescription: 'SELECT, অ্যালিয়াস, INSERT, UPDATE, আর DELETE — যে SQL কমান্ডগুলো আপনি সবচেয়ে বেশি টাইপ করবেন, একটি টেবিলের ভেতরের সারি পড়া আর বদলানোর জন্য।',
    blocks: [
      p('<p><b>DML</b> স্টেটমেন্ট হলো একটি টেবিলের ভেতরের সারি পড়া আর বদলানোর উপায় — যে কমান্ডগুলো আপনি এখন পর্যন্ত সবচেয়ে বেশি টাইপ করবেন।</p>'),

      h(2, 'SELECT', 'select'),
      p('<p>এক বা একাধিক টেবিল থেকে রেকর্ড আনে।</p>'),
      code('sql', 'SELECT columns FROM table_name;'),
      code('sql', 'SELECT * FROM Employee;'),
      table(['id', 'name', 'salary'], [['1', 'John', '65000'], ['2', 'Alice', '70000']], 'ফলাফল'),
      p(ul([
        'প্রতিটি সারি আর প্রতিটি কলাম ফেরত দেয়।',
        'এখন পর্যন্ত সবচেয়ে বেশি ব্যবহৃত SQL স্টেটমেন্ট।',
      ])),
      callout('warning', '<p>প্রোডাকশন কোডে প্রয়োজনীয় কলামের নাম বলার বদলে <code>SELECT *</code> ব্যবহার করা।</p>', 'সাধারণ ভুল'),

      h(2, 'অ্যালিয়াস (AS)', 'aliases-as'),
      p('<p>ফলাফল সেটের জন্য একটি কলাম বা টেবিলকে একটি সাময়িক, আরও পড়া-যায় এমন নাম দেয়।</p>'),
      code('sql', 'SELECT column AS alias FROM table_name;'),
      code('sql', `SELECT name AS EmployeeName, salary AS MonthlySalary\nFROM Employee;`),
      p(ul([
        'একটি সাময়িক প্রদর্শন নাম তৈরি করে — অন্তর্নিহিত কলাম অপরিবর্তিত থাকে।',
        'গণনা করা কলাম আর জয়েন করা ফলাফল পড়া সহজ করে তোলে।',
      ])),
      callout('warning', '<p>একই <code>SELECT</code>-এর <code>WHERE</code> ক্লজের ভেতরে একটি অ্যালিয়াস রেফারেন্স করা, যেখানে এটি তখনও উপলব্ধ নয়।</p>', 'সাধারণ ভুল'),

      h(2, 'INSERT', 'insert'),
      p('<p>একটি টেবিলে একটি নতুন সারি যোগ করে।</p>'),
      code('sql', `INSERT INTO table_name (columns)\nVALUES (values);`),
      code('sql', `INSERT INTO Employee (name, department, salary)\nVALUES ('John', 'IT', 65000);`),
      p(ul([
        'টেবিলে একটি নতুন সারি যোগ করে।',
        'কোনো বিদ্যমান রেকর্ডকে প্রভাবিত করে না।',
      ])),
      callout('warning', '<p>কোনো ডিফল্ট ছাড়া একটি প্রয়োজনীয় কলাম বাদ দেওয়া, যা একটি কনস্ট্রেইন্ট এরর তৈরি করে।</p>', 'সাধারণ ভুল'),

      h(2, 'UPDATE', 'update'),
      p('<p>বিদ্যমান সারির মান পরিবর্তন করে।</p>'),
      code('sql', `UPDATE table_name\nSET column = value\nWHERE condition;`),
      code('sql', `UPDATE Employee\nSET salary = 70000\nWHERE id = 1;`),
      p(ul([
        'শুধু WHERE শর্তের সাথে মিলে যাওয়া সারিগুলো আপডেট করে।',
        'সবসময় WHERE ব্যবহার করুন — বাদ দিলে টেবিলের প্রতিটি সারি আপডেট হয়ে যায়।',
      ])),
      callout('warning', '<p><code>WHERE</code> ক্লজ ছাড়া <code>UPDATE</code> চালানো আর পুরো টেবিল আবার লেখা।</p>', 'সাধারণ ভুল'),

      h(2, 'DELETE', 'delete'),
      p('<p>একটি টেবিল থেকে নির্দিষ্ট সারি সরিয়ে দেয়।</p>'),
      code('sql', `DELETE FROM table_name\nWHERE condition;`),
      code('sql', `DELETE FROM Employee\nWHERE id = 1;`),
      p(ul([
        'শুধু শর্তের সাথে মিলে যাওয়া সারিগুলো মুছে দেয়।',
        'ভবিষ্যতের ইনসার্টের জন্য টেবিলের কাঠামো অক্ষত থাকে।',
      ])),
      callout('warning', '<p><code>DELETE</code> (সারি-স্তর, DML)-কে <code>DROP</code> বা <code>TRUNCATE</code> (টেবিল-স্তর, DDL)-এর সাথে গুলিয়ে ফেলা — DDL পাঠ দেখুন।</p>', 'সাধারণ ভুল'),

      p('<p>আপনার টেবিল তৈরি হয়ে গেলে DML হলো সেই পরিবার যা আপনি ক্রমাগত ব্যবহার করবেন। পরের পাঠে DCL নিয়ে আলোচনা হবে — অনেক ছোট একটি পরিবার যা নিয়ন্ত্রণ করে কে আসলে এই কমান্ডগুলো চালাতে পারবে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'dcl',
  sortOrder: 6,
  en: {
    title: 'DCL — Data Control Language',
    metaTitle: 'SQL DCL — Data Control Language | Learn Computer Academy',
    metaDescription: 'GRANT and REVOKE — the two SQL commands that manage who is allowed to see or change your data.',
    blocks: [
      p('<p><b>DCL</b> statements manage who is allowed to see or change your data. It\'s the smallest of the four SQL families, built from just two commands.</p>'),

      h(2, 'GRANT'),
      p('<p>Gives a user or role permission to perform an action.</p>'),
      code('sql', `GRANT permission\nON object\nTO user;`),
      code('sql', `GRANT SELECT\nON Employee\nTO User1;`),
      p(ul([
        'Gives User1 permission to read from the Employee table.',
        'User1 can read the data only — not modify it.',
      ])),
      callout('warning', '<p>Granting broader permissions (e.g. <code>ALL</code>) than the task actually needs.</p>', 'Common Mistake'),

      h(2, 'REVOKE'),
      p('<p>Removes a permission that was previously granted.</p>'),
      code('sql', `REVOKE permission\nON object\nFROM user;`),
      code('sql', `REVOKE SELECT\nON Employee\nFROM User1;`),
      p(ul([
        'Removes the previously granted SELECT permission.',
        'Useful for tightening access as part of routine security management.',
      ])),
      callout('warning', '<p>Revoking access without checking what else depends on it.</p>', 'Common Mistake'),

      p('<p>DCL is about permissions — the next lesson covers TCL, the family that manages when a group of changes becomes permanent.</p>'),
    ],
  },
  bn: {
    title: 'DCL — ডেটা কন্ট্রোল ল্যাঙ্গুয়েজ',
    metaTitle: 'SQL DCL — Data Control Language | Learn Computer Academy',
    metaDescription: 'GRANT আর REVOKE — দুটি SQL কমান্ড যা নিয়ন্ত্রণ করে কে আপনার তথ্য দেখতে বা বদলাতে পারবে।',
    blocks: [
      p('<p><b>DCL</b> স্টেটমেন্ট নিয়ন্ত্রণ করে কে আপনার তথ্য দেখতে বা বদলাতে পারবে। এটি চারটি SQL পরিবারের মধ্যে সবচেয়ে ছোট, মাত্র দুটি কমান্ড দিয়ে তৈরি।</p>'),

      h(2, 'GRANT', 'grant'),
      p('<p>একজন ব্যবহারকারী বা রোলকে একটি কাজ করার অনুমতি দেয়।</p>'),
      code('sql', `GRANT permission\nON object\nTO user;`),
      code('sql', `GRANT SELECT\nON Employee\nTO User1;`),
      p(ul([
        'User1-কে Employee টেবিল থেকে পড়ার অনুমতি দেয়।',
        'User1 শুধু তথ্য পড়তে পারবে — পরিবর্তন করতে পারবে না।',
      ])),
      callout('warning', '<p>কাজের জন্য আসলে যা প্রয়োজন তার চেয়ে বেশি অনুমতি (যেমন <code>ALL</code>) দিয়ে দেওয়া।</p>', 'সাধারণ ভুল'),

      h(2, 'REVOKE', 'revoke'),
      p('<p>আগে দেওয়া একটি অনুমতি সরিয়ে দেয়।</p>'),
      code('sql', `REVOKE permission\nON object\nFROM user;`),
      code('sql', `REVOKE SELECT\nON Employee\nFROM User1;`),
      p(ul([
        'আগে দেওয়া SELECT অনুমতি সরিয়ে দেয়।',
        'নিয়মিত নিরাপত্তা ব্যবস্থাপনার অংশ হিসেবে অ্যাক্সেস আরও কড়া করতে কাজে লাগে।',
      ])),
      callout('warning', '<p>এর উপর আর কী নির্ভর করে তা পরীক্ষা না করেই অ্যাক্সেস সরিয়ে দেওয়া।</p>', 'সাধারণ ভুল'),

      p('<p>DCL অনুমতি নিয়ে কাজ করে — পরের পাঠে TCL নিয়ে আলোচনা হবে, সেই পরিবার যা নিয়ন্ত্রণ করে একদল পরিবর্তন কখন স্থায়ী হয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'tcl',
  sortOrder: 7,
  en: {
    title: 'TCL — Transaction Control Language',
    metaTitle: 'SQL TCL — Transaction Control Language | Learn Computer Academy',
    metaDescription: 'COMMIT, ROLLBACK, and SAVEPOINT — the SQL commands that manage groups of changes as a single unit, so they either all happen or none do.',
    blocks: [
      p('<p><b>TCL</b> statements manage groups of changes as a single unit, called a <b>transaction</b> — so a set of related changes either all happen, or none do. This is the last of the four SQL command families.</p>'),

      h(2, 'COMMIT'),
      p('<p>Saves all changes made in the current transaction permanently.</p>'),
      code('sql', 'COMMIT;'),
      p(ul([
        'Makes every change since the last COMMIT permanent.',
        'Cannot be undone once committed.',
      ])),
      callout('warning', '<p>Forgetting to <code>COMMIT</code> and losing changes when the session ends.</p>', 'Common Mistake'),

      h(2, 'ROLLBACK'),
      p('<p>Cancels all uncommitted changes in the current transaction.</p>'),
      code('sql', 'ROLLBACK;'),
      p(ul([
        'Cancels any changes made since the last COMMIT.',
        'Returns the database to its previous, safe state.',
      ])),
      callout('warning', '<p>Assuming <code>ROLLBACK</code> can undo changes that were already committed — it can\'t.</p>', 'Common Mistake'),

      h(2, 'SAVEPOINT'),
      p('<p>Marks a point inside a transaction that you can roll back to, without undoing everything.</p>'),
      code('sql', 'SAVEPOINT savepoint_name;'),
      code('sql', 'SAVEPOINT BeforeUpdate;'),
      p(ul([
        'Creates a named restore point inside the current transaction.',
        'A later ROLLBACK TO can return to this point instead of the very start.',
      ])),
      callout('warning', '<p>Relying on <code>SAVEPOINT</code> across separate sessions — it only lives within one transaction.</p>', 'Common Mistake'),

      p('<p>With all four SQL families covered — DDL, DML, DCL, and TCL — the next set of lessons moves into querying: filtering, sorting, and grouping the data you now know how to define, change, control, and commit.</p>'),
    ],
  },
  bn: {
    title: 'TCL — ট্রানজ্যাকশন কন্ট্রোল ল্যাঙ্গুয়েজ',
    metaTitle: 'SQL TCL — Transaction Control Language | Learn Computer Academy',
    metaDescription: 'COMMIT, ROLLBACK, আর SAVEPOINT — যে SQL কমান্ডগুলো একদল পরিবর্তনকে একটি একক ইউনিট হিসেবে পরিচালনা করে, যাতে হয় সবগুলো ঘটে, নয়তো একটিও না।',
    blocks: [
      p('<p><b>TCL</b> স্টেটমেন্ট একদল পরিবর্তনকে একটি একক ইউনিট হিসেবে পরিচালনা করে, যাকে বলা হয় একটি <b>ট্রানজ্যাকশন</b> — যাতে একগুচ্ছ সম্পর্কিত পরিবর্তন হয় সবগুলো ঘটে, নয়তো একটিও না। এটি চারটি SQL কমান্ড পরিবারের শেষটি।</p>'),

      h(2, 'COMMIT', 'commit'),
      p('<p>বর্তমান ট্রানজ্যাকশনে করা সব পরিবর্তন স্থায়ীভাবে সংরক্ষণ করে।</p>'),
      code('sql', 'COMMIT;'),
      p(ul([
        'শেষ COMMIT-এর পর থেকে প্রতিটি পরিবর্তন স্থায়ী করে।',
        'একবার কমিট হয়ে গেলে এটি আর ফিরিয়ে নেওয়া যায় না।',
      ])),
      callout('warning', '<p><code>COMMIT</code> করতে ভুলে যাওয়া আর সেশন শেষ হলে পরিবর্তন হারিয়ে ফেলা।</p>', 'সাধারণ ভুল'),

      h(2, 'ROLLBACK', 'rollback'),
      p('<p>বর্তমান ট্রানজ্যাকশনের সব কমিট-না-করা পরিবর্তন বাতিল করে।</p>'),
      code('sql', 'ROLLBACK;'),
      p(ul([
        'শেষ COMMIT-এর পর থেকে করা যেকোনো পরিবর্তন বাতিল করে।',
        'ডেটাবেসকে তার আগের, নিরাপদ অবস্থায় ফিরিয়ে আনে।',
      ])),
      callout('warning', '<p>ইতিমধ্যে কমিট করা পরিবর্তন <code>ROLLBACK</code> দিয়ে ফিরিয়ে নেওয়া যাবে বলে ধরে নেওয়া — এটি সম্ভব নয়।</p>', 'সাধারণ ভুল'),

      h(2, 'SAVEPOINT', 'savepoint'),
      p('<p>একটি ট্রানজ্যাকশনের ভেতরে এমন একটি বিন্দু চিহ্নিত করে যেখানে আপনি সবকিছু বাতিল না করেই ফিরে যেতে পারেন।</p>'),
      code('sql', 'SAVEPOINT savepoint_name;'),
      code('sql', 'SAVEPOINT BeforeUpdate;'),
      p(ul([
        'বর্তমান ট্রানজ্যাকশনের ভেতরে একটি নামযুক্ত রিস্টোর পয়েন্ট তৈরি করে।',
        'পরে একটি ROLLBACK TO একদম শুরুর বদলে এই বিন্দুতে ফিরে যেতে পারে।',
      ])),
      callout('warning', '<p>আলাদা আলাদা সেশন জুড়ে <code>SAVEPOINT</code>-এর উপর নির্ভর করা — এটি শুধু একটি ট্রানজ্যাকশনের মধ্যেই টিকে থাকে।</p>', 'সাধারণ ভুল'),

      p('<p>চারটি SQL পরিবারই — DDL, DML, DCL, আর TCL — এখন আলোচিত হয়ে গেছে। পরের পাঠগুলোতে আমরা কোয়েরি করার দিকে যাব: ফিল্টার, সর্ট, আর গ্রুপ করা সেই তথ্য যা আপনি এখন সংজ্ঞায়িত, পরিবর্তন, নিয়ন্ত্রণ, আর কমিট করতে জানেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'where-operators',
  sortOrder: 8,
  en: {
    title: 'Filtering — WHERE & Operators',
    metaTitle: 'SQL Filtering — WHERE & Operators | Learn Computer Academy',
    metaDescription: 'Comparison operators, AND/OR/NOT, BETWEEN, LIKE, IN, ANY/ALL, and EXISTS — the full vocabulary for narrowing SQL results down to the rows that matter.',
    blocks: [
      p('<p><code>WHERE</code> narrows a result down to the rows that matter, and operators are the vocabulary you filter with. This lesson covers every operator you\'ll reach for regularly.</p>'),

      h(2, 'WHERE (Comparison Operators)'),
      p('<p>Filters rows using <code>=</code>, <code>&lt;&gt;</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>.</p>'),
      code('sql', `SELECT * FROM table_name\nWHERE column operator value;`),
      code('sql', `SELECT * FROM Employee\nWHERE salary > 50000;`),
      p(ul([
        'Compares each row\'s value against the condition.',
        'Only matching rows are returned.',
      ])),
      callout('warning', '<p>Using <code>=</code> to compare against NULL instead of <code>IS NULL</code> — a NULL is never equal to anything, not even another NULL.</p>', 'Common Mistake'),

      h(2, 'AND / OR / NOT'),
      p('<p>Combines multiple conditions in a WHERE clause.</p>'),
      code('sql', `WHERE condition1 AND condition2\nWHERE condition1 OR condition2`),
      code('sql', `SELECT * FROM Employee\nWHERE department = 'IT'\nAND salary > 50000;`),
      p(ul([
        'AND requires every condition to be true.',
        'OR requires at least one condition to be true; NOT inverts a condition.',
      ])),
      callout('warning', '<p>Missing parentheses when mixing AND with OR, silently changing the intended logic.</p>', 'Common Mistake'),

      h(2, 'BETWEEN'),
      p('<p>Checks whether a value falls within an inclusive range.</p>'),
      code('sql', 'WHERE column BETWEEN low AND high;'),
      code('sql', 'WHERE salary BETWEEN 50000 AND 70000;'),
      p(ul([
        'Includes both boundary values.',
        'Reads more naturally than two chained comparisons.',
      ])),
      callout('warning', '<p>Forgetting that <code>BETWEEN</code> is inclusive on both ends.</p>', 'Common Mistake'),

      h(2, 'LIKE'),
      p('<p>Matches text against a pattern.</p>'),
      code('sql', "WHERE column LIKE 'pattern';"),
      code('sql', "WHERE name LIKE 'J%';"),
      p(ul([
        '<code>%</code> matches any sequence of characters, <code>_</code> matches exactly one.',
        'Case sensitivity depends on the database engine\'s collation.',
      ])),
      callout('warning', "<p>Leading a pattern with % ('%text'), which usually forces a slow full table scan.</p>", 'Common Mistake'),

      h(2, 'IN'),
      p('<p>Matches a column against a list of possible values.</p>'),
      code('sql', 'WHERE column IN (value1, value2, ...);'),
      code('sql', "WHERE department IN ('IT', 'HR');"),
      p(ul([
        'Returns rows where the column matches any value in the list.',
        'Cleaner than a long chain of OR conditions.',
      ])),
      callout('warning', '<p>Using <code>IN</code> with a very large list instead of joining against a table.</p>', 'Common Mistake'),

      h(2, 'ANY / ALL'),
      p('<p>Compares a value against every value returned by a subquery.</p>'),
      code('sql', `WHERE column > ANY (subquery);\nWHERE column > ALL (subquery);`),
      code('sql', `WHERE salary > ANY (\n  SELECT salary FROM Employee WHERE department = 'HR'\n);`),
      p(ul([
        'ANY is true if the comparison holds for at least one returned value.',
        'ALL requires the comparison to hold for every returned value.',
      ])),
      callout('warning', '<p>Confusing <code>ANY</code> with <code>IN</code> — ANY works with comparison operators, not just equality. See the Subqueries lesson for more.</p>', 'Common Mistake'),

      h(2, 'EXISTS'),
      p('<p>Checks whether a subquery returns any rows at all.</p>'),
      code('sql', 'WHERE EXISTS (subquery);'),
      code('sql', `WHERE EXISTS (\n  SELECT 1 FROM Department WHERE Department.id = Employee.department_id\n);`),
      p(ul([
        'Returns TRUE as soon as the subquery finds one matching row.',
        'Often faster than IN for correlated subqueries, since it can stop early.',
      ])),
      callout('warning', '<p>Selecting specific columns inside <code>EXISTS</code> — the values returned are never actually used.</p>', 'Common Mistake'),

      h(2, 'At a Glance'),
      table(
        ['Operator', 'What it checks'],
        [
          ['=, <>, >, <, >=, <=', 'Direct value comparison'],
          ['AND / OR / NOT', 'Combining or inverting conditions'],
          ['BETWEEN', 'A value within an inclusive range'],
          ['LIKE', 'A text pattern match'],
          ['IN', 'A value against a fixed list'],
          ['ANY / ALL', 'A value against every result of a subquery'],
          ['EXISTS', 'Whether a subquery returns any rows'],
        ]
      ),

      p('<p>With filtering covered, the next lesson is a short one: sorting results with ORDER BY.</p>'),
    ],
  },
  bn: {
    title: 'ফিল্টারিং — WHERE আর অপারেটর',
    metaTitle: 'SQL Filtering — WHERE & Operators | Learn Computer Academy',
    metaDescription: 'কম্পারিজন অপারেটর, AND/OR/NOT, BETWEEN, LIKE, IN, ANY/ALL, আর EXISTS — SQL ফলাফলকে গুরুত্বপূর্ণ সারিতে সংকুচিত করার সম্পূর্ণ শব্দভাণ্ডার।',
    blocks: [
      p('<p><code>WHERE</code> একটি ফলাফলকে সংকুচিত করে শুধু গুরুত্বপূর্ণ সারিতে নিয়ে আসে, আর অপারেটর হলো সেই শব্দভাণ্ডার যা দিয়ে আপনি ফিল্টার করেন। এই পাঠে সেই প্রতিটি অপারেটর আলোচনা করা হবে যা আপনি নিয়মিত ব্যবহার করবেন।</p>'),

      h(2, 'WHERE (কম্পারিজন অপারেটর)', 'where-comparison-operators'),
      p('<p><code>=</code>, <code>&lt;&gt;</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code> ব্যবহার করে সারি ফিল্টার করে।</p>'),
      code('sql', `SELECT * FROM table_name\nWHERE column operator value;`),
      code('sql', `SELECT * FROM Employee\nWHERE salary > 50000;`),
      p(ul([
        'প্রতিটি সারির মান শর্তের বিরুদ্ধে তুলনা করে।',
        'শুধু মিলে যাওয়া সারিগুলো ফেরত দেওয়া হয়।',
      ])),
      callout('warning', '<p>NULL-এর সাথে তুলনা করতে <code>IS NULL</code>-এর বদলে <code>=</code> ব্যবহার করা — একটি NULL কখনো কিছুর সমান নয়, এমনকি অন্য একটি NULL-এরও নয়।</p>', 'সাধারণ ভুল'),

      h(2, 'AND / OR / NOT', 'and-or-not'),
      p('<p>একটি WHERE ক্লজে একাধিক শর্ত একত্র করে।</p>'),
      code('sql', `WHERE condition1 AND condition2\nWHERE condition1 OR condition2`),
      code('sql', `SELECT * FROM Employee\nWHERE department = 'IT'\nAND salary > 50000;`),
      p(ul([
        'AND-এর জন্য প্রতিটি শর্ত সত্য হতে হয়।',
        'OR-এর জন্য অন্তত একটি শর্ত সত্য হলেই চলে; NOT একটি শর্ত উল্টে দেয়।',
      ])),
      callout('warning', '<p>AND আর OR মেশানোর সময় বন্ধনী বাদ দেওয়া, যা নিঃশব্দে উদ্দিষ্ট যুক্তি বদলে দেয়।</p>', 'সাধারণ ভুল'),

      h(2, 'BETWEEN', 'between'),
      p('<p>একটি মান একটি অন্তর্ভুক্তিমূলক পরিসরের মধ্যে পড়ে কি না তা পরীক্ষা করে।</p>'),
      code('sql', 'WHERE column BETWEEN low AND high;'),
      code('sql', 'WHERE salary BETWEEN 50000 AND 70000;'),
      p(ul([
        'দুটো সীমানার মানই অন্তর্ভুক্ত করে।',
        'দুটো চেইন করা তুলনার চেয়ে আরও স্বাভাবিকভাবে পড়া যায়।',
      ])),
      callout('warning', '<p><code>BETWEEN</code> দুই প্রান্তেই অন্তর্ভুক্তিমূলক তা ভুলে যাওয়া।</p>', 'সাধারণ ভুল'),

      h(2, 'LIKE', 'like'),
      p('<p>টেক্সটকে একটি প্যাটার্নের বিরুদ্ধে মেলায়।</p>'),
      code('sql', "WHERE column LIKE 'pattern';"),
      code('sql', "WHERE name LIKE 'J%';"),
      p(ul([
        '<code>%</code> যেকোনো ক্রমের অক্ষর মেলায়, <code>_</code> ঠিক একটি অক্ষর মেলায়।',
        'কেস সেন্সিটিভিটি ডেটাবেস ইঞ্জিনের কোলেশনের উপর নির্ভর করে।',
      ])),
      callout('warning', "<p>একটি প্যাটার্নের শুরুতে % দেওয়া ('%text'), যা সাধারণত একটি ধীর ফুল টেবিল স্ক্যান বাধ্য করে।</p>", 'সাধারণ ভুল'),

      h(2, 'IN', 'in'),
      p('<p>একটি কলামকে সম্ভাব্য মানের একটি তালিকার বিরুদ্ধে মেলায়।</p>'),
      code('sql', 'WHERE column IN (value1, value2, ...);'),
      code('sql', "WHERE department IN ('IT', 'HR');"),
      p(ul([
        'কলাম তালিকার যেকোনো মানের সাথে মিললে সেই সারি ফেরত দেয়।',
        'OR শর্তের একটি লম্বা চেইনের চেয়ে পরিষ্কার।',
      ])),
      callout('warning', '<p>একটি টেবিলের সাথে জয়েন করার বদলে একটি খুব বড় তালিকা দিয়ে <code>IN</code> ব্যবহার করা।</p>', 'সাধারণ ভুল'),

      h(2, 'ANY / ALL', 'any-all'),
      p('<p>একটি মানকে একটি সাবকোয়েরির ফেরত দেওয়া প্রতিটি মানের বিরুদ্ধে তুলনা করে।</p>'),
      code('sql', `WHERE column > ANY (subquery);\nWHERE column > ALL (subquery);`),
      code('sql', `WHERE salary > ANY (\n  SELECT salary FROM Employee WHERE department = 'HR'\n);`),
      p(ul([
        'ফেরত দেওয়া অন্তত একটি মানের জন্য তুলনা সত্য হলে ANY সত্য।',
        'প্রতিটি ফেরত দেওয়া মানের জন্যই তুলনা সত্য হতে হবে ALL-এর ক্ষেত্রে।',
      ])),
      callout('warning', '<p><code>ANY</code>-কে <code>IN</code>-এর সাথে গুলিয়ে ফেলা — ANY কম্পারিজন অপারেটরের সাথে কাজ করে, শুধু সমতা নয়। বিস্তারিত সাবকোয়েরিজ পাঠে।</p>', 'সাধারণ ভুল'),

      h(2, 'EXISTS', 'exists'),
      p('<p>একটি সাবকোয়েরি আদৌ কোনো সারি ফেরত দেয় কি না তা পরীক্ষা করে।</p>'),
      code('sql', 'WHERE EXISTS (subquery);'),
      code('sql', `WHERE EXISTS (\n  SELECT 1 FROM Department WHERE Department.id = Employee.department_id\n);`),
      p(ul([
        'সাবকোয়েরি একটি মিলে যাওয়া সারি খুঁজে পাওয়া মাত্রই TRUE ফেরত দেয়।',
        'কোরিলেটেড সাবকোয়েরির জন্য প্রায়ই IN-এর চেয়ে দ্রুত, কারণ এটি আগেই থামতে পারে।',
      ])),
      callout('warning', '<p><code>EXISTS</code>-এর ভেতরে নির্দিষ্ট কলাম সিলেক্ট করা — যে মান ফেরত আসে তা আসলে কখনো ব্যবহৃত হয় না।</p>', 'সাধারণ ভুল'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['অপারেটর', 'এটি কী পরীক্ষা করে'],
        [
          ['=, <>, >, <, >=, <=', 'সরাসরি মান তুলনা'],
          ['AND / OR / NOT', 'শর্ত একত্র করা বা উল্টানো'],
          ['BETWEEN', 'একটি অন্তর্ভুক্তিমূলক পরিসরের মধ্যে একটি মান'],
          ['LIKE', 'একটি টেক্সট প্যাটার্ন মেলানো'],
          ['IN', 'একটি নির্দিষ্ট তালিকার বিরুদ্ধে একটি মান'],
          ['ANY / ALL', 'একটি সাবকোয়েরির প্রতিটি ফলাফলের বিরুদ্ধে একটি মান'],
          ['EXISTS', 'একটি সাবকোয়েরি কোনো সারি ফেরত দেয় কি না'],
        ]
      ),

      p('<p>ফিল্টারিং আলোচিত হওয়ার পর, পরের পাঠটি ছোট: ORDER BY দিয়ে ফলাফল সর্ট করা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'order-by',
  sortOrder: 9,
  en: {
    title: 'Sorting — ORDER BY',
    metaTitle: 'SQL Sorting — ORDER BY | Learn Computer Academy',
    metaDescription: 'ASC and DESC — how ORDER BY controls the sequence SQL results come back in, without changing which rows are returned.',
    blocks: [
      p('<p><code>ORDER BY</code> controls the sequence results come back in — it doesn\'t change which rows are returned, only their order.</p>'),

      h(2, 'ASC'),
      p('<p>Sorts results from lowest to highest (the default direction).</p>'),
      code('sql', `SELECT * FROM table_name\nORDER BY column ASC;`),
      code('sql', `SELECT * FROM Employee\nORDER BY salary ASC;`),
      p(ul([
        'Sorts salary from lowest to highest.',
        'Ascending is the default — ASC can be omitted entirely.',
      ])),
      callout('warning', '<p>Assuming a result\'s order without specifying <code>ORDER BY</code> on a column that isn\'t naturally ordered — without it, order is not guaranteed.</p>', 'Common Mistake'),

      h(2, 'DESC'),
      p('<p>Sorts results from highest to lowest.</p>'),
      code('sql', `SELECT * FROM table_name\nORDER BY column DESC;`),
      code('sql', `SELECT * FROM Employee\nORDER BY salary DESC;`),
      p(ul([
        'The highest salary appears first.',
        'Commonly used for rankings and leaderboards.',
      ])),
      callout('warning', '<p>Forgetting <code>DESC</code> applies only to the column it directly follows when sorting by multiple columns.</p>', 'Common Mistake'),

      p('<p>Sorting is straightforward once you know the two keywords. The next lesson covers something a bit bigger: collapsing rows into summarized groups with GROUP BY and HAVING.</p>'),
    ],
  },
  bn: {
    title: 'সর্টিং — ORDER BY',
    metaTitle: 'SQL Sorting — ORDER BY | Learn Computer Academy',
    metaDescription: 'ASC আর DESC — ORDER BY কীভাবে SQL ফলাফল কোন ক্রমে ফিরে আসবে তা নিয়ন্ত্রণ করে, কোন সারি ফেরত আসবে তা পরিবর্তন না করেই।',
    blocks: [
      p('<p><code>ORDER BY</code> নিয়ন্ত্রণ করে ফলাফল কোন ক্রমে ফিরে আসবে — এটি কোন সারি ফেরত আসবে তা বদলায় না, শুধু তাদের ক্রম বদলায়।</p>'),

      h(2, 'ASC', 'asc'),
      p('<p>ফলাফলকে সবচেয়ে কম থেকে সবচেয়ে বেশিতে সর্ট করে (ডিফল্ট দিক)।</p>'),
      code('sql', `SELECT * FROM table_name\nORDER BY column ASC;`),
      code('sql', `SELECT * FROM Employee\nORDER BY salary ASC;`),
      p(ul([
        'salary-কে সবচেয়ে কম থেকে সবচেয়ে বেশিতে সর্ট করে।',
        'ঊর্ধ্বক্রম ডিফল্ট — ASC সম্পূর্ণভাবে বাদ দেওয়া যায়।',
      ])),
      callout('warning', '<p>স্বাভাবিকভাবে সাজানো নয় এমন একটি কলামে <code>ORDER BY</code> নির্দিষ্ট না করেই ফলাফলের ক্রম ধরে নেওয়া — এটি ছাড়া ক্রম নিশ্চিত নয়।</p>', 'সাধারণ ভুল'),

      h(2, 'DESC', 'desc'),
      p('<p>ফলাফলকে সবচেয়ে বেশি থেকে সবচেয়ে কমে সর্ট করে।</p>'),
      code('sql', `SELECT * FROM table_name\nORDER BY column DESC;`),
      code('sql', `SELECT * FROM Employee\nORDER BY salary DESC;`),
      p(ul([
        'সবচেয়ে বেশি salary প্রথমে দেখায়।',
        'সাধারণত র‍্যাংকিং আর লিডারবোর্ডের জন্য ব্যবহৃত হয়।',
      ])),
      callout('warning', '<p>একাধিক কলাম দিয়ে সর্ট করার সময় <code>DESC</code> শুধু যে কলামের ঠিক পরে আসে তার উপরই প্রযোজ্য তা ভুলে যাওয়া।</p>', 'সাধারণ ভুল'),

      p('<p>দুটি কীওয়ার্ড জানা হয়ে গেলে সর্টিং সহজ। পরের পাঠে একটু বড় একটি বিষয় আলোচিত হবে: GROUP BY আর HAVING দিয়ে সারিগুলোকে সংক্ষিপ্ত গ্রুপে গুটিয়ে ফেলা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'group-by-having',
  sortOrder: 10,
  en: {
    title: 'Grouping — GROUP BY & HAVING',
    metaTitle: 'SQL Grouping — GROUP BY & HAVING | Learn Computer Academy',
    metaDescription: 'How GROUP BY collapses rows into summarized groups, and how HAVING filters those groups after they\'re formed — the difference from WHERE.',
    blocks: [
      p('<p><code>GROUP BY</code> collapses rows into summarized groups, and <code>HAVING</code> filters those groups after they\'re formed.</p>'),

      h(2, 'GROUP BY'),
      p('<p>Groups rows that share a value so aggregate functions can summarize each group.</p>'),
      code('sql', `SELECT column, AGG(column)\nFROM table_name\nGROUP BY column;`),
      code('sql', `SELECT department, COUNT(*)\nFROM Employee\nGROUP BY department;`),
      table(['department', 'count'], [['IT', '12'], ['HR', '5']], 'Result'),
      p(ul([
        'Groups rows by department.',
        'Returns exactly one summarized result per group.',
      ])),
      callout('warning', '<p>Selecting a column that\'s neither grouped nor wrapped in an aggregate function — most engines reject this outright.</p>', 'Common Mistake'),

      h(2, 'HAVING'),
      p('<p>Filters grouped results, the way <code>WHERE</code> filters individual rows.</p>'),
      code('sql', `SELECT column, AGG(column)\nFROM table_name\nGROUP BY column\nHAVING condition;`),
      code('sql', `SELECT department, COUNT(*)\nFROM Employee\nGROUP BY department\nHAVING COUNT(*) > 5;`),
      p(ul([
        'Filters groups after GROUP BY has formed them.',
        'Runs after grouping, whereas WHERE runs before — that ordering is the whole reason HAVING exists.',
      ])),
      callout('warning', '<p>Using <code>WHERE</code> to filter on an aggregate value — that\'s <code>HAVING</code>\'s job specifically, because the aggregate doesn\'t exist yet at the point WHERE runs.</p>', 'Common Mistake'),

      p('<p>Grouping and filtering set up the last piece of core querying: combining data from more than one table at once, with joins.</p>'),
    ],
  },
  bn: {
    title: 'গ্রুপিং — GROUP BY আর HAVING',
    metaTitle: 'SQL Grouping — GROUP BY & HAVING | Learn Computer Academy',
    metaDescription: 'GROUP BY কীভাবে সারিগুলোকে সংক্ষিপ্ত গ্রুপে গুটিয়ে ফেলে, আর HAVING কীভাবে সেই গ্রুপ তৈরি হওয়ার পর সেগুলো ফিল্টার করে — WHERE থেকে পার্থক্য।',
    blocks: [
      p('<p><code>GROUP BY</code> সারিগুলোকে সংক্ষিপ্ত গ্রুপে গুটিয়ে ফেলে, আর <code>HAVING</code> সেই গ্রুপ তৈরি হওয়ার পর সেগুলো ফিল্টার করে।</p>'),

      h(2, 'GROUP BY', 'group-by'),
      p('<p>একই মান শেয়ার করা সারিগুলোকে গ্রুপ করে, যাতে অ্যাগ্রিগেট ফাংশন প্রতিটি গ্রুপ সংক্ষিপ্ত করতে পারে।</p>'),
      code('sql', `SELECT column, AGG(column)\nFROM table_name\nGROUP BY column;`),
      code('sql', `SELECT department, COUNT(*)\nFROM Employee\nGROUP BY department;`),
      table(['department', 'count'], [['IT', '12'], ['HR', '5']], 'ফলাফল'),
      p(ul([
        'বিভাগ অনুযায়ী সারিগুলো গ্রুপ করে।',
        'প্রতিটি গ্রুপের জন্য ঠিক একটি সংক্ষিপ্ত ফলাফল ফেরত দেয়।',
      ])),
      callout('warning', '<p>এমন একটি কলাম সিলেক্ট করা যা গ্রুপ করা নয়, আবার কোনো অ্যাগ্রিগেট ফাংশনেও মোড়ানো নয় — বেশিরভাগ ইঞ্জিন এটি সরাসরি প্রত্যাখ্যান করে।</p>', 'সাধারণ ভুল'),

      h(2, 'HAVING', 'having'),
      p('<p>গ্রুপ করা ফলাফল ফিল্টার করে, যেভাবে <code>WHERE</code> আলাদা আলাদা সারি ফিল্টার করে।</p>'),
      code('sql', `SELECT column, AGG(column)\nFROM table_name\nGROUP BY column\nHAVING condition;`),
      code('sql', `SELECT department, COUNT(*)\nFROM Employee\nGROUP BY department\nHAVING COUNT(*) > 5;`),
      p(ul([
        'GROUP BY গ্রুপ তৈরি করার পর সেগুলো ফিল্টার করে।',
        'গ্রুপিং-এর পরে চলে, যেখানে WHERE আগে চলে — এই ক্রমই HAVING থাকার পুরো কারণ।',
      ])),
      callout('warning', '<p>একটি অ্যাগ্রিগেট মানের উপর ফিল্টার করতে <code>WHERE</code> ব্যবহার করা — এটি নির্দিষ্টভাবে <code>HAVING</code>-এর কাজ, কারণ WHERE চলার সময় অ্যাগ্রিগেটটি তখনও তৈরিই হয়নি।</p>', 'সাধারণ ভুল'),

      p('<p>গ্রুপিং আর ফিল্টারিং মূল কোয়েরির শেষ অংশটির ভিত্তি তৈরি করে দেয়: জয়েনের মাধ্যমে একই সাথে একাধিক টেবিলের তথ্য একত্র করা।</p>'),
    ],
  },
})

lessons.push({
  slug: 'joins',
  sortOrder: 11,
  en: {
    title: 'Joins',
    metaTitle: 'SQL Joins | Learn Computer Academy',
    metaDescription: 'INNER, LEFT, RIGHT, and FULL JOIN explained — how to combine rows from two or more tables based on a related column, most often a foreign key.',
    blocks: [
      p('<p>Joins combine rows from two or more tables based on a related column, most often a foreign key. This is where relational databases really earn the "relational" in their name.</p>'),

      h(2, 'INNER JOIN'),
      p('<p>Returns only rows that have a match in both tables.</p>'),
      code('sql', `SELECT columns\nFROM tableA\nINNER JOIN tableB ON condition;`),
      code('sql', `SELECT e.name, d.department_name\nFROM Employee e\nINNER JOIN Department d\nON e.department_id = d.id;`),
      p(ul([
        'Returns matching records only.',
        'The most commonly used join type.',
      ])),
      callout('warning', '<p>Joining on the wrong column and silently multiplying rows.</p>', 'Common Mistake'),

      h(2, 'LEFT JOIN'),
      p('<p>Returns every row from the left table, matched rows from the right.</p>'),
      code('sql', `SELECT columns\nFROM tableA\nLEFT JOIN tableB ON condition;`),
      code('sql', `SELECT e.name, d.department_name\nFROM Employee e\nLEFT JOIN Department d\nON e.department_id = d.id;`),
      p(ul([
        'Every row from Employee appears, even without a department match.',
        'Unmatched columns from Department come back as NULL.',
      ])),
      callout('warning', '<p>Expecting a <code>LEFT JOIN</code> to exclude unmatched left-side rows — it never does, that\'s the entire point of a LEFT JOIN.</p>', 'Common Mistake'),

      h(2, 'RIGHT JOIN'),
      p('<p>Returns every row from the right table, matched rows from the left.</p>'),
      code('sql', `SELECT columns\nFROM tableA\nRIGHT JOIN tableB ON condition;`),
      code('sql', `SELECT e.name, d.department_name\nFROM Employee e\nRIGHT JOIN Department d\nON e.department_id = d.id;`),
      p(ul([
        'Every row from Department appears, even with no matching employees.',
        'The mirror image of a LEFT JOIN.',
      ])),
      callout('warning', '<p>Using <code>RIGHT JOIN</code> out of habit when a LEFT JOIN with the table order swapped would read more clearly.</p>', 'Common Mistake'),

      h(2, 'FULL JOIN'),
      p('<p>Returns all rows from both tables, matched or not.</p>'),
      code('sql', `SELECT columns\nFROM tableA\nFULL JOIN tableB ON condition;`),
      code('sql', `SELECT e.name, d.department_name\nFROM Employee e\nFULL JOIN Department d\nON e.department_id = d.id;`),
      p(ul([
        'Combines every row from both tables.',
        'Non-matching sides come back as NULL.',
      ])),
      callout('warning', '<p>Not every database engine supports <code>FULL JOIN</code> natively — MySQL does not, for example, and needs a workaround.</p>', 'Common Mistake'),

      h(2, 'At a Glance'),
      table(
        ['Join type', 'Returns'],
        [
          ['INNER JOIN', 'Only rows that match in both tables'],
          ['LEFT JOIN', 'Every left-table row, matched right-table data or NULL'],
          ['RIGHT JOIN', 'Every right-table row, matched left-table data or NULL'],
          ['FULL JOIN', 'Every row from both tables, matched or not'],
        ]
      ),
      img(
        'docs/img/sql/joins-1',
        'Venn diagram comparing INNER, LEFT, RIGHT, and FULL JOIN, showing which region of two overlapping tables each join type returns',
        1024, 768,
        'The shaded region is what each join type actually returns — the rest is left out.'
      ),

      p('<p>Joins let you pull related data together from separate tables. The next lesson moves from combining tables to summarizing values within them, with SQL\'s built-in functions.</p>'),
    ],
  },
  bn: {
    title: 'জয়েন',
    metaTitle: 'SQL Joins | Learn Computer Academy',
    metaDescription: 'INNER, LEFT, RIGHT, আর FULL JOIN ব্যাখ্যা করা হয়েছে — একটি সম্পর্কিত কলাম, প্রায়ই একটি ফরেন কী-এর ভিত্তিতে দুই বা ততোধিক টেবিলের সারি কীভাবে একত্র করবেন।',
    blocks: [
      p('<p>জয়েন একটি সম্পর্কিত কলাম, প্রায়ই একটি ফরেন কী-এর ভিত্তিতে দুই বা ততোধিক টেবিলের সারি একত্র করে। এখানেই রিলেশনাল ডেটাবেস তার নামের "রিলেশনাল" অংশটি সত্যিকারভাবে অর্জন করে।</p>'),

      h(2, 'INNER JOIN', 'inner-join'),
      p('<p>শুধু সেই সারিগুলো ফেরত দেয় যাদের দুটো টেবিলেই মিল আছে।</p>'),
      code('sql', `SELECT columns\nFROM tableA\nINNER JOIN tableB ON condition;`),
      code('sql', `SELECT e.name, d.department_name\nFROM Employee e\nINNER JOIN Department d\nON e.department_id = d.id;`),
      p(ul([
        'শুধু মিলে যাওয়া রেকর্ড ফেরত দেয়।',
        'সবচেয়ে বেশি ব্যবহৃত জয়েন ধরন।',
      ])),
      callout('warning', '<p>ভুল কলামে জয়েন করা আর নিঃশব্দে সারি গুণিত হয়ে যাওয়া।</p>', 'সাধারণ ভুল'),

      h(2, 'LEFT JOIN', 'left-join'),
      p('<p>বাম টেবিলের প্রতিটি সারি ফেরত দেয়, ডান টেবিলের শুধু মিলে যাওয়া সারি।</p>'),
      code('sql', `SELECT columns\nFROM tableA\nLEFT JOIN tableB ON condition;`),
      code('sql', `SELECT e.name, d.department_name\nFROM Employee e\nLEFT JOIN Department d\nON e.department_id = d.id;`),
      p(ul([
        'Employee-এর প্রতিটি সারি দেখা যায়, বিভাগের মিল না থাকলেও।',
        'Department-এর অমিলিত কলাম NULL হিসেবে ফিরে আসে।',
      ])),
      callout('warning', '<p><code>LEFT JOIN</code> অমিলিত বাম-পাশের সারি বাদ দেবে বলে আশা করা — এটি কখনো তা করে না, এটাই একটি LEFT JOIN-এর পুরো উদ্দেশ্য।</p>', 'সাধারণ ভুল'),

      h(2, 'RIGHT JOIN', 'right-join'),
      p('<p>ডান টেবিলের প্রতিটি সারি ফেরত দেয়, বাম টেবিলের শুধু মিলে যাওয়া সারি।</p>'),
      code('sql', `SELECT columns\nFROM tableA\nRIGHT JOIN tableB ON condition;`),
      code('sql', `SELECT e.name, d.department_name\nFROM Employee e\nRIGHT JOIN Department d\nON e.department_id = d.id;`),
      p(ul([
        'Department-এর প্রতিটি সারি দেখা যায়, মিলে যাওয়া কোনো কর্মচারী না থাকলেও।',
        'LEFT JOIN-এর ঠিক আয়না-প্রতিবিম্ব।',
      ])),
      callout('warning', '<p>টেবিলের ক্রম উল্টে দিয়ে একটি LEFT JOIN আরও পরিষ্কারভাবে পড়া যেত এমন জায়গায় অভ্যাসবশত <code>RIGHT JOIN</code> ব্যবহার করা।</p>', 'সাধারণ ভুল'),

      h(2, 'FULL JOIN', 'full-join'),
      p('<p>দুটো টেবিলেরই সব সারি ফেরত দেয়, মিল থাকুক বা না থাকুক।</p>'),
      code('sql', `SELECT columns\nFROM tableA\nFULL JOIN tableB ON condition;`),
      code('sql', `SELECT e.name, d.department_name\nFROM Employee e\nFULL JOIN Department d\nON e.department_id = d.id;`),
      p(ul([
        'দুটো টেবিলেরই প্রতিটি সারি একত্র করে।',
        'অমিলিত দিকগুলো NULL হিসেবে ফিরে আসে।',
      ])),
      callout('warning', '<p>প্রতিটি ডেটাবেস ইঞ্জিন সরাসরি <code>FULL JOIN</code> সমর্থন করে না — যেমন MySQL করে না, আর এর জন্য একটি বিকল্প উপায় প্রয়োজন।</p>', 'সাধারণ ভুল'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['জয়েন ধরন', 'যা ফেরত দেয়'],
        [
          ['INNER JOIN', 'শুধু দুটো টেবিলেই মিলে যাওয়া সারি'],
          ['LEFT JOIN', 'বাম-টেবিলের প্রতিটি সারি, মিলে যাওয়া ডান-টেবিলের তথ্য বা NULL'],
          ['RIGHT JOIN', 'ডান-টেবিলের প্রতিটি সারি, মিলে যাওয়া বাম-টেবিলের তথ্য বা NULL'],
          ['FULL JOIN', 'দুটো টেবিলেরই প্রতিটি সারি, মিল থাকুক বা না থাকুক'],
        ]
      ),
      img(
        'docs/img/sql/joins-1',
        'INNER, LEFT, RIGHT, আর FULL JOIN তুলনা করা ভেন ডায়াগ্রাম, দুটো ওভারল্যাপিং টেবিলের কোন অংশ প্রতিটি জয়েন ধরন ফেরত দেয় তা দেখাচ্ছে',
        1024, 768,
        'ছায়াযুক্ত অংশটিই আসলে প্রতিটি জয়েন ধরন ফেরত দেয় — বাকিটা বাদ পড়ে।'
      ),

      p('<p>জয়েন আপনাকে আলাদা আলাদা টেবিল থেকে সম্পর্কিত তথ্য একসাথে টেনে আনতে দেয়। পরের পাঠে আমরা টেবিল একত্র করা থেকে সরে গিয়ে সেগুলোর ভেতরের মান সংক্ষিপ্ত করার দিকে যাব, SQL-এর বিল্ট-ইন ফাংশন দিয়ে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'functions',
  sortOrder: 12,
  en: {
    title: 'Functions — Aggregate, String, Date, Numeric',
    metaTitle: 'SQL Functions | Learn Computer Academy',
    metaDescription: 'COUNT, SUM, AVG, MIN/MAX, plus string, date, and numeric functions — built-in SQL functions that transform or summarize values without procedural code.',
    blocks: [
      p('<p>Built-in functions transform or summarize values without you writing any procedural logic. This lesson covers the ones you\'ll reach for constantly.</p>'),

      h(2, 'COUNT()'),
      p('<p>Counts the number of rows.</p>'),
      code('sql', 'SELECT COUNT(*) FROM table_name;'),
      code('sql', 'SELECT COUNT(*) FROM Employee;'),
      p(ul([
        'Counts total rows.',
        'NULL handling depends on whether you pass <code>*</code> or a specific column — COUNT(column) skips NULLs in that column, COUNT(*) doesn\'t.',
      ])),
      callout('warning', '<p>Using <code>COUNT(column)</code> expecting it to count NULLs — it doesn\'t.</p>', 'Common Mistake'),

      h(2, 'SUM()'),
      p('<p>Adds up all values in a numeric column.</p>'),
      code('sql', 'SELECT SUM(column) FROM table_name;'),
      code('sql', 'SELECT SUM(salary) FROM Employee;'),
      p(ul([
        'Adds every salary value.',
        'Ignores NULL values automatically.',
      ])),
      callout('warning', '<p>Applying <code>SUM</code> to a non-numeric column.</p>', 'Common Mistake'),

      h(2, 'AVG()'),
      p('<p>Returns the mean of a numeric column.</p>'),
      code('sql', 'SELECT AVG(column) FROM table_name;'),
      code('sql', 'SELECT AVG(salary) FROM Employee;'),
      p(ul([
        'Returns the average salary.',
        'Ignores NULL values in the calculation.',
      ])),
      callout('warning', '<p>Forgetting <code>AVG</code> ignores NULLs, which can skew results versus a manual calculation done elsewhere.</p>', 'Common Mistake'),

      h(2, 'MIN() / MAX()'),
      p('<p>Returns the smallest or largest value in a column.</p>'),
      code('sql', 'SELECT MIN(column), MAX(column) FROM table_name;'),
      code('sql', 'SELECT MIN(salary), MAX(salary) FROM Employee;'),
      p(ul([
        'Works with numbers, dates, and text alike.',
        'Useful for finding ranges at a glance.',
      ])),
      callout('warning', '<p>Calling MIN/MAX per row in application code instead of letting the engine aggregate it in one pass.</p>', 'Common Mistake'),

      h(2, 'String Functions'),
      p('<p>Manipulate text values — casing, joining, trimming, extracting.</p>'),
      code('sql', 'UPPER(col) · LOWER(col) · CONCAT(a,b) · SUBSTRING(col,start,len) · TRIM(col) · LENGTH(col)'),
      code('sql', `SELECT UPPER(name), CONCAT(name, ' - ', department)\nFROM Employee;`),
      p(ul([
        'UPPER/LOWER change case; CONCAT joins strings together.',
        'SUBSTRING extracts part of a string; TRIM removes leading/trailing spaces.',
      ])),
      callout('warning', '<p>Comparing strings without normalizing case first, missing matches that a human would consider identical.</p>', 'Common Mistake'),

      h(2, 'Date Functions'),
      p('<p>Work with dates and times — current date, differences, arithmetic.</p>'),
      code('sql', 'NOW() · CURDATE() · DATEDIFF(a,b) · DATE_ADD(date, INTERVAL n unit)'),
      code('sql', `SELECT DATEDIFF(NOW(), hire_date) AS days_employed\nFROM Employee;`),
      p(ul([
        'NOW()/CURDATE() return the current timestamp or date.',
        'DATEDIFF and DATE_ADD let you calculate durations and future/past dates.',
      ])),
      callout('warning', '<p>Comparing DATE and DATETIME columns directly without matching precision first.</p>', 'Common Mistake'),

      h(2, 'Numeric Functions'),
      p('<p>Perform math on numeric values directly in a query.</p>'),
      code('sql', 'ROUND(col, n) · ABS(col) · MOD(a, b)'),
      code('sql', `SELECT ROUND(salary / 12, 2) AS monthly_pay\nFROM Employee;`),
      p(ul([
        'ROUND controls decimal precision; ABS strips a negative sign.',
        'MOD returns the remainder of division — handy for pagination or cycling values.',
      ])),
      callout('warning', '<p>Rounding in application code instead of the query, causing display mismatches between the two.</p>', 'Common Mistake'),

      p('<p>Functions handle the everyday math and text work. The next lesson covers window functions — a related but more powerful tool for calculating across a set of rows without collapsing them into one.</p>'),
    ],
  },
  bn: {
    title: 'ফাংশন — অ্যাগ্রিগেট, স্ট্রিং, তারিখ, সংখ্যাসূচক',
    metaTitle: 'SQL Functions | Learn Computer Academy',
    metaDescription: 'COUNT, SUM, AVG, MIN/MAX, সাথে স্ট্রিং, তারিখ, আর সংখ্যাসূচক ফাংশন — বিল্ট-ইন SQL ফাংশন যা কোনো প্রসিডিউরাল কোড ছাড়াই মান রূপান্তর বা সংক্ষিপ্ত করে।',
    blocks: [
      p('<p>বিল্ট-ইন ফাংশন কোনো প্রসিডিউরাল লজিক না লিখেই মান রূপান্তর বা সংক্ষিপ্ত করে। এই পাঠে সেই ফাংশনগুলো আলোচনা করা হবে যা আপনি ক্রমাগত ব্যবহার করবেন।</p>'),

      h(2, 'COUNT()', 'count'),
      p('<p>সারির সংখ্যা গণনা করে।</p>'),
      code('sql', 'SELECT COUNT(*) FROM table_name;'),
      code('sql', 'SELECT COUNT(*) FROM Employee;'),
      p(ul([
        'মোট সারি গণনা করে।',
        'NULL কীভাবে সামলানো হয় তা নির্ভর করে আপনি <code>*</code> নাকি একটি নির্দিষ্ট কলাম দিচ্ছেন তার উপর — COUNT(column) সেই কলামের NULL বাদ দেয়, COUNT(*) দেয় না।',
      ])),
      callout('warning', '<p><code>COUNT(column)</code> NULL গণনা করবে বলে আশা করা — এটি করে না।</p>', 'সাধারণ ভুল'),

      h(2, 'SUM()', 'sum'),
      p('<p>একটি সংখ্যাসূচক কলামের সব মান যোগ করে।</p>'),
      code('sql', 'SELECT SUM(column) FROM table_name;'),
      code('sql', 'SELECT SUM(salary) FROM Employee;'),
      p(ul([
        'প্রতিটি salary মান যোগ করে।',
        'NULL মান স্বয়ংক্রিয়ভাবে উপেক্ষা করে।',
      ])),
      callout('warning', '<p>একটি নন-নিউমেরিক কলামে <code>SUM</code> প্রয়োগ করা।</p>', 'সাধারণ ভুল'),

      h(2, 'AVG()', 'avg'),
      p('<p>একটি সংখ্যাসূচক কলামের গড় মান ফেরত দেয়।</p>'),
      code('sql', 'SELECT AVG(column) FROM table_name;'),
      code('sql', 'SELECT AVG(salary) FROM Employee;'),
      p(ul([
        'গড় salary ফেরত দেয়।',
        'গণনায় NULL মান উপেক্ষা করে।',
      ])),
      callout('warning', '<p><code>AVG</code> NULL উপেক্ষা করে তা ভুলে যাওয়া, যা অন্য কোথাও হাতে করা একটি হিসাবের সাথে তুলনা করলে ফলাফল বিকৃত করতে পারে।</p>', 'সাধারণ ভুল'),

      h(2, 'MIN() / MAX()', 'min-max'),
      p('<p>একটি কলামের সবচেয়ে ছোট বা সবচেয়ে বড় মান ফেরত দেয়।</p>'),
      code('sql', 'SELECT MIN(column), MAX(column) FROM table_name;'),
      code('sql', 'SELECT MIN(salary), MAX(salary) FROM Employee;'),
      p(ul([
        'সংখ্যা, তারিখ, আর টেক্সট — সবকিছুর সাথেই কাজ করে।',
        'এক নজরে পরিসর খুঁজে বের করতে কাজে লাগে।',
      ])),
      callout('warning', '<p>ইঞ্জিনকে এক ধাপে অ্যাগ্রিগেট করতে দেওয়ার বদলে অ্যাপ্লিকেশন কোডে প্রতিটি সারির জন্য MIN/MAX ডাকা।</p>', 'সাধারণ ভুল'),

      h(2, 'স্ট্রিং ফাংশন', 'string-functions'),
      p('<p>টেক্সট মান নিয়ে কাজ করে — কেসিং, জোড়া লাগানো, ট্রিম করা, বের করে আনা।</p>'),
      code('sql', 'UPPER(col) · LOWER(col) · CONCAT(a,b) · SUBSTRING(col,start,len) · TRIM(col) · LENGTH(col)'),
      code('sql', `SELECT UPPER(name), CONCAT(name, ' - ', department)\nFROM Employee;`),
      p(ul([
        'UPPER/LOWER কেস বদলায়; CONCAT স্ট্রিং একসাথে জোড়া দেয়।',
        'SUBSTRING একটি স্ট্রিং-এর অংশ বের করে; TRIM শুরু/শেষের স্পেস সরিয়ে দেয়।',
      ])),
      callout('warning', '<p>আগে কেস স্বাভাবিক না করে স্ট্রিং তুলনা করা, যার ফলে এমন মিল বাদ পড়ে যা একজন মানুষ অভিন্ন বলেই ধরে নিতেন।</p>', 'সাধারণ ভুল'),

      h(2, 'তারিখ ফাংশন', 'date-functions'),
      p('<p>তারিখ আর সময় নিয়ে কাজ করে — বর্তমান তারিখ, পার্থক্য, গাণিতিক হিসাব।</p>'),
      code('sql', 'NOW() · CURDATE() · DATEDIFF(a,b) · DATE_ADD(date, INTERVAL n unit)'),
      code('sql', `SELECT DATEDIFF(NOW(), hire_date) AS days_employed\nFROM Employee;`),
      p(ul([
        'NOW()/CURDATE() বর্তমান টাইমস্ট্যাম্প বা তারিখ ফেরত দেয়।',
        'DATEDIFF আর DATE_ADD আপনাকে সময়কাল আর ভবিষ্যৎ/অতীত তারিখ গণনা করতে দেয়।',
      ])),
      callout('warning', '<p>আগে নির্ভুলতা না মিলিয়েই DATE আর DATETIME কলাম সরাসরি তুলনা করা।</p>', 'সাধারণ ভুল'),

      h(2, 'সংখ্যাসূচক ফাংশন', 'numeric-functions'),
      p('<p>একটি কোয়েরির ভেতরেই সংখ্যাসূচক মানে গণিত করে।</p>'),
      code('sql', 'ROUND(col, n) · ABS(col) · MOD(a, b)'),
      code('sql', `SELECT ROUND(salary / 12, 2) AS monthly_pay\nFROM Employee;`),
      p(ul([
        'ROUND দশমিক নির্ভুলতা নিয়ন্ত্রণ করে; ABS একটি ঋণাত্মক চিহ্ন সরিয়ে দেয়।',
        'MOD ভাগের অবশিষ্টাংশ ফেরত দেয় — পেজিনেশন বা চক্রাকার মানের জন্য কাজে লাগে।',
      ])),
      callout('warning', '<p>কোয়েরির বদলে অ্যাপ্লিকেশন কোডে রাউন্ড করা, যা দুইয়ের মধ্যে প্রদর্শনের অমিল তৈরি করে।</p>', 'সাধারণ ভুল'),

      p('<p>ফাংশন দৈনন্দিন গণিত আর টেক্সটের কাজ সামলায়। পরের পাঠে উইন্ডো ফাংশন নিয়ে আলোচনা হবে — একটি সম্পর্কিত কিন্তু আরও শক্তিশালী টুল, সারিগুলোকে একটিতে গুটিয়ে না ফেলেই একদল সারি জুড়ে গণনা করার জন্য।</p>'),
    ],
  },
})

lessons.push({
  slug: 'window-functions',
  sortOrder: 13,
  en: {
    title: 'Window Functions',
    metaTitle: 'SQL Window Functions | Learn Computer Academy',
    metaDescription: 'ROW_NUMBER, RANK, DENSE_RANK, NTILE, and LAG/LEAD — calculating across a set of related rows without collapsing them into one, the way GROUP BY does.',
    blocks: [
      p('<p>Window functions calculate across a set of related rows without collapsing them into one, the way <code>GROUP BY</code> does. Every input row keeps its place in the output — the function just adds a calculated value alongside it.</p>'),

      h(2, 'ROW_NUMBER()'),
      p('<p>Assigns a unique, sequential number to each row within a window.</p>'),
      code('sql', 'ROW_NUMBER() OVER (ORDER BY column);'),
      code('sql', `SELECT name, salary,\nROW_NUMBER() OVER (ORDER BY salary DESC) AS rank\nFROM Employee;`),
      p(ul([
        'Assigns unique row numbers.',
        'No two rows ever share the same number, even on ties.',
      ])),
      callout('warning', '<p>Forgetting to <code>PARTITION BY</code> when the numbering should restart per group instead of running across the whole result.</p>', 'Common Mistake'),

      h(2, 'RANK()'),
      p('<p>Ranks rows, giving the same rank to ties and skipping the next number.</p>'),
      code('sql', 'RANK() OVER (ORDER BY column);'),
      code('sql', `SELECT name, salary,\nRANK() OVER (ORDER BY salary DESC) AS rank\nFROM Employee;`),
      p(ul([
        'Equal values receive the same rank.',
        'The next rank is skipped to account for the tie (1, 2, 2, 4...).',
      ])),
      callout('warning', '<p>Expecting <code>RANK</code> to produce consecutive numbers when ties exist — it deliberately doesn\'t.</p>', 'Common Mistake'),

      h(2, 'DENSE_RANK()'),
      p('<p>Like RANK, but never skips a number after a tie.</p>'),
      code('sql', 'DENSE_RANK() OVER (ORDER BY column);'),
      code('sql', `SELECT name, salary,\nDENSE_RANK() OVER (ORDER BY salary DESC) AS rank\nFROM Employee;`),
      p(ul([
        'Equal values receive the same rank.',
        'No numbers are skipped afterward (1, 2, 2, 3...).',
      ])),
      callout('warning', '<p>Using <code>DENSE_RANK</code> when standard competition ranking (with gaps, i.e. <code>RANK</code>) was actually intended.</p>', 'Common Mistake'),

      img(
        'docs/img/sql/window-functions-1',
        'Table comparing how ROW_NUMBER, RANK, and DENSE_RANK number the same five rows differently when two rows tie on value',
        1024, 768,
        'The same tie between two rows produces three different numbering results, depending on which function you use.'
      ),

      h(2, 'NTILE()'),
      p('<p>Splits rows into a fixed number of roughly equal groups.</p>'),
      code('sql', 'NTILE(n) OVER (ORDER BY column);'),
      code('sql', `SELECT name, salary,\nNTILE(4) OVER (ORDER BY salary DESC) AS quartile\nFROM Employee;`),
      p(ul([
        'Splits rows into equal-sized groups.',
        'Useful for quartiles, percentiles, or bucketed segments.',
      ])),
      callout('warning', '<p>Assuming every group has exactly the same size when the row count doesn\'t divide evenly by <code>n</code>.</p>', 'Common Mistake'),

      h(2, 'LAG() / LEAD()'),
      p('<p>Reads a value from a previous or following row without a self-join.</p>'),
      code('sql', `LAG(column) OVER (ORDER BY column);\nLEAD(column) OVER (ORDER BY column);`),
      code('sql', `SELECT name, salary,\nLAG(salary) OVER (ORDER BY hire_date) AS prev_salary\nFROM Employee;`),
      p(ul([
        'LAG accesses the previous row\'s value; LEAD accesses the next.',
        'Useful for comparisons and trend analysis across ordered rows.',
      ])),
      callout('warning', '<p>Forgetting <code>ORDER BY</code> inside <code>OVER()</code>, which makes "previous" and "next" row undefined.</p>', 'Common Mistake'),

      p('<p>Window functions are one of the more advanced tools in this section — the next lesson covers another: subqueries, a query nested inside another query.</p>'),
    ],
  },
  bn: {
    title: 'উইন্ডো ফাংশন',
    metaTitle: 'SQL Window Functions | Learn Computer Academy',
    metaDescription: 'ROW_NUMBER, RANK, DENSE_RANK, NTILE, আর LAG/LEAD — GROUP BY যেভাবে করে সেভাবে সারিগুলোকে একটিতে গুটিয়ে না ফেলেই একদল সম্পর্কিত সারি জুড়ে গণনা করা।',
    blocks: [
      p('<p>উইন্ডো ফাংশন <code>GROUP BY</code> যেভাবে করে সেভাবে সারিগুলোকে একটিতে গুটিয়ে না ফেলেই একদল সম্পর্কিত সারি জুড়ে গণনা করে। প্রতিটি ইনপুট সারি আউটপুটে তার জায়গা ধরে রাখে — ফাংশনটি শুধু তার পাশে একটি গণনা করা মান যোগ করে।</p>'),

      h(2, 'ROW_NUMBER()', 'row_number'),
      p('<p>একটি উইন্ডোর ভেতরে প্রতিটি সারিকে একটি অনন্য, ক্রমিক সংখ্যা দেয়।</p>'),
      code('sql', 'ROW_NUMBER() OVER (ORDER BY column);'),
      code('sql', `SELECT name, salary,\nROW_NUMBER() OVER (ORDER BY salary DESC) AS rank\nFROM Employee;`),
      p(ul([
        'অনন্য সারি সংখ্যা দেয়।',
        'টাই হলেও কোনো দুটো সারি কখনো একই সংখ্যা শেয়ার করে না।',
      ])),
      callout('warning', '<p>নম্বরিং পুরো ফলাফল জুড়ে না চলে প্রতিটি গ্রুপ থেকে আবার শুরু হওয়া উচিত হলে <code>PARTITION BY</code> দিতে ভুলে যাওয়া।</p>', 'সাধারণ ভুল'),

      h(2, 'RANK()', 'rank'),
      p('<p>সারিগুলোকে র‍্যাংক দেয়, টাইকে একই র‍্যাংক দেয় আর পরের সংখ্যা বাদ দেয়।</p>'),
      code('sql', 'RANK() OVER (ORDER BY column);'),
      code('sql', `SELECT name, salary,\nRANK() OVER (ORDER BY salary DESC) AS rank\nFROM Employee;`),
      p(ul([
        'সমান মান একই র‍্যাংক পায়।',
        'টাই-এর হিসাবে পরের র‍্যাংক বাদ দেওয়া হয় (1, 2, 2, 4...)।',
      ])),
      callout('warning', '<p>টাই থাকলে <code>RANK</code> ধারাবাহিক সংখ্যা তৈরি করবে বলে আশা করা — এটি ইচ্ছাকৃতভাবেই করে না।</p>', 'সাধারণ ভুল'),

      h(2, 'DENSE_RANK()', 'dense_rank'),
      p('<p>RANK-এর মতোই, কিন্তু টাই-এর পর কখনো কোনো সংখ্যা বাদ দেয় না।</p>'),
      code('sql', 'DENSE_RANK() OVER (ORDER BY column);'),
      code('sql', `SELECT name, salary,\nDENSE_RANK() OVER (ORDER BY salary DESC) AS rank\nFROM Employee;`),
      p(ul([
        'সমান মান একই র‍্যাংক পায়।',
        'এরপর কোনো সংখ্যা বাদ দেওয়া হয় না (1, 2, 2, 3...)।',
      ])),
      callout('warning', '<p>যখন আসলে ব্যবধানসহ স্ট্যান্ডার্ড প্রতিযোগিতার র‍্যাংকিং (অর্থাৎ <code>RANK</code>) দরকার ছিল, তখন <code>DENSE_RANK</code> ব্যবহার করা।</p>', 'সাধারণ ভুল'),

      img(
        'docs/img/sql/window-functions-1',
        'দুটো সারির মান টাই হলে ROW_NUMBER, RANK, আর DENSE_RANK একই পাঁচটি সারিকে কীভাবে ভিন্নভাবে নম্বর দেয় তা তুলনা করা টেবিল',
        1024, 768,
        'দুটো সারির মধ্যে একই টাই তিনটি ভিন্ন ফাংশন ব্যবহার করলে তিন রকম নম্বরিং ফলাফল তৈরি করে।'
      ),

      h(2, 'NTILE()', 'ntile'),
      p('<p>সারিগুলোকে একটি নির্দিষ্ট সংখ্যক প্রায়-সমান গ্রুপে ভাগ করে।</p>'),
      code('sql', 'NTILE(n) OVER (ORDER BY column);'),
      code('sql', `SELECT name, salary,\nNTILE(4) OVER (ORDER BY salary DESC) AS quartile\nFROM Employee;`),
      p(ul([
        'সারিগুলোকে সমান-আকারের গ্রুপে ভাগ করে।',
        'কোয়ার্টাইল, পার্সেন্টাইল, বা বাকেট করা সেগমেন্টের জন্য কাজে লাগে।',
      ])),
      callout('warning', '<p>সারির সংখ্যা <code>n</code> দিয়ে সমানভাবে ভাগ না হলেও প্রতিটি গ্রুপের আকার ঠিক সমান হবে বলে ধরে নেওয়া।</p>', 'সাধারণ ভুল'),

      h(2, 'LAG() / LEAD()', 'lag-lead'),
      p('<p>একটি সেলফ-জয়েন ছাড়াই আগের বা পরের সারি থেকে একটি মান পড়ে।</p>'),
      code('sql', `LAG(column) OVER (ORDER BY column);\nLEAD(column) OVER (ORDER BY column);`),
      code('sql', `SELECT name, salary,\nLAG(salary) OVER (ORDER BY hire_date) AS prev_salary\nFROM Employee;`),
      p(ul([
        'LAG আগের সারির মান অ্যাক্সেস করে; LEAD পরের সারিরটি করে।',
        'সাজানো সারি জুড়ে তুলনা আর ট্রেন্ড বিশ্লেষণের জন্য কাজে লাগে।',
      ])),
      callout('warning', '<p><code>OVER()</code>-এর ভেতরে <code>ORDER BY</code> দিতে ভুলে যাওয়া, যা "আগের" আর "পরের" সারিকে অনির্ধারিত করে দেয়।</p>', 'সাধারণ ভুল'),

      p('<p>উইন্ডো ফাংশন এই অংশের আরও উন্নত টুলগুলোর একটি — পরের পাঠে আরেকটি আলোচনা হবে: সাবকোয়েরি, একটি কোয়েরির ভেতরে বসানো আরেকটি কোয়েরি।</p>'),
    ],
  },
})

lessons.push({
  slug: 'subqueries',
  sortOrder: 14,
  en: {
    title: 'Subqueries',
    metaTitle: 'SQL Subqueries | Learn Computer Academy',
    metaDescription: 'Single-row, multi-row, correlated subqueries, and subqueries in FROM — how to nest one query inside another to feed a value, list, or result set into it.',
    blocks: [
      p('<p>A <b>subquery</b> is a query nested inside another — used to feed a value, a list, or a whole result set into the outer query.</p>'),

      h(2, 'Single-Row Subquery'),
      p('<p>A subquery that returns exactly one value, usable anywhere a single value is expected.</p>'),
      code('sql', 'WHERE column = (SELECT ... );'),
      code('sql', `SELECT name FROM Employee\nWHERE salary = (SELECT MAX(salary) FROM Employee);`),
      p(ul([
        'The inner query resolves to a single number first.',
        'The outer query then filters against that value.',
      ])),
      callout('warning', '<p>Using <code>=</code> when the subquery could return more than one row, which causes an error.</p>', 'Common Mistake'),

      h(2, 'Multi-Row Subquery'),
      p('<p>A subquery that returns a list of values, paired with <code>IN</code>, <code>ANY</code>, or <code>ALL</code>.</p>'),
      code('sql', 'WHERE column IN (SELECT ... );'),
      code('sql', `SELECT name FROM Employee\nWHERE department_id IN (\n  SELECT id FROM Department WHERE location = 'Kolkata'\n);`),
      p(ul([
        'The inner query returns a list of department IDs.',
        'The outer query keeps only employees whose department is in that list.',
      ])),
      callout('warning', '<p>Using <code>=</code> instead of <code>IN</code> when the subquery can return multiple rows.</p>', 'Common Mistake'),

      h(2, 'Correlated Subquery'),
      p('<p>A subquery that references a column from the outer query, re-running once per outer row.</p>'),
      code('sql', 'WHERE EXISTS (SELECT 1 FROM ... WHERE outer.col = inner.col);'),
      code('sql', `SELECT name FROM Employee e\nWHERE salary > (\n  SELECT AVG(salary) FROM Employee\n  WHERE department = e.department\n);`),
      p(ul([
        'The inner query recalculates for every row in the outer query.',
        'Finds employees earning above their own department\'s average.',
      ])),
      callout('warning', '<p>Using a correlated subquery over a huge table without an index — it can be slow, since it re-runs per outer row.</p>', 'Common Mistake'),

      h(2, 'Subquery in FROM'),
      p('<p>Treats a subquery as a temporary table that the outer query can select from.</p>'),
      code('sql', 'SELECT * FROM (SELECT ...) AS alias;'),
      code('sql', `SELECT department, avg_salary\nFROM (\n  SELECT department, AVG(salary) AS avg_salary\n  FROM Employee GROUP BY department\n) AS dept_avg\nWHERE avg_salary > 60000;`),
      p(ul([
        'The inner query builds a summarized table first.',
        'The outer query then filters or selects from that temporary result.',
      ])),
      callout('warning', '<p>Forgetting the subquery needs an alias — most engines require one.</p>', 'Common Mistake'),

      h(2, 'At a Glance'),
      table(
        ['Kind', 'Returns', 'Typically used with'],
        [
          ['Single-row', 'Exactly one value', '=, >, <'],
          ['Multi-row', 'A list of values', 'IN, ANY, ALL'],
          ['Correlated', 'Re-evaluated per outer row', 'EXISTS, comparisons referencing the outer query'],
          ['In FROM', 'A whole result set', 'Treated as a temporary table, needs an alias'],
        ]
      ),

      p('<p>Subqueries nest one query inside a clause of another. The next lesson covers a cleaner way to do something similar — Common Table Expressions, which name a subquery so it reads top-to-bottom instead of nested.</p>'),
    ],
  },
  bn: {
    title: 'সাবকোয়েরি',
    metaTitle: 'SQL Subqueries | Learn Computer Academy',
    metaDescription: 'সিঙ্গেল-রো, মাল্টি-রো, কোরিলেটেড সাবকোয়েরি, আর FROM-এ সাবকোয়েরি — কীভাবে একটি কোয়েরিকে অন্যটির ভেতরে বসিয়ে একটি মান, তালিকা, বা ফলাফল সেট দেওয়া যায়।',
    blocks: [
      p('<p>একটি <b>সাবকোয়েরি</b> হলো অন্য একটি কোয়েরির ভেতরে বসানো একটি কোয়েরি — বাইরের কোয়েরিকে একটি মান, একটি তালিকা, বা একটি সম্পূর্ণ ফলাফল সেট দেওয়ার জন্য ব্যবহৃত হয়।</p>'),

      h(2, 'সিঙ্গেল-রো সাবকোয়েরি', 'single-row-subquery'),
      p('<p>একটি সাবকোয়েরি যা ঠিক একটি মান ফেরত দেয়, যেখানেই একটি একক মান প্রত্যাশিত সেখানেই ব্যবহারযোগ্য।</p>'),
      code('sql', 'WHERE column = (SELECT ... );'),
      code('sql', `SELECT name FROM Employee\nWHERE salary = (SELECT MAX(salary) FROM Employee);`),
      p(ul([
        'ভেতরের কোয়েরি প্রথমে একটি একক সংখ্যায় পরিণত হয়।',
        'তারপর বাইরের কোয়েরি সেই মানের বিরুদ্ধে ফিল্টার করে।',
      ])),
      callout('warning', '<p>সাবকোয়েরি একাধিক সারি ফেরত দিতে পারলেও <code>=</code> ব্যবহার করা, যা একটি এরর তৈরি করে।</p>', 'সাধারণ ভুল'),

      h(2, 'মাল্টি-রো সাবকোয়েরি', 'multi-row-subquery'),
      p('<p>একটি সাবকোয়েরি যা মানের একটি তালিকা ফেরত দেয়, <code>IN</code>, <code>ANY</code>, বা <code>ALL</code>-এর সাথে জোড়া দেওয়া হয়।</p>'),
      code('sql', 'WHERE column IN (SELECT ... );'),
      code('sql', `SELECT name FROM Employee\nWHERE department_id IN (\n  SELECT id FROM Department WHERE location = 'Kolkata'\n);`),
      p(ul([
        'ভেতরের কোয়েরি বিভাগের আইডির একটি তালিকা ফেরত দেয়।',
        'বাইরের কোয়েরি শুধু সেই কর্মচারীদের রাখে যাদের বিভাগ সেই তালিকায় আছে।',
      ])),
      callout('warning', '<p>সাবকোয়েরি একাধিক সারি ফেরত দিতে পারলে <code>IN</code>-এর বদলে <code>=</code> ব্যবহার করা।</p>', 'সাধারণ ভুল'),

      h(2, 'কোরিলেটেড সাবকোয়েরি', 'correlated-subquery'),
      p('<p>একটি সাবকোয়েরি যা বাইরের কোয়েরির একটি কলাম রেফারেন্স করে, বাইরের প্রতিটি সারির জন্য একবার করে আবার চলে।</p>'),
      code('sql', 'WHERE EXISTS (SELECT 1 FROM ... WHERE outer.col = inner.col);'),
      code('sql', `SELECT name FROM Employee e\nWHERE salary > (\n  SELECT AVG(salary) FROM Employee\n  WHERE department = e.department\n);`),
      p(ul([
        'বাইরের কোয়েরির প্রতিটি সারির জন্য ভেতরের কোয়েরি আবার গণনা করে।',
        'নিজের বিভাগের গড়ের চেয়ে বেশি উপার্জনকারী কর্মচারী খুঁজে বের করে।',
      ])),
      callout('warning', '<p>একটি বিশাল টেবিলে ইনডেক্স ছাড়া একটি কোরিলেটেড সাবকোয়েরি ব্যবহার করা — এটি ধীর হতে পারে, কারণ এটি বাইরের প্রতিটি সারির জন্য আবার চলে।</p>', 'সাধারণ ভুল'),

      h(2, 'FROM-এ সাবকোয়েরি', 'subquery-in-from'),
      p('<p>একটি সাবকোয়েরিকে একটি সাময়িক টেবিলের মতো ব্যবহার করে, যা থেকে বাইরের কোয়েরি সিলেক্ট করতে পারে।</p>'),
      code('sql', 'SELECT * FROM (SELECT ...) AS alias;'),
      code('sql', `SELECT department, avg_salary\nFROM (\n  SELECT department, AVG(salary) AS avg_salary\n  FROM Employee GROUP BY department\n) AS dept_avg\nWHERE avg_salary > 60000;`),
      p(ul([
        'ভেতরের কোয়েরি প্রথমে একটি সংক্ষিপ্ত টেবিল তৈরি করে।',
        'বাইরের কোয়েরি তারপর সেই সাময়িক ফলাফল থেকে ফিল্টার বা সিলেক্ট করে।',
      ])),
      callout('warning', '<p>সাবকোয়েরির একটি অ্যালিয়াস দরকার তা ভুলে যাওয়া — বেশিরভাগ ইঞ্জিনে এটি আবশ্যক।</p>', 'সাধারণ ভুল'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['ধরন', 'ফেরত দেয়', 'সাধারণত যার সাথে ব্যবহৃত হয়'],
        [
          ['সিঙ্গেল-রো', 'ঠিক একটি মান', '=, >, <'],
          ['মাল্টি-রো', 'মানের একটি তালিকা', 'IN, ANY, ALL'],
          ['কোরিলেটেড', 'বাইরের প্রতিটি সারির জন্য আবার মূল্যায়িত', 'EXISTS, বাইরের কোয়েরি রেফারেন্স করা তুলনা'],
          ['FROM-এ', 'একটি সম্পূর্ণ ফলাফল সেট', 'একটি সাময়িক টেবিলের মতো ব্যবহৃত, একটি অ্যালিয়াস দরকার'],
        ]
      ),

      p('<p>সাবকোয়েরি একটি কোয়েরিকে অন্যটির একটি ক্লজের ভেতরে বসায়। পরের পাঠে একই রকম কিছু করার একটি পরিষ্কার উপায় আলোচনা হবে — কমন টেবিল এক্সপ্রেশন, যা একটি সাবকোয়েরিকে নাম দেয় যাতে এটি নেস্টেড না হয়ে উপর-থেকে-নিচে পড়া যায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'cte',
  sortOrder: 15,
  en: {
    title: 'Common Table Expressions (CTEs)',
    metaTitle: 'SQL Common Table Expressions (CTEs) | Learn Computer Academy',
    metaDescription: 'WITH...AS and recursive CTEs — naming a temporary result set to make complex queries easier to read, and walking hierarchical data like org charts.',
    blocks: [
      p('<p>A <b>CTE</b> (Common Table Expression) names a temporary result set with <code>WITH</code>, making complex queries easier to read and reuse within the same statement.</p>'),

      h(2, 'WITH ... AS'),
      p('<p>Defines a named, temporary result set that the main query can reference like a table.</p>'),
      code('sql', `WITH cte_name AS (\n  SELECT ...\n)\nSELECT * FROM cte_name;`),
      code('sql', `WITH DeptAvg AS (\n  SELECT department, AVG(salary) AS avg_salary\n  FROM Employee\n  GROUP BY department\n)\nSELECT * FROM DeptAvg\nWHERE avg_salary > 60000;`),
      p(ul([
        'The CTE is computed once and can be referenced by name afterward.',
        'Reads top-to-bottom, unlike a nested subquery — this is the readability win over the "subquery in FROM" pattern from the last lesson.',
      ])),
      callout('warning', '<p>Reaching for a CTE purely for style when a simple subquery would do just as well.</p>', 'Common Mistake'),

      h(2, 'Recursive CTE'),
      p('<p>A CTE that refers to itself, used to walk hierarchical or graph-like data.</p>'),
      code('sql', `WITH RECURSIVE cte_name AS (\n  base_case\n  UNION ALL\n  recursive_case\n)\nSELECT * FROM cte_name;`),
      code('sql', `WITH RECURSIVE OrgChart AS (\n  SELECT id, name, manager_id FROM Employee WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id\n  FROM Employee e\n  JOIN OrgChart o ON e.manager_id = o.id\n)\nSELECT * FROM OrgChart;`),
      p(ul([
        'The base case picks the starting rows (the top of the hierarchy).',
        'The recursive case repeatedly joins back until no new rows are found.',
      ])),
      callout('warning', '<p>Writing a recursive case with no terminating condition, causing an infinite loop.</p>', 'Common Mistake'),

      p('<p>CTEs are the last of the "advancing" querying techniques in this section. The final lesson steps past everyday querying entirely, into tools that sit past the beginner track: views, indexes, stored procedures, triggers, and how to check whether a query is actually fast.</p>'),
    ],
  },
  bn: {
    title: 'কমন টেবিল এক্সপ্রেশন (CTE)',
    metaTitle: 'SQL Common Table Expressions (CTEs) | Learn Computer Academy',
    metaDescription: 'WITH...AS আর রিকার্সিভ CTE — একটি সাময়িক ফলাফল সেটকে নাম দিয়ে জটিল কোয়েরি পড়া সহজ করা, আর অর্গ চার্টের মতো ক্রমসোপান তথ্য ঘুরে দেখা।',
    blocks: [
      p('<p>একটি <b>CTE</b> (Common Table Expression) <code>WITH</code> দিয়ে একটি সাময়িক ফলাফল সেটকে নাম দেয়, যা জটিল কোয়েরি একই স্টেটমেন্টের মধ্যে পড়া আর আবার ব্যবহার করা সহজ করে তোলে।</p>'),

      h(2, 'WITH ... AS', 'with-as'),
      p('<p>একটি নামযুক্ত, সাময়িক ফলাফল সেট সংজ্ঞায়িত করে যা মূল কোয়েরি একটি টেবিলের মতো রেফারেন্স করতে পারে।</p>'),
      code('sql', `WITH cte_name AS (\n  SELECT ...\n)\nSELECT * FROM cte_name;`),
      code('sql', `WITH DeptAvg AS (\n  SELECT department, AVG(salary) AS avg_salary\n  FROM Employee\n  GROUP BY department\n)\nSELECT * FROM DeptAvg\nWHERE avg_salary > 60000;`),
      p(ul([
        'CTE একবার গণনা করা হয় আর এরপর নাম দিয়ে রেফারেন্স করা যায়।',
        'নেস্টেড সাবকোয়েরির মতো নয়, উপর-থেকে-নিচে পড়া যায় — আগের পাঠের "FROM-এ সাবকোয়েরি" প্যাটার্নের চেয়ে এটিই পড়ার-সহজতার সুবিধা।',
      ])),
      callout('warning', '<p>একটি সাধারণ সাবকোয়েরি ঠিক একইভাবে কাজ করত এমন জায়গায় শুধু স্টাইলের জন্য একটি CTE ব্যবহার করা।</p>', 'সাধারণ ভুল'),

      h(2, 'রিকার্সিভ CTE', 'recursive-cte'),
      p('<p>একটি CTE যা নিজেকেই রেফারেন্স করে, ক্রমসোপান বা গ্রাফ-সদৃশ তথ্য ঘুরে দেখতে ব্যবহৃত হয়।</p>'),
      code('sql', `WITH RECURSIVE cte_name AS (\n  base_case\n  UNION ALL\n  recursive_case\n)\nSELECT * FROM cte_name;`),
      code('sql', `WITH RECURSIVE OrgChart AS (\n  SELECT id, name, manager_id FROM Employee WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id\n  FROM Employee e\n  JOIN OrgChart o ON e.manager_id = o.id\n)\nSELECT * FROM OrgChart;`),
      p(ul([
        'বেস কেস শুরুর সারিগুলো বেছে নেয় (ক্রমসোপানের শীর্ষ)।',
        'রিকার্সিভ কেস নতুন কোনো সারি না পাওয়া পর্যন্ত বারবার আবার জয়েন করে।',
      ])),
      callout('warning', '<p>কোনো সমাপ্তি শর্ত ছাড়া একটি রিকার্সিভ কেস লেখা, যা একটি অসীম লুপ তৈরি করে।</p>', 'সাধারণ ভুল'),

      p('<p>এই অংশের "অগ্রসর" কোয়েরি কৌশলগুলোর মধ্যে CTE শেষটি। শেষ পাঠে আমরা দৈনন্দিন কোয়েরি করা সম্পূর্ণভাবে পেরিয়ে যাব, শিক্ষানবিশ ট্র্যাকের বাইরের টুলে: ভিউ, ইনডেক্স, স্টোরড প্রসিডিউর, ট্রিগার, আর একটি কোয়েরি আসলেই দ্রুত কি না তা কীভাবে যাচাই করবেন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'beyond-the-basics',
  sortOrder: 16,
  en: {
    title: 'Beyond the Basics',
    metaTitle: 'SQL Beyond the Basics — Views, Indexes, Procedures, Triggers | Learn Computer Academy',
    metaDescription: 'VIEW, INDEX, STORED PROCEDURE, TRIGGER, and EXPLAIN — five tools that sit past the beginner track, worth knowing exist once the fundamentals feel natural.',
    blocks: [
      p('<p>These five tools sit past the beginner track — worth knowing exist, worth reaching for once everything covered so far in this section feels natural. This closes out the SQL section.</p>'),

      h(2, 'VIEW'),
      p('<p>A saved query you can <code>SELECT</code> from like a virtual table — the underlying data isn\'t duplicated, and the query re-runs every time you use it.</p>'),
      code('sql', `CREATE VIEW view_name AS\n  SELECT ...;`),
      code('sql', `CREATE VIEW HighEarners AS\nSELECT name, department, salary\nFROM Employee\nWHERE salary > 70000;\n\nSELECT * FROM HighEarners;`),
      table(['name', 'department', 'salary'], [['Alice', 'HR', '75000'], ['Priya', 'IT', '82000']], 'Result: HighEarners'),
      p(ul([
        'HighEarners can be queried exactly like a table, but nothing is duplicated on disk — every SELECT re-executes the underlying query.',
        'Because it re-runs live, the view automatically stays in sync whenever the Employee table changes.',
      ])),
      callout('warning', ul([
        'Assuming a view is cached — most views re-execute their query every single time; they don\'t store a snapshot.',
        'Stacking views on top of views several layers deep, which makes performance hard to reason about.',
      ]), 'Common Mistakes'),

      h(2, 'INDEX'),
      p('<p>A lookup structure built on one or more columns that lets the engine jump straight to matching rows instead of scanning the whole table.</p>'),
      code('sql', `CREATE INDEX index_name\nON table_name (column);`),
      code('sql', `CREATE INDEX idx_employee_department\nON Employee (department);\n\nEXPLAIN SELECT * FROM Employee\nWHERE department = 'IT';`),
      table(['type', 'key', 'rows'], [['ALL', 'NULL', '5,000']], 'EXPLAIN — before the index'),
      table(['type', 'key', 'rows'], [['ref', 'idx_employee_department', '12']], 'EXPLAIN — after the index'),
      p(ul([
        '<code>type: ALL</code> means a full table scan — every one of the 5,000 rows gets checked.',
        '<code>type: ref</code> means the engine used <code>idx_employee_department</code> to jump directly to the ~12 matching rows instead.',
      ])),
      img(
        'docs/img/sql/beyond-the-basics-1',
        'Diagram comparing a full table scan without an index against a direct index lookup that jumps straight to matching rows',
        1024, 768,
        'An index lets the engine jump straight to matches instead of checking every row.'
      ),
      callout('warning', ul([
        'Indexing every column "just in case," which slows down every INSERT/UPDATE without helping reads that never use them.',
        'Indexing a low-cardinality column (like a boolean flag) that the optimizer often skips anyway.',
      ]), 'Common Mistakes'),

      h(2, 'STORED PROCEDURE'),
      p('<p>A saved block of SQL logic you can call by name, optionally passing parameters — the logic lives once in the database instead of being repeated in every app.</p>'),
      code('sql', `CREATE PROCEDURE name(params)\nBEGIN\n  ...\nEND;`),
      code('sql', `CREATE PROCEDURE GiveRaise(IN emp_id INT, IN amount DECIMAL(10,2))\nBEGIN\n  UPDATE Employee\n  SET salary = salary + amount\n  WHERE id = emp_id;\nEND;\n\nCALL GiveRaise(1, 5000.00);`),
      p(ul([
        '<code>CALL</code> runs the procedure by name, passing <code>emp_id</code> and <code>amount</code> as parameters.',
        'Because the logic lives in the database, every application calling GiveRaise behaves identically — no copy-pasted business logic.',
      ])),
      callout('warning', ul([
        'Putting heavy business logic in procedures, which is harder to version-control and unit-test than application code.',
        'Forgetting that in some engines a procedure runs with the permissions of whoever defined it, not the caller.',
      ]), 'Common Mistakes'),

      h(2, 'TRIGGER'),
      p('<p>A block of SQL that fires automatically when a specific table event — an <code>INSERT</code>, <code>UPDATE</code>, or <code>DELETE</code> — happens, with no application code involved.</p>'),
      code('sql', `CREATE TRIGGER name\n{BEFORE|AFTER} {INSERT|UPDATE|DELETE} ON table\nFOR EACH ROW\n  statement;`),
      code('sql', `CREATE TRIGGER LogSalaryChange\nAFTER UPDATE ON Employee\nFOR EACH ROW\nINSERT INTO SalaryLog (employee_id, old_salary, new_salary)\nVALUES (OLD.id, OLD.salary, NEW.salary);\n\nUPDATE Employee SET salary = 70000 WHERE id = 1;`),
      table(['employee_id', 'old_salary', 'new_salary'], [['1', '65000', '70000']], 'Result: SalaryLog (new row appears automatically)'),
      p(ul([
        'The trigger fires the instant the UPDATE runs — nothing in the application had to call it.',
        '<code>OLD</code> and <code>NEW</code> give the trigger access to both the row\'s previous and new values in the same statement.',
      ])),
      callout('warning', ul([
        'Stacking multiple triggers on the same event, making execution order hard to predict.',
        'Using a trigger for logic that would be clearer, and easier to test, as ordinary application code.',
      ]), 'Common Mistakes'),

      h(2, 'Performance Basics — EXPLAIN'),
      p('<p><code>EXPLAIN</code> shows how the engine actually plans to run a query — whether it scans everything or uses an index — before you spend time guessing.</p>'),
      code('sql', `EXPLAIN SELECT * FROM Employee\nWHERE department = 'IT';`),
      table(['id', 'select_type', 'table', 'type', 'key', 'rows'], [['1', 'SIMPLE', 'Employee', 'ALL', 'NULL', '5,000']], 'EXPLAIN output'),
      p(ul([
        '<code>type: ALL</code> and <code>key: NULL</code> together mean no index is being used — every row gets scanned.',
        'Running EXPLAIN again after adding an index confirms whether the optimizer actually decided to use it — creating an index doesn\'t guarantee it will be.',
      ])),
      callout('warning', '<p>Adding an index and never running <code>EXPLAIN</code> to confirm it\'s actually being used.</p>', 'Common Mistake'),

      h(2, 'At a Glance'),
      table(
        ['Tool', 'What it\'s for'],
        [
          ['VIEW', 'A saved, reusable query that behaves like a table'],
          ['INDEX', 'Faster lookups on columns you filter or join on often'],
          ['STORED PROCEDURE', 'Reusable SQL logic, called by name from any application'],
          ['TRIGGER', 'SQL that runs automatically on a table event'],
          ['EXPLAIN', 'Shows how a query actually runs, before you guess'],
        ]
      ),

      callout('tip', '<p>You don\'t need to master these five to write useful SQL — everything up through Common Table Expressions covers the fundamentals thoroughly. These are worth knowing exist, and worth coming back to once the rest feels natural.</p>', 'You Don’t Need These on Day One'),

      p('<p>This closes out the SQL section — from a single <code>SELECT</code> statement all the way to indexes, procedures, and triggers. Everything here builds directly on the four families covered early on: DDL, DML, DCL, and TCL are the foundation every one of these later lessons assumed.</p>'),
    ],
  },
  bn: {
    title: 'মৌলিক বিষয়ের বাইরে',
    metaTitle: 'SQL মৌলিক বিষয়ের বাইরে — ভিউ, ইনডেক্স, প্রসিডিউর, ট্রিগার | Learn Computer Academy',
    metaDescription: 'VIEW, INDEX, STORED PROCEDURE, TRIGGER, আর EXPLAIN — পাঁচটি টুল যা শিক্ষানবিশ ট্র্যাকের বাইরে, মূল বিষয়গুলো স্বাভাবিক মনে হলে জানা আর ব্যবহার করার মতো।',
    blocks: [
      p('<p>এই পাঁচটি টুল শিক্ষানবিশ ট্র্যাকের বাইরে — জানা থাকা মূল্যবান, আর এই অংশে এতক্ষণ যা আলোচিত হয়েছে তা স্বাভাবিক মনে হলে ব্যবহার করার মতো। এটি দিয়েই SQL অংশ শেষ হচ্ছে।</p>'),

      h(2, 'VIEW', 'view'),
      p('<p>একটি সংরক্ষিত কোয়েরি যা থেকে আপনি একটি ভার্চুয়াল টেবিলের মতো <code>SELECT</code> করতে পারেন — অন্তর্নিহিত তথ্য কপি করা হয় না, আর প্রতিবার ব্যবহারের সময় কোয়েরিটি আবার চলে।</p>'),
      code('sql', `CREATE VIEW view_name AS\n  SELECT ...;`),
      code('sql', `CREATE VIEW HighEarners AS\nSELECT name, department, salary\nFROM Employee\nWHERE salary > 70000;\n\nSELECT * FROM HighEarners;`),
      table(['name', 'department', 'salary'], [['Alice', 'HR', '75000'], ['Priya', 'IT', '82000']], 'ফলাফল: HighEarners'),
      p(ul([
        'HighEarners-কে ঠিক একটি টেবিলের মতোই কোয়েরি করা যায়, কিন্তু ডিস্কে কিছুই কপি হয় না — প্রতিটি SELECT অন্তর্নিহিত কোয়েরিটি আবার চালায়।',
        'যেহেতু এটি লাইভ আবার চলে, Employee টেবিল বদলালেই ভিউটি স্বয়ংক্রিয়ভাবে সিঙ্কে থাকে।',
      ])),
      callout('warning', ul([
        'একটি ভিউ ক্যাশ করা আছে বলে ধরে নেওয়া — বেশিরভাগ ভিউ প্রতিবার তাদের কোয়েরি আবার চালায়; এরা কোনো স্ন্যাপশট সংরক্ষণ করে না।',
        'একাধিক স্তরে ভিউয়ের উপর ভিউ সাজানো, যা পারফরম্যান্স বোঝা কঠিন করে তোলে।',
      ]), 'সাধারণ ভুল'),

      h(2, 'INDEX', 'index'),
      p('<p>এক বা একাধিক কলামের উপর তৈরি একটি লুকআপ কাঠামো, যা ইঞ্জিনকে পুরো টেবিল স্ক্যান করার বদলে সরাসরি মিলে যাওয়া সারিতে লাফিয়ে যেতে দেয়।</p>'),
      code('sql', `CREATE INDEX index_name\nON table_name (column);`),
      code('sql', `CREATE INDEX idx_employee_department\nON Employee (department);\n\nEXPLAIN SELECT * FROM Employee\nWHERE department = 'IT';`),
      table(['type', 'key', 'rows'], [['ALL', 'NULL', '5,000']], 'EXPLAIN — ইনডেক্সের আগে'),
      table(['type', 'key', 'rows'], [['ref', 'idx_employee_department', '12']], 'EXPLAIN — ইনডেক্সের পরে'),
      p(ul([
        '<code>type: ALL</code>-এর মানে একটি ফুল টেবিল স্ক্যান — 5,000 সারির প্রতিটিই পরীক্ষা করা হয়।',
        '<code>type: ref</code>-এর মানে ইঞ্জিন <code>idx_employee_department</code> ব্যবহার করে সরাসরি প্রায় 12টি মিলে যাওয়া সারিতে লাফিয়ে গেছে।',
      ])),
      img(
        'docs/img/sql/beyond-the-basics-1',
        'ইনডেক্স ছাড়া একটি ফুল টেবিল স্ক্যান আর সরাসরি মিলে যাওয়া সারিতে লাফিয়ে যাওয়া একটি ইনডেক্স লুকআপ তুলনা করা ডায়াগ্রাম',
        1024, 768,
        'একটি ইনডেক্স ইঞ্জিনকে প্রতিটি সারি পরীক্ষা করার বদলে সরাসরি মিলে যাওয়া সারিতে লাফিয়ে যেতে দেয়।'
      ),
      callout('warning', ul([
        '"যদি দরকার হয়" ভেবে প্রতিটি কলাম ইনডেক্স করা, যা প্রতিটি INSERT/UPDATE ধীর করে দেয় কখনো ব্যবহার না হওয়া রিডকে সাহায্য না করেই।',
        'একটি কম-কার্ডিনালিটির কলাম (যেমন একটি বুলিয়ান ফ্ল্যাগ) ইনডেক্স করা, যা অপ্টিমাইজার প্রায়ই এড়িয়ে যায়।',
      ]), 'সাধারণ ভুল'),

      h(2, 'STORED PROCEDURE', 'stored-procedure'),
      p('<p>নাম দিয়ে ডাকা যায় এমন একটি সংরক্ষিত SQL লজিকের ব্লক, ঐচ্ছিকভাবে প্যারামিটার পাস করে — লজিকটি প্রতিটি অ্যাপে বারবার লেখার বদলে ডেটাবেসে একবারই থাকে।</p>'),
      code('sql', `CREATE PROCEDURE name(params)\nBEGIN\n  ...\nEND;`),
      code('sql', `CREATE PROCEDURE GiveRaise(IN emp_id INT, IN amount DECIMAL(10,2))\nBEGIN\n  UPDATE Employee\n  SET salary = salary + amount\n  WHERE id = emp_id;\nEND;\n\nCALL GiveRaise(1, 5000.00);`),
      p(ul([
        '<code>CALL</code> নাম দিয়ে প্রসিডিউরটি চালায়, <code>emp_id</code> আর <code>amount</code> প্যারামিটার হিসেবে পাস করে।',
        'যেহেতু লজিকটি ডেটাবেসে থাকে, GiveRaise ডাকা প্রতিটি অ্যাপ্লিকেশন একই রকম আচরণ করে — কোনো কপি-পেস্ট করা বিজনেস লজিক নেই।',
      ])),
      callout('warning', ul([
        'প্রসিডিউরে ভারী বিজনেস লজিক রাখা, যা অ্যাপ্লিকেশন কোডের চেয়ে ভার্শন-কন্ট্রোল আর ইউনিট-টেস্ট করা কঠিন।',
        'কিছু ইঞ্জিনে একটি প্রসিডিউর যিনি এটি সংজ্ঞায়িত করেছেন তার অনুমতিতে চলে, কলকারীর নয় — এটি ভুলে যাওয়া।',
      ]), 'সাধারণ ভুল'),

      h(2, 'TRIGGER', 'trigger'),
      p('<p>একটি নির্দিষ্ট টেবিল ইভেন্ট — একটি <code>INSERT</code>, <code>UPDATE</code>, বা <code>DELETE</code> — ঘটলে স্বয়ংক্রিয়ভাবে চলা একটি SQL ব্লক, কোনো অ্যাপ্লিকেশন কোড ছাড়াই।</p>'),
      code('sql', `CREATE TRIGGER name\n{BEFORE|AFTER} {INSERT|UPDATE|DELETE} ON table\nFOR EACH ROW\n  statement;`),
      code('sql', `CREATE TRIGGER LogSalaryChange\nAFTER UPDATE ON Employee\nFOR EACH ROW\nINSERT INTO SalaryLog (employee_id, old_salary, new_salary)\nVALUES (OLD.id, OLD.salary, NEW.salary);\n\nUPDATE Employee SET salary = 70000 WHERE id = 1;`),
      table(['employee_id', 'old_salary', 'new_salary'], [['1', '65000', '70000']], 'ফলাফল: SalaryLog (নতুন সারি স্বয়ংক্রিয়ভাবে আসে)'),
      p(ul([
        'UPDATE চলার সাথে সাথেই ট্রিগারটি চলে — অ্যাপ্লিকেশনের কিছুই এটি ডাকতে হয়নি।',
        '<code>OLD</code> আর <code>NEW</code> ট্রিগারকে একই স্টেটমেন্টে সারির আগের আর নতুন মান দুটোতেই অ্যাক্সেস দেয়।',
      ])),
      callout('warning', ul([
        'একই ইভেন্টে একাধিক ট্রিগার স্তূপ করা, যা এক্সিকিউশনের ক্রম অনুমান করা কঠিন করে তোলে।',
        'সাধারণ অ্যাপ্লিকেশন কোড হিসেবে আরও স্পষ্ট আর টেস্ট করা সহজ হতো এমন লজিকের জন্য একটি ট্রিগার ব্যবহার করা।',
      ]), 'সাধারণ ভুল'),

      h(2, 'পারফরম্যান্সের মূল বিষয় — EXPLAIN', 'performance-basics-explain'),
      p('<p><code>EXPLAIN</code> দেখায় ইঞ্জিন আসলে একটি কোয়েরি কীভাবে চালানোর পরিকল্পনা করছে — এটি সবকিছু স্ক্যান করছে নাকি একটি ইনডেক্স ব্যবহার করছে — অনুমান করে সময় নষ্ট করার আগেই।</p>'),
      code('sql', `EXPLAIN SELECT * FROM Employee\nWHERE department = 'IT';`),
      table(['id', 'select_type', 'table', 'type', 'key', 'rows'], [['1', 'SIMPLE', 'Employee', 'ALL', 'NULL', '5,000']], 'EXPLAIN আউটপুট'),
      p(ul([
        '<code>type: ALL</code> আর <code>key: NULL</code> একসাথে মানে কোনো ইনডেক্স ব্যবহৃত হচ্ছে না — প্রতিটি সারি স্ক্যান করা হয়।',
        'একটি ইনডেক্স যোগ করার পর আবার EXPLAIN চালালে নিশ্চিত হওয়া যায় অপ্টিমাইজার আসলে সেটি ব্যবহার করার সিদ্ধান্ত নিয়েছে কি না — একটি ইনডেক্স তৈরি করা মানেই এটি ব্যবহৃত হবে তার নিশ্চয়তা নয়।',
      ])),
      callout('warning', '<p>একটি ইনডেক্স যোগ করে এটি আসলেই ব্যবহৃত হচ্ছে কি না তা নিশ্চিত করতে কখনো <code>EXPLAIN</code> না চালানো।</p>', 'সাধারণ ভুল'),

      h(2, 'এক নজরে', 'at-a-glance'),
      table(
        ['টুল', 'যার জন্য ব্যবহৃত'],
        [
          ['VIEW', 'একটি সংরক্ষিত, পুনর্ব্যবহারযোগ্য কোয়েরি যা টেবিলের মতো আচরণ করে'],
          ['INDEX', 'প্রায়ই ফিল্টার বা জয়েন করা কলামে দ্রুত লুকআপ'],
          ['STORED PROCEDURE', 'পুনর্ব্যবহারযোগ্য SQL লজিক, যেকোনো অ্যাপ্লিকেশন থেকে নাম দিয়ে ডাকা'],
          ['TRIGGER', 'একটি টেবিল ইভেন্টে স্বয়ংক্রিয়ভাবে চলা SQL'],
          ['EXPLAIN', 'একটি কোয়েরি আসলে কীভাবে চলে তা দেখায়, অনুমান করার আগেই'],
        ]
      ),

      callout('tip', '<p>উপযোগী SQL লিখতে এই পাঁচটিতে দক্ষ হওয়ার দরকার নেই — কমন টেবিল এক্সপ্রেশন পর্যন্ত যা আলোচিত হয়েছে তা মূল বিষয়গুলো পুঙ্খানুপুঙ্খভাবে কভার করে। এগুলো জানা থাকা মূল্যবান, আর বাকি সবকিছু স্বাভাবিক মনে হলে আবার ফিরে আসার মতো।</p>', 'প্রথম দিনেই এগুলো দরকার নেই'),

      p('<p>এখানেই SQL অংশ শেষ হচ্ছে — একটি একক <code>SELECT</code> স্টেটমেন্ট থেকে শুরু করে ইনডেক্স, প্রসিডিউর, আর ট্রিগার পর্যন্ত। এখানে যা কিছু আছে তা শুরুর দিকে আলোচিত চারটি পরিবারের উপরেই সরাসরি গড়ে উঠেছে: DDL, DML, DCL, আর TCL হলো সেই ভিত্তি যা পরের প্রতিটি পাঠ ধরে নিয়েছে।</p>'),
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

    // No unique constraint on docs.path — select-then-insert/update.
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
