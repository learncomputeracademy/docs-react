import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const docs = [
  {
    id: 'a8b35566-e196-4abb-804b-e161c661fe4e', // design/flyer
    title: 'ফ্লায়ার ডিজাইন',
    meta_description: 'বিনামূল্যে ডাউনলোডযোগ্য ফ্লায়ার ডিজাইন উদাহরণসহ অনুশীলন করুন — রিয়েল এস্টেট, খাবার, ব্যবসা, ট্রাভেল এবং আরও অনেক কিছু।',
    blocks: [
      { id: 'svjSheeOeIOE', text: 'ফ্লায়ার ডিজাইন', type: 'heading', level: 2, anchor: 'flyer-design' },
      { id: 'gFAtdGuKSZQr', type: 'richtext', html: '<hr>' },
      { id: 'OicpOo-tN8OM', type: 'table', header: ['অনুশীলনী', 'ইমেজ ও কপি ডাউনলোড করুন'], rows: [
        ['১. রিয়েল এস্টেট ফ্লায়ার <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960279/img/graphics-design/flyer/thumbnail/flyer-01.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960268/img/graphics-design/flyer/flyer-01.webp" class="btn btn-primary" download="LCA-flyer-01">ডাউনলোড করুন</a>'],
        ['২. খাবারের ফ্লায়ার <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960280/img/graphics-design/flyer/thumbnail/flyer-02.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960269/img/graphics-design/flyer/flyer-02.webp" class="btn btn-primary" download="LCA-flyer-02">ডাউনলোড করুন</a>'],
        ['৩. বার্গার ফ্লায়ার <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960281/img/graphics-design/flyer/thumbnail/flyer-03.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960271/img/graphics-design/flyer/flyer-03.webp" class="btn btn-primary" download="LCA-flyer-03">ডাউনলোড করুন</a>'],
        ['৪. বিজনেস ফ্লায়ার <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960282/img/graphics-design/flyer/thumbnail/flyer-04.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960272/img/graphics-design/flyer/flyer-04.webp" class="btn btn-primary" download="LCA-flyer-04">ডাউনলোড করুন</a>'],
        ['৫. এলিগ্যান্ট বিজনেস ফ্লায়ার <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960283/img/graphics-design/flyer/thumbnail/flyer-05.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960273/img/graphics-design/flyer/flyer-05.webp" class="btn btn-primary" download="LCA-flyer-05">ডাউনলোড করুন</a>'],
        ['৬. বিজনেস ব্রোশিওর ফ্লায়ার <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960284/img/graphics-design/flyer/thumbnail/flyer-06.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960274/img/graphics-design/flyer/flyer-06.webp" class="btn btn-primary" download="LCA-flyer-06">ডাউনলোড করুন</a>'],
        ['৭. ট্রাভেল ফ্লায়ার (গ্রীষ্মকালীন) <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960285/img/graphics-design/flyer/thumbnail/flyer-07.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960276/img/graphics-design/flyer/flyer-07.webp" class="btn btn-primary" download="LCA-flyer-07">ডাউনলোড করুন</a>'],
        ['৮. ট্রাভেল ফ্লায়ার <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960286/img/graphics-design/flyer/thumbnail/flyer-08.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960276/img/graphics-design/flyer/flyer-08.webp" class="btn btn-primary" download="LCA-flyer-08">ডাউনলোড করুন</a>'],
        ['৯. বিউটি স্পা ফ্লায়ার <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960287/img/graphics-design/flyer/thumbnail/flyer-09.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960277/img/graphics-design/flyer/flyer-09.webp" class="btn btn-primary" download="LCA-flyer-09">ডাউনলোড করুন</a>'],
        ['১০. বিউটি সেলুন ফ্লায়ার <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960290/img/graphics-design/flyer/thumbnail/flyer-10.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960278/img/graphics-design/flyer/flyer-10.webp" class="btn btn-primary" download="LCA-flyer-10">ডাউনলোড করুন</a>'],
      ] },
    ],
    toc: [{ id: 'flyer-design', text: 'ফ্লায়ার ডিজাইন', level: 2 }],
  },
  {
    id: '852924fd-01f0-4863-b525-f3f518ccb0a8', // design/image-basics
    title: 'ইমেজ',
    meta_description: 'ইমেজ কী এবং JPEG, GIF, PNG, SVG, TIFF-এর মতো সাধারণ ইমেজ ফাইল ফরম্যাট ও বিটম্যাপ সম্পর্কে জানুন।',
    blocks: [
      { id: 'VTeguyJm1Hzb', type: 'richtext', html: `<hr>
<p>একটি ইমেজ হলো কোনো কিছুর একটি ভিজ্যুয়াল প্রতিনিধিত্ব। তথ্যপ্রযুক্তিতে, এই শব্দটির একাধিক ব্যবহার আছে:</p>
<p>1) একটি ইমেজ হলো এমন একটি ছবি, যা তৈরি বা কপি করে ইলেকট্রনিক ফরম্যাটে সংরক্ষণ করা হয়েছে। একটি ইমেজকে ভেক্টর গ্রাফিক্স বা রাস্টার গ্রাফিক্স হিসেবে বর্ণনা করা যায়। রাস্টার আকারে সংরক্ষিত একটি ইমেজকে কখনো কখনো বিটম্যাপ বলা হয়। একটি ইমেজ ম্যাপ হলো এমন একটি ফাইল, যাতে একটি নির্দিষ্ট ইমেজের বিভিন্ন অবস্থানকে হাইপারটেক্সট লিংকের সাথে সংযুক্ত করার তথ্য থাকে।</p>
<p>সাধারণ অনলাইন ইমেজ ফাইল ফরম্যাটের মধ্যে আছে:</p>
<ul>
       <li>
        <p>
         <b>JPEG : Joint Photographic Experts Group</b> (উচ্চারণ 'জে-পেগ') হলো একটি গ্রাফিক ইমেজ ফাইল, যা Joint Photographic Experts Group-এর একটি স্ট্যান্ডার্ড অনুযায়ী তৈরি করা হয় — এটি একটি ISO/IEC বিশেষজ্ঞ দল, যারা কম্পিউটার ইমেজ ফাইলের জন্য কম্প্রেশন অ্যালগরিদমের একটি সেটের স্ট্যান্ডার্ড তৈরি ও রক্ষণাবেক্ষণ করে। JPEG ফাইলের সাধারণত .jpg এক্সটেনশন থাকে।
        </p>
       </li>
       <li>
        <p>
         <b>GIF : Graphics Interchange Format</b> (অনেকে এটি 'জিফ' উচ্চারণ করেন, এর ডিজাইনার নিজেও; আবার অনেকে হার্ড G দিয়ে 'গিফ' উচ্চারণ করেন)-এর সংক্ষিপ্ত রূপ। GIF 2D রাস্টার ডেটা টাইপ ব্যবহার করে এবং বাইনারিতে এনকোড করা থাকে। GIF ফাইলের সাধারণত .gif এক্সটেনশন থাকে।
        </p>
       </li>
       <li>
        <p>
         <b>GIF89a</b> হলো একটি অ্যানিমেটেড GIF ইমেজ, যা GIF ভার্সন 89a অনুযায়ী ফরম্যাট করা। এই ফরম্যাটের একটি প্রধান সুবিধা হলো এমন একটি অ্যানিমেটেড ইমেজ তৈরি করার সক্ষমতা, যা একটি ভিউয়ার পেজে পাঠানোর পর নড়াচড়া করে চলতে পারে — যেমন, একটি ঘূর্ণায়মান আইকন, বা হাত নাড়ছে এমন একটি ব্যানার, বা অক্ষর যা জাদুর মতো বড় হয়ে যায়। ইন্টারলেসড GIF উপস্থাপনার জন্যও একটি GIF89a নির্দিষ্ট করা যায়।
        </p>
       </li>
       <li>
        <p>
         <b>PNG : Portable Network Graphics</b> (উচ্চারণ 'পিং') হলো একটি ইমেজ কম্প্রেশন ফাইল ফরম্যাট, যা GIF ফরম্যাটের তুলনায় বেশ কিছু উন্নতি প্রদানের জন্য ডিজাইন করা হয়েছে। GIF-এর মতো, একটি PNG ফাইলও লসলেস পদ্ধতিতে কম্প্রেস করা হয় (অর্থাৎ, ফাইলটি ভিউ করার সময় ডিকম্প্রেস করা হলে সব ইমেজ তথ্য পুনরুদ্ধার করা হয়)। ফাইলের সাধারণত .png এক্সটেনশন থাকে।
        </p>
        <p>PNG ব্যবহার করা যায়:</p>
        <ul>
         <li>লাইন আর্টসহ ছবি, যেমন অঙ্কন, ইলাস্ট্রেশন এবং কমিকস।</li>
         <li>টেক্সটের ছবি বা স্ক্যান, যেমন হাতে লেখা চিঠি বা সংবাদপত্রের নিবন্ধ।</li>
         <li>চার্ট, লোগো, গ্রাফ, স্থাপত্য পরিকল্পনা ও ব্লুপ্রিন্ট।</li>
         <li>টেক্সটসহ যেকোনো কিছু, যেমন Photoshop বা InDesign-এ তৈরি করা পেজ লেআউট যা পরে ইমেজ হিসেবে সংরক্ষণ করা হয়েছে।</li>
        </ul>
        <p></p>
       </li>
       <li>
        <p>
         <b>SVG : Scalable Vector Graphics</b>-এর সংক্ষিপ্ত রূপ, যা XML-এর একটি অ্যাপ্লিকেশন হিসেবে একটি ইমেজের বর্ণনা। ব্রাউজারের মতো যেকোনো প্রোগ্রাম যা XML চিনতে পারে, সেটি SVG ফরম্যাটে দেওয়া তথ্য ব্যবহার করে ইমেজটি প্রদর্শন করতে পারে। স্কেলেবিলিটি মানে হলো, ফাইলটি যেকোনো আকার ও রেজোলিউশনের কম্পিউটার ডিসপ্লেতে দেখা যায় — একটি স্মার্টফোনের ছোট স্ক্রিন হোক বা একটি পিসির বড় ওয়াইডস্ক্রিন ডিসপ্লে। ফাইলের সাধারণত .svg এক্সটেনশন থাকে।
        </p>
       </li>
       <li>
        <p>
         <b>TIFF : Tag Image File Format</b> হলো অ্যাপ্লিকেশন প্রোগ্রামের মধ্যে রাস্টার গ্রাফিক্স (বিটম্যাপ) ইমেজ আদান-প্রদানের একটি সাধারণ ফরম্যাট, যার মধ্যে স্ক্যানার ইমেজের জন্য ব্যবহৃত ফরম্যাটও রয়েছে। একটি TIFF ফাইল .tiff বা ".tif" ফাইলনেম প্রত্যয়যুক্ত ফাইল হিসেবে চেনা যায়।
        </p>
       </li>
      </ul>
<p>2) একটি ডিস্ক ইমেজ হলো একটি স্টোরেজ ডিভাইসের (যেমন হার্ড ড্রাইভ বা DVD) সম্পূর্ণ কনটেন্টের একটি কপি। ডিস্ক ইমেজ কনটেন্টকে ঠিক যেভাবে এটি মূল স্টোরেজ ডিভাইসে আছে, সেভাবেই উপস্থাপন করে, ডেটা ও স্ট্রাকচার তথ্য উভয়সহ।</p>
<p>3) 'ইমেজ' শব্দটির আরেকটি ব্যবহার হলো র‍্যান্ডম অ্যাক্সেস মেমরির (RAM) এমন একটি অংশের জন্য, যা অন্য একটি মেমরি বা স্টোরেজ লোকেশনে কপি করা হয়েছে।</p>
<hr>` },
      { id: 'CA0jt4cUoeTq', text: 'বিটম্যাপ', type: 'heading', level: 2, anchor: 'bitmap' },
      { id: 'xs5WmOo9wdmn', type: 'richtext', html: `<p>একটি বিট ম্যাপ (প্রায়ই "বিটম্যাপ" বানানে লেখা হয়) একটি ডিসপ্লে স্পেস এবং সেই ডিসপ্লে স্পেসের প্রতিটি পিক্সেল বা "বিট"-এর রঙ নির্ধারণ করে। একটি Graphics Interchange Format এবং একটি JPEG হলো এমন গ্রাফিক ইমেজ ফাইল টাইপের উদাহরণ, যাতে বিট ম্যাপ থাকে।</p>
<p>একটি বিট ম্যাপে প্রতিটি সারির প্রতিটি পিক্সেলের জন্য রঙ-কোডেড তথ্যের একটি বিট থাকার দরকার নেই। ডিসপ্লে যখন একটি সারি ধরে স্ক্যান করে, তখন শুধু একটি নতুন রঙ নির্দেশ করার তথ্য থাকলেই চলে। তাই, অনেক সলিড রঙসহ একটি ইমেজের জন্য সাধারণত একটি ছোট বিট ম্যাপ প্রয়োজন হয়।</p>
<p>একটি বিট ম্যাপ একটি ইমেজ নির্দিষ্ট করার জন্য একটি নির্দিষ্ট বা রাস্টার গ্রাফিক্স পদ্ধতি ব্যবহার করে বলে, একজন ব্যবহারকারী স্পষ্টতা না হারিয়ে সাথে সাথে ইমেজটি রিস্কেল করতে পারেন না। তবে, একটি ভেক্টর গ্রাফিক্স ইমেজ দ্রুত রিস্কেল করার জন্য ডিজাইন করা। সাধারণত, একটি ইমেজ ভেক্টর গ্রাফিক্স ব্যবহার করে তৈরি করা হয় এবং শিল্পী ইমেজটিতে সন্তুষ্ট হওয়ার পর, এটি একটি রাস্টার গ্রাফিক ফাইল বা বিট ম্যাপে রূপান্তরিত (বা সংরক্ষণ) করা হয়।</p>` },
    ],
    toc: [{ id: 'bitmap', text: 'বিটম্যাপ', level: 2 }],
  },
  {
    id: '2c360656-2c8d-4d57-84ab-ad4e4b4482bc', // design/intro
    title: 'গ্রাফিক্স ডিজাইন পরিচিতি',
    meta_description: 'গ্রাফিক ডিজাইন শেখার জন্য ফ্রি বই ও গাইড ডাউনলোড করুন — শিক্ষানবিশদের গাইড, লোগো ডিজাইন এবং আরও অনেক কিছু।',
    blocks: [
      { id: '4GQ00ShtPADx', text: 'ডিজাইনারের গাইড', type: 'heading', level: 2, anchor: 'designers-guide' },
      { id: '4LkOYCfyo4hu', type: 'richtext', html: '<hr>' },
      { id: 'FsrqMLr4SYat', type: 'table', header: ['বই ও গাইড', 'PDF ডাউনলোড করুন'], rows: [
        ['গ্রাফিক ডিজাইনের জন্য শিক্ষানবিশদের গাইড <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960327/img/graphics-design/poster/thumbnail/book-1.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/raw/upload/v1784959177/pdfs/designer-guide-1" class="btn btn-primary" download="LCA-Guide-01">ডাউনলোড করুন</a>'],
        ['আরও প্রভাবশালী ল্যান্ডিং পেজ ডিজাইনের জন্য 23টি ভিজ্যুয়াল নীতি <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960328/img/graphics-design/poster/thumbnail/book-2.webp" alt="">', '<a href="https://pub-ae7f8faef01f4179b3ee65008d9277eb.r2.dev/pdfs/designer-guide-2.pdf" class="btn btn-primary" download="LCA-Guide-02">ডাউনলোড করুন</a>'],
        ['এলিগ্যান্ট ওয়েব UI ডিজাইন টেকনিক: ফ্ল্যাট ডিজাইন ও রঙ <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960329/img/graphics-design/poster/thumbnail/book-3.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/raw/upload/v1784959193/pdfs/designer-guide-3" class="btn btn-primary" download="LCA-Guide-03">ডাউনলোড করুন</a>'],
        ['লোগো ডিজাইন ওয়ার্কবুক <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960330/img/graphics-design/poster/thumbnail/book-4.webp" alt="">', '<a href="https://pub-ae7f8faef01f4179b3ee65008d9277eb.r2.dev/pdfs/designer-guide-4.pdf" class="btn btn-primary" download="LCA-Guide-04">ডাউনলোড করুন</a>'],
        ['লোগো ডিজাইন গাইড <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960331/img/graphics-design/poster/thumbnail/book-5.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/raw/upload/v1784959210/pdfs/logo-design-1" class="btn btn-primary" download="LCA-Guide-05">ডাউনলোড করুন</a>'],
        ['ভারতীয় রুপি সিম্বল ডিজাইন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960332/img/graphics-design/poster/thumbnail/book-6.webp" alt="">', '<a href="https://res.cloudinary.com/docslca/raw/upload/v1784959208/pdfs/Indian_Rupee_Symbol" class="btn btn-primary" download="LCA-Guide-06">ডাউনলোড করুন</a>'],
      ] },
    ],
    toc: [{ id: 'designers-guide', text: 'ডিজাইনারের গাইড', level: 2 }],
  },
  {
    id: '6f4daab6-110f-47b8-9c8e-50a5e63ba83d', // design/raster-graphics
    title: 'রাস্টার গ্রাফিক্স',
    meta_description: 'রাস্টার গ্রাফিক্স কী, এটি কীভাবে কাজ করে, এবং BMP, TIFF, GIF, JPEG-এর মতো সাধারণ ফরম্যাট সম্পর্কে জানুন।',
    blocks: [
      { id: 'wGXG9Vvnumn3', type: 'richtext', html: `<hr>
<p>রাস্টার গ্রাফিক্স হলো ডিজিটাল ইমেজ, যা একটি নির্দিষ্ট স্পেসের একগুচ্ছ স্যাম্পল হিসেবে তৈরি বা ক্যাপচার (যেমন, একটি ছবি স্ক্যান করে) করা হয়। একটি রাস্টার হলো একটি ডিসপ্লে স্পেসে x ও y কোঅর্ডিনেটের একটি গ্রিড। (এবং থ্রি-ডাইমেনশনাল ইমেজের ক্ষেত্রে, একটি z কোঅর্ডিনেট।) একটি রাস্টার ইমেজ ফাইল নির্দিষ্ট করে দেয় এই কোঅর্ডিনেটগুলোর মধ্যে কোনগুলো মনোক্রোম বা রঙের মান দিয়ে আলোকিত করতে হবে। রাস্টার ফাইলকে কখনো কখনো বিটম্যাপ বলা হয়, কারণ এতে এমন তথ্য থাকে যা সরাসরি ডিসপ্লে গ্রিডে ম্যাপ করা।</p>
<p>একটি রাস্টার ফাইল সাধারণত একটি ভেক্টর গ্রাফিক্স ইমেজ ফাইলের চেয়ে বড় হয়। তথ্য না হারিয়ে একটি রাস্টার ফাইল পরিবর্তন করা সাধারণত কঠিন, যদিও কিছু সফটওয়্যার টুল আছে যা পরিমার্জন ও পরিবর্তনের জন্য একটি রাস্টার ফাইলকে ভেক্টর ফাইলে রূপান্তর করতে পারে। রাস্টার ইমেজ ফাইল টাইপের উদাহরণ হলো: BMP, TIFF, GIF, এবং JPEG ফাইল।</p>` },
    ],
    toc: [],
  },
  {
    id: '4a1b2e0d-f171-450f-8c44-64575c9caff7', // design/vector-graphics
    title: 'ভেক্টর গ্রাফিক্স',
    meta_description: 'ভেক্টর গ্রাফিক্স কী, রাস্টার গ্রাফিক্সের সাথে এর পার্থক্য, এবং এটি অ্যানিমেশন ও লোগোতে কীভাবে ব্যবহৃত হয় তা জানুন।',
    blocks: [
      { id: 'Ao5g1dzDRHCB', type: 'richtext', html: `<p>ভেক্টর গ্রাফিক্স হলো এমন কমান্ড বা গাণিতিক স্টেটমেন্টের একটি ধারাবাহিকতার মাধ্যমে ডিজিটাল ইমেজ তৈরি করা, যা একটি নির্দিষ্ট দ্বি-মাত্রিক বা ত্রি-মাত্রিক স্পেসে রেখা ও আকার স্থাপন করে। পদার্থবিজ্ঞানে, একটি ভেক্টর একই সাথে একটি পরিমাণ এবং একটি দিকনির্দেশনার প্রতিনিধিত্ব করে। ভেক্টর গ্রাফিক্সে, একজন গ্রাফিক শিল্পীর কাজের ফলে তৈরি ফাইলটি ভেক্টর স্টেটমেন্টের একটি ধারাবাহিকতা হিসেবে তৈরি ও সংরক্ষণ করা হয়। উদাহরণস্বরূপ, একটি লাইন ড্রয়িংয়ের প্রতিটি বিটের জন্য ফাইলে একটি বিট রাখার বদলে, একটি ভেক্টর গ্রাফিক ফাইল সংযুক্ত করার জন্য একগুচ্ছ পয়েন্ট বর্ণনা করে। এর ফলাফল হলো অনেক ছোট একটি ফাইল।</p>
<p>কোনো এক পর্যায়ে, একটি ভেক্টর ইমেজ একটি রাস্টার গ্রাফিক্স ইমেজে রূপান্তরিত হয়, যা সরাসরি একটি ডিসপ্লে স্পেসে বিট ম্যাপ করে (এবং একে কখনো কখনো বিটম্যাপ বলা হয়)। প্রদর্শনের আগে ভেক্টর ইমেজটিকে একটি রাস্টার ইমেজ ফাইলে রূপান্তর করা যায়, যাতে এটি সিস্টেমের মধ্যে পোর্ট করা যায়।</p>
<p>একটি ভেক্টর ফাইলকে কখনো কখনো জ্যামিতিক ফাইল বলা হয়। Adobe Illustrator এবং CorelDraw-এর মতো টুল দিয়ে তৈরি বেশিরভাগ ইমেজ ভেক্টর ইমেজ ফাইলের আকারে থাকে। ভেক্টর ইমেজ ফাইল রাস্টার ইমেজ ফাইলের চেয়ে পরিবর্তন করা সহজ (যদিও, কখনো কখনো আরও পরিমার্জনের জন্য এগুলোকে আবার ভেক্টর ফাইলে রূপান্তর করা যায়)।</p>
<p>অ্যানিমেশন ইমেজও সাধারণত ভেক্টর ফাইল হিসেবে তৈরি করা হয়। উদাহরণস্বরূপ, Shockwave-এর Flash প্রোডাক্ট আপনাকে 2D ও 3D অ্যানিমেশন তৈরি করতে দেয়, যা একজন রিকোয়েস্টরের কাছে একটি ভেক্টর ফাইল হিসেবে পাঠানো হয় এবং পৌঁছানোর সাথে সাথে "অন দ্য ফ্লাই" রাস্টারাইজড হয়ে যায়।</p>` },
    ],
    toc: [],
  },
]

for (const doc of docs) {
  const meta_title = `${doc.title} | Learn Computer Academy`
  const { error } = await supabase.from('doc_translations').upsert(
    { doc_id: doc.id, locale: 'bn', title: doc.title, meta_title, meta_description: doc.meta_description, blocks: doc.blocks, toc: doc.toc },
    { onConflict: 'doc_id,locale' }
  )
  if (error) { console.error(doc.id, error); process.exit(1) }
  console.log('written:', doc.id)
}
console.log('design batch1: 5/5 written')
