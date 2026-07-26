import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'ae8b922b-f357-4bbb-a117-b4d700f817b7' // css/intro
const title = 'CSS পরিচিতি'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'CSS কী, কেন ব্যবহার করবেন, এবং internal, external ও inline CSS-এর মধ্যে পার্থক্য জানুন।'

const blocks = [
  { id: '34P5vpJl_KDI', type: 'richtext', html: '<hr>' },
  { id: 'i_6vFrv_Lw0H', text: 'CSS কী?', type: 'heading', level: 2, anchor: 'what-is-css' },
  { id: 'goynf92aHnw9', type: 'richtext', html: `<ul>
                                    <li><b>CSS</b> মানে <b>C</b>ascading <b>S</b>tyle <b>S</b>heets</li>
                                    <li>CSS বর্ণনা করে <b>HTML এলিমেন্ট স্ক্রিনে, কাগজে, বা অন্যান্য মাধ্যমে কীভাবে প্রদর্শিত হবে</b></li>
                                    <li>CSS <b>অনেক কাজ বাঁচায়</b>। এটি একসাথে একাধিক ওয়েব পেজের লেআউট নিয়ন্ত্রণ করতে পারে</li>
                                    <li>বাইরের স্টাইলশিট <b>CSS ফাইলে</b> সংরক্ষিত থাকে</li>
                                </ul>
<hr>` },
  { id: 'GUfzqtTFTop4', text: 'কেন CSS ব্যবহার করবেন?', type: 'heading', level: 2, anchor: 'why-use-css' },
  { id: 'LYpwNN_bTV8H', type: 'richtext', html: '<p>আপনার ওয়েব পেজের জন্য স্টাইল নির্ধারণ করতে CSS ব্যবহার করা হয়, যার মধ্যে রয়েছে ডিজাইন, লেআউট এবং বিভিন্ন ডিভাইস ও স্ক্রিন সাইজের জন্য প্রদর্শনের ভিন্নতা।</p>\n<hr>' },
  { id: 'IB09Xo0ITkAm', text: 'CSS একটি বড় সমস্যা সমাধান করেছে', type: 'heading', level: 2, anchor: 'css-solved-a-big-problem' },
  { id: 'F0d1Qx8bSVFv', type: 'richtext', html: `<p>HTML কখনোই একটি ওয়েব পেজ ফরম্যাট করার জন্য ট্যাগ রাখার উদ্দেশ্যে তৈরি হয়নি!</p>
<p>HTML তৈরি হয়েছিল একটি ওয়েব পেজের <b>কনটেন্ট বর্ণনা করার</b> জন্য, যেমন:</p>
<p>&lt;h1&gt;This is a heading&lt;/h1&gt;</p>
<p>&lt;p&gt;This is a paragraph.&lt;/p&gt;</p>
<p>যখন &lt;font&gt;-এর মতো ট্যাগ এবং কালার অ্যাট্রিবিউট HTML 3.2 স্পেসিফিকেশনে যোগ করা হয়েছিল, তখন এটি ওয়েব ডেভেলপারদের জন্য একটি দুঃস্বপ্নের শুরু হয়েছিল। বড় ওয়েবসাইট তৈরি করা, যেখানে ফন্ট ও কালার তথ্য প্রতিটি পেজে আলাদাভাবে যোগ করতে হতো, একটি দীর্ঘ এবং ব্যয়বহুল প্রক্রিয়ায় পরিণত হয়েছিল।</p>
<p>এই সমস্যা সমাধানের জন্য, <b>World Wide Web Consortium (W3C)</b> CSS তৈরি করে।</p>
<p>CSS HTML পেজ থেকে স্টাইল ফরম্যাটিং সরিয়ে দিয়েছিল!</p>
<p><b>HTML কী তা যদি আপনি না জানেন, তাহলে আমাদের HTML টিউটোরিয়াল পড়ার পরামর্শ দিচ্ছি।</b>
                                </p>
<hr>` },
  { id: 'Hs9MXkagKvY6', text: 'CSS অনেক কাজ বাঁচায়!', type: 'heading', level: 2, anchor: 'css-saves-a-lot-of-work' },
  { id: 'amox478y_WDj', type: 'richtext', html: '<p>স্টাইল ডেফিনিশন সাধারণত বাইরের <b>.css</b> ফাইলে সংরক্ষণ করা হয়।</p>\n<p>একটি বাইরের স্টাইলশিট ফাইল দিয়ে, শুধু একটি ফাইল পরিবর্তন করে আপনি পুরো ওয়েবসাইটের চেহারা পরিবর্তন করতে পারেন!</p>\n<hr>' },
  { id: 'eN2ykWlus3xW', text: 'Inline, External এবং Internal CSS স্টাইলের মধ্যে পার্থক্য', type: 'heading', level: 2, anchor: 'the-difference-between-inline-external-and-internal-css-styles' },
  { id: 'FVy8Ag0xZZAh', type: 'richtext', html: "<p>CSS প্রয়োগ করার তিনটি উপায় আছে: internal, external, এবং inline স্টাইল। চলুন এগুলো বিস্তারিত জেনে নিই।</p>" },
  { id: 'Hms2hgoH6bey', text: 'Internal CSS', type: 'heading', level: 3, anchor: 'internal-css' },
  { id: 'rmFU83YlfHVo', type: 'richtext', html: `<p>Internal বা এমবেডেড CSS ব্যবহারের জন্য আপনার HTML ডকুমেন্টের <code>&lt;head&gt;</code> সেকশনে <code>&lt;style&gt;</code> ট্যাগ যোগ করতে হয়।</p>
<p>এই CSS স্টাইল একটি একক পেজ স্টাইল করার একটি কার্যকর পদ্ধতি। তবে, একাধিক পেজে এই স্টাইল ব্যবহার করা সময়সাপেক্ষ, কারণ আপনাকে আপনার ওয়েবসাইটের প্রতিটি পেজে CSS নিয়ম দিতে হয়।</p>
<p>Internal CSS কীভাবে ব্যবহার করবেন তা এখানে দেওয়া হলো:</p>
<ol>
                                    <li>আপনার HTML পেজ খুলুন এবং <code>&lt;head&gt;</code> ওপেনিং ট্যাগ খুঁজুন।</li>
                                    <li><code>&lt;head&gt;</code> ট্যাগের ঠিক পরে নিচের কোডটি বসান</li>
                                </ol>` },
  { id: 'kXqLQNn4lHB1', type: 'code', language: 'css', code: '<!DOCTYPE html>\n<html>\n    <head>\n        <style>\n            body {\n                background-color: blue;\n            }\n            h1 {\n                color: red;\n                padding: 60px;\n            } \n        </style>\n    </head>\n    <body>\n        <h1>Learn Computer Academy Tutorials</h1>\n        <p>This is our paragraph.</p>\n    </body>\n</html>' },
  { id: 'YHiHT_rQN7JI', text: 'Internal CSS-এর সুবিধা:', type: 'heading', level: 3, anchor: 'advantages-of-internal-css' },
  { id: '5YhZglRZeQZi', type: 'richtext', html: `<ul>
                                <li>এই স্টাইল শিটে আপনি class এবং ID সিলেক্টর ব্যবহার করতে পারেন। এখানে একটি উদাহরণ দেওয়া হলো:</li>
                                <pre class="snippet"><code class="css">.class {
    property1 : value1;
    property2 : value2;
    property3 : value3;
}
#id {
    property1 : value1;
    property2 : value2;
    property3 : value3;
}</code></pre>
                                <li>যেহেতু আপনি শুধু একই HTML ফাইলে কোড যোগ করবেন, তাই আপনার একাধিক ফাইল আপলোড করার প্রয়োজন নেই।</li>
                            </ul>` },
  { id: 'UX1NichGIbts', text: 'Internal CSS-এর অসুবিধা:', type: 'heading', level: 3, anchor: 'disadvantages-of-internal-css' },
  { id: 'pYho0ufzjjMP', type: 'richtext', html: `<ul>
                                <li>HTML ডকুমেন্টে কোড যোগ করলে পেজের আকার এবং লোডিং সময় বাড়তে পারে।</li>
                            </ul>
<hr>` },
  { id: 'ajJNOO2VLan0', text: 'External CSS', type: 'heading', level: 3, anchor: 'external-css' },
  { id: 'Hb4I3MBuCa5I', type: 'richtext', html: `<p>External CSS দিয়ে, আপনি আপনার ওয়েব পেজগুলোকে একটি বাইরের <b>.css ফাইলের</b> সাথে লিঙ্ক করবেন, যা আপনার ডিভাইসের যেকোনো টেক্সট এডিটর দিয়ে তৈরি করা যায় (যেমন, Notepad++)।</p>
<p>এই CSS ধরনটি বেশি কার্যকর পদ্ধতি, বিশেষ করে একটি বড় ওয়েবসাইট স্টাইল করার ক্ষেত্রে। একটি <b>.css ফাইল</b> এডিট করে, আপনি একবারে আপনার পুরো সাইট পরিবর্তন করতে পারেন।</p>
<p>External CSS ব্যবহার করতে এই ধাপগুলো অনুসরণ করুন:</p>
<ol>
                             <li>টেক্সট এডিটর দিয়ে একটি নতুন <b>.css</b> ফাইল তৈরি করুন, এবং স্টাইল নিয়ম যোগ করুন। উদাহরণস্বরূপ:</li>
<pre class="snippet"><code class="css">.xleftcol {
   float: left;
   width: 33%;
   background:#809900;
}
.xmiddlecol {
   float: left;
   width: 34%;
   background:#eff2df;
}
</code></pre>
                            <li>আপনার HTML শিটের <code>&lt;head&gt;</code> সেকশনে, <code>&lt;title&gt;</code> ট্যাগের ঠিক পরে আপনার বাইরের .css ফাইলের একটি রেফারেন্স যোগ করুন:</li>
                         </ol>` },
  { id: 'stQnisR_2oK-', type: 'code', language: 'html', code: '<link rel="stylesheet" type="text/css" href="style.css" />' },
  { id: 'ubYJWwe279mG', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b> style.css-এর জায়গায় আপনার .css ফাইলের নাম বসাতে ভুলবেন না।</p>' },
  { id: 'h7y4HQZKqGGR', text: 'External CSS-এর সুবিধা:', type: 'heading', level: 3, anchor: 'advantages-of-external-css' },
  { id: 'vdKTS-dZZqx2', type: 'richtext', html: `<ol>
                                <li>যেহেতু CSS কোড একটি আলাদা ডকুমেন্টে থাকে, আপনার HTML ফাইলের গঠন পরিষ্কার থাকবে এবং আকারে ছোট হবে।</li>
                                <li>আপনি একই <b>.css</b> ফাইল একাধিক পেজে ব্যবহার করতে পারেন।</li>
                            </ol>` },
  { id: 'nDeTWHg8l53S', text: 'External CSS-এর অসুবিধা:', type: 'heading', level: 3, anchor: 'disadvantages-of-external-css' },
  { id: 'BPa35FQU-snd', type: 'richtext', html: `<ol>
                                <li>বাইরের CSS লোড না হওয়া পর্যন্ত আপনার পেজগুলো সঠিকভাবে রেন্ডার নাও হতে পারে।</li>
                                <li>একাধিক CSS ফাইল আপলোড বা লিঙ্ক করলে আপনার সাইটের ডাউনলোড সময় বাড়তে পারে।</li>
                            </ol>
<hr>` },
  { id: 'VxrhkUoBNT-T', text: 'Inline CSS', type: 'heading', level: 3, anchor: 'inline-css' },
  { id: 'huNWQ9aqB8z6', type: 'richtext', html: `<p>একটি নির্দিষ্ট HTML এলিমেন্ট স্টাইল করতে Inline CSS ব্যবহার করা হয়। এই CSS স্টাইলের জন্য, সিলেক্টর ব্যবহার না করে আপনাকে শুধু প্রতিটি HTML ট্যাগে style অ্যাট্রিবিউট যোগ করতে হবে।</p>
<p>এই CSS ধরনটি সত্যিই প্রস্তাবিত নয়, কারণ প্রতিটি HTML ট্যাগ আলাদাভাবে স্টাইল করতে হয়। শুধু inline CSS ব্যবহার করলে আপনার ওয়েবসাইট ম্যানেজ করা খুব কঠিন হয়ে যেতে পারে।</p>
<p>তবে, HTML-এ inline CSS কিছু পরিস্থিতিতে উপকারী হতে পারে। উদাহরণস্বরূপ, যেসব ক্ষেত্রে আপনার CSS ফাইলে অ্যাক্সেস নেই বা শুধু একটি এলিমেন্টের জন্য স্টাইল প্রয়োগ করতে হবে।</p>
<p>চলুন একটি উদাহরণ দেখি। এখানে, আমরা <code>&lt;p&gt;</code> এবং <code>&lt;h1&gt;</code> ট্যাগে একটি inline CSS যোগ করি:</p>` },
  { id: 'MbkzQNJCrlHW', type: 'code', language: 'html', code: '<!DOCTYPE html>\n<html>\n<body style="background-color:black;">\n    <h1 style="color:white;padding:30px;">Hostinger Tutorials</h1>\n    <p style="color:white;">Something usefull here.</p>\n</body>\n</html>' },
  { id: 'icbRJFo9JLZt', text: 'Inline CSS-এর সুবিধা:', type: 'heading', level: 3, anchor: 'advantages-of-inline-css' },
  { id: 'L8u7GQNrcPpY', type: 'richtext', html: `<ol>
                                <li>আপনি সহজে ও দ্রুত একটি HTML পেজে CSS নিয়ম যোগ করতে পারেন। এই কারণে এই পদ্ধতি পরিবর্তন পরীক্ষা বা প্রিভিউ করার জন্য, এবং আপনার ওয়েবসাইটে দ্রুত ফিক্স করার জন্য উপকারী।</li>
                                <li>External স্টাইলের মতো একটি আলাদা ডকুমেন্ট তৈরি ও আপলোড করার প্রয়োজন নেই।</li>
                            </ol>` },
  { id: 'SdwgwTnfoyZL', text: 'Inline CSS-এর অসুবিধা:', type: 'heading', level: 3, anchor: 'disadvantages-of-inline-css' },
  { id: 'XtSeukfX-hKI', type: 'richtext', html: `<ol>
                                <li>প্রতিটি HTML এলিমেন্টে CSS নিয়ম যোগ করা সময়সাপেক্ষ এবং আপনার HTML গঠনকে অগোছালো করে তোলে।</li>
                                <li>একাধিক এলিমেন্ট স্টাইল করলে আপনার পেজের আকার এবং ডাউনলোড সময় প্রভাবিত হতে পারে।</li>
                            </ol>
<hr>` },
  { id: 'cIuvP8jEvUZg', text: 'উপসংহার', type: 'heading', level: 2, anchor: 'conclusion' },
  { id: '9WZtCf5zvBzZ', type: 'richtext', html: `<p>এই টিউটোরিয়ালে, আপনি CSS-এর তিনটি ধরনের মধ্যে পার্থক্য শিখেছেন: internal, external, এবং inline। এখানে একটি সারসংক্ষেপ দেওয়া হলো:</p>
<ol>
                                <li><b>Internal বা এমবেডেড</b> ⁠— HTML ডকুমেন্টের <code>&lt;head&gt;</code> সেকশনে <code>&lt;style&gt;</code> ট্যাগ যোগ করা</li>
                                <li><b>External</b> ⁠— HTML শিটকে একটি আলাদা <b>.css ফাইলের</b> সাথে লিঙ্ক করা</li>
                                <li><b>Inline</b> ⁠— নির্দিষ্ট এলিমেন্টের জন্য CSS নিয়ম প্রয়োগ করা।</li>
                            </ol>` },
]

const toc = [
  { id: 'what-is-css', text: 'CSS কী?', level: 2 },
  { id: 'why-use-css', text: 'কেন CSS ব্যবহার করবেন?', level: 2 },
  { id: 'css-solved-a-big-problem', text: 'CSS একটি বড় সমস্যা সমাধান করেছে', level: 2 },
  { id: 'css-saves-a-lot-of-work', text: 'CSS অনেক কাজ বাঁচায়!', level: 2 },
  { id: 'the-difference-between-inline-external-and-internal-css-styles', text: 'Inline, External এবং Internal CSS স্টাইলের মধ্যে পার্থক্য', level: 2 },
  { id: 'internal-css', text: 'Internal CSS', level: 3 },
  { id: 'advantages-of-internal-css', text: 'Internal CSS-এর সুবিধা:', level: 3 },
  { id: 'disadvantages-of-internal-css', text: 'Internal CSS-এর অসুবিধা:', level: 3 },
  { id: 'external-css', text: 'External CSS', level: 3 },
  { id: 'advantages-of-external-css', text: 'External CSS-এর সুবিধা:', level: 3 },
  { id: 'disadvantages-of-external-css', text: 'External CSS-এর অসুবিধা:', level: 3 },
  { id: 'inline-css', text: 'Inline CSS', level: 3 },
  { id: 'advantages-of-inline-css', text: 'Inline CSS-এর সুবিধা:', level: 3 },
  { id: 'disadvantages-of-inline-css', text: 'Inline CSS-এর অসুবিধা:', level: 3 },
  { id: 'conclusion', text: 'উপসংহার', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/intro: 1/1 written')
