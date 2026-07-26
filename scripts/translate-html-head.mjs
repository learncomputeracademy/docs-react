import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '2306db38-bdf8-4981-b9e5-b130d7e82b9d' // html/head
const title = 'HTML head'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'HTML head এলিমেন্ট, title, style, link, meta, script, base ট্যাগ এবং ভিউপোর্ট সেট করা শিখুন।'

const blocks = [
  { id: 'QRUiI0KBtPMz', type: 'richtext', html: '<hr>' },
  { id: 'FxqHMbathoa2', text: 'HTML <head> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-html-head-element' },
  { id: '1mWSxcbQBJKY', type: 'richtext', html: '<p><code>&lt;head&gt;</code> এলিমেন্ট মেটাডেটার (ডেটা সম্পর্কে ডেটা) একটি কন্টেইনার এবং এটি <code>&lt;html&gt;</code> ট্যাগ ও <code>&lt;body&gt;</code> ট্যাগের মধ্যে বসানো হয়।</p>\n<p>HTML মেটাডেটা হলো HTML ডকুমেন্ট সম্পর্কিত ডেটা। মেটাডেটা প্রদর্শিত হয় না।</p>\n<p>মেটাডেটা সাধারণত ডকুমেন্টের টাইটেল, ক্যারেক্টার সেট, স্টাইল, স্ক্রিপ্ট এবং অন্যান্য মেটা তথ্য নির্ধারণ করে।</p>\n<p>নিচের ট্যাগগুলো মেটাডেটা বর্ণনা করে: <code>&lt;title&gt;</code>, <code>&lt;style&gt;</code>, <code>&lt;meta&gt;</code>, <code>&lt;link&gt;</code>, <code>&lt;script&gt;</code>, এবং <code>&lt;base&gt;</code>।</p>\n<hr>' },
  { id: '7szli9hpK-Lp', text: 'HTML <title> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-html-title-element' },
  { id: '8LtcxjkxCy6t', type: 'richtext', html: `<p><code>&lt;title&gt;</code> এলিমেন্ট ডকুমেন্টের টাইটেল নির্ধারণ করে, এবং সব HTML ডকুমেন্টেই এটি বাধ্যতামূলক।</p>
<p><code>&lt;title&gt;</code> এলিমেন্ট:</p>
<ul>
                                    <li>ব্রাউজার ট্যাবে একটি টাইটেল দেখায়</li>
                                    <li>পেজটিকে ফেভারিটে যোগ করার সময় একটি টাইটেল দেয়</li>
                                    <li>সার্চ ইঞ্জিন ফলাফলে পেজের টাইটেল প্রদর্শন করে</li>
                                </ul>
<p>একটি সাধারণ HTML ডকুমেন্ট:</p>` },
  { id: 'im8dBmpN9Pv4', type: 'code', language: 'html', code: '<!DOCTYPE html>\n<html>\n\n<head>\n  <title>Page Title</title>\n</head>\n\n<body>\nThe content of the document......\n</body>\n\n</html>' },
  { id: 'TlzGvcTe4gvT', type: 'richtext', html: '<hr>' },
  { id: 'DLgcfy4gf1hy', text: 'HTML <style> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-html-style-element' },
  { id: 'JaS00BIBgpt_', type: 'richtext', html: '<p>একটি একক HTML পেজের জন্য স্টাইল তথ্য নির্ধারণ করতে <code>&lt;style&gt;</code> এলিমেন্ট ব্যবহার করা হয়:</p>' },
  { id: 'AWVjct0_Cn36', type: 'code', language: 'html', code: '<style>\n    body {background-color: powderblue;}\n    h1 {color: red;}\n    p {color: blue;}\n</style>' },
  { id: '9PBv-2n6c5xk', type: 'richtext', html: '<hr>' },
  { id: 'K1uhut5TpoGv', text: 'HTML <link> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-html-linkelement' },
  { id: 'm7NLgnP4h_5r', type: 'richtext', html: '<p>বাইরের স্টাইল শিটের সাথে লিঙ্ক করতে <code>&lt;link&gt;</code> এলিমেন্ট ব্যবহার করা হয়:</p>' },
  { id: 'fMc5f8Nv4PIA', type: 'code', language: 'html', code: '<link rel="stylesheet" href="mystyle.css">' },
  { id: 'XTvgSvIJmdhp', type: 'richtext', html: '<hr>' },
  { id: 'aLFmiXlhg8FO', text: 'HTML <meta> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-html-meta-element' },
  { id: 'OiBM3M3WrvYO', type: 'richtext', html: '<p>কোন ক্যারেক্টার সেট ব্যবহৃত হচ্ছে, পেজের বিবরণ, কীওয়ার্ড, লেখক এবং অন্যান্য মেটাডেটা উল্লেখ করতে <code>&lt;meta&gt;</code> এলিমেন্ট ব্যবহার করা হয়।</p>\n<p>মেটাডেটা ব্রাউজার (কনটেন্ট কীভাবে প্রদর্শন করতে হবে), সার্চ ইঞ্জিন (কীওয়ার্ড), এবং অন্যান্য ওয়েব সার্ভিস ব্যবহার করে।</p>\n<p>ব্যবহৃত ক্যারেক্টার সেট নির্ধারণ করুন:</p>' },
  { id: 'PXkwZ4KysGn4', type: 'code', language: 'html', code: '<meta charset="UTF-8">' },
  { id: 'u6keohMGq0Fh', type: 'richtext', html: '<p>আপনার ওয়েব পেজের একটি বিবরণ নির্ধারণ করুন:</p>' },
  { id: 'yeEqAnOmc8Wz', type: 'code', language: 'html', code: '<meta name="description" content="Free Web tutorials">' },
  { id: 'lMwWFzaPHXl7', type: 'richtext', html: '<p>সার্চ ইঞ্জিনের জন্য কীওয়ার্ড নির্ধারণ করুন:</p>' },
  { id: 'T9KT_iWTkEdX', type: 'code', language: 'html', code: '<meta name="keywords" content="HTML, CSS, XML, JavaScript">' },
  { id: 'fyjZKQPwJfdV', type: 'richtext', html: '<p>একটি পেজের লেখক নির্ধারণ করুন:</p>' },
  { id: '14rG_YGOCeKC', type: 'code', language: 'html', code: '<meta name="author" content="John Doe">' },
  { id: 'ZYdtTohhsiKt', type: 'richtext', html: '<p>প্রতি 30 সেকেন্ডে ডকুমেন্ট রিফ্রেশ করুন:</p>' },
  { id: 'heVK0Qy-g0Fl', type: 'code', language: 'html', code: '<meta http-equiv="refresh" content="30">' },
  { id: 'nHgjXsv2NICh', type: 'richtext', html: '<p>&lt;meta&gt; ট্যাগের উদাহরণ:</p>' },
  { id: 'hC1Pi6VriR-C', type: 'code', language: 'html', code: '<meta charset="UTF-8">\n<meta name="description" content="Free Web tutorials">\n<meta name="keywords" content="HTML,CSS,XML,JavaScript">\n<meta name="author" content="John Doe">' },
  { id: 'urGYhMyxhpm-', type: 'richtext', html: '<hr>' },
  { id: '0M0X1Ym1kVij', text: 'ভিউপোর্ট সেট করা', type: 'heading', level: 2, anchor: 'setting-the-viewport' },
  { id: 'vlPqaQyblG2r', type: 'richtext', html: '<p>HTML5, <code>&lt;meta&gt;</code> ট্যাগের মাধ্যমে ওয়েব ডিজাইনারদের ভিউপোর্ট নিয়ন্ত্রণ করার একটি পদ্ধতি চালু করেছে।</p>\n<p>ভিউপোর্ট হলো একটি ওয়েব পেজের ব্যবহারকারীর দৃশ্যমান এলাকা। এটি ডিভাইস ভেদে পরিবর্তিত হয়, এবং কম্পিউটার স্ক্রিনের চেয়ে মোবাইল ফোনে ছোট হবে।</p>\n<p>আপনার সব ওয়েব পেজে নিচের <code>&lt;meta&gt; </code>ভিউপোর্ট এলিমেন্টটি রাখা উচিত:</p>' },
  { id: 'XwepuF53XQ8X', type: 'code', language: 'html', code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' },
  { id: '5lY5m2ByheuZ', type: 'richtext', html: '<p>একটি <code>&lt;meta&gt;</code> ভিউপোর্ট এলিমেন্ট ব্রাউজারকে পেজের মাপ ও স্কেলিং নিয়ন্ত্রণ করার নির্দেশনা দেয়।</p>\n<p><b>width=device-width</b> অংশটি পেজের প্রস্থকে ডিভাইসের স্ক্রিন-প্রস্থ অনুসরণ করতে সেট করে (যা ডিভাইস ভেদে পরিবর্তিত হবে)।</p>\n<p><b>initial-scale=1.0</b> অংশটি ব্রাউজার পেজটি প্রথমবার লোড করার সময় প্রাথমিক জুম লেভেল সেট করে।</p>\n<p>এখানে ভিউপোর্ট মেটা ট্যাগ ছাড়া একটি ওয়েব পেজের উদাহরণ, এবং ভিউপোর্ট <code>&lt;meta&gt;</code> ট্যাগসহ একই ওয়েব পেজ দেওয়া হলো:</p>\n<p><b>টিপস:</b> আপনি যদি ফোন বা ট্যাবলেট দিয়ে এই পেজটি ব্রাউজ করেন, তাহলে পার্থক্য দেখতে নিচের দুটি লিঙ্কে ক্লিক করতে পারেন।</p>\n<hr>' },
  { id: 'OT5HGjYDvqja', text: 'HTML <script> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-html-script-element' },
  { id: 'bZWRzz1qYuih', type: 'richtext', html: '<p>ক্লায়েন্ট-সাইড JavaScript নির্ধারণ করতে <code>&lt;script&gt;</code> এলিমেন্ট ব্যবহার করা হয়।</p>\n<p>এই JavaScript id="demo" থাকা একটি HTML এলিমেন্টে "Hello JavaScript!" লিখে দেয়:</p>' },
  { id: '-vOOVXv27yEO', type: 'code', language: 'html', code: '<script>\n    function myFunction {\n      document.getElementById("demo").innerHTML = "Hello JavaScript!";\n    }\n</script>' },
  { id: 'NqvBnjGvPuxS', type: 'richtext', html: '<p><b>টিপস:</b> JavaScript সম্পর্কে সবকিছু জানতে, আমাদের <a href="https://www.w3schools.com/js/default.asp" target="_blank">JavaScript টিউটোরিয়াল</a> দেখুন।</p>\n<hr>' },
  { id: '6kcrC3L_iYHb', text: 'HTML <base> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-html-base-element' },
  { id: 'UwuIoKskYyOX', type: 'richtext', html: '<p><code>&lt;base&gt;</code> এলিমেন্ট একটি পেজের সব রিলেটিভ URL-এর জন্য বেস URL এবং বেস টার্গেট নির্ধারণ করে:</p>' },
  { id: 'NLwFEWLmEGJh', type: 'code', language: 'html', code: '<base href="https://www.learncomputer.in/images/" target="_blank">' },
  { id: 'fBDxoBn9DjgE', type: 'richtext', html: '<hr>' },
  { id: '7KJs-vh84C1t', text: '<html>, <head> এবং <body> বাদ দেওয়া?', type: 'heading', level: 2, anchor: 'omitting-html-head-and-body' },
  { id: 'pOHgZ3nspIfa', type: 'richtext', html: '<p>HTML5 স্ট্যান্ডার্ড অনুযায়ী; <code>&lt;html&gt;</code>, <code>&lt;body&gt;</code>, এবং <code>&lt;head&gt;</code> ট্যাগ বাদ দেওয়া যেতে পারে।</p>\n<p>নিচের কোডটি HTML5 হিসেবে সঠিকভাবে যাচাই হবে:</p>' },
  { id: 'aClJl_sQiTxb', type: 'code', language: 'html', code: '<!DOCTYPE html>\n<title>Page Title</title>\n\n<h1>This is a heading</h1>\n<p>This is a paragraph.</p>' },
  { id: '-s54BCFY95OI', type: 'richtext', html: `<p><b>মনে রাখবেন:</b></p>
<ul>
                                    <li>Learn Computer Academy <code>&lt;html&gt;</code> এবং <code>&lt;body&gt;</code> ট্যাগ বাদ দেওয়ার <u><i>পরামর্শ দেয় না</i></u>। এই ট্যাগগুলো বাদ দিলে DOM বা XML সফটওয়্যার ক্র্যাশ করতে পারে এবং পুরনো ব্রাউজারে (IE9) ভুল দেখাতে পারে।</li>
                                    <li>তবে, <code>&lt;head&gt;</code> ট্যাগ বাদ দেওয়া বেশ কিছুদিন ধরেই একটি সাধারণ প্রচলন।</li>
                                </ul>
<hr>` },
  { id: 'iS4bdx_yEm3S', text: 'HTML head এলিমেন্ট', type: 'heading', level: 2, anchor: 'html-head-elements' },
  { id: '0GDtY-AbosKb', type: 'table', header: ['ট্যাগ', 'বিবরণ'], rows: [
    ['&lt;head&gt;', 'একটি ডকুমেন্ট সম্পর্কে তথ্য নির্ধারণ করে'],
    ['&lt;title&gt;', 'একটি ডকুমেন্টের টাইটেল নির্ধারণ করে'],
    ['&lt;base&gt;', 'একটি পেজের সব লিঙ্কের জন্য একটি ডিফল্ট ঠিকানা বা ডিফল্ট টার্গেট নির্ধারণ করে'],
    ['&lt;link&gt;', 'একটি ডকুমেন্ট এবং একটি বাইরের রিসোর্সের মধ্যে সম্পর্ক নির্ধারণ করে'],
    ['&lt;meta&gt;', 'একটি HTML ডকুমেন্ট সম্পর্কে মেটাডেটা নির্ধারণ করে'],
    ['&lt;script&gt;', 'একটি ক্লায়েন্ট-সাইড স্ক্রিপ্ট নির্ধারণ করে'],
    ['&lt;style&gt;', 'একটি ডকুমেন্টের জন্য স্টাইল তথ্য নির্ধারণ করে'],
  ] },
]

const toc = [
  { id: 'the-html-head-element', text: 'HTML <head> এলিমেন্ট', level: 2 },
  { id: 'the-html-title-element', text: 'HTML <title> এলিমেন্ট', level: 2 },
  { id: 'the-html-style-element', text: 'HTML <style> এলিমেন্ট', level: 2 },
  { id: 'the-html-linkelement', text: 'HTML <link> এলিমেন্ট', level: 2 },
  { id: 'the-html-meta-element', text: 'HTML <meta> এলিমেন্ট', level: 2 },
  { id: 'setting-the-viewport', text: 'ভিউপোর্ট সেট করা', level: 2 },
  { id: 'the-html-script-element', text: 'HTML <script> এলিমেন্ট', level: 2 },
  { id: 'the-html-base-element', text: 'HTML <base> এলিমেন্ট', level: 2 },
  { id: 'omitting-html-head-and-body', text: '<html>, <head> এবং <body> বাদ দেওয়া?', level: 2 },
  { id: 'html-head-elements', text: 'HTML head এলিমেন্ট', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('head: 1/1 written')
