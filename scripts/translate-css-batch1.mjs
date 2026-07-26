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
    id: '2e75719c-831e-4e68-949e-2266cf78bde5', // css/bootstrap
    title: 'Bootstrap',
    meta_description: 'Bootstrap কী এবং কেন এটি বিশ্বের সবচেয়ে জনপ্রিয় ফ্রন্ট-এন্ড কম্পোনেন্ট লাইব্রেরি তা জানুন।',
    blocks: [
      { id: 'JqzIY5yesBVM', text: 'Bootstrap', type: 'heading', level: 2, anchor: 'bootstrap' },
      { id: 'JVkDaT2xaUvn', type: 'richtext', html: '<p>বিশ্বের সবচেয়ে জনপ্রিয় ফ্রন্ট-এন্ড কম্পোনেন্ট লাইব্রেরি দিয়ে ওয়েবে রেসপনসিভ, মোবাইল-ফার্স্ট প্রজেক্ট তৈরি করুন।</p>\n<p>Bootstrap হলো HTML, CSS এবং JS দিয়ে ডেভেলপ করার একটি ওপেন সোর্স টুলকিট। আমাদের Sass ভেরিয়েবল ও মিক্সিন, রেসপনসিভ গ্রিড সিস্টেম, বিস্তৃত প্রি-বিল্ট কম্পোনেন্ট, এবং jQuery-এর উপর তৈরি শক্তিশালী প্লাগইন দিয়ে দ্রুত আপনার আইডিয়ার প্রোটোটাইপ তৈরি করুন বা পুরো অ্যাপ তৈরি করুন।</p>\n<p class="note"><b>মনে রাখবেন:</b> আমরা বাম মেনুতে দেওয়া ক্রম অনুযায়ী <a href="https://getbootstrap.com/" target="_blank">এই টিউটোরিয়ালটি</a> পড়ার পরামর্শ দিই। সব উদাহরণ চেষ্টা করলে, খুব অল্প সময়ে আপনি Bootstrap সম্পর্কে অনেক কিছু শিখে যাবেন!</p>' },
    ],
    toc: [{ id: 'bootstrap', text: 'Bootstrap', level: 2 }],
  },
  {
    id: '74acf7f3-a15c-451e-95f2-76f6f914b6e9', // css/boxmodel
    title: 'CSS বক্স মডেল',
    meta_description: 'CSS বক্স মডেল কী, margin, border, padding এবং কনটেন্ট কীভাবে একটি এলিমেন্টের মোট আকার তৈরি করে তা জানুন।',
    blocks: [
      { id: '2TBmaRKSvzWs', type: 'richtext', html: '<hr>' },
      { id: '9r4KhBtmz-hH', text: 'CSS বক্স মডেল', type: 'heading', level: 2, anchor: 'the-css-box-model' },
      { id: 'ol1vOfcKg98f', type: 'richtext', html: `<p>সব HTML এলিমেন্টকে বক্স হিসেবে বিবেচনা করা যায়। CSS-এ, ডিজাইন এবং লেআউট নিয়ে আলোচনার সময় "বক্স মডেল" শব্দটি ব্যবহার করা হয়।</p>
<p>CSS বক্স মডেল মূলত এমন একটি বক্স, যা প্রতিটি HTML এলিমেন্টকে ঘিরে রাখে। এতে থাকে: মার্জিন, বর্ডার, প্যাডিং এবং প্রকৃত কনটেন্ট। নিচের ছবিতে বক্স মডেল দেখানো হয়েছে:</p>
<div class="img-block">
                                    <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960207/img/boxmodel.webp" alt="boxmodel" class="img-fluid">
                                </div>
<p>বিভিন্ন অংশের ব্যাখ্যা:</p>
<ul>
                                    <li><b>কনটেন্ট</b> - বক্সের কনটেন্ট, যেখানে টেক্সট ও ইমেজ থাকে</li>
                                    <li><b>প্যাডিং</b> - কনটেন্টের চারপাশে একটি এলাকা পরিষ্কার রাখে। প্যাডিং স্বচ্ছ</li>
                                    <li><b>বর্ডার</b> - প্যাডিং ও কনটেন্টের চারপাশে থাকা একটি বর্ডার</li>
                                    <li><b>মার্জিন</b> - বর্ডারের বাইরে একটি এলাকা পরিষ্কার রাখে। মার্জিন স্বচ্ছ</li>
                                </ul>
<p>বক্স মডেল আমাদের এলিমেন্টের চারপাশে বর্ডার যোগ করতে, এবং এলিমেন্টগুলোর মধ্যে জায়গা নির্ধারণ করতে সাহায্য করে।</p>
<p>বক্স মডেলের একটি প্রদর্শনী:</p>` },
      { id: 'x1w5dxyQYGEj', type: 'code', language: 'css', code: 'div {\n  width: 300px;\n  border: 15px solid green;\n  padding: 50px;\n  margin: 20px;\n}' },
      { id: 'FRhV3HMsJxrc', type: 'richtext', html: '<hr>' },
      { id: 'd8234PGvkwC7', text: 'একটি এলিমেন্টের প্রস্থ ও উচ্চতা', type: 'heading', level: 2, anchor: 'width-and-height-of-an-element' },
      { id: 'FIr-tJuDWHCz', type: 'richtext', html: '<p>সব ব্রাউজারে একটি এলিমেন্টের প্রস্থ ও উচ্চতা সঠিকভাবে সেট করতে, বক্স মডেল কীভাবে কাজ করে তা জানা প্রয়োজন।</p>\n<p class="note"><b>গুরুত্বপূর্ণ:</b> CSS দিয়ে একটি এলিমেন্টের width এবং height প্রপার্টি সেট করলে, আপনি শুধু <b>কনটেন্ট এরিয়ার</b> প্রস্থ ও উচ্চতা সেট করছেন। একটি এলিমেন্টের সম্পূর্ণ আকার হিসাব করতে, আপনাকে প্যাডিং, বর্ডার এবং মার্জিনও যোগ করতে হবে।</p>\n<p>এই &lt;div&gt; এলিমেন্টের মোট প্রস্থ হবে 350px: </p>' },
      { id: 'D7kKCQjbrPiC', type: 'code', language: 'css', code: 'div {\n  width: 320px;\n  padding: 10px;\n  border: 5px solid gray;\n  margin: 0; \n}' },
      { id: 'Iqjohqm2hwPh', type: 'richtext', html: '<p>এখানে হিসাবটি দেওয়া হলো:</p>' },
      { id: 's16x67usPUAb', type: 'code', language: 'css', code: '320px (width)\n+ 20px (left + right padding)\n+ 10px (left + right border)\n+ 0px (left + right margin)\n= 350px' },
      { id: 'Pcjuetv0vlgl', type: 'richtext', html: '<p>একটি এলিমেন্টের মোট প্রস্থ এভাবে হিসাব করতে হয়:</p>\n<p>মোট এলিমেন্ট প্রস্থ = width + বাম padding + ডান padding + বাম border + ডান border + বাম margin + ডান margin</p>\n<p>একটি এলিমেন্টের মোট উচ্চতা এভাবে হিসাব করতে হয়:</p>\n<p>মোট এলিমেন্ট উচ্চতা = height + উপরের padding + নিচের padding + উপরের border + নিচের border + উপরের margin + নিচের margin</p>' },
    ],
    toc: [
      { id: 'the-css-box-model', text: 'CSS বক্স মডেল', level: 2 },
      { id: 'width-and-height-of-an-element', text: 'একটি এলিমেন্টের প্রস্থ ও উচ্চতা', level: 2 },
    ],
  },
  {
    id: '40bd0c4a-07d9-486e-94c6-19855a440326', // css/dropdowns
    title: 'CSS ড্রপডাউন',
    meta_description: 'CSS দিয়ে হোভারযোগ্য ড্রপডাউন মেনু এবং ড্রপডাউন কনটেন্ট কীভাবে তৈরি করবেন তার উদাহরণ।',
    blocks: [
      { id: 'iBBDuzKPWJPu', type: 'richtext', html: '<hr>\n<p>CSS দিয়ে একটি হোভারযোগ্য ড্রপডাউন তৈরি করুন।</p>\n<hr>' },
      { id: 'yCHHz6zZDY8F', text: 'ডেমো: ড্রপডাউনের উদাহরণ', type: 'heading', level: 2, anchor: 'demo-dropdown-examples' },
      { id: 'JqImgAESHwOj', type: 'richtext', html: `<p>নিচের উদাহরণগুলোর উপর মাউস নিয়ে যান:</p>
<div class="dropdown dropdown2" style="position:relative;top:15px;display: inline-block;">
                                          <span class="dropspan">ড্রপডাউন টেক্সট</span>
                                          <div class="dropdown-content" style="padding:8px 16px;min-width:150px;text-align:center">
                                            <p>Hello World!</p>
                                          </div>
                                        </div>
<div class="dropdown dropdown2">
                                          <button class="btn btn-primary">ড্রপডাউন মেনু</button>
                                          <div class="dropdown-content dropdown-content2">
                                            <a href="javascript:void(0)">লিঙ্ক 1</a>
                                            <a href="javascript:void(0)">লিঙ্ক 2</a>
                                            <a href="javascript:void(0)">লিঙ্ক 3</a>
                                          </div>
                                        </div>
<div class="dropdown dropdown2">
                                        <span style="position:relative;bottom:15px;">অন্যান্য: </span><img class="dropimg" src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960389/img/img_5terre.webp" alt="Cinque Terre">
                                          <div class="dropdown-content right">
                                            <div class="img">
                                                <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960389/img/img_5terre.webp" alt="Cinque Terre">
                                                <div style="padding:15px;text-align:center;">সুন্দর চিনকুয়ে টেরে</div>
                                            </div>
                                            </div>
                                        </div>` },
    ],
    toc: [{ id: 'demo-dropdown-examples', text: 'ডেমো: ড্রপডাউনের উদাহরণ', level: 2 }],
  },
  {
    id: '3aba60f3-9aef-4baa-8b67-c6dc427f9088', // css/icons
    title: 'CSS আইকন',
    meta_description: 'Font Awesome এবং Google আইকন লাইব্রেরি HTML পেজে কীভাবে যোগ করবেন তা জানুন।',
    blocks: [
      { id: '_9bk3JWGOKC8', type: 'richtext', html: `<hr>
<div style="text-align: center;" class="d-flex justify-content-around">
                                    <div class="w3-third">
                                        <i class="fa fa-cloud" style="font-size:36px;"></i>
                                        <i class="fa fa-cloud" style="font-size:60px; color: #888"></i>
                                        <i class="fa fa-cloud" style="font-size:72px; color: #0054D1;"></i>
                                    </div>
                                    <div class="w3-third">
                                        <i class="fa fa-car" style="font-size:36px;"></i>
                                        <i class="fa fa-car" style="font-size:60px; color: #888"></i>
                                        <i class="fa fa-car" style="font-size:72px; color: #0054D1;"></i>
                                    </div>
                                    <div class="w3-third">
                                        <i class="fab fa-earlybirds" style="font-size:36px;"></i>
                                        <i class="fab fa-earlybirds" style="font-size:60px; color: #888"></i>
                                        <i class="fab fa-earlybirds" style="font-size:72px; color: #0054D1;"></i>
                                    </div>
                                </div>
<hr>` },
      { id: 'OV6RJw9thIFi', text: 'কীভাবে আইকন যোগ করবেন', type: 'heading', level: 2, anchor: 'how-to-add-icons' },
      { id: '7oSmh-2GXUMg', type: 'richtext', html: `<p>আপনার HTML পেজে আইকন যোগ করার সবচেয়ে সহজ উপায় হলো Font Awesome-এর মতো একটি আইকন লাইব্রেরি ব্যবহার করা।</p>
<p>নির্দিষ্ট আইকন ক্লাসের নাম যেকোনো ইনলাইন HTML এলিমেন্টে (যেমন <code>&lt;i&gt;</code> বা
                                <code>&lt;span&gt;</code>) যোগ করুন।</p>
<p>নিচের আইকন লাইব্রেরিগুলোর সব আইকন হলো স্কেলযোগ্য ভেক্টর, যা CSS দিয়ে কাস্টমাইজ করা যায় (আকার, রঙ, শ্যাডো ইত্যাদি)।</p>
<hr>` },
      { id: 'pyuhqi8weGb9', text: 'Font Awesome আইকন', type: 'heading', level: 2, anchor: 'font-awesome-icons' },
      { id: 'Gb74m0PAChrg', type: 'richtext', html: `<p>Font Awesome আইকন ব্যবহার করতে, <a href="https://fontawesome.com">fontawesome.com</a>-এ যান, সাইন ইন করুন, এবং আপনার HTML পেজের <code>&lt;head&gt;</code> সেকশনে যোগ করার জন্য একটি কোড সংগ্রহ করুন:</p>
<p><code class="w3-codespan">&lt;script src="https://kit.fontawesome.com/<em>yourcode</em>.js"&gt;&lt;/script&gt;</code></p>
<p>W3Schools-এ Font Awesome দিয়ে কীভাবে শুরু করবেন সে সম্পর্কে আরও পড়ুন -
                                <a href="https://www.w3schools.com/icons/fontawesome5_intro.asp">Font Awesome 5 টিউটোরিয়াল</a>।</p>
<p><b>মনে রাখবেন:</b> কোনো ডাউনলোড বা ইনস্টলেশনের প্রয়োজন নেই!</p>` },
      { id: 'WzUBNW5VM1uD', type: 'code', language: 'html', code: '<!DOCTYPE html>\n<html>\n    <head>\n        <script src="https://kit.fontawesome.com/a076d05399.js">\n    </head>\n\n    <body>\n        <i class="fas fa-cloud">\n        <i class="fas fa-heart">\n        <i class="fas fa-car">\n        <i class="fas fa-file">\n        <i class="fas fa-bars">\n    </body>\n</html>' },
      { id: '-bkS7ycBTtiw', type: 'richtext', html: '<hr>' },
      { id: 'zTLS0kHl_-RJ', text: 'Google আইকন', type: 'heading', level: 2, anchor: 'google-icons' },
      { id: 'vv35MYCt2TWy', type: 'richtext', html: '<p>Google আইকন ব্যবহার করতে, আপনার HTML পেজের <code>&lt;head&gt;</code> সেকশনের ভেতরে নিচের লাইনটি যোগ করুন:</p>\n<p><code>&lt;link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"&gt;</code></p>\n<p><b>মনে রাখবেন:</b> কোনো ডাউনলোড বা ইনস্টলেশনের প্রয়োজন নেই!</p>' },
      { id: 'iBgu2bhDtjnh', type: 'code', language: 'html', code: '<!DOCTYPE html>\n<html>\n    <head>\n        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">\n    </head>\n\n    <body>\n        <i class="material-icons">cloud\n        <i class="material-icons">favorite\n        <i class="material-icons">attachment\n        <i class="material-icons">computer\n        <i class="material-icons">traffic\n    </body>\n</html>' },
    ],
    toc: [
      { id: 'how-to-add-icons', text: 'কীভাবে আইকন যোগ করবেন', level: 2 },
      { id: 'font-awesome-icons', text: 'Font Awesome আইকন', level: 2 },
      { id: 'google-icons', text: 'Google আইকন', level: 2 },
    ],
  },
  {
    id: 'ab07e4cc-b7c4-48a9-aeff-07769bb0a895', // css/inline-block
    title: 'CSS লেআউট',
    meta_description: 'display: inline-block কীভাবে inline ও block থেকে আলাদা, এবং এটি দিয়ে অনুভূমিক নেভিগেশন লিঙ্ক তৈরি করা শিখুন।',
    blocks: [
      { id: 'k0cPtUxONT0G', type: 'richtext', html: '<hr>' },
      { id: 'zUIro2huZL1V', text: 'display: inline-block মান', type: 'heading', level: 2, anchor: 'the-display-inline-block-value' },
      { id: 'doDJR68ounI0', type: 'richtext', html: `<p><code>display: inline</code>-এর তুলনায়, প্রধান পার্থক্য হলো <code>display: inline-block</code> এলিমেন্টে width এবং height সেট করার সুযোগ দেয়।</p>
<p>এছাড়াও, <code>display: inline-block</code>-এ, উপরে ও নিচের margin/padding মান্য করা হয়, কিন্তু <code>display: inline</code>-এ তা হয় না।</p>
<p><code>display: block</code>-এর তুলনায়, প্রধান পার্থক্য হলো <code>display: inline-block</code> এলিমেন্টের পরে লাইন-ব্রেক যোগ করে না, তাই এলিমেন্টটি অন্য এলিমেন্টের পাশে বসতে পারে।</p>
<p>নিচের উদাহরণে <code>display: inline</code>, <code>display: inline-block</code>
                                এবং <code>display: block</code>-এর ভিন্ন ভিন্ন আচরণ দেখানো হয়েছে:</p>` },
      { id: 'pKUSMoiw2hdY', type: 'code', language: 'css', code: 'span.a {\n  display: inline; /* span-এর জন্য ডিফল্ট */\n  width: 100px;\n  height: 100px;\n  padding: 5px;\n  border: 1px solid blue; \n  background-color: yellow; \n}\nspan.b {\n  display: inline-block;\n  width: 100px;\n  height: 100px;\n  padding: 5px;\n  border: 1px solid blue; \n  background-color: yellow; \n}\nspan.c {\n  display: block;\n  width: 100px;\n  height: 100px;\n  padding: 5px;\n  border: 1px solid blue; \n  background-color: yellow; \n}' },
      { id: 'Pw1raTlOq2wo', type: 'richtext', html: '<hr>' },
      { id: 'KnPtGGEVvXyo', text: 'নেভিগেশন লিঙ্ক তৈরিতে inline-block ব্যবহার', type: 'heading', level: 2, anchor: 'using-inline-block-to-create-navigation-links' },
      { id: 'fdqdKvl9-tpE', type: 'richtext', html: '<p><code>display: inline-block</code>-এর একটি সাধারণ ব্যবহার হলো লিস্ট আইটেমগুলোকে উল্লম্বভাবে না দেখিয়ে অনুভূমিকভাবে দেখানো। নিচের উদাহরণে অনুভূমিক নেভিগেশন লিঙ্ক তৈরি করা হয়েছে:</p>' },
      { id: 'T4DGAbGBvww8', type: 'code', language: 'css', code: '.nav {\n  background-color: yellow; \n  list-style-type: none;\n  text-align: center; \n  padding: 0;\n  margin: 0;\n}\n.nav li {\n  display: inline-block;\n  font-size: 20px;\n  padding: 20px;\n}' },
      { id: 'mhnoL0KEF39F', type: 'richtext', html: `<p>ডিফল্টভাবে, লিস্ট আইটেমগুলো উল্লম্বভাবে প্রদর্শিত হয়। এই উদাহরণে আমরা সেগুলো অনুভূমিকভাবে (পাশাপাশি) দেখাতে display: inline-block ব্যবহার করেছি।</p>
<p>মনে রাখবেন: ব্রাউজার উইন্ডো রিসাইজ করলে, বেশি সংকুচিত হয়ে গেলে লিঙ্কগুলো স্বয়ংক্রিয়ভাবে ভেঙে যাবে।</p>
<ul class="navi">
                              <li><a href="#home">হোম</a></li>
                              <li><a href="#about">আমাদের সম্পর্কে</a></li>
                              <li><a href="#clients">আমাদের ক্লায়েন্ট</a></li>
                              <li><a href="#contact">যোগাযোগ করুন</a></li>
                            </ul>` },
    ],
    toc: [
      { id: 'the-display-inline-block-value', text: 'display: inline-block মান', level: 2 },
      { id: 'using-inline-block-to-create-navigation-links', text: 'নেভিগেশন লিঙ্ক তৈরিতে inline-block ব্যবহার', level: 2 },
    ],
  },
  {
    id: 'e68cf15a-fc01-44c5-ba93-0c5a80a80204', // css/max-width
    title: 'CSS Max-width',
    meta_description: 'width, max-width এবং margin: auto দিয়ে ব্লক-লেভেল এলিমেন্ট কেন্দ্রীভূত ও রেসপনসিভ করা শিখুন।',
    blocks: [
      { id: '6KQEmkSr0q-3', type: 'richtext', html: '<hr>' },
      { id: '200FfTbGOAy9', text: 'width, max-width এবং margin: auto; ব্যবহার করা', type: 'heading', level: 2, anchor: 'using-width-max-width-and-margin-auto' },
      { id: 'wP7qOP6PhGIi', type: 'richtext', html: `<p>আগের চ্যাপ্টারে বলা হয়েছিল; একটি ব্লক-লেভেল এলিমেন্ট সবসময় যতটা সম্ভব প্রশস্ততা (বাম ও ডানে যতদূর সম্ভব) দখল করে।</p>
<p>একটি ব্লক-লেভেল এলিমেন্টের <code>width</code> সেট করলে এটি তার কন্টেইনারের প্রান্ত পর্যন্ত বিস্তৃত হওয়া থেকে বিরত থাকবে। এরপর, এলিমেন্টটিকে তার কন্টেইনারের মধ্যে অনুভূমিকভাবে কেন্দ্রীভূত করতে আপনি margin-কে auto সেট করতে পারেন। এলিমেন্টটি নির্দিষ্ট প্রস্থ দখল করবে, এবং অবশিষ্ট জায়গা দুই মার্জিনের মধ্যে সমানভাবে ভাগ হবে:</p>
<p><b>মনে রাখবেন:</b> উপরের <code>&lt;div&gt;</code>-এ সমস্যা তখন হয়, যখন ব্রাউজার উইন্ডো এলিমেন্টের প্রস্থের চেয়ে ছোট হয়। তখন ব্রাউজার পেজে একটি অনুভূমিক স্ক্রলবার যোগ করে।</p>
<p>এই পরিস্থিতিতে, এর বদলে <code>max-width</code> ব্যবহার করলে ছোট উইন্ডো পরিচালনায় ব্রাউজারের কার্যক্ষমতা উন্নত হবে। ছোট ডিভাইসে সাইট ব্যবহারযোগ্য করার সময় এটি গুরুত্বপূর্ণ:</p>
<p><b>টিপস:</b> দুটি div-এর মধ্যে পার্থক্য দেখতে ব্রাউজার উইন্ডো 500px-এর কম প্রশস্ততায় রিসাইজ করুন!</p>
<p>উপরের দুটি div-এর একটি উদাহরণ এখানে দেওয়া হলো:</p>` },
      { id: 'Z0o_exS--AW7', type: 'code', language: 'css', code: 'div.ex1 {\n  width: 500px;\n  margin: auto;\n  border: 3px solid #73AD21;\n}\ndiv.ex2 {\n  max-width: 500px;\n  margin: auto;\n  border: 3px solid #73AD21;\n}' },
    ],
    toc: [{ id: 'using-width-max-width-and-margin-auto', text: 'width, max-width এবং margin: auto; ব্যবহার করা', level: 2 }],
  },
  {
    id: 'a266f280-930e-4159-9096-2cfe93def7d5', // css/syllabus
    title: 'ডিজাইনে রঙ',
    meta_description: 'CSS - ক্যাসকেডিং স্টাইল শিটস সম্পর্কে বিস্তারিত জানার লিঙ্ক।',
    blocks: [
      { id: 'er3jmFml7xP2', text: 'CSS - ক্যাসকেডিং স্টাইল শিটস', type: 'heading', level: 2, anchor: 'css---cascading-style-sheets' },
      { id: 'pO_4G7ZjXkg9', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b> CSS সম্পর্কে বিস্তারিত জানতে <a href="/css/css-intro">এখানে</a> ক্লিক করুন।</p>' },
    ],
    toc: [{ id: 'css---cascading-style-sheets', text: 'CSS - ক্যাসকেডিং স্টাইল শিটস', level: 2 }],
  },
  {
    id: 'cda9341a-c28a-47fe-ab38-27d90a6644b0', // css/units
    title: 'CSS ইউনিট',
    meta_description: 'CSS-এর অ্যাবসোলিউট (cm, mm, px) এবং রিলেটিভ (em, rem, vw, vh, %) length ইউনিট শিখুন।',
    blocks: [
      { id: 'EILsILhuW0v7', type: 'richtext', html: '<hr>' },
      { id: 'Uk-dInPTsiFB', text: 'CSS ইউনিট', type: 'heading', level: 2, anchor: 'css-units' },
      { id: '9cZbOM3STcg7', type: 'richtext', html: '<p>একটি length প্রকাশ করার জন্য CSS-এ বিভিন্ন ইউনিট রয়েছে।</p>\n<p>অনেক CSS প্রপার্টি "length" মান নেয়, যেমন <code>width</code>, <code>margin</code>, <code>padding</code>, <code>font-size</code> ইত্যাদি।</p>\n<p>Length হলো একটি সংখ্যা, যার পরে একটি length ইউনিট থাকে, যেমন 10px, 2em ইত্যাদি।</p>\n<p>সংখ্যা এবং ইউনিটের মধ্যে কোনো হোয়াইটস্পেস থাকতে পারে না। তবে, মান 0 হলে, ইউনিটটি বাদ দেওয়া যায়।</p>\n<p>কিছু CSS প্রপার্টির জন্য, ঋণাত্মক length অনুমোদিত।</p>\n<p>দুই ধরনের length ইউনিট রয়েছে: অ্যাবসোলিউট এবং রিলেটিভ।</p>\n<hr>' },
      { id: 'nZvZSpODrbjz', text: 'অ্যাবসোলিউট length', type: 'heading', level: 2, anchor: 'absolute-lengths' },
      { id: '3yiU0qLxcLBt', type: 'richtext', html: '<p>অ্যাবসোলিউট length ইউনিট নির্দিষ্ট থাকে এবং এগুলোর যেকোনো একটিতে প্রকাশিত length ঠিক সেই আকারেই দেখাবে।</p>\n<p>স্ক্রিনে ব্যবহারের জন্য অ্যাবসোলিউট length ইউনিট প্রস্তাবিত নয়, কারণ স্ক্রিনের আকার অনেক পরিবর্তিত হয়। তবে, আউটপুট মাধ্যম জানা থাকলে এগুলো ব্যবহার করা যায়, যেমন প্রিন্ট লেআউটের জন্য।</p>' },
      { id: 'U5z3WMpqaJLK', type: 'table', header: ['ইউনিট', 'বিবরণ'], rows: [
        ['cm', 'সেন্টিমিটার'],
        ['mm', 'মিলিমিটার'],
        ['in', 'ইঞ্চি (1in = 96px = 2.54cm)'],
        ['px *', 'পিক্সেল (1px = 1in-এর 1/96 অংশ)'],
        ['pt', 'পয়েন্ট (1pt = 1in-এর 1/72 অংশ)'],
        ['pc', 'পাইকা (1pc = 12 pt)'],
      ] },
      { id: '9jI3s5yd97zx', type: 'richtext', html: '<p>* পিক্সেল (px) ভিউয়িং ডিভাইসের সাপেক্ষে নির্ধারিত। কম-dpi ডিভাইসের জন্য, 1px হলো ডিসপ্লের একটি ডিভাইস পিক্সেল (ডট)। প্রিন্টার এবং উচ্চ রেজোলিউশনের স্ক্রিনের জন্য 1px একাধিক ডিভাইস পিক্সেল বোঝায়।</p>\n<hr>' },
      { id: 'CX2sS1s_iaq8', text: 'রিলেটিভ length', type: 'heading', level: 2, anchor: 'relative-lengths' },
      { id: 'RMgzyuR013zG', type: 'richtext', html: '<p>রিলেটিভ length ইউনিট অন্য একটি length প্রপার্টির সাপেক্ষে একটি length নির্ধারণ করে। রিলেটিভ length ইউনিট বিভিন্ন রেন্ডারিং মাধ্যমে ভালোভাবে স্কেল করে।</p>' },
      { id: 'nF6S1RtCGYcp', type: 'table', header: ['ইউনিট', 'বিবরণ'], rows: [
        ['em', 'এলিমেন্টের font-size-এর সাপেক্ষে (2em মানে বর্তমান ফন্টের আকারের 2 গুণ)'],
        ['ex', 'বর্তমান ফন্টের x-height-এর সাপেক্ষে (খুব কম ব্যবহৃত হয়)'],
        ['ch', '"0" (শূন্য)-এর প্রস্থের সাপেক্ষে'],
        ['rem', 'রুট এলিমেন্টের font-size-এর সাপেক্ষে'],
        ['vw', 'ভিউপোর্টের* প্রস্থের 1%-এর সাপেক্ষে'],
        ['vh', 'ভিউপোর্টের* উচ্চতার 1%-এর সাপেক্ষে'],
        ['vmin', "ভিউপোর্টের* ছোট মাত্রার 1%-এর সাপেক্ষে"],
        ['vmax', "ভিউপোর্টের* বড় মাত্রার 1%-এর সাপেক্ষে"],
        ['%', 'প্যারেন্ট এলিমেন্টের সাপেক্ষে'],
      ] },
      { id: 'fOIgyDvmIDNO', type: 'richtext', html: `<div class="note">
                                    <p><b>টিপস:</b> পুরোপুরি স্কেলযোগ্য লেআউট তৈরিতে em এবং rem ইউনিট বাস্তবসম্মত!</p>
                                    <p>* ভিউপোর্ট = ব্রাউজার উইন্ডোর আকার। ভিউপোর্ট 50cm প্রশস্ত হলে, 1vw = 0.5cm।</p>
                                </div>` },
    ],
    toc: [
      { id: 'css-units', text: 'CSS ইউনিট', level: 2 },
      { id: 'absolute-lengths', text: 'অ্যাবসোলিউট length', level: 2 },
      { id: 'relative-lengths', text: 'রিলেটিভ length', level: 2 },
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
console.log(`css batch1: ${ok}/${docs.length} written`)
