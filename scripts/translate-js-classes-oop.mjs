import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'c4ddf5cf-4a57-4a34-9da8-02186c9f91a0' // javascript/classes-oop
const title = 'জাভাস্ক্রিপ্ট ক্লাস এবং OOP'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'জাভাস্ক্রিপ্টে ES6 ক্লাস, ইনহেরিটেন্স, এনক্যাপসুলেশন এবং মেথড ওভাররাইডিং দিয়ে অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং শিখুন।'

const blocks = [
  { id: 'WXodmYdZ4eZz', type: 'richtext', html: '<p><em>(অবজেক্ট এবং ব্লুপ্রিন্ট দিয়ে বাস্তব-জগতের ডেটা মডেল করা)</em></p>\n<hr>' },
  { id: 'QcQoSS2OdaRx', text: 'অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং কী?', type: 'heading', level: 2, anchor: 'what-is-object-oriented-programming' },
  { id: 'aOJeDdKTJ0yV', type: 'richtext', html: `<p>অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং (OOP) হলো <strong>অবজেক্টের উপর ভিত্তি করে একটি প্রোগ্রামিং স্টাইল</strong>। জাভাস্ক্রিপ্ট <strong>কনস্ট্রাক্টর ফাংশন</strong> এবং <strong>ES6 ক্লাস</strong> উভয়ের মাধ্যমেই OOP সমর্থন করে।</p>
<p>মূল OOP ধারণা:</p>
<ul>
                                  <li><strong>Class</strong>: একটি ব্লুপ্রিন্ট/টেমপ্লেট</li>
                                  <li><strong>Object</strong>: একটি ক্লাসের ইনস্ট্যান্স</li>
                                  <li><strong>Constructor</strong>: একটি অবজেক্ট ইনিশিয়ালাইজ করার বিশেষ ফাংশন</li>
                                  <li><strong>Method</strong>: একটি অবজেক্টের ভেতরের একটি ফাংশন</li>
                                  <li><strong>Inheritance</strong>: একটি ক্লাস অন্য একটি ক্লাস থেকে প্রপার্টি/মেথড ইনহেরিট করে</li>
                                </ul>` },
  { id: '98plVc7CIt6N', text: 'ক্লাস তৈরি করা', type: 'heading', level: 2, anchor: 'creating-classes' },
  { id: 'aw2pQuQg2u-E', text: 'ES6 ক্লাস সিনট্যাক্স', type: 'heading', level: 3, anchor: 'es6-class-syntax' },
  { id: 'UYyyy2p6oxPu', type: 'code', language: 'javascript', code: 'class Person {\n  constructor(name, age) {\n    this.name = name;\n    this.age = age;\n  }\n                                \n  greet() {\n    console.log(`Hello, my name is ${this.name}`);\n  }\n}\n                                \nconst alice = new Person("Alice", 25);\nalice.greet(); // Hello, my name is Alice' },
  { id: 'QnLGu9fwCVAv', type: 'richtext', html: `<ul>
                                  <li><code>new</code> দিয়ে একটি নতুন অবজেক্ট তৈরি করার সময় <code>constructor()</code> স্বয়ংক্রিয়ভাবে কল হয়।</li>
                                  <li><code>this</code> নতুন তৈরি হওয়া অবজেক্টকে নির্দেশ করে।</li>
                                </ul>` },
  { id: '_bOdZ-CAoLeX', text: 'ইনহেরিটেন্স (একটি ক্লাস এক্সটেন্ড করা)', type: 'heading', level: 2, anchor: 'inheritance-extending-a-class' },
  { id: 'Ms3vMx7S_7ZD', type: 'richtext', html: '<p><code>extends</code> ব্যবহার করে আপনি এমন একটি চাইল্ড ক্লাস তৈরি করতে পারেন যা একটি প্যারেন্ট ক্লাস থেকে ইনহেরিট করে।</p>' },
  { id: 'nCyW_5SUTX-n', type: 'code', language: 'javascript', code: 'class Employee extends Person {\n  constructor(name, age, role) {\n    super(name, age); // প্যারেন্ট কনস্ট্রাক্টর কল করে\n    this.role = role;\n  }\n                                \n  work() {\n    console.log(`${this.name} is working as a ${this.role}`);\n  }\n}\n                                \nconst bob = new Employee("Bob", 30, "Developer");\nbob.greet(); // Hello, my name is Bob\nbob.work();  // Bob is working as a Developer' },
  { id: 'bC36AnrHGPwI', text: 'এনক্যাপসুলেশন (প্রাইভেট প্রপার্টি)', type: 'heading', level: 2, anchor: 'encapsulation-private-properties' },
  { id: '7odJOZbuzRiC', type: 'richtext', html: '<p>জাভাস্ক্রিপ্ট <code>#</code> সিনট্যাক্স (ES2022+) দিয়ে প্রাইভেট ফিল্ড সমর্থন করে।</p>' },
  { id: 'FZvZUFukE3Kc', type: 'code', language: 'javascript', code: 'class BankAccount {\n  #balance = 0;\n                                \n  deposit(amount) {\n    this.#balance += amount;\n  }\n                                \n  getBalance() {\n    return this.#balance;\n  }\n}\n                                \nconst acc = new BankAccount();\nacc.deposit(1000);\nconsole.log(acc.getBalance()); // 1000\n// console.log(acc.#balance); // ❌ এরর: প্রাইভেট ফিল্ড' },
  { id: 'Nw5d-gw8vn_i', text: 'মেথড ওভাররাইডিং', type: 'heading', level: 2, anchor: 'method-overriding' },
  { id: 'ErV8mQDd7NQz', type: 'richtext', html: '<p>চাইল্ড ক্লাস প্যারেন্ট মেথড ওভাররাইড করতে পারে:</p>' },
  { id: 'PiEfsUGtcKlR', type: 'code', language: 'javascript', code: 'class Animal {\n  speak() {\n    console.log("Animal makes a sound");\n  }\n}\n                                \nclass Dog extends Animal {\n  speak() {\n    console.log("Dog barks");\n  }\n}\n                                \nconst d = new Dog();\nd.speak(); // Dog barks' },
  { id: 'xOubYb976GBU', text: 'ক্লাস বনাম কনস্ট্রাক্টর ফাংশন', type: 'heading', level: 2, anchor: 'class-vs-constructor-function' },
  { id: 'lCeu5cfM3_EC', type: 'table', header: ['ফিচার', 'কনস্ট্রাক্টর ফাংশন', 'ES6 ক্লাস সিনট্যাক্স'], rows: [
    ['সিনট্যাক্স', 'ফাংশন-ভিত্তিক', 'পরিষ্কার, ক্লাস-ভিত্তিক'],
    ['ইনহেরিটেন্স', '<code>prototype</code>-এর মাধ্যমে', '<code>extends</code>, <code>super</code> ব্যবহার করে'],
    ['প্রাইভেট ফিল্ড', 'সমর্থিত নয় (পুরনো)', '<code>#</code> দিয়ে সমর্থিত'],
    ['পঠনযোগ্যতা', 'মাঝারি', 'ভালো'],
  ] },
  { id: 'IuXWw0hdBsUm', text: 'বাস্তব জীবনের উদাহরণ', type: 'heading', level: 2, anchor: 'real-life-analogy' },
  { id: 'jy-ZT-2woYut', type: 'richtext', html: '<p>একটি <code>Car</code> ক্লাসকে একটি <strong>ব্লুপ্রিন্ট</strong> হিসেবে ভাবুন।</p>\n<p>এটি থেকে তৈরি হওয়া প্রতিটি অবজেক্ট (যেমন <code>myCar</code>, <code>yourCar</code>) নিজস্ব ডেটাসহ একটি প্রকৃত গাড়ি, কিন্তু একই ডিজাইন অনুসরণ করে।</p>' },
  { id: 'sIboQnPhVGDg', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: 'q1liUmxKr_lv', type: 'richtext', html: `<ul>
                                <li>ক্লাস হলো অবজেক্ট তৈরির ব্লুপ্রিন্ট।</li>
                                <li>মান ইনিশিয়ালাইজ করতে <code>constructor()</code> ব্যবহার করুন।</li>
                                <li>ইনহেরিটেন্স <code>extends</code> এবং <code>super()</code> দিয়ে কোড পুনরায় ব্যবহার করতে দেয়।</li>
                                <li>প্রাইভেট ফিল্ডের জন্য (ES2022+) <code>#</code> ব্যবহার করুন।</li>
                                <li>OOP অবজেক্ট ও তাদের সম্পর্ক ব্যবহার করে কোড আরও ভালোভাবে সংগঠিত করতে সাহায্য করে।</li>
                              </ul>` },
  { id: 'V0_8QhINO1IM', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'RZjafOrJjXXG', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'JL4RLzD7WJ3j', type: 'richtext', html: `<ol>
                                  <li>title, author এবং একটি <code>getSummary()</code> মেথডসহ একটি <code>Book</code> ক্লাস তৈরি করুন।</li>
                                  <li><code>Book</code>-কে একটি এক্সট্রা <code>issue</code> প্রপার্টিসহ <code>Magazine</code> ক্লাসে এক্সটেন্ড করুন।</li>
                                  <li>একটি প্রাইভেট ফিল্ড <code>#password</code>-সহ একটি ক্লাস তৈরি করুন এবং সেটি পরিবর্তনের মেথড লিখুন।</li>
                                  <li>একটি ক্লাস হায়ারার্কিতে (যেমন, Animal → Dog → Bulldog) মেথড ওভাররাইডিং চেষ্টা করুন।</li>
                                  <li>এমন একটি ক্লাস তৈরি করুন যা গণনা করে যে এটি থেকে কতগুলো অবজেক্ট তৈরি হয়েছে।</li>
                              </ol>` },
]

const toc = [
  { id: 'what-is-object-oriented-programming', text: 'অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং কী?', level: 2 },
  { id: 'creating-classes', text: 'ক্লাস তৈরি করা', level: 2 },
  { id: 'es6-class-syntax', text: 'ES6 ক্লাস সিনট্যাক্স', level: 3 },
  { id: 'inheritance-extending-a-class', text: 'ইনহেরিটেন্স (একটি ক্লাস এক্সটেন্ড করা)', level: 2 },
  { id: 'encapsulation-private-properties', text: 'এনক্যাপসুলেশন (প্রাইভেট প্রপার্টি)', level: 2 },
  { id: 'method-overriding', text: 'মেথড ওভাররাইডিং', level: 2 },
  { id: 'class-vs-constructor-function', text: 'ক্লাস বনাম কনস্ট্রাক্টর ফাংশন', level: 2 },
  { id: 'real-life-analogy', text: 'বাস্তব জীবনের উদাহরণ', level: 2 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/classes-oop: 1/1 written')
