import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '54732d18-b46c-4419-9347-c24b754ce8fa' // javascript/es6-and-modern-features
const title = 'জাভাস্ক্রিপ্ট ES6 এবং আধুনিক ফিচার'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'let/const, অ্যারো ফাংশন, টেমপ্লেট লিটারেল, ডিস্ট্রাকচারিং, স্প্রেড/রেস্ট অপারেটর এবং মডিউল শিখুন।'

const blocks = [
  { id: 'WRGHCHwoUPXd', type: 'richtext', html: '<p><em>(পরিষ্কার সিনট্যাক্স, ভালো স্কোপিং, অ্যারো ফাংশন এবং আরও অনেক কিছুসহ জাভাস্ক্রিপ্টে একটি বড় লাফ)</em></p>\n<hr>' },
  { id: 'ZeLyueo4ANZK', text: 'ES6 কী?', type: 'heading', level: 2, anchor: 'what-is-es6' },
  { id: 'X5lFM3xGRZgN', type: 'richtext', html: '<p><strong>ES6 (ECMAScript 2015)</strong> হলো জাভাস্ক্রিপ্টের একটি বড় আপডেট, যা কোডকে আরও পঠনযোগ্য, রক্ষণাবেক্ষণযোগ্য এবং শক্তিশালী করতে নতুন সিনট্যাক্স ও ফিচার চালু করে।</p>' },
  { id: 'ynIG_MOG12He', text: 'এটি আধুনিক জাভাস্ক্রিপ্ট ডেভেলপমেন্টের পথ তৈরি করেছে।', type: 'heading', level: 2, anchor: 'it-paved-the-way-for-modern-javascript-development' },
  { id: 'frsndf-uTEUV', text: '১. let এবং const - ব্লক স্কোপড ভেরিয়েবল', type: 'heading', level: 2, anchor: '1-let-and-const---block-scoped-variables' },
  { id: 'HHNMqAPAAW6X', text: 'let - পুনঃবরাদ্দযোগ্য ভেরিয়েবলের জন্য var প্রতিস্থাপন করে', type: 'heading', level: 3, anchor: 'let---replaces-var-for-reassignable-variables' },
  { id: 'q74tTwrlqHrU', type: 'code', language: 'javascript', code: 'let name = "John";\nname = "Doe"; // অনুমোদিত' },
  { id: '1Sy0u9j3f16j', text: 'const - অপরিবর্তনীয় রেফারেন্স', type: 'heading', level: 3, anchor: 'const---immutable-reference' },
  { id: 'lBnAPf9bXgO-', type: 'code', language: 'javascript', code: 'const age = 30;\n// age = 31; // ❌ এরর: Assignment to constant variable' },
  { id: 'NNTa80i6lfv_', type: 'richtext', html: '<p class="note"><code>let</code> এবং <code>const</code> <strong>ব্লক-স্কোপড</strong> এবং <code>var</code>-এর মতো হয়েস্ট হয় না।</p>' },
  { id: 'AzALBhaNm2Up', text: '২. অ্যারো ফাংশন (সংক্ষিপ্ত ফাংশন সিনট্যাক্স)', type: 'heading', level: 2, anchor: '2-arrow-functions-shorter-function-syntax' },
  { id: '2AFQ8A3xAN3T', type: 'code', language: 'javascript', code: '// প্রথাগত ফাংশন\nfunction greet(name) {\n  return "Hello " + name;\n}\n\n// অ্যারো ফাংশন\nconst greet = name => "Hello " + name;' },
  { id: '8Bfa5-fC4RdX', type: 'richtext', html: '<p>একাধিক লাইন বা প্যারামিটার থাকলে:</p>' },
  { id: 'HHwSn82g7RC7', type: 'code', language: 'javascript', code: 'const add = (a, b) => {\n  return a + b;\n};' },
  { id: '9d4bREIV28Yb', text: '৩. টেমপ্লেট লিটারেল - ব্যাকটিক ব্যবহার করে `', type: 'heading', level: 2, anchor: '3-template-literals---using-backticks' },
  { id: 'xDIyjDamtml4', type: 'code', language: 'javascript', code: 'const name = "Alice";\nconsole.log(`Hello, ${name}!`); // Hello, Alice!' },
  { id: 'VWk82pYdBymO', type: 'richtext', html: '<p>আপনি মাল্টি-লাইন স্ট্রিংও লিখতে পারেন:</p>' },
  { id: 'wnhcP9aqi9V8', type: 'code', language: 'html', code: 'const msg = `This is\na multiline\nstring`;' },
  { id: 'r94_oaRJxn93', text: '৪. ডিফল্ট প্যারামিটার', type: 'heading', level: 2, anchor: '4-default-parameters' },
  { id: 'tEnfwYce9q93', type: 'code', language: 'javascript', code: 'function greet(name = "Guest") {\n  console.log("Hello " + name);\n}\n\ngreet(); // Hello Guest' },
  { id: 'D-jvmjA60ggL', text: '৫. ডিস্ট্রাকচারিং', type: 'heading', level: 2, anchor: '5-destructuring' },
  { id: 'AgkEwoMmitV5', text: 'অ্যারে ডিস্ট্রাকচারিং', type: 'heading', level: 3, anchor: 'array-destructuring' },
  { id: 'zHuvfGndsCro', type: 'code', language: 'javascript', code: 'const [a, b] = [1, 2];\nconsole.log(a); // 1' },
  { id: 'E3ZU4xTBY_T7', text: 'অবজেক্ট ডিস্ট্রাকচারিং', type: 'heading', level: 3, anchor: 'object-destructuring' },
  { id: '-6U5iZ0CMKC-', type: 'code', language: 'javascript', code: 'const user = { name: "Sam", age: 25 };\nconst { name, age } = user;' },
  { id: 'ygOfUW2geYLL', text: '৬. স্প্রেড ও রেস্ট অপারেটর (...)', type: 'heading', level: 2, anchor: '6-spread-and-rest-operators' },
  { id: 'VMFTtvkZEGul', text: 'স্প্রেড (প্রসারিত করে)', type: 'heading', level: 3, anchor: 'spread-expands' },
  { id: 'PSXyrHaJRime', type: 'code', language: 'javascript', code: 'const arr1 = [1, 2];\nconst arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]' },
  { id: '0pv0Y1gNhM4F', text: 'রেস্ট (সংগ্রহ করে)', type: 'heading', level: 3, anchor: 'rest-collects' },
  { id: 'k2CFEgNL-2Bg', type: 'code', language: 'javascript', code: 'function sum(...nums) {\n  return nums.reduce((a, b) => a + b, 0);\n}' },
  { id: 'v57kMMqcjg1A', text: '৭. এনহ্যান্সড অবজেক্ট লিটারেল', type: 'heading', level: 2, anchor: '7-enhanced-object-literals' },
  { id: '4hkcE2PChjNT', type: 'code', language: 'javascript', code: 'const name = "Bob";\nconst user = {\n  name,\n  greet() {\n    console.log("Hi " + this.name);\n  }\n};' },
  { id: 'aPNPx5FdxC_S', text: '৮. for...of লুপ (অ্যারে ইটারেশন)', type: 'heading', level: 2, anchor: '8-forof-loop-array-iteration' },
  { id: 'snvjjz9QeINf', type: 'code', language: 'javascript', code: 'const colors = ["red", "green", "blue"];\nfor (const color of colors) {\n  console.log(color);\n}' },
  { id: 'jc0l1XUKLNqy', type: 'richtext', html: '<p class="note">অবজেক্টের জন্য নয়, অ্যারের সাথে <code>for...of</code> ব্যবহার করুন।</p>' },
  { id: 'vWcXm2tfkw8I', text: '৯. Promise (১৮তম অধ্যায়ে আলোচিত)', type: 'heading', level: 2, anchor: '9-promises-covered-in-chapter-18' },
  { id: 'iA3czRC2cS5I', type: 'code', language: 'javascript', code: 'const fetchData = () => {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve("Data loaded"), 1000);\n  });\n};' },
  { id: 'p1jxtzPOfhNl', text: '১০. মডিউল (import/export)', type: 'heading', level: 2, anchor: '10-modules-importexport' },
  { id: '3o5gjVJmjs2Z', text: 'এক্সপোর্ট (math.js-এ)', type: 'heading', level: 3, anchor: 'export-in-mathjs' },
  { id: 'DXW-woENjhyA', type: 'code', language: 'javascript', code: 'export const add = (a, b) => a + b;' },
  { id: 'AG1Ogfiw1EEj', text: 'ইমপোর্ট (অন্য একটি ফাইলে)', type: 'heading', level: 3, anchor: 'import-in-another-file' },
  { id: 'mmpwBAB8Rkua', type: 'code', language: 'javascript', code: "import { add } from './math.js';\nconsole.log(add(2, 3));" },
  { id: '2nfi2mBRiH2K', type: 'richtext', html: '<p class="note">এর জন্য আপনার HTML স্ক্রিপ্ট ট্যাগে <code>type="module"</code> সেট করা বা একটি বান্ডলার ব্যবহার করা প্রয়োজন।</p>' },
  { id: 'ETOQCspMAX8M', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: 'prl2f45AhZOF', type: 'richtext', html: `<ul>
                                <li>ES6 ভেরিয়েবল স্কোপিং-এ (<code>let</code>, <code>const</code>) শক্তিশালী উন্নতি, পরিষ্কার সিনট্যাক্স (অ্যারো ফাংশন, টেমপ্লেট লিটারেল) এবং আরও অনেক কিছু এনেছে।</li>
                                <li>স্প্রেড/রেস্ট অপারেটর, ডিস্ট্রাকচারিং এবং মডিউল কোডকে সহজ করে এবং পুনঃব্যবহারযোগ্যতা বাড়ায়।</li>
                                <li>এই ফিচারগুলো আধুনিক জাভাস্ক্রিপ্ট এবং React, Vue, Angular-এর মতো ফ্রেমওয়ার্কের ভিত্তি।</li>
                              </ul>` },
  { id: '5R8AqVoAo3c9', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'mKRmBAIa0jWB', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'U80UyaWC6PQP', type: 'richtext', html: `<ol>
                                    <li>একটি ফাংশন অ্যারো ফাংশন সিনট্যাক্স ব্যবহার করে পুনরায় লিখুন।</li>
                                    <li>একটি বাক্যে ভেরিয়েবল যোগ করতে টেমপ্লেট লিটারেল ব্যবহার করুন।</li>
                                    <li>একটি অবজেক্ট থেকে মান বের করতে ডিস্ট্রাকচারিং ব্যবহার করুন।</li>
                                    <li>রেস্ট অপারেটর ব্যবহার করে একটি <code>sum(...args)</code> ফাংশন তৈরি করুন।</li>
                                    <li>দুটি আলাদা ফাইলে একটি মডিউল তৈরি করুন এবং ইমপোর্ট করুন।</li>
                              </ol>` },
]

const toc = [
  { id: 'what-is-es6', text: 'ES6 কী?', level: 2 },
  { id: 'it-paved-the-way-for-modern-javascript-development', text: 'এটি আধুনিক জাভাস্ক্রিপ্ট ডেভেলপমেন্টের পথ তৈরি করেছে।', level: 2 },
  { id: '1-let-and-const---block-scoped-variables', text: '১. let এবং const - ব্লক স্কোপড ভেরিয়েবল', level: 2 },
  { id: 'let---replaces-var-for-reassignable-variables', text: 'let - পুনঃবরাদ্দযোগ্য ভেরিয়েবলের জন্য var প্রতিস্থাপন করে', level: 3 },
  { id: 'const---immutable-reference', text: 'const - অপরিবর্তনীয় রেফারেন্স', level: 3 },
  { id: '2-arrow-functions-shorter-function-syntax', text: '২. অ্যারো ফাংশন (সংক্ষিপ্ত ফাংশন সিনট্যাক্স)', level: 2 },
  { id: '3-template-literals---using-backticks', text: '৩. টেমপ্লেট লিটারেল - ব্যাকটিক ব্যবহার করে `', level: 2 },
  { id: '4-default-parameters', text: '৪. ডিফল্ট প্যারামিটার', level: 2 },
  { id: '5-destructuring', text: '৫. ডিস্ট্রাকচারিং', level: 2 },
  { id: 'array-destructuring', text: 'অ্যারে ডিস্ট্রাকচারিং', level: 3 },
  { id: 'object-destructuring', text: 'অবজেক্ট ডিস্ট্রাকচারিং', level: 3 },
  { id: '6-spread-and-rest-operators', text: '৬. স্প্রেড ও রেস্ট অপারেটর (...)', level: 2 },
  { id: 'spread-expands', text: 'স্প্রেড (প্রসারিত করে)', level: 3 },
  { id: 'rest-collects', text: 'রেস্ট (সংগ্রহ করে)', level: 3 },
  { id: '7-enhanced-object-literals', text: '৭. এনহ্যান্সড অবজেক্ট লিটারেল', level: 2 },
  { id: '8-forof-loop-array-iteration', text: '৮. for...of লুপ (অ্যারে ইটারেশন)', level: 2 },
  { id: '9-promises-covered-in-chapter-18', text: '৯. Promise (১৮তম অধ্যায়ে আলোচিত)', level: 2 },
  { id: '10-modules-importexport', text: '১০. মডিউল (import/export)', level: 2 },
  { id: 'export-in-mathjs', text: 'এক্সপোর্ট (math.js-এ)', level: 3 },
  { id: 'import-in-another-file', text: 'ইমপোর্ট (অন্য একটি ফাইলে)', level: 3 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/es6-and-modern-features: 1/1 written')
