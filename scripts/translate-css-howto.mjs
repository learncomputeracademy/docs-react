import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'c24b5ef4-91ec-40e3-9120-36d21d2db2fd' // css/howto
const title = 'CSS কীভাবে ব্যবহার করবেন'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'External, internal ও inline স্টাইল শিট কীভাবে যোগ করবেন এবং CSS-এর ক্যাসকেডিং অর্ডার কীভাবে কাজ করে তা জানুন।'

const blocks = [
  { id: 'hQ4iEDieFqOD', type: 'richtext', html: '<hr>\n<p>ব্রাউজার যখন একটি স্টাইল শিট পড়ে, তখন এটি স্টাইল শিটের তথ্য অনুযায়ী HTML ডকুমেন্ট ফরম্যাট করবে।</p>\n<hr>' },
  { id: 'Zf4WGuVmfBTA', text: 'CSS যোগ করার তিনটি উপায়', type: 'heading', level: 2, anchor: 'three-ways-to-insert-css' },
  { id: 'bSXOEx_Itq4p', type: 'richtext', html: `<p>একটি স্টাইল শিট যোগ করার তিনটি উপায় আছে:</p>
<ul>
                                    <li>External স্টাইল শিট</li>
                                    <li>Internal স্টাইল শিট</li>
                                    <li>Inline স্টাইল</li>
                                </ul>
<hr>` },
  { id: 'C3dOQNEP8eH0', text: 'External স্টাইল শিট', type: 'heading', level: 2, anchor: 'external-style-sheet' },
  { id: '_Dazt5uU2ePC', type: 'richtext', html: '<p>একটি external স্টাইল শিট দিয়ে, শুধু একটি ফাইল পরিবর্তন করে আপনি পুরো ওয়েবসাইটের চেহারা পরিবর্তন করতে পারেন!</p>\n<p>প্রতিটি পেজে <code>&lt;link&gt;</code> এলিমেন্টের ভেতরে external স্টাইল শিট ফাইলের একটি রেফারেন্স থাকতে হবে।</p>\n<p><b>External স্টাইল একটি HTML পেজের <code>&lt;head&gt;</code> সেকশনের ভেতরে, <code>&lt;link&gt;</code> এলিমেন্টে নির্ধারণ করা হয়:</b></p>' },
  { id: 'J1LbKcz5I3w3', type: 'code', language: 'html', code: '<head>\n    <link rel="stylesheet" type="text/css" href="mystyle.css">\n</head>' },
  { id: 'bbfFYVAoOgAx', type: 'richtext', html: '<p>একটি external স্টাইল শিট যেকোনো টেক্সট এডিটরে লেখা যায়। ফাইলে কোনো HTML ট্যাগ থাকা উচিত নয়। স্টাইল শিট ফাইল অবশ্যই .css এক্সটেনশন দিয়ে সংরক্ষণ করতে হবে।</p>\n<p>"mystyle.css" ফাইলটি দেখতে এমন হয়:</p>' },
  { id: '1qq7ChWL1MyO', type: 'code', language: 'css', code: 'body {\n  background-color: lightblue;\n}\n\nh1 {\n  color: navy;\n  margin-left: 20px;\n}' },
  { id: 'O0MCq8K0MBHx', type: 'richtext', html: '<p><b>মনে রাখবেন:</b> প্রপার্টির মান এবং ইউনিটের মধ্যে স্পেস যোগ করবেন না (যেমন <code>margin-left: 20 px;</code>)। সঠিক উপায় হলো: <code>margin-left: 20px;</code></p>\n<hr>' },
  { id: '0ocjPS6yzqB0', text: 'Internal স্টাইল শিট', type: 'heading', level: 2, anchor: 'internal-style-sheet' },
  { id: 'ATtXw7tt_Xu1', type: 'richtext', html: '<p>একটি একক পেজের ইউনিক স্টাইল থাকলে একটি internal স্টাইল শিট ব্যবহার করা যেতে পারে।</p>\n<p><b>Internal স্টাইল একটি HTML পেজের &lt;head&gt; সেকশনের ভেতরে, &lt;style&gt; এলিমেন্টে নির্ধারণ করা হয়:</b></p>' },
  { id: 'n1nFwvRtdGJh', type: 'code', language: 'html', code: '<head>\n    <style>\n        body {\n          background-color: linen;\n        }\n        h1 {\n          color: maroon;\n          margin-left: 40px;\n        } \n    </style>\n</head>' },
  { id: 'oakpV2txEqAJ', type: 'richtext', html: '<hr>' },
  { id: '4Hm-ZOYEIBMB', text: 'Inline স্টাইল', type: 'heading', level: 2, anchor: 'inline-styles' },
  { id: 'Y_LrEA9Bx2ZP', type: 'richtext', html: '<p>একটি একক এলিমেন্টে ইউনিক স্টাইল প্রয়োগ করতে একটি inline স্টাইল ব্যবহার করা যেতে পারে।</p>\n<p>inline স্টাইল ব্যবহার করতে, সংশ্লিষ্ট এলিমেন্টে style অ্যাট্রিবিউট যোগ করুন। style অ্যাট্রিবিউটে যেকোনো CSS প্রপার্টি থাকতে পারে।</p>\n<p><b>Inline স্টাইল সংশ্লিষ্ট এলিমেন্টের "style" অ্যাট্রিবিউটের ভেতরে নির্ধারণ করা হয়:</b></p>' },
  { id: 'mBE4pgkoQRPD', type: 'code', language: 'html', code: '<h1 style="color:blue;margin-left:30px;">This is a heading</h1>' },
  { id: 'vnf0uRqklpgK', type: 'richtext', html: '<p class="note"><b>টিপস:</b> একটি inline স্টাইল স্টাইল শিটের অনেক সুবিধা হারায় (কনটেন্টকে প্রেজেন্টেশনের সাথে মিশিয়ে দিয়ে)। এই পদ্ধতি খুব কম ব্যবহার করুন।</p>\n<hr>' },
  { id: '9rIVtjAbQ5DM', text: 'একাধিক স্টাইল শিট', type: 'heading', level: 2, anchor: 'multiple-style-sheets' },
  { id: 'H0rPE2_-_IWG', type: 'richtext', html: '<p>একই সিলেক্টরের (এলিমেন্ট) জন্য বিভিন্ন স্টাইল শিটে কিছু প্রপার্টি নির্ধারণ করা থাকলে, সর্বশেষ পড়া স্টাইল শিটের মান ব্যবহার করা হবে।</p>\n<p>ধরে নিন একটি <b>external স্টাইল শিটে</b> &lt;h1&gt; এলিমেন্টের জন্য নিচের স্টাইল আছে:</p>' },
  { id: 'JX7h98wZbz-b', type: 'code', language: 'css', code: 'h1 {\n  color: navy;\n}' },
  { id: 'FXTIAnoupXvG', type: 'richtext', html: '<p>এরপর, ধরে নিন একটি <b>internal স্টাইল শিটেও</b> &lt;h1&gt; এলিমেন্টের জন্য নিচের স্টাইল আছে:</p>' },
  { id: 'TCB6ZxoVYaMZ', type: 'code', language: 'css', code: 'h1 {\n  color: orange;    \n}' },
  { id: 'hA5uxvNbWsaG', type: 'richtext', html: '<p>internal স্টাইলটি external স্টাইল শিটের লিঙ্কের <b>পরে</b> নির্ধারণ করা থাকলে, &lt;h1&gt; এলিমেন্ট "orange" হবে:</p>' },
  { id: 'LYCl2VFy-6Ly', type: 'code', language: 'html', code: '<head>\n    <link rel="stylesheet" type="text/css" href="mystyle.css">\n    <style>\n        h1 {\n          color: orange;\n        }\n    </style>\n</head>' },
  { id: 'FKtz7fq3_HDW', type: 'richtext', html: '<p>তবে, internal স্টাইলটি external স্টাইল শিটের লিঙ্কের <b>আগে</b> নির্ধারণ করা থাকলে, &lt;h1&gt; এলিমেন্ট "navy" হবে: </p>' },
  { id: 'B63C0FAKusBM', type: 'code', language: 'html', code: '<head>\n    <style>\n        h1 {\n          color: orange;\n        }\n    </style>\n    <link rel="stylesheet" type="text/css" href="mystyle.css">\n</head>' },
  { id: 'icfxc2XOmrXN', type: 'richtext', html: '<hr>' },
  { id: 'tHwG99cJEH6q', text: 'ক্যাসকেডিং অর্ডার', type: 'heading', level: 2, anchor: 'cascading-order' },
  { id: 'gi9ACr4Q-Iq_', type: 'richtext', html: `<p>একটি HTML এলিমেন্টের জন্য একাধিক স্টাইল নির্ধারিত থাকলে কোন স্টাইলটি ব্যবহার করা হবে?</p>
<p>একটি পেজের সব স্টাইল নিচের নিয়ম অনুযায়ী একটি নতুন "ভার্চুয়াল" স্টাইল শিটে "ক্যাসকেড" হবে, যেখানে নম্বর এক-এর অগ্রাধিকার সবচেয়ে বেশি:</p>
<ol>
                                    <li>Inline স্টাইল (একটি HTML এলিমেন্টের ভেতরে)</li>
                                    <li>External এবং internal স্টাইল শিট (head সেকশনে)</li>
                                    <li>ব্রাউজারের ডিফল্ট</li>
                                </ol>
<p>তাই, একটি <i>inline স্টাইলের অগ্রাধিকার সবচেয়ে বেশি</i>, এবং এটি external ও internal স্টাইল এবং ব্রাউজারের ডিফল্টকে ওভাররাইড করবে।</p>` },
]

const toc = [
  { id: 'three-ways-to-insert-css', text: 'CSS যোগ করার তিনটি উপায়', level: 2 },
  { id: 'external-style-sheet', text: 'External স্টাইল শিট', level: 2 },
  { id: 'internal-style-sheet', text: 'Internal স্টাইল শিট', level: 2 },
  { id: 'inline-styles', text: 'Inline স্টাইল', level: 2 },
  { id: 'multiple-style-sheets', text: 'একাধিক স্টাইল শিট', level: 2 },
  { id: 'cascading-order', text: 'ক্যাসকেডিং অর্ডার', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/howto: 1/1 written')
