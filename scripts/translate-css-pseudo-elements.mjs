import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '1d18897b-341f-4075-b9d7-8b4a950211bd' // css/pseudo-elements
const title = 'CSS সিউডো এলিমেন্ট'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = '::first-line, ::first-letter, ::before, ::after, ::selection সহ CSS সিউডো-এলিমেন্ট কীভাবে ব্যবহার করবেন তা জানুন।'

const blocks = [
  { id: 'v_bE_4i3E_c6', type: 'richtext', html: '<hr>' },
  { id: 'aNkqSR8tpdGB', text: 'সিউডো-এলিমেন্ট কী?', type: 'heading', level: 2, anchor: 'what-are-pseudo-elements' },
  { id: 'POttWwCh2Xyh', type: 'richtext', html: `<p>একটি এলিমেন্টের নির্দিষ্ট অংশ স্টাইল করতে CSS সিউডো-এলিমেন্ট ব্যবহার করা হয়।</p>
<p>উদাহরণস্বরূপ, এটি ব্যবহার করা যায়:</p>
<ul>
                                    <li>একটি এলিমেন্টের প্রথম অক্ষর, বা লাইন স্টাইল করতে</li>
                                    <li>একটি এলিমেন্টের কনটেন্টের আগে বা পরে কনটেন্ট যোগ করতে </li>
                                </ul>
<hr>` },
  { id: '2qSuc2QdqT5I', text: 'সিনট্যাক্স', type: 'heading', level: 2, anchor: 'syntax' },
  { id: 'bA5ZnDqC8oCj', type: 'richtext', html: '<p>সিউডো-এলিমেন্টের সিনট্যাক্স:</p>' },
  { id: 'rgTeTSjFyEav', type: 'code', language: 'css', code: 'selector::pseudo-element {\n  property:value;\n}' },
  { id: 'J0z57WD20eWt', type: 'richtext', html: `<div class="note">
                                <p><strong>ডাবল কোলন নোটেশন লক্ষ্য করুন - </strong> <code>::first-line</code> বনাম <code>:first-line</code><br><br>CSS3-এ সিউডো-এলিমেন্টের জন্য সিঙ্গেল-কোলন নোটেশনের বদলে ডাবল কোলন ব্যবহার শুরু হয়। এটি ছিল <strong>সিউডো-ক্লাস</strong> এবং <strong>সিউডো-এলিমেন্টের</strong> মধ্যে পার্থক্য করার জন্য W3C-এর একটি প্রচেষ্টা।<br><br>CSS2 এবং CSS1-এ সিউডো-ক্লাস এবং সিউডো-এলিমেন্ট উভয়ের জন্যই সিঙ্গেল-কোলন সিনট্যাক্স ব্যবহার করা হতো।<br><br>ব্যাকওয়ার্ড কম্প্যাটিবিলিটির জন্য, CSS2 এবং CSS1 সিউডো-এলিমেন্টের জন্য সিঙ্গেল-কোলন সিনট্যাক্স গ্রহণযোগ্য।</p>
                                </div>
<hr>` },
  { id: 'z7vjJASA14F2', text: '::first-line সিউডো-এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-first-line-pseudo-element' },
  { id: 'UAT5nzi_Vsga', type: 'richtext', html: '<p>একটি টেক্সটের প্রথম লাইনে একটি বিশেষ স্টাইল যোগ করতে <code>::first-line</code> সিউডো-এলিমেন্ট ব্যবহার করা হয়।</p>\n<p>নিচের উদাহরণে সব &lt;p&gt; এলিমেন্টের টেক্সটের প্রথম লাইন ফরম্যাট করা হয়েছে:</p>' },
  { id: 'HJJPvEYnlGsg', type: 'code', language: 'css', code: 'p::first-line {\n  color: #ff0000;\n  font-variant: small-caps;\n}' },
  { id: 'w_NGM5J8jxEz', type: 'richtext', html: `<p><b>মনে রাখবেন:</b> ::first-line সিউডো-এলিমেন্ট শুধুমাত্র ব্লক-লেভেল এলিমেন্টে প্রয়োগ করা যায়।</p>
<p>::first-line সিউডো-এলিমেন্টে নিচের প্রপার্টিগুলো প্রযোজ্য:</p>
<ul>
                                    <li>font প্রপার্টি</li>
                                    <li>color প্রপার্টি</li>
                                    <li>background প্রপার্টি</li>
                                    <li>word-spacing</li>
                                    <li>letter-spacing</li>
                                    <li>text-decoration</li>
                                    <li>vertical-align</li>
                                    <li>text-transform</li>
                                    <li>line-height</li>
                                    <li>clear</li>
                                </ul>
<hr>` },
  { id: '85vcK_hZiaVD', text: '::first-letter সিউডো-এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-first-letter-pseudo-element' },
  { id: 'TXWSEknOkXtT', type: 'richtext', html: '<p>একটি টেক্সটের প্রথম অক্ষরে একটি বিশেষ স্টাইল যোগ করতে <code>::first-letter</code> সিউডো-এলিমেন্ট ব্যবহার করা হয়।</p>\n<p>নিচের উদাহরণে সব &lt;p&gt; এলিমেন্টের টেক্সটের প্রথম অক্ষর ফরম্যাট করা হয়েছে: </p>' },
  { id: 'RkHLhcEhDdak', type: 'code', language: 'css', code: 'p::first-letter {\n  color: #ff0000;\n  font-size: xx-large;\n}' },
  { id: 'dKnT7e-ANfi_', type: 'richtext', html: `<p><strong>মনে রাখবেন:</strong> <code>::first-letter</code> সিউডো-এলিমেন্ট শুধুমাত্র ব্লক-লেভেল এলিমেন্টে প্রয়োগ করা যায়।</p>
<p>::first-letter সিউডো-এলিমেন্টে নিচের প্রপার্টিগুলো প্রযোজ্য: </p>
<ul>
                                  <li> font প্রপার্টি</li>
                                  <li> color প্রপার্টি </li>
                                  <li> background প্রপার্টি</li>
                                  <li>margin প্রপার্টি</li>
                                  <li>padding প্রপার্টি</li>
                                  <li>border প্রপার্টি</li>
                                  <li>text-decoration</li>
                                  <li>vertical-align (শুধু "float" যদি "none" হয়)</li>
                                  <li>text-transform</li>
                                  <li>line-height</li>
                                  <li>float</li>
                                  <li>clear</li>
                                </ul>
<hr>` },
  { id: 'yuAvzOUJiSVS', text: 'সিউডো-এলিমেন্ট এবং CSS ক্লাস', type: 'heading', level: 2, anchor: 'pseudo-elements-and-css-classes' },
  { id: 'cOXP67X2xuYd', type: 'richtext', html: '<p>সিউডো-এলিমেন্ট CSS ক্লাসের সাথে একত্রে ব্যবহার করা যায়:</p>' },
  { id: 'Rzlcq9Up1Ho4', type: 'code', language: 'css', code: 'p.intro::first-letter {\n  color: #ff0000;\n  font-size:200%;\n}' },
  { id: '2vdLDfYJVTjr', type: 'richtext', html: '<p class="intro">এটি একটি ভূমিকা।</p>\n<p>এটি কিছু টেক্সটসহ একটি প্যারাগ্রাফ। এমনকি আরও কিছু টেক্সট।</p>\n<p>উপরের উদাহরণটি class="intro"-যুক্ত প্যারাগ্রাফের প্রথম অক্ষর লাল এবং বড় আকারে প্রদর্শন করবে।</p>\n<hr>' },
  { id: 'W9E4uRhxD2Zd', text: 'একাধিক সিউডো-এলিমেন্ট', type: 'heading', level: 2, anchor: 'multiple-pseudo-elements' },
  { id: 'ApCDlN8RBc98', type: 'richtext', html: `<p>একাধিক সিউডো-এলিমেন্টও একত্রে ব্যবহার করা যায়।</p>
<p>নিচের উদাহরণে, একটি প্যারাগ্রাফের প্রথম অক্ষর লাল এবং xx-large ফন্ট সাইজে হবে। প্রথম লাইনের বাকি অংশ নীল এবং
                                small-caps-এ হবে। প্যারাগ্রাফের বাকি অংশ ডিফল্ট ফন্ট সাইজ ও রঙে থাকবে:</p>` },
  { id: '7-oEOzvL2Y0X', type: 'code', language: 'css', code: 'p::first-letter {\n  color: #ff0000;\n  font-size: xx-large;\n}\np::first-line {\n  color: #0000ff;\n  font-variant: small-caps;\n}' },
  { id: 'xdirBdzUpM_2', type: 'richtext', html: '<hr>' },
  { id: 'dTtdWc41TW4v', text: 'CSS - ::before সিউডো-এলিমেন্ট', type: 'heading', level: 2, anchor: 'css---the-before-pseudo-element' },
  { id: 'PhCvGX4DMSfC', type: 'richtext', html: '<p>একটি এলিমেন্টের কনটেন্টের আগে কিছু কনটেন্ট যোগ করতে <code>::before</code> সিউডো-এলিমেন্ট ব্যবহার করা যায়।</p>\n<p>নিচের উদাহরণে প্রতিটি &lt;h1&gt; এলিমেন্টের কনটেন্টের আগে একটি ইমেজ যোগ করা হয়েছে:</p>' },
  { id: 'vUYPhv-W5U6s', type: 'code', language: 'css', code: 'h1::before {\n  content: url(smiley.gif);\n}' },
  { id: 'bHGmVz2XokqF', type: 'richtext', html: '<hr>' },
  { id: 'LRN5Fxb794XT', text: 'CSS - ::after সিউডো-এলিমেন্ট', type: 'heading', level: 2, anchor: 'css---the-after-pseudo-element' },
  { id: '-YXxXsWAY_1e', type: 'richtext', html: '<p>একটি এলিমেন্টের কনটেন্টের পরে কিছু কনটেন্ট যোগ করতে <code>::after</code> সিউডো-এলিমেন্ট ব্যবহার করা যায়।</p>' },
  { id: 'VSxctSMqeegY', type: 'code', language: 'css', code: 'h1::after {\n  content: url(smiley.gif);\n}' },
  { id: 'JqWfgbox5tOz', type: 'richtext', html: '<hr>' },
  { id: 'YVXledVA5G-f', text: 'CSS - ::selection সিউডো-এলিমেন্ট', type: 'heading', level: 2, anchor: 'css---the-selection-pseudo-element' },
  { id: 'BXGkrtfVlk2E', type: 'richtext', html: '<p><code>::selection</code> সিউডো-এলিমেন্ট একটি এলিমেন্টের সেই অংশের সাথে মেলে, যা একজন ব্যবহারকারী সিলেক্ট করেছেন।</p>\n<p><code>::selection</code>-এ নিচের CSS প্রপার্টি প্রয়োগ করা যায়: <code>color</code>, <code>background</code>, <code>cursor</code>, এবং <code>outline</code>।</p>\n<p>নিচের উদাহরণে সিলেক্ট করা টেক্সট একটি হলুদ ব্যাকগ্রাউন্ডে লাল করা হয়েছে:</p>' },
  { id: 'c0LCWpjwm5yi', type: 'code', language: 'css', code: '::selection {\n  color: red; \n  background: yellow;\n}' },
  { id: 'XegIpTZhyjkS', type: 'richtext', html: '<hr>' },
  { id: '0M7142EU2hEH', text: 'সব CSS সিউডো এলিমেন্ট', type: 'heading', level: 2, anchor: 'all-css-pseudo-elements' },
  { id: 'xJS8GP-OwSsa', type: 'table', header: ['সিলেক্টর', 'উদাহরণ', 'উদাহরণের বিবরণ'], rows: [
    ['::after', 'p::after', 'প্রতিটি &lt;p&gt; এলিমেন্টের কনটেন্টের পরে কিছু যোগ করে'],
    ['::before', 'p::before', 'প্রতিটি &lt;p&gt; এলিমেন্টের কনটেন্টের আগে কিছু যোগ করে'],
    ['::first-letter', 'p::first-letter', 'প্রতিটি &lt;p&gt; এলিমেন্টের প্রথম অক্ষর সিলেক্ট করে'],
    ['::first-line', 'p::first-line', 'প্রতিটি &lt;p&gt; এলিমেন্টের প্রথম লাইন সিলেক্ট করে'],
    ['::selection', 'p::selection', 'একজন ব্যবহারকারী সিলেক্ট করেছেন এমন একটি এলিমেন্টের অংশ সিলেক্ট করে'],
  ] },
]

const toc = [
  { id: 'what-are-pseudo-elements', text: 'সিউডো-এলিমেন্ট কী?', level: 2 },
  { id: 'syntax', text: 'সিনট্যাক্স', level: 2 },
  { id: 'the-first-line-pseudo-element', text: '::first-line সিউডো-এলিমেন্ট', level: 2 },
  { id: 'the-first-letter-pseudo-element', text: '::first-letter সিউডো-এলিমেন্ট', level: 2 },
  { id: 'pseudo-elements-and-css-classes', text: 'সিউডো-এলিমেন্ট এবং CSS ক্লাস', level: 2 },
  { id: 'multiple-pseudo-elements', text: 'একাধিক সিউডো-এলিমেন্ট', level: 2 },
  { id: 'css---the-before-pseudo-element', text: 'CSS - ::before সিউডো-এলিমেন্ট', level: 2 },
  { id: 'css---the-after-pseudo-element', text: 'CSS - ::after সিউডো-এলিমেন্ট', level: 2 },
  { id: 'css---the-selection-pseudo-element', text: 'CSS - ::selection সিউডো-এলিমেন্ট', level: 2 },
  { id: 'all-css-pseudo-elements', text: 'সব CSS সিউডো এলিমেন্ট', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/pseudo-elements: 1/1 written')
