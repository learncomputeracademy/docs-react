import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'b7729601-644a-47ef-aedc-a7b1f4fa6333' // javascript/dates
const title = 'জাভাস্ক্রিপ্ট Date'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'Date অবজেক্ট তৈরি, তারিখের অংশ পড়া ও সেট করা, ফরম্যাটিং এবং তারিখ তুলনা করা শিখুন।'

const blocks = [
  { id: 'Fe1xVLyfZLjO', type: 'richtext', html: '<hr>' },
  { id: 'HQhS84MFGa8J', text: 'জাভাস্ক্রিপ্টে Date কী?', type: 'heading', level: 2, anchor: 'what-is-a-date-in-javascript' },
  { id: 'x9FLvEH5rSyX', type: 'richtext', html: '<p>তারিখ ও সময় নিয়ে কাজ করতে জাভাস্ক্রিপ্ট <code>Date</code> অবজেক্ট ব্যবহার করে।</p>' },
  { id: 'rZfm0yuAuncZ', type: 'code', language: 'javascript', code: 'const now = new Date();\nconsole.log(now); // বর্তমান তারিখ ও সময়' },
  { id: 'smP7yLZia2xC', type: 'richtext', html: '<p>পর্দার আড়ালে, জাভাস্ক্রিপ্ট তারিখ সংরক্ষণ করে ১লা জানুয়ারি, ১৯৭০ (Unix Epoch) থেকে মিলিসেকেন্ড সংখ্যা হিসেবে।</p>' },
  { id: 'Ip7uPt4tGZ30', text: 'Date অবজেক্ট তৈরি করা', type: 'heading', level: 2, anchor: 'creating-date-objects' },
  { id: 'M1dFlESJSza_', type: 'richtext', html: '<p>আপনি বিভিন্নভাবে একটি <code>Date</code> তৈরি করতে পারেন:</p>' },
  { id: 'LrHIQhXrA55W', text: '১. বর্তমান তারিখ ও সময়', type: 'heading', level: 3, anchor: '1-current-date-and-time' },
  { id: 'FUQbNmpv-QTE', type: 'code', language: 'javascript', code: 'const now = new Date();' },
  { id: '0JVuAHDbjJuZ', text: '২. নির্দিষ্ট তারিখ ও সময়', type: 'heading', level: 3, anchor: '2-specific-date-and-time' },
  { id: '6PJZiJ209vb7', type: 'code', language: 'javascript', code: 'const birthday = new Date("2000-06-15");\nconst meeting = new Date("2025-04-30T10:30:00");' },
  { id: 'fhOgTCqhbq5t', text: '৩. আলাদা আলাদা মান ব্যবহার করে', type: 'heading', level: 3, anchor: '3-using-individual-values' },
  { id: 'YuPYt7OY9lKG', type: 'richtext', html: '<p><code>new Date(year, monthIndex, day, hours, minutes, seconds)</code></p>' },
  { id: 'TY0aPiUuMNj1', type: 'code', language: 'javascript', code: 'const customDate = new Date(2025, 3, 30, 10, 30); // এপ্রিল 30, 2025 (মাস 0 থেকে শুরু হয়)' },
  { id: 'Sq0UHLQG4adf', text: 'তারিখের অংশ পাওয়া', type: 'heading', level: 2, anchor: 'getting-date-components' },
  { id: 'I5sHJR1L4Z-q', type: 'table', header: ['মেথড', 'বিবরণ'], rows: [
    ['<code>getFullYear()</code>', 'বছর (যেমন, 2025)'],
    ['<code>getMonth()</code>', 'মাস (0 = জানুয়ারি, 11 = ডিসেম্বর)'],
    ['<code>getDate()</code>', 'মাসের দিন (1-31)'],
    ['<code>getDay()</code>', 'সপ্তাহের দিন (0 = রবিবার)'],
    ['<code>getHours()</code>', 'ঘণ্টা (0–23)'],
    ['<code>getMinutes()</code>', 'মিনিট (0–59)/td&gt;'],
    ['<code>getSeconds()</code>', 'সেকেন্ড (0–59)'],
    ['<code>getMilliseconds()</code>', 'মিলিসেকেন্ড (0–999)'],
    ['<code>getTime()</code>', 'মিলিসেকেন্ড (0–999)'],
  ] },
  { id: 'oU-uHdOinW-K', type: 'code', language: 'javascript', code: 'const now = new Date();\nconsole.log(now.getFullYear());  // 2025\nconsole.log(now.getMonth());     // 3 (এপ্রিল)\nconsole.log(now.getDate());      // 30\nconsole.log(now.getDay());       // 3 (বুধবার)\nconsole.log(now.getHours());     // যেমন, 14' },
  { id: 'ddqdlm3NrLDR', text: 'তারিখের অংশ সেট করা', type: 'heading', level: 2, anchor: 'setting-date-components' },
  { id: 'c50CG2W9gh6P', type: 'table', header: ['মেথড', 'বিবরণ'], rows: [
    ['<code>getFullYear()</code>', 'বছর (যেমন, 2025)'],
    ['<code>setMonth()</code>', 'মাস সেট করুন (0–11)'],
    ['<code>setDate()</code>', 'মাসের দিন সেট করুন'],
    ['<code>setHours()</code>', 'ঘণ্টা সেট করুন'],
    ['<code>setMinutes()</code>', 'মিনিট সেট করুন'],
    ['<code>setSeconds()</code>', 'সেকেন্ড সেট করুন'],
  ] },
  { id: 'Xh00NG8HGjTH', type: 'code', language: 'javascript', code: 'const d = new Date();\nd.setFullYear(2030);\nd.setMonth(0); // জানুয়ারি\nd.setDate(1);' },
  { id: 'y7qx4JW33DP3', text: 'তারিখ ফরম্যাট করা', type: 'heading', level: 2, anchor: 'formatting-dates' },
  { id: '_K1FeGnSQptf', type: 'richtext', html: '<p>জাভাস্ক্রিপ্টে <code>"dd/mm/yyyy"</code>-এর মতো বিল্ট-ইন ফরম্যাটিং নেই, তবে আপনি ম্যানুয়ালি ফরম্যাট করতে পারেন:</p>' },
  { id: '8NjoyDoMhwU5', type: 'code', language: 'javascript', code: 'const d = new Date();\nconst day = d.getDate();\nconst month = d.getMonth() + 1;\nconst year = d.getFullYear();\n                                    \nconst formatted = `${day}/${month}/${year}`;\nconsole.log(formatted); // যেমন, 30/4/2025' },
  { id: 'eB2d7WYqCq6f', text: 'তারিখ তুলনা', type: 'heading', level: 2, anchor: 'date-comparison' },
  { id: 'aIecsNTnC7ml', type: 'code', language: 'javascript', code: 'const d1 = new Date("2024-01-01");\nconst d2 = new Date("2025-01-01");\n                                    \nconsole.log(d1 < d2); // true' },
  { id: '-fXZrUpMjaiU', text: 'সময়ের পার্থক্য গণনা করা', type: 'heading', level: 2, anchor: 'calculating-time-differences' },
  { id: 'DGk9zWKWmpao', type: 'richtext', html: '<p>মিলিসেকেন্ডে সময় পেতে আপনি দুটি তারিখ বিয়োগ করতে পারেন।</p>' },
  { id: 'zFB7fjeJk0PI', type: 'code', language: 'javascript', code: 'const start = new Date("2025-01-01");\nconst end = new Date("2025-02-01");\n                                    \nconst diffInMs = end - start;\nconst diffInDays = diffInMs / (1000 * 60 * 60 * 24);\n                                    \nconsole.log(diffInDays); // 31' },
  { id: 'cuHpbqoJLiMT', text: 'অটো-কারেকশন', type: 'heading', level: 2, anchor: 'auto-correction' },
  { id: 'r-Bn0w54yR_u', type: 'richtext', html: '<p>জাভাস্ক্রিপ্ট অবৈধ তারিখ স্বয়ংক্রিয়ভাবে সামঞ্জস্য করে:</p>' },
  { id: 'fDmA7mccW-Dr', type: 'code', language: 'javascript', code: 'const d = new Date(2025, 0, 32); // জানুয়ারি 32 → স্বয়ংক্রিয়ভাবে ফেব্রুয়ারি 1-এ সংশোধিত হয়\nconsole.log(d); // Sat Feb 01 2025' },
  { id: '4V2TYZwjES7m', text: 'স্ট্রিংয়ে রূপান্তর করা', type: 'heading', level: 2, anchor: 'converting-to-string' },
  { id: '084OIi71Jkot', type: 'table', header: ['মেথড', 'উদাহরণ আউটপুট'], rows: [
    ['<code>toString()</code>', '<code>"Wed Apr 30 2025 10:30:00 GMT+..."</code>'],
    ['<code>toDateString()</code>', '<code>"Wed Apr 30 2025"</code>'],
    ['<code>toTimeString()</code>', '<code>"10:30:00 GMT+..."</code>'],
    ['<code>toISOString()</code>', '<code>"2025-04-30T10:30:00.000Z"</code>'],
  ] },
  { id: 'pIY5NgX3oB0l', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'Vthwv44cbtcR', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'L07RwDafIJ4u', type: 'richtext', html: `<ol>
                                    <li>আপনার জন্মদিনের জন্য একটি নতুন তারিখ তৈরি করুন।</li>
                                    <li><code>get...()</code> মেথড ব্যবহার করে বর্তমান বছর, মাস এবং তারিখ প্রিন্ট করুন।</li>
                                    <li>নববর্ষ পর্যন্ত কত দিন বাকি আছে তা গণনা করুন।</li>
                                    <li>দুটি তারিখ তুলনা করে দেখুন কোনটি আগে আসে।</li>
                                    <li>স্ট্রিং ইন্টারপোলেশন ব্যবহার করে আজকের তারিখ <code>"DD-MM-YYYY"</code> আকারে ফরম্যাট করুন।</li>
                                </ol>` },
]

const toc = [
  { id: 'what-is-a-date-in-javascript', text: 'জাভাস্ক্রিপ্টে Date কী?', level: 2 },
  { id: 'creating-date-objects', text: 'Date অবজেক্ট তৈরি করা', level: 2 },
  { id: '1-current-date-and-time', text: '১. বর্তমান তারিখ ও সময়', level: 3 },
  { id: '2-specific-date-and-time', text: '২. নির্দিষ্ট তারিখ ও সময়', level: 3 },
  { id: '3-using-individual-values', text: '৩. আলাদা আলাদা মান ব্যবহার করে', level: 3 },
  { id: 'getting-date-components', text: 'তারিখের অংশ পাওয়া', level: 2 },
  { id: 'setting-date-components', text: 'তারিখের অংশ সেট করা', level: 2 },
  { id: 'formatting-dates', text: 'তারিখ ফরম্যাট করা', level: 2 },
  { id: 'date-comparison', text: 'তারিখ তুলনা', level: 2 },
  { id: 'calculating-time-differences', text: 'সময়ের পার্থক্য গণনা করা', level: 2 },
  { id: 'auto-correction', text: 'অটো-কারেকশন', level: 2 },
  { id: 'converting-to-string', text: 'স্ট্রিংয়ে রূপান্তর করা', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/dates: 1/1 written')
