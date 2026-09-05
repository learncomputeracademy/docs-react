#!/usr/bin/env node
// New "Figma" category (created by scripts/create-figma-category.mjs) — 9
// lessons covering interface, shapes/pen tool, type, Auto Layout, components/
// variants, color & effect styles, and prototyping/handoff.
//
// Images: real screenshots of the actual Figma app (via claude-in-chrome),
// captured from a genuine connected Figma account and a real reference file
// ("LCA Figma Course — Reference File") built for this course — not AI
// mockups. Since real screenshots don't cost Magnific credits, more of them
// are used per lesson than the site's usual restrained ~1-per-lesson budget
// for AI-generated images (site owner, 2026-08-17).
//
// UI-specific terms (Frame, Auto Layout, Component, Variant, Boolean, Pen
// tool, Effect, Style, …) stay in English in the Bengali translations —
// that's literally what the English-language Figma UI shows on screen,
// matching the established convention from the Office Skills run.
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-figma-content.mjs [--dry-run]

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
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }
function img(publicId, alt, width, height, caption) { return { id: nanoid(12), type: 'image', publicId, alt, width, height, caption } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// ── Lessons ──────────────────────────────────────────────────────────────

const lessons = []
let n = 1

lessons.push({
  slug: 'figma-introduction', sortOrder: n++,
  en: {
    title: 'Introduction to Figma',
    metaTitle: 'Introduction to Figma | Learn Computer Academy',
    metaDescription: 'What Figma is, why it replaced Photoshop for interface design, and how it differs from a raster editor like Paint or Photoshop.',
    blocks: [
      p('<p><b>Figma</b> is a browser-based design tool for building user interfaces — app screens, websites, icons, and the reusable design systems behind them. It runs entirely in a browser tab (or a desktop app that wraps the same thing), so a file opens instantly for anyone with the link, with no software to install and no version-mismatch problems.</p>'),
      h(2, 'Why Interface Designers Moved to Figma'),
      p('<p>Before Figma, interface design mostly happened in Photoshop — a tool built for editing photographs, repurposed for screens. Figma was built from scratch for screens: real-time multiplayer editing (everyone sees the same file update live, like a Google Doc), components that update everywhere at once when you fix one, and layouts that resize themselves instead of needing every element nudged by hand.</p>'),
      h(2, 'Vector, Not Pixels'),
      p('<p>Photoshop and Paint are <b>raster</b> editors — an image is a grid of colored pixels, and zooming in far enough eventually shows visible squares. Figma is a <b>vector</b> editor — a shape is stored as math (points, curves, fills), so it stays perfectly sharp at any zoom level or screen size, which is exactly what interface design needs: the same button has to look crisp on a phone and a 4K monitor.</p>'),
      callout('note', '<p>This distinction matters for one very practical reason later in this course: text and vector shapes in Figma are never blurry no matter how far you zoom in — there\'s no such thing as a low-resolution vector.</p>', 'Vector vs. raster'),
      h(2, 'What This Course Uses'),
      p('<p>Every screenshot in this course is a real capture from an actual Figma file built for this course — not an AI-generated approximation of the interface. What you see here is what you\'ll see when you open Figma yourself.</p>'),
      h(2, 'Figma\'s Free Plan'),
      p('<p>Figma has a genuinely usable free "Starter" tier — unlimited personal files, the full design toolset, and enough to build everything in this course. Paid tiers add things like unlimited team projects and higher API/automation limits, which don\'t matter for learning.</p>'),
    ],
  },
  bn: {
    title: 'Figma পরিচিতি',
    metaTitle: 'Figma পরিচিতি | Learn Computer Academy',
    metaDescription: 'Figma আসলে কী, কেন এটা interface design-এর জন্য Photoshop-কে replace করে দিয়েছে, আর এটা Paint বা Photoshop-এর মতো raster editor থেকে কীভাবে আলাদা।',
    blocks: [
      p('<p><b>Figma</b> হলো একটা browser-based design টুল, যা দিয়ে user interface বানানো হয় — app screen, website, icon, আর এগুলোর পেছনের reusable design system। এটা পুরোপুরি একটা browser tab-এ চলে (অথবা একই জিনিস wrap করা একটা desktop app-এ), তাই লিংক থাকলে যে কেউ সাথে সাথে file খুলতে পারে — কোনো software install করার দরকার নেই, আর কোনো version-mismatch সমস্যা নেই।</p>'),
      h(2, 'কেন Interface Designer-রা Figma-তে সরে এসেছে', 'কেন-interface-designer-রা-figma-তে-সরে-এসেছে'),
      p('<p>Figma আসার আগে, interface design বেশিরভাগ Photoshop-এ হতো — যা ছবি edit করার জন্য বানানো একটা টুল, স্ক্রিনের জন্য পুনরায় ব্যবহার করা হতো। Figma প্রথম থেকেই স্ক্রিনের জন্য বানানো — real-time multiplayer editing (সবাই একসাথে একই file-এর update live দেখে, Google Doc-এর মতো), component যা একবার ঠিক করলেই সব জায়গায় একসাথে update হয়, আর layout যা নিজে থেকেই resize হয়, প্রতিটা element হাত দিয়ে সরানোর দরকার হয় না।</p>'),
      h(2, 'Vector, Pixel না', 'vector-pixel-না'),
      p('<p>Photoshop আর Paint হলো <b>raster</b> editor — একটা image হলো রঙিন pixel-এর একটা grid, আর যথেষ্ট zoom করলে শেষে দৃশ্যমান square দেখা যায়। Figma হলো একটা <b>vector</b> editor — একটা shape math হিসেবে store হয় (point, curve, fill), তাই যেকোনো zoom level বা screen size-এ এটা একদম sharp থাকে — আর এটাই interface design-এর জন্য দরকার: একই button-কে ফোনে আর 4K মনিটরে সমান sharp দেখাতে হয়।</p>'),
      callout('note', '<p>এই পার্থক্যটা এই কোর্সের পরে খুব practical একটা কারণে গুরুত্বপূর্ণ: Figma-তে text আর vector shape যতই zoom করুন না কেন কখনো blurry হয় না — low-resolution vector বলে কিছু নেই।</p>', 'Vector বনাম raster'),
      h(2, 'এই কোর্স যা ব্যবহার করে', 'এই-কোর্স-যা-ব্যবহার-করে'),
      p('<p>এই কোর্সের প্রতিটা screenshot এই কোর্সের জন্য বানানো একটা আসল Figma file থেকে সরাসরি নেওয়া — interface-এর কোনো AI-generated আনুমানিক ছবি না। এখানে যা দেখছেন, নিজে Figma খুললেও ঠিক তাই দেখবেন।</p>'),
      h(2, 'Figma-র Free Plan', 'figma-র-free-plan'),
      p('<p>Figma-র সত্যিকারের ব্যবহারযোগ্য একটা free "Starter" tier আছে — unlimited personal file, পুরো design toolset, আর এই কোর্সের সবকিছু বানানোর জন্য যথেষ্ট। Paid tier-এ unlimited team project আর বেশি API/automation limit-এর মতো জিনিস যোগ হয়, যা শেখার জন্য গুরুত্বপূর্ণ না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'figma-interface-tour', sortOrder: n++,
  en: {
    title: 'The Figma Interface',
    metaTitle: 'The Figma Interface | Learn Computer Academy',
    metaDescription: 'A tour of Figma\'s workspace — the toolbar, the layers panel, the design panel, and the pages/files structure — using real screenshots.',
    blocks: [
      p('<p>Every Figma file opens into the same three-part layout: a <b>Layers panel</b> on the left, an infinite <b>canvas</b> in the middle, and a <b>Design panel</b> on the right. Learning where things live here makes every later lesson faster.</p>'),
      img('docs/img/figma/interface-tour-overview', 'The full Figma workspace: left sidebar showing Pages and Layers, center canvas with design content, right Design panel, and the floating toolbar at the bottom center', 1568, 717, 'The full workspace — left sidebar, canvas, right panel, and the floating toolbar at the bottom.'),
      h(2, 'The Left Sidebar — Pages and Layers'),
      p('<p>A Figma <b>file</b> can hold multiple <b>pages</b> (shown at the top of the sidebar) — a common way to split a project, e.g. one page per app section. Below that, the <b>Layers</b> panel lists every object on the current page, nested to match how things are grouped, sectioned, or framed.</p>'),
      img('docs/img/figma/interface-tour-layers-panel', 'The Pages list and Layers panel, showing three pages and a nested layer tree with section, component, and shape icons', 298, 661, 'Pages at top, the current page\'s full layer tree below it.'),
      h(2, 'The Floating Toolbar'),
      p('<p>At the bottom of the screen, the toolbar holds the tools you\'ll use constantly: the arrow (move/select), the frame tool, shape tools (rectangle, ellipse, etc.), the pen tool, and the text tool. Most have a keyboard shortcut — <code>V</code> for the move tool, <code>R</code> for rectangle, <code>T</code> for text — worth learning early since reaching for the mouse every time slows real work down.</p>'),
      img('docs/img/figma/interface-tour-toolbar', 'The floating toolbar showing move, frame, shape, pen, and text tool icons', 519, 43),
      h(2, 'The Design Panel'),
      p('<p>Select anything and the right-hand Design panel fills in with everything about it — position, size, corner radius, fill color, stroke, and effects. This panel is <i>contextual</i>: it only shows fields relevant to whatever\'s currently selected, so a text layer shows font controls that a rectangle never will.</p>'),
      img('docs/img/figma/interface-tour-design-panel', 'The Design panel for a selected rectangle, showing Position, Layout, Appearance, and Fill sections with real values', 229, 717, 'Select an object and its properties appear here — position, size, corner radius, fill.'),
      h(2, 'Design vs. Prototype Tabs'),
      p('<p>The Design panel has a sibling tab, <b>Prototype</b>, at the very top — same panel location, completely different purpose. Design is for building; Prototype is for wiring screens together into a clickable flow. Both are covered in this course, Prototype in the last lesson.</p>'),
    ],
  },
  bn: {
    title: 'Figma-র Interface',
    metaTitle: 'Figma-র Interface | Learn Computer Academy',
    metaDescription: 'Figma-র workspace-এর একটা ট্যুর — toolbar, layers panel, design panel, আর pages/files গঠন — আসল screenshot দিয়ে।',
    blocks: [
      p('<p>প্রতিটা Figma file একই তিন-অংশের layout-এ খোলে: বামে একটা <b>Layers panel</b>, মাঝে একটা অসীম <b>canvas</b>, আর ডানে একটা <b>Design panel</b>। এখানে কী কোথায় থাকে সেটা শিখে নিলে পরের প্রতিটা lesson দ্রুত হয়ে যাবে।</p>'),
      img('docs/img/figma/interface-tour-overview', 'সম্পূর্ণ Figma workspace: বামে Pages আর Layers দেখানো sidebar, মাঝে design content সহ canvas, ডানে Design panel, আর নিচে মাঝে floating toolbar', 1568, 717, 'সম্পূর্ণ workspace — বাম sidebar, canvas, ডান panel, আর নিচের floating toolbar।'),
      h(2, 'বাম Sidebar — Pages আর Layers', 'বাম-sidebar-pages-আর-layers'),
      p('<p>একটা Figma <b>file</b>-এ একাধিক <b>page</b> থাকতে পারে (sidebar-এর উপরে দেখানো) — প্রজেক্ট ভাগ করার একটা সাধারণ উপায়, যেমন app-এর প্রতিটা section-এর জন্য একটা করে page। নিচে, <b>Layers</b> panel বর্তমান page-এর প্রতিটা object তালিকাভুক্ত করে, সেগুলো যেভাবে group, section, বা frame করা সেভাবে nested।</p>'),
      img('docs/img/figma/interface-tour-layers-panel', 'তিনটা page আর section, component, shape icon সহ একটা nested layer tree দেখানো Pages লিস্ট আর Layers panel', 298, 661, 'উপরে Pages, নিচে বর্তমান page-এর পুরো layer tree।'),
      h(2, 'Floating Toolbar', 'floating-toolbar'),
      p('<p>স্ক্রিনের নিচে, toolbar-এ আপনি বারবার ব্যবহার করবেন এমন টুল থাকে: arrow (move/select), frame টুল, shape টুল (rectangle, ellipse, ইত্যাদি), pen টুল, আর text টুল। বেশিরভাগেরই একটা keyboard shortcut আছে — move টুলের জন্য <code>V</code>, rectangle-এর জন্য <code>R</code>, text-এর জন্য <code>T</code> — শুরুতেই শিখে নেওয়া ভালো, কারণ প্রতিবার mouse-এর দিকে হাত বাড়ানো আসল কাজকে ধীর করে দেয়।</p>'),
      img('docs/img/figma/interface-tour-toolbar', 'Move, frame, shape, pen, আর text টুল icon দেখানো floating toolbar', 519, 43),
      h(2, 'Design Panel', 'design-panel'),
      p('<p>যেকোনো কিছু select করুন, আর ডানের Design panel তার সম্পর্কে সবকিছু দিয়ে ভরে যায় — position, size, corner radius, fill color, stroke, আর effect। এই panel <i>contextual</i>: বর্তমানে যা select করা তার সাথে সম্পর্কিত field-ই শুধু দেখায়, তাই একটা text layer এমন font control দেখাবে যা একটা rectangle কখনো দেখাবে না।</p>'),
      img('docs/img/figma/interface-tour-design-panel', 'Select করা একটা rectangle-এর Design panel, আসল value সহ Position, Layout, Appearance, আর Fill section দেখাচ্ছে', 229, 717, 'একটা object select করুন আর তার property এখানে দেখা যায় — position, size, corner radius, fill।'),
      h(2, 'Design বনাম Prototype ট্যাব', 'design-বনাম-prototype-ট্যাব'),
      p('<p>Design panel-এর একদম উপরে একটা sibling ট্যাব আছে, <b>Prototype</b> — একই panel-এর জায়গা, একদম আলাদা উদ্দেশ্য। Design হলো বানানোর জন্য; Prototype হলো screen-গুলোকে একটা click-করা-যায় এমন flow-এ জোড়া লাগানোর জন্য। এই কোর্সে দুটোই কভার করা হয়েছে, Prototype শেষ lesson-এ।</p>'),
    ],
  },
})

lessons.push({
  slug: 'frames-and-presets', sortOrder: n++,
  en: {
    title: 'Frames and Device Presets',
    metaTitle: 'Frames and Device Presets | Learn Computer Academy',
    metaDescription: 'What a Frame is in Figma, why every design starts inside one, and how device presets set the right canvas size instantly.',
    blocks: [
      p('<p>A <b>Frame</b> is Figma\'s container for a screen — a phone screen, a webpage, a card, anything with a defined width and height. Almost everything you design in Figma starts by drawing a Frame first, then placing content inside it.</p>'),
      img('docs/img/figma/frames-and-presets', 'Two Frames side by side: a 1440×900 desktop preset with a header and a three-card row, and a 375×812 mobile preset with a stacked header and list rows', 1568, 669, 'A desktop Frame (1440×900) and a mobile Frame (375×812), both started from Figma\'s built-in presets.'),
      h(2, 'Drawing a Frame'),
      p('<p>Press <code>F</code> (or click the frame icon in the toolbar) and drag on the canvas. A right-panel <b>Presets</b> list appears with common sizes ready-made — "Desktop" at 1440×900, "iPhone 16" at the exact pixel size Apple ships, and dozens more — so there\'s no guessing what size a real device screen actually is.</p>'),
      h(2, 'Why Frames, Not Just Rectangles'),
      p('<p>A Frame behaves differently from a plain rectangle in one important way: content placed inside a Frame is <i>clipped</i> to its edges by default, and a Frame can hold Auto Layout (covered later in this course) to arrange its children automatically. A rectangle is just a shape; a Frame is a layout container.</p>'),
      h(2, 'Nesting Frames'),
      p('<p>Frames can contain other Frames — a card Frame inside a page Frame inside the overall screen Frame. This nesting is exactly how real interfaces are structured, and it\'s why the Layers panel from the previous lesson shows indentation: each level of indent is one more Frame or group deep.</p>'),
      h(2, 'Renaming and Organizing'),
      p('<p>Double-click a layer\'s name in the Layers panel to rename it — "Frame 47" tells you nothing three lessons later, but "Login Screen" does. Naming things as you go, not after, is the single habit that keeps a growing file navigable.</p>'),
    ],
  },
  bn: {
    title: 'Frame আর Device Preset',
    metaTitle: 'Frame আর Device Preset | Learn Computer Academy',
    metaDescription: 'Figma-তে একটা Frame আসলে কী, কেন প্রতিটা design একটার ভেতর থেকে শুরু হয়, আর কীভাবে device preset সাথে সাথে সঠিক canvas size সেট করে।',
    blocks: [
      p('<p>একটা <b>Frame</b> হলো Figma-র একটা screen-এর জন্য container — একটা ফোনের screen, একটা webpage, একটা card, নির্দিষ্ট width আর height আছে এমন যেকোনো কিছু। Figma-তে আপনি যা design করেন তার প্রায় সবকিছু একটা Frame এঁকে শুরু হয়, তারপর তার ভেতরে content বসানো হয়।</p>'),
      img('docs/img/figma/frames-and-presets', 'পাশাপাশি দুটো Frame: একটা header আর তিন-card row সহ 1440×900 desktop preset, আর একটা stacked header আর list row সহ 375×812 mobile preset', 1568, 669, 'একটা desktop Frame (1440×900) আর একটা mobile Frame (375×812), দুটোই Figma-র বিল্ট-ইন preset থেকে শুরু।'),
      h(2, 'একটা Frame আঁকা', 'একটা-frame-আঁকা'),
      p('<p><code>F</code> চাপুন (অথবা toolbar-এ frame icon-এ ক্লিক করুন) আর canvas-এ drag করুন। ডান panel-এ একটা <b>Presets</b> লিস্ট দেখা যায়, তৈরি করা common size সহ — "Desktop" 1440×900-এ, "iPhone 16" Apple যে ঠিক pixel size পাঠায় সেটাতে, আর আরো অনেক — তাই একটা আসল device screen আসলে কত size তা আন্দাজ করার দরকার নেই।</p>'),
      h(2, 'কেন Frame, শুধু Rectangle না', 'কেন-frame-শুধু-rectangle-না'),
      p('<p>একটা Frame একটা সাধারণ rectangle থেকে একটা গুরুত্বপূর্ণ দিক দিয়ে আলাদা আচরণ করে: একটা Frame-এর ভেতরে বসানো content default-এ তার প্রান্তে <i>clip</i> হয়ে যায়, আর একটা Frame Auto Layout ধারণ করতে পারে (এই কোর্সে পরে কভার করা হয়েছে) যা তার child-গুলোকে নিজে থেকে সাজায়। একটা rectangle শুধু একটা shape; একটা Frame একটা layout container।</p>'),
      h(2, 'Frame Nest করা', 'frame-nest-করা'),
      p('<p>Frame অন্য Frame ধারণ করতে পারে — সম্পূর্ণ screen Frame-এর ভেতরে একটা page Frame-এর ভেতরে একটা card Frame। এই nesting ঠিক যেভাবে আসল interface গঠন করা হয়, আর এই কারণেই আগের lesson-এর Layers panel indentation দেখায়: প্রতিটা indent level মানে এক Frame বা group বেশি গভীর।</p>'),
      h(2, 'নাম দেওয়া আর গোছানো', 'নাম-দেওয়া-আর-গোছানো'),
      p('<p>একটা layer-এর নাম rename করতে Layers panel-এ তার নামে double-click করুন — "Frame 47" তিন lesson পরে কিছুই বলে না, কিন্তু "Login Screen" বলে। জিনিসগুলোর নাম কাজ করতে করতে দেওয়া, পরে না, একটাই অভ্যাস যা একটা বাড়তে থাকা file-কে চলাচলযোগ্য রাখে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'basic-shapes-and-boolean-operations', sortOrder: n++,
  en: {
    title: 'Shapes, Boolean Operations, and the Pen Tool',
    metaTitle: 'Shapes, Boolean Operations, and the Pen Tool | Learn Computer Academy',
    metaDescription: 'Figma\'s basic shape tools, combining shapes with Boolean operations, and drawing freeform vector paths with the Pen tool.',
    blocks: [
      p('<p>Every complex icon or illustration in Figma is ultimately built from a small set of basic shapes, combined and reshaped. This lesson covers the shape tools themselves, then two ways to go beyond them: Boolean operations and the Pen tool.</p>'),
      img('docs/img/figma/basic-shapes-boolean-ops', 'Five basic shape tools — Rectangle, Ellipse, Polygon, Star, Line — each shown as a colored example, and below them four Boolean operation results (Union, Subtract, Intersect, Exclude) plus a pink heart drawn with the Pen tool', 1568, 669, 'The five basic shape tools, four Boolean operations combining a rectangle and ellipse, and a freeform Pen tool path.'),
      h(2, 'The Five Basic Shapes'),
      table(['Tool', 'Shortcut', 'Use'], [
        ['Rectangle', 'R', 'Cards, buttons, backgrounds, images'],
        ['Ellipse', 'O', 'Avatars, dots, circular buttons'],
        ['Polygon', '—', 'Hexagons, triangles, any straight-sided shape'],
        ['Star', '—', 'Ratings, badges, decorative marks'],
        ['Line', 'L', 'Dividers, underlines, connecting strokes'],
      ]),
      p('<p>Every shape shares the same right-panel controls once drawn — fill color, stroke, corner radius, opacity — covered in the interface tour lesson.</p>'),
      h(2, 'Boolean Operations'),
      p('<p>Select two overlapping shapes and combine them with one of four Boolean operations, found in the right-click menu or the toolbar\'s shape-tools dropdown:</p>'),
      table(['Operation', 'Result'], [
        ['Union', 'Merges both shapes into one outline'],
        ['Subtract', 'Cuts the top shape out of the bottom one'],
        ['Intersect', 'Keeps only the overlapping area'],
        ['Exclude', 'Keeps everything except the overlapping area'],
      ]),
      p('<p>This is how a lot of custom icons get built — a rounded rectangle with a circle subtracted out of a corner, for example — without ever touching the Pen tool.</p>'),
      h(2, 'The Pen Tool'),
      p('<p>For a shape that doesn\'t reduce to a combination of basic shapes — a speech bubble, a custom icon, a heart — the <b>Pen tool</b> (<code>P</code>) draws freeform paths by clicking to place straight-line points, or clicking and dragging to place curved points. It\'s the same tool concept as Illustrator\'s or Photoshop\'s pen tool, and it takes practice — most designers start with Boolean operations and only reach for the Pen tool when shapes genuinely can\'t get there.</p>'),
      callout('tip', '<p>Hold <code>Shift</code> while drawing with the Pen tool to constrain new points to 45° angles — the fastest way to draw clean straight lines.</p>', 'A quick tip'),
    ],
  },
  bn: {
    title: 'Shape, Boolean Operation, আর Pen Tool',
    metaTitle: 'Shape, Boolean Operation, আর Pen Tool | Learn Computer Academy',
    metaDescription: 'Figma-র basic shape টুল, Boolean operation দিয়ে shape combine করা, আর Pen টুল দিয়ে freeform vector path আঁকা।',
    blocks: [
      p('<p>Figma-র প্রতিটা জটিল icon বা illustration শেষ পর্যন্ত অল্প কিছু basic shape থেকে বানানো, যা combine আর reshape করা হয়েছে। এই lesson shape টুলগুলো নিজে কভার করে, তারপর সেগুলোর বাইরে যাওয়ার দুটো উপায়: Boolean operation আর Pen টুল।</p>'),
      img('docs/img/figma/basic-shapes-boolean-ops', 'পাঁচটা basic shape টুল — Rectangle, Ellipse, Polygon, Star, Line — প্রতিটা একটা রঙিন উদাহরণ হিসেবে দেখানো, আর তাদের নিচে চারটা Boolean operation-এর ফলাফল (Union, Subtract, Intersect, Exclude) আর Pen টুল দিয়ে আঁকা একটা গোলাপি হৃদয়', 1568, 669, 'পাঁচটা basic shape টুল, একটা rectangle আর ellipse combine করা চারটা Boolean operation, আর একটা freeform Pen টুল path।'),
      h(2, 'পাঁচটা Basic Shape', 'পাঁচটা-basic-shape'),
      table(['টুল', 'Shortcut', 'ব্যবহার'], [
        ['Rectangle', 'R', 'Card, button, background, image'],
        ['Ellipse', 'O', 'Avatar, dot, গোলাকার button'],
        ['Polygon', '—', 'Hexagon, triangle, সোজা-পাশের যেকোনো shape'],
        ['Star', '—', 'Rating, badge, decorative চিহ্ন'],
        ['Line', 'L', 'Divider, underline, সংযোগকারী stroke'],
      ]),
      p('<p>আঁকার পর প্রতিটা shape একই ডান-panel control শেয়ার করে — fill color, stroke, corner radius, opacity — interface tour lesson-এ কভার করা হয়েছে।</p>'),
      h(2, 'Boolean Operation', 'boolean-operation'),
      p('<p>দুটো overlap হওয়া shape select করুন আর চারটা Boolean operation-এর একটা দিয়ে combine করুন, right-click মেনু বা toolbar-এর shape-tools dropdown-এ পাওয়া যায়:</p>'),
      table(['Operation', 'ফলাফল'], [
        ['Union', 'দুটো shape-কে একটা outline-এ মিশিয়ে দেয়'],
        ['Subtract', 'উপরের shape-টা নিচেরটা থেকে কেটে ফেলে'],
        ['Intersect', 'শুধু overlap হওয়া অংশটা রাখে'],
        ['Exclude', 'overlap হওয়া অংশ বাদে বাকি সব রাখে'],
      ]),
      p('<p>এভাবেই অনেক custom icon বানানো হয় — যেমন একটা কোণ থেকে একটা circle subtract করে একটা rounded rectangle — Pen টুল স্পর্শ না করেই।</p>'),
      h(2, 'Pen Tool', 'pen-tool'),
      p('<p>যে shape basic shape-এর কোনো combination-এ কমানো যায় না — একটা speech bubble, একটা custom icon, একটা হৃদয় — তার জন্য <b>Pen টুল</b> (<code>P</code>) সোজা-লাইনের point বসাতে ক্লিক করে, বা বাঁকা point বসাতে ক্লিক করে drag করে freeform path আঁকে। এটা Illustrator বা Photoshop-এর pen টুলের মতোই একই টুল ধারণা, আর এতে অনুশীলন লাগে — বেশিরভাগ designer Boolean operation দিয়ে শুরু করে আর Pen টুলের কাছে তখনই যায় যখন shape সত্যিই সেভাবে হয় না।</p>'),
      callout('tip', '<p>Pen টুল দিয়ে আঁকার সময় <code>Shift</code> চেপে রাখুন নতুন point-কে 45° কোণে সীমাবদ্ধ রাখতে — পরিষ্কার সোজা লাইন আঁকার সবচেয়ে দ্রুত উপায়।</p>', 'একটা দ্রুত টিপ'),
    ],
  },
})

lessons.push({
  slug: 'text-and-type-scale', sortOrder: n++,
  en: {
    title: 'Text and a Type Scale',
    metaTitle: 'Text and a Type Scale | Learn Computer Academy',
    metaDescription: 'Adding and styling text in Figma, and why a consistent type scale of a handful of sizes beats picking a font size by eye every time.',
    blocks: [
      p('<p>Press <code>T</code> and click anywhere on the canvas to place a text layer — type, then click elsewhere or press <code>Escape</code> to finish editing. Text in Figma is a full vector object, so it stays sharp at any zoom and can have its own fill, stroke, and effects like any other layer.</p>'),
      h(2, 'Font, Size, and Weight'),
      p('<p>With a text layer selected, the Design panel\'s Typography section controls the font family, weight (Regular, Medium, Bold, and so on — each weight is a separate installed font file), size, line height, and letter spacing. Figma ships with a large built-in font library, and any font already installed on your computer is also available.</p>'),
      h(2, 'Why a Type Scale'),
      p('<p>Picking a font size freehand for every heading and paragraph leads to a page with a dozen slightly different sizes that don\'t feel related. A <b>type scale</b> is a small, fixed set of sizes — reused everywhere — that keeps a whole design feeling like one coherent system rather than a patchwork.</p>'),
      img('docs/img/figma/type-scale', 'A five-level type scale example: H1 at 32px, H2 at 24px, H3 at 18px, Body at 14px, and Caption at 11px, each shown with the same sample text "Design in Figma" and its size label', 1568, 669, 'A simple five-level type scale — five sizes reused consistently instead of an ad-hoc size per heading.'),
      h(2, 'A Simple Starting Scale'),
      table(['Level', 'Size', 'Typical use'], [
        ['H1', '32px', 'Page or screen title'],
        ['H2', '24px', 'Section heading'],
        ['H3', '18px', 'Sub-heading, card title'],
        ['Body', '14px', 'Paragraph and general UI text'],
        ['Caption', '11px', 'Timestamps, helper text, fine print'],
      ]),
      p('<p>This is a starting point, not a rule — real design systems tune these numbers — but picking five sizes upfront and sticking to them beats improvising a new size every time.</p>'),
    ],
  },
  bn: {
    title: 'Text আর একটা Type Scale',
    metaTitle: 'Text আর একটা Type Scale | Learn Computer Academy',
    metaDescription: 'Figma-তে text যোগ করা আর style করা, আর কেন কয়েকটা size-এর একটা consistent type scale প্রতিবার চোখ দিয়ে font size বেছে নেওয়ার চেয়ে ভালো।',
    blocks: [
      p('<p><code>T</code> চাপুন আর canvas-এর যেকোনো জায়গায় ক্লিক করুন একটা text layer বসাতে — টাইপ করুন, তারপর অন্য কোথাও ক্লিক করুন বা <code>Escape</code> চাপুন edit শেষ করতে। Figma-তে text একটা পূর্ণ vector object, তাই যেকোনো zoom-এ এটা sharp থাকে আর অন্য যেকোনো layer-এর মতো তারও নিজস্ব fill, stroke, আর effect থাকতে পারে।</p>'),
      h(2, 'Font, Size, আর Weight', 'font-size-আর-weight'),
      p('<p>একটা text layer select করা থাকলে, Design panel-এর Typography section font family, weight (Regular, Medium, Bold, ইত্যাদি — প্রতিটা weight একটা আলাদা install করা font file), size, line height, আর letter spacing নিয়ন্ত্রণ করে। Figma-তে একটা বড় বিল্ট-ইন font library আছে, আর আপনার কম্পিউটারে আগে থেকে install করা যেকোনো font-ও পাওয়া যায়।</p>'),
      h(2, 'কেন একটা Type Scale', 'কেন-একটা-type-scale'),
      p('<p>প্রতিটা heading আর paragraph-এর জন্য হাতে font size বেছে নিলে একটা page-এ ডজনখানেক সামান্য আলাদা size হয়ে যায় যা একে অপরের সাথে সম্পর্কিত মনে হয় না। একটা <b>type scale</b> হলো size-এর একটা ছোট, স্থির সেট — সব জায়গায় পুনরায় ব্যবহৃত — যা পুরো design-কে একটা patchwork-এর বদলে একটা সুসংগত system-এর মতো অনুভব করায়।</p>'),
      img('docs/img/figma/type-scale', 'পাঁচ-স্তরের একটা type scale উদাহরণ: 32px-এ H1, 24px-এ H2, 18px-এ H3, 14px-এ Body, আর 11px-এ Caption, প্রতিটা একই নমুনা text "Design in Figma" আর তার size label সহ দেখানো', 1568, 669, 'একটা সাধারণ পাঁচ-স্তরের type scale — heading-এ যাচ্ছেতাই size-এর বদলে সব জায়গায় পুনরায় ব্যবহৃত পাঁচটা size।'),
      h(2, 'একটা সাধারণ শুরুর Scale', 'একটা-সাধারণ-শুরুর-scale'),
      table(['স্তর', 'Size', 'সাধারণ ব্যবহার'], [
        ['H1', '32px', 'Page বা screen-এর title'],
        ['H2', '24px', 'Section heading'],
        ['H3', '18px', 'Sub-heading, card title'],
        ['Body', '14px', 'Paragraph আর সাধারণ UI text'],
        ['Caption', '11px', 'Timestamp, helper text, fine print'],
      ]),
      p('<p>এটা একটা শুরুর বিন্দু, নিয়ম না — আসল design system এই সংখ্যাগুলো টিউন করে — কিন্তু শুরুতেই পাঁচটা size বেছে নিয়ে সেগুলোতে টিকে থাকা প্রতিবার একটা নতুন size বানিয়ে নেওয়ার চেয়ে ভালো।</p>'),
    ],
  },
})

lessons.push({
  slug: 'auto-layout', sortOrder: n++,
  en: {
    title: 'Auto Layout',
    metaTitle: 'Auto Layout | Learn Computer Academy',
    metaDescription: 'What Auto Layout is, how it turns a Frame into a self-arranging row or column, and why it\'s the single most important Figma feature for real UI work.',
    blocks: [
      p('<p><b>Auto Layout</b> turns an ordinary Frame into one that arranges its own children — spacing them automatically, growing or shrinking to fit their content, and reflowing everything the moment anything inside changes. It\'s the closest thing Figma has to writing actual CSS flexbox, without writing any code.</p>'),
      img('docs/img/figma/auto-layout', 'A Frame with Auto Layout enabled containing three buttons — Cancel, Save changes (highlighted orange), and Delete — evenly spaced in a row with consistent padding', 1568, 669, 'A horizontal Auto Layout frame holding three buttons — resize any button and the row reflows on its own.'),
      h(2, 'Turning It On'),
      p('<p>Select one or more layers and press <code>Shift+A</code>, or click the Auto Layout icon in the Design panel. Figma wraps the selection in a new Frame with Auto Layout already active, arranging the children in a row by default.</p>'),
      h(2, 'The Controls'),
      table(['Control', 'What it does'], [
        ['Direction', 'Horizontal (row) or vertical (column) arrangement'],
        ['Spacing', 'The gap between each child element'],
        ['Padding', 'Space between the children and the frame\'s own edge'],
        ['Resizing', '"Hug contents" shrinks the frame to fit; "Fill container" grows to fill its parent'],
      ]),
      h(2, 'Why It Matters'),
      p('<p>Before Auto Layout, adding a fourth button to a row meant manually recalculating and moving every element after it. With Auto Layout, dropping in a new child — or deleting one — reflows everything else instantly, in both spacing and frame size. This is also what makes a design closely predict what a developer\'s actual flexbox/grid code will look like, which shortens the design-to-code handoff covered in the last lesson of this course.</p>'),
      h(2, 'Nested Auto Layout'),
      p('<p>An Auto Layout frame can sit inside another Auto Layout frame — a row of buttons (horizontal Auto Layout) inside a card (vertical Auto Layout) inside a page (vertical Auto Layout). Real interfaces are almost always several layers of nested Auto Layout, which is why it\'s worth building the habit early rather than treating it as an advanced feature.</p>'),
    ],
  },
  bn: {
    title: 'Auto Layout',
    metaTitle: 'Auto Layout | Learn Computer Academy',
    metaDescription: 'Auto Layout আসলে কী, এটা কীভাবে একটা Frame-কে নিজে-থেকে-সাজানো একটা row বা column-এ পরিণত করে, আর কেন এটা আসল UI কাজের জন্য সবচেয়ে গুরুত্বপূর্ণ Figma feature।',
    blocks: [
      p('<p><b>Auto Layout</b> একটা সাধারণ Frame-কে এমন একটাতে পরিণত করে যা নিজের child-গুলো নিজে সাজায় — স্বয়ংক্রিয়ভাবে spacing দেয়, content-এর সাথে মানিয়ে বড়-ছোট হয়, আর ভেতরে যেকোনো কিছু বদলালেই সাথে সাথে সবকিছু reflow করে। কোনো code না লিখেই এটা Figma-র সবচেয়ে কাছাকাছি জিনিস আসল CSS flexbox লেখার।</p>'),
      img('docs/img/figma/auto-layout', 'Auto Layout চালু করা একটা Frame-এ তিনটা button — Cancel, Save changes (কমলা রঙে হাইলাইট করা), আর Delete — একটা row-এ সমান spacing আর consistent padding সহ', 1568, 669, 'তিনটা button ধারণ করা একটা horizontal Auto Layout frame — যেকোনো button resize করুন আর row নিজে থেকেই reflow হয়।'),
      h(2, 'এটা চালু করা', 'এটা-চালু-করা'),
      p('<p>একটা বা একাধিক layer select করুন আর <code>Shift+A</code> চাপুন, অথবা Design panel-এ Auto Layout icon-এ ক্লিক করুন। Figma selection-কে একটা নতুন Frame-এ wrap করে যেখানে Auto Layout আগে থেকেই সক্রিয়, default-এ child-গুলোকে একটা row-এ সাজিয়ে।</p>'),
      h(2, 'Control-গুলো', 'control-গুলো'),
      table(['Control', 'এটা কী করে'], [
        ['Direction', 'Horizontal (row) বা vertical (column) সাজানো'],
        ['Spacing', 'প্রতিটা child element-এর মধ্যে ফাঁক'],
        ['Padding', 'child-গুলো আর frame-এর নিজের প্রান্তের মধ্যে জায়গা'],
        ['Resizing', '"Hug contents" মানিয়ে frame-কে ছোট করে; "Fill container" তার parent পূরণ করতে বড় হয়'],
      ]),
      h(2, 'কেন এটা গুরুত্বপূর্ণ', 'কেন-এটা-গুরুত্বপূর্ণ'),
      p('<p>Auto Layout আসার আগে, একটা row-এ চতুর্থ button যোগ করা মানে তার পরের প্রতিটা element হাতে recalculate আর সরানো। Auto Layout দিয়ে, একটা নতুন child বসানো — বা একটা মুছে ফেলা — spacing আর frame size দুটোতেই সাথে সাথে বাকি সবকিছু reflow করে। এই কারণেই একটা design একজন developer-এর আসল flexbox/grid code কেমন দেখাবে তা নির্ভুলভাবে predict করতে পারে, যা এই কোর্সের শেষ lesson-এ কভার করা design-to-code handoff-কে ছোট করে দেয়।</p>'),
      h(2, 'Nested Auto Layout', 'nested-auto-layout'),
      p('<p>একটা Auto Layout frame অন্য একটা Auto Layout frame-এর ভেতরে বসতে পারে — একটা card-এর (vertical Auto Layout) ভেতরে button-এর একটা row (horizontal Auto Layout), যা একটা page-এর (vertical Auto Layout) ভেতরে। আসল interface প্রায় সবসময়ই কয়েক স্তরের nested Auto Layout, এই কারণেই এটাকে একটা advanced feature হিসেবে না দেখে শুরুতেই অভ্যাস করে নেওয়া উচিত।</p>'),
    ],
  },
})

lessons.push({
  slug: 'components-and-variants', sortOrder: n++,
  en: {
    title: 'Components and Variants',
    metaTitle: 'Components and Variants | Learn Computer Academy',
    metaDescription: 'Turning a design into a reusable Component, creating Instances, and grouping related Components into a Variant set with properties.',
    blocks: [
      p('<p>A <b>Component</b> is a master copy of a reusable piece of UI — a button, an input field, a card. Every place that button is used elsewhere in the file is an <b>Instance</b> — a linked copy that automatically updates the moment the original Component changes.</p>'),
      h(2, 'Creating a Component'),
      p('<p>Select any layer or group and press <code>Ctrl+Alt+K</code> (or right-click → Create component). The layer gets a purple diamond icon in the Layers panel, marking it as a Component. Dragging it onto the canvas again, or copy-pasting it, creates an Instance rather than a duplicate Component.</p>'),
      h(2, 'Why This Matters'),
      p('<p>Without Components, fixing a typo in a button used on 40 screens means finding and editing it 40 times. With Components, editing the one master Component instantly updates every Instance across the entire file — this single feature is why design systems are practical at all.</p>'),
      h(2, 'Variants'),
      p('<p>A button rarely has just one look — it needs a default state, a disabled state, maybe primary and secondary versions. Rather than creating four unrelated Components, Figma groups related Components into a single <b>Variant set</b> with named properties, so a designer picks "State: Disabled" from a dropdown instead of hunting for a separate disabled-button Component.</p>'),
      img('docs/img/figma/component-variants', 'A Button component set with two variants shown stacked in the Layers panel with diamond component icons — a full-opacity "Default" variant and a faded 40%-opacity "Disabled" variant — and the Design panel showing a "State" property set to the selected variant', 1568, 669, 'A real two-variant Button component set — Default and Disabled — with the "State" property visible in the right panel and both variants in the Layers panel.'),
      h(2, 'Building a Variant Set'),
      p('<p>Select two or more Components with a consistent naming pattern (e.g. "Button, State=Default" and "Button, State=Disabled") and combine them into a set. Each property (like "State") becomes a dropdown in the Design panel wherever an Instance of that set is placed — the same button, switchable between every state it was designed for, without ever leaving the panel.</p>'),
    ],
  },
  bn: {
    title: 'Component আর Variant',
    metaTitle: 'Component আর Variant | Learn Computer Academy',
    metaDescription: 'একটা design-কে reusable Component-এ পরিণত করা, Instance তৈরি করা, আর সম্পর্কিত Component-গুলোকে property সহ একটা Variant set-এ গ্রুপ করা।',
    blocks: [
      p('<p>একটা <b>Component</b> হলো UI-র একটা পুনরায়-ব্যবহারযোগ্য অংশের master copy — একটা button, একটা input field, একটা card। file-এর অন্য যেখানেই সেই button ব্যবহার করা হয় সেটা একটা <b>Instance</b> — একটা linked copy যা আসল Component বদলানোর সাথে সাথেই স্বয়ংক্রিয়ভাবে update হয়।</p>'),
      h(2, 'একটা Component তৈরি করা', 'একটা-component-তৈরি-করা'),
      p('<p>যেকোনো layer বা group select করুন আর <code>Ctrl+Alt+K</code> চাপুন (অথবা right-click → Create component)। layer-টা Layers panel-এ একটা বেগুনি diamond icon পায়, একে Component হিসেবে চিহ্নিত করে। এটাকে আবার canvas-এ drag করলে, বা copy-paste করলে, একটা নতুন Component না বানিয়ে একটা Instance তৈরি হয়।</p>'),
      h(2, 'কেন এটা গুরুত্বপূর্ণ', 'কেন-এটা-গুরুত্বপূর্ণ'),
      p('<p>Component ছাড়া, ৪০টা screen-এ ব্যবহৃত একটা button-এর একটা typo ঠিক করতে হলে সেটা ৪০ বার খুঁজে edit করতে হবে। Component দিয়ে, একটা মাত্র master Component edit করলে সাথে সাথেই পুরো file জুড়ে প্রতিটা Instance update হয়ে যায় — এই একটা feature-এর কারণেই design system আদৌ practical।</p>'),
      h(2, 'Variant', 'variant'),
      p('<p>একটা button-এর সাধারণত শুধু একটা look থাকে না — এর একটা default state, একটা disabled state, হয়তো primary আর secondary version লাগে। চারটা অসম্পর্কিত Component বানানোর বদলে, Figma সম্পর্কিত Component-গুলোকে নাম-দেওয়া property সহ একটা <b>Variant set</b>-এ গ্রুপ করে, তাই একজন designer আলাদা disabled-button Component খুঁজে বের করার বদলে একটা dropdown থেকে "State: Disabled" বেছে নেয়।</p>'),
      img('docs/img/figma/component-variants', 'দুটো variant সহ একটা Button component set, Layers panel-এ diamond component icon সহ stack করা দেখানো — একটা পূর্ণ-opacity "Default" variant আর একটা ফিকে 40%-opacity "Disabled" variant — আর Design panel-এ select করা variant-এ সেট করা "State" property দেখাচ্ছে', 1568, 669, 'একটা আসল দুই-variant Button component set — Default আর Disabled — ডান panel-এ দৃশ্যমান "State" property আর Layers panel-এ দুটো variant সহ।'),
      h(2, 'একটা Variant Set বানানো', 'একটা-variant-set-বানানো'),
      p('<p>একটা consistent naming pattern সহ দুই বা তার বেশি Component select করুন (যেমন "Button, State=Default" আর "Button, State=Disabled") আর সেগুলোকে একটা set-এ combine করুন। প্রতিটা property (যেমন "State") সেই set-এর একটা Instance যেখানেই বসানো হোক না কেন Design panel-এ একটা dropdown হয়ে যায় — একই button, panel থেকে বেরিয়ে না গিয়ে ডিজাইন করা প্রতিটা state-এর মধ্যে বদলানো যায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'color-and-effect-styles', sortOrder: n++,
  en: {
    title: 'Color and Effect Styles',
    metaTitle: 'Color and Effect Styles | Learn Computer Academy',
    metaDescription: 'Saving reusable Color and Effect styles in Figma, and using a design system\'s built-in style libraries like shadows and elevation.',
    blocks: [
      p('<p>Just like Components save a reusable piece of UI, <b>Styles</b> save a reusable value — a color, a shadow, a text setting — so it can be applied consistently everywhere and updated everywhere at once.</p>'),
      h(2, 'Color Styles'),
      p('<p>Pick a fill color in the Design panel, then click the small style-grid icon next to the Fill row to save it as a named Color style — "Primary/Orange," for example. Every layer using that style updates instantly if the style\'s color is ever changed, exactly like a Component but for color instead of a whole layer.</p>'),
      h(2, 'Effect Styles'),
      p('<p>Effects — drop shadows, inner shadows, blurs — work the same way. Rather than manually tuning a shadow\'s blur and offset on every card in a design, apply a saved Effect style once and every card shares the exact same shadow.</p>'),
      img('docs/img/figma/color-effect-style-canvas', 'An orange rectangle with a subtle drop shadow applied from a saved "M3/Elevation Light/2" effect style, shown on the canvas with the Layers panel on the left', 1568, 669, 'A rectangle with a real Effect style applied from a design system library, adding a consistent elevation shadow.'),
      h(2, 'Library Styles'),
      p('<p>Beyond styles you create yourself, Figma can connect to shared <b>libraries</b> — a team\'s design system, or a public one like Material Design — that ship pre-built color and effect styles ready to use. The panel below shows Figma\'s effect-style picker with a Material 3 elevation library available.</p>'),
      img('docs/img/figma/color-effect-style-panel', 'The Design panel for a rectangle showing Position, Layout, Fill, and Stroke sections with real values', 1568, 669),
      h(2, 'Why Bother With Styles'),
      p('<p>The payoff is the same as Components: one update, everywhere at once. A rebrand that changes the primary orange to a different shade takes one edit to a Color style instead of hunting down every rectangle that happens to be that color.</p>'),
    ],
  },
  bn: {
    title: 'Color আর Effect Style',
    metaTitle: 'Color আর Effect Style | Learn Computer Academy',
    metaDescription: 'Figma-তে পুনরায়-ব্যবহারযোগ্য Color আর Effect style save করা, আর shadow আর elevation-এর মতো একটা design system-এর বিল্ট-ইন style library ব্যবহার করা।',
    blocks: [
      p('<p>ঠিক যেমন Component UI-র একটা পুনরায়-ব্যবহারযোগ্য অংশ save করে, <b>Style</b> একটা পুনরায়-ব্যবহারযোগ্য value save করে — একটা color, একটা shadow, একটা text setting — যাতে এটা সব জায়গায় consistent-ভাবে apply করা যায় আর একসাথে সব জায়গায় update করা যায়।</p>'),
      h(2, 'Color Style', 'color-style'),
      p('<p>Design panel-এ একটা fill color বেছে নিন, তারপর Fill row-এর পাশে ছোট style-grid icon-এ ক্লিক করুন সেটাকে একটা নাম-দেওয়া Color style হিসেবে save করতে — যেমন "Primary/Orange"। সেই style ব্যবহার করা প্রতিটা layer সাথে সাথে update হয়ে যায় যদি কখনো style-এর color বদলানো হয়, ঠিক Component-এর মতো কিন্তু পুরো layer-এর বদলে color-এর জন্য।</p>'),
      h(2, 'Effect Style', 'effect-style'),
      p('<p>Effect — drop shadow, inner shadow, blur — একই ভাবে কাজ করে। একটা design-এর প্রতিটা card-এ হাতে shadow-এর blur আর offset টিউন করার বদলে, একটা save করা Effect style একবার apply করুন আর প্রতিটা card ঠিক একই shadow শেয়ার করে।</p>'),
      img('docs/img/figma/color-effect-style-canvas', 'একটা save করা "M3/Elevation Light/2" effect style থেকে apply করা হালকা drop shadow সহ একটা কমলা rectangle, canvas-এ বামে Layers panel সহ দেখানো', 1568, 669, 'একটা design system library থেকে apply করা একটা আসল Effect style সহ একটা rectangle, একটা consistent elevation shadow যোগ করে।'),
      h(2, 'Library Style', 'library-style'),
      p('<p>নিজে বানানো style ছাড়াও, Figma shared <b>library</b>-র সাথে সংযুক্ত হতে পারে — একটা team-এর design system, বা Material Design-এর মতো একটা public library — যা ব্যবহারের জন্য প্রস্তুত pre-built color আর effect style দেয়। নিচের panel Figma-র effect-style picker দেখায়, একটা Material 3 elevation library পাওয়া যাচ্ছে।</p>'),
      img('docs/img/figma/color-effect-style-panel', 'একটা rectangle-এর Design panel, আসল value সহ Position, Layout, Fill, আর Stroke section দেখাচ্ছে', 1568, 669),
      h(2, 'কেন Style নিয়ে মাথা ঘামানো', 'কেন-style-নিয়ে-মাথা-ঘামানো'),
      p('<p>ফলাফলটা Component-এর মতোই: একটা update, সব জায়গায় একসাথে। primary কমলাকে আলাদা shade-এ বদলানো একটা rebrand-এ Color style-এ একটা মাত্র edit লাগে, সেই color-এর প্রতিটা rectangle খুঁজে বের করার বদলে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'prototyping-and-handoff', sortOrder: n++,
  en: {
    title: 'Prototyping and Developer Handoff',
    metaTitle: 'Prototyping and Developer Handoff | Learn Computer Academy',
    metaDescription: 'Wiring Frames together into a clickable prototype in Figma\'s Prototype tab, and handing a finished design off to a developer.',
    blocks: [
      p('<p>A static design shows what a screen looks like. A <b>prototype</b> shows what happens when someone taps a button — which screen appears next, how it transitions in. Figma builds prototypes directly on top of the same Frames used for design, in the <b>Prototype</b> tab next to Design.</p>'),
      img('docs/img/figma/interface-tour-prototype-panel', 'The Prototype tab open in Figma, showing a selected shape with a circular connection node, and the right panel explaining "Creating a connection" (drag the circular node to another frame) and "Running your prototype" (use the play button)', 1568, 671, 'The Prototype tab — select an object and drag its connection node to another Frame to wire up a click.'),
      h(2, 'Creating a Connection'),
      p('<p>With the Prototype tab open, select any object and a small circular <b>connection node</b> appears on its edge. Drag from that node to another Frame, and Figma draws an arrow between them — that\'s the entire mechanic. Clicking the source object in a live preview now navigates to the target Frame.</p>'),
      h(2, 'Interactions and Transitions'),
      p('<p>Each connection can be configured with a trigger ("On click," "On drag," "While hovering") and a transition ("Instant," "Dissolve," "Slide in from the right"), matching how the interface should actually feel to use rather than just how it should look.</p>'),
      h(2, 'Running a Prototype'),
      p('<p>The play button in the top-right corner opens a full-screen preview that behaves like the real, finished interface — every connection is clickable, every transition plays. This is the single fastest way to test whether a flow actually makes sense before any code exists.</p>'),
      h(2, 'Handing Off to Developers'),
      p('<p>A developer working from a finished design doesn\'t need a mockup image — they need exact numbers. Figma\'s <b>Inspect</b> panel (visible to anyone with access to the file, developer or not) shows the precise CSS for any selected layer: padding, colors as hex codes, font sizes, and border radii, ready to copy directly into code.</p>'),
      callout('note', '<p>This is the payoff of everything earlier in this course — a design built with real Auto Layout, named Color/Effect styles, and a genuine type scale hands off to a developer as clean, predictable CSS. A design built freehand, with one-off sizes and colors everywhere, hands off as guesswork.</p>', 'Why the earlier lessons matter here'),
    ],
  },
  bn: {
    title: 'Prototyping আর Developer Handoff',
    metaTitle: 'Prototyping আর Developer Handoff | Learn Computer Academy',
    metaDescription: 'Figma-র Prototype ট্যাবে Frame-গুলোকে জোড়া লাগিয়ে একটা click-করা-যায় prototype বানানো, আর একটা শেষ করা design একজন developer-কে হস্তান্তর করা।',
    blocks: [
      p('<p>একটা static design দেখায় একটা screen দেখতে কেমন। একটা <b>prototype</b> দেখায় কেউ একটা button চাপলে কী হয় — পরে কোন screen আসে, কীভাবে সেটা transition হয়ে ঢোকে। Figma design-এর জন্য ব্যবহৃত একই Frame-এর উপরেই সরাসরি prototype বানায়, Design-এর পাশের <b>Prototype</b> ট্যাবে।</p>'),
      img('docs/img/figma/interface-tour-prototype-panel', 'Figma-তে খোলা Prototype ট্যাব, একটা circular connection node সহ select করা একটা shape দেখাচ্ছে, আর ডান panel "Creating a connection" (circular node-টা অন্য একটা frame-এ drag করুন) আর "Running your prototype" (play button ব্যবহার করুন) ব্যাখ্যা করছে', 1568, 671, 'Prototype ট্যাব — একটা object select করুন আর একটা click জোড়া লাগাতে তার connection node অন্য একটা Frame-এ drag করুন।'),
      h(2, 'একটা Connection তৈরি করা', 'একটা-connection-তৈরি-করা'),
      p('<p>Prototype ট্যাব খোলা থাকা অবস্থায়, যেকোনো object select করুন আর তার প্রান্তে একটা ছোট circular <b>connection node</b> দেখা যায়। সেই node থেকে অন্য একটা Frame-এ drag করুন, আর Figma তাদের মধ্যে একটা arrow আঁকে — এটাই পুরো mechanic। এখন একটা live preview-তে source object-এ ক্লিক করলে target Frame-এ navigate হয়।</p>'),
      h(2, 'Interaction আর Transition', 'interaction-আর-transition'),
      p('<p>প্রতিটা connection একটা trigger ("On click," "On drag," "While hovering") আর একটা transition ("Instant," "Dissolve," "Slide in from the right") দিয়ে configure করা যায়, interface দেখতে কেমন হওয়া উচিত তার বদলে ব্যবহার করতে আসলে কেমন লাগা উচিত তার সাথে মিলিয়ে।</p>'),
      h(2, 'একটা Prototype চালানো', 'একটা-prototype-চালানো'),
      p('<p>উপরে-ডানে play button একটা পূর্ণ-screen preview খোলে যা আসল, শেষ করা interface-এর মতো আচরণ করে — প্রতিটা connection ক্লিক-করা-যায়, প্রতিটা transition চলে। কোনো code তৈরি হওয়ার আগে একটা flow আসলেই যুক্তিসঙ্গত কিনা পরীক্ষা করার এটাই সবচেয়ে দ্রুত উপায়।</p>'),
      h(2, 'Developer-দের হস্তান্তর করা', 'developer-দের-হস্তান্তর-করা'),
      p('<p>একটা শেষ করা design থেকে কাজ করা একজন developer-এর একটা mockup image দরকার নেই — তাদের সঠিক সংখ্যা দরকার। Figma-র <b>Inspect</b> panel (file-এ access আছে এমন যে কারো কাছে দৃশ্যমান, developer হোক বা না হোক) যেকোনো select করা layer-এর সঠিক CSS দেখায়: padding, hex code হিসেবে color, font size, আর border radius, সরাসরি code-এ copy করার জন্য প্রস্তুত।</p>'),
      callout('note', '<p>এই কোর্সের আগের সবকিছুর ফলাফল এটাই — আসল Auto Layout, নাম-দেওয়া Color/Effect style, আর একটা প্রকৃত type scale দিয়ে বানানো একটা design একজন developer-কে পরিষ্কার, অনুমানযোগ্য CSS হিসেবে হস্তান্তর হয়। যেখানে-সেখানে এককালীন size আর color দিয়ে হাতে বানানো একটা design অনুমান-নির্ভর হিসেবে হস্তান্তর হয়।</p>', 'কেন আগের lesson-গুলো এখানে গুরুত্বপূর্ণ'),
    ],
  },
})

// ═══ Added per site-owner request (2026-08-17, D-79): the course read as too
// shallow next to sibling categories — 8 more lessons covering layout grids,
// constraints, real app/web design walkthroughs, Smart Animate, overlays,
// team libraries, and a capstone project. Images are real screenshots from
// this same reference file, same convention as lessons 1-9. ═══════════════

lessons.push({
  slug: 'layout-grids-and-guides', sortOrder: n++,
  en: {
    title: 'Layout Grids and Guides',
    metaTitle: 'Layout Grids and Guides | Learn Computer Academy',
    metaDescription: 'Adding column, row, and square grids to a Frame in Figma, and why a consistent grid keeps spacing decisions from being guesswork.',
    blocks: [
      p('<p>A <b>layout grid</b> is a visual overlay on a Frame — columns, rows, or a square grid — that guides where content lines up, without becoming part of the actual design. It only shows in the editor, never in a real screenshot or a shipped app.</p>'),
      img('docs/img/figma/layout-grid-demo', 'A Frame with a 5-column layout grid applied, shown as pink vertical stripes across the frame, with the Design panel\'s Layout guide section open showing "5 columns" selected', 1568, 717, 'A 5-column grid applied to a Frame via the Layout guide section of the Design panel.'),
      h(2, 'Adding a Grid'),
      p('<p>Select a Frame, scroll to <b>Layout guide</b> in the Design panel, and click the <code>+</code>. A default square grid appears immediately; the dropdown next to it switches between <b>Grid</b> (an evenly spaced square grid, good for icon work), <b>Columns</b> (vertical guides, the standard for web and app layouts), and <b>Rows</b> (horizontal guides).</p>'),
      h(2, 'Column Grid Settings'),
      table(['Setting', 'What it controls'], [
        ['Count', 'How many columns span the Frame'],
        ['Gutter', 'The gap between columns'],
        ['Margin', 'The space between the outermost columns and the Frame edge'],
        ['Type', '"Stretch" fills the Frame width; "Left"/"Right"/"Center" fixes a column width and anchors it'],
      ]),
      h(2, 'Why Bother'),
      p('<p>Without a grid, "does this align with that" gets answered by eye, and small inconsistencies pile up across a whole screen. With a grid, every element snaps to the same columns, and a design instantly reads as more organized — the same reason print magazines and newspapers have used column grids for a century before screens existed at all.</p>'),
      h(2, 'Common Presets'),
      p('<p>A 12-column grid is the de facto standard for web layouts (it divides evenly into halves, thirds, and quarters). Mobile app screens more often use a simpler 4-column grid, since there\'s less horizontal room to divide. Neither is a rule — they\'re starting points worth knowing before deviating from them on purpose.</p>'),
      callout('tip', '<p>Toggle a Frame\'s grid visibility on and off with <code>Ctrl+G</code> (or <code>Cmd+G</code> on Mac) — most designers leave it off most of the time and switch it on only to double-check alignment.</p>', 'Keyboard shortcut'),
    ],
  },
  bn: {
    title: 'Layout Grid আর Guide',
    metaTitle: 'Layout Grid আর Guide | Learn Computer Academy',
    metaDescription: 'Figma-তে একটা Frame-এ column, row, আর square grid যোগ করা, আর কেন একটা consistent grid spacing-এর সিদ্ধান্তকে অনুমান-নির্ভর হতে দেয় না।',
    blocks: [
      p('<p>একটা <b>layout grid</b> হলো একটা Frame-এর উপর একটা visual overlay — column, row, বা একটা square grid — যা content কোথায় সারিবদ্ধ হবে তার দিক নির্দেশ করে, আসল design-এর অংশ না হয়েই। এটা শুধু editor-এই দেখা যায়, কখনো আসল screenshot বা ship করা app-এ না।</p>'),
      img('docs/img/figma/layout-grid-demo', 'একটা 5-column layout grid apply করা একটা Frame, পুরো frame জুড়ে গোলাপি vertical ডোরা হিসেবে দেখানো, আর Design panel-এর Layout guide section খোলা "5 columns" select করা দেখাচ্ছে', 1568, 717, 'Design panel-এর Layout guide section দিয়ে একটা Frame-এ apply করা একটা 5-column grid।'),
      h(2, 'একটা Grid যোগ করা', 'একটা-grid-যোগ-করা'),
      p('<p>একটা Frame select করুন, Design panel-এ <b>Layout guide</b>-এ scroll করুন, আর <code>+</code>-এ ক্লিক করুন। সাথে সাথে একটা default square grid দেখা যায়; তার পাশের dropdown <b>Grid</b> (সমানভাবে ভাগ করা একটা square grid, icon কাজের জন্য ভালো), <b>Columns</b> (vertical guide, web আর app layout-এর জন্য মানদণ্ড), আর <b>Rows</b> (horizontal guide)-এর মধ্যে বদলায়।</p>'),
      h(2, 'Column Grid Setting', 'column-grid-setting'),
      table(['Setting', 'এটা কী নিয়ন্ত্রণ করে'], [
        ['Count', 'Frame জুড়ে কতগুলো column থাকবে'],
        ['Gutter', 'column-গুলোর মধ্যে ফাঁক'],
        ['Margin', 'সবচেয়ে বাইরের column আর Frame-এর প্রান্তের মধ্যে জায়গা'],
        ['Type', '"Stretch" Frame-এর পুরো width পূরণ করে; "Left"/"Right"/"Center" একটা fixed column width সেট করে সেটাকে anchor করে'],
      ]),
      h(2, 'কেন মাথা ঘামানো', 'কেন-মাথা-ঘামানো'),
      p('<p>একটা grid ছাড়া, "এটা কি ওটার সাথে align করছে" প্রশ্নের উত্তর চোখ দিয়ে দিতে হয়, আর ছোট ছোট অসঙ্গতি পুরো screen জুড়ে জমা হতে থাকে। একটা grid দিয়ে, প্রতিটা element একই column-এ snap করে, আর একটা design সাথে সাথে বেশি গোছানো মনে হয় — স্ক্রিন আসার শত বছর আগে থেকে print ম্যাগাজিন আর সংবাদপত্র column grid ব্যবহার করে আসছে ঠিক এই কারণেই।</p>'),
      h(2, 'সাধারণ Preset', 'সাধারণ-preset'),
      p('<p>একটা 12-column grid web layout-এর জন্য বাস্তবিক মানদণ্ড (এটা সমানভাবে অর্ধেক, তৃতীয়াংশ, আর চতুর্থাংশে ভাগ হয়)। Mobile app screen প্রায়ই একটা সরল 4-column grid ব্যবহার করে, কারণ ভাগ করার মতো horizontal জায়গা কম থাকে। কোনোটাই নিয়ম না — ইচ্ছাকৃতভাবে সরে যাওয়ার আগে জানা দরকার এমন শুরুর বিন্দু।</p>'),
      callout('tip', '<p><code>Ctrl+G</code> (Mac-এ <code>Cmd+G</code>) দিয়ে একটা Frame-এর grid visibility চালু-বন্ধ করুন — বেশিরভাগ designer বেশিরভাগ সময় এটা বন্ধ রাখে আর শুধু alignment double-check করতে চালু করে।</p>', 'Keyboard shortcut'),
    ],
  },
})

lessons.push({
  slug: 'constraints-and-responsive-resizing', sortOrder: n++,
  en: {
    title: 'Constraints and Responsive Resizing',
    metaTitle: 'Constraints and Responsive Resizing | Learn Computer Academy',
    metaDescription: 'How Constraints control what happens to a layer when its parent Frame is resized — pinning, stretching, and centering elements responsively.',
    blocks: [
      p('<p>Resize a Frame and every child inside it needs to know what to do — stay put, stretch, or move. <b>Constraints</b> are the setting that decides this, per layer, per axis (horizontal and vertical are set independently).</p>'),
      img('docs/img/figma/constraints-demo', 'A small rectangle inside a Frame with a "Left + Right" horizontal constraint applied, shown with dashed guide lines connecting it to both side edges of the Frame, and the Design panel\'s Constraints dropdowns visible', 1568, 717, 'A "Left + Right" constraint — dashed lines show the element staying pinned to both edges as the Frame resizes.'),
      h(2, 'The Constraint Options'),
      table(['Constraint', 'Behavior when the Frame resizes'], [
        ['Left / Right / Top / Bottom', 'Keeps a fixed distance from that one edge; the layer doesn\'t resize'],
        ['Left + Right (or Top + Bottom)', 'Pins both edges — the layer stretches to fill the growing/shrinking space'],
        ['Center', 'Keeps the layer centered, at a fixed distance from the midpoint'],
        ['Scale', 'Resizes the layer proportionally to the Frame\'s own resize'],
      ]),
      h(2, 'A Concrete Example'),
      p('<p>A header bar with a logo on the left and a search box that should stretch: the logo gets a <b>Left</b> constraint (stays put), and the search box gets <b>Left + Right</b> (grows and shrinks with the header). Get this wrong and the search box either stays a fixed width forever or the logo drifts away from the edge as the screen resizes.</p>'),
      h(2, 'Constraints vs. Auto Layout'),
      p('<p>Constraints and Auto Layout solve a similar problem from different angles. Constraints answer "what happens when THIS Frame resizes" for children placed freely inside it — useful for a single fixed-size screen like a specific device mockup. Auto Layout (covered earlier in this course) actively arranges and resizes a whole group of children based on their content. Real files use both: Auto Layout for the parts that should flow, Constraints for the parts that should just pin in place.</p>'),
      h(2, 'Testing It'),
      p('<p>Select the parent Frame and manually drag one of its resize handles — every child\'s constraint behavior plays out live on the canvas, no prototype or preview needed. This is the fastest way to catch a wrong constraint before it becomes a real bug.</p>'),
    ],
  },
  bn: {
    title: 'Constraints আর Responsive Resizing',
    metaTitle: 'Constraints আর Responsive Resizing | Learn Computer Academy',
    metaDescription: 'একটা parent Frame resize হলে একটা layer-এর কী হবে তা Constraints কীভাবে নিয়ন্ত্রণ করে — element pin করা, stretch করা, আর responsive-ভাবে center করা।',
    blocks: [
      p('<p>একটা Frame resize করুন আর তার ভেতরের প্রতিটা child-কে জানতে হবে কী করতে হবে — জায়গায় থাকা, stretch করা, বা সরে যাওয়া। <b>Constraints</b> হলো সেই setting যা এটা ঠিক করে, প্রতি layer-এ, প্রতি axis-এ (horizontal আর vertical আলাদাভাবে সেট করা হয়)।</p>'),
      img('docs/img/figma/constraints-demo', 'একটা Frame-এর ভেতরে "Left + Right" horizontal constraint apply করা একটা ছোট rectangle, Frame-এর দুই পাশের প্রান্তের সাথে সংযোগকারী dashed guide line সহ দেখানো, আর Design panel-এর Constraints dropdown দৃশ্যমান', 1568, 717, 'একটা "Left + Right" constraint — Frame resize হওয়ার সাথে সাথে element দুই প্রান্তেই pin থাকা dashed line-এ দেখানো।'),
      h(2, 'Constraint অপশনগুলো', 'constraint-অপশনগুলো'),
      table(['Constraint', 'Frame resize হলে আচরণ'], [
        ['Left / Right / Top / Bottom', 'সেই একটা প্রান্ত থেকে একটা fixed দূরত্ব বজায় রাখে; layer resize হয় না'],
        ['Left + Right (বা Top + Bottom)', 'দুই প্রান্তই pin করে — বাড়তে/কমতে থাকা জায়গা পূরণ করতে layer stretch হয়'],
        ['Center', 'layer-কে center-এ রাখে, মধ্যবিন্দু থেকে একটা fixed দূরত্বে'],
        ['Scale', 'Frame নিজে resize হওয়ার সমানুপাতে layer resize হয়'],
      ]),
      h(2, 'একটা বাস্তব উদাহরণ', 'একটা-বাস্তব-উদাহরণ'),
      p('<p>বামে একটা logo আর stretch হওয়া উচিত এমন একটা search box সহ একটা header bar: logo একটা <b>Left</b> constraint পায় (জায়গায় থাকে), আর search box <b>Left + Right</b> পায় (header-এর সাথে বাড়ে-কমে)। এটা ভুল করলে হয় search box চিরকালের জন্য একটা fixed width থেকে যায়, নয়তো screen resize হওয়ার সাথে logo প্রান্ত থেকে সরে যেতে থাকে।</p>'),
      h(2, 'Constraints বনাম Auto Layout', 'constraints-বনাম-auto-layout'),
      p('<p>Constraints আর Auto Layout একই সমস্যা ভিন্ন দিক থেকে সমাধান করে। Constraints উত্তর দেয় "এই Frame resize হলে কী হবে" তার ভেতরে স্বাধীনভাবে বসানো child-দের জন্য — একটা নির্দিষ্ট fixed-size screen-এর জন্য useful, যেমন একটা নির্দিষ্ট device mockup। Auto Layout (এই কোর্সে আগে কভার করা) সক্রিয়ভাবে child-দের একটা পুরো group-কে তাদের content অনুযায়ী সাজায় আর resize করে। আসল file দুটোই ব্যবহার করে: যে অংশগুলো flow করা উচিত তার জন্য Auto Layout, যে অংশগুলো শুধু জায়গায় pin থাকা উচিত তার জন্য Constraints।</p>'),
      h(2, 'পরীক্ষা করা', 'পরীক্ষা-করা'),
      p('<p>parent Frame select করুন আর হাতে তার একটা resize handle drag করুন — প্রতিটা child-এর constraint আচরণ canvas-এ সরাসরি দেখা যায়, কোনো prototype বা preview লাগে না। একটা ভুল constraint আসল bug হওয়ার আগে ধরার এটাই সবচেয়ে দ্রুত উপায়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'designing-a-mobile-app-screen', sortOrder: n++,
  en: {
    title: 'Designing a Mobile App Screen',
    metaTitle: 'Designing a Mobile App Screen | Learn Computer Academy',
    metaDescription: 'A start-to-finish walkthrough building a real sign-in screen in Figma — device frame, hierarchy, input fields, and a call-to-action button.',
    blocks: [
      p('<p>This lesson puts everything so far together on one real screen: a mobile sign-in screen, built the same way a working designer would build it.</p>'),
      img('docs/img/figma/app-screen-demo', 'A mobile app sign-in screen mockup with rounded corners: a "Sign In" heading near the top, two gray input field placeholders stacked below it, and an orange "Continue" button at the bottom', 245, 484, 'A complete sign-in screen — heading, two input fields, and a call-to-action button, built entirely from the shapes and text tools covered earlier in this course.'),
      h(2, 'Step 1 — The Device Frame'),
      p('<p>Start with a Frame sized to a real device (covered in the Frames & Presets lesson) rather than an arbitrary rectangle — designing at the actual pixel size a phone screen will render at catches sizing problems immediately instead of after handoff.</p>'),
      h(2, 'Step 2 — Establish Hierarchy First'),
      p('<p>Before any styling, place the content in the order a user reads it: a heading ("Sign In") announces what the screen is for, input fields come next, and the primary action (the button) sits last, visually weighted the heaviest — filled with color, while the inputs stay a neutral gray.</p>'),
      h(2, 'Step 3 — Inputs as Rectangles (For Now)'),
      p('<p>An input field starts as a simple rounded rectangle with a light gray fill — good enough to communicate "type here" at the wireframe stage. A real input component (with a border, a focus state, placeholder text) is exactly the kind of thing worth turning into a Component once the design settles, using the Components & Variants lesson\'s technique.</p>'),
      h(2, 'Step 4 — One Clear Call to Action'),
      p('<p>A screen with three buttons of equal visual weight leaves the user guessing which one matters. This screen has exactly one filled, colored button ("Continue") — everything else stays neutral, so there\'s no ambiguity about the next step.</p>'),
      h(2, 'Where This Goes Next'),
      p('<p>In a real project, the input rectangles become real Input components with variants (Default/Focused/Error), the button becomes an instance of the Button component set from earlier in this course, and the whole screen gets wired into a prototype — covered in the Smart Animate and Overlays lessons that follow.</p>'),
    ],
  },
  bn: {
    title: 'একটা Mobile App Screen ডিজাইন করা',
    metaTitle: 'একটা Mobile App Screen ডিজাইন করা | Learn Computer Academy',
    metaDescription: 'Figma-তে একটা আসল sign-in screen শুরু থেকে শেষ পর্যন্ত বানানোর একটা walkthrough — device frame, hierarchy, input field, আর একটা call-to-action button।',
    blocks: [
      p('<p>এই lesson এখন পর্যন্ত শেখা সবকিছু একটা আসল screen-এ একসাথে নিয়ে আসে: একটা mobile sign-in screen, ঠিক যেভাবে একজন কর্মরত designer এটা বানাবে সেভাবে বানানো।</p>'),
      img('docs/img/figma/app-screen-demo', 'গোলাকার কোণ সহ একটা mobile app sign-in screen mockup: উপরের দিকে একটা "Sign In" heading, তার নিচে দুটো ধূসর input field placeholder স্ট্যাক করা, আর নিচে একটা কমলা "Continue" button', 245, 484, 'একটা সম্পূর্ণ sign-in screen — heading, দুটো input field, আর একটা call-to-action button, পুরোটাই এই কোর্সে আগে কভার করা shape আর text টুল দিয়ে বানানো।'),
      h(2, 'ধাপ ১ — Device Frame', 'ধাপ-১-device-frame'),
      p('<p>যাচ্ছেতাই একটা rectangle-এর বদলে একটা আসল device-এর size-এ (Frames & Presets lesson-এ কভার করা) একটা Frame দিয়ে শুরু করুন — একটা ফোন স্ক্রিন আসলে যে pixel size-এ render হবে ঠিক সেই size-এ design করলে handoff-এর পরে না, সাথে সাথেই sizing সমস্যা ধরা পড়ে।</p>'),
      h(2, 'ধাপ ২ — প্রথমে Hierarchy ঠিক করা', 'ধাপ-২-প্রথমে-hierarchy-ঠিক-করা'),
      p('<p>কোনো styling করার আগে, একজন user যেভাবে পড়ে সেই ক্রমে content বসান: একটা heading ("Sign In") screen-টা কীসের জন্য তা জানায়, তারপর input field, আর সবার শেষে primary action (button), যা দৃশ্যত সবচেয়ে ভারী — color দিয়ে ভরা, যেখানে input-গুলো একটা নিরপেক্ষ ধূসর থাকে।</p>'),
      h(2, 'ধাপ ৩ — আপাতত Rectangle হিসেবে Input', 'ধাপ-৩-আপাতত-rectangle-হিসেবে-input'),
      p('<p>একটা input field একটা হালকা ধূসর fill সহ সাধারণ একটা rounded rectangle হিসেবে শুরু হয় — wireframe পর্যায়ে "এখানে টাইপ করুন" বোঝানোর জন্য যথেষ্ট। একটা আসল input component (একটা border, একটা focus state, placeholder text সহ) ঠিক এমন জিনিস যা design স্থির হয়ে গেলে Components & Variants lesson-এর technique ব্যবহার করে একটা Component-এ পরিণত করার যোগ্য।</p>'),
      h(2, 'ধাপ ৪ — একটাই স্পষ্ট Call to Action', 'ধাপ-৪-একটাই-স্পষ্ট-call-to-action'),
      p('<p>সমান দৃশ্যত গুরুত্বের তিনটা button থাকা একটা screen user-কে অনুমান করতে বাধ্য করে কোনটা গুরুত্বপূর্ণ। এই screen-এ ঠিক একটাই ভরা, রঙিন button আছে ("Continue") — বাকি সবকিছু নিরপেক্ষ থাকে, তাই পরের ধাপ নিয়ে কোনো অস্পষ্টতা নেই।</p>'),
      h(2, 'এরপর এটা কোথায় যায়', 'এরপর-এটা-কোথায়-যায়'),
      p('<p>একটা আসল প্রজেক্টে, input rectangle-গুলো variant সহ (Default/Focused/Error) আসল Input component হয়ে যায়, button এই কোর্সের আগের Button component set-এর একটা instance হয়ে যায়, আর পুরো screen-টা একটা prototype-এ জোড়া লাগে — যা পরের Smart Animate আর Overlays lesson-এ কভার করা হয়েছে।</p>'),
    ],
  },
})

lessons.push({
  slug: 'designing-a-website-layout', sortOrder: n++,
  en: {
    title: 'Designing a Website Layout',
    metaTitle: 'Designing a Website Layout | Learn Computer Academy',
    metaDescription: 'Building a real landing page in Figma — a nav bar, a hero section with a heading and call-to-action, and how web layouts differ from app screens.',
    blocks: [
      p('<p>Web layouts share every tool covered so far, but the canvas is wider and the content usually scrolls, which changes a few habits from app design.</p>'),
      img('docs/img/figma/website-landing-page', 'A website landing page mockup on a wide desktop frame: a navigation bar with a "Brand" logo on the left and "Home Docs Pricing" menu links on the right, a large bold heading "Design faster with real components" below it, and an orange "Get Started" button', 1303, 398, 'A landing page header and hero section — nav bar, heading, and a single clear call-to-action button.'),
      h(2, 'Start With a Desktop Preset'),
      p('<p>Just like the mobile screen lesson, start from a real preset — "Desktop" at 1440×900 is the most common starting width. Unlike a phone screen, the Frame\'s height is really just a starting canvas; the actual page keeps going as long as the content does, since a real webpage scrolls.</p>'),
      h(2, 'The Navigation Bar'),
      p('<p>A nav bar is one of the clearest real-world uses for Auto Layout with a <b>Left + Right</b> constraint on its parent: the logo stays pinned left, the menu links stay pinned right, and the whole bar can stretch to any browser width without anything drifting out of place.</p>'),
      h(2, 'The Hero Section'),
      p('<p>The "hero" is the large heading and single call-to-action right below the nav — it\'s the first thing a visitor reads, so it carries the biggest type size in the whole page (using the type scale from earlier in this course) and the one button that matters most, exactly like the mobile screen\'s single clear CTA.</p>'),
      h(2, 'Rows, Not Columns, Drive Structure'),
      p('<p>Where a mobile screen is basically one vertical stack, a website landing page is usually a series of horizontal sections stacked vertically — nav, hero, a features row, a footer — each one its own Auto Layout frame with <b>Fill container</b> width, so the whole page reflows correctly if content in any one section changes.</p>'),
      callout('tip', '<p>Build the nav bar and hero section as their own reusable Components once they\'re final — most websites repeat the exact same header across every page, and a Component means editing it once updates it everywhere.</p>', 'Looking ahead'),
    ],
  },
  bn: {
    title: 'একটা Website Layout ডিজাইন করা',
    metaTitle: 'একটা Website Layout ডিজাইন করা | Learn Computer Academy',
    metaDescription: 'Figma-তে একটা আসল landing page বানানো — একটা nav bar, একটা heading আর call-to-action সহ একটা hero section, আর web layout app screen থেকে কীভাবে আলাদা।',
    blocks: [
      p('<p>Web layout এখন পর্যন্ত কভার করা প্রতিটা টুল শেয়ার করে, কিন্তু canvas চওড়া আর content সাধারণত scroll হয়, যা app design থেকে কিছু অভ্যাস বদলে দেয়।</p>'),
      img('docs/img/figma/website-landing-page', 'একটা চওড়া desktop frame-এ একটা website landing page mockup: বামে একটা "Brand" logo আর ডানে "Home Docs Pricing" মেনু লিংক সহ একটা navigation bar, তার নিচে একটা বড় bold heading "Design faster with real components", আর একটা কমলা "Get Started" button', 1303, 398, 'একটা landing page header আর hero section — nav bar, heading, আর একটা মাত্র স্পষ্ট call-to-action button।'),
      h(2, 'একটা Desktop Preset দিয়ে শুরু করা', 'একটা-desktop-preset-দিয়ে-শুরু-করা'),
      p('<p>mobile screen lesson-এর মতোই, একটা আসল preset দিয়ে শুরু করুন — 1440×900-এ "Desktop" সবচেয়ে সাধারণ শুরুর width। একটা ফোন স্ক্রিনের থেকে আলাদা, Frame-এর height আসলে শুধু একটা শুরুর canvas; content যতক্ষণ চলে আসল page-ও ততক্ষণ চলতে থাকে, কারণ একটা আসল webpage scroll হয়।</p>'),
      h(2, 'Navigation Bar', 'navigation-bar'),
      p('<p>একটা nav bar তার parent-এ <b>Left + Right</b> constraint সহ Auto Layout-এর সবচেয়ে স্পষ্ট বাস্তব-জগতের ব্যবহারগুলোর একটা: logo বামে pin থাকে, মেনু লিংক ডানে pin থাকে, আর পুরো bar-টা যেকোনো browser width-এ stretch করতে পারে কোনো কিছু জায়গা থেকে না সরে।</p>'),
      h(2, 'Hero Section', 'hero-section'),
      p('<p>"hero" হলো nav-এর ঠিক নিচের বড় heading আর একমাত্র call-to-action — এটাই একজন visitor প্রথম যা পড়ে, তাই পুরো page-এ এটাতেই সবচেয়ে বড় type size থাকে (এই কোর্সে আগের type scale ব্যবহার করে) আর একটাই button যা সবচেয়ে গুরুত্বপূর্ণ, ঠিক mobile screen-এর একটাই স্পষ্ট CTA-এর মতো।</p>'),
      h(2, 'Row, Column না, গঠন চালায়', 'row-column-না-গঠন-চালায়'),
      p('<p>একটা mobile screen যেখানে মূলত একটা vertical stack, একটা website landing page সাধারণত vertically স্ট্যাক করা horizontal section-এর একটা সিরিজ — nav, hero, একটা features row, একটা footer — প্রতিটা তার নিজের <b>Fill container</b> width সহ Auto Layout frame, তাই যেকোনো section-এর content বদলালে পুরো page ঠিকমতো reflow হয়।</p>'),
      callout('tip', '<p>nav bar আর hero section শেষ হয়ে গেলে তাদের নিজস্ব পুনরায়-ব্যবহারযোগ্য Component হিসেবে বানান — বেশিরভাগ website প্রতিটা page জুড়ে ঠিক একই header পুনরাবৃত্তি করে, আর একটা Component মানে একবার edit করলে সব জায়গায় update হয়।</p>', 'সামনে তাকানো'),
    ],
  },
})

lessons.push({
  slug: 'smart-animate-and-micro-interactions', sortOrder: n++,
  en: {
    title: 'Smart Animate and Micro-interactions',
    metaTitle: 'Smart Animate and Micro-interactions | Learn Computer Academy',
    metaDescription: 'How Figma\'s Smart Animate transition creates real animation between two frames by matching layer names, and what makes a layer "animatable."',
    blocks: [
      p('<p>Every prototype connection covered so far jumps instantly (or fades) between two Frames. <b>Smart Animate</b> is a transition type that instead genuinely animates the difference between them — a card growing, a menu sliding in, a color fading — without any keyframe timeline or code.</p>'),
      img('docs/img/figma/smart-animate-cards', 'Two Frames side by side, each containing an orange rectangle named identically — a small square in the first Frame and a larger rectangle in the second — set up as the "before" and "after" states for a Smart Animate transition', 441, 104, 'Two states of the same named layer, "Card" — small in Frame 1, large in Frame 2. Smart Animate interpolates every difference between them automatically.'),
      h(2, 'The One Rule That Makes It Work'),
      p('<p>Smart Animate matches layers <b>by name</b> across the two connected Frames. A layer called "Card" in Frame 1 and a layer also called "Card" in Frame 2 are treated as the same object — Figma animates every difference between them (position, size, rotation, color, corner radius) automatically. Rename either layer and the match breaks, and that piece snaps instead of animating.</p>'),
      h(2, 'Setting the Transition'),
      p('<p>Create a prototype connection between the two Frames (covered in the Prototyping lesson) exactly as before, then open the transition dropdown on that connection and choose <b>Smart Animate</b> instead of the default Instant/Dissolve options. An easing curve and duration become available once it\'s selected.</p>'),
      h(2, 'What Counts as "the Same Layer"'),
      table(['Matches (animates)', 'Doesn\'t match (snaps or breaks)'], [
        ['Same layer name, different position', 'Different layer names, even if visually identical'],
        ['Same layer name, different size', 'A layer that exists in one Frame but not the other'],
        ['Same layer name, different color/opacity', 'A layer nested at a different depth in the layer tree'],
      ]),
      h(2, 'Real Uses'),
      p('<p>Smart Animate is how most of the small "delight" moments in real apps get prototyped before a developer builds them for real: a card expanding when tapped, a tab indicator sliding to the selected tab, a button subtly growing on press. None of it requires more than naming layers consistently across states.</p>'),
    ],
  },
  bn: {
    title: 'Smart Animate আর Micro-interaction',
    metaTitle: 'Smart Animate আর Micro-interaction | Learn Computer Academy',
    metaDescription: 'Figma-র Smart Animate transition layer name মিলিয়ে দুটো frame-এর মধ্যে কীভাবে আসল animation তৈরি করে, আর কোন layer "animate-করার-যোগ্য" তা কী ঠিক করে।',
    blocks: [
      p('<p>এখন পর্যন্ত কভার করা প্রতিটা prototype connection দুটো Frame-এর মধ্যে সাথে সাথে (বা fade করে) jump করে। <b>Smart Animate</b> হলো একটা transition type যা তার বদলে তাদের মধ্যে পার্থক্যটা সত্যিকারভাবে animate করে — একটা card বড় হয়ে যাওয়া, একটা মেনু slide করে ঢোকা, একটা color fade হওয়া — কোনো keyframe timeline বা code ছাড়াই।</p>'),
      img('docs/img/figma/smart-animate-cards', 'পাশাপাশি দুটো Frame, প্রতিটাতে একই নামের একটা কমলা rectangle — প্রথম Frame-এ একটা ছোট square আর দ্বিতীয়টাতে একটা বড় rectangle — একটা Smart Animate transition-এর "আগে" আর "পরে" state হিসেবে সাজানো', 441, 104, 'একই নামের layer, "Card"-এর দুটো state — Frame 1-এ ছোট, Frame 2-এ বড়। Smart Animate তাদের মধ্যে প্রতিটা পার্থক্য নিজে থেকে interpolate করে।'),
      h(2, 'একটাই নিয়ম যা এটা কাজ করায়', 'একটাই-নিয়ম-যা-এটা-কাজ-করায়'),
      p('<p>Smart Animate দুটো সংযুক্ত Frame জুড়ে layer-কে <b>নাম দিয়ে</b> মেলায়। Frame 1-এ "Card" নামের একটা layer আর Frame 2-এও "Card" নামের একটা layer একই object হিসেবে গণ্য হয় — Figma তাদের মধ্যে প্রতিটা পার্থক্য (position, size, rotation, color, corner radius) নিজে থেকে animate করে। যেকোনো layer-এর নাম বদলালে মিল ভেঙে যায়, আর সেই অংশটা animate না হয়ে সাথে সাথে বদলে যায়।</p>'),
      h(2, 'Transition সেট করা', 'transition-সেট-করা'),
      p('<p>দুটো Frame-এর মধ্যে ঠিক আগের মতোই একটা prototype connection তৈরি করুন (Prototyping lesson-এ কভার করা), তারপর সেই connection-এর transition dropdown খুলুন আর default Instant/Dissolve অপশনের বদলে <b>Smart Animate</b> বেছে নিন। এটা select করার পর একটা easing curve আর duration পাওয়া যায়।</p>'),
      h(2, 'কোনটা "একই layer" গণ্য হয়', 'কোনটা-একই-layer-গণ্য-হয়'),
      table(['মেলে (animate হয়)', 'মেলে না (সাথে সাথে বদলায় বা ভাঙে)'], [
        ['একই layer নাম, ভিন্ন position', 'ভিন্ন layer নাম, দৃশ্যত একই হলেও'],
        ['একই layer নাম, ভিন্ন size', 'একটা layer যা এক Frame-এ আছে কিন্তু অন্যটাতে নেই'],
        ['একই layer নাম, ভিন্ন color/opacity', 'layer tree-তে ভিন্ন গভীরতায় nested একটা layer'],
      ]),
      h(2, 'বাস্তব ব্যবহার', 'বাস্তব-ব্যবহার'),
      p('<p>একজন developer সত্যিকারে বানানোর আগে আসল app-এর বেশিরভাগ ছোট "আনন্দদায়ক" মুহূর্ত এভাবেই prototype করা হয়: চাপলে একটা card বড় হয়ে যাওয়া, একটা tab indicator select করা tab-এ slide করা, চাপলে একটা button সামান্য বড় হওয়া। এর কোনোটাতেই state জুড়ে সামঞ্জস্যপূর্ণভাবে layer-এর নাম দেওয়া ছাড়া আর কিছু লাগে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'overlays-and-interactive-components', sortOrder: n++,
  en: {
    title: 'Overlays and Interactive Components',
    metaTitle: 'Overlays and Interactive Components | Learn Computer Academy',
    metaDescription: 'Prototyping modals, dropdowns, and tooltips in Figma with the Overlay interaction, and using interactive component states without extra connections.',
    blocks: [
      p('<p>A modal, a dropdown menu, a tooltip — none of these replace the whole screen the way a normal prototype connection does. Figma\'s <b>Overlay</b> interaction shows a Frame on top of the current one instead of navigating away from it.</p>'),
      h(2, 'Setting Up an Overlay'),
      p('<p>Create a prototype connection exactly as usual, but choose <b>Open overlay</b> from the action dropdown instead of "Navigate to." The target Frame appears floating on top of the source screen — the screen behind it is still visible and, depending on settings, still visible-not-interactive or fully interactive underneath.</p>'),
      h(2, 'Overlay Positioning'),
      table(['Position option', 'Where the overlay appears'], [
        ['Manual', 'Wherever the target Frame is placed relative to the source, exactly'],
        ['Top / Bottom / Left / Right / Center', 'Automatically anchored to that edge or center of the screen'],
      ]),
      h(2, 'Closing an Overlay'),
      p('<p>An overlay needs its own way to close — a background "click outside to dismiss" option in the interaction settings, or an explicit close button wired with its own <b>Close overlay</b> action. Forgetting this is the single most common broken-prototype mistake: an overlay that opens but has no way back.</p>'),
      h(2, 'Interactive Component States'),
      p('<p>Beyond overlays, a Component set built with a "State" property (Default/Hover/Pressed, from the Components & Variants lesson) can react to real cursor interaction directly, without a manual connection at all — set an instance\'s interactive states in the Prototype tab\'s "Interactive components" area, and Figma auto-switches variants on hover or press in the live preview.</p>'),
      callout('tip', '<p>A dropdown menu is usually just an Overlay anchored below the button that opens it, positioned "Manual," with a click-outside-to-close setting — one interaction, not custom code.</p>', 'A common real pattern'),
    ],
  },
  bn: {
    title: 'Overlay আর Interactive Component',
    metaTitle: 'Overlay আর Interactive Component | Learn Computer Academy',
    metaDescription: 'Figma-তে Overlay interaction দিয়ে modal, dropdown, আর tooltip prototype করা, আর বাড়তি connection ছাড়াই interactive component state ব্যবহার করা।',
    blocks: [
      p('<p>একটা modal, একটা dropdown মেনু, একটা tooltip — এগুলোর কোনোটাই একটা সাধারণ prototype connection যেভাবে করে সেভাবে পুরো screen replace করে না। Figma-র <b>Overlay</b> interaction বর্তমান screen-টা থেকে সরে না গিয়ে তার উপরে একটা Frame দেখায়।</p>'),
      h(2, 'একটা Overlay সেট করা', 'একটা-overlay-সেট-করা'),
      p('<p>ঠিক আগের মতোই একটা prototype connection তৈরি করুন, কিন্তু action dropdown থেকে "Navigate to"-এর বদলে <b>Open overlay</b> বেছে নিন। target Frame-টা source screen-এর উপরে ভাসমান দেখা যায় — তার পেছনের screen তখনো দেখা যায়, আর setting অনুযায়ী, নিচেরটা তখনো দৃশ্যমান-কিন্তু-interactive-না বা পুরোপুরি interactive থাকতে পারে।</p>'),
      h(2, 'Overlay-র Position', 'overlay-র-position'),
      table(['Position অপশন', 'overlay কোথায় দেখা যায়'], [
        ['Manual', 'target Frame source-এর সাপেক্ষে যেখানে বসানো, ঠিক সেখানেই'],
        ['Top / Bottom / Left / Right / Center', 'স্বয়ংক্রিয়ভাবে screen-এর সেই প্রান্তে বা কেন্দ্রে anchor করা'],
      ]),
      h(2, 'একটা Overlay বন্ধ করা', 'একটা-overlay-বন্ধ-করা'),
      p('<p>একটা overlay-র নিজের বন্ধ করার উপায় দরকার — interaction setting-এ একটা background "বাইরে ক্লিক করলে বন্ধ হবে" অপশন, বা নিজস্ব <b>Close overlay</b> action দিয়ে জোড়া লাগানো একটা স্পষ্ট close button। এটা ভুলে যাওয়া সবচেয়ে সাধারণ ভাঙা-prototype ভুল: একটা overlay যা খোলে কিন্তু ফেরার কোনো উপায় নেই।</p>'),
      h(2, 'Interactive Component State', 'interactive-component-state'),
      p('<p>Overlay ছাড়াও, একটা "State" property সহ বানানো একটা Component set (Default/Hover/Pressed, Components & Variants lesson থেকে) কোনো ম্যানুয়াল connection ছাড়াই সরাসরি আসল cursor interaction-এ প্রতিক্রিয়া দিতে পারে — Prototype ট্যাবের "Interactive components" অংশে একটা instance-এর interactive state সেট করুন, আর live preview-তে hover বা press করলে Figma নিজে থেকে variant বদলে দেয়।</p>'),
      callout('tip', '<p>একটা dropdown মেনু সাধারণত শুধু একটা Overlay, যা এটা খোলা button-এর নিচে anchor করা, "Manual" position-এ, একটা click-outside-to-close setting সহ — একটা interaction, custom code না।</p>', 'একটা সাধারণ বাস্তব প্যাটার্ন'),
    ],
  },
})

lessons.push({
  slug: 'design-systems-and-team-libraries', sortOrder: n++,
  en: {
    title: 'Design Systems and Team Libraries',
    metaTitle: 'Design Systems and Team Libraries | Learn Computer Academy',
    metaDescription: 'What a design system is in Figma terms, publishing a file as a shared Library, and using existing UI kits like iOS or Material Design.',
    blocks: [
      p('<p>A <b>design system</b> is everything covered in this course so far — Components, Variants, Color styles, Effect styles, a type scale — organized into one shared source of truth that every designer on a team pulls from, instead of each person rebuilding the same button slightly differently.</p>'),
      img('docs/img/figma/assets-panel-libraries', 'The Assets panel in Figma, showing "Created in this file" with one local component, and "UI kits" listing two published team libraries — an iOS and iPadOS 27 UI Kit with 173 components, and a Material 3 Design Kit', 1568, 671, 'The Assets panel — local components from this file, alongside real published libraries (iOS/iPadOS, Material 3) available to drag straight into any design.'),
      h(2, 'Publishing a Library'),
      p('<p>Any file\'s Components, Color styles, and Effect styles can be <b>published as a Library</b> from the file menu, making them available to every other file a team has access to — a designer working in a completely different file can search for and drag in the exact same Button component, guaranteed identical because it\'s the same source.</p>'),
      h(2, 'The Assets Panel'),
      p('<p>The Assets panel (left sidebar) is where every available Component lives — both a file\'s own Components ("Created in this file") and anything pulled in from published team libraries or public UI kits. Search it by name, or browse by category, and drag a result straight onto the canvas as a new Instance.</p>'),
      h(2, 'Using an Existing UI Kit'),
      p('<p>Full UI kits for major platforms — Apple\'s iOS/iPadOS kit, Google\'s Material Design kit — are freely available and get used constantly as a starting point: real, on-platform Components for every standard control (buttons, switches, tab bars, navigation patterns), so a project starts from something that already looks and feels native instead of building every basic control from a blank canvas.</p>'),
      h(2, 'When to Build a Custom System vs. Use a Kit'),
      p('<p>A public kit (iOS, Material) is the fast starting point for prototyping and for apps that should feel native to their platform. A custom design system — built from this course\'s own techniques — is what a real product with its own brand identity eventually needs, since a public kit\'s components carry someone else\'s visual language, not a company\'s own.</p>'),
      callout('note', '<p>This entire reference file, built across this course, is itself a small design system — a Button component set with named variants, a documented type scale, and reusable Color/Effect styles. The mechanics don\'t change at any size.</p>', 'What this course has been building toward'),
    ],
  },
  bn: {
    title: 'Design System আর Team Library',
    metaTitle: 'Design System আর Team Library | Learn Computer Academy',
    metaDescription: 'Figma-র ভাষায় একটা design system আসলে কী, একটা file-কে shared Library হিসেবে publish করা, আর iOS বা Material Design-এর মতো বিদ্যমান UI kit ব্যবহার করা।',
    blocks: [
      p('<p>একটা <b>design system</b> হলো এই কোর্সে এখন পর্যন্ত কভার করা সবকিছু — Component, Variant, Color style, Effect style, একটা type scale — একটা shared সত্যের উৎসে সংগঠিত, যেখান থেকে একটা team-এর প্রতিটা designer টেনে নেয়, প্রত্যেকে সামান্য আলাদাভাবে একই button আবার বানানোর বদলে।</p>'),
      img('docs/img/figma/assets-panel-libraries', 'Figma-র Assets panel, একটা local component সহ "Created in this file" দেখাচ্ছে, আর "UI kits" দুটো publish করা team library তালিকাভুক্ত করছে — 173 component সহ একটা iOS আর iPadOS 27 UI Kit, আর একটা Material 3 Design Kit', 1568, 671, 'Assets panel — এই file-এর নিজের component-এর পাশাপাশি, যেকোনো design-এ সরাসরি টেনে আনার জন্য উপলব্ধ আসল publish করা library (iOS/iPadOS, Material 3)।'),
      h(2, 'একটা Library Publish করা', 'একটা-library-publish-করা'),
      p('<p>যেকোনো file-এর Component, Color style, আর Effect style file মেনু থেকে <b>Library হিসেবে publish</b> করা যায়, যা team-এর access আছে এমন অন্য প্রতিটা file-এর জন্য এগুলো উপলব্ধ করে দেয় — সম্পূর্ণ ভিন্ন একটা file-এ কাজ করা একজন designer ঠিক একই Button component খুঁজে টেনে আনতে পারে, একই উৎস হওয়ায় হুবহু একরকম নিশ্চিত।</p>'),
      h(2, 'Assets Panel', 'assets-panel'),
      p('<p>Assets panel (বাম sidebar) হলো যেখানে প্রতিটা উপলব্ধ Component থাকে — একটা file-এর নিজের Component ("Created in this file") আর publish করা team library বা public UI kit থেকে টেনে আনা যেকোনো কিছু, দুটোই। নাম দিয়ে search করুন, বা category অনুযায়ী browse করুন, আর একটা ফলাফল সরাসরি canvas-এ টেনে আনুন একটা নতুন Instance হিসেবে।</p>'),
      h(2, 'একটা বিদ্যমান UI Kit ব্যবহার করা', 'একটা-বিদ্যমান-ui-kit-ব্যবহার-করা'),
      p('<p>প্রধান platform-গুলোর জন্য পূর্ণ UI kit — Apple-এর iOS/iPadOS kit, Google-এর Material Design kit — অবাধে উপলব্ধ আর ক্রমাগত একটা শুরুর বিন্দু হিসেবে ব্যবহৃত হয়: প্রতিটা standard control-এর জন্য আসল, on-platform Component (button, switch, tab bar, navigation প্যাটার্ন), তাই একটা প্রজেক্ট এমন কিছু থেকে শুরু হয় যা ইতিমধ্যে native মনে হয়, খালি canvas থেকে প্রতিটা basic control বানানোর বদলে।</p>'),
      h(2, 'কখন Custom System বানাবেন বনাম Kit ব্যবহার করবেন', 'কখন-custom-system-বানাবেন-বনাম-kit-ব্যবহার-করবেন'),
      p('<p>একটা public kit (iOS, Material) prototyping-এর জন্য আর যে app-গুলো তাদের platform-এ native মনে হওয়া উচিত তার জন্য দ্রুত শুরুর বিন্দু। একটা custom design system — এই কোর্সের নিজের technique দিয়ে বানানো — যা একটা নিজস্ব brand identity সহ আসল product-এর শেষ পর্যন্ত দরকার, কারণ একটা public kit-এর component অন্য কারো visual language বহন করে, একটা কোম্পানির নিজের না।</p>'),
      callout('note', '<p>এই কোর্স জুড়ে বানানো এই পুরো reference file নিজেই একটা ছোট design system — নাম-দেওয়া variant সহ একটা Button component set, একটা documented type scale, আর পুনরায়-ব্যবহারযোগ্য Color/Effect style। যেকোনো size-এ mechanics বদলায় না।</p>', 'এই কোর্স যা তৈরি করার দিকে এগিয়েছে'),
    ],
  },
})

lessons.push({
  slug: 'putting-it-together-a-real-project', sortOrder: n++,
  en: {
    title: 'Putting It Together: A Small Real Project',
    metaTitle: 'Putting It Together: A Small Real Project | Learn Computer Academy',
    metaDescription: 'A recap project plan tying every lesson in this course together — frames, components, styles, layout, and prototyping — into one real deliverable.',
    blocks: [
      p('<p>Every tool in this course is more useful combined than alone. This closing lesson is a project plan, not a new tool — a suggested order to practice everything covered, on one small real deliverable, exactly the way a real freelance or junior design task would actually unfold.</p>'),
      h(2, 'The Brief'),
      p('<p>Design a 3-screen flow for a simple habit-tracking app: a sign-in screen, a home screen listing today\'s habits, and a "habit added" confirmation. Small enough to finish, real enough to touch every skill in this course.</p>'),
      h(2, 'Suggested Order'),
      table(['Step', 'What it uses'], [
        ['1. Set up the file', '3 device-preset Frames (Frames & Presets)'],
        ['2. Build a type scale and 2-3 Color styles', 'Text & Type Scale, Color and Effect Styles'],
        ['3. Build a Button component set', 'Components and Variants — Default/Disabled at minimum'],
        ['4. Lay out the sign-in screen', 'Designing a Mobile App Screen'],
        ['5. Lay out the home screen with Auto Layout rows', 'Auto Layout, for the scrolling habit list'],
        ['6. Wire the 3 screens together', 'Prototyping — sign-in → home → confirmation'],
        ['7. Add one Smart Animate moment', 'e.g. a habit card growing when checked off'],
      ]),
      h(2, 'What "Done" Looks Like'),
      p('<p>Not pixel-perfect — a working prototype that plays start to finish in Figma\'s preview, built from named, reusable pieces rather than one-off shapes on each screen. That last part is the real skill this course has been building: the same button, the same color, the same spacing value, defined once and used everywhere.</p>'),
      h(2, 'Where to Go From Here'),
      p('<p>Real fluency in Figma comes from repetition on real briefs, not more tutorials. Pick a real app or website already on a phone or a bookmark bar and try rebuilding one screen of it from scratch — matching an existing design is one of the fastest ways to notice details a from-scratch design lets you skip past.</p>'),
    ],
  },
  bn: {
    title: 'সবকিছু একসাথে: একটা ছোট আসল প্রজেক্ট',
    metaTitle: 'সবকিছু একসাথে: একটা ছোট আসল প্রজেক্ট | Learn Computer Academy',
    metaDescription: 'এই কোর্সের প্রতিটা lesson-কে একসাথে জোড়া দেওয়া একটা recap প্রজেক্ট পরিকল্পনা — frame, component, style, layout, আর prototyping — একটা আসল deliverable-এ।',
    blocks: [
      p('<p>এই কোর্সের প্রতিটা টুল একা থাকার চেয়ে একসাথে বেশি useful। এই শেষ lesson একটা প্রজেক্ট পরিকল্পনা, নতুন কোনো টুল না — কভার করা সবকিছু অনুশীলন করার একটা পরামর্শকৃত ক্রম, একটা ছোট আসল deliverable-এ, ঠিক যেভাবে একটা আসল freelance বা junior design কাজ আসলে চলে।</p>'),
      h(2, 'ব্রিফ', 'ব্রিফ'),
      p('<p>একটা সাধারণ habit-tracking app-এর জন্য একটা 3-screen flow ডিজাইন করুন: একটা sign-in screen, আজকের habit তালিকাভুক্ত করা একটা home screen, আর একটা "habit added" confirmation। শেষ করার মতো ছোট, এই কোর্সের প্রতিটা দক্ষতা স্পর্শ করার মতো বাস্তব।</p>'),
      h(2, 'পরামর্শকৃত ক্রম', 'পরামর্শকৃত-ক্রম'),
      table(['ধাপ', 'এটা কী ব্যবহার করে'], [
        ['১. File সেট আপ করা', '৩টা device-preset Frame (Frames & Presets)'],
        ['২. একটা type scale আর ২-৩টা Color style বানানো', 'Text & Type Scale, Color and Effect Styles'],
        ['৩. একটা Button component set বানানো', 'Components and Variants — অন্তত Default/Disabled'],
        ['৪. sign-in screen সাজানো', 'Designing a Mobile App Screen'],
        ['৫. Auto Layout row দিয়ে home screen সাজানো', 'Auto Layout, scroll হওয়া habit তালিকার জন্য'],
        ['৬. ৩টা screen জোড়া লাগানো', 'Prototyping — sign-in → home → confirmation'],
        ['৭. একটা Smart Animate মুহূর্ত যোগ করা', 'যেমন check করলে একটা habit card বড় হয়ে যাওয়া'],
      ]),
      h(2, '"শেষ" দেখতে কেমন', 'শেষ-দেখতে-কেমন'),
      p('<p>pixel-perfect না — Figma-র preview-তে শুরু থেকে শেষ পর্যন্ত চলা একটা কার্যকরী prototype, প্রতিটা screen-এ এককালীন shape-এর বদলে নাম-দেওয়া, পুনরায়-ব্যবহারযোগ্য অংশ দিয়ে বানানো। শেষ অংশটাই এই কোর্স যে আসল দক্ষতা তৈরি করে আসছে: একই button, একই color, একই spacing value, একবার সংজ্ঞায়িত আর সব জায়গায় ব্যবহৃত।</p>'),
      h(2, 'এখান থেকে কোথায় যাবেন', 'এখান-থেকে-কোথায়-যাবেন'),
      p('<p>Figma-তে আসল দক্ষতা আসে আসল ব্রিফে পুনরাবৃত্তি থেকে, আরো tutorial থেকে না। ফোনে বা bookmark bar-এ ইতিমধ্যে থাকা একটা আসল app বা website বেছে নিন আর এর একটা screen শুরু থেকে আবার বানানোর চেষ্টা করুন — একটা বিদ্যমান design-এর সাথে মেলানো এমন সব detail লক্ষ্য করার সবচেয়ে দ্রুত উপায়গুলোর একটা, যা শুরু-থেকে করা একটা design আপনাকে এড়িয়ে যেতে দেয়।</p>'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'figma').single()
  if (catErr || !category) {
    console.error('Category "figma" not found — run scripts/create-figma-category.mjs first.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] figma/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] figma/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `figma/${lesson.slug}`
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
