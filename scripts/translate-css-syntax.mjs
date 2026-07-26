import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '45ce6981-e889-41af-8f6a-18f0ec0d2596' // css/syntax
const title = 'CSS সিনট্যাক্স'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'CSS রুল-সেট, সিলেক্টর (element, id, class), সিলেক্টর গ্রুপিং এবং কমেন্ট কীভাবে লিখবেন তা জানুন।'

const blocks = [
  { id: 'PvkMsCPvGY13', type: 'richtext', html: '<hr>' },
  { id: 'q8xiEScVOhYD', text: 'CSS সিনট্যাক্স', type: 'heading', level: 2, anchor: 'css-syntax' },
  { id: 'qJ5bo614AvJN', type: 'richtext', html: '<p>একটি CSS রুল-সেটে একটি সিলেক্টর এবং একটি ডিক্লারেশন ব্লক থাকে:</p>' },
  { id: 'HjWsOf1-N8Q3', type: 'image', alt: '', width: 501, height: 126, publicId: 'img/selector2' },
  { id: 'aUwo-I454MNa', type: 'richtext', html: '<p>সিলেক্টর সেই HTML এলিমেন্টের দিকে নির্দেশ করে যেটি আপনি স্টাইল করতে চান।</p>\n<p>ডিক্লারেশন ব্লকে একটি বা একাধিক ডিক্লারেশন থাকে, যা সেমিকোলন দিয়ে আলাদা করা থাকে।</p>\n<p>প্রতিটি ডিক্লারেশনে একটি CSS প্রপার্টির নাম এবং একটি মান থাকে, যা একটি কোলন দিয়ে আলাদা করা থাকে।</p>\n<p>একটি CSS ডিক্লারেশন সবসময় একটি সেমিকোলন দিয়ে শেষ হয়, এবং ডিক্লারেশন ব্লক কার্লি ব্রেস দিয়ে ঘেরা থাকে।</p>\n<p><b>এই উদাহরণে সব &lt;p&gt; এলিমেন্ট কেন্দ্রীভূত এবং লাল টেক্সট রঙের হবে:</b></p>' },
  { id: 'DuJqYQAGYzpC', type: 'code', language: 'css', code: 'p {\n  color: red;\n  text-align: center;\n}' },
  { id: 'c15us78TioQF', type: 'richtext', html: '<hr>' },
  { id: 'LB7ZAwBab4dF', text: 'CSS সিলেক্টর', type: 'heading', level: 2, anchor: 'css-selectors' },
  { id: 'KU9jA22wy27v', type: 'richtext', html: '<p>CSS সিলেক্টর HTML এলিমেন্টকে তাদের এলিমেন্টের নাম, id, class, অ্যাট্রিবিউট এবং আরও অনেক কিছুর ভিত্তিতে "খুঁজে বের করতে" (বা সিলেক্ট করতে) ব্যবহার করা হয়।</p>\n<hr>' },
  { id: 'U7TJwinEdmRZ', text: 'element সিলেক্টর', type: 'heading', level: 2, anchor: 'the-element-selector' },
  { id: 'g9qqG2DxppIz', type: 'richtext', html: '<p>element সিলেক্টর এলিমেন্টের নামের ভিত্তিতে এলিমেন্ট সিলেক্ট করে।</p>\n<p><b>আপনি এভাবে একটি পেজের সব &lt;p&gt; এলিমেন্ট সিলেক্ট করতে পারেন (এখানে, সব &lt;p&gt; এলিমেন্ট কেন্দ্রীভূত এবং লাল টেক্সট রঙের হবে):</b></p>' },
  { id: 'sxMKQEWf7bLu', type: 'code', language: 'css', code: 'p {\n  text-align: center;\n  color: red;\n}' },
  { id: 'b02PkmELdLRB', type: 'richtext', html: '<hr>' },
  { id: 'JVclN7Y_MXBD', text: 'id সিলেক্টর', type: 'heading', level: 2, anchor: 'the-id-selector' },
  { id: 'RO876gjFETh-', type: 'richtext', html: '<p>id সিলেক্টর একটি নির্দিষ্ট এলিমেন্ট সিলেক্ট করতে HTML এলিমেন্টের id অ্যাট্রিবিউট ব্যবহার করে।</p>\n<p>একটি এলিমেন্টের id একটি পেজের মধ্যে ইউনিক হওয়া উচিত, তাই id সিলেক্টর একটি ইউনিক এলিমেন্ট সিলেক্ট করতে ব্যবহৃত হয়!</p>\n<p>নির্দিষ্ট id-যুক্ত একটি এলিমেন্ট সিলেক্ট করতে, একটি হ্যাশ (#) চিহ্ন লিখে তারপর এলিমেন্টের id লিখতে হয়।</p>\n<p><b>নিচের স্টাইল নিয়মটি id="para1" থাকা HTML এলিমেন্টে প্রয়োগ হবে:</b></p>' },
  { id: 'mgff9nKvV8Da', type: 'code', language: 'css', code: '#para1 {\n  text-align: center;\n  color: red;\n}' },
  { id: 'OkKhL2Toifoz', type: 'richtext', html: '<p><b>মনে রাখবেন:</b> id-এর নাম সংখ্যা দিয়ে শুরু হতে পারবে না!</p>\n<hr>' },
  { id: 'YKtJ95AnGz0H', text: 'class সিলেক্টর', type: 'heading', level: 2, anchor: 'the-class-selector' },
  { id: 'k3Cl8AnApz3R', type: 'richtext', html: '<p>class সিলেক্টর নির্দিষ্ট class অ্যাট্রিবিউটযুক্ত এলিমেন্ট সিলেক্ট করে।</p>\n<p>নির্দিষ্ট class-যুক্ত এলিমেন্ট সিলেক্ট করতে, একটি ডট (.) চিহ্ন লিখে তারপর class-এর নাম লিখতে হয়।</p>\n<p><b>এই উদাহরণে class="center" থাকা সব HTML এলিমেন্ট লাল এবং কেন্দ্রীভূত হবে: </b></p>' },
  { id: 'hyjmPzs4cEa8', type: 'code', language: 'css', code: '.center {\n  text-align: center;\n  color: red;\n}' },
  { id: 'BAKWlcCsWgMJ', type: 'richtext', html: '<p>আপনি এটাও নির্ধারণ করতে পারেন যে শুধু নির্দিষ্ট HTML এলিমেন্টের উপর একটি class প্রভাব ফেলবে।</p>\n<p><b>এই উদাহরণে শুধু class="center" থাকা &lt;p&gt; এলিমেন্ট কেন্দ্রীভূত হবে: </b></p>' },
  { id: 'jK2cQUeI30fs', type: 'code', language: 'css', code: 'p.center {\n  text-align: center;\n  color: red;\n}' },
  { id: 'NV7Y8qSm7pa0', type: 'richtext', html: '<p>HTML এলিমেন্ট একাধিক class-ও নির্দেশ করতে পারে।</p>\n<p><b>এই উদাহরণে &lt;p&gt; এলিমেন্ট class="center" এবং class="large" অনুযায়ী স্টাইল হবে:</b></p>' },
  { id: 'dCLCqzJQikF4', type: 'code', language: 'html', code: '<p class="center large">This paragraph refers to two classes.</p>' },
  { id: 'V4r4IIgL3JBE', type: 'richtext', html: '<p><b>মনে রাখবেন:</b> class-এর নাম সংখ্যা দিয়ে শুরু হতে পারবে না!</p>\n<hr>' },
  { id: 'UVFbCRyzl5Fn', text: 'সিলেক্টর গ্রুপ করা', type: 'heading', level: 2, anchor: 'grouping-selectors' },
  { id: 'zev9TL3a_bOL', type: 'richtext', html: '<p>একই স্টাইল ডেফিনিশনসহ যদি আপনার এলিমেন্ট থাকে, এভাবে:</p>' },
  { id: 'Pkao9qroE_Mv', type: 'code', language: 'css', code: 'h1 {\n  text-align: center;\n  color: red;\n}\nh2 {\n  text-align: center;\n  color: red;\n}\np {\n  text-align: center;\n  color: red;\n}' },
  { id: '-m6mBI5MjACt', type: 'richtext', html: '<p>কোড কমাতে সিলেক্টরগুলো গ্রুপ করা ভালো।</p>\n<p>সিলেক্টর গ্রুপ করতে, প্রতিটি সিলেক্টরকে একটি কমা দিয়ে আলাদা করুন।</p>\n<p><b>এই উদাহরণে আমরা উপরের কোডের সিলেক্টরগুলো গ্রুপ করেছি:</b></p>' },
  { id: 'ptUPfX2hOC2K', type: 'code', language: 'css', code: 'h1, h2, p {\n  text-align: center;\n  color: red;\n}' },
  { id: 'BRvlERT-whdD', type: 'richtext', html: '<hr>' },
  { id: 'JTsSubNzM0g2', text: 'CSS কমেন্ট', type: 'heading', level: 2, anchor: 'css-comments' },
  { id: 'JsvqlsJwm1p_', type: 'richtext', html: '<p>কোড ব্যাখ্যা করতে কমেন্ট ব্যবহার করা হয়, এবং পরবর্তীতে সোর্স কোড এডিট করার সময় এটি সাহায্য করতে পারে।</p>\n<p>ব্রাউজার কমেন্ট উপেক্ষা করে।</p>\n<p><b>একটি CSS কমেন্ট /* দিয়ে শুরু হয় এবং */ দিয়ে শেষ হয়। কমেন্ট একাধিক লাইনজুড়েও হতে পারে: </b></p>' },
  { id: 'srVVk2spCF7y', type: 'code', language: 'css', code: 'p {\n  color: red;\n  /* এটি একটি সিঙ্গেল-লাইন কমেন্ট */\n  text-align: center;\n}\n/* এটি একটি\nমাল্টি-লাইন\nকমেন্ট */' },
]

const toc = [
  { id: 'css-syntax', text: 'CSS সিনট্যাক্স', level: 2 },
  { id: 'css-selectors', text: 'CSS সিলেক্টর', level: 2 },
  { id: 'the-element-selector', text: 'element সিলেক্টর', level: 2 },
  { id: 'the-id-selector', text: 'id সিলেক্টর', level: 2 },
  { id: 'the-class-selector', text: 'class সিলেক্টর', level: 2 },
  { id: 'grouping-selectors', text: 'সিলেক্টর গ্রুপ করা', level: 2 },
  { id: 'css-comments', text: 'CSS কমেন্ট', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/syntax: 1/1 written')
