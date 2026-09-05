#!/usr/bin/env node
// Extends the existing "Node.js" category (26 lessons) with 8 more lessons
// covering real gaps found against a roadmap.sh "Node.js" roadmap PDF the
// user shared 2026-09-03 — asked "are all the topics in this pdf regarding
// node covered". Checked actual content, not keyword hits — e.g. many
// "ejs" hits turned out to be false positives matching "nodejs" inside
// Cloudinary image publicIds, not the EJS template engine; the REST API
// lesson's one "authentication" mention was a forward-pointing aside
// ("...authentication so not just anyone can delete a product..."), never
// actually taught.
//
// 8 gaps found: authentication (JWT + password hashing), testing (taught
// with Node's own built-in node:test rather than picking Jest vs Vitest),
// logging, concurrency beyond the event loop (child_process/
// worker_threads/cluster), making HTTP requests (taught with Node 18+'s
// built-in global fetch rather than axios/node-fetch), process.nextTick
// and setImmediate, template engines (EJS as one concrete example),
// garbage collection & memory leaks. ORMs (Mongoose/Prisma/Sequelize/
// TypeORM) judged library-choice ecosystem territory matching
// connecting-to-a-database's existing driver-level approach; pm2 is
// already taught in the Hosting & Deployment course's Node.js deployment
// lesson; CLI-interactivity packages (inquirer/chalk/figlet/commander)
// judged ecosystem-choice, same boundary as UI libraries in the React/CSS
// PDF checks earlier today.
//
// User picked "build all 8" over AskUserQuestion.
//
// Inserted before nodejs/where-this-leaves-you (its sort_order bumped to
// the new end) so the closing lesson stays last, same pattern as the
// react gap batch.
//
// Style: matches this category's own established house style (see
// nodejs/event-loop) — moderate prose, code examples, callouts. Bengali
// matches this category's script-transliteration convention, verified
// against nodejs/event-loop bn.
//
// sort_order: new lessons 26-33; where-this-leaves-you bumped from 26 to 34.
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-nodejs-gap-content.mjs [--dry-run]

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
let n = 26

// ═══ 1. AUTHENTICATION ═══════════════════════════════════════════════════

lessons.push({
  slug: 'authentication', sortOrder: n++,
  en: {
    title: 'Authentication — Passwords and JWTs',
    metaTitle: 'Node.js Authentication with JWT | Learn Computer Academy',
    metaDescription: 'Hashing passwords safely with bcrypt, and issuing and verifying a JSON Web Token so an Express route can tell who\'s making a request.',
    blocks: [
      p('<p>The REST API lesson mentioned that not just anyone should be able to delete a product — this lesson is how that\'s actually enforced: hashing passwords safely, and issuing a token that proves who\'s making a request on every request afterward.</p>'),
      h(2, 'Never Store a Plain Password'),
      p('<p><code>bcrypt</code> hashes a password with a random salt baked in — the same password hashed twice produces two different results, which is exactly what stops a stolen password database from being searchable with a precomputed table of common passwords.</p>'),
      code('js', 'import bcrypt from \'bcrypt\'\n\n// When a user signs up\nconst passwordHash = await bcrypt.hash(req.body.password, 10)\n// Store passwordHash in the database — never the plain password\n\n// When a user logs in\nconst isCorrect = await bcrypt.compare(req.body.password, user.passwordHash)'),
      h(2, 'JWTs — Proving Who\'s Making a Request'),
      p('<p>After a successful login, the server issues a <b>JSON Web Token</b> — a signed string the client sends back on every future request (usually in an <code>Authorization</code> header) instead of logging in again each time.</p>'),
      code('js', 'import jwt from \'jsonwebtoken\'\n\n// After verifying the password is correct\nconst token = jwt.sign(\n  { userId: user.id },\n  process.env.JWT_SECRET,\n  { expiresIn: \'7d\' }\n)\n\nres.json({ token })'),
      h(2, 'Verifying a Token on a Protected Route'),
      code('js', 'function requireAuth(req, res, next) {\n  const authHeader = req.headers.authorization\n  const token = authHeader?.split(\' \')[1]   // "Bearer <token>"\n\n  if (!token) {\n    return res.status(401).json({ error: \'No token provided\' })\n  }\n\n  try {\n    const payload = jwt.verify(token, process.env.JWT_SECRET)\n    req.userId = payload.userId\n    next()\n  } catch {\n    res.status(401).json({ error: \'Invalid or expired token\' })\n  }\n}\n\napp.delete(\'/products/:id\', requireAuth, (req, res) => {\n  // req.userId is now available — this route only runs for a valid token\n})'),
      p('<p>This is exactly the middleware pattern from the earlier Middleware lesson — <code>requireAuth</code> runs before the route handler, and can block the request entirely before it reaches the actual logic.</p>'),
      table(['Piece', 'Purpose'], [
        ['bcrypt.hash()', 'Turns a plain password into a safe, salted hash for storage'],
        ['bcrypt.compare()', 'Checks a login attempt\'s password against the stored hash'],
        ['jwt.sign()', 'Issues a signed token after a successful login'],
        ['jwt.verify()', 'Confirms a token is genuine and not expired, on every protected request'],
      ]),
      callout('warning', '<p><code>JWT_SECRET</code> must be a long, random, private value kept in an environment variable — never committed to the repo. Anyone who obtains it can forge a valid token for any user.</p>', 'The one secret this whole system depends on'),
    ],
  },
  bn: {
    title: 'Authentication — Password ও JWT',
    metaTitle: 'Node.js JWT দিয়ে Authentication | Learn Computer Academy',
    metaDescription: 'bcrypt দিয়ে নিরাপদে password hash করা, আর একটি Express route কে বুঝতে দিতে একটি JSON Web Token issue আর verify করা কে request করছে।',
    blocks: [
      p('<p>REST API পাঠ বলেছিল যে যে কেউ একটি product delete করতে পারা উচিত না — এই পাঠ আসলে কীভাবে এটা প্রয়োগ করা হয়: নিরাপদে password hash করা, আর পরের প্রতিটি request-এ কে request করছে তা প্রমাণ করা একটি token issue করা।</p>'),
      h(2, 'কখনো একটি Plain Password Store করবেন না', 'কখনো-একটি-plain-password-store-করবেন-না'),
      p('<p><code>bcrypt</code> একটি random salt বেক করা সহ একটি password hash করে — একই password দুবার hash করলে দুটি ভিন্ন ফলাফল তৈরি হয়, যা ঠিক common password-এর একটি precomputed table দিয়ে একটি চুরি হওয়া password database search করা যাওয়া বন্ধ করে।</p>'),
      code('js', 'import bcrypt from \'bcrypt\'\n\n// একজন user sign up করলে\nconst passwordHash = await bcrypt.hash(req.body.password, 10)\n// database-এ passwordHash সংরক্ষণ করুন — কখনো plain password না\n\n// একজন user login করলে\nconst isCorrect = await bcrypt.compare(req.body.password, user.passwordHash)'),
      h(2, 'JWT — কে Request করছে তা প্রমাণ করা', 'jwt-কে-request-করছে-তা-প্রমাণ-করা'),
      p('<p>একটি সফল login-এর পর, server একটি <b>JSON Web Token</b> issue করে — একটি signed string যা client প্রতিটি ভবিষ্যতের request-এ (সাধারণত একটি <code>Authorization</code> header-এ) প্রতিবার আবার login করার বদলে ফেরত পাঠায়।</p>'),
      code('js', 'import jwt from \'jsonwebtoken\'\n\n// password সঠিক verify করার পর\nconst token = jwt.sign(\n  { userId: user.id },\n  process.env.JWT_SECRET,\n  { expiresIn: \'7d\' }\n)\n\nres.json({ token })'),
      h(2, 'একটি Protected Route-এ একটি Token Verify করা', 'একটি-protected-route-এ-একটি-token-verify-করা'),
      code('js', 'function requireAuth(req, res, next) {\n  const authHeader = req.headers.authorization\n  const token = authHeader?.split(\' \')[1]   // "Bearer <token>"\n\n  if (!token) {\n    return res.status(401).json({ error: \'No token provided\' })\n  }\n\n  try {\n    const payload = jwt.verify(token, process.env.JWT_SECRET)\n    req.userId = payload.userId\n    next()\n  } catch {\n    res.status(401).json({ error: \'Invalid or expired token\' })\n  }\n}\n\napp.delete(\'/products/:id\', requireAuth, (req, res) => {\n  // req.userId এখন উপলব্ধ — এই route শুধু একটি বৈধ token-এর জন্য চলে\n})'),
      p('<p>এটা ঠিক আগের Middleware পাঠের একই pattern — <code>requireAuth</code> route handler-এর আগে চলে, আর আসল logic-এ পৌঁছানোর আগেই request সম্পূর্ণভাবে block করতে পারে।</p>'),
      table(['অংশ', 'উদ্দেশ্য'], [
        ['bcrypt.hash()', 'সংরক্ষণের জন্য একটি plain password-কে একটি নিরাপদ, salted hash-এ পরিণত করে'],
        ['bcrypt.compare()', 'একটি login attempt-এর password সংরক্ষিত hash-এর সাথে check করে'],
        ['jwt.sign()', 'একটি সফল login-এর পর একটি signed token issue করে'],
        ['jwt.verify()', 'প্রতিটি protected request-এ একটি token আসল আর মেয়াদ শেষ না হয়েছে তা নিশ্চিত করে'],
      ]),
      callout('warning', '<p><code>JWT_SECRET</code> একটি environment variable-এ রাখা একটি লম্বা, random, private মান হতে হবে — কখনো repo-তে commit করা না। যে কেউ এটা পায় সে যেকোনো user-এর জন্য একটি বৈধ token forge করতে পারে।</p>', 'এই পুরো system যে একটি secret-এর উপর নির্ভর করে'),
    ],
  },
})

// ═══ 2. TESTING ═══════════════════════════════════════════════════════════

lessons.push({
  slug: 'testing-nodejs-applications', sortOrder: n++,
  en: {
    title: 'Testing Node.js Applications',
    metaTitle: 'Testing Node.js Applications | Learn Computer Academy',
    metaDescription: "Writing automated tests with Node's own built-in test runner — no extra package required — plus testing an Express route.",
    blocks: [
      p('<p>Node ships its own test runner built in — <code>node:test</code> — so a first real test needs no extra package at all. (Popular external runners like Jest and Vitest add extra features on top of the same core idea, worth exploring later.)</p>'),
      h(2, 'A First Test'),
      code('js', '// math.test.js\nimport { test } from \'node:test\'\nimport assert from \'node:assert\'\n\nfunction add(a, b) {\n  return a + b\n}\n\ntest(\'add() sums two numbers\', () => {\n  assert.strictEqual(add(2, 3), 5)\n})'),
      code('bash', 'node --test\n# ✔ add() sums two numbers'),
      h(2, 'Grouping Related Tests'),
      code('js', 'import { describe, test } from \'node:test\'\nimport assert from \'node:assert\'\n\ndescribe(\'add()\', () => {\n  test(\'sums two positive numbers\', () => {\n    assert.strictEqual(add(2, 3), 5)\n  })\n\n  test(\'handles negative numbers\', () => {\n    assert.strictEqual(add(-2, 3), 1)\n  })\n})'),
      h(2, 'Testing Async Code'),
      code('js', 'test(\'fetches a user\', async () => {\n  const user = await getUser(1)\n  assert.strictEqual(user.name, \'Sam\')\n})'),
      h(2, 'Testing an Express Route'),
      p('<p>Rather than starting a real server on a real port, a request library that can call an Express app directly (like <code>supertest</code>) tests routes without any network involved.</p>'),
      code('js', 'import { test } from \'node:test\'\nimport assert from \'node:assert\'\nimport request from \'supertest\'\nimport app from \'./app.js\'\n\ntest(\'GET /products returns a list\', async () => {\n  const response = await request(app).get(\'/products\')\n  assert.strictEqual(response.status, 200)\n  assert.ok(Array.isArray(response.body))\n})'),
      h(2, 'The Common assert Methods'),
      table(['Method', 'Checks'], [
        ['assert.strictEqual(a, b)', 'a === b'],
        ['assert.deepStrictEqual(a, b)', 'a and b have the same structure/values (for objects and arrays)'],
        ['assert.ok(value)', 'value is truthy'],
        ['assert.throws(fn)', 'Calling fn throws an error'],
        ['assert.rejects(promise)', 'An async function\'s returned promise rejects'],
      ]),
      callout('tip', '<p>A test suite that only ever exercises the "happy path" (valid input, success case) misses most real bugs — deliberately write at least one test for what should happen with bad input, a missing field, or an error thrown deep in the code.</p>', 'Test the failure cases too'),
    ],
  },
  bn: {
    title: 'Node.js Application Test করা',
    metaTitle: 'Node.js Application Test করা | Learn Computer Academy',
    metaDescription: 'Node-এর নিজের built-in test runner দিয়ে automated test লেখা — কোনো অতিরিক্ত package ছাড়াই — সাথে একটি Express route test করা।',
    blocks: [
      p('<p>Node নিজের test runner built in নিয়ে আসে — <code>node:test</code> — তাই একটি প্রথম আসল test-এর জন্য কোনো অতিরিক্ত package লাগে না। (Jest আর Vitest-এর মতো জনপ্রিয় external runner একই মূল ধারণার উপর অতিরিক্ত feature যোগ করে, পরে explore করার যোগ্য।)</p>'),
      h(2, 'একটি প্রথম Test', 'একটি-প্রথম-test'),
      code('js', '// math.test.js\nimport { test } from \'node:test\'\nimport assert from \'node:assert\'\n\nfunction add(a, b) {\n  return a + b\n}\n\ntest(\'add() sums two numbers\', () => {\n  assert.strictEqual(add(2, 3), 5)\n})'),
      code('bash', 'node --test\n# ✔ add() sums two numbers'),
      h(2, 'সম্পর্কিত Test Group করা', 'সম্পর্কিত-test-group-করা'),
      code('js', 'import { describe, test } from \'node:test\'\nimport assert from \'node:assert\'\n\ndescribe(\'add()\', () => {\n  test(\'sums two positive numbers\', () => {\n    assert.strictEqual(add(2, 3), 5)\n  })\n\n  test(\'handles negative numbers\', () => {\n    assert.strictEqual(add(-2, 3), 1)\n  })\n})'),
      h(2, 'Async কোড Test করা', 'async-কোড-test-করা'),
      code('js', 'test(\'fetches a user\', async () => {\n  const user = await getUser(1)\n  assert.strictEqual(user.name, \'Sam\')\n})'),
      h(2, 'একটি Express Route Test করা', 'একটি-express-route-test-করা'),
      p('<p>একটি real port-এ একটি আসল server শুরু করার বদলে, সরাসরি একটি Express app call করতে পারে এমন একটি request library (যেমন <code>supertest</code>) কোনো network ছাড়াই route test করে।</p>'),
      code('js', 'import { test } from \'node:test\'\nimport assert from \'node:assert\'\nimport request from \'supertest\'\nimport app from \'./app.js\'\n\ntest(\'GET /products returns a list\', async () => {\n  const response = await request(app).get(\'/products\')\n  assert.strictEqual(response.status, 200)\n  assert.ok(Array.isArray(response.body))\n})'),
      h(2, 'সাধারণ assert Method', 'সাধারণ-assert-method'),
      table(['Method', 'Check করে'], [
        ['assert.strictEqual(a, b)', 'a === b'],
        ['assert.deepStrictEqual(a, b)', 'a আর b-র একই structure/মান আছে (object আর array-র জন্য)'],
        ['assert.ok(value)', 'value truthy'],
        ['assert.throws(fn)', 'fn call করলে একটি error throw হয়'],
        ['assert.rejects(promise)', 'একটি async function-এর return করা promise reject হয়'],
      ]),
      callout('tip', '<p>একটি test suite যা শুধু "happy path" (বৈধ input, success case) ব্যায়াম করে বেশিরভাগ আসল bug মিস করে — খারাপ input, একটি missing field, বা কোডের গভীরে throw হওয়া একটি error দিয়ে কী হওয়া উচিত তার জন্য ইচ্ছাকৃতভাবে অন্তত একটি test লিখুন।</p>', 'Failure case-ও test করুন'),
    ],
  },
})

// ═══ 3. LOGGING ═══════════════════════════════════════════════════════════

lessons.push({
  slug: 'logging-in-production', sortOrder: n++,
  en: {
    title: 'Logging in Production',
    metaTitle: 'Logging in Node.js Production Apps | Learn Computer Academy',
    metaDescription: "Why console.log stops being enough once an app is actually running on a server, and the structured logging pattern that replaces it.",
    blocks: [
      p('<p><code>console.log</code> works fine on a local machine, but a real running server needs more: log levels, timestamps, and output that can actually be searched later — usually across thousands of lines a day.</p>'),
      h(2, 'Where console.log Falls Short'),
      table(['Problem', 'What a real logger solves'], [
        ['No severity level', 'An error and a routine info message look identical'],
        ['No timestamp by default', 'Impossible to know when something happened after the fact'],
        ['Plain text only', 'Hard to search or filter at scale — structured (JSON) logs can be queried'],
        ['Always prints, even in production', 'A real logger can be configured to skip verbose logs outside development'],
      ]),
      h(2, 'A Structured Logger — winston'),
      code('js', 'import winston from \'winston\'\n\nconst logger = winston.createLogger({\n  level: \'info\',\n  format: winston.format.json(),\n  transports: [new winston.transports.Console()],\n})\n\nlogger.info(\'Server started\', { port: 3000 })\nlogger.error(\'Database connection failed\', { error: err.message })'),
      code('json', '{"level":"info","message":"Server started","port":3000,"timestamp":"2026-09-03T10:00:00.000Z"}'),
      h(2, 'Log Levels'),
      table(['Level', 'Use for'], [
        ['error', 'Something failed and needs attention'],
        ['warn', 'Something unexpected, but the app kept working'],
        ['info', 'Normal, notable events — a server starting, a user signing up'],
        ['debug', 'Detailed information, usually only enabled during active troubleshooting'],
      ]),
      h(2, 'Logging Every Request — morgan'),
      p('<p><code>morgan</code> is Express-specific middleware (from the earlier Middleware lesson) that automatically logs every incoming request.</p>'),
      code('js', 'import morgan from \'morgan\'\napp.use(morgan(\'combined\'))\n// Logs: method, URL, status code, response time, for every request automatically'),
      callout('warning', '<p>Never log a password, a full credit card number, or an API secret — even at the debug level. A log file is often less carefully protected than the database itself, and logs frequently get shipped to third-party monitoring tools.</p>', 'What never belongs in a log'),
    ],
  },
  bn: {
    title: 'Production-এ Logging',
    metaTitle: 'Node.js Production App-এ Logging | Learn Computer Academy',
    metaDescription: 'একটি app আসলে একটি server-এ চলতে শুরু করলে কেন console.log আর যথেষ্ট থাকে না, আর এটাকে বদলানো structured logging pattern।',
    blocks: [
      p('<p><code>console.log</code> একটি local machine-এ ঠিকঠাক কাজ করে, কিন্তু একটি আসল চলমান server-এর বেশি দরকার: log level, timestamp, আর পরে সত্যিকারভাবে search করা যায় এমন output — সাধারণত প্রতিদিন হাজার হাজার লাইন জুড়ে।</p>'),
      h(2, 'console.log যেখানে কম পড়ে', 'consolelog-যেখানে-কম-পড়ে'),
      table(['সমস্যা', 'একটি আসল logger যা সমাধান করে'], [
        ['কোনো severity level নেই', 'একটি error আর একটি routine info message একই দেখায়'],
        ['Default-এ কোনো timestamp নেই', 'পরে কখন কিছু ঘটেছে জানা অসম্ভব'],
        ['শুধু plain text', 'scale-এ search বা filter করা কঠিন — structured (JSON) log query করা যায়'],
        ['Production-এও সবসময় print করে', 'একটি আসল logger development-এর বাইরে verbose log skip করতে configure করা যায়'],
      ]),
      h(2, 'একটি Structured Logger — winston', 'একটি-structured-logger-winston'),
      code('js', 'import winston from \'winston\'\n\nconst logger = winston.createLogger({\n  level: \'info\',\n  format: winston.format.json(),\n  transports: [new winston.transports.Console()],\n})\n\nlogger.info(\'Server started\', { port: 3000 })\nlogger.error(\'Database connection failed\', { error: err.message })'),
      code('json', '{"level":"info","message":"Server started","port":3000,"timestamp":"2026-09-03T10:00:00.000Z"}'),
      h(2, 'Log Level'),
      table(['Level', 'যার জন্য ব্যবহার'], [
        ['error', 'কিছু fail হয়েছে আর মনোযোগ দরকার'],
        ['warn', 'অপ্রত্যাশিত কিছু, কিন্তু app কাজ করতে থাকে'],
        ['info', 'সাধারণ, উল্লেখযোগ্য event — একটি server শুরু হওয়া, একজন user sign up করা'],
        ['debug', 'বিস্তারিত তথ্য, সাধারণত শুধু সক্রিয় troubleshooting-এর সময় enable করা'],
      ]),
      h(2, 'প্রতিটি Request Log করা — morgan', 'প্রতিটি-request-log-করা-morgan'),
      p('<p>(আগের Middleware পাঠ থেকে) <code>morgan</code> Express-নির্দিষ্ট middleware যা স্বয়ংক্রিয়ভাবে প্রতিটি আসা request log করে।</p>'),
      code('js', 'import morgan from \'morgan\'\napp.use(morgan(\'combined\'))\n// Log করে: method, URL, status code, response time, প্রতিটি request-এ স্বয়ংক্রিয়ভাবে'),
      callout('warning', '<p>একটি password, একটি পূর্ণ credit card number, বা একটি API secret কখনো log করবেন না — debug level-এও না। একটি log file প্রায়ই database নিজের চেয়ে কম সাবধানে সুরক্ষিত, আর log প্রায়ই third-party monitoring tool-এ পাঠানো হয়।</p>', 'একটি log-এ কখনো যা থাকা উচিত না'),
    ],
  },
})

// ═══ 4. CONCURRENCY BEYOND THE EVENT LOOP ═══════════════════════════════

lessons.push({
  slug: 'concurrency-child-process-worker-threads-cluster', sortOrder: n++,
  en: {
    title: 'Concurrency Beyond the Event Loop — Child Processes, Worker Threads, and Cluster',
    metaTitle: 'Node.js Concurrency — Child Process, Worker Threads, Cluster | Learn Computer Academy',
    metaDescription: "Three ways Node uses more than its one main thread — running another program, offloading CPU-heavy work, and using every CPU core for a server.",
    blocks: [
      p('<p>The earlier Event Loop lesson explained why Node handles many requests on a single thread — that works well because most server work is <i>waiting</i> (on a file, a database, a network response), not <i>computing</i>. These three tools cover the cases where that single thread genuinely isn\'t enough.</p>'),
      h(2, 'child_process — Running Another Program'),
      p('<p>Runs a separate operating-system process — another program entirely, not more JavaScript on the same thread.</p>'),
      code('js', 'import { exec } from \'child_process\'\n\nexec(\'ls -la\', (err, stdout, stderr) => {\n  if (err) throw err\n  console.log(stdout)\n})'),
      p('<ul><li>Common uses: running a shell command, converting a file with an external tool (like ImageMagick or ffmpeg), or spawning another script.</li><li>The new process runs fully independently — Node\'s own event loop stays free while it works.</li></ul>'),
      h(2, 'worker_threads — Offloading CPU-Heavy JavaScript'),
      p('<p>Unlike <code>child_process</code>, a worker thread runs more JavaScript, in a real OS thread separate from the main one — for CPU-intensive work (heavy computation, image processing, large data transformation) that would otherwise block the event loop for everyone.</p>'),
      code('js', '// worker.js\nimport { parentPort, workerData } from \'worker_threads\'\n\nfunction heavyComputation(n) {\n  let result = 0\n  for (let i = 0; i < n; i++) result += i\n  return result\n}\n\nparentPort.postMessage(heavyComputation(workerData))'),
      code('js', '// main.js\nimport { Worker } from \'worker_threads\'\n\nconst worker = new Worker(\'./worker.js\', { workerData: 1_000_000_000 })\nworker.on(\'message\', (result) => {\n  console.log(\'Result:\', result)\n})\n// The main thread — and the server\'s ability to handle other requests —\n// stays responsive while this runs'),
      callout('warning', '<p>Running heavy synchronous computation directly on the main thread (instead of a worker) blocks every request the server is handling — this is the actual failure mode "Node is single-threaded" warnings are about.</p>', 'What worker_threads actually prevents'),
      h(2, 'cluster — Using Every CPU Core'),
      p('<p>A single Node process only ever uses one CPU core. <code>cluster</code> forks multiple copies of the whole application — one per core — with a built-in load balancer distributing incoming requests between them.</p>'),
      code('js', 'import cluster from \'cluster\'\nimport os from \'os\'\n\nif (cluster.isPrimary) {\n  const cpuCount = os.cpus().length\n  for (let i = 0; i < cpuCount; i++) {\n    cluster.fork()\n  }\n} else {\n  // This code runs in each worker process — the actual server\n  startServer()\n}'),
      table(['Tool', 'Runs', 'Use for'], [
        ['child_process', 'A separate OS process, any program', 'Running a shell command or external tool'],
        ['worker_threads', 'More JavaScript, a separate OS thread', 'CPU-heavy computation that would block the event loop'],
        ['cluster', 'Multiple copies of the whole app, one per CPU core', 'Using every core on a multi-core server for more throughput'],
      ]),
      callout('note', '<p>Tools like PM2 (covered in this site\'s Hosting & Deployment course) manage clustering and process restarts automatically — worth knowing the underlying cluster module conceptually, even when a tool handles it in practice.</p>', 'What most real projects actually use'),
    ],
  },
  bn: {
    title: 'Event Loop-এর বাইরে Concurrency — Child Process, Worker Thread, ও Cluster',
    metaTitle: 'Node.js Concurrency — Child Process, Worker Thread, Cluster | Learn Computer Academy',
    metaDescription: 'Node তার একটা মূল thread-এর বেশি ব্যবহার করার তিনটা উপায় — আরেকটা program চালানো, CPU-ভারী কাজ offload করা, আর একটা server-এর জন্য প্রতিটা CPU core ব্যবহার করা।',
    blocks: [
      p('<p>আগের Event Loop পাঠ ব্যাখ্যা করেছে কেন Node একটা একক thread-এ অনেক request handle করে — এটা ভালো কাজ করে কারণ বেশিরভাগ server কাজ <i>compute</i> না, <i>অপেক্ষা</i> (একটা file, একটা database, একটা network response-এর জন্য)। এই তিনটা tool সেই case কভার করে যেখানে সেই একক thread সত্যিকারভাবে যথেষ্ট না।</p>'),
      h(2, 'child_process — আরেকটা Program চালানো', 'child_process-আরেকটা-program-চালানো'),
      p('<p>একটা আলাদা operating-system process চালায় — একই thread-এ আরো JavaScript না, সম্পূর্ণ অন্য একটা program।</p>'),
      code('js', 'import { exec } from \'child_process\'\n\nexec(\'ls -la\', (err, stdout, stderr) => {\n  if (err) throw err\n  console.log(stdout)\n})'),
      p('<ul><li>Common ব্যবহার: একটা shell command চালানো, একটা external tool দিয়ে (ImageMagick বা ffmpeg-এর মতো) একটা file convert করা, বা আরেকটা script spawn করা।</li><li>নতুন process সম্পূর্ণ স্বাধীনভাবে চলে — এটা কাজ করার সময় Node-এর নিজের event loop মুক্ত থাকে।</li></ul>'),
      h(2, 'worker_threads — CPU-ভারী JavaScript Offload করা', 'worker_threads-cpu-ভারী-javascript-offload-করা'),
      p('<p><code>child_process</code>-এর মতো না, একটা worker thread মূল thread থেকে আলাদা একটা আসল OS thread-এ আরো JavaScript চালায় — CPU-intensive কাজের জন্য (ভারী computation, image processing, বড় data transformation) যা নাহলে সবার জন্য event loop block করত।</p>'),
      code('js', '// worker.js\nimport { parentPort, workerData } from \'worker_threads\'\n\nfunction heavyComputation(n) {\n  let result = 0\n  for (let i = 0; i < n; i++) result += i\n  return result\n}\n\nparentPort.postMessage(heavyComputation(workerData))'),
      code('js', '// main.js\nimport { Worker } from \'worker_threads\'\n\nconst worker = new Worker(\'./worker.js\', { workerData: 1_000_000_000 })\nworker.on(\'message\', (result) => {\n  console.log(\'Result:\', result)\n})\n// এটা চলার সময় main thread — আর অন্য request handle করার server-এর\n// ক্ষমতা — responsive থাকে'),
      callout('warning', '<p>ভারী synchronous computation সরাসরি main thread-এ (একটা worker-এর বদলে) চালানো server যে প্রতিটা request handle করছে তা block করে — "Node single-threaded" warning আসলে এই failure mode নিয়ে।</p>', 'worker_threads আসলে যা আটকায়'),
      h(2, 'cluster — প্রতিটা CPU Core ব্যবহার করা', 'cluster-প্রতিটা-cpu-core-ব্যবহার-করা'),
      p('<p>একটা একক Node process কখনো শুধু একটা CPU core ব্যবহার করে। <code>cluster</code> পুরো application-এর একাধিক কপি fork করে — প্রতি core-এ একটা — একটা built-in load balancer সহ যা আসা request এদের মধ্যে ভাগ করে।</p>'),
      code('js', 'import cluster from \'cluster\'\nimport os from \'os\'\n\nif (cluster.isPrimary) {\n  const cpuCount = os.cpus().length\n  for (let i = 0; i < cpuCount; i++) {\n    cluster.fork()\n  }\n} else {\n  // এই কোড প্রতিটা worker process-এ চলে — আসল server\n  startServer()\n}'),
      table(['Tool', 'যা চালায়', 'যার জন্য ব্যবহার'], [
        ['child_process', 'একটা আলাদা OS process, যেকোনো program', 'একটা shell command বা external tool চালানো'],
        ['worker_threads', 'আরো JavaScript, একটা আলাদা OS thread', 'event loop block করত এমন CPU-ভারী computation'],
        ['cluster', 'পুরো app-এর একাধিক কপি, প্রতি CPU core-এ একটা', 'বেশি throughput-এর জন্য একটা multi-core server-এর প্রতিটা core ব্যবহার'],
      ]),
      callout('note', '<p>PM2-এর মতো tool (এই সাইটের Hosting & Deployment কোর্সে কভার করা) স্বয়ংক্রিয়ভাবে clustering আর process restart manage করে — বাস্তবে একটা tool এটা handle করলেও, underlying cluster module conceptually জানার যোগ্য।</p>', 'বেশিরভাগ আসল project আসলে যা ব্যবহার করে'),
    ],
  },
})

// ═══ 5. MAKING HTTP REQUESTS WITH FETCH ═══════════════════════════════════

lessons.push({
  slug: 'making-http-requests-with-fetch', sortOrder: n++,
  en: {
    title: 'Making HTTP Requests from Node.js',
    metaTitle: 'Making HTTP Requests from Node.js | Learn Computer Academy',
    metaDescription: "Calling another API from a Node script or server using the built-in global fetch — no dependency required, GET and POST requests, and error handling.",
    blocks: [
      p('<p>Every earlier lesson in this course built a server that <i>receives</i> requests. This lesson is the other direction — a Node script or server calling <i>another</i> API, using the same <code>fetch</code> function already familiar from browser JavaScript.</p>'),
      h(2, 'fetch Is Built In'),
      p('<p>Node 18 and later ships a global <code>fetch</code> — no package to install, no <code>import</code> needed.</p>'),
      code('js', 'const response = await fetch(\'https://api.example.com/users\')\nconst users = await response.json()\nconsole.log(users)'),
      h(2, 'Checking the Response Status'),
      p('<p>Unlike most Node error handling, <code>fetch</code> does <i>not</i> throw for a 404 or 500 response — only for a genuine network failure. The status needs an explicit check.</p>'),
      code('js', 'const response = await fetch(\'https://api.example.com/users/999\')\n\nif (!response.ok) {\n  throw new Error(`Request failed: ${response.status}`)\n}\n\nconst user = await response.json()'),
      h(2, 'A POST Request, Sending JSON'),
      code('js', 'const response = await fetch(\'https://api.example.com/users\', {\n  method: \'POST\',\n  headers: { \'Content-Type\': \'application/json\' },\n  body: JSON.stringify({ name: \'Sam\', email: \'sam@example.com\' }),\n})\n\nconst created = await response.json()'),
      h(2, 'Adding Authentication'),
      code('js', 'const response = await fetch(\'https://api.example.com/orders\', {\n  headers: { Authorization: `Bearer ${apiToken}` },\n})'),
      h(2, 'A Realistic Wrapper Function'),
      code('js', 'async function apiGet(path) {\n  const response = await fetch(`https://api.example.com${path}`, {\n    headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },\n  })\n  if (!response.ok) {\n    throw new Error(`API error ${response.status}: ${await response.text()}`)\n  }\n  return response.json()\n}\n\nconst orders = await apiGet(\'/orders\')'),
      callout('tip', '<p>Third-party libraries like axios still add real conveniences (automatic JSON parsing, request/response interceptors, built-in timeout handling) — worth reaching for on a larger project. Built-in fetch is enough for most everyday cases without adding a dependency.</p>', 'When a library still helps'),
    ],
  },
  bn: {
    title: 'Node.js থেকে HTTP Request করা',
    metaTitle: 'Node.js থেকে HTTP Request করা | Learn Computer Academy',
    metaDescription: 'built-in global fetch ব্যবহার করে একটা Node script বা server থেকে অন্য একটা API call করা — কোনো dependency দরকার নেই, GET আর POST request, আর error handling।',
    blocks: [
      p('<p>এই কোর্সের আগের প্রতিটা lesson একটা server বানিয়েছে যা request <i>receive</i> করে। এই lesson অন্য দিক — একটা Node script বা server <i>অন্য</i> একটা API call করা, browser JavaScript থেকে ইতিমধ্যে পরিচিত একই <code>fetch</code> function ব্যবহার করে।</p>'),
      h(2, 'fetch Built In', 'fetch-built-in'),
      p('<p>Node 18 আর তার পরে একটা global <code>fetch</code> আসে — কোনো package install করা লাগে না, কোনো <code>import</code> দরকার নেই।</p>'),
      code('js', 'const response = await fetch(\'https://api.example.com/users\')\nconst users = await response.json()\nconsole.log(users)'),
      h(2, 'Response Status Check করা', 'response-status-check-করা'),
      p('<p>বেশিরভাগ Node error handling-এর মতো না, একটা 404 বা 500 response-এর জন্য <code>fetch</code> throw করে <i>না</i> — শুধু একটা আসল network failure-এর জন্য করে। Status-এর একটা স্পষ্ট check দরকার।</p>'),
      code('js', 'const response = await fetch(\'https://api.example.com/users/999\')\n\nif (!response.ok) {\n  throw new Error(`Request failed: ${response.status}`)\n}\n\nconst user = await response.json()'),
      h(2, 'একটা POST Request, JSON পাঠানো', 'একটা-post-request-json-পাঠানো'),
      code('js', 'const response = await fetch(\'https://api.example.com/users\', {\n  method: \'POST\',\n  headers: { \'Content-Type\': \'application/json\' },\n  body: JSON.stringify({ name: \'Sam\', email: \'sam@example.com\' }),\n})\n\nconst created = await response.json()'),
      h(2, 'Authentication যোগ করা', 'authentication-যোগ-করা'),
      code('js', 'const response = await fetch(\'https://api.example.com/orders\', {\n  headers: { Authorization: `Bearer ${apiToken}` },\n})'),
      h(2, 'একটা বাস্তবিক Wrapper Function', 'একটা-বাস্তবিক-wrapper-function'),
      code('js', 'async function apiGet(path) {\n  const response = await fetch(`https://api.example.com${path}`, {\n    headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },\n  })\n  if (!response.ok) {\n    throw new Error(`API error ${response.status}: ${await response.text()}`)\n  }\n  return response.json()\n}\n\nconst orders = await apiGet(\'/orders\')'),
      callout('tip', '<p>axios-এর মতো third-party library এখনো আসল সুবিধা যোগ করে (স্বয়ংক্রিয় JSON parsing, request/response interceptor, built-in timeout handling) — একটা বড় project-এ এটার জন্য যাওয়ার যোগ্য। একটা dependency যোগ না করেই built-in fetch বেশিরভাগ প্রতিদিনের case-এর জন্য যথেষ্ট।</p>', 'কখন একটা library এখনো সাহায্য করে'),
    ],
  },
})

// ═══ 6. process.nextTick & setImmediate ═══════════════════════════════════

lessons.push({
  slug: 'process-nexttick-and-setimmediate', sortOrder: n++,
  en: {
    title: 'process.nextTick and setImmediate',
    metaTitle: 'process.nextTick and setImmediate in Node.js | Learn Computer Academy',
    metaDescription: 'Two Node-specific ways to schedule a callback for "as soon as possible" — how they differ from each other and from setTimeout, and the exact order they run in.',
    blocks: [
      p('<p>The earlier Event Loop lesson covered the general model — the call stack, the task queue. Node adds two more specific scheduling tools on top of that model, both meaning roughly "run this very soon," but not identically.</p>'),
      h(2, 'process.nextTick — Runs Before Anything Else'),
      p('<p>A callback passed to <code>process.nextTick</code> runs immediately after the current operation finishes, before the event loop continues to anything else — even before promise callbacks.</p>'),
      code('js', 'console.log(\'1\')\nprocess.nextTick(() => console.log(\'2 — nextTick\'))\nPromise.resolve().then(() => console.log(\'3 — promise\'))\nconsole.log(\'4\')\n\n// Output: 1, 4, 2, 3 — nextTick runs before the promise microtask'),
      h(2, 'setImmediate — Runs After I/O Events'),
      p('<p>Scheduled to run in a specific later phase of the event loop, after I/O callbacks (like a completed file read) for that cycle have run.</p>'),
      code('js', 'const fs = require(\'fs\')\n\nfs.readFile(__filename, () => {\n  setTimeout(() => console.log(\'timeout\'), 0)\n  setImmediate(() => console.log(\'immediate\'))\n})\n\n// Inside an I/O callback, setImmediate consistently runs before\n// a 0ms setTimeout — outside one, the order isn\'t guaranteed'),
      h(2, 'Comparing the Three'),
      table(['Tool', 'When it runs'], [
        ['process.nextTick()', 'Immediately after the current operation — before anything else, including promises'],
        ['Promise .then() / microtask', 'After nextTick callbacks, still before the event loop moves on'],
        ['setImmediate()', 'In the "check" phase of the event loop, typically after I/O callbacks'],
        ['setTimeout(fn, 0)', 'In the timers phase — similar timing to setImmediate, but not guaranteed to be first'],
      ]),
      callout('warning', '<p>Calling process.nextTick recursively without a stopping condition starves the entire event loop — nothing else (not I/O, not timers) ever gets a turn, since nextTick callbacks are drained completely before anything else runs.</p>', 'A real footgun with process.nextTick'),
      h(2, 'When Each Is Actually Useful'),
      p('<ul><li><code>process.nextTick</code>: ensuring a callback runs after the current synchronous code finishes, but strictly before any I/O or timer — used carefully, and rarely needed in typical application code.</li><li><code>setImmediate</code>: deferring work until after pending I/O has been handled, so it doesn\'t delay something more time-sensitive.</li></ul>'),
    ],
  },
  bn: {
    title: 'process.nextTick ও setImmediate',
    metaTitle: 'Node.js-এ process.nextTick ও setImmediate | Learn Computer Academy',
    metaDescription: '"যত তাড়াতাড়ি সম্ভব"-এর জন্য একটা callback schedule করার দুটো Node-নির্দিষ্ট উপায় — এরা একে অপরের থেকে আর setTimeout থেকে কীভাবে ভিন্ন, আর ঠিক কোন ক্রমে চলে।',
    blocks: [
      p('<p>আগের Event Loop পাঠ সাধারণ model কভার করেছে — call stack, task queue। Node সেই model-এর উপর আরো দুটো নির্দিষ্ট scheduling tool যোগ করে, দুটোই মোটামুটি "এটা খুব শীঘ্রই চালান" বোঝায়, কিন্তু ঠিক একই না।</p>'),
      h(2, 'process.nextTick — বাকি সবকিছুর আগে চলে', 'processnexttick-বাকি-সবকিছুর-আগে-চলে'),
      p('<p><code>process.nextTick</code>-এ পাঠানো একটা callback বর্তমান operation শেষ হওয়ার সাথে সাথেই চলে, event loop অন্য কিছুতে যাওয়ার আগে — এমনকি promise callback-এরও আগে।</p>'),
      code('js', 'console.log(\'1\')\nprocess.nextTick(() => console.log(\'2 — nextTick\'))\nPromise.resolve().then(() => console.log(\'3 — promise\'))\nconsole.log(\'4\')\n\n// Output: 1, 4, 2, 3 — nextTick promise microtask-এর আগে চলে'),
      h(2, 'setImmediate — I/O Event-এর পরে চলে', 'setimmediate-io-event-এর-পরে-চলে'),
      p('<p>Event loop-এর একটা নির্দিষ্ট পরের phase-এ চলার জন্য schedule করা, সেই cycle-এর জন্য I/O callback (যেমন একটা সম্পূর্ণ হওয়া file read) চলার পরে।</p>'),
      code('js', 'const fs = require(\'fs\')\n\nfs.readFile(__filename, () => {\n  setTimeout(() => console.log(\'timeout\'), 0)\n  setImmediate(() => console.log(\'immediate\'))\n})\n\n// একটা I/O callback-এর ভেতরে, setImmediate ধারাবাহিকভাবে\n// একটা 0ms setTimeout-এর আগে চলে — একটার বাইরে, ক্রম নিশ্চিত না'),
      h(2, 'তিনটা তুলনা করা', 'তিনটা-তুলনা-করা'),
      table(['Tool', 'কখন চলে'], [
        ['process.nextTick()', 'বর্তমান operation-এর সাথে সাথেই — promise সহ বাকি সবকিছুর আগে'],
        ['Promise .then() / microtask', 'nextTick callback-এর পরে, তবু event loop এগিয়ে যাওয়ার আগে'],
        ['setImmediate()', 'event loop-এর "check" phase-এ, সাধারণত I/O callback-এর পরে'],
        ['setTimeout(fn, 0)', 'timers phase-এ — setImmediate-এর মতো timing, কিন্তু প্রথম হওয়া নিশ্চিত না'],
      ]),
      callout('warning', '<p>একটা থামানোর শর্ত ছাড়া recursively process.nextTick call করা পুরো event loop-কে অভুক্ত রাখে — অন্য কিছুই (I/O না, timer না) কখনো পালা পায় না, কারণ nextTick callback অন্য কিছু চলার আগে সম্পূর্ণভাবে খালি করা হয়।</p>', 'process.nextTick-এর একটা আসল বিপদ'),
      h(2, 'কখন প্রতিটা আসলে useful', 'কখন-প্রতিটা-আসলে-useful'),
      p('<ul><li><code>process.nextTick</code>: বর্তমান synchronous কোড শেষ হওয়ার পরে, কিন্তু কঠোরভাবে যেকোনো I/O বা timer-এর আগে একটা callback চলা নিশ্চিত করা — সাবধানে ব্যবহার করা, আর সাধারণ application কোডে কমই দরকার।</li><li><code>setImmediate</code>: pending I/O handle হওয়ার পর পর্যন্ত কাজ পিছিয়ে দেওয়া, যাতে এটা বেশি time-sensitive কিছু দেরি না করায়।</li></ul>'),
    ],
  },
})

// ═══ 7. TEMPLATE ENGINES ═══════════════════════════════════════════════════

lessons.push({
  slug: 'template-engines-with-ejs', sortOrder: n++,
  en: {
    title: 'Template Engines — Server-Rendered HTML with EJS',
    metaTitle: 'Node.js Template Engines — EJS | Learn Computer Academy',
    metaDescription: 'Rendering HTML on the server with data plugged in, using EJS with Express — for a page that\'s a traditional server-rendered site rather than an API or a React frontend.',
    blocks: [
      p('<p>Every earlier lesson in this course either returned JSON (a REST API) or assumed a separate frontend. A <b>template engine</b> is the traditional alternative — the server renders complete HTML pages directly, with data plugged into placeholders.</p>'),
      h(2, 'Setting Up EJS with Express'),
      code('js', 'import express from \'express\'\nconst app = express()\n\napp.set(\'view engine\', \'ejs\')\napp.set(\'views\', \'./views\')   // where template files live'),
      h(2, 'A Basic Template'),
      code('html', '<!-- views/profile.ejs -->\n<!DOCTYPE html>\n<html>\n<head><title><%= user.name %>\'s Profile</title></head>\n<body>\n  <h1>Welcome, <%= user.name %>!</h1>\n  <p>Email: <%= user.email %></p>\n</body>\n</html>'),
      p('<p><code>&lt;%= value %&gt;</code> outputs a value, automatically escaped for safety (the same escaping concept as the earlier Cybersecurity course\'s XSS-prevention lesson) — plain text stays plain text even if it contains HTML-looking characters.</p>'),
      h(2, 'Rendering the Template'),
      code('js', 'app.get(\'/profile/:id\', async (req, res) => {\n  const user = await getUser(req.params.id)\n  res.render(\'profile\', { user })\n})'),
      h(2, 'Loops and Conditionals in a Template'),
      code('html', '<ul>\n  <% products.forEach(function(product) { %>\n    <li><%= product.name %> — $<%= product.price %></li>\n  <% }) %>\n</ul>\n\n<% if (user.isAdmin) { %>\n  <a href="/admin">Admin Panel</a>\n<% } %>'),
      p('<p><code>&lt;% ... %&gt;</code> (no <code>=</code>) runs JavaScript logic without outputting anything directly — loops and conditionals use this form.</p>'),
      h(2, 'Reusable Partials'),
      code('html', '<!-- views/partials/header.ejs -->\n<header><h1>My Site</h1></header>\n\n<!-- views/profile.ejs -->\n<%- include(\'partials/header\') %>\n<h2>Profile</h2>'),
      p('<p><code>&lt;%- %&gt;</code> (with a dash) outputs raw, unescaped HTML — needed for <code>include()</code> since a partial\'s own HTML shouldn\'t be escaped away.</p>'),
      table(['Tag', 'Purpose'], [
        ['<%= value %>', 'Output a value, HTML-escaped'],
        ['<%- html %>', 'Output raw HTML, not escaped (used for includes)'],
        ['<% code %>', 'Run JavaScript logic — no output'],
      ]),
      callout('note', '<p>EJS is one option among several (Pug and Handlebars are common alternatives) — the underlying concept (server-rendered HTML with data plugged in) is the same across all of them, this lesson\'s syntax is EJS-specific.</p>', 'One of several template engines'),
    ],
  },
  bn: {
    title: 'Template Engine — EJS দিয়ে Server-Rendered HTML',
    metaTitle: 'Node.js Template Engine — EJS | Learn Computer Academy',
    metaDescription: 'Express-এর সাথে EJS ব্যবহার করে data plug in করে server-এ HTML render করা — একটা API বা একটা React frontend-এর বদলে একটা traditional server-rendered site-এর জন্য।',
    blocks: [
      p('<p>এই কোর্সের আগের প্রতিটা lesson হয় JSON return করেছে (একটা REST API) বা একটা আলাদা frontend ধরে নিয়েছে। একটা <b>template engine</b> traditional বিকল্প — server সরাসরি সম্পূর্ণ HTML পেজ render করে, placeholder-এ data plug in করে।</p>'),
      h(2, 'Express-এর সাথে EJS সেট আপ করা', 'express-এর-সাথে-ejs-সেট-আপ-করা'),
      code('js', 'import express from \'express\'\nconst app = express()\n\napp.set(\'view engine\', \'ejs\')\napp.set(\'views\', \'./views\')   // template file কোথায় থাকে'),
      h(2, 'একটা মৌলিক Template', 'একটা-মৌলিক-template'),
      code('html', '<!-- views/profile.ejs -->\n<!DOCTYPE html>\n<html>\n<head><title><%= user.name %>\'s Profile</title></head>\n<body>\n  <h1>Welcome, <%= user.name %>!</h1>\n  <p>Email: <%= user.email %></p>\n</body>\n</html>'),
      p('<p><code>&lt;%= value %&gt;</code> একটা মান output করে, নিরাপত্তার জন্য স্বয়ংক্রিয়ভাবে escape করা (আগের Cybersecurity কোর্সের XSS-prevention lesson-এর একই escaping ধারণা) — HTML-দেখতে character থাকলেও plain টেক্সট plain টেক্সট থাকে।</p>'),
      h(2, 'Template Render করা', 'template-render-করা'),
      code('js', 'app.get(\'/profile/:id\', async (req, res) => {\n  const user = await getUser(req.params.id)\n  res.render(\'profile\', { user })\n})'),
      h(2, 'একটা Template-এ Loop ও Conditional', 'একটা-template-এ-loop-ও-conditional'),
      code('html', '<ul>\n  <% products.forEach(function(product) { %>\n    <li><%= product.name %> — $<%= product.price %></li>\n  <% }) %>\n</ul>\n\n<% if (user.isAdmin) { %>\n  <a href="/admin">Admin Panel</a>\n<% } %>'),
      p('<p><code>&lt;% ... %&gt;</code> (কোনো <code>=</code> ছাড়া) সরাসরি কিছু output না করে JavaScript logic চালায় — loop আর conditional এই form ব্যবহার করে।</p>'),
      h(2, 'পুনঃব্যবহারযোগ্য Partial', 'পুনঃব্যবহারযোগ্য-partial'),
      code('html', '<!-- views/partials/header.ejs -->\n<header><h1>My Site</h1></header>\n\n<!-- views/profile.ejs -->\n<%- include(\'partials/header\') %>\n<h2>Profile</h2>'),
      p('<p><code>&lt;%- %&gt;</code> (একটা dash সহ) raw, unescaped HTML output করে — <code>include()</code>-এর জন্য দরকার কারণ একটা partial-এর নিজের HTML escape করে ফেলা উচিত না।</p>'),
      table(['Tag', 'উদ্দেশ্য'], [
        ['<%= value %>', 'একটা মান output করে, HTML-escaped'],
        ['<%- html %>', 'Raw HTML output করে, escaped না (include-এর জন্য ব্যবহৃত)'],
        ['<% code %>', 'JavaScript logic চালায় — কোনো output না'],
      ]),
      callout('note', '<p>EJS বেশ কয়েকটা option-এর একটা (Pug আর Handlebars common বিকল্প) — underlying ধারণা (data plug in করা server-rendered HTML) সবগুলোতেই একই, এই lesson-এর সিনট্যাক্স EJS-নির্দিষ্ট।</p>', 'বেশ কয়েকটা template engine-এর একটা'),
    ],
  },
})

// ═══ 8. GARBAGE COLLECTION & MEMORY LEAKS ═══════════════════════════════

lessons.push({
  slug: 'garbage-collection-and-memory-leaks', sortOrder: n++,
  en: {
    title: 'Garbage Collection and Memory Leaks in Node.js',
    metaTitle: 'Node.js Garbage Collection and Memory Leaks | Learn Computer Academy',
    metaDescription: "How Node frees memory automatically, and the Node-specific patterns — a growing cache, a forgotten listener, a global array — that quietly prevent it from doing so.",
    blocks: [
      p('<p>Node uses the same V8 JavaScript engine as Chrome, and the same automatic memory management from the earlier JavaScript course\'s Memory Management lesson — memory is freed once nothing references it anymore. A long-running server makes a leak\'s consequences far more visible than a browser tab ever does.</p>'),
      h(2, 'Why This Matters More on a Server'),
      p('<p>A browser tab gets closed and its memory reclaimed completely, often within minutes. A Node server is meant to run for days or weeks — a slow leak that\'s invisible in a five-minute test becomes a crash from running out of memory after enough traffic.</p>'),
      h(2, 'A Common Leak — an Ever-Growing Cache'),
      code('js', '// LEAK — this Map never removes anything, growing forever\nconst cache = new Map()\n\napp.get(\'/users/:id\', async (req, res) => {\n  if (!cache.has(req.params.id)) {\n    cache.set(req.params.id, await getUser(req.params.id))\n  }\n  res.json(cache.get(req.params.id))\n})'),
      code('js', '// FIXED — an actual cache needs an eviction strategy\nimport { LRUCache } from \'lru-cache\'\nconst cache = new LRUCache({ max: 500 })   // keeps at most 500 entries'),
      h(2, 'A Common Leak — Event Listeners That Are Never Removed'),
      code('js', '// LEAK — a new listener added on every request, none ever removed\napp.get(\'/subscribe\', (req, res) => {\n  eventEmitter.on(\'update\', (data) => {\n    res.write(data)\n  })\n})'),
      callout('warning', '<p>Node prints a warning after 10 listeners accumulate on the same event by default — a "MaxListenersExceededWarning" in the console is a strong hint a listener is being added somewhere it\'s never being removed.</p>', 'A built-in early warning'),
      h(2, 'Watching Memory Usage'),
      code('js', 'console.log(process.memoryUsage())\n// { rss: ..., heapTotal: ..., heapUsed: ..., external: ... }\n// heapUsed climbing steadily over time, under steady load, is the signature of a leak'),
      h(2, 'Using --inspect to Investigate'),
      code('bash', 'node --inspect server.js\n# Then open chrome://inspect in Chrome to attach DevTools —\n# the Memory tab can take a heap snapshot, the same tool used\n# for browser-side leak hunting in the earlier JavaScript lesson'),
      table(['Common source', 'Fix'], [
        ['An unbounded cache (a plain object or Map that only grows)', 'Use an actual cache with a size limit and eviction (LRU)'],
        ['Event listeners added repeatedly, never removed', 'Call .removeListener() / .off() when done, or use .once() for a one-time listener'],
        ['A module-level array or object that keeps accumulating', 'Clear or bound it explicitly, or scope it to a request instead of the module'],
        ['A forgotten setInterval', 'Store the interval ID and clearInterval() it when no longer needed'],
      ]),
    ],
  },
  bn: {
    title: 'Node.js-এ Garbage Collection ও Memory Leak',
    metaTitle: 'Node.js Garbage Collection ও Memory Leak | Learn Computer Academy',
    metaDescription: 'Node কীভাবে স্বয়ংক্রিয়ভাবে memory free করে, আর Node-নির্দিষ্ট pattern — একটা বাড়তে থাকা cache, একটা ভুলে যাওয়া listener, একটা global array — যা চুপচাপ এটা আটকায়।',
    blocks: [
      p('<p>Node Chrome-এর মতো একই V8 JavaScript engine ব্যবহার করে, আর আগের JavaScript কোর্সের Memory Management lesson থেকে একই automatic memory management — কিছু আর reference না করলে memory free হয়। একটা long-running server একটা browser tab-এর চেয়ে একটা leak-এর পরিণতি অনেক বেশি দৃশ্যমান বানায়।</p>'),
      h(2, 'একটা Server-এ এটা কেন বেশি গুরুত্বপূর্ণ', 'একটা-server-এ-এটা-কেন-বেশি-গুরুত্বপূর্ণ'),
      p('<p>একটা browser tab বন্ধ হয় আর এর memory প্রায়ই মিনিটের মধ্যে সম্পূর্ণভাবে reclaim হয়। একটা Node server দিন বা সপ্তাহ ধরে চলার জন্য বানানো — একটা পাঁচ-মিনিটের test-এ অদৃশ্য একটা ধীর leak যথেষ্ট traffic-এর পর memory শেষ হয়ে যাওয়া একটা crash হয়ে যায়।</p>'),
      h(2, 'একটা Common Leak — একটা ক্রমাগত-বাড়তে-থাকা Cache', 'একটা-common-leak-একটা-ক্রমাগত-বাড়তে-থাকা-cache'),
      code('js', '// LEAK — এই Map কখনো কিছু সরায় না, চিরকাল বাড়তে থাকে\nconst cache = new Map()\n\napp.get(\'/users/:id\', async (req, res) => {\n  if (!cache.has(req.params.id)) {\n    cache.set(req.params.id, await getUser(req.params.id))\n  }\n  res.json(cache.get(req.params.id))\n})'),
      code('js', '// FIXED — একটা আসল cache-এর একটা eviction strategy দরকার\nimport { LRUCache } from \'lru-cache\'\nconst cache = new LRUCache({ max: 500 })   // সর্বোচ্চ ৫০০টা entry রাখে'),
      h(2, 'একটা Common Leak — কখনো না সরানো Event Listener', 'একটা-common-leak-কখনো-না-সরানো-event-listener'),
      code('js', '// LEAK — প্রতিটা request-এ একটা নতুন listener যোগ হয়, কোনোটাই সরানো হয় না\napp.get(\'/subscribe\', (req, res) => {\n  eventEmitter.on(\'update\', (data) => {\n    res.write(data)\n  })\n})'),
      callout('warning', '<p>Default-এ একই event-এ ১০টা listener জমা হওয়ার পর Node একটা warning print করে — console-এ একটা "MaxListenersExceededWarning" একটা শক্তিশালী ইঙ্গিত যে কোথাও একটা listener যোগ হচ্ছে যা কখনো সরানো হচ্ছে না।</p>', 'একটা built-in আগাম সতর্কতা'),
      h(2, 'Memory Usage দেখা', 'memory-usage-দেখা'),
      code('js', 'console.log(process.memoryUsage())\n// { rss: ..., heapTotal: ..., heapUsed: ..., external: ... }\n// স্থির load-এ সময়ের সাথে ক্রমাগত বাড়তে থাকা heapUsed একটা leak-এর signature'),
      h(2, 'তদন্তের জন্য --inspect ব্যবহার করা', 'তদন্তের-জন্য-inspect-ব্যবহার-করা'),
      code('bash', 'node --inspect server.js\n# তারপর DevTools attach করতে Chrome-এ chrome://inspect খুলুন —\n# Memory tab একটা heap snapshot নিতে পারে, আগের JavaScript lesson-এ\n# browser-side leak খোঁজার জন্য ব্যবহৃত একই tool'),
      table(['Common source', 'সমাধান'], [
        ['একটা unbounded cache (শুধু বাড়তে থাকা একটা plain object বা Map)', 'একটা size limit আর eviction (LRU) সহ একটা আসল cache ব্যবহার করুন'],
        ['বারবার যোগ করা event listener, কখনো সরানো হয় না', 'শেষ হলে .removeListener() / .off() call করুন, বা one-time listener-এর জন্য .once() ব্যবহার করুন'],
        ['একটা module-level array বা object যা জমা হতে থাকে', 'স্পষ্টভাবে এটা clear বা bound করুন, বা module-এর বদলে একটা request-এ scope করুন'],
        ['একটা ভুলে যাওয়া setInterval', 'Interval ID সংরক্ষণ করুন আর আর দরকার না হলে clearInterval() করুন'],
      ]),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'nodejs').single()
  if (catErr || !category) {
    console.error('Category "nodejs" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write, plus bumping where-this-leaves-you\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] nodejs/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] nodejs/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('  nodejs/where-this-leaves-you -> sort_order 34')
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `nodejs/${lesson.slug}`
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

  const { error: bumpErr } = await supabase.from('docs').update({ sort_order: 34 }).eq('category_id', category.id).eq('slug', 'where-this-leaves-you')
  if (bumpErr) { console.error('Failed to bump where-this-leaves-you:', bumpErr.message) }
  else console.log('  ✓ nodejs/where-this-leaves-you -> sort_order 34')

  console.log(`\n✅ Done. ${lessons.length} lessons written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
