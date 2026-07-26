import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '33a8eeeb-f986-4cd2-a6c2-799a82416f76' // javascript/promises-and-async
const title = 'জাভাস্ক্রিপ্ট Promise এবং Async'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'callback, Promise এবং async/await দিয়ে জাভাস্ক্রিপ্টে অ্যাসিঙ্ক্রোনাস কাজ হ্যান্ডেল করা শিখুন।'

const blocks = [
  { id: 'PMMkzzknD9fa', type: 'richtext', html: '<p><em>(API কল, ডিলে, এবং ফাইল লোডিংয়ের মতো অ্যাসিঙ্ক্রোনাস কাজ হ্যান্ডেল করা)</em></p>\n<hr>' },
  { id: '63JT2zSUeHuk', text: 'কেন অ্যাসিঙ্ক্রোনাস প্রোগ্রামিং?', type: 'heading', level: 2, anchor: 'why-asynchronous-programming' },
  { id: 'TRIGi5yN6iXh', type: 'richtext', html: '<p>জাভাস্ক্রিপ্ট <strong>সিঙ্গেল-থ্রেডেড</strong>, অর্থাৎ এটি একবারে একটি কাজ চালায়।</p>\n<p>কিন্তু বাস্তব-জগতের কাজ (যেমন ডেটা আনা বা টাইমারের জন্য অপেক্ষা করা) সময় নিতে পারে।</p>\n<p><strong>অ্যাসিঙ্ক্রোনাস প্রোগ্রামিং</strong> আপনার কোডকে <strong>ব্লক না করে</strong> চলতে দেয়।</p>' },
  { id: 'zKnbDs2609CA', text: 'জাভাস্ক্রিপ্টের সাধারণ অ্যাসিঙ্ক কাজ', type: 'heading', level: 2, anchor: 'common-async-tasks-in-javascript' },
  { id: 'g42vhXL7rgH1', type: 'richtext', html: `<ul>
                                  <li>একটি API থেকে ডেটা আনা</li>
                                  <li>ফাইল পড়া/লেখা (Node.js-এ)</li>
                                  <li>setTimeout / setInterval</li>
                                  <li>ইভেন্ট হ্যান্ডলিং</li>
                                </ul>` },
  { id: '5aEVEPE4dQ-R', text: 'কলব্যাক (পুরনো পদ্ধতি)', type: 'heading', level: 2, anchor: 'callbacks-old-method' },
  { id: 'xCteyr_PgM9e', type: 'code', language: 'javascript', code: 'function getData(callback) {\n  setTimeout(() => {\n    callback("Data loaded");\n  }, 1000);\n}\n                                \ngetData((result) => {\n  console.log(result); // Data loaded\n});' },
  { id: '8M9L2rfMo9lN', type: 'richtext', html: '<p>⚠️ <strong>সমস্যা</strong>: Callback Hell — নেস্টেড কলব্যাক পড়া ও ডিবাগ করা কঠিন।</p>' },
  { id: 'oRGg9o3qVWx5', text: 'Promise (আধুনিক পদ্ধতি)', type: 'heading', level: 2, anchor: 'promises-modern-way' },
  { id: 'MLlUE7qdWkNt', type: 'richtext', html: '<p>একটি <strong>Promise</strong> হলো একটি অবজেক্ট যা একটি অ্যাসিঙ্ক অপারেশনের <strong>ভবিষ্যৎ মান</strong> প্রতিনিধিত্ব করে।</p>' },
  { id: 'Sqq61Tt0yhVk', text: 'Promise-এর অবস্থা:', type: 'heading', level: 3, anchor: 'states-of-a-promise' },
  { id: 'WKAwfTR4ixym', type: 'richtext', html: `<ul>
                                  <li>Pending (মুলতুবি)</li>
                                  <li>Fulfilled (সম্পন্ন)</li>
                                  <li>Rejected (প্রত্যাখ্যাত)</li>
                                </ul>` },
  { id: '8yex562XUsiZ', text: 'একটি Promise তৈরি করা', type: 'heading', level: 3, anchor: 'creating-a-promise' },
  { id: 'YJ3LToLxrdrV', type: 'code', language: 'javascript', code: 'const myPromise = new Promise((resolve, reject) => {\n  let success = true;\n  setTimeout(() => {\n    if (success) resolve("Success!");\n    else reject("Error occurred");\n  }, 1000);\n});' },
  { id: 'QZH7ZLVDXb23', text: 'একটি Promise ব্যবহার করা', type: 'heading', level: 3, anchor: 'consuming-a-promise' },
  { id: 'gDoygJN92bbj', type: 'code', language: 'javascript', code: 'myPromise\n  .then((value) => {\n    console.log(value); // Success!\n  })\n  .catch((error) => {\n    console.error(error);\n  })\n  .finally(() => {\n    console.log("Promise completed");\n  });' },
  { id: 'rhAA1Bo_Yq4T', text: 'fetch()-সহ বাস্তব উদাহরণ', type: 'heading', level: 3, anchor: 'real-example-with-fetch' },
  { id: 'Rdy_9I8-cgjN', type: 'code', language: 'javascript', code: 'fetch("https://jsonplaceholder.typicode.com/posts/1")\n  .then((response) => response.json())\n  .then((data) => console.log(data))\n  .catch((err) => console.error(err));' },
  { id: 'lWSMyYVOBsXp', text: 'Async/Await (Promise-এর জন্য সিনট্যাক্টিক সুগার)', type: 'heading', level: 3, anchor: 'asyncawait-syntactic-sugar-for-promises' },
  { id: 'fVcMVuCCc8nn', type: 'richtext', html: '<p><code>async</code> একটি ফাংশনকে একটি promise রিটার্ন করায়।</p>\n<p><code>await</code> promise-টি resolve হওয়ার জন্য অপেক্ষা করে।</p>' },
  { id: 'l4KhW7J20iGY', type: 'code', language: 'javascript', code: 'async function getPost() {\n  try {\n    const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");\n    const data = await response.json();\n    console.log(data);\n  } catch (err) {\n    console.error("Error:", err);\n  }\n}\n                                \ngetPost();' },
  { id: 'GQW5DWRSvx30', type: 'richtext', html: '<p><code>.then()</code> চেইনিং-এর চেয়ে এটি বেশি পঠনযোগ্য।</p>' },
  { id: 'voy_aFPEx9oY', text: 'setTimeout / setInterval (ডিলে ফাংশন)', type: 'heading', level: 2, anchor: 'settimeout-setinterval-delay-functions' },
  { id: 'BDDIid1lW_y3', type: 'code', language: 'javascript', code: 'setTimeout(() => {\n  console.log("Runs after 2 seconds");\n}, 2000);\n                                \nlet counter = 0;\nconst intervalId = setInterval(() => {\n  counter++;\n  console.log(counter);\n  if (counter === 3) clearInterval(intervalId);\n}, 1000);' },
  { id: 'eCQxcmHeOiOu', text: 'Promise.all এবং Promise.race', type: 'heading', level: 2, anchor: 'promiseall-and-promiserace' },
  { id: 'ase0ZjVzD23O', type: 'code', language: 'javascript', code: 'const p1 = Promise.resolve("First");\nconst p2 = Promise.resolve("Second");\n                                  \nPromise.all([p1, p2]).then(values => console.log(values)); // [ "First", "Second" ]\n                                  \nPromise.race([p1, p2]).then(value => console.log(value)); // "First" (যেটি প্রথমে resolve হয়)' },
  { id: 'ppZnRt_7aljn', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: 'RKWj-65ljIqt', type: 'richtext', html: `<ul>
                                  <li>Promise, কলব্যাকের চেয়ে অ্যাসিঙ্ক কাজ আরও পরিষ্কারভাবে হ্যান্ডেল করে।</li>
                                  <li><code>async/await</code> কোডকে পরিষ্কার ও পড়তে সহজ করে তোলে।</li>
                                  <li>এরর হ্যান্ডেল করতে সবসময় <code>catch()</code> বা <code>try...catch</code> ব্যবহার করুন।</li>
                                  <li><code>Promise.all</code> সব promise-এর জন্য অপেক্ষা করে; <code>Promise.race</code> প্রথমটি রিটার্ন করে।</li>
                                </ul>` },
  { id: 'xdHL-FfWXGDC', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: '1iA3-cqeqHKx', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'yZVZCyF4NuVJ', type: 'richtext', html: `<ol>
                                  <li>এমন একটি Promise তৈরি করুন যা ২ সেকেন্ড পরে resolve হয় এবং একটি মেসেজ লগ করে।</li>
                                  <li>একটি পাবলিক API থেকে ব্যবহারকারীদের তালিকা আনতে <code>fetch()</code> ব্যবহার করুন।</li>
                                  <li>এমন একটি async ফাংশন লিখুন যা ডেটা আনতে ও দেখাতে <code>await</code> ব্যবহার করে।</li>
                                  <li><code>async/await</code>-এর সাথে <code>try...catch</code> দিয়ে এরর ধরার চেষ্টা করুন।</li>
                                  <li>আনা ডেটা প্রসেস করতে একাধিক <code>.then()</code> মেথড চেইন করুন।</li>
                              </ol>` },
]

const toc = [
  { id: 'why-asynchronous-programming', text: 'কেন অ্যাসিঙ্ক্রোনাস প্রোগ্রামিং?', level: 2 },
  { id: 'common-async-tasks-in-javascript', text: 'জাভাস্ক্রিপ্টের সাধারণ অ্যাসিঙ্ক কাজ', level: 2 },
  { id: 'callbacks-old-method', text: 'কলব্যাক (পুরনো পদ্ধতি)', level: 2 },
  { id: 'promises-modern-way', text: 'Promise (আধুনিক পদ্ধতি)', level: 2 },
  { id: 'states-of-a-promise', text: 'Promise-এর অবস্থা:', level: 3 },
  { id: 'creating-a-promise', text: 'একটি Promise তৈরি করা', level: 3 },
  { id: 'consuming-a-promise', text: 'একটি Promise ব্যবহার করা', level: 3 },
  { id: 'real-example-with-fetch', text: 'fetch()-সহ বাস্তব উদাহরণ', level: 3 },
  { id: 'asyncawait-syntactic-sugar-for-promises', text: 'Async/Await (Promise-এর জন্য সিনট্যাক্টিক সুগার)', level: 3 },
  { id: 'settimeout-setinterval-delay-functions', text: 'setTimeout / setInterval (ডিলে ফাংশন)', level: 2 },
  { id: 'promiseall-and-promiserace', text: 'Promise.all এবং Promise.race', level: 2 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/promises-and-async: 1/1 written')
