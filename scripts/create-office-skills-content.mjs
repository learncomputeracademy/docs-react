#!/usr/bin/env node
// New "Office Skills" category (created by scripts/create-office-category.mjs)
// — 36 lessons: MS Paint (5), MS Word (10), MS Excel (12), MS PowerPoint (8),
// closing "Free and Open-Source Alternatives" (1). Per the site owner
// (2026-08-17): one unified category, isometric image style matching the
// recent Basics/Hosting runs, MS Office primary with LibreOffice/OpenOffice/
// Google Docs-Sheets-Slides covered in one closing comparison lesson rather
// than a parallel tutorial track.
//
// No screenshots of real MS Office UI — no licensed install to screenshot
// from, and AI-generated fake UI risks looking wrong. 5 illustrative
// isometric diagrams total (one per app + one for the alternatives lesson),
// same restrained one-per-major-concept approach as the PHP/Python runs,
// not one per lesson.
//
// UI-specific terms (Ribbon, Tab, Cell, Formula, Slide, Layout, Theme, …)
// stay in English in the Bengali translations — that's literally what the
// English-language Office UI shows on screen, unlike general nouns
// (file/folder/path) which get transliterated per the site's established
// convention.
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-office-skills-content.mjs [--dry-run]

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
function code(language, source) { return { id: nanoid(12), type: 'code', language, code: source, runnable: false } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }
function img(publicId, alt, width, height, caption) { return { id: nanoid(12), type: 'image', publicId, alt, width, height, caption } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// ── Lessons ──────────────────────────────────────────────────────────────

const lessons = []
let n = 1

// ═══ MS PAINT (5) ═══════════════════════════════════════════════════════

lessons.push({
  slug: 'paint-introduction', sortOrder: n++,
  en: {
    title: 'Introduction to MS Paint',
    metaTitle: 'Introduction to MS Paint | Learn Computer Academy',
    metaDescription: 'What MS Paint is, the canvas, the toolbar, and why undo means you can never really break anything.',
    blocks: [
      p('<p><b>MS Paint</b> is the simplest drawing program on Windows — built in, no installation needed, and still the fastest way to sketch an idea, crop a screenshot, or draw a quick diagram.</p>'),
      h(2, 'Opening Paint and the Canvas'),
      p('<p>Search "Paint" in the Start menu. The blank white area is the <b>canvas</b> — everything you draw lives inside it, and its size in pixels is exactly the size of the final image file.</p>'),
      h(2, 'The Toolbar'),
      p('<p>Every tool lives in one Ribbon along the top — pencil, brush, shapes, eraser, fill, text, and a color palette below it. Click a tool once, then click or drag on the canvas to use it.</p>'),
      img('docs/img/office/paint-introduction-1-r2', 'A labeled mockup of a drawing application: Pencil, Brush, Eraser, Fill, Shapes, Text, and Select tool buttons; a Color 1 and Color 2 swatch with a size slider; a canvas showing a drawn circle and triangle; a status bar showing the canvas size in pixels', 1024, 768, 'Color 1 is the foreground color a tool draws with; Color 2 is the background color, used when erasing or right-click-drawing.'),
      h(2, 'Undo Is Your Safety Net'),
      p('<p><code>Ctrl+Z</code> undoes the last action, and you can press it repeatedly to step back through your whole session — there\'s no reason to be afraid of making a mistake.</p>'),
      table(['Shortcut', 'What it does'], [['Ctrl+Z', 'Undo the last action'], ['Ctrl+S', 'Save'], ['Ctrl+N', 'Start a new blank image']]),
      h(2, 'Zoom and Canvas Size'),
      p('<p>The zoom slider in the bottom-right corner changes how large the canvas <i>appears</i> on screen — it never changes the actual image. To change the real dimensions of the image itself, use <b>Image → Resize</b> instead, which asks for exact new pixel dimensions or a percentage.</p>'),
    ],
  },
  bn: {
    title: 'MS Paint পরিচিতি',
    metaTitle: 'MS Paint পরিচিতি | Learn Computer Academy',
    metaDescription: 'MS Paint আসলে কী, canvas, toolbar, আর কেন undo থাকলে সত্যিই কখনো কিছু নষ্ট হয় না।',
    blocks: [
      p('<p><b>MS Paint</b> হলো Windows-এর সবচেয়ে সহজ ড্রয়িং প্রোগ্রাম — বিল্ট-ইন, কোনো ইনস্টলেশন লাগে না, আর এখনো একটা আইডিয়া স্কেচ করার, একটা screenshot crop করার, বা একটা দ্রুত diagram আঁকার সবচেয়ে দ্রুত উপায়।</p>'),
      h(2, 'Paint খোলা আর Canvas', 'paint-খোলা-আর-canvas'),
      p('<p>Start মেনুতে "Paint" খুঁজুন। খালি সাদা জায়গাটা হলো <b>canvas</b> — আপনি যা আঁকেন সবই এর ভেতরে থাকে, আর এর pixel-এর size-ই আসল ছবির file-এর size।</p>'),
      h(2, 'Toolbar', 'toolbar'),
      p('<p>প্রতিটা টুল উপরের একটা Ribbon-এ থাকে — pencil, brush, shapes, eraser, fill, text, আর নিচে একটা color palette। একটা টুলে একবার ক্লিক করুন, তারপর canvas-এ ক্লিক বা drag করে সেটা ব্যবহার করুন।</p>'),
      img('docs/img/office/paint-introduction-1-r2', 'একটা ড্রয়িং অ্যাপ্লিকেশনের লেবেল করা mockup: Pencil, Brush, Eraser, Fill, Shapes, Text, আর Select টুল বাটন; একটা Color 1 আর Color 2 swatch, একটা size স্লাইডার সহ; একটা আঁকা circle আর triangle দেখানো canvas; pixel-এ canvas size দেখানো একটা status bar', 1024, 768, 'Color 1 হলো foreground color যা দিয়ে একটা টুল আঁকে; Color 2 হলো background color, মোছার সময় বা right-click-draw করার সময় ব্যবহৃত হয়।'),
      h(2, 'Undo আপনার নিরাপত্তার জাল', 'undo-আপনার-নিরাপত্তার-জাল'),
      p('<p><code>Ctrl+Z</code> শেষ কাজটা undo করে, আর বারবার চাপলে পুরো সেশন জুড়ে ধাপে ধাপে পিছিয়ে যেতে পারেন — ভুল করার ভয় পাওয়ার কোনো কারণ নেই।</p>'),
      table(['Shortcut', 'কী করে'], [['Ctrl+Z', 'শেষ কাজটা Undo করে'], ['Ctrl+S', 'Save করে'], ['Ctrl+N', 'নতুন একটা খালি ছবি শুরু করে']]),
      h(2, 'Zoom আর Canvas Size', 'zoom-আর-canvas-size'),
      p('<p>নিচে-ডানে zoom slider canvas স্ক্রিনে কতটা বড় <i>দেখাচ্ছে</i> তা বদলায় — এটা আসল image কখনো বদলায় না। Image-এর আসল dimension বদলাতে এর বদলে <b>Image → Resize</b> ব্যবহার করুন, যা সঠিক নতুন pixel dimension বা একটা percentage চায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'paint-drawing-tools', sortOrder: n++,
  en: {
    title: 'Basic Drawing Tools',
    metaTitle: 'Paint Basic Drawing Tools | Learn Computer Academy',
    metaDescription: "Paint's core tools — pencil, brush, shapes, and eraser — cover almost everything a quick sketch needs.",
    blocks: [
      p("<p>Paint's core tools cover almost everything a quick sketch needs — lines, shapes, freehand strokes, and an eraser.</p>"),
      h(2, 'Pencil and Brush'),
      p('<p>The <b>pencil</b> draws a thin, hard-edged line. The <b>brush</b> offers several thicker styles — calligraphy, crayon, watercolor — for a softer look. Both follow your mouse or touchpad exactly as you drag.</p>'),
      h(2, 'Shapes'),
      p('<p>Rectangle, ellipse, line, and arrow tools draw a clean shape by dragging from one corner to the other. Hold <b>Shift</b> while dragging a rectangle or ellipse to keep it a perfect square or circle.</p>'),
      h(2, 'Eraser'),
      p('<p>The eraser replaces whatever it drags over with the <b>background color</b>, not with transparency — worth knowing before erasing on top of a colored area, since it leaves a solid patch behind, not a hole.</p>'),
      table(['Tool', 'What it does'], [['Pencil', 'Thin, hard-edged freehand line'], ['Brush', 'Thicker, styled freehand stroke'], ['Shapes', 'Clean rectangle, ellipse, line, or arrow'], ['Eraser', "Paints over with the background color"]]),
      h(2, 'Outline vs Fill for Shapes'),
      p('<p>Every shape tool offers three styles: <b>outline only</b> (just the border, using Color 1), <b>outline with fill</b> (border in Color 1, inside filled with Color 2), and <b>fill only</b> (no visible border at all). The line thickness for the outline is set in a small dropdown that appears once a shape tool is selected.</p>'),
    ],
  },
  bn: {
    title: 'বেসিক ড্রয়িং টুল',
    metaTitle: 'Paint বেসিক ড্রয়িং টুল | Learn Computer Academy',
    metaDescription: 'Paint-এর মূল টুল — pencil, brush, shapes, আর eraser — একটা দ্রুত স্কেচের জন্য প্রায় সবকিছুই কভার করে।',
    blocks: [
      p('<p>Paint-এর মূল টুলগুলো একটা দ্রুত স্কেচের জন্য প্রায় সবকিছুই কভার করে — লাইন, shapes, freehand স্ট্রোক, আর একটা eraser।</p>'),
      h(2, 'Pencil আর Brush', 'pencil-আর-brush'),
      p('<p><b>Pencil</b> একটা পাতলা, শক্ত-কিনারার লাইন আঁকে। <b>Brush</b> কয়েকটা মোটা স্টাইল দেয় — calligraphy, crayon, watercolor — নরম একটা লুকের জন্য। দুটোই drag করার সময় আপনার mouse বা touchpad ঠিক অনুসরণ করে।</p>'),
      h(2, 'Shapes', 'shapes'),
      p('<p>Rectangle, ellipse, line, আর arrow টুল এক কোণ থেকে আরেক কোণে drag করে একটা পরিষ্কার shape আঁকে। একটা rectangle বা ellipse drag করার সময় <b>Shift</b> চেপে রাখলে সেটা একদম নিখুঁত square বা circle হয়।</p>'),
      h(2, 'Eraser', 'eraser'),
      p('<p>Eraser যা কিছুর উপর দিয়ে drag হয় তা <b>background color</b> দিয়ে বদলে দেয়, transparent করে না — একটা রঙিন জায়গার উপর মোছার আগে এটা জানা ভালো, কারণ এটা একটা ফুটো না, একটা solid প্যাচ রেখে যায়।</p>'),
      table(['টুল', 'কী করে'], [['Pencil', 'পাতলা, শক্ত-কিনারার freehand লাইন'], ['Brush', 'মোটা, স্টাইল করা freehand স্ট্রোক'], ['Shapes', 'পরিষ্কার rectangle, ellipse, line, বা arrow'], ['Eraser', 'background color দিয়ে উপরে রং করে দেয়']]),
      h(2, 'Shape-এর Outline বনাম Fill', 'shape-এর-outline-বনাম-fill'),
      p('<p>প্রতিটা shape টুল তিনটা স্টাইল দেয়: <b>শুধু outline</b> (শুধু বর্ডার, Color 1 দিয়ে), <b>outline সহ fill</b> (বর্ডার Color 1-এ, ভেতরে Color 2 দিয়ে ভরা), আর <b>শুধু fill</b> (কোনো দেখা-যাওয়া বর্ডার নেই)। একটা shape টুল বেছে নেওয়া মাত্রই outline-এর জন্য লাইনের পুরুত্ব একটা ছোট dropdown-এ সেট করা যায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'paint-selection-and-editing', sortOrder: n++,
  en: {
    title: 'Selection, Move, and Resize',
    metaTitle: 'Paint Selection, Move, and Resize | Learn Computer Academy',
    metaDescription: "How to select part of a Paint image before moving, resizing, rotating, or cropping it.",
    blocks: [
      p('<p>Before moving or resizing anything in Paint, you select it first — the same idea as selecting text before formatting it.</p>'),
      h(2, 'Rectangular vs Free-Form Selection'),
      p('<p><b>Rectangular selection</b> grabs a box-shaped area. <b>Free-form selection</b> follows a hand-drawn outline instead, for grabbing an irregular shape without the surrounding rectangle.</p>'),
      h(2, 'Move, Resize, Rotate'),
      p('<p>Once something is selected, drag inside the selection to move it, drag a corner handle to resize it, or use the <b>Rotate</b> button in the Ribbon to turn it.</p>'),
      callout('note', '<p>Cropping is just a selection plus one click: select the area you want to keep, then click <b>Crop</b> — everything outside the selection is discarded.</p>', 'Crop is selection, not a separate tool'),
      h(2, 'Flip and Rotate the Whole Image'),
      p('<p><b>Image → Rotate</b> and <b>Image → Flip</b> work on the entire canvas, not just a selection — useful for fixing a photo taken sideways, or mirroring an image horizontally.</p>'),
    ],
  },
  bn: {
    title: 'সিলেকশন, মুভ, আর রিসাইজ',
    metaTitle: 'Paint সিলেকশন, মুভ, আর রিসাইজ | Learn Computer Academy',
    metaDescription: 'Paint-এ একটা image-এর অংশ move, resize, rotate, বা crop করার আগে কীভাবে select করবেন।',
    blocks: [
      p('<p>Paint-এ কিছু move বা resize করার আগে, প্রথমে সেটা select করতে হয় — text ফরম্যাট করার আগে সেটা select করার একই আইডিয়া।</p>'),
      h(2, 'Rectangular বনাম Free-Form সিলেকশন', 'rectangular-বনাম-free-form-সিলেকশন'),
      p('<p><b>Rectangular selection</b> একটা বাক্স-আকৃতির এলাকা ধরে। <b>Free-form selection</b> এর বদলে হাতে-আঁকা একটা রূপরেখা অনুসরণ করে, চারপাশের rectangle ছাড়াই একটা অনিয়মিত shape ধরার জন্য।</p>'),
      h(2, 'Move, Resize, Rotate', 'move-resize-rotate'),
      p('<p>কিছু একবার select হয়ে গেলে, সেটা move করতে selection-এর ভেতরে drag করুন, resize করতে একটা কোণের handle drag করুন, বা ঘোরাতে Ribbon-এর <b>Rotate</b> বাটন ব্যবহার করুন।</p>'),
      callout('note', '<p>Cropping আসলে একটা selection আর একটা ক্লিক: যে এলাকাটা রাখতে চান সেটা select করুন, তারপর <b>Crop</b>-এ ক্লিক করুন — selection-এর বাইরের সবকিছু বাদ পড়ে যায়।</p>', 'Crop আলাদা কোনো টুল না, selection-ই'),
      h(2, 'পুরো Image Flip আর Rotate করা', 'পুরো-image-flip-আর-rotate-করা'),
      p('<p><b>Image → Rotate</b> আর <b>Image → Flip</b> শুধু একটা selection না, পুরো canvas-এ কাজ করে — কাত হয়ে তোলা একটা ছবি ঠিক করতে, বা একটা ছবিকে অনুভূমিকভাবে mirror করতে কাজের।</p>'),
    ],
  },
})

lessons.push({
  slug: 'paint-text-and-fill', sortOrder: n++,
  en: {
    title: 'Text and Fill Tools',
    metaTitle: 'Paint Text and Fill Tools | Learn Computer Academy',
    metaDescription: 'Adding text to a Paint image and flooding an area with color using the Fill tool — including the leak mistake to avoid.',
    blocks: [
      p("<p>Paint lets you add text and flood large areas with color — two tools beginners often overlook.</p>"),
      h(2, 'Adding Text'),
      p('<p>Click the <b>Text</b> tool, drag a text box on the canvas, and type. Font, size, and color appear in the Ribbon the moment you start typing.</p>'),
      h(2, 'Fill (Bucket)'),
      p('<p>The <b>Fill</b> tool floods a connected area of one color with a new color — clicking inside a shape\'s outline fills just that shape.</p>'),
      callout('warning', "<p>A gap in a shape's outline lets the fill \"leak\" out and color the entire canvas, since Fill only stops where it hits a different color. Close the outline completely before filling.</p>", 'The most common Paint mistake'),
      h(2, 'The Color Picker (Eyedropper)'),
      p('<p>The <b>Color Picker</b> tool copies a color directly from the canvas into Color 1 or Color 2 — useful for exactly matching a color already used somewhere else in the image instead of guessing at it on the palette.</p>'),
    ],
  },
  bn: {
    title: 'Text আর Fill টুল',
    metaTitle: 'Paint Text আর Fill টুল | Learn Computer Academy',
    metaDescription: 'একটা Paint image-এ text যোগ করা আর Fill টুল দিয়ে একটা এলাকা রং দিয়ে ভরা — যে leak ভুলটা এড়াতে হবে সহ।',
    blocks: [
      p('<p>Paint-এ আপনি text যোগ করতে পারেন আর বড় এলাকা রং দিয়ে ভরতে পারেন — নতুনরা প্রায়ই এই দুটো টুল খেয়াল করে না।</p>'),
      h(2, 'Text যোগ করা', 'text-যোগ-করা'),
      p('<p><b>Text</b> টুলে ক্লিক করুন, canvas-এ একটা text box drag করুন, আর টাইপ করুন। টাইপ শুরু করা মাত্রই Font, size, আর color Ribbon-এ চলে আসে।</p>'),
      h(2, 'Fill (Bucket)', 'fill-bucket'),
      p('<p><b>Fill</b> টুল একটা যুক্ত এলাকার এক রংকে নতুন রং দিয়ে ভরে দেয় — একটা shape-এর outline-এর ভেতরে ক্লিক করলে শুধু সেই shape-টাই ভরে যায়।</p>'),
      callout('warning', '<p>একটা shape-এর outline-এ ফাঁক থাকলে fill "leak" করে পুরো canvas রং করে ফেলে, কারণ Fill শুধু আলাদা রঙে ধাক্কা খেলে থামে। ভরার আগে outline পুরোপুরি বন্ধ করে নিন।</p>', 'Paint-এর সবচেয়ে সাধারণ ভুল'),
      h(2, 'Color Picker (Eyedropper)', 'color-picker-eyedropper'),
      p('<p><b>Color Picker</b> টুল canvas থেকে সরাসরি একটা রং Color 1 বা Color 2-তে copy করে — image-এ অন্য কোথাও ব্যবহৃত একটা রঙের সাথে ঠিকঠাক মিলিয়ে নিতে কাজের, palette-এ আন্দাজ করার বদলে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'paint-saving-and-formats', sortOrder: n++,
  en: {
    title: 'Saving and Image Formats',
    metaTitle: 'Paint Saving and Image Formats | Learn Computer Academy',
    metaDescription: 'PNG vs JPG vs BMP in Paint — which format to save as, and Save vs Save As.',
    blocks: [
      p('<p>How you save an image in Paint decides how well it works everywhere else — a wrong format choice is a common beginner mistake.</p>'),
      h(2, 'Common Formats'),
      table(
        ['Format', 'Best for'],
        [
          ['PNG', 'Sharp edges, supports transparency — screenshots, logos, diagrams'],
          ['JPG', 'Smaller file size, no transparency — photos'],
          ['BMP', 'Uncompressed, large file size — rarely needed today'],
        ]
      ),
      h(2, 'Save vs Save As'),
      p('<p><code>Ctrl+S</code> saves over the same file. <b>Save As</b> (<code>Ctrl+Shift+S</code>) lets you pick a new name, location, or format — use Save As whenever you want to keep an original untouched.</p>'),
      callout('tip', '<p>Choosing the right extension here is exactly the "File Extensions" idea from Computer Basics — the file extension tells every other program what kind of data is inside.</p>', 'Connects back to File and Folder Basics'),
      h(2, 'Why a Huge Image Slows Things Down'),
      p('<p>A photo saved at its full camera resolution can be several MB — fine for storage, but far larger than any screen needs to display it, and slow to attach or upload. Resizing an image down to roughly its actual display size before saving (Image → Resize) keeps the file small without any visible quality loss.</p>'),
    ],
  },
  bn: {
    title: 'Save করা আর Image Format',
    metaTitle: 'Paint Save করা আর Image Format | Learn Computer Academy',
    metaDescription: 'Paint-এ PNG বনাম JPG বনাম BMP — কোন format-এ save করবেন, আর Save বনাম Save As।',
    blocks: [
      p('<p>Paint-এ একটা image কীভাবে save করেন তা ঠিক করে দেয় এটা অন্য জায়গায় কতটা ভালো কাজ করবে — ভুল format বেছে নেওয়া নতুনদের একটা সাধারণ ভুল।</p>'),
      h(2, 'সাধারণ Format', 'সাধারণ-format'),
      table(
        ['Format', 'যার জন্য সেরা'],
        [
          ['PNG', 'শক্ত কিনারা, transparency সাপোর্ট করে — screenshot, logo, diagram'],
          ['JPG', 'ছোট file size, কোনো transparency নেই — ছবি'],
          ['BMP', 'কমপ্রেস করা না, বড় file size — আজকাল খুব কম দরকার হয়'],
        ]
      ),
      h(2, 'Save বনাম Save As', 'save-বনাম-save-as'),
      p('<p><code>Ctrl+S</code> একই file-এর উপর save করে। <b>Save As</b> (<code>Ctrl+Shift+S</code>) নতুন নাম, location, বা format বেছে নিতে দেয় — আসল file অক্ষত রাখতে চাইলে যখনই Save As ব্যবহার করুন।</p>'),
      callout('tip', '<p>এখানে সঠিক extension বেছে নেওয়া Computer Basics-এর "File Extensions" আইডিয়াটাই — file extension অন্য প্রতিটা প্রোগ্রামকে বলে দেয় ভেতরে কী ধরনের ডেটা আছে।</p>', 'File and Folder Basics-এর সাথে যুক্ত'),
      h(2, 'একটা বড় Image কেন সবকিছু ধীর করে দেয়', 'একটা-বড়-image-কেন-সবকিছু-ধীর-করে-দেয়'),
      p('<p>ক্যামেরার পুরো resolution-এ সেভ করা একটা ছবি কয়েক MB হতে পারে — সেভ রাখার জন্য ঠিক আছে, কিন্তু কোনো স্ক্রিনে দেখানোর জন্য যতটা দরকার তার চেয়ে অনেক বড়, আর attach বা upload করতে ধীর। সেভ করার আগে একটা ছবিকে প্রায় তার আসল দেখানোর size-এ resize করলে (Image → Resize) কোনো দেখা-যাওয়া মান কমা ছাড়াই file ছোট থাকে।</p>'),
    ],
  },
})

// ═══ MS WORD (10) ═══════════════════════════════════════════════════════

lessons.push({
  slug: 'word-introduction', sortOrder: n++,
  en: {
    title: 'Introduction to MS Word',
    metaTitle: 'Introduction to MS Word | Learn Computer Academy',
    metaDescription: "What MS Word is for, how the Ribbon's tabs are organized, and the handful of shortcuts worth knowing from day one.",
    blocks: [
      p('<p><b>MS Word</b> is the standard tool for writing anything longer than a quick note — essays, reports, letters, resumes — with formatting a plain text editor can\'t do.</p>'),
      h(2, 'The Ribbon'),
      p("<p>Word's tools are grouped into tabs across the top — <b>Home</b> (text formatting), <b>Insert</b> (images/tables), <b>Layout</b> (page setup), <b>References</b>, <b>Review</b>. Clicking a tab swaps which tools the Ribbon shows below it.</p>"),
      img('docs/img/office/word-introduction-1-r2', "A labeled mockup of a word processor's ribbon and window: Home, Insert, Layout, and Review tabs; Bold, Italic, Underline, Font, Size, alignment, Bullets, Numbering, Insert Table, and Insert Picture buttons; a page thumbnail sidebar; a status bar showing page and word count", 1024, 768, "Every button shown here has a real name — hover any of them in real Word and the same label appears as a tooltip."),
      h(2, 'The Document Itself'),
      p('<p>What you see is what prints. This is called <b>WYSIWYG</b> — "what you see is what you get" — and it\'s the whole reason Word looks like a page rather than a text file.</p>'),
      table(['Shortcut', 'What it does'], [['Ctrl+S', 'Save'], ['Ctrl+P', 'Print'], ['Ctrl+Z', 'Undo'], ['Ctrl+N', 'New document']]),
      h(2, 'Starting from a Template'),
      p('<p>File → New offers built-in <b>templates</b> — a resume, a formal letter, a report cover page — with the layout and formatting already done. Starting from a close-enough template and editing it is usually faster than formatting a blank page from scratch.</p>'),
    ],
  },
  bn: {
    title: 'MS Word পরিচিতি',
    metaTitle: 'MS Word পরিচিতি | Learn Computer Academy',
    metaDescription: 'MS Word কীসের জন্য, Ribbon-এর tab গুলো কীভাবে সাজানো, আর প্রথম দিন থেকেই জানার মতো হাতে গোনা shortcut।',
    blocks: [
      p('<p><b>MS Word</b> হলো একটা ছোট নোটের চেয়ে বড় যেকোনো কিছু লেখার স্ট্যান্ডার্ড টুল — essay, report, letter, resume — এমন formatting সহ যা একটা সাধারণ text editor করতে পারে না।</p>'),
      h(2, 'Ribbon', 'ribbon'),
      p('<p>Word-এর টুলগুলো উপরে tab-এ ভাগ করা — <b>Home</b> (text formatting), <b>Insert</b> (image/table), <b>Layout</b> (page setup), <b>References</b>, <b>Review</b>। একটা tab-এ ক্লিক করলে নিচের Ribbon-এ দেখানো টুল বদলে যায়।</p>'),
      img('docs/img/office/word-introduction-1-r2', 'একটা word processor-এর ribbon আর window-এর লেবেল করা mockup: Home, Insert, Layout, আর Review tab; Bold, Italic, Underline, Font, Size, alignment, Bullets, Numbering, Insert Table, আর Insert Picture বাটন; page thumbnail sidebar; page আর word count দেখানো status bar', 1024, 768, 'এখানে দেখানো প্রতিটা বাটনের একটা আসল নাম আছে — আসল Word-এ যেকোনোটার উপর hover করলে একই লেবেল tooltip হিসেবে দেখা যায়।'),
      h(2, 'Document নিজেই', 'document-নিজেই'),
      p('<p>আপনি যা দেখেন তাই প্রিন্ট হয়। একে বলা হয় <b>WYSIWYG</b> — "what you see is what you get" — আর এজন্যই Word একটা text file-এর মতো না, একটা পাতার মতো দেখায়।</p>'),
      table(['Shortcut', 'কী করে'], [['Ctrl+S', 'Save করে'], ['Ctrl+P', 'Print করে'], ['Ctrl+Z', 'Undo করে'], ['Ctrl+N', 'নতুন document']]),
      h(2, 'একটা Template থেকে শুরু করা', 'একটা-template-থেকে-শুরু-করা'),
      p('<p>File → New-এ বিল্ট-ইন <b>template</b> পাওয়া যায় — একটা resume, একটা formal letter, একটা report cover page — যার layout আর formatting আগে থেকেই করা। কাছাকাছি একটা template থেকে শুরু করে edit করা সাধারণত খালি পাতা থেকে formatting শুরু করার চেয়ে দ্রুত।</p>'),
    ],
  },
})

lessons.push({
  slug: 'word-typing-and-editing', sortOrder: n++,
  en: {
    title: 'Typing, Editing, and Selecting Text',
    metaTitle: 'Word Typing, Editing, and Selecting Text | Learn Computer Academy',
    metaDescription: 'Moving the cursor, selecting text, and cut/copy/paste — the physical mechanics of editing in Word.',
    blocks: [
      p('<p>Before formatting anything, editing text comes down to three physical skills: moving the cursor, selecting text, and cut/copy/paste.</p>'),
      h(2, 'Moving the Cursor'),
      p('<p>Arrow keys move one character or line at a time. <code>Ctrl</code>+arrow jumps a whole word at a time. <code>Home</code>/<code>End</code> jump to the start or end of the current line.</p>'),
      h(2, 'Selecting Text'),
      p('<p>Click and drag to select freely, double-click to select one word, triple-click to select a whole paragraph, or <code>Ctrl+A</code> to select the entire document.</p>'),
      h(2, 'Cut, Copy, Paste'),
      p('<p><code>Ctrl+X</code> cuts (removes and stores), <code>Ctrl+C</code> copies (stores without removing), <code>Ctrl+V</code> pastes the stored text at the cursor\'s current position.</p>'),
      table(['Shortcut', 'What it does'], [['Ctrl+A', 'Select all'], ['Ctrl+X', 'Cut'], ['Ctrl+C', 'Copy'], ['Ctrl+V', 'Paste']]),
      h(2, 'Find and Replace'),
      p('<p><code>Ctrl+F</code> searches the document and jumps to every match. <code>Ctrl+H</code> opens <b>Find and Replace</b> — type what to find and what to replace it with, then Replace one at a time or Replace All at once. Genuinely faster than manually hunting for every occurrence of a name or term that changed.</p>'),
    ],
  },
  bn: {
    title: 'Typing, Editing, আর Text সিলেক্ট করা',
    metaTitle: 'Word Typing, Editing, আর Text সিলেক্ট করা | Learn Computer Academy',
    metaDescription: 'Cursor move করা, text select করা, আর cut/copy/paste — Word-এ editing-এর শারীরিক মেকানিক্স।',
    blocks: [
      p('<p>কিছু format করার আগে, text editing আসলে তিনটা শারীরিক দক্ষতায় নেমে আসে: cursor move করা, text select করা, আর cut/copy/paste।</p>'),
      h(2, 'Cursor Move করা', 'cursor-move-করা'),
      p('<p>Arrow key একবারে একটা character বা line move করে। <code>Ctrl</code>+arrow একবারে পুরো একটা word লাফ দেয়। <code>Home</code>/<code>End</code> বর্তমান line-এর শুরু বা শেষে লাফ দেয়।</p>'),
      h(2, 'Text Select করা', 'text-select-করা'),
      p('<p>স্বাধীনভাবে select করতে ক্লিক করে drag করুন, একটা word select করতে double-click, পুরো একটা paragraph select করতে triple-click, বা পুরো document select করতে <code>Ctrl+A</code>।</p>'),
      h(2, 'Cut, Copy, Paste', 'cut-copy-paste'),
      p('<p><code>Ctrl+X</code> cut করে (সরিয়ে সেভ করে), <code>Ctrl+C</code> copy করে (সরানো ছাড়াই সেভ করে), <code>Ctrl+V</code> সেভ করা text cursor-এর বর্তমান জায়গায় paste করে।</p>'),
      table(['Shortcut', 'কী করে'], [['Ctrl+A', 'সব select করে'], ['Ctrl+X', 'Cut করে'], ['Ctrl+C', 'Copy করে'], ['Ctrl+V', 'Paste করে']]),
      h(2, 'Find and Replace', 'find-and-replace'),
      p('<p><code>Ctrl+F</code> document খুঁজে প্রতিটা মিল দেখায়। <code>Ctrl+H</code> <b>Find and Replace</b> খোলে — কী খুঁজবেন আর কী দিয়ে বদলাবেন টাইপ করুন, তারপর একটা একটা করে Replace করুন বা একসাথে Replace All করুন। বদলে যাওয়া কোনো নাম বা শব্দের প্রতিটা জায়গা হাতে খোঁজার চেয়ে সত্যিই দ্রুত।</p>'),
    ],
  },
})

lessons.push({
  slug: 'word-text-formatting', sortOrder: n++,
  en: {
    title: 'Formatting Text',
    metaTitle: 'Word Formatting Text | Learn Computer Academy',
    metaDescription: 'Font, size, color, bold, italic, and underline in Word — and why formatting always applies to a selection.',
    blocks: [
      p('<p>Making text bold, italic, a different size, or a different font is the most-used formatting in Word.</p>'),
      h(2, 'Font, Size, Color'),
      p('<p>Set in the <b>Home</b> tab\'s Font group. Every change applies only to the currently <b>selected</b> text — select first, then change.</p>'),
      h(2, 'Bold, Italic, Underline'),
      p('<p><code>Ctrl+B</code>, <code>Ctrl+I</code>, and <code>Ctrl+U</code> toggle each on or off for the current selection.</p>'),
      table(['Shortcut', 'What it does'], [['Ctrl+B', 'Bold'], ['Ctrl+I', 'Italic'], ['Ctrl+U', 'Underline']]),
      callout('note', "<p>Word has no \"type in bold from now on\" mode without pressing <code>Ctrl+B</code> first — formatting text you already typed means selecting it first, not retyping it.</p>", 'A common early confusion'),
      h(2, 'Styles — Formatting the Fast, Consistent Way'),
      p('<p>Instead of manually setting font/size/bold for every heading, applying a <b>Style</b> (Home tab, the Styles gallery — Heading 1, Heading 2, Normal) sets all of it at once, consistently, everywhere it\'s used. Styles also matter later: an automatic Table of Contents only picks up text formatted with a Heading style, not text that\'s merely made bold and bigger by hand.</p>'),
    ],
  },
  bn: {
    title: 'Text Formatting',
    metaTitle: 'Word Text Formatting | Learn Computer Academy',
    metaDescription: 'Word-এ font, size, color, bold, italic, আর underline — আর কেন formatting সবসময় একটা selection-এ প্রয়োগ হয়।',
    blocks: [
      p('<p>Text-কে bold, italic, ভিন্ন size, বা ভিন্ন font করা Word-এর সবচেয়ে বেশি ব্যবহৃত formatting।</p>'),
      h(2, 'Font, Size, Color', 'font-size-color'),
      p('<p><b>Home</b> tab-এর Font গ্রুপে সেট করা হয়। প্রতিটা বদল শুধু বর্তমানে <b>select</b> করা text-এই প্রয়োগ হয় — আগে select করুন, তারপর বদলান।</p>'),
      h(2, 'Bold, Italic, Underline', 'bold-italic-underline'),
      p('<p><code>Ctrl+B</code>, <code>Ctrl+I</code>, আর <code>Ctrl+U</code> বর্তমান selection-এর জন্য প্রতিটা চালু বা বন্ধ করে।</p>'),
      table(['Shortcut', 'কী করে'], [['Ctrl+B', 'Bold'], ['Ctrl+I', 'Italic'], ['Ctrl+U', 'Underline']]),
      callout('note', '<p>আগে <code>Ctrl+B</code> না চেপে "এখন থেকে bold-এ টাইপ" করার কোনো মোড Word-এ নেই — আগে টাইপ করা text format করা মানে সেটা select করা, আবার টাইপ করা না।</p>', 'শুরুর দিকের একটা সাধারণ বিভ্রান্তি'),
      h(2, 'Style — দ্রুত, সামঞ্জস্যপূর্ণ Formatting', 'style-দ্রুত-সামঞ্জস্যপূর্ণ-formatting'),
      p('<p>প্রতিটা heading-এ হাতে font/size/bold সেট করার বদলে, একটা <b>Style</b> প্রয়োগ করলে (Home tab-এর Styles গ্যালারি — Heading 1, Heading 2, Normal) একবারেই সবকিছু সামঞ্জস্যপূর্ণভাবে সেট হয়ে যায়, যেখানেই ব্যবহার হোক। Style পরেও গুরুত্বপূর্ণ: একটা স্বয়ংক্রিয় Table of Contents শুধু Heading style দিয়ে formatted text ধরে, শুধু হাতে bold আর বড় করা text না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'word-paragraph-formatting', sortOrder: n++,
  en: {
    title: 'Paragraph Formatting',
    metaTitle: 'Word Paragraph Formatting | Learn Computer Academy',
    metaDescription: 'Alignment, line spacing, and bullets or numbering — formatting a whole paragraph rather than individual characters.',
    blocks: [
      p('<p>Some formatting applies to a whole paragraph rather than individual characters — alignment, spacing, and lists.</p>'),
      h(2, 'Alignment'),
      p('<p>Left, center, right, and justify are four buttons in the Home tab\'s Paragraph group — justify stretches each line to reach both margins evenly, the look most printed books use.</p>'),
      h(2, 'Line and Paragraph Spacing'),
      p('<p>Controls how much room sits between lines and between paragraphs. Double-spacing for a formal document or assignment is a common school and report requirement.</p>'),
      h(2, 'Bullets and Numbering'),
      p('<p>Turns selected lines into a bulleted or numbered list with one click. <code>Tab</code> indents a list item to a sub-level; <code>Shift+Tab</code> un-indents it.</p>'),
      h(2, 'Indentation'),
      p('<p>A <b>first-line indent</b> pushes in only the first line of a paragraph — the traditional look for essay paragraphs. A <b>hanging indent</b> does the opposite, indenting every line except the first — the shape a bibliography or reference list uses. Both are set in the Paragraph dialog\'s Indentation section, not with spaces or the Tab key.</p>'),
    ],
  },
  bn: {
    title: 'Paragraph Formatting',
    metaTitle: 'Word Paragraph Formatting | Learn Computer Academy',
    metaDescription: 'Alignment, line spacing, আর bullet বা numbering — আলাদা character না, পুরো একটা paragraph format করা।',
    blocks: [
      p('<p>কিছু formatting আলাদা character না, পুরো একটা paragraph-এ প্রয়োগ হয় — alignment, spacing, আর list।</p>'),
      h(2, 'Alignment', 'alignment'),
      p('<p>Left, center, right, আর justify — Home tab-এর Paragraph গ্রুপে চারটা বাটন — justify প্রতিটা line-কে দুই margin পর্যন্ত সমানভাবে টেনে দেয়, বেশিরভাগ ছাপা বই এই লুক ব্যবহার করে।</p>'),
      h(2, 'Line আর Paragraph Spacing', 'line-আর-paragraph-spacing'),
      p('<p>Line-এর মধ্যে আর paragraph-এর মধ্যে কতটা জায়গা থাকবে তা নিয়ন্ত্রণ করে। একটা formal document বা assignment-এ double-spacing স্কুল আর report-এ প্রায়ই চাওয়া হয়।</p>'),
      h(2, 'Bullets আর Numbering', 'bullets-আর-numbering'),
      p('<p>Select করা line গুলোকে এক ক্লিকে bulleted বা numbered list বানিয়ে দেয়। <code>Tab</code> একটা list item-কে sub-level-এ indent করে; <code>Shift+Tab</code> সেটা ফিরিয়ে আনে।</p>'),
      h(2, 'Indentation', 'indentation'),
      p('<p>একটা <b>first-line indent</b> শুধু একটা paragraph-এর প্রথম line-কেই ভেতরে ঠেলে দেয় — essay paragraph-এর চিরাচরিত লুক। একটা <b>hanging indent</b> উল্টোটা করে, প্রথমটা ছাড়া প্রতিটা line indent করে — একটা bibliography বা reference list-এর আকার এটাই। দুটোই Paragraph dialog-এর Indentation অংশে সেট হয়, স্পেস বা Tab key দিয়ে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'word-page-setup', sortOrder: n++,
  en: {
    title: 'Page Setup, Margins, and Breaks',
    metaTitle: 'Word Page Setup, Margins, and Breaks | Learn Computer Academy',
    metaDescription: 'Margins, orientation, and forcing text onto a new page with a page break.',
    blocks: [
      p('<p>Page setup decides margins, orientation, and where one page ends and the next begins.</p>'),
      h(2, 'Margins and Orientation'),
      p('<p>In the <b>Layout</b> tab: <b>Margins</b> sets the blank border around the edge of every page; <b>Orientation</b> switches between Portrait and Landscape.</p>'),
      h(2, 'Page Breaks'),
      p('<p><code>Ctrl+Enter</code> forces the rest of your text onto a new page immediately, instead of waiting for the current page to fill up naturally — the correct way to start a new chapter or section on its own page.</p>'),
      callout('tip', '<p>Pressing Enter repeatedly to "push" text onto the next page looks the same until you edit anything earlier in the document — every extra blank line shifts. A real page break stays put.</p>', 'Use a real page break, not blank lines'),
      h(2, 'Columns'),
      p('<p>Layout tab → <b>Columns</b> splits the page into two or more side-by-side newspaper-style columns — text flows down the first column, then continues at the top of the next, the layout newsletters and some flyers use.</p>'),
    ],
  },
  bn: {
    title: 'Page Setup, Margin, আর Break',
    metaTitle: 'Word Page Setup, Margin, আর Break | Learn Computer Academy',
    metaDescription: 'Margin, orientation, আর একটা page break দিয়ে text-কে জোর করে নতুন page-এ পাঠানো।',
    blocks: [
      p('<p>Page setup margin, orientation, আর কোথায় একটা page শেষ হয়ে পরেরটা শুরু হয় তা ঠিক করে।</p>'),
      h(2, 'Margin আর Orientation', 'margin-আর-orientation'),
      p('<p><b>Layout</b> tab-এ: <b>Margins</b> প্রতিটা page-এর কিনারায় খালি বর্ডার সেট করে; <b>Orientation</b> Portrait আর Landscape-এর মধ্যে বদলায়।</p>'),
      h(2, 'Page Break', 'page-break'),
      p('<p><code>Ctrl+Enter</code> বর্তমান page স্বাভাবিকভাবে ভরে যাওয়ার অপেক্ষা না করে সাথে সাথেই বাকি text-কে নতুন একটা page-এ পাঠিয়ে দেয় — একটা নতুন chapter বা section নিজের page-এ শুরু করার সঠিক উপায়।</p>'),
      callout('tip', '<p>বারবার Enter চেপে text-কে পরের page-এ "ঠেলে দেওয়া" ততক্ষণ একই রকম দেখায় যতক্ষণ না document-এর আগের কোথাও কিছু edit করেন — প্রতিটা অতিরিক্ত খালি লাইন সরে যায়। একটা আসল page break একই জায়গায় থাকে।</p>', 'খালি লাইন না, আসল page break ব্যবহার করুন'),
      h(2, 'Column', 'column'),
      p('<p>Layout tab → <b>Columns</b> একটা page-কে পাশাপাশি দুই বা তার বেশি newspaper-স্টাইল column-এ ভাগ করে — text প্রথম column-এ নিচের দিকে যায়, তারপর পরের column-এর উপর থেকে চলতে থাকে — newsletter আর কিছু flyer এই layout ব্যবহার করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'word-headers-and-footers', sortOrder: n++,
  en: {
    title: 'Headers, Footers, and Page Numbers',
    metaTitle: 'Word Headers, Footers, and Page Numbers | Learn Computer Academy',
    metaDescription: 'Content that repeats on every page automatically — headers, footers, and automatic page numbering.',
    blocks: [
      p("<p>A <b>header</b> or <b>footer</b> is content that repeats automatically on every page — a document title, a date, or a page number.</p>"),
      h(2, 'Adding a Header or Footer'),
      p('<p>Insert tab → Header or Footer, or simply double-click near the top or bottom of a page to start editing it directly.</p>'),
      h(2, 'Page Numbers'),
      p('<p>Insert → Page Number, then choose a position. Word numbers every page automatically as content is added — including any pages inserted later, no renumbering by hand.</p>'),
      h(2, 'Different First Page, Different Odd and Even'),
      p('<p>Header & Footer tools → Options offers <b>Different First Page</b> (a cover page with no header) and <b>Different Odd & Even Pages</b> (page numbers on alternating sides, the way a printed book positions them) — both common requirements for a formal report or thesis.</p>'),
    ],
  },
  bn: {
    title: 'Header, Footer, আর Page Number',
    metaTitle: 'Word Header, Footer, আর Page Number | Learn Computer Academy',
    metaDescription: 'যে কনটেন্ট নিজে থেকেই প্রতিটা page-এ পুনরাবৃত্তি হয় — header, footer, আর স্বয়ংক্রিয় page numbering।',
    blocks: [
      p('<p>একটা <b>header</b> বা <b>footer</b> এমন কনটেন্ট যা নিজে থেকেই প্রতিটা page-এ পুনরাবৃত্তি হয় — একটা document-এর title, একটা date, বা একটা page number।</p>'),
      h(2, 'একটা Header বা Footer যোগ করা', 'একটা-header-বা-footer-যোগ-করা'),
      p('<p>Insert tab → Header বা Footer, বা সহজে একটা page-এর উপরে বা নিচে double-click করলেই সরাসরি edit শুরু হয়ে যায়।</p>'),
      h(2, 'Page Number', 'page-number'),
      p('<p>Insert → Page Number, তারপর একটা position বেছে নিন। কনটেন্ট যোগ হওয়ার সাথে সাথে Word প্রতিটা page স্বয়ংক্রিয়ভাবে নম্বর দেয় — পরে যোগ করা page সহ, হাতে renumber করার দরকার নেই।</p>'),
      h(2, 'ভিন্ন প্রথম Page, ভিন্ন Odd আর Even', 'ভিন্ন-প্রথম-page-ভিন্ন-odd-আর-even'),
      p('<p>Header & Footer tools → Options-এ <b>Different First Page</b> (হেডার ছাড়া একটা cover page) আর <b>Different Odd & Even Pages</b> (পালাক্রমে দুই পাশে page number, ছাপা বই যেভাবে রাখে) পাওয়া যায় — দুটোই একটা formal report বা thesis-এর সাধারণ দাবি।</p>'),
    ],
  },
})

lessons.push({
  slug: 'word-images-and-shapes', sortOrder: n++,
  en: {
    title: 'Inserting Images and Shapes',
    metaTitle: 'Word Inserting Images and Shapes | Learn Computer Academy',
    metaDescription: 'Adding a picture or shape to a Word document, resizing it correctly, and controlling how text wraps around it.',
    blocks: [
      p('<p>Adding a picture or a shape and getting it to sit where you actually want is the next skill after plain text.</p>'),
      h(2, 'Inserting a Picture'),
      p('<p>Insert tab → Pictures, then choose a file. Resize by dragging a <b>corner</b> handle, not an edge handle — a corner keeps the image\'s proportions, an edge stretches or squashes it.</p>'),
      h(2, 'Text Wrapping'),
      p('<p>Controls whether text flows around an image or stops entirely above and below it — found by right-clicking the image → <b>Wrap Text</b>, with options like Square, Tight, and In Line with Text.</p>'),
      h(2, 'SmartArt for Quick Diagrams'),
      p('<p>Insert tab → <b>SmartArt</b> builds a diagram — a process flow, an org chart, a cycle — by typing text into a list, with the shapes and arrows arranged automatically. Far faster than drawing individual boxes and connecting lines by hand for a simple diagram.</p>'),
    ],
  },
  bn: {
    title: 'Image আর Shape যোগ করা',
    metaTitle: 'Word-এ Image আর Shape যোগ করা | Learn Computer Academy',
    metaDescription: 'একটা Word document-এ একটা ছবি বা shape যোগ করা, ঠিকভাবে resize করা, আর এর চারপাশে text কীভাবে wrap হয় তা নিয়ন্ত্রণ করা।',
    blocks: [
      p('<p>একটা ছবি বা shape যোগ করা আর সেটাকে ঠিক যেখানে চান সেখানে বসানো plain text-এর পরের দক্ষতা।</p>'),
      h(2, 'একটা ছবি Insert করা', 'একটা-ছবি-insert-করা'),
      p('<p>Insert tab → Pictures, তারপর একটা file বেছে নিন। কোণের handle drag করে resize করুন, কিনারার handle না — কোণ ছবির অনুপাত ঠিক রাখে, কিনারা সেটাকে টেনে বা চাপ দিয়ে বিকৃত করে।</p>'),
      h(2, 'Text Wrapping', 'text-wrapping'),
      p('<p>নিয়ন্ত্রণ করে text একটা ছবির চারপাশ দিয়ে যাবে নাকি সম্পূর্ণভাবে উপরে-নিচে থামবে — ছবিতে right-click → <b>Wrap Text</b>-এ পাওয়া যায়, Square, Tight, আর In Line with Text-এর মতো অপশন সহ।</p>'),
      h(2, 'দ্রুত Diagram-এর জন্য SmartArt', 'দ্রুত-diagram-এর-জন্য-smartart'),
      p('<p>Insert tab → <b>SmartArt</b> একটা diagram বানায় — একটা process flow, একটা org chart, একটা cycle — একটা list-এ text টাইপ করে, shape আর arrow নিজে থেকেই সাজানো হয়ে যায়। একটা সাধারণ diagram-এর জন্য হাতে আলাদা বাক্স এঁকে লাইন জোড়ার চেয়ে অনেক দ্রুত।</p>'),
    ],
  },
})

lessons.push({
  slug: 'word-tables', sortOrder: n++,
  en: {
    title: 'Working with Tables',
    metaTitle: 'Word Working with Tables | Learn Computer Academy',
    metaDescription: 'Inserting a table in Word, adding or resizing rows and columns, and the Tab-key shortcut for adding a new row.',
    blocks: [
      p('<p>A table gives rows and columns for anything list-like — a schedule, a comparison, or a simple form.</p>'),
      h(2, 'Inserting a Table'),
      p('<p>Insert tab → Table, then drag to pick a number of rows and columns, or type an exact number instead.</p>'),
      h(2, 'Adding and Resizing Rows or Columns'),
      p('<p>Right-click inside a table for Insert or Delete row/column options. Drag a border between cells to resize a row or column.</p>'),
      callout('note', '<p>Pressing <code>Tab</code> while inside the very last cell of a table automatically creates a new row — a fast way to keep adding entries without touching the mouse.</p>', 'A shortcut worth knowing'),
      h(2, 'Merging and Splitting Cells'),
      p('<p>Select two or more cells and right-click → <b>Merge Cells</b> to combine them into one, useful for a title spanning several columns. <b>Split Cells</b> does the reverse, dividing one cell into several.</p>'),
    ],
  },
  bn: {
    title: 'Table নিয়ে কাজ করা',
    metaTitle: 'Word-এ Table নিয়ে কাজ করা | Learn Computer Academy',
    metaDescription: 'Word-এ একটা table insert করা, row বা column যোগ বা resize করা, আর নতুন row যোগ করার Tab-key শর্টকাট।',
    blocks: [
      p('<p>একটা table তালিকার মতো যেকোনো কিছুর জন্য row আর column দেয় — একটা schedule, একটা comparison, বা একটা সাধারণ form।</p>'),
      h(2, 'একটা Table Insert করা', 'একটা-table-insert-করা'),
      p('<p>Insert tab → Table, তারপর কতগুলো row আর column চান তা বেছে নিতে drag করুন, অথবা সরাসরি একটা নির্দিষ্ট সংখ্যা টাইপ করুন।</p>'),
      h(2, 'Row বা Column যোগ ও Resize করা', 'row-বা-column-যোগ-ও-resize-করা'),
      p('<p>Table-এর ভেতরে right-click করলে Insert বা Delete row/column অপশন পাওয়া যায়। একটা row বা column resize করতে cell-এর মাঝের বর্ডার drag করুন।</p>'),
      callout('note', '<p>Table-এর একদম শেষ cell-এ থাকা অবস্থায় <code>Tab</code> চাপলে স্বয়ংক্রিয়ভাবে একটা নতুন row তৈরি হয় — mouse না ছুঁয়ে এন্ট্রি যোগ করে যাওয়ার একটা দ্রুত উপায়।</p>', 'জানার মতো একটা শর্টকাট'),
      h(2, 'Cell Merge আর Split করা', 'cell-merge-আর-split-করা'),
      p('<p>দুই বা তার বেশি cell select করে right-click → <b>Merge Cells</b> করলে সেগুলো একটাতে মিলে যায়, একাধিক column জুড়ে একটা title-এর জন্য কাজের। <b>Split Cells</b> উল্টোটা করে, একটা cell-কে কয়েকটায় ভাগ করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'word-spell-check-and-review', sortOrder: n++,
  en: {
    title: 'Spell Check, Word Count, and Review Tools',
    metaTitle: 'Word Spell Check, Word Count, and Review Tools | Learn Computer Academy',
    metaDescription: "Reading Word's spelling and grammar underlines, checking word count, and what Track Changes and Comments are for.",
    blocks: [
      p('<p>Catching typos and getting a second opinion before submitting anything is what the Review tools are for.</p>'),
      h(2, 'Spelling and Grammar'),
      p('<p>A red squiggly underline flags a possible spelling issue; a blue or green one flags possible grammar. Right-click the underlined word or phrase for suggested fixes.</p>'),
      h(2, 'Word Count'),
      p('<p>Shown live at the bottom-left of the window — useful the moment an assignment has a minimum or maximum word limit.</p>'),
      h(2, 'Track Changes and Comments'),
      p('<p><b>Track Changes</b> (Review tab) marks every edit so someone else can see exactly what changed and by whom. <b>Comments</b> let you leave a note attached to specific text without editing the text itself.</p>'),
      h(2, 'AutoCorrect — Helpful Until It Isn\'t'),
      p('<p>Word silently fixes common typos as you type via <b>AutoCorrect</b> — "teh" becomes "the" automatically. This occasionally "corrects" something on purpose (an abbreviation, a name) into something wrong. File → Options → Proofing → AutoCorrect Options shows and controls exactly what it changes.</p>'),
    ],
  },
  bn: {
    title: 'Spell Check, Word Count, আর Review টুল',
    metaTitle: 'Word Spell Check, Word Count, আর Review টুল | Learn Computer Academy',
    metaDescription: 'Word-এর spelling আর grammar underline পড়া, word count চেক করা, আর Track Changes আর Comments কীসের জন্য।',
    blocks: [
      p('<p>কিছু submit করার আগে ভুল ধরা আর দ্বিতীয় মতামত পাওয়া Review টুলগুলোর কাজ।</p>'),
      h(2, 'Spelling আর Grammar', 'spelling-আর-grammar'),
      p('<p>লাল আঁকাবাঁকা underline সম্ভাব্য spelling সমস্যা দেখায়; নীল বা সবুজ সম্ভাব্য grammar দেখায়। সাজেস্ট করা fix-এর জন্য underline করা শব্দ বা phrase-এ right-click করুন।</p>'),
      h(2, 'Word Count', 'word-count'),
      p('<p>উইন্ডোর নিচে-বামে লাইভ দেখানো হয় — একটা assignment-এ কম বা বেশি শব্দের সীমা থাকলেই এটা কাজে লাগে।</p>'),
      h(2, 'Track Changes আর Comments', 'track-changes-আর-comments'),
      p('<p><b>Track Changes</b> (Review tab) প্রতিটা edit চিহ্নিত করে রাখে যাতে অন্য কেউ ঠিক কী বদলেছে আর কে বদলেছে তা দেখতে পারে। <b>Comments</b> আসল text বদল না করেই নির্দিষ্ট কোনো অংশে একটা নোট যোগ করতে দেয়।</p>'),
      h(2, 'AutoCorrect — সাহায্য করে, যতক্ষণ না করে', 'autocorrect-সাহায্য-করে-যতক্ষণ-না-করে'),
      p('<p>টাইপ করার সময় Word চুপচাপ সাধারণ টাইপো ঠিক করে দেয় <b>AutoCorrect</b> দিয়ে — "teh" নিজে থেকেই "the" হয়ে যায়। মাঝেমধ্যে এটা ইচ্ছাকৃত কিছু (একটা abbreviation, একটা নাম) ভুল কিছুতে "ঠিক" করে দেয়। File → Options → Proofing → AutoCorrect Options এটা ঠিক কী বদলায় তা দেখায় আর নিয়ন্ত্রণ করে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'word-saving-and-exporting', sortOrder: n++,
  en: {
    title: 'Saving, Printing, and Exporting to PDF',
    metaTitle: 'Word Saving, Printing, and Exporting to PDF | Learn Computer Academy',
    metaDescription: "Word's own .docx format vs PDF export, and why job applications almost always want a PDF.",
    blocks: [
      p('<p>Finishing a document properly means saving, printing, and often sharing it as a PDF instead of the original file.</p>'),
      h(2, "Saving in Word's Own Format"),
      p('<p><code>.docx</code> is Word\'s native format — it keeps every formatting feature, and reopens exactly as you left it, in Word or in a compatible alternative.</p>'),
      h(2, 'Exporting to PDF'),
      p('<p>File → Save As → choose PDF (or Export → Create PDF/XPS). A PDF looks identical on any device and can\'t be accidentally edited — the reason job applications and official documents are almost always sent as PDF, not <code>.docx</code>.</p>'),
      callout('tip', '<p><code>.pdf</code> was already in the extension table back in File and Folder Basics — this is exactly what it\'s for.</p>', 'Ties back to Computer Basics'),
      h(2, 'AutoSave and AutoRecover'),
      p('<p>Word periodically saves an <b>AutoRecover</b> copy in the background, separate from a manual save — if the program or computer crashes, reopening Word usually offers to restore that recovered copy. It\'s a safety net, not a replacement for pressing <code>Ctrl+S</code> regularly.</p>'),
    ],
  },
  bn: {
    title: 'Save, Print, আর PDF-এ Export করা',
    metaTitle: 'Word Save, Print, আর PDF-এ Export করা | Learn Computer Academy',
    metaDescription: "Word-এর নিজস্ব .docx format বনাম PDF export, আর চাকরির আবেদনে প্রায় সবসময় কেন PDF চাওয়া হয়।",
    blocks: [
      p('<p>একটা document ঠিকভাবে শেষ করা মানে সেটা save করা, print করা, আর প্রায়ই আসল file-এর বদলে PDF হিসেবে শেয়ার করা।</p>'),
      h(2, 'Word-এর নিজস্ব Format-এ Save করা', 'word-এর-নিজস্ব-format-এ-save-করা'),
      p('<p><code>.docx</code> হলো Word-এর নিজস্ব format — এটা প্রতিটা formatting ফিচার ধরে রাখে, আর Word-এ বা একটা compatible বিকল্পে ঠিক যেভাবে রেখেছিলেন সেভাবেই খোলে।</p>'),
      h(2, 'PDF-এ Export করা', 'pdf-এ-export-করা'),
      p('<p>File → Save As → PDF বেছে নিন (বা Export → Create PDF/XPS)। একটা PDF যেকোনো device-এ একই রকম দেখায় আর ভুল করে edit করা যায় না — এজন্যই চাকরির আবেদন আর official document প্রায় সবসময় <code>.docx</code> না, PDF হিসেবে পাঠানো হয়।</p>'),
      callout('tip', '<p><code>.pdf</code> আগে থেকেই File and Folder Basics-এর extension টেবিলে ছিল — এটাই তার আসল কাজ।</p>', 'Computer Basics-এর সাথে যুক্ত'),
      h(2, 'AutoSave আর AutoRecover', 'autosave-আর-autorecover'),
      p('<p>Word নিয়মিত ব্যবধানে পেছনে একটা <b>AutoRecover</b> কপি সেভ করে, হাতে করা save থেকে আলাদা — প্রোগ্রাম বা কম্পিউটার crash করলে, Word আবার খুললে সাধারণত সেই recover করা কপি ফিরিয়ে আনার প্রস্তাব দেয়। এটা একটা নিরাপত্তার জাল, নিয়মিত <code>Ctrl+S</code> চাপার বিকল্প না।</p>'),
    ],
  },
})

// ═══ MS EXCEL (12) ═══════════════════════════════════════════════════════

lessons.push({
  slug: 'excel-introduction', sortOrder: n++,
  en: {
    title: 'Introduction to MS Excel',
    metaTitle: 'Introduction to MS Excel | Learn Computer Academy',
    metaDescription: 'Rows, columns, cells, worksheets, and workbooks — the grid Excel is built around.',
    blocks: [
      p('<p><b>Excel</b> organizes information into a grid and can calculate with it — the difference between a list of numbers and numbers that actually add themselves up.</p>'),
      h(2, 'Rows, Columns, Cells'),
      p('<p>Columns are lettered — A, B, C… — and rows are numbered — 1, 2, 3… Each box where a row and column meet is a <b>cell</b>, named by its column then row, like <code>B3</code>.</p>'),
      img('docs/img/office/excel-introduction-1-r2', 'A labeled mockup of a spreadsheet ribbon and grid: File, Home, Insert, Formulas, and Data tabs; Bold, Fill Color, Borders, Sort, Filter, AutoSum, and Chart buttons; a formula bar showing =SUM(A1:A10); lettered columns and numbered rows with a selected cell and a small bar chart', 1024, 768, 'The formula bar at the top always shows the real formula behind the selected cell, not just its displayed result.'),
      h(2, 'Worksheets and Workbooks'),
      p('<p>One Excel file — a <b>workbook</b> — can hold several <b>worksheets</b>, the tabs along the bottom. Separate grids for separate purposes, all inside one file.</p>'),
      h(2, 'The Name Box and Jumping Around'),
      p('<p>The small box in the top-left, above column A, is the <b>Name Box</b> — type a cell reference like <code>Z100</code> and press Enter to jump straight there. <code>Ctrl+Home</code> jumps back to cell A1; <code>Ctrl+End</code> jumps to the last cell that actually contains data.</p>'),
    ],
  },
  bn: {
    title: 'MS Excel পরিচিতি',
    metaTitle: 'MS Excel পরিচিতি | Learn Computer Academy',
    metaDescription: 'Row, column, cell, worksheet, আর workbook — যে grid-এর উপর Excel তৈরি।',
    blocks: [
      p('<p><b>Excel</b> তথ্যকে একটা grid-এ সাজায় আর তা দিয়ে হিসেব করতে পারে — একটা সংখ্যার তালিকা আর নিজে থেকে যোগ হয়ে যাওয়া সংখ্যার মধ্যে পার্থক্য এটাই।</p>'),
      h(2, 'Row, Column, Cell', 'row-column-cell'),
      p('<p>Column-এর অক্ষর নাম থাকে — A, B, C… — আর row-এর সংখ্যা নাম থাকে — 1, 2, 3… যেখানে একটা row আর column মিলে সেই বাক্সটাকে বলা হয় একটা <b>cell</b>, প্রথমে column তারপর row দিয়ে নাম হয়, যেমন <code>B3</code>।</p>'),
      img('docs/img/office/excel-introduction-1-r2', 'একটা spreadsheet ribbon আর grid-এর লেবেল করা mockup: File, Home, Insert, Formulas, আর Data tab; Bold, Fill Color, Borders, Sort, Filter, AutoSum, আর Chart বাটন; =SUM(A1:A10) দেখানো একটা formula bar; অক্ষরে নাম দেওয়া column আর সংখ্যায় নাম দেওয়া row, একটা select করা cell আর একটা ছোট bar chart সহ', 1024, 768, 'উপরের formula bar সবসময় select করা cell-এর আসল formula দেখায়, শুধু তার ফলাফল না।'),
      h(2, 'Worksheet আর Workbook', 'worksheet-আর-workbook'),
      p('<p>একটা Excel file — একটা <b>workbook</b> — একাধিক <b>worksheet</b> রাখতে পারে, নিচের tab গুলো। একটা file-এর ভেতরে আলাদা কাজের জন্য আলাদা grid।</p>'),
      h(2, 'Name Box আর দ্রুত ঘোরাঘুরি', 'name-box-আর-দ্রুত-ঘোরাঘুরি'),
      p('<p>উপরে-বামে, column A-এর উপরের ছোট বাক্সটা হলো <b>Name Box</b> — <code>Z100</code>-এর মতো একটা cell reference টাইপ করে Enter চাপলে সরাসরি সেখানে চলে যায়। <code>Ctrl+Home</code> A1 cell-এ ফিরিয়ে নেয়; <code>Ctrl+End</code> যেখানে আসলে ডেটা আছে তার শেষ cell-এ নিয়ে যায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'excel-entering-data', sortOrder: n++,
  en: {
    title: 'Entering and Editing Data',
    metaTitle: 'Excel Entering and Editing Data | Learn Computer Academy',
    metaDescription: 'Text, numbers, and dates in Excel, and how to edit a cell once something is already in it.',
    blocks: [
      p('<p>Typing into a cell is the first skill, and Excel treats what you type differently depending on what it looks like.</p>'),
      h(2, 'Text, Numbers, Dates'),
      p('<p>Excel auto-detects what\'s typed: numbers align to the right, text aligns to the left, and recognized dates can be sorted chronologically rather than alphabetically.</p>'),
      h(2, 'Editing a Cell'),
      p('<p>Click once to select a cell, click again (or press <code>F2</code>) to edit its contents directly. <code>Enter</code> confirms and moves down one cell; <code>Tab</code> confirms and moves right one cell.</p>'),
      table(['Key', 'What it does'], [['F2', 'Edit the selected cell'], ['Enter', 'Confirm and move down'], ['Tab', 'Confirm and move right'], ['Esc', 'Cancel the edit']]),
      h(2, 'AutoFill — the Fill Handle'),
      p('<p>A small square appears at the bottom-right corner of a selected cell — dragging it (the <b>fill handle</b>) continues an obvious pattern automatically: 1, 2, 3… or Monday, Tuesday, Wednesday… or a formula copied down every row it\'s dragged across.</p>'),
    ],
  },
  bn: {
    title: 'ডেটা এন্টার আর এডিট করা',
    metaTitle: 'Excel-এ ডেটা এন্টার আর এডিট করা | Learn Computer Academy',
    metaDescription: 'Excel-এ text, number, আর date, আর একটা cell-এ ইতিমধ্যে কিছু থাকলে সেটা কীভাবে edit করবেন।',
    blocks: [
      p('<p>একটা cell-এ টাইপ করা প্রথম দক্ষতা, আর কী টাইপ করা হয়েছে তা দেখতে কেমন তার উপর ভিত্তি করে Excel সেটাকে আলাদাভাবে ধরে।</p>'),
      h(2, 'Text, Number, Date', 'text-number-date'),
      p('<p>কী টাইপ করা হয়েছে Excel স্বয়ংক্রিয়ভাবে চিনে নেয়: number ডানে align হয়, text বামে align হয়, আর চেনা date বর্ণানুক্রমিক না, তারিখ অনুযায়ী sort করা যায়।</p>'),
      h(2, 'একটা Cell Edit করা', 'একটা-cell-edit-করা'),
      p('<p>একটা cell select করতে একবার ক্লিক করুন, সরাসরি এর ভেতরের কনটেন্ট edit করতে আবার ক্লিক করুন (বা <code>F2</code> চাপুন)। <code>Enter</code> কনফার্ম করে এক cell নিচে যায়; <code>Tab</code> কনফার্ম করে এক cell ডানে যায়।</p>'),
      table(['Key', 'কী করে'], [['F2', 'Select করা cell edit করে'], ['Enter', 'কনফার্ম করে নিচে যায়'], ['Tab', 'কনফার্ম করে ডানে যায়'], ['Esc', 'Edit বাতিল করে']]),
      h(2, 'AutoFill — Fill Handle', 'autofill-fill-handle'),
      p('<p>Select করা একটা cell-এর নিচে-ডানে কোণে একটা ছোট বর্গক্ষেত্র দেখা যায় — এটা (<b>fill handle</b>) drag করলে একটা স্পষ্ট প্যাটার্ন স্বয়ংক্রিয়ভাবে চলতে থাকে: 1, 2, 3… বা Monday, Tuesday, Wednesday… বা যেসব row-এর উপর দিয়ে drag হয় সেখানে একটা formula copy হয়ে যায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'excel-basic-formulas', sortOrder: n++,
  en: {
    title: 'Basic Formulas',
    metaTitle: 'Excel Basic Formulas | Learn Computer Academy',
    metaDescription: 'Writing a formula in Excel, the four arithmetic operators, and SUM/AVERAGE — the whole reason Excel exists.',
    blocks: [
      p('<p>A <b>formula</b> turns a cell from a fixed number into a calculated result — the whole reason Excel exists rather than a plain table in Word.</p>'),
      h(2, 'Starting with ='),
      p('<p>Every formula begins with an equals sign. <code>=A1+B1</code> adds the values currently in those two cells — and updates automatically if either one changes.</p>'),
      h(2, 'The Four Operators'),
      table(['Operator', 'Does'], [['+', 'Add'], ['-', 'Subtract'], ['*', 'Multiply'], ['/', 'Divide']]),
      h(2, 'SUM and AVERAGE'),
      p('<p><code>=SUM(A1:A10)</code> adds every cell in that range. <code>=AVERAGE(A1:A10)</code> finds the mean. Both are far faster and less error-prone than adding a long column by hand.</p>'),
      h(2, 'Order of Operations'),
      p('<p>Excel formulas follow the same order of operations as regular math — multiplication and division happen before addition and subtraction. <code>=2+3*4</code> gives 14, not 20. Use parentheses to force a different order: <code>=(2+3)*4</code> gives 20.</p>'),
    ],
  },
  bn: {
    title: 'বেসিক Formula',
    metaTitle: 'Excel-এ বেসিক Formula | Learn Computer Academy',
    metaDescription: 'Excel-এ একটা formula লেখা, চারটা arithmetic operator, আর SUM/AVERAGE — Excel-এর অস্তিত্বের আসল কারণ।',
    blocks: [
      p('<p>একটা <b>formula</b> একটা cell-কে একটা স্থির সংখ্যা থেকে একটা হিসেব করা ফলাফলে বদলে দেয় — Word-এর একটা সাধারণ table-এর বদলে Excel-এর অস্তিত্বের আসল কারণ এটাই।</p>'),
      h(2, '= দিয়ে শুরু করা', '=-দিয়ে-শুরু-করা'),
      p('<p>প্রতিটা formula একটা equals sign দিয়ে শুরু হয়। <code>=A1+B1</code> সেই দুটো cell-এ এখন যা আছে তা যোগ করে — আর যেকোনো একটা বদলালে স্বয়ংক্রিয়ভাবে আপডেট হয়।</p>'),
      h(2, 'চারটা Operator', 'চারটা-operator'),
      table(['Operator', 'যা করে'], [['+', 'যোগ'], ['-', 'বিয়োগ'], ['*', 'গুণ'], ['/', 'ভাগ']]),
      h(2, 'SUM আর AVERAGE', 'sum-আর-average'),
      p('<p><code>=SUM(A1:A10)</code> সেই range-এর প্রতিটা cell যোগ করে। <code>=AVERAGE(A1:A10)</code> গড় বের করে। দুটোই হাতে একটা লম্বা column যোগ করার চেয়ে অনেক দ্রুত আর কম ভুলের ঝুঁকির।</p>'),
      h(2, 'হিসেবের ক্রম', 'হিসেবের-ক্রম'),
      p('<p>Excel formula সাধারণ math-এর একই হিসেবের ক্রম মেনে চলে — গুণ আর ভাগ যোগ আর বিয়োগের আগে হয়। <code>=2+3*4</code> দেয় 14, 20 না। ভিন্ন ক্রম জোর করতে bracket ব্যবহার করুন: <code>=(2+3)*4</code> দেয় 20।</p>'),
    ],
  },
})

lessons.push({
  slug: 'excel-cell-references', sortOrder: n++,
  en: {
    title: 'Cell References (Relative and Absolute)',
    metaTitle: 'Excel Cell References — Relative and Absolute | Learn Computer Academy',
    metaDescription: 'What happens to a formula when you copy it, and how the $ sign locks a reference in place.',
    blocks: [
      p('<p>What happens to a formula when you copy it is the single most confusing, and most useful, Excel behavior for a beginner.</p>'),
      h(2, 'Relative References'),
      p('<p><code>=A1+B1</code> copied one row down automatically becomes <code>=A2+B2</code> — Excel shifts the reference to match, which is usually exactly what\'s wanted when applying the same calculation down a whole column.</p>'),
      h(2, 'Absolute References ($)'),
      p('<p>Putting <code>$</code> before the column letter and row number, like <code>$D$1</code>, locks that reference so copying the formula never changes it — essential when every row needs to use the same one fixed cell, like a tax rate.</p>'),
      code('text', '=B2*$D$1   (row 2)\n=B3*$D$1   (row 3, copied down — $D$1 never moves)\n=B4*$D$1   (row 4, still $D$1)'),
      h(2, 'Mixed References'),
      p('<p>It\'s also possible to lock only the column or only the row: <code>$A1</code> locks column A but lets the row shift when copied down; <code>A$1</code> locks row 1 but lets the column shift when copied across. Genuinely useful when building a table where one axis should stay fixed and the other shouldn\'t.</p>'),
    ],
  },
  bn: {
    title: 'Cell Reference (Relative আর Absolute)',
    metaTitle: 'Excel Cell Reference — Relative আর Absolute | Learn Computer Academy',
    metaDescription: 'একটা formula copy করলে কী হয়, আর $ চিহ্ন কীভাবে একটা reference জায়গায় আটকে রাখে।',
    blocks: [
      p('<p>একটা formula copy করলে কী হয় — নতুনদের জন্য এটাই Excel-এর সবচেয়ে বিভ্রান্তিকর, আবার সবচেয়ে কাজের আচরণ।</p>'),
      h(2, 'Relative Reference', 'relative-reference'),
      p('<p><code>=A1+B1</code> এক row নিচে copy করলে স্বয়ংক্রিয়ভাবে <code>=A2+B2</code> হয়ে যায় — Excel reference মিলিয়ে সরিয়ে দেয়, একই হিসেব পুরো একটা column জুড়ে করতে চাইলে এটাই সাধারণত চাওয়া হয়।</p>'),
      h(2, 'Absolute Reference ($)', 'absolute-reference'),
      p('<p>Column-এর অক্ষর আর row-এর সংখ্যার আগে <code>$</code> দিলে, যেমন <code>$D$1</code>, সেই reference আটকে যায় যাতে formula copy করলেও তা কখনো না বদলায় — প্রতিটা row-এর একই একটা নির্দিষ্ট cell লাগলে, যেমন একটা tax rate, এটা জরুরি।</p>'),
      code('text', '=B2*$D$1   (row 2)\n=B3*$D$1   (row 3, নিচে copy করা — $D$1 কখনো সরে না)\n=B4*$D$1   (row 4, তবুও $D$1)'),
      h(2, 'Mixed Reference', 'mixed-reference'),
      p('<p>শুধু column বা শুধু row-ও আটকে রাখা যায়: <code>$A1</code> column A আটকে রাখে কিন্তু নিচে copy করলে row সরতে দেয়; <code>A$1</code> row 1 আটকে রাখে কিন্তু পাশে copy করলে column সরতে দেয়। একটা table বানানোর সময় সত্যিই কাজের যেখানে এক দিক স্থির থাকা উচিত, অন্যটা না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'excel-formatting-cells', sortOrder: n++,
  en: {
    title: 'Formatting Cells',
    metaTitle: 'Excel Formatting Cells | Learn Computer Academy',
    metaDescription: "Number formats, borders, fill color, and why a bold header row is the single easiest readability fix in Excel.",
    blocks: [
      p('<p>Formatting is what makes a spreadsheet actually readable — number formats, borders, and color.</p>'),
      h(2, 'Number Formats'),
      p('<p>The same underlying value <code>1000</code> can display as <code>1000</code>, <code>1,000.00</code>, <code>₹1,000</code>, or <code>100000%</code> depending on the format applied — the number itself never changes, only how it\'s shown.</p>'),
      h(2, 'Borders, Fill Color, Bold Headers'),
      p('<p>Found in the Home tab. A bolded, colored header row is the single easiest change that makes almost any spreadsheet easier to read at a glance.</p>'),
      h(2, 'Conditional Formatting'),
      p('<p>Home tab → <b>Conditional Formatting</b> changes a cell\'s appearance automatically based on its value — for example, coloring every cell below 40 red without checking each one by hand. The formatting updates live as the underlying numbers change.</p>'),
    ],
  },
  bn: {
    title: 'Cell Formatting',
    metaTitle: 'Excel-এ Cell Formatting | Learn Computer Academy',
    metaDescription: 'Number format, border, fill color, আর কেন একটা bold header row Excel-এর সবচেয়ে সহজ readability fix।',
    blocks: [
      p('<p>Formatting-ই একটা spreadsheet-কে সত্যিই পড়ার মতো করে তোলে — number format, border, আর color।</p>'),
      h(2, 'Number Format', 'number-format'),
      p('<p>একই আসল মান <code>1000</code> প্রয়োগ করা format অনুযায়ী <code>1000</code>, <code>1,000.00</code>, <code>₹1,000</code>, বা <code>100000%</code> হিসেবে দেখাতে পারে — সংখ্যাটা নিজে কখনো বদলায় না, শুধু কীভাবে দেখানো হচ্ছে তা বদলায়।</p>'),
      h(2, 'Border, Fill Color, Bold Header', 'border-fill-color-bold-header'),
      p('<p>Home tab-এ পাওয়া যায়। একটা bold, রঙিন header row হলো সবচেয়ে সহজ বদল যা প্রায় যেকোনো spreadsheet-কে এক নজরে পড়া সহজ করে দেয়।</p>'),
      h(2, 'Conditional Formatting', 'conditional-formatting'),
      p('<p>Home tab → <b>Conditional Formatting</b> একটা cell-এর মান অনুযায়ী তার চেহারা স্বয়ংক্রিয়ভাবে বদলে দেয় — যেমন, হাতে একটা একটা চেক না করেই 40-এর নিচে প্রতিটা cell লাল করে দেওয়া। আসল সংখ্যা বদলালে formatting লাইভ আপডেট হয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'excel-sorting-and-filtering', sortOrder: n++,
  en: {
    title: 'Sorting and Filtering Data',
    metaTitle: 'Excel Sorting and Filtering Data | Learn Computer Academy',
    metaDescription: 'Putting rows in order with Sort, temporarily hiding rows with Filter, and the mistake of sorting only one column.',
    blocks: [
      p('<p><b>Sort</b> puts rows in order; <b>Filter</b> temporarily hides the rows you don\'t need to see, without deleting anything.</p>'),
      h(2, 'Sorting'),
      p('<p>Select the data, then Data tab → Sort, choosing a column and ascending or descending order.</p>'),
      h(2, 'Filtering'),
      p('<p>Data tab → Filter adds dropdown arrows to each column header, letting rows be shown only if they match a condition — the underlying data doesn\'t change, only what\'s currently visible.</p>'),
      callout('warning', "<p>Always select the <b>whole table</b>, not just one column, before sorting. Sorting a single column scrambles which name goes with which number — Excel usually warns before doing this, but it's worth knowing why the warning exists.</p>", 'The most common sorting mistake'),
      h(2, 'Custom Sort — More Than One Level'),
      p('<p>Data tab → Sort → <b>Add Level</b> sorts by more than one column at once — for example, every row grouped by Department first, then alphabetically by Name within each department. Each level can have its own ascending or descending order.</p>'),
    ],
  },
  bn: {
    title: 'ডেটা Sort আর Filter করা',
    metaTitle: 'Excel-এ ডেটা Sort আর Filter করা | Learn Computer Academy',
    metaDescription: 'Sort দিয়ে row সাজানো, Filter দিয়ে সাময়িকভাবে row লুকানো, আর শুধু একটা column sort করার ভুল।',
    blocks: [
      p('<p><b>Sort</b> row গুলোকে ক্রমে সাজায়; <b>Filter</b> কিছু মুছে না ফেলেই যে row গুলো দেখার দরকার নেই তা সাময়িকভাবে লুকিয়ে দেয়।</p>'),
      h(2, 'Sort করা', 'sort-করা'),
      p('<p>ডেটা select করুন, তারপর Data tab → Sort, একটা column আর ascending বা descending order বেছে নিন।</p>'),
      h(2, 'Filter করা', 'filter-করা'),
      p('<p>Data tab → Filter প্রতিটা column header-এ dropdown তীর যোগ করে, শর্ত মিললেই শুধু সেই row দেখাতে দেয় — আসল ডেটা বদলায় না, শুধু এখন কী দেখা যাচ্ছে তা বদলায়।</p>'),
      callout('warning', '<p>Sort করার আগে সবসময় শুধু একটা column না, <b>পুরো table</b> select করুন। একটা column sort করলে কোন নাম কোন সংখ্যার সাথে যাচ্ছে তা এলোমেলো হয়ে যায় — Excel সাধারণত এটা করার আগে সতর্ক করে, কিন্তু কেন এই সতর্কতা আছে তা জানা মূল্যবান।</p>', 'Sort করার সবচেয়ে সাধারণ ভুল'),
      h(2, 'Custom Sort — একের বেশি Level', 'custom-sort-একের-বেশি-level'),
      p('<p>Data tab → Sort → <b>Add Level</b> একসাথে একের বেশি column দিয়ে sort করে — যেমন, প্রতিটা row প্রথমে Department অনুযায়ী গ্রুপ করা, তারপর প্রতিটা department-এর ভেতরে Name অনুযায়ী বর্ণানুক্রমিক। প্রতিটা level-এর নিজের ascending বা descending order থাকতে পারে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'excel-basic-functions', sortOrder: n++,
  en: {
    title: 'Basic Functions (IF, COUNT, MAX, MIN)',
    metaTitle: 'Excel Basic Functions — IF, COUNT, MAX, MIN | Learn Computer Academy',
    metaDescription: 'Beyond SUM and AVERAGE — IF, COUNT, COUNTIF, MAX, and MIN cover most beginner Excel needs.',
    blocks: [
      p('<p>Beyond SUM and AVERAGE, a small handful of functions cover most beginner needs.</p>'),
      table(
        ['Function', 'What it does'],
        [
          ['=IF(A1>50,"Pass","Fail")', 'A decision — one result if the condition is true, another if false'],
          ['=COUNT(A1:A10)', 'How many cells in the range contain a number'],
          ['=COUNTIF(A1:A10,"Yes")', 'How many cells match a specific condition'],
          ['=MAX(A1:A10) / =MIN(A1:A10)', 'The largest or smallest value in the range'],
        ]
      ),
      p('<p>All four follow the same shape as SUM and AVERAGE — a function name, then the cells to work on inside parentheses.</p>'),
      h(2, 'A First Look at VLOOKUP'),
      p('<p><code>=VLOOKUP(lookup_value, table_range, column_number, FALSE)</code> searches down the first column of a range for a match, then returns a value from a chosen column in that same row — the function behind "look up this ID and give me the matching name." It\'s the single most-used function beyond the basics, worth returning to once the four above feel comfortable.</p>'),
    ],
  },
  bn: {
    title: 'বেসিক Function (IF, COUNT, MAX, MIN)',
    metaTitle: 'Excel বেসিক Function — IF, COUNT, MAX, MIN | Learn Computer Academy',
    metaDescription: 'SUM আর AVERAGE-এর বাইরে — IF, COUNT, COUNTIF, MAX, আর MIN বেশিরভাগ নতুনদের দরকার কভার করে।',
    blocks: [
      p('<p>SUM আর AVERAGE-এর বাইরে, হাতে গোনা কয়েকটা function বেশিরভাগ নতুনদের দরকার কভার করে।</p>'),
      table(
        ['Function', 'কী করে'],
        [
          ['=IF(A1>50,"Pass","Fail")', 'একটা সিদ্ধান্ত — condition true হলে একটা ফলাফল, false হলে আরেকটা'],
          ['=COUNT(A1:A10)', 'range-এ কতগুলো cell-এ সংখ্যা আছে'],
          ['=COUNTIF(A1:A10,"Yes")', 'নির্দিষ্ট শর্তের সাথে কতগুলো cell মেলে'],
          ['=MAX(A1:A10) / =MIN(A1:A10)', 'range-এর সবচেয়ে বড় বা সবচেয়ে ছোট মান'],
        ]
      ),
      p('<p>চারটাই SUM আর AVERAGE-এর একই আকার অনুসরণ করে — একটা function-এর নাম, তারপর bracket-এর ভেতরে যে cell-এ কাজ করবে।</p>'),
      h(2, 'VLOOKUP-এ প্রথম নজর', 'vlookup-এ-প্রথম-নজর'),
      p('<p><code>=VLOOKUP(lookup_value, table_range, column_number, FALSE)</code> একটা range-এর প্রথম column-এ নিচের দিকে একটা মিল খোঁজে, তারপর সেই একই row-এর বেছে নেওয়া column থেকে একটা মান ফিরিয়ে দেয় — "এই ID খুঁজে বের করো, মিলে যাওয়া নাম দাও"-এর পেছনের function এটাই। বেসিকের বাইরে সবচেয়ে বেশি ব্যবহৃত একটা function, উপরের চারটার সাথে স্বচ্ছন্দ হয়ে গেলে এটায় ফিরে আসার মতো।</p>'),
    ],
  },
})

lessons.push({
  slug: 'excel-charts', sortOrder: n++,
  en: {
    title: 'Creating Charts and Graphs',
    metaTitle: 'Excel Creating Charts and Graphs | Learn Computer Academy',
    metaDescription: 'Turning a grid of numbers into a chart, and choosing between column, line, and pie charts.',
    blocks: [
      p('<p>A chart turns a grid of numbers into a shape a person can understand in one glance.</p>'),
      h(2, 'Inserting a Chart'),
      p('<p>Select the data including its headers, then Insert tab → pick a chart type. Column, line, and pie are the three every beginner needs first.</p>'),
      h(2, 'Choosing the Right Chart'),
      table(
        ['Chart type', 'Best for'],
        [
          ['Column / Bar', 'Comparing separate categories side by side'],
          ['Line', 'Change over time'],
          ['Pie', 'Parts of one whole — only works well with a handful of categories'],
        ]
      ),
      h(2, 'Editing a Chart After Creating It'),
      p('<p>Click a chart once to select it, and a <b>Chart Design</b> tab appears — change the chart type, add axis titles, or move the legend. Drag a corner handle to resize the whole chart, or drag the chart itself to reposition it anywhere on the sheet.</p>'),
    ],
  },
  bn: {
    title: 'Chart আর Graph তৈরি করা',
    metaTitle: 'Excel-এ Chart আর Graph তৈরি করা | Learn Computer Academy',
    metaDescription: 'সংখ্যার একটা grid-কে একটা chart-এ বদলানো, আর column, line, আর pie chart-এর মধ্যে বেছে নেওয়া।',
    blocks: [
      p('<p>একটা chart সংখ্যার একটা grid-কে এমন একটা shape-এ বদলে দেয় যা একজন মানুষ এক নজরে বুঝতে পারে।</p>'),
      h(2, 'একটা Chart Insert করা', 'একটা-chart-insert-করা'),
      p('<p>header সহ ডেটা select করুন, তারপর Insert tab → একটা chart type বেছে নিন। Column, line, আর pie — নতুনদের প্রথমে এই তিনটাই দরকার।</p>'),
      h(2, 'সঠিক Chart বেছে নেওয়া', 'সঠিক-chart-বেছে-নেওয়া'),
      table(
        ['Chart-এর ধরন', 'যার জন্য সেরা'],
        [
          ['Column / Bar', 'পাশাপাশি আলাদা category তুলনা করা'],
          ['Line', 'সময়ের সাথে পরিবর্তন'],
          ['Pie', 'একটা সম্পূর্ণের অংশ — শুধু হাতে গোনা কয়েকটা category হলে ভালো কাজ করে'],
        ]
      ),
      h(2, 'একটা Chart তৈরির পর Edit করা', 'একটা-chart-তৈরির-পর-edit-করা'),
      p('<p>একটা chart-এ একবার ক্লিক করে সেটা select করুন, তখন একটা <b>Chart Design</b> tab দেখা যায় — chart-এর ধরন বদলান, axis title যোগ করুন, বা legend সরান। পুরো chart resize করতে একটা কোণের handle drag করুন, বা sheet-এর যেকোনো জায়গায় সরাতে chart-টাই drag করুন।</p>'),
    ],
  },
})

lessons.push({
  slug: 'excel-multiple-sheets', sortOrder: n++,
  en: {
    title: 'Working with Multiple Sheets',
    metaTitle: 'Excel Working with Multiple Sheets | Learn Computer Academy',
    metaDescription: 'Adding, renaming, and referencing across worksheet tabs within one Excel workbook.',
    blocks: [
      p('<p>Keeping related data in separate tabs of one file, instead of separate files entirely, is what multiple worksheets are for.</p>'),
      h(2, 'Adding, Renaming, Navigating Sheets'),
      p('<p>The <code>+</code> button next to the sheet tabs adds a new one. Double-click a tab to rename it. Click a tab to switch to it.</p>'),
      h(2, 'Referencing Another Sheet'),
      p('<p><code>=Sheet2!A1</code> pulls the value from cell A1 on a different sheet — the sheet name, an exclamation mark, then the cell reference.</p>'),
      h(2, 'Grouping Sheets'),
      p('<p>Click one sheet tab, then <code>Ctrl+click</code> others to select several at once — any formatting or entry then applies to all selected sheets simultaneously. Useful for building several identical-layout sheets (one per month, one per branch) at the same time.</p>'),
    ],
  },
  bn: {
    title: 'একাধিক Sheet নিয়ে কাজ করা',
    metaTitle: 'Excel-এ একাধিক Sheet নিয়ে কাজ করা | Learn Computer Academy',
    metaDescription: 'একটা Excel workbook-এর ভেতরে worksheet tab যোগ, rename, আর একটা থেকে আরেকটায় reference করা।',
    blocks: [
      p('<p>সম্পূর্ণ আলাদা file-এর বদলে একটা file-এর আলাদা tab-এ সম্পর্কিত ডেটা রাখা — একাধিক worksheet এজন্যই।</p>'),
      h(2, 'Sheet যোগ, Rename, Navigate করা', 'sheet-যোগ-rename-navigate-করা'),
      p('<p>Sheet tab-এর পাশের <code>+</code> বাটন একটা নতুন যোগ করে। একটা tab rename করতে সেটায় double-click করুন। একটা tab-এ যেতে সেটায় ক্লিক করুন।</p>'),
      h(2, 'অন্য একটা Sheet Reference করা', 'অন্য-একটা-sheet-reference-করা'),
      p('<p><code>=Sheet2!A1</code> অন্য একটা sheet-এর A1 cell-এর মান নিয়ে আসে — sheet-এর নাম, একটা exclamation mark, তারপর cell reference।</p>'),
      h(2, 'Sheet Group করা', 'sheet-group-করা'),
      p('<p>একটা sheet tab-এ ক্লিক করুন, তারপর আরও কয়েকটা একসাথে select করতে <code>Ctrl+click</code> করুন — তারপর যেকোনো formatting বা এন্ট্রি একসাথে select করা সব sheet-এ প্রয়োগ হয়। একই layout-এর কয়েকটা sheet (মাসপ্রতি একটা, শাখাপ্রতি একটা) একসাথে বানাতে কাজের।</p>'),
    ],
  },
})

lessons.push({
  slug: 'excel-page-setup-and-printing', sortOrder: n++,
  en: {
    title: 'Page Setup and Printing',
    metaTitle: 'Excel Page Setup and Printing | Learn Computer Academy',
    metaDescription: "Print area, fit-to-page scaling, and why print preview matters more in Excel than in Word.",
    blocks: [
      p('<p>A spreadsheet that looks fine on screen often prints badly — wide tables cut off, or text too small to read.</p>'),
      h(2, 'Print Area and Scaling'),
      p('<p>Page Layout tab → <b>Print Area</b> sets exactly which cells print. <b>"Fit to 1 page"</b> scaling shrinks wide data to fit one printed page width, instead of splitting it across several.</p>'),
      h(2, 'Print Preview'),
      p('<p><code>Ctrl+P</code> shows exactly what will print before it prints — always worth checking once, since Excel\'s grid rarely maps to a printed page as cleanly as it looks on screen.</p>'),
      h(2, 'Repeating Header Rows on Every Page'),
      p('<p>Page Layout tab → <b>Print Titles</b> → Rows to Repeat at Top keeps the header row visible on every printed page of a long table, instead of only the first — the single most useful setting for a multi-page printed spreadsheet.</p>'),
    ],
  },
  bn: {
    title: 'Page Setup আর Print করা',
    metaTitle: 'Excel-এ Page Setup আর Print করা | Learn Computer Academy',
    metaDescription: 'Print area, fit-to-page scaling, আর কেন Word-এর চেয়ে Excel-এ print preview বেশি গুরুত্বপূর্ণ।',
    blocks: [
      p('<p>স্ক্রিনে ঠিকঠাক দেখতে লাগা একটা spreadsheet প্রায়ই খারাপভাবে print হয় — চওড়া table কাটা পড়ে, বা text পড়ার মতো ছোট।</p>'),
      h(2, 'Print Area আর Scaling', 'print-area-আর-scaling'),
      p('<p>Page Layout tab → <b>Print Area</b> ঠিক করে কোন cell গুলো print হবে। <b>"Fit to 1 page"</b> scaling চওড়া ডেটাকে কয়েক page-এ ভাগ না করে একটা printed page-এর width-এ ছোট করে ফেলে।</p>'),
      h(2, 'Print Preview', 'print-preview'),
      p('<p><code>Ctrl+P</code> print হওয়ার আগেই ঠিক কী print হবে তা দেখায় — একবার চেক করা সবসময় মূল্যবান, কারণ Excel-এর grid স্ক্রিনে যতটা পরিষ্কার দেখায় print করা page-এ প্রায়ই ততটা মেলে না।</p>'),
      h(2, 'প্রতিটা Page-এ Header Row পুনরাবৃত্তি', 'প্রতিটা-page-এ-header-row-পুনরাবৃত্তি'),
      p('<p>Page Layout tab → <b>Print Titles</b> → Rows to Repeat at Top একটা লম্বা table-এর প্রতিটা printed page-এ header row দেখা যায় এমন রাখে, শুধু প্রথমটায় না — একটা multi-page printed spreadsheet-এর জন্য সবচেয়ে কাজের সেটিং।</p>'),
    ],
  },
})

lessons.push({
  slug: 'excel-saving-and-exporting', sortOrder: n++,
  en: {
    title: 'Saving and Exporting',
    metaTitle: 'Excel Saving and Exporting | Learn Computer Academy',
    metaDescription: '.xlsx vs PDF vs CSV in Excel — which to use for editing, sharing, or moving data between programs.',
    blocks: [
      p("<p>Same idea as Word — a native format for editing, and other formats for sharing a fixed copy or moving data elsewhere.</p>"),
      h(2, '.xlsx vs PDF vs CSV'),
      table(
        ['Format', 'Use it for'],
        [
          ['.xlsx', "Excel's own format — keeps formulas and formatting"],
          ['PDF', 'A fixed copy that looks the same everywhere — formulas become plain text'],
          ['CSV', 'Plain data only, no formatting or formulas — opens in almost any spreadsheet program, including LibreOffice Calc and Google Sheets'],
        ]
      ),
      callout('tip', '<p>CSV is worth remembering — it\'s the one format every spreadsheet program, free or paid, can open without any conversion.</p>', 'The universal spreadsheet format'),
      h(2, 'Protecting a Workbook'),
      p('<p>File → Info → Protect Workbook can require a password to open a file, or mark it read-only to discourage accidental edits — worth using before sending a spreadsheet to a large group when the numbers shouldn\'t change.</p>'),
    ],
  },
  bn: {
    title: 'Save আর Export করা',
    metaTitle: 'Excel-এ Save আর Export করা | Learn Computer Academy',
    metaDescription: 'Excel-এ .xlsx বনাম PDF বনাম CSV — editing, শেয়ার করা, বা অন্য প্রোগ্রামে ডেটা নেওয়ার জন্য কোনটা ব্যবহার করবেন।',
    blocks: [
      p('<p>Word-এর মতোই আইডিয়া — editing-এর জন্য একটা নিজস্ব format, আর একটা fixed কপি শেয়ার করা বা অন্য কোথাও ডেটা নেওয়ার জন্য অন্য format।</p>'),
      h(2, '.xlsx বনাম PDF বনাম CSV', 'xlsx-বনাম-pdf-বনাম-csv'),
      table(
        ['Format', 'যেখানে ব্যবহার করবেন'],
        [
          ['.xlsx', 'Excel-এর নিজস্ব format — formula আর formatting ধরে রাখে'],
          ['PDF', 'একটা fixed কপি যা সব জায়গায় একই রকম দেখায় — formula plain text হয়ে যায়'],
          ['CSV', 'শুধু plain ডেটা, কোনো formatting বা formula নেই — প্রায় যেকোনো spreadsheet প্রোগ্রামে খোলে, LibreOffice Calc আর Google Sheets সহ'],
        ]
      ),
      callout('tip', '<p>CSV মনে রাখার মতো — এটাই একমাত্র format যা free বা paid, প্রতিটা spreadsheet প্রোগ্রাম কোনো convert ছাড়াই খুলতে পারে।</p>', 'সার্বজনীন spreadsheet format'),
      h(2, 'একটা Workbook সুরক্ষিত করা', 'একটা-workbook-সুরক্ষিত-করা'),
      p('<p>File → Info → Protect Workbook একটা file খুলতে password চাইতে পারে, বা ভুলবশত edit ঠেকাতে সেটাকে read-only করে দিতে পারে — সংখ্যাগুলো বদলানো উচিত না এমন অবস্থায় একটা spreadsheet বড় একটা গ্রুপকে পাঠানোর আগে ব্যবহার করার মতো।</p>'),
    ],
  },
})

lessons.push({
  slug: 'excel-common-mistakes', sortOrder: n++,
  en: {
    title: 'Common Beginner Mistakes in Excel',
    metaTitle: 'Common Beginner Mistakes in Excel | Learn Computer Academy',
    metaDescription: '#DIV/0!, #REF!, #NAME? and the one-column-sort mistake — recognizing the errors instead of panicking.',
    blocks: [
      p('<p>A short list of the errors that trip up almost every beginner, so they\'re recognized instead of panicked over.</p>'),
      table(
        ['Error', 'Real cause'],
        [
          ['#DIV/0!', 'A formula divided by an empty or zero cell'],
          ['#REF!', 'A formula points at a cell that got deleted'],
          ['#NAME?', 'A typo in a function name, or a missing quote around text'],
          ['Rows scrambled after sorting', 'Only one column was selected before sorting, not the whole table'],
        ]
      ),
      callout('note', "<p>None of these mean the file is broken. Each has one specific, fixable cause — find the referenced cell or the exact formula and the fix is usually obvious once seen.</p>", "It's always fixable"),
      h(2, 'Circular Reference'),
      p('<p>A <b>circular reference</b> happens when a formula refers back to its own cell, directly or through a chain — <code>A1</code> containing <code>=A1+1</code> is the simplest example. Excel can\'t calculate a result that depends on itself, and shows a warning rather than a wrong number.</p>'),
    ],
  },
  bn: {
    title: 'Excel-এ নতুনদের সাধারণ ভুল',
    metaTitle: 'Excel-এ নতুনদের সাধারণ ভুল | Learn Computer Academy',
    metaDescription: '#DIV/0!, #REF!, #NAME? আর এক-column-sort ভুল — ভয় না পেয়ে error গুলো চেনা।',
    blocks: [
      p('<p>প্রায় প্রতিটা নতুনকে ধোঁকা দেওয়া কয়েকটা error-এর একটা ছোট তালিকা, যাতে ভয় না পেয়ে সেগুলো চেনা যায়।</p>'),
      table(
        ['Error', 'আসল কারণ'],
        [
          ['#DIV/0!', 'একটা formula খালি বা শূন্য cell দিয়ে ভাগ করেছে'],
          ['#REF!', 'একটা formula এমন একটা cell-কে দেখাচ্ছে যা মুছে গেছে'],
          ['#NAME?', 'function-এর নামে টাইপো, বা text-এর চারপাশে quote মিসিং'],
          ['Sort করার পর row এলোমেলো', 'Sort করার আগে পুরো table না, শুধু একটা column select করা হয়েছিল'],
        ]
      ),
      callout('note', '<p>এগুলোর কোনোটাই মানে না যে file নষ্ট হয়ে গেছে। প্রতিটার একটা নির্দিষ্ট, ঠিক করার মতো কারণ আছে — যে cell-কে দেখানো হচ্ছে বা যে formula-টা আছে সেটা খুঁজে বের করলেই সাধারণত সমাধান স্পষ্ট হয়ে যায়।</p>', 'এটা সবসময় ঠিক করা যায়'),
      h(2, 'Circular Reference', 'circular-reference'),
      p('<p>একটা <b>circular reference</b> তখন হয় যখন একটা formula সরাসরি বা একটা চেইনের মধ্য দিয়ে নিজের cell-কেই নির্দেশ করে — <code>A1</code>-এ <code>=A1+1</code> থাকা সবচেয়ে সহজ উদাহরণ। Excel এমন একটা ফলাফল হিসেব করতে পারে না যা নিজের উপর নির্ভরশীল, আর ভুল সংখ্যার বদলে একটা সতর্কতা দেখায়।</p>'),
    ],
  },
})

// ═══ MS POWERPOINT (8) ═══════════════════════════════════════════════════

lessons.push({
  slug: 'powerpoint-introduction', sortOrder: n++,
  en: {
    title: 'Introduction to MS PowerPoint',
    metaTitle: 'Introduction to MS PowerPoint | Learn Computer Academy',
    metaDescription: 'Slides, layouts, and the slide panel — the building blocks of a PowerPoint presentation.',
    blocks: [
      p('<p><b>PowerPoint</b> builds a sequence of slides for presenting to a room, not a document for someone to read alone — that one distinction shapes almost every design choice in it.</p>'),
      h(2, 'Slides and Layouts'),
      p('<p>Each slide starts from a <b>layout</b> — a pre-arranged set of placeholder boxes for a title, text, or an image — so content lines up consistently from slide to slide.</p>'),
      img('docs/img/office/powerpoint-introduction-1-r2', 'A labeled mockup of a presentation editor: File, Home, Insert, Design, Transitions, Animations, and Slide Show tabs; New Slide, Layout, Font, Bold, Align, Insert Shape, and Insert Chart buttons; a slide thumbnail panel on the left; a title and bullet-point placeholder on the main slide; a notes panel at the bottom', 1024, 768, "Every placeholder box (title, bullet list) is exactly what a fresh layout gives you before you type anything into it."),
      h(2, 'The Slide Panel'),
      p('<p>The strip of slide thumbnails down the left side is how you reorder, duplicate, or delete whole slides — drag a thumbnail to reorder it.</p>'),
      h(2, 'Outline View — Draft Content Before Design'),
      p('<p>View tab → <b>Outline View</b> shows just the text of every slide as a simple nested list, hiding all the visual design. Drafting the words for a whole presentation here first, then switching back to design it, keeps the two jobs from getting tangled together.</p>'),
    ],
  },
  bn: {
    title: 'MS PowerPoint পরিচিতি',
    metaTitle: 'MS PowerPoint পরিচিতি | Learn Computer Academy',
    metaDescription: 'Slide, layout, আর slide panel — একটা PowerPoint presentation-এর বিল্ডিং ব্লক।',
    blocks: [
      p('<p><b>PowerPoint</b> একা পড়ার একটা document না, একটা রুমের সামনে উপস্থাপনের জন্য একের পর এক slide তৈরি করে — এই একটা পার্থক্যই এর প্রায় প্রতিটা ডিজাইন সিদ্ধান্ত ঠিক করে।</p>'),
      h(2, 'Slide আর Layout', 'slide-আর-layout'),
      p('<p>প্রতিটা slide একটা <b>layout</b> দিয়ে শুরু হয় — title, text, বা একটা ছবির জন্য আগে থেকে সাজানো placeholder বাক্সের একটা সেট — যাতে slide থেকে slide-এ কনটেন্ট সমানভাবে সাজানো থাকে।</p>'),
      img('docs/img/office/powerpoint-introduction-1-r2', 'একটা presentation editor-এর লেবেল করা mockup: File, Home, Insert, Design, Transitions, Animations, আর Slide Show tab; New Slide, Layout, Font, Bold, Align, Insert Shape, আর Insert Chart বাটন; বামে একটা slide thumbnail panel; মূল slide-এ একটা title আর bullet-point placeholder; নিচে একটা notes panel', 1024, 768, 'প্রতিটা placeholder বাক্স (title, bullet list) ঠিক যেভাবে একটা নতুন layout কিছু টাইপ করার আগে দেয়।'),
      h(2, 'Slide Panel', 'slide-panel'),
      p('<p>বাম পাশের slide thumbnail-এর ফালিটা দিয়েই আপনি পুরো slide reorder, duplicate, বা delete করেন — একটা thumbnail drag করে reorder করুন।</p>'),
      h(2, 'Outline View — Design করার আগে কনটেন্ট ড্রাফট করা', 'outline-view-design-করার-আগে-কনটেন্ট-ড্রাফট-করা'),
      p('<p>View tab → <b>Outline View</b> প্রতিটা slide-এর শুধু text-টাই একটা সহজ nested list হিসেবে দেখায়, ভিজ্যুয়াল design লুকিয়ে রেখে। পুরো presentation-এর কথাগুলো আগে এখানে ড্রাফট করে, তারপর design-এ ফিরে গেলে দুটো কাজ একসাথে জড়িয়ে যায় না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'powerpoint-text-and-formatting', sortOrder: n++,
  en: {
    title: 'Adding and Formatting Text',
    metaTitle: 'PowerPoint Adding and Formatting Text | Learn Computer Academy',
    metaDescription: 'Text placeholders in PowerPoint, and why fewer lines of text reads better from the back of a room.',
    blocks: [
      p('<p>Text in PowerPoint lives inside boxes, not flowing freely like in Word.</p>'),
      h(2, 'Placeholder Text Boxes'),
      p('<p>Click a "Click to add title" or "Click to add text" placeholder and type directly into it. Drag its edges to resize the box.</p>'),
      h(2, 'Keeping Slides Readable'),
      p('<p>A slide with more than roughly six lines of text usually reads as a wall of text from the back of a room. Short phrases, not full sentences, keep a slide readable at a distance.</p>'),
      h(2, 'AutoFit'),
      p('<p>By default, PowerPoint shrinks text automatically to keep it inside its placeholder — typing more than it can comfortably hold makes everything smaller rather than overflowing the box. This is exactly why "too much text" quietly becomes "too small to read" instead of visibly breaking the slide.</p>'),
    ],
  },
  bn: {
    title: 'Text যোগ আর Format করা',
    metaTitle: 'PowerPoint-এ Text যোগ আর Format করা | Learn Computer Academy',
    metaDescription: 'PowerPoint-এ text placeholder, আর কেন কম লাইনের text একটা রুমের পেছন থেকে ভালো পড়া যায়।',
    blocks: [
      p('<p>PowerPoint-এ text বাক্সের ভেতরে থাকে, Word-এর মতো স্বাধীনভাবে প্রবাহিত হয় না।</p>'),
      h(2, 'Placeholder Text বাক্স', 'placeholder-text-বাক্স'),
      p('<p>"Click to add title" বা "Click to add text" placeholder-এ ক্লিক করে সরাসরি টাইপ করুন। বাক্সটা resize করতে এর কিনারা drag করুন।</p>'),
      h(2, 'Slide পড়ার মতো রাখা', 'slide-পড়ার-মতো-রাখা'),
      p('<p>প্রায় ছয় লাইনের বেশি text থাকা একটা slide সাধারণত রুমের পেছন থেকে টেক্সটের একটা দেয়ালের মতো পড়া যায়। পুরো বাক্য না, ছোট phrase দূর থেকেও একটা slide পড়ার মতো রাখে।</p>'),
      h(2, 'AutoFit', 'autofit'),
      p('<p>ডিফল্টভাবে, PowerPoint একটা placeholder-এর ভেতরে রাখতে text স্বয়ংক্রিয়ভাবে ছোট করে দেয় — আরামে ধরে রাখার চেয়ে বেশি টাইপ করলে বাক্সের বাইরে না গিয়ে সবকিছু ছোট হয়ে যায়। এজন্যই "বেশি text" চুপচাপ "পড়ার জন্য খুব ছোট" হয়ে যায়, চোখে দেখা যাওয়ার মতো slide ভেঙে না গিয়ে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'powerpoint-images-and-shapes', sortOrder: n++,
  en: {
    title: 'Inserting Images, Shapes, and Icons',
    metaTitle: 'PowerPoint Inserting Images, Shapes, and Icons | Learn Computer Academy',
    metaDescription: 'Adding and resizing pictures on a slide, and controlling which object sits in front when two overlap.',
    blocks: [
      p('<p>Adding pictures, icons, and simple shapes to a slide works almost the same way as in Word.</p>'),
      h(2, 'Inserting and Resizing'),
      p('<p>Insert tab → Pictures, Icons, or Shapes. Drag a corner handle to resize while keeping proportions — the same rule as Word.</p>'),
      h(2, 'Layering Objects'),
      p('<p>Right-click → <b>Bring to Front</b> / <b>Send to Back</b> controls which object sits on top when two overlap on the same slide.</p>'),
      h(2, 'Cropping a Picture'),
      p('<p>Picture Format tab → <b>Crop</b> shows draggable handles on the edges of an image — drag them inward to trim away part of the photo without leaving PowerPoint. Crop → Crop to Shape trims the image into a circle, star, or any other shape instead of a rectangle.</p>'),
    ],
  },
  bn: {
    title: 'Image, Shape, আর Icon Insert করা',
    metaTitle: 'PowerPoint-এ Image, Shape, আর Icon Insert করা | Learn Computer Academy',
    metaDescription: 'একটা slide-এ ছবি যোগ আর resize করা, আর দুটো object ওভারল্যাপ করলে কোনটা সামনে থাকবে তা নিয়ন্ত্রণ করা।',
    blocks: [
      p('<p>একটা slide-এ ছবি, icon, আর সাধারণ shape যোগ করা প্রায় Word-এর মতোই কাজ করে।</p>'),
      h(2, 'Insert আর Resize করা', 'insert-আর-resize-করা'),
      p('<p>Insert tab → Pictures, Icons, বা Shapes। অনুপাত ঠিক রেখে resize করতে কোণের handle drag করুন — Word-এর একই নিয়ম।</p>'),
      h(2, 'Object লেয়ার করা', 'object-লেয়ার-করা'),
      p('<p>একই slide-এ দুটো object ওভারল্যাপ করলে কোনটা উপরে থাকবে তা right-click → <b>Bring to Front</b> / <b>Send to Back</b> দিয়ে নিয়ন্ত্রণ করা যায়।</p>'),
      h(2, 'একটা ছবি Crop করা', 'একটা-ছবি-crop-করা'),
      p('<p>Picture Format tab → <b>Crop</b> একটা image-এর কিনারায় drag করার মতো handle দেখায় — PowerPoint না ছেড়ে ছবির একটা অংশ বাদ দিতে সেগুলো ভেতরের দিকে drag করুন। Crop → Crop to Shape ছবিটাকে rectangle-এর বদলে একটা circle, star, বা অন্য কোনো shape-এ কেটে ফেলে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'powerpoint-themes-and-design', sortOrder: n++,
  en: {
    title: 'Slide Design and Themes',
    metaTitle: 'PowerPoint Slide Design and Themes | Learn Computer Academy',
    metaDescription: 'Applying a theme to set fonts and colors across a whole presentation at once, and Design Ideas.',
    blocks: [
      p('<p>A consistent look across every slide, set once instead of per slide, is what themes are for.</p>'),
      h(2, 'Themes'),
      p('<p>Design tab — a theme sets fonts, colors, and layout style for the entire presentation in one click.</p>'),
      h(2, 'Design Ideas'),
      p('<p>Design tab → Design Ideas suggests layout variations for the content already on a slide — worth trying before manually rearranging anything by hand.</p>'),
      h(2, 'The Slide Master'),
      p('<p>View tab → <b>Slide Master</b> opens one master slide that controls the look of every slide using a given layout — edit the master once (font, logo position, accent color) and the change appears everywhere that layout is used, instead of editing every slide individually.</p>'),
    ],
  },
  bn: {
    title: 'Slide Design আর Theme',
    metaTitle: 'PowerPoint-এ Slide Design আর Theme | Learn Computer Academy',
    metaDescription: 'একবারে পুরো presentation-এ font আর color সেট করতে একটা theme প্রয়োগ করা, আর Design Ideas।',
    blocks: [
      p('<p>প্রতিটা slide-এ আলাদা না, একবার সেট করা একটা সামঞ্জস্যপূর্ণ লুক — theme এজন্যই।</p>'),
      h(2, 'Theme', 'theme'),
      p('<p>Design tab — একটা theme এক ক্লিকে পুরো presentation-এর জন্য font, color, আর layout স্টাইল সেট করে।</p>'),
      h(2, 'Design Ideas', 'design-ideas'),
      p('<p>Design tab → Design Ideas একটা slide-এ ইতিমধ্যে থাকা কনটেন্টের জন্য layout ভেরিয়েশন সাজেস্ট করে — হাতে কিছু সাজানোর আগে এটা চেষ্টা করে দেখার মতো।</p>'),
      h(2, 'Slide Master', 'slide-master'),
      p('<p>View tab → <b>Slide Master</b> একটা master slide খোলে যা একটা নির্দিষ্ট layout ব্যবহার করা প্রতিটা slide-এর লুক নিয়ন্ত্রণ করে — master-টা একবার edit করুন (font, logo-র position, accent color) আর সেই layout যেখানেই ব্যবহৃত হচ্ছে সেখানে বদলটা দেখা যায়, প্রতিটা slide আলাদাভাবে edit করার বদলে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'powerpoint-transitions-and-animations', sortOrder: n++,
  en: {
    title: 'Transitions and Animations',
    metaTitle: 'PowerPoint Transitions and Animations | Learn Computer Academy',
    metaDescription: 'The difference between a transition and an animation in PowerPoint, and why less is genuinely more here.',
    blocks: [
      p('<p>Motion between and within slides is genuinely useful in small doses, and distracting in large ones.</p>'),
      h(2, 'Transitions (Between Slides)'),
      p('<p>Transitions tab — applies to how one slide changes to the next. One simple transition applied to every slide reads as more professional than a different flashy one on each slide.</p>'),
      h(2, 'Animations (Within a Slide)'),
      p('<p>Animations tab — makes one object appear, move, or disappear on its own within a slide. Useful for revealing a list of points one at a time instead of all at once.</p>'),
      callout('warning', "<p>Overusing animation is the single most common thing that makes a student presentation look unpolished. Used sparingly, it's not noticed. Used everywhere, it's all that's noticed.</p>", 'Less is more'),
      h(2, 'Animation Order and Triggers'),
      p('<p>The <b>Animation Pane</b> (Animations tab → Animation Pane) lists every animation on a slide in the order it plays, numbered — drag an item to reorder it. A <b>trigger</b> makes an animation wait for a click on a specific object instead of playing automatically in sequence.</p>'),
    ],
  },
  bn: {
    title: 'Transition আর Animation',
    metaTitle: 'PowerPoint-এ Transition আর Animation | Learn Computer Academy',
    metaDescription: 'PowerPoint-এ transition আর animation-এর পার্থক্য, আর কেন এখানে সত্যিই কম মানে বেশি।',
    blocks: [
      p('<p>Slide-এর মধ্যে আর ভেতরের গতি অল্প ব্যবহারে সত্যিই কাজের, বেশি ব্যবহারে মনোযোগ বিক্ষিপ্ত করে।</p>'),
      h(2, 'Transition (Slide-এর মধ্যে)', 'transition-slide-এর-মধ্যে'),
      p('<p>Transitions tab — এক slide কীভাবে পরেরটায় বদলায় তাতে প্রয়োগ হয়। প্রতিটা slide-এ প্রয়োগ করা একটা সাধারণ transition প্রতি slide-এ আলাদা একটা জমকালো transition-এর চেয়ে বেশি পেশাদার মনে হয়।</p>'),
      h(2, 'Animation (একটা Slide-এর ভেতরে)', 'animation-একটা-slide-এর-ভেতরে'),
      p('<p>Animations tab — একটা slide-এর ভেতরে একটা object নিজে থেকে দেখা, move, বা অদৃশ্য করে দেয়। একসাথে না দেখিয়ে একটা একটা করে পয়েন্ট দেখানোর জন্য কাজের।</p>'),
      callout('warning', '<p>Animation বেশি ব্যবহার করাই একজন ছাত্রের presentation-কে অগোছালো দেখানোর সবচেয়ে সাধারণ কারণ। কম ব্যবহার করলে খেয়াল করা যায় না। সব জায়গায় ব্যবহার করলে সেটাই একমাত্র জিনিস যা খেয়াল করা হয়।</p>', 'কম মানে বেশি'),
      h(2, 'Animation Order আর Trigger', 'animation-order-আর-trigger'),
      p('<p><b>Animation Pane</b> (Animations tab → Animation Pane) একটা slide-এর প্রতিটা animation যে ক্রমে চলে সেই ক্রমে নম্বর দিয়ে তালিকাভুক্ত করে — একটা আইটেম drag করে reorder করুন। একটা <b>trigger</b> একটা animation-কে ক্রমানুসারে নিজে থেকে না চালিয়ে একটা নির্দিষ্ট object-এ ক্লিকের জন্য অপেক্ষা করায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'powerpoint-tables-and-charts', sortOrder: n++,
  en: {
    title: 'Tables and Charts in Slides',
    metaTitle: 'PowerPoint Tables and Charts in Slides | Learn Computer Academy',
    metaDescription: "Inserting a table or chart into a slide, and how PowerPoint's chart data connects back to a small Excel-like sheet.",
    blocks: [
      p('<p>Tables and charts in PowerPoint use the same tools as Word and Excel, adapted for a slide.</p>'),
      h(2, 'Tables'),
      p('<p>Insert tab → Table — the same mechanics as inserting a table in Word.</p>'),
      h(2, 'Charts'),
      p('<p>Insert tab → Chart opens a small Excel-like data sheet behind the scenes. Edit the numbers there and the chart on the slide updates automatically.</p>'),
      h(2, 'SmartArt on a Slide'),
      p('<p>The same SmartArt feature from Word works here — Insert tab → SmartArt turns a typed list into a process diagram, cycle, or hierarchy chart automatically, a fast way to visualize a structure without drawing individual shapes.</p>'),
    ],
  },
  bn: {
    title: 'Slide-এ Table আর Chart',
    metaTitle: 'PowerPoint Slide-এ Table আর Chart | Learn Computer Academy',
    metaDescription: 'একটা slide-এ table বা chart insert করা, আর PowerPoint-এর chart ডেটা কীভাবে একটা ছোট Excel-এর মতো sheet-এর সাথে যুক্ত।',
    blocks: [
      p('<p>PowerPoint-এ table আর chart Word আর Excel-এর একই টুল ব্যবহার করে, একটা slide-এর জন্য মানিয়ে নেওয়া।</p>'),
      h(2, 'Table', 'table'),
      p('<p>Insert tab → Table — Word-এ table insert করার একই মেকানিক্স।</p>'),
      h(2, 'Chart', 'chart'),
      p('<p>Insert tab → Chart পেছনে একটা ছোট Excel-এর মতো ডেটা sheet খোলে। সেখানে সংখ্যা edit করলে slide-এর chart স্বয়ংক্রিয়ভাবে আপডেট হয়।</p>'),
      h(2, 'একটা Slide-এ SmartArt', 'একটা-slide-এ-smartart'),
      p('<p>Word-এর একই SmartArt ফিচার এখানেও কাজ করে — Insert tab → SmartArt একটা টাইপ করা list-কে স্বয়ংক্রিয়ভাবে একটা process diagram, cycle, বা hierarchy chart-এ বদলে দেয়, আলাদা shape না এঁকেই একটা গঠন দেখানোর একটা দ্রুত উপায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'powerpoint-presenting', sortOrder: n++,
  en: {
    title: 'Presenting: Slide Show Mode and Presenter Notes',
    metaTitle: 'PowerPoint Presenting — Slide Show Mode and Presenter Notes | Learn Computer Academy',
    metaDescription: 'Starting a slide show, using Presenter View, and the key shortcuts for actually delivering a presentation.',
    blocks: [
      p('<p>Actually delivering the presentation is a separate skill from building it.</p>'),
      h(2, 'Slide Show Mode'),
      p('<p><code>F5</code> starts the show from the first slide; <code>Shift+F5</code> starts from the currently selected slide instead; <code>Esc</code> exits back to the editor.</p>'),
      h(2, 'Presenter View'),
      p('<p>Shows the speaker their current slide, the next slide, and any speaker notes — while the audience, on a second screen or projector, only ever sees the current slide.</p>'),
      table(['Key', 'What it does'], [['F5', 'Start from the first slide'], ['Shift+F5', 'Start from the current slide'], ['Esc', 'Exit slide show'], ['Arrow keys / Space', 'Advance or go back']]),
      h(2, 'Rehearsing and Recording'),
      p('<p>Slide Show tab → <b>Rehearse Timings</b> records how long each slide is shown while practicing, so the show can later advance itself at that same pace. <b>Record Slide Show</b> goes further, capturing narration and slide timing together — useful for a presentation nobody needs to deliver live.</p>'),
    ],
  },
  bn: {
    title: 'Presenting: Slide Show Mode আর Presenter Notes',
    metaTitle: 'PowerPoint Presenting — Slide Show Mode আর Presenter Notes | Learn Computer Academy',
    metaDescription: 'একটা slide show শুরু করা, Presenter View ব্যবহার করা, আর আসলে একটা presentation দেওয়ার key shortcut।',
    blocks: [
      p('<p>সত্যিকারের presentation দেওয়া সেটা বানানো থেকে আলাদা একটা দক্ষতা।</p>'),
      h(2, 'Slide Show Mode', 'slide-show-mode'),
      p('<p><code>F5</code> প্রথম slide থেকে show শুরু করে; <code>Shift+F5</code> এর বদলে বর্তমানে select করা slide থেকে শুরু করে; <code>Esc</code> editor-এ ফিরিয়ে নিয়ে যায়।</p>'),
      h(2, 'Presenter View', 'presenter-view'),
      p('<p>বক্তাকে তার বর্তমান slide, পরের slide, আর speaker notes দেখায় — আর দ্বিতীয় স্ক্রিন বা প্রজেক্টরে দর্শক শুধু বর্তমান slide-টাই দেখে।</p>'),
      table(['Key', 'কী করে'], [['F5', 'প্রথম slide থেকে শুরু করে'], ['Shift+F5', 'বর্তমান slide থেকে শুরু করে'], ['Esc', 'Slide show থেকে বের হয়'], ['Arrow key / Space', 'এগিয়ে যায় বা পিছিয়ে যায়']]),
      h(2, 'Rehearse আর Record করা', 'rehearse-আর-record-করা'),
      p('<p>Slide Show tab → <b>Rehearse Timings</b> অনুশীলনের সময় প্রতিটা slide কতক্ষণ দেখানো হয়েছে তা রেকর্ড করে, যাতে show পরে নিজে থেকেই একই গতিতে এগিয়ে যেতে পারে। <b>Record Slide Show</b> আরও এগিয়ে, narration আর slide timing একসাথে ধরে — এমন একটা presentation-এর জন্য কাজের যা কাউকে সরাসরি উপস্থাপন করতে হবে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'powerpoint-saving-and-exporting', sortOrder: n++,
  en: {
    title: 'Saving and Exporting (PDF, Video)',
    metaTitle: 'PowerPoint Saving and Exporting — PDF, Video | Learn Computer Academy',
    metaDescription: '.pptx vs PDF vs exporting a presentation as video — sharing a finished presentation with people who may not have PowerPoint.',
    blocks: [
      p('<p>Sharing a finished presentation with people who may not have PowerPoint installed is the last step.</p>'),
      table(
        ['Format', 'Use it for'],
        [
          ['.pptx', "PowerPoint's own format — fully editable"],
          ['PDF', 'A fixed copy, one page per slide, always opens even without PowerPoint'],
          ['Video', "File → Export → Create a Video — turns the whole presentation, including any timed animations, into an .mp4 for when nobody needs to interact with it live"],
        ]
      ),
      h(2, 'Reducing File Size'),
      p('<p>A presentation with several full-resolution photos can grow to tens of MB, slow to email or upload. File → Info → <b>Compress Pictures</b> reduces every embedded image to screen resolution in one step, usually shrinking the file dramatically with no visible quality loss on a projector or screen.</p>'),
    ],
  },
  bn: {
    title: 'Save আর Export করা (PDF, Video)',
    metaTitle: 'PowerPoint Save আর Export করা — PDF, Video | Learn Computer Academy',
    metaDescription: '.pptx বনাম PDF বনাম video হিসেবে export — যাদের কাছে PowerPoint নেই তাদের সাথে একটা শেষ presentation শেয়ার করা।',
    blocks: [
      p('<p>যাদের কাছে PowerPoint ইনস্টল নাও থাকতে পারে তাদের সাথে একটা শেষ presentation শেয়ার করা শেষ ধাপ।</p>'),
      table(
        ['Format', 'যেখানে ব্যবহার করবেন'],
        [
          ['.pptx', 'PowerPoint-এর নিজস্ব format — সম্পূর্ণ editable'],
          ['PDF', 'একটা fixed কপি, প্রতি slide এক page, PowerPoint ছাড়াও সবসময় খোলে'],
          ['Video', 'File → Export → Create a Video — যেখানে সরাসরি কারও উপস্থিত থাকার দরকার নেই, সেখানে টাইম করা animation সহ পুরো presentation-কে একটা .mp4-এ বদলে দেয়'],
        ]
      ),
      h(2, 'File Size কমানো', 'file-size-কমানো'),
      p('<p>একাধিক পূর্ণ-resolution ছবিসহ একটা presentation কয়েক দশ MB পর্যন্ত বড় হয়ে যেতে পারে, email বা upload করতে ধীর। File → Info → <b>Compress Pictures</b> এক ধাপে প্রতিটা embedded ছবিকে screen resolution-এ কমিয়ে আনে, সাধারণত কোনো দেখা-যাওয়া মান না কমিয়েই file অনেকটা ছোট করে দেয়।</p>'),
    ],
  },
})

// ═══ CLOSING: FREE & OPEN-SOURCE ALTERNATIVES (1) ═══════════════════════

lessons.push({
  slug: 'free-and-open-source-alternatives', sortOrder: n++,
  en: {
    title: 'Free and Open-Source Alternatives',
    metaTitle: 'Free and Open-Source Alternatives to MS Office | Learn Computer Academy',
    metaDescription: "LibreOffice, OpenOffice, and Google Docs/Sheets/Slides — what maps to Word/Excel/PowerPoint, and why every skill here transfers.",
    blocks: [
      p("<p>MS Office isn't free, and not everyone has a license — knowing the free alternatives, and exactly where they match or differ, is worth ten minutes.</p>"),
      h(2, 'LibreOffice and OpenOffice'),
      p("<p>Free, open-source, and installed on your computer just like MS Office is. <b>Writer</b>, <b>Calc</b>, and <b>Impress</b> correspond directly to Word, Excel, and PowerPoint. Both can open and save .docx/.xlsx/.pptx files, though very complex formatting can shift slightly moving between the two.</p>"),
      img('docs/img/office/free-and-open-source-alternatives-1', 'Isometric illustration of two matching groups of document, spreadsheet, and slide icons facing each other, connected by a double-headed arrow', 1024, 768, 'Different software, the same underlying jobs — a document tool, a spreadsheet tool, a slide tool, in every suite.'),
      h(2, 'Google Docs, Sheets, and Slides'),
      p("<p>Free, run entirely in a web browser, and save automatically and continuously to Google Drive — \"forgot to save\" isn't possible. Multiple people can edit the same file at the same time, which neither MS Office nor LibreOffice do natively.</p>"),
      table(
        ['Microsoft', 'LibreOffice', 'Google'],
        [
          ['Word', 'Writer', 'Docs'],
          ['Excel', 'Calc', 'Sheets'],
          ['PowerPoint', 'Impress', 'Slides'],
        ]
      ),
      h(2, 'Which One Should You Actually Learn?'),
      p("<p>This section teaches MS Office because it's still the most common in offices, colleges, and job listings — but every skill covered here (formatting text, writing formulas, building slides) transfers directly to any of these alternatives. Only the exact menu locations differ. Comfortable in one, comfortable in all three.</p>"),
      h(2, 'When Each One Actually Makes Sense'),
      p("<p>In practice, the choice is often per-task rather than once-and-forever: Google's tools for a document several people need to edit together in real time, MS Office or LibreOffice for offline work or a document with heavy formatting a browser handles less gracefully, and whichever one a school or employer already standardizes on when the file needs to match everyone else's exactly.</p>"),
    ],
  },
  bn: {
    title: 'Free আর Open-Source বিকল্প',
    metaTitle: 'MS Office-এর Free আর Open-Source বিকল্প | Learn Computer Academy',
    metaDescription: 'LibreOffice, OpenOffice, আর Google Docs/Sheets/Slides — Word/Excel/PowerPoint-এর সাথে কী মেলে, আর কেন এখানকার প্রতিটা দক্ষতা কাজে লাগে।',
    blocks: [
      p('<p>MS Office ফ্রি না, আর সবার কাছে একটা license নাও থাকতে পারে — ফ্রি বিকল্পগুলো, আর ঠিক কোথায় সেগুলো মেলে বা আলাদা তা জানা দশ মিনিটের মূল্যবান বিনিয়োগ।</p>'),
      h(2, 'LibreOffice আর OpenOffice', 'libreoffice-আর-openoffice'),
      p('<p>ফ্রি, open-source, আর MS Office-এর মতোই আপনার কম্পিউটারে ইনস্টল করা হয়। <b>Writer</b>, <b>Calc</b>, আর <b>Impress</b> সরাসরি Word, Excel, আর PowerPoint-এর সাথে মেলে। দুটোই .docx/.xlsx/.pptx file খুলতে আর সেভ করতে পারে, যদিও খুব জটিল formatting দুটোর মধ্যে সরালে সামান্য বদলে যেতে পারে।</p>'),
      img('docs/img/office/free-and-open-source-alternatives-1', 'একে অপরের মুখোমুখি document, spreadsheet, আর slide আইকনের দুটো মিলে যাওয়া দলের আইসোমেট্রিক ছবি, মাঝে একটা দুই-মাথার তীরচিহ্ন দিয়ে যুক্ত', 1024, 768, 'সফটওয়্যার আলাদা, কিন্তু আসল কাজ একই — প্রতিটা suite-এ একটা document টুল, একটা spreadsheet টুল, একটা slide টুল।'),
      h(2, 'Google Docs, Sheets, আর Slides', 'google-docs-sheets-আর-slides'),
      p('<p>ফ্রি, পুরোপুরি একটা web browser-এ চলে, আর নিজে থেকেই ক্রমাগত Google Drive-এ সেভ হয় — "সেভ করতে ভুলে যাওয়া" সম্ভব না। একই সময়ে একই file-এ একাধিক মানুষ edit করতে পারে, যা MS Office বা LibreOffice কেউই সরাসরি করতে পারে না।</p>'),
      table(
        ['Microsoft', 'LibreOffice', 'Google'],
        [
          ['Word', 'Writer', 'Docs'],
          ['Excel', 'Calc', 'Sheets'],
          ['PowerPoint', 'Impress', 'Slides'],
        ]
      ),
      h(2, 'আসলে কোনটা শেখা উচিত?', 'আসলে-কোনটা-শেখা-উচিত'),
      p('<p>এই section MS Office শেখায় কারণ অফিস, কলেজ, আর চাকরির বিজ্ঞাপনে এখনো এটাই সবচেয়ে বেশি দেখা যায় — কিন্তু এখানে যা শেখানো হয়েছে তার প্রতিটা দক্ষতা (text format করা, formula লেখা, slide বানানো) এই বিকল্পগুলোর যেকোনোটাতেই সরাসরি কাজে লাগে। শুধু মেনুর ঠিক জায়গাটা আলাদা। একটাতে স্বচ্ছন্দ মানে তিনটাতেই স্বচ্ছন্দ।</p>'),
      h(2, 'আসলে কখন কোনটা কাজে লাগে', 'আসলে-কখন-কোনটা-কাজে-লাগে'),
      p('<p>বাস্তবে, বেছে নেওয়াটা প্রায়ই একবারের-জন্য-সবসময় না, কাজ-অনুযায়ী হয়: একসাথে কয়েকজনকে রিয়েল-টাইমে edit করতে হবে এমন document-এর জন্য Google-এর টুল, অফলাইন কাজ বা ভারী formatting-এর document-এর জন্য MS Office বা LibreOffice (যা একটা browser ততটা মসৃণভাবে সামলাতে পারে না), আর file-টা সবার সাথে হুবহু মিলতে হলে স্কুল বা employer যেটা আগে থেকেই standard করে রেখেছে সেটা।</p>'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'office').single()
  if (catErr || !category) {
    console.error('Category "office" not found — run scripts/create-office-category.mjs first.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] office/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] office/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `office/${lesson.slug}`
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
