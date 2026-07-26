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
    id: '0797f366-bc1e-42cf-b3ea-ed1981f2d882', // css/dimension
    title: 'CSS ডাইমেনশন',
    meta_description: 'CSS height, width, max-width প্রপার্টি এবং তাদের সম্ভাব্য মান কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'D6PwmJyx76go', type: 'richtext', html: '<hr>\n<p style="border:1px solid #4CAF50; padding:5px;">এই এলিমেন্টের প্রস্থ 100%।</p>\n<hr>\n<p>একটি এলিমেন্টের height এবং width সেট করতে <code>height</code> এবং <code>width</code> প্রপার্টি ব্যবহার করা হয়।</p>\n<p>height এবং width প্রপার্টিতে padding, border, বা margin অন্তর্ভুক্ত থাকে না। এটি এলিমেন্টের padding, border এবং margin-এর ভেতরের এলাকার height/width সেট করে।</p>\n<hr>' },
      { id: '3CQKcH2559Ye', text: 'CSS height/width মান', type: 'heading', level: 2, anchor: 'css-heightwidth-values' },
      { id: 'qMUsWbOOrZtB', type: 'richtext', html: `<p><code>height</code> এবং <code>width</code> প্রপার্টির নিচের মানগুলো থাকতে পারে:</p>
<ul>
                                    <li><code>auto</code> - এটি ডিফল্ট। ব্রাউজার height এবং width হিসাব করে</li>
                                    <li><code>length</code> - px, cm ইত্যাদিতে height/width নির্ধারণ করে</li>
                                    <li><code>%</code> - কন্টেইনিং ব্লকের শতাংশে height/width নির্ধারণ করে</li>
                                    <li><code>initial</code> - height/width-কে এর ডিফল্ট মানে সেট করে</li>
                                    <li><code>inherit</code> - height/width তার প্যারেন্টের মান থেকে ইনহেরিট হবে</li>
                                </ul>
<hr>` },
      { id: 'Sg9zd968w2Zr', text: 'CSS height/width উদাহরণ', type: 'heading', level: 2, anchor: 'css-heightwidth-examples' },
      { id: 'FqRW6BGY8ml1', type: 'richtext', html: '<p>একটি &lt;div&gt; এলিমেন্টের height এবং width সেট করুন:</p>' },
      { id: 'wrOX2pNuUSv2', type: 'code', language: 'css', code: 'div {\n  height: 200px;\n  width: 50%;\n  background-color: powderblue;\n}' },
      { id: 'QtXLm27kzByg', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b> মনে রাখবেন যে <code>height</code> এবং <code>width</code> প্রপার্টিতে padding, border, বা margin অন্তর্ভুক্ত থাকে না! এগুলো এলিমেন্টের padding, border এবং margin-এর ভেতরের এলাকার height/width সেট করে!</p>\n<hr>' },
      { id: 'UsXbx4Jp2dcS', text: 'max-width সেট করা', type: 'heading', level: 2, anchor: 'setting-max-width' },
      { id: 'XBTy9DkykWd_', type: 'richtext', html: `<p>একটি এলিমেন্টের সর্বোচ্চ প্রস্থ সেট করতে <code>max-width</code> প্রপার্টি ব্যবহার করা হয়।</p>
<p><code>max-width</code> length মানে (যেমন px, cm ইত্যাদি) নির্ধারণ করা যায়, অথবা কন্টেইনিং ব্লকের শতাংশে (%), অথবা none সেট করা যায় (এটি ডিফল্ট। মানে কোনো সর্বোচ্চ প্রস্থ নেই)।</p>
<p>উপরের <code>&lt;div&gt;</code>-এ সমস্যা তখন হয়, যখন ব্রাউজার উইন্ডো এলিমেন্টের প্রস্থের (500px) চেয়ে ছোট হয়। তখন ব্রাউজার পেজে একটি অনুভূমিক স্ক্রলবার যোগ করে।</p>
<p>এই পরিস্থিতিতে, এর বদলে <code>max-width</code> ব্যবহার করলে ছোট উইন্ডো পরিচালনায় ব্রাউজারের কার্যক্ষমতা উন্নত হবে।</p>
<p class="note"><b>টিপস:</b> দুটি div-এর মধ্যে পার্থক্য দেখতে ব্রাউজার উইন্ডো 500px-এর কম প্রশস্ততায় টেনে আনুন!</p>
<p class="note"><b>মনে রাখবেন:</b> <code>max-width</code> প্রপার্টির মান <code>width</code>-কে ওভাররাইড করে।</p>
<p>এই &lt;div&gt; এলিমেন্টের height 100 পিক্সেল এবং max-width 500 পিক্সেল:</p>` },
      { id: 'n_lk9VpHkV0r', type: 'code', language: 'css', code: 'div {\n  max-width: 500px;\n  height: 100px;\n  background-color: powderblue;\n}' },
      { id: '8oE_WCrhd8Ms', type: 'richtext', html: '<hr>' },
      { id: 'FYn03SULHrq9', text: 'সব CSS ডাইমেনশন প্রপার্টি', type: 'heading', level: 2, anchor: 'all-css-dimension-properties' },
      { id: 'c-yi674fGfYQ', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
        ['height', 'একটি এলিমেন্টের height সেট করে'],
        ['max-height', 'একটি এলিমেন্টের সর্বোচ্চ height সেট করে'],
        ['max-width', 'একটি এলিমেন্টের সর্বোচ্চ width সেট করে'],
        ['min-height', 'একটি এলিমেন্টের সর্বনিম্ন height সেট করে'],
        ['min-width', 'একটি এলিমেন্টের সর্বনিম্ন width সেট করে'],
        ['width', 'একটি এলিমেন্টের width সেট করে'],
      ] },
    ],
    toc: [
      { id: 'css-heightwidth-values', text: 'CSS height/width মান', level: 2 },
      { id: 'css-heightwidth-examples', text: 'CSS height/width উদাহরণ', level: 2 },
      { id: 'setting-max-width', text: 'max-width সেট করা', level: 2 },
      { id: 'all-css-dimension-properties', text: 'সব CSS ডাইমেনশন প্রপার্টি', level: 2 },
    ],
  },
  {
    id: 'bb997197-565e-41c3-8605-1d6dd4c22039', // css/link
    title: 'CSS লিঙ্ক',
    meta_description: 'a:link, a:visited, a:hover, a:active দিয়ে লিঙ্ক স্টাইল করা এবং লিঙ্ককে বাটনে রূপান্তর করা শিখুন।',
    blocks: [
      { id: '2IO2TiJhSYXK', type: 'richtext', html: `<hr>
<p>CSS দিয়ে, লিঙ্ক বিভিন্নভাবে স্টাইল করা যায়।</p>
<hr>
<a href="javascript:void(0)">টেক্সট লিঙ্ক</a>
<a href="javascript:void(0)" style="color: green; text-decoration: none; margin-left: 20px; font-size: 16px;">টেক্সট লিঙ্ক</a>
<a href="javascript:void(0)" style="background-color: white; color: black; border: 2px solid #4CAF50; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin-left: 20px;">লিঙ্ক বাটন</a>
<a href="javascript:void(0)" style="display: inline-block; background-color: #f44336; color: #FFFFFF; padding: 14px 25px; text-align: center; text-decoration: none; font-size: 16px; margin-left: 20px; opacity: 0.9;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.9">লিঙ্ক বাটন</a>
<hr>` },
      { id: 'xN_UBILUyvWb', text: 'লিঙ্ক স্টাইল করা', type: 'heading', level: 2, anchor: 'styling-links' },
      { id: 'ONYbrEXthJc2', type: 'richtext', html: '<p>যেকোনো CSS প্রপার্টি দিয়ে লিঙ্ক স্টাইল করা যায় (যেমন <code>color</code>, <code>font-family</code>, <code>background</code> ইত্যাদি)।</p>' },
      { id: 'd-m625op4tcx', type: 'code', language: 'css', code: 'a {\n  color: hotpink;\n}' },
      { id: 'xP7Zfxwk3LW3', type: 'richtext', html: `<p>এছাড়াও, লিঙ্ক তার <strong>স্টেট</strong> অনুযায়ী ভিন্নভাবে স্টাইল করা যায়।</p>
<p>লিঙ্কের চারটি স্টেট হলো:</p>
<ul>
                                    <li><code>a:link</code> - একটি সাধারণ, না-দেখা লিঙ্ক</li>
                                    <li><code>a:visited</code> - ব্যবহারকারী দেখেছেন এমন একটি লিঙ্ক</li>
                                    <li><code>a:hover</code> - ব্যবহারকারী মাউস নিয়ে গেলে একটি লিঙ্ক</li>
                                    <li><code>a:active</code> - ক্লিক করার মুহূর্তে একটি লিঙ্ক</li>
                                </ul>` },
      { id: 'sgu6yBj2llHX', type: 'code', language: 'css', code: '/* না-দেখা লিঙ্ক */\na:link {\n  color: red;\n}\n/* দেখা লিঙ্ক */\na:visited {\n  color: green;\n}\n/* মাউস ওভার লিঙ্ক */\na:hover {\n  color: hotpink;\n}\n/* সিলেক্টেড লিঙ্ক */\na:active {\n  color: blue;\n}' },
      { id: '_cNF0MyL8dK4', type: 'richtext', html: `<p>একাধিক লিঙ্ক স্টেটের জন্য স্টাইল সেট করার সময়, কিছু ক্রম নিয়ম মেনে চলতে হয়:</p>
<ul>
                                    <li>a:hover অবশ্যই a:link এবং a:visited-এর পরে আসতে হবে</li>
                                    <li>a:active অবশ্যই a:hover-এর পরে আসতে হবে</li>
                                </ul>
<hr>` },
      { id: 'PZmyYoePuLBA', text: 'টেক্সট ডেকোরেশন', type: 'heading', level: 2, anchor: 'text-decoration' },
      { id: 'f_tMVfjOTnXG', type: 'richtext', html: '<p><code>text-decoration</code> প্রপার্টি বেশিরভাগ সময় লিঙ্ক থেকে আন্ডারলাইন সরাতে ব্যবহৃত হয়:</p>' },
      { id: 'dyg3XXd0VXJ6', type: 'code', language: 'css', code: 'a:link {\n  text-decoration: none;\n}\na:visited {\n  text-decoration: none;\n}\na:hover {\n  text-decoration: underline;\n}\na:active {\n  text-decoration: underline;\n}' },
      { id: '-K2_AICjgW8w', type: 'richtext', html: '<hr>' },
      { id: 'D2s3byOiGyk4', text: 'ব্যাকগ্রাউন্ড কালার', type: 'heading', level: 2, anchor: 'background-color' },
      { id: 'Q5A68EulcsBm', type: 'richtext', html: '<p>লিঙ্কের জন্য একটি ব্যাকগ্রাউন্ড কালার নির্ধারণ করতে <code>background-color</code> প্রপার্টি ব্যবহার করা যায়:</p>' },
      { id: 'i1iK57n2B4UO', type: 'code', language: 'css', code: 'a:link {\n  background-color: yellow;\n}\na:visited {\n  background-color: cyan;\n}\na:hover {\n  background-color: lightgreen;\n}\na:active {\n  background-color: hotpink;\n}' },
      { id: 'YFq0GiRRnSFc', type: 'richtext', html: '<hr>' },
      { id: '6CaIPzQEjfJR', text: 'অ্যাডভান্সড - লিঙ্ক বাটন', type: 'heading', level: 2, anchor: 'advanced---link-buttons' },
      { id: 'UgaU8n3ucbbt', type: 'richtext', html: '<p>এই উদাহরণটি আরও অ্যাডভান্সড একটি উদাহরণ দেখায়, যেখানে আমরা লিঙ্ককে বক্স/বাটন হিসেবে দেখাতে একাধিক CSS প্রপার্টি একত্রে ব্যবহার করি:</p>' },
      { id: 'W6ZiyWoLfXr6', type: 'code', language: 'css', code: 'a:link, a:visited {\n  background-color: #f44336;\n  color: white;\n  padding: 14px 25px;\n  text-align: center; \n  text-decoration: none;\n  display: inline-block;\n}\na:hover, a:active {\n  background-color: red;\n}' },
    ],
    toc: [
      { id: 'styling-links', text: 'লিঙ্ক স্টাইল করা', level: 2 },
      { id: 'text-decoration', text: 'টেক্সট ডেকোরেশন', level: 2 },
      { id: 'background-color', text: 'ব্যাকগ্রাউন্ড কালার', level: 2 },
      { id: 'advanced---link-buttons', text: 'অ্যাডভান্সড - লিঙ্ক বাটন', level: 2 },
    ],
  },
  {
    id: '7fa19a76-8806-48d5-bc8c-77dc912e1a5e', // css/navbar
    title: 'CSS নেভবার',
    meta_description: 'CSS দিয়ে উল্লম্ব ও অনুভূমিক নেভিগেশন বার তৈরি করার সম্পূর্ণ পদ্ধতি জানুন।',
    blocks: [
      { id: 'lQyMvVjML8b1', type: 'richtext', html: '<hr>' },
      { id: 'GFrKDPkkQ8XR', text: 'ডেমো: নেভিগেশন বার', type: 'heading', level: 2, anchor: 'demo-navigation-bars' },
      { id: 'Ksn8Jjt0_oJH', type: 'richtext', html: `<p>উল্লম্ব</p>
<ul class="vertical ex">
                                          <li><a class="active" href="javascript:void(0)">হোম</a></li>
                                          <li><a href="javascript:void(0)">খবর</a></li>
                                          <li><a href="javascript:void(0)">যোগাযোগ</a></li>
                                          <li><a href="javascript:void(0)">সম্পর্কে</a></li>
                                        </ul>
<p>অনুভূমিক</p>
<ul class="horizontal">
                                          <li><a class="active" href="javascript:void(0)">হোম</a></li>
                                          <li><a href="javascript:void(0)">খবর</a></li>
                                          <li><a href="javascript:void(0)">যোগাযোগ</a></li>
                                          <li class="rightli" style="float:right"><a href="javascript:void(0)">সম্পর্কে</a></li>
                                        </ul>
<br>
<ul class="horizontal gray">
                                          <li><a href="javascript:void(0)">হোম</a></li>
                                          <li><a href="javascript:void(0)">খবর</a></li>
                                          <li><a class="active" href="javascript:void(0)">যোগাযোগ</a></li>
                                          <li class="rightli" style="float:right"><a href="javascript:void(0)">সম্পর্কে</a></li>
                                        </ul>
<hr>` },
      { id: 'dS0aZdN06Ip2', text: 'নেভিগেশন বার', type: 'heading', level: 2, anchor: 'navigation-bars' },
      { id: '-9qIN1fNrQBX', type: 'richtext', html: '<p>যেকোনো ওয়েবসাইটের জন্য সহজে ব্যবহারযোগ্য নেভিগেশন থাকা গুরুত্বপূর্ণ।</p>\n<p>CSS দিয়ে আপনি একঘেয়ে HTML মেনুকে সুন্দর দেখতে নেভিগেশন বারে রূপান্তরিত করতে পারেন।</p>\n<hr>' },
      { id: 'e388jHIXDWGv', text: 'নেভিগেশন বার = লিঙ্কের একটি লিস্ট', type: 'heading', level: 2, anchor: 'navigation-bar-list-of-links' },
      { id: '_dk4Vk4uOLHh', type: 'richtext', html: '<p>একটি নেভিগেশন বারের ভিত্তি হিসেবে স্ট্যান্ডার্ড HTML প্রয়োজন।</p>\n<p>আমাদের উদাহরণে আমরা একটি স্ট্যান্ডার্ড HTML লিস্ট থেকে নেভিগেশন বার তৈরি করব।</p>\n<p>একটি নেভিগেশন বার মূলত লিঙ্কের একটি লিস্ট, তাই &lt;ul&gt; এবং &lt;li&gt; এলিমেন্ট ব্যবহার করা যুক্তিসঙ্গত:</p>' },
      { id: 'AigSUkkIWsnF', type: 'code', language: 'html', code: '<ul>\n  <li><a href="default.html">Home</a></li>\n  <li><a href="news.html">News</a></li>\n  <li><a href="contact.html">Contact</a></li>\n  <li><a href="about.html">About</a></li>\n</ul>' },
      { id: 'vZTC11ZF00Zs', type: 'richtext', html: '<p>এখন লিস্ট থেকে বুলেট এবং margin ও padding সরিয়ে ফেলি:</p>' },
      { id: '1LDVgBzD9kGu', type: 'code', language: 'css', code: 'ul {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n}' },
      { id: 'QGqtvEJ7mu4l', type: 'richtext', html: `<p>উদাহরণের ব্যাখ্যা:</p>
<ul>
                                    <li><code class="w3-codespan">list-style-type: none;</code> - বুলেট সরিয়ে দেয়। একটি নেভিগেশন বারের
                                    লিস্ট মার্কারের প্রয়োজন নেই</li>
                                    <li>ব্রাউজারের ডিফল্ট সেটিংস সরাতে <code class="w3-codespan">margin: 0;</code> এবং <code class="w3-codespan">padding: 0;</code>
                                    সেট করুন</li>
                                </ul>
<p>উপরের উদাহরণের কোডটি উল্লম্ব এবং অনুভূমিক — দুই ধরনের নেভিগেশন বারেই ব্যবহৃত স্ট্যান্ডার্ড কোড।</p>
<hr>` },
      { id: 'jfr_54lYqN-5', text: 'উল্লম্ব নেভিগেশন বার', type: 'heading', level: 2, anchor: 'vertical-navigation-bar' },
      { id: 'mIQMCAntm8Tx', type: 'richtext', html: '<p>একটি উল্লম্ব নেভিগেশন বার তৈরি করতে, উপরের কোডের পাশাপাশি আপনি লিস্টের ভেতরের &lt;a&gt; এলিমেন্টগুলো স্টাইল করতে পারেন:</p>' },
      { id: '1Ma92-ijUwig', type: 'code', language: 'css', code: 'li a {\n  display: block;\n  width: 60px;\n}' },
      { id: 'b3zariRZGHDz', type: 'richtext', html: `<p>উদাহরণের ব্যাখ্যা:</p>
<ul>
                                    <li><code class="w3-codespan">display: block;</code> - লিঙ্কগুলোকে ব্লক এলিমেন্ট হিসেবে প্রদর্শন করলে পুরো লিঙ্ক এরিয়া ক্লিকযোগ্য হয়ে যায় (শুধু টেক্সট নয়), এবং এটি আমাদের width
                                    (এবং চাইলে padding, margin, height ইত্যাদি) নির্ধারণ করার সুযোগ দেয়</li>
                                    <li><code class="w3-codespan">width: 60px;</code> - ব্লক এলিমেন্ট ডিফল্টভাবে পুরো প্রশস্ততা দখল করে। আমরা একটি 60 পিক্সেল প্রশস্ততা নির্ধারণ করতে চাই</li>
                                </ul>
<p>আপনি &lt;ul&gt;-এর width সেট করে &lt;a&gt;-এর width বাদ দিতে পারেন, কারণ ব্লক এলিমেন্ট হিসেবে প্রদর্শিত হলে সেগুলো পুরো প্রশস্ততা দখল করবে। এটি আমাদের আগের উদাহরণের মতোই ফলাফল দেবে:</p>` },
      { id: 'ksJ56ftUhaxk', type: 'code', language: 'css', code: 'ul {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n  width: 60px;\n} \nli a {\n  display: block;\n}' },
    ],
    toc: [
      { id: 'demo-navigation-bars', text: 'ডেমো: নেভিগেশন বার', level: 2 },
      { id: 'navigation-bars', text: 'নেভিগেশন বার', level: 2 },
      { id: 'navigation-bar-list-of-links', text: 'নেভিগেশন বার = লিঙ্কের একটি লিস্ট', level: 2 },
      { id: 'vertical-navigation-bar', text: 'উল্লম্ব নেভিগেশন বার', level: 2 },
    ],
  },
  {
    id: 'ac8aae47-d4e2-4450-b514-b50e9216801f', // css/specificity
    title: 'CSS স্পেসিফিসিটি',
    meta_description: 'CSS স্পেসিফিসিটি কী, কীভাবে হিসাব করবেন এবং কোন নিয়ম কোনটির চেয়ে বেশি গুরুত্বপূর্ণ তা জানুন।',
    blocks: [
      { id: 'E4WRkRUrdd2g', type: 'richtext', html: '<hr>' },
      { id: 'AuVECgSdb54R', text: 'স্পেসিফিসিটি কী?', type: 'heading', level: 2, anchor: 'what-is-specificity' },
      { id: 'bwPcFvtjiqu9', type: 'richtext', html: `<p>একই এলিমেন্টের দিকে নির্দেশ করা দুই বা ততোধিক পরস্পরবিরোধী CSS নিয়ম থাকলে, ব্রাউজার কিছু নিয়ম মেনে ঠিক করে কোনটি সবচেয়ে নির্দিষ্ট এবং তাই জিতবে।</p>
<p>স্পেসিফিসিটিকে একটি স্কোর/র‍্যাঙ্ক হিসেবে চিন্তা করুন, যা ঠিক করে কোন স্টাইল ঘোষণা শেষ পর্যন্ত একটি এলিমেন্টে প্রয়োগ হবে।</p>
<p>ইউনিভার্সাল সিলেক্টরের (*) স্পেসিফিসিটি কম, অন্যদিকে ID সিলেক্টর অত্যন্ত নির্দিষ্ট!&nbsp;</p>
<p class="note"><strong>মনে রাখবেন:</strong> কিছু এলিমেন্টে আপনার CSS-নিয়ম প্রয়োগ না হওয়ার একটি সাধারণ কারণ হলো স্পেসিফিসিটি, যদিও আপনি ভাবেন সেগুলো প্রয়োগ হওয়া উচিত।</p>
<hr>` },
      { id: 'FLxSElslNmey', text: 'স্পেসিফিসিটি হায়ারার্কি', type: 'heading', level: 2, anchor: 'specificity-hierarchy' },
      { id: '1CqoDC38CaRY', type: 'richtext', html: `<p>প্রতিটি সিলেক্টরের স্পেসিফিসিটি হায়ারার্কিতে তার নিজস্ব স্থান আছে। একটি সিলেক্টরের স্পেসিফিসিটি লেভেল নির্ধারণ করে এমন চারটি ক্যাটাগরি রয়েছে:</p>
<p><strong>ইনলাইন স্টাইল</strong> - একটি ইনলাইন স্টাইল সরাসরি স্টাইল করা এলিমেন্টের সাথে যুক্ত থাকে। উদাহরণ: &lt;h1 style="color: #ffffff;"&gt;।</p>
<p><strong>ID</strong> - একটি ID হলো পেজের এলিমেন্টের জন্য একটি ইউনিক আইডেন্টিফায়ার, যেমন #navbar।</p>
<p><strong>ক্লাস, অ্যাট্রিবিউট এবং সিউডো-ক্লাস</strong> - এই ক্যাটাগরিতে থাকে .class, [attribute] এবং :hover, :focus-এর মতো সিউডো-ক্লাস।</p>
<p><strong>এলিমেন্ট এবং সিউডো-এলিমেন্ট</strong> - এই ক্যাটাগরিতে থাকে এলিমেন্টের নাম এবং সিউডো-এলিমেন্ট, যেমন h1, div, :before এবং :after।</p>
<hr>` },
      { id: 'UgJSiJ4EVtXJ', text: 'স্পেসিফিসিটি কীভাবে হিসাব করবেন?', type: 'heading', level: 2, anchor: 'how-to-calculate-specificity' },
      { id: 'kkevD5PeaYul', type: 'richtext', html: '<p>স্পেসিফিসিটি কীভাবে হিসাব করতে হয় তা মুখস্থ করে নিন!</p>\n<p>0 থেকে শুরু করুন, style অ্যাট্রিবিউটের জন্য 1000 যোগ করুন, প্রতিটি ID-এর জন্য 100 যোগ করুন, প্রতিটি attribute, class বা pseudo-class-এর জন্য 10 যোগ করুন, প্রতিটি এলিমেন্টের নাম বা pseudo-element-এর জন্য 1 যোগ করুন।</p>\n<p>এই তিনটি কোড অংশ বিবেচনা করুন:</p>' },
      { id: 'J5QVD2HZS5IU', type: 'code', language: 'html', code: 'A: h1\nB: #content h1\nC: <div id="content"><h1 style="color: #ffffff">Heading</h1></div>' },
      { id: 'JoHyB5Fo7Ly2', type: 'richtext', html: '<p>A-এর স্পেসিফিসিটি হলো 1 (একটি এলিমেন্ট)<br>B-এর স্পেসিফিসিটি হলো 101 (একটি ID রেফারেন্স এবং একটি এলিমেন্ট)<br>C-এর স্পেসিফিসিটি হলো 1000 (ইনলাইন স্টাইলিং)</p>\n<p>যেহেতু 1 &lt; 101 &lt; 1000, তৃতীয় নিয়মটির (C) স্পেসিফিসিটি লেভেল বেশি, তাই এটিই প্রয়োগ হবে।</p>\n<hr>' },
      { id: 'UzeikahrrRp6', text: 'স্পেসিফিসিটি নিয়ম', type: 'heading', level: 2, anchor: 'specificity-rules' },
      { id: '6G8CnEG3L3ZZ', type: 'richtext', html: '<p><strong>সমান স্পেসিফিসিটি: সর্বশেষ নিয়মটিই গণ্য হয় </strong>- একই নিয়ম যদি বাইরের স্টাইল শিটে দুইবার লেখা হয়, তাহলে স্টাইল শিটে নিচের নিয়মটি স্টাইল করা এলিমেন্টের কাছাকাছি থাকে, তাই সেটিই প্রয়োগ হবে:</p>' },
      { id: 'Obi41zaY1vbG', type: 'code', language: 'css', code: 'h1 {background-color: yellow;}\nh1 {background-color: red;}' },
      { id: 'spPtiuhag_u3', type: 'richtext', html: '<p><b>পরের নিয়মটিই</b> সবসময় প্রয়োগ হয়।</p>\n<hr>\n<p><b>Attribute সিলেক্টরের চেয়ে ID সিলেক্টরের স্পেসিফিসিটি বেশি - নিচের তিনটি কোড লাইন দেখুন:</b></p>' },
      { id: 'NqeY3xESI5Nr', type: 'code', language: 'css', code: 'div#a {background-color: green;}\n#a {background-color: yellow;}\ndiv[id=a] {background-color: blue;}' },
      { id: 'DdDH1NYAYOHv', type: 'richtext', html: '<p><b>প্রথম নিয়মটি</b> বাকি দুটোর চেয়ে বেশি নির্দিষ্ট, এবং এটিই প্রয়োগ হবে।</p>\n<hr>\n<p><b>একটি একক এলিমেন্ট সিলেক্টরের চেয়ে কনটেক্সচুয়াল সিলেক্টরের স্পেসিফিসিটি বেশি</b> - এমবেডেড স্টাইল শিট স্টাইল করা এলিমেন্টের কাছাকাছি থাকে। তাই নিচের পরিস্থিতিতে</p>' },
      { id: 'KAO6PiLXelNV', type: 'code', language: 'html', code: 'From external CSS file:\n#content h1 {background-color: red;}\n\nIn HTML file:\n<style>\n    #content h1 {\n      background-color: yellow;\n    }\n</style>' },
      { id: '7o5v8RShx-UQ', type: 'richtext', html: '<p>পরের নিয়মটি প্রয়োগ হবে।</p>\n<hr>\n<p><b>একটি class সিলেক্টর যেকোনো সংখ্যক element সিলেক্টরকে হারায়</b> - .intro-এর মতো একটি class সিলেক্টর h1, p, div ইত্যাদিকে হারায়:</p>' },
      { id: 'uFmmpSd5Ih0_', type: 'code', language: 'css', code: '.intro {background-color: yellow;}\nh1 {background-color: red;}' },
      { id: '7nKZHpya75zT', type: 'richtext', html: '<p><b>ইউনিভার্সাল সিলেক্টর এবং ইনহেরিটেড মানের স্পেসিফিসিটি 0</b> - *, body * এবং এরকম সিলেক্টরের স্পেসিফিসিটি শূন্য। ইনহেরিটেড মানেরও স্পেসিফিসিটি 0।</p>' },
    ],
    toc: [
      { id: 'what-is-specificity', text: 'স্পেসিফিসিটি কী?', level: 2 },
      { id: 'specificity-hierarchy', text: 'স্পেসিফিসিটি হায়ারার্কি', level: 2 },
      { id: 'how-to-calculate-specificity', text: 'স্পেসিফিসিটি কীভাবে হিসাব করবেন?', level: 2 },
      { id: 'specificity-rules', text: 'স্পেসিফিসিটি নিয়ম', level: 2 },
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
console.log(`css batch2: ${ok}/${docs.length} written`)
