import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'c6caff7d-43a2-48ba-8b65-82f2e2a6ac5b' // css/pseudo-classes
const title = 'CSS সিউডো ক্লাস'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = ':hover, :first-child, :lang সহ CSS সিউডো-ক্লাস কী এবং কীভাবে ব্যবহার করবেন তা জানুন।'

const blocks = [
  { id: 'vUukKa8qUYaG', type: 'richtext', html: '<hr>' },
  { id: 'Vw5lZwJEV8BB', text: 'সিউডো-ক্লাস কী?', type: 'heading', level: 2, anchor: 'what-are-pseudo-classes' },
  { id: 'GF1R6opb7scS', type: 'richtext', html: `<p>একটি এলিমেন্টের একটি বিশেষ স্টেট নির্ধারণ করতে সিউডো-ক্লাস ব্যবহার করা হয়।</p>
<p>উদাহরণস্বরূপ, এটি ব্যবহার করা যায়:</p>
<ul>
                                    <li>ব্যবহারকারী মাউস নিয়ে গেলে একটি এলিমেন্ট স্টাইল করতে</li>
                                    <li>দেখা এবং না-দেখা লিঙ্ক আলাদাভাবে স্টাইল করতে</li>
                                    <li>ফোকাস পেলে একটি এলিমেন্ট স্টাইল করতে</li>
                                </ul>
<hr>` },
  { id: 'dQ1mXljjLZoH', text: 'সিনট্যাক্স', type: 'heading', level: 2, anchor: 'syntax' },
  { id: 'mW3KQHry-WzG', type: 'richtext', html: '<p>সিউডো-ক্লাসের সিনট্যাক্স:</p>' },
  { id: '8pMdIYpKzaB3', type: 'code', language: 'css', code: 'selector:pseudo-class {\n  property:value;\n}' },
  { id: '6m9B7HSxzc-3', type: 'richtext', html: '<hr>' },
  { id: 'G2-B2VOmVbfH', text: 'অ্যাঙ্কর সিউডো-ক্লাস', type: 'heading', level: 2, anchor: 'anchor-pseudo-classes' },
  { id: 'zFCW3emgTJRk', type: 'richtext', html: '<p>লিঙ্ক বিভিন্নভাবে প্রদর্শিত হতে পারে:</p>' },
  { id: 'LhUbJq6gQI3Y', type: 'code', language: 'css', code: '/* না-দেখা লিঙ্ক */\na:link {\n  color: #FF0000;\n}\n/* দেখা লিঙ্ক */\na:visited {\n  color: #00FF00;\n}\n/* মাউস ওভার লিঙ্ক */\na:hover {\n  color: #FF00FF;\n}\n/* সিলেক্টেড লিঙ্ক */\na:active {\n  color: #0000FF;\n}' },
  { id: '_YQP7w46fpPa', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b> কার্যকর হতে <code>a:hover</code>-কে CSS ডেফিনিশনে অবশ্যই <code>a:link</code> এবং <code>a:visited</code>-এর পরে আসতে হবে! কার্যকর হতে <code>a:active</code>-কে CSS ডেফিনিশনে অবশ্যই <code>a:hover</code>-এর পরে আসতে হবে! সিউডো-ক্লাসের নাম কেস-সেনসিটিভ নয়।</p>\n<hr>' },
  { id: 'TTyWWvF3ZISe', text: 'সিউডো-ক্লাস এবং CSS ক্লাস', type: 'heading', level: 2, anchor: 'pseudo-classes-and-css-classes' },
  { id: 'nTprrBf5jjIx', type: 'richtext', html: '<p>সিউডো-ক্লাস CSS ক্লাসের সাথে একত্রে ব্যবহার করা যায়:</p>\n<p>উদাহরণের লিঙ্কের উপর হোভার করলে, এর রঙ পরিবর্তিত হবে:</p>' },
  { id: '2jqk3nb93KKE', type: 'code', language: 'css', code: 'a.highlight:hover {\n  color: #ff0000;\n}' },
  { id: 'zBINWcMNen15', type: 'richtext', html: '<hr>' },
  { id: 'fb5bT2TPCe0w', text: '<div>-এ হোভার', type: 'heading', level: 2, anchor: 'hover-on-div' },
  { id: '2yM4gw3JZSXI', type: 'richtext', html: '<p>একটি &lt;div&gt; এলিমেন্টে <code>:hover</code> সিউডো-ক্লাস ব্যবহারের একটি উদাহরণ:</p>' },
  { id: 'oOX7rXtuvgW-', type: 'code', language: 'css', code: 'div:hover {\n  background-color: blue;\n}' },
  { id: 'IGC_8vu8WX1w', type: 'richtext', html: '<hr>' },
  { id: 'JaZbdr6XUBAR', text: 'সহজ টুলটিপ হোভার', type: 'heading', level: 2, anchor: 'simple-tooltip-hover' },
  { id: 'c3qWo5TidLj6', type: 'richtext', html: '<p>একটি &lt;p&gt; এলিমেন্ট দেখাতে (টুলটিপের মতো) একটি &lt;div&gt; এলিমেন্টের উপর হোভার করুন:</p>\n<span>&lt;p&gt; এলিমেন্ট দেখতে আমার উপর হোভার করুন।</span>\n<p class="p-4">তাদা! আমি এখানে!</p>' },
  { id: 'McmaXUN7-Dj6', type: 'code', language: 'css', code: 'p {\n  display: none;\n  background-color: yellow;\n  padding: 20px;\n}\ndiv:hover p {\n  display: block;\n}' },
  { id: 'WE6mDAFFdsml', type: 'richtext', html: '<hr>' },
  { id: 'C4uEI7fV52R5', text: 'CSS - :first-child সিউডো-ক্লাস', type: 'heading', level: 2, anchor: 'css---the-first-child-pseudo-class' },
  { id: 'z8yoBWB9N8bI', type: 'richtext', html: '<p><code>:first-child</code> সিউডো-ক্লাস এমন একটি নির্দিষ্ট এলিমেন্টের সাথে মেলে, যা অন্য একটি এলিমেন্টের প্রথম চাইল্ড।</p>' },
  { id: 'OKpuwo0IjWGA', text: 'প্রথম <p> এলিমেন্টের সাথে মেলানো', type: 'heading', level: 2, anchor: 'match-the-first-p-element' },
  { id: 'b-6NoslDm_UY', type: 'richtext', html: '<p>নিচের উদাহরণে, সিলেক্টরটি যেকোনো এলিমেন্টের প্রথম চাইল্ড এমন যেকোনো &lt;p&gt; এলিমেন্টের সাথে মেলে:</p>' },
  { id: '8eRnDThVvd_x', type: 'code', language: 'css', code: 'p:first-child {\n  color: blue;\n}' },
  { id: 'xGtzyHAA_rxF', type: 'richtext', html: '<hr>' },
  { id: 'pG0mQcHZRBGb', text: 'সব <p> এলিমেন্টে প্রথম <i> এলিমেন্টের সাথে মেলানো', type: 'heading', level: 2, anchor: 'match-the-first-i-element-in-all-p-elements' },
  { id: '-USgwjOVZTJ3', type: 'richtext', html: '<p>নিচের উদাহরণে, সিলেক্টরটি সব &lt;p&gt; এলিমেন্টের প্রথম &lt;i&gt; এলিমেন্টের সাথে মেলে:</p>' },
  { id: 'eeZFkISLkH-A', type: 'code', language: 'css', code: 'p i:first-child {\n  color: blue;\n}' },
  { id: 'vIZRaqHdSebA', type: 'richtext', html: '<hr>' },
  { id: 'XhR_9ct9UNms', text: 'সব প্রথম-চাইল্ড <p> এলিমেন্টের সব <i> এলিমেন্টের সাথে মেলানো', type: 'heading', level: 2, anchor: 'match-all-i-elements-in-all-first-child-p-elements' },
  { id: 'D5tx1BIPoLa_', type: 'richtext', html: '<p>নিচের উদাহরণে, সিলেক্টরটি অন্য একটি এলিমেন্টের প্রথম চাইল্ড এমন &lt;p&gt; এলিমেন্টগুলোর সব &lt;i&gt; এলিমেন্টের সাথে মেলে:</p>' },
  { id: '6XFDMa164cKw', type: 'code', language: 'css', code: 'p:first-child i {\n  color: blue;\n}' },
  { id: 'hwl_pFOIQT7z', type: 'richtext', html: '<hr>' },
  { id: 'rDej9pobdgDN', text: 'CSS - :lang সিউডো-ক্লাস', type: 'heading', level: 2, anchor: 'css---the-lang-pseudo-class' },
  { id: 'SioioQAa2B9m', type: 'richtext', html: '<p><code class="w3-codespan">:lang</code> সিউডো-ক্লাস আপনাকে বিভিন্ন ভাষার জন্য বিশেষ নিয়ম নির্ধারণ করতে দেয়।</p>\n<p>নিচের উদাহরণে, <code class="w3-codespan">:lang</code> lang="no" থাকা &lt;q&gt; এলিমেন্টের জন্য উদ্ধৃতি চিহ্ন নির্ধারণ করে:</p>' },
  { id: 'jTTbKEjxeaw4', type: 'code', language: 'html', code: '<html>\n    <head>\n        <style>\n            q:lang(no) {\n              quotes: "~" "~";\n            }\n        </style>\n    </head>\n\n    <body>\n\n        <p>Some text <q lang="no">A quote in a paragraph</q> Some text.</p>\n    </body>\n</html>' },
  { id: 'pFNQAC61KY7L', type: 'richtext', html: '<hr>' },
  { id: 'giqeSWuD6MrA', text: 'সব CSS সিউডো ক্লাস', type: 'heading', level: 2, anchor: 'all-css-pseudo-classes' },
  { id: 'j-7Lls7uxuZm', type: 'table', header: ['সিলেক্টর', 'উদাহরণ', 'উদাহরণের বিবরণ'], rows: [
    [':active', 'a:active', 'সক্রিয় লিঙ্ক সিলেক্ট করে'],
    [':checked', 'input:checked', 'প্রতিটি চেক করা &lt;input&gt; এলিমেন্ট সিলেক্ট করে'],
    [':disabled', 'input:disabled', 'প্রতিটি নিষ্ক্রিয় &lt;input&gt; এলিমেন্ট সিলেক্ট করে'],
    [':empty', 'p:empty', 'চাইল্ড নেই এমন প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে'],
    [':enabled', 'input:enabled', 'প্রতিটি সক্রিয় &lt;input&gt; এলিমেন্ট সিলেক্ট করে'],
    [':first-child', 'p:first-child', 'প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে যা তার প্যারেন্টের প্রথম চাইল্ড'],
    [':first-of-type', 'p:first-of-type', 'প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে যা তার প্যারেন্টের প্রথম &lt;p&gt; এলিমেন্ট'],
    [':focus', 'input:focus', 'ফোকাস আছে এমন &lt;input&gt; এলিমেন্ট সিলেক্ট করে'],
    [':hover', 'a:hover', 'মাউস ওভার হলে লিঙ্ক সিলেক্ট করে'],
    [':in-range', 'input:in-range', 'নির্দিষ্ট রেঞ্জের মধ্যে মানসহ &lt;input&gt; এলিমেন্ট সিলেক্ট করে'],
    [':invalid', 'input:invalid', 'অবৈধ মানসহ সব &lt;input&gt; এলিমেন্ট সিলেক্ট করে'],
    [':lang(language)', 'p:lang(it)', '"it" দিয়ে শুরু হওয়া lang অ্যাট্রিবিউট মানসহ প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে'],
    [':last-child', 'p:last-child', 'প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে যা তার প্যারেন্টের সর্বশেষ চাইল্ড'],
    [':last-of-type', 'p:last-of-type', 'প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে যা তার প্যারেন্টের সর্বশেষ &lt;p&gt; এলিমেন্ট'],
    [':link', 'a:link', 'সব না-দেখা লিঙ্ক সিলেক্ট করে'],
    [':not(selector)', ':not(p)', '&lt;p&gt; এলিমেন্ট নয় এমন প্রতিটি এলিমেন্ট সিলেক্ট করে'],
    [':nth-child(n)', 'p:nth-child(2)', 'প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে যা তার প্যারেন্টের দ্বিতীয় চাইল্ড'],
    [':nth-last-child(n)', 'p:nth-last-child(2)', 'প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে যা সর্বশেষ চাইল্ড থেকে গণনা করে তার প্যারেন্টের দ্বিতীয় চাইল্ড'],
    [':nth-last-of-type(n)', 'p:nth-last-of-type(2)', 'প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে যা সর্বশেষ চাইল্ড থেকে গণনা করে তার প্যারেন্টের দ্বিতীয় &lt;p&gt; এলিমেন্ট'],
    [':nth-of-type(n)', 'p:nth-of-type(2)', 'প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে যা সর্বশেষ চাইল্ড থেকে গণনা করে তার প্যারেন্টের দ্বিতীয় &lt;p&gt; এলিমেন্ট'],
    [':only-of-type', 'p:only-of-type', 'প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে যা তার প্যারেন্টের দ্বিতীয় &lt;p&gt; এলিমেন্ট'],
    [':only-child', 'p:only-child', 'প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে যা তার প্যারেন্টের একমাত্র &lt;p&gt; এলিমেন্ট'],
    [':optional', 'input:optional', 'প্রতিটি &lt;p&gt; এলিমেন্ট সিলেক্ট করে যা তার প্যারেন্টের একমাত্র চাইল্ড'],
    [':out-of-range', 'input:out-of-range', '"required" অ্যাট্রিবিউট নেই এমন &lt;input&gt; এলিমেন্ট সিলেক্ট করে'],
    [':read-only', 'input:read-only', '"readonly" অ্যাট্রিবিউট নির্ধারিত থাকা &lt;input&gt; এলিমেন্ট সিলেক্ট করে'],
    [':read-write', 'input:read-write', '"readonly" অ্যাট্রিবিউট নেই এমন &lt;input&gt; এলিমেন্ট সিলেক্ট করে'],
    [':required', 'input:required', '"required" অ্যাট্রিবিউট নির্ধারিত থাকা &lt;input&gt; এলিমেন্ট সিলেক্ট করে'],
    [':root', 'root', 'ডকুমেন্টের রুট এলিমেন্ট সিলেক্ট করে'],
    [':target', '#news:target', 'বর্তমান সক্রিয় #news এলিমেন্ট সিলেক্ট করে (সেই অ্যাঙ্কর নামসহ একটি URL-এ ক্লিক করা হলে)'],
    [':valid', 'input:valid', 'বৈধ মানসহ সব &lt;input&gt; এলিমেন্ট সিলেক্ট করে'],
    [':visited', 'a:visited', 'সব দেখা লিঙ্ক সিলেক্ট করে'],
  ] },
]

const toc = [
  { id: 'what-are-pseudo-classes', text: 'সিউডো-ক্লাস কী?', level: 2 },
  { id: 'syntax', text: 'সিনট্যাক্স', level: 2 },
  { id: 'anchor-pseudo-classes', text: 'অ্যাঙ্কর সিউডো-ক্লাস', level: 2 },
  { id: 'pseudo-classes-and-css-classes', text: 'সিউডো-ক্লাস এবং CSS ক্লাস', level: 2 },
  { id: 'hover-on-div', text: '<div>-এ হোভার', level: 2 },
  { id: 'simple-tooltip-hover', text: 'সহজ টুলটিপ হোভার', level: 2 },
  { id: 'css---the-first-child-pseudo-class', text: 'CSS - :first-child সিউডো-ক্লাস', level: 2 },
  { id: 'match-the-first-p-element', text: 'প্রথম <p> এলিমেন্টের সাথে মেলানো', level: 2 },
  { id: 'match-the-first-i-element-in-all-p-elements', text: 'সব <p> এলিমেন্টে প্রথম <i> এলিমেন্টের সাথে মেলানো', level: 2 },
  { id: 'match-all-i-elements-in-all-first-child-p-elements', text: 'সব প্রথম-চাইল্ড <p> এলিমেন্টের সব <i> এলিমেন্টের সাথে মেলানো', level: 2 },
  { id: 'css---the-lang-pseudo-class', text: 'CSS - :lang সিউডো-ক্লাস', level: 2 },
  { id: 'all-css-pseudo-classes', text: 'সব CSS সিউডো ক্লাস', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/pseudo-classes: 1/1 written')
