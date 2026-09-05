#!/usr/bin/env node
// New "Google Workspace" lesson under Office Skills (office/google-workspace)
// — user request 2026-09-02, last topic in the category (sort_order 37,
// after "Free and Open-Source Alternatives"). Screenshots are real Google
// Workspace UI, captured live via claude-in-chrome (user is logged in).
// The Docs/Sheets/Slides screenshots are freshly created blank documents
// (no personal content to expose). The one Drive screenshot shows the
// user's real My Drive file list, so the entire Name column — the only
// column carrying personal/client filenames — is gaussian-blurred via
// sharp before upload; every other column (Owner, Date, File size) and
// the "Name" header label itself are left untouched. See
// scripts/tmp-blur*.mjs in PROGRESS.md session notes for how the region
// was picked; the blur is baked into the source file already
// (.extra-images/office/google-drive.jpg), this script just uploads it.
//
// Idempotent — upserts on `path` / `doc_id,locale`, same pattern as
// create-canva-content.mjs / create-hosting-content.mjs.
//
// Usage: node scripts/create-google-workspace-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import { nanoid } from 'nanoid'

const ROOT = path.resolve(import.meta.dirname, '..')
const IMG_DIR = path.join(ROOT, '.extra-images/office')
const DRY_RUN = process.argv.includes('--dry-run')

const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
cloudinary.config({ cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET })

function h(level, text, anchor) {
  const a = anchor ?? text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor: a }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }
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
  const publicId = `docs/img/office/${slug}`
  const buffer = await sharp(inputPath).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
  const { width, height } = await sharp(buffer).metadata()
  if (!DRY_RUN) await cloudinaryUploadBuffer(buffer, publicId)
  return { publicId, width, height }
}

async function main() {
  const screenshotSlugs = ['google-drive', 'google-docs', 'google-sheets', 'google-slides']
  const images = {}
  for (const slug of screenshotSlugs) {
    process.stdout.write(`↑ ${slug}...`)
    images[slug] = await convertAndUpload(slug)
    console.log(` ${images[slug].width}x${images[slug].height}`)
  }

  const lesson = {
    slug: 'google-workspace',
    sortOrder: 37,
    en: {
      title: 'Google Workspace',
      metaTitle: 'Google Workspace — Docs, Sheets, Slides, Drive | Learn Computer Academy',
      metaDescription: 'An introduction to Google Workspace: Docs, Sheets, Slides and Drive — free, browser-based, autosaving alternatives to Word, Excel, and PowerPoint, built for real-time collaboration.',
      blocks: [
        p("<p>Every Office lesson so far has covered Microsoft's desktop apps — Word, Excel, PowerPoint — installed software that saves files to your own computer. <b>Google Workspace</b> is the cloud-based alternative: <b>Docs</b>, <b>Sheets</b>, and <b>Slides</b> do the same core jobs as Word, Excel, and PowerPoint, but run entirely in a browser, save automatically to <b>Google Drive</b>, and are built from the ground up for several people editing the same file at once. For anyone without a paid Office license — which is most students and small businesses — it is also completely free.</p>"),

        h(2, 'What Is Google Workspace?'),
        p('<p>Google Workspace is Google\'s suite of productivity apps, tied to a Google account. Nothing installs on your computer — open a browser, sign in, and start working. The core apps map directly onto what the last few lessons already taught: <b>Docs</b> for documents, <b>Sheets</b> for spreadsheets, <b>Slides</b> for presentations, and <b>Drive</b> as the file storage everything lives in, replacing your computer\'s own folders for these files.</p>'),

        h(2, 'Google Drive — Where Everything Lives'),
        p('<p>Drive is cloud storage: every Doc, Sheet, and Slide you create is a file stored there, not on your hard drive, so it is reachable from any device you sign into. Files can be organized into folders exactly like a normal file system (covered in <a href="/basics/file-and-folder-basics/">File and Folder Basics</a>), and non-Google files — PDFs, images, ZIPs — can be uploaded and stored there too.</p>'),
        img(images['google-drive'].publicId, 'The Google Drive file list in list view, showing columns for Owner, Date modified, and File size — the Name column is intentionally blurred to protect real file and client names', images['google-drive'], "Drive's file list — the Name column here is blurred; yours will show real, readable file names."),

        h(2, 'Google Docs'),
        p('<p><b>Docs</b> is Google\'s word processor — the direct equivalent of everything covered in the Word lessons: typing and formatting text, paragraph styles, headers and footers, images, and tables. The toolbar and menu layout will look familiar coming from Word, with one addition worth knowing: <b>Gemini</b>, Google\'s AI assistant, is built into the editor for drafting or reworking text on request.</p>'),
        img(images['google-docs'].publicId, 'A blank Google Docs document, showing the menu bar, formatting toolbar, ruler, and an empty page with the cursor at the top', images['google-docs'], 'A new Google Doc — the toolbar and page layout will feel familiar from Word.'),

        h(2, 'Google Sheets'),
        p("<p><b>Sheets</b> is the spreadsheet app — rows, columns, and formulas work the same way they do in Excel, including <code>=B2*C2</code>-style cell references and functions like <code>SUM</code> and <code>IF</code>. A formula written in Sheets and one written in Excel are close enough that most of what the Excel lessons taught transfers directly.</p>"),
        img(images['google-sheets'].publicId, 'A Google Sheets spreadsheet with a small worked example — an Item, Price, Qty, and Total column, with the Total column calculated by a =B2*C2-style formula', images['google-sheets'], 'A simple formula in Sheets — the same =B2*C2 syntax Excel uses.'),

        h(2, 'Google Slides'),
        p('<p><b>Slides</b> is the presentation app, equivalent to PowerPoint — slides, layouts, themes, transitions, and speaker notes all work the same way conceptually. Like Docs, it opens on a blank slide with title and subtitle placeholders ready to click into.</p>'),
        img(images['google-slides'].publicId, 'A blank Google Slides presentation, showing a title slide layout with "Click to add title" and "Click to add subtitle" placeholder text, and the slide panel on the left', images['google-slides'], 'A new Slides presentation — a title slide layout, ready to edit.'),

        h(2, 'Real-Time Collaboration'),
        p('<p>This is the feature Google Workspace is actually built around, more than any single app: multiple people can open the same Doc, Sheet, or Slide at the same time, see each other\'s cursors, and watch edits appear live, with every change saved automatically as it happens. <b>Share</b> (top-right of every app) generates a link with a chosen access level — viewer, commenter, or editor — so a document can be reviewed or worked on together without ever emailing a file back and forth.</p>'),

        h(2, 'Offline Access and Autosave'),
        p('<p>There is no "Save" button, and none is needed — every keystroke is saved to Drive continuously, and Google Docs, Sheets, and Slides can each be made available offline (Google Drive settings → "Available offline"), syncing automatically once a connection returns. Version history (File → Version history) keeps every past state of a file, so an accidental change or deletion is always recoverable.</p>'),

        h(2, 'Google Workspace vs Microsoft Office'),
        table(
          ['', 'Google Workspace', 'Microsoft Office'],
          [
            ['Runs', 'In the browser, nothing installed', 'Installed desktop software (or Microsoft 365\'s own browser version)'],
            ['Saving', 'Automatic, continuous', 'Manual (Ctrl+S), or Microsoft 365 cloud autosave'],
            ['Real-time co-editing', 'Built in from the start, the core design', 'Available in Microsoft 365, added on top of a desktop-first design'],
            ['File format', 'Google\'s own (.gdoc/.gsheet/.gslides), exports to .docx/.xlsx/.pptx and PDF', '.docx/.xlsx/.pptx natively'],
            ['Offline use', 'Opt-in per file', 'Default — it\'s a desktop app'],
            ['Cost for individual use', 'Free with any Google account', 'Requires a Microsoft 365 subscription or one-time purchase'],
          ]
        ),
        p("<p>Neither is strictly better — they solve the same problems from different starting points. Google Workspace's free tier and effortless collaboration make it the easier default for students, freelancers, and small teams; Microsoft Office's deeper formatting control and offline-first design still make it the standard in many larger organizations. Both export to and open the other's file formats reasonably well, so a document is rarely locked into one or the other.</p>"),

        h(2, 'Personal Google Account vs Google Workspace (Business)'),
        p("<p>Everything covered above works on a completely free, personal Google account — the same one used for Gmail. <b>Google Workspace</b> (the paid business tier) adds a custom email address on your own domain (<code>you@yourbusiness.com</code> instead of <code>@gmail.com</code>), a larger shared storage pool, and admin controls for managing many accounts at once — worth it once a project is a real registered business with a team, not something an individual or a student needs to start.</p>"),

        h(2, 'Where This Fits'),
        p('<p>Nothing here replaces the Word, Excel, and PowerPoint lessons — the underlying skills (formatting a document, writing a formula, designing a slide) are the same skills, just running in a different app. What Google Workspace adds is a genuinely free option with no license to buy, and a collaboration model — several people, one file, no emailing versions back and forth — that comes up constantly in real freelance and team work, the same territory the <a href="/freelancing/">Freelancing &amp; Client Work</a> category covers.</p>'),
      ],
    },
    bn: {
      title: 'Google Workspace',
      metaTitle: 'Google Workspace — Docs, Sheets, Slides, Drive | Learn Computer Academy',
      metaDescription: 'Google Workspace পরিচিতি: Docs, Sheets, Slides আর Drive — Word, Excel, আর PowerPoint-এর free, ব্রাউজার-ভিত্তিক, autosave করা বিকল্প, real-time সহযোগিতার জন্য তৈরি।',
      blocks: [
        p('<p>এখন পর্যন্ত প্রতিটি Office পাঠ Microsoft-এর desktop app কভার করেছে — Word, Excel, PowerPoint — installed software যা আপনার নিজের কম্পিউটারে file সেভ করে। <b>Google Workspace</b> হলো cloud-based বিকল্প: <b>Docs</b>, <b>Sheets</b>, আর <b>Slides</b> Word, Excel, আর PowerPoint-এর মতোই মূল কাজ করে, কিন্তু সম্পূর্ণভাবে একটা ব্রাউজারে চলে, স্বয়ংক্রিয়ভাবে <b>Google Drive</b>-এ সেভ হয়, আর একই সাথে একাধিক মানুষের একই file edit করার জন্য শুরু থেকেই তৈরি। যাদের paid Office license নেই — যা বেশিরভাগ শিক্ষার্থী আর ছোট ব্যবসা — তাদের জন্য এটা সম্পূর্ণ free-ও।</p>'),

        h(2, 'Google Workspace আসলে কী?', 'google-workspace-আসলে-কী'),
        p('<p>Google Workspace হলো Google-এর productivity app-এর suite, একটা Google account-এর সাথে যুক্ত। আপনার কম্পিউটারে কিছু install হয় না — একটা ব্রাউজার খুলুন, sign in করুন, আর কাজ শুরু করুন। মূল app-গুলো ঠিক গত কয়েকটা পাঠে যা শেখানো হয়েছে তার সাথে সরাসরি মেলে: document-এর জন্য <b>Docs</b>, spreadsheet-এর জন্য <b>Sheets</b>, presentation-এর জন্য <b>Slides</b>, আর <b>Drive</b> সেই file storage যেখানে সবকিছু থাকে, এই file-গুলোর জন্য আপনার কম্পিউটারের নিজের folder-এর জায়গা নিয়ে।</p>'),

        h(2, 'Google Drive — যেখানে সবকিছু থাকে', 'google-drive-যেখানে-সবকিছু-থাকে'),
        p('<p>Drive হলো cloud storage: আপনার তৈরি করা প্রতিটা Doc, Sheet, আর Slide সেখানে জমা থাকা একটা file, আপনার hard drive-এ না, তাই আপনি যে device-এই sign in করুন না কেন সেখান থেকে পৌঁছানো যায়। File-গুলো ঠিক একটা সাধারণ file system-এর মতোই folder-এ সাজানো যায় (<a href="/bn/basics/file-and-folder-basics/">File and Folder Basics</a>-এ কভার করা), আর non-Google file — PDF, ছবি, ZIP — ও সেখানে upload আর সংরক্ষণ করা যায়।</p>'),
        img(images['google-drive'].publicId, 'List view-তে Google Drive file list, Owner, Date modified, আর File size-এর জন্য column দেখাচ্ছে — Name column ইচ্ছাকৃতভাবে blur করা আসল file আর client নাম সুরক্ষিত রাখতে', images['google-drive'], "Drive-এর file list — এখানে Name column blur করা; আপনারটাতে আসল, পড়ার-যোগ্য file নাম দেখাবে।"),

        h(2, 'Google Docs'),
        p('<p><b>Docs</b> হলো Google-এর word processor — Word পাঠে কভার করা সবকিছুর সরাসরি সমতুল্য: টেক্সট টাইপ আর format করা, paragraph style, header আর footer, ছবি, আর table। Toolbar আর menu layout Word থেকে আসার পরে চেনা লাগবে, একটা সংযোজন জানা দরকার: <b>Gemini</b>, Google-এর AI assistant, অনুরোধে টেক্সট draft বা পরিবর্তন করার জন্য editor-এ বিল্ট-ইন।</p>'),
        img(images['google-docs'].publicId, 'একটা খালি Google Docs document, menu bar, formatting toolbar, ruler, আর উপরে cursor সহ একটা খালি page দেখাচ্ছে', images['google-docs'], 'একটা নতুন Google Doc — toolbar আর page layout Word থেকে চেনা লাগবে।'),

        h(2, 'Google Sheets'),
        p('<p><b>Sheets</b> হলো spreadsheet app — row, column, আর formula ঠিক Excel-এর মতোই কাজ করে, <code>=B2*C2</code>-style cell reference আর <code>SUM</code>, <code>IF</code>-এর মতো function সহ। Sheets-এ লেখা একটা formula আর Excel-এ লেখা একটা যথেষ্ট কাছাকাছি যে Excel পাঠে শেখানো বেশিরভাগ কিছুই সরাসরি স্থানান্তরিত হয়।</p>'),
        img(images['google-sheets'].publicId, 'একটা ছোট worked example সহ একটা Google Sheets spreadsheet — একটা Item, Price, Qty, আর Total column, Total column একটা =B2*C2-style formula দিয়ে গণনা করা', images['google-sheets'], 'Sheets-এ একটা সাধারণ formula — একই =B2*C2 syntax যা Excel ব্যবহার করে।'),

        h(2, 'Google Slides'),
        p('<p><b>Slides</b> হলো presentation app, PowerPoint-এর সমতুল্য — slide, layout, theme, transition, আর speaker note সবই ধারণাগতভাবে একইভাবে কাজ করে। Docs-এর মতো, এটা title আর subtitle placeholder সহ একটা খালি slide-এ খোলে, click করার জন্য প্রস্তুত।</p>'),
        img(images['google-slides'].publicId, 'একটা খালি Google Slides presentation, "Click to add title" আর "Click to add subtitle" placeholder টেক্সট সহ একটা title slide layout দেখাচ্ছে, আর বামে slide panel', images['google-slides'], 'একটা নতুন Slides presentation — একটা title slide layout, edit করার জন্য প্রস্তুত।'),

        h(2, 'Real-Time সহযোগিতা', 'real-time-সহযোগিতা'),
        p('<p>এটাই সেই feature যাকে ঘিরে Google Workspace আসলে তৈরি, যেকোনো একটা app-এর চেয়ে বেশি: একাধিক মানুষ একই সময়ে একই Doc, Sheet, বা Slide খুলতে পারে, একে অপরের cursor দেখতে পারে, আর edit live দেখতে পারে, প্রতিটা পরিবর্তন ঘটার সাথে সাথে স্বয়ংক্রিয়ভাবে সেভ হয়। <b>Share</b> (প্রতিটা app-এর উপরে-ডানে) একটা বাছাই করা access level সহ একটা link তৈরি করে — viewer, commenter, বা editor — তাই একটা document ইমেইলে বারবার file পাঠানো ছাড়াই একসাথে review বা কাজ করা যায়।</p>'),

        h(2, 'Offline Access আর Autosave', 'offline-access-আর-autosave'),
        p('<p>কোনো "Save" button নেই, আর কোনোটা দরকারও নেই — প্রতিটা keystroke ক্রমাগত Drive-এ সেভ হয়, আর Google Docs, Sheets, আর Slides প্রতিটাকে offline উপলব্ধ করা যায় (Google Drive settings → "Available offline"), connection ফিরে এলে স্বয়ংক্রিয়ভাবে sync হয়। Version history (File → Version history) একটা file-এর প্রতিটা আগের অবস্থা রেখে দেয়, তাই একটা দুর্ঘটনাজনিত পরিবর্তন বা মোছা সবসময় পুনরুদ্ধারযোগ্য।</p>'),

        h(2, 'Google Workspace বনাম Microsoft Office', 'google-workspace-বনাম-microsoft-office'),
        table(
          ['', 'Google Workspace', 'Microsoft Office'],
          [
            ['চলে', 'ব্রাউজারে, কিছু install হয় না', 'Installed desktop software (বা Microsoft 365-এর নিজস্ব ব্রাউজার version)'],
            ['সেভ করা', 'স্বয়ংক্রিয়, ক্রমাগত', 'Manual (Ctrl+S), বা Microsoft 365 cloud autosave'],
            ['Real-time co-editing', 'শুরু থেকেই বিল্ট ইন, মূল ডিজাইন', 'Microsoft 365-এ উপলব্ধ, একটা desktop-first ডিজাইনের উপরে যোগ করা'],
            ['File format', 'Google-এর নিজস্ব (.gdoc/.gsheet/.gslides), .docx/.xlsx/.pptx আর PDF-এ export হয়', '.docx/.xlsx/.pptx স্বাভাবিকভাবে'],
            ['Offline ব্যবহার', 'প্রতি file-এ opt-in', 'Default — এটা একটা desktop app'],
            ['ব্যক্তিগত ব্যবহারের খরচ', 'যেকোনো Google account দিয়ে free', 'একটা Microsoft 365 subscription বা এক-বারের কেনা দরকার'],
          ]
        ),
        p('<p>কোনোটাই সম্পূর্ণভাবে ভালো না — এরা একই সমস্যা ভিন্ন শুরুর পয়েন্ট থেকে সমাধান করে। Google Workspace-এর free tier আর সহজ সহযোগিতা এটাকে শিক্ষার্থী, ফ্রিল্যান্সার, আর ছোট team-এর জন্য সহজ default করে তোলে; Microsoft Office-এর গভীর formatting নিয়ন্ত্রণ আর offline-first ডিজাইন এটাকে এখনও অনেক বড় organization-এ standard করে রাখে। দুটোই যুক্তিসঙ্গতভাবে ভালোভাবে একে অপরের file format export আর খুলতে পারে, তাই একটা document খুব কমই একটাতে আটকে থাকে।</p>'),

        h(2, 'ব্যক্তিগত Google Account বনাম Google Workspace (Business)', 'ব্যক্তিগত-google-account-বনাম-google-workspace-business'),
        p('<p>উপরে কভার করা সবকিছু একটা সম্পূর্ণ free, ব্যক্তিগত Google account-এ কাজ করে — Gmail-এর জন্য ব্যবহৃত একই account। <b>Google Workspace</b> (paid business tier) নিজের domain-এ একটা custom ইমেইল address যোগ করে (<code>@gmail.com</code>-এর বদলে <code>you@yourbusiness.com</code>), একটা বড় shared storage pool, আর একসাথে অনেক account পরিচালনার জন্য admin নিয়ন্ত্রণ — এটা তখনই worth হয় যখন একটা project একটা team সহ একটা আসল registered business হয়, একজন individual বা শিক্ষার্থীর শুরু করার জন্য দরকার না।</p>'),

        h(2, 'এটা কোথায় খাপ খায়', 'এটা-কোথায়-খাপ-খায়'),
        p('<p>এখানে কিছুই Word, Excel, আর PowerPoint পাঠকে প্রতিস্থাপন করে না — অন্তর্নিহিত দক্ষতা (একটা document format করা, একটা formula লেখা, একটা slide ডিজাইন করা) একই দক্ষতা, শুধু একটা ভিন্ন app-এ চলছে। Google Workspace যা যোগ করে তা হলো একটা সত্যিকারের free option কোনো license কেনার দরকার ছাড়াই, আর একটা সহযোগিতার model — একাধিক মানুষ, একটা file, ইমেইলে বারবার version পাঠানো ছাড়াই — যা আসল ফ্রিল্যান্স আর team কাজে নিয়মিত আসে, <a href="/bn/freelancing/">Freelancing &amp; Client Work</a> category যে একই এলাকা কভার করে।</p>'),
      ],
    },
  }

  console.log(`\n[office/google-workspace] ${lesson.en.blocks.length} en blocks, ${lesson.bn.blocks.length} bn blocks, sort_order ${lesson.sortOrder}`)

  if (DRY_RUN) {
    console.log('\n[dry-run] no DB writes made.')
    return
  }

  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'office').single()
  if (catErr || !category) { console.error('Category "office" not found.'); process.exit(1) }

  const docPath = `office/${lesson.slug}`
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
