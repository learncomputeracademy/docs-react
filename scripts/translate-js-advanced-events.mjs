import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '991f3739-2533-4b56-b512-8161e297e869' // javascript/advanced-events
const title = 'জাভাস্ক্রিপ্ট ইভেন্ট (অ্যাডভান্সড)'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'ইভেন্ট বাবলিং, ক্যাপচারিং, event.target বনাম event.currentTarget, এবং ইভেন্ট ডেলিগেশন শিখুন।'

const blocks = [
  { id: 'SDbGuLWNCWou', type: 'richtext', html: '<hr>' },
  { id: 'AdMXQVS-kkSV', text: 'পরিচিতি', type: 'heading', level: 2, anchor: 'introduction' },
  { id: '6Ck85sWulf4n', type: 'richtext', html: `<p>এই অধ্যায়ে, জাভাস্ক্রিপ্ট পর্দার আড়ালে কীভাবে ইভেন্ট হ্যান্ডেল করে তা নিয়ে আমরা আরও গভীরে যাব, যার মধ্যে আছে:</p>
<ul>
                                    <li>ইভেন্ট বাবলিং বনাম ক্যাপচারিং</li>
                                    <li><code>event.target</code> বনাম <code>event.currentTarget</code></li>
                                    <li>ইভেন্ট ডেলিগেশন</li>
                                    <li>ইভেন্ট প্রোপাগেশন প্রতিরোধ করা</li>
                                </ul>
<p>স্কেলেবল, ডাইনামিক UI তৈরির জন্য এই ধারণাগুলো বোঝা অপরিহার্য — বিশেষ করে লিস্ট, টেবিল, ফর্ম এবং SPA-তে।</p>` },
  { id: 'T2SZk9AfRSk4', text: 'ইভেন্ট বাবলিং (ডিফল্ট আচরণ)', type: 'heading', level: 2, anchor: 'event-bubbling-default-behavior' },
  { id: 'nHAmakrJSXUb', type: 'richtext', html: '<p>ডিফল্টভাবে, ইভেন্ট DOM ট্রিতে উপরে বাবল করে — টার্গেট এলিমেন্ট থেকে শুরু করে এর পূর্বপুরুষদের দিকে যায়।</p>' },
  { id: 'bMdNiGWORHRM', type: 'code', language: 'html', code: '<div id="parent">\n  <button id="child">Click Me</button>\n</div>' },
  { id: 'wOHYVbcXTpVi', type: 'code', language: 'javascript', code: 'document.getElementById("child").addEventListener("click", () => {\n  console.log("Child clicked");\n});\n                                  \ndocument.getElementById("parent").addEventListener("click", () => {\n  console.log("Parent clicked");\n});' },
  { id: 'el_eCfaiDj5Z', type: 'richtext', html: '<p>বাটনে ক্লিক করলে আউটপুট:</p>' },
  { id: 'sY3Le51UkIpC', type: 'code', language: 'javascript', code: 'Child clicked\nParent clicked' },
  { id: '-uncF1g7WWzD', type: 'richtext', html: '<p>👉 এমনটা হয় কারণ ইভেন্টটি চাইল্ড থেকে প্যারেন্টের দিকে "বাবল" করে। <a href="https://www.youtube.com/watch?v=Pd70u1fBcxU" target="_blank">ইভেন্ট বাবলিং</a> সম্পর্কে আরও জানুন।</p>' },
  { id: 'tSQUnlmecYR7', text: 'বাবলিং থামানো', type: 'heading', level: 2, anchor: 'stopping-bubbling' },
  { id: 'lvESBX54sBzI', type: 'richtext', html: '<p>ইভেন্টকে উপরে বাবল করা থেকে আটকাতে <strong>event.stopPropagation()</strong> ব্যবহার করুন।</p>' },
  { id: 'GNw9vebeORU7', type: 'code', language: 'javascript', code: 'document.getElementById("child").addEventListener("click", function (event) {\n  event.stopPropagation();\n  console.log("Only child clicked");\n});' },
  { id: 'GeuZN7VxTnyg', type: 'richtext', html: '<p>এখন, বাটনে ক্লিক করলে প্যারেন্টের লিসেনার ট্রিগার হবে না।</p>' },
  { id: 'Y2x-MwMEgKFb', text: 'ইভেন্ট ক্যাপচারিং (আরও জটিল)', type: 'heading', level: 2, anchor: 'event-capturing-trickier' },
  { id: '9C5wLwD_TI3P', type: 'richtext', html: '<p>ক্যাপচারিং হলো বাবলিং-এর বিপরীত: টার্গেটে পৌঁছানোর আগে ইভেন্টটি DOM-এ উপর থেকে নিচে যায়।</p>\n<p><strong>addEventListener()</strong>-এর ৩য় প্যারামিটার দিয়ে ক্যাপচারিং সক্ষম করুন:</p>' },
  { id: 'eby-J9jKbNs5', type: 'code', language: 'javascript', code: 'element.addEventListener("click", handler, true);' },
  { id: 'c97YWLEC3Q-J', type: 'code', language: 'javascript', code: 'document.getElementById("parent").addEventListener("click", () => {\n  console.log("Parent Capturing");\n}, true);\n                                  \ndocument.getElementById("child").addEventListener("click", () => {\n  console.log("Child Bubble");\n});' },
  { id: 'pf-rA7DPkXtd', type: 'richtext', html: '<p>ক্যাপচারিং প্রথমে চলে (<strong>সক্ষম থাকলে</strong>), তারপর বাবলিং।</p>' },
  { id: 'udSgLTOzr-ey', text: 'event.target বনাম event.currentTarget', type: 'heading', level: 2, anchor: 'eventtarget-vs-eventcurrenttarget' },
  { id: 'QqN6XAPeAGt0', type: 'richtext', html: `<ul>
                                    <li><code>event.target</code>: যে <strong>প্রকৃত এলিমেন্ট</strong> ইভেন্টটি ট্রিগার করেছে</li>
                                    <li><code>event.currentTarget</code>: যে <strong>এলিমেন্টে হ্যান্ডলার</strong> সংযুক্ত করা হয়েছে</li>
                                </ul>` },
  { id: 'XdkSUAHPvCNl', type: 'code', language: 'javascript', code: 'document.getElementById("parent").addEventListener("click", function (e) {\n  console.log("Target:", e.target); // কী ক্লিক করা হয়েছিল\n  console.log("Current Target:", e.currentTarget); // #parent\n});' },
  { id: 'w1E02KXxPnQV', text: 'ইভেন্ট ডেলিগেশন (খুবই উপযোগী)', type: 'heading', level: 2, anchor: 'event-delegation-very-useful' },
  { id: 'A-Z6rDQwLHhx', type: 'richtext', html: '<p>একাধিক চাইল্ড এলিমেন্টে আলাদা ইভেন্ট লিসেনার যোগ করার বদলে, তাদের প্যারেন্টে একটি লিসেনার যোগ করুন এবং <code>event.target</code> ব্যবহার করে কোন চাইল্ড এটি ট্রিগার করেছে তা যাচাই করুন।</p>\n<p>টু-ডু লিস্ট বা কমেন্ট সেকশনের মতো ডাইনামিক কনটেন্টের জন্য দারুণ কার্যকর।</p>' },
  { id: 'DRGM5hnsFW-P', text: 'উদাহরণ: ডাইনামিক লিস্ট আইটেমে ক্লিক', type: 'heading', level: 2, anchor: 'example-click-on-dynamic-list-items' },
  { id: 'S00nyyAm6OYG', type: 'code', language: 'html', code: '<ul id="myList">\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>' },
  { id: 'AKEC4p26bR5Z', type: 'code', language: 'javascript', code: 'document.getElementById("myList").addEventListener("click", function (e) {\n  if (e.target.tagName === "LI") {\n    alert("You clicked " + e.target.textContent);\n  }\n});' },
  { id: 'nCthnOn2-b32', type: 'richtext', html: '<p>পরে নতুন <code>&lt;li&gt;</code> আইটেম যোগ হলেও এটি কাজ করে — আবার বাইন্ড করার দরকার নেই!</p>' },
  { id: '4AQCLiDhcoBI', text: 'once অপশন (একবারই হ্যান্ডলার চালান)', type: 'heading', level: 2, anchor: 'once-option-run-a-handler-only-once' },
  { id: 'us0OoWJ1q22u', type: 'code', language: 'javascript', code: 'button.addEventListener("click", function () {\n  alert("You’ll see me only once!");\n}, { once: true });' },
  { id: '3ghZO0yBy2Rt', text: 'সব একসাথে: একটি ব্যবহারিক উদাহরণ', type: 'heading', level: 2, anchor: 'combining-it-all-a-practical-example' },
  { id: 'TFdDpDFGLQvD', type: 'code', language: 'html', code: '<ul id="tasks">\n  <li>Task 1 <button>Delete</button></li>\n  <li>Task 2 <button>Delete</button></li>\n</ul>' },
  { id: 'TdRINXWAuSZ-', type: 'code', language: 'javascript', code: 'document.getElementById("tasks").addEventListener("click", function (e) {\n  if (e.target.tagName === "BUTTON") {\n    e.target.parentElement.remove(); // <li> সরিয়ে দেয়\n  }\n});' },
  { id: 'mFhMlDRE21ke', type: 'richtext', html: '<p>প্রতিটি বাটনে আলাদাভাবে লিসেনার বসানোর চেয়ে এটি অনেক পরিষ্কার এবং কার্যকরী।</p>' },
  { id: 'dnRdt9tPfmqe', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'k4ROGCTiaDDJ', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: '9Rdxy9KiXUgS', type: 'richtext', html: `<ol>
                                    <li>নেস্টেড এলিমেন্ট দিয়ে ইভেন্ট বাবলিং প্রদর্শন করুন।</li>
                                    <li><code>stopPropagation</code> দিয়ে বাবলিং প্রতিরোধ করুন।</li>
                                    <li>একটি লিস্টে ইভেন্ট ডেলিগেশন ব্যবহার করুন, যেখানে একটি আইটেমে ক্লিক করলে তার রঙ পরিবর্তন হয়।</li>
                                    <li><code>{ once: true }</code> ব্যবহার করে একটি "একবার চালানো" বাটন তৈরি করুন।</li>
                                    <li><code>target</code> এবং <code>currentTarget</code> লগ করুন এবং পার্থক্য লক্ষ্য করুন।</li>
                                </ol>` },
]

const toc = [
  { id: 'introduction', text: 'পরিচিতি', level: 2 },
  { id: 'event-bubbling-default-behavior', text: 'ইভেন্ট বাবলিং (ডিফল্ট আচরণ)', level: 2 },
  { id: 'stopping-bubbling', text: 'বাবলিং থামানো', level: 2 },
  { id: 'event-capturing-trickier', text: 'ইভেন্ট ক্যাপচারিং (আরও জটিল)', level: 2 },
  { id: 'eventtarget-vs-eventcurrenttarget', text: 'event.target বনাম event.currentTarget', level: 2 },
  { id: 'event-delegation-very-useful', text: 'ইভেন্ট ডেলিগেশন (খুবই উপযোগী)', level: 2 },
  { id: 'example-click-on-dynamic-list-items', text: 'উদাহরণ: ডাইনামিক লিস্ট আইটেমে ক্লিক', level: 2 },
  { id: 'once-option-run-a-handler-only-once', text: 'once অপশন (একবারই হ্যান্ডলার চালান)', level: 2 },
  { id: 'combining-it-all-a-practical-example', text: 'সব একসাথে: একটি ব্যবহারিক উদাহরণ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/advanced-events: 1/1 written')
