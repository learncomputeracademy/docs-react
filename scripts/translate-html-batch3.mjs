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
    id: 'cd6defd3-f567-4f7b-b099-28c8b554dd80', // html/basic
    title: 'HTML মৌলিক বিষয়',
    meta_description: 'HTML ডকুমেন্ট, হেডিং, প্যারাগ্রাফ, লিঙ্ক, ইমেজ, বাটন এবং লিস্টের মৌলিক ব্যবহার জানুন।',
    blocks: [
      { id: 'pJZY2VkdBscL', type: 'richtext', html: '<hr>' },
      { id: 'E7glssPqwFlE', text: 'HTML ডকুমেন্ট', type: 'heading', level: 2, anchor: 'html-documents' },
      { id: '40CsJuydZpmB', type: 'richtext', html: '<p>সব HTML ডকুমেন্ট অবশ্যই একটি ডকুমেন্ট টাইপ ঘোষণা দিয়ে শুরু হতে হবে: <code>&lt;!DOCTYPE html&gt;</code> ।</p>\n<p>HTML ডকুমেন্ট নিজেই <code>&lt;html&gt;</code> দিয়ে শুরু হয় এবং <code>&lt;/html&gt;</code> দিয়ে শেষ হয়।</p>\n<p>HTML ডকুমেন্টের দৃশ্যমান অংশ থাকে <code>&lt;body&gt;</code> এবং <code>&lt;/body&gt;</code>-এর মধ্যে।</p>' },
      { id: 'AWnD_dJhOIFN', type: 'code', language: 'html', code: '<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n<h1>My First Heading</h1>\n<p>My first paragraph.</p>\n</body>\n</html>' },
      { id: 'gQ6-9NyU2O78', type: 'richtext', html: '<hr>' },
      { id: 'zVzodctlsxNF', text: 'HTML হেডিং', type: 'heading', level: 2, anchor: 'html-headings' },
      { id: 'ev9RNF2ij6It', type: 'richtext', html: '<p>HTML হেডিং <code>&lt;h1&gt;</code> থেকে <code>&lt;h6&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়।</p>\n<p><code>&lt;h1&gt;</code> সবচেয়ে গুরুত্বপূর্ণ হেডিং নির্ধারণ করে। <code>&lt;h6&gt;</code> সবচেয়ে কম গুরুত্বপূর্ণ হেডিং নির্ধারণ করে: </p>' },
      { id: 'f1v3vu-70Hvx', type: 'code', language: 'html', code: '<h1>My First Heading</h1>\n<h2>My First Heading</h2>\n<h3>My First Heading</h3>\n<h4>My First Heading</h4>\n<h5>My First Heading</h5>\n<h6>My First Heading</h6>' },
      { id: 'QkZvXxgChTOJ', type: 'richtext', html: '<hr>' },
      { id: 'Ho8sceseEfU6', text: 'HTML প্যারাগ্রাফ', type: 'heading', level: 2, anchor: 'html-paragraphs' },
      { id: 'XFmAaic5AsC7', type: 'richtext', html: '<p>HTML প্যারাগ্রাফ <code>&lt;p&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়:</p>' },
      { id: 'Ea1nwyTVei1E', type: 'code', language: 'html', code: '<p>This is paragraph.</p>\n<p>This is another paragraph.</p>' },
      { id: '9gQWWlzSDTVR', type: 'richtext', html: '<hr>' },
      { id: '6EzEQRqHHSK5', text: 'HTML লিঙ্ক', type: 'heading', level: 2, anchor: 'html-links' },
      { id: 'ck2JKe9dC1NY', type: 'richtext', html: '<p>HTML লিঙ্ক <code>&lt;a&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়:</p>' },
      { id: 'V7r-DZe5efrz', type: 'code', language: 'html', code: '<a href="https://www.learncomputer.in">This is a link.</a>' },
      { id: 'GROx6FJb0Hxh', type: 'richtext', html: '<p>লিঙ্কের গন্তব্য <code>href</code> অ্যাট্রিবিউটে উল্লেখ করা হয়।</p>\n<p>HTML এলিমেন্ট সম্পর্কে অতিরিক্ত তথ্য দিতে অ্যাট্রিবিউট ব্যবহার করা হয়।</p>\n<hr>' },
      { id: 'sNChArbhVloy', text: 'HTML ইমেজ', type: 'heading', level: 2, anchor: 'html-images' },
      { id: '3AQuELoGqrCN', type: 'richtext', html: '<p>HTML ইমেজ <code>&lt;img&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়।</p>\n<p>সোর্স ফাইল (<code>src</code>), বিকল্প টেক্সট (<code>alt</code>), <code>width</code>, এবং <code>height</code> অ্যাট্রিবিউট হিসেবে দেওয়া হয়:</p>' },
      { id: '_uYL5i7DiUm2', type: 'code', language: 'html', code: '<img src="img_girl.jpg" alt="W3Schools.com" width="104" height="142">' },
      { id: '_ES93p6sE9jp', type: 'richtext', html: '<p>width এবং height ডিফল্টভাবে পিক্সেলে উল্লেখ করা হয়; তাই width="500" মানে 500 পিক্সেল প্রশস্ত।</p>\n<hr>' },
      { id: 'w72JeJURQkIa', text: 'HTML বাটন', type: 'heading', level: 2, anchor: 'html-buttons' },
      { id: '0t1whnD-ApHT', type: 'richtext', html: '<p>HTML বাটন <code>&lt;button&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়:</p>' },
      { id: '110DzMUeEOHO', type: 'code', language: 'html', code: '<button>Click me</button>' },
      { id: 'WXwcZ-slphgY', type: 'richtext', html: '<hr>' },
      { id: 'QWHiY0FyUxhy', text: 'HTML লিস্ট', type: 'heading', level: 2, anchor: 'html-lists' },
      { id: 'mo7BHoeQ0G6g', type: 'richtext', html: '<p>HTML লিস্ট <code>&lt;ul&gt;</code> (আনঅর্ডার্ড/বুলেট লিস্ট) বা <code>&lt;ol&gt;</code> (অর্ডার্ড/নাম্বারড লিস্ট) ট্যাগ দিয়ে নির্ধারণ করা হয়, তারপর <code>&lt;li&gt;</code> ট্যাগ (লিস্ট আইটেম) আসে:</p>' },
      { id: 'QFdq8jZuQr6L', type: 'code', language: 'html', code: '<ul>          \n    <li>Coffee</li>\n    <li>Tea</li>\n    <li>Milk</li>\n</ul>\n\n<ol>\n    <li>Coffee</li>\n    <li>Tea</li>\n    <li>Milk</li>\n</ol>' },
    ],
    toc: [
      { id: 'html-documents', text: 'HTML ডকুমেন্ট', level: 2 },
      { id: 'html-headings', text: 'HTML হেডিং', level: 2 },
      { id: 'html-paragraphs', text: 'HTML প্যারাগ্রাফ', level: 2 },
      { id: 'html-links', text: 'HTML লিঙ্ক', level: 2 },
      { id: 'html-images', text: 'HTML ইমেজ', level: 2 },
      { id: 'html-buttons', text: 'HTML বাটন', level: 2 },
      { id: 'html-lists', text: 'HTML লিস্ট', level: 2 },
    ],
  },
  {
    id: 'a8ed053d-3d08-40e6-a4ba-777e7bc47677', // html/blocks
    title: 'HTML ব্লক',
    meta_description: 'HTML-এ ব্লক-লেভেল ও ইনলাইন এলিমেন্টের পার্থক্য, এবং div ও span এলিমেন্টের ব্যবহার জানুন।',
    blocks: [
      { id: 'XDKzfP_-aab8', type: 'richtext', html: '<hr>\n<p>প্রতিটি HTML এলিমেন্টের একটি ডিফল্ট display মান থাকে, যা নির্ভর করে সেটি কোন ধরনের এলিমেন্ট তার উপর।</p>\n<p>দুটি display মান হলো: block এবং inline।</p>\n<hr>' },
      { id: 'uG9P_YyN9W76', text: 'ব্লক-লেভেল এলিমেন্ট', type: 'heading', level: 2, anchor: 'block-level-elements' },
      { id: 'QL3w8Ihi4tg2', type: 'richtext', html: '<p>একটি ব্লক-লেভেল এলিমেন্ট সবসময় একটি নতুন লাইনে শুরু হয় এবং যতটা সম্ভব প্রশস্ততা (বাম ও ডানে যতদূর সম্ভব) দখল করে।</p>\n<div class="border border-success p-2 mb-4">&lt;div&gt; এলিমেন্ট একটি ব্লক-লেভেল এলিমেন্ট।</div>' },
      { id: 'ijZrZnAngItJ', type: 'code', language: 'html', code: '<div>Hello World</div>' },
      { id: 'QCwpxfqDPmh8', type: 'richtext', html: `<p>HTML-এ ব্লক লেভেল এলিমেন্ট:</p>
<p><code>&lt;address&gt;</code>  <code>&lt;article&gt;</code>  <code>&lt;aside&gt;</code>  <code>&lt;blockquote&gt;</code>  <code>&lt;canvas&gt;</code>  <code>&lt;dd&gt;</code>  <code>&lt;div&gt;</code>  <code>&lt;dl&gt;</code>  <code>&lt;dt&gt;</code>  <code>&lt;fieldset&gt;</code>  <code>&lt;figcaption&gt;</code>  <code>&lt;figure&gt;</code>  <code>&lt;footer&gt;</code>  <code>&lt;form&gt;</code>  <code>&lt;h1&gt;</code>-<code>&lt;h6&gt;</code></p>
<p><code> &lt;header&gt;</code>  <code>&lt;hr&gt;</code>  <code>&lt;li&gt;</code>  <code>&lt;main&gt;</code>  <code>&lt;nav&gt;</code>  <code>&lt;noscript&gt;</code>  <code>&lt;ol&gt;</code>  <code>&lt;p&gt;</code>  <code>&lt;pre&gt;</code>  <code>&lt;section&gt;</code>  <code>&lt;table&gt;</code>  <code>&lt;tfoot&gt;</code>  <code>&lt;ul&gt;</code>  <code>&lt;video&gt;</code></p>
<hr>` },
      { id: 'RPefiJJ5_XbA', text: 'ইনলাইন এলিমেন্ট', type: 'heading', level: 2, anchor: 'inline-elements' },
      { id: 'pURRKBqELRPR', type: 'richtext', html: '<p>একটি ইনলাইন এলিমেন্ট নতুন লাইনে শুরু হয় না এবং শুধু প্রয়োজন অনুযায়ী প্রশস্ততা দখল করে।</p>\n<p>এটি একটি প্যারাগ্রাফের ভেতরে <span class="border border-success p-2 mb-4">একটি ইনলাইন &lt;span&gt; এলিমেন্ট</span>।</p>' },
      { id: 'oQLNAUM449Ip', type: 'code', language: 'html', code: '<span>Hello World</span>' },
      { id: 'odW2sOqkigPw', type: 'richtext', html: `<p>HTML-এ ইনলাইন লেভেল এলিমেন্ট:</p>
<p><code>&lt;a&gt;</code> <code>&lt;abbr&gt;</code> <code>&lt;acronym&gt;</code> <code>&lt;b&gt;</code> <code>&lt;bdo&gt;</code> <code>&lt;big&gt;</code> <code>&lt;br&gt;</code> <code>&lt;button&gt;</code> <code>&lt;dfn&gt;</code> <code>&lt;em&gt;</code> <code>&lt;i&gt;</code> <code>&lt;img&gt;</code> <code>&lt;input&gt;</code> <code>&lt;kbd&gt;</code> <code>&lt;label&gt;</code> <code>&lt;map&gt;</code> <code>&lt;object&gt;</code> <code>&lt;output&gt;</code> <code>&lt;q&gt;</code> <code>&lt;samp&gt;</code>
                                </p>
<p><code>&lt;script&gt;</code> <code>&lt;select&gt;</code> <code>&lt;small&gt;</code> <code>&lt;span&gt;</code> <code>&lt;strong&gt;</code> <code>&lt;sub&gt;</code> <code>&lt;sup&gt;</code> <code>&lt;textarea&gt;</code> <code>&lt;time&gt;</code> <code>&lt;tt&gt;</code> <code>&lt;var&gt;</code></p>
<hr>` },
      { id: '_VmtR7gKrMD3', text: '<div> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-div-element' },
      { id: 'gl8yW68ZmxMm', type: 'richtext', html: '<p><code>&lt;div&gt;</code> এলিমেন্ট প্রায়ই অন্যান্য HTML এলিমেন্টের জন্য একটি কন্টেইনার হিসেবে ব্যবহৃত হয়।</p>\n<p><code>&lt;div&gt;</code> এলিমেন্টের কোনো বাধ্যতামূলক অ্যাট্রিবিউট নেই, তবে <code>style</code>, <code>class</code> এবং <code>id</code> সাধারণত ব্যবহৃত হয়।</p>\n<p>CSS-এর সাথে একত্রে ব্যবহার করলে, <code>&lt;div&gt;</code> এলিমেন্ট কনটেন্টের ব্লক স্টাইল করতে ব্যবহার করা যায়:</p>' },
      { id: 'ZWH0vcdem3kd', type: 'code', language: 'html', code: '<div style="background-color:black;color:white;padding:20px;">\n    <h2>London</h2>\n    <p>London is the capital city of England. It is the most populous city in the United Kingdom, with a metropolitan area of over 13 million inhabitants.</p>\n</div>' },
      { id: '6Obvhw_v5yq0', type: 'richtext', html: '<hr>' },
      { id: 'ddfzffBfPj5B', text: '<span> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-span-element' },
      { id: '6TEG9HoPl79c', type: 'richtext', html: '<p><code>&lt;span&gt;</code> এলিমেন্ট প্রায়ই কিছু টেক্সটের জন্য একটি কন্টেইনার হিসেবে ব্যবহৃত হয়।</p>\n<p><code>&lt;span&gt;</code> এলিমেন্টের কোনো বাধ্যতামূলক অ্যাট্রিবিউট নেই, তবে <code>style</code>, <code>class</code> এবং <code>id</code> সাধারণত ব্যবহৃত হয়।</p>\n<p>CSS-এর সাথে একত্রে ব্যবহার করলে, <code>&lt;span&gt;</code> এলিমেন্ট টেক্সটের অংশবিশেষ স্টাইল করতে ব্যবহার করা যায়:</p>' },
      { id: 'zio4K7hbhZTG', type: 'code', language: 'html', code: '<h1>My <span style="color:red">Important</span> Heading</h1>' },
      { id: 'ZjjymNm_RhrK', type: 'richtext', html: '<hr>' },
      { id: 'SvTOahFIMJQs', text: 'HTML গ্রুপিং ট্যাগ', type: 'heading', level: 2, anchor: 'html-grouping-tags' },
      { id: 'WFVFPcyNy4UH', type: 'table', header: ['ট্যাগ', 'বিবরণ'], rows: [
        ['&lt;div&gt;', 'একটি ডকুমেন্টে একটি সেকশন নির্ধারণ করে (ব্লক-লেভেল)'],
        ['&lt;span&gt;', 'একটি ডকুমেন্টে একটি সেকশন নির্ধারণ করে (ইনলাইন)'],
      ] },
      { id: 'gLB2uUh0B2Uo', type: 'richtext', html: '<p><i>সব উপলব্ধ HTML ট্যাগের সম্পূর্ণ তালিকার জন্য, আমাদের HTML ট্যাগ রেফারেন্স দেখুন।</i></p>' },
    ],
    toc: [
      { id: 'block-level-elements', text: 'ব্লক-লেভেল এলিমেন্ট', level: 2 },
      { id: 'inline-elements', text: 'ইনলাইন এলিমেন্ট', level: 2 },
      { id: 'the-div-element', text: '<div> এলিমেন্ট', level: 2 },
      { id: 'the-span-element', text: '<span> এলিমেন্ট', level: 2 },
      { id: 'html-grouping-tags', text: 'HTML গ্রুপিং ট্যাগ', level: 2 },
    ],
  },
  {
    id: '7ebb03be-4c31-48ff-9a2a-c2fb92efea02', // html/classes
    title: 'HTML ক্লাস',
    meta_description: 'HTML class অ্যাট্রিবিউট কীভাবে ব্যবহার করবেন, একাধিক class এবং JavaScript থেকে class অ্যাক্সেস জানুন।',
    blocks: [
      { id: 'Ao7Cc_FLODC9', type: 'richtext', html: '<hr>' },
      { id: 'pvxzwIdq2dPE', text: 'class অ্যাট্রিবিউট ব্যবহার করা', type: 'heading', level: 2, anchor: 'using-the-class-attribute' },
      { id: 'CVd-na8pvwfC', type: 'richtext', html: '<p>একই class নামযুক্ত এলিমেন্টের জন্য একই রকম স্টাইল নির্ধারণ করতে HTML <code>class</code> অ্যাট্রিবিউট ব্যবহার করা হয়।</p>\n<p>অর্থাৎ, একই <code>class</code> অ্যাট্রিবিউটযুক্ত সব HTML এলিমেন্ট একই স্টাইল পাবে।</p>\n<p>এখানে আমাদের তিনটি <code>&lt;div&gt;</code> এলিমেন্ট আছে, যেগুলো একই class নাম নির্দেশ করে:</p>' },
      { id: 'e9Y7erAGsRCp', type: 'code', language: 'html', code: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        .cities {\n          background-color: black;\n          color: white;\n          margin: 20px;\n          padding: 20px;\n        } \n    </style>\n</head>\n<body>\n    <div class="cities">\n      <h2>London</h2>\n      <p>London is the capital of England.</p>\n    </div>\n    <div class="cities">\n      <h2>Paris</h2>\n      <p>Paris is the capital of France.</p>\n    </div>\n    <div class="cities">\n      <h2>Tokyo</h2>\n      <p>Tokyo is the capital of Japan.</p>\n    </div>\n</body>\n</html>' },
      { id: '-bBEL6NXLcjB', type: 'richtext', html: '<hr>' },
      { id: 'Dbht8hoO4dI7', text: 'ইনলাইন এলিমেন্টে class অ্যাট্রিবিউট ব্যবহার করা', type: 'heading', level: 2, anchor: 'using-the-class-attribute-on-inline-elements' },
      { id: 'uZ06KAfnZnW-', type: 'richtext', html: '<p>HTML <code>class</code> অ্যাট্রিবিউট ইনলাইন এলিমেন্টেও ব্যবহার করা যায়:</p>' },
      { id: 'g-EcXfv9LKN-', type: 'code', language: 'html', code: '<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        span.note {\n          font-size: 120%;\n          color: red;\n        }\n    </style>\n</head>\n<body>\n    <h1>My <span class="note">Important</span> Heading</h1>\n    <p>This is some <span class="note">important</span> text.</p>\n</body>\n</html>' },
      { id: 'Z3fa1yTPW9bl', type: 'richtext', html: '<p><b>টিপস:</b> <code>class</code> অ্যাট্রিবিউট যেকোনো HTML এলিমেন্টে ব্যবহার করা যায়।</p>\n<p><b>মনে রাখবেন:</b> class নাম <code>কেস-সেনসিটিভ!</code></p>\n<p><b>টিপস:</b> আমাদের CSS টিউটোরিয়ালে CSS সম্পর্কে আরও অনেক কিছু জানতে পারবেন।</p>\n<hr>' },
      { id: 'a8YR3tkeX_Bp', text: 'নির্দিষ্ট Class-যুক্ত এলিমেন্ট সিলেক্ট করা', type: 'heading', level: 2, anchor: 'select-elements-with-a-specific-class' },
      { id: 'l0iydCWUthEY', type: 'richtext', html: '<p>CSS-এ, নির্দিষ্ট class-যুক্ত এলিমেন্ট সিলেক্ট করতে, একটি ডট (.) চিহ্ন লিখে তারপর class-এর নাম লিখতে হয়:</p>\n<p><i>"city" class নামযুক্ত সব এলিমেন্ট স্টাইল করতে CSS ব্যবহার করুন:</i></p>' },
      { id: 'ZxcE0yn0NIJA', type: 'code', language: 'html', code: '<style>\n    .city {\n      background-color: tomato;\n      color: white;\n      padding: 10px;\n    } \n</style>\n<h2 class="city">London</h2>\n<p>London is the capital of England.</p>\n<h2 class="city">Paris</h2>\n<p>Paris is the capital of France.</p>\n<h2 class="city">Tokyo</h2>\n<p>Tokyo is the capital of Japan.</p>' },
      { id: 'OlYr-5ysx30Y', type: 'richtext', html: '<hr>' },
      { id: 'xovN4hkfVkPb', text: 'একাধিক ক্লাস', type: 'heading', level: 2, anchor: 'multiple-classes' },
      { id: '4CqGMC_CnTmL', type: 'richtext', html: '<p>একটি HTML এলিমেন্টের একাধিক class নাম থাকতে পারে, প্রতিটি class নামকে একটি স্পেস দিয়ে আলাদা করতে হয়।</p>\n<p><i>"city" class নামযুক্ত এলিমেন্ট এবং "main" class নামযুক্ত এলিমেন্ট, দুটোই স্টাইল করুন:</i></p>' },
      { id: 'RRKTRm0VVxy-', type: 'code', language: 'html', code: '<h2 class="city main">London</h2>\n<h2 class="city">Paris</h2>\n<h2 class="city">Tokyo</h2>' },
      { id: 'uKtBgA2_6ljq', type: 'richtext', html: '<p>উপরের উদাহরণে, প্রথম <code>&lt;h2&gt;</code> এলিমেন্টটি "city" এবং "main" — দুটো class-এরই অন্তর্গত।</p>\n<hr>' },
      { id: 'FhufWFV7xcOx', text: 'বিভিন্ন ট্যাগ একই Class শেয়ার করতে পারে', type: 'heading', level: 2, anchor: 'different-tags-can-share-same-class' },
      { id: 'xQ9xTsjW9dMa', type: 'richtext', html: '<p><code>&lt;h2&gt;</code> এবং <code>&lt;p&gt;</code>-এর মতো বিভিন্ন ট্যাগের একই class নাম থাকতে পারে, এবং এভাবে তারা একই স্টাইল শেয়ার করতে পারে:</p>' },
      { id: 'W3lC4RgzMQ1v', type: 'code', language: 'html', code: '<h2 class="city">Paris</h2>\n<p class="city">Paris is the capital of France</p>' },
      { id: 'TWHo8ZyerYpB', type: 'richtext', html: '<hr>' },
      { id: 'GZ_Sox2o6lli', text: 'JavaScript-এ class অ্যাট্রিবিউট ব্যবহার করা', type: 'heading', level: 2, anchor: 'using-the-class-attribute-in-javascript' },
      { id: 'xSQGemEkR5Dp', type: 'richtext', html: '<p>নির্দিষ্ট class নামযুক্ত এলিমেন্টের জন্য নির্দিষ্ট কিছু কাজ করতে JavaScript-ও class নাম ব্যবহার করতে পারে।</p>\n<p>JavaScript <code>getElementsByClassName()</code> মেথড ব্যবহার করে নির্দিষ্ট class নামযুক্ত এলিমেন্ট অ্যাক্সেস করতে পারে:</p>' },
      { id: 'lu12F1o5hdpu', type: 'code', language: 'html', code: '<script>\n    function myFunction() {\n      var x = document.getElementsByClassName("city");\n      for (var i = 0; i < x.length; i++) {\n        x[i].style.display = "none";\n      }\n    }\n</script>' },
    ],
    toc: [
      { id: 'using-the-class-attribute', text: 'class অ্যাট্রিবিউট ব্যবহার করা', level: 2 },
      { id: 'using-the-class-attribute-on-inline-elements', text: 'ইনলাইন এলিমেন্টে class অ্যাট্রিবিউট ব্যবহার করা', level: 2 },
      { id: 'select-elements-with-a-specific-class', text: 'নির্দিষ্ট Class-যুক্ত এলিমেন্ট সিলেক্ট করা', level: 2 },
      { id: 'multiple-classes', text: 'একাধিক ক্লাস', level: 2 },
      { id: 'different-tags-can-share-same-class', text: 'বিভিন্ন ট্যাগ একই Class শেয়ার করতে পারে', level: 2 },
      { id: 'using-the-class-attribute-in-javascript', text: 'JavaScript-এ class অ্যাট্রিবিউট ব্যবহার করা', level: 2 },
    ],
  },
  {
    id: '3e1bda44-0418-49a6-a0d1-3728ddd0e301', // html/links
    title: 'HTML লিঙ্ক',
    meta_description: 'HTML হাইপারলিঙ্ক, target অ্যাট্রিবিউট, ইমেজ-লিঙ্ক এবং লিঙ্ক টাইটেল কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'wD1ehcGinnM6', type: 'richtext', html: '<hr>\n<p>প্রায় সব ওয়েব পেজেই লিঙ্ক পাওয়া যায়। লিঙ্ক ব্যবহারকারীদের এক পেজ থেকে আরেক পেজে ক্লিক করে যেতে সাহায্য করে।</p>\n<hr>' },
      { id: 'mfVsOurROufd', text: 'HTML লিঙ্ক - হাইপারলিঙ্ক', type: 'heading', level: 2, anchor: 'html-links---hyperlinks' },
      { id: '1e2nWxNMUtkO', type: 'richtext', html: '<p>HTML লিঙ্ক হলো হাইপারলিঙ্ক।</p>\n<p>একটি লিঙ্কে ক্লিক করে আপনি অন্য একটি ডকুমেন্টে চলে যেতে পারেন।</p>\n<p>আপনি যখন মাউস একটি লিঙ্কের উপর নিয়ে যান, তখন মাউস অ্যারো একটি ছোট হাতের আকার নেবে।</p>\n<p class="note"><b>মনে রাখবেন: </b>একটি লিঙ্ক শুধু টেক্সট হতে হবে এমন নয়। এটি একটি ইমেজ বা অন্য যেকোনো HTML এলিমেন্ট হতে পারে।</p>\n<hr>' },
      { id: '8I9h8c9_pQhy', text: 'HTML লিঙ্ক - সিনট্যাক্স', type: 'heading', level: 2, anchor: 'html-links---syntax' },
      { id: 'pkjshRf5oBUC', type: 'richtext', html: '<p>হাইপারলিঙ্ক HTML <code>&lt;a&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়:</p>' },
      { id: 'ke5wb1TsI2W6', type: 'code', language: 'html', code: '<a href="https://www.learncomputer.in">Visit our HTML tutorial</a>' },
      { id: 'ARzejh3EPwqh', type: 'richtext', html: '<hr>\n<p><code>href</code> অ্যাট্রিবিউট লিঙ্কের গন্তব্য ঠিকানা (<code>https://www.learncomputer.in/</code>) নির্ধারণ করে।</p>\n<p><b>লিঙ্ক টেক্সট</b> হলো দৃশ্যমান অংশ (Visit our HTML tutorial)।</p>\n<p>লিঙ্ক টেক্সটে ক্লিক করলে আপনাকে নির্দিষ্ট ঠিকানায় নিয়ে যাবে।</p>\n<p class="note"><b>মনে রাখবেন:</b> সাবফোল্ডার ঠিকানার শেষে ফরোয়ার্ড স্ল্যাশ না দিলে, সার্ভারে দুটি রিকোয়েস্ট তৈরি হতে পারে। অনেক সার্ভার স্বয়ংক্রিয়ভাবে ঠিকানার শেষে একটি ফরোয়ার্ড স্ল্যাশ যোগ করে, এবং তারপর একটি নতুন রিকোয়েস্ট তৈরি করে।</p>\n<hr>' },
      { id: '8QFV2D0_u1fu', text: 'লোকাল লিঙ্ক', type: 'heading', level: 2, anchor: 'local-links' },
      { id: 'W5GAsas0KjWx', type: 'richtext', html: '<p>উপরের উদাহরণে একটি অ্যাবসোলিউট URL (সম্পূর্ণ ওয়েব ঠিকানা) ব্যবহার করা হয়েছে।</p>\n<p>একটি লোকাল লিঙ্ক (একই ওয়েবসাইটের লিঙ্ক) একটি রিলেটিভ URL দিয়ে (https://www.... ছাড়া) নির্ধারণ করা হয়।</p>' },
      { id: 'QobD6rekm2LP', type: 'code', language: 'html', code: '<a href="images.html">HTML Images</a>' },
      { id: 'SReP_2p5YpIr', type: 'richtext', html: '<hr>' },
      { id: 'hXO3zgNfhsUu', text: 'HTML লিঙ্কের রঙ', type: 'heading', level: 2, anchor: 'html-link-colors' },
      { id: 'fyV6649dlx3w', type: 'richtext', html: `<p>ডিফল্টভাবে, একটি লিঙ্ক এভাবে দেখাবে (সব ব্রাউজারে):</p>
<ul>
                                    <li>একটি না-দেখা (unvisited) লিঙ্ক আন্ডারলাইন করা এবং নীল রঙের হয়</li>
                                    <li>একটি দেখা (visited) লিঙ্ক আন্ডারলাইন করা এবং বেগুনি রঙের হয়</li>
                                    <li>একটি সক্রিয় (active) লিঙ্ক আন্ডারলাইন করা এবং লাল রঙের হয়</li>
                                </ul>
<hr>` },
      { id: 'iWuWJ3lP6W7A', text: 'HTML লিঙ্ক - target অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'html-links---the-target-attribute' },
      { id: '15aRCL7GH2Yn', type: 'richtext', html: `<p><code>target</code> অ্যাট্রিবিউট নির্ধারণ করে যে লিঙ্ক করা ডকুমেন্টটি কোথায় খুলবে।</p>
<p><code>target</code> অ্যাট্রিবিউটের নিচের যেকোনো একটি মান থাকতে পারে:</p>
<ul>
                                    <li><code>_blank</code> - লিঙ্ক করা ডকুমেন্টটি একটি নতুন উইন্ডো বা ট্যাবে খোলে</li>
                                    <li><code>_self</code> - লিঙ্ক করা ডকুমেন্টটি যে উইন্ডো/ট্যাবে ক্লিক করা হয়েছিল সেখানেই খোলে (এটি ডিফল্ট)</li>
                                    <li><code>_parent</code> - লিঙ্ক করা ডকুমেন্টটি প্যারেন্ট ফ্রেমে খোলে</li>
                                    <li><code>_top</code> - লিঙ্ক করা ডকুমেন্টটি উইন্ডোর পুরো বডিতে খোলে</li>
                                    <li>framename - লিঙ্ক করা ডকুমেন্টটি একটি নির্দিষ্ট নামের ফ্রেমে খোলে</li>
                                </ul>
<p>এই উদাহরণটি লিঙ্ক করা ডকুমেন্টটি একটি নতুন ব্রাউজার উইন্ডো/ট্যাবে খুলবে:</p>` },
      { id: 'LmTxawuVk8K0', type: 'code', language: 'html', code: '<a href="https://www.learncomputer.in/" target="_blank">Visit Learn Computer Academy!</a>' },
      { id: 'KKJgSVgUjQTH', type: 'richtext', html: '<p><b>টিপস:</b> আপনার ওয়েবপেজ যদি একটি ফ্রেমে আটকে থাকে, তাহলে ফ্রেম থেকে বের হতে target="_top" ব্যবহার করতে পারেন:</p>' },
      { id: 'taUCfnSxGgXw', type: 'code', language: 'html', code: '<a href="https://www.learncomputer.in/" target="_top">HTML5 tutorial!</a>' },
      { id: 'fbcdG5b3TxOn', type: 'richtext', html: '<hr>' },
      { id: 'cthkzX394DF2', text: 'HTML লিঙ্ক - ইমেজকে লিঙ্ক হিসেবে ব্যবহার', type: 'heading', level: 2, anchor: 'html-links---image-as-link' },
      { id: '_DoobJ4U_Px4', type: 'richtext', html: '<p>ইমেজকে লিঙ্ক হিসেবে ব্যবহার করা সাধারণ ব্যাপার:</p>' },
      { id: 'FnwJPeRyCreM', type: 'code', language: 'html', code: '<a href="default.asp">\n    <img src="smiley.gif" alt="HTML tutorial" style="width:42px;height:42px;">\n</a>' },
      { id: 'hOspVSmqphSG', type: 'richtext', html: '<hr>' },
      { id: 'fTMhRt4WsINq', text: 'লিঙ্ক টাইটেল', type: 'heading', level: 2, anchor: 'link-titles' },
      { id: 'LkmCN_vpKRbR', type: 'richtext', html: '<p><code>title</code> অ্যাট্রিবিউট একটি এলিমেন্ট সম্পর্কে অতিরিক্ত তথ্য নির্ধারণ করে। মাউস এলিমেন্টের উপর নিয়ে গেলে এই তথ্য প্রায়ই একটি টুলটিপ টেক্সট হিসেবে দেখানো হয়।</p>' },
      { id: 'DqKG7Bk0o175', type: 'code', language: 'html', code: '<a href="https://www.learncomputer.in/" title="Go to Learn Computer HTML section">Visit our HTML Tutorial</a>' },
    ],
    toc: [
      { id: 'html-links---hyperlinks', text: 'HTML লিঙ্ক - হাইপারলিঙ্ক', level: 2 },
      { id: 'html-links---syntax', text: 'HTML লিঙ্ক - সিনট্যাক্স', level: 2 },
      { id: 'local-links', text: 'লোকাল লিঙ্ক', level: 2 },
      { id: 'html-link-colors', text: 'HTML লিঙ্কের রঙ', level: 2 },
      { id: 'html-links---the-target-attribute', text: 'HTML লিঙ্ক - target অ্যাট্রিবিউট', level: 2 },
      { id: 'html-links---image-as-link', text: 'HTML লিঙ্ক - ইমেজকে লিঙ্ক হিসেবে ব্যবহার', level: 2 },
      { id: 'link-titles', text: 'লিঙ্ক টাইটেল', level: 2 },
    ],
  },
  {
    id: '93d1ce86-25fb-4617-b7d6-ce652df61795', // html/tables
    title: 'HTML টেবিল',
    meta_description: 'HTML টেবিল, বর্ডার, padding, colspan, rowspan এবং caption কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: '0Tw78GrVxZMN', type: 'richtext', html: '<hr>\n<p>একটি HTML টেবিল <code>&lt;table&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়।</p>\n<p>প্রতিটি টেবিল সারি (row) <code>&lt;tr&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়। একটি টেবিল হেডার <code>&lt;th&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়। ডিফল্টভাবে, টেবিল হেডিং বোল্ড এবং কেন্দ্রীভূত হয়। একটি টেবিল ডেটা/সেল <code>&lt;td&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়।</p>' },
      { id: 'nZDPlL-w77YY', type: 'code', language: 'html', code: '<table style="width:100%">\n    <tr>\n        <th>Firstname</th>\n        <th>Lastname</th> \n        <th>Age</th>\n    </tr>\n    <tr>\n        <td>Jill</td>\n        <td>Smith</td> \n        <td>50</td>\n    </tr>\n    <tr>\n        <td>Eve</td>\n        <td>Jackson</td> \n        <td>94</td>\n    </tr>\n</table>' },
      { id: 'UrDMs_P-Vuin', type: 'richtext', html: '<hr>\n<p><b>মনে রাখবেন:</b> <code>&lt;td&gt;</code> এলিমেন্টগুলো টেবিলের ডেটা কন্টেইনার।</p>\n<p>এগুলোতে সব ধরনের HTML এলিমেন্ট থাকতে পারে; টেক্সট, ইমেজ, লিস্ট, অন্য টেবিল ইত্যাদি।</p>\n<hr>\n<p>টেবিলের জন্য বর্ডার উল্লেখ না করলে, এটি বর্ডার ছাড়াই প্রদর্শিত হবে।</p>\n<p>CSS-এর <code>border</code> প্রপার্টি ব্যবহার করে একটি বর্ডার সেট করা হয়:</p>' },
      { id: 'ZtF6oxw9PjbI', type: 'code', language: 'css', code: 'table, th, td {\n    border: 1px solid black;\n}' },
      { id: 'pKwRrOhI4y8l', type: 'richtext', html: '<hr>\n<p>Cell padding সেলের কনটেন্ট এবং এর বর্ডারের মধ্যেকার জায়গা নির্ধারণ করে।</p>\n<p>padding উল্লেখ না করলে, টেবিল সেলগুলো padding ছাড়াই প্রদর্শিত হবে।</p>\n<p>padding সেট করতে, CSS-এর <code>padding</code> প্রপার্টি ব্যবহার করুন:</p>' },
      { id: 'F6aILK587LWu', type: 'code', language: 'css', code: 'th, td {\n    padding: 15px;\n}' },
      { id: 'Q2fIj5v7PYdr', type: 'richtext', html: '<hr>\n<p>ডিফল্টভাবে, টেবিল হেডিং বোল্ড এবং কেন্দ্রীভূত থাকে।</p>\n<p>টেবিল হেডিং বামে সারিবদ্ধ করতে, CSS-এর <code>text-align</code> প্রপার্টি ব্যবহার করুন:</p>' },
      { id: 'Fo6SftnQKcF9', type: 'code', language: 'css', code: 'th {\n    text-align: left;\n}' },
      { id: '5K3Pf7FMhV65', type: 'richtext', html: '<hr>\n<p>Border spacing সেলগুলোর মধ্যেকার জায়গা নির্ধারণ করে।</p>\n<p>একটি টেবিলের জন্য border spacing সেট করতে, CSS-এর <code>border-spacing</code> প্রপার্টি ব্যবহার করুন:</p>' },
      { id: 'NPxz3M5REKmg', type: 'code', language: 'css', code: 'table {\n    border-spacing: 5px;\n}' },
      { id: 'jmbGdbCaZFvi', type: 'richtext', html: '<p><b>মনে রাখবেন:</b> টেবিলের বর্ডার কোলাপ্স করা থাকলে, border-spacing কোনো প্রভাব ফেলে না।</p>\n<hr>\n<p>একটি সেলকে একাধিক কলামে বিস্তৃত করতে, <code>colspan</code> অ্যাট্রিবিউট ব্যবহার করুন:</p>' },
      { id: 'Lyy3etYiaLSZ', type: 'code', language: 'html', code: '<table style="width:100%">\n    <tr>\n        <th>Name</th>\n        <th colspan="2">Telephone</th>\n    </tr>\n    <tr>\n        <td>Bill Gates</td>\n        <td>55577854</td>\n        <td>55577855</td>\n    </tr>\n</table>' },
      { id: 'jHB1CKm8Mog6', type: 'richtext', html: '<hr>\n<p>একটি সেলকে একাধিক সারিতে বিস্তৃত করতে, <code>rowspan</code> অ্যাট্রিবিউট ব্যবহার করুন:</p>' },
      { id: 'sH_08TFyo2iN', type: 'code', language: 'html', code: '<table style="width:100%">\n    <tr>\n        <th>Name:</th>\n        <td>Bill Gates</td>\n    </tr>\n    <tr>\n        <th rowspan="2">Telephone:</th>\n        <td>55577854</td>\n    </tr>\n    <tr>\n        <td>55577855</td>\n    </tr>\n</table>' },
      { id: 'wQI6sUPzMowW', type: 'richtext', html: '<hr>\n<p>একটি টেবিলে ক্যাপশন যোগ করতে, <code>&lt;caption&gt;</code> ট্যাগ ব্যবহার করুন:</p>\n<p><b>মনে রাখবেন:</b> <code>&lt;caption&gt;</code> ট্যাগ অবশ্যই <code>&lt;table&gt;</code> ট্যাগের ঠিক পরেই বসাতে হবে।</p>' },
      { id: 'zmL4T3wPh4I-', type: 'code', language: 'html', code: '<table style="width:100%">\n    <caption>Monthly savings</caption>\n    <tr>\n        <th>Month</th>\n        <th>Savings</th>\n    </tr>\n    <tr>\n        <td>January</td>\n        <td>$100</td>\n    </tr>\n    <tr>\n        <td>February</td>\n        <td>$50</td>\n    </tr>\n</table>' },
      { id: 'KZ-7KP-FHH3l', type: 'richtext', html: '<p><b>মনে রাখবেন:</b> <code>&lt;caption&gt;</code> ট্যাগ অবশ্যই <code>&lt;table&gt;</code> ট্যাগের ঠিক পরেই বসাতে হবে।</p>\n<hr>' },
      { id: 's918LZZNShiI', text: 'চ্যাপ্টার সারসংক্ষেপ', type: 'heading', level: 4, anchor: 'chapter-summary' },
      { id: 'EQorLI2YQcO2', type: 'richtext', html: `<ul>
                                    <li>টেবিল নির্ধারণ করতে HTML <code>&lt;table&gt;</code> এলিমেন্ট ব্যবহার করুন</li>
                                    <li>টেবিল সারি নির্ধারণ করতে HTML <code>&lt;tr&gt;</code> এলিমেন্ট ব্যবহার করুন</li>
                                    <li>টেবিল ডেটা নির্ধারণ করতে HTML <code>&lt;td&gt;</code> এলিমেন্ট ব্যবহার করুন</li>
                                    <li>টেবিল হেডিং নির্ধারণ করতে HTML <code>&lt;th&gt;</code> এলিমেন্ট ব্যবহার করুন</li>
                                    <li>টেবিল ক্যাপশন নির্ধারণ করতে HTML <code>&lt;caption&gt;</code> এলিমেন্ট ব্যবহার করুন</li>
                                    <li>বর্ডার নির্ধারণ করতে CSS-এর <code>border</code> প্রপার্টি ব্যবহার করুন</li>
                                    <li>সেল বর্ডার কোলাপ্স করতে CSS-এর <code>border-collapse</code> প্রপার্টি ব্যবহার করুন</li>
                                    <li>সেলে padding যোগ করতে CSS-এর <code>padding</code> প্রপার্টি ব্যবহার করুন</li>
                                    <li>সেলের টেক্সট সারিবদ্ধ করতে CSS-এর <code>text-align</code> প্রপার্টি ব্যবহার করুন</li>
                                    <li>সেলগুলোর মধ্যে ব্যবধান সেট করতে CSS-এর <code>border-spacing</code> প্রপার্টি ব্যবহার করুন</li>
                                    <li>একটি সেলকে একাধিক কলামে বিস্তৃত করতে <code>colspan</code> অ্যাট্রিবিউট ব্যবহার করুন</li>
                                    <li>একটি সেলকে একাধিক সারিতে বিস্তৃত করতে <code>rowspan</code> অ্যাট্রিবিউট ব্যবহার করুন</li>
                                    <li>একটি টেবিলকে ইউনিকভাবে নির্ধারণ করতে <code>id</code> অ্যাট্রিবিউট ব্যবহার করুন</li>
                                </ul>
<hr>` },
      { id: 'T4okJEA5DpEb', text: 'HTML টেবিল ট্যাগ', type: 'heading', level: 2, anchor: 'html-table-tags' },
      { id: 'l2rx0hLhLzAx', type: 'table', header: ['ট্যাগ', 'বিবরণ'], rows: [
        ['&lt;table&gt;', 'একটি টেবিল নির্ধারণ করে'],
        ['&lt;th&gt;', 'একটি টেবিলে হেডার সেল নির্ধারণ করে'],
        ['&lt;tr&gt;', 'একটি টেবিলে একটি সারি নির্ধারণ করে'],
        ['&lt;td&gt;', 'একটি টেবিলে একটি সেল নির্ধারণ করে'],
        ['&lt;caption&gt;', 'একটি টেবিল ক্যাপশন নির্ধারণ করে'],
        ['&lt;colgroup&gt;', 'ফরম্যাটিংয়ের জন্য একটি টেবিলে এক বা একাধিক কলামের একটি গ্রুপ নির্ধারণ করে'],
        ['&lt;col&gt;', 'একটি &lt;colgroup&gt; এলিমেন্টের ভেতরে প্রতিটি কলামের জন্য কলাম প্রপার্টি নির্ধারণ করে'],
        ['&lt;thead&gt;', 'একটি টেবিলে হেডার কনটেন্ট গ্রুপ করে'],
        ['&lt;tbody&gt;', 'একটি টেবিলে বডি কনটেন্ট গ্রুপ করে'],
        ['&lt;tfoot&gt;', 'একটি টেবিলে ফুটার কনটেন্ট গ্রুপ করে'],
      ] },
    ],
    toc: [
      { id: 'chapter-summary', text: 'চ্যাপ্টার সারসংক্ষেপ', level: 4 },
      { id: 'html-table-tags', text: 'HTML টেবিল ট্যাগ', level: 2 },
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
console.log(`html batch3: ${ok}/${docs.length} written`)
