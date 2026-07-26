import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'c98fd669-6be1-4455-b5a4-37d4f9b8f6d6' // css/text
const title = 'CSS টেক্সট'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'রঙ, অ্যালাইনমেন্ট, ডেকোরেশন, ইনডেন্টেশন, স্পেসিং এবং শ্যাডোসহ CSS দিয়ে টেক্সট স্টাইল করা শিখুন।'

const blocks = [
  { id: 'GIu9vHtjASAX', type: 'richtext', html: `<hr>
<p style="text-indent:50px;text-align:justify;letter-spacing:3px;">এই টেক্সটটি কিছু টেক্সট ফরম্যাটিং প্রপার্টি দিয়ে স্টাইল করা হয়েছে। হেডিং-এ text-align, text-transform, এবং color প্রপার্টি ব্যবহার করা হয়েছে।
প্যারাগ্রাফটি ইনডেন্ট করা, অ্যালাইন করা, এবং অক্ষরগুলোর মধ্যে ফাঁক নির্দিষ্ট করা আছে। এই রঙিন
<a style="text-decoration:none;color:#008CBA;" target="_blank" href="tryit.asp?filename=trycss_text">"নিজে চেষ্টা করুন"</a> লিংক থেকে আন্ডারলাইন সরিয়ে দেওয়া হয়েছে।</p>
<hr>` },
  { id: 'BB2xmF7yZsfi', text: 'টেক্সটের রঙ', type: 'heading', level: 2, anchor: 'text-color' },
  { id: 'UYYfXjtoZK0q', type: 'richtext', html: `<p>টেক্সটের রঙ নির্ধারণ করতে <code>color</code> প্রপার্টি ব্যবহার করা হয়।
                                রঙ নির্দিষ্ট করা যায় এভাবে:</p>
<ul>
                                <li>একটি রঙের নাম দিয়ে - যেমন "red"</li>
                                <li>একটি HEX ভ্যালু দিয়ে - যেমন "#ff0000"</li>
                                <li>একটি RGB ভ্যালু দিয়ে - যেমন "rgb(255,0,0)"</li>
                                </ul>
<p>সম্ভাব্য সব রঙের একটি সম্পূর্ণ তালিকার জন্য <a href="#">CSS Color Values</a> দেখুন।</p>
<p>একটি পেজের ডিফল্ট টেক্সট রঙ body সিলেক্টরে নির্ধারিত হয়।</p>` },
  { id: 'GRFnqyYIOt2S', type: 'code', language: 'css', code: 'body {\n  color: blue;\n}\nh1 {\n  color: green;\n}' },
  { id: 'ar-uSAQAY8By', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b> W3C কমপ্লায়েন্ট CSS-এর জন্য: <code>color</code> প্রপার্টি নির্ধারণ করলে, অবশ্যই <code>background-color</code>-ও নির্ধারণ করতে হবে।</p>\n<hr>' },
  { id: 'NhG46-rv9HGs', text: 'টেক্সট অ্যালাইনমেন্ট', type: 'heading', level: 2, anchor: 'text-alignment' },
  { id: '9-ctjJSDvM0r', type: 'richtext', html: `<p>একটি টেক্সটের অনুভূমিক অ্যালাইনমেন্ট নির্ধারণ করতে <code>text-align</code> প্রপার্টি ব্যবহার করা হয়।</p>
<p>একটি টেক্সট বামে বা ডানে অ্যালাইন করা, মাঝ বরাবর, বা জাস্টিফাই করা যায়।</p>
<p>নিচের উদাহরণে মাঝ বরাবর অ্যালাইন করা, এবং বামে ও ডানে অ্যালাইন করা টেক্সট দেখানো হয়েছে
                                (টেক্সটের দিক left-to-right হলে ডিফল্ট বাম অ্যালাইনমেন্ট, এবং right-to-left হলে ডিফল্ট
                                ডান অ্যালাইনমেন্ট):</p>` },
  { id: 'CZ3omJ4XtvwH', type: 'code', language: 'css', code: 'h1 {\n  text-align: center;\n}\nh2 {\n  text-align: left;\n}\nh3 {\n  text-align: right;\n}' },
  { id: 'AorGiCeazbs7', type: 'richtext', html: '<p><code>text-align</code> প্রপার্টি "justify" সেট করা হলে, প্রতিটি লাইন এমনভাবে প্রসারিত হয় যাতে প্রতিটি লাইনের প্রস্থ সমান হয়, এবং বাম ও ডান মার্জিন সোজা থাকে (ম্যাগাজিন ও সংবাদপত্রের মতো):</p>' },
  { id: 'OHC8AoaRcpop', type: 'code', language: 'css', code: 'div {\n  text-align: justify;\n}' },
  { id: 'QTta0vmBV-JB', type: 'richtext', html: '<hr>' },
  { id: 'c7QBSpseevi9', text: 'টেক্সট ডেকোরেশন', type: 'heading', level: 2, anchor: 'text-decoration' },
  { id: 'lpQ74JvU2SQU', type: 'richtext', html: '<p>টেক্সট থেকে ডেকোরেশন সেট বা মুছে ফেলার জন্য <code>text-decoration</code> প্রপার্টি ব্যবহার করা হয়।</p>\n<p>লিংক থেকে আন্ডারলাইন সরাতে প্রায়ই <code>text-decoration: none;</code> ভ্যালু ব্যবহার করা হয়:</p>' },
  { id: 'cd1g0XGqyLU7', type: 'code', language: 'css', code: 'a {\n  text-decoration: none;\n}' },
  { id: 'DqutKKi83_nO', type: 'richtext', html: '<p>টেক্সট ডেকোরেট করতে অন্যান্য <code>text-decoration</code> ভ্যালুও ব্যবহার করা হয়:</p>' },
  { id: 'Ewy1KOdZ48r4', type: 'code', language: 'css', code: 'h1 {\n  text-decoration: overline;\n}\nh2 {\n  text-decoration: line-through;\n}\nh3 {\n  text-decoration: underline;\n}' },
  { id: 'd5gP1n7FydeT', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b> যে টেক্সট লিংক নয়, তাতে আন্ডারলাইন ব্যবহার না করাই ভালো, কারণ এতে পাঠক প্রায়ই বিভ্রান্ত হন।</p>\n<hr>' },
  { id: '9xnTC-oLavpQ', text: 'টেক্সট ট্রান্সফরমেশন', type: 'heading', level: 2, anchor: 'text-transformation' },
  { id: 'ODhkxo4O-E-T', type: 'richtext', html: `<p>একটি টেক্সটে uppercase ও lowercase অক্ষর নির্দিষ্ট করতে <code>text-transform</code> প্রপার্টি ব্যবহার করা হয়।</p>
<p>এটি সবকিছু uppercase বা lowercase অক্ষরে রূপান্তর করতে, বা
                            প্রতিটি শব্দের প্রথম অক্ষর বড় হাতের করতে ব্যবহার করা যায়:</p>` },
  { id: 'YawfKrAEOdIx', type: 'code', language: 'css', code: 'p.uppercase {\n  text-transform: uppercase;\n}\np.lowercase {\n  text-transform: lowercase;\n}\np.capitalize {\n  text-transform: capitalize;\n}' },
  { id: '1vUcva89pNib', type: 'richtext', html: '<hr>' },
  { id: 'tOMAQ4BJibqr', text: 'টেক্সট ইনডেন্টেশন', type: 'heading', level: 2, anchor: 'text-indentation' },
  { id: 'Iu2mRH_PP_IQ', type: 'richtext', html: '<p>একটি টেক্সটের প্রথম লাইনের ইনডেন্টেশন নির্দিষ্ট করতে <code>text-indent</code> প্রপার্টি ব্যবহার করা হয়:</p>' },
  { id: 'spVq4vRdSzoy', type: 'code', language: 'css', code: 'p {\n  text-indent: 50px;\n}' },
  { id: 'CMqy5iQDxP9A', type: 'richtext', html: '<hr>' },
  { id: '6c5Les1FiK_g', text: 'লেটার স্পেসিং', type: 'heading', level: 2, anchor: 'letter-spacing' },
  { id: 'Ui9rx486kjBT', type: 'richtext', html: '<p>একটি টেক্সটের অক্ষরগুলোর মধ্যে ফাঁক নির্দিষ্ট করতে <code>letter-spacing</code> প্রপার্টি ব্যবহার করা হয়।</p>\n<p>নিচের উদাহরণে অক্ষরগুলোর মধ্যে ফাঁক কীভাবে বাড়ানো বা কমানো যায় তা দেখানো হয়েছে:</p>' },
  { id: 'zBNQ-O6kKx2a', type: 'code', language: 'css', code: 'h1 {\n  letter-spacing: 3px;\n}\nh2 {\n  letter-spacing: -3px;\n}' },
  { id: 'tEUqTLKvETIo', type: 'richtext', html: '<hr>' },
  { id: 'UKllkGYrxEIV', text: 'লাইন হাইট', type: 'heading', level: 2, anchor: 'line-height' },
  { id: 'l546LyJ3tJxB', type: 'richtext', html: '<p>লাইনগুলোর মধ্যে ফাঁক নির্দিষ্ট করতে <code>line-height</code> প্রপার্টি ব্যবহার করা হয়:</p>' },
  { id: '-2MygBHEjppy', type: 'code', language: 'css', code: 'p.small {\n  line-height: 0.8;\n}\np.big {\n  line-height: 1.8;\n}' },
  { id: 'mcVmI1B9Z1yD', type: 'richtext', html: '<hr>' },
  { id: '9CBc9n1cuy6q', text: 'টেক্সটের দিক', type: 'heading', level: 2, anchor: 'text-direction' },
  { id: 'mrBPfaNk7bVQ', type: 'richtext', html: '<p>একটি এলিমেন্টের টেক্সটের দিক পরিবর্তন করতে <code>direction</code> প্রপার্টি ব্যবহার করা হয়:</p>' },
  { id: 'uChuey_9trDR', type: 'code', language: 'css', code: 'p {\n  direction: rtl;\n}' },
  { id: 'h_aUeqgU6MAp', type: 'richtext', html: '<hr>' },
  { id: 'YutK9tWlDpFw', text: 'ওয়ার্ড স্পেসিং', type: 'heading', level: 2, anchor: 'word-spacing' },
  { id: 'HiJC-PVi1T0l', type: 'richtext', html: `<p>একটি টেক্সটের শব্দগুলোর মধ্যে ফাঁক নির্দিষ্ট করতে
                            <code>word-spacing</code> প্রপার্টি ব্যবহার করা হয়।</p>
<p>নিচের উদাহরণে শব্দগুলোর মধ্যে ফাঁক কীভাবে বাড়ানো বা কমানো যায়
                            তা দেখানো হয়েছে:</p>` },
  { id: 'fE4F6pbNuIpc', type: 'code', language: 'css', code: 'h1 {\n  word-spacing: 10px;\n}\nh2 {\n  word-spacing: -5px;\n}' },
  { id: 'iJBT9lTkpqxj', type: 'richtext', html: '<hr>' },
  { id: 'Rtf-DwQzcIgn', text: 'টেক্সট শ্যাডো', type: 'heading', level: 2, anchor: 'text-shadow' },
  { id: 'BMTlG2qZ2Jrm', type: 'richtext', html: '<p><code>text-shadow</code> প্রপার্টি টেক্সটে শ্যাডো যোগ করে।</p>\n<p>নিচের উদাহরণে অনুভূমিক শ্যাডোর অবস্থান (3px), উলম্ব শ্যাডোর অবস্থান (2px) এবং শ্যাডোর রঙ (লাল) নির্দিষ্ট করা হয়েছে:</p>' },
  { id: 'vNoshse71jPE', type: 'code', language: 'css', code: 'h1 {\n  text-shadow: 3px 2px red;\n}' },
  { id: 'ocfkbh3o0rWm', type: 'richtext', html: '<hr>' },
  { id: 'TLCO1VBbPSvq', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
    ['color', 'টেক্সটের রঙ সেট করে'],
    ['direction', 'টেক্সটের দিক/লেখার দিক নির্দিষ্ট করে'],
    ['letter-spacing', 'একটি টেক্সটের অক্ষরগুলোর মধ্যে ফাঁক বাড়ায় বা কমায়'],
    ['line-height', 'লাইনের উচ্চতা সেট করে'],
    ['text-align', 'টেক্সটের অনুভূমিক অ্যালাইনমেন্ট নির্দিষ্ট করে'],
    ['text-decoration', 'টেক্সটে যোগ করা ডেকোরেশন নির্দিষ্ট করে'],
    ['text-indent', 'একটি টেক্সট-ব্লকের প্রথম লাইনের ইনডেন্টেশন নির্দিষ্ট করে'],
    ['text-shadow', 'টেক্সটে যোগ করা শ্যাডো ইফেক্ট নির্দিষ্ট করে'],
    ['text-transform', 'টেক্সটের ক্যাপিটালাইজেশন নিয়ন্ত্রণ করে'],
    ['text-overflow', 'ওভারফ্লো হওয়া কনটেন্ট যা প্রদর্শিত হয় না, তা ব্যবহারকারীকে কীভাবে জানানো উচিত তা নির্দিষ্ট করে'],
    ['unicode-bidi', 'একই ডকুমেন্টে একাধিক ভাষা সমর্থন করার জন্য টেক্সট ওভাররাইড করা উচিত কিনা তা সেট বা রিটার্ন করতে direction প্রপার্টির সাথে একত্রে ব্যবহার করা হয়'],
    ['vertical-align', 'একটি এলিমেন্টের উলম্ব অ্যালাইনমেন্ট সেট করে'],
    ['white-space', 'একটি এলিমেন্টের ভেতরের white-space কীভাবে হ্যান্ডেল হবে তা নির্দিষ্ট করে'],
    ['word-spacing', 'একটি টেক্সটের শব্দগুলোর মধ্যে ফাঁক বাড়ায় বা কমায়'],
  ] },
]

const toc = [
  { id: 'text-color', text: 'টেক্সটের রঙ', level: 2 },
  { id: 'text-alignment', text: 'টেক্সট অ্যালাইনমেন্ট', level: 2 },
  { id: 'text-decoration', text: 'টেক্সট ডেকোরেশন', level: 2 },
  { id: 'text-transformation', text: 'টেক্সট ট্রান্সফরমেশন', level: 2 },
  { id: 'text-indentation', text: 'টেক্সট ইনডেন্টেশন', level: 2 },
  { id: 'letter-spacing', text: 'লেটার স্পেসিং', level: 2 },
  { id: 'line-height', text: 'লাইন হাইট', level: 2 },
  { id: 'text-direction', text: 'টেক্সটের দিক', level: 2 },
  { id: 'word-spacing', text: 'ওয়ার্ড স্পেসিং', level: 2 },
  { id: 'text-shadow', text: 'টেক্সট শ্যাডো', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/text: 1/1 written')
