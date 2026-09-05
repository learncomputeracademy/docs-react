#!/usr/bin/env node
// Extends the existing "HTML" category (36 migrated lessons) with 8 more
// lessons covering real gaps found against a roadmap.sh "HTML" roadmap PDF
// the user shared 2026-09-03 — asked "are everything in this document
// regarding html covered in our docs". Checked actual lesson content (not
// just tag-name mentions) before concluding a gap: e.g. html/blocks lists
// tag names like <b>, <sub>, <blockquote>, <abbr> in flat block/inline
// dumps but never explains any of them individually — that counts as NOT
// covered. User picked "add lessons for all 8" over AskUserQuestion.
//
// Not-a-gap, verified before excluding: how the web/HTTP/DNS/domains/
// browsers work (Computer Basics, Hosting & Deployment), SEO basics
// (dedicated SEO category), inline/internal/external CSS (verified present
// in css/intro). Priority Hints (loading=/fetchpriority) and CSP-for-iframes
// were judged niche/advanced and skipped per the user's chosen scope.
//
// Style: matches the terse, W3Schools-style tone of the rest of this
// migrated category (short paragraphs, <hr> separators, small code
// examples) rather than this session's newer, more discursive house style
// used for brand-new categories (cybersecurity, ui-ux) — this is extending
// old content, not authoring a new course.
//
// sort_order continues from 37 (existing max is 36).
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-html-gap-content.mjs [--dry-run]

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
let n = 37

lessons.push({
  slug: 'html-entities', sortOrder: n++,
  en: {
    title: 'HTML Entities',
    metaTitle: 'HTML Entities | Learn Computer Academy',
    metaDescription: 'Why some characters need a special code in HTML, and the entities used most often.',
    blocks: [
      p('<hr><p>Some characters are reserved in HTML. If you use the less than (&lt;) or greater than (&gt;) signs in your text, the browser might mix them up with a tag.</p><hr>'),
      p('<p>Character entities are used to display reserved characters, and other characters that are missing from a keyboard.</p>'),
      h(2, 'Reserved Characters'),
      code('html', '<p>I am 10 &lt; 20 and 5 &gt; 1.</p>'),
      p('<p>The output looks like this:</p><p>I am 10 &lt; 20 and 5 &gt; 1.</p>'),
      h(2, 'Common HTML Entities'),
      table(['Result', 'Description', 'Entity Name'], [
        ['&lt;', 'less than', '&amp;lt;'],
        ['&gt;', 'greater than', '&amp;gt;'],
        ['&amp;', 'ampersand', '&amp;amp;'],
        ['&quot;', 'double quotation mark', '&amp;quot;'],
        ['(space)', 'non-breaking space', '&amp;nbsp;'],
        ['&copy;', 'copyright', '&amp;copy;'],
      ]),
      p('<hr><p>An entity name is often easier to remember than a number, but a browser may not support all entity names, while support for numbers is much better.</p>'),
      callout('tip', '<p>Use <code>&amp;nbsp;</code> whenever you need a space the browser won\'t collapse — see the next lesson for why plain spaces get collapsed in the first place.</p>', 'Where this comes up most'),
    ],
  },
  bn: {
    title: 'HTML এন্টিটি',
    metaTitle: 'HTML এন্টিটি | Learn Computer Academy',
    metaDescription: 'HTML-এ কেন কিছু ক্যারেক্টারের জন্য একটি বিশেষ কোড দরকার, আর সবচেয়ে বেশি ব্যবহৃত এন্টিটিগুলো।',
    blocks: [
      p('<hr><p>HTML-এ কিছু ক্যারেক্টার সংরক্ষিত। আপনার টেক্সটে less than (&lt;) বা greater than (&gt;) চিহ্ন ব্যবহার করলে, ব্রাউজার সেটাকে একটি ট্যাগের সাথে গুলিয়ে ফেলতে পারে।</p><hr>'),
      p('<p>Character entity সংরক্ষিত ক্যারেক্টার, আর কীবোর্ডে নেই এমন অন্য ক্যারেক্টার দেখানোর জন্য ব্যবহার করা হয়।</p>'),
      h(2, 'সংরক্ষিত ক্যারেক্টার', 'সংরক্ষিত-ক্যারেক্টার'),
      code('html', '<p>I am 10 &lt; 20 and 5 &gt; 1.</p>'),
      p('<p>আউটপুট দেখতে এমন:</p><p>I am 10 &lt; 20 and 5 &gt; 1.</p>'),
      h(2, 'সাধারণ HTML এন্টিটি', 'সাধারণ-html-এন্টিটি'),
      table(['ফলাফল', 'বর্ণনা', 'এন্টিটি নাম'], [
        ['&lt;', 'less than', '&amp;lt;'],
        ['&gt;', 'greater than', '&amp;gt;'],
        ['&amp;', 'ampersand', '&amp;amp;'],
        ['&quot;', 'double quotation mark', '&amp;quot;'],
        ['(স্পেস)', 'non-breaking space', '&amp;nbsp;'],
        ['&copy;', 'copyright', '&amp;copy;'],
      ]),
      p('<hr><p>একটি সংখ্যার চেয়ে একটি entity নাম প্রায়ই মনে রাখা সহজ, কিন্তু একটি ব্রাউজার সব entity নাম সাপোর্ট নাও করতে পারে, যেখানে সংখ্যার সাপোর্ট অনেক ভালো।</p>'),
      callout('tip', '<p>ব্রাউজার collapse করবে না এমন একটি স্পেস দরকার হলেই <code>&amp;nbsp;</code> ব্যবহার করুন — সাধারণ স্পেস কেন প্রথমে collapse হয় তার জন্য পরের lesson দেখুন।</p>', 'এটা সবচেয়ে বেশি কোথায় কাজে লাগে'),
    ],
  },
})

lessons.push({
  slug: 'case-insensitivity-and-whitespace', sortOrder: n++,
  en: {
    title: 'HTML Case Sensitivity & Whitespace',
    metaTitle: 'HTML Case Sensitivity & Whitespace | Learn Computer Academy',
    metaDescription: 'Why HTML tags work in any case but lowercase is standard, and why the browser collapses extra spaces and line breaks.',
    blocks: [
      p('<hr><p>Two small quirks of HTML surprise a lot of beginners: tag names don\'t care about capitalization, and extra spaces in your code often just... disappear in the output.</p><hr>'),
      h(2, 'HTML Is Case-Insensitive'),
      p('<p><code>&lt;P&gt;</code>, <code>&lt;p&gt;</code>, and <code>&lt;P&gt;</code> all mean the same thing to a browser. Attribute names work the same way.</p>'),
      code('html', '<P>This works.</P>\n<p>So does this.</p>'),
      callout('note', '<p>The <a href="https://www.w3.org">W3C</a> recommends lowercase in HTML, and it\'s required in stricter formats like XHTML. Every example on this site uses lowercase for that reason.</p>', 'Works either way — lowercase is the convention'),
      h(2, 'HTML Collapses Whitespace'),
      p('<p>A browser reduces any sequence of spaces, tabs, and line breaks down to a single space when displaying text. Indenting your code for readability never changes how it renders.</p>'),
      code('html', '<p>This       paragraph\ncontains a lot of  spacing\nand line breaks.</p>'),
      p('<p>The browser output is: <i>This paragraph contains a lot of spacing and line breaks.</i></p>'),
      h(2, 'When Whitespace Needs to Be Preserved'),
      table(['Need', 'Use'], [
        ['A single space that never collapses', '&amp;nbsp;'],
        ['Whitespace exactly as typed — code, ASCII art, poetry', 'The &lt;pre&gt; tag'],
      ]),
    ],
  },
  bn: {
    title: 'HTML Case Sensitivity ও Whitespace',
    metaTitle: 'HTML Case Sensitivity ও Whitespace | Learn Computer Academy',
    metaDescription: 'কেন HTML ট্যাগ যেকোনো case-এ কাজ করে কিন্তু lowercase-ই স্ট্যান্ডার্ড, আর কেন ব্রাউজার অতিরিক্ত স্পেস আর লাইন ব্রেক collapse করে দেয়।',
    blocks: [
      p('<hr><p>HTML-এর দুটি ছোট quirk অনেক শুরুর দিকের মানুষকে অবাক করে: ট্যাগের নাম capitalization নিয়ে পরোয়া করে না, আর কোডে অতিরিক্ত স্পেস প্রায়ই আউটপুটে... হারিয়ে যায়।</p><hr>'),
      h(2, 'HTML Case-Insensitive', 'html-case-insensitive'),
      p('<p><code>&lt;P&gt;</code>, <code>&lt;p&gt;</code>, আর <code>&lt;P&gt;</code> — একটি ব্রাউজারের কাছে সবগুলোর মানে একই। Attribute-এর নামও একইভাবে কাজ করে।</p>'),
      code('html', '<P>This works.</P>\n<p>So does this.</p>'),
      callout('note', '<p><a href="https://www.w3.org">W3C</a> HTML-এ lowercase সুপারিশ করে, আর XHTML-এর মতো stricter format-এ এটা বাধ্যতামূলক। এই কারণে এই সাইটের প্রতিটি উদাহরণ lowercase ব্যবহার করে।</p>', 'দুটোই কাজ করে — lowercase-ই convention'),
      h(2, 'HTML Whitespace Collapse করে', 'html-whitespace-collapse-করে'),
      p('<p>টেক্সট দেখানোর সময় একটি ব্রাউজার স্পেস, ট্যাব, আর লাইন ব্রেকের যেকোনো ধারাবাহিকতা একটি মাত্র স্পেসে নামিয়ে আনে। readability-র জন্য আপনার কোড indent করলে এটা কীভাবে render হয় তা কখনো বদলায় না।</p>'),
      code('html', '<p>This       paragraph\ncontains a lot of  spacing\nand line breaks.</p>'),
      p('<p>ব্রাউজারের আউটপুট: <i>This paragraph contains a lot of spacing and line breaks.</i></p>'),
      h(2, 'যখন Whitespace সংরক্ষণ করা দরকার', 'যখন-whitespace-সংরক্ষণ-করা-দরকার'),
      table(['প্রয়োজন', 'ব্যবহার করুন'], [
        ['কখনো collapse না হওয়া একটি স্পেস', '&amp;nbsp;'],
        ['ঠিক যেমন টাইপ করা হয়েছে সেই whitespace — কোড, ASCII art, কবিতা', '&lt;pre&gt; ট্যাগ'],
      ]),
    ],
  },
})

lessons.push({
  slug: 'data-attributes', sortOrder: n++,
  en: {
    title: 'HTML Data Attributes',
    metaTitle: 'HTML Data Attributes | Learn Computer Academy',
    metaDescription: 'How data-* attributes let you store extra information on an HTML element, readable from CSS and JavaScript, without inventing a non-standard attribute.',
    blocks: [
      p('<hr><p>Sometimes an element needs to carry extra information that isn\'t meant for the user to see directly, but is meant for your own CSS or JavaScript to read. That\'s exactly what data attributes are for.</p><hr>'),
      h(2, 'The data-* Syntax'),
      p('<p>Any attribute name starting with <code>data-</code> is valid HTML and always safe to add — the browser ignores it visually, and never confuses it with a built-in attribute.</p>'),
      code('html', '<article\n  id="post-33"\n  data-author-id="42"\n  data-category="frontend">\n  ...\n</article>'),
      h(2, 'Reading a Data Attribute in JavaScript'),
      p('<p>Every data attribute is available on an element\'s <code>dataset</code> property, with the name converted to camelCase.</p>'),
      code('js', 'const article = document.querySelector(\'#post-33\')\narticle.dataset.authorId    // "42"\narticle.dataset.category    // "frontend"'),
      h(2, 'Reading a Data Attribute in CSS'),
      p('<p>A data attribute can also be selected and even displayed directly in CSS, using an attribute selector.</p>'),
      code('css', 'article[data-category="frontend"] {\n  border-left: 4px solid blue;\n}'),
      callout('note', '<p>Data attributes are the standard way to attach custom information to an element — avoid inventing your own non-standard attribute names, which older browsers and validators may reject.</p>', 'Why not just make up an attribute'),
    ],
  },
  bn: {
    title: 'HTML Data Attribute',
    metaTitle: 'HTML Data Attribute | Learn Computer Academy',
    metaDescription: 'কীভাবে data-* attribute একটি HTML এলিমেন্টে অতিরিক্ত তথ্য সংরক্ষণ করতে দেয়, CSS আর JavaScript থেকে readable, কোনো non-standard attribute না বানিয়েই।',
    blocks: [
      p('<hr><p>কখনো কখনো একটি এলিমেন্টের অতিরিক্ত তথ্য বহন করা দরকার যা user-কে সরাসরি দেখানোর জন্য না, বরং আপনার নিজের CSS বা JavaScript পড়ার জন্য। Data attribute ঠিক এই কারণেই আছে।</p><hr>'),
      h(2, 'data-* সিনট্যাক্স', 'data-সিনট্যাক্স'),
      p('<p><code>data-</code> দিয়ে শুরু হওয়া যেকোনো attribute নাম বৈধ HTML আর যোগ করা সবসময় নিরাপদ — ব্রাউজার এটা visually ignore করে, আর কখনো একটি built-in attribute-এর সাথে গুলিয়ে ফেলে না।</p>'),
      code('html', '<article\n  id="post-33"\n  data-author-id="42"\n  data-category="frontend">\n  ...\n</article>'),
      h(2, 'JavaScript-এ একটি Data Attribute পড়া', 'javascript-এ-একটি-data-attribute-পড়া'),
      p('<p>প্রতিটি data attribute একটি এলিমেন্টের <code>dataset</code> property-তে পাওয়া যায়, নাম camelCase-এ রূপান্তরিত হয়ে।</p>'),
      code('js', 'const article = document.querySelector(\'#post-33\')\narticle.dataset.authorId    // "42"\narticle.dataset.category    // "frontend"'),
      h(2, 'CSS-এ একটি Data Attribute পড়া', 'css-এ-একটি-data-attribute-পড়া'),
      p('<p>একটি attribute selector ব্যবহার করে CSS-এও একটি data attribute select আর এমনকি সরাসরি দেখানো যায়।</p>'),
      code('css', 'article[data-category="frontend"] {\n  border-left: 4px solid blue;\n}'),
      callout('note', '<p>একটি এলিমেন্টে custom তথ্য যোগ করার standard উপায় data attribute — নিজের non-standard attribute নাম বানানো এড়িয়ে চলুন, পুরনো ব্রাউজার আর validator যা reject করতে পারে।</p>', 'কেন শুধু একটি attribute বানানো যাবে না'),
    ],
  },
})

lessons.push({
  slug: 'text-formatting-tags', sortOrder: n++,
  en: {
    title: 'HTML Text Formatting Tags',
    metaTitle: 'HTML Text Formatting Tags | Learn Computer Academy',
    metaDescription: "b vs strong, i vs em, sub, sup, pre, del, ins, and s — what each formatting tag actually means, not just how it looks.",
    blocks: [
      p('<hr><p>HTML has several tags that visually resemble each other but mean different things. The visual result of <code>&lt;b&gt;</code> and <code>&lt;strong&gt;</code> is identical bold text by default — but only one of them tells a screen reader "this is important."</p><hr>'),
      h(2, 'Bold and Importance — b vs strong'),
      table(['Tag', 'Meaning'], [
        ['&lt;b&gt;', 'Bold text with no extra importance — a stylistic offset only'],
        ['&lt;strong&gt;', 'Text of strong importance — read with emphasis by screen readers'],
      ]),
      h(2, 'Italic and Emphasis — i vs em'),
      table(['Tag', 'Meaning'], [
        ['&lt;i&gt;', 'Italic text with no extra emphasis — a technical term, a ship name, a thought'],
        ['&lt;em&gt;', 'Emphasized text — changes the meaning of the sentence when read aloud'],
      ]),
      h(2, 'Subscript and Superscript'),
      code('html', 'H<sub>2</sub>O\nE = mc<sup>2</sup>'),
      h(2, 'Preformatted Text'),
      p('<p><code>&lt;pre&gt;</code> displays text exactly as written in the HTML — spaces, line breaks, and all — usually shown in a monospace font.</p>'),
      code('html', '<pre>\n  Line one\n    Line two, indented\n</pre>'),
      h(2, 'Marking Changed Text — del, ins, s'),
      table(['Tag', 'Meaning'], [
        ['&lt;del&gt;', 'Text that has been deleted from a document — shown with strikethrough'],
        ['&lt;ins&gt;', 'Text that has been inserted into a document — shown underlined'],
        ['&lt;s&gt;', 'Text that is no longer accurate or relevant, but wasn\'t part of an edit — a price no longer valid, for example'],
      ]),
      code('html', '<p><del>$50</del> <ins>$35</ins> — sale price!</p>\n<p><s>Meeting moved to 3pm</s> — now 4pm</p>'),
    ],
  },
  bn: {
    title: 'HTML টেক্সট ফরম্যাটিং ট্যাগ',
    metaTitle: 'HTML টেক্সট ফরম্যাটিং ট্যাগ | Learn Computer Academy',
    metaDescription: 'b বনাম strong, i বনাম em, sub, sup, pre, del, ins, আর s — প্রতিটি ফরম্যাটিং ট্যাগ আসলে কী মানে, শুধু দেখতে কেমন তা না।',
    blocks: [
      p('<hr><p>HTML-এ এমন বেশ কিছু ট্যাগ আছে যা visually একে অপরের মতো দেখতে কিন্তু ভিন্ন কিছু মানে বোঝায়। <code>&lt;b&gt;</code> আর <code>&lt;strong&gt;</code>-এর visual ফলাফল default-এ একই bold টেক্সট — কিন্তু শুধু একটি screen reader-কে বলে "এটা গুরুত্বপূর্ণ।"</p><hr>'),
      h(2, 'Bold ও গুরুত্ব — b বনাম strong', 'bold-ও-গুরুত্ব-b-বনাম-strong'),
      table(['ট্যাগ', 'মানে'], [
        ['&lt;b&gt;', 'অতিরিক্ত গুরুত্ব ছাড়া bold টেক্সট — শুধু একটি stylistic পার্থক্য'],
        ['&lt;strong&gt;', 'শক্তিশালী গুরুত্বের টেক্সট — screen reader emphasis দিয়ে পড়ে'],
      ]),
      h(2, 'Italic ও Emphasis — i বনাম em', 'italic-ও-emphasis-i-বনাম-em'),
      table(['ট্যাগ', 'মানে'], [
        ['&lt;i&gt;', 'অতিরিক্ত emphasis ছাড়া italic টেক্সট — একটি technical term, একটি জাহাজের নাম, একটি চিন্তা'],
        ['&lt;em&gt;', 'জোর দেওয়া টেক্সট — জোরে পড়লে বাক্যের মানে বদলে দেয়'],
      ]),
      h(2, 'Subscript ও Superscript'),
      code('html', 'H<sub>2</sub>O\nE = mc<sup>2</sup>'),
      h(2, 'Preformatted টেক্সট'),
      p('<p><code>&lt;pre&gt;</code> HTML-এ ঠিক যেমন লেখা হয়েছে টেক্সট তেমনই দেখায় — স্পেস, লাইন ব্রেক, সবকিছু সহ — সাধারণত একটি monospace font-এ দেখানো হয়।</p>'),
      code('html', '<pre>\n  Line one\n    Line two, indented\n</pre>'),
      h(2, 'বদলে যাওয়া টেক্সট চিহ্নিত করা — del, ins, s', 'বদলে-যাওয়া-টেক্সট-চিহ্নিত-করা-del-ins-s'),
      table(['ট্যাগ', 'মানে'], [
        ['&lt;del&gt;', 'একটি document থেকে মুছে ফেলা টেক্সট — strikethrough দিয়ে দেখানো'],
        ['&lt;ins&gt;', 'একটি document-এ যোগ করা টেক্সট — underline দিয়ে দেখানো'],
        ['&lt;s&gt;', 'যে টেক্সট আর সঠিক বা প্রাসঙ্গিক না, কিন্তু কোনো edit-এর অংশ ছিল না — যেমন আর বৈধ না এমন একটি দাম'],
      ]),
      code('html', '<p><del>$50</del> <ins>$35</ins> — sale price!</p>\n<p><s>Meeting moved to 3pm</s> — now 4pm</p>'),
    ],
  },
})

lessons.push({
  slug: 'quotation-and-citation-tags', sortOrder: n++,
  en: {
    title: 'HTML Quotation and Citation Tags',
    metaTitle: 'HTML Quotation and Citation Tags | Learn Computer Academy',
    metaDescription: 'blockquote, q, abbr, cite, dfn, and address — the tags for quoting, citing, defining, and marking up contact information.',
    blocks: [
      p('<hr><p>HTML has dedicated tags for quoting someone, citing a source, defining a term, and marking up contact information — each carries real meaning, not just a visual style.</p><hr>'),
      h(2, 'Long Quotations — blockquote'),
      p('<p>Used for a quotation that spans multiple lines or its own block. Browsers usually indent it by default.</p>'),
      code('html', '<blockquote cite="https://example.com/source">\n  This is a longer quotation from another source.\n</blockquote>'),
      h(2, 'Short, Inline Quotations — q'),
      p('<p>Used for a short quotation inside a line of text. The browser adds quotation marks automatically.</p>'),
      code('html', '<p>As she put it, <q>this changes everything.</q></p>'),
      h(2, 'Naming a Source — cite'),
      code('html', '<p><cite>The Great Gatsby</cite> was published in 1925.</p>'),
      h(2, 'Defining a Term — dfn'),
      code('html', '<p><dfn>HTML</dfn> stands for HyperText Markup Language.</p>'),
      h(2, 'Contact Information — address'),
      p('<p>Wraps contact information for the nearest article or the whole page — an email, a physical address, a phone number.</p>'),
      code('html', '<address>\n  Written by <a href="mailto:jon@example.com">Jon Doe</a>.<br>\n  Visit us at Example.com\n</address>'),
      table(['Tag', 'Use for'], [
        ['&lt;blockquote&gt;', 'A quotation that stands as its own block'],
        ['&lt;q&gt;', 'A short quotation inline within a sentence'],
        ['&lt;cite&gt;', 'The title of a work being referenced'],
        ['&lt;dfn&gt;', 'The defining instance of a term'],
        ['&lt;address&gt;', 'Contact information for a page or article'],
      ]),
    ],
  },
  bn: {
    title: 'HTML Quotation ও Citation ট্যাগ',
    metaTitle: 'HTML Quotation ও Citation ট্যাগ | Learn Computer Academy',
    metaDescription: 'blockquote, q, abbr, cite, dfn, আর address — quote করা, cite করা, define করা, আর contact তথ্য মার্কআপ করার ট্যাগ।',
    blocks: [
      p('<hr><p>কাউকে quote করা, একটি source cite করা, একটি term define করা, আর contact তথ্য মার্কআপ করার জন্য HTML-এ নির্দিষ্ট ট্যাগ আছে — প্রতিটাই আসল মানে বহন করে, শুধু একটি visual style না।</p><hr>'),
      h(2, 'লম্বা Quotation — blockquote', 'লম্বা-quotation-blockquote'),
      p('<p>একাধিক লাইন বা নিজের একটি block জুড়ে থাকা একটি quotation-এর জন্য ব্যবহৃত। ব্রাউজার সাধারণত default-এ এটা indent করে।</p>'),
      code('html', '<blockquote cite="https://example.com/source">\n  This is a longer quotation from another source.\n</blockquote>'),
      h(2, 'ছোট, Inline Quotation — q', 'ছোট-inline-quotation-q'),
      p('<p>একটি লাইন টেক্সটের ভেতরে একটি ছোট quotation-এর জন্য ব্যবহৃত। ব্রাউজার স্বয়ংক্রিয়ভাবে quotation mark যোগ করে।</p>'),
      code('html', '<p>As she put it, <q>this changes everything.</q></p>'),
      h(2, 'একটি Source-এর নাম দেওয়া — cite', 'একটি-source-এর-নাম-দেওয়া-cite'),
      code('html', '<p><cite>The Great Gatsby</cite> was published in 1925.</p>'),
      h(2, 'একটি Term Define করা — dfn', 'একটি-term-define-করা-dfn'),
      code('html', '<p><dfn>HTML</dfn> stands for HyperText Markup Language.</p>'),
      h(2, 'Contact তথ্য — address', 'contact-তথ্য-address'),
      p('<p>নিকটতম article বা পুরো পেজের contact তথ্য জড়িয়ে রাখে — একটি email, একটি physical address, একটি phone number।</p>'),
      code('html', '<address>\n  Written by <a href="mailto:jon@example.com">Jon Doe</a>.<br>\n  Visit us at Example.com\n</address>'),
      table(['ট্যাগ', 'কী জন্য ব্যবহার'], [
        ['&lt;blockquote&gt;', 'নিজের একটি block হিসেবে দাঁড়ানো একটি quotation'],
        ['&lt;q&gt;', 'একটি বাক্যের ভেতরে একটি ছোট inline quotation'],
        ['&lt;cite&gt;', 'যে কাজের কথা বলা হচ্ছে তার শিরোনাম'],
        ['&lt;dfn&gt;', 'একটি term-এর defining instance'],
        ['&lt;address&gt;', 'একটি পেজ বা article-এর contact তথ্য'],
      ]),
    ],
  },
})

lessons.push({
  slug: 'definition-lists', sortOrder: n++,
  en: {
    title: 'HTML Definition Lists',
    metaTitle: 'HTML Definition Lists | Learn Computer Academy',
    metaDescription: 'The dl, dt, and dd tags — a third list type in HTML, built for terms and their descriptions.',
    blocks: [
      p('<hr><p>Alongside ordered and unordered lists, HTML has a third list type built specifically for a list of terms and their descriptions — a glossary, an FAQ, a set of metadata.</p><hr>'),
      h(2, 'The Three Tags'),
      table(['Tag', 'Meaning'], [
        ['&lt;dl&gt;', 'Description list — the container for the whole list'],
        ['&lt;dt&gt;', 'Description term — the word or phrase being defined'],
        ['&lt;dd&gt;', 'Description details — the definition or description itself'],
      ]),
      h(2, 'A Basic Example'),
      code('html', '<dl>\n  <dt>HTML</dt>\n  <dd>The standard markup language for web pages.</dd>\n\n  <dt>CSS</dt>\n  <dd>The language used to style an HTML document.</dd>\n</dl>'),
      h(2, 'One Term, Multiple Descriptions'),
      p('<p>A single <code>&lt;dt&gt;</code> can be followed by more than one <code>&lt;dd&gt;</code> when a term has several descriptions worth listing separately.</p>'),
      code('html', '<dl>\n  <dt>Coffee</dt>\n  <dd>Black hot drink</dd>\n  <dd>Contains caffeine</dd>\n</dl>'),
    ],
  },
  bn: {
    title: 'HTML Definition List',
    metaTitle: 'HTML Definition List | Learn Computer Academy',
    metaDescription: 'dl, dt, আর dd ট্যাগ — HTML-এ একটি তৃতীয় list type, term আর তাদের বর্ণনার জন্য বানানো।',
    blocks: [
      p('<hr><p>Ordered আর unordered list-এর পাশাপাশি, HTML-এ একটি তৃতীয় list type আছে বিশেষভাবে term আর তাদের বর্ণনার একটি list-এর জন্য বানানো — একটি glossary, একটি FAQ, একটি metadata সেট।</p><hr>'),
      h(2, 'তিনটি ট্যাগ', 'তিনটি-ট্যাগ'),
      table(['ট্যাগ', 'মানে'], [
        ['&lt;dl&gt;', 'Description list — পুরো list-এর container'],
        ['&lt;dt&gt;', 'Description term — যে শব্দ বা phrase define করা হচ্ছে'],
        ['&lt;dd&gt;', 'Description details — নিজের definition বা বর্ণনা'],
      ]),
      h(2, 'একটি মৌলিক উদাহরণ', 'একটি-মৌলিক-উদাহরণ'),
      code('html', '<dl>\n  <dt>HTML</dt>\n  <dd>The standard markup language for web pages.</dd>\n\n  <dt>CSS</dt>\n  <dd>The language used to style an HTML document.</dd>\n</dl>'),
      h(2, 'একটি Term, একাধিক বর্ণনা', 'একটি-term-একাধিক-বর্ণনা'),
      p('<p>একটি term-এর আলাদাভাবে list করার মতো বেশ কিছু বর্ণনা থাকলে একটি একক <code>&lt;dt&gt;</code>-এর পরে একাধিক <code>&lt;dd&gt;</code> আসতে পারে।</p>'),
      code('html', '<dl>\n  <dt>Coffee</dt>\n  <dd>Black hot drink</dd>\n  <dd>Contains caffeine</dd>\n</dl>'),
    ],
  },
})

lessons.push({
  slug: 'including-javascript', sortOrder: n++,
  en: {
    title: 'Including JavaScript in HTML',
    metaTitle: 'Including JavaScript in HTML | Learn Computer Academy',
    metaDescription: 'The script tag — inline vs. external JavaScript, and where to place it for a page that loads fast.',
    blocks: [
      p('<hr><p>The <code>&lt;script&gt;</code> tag is how JavaScript gets attached to an HTML page — either written directly inline, or loaded from a separate file. This lesson covers the HTML side; the full JavaScript course elsewhere on this site covers the language itself.</p><hr>'),
      h(2, 'Inline JavaScript'),
      p('<p>Code written directly between the opening and closing tags.</p>'),
      code('html', '<script>\n  console.log(\'Hello from inline JavaScript\')\n</script>'),
      h(2, 'External JavaScript'),
      p('<p>Code kept in its own <code>.js</code> file and loaded with the <code>src</code> attribute — usually the better choice, since the file can be cached by the browser and reused across pages.</p>'),
      code('html', '<script src="app.js"></script>'),
      h(2, 'Where to Place It'),
      table(['Placement', 'Effect'], [
        ['At the end of &lt;body&gt;', 'The page\'s HTML renders first, then the script runs — the traditional, safest default'],
        ['In &lt;head&gt;, with the defer attribute', 'The script downloads in the background while the page parses, then runs after — modern equivalent, without blocking rendering'],
        ['In &lt;head&gt;, with no defer', 'The script downloads and runs before the rest of the page parses — blocks rendering, usually avoided'],
      ]),
      code('html', '<head>\n  <script src="app.js" defer></script>\n</head>'),
      callout('tip', '<p>When in doubt, either place the script tag right before <code>&lt;/body&gt;</code>, or use <code>defer</code> in the head — both avoid the common beginner mistake of a script trying to find an element on the page that hasn\'t loaded yet.</p>', 'The most common beginner bug'),
    ],
  },
  bn: {
    title: 'HTML-এ JavaScript যুক্ত করা',
    metaTitle: 'HTML-এ JavaScript যুক্ত করা | Learn Computer Academy',
    metaDescription: 'Script ট্যাগ — inline বনাম external JavaScript, আর দ্রুত load হওয়া একটি পেজের জন্য এটা কোথায় রাখতে হয়।',
    blocks: [
      p('<hr><p><code>&lt;script&gt;</code> ট্যাগ হলো JavaScript একটি HTML পেজে কীভাবে যুক্ত হয় — হয় সরাসরি inline লেখা, বা একটি আলাদা file থেকে load করা। এই lesson HTML-এর দিকটা কভার করে; এই সাইটের অন্য জায়গায় পূর্ণ JavaScript কোর্স ভাষাটাই কভার করে।</p><hr>'),
      h(2, 'Inline JavaScript'),
      p('<p>ওপেনিং আর ক্লোজিং ট্যাগের মাঝে সরাসরি লেখা কোড।</p>'),
      code('html', '<script>\n  console.log(\'Hello from inline JavaScript\')\n</script>'),
      h(2, 'External JavaScript'),
      p('<p>নিজের একটি <code>.js</code> file-এ রাখা আর <code>src</code> attribute দিয়ে load করা কোড — সাধারণত ভালো পছন্দ, কারণ file-টা ব্রাউজার cache করতে পারে আর একাধিক পেজে reuse করতে পারে।</p>'),
      code('html', '<script src="app.js"></script>'),
      h(2, 'এটা কোথায় রাখবেন', 'এটা-কোথায়-রাখবেন'),
      table(['জায়গা', 'প্রভাব'], [
        ['&lt;body&gt;-এর শেষে', 'পেজের HTML আগে render হয়, তারপর script চলে — প্রথাগত, সবচেয়ে নিরাপদ default'],
        ['&lt;head&gt;-এ, defer attribute সহ', 'পেজ parse হওয়ার সময় ব্যাকগ্রাউন্ডে script download হয়, তারপর চলে — modern সমতুল্য, rendering block না করে'],
        ['&lt;head&gt;-এ, defer ছাড়া', 'বাকি পেজ parse হওয়ার আগে script download আর চলে — rendering block করে, সাধারণত এড়ানো হয়'],
      ]),
      code('html', '<head>\n  <script src="app.js" defer></script>\n</head>'),
      callout('tip', '<p>সন্দেহ হলে, script ট্যাগ <code>&lt;/body&gt;</code>-এর ঠিক আগে রাখুন, বা head-এ <code>defer</code> ব্যবহার করুন — দুটোই এখনো load হয়নি এমন একটি এলিমেন্ট খোঁজার চেষ্টা করা একটি script-এর সাধারণ শুরুর দিকের ভুল এড়ায়।</p>', 'সবচেয়ে সাধারণ শুরুর দিকের bug'),
    ],
  },
})

lessons.push({
  slug: 'accessibility-basics', sortOrder: n++,
  en: {
    title: 'HTML Accessibility Basics',
    metaTitle: 'HTML Accessibility Basics | Learn Computer Academy',
    metaDescription: 'The handful of HTML habits — alt text, labels, and semantic tags — that make a page usable for people relying on a screen reader or keyboard.',
    blocks: [
      p('<hr><p>Accessibility means a page works for everyone, including people using a screen reader, a keyboard instead of a mouse, or a browser zoomed in far past 100%. Most of it comes from a handful of plain HTML habits, not a separate skill.</p><hr>'),
      h(2, 'Alt Text on Every Image'),
      p('<p>The <code>alt</code> attribute is read aloud by a screen reader in place of the image. Describe what the image conveys, not just what it literally shows.</p>'),
      code('html', '<img src="chart.png" alt="Bar chart showing sales doubling from January to June">'),
      h(2, 'Labels on Every Form Input'),
      p('<p>A <code>&lt;label&gt;</code> connected to its input via a matching <code>for</code> and <code>id</code> lets a screen reader announce what a field is for, and lets a click anywhere on the label focus the input.</p>'),
      code('html', '<label for="email">Email address</label>\n<input type="email" id="email" name="email">'),
      h(2, 'Semantic Tags Over div Soup'),
      p('<p>Using <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;button&gt;</code>, and <code>&lt;header&gt;</code> instead of generic <code>&lt;div&gt;</code>s for everything gives a screen reader real landmarks to jump between — this is the same semantic elements covered earlier in this course, and accessibility is the main reason they exist.</p>'),
      h(2, 'A Basic ARIA Attribute'),
      p('<p>When an icon-only button has no visible text, <code>aria-label</code> gives it an accessible name.</p>'),
      code('html', '<button aria-label="Close menu">✕</button>'),
      table(['Habit', 'Who it helps'], [
        ['alt text on images', 'Screen reader users'],
        ['label connected to every input', 'Screen reader users, and anyone clicking to focus a field'],
        ['Semantic tags instead of generic divs', 'Screen reader users navigating by landmark'],
        ['Visible focus states, keyboard-reachable controls', 'Keyboard-only users, no mouse'],
      ]),
      callout('note', '<p>This lesson is deliberately basic — a full accessibility audit (color contrast, focus order, complex ARIA patterns) is its own deep topic. These four habits alone cover a large share of real-world accessibility problems.</p>', 'This is a starting point, not the whole subject'),
    ],
  },
  bn: {
    title: 'HTML Accessibility-র বেসিক',
    metaTitle: 'HTML Accessibility-র বেসিক | Learn Computer Academy',
    metaDescription: 'হাতেগোনা কিছু HTML habit — alt text, label, আর semantic ট্যাগ — যা একটি screen reader বা কীবোর্ডের উপর নির্ভরশীল মানুষের জন্য একটি পেজ usable বানায়।',
    blocks: [
      p('<hr><p>Accessibility মানে একটি পেজ সবার জন্য কাজ করে, একটি screen reader ব্যবহার করা, মাউসের বদলে একটি কীবোর্ড ব্যবহার করা, বা 100%-এর অনেক বেশি zoom করা একটি ব্রাউজার ব্যবহার করা মানুষ সহ। এর বেশিরভাগ হাতেগোনা কিছু সাধারণ HTML habit থেকে আসে, একটি আলাদা দক্ষতা না।</p><hr>'),
      h(2, 'প্রতিটি ছবিতে Alt Text', 'প্রতিটি-ছবিতে-alt-text'),
      p('<p><code>alt</code> attribute ছবির জায়গায় একটি screen reader জোরে পড়ে। ছবিটা আক্ষরিকভাবে কী দেখায় শুধু তা না, এটা কী বোঝায় তা বর্ণনা করুন।</p>'),
      code('html', '<img src="chart.png" alt="Bar chart showing sales doubling from January to June">'),
      h(2, 'প্রতিটি Form Input-এ Label', 'প্রতিটি-form-input-এ-label'),
      p('<p>একটি মিলে যাওয়া <code>for</code> আর <code>id</code>-এর মাধ্যমে এর input-এর সাথে যুক্ত একটি <code>&lt;label&gt;</code> একটি screen reader-কে একটি field কীসের জন্য তা ঘোষণা করতে দেয়, আর label-এর যেকোনো জায়গায় click করে input-এ focus করতে দেয়।</p>'),
      code('html', '<label for="email">Email address</label>\n<input type="email" id="email" name="email">'),
      h(2, 'div Soup-এর বদলে Semantic ট্যাগ', 'div-soup-এর-বদলে-semantic-ট্যাগ'),
      p('<p>সবকিছুর জন্য generic <code>&lt;div&gt;</code>-এর বদলে <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;button&gt;</code>, আর <code>&lt;header&gt;</code> ব্যবহার করলে একটি screen reader-কে লাফ দেওয়ার জন্য আসল landmark দেয় — এটা এই কোর্সের আগে কভার করা একই semantic element, আর accessibility-ই এগুলো থাকার প্রধান কারণ।</p>'),
      h(2, 'একটি মৌলিক ARIA Attribute', 'একটি-মৌলিক-aria-attribute'),
      p('<p>একটি icon-only button-এর কোনো visible টেক্সট না থাকলে, <code>aria-label</code> এটাকে একটি accessible নাম দেয়।</p>'),
      code('html', '<button aria-label="Close menu">✕</button>'),
      table(['Habit', 'কাকে সাহায্য করে'], [
        ['ছবিতে alt text', 'Screen reader user'],
        ['প্রতিটি input-এর সাথে যুক্ত label', 'Screen reader user, আর একটি field focus করতে click করা যে কেউ'],
        ['Generic div-এর বদলে semantic ট্যাগ', 'landmark দিয়ে navigate করা screen reader user'],
        ['Visible focus state, কীবোর্ড-দিয়ে-পৌঁছানো control', 'শুধু কীবোর্ড ব্যবহারকারী, কোনো মাউস নেই'],
      ]),
      callout('note', '<p>এই lesson ইচ্ছাকৃতভাবে basic — একটি পূর্ণ accessibility audit (color contrast, focus order, জটিল ARIA pattern) নিজেই একটি গভীর topic। এই চারটা habit একাই real-world accessibility সমস্যার একটা বড় অংশ কভার করে।</p>', 'এটা একটা শুরু, পুরো subject না'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'html').single()
  if (catErr || !category) {
    console.error('Category "html" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] html/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] html/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `html/${lesson.slug}`
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
