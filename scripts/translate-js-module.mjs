import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '92b7942d-990c-43cf-8d4f-e6829a3505b4' // javascript/module-import-export
const title = 'জাভাস্ক্রিপ্ট মডিউল ও ইমপোর্ট/এক্সপোর্ট (বিস্তারিত)'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'ES Modules দিয়ে কোড সংগঠিত করা, named ও default export, এবং ইমপোর্ট করার পদ্ধতি শিখুন।'

const blocks = [
  { id: 'asNGMwOjx-Hn', type: 'richtext', html: '<p><em>(ES Modules দিয়ে কোডকে পুনরায় ব্যবহারযোগ্য ও রক্ষণাবেক্ষণযোগ্য ব্লকে সংগঠিত করা)</em></p>\n<hr>' },
  { id: 'R5ND0QcKl9YZ', text: 'জাভাস্ক্রিপ্ট মডিউল কী?', type: 'heading', level: 2, anchor: 'what-are-javascript-modules' },
  { id: '34YyQrvoifUA', type: 'richtext', html: `<p>মডিউল আপনাকে আপনার কোড একাধিক ফাইলে ভাগ করতে দেয়, যা আপনার কোডবেস পরিষ্কার ও সংগঠিত রাখে। প্রতিটি ফাইল ভেরিয়েবল, ফাংশন বা ক্লাস এক্সপোর্ট করতে পারে, এবং অন্য ফাইল সেগুলো ইমপোর্ট করতে পারে।</p>
<p>এই মডুলার পদ্ধতি সাহায্য করে:</p>
<ul>
                                  <li><strong>কোড পুনঃব্যবহারযোগ্যতায়</strong></li>
                                  <li><strong>রক্ষণাবেক্ষণযোগ্যতায়</strong></li>
                                  <li><strong>নেমস্পেস আইসোলেশনে (গ্লোবাল স্কোপ দূষিত না হওয়া)</strong></li>
                                </ul>` },
  { id: 'QRneiXvf6iN9', text: 'মডিউল সক্ষম করা', type: 'heading', level: 2, anchor: 'enabling-modules' },
  { id: 'wBZhSU0U2aLa', type: 'richtext', html: '<p>ব্রাউজারে মডিউল ব্যবহার করতে, আপনার <code>&lt;script&gt;</code> ট্যাগে <code>type="module"</code> যোগ করুন:</p>' },
  { id: 'c8-OzIuUAwKC', type: 'code', language: 'html', code: '<script type="module" src="main.js"></script>' },
  { id: 'IteUZB4U72Bz', text: 'একটি মডিউল থেকে এক্সপোর্ট করা', type: 'heading', level: 2, anchor: 'exporting-from-a-module' },
  { id: 'OKQYQ65lOqzu', type: 'richtext', html: '<p>আপনি একটি মডিউল ফাইল থেকে ফাংশন, ভেরিয়েবল বা ক্লাস <strong>এক্সপোর্ট</strong> করতে পারেন।</p>' },
  { id: 'XDXhHdW80_KK', text: 'নেমড এক্সপোর্ট', type: 'heading', level: 3, anchor: 'named-exports' },
  { id: 'xj9RWI24DbnI', type: 'code', language: 'javascript', code: '// ফাইল: mathUtils.js\nexport const add = (a, b) => a + b;\nexport const subtract = (a, b) => a - b;' },
  { id: 'yIZJRHffn1HK', type: 'richtext', html: '<p>আপনি ঘোষণার পরেও এক্সপোর্ট করতে পারেন:</p>' },
  { id: 'BFRAs7KJz1Bo', type: 'code', language: 'javascript', code: 'const multiply = (a, b) => a * b;\nexport { multiply };' },
  { id: 'NgpU--16KjNu', text: 'নেমড এক্সপোর্ট ইমপোর্ট করা', type: 'heading', level: 2, anchor: 'importing-named-exports' },
  { id: 'XfI9qDrEepg5', type: 'code', language: 'javascript', code: '// ফাইল: main.js\nimport { add, subtract } from \'./mathUtils.js\';\n\nconsole.log(add(5, 3));      // 8\nconsole.log(subtract(5, 3)); // 2' },
  { id: '-kQ_iWDnwOCC', type: 'richtext', html: '<p>আপনি ইমপোর্টকে অ্যালিয়াসও দিতে পারেন:</p>' },
  { id: 'AjlqkuhVBc5p', type: 'code', language: 'javascript', code: 'import { add as sum } from \'./mathUtils.js\';' },
  { id: 't9ZLfGP_nJmw', text: 'ডিফল্ট এক্সপোর্ট', type: 'heading', level: 2, anchor: 'default-exports' },
  { id: 'vxsA-ZxWmZ6O', type: 'richtext', html: '<p>একটি মডিউলে একটি মাত্র ডিফল্ট এক্সপোর্ট থাকতে পারে।</p>' },
  { id: 'gCwr0elMrXXo', type: 'code', language: 'javascript', code: '// ফাইল: greet.js\nexport default function greet(name) {\n  console.log(`Hello, ${name}`);\n}' },
  { id: 'qDMauFPs5alk', type: 'richtext', html: '<p>একটি ডিফল্ট এক্সপোর্ট ইমপোর্ট করা:</p>' },
  { id: 'fvVnio1qmgRn', type: 'code', language: 'javascript', code: "import greet from './greet.js';\ngreet('Alice'); // Hello, Alice" },
  { id: 'NOyA-t2bWQLz', text: 'নেমড ও ডিফল্ট এক্সপোর্ট মেশানো', type: 'heading', level: 2, anchor: 'mixing-named-and-default-exports' },
  { id: 'c_-aaqyguzkX', type: 'code', language: 'javascript', code: '// ফাইল: utils.js\nexport const log = msg => console.log(msg);\nexport default function sayHi() {\n  console.log("Hi!");\n}' },
  { id: 'azZcBeygE1Nr', type: 'code', language: 'javascript', code: "import sayHi, { log } from './utils.js';" },
  { id: 'C_BAtzrqPjr3', text: 'অন্য একটি ফাইল থেকে সবকিছু এক্সপোর্ট করা', type: 'heading', level: 2, anchor: 'export-all-from-another-file' },
  { id: '9GtZhd_8FS9q', type: 'richtext', html: '<p>আপনি অন্য একটি মডিউল থেকে সবকিছু পুনরায় এক্সপোর্ট করতে পারেন:</p>' },
  { id: 'j7eaK9sttnwW', type: 'code', language: 'javascript', code: "// ফাইল: allUtils.js\nexport * from './mathUtils.js';" },
  { id: 'f_eH2y23MGWo', text: 'সবকিছু একটি অবজেক্ট হিসেবে ইমপোর্ট করা', type: 'heading', level: 2, anchor: 'importing-all-as-an-object' },
  { id: 'JvaPj-EfqffA', type: 'code', language: 'javascript', code: "// ফাইল: main.js\nimport * as math from './mathUtils.js';\n\nconsole.log(math.add(2, 3)); // 5" },
  { id: 'VZbtrYyyj9R8', text: 'মডিউল ডিফল্টভাবে স্ট্রিক্ট মোডে থাকে', type: 'heading', level: 2, anchor: 'modules-are-strict-mode-by-default' },
  { id: '6NL4p0sX9dgn', type: 'richtext', html: '<p>মডিউল ফাইলে আপনার <code>"use strict"</code> লেখার দরকার নেই — এগুলো স্বয়ংক্রিয়ভাবে স্ট্রিক্ট মোডে চলে।</p>' },
  { id: 'sQGoTZ_uhfcM', text: 'মডিউল তাদের নিজস্ব স্কোপে চলে', type: 'heading', level: 2, anchor: 'modules-run-in-their-own-scope' },
  { id: '3xEEDUjmRvVw', type: 'richtext', html: '<p>মডিউলের ভেরিয়েবল সেই মডিউলের জন্য <code>local</code>। এগুলো গ্লোবাল স্কোপে লিক হয় না।</p>' },
  { id: 'JOZkPs1eHtbw', text: 'ব্রাউজার কম্প্যাটিবিলিটি ও নোট', type: 'heading', level: 2, anchor: 'browser-compatibility-and-notes' },
  { id: '1pb716j590gi', type: 'richtext', html: `<ul>
                                <li>আধুনিক ব্রাউজার সম্পূর্ণভাবে মডিউল সমর্থন করে।</li>
                                <li>লোকালি মডিউল ব্যবহার করার সময়, আপনাকে অবশ্যই একটি লোকাল সার্ভার (যেমন, VS Code-এর <code>Live Server</code> বা <code>http-server</code>) দিয়ে ফাইল সার্ভ করতে হবে — নাহলে আপনি CORS বা লোডিং এরর পেতে পারেন।</li>
                                <li><strong>Node.js</strong>-এ, ES modules ব্যবহার করতে <code>.mjs</code> এক্সটেনশন ব্যবহার করুন বা <code>package.json</code>-এ <code>"type": "module"</code> সেট করুন।</li>
                              </ul>` },
  { id: 'daZEL5KufuH6', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: '9T7arNmH_Yct', type: 'richtext', html: `<ul>
                                <li>ES Modules আপনাকে ছোট, পুনরায় ব্যবহারযোগ্য ফাইলে কোড সংগঠিত করতে দেয়।</li>
                                <li>ফাইলগুলোর মধ্যে কোড শেয়ার করতে <code>export</code> এবং <code>import</code> ব্যবহার করুন।</li>
                                <li>মডিউল স্কোপড, স্ট্রিক্ট, এবং গ্লোবাল নেমস্পেস দূষিত হওয়া এড়ায়।</li>
                                <li>স্কেলেবল অ্যাপ্লিকেশন এবং আধুনিক ফ্রেমওয়ার্কে কাজ করার জন্য মডিউল আয়ত্ত করা অপরিহার্য।</li>
                              </ul>` },
  { id: 'oiSWX6lqFH9W', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'dOgfjtTtdao7', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'niP7IEn2zL7W', type: 'richtext', html: `<ol>
                                    <li>একটি <code>math.js</code> ফাইল তৈরি করুন এবং <code>add</code>, <code>subtract</code>, <code>multiply</code>, <code>divide</code> এক্সপোর্ট করুন।</li>
                                    <li>একটি <code>main.js</code> ফাইল তৈরি করুন যা ওই সব ফাংশন ইমপোর্ট করে ব্যবহার করে।</li>
                                    <li>একটি আলাদা মডিউলে <code>greet()</code> ফাংশনের জন্য ডিফল্ট এক্সপোর্ট ব্যবহার করুন।</li>
                                    <li>সব এক্সপোর্ট একটি অবজেক্টে আনতে <code>import *</code> as সিনট্যাক্স ব্যবহার করুন।</li>
                                    <li>একটি ইউটিলিটি ফাইলে নেমড ও ডিফল্ট এক্সপোর্ট মিশিয়ে ব্যবহার করার চেষ্টা করুন।</li>
                              </ol>` },
]

const toc = [
  { id: 'what-are-javascript-modules', text: 'জাভাস্ক্রিপ্ট মডিউল কী?', level: 2 },
  { id: 'enabling-modules', text: 'মডিউল সক্ষম করা', level: 2 },
  { id: 'exporting-from-a-module', text: 'একটি মডিউল থেকে এক্সপোর্ট করা', level: 2 },
  { id: 'named-exports', text: 'নেমড এক্সপোর্ট', level: 3 },
  { id: 'importing-named-exports', text: 'নেমড এক্সপোর্ট ইমপোর্ট করা', level: 2 },
  { id: 'default-exports', text: 'ডিফল্ট এক্সপোর্ট', level: 2 },
  { id: 'mixing-named-and-default-exports', text: 'নেমড ও ডিফল্ট এক্সপোর্ট মেশানো', level: 2 },
  { id: 'export-all-from-another-file', text: 'অন্য একটি ফাইল থেকে সবকিছু এক্সপোর্ট করা', level: 2 },
  { id: 'importing-all-as-an-object', text: 'সবকিছু একটি অবজেক্ট হিসেবে ইমপোর্ট করা', level: 2 },
  { id: 'modules-are-strict-mode-by-default', text: 'মডিউল ডিফল্টভাবে স্ট্রিক্ট মোডে থাকে', level: 2 },
  { id: 'modules-run-in-their-own-scope', text: 'মডিউল তাদের নিজস্ব স্কোপে চলে', level: 2 },
  { id: 'browser-compatibility-and-notes', text: 'ব্রাউজার কম্প্যাটিবিলিটি ও নোট', level: 2 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/module-import-export: 1/1 written')
