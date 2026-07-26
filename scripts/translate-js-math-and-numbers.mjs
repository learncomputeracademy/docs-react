import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'b480cc47-7ca6-4e21-80ba-54001c3e9998' // javascript/math-and-numbers
const title = 'জাভাস্ক্রিপ্ট Math এবং সংখ্যা'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'অ্যারিথমেটিক অপারেটর, Math অবজেক্ট, নম্বর রূপান্তর এবং ডেসিমেল নিয়ে কাজ করা শিখুন।'

const blocks = [
  { id: 'CZ8s1DJwmKmi', type: 'richtext', html: '<hr>' },
  { id: 'cnZE1IEWtIYJ', text: 'জাভাস্ক্রিপ্টে সংখ্যা কী?', type: 'heading', level: 2, anchor: 'what-are-numbers-in-javascript' },
  { id: '1B-m8AQcQTp5', type: 'richtext', html: `<p>জাভাস্ক্রিপ্ট সব ধরনের সংখ্যাগত মান প্রতিনিধিত্ব করতে একটি একক <strong>Number টাইপ</strong> ব্যবহার করে — যার মধ্যে আছে:</p>
<ul>
                                    <li>পূর্ণসংখ্যা: <code>1</code>, <code>42</code>, <code>-5</code></li>
                                    <li>ফ্লোটিং-পয়েন্ট সংখ্যা (দশমিক): <code>3.14</code>, <code>-0.99</code></li>
                                    <li>এক্সপোনেনশিয়াল সংখ্যা: <code>1.5e3</code> (1500-এর সমান)</li>
                                </ul>` },
  { id: 'cibwrqfsCJZF', type: 'code', language: 'javascript', code: 'let a = 10;\nlet b = 3.14;' },
  { id: 'g7PEm7b34P2_', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b>অন্যান্য কিছু ভাষার মতো জাভাস্ক্রিপ্টে int এবং float-এর জন্য <code>আলাদা</code> টাইপ নেই।</p>' },
  { id: 'fChH4N45IrjT', text: 'মৌলিক অ্যারিথমেটিক অপারেটর', type: 'heading', level: 2, anchor: 'basic-arithmetic-operators' },
  { id: 'REZpLEvaHKa-', type: 'table', header: ['অপারেটর', 'বিবরণ', 'উদাহরণ'], rows: [
    ['<code>+</code>', 'যোগ', '<code>5 + 3</code> → <code>8</code>'],
    ['<code>-</code>', 'বিয়োগ', '<code>5 - 2</code> → <code>3</code>'],
    ['<code>*</code>', 'গুণ', '<code>5 * 3</code> → <code>15</code>'],
    ['<code>/</code>', 'ভাগ', '<code>15 / 3</code> → <code>5</code>'],
    ['<code>%</code>', 'মডুলাস (ভাগশেষ)', '<code>7 / 3</code> → <code>1</code>'],
    ['<code>**</code>', 'এক্সপোনেনশিয়েশন', '<code>2**3</code> → <code>8</code>'],
  ] },
  { id: '8pZnMkue1HNL', text: 'ইনক্রিমেন্ট ও ডিক্রিমেন্ট', type: 'heading', level: 2, anchor: 'increment-and-decrement' },
  { id: 'mUnzSMEW_KTW', type: 'code', language: 'javascript', code: 'let x = 5;\nx++;  // x = 6\nx--;  // x = 5' },
  { id: 'N-q0FJ-NX7_Z', type: 'richtext', html: `<p>আপনি এগুলোও ব্যবহার করতে পারেন:</p>
<ul>
                                    <li>x += 2</li>
                                    <li>x *= 3</li>
                                    <li>x /= 2, ইত্যাদি।</li>
                                </ul>` },
  { id: '7UoJnEPgn0_k', text: 'Math অবজেক্ট নিয়ে কাজ করা', type: 'heading', level: 2, anchor: 'working-with-the-math-object' },
  { id: 'fZOMISfA7ijA', type: 'richtext', html: '<p>জাভাস্ক্রিপ্ট অনেক মেথড ও প্রপার্টিসহ একটি বিল্ট-ইন <code>Math</code> অবজেক্ট দেয়।</p>' },
  { id: 'Ikpsyb9BMgja', text: 'সাধারণ Math মেথড', type: 'heading', level: 2, anchor: 'common-math-methods' },
  { id: 'boiU9NnIhCU_', type: 'table', header: ['মেথড', 'বিবরণ', 'উদাহরণ'], rows: [
    ['<code>Math.round()</code>', 'নিকটতম পূর্ণসংখ্যায় রাউন্ড করে', '<code>Math.round(4.6)</code> → <code>5</code>'],
    ['<code>Math.floor()</code>', 'নিচের দিকে রাউন্ড করে', '<code>Math.floor(4.9)</code> → <code>4</code>'],
    ['<code>Math.ceil()</code>', 'উপরের দিকে রাউন্ড করে', '<code>Math.ceil(4.1)</code> → <code>5</code>'],
    ['<code>Math.trunc()</code>', 'দশমিক অংশ সরায়', '<code>Math.trunc(4.8)</code> → <code>4</code>'],
    ['<code>Math.abs()</code>', 'পরম মান (absolute value)', '<code>Math.abs(-10)</code> → <code>10</code>'],
    ['<code>Math.pow()</code>', 'এক্সপোনেনশিয়েশন', '<code>Math.pow(2, 3)</code> → <code>8</code>'],
    ['<code>Math.sqrt()</code>', 'বর্গমূল', '<code>Math.sqrt(16)</code> → <code>4</code>'],
    ['<code>Math.max()</code>', 'সর্বোচ্চ মান', '<code>Math.max(1, 5, 3)</code> → <code>5</code>'],
    ['<code>Math.min()</code>', 'সর্বনিম্ন মান', '<code>Math.min(1, 5, 3)</code> → <code>1</code>'],
    ['<code>Math.random()</code>', '0 এবং 1-এর মধ্যে একটি র‍্যান্ডম সংখ্যা', '<code>Math.random()</code>'],
  ] },
  { id: 'REAIN0432SET', text: 'একটি সীমার মধ্যে র‍্যান্ডম সংখ্যা', type: 'heading', level: 2, anchor: 'random-number-between-a-range' },
  { id: 'y3WyhNG1d-jf', type: 'code', language: 'javascript', code: '// 1 থেকে 10-এর মধ্যে একটি র‍্যান্ডম সংখ্যা\nlet random = Math.floor(Math.random() * 10) + 1;\nconsole.log(random);' },
  { id: 'LMlp3C2HgvdC', text: 'সংখ্যা রূপান্তর', type: 'heading', level: 2, anchor: 'number-conversion' },
  { id: 'GKyjw6dyyvMh', text: 'parseInt() - স্ট্রিংকে পূর্ণসংখ্যায় রূপান্তর করে', type: 'heading', level: 3, anchor: 'parseint---converts-string-to-integer' },
  { id: 'Bkvackghav0h', type: 'code', language: 'javascript', code: 'let n = parseInt("42");  // 42' },
  { id: 'SI8V5IcoggUp', text: 'parseFloat() - স্ট্রিংকে ফ্লোটে রূপান্তর করে', type: 'heading', level: 3, anchor: 'parsefloat---converts-string-to-float' },
  { id: 'pvAFq7uvDeqC', type: 'code', language: 'javascript', code: 'let n = parseFloat("3.14"); // 3.14' },
  { id: 'ybJ5zXj9TciK', text: 'Number() - যেকোনো টাইপকে সংখ্যায় রূপান্তর করে', type: 'heading', level: 3, anchor: 'number---converts-any-type-to-number' },
  { id: 'z8DAUJ8nvKgo', type: 'code', language: 'javascript', code: 'Number("10")      // 10\nNumber(true)      // 1\nNumber("abc")     // NaN' },
  { id: 'O9opWgZkRW1R', text: 'isNaN() - সংখ্যা নয় কি?', type: 'heading', level: 3, anchor: 'isnan---is-not-a-number' },
  { id: '_65fiJarjZbe', type: 'code', language: 'javascript', code: 'console.log(isNaN("abc")); // true\nconsole.log(isNaN(123));   // false' },
  { id: 'CkZNSvzb2yfW', text: 'দশমিক নিয়ে কাজ করা', type: 'heading', level: 2, anchor: 'dealing-with-decimals' },
  { id: 'LupwjrRLvQis', type: 'richtext', html: '<p>মাঝে মাঝে ফ্লোটিং-পয়েন্ট গণিত অসম্পূর্ণ হতে পারে:</p>' },
  { id: 'o0-e6RIIeylQ', type: 'code', language: 'javascript', code: 'console.log(0.1 + 0.2); // 0.30000000000000004 😕' },
  { id: 'iEsqq4sNQb75', type: 'richtext', html: '<p><code>toFixed()</code> ব্যবহার করে এটি ঠিক করতে পারেন:</p>' },
  { id: '0vqtsarTFVMK', type: 'code', language: 'javascript', code: 'let total = (0.1 + 0.2).toFixed(2); // "0.30" (একটি স্ট্রিং হিসেবে)' },
  { id: 'Dq9bNECrjvcu', text: 'সংখ্যার মেথড', type: 'heading', level: 2, anchor: 'number-methods' },
  { id: 'uUVCrj6YFYLa', type: 'table', header: ['মেথড', 'বিবরণ', 'উদাহরণ'], rows: [
    ['<code>toFixed(n)</code>', '<code>n</code> সংখ্যক দশমিক স্থানে রাউন্ড করে', '<code>(3.14159).toFixed(2)</code> → <code>"3.14"</code>'],
    ['<code>toString()</code>', 'সংখ্যাকে স্ট্রিংয়ে রূপান্তর করে', '<code>(100).toString()</code> → <code>"100"</code>'],
    ['<code>typeof</code>', 'এটি একটি সংখ্যা কিনা যাচাই করে', '<code>typeof 42</code> → <code>"number"</code>'],
  ] },
  { id: '-PYtiVy8vHw8', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'fukGy1RpgzZa', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: '3eEUmVuByMxy', type: 'richtext', html: `<ol>
                                    <li>এমন একটি প্রোগ্রাম লিখুন যা দুটি সংখ্যা যোগ, বিয়োগ, গুণ এবং ভাগ করে।</li>
                                    <li>1 থেকে 100-এর মধ্যে একটি র‍্যান্ডম সংখ্যা তৈরি করুন।</li>
                                    <li><code>toFixed()</code> ব্যবহার করে <code>4.675</code>-কে ২ দশমিক স্থানে রাউন্ড করুন।</li>
                                    <li><code>"123.45"</code>-কে একটি সংখ্যায় রূপান্তর করুন এবং সেটিকে <code>2</code> দিয়ে গুণ করুন।</li>
                                    <li><code>Math.sqrt()</code> ব্যবহার করে যেকোনো সংখ্যার বর্গমূল বের করুন।</li>
                                </ol>` },
]

const toc = [
  { id: 'what-are-numbers-in-javascript', text: 'জাভাস্ক্রিপ্টে সংখ্যা কী?', level: 2 },
  { id: 'basic-arithmetic-operators', text: 'মৌলিক অ্যারিথমেটিক অপারেটর', level: 2 },
  { id: 'increment-and-decrement', text: 'ইনক্রিমেন্ট ও ডিক্রিমেন্ট', level: 2 },
  { id: 'working-with-the-math-object', text: 'Math অবজেক্ট নিয়ে কাজ করা', level: 2 },
  { id: 'common-math-methods', text: 'সাধারণ Math মেথড', level: 2 },
  { id: 'random-number-between-a-range', text: 'একটি সীমার মধ্যে র‍্যান্ডম সংখ্যা', level: 2 },
  { id: 'number-conversion', text: 'সংখ্যা রূপান্তর', level: 2 },
  { id: 'parseint---converts-string-to-integer', text: 'parseInt() - স্ট্রিংকে পূর্ণসংখ্যায় রূপান্তর করে', level: 3 },
  { id: 'parsefloat---converts-string-to-float', text: 'parseFloat() - স্ট্রিংকে ফ্লোটে রূপান্তর করে', level: 3 },
  { id: 'number---converts-any-type-to-number', text: 'Number() - যেকোনো টাইপকে সংখ্যায় রূপান্তর করে', level: 3 },
  { id: 'isnan---is-not-a-number', text: 'isNaN() - সংখ্যা নয় কি?', level: 3 },
  { id: 'dealing-with-decimals', text: 'দশমিক নিয়ে কাজ করা', level: 2 },
  { id: 'number-methods', text: 'সংখ্যার মেথড', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/math-and-numbers: 1/1 written')
