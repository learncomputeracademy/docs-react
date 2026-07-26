import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'c0733852-ace0-4b1a-a5b6-754354e6a42a' // javascript/control-flow
const title = 'জাভাস্ক্রিপ্ট কন্ট্রোল ফ্লো'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'if/else, switch, লুপ এবং break/continue/return দিয়ে জাভাস্ক্রিপ্টে কন্ট্রোল ফ্লো শিখুন।'

const blocks = [
  { id: 'FAd91-F2pBAY', type: 'richtext', html: '<hr>' },
  { id: 'EZhrQKyLGShi', text: 'কন্ট্রোল ফ্লো কী?', type: 'heading', level: 2, anchor: 'what-is-control-flow' },
  { id: 'bSEJxaCC62CN', type: 'richtext', html: `<p>জাভাস্ক্রিপ্টে <strong>কন্ট্রোল ফ্লো</strong> বলতে বোঝায় <strong>কোড যে ক্রমে এক্সিকিউট হয়</strong> তা।</p>
<p>ডিফল্টভাবে, জাভাস্ক্রিপ্ট উপর থেকে নিচে কোড চালায়, কিন্তু কন্ট্রোল ফ্লো স্টেটমেন্ট আপনাকে দেয়:</p>
<ul>
                                    <li>সিদ্ধান্ত নেওয়ার সুযোগ (<code>if</code>, <code>else</code>)</li>
                                    <li>লুপ ব্যবহার করে কোড পুনরাবৃত্তি করার সুযোগ</li>
                                    <li>একাধিক ফলাফল হ্যান্ডেল করার সুযোগ (<code>switch</code>)</li>
                                    <li>আগেই বেরিয়ে যাওয়ার সুযোগ (<code>break</code>, <code>return</code>, <code>continue</code>)</li>
                                </ul>` },
  { id: 'RTtUjgReJmJ3', text: '১. if, else if, else স্টেটমেন্ট', type: 'heading', level: 2, anchor: '1-if-else-if-else-statements' },
  { id: 'QDXji0J1s4sy', text: 'সিনট্যাক্স:', type: 'heading', level: 3, anchor: 'syntax' },
  { id: 'R81Rb7TrvOjr', type: 'code', language: 'javascript', code: 'if (condition) {\n    // condition true হলে এই কোড চলে\n} else if (anotherCondition) {\n    // anotherCondition true হলে এই কোড চলে\n} else {\n    // উপরের কোনোটিই true না হলে এই কোড চলে\n}' },
  { id: '5UykjPwxpc9L', text: 'উদাহরণ:', type: 'heading', level: 3, anchor: 'example' },
  { id: 'INoNKcEsyZEg', type: 'code', language: 'javascript', code: 'let age = 20;\n\nif (age >= 18) {\n  console.log("You are an adult.");\n} else {\n  console.log("You are a minor.");\n}' },
  { id: 'MqLLDd3VEIye', text: '২. switch স্টেটমেন্ট', type: 'heading', level: 2, anchor: '2-switch-statement' },
  { id: 'spt8x_7-d31v', type: 'richtext', html: '<p>অনেক <code>else if</code>-এর চেয়ে আরও পরিষ্কারভাবে <strong>একাধিক শর্ত</strong> হ্যান্ডেল করতে <code>switch</code> স্টেটমেন্ট ব্যবহার করা হয়।</p>' },
  { id: 'fthVxds3QotY', text: 'সিনট্যাক্স:', type: 'heading', level: 3, anchor: 'syntax-2' },
  { id: 'VULBxv-9jHO7', type: 'code', language: 'javascript', code: 'switch (expression) {\n  case value1:\n    // কোড ব্লক\n    break;\n  case value2:\n    // কোড ব্লক\n    break;\n  default:\n    // ডিফল্ট কোড ব্লক\n}' },
  { id: 'gP9c520YXBlZ', text: 'উদাহরণ:', type: 'heading', level: 3, anchor: 'example-2' },
  { id: 'Qo7C-TVUWQjo', type: 'code', language: 'javascript', code: 'let color = "blue";\n\nswitch (color) {\n  case "red":\n    console.log("Stop!");\n    break;\n  case "yellow":\n    console.log("Get ready!");\n    break;\n  case "green":\n    console.log("Go!");\n    break;\n  default:\n    console.log("Unknown color");\n}' },
  { id: 'ikOpMns3CnnT', text: '৩. জাভাস্ক্রিপ্টে লুপ', type: 'heading', level: 2, anchor: '3-loops-in-javascript' },
  { id: 'KpB9Zt9Ih-xa', type: 'richtext', html: '<p>লুপ আপনাকে একটি নির্দিষ্ট সংখ্যকবার, বা একটি শর্ত মিথ্যা না হওয়া পর্যন্ত, <strong>একটি কোড ব্লক বারবার চালাতে</strong> দেয়।</p>' },
  { id: 'DAdH_NBISmYy', text: 'for লুপ', type: 'heading', level: 3, anchor: 'for-loop' },
  { id: 'tQ801TS0WxFt', type: 'richtext', html: '<p>যখন আপনি জানেন <strong>কতবার</strong> লুপ চালাতে হবে, তখন এটি ব্যবহার করুন।</p>' },
  { id: 'tpAgHkNXqNKC', type: 'code', language: 'javascript', code: 'for (let i = 1; i <= 5; i++) {\n  console.log("Count:", i);\n}' },
  { id: '6PBa_Q-V6YZj', text: 'while লুপ', type: 'heading', level: 3, anchor: 'while-loop' },
  { id: 'Wre13bA_dFm-', type: 'richtext', html: '<p>একটি <strong>শর্ত সত্য</strong> থাকা পর্যন্ত চলে।</p>' },
  { id: 'eceP6tDxpJZL', type: 'code', language: 'javascript', code: 'let i = 1;\nwhile (i <= 3) {\n  console.log("While loop:", i);\n  i++;\n}' },
  { id: '7EBuMz1U46ZH', text: 'do...while লুপ', type: 'heading', level: 3, anchor: 'dowhile-loop' },
  { id: 'q5awWu1DgGa0', type: 'richtext', html: '<p>শর্ত মিথ্যা হলেও, এটি <strong>অন্তত একবার</strong> চলে।</p>' },
  { id: 'OnxFSgxeWtKn', type: 'code', language: 'javascript', code: 'let i = 1;\ndo {\n  console.log("Do-While:", i);\n  i++;\n} while (i <= 3);' },
  { id: 'eEPIkLI5LWfX', text: 'for...of লুপ', type: 'heading', level: 3, anchor: 'forof-loop' },
  { id: 'yWwpBVWH5Co-', type: 'richtext', html: '<p><strong>অ্যারে বা ইটারেবল অবজেক্টের উপর</strong> ইটারেট করতে ব্যবহৃত হয়।</p>' },
  { id: 'adh0gLXxk1Hj', type: 'code', language: 'javascript', code: 'let fruits = ["apple", "banana", "mango"];\n\nfor (let fruit of fruits) {\n  console.log(fruit);\n}' },
  { id: 'MPNISWLgpjbZ', text: 'for...in লুপ', type: 'heading', level: 3, anchor: 'forin-loop' },
  { id: 'quMwoMX_E6rG', type: 'richtext', html: '<p><strong>অবজেক্টের প্রপার্টির</strong> উপর ইটারেট করতে ব্যবহৃত হয়।</p>' },
  { id: 'ExgE8bwuuHPv', type: 'code', language: 'javascript', code: 'let person = { name: "Sam", age: 25 };\n\nfor (let key in person) {\n    console.log(key, "=", person[key]);\n}' },
  { id: 'WZlqcn3q3OpG', text: '৪. break, continue, return', type: 'heading', level: 2, anchor: '4-breakcontinuereturn' },
  { id: 'UHHunSVOcOS7', text: 'break:', type: 'heading', level: 3, anchor: 'break' },
  { id: 'Jl-SUIeXS5tM', type: 'richtext', html: '<p>বর্তমান লুপ বা <code>switch</code> থেকে আগেই বেরিয়ে যায়।</p>' },
  { id: 'OaiyjbmznwwM', type: 'code', language: 'javascript', code: 'for (let i = 1; i <= 5; i++) {\nif (i === 3) break;\n    console.log(i);  // আউটপুট: 1, 2\n}' },
  { id: 'neupLpHDM-Z3', text: 'continue:', type: 'heading', level: 3, anchor: 'continue' },
  { id: 'gfL0F2403vUF', type: 'richtext', html: '<p>বর্তমান ইটারেশন স্কিপ করে পরেরটিতে চলে যায়।</p>' },
  { id: 'EjXRjs6J5OnR', type: 'code', language: 'javascript', code: 'for (let i = 1; i <= 5; i++) {\nif (i === 3) continue;\n    console.log(i);  // আউটপুট: 1, 2, 4, 5\n}' },
  { id: 'tu3Yfy2FUo__', text: 'return:', type: 'heading', level: 3, anchor: 'return' },
  { id: 'q9IhovFFVNU7', type: 'richtext', html: '<p>ফাংশনের এক্সিকিউশন শেষ করে একটি মান রিটার্ন করে (ফাংশন অধ্যায়ে আরও বিস্তারিত আলোচনা করা হয়েছে)।</p>' },
  { id: 'teAjjjr7wEY8', type: 'code', language: 'javascript', code: 'function multiply(a, b) {\n    return a * b;\n}' },
  { id: 'IXZvGnPokMae', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: '-da2jDGMEVQz', type: 'table', header: ['কন্ট্রোল টাইপ', 'স্টেটমেন্ট', 'উদ্দেশ্য'], rows: [
    ['সিদ্ধান্ত', '<code>if</code>, <code>else</code>', 'শর্তসাপেক্ষে কোড চালায়'],
    ['একাধিক শর্ত', '<code>switch</code>', 'অনেক <code>if</code>-এর তুলনায় পরিষ্কার বিকল্প'],
    ['পুনরাবৃত্তি', '<code>for</code>, <code>while</code>', 'শর্ত সত্য থাকা পর্যন্ত কোড পুনরাবৃত্তি করে'],
    ['ফ্লো ভাঙা', '<code>break</code>', 'লুপ/switch থেকে আগেই বেরিয়ে যায়'],
    ['ইটারেশন স্কিপ', '<code>continue</code>', 'বর্তমান লুপ ইটারেশন স্কিপ করে'],
    ['ফাংশন থেকে বেরোনো', '<code>return</code>', 'ফাংশন থেকে মান রিটার্ন করে'],
  ] },
  { id: 'VV516zCRFZqp', text: '🧪 অনুশীলন চ্যালেঞ্জ:', type: 'heading', level: 2, anchor: 'practice-challenge' },
  { id: 'IBHIVQathK5_', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'Uh8ea6ow1gbA', type: 'richtext', html: `<p>একটি স্ক্রিপ্ট লিখুন যা একটি সংখ্যা যাচাই করে এবং প্রিন্ট করে:</p>
<ul>
                                    <li>৩ দিয়ে বিভাজ্য হলে "Fizz"</li>
                                    <li>৫ দিয়ে বিভাজ্য হলে "Buzz"</li>
                                    <li>দুটো দিয়েই বিভাজ্য হলে "FizzBuzz"</li>
                                    <li>অন্যথায় সংখ্যাটি নিজেই</li>
                                </ul>` },
  { id: '9ugcpTvfE2zP', type: 'code', language: 'javascript', code: 'let num = 15;\n\nif (num % 3 === 0 && num % 5 === 0) {\n  console.log("FizzBuzz");\n} else if (num % 3 === 0) {\n  console.log("Fizz");\n} else if (num % 5 === 0) {\n  console.log("Buzz");\n} else {\n  console.log(num);\n}' },
]

const toc = [
  { id: 'what-is-control-flow', text: 'কন্ট্রোল ফ্লো কী?', level: 2 },
  { id: '1-if-else-if-else-statements', text: '১. if, else if, else স্টেটমেন্ট', level: 2 },
  { id: 'syntax', text: 'সিনট্যাক্স:', level: 3 },
  { id: 'example', text: 'উদাহরণ:', level: 3 },
  { id: '2-switch-statement', text: '২. switch স্টেটমেন্ট', level: 2 },
  { id: 'syntax-2', text: 'সিনট্যাক্স:', level: 3 },
  { id: 'example-2', text: 'উদাহরণ:', level: 3 },
  { id: '3-loops-in-javascript', text: '৩. জাভাস্ক্রিপ্টে লুপ', level: 2 },
  { id: 'for-loop', text: 'for লুপ', level: 3 },
  { id: 'while-loop', text: 'while লুপ', level: 3 },
  { id: 'dowhile-loop', text: 'do...while লুপ', level: 3 },
  { id: 'forof-loop', text: 'for...of লুপ', level: 3 },
  { id: 'forin-loop', text: 'for...in লুপ', level: 3 },
  { id: '4-breakcontinuereturn', text: '৪. break, continue, return', level: 2 },
  { id: 'break', text: 'break:', level: 3 },
  { id: 'continue', text: 'continue:', level: 3 },
  { id: 'return', text: 'return:', level: 3 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-challenge', text: '🧪 অনুশীলন চ্যালেঞ্জ:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/control-flow: 1/1 written')
