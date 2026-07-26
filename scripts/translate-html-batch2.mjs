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
    id: '254d7fcc-de0a-4cab-aaa2-379ae45dd125', // html/attributes
    title: 'HTML অ্যাট্রিবিউট',
    meta_description: 'HTML অ্যাট্রিবিউট কী, এবং href, src, width, height, alt, style অ্যাট্রিবিউটের ব্যবহার জানুন।',
    blocks: [
      { id: 'ieNdkFwh8Qx9', type: 'richtext', html: '<hr>\n<p>অ্যাট্রিবিউট HTML এলিমেন্ট সম্পর্কে অতিরিক্ত তথ্য প্রদান করে।</p>\n<hr>' },
      { id: 'OtyTo7qvDArq', text: 'HTML অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'html-attributes' },
      { id: 'xnL73SqZ_r07', type: 'richtext', html: `<ul>
                                    <li>সব HTML এলিমেন্টের <b>অ্যাট্রিবিউট</b> থাকতে পারে</li>
                                    <li>অ্যাট্রিবিউট একটি এলিমেন্ট সম্পর্কে <b>অতিরিক্ত তথ্য</b> প্রদান করে</li>
                                    <li>অ্যাট্রিবিউট সবসময় <b>স্টার্ট ট্যাগে</b> উল্লেখ করা হয়</li>
                                    <li>অ্যাট্রিবিউট সাধারণত নাম/মান জোড়া হিসেবে আসে, যেমন: <b>name="value"</b></li>
                                </ul>
<hr>` },
      { id: '6jaN55bHc8Vi', text: 'href অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-href-attribute' },
      { id: 'VzQsRp4Dtmb6', type: 'richtext', html: '<p>HTML লিঙ্ক <code>&lt;a&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়। লিঙ্কের ঠিকানা <code>href</code> অ্যাট্রিবিউটে উল্লেখ করা হয়:</p>' },
      { id: 'wjEvGkm2oSXg', type: 'code', language: 'html', code: '<a href="https://www.learncomputer.in">This is a link.</a>' },
      { id: 'LeiuEiRcmrSX', type: 'richtext', html: '<p>এই টিউটোরিয়ালে পরে লিঙ্ক এবং <code>&lt;a&gt;</code> ট্যাগ সম্পর্কে আরও জানবেন।</p>\n<hr>' },
      { id: 'b5efAVWzjl_u', text: 'src অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-src-attribute' },
      { id: 'ExyDJvLcY7nm', type: 'richtext', html: '<p>HTML ইমেজ <code>&lt;img&gt;</code> ট্যাগ দিয়ে নির্ধারণ করা হয়।</p>\n<p>ইমেজের সোর্স ফাইলের নাম <code>src</code> অ্যাট্রিবিউটে উল্লেখ করা হয়:</p>' },
      { id: 'HmU3n2yv2igl', type: 'code', language: 'html', code: '<img src="img_girl.png">' },
      { id: 'XC7eg1ou0w6s', type: 'richtext', html: '<hr>' },
      { id: 'tkt_yXDIWIcb', text: 'width ও height অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-width-and-height-attributes' },
      { id: 'jUNeYuKSu1IH', type: 'richtext', html: '<p>HTML ইমেজে <code>width</code> এবং <code>height</code> অ্যাট্রিবিউটও থাকে, যা ইমেজের প্রস্থ ও উচ্চতা নির্ধারণ করে:</p>' },
      { id: 'EfEnJvLc7uoZ', type: 'code', language: 'html', code: '<img src="img_girl.jpg" width="500" height="600">' },
      { id: 'H5vD0Wl3TgEA', type: 'richtext', html: '<p>পরের একটি চ্যাপ্টারে অ্যাট্রিবিউট সম্পর্কে আরও জানবেন।</p>\n<p>আমাদের <b>HTML ইমেজ চ্যাপ্টারে</b> ইমেজ সম্পর্কে আরও জানবেন।</p>\n<hr>' },
      { id: '3n2t7gD76psF', text: 'alt অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-alt-attribute' },
      { id: 'Ez89xvYBFl0V', type: 'richtext', html: '<p>একটি ইমেজ প্রদর্শন করা না গেলে ব্যবহারের জন্য <code>alt</code> অ্যাট্রিবিউট একটি বিকল্প টেক্সট নির্ধারণ করে।</p>\n<p><code>alt</code> অ্যাট্রিবিউটের মান স্ক্রিন রিডার দিয়ে পড়া যায়। এভাবে, কেউ যদি ওয়েবপেজটি "শোনেন" (যেমন দৃষ্টি প্রতিবন্ধী কোনো ব্যক্তি), তাহলে তিনি এলিমেন্টটি "শুনতে" পারবেন।</p>' },
      { id: 'R-kZS6UiXnHq', type: 'code', language: 'html', code: '<img src="img_girl.jpg" alt="Girl with a jacket">' },
      { id: 'JLL8d60VIGOI', type: 'richtext', html: '<hr>' },
      { id: 'Ukwq7ma2qvDo', text: 'HTML style অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'the-html-style-attribute' },
      { id: '1bsBjdrWEJkM', type: 'richtext', html: '<p>একটি HTML এলিমেন্টের স্টাইল <code>style</code> অ্যাট্রিবিউট দিয়ে সেট করা যায়।</p>\n<p>HTML <code>style</code> অ্যাট্রিবিউটের <b>সিনট্যাক্স</b> নিম্নরূপ:</p>' },
      { id: 'X42CxoQT7mlx', type: 'code', language: 'html', code: '<tagname style="property:value;">' },
      { id: 'm6p-tkTZOr80', type: 'richtext', html: '<p><b>প্রপার্টি</b> একটি CSS প্রপার্টি। মানটি একটি <b>CSS</b> মান।</p>' },
    ],
    toc: [
      { id: 'html-attributes', text: 'HTML অ্যাট্রিবিউট', level: 2 },
      { id: 'the-href-attribute', text: 'href অ্যাট্রিবিউট', level: 2 },
      { id: 'the-src-attribute', text: 'src অ্যাট্রিবিউট', level: 2 },
      { id: 'the-width-and-height-attributes', text: 'width ও height অ্যাট্রিবিউট', level: 2 },
      { id: 'the-alt-attribute', text: 'alt অ্যাট্রিবিউট', level: 2 },
      { id: 'the-html-style-attribute', text: 'HTML style অ্যাট্রিবিউট', level: 2 },
    ],
  },
  {
    id: 'c2200442-339f-4fe4-a6a8-f72f67c48ab7', // html/filepaths
    title: 'HTML ফাইল পাথ',
    meta_description: 'HTML-এ অ্যাবসোলিউট ও রিলেটিভ ফাইল পাথের পার্থক্য এবং সর্বোত্তম পদ্ধতি জানুন।',
    blocks: [
      { id: 'fAu1PWkTogfD', type: 'richtext', html: '<hr>' },
      { id: 'ygLamsUC06I1', type: 'table', header: ['পাথ', 'বিবরণ'], rows: [
        ['&lt;img src="picture.jpg"&gt;', 'picture.jpg বর্তমান পেজের সাথে একই ফোল্ডারে অবস্থিত'],
        ['&lt;img src="images/picture.jpg"&gt;', 'picture.jpg বর্তমান ফোল্ডারের ভেতরের images ফোল্ডারে অবস্থিত'],
        ['&lt;img src="/images/picture.jpg"&gt;', 'picture.jpg বর্তমান ওয়েবের রুটে থাকা images ফোল্ডারে অবস্থিত'],
        ['&lt;img src="../picture.jpg"&gt;', 'picture.jpg বর্তমান ফোল্ডার থেকে এক ধাপ উপরের ফোল্ডারে অবস্থিত'],
      ] },
      { id: 'fprIKR6Z0aBB', type: 'richtext', html: '<hr>' },
      { id: 'AOIpHRS-2FAP', text: 'HTML ফাইল পাথ', type: 'heading', level: 2, anchor: 'html-file-paths' },
      { id: '8ip3Y0TUXpGI', type: 'richtext', html: `<p>একটি ফাইল পাথ একটি ওয়েবসাইটের ফোল্ডার স্ট্রাকচারে একটি ফাইলের অবস্থান বর্ণনা করে।</p>
<p>বাইরের ফাইলের সাথে লিঙ্ক করার সময় ফাইল পাথ ব্যবহার করা হয়, যেমন:</p>
<ul>
                                    <li>ওয়েব পেজ</li>
                                    <li>ইমেজ</li>
                                    <li>স্টাইল শিট</li>
                                    <li>জাভাস্ক্রিপ্ট </li>
                                </ul>
<hr>` },
      { id: 'KlFvK2MIUtND', text: 'অ্যাবসোলিউট ফাইল পাথ', type: 'heading', level: 2, anchor: 'absolute-file-paths' },
      { id: 'wrPvrQE7oqHO', type: 'richtext', html: '<p>একটি অ্যাবসোলিউট ফাইল পাথ হলো ইন্টারনেটে থাকা একটি ফাইলের সম্পূর্ণ URL:</p>' },
      { id: 'PbkaZReDK3Fx', type: 'code', language: 'html', code: '<img src="https://www.w3schools.com/images/picture.jpg" alt="Mountain">' },
      { id: 'PYOvxAvprYwb', type: 'richtext', html: '<hr>' },
      { id: 'S5sG8tY43V1X', text: 'রিলেটিভ ফাইল পাথ', type: 'heading', level: 2, anchor: 'relative-file-paths' },
      { id: 'pS5_92Ke38iu', type: 'richtext', html: '<p>একটি রিলেটিভ ফাইল পাথ বর্তমান পেজের সাপেক্ষে একটি ফাইলের দিকে নির্দেশ করে।</p>\n<p>এই উদাহরণে, ফাইল পাথটি বর্তমান ওয়েবের রুটে থাকা images ফোল্ডারের একটি ফাইলের দিকে নির্দেশ করছে:</p>' },
      { id: 'n7HoIXQ5ADGx', type: 'code', language: 'html', code: '<img src="/images/picture.jpg" alt="Mountain">' },
      { id: 'ErjQ_WvZq4Wj', type: 'richtext', html: '<p>এই উদাহরণে, ফাইল পাথটি বর্তমান ফোল্ডারে থাকা images ফোল্ডারের একটি ফাইলের দিকে নির্দেশ করছে:</p>' },
      { id: '_gmOVpNL08hx', type: 'code', language: 'html', code: '<img src="images/picture.jpg" alt="Mountain">' },
      { id: 'EyGcAIE2rmBc', type: 'richtext', html: '<p>এই উদাহরণে, ফাইল পাথটি বর্তমান ফোল্ডার থেকে এক ধাপ উপরের ফোল্ডারে থাকা images ফোল্ডারের একটি ফাইলের দিকে নির্দেশ করছে:</p>' },
      { id: 'XgLJ--ULVUjC', type: 'code', language: 'html', code: '<img src="../images/picture.jpg" alt="Mountain">' },
      { id: 'gokXQEG83QBz', type: 'richtext', html: '<hr>' },
      { id: 'm9m9IFDR8BTu', text: 'সর্বোত্তম পদ্ধতি', type: 'heading', level: 2, anchor: 'best-practice' },
      { id: 'hb-N04wCxM61', type: 'richtext', html: '<p>সম্ভব হলে রিলেটিভ ফাইল পাথ ব্যবহার করাই সর্বোত্তম পদ্ধতি।</p>\n<p>রিলেটিভ ফাইল পাথ ব্যবহার করলে, আপনার ওয়েব পেজগুলো আপনার বর্তমান বেস URL-এর সাথে বাঁধা থাকবে না। সব লিঙ্ক আপনার নিজের কম্পিউটারে (লোকালহোস্ট) যেমন কাজ করবে, তেমনি আপনার বর্তমান পাবলিক ডোমেইন এবং ভবিষ্যতের পাবলিক ডোমেইনেও কাজ করবে।</p>' },
    ],
    toc: [
      { id: 'html-file-paths', text: 'HTML ফাইল পাথ', level: 2 },
      { id: 'absolute-file-paths', text: 'অ্যাবসোলিউট ফাইল পাথ', level: 2 },
      { id: 'relative-file-paths', text: 'রিলেটিভ ফাইল পাথ', level: 2 },
      { id: 'best-practice', text: 'সর্বোত্তম পদ্ধতি', level: 2 },
    ],
  },
  {
    id: '76a93828-67a2-4cfe-95ce-6d7f3f9f3aff', // html/html5-intro
    title: 'HTML5 পরিচিতি',
    meta_description: 'HTML5-এ নতুন কী এসেছে, নতুন এলিমেন্ট এবং ডিফল্ট ক্যারেক্টার এনকোডিং সম্পর্কে জানুন।',
    blocks: [
      { id: 'hu7U3NkKZDTR', type: 'richtext', html: '<hr>' },
      { id: 'Y2TcFSCX39l5', text: 'HTML5-এ নতুন কী আছে?', type: 'heading', level: 2, anchor: 'what-is-new-in-html5' },
      { id: '22ofDAZQTlkH', type: 'code', language: 'html', code: '<!DOCTYPE html>' },
      { id: 'c6f6Eb16H1PB', type: 'richtext', html: '<p>ক্যারেক্টার এনকোডিং (charset) ঘোষণাও খুবই সহজ:</p>' },
      { id: '0Z096gGHeKDq', type: 'code', language: 'html', code: '<meta charset="UTF-8">' },
      { id: 't2MDibyZ7ecw', type: 'richtext', html: '<hr>' },
      { id: 'JDi8P15YUwpi', text: 'একটি সাধারণ HTML ডকুমেন্ট', type: 'heading', level: 2, anchor: 'a-simple-html-document' },
      { id: 't7KGPT6v7vlx', type: 'code', language: 'html', code: '<!DOCTYPE html>\n<html>\n    <head>\n        <title>Title of the document</title>\n    </head>\n\n    <body>\n        Content of the document......\n    </body>\n</html>' },
      { id: 'QSAwdH_Xf5nQ', type: 'richtext', html: '<p>HTML5-এ ডিফল্ট ক্যারেক্টার এনকোডিং হলো UTF-8।</p>\n<hr>' },
      { id: 'Dfl15l6SdcQn', text: 'নতুন HTML5 এলিমেন্ট', type: 'heading', level: 2, anchor: 'new-html5-elements' },
      { id: 'KxL130kVqAm5', type: 'richtext', html: '<p>সবচেয়ে আকর্ষণীয় নতুন HTML5 এলিমেন্টগুলো হলো:</p>\n<p>নতুন <b>সিমান্টিক এলিমেন্ট</b>, যেমন <code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;article&gt;</code>, এবং <code>&lt;section&gt;</code>। </p>\n<p>ফর্ম এলিমেন্টের নতুন <b>অ্যাট্রিবিউট</b>, যেমন <b>number</b>, <b>date</b>, <b>time</b>, <b>calendar</b>, এবং <b>range</b>। </p>\n<p>নতুন <b>গ্রাফিক এলিমেন্ট</b>: <code>&lt;svg&gt;</code> এবং <code>&lt;canvas&gt;</code>। </p>\n<p>নতুন <b>মাল্টিমিডিয়া এলিমেন্ট</b>: <code>&lt;audio&gt;</code> এবং <code>&lt;video&gt;</code>। </p>' },
    ],
    toc: [
      { id: 'what-is-new-in-html5', text: 'HTML5-এ নতুন কী আছে?', level: 2 },
      { id: 'a-simple-html-document', text: 'একটি সাধারণ HTML ডকুমেন্ট', level: 2 },
      { id: 'new-html5-elements', text: 'নতুন HTML5 এলিমেন্ট', level: 2 },
    ],
  },
  {
    id: '5510d23b-77d5-4811-8e8d-83009e629a6d', // html/intro
    title: 'HTML পরিচিতি',
    meta_description: 'HTML কী, HTML ট্যাগ কীভাবে কাজ করে এবং একটি সাধারণ HTML ডকুমেন্টের গঠন জানুন।',
    blocks: [
      { id: 'XyUPP0ecK7eE', type: 'richtext', html: '<hr>' },
      { id: 'tKZMTATDsByo', text: 'HTML কী?', type: 'heading', level: 2, anchor: 'what-is-html' },
      { id: '2Dtf0msVTiBU', type: 'richtext', html: `<p>HTML হলো ওয়েব পেজ তৈরির জন্য স্ট্যান্ডার্ড মার্কআপ ল্যাঙ্গুয়েজ।</p>
<ul>
                                    <li>HTML মানে হাইপার টেক্সট মার্কআপ ল্যাঙ্গুয়েজ</li>
                                    <li>HTML একটি ওয়েব পেজের স্ট্রাকচার বর্ণনা করে</li>
                                    <li>HTML বিভিন্ন এলিমেন্টের সমষ্টি নিয়ে গঠিত</li>
                                    <li>HTML এলিমেন্ট ব্রাউজারকে বলে দেয় কীভাবে কনটেন্ট প্রদর্শন করতে হবে</li>
                                    <li>HTML এলিমেন্ট ট্যাগ দিয়ে প্রকাশ করা হয়</li>
                                    <li>HTML ট্যাগ কনটেন্টের অংশগুলোকে লেবেল করে, যেমন "হেডিং", "প্যারাগ্রাফ", "টেবিল" ইত্যাদি</li>
                                    <li>ব্রাউজার HTML ট্যাগ প্রদর্শন করে না, কিন্তু পেজের কনটেন্ট রেন্ডার করতে সেগুলো ব্যবহার করে</li>
                                </ul>
<hr>` },
      { id: 'wQXyC_nAgjLU', text: 'একটি সাধারণ HTML ডকুমেন্ট', type: 'heading', level: 2, anchor: 'a-simple-html-document' },
      { id: 'IZtJ1l9oCdIe', type: 'code', language: 'html', code: '<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n<h1>My First Heading</h1>\n<p>My first paragraph.</p>\n</body>\n</html>' },
      { id: 'XrRMMtO-Um6Y', text: 'উদাহরণের ব্যাখ্যা', type: 'heading', level: 3, anchor: 'example-explained' },
      { id: '52voA8PykMay', type: 'richtext', html: `<ul>
                                <li><code>&lt;!DOCTYPE html&gt;</code> ঘোষণাটি এই ডকুমেন্টকে HTML5 হিসেবে নির্ধারণ করে</li>
                                <li><code>&lt;html&gt;</code> এলিমেন্ট একটি HTML পেজের রুট এলিমেন্ট</li>
                                <li><code>&lt;head&gt;</code> এলিমেন্টে ডকুমেন্ট সম্পর্কিত মেটা তথ্য থাকে</li>
                                <li><code>&lt;title&gt;</code> এলিমেন্ট ডকুমেন্টের জন্য একটি টাইটেল নির্ধারণ করে</li>
                                <li><code>&lt;body&gt;</code> এলিমেন্টে দৃশ্যমান পেজ কনটেন্ট থাকে</li>
                                <li><code>&lt;h1&gt;</code> এলিমেন্ট একটি বড় হেডিং নির্ধারণ করে</li>
                                <li><code>&lt;p&gt;</code> এলিমেন্ট একটি প্যারাগ্রাফ নির্ধারণ করে</li>
                            </ul>
<hr>` },
      { id: 'Ix5SlhFpDZ_6', text: 'HTML ট্যাগ', type: 'heading', level: 2, anchor: 'html-tags' },
      { id: '7ntmOARuC0_P', type: 'richtext', html: '<p>HTML ট্যাগ হলো অ্যাঙ্গেল ব্র্যাকেট দিয়ে ঘেরা এলিমেন্টের নাম:</p>' },
      { id: 'nhIq3M3Q7QrL', type: 'code', language: 'html', code: '<tagname>content goes here...</tagname>' },
      { id: 'OsurRRhE6j_Q', type: 'richtext', html: `<ul>
                                <li>HTML ট্যাগ সাধারণত <code>&lt;p&gt;</code> এবং <code>&lt;/p&gt;</code>-এর মতো <b>জোড়ায় জোড়ায়</b> আসে</li>
                                <li>একটি জোড়ার প্রথম ট্যাগটি হলো <b>স্টার্ট ট্যাগ</b>, দ্বিতীয়টি হলো <b>এন্ড ট্যাগ</b></li>
                                <li>এন্ড ট্যাগ স্টার্ট ট্যাগের মতোই লেখা হয়, তবে ট্যাগের নামের আগে একটি <b>ফরোয়ার্ড স্ল্যাশ</b> যোগ করা হয়</li>
                            </ul>
<p><b>টিপস:</b> স্টার্ট ট্যাগকে <b>ওপেনিং ট্যাগ</b> এবং এন্ড ট্যাগকে <b>ক্লোজিং ট্যাগ</b>ও বলা হয়।</p>` },
    ],
    toc: [
      { id: 'what-is-html', text: 'HTML কী?', level: 2 },
      { id: 'a-simple-html-document', text: 'একটি সাধারণ HTML ডকুমেন্ট', level: 2 },
      { id: 'example-explained', text: 'উদাহরণের ব্যাখ্যা', level: 3 },
      { id: 'html-tags', text: 'HTML ট্যাগ', level: 2 },
    ],
  },
  {
    id: '97e3fd94-ec42-4595-baf8-6709fb7e0891', // html/lists
    title: 'HTML লিস্ট',
    meta_description: 'HTML-এ আনঅর্ডার্ড ও অর্ডার্ড লিস্ট এবং তাদের মার্কার ও টাইপ অ্যাট্রিবিউট কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'HpJfdF19BiqJ', type: 'richtext', html: '<hr>' },
      { id: 'jlNM1bjoKJTE', text: 'আনঅর্ডার্ড HTML লিস্ট', type: 'heading', level: 2, anchor: 'unordered-html-list' },
      { id: 'gU6I_lwKOxM2', type: 'richtext', html: '<p>একটি আনঅর্ডার্ড লিস্ট <code>&lt;ul&gt;</code> ট্যাগ দিয়ে শুরু হয়। প্রতিটি লিস্ট আইটেম <code>&lt;li&gt;</code> ট্যাগ দিয়ে শুরু হয়।</p>\n<p>লিস্ট আইটেমগুলো ডিফল্টভাবে বুলেট (ছোট কালো বৃত্ত) দিয়ে চিহ্নিত হবে:</p>' },
      { id: 'RlG8Qtgng0K1', type: 'code', language: 'html', code: '<ul>\n    <li>Coffee</li>\n    <li>Tea</li>\n    <li>Milk</li>\n</ul>' },
      { id: 'VC-Qc4S-nNZG', type: 'richtext', html: '<hr>' },
      { id: 'TonbCtaI8v2o', text: 'আনঅর্ডার্ড HTML লিস্ট - লিস্ট আইটেম মার্কার বেছে নেওয়া', type: 'heading', level: 2, anchor: 'unordered-html-list---choose-list-item-marker' },
      { id: 'gb-UsRwlPbtX', type: 'richtext', html: '<p>লিস্ট আইটেম মার্কারের স্টাইল নির্ধারণ করতে CSS-এর <code>list-style-type</code> প্রপার্টি ব্যবহার করা হয়:</p>' },
      { id: 'jE9kCFmmzDHs', type: 'table', header: ['মান', 'বিবরণ'], rows: [
        ['disc', 'লিস্ট আইটেম মার্কারকে বুলেট হিসেবে সেট করে (ডিফল্ট)'],
        ['circle', 'লিস্ট আইটেম মার্কারকে বৃত্ত হিসেবে সেট করে'],
        ['square', 'লিস্ট আইটেম মার্কারকে বর্গক্ষেত্র হিসেবে সেট করে'],
        ['none', 'লিস্ট আইটেমগুলো চিহ্নিত করা হবে না'],
      ] },
      { id: 'lzxsOp-frK2v', type: 'richtext', html: '<hr>' },
      { id: 'KMzFT2fOojbR', type: 'code', language: 'html', code: '<ul style="list-style-type:disc;">\n    <li>Coffee</li>\n    <li>Tea</li>\n    <li>Milk</li>\n</ul>' },
      { id: '5UXHmJbMIv2L', type: 'richtext', html: '<hr>' },
      { id: 'hde5wck3kCnc', text: 'অর্ডার্ড HTML লিস্ট', type: 'heading', level: 2, anchor: 'ordered-html-list' },
      { id: '7X59vI2z9nYw', type: 'richtext', html: '<p>একটি অর্ডার্ড লিস্ট <code>&lt;ol&gt;</code> ট্যাগ দিয়ে শুরু হয়। প্রতিটি লিস্ট আইটেম <code>&lt;li&gt;</code> ট্যাগ দিয়ে শুরু হয়।</p>\n<p>লিস্ট আইটেমগুলো ডিফল্টভাবে সংখ্যা দিয়ে চিহ্নিত হবে:</p>' },
      { id: '6qMBkCsu8QOo', type: 'code', language: 'html', code: '<ol>\n    <li>Coffee</li>\n    <li>Tea</li>\n    <li>Milk</li>\n</ol>' },
      { id: 'vqvCOK4LwY7z', type: 'richtext', html: '<hr>' },
      { id: '3KdLmfh3_0Sc', text: 'অর্ডার্ড HTML লিস্ট - Type অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'ordered-html-list---the-type-attribute' },
      { id: 'uF4EYljbVu4J', type: 'richtext', html: '<p><code>&lt;ol&gt;</code> ট্যাগের type অ্যাট্রিবিউট লিস্ট আইটেম মার্কারের ধরন নির্ধারণ করে:</p>' },
      { id: 'mki3Iol-bJmb', type: 'table', header: ['Type', 'বিবরণ'], rows: [
        ['type="1"', 'লিস্ট আইটেমগুলো সংখ্যা দিয়ে ক্রমিক নম্বর পাবে (ডিফল্ট)'],
        ['type="A"', 'লিস্ট আইটেমগুলো বড় হাতের অক্ষর দিয়ে ক্রমিক নম্বর পাবে'],
        ['type="a"', 'লিস্ট আইটেমগুলো ছোট হাতের অক্ষর দিয়ে ক্রমিক নম্বর পাবে'],
        ['type="I"', 'লিস্ট আইটেমগুলো বড় হাতের রোমান সংখ্যা দিয়ে ক্রমিক নম্বর পাবে'],
        ['type="i"', 'লিস্ট আইটেমগুলো ছোট হাতের রোমান সংখ্যা দিয়ে ক্রমিক নম্বর পাবে'],
      ] },
      { id: 'N1BHyZy6cBiT', type: 'code', language: 'html', code: '<ol type="1">\n    <li>Coffee</li>\n    <li>Tea</li>\n    <li>Milk</li>\n</ol>' },
    ],
    toc: [
      { id: 'unordered-html-list', text: 'আনঅর্ডার্ড HTML লিস্ট', level: 2 },
      { id: 'unordered-html-list---choose-list-item-marker', text: 'আনঅর্ডার্ড HTML লিস্ট - লিস্ট আইটেম মার্কার বেছে নেওয়া', level: 2 },
      { id: 'ordered-html-list', text: 'অর্ডার্ড HTML লিস্ট', level: 2 },
      { id: 'ordered-html-list---the-type-attribute', text: 'অর্ডার্ড HTML লিস্ট - Type অ্যাট্রিবিউট', level: 2 },
    ],
  },
  {
    id: '42c1ce33-cc62-4235-a327-b518270fe8fd', // html/tag-aside
    title: 'Aside ট্যাগ',
    meta_description: '&lt;aside&gt; ট্যাগ কী, কোথায় ব্যবহার করবেন এবং এর ডিফল্ট CSS সেটিংস জানুন।',
    blocks: [
      { id: 'I_n1FDOC9D74', type: 'richtext', html: '<hr>' },
      { id: 'dyWiHIhRk493', type: 'code', language: 'html', code: '<p>My family and I visited The Epcot center this summer.</p>\n\n<aside>\n  <h4>Epcot Center</h4>\n  <p>The Epcot Center is a theme park in Disney World, Florida.</p>\n</aside>' },
      { id: 'kuUyMC_q3cUK', type: 'richtext', html: '<hr>' },
      { id: 'ovLf0Vxk8-re', text: 'সংজ্ঞা ও ব্যবহার', type: 'heading', level: 2, anchor: 'definition-and-usage' },
      { id: 'W8ieCWgXQkCs', type: 'richtext', html: '<p>&lt;aside&gt; ট্যাগ এমন কিছু কনটেন্ট নির্ধারণ করে, যা যেই কনটেন্টের ভেতরে এটি রাখা হয়েছে তার থেকে আলাদা।</p>\n<p>Aside কনটেন্ট আশেপাশের কনটেন্টের সাথে সম্পর্কিত হওয়া উচিত।</p>\n<hr>' },
      { id: 'K8Cu6GU39ogA', text: 'HTML 4.01 এবং HTML5-এর মধ্যে পার্থক্য', type: 'heading', level: 2, anchor: 'differences-between-html-401-and-html5' },
      { id: 'Iv5ZHHFBcn1i', type: 'richtext', html: '<p>&lt;aside&gt; ট্যাগটি HTML5-এ নতুন।</p>\n<hr>' },
      { id: '2GPM4RWt0Eoe', text: 'টিপস ও মন্তব্য', type: 'heading', level: 2, anchor: 'tips-and-notes' },
      { id: 'LzvoRFVREoEf', type: 'richtext', html: '<p>টিপস: &lt;aside&gt; কনটেন্ট একটি আর্টিকেলে সাইডবার হিসেবে রাখা যেতে পারে।</p>\n<hr>' },
      { id: 'YvpX7JdgbCkn', text: 'গ্লোবাল অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'global-attributes' },
      { id: 'QZVi0dFDhFUb', type: 'richtext', html: '<p>&lt;aside&gt; ট্যাগও HTML-এর গ্লোবাল অ্যাট্রিবিউট সমর্থন করে।</p>\n<hr>' },
      { id: 'U89i267yhxkg', text: 'ইভেন্ট অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'event-attributes' },
      { id: 'GuVkx4h9YSP3', type: 'richtext', html: '<p>&lt;aside&gt; ট্যাগও HTML-এর ইভেন্ট অ্যাট্রিবিউট সমর্থন করে।</p>\n<hr>' },
      { id: 'zNwP_rxXBP28', text: 'ডিফল্ট CSS সেটিংস', type: 'heading', level: 2, anchor: 'default-css-settings' },
      { id: 'ohJYpRSSwfoC', type: 'richtext', html: '<p>বেশিরভাগ ব্রাউজার &lt;figcaption&gt; এলিমেন্টকে নিচের ডিফল্ট মান দিয়ে প্রদর্শন করবে:</p>' },
      { id: '6C5VCisVp7Yv', type: 'code', language: 'css', code: 'figcaption {\n  display: block;\n}' },
    ],
    toc: [
      { id: 'definition-and-usage', text: 'সংজ্ঞা ও ব্যবহার', level: 2 },
      { id: 'differences-between-html-401-and-html5', text: 'HTML 4.01 এবং HTML5-এর মধ্যে পার্থক্য', level: 2 },
      { id: 'tips-and-notes', text: 'টিপস ও মন্তব্য', level: 2 },
      { id: 'global-attributes', text: 'গ্লোবাল অ্যাট্রিবিউট', level: 2 },
      { id: 'event-attributes', text: 'ইভেন্ট অ্যাট্রিবিউট', level: 2 },
      { id: 'default-css-settings', text: 'ডিফল্ট CSS সেটিংস', level: 2 },
    ],
  },
  {
    id: 'bf47a2d7-2b6f-4b70-87ab-68af7fd1b14a', // html/tag-figcaption
    title: 'Figcaption ট্যাগ',
    meta_description: '&lt;figcaption&gt; ট্যাগ দিয়ে &lt;figure&gt; এলিমেন্টের ক্যাপশন কীভাবে যোগ করবেন তা জানুন।',
    blocks: [
      { id: 'MBAAOu-iWvBj', type: 'richtext', html: '<hr>\n<p>একটি ডকুমেন্টে ছবি মার্কআপ করতে &lt;figure&gt; এলিমেন্ট ব্যবহার করুন।</p>\n<p>&lt;figure&gt; এলিমেন্টে একটি &lt;figcaption&gt;ও থাকতে পারে:</p>' },
      { id: 'VZP6s0yr1aSw', type: 'code', language: 'html', code: '<figure>\n  <img src="pic_trulli.jpg" alt="Trulli" style="width:100%">\n  <figcaption>Fig.1 - Trulli, Puglia, Italy.</figcaption>\n</figure>' },
      { id: 'OTkgHzE4F3Qu', type: 'richtext', html: '<hr>' },
      { id: 'VaM3mea3wBZt', text: 'সংজ্ঞা ও ব্যবহার', type: 'heading', level: 2, anchor: 'definition-and-usage' },
      { id: '9RKRUBxr5jPv', type: 'richtext', html: '<p>&lt;figcaption&gt; ট্যাগ একটি &lt;figure&gt; এলিমেন্টের জন্য একটি ক্যাপশন নির্ধারণ করে।</p>\n<p>&lt;figcaption&gt; এলিমেন্টটি &lt;figure&gt; এলিমেন্টের প্রথম বা শেষ চাইল্ড হিসেবে রাখা যেতে পারে।</p>\n<hr>' },
      { id: 'RgHx-5nmlA--', text: 'HTML 4.01 এবং HTML5-এর মধ্যে পার্থক্য', type: 'heading', level: 2, anchor: 'differences-between-html-401-and-html5' },
      { id: '867tG2_rK6z6', type: 'richtext', html: '<p>&lt;figcaption&gt; ট্যাগটি HTML5-এ নতুন।</p>\n<hr>' },
      { id: '1sUWCSQSAv6b', text: 'গ্লোবাল অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'global-attributes' },
      { id: 'h8ob7swYG_ra', type: 'richtext', html: '<p>&lt;figcaption&gt; ট্যাগও HTML-এর গ্লোবাল অ্যাট্রিবিউট সমর্থন করে।</p>\n<hr>' },
      { id: 's3dqTXxxZ3VB', text: 'ইভেন্ট অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'event-attributes' },
      { id: 'qwRN_kzJMxHD', type: 'richtext', html: '<p>&lt;figcaption&gt; ট্যাগও HTML-এর ইভেন্ট অ্যাট্রিবিউট সমর্থন করে।</p>\n<hr>' },
      { id: 'ZXXUBAsY_FPQ', text: 'ডিফল্ট CSS সেটিংস', type: 'heading', level: 2, anchor: 'default-css-settings' },
      { id: 'jHpGv8yaPyfz', type: 'richtext', html: '<p>বেশিরভাগ ব্রাউজার &lt;aside&gt; এলিমেন্টকে নিচের ডিফল্ট মান দিয়ে প্রদর্শন করবে:</p>' },
      { id: 'O7mT9LiKuDXP', type: 'code', language: 'css', code: 'aside {\n  display: block;\n}' },
    ],
    toc: [
      { id: 'definition-and-usage', text: 'সংজ্ঞা ও ব্যবহার', level: 2 },
      { id: 'differences-between-html-401-and-html5', text: 'HTML 4.01 এবং HTML5-এর মধ্যে পার্থক্য', level: 2 },
      { id: 'global-attributes', text: 'গ্লোবাল অ্যাট্রিবিউট', level: 2 },
      { id: 'event-attributes', text: 'ইভেন্ট অ্যাট্রিবিউট', level: 2 },
      { id: 'default-css-settings', text: 'ডিফল্ট CSS সেটিংস', level: 2 },
    ],
  },
  {
    id: '38a1daea-e0f7-4665-a1d8-24d61acbbb4f', // html/tag-figure
    title: 'Figure ট্যাগ',
    meta_description: '&lt;figure&gt; ট্যাগ কী এবং স্বয়ংসম্পূর্ণ কনটেন্টের জন্য কীভাবে ব্যবহার করবেন তা জানুন।',
    blocks: [
      { id: 'R26sfby-Yhn5', type: 'richtext', html: '<hr>\n<p>একটি ডকুমেন্টে ছবি মার্কআপ করতে &lt;figure&gt; এলিমেন্ট ব্যবহার করুন।</p>' },
      { id: '-tdbGbQnmK7Z', type: 'code', language: 'html', code: '<figure>\n  <img src="pic_trulli.jpg" alt="Trulli" style="width:100%">\n</figure>' },
      { id: 'hJjkBKGj5sHZ', type: 'richtext', html: '<hr>' },
      { id: 'UqBpeySbOkUF', text: 'সংজ্ঞা ও ব্যবহার', type: 'heading', level: 2, anchor: 'definition-and-usage' },
      { id: 'RZmaxfm2Q7z3', type: 'richtext', html: '<p>&lt;figure&gt; ট্যাগ স্বয়ংসম্পূর্ণ কনটেন্ট নির্ধারণ করে, যেমন ইলাস্ট্রেশন, ডায়াগ্রাম, ছবি, কোড লিস্টিং ইত্যাদি।</p>\n<p>&lt;figure&gt; এলিমেন্টের কনটেন্ট মূল প্রবাহের সাথে সম্পর্কিত হলেও, এর অবস্থান মূল প্রবাহ থেকে স্বতন্ত্র, এবং একে সরিয়ে ফেললেও ডকুমেন্টের প্রবাহে কোনো প্রভাব পড়া উচিত নয়।</p>\n<hr>' },
      { id: 'Fmgek17DQ1if', text: 'HTML 4.01 এবং HTML5-এর মধ্যে পার্থক্য', type: 'heading', level: 2, anchor: 'differences-between-html-401-and-html5' },
      { id: 'HrU8ZloXswuF', type: 'richtext', html: '<p>&lt;figure&gt; ট্যাগটি HTML5-এ নতুন।</p>\n<hr>' },
      { id: 'wAIySG09r4oC', text: 'টিপস ও মন্তব্য', type: 'heading', level: 2, anchor: 'tips-and-notes' },
      { id: 'umzOQK3EfTmh', type: 'richtext', html: '<p>টিপস: &lt;figure&gt; এলিমেন্টের জন্য একটি ক্যাপশন যোগ করতে &lt;figcaption&gt; এলিমেন্ট ব্যবহার করা হয়।</p>\n<hr>' },
      { id: 'sa7pAV4_DzXQ', text: 'গ্লোবাল অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'global-attributes' },
      { id: 'aDo_-EkgF3xn', type: 'richtext', html: '<p>&lt;figure&gt; ট্যাগও HTML-এর গ্লোবাল অ্যাট্রিবিউট সমর্থন করে।</p>\n<hr>' },
      { id: 'bj8TZQjYd-U1', text: 'ইভেন্ট অ্যাট্রিবিউট', type: 'heading', level: 2, anchor: 'event-attributes' },
      { id: 'Tlk9TxscjUEL', type: 'richtext', html: '<p>&lt;figure&gt; ট্যাগও HTML-এর ইভেন্ট অ্যাট্রিবিউট সমর্থন করে।</p>\n<hr>' },
      { id: '6kNrEKXOgFsM', text: 'ডিফল্ট CSS সেটিংস', type: 'heading', level: 2, anchor: 'default-css-settings' },
      { id: 'EI1a4Ze7hcJl', type: 'richtext', html: '<p>বেশিরভাগ ব্রাউজার &lt;aside&gt; এলিমেন্টকে নিচের ডিফল্ট মান দিয়ে প্রদর্শন করবে:</p>' },
      { id: 'G3LmL1vGRbwC', type: 'code', language: 'css', code: 'figure {\n  display: block;\n  margin-top: 1em;\n  margin-bottom: 1em;\n  margin-left: 40px;\n  margin-right: 40px;\n}' },
    ],
    toc: [
      { id: 'definition-and-usage', text: 'সংজ্ঞা ও ব্যবহার', level: 2 },
      { id: 'differences-between-html-401-and-html5', text: 'HTML 4.01 এবং HTML5-এর মধ্যে পার্থক্য', level: 2 },
      { id: 'tips-and-notes', text: 'টিপস ও মন্তব্য', level: 2 },
      { id: 'global-attributes', text: 'গ্লোবাল অ্যাট্রিবিউট', level: 2 },
      { id: 'event-attributes', text: 'ইভেন্ট অ্যাট্রিবিউট', level: 2 },
      { id: 'default-css-settings', text: 'ডিফল্ট CSS সেটিংস', level: 2 },
    ],
  },
  {
    id: 'a448e196-a9a5-412f-921c-8c1c7d5b3907', // html/tag-video
    title: 'Video ট্যাগ',
    meta_description: 'HTML5-এর &lt;video&gt; এলিমেন্ট দিয়ে ভিডিও এমবেড ও অটোপ্লে করা এবং JS দিয়ে নিয়ন্ত্রণ করা শিখুন।',
    blocks: [
      { id: 'yR3latTac5Lx', type: 'richtext', html: '<hr>' },
      { id: 'RLXT3ysZOU-5', text: 'HTML-এ ভিডিও চালানো', type: 'heading', level: 2, anchor: 'playing-videos-in-html' },
      { id: 'psEzFPhBQ-rT', type: 'richtext', html: `<p>HTML5-এর আগে, একটি ভিডিও শুধুমাত্র প্লাগইনের (যেমন flash) মাধ্যমে ব্রাউজারে চালানো যেত।</p>
<p>HTML5-এর <code>&lt;video&gt;</code> এলিমেন্ট একটি ওয়েব পেজে ভিডিও এমবেড করার একটি স্ট্যান্ডার্ড পদ্ধতি নির্ধারণ করে।</p>
<video width="100%" height="auto" controls="" autoplay="">
                                  <source src="/assets/img/movie.mp4" type="video/mp4">
                                  <source src="/assets/img/movie.ogg" type="video/ogg">
                                আপনার ব্রাউজার ভিডিও ট্যাগ সমর্থন করে না।
                                </video>
<hr>` },
      { id: 'MGQLaWgIafrQ', text: 'HTML <video> এলিমেন্ট', type: 'heading', level: 2, anchor: 'the-html-video-element' },
      { id: '6GxL3XNrcNLI', type: 'richtext', html: '<p>HTML-এ একটি ভিডিও দেখাতে, &lt;video&gt; এলিমেন্ট ব্যবহার করুন:</p>' },
      { id: '4nyD7uYBA5mz', type: 'code', language: 'html', code: '<video width="320" height="240" controls>\n  <source src="movie.mp4" type="video/mp4">\n  <source src="movie.ogg" type="video/ogg">\nYour browser does not support the video tag.\n</video>' },
      { id: 'cUiyYyspFta5', type: 'richtext', html: '<hr>' },
      { id: 's0Z2ClFHXRrT', text: 'এটি কীভাবে কাজ করে', type: 'heading', level: 2, anchor: 'how-it-works' },
      { id: '-eLjvntAFv01', type: 'richtext', html: '<p>controls অ্যাট্রিবিউট প্লে, পজ এবং ভলিউমের মতো ভিডিও কন্ট্রোল যোগ করে।</p>\n<p>সবসময় width এবং height অ্যাট্রিবিউট যোগ করা ভালো অভ্যাস। height এবং width সেট করা না থাকলে, ভিডিও লোড হওয়ার সময় পেজ ফ্লিকার করতে পারে।</p>\n<p><code>&lt;source&gt;</code> এলিমেন্টের মাধ্যমে আপনি একাধিক বিকল্প ভিডিও ফাইল উল্লেখ করতে পারেন, যেখান থেকে ব্রাউজার বেছে নিতে পারে। ব্রাউজার প্রথম যে ফরম্যাটটি চিনতে পারবে সেটিই ব্যবহার করবে।</p>\n<p><code>&lt;video&gt;</code> এবং <code>&lt;/video&gt;</code> ট্যাগের মধ্যবর্তী টেক্সট শুধুমাত্র সেইসব ব্রাউজারে দেখানো হবে যেগুলো <code>&lt;video&gt;</code> এলিমেন্ট সমর্থন করে না।</p>\n<hr>' },
      { id: 'jPEOJ07QYYj6', text: 'HTML <video> অটোপ্লে', type: 'heading', level: 2, anchor: 'html-video-autoplay' },
      { id: 'NdEC2Z_lBlDu', type: 'richtext', html: '<p>একটি ভিডিও স্বয়ংক্রিয়ভাবে শুরু করতে autoplay অ্যাট্রিবিউট ব্যবহার করুন:</p>' },
      { id: 'rDAB3tvuXh-D', type: 'code', language: 'html', code: '<video width="320" height="240" autoplay>\n  <source src="movie.mp4" type="video/mp4">\n  <source src="movie.ogg" type="video/ogg">\nYour browser does not support the video tag.\n</video>' },
      { id: '49oNabh2HqMj', type: 'richtext', html: '<p class="note">iPad এবং iPhone-এর মতো মোবাইল ডিভাইসে autoplay অ্যাট্রিবিউট কাজ করে না।</p>\n<hr>' },
      { id: 'FgYILD3BUano', text: 'HTML ভিডিও - মেথড, প্রপার্টি এবং ইভেন্ট', type: 'heading', level: 2, anchor: 'html-video---methods-properties-and-events' },
      { id: '5YcDmOY14kNk', type: 'richtext', html: `<p>HTML5 <code>&lt;video&gt;</code> এলিমেন্টের জন্য DOM মেথড, প্রপার্টি এবং ইভেন্ট নির্ধারণ করে।</p>
<p>এর মাধ্যমে আপনি ভিডিও লোড, প্লে এবং পজ করতে পারবেন, পাশাপাশি duration ও volume সেট করতে পারবেন।</p>
<p>এমন কিছু DOM ইভেন্টও আছে, যেগুলো একটি ভিডিও প্লে হওয়া শুরু করলে, পজ হলে ইত্যাদি ক্ষেত্রে আপনাকে জানাতে পারে।</p>
<button onclick="playPause()" class="btn btn-primary">Play/Pause</button>
<button onclick="makeBig()" class="btn btn-primary">Big</button>
<button onclick="makeSmall()" class="btn btn-primary">Small</button>
<button onclick="makeNormal()" class="btn btn-primary">Normal</button>
<br>
<br>
<video id="video1" width="420">
                                    <source src="/assets/img/movie.mp4" type="video/mp4">
                                    <source src="/assets/img/movie.ogg" type="video/ogg">
                                    আপনার ব্রাউজার HTML5 ভিডিও সমর্থন করে না।
                                  </video>` },
      { id: 'w-mvMpYnWvHK', type: 'code', language: 'html', code: '<div style="text-align:center"> \n  <button onclick="playPause()">Play/Pause</button> \n  <button onclick="makeBig()">Big</button>\n  <button onclick="makeSmall()">Small</button>\n  <button onclick="makeNormal()">Normal</button>\n  <br><br>\n  <video id="video1" width="420">\n    <source src="movie.mp4" type="video/mp4">\n    <source src="movie.ogg" type="video/ogg">\n    Your browser does not support HTML5 video.\n  </video>\n</div>' },
      { id: 'KrkeniUePKGq', type: 'code', language: 'javascript', code: '<script> \n    var myVideo = document.getElementById("video1"); \n    function playPause() { \n      if (myVideo.paused) \n        myVideo.play(); \n      else \n        myVideo.pause(); \n    } \n    function makeBig() { \n        myVideo.width = 560; \n    } \n    function makeSmall() { \n        myVideo.width = 320; \n    } \n    function makeNormal() { \n        myVideo.width = 420; \n    } \n</script>' },
    ],
    toc: [
      { id: 'playing-videos-in-html', text: 'HTML-এ ভিডিও চালানো', level: 2 },
      { id: 'the-html-video-element', text: 'HTML <video> এলিমেন্ট', level: 2 },
      { id: 'how-it-works', text: 'এটি কীভাবে কাজ করে', level: 2 },
      { id: 'html-video-autoplay', text: 'HTML <video> অটোপ্লে', level: 2 },
      { id: 'html-video---methods-properties-and-events', text: 'HTML ভিডিও - মেথড, প্রপার্টি এবং ইভেন্ট', level: 2 },
    ],
  },
  {
    id: '198489a9-3fe2-489d-8a54-6aec03391cab', // html/tag-youtube
    title: 'YouTube Iframe এমবেড করা',
    meta_description: 'HTML পেজে YouTube ভিডিও এমবেড, অটোপ্লে, লুপ এবং কন্ট্রোল কীভাবে সেট করবেন তা জানুন।',
    blocks: [
      { id: 'GRNu3PZeVHYL', type: 'richtext', html: '<hr>\n<p>HTML-এ ভিডিও চালানোর সবচেয়ে সহজ উপায় হলো YouTube ব্যবহার করা।</p>\n<hr>' },
      { id: 'shq_AHELdnfs', text: 'ভিডিও ফরম্যাট নিয়ে সমস্যায় পড়ছেন?', type: 'heading', level: 2, anchor: 'struggling-with-video-formats' },
      { id: 'IE29kKX5KHYL', type: 'richtext', html: '<p>এই টিউটোরিয়ালে আগে আপনি দেখেছেন যে, সব ব্রাউজারে চালানোর জন্য আপনাকে হয়তো আপনার ভিডিও বিভিন্ন ফরম্যাটে রূপান্তর করতে হতে পারে।</p>\n<p>ভিডিওকে বিভিন্ন ফরম্যাটে রূপান্তর করা কঠিন এবং সময়সাপেক্ষ হতে পারে।</p>\n<p>এর একটি সহজ সমাধান হলো, আপনার ওয়েব পেজে ভিডিওগুলো YouTube-কে দিয়ে চালানো।</p>\n<hr>' },
      { id: 'FiAtAfqK5tDg', text: 'YouTube ভিডিও Id', type: 'heading', level: 2, anchor: 'youtube-video-id' },
      { id: 'jpN06FbQp_G8', type: 'richtext', html: '<p>আপনি যখন একটি ভিডিও সংরক্ষণ (বা প্লে) করেন, তখন YouTube একটি id (যেমন tgbNymZ7vqY) দেখাবে।</p>\n<p>আপনি এই id ব্যবহার করে HTML কোডে আপনার ভিডিওর রেফারেন্স দিতে পারেন।</p>\n<hr>' },
      { id: 'fIHujlgcoWJi', text: 'HTML-এ একটি YouTube ভিডিও চালানো', type: 'heading', level: 2, anchor: 'playing-a-youtube-video-in-html' },
      { id: 'MRv864FHa5SW', type: 'richtext', html: `<p>আপনার ওয়েব পেজে ভিডিও চালাতে, নিচের ধাপগুলো অনুসরণ করুন:</p>
<ul>
                                    <li>ভিডিওটি YouTube-এ আপলোড করুন</li>
                                    <li>ভিডিওর id নোট করে রাখুন</li>
                                    <li>আপনার ওয়েব পেজে একটি <code>&lt;iframe&gt;</code> এলিমেন্ট নির্ধারণ করুন</li>
                                    <li>src অ্যাট্রিবিউটটি ভিডিওর URL-এর দিকে নির্দেশ করান</li>
                                    <li>প্লেয়ারের মাপ নির্ধারণ করতে width ও height অ্যাট্রিবিউট ব্যবহার করুন</li>
                                    <li>URL-এ প্রয়োজনমতো অন্য কোনো প্যারামিটার যোগ করুন (নিচে দেখুন)</li>
                                </ul>` },
      { id: 'm1pdiKkbmKrZ', type: 'code', language: 'html', code: '<iframe width="420" height="315"\nsrc="https://www.youtube.com/embed/tgbNymZ7vqY">\n</iframe>' },
      { id: 'oeXH1KqFRv7I', type: 'richtext', html: '<iframe width="100%" height="520" style="border: none;" src="https://www.youtube.com/embed/GY-CLke_gVI" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>\n<hr>' },
      { id: 'ECNEVqpTlKRw', text: 'YouTube অটোপ্লে', type: 'heading', level: 2, anchor: 'youtube-autoplay' },
      { id: 'qH3A4IwEp9U_', type: 'richtext', html: '<p>আপনার YouTube URL-এ একটি সাধারণ প্যারামিটার যোগ করে, ব্যবহারকারী পেজটিতে গেলে আপনি আপনার ভিডিও স্বয়ংক্রিয়ভাবে চালানো শুরু করাতে পারেন।</p>\n<p class="note"><b>মনে রাখবেন</b>: ভিডিও অটোপ্লে করার সিদ্ধান্ত নেওয়ার আগে সতর্কতার সাথে বিবেচনা করুন। স্বয়ংক্রিয়ভাবে ভিডিও শুরু হওয়া আপনার ভিজিটরকে বিরক্ত করতে পারে এবং উপকারের চেয়ে ক্ষতিই বেশি করতে পারে।</p>\n<p>মান 0 (ডিফল্ট): প্লেয়ার লোড হওয়ার সময় ভিডিও স্বয়ংক্রিয়ভাবে চলবে না।</p>\n<p>মান 1: প্লেয়ার লোড হওয়ার সময় ভিডিও স্বয়ংক্রিয়ভাবে চলবে।</p>\n<hr>' },
      { id: 'Yv_mFeZc1_B2', text: 'YouTube - অটোপ্লে', type: 'heading', level: 2, anchor: 'youtube---autoplay' },
      { id: 'ez6rE6KJrlmo', type: 'code', language: 'html', code: '<iframe width="420" height="315"\nsrc="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1">\n</iframe>' },
      { id: 'mhTnXocJFpig', type: 'richtext', html: '<hr>' },
      { id: 'UnIcDYc7lTYD', text: 'YouTube প্লেলিস্ট', type: 'heading', level: 2, anchor: 'youtube-playlist' },
      { id: '3XOrJ-MclY8R', type: 'richtext', html: '<p>মূল URL-এর পাশাপাশি চালানোর জন্য কমা দিয়ে আলাদা করা ভিডিওর একটি তালিকা।</p>\n<hr>' },
      { id: 'o9dhWlY5uvBh', text: 'YouTube লুপ', type: 'heading', level: 2, anchor: 'youtube-loop' },
      { id: '3SsFELqPS55F', type: 'richtext', html: '<p>মান 0 (ডিফল্ট): ভিডিওটি শুধু একবার চলবে।</p>\n<p>মান 1: ভিডিওটি (চিরকাল) লুপ হতে থাকবে।</p>\n<hr>' },
      { id: 'mJmiLX5gmUPz', type: 'code', language: 'html', code: '<iframe width="420" height="315"\nsrc="https://www.youtube.com/embed/tgbNymZ7vqY?playlist=tgbNymZ7vqY&loop=1">\n</iframe>' },
      { id: '1N7AY56GMs2h', type: 'richtext', html: '<hr>' },
      { id: 'vF3wCNQ3p7Cm', text: 'YouTube কন্ট্রোল', type: 'heading', level: 2, anchor: 'youtube-controls' },
      { id: 'oZn0XUZrEAK0', type: 'richtext', html: '<p>মান 0: প্লেয়ার কন্ট্রোল প্রদর্শিত হবে না।</p>\n<p>মান 1 (ডিফল্ট): প্লেয়ার কন্ট্রোল প্রদর্শিত হবে।</p>' },
      { id: 'pn6cqauSfAA9', type: 'code', language: 'html', code: '<iframe width="420" height="315"\nsrc="https://www.youtube.com/embed/tgbNymZ7vqY?controls=0">\n</iframe>' },
      { id: 'bnAewIAprt3P', type: 'richtext', html: '<hr>' },
      { id: 'GBKsORwEUUre', text: 'YouTube - <object> বা <embed> ব্যবহার করা', type: 'heading', level: 2, anchor: 'youtube---using-object-or-embed' },
      { id: 'lG-2rg_mKPh5', type: 'richtext', html: '<p><b>মনে রাখবেন</b>: YouTube <code>&lt;object&gt;</code> এবং <code>&lt;embed&gt;</code> 2015 সালের জানুয়ারি থেকে ডেপ্রিকেটেড। এর পরিবর্তে আপনার ভিডিওতে <code>&lt;iframe&gt;</code> ব্যবহার করা উচিত।</p>' },
    ],
    toc: [
      { id: 'struggling-with-video-formats', text: 'ভিডিও ফরম্যাট নিয়ে সমস্যায় পড়ছেন?', level: 2 },
      { id: 'youtube-video-id', text: 'YouTube ভিডিও Id', level: 2 },
      { id: 'playing-a-youtube-video-in-html', text: 'HTML-এ একটি YouTube ভিডিও চালানো', level: 2 },
      { id: 'youtube-autoplay', text: 'YouTube অটোপ্লে', level: 2 },
      { id: 'youtube---autoplay', text: 'YouTube - অটোপ্লে', level: 2 },
      { id: 'youtube-playlist', text: 'YouTube প্লেলিস্ট', level: 2 },
      { id: 'youtube-loop', text: 'YouTube লুপ', level: 2 },
      { id: 'youtube-controls', text: 'YouTube কন্ট্রোল', level: 2 },
      { id: 'youtube---using-object-or-embed', text: 'YouTube - <object> বা <embed> ব্যবহার করা', level: 2 },
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
console.log(`html batch2: ${ok}/${docs.length} written`)
