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
    id: '50263d36-0754-4b19-ad05-96a3ccf51285', // css/combinators
    title: 'CSS কম্বিনেটর',
    meta_description: 'ডিসেন্ডেন্ট, চাইল্ড, অ্যাডজেসেন্ট সিবলিং এবং জেনারেল সিবলিং কম্বিনেটর সিলেক্টর কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'Nc0jzIwaOa7f', type: 'richtext', html: '<hr>' },
      { id: 'QsCRb9ScLKjm', text: 'CSS কম্বিনেটর', type: 'heading', level: 2, anchor: 'css-combinators' },
      { id: '2ii14PIPrMNQ', type: 'richtext', html: `<p class="note">একটি কম্বিনেটর হলো এমন কিছু, যা সিলেক্টরগুলোর মধ্যে সম্পর্ক ব্যাখ্যা করে।</p>
<p>একটি CSS সিলেক্টরে একাধিক সিম্পল সিলেক্টর থাকতে পারে। সিম্পল সিলেক্টরগুলোর মধ্যে, আমরা একটি কম্বিনেটর যোগ করতে পারি।</p>
<p>CSS-এ চারটি ভিন্ন কম্বিনেটর আছে:</p>
<ul>
                                    <li>ডিসেন্ডেন্ট সিলেক্টর (স্পেস)</li>
                                    <li>চাইল্ড সিলেক্টর (&gt;)</li>
                                    <li>অ্যাডজেসেন্ট সিবলিং সিলেক্টর (+)</li>
                                    <li>জেনারেল সিবলিং সিলেক্টর (~)</li>
                                </ul>
<hr>` },
      { id: 'YbFqXdKr38Yq', text: 'ডিসেন্ডেন্ট সিলেক্টর', type: 'heading', level: 2, anchor: 'descendant-selector' },
      { id: 'tcRRfCOBI8AB', type: 'richtext', html: '<p>ডিসেন্ডেন্ট সিলেক্টর একটি নির্দিষ্ট এলিমেন্টের সব ডিসেন্ডেন্ট এলিমেন্টের সাথে মেলে।</p>\n<p>নিচের উদাহরণে &lt;div&gt; এলিমেন্টের ভেতরের সব &lt;p&gt; এলিমেন্ট সিলেক্ট করা হয়েছে: </p>' },
      { id: 'fpI2KTYECEBx', type: 'code', language: 'css', code: 'div p {\n  background-color: yellow;\n}' },
      { id: 'NFvACdZhyE5e', type: 'richtext', html: '<hr>' },
      { id: '6ZG0O0Ncfp4J', text: 'চাইল্ড সিলেক্টর', type: 'heading', level: 2, anchor: 'child-selector' },
      { id: 'BnDtQ8bWBxIV', type: 'richtext', html: '<p>চাইল্ড সিলেক্টর একটি নির্দিষ্ট এলিমেন্টের চাইল্ড এমন সব এলিমেন্ট সিলেক্ট করে।</p>\n<p>নিচের উদাহরণে &lt;div&gt; এলিমেন্টের চাইল্ড এমন সব &lt;p&gt; এলিমেন্ট সিলেক্ট করা হয়েছে:</p>' },
      { id: 'NqiNJjLB--os', type: 'code', language: 'css', code: 'div > p {\n  background-color: yellow;\n}' },
      { id: '95VPnIMz1I_W', type: 'richtext', html: '<hr>' },
      { id: 'RQcqCxoeMi6f', text: 'অ্যাডজেসেন্ট সিবলিং সিলেক্টর', type: 'heading', level: 2, anchor: 'adjacent-sibling-selector' },
      { id: 'ttIQ4YwM2JnQ', type: 'richtext', html: '<p>অ্যাডজেসেন্ট সিবলিং সিলেক্টর একটি নির্দিষ্ট এলিমেন্টের ঠিক পাশের সিবলিং এমন সব এলিমেন্ট সিলেক্ট করে।</p>\n<p>সিবলিং এলিমেন্টের একই প্যারেন্ট এলিমেন্ট থাকতে হবে, এবং "অ্যাডজেসেন্ট" মানে "ঠিক পরে"।</p>\n<p>নিচের উদাহরণে &lt;div&gt; এলিমেন্টের ঠিক পরে থাকা সব &lt;p&gt; এলিমেন্ট সিলেক্ট করা হয়েছে:</p>' },
      { id: 'vzl1ip2v9zhB', type: 'code', language: 'css', code: 'div + p {\n  background-color: yellow;\n}' },
      { id: 'lirSVU2tlNkz', type: 'richtext', html: '<hr>' },
      { id: 'DEg-uVL-_bBf', text: 'জেনারেল সিবলিং সিলেক্টর', type: 'heading', level: 2, anchor: 'general-sibling-selector' },
      { id: '-BH2fw5jgQif', type: 'richtext', html: '<p>জেনারেল সিবলিং সিলেক্টর একটি নির্দিষ্ট এলিমেন্টের সিবলিং এমন সব এলিমেন্ট সিলেক্ট করে।</p>\n<p>নিচের উদাহরণে &lt;div&gt; এলিমেন্টের সিবলিং এমন সব &lt;p&gt; এলিমেন্ট সিলেক্ট করা হয়েছে: </p>' },
      { id: 'VyQBpv45LOju', type: 'code', language: 'css', code: 'div ~ p {\n  background-color: yellow;\n}' },
      { id: 'u6K2ornnI6nS', type: 'richtext', html: '<hr>' },
      { id: 'hAezkNynOcUM', text: 'সব CSS কম্বিনেটর সিলেক্টর', type: 'heading', level: 2, anchor: 'all-css-combinator-selectors' },
      { id: 'QTOQFU6dR6Q_', type: 'table', header: ['সিলেক্টর', 'উদাহরণ', 'উদাহরণের বিবরণ'], rows: [
        ['element element', 'div p', '&lt;div&gt; এলিমেন্টের ভেতরের সব &lt;p&gt; এলিমেন্ট সিলেক্ট করে'],
        ['element&gt;element', 'div &gt; p', 'সব &lt;p&gt; এলিমেন্ট সিলেক্ট করে যাদের প্যারেন্ট একটি &lt;div&gt; এলিমেন্ট'],
        ['element+element', 'div + p', '&lt;div&gt; এলিমেন্টের ঠিক পরে থাকা সব &lt;p&gt; এলিমেন্ট সিলেক্ট করে'],
        ['element1~element2', 'p ~ ul', 'এমন প্রতিটি &lt;ul&gt; এলিমেন্ট সিলেক্ট করে যার আগে একটি &lt;p&gt; এলিমেন্ট আছে'],
      ] },
    ],
    toc: [
      { id: 'css-combinators', text: 'CSS কম্বিনেটর', level: 2 },
      { id: 'descendant-selector', text: 'ডিসেন্ডেন্ট সিলেক্টর', level: 2 },
      { id: 'child-selector', text: 'চাইল্ড সিলেক্টর', level: 2 },
      { id: 'adjacent-sibling-selector', text: 'অ্যাডজেসেন্ট সিবলিং সিলেক্টর', level: 2 },
      { id: 'general-sibling-selector', text: 'জেনারেল সিবলিং সিলেক্টর', level: 2 },
      { id: 'all-css-combinator-selectors', text: 'সব CSS কম্বিনেটর সিলেক্টর', level: 2 },
    ],
  },
  {
    id: 'b38303f9-e3f3-4903-a136-6d8ca2d79648', // css/display-visibility
    title: 'CSS ভিজিবিলিটি',
    meta_description: 'CSS display প্রপার্টি, ব্লক ও ইনলাইন এলিমেন্ট, এবং display:none বনাম visibility:hidden-এর পার্থক্য জানুন।',
    blocks: [
      { id: 'yXLs3-06xQKb', type: 'richtext', html: '<hr>\n<p>লেআউট নিয়ন্ত্রণের জন্য <code>display</code> প্রপার্টি সবচেয়ে গুরুত্বপূর্ণ CSS প্রপার্টি।</p>\n<hr>' },
      { id: 'FcrPA6-AfQ_S', text: 'display প্রপার্টি', type: 'heading', level: 2, anchor: 'the-display-property' },
      { id: 'n-S0zc73GApo', type: 'richtext', html: '<p><code>display</code> প্রপার্টি নির্ধারণ করে একটি এলিমেন্ট প্রদর্শিত হবে কিনা/কীভাবে হবে।</p>\n<p>প্রতিটি HTML এলিমেন্টের একটি ডিফল্ট display মান থাকে, যা নির্ভর করে সেটি কোন ধরনের এলিমেন্ট তার উপর। বেশিরভাগ এলিমেন্টের ডিফল্ট display মান হলো <code>block</code> বা \n                                <code>inline</code>।</p>\n<hr>' },
      { id: 'c4M5_2q01MlO', text: 'ব্লক-লেভেল এলিমেন্ট', type: 'heading', level: 2, anchor: 'block-level-elements' },
      { id: 'cIv-uVtLfhKt', type: 'richtext', html: `<p>একটি ব্লক-লেভেল এলিমেন্ট সবসময় একটি নতুন লাইনে শুরু হয় এবং যতটা সম্ভব প্রশস্ততা (বাম ও ডানে যতদূর সম্ভব) দখল করে।</p>
<p>ব্লক-লেভেল এলিমেন্টের উদাহরণ:</p>
<ul>
                                    <li>&lt;div&gt;</li>
                                    <li>&lt;h1&gt; - &lt;h6&gt;</li>
                                    <li>&lt;p&gt;</li>
                                    <li>&lt;form&gt;</li>
                                    <li>&lt;header&gt;</li>
                                    <li>&lt;footer&gt;</li>
                                    <li>&lt;section&gt;</li>
                                </ul>
<hr>` },
      { id: '-HmvR-xRR-G3', text: 'ইনলাইন এলিমেন্ট', type: 'heading', level: 2, anchor: 'inline-elements' },
      { id: 'mVqn0T3Rv8P9', type: 'richtext', html: `<p>একটি ইনলাইন এলিমেন্ট নতুন লাইনে শুরু হয় না এবং শুধু প্রয়োজন অনুযায়ী প্রশস্ততা দখল করে।</p>
<p>এটি একটি প্যারাগ্রাফের ভেতরে <span style="border-width:3px;border-style:solid;">একটি ইনলাইন &lt;span&gt; এলিমেন্ট</span>।</p>
<p>ইনলাইন এলিমেন্টের উদাহরণ:</p>
<ul>
                                    <li>&lt;span&gt;</li>
                                    <li>&lt;a&gt;</li>
                                    <li>&lt;img&gt;</li>
                                    </ul>
<hr>` },
      { id: 'nix7zHid99LA', text: 'Display: none;', type: 'heading', level: 2, anchor: 'display-none' },
      { id: 'wd8O9DUJdEK3', type: 'richtext', html: '<p><code>display: none;</code> সাধারণত JavaScript-এর সাথে এলিমেন্ট মুছে ফেলা এবং আবার তৈরি না করেই লুকাতে ও দেখাতে ব্যবহৃত হয়। এটি কীভাবে করা যায় জানতে চাইলে এই পেজের শেষ উদাহরণটি দেখুন।</p>\n<p><code>&lt;script&gt;</code> এলিমেন্ট ডিফল্ট হিসেবে <code>display: none;</code> ব্যবহার করে। </p>\n<hr>\n<hr>' },
      { id: '47a1BsmMkPvC', text: 'ডিফল্ট Display মান ওভাররাইড করা', type: 'heading', level: 2, anchor: 'override-the-default-display-value' },
      { id: 'we3xUKQkT7xa', type: 'richtext', html: '<p>আগেই বলা হয়েছে, প্রতিটি এলিমেন্টের একটি ডিফল্ট display মান থাকে। তবে, আপনি এটি ওভাররাইড করতে পারেন।</p>\n<p>একটি ইনলাইন এলিমেন্টকে ব্লক এলিমেন্টে পরিবর্তন করা, বা উল্টোটা, পেজকে নির্দিষ্টভাবে দেখাতে এবং তারপরও ওয়েব স্ট্যান্ডার্ড মেনে চলতে সহায়ক হতে পারে।</p>\n<p>একটি সাধারণ উদাহরণ হলো অনুভূমিক মেনুর জন্য ইনলাইন <code>&lt;li&gt;</code> এলিমেন্ট তৈরি করা:</p>' },
      { id: 'HwXhtiCz0IJ_', type: 'code', language: 'css', code: 'li {\n  display: inline;\n}' },
      { id: 'rLpGjE4jFnMU', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b> একটি এলিমেন্টের display প্রপার্টি সেট করলে শুধু <b>এলিমেন্টটি কীভাবে প্রদর্শিত হবে</b> তা পরিবর্তিত হয়, এটি কোন ধরনের এলিমেন্ট তা নয়। তাই, <code>display: block</code>; সহ একটি ইনলাইন এলিমেন্টের ভেতরে অন্য ব্লক এলিমেন্ট থাকার অনুমতি নেই।</p>\n<p>নিচের উদাহরণে <span> এলিমেন্টগুলোকে ব্লক এলিমেন্ট হিসেবে দেখানো হয়েছে:</span></p>' },
      { id: 'mSaIFO1gKA3J', type: 'code', language: 'css', code: 'span {\n  display: block;\n}' },
      { id: 'c5x7Rlgoi5MU', type: 'richtext', html: `<span>"block" মানসহ একটি display প্রপার্টির ফলে</span>
<span style="display: block;">দুটি এলিমেন্টের মধ্যে একটি লাইন-ব্রেক তৈরি হয়।</span>
<hr>
<p>নিচের উদাহরণে &lt;a&gt; এলিমেন্টগুলোকে ব্লক এলিমেন্ট হিসেবে দেখানো হয়েছে:</p>
<a href="#" target="_blank" style="display: block; border: 1px solid pink;">HTML</a>
<a href="#" target="_blank" style="display: block; border: 1px solid pink;">CSS</a>
<a href="#" target="_blank" style="display: block; border: 1px solid pink;">JavaScript</a>
<hr>` },
      { id: 'VtYPAhgcpnx0', text: 'একটি এলিমেন্ট লুকানো - display:none নাকি visibility:hidden?', type: 'heading', level: 2, anchor: 'hide-an-element---displaynone-or-visibilityhidden' },
      { id: 'ejTUuY4YOBXu', type: 'richtext', html: '<p>একটি এলিমেন্ট লুকাতে <code>display</code> প্রপার্টি <code>none</code>-এ সেট করা যায়। এলিমেন্টটি লুকানো থাকবে, এবং পেজটি এমনভাবে প্রদর্শিত হবে যেন এলিমেন্টটি সেখানে নেই:</p>' },
      { id: '6GehPDQFSJ81', type: 'code', language: 'css', code: 'h1.hidden {\n  display: none;\n}' },
      { id: 'yJDOa4kdhg2O', type: 'richtext', html: '<p><code>visibility:hidden</code>;-ও একটি এলিমেন্ট লুকিয়ে দেয়।</p>\n<p>তবে, এলিমেন্টটি আগের মতোই একই জায়গা দখল করে থাকবে। এলিমেন্টটি লুকানো থাকবে, কিন্তু তারপরও লেআউটে প্রভাব ফেলবে:</p>' },
      { id: 'ZtrgDZtqi_HF', type: 'code', language: 'css', code: 'h1.hidden {\n  visibility: hidden;\n}' },
      { id: 'nxiBDcOk3BPV', type: 'richtext', html: '<hr>' },
      { id: 'R7cL6ALh0QMK', text: 'CSS Display/Visibility প্রপার্টি', type: 'heading', level: 2, anchor: 'css-displayvisibility-properties' },
      { id: 'sKvtq03d0W4H', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
        ['display', 'একটি এলিমেন্ট কীভাবে প্রদর্শিত হবে তা নির্ধারণ করে'],
        ['visibility', 'একটি এলিমেন্ট দৃশ্যমান হবে কিনা তা নির্ধারণ করে'],
      ] },
    ],
    toc: [
      { id: 'the-display-property', text: 'display প্রপার্টি', level: 2 },
      { id: 'block-level-elements', text: 'ব্লক-লেভেল এলিমেন্ট', level: 2 },
      { id: 'inline-elements', text: 'ইনলাইন এলিমেন্ট', level: 2 },
      { id: 'display-none', text: 'Display: none;', level: 2 },
      { id: 'override-the-default-display-value', text: 'ডিফল্ট Display মান ওভাররাইড করা', level: 2 },
      { id: 'hide-an-element---displaynone-or-visibilityhidden', text: 'একটি এলিমেন্ট লুকানো - display:none নাকি visibility:hidden?', level: 2 },
      { id: 'css-displayvisibility-properties', text: 'CSS Display/Visibility প্রপার্টি', level: 2 },
    ],
  },
  {
    id: 'eaec4916-f81a-4674-b395-a7115489c313', // css/outline
    title: 'CSS আউটলাইন',
    meta_description: 'CSS আউটলাইনের style, color, width, offset এবং শর্টহ্যান্ড প্রপার্টি কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: '_LPDZJoPj8n0', type: 'richtext', html: '<hr>\n<p style="width:98%;border:2px solid #ea0059;outline:#0054D1 solid 10px;padding:20px;margin:auto;text-align:center">এই এলিমেন্টের একটি <b>গোলাপি বর্ডার</b> এবং 10px প্রস্থের একটি <b>নীল আউটলাইন</b> আছে।</p>\n<hr>' },
      { id: 'Wv-UGmETyn2A', text: 'CSS আউটলাইন', type: 'heading', level: 2, anchor: 'css-outline' },
      { id: 'J-PesTk1Pj9P', type: 'richtext', html: `<p>একটি আউটলাইন হলো এলিমেন্টের চারপাশে, বর্ডারের বাইরে আঁকা একটি লাইন, যা এলিমেন্টটিকে "স্ট্যান্ড আউট" করাতে সাহায্য করে।</p>
<div class="img-block" style="margin-bottom: 1rem;">
                                    <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960406/img/outline-img.webp" alt="boxmodel" class="img-fluid">
                                </div>
<p>CSS-এ নিচের আউটলাইন প্রপার্টিগুলো আছে:</p>
<ul>
                                    <li><code>outline-style</code></li>
                                    <li><code>outline-color</code></li>
                                    <li><code>outline-width</code></li>
                                    <li><code>outline-offset</code></li>
                                    <li><code>outline</code></li>
                                </ul>
<p class="note"><b>মনে রাখবেন:</b> আউটলাইন বর্ডার থেকে আলাদা! বর্ডারের বিপরীতে, আউটলাইন এলিমেন্টের বর্ডারের বাইরে আঁকা হয়, এবং অন্য কনটেন্টের সাথে ওভারল্যাপ করতে পারে। এছাড়াও, আউটলাইন এলিমেন্টের ডাইমেনশনের অংশ নয়; আউটলাইনের প্রস্থ এলিমেন্টের মোট প্রস্থ ও উচ্চতাকে প্রভাবিত করে না।</p>
<hr>` },
      { id: 'gEPSOICKm8Is', text: 'CSS Outline Style', type: 'heading', level: 2, anchor: 'css-outline-style' },
      { id: 'LXVSpP4BI4TN', type: 'richtext', html: `<p>outline-style প্রপার্টি আউটলাইনের স্টাইল নির্ধারণ করে, এবং এর নিচের যেকোনো একটি মান থাকতে পারে:</p>
<ul>
                                    <li><code>dotted</code> - একটি ডটেড আউটলাইন নির্ধারণ করে</li>
                                    <li><code>dashed</code> - একটি ড্যাশড আউটলাইন নির্ধারণ করে</li>
                                    <li><code>solid</code> - একটি সলিড আউটলাইন নির্ধারণ করে</li>
                                    <li><code>double</code> - একটি ডাবল আউটলাইন নির্ধারণ করে</li>
                                    <li><code>groove</code> - একটি 3D গ্রুভড আউটলাইন নির্ধারণ করে</li>
                                    <li><code>ridge</code> - একটি 3D রিজড আউটলাইন নির্ধারণ করে</li>
                                    <li><code>inset</code> - একটি 3D ইনসেট আউটলাইন নির্ধারণ করে</li>
                                    <li><code>outset</code> - একটি 3D আউটসেট আউটলাইন নির্ধারণ করে</li>
                                    <li><code>none</code> - কোনো আউটলাইন নির্ধারণ করে না</li>
                                    <li><code>hidden</code> - একটি লুকানো আউটলাইন নির্ধারণ করে</li>
                                </ul>
<p>নিচের উদাহরণে বিভিন্ন <code>outline-style</code> মান দেখানো হয়েছে:</p>
<p style="outline-style:dotted;">একটি ডটেড আউটলাইন।</p>
<p style="outline-style:dashed;">একটি ড্যাশড আউটলাইন।</p>
<p style="outline-style:solid;">একটি সলিড আউটলাইন।</p>
<p style="outline-style:double;">একটি ডাবল আউটলাইন।</p>
<p style="outline-style:groove;">একটি গ্রুভ আউটলাইন। প্রভাবটি outline-color মানের উপর নির্ভর করে।</p>
<p style="outline-style:ridge;">একটি রিজ আউটলাইন। প্রভাবটি outline-color মানের উপর নির্ভর করে।</p>
<p style="outline-style:inset;">একটি ইনসেট আউটলাইন। প্রভাবটি outline-color মানের উপর নির্ভর করে।</p>
<p style="outline-style:outset;">একটি আউটসেট আউটলাইন। প্রভাবটি outline-color মানের উপর নির্ভর করে।</p>
<p>বিভিন্ন আউটলাইন স্টাইলের একটি প্রদর্শনী:</p>` },
      { id: 'lmhV1MxpkA4j', type: 'code', language: 'css', code: 'p.dotted {outline-style: dotted;}\np.dashed {outline-style: dashed;}\np.solid {outline-style: solid;}\np.double {outline-style: double;}\np.groove {outline-style: groove;}\np.ridge {outline-style: ridge;}\np.inset {outline-style: inset;}\np.outset {outline-style: outset;}' },
      { id: '78szq1D7AsPG', type: 'richtext', html: '<p><b>মনে রাখবেন:</b> <code>outline-style</code> প্রপার্টি সেট না করা পর্যন্ত অন্য কোনো আউটলাইন প্রপার্টির কোনো প্রভাব থাকবে না!</p>\n<hr>' },
      { id: '_A1oDnk7gu5j', text: 'CSS Outline Color', type: 'heading', level: 2, anchor: 'css-outline-color' },
      { id: 'tcrZBHWqAq7L', type: 'richtext', html: `<p>আউটলাইনের রঙ সেট করতে <code>outline-color</code> প্রপার্টি ব্যবহার করা হয়।</p>
<p>রঙ সেট করা যায় এভাবে:</p>
<ul>
                                <li>নাম - একটি রঙের নাম উল্লেখ করুন, যেমন "red"</li>
                                <li>RGB - একটি RGB মান উল্লেখ করুন, যেমন "rgb(255,0,0)"</li>
                                <li>Hex - একটি hex মান উল্লেখ করুন, যেমন "#ff0000"</li>
                                <li>invert - একটি কালার ইনভার্সন করে (যা নিশ্চিত করে যে যেকোনো ব্যাকগ্রাউন্ড রঙের ক্ষেত্রেই আউটলাইন দৃশ্যমান থাকবে)</li>
                                </ul>
<p>নিচের উদাহরণে বিভিন্ন রঙের কিছু আউটলাইন দেখানো হয়েছে।
                                এটাও লক্ষ্য করুন যে এই এলিমেন্টগুলোর আউটলাইনের ভেতরে একটি পাতলা কালো বর্ডারও আছে:</p>
<p style="border: 1px solid black;outline-style:solid;outline-color:red;">একটি সলিড লাল আউটলাইন।</p>
<p style="border: 1px solid black;outline-style:double;outline-color:green;">একটি ডাবল সবুজ আউটলাইন।</p>
<p style="border: 1px solid black;outline-style:outset;outline-color:yellow;">একটি আউটসেট হলুদ আউটলাইন।</p>` },
      { id: '5_kRBfYJrp3l', type: 'code', language: 'css', code: 'p.ex1 {\n  border: 1px solid black;\n  outline-style: solid;\n  outline-color: red;\n}\np.ex2 {\n  border: 1px solid black;\n  outline-style: double;\n  outline-color: green;\n}\np.ex3 {\n  border: 1px solid black;\n  outline-style: outset;\n  outline-color: yellow;\n}' },
      { id: 'VmW-1tr1ynWF', type: 'richtext', html: '<p>নিচের উদাহরণে <code>outline-color: invert</code> ব্যবহার করা হয়েছে, যা একটি কালার ইনভার্সন করে। এটি নিশ্চিত করে যে যেকোনো ব্যাকগ্রাউন্ড রঙের ক্ষেত্রেই আউটলাইন দৃশ্যমান থাকবে:</p>\n<p style="border: 1px solid yellow;outline-style:solid;outline-color:invert;">একটি সলিড ইনভার্ট আউটলাইন।</p>' },
      { id: 'CEHhwPCVRaix', type: 'code', language: 'css', code: 'p.ex1 {\n  border: 1px solid yellow;\n  outline-style: solid;\n  outline-color: invert;\n}' },
      { id: 'ODPyE6_mJoHk', type: 'richtext', html: '<hr>' },
      { id: '6mEQrvRkFnOa', text: 'CSS Outline Width', type: 'heading', level: 2, anchor: 'css-outline-width' },
      { id: '5qKNl2a79dH3', type: 'richtext', html: `<p><code class="w3-codespan">outline-width</code> প্রপার্টি আউটলাইনের প্রস্থ নির্ধারণ করে,
                                এবং এর নিচের যেকোনো একটি মান থাকতে পারে:</p>
<ul>
                                  <li>thin (সাধারণত 1px)</li>
                                  <li>medium (সাধারণত 3px)</li>
                                  <li>thick (সাধারণত 5px)</li>
                                  <li>একটি নির্দিষ্ট মাপ (px, pt, cm, em ইত্যাদিতে)</li>
                                </ul>
<p>নিচের উদাহরণে বিভিন্ন প্রস্থের কিছু আউটলাইন দেখানো হয়েছে:</p>
<p style="border: 1px solid black;outline-style:solid;outline-color:red;outline-width:thin;">একটি পাতলা আউটলাইন।</p>
<p style="border: 1px solid black;outline-style:solid;outline-color:red;outline-width:medium;">একটি মাঝারি আউটলাইন।</p>
<p style="border: 1px solid black;outline-style:solid;outline-color:red;outline-width:thick;">একটি মোটা আউটলাইন।</p>
<p style="border: 1px solid black;outline-style:solid;outline-color:red;outline-width:4px;">একটি 4px মোটা আউটলাইন।</p>` },
      { id: 'cwhq1GUbQwz7', type: 'code', language: 'css', code: 'p.ex1 {\n  border: 1px solid black;\n  outline-style: solid;\n  outline-color: red;\n  outline-width: thin;\n}\np.ex2 {\n  border: 1px solid black;\n  outline-style: solid;\n  outline-color: red;\n  outline-width: medium;\n}\np.ex3 {\n  border: 1px solid black;\n  outline-style: solid;\n  outline-color: red;\n  outline-width: thick;\n}\np.ex4 {\n  border: 1px solid black;\n  outline-style: solid;\n  outline-color: red;\n  outline-width: 4px;\n}' },
      { id: 'VS1l-WEP0l5G', type: 'richtext', html: '<hr>' },
      { id: 'uFL_nMagXwdx', text: 'CSS Outline - Shorthand প্রপার্টি', type: 'heading', level: 2, anchor: 'css-outline---shorthand-property' },
      { id: '0GZubRizxck-', type: 'richtext', html: `<p><code>outline</code> প্রপার্টি হলো নিচের পৃথক আউটলাইন প্রপার্টিগুলো
                                সেট করার একটি শর্টহ্যান্ড প্রপার্টি:</p>
<ul>
                                <li><code>outline-width</code></li>
                                <li><code>outline-style</code> (বাধ্যতামূলক)</li>
                                <li><code>outline-color</code></li>
                                </ul>
<p>উপরের তালিকা থেকে এক,
                                দুই, বা তিনটি মান দিয়ে <code>outline</code> প্রপার্টি নির্ধারণ করা হয়। মানগুলোর ক্রম
                                কোনো ব্যাপার নয়।</p>
<p>নিচের উদাহরণে শর্টহ্যান্ড <code>outline</code>
                                প্রপার্টি দিয়ে নির্ধারিত কিছু আউটলাইন দেখানো হয়েছে:</p>
<p style="outline: dashed;">একটি ড্যাশড আউটলাইন।</p>
<p style="outline: dotted red;">একটি ডটেড লাল আউটলাইন।</p>
<p style="outline: 5px solid yellow;">একটি 5px সলিড হলুদ আউটলাইন।</p>
<p style="outline: ridge thick pink;">একটি মোটা রিজ গোলাপি আউটলাইন।</p>` },
      { id: 'gc67mHu7mGxO', type: 'code', language: 'css', code: 'p.ex1 {outline: dashed;}\np.ex2 {outline: dotted red;}\np.ex3 {outline: 5px solid yellow;}\np.ex4 {outline: thick ridge pink;}' },
      { id: 'BHs8042A-GDZ', type: 'richtext', html: '<hr>' },
      { id: 'Q5BiTaHy9yN4', text: 'CSS Outline Offset', type: 'heading', level: 2, anchor: 'css-outline-offset' },
      { id: 'HbIC4djvpCLO', type: 'richtext', html: `<p><code>outline-offset</code> প্রপার্টি একটি এলিমেন্টের আউটলাইন এবং
                                এজ/বর্ডারের মধ্যে জায়গা যোগ করে। একটি এলিমেন্ট এবং তার আউটলাইনের মধ্যেকার
                                জায়গা স্বচ্ছ থাকে।</p>
<p>নিচের উদাহরণে বর্ডার এজের 15px বাইরে একটি আউটলাইন নির্ধারণ করা হয়েছে:</p>
<p style="margin:30px;border:1px solid black;outline:1px solid red;outline-offset:15px;">
                                এই প্যারাগ্রাফের বর্ডার এজের 15px বাইরে একটি আউটলাইন আছে।</p>` },
      { id: 'LNCBFvCdUYTq', type: 'code', language: 'css', code: 'p {\n  margin: 30px;\n  border: 1px solid black;\n  outline: 1px solid red;\n  outline-offset: 15px;\n}' },
      { id: 'K4jthNOntMcx', type: 'richtext', html: `<p>নিচের উদাহরণে দেখানো হয়েছে যে একটি এলিমেন্ট এবং তার আউটলাইনের মধ্যেকার জায়গা স্বচ্ছ:</p>
<p style="margin:30px;background:yellow;border:1px solid black;outline:1px solid red;outline-offset:15px;">
                                এই প্যারাগ্রাফের বর্ডার এজের 15px বাইরে একটি আউটলাইন আছে।</p>` },
      { id: '3KQEN7ZPEkYw', type: 'code', language: 'css', code: 'p {\n  margin: 30px;\n  background: yellow;\n  border: 1px solid black;\n  outline: 1px solid red;\n  outline-offset: 15px;\n}' },
      { id: '1QAV0DsmKnIc', type: 'richtext', html: '<hr>' },
      { id: 'QBkE5P8Kl0cM', text: 'সব CSS Outline প্রপার্টি', type: 'heading', level: 2, anchor: 'all-css-outline-properties' },
      { id: 'YdZzhVw_0PV7', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
        ['outline', 'এক ঘোষণায় outline-width, outline-style এবং outline-color সেট করার একটি শর্টহ্যান্ড প্রপার্টি'],
        ['outline-color', 'একটি আউটলাইনের রঙ সেট করে'],
        ['outline-offset', 'একটি আউটলাইন এবং এলিমেন্টের এজ বা বর্ডারের মধ্যেকার জায়গা নির্ধারণ করে'],
        ['outline-style', 'একটি আউটলাইনের স্টাইল সেট করে'],
        ['outline-width', 'একটি আউটলাইনের প্রস্থ সেট করে'],
      ] },
    ],
    toc: [
      { id: 'css-outline', text: 'CSS আউটলাইন', level: 2 },
      { id: 'css-outline-style', text: 'CSS Outline Style', level: 2 },
      { id: 'css-outline-color', text: 'CSS Outline Color', level: 2 },
      { id: 'css-outline-width', text: 'CSS Outline Width', level: 2 },
      { id: 'css-outline---shorthand-property', text: 'CSS Outline - Shorthand প্রপার্টি', level: 2 },
      { id: 'css-outline-offset', text: 'CSS Outline Offset', level: 2 },
      { id: 'all-css-outline-properties', text: 'সব CSS Outline প্রপার্টি', level: 2 },
    ],
  },
  {
    id: 'e4d25864-038d-46a6-bd61-5c988a4c3e2e', // css/overflow
    title: 'CSS ওভারফ্লো',
    meta_description: 'CSS overflow, overflow-x, overflow-y প্রপার্টি এবং visible, hidden, scroll, auto মান কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: '2U2PIGordhd4', type: 'richtext', html: '<hr>\n<p>CSS-এর <code>overflow</code> প্রপার্টি নিয়ন্ত্রণ করে, কনটেন্ট একটি এলাকায় ফিট হওয়ার জন্য খুব বড় হলে কী ঘটবে।</p>\n<hr>' },
      { id: 'NnonEuXUKZPo', text: 'CSS ওভারফ্লো', type: 'heading', level: 2, anchor: 'css-overflow' },
      { id: '5j-vVlaK1pji', type: 'richtext', html: `<p>একটি এলিমেন্টের কনটেন্ট নির্দিষ্ট
                                এলাকায় ফিট হওয়ার জন্য খুব বড় হলে, কনটেন্ট ক্লিপ করতে হবে নাকি স্ক্রলবার যোগ করতে হবে তা <code>overflow</code> প্রপার্টি নির্ধারণ করে।</p>
<p><code>overflow</code> প্রপার্টির নিচের মানগুলো আছে:</p>
<ul>
                                    <li><code>visible</code> - ডিফল্ট। ওভারফ্লো ক্লিপ করা হয় না।
                                    কনটেন্ট এলিমেন্টের বক্সের বাইরে রেন্ডার হয়</li>
                                    <li><code>hidden</code> - ওভারফ্লো ক্লিপ করা হয়, এবং বাকি কনটেন্ট অদৃশ্য থাকবে</li>
                                    <li><code>scroll</code> - ওভারফ্লো ক্লিপ করা হয়, এবং বাকি কনটেন্ট দেখার জন্য একটি স্ক্রলবার যোগ করা হয়</li>
                                    <li><code>auto</code> - <code>scroll</code>-এর
                                    মতোই, তবে এটি শুধু প্রয়োজনে স্ক্রলবার যোগ করে</li>
                                </ul>
<p><strong>মনে রাখবেন:</strong> <code>overflow</code> প্রপার্টি শুধুমাত্র নির্দিষ্ট height থাকা ব্লক এলিমেন্টের জন্য কাজ করে।</p>
<p><strong>মনে রাখবেন:</strong> OS X Lion-এ (Mac-এ), স্ক্রলবার ডিফল্টভাবে লুকানো থাকে এবং শুধু ব্যবহারের সময় দেখা যায় ("overflow:scroll" সেট করা থাকলেও)।</p>
<hr>` },
      { id: '2Rc0hi6OVnAq', text: 'overflow: visible', type: 'heading', level: 2, anchor: 'overflow-visible' },
      { id: 'dReQDFOuSw5k', type: 'richtext', html: '<p>ডিফল্টভাবে, overflow হলো <code class="w3-codespan">visible</code>, অর্থাৎ এটি ক্লিপ করা হয় না এবং এটি \n                                এলিমেন্টের বক্সের বাইরে রেন্ডার হয়:</p>' },
      { id: 'abReF1WCW7IV', type: 'code', language: 'css', code: 'div {\n  width: 200px;\n  height: 50px;\n  background-color: #eee;\n  overflow: visible;\n}' },
      { id: 'yQEWE3C01Mre', type: 'richtext', html: '<hr>' },
      { id: 'NUYO7TUDiDPn', text: 'overflow: hidden', type: 'heading', level: 2, anchor: 'overflow-hidden' },
      { id: '9QwICwVGCQBl', type: 'richtext', html: '<p><code>hidden</code> মান দিয়ে, ওভারফ্লো ক্লিপ করা হয়, এবং বাকি কনটেন্ট লুকানো থাকে:</p>' },
      { id: 'QyOpU6cODPKQ', type: 'code', language: 'css', code: 'div {\n  overflow: hidden;\n}' },
      { id: 'KHlIky9hRCX4', type: 'richtext', html: '<hr>' },
      { id: 'kFEnAWE_K9Vm', text: 'overflow: scroll', type: 'heading', level: 2, anchor: 'overflow-scroll' },
      { id: 'dJ2wDoD3jx-S', type: 'richtext', html: '<p>মান <code>scroll</code>-এ সেট করলে, ওভারফ্লো ক্লিপ করা হয় এবং বক্সের ভেতরে স্ক্রল করার জন্য একটি স্ক্রলবার যোগ করা হয়। মনে রাখবেন যে এটি অনুভূমিক এবং উল্লম্ব — দুই দিকেই স্ক্রলবার যোগ করবে (এমনকি আপনার প্রয়োজন না হলেও):</p>' },
      { id: 'VSVUbHcUeLmw', type: 'code', language: 'css', code: 'div {\n    overflow: scroll;\n}' },
      { id: 'hyeKNObdy8Eb', type: 'richtext', html: '<hr>' },
      { id: 'Ez0BLuveLSP4', text: 'overflow: auto', type: 'heading', level: 2, anchor: 'overflow-auto' },
      { id: 'lLU7Tp7Xdira', type: 'richtext', html: '<p><code>auto</code> মান <code>scroll</code>-এর মতোই, তবে এটি শুধু প্রয়োজনে স্ক্রলবার যোগ করে:</p>' },
      { id: 'LxrFz6mSbiZ5', type: 'code', language: 'css', code: 'div {\n    overflow: auto;\n}' },
      { id: '_lJOqeXoW_ER', type: 'richtext', html: '<hr>' },
      { id: '9B0vhk-yIJeF', text: 'overflow-x এবং overflow-y', type: 'heading', level: 2, anchor: 'overflow-x-and-overflow-y' },
      { id: 'nkzic_32TLG8', type: 'richtext', html: '<p><code>overflow-x</code> এবং <code>overflow-y</code> প্রপার্টি নির্ধারণ করে কনটেন্টের ওভারফ্লো শুধু অনুভূমিকভাবে বা উল্লম্বভাবে (অথবা উভয়ভাবে) পরিবর্তন করা হবে কিনা:</p>\n<p><code>overflow-x</code> নির্ধারণ করে কনটেন্টের বাম/ডান এজের সাথে কী করা হবে।</p>\n<p><code>overflow-y</code> নির্ধারণ করে কনটেন্টের উপরের/নিচের এজের সাথে কী করা হবে।</p>' },
      { id: 'EB_te-xjBu6H', type: 'code', language: 'css', code: 'div {\n    overflow-x: hidden; /* অনুভূমিক স্ক্রলবার লুকান */\n    overflow-y: scroll; /* উল্লম্ব স্ক্রলবার যোগ করুন */\n}' },
      { id: '4VHLf0WG7llD', type: 'richtext', html: '<hr>' },
      { id: '9PEUmuZAIWNX', text: 'সব CSS Overflow প্রপার্টি', type: 'heading', level: 2, anchor: 'all-css-overflow-properties' },
      { id: 'RFZ1MkhN6IGY', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
        ['overflow', "কনটেন্ট একটি এলিমেন্টের বক্স থেকে ওভারফ্লো হলে কী ঘটবে তা নির্ধারণ করে"],
        ['overflow-x', "কনটেন্ট এলিমেন্টের কনটেন্ট এরিয়া থেকে ওভারফ্লো হলে বাম/ডান এজের সাথে কী করতে হবে তা নির্ধারণ করে"],
        ['overflow-y', "কনটেন্ট এলিমেন্টের কনটেন্ট এরিয়া থেকে ওভারফ্লো হলে উপরের/নিচের এজের সাথে কী করতে হবে তা নির্ধারণ করে"],
      ] },
    ],
    toc: [
      { id: 'css-overflow', text: 'CSS ওভারফ্লো', level: 2 },
      { id: 'overflow-visible', text: 'overflow: visible', level: 2 },
      { id: 'overflow-hidden', text: 'overflow: hidden', level: 2 },
      { id: 'overflow-scroll', text: 'overflow: scroll', level: 2 },
      { id: 'overflow-auto', text: 'overflow: auto', level: 2 },
      { id: 'overflow-x-and-overflow-y', text: 'overflow-x এবং overflow-y', level: 2 },
      { id: 'all-css-overflow-properties', text: 'সব CSS Overflow প্রপার্টি', level: 2 },
    ],
  },
  {
    id: '79658d56-1ab8-436f-8594-08746323fd28', // css/padding
    title: 'CSS প্যাডিং',
    meta_description: 'CSS padding প্রপার্টি, প্রতিটি পাশের প্যাডিং, শর্টহ্যান্ড প্রপার্টি এবং box-sizing কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'ewoMq5KktGgL', type: 'richtext', html: '<hr>\n<p style="border:1px solid #4CAF50; padding:40px;">এই এলিমেন্টের প্যাডিং 40px।</p>\n<hr>' },
      { id: 'sI4B7O6001jc', text: 'CSS প্যাডিং', type: 'heading', level: 2, anchor: 'css-padding' },
      { id: 'yEFJOvwmhcS4', type: 'richtext', html: '<p>একটি এলিমেন্টের নির্ধারিত বর্ডারের ভেতরে, কনটেন্টের চারপাশে জায়গা তৈরি করতে CSS-এর <code>padding</code> প্রপার্টি ব্যবহার করা হয়।</p>\n<p>CSS দিয়ে, প্যাডিংয়ের উপর আপনার সম্পূর্ণ নিয়ন্ত্রণ থাকে। একটি এলিমেন্টের প্রতিটি পাশের (উপর, ডান, নিচ, এবং বাম) প্যাডিং সেট করার জন্য প্রপার্টি রয়েছে।</p>\n<hr>' },
      { id: 'wiCtDCaEI5my', text: 'প্যাডিং - প্রতিটি পাশ আলাদাভাবে', type: 'heading', level: 2, anchor: 'padding---individual-sides' },
      { id: 'kJvEbMy8Lr6q', type: 'richtext', html: `<p>একটি এলিমেন্টের প্রতিটি পাশের প্যাডিং নির্ধারণের জন্য CSS-এ প্রপার্টি রয়েছে:</p>
<ul>
                                    <li><code>padding-top</code></li>
                                    <li><code>padding-right</code></li>
                                    <li><code>padding-bottom</code></li>
                                    <li><code>padding-left</code></li>
                                </ul>
<p>সব padding প্রপার্টির নিচের মানগুলো থাকতে পারে:</p>
<ul>
                                    <li>length - px, pt, cm ইত্যাদিতে একটি প্যাডিং নির্ধারণ করে</li>
                                    <li>% - কন্টেইনিং এলিমেন্টের প্রস্থের শতাংশে একটি প্যাডিং নির্ধারণ করে</li>
                                    <li>inherit - নির্ধারণ করে যে প্যাডিং প্যারেন্ট এলিমেন্ট থেকে ইনহেরিট হবে</li>
                                </ul>
<p><b>মনে রাখবেন:</b> ঋণাত্মক মান অনুমোদিত নয়।</p>
<p>একটি &lt;div&gt; এলিমেন্টের চারটি পাশের জন্য ভিন্ন ভিন্ন প্যাডিং সেট করুন:</p>` },
      { id: '9ra7aS1fHHCe', type: 'code', language: 'css', code: 'div {\n  padding-top: 50px;\n  padding-right: 30px;\n  padding-bottom: 50px;\n  padding-left: 80px;\n}' },
      { id: 'stX-7QSm0RCv', type: 'richtext', html: '<hr>' },
      { id: 'quwGEo99koYv', text: 'প্যাডিং - শর্টহ্যান্ড প্রপার্টি', type: 'heading', level: 2, anchor: 'padding---shorthand-property' },
      { id: 'B2e_Knu2hIyE', type: 'richtext', html: `<p>কোড ছোট করতে, একটি প্রপার্টিতে সব padding প্রপার্টি নির্ধারণ করা সম্ভব।</p>
<p><code>padding</code> প্রপার্টি হলো নিচের পৃথক padding প্রপার্টিগুলোর একটি শর্টহ্যান্ড প্রপার্টি:</p>
<ul>
                                    <li><code>padding-top</code></li>
                                    <li><code>padding-right</code></li>
                                    <li><code>padding-bottom</code></li>
                                    <li><code>padding-left</code></li>
                                </ul>
<p>তো, এটি এভাবে কাজ করে:</p>
<p><code>padding</code> প্রপার্টিতে চারটি মান থাকলে:</p>
<ul>
                                    <li><b>padding: 25px 50px 75px 100px;</b>
                                        <ul>
                                            <li>উপরের প্যাডিং 25px</li>
                                            <li>ডানের প্যাডিং 50px</li>
                                            <li>নিচের প্যাডিং 75px</li>
                                            <li>বামের প্যাডিং 100px</li>
                                        </ul>
                                    </li>
                                </ul>
<p>চারটি মানসহ padding শর্টহ্যান্ড প্রপার্টি ব্যবহার করুন:</p>` },
      { id: 'vLOSCeEaO1hr', type: 'code', language: 'css', code: 'div {\n  padding: 25px 50px 75px 100px;\n}' },
      { id: 'qneuZiG3xCfy', type: 'richtext', html: `<p>padding প্রপার্টিতে তিনটি মান থাকলে:</p>
<ul>
                                    <li><b>padding: 25px 50px 75px;</b>
                                        <ul>
                                            <li>উপরের প্যাডিং 25px</li>
                                            <li>ডান ও বামের প্যাডিং 50px</li>
                                            <li>নিচের প্যাডিং 75px</li>
                                        </ul>
                                    </li>
                                </ul>
<p>তিনটি মানসহ padding শর্টহ্যান্ড প্রপার্টি ব্যবহার করুন:</p>` },
      { id: '47cydeUwBT9f', type: 'code', language: 'css', code: 'div {\n  padding: 25px 50px 75px;\n}' },
      { id: 'FDYuqTWWSWfT', type: 'richtext', html: `<p>padding প্রপার্টিতে দুটি মান থাকলে:</p>
<ul>
                                    <li><b>padding: 25px 50px;</b>
                                        <ul>
                                            <li>উপর ও নিচের প্যাডিং 25px</li>
                                            <li>ডান ও বামের প্যাডিং 50px</li>
                                        </ul>
                                    </li>
                                </ul>
<p>দুটি মানসহ padding শর্টহ্যান্ড প্রপার্টি ব্যবহার করুন:</p>` },
      { id: 'wyhhXJ9rNi-4', type: 'code', language: 'css', code: 'div {\n  padding: 25px 50px;\n}' },
      { id: 'mNWBXqArTUOL', type: 'richtext', html: `<p>padding প্রপার্টিতে একটি মান থাকলে:</p>
<ul>
                                    <li><b>padding: 25px;</b>
                                        <ul>
                                            <li>চারটি প্যাডিংই 25px</li>
                                        </ul>
                                    </li>
                                </ul>
<p>একটি মানসহ padding শর্টহ্যান্ড প্রপার্টি ব্যবহার করুন:</p>` },
      { id: 'eDhZffHgXGQ1', type: 'code', language: 'css', code: 'div {\n  padding: 25px;\n}' },
      { id: 'la0XRZmpoQyy', type: 'richtext', html: '<hr>' },
      { id: 'TP3OlTCd2eVS', text: 'প্যাডিং এবং এলিমেন্টের প্রস্থ', type: 'heading', level: 2, anchor: 'padding-and-element-width' },
      { id: '_AaLwax1h2bk', type: 'richtext', html: '<p>CSS-এর width প্রপার্টি এলিমেন্টের কনটেন্ট এরিয়ার প্রস্থ নির্ধারণ করে। কনটেন্ট এরিয়া হলো একটি এলিমেন্টের প্যাডিং, বর্ডার এবং মার্জিনের ভেতরের অংশ (<a href="#">বক্স মডেল</a>)।</p>\n<p>তাই, একটি এলিমেন্টের নির্দিষ্ট width থাকলে, সেই এলিমেন্টে যোগ করা প্যাডিং এলিমেন্টের মোট প্রস্থে যোগ হবে। এটি প্রায়ই অনাকাঙ্ক্ষিত ফলাফল দেয়।</p>\n<p>এখানে, &lt;div&gt; এলিমেন্টকে 300px width দেওয়া হয়েছে। তবে, &lt;div&gt; এলিমেন্টের প্রকৃত প্রস্থ হবে 350px (300px + বামের 25px প্যাডিং + ডানের 25px প্যাডিং):</p>' },
      { id: '0P7v5fOJIiiH', type: 'code', language: 'css', code: 'div {\n  width: 300px;\n  padding: 25px;\n}' },
      { id: 'PUnwCBbbTlGT', type: 'richtext', html: '<p>প্যাডিংয়ের পরিমাণ যাই হোক না কেন, width 300px রাখতে, আপনি <code>box-sizing</code> প্রপার্টি ব্যবহার করতে পারেন। এর ফলে এলিমেন্টটি তার প্রস্থ বজায় রাখে; আপনি প্যাডিং বাড়ালে, উপলব্ধ কনটেন্ট জায়গা কমে যাবে।</p>\n<p>প্যাডিংয়ের পরিমাণ যাই হোক না কেন, width 300px রাখতে box-sizing প্রপার্টি ব্যবহার করুন:</p>' },
      { id: 'ZvaIWDcI4XZW', type: 'code', language: 'css', code: 'div {\n  width: 300px;\n  padding: 25px;\n  box-sizing: border-box;\n}' },
      { id: 'i59Ezr-pnkvb', type: 'richtext', html: '<hr>' },
      { id: 'B4nGHEZkBRNV', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
        ['padding', 'এক ঘোষণায় সব padding প্রপার্টি সেট করার একটি শর্টহ্যান্ড প্রপার্টি'],
        ['padding-bottom', 'একটি এলিমেন্টের নিচের প্যাডিং সেট করে'],
        ['padding-left', 'একটি এলিমেন্টের বামের প্যাডিং সেট করে'],
        ['padding-right', 'একটি এলিমেন্টের ডানের প্যাডিং সেট করে'],
        ['padding-top', 'একটি এলিমেন্টের উপরের প্যাডিং সেট করে'],
      ] },
    ],
    toc: [
      { id: 'css-padding', text: 'CSS প্যাডিং', level: 2 },
      { id: 'padding---individual-sides', text: 'প্যাডিং - প্রতিটি পাশ আলাদাভাবে', level: 2 },
      { id: 'padding---shorthand-property', text: 'প্যাডিং - শর্টহ্যান্ড প্রপার্টি', level: 2 },
      { id: 'padding-and-element-width', text: 'প্যাডিং এবং এলিমেন্টের প্রস্থ', level: 2 },
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
console.log(`css batch3: ${ok}/${docs.length} written`)
