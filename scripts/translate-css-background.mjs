import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// Note: this source page's content is near-identical to css/colors (a duplication in the
// original Jekyll site), so most block translations are reused verbatim with this page's
// own block ids.
const DOC_ID = 'ae83fedf-1ef7-4b6c-a197-dacc7fcce75d' // css/background
const title = 'CSS ব্যাকগ্রাউন্ড'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'CSS ব্যাকগ্রাউন্ড প্রপার্টি এবং রঙের নাম, RGB, HEX, HSL, RGBA, HSLA মান কীভাবে ব্যবহার করবেন তা জানুন।'

const blocks = [
  { id: 'QOYFnRQBj4rD', type: 'richtext', html: `<p>একটি এলিমেন্টের ব্যাকগ্রাউন্ড ইফেক্ট নির্ধারণ করতে CSS ব্যাকগ্রাউন্ড প্রপার্টি ব্যবহার করা হয়।</p>
<p>CSS ব্যাকগ্রাউন্ড প্রপার্টি:</p>
<ul>
                                    <li>background-color</li>
                                    <li>background-image</li>
                                    <li>background-repeat</li>
                                    <li>background-attachment</li>
                                    <li>background-position</li>
                                </ul>
<hr>
<p>রঙ পূর্বনির্ধারিত রঙের নাম, অথবা RGB, HEX, HSL, RGBA, HSLA মান ব্যবহার করে নির্ধারণ করা হয়।</p>
<hr>
<p class="note"><b>মনে রাখবেন:</b> CSS/HTML <a href="https://www.w3schools.com/colors/colors_names.asp">140টি স্ট্যান্ডার্ড রঙের নাম</a> সমর্থন করে।</p>
<hr>` },
  { id: '05nPXnBfGD_P', text: 'CSS ব্যাকগ্রাউন্ড কালার', type: 'heading', level: 2, anchor: 'css-background-color' },
  { id: 'syWfzUUjkQ4b', type: 'richtext', html: '<p>আপনি HTML এলিমেন্টের জন্য ব্যাকগ্রাউন্ড কালার সেট করতে পারেন:</p>' },
  { id: 'V2OBTllcuL9X', type: 'code', language: 'html', code: '<h1 style="background-color:DodgerBlue;">Hello World</h1>\n<p style="background-color:Tomato;">Lorem ipsum...</p>' },
  { id: 'W_tbJYLq86zW', type: 'richtext', html: '<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>\n<p style="background-color:Tomato; color: #fff;" class="p-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>\n<hr>' },
  { id: 'U5lFy55U0omn', text: 'CSS টেক্সট কালার', type: 'heading', level: 2, anchor: 'css-text-color' },
  { id: '3hENSbvC4Wlh', type: 'richtext', html: '<p>আপনি টেক্সটের রঙ সেট করতে পারেন:</p>' },
  { id: 'xGq7g6odzSsD', type: 'code', language: 'html', code: '<h1 style="color:Tomato;">Hello World</h1>\n<p style="color:DodgerBlue;">Lorem ipsum...</p>\n<p style="color:MediumSeaGreen;">Ut wisi enim...</p>' },
  { id: 'CuyUFEmSO-GX', type: 'richtext', html: '<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>\n<p style="color:DodgerBlue;">Lorem ipsum...</p>\n<p style="color:MediumSeaGreen;">Ut wisi enim...</p>\n<hr>' },
  { id: 'b3qPt0tDEOQF', text: 'CSS বর্ডার কালার', type: 'heading', level: 2, anchor: 'css-border-color' },
  { id: 'ta9KjmbHUb2Y', type: 'richtext', html: '<p>আপনি বর্ডারের রঙ সেট করতে পারেন:</p>' },
  { id: 'MMpxX-s0SFE4', type: 'code', language: 'html', code: '<h1 style="border:2px solid Tomato;">Hello World</h1>\n<h1 style="border:2px solid DodgerBlue;">Hello World</h1>\n<h1 style="border:2px solid Violet;">Hello World</h1>' },
  { id: 'pYEezEHdPrdt', type: 'richtext', html: '<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>\n<hr>' },
  { id: 'RD0xgZCl15xP', text: 'CSS কালার মান', type: 'heading', level: 2, anchor: 'css-color-values' },
  { id: 'Zjxh6Wcfn0gy', type: 'richtext', html: '<p>CSS-এ, রঙ RGB মান, HEX মান, HSL মান, RGBA মান এবং HSLA মান ব্যবহার করেও নির্ধারণ করা যায়:</p>\n<p>"Tomato" রঙের নামের মতোই:</p>' },
  { id: 'izxa4il16PAK', type: 'code', language: 'html', code: '<h1 style="background-color:rgb(255, 99, 71);">...</h1>\n<h1 style="background-color:#ff6347;">...</h1>\n<h1 style="background-color:hsl(9, 100%, 64%);">...</h1>\n<h1 style="background-color:rgba(255, 99, 71, 0.5);">...</h1>\n<h1 style="background-color:hsla(9, 100%, 64%, 0.5);">...</h1>' },
  { id: 'tx4-xq4xkdcB', type: 'richtext', html: '<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>' },
  { id: 'BoKrX5nMesaF', text: 'rgb(255, 99, 71)', type: 'heading', level: 3, anchor: 'rgb255-99-71' },
  { id: 'PHZzFrOB_nyn', text: '#ff6347', type: 'heading', level: 3, anchor: 'ff6347' },
  { id: '1FCRf1ggGTc_', text: 'hsl(9, 100%, 64%)', type: 'heading', level: 3, anchor: 'hsl9-100-64' },
  { id: '-U9_UXhiXZL8', type: 'richtext', html: '<p>"Tomato" রঙের নামের মতোই, কিন্তু 50% স্বচ্ছ:</p>' },
  { id: 'J8Lzdc7VNgz9', text: 'rgba(255, 99, 71, 0.5)', type: 'heading', level: 3, anchor: 'rgba255-99-71-05' },
  { id: 'kSp1SxMiPq5C', text: 'hsla(9, 100%, 64%, 0.5)', type: 'heading', level: 3, anchor: 'hsla9-100-64-05' },
  { id: 'RSpQOcpU9AXb', type: 'richtext', html: '<hr>' },
  { id: 'fx5kxUcGQtux', text: 'CSS RGB মান', type: 'heading', level: 2, anchor: 'css-rgb-value' },
  { id: 'FV72IUumgP9p', type: 'richtext', html: '<p>CSS-এ, একটি রঙ RGB মান হিসেবে নির্ধারণ করা যায়, এই সূত্র ব্যবহার করে:</p>\n<p><b>rgb(red, green, blue)</b></p>\n<p>প্রতিটি প্যারামিটার (red, green, এবং blue) 0 থেকে 255-এর মধ্যে রঙের তীব্রতা নির্ধারণ করে।</p>\n<p>উদাহরণস্বরূপ, rgb(255, 0, 0) লাল হিসেবে প্রদর্শিত হয়, কারণ red তার সর্বোচ্চ মানে (255) সেট করা এবং বাকিগুলো 0-তে সেট করা।</p>\n<p>কালো রঙ দেখাতে, সব কালার প্যারামিটার 0-তে সেট করতে হবে, এভাবে: rgb(0, 0, 0)।</p>\n<p>সাদা রঙ দেখাতে, সব কালার প্যারামিটার 255-এ সেট করতে হবে, এভাবে: rgb(255, 255, 255)।</p>\n<hr>' },
  { id: '6zbZ37BwTois', text: 'CSS HEX মান', type: 'heading', level: 2, anchor: 'css-hex-value' },
  { id: '1R9cxv4f9Ylz', type: 'richtext', html: '<p>CSS-এ, একটি রঙ এই ফর্মে একটি হেক্সাডেসিমাল মান ব্যবহার করে নির্ধারণ করা যায়:</p>\n<p><b>#rrggbb</b></p>\n<p>যেখানে rr (red), gg (green) এবং bb (blue) হলো 00 থেকে ff-এর মধ্যে হেক্সাডেসিমাল মান (দশমিক 0-255-এর সমান)।</p>\n<p>উদাহরণস্বরূপ, #ff0000 লাল হিসেবে প্রদর্শিত হয়, কারণ red তার সর্বোচ্চ মানে (ff) সেট করা এবং বাকিগুলো সর্বনিম্ন মানে (00) সেট করা।</p>\n<hr>' },
  { id: 'bCxEue_XpvEi', text: 'HSL মান', type: 'heading', level: 2, anchor: 'hsl-value' },
  { id: 'Azg1IoltMWfc', type: 'richtext', html: '<p>CSS-এ, একটি রঙ hue, saturation, এবং lightness (HSL) ব্যবহার করে এই ফর্মে নির্ধারণ করা যায়:</p>\n<p><b>hsl(hue, saturation, lightness)</b></p>\n<p>Hue হলো কালার হুইলে 0 থেকে 360-এর মধ্যে একটি ডিগ্রি। 0 লাল, 120 সবুজ, এবং 240 নীল।</p>\n<p>Saturation একটি শতাংশ মান, 0% মানে ধূসরের একটি শেড, এবং 100% হলো সম্পূর্ণ রঙ।</p>\n<p>Lightness-ও একটি শতাংশ, 0% কালো, 50% হালকাও না গাঢ়ও না, 100% সাদা</p>\n<hr>' },
  { id: 'UiQpCEr-c1D3', text: 'Saturation', type: 'heading', level: 2, anchor: 'saturation' },
  { id: '8BDmj9UKQqq3', type: 'richtext', html: '<p>Saturation-কে একটি রঙের তীব্রতা হিসেবে বর্ণনা করা যায়।</p>\n<p>100% হলো বিশুদ্ধ রঙ, কোনো ধূসর শেড নেই</p>\n<p>50% হলো 50% ধূসর, তবে আপনি তখনও রঙ দেখতে পাবেন।</p>\n<p>0% সম্পূর্ণ ধূসর, আপনি আর রঙ দেখতে পাবেন না।</p>\n<hr>' },
  { id: 'usmQH8ldb1Ez', text: 'Lightness', type: 'heading', level: 2, anchor: 'lightness' },
  { id: 'kbs3XvDC5V7B', type: 'richtext', html: "<p>একটি রঙের lightness-কে বর্ণনা করা যায় আপনি রঙে কতটা আলো দিতে চান তা দিয়ে, যেখানে 0% মানে কোনো আলো নেই (কালো), 50% মানে 50% আলো (না গাঢ় না হালকা) 100% মানে সম্পূর্ণ lightness (সাদা)।</p>\n<p>ধূসরের শেড প্রায়ই hue এবং saturation 0-তে সেট করে, এবং গাঢ়/হালকা শেড পেতে lightness 0% থেকে 100% পর্যন্ত সমন্বয় করে নির্ধারণ করা হয়:</p>\n<hr>" },
  { id: 'BzT9gdZm-eCi', text: 'RGBA মান', type: 'heading', level: 2, anchor: 'rgba-value' },
  { id: 'cgaWQZZv99xQ', type: 'richtext', html: '<p>RGBA কালার মান হলো RGB কালার মানের একটি বর্ধিত রূপ, যেখানে একটি আলফা চ্যানেল থাকে - যা একটি রঙের অস্বচ্ছতা নির্ধারণ করে।</p>\n<p>একটি RGBA কালার মান এভাবে নির্ধারণ করা হয়:</p>\n<p><b>rgba(red, green, blue, alpha)</b></p>\n<p>আলফা প্যারামিটার হলো 0.0 (সম্পূর্ণ স্বচ্ছ) থেকে 1.0 (একদমই স্বচ্ছ নয়) এর মধ্যে একটি সংখ্যা:</p>\n<hr>' },
  { id: 'u9ZTtkNO_jgr', text: 'HSLA মান', type: 'heading', level: 2, anchor: 'hsla-value' },
  { id: 'gj5xmZnNqRhH', type: 'richtext', html: '<p>HSLA কালার মান হলো HSL কালার মানের একটি বর্ধিত রূপ, যেখানে একটি আলফা চ্যানেল থাকে - যা একটি রঙের অস্বচ্ছতা নির্ধারণ করে।</p>\n<p>একটি HSLA কালার মান এভাবে নির্ধারণ করা হয়:</p>\n<p><b>hsla(hue, saturation, lightness, alpha)</b></p>\n<p>আলফা প্যারামিটার হলো 0.0 (সম্পূর্ণ স্বচ্ছ) থেকে 1.0 (একদমই স্বচ্ছ নয়) এর মধ্যে একটি সংখ্যা:</p>' },
]

const toc = [
  { id: 'css-background-color', text: 'CSS ব্যাকগ্রাউন্ড কালার', level: 2 },
  { id: 'css-text-color', text: 'CSS টেক্সট কালার', level: 2 },
  { id: 'css-border-color', text: 'CSS বর্ডার কালার', level: 2 },
  { id: 'css-color-values', text: 'CSS কালার মান', level: 2 },
  { id: 'rgb255-99-71', text: 'rgb(255, 99, 71)', level: 3 },
  { id: 'ff6347', text: '#ff6347', level: 3 },
  { id: 'hsl9-100-64', text: 'hsl(9, 100%, 64%)', level: 3 },
  { id: 'rgba255-99-71-05', text: 'rgba(255, 99, 71, 0.5)', level: 3 },
  { id: 'hsla9-100-64-05', text: 'hsla(9, 100%, 64%, 0.5)', level: 3 },
  { id: 'css-rgb-value', text: 'CSS RGB মান', level: 2 },
  { id: 'css-hex-value', text: 'CSS HEX মান', level: 2 },
  { id: 'hsl-value', text: 'HSL মান', level: 2 },
  { id: 'saturation', text: 'Saturation', level: 2 },
  { id: 'lightness', text: 'Lightness', level: 2 },
  { id: 'rgba-value', text: 'RGBA মান', level: 2 },
  { id: 'hsla-value', text: 'HSLA মান', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/background: 1/1 written')
