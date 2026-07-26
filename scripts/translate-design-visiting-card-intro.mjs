import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '812a0b61-e2e4-473e-b974-4cc7784a58e7' // design/visiting-card-intro
const title = 'ভিজিটিং কার্ড পরিচিতি'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'বিজনেস কার্ডের স্ট্যান্ডার্ড সাইজ, ব্লিড এরিয়া এবং সেফ জোন সম্পর্কে জেনে নিজেই একটি বিজনেস কার্ড তৈরি করুন।'

const blocks = [
  { id: 'lD2HQxSn0Fr2', type: 'richtext', html: '<hr>' },
  { id: 'sUQyGgiqJF1Q', text: 'কীভাবে নিজের বিজনেস কার্ড তৈরি করবেন', type: 'heading', level: 2, anchor: 'how-to-create-your-own-business-cards' },
  { id: 'mhp3CMxblJLK', type: 'richtext', html: `<p>আপনি একজন ব্যবসায়ী হোন বা একজন গ্রাফিক ডিজাইনার যিনি আকর্ষণীয় বিজনেস কার্ড তৈরি করতে চান, কোথা থেকে শুরু করবেন তা জানা সাহায্য করে।</p>
<p>আপনার কম্পিউটারে থাকা যেকোনো সফটওয়্যার টুল ব্যবহার করে একটি পেশাদার দেখতে বিজনেস কার্ড তৈরি করা সহজ। আপনি Microsoft Word, Publisher বা PowerPoint-সহ যেকোনো লেআউট প্রোগ্রামে, এমনকি Adobe Photoshop এবং Illustrator-এর মতো প্রথাগত গ্রাফিক্স প্রোগ্রামেও শুরু থেকে তৈরি করতে পারেন।</p>
<hr>` },
  { id: 'xkQ_LHcrsjT4', text: 'বিজনেস কার্ডের সাইজ ও সেটআপ', type: 'heading', level: 2, anchor: 'business-card-size-and-setup' },
  { id: 'jXhVlelilcad', type: 'richtext', html: `<p>একটি প্রিন্টেড বিজনেস কার্ডের স্ট্যান্ডার্ড মাপ হলো <b>3.5 x 2 ইঞ্চি</b>। এটি চূড়ান্ত কার্ডের সাইজ। </p>
<p>অনেক প্রিন্টেড ডিজাইনে ব্লিড অন্তর্ভুক্ত থাকে। "<b>ব্লিড এরিয়া</b>" হলো আপনার কার্ডের চূড়ান্ত প্রান্তের বাইরে প্রসারিত ডিজাইন এলিমেন্ট বা ব্যাকগ্রাউন্ডের জন্য একটি অতিরিক্ত 1/8 ইঞ্চি জায়গা। ব্লিডসহ একটি বিজনেস কার্ড ডিজাইন একটু বড় করে প্রিন্ট করা হয় এবং তারপর সাইজ অনুযায়ী কেটে ফেলা হয়, যাতে সাদা বর্ডার না রেখে মনে হয় যে প্রিন্টিং কার্ডের প্রান্ত পর্যন্ত "ব্লিড" করেছে। </p>
<div class="img-block" style="text-align: center;margin-bottom: 1rem;">
       <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960381/img/graphics-design/visiting-card/visiting-card-size.webp" alt="Visiting card Size" class="img-thumbnail">
       <span style="display:block;">
        <i>ভিজিটিং কার্ডের সাইজ</i>
       </span>
      </div>
<hr>` },
  { id: 'dgOhY8mxgQ6F', text: 'আপনার বিজনেস কার্ড ডিজাইন ফাইল তৈরি করার সময়, এই টিপসগুলো ব্যবহার করুন:', type: 'heading', level: 2, anchor: 'when-creating-your-business-card-design-file-use-these-tips' },
  { id: 'Gv8KUuNIPRPf', type: 'richtext', html: `<ul>
       <li>ডকুমেন্টের পেজ সাইজ কার্ড সাইজ প্লাস ব্লিড এরিয়ার সমান করুন, অর্থাৎ <b>3.75" প্রস্থ x 2.25" উচ্চতা</b>, যা প্রিন্টের পরে চূড়ান্ত সাইজে ছেঁটে ফেলা হবে। ব্লিড অন্তর্ভুক্ত করার পরিকল্পনা না থাকলে, ব্লিড এরিয়ার প্রয়োজন নেই, তাই ডকুমেন্টের সাইজ চূড়ান্ত সাইজ, অর্থাৎ 3.5 x 2 ইঞ্চি সেট করুন। </li>
       <li>লম্বা দিক উপরে রেখে একটি ভার্টিক্যাল কার্ড ডিজাইন করলে, শুধু পেজের প্রস্থ ও উচ্চতা অদলবদল করুন, যাতে ডিজাইনটি আপনার পরিকল্পনা অনুযায়ী দেখার জন্য কার্ডটি ঘোরাতে না হয়।</li>
       <li>মেট্রিক সিস্টেমে, স্ট্যান্ডার্ড বিজনেস কার্ড সাইজ হলো <b>8.9 x 5.1 সেমি (সেন্টিমিটার)</b> বা <b>88.9 x 50.8 মিমি (মিলিমিটার)</b>। </li>
      </ul>
<hr>` },
  { id: 'aYHz9pCvBzci', text: 'বর্ডারের কাছে সতর্ক থাকুন', type: 'heading', level: 2, anchor: 'play-it-safe-near-the-borders' },
  { id: 'VJxPdEa9pi8A', type: 'richtext', html: `<p>কাটিং সামান্য কমবেশি হতে পারে বলে, আপনার সব গুরুত্বপূর্ণ টেক্সট ও লোগো তথ্য ডিজাইনের সেফ জোনের মধ্যে রাখা ভালো। এই জোনটি আপনার কার্ডের মার্জিনের চারপাশে 1/8 ইঞ্চি জায়গা। নিশ্চিত করুন যে আপনার টেক্সট কার্ডের <b>3.25 x 1.75 ইঞ্চি</b> এলাকার মধ্যে আছে। আপনি নিশ্চয়ই চাইবেন না আপনার ফোন নম্বরের শেষ সংখ্যাটি কাটা পড়ুক! </p>
<p>বর্ডার দিয়ে ডিজাইন করা কিছুটা কঠিন হতে পারে। সেফ জোনের বাইরে 1/8 ইঞ্চির চেয়ে পাতলা বর্ডার সমানভাবে না-ও কাটতে পারে। একটি "অফ-সেন্টার" চেহারা এড়াতে, বর্ডার লাইন বা অন্যান্য পাতলা লাইনগুলোকে আপনার বিজনেস কার্ডের প্রান্ত থেকে দূরে, সেফ জোনের মধ্যে রাখুন।</p>
<p class="note">
       <b>মনে রাখবেন:</b> ভিজিটিং / বিজনেস কার্ডের উদাহরণ দেখতে <a href="https://webgraphicshub.com/works/business-card/" target="_blank">Web Graphics Hub</a> ভিজিট করুন।
      </p>` },
]

const toc = [
  { id: 'how-to-create-your-own-business-cards', text: 'কীভাবে নিজের বিজনেস কার্ড তৈরি করবেন', level: 2 },
  { id: 'business-card-size-and-setup', text: 'বিজনেস কার্ডের সাইজ ও সেটআপ', level: 2 },
  { id: 'when-creating-your-business-card-design-file-use-these-tips', text: 'আপনার বিজনেস কার্ড ডিজাইন ফাইল তৈরি করার সময়, এই টিপসগুলো ব্যবহার করুন:', level: 2 },
  { id: 'play-it-safe-near-the-borders', text: 'বর্ডারের কাছে সতর্ক থাকুন', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('design/visiting-card-intro: 1/1 written')
