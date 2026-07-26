import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'c6a27355-a056-466d-b536-e3d1590f6589' // javascript/fetch-api
const title = 'জাভাস্ক্রিপ্ট Fetch API ও HTTP রিকোয়েস্ট (অ্যাডভান্সড)'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'GET, POST, PUT, DELETE রিকোয়েস্ট এবং অ্যাডভান্সড fetch হ্যান্ডলিং আয়ত্ত করুন।'

const putDeleteCode = 'fetch("https://jsonplaceholder.typicode.com/posts/1", { method: "PUT",headers: { "Content-Type": "application/json" },\nody: JSON.stringify({\n id: 1,\n title: "Updated Title",\n body: "Updated Body",\nuserId: 1}) })\n.then(res => res.json()\n).then(data => console.log(data));'

const blocks = [
  { id: 'e48i19RwXvW4', type: 'richtext', html: '<p><em>(GET, POST, PUT, DELETE রিকোয়েস্ট এবং অ্যাডভান্সড fetch হ্যান্ডলিং আয়ত্ত করা)</em></p>\n<hr>' },
  { id: 'zt00TUgaiUAP', text: 'Fetch API কী?', type: 'heading', level: 2, anchor: 'what-is-the-fetch-api' },
  { id: 'J3MlyTA1G8U4', type: 'richtext', html: '<p><strong>Fetch API</strong> হলো জাভাস্ক্রিপ্টে HTTP রিকোয়েস্ট করার একটি আধুনিক ইন্টারফেস। এটি একটি <strong>Promise</strong> রিটার্ন করে এবং <code>XMLHttpRequest</code>-এর মতো পুরনো পদ্ধতির চেয়ে বেশি শক্তিশালী ও নমনীয়।</p>' },
  { id: 'z6E_J6gFBrC7', text: 'Fetch-এর মৌলিক গঠন', type: 'heading', level: 2, anchor: 'basic-structure-of-fetch' },
  { id: 'Skl7_gjyMVli', type: 'code', language: 'javascript', code: "fetch(url, {\n method: 'GET' | 'POST' | 'PUT' | 'DELETE',\n headers: {},\n body: JSON.stringify(data) // POST/PUT-এর জন্য\n})\n    .then(response => response.json())\n    .then(data => console.log(data))\n    .catch(error => console.error(error));" },
  { id: 'rDjQ7v5RNy_N', text: 'সাধারণ HTTP মেথড', type: 'heading', level: 2, anchor: 'common-http-methods' },
  { id: 'V0F5l9DLCZbe', type: 'table', header: ['মেথড', 'ব্যবহারের ক্ষেত্র'], rows: [
    ['<code>GET</code>', 'ডেটা সংগ্রহ করা'],
    ['<code>POST</code>', 'নতুন ডেটা পাঠানো'],
    ['<code>PUT</code>', 'বিদ্যমান ডেটা আপডেট করা'],
    ['<code>DELETE</code>', 'ডেটা মুছে ফেলা'],
  ] },
  { id: 'gnqrQ_wlRYpM', text: 'GET রিকোয়েস্টের উদাহরণ', type: 'heading', level: 2, anchor: 'get-request-example' },
  { id: 'Xw3R2gGxjveZ', type: 'code', language: 'javascript', code: 'fetch("https://jsonplaceholder.typicode.com/posts/1")\n  .then(res => res.json())\n  .then(data => console.log(data));' },
  { id: 'hEotTzOGY2Dc', text: 'POST রিকোয়েস্টের উদাহরণ', type: 'heading', level: 2, anchor: 'post-request-example' },
  { id: '01VPcQBeqTJY', type: 'code', language: 'javascript', code: 'fetch("https://jsonplaceholder.typicode.com/posts", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({\n   title: "My Post",\n   body: "Hello World",\n    userId: 1\n  })\n})\n  .then(res => res.json())\n  .then(data => console.log(data));' },
  { id: 'Rv6y6a53DaPA', text: 'PUT রিকোয়েস্টের উদাহরণ', type: 'heading', level: 2, anchor: 'put-request-example' },
  { id: '_jDVCBzux-oP', type: 'code', language: 'javascript', code: putDeleteCode },
  { id: 'lHdmS8GZkbB5', text: 'DELETE রিকোয়েস্টের উদাহরণ', type: 'heading', level: 2, anchor: 'delete-request-example' },
  { id: '0XXuvkDYWaIe', type: 'code', language: 'javascript', code: putDeleteCode },
  { id: 'EVImmeXfZSom', text: 'Authorization হেডার পাঠানো', type: 'heading', level: 2, anchor: 'sending-authorization-headers' },
  { id: 'sH1o966SVqt9', type: 'code', language: 'javascript', code: 'fetch("https://api.example.com/data", {\n  headers: {\n    "Authorization": "Bearer your_token_here"\n  }\n});' },
  { id: 'RuCAxwbV_klJ', text: 'নন-JSON রেসপন্স হ্যান্ডেল করা', type: 'heading', level: 2, anchor: 'handling-non-json-responses' },
  { id: 'sd4b-NQhV3jX', type: 'code', language: 'javascript', code: 'fetch("/page.html")\n.then(response => response.text())\n.then(html => document.body.innerHTML =  html);' },
  { id: 'RbjBi9OvC1s9', text: '⚠️ ম্যানুয়ালি HTTP এরর হ্যান্ডেল করা', type: 'heading', level: 2, anchor: 'handling-http-errors-manually' },
  { id: 'Om2AvgXNUGS6', type: 'richtext', html: '<p>404 বা 500-এর মতো HTTP স্ট্যাটাস কোডের জন্য Fetch এরর থ্রো করে না। আপনাকে নিজেই এগুলো হ্যান্ডেল করতে হবে:</p>' },
  { id: 'eAVXLIV4vnRc', type: 'code', language: 'javascript', code: 'fetch("/notfound")\n.then(response => {\n    if (!response.ok) {\n    throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    return response.json();\n})\n.then(data => console.log(data))\n.catch(err => console.error("Fetch error:", err));' },
  { id: 'hEFGYlXPbj_q', text: 'Fetch-এর সাথে async/await ব্যবহার', type: 'heading', level: 2, anchor: 'using-asyncawait-with-fetch' },
  { id: 'qaFMRnfE9etj', type: 'code', language: 'javascript', code: 'async function getData() {\n  try {\n    const response = await fetch("https://jsonplaceholder.typicode.com/posts");\n    if (!response.ok) throw new Error("Request failed");\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error("Error:", error);\n  }\n}' },
  { id: 'DAnBe27nNanf', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: 'QvK8ywejwP5n', type: 'richtext', html: `<ul>
                                <li>সব ধরনের HTTP রিকোয়েস্ট করতে <code>fetch()</code> ফাংশন ব্যবহার করা হয়।</li>
                                <li>নন-200 স্ট্যাটাস এরর ধরতে সবসময় <code>.ok</code> চেক করুন।</li>
                                <li>POST/PUT রিকোয়েস্টের জন্য headers এবং body ব্যবহার করুন।</li>
                                <li>আরও পরিষ্কার সিনট্যাক্সের জন্য fetch-এর সাথে <code>async/await</code> মেলান।</li>
                                <li>যথাযথ সুরক্ষা ছাড়া ফ্রন্ট এন্ডে স্পর্শকাতর টোকেন পাঠানো এড়িয়ে চলুন।</li>
                              </ul>` },
  { id: 'sm6jyI9pe-uN', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: '37-QLgti2G4w', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: '8zWt7aNRBRNC', type: 'richtext', html: `<ol>
                                    <li>এমন একটি ফাংশন তৈরি করুন যা একটি GET রিকোয়েস্ট করে এবং ব্যবহারকারীদের তালিকা দেখায়।</li>
                                    <li>একটি POST রিকোয়েস্ট ব্যবহার করে একটি API-তে ডেটা সাবমিট করে এমন একটি ফর্ম যোগ করুন।</li>
                                    <li>একটি DELETE রিকোয়েস্টের মাধ্যমে একটি পোস্ট মুছে ফেলে এমন একটি বাটন তৈরি করুন।</li>
                                    <li>fetch ব্যর্থ হলে একটি মেসেজ দেখাতে এরর হ্যান্ডলিং যোগ করুন।</li>
                                    <li>পেজ লোড হওয়ার সময় ডেটা আনতে এবং দেখাতে <code>async/await</code> ব্যবহার করুন।</li>
                              </ol>` },
]

const toc = [
  { id: 'what-is-the-fetch-api', text: 'Fetch API কী?', level: 2 },
  { id: 'basic-structure-of-fetch', text: 'Fetch-এর মৌলিক গঠন', level: 2 },
  { id: 'common-http-methods', text: 'সাধারণ HTTP মেথড', level: 2 },
  { id: 'get-request-example', text: 'GET রিকোয়েস্টের উদাহরণ', level: 2 },
  { id: 'post-request-example', text: 'POST রিকোয়েস্টের উদাহরণ', level: 2 },
  { id: 'put-request-example', text: 'PUT রিকোয়েস্টের উদাহরণ', level: 2 },
  { id: 'delete-request-example', text: 'DELETE রিকোয়েস্টের উদাহরণ', level: 2 },
  { id: 'sending-authorization-headers', text: 'Authorization হেডার পাঠানো', level: 2 },
  { id: 'handling-non-json-responses', text: 'নন-JSON রেসপন্স হ্যান্ডেল করা', level: 2 },
  { id: 'handling-http-errors-manually', text: '⚠️ ম্যানুয়ালি HTTP এরর হ্যান্ডেল করা', level: 2 },
  { id: 'using-asyncawait-with-fetch', text: 'Fetch-এর সাথে async/await ব্যবহার', level: 2 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/fetch-api: 1/1 written')
