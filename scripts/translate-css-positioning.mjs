import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'cbfe7768-9839-4d30-9671-216d050f86c8' // css/positioning
const title = 'CSS পজিশন'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'CSS position প্রপার্টি: static, relative, fixed, absolute, sticky এবং z-index দিয়ে এলিমেন্ট ওভারল্যাপ নিয়ন্ত্রণ শিখুন।'
const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos deserunt porro corrupti, harum quos itaque! Facilis corporis hic tempore, alias repellat minima optio. Ab ea autem mollitia sunt fuga, ut quasi quisquam alias, magni dolore assumenda. Quidem praesentium dicta, totam voluptate, pariatur officia! Voluptates quam ad alias quidem aperiam, adipisci eum ipsam magnam enim, non doloribus suscipit illo consequatur labore ab vero maxime quas ullam dolor, recusandae quos, officiis ipsa. Harum, atque aliquam et doloremque sed eaque temporibus dolores, deserunt rem quibusdam assumenda dicta eius, voluptatibus amet nisi optio consequuntur soluta sequi fuga eum quasi velit odio excepturi impedit. Odio! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi, fuga perspiciatis rem asperiores, eum provident temporibus alias magni modi iste tenetur distinctio voluptatem? Quae eveniet, earum eaque. Fugiat labore harum, atque porro, fugit odio amet. Quam, rerum dolore, adipisci laudantium consectetur quae. Neque eius deserunt similique, aliquid quis deleniti eaque, animi atque molestiae magni doloribus officiis fuga aut a expedita in ad vitae illo voluptatem. Unde beatae sint laudantium, ipsa corrupti vel repudiandae cupiditate repellendus ex modi similique dolor laboriosam vitae officia cum aut, consectetur laborum iusto at! Nobis, quisquam sit rerum ea vero, reiciendis eligendi aliquam labore sint quod. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit, iste, eligendi. Natus nemo aut quos adipisci, ipsum impedit eligendi, voluptatibus ab qui enim aspernatur, beatae aliquid id molestiae veritatis eveniet harum illo dolor quaerat eos blanditiis explicabo. Optio repellat neque quod nulla molestias ut nisi, corporis minima sint. Perspiciatis, modi vitae vero sit quibusdam magnam quo unde! Nisi iure non illo provident, voluptatum harum, dicta quia facilis, dolorum totam dignissimos maiores, itaque porro unde! Non inventore ullam quidem repellendus neque voluptates distinctio itaque eaque voluptatum ad. Eos repellendus debitis, totam deleniti quidem eligendi alias ratione, est, soluta, facilis rem. Eaque?"

const blocks = [
  { id: 'ndyq3pE48e70', type: 'richtext', html: `<hr>
<p><code>position</code> প্রপার্টি একটি এলিমেন্টের জন্য ব্যবহৃত পজিশনিং পদ্ধতির ধরন নির্ধারণ করে।</p>
<hr>
<p>পাঁচটি ভিন্ন position মান আছে: </p>
<ul>
                                    <li><code class="w3-codespan">static</code></li>
                                    <li><code class="w3-codespan">relative</code></li>
                                    <li><code class="w3-codespan">fixed</code></li>
                                    <li><code class="w3-codespan">absolute</code></li>
                                    <li><code class="w3-codespan">sticky</code></li>
                                </ul>
<p>এলিমেন্টগুলো তখন top, bottom, left, এবং right প্রপার্টি ব্যবহার করে পজিশন করা হয়। তবে, <code>position</code>
                                প্রপার্টি প্রথমে সেট না করলে এই প্রপার্টিগুলো কাজ করবে না। এগুলো position মানের উপর নির্ভর করে ভিন্নভাবেও কাজ করে।</p>
<hr>` },
  { id: 'vrh4AKRCJhPK', text: 'position: static;', type: 'heading', level: 2, anchor: 'position-static' },
  { id: '5Pay0U5kBxYt', type: 'richtext', html: '<p>HTML এলিমেন্ট ডিফল্টভাবে static পজিশন করা থাকে।</p>\n<p>Static পজিশন করা এলিমেন্ট top, bottom, left, এবং right প্রপার্টি দ্বারা প্রভাবিত হয় না।</p>\n<p><code>position: static;</code>-সহ একটি এলিমেন্ট কোনো বিশেষ উপায়ে পজিশন করা হয় না; এটি সবসময় পেজের স্বাভাবিক প্রবাহ অনুযায়ী পজিশন করা থাকে:</p>\n<p>এখানে ব্যবহৃত CSS দেওয়া হলো:</p>' },
  { id: '4pD0jot5JTy2', type: 'code', language: 'css', code: 'div.static {\n  position: static;\n  border: 3px solid #73AD21;\n}' },
  { id: 'O1K_TFU3Np_9', type: 'richtext', html: '<hr>' },
  { id: 'UrqGSNkHEwny', text: 'position: relative;', type: 'heading', level: 2, anchor: 'position-relative' },
  { id: 'FKt27dNo-Xwp', type: 'richtext', html: '<p><code class="w3-codespan">position: relative;</code>-সহ একটি এলিমেন্ট তার স্বাভাবিক অবস্থানের সাপেক্ষে পজিশন করা হয়।</p>\n<p>একটি রিলেটিভভাবে পজিশন করা এলিমেন্টের top, right, bottom, এবং left প্রপার্টি সেট করলে এটি তার স্বাভাবিক অবস্থান থেকে সরে যাবে। এলিমেন্টের ফলে তৈরি হওয়া কোনো ফাঁকা জায়গা পূরণ করতে অন্য কনটেন্ট সমন্বয় করা হবে না।</p>\n<p>এখানে ব্যবহৃত CSS দেওয়া হলো:</p>' },
  { id: '1j0ckz6_rXUO', type: 'code', language: 'css', code: 'div.relative {\n  position: relative;\n  left: 30px;\n  border: 3px solid #73AD21;\n}' },
  { id: '2ZmNLkCnxb__', type: 'richtext', html: '<hr>' },
  { id: '5UkMt3D7yiDH', text: 'position: fixed;', type: 'heading', level: 2, anchor: 'position-fixed' },
  { id: 'VLaNF_Qf-mau', type: 'richtext', html: '<p><code>position: fixed;</code>-সহ একটি এলিমেন্ট ভিউপোর্টের সাপেক্ষে পজিশন করা হয়, অর্থাৎ পেজ স্ক্রল করলেও এটি সবসময় একই জায়গায় থাকে। এলিমেন্টটি পজিশন করতে top, right, bottom, এবং left প্রপার্টি ব্যবহার করা হয়।</p>\n<p>একটি fixed এলিমেন্ট পেজে সেই জায়গায় কোনো ফাঁকা তৈরি করে না, যেখানে এটি সাধারণত থাকত।</p>\n<p>পেজের নিচের-ডান কোণে fixed এলিমেন্টটি লক্ষ্য করুন। এখানে ব্যবহৃত CSS দেওয়া হলো:</p>\n<code>position: fixed;</code>' },
  { id: 'lz6Xpt0Ol8lu', type: 'code', language: 'css', code: 'div.fixed {\n  position: fixed;\n  bottom: 0;\n  right: 0;\n  width: 300px;\n  border: 3px solid #73AD21;\n}' },
  { id: 'aN1NqPwImzLj', type: 'richtext', html: '<hr>' },
  { id: 'nCsf2biAqhSR', text: 'position: absolute;', type: 'heading', level: 2, anchor: 'position-absolute' },
  { id: 'tBgNs-VFii6p', type: 'richtext', html: '<p><code class="w3-codespan">position: absolute;</code>-সহ একটি এলিমেন্ট নিকটতম পজিশন করা অ্যানসেস্টরের সাপেক্ষে পজিশন করা হয় (fixed-এর মতো ভিউপোর্টের সাপেক্ষে নয়)।</p>\n<p>তবে; একটি absolute পজিশন করা এলিমেন্টের যদি কোনো পজিশন করা অ্যানসেস্টর না থাকে, তাহলে এটি ডকুমেন্ট বডি ব্যবহার করে, এবং পেজ স্ক্রলের সাথে সাথে সরে।</p>\n<p><b>মনে রাখবেন:</b> একটি "পজিশন করা" এলিমেন্ট হলো এমন এলিমেন্ট যার position <code>static</code> ছাড়া অন্য কিছু।</p>\n<p>এখানে একটি সহজ উদাহরণ দেওয়া হলো:</p>\n<p>এখানে ব্যবহৃত CSS দেওয়া হলো:</p>' },
  { id: 'XbQBgLjT_zoO', type: 'code', language: 'css', code: 'div.relative {\n  position: relative;\n  width: 400px;\n  height: 200px;\n  border: 3px solid #0054D1;\n} \ndiv.absolute {\n  position: absolute;\n  top: 80px;\n  right: 0;\n  width: 200px;\n  height: 100px;\n  border: 3px solid #0054D1;\n}' },
  { id: 'lXSm8KG87DqS', type: 'richtext', html: '<hr>' },
  { id: 'x1nhuqETTn3o', text: 'position: sticky;', type: 'heading', level: 2, anchor: 'position-sticky' },
  { id: 'RBk99D34Ta5S', type: 'richtext', html: `<p><code>position: sticky;</code>-সহ একটি এলিমেন্ট ব্যবহারকারীর স্ক্রল পজিশনের ভিত্তিতে পজিশন করা হয়।</p>
<p>একটি sticky এলিমেন্ট স্ক্রল পজিশনের উপর নির্ভর করে <code>relative</code> এবং <code>fixed</code>-এর মধ্যে টগল করে। এটি রিলেটিভভাবে পজিশন করা থাকে যতক্ষণ না ভিউপোর্টে একটি নির্দিষ্ট অফসেট পজিশনে পৌঁছায় - তারপর এটি সেখানে "আটকে" যায় (position:fixed-এর মতো)।</p>
<p><b>sticky পজিশনিং কীভাবে কাজ করে তা বুঝতে এই ফ্রেমের ভেতরে স্ক্রল করার চেষ্টা করুন।</b></p>
<p><b>মনে রাখবেন: IE/Edge 15 এবং তার আগের ভার্সনে sticky position সমর্থিত নয়।</b></p>
<p>${loremIpsum}</p>
<p class="note"><b>মনে রাখবেন:</b> Internet Explorer, Edge 15 এবং তার আগের ভার্সনে sticky পজিশনিং সমর্থিত নয়। Safari-তে একটি -webkit- প্রিফিক্স প্রয়োজন (নিচের উদাহরণ দেখুন)। sticky পজিশনিং কাজ করার জন্য আপনাকে অবশ্যই top, right, bottom, বা left-এর অন্তত একটি উল্লেখ করতে হবে।</p>
<p>এই উদাহরণে, আপনি এর স্ক্রল পজিশনে পৌঁছালে sticky এলিমেন্টটি পেজের উপরে (<code>top: 0</code>) আটকে যায়।</p>` },
  { id: 'uyO0hpLUWX0k', type: 'code', language: 'css', code: 'div.sticky {\n  position: -webkit-sticky; /* Safari-এর জন্য */\n  position: sticky;\n  top: 0;\n  background-color: green;\n  border: 2px solid #4CAF50;\n}' },
  { id: 'tb-EAQ_6qomF', text: 'ওভারল্যাপিং এলিমেন্ট', type: 'heading', level: 2, anchor: 'overlapping-elements' },
  { id: 'goqbWoTcIo4i', type: 'richtext', html: '<p>এলিমেন্ট পজিশন করা হলে, সেগুলো অন্য এলিমেন্টের সাথে ওভারল্যাপ করতে পারে।</p>\n<p><code>z-index</code> প্রপার্টি একটি এলিমেন্টের স্ট্যাক অর্ডার নির্ধারণ করে (কোন এলিমেন্টটি অন্যদের সামনে, বা পেছনে থাকবে)।</p>\n<p>একটি এলিমেন্টের ধনাত্মক বা ঋণাত্মক স্ট্যাক অর্ডার থাকতে পারে:</p>' },
  { id: 'Kv1De04FC494', type: 'image', alt: '', width: 100, height: 100, publicId: 'img/cat-img' },
  { id: 'FvfMmymShWrJ', type: 'richtext', html: '<p style="position:absolute;left:35px;top:65px;z-index:2;color: #000;">ইমেজের z-index -1 হওয়ায়, এটি টেক্সটের পেছনে রাখা হবে।</p>' },
  { id: '6T21zaTHXPwS', type: 'code', language: 'css', code: 'img {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  z-index: -1;\n}' },
  { id: 'UaQBLjS89sRE', type: 'richtext', html: '<p>বেশি স্ট্যাক অর্ডারযুক্ত একটি এলিমেন্ট সবসময় কম স্ট্যাক অর্ডারযুক্ত এলিমেন্টের সামনে থাকে।</p>\n<p class="note"><b>মনে রাখবেন:</b> z-index নির্ধারিত না থাকলে দুটি পজিশন করা এলিমেন্ট ওভারল্যাপ করলে, HTML কোডে সর্বশেষ পজিশন করা এলিমেন্টটি উপরে দেখানো হবে।</p>\n<hr>' },
  { id: 'lmCHsVUb5GjW', text: 'একটি ইমেজে টেক্সট পজিশন করা', type: 'heading', level: 2, anchor: 'positioning-text-in-an-image' },
  { id: 'f98Jwo-kd5Yp', type: 'richtext', html: `<p>একটি ইমেজের উপর কীভাবে টেক্সট পজিশন করবেন:</p>
<div class="img-thumbnail">
                                    <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960418/img/text-over-img.webp" alt="" class="img-fluid">
                                </div>
<hr>` },
  { id: 'g75NhtM7UCed', text: 'সব CSS পজিশনিং প্রপার্টি', type: 'heading', level: 2, anchor: 'all-css-positioning-properties' },
  { id: 'twjQeqcxhVGj', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
    ['bottom', 'একটি পজিশন করা বক্সের নিচের মার্জিন এজ সেট করে'],
    ['clip', 'একটি অ্যাবসোলিউটভাবে পজিশন করা এলিমেন্ট ক্লিপ করে'],
    ['left', 'একটি পজিশন করা বক্সের বামের মার্জিন এজ সেট করে'],
    ['position', 'একটি এলিমেন্টের জন্য পজিশনিংয়ের ধরন নির্ধারণ করে'],
    ['right', 'একটি পজিশন করা বক্সের ডানের মার্জিন এজ সেট করে'],
    ['top', 'একটি পজিশন করা বক্সের উপরের মার্জিন এজ সেট করে'],
    ['z-index', 'একটি এলিমেন্টের স্ট্যাক অর্ডার সেট করে'],
  ] },
]

const toc = [
  { id: 'position-static', text: 'position: static;', level: 2 },
  { id: 'position-relative', text: 'position: relative;', level: 2 },
  { id: 'position-fixed', text: 'position: fixed;', level: 2 },
  { id: 'position-absolute', text: 'position: absolute;', level: 2 },
  { id: 'position-sticky', text: 'position: sticky;', level: 2 },
  { id: 'overlapping-elements', text: 'ওভারল্যাপিং এলিমেন্ট', level: 2 },
  { id: 'positioning-text-in-an-image', text: 'একটি ইমেজে টেক্সট পজিশন করা', level: 2 },
  { id: 'all-css-positioning-properties', text: 'সব CSS পজিশনিং প্রপার্টি', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/positioning: 1/1 written')
