import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'd34f5725-e507-43c3-8b23-7f7681674848' // html/forms
const title = 'HTML ফর্ম'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'HTML ফর্ম, input, action, method (GET/POST), name অ্যাট্রিবিউট এবং fieldset কীভাবে ব্যবহার করবেন তা জানুন।'

const blocks = [
  { id: 'e_H8RBHkS6Fu', type: 'richtext', html: '<hr>' },
  { id: '_xO5KGjflfnM', text: '<form> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-form-element' },
  { id: 'Y9Htls-VYtOZ', type: 'richtext', html: '<p>HTML <code>&lt;form&gt;</code> এলিমেন্ট এমন একটি ফর্ম নির্ধারণ করে, যা ব্যবহারকারীর ইনপুট সংগ্রহ করতে ব্যবহৃত হয়:</p>' },
  { id: '0pr-HH6VJsds', type: 'code', language: 'html', code: '<form>\n.\nform elements\n.\n</form>' },
  { id: 'LWc9MfEi9vic', type: 'richtext', html: `<p>HTML ফর্মের উদাহরণ:</p>
<div class="bg-gray p-3">
                                    <form action="/action_page.php" target="_blank">
                                      নামের প্রথম অংশ:<br>
                                      <input type="text" name="firstname" value="Mickey"><br>
                                      পদবি:<br>
                                      <input type="text" name="lastname" value="Mouse">
                                      <br><br>
                                      <input type="submit" value="জমা দিন">
                                    </form>
                                </div>
<p>একটি HTML ফর্মে <b>ফর্ম এলিমেন্ট</b> থাকে।</p>
<p>ফর্ম এলিমেন্ট বিভিন্ন ধরনের ইনপুট এলিমেন্ট, যেমন টেক্সট ফিল্ড, চেকবক্স, রেডিও বাটন, সাবমিট বাটন এবং আরও অনেক কিছু।</p>
<hr>` },
  { id: 'DNSb2nskiu10', text: '<input> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-input-element' },
  { id: 'GPvHSwO_2JkT', type: 'richtext', html: '<p><code>&lt;input&gt;</code> এলিমেন্ট সবচেয়ে গুরুত্বপূর্ণ ফর্ম এলিমেন্ট।</p>\n<p><code>&lt;input&gt;</code> এলিমেন্ট <b>type</b> অ্যাট্রিবিউটের উপর নির্ভর করে বিভিন্নভাবে প্রদর্শিত হতে পারে।</p>\n<p>এখানে কিছু উদাহরণ দেওয়া হলো:</p>' },
  { id: '90supEQPIUgI', type: 'table', header: ['Type', 'বিবরণ'], rows: [
    ['&lt;input type="text"&gt;', 'একটি এক-লাইনের টেক্সট ইনপুট ফিল্ড নির্ধারণ করে'],
    ['&lt;input type="radio"&gt;', 'একটি রেডিও বাটন নির্ধারণ করে (একাধিক বিকল্প থেকে একটি বেছে নেওয়ার জন্য)'],
    ['&lt;input type="submit"&gt;', 'একটি সাবমিট বাটন নির্ধারণ করে (ফর্ম জমা দেওয়ার জন্য)'],
  ] },
  { id: '-mnYa6t3S7P2', type: 'richtext', html: '<hr>' },
  { id: '9PWQq8rmez7i', text: 'টেক্সট ইনপুট', type: 'heading', level: 2, anchor: 'text-input' },
  { id: 'XWCqz1ROy34v', type: 'richtext', html: '<p><code>&lt;input type="text"&gt;</code> <b>টেক্সট ইনপুটের</b> জন্য একটি এক-লাইনের ইনপুট ফিল্ড নির্ধারণ করে।</p>' },
  { id: 'LC9t61D9kExk', type: 'code', language: 'html', code: '<form>\n    First name:<br>\n    <input type="text" name="firstname"><br>\n    Last name:<br>\n    <input type="text" name="lastname">\n</form>' },
  { id: 'SmWebM_8iPk6', type: 'richtext', html: `<p>ব্রাউজারে এটি এভাবে দেখাবে:</p>
<form>
                                    নামের প্রথম অংশ:<br>
                                    <input type="text" name="firstname"><br>
                                    পদবি:<br>
                                    <input type="text" name="lastname">
                                </form>
<p class="pt-3"><b>মনে রাখবেন:</b> ফর্মটি নিজে দৃশ্যমান নয়। এটাও লক্ষ্য করুন যে <u>একটি টেক্সট ফিল্ডের ডিফল্ট প্রস্থ 20 অক্ষর</u>।</p>
<hr>` },
  { id: 'DQAS5I-4HD-4', text: 'রেডিও বাটন ইনপুট', type: 'heading', level: 2, anchor: 'radio-button-input' },
  { id: 'mMfB6xC4r0uG', type: 'richtext', html: '<p><code>&lt;input type="radio"&gt;</code> একটি <b>রেডিও বাটন</b> নির্ধারণ করে।</p>\n<p>রেডিও বাটন ব্যবহারকারীকে সীমিত সংখ্যক বিকল্প থেকে ঠিক একটি বেছে নিতে দেয়:</p>' },
  { id: 'U_qKU-eJHmfG', type: 'code', language: 'html', code: '<form>\n    <input type="radio" name="gender" value="male" checked> Male<br>\n    <input type="radio" name="gender" value="female"> Female<br>\n    <input type="radio" name="gender" value="other"> Other\n</form>' },
  { id: 'rxrCEvknWNZr', type: 'richtext', html: `<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>
<form>
                                  <input type="radio" name="gender" value="male" checked=""> পুরুষ<br>
                                  <input type="radio" name="gender" value="female"> মহিলা<br>
                                  <input type="radio" name="gender" value="other"> অন্যান্য
                                </form>
<hr>` },
  { id: 'rHyosai-uAIm', text: 'সাবমিট বাটন', type: 'heading', level: 2, anchor: 'the-submit-button' },
  { id: '0J9-WqyLDJw0', type: 'richtext', html: '<p><code>&lt;input type="submit"&gt;</code> ফর্ম ডেটা একটি <b>ফর্ম-হ্যান্ডলারে</b> <b>জমা দেওয়ার</b> জন্য একটি বাটন নির্ধারণ করে।</p>\n<p>ফর্ম-হ্যান্ডলার সাধারণত একটি সার্ভার পেজ, যেখানে ইনপুট ডেটা প্রসেস করার একটি স্ক্রিপ্ট থাকে।</p>\n<p>ফর্মের <b>action</b> অ্যাট্রিবিউটে ফর্ম-হ্যান্ডলার উল্লেখ করা হয়:</p>' },
  { id: 'GRq0F65OBF_6', type: 'code', language: 'html', code: '<form action="/action_page.php">\n    First name:<br>\n    <input type="text" name="firstname" value="Mickey"><br>\n    Last name:<br>\n    <input type="text" name="lastname" value="Mouse"><br><br>\n    <input type="submit" value="Submit">\n</form>' },
  { id: 'V5vLBWPkZShl', type: 'richtext', html: `<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>
<form action="/">
                                    নামের প্রথম অংশ:<br>
                                    <input type="text" name="firstname" value="Mickey"><br>
                                    পদবি:<br>
                                    <input type="text" name="lastname" value="Mouse"><br><br>
                                    <input type="submit" value="জমা দিন">
                                </form>
<hr>` },
  { id: 'CvTBx5649lwh', text: 'action অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-action-attribute' },
  { id: 'TqpVCQt-N5HC', type: 'richtext', html: '<p><code>action</code> অ্যাট্রিবিউট ফর্ম জমা দেওয়ার সময় কী কাজ করা হবে তা নির্ধারণ করে।</p>\n<p>সাধারণত, ব্যবহারকারী সাবমিট বাটনে ক্লিক করলে ফর্ম ডেটা সার্ভারের একটি ওয়েব পেজে পাঠানো হয়।</p>\n<p>উপরের উদাহরণে, ফর্ম ডেটা সার্ভারের "/action_page.php" নামের একটি পেজে পাঠানো হয়। এই পেজে একটি সার্ভার-সাইড স্ক্রিপ্ট থাকে, যা ফর্ম ডেটা প্রসেস করে:</p>' },
  { id: 'J_CB4hA8pLm1', type: 'code', language: 'html', code: '<form action="/action_page.php">' },
  { id: 'Ljy3qdyLYZMj', type: 'richtext', html: '<p><code>action</code> অ্যাট্রিবিউট বাদ দেওয়া হলে, action-এর মান বর্তমান পেজে সেট হয়ে যায়।</p>\n<hr>' },
  { id: 'hzSSwAHkU10c', text: 'target অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-target-attribute' },
  { id: 'TbQ9k5AB_kKL', type: 'richtext', html: '<p><code>target</code> অ্যাট্রিবিউট নির্ধারণ করে যে জমা দেওয়া ফলাফল একটি নতুন ব্রাউজার ট্যাবে, একটি ফ্রেমে, নাকি বর্তমান উইন্ডোতে খুলবে।</p>\n<p>ডিফল্ট মান হলো "<code>_self</code>", যার মানে ফর্মটি বর্তমান উইন্ডোতেই জমা হবে।</p>\n<p>ফর্মের ফলাফল একটি নতুন ব্রাউজার ট্যাবে খুলতে, "<code>_blank</code>" মান ব্যবহার করুন:</p>' },
  { id: 'K7sZjAbB6r0w', type: 'code', language: 'html', code: '<form action="/action_page.php" target="_blank">' },
  { id: '5IrcOMyFy3Me', type: 'richtext', html: '<p>অন্যান্য বৈধ মান হলো "<code>_parent</code>", "<code>_top</code>", অথবা একটি iframe-এর নাম নির্দেশক কোনো নাম।</p>\n<hr>' },
  { id: 'CEtzQ_29LykY', text: 'method অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-method-attribute' },
  { id: 'zSyuG3UwqRv-', type: 'richtext', html: '<p><code>method</code> অ্যাট্রিবিউট ফর্ম ডেটা জমা দেওয়ার সময় কোন HTTP মেথড (<b>GET</b> বা <b>POST</b>) ব্যবহার করা হবে তা নির্ধারণ করে:</p>' },
  { id: 'LGjy7GnabMAI', type: 'code', language: 'html', code: '<form action="/action_page.php" method="get">' },
  { id: 'vjtjw-eACS9f', type: 'richtext', html: '<p>অথবা:</p>' },
  { id: 'ANwDwESzJtsA', type: 'code', language: 'html', code: '<form action="/action_page.php" method="post">' },
  { id: 'rlGm-j9ay6R7', type: 'richtext', html: '<hr>' },
  { id: '4gJUby9JJmtU', text: 'কখন GET ব্যবহার করবেন?', type: 'heading', level: 2, anchor: 'when-to-use-get' },
  { id: 'isImbxNRLf86', type: 'richtext', html: '<p>ফর্ম ডেটা জমা দেওয়ার ডিফল্ট মেথড হলো GET।</p>\n<p>তবে, GET ব্যবহার করলে, জমা দেওয়া ফর্ম ডেটা <b>পেজের অ্যাড্রেস ফিল্ডে দৃশ্যমান</b> হবে:</p>' },
  { id: '_0Eis9snLA74', type: 'code', language: 'html', code: '/action_page.php?firstname=Mickey&lastname=Mouse' },
  { id: 'oshKz119WtBV', type: 'richtext', html: `<p><b>GET সম্পর্কে কিছু কথা:</b></p>
<ul>
                                    <li>নাম/মান জোড়া আকারে URL-এ ফর্ম-ডেটা যুক্ত করে</li>
                                    <li>একটি URL-এর দৈর্ঘ্য সীমিত (প্রায় 3000 অক্ষর)</li>
                                    <li>স্পর্শকাতর ডেটা পাঠাতে কখনো GET ব্যবহার করবেন না! (এটি URL-এ দৃশ্যমান হবে)</li>
                                    <li>এমন ফর্ম সাবমিশনের জন্য উপযোগী, যেখানে ব্যবহারকারী ফলাফল বুকমার্ক করতে চান</li>
                                    <li>নিরাপত্তাহীন ডেটার জন্য GET ভালো, যেমন Google-এর কোয়েরি স্ট্রিং</li>
                                </ul>
<hr>` },
  { id: 'YWQ6Ce7-Cems', text: 'কখন POST ব্যবহার করবেন?', type: 'heading', level: 2, anchor: 'when-to-use-post' },
  { id: '1KSBUaVBxBF2', type: 'richtext', html: `<p>ফর্ম ডেটায় স্পর্শকাতর বা ব্যক্তিগত তথ্য থাকলে সবসময় POST ব্যবহার করুন। POST মেথড জমা দেওয়া ফর্ম ডেটা পেজের অ্যাড্রেস ফিল্ডে দেখায় না।</p>
<p><b>POST সম্পর্কে কিছু কথা:</b></p>
<ul>
                                    <li>POST-এর কোনো সাইজ সীমাবদ্ধতা নেই, এবং এটি প্রচুর পরিমাণ ডেটা পাঠাতে ব্যবহার করা যায়।</li>
                                    <li>POST দিয়ে ফর্ম সাবমিশন বুকমার্ক করা যায় না</li>
                                </ul>
<hr>` },
  { id: 'IisGAHZ2X4eg', text: 'name অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-name-attribute' },
  { id: 'Met9kNNqSMd6', type: 'richtext', html: '<p>প্রতিটি ইনপুট ফিল্ড জমা দেওয়ার জন্য তার একটি <code>name</code> অ্যাট্রিবিউট থাকতে হবে।</p>\n<p><code>name</code> অ্যাট্রিবিউট বাদ দেওয়া হলে, সেই ইনপুট ফিল্ডের ডেটা একেবারেই পাঠানো হবে না।</p>\n<p>এই উদাহরণে শুধু "Last name" ইনপুট ফিল্ডটি জমা হবে:</p>' },
  { id: 'gJsMmXD18fin', type: 'code', language: 'html', code: '<form action="/action_page.php">\n    First name:<br>\n    <input type="text" value="Mickey"><br>\n    Last name:<br>\n    <input type="text" name="lastname" value="Mouse"><br><br>\n    <input type="submit" value="Submit">\n</form>' },
  { id: 'liWT3ooVcoy8', type: 'richtext', html: '<hr>' },
  { id: 'K7Mht8pftLOO', text: '<fieldset> দিয়ে ফর্ম ডেটা গ্রুপ করা', type: 'heading', level: 2, anchor: 'grouping-form-data-with-fieldset' },
  { id: '3FY2oSXPBT0F', type: 'richtext', html: '<p>একটি ফর্মে সম্পর্কিত ডেটা গ্রুপ করতে <code>&lt;fieldset&gt;</code> এলিমেন্ট ব্যবহার করা হয়।</p>\n<p><code>&lt;legend&gt;</code> এলিমেন্ট <code>&lt;fieldset&gt;</code> এলিমেন্টের জন্য একটি ক্যাপশন নির্ধারণ করে।</p>' },
  { id: '8fg2IfOEEpNr', type: 'code', language: 'html', code: '<form action="/action_page.php">\n    <fieldset>\n        <legend>Personal information:</legend>\n        First name:<br>\n        <input type="text" name="firstname" value="Mickey"><br>\n        Last name:<br>\n        <input type="text" name="lastname" value="Mouse"><br><br>\n        <input type="submit" value="Submit">\n    </fieldset>\n</form>' },
  { id: 'AM8awK0PKRY1', type: 'richtext', html: `<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>
<form action="/action_page.php">
                                  <fieldset>
                                    <legend>ব্যক্তিগত তথ্য:</legend>
                                    নামের প্রথম অংশ:<br>
                                    <input type="text" name="firstname" value="Mickey"><br>
                                    পদবি:<br>
                                    <input type="text" name="lastname" value="Mouse"><br><br>
                                    <input type="submit" value="জমা দিন">
                                  </fieldset>
                                </form>
<hr>
<p>এখানে সব <code>&lt;form&gt;</code> অ্যাট্রিবিউটের তালিকা দেওয়া হলো:</p>` },
  { id: 'Voteo7jgB1yG', type: 'table', header: ['অ্যাট্রিবিউট', 'বিবরণ'], rows: [
    ['accept-charset', 'জমা দেওয়া ফর্মে ব্যবহৃত charset নির্ধারণ করে (ডিফল্ট: পেজের charset)।'],
    ['action', 'ফর্ম কোথায় জমা দিতে হবে তার একটি ঠিকানা (url) নির্ধারণ করে (ডিফল্ট: যে পেজ থেকে জমা দেওয়া হচ্ছে)।'],
    ['autocomplete', 'ব্রাউজার ফর্ম অটোকমপ্লিট করবে কিনা তা নির্ধারণ করে (ডিফল্ট: on)।'],
    ['enctype', 'জমা দেওয়া ডেটার এনকোডিং নির্ধারণ করে (ডিফল্ট: url-encoded)।'],
    ['method', 'ফর্ম জমা দেওয়ার সময় ব্যবহৃত HTTP মেথড নির্ধারণ করে (ডিফল্ট: GET)।'],
    ['name', 'ফর্ম শনাক্ত করতে ব্যবহৃত একটি নাম নির্ধারণ করে (DOM ব্যবহারের জন্য: document.forms.name)।'],
    ['novalidate', 'নির্ধারণ করে যে ব্রাউজার ফর্মটি ভ্যালিডেট করবে না।'],
    ['target', 'action অ্যাট্রিবিউটের ঠিকানার টার্গেট নির্ধারণ করে (ডিফল্ট: _self)।'],
  ] },
  { id: 'TSIBOCNUZ_Ho', type: 'richtext', html: '<p>পরবর্তী চ্যাপ্টারগুলোতে ফর্ম অ্যাট্রিবিউট সম্পর্কে আরও জানবেন।</p>' },
]

const toc = [
  { id: 'the-form-element', text: '<form> এলিমেন্ট', level: 2 },
  { id: 'the-input-element', text: '<input> এলিমেন্ট', level: 2 },
  { id: 'text-input', text: 'টেক্সট ইনপুট', level: 2 },
  { id: 'radio-button-input', text: 'রেডিও বাটন ইনপুট', level: 2 },
  { id: 'the-submit-button', text: 'সাবমিট বাটন', level: 2 },
  { id: 'the-action-attribute', text: 'action অ্যাট্রিবিউট', level: 2 },
  { id: 'the-target-attribute', text: 'target অ্যাট্রিবিউট', level: 2 },
  { id: 'the-method-attribute', text: 'method অ্যাট্রিবিউট', level: 2 },
  { id: 'when-to-use-get', text: 'কখন GET ব্যবহার করবেন?', level: 2 },
  { id: 'when-to-use-post', text: 'কখন POST ব্যবহার করবেন?', level: 2 },
  { id: 'the-name-attribute', text: 'name অ্যাট্রিবিউট', level: 2 },
  { id: 'grouping-form-data-with-fieldset', text: '<fieldset> দিয়ে ফর্ম ডেটা গ্রুপ করা', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('forms: 1/1 written')
