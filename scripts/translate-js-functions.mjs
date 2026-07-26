import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '25fc2302-0296-4ded-bd75-a1173b0bb7f4' // javascript/functions
const title = 'জাভাস্ক্রিপ্ট ফাংশন'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'ফাংশন ডিক্লারেশন, প্যারামিটার, অ্যারো ফাংশন, কলব্যাক এবং IIFE সহ জাভাস্ক্রিপ্ট ফাংশন শিখুন।'

const blocks = [
  { id: 'B8MyAahj6CLF', type: 'richtext', html: '<hr>' },
  { id: 'AmN6VCtX3j6x', text: 'ফাংশন কী?', type: 'heading', level: 2, anchor: 'what-is-a-function' },
  { id: 'uANrdNCthQms', type: 'richtext', html: '<p>একটি <strong>ফাংশন</strong> হলো পুনরায় ব্যবহারযোগ্য কোডের একটি ব্লক যা একটি নির্দিষ্ট কাজ সম্পন্ন করে।</p>\n<p>একই কোড বারবার লেখার বদলে, আমরা এটি একবার একটি ফাংশনের ভেতরে লিখি এবং প্রয়োজনে কল করি।</p>' },
  { id: 'sbAwIK2Fy5ge', text: 'কেন ফাংশন ব্যবহার করবেন?', type: 'heading', level: 2, anchor: 'why-use-functions' },
  { id: 'EfmKGMxbHIy8', type: 'richtext', html: `<ul>
                                    <li>কোড পুনরায় ব্যবহার করা (একবার লিখুন, বহুবার ব্যবহার করুন)</li>
                                    <li>কোড সংগঠিত ও পঠনযোগ্য করা</li>
                                    <li>প্রোগ্রামকে ছোট ছোট অংশে ভাগ করা</li>
                                    <li>পুনরাবৃত্তি এড়ানো</li>
                                </ul>` },
  { id: '-nwX8-jFEoYP', text: 'ফাংশনের সিনট্যাক্স', type: 'heading', level: 2, anchor: 'function-syntax' },
  { id: 'LZcKgtghH_L6', text: 'মৌলিক ফাংশন ডিক্লারেশন', type: 'heading', level: 3, anchor: 'basic-function-declaration' },
  { id: 'LYxPYOdDeIKh', type: 'code', language: 'javascript', code: 'function greet() {\n  console.log("Hello, world!");\n}\n\ngreet(); // ফাংশনটি কল করুন' },
  { id: 'jhL8p0zYJLoZ', text: 'প্যারামিটার ও আর্গুমেন্ট', type: 'heading', level: 3, anchor: 'parameters-and-arguments' },
  { id: '3L8yi9PZXEJZ', type: 'richtext', html: '<p><strong>প্যারামিটার</strong> (প্লেসহোল্ডার) ব্যবহার করে আপনি একটি ফাংশনে মান পাস করতে পারেন।</p>' },
  { id: 'RZK4N_XPTrz_', type: 'code', language: 'javascript', code: 'function greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("Alice"); // আউটপুট: Hello, Alice\ngreet("Bob");   // আউটপুট: Hello, Bob' },
  { id: 'l7pNdRwWPtNt', text: 'রিটার্ন স্টেটমেন্ট', type: 'heading', level: 3, anchor: 'return-statement' },
  { id: 'NyRmF32WPVCt', type: 'richtext', html: '<p>ফাংশন থেকে একটি মান ফেরত পাঠাতে <code>return</code> ব্যবহার করুন।</p>' },
  { id: 'xMFB5FGkaDzi', type: 'code', language: 'javascript', code: 'function add(a, b) {\n  return a + b;\n}\n\nlet result = add(5, 3);\nconsole.log(result); // আউটপুট: 8' },
  { id: '-fG3JU6h-2so', type: 'richtext', html: '<p>একবার <code>return</code>-এ পৌঁছালে, ফাংশন <strong>বেরিয়ে যায়</strong>।</p>' },
  { id: 'X99O4D24vYbl', text: 'ফাংশন এক্সপ্রেশন', type: 'heading', level: 3, anchor: 'function-expressions' },
  { id: 'N3XP6fDBvgUR', type: 'richtext', html: '<p>ফাংশনও ভেরিয়েবলে অ্যাসাইন করা যায়।</p>' },
  { id: 'hiKPM2NAjbu0', type: 'code', language: 'javascript', code: 'const multiply = function(x, y) {\n  return x * y;\n};\n\nconsole.log(multiply(4, 5)); // আউটপুট: 20' },
  { id: 'lBKsPhb5R6mj', text: 'অ্যারো ফাংশন (ES6)', type: 'heading', level: 3, anchor: 'arrow-functions-es6' },
  { id: 'LlKzEJJUJHjQ', type: 'richtext', html: '<p>ফাংশন এক্সপ্রেশন লেখার একটি সংক্ষিপ্ত উপায়।</p>' },
  { id: 'ZldVjuSZXni9', type: 'code', language: 'javascript', code: 'const square = (n) => {\n  return n * n;\n};\n\nconsole.log(square(6)); // আউটপুট: 36' },
  { id: '-YGWCrMkIc8o', type: 'code', language: 'javascript', code: 'const square = n => n * n;' },
  { id: 'Qne9foL1p5q1', text: 'ডিফল্ট প্যারামিটার', type: 'heading', level: 3, anchor: 'default-parameters' },
  { id: '0Zgdm2-L7G_2', type: 'richtext', html: '<p>আপনি প্যারামিটারের জন্য ডিফল্ট মান সেট করতে পারেন।</p>' },
  { id: 'p_sBL8BYrdT-', type: 'code', language: 'javascript', code: 'function greet(name = "Guest") {\n  console.log("Hello, " + name);\n}\n\ngreet();        // আউটপুট: Hello, Guest\ngreet("John");  // আউটপুট: Hello, John' },
  { id: 'qigBFgIaHsjv', text: 'ফাংশন স্কোপ', type: 'heading', level: 3, anchor: 'function-scope' },
  { id: 'RuMtqWt2wIao', type: 'richtext', html: '<p>একটি ফাংশনের <strong>ভেতরে</strong> ঘোষিত ভেরিয়েবল <strong>বাইরে</strong> থেকে অ্যাক্সেস করা যায় না।</p>' },
  { id: 'PnLPH0EyZQGj', type: 'code', language: 'javascript', code: 'function sayHi() {\n  let message = "Hi!";\n  console.log(message);  // ঠিক আছে\n}\n\nsayHi();\n// console.log(message); // ❌ এরর: message is not defined' },
  { id: 'FrkgCjNXm02W', text: 'নেস্টেড ফাংশন', type: 'heading', level: 3, anchor: 'nested-functions' },
  { id: 'WY_zzvXJXF-0', type: 'richtext', html: '<p>ফাংশন অন্য ফাংশনের ভেতরেও সংজ্ঞায়িত করা যায়।</p>' },
  { id: 'SAci4iKD3Apy', type: 'code', language: 'javascript', code: 'function outer() {\n  function inner() {\n    console.log("Hello from inner");\n  }\n  inner();\n}\n\nouter(); // আউটপুট: Hello from inner' },
  { id: 'Ic56t-0nS1DZ', text: 'অ্যানোনিমাস ফাংশন', type: 'heading', level: 3, anchor: 'anonymous-functions' },
  { id: 'deWu2wdbD-2a', type: 'richtext', html: '<p>নাম ছাড়া একটি ফাংশন — প্রায়ই ইভেন্ট হ্যান্ডলার বা কলব্যাকে ব্যবহৃত হয়।</p>' },
  { id: 'DRaLm61ZkDWL', type: 'code', language: 'javascript', code: 'setTimeout(function() {\n  console.log("Executed after 2 seconds");\n}, 2000);' },
  { id: '81-Jy5PCs1jE', text: 'কলব্যাক ফাংশন', type: 'heading', level: 3, anchor: 'callback-functions' },
  { id: 'D79y57OYW-uj', type: 'richtext', html: '<p>একটি <strong>কলব্যাক</strong> হলো এমন একটি ফাংশন যা পরে চালানোর জন্য অন্য একটি ফাংশনে <strong>আর্গুমেন্ট হিসেবে</strong> পাস করা হয়।</p>' },
  { id: 'Q9e4MROw3QTk', type: 'code', language: 'javascript', code: 'function greetUser(name, callback) {\n  console.log("Hi " + name);\n  callback();\n}\n                                \nfunction showMessage() {\n  console.log("Welcome to our site!");\n}\n\ngreetUser("Alice", showMessage);' },
  { id: 'NVHj4gN4rpkZ', text: 'ইমিডিয়েটলি ইনভোকড ফাংশন এক্সপ্রেশন (IIFE)', type: 'heading', level: 3, anchor: 'immediately-invoked-function-expression-iife' },
  { id: 'L9i3vywqxyKB', type: 'richtext', html: '<p>এমন একটি ফাংশন যা <strong>সংজ্ঞায়িত হওয়ার সাথে সাথেই চলে</strong>।</p>' },
  { id: 'A9SVTdh4fJwI', type: 'code', language: 'javascript', code: '(function() {\n  console.log("IIFE runs instantly!");\n})();' },
  { id: 'jH9f-lHoxmGW', type: 'richtext', html: `<p>এটি উপযোগী:</p>
<ul>
                                  <li>গ্লোবাল ভেরিয়েবল দূষণ এড়াতে</li>
                                  <li>প্রাইভেট স্কোপ তৈরি করতে</li>
                                </ul>` },
  { id: 'qTMqjxQ8VgeH', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: 'skabA5E3meIg', type: 'table', header: ['ফিচার', 'স্টেটমেন্ট', 'নোট'], rows: [
    ['ফাংশন ডিক্লারেশন', '<code>function add() {}</code>', 'হয়েস্টেড (সংজ্ঞায়িত করার আগেও ব্যবহার করা যায়)'],
    ['ফাংশন এক্সপ্রেশন', '<code>const add = function() {}</code>', 'হয়েস্টেড নয়'],
    ['অ্যারো ফাংশন', '<code>const add = (a, b) =&gt; a + b</code>', 'সংক্ষিপ্ত, আধুনিক সিনট্যাক্স'],
    ['ডিফল্ট প্যারামিটার', '<code>function(a = 1) {}</code>', 'ফলব্যাক মান সেট করে'],
    ['রিটার্ন ভ্যালু', '<code>return x * y</code>', 'ফলাফল ফেরত পাঠায়'],
    ['কলব্যাক ফাংশন', '<code>func(callback)</code>', 'অ্যাসিঙ্ক/ইভেন্টের জন্য ব্যবহৃত হয়'],
    ['IIFE', '<code>(function() {})();</code>', 'সাথে সাথে চলে'],
  ] },
  { id: 'dD6U_qLvFfbL', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'Ud69exg-z3eJ', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'Bg7rj8okLDps', type: 'richtext', html: `<ol>
                                    <li>একটি ফাংশন <code>isEven(number)</code> লিখুন, যা সংখ্যাটি জোড় হলে <code>true</code> রিটার্ন করবে, নাহলে <code>false</code>।</li>
                                    <li>একটি ফাংশন <code>greetUser(name, time)</code> লিখুন, যা সময়ের (AM/PM) উপর ভিত্তি করে "Good Morning/Evening, [name]" রিটার্ন করবে।</li>
                                    <li>এমন একটি অ্যারো ফাংশন তৈরি করুন যা দুটি সংখ্যা যোগ করে ফলাফল রিটার্ন করে।</li>
                                </ol>` },
]

const toc = [
  { id: 'what-is-a-function', text: 'ফাংশন কী?', level: 2 },
  { id: 'why-use-functions', text: 'কেন ফাংশন ব্যবহার করবেন?', level: 2 },
  { id: 'function-syntax', text: 'ফাংশনের সিনট্যাক্স', level: 2 },
  { id: 'basic-function-declaration', text: 'মৌলিক ফাংশন ডিক্লারেশন', level: 3 },
  { id: 'parameters-and-arguments', text: 'প্যারামিটার ও আর্গুমেন্ট', level: 3 },
  { id: 'return-statement', text: 'রিটার্ন স্টেটমেন্ট', level: 3 },
  { id: 'function-expressions', text: 'ফাংশন এক্সপ্রেশন', level: 3 },
  { id: 'arrow-functions-es6', text: 'অ্যারো ফাংশন (ES6)', level: 3 },
  { id: 'default-parameters', text: 'ডিফল্ট প্যারামিটার', level: 3 },
  { id: 'function-scope', text: 'ফাংশন স্কোপ', level: 3 },
  { id: 'nested-functions', text: 'নেস্টেড ফাংশন', level: 3 },
  { id: 'anonymous-functions', text: 'অ্যানোনিমাস ফাংশন', level: 3 },
  { id: 'callback-functions', text: 'কলব্যাক ফাংশন', level: 3 },
  { id: 'immediately-invoked-function-expression-iife', text: 'ইমিডিয়েটলি ইনভোকড ফাংশন এক্সপ্রেশন (IIFE)', level: 3 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/functions: 1/1 written')
