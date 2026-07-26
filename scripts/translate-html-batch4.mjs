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
    id: 'ffdfb095-7d93-4ab1-a23c-8a0d5d67aebf', // html/iframes
    title: 'HTML Iframe',
    meta_description: 'HTML iframe দিয়ে একটি পেজের ভেতরে আরেকটি পেজ দেখানো, আকার, বর্ডার ও টার্গেট সেট করা শিখুন।',
    blocks: [
      { id: 'D7NrBPoe5VnD', type: 'richtext', html: '<hr>\n<p>একটি ওয়েব পেজের ভেতরে আরেকটি ওয়েব পেজ প্রদর্শন করতে iframe ব্যবহার করা হয়।</p>\n<iframe src="../index.php" frameborder="0" height="310px" width="100%"></iframe>\n<hr>' },
      { id: 'RBLRpxJIrU1A', text: 'Iframe সিনট্যাক্স', type: 'heading', level: 2, anchor: 'iframe-syntax' },
      { id: 'qmR6sJoXXlFT', type: 'richtext', html: '<p>একটি HTML iframe <code>&lt;iframe&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়:</p>' },
      { id: 'T1qf2fs6bxSv', type: 'code', language: 'html', code: '<iframe src="URL"></iframe>' },
      { id: 'rA77PNBc587y', type: 'richtext', html: '<p><code>src</code> অ্যাট্রিবিউট ইনলাইন ফ্রেম পেজের URL (ওয়েব ঠিকানা) নির্ধারণ করে।</p>\n<hr>' },
      { id: 'HoiuuPkI2j1J', text: 'Iframe - উচ্চতা ও প্রস্থ সেট করা', type: 'heading', level: 2, anchor: 'iframe---set-height-and-width' },
      { id: 'j2PyCPh2jYS9', type: 'richtext', html: '<p>iframe-এর আকার নির্ধারণ করতে <code>height</code> এবং <code>width</code> অ্যাট্রিবিউট ব্যবহার করুন।</p>\n<p>height এবং width ডিফল্টভাবে পিক্সেলে উল্লেখ করা হয়:</p>' },
      { id: '-X3Jf_Qp8yXO', type: 'code', language: 'html', code: '<iframe src="demo_iframe.htm" height="200" width="300"></iframe>' },
      { id: '495yuNh-hdWs', type: 'richtext', html: '<p>height এবং width শতাংশেও উল্লেখ করা যায়:</p>' },
      { id: 'ymr7Q3mHJJf2', type: 'code', language: 'html', code: '<iframe src="demo_iframe.htm" height="100%" width="100%"></iframe>' },
      { id: 'Q2PQfYzNTrOB', type: 'richtext', html: '<p>অথবা আপনি iframe-এর height এবং width সেট করতে CSS ব্যবহার করতে পারেন:</p>' },
      { id: 'TiUw6s0H8QTI', type: 'code', language: 'html', code: '<iframe src="demo_iframe.htm" style="height:200px;width:300px;"></iframe>' },
      { id: 'BCkaytNPrjAo', type: 'richtext', html: '<hr>' },
      { id: 'JbEPf9UfJwMP', text: 'Iframe - বর্ডার সরানো', type: 'heading', level: 2, anchor: 'iframe---remove-the-border' },
      { id: 'KxJJy5ALxXSF', type: 'richtext', html: '<p>ডিফল্টভাবে, একটি iframe-এর চারপাশে একটি বর্ডার থাকে।</p>\n<p>বর্ডার সরাতে, <code>style</code> অ্যাট্রিবিউট যোগ করুন এবং CSS-এর <code>border</code> প্রপার্টি ব্যবহার করুন:</p>' },
      { id: 'zwJ_Fzp6BGj6', type: 'code', language: 'html', code: '<iframe src="demo_iframe.htm" style="border:none;"></iframe>' },
      { id: 'Sw1vV00nbSCh', type: 'richtext', html: '<p>CSS দিয়ে, আপনি iframe-এর বর্ডারের আকার, স্টাইল এবং রঙও পরিবর্তন করতে পারেন:</p>' },
      { id: 'CMVAPiGDFlsA', type: 'code', language: 'html', code: '<iframe src="demo_iframe.htm" style="border:2px solid red;"></iframe>' },
      { id: '1k5mEkycRHmf', type: 'richtext', html: '<hr>' },
      { id: 'AyVRCibLiAc_', text: 'Iframe - একটি লিঙ্কের টার্গেট', type: 'heading', level: 2, anchor: 'iframe---target-for-a-link' },
      { id: 'mwP7dBc8W7Fv', type: 'richtext', html: '<p>একটি লিঙ্কের টার্গেট ফ্রেম হিসেবে একটি iframe ব্যবহার করা যায়।</p>\n<p>লিঙ্কের <code>target</code> অ্যাট্রিবিউটকে অবশ্যই iframe-এর <code>name</code> অ্যাট্রিবিউট নির্দেশ করতে হবে:</p>' },
      { id: 'pGm0V6ZENKnZ', type: 'code', language: 'html', code: '<iframe src="demo.html" name="iframe_a"></iframe>\n<p><a href="https://www.learncomputer.in" target="iframe_a">Learncomputer.in</a></p>' },
    ],
    toc: [
      { id: 'iframe-syntax', text: 'Iframe সিনট্যাক্স', level: 2 },
      { id: 'iframe---set-height-and-width', text: 'Iframe - উচ্চতা ও প্রস্থ সেট করা', level: 2 },
      { id: 'iframe---remove-the-border', text: 'Iframe - বর্ডার সরানো', level: 2 },
      { id: 'iframe---target-for-a-link', text: 'Iframe - একটি লিঙ্কের টার্গেট', level: 2 },
    ],
  },
  {
    id: '0f7ac16f-290c-4528-9de1-53c1d5f3553e', // html/responsive
    title: 'HTML রেসপনসিভ',
    meta_description: 'রেসপনসিভ ওয়েব ডিজাইন কী, ভিউপোর্ট, রেসপনসিভ ইমেজ এবং টেক্সট সাইজ কীভাবে সেট করবেন তা জানুন।',
    blocks: [
      { id: 'G5gC65nWdoG-', type: 'richtext', html: '<hr>' },
      { id: '_rdRrLGZDDc8', text: 'রেসপনসিভ ওয়েব ডিজাইন কী?', type: 'heading', level: 2, anchor: 'what-is-responsive-web-design' },
      { id: 'v-92zOvPSoEm', type: 'richtext', html: '<p>রেসপনসিভ ওয়েব ডিজাইন মানে HTML ও CSS ব্যবহার করে একটি ওয়েবসাইটকে স্বয়ংক্রিয়ভাবে রিসাইজ, হাইড, সংকুচিত বা বড় করা, যাতে এটি সব ডিভাইসে (ডেস্কটপ, ট্যাবলেট এবং ফোন) ভালো দেখায়:</p>\n<p><b>মনে রাখবেন:</b> একটি ওয়েব পেজ <b><u>যেকোনো ডিভাইসেই</u></b> ভালো দেখানো উচিত!</p>\n<hr>' },
      { id: '8p2HlL8DKygy', text: 'ভিউপোর্ট সেট করা', type: 'heading', level: 2, anchor: 'setting-the-viewport' },
      { id: 'ThwBgU917Okn', type: 'richtext', html: '<p>রেসপনসিভ ওয়েব পেজ তৈরির সময়, আপনার সব ওয়েব পেজে নিচের <code>&lt;meta&gt;</code> এলিমেন্টটি যোগ করুন:</p>' },
      { id: '93oUvUK9eWvG', type: 'code', language: 'html', code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' },
      { id: '2HAVcThUxwDR', type: 'richtext', html: '<p>এটি আপনার পেজের ভিউপোর্ট সেট করবে, যা ব্রাউজারকে পেজের মাপ ও স্কেলিং নিয়ন্ত্রণ করার নির্দেশনা দেবে।</p>\n<hr>' },
      { id: 'boQsBfCpjzKr', text: 'রেসপনসিভ ইমেজ', type: 'heading', level: 2, anchor: 'responsive-images' },
      { id: 'vZgnYYpGbJcK', type: 'richtext', html: '<p>রেসপনসিভ ইমেজ হলো এমন ইমেজ, যা যেকোনো ব্রাউজারের আকারে সুন্দরভাবে খাপ খেয়ে যায়।</p>' },
      { id: 'LVFKcZbo3M3_', text: 'width প্রপার্টি ব্যবহার করা', type: 'heading', level: 3, anchor: 'using-the-width-property' },
      { id: 'gqA03TS-S2aC', type: 'richtext', html: '<p>CSS-এর <code>width</code> প্রপার্টি 100% সেট করা থাকলে, ইমেজটি রেসপনসিভ হবে এবং ছোট-বড় হবে:</p>' },
      { id: 'WBzmQMtPmWOp', type: 'image', alt: '', width: 500, height: 600, publicId: 'img/img_girl' },
      { id: 'A2gLdLjbX8HK', type: 'richtext', html: '<p></p>' },
      { id: 'c1ffNchHcrWd', type: 'code', language: 'html', code: '<img src="img_girl.jpg" style="width:100%;">' },
      { id: 'u1kmhQKU2NQ5', type: 'richtext', html: '<p>লক্ষ্য করুন, উপরের উদাহরণে, ইমেজটি তার আসল আকারের চেয়ে বড় হয়ে যেতে পারে। অনেক ক্ষেত্রে, এর পরিবর্তে <code>max-width</code> প্রপার্টি ব্যবহার করা একটি ভালো সমাধান।</p>' },
      { id: 'kzEf_C8-neu8', text: 'max-width প্রপার্টি ব্যবহার করা', type: 'heading', level: 2, anchor: 'using-the-max-width-property' },
      { id: 'ETqwV_80z2Dc', type: 'richtext', html: '<p><code>max-width</code> প্রপার্টি 100% সেট করা থাকলে, প্রয়োজনে ইমেজটি ছোট হবে, কিন্তু কখনো তার আসল আকারের চেয়ে বড় হবে না:</p>' },
      { id: 'RV1RleG1hnEG', type: 'image', alt: '', width: 500, height: 600, publicId: 'img/img_girl' },
      { id: 'AoO0BEjdY_B0', type: 'richtext', html: '<p></p>' },
      { id: '_ARxunwDB6GZ', type: 'code', language: 'html', code: '<img src="img_girl.jpg" style="max-width:100%;height:auto;">' },
      { id: 'bst4XTJ5irIm', text: 'ব্রাউজারের প্রস্থ অনুযায়ী ভিন্ন ইমেজ দেখানো', type: 'heading', level: 2, anchor: 'show-different-images-depending-on-browser-width' },
      { id: 'P0mr689yuT75', type: 'richtext', html: `<p>HTML <code>&lt;picture&gt;</code> এলিমেন্ট আপনাকে বিভিন্ন ব্রাউজার উইন্ডো আকারের জন্য ভিন্ন ভিন্ন ইমেজ নির্ধারণ করতে দেয়।</p>
<p>নিচের ইমেজটি প্রস্থ অনুযায়ী কীভাবে পরিবর্তিত হয় তা দেখতে ব্রাউজার উইন্ডো রিসাইজ করুন:</p>
<picture>
                                    <source srcset="../assets/img/img_smallflower.jpg" media="(max-width: 600px)">
                                    <source srcset="../assets/img/img_flowers.jpg" media="(max-width: 1500px)">
                                    <source srcset="../assets/img/flowers.jpg">
                                    <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960395/img/img_smallflower.webp" alt="Flowers">
                                </picture>
<p></p>` },
      { id: 'OvNUz1_056eB', type: 'code', language: 'html', code: '<picture>\n    <source srcset="img_smallflower.jpg" media="(max-width: 600px)">\n    <source srcset="img_flowers.jpg" media="(max-width: 1500px)">\n    <source srcset="flowers.jpg">\n    <img src="img_smallflower.jpg" alt="Flowers">\n</picture>' },
      { id: 'L8eESqRx8cMq', type: 'richtext', html: '<hr>' },
      { id: 'cvJeSP6GtZAL', text: 'রেসপনসিভ টেক্সট সাইজ', type: 'heading', level: 2, anchor: 'responsive-text-size' },
      { id: 'gMW3YOhrgQtt', type: 'richtext', html: `<p>টেক্সট সাইজ একটি "vw" ইউনিট দিয়ে সেট করা যায়, যার মানে "viewport width" (ভিউপোর্টের প্রস্থ)।</p>
<p>এভাবে টেক্সট সাইজ ব্রাউজার উইন্ডোর আকার অনুযায়ী পরিবর্তিত হবে:</p>
<div class="bg-gray p-5 mb-3">
                                    <h1 style="font-size:8vw;">Hello World</h1>
                                    <p style="font-size:2vw;">টেক্সট সাইজ কীভাবে স্কেল হয় তা দেখতে ব্রাউজার উইন্ডো রিসাইজ করুন।</p>
                                </div>` },
      { id: 'IgAPXkMlck9V', type: 'code', language: 'html', code: '<h1 style="font-size:10vw">Hello World</h1>\n<p style="font-size:2vw;">Resize the browser window to see how the text size scales.</p>' },
      { id: 'e7NyK1QGJfuA', type: 'richtext', html: '<p><b>ভিউপোর্ট হলো ব্রাউজার উইন্ডোর আকার। 1vw = ভিউপোর্টের প্রস্থের 1%। ভিউপোর্ট 50cm প্রশস্ত হলে, 1vw হলো 0.5cm।</b></p>' },
    ],
    toc: [
      { id: 'what-is-responsive-web-design', text: 'রেসপনসিভ ওয়েব ডিজাইন কী?', level: 2 },
      { id: 'setting-the-viewport', text: 'ভিউপোর্ট সেট করা', level: 2 },
      { id: 'responsive-images', text: 'রেসপনসিভ ইমেজ', level: 2 },
      { id: 'using-the-width-property', text: 'width প্রপার্টি ব্যবহার করা', level: 3 },
      { id: 'using-the-max-width-property', text: 'max-width প্রপার্টি ব্যবহার করা', level: 2 },
      { id: 'show-different-images-depending-on-browser-width', text: 'ব্রাউজারের প্রস্থ অনুযায়ী ভিন্ন ইমেজ দেখানো', level: 2 },
      { id: 'responsive-text-size', text: 'রেসপনসিভ টেক্সট সাইজ', level: 2 },
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
console.log(`html batch4: ${ok}/${docs.length} written`)
