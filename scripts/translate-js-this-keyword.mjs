import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'a8fb395e-78d6-4800-875b-88031280a86c' // javascript/this-keyword
const title = 'জাভাস্ক্রিপ্ট this কীওয়ার্ড'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'গ্লোবাল স্কোপ, অবজেক্ট মেথড, কনস্ট্রাক্টর ফাংশন এবং অ্যারো ফাংশনে this কীভাবে কাজ করে তা জানুন।'

const blocks = [
  { id: 'belzt7hinmeR', type: 'richtext', html: '<hr>' },
  { id: '18TJurNZW_u0', text: 'this কী?', type: 'heading', level: 2, anchor: 'what-is-this' },
  { id: 'AlVKk_fTFHNt', type: 'richtext', html: '<p>জাভাস্ক্রিপ্টে, <code>this</code> সেই <strong>অবজেক্টকে নির্দেশ করে যেটি বর্তমান ফাংশন এক্সিকিউট করছে</strong>।</p>\n<p><code>this</code>-এর মান <strong>ফাংশনটি কীভাবে কল করা হচ্ছে তার উপর নির্ভর করে</strong>, এটি কোথায় লেখা হয়েছে তার উপর নয়।</p>' },
  { id: '0AxNd2DX15m3', text: 'গ্লোবাল কনটেক্সট', type: 'heading', level: 2, anchor: 'global-context' },
  { id: 'deYFzQNl1T7q', type: 'richtext', html: `<p><strong>গ্লোবাল স্কোপে</strong>, <code>this</code> <strong>গ্লোবাল অবজেক্টকে</strong> নির্দেশ করে।</p>
<ul>
                                  <li>ব্রাউজারে, গ্লোবাল অবজেক্ট হলো <code>window</code>।</li>
                                </ul>` },
  { id: 'MT0oW5qe4_Ml', type: 'code', language: 'javascript', code: 'console.log(this); // window' },
  { id: 'ta0XhAz5TGP5', text: 'একটি অবজেক্ট মেথডের ভেতরে', type: 'heading', level: 2, anchor: 'inside-an-object-method' },
  { id: '7eb4fcP-gW1m', type: 'richtext', html: '<p>একটি অবজেক্ট মেথডে ব্যবহার করা হলে, <code>this</code> <strong>অবজেক্টটিকেই</strong> নির্দেশ করে।</p>' },
  { id: 'EtVEgWS0kBzM', type: 'code', language: 'javascript', code: 'const person = {\n  name: "Alice",\n  greet() {\n    console.log("Hello, I\'m " + this.name);\n  },\n};\n                                \nperson.greet(); // "Hello, I\'m Alice"' },
  { id: 'f3vovPeDk7dw', type: 'richtext', html: '<p><code>this.name</code>, <code>person.name</code>-কে নির্দেশ করে।</p>' },
  { id: 'NWO_hEiLhxP0', text: '❌ ডিট্যাচড ফাংশন (কনটেক্সট হারায়)', type: 'heading', level: 2, anchor: 'detached-function-loses-context' },
  { id: 'HcfMhFQqzq5L', type: 'code', language: 'javascript', code: 'const person = {\n  name: "Alice",\n  greet() {\n    console.log(this.name);\n  },\n};\n                                \nconst sayHello = person.greet;\nsayHello(); // undefined (নন-স্ট্রিক্ট মোডে) বা এরর (স্ট্রিক্ট মোডে)' },
  { id: 'QZGQd6KWSoX1', type: 'richtext', html: '<p><code>this</code> বাইন্ড করা নেই, তাই এটি গ্লোবাল অবজেক্ট বা স্ট্রিক্ট মোডে <code>undefined</code>-কে নির্দেশ করে।</p>' },
  { id: 'QEr1RX7NojMk', text: '🧲 bind, call, apply দিয়ে this ঠিক করা', type: 'heading', level: 2, anchor: 'fixing-this-with-bind-call-apply' },
  { id: 'iaxOk7W0Uhmz', type: 'code', language: 'javascript', code: 'const person = {\n  name: "Bob",\n};\n                                \nfunction greet() {\n  console.log("Hello, " + this.name);\n}\n                                \ngreet.call(person);  // "Hello, Bob"\ngreet.apply(person); // "Hello, Bob"\n                                \nconst greetPerson = greet.bind(person);\ngreetPerson();       // "Hello, Bob"' },
  { id: 'X7gdNfPJpUkj', type: 'richtext', html: `<ul>
                                  <li><code>call()</code> এবং <code>apply()</code> একটি নতুন <code>this</code> পাস করে <strong>ফাংশনটি সাথে সাথে কল করে</strong>।</li>
                                  <li><code>bind()</code> বাইন্ড করা <code>this</code>-সহ একটি <strong>নতুন ফাংশন</strong> রিটার্ন করে।</li>
                                </ul>` },
  { id: '_DmHJZWTuKk4', text: 'একটি কনস্ট্রাক্টর ফাংশনের ভেতরে', type: 'heading', level: 2, anchor: 'inside-a-constructor-function' },
  { id: 'aXC1Ga6_1imU', type: 'richtext', html: '<p>একটি কনস্ট্রাক্টর ফাংশনে, <code>this</code> নতুন তৈরি হওয়া অবজেক্টকে নির্দেশ করে।</p>' },
  { id: 'aFcDomILgfz5', type: 'code', language: 'javascript', code: 'function Car(brand) {\n  this.brand = brand;\n}\n                                \nconst myCar = new Car("Toyota");\nconsole.log(myCar.brand); // "Toyota"' },
  { id: 'jXom1Uyw3oOQ', text: 'অ্যারো ফাংশনে this', type: 'heading', level: 2, anchor: 'this-in-arrow-functions' },
  { id: 'rphybo9xOchF', type: 'richtext', html: '<p>অ্যারো ফাংশনের <strong>নিজস্ব</strong> <code>this</code> থাকে না। এগুলো তাদের <code>parent scope</code> থেকে <code>this</code> ইনহেরিট করে।</p>' },
  { id: 'JxddOURd79JB', type: 'code', language: 'javascript', code: 'const user = {\n  name: "Alice",\n  greet: () => {\n    console.log(this.name); // undefined\n  },\n};\n                                \nuser.greet();' },
  { id: 'q29Ggw4K5HDy', type: 'richtext', html: '<p>আশেপাশের <code>this</code> <strong>সংরক্ষণ করতে</strong> চাইলে অ্যারো ফাংশন দারুণ কাজে দেয়।</p>' },
  { id: 'N-YO3xHgIVbK', type: 'code', language: 'javascript', code: 'function Timer() {\n  this.seconds = 0;\n                                \n  setInterval(() => {\n    this.seconds++;\n    console.log(this.seconds);\n  }, 1000);\n}\n                                \nnew Timer(); // সঠিকভাবে সেকেন্ড লগ করে' },
  { id: 'FUqBfaDyKFud', text: 'সারসংক্ষেপ টেবিল', type: 'heading', level: 2, anchor: 'summary-table' },
  { id: '1wt4nxhHfErl', type: 'table', header: ['প্রসঙ্গ (Context)', '<code>this</code> নির্দেশ করে'], rows: [
    ['গ্লোবাল স্কোপ', 'গ্লোবাল অবজেক্ট (<code>window</code>)'],
    ['অবজেক্ট মেথড', 'অবজেক্টটি নিজেই'],
    ['ফাংশন (নন-মেথড) কল', 'গ্লোবাল অবজেক্ট বা <code>undefined</code> (স্ট্রিক্ট)'],
    ['কনস্ট্রাক্টর ফাংশন', 'নতুন তৈরি হওয়া অবজেক্ট'],
    ['অ্যারো ফাংশন', 'বাইরের স্কোপ থেকে <code>this</code> ইনহেরিট করে'],
    ['<code>bind()</code>, <code>call()</code>, <code>apply()</code>-সহ', 'ম্যানুয়ালি নির্ধারিত অবজেক্ট'],
  ] },
  { id: 'yXY9lrlGsM_E', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'v0itWQm-kOAK', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'uUTNb923pRw6', type: 'richtext', html: `<ol>
                                    <li>একটি মেথডসহ একটি অবজেক্ট তৈরি করুন এবং প্রপার্টি অ্যাক্সেস করতে <code>this</code> ব্যবহার করুন।</li>
                                    <li>একটি মেথড ডিট্যাচ করে আলাদাভাবে কল করে দেখুন — <code>this</code> লক্ষ্য করুন।</li>
                                    <li>একটি ডিট্যাচড ফাংশনে <code>this</code> ঠিক করতে <code>bind()</code> ব্যবহার করুন।</li>
                                    <li>বাইরের <code>this</code> সংরক্ষণ করতে <code>setTimeout</code>-এর ভেতরে অ্যারো ফাংশন ব্যবহার করুন।</li>
                                    <li><code>this</code> ব্যবহার করে প্রপার্টি সেট করে এমন একটি কনস্ট্রাক্টর তৈরি করুন।</li>
                                </ol>` },
]

const toc = [
  { id: 'what-is-this', text: 'this কী?', level: 2 },
  { id: 'global-context', text: 'গ্লোবাল কনটেক্সট', level: 2 },
  { id: 'inside-an-object-method', text: 'একটি অবজেক্ট মেথডের ভেতরে', level: 2 },
  { id: 'detached-function-loses-context', text: '❌ ডিট্যাচড ফাংশন (কনটেক্সট হারায়)', level: 2 },
  { id: 'fixing-this-with-bind-call-apply', text: '🧲 bind, call, apply দিয়ে this ঠিক করা', level: 2 },
  { id: 'inside-a-constructor-function', text: 'একটি কনস্ট্রাক্টর ফাংশনের ভেতরে', level: 2 },
  { id: 'this-in-arrow-functions', text: 'অ্যারো ফাংশনে this', level: 2 },
  { id: 'summary-table', text: 'সারসংক্ষেপ টেবিল', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/this-keyword: 1/1 written')
