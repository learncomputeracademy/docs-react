import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '8dcf9913-6a27-4deb-8d22-27935a883597' // css/align
const title = 'CSS অ্যালাইন'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'CSS দিয়ে এলিমেন্ট, টেক্সট ও ইমেজ কীভাবে সেন্টার, লেফট, রাইট এবং উল্লম্বভাবে অ্যালাইন করবেন তা জানুন।'

const blocks = [
  { id: 'FVW62luQ0YCC', type: 'richtext', html: '<hr>' },
  { id: 'SSIa7tJUOa8_', type: 'image', alt: 'Align image', width: 856, height: 266, publicId: 'img/center-align' },
  { id: 'owgJoHBa1Vdj', type: 'richtext', html: '<hr>' },
  { id: '2dSh0-VFWQRI', text: 'এলিমেন্ট সেন্টার অ্যালাইন করা', type: 'heading', level: 2, anchor: 'center-align-elements' },
  { id: 'DOzdI3vtPQgs', type: 'richtext', html: '<p>একটি ব্লক এলিমেন্টকে (যেমন &lt;div&gt;) অনুভূমিকভাবে কেন্দ্রীভূত করতে, <code class="w3-codespan">margin: auto;</code> ব্যবহার করুন</p>\n<p>এলিমেন্টের width সেট করলে এটি তার কন্টেইনারের প্রান্ত পর্যন্ত বিস্তৃত হওয়া থেকে বিরত থাকবে।</p>\n<p>এলিমেন্টটি তখন নির্দিষ্ট প্রস্থ দখল করবে, এবং অবশিষ্ট জায়গা দুই মার্জিনের মধ্যে সমানভাবে ভাগ হবে:</p>\n<p>এই div এলিমেন্টটি কেন্দ্রীভূত।</p>' },
  { id: '-FcJ68vxi5z1', type: 'code', language: 'css', code: '.center {\n  margin: auto;\n  width: 50%;\n  border: 3px solid green;\n  padding: 10px;\n}' },
  { id: 'g-XCUBdaWCFU', type: 'richtext', html: '<p><b>মনে রাখবেন:</b> width প্রপার্টি সেট করা না থাকলে (বা 100% সেট করা থাকলে) সেন্টার অ্যালাইন করার কোনো প্রভাব নেই।</p>\n<hr>' },
  { id: '9IXcznCZ-T9O', text: 'টেক্সট সেন্টার অ্যালাইন করা', type: 'heading', level: 2, anchor: 'center-align-text' },
  { id: 'ppe4845m70sl', type: 'richtext', html: '<p>একটি এলিমেন্টের ভেতরের টেক্সট শুধু কেন্দ্রীভূত করতে, <code>text-align: center;</code> ব্যবহার করুন</p>\n<p style="margin: 0;padding: 1em 0;">এই টেক্সটটি কেন্দ্রীভূত।</p>' },
  { id: 'aKvuvP0oeec-', type: 'code', language: 'css', code: '.center {\n  text-align: center;\n  border: 3px solid green;\n}' },
  { id: 'gzm9vkBNh1Rw', type: 'richtext', html: '<p><b>টিপস:</b> টেক্সট কীভাবে অ্যালাইন করবেন তার আরও উদাহরণের জন্য, <a href="css_text.html" target="_blank">CSS টেক্সট</a> চ্যাপ্টারটি দেখুন।</p>\n<hr>' },
  { id: 'L-BeO0QCQ-A5', text: 'একটি ইমেজ সেন্টার করা', type: 'heading', level: 2, anchor: 'center-an-image' },
  { id: 'Syy1bx1yNmAm', type: 'richtext', html: '<p>একটি ইমেজ সেন্টার করতে, বাম ও ডান মার্জিন <code class="w3-codespan">auto</code>-এ সেট করুন এবং এটিকে একটি <code class="w3-codespan">block</code> এলিমেন্টে পরিণত করুন:</p>' },
  { id: 'zZPtpbXz-RdB', type: 'image', alt: 'Paris', width: 400, height: 300, publicId: 'img/paris' },
  { id: '9ekqNDj3a61d', type: 'code', language: 'css', code: 'img {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n  width: 40%;\n}' },
  { id: 'UrPHDpySke3z', type: 'richtext', html: '<hr>' },
  { id: '0-nrD2q1WwRp', text: 'বাম ও ডান অ্যালাইন - position ব্যবহার করে', type: 'heading', level: 2, anchor: 'left-and-right-align---using-position' },
  { id: 'OqXCO25_34w3', type: 'richtext', html: "<p>এলিমেন্ট অ্যালাইন করার একটি পদ্ধতি হলো <code class=\"w3-codespan\">position: absolute;</code> ব্যবহার করা:</p>\n<p>In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.</p>" },
  { id: 'RpmH7gp1fn5E', type: 'code', language: 'css', code: '.right {\n  position: absolute;\n  right: 0px;\n  width: 300px;\n  border: 3px solid #73AD21;\n  padding: 10px;\n}' },
  { id: 'xSAvm1ObxZbr', type: 'richtext', html: '<p><b>মনে রাখবেন:</b> Absolute পজিশন করা এলিমেন্ট স্বাভাবিক প্রবাহ থেকে সরিয়ে নেওয়া হয়, এবং এলিমেন্টের সাথে ওভারল্যাপ করতে পারে।</p>\n<hr>' },
  { id: 'Z9n0KtMlQIU_', text: 'উল্লম্বভাবে সেন্টার করা - padding ব্যবহার করে', type: 'heading', level: 2, anchor: 'center-vertically---using-padding' },
  { id: 'hB_R13IN4Qti', type: 'richtext', html: '<p>CSS-এ একটি এলিমেন্ট উল্লম্বভাবে কেন্দ্রীভূত করার অনেক উপায় আছে। একটি সহজ সমাধান হলো উপর ও নিচের <code class="w3-codespan">padding</code> ব্যবহার করা:</p>\n<p style="margin: 0;">আমি উল্লম্বভাবে কেন্দ্রীভূত।</p>' },
  { id: 'sfObeL3DSPe-', type: 'code', language: 'css', code: '.center {\n  padding: 70px 0;\n  border: 3px solid green;\n}' },
  { id: 'DfewOBmvzaXR', type: 'richtext', html: '<p>উল্লম্ব এবং অনুভূমিক — দুই দিকেই সেন্টার করতে, <code>padding</code> এবং <code>text-align: center</code> ব্যবহার করুন:</p>\n<p>আমি উল্লম্বভাবে এবং অনুভূমিকভাবে কেন্দ্রীভূত।</p>' },
  { id: '1zwsgI5lw6ur', type: 'code', language: 'css', code: '.center {\n  padding: 70px 0;\n  border: 3px solid green;\n  text-align: center;\n}' },
  { id: 'QLGbn1mTtEtj', type: 'richtext', html: '<hr>' },
  { id: '-gEBlQBPTNtn', text: 'উল্লম্বভাবে সেন্টার করা - line-height ব্যবহার করে', type: 'heading', level: 2, anchor: 'center-vertically---using-line-height' },
  { id: 'H54FwOR9Egqn', type: 'richtext', html: '<p>আরেকটি কৌশল হলো <code>height</code> প্রপার্টির সমান একটি মানসহ <code>line-height</code> প্রপার্টি ব্যবহার করা।</p>\n<p style=" line-height:1.2; display:inline-block; vertical-align:middle;">আমি উল্লম্বভাবে এবং অনুভূমিকভাবে কেন্দ্রীভূত।</p>' },
  { id: 'osw_FIbFvUbC', type: 'code', language: 'css', code: '.center {\n  line-height: 200px;\n  height: 200px;\n  border: 3px solid green;\n  text-align: center;\n}\n/* টেক্সটে একাধিক লাইন থাকলে, নিচেরটি যোগ করুন: */\n.center p {\n  line-height: 1.5;\n  display: inline-block;\n  vertical-align: middle;\n}' },
  { id: 'kA3RYwTLfiE1', type: 'richtext', html: '<hr>' },
  { id: '8FNDv9yPkIcF', text: 'উল্লম্বভাবে সেন্টার করা - position ও transform ব্যবহার করে', type: 'heading', level: 2, anchor: 'center-vertically---using-position-transform' },
  { id: 'CEyuF67Io2k0', type: 'richtext', html: '<p><code>padding</code> এবং <code>line-height</code> ব্যবহার করা সম্ভব না হলে, তৃতীয় সমাধান হলো পজিশনিং এবং <code>transform</code> প্রপার্টি ব্যবহার করা:</p>\n<p style=" line-height:1.2; display:inline-block; vertical-align:middle;">আমি উল্লম্বভাবে এবং অনুভূমিকভাবে কেন্দ্রীভূত।</p>' },
  { id: 'QJXrXcdB0Apg', type: 'code', language: 'css', code: '.center { \n  height: 200px;\n  position: relative;\n  border: 3px solid green; \n}\n.center p {\n  margin: 0;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}' },
  { id: 'bXNKN4IAYgn9', type: 'richtext', html: '<p><b>টিপস:</b> আমাদের 2D Transforms চ্যাপ্টারে transform প্রপার্টি সম্পর্কে আরও জানবেন।</p>' },
]

const toc = [
  { id: 'center-align-elements', text: 'এলিমেন্ট সেন্টার অ্যালাইন করা', level: 2 },
  { id: 'center-align-text', text: 'টেক্সট সেন্টার অ্যালাইন করা', level: 2 },
  { id: 'center-an-image', text: 'একটি ইমেজ সেন্টার করা', level: 2 },
  { id: 'left-and-right-align---using-position', text: 'বাম ও ডান অ্যালাইন - position ব্যবহার করে', level: 2 },
  { id: 'center-vertically---using-padding', text: 'উল্লম্বভাবে সেন্টার করা - padding ব্যবহার করে', level: 2 },
  { id: 'center-vertically---using-line-height', text: 'উল্লম্বভাবে সেন্টার করা - line-height ব্যবহার করে', level: 2 },
  { id: 'center-vertically---using-position-transform', text: 'উল্লম্বভাবে সেন্টার করা - position ও transform ব্যবহার করে', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/align: 1/1 written')
