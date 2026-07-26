import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '4eda3ace-5546-43c8-8ad6-e184e92a8b1d' // html/form-attributes
const title = 'HTML ফর্ম অ্যাট্রিবিউট'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'value, readonly, disabled, required, pattern, placeholder সহ সব HTML ফর্ম ও input অ্যাট্রিবিউট শিখুন।'

const blocks = [
  { id: 'yOy6z149iqHr', type: 'richtext', html: '<hr>' },
  { id: 'UDN7RbNVDIwf', text: 'value অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-value-attribute' },
  { id: 'MImW3G8vSJaf', type: 'richtext', html: '<p><code>value</code> অ্যাট্রিবিউট একটি ইনপুট ফিল্ডের প্রাথমিক মান নির্ধারণ করে:</p>' },
  { id: 'gp5Vu0srS5mP', type: 'code', language: 'html', code: '<form action="">\n    First name:<br>\n    <input type="text" name="firstname" value="John">\n</form>' },
  { id: 'spssya-hff56', type: 'richtext', html: '<hr>' },
  { id: 'dKb2zZBYUBTK', text: 'readonly অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-readonly-attribute' },
  { id: 'SzG9dgmCVaVQ', type: 'richtext', html: '<p><code>readonly</code> অ্যাট্রিবিউট নির্ধারণ করে যে ইনপুট ফিল্ডটি শুধু পড়ার জন্য (পরিবর্তন করা যাবে না):</p>' },
  { id: 'QyiRNwFmQgKx', type: 'code', language: 'html', code: '<form action="">\n    First name:<br>\n    <input type="text" name="firstname" value="John" readonly>\n</form>' },
  { id: 'PsQsPOkz2Qyb', type: 'richtext', html: '<hr>' },
  { id: 'OsoD_k-oK2df', text: 'disabled অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-disabled-attribute' },
  { id: 'uz_dtmWgx-5L', type: 'richtext', html: '<p><code>disabled</code> অ্যাট্রিবিউট নির্ধারণ করে যে ইনপুট ফিল্ডটি নিষ্ক্রিয়।</p>\n<p>একটি নিষ্ক্রিয় ইনপুট ফিল্ড <u>ব্যবহারযোগ্য বা ক্লিকযোগ্য নয়</u>, এবং ফর্ম জমা দেওয়ার সময় এর মান পাঠানো হবে না:</p>' },
  { id: 'aXyCxN38jzCK', type: 'code', language: 'html', code: '<form action="">\n    First name:<br>\n    <input type="text" name="firstname" value="John" disabled>\n</form>' },
  { id: 'OKrb4P-5uCqU', type: 'richtext', html: '<hr>' },
  { id: 'OnjjF9Z5_4RK', text: 'size অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-size-attribute' },
  { id: 'ft3yZQ-Wqi_a', type: 'richtext', html: '<p><code>size</code> অ্যাট্রিবিউট ইনপুট ফিল্ডের আকার (অক্ষরের সংখ্যায়) নির্ধারণ করে:</p>' },
  { id: 'zzlCqgRyJiT5', type: 'code', language: 'html', code: '<form action="">\n    First name:<br>\n    <input type="text" name="firstname" value="John" size="40">\n</form>' },
  { id: 's98Srv8qb7wB', type: 'richtext', html: '<hr>' },
  { id: 'ea1YpMmv_xm7', text: 'maxlength অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-maxlength-attribute' },
  { id: 'LEiETLhwo7e-', type: 'richtext', html: '<p><code>maxlength</code> অ্যাট্রিবিউট ইনপুট ফিল্ডের সর্বোচ্চ অনুমোদিত দৈর্ঘ্য নির্ধারণ করে:</p>' },
  { id: 'oVqlzpagb25y', type: 'code', language: 'html', code: '<form action="">  \n    First name:<br>\n    <input type="text" name="firstname" maxlength="10">\n</form>' },
  { id: 'bDQOqwgyuAau', type: 'richtext', html: `<code>maxlength</code>
<p></p>
<p><code>maxlength</code> অ্যাট্রিবিউট কোনো ফিডব্যাক দেয় না। ব্যবহারকারীকে সতর্ক করতে চাইলে, আপনাকে JavaScript কোড লিখতে হবে।</p>
<p><b>মনে রাখবেন:</b> ইনপুট রেস্ট্রিকশন সম্পূর্ণ নির্ভরযোগ্য নয়, এবং JavaScript দিয়ে অবৈধ ইনপুট দেওয়ার অনেক উপায় আছে। ইনপুট নিরাপদভাবে সীমাবদ্ধ করতে হলে, রিসিভারকেও (সার্ভার) এটি যাচাই করতে হবে!
                                </p>
<hr>` },
  { id: 'vVynTHhKimnr', text: 'HTML5 অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'html5-attributes' },
  { id: 'eVjhIHOvMa-R', type: 'richtext', html: `<p>HTML5-এ <code>&lt;input&gt;</code>-এর জন্য নিচের অ্যাট্রিবিউটগুলো যোগ করা হয়েছে:</p>
<ul>
                                    <li>autocomplete</li>
                                    <li>autofocus</li>
                                    <li>form</li>
                                    <li>formaction</li>
                                    <li>formenctype</li>
                                    <li>formmethod</li>
                                    <li>formnovalidate</li>
                                    <li>formtarget</li>
                                    <li>height and width</li>
                                    <li>list</li>
                                    <li>min and max</li>
                                    <li>multiple</li>
                                    <li>pattern (regexp)</li>
                                    <li>placeholder</li>
                                    <li>required</li>
                                    <li>step</li>
                                </ul>
<p>এবং <code>&lt;form&gt;</code>-এর জন্য নিচের অ্যাট্রিবিউটগুলো:</p>
<ul>
                                    <li>autocomplete</li>
                                    <li>novalidate</li>
                                </ul>
<hr>` },
  { id: 'ixnFBN6jdf5J', text: 'autocomplete অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-autocomplete-attribute' },
  { id: 'nXvJ1o4Pr6ls', type: 'richtext', html: '<p><code>autocomplete</code> অ্যাট্রিবিউট নির্ধারণ করে যে একটি ফর্ম বা ইনপুট ফিল্ডের অটোকমপ্লিট চালু নাকি বন্ধ থাকবে।</p>\n<p>অটোকমপ্লিট চালু থাকলে, ব্যবহারকারী আগে যে মানগুলো দিয়েছিলেন তার ভিত্তিতে ব্রাউজার স্বয়ংক্রিয়ভাবে ইনপুট মান সম্পূর্ণ করে দেয়।</p>\n<p><b>টিপস:</b> ফর্মের জন্য অটোকমপ্লিট "চালু" এবং নির্দিষ্ট কিছু ইনপুট ফিল্ডের জন্য "বন্ধ" রাখা সম্ভব, অথবা এর উল্টোটাও।</p>\n<p><code>autocomplete</code> অ্যাট্রিবিউট <code>&lt;form&gt;</code> এবং নিচের <code>&lt;input&gt;</code> টাইপগুলোর সাথে কাজ করে: text, search, url, tel, email, password, datepickers, range, এবং color।</p>' },
  { id: '4nz9B-J4mxBL', type: 'code', language: 'html', code: '<form action="" autocomplete="on">\n    First name:<input type="text" name="fname"><br>\n    Last name: <input type="text" name="lname"><br>\n    E-mail: <input type="email" name="email" autocomplete="off"><br>\n    <input type="submit">\n</form>' },
  { id: 'xjz7BRogu38y', type: 'richtext', html: '<p><b>টিপস:</b> কিছু ব্রাউজারে এটি কাজ করার জন্য আপনাকে অটোকমপ্লিট ফাংশন সক্রিয় করতে হতে পারে।</p>\n<hr>' },
  { id: 'NHqEeKVJJuUA', text: 'novalidate অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-novalidate-attribute' },
  { id: '855NHTBcJhzO', type: 'richtext', html: '<p><code>novalidate</code> একটি <code>&lt;form&gt;</code> অ্যাট্রিবিউট।</p>\n<p>এটি থাকলে, novalidate নির্ধারণ করে যে ফর্ম জমা দেওয়ার সময় ডেটা ভ্যালিডেট করা হবে না।</p>' },
  { id: 'ON9NUl-RFU-s', type: 'code', language: 'html', code: '<form action="" novalidate>\n    E-mail: <input type="email" name="user_email">\n    <input type="submit">\n</form>' },
  { id: 'QweQRXYCbm4H', type: 'richtext', html: '<hr>' },
  { id: 'ZFfBnlWa_Pv5', text: 'autofocus অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-autofocus-attribute' },
  { id: '-kRTLL9mcKMI', type: 'richtext', html: '<p><code>autofocus</code> অ্যাট্রিবিউট নির্ধারণ করে যে পেজ লোড হওয়ার সময় ইনপুট ফিল্ডটি স্বয়ংক্রিয়ভাবে ফোকাস পাবে।</p>\n<p>পেজ লোড হওয়ার সময় "First name" ইনপুট ফিল্ডটি স্বয়ংক্রিয়ভাবে ফোকাস পাক:</p>' },
  { id: 'c1Ka05HBAlJt', type: 'code', language: 'html', code: '<form action="">\n    First name: <input type="text" name="fname" autofocus>\n</form>' },
  { id: 'a1l7g1VIvWSH', type: 'richtext', html: '<hr>' },
  { id: 'Mna4rhXTWxeW', text: 'form অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-form-attribute' },
  { id: 'mnh27kqROJ5Y', type: 'richtext', html: '<p><code>form</code> অ্যাট্রিবিউট নির্ধারণ করে যে একটি <code>&lt;input&gt;</code> এলিমেন্ট এক বা একাধিক কোন ফর্মের অন্তর্গত।</p>\n<p>HTML ফর্মের বাইরে অবস্থিত একটি ইনপুট ফিল্ড (তবুও যা ফর্মের অংশ):</p>' },
  { id: 'G0cKfTWVwQQZ', type: 'code', language: 'html', code: '<form action="" id="form1">\n    First name: <input type="text" name="fname"><br>\n    <input type="submit" value="Submit">\n</form>\nLast name: <input type="text" name="lname" form="form1">' },
  { id: 'LMowpnf629UE', type: 'richtext', html: '<hr>' },
  { id: 'HjSmRi2omC_L', text: 'formaction অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-formaction-attribute' },
  { id: 'M5SQ96Cyb_Nt', type: 'richtext', html: '<p><code>formaction</code> অ্যাট্রিবিউট এমন একটি ফাইলের URL নির্ধারণ করে, যা ফর্ম জমা দেওয়ার সময় ইনপুট কন্ট্রোল প্রসেস করবে।</p>\n<p>formaction অ্যাট্রিবিউট <code>&lt;form&gt;</code> এলিমেন্টের action অ্যাট্রিবিউটকে ওভাররাইড করে।</p>\n<p>formaction অ্যাট্রিবিউট <code>type="submit"</code> এবং <code>type="image"</code>-এর সাথে ব্যবহার করা হয়</p>\n<p>ভিন্ন ভিন্ন action-সহ দুটি সাবমিট বাটনযুক্ত একটি HTML ফর্ম:</p>' },
  { id: 'Vg30UtDk-Bkz', type: 'code', language: 'html', code: '<form action="">\n  First name: <input type="text" name="fname"><br>\n  Last name: <input type="text" name="lname"><br>\n  <input type="submit" value="Submit"><br>\n  <input type="submit" formaction="/action_page2.php"\n  value="Submit as admin">\n</form>' },
  { id: 'X8mPo6dwaMvS', type: 'richtext', html: '<hr>' },
  { id: 'fSVx4o5R61gU', text: 'formenctype অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-formenctype-attribute' },
  { id: '0_RoU5h4ouTG', type: 'richtext', html: '<p><code>formenctype</code> অ্যাট্রিবিউট নির্ধারণ করে ফর্ম জমা দেওয়ার সময় ডেটা কীভাবে এনকোড করা হবে (শুধুমাত্র method="post" যুক্ত ফর্মের জন্য)।</p>\n<p>formenctype অ্যাট্রিবিউট <code>&lt;form&gt;</code> এলিমেন্টের enctype অ্যাট্রিবিউটকে ওভাররাইড করে।</p>\n<p>formenctype অ্যাট্রিবিউট <code>type="submit"</code> এবং <code>type="image"</code>-এর সাথে ব্যবহার করা হয়।</p>\n<p>ডিফল্টভাবে এনকোড করা ফর্ম-ডেটা পাঠান (প্রথম সাবমিট বাটন), এবং "multipart/form-data" হিসেবে এনকোড করা ডেটা পাঠান (দ্বিতীয় সাবমিট বাটন):</p>' },
  { id: 'CpXVfHwhbNDr', type: 'code', language: 'html', code: '<form action="" method="post">\n    First name: <input type="text" name="fname"><br>\n    <input type="submit" value="Submit">\n    <input type="submit" formenctype="multipart/form-data"\n    value="Submit as Multipart/form-data">\n</form>' },
  { id: 'scmkBMra_4jC', type: 'richtext', html: '<hr>' },
  { id: 'OMBIs1_syled', text: 'formmethod অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-formmethod-attribute' },
  { id: '8pHFwag5FUTy', type: 'richtext', html: '<p><code>formmethod</code> অ্যাট্রিবিউট action URL-এ ফর্ম-ডেটা পাঠানোর HTTP মেথড নির্ধারণ করে।</p>\n<p>formmethod অ্যাট্রিবিউট <code>&lt;form&gt;</code> এলিমেন্টের method অ্যাট্রিবিউটকে ওভাররাইড করে।</p>\n<p>formmethod অ্যাট্রিবিউট <code>type="submit"</code> এবং <code>type="image"</code>-এর সাথে ব্যবহার করা যায়।</p>\n<p>দ্বিতীয় সাবমিট বাটনটি ফর্মের HTTP মেথড ওভাররাইড করে:</p>' },
  { id: 'oX0xr6eCLmjn', type: 'code', language: 'html', code: '<form action="" method="get">\n    First name: <input type="text" name="fname"><br>\n    Last name: <input type="text" name="lname"><br>\n    <input type="submit" value="Submit">\n    <input type="submit" formmethod="post" value="Submit using POST">\n</form>' },
  { id: '99aHRLiMWAn1', type: 'richtext', html: '<hr>' },
  { id: 'wBIxJZC0PDIS', text: 'formnovalidate অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-formnovalidate-attribute' },
  { id: 'IkoJXb3C1bi6', type: 'richtext', html: '<p><code>formnovalidate</code> অ্যাট্রিবিউট <code>&lt;form&gt;</code> এলিমেন্টের novalidate অ্যাট্রিবিউটকে ওভাররাইড করে।</p>\n<p>formnovalidate অ্যাট্রিবিউট <code>type="submit"</code>-এর সাথে ব্যবহার করা যায়।</p>\n<p>দুটি সাবমিট বাটনযুক্ত একটি ফর্ম (একটি ভ্যালিডেশন সহ, অন্যটি ছাড়া):</p>' },
  { id: '8ZPG1t8gZsWN', type: 'code', language: 'html', code: '<form action="">\n    E-mail: <input type="email" name="userid"><br>\n    <input type="submit" value="Submit"><br>\n    <input type="submit" formnovalidate value="Submit without validation">\n</form>' },
  { id: 'ot-_dAzBggmt', type: 'richtext', html: '<hr>' },
  { id: 'TFk3eaoOpuZ8', text: 'formtarget অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-formtarget-attribute' },
  { id: '4lThOLzZx8Hg', type: 'richtext', html: '<p><code>formtarget</code> অ্যাট্রিবিউট এমন একটি নাম বা কীওয়ার্ড নির্ধারণ করে, যা ফর্ম জমা দেওয়ার পর প্রাপ্ত ফলাফল কোথায় দেখানো হবে তা নির্দেশ করে।</p>\n<p>formtarget অ্যাট্রিবিউট <code>&lt;form&gt;</code> এলিমেন্টের target অ্যাট্রিবিউটকে ওভাররাইড করে।</p>\n<p>formtarget অ্যাট্রিবিউট type="submit" এবং type="image"-এর সাথে ব্যবহার করা যায়।</p>\n<p>ভিন্ন ভিন্ন টার্গেট উইন্ডোসহ দুটি সাবমিট বাটনযুক্ত একটি ফর্ম:</p>' },
  { id: 'eOoDPlxqu-Bb', type: 'code', language: 'html', code: '<form action="">\n    First name: <input type="text" name="fname"><br>\n    Last name: <input type="text" name="lname"><br>\n    <input type="submit" value="Submit as normal">\n    <input type="submit" formtarget="_blank"\n    value="Submit to a new window">\n</form>' },
  { id: 'L9oXcSKMmziX', type: 'richtext', html: '<hr>' },
  { id: 'nzpCvEBqmTUd', text: 'height ও width অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-height-and-width-attributes' },
  { id: 'YKfj1-OaBn_9', type: 'richtext', html: '<p><code>height</code> এবং <code>width</code> অ্যাট্রিবিউট একটি <code>&lt;input type="image"&gt;</code> এলিমেন্টের উচ্চতা ও প্রস্থ নির্ধারণ করে।</p>\n<p>সবসময় ইমেজের আকার উল্লেখ করুন। ব্রাউজার আকার না জানলে, ইমেজ লোড হওয়ার সময় পেজ ফ্লিকার করবে।</p>\n<p>height এবং width অ্যাট্রিবিউটসহ একটি ইমেজকে সাবমিট বাটন হিসেবে নির্ধারণ করুন:</p>' },
  { id: 'quzE38jIj22v', type: 'code', language: 'html', code: '<input type="image" src="img_submit.gif" alt="Submit" width="48" height="48">' },
  { id: 'SCEr4pGuDGck', type: 'richtext', html: '<hr>' },
  { id: '29EVgWTmt4zi', text: 'list অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-list-attribute' },
  { id: 'QbrchFsNrzHA', type: 'richtext', html: '<p>list অ্যাট্রিবিউট এমন একটি <code>&lt;datalist&gt;</code> এলিমেন্ট নির্দেশ করে, যাতে একটি <code>&lt;input&gt;</code> এলিমেন্টের জন্য পূর্বনির্ধারিত অপশন থাকে।</p>' },
  { id: 'Wc4aIvoq8D9i', type: 'code', language: 'html', code: '<input list="browsers">\n<datalist id="browsers">\n  <option value="Internet Explorer">\n  <option value="Firefox">\n  <option value="Chrome">\n  <option value="Opera">\n  <option value="Safari">\n</datalist>' },
  { id: 'l-TJJsrLzvsL', type: 'richtext', html: '<hr>' },
  { id: 'FjpmIo7XRbmI', text: 'min ও max অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-min-and-max-attributes' },
  { id: 'CSPGrKLhDg4H', type: 'richtext', html: '<p><code>min</code> এবং <code>max</code> অ্যাট্রিবিউট একটি <code>&lt;input&gt;</code> এলিমেন্টের সর্বনিম্ন ও সর্বোচ্চ মান নির্ধারণ করে।</p>\n<p><code>min</code> এবং <code>max</code> অ্যাট্রিবিউট নিচের ইনপুট টাইপগুলোর সাথে কাজ করে: number, range, date, datetime-local, month, time এবং week।</p>' },
  { id: 'UokU7sMb84eD', type: 'code', language: 'html', code: 'Enter a date before 1980-01-01:\n<input type="date" name="bday" max="1979-12-31">\nEnter a date after 2000-01-01:\n<input type="date" name="bday" min="2000-01-02">\nQuantity (between 1 and 5):\n<input type="number" name="quantity" min="1" max="5">' },
  { id: 'sF-eGaLG3ZXK', type: 'richtext', html: '<hr>' },
  { id: 'zH0rqqTb7m4i', text: 'multiple অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-multiple-attribute' },
  { id: 'JZyX3HHQmO1H', type: 'richtext', html: '<p><code>multiple</code> অ্যাট্রিবিউট নির্ধারণ করে যে ব্যবহারকারী <code>&lt;input&gt;</code> এলিমেন্টে একাধিক মান দিতে পারবেন।</p>\n<p><code>multiple</code> অ্যাট্রিবিউট নিচের ইনপুট টাইপগুলোর সাথে কাজ করে: email এবং file।</p>\n<p>একাধিক মান গ্রহণ করে এমন একটি ফাইল আপলোড ফিল্ড:</p>' },
  { id: '2IZzYWv5gBwh', type: 'code', language: 'html', code: 'Select images: <input type="file" name="img" multiple>' },
  { id: 'h3YXy_N6WcNU', type: 'richtext', html: '<hr>' },
  { id: 'PvG4AdtVIji6', text: 'pattern অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-pattern-attribute' },
  { id: 'ZlkIw8UOqoyy', type: 'richtext', html: '<p>pattern অ্যাট্রিবিউট একটি রেগুলার এক্সপ্রেশন নির্ধারণ করে, যার সাথে মিলিয়ে <input> এলিমেন্টের মান যাচাই করা হয়।</p>\n<p>pattern অ্যাট্রিবিউট নিচের ইনপুট টাইপগুলোর সাথে কাজ করে: text, search, url, tel, email, এবং password।</p>\n<p><b>টিপস:</b> ব্যবহারকারীকে সাহায্য করতে pattern ব্যাখ্যা করতে গ্লোবাল title অ্যাট্রিবিউট ব্যবহার করুন।</p>\n<p><b>টিপস:</b> আমাদের JavaScript টিউটোরিয়ালে রেগুলার এক্সপ্রেশন সম্পর্কে আরও জানুন।</p>\n<p>শুধুমাত্র তিনটি অক্ষর (কোনো সংখ্যা বা বিশেষ চিহ্ন ছাড়া) নিতে পারে এমন একটি ইনপুট ফিল্ড:</p>' },
  { id: 'Zs-nRGrinh-v', type: 'code', language: 'html', code: 'Country code: <input type="text" name="country_code" pattern="[A-Za-z]{3}" title="Three letter country code">' },
  { id: '_2M-_oOZmUNq', type: 'richtext', html: '<hr>' },
  { id: '1wMOVwp5wN2T', text: 'placeholder অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-placeholder-attribute' },
  { id: '5VA6ROAue4Dg', type: 'richtext', html: '<p><code>placeholder</code> অ্যাট্রিবিউট এমন একটি ইঙ্গিত নির্ধারণ করে, যা একটি ইনপুট ফিল্ডের প্রত্যাশিত মান বর্ণনা করে (একটি নমুনা মান বা ফরম্যাটের সংক্ষিপ্ত বিবরণ)।</p>\n<p>ব্যবহারকারী একটি মান দেওয়ার আগে ইনপুট ফিল্ডে এই ইঙ্গিতটি প্রদর্শিত হয়।</p>\n<p><code>placeholder</code> অ্যাট্রিবিউট নিচের ইনপুট টাইপগুলোর সাথে কাজ করে: text, search, url, tel, email, এবং password।</p>' },
  { id: '21YcxPPBxvlt', type: 'code', language: 'html', code: '<input type="text" name="fname" placeholder="First name">' },
  { id: 'pg8z-IMBdbFa', type: 'richtext', html: '<hr>' },
  { id: 'dzBFacRAXNby', text: 'required অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-required-attribute' },
  { id: 'C13oec6AEV1N', type: 'richtext', html: '<p><code>required</code> অ্যাট্রিবিউট নির্ধারণ করে যে ফর্ম জমা দেওয়ার আগে একটি ইনপুট ফিল্ড অবশ্যই পূরণ করতে হবে।</p>\n<p><code>required</code> অ্যাট্রিবিউট নিচের ইনপুট টাইপগুলোর সাথে কাজ করে: text, search, url, tel, email, password, date pickers, number, checkbox, radio, এবং file।</p>' },
  { id: 'cqOcd_UirHT1', type: 'code', language: 'html', code: 'Username: <input type="text" name="usrname" required>' },
  { id: 'VxivZSTxtg8j', type: 'richtext', html: '<hr>' },
  { id: 'E3URV4yyNSo3', text: 'step অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-step-attribute' },
  { id: '2uLjQs4yan1T', type: 'richtext', html: '<p><code>step</code> অ্যাট্রিবিউট একটি <code>&lt;input&gt;</code> এলিমেন্টের বৈধ সংখ্যার ব্যবধান নির্ধারণ করে।</p>\n<p>উদাহরণ: step="3" হলে, বৈধ সংখ্যা হতে পারে -3, 0, 3, 6 ইত্যাদি।</p>\n<p><b>টিপস:</b> বৈধ মানের একটি রেঞ্জ তৈরি করতে step অ্যাট্রিবিউট max এবং min অ্যাট্রিবিউটের সাথে একত্রে ব্যবহার করা যায়।</p>\n<p><code>step</code> অ্যাট্রিবিউট নিচের ইনপুট টাইপগুলোর সাথে কাজ করে: number, range, date, datetime-local, month, time এবং week।</p>\n<p>একটি নির্দিষ্ট বৈধ সংখ্যার ব্যবধানসহ একটি ইনপুট ফিল্ড:</p>' },
  { id: '0dwCeSior_3X', type: 'code', language: 'html', code: '<input type="number" name="points" step="3">' },
]

const toc = [
  { id: 'the-value-attribute', text: 'value অ্যাট্রিবিউট', level: 2 },
  { id: 'the-readonly-attribute', text: 'readonly অ্যাট্রিবিউট', level: 2 },
  { id: 'the-disabled-attribute', text: 'disabled অ্যাট্রিবিউট', level: 2 },
  { id: 'the-size-attribute', text: 'size অ্যাট্রিবিউট', level: 2 },
  { id: 'the-maxlength-attribute', text: 'maxlength অ্যাট্রিবিউট', level: 2 },
  { id: 'html5-attributes', text: 'HTML5 অ্যাট্রিবিউট', level: 2 },
  { id: 'the-autocomplete-attribute', text: 'autocomplete অ্যাট্রিবিউট', level: 2 },
  { id: 'the-novalidate-attribute', text: 'novalidate অ্যাট্রিবিউট', level: 2 },
  { id: 'the-autofocus-attribute', text: 'autofocus অ্যাট্রিবিউট', level: 2 },
  { id: 'the-form-attribute', text: 'form অ্যাট্রিবিউট', level: 2 },
  { id: 'the-formaction-attribute', text: 'formaction অ্যাট্রিবিউট', level: 2 },
  { id: 'the-formenctype-attribute', text: 'formenctype অ্যাট্রিবিউট', level: 2 },
  { id: 'the-formmethod-attribute', text: 'formmethod অ্যাট্রিবিউট', level: 2 },
  { id: 'the-formnovalidate-attribute', text: 'formnovalidate অ্যাট্রিবিউট', level: 2 },
  { id: 'the-formtarget-attribute', text: 'formtarget অ্যাট্রিবিউট', level: 2 },
  { id: 'the-height-and-width-attributes', text: 'height ও width অ্যাট্রিবিউট', level: 2 },
  { id: 'the-list-attribute', text: 'list অ্যাট্রিবিউট', level: 2 },
  { id: 'the-min-and-max-attributes', text: 'min ও max অ্যাট্রিবিউট', level: 2 },
  { id: 'the-multiple-attribute', text: 'multiple অ্যাট্রিবিউট', level: 2 },
  { id: 'the-pattern-attribute', text: 'pattern অ্যাট্রিবিউট', level: 2 },
  { id: 'the-placeholder-attribute', text: 'placeholder অ্যাট্রিবিউট', level: 2 },
  { id: 'the-required-attribute', text: 'required অ্যাট্রিবিউট', level: 2 },
  { id: 'the-step-attribute', text: 'step অ্যাট্রিবিউট', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('form-attributes: 1/1 written')
