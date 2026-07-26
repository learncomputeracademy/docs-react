import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'fc81353a-5c69-4484-a122-f817fbc1b844' // javascript/localstorage-and-sessionstorage
const title = 'জাভাস্ক্রিপ্ট LocalStorage ও SessionStorage'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'ব্রাউজারে ডেটা সংরক্ষণ করতে localStorage এবং sessionStorage কীভাবে ব্যবহার করবেন তা শিখুন।'

const blocks = [
  { id: 'Kaa5JCrwMVhy', type: 'richtext', html: '<p><em>(পেজ রিলোড বা সেশনের মধ্যেও টিকে থাকে এমনভাবে ব্রাউজারে ডেটা সংরক্ষণ করা)</em></p>\n<hr>' },
  { id: 'EOzhP1qkU52k', text: 'Web Storage কী?', type: 'heading', level: 2, anchor: 'what-is-web-storage' },
  { id: '3RFhttogiGyS', type: 'richtext', html: '<p>Web Storage হলো একটি ব্রাউজার ফিচার যা আপনাকে একটি ওয়েব ব্রাউজারে key/value pair সংরক্ষণ করতে দেয়।</p>\n<p>এটি দুই ধরনের হয়:</p>' },
  { id: 'CZ6Zzg7O9TQh', type: 'table', header: ['টাইপ', 'স্থায়িত্ব', 'স্কোপ'], rows: [
    ['<code>localStorage</code>', '<strong>স্থায়ী</strong> (যতক্ষণ না ম্যানুয়ালি মোছা হয়)', 'একই-অরিজিন'],
    ['<code>sessionStorage</code>', '<strong>সাময়িক</strong> (ট্যাব বন্ধ করলে মুছে যায়)', 'শুধু একই-ট্যাব'],
  ] },
  { id: '_85yPNK7XDH3', text: 'কেন Web Storage ব্যবহার করবেন?', type: 'heading', level: 2, anchor: 'why-use-web-storage' },
  { id: '0sm1MPTVPW9j', type: 'richtext', html: `<ul>
                                <li>ব্যবহারকারীর পছন্দ সংরক্ষণ করা (যেমন, থিম)</li>
                                <li>ফর্মের ইনপুট ডেটা মনে রাখা</li>
                                <li>ই-কমার্সে কার্টের আইটেম সংরক্ষণ করা</li>
                                <li>ছোট ডেটার জন্য সার্ভার কল এড়ানো</li>
                              </ul>` },
  { id: '4ZbpZPvFs1_z', text: 'localStorage: স্থায়ী স্টোরেজ', type: 'heading', level: 2, anchor: 'localstorage-persistent-storage' },
  { id: 'QS-TEWSOXC8h', text: 'আইটেম সেট করা', type: 'heading', level: 3, anchor: 'set-item' },
  { id: '7U3P12o_jgKV', type: 'code', language: 'javascript', code: 'localStorage.setItem("username", "John");' },
  { id: 'UVCxun06Ji4L', text: 'আইটেম পাওয়া', type: 'heading', level: 3, anchor: 'get-item' },
  { id: 'V0OE11O9RZfA', type: 'code', language: 'javascript', code: 'const name = localStorage.getItem("username");\nconsole.log(name); // John' },
  { id: 'U8V3FsOiupZJ', text: 'আইটেম সরানো', type: 'heading', level: 3, anchor: 'remove-item' },
  { id: 'lIeMYtJbXjLz', type: 'code', language: 'javascript', code: 'localStorage.removeItem("username");' },
  { id: '9CQPfeLvG9o5', text: 'সব স্টোরেজ পরিষ্কার করা', type: 'heading', level: 3, anchor: 'clear-all-storage' },
  { id: 'dLIeL00KSmEc', type: 'code', language: 'javascript', code: 'localStorage.clear();' },
  { id: 'oRi12908yGrH', text: 'sessionStorage: সাময়িক স্টোরেজ', type: 'heading', level: 2, anchor: 'sessionstorage-temporary-storage' },
  { id: '8J9VcCwIjfvb', type: 'richtext', html: '<p><code>localStorage</code>-এর মতোই কাজ করে, কিন্তু <strong>ব্রাউজার ট্যাব বন্ধ হলে</strong> ডেটা হারিয়ে যায়।</p>' },
  { id: 'NRWMl7xryahR', type: 'code', language: 'javascript', code: 'sessionStorage.setItem("sessionUser", "Alice");\nconst sessionUser = sessionStorage.getItem("sessionUser");\nconsole.log(sessionUser); // Alice' },
  { id: '_Lu8FhrL-U1R', text: 'ডেটা টাইপ সম্পর্কে মন্তব্য', type: 'heading', level: 2, anchor: 'note-on-data-types' },
  { id: 'sPLTr305JM51', type: 'richtext', html: '<p>Web Storage শুধু <strong>স্ট্রিং</strong> সংরক্ষণ করে।</p>\n<p>অবজেক্ট/অ্যারে সংরক্ষণ করতে, <code>JSON.stringify()</code> এবং <code>JSON.parse()</code> ব্যবহার করুন:</p>' },
  { id: 'FCTTOKzA2LUr', type: 'code', language: 'javascript', code: 'const user = { name: "Alex", age: 28 };\nlocalStorage.setItem("user", JSON.stringify(user));\n                                \nconst userData = JSON.parse(localStorage.getItem("user"));\nconsole.log(userData.name); // Alex' },
  { id: '5_sQ5NOL0tBj', text: 'Web Storage-এর সীমাবদ্ধতা', type: 'heading', level: 2, anchor: 'limitations-of-web-storage' },
  { id: 'Y860ArUSk3Qb', type: 'richtext', html: `<ul>
                                <li>স্টোরেজ সীমা: প্রতি অরিজিনে <strong>~5MB</strong> (ব্রাউজারভেদে ভিন্ন হতে পারে)</li>
                                <li>শুধুমাত্র <strong>একই অরিজিনে</strong> অ্যাক্সেসযোগ্য (প্রোটোকল + ডোমেইন + পোর্ট)</li>
                                <li>স্পর্শকাতর ডেটার জন্য নিরাপদ নয় — এটি জাভাস্ক্রিপ্টের মাধ্যমে অ্যাক্সেসযোগ্য</li>
                                <li>ম্যানুয়ালি না সরানো পর্যন্ত <code>localStorage</code>-এর কোনো মেয়াদ শেষ হয় না</li>
                              </ul>` },
  { id: 'tThxNGt4g4mS', text: 'সাধারণ ব্যবহারের ক্ষেত্র', type: 'heading', level: 2, anchor: 'common-use-cases' },
  { id: 'aIJd58I71g2N', type: 'richtext', html: `<ul>
                                <li>ডার্ক/লাইট মোডের পছন্দ সংরক্ষণ করা</li>
                                <li>শপিং কার্টে আইটেম রাখা</li>
                                <li>ফর্মের ফিল্ড অটো-ফিল করা</li>
                                <li>সাময়িক ফর্ম ড্রাফট সংরক্ষণ করা</li>
                              </ul>` },
  { id: 'kNlre9JqXuoq', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: 'z68zWo5_8nMD', type: 'richtext', html: `<ul>
                                <li><code>localStorage</code> ম্যানুয়ালি না মোছা পর্যন্ত ডেটা ধরে রাখে।</li>
                                <li>ট্যাব বন্ধ হলে <code>sessionStorage</code> পরিষ্কার হয়ে যায়।</li>
                                <li><code>setItem()</code>, <code>getItem()</code>, <code>removeItem()</code>, এবং <code>clear()</code> মেথড ব্যবহার করুন।</li>
                                <li>JSON মেথড ব্যবহার করে জটিল ডেটা (অ্যারে/অবজেক্ট) সংরক্ষণ করুন।</li>
                                <li>স্পর্শকাতর বা সুরক্ষিত ডেটা সংরক্ষণ এড়িয়ে চলুন।</li>
                              </ul>` },
  { id: '1DdF5IBDofbL', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'BzMEYN3RYXtW', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: '9DGC6BDcz4TT', type: 'richtext', html: `<ol>
                                  <li>একজন ব্যবহারকারীর নাম <code>localStorage</code>-এ সংরক্ষণ করুন, এবং পরের ভিজিটে তাকে অভিবাদন জানান।</li>
                                  <li>একটি ফর্ম ড্রাফট <code>sessionStorage</code>-এ সংরক্ষণ করুন এবং ট্যাব রিফ্রেশ হলে সেটি ফিরিয়ে আনুন।</li>
                                  <li>localStorage-এ একটি অবজেক্ট সংরক্ষণ করতে <code>JSON.stringify()</code> ব্যবহার করুন।</li>
                                  <li>একটি বাটন ক্লিকে সংরক্ষিত ডেটা মুছে ফেলার জন্য একটি ফাংশন তৈরি করুন।</li>
                              </ol>` },
]

const toc = [
  { id: 'what-is-web-storage', text: 'Web Storage কী?', level: 2 },
  { id: 'why-use-web-storage', text: 'কেন Web Storage ব্যবহার করবেন?', level: 2 },
  { id: 'localstorage-persistent-storage', text: 'localStorage: স্থায়ী স্টোরেজ', level: 2 },
  { id: 'set-item', text: 'আইটেম সেট করা', level: 3 },
  { id: 'get-item', text: 'আইটেম পাওয়া', level: 3 },
  { id: 'remove-item', text: 'আইটেম সরানো', level: 3 },
  { id: 'clear-all-storage', text: 'সব স্টোরেজ পরিষ্কার করা', level: 3 },
  { id: 'sessionstorage-temporary-storage', text: 'sessionStorage: সাময়িক স্টোরেজ', level: 2 },
  { id: 'note-on-data-types', text: 'ডেটা টাইপ সম্পর্কে মন্তব্য', level: 2 },
  { id: 'limitations-of-web-storage', text: 'Web Storage-এর সীমাবদ্ধতা', level: 2 },
  { id: 'common-use-cases', text: 'সাধারণ ব্যবহারের ক্ষেত্র', level: 2 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/localstorage-and-sessionstorage: 1/1 written')
