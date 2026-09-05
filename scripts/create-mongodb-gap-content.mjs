#!/usr/bin/env node
// Extends the existing "MongoDB" category (22 lessons) with 4 more lessons
// covering real gaps found against a roadmap.sh "MongoDB" roadmap PDF the
// user shared 2026-09-03 — asked "is everything in mongo in this document
// covered in our course". Checked actual headings, not keyword hits —
// mongodb/query-operators covers Comparison/Logical/Element-Existence but
// never $all/$elemMatch/$size/$regex; mongodb/indexes covers single-field/
// compound/unique but never text/geospatial/TTL; transactions are only a
// forward-pointer in where-this-leaves-you, never taught.
//
// 4 gaps found: array & pattern query operators ($all/$elemMatch/$size/
// $regex), bulkWrite(), multi-document transactions (with a read/write
// concerns note folded in rather than a separate lesson), and specialized
// indexes (text/geospatial/TTL). Replica sets, sharding, enterprise auth
// (X.509/Kerberos/LDAP), and encryption (at rest/field-level/TLS) judged
// ops/infra/enterprise territory for an app-developer-focused course —
// backup-and-security-basics already covers auth/RBAC at the "basics"
// level its own name promises — left out, matching the boundary used
// across every PDF check today.
//
// User picked "build all 4" over AskUserQuestion.
//
// Inserted before mongodb/where-this-leaves-you (bumped to the new end),
// same "keep the closer last" pattern as the react/nodejs/python batches.
//
// Style: matches this category's own established house style (see
// mongodb/query-operators — mongosh shell syntax, tables, callouts).
// Bengali matches this category's script-transliteration convention.
//
// sort_order: new lessons 22-25; where-this-leaves-you bumped 22->26.
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-mongodb-gap-content.mjs [--dry-run]

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
let n = 22

// ═══ 1. ARRAY & PATTERN QUERY OPERATORS ═══════════════════════════════════

lessons.push({
  slug: 'array-and-pattern-query-operators', sortOrder: n++,
  en: {
    title: 'Array and Pattern Query Operators',
    metaTitle: 'MongoDB Array and Pattern Query Operators | Learn Computer Academy',
    metaDescription: 'Querying inside an array field with $all, $elemMatch, and $size, and matching text patterns with $regex — extending the earlier Query Operators lesson.',
    blocks: [
      p('<p>The earlier Query Operators lesson covered comparison, logical, and element/existence operators. This lesson covers two more categories: matching inside array fields, and matching text by pattern rather than exact value.</p>'),
      h(2, '$all — Every Value Must Be Present'),
      p('<p>Matches a document whose array field contains every value listed, in any order — unlike a plain array match, which requires an exact match of the whole array.</p>'),
      code('javascript', 'db.products.find({ tags: { $all: [\'electronics\', \'sale\'] } })\n// Matches a document whose tags array contains BOTH \'electronics\' and \'sale\',\n// regardless of order or other tags also present'),
      h(2, '$elemMatch — One Element Satisfying Multiple Conditions'),
      p('<p>Needed when an array holds objects, and a single element must satisfy several conditions together — without it, conditions could each match a <i>different</i> element.</p>'),
      code('javascript', '// A product with a reviews array: [{ rating: 5, verified: true }, { rating: 2, verified: false }]\n\n// WITHOUT $elemMatch — matches if ANY review has rating 5 AND ANY review is verified,\n// even if it\'s not the SAME review\ndb.products.find({ \'reviews.rating\': 5, \'reviews.verified\': true })\n\n// WITH $elemMatch — requires one single review meeting both conditions\ndb.products.find({\n  reviews: { $elemMatch: { rating: 5, verified: true } }\n})'),
      h(2, '$size — Matching an Array\'s Length'),
      code('javascript', 'db.products.find({ tags: { $size: 3 } })\n// Matches only documents whose tags array has exactly 3 elements'),
      callout('note', '<p>$size only matches an exact length — there\'s no built-in $size: { $gt: 3 } for "more than 3." A common workaround is a separate stored count field, kept in sync when the array changes.</p>', '$size has no range version'),
      h(2, '$regex — Pattern Matching Text'),
      p('<p>Matches a string field against a regular expression, similar to the pattern matching from the earlier JavaScript course.</p>'),
      code('javascript', '// Names starting with "Jo" (case-sensitive)\ndb.users.find({ name: { $regex: /^Jo/ } })\n\n// Case-insensitive, matching anywhere in the string\ndb.users.find({ name: { $regex: /smith/i } })\n\n// Alternative syntax, useful when the pattern is a variable\ndb.users.find({ name: { $regex: \'^Jo\', $options: \'i\' } })'),
      callout('warning', '<p>An unanchored $regex (no ^ at the start) can\'t use a text index efficiently and scans every document — fine on a small collection, worth watching on a large one. A dedicated text index (covered in the Specialized Indexes lesson) handles large-scale text search better.</p>', 'A performance note'),
      table(['Operator', 'Matches'], [
        ['$all', 'An array containing every listed value'],
        ['$elemMatch', 'One array element satisfying multiple conditions together'],
        ['$size', 'An array with an exact number of elements'],
        ['$regex', 'A string matching a pattern'],
      ]),
    ],
  },
  bn: {
    title: 'Array ও Pattern Query Operator',
    metaTitle: 'MongoDB Array ও Pattern Query Operator | Learn Computer Academy',
    metaDescription: '$all, $elemMatch, আর $size দিয়ে একটা array field-এর ভেতরে query করা, আর $regex দিয়ে text pattern match করা — আগের Query Operators lesson-এর সম্প্রসারণ।',
    blocks: [
      p('<p>আগের Query Operators lesson comparison, logical, আর element/existence operator কভার করেছে। এই lesson আরো দুটো category কভার করে: array field-এর ভেতরে match করা, আর exact মানের বদলে pattern দিয়ে text match করা।</p>'),
      h(2, '$all — প্রতিটা মান থাকতেই হবে', 'all-প্রতিটা-মান-থাকতেই-হবে'),
      p('<p>একটা document match করে যার array field-এ list করা প্রতিটা মান আছে, যেকোনো ক্রমে — একটা plain array match-এর মতো না, যার পুরো array-র একটা exact match লাগে।</p>'),
      code('javascript', 'db.products.find({ tags: { $all: [\'electronics\', \'sale\'] } })\n// এমন একটা document match করে যার tags array-তে \'electronics\' আর \'sale\'\n// দুটোই আছে, ক্রম বা অন্য tag থাকা নির্বিশেষে'),
      h(2, '$elemMatch — একাধিক শর্ত সন্তুষ্ট করা একটা Element', 'elemmatch-একাধিক-শর্ত-সন্তুষ্ট-করা-একটা-element'),
      p('<p>একটা array object ধরে রাখলে দরকার, আর একটা একক element-কে একসাথে বেশ কয়েকটা শর্ত সন্তুষ্ট করতে হয় — এটা ছাড়া, শর্তগুলো প্রতিটা <i>ভিন্ন</i> element-এ মিলতে পারত।</p>'),
      code('javascript', '// একটা reviews array সহ একটা product: [{ rating: 5, verified: true }, { rating: 2, verified: false }]\n\n// $elemMatch ছাড়া — যেকোনো review-এর rating 5 আর যেকোনো review verified হলে মেলে,\n// একই review না হলেও\ndb.products.find({ \'reviews.rating\': 5, \'reviews.verified\': true })\n\n// $elemMatch সহ — দুটো শর্তই পূরণ করা একটা single review দরকার\ndb.products.find({\n  reviews: { $elemMatch: { rating: 5, verified: true } }\n})'),
      h(2, '$size — একটা Array-র দৈর্ঘ্য Match করা', 'size-একটা-array-র-দৈর্ঘ্য-match-করা'),
      code('javascript', 'db.products.find({ tags: { $size: 3 } })\n// শুধু যাদের tags array-তে ঠিক 3টা element আছে সেই document match করে'),
      callout('note', '<p>$size শুধু একটা exact দৈর্ঘ্য match করে — "3-এর বেশি"-এর জন্য কোনো built-in $size: { $gt: 3 } নেই। একটা common workaround একটা আলাদা সংরক্ষিত count field, array বদলালে sync রাখা।</p>', '$size-এর কোনো range version নেই'),
      h(2, '$regex — Pattern দিয়ে টেক্সট Match করা', 'regex-pattern-দিয়ে-টেক্সট-match-করা'),
      p('<p>আগের JavaScript কোর্স থেকে pattern matching-এর মতোই একটা string field-কে একটা regular expression-এর বিরুদ্ধে match করে।</p>'),
      code('javascript', '// "Jo" দিয়ে শুরু হওয়া নাম (case-sensitive)\ndb.users.find({ name: { $regex: /^Jo/ } })\n\n// Case-insensitive, string-এর যেকোনো জায়গায় match\ndb.users.find({ name: { $regex: /smith/i } })\n\n// বিকল্প সিনট্যাক্স, pattern একটা variable হলে useful\ndb.users.find({ name: { $regex: \'^Jo\', $options: \'i\' } })'),
      callout('warning', '<p>একটা unanchored $regex (শুরুতে ^ নেই) একটা text index efficiently ব্যবহার করতে পারে না আর প্রতিটা document scan করে — একটা ছোট collection-এ ঠিক আছে, একটা বড়টায় খেয়াল রাখার যোগ্য। একটা dedicated text index (Specialized Indexes lesson-এ কভার করা) বড় স্কেলে text search ভালো handle করে।</p>', 'একটা performance note'),
      table(['Operator', 'যা match করে'], [
        ['$all', 'list করা প্রতিটা মান ধারণ করা একটা array'],
        ['$elemMatch', 'একসাথে একাধিক শর্ত সন্তুষ্ট করা একটা array element'],
        ['$size', 'ঠিক একটা সংখ্যক element সহ একটা array'],
        ['$regex', 'একটা pattern-এ মেলা একটা string'],
      ]),
    ],
  },
})

// ═══ 2. BULK OPERATIONS ═══════════════════════════════════════════════════

lessons.push({
  slug: 'bulk-operations', sortOrder: n++,
  en: {
    title: 'Bulk Operations with bulkWrite()',
    metaTitle: 'MongoDB Bulk Operations — bulkWrite() | Learn Computer Academy',
    metaDescription: 'Running many inserts, updates, and deletes in a single database round trip with bulkWrite(), instead of one operation at a time.',
    blocks: [
      p('<p>Each earlier lesson\'s insert, update, and delete operations run one at a time — fine for a handful of documents, but a real cost when hundreds or thousands need changing. <code>bulkWrite()</code> batches many operations into a single request to the database.</p>'),
      h(2, 'A Basic Example'),
      code('javascript', 'db.products.bulkWrite([\n  { insertOne: { document: { name: \'Widget\', price: 9.99 } } },\n  { updateOne: {\n      filter: { name: \'Gadget\' },\n      update: { $set: { price: 14.99 } }\n  } },\n  { deleteOne: { filter: { name: \'Discontinued Item\' } } },\n])'),
      h(2, 'The Operations bulkWrite Supports'),
      table(['Operation', 'Same as'], [
        ['insertOne', 'db.collection.insertOne()'],
        ['updateOne / updateMany', 'db.collection.updateOne() / updateMany()'],
        ['replaceOne', 'db.collection.replaceOne()'],
        ['deleteOne / deleteMany', 'db.collection.deleteOne() / deleteMany()'],
      ]),
      h(2, 'Why This Is Faster'),
      p('<p>Each individual <code>insertOne()</code>/<code>updateOne()</code> call is its own round trip to the database server. <code>bulkWrite()</code> sends every operation together, cutting network overhead dramatically for a large batch.</p>'),
      h(2, 'Ordered vs. Unordered Execution'),
      code('javascript', '// Default: ordered — stops at the first failure, operations after it don\'t run\ndb.products.bulkWrite([ /* ... */ ])\n\n// Unordered — keeps going even if one operation fails, runs them faster\n// (not guaranteed to run in the array\'s order) since they don\'t depend on each other\ndb.products.bulkWrite([ /* ... */ ], { ordered: false })'),
      h(2, 'Reading the Result'),
      code('javascript', 'const result = db.products.bulkWrite([ /* ... */ ])\nprint(result.insertedCount)\nprint(result.modifiedCount)\nprint(result.deletedCount)'),
      callout('tip', '<p>A common real use: importing a CSV or JSON file of thousands of records — read the file, build one bulkWrite() array of insertOne operations, and send it as a single batch instead of thousands of individual inserts.</p>', 'The classic bulkWrite use case'),
    ],
  },
  bn: {
    title: 'bulkWrite() দিয়ে Bulk Operation',
    metaTitle: 'MongoDB Bulk Operation — bulkWrite() | Learn Computer Academy',
    metaDescription: 'একটা সময়ে একটা operation-এর বদলে bulkWrite() দিয়ে একটা একক database round trip-এ অনেক insert, update, আর delete চালানো।',
    blocks: [
      p('<p>আগের lesson-এর insert, update, আর delete operation একটা সময়ে একটা চলে — হাতেগোনা কয়েকটা document-এর জন্য ঠিক আছে, কিন্তু শত বা হাজার বদলাতে হলে একটা আসল খরচ। <code>bulkWrite()</code> database-এ একটা একক request-এ অনেক operation batch করে।</p>'),
      h(2, 'একটা মৌলিক উদাহরণ', 'একটা-মৌলিক-উদাহরণ'),
      code('javascript', 'db.products.bulkWrite([\n  { insertOne: { document: { name: \'Widget\', price: 9.99 } } },\n  { updateOne: {\n      filter: { name: \'Gadget\' },\n      update: { $set: { price: 14.99 } }\n  } },\n  { deleteOne: { filter: { name: \'Discontinued Item\' } } },\n])'),
      h(2, 'bulkWrite যেসব Operation Support করে', 'bulkwrite-যেসব-operation-support-করে'),
      table(['Operation', 'যেমন'], [
        ['insertOne', 'db.collection.insertOne()'],
        ['updateOne / updateMany', 'db.collection.updateOne() / updateMany()'],
        ['replaceOne', 'db.collection.replaceOne()'],
        ['deleteOne / deleteMany', 'db.collection.deleteOne() / deleteMany()'],
      ]),
      h(2, 'কেন এটা দ্রুত', 'কেন-এটা-দ্রুত'),
      p('<p>প্রতিটা আলাদা <code>insertOne()</code>/<code>updateOne()</code> call database server-এ নিজের একটা round trip। <code>bulkWrite()</code> প্রতিটা operation একসাথে পাঠায়, একটা বড় batch-এর জন্য network overhead নাটকীয়ভাবে কমায়।</p>'),
      h(2, 'Ordered বনাম Unordered Execution', 'ordered-বনাম-unordered-execution'),
      code('javascript', '// Default: ordered — প্রথম failure-এ থামে, এর পরের operation চলে না\ndb.products.bulkWrite([ /* ... */ ])\n\n// Unordered — একটা operation fail করলেও চলতে থাকে, দ্রুত চলে\n// (array-র ক্রমে চলার গ্যারান্টি নেই) কারণ এরা একে অপরের উপর নির্ভর করে না\ndb.products.bulkWrite([ /* ... */ ], { ordered: false })'),
      h(2, 'ফলাফল পড়া', 'ফলাফল-পড়া'),
      code('javascript', 'const result = db.products.bulkWrite([ /* ... */ ])\nprint(result.insertedCount)\nprint(result.modifiedCount)\nprint(result.deletedCount)'),
      callout('tip', '<p>একটা common আসল ব্যবহার: হাজার হাজার record-এর একটা CSV বা JSON file import করা — file পড়ুন, insertOne operation-এর একটা bulkWrite() array বানান, আর হাজার হাজার আলাদা insert-এর বদলে একটা একক batch হিসেবে পাঠান।</p>', 'ক্লাসিক bulkWrite use case'),
    ],
  },
})

// ═══ 3. TRANSACTIONS ═══════════════════════════════════════════════════════

lessons.push({
  slug: 'transactions', sortOrder: n++,
  en: {
    title: 'Multi-Document Transactions',
    metaTitle: 'MongoDB Multi-Document Transactions | Learn Computer Academy',
    metaDescription: 'Making several writes across documents (or collections) succeed or fail together, and how read/write concerns tune the consistency guarantee.',
    blocks: [
      p('<p>A single <code>updateOne()</code> is always atomic on its own — it either fully applies or doesn\'t. A <b>transaction</b> extends that same all-or-nothing guarantee across several operations, possibly touching several documents or collections, the same concept as the earlier SQL course\'s transactions lesson.</p>'),
      h(2, 'Why This Matters — a Money Transfer Example'),
      p('<p>Moving money from one account to another needs two writes — subtract from one document, add to another. Without a transaction, a crash between the two writes leaves the data in a genuinely broken, inconsistent state.</p>'),
      h(2, 'Using a Transaction'),
      code('javascript', 'const session = db.getMongo().startSession()\n\ntry {\n  session.startTransaction()\n\n  const accounts = session.getDatabase(\'bank\').accounts\n  accounts.updateOne({ _id: \'A\' }, { $inc: { balance: -100 } })\n  accounts.updateOne({ _id: \'B\' }, { $inc: { balance: 100 } })\n\n  session.commitTransaction()\n} catch (error) {\n  session.abortTransaction()\n  throw error\n} finally {\n  session.endSession()\n}'),
      p('<p>Both updates commit together, or — if anything fails in between — neither one does, exactly like the earlier SQL transactions lesson\'s BEGIN/COMMIT/ROLLBACK.</p>'),
      h(2, 'Read and Write Concerns'),
      p('<p>MongoDB replicates data across multiple servers for durability — <b>write concern</b> and <b>read concern</b> tune how much of that replication a write or read waits for before being considered done.</p>'),
      table(['Write concern', 'Waits for'], [
        ['w: 1 (default)', 'Acknowledgment from the primary server only'],
        ['w: \'majority\'', 'Acknowledgment from a majority of replica servers — safer, slightly slower'],
        ['w: 0', 'No acknowledgment at all — fastest, least safe'],
      ]),
      code('javascript', 'db.accounts.updateOne(\n  { _id: \'A\' },\n  { $inc: { balance: -100 } },\n  { writeConcern: { w: \'majority\' } }\n)'),
      callout('note', '<p>A transaction, by itself, only guarantees the writes inside it succeed or fail together — it says nothing about how durably they\'re replicated. For genuinely critical operations (like the money transfer above), pairing a transaction with a majority write concern is what most real applications actually use.</p>', 'Transactions and write concern are separate guarantees'),
      callout('warning', '<p>A transaction that touches many documents or runs for a long time can hurt performance across the whole database — reach for one specifically when an operation genuinely needs the all-or-nothing guarantee, not as a default habit for every multi-step write.</p>', 'Not a default choice'),
    ],
  },
  bn: {
    title: 'Multi-Document Transaction',
    metaTitle: 'MongoDB Multi-Document Transaction | Learn Computer Academy',
    metaDescription: 'একাধিক document (বা collection) জুড়ে বেশ কয়েকটা write একসাথে সফল বা ব্যর্থ করা, আর read/write concern কীভাবে consistency গ্যারান্টি tune করে।',
    blocks: [
      p('<p>একটা একক <code>updateOne()</code> নিজে থেকেই সবসময় atomic — এটা হয় পুরোপুরি apply হয় বা হয় না। একটা <b>transaction</b> সেই একই all-or-nothing গ্যারান্টি বেশ কয়েকটা operation জুড়ে বাড়ায়, সম্ভবত বেশ কয়েকটা document বা collection স্পর্শ করে, আগের SQL কোর্সের transaction lesson-এর একই ধারণা।</p>'),
      h(2, 'কেন এটা গুরুত্বপূর্ণ — একটা Money Transfer উদাহরণ', 'কেন-এটা-গুরুত্বপূর্ণ-একটা-money-transfer-উদাহরণ'),
      p('<p>এক account থেকে আরেকটাতে টাকা move করতে দুটো write দরকার — একটা document থেকে বিয়োগ, আরেকটাতে যোগ। একটা transaction ছাড়া, দুটো write-এর মাঝে একটা crash data-কে সত্যিকারভাবে ভাঙা, অসামঞ্জস্যপূর্ণ অবস্থায় রেখে দেয়।</p>'),
      h(2, 'একটা Transaction ব্যবহার করা', 'একটা-transaction-ব্যবহার-করা'),
      code('javascript', 'const session = db.getMongo().startSession()\n\ntry {\n  session.startTransaction()\n\n  const accounts = session.getDatabase(\'bank\').accounts\n  accounts.updateOne({ _id: \'A\' }, { $inc: { balance: -100 } })\n  accounts.updateOne({ _id: \'B\' }, { $inc: { balance: 100 } })\n\n  session.commitTransaction()\n} catch (error) {\n  session.abortTransaction()\n  throw error\n} finally {\n  session.endSession()\n}'),
      p('<p>দুটো update একসাথে commit হয়, বা — মাঝখানে কিছু fail করলে — কোনোটাই হয় না, ঠিক আগের SQL transaction lesson-এর BEGIN/COMMIT/ROLLBACK-এর মতো।</p>'),
      h(2, 'Read ও Write Concern'),
      p('<p>Durability-র জন্য MongoDB একাধিক server জুড়ে data replicate করে — <b>write concern</b> আর <b>read concern</b> একটা write বা read done বলে বিবেচিত হওয়ার আগে সেই replication-এর কতটার জন্য অপেক্ষা করে তা tune করে।</p>'),
      table(['Write concern', 'যার জন্য অপেক্ষা করে'], [
        ['w: 1 (default)', 'শুধু primary server থেকে acknowledgment'],
        ['w: \'majority\'', 'বেশিরভাগ replica server থেকে acknowledgment — নিরাপদ, সামান্য ধীর'],
        ['w: 0', 'কোনো acknowledgment না — সবচেয়ে দ্রুত, সবচেয়ে কম নিরাপদ'],
      ]),
      code('javascript', 'db.accounts.updateOne(\n  { _id: \'A\' },\n  { $inc: { balance: -100 } },\n  { writeConcern: { w: \'majority\' } }\n)'),
      callout('note', '<p>নিজে থেকে, একটা transaction শুধু এর ভেতরের write একসাথে সফল বা ব্যর্থ হয় তা গ্যারান্টি দেয় — এগুলো কতটা টেকসইভাবে replicate হয় সে সম্পর্কে কিছু বলে না। সত্যিকারভাবে critical operation-এর জন্য (উপরের money transfer-এর মতো), একটা transaction-কে একটা majority write concern-এর সাথে জোড়া দেওয়াই বেশিরভাগ আসল application আসলে ব্যবহার করে।</p>', 'Transaction আর write concern আলাদা গ্যারান্টি'),
      callout('warning', '<p>অনেক document স্পর্শ করা বা লম্বা সময় চলা একটা transaction পুরো database জুড়ে performance-এর ক্ষতি করতে পারে — একটা operation-এর সত্যিকারভাবে all-or-nothing গ্যারান্টি দরকার হলে specifically এটার জন্য যান, প্রতিটা multi-step write-এর জন্য একটা default habit হিসেবে না।</p>', 'একটা default পছন্দ না'),
    ],
  },
})

// ═══ 4. SPECIALIZED INDEXES ═══════════════════════════════════════════════

lessons.push({
  slug: 'specialized-indexes', sortOrder: n++,
  en: {
    title: 'Specialized Indexes — Text, Geospatial, and TTL',
    metaTitle: 'MongoDB Specialized Indexes | Learn Computer Academy',
    metaDescription: 'Three index types beyond single-field and compound — full-text search, location-based queries, and documents that automatically expire.',
    blocks: [
      p('<p>The earlier Indexes lesson covered single-field, compound, and unique indexes — all speeding up an exact or range match. These three types solve genuinely different problems.</p>'),
      h(2, 'Text Indexes — Full-Text Search'),
      p('<p>Enables searching for words within a text field, rather than matching it exactly — the same kind of search a site\'s search bar typically needs.</p>'),
      code('javascript', 'db.articles.createIndex({ title: \'text\', body: \'text\' })\n\ndb.articles.find({ $text: { $search: \'mongodb indexing\' } })\n// Matches articles containing "mongodb" or "indexing" anywhere in title or body,\n// ranked by relevance'),
      callout('note', '<p>A collection can only have one text index, though it can cover multiple fields at once (as above). For search needs beyond this — typo tolerance, weighted relevance tuning — MongoDB Atlas Search (mentioned in the PDF this lesson is based on) is the fuller tool; this covers the built-in basics.</p>', 'The limits of a text index'),
      h(2, 'Geospatial Indexes — Location Queries'),
      p('<p>Speeds up queries about location — finding everything within a distance of a point, or inside a boundary.</p>'),
      code('javascript', 'db.stores.createIndex({ location: \'2dsphere\' })\n\ndb.stores.insertOne({\n  name: \'Downtown Store\',\n  location: { type: \'Point\', coordinates: [-73.99, 40.73] }   // [longitude, latitude]\n})\n\n// Find stores within 5km of a point\ndb.stores.find({\n  location: {\n    $near: {\n      $geometry: { type: \'Point\', coordinates: [-73.99, 40.73] },\n      $maxDistance: 5000   // meters\n    }\n  }\n})'),
      callout('warning', '<p>GeoJSON coordinates are [longitude, latitude] — the reverse of the [latitude, longitude] order many mapping APIs use. Swapping them silently produces a working query pointed at the wrong place on Earth.</p>', 'A common ordering mistake'),
      h(2, 'TTL Indexes — Documents That Expire Automatically'),
      p('<p>A <b>TTL (Time To Live)</b> index deletes a document automatically once a date field passes a set age — useful for session data, temporary tokens, or logs that shouldn\'t accumulate forever.</p>'),
      code('javascript', 'db.sessions.createIndex(\n  { createdAt: 1 },\n  { expireAfterSeconds: 3600 }   // deleted 1 hour after createdAt\n)\n\ndb.sessions.insertOne({\n  userId: \'abc123\',\n  createdAt: new Date(),   // this document self-deletes in 1 hour\n})'),
      table(['Index type', 'Use for'], [
        ['Text', 'Searching for words within a text field'],
        ['Geospatial (2dsphere)', 'Finding documents by location — nearby, within an area'],
        ['TTL', 'Automatically deleting documents after a set time'],
      ]),
    ],
  },
  bn: {
    title: 'Specialized Index — Text, Geospatial, ও TTL',
    metaTitle: 'MongoDB Specialized Index | Learn Computer Academy',
    metaDescription: 'Single-field আর compound-এর বাইরে তিনটা index type — full-text search, location-based query, আর স্বয়ংক্রিয়ভাবে মেয়াদ শেষ হওয়া document।',
    blocks: [
      p('<p>আগের Indexes lesson single-field, compound, আর unique index কভার করেছে — সবগুলোই একটা exact বা range match দ্রুত করে। এই তিনটা type সত্যিকারভাবে ভিন্ন সমস্যা সমাধান করে।</p>'),
      h(2, 'Text Index — Full-Text Search'),
      p('<p>একটা text field ঠিক match করার বদলে এর ভেতরে শব্দ search করতে দেয় — একটা site-এর search bar-এর সাধারণত দরকার হওয়া একই ধরনের search।</p>'),
      code('javascript', 'db.articles.createIndex({ title: \'text\', body: \'text\' })\n\ndb.articles.find({ $text: { $search: \'mongodb indexing\' } })\n// title বা body-র যেকোনো জায়গায় "mongodb" বা "indexing" ধারণ করা article match করে,\n// relevance অনুযায়ী rank করা'),
      callout('note', '<p>একটা collection-এর শুধু একটা text index থাকতে পারে, যদিও এটা একসাথে একাধিক field কভার করতে পারে (উপরের মতো)। এর বাইরের search দরকারের জন্য — typo tolerance, weighted relevance tuning — এই lesson যে PDF-এর উপর ভিত্তি করে সেখানে উল্লেখ করা MongoDB Atlas Search পূর্ণ tool; এটা built-in বেসিক কভার করে।</p>', 'একটা text index-এর সীমা'),
      h(2, 'Geospatial Index — Location Query'),
      p('<p>Location সম্পর্কে query দ্রুত করে — একটা point-এর একটা দূরত্বের ভেতরে, বা একটা boundary-র ভেতরে সবকিছু খুঁজে বের করা।</p>'),
      code('javascript', 'db.stores.createIndex({ location: \'2dsphere\' })\n\ndb.stores.insertOne({\n  name: \'Downtown Store\',\n  location: { type: \'Point\', coordinates: [-73.99, 40.73] }   // [longitude, latitude]\n})\n\n// একটা point-এর 5km-এর মধ্যে store খুঁজুন\ndb.stores.find({\n  location: {\n    $near: {\n      $geometry: { type: \'Point\', coordinates: [-73.99, 40.73] },\n      $maxDistance: 5000   // meter\n    }\n  }\n})'),
      callout('warning', '<p>GeoJSON coordinate [longitude, latitude] — অনেক mapping API ব্যবহার করা [latitude, longitude] ক্রমের উল্টো। এগুলো swap করলে চুপচাপ একটা কাজ করা query তৈরি হয় যা পৃথিবীর ভুল জায়গা নির্দেশ করে।</p>', 'একটা common ordering ভুল'),
      h(2, 'TTL Index — স্বয়ংক্রিয়ভাবে মেয়াদ শেষ হওয়া Document', 'ttl-index-স্বয়ংক্রিয়ভাবে-মেয়াদ-শেষ-হওয়া-document'),
      p('<p>একটা <b>TTL (Time To Live)</b> index একটা date field একটা নির্ধারিত বয়স পার হলে স্বয়ংক্রিয়ভাবে একটা document delete করে — session data, temporary token, বা চিরকাল জমা হওয়া উচিত না এমন log-এর জন্য useful।</p>'),
      code('javascript', 'db.sessions.createIndex(\n  { createdAt: 1 },\n  { expireAfterSeconds: 3600 }   // createdAt-এর 1 ঘণ্টা পরে delete হয়\n)\n\ndb.sessions.insertOne({\n  userId: \'abc123\',\n  createdAt: new Date(),   // এই document 1 ঘণ্টায় নিজে থেকে delete হয়\n})'),
      table(['Index ধরন', 'যার জন্য ব্যবহার'], [
        ['Text', 'একটা text field-এর ভেতরে শব্দ search করা'],
        ['Geospatial (2dsphere)', 'Location দিয়ে document খুঁজে বের করা — কাছাকাছি, একটা area-র ভেতরে'],
        ['TTL', 'একটা নির্ধারিত সময়ের পরে স্বয়ংক্রিয়ভাবে document delete করা'],
      ]),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'mongodb').single()
  if (catErr || !category) {
    console.error('Category "mongodb" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write, plus bumping where-this-leaves-you\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] mongodb/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] mongodb/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('  mongodb/where-this-leaves-you -> sort_order 26')
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `mongodb/${lesson.slug}`
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

  const { error: bumpErr } = await supabase.from('docs').update({ sort_order: 26 }).eq('category_id', category.id).eq('slug', 'where-this-leaves-you')
  if (bumpErr) console.error('Failed to bump where-this-leaves-you:', bumpErr.message)
  else console.log('  ✓ mongodb/where-this-leaves-you -> sort_order 26')

  console.log(`\n✅ Done. ${lessons.length} lessons written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
