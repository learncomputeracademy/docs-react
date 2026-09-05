#!/usr/bin/env node
// Extends the existing "JavaScript" category (28 migrated lessons) with 7
// more lessons covering real gaps found against a roadmap.sh "JavaScript"
// roadmap PDF the user shared 2026-09-03 — asked "are all the topics in
// this pdf regarding javascript covered". Checked actual content, not
// keyword mentions — e.g. "...args" appears once, incidentally, inside
// javascript/es6-and-modern-features, but rest/spread syntax is never
// taught as its own topic.
//
// Two of the seven are notable: the site ships dedicated Event Loop and
// Recursion visualizer TOOLS (/tools/event-loop, /tools/recursion) with no
// lesson anywhere teaching the concept either one visualizes — the same
// "tool without a lesson" pattern found in the CSS gap batch (Flexbox/
// Grid/Animation/Clamp, D-113).
//
// User picked "build all 7" over AskUserQuestion.
//
// Style: matches the terse, W3Schools-style tone of the rest of this
// migrated category (short paragraphs, <hr> separators, code examples) —
// extending old content, not authoring a new course. Bengali matches that
// category's script-transliteration convention, verified against
// javascript/closures bn.
//
// sort_order continues from 29 (existing max is 28).
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-javascript-gap-content.mjs [--dry-run]

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
let n = 29

// ═══ 1. THE EVENT LOOP ═══════════════════════════════════════════════════

lessons.push({
  slug: 'the-event-loop', sortOrder: n++,
  en: {
    title: 'The JavaScript Event Loop',
    metaTitle: 'The JavaScript Event Loop | Learn Computer Academy',
    metaDescription: 'Why JavaScript can run asynchronous code with only one thread — the call stack, the task queue, and how the event loop connects them.',
    blocks: [
      p('<hr><p>JavaScript runs on a single thread — it can only do one thing at a time. Yet a page can wait on a network request, a timer, and a click handler all at once, without freezing. The <b>event loop</b> is the mechanism that makes this possible.</p><hr>'),
      h(2, 'The Call Stack'),
      p('<p>Every function call gets pushed onto the call stack, and popped off when it returns. JavaScript only ever runs what\'s on top of the stack.</p>'),
      code('javascript', 'function greet() {\n  console.log(\'Hello\')\n}\ngreet()\n// greet() is pushed, runs, then popped'),
      h(2, 'Why setTimeout Doesn\'t Block'),
      p('<p>A function like <code>setTimeout</code> hands its callback off to the browser, not the call stack — the call stack stays free to keep running the rest of the script immediately.</p>'),
      code('javascript', 'console.log(\'1\')\nsetTimeout(() => console.log(\'2\'), 0)\nconsole.log(\'3\')\n\n// Output: 1, 3, 2 — even with a 0ms delay,\n// the callback waits until the call stack is empty'),
      h(2, 'The Task Queue'),
      p('<p>Once a timer, network request, or event fires, its callback doesn\'t interrupt the call stack directly — it waits in a queue. The event loop\'s job is simple: check if the call stack is empty, and if so, move the next callback in queue onto it.</p>'),
      h(2, 'Microtasks vs. Macrotasks'),
      p('<p>Not all queued callbacks are treated equally. Promise callbacks go into a <b>microtask</b> queue, which the event loop always fully empties before touching the <b>macrotask</b> queue (setTimeout, setInterval, DOM events).</p>'),
      code('javascript', 'console.log(\'1\')\nsetTimeout(() => console.log(\'2 — macrotask\'), 0)\nPromise.resolve().then(() => console.log(\'3 — microtask\'))\nconsole.log(\'4\')\n\n// Output: 1, 4, 3, 2 — microtasks always run before the next macrotask'),
      table(['Queue', 'Examples', 'Priority'], [
        ['Microtask', 'Promise .then()/.catch(), async/await continuation', 'Fully drained before the next macrotask'],
        ['Macrotask', 'setTimeout, setInterval, DOM events, I/O', 'One runs per event loop cycle'],
      ]),
      callout('tip', '<p>This site\'s Event Loop tool (under Tools) animates the call stack, task queue, and microtask queue step by step for a piece of code — a much faster way to build intuition than reading the ordering rules alone.</p>', 'Practice it interactively'),
    ],
  },
  bn: {
    title: 'JavaScript Event Loop',
    metaTitle: 'JavaScript Event Loop | Learn Computer Academy',
    metaDescription: 'কেন JavaScript শুধু একটি thread দিয়ে asynchronous কোড চালাতে পারে — call stack, task queue, আর event loop এদের কীভাবে সংযুক্ত করে।',
    blocks: [
      p('<hr><p>JavaScript একটি single thread-এ চলে — এটি একবারে শুধু একটা কাজ করতে পারে। তবুও একটি পেজ একই সাথে একটি network request, একটি timer, আর একটি click handler-এর জন্য অপেক্ষা করতে পারে, freeze না হয়েই। <b>Event loop</b> সেই mechanism যা এটা সম্ভব করে।</p><hr>'),
      h(2, 'Call Stack'),
      p('<p>প্রতিটি function call call stack-এ push হয়, আর return করলে pop হয়ে যায়। JavaScript stack-এর উপরে যা আছে শুধু সেটাই চালায়।</p>'),
      code('javascript', 'function greet() {\n  console.log(\'Hello\')\n}\ngreet()\n// greet() push হয়, চলে, তারপর pop হয়'),
      h(2, 'কেন setTimeout Block করে না', 'কেন-settimeout-block-করে-না'),
      p('<p><code>setTimeout</code>-এর মতো একটি function এর callback call stack-এ না, browser-এর হাতে দেয় — call stack বাকি script অবিলম্বে চালাতে থাকার জন্য মুক্ত থাকে।</p>'),
      code('javascript', 'console.log(\'1\')\nsetTimeout(() => console.log(\'2\'), 0)\nconsole.log(\'3\')\n\n// Output: 1, 3, 2 — 0ms delay দিয়েও,\n// callback call stack খালি না হওয়া পর্যন্ত অপেক্ষা করে'),
      h(2, 'Task Queue'),
      p('<p>একটি timer, network request, বা event fire হলে, এর callback সরাসরি call stack বাধা দেয় না — এটি একটি queue-তে অপেক্ষা করে। Event loop-এর কাজ সহজ: call stack খালি কিনা check করে, খালি হলে, queue-তে পরের callback-টা এর উপর move করে।</p>'),
      h(2, 'Microtask বনাম Macrotask', 'microtask-বনাম-macrotask'),
      p('<p>প্রতিটি queue হওয়া callback সমানভাবে treat হয় না। Promise callback একটি <b>microtask</b> queue-তে যায়, যা event loop <b>macrotask</b> queue (setTimeout, setInterval, DOM event) স্পর্শ করার আগে সবসময় পুরোপুরি খালি করে।</p>'),
      code('javascript', 'console.log(\'1\')\nsetTimeout(() => console.log(\'2 — macrotask\'), 0)\nPromise.resolve().then(() => console.log(\'3 — microtask\'))\nconsole.log(\'4\')\n\n// Output: 1, 4, 3, 2 — পরের macrotask-এর আগে microtask সবসময় চলে'),
      table(['Queue', 'উদাহরণ', 'অগ্রাধিকার'], [
        ['Microtask', 'Promise .then()/.catch(), async/await continuation', 'পরের macrotask-এর আগে পুরোপুরি খালি হয়'],
        ['Macrotask', 'setTimeout, setInterval, DOM event, I/O', 'প্রতি event loop cycle-এ একটা চলে'],
      ]),
      callout('tip', '<p>এই সাইটের Event Loop tool (Tools-এর নিচে) একটি কোডের জন্য call stack, task queue, আর microtask queue ধাপে ধাপে animate করে — শুধু ordering rule পড়ার চেয়ে intuition তৈরির অনেক দ্রুত উপায়।</p>', 'Interactively practice করুন'),
    ],
  },
})

// ═══ 2. RECURSION ═════════════════════════════════════════════════════════

lessons.push({
  slug: 'recursion', sortOrder: n++,
  en: {
    title: 'Recursion in JavaScript',
    metaTitle: 'Recursion in JavaScript | Learn Computer Academy',
    metaDescription: 'A function calling itself to solve a smaller version of the same problem — the base case, the call stack it builds, and when to reach for it.',
    blocks: [
      p('<hr><p>Recursion is a function solving a problem by calling itself with a smaller version of that same problem, until it reaches a version simple enough to answer directly.</p><hr>'),
      h(2, 'A Basic Example — Factorial'),
      code('javascript', 'function factorial(n) {\n  if (n <= 1) {\n    return 1          // base case — stops the recursion\n  }\n  return n * factorial(n - 1)   // recursive case\n}\n\nfactorial(5)   // 5 * 4 * 3 * 2 * 1 = 120'),
      h(2, 'The Base Case Is Not Optional'),
      p('<p>Without a condition that stops it, a recursive function calls itself forever — or more precisely, until the call stack runs out of room.</p>'),
      code('javascript', 'function countDown(n) {\n  // Missing base case — this never stops on its own\n  console.log(n)\n  countDown(n - 1)\n}\n// countDown(5) eventually throws:\n// "Maximum call stack size exceeded"'),
      callout('warning', '<p>Every recursive function needs a base case that\'s actually reachable — a base case that never triggers (a wrong comparison, an argument that never converges toward it) fails exactly the same way as no base case at all.</p>', 'The most common recursion bug'),
      h(2, 'What the Call Stack Looks Like'),
      p('<p>Each recursive call adds a new frame to the call stack (from the earlier Event Loop lesson) — the function doesn\'t actually finish until every deeper call it made has returned.</p>'),
      code('javascript', 'factorial(3)\n// factorial(3) calls factorial(2)\n//   factorial(2) calls factorial(1)\n//     factorial(1) returns 1\n//   factorial(2) returns 2 * 1 = 2\n// factorial(3) returns 3 * 2 = 6'),
      h(2, 'Recursion vs. a Loop'),
      table(['Recursion', 'A loop'], [
        ['Often reads more naturally for a problem that\'s naturally recursive (traversing a tree, nested data)', 'Usually faster and uses less memory for a simple repeated task'],
        ['Each call adds a call stack frame — deep recursion can hit a stack size limit', 'No stack depth concern regardless of how many iterations'],
      ]),
      callout('tip', '<p>This site\'s Recursion tool (under Tools) visualizes the call tree unwinding step by step for a piece of code — a clearer way to see what "each call waits for the next" actually looks like than tracing it by hand.</p>', 'Practice it interactively'),
    ],
  },
  bn: {
    title: 'JavaScript-এ Recursion',
    metaTitle: 'JavaScript-এ Recursion | Learn Computer Academy',
    metaDescription: 'একই সমস্যার একটি ছোট version সমাধান করতে নিজেকে call করা একটি function — base case, এটা যে call stack বানায়, আর কখন এটার জন্য যাবেন।',
    blocks: [
      p('<hr><p>Recursion মানে একটি function একই সমস্যার একটি ছোট version দিয়ে নিজেকে call করে সমস্যা সমাধান করে, যতক্ষণ না এটা সরাসরি উত্তর দেওয়ার মতো যথেষ্ট সহজ একটি version-এ পৌঁছায়।</p><hr>'),
      h(2, 'একটি মৌলিক উদাহরণ — Factorial', 'একটি-মৌলিক-উদাহরণ-factorial'),
      code('javascript', 'function factorial(n) {\n  if (n <= 1) {\n    return 1          // base case — recursion থামায়\n  }\n  return n * factorial(n - 1)   // recursive case\n}\n\nfactorial(5)   // 5 * 4 * 3 * 2 * 1 = 120'),
      h(2, 'Base Case Optional না', 'base-case-optional-না'),
      p('<p>এটা থামায় এমন একটি শর্ত ছাড়া, একটি recursive function চিরকাল নিজেকে call করে — বা আরো সঠিকভাবে, call stack-এর জায়গা শেষ না হওয়া পর্যন্ত।</p>'),
      code('javascript', 'function countDown(n) {\n  // base case নেই — এটা নিজে থেকে কখনো থামে না\n  console.log(n)\n  countDown(n - 1)\n}\n// countDown(5) শেষ পর্যন্ত throw করে:\n// "Maximum call stack size exceeded"'),
      callout('warning', '<p>প্রতিটি recursive function-এর সত্যিকারভাবে পৌঁছানো যায় এমন একটি base case দরকার — কখনো trigger না হওয়া একটি base case (একটি ভুল comparison, কখনো এর দিকে converge না করা একটি argument) কোনো base case না থাকার মতোই একই রকম ব্যর্থ হয়।</p>', 'সবচেয়ে common recursion bug'),
      h(2, 'Call Stack দেখতে কেমন', 'call-stack-দেখতে-কেমন'),
      p('<p>প্রতিটি recursive call call stack-এ (আগের Event Loop lesson থেকে) একটি নতুন frame যোগ করে — এটা যে গভীর call করেছে তার প্রতিটি return না হওয়া পর্যন্ত function আসলে শেষ হয় না।</p>'),
      code('javascript', 'factorial(3)\n// factorial(3) factorial(2)-কে call করে\n//   factorial(2) factorial(1)-কে call করে\n//     factorial(1) 1 return করে\n//   factorial(2) 2 * 1 = 2 return করে\n// factorial(3) 3 * 2 = 6 return করে'),
      h(2, 'Recursion বনাম একটি Loop', 'recursion-বনাম-একটি-loop'),
      table(['Recursion', 'একটি Loop'], [
        ['স্বাভাবিকভাবে recursive একটি সমস্যার জন্য (একটি tree traverse করা, nested data) প্রায়ই বেশি স্বাভাবিক দেখায়', 'একটি সহজ repeated কাজের জন্য সাধারণত দ্রুত আর কম memory ব্যবহার করে'],
        ['প্রতিটি call একটি call stack frame যোগ করে — গভীর recursion একটি stack size limit-এ পৌঁছাতে পারে', 'যত iteration-ই হোক না কেন কোনো stack depth উদ্বেগ নেই'],
      ]),
      callout('tip', '<p>এই সাইটের Recursion tool (Tools-এর নিচে) একটি কোডের জন্য call tree ধাপে ধাপে unwind হওয়া visualize করে — হাতে trace করার চেয়ে "প্রতিটি call পরেরটার জন্য অপেক্ষা করে" আসলে কেমন দেখতে তা দেখার একটি স্পষ্ট উপায়।</p>', 'Interactively practice করুন'),
    ],
  },
})

// ═══ 3. PROTOTYPES ═══════════════════════════════════════════════════════

lessons.push({
  slug: 'prototypes-and-prototypal-inheritance', sortOrder: n++,
  en: {
    title: 'Prototypes and Prototypal Inheritance',
    metaTitle: 'Prototypes and Prototypal Inheritance | Learn Computer Academy',
    metaDescription: 'What the class keyword is actually built on top of — the prototype chain that lets one object inherit properties and methods from another.',
    blocks: [
      p('<hr><p>The earlier Classes and OOP lesson used the <code>class</code> keyword — but underneath it, JavaScript objects don\'t use classes the way other languages do. They use <b>prototypes</b>, and <code>class</code> is really a friendlier syntax built on top of that older system.</p><hr>'),
      h(2, 'Every Object Has a Prototype'),
      p('<p>An object\'s prototype is another object it automatically looks up properties and methods on, when it doesn\'t have one of its own.</p>'),
      code('javascript', 'const animal = {\n  eats: true,\n}\n\nconst rabbit = Object.create(animal)   // rabbit\'s prototype is animal\nrabbit.jumps = true\n\nconsole.log(rabbit.jumps)   // true — rabbit\'s own property\nconsole.log(rabbit.eats)    // true — found on animal, its prototype'),
      h(2, 'The Prototype Chain'),
      p('<p>If a property isn\'t found on the prototype either, JavaScript keeps looking up the prototype\'s own prototype, and so on, until it reaches <code>null</code> — this chain is why it\'s called <b>prototypal</b> inheritance.</p>'),
      h(2, 'Where a Constructor Function\'s Methods Actually Live'),
      code('javascript', 'function Dog(name) {\n  this.name = name\n}\n\nDog.prototype.bark = function () {\n  console.log(`${this.name} says woof!`)\n}\n\nconst rex = new Dog(\'Rex\')\nrex.bark()   // "Rex says woof!" — found on Dog.prototype, not on rex itself'),
      h(2, 'class Is Prototypes, With Cleaner Syntax'),
      p('<p>A <code>class</code> method is stored on the prototype exactly the same way — <code>class</code> doesn\'t replace the prototype system, it\'s a more readable way to write to it.</p>'),
      code('javascript', 'class Dog {\n  constructor(name) {\n    this.name = name\n  }\n  bark() {\n    console.log(`${this.name} says woof!`)\n  }\n}\n\n// Behind the scenes, bark() lives on Dog.prototype — same as before\nconsole.log(typeof Dog.prototype.bark)   // "function"'),
      callout('note', '<p>Every object created from a class or constructor function shares one copy of each method on the prototype — this is why methods (unlike properties set in the constructor) don\'t take extra memory per object.</p>', 'Why methods live on the prototype, not each object'),
    ],
  },
  bn: {
    title: 'Prototype ও Prototypal Inheritance',
    metaTitle: 'Prototype ও Prototypal Inheritance | Learn Computer Academy',
    metaDescription: 'class keyword আসলে কীসের উপর তৈরি — একটি object-কে অন্য একটি থেকে property আর method inherit করতে দেওয়া prototype chain।',
    blocks: [
      p('<hr><p>আগের Classes and OOP lesson <code>class</code> keyword ব্যবহার করেছে — কিন্তু এর নিচে, JavaScript object অন্য ভাষার মতো class ব্যবহার করে না। এগুলো <b>prototype</b> ব্যবহার করে, আর <code>class</code> আসলে সেই পুরনো system-এর উপর তৈরি একটি বন্ধুত্বপূর্ণ সিনট্যাক্স।</p><hr>'),
      h(2, 'প্রতিটি Object-এর একটি Prototype আছে', 'প্রতিটি-object-এর-একটি-prototype-আছে'),
      p('<p>একটি object-এর prototype আরেকটি object যেখানে এটি স্বয়ংক্রিয়ভাবে property আর method খোঁজে, যখন এর নিজের একটা নেই।</p>'),
      code('javascript', 'const animal = {\n  eats: true,\n}\n\nconst rabbit = Object.create(animal)   // rabbit-এর prototype animal\nrabbit.jumps = true\n\nconsole.log(rabbit.jumps)   // true — rabbit-এর নিজের property\nconsole.log(rabbit.eats)    // true — animal-এ পাওয়া গেছে, এর prototype'),
      h(2, 'Prototype Chain'),
      p('<p>একটি property prototype-এও না পাওয়া গেলে, JavaScript prototype-এর নিজের prototype-এ খুঁজতে থাকে, এভাবে, <code>null</code>-এ পৌঁছানো পর্যন্ত — এই chain-এর কারণেই একে <b>prototypal</b> inheritance বলা হয়।</p>'),
      h(2, 'একটি Constructor Function-এর Method আসলে কোথায় থাকে', 'একটি-constructor-function-এর-method-আসলে-কোথায়-থাকে'),
      code('javascript', 'function Dog(name) {\n  this.name = name\n}\n\nDog.prototype.bark = function () {\n  console.log(`${this.name} says woof!`)\n}\n\nconst rex = new Dog(\'Rex\')\nrex.bark()   // "Rex says woof!" — Dog.prototype-এ পাওয়া গেছে, rex নিজে না'),
      h(2, 'class মানে Prototype, পরিষ্কার সিনট্যাক্স সহ', 'class-মানে-prototype-পরিষ্কার-সিনট্যাক্স-সহ'),
      p('<p>একটি <code>class</code> method ঠিক একইভাবে prototype-এ সংরক্ষিত হয় — <code>class</code> prototype system replace করে না, এটা এতে লেখার একটি বেশি readable উপায়।</p>'),
      code('javascript', 'class Dog {\n  constructor(name) {\n    this.name = name\n  }\n  bark() {\n    console.log(`${this.name} says woof!`)\n  }\n}\n\n// পেছনে, bark() থাকে Dog.prototype-এ — আগের মতোই\nconsole.log(typeof Dog.prototype.bark)   // "function"'),
      callout('note', '<p>একটি class বা constructor function থেকে তৈরি প্রতিটি object prototype-এর প্রতিটি method-এর একটা কপি শেয়ার করে — এই কারণেই method (constructor-এ সেট করা property-র মতো না) প্রতি object-এ অতিরিক্ত memory নেয় না।</p>', 'কেন method প্রতিটি object-এ না, prototype-এ থাকে'),
    ],
  },
})

// ═══ 4. GENERATORS & ITERATORS ═══════════════════════════════════════════

lessons.push({
  slug: 'generators-and-iterators', sortOrder: n++,
  en: {
    title: 'Generators and Iterators',
    metaTitle: 'Generators and Iterators | Learn Computer Academy',
    metaDescription: 'What makes for...of work on arrays and strings, and generator functions that can pause mid-execution and resume later.',
    blocks: [
      p('<hr><p>An <b>iterator</b> is what lets <code>for...of</code> and the spread operator work on something — a protocol any object can implement. A <b>generator</b> is a special kind of function that builds an iterator automatically, and can pause its own execution.</p><hr>'),
      h(2, 'What Makes Something Iterable'),
      p('<p>Arrays, strings, Maps, and Sets are all iterable — they implement <code>Symbol.iterator</code>, a method that returns an object with a <code>next()</code> method producing one value at a time.</p>'),
      code('javascript', 'const numbers = [10, 20, 30]\nconst iterator = numbers[Symbol.iterator]()\n\niterator.next()   // { value: 10, done: false }\niterator.next()   // { value: 20, done: false }\niterator.next()   // { value: 30, done: false }\niterator.next()   // { value: undefined, done: true }'),
      p('<p><code>for...of</code> is really just repeatedly calling <code>next()</code> under the hood, stopping when <code>done</code> becomes <code>true</code>.</p>'),
      h(2, 'A Generator Function — function*'),
      p('<p>A generator, marked with <code>function*</code>, pauses at every <code>yield</code> and resumes exactly where it left off the next time it\'s called.</p>'),
      code('javascript', 'function* countUpTo(max) {\n  let count = 1\n  while (count <= max) {\n    yield count\n    count++\n  }\n}\n\nconst counter = countUpTo(3)\ncounter.next()   // { value: 1, done: false }\ncounter.next()   // { value: 2, done: false }\ncounter.next()   // { value: 3, done: false }\ncounter.next()   // { value: undefined, done: true }'),
      h(2, 'A Generator Is Iterable Too'),
      p('<p>Since a generator automatically implements the iterator protocol, it works directly with <code>for...of</code> and the spread operator.</p>'),
      code('javascript', 'for (const n of countUpTo(3)) {\n  console.log(n)   // 1, 2, 3\n}\n\n[...countUpTo(3)]   // [1, 2, 3]'),
      h(2, 'A Practical Use — Lazy, On-Demand Values'),
      p('<p>Because a generator only computes the next value when asked, it can represent a sequence too large — or infinite — to build all at once.</p>'),
      code('javascript', 'function* infiniteIds() {\n  let id = 1\n  while (true) {\n    yield id++\n  }\n}\n\nconst ids = infiniteIds()\nids.next().value   // 1\nids.next().value   // 2\n// never actually builds an infinite array — just produces one value at a time'),
      callout('tip', '<p>A generator\'s pause-and-resume behavior is also the mechanism async/await is built on top of, conceptually — both let a function stop mid-execution and continue later without blocking anything else.</p>', 'The connection to async/await'),
    ],
  },
  bn: {
    title: 'Generator ও Iterator',
    metaTitle: 'Generator ও Iterator | Learn Computer Academy',
    metaDescription: 'যা array আর string-এ for...of কাজ করায়, আর generator function যা execution-এর মাঝে থামতে আর পরে resume করতে পারে।',
    blocks: [
      p('<hr><p>একটি <b>iterator</b> হলো যা কিছুতে <code>for...of</code> আর spread operator কাজ করায় — যেকোনো object implement করতে পারে এমন একটি protocol। একটি <b>generator</b> একটি বিশেষ ধরনের function যা স্বয়ংক্রিয়ভাবে একটি iterator বানায়, আর নিজের execution থামাতে পারে।</p><hr>'),
      h(2, 'কী একটি জিনিসকে Iterable বানায়', 'কী-একটি-জিনিসকে-iterable-বানায়'),
      p('<p>Array, string, Map, আর Set সবই iterable — এগুলো <code>Symbol.iterator</code> implement করে, একটি method যা একবারে একটা মান তৈরি করা একটি <code>next()</code> method সহ একটি object return করে।</p>'),
      code('javascript', 'const numbers = [10, 20, 30]\nconst iterator = numbers[Symbol.iterator]()\n\niterator.next()   // { value: 10, done: false }\niterator.next()   // { value: 20, done: false }\niterator.next()   // { value: 30, done: false }\niterator.next()   // { value: undefined, done: true }'),
      p('<p><code>for...of</code> আসলে পেছনে বারবার <code>next()</code> call করা, <code>done</code> <code>true</code> হলে থামে।</p>'),
      h(2, 'একটি Generator Function — function*', 'একটি-generator-function-function'),
      p('<p><code>function*</code> দিয়ে চিহ্নিত একটি generator প্রতিটি <code>yield</code>-এ থামে আর পরের বার call হলে ঠিক যেখানে ছেড়েছিল সেখান থেকে resume করে।</p>'),
      code('javascript', 'function* countUpTo(max) {\n  let count = 1\n  while (count <= max) {\n    yield count\n    count++\n  }\n}\n\nconst counter = countUpTo(3)\ncounter.next()   // { value: 1, done: false }\ncounter.next()   // { value: 2, done: false }\ncounter.next()   // { value: 3, done: false }\ncounter.next()   // { value: undefined, done: true }'),
      h(2, 'একটি Generator-ও Iterable', 'একটি-generator-ও-iterable'),
      p('<p>একটি generator স্বয়ংক্রিয়ভাবে iterator protocol implement করে বলে, এটা সরাসরি <code>for...of</code> আর spread operator-এর সাথে কাজ করে।</p>'),
      code('javascript', 'for (const n of countUpTo(3)) {\n  console.log(n)   // 1, 2, 3\n}\n\n[...countUpTo(3)]   // [1, 2, 3]'),
      h(2, 'একটি Practical ব্যবহার — Lazy, On-Demand মান', 'একটি-practical-ব্যবহার-lazy-on-demand-মান'),
      p('<p>একটি generator শুধু চাওয়া হলে পরের মান হিসাব করে বলে, এটা একবারে বানানোর জন্য অনেক বড় — বা infinite — একটি sequence represent করতে পারে।</p>'),
      code('javascript', 'function* infiniteIds() {\n  let id = 1\n  while (true) {\n    yield id++\n  }\n}\n\nconst ids = infiniteIds()\nids.next().value   // 1\nids.next().value   // 2\n// আসলে কখনো একটি infinite array বানায় না — শুধু একবারে একটা মান তৈরি করে'),
      callout('tip', '<p>একটি generator-এর pause-and-resume behavior conceptually async/await-এর ভিত্তির mechanism-ও — দুটোই একটি function-কে execution-এর মাঝে থামতে আর অন্য কিছু block না করে পরে চালিয়ে যেতে দেয়।</p>', 'async/await-এর সাথে সংযোগ'),
    ],
  },
})

// ═══ 5. MAP, SET, WEAKMAP, WEAKSET ═══════════════════════════════════════

lessons.push({
  slug: 'maps-and-sets', sortOrder: n++,
  en: {
    title: 'Map, Set, WeakMap, and WeakSet',
    metaTitle: 'JavaScript Map and Set | Learn Computer Academy',
    metaDescription: 'Four built-in data structures beyond plain objects and arrays — a Map for any-type keys, a Set for unique values, and their memory-friendly Weak variants.',
    blocks: [
      p('<hr><p>A plain object and array cover most needs, but four more built-in structures solve specific problems neither one does well.</p><hr>'),
      h(2, 'Map — Keys of Any Type'),
      p('<p>A plain object\'s keys are always converted to strings. A <code>Map</code> allows a key of any type — an object, a function, even another Map.</p>'),
      code('javascript', 'const userRoles = new Map()\nconst user1 = { name: \'Sam\' }\n\nuserRoles.set(user1, \'admin\')\nuserRoles.set(\'guest\', \'viewer\')\n\nuserRoles.get(user1)     // "admin"\nuserRoles.size           // 2\n\nfor (const [key, value] of userRoles) {\n  console.log(key, value)\n}'),
      h(2, 'Set — Unique Values Only'),
      p('<p>A <code>Set</code> stores a list of values with duplicates automatically removed.</p>'),
      code('javascript', 'const uniqueTags = new Set([\'js\', \'css\', \'js\', \'html\', \'css\'])\nconsole.log(uniqueTags)       // Set(3) { \'js\', \'css\', \'html\' }\nconsole.log(uniqueTags.size)  // 3\n\nuniqueTags.add(\'react\')\nuniqueTags.has(\'css\')          // true\nuniqueTags.delete(\'html\')'),
      h(2, 'A Practical Use for Set — Deduplicating an Array'),
      code('javascript', 'const numbers = [1, 2, 2, 3, 3, 3]\nconst unique = [...new Set(numbers)]\n// [1, 2, 3]'),
      h(2, 'WeakMap and WeakSet'),
      p('<p><code>WeakMap</code> and <code>WeakSet</code> work like their non-weak counterparts, but only accept objects as keys/values, and don\'t prevent those objects from being garbage collected (covered in the earlier Memory Management lesson) once nothing else references them. This makes them useful for attaching extra data to an object without causing a memory leak.</p>'),
      code('javascript', 'const cache = new WeakMap()\n\nfunction process(obj) {\n  if (cache.has(obj)) return cache.get(obj)\n  const result = expensiveComputation(obj)\n  cache.set(obj, result)\n  return result\n}\n// If obj is later discarded elsewhere in the code,\n// its cache entry can be garbage collected too — a regular Map would hold it forever'),
      table(['Structure', 'Keys/values', 'Iterable?', 'Prevents garbage collection?'], [
        ['Map', 'Any type', 'Yes', 'Yes'],
        ['Set', 'Any type (values only)', 'Yes', 'Yes'],
        ['WeakMap', 'Objects only', 'No', 'No'],
        ['WeakSet', 'Objects only', 'No', 'No'],
      ]),
    ],
  },
  bn: {
    title: 'Map, Set, WeakMap, ও WeakSet',
    metaTitle: 'JavaScript Map ও Set | Learn Computer Academy',
    metaDescription: 'সাধারণ object আর array-র বাইরে চারটি built-in data structure — যেকোনো-type key-র জন্য একটি Map, unique মানের জন্য একটি Set, আর এদের memory-বান্ধব Weak variant।',
    blocks: [
      p('<hr><p>একটি সাধারণ object আর array বেশিরভাগ দরকার মেটায়, কিন্তু আরো চারটি built-in structure নির্দিষ্ট সমস্যা সমাধান করে যা কোনোটাই ভালোভাবে করে না।</p><hr>'),
      h(2, 'Map — যেকোনো Type-এর Key', 'map-যেকোনো-type-এর-key'),
      p('<p>একটি সাধারণ object-এর key সবসময় string-এ রূপান্তরিত হয়। একটি <code>Map</code> যেকোনো type-এর key অনুমতি দেয় — একটি object, একটি function, এমনকি আরেকটি Map।</p>'),
      code('javascript', 'const userRoles = new Map()\nconst user1 = { name: \'Sam\' }\n\nuserRoles.set(user1, \'admin\')\nuserRoles.set(\'guest\', \'viewer\')\n\nuserRoles.get(user1)     // "admin"\nuserRoles.size           // 2\n\nfor (const [key, value] of userRoles) {\n  console.log(key, value)\n}'),
      h(2, 'Set — শুধু Unique মান', 'set-শুধু-unique-মান'),
      p('<p>একটি <code>Set</code> ডুপ্লিকেট স্বয়ংক্রিয়ভাবে সরিয়ে মানের একটি list সংরক্ষণ করে।</p>'),
      code('javascript', 'const uniqueTags = new Set([\'js\', \'css\', \'js\', \'html\', \'css\'])\nconsole.log(uniqueTags)       // Set(3) { \'js\', \'css\', \'html\' }\nconsole.log(uniqueTags.size)  // 3\n\nuniqueTags.add(\'react\')\nuniqueTags.has(\'css\')          // true\nuniqueTags.delete(\'html\')'),
      h(2, 'Set-এর একটি Practical ব্যবহার — একটি Array Deduplicate করা', 'set-এর-একটি-practical-ব্যবহার-একটি-array-deduplicate-করা'),
      code('javascript', 'const numbers = [1, 2, 2, 3, 3, 3]\nconst unique = [...new Set(numbers)]\n// [1, 2, 3]'),
      h(2, 'WeakMap ও WeakSet'),
      p('<p><code>WeakMap</code> আর <code>WeakSet</code> এদের non-weak সমতুল্যর মতোই কাজ করে, কিন্তু শুধু object-কে key/value হিসেবে accept করে, আর অন্য কিছু আর reference না করলে সেই object-গুলোকে garbage collected হতে (আগের Memory Management lesson-এ কভার করা) বাধা দেয় না। এটা এদের memory leak না ঘটিয়ে একটি object-এ অতিরিক্ত data যুক্ত করার জন্য useful বানায়।</p>'),
      code('javascript', 'const cache = new WeakMap()\n\nfunction process(obj) {\n  if (cache.has(obj)) return cache.get(obj)\n  const result = expensiveComputation(obj)\n  cache.set(obj, result)\n  return result\n}\n// obj পরে কোডের অন্য জায়গায় discard হলে,\n// এর cache entry-ও garbage collected হতে পারে — একটি সাধারণ Map এটা চিরকাল ধরে রাখত'),
      table(['Structure', 'Key/value', 'Iterable?', 'Garbage collection আটকায়?'], [
        ['Map', 'যেকোনো type', 'হ্যাঁ', 'হ্যাঁ'],
        ['Set', 'যেকোনো type (শুধু value)', 'হ্যাঁ', 'হ্যাঁ'],
        ['WeakMap', 'শুধু object', 'না', 'না'],
        ['WeakSet', 'শুধু object', 'না', 'না'],
      ]),
    ],
  },
})

// ═══ 6. REST & SPREAD OPERATORS ═══════════════════════════════════════════

lessons.push({
  slug: 'rest-and-spread-operators', sortOrder: n++,
  en: {
    title: 'Rest and Spread Operators',
    metaTitle: 'JavaScript Rest and Spread Operators | Learn Computer Academy',
    metaDescription: 'The same ... syntax doing two opposite jobs — collecting multiple values into an array, or expanding an array into individual values.',
    blocks: [
      p('<hr><p>The <code>...</code> syntax does one of two opposite things depending on where it\'s used: <b>rest</b> collects several values into one array, <b>spread</b> expands one array (or object) into several values.</p><hr>'),
      h(2, 'Rest Parameters — Collecting Function Arguments'),
      p('<p>Gathers any number of remaining arguments into a real array — a modern replacement for the older, array-like <code>arguments</code> object.</p>'),
      code('javascript', 'function sum(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0)\n}\n\nsum(1, 2, 3)        // 6\nsum(1, 2, 3, 4, 5)  // 15'),
      h(2, 'Rest in Destructuring'),
      code('javascript', 'const [first, ...rest] = [10, 20, 30, 40]\nfirst   // 10\nrest    // [20, 30, 40]\n\nconst { name, ...otherFields } = { name: \'Sam\', age: 28, city: \'Delhi\' }\notherFields   // { age: 28, city: \'Delhi\' }'),
      h(2, 'Spread — Expanding an Array'),
      code('javascript', 'const a = [1, 2, 3]\nconst b = [4, 5, 6]\nconst combined = [...a, ...b]\n// [1, 2, 3, 4, 5, 6]\n\nMath.max(...a)   // 3 — spreads the array into separate arguments'),
      h(2, 'Spread — Copying and Merging Objects'),
      code('javascript', 'const defaults = { theme: \'light\', fontSize: 16 }\nconst userPrefs = { fontSize: 20 }\n\nconst settings = { ...defaults, ...userPrefs }\n// { theme: \'light\', fontSize: 20 } — later keys override earlier ones'),
      table(['Context', 'Meaning'], [
        ['...args in a function parameter list', 'Rest — collects arguments into an array'],
        ['...arr inside an array or function call', 'Spread — expands an array into individual values'],
        ['...obj inside an object literal', 'Spread — copies an object\'s own properties'],
      ]),
      callout('tip', '<p>Object spread (<code>{ ...original, updatedField: value }</code>) is the standard way to update state immutably in React and similar frameworks — worth being comfortable with this syntax before that course.</p>', 'Where this shows up next'),
    ],
  },
  bn: {
    title: 'Rest ও Spread Operator',
    metaTitle: 'JavaScript Rest ও Spread Operator | Learn Computer Academy',
    metaDescription: 'একই ... সিনট্যাক্স দুটো বিপরীত কাজ করছে — একাধিক মানকে একটি array-তে সংগ্রহ করা, বা একটি array-কে আলাদা মানে expand করা।',
    blocks: [
      p('<hr><p><code>...</code> সিনট্যাক্স কোথায় ব্যবহৃত হচ্ছে তার উপর নির্ভর করে দুটো বিপরীত কাজের একটা করে: <b>rest</b> বেশ কয়েকটা মানকে একটি array-তে সংগ্রহ করে, <b>spread</b> একটি array-কে (বা object) বেশ কয়েকটা মানে expand করে।</p><hr>'),
      h(2, 'Rest Parameter — Function Argument সংগ্রহ করা', 'rest-parameter-function-argument-সংগ্রহ-করা'),
      p('<p>বাকি যেকোনো সংখ্যক argument একটি আসল array-তে জড়ো করে — পুরনো, array-এর মতো <code>arguments</code> object-এর একটি modern replacement।</p>'),
      code('javascript', 'function sum(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0)\n}\n\nsum(1, 2, 3)        // 6\nsum(1, 2, 3, 4, 5)  // 15'),
      h(2, 'Destructuring-এ Rest', 'destructuring-এ-rest'),
      code('javascript', 'const [first, ...rest] = [10, 20, 30, 40]\nfirst   // 10\nrest    // [20, 30, 40]\n\nconst { name, ...otherFields } = { name: \'Sam\', age: 28, city: \'Delhi\' }\notherFields   // { age: 28, city: \'Delhi\' }'),
      h(2, 'Spread — একটি Array Expand করা', 'spread-একটি-array-expand-করা'),
      code('javascript', 'const a = [1, 2, 3]\nconst b = [4, 5, 6]\nconst combined = [...a, ...b]\n// [1, 2, 3, 4, 5, 6]\n\nMath.max(...a)   // 3 — array-কে আলাদা argument-এ spread করে'),
      h(2, 'Spread — Object Copy ও Merge করা', 'spread-object-copy-ও-merge-করা'),
      code('javascript', 'const defaults = { theme: \'light\', fontSize: 16 }\nconst userPrefs = { fontSize: 20 }\n\nconst settings = { ...defaults, ...userPrefs }\n// { theme: \'light\', fontSize: 20 } — পরের key আগেরটাকে override করে'),
      table(['Context', 'মানে'], [
        ['একটি function parameter list-এ ...args', 'Rest — argument-কে একটি array-তে সংগ্রহ করে'],
        ['একটি array বা function call-এর ভেতরে ...arr', 'Spread — একটি array-কে আলাদা মানে expand করে'],
        ['একটি object literal-এর ভেতরে ...obj', 'Spread — একটি object-এর নিজের property copy করে'],
      ]),
      callout('tip', '<p>Object spread (<code>{ ...original, updatedField: value }</code>) React আর অনুরূপ framework-এ immutably state আপডেট করার standard উপায় — সেই কোর্সের আগে এই সিনট্যাক্সে স্বাচ্ছন্দ্য থাকার যোগ্য।</p>', 'এটা পরে কোথায় দেখা যায়'),
    ],
  },
})

// ═══ 7. MEMORY MANAGEMENT & GARBAGE COLLECTION ═══════════════════════════

lessons.push({
  slug: 'memory-management-and-garbage-collection', sortOrder: n++,
  en: {
    title: 'Memory Management and Garbage Collection',
    metaTitle: 'JavaScript Memory Management | Learn Computer Academy',
    metaDescription: "How JavaScript allocates and frees memory automatically, and the common patterns that accidentally prevent memory from ever being freed.",
    blocks: [
      p('<hr><p>Unlike some languages, JavaScript never requires manually freeing memory — a <b>garbage collector</b> does it automatically. Understanding roughly how it decides what to free explains most real-world memory leaks.</p><hr>'),
      h(2, 'The Memory Lifecycle'),
      table(['Step', 'What happens'], [
        ['Allocate', 'Memory is reserved when a value is created — a variable, an object, a function'],
        ['Use', 'The program reads and writes to that memory'],
        ['Release', 'The garbage collector frees the memory once nothing can reach it anymore'],
      ]),
      h(2, 'Reachability — How the Garbage Collector Decides'),
      p('<p>An object is kept in memory as long as it\'s <b>reachable</b> — reachable directly or indirectly from a "root" (global variables, the current call stack). The instant nothing references an object anymore, it becomes eligible for collection.</p>'),
      code('javascript', 'let user = { name: \'Sam\' }   // the object is reachable via \'user\'\nuser = null                    // nothing references the object anymore —\n                                // eligible for garbage collection'),
      h(2, 'A Common Leak — Forgotten Timers'),
      p('<p>A running <code>setInterval</code> keeps everything its callback references reachable, indefinitely, until explicitly cleared — even if the code that created it is long gone.</p>'),
      code('javascript', '// LEAK — this interval, and everything it closes over, never gets freed\nfunction startPolling() {\n  const data = fetchLargeDataset()\n  setInterval(() => {\n    console.log(data.length)\n  }, 1000)\n}\n\n// FIXED — store the interval ID and clear it when it\'s no longer needed\nfunction startPolling() {\n  const data = fetchLargeDataset()\n  const intervalId = setInterval(() => {\n    console.log(data.length)\n  }, 1000)\n  return () => clearInterval(intervalId)\n}'),
      h(2, 'A Common Leak — Detached DOM References'),
      p('<p>A removed DOM element still can\'t be garbage collected if a variable somewhere still references it.</p>'),
      code('javascript', 'let cachedButton = document.querySelector(\'#submit\')\ncachedButton.remove()   // removed from the page, but NOT freed —\n                        // cachedButton still references it\n\ncachedButton = null     // now it can actually be collected'),
      h(2, 'A Common Leak — Forgotten Event Listeners'),
      code('javascript', 'element.addEventListener(\'click\', handleClick)\n// If element is removed from the DOM without also calling:\nelement.removeEventListener(\'click\', handleClick)\n// the listener (and anything handleClick closes over) can stay in memory'),
      callout('tip', '<p>The Memory tab in browser DevTools can take a heap snapshot and compare it over time — a growing number of detached DOM nodes between snapshots is the clearest practical sign of a real leak.</p>', 'Checking for a leak in practice'),
    ],
  },
  bn: {
    title: 'Memory Management ও Garbage Collection',
    metaTitle: 'JavaScript Memory Management | Learn Computer Academy',
    metaDescription: 'JavaScript কীভাবে স্বয়ংক্রিয়ভাবে memory allocate আর free করে, আর common pattern যা ভুলবশত memory কখনো free হতে বাধা দেয়।',
    blocks: [
      p('<hr><p>কিছু ভাষার মতো না, JavaScript-এ কখনো হাতে memory free করার দরকার হয় না — একটি <b>garbage collector</b> স্বয়ংক্রিয়ভাবে এটা করে। এটা কী free করবে মোটামুটি কীভাবে ঠিক করে তা বোঝা বেশিরভাগ real-world memory leak ব্যাখ্যা করে।</p><hr>'),
      h(2, 'Memory Lifecycle'),
      table(['ধাপ', 'কী ঘটে'], [
        ['Allocate', 'একটি মান তৈরি হলে memory সংরক্ষিত হয় — একটি variable, একটি object, একটি function'],
        ['Use', 'Program সেই memory পড়ে আর লেখে'],
        ['Release', 'কিছু আর এটা পৌঁছাতে না পারলে garbage collector memory free করে'],
      ]),
      h(2, 'Reachability — Garbage Collector কীভাবে ঠিক করে', 'reachability-garbage-collector-কীভাবে-ঠিক-করে'),
      p('<p>একটি object memory-তে থাকে যতক্ষণ এটা <b>reachable</b> — একটি "root" (global variable, বর্তমান call stack) থেকে সরাসরি বা পরোক্ষভাবে reachable। কিছু আর একটি object reference না করা মাত্র, এটা collection-এর যোগ্য হয়ে যায়।</p>'),
      code('javascript', 'let user = { name: \'Sam\' }   // object \'user\'-এর মাধ্যমে reachable\nuser = null                    // কিছুই আর object-টা reference করে না —\n                                // garbage collection-এর যোগ্য'),
      h(2, 'একটি Common Leak — ভুলে যাওয়া Timer', 'একটি-common-leak-ভুলে-যাওয়া-timer'),
      p('<p>একটি চলমান <code>setInterval</code> স্পষ্টভাবে clear না করা পর্যন্ত এর callback reference করা সবকিছুকে অনির্দিষ্টকালের জন্য reachable রাখে — এটা তৈরি করা কোড অনেক আগে চলে গেলেও।</p>'),
      code('javascript', '// LEAK — এই interval, আর এটা close over করা সবকিছু, কখনো free হয় না\nfunction startPolling() {\n  const data = fetchLargeDataset()\n  setInterval(() => {\n    console.log(data.length)\n  }, 1000)\n}\n\n// FIXED — interval ID সংরক্ষণ করুন আর আর দরকার না হলে clear করুন\nfunction startPolling() {\n  const data = fetchLargeDataset()\n  const intervalId = setInterval(() => {\n    console.log(data.length)\n  }, 1000)\n  return () => clearInterval(intervalId)\n}'),
      h(2, 'একটি Common Leak — Detached DOM Reference', 'একটি-common-leak-detached-dom-reference'),
      p('<p>কোথাও একটি variable এখনো এটা reference করলে একটি সরানো DOM element এখনো garbage collected হতে পারে না।</p>'),
      code('javascript', 'let cachedButton = document.querySelector(\'#submit\')\ncachedButton.remove()   // পেজ থেকে সরানো, কিন্তু free না —\n                        // cachedButton এখনো এটা reference করে\n\ncachedButton = null     // এখন এটা আসলে collect করা যায়'),
      h(2, 'একটি Common Leak — ভুলে যাওয়া Event Listener', 'একটি-common-leak-ভুলে-যাওয়া-event-listener'),
      code('javascript', 'element.addEventListener(\'click\', handleClick)\n// element DOM থেকে সরানো হলে এটাও call না করে:\nelement.removeEventListener(\'click\', handleClick)\n// listener (আর handleClick close over করা যেকোনো কিছু) memory-তে থেকে যেতে পারে'),
      callout('tip', '<p>Browser DevTools-এর Memory tab একটি heap snapshot নিতে পারে আর সময়ের সাথে তুলনা করতে পারে — snapshot-এর মধ্যে detached DOM node-এর বাড়তে থাকা সংখ্যা একটি আসল leak-এর সবচেয়ে স্পষ্ট practical চিহ্ন।</p>', 'বাস্তবে একটি leak check করা'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'javascript').single()
  if (catErr || !category) {
    console.error('Category "javascript" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] javascript/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] javascript/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `javascript/${lesson.slug}`
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
