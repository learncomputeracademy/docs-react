import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '5432f15e-7003-45d2-b8ac-1d6cdcc2ced9' // javascript/json-and-data-fetching
const title = 'জাভাস্ক্রিপ্ট JSON ও ডেটা ফেচিং'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'JSON সিনট্যাক্স, JSON ও জাভাস্ক্রিপ্টের মধ্যে রূপান্তর, এবং fetch API দিয়ে ডেটা আনার পদ্ধতি শিখুন।'

const blocks = [
  { id: 'YSVaN3pkfmOh', type: 'richtext', html: '<p><em>(JSON এবং fetch API দিয়ে ডেটা নিয়ে কাজ করা)</em></p>\n<hr>' },
  { id: 't3Rp9i07Xd2H', text: 'JSON কী?', type: 'heading', level: 2, anchor: 'what-is-json' },
  { id: '_wuoPGe7-3-d', type: 'richtext', html: '<p><strong>JSON (JavaScript Object Notation)</strong> একটি <strong>হালকা ডেটা ফরম্যাট</strong>, যা ডেটা সংরক্ষণ ও পরিবহনের জন্য ব্যবহার করা হয়, বিশেষ করে একটি সার্ভার এবং একটি ওয়েব অ্যাপ্লিকেশনের মধ্যে।</p>' },
  { id: 'x_MkCwOPwU8C', text: 'JSON সিনট্যাক্স নিয়ম:', type: 'heading', level: 2, anchor: 'json-syntax-rules' },
  { id: 'QReZIT40h3kW', type: 'richtext', html: `<ul>
                                  <li>ডেটা থাকে <code>key/value pairs</code> আকারে</li>
                                  <li>Key এবং স্ট্রিং ভ্যালু <code>ডাবল কোট</code>-এর মধ্যে থাকে</li>
                                  <li>এতে অবজেক্ট, অ্যারে, স্ট্রিং, নম্বর, বুলিয়ান এবং null রাখা যায়</li>
                                </ul>` },
  { id: 'OKk20_pGy_gT', text: 'উদাহরণ:', type: 'heading', level: 3, anchor: 'example' },
  { id: 'jTsF5CprqDPZ', type: 'code', language: 'javascript', code: '{\n  "name": "John",\n  "age": 30,\n  "isStudent": false,\n  "hobbies": ["coding", "music"]\n}' },
  { id: 'Ckp5-qgNDbDd', text: 'JSON এবং জাভাস্ক্রিপ্টের মধ্যে রূপান্তর', type: 'heading', level: 2, anchor: 'converting-between-json-and-javascript' },
  { id: 'EB-z-kBFsWYA', text: 'JSON ➡️ জাভাস্ক্রিপ্ট (পার্সিং)', type: 'heading', level: 3, anchor: 'json-javascript-parsing' },
  { id: 'PIR8_LIzn3qz', type: 'code', language: 'javascript', code: 'const jsonString = \'{"name": "Alice", "age": 25}\';\nconst obj = JSON.parse(jsonString);\nconsole.log(obj.name); // Alice' },
  { id: 'cpl8Nhw3Inlm', text: 'জাভাস্ক্রিপ্ট ➡️ JSON (স্ট্রিংগিফাইং)', type: 'heading', level: 3, anchor: 'javascript-json-stringifying' },
  { id: '_iB4IYcZ6_va', type: 'code', language: 'javascript', code: 'const user = { name: "Bob", age: 40 };\nconst json = JSON.stringify(user);\nconsole.log(json); // {"name":"Bob","age":40}' },
  { id: 'WSqHFHxDk--6', text: 'Fetch API', type: 'heading', level: 2, anchor: 'the-fetch-api' },
  { id: 'EVA96IB1D_Qe', type: 'richtext', html: '<p><code>fetch()</code> ফাংশনটি <strong>নেটওয়ার্ক রিকোয়েস্ট করতে</strong> (GET, POST, ইত্যাদি) এবং ডেটা গ্রহণ করতে ব্যবহার করা হয় — প্রায়ই JSON ফরম্যাটে।</p>' },
  { id: 'CG2zxrMGZ0eA', text: 'মৌলিক Fetch উদাহরণ (GET রিকোয়েস্ট)', type: 'heading', level: 3, anchor: 'basic-fetch-example-get-request' },
  { id: '83n3SpPhd7dQ', type: 'code', language: 'javascript', code: 'fetch("https://jsonplaceholder.typicode.com/users/1")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error("Error:", error));' },
  { id: 'vdvjWGvoCRzl', text: 'Fetch-এর সাথে async/await ব্যবহার', type: 'heading', level: 3, anchor: 'using-asyncawait-with-fetch' },
  { id: 'eBhLQSUDz68V', type: 'code', language: 'javascript', code: 'async function getUser() {\n  try {\n    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");\n    const data = await response.json();\n    console.log(data);\n   } catch (error) {\n    console.error("Failed to fetch:", error);\n  }\n}\n                                \ngetUser();' },
  { id: 'yiU0OeX0tFdP', text: 'Fetch দিয়ে POST রিকোয়েস্ট করা', type: 'heading', level: 3, anchor: 'making-a-post-request-with-fetch' },
  { id: 'ABJlfTd_trEQ', type: 'code', language: 'javascript', code: 'const newUser = {\n  name: "Charlie",\n  email: "charlie@example.com"\n};\n                                \nfetch("https://jsonplaceholder.typicode.com/users", {\n   method: "POST",\n  headers: {\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify(newUser)\n})\n  .then(res => res.json())\n  .then(data => console.log("User added:", data))\n  .catch(err => console.error(err));' },
  { id: '9wyWu-ssZnkN', text: 'সাধারণ JSON ভুল', type: 'heading', level: 2, anchor: 'common-json-mistakes' },
  { id: 'aOX4VOW5pjlH', type: 'table', header: ['ভুল', 'ব্যাখ্যা'], rows: [
    ['সিঙ্গেল কোট ব্যবহার করা', 'JSON-এ <strong>ডাবল কোট</strong> লাগে'],
    ['ট্রেইলিং কমা', 'JSON-এ অনুমোদিত নয়'],
    ['Undefined ভ্যালু', 'JSON <code>undefined</code> সমর্থন করে না'],
    ['সার্কুলার রেফারেন্স', 'সার্কুলার ডেটাতে JSON.stringify() ব্যর্থ হয়'],
  ] },
  { id: 'S5-_jYqdzYg4', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: 'cT3WIF7M-vla', type: 'richtext', html: `<ul>
                                <li>JSON হলো ওয়েবে ডেটা আদান-প্রদানের স্ট্যান্ডার্ড ফরম্যাট।</li>
                                <li>JSON-কে অবজেক্টে রূপান্তর করতে <code>JSON.parse()</code> এবং উল্টোটার জন্য <code>JSON.stringify()</code> ব্যবহার করুন।</li>
                                <li>সার্ভার থেকে ডেটা get/post করতে <code>fetch()</code> API ব্যবহার করুন।</li>
                                <li>আপনার অ্যাপ স্থিতিশীল রাখতে সবসময় এরর হ্যান্ডেল করুন।</li>
                              </ul>` },
  { id: 'iXtgCc-jyTF2', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'WrfqBrebwQzs', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'r0qmtMwbD3Ra', type: 'richtext', html: `<ol>
                                  <li>একটি JSON স্ট্রিংকে একটি JS অবজেক্টে রূপান্তর করুন এবং এর প্রপার্টি অ্যাক্সেস করুন।</li>
                                  <li>একটি JS অবজেক্টকে একটি JSON স্ট্রিংয়ে রূপান্তর করুন এবং সেটি লগ করুন।</li>
                                  <li>একটি ডামি API থেকে পোস্টের তালিকা আনতে <code>fetch()</code> ব্যবহার করুন এবং সেগুলো দেখান।</li>
                                  <li>fetch() এবং JSON.stringify() ব্যবহার করে একটি নতুন রেকর্ড পোস্ট করুন।</li>
                                  <li><code>.catch()</code> বা <code>try...catch</code> দিয়ে এরর হ্যান্ডেল করুন।</li>
                              </ol>` },
]

const toc = [
  { id: 'what-is-json', text: 'JSON কী?', level: 2 },
  { id: 'json-syntax-rules', text: 'JSON সিনট্যাক্স নিয়ম:', level: 2 },
  { id: 'example', text: 'উদাহরণ:', level: 3 },
  { id: 'converting-between-json-and-javascript', text: 'JSON এবং জাভাস্ক্রিপ্টের মধ্যে রূপান্তর', level: 2 },
  { id: 'json-javascript-parsing', text: 'JSON ➡️ জাভাস্ক্রিপ্ট (পার্সিং)', level: 3 },
  { id: 'javascript-json-stringifying', text: 'জাভাস্ক্রিপ্ট ➡️ JSON (স্ট্রিংগিফাইং)', level: 3 },
  { id: 'the-fetch-api', text: 'Fetch API', level: 2 },
  { id: 'basic-fetch-example-get-request', text: 'মৌলিক Fetch উদাহরণ (GET রিকোয়েস্ট)', level: 3 },
  { id: 'using-asyncawait-with-fetch', text: 'Fetch-এর সাথে async/await ব্যবহার', level: 3 },
  { id: 'making-a-post-request-with-fetch', text: 'Fetch দিয়ে POST রিকোয়েস্ট করা', level: 3 },
  { id: 'common-json-mistakes', text: 'সাধারণ JSON ভুল', level: 2 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/json-and-data-fetching: 1/1 written')
