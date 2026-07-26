import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'dbb0f170-1850-4a69-bab1-988ab1cb5ad1' // html/semantic-elements
const title = 'সিমান্টিক এলিমেন্ট'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'সিমান্টিক এলিমেন্ট কী, article, section, header, footer, nav, aside, figure এলিমেন্টের ব্যবহার এবং গুরুত্ব জানুন।'

const blocks = [
  { id: 'JFJnHN_ttXmW', type: 'richtext', html: '<hr>\n<p>সিমান্টিকস (Semantics) হলো একটি ভাষায় শব্দ ও বাক্যাংশের অর্থ নিয়ে অধ্যয়ন।</p>\n<p>সিমান্টিক এলিমেন্ট = অর্থপূর্ণ এলিমেন্ট।</p>\n<hr>' },
  { id: 'PrEGEjXsxeZG', text: 'সিমান্টিক এলিমেন্ট কী?', type: 'heading', level: 2, anchor: 'what-are-semantic-elements' },
  { id: 'jJklrz0-mRkp', type: 'richtext', html: '<p>একটি সিমান্টিক এলিমেন্ট ব্রাউজার এবং ডেভেলপার — উভয়ের কাছেই তার অর্থ স্পষ্টভাবে বর্ণনা করে।</p>\n<p>নন-সিমান্টিক এলিমেন্টের উদাহরণ: <code>&lt;div&gt;</code> এবং <code>&lt;span&gt;</code> - এর কনটেন্ট সম্পর্কে কিছুই বলে না।</p>\n<p>সিমান্টিক এলিমেন্টের উদাহরণ: <code>&lt;form&gt;</code>, <code>&lt;table&gt;</code>, এবং <code>&lt;article&gt;</code> - এর কনটেন্ট স্পষ্টভাবে নির্ধারণ করে।</p>\n<hr>' },
  { id: 'kILI0d6zINn_', text: 'HTML5-এ নতুন সিমান্টিক এলিমেন্ট', type: 'heading', level: 2, anchor: 'new-semantic-elements-in-html5' },
  { id: 'Rrw_GBkPvjkw', type: 'richtext', html: `<p>অনেক ওয়েবসাইটে নেভিগেশন, হেডার এবং ফুটার বোঝাতে এই ধরনের HTML কোড থাকে: <code>&lt;div id="nav"&gt;</code> <code>&lt;div class="header"&gt;</code> <code>&lt;div id="footer"&gt;</code>।</p>
<p>একটি ওয়েব পেজের বিভিন্ন অংশ নির্ধারণ করতে HTML5-এ নতুন সিমান্টিক এলিমেন্ট রয়েছে:</p>
<ul>
                                            <li>&lt;article&gt;</li>
                                            <li>&lt;aside&gt;</li>
                                            <li>&lt;details&gt;</li>
                                            <li>&lt;figcaption&gt;</li>
                                            <li>&lt;figure&gt;</li>
                                            <li>&lt;footer&gt;</li>
                                            <li>&lt;header&gt;</li>
                                            <li>&lt;main&gt;</li>
                                            <li>&lt;mark&gt;</li>
                                            <li>&lt;nav&gt;</li>
                                            <li>&lt;section&gt;</li>
                                            <li>&lt;summary&gt;</li>
                                            <li>&lt;time&gt;</li>
                                        </ul>
<div class="img-block">
                                            <video autoplay="" muted="" loop="" playsinline="" aria-label="sementic-tags"><source src="https://res.cloudinary.com/docslca/video/upload/v1784960416/img/sementic-tags.mp4" type="video/mp4"></video>
                                        </div>
<hr>` },
  { id: 'bfu1ITK-Qt2T', text: 'HTML5 section> এলিমেন্ট', type: 'heading', level: 2, anchor: 'html5-section-element' },
  { id: 'SKZOTdpq0KhH', type: 'richtext', html: '<p><code>&lt;section&gt;</code> এলিমেন্ট একটি ডকুমেন্টে একটি সেকশন নির্ধারণ করে।</p>\n<p>W3C-এর HTML5 ডকুমেন্টেশন অনুযায়ী: "একটি সেকশন হলো কনটেন্টের একটি থিমভিত্তিক গ্রুপিং, সাধারণত একটি হেডিং সহ।"</p>\n<p>একটি হোমপেজকে সাধারণত ভূমিকা, কনটেন্ট এবং যোগাযোগের তথ্যের জন্য আলাদা আলাদা সেকশনে ভাগ করা যেতে পারে।</p>' },
  { id: 'L8SjIPWd8AsF', type: 'code', language: 'html', code: '<section>\n  <h1>WWF</h1>\n  <p>The World Wide Fund for Nature (WWF) is....</p>\n</section>' },
  { id: 'Jd9an22oXJ5Z', type: 'richtext', html: '<hr>' },
  { id: 'b3leeVpoSjX5', text: 'HTML5 <article> এলিমেন্ট', type: 'heading', level: 2, anchor: 'html5-article-element' },
  { id: '5HqT91I81izt', type: 'richtext', html: `<p><code>&lt;article&gt;</code> এলিমেন্ট স্বতন্ত্র, স্বয়ংসম্পূর্ণ কনটেন্ট নির্ধারণ করে।</p>
<p>একটি আর্টিকেল নিজে থেকেই অর্থবহ হওয়া উচিত, এবং ওয়েবসাইটের বাকি অংশ থেকে আলাদাভাবে পড়া সম্ভব হওয়া উচিত।</p>
<p><code>&lt;article&gt;</code> এলিমেন্ট যেসব ক্ষেত্রে ব্যবহার করা যায় তার উদাহরণ:</p>
<ul>
                                    <li>ফোরাম পোস্ট</li>
                                    <li>ব্লগ পোস্ট</li>
                                    <li>সংবাদপত্রের আর্টিকেল</li>
                                </ul>` },
  { id: 'HkBstxPjDi-E', type: 'code', language: 'html', code: '<article>\n  <h1>What Does WWF Do?</h1>\n  <p>WWF\'s mission is to stop the degradation of our planet\'s natural environment,\n  and build a future in which humans live in harmony with nature.</p>\n</article>' },
  { id: 'QhV1PVm6qUFx', type: 'richtext', html: '<hr>' },
  { id: 'rZf0ChmcbBVa', text: '<section>-এর ভেতরে <article> নেস্ট করা, নাকি উল্টোটা?', type: 'heading', level: 2, anchor: 'nesting-article-in-section-or-vice-versa' },
  { id: 'INatLGnrruxv', type: 'richtext', html: `<p><code>&lt;article&gt;</code> এলিমেন্ট স্বতন্ত্র, স্বয়ংসম্পূর্ণ কনটেন্ট নির্ধারণ করে।</p>
<p><code>&lt;section&gt;</code> এলিমেন্ট একটি ডকুমেন্টে একটি সেকশন নির্ধারণ করে।</p>
<p>এই সংজ্ঞাগুলো দিয়ে কি আমরা ঠিক করতে পারি কীভাবে এই এলিমেন্টগুলো নেস্ট করতে হবে? না, পারি না!</p>
<p>তাই, ইন্টারনেটে আপনি এমন HTML পেজ পাবেন যেখানে <code>&lt;section&gt;</code> এলিমেন্টের ভেতরে <code>&lt;article&gt;</code> এলিমেন্ট আছে, আবার <code>&lt;article&gt;</code> এলিমেন্টের ভেতরে <code>&lt;section&gt;</code> এলিমেন্টও আছে।</p>
<p>এমনকি এমন পেজও পাবেন যেখানে <code>&lt;section&gt;</code>-এর ভেতরে <code>&lt;section&gt;</code>, এবং <code>&lt;article&gt;</code>-এর ভেতরে <code>&lt;article&gt;</code> আছে।</p>
<p class="note">একটি সংবাদপত্রের উদাহরণ: স্পোর্টস সেকশনের স্পোর্টস <code>&lt;article&gt;</code>-এর মধ্যে প্রতিটি <code>&lt;article&gt;</code>-এ একটি টেকনিক্যাল সেকশন থাকতে পারে।</p>
<hr>` },
  { id: 'OXsXSZwVuU8_', text: 'HTML5 <header> এলিমেন্ট', type: 'heading', level: 2, anchor: 'html5-header-element' },
  { id: 'tIEphwSvYyVx', type: 'richtext', html: '<p><code>&lt;header&gt;</code> এলিমেন্ট একটি ডকুমেন্ট বা সেকশনের হেডার নির্ধারণ করে।</p>\n<p><code>&lt;header&gt;</code> এলিমেন্ট ভূমিকামূলক কনটেন্টের একটি কন্টেইনার হিসেবে ব্যবহার করা উচিত।</p>\n<p>একটি ডকুমেন্টে একাধিক <code>&lt;header&gt;</code> এলিমেন্ট থাকতে পারে।</p>\n<p>নিচের উদাহরণে একটি আর্টিকেলের জন্য একটি হেডার নির্ধারণ করা হয়েছে:</p>' },
  { id: 'oVqXGF4_QF85', type: 'code', language: 'html', code: '<article>\n  <header>\n    <h1>What Does WWF Do?</h1>\n    <p>WWF\'s mission:</p>\n  </header>\n  <p>WWF\'s mission is to stop the degradation of our planet\'s natural environment,\n  and build a future in which humans live in harmony with nature.</p>\n</article>' },
  { id: 'xlGf0Kcig9rO', type: 'richtext', html: '<hr>' },
  { id: 'VdB8wHDxr3gj', text: 'HTML5 <footer> এলিমেন্ট', type: 'heading', level: 2, anchor: 'html5-footer-element' },
  { id: 'KPqZ3wTx7vkI', type: 'richtext', html: '<p><code>&lt;footer&gt;</code> এলিমেন্ট একটি ডকুমেন্ট বা সেকশনের ফুটার নির্ধারণ করে।</p>\n<p>একটি <code>&lt;footer&gt;</code> এলিমেন্টে তার প্যারেন্ট এলিমেন্ট সম্পর্কিত তথ্য থাকা উচিত।</p>\n<p>একটি ফুটারে সাধারণত ডকুমেন্টের লেখক, কপিরাইট তথ্য, ব্যবহারের শর্তাবলীর লিঙ্ক, যোগাযোগের তথ্য ইত্যাদি থাকে।</p>\n<p>একটি ডকুমেন্টে একাধিক <code>&lt;footer&gt;</code> এলিমেন্ট থাকতে পারে।</p>' },
  { id: '2GmwQhLvUx-k', type: 'code', language: 'html', code: '<footer>\n  <p>Posted by: Hege Refsnes</p>\n  <p>Contact information: <a href="mailto:someone@example.com">someone@example.com</a>.</p>\n</footer>' },
  { id: 'jckgey0jFnwY', type: 'richtext', html: '<hr>' },
  { id: 'fNAC_thvZUDu', text: 'HTML5 <nav> এলিমেন্ট', type: 'heading', level: 2, anchor: 'html5-nav-element' },
  { id: '33mVj60Hd5cH', type: 'richtext', html: '<p><code>&lt;nav&gt;</code> এলিমেন্ট নেভিগেশন লিঙ্কের একটি সেট নির্ধারণ করে।</p>\n<p class="note">লক্ষ্য করুন, একটি ডকুমেন্টের <b>সব</b> লিঙ্ক <code>&lt;nav&gt;</code> এলিমেন্টের ভেতরে থাকা উচিত নয়। <code>&lt;nav&gt;</code> এলিমেন্ট শুধুমাত্র প্রধান নেভিগেশন লিঙ্কের ব্লকের জন্য ব্যবহৃত হয়।</p>' },
  { id: 'sndFAWvO4Skw', type: 'code', language: 'html', code: '<nav>\n  <a href="/html/">HTML</a> \n  <a href="/css/">CSS</a> \n  <a href="/js/">JavaScript</a> \n  <a href="/jquery/">jQuery</a>\n</nav>' },
  { id: 'l7pQE89xJZV6', type: 'richtext', html: '<hr>' },
  { id: '3GalcvJS4x3M', text: 'HTML5 <aside> এলিমেন্ট', type: 'heading', level: 2, anchor: 'html5-aside-element' },
  { id: '12WD1POhwmQj', type: 'richtext', html: '<p><code>&lt;aside&gt;</code> এলিমেন্ট এমন কিছু কনটেন্ট নির্ধারণ করে, যা যেই কনটেন্টের ভেতরে এটি রাখা হয়েছে তার থেকে আলাদা (যেমন একটি সাইডবার)।</p>\n<p><code>&lt;aside&gt;</code>-এর কনটেন্ট আশেপাশের কনটেন্টের সাথে সম্পর্কিত হওয়া উচিত।</p>' },
  { id: 'hsD-0ZsFbrza', type: 'code', language: 'html', code: '<p>My family and I visited The Epcot center this summer.</p>\n\n<aside>\n  <h4>Epcot Center</h4>\n  <p>The Epcot Center is a theme park in Disney World, Florida.</p>\n</aside>' },
  { id: 'Y4Hcwr7WyqWU', type: 'richtext', html: '<hr>' },
  { id: 'FVLrvwYjIWUF', text: 'HTML5 <figure> এবং <figcaption> এলিমেন্ট', type: 'heading', level: 2, anchor: 'html5-figure-and-figcaption-elements' },
  { id: 'OJ0KoDDC2ZPX', type: 'richtext', html: '<p>একটি ফিগার ক্যাপশনের উদ্দেশ্য হলো একটি ইমেজে ভিজ্যুয়াল ব্যাখ্যা যোগ করা।</p>\n<p>HTML5-এ, একটি ইমেজ এবং একটি ক্যাপশনকে একটি <code>&lt;figure&gt;</code> এলিমেন্টে একসাথে গ্রুপ করা যায়:</p>' },
  { id: 'gMnfMxKUaw9i', type: 'code', language: 'html', code: '<figure>\n  <img src="pic_trulli.jpg" alt="Trulli">\n  <figcaption>Fig1. - Trulli, Puglia, Italy.</figcaption>\n</figure>' },
  { id: '6ERvhMBdrekS', type: 'richtext', html: '<p><code>&lt;img&gt;</code> এলিমেন্ট ইমেজ নির্ধারণ করে, <code>&lt;figcaption&gt;</code> এলিমেন্ট ক্যাপশন নির্ধারণ করে।</p>\n<hr>' },
  { id: 'EYsUCD4e-7Xl', text: 'কেন সিমান্টিক এলিমেন্ট?', type: 'heading', level: 2, anchor: 'why-semantic-elements' },
  { id: 'vi_cYUKGa7aW', type: 'richtext', html: `<p>HTML4-এ, ডেভেলপাররা এলিমেন্ট স্টাইল করতে নিজেদের মতো id/class নাম ব্যবহার করতেন: header, top, bottom, footer, menu, navigation, main, container, content, article, sidebar, topnav ইত্যাদি।</p>
<p>এর ফলে সার্চ ইঞ্জিনের পক্ষে সঠিক ওয়েব পেজ কনটেন্ট শনাক্ত করা অসম্ভব হয়ে পড়ত।</p>
<p>নতুন HTML5 এলিমেন্ট (<code>&lt;header&gt;</code> <code>&lt;footer&gt;</code> <code>&lt;nav&gt;</code> <code>&lt;section&gt;</code> <code>&lt;article&gt;</code>) দিয়ে এটি সহজ হয়ে যাবে।</p>
<p>W3C অনুযায়ী, একটি সিমান্টিক ওয়েব: "অ্যাপ্লিকেশন, প্রতিষ্ঠান এবং কমিউনিটি জুড়ে ডেটা শেয়ার ও পুনর্ব্যবহার করার সুযোগ দেয়।"</p>
<hr>` },
  { id: 'LxQCuawKNEKA', text: 'HTML5-এ সিমান্টিক এলিমেন্ট', type: 'heading', level: 2, anchor: 'semantic-elements-in-html5' },
  { id: 'pzpujbst1NkR', type: 'richtext', html: '<p>নিচে HTML5-এর নতুন সিমান্টিক এলিমেন্টগুলোর একটি বর্ণানুক্রমিক তালিকা দেওয়া হলো।</p>\n<p>লিঙ্কগুলো আমাদের সম্পূর্ণ HTML5 রেফারেন্সে নিয়ে যাবে।</p>' },
]

const toc = [
  { id: 'what-are-semantic-elements', text: 'সিমান্টিক এলিমেন্ট কী?', level: 2 },
  { id: 'new-semantic-elements-in-html5', text: 'HTML5-এ নতুন সিমান্টিক এলিমেন্ট', level: 2 },
  { id: 'html5-section-element', text: 'HTML5 section> এলিমেন্ট', level: 2 },
  { id: 'html5-article-element', text: 'HTML5 <article> এলিমেন্ট', level: 2 },
  { id: 'nesting-article-in-section-or-vice-versa', text: '<section>-এর ভেতরে <article> নেস্ট করা, নাকি উল্টোটা?', level: 2 },
  { id: 'html5-header-element', text: 'HTML5 <header> এলিমেন্ট', level: 2 },
  { id: 'html5-footer-element', text: 'HTML5 <footer> এলিমেন্ট', level: 2 },
  { id: 'html5-nav-element', text: 'HTML5 <nav> এলিমেন্ট', level: 2 },
  { id: 'html5-aside-element', text: 'HTML5 <aside> এলিমেন্ট', level: 2 },
  { id: 'html5-figure-and-figcaption-elements', text: 'HTML5 <figure> এবং <figcaption> এলিমেন্ট', level: 2 },
  { id: 'why-semantic-elements', text: 'কেন সিমান্টিক এলিমেন্ট?', level: 2 },
  { id: 'semantic-elements-in-html5', text: 'HTML5-এ সিমান্টিক এলিমেন্ট', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('semantic-elements: 1/1 written')
