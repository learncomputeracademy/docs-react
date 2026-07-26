import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '31297d61-291e-4cb4-9655-d410e5edc17f' // html/form-elements
const title = 'HTML ফর্ম এলিমেন্ট'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'input, select, textarea, button এবং HTML5-এর datalist, output ফর্ম এলিমেন্ট কীভাবে ব্যবহার করবেন তা জানুন।'

const blocks = [
  { id: 'YUmQ2WX0aFYp', type: 'richtext', html: '<hr>\n<p>এই চ্যাপ্টারে সব HTML ফর্ম এলিমেন্ট বর্ণনা করা হয়েছে।</p>\n<hr>' },
  { id: '2wK_RgssE5bM', text: '<input> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-input-element' },
  { id: 'HnVXkr7qYtXy', type: 'richtext', html: '<p>সবচেয়ে গুরুত্বপূর্ণ ফর্ম এলিমেন্ট হলো <code>&lt;input&gt;</code> এলিমেন্ট।</p>\n<p><code>&lt;input&gt;</code> এলিমেন্ট <code>type</code> অ্যাট্রিবিউটের উপর নির্ভর করে বিভিন্নভাবে প্রদর্শিত হতে পারে।</p>' },
  { id: 'X5iPMpOm73xB', type: 'code', language: 'html', code: '<input name="firstname" type="text">' },
  { id: 'xWS752iYF9xX', type: 'richtext', html: '<p><code>type</code> অ্যাট্রিবিউট বাদ দেওয়া হলে, ইনপুট ফিল্ড ডিফল্ট টাইপ পায়: "text"।</p>\n<hr>' },
  { id: 'fQ5cEFdySkHn', text: '<select> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-select-element' },
  { id: 'zjQeJG0fWTD9', type: 'richtext', html: '<p><code>&lt;select&gt;</code> এলিমেন্ট একটি <b>ড্রপ-ডাউন লিস্ট</b> নির্ধারণ করে:</p>' },
  { id: 'gMLH4LESZY2z', type: 'code', language: 'html', code: '<select name="cars">\n    <option value="volvo">Volvo</option>\n    <option value="saab">Saab</option>\n    <option value="fiat">Fiat</option>\n    <option value="audi">Audi</option>\n</select>' },
  { id: '9zfQNeCLIByX', type: 'richtext', html: '<p><code>&lt;option&gt;</code> এলিমেন্ট এমন একটি অপশন নির্ধারণ করে, যা সিলেক্ট করা যায়।</p>\n<p>ডিফল্টভাবে, ড্রপ-ডাউন লিস্টের প্রথম আইটেমটি সিলেক্ট করা থাকে।</p>\n<p>একটি প্রি-সিলেক্টেড অপশন নির্ধারণ করতে, অপশনে <code>selected</code> অ্যাট্রিবিউট যোগ করুন:</p>' },
  { id: 'cFq5W7hLA_lQ', type: 'code', language: 'html', code: '<option value="fiat" selected>Fiat</option>' },
  { id: 'SY-4_8Kv87Tj', type: 'richtext', html: `<p>ব্রাউজারে এটি এভাবে দেখাবে:</p>
<select name="cars">
                                    <option value="volvo">Volvo</option>
                                    <option value="saab">Saab</option>
                                    <option value="fiat" selected="">Fiat</option>
                                    <option value="audi">Audi</option>
                                </select>
<hr>` },
  { id: 'S8VG6x_hQ6mZ', text: 'দৃশ্যমান মান:', type: 'heading', level: 3, anchor: 'visible-values' },
  { id: 'w0AEaUtk11WD', type: 'richtext', html: '<p>দৃশ্যমান মানের সংখ্যা নির্ধারণ করতে <code>size</code> অ্যাট্রিবিউট ব্যবহার করুন:</p>' },
  { id: 'sSldQo0zrCMh', type: 'code', language: 'html', code: '<select name="cars" size="3">\n    <option value="volvo">Volvo</option>\n    <option value="saab">Saab</option>\n    <option value="fiat">Fiat</option>\n    <option value="audi">Audi</option>\n</select>' },
  { id: 'p8c9ELC4vrT6', type: 'richtext', html: `<p>ব্রাউজারে এটি এভাবে দেখাবে:</p>
<select name="cars" size="3">
                                    <option value="volvo">Volvo</option>
                                    <option value="saab">Saab</option>
                                    <option value="fiat">Fiat</option>
                                    <option value="audi">Audi</option>
                                </select>
<hr>` },
  { id: 'cPt4K0J8YZ0E', text: 'একাধিক সিলেকশনের অনুমতি দেওয়া:', type: 'heading', level: 3, anchor: 'allow-multiple-selections' },
  { id: 'M92Y6XYJ9b4e', type: 'richtext', html: `<p>ব্যবহারকারীকে একাধিক মান সিলেক্ট করার অনুমতি দিতে <code>multiple</code> অ্যাট্রিবিউট ব্যবহার করুন:</p>
<select name="cars" size="4" multiple="">
                                  <option value="volvo">Volvo</option>
                                  <option value="saab">Saab</option>
                                  <option value="fiat">Fiat</option>
                                  <option value="audi">Audi</option>
                                </select>
<hr>` },
  { id: 'lWmhfw-tob-8', text: '<textarea> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-textarea-element' },
  { id: 'IjmhG7dWTi-3', type: 'richtext', html: '<p><code>&lt;textarea&gt;</code> এলিমেন্ট একটি মাল্টি-লাইন ইনপুট ফিল্ড (একটি টেক্সট এরিয়া) নির্ধারণ করে:</p>' },
  { id: 'q7oDmNLDaEKv', type: 'code', language: 'html', code: '<textarea name="message" rows="10" cols="30">\n    The cat was playing in the garden.\n</textarea>' },
  { id: '8HyIx3wAoLQW', type: 'richtext', html: `<p><code>rows</code> অ্যাট্রিবিউট একটি টেক্সট এরিয়ায় দৃশ্যমান লাইনের সংখ্যা নির্ধারণ করে।</p>
<p><code>cols</code> অ্যাট্রিবিউট একটি টেক্সট এরিয়ার দৃশ্যমান প্রস্থ নির্ধারণ করে।</p>
<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>
<textarea name="message" rows="10" cols="30">The cat was playing in the garden.</textarea>
<p>CSS ব্যবহার করেও আপনি টেক্সট এরিয়ার আকার নির্ধারণ করতে পারেন:</p>` },
  { id: 'V0drOFgKduRk', type: 'code', language: 'html', code: '<textarea name="message" style="width:200px; height:600px;">\n    The cat was playing in the garden.\n</textarea>' },
  { id: '0dq6addNkKVi', type: 'richtext', html: '<hr>' },
  { id: 'f4cVa6ZcevN-', text: '<button> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-button-element' },
  { id: 'bGa80iQ2KkN9', type: 'richtext', html: '<p><code>&lt;button&gt;</code> এলিমেন্ট একটি ক্লিকযোগ্য বাটন নির্ধারণ করে:</p>' },
  { id: '5W96LMy9RJuR', type: 'code', language: 'html', code: "<button type=\"button\" onclick=\"alert('Hello World!')\">Click Me!</button>" },
  { id: 'wNgqeSZdVk7V', type: 'richtext', html: `<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>
<button type="button" onclick="alert('Hello World!')">এখানে ক্লিক করুন!</button>
<p><b>মনে রাখবেন:</b> button এলিমেন্টের জন্য সবসময় <b>type</b> অ্যাট্রিবিউট উল্লেখ করুন। বিভিন্ন ব্রাউজার button এলিমেন্টের জন্য ভিন্ন ভিন্ন ডিফল্ট টাইপ ব্যবহার করতে পারে।</p>
<hr>` },
  { id: 'UgPiL88cO_QM', text: 'HTML5 ফর্ম এলিমেন্ট', type: 'heading', level: 2, anchor: 'html5-form-elements' },
  { id: 'N2P05q_uSmjo', type: 'richtext', html: `<p>HTML5-এ নিচের ফর্ম এলিমেন্টগুলো যোগ করা হয়েছে:</p>
<ul>
                                    <li><code>&lt;datalist&gt;</code></li>
                                    <li><code>&lt;output&gt;</code></li>
                                </ul>
<p><b>মনে রাখবেন:</b> ব্রাউজার অচেনা এলিমেন্ট প্রদর্শন করে না। পুরনো ব্রাউজারে অসমর্থিত নতুন এলিমেন্ট আপনার ওয়েব পেজ "নষ্ট" করবে না।</p>
<hr>` },
  { id: 'OPyUTwq4TAfh', text: 'HTML5  এলিমেন্ট', type: 'heading', level: 2, anchor: 'html5-element' },
  { id: 'X6BEg17ewb55', type: 'richtext', html: '<p><code>&lt;datalist&gt;</code> এলিমেন্ট একটি <code>&lt;input&gt;</code> এলিমেন্টের জন্য পূর্বনির্ধারিত অপশনের একটি তালিকা নির্ধারণ করে।</p>\n<p>ডেটা ইনপুট করার সময় ব্যবহারকারীরা পূর্বনির্ধারিত অপশনগুলোর একটি ড্রপ-ডাউন লিস্ট দেখতে পাবেন।</p>\n<p><code>&lt;input&gt;</code> এলিমেন্টের <code>list</code> অ্যাট্রিবিউটকে অবশ্যই <code>&lt;datalist&gt;</code> এলিমেন্টের <code>id</code> অ্যাট্রিবিউট নির্দেশ করতে হবে।</p>' },
  { id: 'pOSBmRXId5Ok', type: 'code', language: 'html', code: '<form action="/action_page.php">\n        <input list="browsers">\n        <datalist id="browsers">\n        <option value="Internet Explorer">\n        <option value="Firefox">\n        <option value="Chrome">\n        <option value="Opera">\n        <option value="Safari">\n    </datalist> \n</form>' },
  { id: 'Fbo8SiAUyAVi', type: 'richtext', html: `<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>
<form action="">
                                    <input list="browsers">
                                    <datalist id="browsers">
                                        <option value="Internet Explorer">
                                        </option><option value="Firefox">
                                        </option><option value="Chrome">
                                        </option><option value="Opera">
                                        </option><option value="Safari">
                                    </option></datalist>
                                    <input type="submit">
                                </form>
<hr>` },
  { id: 'rGz9mM5qD7bm', text: 'HTML5 <output> এলিমেন্ট', type: 'heading', level: 2, anchor: 'html5-output-element' },
  { id: '_2Qzdpb4Ap9X', type: 'richtext', html: '<p><code>&lt;output&gt;</code> এলিমেন্ট একটি হিসাবের ফলাফল প্রকাশ করে (যেমন একটি স্ক্রিপ্ট দ্বারা সম্পাদিত হিসাব)।</p>' },
  { id: '3VA1iXxU4Umb', type: 'code', language: 'html', code: '<form action="/action_page.php"\n    oninput="x.value=parseInt(a.value)+parseInt(b.value)">\n    0\n    <input type="range"  id="a" name="a" value="50">\n    100 +\n    <input type="number" id="b" name="b" value="50">\n    =\n    <output name="x" for="a b"></output>\n    <br><br>\n    <input type="submit">\n</form>' },
  { id: '8zwsFKfG7wG_', type: 'richtext', html: `<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>
<form action="" oninput="x.value=parseInt(a.value)+parseInt(b.value)">
                                    0
                                    <input type="range" id="a" name="a" value="50">
                                    100 +
                                    <input type="number" id="b" name="b" value="50">
                                    =
                                    <output name="x" for="a b"></output>
                                    <br><br>
                                    <input type="submit">
                                </form>` },
]

const toc = [
  { id: 'the-input-element', text: '<input> এলিমেন্ট', level: 2 },
  { id: 'the-select-element', text: '<select> এলিমেন্ট', level: 2 },
  { id: 'visible-values', text: 'দৃশ্যমান মান:', level: 3 },
  { id: 'allow-multiple-selections', text: 'একাধিক সিলেকশনের অনুমতি দেওয়া:', level: 3 },
  { id: 'the-textarea-element', text: '<textarea> এলিমেন্ট', level: 2 },
  { id: 'the-button-element', text: '<button> এলিমেন্ট', level: 2 },
  { id: 'html5-form-elements', text: 'HTML5 ফর্ম এলিমেন্ট', level: 2 },
  { id: 'html5-element', text: 'HTML5  এলিমেন্ট', level: 2 },
  { id: 'html5-output-element', text: 'HTML5 <output> এলিমেন্ট', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('form-elements: 1/1 written')
