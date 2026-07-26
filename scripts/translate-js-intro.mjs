import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'ed384158-e9b5-40ca-aa4e-ec80bad21662' // javascript/intro
const title = 'জাভাস্ক্রিপ্ট পরিচিতি'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'জাভাস্ক্রিপ্ট কী, এর ইতিহাস, অন্যান্য ভাষার সাথে তুলনা, এবং HTML-এ যোগ করার পদ্ধতি জানুন।'

const blocks = [
  { id: '1SmVvyu5ZQzr', type: 'richtext', html: '<hr>' },
  { id: 'Qn632UmhqJ4F', text: 'জাভাস্ক্রিপ্ট কী?', type: 'heading', level: 2, anchor: 'what-is-javascript' },
  { id: 'HiThhTz3eJ_g', type: 'richtext', html: `<p>জাভাস্ক্রিপ্ট একটি <strong>হালকা, ইন্টারপ্রেটেড প্রোগ্রামিং ভাষা</strong>, যা মূলত ওয়েব পেজকে ইন্টারঅ্যাক্টিভ করতে ব্যবহৃত হয়। এটি ডেভেলপারদের <strong>পেজ রিলোড না করেই</strong> স্লাইডার, পপ-আপ, ফর্ম ভ্যালিডেশন এবং ডাইনামিক কনটেন্ট আপডেটের মতো ফিচার তৈরি করতে দেয়।</p>
<p>জাভাস্ক্রিপ্ট হলো:</p>
<ul>
                                    <li><strong>ক্লায়েন্ট-সাইড</strong> (ব্রাউজারে চলে)</li>
                                    <li><strong>অবজেক্ট-ভিত্তিক</strong></li>
                                    <li><strong>ইভেন্ট-চালিত</strong></li>
                                    <li><strong>ওয়েব ডেভেলপমেন্ট ত্রয়ীর</strong> একটি গুরুত্বপূর্ণ অংশ: HTML (গঠন), CSS (স্টাইল), জাভাস্ক্রিপ্ট (আচরণ)</li>
                                </ul>
<hr>` },
  { id: 'Og6Whq3iN6CB', text: 'ইতিহাস ও বিবর্তন', type: 'heading', level: 2, anchor: 'history-and-evolution' },
  { id: 'mBp4WWpV_dqH', type: 'richtext', html: `<ul>
                                    <li><strong>১৯৯৫</strong>: Netscape-এ <strong>Brendan Eich</strong> জাভাস্ক্রিপ্ট তৈরি করেন এবং মূলত এর নাম ছিল Mocha।</li>
                                    <li>পরে এর নাম <strong>LiveScript</strong>, এবং শেষে <strong>JavaScript</strong> রাখা হয় (মার্কেটিং কারণে, Java-এর জনপ্রিয়তার সুবিধা নিতে)।</li>
                                    <li><strong>ECMA International</strong> কর্তৃক <strong>ECMAScript (ES)</strong> হিসেবে স্ট্যান্ডার্ডাইজড।</li>
                                    <li>প্রধান ভার্সন:
                                        <ul>
                                            <li>ES3 (1999): প্রথম ব্যাপকভাবে গৃহীত ভার্সন।</li>
                                            <li>ES5 (2009): <code>strict mode</code>, JSON এবং আরও অনেক কিছু চালু করে।</li>
                                            <li>ES6 (2015): বিশাল আপডেট — <code>let</code>, <code>const</code>, অ্যারো ফাংশন, ক্লাস, প্রমিজ ইত্যাদি চালু করে।</li>
                                            <li>পরবর্তী ভার্সন (ES7 থেকে ES13): ভাষার ফিচার, পারফরম্যান্স এবং অ্যাসিঙ্ক প্রোগ্রামিং ক্রমাগত উন্নত করে চলেছে।</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'RlKgwni9Yj9j', text: 'জাভাস্ক্রিপ্ট বনাম অন্যান্য ভাষা', type: 'heading', level: 2, anchor: 'javascript-vs-other-languages' },
  { id: 'NhHk7ap6Tz31', type: 'table', header: ['ফিচার', 'জাভাস্ক্রিপ্ট', 'জাভা', 'পাইথন'], rows: [
    ['টাইপিং', 'ডাইনামিক', 'স্ট্যাটিক', 'ডাইনামিক'],
    ['এক্সিকিউশন', 'ইন্টারপ্রেটেড (ব্রাউজারে)', 'কম্পাইলড (JVM)', 'ইন্টারপ্রেটেড'],
    ['ব্যবহারের ক্ষেত্র', 'ওয়েব ইন্টারঅ্যাক্টিভিটি, অ্যাপ', 'এন্টারপ্রাইজ অ্যাপ, Android', 'ডেটা সায়েন্স, স্ক্রিপ্টিং'],
    ['সিনট্যাক্সের সরলতা', 'মাঝারি', 'জটিল', 'সহজ'],
    ['জনপ্রিয়তা', 'অত্যন্ত বেশি (ফ্রন্ট-এন্ড ডেভ)', 'বেশি', 'বেশি'],
  ] },
  { id: '-ckaPWIQAEF-', type: 'richtext', html: '<p>অনেক ভাষা যেগুলো সার্ভার বা লোকাল মেশিনে চলে, তার বিপরীতে জাভাস্ক্রিপ্ট মূলত <strong>ব্রাউজারে</strong> ব্যবহৃত হয়।</p>' },
  { id: 'dSMQaU7BYYtv', text: 'HTML-এ জাভাস্ক্রিপ্ট কীভাবে যোগ করবেন', type: 'heading', level: 2, anchor: 'how-to-add-javascript-to-html' },
  { id: 'I74DVUXmw_--', type: 'richtext', html: '<p><strong>তিনটি প্রধান উপায়ে</strong> জাভাস্ক্রিপ্ট যোগ করা যায়:</p>' },
  { id: 'HnR8Pl1D2DKs', text: '১. ইনলাইন স্ক্রিপ্ট', type: 'heading', level: 3, anchor: '1-inline-script' },
  { id: 'm2eoOkLwD_XC', type: 'richtext', html: '<p><code>onclick</code>, <code>onmouseover</code> বা এরকম অ্যাট্রিবিউট ব্যবহার করে আপনি সরাসরি একটি HTML এলিমেন্টের ভেতরে জাভাস্ক্রিপ্ট লিখতে পারেন।</p>' },
  { id: 'Ty4opMnoDcDC', type: 'code', language: 'html', code: '<button onclick="alert(\'Hello!\')">Click Me</button>' },
  { id: 'odsqNSsuQ6eq', type: 'richtext', html: '<p>✅ সহজ</p>\n<p>❌ বড় প্রজেক্টের জন্য সুপারিশ করা হয় না (JS এবং HTML মিশে যায়)</p>' },
  { id: 'A6eZYpn0nP3R', text: '২. ইন্টারনাল স্ক্রিপ্ট', type: 'heading', level: 3, anchor: '2-internal-script' },
  { id: 'Fzj5l5OnTI6u', type: 'richtext', html: '<p>আপনার HTML ফাইলের <code>&lt;head&gt;</code> বা <code>&lt;body&gt;</code>-তে <code>&lt;script&gt;</code> ট্যাগের ভেতরে জাভাস্ক্রিপ্ট এমবেড করা যায়।</p>' },
  { id: 'KmJbZVFWZ56e', type: 'code', language: 'html', code: '<!DOCTYPE html>\n<html>\n<head>\n    <script>\n    function greet() {\n        alert("Welcome to JavaScript!");\n    }\n    </script>\n</head>\n<body>\n    <button onclick="greet()">Greet</button>\n</body>\n</html>' },
  { id: 'Q8aMvY5kURGX', type: 'richtext', html: '<p>✅ ছোট প্রজেক্ট বা টেস্টিংয়ের জন্য ভালো</p>\n<p>❌ পুনরায় ব্যবহারযোগ্য নয়</p>' },
  { id: '8eLg2qLbidlg', text: '৩. এক্সটার্নাল স্ক্রিপ্ট', type: 'heading', level: 3, anchor: '3-external-script' },
  { id: 'QLS1jFEgL3OW', type: 'richtext', html: '<p>জাভাস্ক্রিপ্ট একটি আলাদা <code>.js</code> ফাইলে রাখা হয় এবং <code>&lt;script src=""&gt;</code> ট্যাগ দিয়ে লিংক করা হয়।</p>\n<code><strong>index.html</strong></code>' },
  { id: 'u0w_qlOqqcyc', type: 'code', language: 'html', code: '<script src="app.js"></script>' },
  { id: 'zeHy88v_RbGS', type: 'richtext', html: '<code><strong>app.js</strong></code>' },
  { id: '4ATCcft3Cj44', type: 'code', language: 'javascript', code: 'function greet() {\n    alert("Hello from external JS!");\n}' },
  { id: 'jAKx-vYaYfaQ', type: 'richtext', html: '<p>✅ পরিষ্কার, পুনরায় ব্যবহারযোগ্য, মডুলার</p>\n<p>✅ বাস্তব-জগতের প্রজেক্টের জন্য সুপারিশকৃত</p>' },
  { id: 'VGqoMa55o2M9', text: 'জাভাস্ক্রিপ্ট আউটপুট মেথড', type: 'heading', level: 2, anchor: 'javascript-output-methods' },
  { id: 'RbgYXcHuf6RV', type: 'richtext', html: '<p>জাভাস্ক্রিপ্ট বিভিন্নভাবে ডেটা আউটপুট করতে পারে:</p>' },
  { id: 'UILHkkycmCIJ', text: '১. alert()', type: 'heading', level: 4, anchor: '1-alert' },
  { id: 'AGVO9xpbGv6V', type: 'richtext', html: '<p>ব্যবহারকারীকে একটি পপ-আপ মেসেজ বক্স দেখায়।</p>' },
  { id: 'ArljlgAUyN1A', type: 'code', language: 'javascript', code: 'alert("Welcome!");' },
  { id: 's8liTI8134no', text: '২. console.log()', type: 'heading', level: 4, anchor: '2-consolelog' },
  { id: 'NBzwn8HTg07T', type: 'richtext', html: '<p>ব্রাউজারের <strong>ডেভেলপার কনসোলে</strong> আউটপুট প্রিন্ট করে। <strong>ডিবাগিংয়ের</strong> জন্য উপযোগী।</p>' },
  { id: 'aFddbNsVbYdH', type: 'code', language: 'javascript', code: 'console.log("This is a log message.");' },
  { id: 'qX6xRDAW4dDp', text: '৩. document.write()', type: 'heading', level: 4, anchor: '3-documentwrite' },
  { id: 'IO2vbLCIDMHl', type: 'richtext', html: '<p>সরাসরি HTML ডকুমেন্টে লেখে।</p>' },
  { id: '2Xu74v5deFAs', type: 'code', language: 'javascript', code: 'document.write("Hello, World!");' },
  { id: 'EjftbMXTAVEO', type: 'richtext', html: '<p>⚠️ পেজ লোড হওয়ার পরে ব্যবহার করলে পুরো ডকুমেন্ট ওভাররাইট হয়ে যায় — সাবধানে ব্যবহার করুন।</p>' },
  { id: '8X8n5eAHQk8Z', text: '৪. innerHTML', type: 'heading', level: 4, anchor: '4-innerhtml' },
  { id: 'yh1Ba6kF-VGx', type: 'richtext', html: '<p>একটি HTML এলিমেন্টের কনটেন্ট পরিবর্তন করে।</p>' },
  { id: 'QgeGz3EzD5D2', type: 'code', language: 'html', code: '<p id="demo"></p>\n<script>\n    document.getElementById("demo").innerHTML = "Hello from JS!";\n</script>' },
  { id: 'oqzeL5MZW-Z-', type: 'richtext', html: '<p>✅ ডাইনামিক কনটেন্ট আপডেটের জন্য সবচেয়ে বেশি ব্যবহৃত</p>' },
]

const toc = [
  { id: 'what-is-javascript', text: 'জাভাস্ক্রিপ্ট কী?', level: 2 },
  { id: 'history-and-evolution', text: 'ইতিহাস ও বিবর্তন', level: 2 },
  { id: 'javascript-vs-other-languages', text: 'জাভাস্ক্রিপ্ট বনাম অন্যান্য ভাষা', level: 2 },
  { id: 'how-to-add-javascript-to-html', text: 'HTML-এ জাভাস্ক্রিপ্ট কীভাবে যোগ করবেন', level: 2 },
  { id: '1-inline-script', text: '১. ইনলাইন স্ক্রিপ্ট', level: 3 },
  { id: '2-internal-script', text: '২. ইন্টারনাল স্ক্রিপ্ট', level: 3 },
  { id: '3-external-script', text: '৩. এক্সটার্নাল স্ক্রিপ্ট', level: 3 },
  { id: 'javascript-output-methods', text: 'জাভাস্ক্রিপ্ট আউটপুট মেথড', level: 2 },
  { id: '1-alert', text: '১. alert()', level: 4 },
  { id: '2-consolelog', text: '২. console.log()', level: 4 },
  { id: '3-documentwrite', text: '৩. document.write()', level: 4 },
  { id: '4-innerhtml', text: '৪. innerHTML', level: 4 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/intro: 1/1 written')
