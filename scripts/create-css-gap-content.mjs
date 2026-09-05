#!/usr/bin/env node
// Extends the existing "CSS" category (35 migrated lessons) with 14 more
// lessons covering real gaps found against a roadmap.sh "CSS" roadmap PDF
// the user shared 2026-09-03 — asked "are everything in this document
// regarding css covered". Checked actual lesson content (not just keyword
// mentions) before concluding a gap — e.g. "transform:" only ever appeared
// once, inside css/align, as a one-off translate() centering trick, never
// taught as its own topic; "attribute selector" appeared only as a passing
// mention inside css/form, never a dedicated lesson.
//
// This is the single biggest gap of the three PDFs checked this session —
// the CSS category (2026-07-era migrated content) never covers Flexbox,
// Grid, Transitions, Animations, Transforms, Media Queries, CSS Variables,
// or calc()/clamp() functions at all, despite the site shipping dedicated
// Flexbox Playground / Grid Generator / Animation / Clamp *tools* that
// assume this knowledge. User picked "build major + minor, all ~14" over
// AskUserQuestion — everything found except the PDF's own separate
// "Continue Learning" advanced tracks (Sass, BEM, PostCSS, CSS-in-JS, CSS
// Modules), which are out of core-CSS scope.
//
// Style: matches the terse, W3Schools-style tone of the rest of this
// migrated category (short paragraphs, one heading + one code example per
// property/value, minimal callouts) — extending old content, not
// authoring a new course. Bengali matches that category's script-
// transliteration convention (technical terms in Bengali script, property
// names/values kept in English/code) per css/positioning.
//
// sort_order continues from 36 (existing max is 35).
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-css-gap-content.mjs [--dry-run]

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
let n = 36

// ═══ 1. FLEXBOX ═══════════════════════════════════════════════════════════

lessons.push({
  slug: 'flexbox', sortOrder: n++,
  en: {
    title: 'CSS Flexbox',
    metaTitle: 'CSS Flexbox | Learn Computer Academy',
    metaDescription: 'The flexbox layout model — container and item properties for arranging elements in a row or column, with even spacing and alignment.',
    blocks: [
      p('<hr><p>Flexbox is a one-dimensional layout model — it arranges items in a single row or column, and makes spacing, alignment, and reordering them far easier than the older float-based layout in earlier lessons.</p><hr>'),
      h(2, 'Creating a Flex Container'),
      p('<p>Set <code>display: flex</code> on a parent element to turn its direct children into flex items.</p>'),
      code('css', '.container {\n  display: flex;\n}'),
      h(2, 'flex-direction'),
      p('<p>Controls whether items lay out in a row or a column.</p>'),
      code('css', '.container {\n  flex-direction: row;          /* default — left to right */\n  flex-direction: row-reverse;\n  flex-direction: column;        /* top to bottom */\n  flex-direction: column-reverse;\n}'),
      h(2, 'justify-content'),
      p('<p>Aligns items along the main axis (horizontally, for a row).</p>'),
      code('css', '.container {\n  justify-content: flex-start;    /* default */\n  justify-content: flex-end;\n  justify-content: center;\n  justify-content: space-between;\n  justify-content: space-around;\n  justify-content: space-evenly;\n}'),
      h(2, 'align-items'),
      p('<p>Aligns items along the cross axis (vertically, for a row).</p>'),
      code('css', '.container {\n  align-items: stretch;    /* default — fills the container height */\n  align-items: flex-start;\n  align-items: flex-end;\n  align-items: center;\n  align-items: baseline;\n}'),
      h(2, 'flex-wrap'),
      p('<p>Items shrink to fit on one line by default. <code>flex-wrap: wrap</code> lets them wrap onto multiple lines instead.</p>'),
      code('css', '.container {\n  flex-wrap: nowrap;    /* default */\n  flex-wrap: wrap;\n}'),
      h(2, 'gap'),
      p('<p>Adds space between flex items, without needing margin on each individual item.</p>'),
      code('css', '.container {\n  display: flex;\n  gap: 16px;\n}'),
      h(2, 'Item Properties — flex-grow, flex-shrink, flex-basis'),
      table(['Property', 'What it does'], [
        ['flex-grow', 'How much an item grows to fill extra space, relative to other items (default 0)'],
        ['flex-shrink', 'How much an item shrinks when there isn\'t enough space (default 1)'],
        ['flex-basis', 'The item\'s starting size before growing or shrinking (default auto)'],
      ]),
      code('css', '.item {\n  flex-grow: 1;\n  flex-shrink: 1;\n  flex-basis: 200px;\n\n  /* often written as shorthand: */\n  flex: 1 1 200px;\n}'),
      h(2, 'align-self and order'),
      p('<p><code>align-self</code> overrides <code>align-items</code> for one specific item. <code>order</code> changes the visual order of items without touching the HTML.</p>'),
      code('css', '.item-featured {\n  align-self: center;\n  order: -1;    /* moves this item first */\n}'),
      callout('tip', '<p>This site\'s Flexbox Playground tool (under Tools) lets you drag values for every property on this page and see the layout update live — a faster way to build intuition than reading code alone.</p>', 'Practice it interactively'),
    ],
  },
  bn: {
    title: 'CSS Flexbox',
    metaTitle: 'CSS Flexbox | Learn Computer Academy',
    metaDescription: 'Flexbox layout model — একটি row বা column-এ এলিমেন্ট সাজানোর জন্য container আর item প্রপার্টি, সমান spacing আর alignment সহ।',
    blocks: [
      p('<hr><p>Flexbox একটি one-dimensional layout model — এটি item-কে একটি একক row বা column-এ সাজায়, আর আগের lesson-এর পুরনো float-ভিত্তিক layout-এর চেয়ে spacing, alignment, আর reorder করা অনেক সহজ করে।</p><hr>'),
      h(2, 'একটি Flex Container তৈরি করা', 'একটি-flex-container-তৈরি-করা'),
      p('<p>একটি parent এলিমেন্টের সরাসরি child-দের flex item বানাতে <code>display: flex</code> সেট করুন।</p>'),
      code('css', '.container {\n  display: flex;\n}'),
      h(2, 'flex-direction'),
      p('<p>item row-এ না column-এ layout হবে তা নিয়ন্ত্রণ করে।</p>'),
      code('css', '.container {\n  flex-direction: row;          /* default — বাম থেকে ডান */\n  flex-direction: row-reverse;\n  flex-direction: column;        /* উপর থেকে নিচ */\n  flex-direction: column-reverse;\n}'),
      h(2, 'justify-content'),
      p('<p>main axis বরাবর item align করে (একটি row-এর জন্য horizontally)।</p>'),
      code('css', '.container {\n  justify-content: flex-start;    /* default */\n  justify-content: flex-end;\n  justify-content: center;\n  justify-content: space-between;\n  justify-content: space-around;\n  justify-content: space-evenly;\n}'),
      h(2, 'align-items'),
      p('<p>cross axis বরাবর item align করে (একটি row-এর জন্য vertically)।</p>'),
      code('css', '.container {\n  align-items: stretch;    /* default — container height ভরে দেয় */\n  align-items: flex-start;\n  align-items: flex-end;\n  align-items: center;\n  align-items: baseline;\n}'),
      h(2, 'flex-wrap'),
      p('<p>Item default-এ এক লাইনে ফিট করতে সংকুচিত হয়। <code>flex-wrap: wrap</code> এগুলোকে একাধিক লাইনে wrap হতে দেয়।</p>'),
      code('css', '.container {\n  flex-wrap: nowrap;    /* default */\n  flex-wrap: wrap;\n}'),
      h(2, 'gap'),
      p('<p>প্রতিটি item-এ আলাদা margin না দিয়েই flex item-গুলোর মধ্যে space যোগ করে।</p>'),
      code('css', '.container {\n  display: flex;\n  gap: 16px;\n}'),
      h(2, 'Item প্রপার্টি — flex-grow, flex-shrink, flex-basis', 'item-প্রপার্টি-flex-grow-flex-shrink-flex-basis'),
      table(['প্রপার্টি', 'এটা কী করে'], [
        ['flex-grow', 'অন্য item-এর তুলনায় একটি item কতটা বেড়ে অতিরিক্ত জায়গা পূরণ করে (default 0)'],
        ['flex-shrink', 'যথেষ্ট জায়গা না থাকলে একটি item কতটা সংকুচিত হয় (default 1)'],
        ['flex-basis', 'বাড়া বা সংকুচিত হওয়ার আগে item-এর শুরুর আকার (default auto)'],
      ]),
      code('css', '.item {\n  flex-grow: 1;\n  flex-shrink: 1;\n  flex-basis: 200px;\n\n  /* প্রায়ই shorthand হিসেবে লেখা হয়: */\n  flex: 1 1 200px;\n}'),
      h(2, 'align-self ও order', 'align-self-ও-order'),
      p('<p><code>align-self</code> একটি নির্দিষ্ট item-এর জন্য <code>align-items</code>-কে override করে। <code>order</code> HTML স্পর্শ না করেই item-এর visual ক্রম বদলায়।</p>'),
      code('css', '.item-featured {\n  align-self: center;\n  order: -1;    /* এই item-কে প্রথমে নিয়ে যায় */\n}'),
      callout('tip', '<p>এই সাইটের Flexbox Playground tool (Tools-এর নিচে) আপনাকে এই পেজের প্রতিটি প্রপার্টির মান drag করতে দেয় আর live layout আপডেট দেখতে দেয় — শুধু কোড পড়ার চেয়ে intuition তৈরির দ্রুত উপায়।</p>', 'Interactively practice করুন'),
    ],
  },
})

// ═══ 2. GRID ═══════════════════════════════════════════════════════════════

lessons.push({
  slug: 'grid', sortOrder: n++,
  en: {
    title: 'CSS Grid',
    metaTitle: 'CSS Grid | Learn Computer Academy',
    metaDescription: 'The grid layout model — defining rows and columns explicitly, placing items precisely, and building responsive layouts without media queries.',
    blocks: [
      p('<hr><p>Where flexbox arranges items along one direction, CSS Grid is two-dimensional — it defines rows and columns at the same time, and places items anywhere in that grid.</p><hr>'),
      h(2, 'Creating a Grid Container'),
      code('css', '.container {\n  display: grid;\n}'),
      h(2, 'grid-template-columns and grid-template-rows'),
      p('<p>Defines the number and size of columns and rows.</p>'),
      code('css', '.container {\n  display: grid;\n  grid-template-columns: 200px 200px 200px;\n  grid-template-rows: 100px 100px;\n}'),
      h(2, 'The fr Unit'),
      p('<p><code>fr</code> represents a fraction of the available space — much more flexible than fixed pixel widths.</p>'),
      code('css', '.container {\n  grid-template-columns: 1fr 2fr 1fr;    /* middle column is twice as wide */\n}'),
      h(2, 'repeat() and minmax()'),
      p('<p><code>repeat()</code> avoids typing the same value over and over. <code>minmax()</code> gives a track a minimum and maximum size.</p>'),
      code('css', '.container {\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n}'),
      h(2, 'gap'),
      code('css', '.container {\n  display: grid;\n  gap: 16px;              /* row and column gap */\n  gap: 16px 24px;         /* row gap, column gap */\n}'),
      h(2, 'Placing Items — grid-column and grid-row'),
      p('<p>An item can span multiple columns or rows by specifying start and end lines.</p>'),
      code('css', '.item-featured {\n  grid-column: 1 / 3;    /* starts at line 1, ends at line 3 — spans 2 columns */\n  grid-row: 1 / 3;\n}'),
      h(2, 'Naming Areas — grid-template-areas'),
      p('<p>Named areas make a layout\'s structure readable at a glance.</p>'),
      code('css', '.container {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-areas:\n    "sidebar header"\n    "sidebar content";\n}\n.sidebar { grid-area: sidebar; }\n.header  { grid-area: header; }\n.content { grid-area: content; }'),
      table(['Grid vs. Flexbox', 'Use when'], [
        ['Grid', 'The layout needs rows and columns together — a page shell, a card gallery, a form grid'],
        ['Flexbox', 'Items flow in one direction and need to distribute or align along it — a navbar, a button group'],
      ]),
      callout('tip', '<p>This site\'s Grid Generator tool (under Tools) builds a grid visually and outputs the CSS — a good way to see grid-template-areas take shape without writing it by hand first.</p>', 'Practice it interactively'),
    ],
  },
  bn: {
    title: 'CSS Grid',
    metaTitle: 'CSS Grid | Learn Computer Academy',
    metaDescription: 'Grid layout model — row আর column সরাসরি define করা, item নির্ভুলভাবে বসানো, আর media query ছাড়াই responsive layout বানানো।',
    blocks: [
      p('<hr><p>Flexbox যেখানে item-কে একটি দিকে সাজায়, CSS Grid two-dimensional — এটি একসাথে row আর column define করে, আর সেই grid-এর যেকোনো জায়গায় item বসায়।</p><hr>'),
      h(2, 'একটি Grid Container তৈরি করা', 'একটি-grid-container-তৈরি-করা'),
      code('css', '.container {\n  display: grid;\n}'),
      h(2, 'grid-template-columns ও grid-template-rows', 'grid-template-columns-ও-grid-template-rows'),
      p('<p>column আর row-এর সংখ্যা আর আকার define করে।</p>'),
      code('css', '.container {\n  display: grid;\n  grid-template-columns: 200px 200px 200px;\n  grid-template-rows: 100px 100px;\n}'),
      h(2, 'fr একক', 'fr-একক'),
      p('<p><code>fr</code> উপলব্ধ জায়গার একটি ভগ্নাংশ represent করে — fixed pixel width-এর চেয়ে অনেক বেশি flexible।</p>'),
      code('css', '.container {\n  grid-template-columns: 1fr 2fr 1fr;    /* মাঝের column দ্বিগুণ চওড়া */\n}'),
      h(2, 'repeat() ও minmax()', 'repeat-ও-minmax'),
      p('<p><code>repeat()</code> একই মান বারবার টাইপ করা এড়ায়। <code>minmax()</code> একটি track-কে একটি minimum আর maximum আকার দেয়।</p>'),
      code('css', '.container {\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n}'),
      h(2, 'gap'),
      code('css', '.container {\n  display: grid;\n  gap: 16px;              /* row আর column gap */\n  gap: 16px 24px;         /* row gap, column gap */\n}'),
      h(2, 'Item বসানো — grid-column ও grid-row', 'item-বসানো-grid-column-ও-grid-row'),
      p('<p>শুরু আর শেষ line নির্দিষ্ট করে একটি item একাধিক column বা row জুড়ে থাকতে পারে।</p>'),
      code('css', '.item-featured {\n  grid-column: 1 / 3;    /* line 1-এ শুরু, line 3-এ শেষ — 2টি column জুড়ে */\n  grid-row: 1 / 3;\n}'),
      h(2, 'Area-র নাম দেওয়া — grid-template-areas', 'area-র-নাম-দেওয়া-grid-template-areas'),
      p('<p>নামযুক্ত area একনজরে একটি layout-এর structure readable বানায়।</p>'),
      code('css', '.container {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-areas:\n    "sidebar header"\n    "sidebar content";\n}\n.sidebar { grid-area: sidebar; }\n.header  { grid-area: header; }\n.content { grid-area: content; }'),
      table(['Grid বনাম Flexbox', 'কখন ব্যবহার করবেন'], [
        ['Grid', 'Layout-এর একসাথে row আর column দরকার — একটি page shell, একটি card gallery, একটি form grid'],
        ['Flexbox', 'Item এক দিকে flow করে আর সেই দিক বরাবর distribute বা align করা দরকার — একটি navbar, একটি button group'],
      ]),
      callout('tip', '<p>এই সাইটের Grid Generator tool (Tools-এর নিচে) visually একটি grid বানায় আর CSS output দেয় — আগে হাতে না লিখেই grid-template-areas আকার নিতে দেখার একটি ভালো উপায়।</p>', 'Interactively practice করুন'),
    ],
  },
})

// ═══ 3. TRANSFORMS ═══════════════════════════════════════════════════════

lessons.push({
  slug: 'transforms', sortOrder: n++,
  en: {
    title: 'CSS Transforms',
    metaTitle: 'CSS Transforms | Learn Computer Academy',
    metaDescription: 'Move, rotate, scale, and skew an element with the transform property, without affecting the layout of surrounding elements.',
    blocks: [
      p('<hr><p>The <code>transform</code> property changes an element\'s shape, size, or position visually, without pushing surrounding elements around the way changing width or margin would.</p><hr>'),
      h(2, 'translate() — Moving an Element'),
      code('css', '.box {\n  transform: translate(50px, 20px);    /* right 50px, down 20px */\n  transform: translateX(50px);\n  transform: translateY(20px);\n}'),
      h(2, 'rotate() — Rotating an Element'),
      code('css', '.box {\n  transform: rotate(45deg);\n}'),
      h(2, 'scale() — Resizing an Element'),
      code('css', '.box {\n  transform: scale(1.5);          /* 150% size, both directions */\n  transform: scale(1.5, 0.5);     /* different width and height scale */\n}'),
      h(2, 'skew() — Slanting an Element'),
      code('css', '.box {\n  transform: skewX(20deg);\n  transform: skewY(10deg);\n}'),
      h(2, 'Combining Multiple Transforms'),
      p('<p>Multiple functions can be listed in one <code>transform</code> value, applied in order.</p>'),
      code('css', '.box {\n  transform: translate(20px, 10px) rotate(15deg) scale(1.2);\n}'),
      h(2, 'transform-origin'),
      p('<p>Sets the point a rotation or scale happens around — the center by default.</p>'),
      code('css', '.box {\n  transform-origin: top left;\n  transform: rotate(45deg);\n}'),
      table(['Function', 'Effect'], [
        ['translate(x, y)', 'Moves an element'],
        ['rotate(deg)', 'Rotates an element'],
        ['scale(x, y)', 'Resizes an element'],
        ['skew(x, y)', 'Slants an element along an axis'],
      ]),
      callout('note', '<p>A transform is purely visual — it never changes the space an element reserves in the page\'s layout, unlike changing width, height, or margin directly.</p>', 'What transform does not do'),
    ],
  },
  bn: {
    title: 'CSS Transform',
    metaTitle: 'CSS Transform | Learn Computer Academy',
    metaDescription: 'transform প্রপার্টি দিয়ে একটি এলিমেন্ট move, rotate, scale, আর skew করুন, আশেপাশের এলিমেন্টের layout প্রভাবিত না করেই।',
    blocks: [
      p('<hr><p><code>transform</code> প্রপার্টি একটি এলিমেন্টের আকার, size, বা position visually বদলায়, width বা margin বদলালে যেভাবে আশেপাশের এলিমেন্ট সরে যায় সেভাবে না।</p><hr>'),
      h(2, 'translate() — একটি এলিমেন্ট Move করা', 'translate-একটি-এলিমেন্ট-move-করা'),
      code('css', '.box {\n  transform: translate(50px, 20px);    /* ডানে 50px, নিচে 20px */\n  transform: translateX(50px);\n  transform: translateY(20px);\n}'),
      h(2, 'rotate() — একটি এলিমেন্ট Rotate করা', 'rotate-একটি-এলিমেন্ট-rotate-করা'),
      code('css', '.box {\n  transform: rotate(45deg);\n}'),
      h(2, 'scale() — একটি এলিমেন্টের Size বদলানো', 'scale-একটি-এলিমেন্টের-size-বদলানো'),
      code('css', '.box {\n  transform: scale(1.5);          /* 150% size, দুই দিকেই */\n  transform: scale(1.5, 0.5);     /* আলাদা width আর height scale */\n}'),
      h(2, 'skew() — একটি এলিমেন্ট Slant করা', 'skew-একটি-এলিমেন্ট-slant-করা'),
      code('css', '.box {\n  transform: skewX(20deg);\n  transform: skewY(10deg);\n}'),
      h(2, 'একাধিক Transform একসাথে করা', 'একাধিক-transform-একসাথে-করা'),
      p('<p>একটি <code>transform</code> মানে একাধিক function list করা যায়, ক্রম অনুযায়ী apply হয়।</p>'),
      code('css', '.box {\n  transform: translate(20px, 10px) rotate(15deg) scale(1.2);\n}'),
      h(2, 'transform-origin'),
      p('<p>একটি rotation বা scale কোন point ঘিরে হবে তা সেট করে — default-এ center।</p>'),
      code('css', '.box {\n  transform-origin: top left;\n  transform: rotate(45deg);\n}'),
      table(['Function', 'প্রভাব'], [
        ['translate(x, y)', 'একটি এলিমেন্ট move করে'],
        ['rotate(deg)', 'একটি এলিমেন্ট rotate করে'],
        ['scale(x, y)', 'একটি এলিমেন্টের size বদলায়'],
        ['skew(x, y)', 'একটি axis বরাবর একটি এলিমেন্ট slant করে'],
      ]),
      callout('note', '<p>একটি transform সম্পূর্ণ visual — width, height, বা margin সরাসরি বদলানোর মতো এটি কখনো পেজের layout-এ একটি এলিমেন্টের সংরক্ষিত জায়গা বদলায় না।</p>', 'Transform যা করে না'),
    ],
  },
})

// ═══ 4. TRANSITIONS ══════════════════════════════════════════════════════

lessons.push({
  slug: 'transitions', sortOrder: n++,
  en: {
    title: 'CSS Transitions',
    metaTitle: 'CSS Transitions | Learn Computer Academy',
    metaDescription: 'Animate a property change smoothly over time with the transition property, instead of it happening instantly.',
    blocks: [
      p('<hr><p>Without a transition, a CSS property change (like a hover changing a background color) happens instantly. The <code>transition</code> property makes it animate smoothly over a set duration instead.</p><hr>'),
      h(2, 'A Basic Transition'),
      code('css', '.button {\n  background-color: blue;\n  transition: background-color 0.3s;\n}\n.button:hover {\n  background-color: darkblue;\n}'),
      h(2, 'The Four Longhand Properties'),
      table(['Property', 'Controls'], [
        ['transition-property', 'Which property animates — or "all" for every property that changes'],
        ['transition-duration', 'How long the animation takes'],
        ['transition-timing-function', 'The speed curve — ease, linear, ease-in, ease-out, ease-in-out'],
        ['transition-delay', 'How long to wait before starting'],
      ]),
      code('css', '.button {\n  transition-property: background-color, transform;\n  transition-duration: 0.3s;\n  transition-timing-function: ease-in-out;\n  transition-delay: 0s;\n}'),
      h(2, 'The Shorthand'),
      p('<p>All four values in one line, in the same order as the table above.</p>'),
      code('css', '.button {\n  transition: background-color 0.3s ease-in-out 0s;\n}'),
      h(2, 'Transitioning Multiple Properties'),
      code('css', '.card {\n  transition: transform 0.3s, box-shadow 0.3s;\n}\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 16px rgba(0,0,0,0.2);\n}'),
      callout('note', '<p>A transition needs a state change to trigger it — usually <code>:hover</code>, <code>:focus</code>, or a class toggled by JavaScript. Without a trigger, nothing animates.</p>', 'What actually starts a transition'),
    ],
  },
  bn: {
    title: 'CSS Transition',
    metaTitle: 'CSS Transition | Learn Computer Academy',
    metaDescription: 'transition প্রপার্টি দিয়ে সময়ের সাথে মসৃণভাবে একটি প্রপার্টি পরিবর্তন animate করুন, তাৎক্ষণিকভাবে ঘটার বদলে।',
    blocks: [
      p('<hr><p>একটি transition ছাড়া, একটি CSS প্রপার্টি পরিবর্তন (যেমন একটি hover একটি background color বদলানো) তাৎক্ষণিকভাবে ঘটে। <code>transition</code> প্রপার্টি এর বদলে এটাকে একটি নির্দিষ্ট সময় ধরে মসৃণভাবে animate করে।</p><hr>'),
      h(2, 'একটি মৌলিক Transition', 'একটি-মৌলিক-transition'),
      code('css', '.button {\n  background-color: blue;\n  transition: background-color 0.3s;\n}\n.button:hover {\n  background-color: darkblue;\n}'),
      h(2, 'চারটি Longhand প্রপার্টি', 'চারটি-longhand-প্রপার্টি'),
      table(['প্রপার্টি', 'নিয়ন্ত্রণ করে'], [
        ['transition-property', 'কোন প্রপার্টি animate হয় — বা বদলে যাওয়া প্রতিটি প্রপার্টির জন্য "all"'],
        ['transition-duration', 'animation কতক্ষণ সময় নেয়'],
        ['transition-timing-function', 'গতির curve — ease, linear, ease-in, ease-out, ease-in-out'],
        ['transition-delay', 'শুরু করার আগে কতক্ষণ অপেক্ষা করবে'],
      ]),
      code('css', '.button {\n  transition-property: background-color, transform;\n  transition-duration: 0.3s;\n  transition-timing-function: ease-in-out;\n  transition-delay: 0s;\n}'),
      h(2, 'Shorthand'),
      p('<p>একই লাইনে চারটি মান, উপরের table-এর একই ক্রমে।</p>'),
      code('css', '.button {\n  transition: background-color 0.3s ease-in-out 0s;\n}'),
      h(2, 'একাধিক প্রপার্টি Transition করা', 'একাধিক-প্রপার্টি-transition-করা'),
      code('css', '.card {\n  transition: transform 0.3s, box-shadow 0.3s;\n}\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 16px rgba(0,0,0,0.2);\n}'),
      callout('note', '<p>এটা trigger করতে একটি transition-এর একটি state change দরকার — সাধারণত <code>:hover</code>, <code>:focus</code>, বা JavaScript দিয়ে toggle করা একটি class। কোনো trigger ছাড়া, কিছুই animate হয় না।</p>', 'একটি transition আসলে কী শুরু করে'),
    ],
  },
})

// ═══ 5. ANIMATIONS ═══════════════════════════════════════════════════════

lessons.push({
  slug: 'animations', sortOrder: n++,
  en: {
    title: 'CSS Animations',
    metaTitle: 'CSS Animations | Learn Computer Academy',
    metaDescription: 'Build multi-step animations with @keyframes, running automatically or in a loop — beyond what a simple transition can do.',
    blocks: [
      p('<hr><p>A transition only animates between two states — from A to B. A CSS animation, built with <code>@keyframes</code>, can move through several steps, repeat, and run automatically without needing a hover or click to trigger it.</p><hr>'),
      h(2, 'Defining Keyframes'),
      p('<p><code>@keyframes</code> names a sequence of steps, from <code>0%</code> (start) to <code>100%</code> (end).</p>'),
      code('css', '@keyframes slide-in {\n  0% {\n    opacity: 0;\n    transform: translateX(-50px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}'),
      h(2, 'Applying an Animation'),
      code('css', '.card {\n  animation-name: slide-in;\n  animation-duration: 0.5s;\n}'),
      h(2, 'The Animation Properties'),
      table(['Property', 'Controls'], [
        ['animation-name', 'Which @keyframes rule to run'],
        ['animation-duration', 'How long one cycle takes'],
        ['animation-timing-function', 'The speed curve, same values as transitions'],
        ['animation-delay', 'How long to wait before starting'],
        ['animation-iteration-count', 'How many times it repeats — a number, or "infinite"'],
        ['animation-direction', 'normal, reverse, alternate (back and forth)'],
        ['animation-fill-mode', 'Whether the element keeps the first/last keyframe\'s styles before/after running'],
      ]),
      h(2, 'The Shorthand'),
      code('css', '.spinner {\n  animation: spin 1s linear infinite;\n  /* name, duration, timing-function, iteration-count */\n}\n\n@keyframes spin {\n  from { transform: rotate(0deg); }\n  to   { transform: rotate(360deg); }\n}'),
      h(2, 'Multiple Steps'),
      p('<p>Any percentage between 0% and 100% can define a step.</p>'),
      code('css', '@keyframes pulse {\n  0%   { transform: scale(1); }\n  50%  { transform: scale(1.1); }\n  100% { transform: scale(1); }\n}\n.badge {\n  animation: pulse 2s ease-in-out infinite;\n}'),
      callout('tip', '<p>This site\'s Animation tool (under Tools) provides a visual keyframe/easing editor and outputs the exact CSS shown here — a faster way to preview timing curves than guessing values.</p>', 'Practice it interactively'),
    ],
  },
  bn: {
    title: 'CSS Animation',
    metaTitle: 'CSS Animation | Learn Computer Academy',
    metaDescription: '@keyframes দিয়ে multi-step animation বানান, স্বয়ংক্রিয়ভাবে বা loop-এ চলে — একটি সাধারণ transition যা করতে পারে তার বাইরে।',
    blocks: [
      p('<hr><p>একটি transition শুধু দুটি state-এর মধ্যে animate করে — A থেকে B। <code>@keyframes</code> দিয়ে বানানো একটি CSS animation, বেশ কয়েকটি step-এর মধ্য দিয়ে যেতে পারে, repeat করতে পারে, আর trigger করতে একটি hover বা click ছাড়াই স্বয়ংক্রিয়ভাবে চলতে পারে।</p><hr>'),
      h(2, 'Keyframe Define করা', 'keyframe-define-করা'),
      p('<p><code>@keyframes</code> <code>0%</code> (শুরু) থেকে <code>100%</code> (শেষ) পর্যন্ত step-এর একটি ধারা নাম দেয়।</p>'),
      code('css', '@keyframes slide-in {\n  0% {\n    opacity: 0;\n    transform: translateX(-50px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}'),
      h(2, 'একটি Animation Apply করা', 'একটি-animation-apply-করা'),
      code('css', '.card {\n  animation-name: slide-in;\n  animation-duration: 0.5s;\n}'),
      h(2, 'Animation প্রপার্টি', 'animation-প্রপার্টি'),
      table(['প্রপার্টি', 'নিয়ন্ত্রণ করে'], [
        ['animation-name', 'কোন @keyframes rule চলবে'],
        ['animation-duration', 'একটি cycle কতক্ষণ সময় নেয়'],
        ['animation-timing-function', 'গতির curve, transition-এর মতোই মান'],
        ['animation-delay', 'শুরু করার আগে কতক্ষণ অপেক্ষা করবে'],
        ['animation-iteration-count', 'কতবার repeat হবে — একটি সংখ্যা, বা "infinite"'],
        ['animation-direction', 'normal, reverse, alternate (সামনে-পেছনে)'],
        ['animation-fill-mode', 'চলার আগে/পরে এলিমেন্ট প্রথম/শেষ keyframe-এর style রাখবে কিনা'],
      ]),
      h(2, 'Shorthand'),
      code('css', '.spinner {\n  animation: spin 1s linear infinite;\n  /* name, duration, timing-function, iteration-count */\n}\n\n@keyframes spin {\n  from { transform: rotate(0deg); }\n  to   { transform: rotate(360deg); }\n}'),
      h(2, 'একাধিক Step', 'একাধিক-step'),
      p('<p>0% আর 100%-এর মধ্যে যেকোনো percentage একটি step define করতে পারে।</p>'),
      code('css', '@keyframes pulse {\n  0%   { transform: scale(1); }\n  50%  { transform: scale(1.1); }\n  100% { transform: scale(1); }\n}\n.badge {\n  animation: pulse 2s ease-in-out infinite;\n}'),
      callout('tip', '<p>এই সাইটের Animation tool (Tools-এর নিচে) একটি visual keyframe/easing editor দেয় আর এখানে দেখানো ঠিক CSS output করে — মান আন্দাজ করার চেয়ে timing curve preview করার দ্রুত উপায়।</p>', 'Interactively practice করুন'),
    ],
  },
})

// ═══ 6. MEDIA QUERIES ════════════════════════════════════════════════════

lessons.push({
  slug: 'media-queries', sortOrder: n++,
  en: {
    title: 'CSS Media Queries & Responsive Design',
    metaTitle: 'CSS Media Queries | Learn Computer Academy',
    metaDescription: 'Apply different CSS depending on screen size, orientation, or color scheme with @media — the core tool behind a responsive layout.',
    blocks: [
      p('<hr><p>A media query applies a block of CSS only when a condition is true — most commonly, the width of the browser window. This is the core mechanism behind a site that looks right on both a phone and a desktop.</p><hr>'),
      h(2, 'Basic Syntax'),
      code('css', '@media (max-width: 768px) {\n  .sidebar {\n    display: none;\n  }\n}'),
      h(2, 'min-width vs. max-width'),
      table(['Query', 'Applies when...'], [
        ['(max-width: 768px)', 'The viewport is 768px wide or narrower'],
        ['(min-width: 768px)', 'The viewport is 768px wide or wider'],
      ]),
      h(2, 'Mobile-First: Building with min-width'),
      p('<p>Writing the base styles for small screens first, then adding <code>min-width</code> queries to enhance the layout for larger screens, is the modern recommended approach — it means a phone never downloads styles meant to be overridden.</p>'),
      code('css', '.container {\n  display: block;    /* base: stacked, for mobile */\n}\n\n@media (min-width: 768px) {\n  .container {\n    display: flex;    /* enhanced: side by side, for tablet and up */\n  }\n}'),
      h(2, 'Common Breakpoints'),
      table(['Breakpoint', 'Roughly targets'], [
        ['480px', 'Small phones'],
        ['768px', 'Tablets'],
        ['1024px', 'Small laptops'],
        ['1280px+', 'Desktops'],
      ]),
      h(2, 'Other Useful Media Features'),
      code('css', '@media (orientation: landscape) { /* wider than tall */ }\n@media (prefers-color-scheme: dark) { /* user has dark mode on */ }\n@media (prefers-reduced-motion: reduce) { /* user asked for less motion */ }'),
      h(2, 'Combining Conditions'),
      code('css', '@media (min-width: 768px) and (orientation: landscape) {\n  .layout { grid-template-columns: 1fr 1fr; }\n}'),
      callout('note', '<p>Don\'t forget the viewport meta tag in the page\'s <code>&lt;head&gt;</code> — without <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>, mobile browsers render at a fake desktop width and media queries never trigger as expected.</p>', 'The tag every responsive page needs'),
    ],
  },
  bn: {
    title: 'CSS Media Query ও Responsive Design',
    metaTitle: 'CSS Media Query | Learn Computer Academy',
    metaDescription: '@media দিয়ে screen size, orientation, বা color scheme অনুযায়ী ভিন্ন CSS apply করুন — একটি responsive layout-এর পেছনের মূল tool।',
    blocks: [
      p('<hr><p>একটি media query শুধু একটি শর্ত সত্য হলেই CSS-এর একটি block apply করে — সবচেয়ে common, browser window-এর width। এটাই একটি site phone আর desktop দুটোতেই ঠিকভাবে দেখানোর পেছনের মূল mechanism।</p><hr>'),
      h(2, 'মৌলিক Syntax', 'মৌলিক-syntax'),
      code('css', '@media (max-width: 768px) {\n  .sidebar {\n    display: none;\n  }\n}'),
      h(2, 'min-width বনাম max-width', 'min-width-বনাম-max-width'),
      table(['Query', 'কখন apply হয়...'], [
        ['(max-width: 768px)', 'viewport 768px চওড়া বা তার চেয়ে সরু'],
        ['(min-width: 768px)', 'viewport 768px চওড়া বা তার চেয়ে বেশি'],
      ]),
      h(2, 'Mobile-First: min-width দিয়ে বানানো', 'mobile-first-min-width-দিয়ে-বানানো'),
      p('<p>আগে ছোট screen-এর জন্য base style লেখা, তারপর বড় screen-এর জন্য layout বাড়ানোর জন্য <code>min-width</code> query যোগ করা modern recommended approach — এর মানে একটি phone কখনো override করার জন্য বানানো style download করে না।</p>'),
      code('css', '.container {\n  display: block;    /* base: stacked, mobile-এর জন্য */\n}\n\n@media (min-width: 768px) {\n  .container {\n    display: flex;    /* enhanced: পাশাপাশি, tablet আর তার উপরের জন্য */\n  }\n}'),
      h(2, 'Common Breakpoint'),
      table(['Breakpoint', 'মোটামুটি target করে'], [
        ['480px', 'ছোট phone'],
        ['768px', 'Tablet'],
        ['1024px', 'ছোট laptop'],
        ['1280px+', 'Desktop'],
      ]),
      h(2, 'অন্যান্য Useful Media Feature', 'অন্যান্য-useful-media-feature'),
      code('css', '@media (orientation: landscape) { /* উচ্চতার চেয়ে চওড়া */ }\n@media (prefers-color-scheme: dark) { /* user-এর dark mode চালু */ }\n@media (prefers-reduced-motion: reduce) { /* user কম motion চেয়েছে */ }'),
      h(2, 'শর্ত একসাথে করা', 'শর্ত-একসাথে-করা'),
      code('css', '@media (min-width: 768px) and (orientation: landscape) {\n  .layout { grid-template-columns: 1fr 1fr; }\n}'),
      callout('note', '<p>পেজের <code>&lt;head&gt;</code>-এ viewport meta tag ভুলবেন না — <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code> ছাড়া, mobile browser একটি ভুয়া desktop width-এ render করে আর media query কখনো আশানুরূপ trigger হয় না।</p>', 'প্রতিটি responsive পেজের এই tag দরকার'),
    ],
  },
})

// ═══ 7. VARIABLES ════════════════════════════════════════════════════════

lessons.push({
  slug: 'variables', sortOrder: n++,
  en: {
    title: 'CSS Variables (Custom Properties)',
    metaTitle: 'CSS Variables | Learn Computer Academy',
    metaDescription: 'Store a reusable value once with a CSS custom property, and update it everywhere it\'s used by changing it in a single place.',
    blocks: [
      p('<hr><p>A CSS variable (formally called a custom property) lets a value — a color, a spacing size, a font — be defined once and reused throughout a stylesheet, updated everywhere at once from a single place.</p><hr>'),
      h(2, 'Defining a Variable'),
      p('<p>A variable name always starts with two dashes. Defining it on <code>:root</code> makes it available everywhere on the page.</p>'),
      code('css', ':root {\n  --brand-color: #3366ff;\n  --spacing-unit: 8px;\n  --font-heading: \'Poppins\', sans-serif;\n}'),
      h(2, 'Using a Variable — var()'),
      code('css', '.button {\n  background-color: var(--brand-color);\n  padding: var(--spacing-unit);\n}\nh1 {\n  font-family: var(--font-heading);\n}'),
      h(2, 'A Fallback Value'),
      p('<p><code>var()</code> accepts a second argument — used if the variable isn\'t defined.</p>'),
      code('css', '.button {\n  color: var(--text-color, black);\n}'),
      h(2, 'Scoping a Variable'),
      p('<p>A variable defined inside a specific selector, rather than <code>:root</code>, is only available within that element and its children.</p>'),
      code('css', '.dark-card {\n  --card-bg: #1a1a1a;\n  --card-text: white;\n\n  background-color: var(--card-bg);\n  color: var(--card-text);\n}'),
      h(2, 'Why This Beats a Preprocessor Variable'),
      p('<p>Unlike a Sass variable, a CSS custom property is live in the browser — it can be read and changed with JavaScript, and it responds instantly to a media query or a class toggle, without a rebuild step.</p>'),
      code('js', 'document.documentElement.style.setProperty(\'--brand-color\', \'#ff3366\')'),
      callout('tip', '<p>A common real use: define color and spacing variables once at <code>:root</code>, then override just a handful of them inside a <code>.dark-theme</code> class to build a dark mode without duplicating every rule.</p>', 'A practical pattern'),
    ],
  },
  bn: {
    title: 'CSS Variable (Custom Property)',
    metaTitle: 'CSS Variable | Learn Computer Academy',
    metaDescription: 'একটি CSS custom property দিয়ে একবার একটি reusable মান সংরক্ষণ করুন, আর একটি জায়গায় বদলে যেখানেই ব্যবহার হয় সবখানে আপডেট করুন।',
    blocks: [
      p('<hr><p>একটি CSS variable (আনুষ্ঠানিকভাবে custom property বলা হয়) একটি মান — একটি রং, একটি spacing size, একটি font — একবার define করতে দেয় আর পুরো stylesheet জুড়ে reuse করতে দেয়, একটি জায়গা থেকেই সবখানে আপডেট করা যায়।</p><hr>'),
      h(2, 'একটি Variable Define করা', 'একটি-variable-define-করা'),
      p('<p>একটি variable নাম সবসময় দুটি dash দিয়ে শুরু হয়। <code>:root</code>-এ এটা define করলে পেজের সবখানে উপলব্ধ হয়।</p>'),
      code('css', ':root {\n  --brand-color: #3366ff;\n  --spacing-unit: 8px;\n  --font-heading: \'Poppins\', sans-serif;\n}'),
      h(2, 'একটি Variable ব্যবহার করা — var()', 'একটি-variable-ব্যবহার-করা-var'),
      code('css', '.button {\n  background-color: var(--brand-color);\n  padding: var(--spacing-unit);\n}\nh1 {\n  font-family: var(--font-heading);\n}'),
      h(2, 'একটি Fallback মান', 'একটি-fallback-মান'),
      p('<p><code>var()</code> একটি দ্বিতীয় argument accept করে — variable define না থাকলে ব্যবহৃত হয়।</p>'),
      code('css', '.button {\n  color: var(--text-color, black);\n}'),
      h(2, 'একটি Variable Scope করা', 'একটি-variable-scope-করা'),
      p('<p><code>:root</code>-এর বদলে একটি নির্দিষ্ট selector-এর ভেতরে define করা একটি variable শুধু সেই এলিমেন্ট আর এর child-দের ভেতরে উপলব্ধ।</p>'),
      code('css', '.dark-card {\n  --card-bg: #1a1a1a;\n  --card-text: white;\n\n  background-color: var(--card-bg);\n  color: var(--card-text);\n}'),
      h(2, 'কেন এটা একটি Preprocessor Variable-কে হারায়', 'কেন-এটা-একটি-preprocessor-variable-কে-হারায়'),
      p('<p>একটি Sass variable-এর মতো না, একটি CSS custom property ব্রাউজারে live — এটা JavaScript দিয়ে পড়া আর বদলানো যায়, আর কোনো rebuild step ছাড়াই একটি media query বা একটি class toggle-এ তাৎক্ষণিকভাবে সাড়া দেয়।</p>'),
      code('js', 'document.documentElement.style.setProperty(\'--brand-color\', \'#ff3366\')'),
      callout('tip', '<p>একটি সাধারণ আসল ব্যবহার: <code>:root</code>-এ একবার রং আর spacing variable define করুন, তারপর প্রতিটি rule duplicate না করে dark mode বানাতে একটি <code>.dark-theme</code> class-এর ভেতরে হাতেগোনা কয়েকটা override করুন।</p>', 'একটি practical pattern'),
    ],
  },
})

// ═══ 8. FUNCTIONS ════════════════════════════════════════════════════════

lessons.push({
  slug: 'functions', sortOrder: n++,
  en: {
    title: 'CSS Functions — calc(), min(), max(), clamp()',
    metaTitle: 'CSS Functions | Learn Computer Academy',
    metaDescription: 'Do math directly inside a CSS value with calc(), and pick the smallest, largest, or a clamped-between value with min(), max(), and clamp().',
    blocks: [
      p('<hr><p>These four functions let a CSS value be computed rather than hardcoded — mixing units, reacting to the viewport, or picking between two values based on which is currently larger or smaller.</p><hr>'),
      h(2, 'calc() — Doing Math'),
      p('<p>Mixes different units in one expression — something plain CSS can\'t do on its own.</p>'),
      code('css', '.sidebar {\n  width: calc(100% - 250px);\n}\n.box {\n  height: calc(100vh - 80px);\n}'),
      callout('note', '<p>A space is required around every operator inside <code>calc()</code> — <code>calc(100% -250px)</code> is invalid, <code>calc(100% - 250px)</code> is correct.</p>', 'The most common calc() mistake'),
      h(2, 'min() — The Smaller of Two Values'),
      p('<p>Picks whichever value is smaller at any given moment — useful for a width that should never exceed a fixed maximum.</p>'),
      code('css', '.card {\n  width: min(90%, 600px);    /* never wider than 600px, but shrinks below that on small screens */\n}'),
      h(2, 'max() — The Larger of Two Values'),
      code('css', '.button {\n  padding: max(12px, 3%);    /* never smaller than 12px */\n}'),
      h(2, 'clamp() — A Value Between a Min and a Max'),
      p('<p><code>clamp(minimum, preferred, maximum)</code> — the preferred value is used as long as it stays between the min and max.</p>'),
      code('css', '.heading {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  /* never smaller than 1.5rem, never larger than 3rem,\n     scales with viewport width in between */\n}'),
      table(['Function', 'Picks'], [
        ['calc()', 'The result of a mixed-unit math expression'],
        ['min()', 'The smallest of the values listed'],
        ['max()', 'The largest of the values listed'],
        ['clamp()', 'The preferred value, kept between a min and max'],
      ]),
      callout('tip', '<p>This site\'s Clamp tool (under Tools) generates a clamp() value from a min/max size and viewport range — the fastest way to get fluid typography sizing right without trial and error.</p>', 'Practice it interactively'),
    ],
  },
  bn: {
    title: 'CSS Function — calc(), min(), max(), clamp()',
    metaTitle: 'CSS Function | Learn Computer Academy',
    metaDescription: 'calc() দিয়ে সরাসরি একটি CSS মানের ভেতরে math করুন, আর min(), max(), আর clamp() দিয়ে সবচেয়ে ছোট, বড়, বা মাঝামাঝি একটি মান বেছে নিন।',
    blocks: [
      p('<hr><p>এই চারটি function একটি CSS মানকে hardcode-এর বদলে compute হতে দেয় — একক মেশানো, viewport-এ সাড়া দেওয়া, বা এখন কোনটা বড় বা ছোট তার উপর ভিত্তি করে দুটি মানের মধ্যে বেছে নেওয়া।</p><hr>'),
      h(2, 'calc() — Math করা', 'calc-math-করা'),
      p('<p>একটি expression-এ ভিন্ন একক মেশায় — plain CSS নিজে থেকে যা পারে না।</p>'),
      code('css', '.sidebar {\n  width: calc(100% - 250px);\n}\n.box {\n  height: calc(100vh - 80px);\n}'),
      callout('note', '<p><code>calc()</code>-এর ভেতরে প্রতিটি operator-এর চারপাশে একটি স্পেস দরকার — <code>calc(100% -250px)</code> অবৈধ, <code>calc(100% - 250px)</code> সঠিক।</p>', 'সবচেয়ে সাধারণ calc() ভুল'),
      h(2, 'min() — দুটি মানের ছোটটা', 'min-দুটি-মানের-ছোটটা'),
      p('<p>যেকোনো মুহূর্তে যেটা ছোট সেই মান বেছে নেয় — একটি fixed maximum-এর বেশি হওয়া উচিত না এমন একটি width-এর জন্য useful।</p>'),
      code('css', '.card {\n  width: min(90%, 600px);    /* কখনো 600px-এর বেশি চওড়া না, কিন্তু ছোট screen-এ এর নিচে সংকুচিত হয় */\n}'),
      h(2, 'max() — দুটি মানের বড়টা', 'max-দুটি-মানের-বড়টা'),
      code('css', '.button {\n  padding: max(12px, 3%);    /* কখনো 12px-এর ছোট না */\n}'),
      h(2, 'clamp() — একটি Min ও Max-এর মধ্যে একটি মান', 'clamp-একটি-min-ও-max-এর-মধ্যে-একটি-মান'),
      p('<p><code>clamp(minimum, preferred, maximum)</code> — preferred মান ব্যবহৃত হয় যতক্ষণ এটা min আর max-এর মধ্যে থাকে।</p>'),
      code('css', '.heading {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  /* কখনো 1.5rem-এর ছোট না, কখনো 3rem-এর বড় না,\n     মাঝখানে viewport width অনুযায়ী scale করে */\n}'),
      table(['Function', 'বেছে নেয়'], [
        ['calc()', 'মেশানো একক math expression-এর ফলাফল'],
        ['min()', 'list করা মানগুলোর মধ্যে সবচেয়ে ছোটটা'],
        ['max()', 'list করা মানগুলোর মধ্যে সবচেয়ে বড়টা'],
        ['clamp()', 'preferred মান, একটি min আর max-এর মধ্যে রাখা'],
      ]),
      callout('tip', '<p>এই সাইটের Clamp tool (Tools-এর নিচে) একটি min/max size আর viewport range থেকে একটি clamp() মান generate করে — trial and error ছাড়াই fluid typography sizing ঠিক করার দ্রুততম উপায়।</p>', 'Interactively practice করুন'),
    ],
  },
})

// ═══ 9. ATTRIBUTE SELECTORS ══════════════════════════════════════════════

lessons.push({
  slug: 'attribute-selectors', sortOrder: n++,
  en: {
    title: 'CSS Attribute Selectors',
    metaTitle: 'CSS Attribute Selectors | Learn Computer Academy',
    metaDescription: 'Select an element by the presence, exact value, or partial match of an HTML attribute — beyond just class and id.',
    blocks: [
      p('<hr><p>An attribute selector targets an element based on an HTML attribute it carries, rather than its tag, class, or id — useful for styling form inputs by type, or links by their destination.</p><hr>'),
      h(2, 'Presence — [attr]'),
      p('<p>Matches any element that has the attribute at all, regardless of its value.</p>'),
      code('css', 'input[required] {\n  border-color: orange;\n}'),
      h(2, 'Exact Match — [attr=value]'),
      code('css', 'input[type="email"] {\n  background-image: url(email-icon.svg);\n}'),
      h(2, 'Starts With — [attr^=value]'),
      code('css', 'a[href^="https://"] {\n  /* every link that starts with https:// */\n}'),
      h(2, 'Ends With — [attr$=value]'),
      code('css', 'a[href$=".pdf"] {\n  /* every link ending in .pdf — good for a download icon */\n}'),
      h(2, 'Contains — [attr*=value]'),
      code('css', 'a[href*="example.com"] {\n  /* every link containing example.com anywhere in the URL */\n}'),
      h(2, 'Whitespace-Separated Word — [attr~=value]'),
      code('css', '[class~="featured"] {\n  /* matches class="card featured" but not class="unfeatured" */\n}'),
      table(['Selector', 'Matches'], [
        ['[attr]', 'The attribute exists, any value'],
        ['[attr=value]', 'The attribute equals value exactly'],
        ['[attr^=value]', 'The attribute starts with value'],
        ['[attr$=value]', 'The attribute ends with value'],
        ['[attr*=value]', 'The attribute contains value anywhere'],
        ['[attr~=value]', 'value appears as one whole word in a space-separated list'],
      ]),
      callout('tip', '<p>A very common real use: <code>a[href^="https://"]:not([href*="yoursite.com"])</code> selects external links only — a good base for automatically adding an "opens in new tab" icon.</p>', 'A practical combination'),
    ],
  },
  bn: {
    title: 'CSS Attribute Selector',
    metaTitle: 'CSS Attribute Selector | Learn Computer Academy',
    metaDescription: 'একটি HTML attribute-এর উপস্থিতি, সঠিক মান, বা আংশিক মিল দিয়ে একটি এলিমেন্ট select করুন — শুধু class আর id-র বাইরে।',
    blocks: [
      p('<hr><p>একটি attribute selector এর tag, class, বা id-র বদলে এটা বহন করা একটি HTML attribute-এর উপর ভিত্তি করে একটি এলিমেন্ট target করে — type অনুযায়ী form input, বা destination অনুযায়ী link style করার জন্য useful।</p><hr>'),
      h(2, 'উপস্থিতি — [attr]', 'উপস্থিতি-attr'),
      p('<p>মান যাই হোক, attribute-টা আছে এমন যেকোনো এলিমেন্ট match করে।</p>'),
      code('css', 'input[required] {\n  border-color: orange;\n}'),
      h(2, 'সঠিক মিল — [attr=value]', 'সঠিক-মিল-attrvalue'),
      code('css', 'input[type="email"] {\n  background-image: url(email-icon.svg);\n}'),
      h(2, 'দিয়ে শুরু — [attr^=value]', 'দিয়ে-শুরু-attrvalue'),
      code('css', 'a[href^="https://"] {\n  /* https://-এ শুরু হওয়া প্রতিটি link */\n}'),
      h(2, 'দিয়ে শেষ — [attr$=value]', 'দিয়ে-শেষ-attrvalue'),
      code('css', 'a[href$=".pdf"] {\n  /* .pdf-এ শেষ হওয়া প্রতিটি link — একটি download icon-এর জন্য ভালো */\n}'),
      h(2, 'ধারণ করে — [attr*=value]', 'ধারণ-করে-attrvalue'),
      code('css', 'a[href*="example.com"] {\n  /* URL-এর যেকোনো জায়গায় example.com ধারণ করা প্রতিটি link */\n}'),
      h(2, 'Whitespace-দিয়ে-আলাদা শব্দ — [attr~=value]', 'whitespace-দিয়ে-আলাদা-শব্দ-attrvalue'),
      code('css', '[class~="featured"] {\n  /* class="card featured" match করে কিন্তু class="unfeatured" না */\n}'),
      table(['Selector', 'যা match করে'], [
        ['[attr]', 'Attribute-টা আছে, যেকোনো মান'],
        ['[attr=value]', 'Attribute ঠিক value-র সমান'],
        ['[attr^=value]', 'Attribute value দিয়ে শুরু হয়'],
        ['[attr$=value]', 'Attribute value দিয়ে শেষ হয়'],
        ['[attr*=value]', 'Attribute যেকোনো জায়গায় value ধারণ করে'],
        ['[attr~=value]', 'একটি space-separated list-এ value একটি পুরো শব্দ হিসেবে দেখা যায়'],
      ]),
      callout('tip', '<p>একটি খুব common আসল ব্যবহার: <code>a[href^="https://"]:not([href*="yoursite.com"])</code> শুধু external link select করে — স্বয়ংক্রিয়ভাবে একটি "opens in new tab" icon যোগ করার জন্য একটি ভালো ভিত্তি।</p>', 'একটি practical combination'),
    ],
  },
})

// ═══ 10. MULTICOLUMN LAYOUT ══════════════════════════════════════════════

lessons.push({
  slug: 'multicolumn-layout', sortOrder: n++,
  en: {
    title: 'CSS Multi-column Layout',
    metaTitle: 'CSS Multi-column Layout | Learn Computer Academy',
    metaDescription: 'Flow text into newspaper-style columns automatically with column-count and column-width, without a grid or flexbox.',
    blocks: [
      p('<hr><p>Multi-column layout flows a block of content — usually text — into multiple newspaper-style columns automatically, without manually splitting it into separate elements.</p><hr>'),
      h(2, 'column-count'),
      code('css', '.article {\n  column-count: 3;\n}'),
      h(2, 'column-width'),
      p('<p>Instead of a fixed number of columns, this sets an ideal width — the browser fits as many columns of roughly that width as the container allows.</p>'),
      code('css', '.article {\n  column-width: 200px;\n}'),
      h(2, 'column-gap'),
      code('css', '.article {\n  column-count: 3;\n  column-gap: 32px;\n}'),
      h(2, 'column-rule'),
      p('<p>Draws a line between columns, styled just like <code>border</code>.</p>'),
      code('css', '.article {\n  column-rule: 1px solid #ccc;\n}'),
      h(2, 'Keeping an Element From Splitting'),
      p('<p>Without this, a heading or image can be split awkwardly across two columns.</p>'),
      code('css', '.article h3, .article img {\n  break-inside: avoid;\n}'),
      callout('note', '<p>Multi-column layout suits long-form text (articles, a list of short items) — for arranging distinct UI components, Grid or Flexbox from earlier lessons are almost always the better tool.</p>', 'When to actually reach for this'),
    ],
  },
  bn: {
    title: 'CSS Multi-column Layout',
    metaTitle: 'CSS Multi-column Layout | Learn Computer Academy',
    metaDescription: 'কোনো grid বা flexbox ছাড়াই column-count আর column-width দিয়ে স্বয়ংক্রিয়ভাবে টেক্সট newspaper-style column-এ flow করান।',
    blocks: [
      p('<hr><p>Multi-column layout একটি content block — সাধারণত টেক্সট — কে আলাদা এলিমেন্টে হাতে ভাগ না করেই স্বয়ংক্রিয়ভাবে একাধিক newspaper-style column-এ flow করে।</p><hr>'),
      h(2, 'column-count'),
      code('css', '.article {\n  column-count: 3;\n}'),
      h(2, 'column-width'),
      p('<p>column-এর একটি fixed সংখ্যার বদলে, এটা একটি ideal width সেট করে — container যতগুলো ধরতে পারে ব্রাউজার প্রায় সেই width-এর ততগুলো column ফিট করায়।</p>'),
      code('css', '.article {\n  column-width: 200px;\n}'),
      h(2, 'column-gap'),
      code('css', '.article {\n  column-count: 3;\n  column-gap: 32px;\n}'),
      h(2, 'column-rule'),
      p('<p>column-এর মধ্যে একটি line আঁকে, ঠিক <code>border</code>-এর মতো style করা।</p>'),
      code('css', '.article {\n  column-rule: 1px solid #ccc;\n}'),
      h(2, 'একটি এলিমেন্ট ভাগ হওয়া থেকে আটকানো', 'একটি-এলিমেন্ট-ভাগ-হওয়া-থেকে-আটকানো'),
      p('<p>এটা ছাড়া, একটি heading বা image দুটি column জুড়ে বিশ্রীভাবে ভাগ হয়ে যেতে পারে।</p>'),
      code('css', '.article h3, .article img {\n  break-inside: avoid;\n}'),
      callout('note', '<p>Multi-column layout long-form টেক্সটের (article, ছোট item-এর একটি list) জন্য মানানসই — আলাদা UI component সাজানোর জন্য, আগের lesson-এর Grid বা Flexbox প্রায় সবসময় ভালো tool।</p>', 'আসলে কখন এটার জন্য যাবেন'),
    ],
  },
})

// ═══ 11. GOOGLE FONTS ═════════════════════════════════════════════════════

lessons.push({
  slug: 'google-fonts', sortOrder: n++,
  en: {
    title: 'Using Google Fonts',
    metaTitle: 'Using Google Fonts | Learn Computer Academy',
    metaDescription: 'How to add a free, hosted Google Font to a page and apply it in CSS, plus why a fallback font stack still matters.',
    blocks: [
      p('<hr><p>Google Fonts is a free, hosted library of open-source fonts — no download or server setup needed, just a link tag and a CSS rule.</p><hr>'),
      h(2, 'Adding the Font'),
      p('<p>Google Fonts generates a <code>&lt;link&gt;</code> tag for any font and weight selected on their site — add it inside <code>&lt;head&gt;</code>.</p>'),
      code('html', '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">'),
      h(2, 'Applying the Font in CSS'),
      code('css', 'body {\n  font-family: \'Poppins\', sans-serif;\n}'),
      h(2, 'Why the Fallback Still Matters'),
      p('<p>The generic <code>sans-serif</code> after the font name is used if the Google Fonts file fails to load — a slow connection, an ad blocker, or the service being briefly down. Always include one.</p>'),
      h(2, '@import — the Alternative Method'),
      p('<p>Fonts can also be loaded from inside a CSS file, though the <code>&lt;link&gt;</code> method usually loads faster.</p>'),
      code('css', '@import url(\'https://fonts.googleapis.com/css2?family=Poppins&display=swap\');'),
      callout('tip', '<p>The <code>display=swap</code> parameter shows the fallback font immediately and swaps it once the custom font loads — without it, text can stay invisible for a moment while the font downloads.</p>', 'Don\'t drop display=swap'),
    ],
  },
  bn: {
    title: 'Google Fonts ব্যবহার করা',
    metaTitle: 'Google Fonts ব্যবহার করা | Learn Computer Academy',
    metaDescription: 'একটি পেজে কীভাবে একটি ফ্রি, hosted Google Font যোগ করবেন আর CSS-এ apply করবেন, আর কেন একটি fallback font stack এখনো গুরুত্বপূর্ণ।',
    blocks: [
      p('<hr><p>Google Fonts open-source font-এর একটি ফ্রি, hosted library — কোনো download বা server setup দরকার নেই, শুধু একটি link tag আর একটি CSS rule।</p><hr>'),
      h(2, 'Font যোগ করা', 'font-যোগ-করা'),
      p('<p>তাদের সাইটে বেছে নেওয়া যেকোনো font আর weight-এর জন্য Google Fonts একটি <code>&lt;link&gt;</code> tag generate করে — এটা <code>&lt;head&gt;</code>-এর ভেতরে যোগ করুন।</p>'),
      code('html', '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">'),
      h(2, 'CSS-এ Font Apply করা', 'css-এ-font-apply-করা'),
      code('css', 'body {\n  font-family: \'Poppins\', sans-serif;\n}'),
      h(2, 'কেন Fallback এখনো গুরুত্বপূর্ণ', 'কেন-fallback-এখনো-গুরুত্বপূর্ণ'),
      p('<p>Font নামের পরের generic <code>sans-serif</code> ব্যবহৃত হয় যদি Google Fonts file load হতে ব্যর্থ হয় — একটি ধীর connection, একটি ad blocker, বা service সংক্ষেপে down থাকা। সবসময় একটা রাখুন।</p>'),
      h(2, '@import — বিকল্প পদ্ধতি', 'import-বিকল্প-পদ্ধতি'),
      p('<p>Font একটি CSS file-এর ভেতর থেকেও load করা যায়, যদিও <code>&lt;link&gt;</code> পদ্ধতি সাধারণত দ্রুত load হয়।</p>'),
      code('css', '@import url(\'https://fonts.googleapis.com/css2?family=Poppins&display=swap\');'),
      callout('tip', '<p><code>display=swap</code> parameter সাথে সাথে fallback font দেখায় আর custom font load হলে সেটা swap করে — এটা ছাড়া, font download হওয়ার সময় টেক্সট মুহূর্তের জন্য অদৃশ্য থাকতে পারে।</p>', 'display=swap বাদ দেবেন না'),
    ],
  },
})

// ═══ 12. FONT SHORTHAND ═══════════════════════════════════════════════════

lessons.push({
  slug: 'font-shorthand', sortOrder: n++,
  en: {
    title: 'CSS Font Shorthand',
    metaTitle: 'CSS Font Shorthand | Learn Computer Academy',
    metaDescription: 'Set style, weight, size, line-height, and family in a single font property, and the exact order that syntax requires.',
    blocks: [
      p('<hr><p>Rather than five separate declarations, the <code>font</code> shorthand sets several font properties at once — but it has a strict required order.</p><hr>'),
      h(2, 'The Longhand Version'),
      code('css', 'p {\n  font-style: italic;\n  font-weight: bold;\n  font-size: 18px;\n  line-height: 1.5;\n  font-family: Arial, sans-serif;\n}'),
      h(2, 'The Shorthand Version'),
      code('css', 'p {\n  font: italic bold 18px/1.5 Arial, sans-serif;\n}'),
      h(2, 'The Required Order'),
      table(['Order', 'Value', 'Required?'], [
        ['1', 'font-style', 'Optional'],
        ['2', 'font-weight', 'Optional'],
        ['3', 'font-size / line-height', 'font-size required, line-height optional (with a slash)'],
        ['4', 'font-family', 'Required — must be listed last'],
      ]),
      callout('warning', '<p><code>font-size</code> and <code>font-family</code> are the only two parts that can\'t be skipped — leaving either out makes the whole shorthand invalid, silently falling back to default font styling.</p>', 'The two required parts'),
    ],
  },
  bn: {
    title: 'CSS Font Shorthand',
    metaTitle: 'CSS Font Shorthand | Learn Computer Academy',
    metaDescription: 'একটি একক font প্রপার্টিতে style, weight, size, line-height, আর family সেট করুন, আর সিনট্যাক্স যে সঠিক ক্রম দাবি করে তা।',
    blocks: [
      p('<hr><p>পাঁচটি আলাদা declaration-এর বদলে, <code>font</code> shorthand একসাথে বেশ কয়েকটি font প্রপার্টি সেট করে — কিন্তু এর একটি কঠোর দরকারি ক্রম আছে।</p><hr>'),
      h(2, 'Longhand Version'),
      code('css', 'p {\n  font-style: italic;\n  font-weight: bold;\n  font-size: 18px;\n  line-height: 1.5;\n  font-family: Arial, sans-serif;\n}'),
      h(2, 'Shorthand Version'),
      code('css', 'p {\n  font: italic bold 18px/1.5 Arial, sans-serif;\n}'),
      h(2, 'দরকারি ক্রম', 'দরকারি-ক্রম'),
      table(['ক্রম', 'মান', 'দরকারি?'], [
        ['1', 'font-style', 'Optional'],
        ['2', 'font-weight', 'Optional'],
        ['3', 'font-size / line-height', 'font-size দরকারি, line-height optional (একটি slash সহ)'],
        ['4', 'font-family', 'দরকারি — সবার শেষে list করতে হবে'],
      ]),
      callout('warning', '<p><code>font-size</code> আর <code>font-family</code>-ই একমাত্র দুটি অংশ যা বাদ দেওয়া যায় না — যেকোনো একটা বাদ দিলে পুরো shorthand অবৈধ হয়ে যায়, চুপচাপ default font styling-এ ফিরে যায়।</p>', 'দুটি দরকারি অংশ'),
    ],
  },
})

// ═══ 13. RESPONSIVE TYPOGRAPHY ═══════════════════════════════════════════

lessons.push({
  slug: 'responsive-typography', sortOrder: n++,
  en: {
    title: 'Responsive Typography',
    metaTitle: 'Responsive Typography | Learn Computer Academy',
    metaDescription: 'Making text size actually scale with the screen — viewport units, rem-based scaling, and fluid typography with clamp().',
    blocks: [
      p('<hr><p>A heading sized comfortably for a desktop screen often looks oversized on a phone, and a size tuned for mobile looks small on a desktop. Responsive typography is about text that scales smoothly between the two, instead of needing a separate media query for every breakpoint.</p><hr>'),
      h(2, 'The Old Way — a Media Query Per Breakpoint'),
      code('css', 'h1 { font-size: 24px; }\n@media (min-width: 768px) {\n  h1 { font-size: 32px; }\n}\n@media (min-width: 1200px) {\n  h1 { font-size: 48px; }\n}'),
      p('<p>This works, but jumps in visible steps rather than scaling smoothly, and needs a new rule for every new breakpoint.</p>'),
      h(2, 'Viewport Units'),
      p('<p><code>vw</code> (viewport width) scales continuously with screen size, but with no minimum or maximum — text can become unreadably small or huge at extreme sizes.</p>'),
      code('css', 'h1 {\n  font-size: 5vw;\n}'),
      h(2, 'The Fluid Approach — clamp()'),
      p('<p>Combining a viewport unit with <code>clamp()</code> (from the earlier CSS Functions lesson) scales smoothly, with a safe floor and ceiling.</p>'),
      code('css', 'h1 {\n  font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);\n}'),
      h(2, 'Why rem, Not px, for the Min and Max'),
      p('<p>Using <code>rem</code> for the fixed ends of a <code>clamp()</code> respects a user\'s browser font-size setting, unlike a fixed <code>px</code> value — a real accessibility difference for anyone who\'s increased their default text size.</p>'),
      callout('tip', '<p>This site\'s Clamp tool generates a value like the one above from a simple min-size/max-size/viewport-range form — worth using directly rather than tuning the numbers by hand.</p>', 'The fast path to a good value'),
    ],
  },
  bn: {
    title: 'Responsive Typography',
    metaTitle: 'Responsive Typography | Learn Computer Academy',
    metaDescription: 'টেক্সট size আসলেই screen-এর সাথে scale করানো — viewport unit, rem-ভিত্তিক scaling, আর clamp() দিয়ে fluid typography।',
    blocks: [
      p('<hr><p>একটি desktop screen-এর জন্য আরামদায়কভাবে size করা একটি heading প্রায়ই একটি phone-এ oversized দেখায়, আর mobile-এর জন্য tune করা একটি size একটি desktop-এ ছোট দেখায়। Responsive typography মানে প্রতিটি breakpoint-এর জন্য আলাদা media query দরকার না হয়ে দুটোর মধ্যে মসৃণভাবে scale করা টেক্সট।</p><hr>'),
      h(2, 'পুরনো উপায় — প্রতি Breakpoint-এ একটি Media Query', 'পুরনো-উপায়-প্রতি-breakpoint-এ-একটি-media-query'),
      code('css', 'h1 { font-size: 24px; }\n@media (min-width: 768px) {\n  h1 { font-size: 32px; }\n}\n@media (min-width: 1200px) {\n  h1 { font-size: 48px; }\n}'),
      p('<p>এটা কাজ করে, কিন্তু মসৃণভাবে scale না করে দৃশ্যমান step-এ লাফায়, আর প্রতিটি নতুন breakpoint-এর জন্য একটি নতুন rule দরকার।</p>'),
      h(2, 'Viewport Unit'),
      p('<p><code>vw</code> (viewport width) screen size-এর সাথে ক্রমাগত scale করে, কিন্তু কোনো minimum বা maximum ছাড়াই — চরম size-এ টেক্সট পড়ার অযোগ্য ছোট বা বিশাল হয়ে যেতে পারে।</p>'),
      code('css', 'h1 {\n  font-size: 5vw;\n}'),
      h(2, 'Fluid Approach — clamp()'),
      p('<p>একটি viewport unit-কে (আগের CSS Function lesson থেকে) <code>clamp()</code>-এর সাথে মেশালে একটি নিরাপদ floor আর ceiling সহ মসৃণভাবে scale করে।</p>'),
      code('css', 'h1 {\n  font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);\n}'),
      h(2, 'কেন Min আর Max-এর জন্য px না, rem', 'কেন-min-আর-max-এর-জন্য-px-না-rem'),
      p('<p>একটি <code>clamp()</code>-এর fixed প্রান্তের জন্য <code>rem</code> ব্যবহার একটি fixed <code>px</code> মানের মতো না, একজন user-এর browser font-size setting-কে সম্মান করে — যে কেউ তাদের default text size বাড়িয়েছে তাদের জন্য একটি আসল accessibility পার্থক্য।</p>'),
      callout('tip', '<p>এই সাইটের Clamp tool একটি সাধারণ min-size/max-size/viewport-range form থেকে উপরের মতো একটি মান generate করে — হাতে সংখ্যা tune করার বদলে সরাসরি এটা ব্যবহার করার যোগ্য।</p>', 'একটি ভালো মানের দ্রুত পথ'),
    ],
  },
})

// ═══ 14. ACCESSIBILITY & PERFORMANCE ═════════════════════════════════════

lessons.push({
  slug: 'css-accessibility-and-performance', sortOrder: n++,
  en: {
    title: 'CSS Accessibility & Performance Basics',
    metaTitle: 'CSS Accessibility & Performance | Learn Computer Academy',
    metaDescription: 'CSS-specific habits that respect motion sensitivity and keyboard users, plus a few common performance mistakes worth avoiding.',
    blocks: [
      p('<hr><p>Most accessibility work is HTML\'s job (covered in the HTML course\'s accessibility lesson), but a handful of things are specifically CSS\'s responsibility — and a few common CSS habits quietly hurt page performance.</p><hr>'),
      h(2, 'Respecting Reduced Motion'),
      p('<p>Some users set their OS to reduce motion — for vestibular disorders, or simple preference. Wrapping animations in this media query respects that setting.</p>'),
      code('css', '@media (prefers-reduced-motion: reduce) {\n  * {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}'),
      h(2, 'Never Remove focus Without Replacing It'),
      p('<p>A keyboard user relies on the visible focus outline to know where they are on the page. Removing it without a replacement makes the page unusable by keyboard.</p>'),
      code('css', '/* Bad — removes the only visible sign of focus */\n:focus {\n  outline: none;\n}\n\n/* Good — replaces it with a clearer custom style */\n:focus-visible {\n  outline: 2px solid blue;\n  outline-offset: 2px;\n}'),
      h(2, 'Color Contrast'),
      p('<p>Light gray text on a white background might look clean, but is genuinely unreadable for many users. A contrast ratio of at least 4.5:1 for normal text is the standard accessibility guideline (WCAG AA).</p>'),
      h(2, 'A Few Common Performance Mistakes'),
      table(['Habit', 'Why it costs something'], [
        ['Deeply nested or overly specific selectors', 'Slower for the browser to match against every element'],
        ['Animating width, height, or top/left', 'Forces the browser to recalculate layout every frame'],
        ['Animating transform and opacity instead', 'The browser can composite these on the GPU without recalculating layout'],
        ['Loading every font weight "just in case"', 'Each unused weight is wasted download size'],
      ]),
      callout('tip', '<p>The single most impactful performance swap: animate <code>transform</code>/<code>opacity</code> instead of <code>width</code>/<code>height</code>/<code>top</code>/<code>left</code> wherever the same visual effect is achievable either way.</p>', 'The one habit worth remembering'),
    ],
  },
  bn: {
    title: 'CSS Accessibility ও Performance-এর বেসিক',
    metaTitle: 'CSS Accessibility ও Performance | Learn Computer Academy',
    metaDescription: 'Motion sensitivity আর কীবোর্ড user-দের সম্মান করা CSS-নির্দিষ্ট habit, আর এড়ানোর যোগ্য কিছু common performance ভুল।',
    blocks: [
      p('<hr><p>Accessibility কাজের বেশিরভাগ HTML-এর কাজ (HTML কোর্সের accessibility lesson-এ কভার করা), কিন্তু হাতেগোনা কিছু জিনিস specifically CSS-এর দায়িত্ব — আর কিছু common CSS habit চুপচাপ পেজের performance-এর ক্ষতি করে।</p><hr>'),
      h(2, 'Reduced Motion সম্মান করা', 'reduced-motion-সম্মান-করা'),
      p('<p>কিছু user তাদের OS motion কমাতে সেট করে — vestibular disorder-এর জন্য, বা সাধারণ পছন্দে। এই media query-তে animation wrap করা সেই setting-কে সম্মান করে।</p>'),
      code('css', '@media (prefers-reduced-motion: reduce) {\n  * {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}'),
      h(2, 'কখনো focus সরিয়ে না বদলিয়ে বাদ দেবেন না', 'কখনো-focus-সরিয়ে-না-বদলিয়ে-বাদ-দেবেন-না'),
      p('<p>একজন কীবোর্ড user পেজে তারা কোথায় আছে তা জানতে visible focus outline-এর উপর নির্ভর করে। কোনো replacement ছাড়া এটা সরালে পেজ কীবোর্ডে ব্যবহারের অযোগ্য হয়ে যায়।</p>'),
      code('css', '/* খারাপ — focus-এর একমাত্র visible চিহ্ন সরিয়ে দেয় */\n:focus {\n  outline: none;\n}\n\n/* ভালো — একটি স্পষ্ট custom style দিয়ে বদলায় */\n:focus-visible {\n  outline: 2px solid blue;\n  outline-offset: 2px;\n}'),
      h(2, 'Color Contrast'),
      p('<p>একটি সাদা background-এ হালকা ধূসর টেক্সট পরিষ্কার দেখাতে পারে, কিন্তু অনেক user-এর জন্য সত্যিকারভাবে পড়ার অযোগ্য। সাধারণ টেক্সটের জন্য অন্তত 4.5:1 একটি contrast ratio standard accessibility guideline (WCAG AA)।</p>'),
      h(2, 'কিছু Common Performance ভুল', 'কিছু-common-performance-ভুল'),
      table(['Habit', 'কেন এটা কিছু খরচ করে'], [
        ['গভীরভাবে nested বা অতিরিক্ত specific selector', 'প্রতিটি এলিমেন্টের বিরুদ্ধে match করতে ব্রাউজারের জন্য ধীর'],
        ['width, height, বা top/left animate করা', 'প্রতিটি frame-এ layout পুনরায় হিসাব করতে ব্রাউজারকে বাধ্য করে'],
        ['এর বদলে transform আর opacity animate করা', 'ব্রাউজার layout পুনরায় হিসাব না করে GPU-তে এগুলো composite করতে পারে'],
        ['"just in case" প্রতিটি font weight load করা', 'প্রতিটি অব্যবহৃত weight অপচয় করা download size'],
      ]),
      callout('tip', '<p>একক সবচেয়ে প্রভাবশালী performance swap: একই visual effect যেভাবেই অর্জনযোগ্য হোক না কেন, <code>width</code>/<code>height</code>/<code>top</code>/<code>left</code>-এর বদলে <code>transform</code>/<code>opacity</code> animate করুন।</p>', 'মনে রাখার যোগ্য একটি habit'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'css').single()
  if (catErr || !category) {
    console.error('Category "css" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] css/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] css/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `css/${lesson.slug}`
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
