import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'ffc16255-d4f6-43f4-80a5-369932eb1042' // javascript/objects
const title = 'জাভাস্ক্রিপ্ট অবজেক্ট'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'অবজেক্ট সিনট্যাক্স, প্রপার্টি অ্যাক্সেস, মেথড, নেস্টেড অবজেক্ট এবং অবজেক্ট ডিস্ট্রাকচারিং শিখুন।'

const blocks = [
  { id: 'CvuyuD-pnvYb', type: 'richtext', html: '<hr>' },
  { id: 'T1WnXD6-yjuT', text: 'অবজেক্ট কী?', type: 'heading', level: 2, anchor: 'what-is-an-object' },
  { id: 'n-Ayuysp4buu', type: 'richtext', html: '<p>জাভাস্ক্রিপ্টে, একটি <strong>অবজেক্ট</strong> হলো key-value pair-এর একটি সংগ্রহ (প্রপার্টি নামেও পরিচিত)।</p>\n<p>অবজেক্ট <strong>সম্পর্কিত ডেটা</strong> এবং <strong>ফাংশন</strong> একই জায়গায় সংরক্ষণ ও সংগঠিত করতে সাহায্য করে।</p>' },
  { id: 'sfXxPInywep8', text: 'অবজেক্টের সিনট্যাক্স', type: 'heading', level: 2, anchor: 'object-syntax' },
  { id: '5EBG7v-zrxdN', type: 'code', language: 'javascript', code: 'const person = {\n  firstName: "Alice",\n  lastName: "Johnson",\n  age: 30,\n  isStudent: false\n};' },
  { id: 'eEpnCuEj9922', type: 'richtext', html: `<ul>
                                    <li><code>firstName</code>, <code>lastName</code>, <code>age</code>, <code>isStudent</code> হলো <strong>key (প্রপার্টি)</strong></li>
                                    <li><code>"Alice"</code>, <code>"Johnson"</code>, <code>30</code>, <code>false</code> হলো মান</li>
                                </ul>` },
  { id: '4o6hmVgFohtK', text: 'অবজেক্টের প্রপার্টি অ্যাক্সেস করা', type: 'heading', level: 2, anchor: 'accessing-object-properties' },
  { id: '1GBRglDQJzOv', text: 'Dot নোটেশন:', type: 'heading', level: 3, anchor: 'dot-notation' },
  { id: 'iqk3zOvqyDP6', type: 'code', language: 'javascript', code: 'console.log(person.firstName); // আউটপুট: Alice' },
  { id: 'nvhagGHgMqF9', text: 'Bracket নোটেশন:', type: 'heading', level: 3, anchor: 'bracket-notation' },
  { id: '8VG5CIdPjX6P', type: 'code', language: 'javascript', code: 'console.log(person["lastName"]); // আউটপুট: Johnson' },
  { id: 'lRen8exnsXNt', type: 'richtext', html: `<p>ব্র্যাকেট ব্যবহার করুন যখন:</p>
<ul>
                                    <li>প্রপার্টির নামে স্পেস/স্পেশাল ক্যারেক্টার থাকে</li>
                                    <li>আপনি প্রপার্টি ডাইনামিকভাবে অ্যাক্সেস করেন</li>
                                </ul>` },
  { id: 'RBfpko902kWz', text: 'প্রপার্টি আপডেট ও যোগ করা', type: 'heading', level: 2, anchor: 'updating-adding-properties' },
  { id: 'AODV24EWC0OD', text: 'আপডেট:', type: 'heading', level: 3, anchor: 'update' },
  { id: 'ZE4yUHIjz1QM', type: 'code', language: 'javascript', code: 'person.age = 31;' },
  { id: '-kq_c3qvfffN', text: 'নতুন প্রপার্টি যোগ করা:', type: 'heading', level: 3, anchor: 'add-new-property' },
  { id: 'AJQfL8kUCH1h', type: 'code', language: 'javascript', code: 'person.country = "India";' },
  { id: 'hFY3K09uYnME', text: 'প্রপার্টি মুছে ফেলা', type: 'heading', level: 2, anchor: 'deleting-properties' },
  { id: 'OHJxi_eYWTj2', type: 'code', language: 'javascript', code: 'delete person.isStudent;' },
  { id: 'VP9etyz9hwxz', text: 'অবজেক্ট মেথড', type: 'heading', level: 2, anchor: 'object-methods' },
  { id: 'KnvyfTGllJhS', type: 'richtext', html: '<p>একটি <strong>মেথড</strong> হলো একটি অবজেক্টের ভেতরের একটি ফাংশন।</p>' },
  { id: 'Xa2CrPiabAZj', type: 'code', language: 'javascript', code: 'const car = {\n  brand: "Toyota",\n  model: "Camry",\n  start: function () {\n    console.log("Engine started");\n  }\n};\n\ncar.start(); // আউটপুট: Engine started' },
  { id: '-iDyOVmKanAk', type: 'richtext', html: '<p>আপনি <strong>শর্টহ্যান্ড সিনট্যাক্স</strong>ও ব্যবহার করতে পারেন:</p>' },
  { id: 'M2Wwirtm4L7K', type: 'code', language: 'javascript', code: 'const car = {\n  brand: "Toyota",\n  start() {\n    console.log("Engine started");\n  }\n};' },
  { id: 'th6DxcYh4Cmy', text: 'this কীওয়ার্ড', type: 'heading', level: 2, anchor: 'this-keyword' },
  { id: 'tCNsRU6xUczj', type: 'richtext', html: '<p>একটি অবজেক্ট মেথডের ভেতরে, <code>this</code> <strong>অবজেক্টটিকেই</strong> নির্দেশ করে।</p>' },
  { id: 'N6xHp8vbkICi', type: 'code', language: 'javascript', code: 'const user = {\n  name: "Sara",\n  greet() {\n    console.log("Hi, I\'m " + this.name);\n  }\n};\n\nuser.greet(); // আউটপুট: Hi, I\'m Sara' },
  { id: 'NlWT1Ard9ZtQ', text: 'নেস্টেড অবজেক্ট', type: 'heading', level: 2, anchor: 'nested-objects' },
  { id: 'iWErHn6SCA-7', type: 'richtext', html: '<p>একটি অবজেক্ট অন্য অবজেক্টও ধারণ করতে পারে।</p>' },
  { id: 'RI0yfZPfbvk8', type: 'code', language: 'javascript', code: 'const student = {\n  name: "John",\n  grades: {\n    math: 90,\n    english: 85\n  }\n};\n                                  \nconsole.log(student.grades.math); // আউটপুট: 90' },
  { id: 'eq1-cB93UDGp', text: 'অবজেক্টের মধ্য দিয়ে লুপ করা', type: 'heading', level: 2, anchor: 'looping-through-objects' },
  { id: 'hxO2gW1mxtYg', text: 'for...in লুপ:', type: 'heading', level: 3, anchor: 'forin-loop' },
  { id: 'LR7UYineahDF', type: 'code', language: 'javascript', code: 'const book = {\n  title: "1984",\n  author: "George Orwell"\n};\n                                  \nfor (let key in book) {\n  console.log(key + ": " + book[key]);\n}' },
  { id: 'ipnxqNewA3Ns', text: 'বিল্ট-ইন অবজেক্ট মেথড', type: 'heading', level: 2, anchor: 'built-in-object-methods' },
  { id: 'LstJRUzUr75V', text: 'Object.keys(obj)', type: 'heading', level: 3, anchor: 'objectkeysobj' },
  { id: '2bEujYJHjZ8b', type: 'richtext', html: '<p>key-এর একটি অ্যারে রিটার্ন করে।</p>' },
  { id: 'WHjAlUY6aCUR', type: 'code', language: 'javascript', code: "Object.keys(book); // ['title', 'author']" },
  { id: 'uBC56PR5qvYi', text: 'Object.values(obj)', type: 'heading', level: 3, anchor: 'objectvaluesobj' },
  { id: 'Byug93u8nXMn', type: 'richtext', html: '<p>মানের একটি অ্যারে রিটার্ন করে।</p>' },
  { id: '7MWKyNIxYIDA', type: 'code', language: 'javascript', code: "Object.values(book); // ['1984', 'George Orwell']" },
  { id: 'Dy2r3ruELZNV', text: 'Object.entries(obj)', type: 'heading', level: 3, anchor: 'objectentriesobj' },
  { id: 'yHaV9vsajOiL', type: 'richtext', html: '<p>[key, value] জোড়ার একটি অ্যারে রিটার্ন করে।</p>' },
  { id: 'STBALzqBFZTT', type: 'code', language: 'javascript', code: "Object.entries(book);\n// [['title', '1984'], ['author', 'George Orwell']]" },
  { id: 'o9fb4tTTkhQ0', text: 'অবজেক্ট ডিস্ট্রাকচারিং (ES6)', type: 'heading', level: 2, anchor: 'object-destructuring-es6' },
  { id: 'GKG4119tNuIU', type: 'richtext', html: '<p>সহজেই মান ভেরিয়েবলে বের করে নিন।</p>' },
  { id: '09YHWj4BCJIy', type: 'code', language: 'javascript', code: 'const user = {\n  name: "Liam",\n  age: 25\n};\n                                  \nconst { name, age } = user;\nconsole.log(name); // Liam\nconsole.log(age);  // 25' },
  { id: '1Zius3tV8f9u', text: 'অ্যারেতে অবজেক্ট', type: 'heading', level: 2, anchor: 'object-in-arrays' },
  { id: 'Frx_-XYO8kz-', type: 'richtext', html: '<p>আইটেমের তালিকা সংরক্ষণের জন্য উপযোগী (যেমন, ব্যবহারকারী, পণ্য)।</p>' },
  { id: 'KRoMwfLO1se2', type: 'code', language: 'javascript', code: 'const users = [\n  { name: "Alice", age: 20 },\n  { name: "Bob", age: 25 }\n];\n                                  \nconsole.log(users[1].name); // আউটপুট: Bob' },
  { id: '8a0hkDz3qr3E', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: 'Y0ZWvGCazNCG', type: 'table', header: ['ফিচার', 'উদাহরণ'], rows: [
    ['অবজেক্ট তৈরি করা', '<code>const obj = { key: value }</code>'],
    ['প্রপার্টি অ্যাক্সেস করা', '<code>obj.key</code> বা <code>obj["key"]</code>'],
    ['প্রপার্টি যোগ/আপডেট করা', '<code>obj.newKey = value</code>'],
    ['প্রপার্টি মুছে ফেলা', '<code>delete obj.key</code>'],
    ['অবজেক্ট মেথড', '<code>obj.method = function() {}</code>'],
    ['<code>this</code> ব্যবহার করা', 'মেথডের ভেতরে: অবজেক্টকে নির্দেশ করে'],
    ['অবজেক্টে লুপ করা', '<code>for (let key in obj)</code>'],
    ['ডিস্ট্রাকচারিং', '<code>const { key } = obj</code>'],
  ] },
  { id: '1YIY3saeBtm1', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'OJCGovhJ-15o', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'Xu0QJfyOeJcB', type: 'richtext', html: `<ol>
                                    <li><code>title</code>, <code>director</code>, <code>year</code> key-সহ একটি <code>movie</code> নামের অবজেক্ট তৈরি করুন।</li>
                                    <li>একটি <code>getDetails</code> মেথড যোগ করুন, যা <code>this.title</code> ইত্যাদি ব্যবহার করে একটি ফরম্যাট করা স্ট্রিং রিটার্ন করে।</li>
                                    <li>সব key-value pair প্রিন্ট করতে অবজেক্টের উপর লুপ করুন।</li>
                                    <li><code>movie</code> অবজেক্ট ডিস্ট্রাকচার করার চেষ্টা করুন।</li>
                                </ol>` },
]

const toc = [
  { id: 'what-is-an-object', text: 'অবজেক্ট কী?', level: 2 },
  { id: 'object-syntax', text: 'অবজেক্টের সিনট্যাক্স', level: 2 },
  { id: 'accessing-object-properties', text: 'অবজেক্টের প্রপার্টি অ্যাক্সেস করা', level: 2 },
  { id: 'dot-notation', text: 'Dot নোটেশন:', level: 3 },
  { id: 'bracket-notation', text: 'Bracket নোটেশন:', level: 3 },
  { id: 'updating-adding-properties', text: 'প্রপার্টি আপডেট ও যোগ করা', level: 2 },
  { id: 'update', text: 'আপডেট:', level: 3 },
  { id: 'add-new-property', text: 'নতুন প্রপার্টি যোগ করা:', level: 3 },
  { id: 'deleting-properties', text: 'প্রপার্টি মুছে ফেলা', level: 2 },
  { id: 'object-methods', text: 'অবজেক্ট মেথড', level: 2 },
  { id: 'this-keyword', text: 'this কীওয়ার্ড', level: 2 },
  { id: 'nested-objects', text: 'নেস্টেড অবজেক্ট', level: 2 },
  { id: 'looping-through-objects', text: 'অবজেক্টের মধ্য দিয়ে লুপ করা', level: 2 },
  { id: 'forin-loop', text: 'for...in লুপ:', level: 3 },
  { id: 'built-in-object-methods', text: 'বিল্ট-ইন অবজেক্ট মেথড', level: 2 },
  { id: 'objectkeysobj', text: 'Object.keys(obj)', level: 3 },
  { id: 'objectvaluesobj', text: 'Object.values(obj)', level: 3 },
  { id: 'objectentriesobj', text: 'Object.entries(obj)', level: 3 },
  { id: 'object-destructuring-es6', text: 'অবজেক্ট ডিস্ট্রাকচারিং (ES6)', level: 2 },
  { id: 'object-in-arrays', text: 'অ্যারেতে অবজেক্ট', level: 2 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/objects: 1/1 written')
