#!/usr/bin/env node
// 4 new lessons appended to the existing "basics" category (sort_order
// 18–21, after the 17 already there): File and Folder Basics, Command Line
// and Terminal Basics, Git Basics, GitHub Basics. Per the site owner's
// instruction (2026-08-17): these belong in Computer Basics itself, not a
// new category, and use the isometric image style from Hosting & Deployment
// rather than Computer Basics' own flat-vector house style — a deliberate
// departure, same shape as Hosting's own break from the house default
// (D-73), noted in docs/DECISIONS.md.
//
// Order matters: File/Folder → Terminal (terminal operates on files/
// folders) → Git (typed in the terminal) → GitHub (Git hosted online).
// "How the Web Works" was considered for hosting/ but skipped — hosting
// already has `what-happens-when-you-visit-a-website` covering exactly that.
//
// Original content — written fresh (CONTENT-PIPELINE.md §3).
//
// Usage: node scripts/create-basics-dev-skills-content.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Block builders (same shapes as scripts/create-python-content.mjs) ─────

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

lessons.push({
  slug: 'file-and-folder-basics',
  sortOrder: 18,
  en: {
    title: 'File and Folder Basics',
    metaTitle: 'File and Folder Basics | Learn Computer Academy',
    metaDescription: 'What files, folders, extensions, and paths actually are — the everyday concepts every terminal command and every line of code depends on.',
    blocks: [
      p('<p>Before you open a code editor or a terminal, it helps to be completely comfortable with two ideas you already use every day without thinking about them: <b>files</b> and <b>folders</b>. Coding just makes you interact with them more directly than clicking icons does.</p>'),

      h(2, 'What a File Actually Is'),
      p('<p>A <b>file</b> is simply a named container of data saved on your computer\'s storage. Every file\'s name has two parts: the part you choose, and an <b>extension</b> — the letters after the last dot — that tells your computer what kind of data is inside.</p>'),

      h(2, 'File Extensions'),
      p('<p>The extension is how your operating system decides which program should open a file. Rename a photo from <code>.jpg</code> to <code>.txt</code> and the image data doesn\'t change, but your computer will suddenly try to open it as if it were plain text.</p>'),
      table(
        ['Extension', 'What it usually means'],
        [
          ['.txt', 'Plain text, no formatting'],
          ['.html', 'A web page'],
          ['.css', 'Styling rules for a web page'],
          ['.js', 'JavaScript code'],
          ['.py', 'Python code'],
          ['.jpg / .png', 'An image'],
          ['.pdf', 'A formatted document'],
          ['.zip', 'A compressed bundle of other files'],
        ]
      ),

      h(2, 'Folders (Directories)'),
      p('<p>A <b>folder</b> — also called a <b>directory</b> — doesn\'t hold data itself; it holds other files and folders. Folders can nest inside folders indefinitely, which is what lets you organize thousands of files into a structure you can actually navigate.</p>'),
      img(
        'docs/img/basics/file-and-folder-basics-1',
        'Isometric diagram of a computer file system showing a main folder opening into nested subfolders, each containing document, image, and code file icons',
        1024, 768,
        'Folders nest inside folders — a project folder might hold an images folder and a styles folder, each with their own files.'
      ),

      h(2, 'Special Folders Every Operating System Has'),
      p('<p>Every user account has one main <b>home folder</b> — <code>C:\\Users\\YourName</code> on Windows, <code>/Users/YourName</code> on macOS, <code>/home/yourname</code> on Linux — and a standard set of folders live inside it: <b>Desktop</b>, <b>Documents</b>, <b>Downloads</b>, <b>Pictures</b>. Almost every app\'s save dialog, and a fresh terminal window, both start you off inside this home folder.</p>'),
      img(
        'docs/img/basics/file-and-folder-basics-2',
        'Isometric diagram of a home folder icon with four arrows radiating out to smaller folders representing Desktop, Documents, Downloads, and Pictures',
        1024, 768,
        'Desktop, Documents, Downloads, and Pictures all live inside your one home folder — they\'re not special beyond being created for you automatically.'
      ),
      p('<p><b>Downloads</b> is worth knowing well specifically: it\'s where every browser saves a file by default, so it\'s usually the very first place to look for anything you just downloaded, before assuming it\'s missing.</p>'),

      h(2, 'Paths — How You Point at a File'),
      p('<p>A <b>path</b> is the full address of a file or folder — the sequence of folders you\'d click through to reach it, written as text instead. An <b>absolute path</b> starts from the very top of the drive; a <b>relative path</b> starts from wherever you currently are.</p>'),
      code('text', 'Absolute path:\nC:\\Users\\Rahul\\projects\\my-site\\index.html\n\nRelative path (from inside my-site):\n.\\images\\logo.png'),
      callout('note', '<p>Windows separates folders with a backslash <code>\\</code>. macOS and Linux — and every web browser — use a forward slash <code>/</code>. This matters the moment you write a path inside actual code, like an <code>&lt;img src="images/logo.png"&gt;</code> tag.</p>', 'One character, two operating systems'),
      p('<p>The very top of a path is called the <b>root</b> — <code>C:\\</code> on Windows, or a single <code>/</code> on macOS and Linux. Every absolute path on that drive starts from there, the same way every address in a city ultimately starts from the city itself.</p>'),

      h(2, 'Naming Files Well (Especially for Code)'),
      p('<p>A file name like <code>My Project Notes.txt</code> works fine when you click it, but the space in the middle causes real friction the moment you type that name instead — in a terminal, or inside code.</p>'),
      code('text', 'cd My Documents\ncd : Cannot find path \'My\'\n\ncd "My Documents"\n(works — the quotes tell the terminal it\'s one name, not two)'),
      p('<p>This is why almost every real project uses lowercase names with hyphens instead of spaces — <code>my-project-notes.txt</code>, <code>project-notes.txt</code> — and avoids characters like <code>&amp;</code>, <code>#</code>, or <code>%</code> that mean something special to a terminal or a web browser. It\'s a habit worth building before it costs you a confusing error.</p>'),

      h(2, 'File Size — Reading the Numbers'),
      p('<p>File sizes are measured in bytes, but almost never shown as raw bytes — they\'re grouped into kilobytes (KB), megabytes (MB), and gigabytes (GB), each about a thousand times bigger than the last.</p>'),
      table(
        ['Unit', 'Roughly holds'],
        [
          ['KB (kilobyte)', 'A short text file or a simple icon'],
          ['MB (megabyte)', 'A song, or a handful of photos'],
          ['GB (gigabyte)', 'A movie, or several thousand photos'],
        ]
      ),
      p('<p>Knowing this scale helps a size number mean something instantly — a 4 KB download finishing before you can blink and a 4 GB one taking several minutes aren\'t a coincidence, they\'re a thousand-times difference in actual data.</p>'),

      h(2, 'Why This Matters Before You Write Any Code'),
      p('<p>Every time a program saves a file, imports another file, or loads an image, it\'s working with a path — not a name you clicked on. Being fluent with files, folders, and paths now means the next few lessons — using a terminal, and later writing actual code — will make sense immediately instead of feeling like a second new skill on top of the first.</p>'),
    ],
  },
  bn: {
    title: 'ফাইল ও ফোল্ডার-এর প্রাথমিক ধারণা',
    metaTitle: 'ফাইল ও ফোল্ডার-এর প্রাথমিক ধারণা | Learn Computer Academy',
    metaDescription: 'File, folder, extension, আর path আসলে কী — প্রতিটা terminal কমান্ড আর প্রতিটা লাইন কোডের পেছনে থাকা রোজকার কনসেপ্ট।',
    blocks: [
      p('<p>কোনো code editor বা terminal খোলার আগে, প্রতিদিন না ভেবেই ব্যবহার করা দুটো জিনিসের সাথে পুরোপুরি স্বচ্ছন্দ হওয়া ভালো: <b>file</b> আর <b>folder</b>। কোডিং শুধু আইকনে ক্লিক করার বদলে এগুলোর সাথে আরও সরাসরি কাজ করায়।</p>'),

      h(2, 'File আসলে কী', 'file-আসলে-কী'),
      p('<p>একটি <b>file</b> হলো আপনার কম্পিউটারের storage-এ সেভ করা ডেটার একটি নামযুক্ত কনটেইনার। প্রতিটা file-এর নামের দুটো অংশ থাকে: আপনি যে অংশ বেছে নেন, আর একটি <b>extension</b> — শেষ ডট-এর পরের অক্ষরগুলো — যা বলে দেয় ভেতরে কী ধরনের ডেটা আছে।</p>'),

      h(2, 'File Extension', 'file-extension'),
      p('<p>Extension দিয়েই আপনার operating system ঠিক করে কোন প্রোগ্রাম দিয়ে একটা file খুলতে হবে। একটা ছবির নাম <code>.jpg</code> থেকে <code>.txt</code>-তে বদলালে ছবির ডেটা বদলায় না, কিন্তু আপনার কম্পিউটার হঠাৎ সেটাকে সাধারণ টেক্সট হিসেবে খুলতে চেষ্টা করবে।</p>'),
      table(
        ['Extension', 'সাধারণত যা বোঝায়'],
        [
          ['.txt', 'সাদামাটা টেক্সট, কোনো ফরম্যাটিং নেই'],
          ['.html', 'একটি ওয়েব পেজ'],
          ['.css', 'ওয়েব পেজের স্টাইলিং নিয়ম'],
          ['.js', 'JavaScript কোড'],
          ['.py', 'Python কোড'],
          ['.jpg / .png', 'একটি ছবি'],
          ['.pdf', 'একটি ফরম্যাট করা ডকুমেন্ট'],
          ['.zip', 'অন্য file গুলোর একটি কমপ্রেসড বান্ডিল'],
        ]
      ),

      h(2, 'Folder (Directory)', 'folder-directory'),
      p('<p>একটি <b>folder</b> — যাকে <b>directory</b>-ও বলা হয় — নিজে কোনো ডেটা রাখে না; এটা অন্য file আর folder রাখে। Folder-এর ভেতরে folder অসীমভাবে nest করা যায়, আর এটাই হাজার হাজার file-কে এমনভাবে সাজাতে দেয় যা আপনি সত্যিই নেভিগেট করতে পারবেন।</p>'),
      img(
        'docs/img/basics/file-and-folder-basics-1',
        'একটি কম্পিউটার ফাইল সিস্টেমের আইসোমেট্রিক ডায়াগ্রাম, যেখানে একটি মূল ফোল্ডার খুলে নেস্টেড সাবফোল্ডার দেখাচ্ছে, প্রতিটায় ডকুমেন্ট, ছবি, আর কোড ফাইলের আইকন আছে',
        1024, 768,
        'Folder-এর ভেতরে folder nest করা থাকে — একটা project folder-এ হয়তো একটা images folder আর একটা styles folder থাকতে পারে, প্রতিটার নিজের file সহ।'
      ),

      h(2, 'প্রতিটা অপারেটিং সিস্টেমেই যেসব বিশেষ Folder থাকে', 'প্রতিটা-অপারেটিং-সিস্টেমেই-যেসব-বিশেষ-folder-থাকে'),
      p('<p>প্রতিটা user অ্যাকাউন্টের একটা প্রধান <b>home folder</b> থাকে — Windows-এ <code>C:\\Users\\YourName</code>, macOS-এ <code>/Users/YourName</code>, Linux-এ <code>/home/yourname</code> — আর এর ভেতরে একটা স্ট্যান্ডার্ড সেট folder থাকে: <b>Desktop</b>, <b>Documents</b>, <b>Downloads</b>, <b>Pictures</b>। প্রায় প্রতিটা অ্যাপের save করার ডায়ালগ, আর একটা নতুন terminal উইন্ডো, দুটোই আপনাকে এই home folder-এর ভেতর থেকে শুরু করায়।</p>'),
      img(
        'docs/img/basics/file-and-folder-basics-2',
        'একটা home folder আইকনের আইসোমেট্রিক ডায়াগ্রাম, যেখান থেকে চারটা তীরচিহ্ন Desktop, Documents, Downloads, আর Pictures বোঝানো ছোট folder-এর দিকে যাচ্ছে',
        1024, 768,
        'Desktop, Documents, Downloads, আর Pictures — সবগুলোই আপনার একটা home folder-এর ভেতরে থাকে — এগুলো নিজে থেকে তৈরি হওয়া ছাড়া আর কিছুতে বিশেষ না।'
      ),
      p('<p><b>Downloads</b> বিশেষভাবে ভালো করে জানার মতো: প্রতিটা browser ডিফল্টভাবে এখানেই একটা file সেভ করে, তাই সদ্য ডাউনলোড করা কিছু হারিয়ে গেছে ভাবার আগে সাধারণত এখানেই প্রথমে দেখা উচিত।</p>'),

      h(2, 'Path — কীভাবে একটা file-কে নির্দেশ করবেন', 'path-কীভাবে-একটা-file-কে-নির্দেশ-করবেন'),
      p('<p>একটি <b>path</b> হলো একটা file বা folder-এর পুরো ঠিকানা — যে folder গুলোর মধ্য দিয়ে ক্লিক করে সেখানে পৌঁছাতেন, সেটাই টেক্সট হিসেবে লেখা। একটি <b>absolute path</b> drive-এর একদম উপর থেকে শুরু হয়; একটি <b>relative path</b> আপনি এখন যেখানে আছেন সেখান থেকে শুরু হয়।</p>'),
      code('text', 'Absolute path:\nC:\\Users\\Rahul\\projects\\my-site\\index.html\n\nRelative path (from inside my-site):\n.\\images\\logo.png'),
      callout('note', '<p>Windows folder আলাদা করে backslash <code>\\</code> দিয়ে। macOS আর Linux — আর প্রতিটা web browser — forward slash <code>/</code> ব্যবহার করে। এটা গুরুত্বপূর্ণ হয়ে ওঠে যখনই আপনি আসল কোডের ভেতরে একটা path লেখেন, যেমন <code>&lt;img src="images/logo.png"&gt;</code> ট্যাগে।</p>', 'একটা ক্যারেক্টার, দুটো অপারেটিং সিস্টেম'),
      p('<p>একটা path-এর একদম উপরের অংশকে বলা হয় <b>root</b> — Windows-এ <code>C:\\</code>, বা macOS আর Linux-এ শুধু একটা <code>/</code>। সেই drive-এর প্রতিটা absolute path সেখান থেকেই শুরু হয়, ঠিক যেমন একটা শহরের প্রতিটা ঠিকানা শেষ পর্যন্ত সেই শহর থেকেই শুরু হয়।</p>'),

      h(2, 'File-এর ভালো নাম দেওয়া (বিশেষত কোডের জন্য)', 'file-এর-ভালো-নাম-দেওয়া-বিশেষত-কোডের-জন্য'),
      p('<p><code>My Project Notes.txt</code>-এর মতো একটা file-এর নাম ক্লিক করলে ঠিকঠাক কাজ করে, কিন্তু মাঝখানের স্পেসটা তখনই আসল সমস্যা তৈরি করে যখন আপনি সেই নাম ক্লিক না করে টাইপ করেন — terminal-এ, বা কোডের ভেতরে।</p>'),
      code('text', 'cd My Documents\ncd : Cannot find path \'My\'\n\ncd "My Documents"\n(কাজ করে — quote গুলো terminal-কে বলে দেয় এটা দুটো না, একটাই নাম)'),
      p('<p>এজন্যই প্রায় প্রতিটা বাস্তব project স্পেসের বদলে lowercase নাম আর hyphen ব্যবহার করে — <code>my-project-notes.txt</code>, <code>project-notes.txt</code> — আর <code>&amp;</code>, <code>#</code>, বা <code>%</code>-এর মতো ক্যারেক্টার এড়িয়ে চলে যেগুলো একটা terminal বা web browser-এর কাছে বিশেষ কিছু বোঝায়। একটা বিভ্রান্তিকর error-এর আগে এই অভ্যাসটা গড়ে তোলা মূল্যবান।</p>'),

      h(2, 'File Size — সংখ্যাগুলো বোঝা', 'file-size-সংখ্যাগুলো-বোঝা'),
      p('<p>File-এর size বাইটে মাপা হয়, কিন্তু প্রায় কখনোই raw বাইট হিসেবে দেখানো হয় না — এগুলোকে kilobyte (KB), megabyte (MB), আর gigabyte (GB)-তে ভাগ করা হয়, প্রতিটা আগেরটার চেয়ে প্রায় হাজার গুণ বড়।</p>'),
      table(
        ['একক', 'মোটামুটি যা ধরে'],
        [
          ['KB (কিলোবাইট)', 'একটা ছোট টেক্সট file বা একটা সাধারণ আইকন'],
          ['MB (মেগাবাইট)', 'একটা গান, বা কয়েকটা ছবি'],
          ['GB (গিগাবাইট)', 'একটা মুভি, বা কয়েক হাজার ছবি'],
        ]
      ),
      p('<p>এই স্কেলটা জানা থাকলে একটা size-এর সংখ্যা সাথে সাথেই কিছু একটা বোঝাতে পারে — একটা 4 KB ডাউনলোড চোখের পলকে শেষ হয়ে যাওয়া আর একটা 4 GB ডাউনলোড কয়েক মিনিট লাগা কাকতালীয় না, এটা আসল ডেটার হাজার-গুণ পার্থক্য।</p>'),

      h(2, 'কোড লেখার আগে এটা কেন গুরুত্বপূর্ণ', 'কোড-লেখার-আগে-এটা-কেন-গুরুত্বপূর্ণ'),
      p('<p>যতবার একটা প্রোগ্রাম একটা file সেভ করে, অন্য একটা file import করে, বা একটা ছবি লোড করে, ততবারই এটা একটা path নিয়ে কাজ করছে — আপনি ক্লিক করা কোনো নাম নয়। এখনই file, folder, আর path নিয়ে স্বচ্ছন্দ হয়ে গেলে পরের কয়েকটা পাঠ — terminal ব্যবহার করা, আর পরে আসল কোড লেখা — সাথে সাথেই বোধগম্য মনে হবে, প্রথমটার উপর আরেকটা নতুন স্কিলের মতো মনে হবে না।</p>'),
    ],
  },
})

lessons.push({
  slug: 'command-line-and-terminal-basics',
  sortOrder: 19,
  en: {
    title: 'Command Line and Terminal Basics',
    metaTitle: 'Command Line and Terminal Basics | Learn Computer Academy',
    metaDescription: "What a terminal actually is, why developers use it instead of clicking, and the handful of navigation commands you'll use in every session.",
    blocks: [
      p('<p>Almost every real developer tool — installing packages, running a script, using Git — happens through typed commands, not clicked icons. The <b>terminal</b> (also called the <b>command line</b> or <b>console</b>) is where you type them.</p>'),

      h(2, 'Terminal vs Clicking Around'),
      p('<p>A normal app is a <b>GUI</b> — a Graphical User Interface — where you click buttons and icons. A terminal is a <b>CLI</b> — a Command-Line Interface — where you type a line of text describing exactly what you want done, and the computer does it immediately, with no menus in between.</p>'),

      h(2, 'Opening a Terminal'),
      p('<p>On Windows, search for <b>PowerShell</b> or <b>Windows Terminal</b> in the Start menu. On macOS, open the <b>Terminal</b> app from Applications → Utilities. Both give you the same kind of typing-based window — the exact commands differ slightly, which is exactly why the table below shows both.</p>'),

      h(2, 'Basic Navigation Commands'),
      img(
        'docs/img/basics/command-line-and-terminal-basics-1',
        'Isometric diagram of a computer terminal window with a command-line cursor, with arrows flowing from the window down to a stack of file icons representing files being controlled by typed commands',
        1024, 768,
        'Every command you type in a terminal acts directly on your file system — no clicking or menus involved.'
      ),
      table(
        ['Action', 'Windows (PowerShell)', 'macOS / Linux (bash)'],
        [
          ['Show current folder', 'pwd', 'pwd'],
          ['List files here', 'dir  (or ls)', 'ls'],
          ['Move into a folder', 'cd foldername', 'cd foldername'],
          ['Move up one level', 'cd ..', 'cd ..'],
        ]
      ),

      h(2, 'A Short Session'),
      code('text', 'PS C:\\Users\\Rahul> cd projects\nPS C:\\Users\\Rahul\\projects> dir\nmy-site   notes.txt\nPS C:\\Users\\Rahul\\projects> cd my-site\nPS C:\\Users\\Rahul\\projects\\my-site>'),
      callout('tip', '<p>Press the <b>↑</b> arrow to bring back your last command instead of retyping it, and press <b>Tab</b> to auto-complete a file or folder name — both work in every terminal you\'ll ever use.</p>', 'Two habits worth building immediately'),

      h(2, 'Creating and Removing Files and Folders'),
      p('<p>Navigation gets you around; these commands let you actually change what\'s there — the terminal equivalent of right-click → New Folder, or Delete.</p>'),
      table(
        ['Action', 'Windows (PowerShell)', 'macOS / Linux (bash)'],
        [
          ['Create a folder', 'mkdir foldername', 'mkdir foldername'],
          ['Create an empty file', 'New-Item filename.txt', 'touch filename.txt'],
          ['Delete a file', 'del filename.txt', 'rm filename.txt'],
          ['Delete an empty folder', 'rmdir foldername', 'rmdir foldername'],
        ]
      ),
      callout('warning', '<p>Deleting from a terminal is <b>permanent</b> — there\'s no Recycle Bin or Trash to rescue you afterward. Double-check the file or folder name before pressing enter, especially with anything that deletes a whole folder\'s contents at once.</p>', 'No undo here'),

      h(2, 'Reading a Command: Command, Flags, Arguments'),
      p('<p>Most commands follow the same shape: the <b>command</b> itself, optional <b>flags</b> that change how it behaves (usually starting with <code>-</code> or <code>/</code>), and an <b>argument</b> — what to actually act on.</p>'),
      code('text', 'ls -la my-site\n\u2502   \u2502   \u2514\u2500 argument: which folder to list\n\u2502   \u2514\u2500 flags: -l (long format) and -a (show hidden files too)\n\u2514\u2500 command: list files'),
      p('<p>Once this shape clicks, an unfamiliar command stops looking like a magic word to memorize and starts looking like something you can actually read — a command, adjusted by flags, aimed at an argument.</p>'),

      h(2, 'Running a Program from the Terminal'),
      p('<p>Instead of double-clicking a file, you can tell the terminal to run it directly by naming the program that understands it, followed by the file: <code>python app.py</code> runs a Python file, <code>node app.js</code> runs a JavaScript file. This is how nearly every real project actually gets started, once you\'re past the code editor.</p>'),
      img(
        'docs/img/basics/command-line-and-terminal-basics-2',
        'Isometric diagram of a terminal window with an arrow pointing to a gear and play button icon, representing a program being launched from a typed command',
        1024, 768,
        'Typing python app.py or node app.js hands the file to that program and runs it — the same idea as double-clicking, just typed instead of clicked.'
      ),

      h(2, 'When a Command Doesn\'t Work'),
      p('<p>Two errors show up constantly for beginners, and neither means anything is broken:</p>'),
      table(
        ['Message', 'What it usually means'],
        [
          ['"command not found" / "not recognized"', 'That program isn\'t installed yet, or the terminal doesn\'t know where to find it'],
          ['"permission denied"', 'You\'re trying to change something the current user account isn\'t allowed to touch'],
        ]
      ),

      h(2, 'Why Every Developer Ends Up Here'),
      p('<p>A GUI can only offer the buttons someone thought to build. The terminal can do anything the computer is capable of, which is why tools like Git, Python, and Node.js are all typed, not clicked. The next two lessons — Git and GitHub — are typed entirely from here.</p>'),
    ],
  },
  bn: {
    title: 'কমান্ড লাইন ও টার্মিনালের প্রাথমিক ধারণা',
    metaTitle: 'কমান্ড লাইন ও টার্মিনালের প্রাথমিক ধারণা | Learn Computer Academy',
    metaDescription: 'টার্মিনাল আসলে কী, কেন developer-রা ক্লিক করার বদলে এটা ব্যবহার করে, আর প্রতিটা সেশনে ব্যবহার করার মতো হাতে গোনা নেভিগেশন কমান্ড।',
    blocks: [
      p('<p>প্রায় প্রতিটা বাস্তব developer টুল — প্যাকেজ ইনস্টল করা, একটা স্ক্রিপ্ট রান করা, Git ব্যবহার করা — আইকনে ক্লিক করে না, টাইপ করা কমান্ডের মাধ্যমে হয়। <b>টার্মিনাল</b> (যাকে <b>কমান্ড লাইন</b> বা <b>কনসোল</b>-ও বলা হয়) হলো যেখানে আপনি সেগুলো টাইপ করেন।</p>'),

      h(2, 'টার্মিনাল বনাম ক্লিক করে ঘোরা', 'টার্মিনাল-বনাম-ক্লিক-করে-ঘোরা'),
      p('<p>সাধারণ একটা অ্যাপ হলো <b>GUI</b> — Graphical User Interface — যেখানে আপনি বাটন আর আইকনে ক্লিক করেন। একটা টার্মিনাল হলো <b>CLI</b> — Command-Line Interface — যেখানে আপনি ঠিক কী করাতে চান তা এক লাইন টেক্সটে টাইপ করেন, আর কম্পিউটার মাঝখানে কোনো মেনু ছাড়াই সাথে সাথে সেটা করে।</p>'),

      h(2, 'টার্মিনাল খোলা', 'টার্মিনাল-খোলা'),
      p('<p>Windows-এ, Start মেনুতে <b>PowerShell</b> বা <b>Windows Terminal</b> খুঁজুন। macOS-এ, Applications → Utilities থেকে <b>Terminal</b> অ্যাপ খুলুন। দুটোই একই ধরনের টাইপ-করা উইন্ডো দেয় — নির্দিষ্ট কমান্ডগুলো সামান্য আলাদা, যে কারণেই নিচের টেবিলে দুটোই দেখানো হয়েছে।</p>'),

      h(2, 'বেসিক নেভিগেশন কমান্ড', 'বেসিক-নেভিগেশন-কমান্ড'),
      img(
        'docs/img/basics/command-line-and-terminal-basics-1',
        'একটা কম্পিউটার টার্মিনাল উইন্ডোর আইসোমেট্রিক ডায়াগ্রাম, যেখান থেকে তীরচিহ্ন নিচে file আইকনের একটা স্ট্যাকের দিকে যাচ্ছে, টাইপ করা কমান্ড দিয়ে file নিয়ন্ত্রণ করার প্রতীক হিসেবে',
        1024, 768,
        'টার্মিনালে টাইপ করা প্রতিটা কমান্ড সরাসরি আপনার file সিস্টেমের উপর কাজ করে — ক্লিক আর মেনুর বদলে।'
      ),
      table(
        ['কাজ', 'Windows (PowerShell)', 'macOS / Linux (bash)'],
        [
          ['বর্তমান folder দেখান', 'pwd', 'pwd'],
          ['এখানকার file লিস্ট করুন', 'dir  (বা ls)', 'ls'],
          ['একটা folder-এ ঢুকুন', 'cd foldername', 'cd foldername'],
          ['এক ধাপ উপরে যান', 'cd ..', 'cd ..'],
        ]
      ),

      h(2, 'একটা ছোট সেশন', 'একটা-ছোট-সেশন'),
      code('text', 'PS C:\\Users\\Rahul> cd projects\nPS C:\\Users\\Rahul\\projects> dir\nmy-site   notes.txt\nPS C:\\Users\\Rahul\\projects> cd my-site\nPS C:\\Users\\Rahul\\projects\\my-site>'),
      callout('tip', '<p>আগের কমান্ড আবার টাইপ না করে ফিরিয়ে আনতে <b>↑</b> তীরচিহ্ন চাপুন, আর একটা file বা folder-এর নাম auto-complete করতে <b>Tab</b> চাপুন — দুটোই আপনি যত টার্মিনাল ব্যবহার করবেন সবগুলোতেই কাজ করে।</p>', 'এখনই গড়ে তোলার মতো দুটো অভ্যাস'),

      h(2, 'File আর Folder তৈরি ও মুছে ফেলা', 'file-আর-folder-তৈরি-ও-মুছে-ফেলা'),
      p('<p>নেভিগেশন আপনাকে ঘুরিয়ে দেখায়; এই কমান্ডগুলো দিয়ে আপনি আসলে সেখানে কী আছে তা বদলাতে পারেন — right-click → New Folder, বা Delete-এর terminal ভার্সন।</p>'),
      table(
        ['কাজ', 'Windows (PowerShell)', 'macOS / Linux (bash)'],
        [
          ['একটা folder তৈরি করুন', 'mkdir foldername', 'mkdir foldername'],
          ['একটা খালি file তৈরি করুন', 'New-Item filename.txt', 'touch filename.txt'],
          ['একটা file মুছে ফেলুন', 'del filename.txt', 'rm filename.txt'],
          ['একটা খালি folder মুছে ফেলুন', 'rmdir foldername', 'rmdir foldername'],
        ]
      ),
      callout('warning', '<p>Terminal থেকে মোছা <b>স্থায়ী</b> — এরপর বাঁচানোর জন্য কোনো Recycle Bin বা Trash নেই। Enter চাপার আগে file বা folder-এর নাম দুবার চেক করুন, বিশেষত এমন কিছুর ক্ষেত্রে যা একবারে একটা পুরো folder-এর সবকিছু মুছে দেয়।</p>', 'এখানে কোনো undo নেই'),

      h(2, 'একটা কমান্ড পড়া: Command, Flag, Argument', 'একটা-কমান্ড-পড়া-command-flag-argument'),
      p('<p>বেশিরভাগ কমান্ডই একই আকারে থাকে: নিজেই <b>command</b>, ঐচ্ছিক <b>flag</b> যা এর আচরণ বদলায় (সাধারণত <code>-</code> বা <code>/</code> দিয়ে শুরু হয়), আর একটা <b>argument</b> — আসলে কীসের উপর কাজ করবে।</p>'),
      code('text', 'ls -la my-site\n\u2502   \u2502   \u2514\u2500 argument: কোন folder লিস্ট করতে হবে\n\u2502   \u2514\u2500 flag: -l (লম্বা ফরম্যাট) আর -a (hidden file গুলোও দেখাও)\n\u2514\u2500 command: file লিস্ট করো'),
      p('<p>এই আকারটা একবার বোঝা হয়ে গেলে, একটা অচেনা কমান্ড মুখস্থ করার মতো জাদুর শব্দের বদলে এমন কিছু মনে হবে যা আপনি আসলেই পড়তে পারেন — একটা command, flag দিয়ে সামঞ্জস্য করা, একটা argument-এর দিকে লক্ষ্য করা।</p>'),

      h(2, 'Terminal থেকে একটা প্রোগ্রাম চালানো', 'terminal-থেকে-একটা-প্রোগ্রাম-চালানো'),
      p('<p>একটা file ডাবল-ক্লিক করার বদলে, আপনি terminal-কে সরাসরি সেটা চালাতে বলতে পারেন — যে প্রোগ্রামটা সেটা বোঝে তার নাম লিখে, তারপর file-এর নাম: <code>python app.py</code> একটা Python file চালায়, <code>node app.js</code> একটা JavaScript file চালায়। code editor পার হয়ে গেলে প্রায় প্রতিটা বাস্তব project আসলে এভাবেই শুরু হয়।</p>'),
      img(
        'docs/img/basics/command-line-and-terminal-basics-2',
        'একটা টার্মিনাল উইন্ডোর আইসোমেট্রিক ডায়াগ্রাম, যেখান থেকে একটা তীরচিহ্ন একটা গিয়ার আর প্লে বাটন আইকনের দিকে যাচ্ছে, টাইপ করা কমান্ড থেকে একটা প্রোগ্রাম চালু হওয়া বোঝাতে',
        1024, 768,
        'python app.py বা node app.js টাইপ করলে সেই file সেই প্রোগ্রামের হাতে চলে যায় আর চলতে শুরু করে — ডাবল-ক্লিকের একই আইডিয়া, শুধু ক্লিকের বদলে টাইপ করা।'
      ),

      h(2, 'যখন একটা কমান্ড কাজ করে না', 'যখন-একটা-কমান্ড-কাজ-করে-না'),
      p('<p>শুরুর দিকে দুটো error প্রায়ই দেখা যায়, আর দুটোর কোনোটারই মানে এই না যে কিছু ভেঙে গেছে:</p>'),
      table(
        ['বার্তা', 'সাধারণত যা বোঝায়'],
        [
          ['"command not found" / "not recognized"', 'সেই প্রোগ্রামটা এখনও ইনস্টল হয়নি, বা terminal জানে না সেটা কোথায় খুঁজে পাবে'],
          ['"permission denied"', 'বর্তমান user অ্যাকাউন্টের যা ছোঁয়ার অনুমতি নেই, আপনি এমন কিছু বদলানোর চেষ্টা করছেন'],
        ]
      ),

      h(2, 'প্রতিটা developer শেষে এখানেই আসে কেন', 'প্রতিটা-developer-শেষে-এখানেই-আসে-কেন'),
      p('<p>একটা GUI শুধু সেই বাটনগুলোই দিতে পারে যা কেউ বানানোর কথা ভেবেছিল। টার্মিনাল কম্পিউটার যা করতে সক্ষম তার সবকিছুই করতে পারে, যে কারণেই Git, Python, আর Node.js-এর মতো টুল টাইপ করে ব্যবহার করা হয়, ক্লিক করে না। পরের দুটো পাঠ — Git আর GitHub — পুরোপুরি এখান থেকেই টাইপ করা হয়।</p>'),
    ],
  },
})

lessons.push({
  slug: 'git-basics',
  sortOrder: 20,
  en: {
    title: 'Git Basics',
    metaTitle: 'Git Basics | Learn Computer Academy',
    metaDescription: 'What Git actually does, the problem it solves, and the handful of commands — init, add, commit, status, log — worth knowing from day one.',
    blocks: [
      p('<p>Anyone who has ever saved a file as <code>report_final.docx</code>, then <code>report_final_v2.docx</code>, then <code>report_final_v2_REALLY_FINAL.docx</code> has already felt the exact problem <b>Git</b> exists to solve.</p>'),

      h(2, 'The Problem Before Git'),
      p('<p>Manually renaming copies gives you no real history. You can\'t easily see what actually changed between versions, why it changed, or undo just one specific change without losing everything after it.</p>'),

      h(2, 'What Git Actually Does'),
      p('<p><b>Git</b> is a <b>version control system</b> — a tool that takes a snapshot of your entire project every time you tell it to, and remembers every snapshot forever. Each snapshot is called a <b>commit</b>. You can look at any commit from the project\'s history, compare two commits, or go back to an earlier one.</p>'),
      img(
        'docs/img/basics/git-basics-1',
        'Isometric diagram of a version control commit history shown as a horizontal chain of four connected snapshot blocks, representing saved versions of a project over time',
        1024, 768,
        'Each commit is a saved snapshot in the chain — you can jump to any of them at any time.'
      ),

      h(2, 'Three Core Ideas: Repository, Staging Area, Commit'),
      p('<p>A <b>repository</b> (or "repo") is a project folder that Git is tracking. The <b>staging area</b> is where you choose exactly which changed files should go into the next snapshot — you don\'t have to commit everything at once. A <b>commit</b> is that snapshot, saved permanently with a short message describing what changed.</p>'),

      h(2, 'A Few Commands to Know'),
      code('bash', 'git init                  # start tracking this folder\ngit status                # what\'s changed since the last commit?\ngit add .                 # stage every changed file\ngit commit -m "message"   # save a snapshot with a message\ngit log                   # see the history of commits'),
      callout('note', '<p>Every one of these is typed in the terminal — this is exactly why Command Line Basics came before this lesson, not after it.</p>', 'You already have the tool for this'),

      h(2, 'What Git Is Not'),
      p('<p>Git itself lives entirely on your own computer and needs no internet connection — it\'s just tracking history locally. It is not the same thing as <b>GitHub</b>, a separate website built around Git, which is exactly what the next lesson is about.</p>'),
    ],
  },
  bn: {
    title: 'Git-এর প্রাথমিক ধারণা',
    metaTitle: 'Git-এর প্রাথমিক ধারণা | Learn Computer Academy',
    metaDescription: 'Git আসলে কী করে, কোন সমস্যার সমাধান করে, আর প্রথম দিন থেকেই জানার মতো হাতে গোনা কমান্ড — init, add, commit, status, log।',
    blocks: [
      p('<p>যে কেউ কখনো একটা file <code>report_final.docx</code> নামে সেভ করেছে, তারপর <code>report_final_v2.docx</code>, তারপর <code>report_final_v2_REALLY_FINAL.docx</code> — সে ইতিমধ্যেই সেই সমস্যাটা অনুভব করেছে যেটার সমাধানের জন্য <b>Git</b>-এর অস্তিত্ব।</p>'),

      h(2, 'Git-এর আগের সমস্যা', 'git-এর-আগের-সমস্যা'),
      p('<p>হাতে করে কপির নাম বদলালে আসল কোনো history পাওয়া যায় না। দুটো ভার্সনের মধ্যে আসলে কী বদলেছে, কেন বদলেছে তা সহজে দেখা যায় না, আর পরের সবকিছু হারানো ছাড়া শুধু একটা নির্দিষ্ট বদল পূর্বাবস্থায় ফেরানো যায় না।</p>'),

      h(2, 'Git আসলে কী করে', 'git-আসলে-কী-করে'),
      p('<p><b>Git</b> একটা <b>version control system</b> — এমন একটা টুল যা আপনি বললেই আপনার পুরো project-এর একটা স্ন্যাপশট নেয়, আর প্রতিটা স্ন্যাপশট চিরকাল মনে রাখে। প্রতিটা স্ন্যাপশটকে বলা হয় একটা <b>commit</b>। আপনি project-এর history থেকে যেকোনো commit দেখতে পারেন, দুটো commit তুলনা করতে পারেন, বা আগের কোনোটায় ফিরে যেতে পারেন।</p>'),
      img(
        'docs/img/basics/git-basics-1',
        'একটা version control commit history-র আইসোমেট্রিক ডায়াগ্রাম, চারটা যুক্ত স্ন্যাপশট ব্লকের একটা আনুভূমিক চেইন হিসেবে দেখানো, সময়ের সাথে সেভ করা project-এর ভার্সন বোঝাতে',
        1024, 768,
        'প্রতিটা commit চেইনের একটা সেভ করা স্ন্যাপশট — আপনি যেকোনো সময় যেকোনোটায় লাফ দিতে পারেন।'
      ),

      h(2, 'তিনটা মূল আইডিয়া: Repository, Staging Area, Commit', 'তিনটা-মূল-আইডিয়া-repository-staging-area-commit'),
      p('<p>একটা <b>repository</b> (বা "repo") হলো একটা project folder যা Git ট্র্যাক করছে। <b>staging area</b> হলো যেখানে আপনি ঠিক করেন কোন বদলানো file গুলো পরের স্ন্যাপশটে যাবে — একসাথে সবকিছু commit করতে হয় না। একটা <b>commit</b> হলো সেই স্ন্যাপশট, কী বদলেছে তার একটা ছোট বার্তা সহ চিরস্থায়ীভাবে সেভ করা।</p>'),

      h(2, 'জানার মতো কয়েকটা কমান্ড', 'জানার-মতো-কয়েকটা-কমান্ড'),
      code('bash', 'git init                  # start tracking this folder\ngit status                # what\'s changed since the last commit?\ngit add .                 # stage every changed file\ngit commit -m "message"   # save a snapshot with a message\ngit log                   # see the history of commits'),
      callout('note', '<p>এগুলোর প্রতিটাই টার্মিনালে টাইপ করা হয় — এজন্যই কমান্ড লাইন বেসিক্স এই পাঠের আগে এসেছে, পরে নয়।</p>', 'এই কাজের টুল আপনার কাছে আগে থেকেই আছে'),

      h(2, 'Git যা না', 'git-যা-না'),
      p('<p>Git নিজে পুরোপুরি আপনার নিজের কম্পিউটারে থাকে আর কোনো ইন্টারনেট সংযোগ লাগে না — এটা শুধু স্থানীয়ভাবে history ট্র্যাক করে। এটা <b>GitHub</b>-এর মতো একই জিনিস না, যা Git-কে কেন্দ্র করে বানানো একটা আলাদা ওয়েবসাইট, আর পরের পাঠ ঠিক এটা নিয়েই।</p>'),
    ],
  },
})

lessons.push({
  slug: 'github-basics',
  sortOrder: 21,
  en: {
    title: 'GitHub Basics',
    metaTitle: 'GitHub Basics | Learn Computer Academy',
    metaDescription: 'The real difference between Git and GitHub, what push/pull/clone actually do, and why a public GitHub profile matters before your first job.',
    blocks: [
      p('<p>Git and GitHub have almost the same name and are easy to confuse — but they do two different jobs, and understanding the difference upfront saves real confusion later.</p>'),

      h(2, 'Git vs GitHub'),
      p('<p><b>Git</b> is the tool that tracks history on your own computer, covered in the last lesson. <b>GitHub</b> is a website that stores a copy of a Git repository online, and adds features Git alone doesn\'t have — a visual file browser, issue tracking, and a way for other people to see and contribute to your project.</p>'),

      h(2, 'Remote Repositories'),
      p('<p>A repository stored on GitHub is called a <b>remote</b>. <b>Push</b> sends your local commits up to it; <b>pull</b> brings any new commits from it back down to your computer; <b>clone</b> downloads an entire existing repository, history included, for the first time.</p>'),
      img(
        'docs/img/basics/github-basics-1',
        'Isometric diagram of a laptop computer connected to a cloud-shaped repository icon by two curved arrows, representing pushing and pulling code between a local computer and GitHub',
        1024, 768,
        'Push sends your commits up to GitHub; pull brings any new ones back down.'
      ),

      h(2, 'What a Repository Page Shows'),
      p('<p>Open any project on GitHub and you\'ll typically see the project\'s files, a <b>README</b> — a description of what the project is and how to use it — and the full commit history, each entry showing exactly what changed and when.</p>'),

      h(2, 'Why Every Developer Has a GitHub Profile'),
      p('<p>A GitHub profile is a public, verifiable record of real projects — closer to a portfolio than a resume line. It\'s often the first thing an employer looks at after a CV.</p>'),
      callout('tip', '<p>The Career Skills category covers this in real depth — see <a href="/career/github-for-job-seekers/">GitHub for Job Seekers</a> for what to actually put on your profile.</p>', 'Where this leads next'),

      h(2, 'Getting Started'),
      p('<p>Creating a free GitHub account and your first repository takes a few minutes. The habit worth building early: after finishing any small project — even a practice one — push it to GitHub. A repository nobody can see helps nobody, including future-you.</p>'),
    ],
  },
  bn: {
    title: 'GitHub-এর প্রাথমিক ধারণা',
    metaTitle: 'GitHub-এর প্রাথমিক ধারণা | Learn Computer Academy',
    metaDescription: 'Git আর GitHub-এর আসল পার্থক্য, push/pull/clone আসলে কী করে, আর প্রথম চাকরির আগে একটা পাবলিক GitHub প্রোফাইল কেন গুরুত্বপূর্ণ।',
    blocks: [
      p('<p>Git আর GitHub-এর নাম প্রায় একই, তাই গুলিয়ে ফেলা সহজ — কিন্তু এরা দুটো আলাদা কাজ করে, আর শুরুতেই এই পার্থক্যটা বুঝে নিলে পরে আসল বিভ্রান্তি এড়ানো যায়।</p>'),

      h(2, 'Git বনাম GitHub', 'git-বনাম-github'),
      p('<p><b>Git</b> হলো সেই টুল যা আপনার নিজের কম্পিউটারে history ট্র্যাক করে, আগের পাঠে যা নিয়ে আলোচনা হয়েছে। <b>GitHub</b> একটা ওয়েবসাইট যা একটা Git repository-র একটা কপি অনলাইনে রাখে, আর এমন ফিচার যোগ করে যা শুধু Git-এ নেই — একটা ভিজ্যুয়াল file browser, issue tracking, আর অন্য মানুষদের আপনার project দেখতে আর অবদান রাখতে দেওয়ার একটা উপায়।</p>'),

      h(2, 'Remote Repository', 'remote-repository'),
      p('<p>GitHub-এ সেভ করা একটা repository-কে বলা হয় একটা <b>remote</b>। <b>push</b> আপনার local commit গুলো সেখানে পাঠায়; <b>pull</b> সেখান থেকে নতুন কোনো commit আপনার কম্পিউটারে ফিরিয়ে আনে; <b>clone</b> প্রথমবার পুরো একটা বিদ্যমান repository, history সহ, ডাউনলোড করে।</p>'),
      img(
        'docs/img/basics/github-basics-1',
        'একটা ল্যাপটপ কম্পিউটার দুটো বাঁকা তীরচিহ্ন দিয়ে একটা মেঘ-আকৃতির repository আইকনের সাথে যুক্ত থাকার আইসোমেট্রিক ডায়াগ্রাম, লোকাল কম্পিউটার আর GitHub-এর মধ্যে কোড push আর pull করা বোঝাতে',
        1024, 768,
        'push আপনার commit গুলো GitHub-এ পাঠায়; pull নতুন যেকোনোটা ফিরিয়ে আনে।'
      ),

      h(2, 'একটা Repository পেজে কী দেখা যায়', 'একটা-repository-পেজে-কী-দেখা-যায়'),
      p('<p>GitHub-এ যেকোনো project খুললে সাধারণত আপনি দেখবেন project-এর file গুলো, একটা <b>README</b> — project কী আর কীভাবে ব্যবহার করতে হয় তার একটা বিবরণ — আর পুরো commit history, প্রতিটা এন্ট্রি ঠিক কী বদলেছে আর কখন তা দেখাচ্ছে।</p>'),

      h(2, 'প্রতিটা developer-এর কেন একটা GitHub প্রোফাইল থাকে', 'প্রতিটা-developer-এর-কেন-একটা-github-প্রোফাইল-থাকে'),
      p('<p>একটা GitHub প্রোফাইল হলো আসল project-এর একটা পাবলিক, যাচাইযোগ্য রেকর্ড — একটা resume লাইনের চেয়ে একটা portfolio-র কাছাকাছি। প্রায়ই এটাই একটা CV-র পরে একজন employer প্রথম যা দেখেন।</p>'),
      callout('tip', '<p>Career Skills ক্যাটাগরি এটা নিয়ে সত্যিকারের গভীরে আলোচনা করে — আপনার প্রোফাইলে আসলে কী রাখা উচিত তার জন্য দেখুন <a href="/bn/career/github-for-job-seekers/">GitHub for Job Seekers</a>।</p>', 'এরপর যা আসছে'),

      h(2, 'শুরু করা', 'শুরু-করা'),
      p('<p>একটা ফ্রি GitHub অ্যাকাউন্ট আর আপনার প্রথম repository বানাতে কয়েক মিনিট লাগে। শুরুতেই গড়ে তোলার মতো অভ্যাস: যেকোনো ছোট project শেষ করার পর — এমনকি একটা practice project হলেও — সেটা GitHub-এ push করুন। যে repository কেউ দেখতে পায় না তা কারও কাজে আসে না, ভবিষ্যতের আপনারও না।</p>'),
    ],
  },
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'basics').single()
  if (catErr || !category) {
    console.error('Category "basics" not found.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lesson(s) to write\n`)

  if (DRY_RUN) {
    for (const l of lessons) {
      console.log(`  [en] basics/${l.slug} — ${l.en.title} (${l.en.blocks.length} blocks, sort_order ${l.sortOrder})`)
      console.log(`  [bn] basics/${l.slug} — ${l.bn.title} (${l.bn.blocks.length} blocks)`)
    }
    console.log('\n[dry-run] no writes made.')
    return
  }

  for (const lesson of lessons) {
    const path = `basics/${lesson.slug}`
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

  console.log(`\n✅ Done.`)
}

main().catch(err => { console.error(err); process.exit(1) })
