import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '595317a4-e099-4151-9b7f-03b7efee6c1d' // design/color-theory
const title = 'কালার থিওরি'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'কালার হুইল, RGB, CMYK এবং কালার হারমোনির মডেলসহ ডিজাইনে কালার থিওরি ও কালার কম্বিনেশনের বেসিক্স শিখুন।'

const blocks = [
  { id: 'kxSVTfpGTLA_', type: 'richtext', html: `<p>এই নিবন্ধটি ডিজাইনে কালার থিওরি এবং কালার কম্বিনেশনের বেসিক্স নিয়ে আলোচনা করে: কালার হুইল, RGB, CMYK এবং কালার হারমোনির মডেল সম্পর্কে আরও জানুন।</p>
<p>অনেকে মনে করেন UI-এর জন্য রঙ বাছাই মূলত ডিজাইনারের রুচি ও সৌন্দর্যবোধের উপর নির্ভর করে। তবে, রঙ বাছাইয়ের প্রক্রিয়া যতটা মনে হয় তার চেয়ে বেশি জটিল এবং ডিজাইনে এটি গুরুত্বপূর্ণ ভূমিকা রাখে। কালার সাইকোলজি নিয়ে আমাদের আগের একটি নিবন্ধে, আমরা জেনেছিলাম যে রঙের আমাদের মেজাজ ও আচরণে বড় প্রভাব থাকে। এই কারণেই একটি পণ্যের সাফল্য অনেকাংশে ডিজাইনের জন্য বাছাই করা রঙের উপর নির্ভর করে। গবেষণায় দেখা গেছে যে একটি পণ্য সম্পর্কে অবচেতন মতামত তৈরি করতে মানুষের মাত্র 90 সেকেন্ড লাগে, এবং সেই মূল্যায়নের 62% থেকে 90% শুধু রঙের উপর ভিত্তি করে হয়। তাই, সঠিকভাবে বাছাই করা রঙ আপনার পণ্যের কনভার্সন উন্নত করার পাশাপাশি এর ব্যবহারযোগ্যতাও বাড়াতে পারে।</p>
<p>ভালো ডিজাইন তৈরি করতে এবং রঙ আরও কার্যকরভাবে ব্যবহার করতে, আপনাকে বুঝতে হবে রঙ কীভাবে তৈরি হয় এবং একে অপরের সাথে কীভাবে সম্পর্কিত। এই কারণেই আর্ট স্কুল, কলেজ ও বিশ্ববিদ্যালয়ের শিক্ষার্থীরা রঙের প্রকৃতি নিয়ে কালার থিওরির বিজ্ঞান পড়াশোনা করে। আজ, আমরা আপনাকে কালার কম্বিনেশন সম্পর্কে কালার থিওরির বেসিক্স মনে করিয়ে দিতে (বা হয়তো নতুন করে শেখাতে) চাই, যা আপনার ডিজাইন তৈরির প্রক্রিয়ায় কার্যকরভাবে প্রয়োগ করা যেতে পারে।</p>
<hr>` },
  { id: 'KI_2oArScCMA', text: 'কালার হুইল', type: 'heading', level: 2, anchor: 'color-wheel' },
  { id: 'cxFvxv813rbY', type: 'richtext', html: `<p>আপনি যদি পেইন্টিং সম্পর্কিত কোনো ক্লাস করে থাকেন, তাহলে নিশ্চয়ই বিভিন্ন রঙে তৈরি একটি বৃত্ত দেখেছেন। একে কালার হুইল বলা হয়, যা বিভিন্ন রঙ একে অপরের সাথে কীভাবে সম্পর্কিত এবং কীভাবে সেগুলো মেশানো যায় তা বুঝতে সাহায্য করে। কালার সার্কেল সাধারণত প্রাইমারি, সেকেন্ডারি এবং টারশিয়ারি রঙ দিয়ে তৈরি হয়। প্রাইমারি হলো সেই তিনটি পিগমেন্ট রঙ, যা অন্য কোনো রঙের সংমিশ্রণে তৈরি করা যায় না। প্রাইমারি রঙ মিশিয়ে, আমরা সেকেন্ডারি রঙ পাই, এবং প্রাইমারি ও সেকেন্ডারি রঙের মিশ্রণ আমাদের টারশিয়ারি রঙ দেয়, যেগুলোর নাম সাধারণত দুই শব্দের হয়, যেমন red-violet।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
       <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960264/img/graphics-design/color-wheel-for-designers.webp" alt="Color Wheel" class="img-fluid">
      </div>
<p>কালার সার্কেল 1666 সালে Isaac Newton স্কিম্যাটিক উপায়ে তৈরি করেছিলেন এবং তারপর থেকে এটি অনেক পরিবর্তনের মধ্য দিয়ে গেছে, কিন্তু এখনও কালার কম্বিনেশনের প্রধান টুল হিসেবে রয়ে গেছে। মূল ধারণাটি হলো, কালার হুইল এমনভাবে তৈরি করতে হবে যাতে রঙগুলো যথাযথভাবে মেশানো যায়।</p>
<hr>` },
  { id: 'f6-FEx0QLKyD', text: 'কালার মডেল', type: 'heading', level: 2, anchor: 'color-models' },
  { id: 'P9Uwe7CzoZi5', type: 'richtext', html: `<p>রঙ মেশানো শুরু করার আগে আপনাকে বুঝতে হবে যে রঙের দুটি ভিন্ন প্রকৃতি আছে: স্পর্শযোগ্য রঙ, যা বস্তুর পৃষ্ঠতল, এবং অন্যগুলো যা আলো দিয়ে তৈরি হয়, যেমন TV-এর রশ্মি। এই দুই ধরন থেকে কালার হুইল গঠনকারী দুটি কালার মডেল তৈরি হয়: additive এবং subtractive।</p>
<p>Additive কালার মডেল লাল, নীল এবং সবুজকে প্রাইমারি রঙ হিসেবে বিবেচনা করে, তাই একে RGB কালার সিস্টেমও বলা হয়। এই মডেলটি স্ক্রিনে ব্যবহৃত সব রঙের ভিত্তি। এই সিস্টেমে সমান অনুপাতে প্রাইমারি রঙের সংমিশ্রণ সেকেন্ডারি রঙ তৈরি করে, যেগুলো হলো cyan, magenta এবং yellow, কিন্তু মনে রাখবেন, আপনি যত বেশি আলো যোগ করবেন, রঙ তত বেশি উজ্জ্বল ও হালকা হবে। রং, ডাই, কালি এবং অন্যান্য স্পর্শযোগ্য বস্তুর subtractive কালার সিস্টেমে অভ্যস্ত মানুষদের জন্য additive রঙ মেশানোর ফলাফল প্রায়ই স্বজ্ঞার বিপরীত মনে হয়।</p>
<p>Subtractive কালার মডেল আলো বিয়োগ করে রঙ পায়। এতে দুটি কালার সিস্টেম আছে। প্রথমটি হলো RYB (red, yellow, blue), যাকে আর্টিস্টিক সিস্টেমও বলা হয়, যা প্রায়ই আর্ট শিক্ষায়, বিশেষ করে পেইন্টিংয়ে ব্যবহৃত হয়। RYB ছিল আধুনিক বৈজ্ঞানিক কালার থিওরির ভিত্তি, যা নির্ধারণ করেছিল যে cyan, magenta এবং yellow একত্রিত করার সবচেয়ে কার্যকর তিনটি রঙের সেট। এভাবেই CMY কালার মডেল তৈরি হয়েছে। এটি মূলত প্রিন্টিংয়ে ব্যবহৃত হতো, এবং যখন ফটোমেকানিক্যাল প্রিন্টিংয়ে কালো কালি, মূল উপাদান, অন্তর্ভুক্ত করা হলো, তখন সিস্টেমটির নাম হলো CMYK (cyan, magenta, yellow, এবং black)। এই অতিরিক্ত পিগমেন্ট ছাড়া, কালোর সবচেয়ে কাছের শেডটি হতো ঘোলাটে বাদামি।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align: center;">
       <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960266/img/graphics-design/diff-between-rgb-cmyk.webp" alt="RGB vs. CMYK" style="width: 100%;">
      </div>
<hr>` },
  { id: 'UQLFVfRdJ5L5', text: 'Additive বনাম Subtractive', type: 'heading', level: 2, anchor: 'additive-vs-subtractive' },
  { id: '4dG7D2Nc5zxx', type: 'richtext', html: '<p>এই দুটি সিস্টেমের মধ্যে প্রধান পার্থক্যটি মনে রাখা উচিত: additive হলো ডিজিটাল স্ক্রিনের জন্য এবং subtractive হলো প্রিন্ট মিডিয়ার জন্য। আপনি যে ডিজাইন প্রজেক্টে কাজ করছেন তা যদি প্রিন্ট করার উদ্দেশ্যে হয়, তাহলে সহজ কিন্তু গুরুত্বপূর্ণ নিয়মটি ভুলে যাবেন না: স্ক্রিনে আপনি যে রঙ দেখেন, তা প্রিন্টে কখনোই একই রকম দেখায় না। Additive কালার স্পেকট্রাম CMYK-এর চেয়ে বিস্তৃত, যে কারণে ডিজাইনারদের সুপারিশ করা হয় প্রিন্ট করার আগে তাদের প্রজেক্ট subtractive কালার সিস্টেমে রূপান্তর করতে, যাতে তারা প্রিন্টে আসল ফলাফলের কাছাকাছি কিছু দেখতে পারেন। তবে, আপনি যদি ডিজিটাল পণ্য নিয়ে কাজ করেন, তাহলে RGB কালার সিস্টেম একটি বুদ্ধিমান পছন্দ, কারণ এর বিস্তৃত কালার স্পেকট্রাম দিয়ে অসাধারণ জিনিস তৈরি করা যায়।</p>' },
  { id: 'vb5lGnrSYz3M', text: 'কালার হারমোনি', type: 'heading', level: 2, anchor: 'color-harmony' },
  { id: 'oQxXbxRZ8Bn8', type: 'richtext', html: '<p>"হারমোনি" শব্দটি সাধারণত সুশৃঙ্খল ও আনন্দদায়ক কিছুর সাথে যুক্ত। কালার হারমোনি হলো ব্যবহারকারীদের উপলব্ধির জন্য সবচেয়ে আকর্ষণীয় ও কার্যকর উপায়ে ডিজাইনে রঙ সাজানো। রঙ যখন সুসংগঠিত থাকে, দর্শকরা আনন্দিত ও শান্ত অনুভব করেন, আর ডিজাইনে অসামঞ্জস্য বিশৃঙ্খলা ও অস্বস্তির অনুভূতি দেয়। ডিজাইনে কালার ব্যালান্স অত্যন্ত গুরুত্বপূর্ণ, কারণ ব্যবহারকারীরা প্রথম দর্শনেই একটি ওয়েবসাইট বা অ্যাপ্লিকেশন সম্পর্কে ধারণা তৈরি করেন, এবং রঙের এতে বড় প্রভাব থাকে। ডিজাইনাররা কার্যকরভাবে কাজ করে এমন কিছু বেসিক কালার স্কিম চিহ্নিত করেছেন।</p>' },
  { id: 'UaETqg2PUEh8', text: 'মনোক্রোম্যাটিক', type: 'heading', level: 2, anchor: 'monochromatic' },
  { id: 'ey2wXtGL5QKJ', type: 'richtext', html: `<p>এটি একটি রঙের বিভিন্ন টোন ও শেডের উপর ভিত্তি করে তৈরি। মনোক্রোম্যাটিক হারমোনি সবসময় একটি জয়ী পছন্দ, কারণ এতে ভুল করে একটি বিস্বাদ কালার স্কিম তৈরি করা কঠিন।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align: center;">
       <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960313/img/graphics-design/monochomatic.webp" alt="Monochomatic" class="img-fluid">
      </div>` },
  { id: 'm16tjTEGH6LA', text: 'অ্যানালগাস', type: 'heading', level: 2, anchor: 'analogous' },
  { id: 'RDE7fw-dytHL', type: 'richtext', html: `<p>অ্যানালগাস হারমোনি তৈরি করতে, আপনাকে কালার হুইলে একে অপরের ঠিক পাশে থাকা রঙ ব্যবহার করতে হবে। এই ধরনের কালার স্কিম এমন ডিজাইনে ব্যবহার করা হয় যেখানে কোনো কনট্রাস্টের প্রয়োজন নেই, যেমন ওয়েব পেজ বা ব্যানারের ব্যাকগ্রাউন্ড।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align: center;">
       <video autoplay="" muted="" loop="" playsinline="" class="img-fluid" aria-label="Analogous"><source src="https://res.cloudinary.com/docslca/video/upload/v1784960230/img/graphics-design/analogous.mp4" type="video/mp4"></video>
      </div>` },
  { id: 'W9CCXKdcqI2B', text: 'কমপ্লিমেন্টারি', type: 'heading', level: 2, anchor: 'complementary' },
  { id: 'n5685-I4PqMg', type: 'richtext', html: `<p>কমপ্লিমেন্টারি স্কিম হলো কালার হুইলে একে অপরের বিপরীতে থাকা রঙের মিশ্রণ। এই স্কিমটি অ্যানালগাস ও মনোক্রোম্যাটিকের বিপরীত, কারণ এর লক্ষ্য উচ্চ কনট্রাস্ট তৈরি করা। উদাহরণস্বরূপ, নীল ব্যাকগ্রাউন্ডে কমলা বাটন যেকোনো ইন্টারফেসে সহজেই চোখে পড়ে।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align: center;">
       <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960265/img/graphics-design/complementary.webp" alt="Complementary" class="img-fluid">
      </div>` },
  { id: 'UVkqBkIS09FQ', text: 'স্প্লিট-কমপ্লিমেন্টারি', type: 'heading', level: 2, anchor: 'split-complementary' },
  { id: '3QI2zR7_RPxB', type: 'richtext', html: `<p>এই স্কিমটি আগেরটির মতোই কাজ করে, তবে এতে আরও বেশি রঙ ব্যবহার করা হয়। উদাহরণস্বরূপ, আপনি যদি নীল রঙ বেছে নেন, তাহলে আপনাকে এর বিপরীত রঙের সংলগ্ন আরও দুটি রঙ নিতে হবে, অর্থাৎ হলুদ ও লাল। এখানে কনট্রাস্ট কমপ্লিমেন্টারি স্কিমের চেয়ে কম তীক্ষ্ণ, কিন্তু এতে আরও বেশি রঙ ব্যবহার করা যায়।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align: center;">
       <video autoplay="" muted="" loop="" playsinline="" class="img-fluid" aria-label="Complementary"><source src="https://res.cloudinary.com/docslca/video/upload/v1784960345/img/graphics-design/split-complementary.mp4" type="video/mp4"></video>
      </div>` },
  { id: 'ZobjQubVABX6', text: 'ট্রায়াডিক', type: 'heading', level: 2, anchor: 'triadic' },
  { id: 'Pa_VuD3U0ZPL', type: 'richtext', html: `<p>ডিজাইনে যখন আরও বেশি রঙের প্রয়োজন হয়, তখন আপনি ট্রায়াডিক স্কিম চেষ্টা করতে পারেন। এটি কালার হুইলে সমদূরত্বে থাকা তিনটি আলাদা রঙের উপর ভিত্তি করে তৈরি। এই স্কিমে ব্যালান্স বজায় রাখতে, একটি রঙকে প্রধান এবং অন্যগুলোকে অ্যাকসেন্ট হিসেবে ব্যবহার করার পরামর্শ দেওয়া হয়।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align: center;">
       <video autoplay="" muted="" loop="" playsinline="" class="img-fluid" aria-label="Complementary"><source src="https://res.cloudinary.com/docslca/video/upload/v1784960348/img/graphics-design/triadic.mp4" type="video/mp4"></video>
      </div>` },
  { id: 'aX37MFibkMKN', text: 'টেট্রাডিক / ডাবল-কমপ্লিমেন্টারি', type: 'heading', level: 2, anchor: 'tetradicdouble-complementary' },
  { id: '6I_BTfy43IhC', type: 'richtext', html: `<p>টেট্রাডিক কালার স্কিম অভিজ্ঞ ডিজাইনারদের জন্য, কারণ এটি ব্যালান্স করা সবচেয়ে কঠিন। এতে হুইল থেকে চারটি রঙ ব্যবহার করা হয়, যেগুলো কমপ্লিমেন্টারি জোড়া। বাছাই করা রঙের বিন্দুগুলো সংযুক্ত করলে সেগুলো একটি আয়তক্ষেত্র তৈরি করে। এই স্কিম মেলানো কঠিন, কিন্তু আপনি যদি সবকিছু ঠিকভাবে করেন, ফলাফল দুর্দান্ত হতে পারে।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align: center;">
       <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960346/img/graphics-design/tetradic.webp" alt="Complementary" class="img-fluid">
      </div>
<p>কালার থিওরি একটি জটিল বিজ্ঞান, যা শিখতে একদিনের বেশি সময় লাগে। তবে, বেসিক্স বোঝা অত্যন্ত গুরুত্বপূর্ণ, যাতে আপনি কী করছেন তা জেনে একটি কার্যকর ডিজাইন তৈরি করতে পারেন।</p>
<p class="note">
       <b>মনে রাখবেন:</b>
       Color Theory রিসোর্স ডাউনলোড করতে <a href="https://res.cloudinary.com/docslca/raw/upload/v1784959172/pdfs/Color-Theory" target="_blank" download="LCA-Color-Theory">এখানে ক্লিক করুন</a>।
      </p>` },
]

const toc = [
  { id: 'color-wheel', text: 'কালার হুইল', level: 2 },
  { id: 'color-models', text: 'কালার মডেল', level: 2 },
  { id: 'additive-vs-subtractive', text: 'Additive বনাম Subtractive', level: 2 },
  { id: 'color-harmony', text: 'কালার হারমোনি', level: 2 },
  { id: 'monochromatic', text: 'মনোক্রোম্যাটিক', level: 2 },
  { id: 'analogous', text: 'অ্যানালগাস', level: 2 },
  { id: 'complementary', text: 'কমপ্লিমেন্টারি', level: 2 },
  { id: 'split-complementary', text: 'স্প্লিট-কমপ্লিমেন্টারি', level: 2 },
  { id: 'triadic', text: 'ট্রায়াডিক', level: 2 },
  { id: 'tetradicdouble-complementary', text: 'টেট্রাডিক / ডাবল-কমপ্লিমেন্টারি', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('design/color-theory: 1/1 written')
