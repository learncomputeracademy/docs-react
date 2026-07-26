import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'c13bff32-37e9-4e22-9818-e55287cf37a3' // css/float
const title = 'CSS ফ্লোট'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'CSS float ও clear প্রপার্টি, clearfix হ্যাক এবং ফ্লোট দিয়ে বক্স ও নেভিগেশন মেনু তৈরি করা শিখুন।'

const blocks = [
  { id: 'SwKITtwGuHM2', type: 'richtext', html: `<hr>
<p>CSS-এর <code>float</code> প্রপার্টি নির্ধারণ করে একটি এলিমেন্ট কীভাবে ফ্লোট করবে।</p>
<p>CSS-এর <code>clear</code> প্রপার্টি নির্ধারণ করে ক্লিয়ার করা এলিমেন্টের পাশে কোন এলিমেন্ট এবং কোন দিকে ফ্লোট করতে পারবে।</p>
<div class="clearfix">
                                    <div style="background-color:#2196F3;padding:16px;float:left;width:30%;opacity:0.85;text-align:center;color:#fff;">
                                        <span class="floatl">বামে ফ্লোট</span>
                                    </div>
                                    <div style="background-color:#F44336;padding:16px;float:right;width:30%;opacity:0.85;text-align:center;color:#fff;">
                                        <span class="floatr">ডানে ফ্লোট</span>
                                    </div>
                                </div>
<hr>` },
  { id: 'sNAgJkgF_5sF', text: 'float প্রপার্টি', type: 'heading', level: 2, anchor: 'the-float-property' },
  { id: 'pE1Bs_8DP996', type: 'richtext', html: `<p>কনটেন্ট পজিশন ও ফরম্যাট করতে <code>float</code> প্রপার্টি ব্যবহার করা হয়, যেমন একটি কন্টেইনারে ইমেজকে টেক্সটের বামে ফ্লোট করানো।</p>
<p><code>float</code> প্রপার্টির নিচের যেকোনো একটি মান থাকতে পারে:</p>
<ul>
                                    <li>left - এলিমেন্টটি তার কন্টেইনারের বামে ফ্লোট করে</li>
                                    <li>right - এলিমেন্টটি তার কন্টেইনারের ডানে ফ্লোট করে</li>
                                    <li>none - এলিমেন্টটি ফ্লোট করে না (টেক্সটে যেখানে থাকে ঠিক সেখানেই প্রদর্শিত হবে)। এটি ডিফল্ট</li>
                                    <li>inherit - এলিমেন্টটি তার প্যারেন্টের float মান ইনহেরিট করে</li>
                                </ul>
<p>সবচেয়ে সহজ ব্যবহারে, <code>float</code> প্রপার্টি ইমেজের চারপাশে টেক্সট মোড়ানোর জন্য ব্যবহার করা যায়।</p>
<hr>` },
  { id: 'AUaSqRjgqO9q', text: 'Example - float: right;', type: 'heading', level: 2, anchor: 'example---float-right' },
  { id: 'PXKkGoYniDeg', type: 'richtext', html: `<p>নিচের উদাহরণে একটি ইমেজকে টেক্সটের <strong>ডানে</strong> ফ্লোট করতে বলা হয়েছে:</p>
<div class="clearfix">
                                    <p class="img-thumbnail p-4"><img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960210/img/cat-dog.webp" alt="cat" style="width:120px;height:auto;float:right;margin-left:15px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. <span>Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula, facilisis sed ornare eu, lobortis in odio. Praesent convallis urna a lacus interdum ut hendrerit risus congue. Nunc sagittis dictum nisi, sed ullamcorper ipsum dignissim ac...</span></p>
                                </div>` },
  { id: 'JJQArodLs93A', type: 'code', language: 'css', code: 'img {\n  float: right;\n}' },
  { id: 'iJyigYNiTzRQ', type: 'richtext', html: '<hr>' },
  { id: '865F1JL5-2Rh', text: 'Example - float: left;', type: 'heading', level: 2, anchor: 'example---float-left' },
  { id: 'wYPSdVcLPxmN', type: 'richtext', html: `<p>নিচের উদাহরণে একটি ইমেজকে টেক্সটের <strong>বামে</strong> ফ্লোট করতে বলা হয়েছে:</p>
<div class="clearfix">
                                    <p class="img-thumbnail p-4"><img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960210/img/cat-dog.webp" alt="cat" style="width:120px;height:auto;float:left;margin-right:15px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. <span class="w3-hide-small">Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula, facilisis sed ornare eu, lobortis in odio. Praesent convallis urna a lacus interdum ut hendrerit risus congue. Nunc sagittis dictum nisi, sed ullamcorper ipsum dignissim ac...</span></p>
                                </div>` },
  { id: 'iKhVkZUTtxo5', type: 'code', language: 'css', code: 'img {\n  float: left;\n}' },
  { id: '-9VF8stnBTSx', type: 'richtext', html: '<hr>' },
  { id: 'HrVTJaM8iNYp', text: 'উদাহরণ - No float', type: 'heading', level: 2, anchor: 'example---no-float' },
  { id: 'VPKSZkmJWCVx', type: 'richtext', html: `<p>নিচের উদাহরণে ইমেজটি টেক্সটে যেখানে থাকে ঠিক সেখানেই প্রদর্শিত হবে (float: none;):</p>
<p class="img-thumbnail p-4"><img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960210/img/cat-dog.webp" alt="cat" style="max-width:185px;width:50%;float:none;">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. <span class="w3-hide-small">Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula, facilisis sed ornare eu, lobortis in odio. Praesent convallis urna a lacus interdum ut hendrerit risus congue. Nunc sagittis dictum nisi, sed ullamcorper ipsum dignissim ac...</span></p>` },
  { id: 'x-8ebEFewprA', type: 'code', language: 'css', code: 'img {\n  float: none;\n}' },
  { id: 'QvfOTNcpo8DQ', type: 'richtext', html: '<hr>' },
  { id: 'Yvd-77Ds2ltI', text: 'clear প্রপার্টি', type: 'heading', level: 2, anchor: 'the-clear-property' },
  { id: 'EVS4alLIv9L2', type: 'richtext', html: `<p><code>clear</code> প্রপার্টি নির্ধারণ করে ক্লিয়ার করা এলিমেন্টের পাশে কোন এলিমেন্ট এবং কোন দিকে ফ্লোট করতে পারবে।</p>
<p><code>clear</code> প্রপার্টির নিচের যেকোনো একটি মান থাকতে পারে:</p>
<ul>
                                    <li>none - উভয় পাশে ফ্লোটিং এলিমেন্টের অনুমতি দেয়। এটি ডিফল্ট</li>
                                    <li>left - বাম পাশে কোনো ফ্লোটিং এলিমেন্টের অনুমতি নেই</li>
                                    <li>right- ডান পাশে কোনো ফ্লোটিং এলিমেন্টের অনুমতি নেই</li>
                                    <li>both - বাম বা ডান, কোনো পাশেই ফ্লোটিং এলিমেন্টের অনুমতি নেই</li>
                                    <li>inherit - এলিমেন্টটি তার প্যারেন্টের clear মান ইনহেরিট করে</li>
                                </ul>
<p>একটি এলিমেন্টে <code>float</code> প্রপার্টি ব্যবহার করার পর <code>clear</code> প্রপার্টি ব্যবহার করার সবচেয়ে সাধারণ উপায়।</p>
<p>ফ্লোট ক্লিয়ার করার সময়, clear-কে float-এর সাথে মিলিয়ে নেওয়া উচিত: একটি এলিমেন্ট বামে ফ্লোট করা থাকলে, তাহলে আপনার বামে ক্লিয়ার করা উচিত। আপনার ফ্লোট করা এলিমেন্ট ফ্লোট করতে থাকবে, কিন্তু ক্লিয়ার করা এলিমেন্টটি ওয়েব পেজে এর নিচে দেখা যাবে।</p>
<p>নিচের উদাহরণে বামে ফ্লোট ক্লিয়ার করা হয়েছে। অর্থাৎ (div-এর) বাম পাশে কোনো ফ্লোটিং এলিমেন্টের অনুমতি নেই:</p>` },
  { id: 'C7wjXUqDrrq9', type: 'code', language: 'css', code: 'img {\n  float: left;\n}' },
  { id: 'Oh4fjS_AsZ69', type: 'richtext', html: '<hr>' },
  { id: 'yB_02pHoleOy', text: 'clearfix হ্যাক', type: 'heading', level: 2, anchor: 'the-clearfix-hack' },
  { id: 'qtH0ykMg9GQP', type: 'richtext', html: `<p>একটি এলিমেন্ট তার কন্টেইনিং এলিমেন্টের চেয়ে লম্বা হলে, এবং সেটি ফ্লোট করা থাকলে, এটি তার কন্টেইনারের বাইরে "ওভারফ্লো" হয়ে যাবে:</p>
<div style="margin-bottom: 1rem;" class="img-thumbnail p-4">
                                    <div>
                                        <h3>Clearfix ছাড়া</h3>
                                        <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960439/img/without-float.webp" style="max-width:75%;">
                                    </div>
                                    <div>
                                        <h3>Clearfix সহ</h3>
                                        <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960437/img/with-float.webp" style="max-width:75%;">
                                    </div>
                                </div>
<p>এরপর এই সমস্যা সমাধানে আমরা কন্টেইনিং এলিমেন্টে <code class="w3-codespan">overflow: auto;</code> যোগ করতে পারি:</p>` },
  { id: 'D6IXo7u4OVbK', type: 'code', language: 'css', code: '.clearfix {\n  overflow: auto;\n}' },
  { id: 'uBjnejFiVJdt', type: 'richtext', html: '<p><code>overflow: auto</code> clearfix ভালো কাজ করে যতক্ষণ আপনি আপনার margin এবং padding নিয়ন্ত্রণে রাখতে পারেন (নাহলে আপনি স্ক্রলবার দেখতে পারেন)। তবে, <b>নতুন, আধুনিক clearfix হ্যাক</b> ব্যবহার করা বেশি নিরাপদ, এবং বেশিরভাগ ওয়েবপেজে নিচের কোডটি ব্যবহার করা হয়:</p>' },
  { id: 'xKgrYcu0Q98_', type: 'code', language: 'css', code: '.clearfix::after {\n  content: "";\n  clear: both;\n  display: table;\n}' },
  { id: 'XqD0CqVfBtB0', type: 'richtext', html: '<p class="note">পরের একটি চ্যাপ্টারে <code>::after</code> সিউডো-এলিমেন্ট সম্পর্কে আরও জানবেন।</p>\n<hr>' },
  { id: '_Tv7WE8v2dYO', text: 'বক্সের গ্রিড / সমান প্রস্থের বক্স', type: 'heading', level: 2, anchor: 'grid-of-boxes-equal-width-boxes' },
  { id: 'hKxo2wsxxWsG', type: 'richtext', html: `<div style="margin-bottom: 1rem;" class="clearfix">
                                  <div style="background-color:#bbb;padding: 20px;text-align: center;float: left;max-width: 50%;width: 50%;">
                                    <p>বক্স 1</p>
                                  </div>
                                  <div style="background-color:#ccc;padding: 20px;text-align: center;float: left;max-width: 50%;width: 50%;">
                                    <p>বক্স 2</p>
                                  </div>
                                </div>
<br>
<div style="margin-bottom:1rem;" class="clearfix">
                                  <div style="background-color:#bbb;padding: 20px;text-align: center;float: left;max-width: 33.333%;width: 33.333%;">
                                    <p>বক্স 1</p>
                                  </div>
                                  <div style="background-color:#ccc;padding: 20px;text-align: center;float: left;max-width: 33.333%;width: 33.333%;">
                                    <p>বক্স 2</p>
                                 </div>
                                  <div style="background-color:#ddd;padding: 20px;text-align: center;float: left;max-width: 33.333%;width: 33.333%;">
                                    <p>বক্স 3</p>
                                  </div>
                                </div>
<p><code>float</code> প্রপার্টি দিয়ে, কনটেন্টের বক্স পাশাপাশি ফ্লোট করা সহজ:</p>` },
  { id: '00UhE4UEoSN8', type: 'code', language: 'css', code: '* {\n  box-sizing: border-box;\n}\n.box {\n  float: left;\n  width: 33.33%; /* তিনটি বক্স (চারটির জন্য 25%, দুটির জন্য 50% ইত্যাদি ব্যবহার করুন) */\n  padding: 50px; /* ইমেজগুলোর মধ্যে জায়গা চাইলে */\n}' },
  { id: 'kD7D7BcfsKEe', type: 'richtext', html: `<p class="note"><b>box-sizing কী?</b><br>
                                আপনি সহজেই পাশাপাশি তিনটি ফ্লোটিং বক্স তৈরি করতে পারেন। তবে, আপনি যখন এমন কিছু যোগ করেন যা প্রতিটি বক্সের প্রস্থ বাড়িয়ে দেয় (যেমন padding বা border), তখন বক্সটি ভেঙে যাবে। <code>box-sizing</code> প্রপার্টি আমাদের padding এবং border-কে বক্সের মোট প্রস্থে (এবং উচ্চতায়) অন্তর্ভুক্ত করতে দেয়, যাতে padding বক্সের ভেতরেই থাকে এবং এটি না ভাঙে।<br>
                                আমাদের CSS Box Sizing চ্যাপ্টারে box-sizing প্রপার্টি সম্পর্কে আরও পড়তে পারেন।</p>
<hr>` },
  { id: 'TqeUDMZW8m6m', text: 'পাশাপাশি ইমেজ', type: 'heading', level: 2, anchor: 'images-side-by-side' },
  { id: 'hQ7j1qRuRvL_', type: 'image', alt: 'Italy', width: 600, height: 400, publicId: 'img/img_float1' },
  { id: 'zmwFkKtvalNc', type: 'image', alt: 'Forest', width: 600, height: 400, publicId: 'img/img_float2' },
  { id: 'Byl6OAUUoc58', type: 'image', alt: 'Mountains', width: 600, height: 400, publicId: 'img/img_float3' },
  { id: 'OR_rr0RT-s4p', type: 'richtext', html: '<p>বক্সের গ্রিড ইমেজ পাশাপাশি দেখাতেও ব্যবহার করা যায়:</p>' },
  { id: '8zLbXocMfA47', type: 'code', language: 'css', code: '.img-container {\n  float: left;\n  width: 33.33%; /* তিনটি কন্টেইনার (চারটির জন্য 25%, দুটির জন্য 50% ইত্যাদি ব্যবহার করুন) */\n  padding: 5px; /* ইমেজগুলোর মধ্যে জায়গা চাইলে */\n}' },
  { id: 'Hp8x3bCucGsZ', type: 'richtext', html: '<hr>' },
  { id: 'CC1FQ1ImjQfi', text: 'সমান উচ্চতার বক্স', type: 'heading', level: 2, anchor: 'equal-height-boxes' },
  { id: '71GfG-ZInHSQ', type: 'richtext', html: `<p>আগের উদাহরণে, আপনি শিখেছেন কীভাবে সমান প্রস্থের বক্স পাশাপাশি ফ্লোট করাতে হয়। তবে, সমান উচ্চতার ফ্লোটিং বক্স তৈরি করা সহজ নয়। একটি দ্রুত সমাধান
                                হলো, নিচের উদাহরণের মতো একটি নির্দিষ্ট height সেট করা:</p>
<div class="clearfix">
                                  <div style="background-color:#bbb;width:50%;height:300px;float:left;padding: 20px;">
                                      <h2>বক্স 1</h2>
                                      <p>কিছু কনটেন্ট, কিছু কনটেন্ট, কিছু কনটেন্ট</p>
                                  </div>
                                  <div style="background-color:#ccc;width:50%;height:300px;float:left;padding: 20px;">
                                      <h2>বক্স 2</h2>
                                      <p>কিছু কনটেন্ট, কিছু কনটেন্ট, কিছু কনটেন্ট</p>
                                      <p>কিছু কনটেন্ট, কিছু কনটেন্ট, কিছু কনটেন্ট</p>
                                      <p>কিছু কনটেন্ট, কিছু কনটেন্ট, কিছু কনটেন্ট</p>
                                  </div>
                                </div>` },
  { id: 'jJAqmTgkv4TD', type: 'code', language: 'css', code: '.box {\n  height: 300px;\n}' },
  { id: '3aOxK0sVaL2Y', type: 'richtext', html: '<p class="note"><b>তবে</b>, এটি খুব একটা নমনীয় নয়। আপনি যদি নিশ্চিত করতে পারেন যে বক্সগুলোতে সবসময় সমান পরিমাণ কনটেন্ট থাকবে, তাহলে এটি ঠিক আছে। কিন্তু অনেক সময়, কনটেন্ট সমান হয় না। আপনি যদি উপরের উদাহরণটি একটি মোবাইল ফোনে চেষ্টা করেন, তাহলে দেখবেন দ্বিতীয় বক্সের কনটেন্ট বক্সের বাইরে প্রদর্শিত হচ্ছে। এখানেই CSS3 Flexbox কাজে লাগে - কারণ এটি স্বয়ংক্রিয়ভাবে বক্সগুলোকে সবচেয়ে লম্বা বক্সের সমান দৈর্ঘ্যে প্রসারিত করতে পারে:</p>\n<hr>' },
  { id: '-WZjMtkfkOrR', text: 'নেভিগেশন মেনু', type: 'heading', level: 2, anchor: 'navigation-menu' },
  { id: '99Hdu-IyKO01', type: 'richtext', html: '<p>একটি অনুভূমিক মেনু তৈরি করতে হাইপারলিঙ্কের একটি লিস্টের সাথে <code>float</code> ব্যবহার করুন:</p>' },
  { id: 'afKJFu3Aw7th', type: 'loop', alt: 'menu', width: 1140, height: 65, publicId: 'img/menu-strip-2' },
  { id: 'a4XBLrBMpn0o', type: 'richtext', html: '<hr>' },
  { id: '3Uhvw3y6x173', text: 'সব CSS Float প্রপার্টি', type: 'heading', level: 2, anchor: 'all-css-float-properties' },
  { id: 'W51ZbiZ-OYMU', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
    ['box-sizing', 'একটি এলিমেন্টের width ও height কীভাবে হিসাব করা হবে তা নির্ধারণ করে: এতে padding ও border অন্তর্ভুক্ত থাকবে কিনা'],
    ['clear', 'ক্লিয়ার করা এলিমেন্টের পাশে কোন এলিমেন্ট এবং কোন দিকে ফ্লোট করতে পারবে তা নির্ধারণ করে'],
    ['float', 'একটি এলিমেন্ট কীভাবে ফ্লোট করবে তা নির্ধারণ করে'],
    ['overflow', "কনটেন্ট একটি এলিমেন্টের বক্স থেকে ওভারফ্লো হলে কী ঘটবে তা নির্ধারণ করে"],
    ['overflow-x', "কনটেন্ট এলিমেন্টের কনটেন্ট এরিয়া থেকে ওভারফ্লো হলে বাম/ডান এজের সাথে কী করতে হবে তা নির্ধারণ করে"],
    ['overflow-y', "কনটেন্ট এলিমেন্টের কনটেন্ট এরিয়া থেকে ওভারফ্লো হলে উপরের/নিচের এজের সাথে কী করতে হবে তা নির্ধারণ করে"],
  ] },
]

const toc = [
  { id: 'the-float-property', text: 'float প্রপার্টি', level: 2 },
  { id: 'example---float-right', text: 'Example - float: right;', level: 2 },
  { id: 'example---float-left', text: 'Example - float: left;', level: 2 },
  { id: 'example---no-float', text: 'উদাহরণ - No float', level: 2 },
  { id: 'the-clear-property', text: 'clear প্রপার্টি', level: 2 },
  { id: 'the-clearfix-hack', text: 'clearfix হ্যাক', level: 2 },
  { id: 'grid-of-boxes-equal-width-boxes', text: 'বক্সের গ্রিড / সমান প্রস্থের বক্স', level: 2 },
  { id: 'images-side-by-side', text: 'পাশাপাশি ইমেজ', level: 2 },
  { id: 'equal-height-boxes', text: 'সমান উচ্চতার বক্স', level: 2 },
  { id: 'navigation-menu', text: 'নেভিগেশন মেনু', level: 2 },
  { id: 'all-css-float-properties', text: 'সব CSS Float প্রপার্টি', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/float: 1/1 written')
