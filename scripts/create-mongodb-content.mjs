#!/usr/bin/env node
// New "MongoDB" category (created by scripts/create-mongodb-category.mjs) —
// 22 lessons: document-database fundamentals, CRUD, schema design, indexes,
// the aggregation pipeline, and using MongoDB from Node.js (official driver
// + Mongoose). Scoped and outline-approved with the site owner 2026-08-19
// per CONTENT-PIPELINE.md §0.
//   - Slug `mongodb`, joins the existing "Backend, data & AI" homepage
//     group, right after SQL.
//   - Images: 3 real hand-built Figma diagrams (DB→Collection→Document
//     hierarchy, Embedding vs Referencing comparison, Aggregation Pipeline
//     stages flow — anywhere exact labeled structure matters and AI text
//     rendering would be unreliable) plus 19 isometric AI-generated
//     illustrations (site's per-run style choice, Magnific gpt-2) — one
//     image per lesson, matching this course's own scope size.
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-mongodb-content.mjs [--dry-run]

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
function code(language, source, runnable) { return { id: nanoid(12), type: 'code', language, code: source, ...(runnable ? { runnable: true } : {}) } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }
function img(publicId, alt, width, height, caption) { return { id: nanoid(12), type: 'image', publicId, alt, width, height, caption } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// ── Lessons ──────────────────────────────────────────────────────────────

const lessons = []
let n = 1

// 1 ─────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'introduction', sortOrder: n++,
  en: {
    title: 'Introduction to MongoDB',
    metaTitle: 'Introduction to MongoDB | Learn Computer Academy',
    metaDescription: 'What MongoDB is, how a document database differs from a relational one like SQL, and when each is the better choice.',
    blocks: [
      p('<p><b>MongoDB</b> is a <b>document database</b> — instead of rows and columns in fixed tables, it stores data as flexible, JSON-like documents grouped into collections. It is the most widely used database in the NoSQL family, and it pairs naturally with JavaScript and Node.js, since a MongoDB document and a JavaScript object are shaped almost the same way.</p>'),
      img('docs/img/mongodb/introduction-hero', 'An isometric illustration of a green document-shaped database icon with floating curly-brace documents stacked around it', 1024, 768, 'A document database stores flexible, JSON-like records instead of table rows.'),
      h(2, 'Documents Instead of Rows'),
      p('<p>In a relational database (see this site\'s <a href="/sql/intro">SQL course</a>), every row in a table must have the same columns. In MongoDB, every record — called a <b>document</b> — is its own self-contained JSON-like object, and different documents in the same collection can have different fields:</p>'),
      code('javascript', `{
  _id: "651f2a...",
  name: "Priya Nair",
  role: "Frontend Developer",
  skills: ["HTML", "CSS", "React"]
}`, false),
      h(2, 'The Terminology Mapping'),
      p('<p>If you already know SQL, most concepts have a direct MongoDB equivalent — the words are different, the underlying idea is close enough to reason from.</p>'),
      table(['SQL term', 'MongoDB term'], [
        ['Database', 'Database'],
        ['Table', 'Collection'],
        ['Row', 'Document'],
        ['Column', 'Field'],
        ['Primary key', '_id'],
        ['JOIN', '$lookup (aggregation stage) or embedding'],
      ]),
      h(2, 'When MongoDB Is a Good Fit'),
      p('<p>MongoDB tends to suit data that is naturally nested or that changes shape often — a user profile with an arbitrary list of addresses, a product catalog where different product types have different attributes, an activity log where every event has different fields. A relational database still tends to win when data is highly structured and relationships between tables matter a lot — accounting ledgers, inventory systems with strict foreign keys, anything where you would lean hard on SQL JOINs and transactions.</p>'),
      callout('note', '<p>Neither database type is strictly "better." Production systems very often use both — a relational database for structured, transactional data, and MongoDB for flexible or high-volume data — chosen per use case, not as a blanket replacement for SQL.</p>', 'Not a replacement for SQL — a different tool'),
      h(2, 'What You Will Build in This Course'),
      p('<p>This course goes from installing MongoDB through every core CRUD operation, schema design decisions, indexes, the aggregation pipeline, and finally connecting a real <a href="/nodejs/introduction">Node.js</a> application to MongoDB using both the official driver and Mongoose.</p>'),
    ],
  },
  bn: {
    title: 'MongoDB পরিচিতি',
    metaTitle: 'MongoDB পরিচিতি | Learn Computer Academy',
    metaDescription: 'MongoDB কী, একটা document database SQL-এর মতো একটা relational database থেকে কীভাবে ভিন্ন, আর কখন কোনটা ভালো পছন্দ।',
    blocks: [
      p('<p><b>MongoDB</b> হলো একটা <b>document database</b> — একটা fixed table-এ row আর column-এর বদলে, এটা flexible, JSON-এর মতো document collection-এ গ্রুপ করে data সংরক্ষণ করে। এটা NoSQL পরিবারের সবচেয়ে ব্যবহৃত database, আর এটা স্বাভাবিকভাবেই JavaScript আর Node.js-এর সাথে খাপ খায়, কারণ একটা MongoDB document আর একটা JavaScript object প্রায় একই রকম আকৃতির।</p>'),
      img('docs/img/mongodb/introduction-hero', 'একটা সবুজ document-আকৃতির database icon আর এর চারপাশে ভাসমান curly-brace document সহ একটা isometric illustration', 1024, 768, 'একটা document database table row-এর বদলে flexible, JSON-এর মতো record সংরক্ষণ করে।'),
      h(2, 'Row-এর বদলে Document', 'documents-instead-of-rows'),
      p('<p>একটা relational database-এ (এই সাইটের <a href="/sql/intro">SQL কোর্স</a> দেখুন), একটা table-এর প্রতিটা row-এর একই column থাকতে হবে। MongoDB-তে, প্রতিটা record — যাকে <b>document</b> বলা হয় — নিজের একটা স্বয়ংসম্পূর্ণ JSON-এর মতো object, আর একই collection-এর ভিন্ন document-এর ভিন্ন field থাকতে পারে:</p>'),
      code('javascript', `{
  _id: "651f2a...",
  name: "Priya Nair",
  role: "Frontend Developer",
  skills: ["HTML", "CSS", "React"]
}`, false),
      h(2, 'Terminology Mapping', 'the-terminology-mapping'),
      p('<p>আপনি যদি ইতিমধ্যে SQL জানেন, বেশিরভাগ concept-এর একটা সরাসরি MongoDB equivalent আছে — শব্দগুলো ভিন্ন, অন্তর্নিহিত ধারণা যথেষ্ট কাছাকাছি যে সেখান থেকে reason করা যায়।</p>'),
      table(['SQL term', 'MongoDB term'], [
        ['Database', 'Database'],
        ['Table', 'Collection'],
        ['Row', 'Document'],
        ['Column', 'Field'],
        ['Primary key', '_id'],
        ['JOIN', '$lookup (aggregation stage) বা embedding'],
      ]),
      h(2, 'MongoDB কখন ভালো Fit', 'when-mongodb-is-a-good-fit'),
      p('<p>MongoDB সাধারণত এমন data-র জন্য উপযুক্ত যা স্বাভাবিকভাবে nested বা প্রায়ই আকৃতি বদলায় — একটা arbitrary address list সহ user profile, একটা product catalog যেখানে ভিন্ন product type-এর ভিন্ন attribute আছে, একটা activity log যেখানে প্রতিটা event-এর ভিন্ন field আছে। যখন data অত্যন্ত structured আর table-এর মধ্যে relationship অনেক গুরুত্বপূর্ণ হয় তখন একটা relational database এখনও জিততে থাকে — accounting ledger, strict foreign key সহ inventory system, যেকোনো কিছু যেখানে আপনি SQL JOIN আর transaction-এর ওপর ভারী নির্ভর করবেন।</p>'),
      callout('note', '<p>কোনো database type-ই কঠোরভাবে "ভালো" না। Production system প্রায়ই উভয়ই ব্যবহার করে — structured, transactional data-র জন্য একটা relational database, আর flexible বা high-volume data-র জন্য MongoDB — SQL-এর একটা সম্পূর্ণ প্রতিস্থাপন হিসেবে না, use case অনুযায়ী বেছে নেওয়া।</p>', 'SQL-এর প্রতিস্থাপন না — একটা ভিন্ন টুল'),
      h(2, 'এই কোর্সে আপনি কী তৈরি করবেন', 'what-you-will-build-in-this-course'),
      p('<p>এই কোর্স MongoDB install করা থেকে শুরু করে প্রতিটা core CRUD operation, schema design সিদ্ধান্ত, index, aggregation pipeline, আর শেষে official driver আর Mongoose উভয় ব্যবহার করে একটা real <a href="/nodejs/introduction">Node.js</a> application MongoDB-র সাথে connect করা পর্যন্ত যায়।</p>'),
    ],
  },
})

// 2 ─────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'installing-mongodb-atlas', sortOrder: n++,
  en: {
    title: 'Installing MongoDB & MongoDB Atlas',
    metaTitle: 'Installing MongoDB & MongoDB Atlas | Learn Computer Academy',
    metaDescription: 'Two ways to get a working MongoDB database: installing it locally, or using MongoDB Atlas, the free hosted cloud option most beginners should start with.',
    blocks: [
      p('<p>You need somewhere for MongoDB to actually run before any of the commands in this course do anything. There are two practical routes, and most learners are better off starting with the second one.</p>'),
      img('docs/img/mongodb/installing-hero', 'An isometric illustration of a laptop connecting via a cloud icon to a green database cylinder, representing MongoDB Atlas cloud hosting', 1024, 768, 'MongoDB Atlas hosts the database for you — no local install required.'),
      h(2, 'Option 1: MongoDB Atlas (Recommended for Beginners)'),
      p('<p><b>MongoDB Atlas</b> is MongoDB\'s own official cloud hosting service, with a free tier ("M0") that is more than enough for learning and small projects. Nothing installs on your computer.</p>'),
      table(['Step', 'What you do'], [
        ['1', 'Create a free account at mongodb.com/cloud/atlas'],
        ['2', 'Create a free M0 cluster (pick a region close to you)'],
        ['3', 'Under Database Access, create a database user with a password'],
        ['4', 'Under Network Access, allow your current IP address (or 0.0.0.0/0 while learning)'],
        ['5', 'Click Connect → Drivers, and copy the connection string'],
      ]),
      p('<p>The connection string looks like this — you will use it throughout this course, including from Node.js later:</p>'),
      code('text', 'mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/', false),
      h(2, 'Option 2: Installing MongoDB Locally'),
      p('<p>If you would rather run MongoDB on your own machine, download <b>MongoDB Community Server</b> from mongodb.com for your operating system, then also install <b>mongosh</b>, the command-line shell used to talk to it (covered in the next lesson). A local install connects with a simpler connection string:</p>'),
      code('text', 'mongodb://localhost:27017', false),
      h(2, 'MongoDB Compass — A Visual Option'),
      p('<p>Alongside the shell, <b>MongoDB Compass</b> is a free desktop GUI for browsing databases, collections, and documents without typing commands. It is optional — everything in this course works from the command line — but useful for visually inspecting data while learning.</p>'),
      callout('tip', '<p>This course\'s examples assume Atlas, since it needs no local install and matches what most teams actually use in production. Everywhere you see a connection string, substitute your own Atlas string if you went that route.</p>', 'This course assumes Atlas by default'),
    ],
  },
  bn: {
    title: 'MongoDB আর MongoDB Atlas Install করা',
    metaTitle: 'MongoDB আর MongoDB Atlas Install করা | Learn Computer Academy',
    metaDescription: 'একটা কার্যকর MongoDB database পাওয়ার দুটো উপায়: এটা locally install করা, বা MongoDB Atlas ব্যবহার করা, ফ্রি hosted cloud option যা দিয়ে বেশিরভাগ beginner-এর শুরু করা উচিত।',
    blocks: [
      p('<p>এই কোর্সের যেকোনো command কিছু করার আগে আপনার MongoDB আসলে চালানোর জন্য কোথাও দরকার। দুটো ব্যবহারিক পথ আছে, আর বেশিরভাগ শিক্ষার্থীর জন্য দ্বিতীয়টা দিয়ে শুরু করা ভালো।</p>'),
      img('docs/img/mongodb/installing-hero', 'একটা cloud icon-এর মাধ্যমে একটা সবুজ database cylinder-এর সাথে connect হওয়া একটা laptop-এর isometric illustration, MongoDB Atlas cloud hosting represent করছে', 1024, 768, 'MongoDB Atlas আপনার জন্য database host করে — কোনো local install দরকার নেই।'),
      h(2, 'Option 1: MongoDB Atlas (Beginner-দের জন্য Recommended)', 'option-1-mongodb-atlas-recommended-for-beginners'),
      p('<p><b>MongoDB Atlas</b> হলো MongoDB-র নিজস্ব official cloud hosting service, একটা free tier ("M0") সহ যা শেখা আর ছোট প্রজেক্টের জন্য যথেষ্টের চেয়ে বেশি। আপনার কম্পিউটারে কিছু install হয় না।</p>'),
      table(['ধাপ', 'আপনি কী করেন'], [
        ['১', 'mongodb.com/cloud/atlas-এ একটা ফ্রি account তৈরি করুন'],
        ['২', 'একটা ফ্রি M0 cluster তৈরি করুন (আপনার কাছাকাছি একটা region বেছে নিন)'],
        ['৩', 'Database Access-এর অধীনে, একটা password সহ একটা database user তৈরি করুন'],
        ['৪', 'Network Access-এর অধীনে, আপনার বর্তমান IP address অনুমতি দিন (বা শেখার সময় 0.0.0.0/0)'],
        ['৫', 'Connect → Drivers-এ ক্লিক করুন, আর connection string কপি করুন'],
      ]),
      p('<p>Connection string দেখতে এমন — এই কোর্স জুড়ে আপনি এটা ব্যবহার করবেন, পরে Node.js থেকেও:</p>'),
      code('text', 'mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/', false),
      h(2, 'Option 2: MongoDB Locally Install করা', 'option-2-installing-mongodb-locally'),
      p('<p>যদি আপনি বরং আপনার নিজের machine-এ MongoDB চালাতে চান, mongodb.com থেকে আপনার operating system-এর জন্য <b>MongoDB Community Server</b> download করুন, তারপর <b>mongosh</b>-ও install করুন, command-line shell যা এর সাথে কথা বলতে ব্যবহৃত হয় (পরের lesson-এ covered)। একটা local install একটা সরল connection string দিয়ে connect করে:</p>'),
      code('text', 'mongodb://localhost:27017', false),
      h(2, 'MongoDB Compass — একটা Visual Option', 'mongodb-compass-a-visual-option'),
      p('<p>Shell-এর পাশাপাশি, <b>MongoDB Compass</b> হলো database, collection, আর document browse করার জন্য একটা ফ্রি desktop GUI, command না টাইপ করে। এটা optional — এই কোর্সের সবকিছু command line থেকে কাজ করে — কিন্তু শেখার সময় visually data পরিদর্শন করার জন্য useful।</p>'),
      callout('tip', '<p>এই কোর্সের উদাহরণ Atlas ধরে নেয়, কারণ এর কোনো local install দরকার নেই আর বেশিরভাগ team production-এ আসলে যা ব্যবহার করে তার সাথে মেলে। যেখানেই আপনি একটা connection string দেখেন, আপনি যদি সেই পথ নেন তাহলে আপনার নিজের Atlas string দিয়ে প্রতিস্থাপন করুন।</p>', 'এই কোর্স default হিসেবে Atlas ধরে নেয়'),
    ],
  },
})

// 3 ─────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'databases-collections-documents', sortOrder: n++,
  en: {
    title: 'Databases, Collections & Documents',
    metaTitle: 'Databases, Collections & Documents | Learn Computer Academy',
    metaDescription: 'The three-level structure of MongoDB — databases, collections, and documents — and how BSON differs from plain JSON.',
    blocks: [
      p('<p>Every piece of data in MongoDB lives inside this three-level structure: a <b>database</b> contains <b>collections</b>, and each collection contains <b>documents</b>. Understanding this hierarchy makes every command in the rest of this course make sense.</p>'),
      img('docs/img/mongodb/db-collection-document-hierarchy', 'A diagram showing MongoDB\'s nested hierarchy: a database box containing collection boxes, each containing document boxes with labeled fields', 774, 432, 'Database → Collection → Document → Fields — MongoDB\'s core structure.'),
      h(2, 'Database'),
      p('<p>A <b>database</b> is the top-level container — a single MongoDB server can host many databases, each isolated from the others. A typical project uses one database, e.g. <code>blogApp</code> or <code>shopDB</code>.</p>'),
      h(2, 'Collection'),
      p('<p>A <b>collection</b> is a group of related documents, roughly equivalent to a table in SQL — except a collection has no fixed schema by default. A <code>users</code> collection holds user documents, an <code>orders</code> collection holds order documents.</p>'),
      h(2, 'Document'),
      p('<p>A <b>document</b> is a single record, stored as a set of field/value pairs — the MongoDB equivalent of a row. Documents in the same collection are not required to share the same fields, though in practice most documents in a collection do follow a consistent shape by convention.</p>'),
      code('javascript', `// A document inside the "users" collection
{
  _id: ObjectId("651f2a9e1c4a2b0012a4f8d1"),
  name: "Rahul Verma",
  email: "rahul@example.com",
  age: 24,
  isActive: true
}`, false),
      h(2, 'BSON, Not Plain JSON'),
      p('<p>MongoDB documents look like JSON, but they are actually stored as <b>BSON</b> ("Binary JSON") — a binary-encoded format that adds data types JSON does not have natively, like dates, binary data, and the <code>ObjectId</code> type used for <code>_id</code>. You write and read data that looks like JSON; MongoDB handles the BSON conversion for you.</p>'),
      callout('note', '<p>Every document gets a unique <code>_id</code> field automatically if you don\'t supply one — MongoDB generates an <code>ObjectId</code>, a 12-byte value that is effectively guaranteed unique. This is the direct equivalent of a SQL primary key.</p>', 'The _id field'),
    ],
  },
  bn: {
    title: 'Database, Collection আর Document',
    metaTitle: 'Database, Collection আর Document | Learn Computer Academy',
    metaDescription: 'MongoDB-র তিন-স্তরের গঠন — database, collection, আর document — আর BSON কীভাবে সাধারণ JSON থেকে ভিন্ন।',
    blocks: [
      p('<p>MongoDB-তে data-র প্রতিটা অংশ এই তিন-স্তরের গঠনের ভিতরে থাকে: একটা <b>database</b>-এ <b>collection</b> থাকে, আর প্রতিটা collection-এ <b>document</b> থাকে। এই hierarchy বোঝা এই কোর্সের বাকি প্রতিটা command অর্থবহ করে তোলে।</p>'),
      img('docs/img/mongodb/db-collection-document-hierarchy', 'MongoDB-র nested hierarchy দেখানো একটা diagram: collection box ধারণ করা একটা database box, প্রতিটাতে label করা field সহ document box', 774, 432, 'Database → Collection → Document → Field — MongoDB-র core গঠন।'),
      h(2, 'Database', 'database'),
      p('<p>একটা <b>database</b> হলো top-level container — একটা একক MongoDB server অনেক database host করতে পারে, প্রতিটা অন্যগুলো থেকে আলাদা। একটা সাধারণ প্রজেক্ট একটা database ব্যবহার করে, যেমন <code>blogApp</code> বা <code>shopDB</code>।</p>'),
      h(2, 'Collection', 'collection'),
      p('<p>একটা <b>collection</b> হলো related document-এর একটা গ্রুপ, SQL-এর একটা table-এর মোটামুটি সমতুল্য — শুধু একটা collection-এর default হিসেবে কোনো fixed schema নেই। একটা <code>users</code> collection user document ধারণ করে, একটা <code>orders</code> collection order document ধারণ করে।</p>'),
      h(2, 'Document', 'document'),
      p('<p>একটা <b>document</b> হলো একটা একক record, field/value pair-এর একটা সেট হিসেবে সংরক্ষিত — একটা row-এর MongoDB সমতুল্য। একই collection-এর document-এর একই field share করার প্রয়োজন নেই, যদিও practice-এ একটা collection-এর বেশিরভাগ document convention অনুযায়ী একটা সামঞ্জস্যপূর্ণ আকৃতি অনুসরণ করে।</p>'),
      code('javascript', `// "users" collection-এর ভিতরে একটা document
{
  _id: ObjectId("651f2a9e1c4a2b0012a4f8d1"),
  name: "Rahul Verma",
  email: "rahul@example.com",
  age: 24,
  isActive: true
}`, false),
      h(2, 'BSON, সাধারণ JSON না', 'bson-not-plain-json'),
      p('<p>MongoDB document দেখতে JSON-এর মতো, কিন্তু সেগুলো আসলে <b>BSON</b> ("Binary JSON") হিসেবে সংরক্ষিত — একটা binary-encoded format যা JSON-এ স্বাভাবিকভাবে না থাকা data type যোগ করে, যেমন date, binary data, আর <code>_id</code>-এর জন্য ব্যবহৃত <code>ObjectId</code> type। আপনি JSON-এর মতো দেখতে data লেখেন আর পড়েন; MongoDB আপনার জন্য BSON conversion handle করে।</p>'),
      callout('note', '<p>আপনি যদি একটা না দেন তাহলে প্রতিটা document স্বয়ংক্রিয়ভাবে একটা unique <code>_id</code> field পায় — MongoDB একটা <code>ObjectId</code> তৈরি করে, একটা 12-byte value যা কার্যকরভাবে unique guaranteed। এটা একটা SQL primary key-এর সরাসরি সমতুল্য।</p>', '_id field'),
    ],
  },
})

// 4 ─────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'connecting-with-mongosh', sortOrder: n++,
  en: {
    title: 'Connecting with mongosh',
    metaTitle: 'Connecting with mongosh | Learn Computer Academy',
    metaDescription: 'Using mongosh, MongoDB\'s command-line shell, to connect to a database and run your first commands.',
    blocks: [
      p('<p><b>mongosh</b> ("Mongo Shell") is MongoDB\'s official command-line tool for connecting to a database and running commands directly — everything in the CRUD lessons that follow can be typed straight into it.</p>'),
      img('docs/img/mongodb/mongosh-hero', 'An isometric illustration of a dark terminal window with a green cursor prompt, connected by a line to a database cylinder', 1024, 768, 'mongosh — a command-line shell for talking to MongoDB directly.'),
      h(2, 'Connecting'),
      p('<p>Open a terminal and run <code>mongosh</code> followed by your connection string (from Atlas or a local install, per the previous lesson):</p>'),
      code('bash', 'mongosh "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/"', false),
      p('<p>A successful connection drops you into a prompt like <code>test&gt;</code>, ready to run commands.</p>'),
      h(2, 'Basic Navigation Commands'),
      table(['Command', 'What it does'], [
        ['show dbs', 'Lists every database on this connection'],
        ['use myDatabase', 'Switches to (or creates, on first write) a database'],
        ['show collections', 'Lists every collection in the current database'],
        ['db', 'Prints the name of the database you are currently using'],
      ]),
      h(2, 'Your First Command'),
      p('<p>Switch to a fresh database and count the documents in a collection that does not exist yet — MongoDB does not error, it simply reports zero:</p>'),
      code('javascript', `use learningMongo
db.users.countDocuments()
// 0`, true),
      callout('tip', '<p>MongoDB creates databases and collections <b>lazily</b> — nothing actually gets created on disk until you insert the first document into it. Running <code>use someDatabase</code> alone does not create anything yet.</p>', 'Databases and collections appear on first write'),
    ],
  },
  bn: {
    title: 'mongosh দিয়ে Connect করা',
    metaTitle: 'mongosh দিয়ে Connect করা | Learn Computer Academy',
    metaDescription: 'একটা database-এ connect করতে আর আপনার প্রথম command চালাতে mongosh, MongoDB-র command-line shell, ব্যবহার করা।',
    blocks: [
      p('<p><b>mongosh</b> ("Mongo Shell") হলো একটা database-এ connect করতে আর সরাসরি command চালাতে MongoDB-র official command-line টুল — পরের CRUD lesson-এর সবকিছু সরাসরি এতে টাইপ করা যায়।</p>'),
      img('docs/img/mongodb/mongosh-hero', 'একটা সবুজ cursor prompt সহ একটা গাঢ় terminal window-এর isometric illustration, একটা database cylinder-এর সাথে একটা লাইন দিয়ে connected', 1024, 768, 'mongosh — সরাসরি MongoDB-র সাথে কথা বলার জন্য একটা command-line shell।'),
      h(2, 'Connect করা', 'connecting'),
      p('<p>একটা terminal খুলুন আর আপনার connection string সহ <code>mongosh</code> চালান (Atlas বা একটা local install থেকে, আগের lesson অনুযায়ী):</p>'),
      code('bash', 'mongosh "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/"', false),
      p('<p>একটা সফল connection আপনাকে <code>test&gt;</code>-এর মতো একটা prompt-এ ফেলে, command চালানোর জন্য প্রস্তুত।</p>'),
      h(2, 'মৌলিক Navigation Command', 'basic-navigation-commands'),
      table(['Command', 'এটা কী করে'], [
        ['show dbs', 'এই connection-এর প্রতিটা database তালিকাভুক্ত করে'],
        ['use myDatabase', 'একটা database-এ switch করে (বা প্রথম write-এ তৈরি করে)'],
        ['show collections', 'বর্তমান database-এর প্রতিটা collection তালিকাভুক্ত করে'],
        ['db', 'আপনি বর্তমানে যে database ব্যবহার করছেন তার নাম প্রিন্ট করে'],
      ]),
      h(2, 'আপনার প্রথম Command', 'your-first-command'),
      p('<p>একটা নতুন database-এ switch করুন আর এখনও নেই এমন একটা collection-এর document গণনা করুন — MongoDB error দেয় না, এটা কেবল শূন্য report করে:</p>'),
      code('javascript', `use learningMongo
db.users.countDocuments()
// 0`, true),
      callout('tip', '<p>MongoDB database আর collection <b>lazily</b> তৈরি করে — আপনি এতে প্রথম document insert না করা পর্যন্ত disk-এ আসলে কিছু তৈরি হয় না। শুধু <code>use someDatabase</code> চালানো এখনও কিছু তৈরি করে না।</p>', 'প্রথম write-এ database আর collection দেখা যায়'),
    ],
  },
})

// 5 ─────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'inserting-documents', sortOrder: n++,
  en: {
    title: 'Inserting Documents',
    metaTitle: 'Inserting Documents | Learn Computer Academy',
    metaDescription: 'Adding new documents to a collection with insertOne() and insertMany(), and how MongoDB assigns the _id field.',
    blocks: [
      p('<p>Adding data to a collection is done with <code>insertOne()</code> for a single document, or <code>insertMany()</code> for several at once.</p>'),
      img('docs/img/mongodb/insert-hero', 'An isometric illustration of a document icon being dropped into an open drawer-like collection tray, with a plus symbol', 1024, 768, 'insertOne() and insertMany() add new documents to a collection.'),
      h(2, 'insertOne()'),
      code('javascript', `db.users.insertOne({
  name: "Ananya Roy",
  email: "ananya@example.com",
  age: 27
})`, true),
      p('<p>The response includes the generated <code>_id</code> of the new document, confirming it was created:</p>'),
      code('javascript', `{
  acknowledged: true,
  insertedId: ObjectId("651f2b1a1c4a2b0012a4f8d2")
}`, false),
      h(2, 'insertMany()'),
      p('<p>Pass an array of documents to insert several in a single call — this is meaningfully faster than calling <code>insertOne()</code> in a loop, since it is one round trip to the database instead of many:</p>'),
      code('javascript', `db.users.insertMany([
  { name: "Karan Mehta", age: 22 },
  { name: "Sneha Patel", age: 30 },
  { name: "Vikram Singh", age: 25 }
])`, true),
      h(2, 'Supplying Your Own _id'),
      p('<p>You can set <code>_id</code> explicitly instead of letting MongoDB generate one — useful when you want a predictable, human-meaningful identifier. MongoDB will reject the insert if the value is already in use in that collection:</p>'),
      code('javascript', `db.users.insertOne({
  _id: "user-ananya",
  name: "Ananya Roy"
})`, true),
      callout('warning', '<p>Once set, a document\'s <code>_id</code> cannot be changed — trying to <code>update()</code> the <code>_id</code> field throws an error. If you need a different identifier later, you must delete and re-insert the document.</p>', '_id is immutable'),
    ],
  },
  bn: {
    title: 'Document Insert করা',
    metaTitle: 'Document Insert করা | Learn Computer Academy',
    metaDescription: 'insertOne() আর insertMany() দিয়ে একটা collection-এ নতুন document যোগ করা, আর MongoDB কীভাবে _id field assign করে।',
    blocks: [
      p('<p>একটা collection-এ data যোগ করা হয় একটা একক document-এর জন্য <code>insertOne()</code> দিয়ে, বা একসাথে বেশ কয়েকটার জন্য <code>insertMany()</code> দিয়ে।</p>'),
      img('docs/img/mongodb/insert-hero', 'একটা প্লাস সিম্বল সহ একটা খোলা drawer-এর মতো collection tray-তে একটা document icon ফেলা হচ্ছে এমন একটা isometric illustration', 1024, 768, 'insertOne() আর insertMany() একটা collection-এ নতুন document যোগ করে।'),
      h(2, 'insertOne()', 'insertone'),
      code('javascript', `db.users.insertOne({
  name: "Ananya Roy",
  email: "ananya@example.com",
  age: 27
})`, true),
      p('<p>Response-এ নতুন document-এর generate করা <code>_id</code> অন্তর্ভুক্ত থাকে, নিশ্চিত করে যে এটা তৈরি হয়েছে:</p>'),
      code('javascript', `{
  acknowledged: true,
  insertedId: ObjectId("651f2b1a1c4a2b0012a4f8d2")
}`, false),
      h(2, 'insertMany()', 'insertmany'),
      p('<p>একটা একক call-এ বেশ কয়েকটা insert করতে document-এর একটা array pass করুন — এটা একটা loop-এ <code>insertOne()</code> call করার চেয়ে অর্থপূর্ণভাবে দ্রুত, কারণ এটা অনেকগুলোর বদলে database-এ একটা round trip:</p>'),
      code('javascript', `db.users.insertMany([
  { name: "Karan Mehta", age: 22 },
  { name: "Sneha Patel", age: 30 },
  { name: "Vikram Singh", age: 25 }
])`, true),
      h(2, 'আপনার নিজের _id দেওয়া', 'supplying-your-own-_id'),
      p('<p>MongoDB-কে একটা generate করতে দেওয়ার বদলে আপনি <code>_id</code> explicitly set করতে পারেন — যখন আপনি একটা predictable, মানুষের কাছে অর্থপূর্ণ identifier চান তখন useful। সেই collection-এ value ইতিমধ্যে ব্যবহৃত হলে MongoDB insert প্রত্যাখ্যান করবে:</p>'),
      code('javascript', `db.users.insertOne({
  _id: "user-ananya",
  name: "Ananya Roy"
})`, true),
      callout('warning', '<p>একবার set হয়ে গেলে, একটা document-এর <code>_id</code> বদলানো যায় না — <code>_id</code> field <code>update()</code> করার চেষ্টা একটা error throw করে। পরে আপনার একটা ভিন্ন identifier দরকার হলে, আপনাকে document delete করে আবার insert করতে হবে।</p>', '_id immutable'),
    ],
  },
})

// 6 ─────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'finding-documents', sortOrder: n++,
  en: {
    title: 'Finding Documents',
    metaTitle: 'Finding Documents | Learn Computer Academy',
    metaDescription: 'Querying a collection with find() and findOne(), and matching documents by field value.',
    blocks: [
      p('<p>Reading data back out uses <code>find()</code>, which returns every matching document, and <code>findOne()</code>, which returns just the first match.</p>'),
      img('docs/img/mongodb/find-hero', 'An isometric illustration of a magnifying glass hovering over a stack of document icons, highlighting one in green', 1024, 768, 'find() and findOne() query a collection for matching documents.'),
      h(2, 'find() — Every Match'),
      p('<p>Called with no arguments, <code>find()</code> returns every document in the collection:</p>'),
      code('javascript', 'db.users.find()', true),
      p('<p>Pass a query object to filter by field value — this returns every document where <code>age</code> is exactly <code>27</code>:</p>'),
      code('javascript', 'db.users.find({ age: 27 })', true),
      h(2, 'findOne() — Just the First Match'),
      p('<p>Use <code>findOne()</code> when you expect (or only care about) a single result — it returns one document object directly, not a list:</p>'),
      code('javascript', 'db.users.findOne({ email: "ananya@example.com" })', true),
      h(2, 'Making Output Readable'),
      p('<p>Chain <code>.pretty()</code> in the shell to format results with indentation instead of a single line of JSON:</p>'),
      code('javascript', 'db.users.find().pretty()', true),
      callout('note', '<p><code>find()</code> actually returns a <b>cursor</b>, not an array — the shell automatically prints the first 20 results and lets you type <code>it</code> to see more. From application code (Node.js, later in this course), you typically convert the cursor to an array with <code>.toArray()</code>.</p>', 'find() returns a cursor'),
    ],
  },
  bn: {
    title: 'Document খোঁজা',
    metaTitle: 'Document খোঁজা | Learn Computer Academy',
    metaDescription: 'find() আর findOne() দিয়ে একটা collection query করা, আর field value দিয়ে document match করা।',
    blocks: [
      p('<p>Data ফিরে পড়া <code>find()</code> ব্যবহার করে, যা প্রতিটা matching document return করে, আর <code>findOne()</code>, যা শুধু প্রথম match return করে।</p>'),
      img('docs/img/mongodb/find-hero', 'document icon-এর একটা stack-এর ওপর ভাসমান একটা magnifying glass-এর isometric illustration, একটাকে সবুজে highlight করছে', 1024, 768, 'find() আর findOne() matching document-এর জন্য একটা collection query করে।'),
      h(2, 'find() — প্রতিটা Match', 'find-every-match'),
      p('<p>কোনো argument ছাড়া call করা হলে, <code>find()</code> collection-এর প্রতিটা document return করে:</p>'),
      code('javascript', 'db.users.find()', true),
      p('<p>Field value দিয়ে filter করতে একটা query object pass করুন — এটা প্রতিটা document return করে যেখানে <code>age</code> ঠিক <code>27</code>:</p>'),
      code('javascript', 'db.users.find({ age: 27 })', true),
      h(2, 'findOne() — শুধু প্রথম Match', 'findone-just-the-first-match'),
      p('<p>যখন আপনি একটা একক result আশা করেন (বা শুধু তা নিয়েই চিন্তিত) তখন <code>findOne()</code> ব্যবহার করুন — এটা সরাসরি একটা document object return করে, একটা list না:</p>'),
      code('javascript', 'db.users.findOne({ email: "ananya@example.com" })', true),
      h(2, 'Output পাঠযোগ্য করা', 'making-output-readable'),
      p('<p>JSON-এর একক লাইনের বদলে indentation দিয়ে result format করতে shell-এ <code>.pretty()</code> chain করুন:</p>'),
      code('javascript', 'db.users.find().pretty()', true),
      callout('note', '<p><code>find()</code> আসলে একটা <b>cursor</b> return করে, একটা array না — shell স্বয়ংক্রিয়ভাবে প্রথম ২০টা result প্রিন্ট করে আর আপনাকে আরও দেখতে <code>it</code> টাইপ করতে দেয়। Application code থেকে (Node.js, এই কোর্সে পরে), আপনি সাধারণত <code>.toArray()</code> দিয়ে cursor-কে একটা array-তে convert করেন।</p>', 'find() একটা cursor return করে'),
    ],
  },
})

// 7 ─────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'query-operators', sortOrder: n++,
  en: {
    title: 'Comparison & Logical Query Operators',
    metaTitle: 'Comparison & Logical Query Operators | Learn Computer Academy',
    metaDescription: 'Filtering documents with $gt, $lt, $in, $and, $or, and the other query operators that go beyond exact-match.',
    blocks: [
      p('<p>Matching an exact value only gets you so far. <b>Query operators</b> — always written with a leading <code>$</code> — let you filter by ranges, sets, and combinations of conditions.</p>'),
      img('docs/img/mongodb/operators-hero', 'An isometric illustration of a funnel filtering colored document shapes, with mathematical comparison symbols floating around it', 1024, 768, 'Query operators filter documents by range, set membership, and logical combinations.'),
      h(2, 'Comparison Operators'),
      table(['Operator', 'Meaning'], [
        ['$gt', 'Greater than'],
        ['$gte', 'Greater than or equal to'],
        ['$lt', 'Less than'],
        ['$lte', 'Less than or equal to'],
        ['$ne', 'Not equal to'],
        ['$in', 'Matches any value in a given array'],
        ['$nin', 'Matches none of the values in a given array'],
      ]),
      code('javascript', `// Users older than 25
db.users.find({ age: { $gt: 25 } })

// Users whose role is one of these three
db.users.find({ role: { $in: ["admin", "editor", "moderator"] } })`, true),
      h(2, 'Logical Operators'),
      p('<p><code>$and</code> and <code>$or</code> combine multiple conditions. In practice, listing two fields in the same object is already an implicit <code>$and</code> — the explicit operator is mainly needed when combining multiple conditions <b>on the same field</b>.</p>'),
      code('javascript', `// Implicit AND — age > 20 AND role = "editor"
db.users.find({ age: { $gt: 20 }, role: "editor" })

// Explicit OR — role is admin OR age is over 60
db.users.find({
  $or: [
    { role: "admin" },
    { age: { $gt: 60 } }
  ]
})`, true),
      h(2, 'Element and Existence Operators'),
      p('<p><code>$exists</code> checks whether a field is present at all — genuinely useful in MongoDB, since not every document is guaranteed to have every field:</p>'),
      code('javascript', 'db.users.find({ phoneNumber: { $exists: true } })', true),
      callout('tip', '<p>All of these operators combine freely inside one query — you are not limited to using just one at a time. A real query filtering "active editors aged 20–35" would use <code>$gte</code>, <code>$lte</code>, and an implicit <code>$and</code> together in a single object.</p>', 'Operators combine freely'),
    ],
  },
  bn: {
    title: 'Comparison আর Logical Query Operator',
    metaTitle: 'Comparison আর Logical Query Operator | Learn Computer Academy',
    metaDescription: '$gt, $lt, $in, $and, $or, আর exact-match ছাড়িয়ে যাওয়া অন্য query operator দিয়ে document filter করা।',
    blocks: [
      p('<p>একটা exact value match করা শুধু একটা নির্দিষ্ট পর্যন্ত নিয়ে যায়। <b>Query operator</b> — সবসময় একটা leading <code>$</code> দিয়ে লেখা — আপনাকে range, set, আর condition-এর combination দিয়ে filter করতে দেয়।</p>'),
      img('docs/img/mongodb/operators-hero', 'রঙিন document shape filter করা একটা funnel-এর isometric illustration, এর চারপাশে ভাসমান mathematical comparison symbol সহ', 1024, 768, 'Query operator range, set membership, আর logical combination দিয়ে document filter করে।'),
      h(2, 'Comparison Operator', 'comparison-operators'),
      table(['Operator', 'অর্থ'], [
        ['$gt', 'চেয়ে বড়'],
        ['$gte', 'চেয়ে বড় বা সমান'],
        ['$lt', 'চেয়ে ছোট'],
        ['$lte', 'চেয়ে ছোট বা সমান'],
        ['$ne', 'সমান না'],
        ['$in', 'একটা প্রদত্ত array-এর যেকোনো value match করে'],
        ['$nin', 'একটা প্রদত্ত array-এর কোনো value match করে না'],
      ]),
      code('javascript', `// ২৫-এর বেশি বয়সী user
db.users.find({ age: { $gt: 25 } })

// যে user-এর role এই তিনটার একটা
db.users.find({ role: { $in: ["admin", "editor", "moderator"] } })`, true),
      h(2, 'Logical Operator', 'logical-operators'),
      p('<p><code>$and</code> আর <code>$or</code> একাধিক condition একসাথে করে। Practice-এ, একই object-এ দুটো field তালিকাভুক্ত করা ইতিমধ্যে একটা implicit <code>$and</code> — explicit operator প্রধানত দরকার হয় যখন <b>একই field-এ</b> একাধিক condition combine করা হয়।</p>'),
      code('javascript', `// Implicit AND — age > 20 আর role = "editor"
db.users.find({ age: { $gt: 20 }, role: "editor" })

// Explicit OR — role admin অথবা age 60-এর বেশি
db.users.find({
  $or: [
    { role: "admin" },
    { age: { $gt: 60 } }
  ]
})`, true),
      h(2, 'Element আর Existence Operator', 'element-and-existence-operators'),
      p('<p><code>$exists</code> চেক করে একটা field আদৌ আছে কিনা — MongoDB-তে সত্যিই useful, কারণ প্রতিটা document-এর প্রতিটা field থাকার guarantee নেই:</p>'),
      code('javascript', 'db.users.find({ phoneNumber: { $exists: true } })', true),
      callout('tip', '<p>এই operator-গুলো একটা query-র ভিতরে অবাধে combine হয় — আপনি একবারে শুধু একটা ব্যবহার করতে সীমাবদ্ধ না। "২০–৩৫ বছর বয়সী active editor" filter করা একটা real query একটা single object-এ একসাথে <code>$gte</code>, <code>$lte</code>, আর একটা implicit <code>$and</code> ব্যবহার করবে।</p>', 'Operator অবাধে combine হয়'),
    ],
  },
})

// 8 ─────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'updating-documents', sortOrder: n++,
  en: {
    title: 'Updating Documents',
    metaTitle: 'Updating Documents | Learn Computer Academy',
    metaDescription: 'Changing existing documents with updateOne() and updateMany(), and the $set, $inc, $push, and $unset update operators.',
    blocks: [
      p('<p>Changing existing data uses <code>updateOne()</code> or <code>updateMany()</code>, paired with <b>update operators</b> that describe exactly what should change.</p>'),
      img('docs/img/mongodb/update-hero', 'An isometric illustration of a pencil editing a highlighted field inside a document icon, with a small refresh arrow', 1024, 768, 'updateOne() and updateMany() change fields on existing documents.'),
      h(2, '$set — Change a Field\'s Value'),
      code('javascript', `db.users.updateOne(
  { name: "Karan Mehta" },
  { $set: { age: 23 } }
)`, true),
      h(2, '$inc — Increase or Decrease a Number'),
      p('<p><code>$inc</code> adds (or, with a negative number, subtracts) a value to a numeric field — useful for counters, without needing to read the current value first:</p>'),
      code('javascript', `db.products.updateOne(
  { name: "Notebook" },
  { $inc: { stock: -1 } }
)`, true),
      h(2, '$push — Add to an Array'),
      code('javascript', `db.users.updateOne(
  { name: "Karan Mehta" },
  { $push: { skills: "TypeScript" } }
)`, true),
      h(2, '$unset — Remove a Field'),
      code('javascript', `db.users.updateOne(
  { name: "Karan Mehta" },
  { $unset: { temporaryFlag: "" } }
)`, true),
      h(2, 'updateMany() — Every Matching Document'),
      code('javascript', `db.users.updateMany(
  { isActive: false },
  { $set: { status: "archived" } }
)`, true),
      callout('warning', '<p>Forgetting the update operator and writing <code>{ age: 23 }</code> instead of <code>{ $set: { age: 23 } }</code> <b>replaces the entire document</b> with just <code>{ age: 23 }</code>, deleting every other field. Always wrap changes in an operator like <code>$set</code>.</p>', 'A missing operator replaces the whole document'),
    ],
  },
  bn: {
    title: 'Document Update করা',
    metaTitle: 'Document Update করা | Learn Computer Academy',
    metaDescription: 'updateOne() আর updateMany() দিয়ে বিদ্যমান document পরিবর্তন করা, আর $set, $inc, $push, আর $unset update operator।',
    blocks: [
      p('<p>বিদ্যমান data পরিবর্তন <code>updateOne()</code> বা <code>updateMany()</code> ব্যবহার করে, <b>update operator</b>-এর সাথে জোড়া লাগানো যা ঠিক কী পরিবর্তন হওয়া উচিত তা বর্ণনা করে।</p>'),
      img('docs/img/mongodb/update-hero', 'একটা ছোট refresh arrow সহ একটা document icon-এর ভিতরে একটা highlight করা field edit করা একটা pencil-এর isometric illustration', 1024, 768, 'updateOne() আর updateMany() বিদ্যমান document-এর field পরিবর্তন করে।'),
      h(2, '$set — একটা Field-এর Value পরিবর্তন করা', 'set-change-a-fields-value'),
      code('javascript', `db.users.updateOne(
  { name: "Karan Mehta" },
  { $set: { age: 23 } }
)`, true),
      h(2, '$inc — একটা সংখ্যা বাড়ানো বা কমানো', 'inc-increase-or-decrease-a-number'),
      p('<p><code>$inc</code> একটা numeric field-এ একটা value যোগ করে (বা, একটা negative সংখ্যা দিয়ে, বিয়োগ করে) — counter-এর জন্য useful, প্রথমে বর্তমান value পড়ার দরকার ছাড়াই:</p>'),
      code('javascript', `db.products.updateOne(
  { name: "Notebook" },
  { $inc: { stock: -1 } }
)`, true),
      h(2, '$push — একটা Array-এ যোগ করা', 'push-add-to-an-array'),
      code('javascript', `db.users.updateOne(
  { name: "Karan Mehta" },
  { $push: { skills: "TypeScript" } }
)`, true),
      h(2, '$unset — একটা Field সরানো', 'unset-remove-a-field'),
      code('javascript', `db.users.updateOne(
  { name: "Karan Mehta" },
  { $unset: { temporaryFlag: "" } }
)`, true),
      h(2, 'updateMany() — প্রতিটা Matching Document', 'updatemany-every-matching-document'),
      code('javascript', `db.users.updateMany(
  { isActive: false },
  { $set: { status: "archived" } }
)`, true),
      callout('warning', '<p>Update operator ভুলে গিয়ে <code>{ $set: { age: 23 } }</code>-এর বদলে <code>{ age: 23 }</code> লেখা শুধু <code>{ age: 23 }</code> দিয়ে <b>পুরো document প্রতিস্থাপন করে</b>, অন্য প্রতিটা field মুছে দেয়। সবসময় <code>$set</code>-এর মতো একটা operator-এ পরিবর্তন wrap করুন।</p>', 'একটা missing operator পুরো document প্রতিস্থাপন করে'),
    ],
  },
})

// 9 ─────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'deleting-documents', sortOrder: n++,
  en: {
    title: 'Deleting Documents',
    metaTitle: 'Deleting Documents | Learn Computer Academy',
    metaDescription: 'Removing documents from a collection with deleteOne() and deleteMany(), and the difference between deleting documents and dropping a whole collection.',
    blocks: [
      p('<p>Removing data uses <code>deleteOne()</code> for a single document or <code>deleteMany()</code> for every document matching a filter.</p>'),
      img('docs/img/mongodb/delete-hero', 'An isometric illustration of a document icon being pulled into a trash bin, with a red X mark', 1024, 768, 'deleteOne() and deleteMany() permanently remove matching documents.'),
      h(2, 'deleteOne()'),
      p('<p>Removes the first document matching the filter — if several documents match, only one is deleted:</p>'),
      code('javascript', 'db.users.deleteOne({ name: "Vikram Singh" })', true),
      h(2, 'deleteMany()'),
      p('<p>Removes every document matching the filter:</p>'),
      code('javascript', 'db.users.deleteMany({ status: "archived" })', true),
      h(2, 'Deleting Every Document in a Collection'),
      p('<p>Passing an empty filter object matches every document, effectively emptying the collection while keeping it (and any indexes on it) intact:</p>'),
      code('javascript', 'db.users.deleteMany({})', true),
      h(2, 'Dropping a Whole Collection'),
      p('<p><code>drop()</code> deletes the entire collection — not just its documents, but the collection itself and any indexes defined on it. This is a separate, more permanent operation from <code>deleteMany({})</code>:</p>'),
      code('javascript', 'db.users.drop()', true),
      callout('danger', '<p>None of these operations can be undone from inside MongoDB. Before running <code>deleteMany()</code> or <code>drop()</code> against real data, run the equivalent <code>find()</code> query first to see exactly what would be affected.</p>', 'Deletes are permanent — check with find() first'),
    ],
  },
  bn: {
    title: 'Document Delete করা',
    metaTitle: 'Document Delete করা | Learn Computer Academy',
    metaDescription: 'deleteOne() আর deleteMany() দিয়ে একটা collection থেকে document সরানো, আর document delete করা আর একটা পুরো collection drop করার মধ্যে পার্থক্য।',
    blocks: [
      p('<p>Data সরানো একটা একক document-এর জন্য <code>deleteOne()</code> বা একটা filter match করা প্রতিটা document-এর জন্য <code>deleteMany()</code> ব্যবহার করে।</p>'),
      img('docs/img/mongodb/delete-hero', 'একটা লাল X চিহ্ন সহ একটা trash bin-এ টানা হচ্ছে এমন একটা document icon-এর isometric illustration', 1024, 768, 'deleteOne() আর deleteMany() স্থায়ীভাবে matching document সরায়।'),
      h(2, 'deleteOne()', 'deleteone'),
      p('<p>Filter match করা প্রথম document সরায় — যদি একাধিক document match করে, শুধু একটা delete হয়:</p>'),
      code('javascript', 'db.users.deleteOne({ name: "Vikram Singh" })', true),
      h(2, 'deleteMany()', 'deletemany'),
      p('<p>Filter match করা প্রতিটা document সরায়:</p>'),
      code('javascript', 'db.users.deleteMany({ status: "archived" })', true),
      h(2, 'একটা Collection-এর প্রতিটা Document Delete করা', 'deleting-every-document-in-a-collection'),
      p('<p>একটা খালি filter object pass করা প্রতিটা document match করে, কার্যকরভাবে collection খালি করে দেয় সেটাকে (আর এর ওপর যেকোনো index) অক্ষত রেখে:</p>'),
      code('javascript', 'db.users.deleteMany({})', true),
      h(2, 'একটা পুরো Collection Drop করা', 'dropping-a-whole-collection'),
      p('<p><code>drop()</code> পুরো collection delete করে — শুধু এর document না, বরং collection নিজে আর এর ওপর define করা যেকোনো index। এটা <code>deleteMany({})</code> থেকে একটা আলাদা, আরও স্থায়ী operation:</p>'),
      code('javascript', 'db.users.drop()', true),
      callout('danger', '<p>এই operation-গুলোর কোনোটাই MongoDB-র ভিতর থেকে undo করা যায় না। Real data-র বিরুদ্ধে <code>deleteMany()</code> বা <code>drop()</code> চালানোর আগে, ঠিক কী affected হবে তা দেখতে প্রথমে সমতুল্য <code>find()</code> query চালান।</p>', 'Delete স্থায়ী — প্রথমে find() দিয়ে চেক করুন'),
    ],
  },
})

// 10 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'sorting-limiting-skipping', sortOrder: n++,
  en: {
    title: 'Sorting, Limiting & Skipping',
    metaTitle: 'Sorting, Limiting & Skipping | Learn Computer Academy',
    metaDescription: 'Ordering query results with sort(), capping how many come back with limit(), and paginating with skip().',
    blocks: [
      p('<p>Three chainable methods control the shape of a <code>find()</code> result: <code>sort()</code> orders it, <code>limit()</code> caps how many documents come back, and <code>skip()</code> discards a number of results from the start — the combination used to build pagination.</p>'),
      img('docs/img/mongodb/sort-hero', 'An isometric illustration of document cards being arranged in a sorted vertical stack with an ascending arrow beside them', 1024, 768, 'sort(), limit(), and skip() chain onto find() to shape query results.'),
      h(2, 'sort()'),
      p('<p>Pass a field with <code>1</code> for ascending or <code>-1</code> for descending:</p>'),
      code('javascript', `// Oldest to youngest
db.users.find().sort({ age: 1 })

// Youngest to oldest
db.users.find().sort({ age: -1 })`, true),
      h(2, 'limit()'),
      p('<p>Caps the number of documents returned — useful for "top 5" style results, and for keeping large collections from returning everything at once:</p>'),
      code('javascript', 'db.users.find().sort({ age: -1 }).limit(5)', true),
      h(2, 'skip()'),
      p('<p>Skips a number of documents before returning results — combined with <code>limit()</code>, this is exactly how pagination works:</p>'),
      code('javascript', `// Page 2, 10 results per page: skip the first 10, then take 10
db.users.find().sort({ name: 1 }).skip(10).limit(10)`, true),
      h(2, 'Method Order Matters in Reading, Not Execution'),
      p('<p>MongoDB always applies sort, then skip, then limit internally regardless of the order you chain them in the shell — but writing them in that order (<code>.sort().skip().limit()</code>) makes the query read the same way it actually behaves, which matters when someone else reads your code later.</p>'),
      callout('tip', '<p>For real pagination, calculate <code>skip</code> as <code>(pageNumber - 1) * pageSize</code>. Skipping a very large number of documents gets slower as the number grows, since MongoDB still has to walk past every skipped document — for deep pagination on large collections, a different technique (cursor-based pagination) works better, but <code>skip()</code> is fine for typical page sizes.</p>', 'skip() is fine for typical pagination'),
    ],
  },
  bn: {
    title: 'Sorting, Limiting আর Skipping',
    metaTitle: 'Sorting, Limiting আর Skipping | Learn Computer Academy',
    metaDescription: 'sort() দিয়ে query result order করা, limit() দিয়ে কতগুলো ফিরে আসে তা সীমাবদ্ধ করা, আর skip() দিয়ে paginate করা।',
    blocks: [
      p('<p>তিনটা chainable method একটা <code>find()</code> result-এর আকৃতি নিয়ন্ত্রণ করে: <code>sort()</code> এটা order করে, <code>limit()</code> কতগুলো document ফিরে আসে তা সীমাবদ্ধ করে, আর <code>skip()</code> শুরু থেকে কিছু result বাদ দেয় — pagination তৈরি করতে ব্যবহৃত combination।</p>'),
      img('docs/img/mongodb/sort-hero', 'তাদের পাশে একটা ascending arrow সহ একটা sorted vertical stack-এ সাজানো document card-এর isometric illustration', 1024, 768, 'sort(), limit(), আর skip() query result আকৃতি দিতে find()-এ chain হয়।'),
      h(2, 'sort()', 'sort'),
      p('<p>Ascending-এর জন্য <code>1</code> বা descending-এর জন্য <code>-1</code> সহ একটা field pass করুন:</p>'),
      code('javascript', `// সবচেয়ে বয়স্ক থেকে সবচেয়ে ছোট
db.users.find().sort({ age: 1 })

// সবচেয়ে ছোট থেকে সবচেয়ে বয়স্ক
db.users.find().sort({ age: -1 })`, true),
      h(2, 'limit()', 'limit'),
      p('<p>Return করা document-এর সংখ্যা সীমাবদ্ধ করে — "top 5" স্টাইলের result-এর জন্য useful, আর বড় collection একবারে সবকিছু return করা থেকে আটকাতে:</p>'),
      code('javascript', 'db.users.find().sort({ age: -1 }).limit(5)', true),
      h(2, 'skip()', 'skip'),
      p('<p>Result return করার আগে কিছু document skip করে — <code>limit()</code>-এর সাথে combine করা হলে, এটাই ঠিক কীভাবে pagination কাজ করে:</p>'),
      code('javascript', `// Page 2, প্রতি page-এ ১০টা result: প্রথম ১০টা skip করুন, তারপর ১০টা নিন
db.users.find().sort({ name: 1 }).skip(10).limit(10)`, true),
      h(2, 'Reading-এ Method Order গুরুত্বপূর্ণ, Execution-এ না', 'method-order-matters-in-reading-not-execution'),
      p('<p>Shell-এ আপনি যে order-এ chain করেন তা নির্বিশেষে MongoDB সবসময় internally sort, তারপর skip, তারপর limit apply করে — কিন্তু সেই order-এ (<code>.sort().skip().limit()</code>) লেখা query-কে ঠিক যেভাবে এটা আচরণ করে সেভাবে পড়ায়, যা পরে অন্য কেউ আপনার code পড়লে গুরুত্বপূর্ণ।</p>'),
      callout('tip', '<p>Real pagination-এর জন্য, <code>skip</code>-কে <code>(pageNumber - 1) * pageSize</code> হিসেবে গণনা করুন। একটা খুব বড় সংখ্যক document skip করা সংখ্যা বাড়ার সাথে ধীর হয়ে যায়, কারণ MongoDB-কে এখনও skip করা প্রতিটা document অতিক্রম করতে হয় — বড় collection-এ deep pagination-এর জন্য, একটা ভিন্ন technique (cursor-based pagination) ভালো কাজ করে, কিন্তু সাধারণ page size-এর জন্য <code>skip()</code> ঠিক আছে।</p>', 'সাধারণ pagination-এর জন্য skip() ঠিক আছে'),
    ],
  },
})

// 11 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'projections', sortOrder: n++,
  en: {
    title: 'Projections',
    metaTitle: 'Projections | Learn Computer Academy',
    metaDescription: 'Choosing which fields a query returns, using a projection as the second argument to find().',
    blocks: [
      p('<p>By default, a query returns every field in a matching document. A <b>projection</b> — the second argument to <code>find()</code> — lets you choose exactly which fields come back, reducing how much data crosses the network for no reason.</p>'),
      img('docs/img/mongodb/projections-hero', 'An isometric illustration of a document with some fields highlighted green and others dimmed gray, representing selected vs excluded fields', 1024, 768, 'A projection selects which fields a query actually returns.'),
      h(2, 'Including Specific Fields'),
      p('<p>Set a field to <code>1</code> to include it. Once you include at least one field this way, only explicitly included fields (plus <code>_id</code>, unless excluded) come back:</p>'),
      code('javascript', `db.users.find(
  { isActive: true },
  { name: 1, email: 1 }
)
// Returns only _id, name, and email — nothing else`, true),
      h(2, 'Excluding Specific Fields'),
      p('<p>Set a field to <code>0</code> to exclude it instead, keeping everything else:</p>'),
      code('javascript', `db.users.find(
  {},
  { passwordHash: 0 }
)
// Returns every field except passwordHash`, true),
      h(2, 'Excluding _id'),
      p('<p><code>_id</code> is the one field always included by default even in an inclusion projection — turn it off explicitly if you don\'t need it:</p>'),
      code('javascript', `db.users.find(
  {},
  { name: 1, email: 1, _id: 0 }
)`, true),
      callout('warning', '<p>You cannot mix inclusion (<code>1</code>) and exclusion (<code>0</code>) in the same projection, except for <code>_id</code> — pick one direction per query. <code>{ name: 1, email: 0 }</code> throws an error.</p>', 'Cannot mix 1 and 0 (except _id)'),
      h(2, 'Why This Matters'),
      p('<p>Beyond reducing network traffic, projections are the standard way to keep sensitive fields like password hashes out of results your application code sends to a browser — leaving them out at the query level is safer than remembering to strip them later.</p>'),
    ],
  },
  bn: {
    title: 'Projection',
    metaTitle: 'Projection | Learn Computer Academy',
    metaDescription: 'find()-এর দ্বিতীয় argument হিসেবে একটা projection ব্যবহার করে, একটা query কোন field return করে তা বেছে নেওয়া।',
    blocks: [
      p('<p>Default হিসেবে, একটা query একটা matching document-এর প্রতিটা field return করে। একটা <b>projection</b> — <code>find()</code>-এর দ্বিতীয় argument — আপনাকে ঠিক কোন field ফিরে আসে তা বেছে নিতে দেয়, কোনো কারণ ছাড়াই কতটা data নেটওয়ার্ক অতিক্রম করে তা কমায়।</p>'),
      img('docs/img/mongodb/projections-hero', 'কিছু field সবুজে highlight করা আর অন্যগুলো ধূসর dim করা একটা document-এর isometric illustration, selected বনাম excluded field represent করছে', 1024, 768, 'একটা projection একটা query আসলে কোন field return করে তা বেছে নেয়।'),
      h(2, 'নির্দিষ্ট Field অন্তর্ভুক্ত করা', 'including-specific-fields'),
      p('<p>একটা field অন্তর্ভুক্ত করতে এটাকে <code>1</code>-এ set করুন। একবার আপনি এভাবে অন্তত একটা field অন্তর্ভুক্ত করলে, শুধু explicitly অন্তর্ভুক্ত field (আর <code>_id</code>, বাদ না দিলে) ফিরে আসে:</p>'),
      code('javascript', `db.users.find(
  { isActive: true },
  { name: 1, email: 1 }
)
// শুধু _id, name, আর email return করে — আর কিছু না`, true),
      h(2, 'নির্দিষ্ট Field বাদ দেওয়া', 'excluding-specific-fields'),
      p('<p>এর বদলে একটা field বাদ দিতে এটাকে <code>0</code>-এ set করুন, বাকি সবকিছু রেখে:</p>'),
      code('javascript', `db.users.find(
  {},
  { passwordHash: 0 }
)
// passwordHash ছাড়া প্রতিটা field return করে`, true),
      h(2, '_id বাদ দেওয়া', 'excluding-_id'),
      p('<p><code>_id</code> হলো একমাত্র field যা একটা inclusion projection-এও default হিসেবে সবসময় অন্তর্ভুক্ত থাকে — আপনার দরকার না হলে explicitly এটা বন্ধ করুন:</p>'),
      code('javascript', `db.users.find(
  {},
  { name: 1, email: 1, _id: 0 }
)`, true),
      callout('warning', '<p><code>_id</code> ছাড়া একই projection-এ আপনি inclusion (<code>1</code>) আর exclusion (<code>0</code>) মেশাতে পারবেন না — প্রতি query একটা দিক বেছে নিন। <code>{ name: 1, email: 0 }</code> একটা error throw করে।</p>', '_id ছাড়া 1 আর 0 মেশানো যায় না'),
      h(2, 'কেন এটা গুরুত্বপূর্ণ', 'why-this-matters'),
      p('<p>Network traffic কমানোর বাইরেও, projection হলো password hash-এর মতো sensitive field আপনার application code একটা browser-এ পাঠানো result থেকে বাইরে রাখার standard উপায় — query level-এ সেগুলো বাদ রাখা পরে সেগুলো strip করার কথা মনে রাখার চেয়ে নিরাপদ।</p>'),
    ],
  },
})

// 12 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'schema-design-embedding-vs-referencing', sortOrder: n++,
  en: {
    title: 'Schema Design — Embedding vs Referencing',
    metaTitle: 'Schema Design — Embedding vs Referencing | Learn Computer Academy',
    metaDescription: 'The single biggest decision in MongoDB schema design: nest related data as a sub-document, or store it in a separate collection and reference it.',
    blocks: [
      p('<p>MongoDB has no fixed schema, but that does not mean schema design does not matter — it means the decisions move from "which columns does this table have" to a different question: for any two related pieces of data, do you <b>embed</b> one inside the other, or keep them in separate collections and <b>reference</b> one from the other?</p>'),
      img('docs/img/mongodb/embedding-vs-referencing', 'A two-panel comparison diagram — the left panel shows a single document with a nested sub-document inside it labeled "Embedding", the right panel shows two separate documents connected by an arrow labeled "Referencing"', 690, 342, 'Embedding nests related data in one document. Referencing links two separate documents.'),
      h(2, 'Embedding'),
      p('<p><b>Embedding</b> puts related data directly inside the parent document, as a nested object or array:</p>'),
      code('javascript', `{
  name: "Rahul Verma",
  address: {
    city: "Kolkata",
    pincode: "700001"
  }
}`, false),
      p('<p>One query returns everything — no second lookup needed. Embedding fits data that is only ever read <i>with</i> its parent and does not grow without bound, like an address on a user, or line items on a specific order.</p>'),
      h(2, 'Referencing'),
      p('<p><b>Referencing</b> stores related data in its own collection, and the parent document holds just an <code>_id</code> pointing to it:</p>'),
      code('javascript', `// In the "authors" collection
{ _id: "auth1", name: "Rahul Verma" }

// In the "posts" collection
{ title: "Getting Started with MongoDB", authorId: "auth1" }`, false),
      p('<p>Referencing fits data that is reused across many parents (one author has many posts), grows without a practical limit (a popular post could have thousands of comments), or genuinely needs to be queried and updated on its own.</p>'),
      h(2, 'A Practical Rule of Thumb'),
      table(['Situation', 'Lean toward'], [
        ['Data only makes sense attached to its parent', 'Embedding'],
        ['Data is reused by multiple parents', 'Referencing'],
        ['The nested list could grow very large (thousands+)', 'Referencing'],
        ['You always read the two together', 'Embedding'],
        ['You need to query the child independently', 'Referencing'],
      ]),
      callout('note', '<p>This decision is the MongoDB equivalent of SQL normalization — but decided per relationship, not applied uniformly. The same application very often embeds some relationships and references others.</p>', 'Not an all-or-nothing choice'),
    ],
  },
  bn: {
    title: 'Schema Design — Embedding বনাম Referencing',
    metaTitle: 'Schema Design — Embedding বনাম Referencing | Learn Computer Academy',
    metaDescription: 'MongoDB schema design-এর একক সবচেয়ে বড় সিদ্ধান্ত: related data-কে একটা sub-document হিসেবে nest করা, নাকি একটা আলাদা collection-এ সংরক্ষণ করে reference করা।',
    blocks: [
      p('<p>MongoDB-র কোনো fixed schema নেই, কিন্তু এর মানে এই না যে schema design গুরুত্বপূর্ণ না — এর মানে সিদ্ধান্তগুলো "এই table-এর কোন column আছে" থেকে একটা ভিন্ন প্রশ্নে সরে যায়: যেকোনো দুটো related data-র জন্য, আপনি কি একটাকে অন্যটার ভিতরে <b>embed</b> করেন, নাকি সেগুলো আলাদা collection-এ রাখেন আর একটাকে অন্যটা থেকে <b>reference</b> করেন?</p>'),
      img('docs/img/mongodb/embedding-vs-referencing', 'একটা দুই-প্যানেলের comparison diagram — বাম প্যানেল "Embedding" label করা এর ভিতরে একটা nested sub-document সহ একটা একক document দেখায়, ডান প্যানেল "Referencing" label করা একটা arrow দিয়ে connected দুটো আলাদা document দেখায়', 690, 342, 'Embedding একটা document-এ related data nest করে। Referencing দুটো আলাদা document link করে।'),
      h(2, 'Embedding', 'embedding'),
      p('<p><b>Embedding</b> related data সরাসরি parent document-এর ভিতরে রাখে, একটা nested object বা array হিসেবে:</p>'),
      code('javascript', `{
  name: "Rahul Verma",
  address: {
    city: "Kolkata",
    pincode: "700001"
  }
}`, false),
      p('<p>একটা query সবকিছু return করে — কোনো দ্বিতীয় lookup দরকার নেই। Embedding সেই data-র জন্য উপযুক্ত যা শুধু তার parent-এর <i>সাথে</i> পড়া হয় আর সীমা ছাড়া বাড়ে না, যেমন একজন user-এর একটা address, বা একটা নির্দিষ্ট order-এর line item।</p>'),
      h(2, 'Referencing', 'referencing'),
      p('<p><b>Referencing</b> related data তার নিজের collection-এ সংরক্ষণ করে, আর parent document শুধু এর দিকে নির্দেশ করা একটা <code>_id</code> ধরে রাখে:</p>'),
      code('javascript', `// "authors" collection-এ
{ _id: "auth1", name: "Rahul Verma" }

// "posts" collection-এ
{ title: "Getting Started with MongoDB", authorId: "auth1" }`, false),
      p('<p>Referencing সেই data-র জন্য উপযুক্ত যা অনেক parent জুড়ে পুনরায় ব্যবহৃত হয় (একজন author-এর অনেক post আছে), একটা ব্যবহারিক সীমা ছাড়া বাড়ে (একটা জনপ্রিয় post-এর হাজার হাজার comment থাকতে পারে), বা সত্যিই নিজে থেকে query আর update করা দরকার।</p>'),
      h(2, 'একটা ব্যবহারিক নিয়ম', 'a-practical-rule-of-thumb'),
      table(['পরিস্থিতি', 'যেদিকে ঝুঁকবেন'], [
        ['Data শুধু এর parent-এর সাথে যুক্ত থাকলেই অর্থবহ', 'Embedding'],
        ['একাধিক parent দ্বারা data পুনরায় ব্যবহৃত হয়', 'Referencing'],
        ['Nested list খুব বড় হতে পারে (হাজার+)', 'Referencing'],
        ['আপনি সবসময় দুটো একসাথে পড়েন', 'Embedding'],
        ['আপনার child-কে স্বাধীনভাবে query করা দরকার', 'Referencing'],
      ]),
      callout('note', '<p>এই সিদ্ধান্তটা SQL normalization-এর MongoDB সমতুল্য — কিন্তু প্রতি relationship অনুযায়ী সিদ্ধান্ত নেওয়া হয়, সমানভাবে প্রয়োগ করা হয় না। একই application প্রায়ই কিছু relationship embed করে আর অন্যগুলো reference করে।</p>', 'সব-অথবা-কিছুই না এমন একটা পছন্দ না'),
    ],
  },
})

// 13 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'data-types', sortOrder: n++,
  en: {
    title: 'Data Types in MongoDB',
    metaTitle: 'Data Types in MongoDB | Learn Computer Academy',
    metaDescription: 'The BSON data types MongoDB supports: strings, numbers, booleans, dates, ObjectId, arrays, and embedded documents.',
    blocks: [
      p('<p>Because MongoDB stores data as BSON rather than plain JSON, it supports a richer set of data types than JSON has natively — this lesson covers the ones you will actually use.</p>'),
      img('docs/img/mongodb/data-types-hero', 'An isometric illustration of labeled colored blocks representing different data types — a string tag, a number cube, a calendar for dates, a checkbox for boolean', 1024, 768, 'MongoDB\'s BSON format supports more data types than plain JSON.'),
      table(['Type', 'Example', 'Notes'], [
        ['String', '"Rahul Verma"', 'UTF-8 text, MongoDB\'s most common type'],
        ['Number', '27, 3.14', 'MongoDB distinguishes Int32, Int64, and Double internally'],
        ['Boolean', 'true, false', ''],
        ['Date', 'ISODate("2026-08-19")', 'Stored as milliseconds since the Unix epoch'],
        ['ObjectId', 'ObjectId("651f2a...")', 'The default type for _id — see below'],
        ['Array', '["HTML", "CSS", "React"]', 'A field can hold a list of values, including other objects'],
        ['Embedded Document', '{ city: "Kolkata" }', 'A nested object as a field\'s value'],
        ['Null', 'null', 'Explicitly "no value," different from a missing field'],
      ]),
      h(2, 'Dates'),
      p('<p>Always create dates with <code>new Date()</code> rather than storing a date as a plain string — a real Date type sorts and compares correctly, and can be queried with range operators like <code>$gt</code>:</p>'),
      code('javascript', `db.orders.insertOne({
  product: "Notebook",
  orderedAt: new Date()
})`, true),
      h(2, 'ObjectId, In Detail'),
      p('<p>An <code>ObjectId</code> is 12 bytes, built from a timestamp, a random value, and an incrementing counter — which means ObjectIds generated later sort after earlier ones, and you can extract an approximate creation time directly from one:</p>'),
      code('javascript', `const id = ObjectId("651f2a9e1c4a2b0012a4f8d1")
id.getTimestamp()
// ISODate("2023-10-05T14:22:22.000Z")`, true),
      callout('tip', '<p>You rarely need to construct an <code>ObjectId</code> by hand — let MongoDB generate it on insert. Knowing it encodes a timestamp is mainly useful for understanding <i>why</i> ObjectIds are roughly sortable by creation order.</p>', 'ObjectId encodes a creation timestamp'),
    ],
  },
  bn: {
    title: 'MongoDB-তে Data Type',
    metaTitle: 'MongoDB-তে Data Type | Learn Computer Academy',
    metaDescription: 'MongoDB যে BSON data type সমর্থন করে: string, number, boolean, date, ObjectId, array, আর embedded document।',
    blocks: [
      p('<p>কারণ MongoDB সাধারণ JSON-এর বদলে BSON হিসেবে data সংরক্ষণ করে, এটা JSON-এ স্বাভাবিকভাবে থাকা তুলনায় একটা সমৃদ্ধ data type সেট সমর্থন করে — এই lesson যেগুলো আপনি আসলে ব্যবহার করবেন সেগুলো covers করে।</p>'),
      img('docs/img/mongodb/data-types-hero', 'ভিন্ন data type represent করা label করা রঙিন block-এর isometric illustration — একটা string tag, একটা number cube, date-এর জন্য একটা calendar, boolean-এর জন্য একটা checkbox', 1024, 768, 'MongoDB-র BSON format সাধারণ JSON-এর চেয়ে বেশি data type সমর্থন করে।'),
      table(['Type', 'উদাহরণ', 'নোট'], [
        ['String', '"Rahul Verma"', 'UTF-8 text, MongoDB-র সবচেয়ে সাধারণ type'],
        ['Number', '27, 3.14', 'MongoDB internally Int32, Int64, আর Double আলাদা করে'],
        ['Boolean', 'true, false', ''],
        ['Date', 'ISODate("2026-08-19")', 'Unix epoch থেকে millisecond হিসেবে সংরক্ষিত'],
        ['ObjectId', 'ObjectId("651f2a...")', '_id-এর জন্য default type — নিচে দেখুন'],
        ['Array', '["HTML", "CSS", "React"]', 'একটা field অন্য object সহ value-র একটা list ধরে রাখতে পারে'],
        ['Embedded Document', '{ city: "Kolkata" }', 'একটা field-এর value হিসেবে একটা nested object'],
        ['Null', 'null', 'Explicitly "কোনো value না," একটা missing field থেকে ভিন্ন'],
      ]),
      h(2, 'Date', 'dates'),
      p('<p>একটা date-কে plain string হিসেবে সংরক্ষণ করার বদলে সবসময় <code>new Date()</code> দিয়ে date তৈরি করুন — একটা real Date type সঠিকভাবে sort আর compare করে, আর <code>$gt</code>-এর মতো range operator দিয়ে query করা যায়:</p>'),
      code('javascript', `db.orders.insertOne({
  product: "Notebook",
  orderedAt: new Date()
})`, true),
      h(2, 'ObjectId, বিস্তারিত', 'objectid-in-detail'),
      p('<p>একটা <code>ObjectId</code> ১২ byte, একটা timestamp, একটা random value, আর একটা incrementing counter থেকে তৈরি — যার মানে পরে generate করা ObjectId আগেরগুলোর পরে sort হয়, আর আপনি সরাসরি একটা থেকে একটা আনুমানিক তৈরির সময় extract করতে পারেন:</p>'),
      code('javascript', `const id = ObjectId("651f2a9e1c4a2b0012a4f8d1")
id.getTimestamp()
// ISODate("2023-10-05T14:22:22.000Z")`, true),
      callout('tip', '<p>আপনার খুব কমই হাতে একটা <code>ObjectId</code> তৈরি করতে হয় — MongoDB-কে insert-এ এটা generate করতে দিন। এটা একটা timestamp encode করে জানা প্রধানত বোঝার জন্য useful <i>কেন</i> ObjectId মোটামুটি তৈরির order অনুযায়ী sortable।</p>', 'ObjectId একটা creation timestamp encode করে'),
    ],
  },
})

// 14 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'indexes', sortOrder: n++,
  en: {
    title: 'Indexes',
    metaTitle: 'Indexes | Learn Computer Academy',
    metaDescription: 'Why indexes make queries fast, creating single-field and compound indexes, and checking a query\'s performance with explain().',
    blocks: [
      p('<p>Without an index, MongoDB checks every single document in a collection to answer a query — a <b>collection scan</b>. On a small collection this is instant; on a large one it gets slow fast. An <b>index</b> is a separate, sorted data structure that lets MongoDB jump straight to matching documents instead.</p>'),
      img('docs/img/mongodb/indexes-hero', 'An isometric illustration of a book with a bookmark tab structure representing a database index, next to a stack of documents being searched', 1024, 768, 'An index lets MongoDB find matching documents without scanning every one.'),
      h(2, 'Creating a Single-Field Index'),
      code('javascript', 'db.users.createIndex({ email: 1 })', true),
      p('<p><code>1</code> means ascending order, <code>-1</code> descending — for a single-field index used for equality lookups, the direction rarely matters.</p>'),
      h(2, 'Compound Indexes'),
      p('<p>A <b>compound index</b> covers multiple fields, and speeds up queries that filter (or sort) on that combination:</p>'),
      code('javascript', 'db.users.createIndex({ role: 1, age: -1 })', true),
      p('<p>Field order in a compound index matters — this index efficiently serves queries filtering by <code>role</code> alone, or by <code>role</code> and <code>age</code> together, but not a query that filters by <code>age</code> alone.</p>'),
      h(2, 'Unique Indexes'),
      p('<p>Add <code>{ unique: true }</code> to enforce that no two documents can share a value for that field — commonly used on fields like <code>email</code>:</p>'),
      code('javascript', 'db.users.createIndex({ email: 1 }, { unique: true })', true),
      h(2, 'Checking Whether a Query Uses an Index'),
      p('<p><code>.explain()</code> shows exactly how MongoDB executed a query — look for <code>"stage": "IXSCAN"</code> (index scan, fast) versus <code>"stage": "COLLSCAN"</code> (collection scan, slow on large data):</p>'),
      code('javascript', 'db.users.find({ email: "ananya@example.com" }).explain()', true),
      callout('warning', '<p>Indexes speed up reads but slow down writes slightly, since MongoDB has to update every index whenever a document changes. Index the fields you actually query and sort by often — not every field.</p>', 'Indexes are a trade-off, not a free upgrade'),
    ],
  },
  bn: {
    title: 'Index',
    metaTitle: 'Index | Learn Computer Academy',
    metaDescription: 'কেন index query দ্রুত করে, single-field আর compound index তৈরি করা, আর explain() দিয়ে একটা query-র performance চেক করা।',
    blocks: [
      p('<p>একটা index ছাড়া, MongoDB একটা query-র উত্তর দিতে collection-এর প্রতিটা একক document চেক করে — একটা <b>collection scan</b>। একটা ছোট collection-এ এটা তাৎক্ষণিক; একটা বড়টাতে এটা দ্রুত ধীর হয়ে যায়। একটা <b>index</b> হলো একটা আলাদা, sorted data structure যা MongoDB-কে এর বদলে সরাসরি matching document-এ যেতে দেয়।</p>'),
      img('docs/img/mongodb/indexes-hero', 'একটা database index represent করা একটা bookmark tab গঠন সহ একটা বইয়ের isometric illustration, search হচ্ছে এমন document-এর একটা stack-এর পাশে', 1024, 768, 'একটা index MongoDB-কে প্রতিটা scan না করে matching document খুঁজে পেতে দেয়।'),
      h(2, 'একটা Single-Field Index তৈরি করা', 'creating-a-single-field-index'),
      code('javascript', 'db.users.createIndex({ email: 1 })', true),
      p('<p><code>1</code> মানে ascending order, <code>-1</code> descending — equality lookup-এর জন্য ব্যবহৃত একটা single-field index-এর জন্য, দিক খুব কমই গুরুত্বপূর্ণ।</p>'),
      h(2, 'Compound Index', 'compound-indexes'),
      p('<p>একটা <b>compound index</b> একাধিক field cover করে, আর সেই combination-এ filter (বা sort) করা query দ্রুত করে:</p>'),
      code('javascript', 'db.users.createIndex({ role: 1, age: -1 })', true),
      p('<p>একটা compound index-এ field order গুরুত্বপূর্ণ — এই index দক্ষতার সাথে শুধু <code>role</code> দিয়ে, বা <code>role</code> আর <code>age</code> একসাথে filter করা query serve করে, কিন্তু শুধু <code>age</code> দিয়ে filter করা একটা query না।</p>'),
      h(2, 'Unique Index', 'unique-indexes'),
      p('<p>বলবৎ করতে <code>{ unique: true }</code> যোগ করুন যে সেই field-এর জন্য কোনো দুটো document একই value share করতে পারবে না — সাধারণত <code>email</code>-এর মতো field-এ ব্যবহৃত:</p>'),
      code('javascript', 'db.users.createIndex({ email: 1 }, { unique: true })', true),
      h(2, 'একটা Query Index ব্যবহার করে কিনা চেক করা', 'checking-whether-a-query-uses-an-index'),
      p('<p><code>.explain()</code> ঠিক দেখায় MongoDB কীভাবে একটা query execute করেছে — <code>"stage": "COLLSCAN"</code> (collection scan, বড় data-তে ধীর) বনাম <code>"stage": "IXSCAN"</code> (index scan, দ্রুত) খুঁজুন:</p>'),
      code('javascript', 'db.users.find({ email: "ananya@example.com" }).explain()', true),
      callout('warning', '<p>Index read দ্রুত করে কিন্তু write সামান্য ধীর করে, কারণ যখনই একটা document পরিবর্তন হয় MongoDB-কে প্রতিটা index update করতে হয়। যে field আপনি আসলে query আর প্রায়ই sort করেন সেগুলো index করুন — প্রতিটা field না।</p>', 'Index একটা trade-off, একটা free upgrade না'),
    ],
  },
})

// 15 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'aggregation-pipeline-introduction', sortOrder: n++,
  en: {
    title: 'Aggregation Pipeline — Introduction',
    metaTitle: 'Aggregation Pipeline — Introduction | Learn Computer Academy',
    metaDescription: 'What the MongoDB aggregation pipeline is, and how $match, $group, and $project chain together to transform data.',
    blocks: [
      p('<p><code>find()</code> retrieves documents. The <b>aggregation pipeline</b> transforms them — filtering, grouping, reshaping, and computing new values, all in one operation made of chained <b>stages</b>, each one feeding its output into the next.</p>'),
      img('docs/img/mongodb/aggregation-pipeline-stages', 'A left-to-right flow diagram showing three connected stage boxes labeled $match, $group, and $project, with documents flowing through arrows between them, narrowing at each stage', 500, 115, 'Each aggregation stage takes the previous stage\'s output as its own input.'),
      h(2, 'The Pipeline Shape'),
      p('<p>Call <code>aggregate()</code> with an array of stage objects — each object\'s key is the stage operator, starting with <code>$</code>:</p>'),
      code('javascript', `db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $project: { customerId: "$_id", total: 1, _id: 0 } }
])`, true),
      h(2, '$match — Filter Documents'),
      p('<p><code>$match</code> works like a <code>find()</code> query, and is usually the first stage — filtering early means every following stage processes fewer documents:</p>'),
      code('javascript', '{ $match: { status: "completed" } }', false),
      h(2, '$group — Combine Documents'),
      p('<p><code>$group</code> collapses many documents into one per distinct value of <code>_id</code>, computing a value for each group with an accumulator like <code>$sum</code>, <code>$avg</code>, <code>$max</code>, or <code>$count</code>:</p>'),
      code('javascript', '{ $group: { _id: "$customerId", total: { $sum: "$amount" } } }', false),
      h(2, '$project — Reshape the Output'),
      p('<p><code>$project</code> works like a projection in <code>find()</code>, but can also compute new fields, not just include or exclude existing ones:</p>'),
      code('javascript', '{ $project: { customerId: "$_id", total: 1, _id: 0 } }', false),
      callout('note', '<p>These three stages alone — <code>$match</code>, <code>$group</code>, <code>$project</code> — already cover a large share of real reporting queries: "total spend per customer," "orders per day," "average rating per product."</p>', 'These three stages go a long way'),
    ],
  },
  bn: {
    title: 'Aggregation Pipeline — পরিচিতি',
    metaTitle: 'Aggregation Pipeline — পরিচিতি | Learn Computer Academy',
    metaDescription: 'MongoDB aggregation pipeline কী, আর data transform করতে $match, $group, আর $project কীভাবে একসাথে chain হয়।',
    blocks: [
      p('<p><code>find()</code> document retrieve করে। <b>Aggregation pipeline</b> সেগুলো transform করে — filter, group, reshape, আর নতুন value গণনা করে, chained <b>stage</b>-এর তৈরি একটা operation-এ, প্রতিটা এর output পরেরটাতে feed করে।</p>'),
      img('docs/img/mongodb/aggregation-pipeline-stages', 'একটা বাম-থেকে-ডান flow diagram $match, $group, আর $project label করা তিনটা connected stage box দেখাচ্ছে, তাদের মধ্যে arrow দিয়ে document প্রবাহিত হচ্ছে, প্রতিটা stage-এ সরু হচ্ছে', 500, 115, 'প্রতিটা aggregation stage আগের stage-এর output এর নিজের input হিসেবে নেয়।'),
      h(2, 'Pipeline-এর আকৃতি', 'the-pipeline-shape'),
      p('<p>Stage object-এর একটা array সহ <code>aggregate()</code> call করুন — প্রতিটা object-এর key হলো stage operator, <code>$</code> দিয়ে শুরু:</p>'),
      code('javascript', `db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $project: { customerId: "$_id", total: 1, _id: 0 } }
])`, true),
      h(2, '$match — Document Filter করা', 'match-filter-documents'),
      p('<p><code>$match</code> একটা <code>find()</code> query-র মতো কাজ করে, আর সাধারণত প্রথম stage — তাড়াতাড়ি filter করা মানে প্রতিটা পরবর্তী stage কম document process করে:</p>'),
      code('javascript', '{ $match: { status: "completed" } }', false),
      h(2, '$group — Document একত্রিত করা', 'group-combine-documents'),
      p('<p><code>$group</code> <code>_id</code>-এর প্রতিটা আলাদা value-র জন্য একটাতে অনেক document collapse করে, <code>$sum</code>, <code>$avg</code>, <code>$max</code>, বা <code>$count</code>-এর মতো একটা accumulator দিয়ে প্রতিটা group-এর জন্য একটা value গণনা করে:</p>'),
      code('javascript', '{ $group: { _id: "$customerId", total: { $sum: "$amount" } } }', false),
      h(2, '$project — Output Reshape করা', 'project-reshape-the-output'),
      p('<p><code>$project</code> <code>find()</code>-এ একটা projection-এর মতো কাজ করে, কিন্তু নতুন field-ও গণনা করতে পারে, শুধু বিদ্যমানগুলো অন্তর্ভুক্ত বা বাদ দেওয়া না:</p>'),
      code('javascript', '{ $project: { customerId: "$_id", total: 1, _id: 0 } }', false),
      callout('note', '<p>শুধু এই তিনটা stage — <code>$match</code>, <code>$group</code>, <code>$project</code> — ইতিমধ্যে real reporting query-র একটা বড় অংশ cover করে: "প্রতি customer-এর total খরচ," "প্রতিদিনের order," "প্রতি product-এর average rating।"</p>', 'এই তিনটা stage অনেক দূর নিয়ে যায়'),
    ],
  },
})

// 16 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'aggregation-common-stages', sortOrder: n++,
  en: {
    title: 'Aggregation — Common Stages',
    metaTitle: 'Aggregation — Common Stages | Learn Computer Academy',
    metaDescription: '$sort, $limit, $unwind, and $lookup — the aggregation stages that sort results, cap them, flatten arrays, and join across collections.',
    blocks: [
      p('<p>Beyond <code>$match</code>, <code>$group</code>, and <code>$project</code>, a handful of other stages cover most remaining real-world aggregation needs.</p>'),
      img('docs/img/mongodb/aggregation-stages-hero', 'An isometric illustration of documents from two separate collection stacks being merged together by a connecting bridge, representing a database join', 1024, 768, '$lookup joins documents from two different collections inside the aggregation pipeline.'),
      h(2, '$sort and $limit'),
      p('<p>Work exactly like their <code>find()</code> equivalents, as pipeline stages — commonly placed after <code>$group</code> to order and cap a computed result:</p>'),
      code('javascript', `db.orders.aggregate([
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 5 }
])
// Top 5 customers by total spend`, true),
      h(2, '$unwind — Flatten an Array'),
      p('<p><code>$unwind</code> takes a document with an array field and outputs one document per array element — necessary before you can <code>$group</code> by individual items inside that array:</p>'),
      code('javascript', `// A document with tags: ["sale", "featured"]
// becomes two documents, one per tag, after $unwind
db.products.aggregate([
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } }
])`, true),
      h(2, '$lookup — Join Another Collection'),
      p('<p><code>$lookup</code> is MongoDB\'s equivalent of a SQL JOIN — it pulls in matching documents from a different collection based on a shared field:</p>'),
      code('javascript', `db.posts.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "authorId",
      foreignField: "_id",
      as: "authorInfo"
    }
  }
])`, true),
      p('<p>The result adds an <code>authorInfo</code> array field to each post, containing the matching author document(s) — this is exactly the operation the referencing pattern from the schema-design lesson is built to support.</p>'),
      callout('tip', '<p>Stage order matters for correctness, not just style — <code>$match</code> before <code>$group</code> filters the input; <code>$match</code> after <code>$group</code> filters the computed results. Putting filters as early as possible in the pipeline is also the standard performance habit.</p>', 'Put $match as early as the logic allows'),
    ],
  },
  bn: {
    title: 'Aggregation — সাধারণ Stage',
    metaTitle: 'Aggregation — সাধারণ Stage | Learn Computer Academy',
    metaDescription: '$sort, $limit, $unwind, আর $lookup — সেই aggregation stage যা result sort করে, সীমাবদ্ধ করে, array flatten করে, আর collection জুড়ে join করে।',
    blocks: [
      p('<p><code>$match</code>, <code>$group</code>, আর <code>$project</code>-এর বাইরে, মুষ্টিমেয় অন্য stage বাকি বেশিরভাগ real-world aggregation প্রয়োজন cover করে।</p>'),
      img('docs/img/mongodb/aggregation-stages-hero', 'দুটো আলাদা collection stack থেকে document একটা connecting bridge দিয়ে একসাথে merge হচ্ছে এমন একটা isometric illustration, একটা database join represent করছে', 1024, 768, '$lookup aggregation pipeline-এর ভিতরে দুটো ভিন্ন collection থেকে document join করে।'),
      h(2, '$sort আর $limit', 'sort-and-limit'),
      p('<p>Pipeline stage হিসেবে, ঠিক তাদের <code>find()</code> সমতুল্যদের মতো কাজ করে — সাধারণত একটা গণনা করা result order আর সীমাবদ্ধ করতে <code>$group</code>-এর পরে রাখা হয়:</p>'),
      code('javascript', `db.orders.aggregate([
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 5 }
])
// Total খরচ অনুযায়ী top ৫ customer`, true),
      h(2, '$unwind — একটা Array Flatten করা', 'unwind-flatten-an-array'),
      p('<p><code>$unwind</code> একটা array field সহ একটা document নেয় আর array element প্রতি একটা document output করে — সেই array-এর ভিতরে individual item দিয়ে <code>$group</code> করার আগে দরকার:</p>'),
      code('javascript', `// tags: ["sale", "featured"] সহ একটা document
// $unwind-এর পরে দুটো document হয়ে যায়, প্রতি tag একটা
db.products.aggregate([
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } }
])`, true),
      h(2, '$lookup — অন্য একটা Collection Join করা', 'lookup-join-another-collection'),
      p('<p><code>$lookup</code> হলো একটা SQL JOIN-এর MongoDB সমতুল্য — এটা একটা shared field-এর ভিত্তিতে একটা ভিন্ন collection থেকে matching document টেনে আনে:</p>'),
      code('javascript', `db.posts.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "authorId",
      foreignField: "_id",
      as: "authorInfo"
    }
  }
])`, true),
      p('<p>Result প্রতিটা post-এ একটা <code>authorInfo</code> array field যোগ করে, matching author document(গুলো) ধারণ করে — এটাই ঠিক সেই operation যা schema-design lesson-এর referencing pattern সমর্থন করার জন্য তৈরি।</p>'),
      callout('tip', '<p>Stage order শুধু style না, correctness-এর জন্যও গুরুত্বপূর্ণ — <code>$group</code>-এর আগে <code>$match</code> input filter করে; <code>$group</code>-এর পরে <code>$match</code> গণনা করা result filter করে। যত তাড়াতাড়ি logic অনুমতি দেয় pipeline-এ filter রাখাও standard performance অভ্যাস।</p>', 'Logic যত তাড়াতাড়ি অনুমতি দেয় $match রাখুন'),
    ],
  },
})

// 17 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'schema-validation', sortOrder: n++,
  en: {
    title: 'Schema Validation',
    metaTitle: 'Schema Validation | Learn Computer Academy',
    metaDescription: 'Enforcing required fields and data types on a MongoDB collection with $jsonSchema, without giving up its flexible-schema advantages entirely.',
    blocks: [
      p('<p>MongoDB\'s flexible schema is a strength, but real applications usually still want <i>some</i> guarantees — a <code>users</code> collection where every document is required to have an <code>email</code>. <b>Schema validation</b> lets you enforce exactly the rules you choose, and no more.</p>'),
      img('docs/img/mongodb/validation-hero', 'An isometric illustration of a document passing through a checkmark-shaped gate, with a rejected document bouncing off a red X-shaped gate beside it', 1024, 768, 'Schema validation rejects documents that break rules you define.'),
      h(2, 'Creating a Collection with Validation'),
      code('javascript', `db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+$" },
        age: { bsonType: "int", minimum: 0 }
      }
    }
  }
})`, true),
      h(2, 'What Happens on a Violation'),
      p('<p>Trying to insert a document that breaks a required rule fails with a validation error instead of being saved:</p>'),
      code('javascript', `db.users.insertOne({ name: "Test User" })
// Error: Document failed validation — "email" is required`, false),
      h(2, 'Adding Validation to an Existing Collection'),
      p('<p><code>collMod</code> applies a validator to a collection that already exists:</p>'),
      code('javascript', `db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      required: ["email"]
    }
  }
})`, true),
      callout('note', '<p>By default, validation applies to new inserts and updates but does not retroactively check documents already in the collection — existing data that would fail the new rule stays exactly as it is unless it is updated or you set <code>validationLevel: "strict"</code>.</p>', 'Existing documents are not checked retroactively'),
    ],
  },
  bn: {
    title: 'Schema Validation',
    metaTitle: 'Schema Validation | Learn Computer Academy',
    metaDescription: '$jsonSchema দিয়ে একটা MongoDB collection-এ required field আর data type বলবৎ করা, এর flexible-schema সুবিধা সম্পূর্ণভাবে না ছেড়ে।',
    blocks: [
      p('<p>MongoDB-র flexible schema একটা শক্তি, কিন্তু real application সাধারণত এখনও <i>কিছু</i> guarantee চায় — একটা <code>users</code> collection যেখানে প্রতিটা document-এ একটা <code>email</code> থাকা প্রয়োজন। <b>Schema validation</b> আপনাকে ঠিক আপনার বেছে নেওয়া নিয়ম বলবৎ করতে দেয়, আর তার বেশি না।</p>'),
      img('docs/img/mongodb/validation-hero', 'একটা checkmark-আকৃতির gate দিয়ে যাওয়া একটা document-এর isometric illustration, পাশে একটা লাল X-আকৃতির gate থেকে bounce করা একটা প্রত্যাখ্যাত document সহ', 1024, 768, 'Schema validation আপনার define করা নিয়ম ভাঙা document প্রত্যাখ্যান করে।'),
      h(2, 'Validation সহ একটা Collection তৈরি করা', 'creating-a-collection-with-validation'),
      code('javascript', `db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+$" },
        age: { bsonType: "int", minimum: 0 }
      }
    }
  }
})`, true),
      h(2, 'একটা Violation-এ কী হয়', 'what-happens-on-a-violation'),
      p('<p>একটা required নিয়ম ভাঙা একটা document insert করার চেষ্টা সংরক্ষিত হওয়ার বদলে একটা validation error দিয়ে ব্যর্থ হয়:</p>'),
      code('javascript', `db.users.insertOne({ name: "Test User" })
// Error: Document failed validation — "email" প্রয়োজন`, false),
      h(2, 'বিদ্যমান Collection-এ Validation যোগ করা', 'adding-validation-to-an-existing-collection'),
      p('<p><code>collMod</code> ইতিমধ্যে বিদ্যমান একটা collection-এ একটা validator apply করে:</p>'),
      code('javascript', `db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      required: ["email"]
    }
  }
})`, true),
      callout('note', '<p>Default হিসেবে, validation নতুন insert আর update-এ apply হয় কিন্তু collection-এ ইতিমধ্যে থাকা document retroactively চেক করে না — বিদ্যমান data যা নতুন নিয়মে ব্যর্থ হবে ঠিক যেমন আছে তেমনই থাকে যতক্ষণ না এটা update হয় বা আপনি <code>validationLevel: "strict"</code> set করেন।</p>', 'বিদ্যমান document retroactively চেক হয় না'),
    ],
  },
})

// 18 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'mongodb-with-nodejs', sortOrder: n++,
  en: {
    title: 'MongoDB with Node.js',
    metaTitle: 'MongoDB with Node.js | Learn Computer Academy',
    metaDescription: 'Connecting a Node.js application to MongoDB using the official driver, and running your first query from application code.',
    blocks: [
      p('<p>Everything so far ran directly in <code>mongosh</code>. Real applications talk to MongoDB from application code instead — this lesson connects a <a href="/nodejs/introduction">Node.js</a> app to MongoDB using the official <code>mongodb</code> driver.</p>'),
      img('docs/img/mongodb/nodejs-hero', 'An isometric illustration of the Node.js hexagon logo connected by a cable to a green MongoDB database cylinder', 1024, 768, 'The official mongodb driver connects a Node.js application to a database.'),
      h(2, 'Installing the Driver'),
      code('bash', 'npm install mongodb', true),
      h(2, 'Connecting'),
      code('javascript', `import { MongoClient } from "mongodb"

const uri = "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/"
const client = new MongoClient(uri)

async function main() {
  await client.connect()
  console.log("Connected to MongoDB")
}

main()`, true),
      h(2, 'Running a Query'),
      p('<p>Get a reference to a database and collection, then use the same method names you already know from <code>mongosh</code> — <code>find()</code>, <code>insertOne()</code>, <code>updateOne()</code>, and the rest all exist on the driver, as async functions:</p>'),
      code('javascript', `const db = client.db("learningMongo")
const users = db.collection("users")

const allUsers = await users.find().toArray()
console.log(allUsers)`, true),
      h(2, 'Closing the Connection'),
      p('<p>In a short script, close the connection when done. In a long-running web server, you typically connect once at startup and keep the connection open for the app\'s lifetime instead:</p>'),
      code('javascript', 'await client.close()', true),
      callout('warning', '<p>Never hardcode a connection string containing a real username and password directly in a committed file. Store it in an environment variable instead — see this site\'s <a href="/nodejs/process-and-env">process & Environment Variables</a> lesson.</p>', 'Never commit real credentials'),
    ],
  },
  bn: {
    title: 'Node.js-এর সাথে MongoDB',
    metaTitle: 'Node.js-এর সাথে MongoDB | Learn Computer Academy',
    metaDescription: 'Official driver ব্যবহার করে একটা Node.js application MongoDB-র সাথে connect করা, আর application code থেকে আপনার প্রথম query চালানো।',
    blocks: [
      p('<p>এখন পর্যন্ত সবকিছু সরাসরি <code>mongosh</code>-এ চলেছে। Real application-গুলো এর বদলে application code থেকে MongoDB-র সাথে কথা বলে — এই lesson official <code>mongodb</code> driver ব্যবহার করে একটা <a href="/nodejs/introduction">Node.js</a> app MongoDB-র সাথে connect করে।</p>'),
      img('docs/img/mongodb/nodejs-hero', 'একটা সবুজ MongoDB database cylinder-এর সাথে একটা cable দিয়ে connected Node.js hexagon logo-র isometric illustration', 1024, 768, 'Official mongodb driver একটা Node.js application-কে একটা database-এর সাথে connect করে।'),
      h(2, 'Driver Install করা', 'installing-the-driver'),
      code('bash', 'npm install mongodb', true),
      h(2, 'Connect করা', 'connecting'),
      code('javascript', `import { MongoClient } from "mongodb"

const uri = "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/"
const client = new MongoClient(uri)

async function main() {
  await client.connect()
  console.log("Connected to MongoDB")
}

main()`, true),
      h(2, 'একটা Query চালানো', 'running-a-query'),
      p('<p>একটা database আর collection-এর একটা reference নিন, তারপর আপনি ইতিমধ্যে <code>mongosh</code> থেকে জানা একই method নাম ব্যবহার করুন — <code>find()</code>, <code>insertOne()</code>, <code>updateOne()</code>, আর বাকি সবই driver-এ async function হিসেবে আছে:</p>'),
      code('javascript', `const db = client.db("learningMongo")
const users = db.collection("users")

const allUsers = await users.find().toArray()
console.log(allUsers)`, true),
      h(2, 'Connection বন্ধ করা', 'closing-the-connection'),
      p('<p>একটা ছোট script-এ, শেষ হলে connection বন্ধ করুন। একটা long-running web server-এ, আপনি সাধারণত startup-এ একবার connect করেন আর এর বদলে app-এর lifetime-এর জন্য connection খোলা রাখেন:</p>'),
      code('javascript', 'await client.close()', true),
      callout('warning', '<p>একটা real username আর password সহ একটা connection string সরাসরি একটা committed file-এ কখনো hardcode করবেন না। এর বদলে একটা environment variable-এ এটা সংরক্ষণ করুন — এই সাইটের <a href="/nodejs/process-and-env">process & Environment Variables</a> lesson দেখুন।</p>', 'কখনো real credential commit করবেন না'),
    ],
  },
})

// 19 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'mongoose-schemas-and-models', sortOrder: n++,
  en: {
    title: 'Mongoose — Schemas & Models',
    metaTitle: 'Mongoose — Schemas & Models | Learn Computer Academy',
    metaDescription: 'Using Mongoose, the most popular MongoDB library for Node.js, to define schemas and models and perform CRUD with a cleaner, structured API.',
    blocks: [
      p('<p><b>Mongoose</b> is a library built on top of the official driver that adds schemas, models, and validation to MongoDB from Node.js — it is the most widely used way teams actually work with MongoDB in real applications.</p>'),
      img('docs/img/mongodb/mongoose-hero', 'An isometric illustration of a blueprint-style schema diagram being used as a mold to stamp out identical document shapes', 1024, 768, 'A Mongoose schema defines the shape every document in a model should follow.'),
      h(2, 'Installing and Connecting'),
      code('bash', 'npm install mongoose', true),
      code('javascript', `import mongoose from "mongoose"

await mongoose.connect("mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/learningMongo")`, true),
      h(2, 'Defining a Schema'),
      p('<p>A <b>schema</b> describes the shape of a document — its fields, their types, and rules like <code>required</code> or a default value:</p>'),
      code('javascript', `import { Schema } from "mongoose"

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, default: 18 },
  isActive: { type: Boolean, default: true }
})`, true),
      h(2, 'Creating a Model'),
      p('<p>A <b>model</b> is a class built from a schema, giving you a real JavaScript interface for a collection — Mongoose automatically pluralizes and lowercases the name for the actual MongoDB collection (<code>"User"</code> becomes the <code>users</code> collection):</p>'),
      code('javascript', 'const User = mongoose.model("User", userSchema)', true),
      h(2, 'CRUD with a Model'),
      code('javascript', `// Create
const newUser = await User.create({ name: "Rahul Verma", email: "rahul@example.com" })

// Read
const users = await User.find({ isActive: true })

// Update
await User.updateOne({ name: "Rahul Verma" }, { $set: { age: 25 } })

// Delete
await User.deleteOne({ name: "Rahul Verma" })`, true),
      callout('tip', '<p>Mongoose methods largely mirror the raw driver\'s CRUD method names, so everything from earlier lessons transfers directly — the real value Mongoose adds is the schema, validation, and default values sitting in front of every write.</p>', 'CRUD method names carry over from the raw driver'),
    ],
  },
  bn: {
    title: 'Mongoose — Schema আর Model',
    metaTitle: 'Mongoose — Schema আর Model | Learn Computer Academy',
    metaDescription: 'Schema আর model define করতে আর একটা পরিষ্কার, structured API দিয়ে CRUD করতে Mongoose, Node.js-এর জন্য সবচেয়ে জনপ্রিয় MongoDB library, ব্যবহার করা।',
    blocks: [
      p('<p><b>Mongoose</b> হলো official driver-এর ওপর তৈরি একটা library যা Node.js থেকে MongoDB-তে schema, model, আর validation যোগ করে — team real application-এ আসলে MongoDB-র সাথে কাজ করার সবচেয়ে ব্যাপকভাবে ব্যবহৃত উপায় এটা।</p>'),
      img('docs/img/mongodb/mongoose-hero', 'অভিন্ন document আকৃতি stamp করার জন্য একটা mold হিসেবে ব্যবহৃত একটা blueprint-স্টাইলের schema diagram-এর isometric illustration', 1024, 768, 'একটা Mongoose schema একটা model-এর প্রতিটা document কোন আকৃতি অনুসরণ করা উচিত তা define করে।'),
      h(2, 'Install করা আর Connect করা', 'installing-and-connecting'),
      code('bash', 'npm install mongoose', true),
      code('javascript', `import mongoose from "mongoose"

await mongoose.connect("mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/learningMongo")`, true),
      h(2, 'একটা Schema Define করা', 'defining-a-schema'),
      p('<p>একটা <b>schema</b> একটা document-এর আকৃতি বর্ণনা করে — এর field, তাদের type, আর <code>required</code> বা একটা default value-র মতো নিয়ম:</p>'),
      code('javascript', `import { Schema } from "mongoose"

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, default: 18 },
  isActive: { type: Boolean, default: true }
})`, true),
      h(2, 'একটা Model তৈরি করা', 'creating-a-model'),
      p('<p>একটা <b>model</b> হলো একটা schema থেকে তৈরি একটা class, একটা collection-এর জন্য আপনাকে একটা real JavaScript interface দেয় — Mongoose স্বয়ংক্রিয়ভাবে আসল MongoDB collection-এর জন্য নাম plural আর lowercase করে (<code>"User"</code> <code>users</code> collection হয়ে যায়):</p>'),
      code('javascript', 'const User = mongoose.model("User", userSchema)', true),
      h(2, 'একটা Model দিয়ে CRUD', 'crud-with-a-model'),
      code('javascript', `// তৈরি করুন
const newUser = await User.create({ name: "Rahul Verma", email: "rahul@example.com" })

// পড়ুন
const users = await User.find({ isActive: true })

// আপডেট করুন
await User.updateOne({ name: "Rahul Verma" }, { $set: { age: 25 } })

// মুছুন
await User.deleteOne({ name: "Rahul Verma" })`, true),
      callout('tip', '<p>Mongoose method মূলত raw driver-এর CRUD method নাম প্রতিফলিত করে, তাই আগের lesson-এর সবকিছু সরাসরি transfer হয় — Mongoose যে real value যোগ করে তা হলো প্রতিটা write-এর সামনে বসা schema, validation, আর default value।</p>', 'CRUD method নাম raw driver থেকে বহন হয়'),
    ],
  },
})

// 20 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'mongoose-validation-and-relationships', sortOrder: n++,
  en: {
    title: 'Mongoose Validation & Relationships',
    metaTitle: 'Mongoose Validation & Relationships | Learn Computer Academy',
    metaDescription: 'Custom validation rules in a Mongoose schema, and connecting related models with ref and populate().',
    blocks: [
      p('<p>Beyond the basic field rules from the last lesson, Mongoose supports richer validation and a clean way to work with referenced documents.</p>'),
      img('docs/img/mongodb/populate-hero', 'An isometric illustration of two connected document icons where clicking one expands to reveal the full contents of the other, representing populate() resolving a reference', 1024, 768, 'populate() replaces a reference ID with the full document it points to.'),
      h(2, 'Built-In Validators'),
      code('javascript', `const productSchema = new Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 100 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ["electronics", "books", "clothing"] }
})`, true),
      h(2, 'Custom Validators'),
      p('<p>A <code>validate</code> function runs your own logic and returns <code>true</code> or <code>false</code>:</p>'),
      code('javascript', `const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^.+@.+\\..+$/.test(value),
      message: "Enter a valid email address"
    }
  }
})`, true),
      h(2, 'Referencing Another Model with ref'),
      p('<p>To reference another model — the "referencing" pattern from the schema-design lesson — set a field\'s type to <code>Schema.Types.ObjectId</code> and point <code>ref</code> at the target model\'s name:</p>'),
      code('javascript', `const postSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" }
})`, true),
      h(2, 'populate() — Resolving the Reference'),
      p('<p>Without <code>populate()</code>, a query returns just the raw <code>ObjectId</code> in the <code>author</code> field. Calling <code>.populate("author")</code> replaces it with the full referenced document — the same result <code>$lookup</code> produces in the aggregation pipeline, with a simpler API:</p>'),
      code('javascript', `const post = await Post.findOne({ title: "Getting Started" }).populate("author")
console.log(post.author.name)
// "Rahul Verma" — the full User document is now attached`, true),
      callout('note', '<p><code>populate()</code> runs as a separate query behind the scenes, joined in application code rather than inside the database — for simple cases this is fine and much easier to read; for complex reporting queries across large collections, the aggregation pipeline\'s <code>$lookup</code> is usually the faster choice.</p>', 'populate() vs $lookup — different trade-offs'),
    ],
  },
  bn: {
    title: 'Mongoose Validation আর Relationship',
    metaTitle: 'Mongoose Validation আর Relationship | Learn Computer Academy',
    metaDescription: 'একটা Mongoose schema-তে custom validation নিয়ম, আর ref আর populate() দিয়ে related model connect করা।',
    blocks: [
      p('<p>শেষ lesson-এর মৌলিক field নিয়মের বাইরে, Mongoose সমৃদ্ধ validation আর referenced document নিয়ে কাজ করার একটা পরিষ্কার উপায় সমর্থন করে।</p>'),
      img('docs/img/mongodb/populate-hero', 'দুটো connected document icon-এর isometric illustration যেখানে একটাতে ক্লিক করলে অন্যটার সম্পূর্ণ content প্রকাশ করতে expand হয়, populate() একটা reference resolve করছে তা represent করছে', 1024, 768, 'populate() একটা reference ID-কে এটা যে সম্পূর্ণ document নির্দেশ করে তা দিয়ে প্রতিস্থাপন করে।'),
      h(2, 'Built-In Validator', 'built-in-validators'),
      code('javascript', `const productSchema = new Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 100 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ["electronics", "books", "clothing"] }
})`, true),
      h(2, 'Custom Validator', 'custom-validators'),
      p('<p>একটা <code>validate</code> function আপনার নিজের logic চালায় আর <code>true</code> বা <code>false</code> return করে:</p>'),
      code('javascript', `const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^.+@.+\\..+$/.test(value),
      message: "একটা বৈধ email address লিখুন"
    }
  }
})`, true),
      h(2, 'ref দিয়ে অন্য একটা Model Reference করা', 'referencing-another-model-with-ref'),
      p('<p>অন্য একটা model reference করতে — schema-design lesson-এর "referencing" pattern — একটা field-এর type <code>Schema.Types.ObjectId</code>-এ set করুন আর <code>ref</code>-কে target model-এর নামের দিকে point করুন:</p>'),
      code('javascript', `const postSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" }
})`, true),
      h(2, 'populate() — Reference Resolve করা', 'populate-resolving-the-reference'),
      p('<p><code>populate()</code> ছাড়া, একটা query <code>author</code> field-এ শুধু raw <code>ObjectId</code> return করে। <code>.populate("author")</code> call করা এটাকে সম্পূর্ণ referenced document দিয়ে প্রতিস্থাপন করে — একটা সরল API সহ aggregation pipeline-এ <code>$lookup</code> যে একই result তৈরি করে:</p>'),
      code('javascript', `const post = await Post.findOne({ title: "Getting Started" }).populate("author")
console.log(post.author.name)
// "Rahul Verma" — সম্পূর্ণ User document এখন attached`, true),
      callout('note', '<p><code>populate()</code> পর্দার আড়ালে একটা আলাদা query হিসেবে চলে, database-এর ভিতরে না বরং application code-এ join করা — সরল ক্ষেত্রে এটা ঠিক আছে আর পড়তে অনেক সহজ; বড় collection জুড়ে জটিল reporting query-র জন্য, aggregation pipeline-এর <code>$lookup</code> সাধারণত দ্রুত পছন্দ।</p>', 'populate() বনাম $lookup — ভিন্ন trade-off'),
    ],
  },
})

// 21 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'backup-and-security-basics', sortOrder: n++,
  en: {
    title: 'Backup & Security Basics',
    metaTitle: 'Backup & Security Basics | Learn Computer Academy',
    metaDescription: 'Backing up and restoring a MongoDB database with mongodump and mongorestore, and the basics of authentication and role-based access.',
    blocks: [
      p('<p>Two practical concerns before running MongoDB with real data: how you get your data back if something goes wrong, and who is allowed to touch it in the first place.</p>'),
      img('docs/img/mongodb/security-hero', 'An isometric illustration of a green database cylinder protected by a shield icon, with a small backup disk floating beside it', 1024, 768, 'Authentication, roles, and backups protect a database from accidental or unauthorized changes.'),
      h(2, 'Backing Up with mongodump'),
      p('<p><code>mongodump</code> exports an entire database (or a single collection) to a set of BSON files on disk — run from a regular terminal, not inside <code>mongosh</code>:</p>'),
      code('bash', 'mongodump --uri="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/learningMongo" --out=./backup', true),
      h(2, 'Restoring with mongorestore'),
      code('bash', 'mongorestore --uri="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/" ./backup', true),
      p('<p>MongoDB Atlas also offers automated, scheduled backups on paid tiers — for a learning project, running <code>mongodump</code> manually before any risky change is enough.</p>'),
      h(2, 'Authentication'),
      p('<p>Every serious MongoDB deployment requires a username and password to connect — the connection string used throughout this course already includes both. Never leave a production database reachable with no authentication at all.</p>'),
      h(2, 'Role-Based Access'),
      p('<p>Atlas (and self-managed MongoDB) supports assigning specific <b>roles</b> to each database user, rather than giving every user full access:</p>'),
      table(['Role', 'Can do'], [
        ['read', 'Read data only, in one database'],
        ['readWrite', 'Read and write data, in one database'],
        ['dbAdmin', 'Manage indexes and schema, no data access'],
        ['atlasAdmin / root', 'Full administrative control — reserve for a small number of trusted accounts'],
      ]),
      callout('warning', '<p>An application\'s connection string should use a user with only the roles that application actually needs — usually <code>readWrite</code> on its own database, never a full admin account. This limits the damage if that connection string is ever leaked.</p>', 'Give application users the minimum role they need'),
    ],
  },
  bn: {
    title: 'Backup আর Security Basics',
    metaTitle: 'Backup আর Security Basics | Learn Computer Academy',
    metaDescription: 'mongodump আর mongorestore দিয়ে একটা MongoDB database backup আর restore করা, আর authentication আর role-based access-এর মৌলিক বিষয়।',
    blocks: [
      p('<p>Real data দিয়ে MongoDB চালানোর আগে দুটো ব্যবহারিক উদ্বেগ: কিছু ভুল হলে আপনি কীভাবে আপনার data ফেরত পান, আর প্রথম স্থানে কাকে এটা স্পর্শ করার অনুমতি আছে।</p>'),
      img('docs/img/mongodb/security-hero', 'একটা shield icon দ্বারা সুরক্ষিত একটা সবুজ database cylinder-এর isometric illustration, পাশে একটা ছোট backup disk ভাসছে', 1024, 768, 'Authentication, role, আর backup একটা database-কে দুর্ঘটনাজনিত বা অননুমোদিত পরিবর্তন থেকে রক্ষা করে।'),
      h(2, 'mongodump দিয়ে Backup করা', 'backing-up-with-mongodump'),
      p('<p><code>mongodump</code> একটা সম্পূর্ণ database (বা একটা একক collection) disk-এ BSON file-এর একটা সেটে export করে — একটা সাধারণ terminal থেকে চালানো হয়, <code>mongosh</code>-এর ভিতরে না:</p>'),
      code('bash', 'mongodump --uri="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/learningMongo" --out=./backup', true),
      h(2, 'mongorestore দিয়ে Restore করা', 'restoring-with-mongorestore'),
      code('bash', 'mongorestore --uri="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/" ./backup', true),
      p('<p>MongoDB Atlas paid tier-এও automated, scheduled backup দেয় — একটা শেখার প্রজেক্টের জন্য, যেকোনো ঝুঁকিপূর্ণ পরিবর্তনের আগে ম্যানুয়ালি <code>mongodump</code> চালানো যথেষ্ট।</p>'),
      h(2, 'Authentication', 'authentication'),
      p('<p>প্রতিটা গুরুতর MongoDB deployment-এ connect করতে একটা username আর password প্রয়োজন — এই কোর্স জুড়ে ব্যবহৃত connection string-এ ইতিমধ্যে দুটোই অন্তর্ভুক্ত। কোনো authentication ছাড়াই একটা production database কখনো পৌঁছানোযোগ্য রাখবেন না।</p>'),
      h(2, 'Role-Based Access', 'role-based-access'),
      p('<p>প্রতিটা user-কে পূর্ণ access দেওয়ার বদলে, Atlas (আর self-managed MongoDB) প্রতিটা database user-কে নির্দিষ্ট <b>role</b> assign করা সমর্থন করে:</p>'),
      table(['Role', 'কী করতে পারে'], [
        ['read', 'শুধু data পড়ুন, একটা database-এ'],
        ['readWrite', 'Data পড়ুন আর লিখুন, একটা database-এ'],
        ['dbAdmin', 'Index আর schema পরিচালনা করুন, কোনো data access না'],
        ['atlasAdmin / root', 'পূর্ণ administrative নিয়ন্ত্রণ — বিশ্বস্ত account-এর একটা ছোট সংখ্যার জন্য সংরক্ষিত'],
      ]),
      callout('warning', '<p>একটা application-এর connection string শুধু সেই role সহ একটা user ব্যবহার করা উচিত যা application আসলে দরকার — সাধারণত নিজের database-এ শুধু <code>readWrite</code>, কখনো একটা পূর্ণ admin account না। এই connection string যদি কখনো leak হয় তাহলে এটা ক্ষতি সীমাবদ্ধ করে।</p>', 'Application user-কে ন্যূনতম প্রয়োজনীয় role দিন'),
    ],
  },
})

// 22 ────────────────────────────────────────────────────────────────────
lessons.push({
  slug: 'where-this-leaves-you', sortOrder: n++,
  en: {
    title: 'Where This Leaves You',
    metaTitle: 'Where This Leaves You | Learn Computer Academy',
    metaDescription: 'What this MongoDB course covered, what real projects add on top of it, and where to go next.',
    blocks: [
      p('<p>You now have the full core toolkit for working with MongoDB: documents and collections, every CRUD operation, schema design decisions, indexes, the aggregation pipeline, and connecting a real application to it with both the raw driver and Mongoose.</p>'),
      img('docs/img/mongodb/wrap-up-hero', 'An isometric illustration of a green document database icon standing next to a signpost pointing toward Node.js, React, and API icons, representing next steps', 1024, 768, 'MongoDB is one piece of a larger backend — here is what usually connects to it next.'),
      h(2, 'What Real Projects Add on Top'),
      table(['Topic', 'Why it matters beyond this course'], [
        ['Transactions', 'Multi-document ACID transactions, for operations that must all succeed or all fail together'],
        ['Replica sets & sharding', 'How MongoDB scales and stays available in production, not just a single server'],
        ['Change streams', 'Reacting in real time when data changes, without polling'],
        ['GridFS', 'Storing files larger than the 16MB single-document limit'],
      ]),
      h(2, 'Where to Go Next on This Site'),
      p('<p>If you have not already, this is a natural point to work through the <a href="/nodejs/rest-api">Building a REST API</a> lesson in the Node.js course — combining what you now know about MongoDB with Express routing is exactly how most real backends are built. If you started this course to pair with the SQL course, revisit <a href="/sql/joins">SQL Joins</a> side by side with this course\'s referencing lesson — the same relational thinking, expressed two different ways.</p>'),
      callout('tip', '<p>The best way to make any of this stick is a small real project — a to-do list API, a simple blog backend, a notes app — built with Node.js, Express, and MongoDB together, touching insert, find, update, delete, at least one index, and one aggregation query.</p>', 'Build something small with all of it'),
    ],
  },
  bn: {
    title: 'এটা আপনাকে কোথায় রেখে যায়',
    metaTitle: 'এটা আপনাকে কোথায় রেখে যায় | Learn Computer Academy',
    metaDescription: 'এই MongoDB কোর্স কী covered করেছে, real প্রজেক্ট এর ওপর কী যোগ করে, আর পরে কোথায় যেতে হবে।',
    blocks: [
      p('<p>আপনার এখন MongoDB নিয়ে কাজ করার সম্পূর্ণ core toolkit আছে: document আর collection, প্রতিটা CRUD operation, schema design সিদ্ধান্ত, index, aggregation pipeline, আর raw driver আর Mongoose উভয় দিয়ে এর সাথে একটা real application connect করা।</p>'),
      img('docs/img/mongodb/wrap-up-hero', 'পরের ধাপ represent করে Node.js, React, আর API icon-এর দিকে নির্দেশ করা একটা signpost-এর পাশে দাঁড়ানো একটা সবুজ document database icon-এর isometric illustration', 1024, 768, 'MongoDB একটা বড় backend-এর একটা অংশ — এখানে সাধারণত এর পরে কী connect হয়।'),
      h(2, 'Real প্রজেক্ট এর ওপর কী যোগ করে', 'what-real-projects-add-on-top'),
      table(['Topic', 'কেন এটা এই কোর্সের বাইরেও গুরুত্বপূর্ণ'], [
        ['Transaction', 'Multi-document ACID transaction, এমন operation-এর জন্য যা সবগুলো একসাথে সফল বা ব্যর্থ হতে হবে'],
        ['Replica set আর sharding', 'MongoDB কীভাবে production-এ scale করে আর available থাকে, শুধু একটা single server না'],
        ['Change stream', 'Polling ছাড়াই real time-এ data পরিবর্তন হলে react করা'],
        ['GridFS', '১৬MB single-document সীমার চেয়ে বড় file সংরক্ষণ করা'],
      ]),
      h(2, 'এই সাইটে পরে কোথায় যাবেন', 'where-to-go-next-on-this-site'),
      p('<p>আপনি যদি ইতিমধ্যে না করে থাকেন, Node.js কোর্সের <a href="/nodejs/rest-api">Building a REST API</a> lesson-এর মধ্য দিয়ে কাজ করার এটা একটা স্বাভাবিক জায়গা — MongoDB সম্পর্কে আপনার এখন যা জানা আছে তা Express routing-এর সাথে combine করা ঠিক কীভাবে বেশিরভাগ real backend তৈরি হয়। আপনি যদি SQL কোর্সের সাথে জোড়া লাগাতে এই কোর্স শুরু করে থাকেন, এই কোর্সের referencing lesson-এর সাথে পাশাপাশি <a href="/sql/joins">SQL Joins</a> আবার দেখুন — একই relational চিন্তা, দুটো ভিন্ন উপায়ে প্রকাশিত।</p>'),
      callout('tip', '<p>এর কোনোটা মনে রাখার সবচেয়ে ভালো উপায় হলো একটা ছোট real প্রজেক্ট — একটা to-do list API, একটা সরল blog backend, একটা notes app — Node.js, Express, আর MongoDB একসাথে দিয়ে তৈরি, insert, find, update, delete, অন্তত একটা index, আর একটা aggregation query স্পর্শ করে।</p>', 'এর সবকিছু দিয়ে ছোট কিছু তৈরি করুন'),
    ],
  },
})

// ── Write ─────────────────────────────────────────────────────────────

async function main() {
  const { data: cat, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'mongodb').single()
  if (catErr || !cat) { console.error('✗ category "mongodb" not found — run scripts/create-mongodb-category.mjs first'); process.exit(1) }

  for (const lesson of lessons) {
    const path = `mongodb/${lesson.slug}`
    const enBlocks = lesson.en.blocks
    const bnBlocks = lesson.bn.blocks

    if (DRY_RUN) {
      console.log(`  [en+bn] ${path} — ${lesson.en.title} (${enBlocks.length} blocks, sort_order ${lesson.sortOrder})`)
      continue
    }

    const { data: existing } = await supabase.from('docs').select('id').eq('path', path).maybeSingle()
    let docId
    const enRow = {
      category_id: cat.id,
      slug: lesson.slug,
      path,
      title: lesson.en.title,
      meta_title: lesson.en.metaTitle,
      meta_description: lesson.en.metaDescription,
      blocks: enBlocks,
      toc: toc(enBlocks),
      status: 'published',
      sort_order: lesson.sortOrder,
      published_at: new Date().toISOString(),
    }
    if (existing) {
      docId = existing.id
      const { error } = await supabase.from('docs').update(enRow).eq('id', docId)
      if (error) { console.error(`✗ ${path} (en update):`, error.message); continue }
    } else {
      const { data: inserted, error } = await supabase.from('docs').insert(enRow).select('id').single()
      if (error) { console.error(`✗ ${path} (en insert):`, error.message); continue }
      docId = inserted.id
    }

    const bnRow = {
      doc_id: docId,
      locale: 'bn',
      title: lesson.bn.title,
      meta_title: lesson.bn.metaTitle,
      meta_description: lesson.bn.metaDescription,
      blocks: bnBlocks,
      toc: toc(bnBlocks),
    }
    const { data: existingBn } = await supabase.from('doc_translations').select('doc_id').eq('doc_id', docId).eq('locale', 'bn').maybeSingle()
    if (existingBn) {
      const { error } = await supabase.from('doc_translations').update(bnRow).eq('doc_id', docId).eq('locale', 'bn')
      if (error) { console.error(`✗ ${path} (bn update):`, error.message); continue }
    } else {
      const { error } = await supabase.from('doc_translations').insert(bnRow)
      if (error) { console.error(`✗ ${path} (bn insert):`, error.message); continue }
    }
    console.log(`  ✓ ${path} — ${lesson.en.title}`)
  }
  console.log(DRY_RUN ? `\n[dry-run] ${lessons.length} lessons would be written. No writes made.` : `\n✅ Done. ${lessons.length} lessons processed.`)
}

main().catch(err => { console.error(err); process.exit(1) })
