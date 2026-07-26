import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'bf6faa0d-3a62-41db-9cbf-c34c032a0959' // css/form
const title = 'CSS ফর্ম'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'CSS দিয়ে ফর্ম ইনপুট, টেক্সট এরিয়া, সিলেক্ট মেনু এবং বাটন কীভাবে স্টাইল করবেন তা জানুন।'

const blocks = [
  { id: 'O7bGM2phYiH1', type: 'richtext', html: `<hr>
<p>CSS দিয়ে একটি HTML ফর্মের চেহারা অনেক উন্নত করা যায়:</p>
<form action="" class="test">
                                        <label for="fname">নামের প্রথম অংশ</label>
                                        <input type="text" id="fname" name="firstname" placeholder="আপনার নাম.." class="form-control">
                                        <label for="lname">পদবি</label>
                                        <input type="text" id="lname" name="lastname" placeholder="আপনার পদবি.." class="form-control">
                                        <label for="country">দেশ</label>
                                        <select id="country" name="country" class="form-control">
                                        <option value="usa">Australia</option>
                                        <option value="usa">Canada</option>
                                        <option value="usa">USA</option>
                                        </select>
                                        <a target="_blank" href="#" class="btn btn-primary form-control" style="margin-top: 20px;">জমা দিন »</a>
                                    </form>
<hr>` },
  { id: 'TmRuDkfwcIDN', text: 'ইনপুট ফিল্ড স্টাইল করা', type: 'heading', level: 2, anchor: 'styling-input-fields' },
  { id: 'pSBm7C1gmC-u', type: 'richtext', html: '<p>ইনপুট ফিল্ডের প্রস্থ নির্ধারণ করতে <code class="w3-codespan">width</code> প্রপার্টি ব্যবহার করুন:</p>\n<label for="fname2">নামের প্রথম অংশ</label>\n<input type="text" id="fname2" name="firstname" style="width:100%; margin-bottom: 1rem;">' },
  { id: 'wjPnHLa300ST', type: 'code', language: 'css', code: 'input {\n  width: 100%;\n}' },
  { id: 'XdhVYSJd1Ukg', type: 'richtext', html: `<p>উপরের উদাহরণটি সব &lt;input&gt; এলিমেন্টে প্রযোজ্য। শুধু একটি নির্দিষ্ট ইনপুট টাইপ স্টাইল করতে চাইলে, আপনি অ্যাট্রিবিউট সিলেক্টর ব্যবহার করতে পারেন:</p>
<ul>
                                    <li><code>input[type=text]</code> - শুধু টেক্সট ফিল্ড সিলেক্ট করবে</li>
                                    <li><code>input[type=password]</code> - শুধু পাসওয়ার্ড ফিল্ড সিলেক্ট করবে</li>
                                    <li><code>input[type=number]</code> - শুধু নাম্বার ফিল্ড সিলেক্ট করবে</li>
                                    <li>ইত্যাদি..</li>
                                </ul>
<hr>` },
  { id: '-As9f62uSsIV', text: 'প্যাডেড ইনপুট', type: 'heading', level: 2, anchor: 'padded-inputs' },
  { id: 'XMClK7GBj9o1', type: 'richtext', html: `<p>টেক্সট ফিল্ডের ভেতরে জায়গা যোগ করতে <code class="w3-codespan">padding</code> প্রপার্টি ব্যবহার করুন।</p>
<p><strong>টিপস:</strong> একের পর এক অনেক ইনপুট থাকলে, তাদের বাইরে আরও জায়গা যোগ করতে
                                আপনি কিছু <code class="w3-codespan">margin</code>ও
                                যোগ করতে চাইতে পারেন:</p>
<label for="fname3">নামের প্রথম অংশ</label>
<input type="text" id="fname3" name="firstname" class="form-control">
<label for="lname3">পদবি</label>
<input type="text" id="lname3" name="lastname" class="form-control" style="margin-bottom: 1rem;">` },
  { id: 'Ax__CwKqqu-0', type: 'code', language: 'css', code: 'input[type=text] {\n  width: 100%;\n  padding: 12px 20px;\n  margin: 8px 0;\n  box-sizing: border-box;\n}' },
  { id: 'yQpsBPFO2q43', type: 'richtext', html: '<p class="note">লক্ষ্য করুন যে আমরা <code>box-sizing</code> প্রপার্টি <code>border-box</code>-এ সেট করেছি। এটি নিশ্চিত করে যে padding এবং শেষমেশ বর্ডার এলিমেন্টগুলোর মোট প্রস্থ ও উচ্চতার মধ্যে অন্তর্ভুক্ত থাকে। <br>আমাদের <a href="#">CSS Box Sizing</a> চ্যাপ্টারে <code>box-sizing</code> প্রপার্টি সম্পর্কে আরও পড়ুন।</p>\n<hr>' },
  { id: 'RN0VP0byTmDB', text: 'বর্ডারযুক্ত ইনপুট', type: 'heading', level: 2, anchor: 'bordered-inputs' },
  { id: 'CUOApOxzOXSd', type: 'richtext', html: `<p>বর্ডারের আকার ও রঙ পরিবর্তন করতে <code>border</code> প্রপার্টি ব্যবহার করুন, এবং
                                গোলাকার কোণা যোগ করতে <code>border-radius</code> প্রপার্টি ব্যবহার করুন:</p>
<label for="fname4">নামের প্রথম অংশ</label>
<input type="text" id="fname4" name="firstname" class="form-control" style="border: 1px solid red;margin-bottom: 1rem;">` },
  { id: 'cLp00iItkoOw', type: 'code', language: 'css', code: 'input[type=text] {\n  border: 2px solid red;\n  border-radius: 4px;\n}' },
  { id: 'WLubmYpZFl9t', type: 'richtext', html: `<p>শুধু একটি নিচের বর্ডার চাইলে, <code>border-bottom</code> প্রপার্টি ব্যবহার করুন:</p>
<label for="fname7">নামের প্রথম অংশ</label>
<input type="text" id="fname7" name="firstname" placeholder="নামের প্রথম অংশ" class="form-control" style="border-width: 1px; border-style: solid; border-color: transparent transparent red transparent;margin-bottom: 1rem; ">` },
  { id: '8v7QotobOhK1', type: 'code', language: 'css', code: 'input[type=text] {\n  border: none;\n  border-bottom: 2px solid red;\n}' },
  { id: 'lJ2wvr_Yy4Pf', type: 'richtext', html: '<hr>' },
  { id: '9qNMSosPRvdl', text: 'রঙিন ইনপুট', type: 'heading', level: 2, anchor: 'colored-inputs' },
  { id: '4hzow1OQFmjr', type: 'richtext', html: '<p>ইনপুটে একটি ব্যাকগ্রাউন্ড কালার যোগ করতে <code>background-color</code> প্রপার্টি ব্যবহার করুন, এবং টেক্সটের রঙ পরিবর্তন করতে <code>color</code> প্রপার্টি ব্যবহার করুন:</p>\n<input type="text" value="John" name="firstname" class="form-control" style="background: #0054D1;color: #fff;margin-bottom: 1rem;">' },
  { id: 'zq7uURsxYWTp', type: 'code', language: 'css', code: 'input[type=text] {\n  background-color: #3CBC8D;\n  color: white;\n}' },
  { id: '0Fuj3mpj9i6O', type: 'richtext', html: '<hr>' },
  { id: '3cgBqx7JYFcB', text: 'ফোকাসড ইনপুট', type: 'heading', level: 2, anchor: 'focused-inputs' },
  { id: 'aoS63EIq0-Wi', type: 'richtext', html: '<p>ডিফল্টভাবে, কিছু ব্রাউজার ইনপুট ফোকাস পেলে (ক্লিক করা হলে) তার চারপাশে একটি নীল আউটলাইন যোগ করে। ইনপুটে <code>outline: none;</code> যোগ করে আপনি এই আচরণ বন্ধ করতে পারেন।</p>\n<p>ইনপুট ফিল্ড ফোকাস পেলে কিছু করাতে <code>:focus</code> সিলেক্টর ব্যবহার করুন:</p>\n<input class="focus1 form-control" type="text" name="firstname" style="margin-bottom: 1rem;">' },
  { id: 'K72-1FRNzccv', type: 'code', language: 'css', code: 'input[type=text]:focus {\n  background-color: lightblue;\n}' },
  { id: 'l3NEoy_-humE', type: 'richtext', html: '<input class="focus2 form-control" type="text" name="lastname" style="margin-bottom: 1rem;">' },
  { id: '70iT5Shw_Hni', type: 'code', language: 'css', code: 'input[type=text]:focus {\n  background-color: pink;\n}' },
  { id: 'UAb1ypTyxEqQ', type: 'richtext', html: '<hr>' },
  { id: 'sjUkmfukZmYD', text: 'আইকন/ইমেজসহ ইনপুট', type: 'heading', level: 2, anchor: 'input-with-iconimage' },
  { id: 'lihBkoT3bBPo', type: 'richtext', html: '<p>ইনপুটের ভেতরে একটি আইকন চাইলে, <code class="w3-codespan">background-image</code> প্রপার্টি ব্যবহার করুন এবং <code>background-position</code> প্রপার্টি দিয়ে এটি পজিশন করুন। এটাও লক্ষ্য করুন যে আইকনের জায়গা রাখতে আমরা একটি বড় বাম প্যাডিং যোগ করেছি:</p>\n<input type="text" name="search" placeholder="সার্চ করুন.." class="icon form-control" style="margin-bottom: 1rem;">' },
  { id: 'jPX5MhGtjACQ', type: 'code', language: 'css', code: "input[type=text] {\n  background-color: white;\n  background-image: url('searchicon.png');\n  background-position: 10px 10px; \n  background-repeat: no-repeat;\n  padding-left: 40px;\n}" },
  { id: 'y8CIAUoIwFuP', type: 'richtext', html: '<hr>' },
  { id: 'qILDZToZqat3', text: 'টেক্সট এরিয়া স্টাইল করা', type: 'heading', level: 2, anchor: 'styling-textareas' },
  { id: 'kUIzcBAwO1N_', type: 'richtext', html: '<p><strong>টিপস:</strong> টেক্সট এরিয়া রিসাইজ হওয়া বন্ধ করতে <code>resize</code> প্রপার্টি ব্যবহার করুন (নিচের-ডান কোণের "গ্র্যাবার" নিষ্ক্রিয় করুন):</p>\n<textarea name="firstname" class="form-control" style="margin-bottom: 1rem;">Some text...</textarea>' },
  { id: 'fZfnaaJP3yrb', type: 'code', language: 'css', code: 'textarea {\n  width: 100%;\n  height: 150px;\n  padding: 12px 20px;\n  box-sizing: border-box;\n  border: 2px solid #ccc;\n  border-radius: 4px;\n  background-color: #f8f8f8;\n  resize: none;\n}' },
  { id: 'ZPiWh18XxiIM', type: 'richtext', html: '<hr>' },
  { id: 'TcffKOTIyY8P', text: 'সিলেক্ট মেনু স্টাইল করা', type: 'heading', level: 2, anchor: 'styling-select-menus' },
  { id: 'i8qXdxNafieZ', type: 'richtext', html: `<form class="test">
                                  <select id="country" name="country" style="background-color:#f1f1f1;border:none;margin-bottom: 1rem;">
                                    <option value="usa">বেছে নিন...</option>
                                    <option value="usa">Australia</option>
                                    <option value="usa">Canada</option>
                                    <option value="usa">USA</option>
                                  </select>
                                </form>` },
  { id: 'TvU-E5-E__X8', type: 'code', language: 'css', code: 'select {\n  width: 100%;\n  padding: 16px 20px;\n  border: none;\n  border-radius: 4px;\n  background-color: #f1f1f1;\n}' },
  { id: 'dVaDVoG8W_ws', type: 'richtext', html: '<hr>' },
  { id: 'JTlFr8JAwjB8', text: 'ইনপুট বাটন স্টাইল করা', type: 'heading', level: 2, anchor: 'styling-input-buttons' },
  { id: 'kTyUmuBu7to2', type: 'richtext', html: '<input type="button" value="বাটন" class="btn btn-primary" style="margin-bottom: 1rem;">\n<input type="button" value="বাটন" class="btn btn-primary" style="width:100%;margin-bottom: 1rem;">' },
  { id: 'nYXGzC7fV6Pu', type: 'code', language: 'css', code: 'input[type=button], input[type=submit], input[type=reset] {\n  background-color: #4CAF50;\n  border: none;\n  color: white;\n  padding: 16px 32px;\n  text-decoration: none;\n  margin: 4px 2px;\n  cursor: pointer;\n}\n/* টিপস: ফুল-উইথ বাটনের জন্য width: 100% ব্যবহার করুন */' },
]

const toc = [
  { id: 'styling-input-fields', text: 'ইনপুট ফিল্ড স্টাইল করা', level: 2 },
  { id: 'padded-inputs', text: 'প্যাডেড ইনপুট', level: 2 },
  { id: 'bordered-inputs', text: 'বর্ডারযুক্ত ইনপুট', level: 2 },
  { id: 'colored-inputs', text: 'রঙিন ইনপুট', level: 2 },
  { id: 'focused-inputs', text: 'ফোকাসড ইনপুট', level: 2 },
  { id: 'input-with-iconimage', text: 'আইকন/ইমেজসহ ইনপুট', level: 2 },
  { id: 'styling-textareas', text: 'টেক্সট এরিয়া স্টাইল করা', level: 2 },
  { id: 'styling-select-menus', text: 'সিলেক্ট মেনু স্টাইল করা', level: 2 },
  { id: 'styling-input-buttons', text: 'ইনপুট বাটন স্টাইল করা', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/form: 1/1 written')
