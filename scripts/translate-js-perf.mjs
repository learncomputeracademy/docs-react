import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '5fa8805e-897e-4dbb-9d84-bb8397d31566' // javascript/performance-optimization
const title = 'জাভাস্ক্রিপ্ট পারফরম্যান্স অপ্টিমাইজেশন'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'DOM ম্যানিপুলেশন কমানো, debounce/throttle, দক্ষ ডেটা স্ট্রাকচার এবং লেজি লোডিং দিয়ে জাভাস্ক্রিপ্ট পারফরম্যান্স উন্নত করুন।'

const blocks = [
  { id: 'MF6sAaOYK5Ys', type: 'richtext', html: '<p><em>(আপনার জাভাস্ক্রিপ্ট অ্যাপ্লিকেশনকে দ্রুততর, মসৃণ এবং আরও কার্যকর করে তোলা)</em></p>\n<hr>' },
  { id: 'OpnW-jKpL58W', text: 'কেন জাভাস্ক্রিপ্ট অপ্টিমাইজ করবেন?', type: 'heading', level: 2, anchor: 'why-optimize-javascript' },
  { id: 'AsAN56KoTtd0', type: 'richtext', html: `<p>জাভাস্ক্রিপ্ট ব্রাউজারে চলে। খারাপ পারফরম্যান্সের কারণে হতে পারে:</p>
<ul>
                                  <li>ধীর পেজ লোড টাইম</li>
                                  <li>ল্যাগি UI ও অ্যানিমেশন</li>
                                  <li>খারাপ ব্যবহারকারী অভিজ্ঞতা</li>
                                  <li>মোবাইলে বেশি ব্যাটারি/ডেটা খরচ</li>
                                </ul>
<p>আপনার কোড অপ্টিমাইজ করলে নিশ্চিত হয়:</p>
<ul>
                                  <li>✅ দ্রুততর পারফরম্যান্স</li>
                                  <li>✅ ভালো SEO</li>
                                  <li>✅ সন্তুষ্ট ব্যবহারকারী</li>
                                </ul>` },
  { id: 'VaA3VOjIifyt', text: '১. DOM ম্যানিপুলেশন কমান', type: 'heading', level: 2, anchor: '1-minimize-dom-manipulations' },
  { id: 'uUkRq5NEQnOY', text: '❌ অদক্ষ:', type: 'heading', level: 3, anchor: 'inefficient' },
  { id: 'sXeCsnvEYHio', type: 'code', language: 'javascript', code: 'for (let i = 0; i < 1000; i++) {\n  const div = document.createElement("div");\n  document.body.appendChild(div);\n}' },
  { id: 'EOz-8xMKNyCF', text: '✅ ভালো:', type: 'heading', level: 3, anchor: 'better' },
  { id: 'A1wjMPpE55ms', type: 'code', language: 'javascript', code: 'const fragment = document.createDocumentFragment();\nfor (let i = 0; i < 1000; i++) {\n  const div = document.createElement("div");\n  fragment.appendChild(div);\n}\ndocument.body.appendChild(fragment);' },
  { id: 'kYAb9TQ2vx3b', type: 'richtext', html: '<p><code>DocumentFragment</code> ব্যবহার করলে লেআউট রিক্যালকুলেশন এবং রিপেইন্টিং কমে।</p>' },
  { id: 'zUl29Zi2NI1Z', text: '২. Debouncing ও Throttling', type: 'heading', level: 2, anchor: '2-debouncing-and-throttling' },
  { id: '7Ty_MjMfGARG', text: 'Debounce (টাইপিংয়ের মতো ইভেন্টের জন্য এক্সিকিউশন ফ্রিকোয়েন্সি সীমিত করা):', type: 'heading', level: 3, anchor: 'debounce-limit-execution-frequency-for-events-like-typing' },
  { id: 'TRa1D7DnaDij', type: 'code', language: 'javascript', code: 'function debounce(fn, delay) {\n  let timeout;\n  return function () {\n    clearTimeout(timeout);\n    timeout = setTimeout(fn, delay);\n  };\n}\n\nwindow.addEventListener("resize", debounce(() => {\n  console.log("Resized!");\n}, 300));' },
  { id: 'PG1CXzlWwibT', text: 'Throttle (প্রতি ইন্টারভালে একবার কল সীমিত করা):', type: 'heading', level: 3, anchor: 'throttle-limit-calls-to-once-per-interval' },
  { id: '1l2x3eXI45pt', type: 'code', language: 'javascript', code: 'function throttle(fn, limit) {\n  let lastCall = 0;\n  return function () {\n    const now = Date.now();\n    if (now - lastCall >= limit) {\n      lastCall = now;\n      fn();\n    }\n  };\n}' },
  { id: 'mgxzdccH7HNE', text: '৩. অপ্রয়োজনীয় লুপ ও রিক্যালকুলেশন এড়ান', type: 'heading', level: 2, anchor: '3-avoid-unnecessary-loops-and-recalculations' },
  { id: 'OuK8ujbEV5Bw', text: '❌ গণনার পুনরাবৃত্তি:', type: 'heading', level: 3, anchor: 'repeating-calculations' },
  { id: 'IsTyCdDdcQwO', type: 'code', language: 'javascript', code: 'for (let i = 0; i < array.length; i++) {\n  if (array.length > 0) { /* অপ্রয়োজনীয় চেক */ }\n}' },
  { id: 'G9rdKXLE4W0t', text: '✅ অপ্টিমাইজ করুন:', type: 'heading', level: 3, anchor: 'optimize' },
  { id: 'lvokTULMbR7J', type: 'code', language: 'javascript', code: 'const len = array.length;\nfor (let i = 0; i < len; i++) {\n  // ...\n}' },
  { id: 'SMdqD2SNX88k', type: 'richtext', html: '<p>এছাড়াও, সম্ভব হলে নেস্টেড লুপ এড়িয়ে চলুন বা <code>map()</code>, <code>filter()</code>, বা <code>reduce()</code> কার্যকরভাবে ব্যবহার করুন।</p>' },
  { id: 'UHrajf_yXLJW', text: '৪. দক্ষ ডেটা স্ট্রাকচার ব্যবহার করুন', type: 'heading', level: 2, anchor: '4-use-efficient-data-structures' },
  { id: 'Fzhr0scQWFdw', type: 'richtext', html: `<ul>
                                  <li>ইউনিক ভ্যালুর জন্য অ্যারের বদলে <code>Set</code> ব্যবহার করুন।</li>
                                  <li>key-value স্টোরেজের জন্য সাধারণ অবজেক্টের বদলে <code>Map</code> ব্যবহার করুন।</li>
                                  <li>প্রয়োজন না হলে গভীর নেস্টেড লুপ এবং বড় অবজেক্ট কপি এড়িয়ে চলুন।</li>
                                </ul>` },
  { id: 'qrCJFIQHE0pz', text: '৫. Lazy Loading এবং কোড স্প্লিটিং', type: 'heading', level: 2, anchor: '5-lazy-loading-code-splitting' },
  { id: 'hMxAoobjZT6S', type: 'richtext', html: '<p>শুধু যা দরকার তাই লোড করুন।</p>' },
  { id: 'rJfHFnhuMUdl', text: 'import()-এর মাধ্যমে Lazy Load:', type: 'heading', level: 3, anchor: 'lazy-load-with-import' },
  { id: '9FU0rlya1r3p', type: 'code', language: 'javascript', code: 'button.addEventListener("click", async () => {\n  const { heavyFunction } = await import("./heavy.js");\n  heavyFunction();\n});' },
  { id: '_LH58nQBw3zc', text: 'Webpack-এ কোড স্প্লিটিং:', type: 'heading', level: 3, anchor: 'code-splitting-in-webpack' },
  { id: 'YIJUP-wIgVoC', type: 'richtext', html: '<p>প্রাথমিক লোড কমাতে বড় জাভাস্ক্রিপ্ট বান্ডেলকে ছোট ছোট চাঙ্কে ভাগ করুন।</p>' },
  { id: 'MsLgwZKFibum', text: '৬. জাভাস্ক্রিপ্ট মিনিফাই ও কমপ্রেস করুন', type: 'heading', level: 2, anchor: '6-minify-and-compress-javascript' },
  { id: 'cuDZCrih4KUK', type: 'richtext', html: `<p>মিনিফিকেশন হোয়াইটস্পেস, কমেন্ট সরায় এবং ভেরিয়েবলের নাম ছোট করে।</p>
<p>এই ধরনের টুল ব্যবহার করুন:</p>
<ul>
                                  <li><strong>Terser</strong></li>
                                  <li><strong>UglifyJS</strong></li>
                                  <li><code>mode: 'production'</code>-সহ <strong>Webpack</strong></li>
                                </ul>
<p>আপনার সার্ভারে Gzip বা Brotli কম্প্রেশনও চালু করুন।</p>` },
  { id: 'mF9RMZIN-gIt', text: '৭. মেমরি লিক এড়ান', type: 'heading', level: 2, anchor: '7-avoid-memory-leaks' },
  { id: 'ZzLtrPE61BDa', type: 'richtext', html: `<ul>
                                  <li>অব্যবহৃত ইভেন্ট লিসেনার সরিয়ে ফেলুন।</li>
                                  <li>গ্লোবাল ভেরিয়েবল এড়িয়ে চলুন।</li>
                                  <li>বড় অব্যবহৃত অবজেক্ট বা DOM রেফারেন্স null করে দিন।</li>
                                </ul>` },
  { id: 'RKfZzg4Zlo3E', type: 'code', language: 'javascript', code: 'element.removeEventListener("click", handler);\nelement = null;' },
  { id: 'ojHGg9GvW6z0', text: '৮. পারফরম্যান্স টুল ব্যবহার করুন', type: 'heading', level: 2, anchor: '8-use-performance-tools' },
  { id: '5X1KFFbU0KzY', type: 'richtext', html: `<ul>
                                    <li><strong>Chrome DevTools &gt; Performance ট্যাব</strong>: JS রানটাইম প্রোফাইল করুন</li>
                                    <li><strong>Lighthouse</strong>: বিশ্লেষণ করে উন্নতির পরামর্শ দেয়</li>
                                    <li><strong>WebPageTest / GTMetrix</strong>: লোড টাইম এবং বাধা পরীক্ষা করুন</li>
                                  </ul>` },
  { id: 'XEmZMMPO7gEK', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: 'RYfmKrEWjJKx', type: 'table', header: ['কৌশল', 'সুবিধা'], rows: [
    ['<code>DocumentFragment</code>', 'কম DOM আপডেট'],
    ['<code>debounce()</code> / <code>throttle()</code>', 'আরও মসৃণ ইভেন্ট হ্যান্ডলিং'],
    ['<code>Map</code> / <code>Set</code>', 'বড় ডেটাতে ভালো পারফরম্যান্স'],
    ['Lazy loading', 'দ্রুত প্রাথমিক পেজ লোড'],
    ['JS মিনিফাই ও কমপ্রেস করা', 'ছোট ডাউনলোড সাইজ'],
  ] },
  { id: 'Txi1kPagreTU', type: 'richtext', html: '<p class="note">দক্ষ জাভাস্ক্রিপ্ট শুধু দ্রুতই নয় — এটি স্মার্ট এবং স্কেলেবলও বটে।</p>' },
  { id: 'NpugJbV5hRWO', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'YMJ9jsVd8ckT', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'VvdEW09JxrGP', type: 'richtext', html: `<ol>
                                    <li>একটি লুপ DOM অপারেশনকে <code>DocumentFragment</code> ব্যবহার করতে রূপান্তর করুন।</li>
                                    <li>একটি <code>scroll</code> বা <code>resize</code> ইভেন্টে debounce প্রয়োগ করুন।</li>
                                    <li>ডুপ্লিকেট সরাতে অ্যারের বদলে <code>Set</code> ব্যবহার করুন।</li>
                                    <li>একটি লেজি-লোডিং <code>import()</code> ফাংশন তৈরি করুন।</li>
                                    <li>Chrome DevTools-এর Performance ট্যাবে একটি নমুনা স্ক্রিপ্ট প্রোফাইল করুন।</li>
                              </ol>` },
]

const toc = [
  { id: 'why-optimize-javascript', text: 'কেন জাভাস্ক্রিপ্ট অপ্টিমাইজ করবেন?', level: 2 },
  { id: '1-minimize-dom-manipulations', text: '১. DOM ম্যানিপুলেশন কমান', level: 2 },
  { id: 'inefficient', text: '❌ অদক্ষ:', level: 3 },
  { id: 'better', text: '✅ ভালো:', level: 3 },
  { id: '2-debouncing-and-throttling', text: '২. Debouncing ও Throttling', level: 2 },
  { id: 'debounce-limit-execution-frequency-for-events-like-typing', text: 'Debounce (টাইপিংয়ের মতো ইভেন্টের জন্য এক্সিকিউশন ফ্রিকোয়েন্সি সীমিত করা):', level: 3 },
  { id: 'throttle-limit-calls-to-once-per-interval', text: 'Throttle (প্রতি ইন্টারভালে একবার কল সীমিত করা):', level: 3 },
  { id: '3-avoid-unnecessary-loops-and-recalculations', text: '৩. অপ্রয়োজনীয় লুপ ও রিক্যালকুলেশন এড়ান', level: 2 },
  { id: 'repeating-calculations', text: '❌ গণনার পুনরাবৃত্তি:', level: 3 },
  { id: 'optimize', text: '✅ অপ্টিমাইজ করুন:', level: 3 },
  { id: '4-use-efficient-data-structures', text: '৪. দক্ষ ডেটা স্ট্রাকচার ব্যবহার করুন', level: 2 },
  { id: '5-lazy-loading-code-splitting', text: '৫. Lazy Loading এবং কোড স্প্লিটিং', level: 2 },
  { id: 'lazy-load-with-import', text: 'import()-এর মাধ্যমে Lazy Load:', level: 3 },
  { id: 'code-splitting-in-webpack', text: 'Webpack-এ কোড স্প্লিটিং:', level: 3 },
  { id: '6-minify-and-compress-javascript', text: '৬. জাভাস্ক্রিপ্ট মিনিফাই ও কমপ্রেস করুন', level: 2 },
  { id: '7-avoid-memory-leaks', text: '৭. মেমরি লিক এড়ান', level: 2 },
  { id: '8-use-performance-tools', text: '৮. পারফরম্যান্স টুল ব্যবহার করুন', level: 2 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/performance-optimization: 1/1 written')
