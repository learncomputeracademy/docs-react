import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '9f29988a-ea15-4d57-86a3-347fd0e62ce8' // css/image-transparency
const title = 'CSS অপাসিটি'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'CSS opacity প্রপার্টি দিয়ে স্বচ্ছ ইমেজ, হোভার ইফেক্ট এবং RGBA দিয়ে স্বচ্ছ বক্স তৈরি করা শিখুন।'
const ie8 = '/* IE8 এবং তার আগের ভার্সনের জন্য */'

const blocks = [
  { id: 'WwyAzd6_41Y-', type: 'richtext', html: '<hr>\n<p><code>opacity</code> প্রপার্টি একটি এলিমেন্টের অপাসিটি/স্বচ্ছতা নির্ধারণ করে।</p>\n<hr>' },
  { id: 'hR-D33bUCzXR', text: 'স্বচ্ছ ইমেজ', type: 'heading', level: 2, anchor: 'transparent-image' },
  { id: 'GzQZfpInSqZx', type: 'richtext', html: '<p><code>opacity</code> প্রপার্টি 0.0 - 1.0-এর মধ্যে একটি মান নিতে পারে। মান যত কম, ততই বেশি স্বচ্ছ:</p>' },
  { id: '8_vyqmvDyUKf', type: 'image', alt: 'Forest', width: 600, height: 400, publicId: 'img/img_forest' },
  { id: 'thpLcVYCniy0', type: 'richtext', html: '<span>opacity 0.2</span>' },
  { id: 'b91H9UbR0G8V', type: 'image', alt: 'Forest', width: 600, height: 400, publicId: 'img/img_forest' },
  { id: 'Xgx0W1PvXEsN', type: 'richtext', html: '<span>opacity 0.5</span>' },
  { id: 'skSQykU092om', type: 'image', alt: 'Forest', width: 600, height: 400, publicId: 'img/img_forest' },
  { id: 'lqoOebNRZZVh', type: 'richtext', html: '<span>opacity 1 (ডিফল্ট)</span>\n<p><b>মনে রাখবেন:</b> IE8 এবং তার আগের ভার্সন <code>filter:alpha(opacity=x)</code> ব্যবহার করে। x 0 - 100-এর মধ্যে একটি মান নিতে পারে। কম মান এলিমেন্টকে আরও স্বচ্ছ করে তোলে।</p>' },
  { id: 'U4bUIrfTanD0', type: 'code', language: 'css', code: `img {\n  opacity: 0.5;\n  filter: alpha(opacity=50); ${ie8}\n}` },
  { id: 'H7tV_kTxiNnH', type: 'richtext', html: '<hr>' },
  { id: 'kG6QP0Kk-l7i', text: 'স্বচ্ছ হোভার ইফেক্ট', type: 'heading', level: 2, anchor: 'transparent-hover-effect' },
  { id: 'EGkdqjLHSXms', type: 'richtext', html: `<p><code>opacity</code> প্রপার্টি প্রায়ই <code>:hover</code>-এর সাথে ব্যবহার করা হয়
                                <style>
                                    img.forest {
                                      opacity: 0.5;
                                      filter: alpha(opacity=50); ${ie8}
                                      transition: all .3s ease;
                                    }
                                    img.forest:hover {
                                      opacity: 1.0;
                                      filter: alpha(opacity=100); ${ie8}
                                    }
                                </style>
                                </p>` },
  { id: '4f2Vl34d-h_J', type: 'image', alt: 'Forest', width: 600, height: 400, publicId: 'img/img_forest' },
  { id: 'NuHIFxXiTtoo', type: 'image', alt: 'Forest', width: 600, height: 400, publicId: 'img/img_forest' },
  { id: 'PKKgmdGZ93rI', type: 'image', alt: 'Forest', width: 600, height: 400, publicId: 'img/img_forest' },
  { id: 'XtXdoertjJt4', type: 'code', language: 'css', code: `img {\n  opacity: 0.5;\n  filter: alpha(opacity=50); ${ie8}\n}\nimg:hover {\n  opacity: 1.0;\n  filter: alpha(opacity=100); ${ie8}\n}` },
  { id: 'OrkAWLZ8JQgc', text: 'উদাহরণের ব্যাখ্যা', type: 'heading', level: 3, anchor: 'example-explained' },
  { id: 'mzyPMVKVV2Rn', type: 'richtext', html: '<p>প্রথম CSS ব্লকটি উদাহরণ 1-এর কোডের মতোই। এছাড়াও, ব্যবহারকারী একটি ইমেজের উপর হোভার করলে কী হবে তা আমরা যোগ করেছি। এক্ষেত্রে আমরা চাই ব্যবহারকারী হোভার করলে ইমেজটি স্বচ্ছ না হোক। এর জন্য CSS হলো <code>opacity:1;</code>।</p>\n<p>মাউস পয়েন্টার ইমেজ থেকে সরে গেলে, ইমেজটি আবার স্বচ্ছ হয়ে যাবে।</p>\n<p>উল্টো হোভার ইফেক্টের একটি উদাহরণ:</p>' },
  { id: '5J67bVzm5S6F', type: 'image', alt: 'Forest', width: 600, height: 400, publicId: 'img/img_forest' },
  { id: 'LUMu2dwtNkCp', type: 'image', alt: 'Forest', width: 600, height: 400, publicId: 'img/img_forest' },
  { id: '-4Ry-dY0LdB9', type: 'image', alt: 'Forest', width: 600, height: 400, publicId: 'img/img_forest' },
  { id: 'ZOyHUBYXmPfI', type: 'code', language: 'css', code: `img:hover {\n  opacity: 0.5;\n  filter: alpha(opacity=50); ${ie8}\n}` },
  { id: 'yvkJzzBuOMyk', type: 'richtext', html: '<hr>' },
  { id: 'h7R1MFRznXqD', text: 'স্বচ্ছ বক্স', type: 'heading', level: 2, anchor: 'transparent-box' },
  { id: 'ecP6jX0i7-Co', type: 'richtext', html: `<p>একটি এলিমেন্টের ব্যাকগ্রাউন্ডে স্বচ্ছতা যোগ করতে <code>opacity</code> প্রপার্টি ব্যবহার করলে, এর সব চাইল্ড এলিমেন্ট
                                একই স্বচ্ছতা ইনহেরিট করে। এর ফলে একটি সম্পূর্ণ স্বচ্ছ এলিমেন্টের ভেতরের টেক্সট পড়া কঠিন হয়ে যেতে পারে:</p>
<p>opacity 1</p>
<p>opacity 0.6</p>
<p>opacity 0.3</p>
<p>opacity 0.1</p>` },
  { id: 'BZL0PgJAxIhy', type: 'code', language: 'css', code: `div {\n  opacity: 0.3;\n  filter: alpha(opacity=30); ${ie8}\n}` },
  { id: '0_yK_AhNCxQv', type: 'richtext', html: '<hr>' },
  { id: '8NtunffloJVk', text: 'RGBA ব্যবহার করে স্বচ্ছতা', type: 'heading', level: 2, anchor: 'transparency-using-rgba' },
  { id: 'EAXeIaEDyaqC', type: 'richtext', html: `<p>উপরের আমাদের উদাহরণের মতো, চাইল্ড এলিমেন্টে opacity প্রয়োগ করতে না চাইলে, <strong>RGBA</strong> কালার মান ব্যবহার করুন। নিচের উদাহরণে টেক্সট নয়, ব্যাকগ্রাউন্ড কালারের জন্য opacity সেট করা হয়েছে:</p>
<p>100% opacity</p>
<p>60% opacity</p>
<p>30% opacity</p>
<p>10% opacity</p>
<p>আমাদের <a href="#">CSS রঙ চ্যাপ্টার</a> থেকে আপনি শিখেছেন যে, RGB-কে একটি কালার মান হিসেবে ব্যবহার করা যায়। RGB-এর পাশাপাশি, আপনি একটি আলফা চ্যানেলসহ (RGBA) একটি RGB কালার মান ব্যবহার করতে পারেন - যা একটি রঙের অপাসিটি নির্ধারণ করে।</p>
<p>একটি RGBA কালার মান এভাবে নির্ধারণ করা হয়: rgba(red, green, blue, <em>alpha</em>)। <em>alpha</em> প্যারামিটার হলো 0.0 (সম্পূর্ণ স্বচ্ছ) থেকে 1.0 (সম্পূর্ণ অস্বচ্ছ) এর মধ্যে একটি সংখ্যা।</p>
<p><strong>টিপস:</strong> আমাদের <a href="#">CSS রঙ চ্যাপ্টারে</a> RGBA রঙ সম্পর্কে আরও জানবেন।</p>` },
  { id: 'gf6O-PKf1f-F', type: 'code', language: 'css', code: "div {\n  background: rgba(76, 175, 80, 0.3) /* 30% opacity-সহ সবুজ ব্যাকগ্রাউন্ড */\n}" },
  { id: 'A3pZgSNujaUZ', type: 'richtext', html: '<hr>' },
  { id: 's5HaMO6iUrs0', text: 'স্বচ্ছ বক্সে টেক্সট', type: 'heading', level: 2, anchor: 'text-in-transparent-box' },
  { id: 'TIEA05MQPRkC', type: 'richtext', html: `<div class="img-block" style="margin-bottom: 1rem;">
                                    <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960420/img/transparent-box.webp" alt="Transparent Image" class="img-fluid">
                                </div>` },
  { id: '1Ji98uklhsHK', type: 'code', language: 'html', code: `<html>\n<head>\n    <style>\n    div.background {\n      background: url(klematis.jpg) repeat;\n      border: 2px solid black;\n    }\n    div.transbox {\n      margin: 30px;\n      background-color: #ffffff;\n      border: 1px solid black;\n      opacity: 0.6;\n      filter: alpha(opacity=60); ${ie8}\n    }\n    div.transbox p {\n      margin: 5%;\n      font-weight: bold;\n      color: #000000;\n    }\n    </style>\n</head>\n<body>\n    <div class="background">\n      <div class="transbox">\n        <p>This is some text that is placed in the transparent box.</p>\n      </div>\n    </div>\n</body>\n</html>` },
  { id: '_ng2I9LW6zyL', type: 'richtext', html: '<p>প্রথমে, আমরা একটি ব্যাকগ্রাউন্ড ইমেজ এবং একটি বর্ডারসহ একটি &lt;div&gt; এলিমেন্ট (class="background") তৈরি করি। এরপর প্রথম &lt;div&gt;-এর ভেতরে আরেকটি &lt;div&gt; (class="transbox") তৈরি করি। &lt;div class="transbox"&gt;-এর একটি ব্যাকগ্রাউন্ড কালার এবং একটি বর্ডার আছে - div-টি স্বচ্ছ। স্বচ্ছ &lt;div&gt;-এর ভেতরে, আমরা একটি &lt;p&gt; এলিমেন্টের ভেতরে কিছু টেক্সট যোগ করি।</p>' },
]

const toc = [
  { id: 'transparent-image', text: 'স্বচ্ছ ইমেজ', level: 2 },
  { id: 'transparent-hover-effect', text: 'স্বচ্ছ হোভার ইফেক্ট', level: 2 },
  { id: 'example-explained', text: 'উদাহরণের ব্যাখ্যা', level: 3 },
  { id: 'transparent-box', text: 'স্বচ্ছ বক্স', level: 2 },
  { id: 'transparency-using-rgba', text: 'RGBA ব্যবহার করে স্বচ্ছতা', level: 2 },
  { id: 'text-in-transparent-box', text: 'স্বচ্ছ বক্সে টেক্সট', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/image-transparency: 1/1 written')
