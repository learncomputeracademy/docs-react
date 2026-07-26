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
    id: '954d40f7-ac20-4216-ae4d-f70c8493892a', // html/comments
    title: 'HTML কমেন্ট',
    meta_description: 'HTML সোর্স কোডে কমেন্ট কীভাবে যোগ করবেন এবং ডিবাগিংয়ে কীভাবে ব্যবহার করবেন তা শিখুন।',
    blocks: [
      { id: 'eb716639Psnx', type: 'richtext', html: '<hr>\n<p>কমেন্ট ট্যাগ ব্যবহার করা হয় HTML সোর্স কোডে কমেন্ট যোগ করার জন্য।</p>\n<hr>' },
      { id: '110eWRZaYZ9Y', text: 'HTML কমেন্ট ট্যাগ', type: 'heading', level: 2, anchor: 'html-comment-tags' },
      { id: 'MEg-VdXo_FFn', type: 'richtext', html: '<p>নিচের সিনট্যাক্স ব্যবহার করে আপনি আপনার HTML সোর্সে কমেন্ট যোগ করতে পারেন:</p>' },
      { id: 'qr-LIaeHRc19', type: 'code', language: 'html', code: '<!-- Write your comments here -->' },
      { id: '2zYZ8Leh2s6N', type: 'richtext', html: '<p>লক্ষ্য করুন, ওপেনিং ট্যাগে একটি বিস্ময়সূচক চিহ্ন (!) আছে, কিন্তু ক্লোজিং ট্যাগে নেই।</p>\n<hr>\n<p>কমেন্টের মাধ্যমে আপনি আপনার HTML-এ নোটিফিকেশন এবং রিমাইন্ডার রাখতে পারেন:</p>' },
      { id: 'Y6PR9hWfy5F9', type: 'code', language: 'html', code: '<!-- This is a comment -->\n<p>This is a paragraph.</p>\n<!-- Remember to add more information here -->' },
      { id: 'YyyslCfs1WKm', type: 'richtext', html: '<hr>\n<p>HTML ডিবাগ করার জন্যও কমেন্ট খুব উপকারী, কারণ ভুল খুঁজে বের করার জন্য আপনি একবারে একটি করে HTML কোড লাইন কমেন্ট আউট করতে পারেন:</p>' },
      { id: 'ZPtuu6eEE00E', type: 'code', language: 'html', code: '<!-- Do not display this image at the moment\n<img border="0" src="pic_trulli.jpg" alt="Trulli">\n-->' },
    ],
    toc: [{ id: 'html-comment-tags', text: 'HTML কমেন্ট ট্যাগ', level: 2 }],
  },
  {
    id: 'c919eaaa-6d9f-415e-85e8-61e23d8b4675', // html/html5-new-elements
    title: 'HTML নতুন এলিমেন্ট',
    meta_description: 'HTML5-এ যোগ হওয়া নতুন সিমান্টিক ও গ্রাফিক্স এলিমেন্টের তালিকা এবং তাদের ব্যবহার।',
    blocks: [
      { id: 'c_A4vczypeF3', type: 'richtext', html: '<hr>' },
      { id: 'SmJjYbljqdXb', text: 'HTML5-এ নতুন এলিমেন্ট', type: 'heading', level: 2, anchor: 'new-elements-in-html5' },
      { id: '7IGdL0GhRSk6', type: 'richtext', html: '<p>নিচে HTML5-এর নতুন এলিমেন্টগুলোর তালিকা এবং সেগুলো কী কাজে ব্যবহৃত হয় তার বিবরণ দেওয়া হলো।</p>\n<hr>' },
      { id: 'rGg6gAKYWnQc', text: 'নতুন সিমান্টিক/স্ট্রাকচারাল এলিমেন্ট', type: 'heading', level: 2, anchor: 'new-semanticstructural-elements' },
      { id: 'Ck23_DPNEA6p', type: 'richtext', html: '<p>ভালো ডকুমেন্ট স্ট্রাকচারের জন্য HTML5-এ নতুন এলিমেন্ট রয়েছে:</p>' },
      { id: 's5xxue_KlDyt', type: 'table', header: ['ট্যাগ', 'বিবরণ'], rows: [
        ['&lt;article&gt;', 'একটি ডকুমেন্টে একটি আর্টিকেল নির্ধারণ করে'],
        ['&lt;aside&gt;', 'পেজের মূল কনটেন্টের বাইরের কনটেন্ট নির্ধারণ করে'],
        ['&lt;bdi&gt;', 'টেক্সটের একটি অংশকে আলাদা করে রাখে, যা অন্য টেক্সট থেকে ভিন্ন দিকে ফরম্যাট করা হতে পারে'],
        ['&lt;details&gt;', 'অতিরিক্ত বিস্তারিত তথ্য নির্ধারণ করে, যা ব্যবহারকারী দেখাতে বা লুকাতে পারে'],
        ['&lt;dialog&gt;', 'একটি ডায়ালগ বক্স বা উইন্ডো নির্ধারণ করে'],
        ['&lt;figcaption&gt;', '&lt;figure&gt; এলিমেন্টের জন্য একটি ক্যাপশন নির্ধারণ করে'],
        ['&lt;figure&gt;', 'স্বয়ংসম্পূর্ণ কনটেন্ট নির্ধারণ করে'],
        ['&lt;footer&gt;', 'একটি ডকুমেন্ট বা সেকশনের ফুটার নির্ধারণ করে'],
        ['&lt;header&gt;', 'একটি ডকুমেন্ট বা সেকশনের হেডার নির্ধারণ করে'],
        ['&lt;main&gt;', 'একটি ডকুমেন্টের মূল কনটেন্ট নির্ধারণ করে'],
        ['&lt;mark&gt;', 'চিহ্নিত/হাইলাইট করা টেক্সট নির্ধারণ করে'],
        ['&lt;meter&gt;', 'একটি নির্দিষ্ট সীমার মধ্যে স্কেলার পরিমাপ নির্ধারণ করে (একটি গেজ)'],
        ['&lt;nav&gt;', 'নেভিগেশন লিঙ্ক নির্ধারণ করে'],
        ['&lt;progress&gt;', 'একটি কাজের অগ্রগতি প্রকাশ করে'],
        ['&lt;rp&gt;', 'রুবি অ্যানোটেশন সমর্থন করে না এমন ব্রাউজারে কী দেখানো হবে তা নির্ধারণ করে'],
        ['&lt;rt&gt;', 'অক্ষরের ব্যাখ্যা/উচ্চারণ নির্ধারণ করে (পূর্ব এশীয় টাইপোগ্রাফির জন্য)'],
        ['&lt;ruby&gt;', 'একটি রুবি অ্যানোটেশন নির্ধারণ করে (পূর্ব এশীয় টাইপোগ্রাফির জন্য)'],
        ['&lt;section&gt;', 'একটি ডকুমেন্টে একটি সেকশন নির্ধারণ করে'],
        ['&lt;summary&gt;', '&lt;details&gt; এলিমেন্টের জন্য একটি দৃশ্যমান হেডিং নির্ধারণ করে'],
        ['&lt;time&gt;', 'একটি তারিখ/সময় নির্ধারণ করে'],
        ['&lt;wbr&gt;', 'একটি সম্ভাব্য লাইন-ব্রেক নির্ধারণ করে'],
      ] },
      { id: 'qNzHB1QWAgnk', type: 'richtext', html: '<hr>' },
      { id: 'zVfyIWIt-sAQ', text: 'HTML5 গ্রাফিক্স', type: 'heading', level: 2, anchor: 'html5-graphics' },
      { id: 'CcY5XLgFuyCZ', type: 'table', header: ['ট্যাগ', 'বিবরণ'], rows: [
        ['&lt;canvas&gt;', 'স্ক্রিপ্টিংয়ের মাধ্যমে (সাধারণত JavaScript) তাৎক্ষণিকভাবে গ্রাফিক্স আঁকে'],
        ['&lt;svg&gt;', 'স্কেলযোগ্য ভেক্টর গ্রাফিক্স আঁকে'],
      ] },
    ],
    toc: [
      { id: 'new-elements-in-html5', text: 'HTML5-এ নতুন এলিমেন্ট', level: 2 },
      { id: 'new-semanticstructural-elements', text: 'নতুন সিমান্টিক/স্ট্রাকচারাল এলিমেন্ট', level: 2 },
      { id: 'html5-graphics', text: 'HTML5 গ্রাফিক্স', level: 2 },
    ],
  },
  {
    id: '708f5c07-7bcb-4e29-9ad7-9ce394787d05', // html/id
    title: 'HTML ID',
    meta_description: 'HTML-এ id অ্যাট্রিবিউট কীভাবে ব্যবহার করবেন এবং class ও id-এর মধ্যে পার্থক্য জানুন।',
    blocks: [
      { id: 'G5A2Dx6ixYBg', type: 'richtext', html: '<hr>' },
      { id: '7lfphwRpF7ab', text: 'id অ্যাট্রিবিউট ব্যবহার করা', type: 'heading', level: 2, anchor: 'using-the-id-attribute' },
      { id: 'KVQW1X4eGWpJ', type: 'richtext', html: '<p>একটি HTML এলিমেন্টের জন্য <code>id</code> অ্যাট্রিবিউট একটি ইউনিক id নির্ধারণ করে (মানটি অবশ্যই HTML ডকুমেন্টের মধ্যে ইউনিক হতে হবে)।</p>\n<p>নির্দিষ্ট id মান থাকা এলিমেন্টের জন্য নির্দিষ্ট কিছু কাজ করতে CSS এবং JavaScript এই id মান ব্যবহার করতে পারে।</p>\n<p>CSS-এ, নির্দিষ্ট id-যুক্ত একটি এলিমেন্ট সিলেক্ট করতে, একটি হ্যাশ (#) চিহ্ন লিখে তারপর এলিমেন্টটির id লিখতে হয়:</p>' },
      { id: 'Z9TRUbkoKMtJ', type: 'code', language: 'html', code: '<style>\n    #myHeader {\n      background-color: lightblue;\n      color: black;\n      padding: 40px;\n      text-align: center;\n    } \n</style>\n<h1 id="myHeader">My Header</h1>' },
      { id: 'Gi-hj9Kjjj4O', type: 'richtext', html: '<p><b>টিপস:</b> যেকোনো HTML এলিমেন্টে id অ্যাট্রিবিউট ব্যবহার করা যায়।</p>\n<p><b>মনে রাখবেন:</b> id মান <code>কেস-সেনসিটিভ</code>।</p>\n<p><b>মনে রাখবেন:</b> id মানে অন্তত একটি অক্ষর থাকতে হবে, এবং এতে কোনো হোয়াইটস্পেস (স্পেস, ট্যাব ইত্যাদি) থাকা যাবে না।</p>\n<hr>' },
      { id: '4IhZsoFUhhYi', text: 'Class এবং ID-এর মধ্যে পার্থক্য', type: 'heading', level: 2, anchor: 'difference-between-class-and-id' },
      { id: 'Mh8pgHSOF33h', type: 'richtext', html: '<p>একটি HTML এলিমেন্টের শুধুমাত্র একটি ইউনিক id থাকতে পারে, যা শুধু সেই একটি এলিমেন্টের জন্যই প্রযোজ্য, অন্যদিকে একই class নাম একাধিক এলিমেন্টে ব্যবহার করা যায়:</p>' },
      { id: '3DI5w8-cy_H_', type: 'code', language: 'html', code: '<style>\n    /* "myHeader" id-যুক্ত এলিমেন্টটি স্টাইল করা হচ্ছে */\n    #myHeader {\n      background-color: lightblue;\n      color: black;\n      padding: 40px;\n      text-align: center;\n    }\n    /* "city" ক্লাস নামযুক্ত সব এলিমেন্ট স্টাইল করা হচ্ছে */\n    .city {\n      background-color: tomato;\n      color: white;\n      padding: 10px;\n    } \n</style>\n<!-- একটি ইউনিক এলিমেন্ট -->\n<h1 id="myHeader">My Cities</h1>\n<!-- একাধিক একই ধরনের এলিমেন্ট -->\n<h2 class="city">London</h2>\n<p>London is the capital of England.</p>\n<h2 class="city">Paris</h2>\n<p>Paris is the capital of France.</p>\n<h2 class="city">Tokyo</h2>\n<p>Tokyo is the capital of Japan.</p>' },
      { id: 'IZe8EGbnpGoh', type: 'richtext', html: '<p><b>টিপস:</b> আমাদের <a href="css_intro.php" target="_blank">CSS টিউটোরিয়াল</a>-এ CSS সম্পর্কে আরও অনেক কিছু জানতে পারবেন।</p>' },
    ],
    toc: [
      { id: 'using-the-id-attribute', text: 'id অ্যাট্রিবিউট ব্যবহার করা', level: 2 },
      { id: 'difference-between-class-and-id', text: 'Class এবং ID-এর মধ্যে পার্থক্য', level: 2 },
    ],
  },
  {
    id: '44bd453e-300c-4204-ac58-aeebe8432e2b', // html/images
    title: 'HTML ইমেজ',
    meta_description: 'HTML-এ img ট্যাগ দিয়ে ইমেজ কীভাবে যোগ করবেন এবং alt অ্যাট্রিবিউটের গুরুত্ব জানুন।',
    blocks: [
      { id: 'VhWhCWouSH9d', type: 'richtext', html: '<hr>\n<p>ইমেজ একটি ওয়েব পেজের ডিজাইন এবং চেহারা আরও উন্নত করতে পারে।</p>\n<hr>' },
      { id: 'vHhGX69ZxX7L', type: 'code', language: 'html', code: '<img src="pic_trulli.jpg" alt="Italian Trulli">' },
      { id: 'uNIeq6gahZoD', type: 'richtext', html: '<hr>' },
      { id: 'FiwrTLRxyBJL', text: 'HTML ইমেজের সিনট্যাক্স', type: 'heading', level: 2, anchor: 'html-images-syntax' },
      { id: '6Wj4hEqNHEPd', type: 'richtext', html: '<p>HTML-এ, ইমেজ <code>&lt;img&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়।</p>\n<p><code>&lt;img&gt;</code> ট্যাগটি খালি, এতে শুধু অ্যাট্রিবিউট থাকে, এবং এর কোনো ক্লোজিং ট্যাগ নেই।</p>\n<p><code>src</code> অ্যাট্রিবিউট ইমেজের URL (ওয়েব ঠিকানা) নির্ধারণ করে:</p>' },
      { id: 'TG-a1_MErl7H', type: 'code', language: 'html', code: '<img src="url">' },
      { id: 'zgAYK2p2MNLA', type: 'richtext', html: '<hr>' },
      { id: 'TPWK4DtuQdN_', text: 'alt অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-alt-attribute' },
      { id: 'MBjP2hox_y1N', type: 'richtext', html: '<p>ব্যবহারকারী যদি কোনো কারণে ইমেজটি দেখতে না পান (ধীরগতির কানেকশনের কারণে, src অ্যাট্রিবিউটে কোনো ভুল থাকলে, বা স্ক্রিন রিডার ব্যবহার করলে), তাহলে <code>alt</code> অ্যাট্রিবিউট ইমেজের জন্য একটি বিকল্প টেক্সট প্রদান করে।</p>\n<p><code>alt</code> অ্যাট্রিবিউটের মান ইমেজটিকে বর্ণনা করা উচিত।</p>\n<p>ব্রাউজার যদি কোনো ইমেজ খুঁজে না পায়, তাহলে এটি alt অ্যাট্রিবিউটের মান প্রদর্শন করবে।</p>' },
      { id: 'OqveYoa4rOdV', type: 'code', language: 'html', code: '<img src="img_chania.jpg" alt="Flowers in Chania">' },
    ],
    toc: [
      { id: 'html-images-syntax', text: 'HTML ইমেজের সিনট্যাক্স', level: 2 },
      { id: 'the-alt-attribute', text: 'alt অ্যাট্রিবিউট', level: 2 },
    ],
  },
  {
    id: '15ed0c62-2f6d-449e-9151-e592b8ef9b5a', // html/syllabus
    title: 'HTML সিলেবাস',
    meta_description: 'HTML শেখার জন্য ফাইল ও ফোল্ডার স্ট্রাকচার এবং প্রফেশনাল প্রজেক্ট শুরু করার নির্দেশিকা।',
    blocks: [
      { id: 'AyJ_48Up7iOJ', text: 'HTML - হাইপার টেক্সট মার্কআপ ল্যাঙ্গুয়েজ', type: 'heading', level: 2, anchor: 'html---hyper-text-markup-language' },
      { id: 'TNiqgt07wrJB', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b> HTML সম্পর্কে বিস্তারিত জানতে <a href="/html/html-intro">এখানে</a> ক্লিক করুন।</p>\n<hr>' },
      { id: 'kTVok5yDQq1r', text: 'আপনার প্রফেশনাল প্রজেক্ট শুরু করতে এই ফাইল ও ফোল্ডার স্ট্রাকচার অনুসরণ করুন।', type: 'heading', level: 2, anchor: 'follow-this-file-and-folder-structure-to-start-your-professional-project' },
      { id: 'ZJJ_0iKzsTR2', type: 'richtext', html: '<div class="graph-block" style="width: 50%;">\n                                    <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960224/img/folder-structure.webp" alt="folder-structure" class="img-fluid">\n                                </div>' },
    ],
    toc: [
      { id: 'html---hyper-text-markup-language', text: 'HTML - হাইপার টেক্সট মার্কআপ ল্যাঙ্গুয়েজ', level: 2 },
      { id: 'follow-this-file-and-folder-structure-to-start-your-professional-project', text: 'আপনার প্রফেশনাল প্রজেক্ট শুরু করতে এই ফাইল ও ফোল্ডার স্ট্রাকচার অনুসরণ করুন।', level: 2 },
    ],
  },
  {
    id: '5ec79d9a-3a2a-417d-8b98-431d5d424568', // html/tag-article
    title: 'Article ট্যাগ',
    meta_description: '&lt;article&gt; ট্যাগ কী, কখন ব্যবহার করবেন এবং এর সম্ভাব্য ব্যবহারক্ষেত্র জানুন।',
    blocks: [
      { id: 'HRyfqgcefP4c', type: 'richtext', html: '<hr>' },
      { id: 'MVt7jTy-JRID', type: 'code', language: 'html', code: '<article>\n  <h1>Google Chrome</h1>\n  <p>Google Chrome is a free, open-source web browser developed by Google, released in 2008.</p>\n</article>' },
      { id: 'a2kZ6ftjiR4R', type: 'richtext', html: '<hr>' },
      { id: 'xfVnQKwDO1gS', text: 'সংজ্ঞা ও ব্যবহার', type: 'heading', level: 2, anchor: 'definition-and-usage' },
      { id: '4zTB3v1NMzNJ', type: 'richtext', html: '<p>&lt;article&gt; ট্যাগ স্বতন্ত্র, স্বয়ংসম্পূর্ণ কনটেন্ট নির্ধারণ করে।</p>\n<p>একটি আর্টিকেল নিজে থেকেই অর্থবহ হওয়া উচিত এবং সাইটের বাকি অংশ থেকে আলাদাভাবে বিতরণযোগ্য হওয়া উচিত।</p>\n<p>&lt;article&gt; এলিমেন্টের সম্ভাব্য উৎস:</p>\n<ul>\n                                    <li>ফোরাম পোস্ট</li>\n                                    <li>ব্লগ পোস্ট</li>\n                                    <li>নিউজ স্টোরি</li>\n                                    <li>কমেন্ট</li>\n                                </ul>' },
    ],
    toc: [{ id: 'definition-and-usage', text: 'সংজ্ঞা ও ব্যবহার', level: 2 }],
  },
  {
    id: 'b041e198-80b6-4cd4-829c-5bea84121e5b', // html/tag-audio
    title: 'Audio ট্যাগ',
    meta_description: 'HTML5-এর &lt;audio&gt; এলিমেন্ট দিয়ে ওয়েব পেজে অডিও কীভাবে এমবেড করবেন তা শিখুন।',
    blocks: [
      { id: 'KFgbjs4mGdao', type: 'richtext', html: '<hr>' },
      { id: 'KjZzWJpd45k7', text: 'ওয়েবে অডিও', type: 'heading', level: 2, anchor: 'audio-on-the-web' },
      { id: 'UKvZZqfF5AHk', type: 'richtext', html: '<p>HTML5-এর আগে, অডিও ফাইল শুধুমাত্র প্লাগইনের (যেমন flash) মাধ্যমে ব্রাউজারে চালানো যেত।</p>\n<p>HTML5-এর <code>&lt;audio&gt;</code> এলিমেন্ট একটি ওয়েব পেজে অডিও এমবেড করার একটি স্ট্যান্ডার্ড পদ্ধতি নির্ধারণ করে।</p>\n<hr>' },
      { id: 'bPr7iCaLm5Wx', text: 'HTML এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-html-element' },
      { id: 'cKeJ8a_CEW0W', type: 'richtext', html: '<p>HTML-এ একটি অডিও ফাইল চালাতে, <code>&lt;audio&gt;</code> এলিমেন্ট ব্যবহার করুন:</p>' },
      { id: 'n97zV5s6fuiI', type: 'code', language: 'html', code: '<audio controls>\n  <source src="claps.ogg" type="audio/ogg">\n  <source src="claps.mp3" type="audio/mpeg">\nYour browser does not support the audio element.\n</audio>' },
      { id: '9G7AXpkXqHd9', type: 'richtext', html: '<audio controls="">\n                                  <source src="/assets/img/claps.ogg" type="audio/ogg">\n                                  <source src="/assets/img/claps.mp3" type="audio/mpeg">\n                                    আপনার ব্রাউজার অডিও এলিমেন্ট সমর্থন করে না।\n                                </audio>\n<hr>' },
      { id: 'P36DbYYif8PR', text: 'HTML অডিও - এটি কীভাবে কাজ করে', type: 'heading', level: 2, anchor: 'html-audio---how-it-works' },
      { id: 'lzMwkeDv5LRB', type: 'richtext', html: '<p>controls অ্যাট্রিবিউট প্লে, পজ এবং ভলিউমের মতো অডিও কন্ট্রোল যোগ করে।</p>\n<p><code>&lt;source&gt;</code> এলিমেন্টের মাধ্যমে আপনি একাধিক বিকল্প অডিও ফাইল উল্লেখ করতে পারেন, যেখান থেকে ব্রাউজার বেছে নিতে পারে। ব্রাউজার প্রথম যে ফরম্যাটটি চিনতে পারবে সেটিই ব্যবহার করবে।</p>\n<p><code>&lt;audio&gt; </code>এবং <code>&lt;/audio&gt;</code> ট্যাগের মধ্যবর্তী টেক্সট শুধুমাত্র সেইসব ব্রাউজারে দেখানো হবে যেগুলো <code>&lt;audio&gt;</code> এলিমেন্ট সমর্থন করে না।</p>' },
    ],
    toc: [
      { id: 'audio-on-the-web', text: 'ওয়েবে অডিও', level: 2 },
      { id: 'the-html-element', text: 'HTML এলিমেন্ট', level: 2 },
      { id: 'html-audio---how-it-works', text: 'HTML অডিও - এটি কীভাবে কাজ করে', level: 2 },
    ],
  },
  {
    id: 'f2fc8393-f8ec-48c9-ad3b-4f2ff1c7f138', // html/tag-footer
    title: 'Footer ট্যাগ',
    meta_description: '&lt;footer&gt; ট্যাগ কী, কী কী তথ্য এতে থাকা উচিত এবং এর ডিফল্ট CSS সেটিংস জানুন।',
    blocks: [
      { id: 'RGyCsggQkcI4', type: 'richtext', html: '<hr>\n<p>একটি ডকুমেন্টের ফুটার সেকশন:</p>' },
      { id: '13Kdbld1BVF9', type: 'code', language: 'html', code: '<footer>\n  <p>Posted by: Hege Refsnes</p>\n  <p>Contact information: <a href="mailto:someone@example.com">someone@example.com</a>.</p>\n</footer>' },
      { id: 'jxJwbAEmq_YT', type: 'richtext', html: '<hr>' },
      { id: 'X8oMxvahFJfh', text: 'সংজ্ঞা ও ব্যবহার', type: 'heading', level: 2, anchor: 'definition-and-usage' },
      { id: 'B-Yuyb7z2PI4', type: 'richtext', html: '<p><code>&lt;footer&gt;</code> ট্যাগ একটি ডকুমেন্ট বা সেকশনের ফুটার নির্ধারণ করে।</p>\n<p>একটি <code>&lt;footer&gt;</code> এলিমেন্টে তার প্যারেন্ট এলিমেন্ট সম্পর্কিত তথ্য থাকা উচিত।</p>\n<code>&lt;footer&gt;</code>\n<p></p>\n<ul>\n                                    <li>লেখক-সংক্রান্ত তথ্য</li>\n                                    <li>কপিরাইট তথ্য</li>\n                                    <li>যোগাযোগের তথ্য</li>\n                                    <li>সাইটম্যাপ</li>\n                                    <li>উপরে ফেরত যাওয়ার লিঙ্ক</li>\n                                    <li>সম্পর্কিত ডকুমেন্ট</li>\n                                </ul>\n<p>একটি ডকুমেন্টে একাধিক <code>&lt;footer&gt;</code> এলিমেন্ট থাকতে পারে।</p>\n<hr>' },
      { id: 'sKVJ8wRS3Muy', text: 'টিপস ও মন্তব্য', type: 'heading', level: 2, anchor: 'tips-and-notes' },
      { id: 'PEZl6i0Y20mb', type: 'richtext', html: '<p><b>টিপস:</b> <code>&lt;footer&gt;</code> এলিমেন্টের ভেতরে থাকা যোগাযোগের তথ্য <code>&lt;address&gt;</code> ট্যাগের মধ্যে রাখা উচিত।</p>\n<hr>' },
      { id: 'ADRAyAX1NkZZ', text: 'ডিফল্ট CSS সেটিংস', type: 'heading', level: 2, anchor: 'default-css-settings' },
      { id: 'tMxr-85imLkF', type: 'richtext', html: '<p>বেশিরভাগ ব্রাউজার <code>&lt;footer&gt;</code> এলিমেন্টকে নিচের ডিফল্ট মান দিয়ে প্রদর্শন করবে:</p>' },
      { id: 'R83hIhc0R6jj', type: 'code', language: 'css', code: 'footer {\n  display: block;\n}' },
    ],
    toc: [
      { id: 'definition-and-usage', text: 'সংজ্ঞা ও ব্যবহার', level: 2 },
      { id: 'tips-and-notes', text: 'টিপস ও মন্তব্য', level: 2 },
      { id: 'default-css-settings', text: 'ডিফল্ট CSS সেটিংস', level: 2 },
    ],
  },
  {
    id: '69deafa9-2f84-46e8-b5ae-feb5fb5fa565', // html/tag-header
    title: 'Header ট্যাগ',
    meta_description: '&lt;header&gt; এলিমেন্ট কী, এতে সাধারণত কী থাকে এবং এর ডিফল্ট CSS সেটিংস জানুন।',
    blocks: [
      { id: 'P8yKM1K7hRCW', type: 'richtext', html: '<hr>\n<p>একটি &lt;article&gt;-এর জন্য একটি হেডার:</p>' },
      { id: 'g53vPi6W91wM', type: 'code', language: 'html', code: '<article>\n  <header>\n    <h1>Most important heading here</h1>\n    <h3>Less important heading here</h3>\n    <p>Some additional information here</p>\n  </header>\n  <p>Lorem Ipsum dolor set amet....</p>\n</article>' },
      { id: 'Ab0DNlTPL58c', type: 'richtext', html: '<hr>' },
      { id: 'V8cjSGeuFQ5-', text: 'সংজ্ঞা ও ব্যবহার', type: 'heading', level: 2, anchor: 'definition-and-usage' },
      { id: 'w6rzw0CeeUzE', type: 'richtext', html: '<p><code>&lt;header&gt;</code> এলিমেন্ট ভূমিকামূলক কনটেন্ট বা নেভিগেশন লিঙ্কের একটি সেটের জন্য একটি কন্টেইনার তৈরি করে।</p>\n<p>একটি <code>&lt;header&gt;</code> এলিমেন্টে সাধারণত থাকে:</p>\n<p>এক বা একাধিক হেডিং এলিমেন্ট (<code>&lt;h1&gt;</code> - <code>&lt;h6&gt;</code>)</p>\n<p>লোগো বা আইকন</p>\n<p>লেখক-সংক্রান্ত তথ্য</p>\n<p>একটি ডকুমেন্টে একাধিক <code>&lt;header&gt;</code> এলিমেন্ট থাকতে পারে।</p>\n<p><b>মনে রাখবেন</b>: <code>&lt;header&gt;</code> ট্যাগ একটি <code>&lt;footer&gt;</code>, <code>&lt;address&gt;</code> বা অন্য একটি <code>&lt;header&gt;</code> এলিমেন্টের ভেতরে রাখা যায় না।</p>\n<hr>' },
      { id: 'mJtu7kyZEC43', text: 'ডিফল্ট CSS সেটিংস', type: 'heading', level: 2, anchor: 'default-css-settings' },
      { id: 'cgK_kBsxEtFQ', type: 'richtext', html: '<p>বেশিরভাগ ব্রাউজার <code>&lt;header&gt;</code> এলিমেন্টকে নিচের ডিফল্ট মান দিয়ে প্রদর্শন করবে:</p>' },
      { id: 'Qy7pQv4MkgxR', type: 'code', language: 'css', code: 'header {\n  display: block;\n}' },
    ],
    toc: [
      { id: 'definition-and-usage', text: 'সংজ্ঞা ও ব্যবহার', level: 2 },
      { id: 'default-css-settings', text: 'ডিফল্ট CSS সেটিংস', level: 2 },
    ],
  },
  {
    id: '2d7d900b-fc49-43ed-a395-eed504ca08d2', // html/tag-main
    title: 'Main ট্যাগ',
    meta_description: '&lt;main&gt; ট্যাগ কী, কী নিয়ম মানতে হয় এবং কোথায় ব্যবহার করা উচিত নয় তা জানুন।',
    blocks: [
      { id: '3wkbeWAwuVre', type: 'richtext', html: '<hr>\n<p>একটি &lt;article&gt;-এর জন্য একটি হেডার:</p>' },
      { id: 'E7c26wCnnBkC', type: 'code', language: 'html', code: '<main>\n  <h1>Web Browsers</h1>\n  <p>Google Chrome, Firefox, and Internet Explorer are the most used browsers today.</p>\n  <article>\n    <h1>Google Chrome</h1>\n    <p>Google Chrome is a free, open-source web browser developed by Google,\n    released in 2008.</p>\n  </article>\n  <article>\n    <h1>Internet Explorer</h1>\n    <p>Internet Explorer is a free web browser from Microsoft, released in 1995.</p>\n  </article>\n  <article>\n    <h1>Mozilla Firefox</h1>\n    <p>Firefox is a free, open-source web browser from Mozilla, released in 2004.</p>\n  </article>\n</main>' },
      { id: 'dYCXTvwQAPsY', type: 'richtext', html: '<hr>' },
      { id: 'icla81PahM-0', text: 'সংজ্ঞা ও ব্যবহার', type: 'heading', level: 2, anchor: 'definition-and-usage' },
      { id: 'M942DzIevR1r', type: 'richtext', html: '<p><code>&lt;main&gt;</code> ট্যাগ একটি ডকুমেন্টের মূল কনটেন্ট নির্ধারণ করে।</p>\n<p><code>&lt;main&gt;</code> এলিমেন্টের ভেতরের কনটেন্ট ডকুমেন্টের জন্য ইউনিক হওয়া উচিত। এতে সাইডবার, নেভিগেশন লিঙ্ক, কপিরাইট তথ্য, সাইট লোগো এবং সার্চ ফর্মের মতো এমন কোনো কনটেন্ট থাকা উচিত নয় যা একাধিক ডকুমেন্টে পুনরাবৃত্তি হয়।</p>\n<p><b>মনে রাখবেন:</b> একটি ডকুমেন্টে একের বেশি <code>&lt;main&gt;</code> এলিমেন্ট থাকতে পারবে না। <code>&lt;main&gt;</code> এলিমেন্ট কোনো <code>&lt;article&gt;</code>, <code>&lt;aside&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;header&gt;</code>, বা <code>&lt;nav&gt;</code> এলিমেন্টের ভেতরে থাকতে পারবে না।</p>' },
    ],
    toc: [{ id: 'definition-and-usage', text: 'সংজ্ঞা ও ব্যবহার', level: 2 }],
  },
  {
    id: '57012a91-a1b9-4258-9f36-ae728c0a26ea', // html/tag-mark
    title: 'Mark ট্যাগ',
    meta_description: '&lt;mark&gt; ট্যাগ দিয়ে টেক্সট হাইলাইট করার নিয়ম এবং এর ডিফল্ট CSS সেটিংস জানুন।',
    blocks: [
      { id: '7GhZaZp_TIUq', type: 'richtext', html: '<hr>\n<p>টেক্সটের কিছু অংশ হাইলাইট করা:</p>' },
      { id: 'ozDqmWjO-Di9', type: 'code', language: 'html', code: '<p>Do not forget to buy <mark>milk</mark> today.</p>' },
      { id: 'iCr8LvexJA6s', type: 'richtext', html: '<hr>' },
      { id: 'a53Lif8JOU1H', text: 'সংজ্ঞা ও ব্যবহার', type: 'heading', level: 2, anchor: 'definition-and-usage' },
      { id: 'mzhA3tm_IHH5', type: 'richtext', html: '<p><code>&lt;mark&gt;</code> ট্যাগ চিহ্নিত (মার্ক করা) টেক্সট নির্ধারণ করে।</p>\n<p>আপনার টেক্সটের কোনো অংশ <mark>হাইলাইট করতে চাইলে</mark> <code>&lt;mark&gt;</code> ট্যাগ ব্যবহার করুন।</p>\n<hr>' },
      { id: 'OObuBv_PK8A-', text: 'ডিফল্ট CSS সেটিংস', type: 'heading', level: 2, anchor: 'default-css-settings' },
      { id: 'R0hxU-st-sKE', type: 'richtext', html: '<p>বেশিরভাগ ব্রাউজার &lt;mark&gt; এলিমেন্টকে নিচের ডিফল্ট মান দিয়ে প্রদর্শন করবে:</p>' },
      { id: 'g9FHxG983rz7', type: 'code', language: 'css', code: 'mark {\n  background-color: yellow;\n  color: black;\n}' },
    ],
    toc: [
      { id: 'definition-and-usage', text: 'সংজ্ঞা ও ব্যবহার', level: 2 },
      { id: 'default-css-settings', text: 'ডিফল্ট CSS সেটিংস', level: 2 },
    ],
  },
  {
    id: '0e5a52ec-f0b6-48b3-8a2e-78b46d4c52fd', // html/tag-nav
    title: 'Nav ট্যাগ',
    meta_description: '&lt;nav&gt; ট্যাগ দিয়ে নেভিগেশন লিঙ্ক কীভাবে তৈরি করবেন এবং কখন ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'nRdPe8ETS8Z1', type: 'richtext', html: '<hr>\n<p>নেভিগেশন লিঙ্কের একটি সেট:</p>' },
      { id: '0dOH4eh2QZqy', type: 'code', language: 'html', code: '<nav>\n  <a href="/html/">HTML</a> |\n  <a href="/css/">CSS</a> |\n  <a href="/js/">JavaScript</a> |\n  <a href="/jquery/">jQuery</a>\n</nav>' },
      { id: 'xXzDLEZOgW-8', type: 'richtext', html: '<hr>' },
      { id: 'gJ-IvFdTLz_Y', text: 'সংজ্ঞা ও ব্যবহার', type: 'heading', level: 2, anchor: 'definition-and-usage' },
      { id: 'H90nx77t24fN', type: 'richtext', html: '<p><code>&lt;nav&gt;</code> ট্যাগ নেভিগেশন লিঙ্কের একটি সেট নির্ধারণ করে।</p>\n<p>লক্ষ্য করুন, একটি ডকুমেন্টের সব লিঙ্ক <code>&lt;nav&gt;</code> এলিমেন্টের ভেতরে থাকা উচিত নয়। <code>&lt;nav&gt;</code> এলিমেন্ট শুধুমাত্র প্রধান নেভিগেশন লিঙ্কের ব্লকের জন্য ব্যবহৃত হয়।</p>\n<p>প্রতিবন্ধী ব্যবহারকারীদের জন্য স্ক্রিন রিডারের মতো ব্রাউজার, এই এলিমেন্ট ব্যবহার করে ঠিক করতে পারে যে প্রাথমিক রেন্ডারিংয়ে এই কনটেন্ট বাদ দেওয়া হবে কিনা।</p>\n<hr>' },
      { id: 'XZCUfqU8kUC6', text: 'ডিফল্ট CSS সেটিংস', type: 'heading', level: 2, anchor: 'default-css-settings' },
      { id: '4k9RX3GDKhjH', type: 'richtext', html: '<p>বেশিরভাগ ব্রাউজার &lt;nav&gt; এলিমেন্টকে নিচের ডিফল্ট মান দিয়ে প্রদর্শন করবে:</p>' },
      { id: 'hC55EnRjFDWo', type: 'code', language: 'css', code: 'nav {\n  display: block;\n}' },
    ],
    toc: [
      { id: 'definition-and-usage', text: 'সংজ্ঞা ও ব্যবহার', level: 2 },
      { id: 'default-css-settings', text: 'ডিফল্ট CSS সেটিংস', level: 2 },
    ],
  },
  {
    id: 'bc15dc18-b181-462a-98c6-7e91a2281316', // html/tag-section
    title: 'Section ট্যাগ',
    meta_description: '&lt;section&gt; ট্যাগ কী এবং একটি ডকুমেন্টের বিভিন্ন সেকশন নির্ধারণে কীভাবে ব্যবহৃত হয় তা জানুন।',
    blocks: [
      { id: 'aKrKVhr2I1oR', type: 'richtext', html: '<hr>\n<p>একটি ডকুমেন্টের একটি সেকশন, যেখানে WWF কী তা ব্যাখ্যা করা হয়েছে:</p>' },
      { id: 'SFkMJA1ySkOE', type: 'code', language: 'html', code: '<section>\n  <h1>WWF</h1>\n  <p>The World Wide Fund for Nature (WWF) is....</p>\n</section>' },
      { id: 'ZKxKXOVdOzBS', type: 'richtext', html: '<hr>' },
      { id: 'qu2igycxMkzq', text: 'সংজ্ঞা ও ব্যবহার', type: 'heading', level: 2, anchor: 'definition-and-usage' },
      { id: 'Ey9L4ORLDsBl', type: 'richtext', html: '<p><code>&lt;section&gt;</code> ট্যাগ একটি ডকুমেন্টে বিভিন্ন সেকশন নির্ধারণ করে, যেমন চ্যাপ্টার, হেডার, ফুটার, বা ডকুমেন্টের অন্য যেকোনো সেকশন।</p>\n<hr>' },
      { id: 'qPUOm2ZeGxFV', text: 'ডিফল্ট CSS সেটিংস', type: 'heading', level: 2, anchor: 'default-css-settings' },
      { id: 'i4T0OQ3_NYzS', type: 'richtext', html: '<p>বেশিরভাগ ব্রাউজার &lt;section&gt; এলিমেন্টকে নিচের ডিফল্ট মান দিয়ে প্রদর্শন করবে:</p>' },
      { id: '_gO5OY0Cu6-x', type: 'code', language: 'css', code: 'section {\n  display: block;\n}' },
    ],
    toc: [
      { id: 'definition-and-usage', text: 'সংজ্ঞা ও ব্যবহার', level: 2 },
      { id: 'default-css-settings', text: 'ডিফল্ট CSS সেটিংস', level: 2 },
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
console.log(`html batch1: ${ok}/${docs.length} written`)
