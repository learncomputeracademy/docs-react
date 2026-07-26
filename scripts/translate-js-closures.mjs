import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '1288c751-92d6-42ed-a6ab-1dae5637d1c8' // javascript/closures
const title = 'জাভাস্ক্রিপ্ট ক্লোজার (Closures)'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'জাভাস্ক্রিপ্টে ক্লোজার কী, কীভাবে কাজ করে, এবং ডেটা প্রাইভেসি ও ফাংশন ফ্যাক্টরিতে কীভাবে ব্যবহার করবেন তা শিখুন।'

const blocks = [
  { id: 'dZZUB_ICyT7_', type: 'richtext', html: '<p><em>(ফাংশন তার বাইরের স্কোপ মনে রাখে — এমনকি বাইরের ফাংশনটি শেষ হয়ে যাওয়ার পরেও)</em></p>\n<hr>' },
  { id: 'bsHm2uRud9iI', text: 'ক্লোজার কী?', type: 'heading', level: 2, anchor: 'what-is-a-closure' },
  { id: 'jt3Ryg6Y7op7', type: 'richtext', html: '<p>একটি <strong>ক্লোজার</strong> তৈরি হয় যখন একটি <strong>ফাংশন তার বাইরের (লেক্সিক্যাল) স্কোপের ভেরিয়েবল "মনে রাখে"</strong>, এমনকি বাইরের ফাংশনটি রিটার্ন হয়ে যাওয়ার পরেও।</p>' },
  { id: 'W6sgv6-166Qa', text: 'মৌলিক ধারণা', type: 'heading', level: 2, anchor: 'basic-concept' },
  { id: 'NQ5Pwk0krFXO', type: 'code', language: 'javascript', code: 'function outer() {\n  let name = "Alice";\n                                \n  function inner() {\n    console.log("Hello, " + name); // name আসে outer() থেকে\n  }\n                                \n  return inner;\n}\n                                \nconst greet = outer(); // outer() রিটার্ন করে inner\ngreet(); // "Hello, Alice"' },
  { id: 'rKPOacwtaM_E', type: 'richtext', html: '<p>যদিও <code>outer()</code> এক্সিকিউশন শেষ হয়ে গেছে, তবুও ক্লোজারের কারণে <code>inner()</code> এখনও <code>name</code> মনে রাখে।</p>' },
  { id: 'nAymdeYNlggy', text: 'ক্লোজার কেন উপযোগী', type: 'heading', level: 2, anchor: 'why-closures-are-useful' },
  { id: 'QucDcsRmtoCO', type: 'richtext', html: `<p>ক্লোজার ব্যবহার করা হয়:</p>
<ul>
                                  <li>ডেটা প্রাইভেসিতে (এনক্যাপসুলেশন)</li>
                                  <li>ফাংশন ফ্যাক্টরিতে (কাস্টমাইজড ফাংশন)</li>
                                  <li>অ্যাসিঙ্ক অপারেশনে স্টেট বজায় রাখতে</li>
                                  <li><code>useState</code>, <code>useEffect</code>-এর মতো React hook-এ</li>
                                </ul>` },
  { id: 'w60Hwu41QhMu', text: 'ডেটা প্রাইভেসির জন্য ক্লোজার', type: 'heading', level: 2, anchor: 'closure-for-data-privacy' },
  { id: 'I7S1VNFJiKBd', type: 'code', language: 'javascript', code: 'function secretHolder() {\n  let secret = "1234";\n                                \n  return {\n    getSecret: function () {\n      return secret;\n    },\n    setSecret: function (newSecret) {\n      secret = newSecret;\n    },\n  };\n}\n                                \nconst vault = secretHolder();\nconsole.log(vault.getSecret()); // "1234"\nvault.setSecret("5678");\nconsole.log(vault.getSecret()); // "5678"' },
  { id: 'GNBhb1s3h_m9', type: 'richtext', html: '<p><code>secret</code> সরাসরি অ্যাক্সেস করা যায় না — শুধুমাত্র রিটার্ন করা মেথডগুলোর মাধ্যমে।</p>' },
  { id: '8BplFVXILTr0', text: 'লুপে ক্লোজারের সমস্যা (var বনাম let)', type: 'heading', level: 2, anchor: 'closure-in-loop-problem-var-vs-let' },
  { id: '_sVmel2ZLlGa', type: 'code', language: 'javascript', code: 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 1000);\n}\n// আউটপুট: 3 3 3 (0 1 2 নয়!)' },
  { id: 'foOinJuEJFim', type: 'richtext', html: '<p><code>let</code> দিয়ে সমাধান:</p>' },
  { id: 'lnyGCf6saShj', type: 'code', language: 'javascript', code: 'for (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 1000);\n}\n// আউটপুট: 0 1 2 ✅' },
  { id: 'ETPswZeLo0LB', type: 'richtext', html: '<p>ব্যাখ্যা: <code>let</code> প্রতিটি ইটারেশনে একটি নতুন ব্লক স্কোপ তৈরি করে, তাই ক্লোজারের কারণে প্রতিটি <code>i</code> সঠিকভাবে সংরক্ষিত থাকে।</p>' },
  { id: 'b8OVTUavLNqj', text: 'ফাংশন ফ্যাক্টরি (এমন ফাংশন যা অন্য ফাংশন তৈরি করে)', type: 'heading', level: 2, anchor: 'function-factory-function-that-creates-other-functions' },
  { id: 'EmcEPAuE3McZ', type: 'code', language: 'javascript', code: 'function makeMultiplier(x) {\n  return function (y) {\n    return x * y;\n  };\n}\n                                  \nconst double = makeMultiplier(2);\nconsole.log(double(5)); // 10\n                                  \nconst triple = makeMultiplier(3);\nconsole.log(triple(5)); // 15' },
  { id: '51Y0N2oY1be6', type: 'richtext', html: '<p>প্রতিটি রিটার্ন করা ফাংশন তার নিজস্ব <code>x</code>-এর মান "মনে রাখে"।</p>' },
  { id: 'GY2oxZ0wCcs_', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: '2dFBOxgSP2jh', type: 'richtext', html: `<ul>
                                      <li>একটি <code>closure</code> আপনাকে একটি ইনার ফাংশন থেকে বাইরের ফাংশনের ভেরিয়েবলে অ্যাক্সেস দেয়।</li>
                                      <li>ক্লোজার কলের মধ্যেও <code>স্টেট সংরক্ষণ করে</code> এবং <code>প্রাইভেট</code> ভেরিয়েবল সক্ষম করে।</li>
                                      <li>ইভেন্ট হ্যান্ডলার, টাইমআউট এবং মডিউল প্যাটার্নের মতো জাভাস্ক্রিপ্ট ফিচারে এটি সাধারণ।</li>
                                    </ul>` },
  { id: 'QZlt8MbA2Hrm', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'Jb1nucorVZu6', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: '3ElHUJ610V6-', type: 'richtext', html: `<ol>
                                    <li>একটি <code>counter()</code> ফাংশন তৈরি করুন যা এমন একটি ফাংশন রিটার্ন করে, যা কাউন্ট বাড়ায় এবং লগ করে।</li>
                                    <li>একটি <code>greeting(name)</code> ফাংশন তৈরি করুন যা আরেকটি ফাংশন রিটার্ন করে, যা "Hello, name" বলে।</li>
                                    <li>একটি গোপন পাসওয়ার্ড সুরক্ষিত রাখতে ক্লোজার ব্যবহার করুন (শুধু মেথডের মাধ্যমে get/set করুন)।</li>
                                    <li>ক্লোজার ব্যবহার করে একটি মাল্টিপ্লায়ার ফাংশন রিটার্ন করে এমন একটি ফাংশন লিখুন।</li>
                                    <li>মন্তব্যে ব্যাখ্যা করুন কেন একটি ক্লোজার বাইরের ভেরিয়েবলে অ্যাক্সেস ধরে রাখে।</li>
                                </ol>` },
]

const toc = [
  { id: 'what-is-a-closure', text: 'ক্লোজার কী?', level: 2 },
  { id: 'basic-concept', text: 'মৌলিক ধারণা', level: 2 },
  { id: 'why-closures-are-useful', text: 'ক্লোজার কেন উপযোগী', level: 2 },
  { id: 'closure-for-data-privacy', text: 'ডেটা প্রাইভেসির জন্য ক্লোজার', level: 2 },
  { id: 'closure-in-loop-problem-var-vs-let', text: 'লুপে ক্লোজারের সমস্যা (var বনাম let)', level: 2 },
  { id: 'function-factory-function-that-creates-other-functions', text: 'ফাংশন ফ্যাক্টরি (এমন ফাংশন যা অন্য ফাংশন তৈরি করে)', level: 2 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/closures: 1/1 written')
