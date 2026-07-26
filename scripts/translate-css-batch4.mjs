import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const mt = (title) => `${title} | Learn Computer Academy`

const docs = [
  {
    id: '01a93451-e342-4e3a-850b-f123f9ca03c4', // css/border
    title: 'CSS বর্ডার',
    meta_description: 'CSS border-style, border-width, border-color, শর্টহ্যান্ড প্রপার্টি এবং গোলাকার বর্ডার কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'xpVjDO5rRXgi', text: 'CSS Border প্রপার্টি', type: 'heading', level: 2, anchor: 'css-border-properties' },
      { id: 'kT9kpjD-zQ-g', type: 'richtext', html: `<p>CSS-এর <code>border</code> প্রপার্টি আপনাকে একটি এলিমেন্টের বর্ডারের স্টাইল, প্রস্থ এবং রঙ নির্ধারণ করতে দেয়।</p>
<p>CSS ব্যাকগ্রাউন্ড প্রপার্টি:</p>
<p style="border:1px solid #999;" class="p-3">আমার চারদিকেই বর্ডার আছে।</p>
<p style="border-bottom:1px solid #f44336;" class="p-3">আমার একটি লাল নিচের বর্ডার আছে।</p>
<p style="border:1px solid #999; border-radius: 15px;" class="p-3">আমার গোলাকার বর্ডার আছে।</p>
<p style="border-left:4px solid #2196F3;" class="p-3">আমার একটি নীল বামের বর্ডার আছে।</p>
<hr>` },
      { id: 'jra8RQA2dnF_', text: 'CSS Border Style', type: 'heading', level: 2, anchor: 'css-border-style' },
      { id: 'tkxOccyRf7JW', type: 'richtext', html: `<p><code>border-style</code> প্রপার্টি নির্ধারণ করে কী ধরনের বর্ডার দেখানো হবে।</p>
<p>নিচের মানগুলো অনুমোদিত:</p>
<ul>
                                    <li><code>dotted</code> - একটি ডটেড বর্ডার নির্ধারণ করে</li>
                                    <li><code>dashed</code> - একটি ড্যাশড বর্ডার নির্ধারণ করে</li>
                                    <li><code>solid</code> - একটি সলিড বর্ডার নির্ধারণ করে</li>
                                    <li><code>double</code> - একটি ডাবল বর্ডার নির্ধারণ করে</li>
                                    <li><code>groove</code> - একটি 3D গ্রুভড বর্ডার নির্ধারণ করে। প্রভাবটি border-color মানের উপর নির্ভর করে</li>
                                    <li><code>ridge</code> - একটি 3D রিজড বর্ডার নির্ধারণ করে। প্রভাবটি border-color মানের উপর নির্ভর করে</li>
                                    <li><code>inset</code> - একটি 3D ইনসেট বর্ডার নির্ধারণ করে। প্রভাবটি border-color মানের উপর নির্ভর করে</li>
                                    <li><code>outset</code> - একটি 3D আউটসেট বর্ডার নির্ধারণ করে। প্রভাবটি border-color মানের উপর নির্ভর করে</li>
                                    <li><code>none</code> - কোনো বর্ডার নির্ধারণ করে না</li>
                                    <li><code>hidden</code> - একটি লুকানো বর্ডার নির্ধারণ করে</li>
                                </ul>
<p><code>border-style</code> প্রপার্টিতে এক থেকে চারটি মান থাকতে পারে (উপরের বর্ডার, ডানের বর্ডার, নিচের বর্ডার এবং বামের বর্ডারের জন্য)।</p>` },
      { id: 'ZDQRJMjbArzW', type: 'code', language: 'css', code: 'p.dotted {border-style: dotted;}\np.dashed {border-style: dashed;}\np.solid {border-style: solid;}\np.double {border-style: double;}\np.groove {border-style: groove;}\np.ridge {border-style: ridge;}\np.inset {border-style: inset;}\np.outset {border-style: outset;}\np.none {border-style: none;}\np.hidden {border-style: hidden;}\np.mix {border-style: dotted dashed solid double;}' },
      { id: 'b9FScHTlHtd4', type: 'richtext', html: `<p>উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:</p>
<p style="border-style: dotted;">একটি ডটেড বর্ডার।</p>
<p style="border-style: dashed;">একটি ড্যাশড বর্ডার।</p>
<p style="border-style: solid;">একটি সলিড বর্ডার।</p>
<p style="border-style: double;">একটি ডাবল বর্ডার।</p>
<p style="border-style: groove;">একটি গ্রুভ বর্ডার। প্রভাবটি border-color মানের উপর নির্ভর করে।</p>
<p style="border-style: ridge;">একটি রিজ বর্ডার। প্রভাবটি border-color মানের উপর নির্ভর করে।</p>
<p style="border-style: inset;">একটি ইনসেট বর্ডার। প্রভাবটি border-color মানের উপর নির্ভর করে।</p>
<p style="border-style: outset;">একটি আউটসেট বর্ডার। প্রভাবটি border-color মানের উপর নির্ভর করে।</p>
<p style="border-style: none;">কোনো বর্ডার নেই।</p>
<p style="border-style: hidden;">একটি লুকানো বর্ডার।</p>
<p style="border-style: dotted dashed solid double;">একটি মিশ্র বর্ডার।</p>
<hr>` },
      { id: 'whffiSel5Ms3', text: 'CSS Border Width', type: 'heading', level: 2, anchor: 'css-border-width' },
      { id: 'jwx6fL032-dR', type: 'richtext', html: '<p><code>border-width</code> প্রপার্টি চারটি বর্ডারের প্রস্থ নির্ধারণ করে।</p>\n<p>প্রস্থ একটি নির্দিষ্ট মাপ হিসেবে (px, pt, cm, em ইত্যাদিতে) অথবা পূর্বনির্ধারিত তিনটি মানের একটি ব্যবহার করে সেট করা যায়: thin, medium, বা thick।</p>\n<p><code>border-width</code> প্রপার্টিতে এক থেকে চারটি মান থাকতে পারে (উপরের বর্ডার, ডানের বর্ডার, নিচের বর্ডার এবং বামের বর্ডারের জন্য)।</p>\n<p style="border: 5px solid #333;" class="p-3">5px border-width</p>' },
      { id: 'EkrgrWsMfaue', type: 'code', language: 'css', code: 'p.one {\n  border-style: solid;\n  border-width: 5px;\n}\np.two {\n  border-style: solid;\n  border-width: medium;\n}\np.three {\n  border-style: solid;\n  border-width: 2px 10px 4px 20px;\n}' },
      { id: '8D_SPRmbc0LI', type: 'richtext', html: '<hr>' },
      { id: 'xyCKDaUgbr8o', text: 'CSS Border Color', type: 'heading', level: 2, anchor: 'css-border-color' },
      { id: 'IyFz1FUzeGDA', type: 'richtext', html: `<p>চারটি বর্ডারের রঙ সেট করতে <code>border-color</code> প্রপার্টি ব্যবহার করা হয়।</p>
<p>রঙ সেট করা যায় এভাবে:</p>
<ul>
                                    <li>নাম - একটি রঙের নাম উল্লেখ করুন, যেমন "red"</li>
                                    <li>Hex - একটি hex মান উল্লেখ করুন, যেমন "#ff0000"</li>
                                    <li>RGB - একটি RGB মান উল্লেখ করুন, যেমন "rgb(255,0,0)"</li>
                                    <li>transparent</li>
                                </ul>
<p><code>border-color</code> প্রপার্টিতে এক থেকে চারটি মান থাকতে পারে (উপরের বর্ডার, ডানের বর্ডার, নিচের বর্ডার এবং বামের বর্ডারের জন্য)। </p>
<p><code>border-color</code> সেট করা না থাকলে, এটি এলিমেন্টের রঙ ইনহেরিট করে।</p>
<p style="border: 5px solid red;" class="p-3">লাল বর্ডার</p>` },
      { id: 'YXLIo2mhyvo-', type: 'code', language: 'css', code: 'p.one {\n  border-style: solid;\n  border-color: red;\n}\np.two {\n  border-style: solid;\n  border-color: green;\n}\np.three {\n  border-style: solid;\n  border-color: red green blue yellow;\n}' },
      { id: 'v2XcU5LBhigi', type: 'richtext', html: '<hr>' },
      { id: 'IvrAXC-NdHKD', text: 'CSS Border - প্রতিটি পাশ আলাদাভাবে', type: 'heading', level: 2, anchor: 'css-border---individual-sides' },
      { id: 'pnnwmIjltyqX', type: 'richtext', html: '<p>উপরের উদাহরণ থেকে আপনি দেখেছেন যে প্রতিটি পাশের জন্য আলাদা বর্ডার নির্ধারণ করা সম্ভব।</p>\n<p>CSS-এ, প্রতিটি বর্ডার (উপর, ডান, নিচ, এবং বাম) আলাদাভাবে নির্ধারণের জন্যও প্রপার্টি রয়েছে:</p>\n<p style="border-size: 5px; border-color: red; border-top-style: dotted; border-right-style: solid; border-bottom-style: dotted; border-left-style: solid;" class="p-3">ভিন্ন ভিন্ন বর্ডার স্টাইল</p>' },
      { id: 'esqLNetesiuW', type: 'code', language: 'css', code: 'p {\n  border-top-style: dotted;\n  border-right-style: solid;\n  border-bottom-style: dotted;\n  border-left-style: solid;\n}' },
      { id: 'L9Ypes6391nD', type: 'richtext', html: `<p>তো, এটি এভাবে কাজ করে:</p>
<p><code>border-style</code> প্রপার্টিতে চারটি মান থাকলে:</p>
<ul>
                                    <li><b>border-style: dotted solid double dashed;</b>
                                        <ul>
                                            <li>উপরের বর্ডার dotted</li>
                                            <li>ডানের বর্ডার solid</li>
                                            <li>নিচের বর্ডার double</li>
                                            <li>বামের বর্ডার dashed</li>
                                        </ul>
                                    </li>
                                </ul>
<p><code>border-style</code> প্রপার্টিতে তিনটি মান থাকলে:</p>
<ul>
                                    <li><b>border-style: dotted solid double;</b>
                                        <ul>
                                            <li>উপরের বর্ডার dotted</li>
                                            <li>ডান ও বামের বর্ডার solid</li>
                                            <li>নিচের বর্ডার double</li>
                                        </ul>
                                    </li>
                                </ul>
<p><code>border-style</code> প্রপার্টিতে দুটি মান থাকলে:</p>
<ul>
                                    <li><b>border-style: dotted solid;</b>
                                        <ul>
                                            <li>উপর ও নিচের বর্ডার dotted</li>
                                            <li>ডান ও বামের বর্ডার solid</li>
                                        </ul>
                                    </li>
                                </ul>
<p><code>border-style</code> প্রপার্টিতে একটি মান থাকলে:</p>
<ul>
                                    <li>border-style: dotted;
                                        <ul>
                                            <li>চারটি বর্ডারই dotted</li>
                                        </ul>
                                    </li>
                                </ul>
<p>উপরের উদাহরণে <code>border-style</code> প্রপার্টি ব্যবহার করা হয়েছে। তবে, এটি <code>border-width</code> এবং <code>border-color</code>-এর সাথেও কাজ করে।</p>
<hr>` },
      { id: 'bjL5wy8avOzB', text: 'CSS Border - শর্টহ্যান্ড প্রপার্টি', type: 'heading', level: 2, anchor: 'css-border---shorthand-property' },
      { id: '2gBIq6mZ7gur', type: 'richtext', html: `<p>উপরের উদাহরণ থেকে আপনি দেখতে পাচ্ছেন, বর্ডার নিয়ে কাজ করার সময় বিবেচনা করার মতো অনেক প্রপার্টি আছে।</p>
<p>কোড ছোট করতে, একটি প্রপার্টিতে সব পৃথক বর্ডার প্রপার্টি নির্ধারণ করাও সম্ভব।</p>
<p><code>border</code> প্রপার্টি হলো নিচের পৃথক বর্ডার প্রপার্টিগুলোর একটি শর্টহ্যান্ড প্রপার্টি:</p>
<ul>
                                    <li>border-width</li>
                                    <li>border-style (বাধ্যতামূলক)</li>
                                    <li>border-color</li>
                                </ul>
<hr>` },
      { id: '7h75zZu7iTRr', text: 'CSS গোলাকার বর্ডার', type: 'heading', level: 2, anchor: 'css-rounded-borders' },
      { id: 'fW57PCQsrUkE', type: 'richtext', html: `<p>একটি এলিমেন্টে গোলাকার বর্ডার যোগ করতে <code>border-radius</code> প্রপার্টি ব্যবহার করা হয়:</p>
<p style="border: 2px solid red; border-radius: 0px;" class="p-2">সাধারণ বর্ডার</p>
<p style="border: 2px solid red; border-radius: 5px;" class="p-2">গোলাকার বর্ডার</p>
<p style="border: 2px solid red; border-radius: 8px;" class="p-2">আরও গোলাকার বর্ডার</p>
<p style="border: 2px solid red; border-radius: 20px;" class="p-2">সবচেয়ে গোলাকার বর্ডার</p>
<hr>` },
      { id: 'TLZG--NHLDoz', text: 'সব CSS Border প্রপার্টি', type: 'heading', level: 2, anchor: 'all-css-border-properties' },
      { id: 'TY9Z96xxN9h6', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
        ['border', 'এক ঘোষণায় সব বর্ডার প্রপার্টি সেট করে'],
        ['border-bottom', 'এক ঘোষণায় সব নিচের বর্ডার প্রপার্টি সেট করে'],
        ['border-bottom-color', 'নিচের বর্ডারের রঙ সেট করে'],
        ['border-bottom-style', 'নিচের বর্ডারের স্টাইল সেট করে'],
        ['border-bottom-width', 'নিচের বর্ডারের প্রস্থ সেট করে'],
        ['border-color', 'চারটি বর্ডারের রঙ সেট করে'],
        ['border-left', 'এক ঘোষণায় সব বামের বর্ডার প্রপার্টি সেট করে'],
        ['border-left-color', 'বামের বর্ডারের রঙ সেট করে'],
        ['border-left-style', 'বামের বর্ডারের স্টাইল সেট করে'],
        ['border-left-width', 'বামের বর্ডারের প্রস্থ সেট করে'],
        ['border-radius', 'গোলাকার কোণার জন্য চারটি border-*-radius প্রপার্টি সেট করে'],
        ['border-right', 'এক ঘোষণায় সব ডানের বর্ডার প্রপার্টি সেট করে'],
        ['border-right-color', 'ডানের বর্ডারের রঙ সেট করে'],
        ['border-right-style', 'ডানের বর্ডারের স্টাইল সেট করে'],
        ['border-right-width', 'ডানের বর্ডারের প্রস্থ সেট করে'],
        ['border-style', 'চারটি বর্ডারের স্টাইল সেট করে'],
        ['border-top', 'এক ঘোষণায় সব উপরের বর্ডার প্রপার্টি সেট করে'],
        ['border-top-color', 'উপরের বর্ডারের রঙ সেট করে'],
        ['border-top-style', 'উপরের বর্ডারের স্টাইল সেট করে'],
        ['border-top-width', 'উপরের বর্ডারের প্রস্থ সেট করে'],
        ['border-width', 'চারটি বর্ডারের প্রস্থ সেট করে'],
      ] },
    ],
    toc: [
      { id: 'css-border-properties', text: 'CSS Border প্রপার্টি', level: 2 },
      { id: 'css-border-style', text: 'CSS Border Style', level: 2 },
      { id: 'css-border-width', text: 'CSS Border Width', level: 2 },
      { id: 'css-border-color', text: 'CSS Border Color', level: 2 },
      { id: 'css-border---individual-sides', text: 'CSS Border - প্রতিটি পাশ আলাদাভাবে', level: 2 },
      { id: 'css-border---shorthand-property', text: 'CSS Border - শর্টহ্যান্ড প্রপার্টি', level: 2 },
      { id: 'css-rounded-borders', text: 'CSS গোলাকার বর্ডার', level: 2 },
      { id: 'all-css-border-properties', text: 'সব CSS Border প্রপার্টি', level: 2 },
    ],
  },
  {
    id: '5dbbe54f-7e95-43ab-bdaf-251fc6b26789', // css/margin
    title: 'CSS মার্জিন',
    meta_description: 'CSS margin প্রপার্টি, শর্টহ্যান্ড সিনট্যাক্স, auto/inherit মান এবং মার্জিন কোলাপ্স কীভাবে কাজ করে তা জানুন।',
    blocks: [
      { id: 'BZmuxJ-ybUV5', type: 'richtext', html: '<hr>\n<p style="border:1px solid #4CAF50; margin:40px; padding:5px;">এই এলিমেন্টের মার্জিন 40px।</p>\n<hr>' },
      { id: 'DgvUitplaGzU', text: 'CSS মার্জিন', type: 'heading', level: 2, anchor: 'css-margins' },
      { id: 'reqN-7HAd9Hf', type: 'richtext', html: '<p>এলিমেন্টের চারপাশে, যেকোনো নির্ধারিত বর্ডারের বাইরে জায়গা তৈরি করতে CSS-এর <code>margin</code> প্রপার্টি ব্যবহার করা হয়।</p>\n<p>CSS দিয়ে, মার্জিনের উপর আপনার সম্পূর্ণ নিয়ন্ত্রণ থাকে। একটি এলিমেন্টের প্রতিটি পাশের (উপর, ডান, নিচ, এবং বাম) মার্জিন সেট করার জন্য প্রপার্টি রয়েছে।</p>\n<hr>' },
      { id: '-DSveaMK5Oet', text: 'মার্জিন - প্রতিটি পাশ আলাদাভাবে', type: 'heading', level: 2, anchor: 'margin---individual-sides' },
      { id: 'O6mBDt5LHrji', type: 'richtext', html: `<p>একটি এলিমেন্টের প্রতিটি পাশের মার্জিন নির্ধারণের জন্য CSS-এ প্রপার্টি রয়েছে:</p>
<ul>
                                    <li><code>margin-top</code></li>
                                    <li><code>margin-right</code></li>
                                    <li><code>margin-bottom</code></li>
                                    <li><code>margin-left</code></li>
                                </ul>
<p>সব margin প্রপার্টির নিচের মানগুলো থাকতে পারে:</p>
<ul>
                                    <li>auto - ব্রাউজার মার্জিন হিসাব করে</li>
                                    <li>length - px, pt, cm ইত্যাদিতে একটি মার্জিন নির্ধারণ করে</li>
                                    <li>% - কন্টেইনিং এলিমেন্টের প্রস্থের শতাংশে একটি মার্জিন নির্ধারণ করে</li>
                                    <li>inherit - নির্ধারণ করে যে মার্জিন প্যারেন্ট এলিমেন্ট থেকে ইনহেরিট হবে</li>
                                </ul>
<p class="note"><b>টিপস:</b> ঋণাত্মক মান অনুমোদিত।</p>
<p>একটি &lt;p&gt; এলিমেন্টের চারটি পাশের জন্য ভিন্ন ভিন্ন মার্জিন সেট করুন:</p>` },
      { id: 'fkyheqKoaA0U', type: 'code', language: 'css', code: 'p {\n  margin-top: 100px;\n  margin-bottom: 100px;\n  margin-right: 150px;\n  margin-left: 80px;\n}' },
      { id: 'Ios181EMGWD6', type: 'richtext', html: '<hr>' },
      { id: '8laTKS_G4HxQ', text: 'মার্জিন - শর্টহ্যান্ড প্রপার্টি', type: 'heading', level: 2, anchor: 'margin---shorthand-property' },
      { id: 'Q_pGa1Kvu-vE', type: 'richtext', html: `<p>কোড ছোট করতে, একটি প্রপার্টিতে সব margin প্রপার্টি নির্ধারণ করা সম্ভব।</p>
<p><code>margin</code> প্রপার্টি হলো নিচের পৃথক margin প্রপার্টিগুলোর একটি শর্টহ্যান্ড প্রপার্টি:</p>
<ul>
                                    <li><code>margin-top</code></li>
                                    <li><code>margin-right</code></li>
                                    <li><code>margin-bottom</code></li>
                                    <li><code>margin-left</code></li>
                                </ul>
<p>তো, এটি এভাবে কাজ করে:</p>
<p><code>margin</code> প্রপার্টিতে <b>চারটি মান</b> থাকলে:</p>
<ul>
                                    <li><b>margin: 25px 50px 75px 100px;</b>
                                        <ul>
                                            <li>উপরের মার্জিন 25px</li>
                                            <li>ডানের মার্জিন 50px</li>
                                            <li>নিচের মার্জিন 75px</li>
                                            <li>বামের মার্জিন 100px</li>
                                        </ul>
                                    </li>
                                </ul>
<p>চারটি মানসহ margin শর্টহ্যান্ড প্রপার্টি ব্যবহার করুন:</p>` },
      { id: 'OtpConGwb3Fy', type: 'code', language: 'css', code: 'p {\n  margin: 25px 50px 75px 100px;\n}' },
      { id: '1f_goxjr6nPg', type: 'richtext', html: `<p><code>margin</code> প্রপার্টিতে তিনটি মান থাকলে:</p>
<ul>
                                    <li><b>margin: 25px 50px 75px;</b>
                                        <ul>
                                            <li>উপরের মার্জিন 25px</li>
                                            <li>ডান ও বামের মার্জিন 50px</li>
                                            <li>নিচের মার্জিন 75px</li>
                                        </ul>
                                    </li>
                                </ul>
<p>তিনটি মানসহ margin শর্টহ্যান্ড প্রপার্টি ব্যবহার করুন:</p>` },
      { id: 'Gs9OZMxvI1wY', type: 'code', language: 'css', code: 'p {\n  margin: 25px 50px 75px;\n}' },
      { id: 'Y8Awq5dzBiBG', type: 'richtext', html: `<p><code>margin</code> প্রপার্টিতে দুটি মান থাকলে:</p>
<ul>
                                    <li><b>margin: 25px 50px;</b>
                                        <ul>
                                            <li>উপর ও নিচের মার্জিন 25px</li>
                                            <li>ডান ও বামের মার্জিন 50px</li>
                                        </ul>
                                    </li>
                                </ul>
<p>দুটি মানসহ margin শর্টহ্যান্ড প্রপার্টি ব্যবহার করুন:</p>` },
      { id: 'zIwEO583TUfd', type: 'code', language: 'css', code: 'p {\n  margin: 25px 50px;\n}' },
      { id: 'DCMhMR1pR3xz', type: 'richtext', html: `<p><code>margin</code> প্রপার্টিতে একটি মান থাকলে:</p>
<ul>
                                    <li><b>margin: 25px;</b>
                                        <ul>
                                            <li>চারটি মার্জিনই 25px</li>
                                        </ul>
                                    </li>
                                </ul>
<p>একটি মানসহ margin শর্টহ্যান্ড প্রপার্টি ব্যবহার করুন:</p>` },
      { id: '3cnzt2TbdyYt', type: 'code', language: 'css', code: 'p {\n  margin: 25px;\n}' },
      { id: 'TUSfY47gPcAX', type: 'richtext', html: '<hr>' },
      { id: '155VWHG0czZe', text: 'auto মান', type: 'heading', level: 2, anchor: 'the-auto-value' },
      { id: 'yBX5OdmolcQA', type: 'richtext', html: '<p>একটি এলিমেন্টকে তার কন্টেইনারের মধ্যে অনুভূমিকভাবে কেন্দ্রীভূত করতে আপনি margin প্রপার্টিকে <code>auto</code>-এ সেট করতে পারেন।</p>\n<p>তখন এলিমেন্টটি নির্দিষ্ট প্রস্থ দখল করবে, এবং অবশিষ্ট জায়গা বাম ও ডান মার্জিনের মধ্যে সমানভাবে ভাগ হবে।</p>\n<p>margin: auto ব্যবহার করুন:</p>' },
      { id: 'SQy2f0VvQ35k', type: 'code', language: 'css', code: 'div {\n  width: 300px;\n  margin: auto;\n  border: 1px solid red;\n}' },
      { id: 'c2IsgiHqjj-P', type: 'richtext', html: '<hr>' },
      { id: 'cpWmf6Ha9TE_', text: 'inherit মান', type: 'heading', level: 2, anchor: 'the-inherit-value' },
      { id: 'dO8KihuRQOjD', type: 'richtext', html: '<p>এই উদাহরণে &lt;p class="ex1"&gt; এলিমেন্টের বামের মার্জিন প্যারেন্ট এলিমেন্ট (&lt;div&gt;) থেকে ইনহেরিট হয়:</p>\n<p>inherit মানের ব্যবহার:</p>' },
      { id: '29YvhKoWzHO3', type: 'code', language: 'css', code: 'div {\n  border: 1px solid red;\n  margin-left: 100px;\n}\np.ex1 {\n  margin-left: inherit;\n}' },
      { id: 'p371EHoc7vP3', type: 'richtext', html: '<hr>' },
      { id: 'yEdoSjbGJoQE', text: 'মার্জিন কোলাপ্স', type: 'heading', level: 2, anchor: 'margin-collapse' },
      { id: '4x6_ebhtHGUw', type: 'richtext', html: '<p>এলিমেন্টের উপরের ও নিচের মার্জিন কখনো কখনো একটি একক মার্জিনে কোলাপ্স হয়ে যায়, যা দুটি মার্জিনের মধ্যে যেটি বড় তার সমান।</p>\n<p>এটি বামের ও ডানের মার্জিনে ঘটে না! শুধুমাত্র উপরের ও নিচের মার্জিনে!</p>\n<p>নিচের উদাহরণটি দেখুন:</p>\n<p>মার্জিন কোলাপ্সের একটি প্রদর্শনী:</p>' },
      { id: 'bErAJokrWHlP', type: 'code', language: 'css', code: 'h1 {\n  margin: 0 0 50px 0;\n}\nh2 {\n  margin: 20px 0 0 0;\n}' },
      { id: '5DlxHFG7uJnw', type: 'richtext', html: '<p>উপরের উদাহরণে, &lt;h1&gt; এলিমেন্টের নিচের মার্জিন 50px এবং &lt;h2&gt; এলিমেন্টের উপরের মার্জিন 20px সেট করা আছে।</p>\n<p>সাধারণ বুদ্ধিতে মনে হতে পারে যে &lt;h1&gt; এবং &lt;h2&gt;-এর মধ্যেকার উল্লম্ব মার্জিন মোট 70px (50px + 20px) হবে। কিন্তু মার্জিন কোলাপ্সের কারণে, প্রকৃত মার্জিন শেষ পর্যন্ত 50px হয়।</p>\n<hr>' },
      { id: 'pm_QZu4vdFhH', text: 'সব CSS Margin প্রপার্টি', type: 'heading', level: 2, anchor: 'all-css-margin-properties' },
      { id: 'xpb2z_BhMXaE', type: 'table', header: ['প্রপার্টি', 'বিবরণ'], rows: [
        ['margin', 'এক ঘোষণায় margin প্রপার্টি সেট করার একটি শর্টহ্যান্ড প্রপার্টি'],
        ['margin-bottom', 'একটি এলিমেন্টের নিচের মার্জিন সেট করে'],
        ['margin-left', 'একটি এলিমেন্টের বামের মার্জিন সেট করে'],
        ['margin-right', 'একটি এলিমেন্টের ডানের মার্জিন সেট করে'],
        ['margin-top', 'একটি এলিমেন্টের উপরের মার্জিন সেট করে'],
      ] },
    ],
    toc: [
      { id: 'css-margins', text: 'CSS মার্জিন', level: 2 },
      { id: 'margin---individual-sides', text: 'মার্জিন - প্রতিটি পাশ আলাদাভাবে', level: 2 },
      { id: 'margin---shorthand-property', text: 'মার্জিন - শর্টহ্যান্ড প্রপার্টি', level: 2 },
      { id: 'the-auto-value', text: 'auto মান', level: 2 },
      { id: 'the-inherit-value', text: 'inherit মান', level: 2 },
      { id: 'margin-collapse', text: 'মার্জিন কোলাপ্স', level: 2 },
      { id: 'all-css-margin-properties', text: 'সব CSS Margin প্রপার্টি', level: 2 },
    ],
  },
]

let ok = 0
for (const d of docs) {
  const { error } = await supabase.from('doc_translations').upsert(
    { doc_id: d.id, locale: 'bn', title: d.title, meta_title: mt(d.title), meta_description: d.meta_description, blocks: d.blocks, toc: d.toc },
    { onConflict: 'doc_id,locale' }
  )
  if (error) { console.error(d.id, error); continue }
  ok++
}
console.log(`css batch4: ${ok}/${docs.length} written`)
