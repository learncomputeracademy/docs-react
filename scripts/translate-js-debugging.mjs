import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'a1bfcf49-c440-4e8e-961c-065d11cf9abc' // javascript/debugging-techniques
const title = 'জাভাস্ক্রিপ্ট ডিবাগিং টেকনিক'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'console.log, breakpoint, debugger কীওয়ার্ড, try...catch এবং স্ট্যাক ট্রেস দিয়ে জাভাস্ক্রিপ্ট কোড ডিবাগ করা শিখুন।'

const blocks = [
  { id: 's8XlduWYxIdQ', type: 'richtext', html: '<p><em>(আত্মবিশ্বাসের সাথে আপনার জাভাস্ক্রিপ্ট কোডের সমস্যা চিহ্নিত করা, পরীক্ষা করা এবং সমাধান করা)</em></p>\n<hr>' },
  { id: 'NTzLJvCAILfX', text: 'ডিবাগিং কী?', type: 'heading', level: 2, anchor: 'what-is-debugging' },
  { id: 'g7cuematlLoU', type: 'richtext', html: '<p><strong>ডিবাগিং</strong> হলো আপনার কোডে ত্রুটি (bug) <strong>খুঁজে বের করে সমাধান করার</strong> প্রক্রিয়া। কী ভুল হচ্ছে এবং কেন হচ্ছে তা বুঝতে জাভাস্ক্রিপ্ট বেশ কিছু টুল ও টেকনিক দেয়।</p>' },
  { id: 'HtlIeJkR7fgA', text: '১. বুদ্ধিমত্তার সাথে console.log() ব্যবহার করুন', type: 'heading', level: 2, anchor: '1-use-consolelog-wisely' },
  { id: 'VgwU5w10StYF', type: 'richtext', html: '<p>ডিবাগ করার সবচেয়ে সহজ ও সাধারণ উপায়:</p>' },
  { id: 'lR1bCJCoVNaz', type: 'code', language: 'javascript', code: 'const total = calculateTotal(100, 5);\nconsole.log("Total:", total);' },
  { id: '445HIdrpI5WR', text: 'টিপস:', type: 'heading', level: 3, anchor: 'tips' },
  { id: 'K7xg1mo270J_', type: 'richtext', html: `<ul>
                                  <li>অর্থবহ লেবেল ব্যবহার করুন।</li>
                                  <li>অবজেক্ট বা অ্যারে পরীক্ষা করতে সেগুলো লগ করুন।</li>
                                  <li>একটি টেবিলে ডেটা দেখাতে <code>console.table()</code> ব্যবহার করুন।</li>
                                </ul>` },
  { id: 'XUrUU2tIGPjE', text: '২. Console মেথড বোঝা', type: 'heading', level: 2, anchor: '2-understanding-console-methods' },
  { id: 'Rgjgux3_AckY', type: 'code', language: 'javascript', code: 'console.warn("This is a warning");\nconsole.error("This is an error");\nconsole.info("Some information");\nconsole.table([{name: "Alice", age: 25}, {name: "Bob", age: 30}]);' },
  { id: 'xxHkrc9KD9Uf', text: '৩. ডেভেলপার টুলসে ব্রেকপয়েন্ট', type: 'heading', level: 2, anchor: '3-breakpoints-in-developer-tools' },
  { id: '25RNrU_JVFCm', type: 'richtext', html: `<p>বেশিরভাগ ব্রাউজারে (Chrome, Firefox, Edge) বিল্ট-ইন <code>DevTools</code> থাকে।</p>
<p>এগুলো করতে Sources ট্যাব ব্যবহার করুন:</p>
<ul>
                                  <li>আপনার স্ক্রিপ্ট ফাইল খুলুন</li>
                                  <li>একটি <strong>ব্রেকপয়েন্ট</strong> সেট করতে লাইন নম্বরে ক্লিক করুন</li>
                                  <li>সেখানে কোড এক্সিকিউশন পজ করতে পেজ রিলোড করুন</li>
                                </ul>
<p>আপনি পারবেন:</p>
<ul>
                                  <li>লাইন বাই লাইন কোডের মধ্য দিয়ে যেতে</li>
                                  <li>ভেরিয়েবল পরীক্ষা করতে</li>
                                  <li>এক্সপ্রেশন ওয়াচ করতে</li>
                                </ul>` },
  { id: '64zDnwzAtCFg', text: '৪. debugger কীওয়ার্ড ব্যবহার করা', type: 'heading', level: 2, anchor: '4-using-debugger-keyword' },
  { id: 'YfQlU1ESCypC', type: 'richtext', html: '<p>একটি ব্রেকপয়েন্ট ট্রিগার করতে আপনার কোডে <code>debugger</code> স্টেটমেন্ট যোগ করুন:</p>' },
  { id: 'kMYJmGyocaIo', type: 'code', language: 'javascript', code: 'function calculate(a, b) {\n  debugger; // এখানে এক্সিকিউশন পজ হয়\n  return a + b;\n}' },
  { id: 'au4ACyu6Q2Ws', type: 'richtext', html: '<p>DevTools খুলুন এবং পেজ রিলোড করুন — আপনার কোড এই লাইনে পজ হয়ে যাবে।</p>' },
  { id: 'uZx14VfpDdyK', text: '৫. try...catch দিয়ে এরর ধরা', type: 'heading', level: 2, anchor: '5-catching-errors-with-trycatch' },
  { id: '29uG0ihT4JZP', type: 'richtext', html: '<p>রানটাইম এরর সুন্দরভাবে হ্যান্ডেল ও পরীক্ষা করতে <code>try...catch</code> ব্যবহার করুন:</p>' },
  { id: 'CdNNA99wGaPZ', type: 'code', language: 'javascript', code: 'try {\n  riskyFunction();\n} catch (error) {\n  console.error("Error caught:", error.message);\n}' },
  { id: 'Ru3GkYX_4ZqQ', type: 'richtext', html: '<p>সবসময় চলে এমন ক্লিনআপ কোডের জন্য ঐচ্ছিক <code>finally</code> যোগ করুন:</p>' },
  { id: 'r1bGicdcdaqb', type: 'code', language: 'javascript', code: 'finally {\n  console.log("Cleaning up...");\n}' },
  { id: 'hZJcFH_pON1C', text: '৬. স্ট্যাক ট্রেস বোঝা', type: 'heading', level: 2, anchor: '6-understanding-stack-traces' },
  { id: 'woa--ZHFRInN', type: 'richtext', html: '<p>একটি এরর হলে, জাভাস্ক্রিপ্ট একটি <strong>স্ট্যাক ট্রেস</strong> দেখায়:</p>' },
  { id: 'H7VOk5aNOwa9', type: 'code', language: 'javascript', code: 'TypeError: Cannot read properties of undefined\n    at doSomething (app.js:12)\n    at main (app.js:20)' },
  { id: 'saXGDCRAU-UU', type: 'richtext', html: `<p>এটি আপনাকে জানায়:</p>
<ul>
                                  <li>এররটি কী ছিল</li>
                                  <li>এটি কোথায় ঘটেছে</li>
                                  <li>কোন ফাংশন কল এর দিকে নিয়ে গেছে</li>
                                </ul>
<p>বাগের উৎসে ফিরে যেতে এটি ব্যবহার করুন।</p>` },
  { id: '542I1RTrzzIT', text: '৭. ভেরিয়েবল ওয়াচ করা', type: 'heading', level: 2, anchor: '7-watching-variables' },
  { id: 'Dj4BNaEugbk4', type: 'richtext', html: `<p>ব্রাউজার DevTools-এ:</p>
<ul>
                                  <li>নির্দিষ্ট ভেরিয়েবল ট্র্যাক করতে <strong>Watch প্যানেল</strong> ব্যবহার করুন</li>
                                  <li>ফাংশন কলের পথ দেখতে Call Stack ব্যবহার করুন</li>
                                  <li>ব্রেকপয়েন্টের সময় মান পরীক্ষা করতে ভেরিয়েবলের উপর হোভার করুন</li>
                                </ul>` },
  { id: 'lSXkDNOC-KHA', text: '৮. API ডিবাগিংয়ের জন্য Network ট্যাব', type: 'heading', level: 2, anchor: '8-network-tab-for-api-debugging' },
  { id: 'j7uF0A_OF1dT', type: 'richtext', html: `<p>যদি আপনি সার্ভার থেকে ডেটা আনছেন:</p>
<ul>
                                  <li>DevTools খুলুন → <strong>Network</strong></li>
                                  <li>রিকোয়েস্টটি সফল হয়েছে কিনা চেক করুন</li>
                                  <li>হেডার, পেলোড এবং রেসপন্স দেখুন</li>
                                  <li>404 বা 500-এর মতো HTTP এরর চিহ্নিত করুন</li>
                                </ul>` },
  { id: 'Q4Fw0kcwkJjN', text: 'প্রো ডিবাগিং টিপস', type: 'heading', level: 2, anchor: 'pro-debugging-tips' },
  { id: 'HH4dPJx4xBo8', type: 'richtext', html: `<li>সবসময় বানান এবং কেস সেনসিটিভিটি চেক করুন।</li>
<li>প্রবাহ (flow) ট্র্যাক করতে ফাংশন কলের আগে ও পরে লগ করুন।</li>
<li>অর্থবহ, বর্ণনামূলক ভেরিয়েবলের নাম ব্যবহার করুন।</li>
<li>বাগ আলাদা করতে অংশবিশেষ কমেন্ট আউট করুন।</li>
<li>প্রথম এরর থেকে নয়, সবচেয়ে সম্ভাব্য ব্যর্থতার জায়গা থেকে শুরু করুন।</li>` },
  { id: '8N3LzxU1pI5j', text: 'সারসংক্ষেপ:', type: 'heading', level: 2, anchor: 'summary' },
  { id: '6xXChVPYQ5o8', type: 'richtext', html: `<ul>
                                <li>সাধারণ ডিবাগিংয়ের জন্য <code>console.log()</code> এবং DevTools ব্যবহার করুন।</li>
                                <li><code>debugger</code> এবং ব্রেকপয়েন্ট আপনাকে কোড পজ করে ধাপে ধাপে চলতে দেয়।</li>
                                <li>আরও গভীর তথ্যের জন্য Network ট্যাব এবং স্ট্যাক ট্রেস ব্যবহার করুন।</li>
                                <li>ভালো ডিবাগিং সময় বাঁচায়, হতাশা কমায়, এবং আত্মবিশ্বাস তৈরি করে।</li>
                              </ul>` },
  { id: 'LwJc-5HsJHyP', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: '4BXc-jMA2MnX', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'sU1h-GtX5mf8', type: 'richtext', html: `<ol>
                                    <li>একটি লজিক বাগসহ একটি ফাংশন তৈরি করুন। সমস্যাটি খুঁজে বের করতে <code>console.log()</code> ব্যবহার করুন।</li>
                                    <li>একটি <code>debugger</code> যোগ করুন এবং পজ করে পরীক্ষা করতে Chrome DevTools ব্যবহার করুন।</li>
                                    <li>ইচ্ছাকৃতভাবে একটি এরর থ্রো করুন এবং <code>try...catch</code> দিয়ে সেটি হ্যান্ডেল করুন।</li>
                                    <li>একটি <code>fetch()</code> রিকোয়েস্ট করুন এবং Network ট্যাবের মাধ্যমে সেটি পরীক্ষা করুন।</li>
                                    <li>একটি অবজেক্ট অ্যারে ডিবাগ করতে <code>console.table()</code> ব্যবহার করুন।</li>
                              </ol>` },
]

const toc = [
  { id: 'what-is-debugging', text: 'ডিবাগিং কী?', level: 2 },
  { id: '1-use-consolelog-wisely', text: '১. বুদ্ধিমত্তার সাথে console.log() ব্যবহার করুন', level: 2 },
  { id: 'tips', text: 'টিপস:', level: 3 },
  { id: '2-understanding-console-methods', text: '২. Console মেথড বোঝা', level: 2 },
  { id: '3-breakpoints-in-developer-tools', text: '৩. ডেভেলপার টুলসে ব্রেকপয়েন্ট', level: 2 },
  { id: '4-using-debugger-keyword', text: '৪. debugger কীওয়ার্ড ব্যবহার করা', level: 2 },
  { id: '5-catching-errors-with-trycatch', text: '৫. try...catch দিয়ে এরর ধরা', level: 2 },
  { id: '6-understanding-stack-traces', text: '৬. স্ট্যাক ট্রেস বোঝা', level: 2 },
  { id: '7-watching-variables', text: '৭. ভেরিয়েবল ওয়াচ করা', level: 2 },
  { id: '8-network-tab-for-api-debugging', text: '৮. API ডিবাগিংয়ের জন্য Network ট্যাব', level: 2 },
  { id: 'pro-debugging-tips', text: 'প্রো ডিবাগিং টিপস', level: 2 },
  { id: 'summary', text: 'সারসংক্ষেপ:', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/debugging-techniques: 1/1 written')
