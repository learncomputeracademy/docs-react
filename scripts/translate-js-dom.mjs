import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '60580c14-de90-4e16-9dd6-90e7a8045052' // javascript/dom
const title = 'জাভাস্ক্রিপ্ট DOM'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'DOM কী, এলিমেন্ট অ্যাক্সেস করা, কনটেন্ট ও স্টাইল পরিবর্তন করা, এবং DOM ট্রাভার্স করা শিখুন।'

const blocks = [
  { id: 'RTusvzjP104i', type: 'richtext', html: '<hr>' },
  { id: 'PTnXWQowqZvS', text: 'DOM কী?', type: 'heading', level: 2, anchor: 'what-is-the-dom' },
  { id: 'znVEsrgKwsLk', type: 'richtext', html: `<p><strong>DOM</strong> মানে <strong>Document Object Model</strong>। এটি একটি ট্রি-আকৃতির স্ট্রাকচার যা একটি HTML ডকুমেন্টের কনটেন্ট প্রতিনিধিত্ব করে।</p>
<p>একটি ওয়েবপেজ লোড হলে, ব্রাউজার আপনার HTML-কে একটি <strong>DOM ট্রি</strong>-তে রূপান্তর করে, যেখানে:</p>
<ul>
                                    <li>প্রতিটি HTML এলিমেন্ট একটি <strong>অবজেক্ট</strong> হয়ে যায়</li>
                                    <li>জাভাস্ক্রিপ্ট এই এলিমেন্টগুলো অ্যাক্সেস, আপডেট, যোগ বা মুছে ফেলতে পারে</li>
                                </ul>
<p>📌 <strong>সংক্ষেপে</strong>: জাভাস্ক্রিপ্ট আপনার ওয়েব পেজের সাথে ডাইনামিকভাবে ইন্টারঅ্যাক্ট করতে DOM ব্যবহার করে।</p>` },
  { id: 'osWmFbqxD6sk', text: 'DOM ট্রি ভিজ্যুয়ালাইজ করা', type: 'heading', level: 2, anchor: 'visualizing-the-dom-tree' },
  { id: 'VSV5IX28t-Gh', type: 'code', language: 'html', code: '<html>\n  <body>\n    <h1>Hello</h1>\n    <p>This is a paragraph.</p>\n  </body>\n</html>' },
  { id: 'czbGvax3QIRg', type: 'code', language: 'html', code: 'Document\n└── html\n    └── body\n        ├── h1\n        └── p' },
  { id: 'ZucPhwkkYWuE', text: 'DOM-এ এলিমেন্ট অ্যাক্সেস করা', type: 'heading', level: 2, anchor: 'accessing-elements-in-the-dom' },
  { id: 'oaD8cWyRVX0n', type: 'table', header: ['মেথড', 'বিবরণ'], rows: [
    ['<code>getElementById()</code>', 'ID দিয়ে এলিমেন্ট খুঁজে বের করে'],
    ['<code>getElementsByClassName()</code>', 'ক্লাসের নাম দিয়ে এলিমেন্ট খুঁজে বের করে'],
    ['<code>getElementsByTagName()</code>', 'ট্যাগ দিয়ে এলিমেন্ট খুঁজে বের করে'],
    ['<code>querySelector()</code>', 'প্রথম মিলে যাওয়া এলিমেন্ট খুঁজে বের করে (CSS)'],
    ['<code>querySelectorAll()</code>', 'সব মিলে যাওয়া এলিমেন্ট খুঁজে বের করে (CSS)'],
  ] },
  { id: 'fP5Y-5EOi3rV', type: 'code', language: 'html', code: '<p id="demo" class="text">Hello!</p>' },
  { id: 'T5k2C4WcJXO2', type: 'code', language: 'javascript', code: 'document.getElementById("demo"); // ID দিয়ে\ndocument.getElementsByClassName("text");    // ক্লাস দিয়ে\ndocument.querySelector("p");                // প্রথম <p>\ndocument.querySelectorAll("p");             // সব <p>' },
  { id: 'koUcODvxklPG', text: 'জাভাস্ক্রিপ্ট দিয়ে কনটেন্ট পরিবর্তন করা', type: 'heading', level: 2, anchor: 'changing-content-with-javascript' },
  { id: 'c5quH2IUxp3P', text: 'innerHTML', type: 'heading', level: 3, anchor: 'innerhtml' },
  { id: 'Aiq2ibDMWjUZ', type: 'richtext', html: '<p>একটি এলিমেন্টের ভেতরের HTML কনটেন্ট প্রতিস্থাপন করে।</p>' },
  { id: 'PD-l9xiLAjlq', type: 'code', language: 'javascript', code: 'document.getElementById("demo").innerHTML = "Updated!";' },
  { id: 'Z0HowoRWWanW', text: 'textContent', type: 'heading', level: 3, anchor: 'textcontent' },
  { id: 'L-rBF3JdLPfQ', type: 'richtext', html: '<p>শুধু টেক্সট পরিবর্তন করে (HTML ট্যাগ উপেক্ষা করে)।</p>' },
  { id: 'T_e7SJsCCqOi', type: 'code', language: 'javascript', code: 'document.getElementById("demo").textContent = "Plain Text";' },
  { id: 'qopnnQtoElHf', text: 'স্টাইল পরিবর্তন করা', type: 'heading', level: 3, anchor: 'changing-style' },
  { id: 'XdviJmo7SMfF', type: 'code', language: 'javascript', code: 'const box = document.getElementById("box");\nbox.style.backgroundColor = "blue";\nbox.style.fontSize = "20px";' },
  { id: 'JkS5LurUWoIm', text: 'এলিমেন্ট তৈরি ও যোগ করা', type: 'heading', level: 3, anchor: 'creating-and-appending-elements' },
  { id: 'H8lXyTL4eeSS', type: 'code', language: 'javascript', code: 'const newP = document.createElement("p");\nnewP.textContent = "This is a new paragraph.";\n                                  \ndocument.body.appendChild(newP);' },
  { id: 'sito0m8Im8gn', text: 'এলিমেন্ট মুছে ফেলা', type: 'heading', level: 3, anchor: 'removing-elements' },
  { id: '-AFwP4BMlOfj', type: 'code', language: 'javascript', code: 'const item = document.getElementById("removeMe");\nitem.remove();' },
  { id: 'Sl_tdB6MjWlO', type: 'richtext', html: '<p>অথবা প্যারেন্ট এলিমেন্ট ব্যবহার করে:</p>' },
  { id: 'V3KIW1Ktwp-S', type: 'code', language: 'javascript', code: 'item.parentNode.removeChild(item);' },
  { id: '7FcecVqDg1Cm', text: 'DOM ইভেন্ট পুনরালোচনা', type: 'heading', level: 2, anchor: 'dom-events-recap' },
  { id: 'cV8aP_Zz7XBm', type: 'richtext', html: '<p>আপনি DOM সিলেকশনকে ইভেন্টের সাথে একত্রে ব্যবহার করতে পারেন:</p>' },
  { id: 'HcqN3tZlVEGc', type: 'code', language: 'javascript', code: 'document.getElementById("btn").addEventListener("click", function () {\n  document.getElementById("demo").textContent = "Button clicked!";\n});' },
  { id: 'dQZwvsBMtc1p', text: 'DOM ট্রাভার্স করা', type: 'heading', level: 2, anchor: 'traversing-the-dom' },
  { id: 'VC40rfOAVVpa', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
    ['<code>parentNode</code>', 'প্যারেন্ট এলিমেন্ট অ্যাক্সেস করে'],
    ['<code>children</code>', 'সব চাইল্ড এলিমেন্ট অ্যাক্সেস করে'],
    ['<code>firstElementChild</code>', 'প্রথম চাইল্ড এলিমেন্ট'],
    ['<code>lastElementChild</code>', 'শেষ চাইল্ড এলিমেন্ট'],
    ['<code>nextElementSibling</code>', 'একই স্তরের পরবর্তী এলিমেন্ট'],
    ['<code>previousElementSibling</code>', 'একই স্তরের পূর্ববর্তী এলিমেন্ট'],
  ] },
  { id: 'soy-4c0Sw1YJ', type: 'code', language: 'javascript', code: 'const list = document.getElementById("myList");\nconsole.log(list.children); // li এলিমেন্টের HTMLCollection' },
  { id: 'Kv7XpgOTWhcP', text: 'অ্যাট্রিবিউট ও ক্লাস', type: 'heading', level: 2, anchor: 'attributes-and-classes' },
  { id: 'IlYGKEvpMtDO', text: 'অ্যাট্রিবিউট পাওয়া ও সেট করা', type: 'heading', level: 3, anchor: 'getting-setting-attributes' },
  { id: 'HQIqhAulYMil', type: 'code', language: 'javascript', code: 'const link = document.getElementById("myLink");\nconsole.log(link.getAttribute("href")); // পাওয়া\n                                  \nlink.setAttribute("href", "https://example.com"); // সেট করা' },
  { id: 'GRybI0qoiswT', text: 'ক্লাস নিয়ে কাজ করা', type: 'heading', level: 3, anchor: 'working-with-classes' },
  { id: 'L0ZwcBL9yJXq', type: 'code', language: 'javascript', code: 'const box = document.querySelector(".box");\n\nbox.classList.add("active");    // ক্লাস যোগ করা\nbox.classList.remove("box");    // ক্লাস সরানো\nbox.classList.toggle("hidden"); // ক্লাস টগল করা' },
  { id: 'RQcaojEYGJgd', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'JnwvEPnFOXfm', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'EDbMSKF_Ecid', type: 'richtext', html: `<ol>
                                    <li><code>innerHTML</code> ব্যবহার করে একটি হেডিংয়ের টেক্সট পরিবর্তন করুন।</li>
                                    <li>একটি নতুন <code>&lt;li&gt;</code> আইটেম তৈরি করুন এবং একটি আনঅর্ডারড লিস্টে যোগ করুন।</li>
                                    <li>বাটন ক্লিকে একটি ক্লাস টগল করুন।</li>
                                    <li><code>setTimeout()</code> ব্যবহার করে কয়েক সেকেন্ড পর একটি এলিমেন্ট মুছে ফেলুন।</li>
                                    <li>একটি ইমেজের <code>src</code> অ্যাট্রিবিউট ডাইনামিকভাবে পরিবর্তন করুন।</li>
                                </ol>` },
]

const toc = [
  { id: 'what-is-the-dom', text: 'DOM কী?', level: 2 },
  { id: 'visualizing-the-dom-tree', text: 'DOM ট্রি ভিজ্যুয়ালাইজ করা', level: 2 },
  { id: 'accessing-elements-in-the-dom', text: 'DOM-এ এলিমেন্ট অ্যাক্সেস করা', level: 2 },
  { id: 'changing-content-with-javascript', text: 'জাভাস্ক্রিপ্ট দিয়ে কনটেন্ট পরিবর্তন করা', level: 2 },
  { id: 'innerhtml', text: 'innerHTML', level: 3 },
  { id: 'textcontent', text: 'textContent', level: 3 },
  { id: 'changing-style', text: 'স্টাইল পরিবর্তন করা', level: 3 },
  { id: 'creating-and-appending-elements', text: 'এলিমেন্ট তৈরি ও যোগ করা', level: 3 },
  { id: 'removing-elements', text: 'এলিমেন্ট মুছে ফেলা', level: 3 },
  { id: 'dom-events-recap', text: 'DOM ইভেন্ট পুনরালোচনা', level: 2 },
  { id: 'traversing-the-dom', text: 'DOM ট্রাভার্স করা', level: 2 },
  { id: 'attributes-and-classes', text: 'অ্যাট্রিবিউট ও ক্লাস', level: 2 },
  { id: 'getting-setting-attributes', text: 'অ্যাট্রিবিউট পাওয়া ও সেট করা', level: 3 },
  { id: 'working-with-classes', text: 'ক্লাস নিয়ে কাজ করা', level: 3 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/dom: 1/1 written')
