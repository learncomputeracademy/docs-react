import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '20e56d72-19b8-421b-ad71-ce0d19205834' // javascript/arrays
const title = 'জাভাস্ক্রিপ্ট অ্যারে'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'অ্যারে তৈরি, লুপিং, সাধারণ মেথড এবং map/filter/find-এর মতো আধুনিক অ্যারে মেথড শিখুন।'

const blocks = [
  { id: 'AjyJFOJXxTM_', type: 'richtext', html: '<hr>' },
  { id: 'n4oh2hBqja8c', text: 'অ্যারে কী?', type: 'heading', level: 2, anchor: 'what-is-an-array' },
  { id: 'JkJ-_nq164t4', type: 'richtext', html: '<p>একটি <strong>অ্যারে</strong> হলো একটি বিশেষ ভেরিয়েবল, যা একই জায়গায় <strong>একাধিক মান সংরক্ষণ করতে</strong> ব্যবহৃত হয়।</p>' },
  { id: 'eO1ieXoXXJu0', type: 'code', language: 'javascript', code: 'const colors = ["red", "green", "blue"];' },
  { id: 'TcwBIqqlQFVT', type: 'richtext', html: '<p>এটিকে একটি তালিকা বা আইটেমের সংগ্রহ হিসেবে ভাবুন — প্রতিটির একটি ইনডেক্স থাকে যা <code>0</code> থেকে শুরু হয়।</p>' },
  { id: 'Av9QVLd1vvy8', text: 'কেন অ্যারে ব্যবহার করবেন?', type: 'heading', level: 2, anchor: 'why-use-arrays' },
  { id: 'UqDtu5_VJj-s', type: 'richtext', html: `<ul>
                                    <li>সম্পর্কিত ডেটা সংরক্ষণ করতে (যেমন নাম, স্কোর, আইটেম)</li>
                                    <li>একাধিক মানের মধ্য দিয়ে লুপ করতে</li>
                                    <li>সর্টিং, ফিল্টারিং, সার্চিং ইত্যাদির মতো অপারেশন করতে</li>
                                </ul>` },
  { id: 'KczAGEyf8-rA', text: 'অ্যারে তৈরি করা', type: 'heading', level: 2, anchor: 'creating-arrays' },
  { id: 'R48lkKyPy1Lo', type: 'code', language: 'javascript', code: 'const fruits = ["apple", "banana", "cherry"];\nconst numbers = [10, 20, 30, 40];\nconst mixed = ["text", 100, true, null];' },
  { id: 'GtnLIhlndXXD', type: 'richtext', html: '<p>আপনি <code>Array()</code> কনস্ট্রাক্টর ব্যবহার করেও একটি অ্যারে তৈরি করতে পারেন:</p>' },
  { id: 'sZ-drFcXQXPb', type: 'code', language: 'javascript', code: 'const cars = new Array("Toyota", "Honda", "BMW");' },
  { id: 'qFOvAXNAh6_U', text: 'অ্যারের এলিমেন্ট অ্যাক্সেস করা', type: 'heading', level: 2, anchor: 'accessing-array-elements' },
  { id: 'mpO8d9Ld8Hwm', type: 'code', language: 'javascript', code: 'console.log(fruits[0]); // apple\nconsole.log(fruits[2]); // cherry' },
  { id: 'eRf_qvKiJqVw', text: 'অ্যারের এলিমেন্ট পরিবর্তন করা', type: 'heading', level: 2, anchor: 'modifying-array-elements' },
  { id: '91eoZdUmpP-K', type: 'code', language: 'javascript', code: 'fruits[1] = "mango";\nconsole.log(fruits); // ["apple", "mango", "cherry"]' },
  { id: 'u-8k_znCzWD7', text: 'অ্যারের দৈর্ঘ্য', type: 'heading', level: 2, anchor: 'array-length' },
  { id: '8rSOSglo-Yab', type: 'code', language: 'javascript', code: 'console.log(fruits.length); // 3' },
  { id: 'pfPotE4Y9YAF', text: 'এলিমেন্ট যোগ ও অপসারণ', type: 'heading', level: 2, anchor: 'adding-removing-elements' },
  { id: 'acASBUPO9c_N', text: 'push() — শেষে যোগ করে', type: 'heading', level: 3, anchor: 'push-add-to-end' },
  { id: 'rm2Ml6iLa-tF', type: 'code', language: 'javascript', code: 'fruits.push("grape");' },
  { id: 'Gkp02lU5dsaE', text: 'pop() — শেষ থেকে সরায়', type: 'heading', level: 3, anchor: 'pop-remove-from-end' },
  { id: 'L78wVITJNSxC', type: 'code', language: 'javascript', code: 'fruits.pop();' },
  { id: 'xQpDYxp9zyYC', text: 'unshift() — শুরুতে যোগ করে', type: 'heading', level: 3, anchor: 'unshift-add-to-beginning' },
  { id: 'ikgAeuRRkZPd', type: 'code', language: 'javascript', code: 'fruits.unshift("orange");' },
  { id: 'h7uNOa4_lsEl', text: 'shift() — শুরু থেকে সরায়', type: 'heading', level: 3, anchor: 'shift-remove-from-beginning' },
  { id: '7Sf7pEGC7c34', type: 'code', language: 'javascript', code: 'fruits.shift();' },
  { id: 'y5hmwRs0HHPA', text: 'অ্যারের মধ্য দিয়ে লুপ করা', type: 'heading', level: 2, anchor: 'looping-through-arrays' },
  { id: 'R1aYY49l9Xb5', text: 'for লুপ', type: 'heading', level: 3, anchor: 'for-loop' },
  { id: 'aD_wEUmPcQG0', type: 'code', language: 'javascript', code: 'for (let i = 0; i < fruits.length; i++) {\n  console.log(fruits[i]);\n}' },
  { id: '9kKFa8EpyNOo', text: 'for...of', type: 'heading', level: 3, anchor: 'forof' },
  { id: '7ffbWR48rmWl', type: 'code', language: 'javascript', code: 'for (let fruit of fruits) {\n  console.log(fruit);\n}' },
  { id: 'eFtu0_fFMPk9', text: 'forEach()', type: 'heading', level: 3, anchor: 'foreach' },
  { id: 'MSjWOsOhXFvw', type: 'code', language: 'javascript', code: 'fruits.forEach(function(fruit) {\n  console.log(fruit);\n});' },
  { id: '3dD9jOdvY-Uf', text: 'সাধারণ অ্যারে মেথড', type: 'heading', level: 2, anchor: 'common-array-methods' },
  { id: 'j7lqyC78QVC0', type: 'table', header: ['মেথড', 'বিবরণ', 'উদাহরণ'], rows: [
    ['<code>push()</code>', 'শেষে আইটেম যোগ করে', '<code>arr.push("new")</code>'],
    ['<code>pop()</code>', 'শেষ আইটেম সরায়', '<code>arr.pop()</code>'],
    ['<code>shift()</code>', 'প্রথম আইটেম সরায়', '<code>arr.shift()</code>'],
    ['<code>unshift()</code>', 'শুরুতে আইটেম যোগ করে', '<code>arr.unshift("start")</code>'],
    ['<code>indexOf()</code>', 'একটি আইটেমের ইনডেক্স খুঁজে বের করে', '<code>arr.indexOf("banana")</code>'],
    ['<code>includes()</code>', 'আইটেম আছে কিনা যাচাই করে', '<code>arr.includes("apple")</code>'],
    ['<code>join()</code>', 'অ্যারেকে স্ট্রিংয়ে জোড়া দেয়', '<code>arr.join(", ")</code>'],
    ['<code>slice()</code>', 'অ্যারের একটি অংশ বের করে', '<code>arr.slice(1, 3)</code>'],
    ['<code>splice()</code>', 'আইটেম যোগ/অপসারণ করে', '<code>arr.splice(1, 2, "new")</code>'],
    ['<code>concat()</code>', 'অ্যারে একত্রিত করে', '<code>arr1.concat(arr2)</code>'],
    ['<code>reverse()</code>', 'অ্যারে উল্টে দেয়', '<code>arr.reverse()</code>'],
    ['<code>sort()</code>', 'অ্যারে সর্ট করে', '<code>arr.sort()</code>'],
  ] },
  { id: 'Sw8_mlIQJAoJ', text: 'অ্যারেতে খোঁজা', type: 'heading', level: 2, anchor: 'searching-in-arrays' },
  { id: 'KWp3SDfaYOwu', type: 'code', language: 'javascript', code: 'const pets = ["cat", "dog", "rabbit"];\n\nconsole.log(pets.includes("dog")); // true\nconsole.log(pets.indexOf("rabbit")); // 2' },
  { id: '7uAtogWlrUpM', text: 'অবজেক্টের অ্যারে', type: 'heading', level: 2, anchor: 'array-of-objects' },
  { id: 'uZfglk2d0HW3', type: 'code', language: 'javascript', code: 'const users = [\n  { name: "Alice", age: 25 },\n  { name: "Bob", age: 30 }\n];\n                                  \nconsole.log(users[0].name); // Alice' },
  { id: 'HIQHokLNWIYG', text: 'আধুনিক অ্যারে মেথড (ES6+)', type: 'heading', level: 2, anchor: 'modern-array-methods-es6' },
  { id: '0hlgihaW5qXT', text: 'map() - প্রতিটি আইটেম রূপান্তর করে', type: 'heading', level: 3, anchor: 'map---transforms-each-item' },
  { id: 'fLjpil6ubPsC', type: 'code', language: 'javascript', code: 'const nums = [1, 2, 3];\nconst squared = nums.map(n => n * n); // [1, 4, 9]' },
  { id: '-FOPzv3hDOBR', text: 'filter() - শুধু মিলে যাওয়া আইটেম রাখে', type: 'heading', level: 3, anchor: 'filter---keeps-only-matching-items' },
  { id: 'w7tHNBQabSaU', type: 'code', language: 'javascript', code: 'const ages = [12, 18, 22, 15];\nconst adults = ages.filter(age => age >= 18); // [18, 22]' },
  { id: 'q5VKd3x5UUIQ', text: 'find() – প্রথম মিলে যাওয়া আইটেম রিটার্ন করে', type: 'heading', level: 3, anchor: 'find-returns-first-matching-item' },
  { id: 'yUzGwP4OrKbO', type: 'code', language: 'javascript', code: 'const found = ages.find(age => age > 18); // 22' },
  { id: 'zE8wnkCG6Phy', text: 'অ্যারে ডিস্ট্রাকচারিং', type: 'heading', level: 2, anchor: 'destructuring-arrays' },
  { id: 'E6Ew72lbRye_', type: 'richtext', html: '<p>সহজেই মান ভেরিয়েবলে বের করে নিন:</p>' },
  { id: 'M7edXQUpN1X0', type: 'code', language: 'javascript', code: 'const cities = ["Delhi", "Mumbai", "Chennai"];\nconst [first, second] = cities;\n                                    \nconsole.log(first); // Delhi\nconsole.log(second); // Mumbai' },
  { id: 'SSX4IupO3ysn', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'nbsKEkuO7Tcv', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'MooPChn_UFzZ', type: 'richtext', html: `<ol>
                                    <li>আপনার প্রিয় মুভির একটি অ্যারে তৈরি করুন এবং একটি লুপ ব্যবহার করে প্রতিটি প্রিন্ট করুন।</li>
                                    <li><code>push()</code> এবং <code>pop()</code> ব্যবহার করে আইটেম যোগ ও অপসারণ করুন।</li>
                                    <li>সংখ্যার একটি অ্যারে তৈরি করুন এবং প্রতিটি সংখ্যা দ্বিগুণ করতে <code>map()</code> ব্যবহার করুন।</li>
                                    <li>সব জোড় সংখ্যা খুঁজে বের করতে একটি অ্যারে ফিল্টার করুন।</li>
                                    <li>অ্যারের একটি আইটেম প্রতিস্থাপন করতে <code>splice()</code> ব্যবহার করুন।</li>
                                </ol>` },
]

const toc = [
  { id: 'what-is-an-array', text: 'অ্যারে কী?', level: 2 },
  { id: 'why-use-arrays', text: 'কেন অ্যারে ব্যবহার করবেন?', level: 2 },
  { id: 'creating-arrays', text: 'অ্যারে তৈরি করা', level: 2 },
  { id: 'accessing-array-elements', text: 'অ্যারের এলিমেন্ট অ্যাক্সেস করা', level: 2 },
  { id: 'modifying-array-elements', text: 'অ্যারের এলিমেন্ট পরিবর্তন করা', level: 2 },
  { id: 'array-length', text: 'অ্যারের দৈর্ঘ্য', level: 2 },
  { id: 'adding-removing-elements', text: 'এলিমেন্ট যোগ ও অপসারণ', level: 2 },
  { id: 'push-add-to-end', text: 'push() — শেষে যোগ করে', level: 3 },
  { id: 'pop-remove-from-end', text: 'pop() — শেষ থেকে সরায়', level: 3 },
  { id: 'unshift-add-to-beginning', text: 'unshift() — শুরুতে যোগ করে', level: 3 },
  { id: 'shift-remove-from-beginning', text: 'shift() — শুরু থেকে সরায়', level: 3 },
  { id: 'looping-through-arrays', text: 'অ্যারের মধ্য দিয়ে লুপ করা', level: 2 },
  { id: 'for-loop', text: 'for লুপ', level: 3 },
  { id: 'forof', text: 'for...of', level: 3 },
  { id: 'foreach', text: 'forEach()', level: 3 },
  { id: 'common-array-methods', text: 'সাধারণ অ্যারে মেথড', level: 2 },
  { id: 'searching-in-arrays', text: 'অ্যারেতে খোঁজা', level: 2 },
  { id: 'array-of-objects', text: 'অবজেক্টের অ্যারে', level: 2 },
  { id: 'modern-array-methods-es6', text: 'আধুনিক অ্যারে মেথড (ES6+)', level: 2 },
  { id: 'map---transforms-each-item', text: 'map() - প্রতিটি আইটেম রূপান্তর করে', level: 3 },
  { id: 'filter---keeps-only-matching-items', text: 'filter() - শুধু মিলে যাওয়া আইটেম রাখে', level: 3 },
  { id: 'find-returns-first-matching-item', text: 'find() – প্রথম মিলে যাওয়া আইটেম রিটার্ন করে', level: 3 },
  { id: 'destructuring-arrays', text: 'অ্যারে ডিস্ট্রাকচারিং', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/arrays: 1/1 written')
