#!/usr/bin/env node
// New "Canva" lesson under Graphic Design (design/canva) — user request
// 2026-09-02, last topic in the category (sort_order 18, after the
// existing 17). Screenshots are real Canva UI, captured live via
// claude-in-chrome (user is logged in) rather than generated — per the
// user's explicit instruction, no magnific/AI-generated mockups here.
// Only public-facing UI was captured (template gallery, a template opened
// fresh from the gallery, empty Brand Kit) — never the user's own private
// project thumbnails from their dashboard.
//
// Idempotent — upserts on `path` / `doc_id,locale`, same pattern as
// create-hosting-content.mjs. Images upload once (skipped on a re-run if
// already present under the same public_id, Cloudinary overwrite:true is
// harmless either way).
//
// Usage: node scripts/create-canva-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import { nanoid } from 'nanoid'

const ROOT = path.resolve(import.meta.dirname, '..')
const IMG_DIR = path.join(ROOT, '.extra-images/design')
const DRY_RUN = process.argv.includes('--dry-run')

const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
cloudinary.config({ cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET })

// ── Block builders (same shape as create-hosting-content.mjs) ──────────
function h(level, text, anchor) {
  const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor: a }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function img(publicId, alt, dims, caption) { return { id: nanoid(12), type: 'image', publicId, alt, width: dims.width, height: dims.height, caption } }
function toc(blocks) { return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level })) }

function cloudinaryUploadBuffer(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ public_id: publicId, resource_type: 'image', overwrite: true }, (err, res) => err ? reject(err) : resolve(res))
    stream.end(buffer)
  })
}

async function convertAndUpload(slug) {
  const inputPath = path.join(IMG_DIR, `${slug}.jpg`)
  const publicId = `docs/img/design/${slug}`
  const buffer = await sharp(inputPath).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
  const { width, height } = await sharp(buffer).metadata()
  if (!DRY_RUN) await cloudinaryUploadBuffer(buffer, publicId)
  return { publicId, width, height }
}

async function main() {
  const screenshotSlugs = ['canva-templates', 'canva-editor', 'canva-elements', 'canva-magic-studio', 'canva-brand-kit', 'canva-export']
  const images = {}
  for (const slug of screenshotSlugs) {
    process.stdout.write(`↑ ${slug}...`)
    images[slug] = await convertAndUpload(slug)
    console.log(` ${images[slug].width}x${images[slug].height}`)
  }

  const lesson = {
    slug: 'canva',
    sortOrder: 18,
    en: {
      title: 'Canva',
      metaTitle: 'Canva — Design in the Browser | Learn Computer Academy',
      metaDescription: 'An introduction to Canva: the browser-based design tool for templates, social graphics, presentations and print, no software install or design background required.',
      blocks: [
        p('<p>Every design tool covered so far — Photoshop, Figma — asks you to learn a real craft before you can produce something usable. <b>Canva</b> takes a different approach: it is a browser-based design tool built around templates rather than a blank canvas, so a usable result is minutes away, not weeks. It will not replace Photoshop for serious photo retouching or Figma for a real product-design workflow, but for the fast, everyday graphics most people and small businesses actually need, it is often the right tool for the job.</p>'),

        h(2, 'What Is Canva?'),
        p('<p>Canva is a web app — nothing to install, it runs in any browser and saves your work automatically. It is built around <b>templates</b>: instead of starting from an empty page, you start from a design someone else already made and swap in your own text, photos, and colors. It has a genuinely usable free plan (not just a trial), which is why it is so common among students, small businesses, social media managers, and freelancers who need to produce graphics quickly without a design background.</p>'),

        h(2, 'Getting Started — Templates'),
        p('<p>Canva organizes templates by what you are making — a Presentation, Poster, Instagram Post, CV, Logo, and hundreds more — each with its own correct starting size. Browsing shows real templates from Canva\'s own designers and community; opening one and choosing <b>"Customise this template"</b> makes an editable copy of it that belongs to you, ready to change.</p>'),
        img(images['canva-templates'].publicId, 'The Canva template gallery, showing categories like Presentation, Poster, CV, Instagram Post, and a row of real starting templates to browse and customize', images['canva-templates'], 'Templates are organized by what you\'re making — pick a category, then a starting point.'),

        h(2, 'The Canva Editor'),
        p('<p>Opening a design lands you in the editor: a left sidebar for adding content (Templates, Elements, Text, Brand, Canva AI, Uploads), the canvas in the center where the actual design lives, a toolbar above it for formatting whatever is selected, and — for multi-page designs like presentations — a strip of page thumbnails along the bottom you can reorder or duplicate.</p>'),
        img(images['canva-editor'].publicId, 'The Canva editor interface — left sidebar with Templates, Elements, Text, Brand, Canva AI, and Uploads; the design canvas in the center; a row of page thumbnails along the bottom', images['canva-editor'], 'The editor: sidebar on the left, canvas in the center, pages along the bottom.'),

        h(2, 'Elements — Building a Design'),
        p('<p>The <b>Elements</b> panel is where most of a design actually comes from: shapes, stock photos, icons, illustrations, videos, audio, charts, and 3D objects, all searchable and almost all draggable straight onto the canvas. A design is built the same way regardless of what it is — search for what you need, drag it in, resize and reposition it, repeat.</p>'),
        img(images['canva-elements'].publicId, 'The Canva Elements panel, showing a search bar and browsable categories — Shapes, Graphics, Photos, Videos, 3D, Forms, Animations, Audio', images['canva-elements'], 'Elements: the panel most of a design is actually built from.'),

        h(2, "Magic Studio — Canva's AI Tools"),
        p('<p>Canva bundles a set of AI features under the name <b>Magic Studio</b>, reachable from the Canva AI tab. On a selected design it can suggest a full redesign, generate a new background, or change the overall visual style from a short description — useful for getting past a blank-page moment or trying a variation quickly, though (like any AI output on this site\'s <a href="/ai/ai-ethics-and-bias/">AI Ethics &amp; Bias</a> lesson covers) it is a starting point to review and adjust, not a finished result to publish blindly.</p>'),
        img(images['canva-magic-studio'].publicId, 'The Canva AI (Magic Studio) panel, showing "Redesign this page," "Add background," and "Change style" options plus a text box to describe an idea', images['canva-magic-studio'], "Magic Studio's AI tools, open on a selected design."),

        h(2, 'Brand Kit — Staying On-Brand'),
        p('<p>A <b>Brand Kit</b> stores a project or client\'s colors, fonts, and logo in one place, so every new design can reuse them with a click instead of re-picking a hex code every time. This matters most the moment you are making more than one design for the same brand — exactly the situation a freelancer doing repeat work for one client, or a small business posting regularly, ends up in.</p>'),
        img(images['canva-brand-kit'].publicId, 'An empty Canva Brand Kit panel, showing sections for Logos, Colours, Fonts, Brand voice, Photos, and other reusable brand assets', images['canva-brand-kit'], 'A Brand Kit — set colors, fonts, and a logo once, reuse them everywhere.'),

        h(2, 'Exporting Your Design'),
        p('<p>Download supports the common file types — <b>PNG</b> and <b>JPG</b> for images, <b>PDF</b> for documents and print, <b>MP4</b> for video and animated designs — with a Digital-vs-Print preset that adjusts things like color profile and bleed automatically, and, for PDFs, an optional compress step and a choice of exporting every page or just the ones you need.</p>'),
        img(images['canva-export'].publicId, 'The Canva Download panel, showing a file-type selector set to PDF, a Digital/Print preset toggle, compression and page-selection options, and a Download button', images['canva-export'], 'Downloading: pick a file type, a Digital or Print preset, then export.'),

        h(2, 'Sharing and Collaboration'),
        p('<p>The <b>Share</b> panel generates a link with a chosen access level — view-only, comment, or full edit access — so a design can be reviewed or co-edited without exporting a file back and forth by email. Multiple people can be in the same design at the same time, seeing each other\'s cursors and edits live, which is the same shape of collaboration a real design team (or a freelancer and their client) actually needs during revisions.</p>'),

        h(2, 'Canva Free vs Canva Pro'),
        table(
          ['Feature', 'Free', 'Pro'],
          [
            ['Templates and elements', 'A large free library', 'The full library, including premium-only templates and elements'],
            ['Background remover', 'Not included', 'One-click background removal on any photo'],
            ['Brand Kit', 'One basic kit', 'Multiple kits — useful for agencies with several clients'],
            ['Magic Studio AI tools', 'A limited number of free credits', 'A much larger monthly credit allowance'],
            ['Resizing a finished design (Magic Switch)', 'Not included', 'Resize one design into every format it needs at once'],
            ['Cloud storage', 'A modest free allowance', 'Substantially more'],
            ['Price', '$0, permanently', 'A recurring paid plan, billed monthly or yearly'],
          ]
        ),
        p("<p>The free plan is genuinely usable long-term, not a time-limited trial — most individual and student use never needs to upgrade. Pro earns its cost once a Brand Kit, unlimited background removal, or the Magic Switch resize tool would save real, repeated time — a calculation that usually only makes sense for freelancers and small teams producing design work regularly, not for one-off projects.</p>"),

        h(2, 'Canva vs Photoshop vs Figma'),
        p('<p>All three are design tools already covered on this site, but they solve different problems, and knowing which one to reach for matters more than mastering all three equally.</p>'),
        table(
          ['Tool', 'Best for', 'Learning curve'],
          [
            ['Canva', 'Fast, templated graphics — social posts, presentations, flyers, basic print', 'Low — usable in your first session'],
            ['Photoshop', 'Pixel-level photo editing and retouching, raster compositing', 'Steep — a real craft, covered in its own category on this site'],
            ['Figma', 'Designing and prototyping digital products — apps and websites, with real component systems', 'Moderate — also its own category on this site'],
          ]
        ),
        p('<p>A useful rule of thumb: reach for Canva when the goal is a finished graphic, quickly. Reach for Photoshop when a photograph itself needs real editing. Reach for Figma when the output is a digital product interface, not a static image.</p>'),

        h(2, 'Using Canva for Freelance and Client Work'),
        p('<p>Canva shows up constantly in real freelance work covered in the <a href="/freelancing/">Freelancing &amp; Client Work</a> category: quick-turnaround social media graphics, a client\'s first logo and Brand Kit, simple flyers and menus, presentation decks — all jobs where a client\'s budget or timeline does not justify a full Photoshop or Figma project. A Canva Brand Kit built once for a client, then reused across every graphic delivered afterward, is a small habit that visibly raises the perceived professionalism of the work.</p>'),
        callout('tip', "<p>Building a small Canva portfolio — a few social posts, a flyer, a simple logo and Brand Kit for a fictional business — is a fast, low-effort addition to the kind of portfolio the <a href=\"/career/what-counts-as-a-portfolio-project/\">What Counts as a Portfolio Project</a> lesson describes, especially for anyone leaning toward freelance design work rather than a dev-only path.</p>", 'A quick portfolio win'),
      ],
    },
    bn: {
      title: 'Canva',
      metaTitle: 'Canva — ব্রাউজারে ডিজাইন | Learn Computer Academy',
      metaDescription: 'Canva পরিচিতি: টেমপ্লেট, সোশ্যাল গ্রাফিক্স, প্রেজেন্টেশন আর প্রিন্টের জন্য ব্রাউজার-ভিত্তিক ডিজাইন টুল, কোনো সফটওয়্যার ইনস্টল বা ডিজাইন ব্যাকগ্রাউন্ড ছাড়াই।',
      blocks: [
        p('<p>এখন পর্যন্ত কভার করা প্রতিটি ডিজাইন টুল — Photoshop, Figma — কিছু ব্যবহারযোগ্য তৈরি করার আগে একটা আসল craft শিখতে বলে। <b>Canva</b> একটা ভিন্ন পদ্ধতি নেয়: এটা একটা ব্রাউজার-ভিত্তিক ডিজাইন টুল, খালি canvas না, টেমপ্লেটের উপর তৈরি — তাই একটা ব্যবহারযোগ্য ফলাফল কয়েক সপ্তাহ না, কয়েক মিনিটের ব্যাপার। এটা গুরুত্বপূর্ণ ছবি সম্পাদনার জন্য Photoshop-কে, বা একটা আসল product-design workflow-এর জন্য Figma-কে প্রতিস্থাপন করবে না, কিন্তু বেশিরভাগ মানুষ আর ছোট ব্যবসার আসলে যে দ্রুত, রোজকার graphic দরকার হয়, তার জন্য এটাই প্রায়ই সঠিক টুল।</p>'),

        h(2, 'Canva আসলে কী?', 'canva-আসলে-কী'),
        p('<p>Canva একটা web app — ইনস্টল করার কিছু নেই, যেকোনো ব্রাউজারে চলে, আর কাজ স্বয়ংক্রিয়ভাবে সেভ হয়। এটা <b>টেমপ্লেটের</b> উপর তৈরি: একটা খালি পাতা থেকে শুরু করার বদলে, আপনি অন্য কারো আগে থেকে বানানো একটা ডিজাইন থেকে শুরু করেন আর নিজের টেক্সট, ছবি, আর রং বসিয়ে দেন। এর একটা সত্যিকারের ব্যবহারযোগ্য free plan আছে (শুধু trial না), যে কারণে শিক্ষার্থী, ছোট ব্যবসা, সোশ্যাল মিডিয়া ম্যানেজার, আর ফ্রিল্যান্সারদের মধ্যে এটা এত সাধারণ, যাদের কোনো ডিজাইন ব্যাকগ্রাউন্ড ছাড়াই দ্রুত graphic তৈরি করা দরকার।</p>'),

        h(2, 'শুরু করা — টেমপ্লেট', 'শুরু-করা-টেমপ্লেট'),
        p('<p>Canva টেমপ্লেটগুলোকে সাজায় আপনি কী বানাচ্ছেন তা অনুযায়ী — একটা Presentation, Poster, Instagram Post, CV, Logo, আর আরও শত শত — প্রতিটির নিজস্ব সঠিক শুরুর size সহ। Browse করলে Canva-এর নিজস্ব ডিজাইনার আর community-র আসল টেমপ্লেট দেখা যায়; একটা খুলে <b>"Customise this template"</b> বেছে নিলে সেটার একটা editable কপি তৈরি হয় যা আপনার নিজের, পরিবর্তনের জন্য প্রস্তুত।</p>'),
        img(images['canva-templates'].publicId, 'Canva টেমপ্লেট গ্যালারি, Presentation, Poster, CV, Instagram Post-এর মতো ক্যাটাগরি আর browse আর customize করার জন্য একসারি আসল শুরুর টেমপ্লেট দেখাচ্ছে', images['canva-templates'], 'টেমপ্লেট সাজানো আপনি কী বানাচ্ছেন তা অনুযায়ী — একটা ক্যাটাগরি বাছুন, তারপর একটা শুরুর পয়েন্ট।'),

        h(2, 'Canva এডিটর', 'canva-এডিটর'),
        p('<p>একটা ডিজাইন খুললে আপনি এডিটরে পৌঁছান: content যোগ করার জন্য একটা বাম sidebar (Templates, Elements, Text, Brand, Canva AI, Uploads), মাঝখানে canvas যেখানে আসল ডিজাইন থাকে, যা select করা আছে তা format করার জন্য উপরে একটা toolbar, আর — presentation-এর মতো multi-page ডিজাইনের জন্য — নিচে page thumbnail-এর একটা সারি যা reorder বা duplicate করা যায়।</p>'),
        img(images['canva-editor'].publicId, 'Canva এডিটর ইন্টারফেস — বাম sidebar-এ Templates, Elements, Text, Brand, Canva AI, আর Uploads; মাঝখানে ডিজাইন canvas; নিচে page thumbnail-এর একটা সারি', images['canva-editor'], 'এডিটর: বামে sidebar, মাঝখানে canvas, নিচে page।'),

        h(2, 'Elements — একটা ডিজাইন তৈরি করা', 'elements-একটা-ডিজাইন-তৈরি-করা'),
        p('<p><b>Elements</b> panel থেকেই একটা ডিজাইনের বেশিরভাগ অংশ আসলে আসে: shape, stock photo, icon, illustration, video, audio, chart, আর 3D object, সবই searchable আর প্রায় সবই সরাসরি canvas-এ drag করা যায়। যা কিছুই হোক, একটা ডিজাইন একইভাবে তৈরি হয় — যা দরকার তা search করুন, drag করে আনুন, resize আর reposition করুন, আবার করুন।</p>'),
        img(images['canva-elements'].publicId, 'Canva Elements panel, একটা search bar আর browse করার মতো ক্যাটাগরি দেখাচ্ছে — Shapes, Graphics, Photos, Videos, 3D, Forms, Animations, Audio', images['canva-elements'], 'Elements: যে panel থেকে একটা ডিজাইনের বেশিরভাগ অংশ আসলে তৈরি হয়।'),

        h(2, 'Magic Studio — Canva-এর AI টুল', 'magic-studio-canva-এর-ai-টুল'),
        p('<p>Canva Canva AI ট্যাব থেকে পৌঁছানো যায় এমন একগুচ্ছ AI ফিচার বান্ডেল করেছে <b>Magic Studio</b> নামে। একটা selected ডিজাইনে এটা একটা সম্পূর্ণ redesign suggest করতে, একটা নতুন background তৈরি করতে, বা একটা ছোট বিবরণ থেকে সামগ্রিক visual style বদলাতে পারে — একটা blank-page মুহূর্ত পার হতে বা দ্রুত একটা variation চেষ্টা করতে দরকারি, যদিও (এই সাইটের <a href="/bn/ai/ai-ethics-and-bias/">AI Ethics &amp; Bias</a> পাঠ যেমন কভার করে) এটা review আর adjust করার একটা শুরুর পয়েন্ট, চোখ বন্ধ করে publish করার মতো একটা শেষ ফলাফল না।</p>'),
        img(images['canva-magic-studio'].publicId, 'Canva AI (Magic Studio) panel, "Redesign this page," "Add background," আর "Change style" অপশন সহ একটা selected ডিজাইনে খোলা, আর একটা idea বর্ণনা করার text box', images['canva-magic-studio'], 'Magic Studio-এর AI টুল, একটা selected ডিজাইনে খোলা।'),

        h(2, 'Brand Kit — On-Brand থাকা', 'brand-kit-on-brand-থাকা'),
        p('<p>একটা <b>Brand Kit</b> একটা প্রজেক্ট বা ক্লায়েন্টের রং, font, আর logo এক জায়গায় জমা রাখে, তাই প্রতিটি নতুন ডিজাইন প্রতিবার একটা hex code আবার বেছে নেওয়ার বদলে এক ক্লিকে সেগুলো পুনরায় ব্যবহার করতে পারে। এটা সবচেয়ে বেশি গুরুত্বপূর্ণ হয়ে ওঠে যখনই আপনি একই brand-এর জন্য একাধিক ডিজাইন বানাচ্ছেন — ঠিক যে পরিস্থিতিতে একজন ফ্রিল্যান্সার এক ক্লায়েন্টের জন্য বারবার কাজ করে, বা একটা ছোট ব্যবসা নিয়মিত post করে, শেষমেশ পড়ে।</p>'),
        img(images['canva-brand-kit'].publicId, 'একটা খালি Canva Brand Kit panel, Logos, Colours, Fonts, Brand voice, Photos, আর অন্যান্য পুনরায় ব্যবহারযোগ্য brand asset-এর জন্য section দেখাচ্ছে', images['canva-brand-kit'], 'একটা Brand Kit — রং, font, আর একটা logo একবার সেট করুন, সব জায়গায় পুনরায় ব্যবহার করুন।'),

        h(2, 'আপনার ডিজাইন Export করা', 'আপনার-ডিজাইন-export-করা'),
        p('<p>Download সাধারণ file type সমর্থন করে — ছবির জন্য <b>PNG</b> আর <b>JPG</b>, document আর print-এর জন্য <b>PDF</b>, video আর animated ডিজাইনের জন্য <b>MP4</b> — একটা Digital-বনাম-Print preset সহ যা color profile আর bleed-এর মতো জিনিস স্বয়ংক্রিয়ভাবে সমন্বয় করে, আর, PDF-এর জন্য, একটা ঐচ্ছিক compress ধাপ আর প্রতিটি page বা শুধু দরকারিগুলো export করার একটা choice।</p>'),
        img(images['canva-export'].publicId, 'Canva Download panel, PDF-এ সেট করা একটা file-type selector, একটা Digital/Print preset toggle, compression আর page-selection অপশন, আর একটা Download button দেখাচ্ছে', images['canva-export'], 'Download করা: একটা file type বাছুন, একটা Digital বা Print preset, তারপর export করুন।'),

        h(2, 'Share করা আর সহযোগিতা', 'share-করা-আর-সহযোগিতা'),
        p('<p><b>Share</b> panel একটা বাছাই করা access level সহ একটা link তৈরি করে — view-only, comment, বা full edit access — তাই একটা ডিজাইন ইমেইলে বারবার file পাঠানো ছাড়াই review বা co-edit করা যায়। একাধিক মানুষ একই সময়ে একই ডিজাইনে থাকতে পারে, একে অপরের cursor আর edit live দেখতে পারে, যা ঠিক একই ধরনের সহযোগিতা যা একটা আসল design team (বা একজন ফ্রিল্যান্সার আর তার ক্লায়েন্ট) revision-এর সময় আসলে দরকার হয়।</p>'),

        h(2, 'Canva Free বনাম Canva Pro', 'canva-free-বনাম-canva-pro'),
        table(
          ['ফিচার', 'Free', 'Pro'],
          [
            ['টেমপ্লেট আর element', 'একটা বড় free library', 'সম্পূর্ণ library, premium-only টেমপ্লেট আর element সহ'],
            ['Background remover', 'অন্তর্ভুক্ত না', 'যেকোনো ছবিতে এক-ক্লিকে background remove'],
            ['Brand Kit', 'একটা basic kit', 'একাধিক kit — কয়েকটা ক্লায়েন্ট সহ agency-র জন্য দরকারি'],
            ['Magic Studio AI টুল', 'সীমিত সংখ্যক free credit', 'অনেক বড় মাসিক credit allowance'],
            ['একটা শেষ হওয়া ডিজাইন resize করা (Magic Switch)', 'অন্তর্ভুক্ত না', 'একবারে একটা ডিজাইনকে দরকারি প্রতিটি format-এ resize করুন'],
            ['Cloud storage', 'একটা মাঝারি free allowance', 'যথেষ্ট বেশি'],
            ['দাম', '$0, স্থায়ীভাবে', 'একটা পুনরাবৃত্ত paid plan, মাসিক বা বার্ষিক billed'],
          ]
        ),
        p('<p>Free plan সত্যিকারের দীর্ঘমেয়াদে ব্যবহারযোগ্য, সময়-সীমাবদ্ধ trial না — বেশিরভাগ individual আর শিক্ষার্থী ব্যবহারের কখনো upgrade দরকার হয় না। Pro তার খরচ তখনই উপযুক্ত করে যখন একটা Brand Kit, unlimited background removal, বা Magic Switch resize টুল আসল, বারবারের সময় বাঁচাবে — এমন একটা হিসাব যা সাধারণত শুধু নিয়মিত ডিজাইন কাজ করা ফ্রিল্যান্সার আর ছোট team-এর জন্যই যুক্তিসঙ্গত, এক-বারের প্রজেক্টের জন্য না।</p>'),

        h(2, 'Canva বনাম Photoshop বনাম Figma', 'canva-বনাম-photoshop-বনাম-figma'),
        p('<p>তিনটাই এই সাইটে আগে থেকে কভার করা ডিজাইন টুল, কিন্তু এগুলো ভিন্ন সমস্যা সমাধান করে, আর কোনটা কখন ব্যবহার করতে হবে তা জানা তিনটাতেই সমানভাবে দক্ষ হওয়ার চেয়ে বেশি গুরুত্বপূর্ণ।</p>'),
        table(
          ['টুল', 'সবচেয়ে ভালো যার জন্য', 'শেখার curve'],
          [
            ['Canva', 'দ্রুত, টেমপ্লেট-ভিত্তিক graphic — সোশ্যাল post, presentation, flyer, basic print', 'কম — আপনার প্রথম session-এই ব্যবহারযোগ্য'],
            ['Photoshop', 'Pixel-level ছবি সম্পাদনা আর retouching, raster compositing', 'খাড়া — একটা আসল craft, এই সাইটে নিজস্ব category-তে কভার করা'],
            ['Figma', 'ডিজিটাল product ডিজাইন আর prototype করা — app আর website, আসল component system সহ', 'মাঝারি — এই সাইটেও নিজস্ব category'],
          ]
        ),
        p('<p>একটা দরকারি rule of thumb: দ্রুত একটা শেষ হওয়া graphic-ই লক্ষ্য হলে Canva ব্যবহার করুন। একটা ছবি নিজেই আসল সম্পাদনা দরকার হলে Photoshop ব্যবহার করুন। ফলাফল একটা static ছবি না, একটা ডিজিটাল product interface হলে Figma ব্যবহার করুন।</p>'),

        h(2, 'ফ্রিল্যান্স আর ক্লায়েন্ট কাজের জন্য Canva ব্যবহার করা', 'ফ্রিল্যান্স-আর-ক্লায়েন্ট-কাজের-জন্য-canva-ব্যবহার-করা'),
        p('<p><a href="/bn/freelancing/">Freelancing &amp; Client Work</a> category-তে কভার করা আসল ফ্রিল্যান্স কাজে Canva নিয়মিত দেখা যায়: দ্রুত-turnaround সোশ্যাল মিডিয়া graphic, একটা ক্লায়েন্টের প্রথম logo আর Brand Kit, সাধারণ flyer আর menu, presentation deck — সব কাজ যেখানে একটা ক্লায়েন্টের budget বা timeline একটা সম্পূর্ণ Photoshop বা Figma প্রজেক্টকে ন্যায্যতা দেয় না। একটা ক্লায়েন্টের জন্য একবার বানানো একটা Canva Brand Kit, তারপর পরের প্রতিটি ডিজাইনে পুনরায় ব্যবহার করা, একটা ছোট অভ্যাস যা কাজের perceived professionalism দৃশ্যমানভাবে বাড়ায়।</p>'),
        callout('tip', '<p>একটা ছোট Canva portfolio বানানো — কয়েকটা সোশ্যাল post, একটা flyer, একটা কাল্পনিক ব্যবসার জন্য একটা সাধারণ logo আর Brand Kit — <a href="/bn/career/what-counts-as-a-portfolio-project/">What Counts as a Portfolio Project</a> পাঠে বর্ণিত ধরনের portfolio-তে একটা দ্রুত, কম-effort সংযোজন, বিশেষত যে কেউ dev-only পথের বদলে ফ্রিল্যান্স ডিজাইন কাজের দিকে ঝুঁকছে তার জন্য।</p>', 'একটা দ্রুত portfolio জয়'),
      ],
    },
  }

  console.log(`\n[design/canva] ${lesson.en.blocks.length} en blocks, ${lesson.bn.blocks.length} bn blocks, sort_order ${lesson.sortOrder}`)

  if (DRY_RUN) {
    console.log('\n[dry-run] no DB writes made.')
    return
  }

  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'design').single()
  if (catErr || !category) { console.error('Category "design" not found.'); process.exit(1) }

  const docPath = `design/${lesson.slug}`
  const row = {
    category_id: category.id,
    slug: lesson.slug,
    path: docPath,
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

  const { data: existingDoc } = await supabase.from('docs').select('id').eq('path', docPath).maybeSingle()
  let docId = existingDoc?.id
  if (existingDoc) {
    const { error } = await supabase.from('docs').update(row).eq('id', existingDoc.id)
    if (error) { console.error('FAIL docs update:', error.message); process.exit(1) }
  } else {
    const { data: inserted, error } = await supabase.from('docs').insert(row).select('id').single()
    if (error) { console.error('FAIL docs insert:', error.message); process.exit(1) }
    docId = inserted.id
  }

  const trRow = {
    doc_id: docId,
    locale: 'bn',
    title: lesson.bn.title,
    meta_title: lesson.bn.metaTitle,
    meta_description: lesson.bn.metaDescription,
    blocks: lesson.bn.blocks,
    toc: toc(lesson.bn.blocks),
  }
  const { data: existingTr } = await supabase.from('doc_translations').select('id').eq('doc_id', docId).eq('locale', 'bn').maybeSingle()
  if (existingTr) {
    const { error } = await supabase.from('doc_translations').update(trRow).eq('id', existingTr.id)
    if (error) { console.error('FAIL translation update:', error.message); process.exit(1) }
  } else {
    const { error } = await supabase.from('doc_translations').insert(trRow)
    if (error) { console.error('FAIL translation insert:', error.message); process.exit(1) }
  }

  console.log(`OK ${docPath} (doc id ${docId})`)
}

main().catch(err => { console.error(err); process.exit(1) })
