import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const mt = (title) => `${title} | Learn Computer Academy`

const docs = [
  {
    id: 'fb82bd9c-d69c-44f4-888f-d55064961e8a', // css/colors
    title: 'CSS রঙ',
    meta_description: 'CSS-এ রঙের নাম, RGB, HEX, HSL, RGBA, HSLA মান কীভাবে ব্যবহার করবেন এবং saturation ও lightness কী তা জানুন।',
    blocks: [
      { id: 'ieVlVw5FLAVx', type: 'richtext', html: '<hr>\n<p>রঙ পূর্বনির্ধারিত রঙের নাম, অথবা RGB, HEX, HSL, RGBA, HSLA মান ব্যবহার করে নির্ধারণ করা হয়।</p>\n<hr>\n<p class="note"><b>মনে রাখবেন:</b> CSS/HTML <a href="https://www.w3schools.com/colors/colors_names.asp">140টি স্ট্যান্ডার্ড রঙের নাম</a> সমর্থন করে।</p>\n<hr>' },
      { id: 'LabiWSFNOV2O', text: 'CSS ব্যাকগ্রাউন্ড কালার', type: 'heading', level: 2, anchor: 'css-background-color' },
      { id: '5AcFnRqqgY_v', type: 'richtext', html: '<p>আপনি HTML এলিমেন্টের জন্য ব্যাকগ্রাউন্ড কালার সেট করতে পারেন:</p>' },
      { id: 'YwE2EAu8LQ8K', type: 'code', language: 'html', code: '<h1 style="background-color:DodgerBlue;">Hello World</h1>\n<p style="background-color:Tomato;">Lorem ipsum...</p>' },
      { id: 'koxwffxyQxw8', type: 'richtext', html: '<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>\n<p style="background-color:Tomato; color: #fff;" class="p-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>\n<hr>' },
      { id: '_q1_Ck-T9rHx', text: 'CSS টেক্সট কালার', type: 'heading', level: 2, anchor: 'css-text-color' },
      { id: 'pNhntYMQPFDz', type: 'richtext', html: '<p>আপনি টেক্সটের রঙ সেট করতে পারেন:</p>' },
      { id: 'PmtCLna38g-y', type: 'code', language: 'html', code: '<h1 style="color:Tomato;">Hello World</h1>\n<p style="color:DodgerBlue;">Lorem ipsum...</p>\n<p style="color:MediumSeaGreen;">Ut wisi enim...</p>' },
      { id: 'pWTJKIygywXb', type: 'richtext', html: '<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>\n<p style="color:DodgerBlue;">Lorem ipsum...</p>\n<p style="color:MediumSeaGreen;">Ut wisi enim...</p>\n<hr>' },
      { id: 'WLZVIRMrzt5a', text: 'CSS বর্ডার কালার', type: 'heading', level: 2, anchor: 'css-border-color' },
      { id: 'qR_sPHRmirDR', type: 'richtext', html: '<p>আপনি বর্ডারের রঙ সেট করতে পারেন:</p>' },
      { id: 'kgL45lrdyN8A', type: 'code', language: 'html', code: '<h1 style="border:2px solid Tomato;">Hello World</h1>\n<h1 style="border:2px solid DodgerBlue;">Hello World</h1>\n<h1 style="border:2px solid Violet;">Hello World</h1>' },
      { id: '77PCHbedMLcj', type: 'richtext', html: '<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>\n<hr>' },
      { id: 'zarrTAf6Ni21', text: 'CSS কালার মান', type: 'heading', level: 2, anchor: 'css-color-values' },
      { id: '4JR5ZrrGU_EJ', type: 'richtext', html: '<p>CSS-এ, রঙ RGB মান, HEX মান, HSL মান, RGBA মান এবং HSLA মান ব্যবহার করেও নির্ধারণ করা যায়:</p>\n<p>"Tomato" রঙের নামের মতোই:</p>' },
      { id: 'NWAjj57fmEHz', type: 'code', language: 'html', code: '<h1 style="background-color:rgb(255, 99, 71);">...</h1>\n<h1 style="background-color:#ff6347;">...</h1>\n<h1 style="background-color:hsl(9, 100%, 64%);">...</h1>\n<h1 style="background-color:rgba(255, 99, 71, 0.5);">...</h1>\n<h1 style="background-color:hsla(9, 100%, 64%, 0.5);">...</h1>' },
      { id: 'xhxg2AHEoPy-', type: 'richtext', html: '<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>' },
      { id: '1SdQRcdAR2sN', text: 'rgb(255, 99, 71)', type: 'heading', level: 3, anchor: 'rgb255-99-71' },
      { id: '42RWbzjjZJms', text: '#ff6347', type: 'heading', level: 3, anchor: 'ff6347' },
      { id: 'aLqACM6EWUSU', text: 'hsl(9, 100%, 64%)', type: 'heading', level: 3, anchor: 'hsl9-100-64' },
      { id: 'orX9UgS-XAo3', type: 'richtext', html: '<p>"Tomato" রঙের নামের মতোই, কিন্তু 50% স্বচ্ছ:</p>' },
      { id: 'DlJWV4FhHVp4', text: 'rgba(255, 99, 71, 0.5)', type: 'heading', level: 3, anchor: 'rgba255-99-71-05' },
      { id: 'DamRJ0tF1xbB', text: 'hsla(9, 100%, 64%, 0.5)', type: 'heading', level: 3, anchor: 'hsla9-100-64-05' },
      { id: 'OuRrZmuCmpXt', type: 'richtext', html: '<hr>' },
      { id: 'yDvoV-dYNu9B', text: 'CSS RGB মান', type: 'heading', level: 2, anchor: 'css-rgb-value' },
      { id: '9R4EIwr0QFBB', type: 'richtext', html: '<p>CSS-এ, একটি রঙ RGB মান হিসেবে নির্ধারণ করা যায়, এই সূত্র ব্যবহার করে:</p>\n<p><b>rgb(red, green, blue)</b></p>\n<p>প্রতিটি প্যারামিটার (red, green, এবং blue) 0 থেকে 255-এর মধ্যে রঙের তীব্রতা নির্ধারণ করে।</p>\n<p>উদাহরণস্বরূপ, rgb(255, 0, 0) লাল হিসেবে প্রদর্শিত হয়, কারণ red তার সর্বোচ্চ মানে (255) সেট করা এবং বাকিগুলো 0-তে সেট করা।</p>\n<p>কালো রঙ দেখাতে, সব কালার প্যারামিটার 0-তে সেট করতে হবে, এভাবে: rgb(0, 0, 0)।</p>\n<p>সাদা রঙ দেখাতে, সব কালার প্যারামিটার 255-এ সেট করতে হবে, এভাবে: rgb(255, 255, 255)।</p>\n<hr>' },
      { id: 'GPENGPtXqZge', text: 'CSS HEX মান', type: 'heading', level: 2, anchor: 'css-hex-value' },
      { id: 'VR61upXFZ030', type: 'richtext', html: '<p>CSS-এ, একটি রঙ এই ফর্মে একটি হেক্সাডেসিমাল মান ব্যবহার করে নির্ধারণ করা যায়:</p>\n<p><b>#rrggbb</b></p>\n<p>যেখানে rr (red), gg (green) এবং bb (blue) হলো 00 থেকে ff-এর মধ্যে হেক্সাডেসিমাল মান (দশমিক 0-255-এর সমান)।</p>\n<p>উদাহরণস্বরূপ, #ff0000 লাল হিসেবে প্রদর্শিত হয়, কারণ red তার সর্বোচ্চ মানে (ff) সেট করা এবং বাকিগুলো সর্বনিম্ন মানে (00) সেট করা।</p>\n<hr>' },
      { id: 'Hq0ZychAa8SH', text: 'HSL মান', type: 'heading', level: 2, anchor: 'hsl-value' },
      { id: 'NPaqYykuRnG-', type: 'richtext', html: '<p>CSS-এ, একটি রঙ hue, saturation, এবং lightness (HSL) ব্যবহার করে এই ফর্মে নির্ধারণ করা যায়:</p>\n<p><b>hsl(hue, saturation, lightness)</b></p>\n<p>Hue হলো কালার হুইলে 0 থেকে 360-এর মধ্যে একটি ডিগ্রি। 0 লাল, 120 সবুজ, এবং 240 নীল।</p>\n<p>Saturation একটি শতাংশ মান, 0% মানে ধূসরের একটি শেড, এবং 100% হলো সম্পূর্ণ রঙ।</p>\n<p>Lightness-ও একটি শতাংশ, 0% কালো, 50% হালকাও না গাঢ়ও না, 100% সাদা</p>\n<hr>' },
      { id: '_Y65q40bhtGM', text: 'Saturation', type: 'heading', level: 2, anchor: 'saturation' },
      { id: '-dJZ7YKYVSzJ', type: 'richtext', html: '<p>Saturation-কে একটি রঙের তীব্রতা হিসেবে বর্ণনা করা যায়।</p>\n<p>100% হলো বিশুদ্ধ রঙ, কোনো ধূসর শেড নেই</p>\n<p>50% হলো 50% ধূসর, তবে আপনি তখনও রঙ দেখতে পাবেন।</p>\n<p>0% সম্পূর্ণ ধূসর, আপনি আর রঙ দেখতে পাবেন না।</p>\n<hr>' },
      { id: 'uqYDQRkRTh_E', text: 'Lightness', type: 'heading', level: 2, anchor: 'lightness' },
      { id: 'PAAB_LWZoy8w', type: 'richtext', html: "<p>একটি রঙের lightness-কে বর্ণনা করা যায় আপনি রঙে কতটা আলো দিতে চান তা দিয়ে, যেখানে 0% মানে কোনো আলো নেই (কালো), 50% মানে 50% আলো (না গাঢ় না হালকা) 100% মানে সম্পূর্ণ lightness (সাদা)।</p>\n<p>ধূসরের শেড প্রায়ই hue এবং saturation 0-তে সেট করে, এবং গাঢ়/হালকা শেড পেতে lightness 0% থেকে 100% পর্যন্ত সমন্বয় করে নির্ধারণ করা হয়:</p>\n<hr>" },
      { id: 'tRTznyCBj3Ap', text: 'RGBA মান', type: 'heading', level: 2, anchor: 'rgba-value' },
      { id: 'z8Z7If_d1p1p', type: 'richtext', html: '<p>RGBA কালার মান হলো RGB কালার মানের একটি বর্ধিত রূপ, যেখানে একটি আলফা চ্যানেল থাকে - যা একটি রঙের অস্বচ্ছতা নির্ধারণ করে।</p>\n<p>একটি RGBA কালার মান এভাবে নির্ধারণ করা হয়:</p>\n<p><b>rgba(red, green, blue, alpha)</b></p>\n<p>আলফা প্যারামিটার হলো 0.0 (সম্পূর্ণ স্বচ্ছ) থেকে 1.0 (একদমই স্বচ্ছ নয়) এর মধ্যে একটি সংখ্যা:</p>\n<hr>' },
      { id: 'z2dfRozSNwjZ', text: 'HSLA মান', type: 'heading', level: 2, anchor: 'hsla-value' },
      { id: 'xV9JYeZGta7r', type: 'richtext', html: '<p>HSLA কালার মান হলো HSL কালার মানের একটি বর্ধিত রূপ, যেখানে একটি আলফা চ্যানেল থাকে - যা একটি রঙের অস্বচ্ছতা নির্ধারণ করে।</p>\n<p>একটি HSLA কালার মান এভাবে নির্ধারণ করা হয়:</p>\n<p><b>hsla(hue, saturation, lightness, alpha)</b></p>\n<p>আলফা প্যারামিটার হলো 0.0 (সম্পূর্ণ স্বচ্ছ) থেকে 1.0 (একদমই স্বচ্ছ নয়) এর মধ্যে একটি সংখ্যা:</p>' },
    ],
    toc: [
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
    ],
  },
  {
    id: '695cc37a-cbda-4c03-a5fd-ffa6d3ef26d3', // css/list
    title: 'CSS লিস্ট',
    meta_description: 'CSS list-style-type, list-style-image, list-style-position এবং শর্টহ্যান্ড প্রপার্টি কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'kmXwAzyjZLwy', type: 'richtext', html: '<hr>' },
      { id: 'e5Be3b95mzQL', text: 'আনঅর্ডার্ড লিস্ট:', type: 'heading', level: 2, anchor: 'unordered-lists' },
      { id: '2srI1KX6qB6a', type: 'richtext', html: `<ul style="list-style:circle">
                                            <li>কফি</li>
                                            <li>চা</li>
                                            <li>Coca Cola</li>
                                        </ul>
<ul style="list-style:square">
                                            <li>কফি</li>
                                            <li>চা</li>
                                            <li>Coca Cola</li>
                                        </ul>` },
      { id: 'UPmgvdxs24cH', text: 'অর্ডার্ড লিস্ট:', type: 'heading', level: 2, anchor: 'ordered-lists' },
      { id: 'PyKq99Z7QprK', type: 'richtext', html: `<ol style="list-style:decimal">
                                            <li>কফি</li>
                                            <li>চা</li>
                                            <li>Coca Cola</li>
                                        </ol>
<ol style="list-style:lower-alpha">
                                            <li>কফি</li>
                                            <li>চা</li>
                                            <li>Coca Cola</li>
                                        </ol>
<hr>` },
      { id: 'uCbizLjYBoYQ', text: 'HTML লিস্ট এবং CSS লিস্ট প্রপার্টি', type: 'heading', level: 2, anchor: 'html-lists-and-css-list-properties' },
      { id: 'm3jVemak4EgL', type: 'richtext', html: `<p>HTML-এ, দুই ধরনের প্রধান লিস্ট আছে:</p>
<ul>
                                  <li>আনঅর্ডার্ড লিস্ট (&lt;ul&gt;) - লিস্ট আইটেমগুলো বুলেট দিয়ে চিহ্নিত হয়</li>
                                  <li>অর্ডার্ড লিস্ট (&lt;ol&gt;) - লিস্ট আইটেমগুলো সংখ্যা বা অক্ষর দিয়ে চিহ্নিত হয়</li>
                                </ul>
<p>CSS লিস্ট প্রপার্টি আপনাকে যা করতে দেয়:</p>
<ul>
                                  <li>অর্ডার্ড লিস্টের জন্য ভিন্ন লিস্ট আইটেম মার্কার সেট করা</li>
                                  <li>আনঅর্ডার্ড লিস্টের জন্য ভিন্ন লিস্ট আইটেম মার্কার সেট করা</li>
                                  <li>লিস্ট আইটেম মার্কার হিসেবে একটি ইমেজ সেট করা</li>
                                  <li>লিস্ট এবং লিস্ট আইটেমে ব্যাকগ্রাউন্ড কালার যোগ করা</li>
                                </ul>
<hr>` },
      { id: 'VODddIguYY0A', text: 'ভিন্ন লিস্ট আইটেম মার্কার', type: 'heading', level: 2, anchor: 'different-list-item-markers' },
      { id: '2UvYU9q_mTEL', type: 'richtext', html: '<p><code>list-style-type</code> প্রপার্টি লিস্ট আইটেম মার্কারের ধরন নির্ধারণ করে।</p>\n<p>নিচের উদাহরণে কিছু উপলব্ধ লিস্ট আইটেম মার্কার দেখানো হয়েছে: </p>' },
      { id: 'fllzfptuik5x', type: 'code', language: 'css', code: 'ul.a {\n  list-style-type: circle;\n}\nul.b {\n  list-style-type: square;\n}\nol.c {\n  list-style-type: upper-roman;\n}\nol.d {\n  list-style-type: lower-alpha;\n}' },
      { id: 'FNY9CuHBWsL1', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b> কিছু মান আনঅর্ডার্ড লিস্টের জন্য, এবং কিছু অর্ডার্ড লিস্টের জন্য।</p>\n<hr>' },
      { id: '6KwuEvCZQcJg', text: 'লিস্ট আইটেম মার্কার হিসেবে একটি ইমেজ', type: 'heading', level: 2, anchor: 'an-image-as-the-list-item-marker' },
      { id: 'u7zrqNe2Yxnp', type: 'richtext', html: '<p><code>list-style-image</code> প্রপার্টি লিস্ট আইটেম মার্কার হিসেবে একটি ইমেজ নির্ধারণ করে:</p>' },
      { id: 'eG1aGUg8IwpJ', type: 'code', language: 'css', code: "ul {\n  list-style-image: url('cat.png');\n}" },
      { id: '9olWWZlV1WlH', type: 'richtext', html: `<ul style="list-style-image: url('assets/img/cat.png');">
                                  <li>কফি</li>
                                  <li>চা</li>
                                  <li>Coca Cola</li>
                                </ul>
<hr>` },
      { id: 'Bpx8Nd57m6rG', text: 'লিস্ট আইটেম মার্কারের অবস্থান', type: 'heading', level: 2, anchor: 'position-the-list-item-markers' },
      { id: 'hvOhHlwOtg_8', type: 'richtext', html: `<p><code>list-style-position</code> প্রপার্টি লিস্ট-আইটেম মার্কারের (বুলেট পয়েন্ট)
                                অবস্থান নির্ধারণ করে।</p>
<p>"list-style-position: outside;" মানে বুলেট পয়েন্ট লিস্ট আইটেমের বাইরে থাকবে। একটি লিস্ট আইটেমের প্রতিটি লাইনের শুরু উল্লম্বভাবে সারিবদ্ধ থাকবে।
                                এটি ডিফল্ট:</p>
<ul style="list-style-position:outside;width:25%;">
                                    <li style="border:1px solid #000000;">কফি -
                                    <span style="display: inline !important; float: none; background-color: transparent; color: rgb(0, 0, 0); font-family: Times New Roman; font-size: 16px; font-style: normal; font-variant: normal; font-weight: 400; letter-spacing: normal; list-style-position: inside; orphans: 2; text-align: left; text-decoration: none; text-indent: 0px; text-transform: none; -webkit-text-stroke-width: 0px; white-space: normal; word-spacing: 0px;">
                                    ভাজা কফি বিনস থেকে তৈরি একটি পানীয়...</span></li>
                                    <li style="border:1px solid #000000;border-top:0;">চা</li>
                                    <li style="border:1px solid #000000;border-top:0;">Coca-cola</li>
                                </ul>
<p>"list-style-position: inside;" মানে বুলেট পয়েন্ট লিস্ট আইটেমের ভেতরে থাকবে। এটি লিস্ট আইটেমের অংশ হওয়ায়, এটি টেক্সটের অংশ হয়ে যাবে এবং
                                শুরুতে টেক্সট ঠেলে দেবে:</p>
<ul style="list-style-position:inside;width:25%;">
                                    <li style="border:1px solid #000000;">কফি -
                                    <span style="display: inline !important; float: none; background-color: transparent; color: rgb(0, 0, 0); font-family: Times New Roman; font-size: 16px; font-style: normal; font-variant: normal; font-weight: 400; letter-spacing: normal; list-style-position: inside; orphans: 2; text-align: left; text-decoration: none; text-indent: 0px; text-transform: none; -webkit-text-stroke-width: 0px; white-space: normal; word-spacing: 0px;">
                                    ভাজা কফি বিনস থেকে তৈরি একটি পানীয়...</span></li>
                                    <li style="border:1px solid #000000;border-top:0;">চা</li>
                                    <li style="border:1px solid #000000;border-top:0;">Coca-cola</li>
                                </ul>` },
      { id: 'McNl2VNlmbwY', type: 'code', language: 'css', code: 'ul.a {\n  list-style-position: outside;\n}\nul.b {\n  list-style-position: inside;\n}' },
      { id: 'KpeaDkJm6E0P', type: 'richtext', html: '<hr>' },
      { id: 'vHsXurvgIv6E', text: 'ডিফল্ট সেটিংস সরানো', type: 'heading', level: 2, anchor: 'remove-default-settings' },
      { id: 'qZ5T0UJxvqAy', type: 'richtext', html: '<p>মার্কার/বুলেট সরাতে <code>list-style-type:none</code> প্রপার্টিও ব্যবহার করা যায়। মনে রাখবেন, লিস্টেরও ডিফল্ট margin এবং padding থাকে। এটি সরাতে, &lt;ul&gt; বা &lt;ol&gt;-এ <code>margin:0</code> এবং <code>padding:0</code> যোগ করুন:</p>' },
      { id: 'bRFBAAwfsoXB', type: 'code', language: 'css', code: 'ul {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n}' },
      { id: '0W9qV1YtJfVo', type: 'richtext', html: `<p>ডিফল্ট লিস্ট:</p>
<ul>
                                  <li>কফি</li>
                                  <li>চা</li>
                                  <li>Coca Cola</li>
                                </ul>
<p>বুলেট, margin এবং padding সরান:</p>
<ul style="list-style-type: none; margin: 0; padding: 0;">
                                  <li>কফি</li>
                                  <li>চা</li>
                                  <li>Coca Cola</li>
                                </ul>
<hr>` },
      { id: 'MaHmd5H46Xti', text: 'লিস্ট - শর্টহ্যান্ড প্রপার্টি', type: 'heading', level: 2, anchor: 'list---shorthand-property' },
      { id: 'Kl9WASAxUVfO', type: 'richtext', html: '<p><code>list-style</code> প্রপার্টি একটি শর্টহ্যান্ড প্রপার্টি। এটি এক ঘোষণায় সব লিস্ট প্রপার্টি সেট করতে ব্যবহার করা হয়:</p>' },
      { id: 'PAv5vn16l54y', type: 'code', language: 'css', code: "ul {\n  list-style: square inside url('cat.png');\n}" },
      { id: 'u5vejRTwCLvY', type: 'richtext', html: `<ul style="list-style: square inside url('assets/img/cat.png');">
                                  <li>কফি</li>
                                  <li>চা</li>
                                  <li>Coca Cola</li>
                                </ul>
<hr>
<p>শর্টহ্যান্ড প্রপার্টি ব্যবহার করার সময়, প্রপার্টি মানগুলোর ক্রম হলো:</p>
<ul>
                                    <li><code>list-style-type</code> (একটি list-style-image নির্ধারিত থাকলে, ইমেজটি কোনো কারণে প্রদর্শন না হলে এই প্রপার্টির মান প্রদর্শিত হবে)</li>
                                    <li><code>list-style-position</code> (নির্ধারণ করে লিস্ট-আইটেম মার্কার কনটেন্ট প্রবাহের ভেতরে নাকি বাইরে প্রদর্শিত হবে)</li>
                                    <li><code>list-style-image</code> (লিস্ট আইটেম মার্কার হিসেবে একটি ইমেজ নির্ধারণ করে)</li>
                                </ul>
<p>উপরের প্রপার্টি মানগুলোর কোনো একটি না থাকলে, সেই মিসিং প্রপার্টির ডিফল্ট মান (যদি থাকে) বসানো হবে।</p>
<hr>` },
      { id: 's-OTLlOfnxcd', text: 'রঙ দিয়ে লিস্ট স্টাইল করা', type: 'heading', level: 2, anchor: 'styling-list-with-colors' },
      { id: 'uJrgbEJjoiag', type: 'richtext', html: '<p>লিস্টকে একটু বেশি আকর্ষণীয় দেখাতে আমরা রঙ দিয়েও স্টাইল করতে পারি।</p>\n<p>&lt;ol&gt; বা &lt;ul&gt; ট্যাগে যা কিছু যোগ করা হয়, তা পুরো লিস্টকে প্রভাবিত করে, অন্যদিকে &lt;li&gt; ট্যাগে যোগ করা প্রপার্টি আলাদা আলাদা লিস্ট আইটেমকে প্রভাবিত করে:</p>' },
      { id: 'PQw65FBZtn__', type: 'code', language: 'css', code: 'ol {\n  background: #ff9999;\n  padding: 20px;\n}\nul {\n  background: #3399ff;\n  padding: 20px;\n}\nol li {\n  background: #ffe5e5;\n  padding: 5px;\n  margin-left: 35px;\n}\nul li {\n  background: #cce5ff;\n  margin: 5px;\n}' },
      { id: 'UlaQbqOtmTO7', type: 'richtext', html: `<ol style="  background: #ff9999; padding: 20px;">
                              <li style="background: #ffe5e5; padding: 5px; margin-left: 35px;">কফি</li>
                              <li style="background: #ffe5e5; padding: 5px; margin-left: 35px;">চা</li>
                              <li style="background: #ffe5e5; padding: 5px; margin-left: 35px;">Coca Cola</li>
                            </ol>
<ul style="background: #3399ff; padding: 20px;">
                              <li style="background: #cce5ff; margin: 5px;">কফি</li>
                              <li style="background: #cce5ff; margin: 5px;">চা</li>
                              <li style="background: #cce5ff; margin: 5px;">Coca Cola</li>
                            </ul>
<hr>` },
      { id: 'R7kwhR46jXUB', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
        ['list-style', 'এক ঘোষণায় একটি লিস্টের সব প্রপার্টি সেট করে'],
        ['list-style-image', 'লিস্ট-আইটেম মার্কার হিসেবে একটি ইমেজ নির্ধারণ করে'],
        ['list-style-position', 'লিস্ট-আইটেম মার্কারের (বুলেট পয়েন্ট) অবস্থান নির্ধারণ করে'],
        ['list-style-type', 'লিস্ট-আইটেম মার্কারের ধরন নির্ধারণ করে'],
      ] },
    ],
    toc: [
      { id: 'unordered-lists', text: 'আনঅর্ডার্ড লিস্ট:', level: 2 },
      { id: 'ordered-lists', text: 'অর্ডার্ড লিস্ট:', level: 2 },
      { id: 'html-lists-and-css-list-properties', text: 'HTML লিস্ট এবং CSS লিস্ট প্রপার্টি', level: 2 },
      { id: 'different-list-item-markers', text: 'ভিন্ন লিস্ট আইটেম মার্কার', level: 2 },
      { id: 'an-image-as-the-list-item-marker', text: 'লিস্ট আইটেম মার্কার হিসেবে একটি ইমেজ', level: 2 },
      { id: 'position-the-list-item-markers', text: 'লিস্ট আইটেম মার্কারের অবস্থান', level: 2 },
      { id: 'remove-default-settings', text: 'ডিফল্ট সেটিংস সরানো', level: 2 },
      { id: 'list---shorthand-property', text: 'লিস্ট - শর্টহ্যান্ড প্রপার্টি', level: 2 },
      { id: 'styling-list-with-colors', text: 'রঙ দিয়ে লিস্ট স্টাইল করা', level: 2 },
    ],
  },
]

let ok = 0
for (const d of docs) {
  const { error } = await supabase.from('doc_translations').upsert(
    { doc_id: d.id, locale: 'bn', title: d.title, meta_title: mt(d.title), meta_description: d.meta_description, blocks: d.blocks, toc: d.toc },
    { onConflict: 'doc_id,locale' }
  )
  if (error) { console.error(d.id, error); continue }
  ok++
}
console.log(`css batch5: ${ok}/${docs.length} written`)
