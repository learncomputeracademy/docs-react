import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '48f2c9e9-d40c-4451-9229-fd21d2938c05' // javascript/events
const title = 'জাভাস্ক্রিপ্ট ইভেন্ট'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'ইভেন্ট কী, ইভেন্ট হ্যান্ডেল করার তিনটি পদ্ধতি, এবং mouse, keyboard ও form ইভেন্টের উদাহরণ শিখুন।'

const blocks = [
  { id: 'gFwuf2VVlonZ', type: 'richtext', html: '<hr>' },
  { id: 'BcHUihu-j4or', text: 'জাভাস্ক্রিপ্টে ইভেন্ট কী?', type: 'heading', level: 2, anchor: 'what-is-an-event-in-javascript' },
  { id: 'UUdqsee2A-gM', type: 'richtext', html: `<p>একটি <strong>ইভেন্ট</strong> হলো কিছু ঘটেছে তার একটি সংকেত — একটি ব্যবহারকারীর কাজ বা ব্রাউজার-ট্রিগারড অ্যাক্টিভিটি, যেমন:</p>
<ul>
                                    <li>একটি বাটনে ক্লিক করা</li>
                                    <li>একটি ফর্মে টাইপ করা</li>
                                    <li>একটি এলিমেন্টের উপর হোভার করা</li>
                                    <li>পেজ লোড বা রিসাইজ</li>
                                    <li>ফর্ম সাবমিশন</li>
                                </ul>
<p>জাভাস্ক্রিপ্ট এই ইভেন্টগুলো <strong>শোনে (listen)</strong> এবং এগুলো ঘটলে আপনাকে কোড চালাতে দেয়।</p>` },
  { id: 'p3968Uu1YFh-', text: 'সাধারণ HTML ইভেন্ট', type: 'heading', level: 2, anchor: 'common-html-events' },
  { id: '4FwyIMdRaMSM', type: 'table', header: ['ইভেন্টের নাম', 'এটি ট্রিগার হয় যখন...'], rows: [
    ['<code>click</code>', 'একটি এলিমেন্টে ক্লিক করা হয়'],
    ['<code>mouseover</code>', 'মাউস একটি এলিমেন্টের উপর হোভার করে'],
    ['<code>mouseout</code>', 'মাউস একটি এলিমেন্ট ছেড়ে যায়'],
    ['<code>keydown</code>', 'একটি কী প্রেস করা হয়'],
    ['<code>keyup</code>', 'একটি কী ছেড়ে দেওয়া হয়'],
    ['<code>change</code>', 'ফর্ম ফিল্ডের মান পরিবর্তিত হয়'],
    ['<code>submit</code>', 'একটি ফর্ম সাবমিট করা হয়'],
    ['<code>load</code>', 'পেজ বা ইমেজ লোড হওয়া শেষ হয়'],
    ['<code>dblclick</code>', 'এলিমেন্টে ডাবল-ক্লিক করা হয়'],
  ] },
  { id: 'pauYm14x8Ojh', text: 'ইভেন্ট হ্যান্ডেল করার ৩টি উপায়', type: 'heading', level: 2, anchor: '3-ways-to-handle-events' },
  { id: 'SCC5t3bTbX50', text: '১. ইনলাইন ইভেন্ট হ্যান্ডলার (HTML-এ)', type: 'heading', level: 3, anchor: '1-inline-event-handler-in-html' },
  { id: 'rF7CLKz-h01i', type: 'code', language: 'html', code: '<button onclick="sayHello()">Click Me</button>\n<script>\n  function sayHello() {\n    alert("Hello from inline event!");\n  }\n</script>' },
  { id: '8RNKcWiO_S0i', text: '২. ইন্টারনাল ইভেন্ট হ্যান্ডলার (DOM ব্যবহার করে)', type: 'heading', level: 3, anchor: '2-internal-event-handler-using-dom' },
  { id: 'MDDBqlIs212Q', type: 'code', language: 'html', code: '<button id="btn">Click</button>\n\n<script>\n  document.getElementById("btn").onclick = function () {\n    alert("Clicked!");\n  };\n</script>' },
  { id: 'n-lL9L8XKToi', text: '৩. addEventListener() মেথড', type: 'heading', level: 3, anchor: '3-addeventlistener-method' },
  { id: 'Mwiv9vQJNZkO', type: 'code', language: 'javascript', code: 'const btn = document.getElementById("btn");\n\nbtn.addEventListener("click", function () {\n  alert("Event using addEventListener");\n});' },
  { id: 'r4GhzTtmZkie', type: 'richtext', html: '<p>এটাই <strong>সুপারিশকৃত উপায়</strong> — এটি একাধিক লিসেনার এবং HTML ও JS-এর মধ্যে ভালো পৃথকীকরণের সুযোগ দেয়।</p>' },
  { id: 'mHNyu-KqLvgO', text: 'মাউস ইভেন্ট উদাহরণ', type: 'heading', level: 2, anchor: 'mouse-events-example' },
  { id: 'IYIT0XElkSH6', type: 'code', language: 'html', code: '<div id="box" style="width:100px;height:100px;background:red;"></div>\n\n<script>\n  const box = document.getElementById("box");\n                                    \n  box.addEventListener("mouseover", () => {\n    box.style.background = "blue";\n  });\n                                    \n  box.addEventListener("mouseout", () => {\n    box.style.background = "red";\n  });\n</script>' },
  { id: 'pLl7sfalApZi', text: 'কিবোর্ড ইভেন্ট উদাহরণ', type: 'heading', level: 2, anchor: 'keyboard-events-example' },
  { id: 'S4Zm7wLZ7W6h', type: 'code', language: 'javascript', code: 'document.addEventListener("keydown", function (e) {\n  console.log("Key pressed:", e.key);\n});' },
  { id: '3UrIfUG4xfGU', type: 'richtext', html: '<p>আপনি <code>\'Enter\'</code>, <code>\'Escape\'</code>, <code>\'ArrowUp\'</code>-এর মতো কী ভ্যালু ক্যাপচার করতে পারেন।</p>' },
  { id: 'qTcjiSbuurMj', text: 'ফর্ম ইভেন্ট উদাহরণ', type: 'heading', level: 2, anchor: 'form-events-example' },
  { id: '8O2PfLfChm9v', type: 'code', language: 'html', code: '<form id="myForm">\n  <input type="text" name="username" />\n  <button type="submit">Submit</button>\n</form>\n                                  \n<script>\n  const form = document.getElementById("myForm");\n                                  \n  form.addEventListener("submit", function (e) {\n    e.preventDefault(); // আসল ফর্ম সাবমিশন প্রতিরোধ করে\n    alert("Form submitted via JavaScript!");\n  });\n</script>' },
  { id: 'lRJwjCJX5GQl', text: 'event অবজেক্ট', type: 'heading', level: 2, anchor: 'the-event-object' },
  { id: 'KbBADvFR3QrE', type: 'richtext', html: '<p>আপনি ইভেন্টের বিস্তারিত তথ্য অ্যাক্সেস করতে পারেন, যেমন type, target এলিমেন্ট, প্রেস করা কী, মাউসের অবস্থান ইত্যাদি।</p>' },
  { id: 'pMAGIgg9rixO', type: 'code', language: 'javascript', code: 'document.addEventListener("click", function (event) {\n  console.log(event.type);   // click\n  console.log(event.target); // যে এলিমেন্টে ক্লিক করা হয়েছে\n});' },
  { id: 'dAIVC8EQddHm', text: 'একটি ইভেন্ট লিসেনার সরানো', type: 'heading', level: 2, anchor: 'removing-an-event-listener' },
  { id: 'F1HTLkfV2xHR', type: 'code', language: 'javascript', code: 'function greet() {\n  alert("Hello!");\n}\n                                  \nbtn.addEventListener("click", greet);\n                                  \n// পরে...\nbtn.removeEventListener("click", greet);' },
  { id: 'rBTY4yxC64yD', type: 'richtext', html: '<p class="note"><strong>মনে রাখবেন: </strong>একটি লিসেনার সরাতে অবশ্যই একটি নামযুক্ত ফাংশন ব্যবহার করতে হবে (অ্যানোনিমাস ফাংশন নয়)।</p>' },
  { id: 'HxjOO2UN0V4N', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: '0Clh9mjsE4Pm', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'R7xQcpEpIWVC', type: 'richtext', html: `<ol>
                                    <li>একটি প্যারাগ্রাফের টেক্সট পরিবর্তন করতে একটি ক্লিক ইভেন্ট যোগ করুন।</li>
                                    <li>একটি বক্সের রঙ অ্যানিমেট করতে mouseover এবং mouseout ব্যবহার করুন।</li>
                                    <li>এমন একটি ফর্ম তৈরি করুন যা ডিফল্ট সাবমিশন প্রতিরোধ করে এবং ইনপুটের মান লগ করে।</li>
                                    <li>keydown ব্যবহার করে ব্যবহারকারী যে কী প্রেস করেন তা প্রদর্শন করুন।</li>
                                    <li>এমন একটি ফাংশন লিখুন যা শুধু প্রথম বাটন ক্লিকে একবারই চলে।</li>
                                </ol>` },
]

const toc = [
  { id: 'what-is-an-event-in-javascript', text: 'জাভাস্ক্রিপ্টে ইভেন্ট কী?', level: 2 },
  { id: 'common-html-events', text: 'সাধারণ HTML ইভেন্ট', level: 2 },
  { id: '3-ways-to-handle-events', text: 'ইভেন্ট হ্যান্ডেল করার ৩টি উপায়', level: 2 },
  { id: '1-inline-event-handler-in-html', text: '১. ইনলাইন ইভেন্ট হ্যান্ডলার (HTML-এ)', level: 3 },
  { id: '2-internal-event-handler-using-dom', text: '২. ইন্টারনাল ইভেন্ট হ্যান্ডলার (DOM ব্যবহার করে)', level: 3 },
  { id: '3-addeventlistener-method', text: '৩. addEventListener() মেথড', level: 3 },
  { id: 'mouse-events-example', text: 'মাউস ইভেন্ট উদাহরণ', level: 2 },
  { id: 'keyboard-events-example', text: 'কিবোর্ড ইভেন্ট উদাহরণ', level: 2 },
  { id: 'form-events-example', text: 'ফর্ম ইভেন্ট উদাহরণ', level: 2 },
  { id: 'the-event-object', text: 'event অবজেক্ট', level: 2 },
  { id: 'removing-an-event-listener', text: 'একটি ইভেন্ট লিসেনার সরানো', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/events: 1/1 written')
