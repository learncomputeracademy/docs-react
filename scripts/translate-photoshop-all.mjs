import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const psIntroParagraph = `<p>Photoshop হলো Adobe-এর ফটো এডিটিং, ইমেজ তৈরি এবং গ্রাফিক ডিজাইন সফটওয়্যার।</p>
<p>এই সফটওয়্যারটি রাস্টার (পিক্সেল-ভিত্তিক) ইমেজ এবং ভেক্টর গ্রাফিক্স উভয়ের জন্যই অনেক ইমেজ এডিটিং ফিচার দেয়। এটি একটি লেয়ার-ভিত্তিক এডিটিং সিস্টেম ব্যবহার করে, যা ট্রান্সপারেন্সি সমর্থনকারী একাধিক ওভারলে দিয়ে ইমেজ তৈরি ও পরিবর্তন করতে দেয়। লেয়ার মাস্ক বা ফিল্টার হিসেবেও কাজ করতে পারে, যা নিচের রঙ পরিবর্তন করে। লেয়ারে শ্যাডো ও অন্যান্য ইফেক্ট যোগ করা যায়। Photoshop-এর অ্যাকশনে পুনরাবৃত্তিমূলক কাজের প্রয়োজনীয়তা কমাতে অটোমেশন ফিচার আছে। Photoshop CC (Creative Cloud) নামে পরিচিত একটি অপশন ব্যবহারকারীদের যেকোনো কম্পিউটার থেকে কনটেন্ট নিয়ে কাজ করতে দেয়। </p>`

const docs = [
  {
    id: '87569e95-e9fe-4b56-99a5-c990acb05248', // photoshop/additional-tools
    title: 'অতিরিক্ত টুল',
    meta_description: 'Photoshop-এর হ্যান্ড টুল এবং ম্যাগনিফাই টুল কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'z50k91B0SLYe', text: 'অতিরিক্ত টুল', type: 'heading', level: 2, anchor: 'additional-tools' },
      { id: 'eU5wQVdG_hB6', type: 'richtext', html: `<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960387/img/hand-tool.webp" alt="Hand Tool" class="img-fluid">
         <span style="display: block;">
          <i>হ্যান্ড টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>ইমেজের মধ্যে ঘোরাঘুরি করতে দেয়।</p>
         <p>টুলটি সিলেক্ট করুন, পেজের একটি জায়গায় ক্লিক করুন, মাউস বাটন চেপে ধরুন, এলাকার মধ্যে সরাতে ড্র্যাগ করুন।</p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960400/img/magnify-tool.webp" alt="Magnify Tool" class="img-fluid">
         <span style="display: block;">
          <i>ম্যাগনিফাই টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>আপনার ইমেজ উইন্ডোর যেকোনো এলাকার প্রদর্শন বড় বা ছোট করে।</p>
         <p>টুলটি সিলেক্ট করুন, Options বারে <b>Zoom In</b> বা <b>Zoom Out</b> বেছে নিন, ইমেজের যে এলাকা বড় বা ছোট করতে চান সেখানে ক্লিক করুন। </p>
        </div>` },
    ],
    toc: [{ id: 'additional-tools', text: 'অতিরিক্ত টুল', level: 2 }],
  },
  {
    id: '1730e703-0424-4fa8-a7ac-ce123f9738bd', // photoshop/alteration-tools
    title: 'পরিবর্তন টুল',
    meta_description: 'Photoshop-এর হিলিং ব্রাশ, ব্রাশ, ক্লোন স্ট্যাম্প, ইরেজার, গ্র্যাডিয়েন্ট, ব্লার এবং ডজ টুল সম্পর্কে জানুন।',
    blocks: [
      { id: 'aLL0Tm55Qy1q', text: 'পরিবর্তন টুল', type: 'heading', level: 2, anchor: 'alteration-tools' },
      { id: 'zl25M5kZ1kAU', type: 'richtext', html: `<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960388/img/healing-brush-tool.webp" alt="Healing Brush Tool" class="img-fluid">
         <span style="display: block;">
          <i>হিলিং ব্রাশ টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>স্ক্যান করা ছবিতে ছোট দাগ ঠিক করে।</p>
         <p>টুলটি সিলেক্ট করুন, <b>ALT কী</b> চেপে ধরে এবং যে বেস রঙ ঠিক করতে চান তাতে <b>left-click</b> করুন। তারপর দাগের উপর <b>left-click</b> করুন। </p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960209/img/brush-tool.webp" alt="Brush Tool" class="img-fluid">
         <span style="display: block;">
          <i>ব্রাশ টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>বিভিন্ন পুরুত্ব ও রঙের ব্রাশ স্ট্রোক আঁকে।</p>
         <p>টুলটি সিলেক্ট করুন। তারপর নির্বাচিত এলাকায় ক্লিক করুন, লাইন আঁকতে ড্র্যাগ করুন। <b>Brush</b>, <b>Mode</b>, <b>Opacity</b> এবং <b>Flow</b> পরিবর্তন করতে Options বার ব্যবহার করুন। </p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960217/img/clone-stamp-tool.webp" alt="Clone Stamp Tool" class="img-fluid">
         <span style="display: block;">
          <i>ক্লোন স্ট্যাম্প টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>একটি ইমেজের নমুনা নিয়ে অন্য একটি ইমেজে, বা একই ইমেজের একটি অংশে প্রয়োগ করে।</p>
         <p>টুলটি সিলেক্ট করুন। <b>ALT কী</b> চেপে ধরে ডকুমেন্টের যে নির্দিষ্ট পয়েন্ট থেকে কপি পয়েন্ট শুরু করতে চান সেখানে <b>left-click</b> করুন। তারপর, নতুন ডকুমেন্টের যে অংশে ছবিটি নিয়ে যেতে চান, সেখানে মাউস রাখুন। বাম মাউস বাটন চেপে ধরে ছবিটি কপি করতে পেজ জুড়ে মাউস ড্র্যাগ করুন। </p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960204/img/art-history-brush.webp" alt="Art History Brush Tool" class="img-fluid">
         <span style="display: block;">
          <i>আর্ট হিস্ট্রি ব্রাশ টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>একটি নির্দিষ্ট history state বা স্ন্যাপশট থেকে সোর্স ডেটা ব্যবহার করে একটি ইমেজের উপর পেইন্ট করে।</p>
         <p>টুলটি সিলেক্ট করুন, <b>Brush</b>, <b>Blending Mode</b>, <b>Opacity</b>, <b>Style</b>, <b>Area</b> এবং <b>Tolerance</b> নির্দিষ্ট করুন। </p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960222/img/eraser-tool.webp" alt="Eraser Tool" class="img-fluid">
         <span style="display: block;">
          <i>ইরেজার টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>একটি বিদ্যমান পাথ বা স্ট্রোকের অংশ সরিয়ে দেয়। আপনি পাথের উপর <b>Erase</b> টুল ব্যবহার করতে পারেন। টেক্সট শুধু রাস্টারাইজড হলেই মোছা যায়। </p>
         <p>টুলটি সিলেক্ট করুন, ইমেজের যে অংশ মুছতে চান সেখানে ক্লিক করুন। পিক্সেল মুছতে ড্র্যাগ করুন।</p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960225/img/gradient-tool.webp" alt="Gradient Tool" class="img-fluid">
         <span style="display: block;">
          <i>গ্র্যাডিয়েন্ট টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>Gradient টুল একাধিক রঙের মধ্যে একটি ধীর মিশ্রণ তৈরি করে। আপনি প্রিসেট গ্র্যাডিয়েন্ট ফিল থেকে বেছে নিতে পারেন বা নিজের তৈরি করতে পারেন।</p>
         <ol>
          <li>
           <p>ইমেজের একটি অংশ ফিল করতে, কাঙ্ক্ষিত এলাকা সিলেক্ট করুন। নাহলে, গ্র্যাডিয়েন্ট ফিল পুরো সক্রিয় লেয়ারে প্রয়োগ হবে।</p>
          </li>
          <li>
           <p>Gradient টুল সিলেক্ট করুন <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960226/img/gradient_Lg_N.webp" alt="">। (টুলটি দেখা না গেলে, Paint Bucket টুল চেপে ধরুন।) </p>
          </li>
          <li>
           <p>options বারে, বিস্তৃত গ্র্যাডিয়েন্ট নমুনা থেকে একটি ফিল বেছে নিন:</p>
           <ul>
            <li>একটি প্রিসেট গ্র্যাডিয়েন্ট ফিল বেছে নিতে নমুনার পাশের ত্রিভুজে ক্লিক করুন।</li>
            <li>Gradient Editor দেখতে নমুনার ভেতরে ক্লিক করুন। একটি প্রিসেট গ্র্যাডিয়েন্ট ফিল সিলেক্ট করুন, বা একটি নতুন গ্র্যাডিয়েন্ট ফিল তৈরি করুন।</li>
           </ul>
          </li>
          <li>
           <p>শুরুর পয়েন্ট (যেখানে মাউস চাপা হয়) এবং শেষ পয়েন্ট (যেখানে মাউস ছাড়া হয়) কীভাবে গ্র্যাডিয়েন্টের চেহারাকে প্রভাবিত করে তা নির্ধারণ করতে একটি অপশন বেছে নিন।</p>
          </li>
         </ol>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960206/img/blur-tool.webp" alt="Blur Tool" class="img-fluid">
         <span style="display: block;">
          <i>ব্লার টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>একটি ইমেজের তীক্ষ্ণ প্রান্ত ঝাপসা করে।</p>
         <p>টুলটি প্রয়োগ করতে চান এমন একটি এলাকা সিলেক্ট করুন। টুল বাটনে ক্লিক করুন এবং <b>Brush</b>, <b>Mode</b>, এবং <b>Strength</b> বেছে নিন। প্রান্ত বরাবর ব্রাশ ড্র্যাগ করুন। </p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960221/img/dodge-tool.webp" alt="Dodge Tool" class="img-fluid">
         <span style="display: block;">
          <i>ডজ টুল</i>
         </span>
        </div>
<div class="text-block">
         <p><b>Dodge টুল এবং Burn টুল ইমেজের এলাকাগুলো হালকা বা গাঢ় করে</b>। এই টুলগুলো একটি প্রিন্টের নির্দিষ্ট এলাকায় এক্সপোজার নিয়ন্ত্রণের একটি প্রথাগত ডার্করুম কৌশলের উপর ভিত্তি করে তৈরি। ফটোগ্রাফাররা প্রিন্টের একটি এলাকা হালকা করতে আলো আটকে রাখেন (dodging) বা প্রিন্টের এলাকা গাঢ় করতে এক্সপোজার বাড়ান (burning)। আপনি Dodge বা Burn টুল দিয়ে একটি এলাকায় যত বেশি পেইন্ট করবেন, এটি তত বেশি হালকা বা গাঢ় হবে। </p>
        </div>` },
    ],
    toc: [{ id: 'alteration-tools', text: 'পরিবর্তন টুল', level: 2 }],
  },
  {
    id: '850d6b83-70de-49e8-bca9-b475a74b9584', // photoshop/color-boxes
    title: 'কালার বক্স ও মোড',
    meta_description: 'Photoshop-এ ফোরগ্রাউন্ড ও ব্যাকগ্রাউন্ড কালার বক্স কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'jgUqiMtIYRkE', text: 'কালার বক্স ও মোড', type: 'heading', level: 2, anchor: 'color-boxes-and-modes' },
      { id: 'MtDyrTrMPP2A', type: 'richtext', html: `<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960218/img/color-boxes-modes.webp" alt="Color Boxes and Modes" class="img-fluid">
         <span style="display: block;">
          <i>কালার বক্স</i>
         </span>
        </div>
<div class="text-block">
         <p>ফোরগ্রাউন্ড রঙ উপরের কালার সিলেকশন বক্সে দেখা যায় এবং বর্তমানে সক্রিয় একটি রঙ প্রতিনিধিত্ব করে। ব্যাকগ্রাউন্ড রঙ নিচের বক্সে দেখা যায় এবং একটি নিষ্ক্রিয় রঙ প্রতিনিধিত্ব করে।</p>
         <ul>
          <li>
           <p>ফোরগ্রাউন্ড রঙ পরিবর্তন করতে, <b>Toolbox</b>-এ উপরের কালার সিলেকশন বক্সে ক্লিক করুন। </p>
          </li>
          <li>
           <p>ব্যাকগ্রাউন্ড রঙ পরিবর্তন করতে, <b>Toolbox</b>-এ নিচের কালার সিলেকশন বক্সে ক্লিক করুন। </p>
          </li>
          <li>
           <p>ফোরগ্রাউন্ড ও ব্যাকগ্রাউন্ড রঙ উল্টাতে, বক্সগুলোর ডান কোণায় <b>Switch Colors</b> আইকনে (তীর চিহ্ন) ক্লিক করুন।. </p>
          </li>
          <li>
           <p>ডিফল্ট ফোরগ্রাউন্ড ও ব্যাকগ্রাউন্ড রঙ ফিরিয়ে আনতে, বক্সগুলোর বাম কোণায় <b>Default Colors</b> আইকনে (ছোট কালো ও সাদা বক্স) ক্লিক করুন। </p>
          </li>
         </ul>
         <p class="note">মনে রাখবেন: আপনি যদি <b>Gradient Tool</b> ব্যবহার করেন, তাহলে বর্তমানে নির্বাচিত ফোরগ্রাউন্ড ও ব্যাকগ্রাউন্ড রঙ গ্র্যাডিয়েন্টের ডিফল্ট রঙ হবে। </p>
        </div>` },
    ],
    toc: [{ id: 'color-boxes-and-modes', text: 'কালার বক্স ও মোড', level: 2 }],
  },
  {
    id: '61f79c83-ed60-4004-9dec-7e5d589c4da0', // photoshop/drawing-selection-tools
    title: 'অঙ্কন ও নির্বাচন টুল',
    meta_description: 'Photoshop-এর পেন টুল, টাইপ টুল, পাথ সিলেকশন টুল এবং লাইন শেপ সম্পর্কে জানুন।',
    blocks: [
      { id: 'wPZqTbCvkqQc', text: 'অঙ্কন ও নির্বাচন টুল', type: 'heading', level: 2, anchor: 'drawing-and-selection-tools' },
      { id: 'Q6qEnhBjpSs6', type: 'richtext', html: `<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960409/img/pen-tool.webp" alt="Pen Tool" class="img-fluid">
         <span style="display: block;">
          <i>পেন টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>মসৃণ প্রান্তের পাথ আঁকে।</p>
         <p>টুলটি সিলেক্ট করুন, পেজে ক্লিক করুন এবং একটি পাথ আঁকতে ড্র্যাগ করুন। পাথ পরিবর্তন করতে অ্যাঙ্কর পয়েন্টে ক্লিক করে ড্র্যাগ করুন।</p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960421/img/type-tool.webp" alt="Type Tool" class="img-fluid">
         <span style="display: block;">
          <i>পেন টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>একটি পেজে টেক্সট টাইপ করে। আপনি পেজের নতুন অংশে <b>Type Tool</b> ক্লিক করলেই একটি নতুন লেয়ার তৈরি হবে। </p>
         <p>type টুল সিলেক্ট করুন, পেজে ক্লিক করুন এবং টাইপ করা শুরু করুন। আপনি Options বারে ফন্ট ও সাইজ নির্দিষ্ট করতে পারেন। পাশ ও কোণার স্কোয়ারগুলো ড্র্যাগ করে টেক্সট বক্স রিসাইজ ও ট্রান্সফর্মও করতে পারেন। পেজে টেক্সট সরাতে <b>Move Tool</b> ব্যবহার করুন। </p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960408/img/path-selection-tool.webp" alt="Path Selection Tool" class="img-fluid">
         <span style="display: block;">
          <i>পাথ সিলেকশন টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>পাথ এবং পাথ সেগমেন্ট সিলেক্ট করে।</p>
         <p>টুলটি সিলেক্ট করুন, পাথের যেকোনো জায়গায় ক্লিক করুন।</p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960398/img/line-tool.webp" alt="Line Tool" class="img-fluid">
         <span style="display: block;">
          <i>লাইন শেপ</i>
         </span>
        </div>
<div class="text-block">
         <p>একটি সরলরেখা আঁকে। এই টুলে লুকানো অন্যান্য আকৃতিগুলো হলো: <b>Rounded Rectangle Tool, Ellipse Tool, Polygon Tool, Line Tool</b>, এবং <b>Custom Shape Tool.</b>
         </p>
         <p>টুলটি সিলেক্ট করুন, একটি লাইন আঁকতে পেজে ক্লিক করে ড্র্যাগ করুন।</p>
        </div>` },
    ],
    toc: [{ id: 'drawing-and-selection-tools', text: 'অঙ্কন ও নির্বাচন টুল', level: 2 }],
  },
  {
    id: 'df5ba19b-36f2-48c7-a908-3ff82fa787b3', // photoshop/intro
    title: 'Photoshop পরিচিতি',
    meta_description: 'Photoshop কী, কীভাবে শুরু করবেন, ডকুমেন্ট সেট আপ করা, এবং ইন্টারফেস লেআউট সম্পর্কে জানুন।',
    blocks: [
      { id: 'AOO-TBfiP8ci', type: 'richtext', html: `<hr>
${psIntroParagraph}
<p>Photoshop এত দীর্ঘ সময় ধরে ইন্ডাস্ট্রি স্ট্যান্ডার্ড ইমেজ ম্যানিপুলেশন প্রোগ্রাম হয়ে আছে যে এর নাম একটি ক্রিয়াপদে পরিণত হয়েছে: একটি ইমেজকে "photoshopped" বা এমনকি শুধু "shopped" বলা সাধারণ কথ্য ভাষায় পরিণত হয়েছে। এই প্রসঙ্গে "shopped" মানে হলো এডিট, ম্যানিপুলেট বা ফেক করা -- প্রায়ই আসলে কোন সফটওয়্যার ব্যবহার করা হয়েছে তা নির্বিশেষে।</p>` },
      { id: 'he6E_EEjY-_N', text: 'শুরু করা', type: 'heading', level: 2, anchor: 'getting-started' },
      { id: 'rIMGCdIYDbLK', type: 'richtext', html: `<hr>
<p>Adobe Photoshop CC 2015 খুলে শুরু করুন।</p>
<p class="steps">PC-তে, নিচের বাম কোণে Windows বাটনে <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960434/img/win-btn.webp" style="width: 30px; display: inline-block;"> বা <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960436/img/win10-btn.webp" style="width: 25px; display: inline-block;"> ক্লিক করুন &gt; <b>All Programs</b> &gt; <b>Adobe</b> &gt; <b>Photoshop CC 2015</b>, অথবা ডেস্কটপে শর্টকাটে ক্লিক করুন। </p>
<hr>` },
      { id: 'eeAS6B_UGWsd', text: 'ডকুমেন্ট সেট আপ করা', type: 'heading', level: 2, anchor: 'setting-up-the-document' },
      { id: '1js7eAAHQoBw', type: 'richtext', html: `<p>শুরু থেকেই আপনার ডকুমেন্ট সঠিকভাবে সেট আপ করা আপনার প্রজেক্টে কাজ করার সময় আপনার কাজ অনেক সহজ করে তুলবে। এর জন্য কিছু আগাম পরিকল্পনা প্রয়োজন। উদাহরণস্বরূপ, আপনার চূড়ান্ত আউটপুট যদি একটি ব্রোশিওর হয়, তাহলে আপনাকে আপনার ডকুমেন্টকে হরাইজন্টাল ও ডাবল-সাইডেড করে সেট আপ করতে হতে পারে।</p>
<p class="steps">একটি নতুন ডকুমেন্ট তৈরি করতে, <b>File</b> &gt; <b>New</b> ক্লিক করুন। এতে <b>Document Setup</b> ডায়ালগ বক্স খুলবে (চিত্র ২)। </p>` },
      { id: 'a_iPB0fs0syH', alt: 'Photoshop ইন্টারফেস', type: 'image', width: 1073, height: 645, publicId: 'img/ps-interface' },
      { id: '3RRbZaJJs03p', type: 'richtext', html: `<span style="display: block; text-align: center;">
       <i>চিত্র ১: Document Setup ডায়ালগ বক্স</i>
      </span>
<p>এখানে আপনি আপনার ফাইলের নাম দিতে পারবেন, আপনার ডকুমেন্টের সঠিক পেজ সাইজ ও ওরিয়েন্টেশন সেট করতে পারবেন। অপশনগুলোর মধ্যে আছে, তবে এতেই সীমাবদ্ধ নয়:</p>
<ul>
       <li>
        <h4>পেজ সাইজ ও ওরিয়েন্টেশন</h4>
        <p>প্রস্থ ও উচ্চতার নতুন মান টাইপ করে পেজ সাইজ পরিবর্তন করুন। পেজ সাইজ হলো ব্লিড বা পেজের বাইরের অন্যান্য চিহ্ন ছাঁটাইয়ের পর আপনি যে চূড়ান্ত সাইজ চান তা। <b>Preset ড্রপডাউন মেনুতে</b> আপনি <b>Photo</b>, <b>Web</b> ইত্যাদির মতো সাধারণ কম্প্যাটিবিলিটি খুঁজে পাবেন। <b>Height</b> এবং <b>Width</b>-এর সঠিক মান টাইপ করলে আপনার পেজের সাইজ ও ওরিয়েন্টেশনের উপর আরও নিয়ন্ত্রণ পাবেন। </p>
       </li>
       <li>
        <h4>রেজোলিউশন</h4>
        <p>রেজোলিউশন হলো একটি ইমেজের প্রিন্ট করা এলাকায় পিক্সেলের সংখ্যা। রেজোলিউশন যত বেশি, পেজে তত বেশি পিক্সেল থাকে, ইমেজের মান তত ভালো হয়। তবে, উচ্চ রেজোলিউশন ফাইলের সাইজ বাড়িয়ে দেয়। <b>প্রিন্ট করা ইমেজের</b> জন্য স্ট্যান্ডার্ড সুপারিশকৃত রেজোলিউশন হলো <b>150-300</b>, <b>ওয়েব ইমেজের</b> জন্য এটি <b>72</b>। </p>
       </li>
       <li>
        <h4>কালার মোড</h4>
        <p>আপনার প্রজেক্টের জন্য সবচেয়ে উপযুক্ত কালার মোড বেছে নিন। উদাহরণস্বরূপ, <b>একটি ওয়েবসাইটের জন্য গ্রাফিক তৈরি করার সময়, RGB বেছে নিন। প্রিন্টের জন্য একটি ইমেজ তৈরি করার সময় CMYK বেছে নিন</b>। </p>
       </li>
       <li>
        <h4>ব্যাকগ্রাউন্ড কনটেন্ট</h4>
        <p>ব্যাকগ্রাউন্ড বেছে নিন: <b>সাদা, রঙিন</b> বা <b>transparent</b>। আপনার সব ডকুমেন্ট সেটিং দেওয়া হয়ে গেলে, <b>Ok</b> ক্লিক করুন। </p>
       </li>
      </ul>
<hr>` },
      { id: '1fO9ssFaBdzB', text: 'ডিস্ক থেকে একটি ইমেজ খোলা', type: 'heading', level: 2, anchor: 'opening-an-image-from-a-disk' },
      { id: 'MM9-VQu5B3Z1', type: 'richtext', html: '<p>আপনার ইমেজ যদি একটি ডিস্কে বা কম্পিউটারে সংরক্ষিত থাকে, তাহলে <b>File</b> &gt; <b>Open</b> সিলেক্ট করুন, এবং তারপর আপনার ইমেজ যেখানে সংরক্ষিত আছে সেই ডিস্ক ড্রাইভ/ফাইলে নেভিগেট করুন। ইমেজ ফাইলটি বেছে নিন এবং <b>Open</b> ক্লিক করুন। এই পর্যায়ে, আপনি হয়তো আপনার ইমেজটি একটি ভিন্ন নামে সংরক্ষণ করতে চাইবেন, যাতে ভুল হলে আপনি সবসময় মূল ফাইলে ফিরে যেতে পারেন। আপনার ফাইল সংরক্ষণ করতে, <b>File</b> &gt; <b>Save As</b> সিলেক্ট করুন এবং ডায়ালগ বক্সে ফাইলের নতুন নাম টাইপ করুন। </p>\n<hr>' },
      { id: 'H8r3Wxw9A1T7', text: 'ইন্টারফেস লেআউট', type: 'heading', level: 2, anchor: 'interface-layout' },
      { id: 'WYLISffUFUvD', alt: 'Photoshop ইন্টারফেস', type: 'image', width: 1600, height: 900, publicId: 'img/ps-interface2' },
      { id: 'UxSfYGvn9E7_', type: 'richtext', html: `<span style="display: block; text-align: center;">
       <i>চিত্র ২: এটি Adobe Photoshop ইন্টারফেসের লেআউট।</i>
      </span>
<ul>
       <li>
        <h4>মেনু বার</h4>
        <p>স্ক্রিনের উপরের দিকে তাকালে আপনি Menu বার দেখতে পাবেন (চিত্র ৩), যাতে Photoshop-এর সব প্রধান ফাংশন আছে, যেমন <b>File, Edit, Image, Layer, Type, Select, Filter, 3D, View, Window,</b> এবং <b>Help.</b>
        </p>
       </li>
       <li>
        <h4>টুলবার</h4>
        <p>সহজে অ্যাক্সেসের জন্য বেশিরভাগ প্রধান টুল Toolbar-এ থাকে।</p>
       </li>
       <li>
        <h4>ইমেজ</h4>
        <p>আপনি একটি ফাইল খুললে ইমেজটি তার নিজস্ব উইন্ডোতে দেখা যাবে।</p>
       </li>
       <li>
        <h4>ইমেজের নাম</h4>
        <p>আপনি যে ইমেজ খুলবেন তার নাম উপরে দেখানো মতো ইমেজ উইন্ডোর উপরে থাকবে।</p>
       </li>
       <li>
        <h4>লেয়ার</h4>
        <p>Layer আপনাকে আপনার কাজকে আলাদা আলাদা লেভেলে সংগঠিত করতে দেয়, যেগুলো পৃথক ইউনিট হিসেবে এডিট ও দেখা যায়। প্রতিটি Photoshop CC 2015 ডকুমেন্টে অন্তত একটি লেয়ার থাকে। একাধিক লেয়ার তৈরি করলে আপনি সহজেই নিয়ন্ত্রণ করতে পারবেন কীভাবে আপনার আর্টওয়ার্ক প্রিন্ট, প্রদর্শন এবং এডিট হয়। একটি ডকুমেন্ট তৈরি করার সময় আপনি প্রায়ই Layers প্যালেট ব্যবহার করবেন, তাই এটি কী করে এবং কীভাবে ব্যবহার করতে হয় তা বোঝা গুরুত্বপূর্ণ।</p>
       </li>
      </ul>` },
    ],
    toc: [
      { id: 'getting-started', text: 'শুরু করা', level: 2 },
      { id: 'setting-up-the-document', text: 'ডকুমেন্ট সেট আপ করা', level: 2 },
      { id: 'opening-an-image-from-a-disk', text: 'ডিস্ক থেকে একটি ইমেজ খোলা', level: 2 },
      { id: 'interface-layout', text: 'ইন্টারফেস লেআউট', level: 2 },
    ],
  },
  {
    id: '6be61a65-a918-411d-aa22-84f5b4bda8e0', // photoshop/layers
    title: 'লেয়ার',
    meta_description: 'Photoshop-এ লেয়ার প্যালেটের ভিজিবিলিটি, লকিং, ব্লেন্ডিং মোড, ফিল, অপাসিটি এবং মাস্ক অপশন সম্পর্কে জানুন।',
    blocks: [
      { id: 'TTWTopxfOIr7', text: 'লেয়ার', type: 'heading', level: 2, anchor: 'layers' },
      { id: 'KCgxKFqFo0B7', type: 'richtext', html: `<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960397/img/layers-img.webp" alt="Color Boxes and Modes" class="img-fluid">
         <span style="display: block;">
          <i>চিত্র ৯: Layer প্যালেট</i>
         </span>
        </div>
        <div class="text-block">
         <p>
          <b>Layer</b> আপনাকে আপনার কাজকে আলাদা আলাদা লেভেলে সংগঠিত করতে দেয়, যেগুলো পৃথক ইউনিট হিসেবে এডিট ও দেখা যায়। প্রতিটি Photoshop CC 2015 ডকুমেন্টে অন্তত একটি লেয়ার থাকে। একাধিক লেয়ার তৈরি করলে আপনি সহজেই নিয়ন্ত্রণ করতে পারবেন কীভাবে আপনার আর্টওয়ার্ক প্রিন্ট, প্রদর্শন এবং এডিট হয়। একটি ডকুমেন্ট তৈরি করার সময় আপনি প্রায়ই Layers প্যালেট (চিত্র ৯) ব্যবহার করবেন, তাই এটি কী করে এবং কীভাবে ব্যবহার করতে হয় তা বোঝা গুরুত্বপূর্ণ।
         </p>
         <ul>
          <li>
           <b>A) লেয়ার ভিজিবিলিটি</b> - চোখ চিহ্নটি দেখায় যে নির্বাচিত লেয়ারটি দৃশ্যমান। একটি লেয়ার দেখতে বা লুকাতে অন বা অফ ক্লিক করুন।
          </li>
          <li>
           <b>B) লেয়ার লকিং অপশন</b> - Transparency লক করতে চেকার্ড স্কোয়ার আইকনে ক্লিক করুন, Image লক করতে ব্রাশ আইকনে ক্লিক করুন, Position লক করতে তীর আইকনে ক্লিক করুন, এবং সব অপশন লক করতে লক আইকনে ক্লিক করুন।
          </li>
          <li>
           <b>C) লেয়ার ব্লেন্ডিং মোড</b> - লেয়ারের পিক্সেল ইমেজের নিচের পিক্সেলের সাথে কীভাবে মিশবে তা নির্ধারণ করে। ড্রপ-ডাউন মেনু থেকে একটি নির্দিষ্ট ব্লেন্ডিং মোড বেছে নিয়ে আপনি বিভিন্ন স্পেশাল ইফেক্ট তৈরি করতে পারেন।
          </li>
          <li>
           <b>D) ফিল</b> - একটি মান টাইপ করে বা স্লাইডার ড্র্যাগ করে আপনি ট্রান্সপারেন্সি নির্দিষ্ট করতে পারেন।
          </li>
          <li>
           <b>E) অপাসিটি</b> - একটি মান টাইপ করে বা স্লাইডার ড্র্যাগ করে, আপনি পুরো লেয়ারের ট্রান্সপারেন্সি নির্দিষ্ট করতে পারেন।
          </li>
          <li>
           <b>F) লেয়ার লক</b> - লেয়ারটি লক থাকলে আইকনটি দেখা যায় এবং আনলক হলে অদৃশ্য হয়ে যায়। লেয়ারটি আনলক করতে আইকনে ডাবল-ক্লিক করুন।
          </li>
          <li>
           <b>G) লেয়ার অপশন মেনু</b> - নিম্নলিখিত অপশন দেখাতে কালো ত্রিভুজে ক্লিক করুন: New Layer, Duplicate Layer, Delete Layer, Layer Properties, ইত্যাদি। কিছু অপশন Layers প্যালেটের নিচে আইকন হিসেবে দেখানো হয়।
          </li>
          <li>
           <b>H) লিংক লেয়ার</b> – লেয়ারগুলো একসাথে লিংক করতে ব্যবহার করা যায়।
          </li>
          <li>
           <b>I) লেয়ার স্টাইল</b> - একটি লেয়ারে যদি একটি স্টাইল থাকে, তাহলে Layers প্যালেটের নিচে একটি "F" আইকন দেখা যায়। স্টাইল অপশন দেখতে ছোট কালো ত্রিভুজে ক্লিক করুন
          </li>
          <li>
           <b>J) লেয়ার মাস্ক</b> - লেয়ারের নির্দিষ্ট অংশ লুকাতে দেয়, যা পরে পেইন্ট-ব্রাশ এবং সাদা রঙ ব্যবহার করে লেয়ারের অংশ প্রকাশ করে দেখানো যায়।
          </li>
          <li>
           <b>K) লেয়ার সেট</b> - এই অপশনটি একাধিক লেয়ারসহ ইমেজ সংগঠিত করতে সাহায্য করে। একাধিক লেয়ারের জন্য একটি ফোল্ডার তৈরি করতে আইকনে ক্লিক করুন।
          </li>
          <li>
           <b>L) নতুন Fill বা Adjustment লেয়ার তৈরি করা</b> - ইমেজ লেয়ারের মতো একই অপাসিটি ও ব্লেন্ডিং মোড অপশন থাকে এবং ইমেজ লেয়ারের মতোই পুনর্বিন্যাস, মুছে ফেলা, লুকানো এবং ডুপ্লিকেট করা যায়। একটি নতুন fill বা adjustment লেয়ার তৈরি করতে আইকনে ক্লিক করুন এবং একটি অপশন বেছে নিন।
          </li>
          <li>
           <b>M) নতুন লেয়ার তৈরি করা</b> - একটি নতুন লেয়ার তৈরি করতে এই আইকনে ক্লিক করুন।
          </li>
          <li>
           <b>N) লেয়ার মুছে ফেলা</b> - একটি লেয়ার মুছতে, Layers প্যালেটে একটি লেয়ার সিলেক্ট করুন এবং সেটিকে Trash Can আইকনে ড্র্যাগ করুন, অথবা একটি লেয়ার সিলেক্ট করে আইকনে ক্লিক করুন।
          </li>
         </ul>
         <p>আপনি যদি Illustrator বা InDesign-এর মতো অন্যান্য Adobe প্রোডাক্ট ব্যবহার করে থাকেন, তাহলে Adobe Photoshop CC 2015-এর টুলবক্সের সাথে আপনার পরিচিত হওয়া উচিত, কারণ এটি এই অ্যাপ্লিকেশনগুলোর কিছু টুল শেয়ার করে। আপনি যদি Adobe প্রোডাক্টের নতুন ব্যবহারকারী হন, তাহলে মনে রাখবেন যে আপনার সব টুল ব্যবহার করার প্রয়োজন নাও হতে পারে। এই টিউটোরিয়ালে, শুধু বেসিক টুলগুলো নিয়ে গভীরভাবে আলোচনা করা হবে।</p>
         <p>টুলবারের কিছু টুলে অতিরিক্ত "লুকানো" টুল আছে। এই টুলগুলোর ডান কোণায় ছোট কালো ত্রিভুজ থাকে। "লুকানো" টুল দেখতে, কোণায় কালো ত্রিভুজ আছে এমন যেকোনো টুলে ক্লিক করে চেপে ধরুন।</p>
        </div>` },
    ],
    toc: [{ id: 'layers', text: 'লেয়ার', level: 2 }],
  },
  {
    id: '76a5a256-2899-41df-b4dc-8f3a0f60d074', // photoshop/resizing
    title: 'রিসাইজিং',
    meta_description: 'Photoshop-এ ছবি একটি নির্দিষ্ট সাইজে রিসাইজ করা, ডিজিটাল ফটো রিসাইজ করা, এবং মান না হারিয়ে ইমেজ বড় করা শিখুন।',
    blocks: [
      { id: 'G85B7UEeyGid', text: 'রিসাইজিং', type: 'heading', level: 2, anchor: 'resizing' },
      { id: 'm2Ilx_vdHIyy', type: 'richtext', html: `<hr>
<div class="text-block">
        <p>Photoshop-এ রিসাইজিং আপনাকে স্ট্যান্ডার্ড ফটো সাইজে আপনার ইমেজ প্রিন্ট করতে, ডিজিটাল ফটোর উচ্চমান রিসাইজ ও সংরক্ষণ করতে, এবং ছোট ইমেজকে পোস্টার সাইজে বড় করতে সাহায্য করে।</p>
        <h2>একটি নির্দিষ্ট সাইজে রিসাইজ করা</h2>
        <p>একটি প্রিসেট সাইজে আপনার ইমেজ রিসাইজ করতে, নিচের ধাপগুলো অনুসরণ করুন:</p>
        <ul>
         <li>1. মেইন মেনুতে, <b>File &gt; New</b>-এ যান। </li>
         <li>2. New ডায়ালগ বক্সে, <b>Document Type</b> ড্রপডাউন মেনুতে ক্লিক করুন। আপনি বেশ কিছু প্রিসেট সাইজ দেখতে পাবেন, যেমন Web, Photo, এবং U.S Paper। মনে রাখবেন যে <b>72 ppi</b> অনলাইন ইমেজের জন্য ভালো, কিন্তু প্রিন্ট করা ইমেজের জন্য <b>150-300 ppi</b> ভালো। (চিত্র ১০)। </li>
         <li>3. আপনার পছন্দমতো সাইজ বেছে নিন এবং OK ক্লিক করুন।</li>
        </ul>
        <div class="img-block" style="text-align: center;margin-bottom: 1rem;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960411/img/ps-interface.webp" alt="PS Interface" class="img-fluid">
         <span style="display: block;">
          <i>চিত্র ১০: New ডায়ালগ বক্সে প্রিসেট সাইজ</i>
         </span>
        </div>
        <p class="note">
         <b>মনে রাখবেন</b>: সব প্রিসেট সাইজ পোর্ট্রেট ওরিয়েন্টেশনে আছে। আপনি যদি ল্যান্ডস্কেপ ওরিয়েন্টেশনে একটি ইমেজ রিসাইজ করতে চান, তাহলে আপনাকে নিজের প্রিসেট তৈরি করতে হবে। নিজের সাইজ তৈরি করতে, নিচের কাজগুলো করুন:
        </p>
        <ul>
         <li>1. Width এবং Height-এর মান টাইপ করুন, উদাহরণস্বরূপ 2000 x 2000।</li>
         <li>2. আপনার কাঙ্ক্ষিত রেজোলিউশন টাইপ করুন (উচ্চমানের প্রিন্টের জন্য 300 ppi, এবং ওয়েব ইমেজের জন্য 72 ppi ভালো)।</li>
         <li>3. Save Preset বাটনে ক্লিক করুন।</li>
        </ul>
       </div>
<hr>` },
      { id: '476Jc6xL4V_S', text: 'ডিজিটাল ফটো রিসাইজ করা', type: 'heading', level: 2, anchor: 'resizing-digital-photos' },
      { id: '7MFq9lBGWH2n', type: 'richtext', html: `<p>ডিজিটাল ফটোতে সাধারণত বড় ডাইমেনশন থাকে কিন্তু কম রেজোলিউশন, 72 ppi, যা সাইজ কমানো বা বাড়ানো হলে তাদের মানকে প্রভাবিত করে। প্রিন্ট করলে, পরিবর্তিত সাইজের ফটোগুলো পিক্সেলেটেড দেখাবে। মান না হারিয়ে ডিজিটাল ফটো রিসাইজ করতে, এই ধাপগুলো অনুসরণ করুন:</p>
<div class="img-block" style="text-align: center;margin-bottom: 1rem;">
      <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960215/img/cat-resize.webp" alt="cat" class="img-fluid">
      <span style="display: block;">
       <i>চিত্র ১১: একটি ডিজিটাল ফটোর ডাইমেনশন</i>
      </span>
     </div>
<ul>
      <li>1. আপনি যে ডিজিটাল ফটো রিসাইজ করতে চান তা খুলুন।</li>
      <li>2. মেইন মেনুতে, <b>View &gt; Rulers</b>-এ যান। আপনি আপনার ফটোর ডাইমেনশন দেখতে পাবেন (চিত্র ১১)। </li>
      <li>3. মেইন মেনুতে, <b>Image &gt; Image Size</b>-এ যান। </li>
      <li>4. <b>Image Size</b> ডায়ালগ বক্সে, <b>Resample Image</b> বক্স আনচেক করুন (চিত্র ১২)। আপনার কাঙ্ক্ষিত রেজোলিউশন টাইপ করুন (150 থেকে 300 ppi-এর মধ্যে যেকোনো কিছু)। ফটোটি এখন 4 x 2.667 ইঞ্চি। </li>
     </ul>
<div class="img-block" style="text-align: center;margin-bottom: 1rem;">
      <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960213/img/cat-resize-dialog.webp" alt="cat" class="img-fluid">
      <span style="display: block;">
       <i>চিত্র ১২: রেজোলিউশন পরিবর্তন করা</i>
      </span>
     </div>
<hr>` },
      { id: 'e7zLerv5PJB0', text: 'বড় করা', type: 'heading', level: 2, anchor: 'enlarging' },
      { id: 'S-3Qk_94_cev', type: 'richtext', html: `<p>আপনি যদি আপনার ডিজিটাল ফটোকে একটি পোস্টার সাইজের ইমেজে রূপান্তর করতে চান, তাহলে আপনি এটি Image Size ডায়ালগ বক্সে করতে পারেন। তবে, শুধু ডাইমেনশন বাড়ালে ইমেজটি ঝাপসা ও পিক্সেলেটেড দেখাবে। মান না হারিয়ে ইমেজ বড় করতে, এই ধাপগুলো অনুসরণ করুন:</p>
<ul>
      <li>1. আপনি যে ডিজিটাল ইমেজ বড় করতে চান তা খুলুন।</li>
      <li>2. মেইন মেনুতে, <b>Image &gt; Image Size</b>-এ যান। </li>
      <li>3. Image Size ডায়ালগ বক্সে, নিশ্চিত করুন <b>Resample Image</b> বক্স চেক করা আছে এবং ড্রপডাউন বক্স থেকে <b>Bicubic Smoother</b> বেছে নিন (চিত্র ১৩)। </li>
      <li>4. <b>Width</b> এবং <b>Height</b>-এর পরিমাপ Percent-এ পরিবর্তন করুন। <b>110</b> টাইপ করুন। এটি ইমেজের সাইজ <b>10 শতাংশ</b> বাড়িয়ে দেবে (চিত্র ১৩)। </li>
      <li>5. আপনি সাইজে সন্তুষ্ট না হওয়া পর্যন্ত 10 শতাংশ করে বড় করতে থাকুন।</li>
     </ul>
<p class="note">
      <b>মনে রাখবেন</b>: Resampling বক্স আনচেক করা থাকলে, ড্রপডাউন মেনু অ্যাক্সেস করা যায় না। সবসময় নিশ্চিত করুন এটি চেক করা আছে।
     </p>
<div class="img-block" style="text-align: center;margin-bottom: 1rem;">
      <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960211/img/cat-enlarge.webp" alt="cat" class="img-fluid">
      <span style="display: block;">
       <i>চিত্র ১৩: সাইজ 10 শতাংশ বাড়ানো</i>
      </span>
     </div>` },
    ],
    toc: [
      { id: 'resizing', text: 'রিসাইজিং', level: 2 },
      { id: 'resizing-digital-photos', text: 'ডিজিটাল ফটো রিসাইজ করা', level: 2 },
      { id: 'enlarging', text: 'বড় করা', level: 2 },
    ],
  },
  {
    id: '78cc506f-14d3-42ad-ad2c-cea3d13683eb', // photoshop/saving
    title: 'সংরক্ষণ করা',
    meta_description: 'Photoshop-এ আপনার ডকুমেন্ট সংরক্ষণ করা এবং PSD বনাম JPEG ফরম্যাটের মধ্যে পার্থক্য জানুন।',
    blocks: [
      { id: 'AiL5zPq12jV8', text: 'সংরক্ষণ করা', type: 'heading', level: 2, anchor: 'saving' },
      { id: 'HJLZkZwLis4_', type: 'richtext', html: `<hr>
<div class="text-block">
         <p>প্রায়ই আপনার কাজ সংরক্ষণ করতে মনে রাখুন। ঘন ঘন সংরক্ষণ করলে আপনি যে কাজ করছেন তা হারানোর ঝুঁকি কমে। আপনার Photoshop ডকুমেন্ট সংরক্ষণ করতে, নিচের কাজগুলো করুন:</p>
         <ul>
          <li>1. <b>File &gt; Save As</b> ক্লিক করুন। </li>
          <li>2. ড্রপ ডাউন মেনু এবং নেভিগেশন উইন্ডো ব্যবহার করে আপনার ডকুমেন্ট যেখানে সংরক্ষণ করতে চান সেখানে যান।</li>
          <li>3. <b>Save As</b> টেক্সট ফিল্ডে আপনার ডকুমেন্টের নাম লিখুন। </li>
          <li>4. <b>Format</b> ড্রপ-ডাউন মেনু থেকে আপনার প্রজেক্ট সংরক্ষণের ফরম্যাট বেছে নিন। </li>
          <li>5. ডায়ালগ বক্সের নিচের ডান কোণায় Save বাটনে ক্লিক করুন।</li>
          <li>6. নিশ্চিত করুন যে আপনার ডকুমেন্ট আপনার উদ্দিষ্ট জায়গায় সংরক্ষিত হয়েছে।</li>
         </ul>
         <p class="note">
          <b>মনে রাখবেন</b>: আপনি যদি আপনার ফাইল PSD হিসেবে সংরক্ষণ করেন (ডিফল্ট Photoshop সংরক্ষণ ফরম্যাট), তাহলে আপনার লেয়ার সংরক্ষিত থাকবে, কিন্তু ফাইলের সাইজ বড় হবে। আপনি যদি আপনার ফাইল JPEG হিসেবে সংরক্ষণ করেন (একটি সাধারণ ইমেজ ফরম্যাট), তাহলে আপনার লেয়ার ফ্ল্যাট হয়ে একটি লেয়ারে পরিণত হবে, এবং ফাইলের সাইজ উল্লেখযোগ্যভাবে ছোট হবে।
         </p>
        </div>` },
    ],
    toc: [{ id: 'saving', text: 'সংরক্ষণ করা', level: 2 }],
  },
  {
    id: '0bede5aa-7371-4776-90a3-f9cc575ee127', // photoshop/selection-tools
    title: 'নির্বাচন টুল',
    meta_description: 'Photoshop-এর মুভ, মার্কি, লাসো, ম্যাজিক ওয়ান্ড, ক্রপ এবং আই ড্রপার টুল সম্পর্কে জানুন।',
    blocks: [
      { id: 'CIMTtdTYRHa_', text: 'নির্বাচন টুল', type: 'heading', level: 2, anchor: 'selection-tools' },
      { id: 'Ic1OTkbZUhfI', type: 'richtext', html: `<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960405/img/move-tool.webp" alt="Move Tool" class="img-fluid">
         <span style="display: block;">
          <i>সিলেকশন টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>পেজে অবজেক্ট সিলেক্ট ও সরাতে ব্যবহৃত হয়।</p>
         <p>টুল বাটনে ক্লিক করুন, তারপর আপনি যে অবজেক্ট সরাতে চান তাতে ক্লিক করুন।</p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960401/img/marquee-s-tool.webp" alt="Marquee Tool" class="img-fluid">
         <span style="display: block;">
          <i>মার্কি টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>একটি অবজেক্টের চারপাশে একটি আয়তক্ষেত্র বা উপবৃত্ত এঁকে সেটি সিলেক্ট করে।</p>
         <p>টুল বাটনে ক্লিক করুন, একটি আয়তাকার বা উপবৃত্তাকার মার্কি বেছে নিন। আপনি যে এলাকা সিলেক্ট করতে চান তার উপর মার্কি ড্র্যাগ করুন</p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960396/img/lasso-tool.webp" alt="Lasso Tool" class="img-fluid">
         <span style="display: block;">
          <i>লাসো টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>একটি অবজেক্টের চারপাশে হাতে আঁকা একটি বর্ডার এঁকে সেটি সিলেক্ট করে।</p>
         <p>টুল বাটনে ক্লিক করুন, আপনি যে ইমেজের এলাকা সিলেক্ট করতে চান তার চারপাশে একটি হাতে আঁকা বর্ডার আঁকতে ড্র্যাগ করুন।</p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960399/img/magicwand-tool.webp" alt="Magic Wand Tool" class="img-fluid">
         <span style="display: block;">
          <i>ম্যাজিক ওয়ান্ড টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>একই বা একই রকম fill রঙ, স্ট্রোক ওয়েট, স্ট্রোক রঙ, অপাসিটি বা ব্লেন্ডিং মোডসহ একটি ডকুমেন্টের সব অবজেক্ট সিলেক্ট করে। কালার রেঞ্জ বা টলারেন্স নির্দিষ্ট করে, আপনি নিয়ন্ত্রণ করতে পারেন Magic Wand টুল কী সিলেক্ট করবে।</p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960219/img/crop-tool.webp" alt="Crop Tool" class="img-fluid">
         <span style="display: block;">
          <i>ক্রপ টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>টুল বাটনে ক্লিক করুন, তারপর আপনি যে অংশ রাখতে চান তার উপর টুলটি ক্লিক করে ড্র্যাগ করুন। পাশ ও কোণার স্কোয়ারগুলো ড্র্যাগ করে নির্বাচিত এলাকা রিসাইজ করুন। আপনার crop বক্স সঠিক সাইজে হলে <b>Return/Enter</b> কী চাপুন। আপনি উপরের টুলবারের চেক বক্স দিয়েও এটি গ্রহণ করতে পারেন। </p>
        </div>
<hr>
<div class="img-block" style="text-align: center;">
         <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960223/img/eye-dropper.webp" alt="Eye Dropper Tool" class="img-fluid">
         <span style="display: block;">
          <i>আই ড্রপার টুল</i>
         </span>
        </div>
<div class="text-block">
         <p>পেজের রঙ থেকে কালার স্যাম্পল নেয় এবং সেগুলো <b>Color Boxes</b>-এ প্রদর্শন করে। </p>
         <p>টুলটি সিলেক্ট করুন, ইমেজে আপনি যে রঙ স্যাম্পল করতে চান তাতে ক্লিক করুন। <b>Color Box</b> এই রঙ প্রদর্শন করবে। একটি শেপ বা টেক্সট fill করতে, ড্রপার fill করার সাথে সাথে সেগুলো সিলেক্ট করুন। </p>
        </div>` },
    ],
    toc: [{ id: 'selection-tools', text: 'নির্বাচন টুল', level: 2 }],
  },
  {
    id: 'cb9d173c-44b7-479e-b966-c964ed7f3a19', // photoshop/shortcut-keys
    title: 'শর্টকাট কী',
    meta_description: 'Photoshop-এর শর্টকাট কী দেখুন ও ডাউনলোড করুন।',
    blocks: [
      { id: 'yFaHfOBexOaK', text: 'শর্টকাট কী', type: 'heading', level: 2, anchor: 'shortcut-keys' },
      { id: 'eZzqWcAMpwF9', type: 'richtext', html: '<hr>\n<iframe src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960413/img/ps-shortcut-keys.webp" frameborder="0" width="100%" height="1000px"></iframe>' },
    ],
    toc: [{ id: 'shortcut-keys', text: 'শর্টকাট কী', level: 2 }],
  },
  {
    id: '337c415b-a72c-4826-8b7a-1d11c17a6f87', // photoshop/syllabus
    title: 'Photoshop সিলেবাস',
    meta_description: 'Photoshop কীভাবে ব্যবহৃত হয় এবং Windows ও Mac-এ Photoshop চালানোর জন্য কম্পিউটার প্রয়োজনীয়তা জানুন।',
    blocks: [
      { id: 'lXDYO7f8kely', type: 'richtext', html: `<hr>
<div class="img-block" style="margin-bottom: 1em;">
       <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960410/img/Photoshop_CC_icon.webp" alt="PS LOGO" style="max-width:100px; height: auto;">
      </div>
${psIntroParagraph}
<hr>` },
      { id: 'mJv0HxE9pitI', text: 'Photoshop কীভাবে ব্যবহৃত হয়?', type: 'heading', level: 2, anchor: 'how-is-photoshop-used' },
      { id: 'im5w_PPHN9Wt', type: 'richtext', html: '<p>Adobe Photoshop ডিজাইনার, ওয়েব ডেভেলপার, গ্রাফিক আর্টিস্ট, ফটোগ্রাফার এবং ক্রিয়েটিভ প্রফেশনালদের জন্য একটি গুরুত্বপূর্ণ টুল। এটি ব্যাপকভাবে ইমেজ এডিটিং, রিটাচিং, ইমেজ কম্পোজিশন তৈরি, ওয়েবসাইট মকআপ, এবং ইফেক্ট যোগ করার জন্য ব্যবহৃত হয়। ডিজিটাল বা স্ক্যান করা ইমেজ অনলাইন বা প্রিন্টে ব্যবহারের জন্য এডিট করা যায়। Photoshop-এর ভেতরেই ওয়েবসাইট লেআউট তৈরি করা যায়; ডেভেলপাররা কোডিং পর্যায়ে যাওয়ার আগে তাদের ডিজাইন চূড়ান্ত করা যায়। স্বতন্ত্র গ্রাফিক্স তৈরি করে অন্যান্য প্রোগ্রামে ব্যবহারের জন্য এক্সপোর্ট করা যায়।</p>\n<hr>' },
      { id: '6xPG23QJD5zI', text: 'Photoshop-এর জন্য কম্পিউটার প্রয়োজনীয়তা', type: 'heading', level: 2, anchor: 'computer-requirements-for-photoshop' },
      { id: 'SU1nu9usGbWD', type: 'richtext', html: '<p>Windows বা Mac OS কম্পিউটারে Photoshop ব্যবহারের জন্য নিম্নলিখিত ন্যূনতম প্রয়োজনীয়তাগুলো দেওয়া হলো।</p>' },
      { id: 'O7vKqFrTrKTc', text: 'Photoshop-এর জন্য Windows কম্পিউটার প্রয়োজনীয়তা:', type: 'heading', level: 5, anchor: 'computer-requirements-for-photoshop-windows' },
      { id: 'PRShBAcDmW_J', type: 'richtext', html: `<p>একটি Windows কম্পিউটারে Photoshop ব্যবহার করতে, কম্পিউটারটিকে এই প্রয়োজনীয়তাগুলো পূরণ করতে হবে:</p>
<ul>
       <li>Intel® Core 2 বা AMD Athlon® 64 প্রসেসর; 2 GHz বা তার বেশি প্রসেসর।</li>
       <li>Service Pack 1-সহ Microsoft Windows 7, Windows 8.1, বা Windows 10।</li>
       <li>4 GB বা তার বেশি RAM।</li>
       <li>32-বিট ইনস্টলেশনের জন্য 2.6 GB বা তার বেশি খালি হার্ড-ডিস্ক স্পেস; 64-বিট ইনস্টলেশনের জন্য 3.1 GB বা তার বেশি খালি হার্ড-ডিস্ক স্পেস; পাশাপাশি ইনস্টলেশনের জন্য প্রয়োজনীয় অতিরিক্ত খালি জায়গা।</li>
       <li>16-বিট কালারসহ 1024 x 768 ডিসপ্লে এবং 512 MB বা তার বেশি ডেডিকেটেড VRAM। <i>1920 x 1024 ডিসপ্লে সুপারিশ করা হয়।</i>
       </li>
       <li>OpenGL 2.0-সক্ষম সিস্টেম।</li>
       <li>সফটওয়্যার অ্যাক্টিভেট করতে, সাবস্ক্রিপশন যাচাই করতে, এবং বিভিন্ন অনলাইন সেবা অ্যাক্সেস করতে ইন্টারনেট সংযোগ প্রয়োজন।</li>
      </ul>` },
      { id: 'yYsljL9FLTvN', text: 'Photoshop-এর জন্য Mac কম্পিউটার প্রয়োজনীয়তা:', type: 'heading', level: 5, anchor: 'computer-requirements-for-photoshop-mac' },
      { id: 'Oi7UkBgmwfvl', type: 'richtext', html: `<p>একটি Mac OS কম্পিউটারে Photoshop ব্যবহার করতে, কম্পিউটারটিকে এই প্রয়োজনীয়তাগুলো পূরণ করতে হবে:</p>
<ul>
       <li>64-বিট সমর্থনসহ মাল্টিকোর Intel প্রসেসর।</li>
       <li>MacOS ভার্সন 10.13 (High Sierra), MacOS ভার্সন 10.12 (Sierra), বা Mac OS X ভার্সন 10.11 (El Capitan)।</li>
       <li>4 GB বা তার বেশি RAM।</li>
       <li>ইনস্টলেশনের জন্য 4 GB বা তার বেশি খালি হার্ড-ডিস্ক স্পেস, পাশাপাশি ইনস্টলেশনের জন্য প্রয়োজনীয় অতিরিক্ত খালি জায়গা।</li>
       <li>16-বিট কালারসহ 1024 x 768 ডিসপ্লে এবং 512 MB বা তার বেশি ডেডিকেটেড VRAM।</li>
       <li>OpenGL 2.0-সক্ষম সিস্টেম।</li>
       <li>সফটওয়্যার অ্যাক্টিভেট করতে, সাবস্ক্রিপশন যাচাই করতে, এবং বিভিন্ন অনলাইন সেবা অ্যাক্সেস করতে ইন্টারনেট সংযোগ প্রয়োজন।</li>
      </ul>` },
    ],
    toc: [
      { id: 'how-is-photoshop-used', text: 'Photoshop কীভাবে ব্যবহৃত হয়?', level: 2 },
      { id: 'computer-requirements-for-photoshop', text: 'Photoshop-এর জন্য কম্পিউটার প্রয়োজনীয়তা', level: 2 },
      { id: 'computer-requirements-for-photoshop-windows', text: 'Photoshop-এর জন্য Windows কম্পিউটার প্রয়োজনীয়তা:', level: 5 },
      { id: 'computer-requirements-for-photoshop-mac', text: 'Photoshop-এর জন্য Mac কম্পিউটার প্রয়োজনীয়তা:', level: 5 },
    ],
  },
  {
    id: 'f0c4c6be-33e5-46dc-9688-da15fdfc8f01', // photoshop/toolbar
    title: 'টুলবার',
    meta_description: 'Photoshop-এর টুলবক্স এবং লুকানো টুল কীভাবে খুঁজে বের করবেন ও ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'SSBBgJuPc2Th', text: 'টুলবক্স', type: 'heading', level: 2, anchor: 'toolbox' },
      { id: '80qbWd9pyqAQ', type: 'richtext', html: '<hr>\n<p>আপনি যদি Adobe প্রোডাক্টের নতুন ব্যবহারকারী হন, তাহলে মনে রাখবেন যে আপনার সব টুল ব্যবহার করার প্রয়োজন নাও হতে পারে। এই টিউটোরিয়ালে, শুধু বেসিক টুলগুলো নিয়ে গভীরভাবে আলোচনা করা হবে। চিত্র ৩-এ টুল-বক্সের একটি উদাহরণ দেখানো হয়েছে।</p>' },
      { id: '9-HoJCH4qwhj', alt: 'টুলবার', type: 'image', width: 1461, height: 912, publicId: 'img/toolbar' },
      { id: 'NZMsq1CRMUtV', type: 'richtext', html: `<span style="display: block; text-align: center;">
       <i>চিত্র ৩: টুলবার</i>
      </span>
<p>টুলবক্সের কিছু টুলের সাথে অতিরিক্ত টুল যুক্ত থাকে। এই টুলগুলোর ডান কোণায় ছোট কালো ত্রিভুজ থাকে। অতিরিক্ত টুল দেখতে, কোণায় কালো ত্রিভুজ আছে এমন যেকোনো টুলে ক্লিক করে চেপে ধরুন।</p>` },
      { id: 'tqHCdUupqAkB', alt: 'টুলবার', type: 'image', width: 268, height: 97, publicId: 'img/marquee-tool' },
      { id: 'iq08HXbqFOTY', type: 'richtext', html: `<span style="display: block; text-align: center;">
       <i>চিত্র ৪: লুকানো টুল</i>
      </span>
<p>আপনার যদি প্রায়ই কিছু অতিরিক্ত টুল ব্যবহার করতে হয়, তাহলে আপনি অতিরিক্ত টুলগুলোকে তাদের নিজস্ব টুলবারে টিয়ার অফ করতে পারেন। অতিরিক্ত টুল টিয়ার অফ করতে, নিচের কাজগুলো করুন:</p>
<ul>
       <li>1. আপনি যে টুলের অতিরিক্ত টুল দেখতে চান তাতে ক্লিক করে চেপে ধরুন।</li>
       <li>2. আপনার মাউস বাটন চেপে ধরে থাকা অবস্থায়, কালো ত্রিভুজসহ বাটনের দিকে টুলের শেষ পর্যন্ত মাউস ড্র্যাগ করুন।</li>
       <li>3. অতিরিক্ত টুল এবং নতুন টুলবার তৈরি করতে মাউস বাটন ছেড়ে দিন। </li>
      </ul>` },
    ],
    toc: [{ id: 'toolbox', text: 'টুলবক্স', level: 2 }],
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
console.log('photoshop: 12/12 written')
