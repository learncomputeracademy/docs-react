import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '146892ae-4d2c-489b-a7ec-53ee460aea7d' // javascript/scope-hoisting
const title = 'জাভাস্ক্রিপ্ট স্কোপ ও হয়েস্টিং'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'গ্লোবাল, ফাংশন ও ব্লক স্কোপ, এবং var, let, const-এর হয়েস্টিং আচরণ শিখুন।'

const blocks = [
  { id: 'wvCYC7dXBhb2', type: 'richtext', html: '<hr>' },
  { id: 'mLTte8vMJiA9', text: 'স্কোপ কী?', type: 'heading', level: 2, anchor: 'what-is-scope' },
  { id: 'VUyVRtEa7ND0', type: 'richtext', html: `<p><strong>স্কোপ</strong> ঠিক করে আপনার কোডে ভেরিয়েবল কোথায় অ্যাক্সেসযোগ্য। জাভাস্ক্রিপ্টে, আপনি মূলত এগুলো নিয়ে কাজ করবেন:</p>
<ul>
                                  <li><strong>গ্লোবাল স্কোপ</strong></li>
                                  <li><strong>ফাংশন (লোকাল) স্কোপ</strong></li>
                                  <li><strong>ব্লক স্কোপ</strong> (ES6-এ যোগ হয়েছে)</li>
                                </ul>` },
  { id: 'Bz4Xuf9hRHal', text: 'গ্লোবাল স্কোপ', type: 'heading', level: 2, anchor: 'global-scope' },
  { id: 'KgUogsNa5aXE', type: 'richtext', html: '<p>কোনো ফাংশন বা ব্লকের <strong>বাইরে</strong> ঘোষিত ভেরিয়েবল গ্লোবাল।</p>' },
  { id: 'g2qm8Q-jFK3e', type: 'code', language: 'javascript', code: 'let name = "Alice";\n\nfunction greet() {\n  console.log("Hello, " + name); // গ্লোবাল ভেরিয়েবল অ্যাক্সেস করতে পারে\n}' },
  { id: 'Z4j-1pgw4F5H', type: 'richtext', html: '<p>গ্লোবাল ভেরিয়েবল কোডের <strong>যেকোনো জায়গা থেকে</strong> অ্যাক্সেস করা যায়।</p>' },
  { id: 'qkbnW7BuMMf-', text: 'ফাংশন স্কোপ', type: 'heading', level: 2, anchor: 'function-scope' },
  { id: 'OPMwGASpN_X8', type: 'richtext', html: '<p>একটি <strong>ফাংশনের ভেতরে</strong> ঘোষিত ভেরিয়েবল শুধু সেই ফাংশনের ভেতরেই উপলব্ধ।</p>' },
  { id: 'neDxKCMMkLU1', type: 'code', language: 'javascript', code: 'function sayHello() {\n  let message = "Hi!";\n  console.log(message);\n}\n                                \nsayHello();\n// console.log(message); ❌ এরর: message is not defined' },
  { id: 'rQwIrcAtICS7', text: 'ব্লক স্কোপ (let এবং const)', type: 'heading', level: 2, anchor: 'block-scope-let-and-const' },
  { id: 'VvMaVhVOQ3d-', type: 'richtext', html: '<p><code>{}</code>-এর ভেতরে <code>let</code> বা <code>const</code> দিয়ে ঘোষিত ভেরিয়েবল শুধু সেই ব্লকের মধ্যেই উপলব্ধ।</p>' },
  { id: '2bLm91jyhHBS', type: 'code', language: 'javascript', code: 'if (true) {\n  let age = 25;\n  const city = "Delhi";\n  console.log(age, city); // ✅ এখানে কাজ করে\n}\n                                \nconsole.log(age); // ❌ এরর\nconsole.log(city); // ❌ এরর' },
  { id: 'LVdWB8jaqHt5', type: 'richtext', html: '<p>কিন্তু <code>var</code> <code>ব্লক-স্কোপড নয়</code>:</p>' },
  { id: 'xUsGB-9Xcn4W', type: 'code', language: 'javascript', code: 'if (true) {\n  var test = "Visible outside block";\n}\nconsole.log(test); // ✅ কাজ করে, কিন্তু সুপারিশ করা হয় না' },
  { id: 'VDWqR_jG84k6', text: 'জাভাস্ক্রিপ্টে হয়েস্টিং', type: 'heading', level: 2, anchor: 'hoisting-in-javascript' },
  { id: 'K2czM9UtVabi', type: 'richtext', html: '<p><strong>Hoisting</strong> হলো জাভাস্ক্রিপ্টের ডিফল্ট আচরণ, যেখানে <strong>কোড এক্সিকিউট হওয়ার আগে</strong> ঘোষণাগুলো তাদের স্কোপের শীর্ষে সরিয়ে নেওয়া হয়।</p>' },
  { id: 'OVr4MQJ236NR', text: 'ভেরিয়েবল হয়েস্টিং', type: 'heading', level: 2, anchor: 'variable-hoisting' },
  { id: 'hS3zUM8kDnKv', type: 'richtext', html: '<p><code>var</code> দিয়ে ঘোষিত ভেরিয়েবল <strong>হয়েস্টেড</strong> হয়, কিন্তু এর মান নয়।</p>' },
  { id: 'uOm3gt0ByN9j', type: 'code', language: 'javascript', code: 'console.log(a); // undefined\nvar a = 10;' },
  { id: 'bJ1lus7zpqQ9', type: 'richtext', html: '<p>পর্দার আড়ালে যা ঘটে:</p>' },
  { id: 'T9W2M_dt_V1b', type: 'code', language: 'javascript', code: 'var a;\nconsole.log(a); // undefined\na = 10;' },
  { id: 'MzX0S1E3A48-', type: 'richtext', html: '<p>⚠️ <code>let</code> এবং <code>const</code> হয়েস্টেড হয় <strong>কিন্তু ইনিশিয়ালাইজড নয়</strong>, তাই ঘোষণার আগে এগুলো অ্যাক্সেস করলে এরর হয়।</p>' },
  { id: 'PhSbaCeFDV_T', type: 'code', language: 'javascript', code: 'console.log(b); // ❌ ReferenceError\nlet b = 20;' },
  { id: '2iGHEI_m4M3A', text: 'ফাংশন হয়েস্টিং', type: 'heading', level: 2, anchor: 'function-hoisting' },
  { id: 'm9We6FcX6LW_', type: 'richtext', html: '<p><strong>ফাংশন ডিক্লারেশন</strong> হয়েস্টেড হয় — আপনি সংজ্ঞায়িত করার আগেই এগুলো ব্যবহার করতে পারেন:</p>' },
  { id: 'xmQQB8MRGGDJ', type: 'code', language: 'javascript', code: 'greet(); // ✅ কাজ করে\n\nfunction greet() {\n  console.log("Hello!");\n}' },
  { id: 'eJLoyf8AljjV', type: 'richtext', html: '<p>কিন্তু <strong>ফাংশন এক্সপ্রেশন</strong> (ভেরিয়েবলে অ্যাসাইন করা) সম্পূর্ণভাবে হয়েস্টেড হয় না:</p>' },
  { id: '20HVxTvpXdx7', type: 'code', language: 'javascript', code: 'sayHi(); // ❌ TypeError: sayHi is not a function\n\nvar sayHi = function () {\n  console.log("Hi!");\n};' },
  { id: 'YEhuG3g8CObT', type: 'table', header: ['কীওয়ার্ড', 'স্কোপ টাইপ', 'হয়েস্টেড', 'পুনঃবরাদ্দযোগ্য', 'ব্লক স্কোপড'], rows: [
    ['<code>var</code>', 'ফাংশন/গ্লোবাল', 'হ্যাঁ', 'হ্যাঁ', '❌ না'],
    ['<code>let</code>', 'ব্লক', 'হ্যাঁ ❗(TDZ)', 'হ্যাঁ', '✅ হ্যাঁ'],
    ['<code>const</code>', 'ব্লক', 'হ্যাঁ ❗(TDZ)', '❌ না', '✅ হ্যাঁ'],
  ] },
  { id: 'kEaWX9tjrOV2', type: 'richtext', html: '<p><strong>TDZ (Temporal Dead Zone)</strong>: স্কোপে প্রবেশ ও ভেরিয়েবল ঘোষণার মধ্যবর্তী সেই পর্যায়, যেখানে সেটি ব্যবহার করা যায় না।</p>' },
  { id: '6R4D3VVNviQd', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: '2U1_kh1f62dw', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'SojDslsnAcLT', type: 'richtext', html: `<ol>
                                    <li>একটি ফাংশনের ভেতরে একটি ভেরিয়েবল ঘোষণা করুন এবং বাইরে থেকে সেটি অ্যাক্সেস করার চেষ্টা করুন।</li>
                                    <li>একটি <code>let</code> ভেরিয়েবল ঘোষণার আগে অ্যাক্সেস করার চেষ্টা করুন — এররটি লক্ষ্য করুন।</li>
                                    <li>একটি <code>if</code> ব্লকে <code>var</code> ব্যবহার করুন এবং দেখুন এটি বাইরে লিক করে কিনা।</li>
                                    <li>এমন একটি ফাংশন লিখুন যা ফাংশন ডিক্লারেশন ব্যবহার করে ঘোষণার আগেই কল করা হয়।</li>
                                    <li>হয়েস্টিং-এর সাথে ফাংশন ডিক্লারেশন এবং ফাংশন এক্সপ্রেশনের আচরণ তুলনা করুন।</li>
                                </ol>` },
]

const toc = [
  { id: 'what-is-scope', text: 'স্কোপ কী?', level: 2 },
  { id: 'global-scope', text: 'গ্লোবাল স্কোপ', level: 2 },
  { id: 'function-scope', text: 'ফাংশন স্কোপ', level: 2 },
  { id: 'block-scope-let-and-const', text: 'ব্লক স্কোপ (let এবং const)', level: 2 },
  { id: 'hoisting-in-javascript', text: 'জাভাস্ক্রিপ্টে হয়েস্টিং', level: 2 },
  { id: 'variable-hoisting', text: 'ভেরিয়েবল হয়েস্টিং', level: 2 },
  { id: 'function-hoisting', text: 'ফাংশন হয়েস্টিং', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/scope-hoisting: 1/1 written')
