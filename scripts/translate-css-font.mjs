import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'f3e1498e-b7ff-4e0b-9650-9dc8172e7bbd' // css/font
const title = 'CSS ফন্ট'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'CSS font-family, font-size, font-style, font-weight এবং রেসপনসিভ ফন্ট সাইজ কীভাবে ব্যবহার করবেন তা জানুন।'

const blocks = [
  { id: 'AycBa7DW_Eju', type: 'richtext', html: '<hr>\n<p>CSS ফন্ট প্রপার্টি একটি টেক্সটের ফন্ট ফ্যামিলি, বোল্ডনেস, আকার এবং স্টাইল নির্ধারণ করে।</p>\n<hr>' },
  { id: 'xh7jAAMShI7P', text: 'Serif এবং Sans-serif ফন্টের মধ্যে পার্থক্য', type: 'heading', level: 2, anchor: 'difference-between-serif-and-sans-serif-fonts' },
  { id: 'TK4X5f93yRmh', type: 'richtext', html: `<div class="img-block">
                                    <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960417/img/serif.webp" alt="font" class="img-fluid">
                                </div>
<hr>` },
  { id: 'DRLLBbEuA-79', text: 'CSS ফন্ট ফ্যামিলি', type: 'heading', level: 2, anchor: 'css-font-families' },
  { id: '7aWLgmLrbgyY', type: 'richtext', html: `<p>CSS-এ, দুই ধরনের ফন্ট ফ্যামিলি নাম আছে:</p>
<ul>
                                <li><b>জেনেরিক ফ্যামিলি</b> - একই রকম দেখতে ফন্ট ফ্যামিলির একটি গ্রুপ
                                (যেমন "Serif" বা "Monospace")</li>
                                <li><b>ফন্ট ফ্যামিলি</b> - একটি নির্দিষ্ট ফন্ট ফ্যামিলি (যেমন "Times New Roman"
                                বা "Arial")</li>
                                </ul>` },
  { id: '4q4OFlnNUby9', type: 'table', header: ['জেনেরিক ফ্যামিলি', 'ফন্ট ফ্যামিলি', 'বিবরণ'], rows: [
    ['Serif', '<span style="font-size:150%;font-family:Times New Roman">Times New Roman</span><br>\n                                            <span style="font-size:150%;font-family:Georgia">Georgia</span>', 'কিছু অক্ষরের শেষে সেরিফ ফন্টে ছোট লাইন থাকে'],
    ['Sans-serif', '<span style="font-size:150%;font-family:Arial">Arial</span><br>\n                                            <span style="font-size:150%;font-family:Verdana">Verdana</span>', '"Sans" মানে ছাড়া - এই ফন্টগুলোর অক্ষরের শেষে কোনো লাইন থাকে না'],
    ['Monospace', '<span style="font-size:150%;font-family:Courier New">Courier New</span><br>\n                                            <span style="font-size:150%;font-family:Lucida Console">Lucida Console</span>', 'সব মনোস্পেস অক্ষরের প্রস্থ একই'],
  ] },
  { id: 'otWrt-zkRy_A', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b> কম্পিউটার স্ক্রিনে, সেরিফ ফন্টের চেয়ে সান্স-সেরিফ ফন্ট পড়া সহজ বলে মনে করা হয়।</p>\n<hr>' },
  { id: 'hid0wapg2dQw', text: 'ফন্ট ফ্যামিলি', type: 'heading', level: 2, anchor: 'font-family' },
  { id: 'BQR_USMuOaBK', type: 'richtext', html: `<p><code>font-family</code> প্রপার্টি দিয়ে একটি টেক্সটের ফন্ট ফ্যামিলি সেট করা হয়।</p>
<p><code>font-family</code> প্রপার্টিতে একটি "ফলব্যাক" সিস্টেম হিসেবে একাধিক ফন্টের নাম থাকা উচিত। ব্রাউজার প্রথম ফন্টটি সমর্থন না করলে, এটি পরের ফন্টটি চেষ্টা করে, এভাবে চলতে থাকে।</p>
<p>আপনি যে ফন্ট চান তা দিয়ে শুরু করুন, এবং একটি জেনেরিক ফ্যামিলি দিয়ে শেষ করুন, যাতে অন্য কোনো ফন্ট উপলব্ধ না থাকলে ব্রাউজার সেই জেনেরিক ফ্যামিলি থেকে একটি একই রকম ফন্ট বেছে নিতে পারে।</p>
<p><b>মনে রাখবেন</b>: একটি ফন্ট ফ্যামিলির নাম একের বেশি শব্দের হলে, এটি অবশ্যই উদ্ধৃতি চিহ্নে থাকতে হবে, যেমন: "Times New Roman"।</p>
<p>একের বেশি ফন্ট ফ্যামিলি একটি কমা-দিয়ে-আলাদা-করা লিস্টে উল্লেখ করা হয়:</p>` },
  { id: 'T7JjEsJsTvG_', type: 'code', language: 'css', code: 'p {\n  font-family: "Times New Roman", Times, serif;\n}' },
  { id: 'xd1uVllqZWu_', type: 'richtext', html: '<hr>' },
  { id: 'WdcbQSsevCz0', text: 'ফন্ট স্টাইল', type: 'heading', level: 2, anchor: 'font-style' },
  { id: 'ELOptLfWOJjK', type: 'richtext', html: `<p><code>font-style</code> প্রপার্টি বেশিরভাগ সময় ইটালিক টেক্সট নির্ধারণ করতে ব্যবহৃত হয়।</p>
<p>এই প্রপার্টির তিনটি মান আছে:</p>
<ul>
                                    <li>normal - টেক্সট স্বাভাবিকভাবে দেখানো হয়</li>
                                    <li>italic - টেক্সট ইটালিকে দেখানো হয়</li>
                                    <li>oblique - টেক্সট "হেলানো" থাকে
                                    (oblique অনেকটা italic-এর মতোই, তবে কম সমর্থিত)</li>
                                </ul>` },
  { id: 'ItpwKE5gqdSW', type: 'code', language: 'css', code: 'p.normal {\n  font-style: normal;\n}\np.italic {\n  font-style: italic;\n}\np.oblique {\n  font-style: oblique;\n}' },
  { id: 'Ferv6FIAKEFv', type: 'richtext', html: '<hr>' },
  { id: 'eP_H1E6pbAd7', text: 'ফন্ট সাইজ', type: 'heading', level: 2, anchor: 'font-size' },
  { id: 'MERlyx3SU1zx', type: 'richtext', html: `<p><code>font-size</code> প্রপার্টি টেক্সটের আকার সেট করে।</p>
<p>ওয়েব ডিজাইনে টেক্সটের আকার নিয়ন্ত্রণ করতে পারা গুরুত্বপূর্ণ। তবে, প্যারাগ্রাফকে হেডিংয়ের মতো বা হেডিংকে প্যারাগ্রাফের মতো দেখাতে ফন্ট সাইজ সমন্বয় ব্যবহার করা উচিত নয়।</p>
<p>সবসময় সঠিক HTML ট্যাগ ব্যবহার করুন, যেমন হেডিংয়ের জন্য &lt;h1&gt; - &lt;h6&gt; এবং প্যারাগ্রাফের জন্য &lt;p&gt;।</p>
<p>font-size-এর মান অ্যাবসোলিউট বা রিলেটিভ আকার হতে পারে।</p>
<p>অ্যাবসোলিউট আকার:</p>
<ul>
                                    <li>টেক্সটকে একটি নির্দিষ্ট আকারে সেট করে</li>
                                    <li>সব ব্রাউজারে ব্যবহারকারীকে টেক্সটের আকার পরিবর্তন করতে দেয় না (অ্যাক্সেসিবিলিটির দিক থেকে খারাপ)</li>
                                    <li>আউটপুটের প্রকৃত আকার জানা থাকলে অ্যাবসোলিউট আকার উপকারী</li>
                                </ul>
<p>রিলেটিভ আকার:</p>
<ul>
                                    <li>আশেপাশের এলিমেন্টের সাপেক্ষে আকার সেট করে</li>
                                    <li>ব্রাউজারে ব্যবহারকারীকে টেক্সটের আকার পরিবর্তন করতে দেয়</li>
                                </ul>
<p class="note"><b>মনে রাখবেন:</b> ফন্ট সাইজ উল্লেখ না করলে, প্যারাগ্রাফের মতো সাধারণ টেক্সটের ডিফল্ট আকার হলো 16px (16px=1em)।</p>
<hr>` },
  { id: 'NFlTTz_QKWJH', text: 'পিক্সেল দিয়ে ফন্ট সাইজ সেট করা', type: 'heading', level: 2, anchor: 'set-font-size-with-pixels' },
  { id: '5SGFUo3GHcrg', type: 'richtext', html: '<p>পিক্সেল দিয়ে টেক্সট সাইজ সেট করলে আপনি টেক্সটের আকারের উপর সম্পূর্ণ নিয়ন্ত্রণ পান:</p>' },
  { id: '3rFz8KA0-p-7', type: 'code', language: 'css', code: 'h1 {\n  font-size: 40px;\n}\nh2 {\n  font-size: 30px;\n}\np {\n  font-size: 14px;\n}' },
  { id: 'fihIL3QaXHEw', type: 'richtext', html: '<p><b>টিপস:</b> পিক্সেল ব্যবহার করলেও, পুরো পেজ রিসাইজ করতে আপনি জুম টুল ব্যবহার করতে পারেন।</p>\n<hr>' },
  { id: '5xuaf6KqKotC', text: 'Em দিয়ে ফন্ট সাইজ সেট করা', type: 'heading', level: 2, anchor: 'set-font-size-with-em' },
  { id: 'clxoJ-s7U_bI', type: 'richtext', html: '<p>ব্যবহারকারীদের (ব্রাউজার মেনুতে) টেক্সট রিসাইজ করার সুযোগ দিতে, অনেক ডেভেলপার পিক্সেলের বদলে em ব্যবহার করেন।</p>\n<p>W3C em সাইজ ইউনিট ব্যবহারের পরামর্শ দেয়।</p>\n<p>1em বর্তমান ফন্ট সাইজের সমান। ব্রাউজারে ডিফল্ট টেক্সট সাইজ হলো 16px। তাই, 1em-এর ডিফল্ট আকার হলো 16px।</p>\n<p>এই সূত্র ব্যবহার করে পিক্সেল থেকে em-এ আকার হিসাব করা যায়: <i>pixels</i>/16=<i>em</i></p>' },
  { id: 'sskaHfOpwA7E', type: 'code', language: 'css', code: 'h1 {\n  font-size: 2.5em; /* 40px/16=2.5em */\n}\nh2 {\n  font-size: 1.875em; /* 30px/16=1.875em */\n}\np {\n  font-size: 0.875em; /* 14px/16=0.875em */\n}' },
  { id: 'cKTN8nnmYoLq', type: 'richtext', html: '<p>উপরের উদাহরণে, em-এ টেক্সট সাইজ আগের পিক্সেল উদাহরণের মতোই। তবে, em সাইজ দিয়ে, সব ব্রাউজারে টেক্সট সাইজ সমন্বয় করা সম্ভব।</p>\n<p>দুর্ভাগ্যবশত, IE-এর পুরনো ভার্সনে এখনও একটি সমস্যা আছে। বড় করলে টেক্সট যতটা হওয়া উচিত তার চেয়ে বড় হয়ে যায়, এবং ছোট করলে যতটা হওয়া উচিত তার চেয়ে ছোট হয়ে যায়।</p>\n<hr>' },
  { id: 'BcIVa2nxMJsR', text: 'শতাংশ এবং Em-এর সংমিশ্রণ ব্যবহার করা', type: 'heading', level: 2, anchor: 'use-a-combination-of-percent-and-em' },
  { id: 'EtSD0AapShWS', type: 'richtext', html: '<p>সব ব্রাউজারে কাজ করে এমন সমাধান হলো, &lt;body&gt; এলিমেন্টের জন্য শতাংশে একটি ডিফল্ট font-size সেট করা:</p>' },
  { id: '-CGd0JRYAaPd', type: 'code', language: 'css', code: 'body {\n  font-size: 100%;\n}\nh1 {\n  font-size: 2.5em;\n}\nh2 {\n  font-size: 1.875em;\n}\np {\n  font-size: 0.875em;\n}' },
  { id: '7Sso1gZgy1kw', type: 'richtext', html: '<p>আমাদের কোড এখন দারুণভাবে কাজ করে! এটি সব ব্রাউজারে একই টেক্সট সাইজ দেখায়, এবং সব ব্রাউজারকে টেক্সট জুম বা রিসাইজ করার সুযোগ দেয়!</p>\n<hr>' },
  { id: 'yDGVWqZH7TcB', text: 'ফন্ট ওয়েট', type: 'heading', level: 2, anchor: 'font-weight' },
  { id: 'je1_94C5iOz5', type: 'richtext', html: '<p><code>font-weight</code> প্রপার্টি একটি ফন্টের ওয়েট নির্ধারণ করে:</p>' },
  { id: 'CiknV7JlMggC', type: 'code', language: 'css', code: 'p.normal {\n  font-weight: normal;\n}\np.thick {\n  font-weight: bold;\n}' },
  { id: 'palyUECBekxo', type: 'richtext', html: '<hr>' },
  { id: 'hvj1LIy1-zbw', text: 'রেসপনসিভ ফন্ট সাইজ', type: 'heading', level: 2, anchor: 'responsive-font-size' },
  { id: '9tpn0kGEjerK', type: 'richtext', html: `<p>টেক্সট সাইজ একটি <code>vw</code> ইউনিট দিয়ে সেট করা যায়, যার মানে "viewport width" (ভিউপোর্টের প্রস্থ)।</p>
<p>এভাবে টেক্সট সাইজ ব্রাউজার উইন্ডোর আকার অনুযায়ী পরিবর্তিত হবে:</p>
<div class="bg-gray p-4" style="margin-bottom: 1em;">
                                <h1 style="font-size:8vw;">Hello World</h1>
                                <p style="font-size:2vw;">ফন্ট সাইজ কীভাবে স্কেল হয় তা দেখতে ব্রাউজার উইন্ডো রিসাইজ করুন।</p>
                            </div>` },
  { id: 'Qd_GZpoa75_b', type: 'code', language: 'html', code: '<h1 style="font-size:10vw">Hello World</h1>' },
  { id: 'BWwm1a-fFc0g', type: 'richtext', html: '<p class="note">ভিউপোর্ট হলো ব্রাউজার উইন্ডোর আকার। 1vw = ভিউপোর্টের প্রস্থের 1%। ভিউপোর্ট 50cm প্রশস্ত হলে, 1vw হলো 0.5cm।</p>\n<hr>' },
  { id: 'ulv69J6PFzZ3', text: 'ফন্ট ভ্যারিয়ান্ট', type: 'heading', level: 2, anchor: 'font-variant' },
  { id: 'n7Wq0C_kN6y8', type: 'richtext', html: '<p><code>font-variant</code> প্রপার্টি নির্ধারণ করে একটি টেক্সট small-caps ফন্টে প্রদর্শিত হবে কিনা।</p>\n<p>একটি small-caps ফন্টে, সব ছোট হাতের অক্ষর বড় হাতের অক্ষরে রূপান্তরিত হয়। তবে, রূপান্তরিত বড় হাতের অক্ষরগুলো টেক্সটের আসল বড় হাতের অক্ষরের চেয়ে ছোট ফন্ট সাইজে দেখায়।</p>' },
  { id: 'wPVCnVa1gEGX', type: 'code', language: 'css', code: 'p.normal {\n  font-variant: normal;\n}\np.small {\n  font-variant: small-caps;\n}' },
  { id: 'F3ylGabLO1wd', type: 'richtext', html: '<hr>' },
  { id: 'CfGuhAirz7jo', text: 'সব CSS Font প্রপার্টি', type: 'heading', level: 2, anchor: 'all-css-font-properties' },
  { id: 'e8dgM2isWD_5', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
    ['font', 'এক ঘোষণায় সব ফন্ট প্রপার্টি সেট করে'],
    ['font-family', 'টেক্সটের জন্য ফন্ট ফ্যামিলি নির্ধারণ করে'],
    ['font-size', 'টেক্সটের ফন্ট সাইজ নির্ধারণ করে'],
    ['font-style', 'টেক্সটের জন্য ফন্ট স্টাইল নির্ধারণ করে'],
    ['font-variant', 'একটি টেক্সট small-caps ফন্টে প্রদর্শিত হবে কিনা তা নির্ধারণ করে'],
    ['font-weight', 'একটি ফন্টের ওয়েট নির্ধারণ করে'],
  ] },
]

const toc = [
  { id: 'difference-between-serif-and-sans-serif-fonts', text: 'Serif এবং Sans-serif ফন্টের মধ্যে পার্থক্য', level: 2 },
  { id: 'css-font-families', text: 'CSS ফন্ট ফ্যামিলি', level: 2 },
  { id: 'font-family', text: 'ফন্ট ফ্যামিলি', level: 2 },
  { id: 'font-style', text: 'ফন্ট স্টাইল', level: 2 },
  { id: 'font-size', text: 'ফন্ট সাইজ', level: 2 },
  { id: 'set-font-size-with-pixels', text: 'পিক্সেল দিয়ে ফন্ট সাইজ সেট করা', level: 2 },
  { id: 'set-font-size-with-em', text: 'Em দিয়ে ফন্ট সাইজ সেট করা', level: 2 },
  { id: 'use-a-combination-of-percent-and-em', text: 'শতাংশ এবং Em-এর সংমিশ্রণ ব্যবহার করা', level: 2 },
  { id: 'font-weight', text: 'ফন্ট ওয়েট', level: 2 },
  { id: 'responsive-font-size', text: 'রেসপনসিভ ফন্ট সাইজ', level: 2 },
  { id: 'font-variant', text: 'ফন্ট ভ্যারিয়ান্ট', level: 2 },
  { id: 'all-css-font-properties', text: 'সব CSS Font প্রপার্টি', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/font: 1/1 written')
