import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '62c553df-f7d0-4a88-8c6c-febee5ca1a24' // javascript/jquery
const title = 'jQuery'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'jQuery কী, কেন এটি ব্যবহার করা হয়, এবং শুরু করার আগে কী জানা দরকার তা জানুন।'

const blocks = [
  { id: 'JZhnw9jZGB89', text: 'jQuery', type: 'heading', level: 2, anchor: 'jquery' },
  { id: 'w0dbqHV9WWm6', type: 'richtext', html: `<div class="note">
                                    <p>jQuery একটি জাভাস্ক্রিপ্ট লাইব্রেরি।</p>
                                    <p>jQuery জাভাস্ক্রিপ্ট প্রোগ্রামিংকে অনেক সহজ করে দেয়।</p>
                                    <p>jQuery শেখা সহজ।</p>
                                </div>
<hr>
<p>আপনার ওয়েবসাইটে জাভাস্ক্রিপ্ট ব্যবহার করা অনেক সহজ করে দেওয়াই jQuery-এর উদ্দেশ্য।</p>
<hr>` },
  { id: 'RbcAXZUMvadV', text: 'আপনার আগে থেকে কী জানা উচিত?', type: 'heading', level: 2, anchor: 'what-you-should-already-know' },
  { id: 'NX8wzTbyW-HY', type: 'richtext', html: `<p>jQuery পড়াশোনা শুরু করার আগে, আপনার নিচের বিষয়গুলোর প্রাথমিক জ্ঞান থাকা উচিত:</p>
<ul>
                                    <li>HTML</li>
                                    <li>CSS</li>
                                    <li>জাভাস্ক্রিপ্ট</li>
                                </ul>
<p>আগে এই বিষয়গুলো পড়তে চাইলে, আমাদের <a href="/">হোম পেজে</a> টিউটোরিয়ালগুলো খুঁজে নিন।</p>
<hr>` },
  { id: 'XF_1rqdQaiv-', text: 'jQuery কী?', type: 'heading', level: 2, anchor: 'what-is-jquery' },
  { id: 'xRQlEuOaQ1oB', type: 'richtext', html: `<p>jQuery একটি হালকা, "write less, do more" ধরনের জাভাস্ক্রিপ্ট লাইব্রেরি।</p>
<p>আপনার ওয়েবসাইটে জাভাস্ক্রিপ্ট ব্যবহার করা অনেক সহজ করে দেওয়াই jQuery-এর উদ্দেশ্য।</p>
<p>jQuery অনেক সাধারণ কাজ, যেগুলো করতে সাধারণত অনেক লাইন জাভাস্ক্রিপ্ট কোড লাগে, সেগুলোকে এমন মেথডের মধ্যে গুটিয়ে দেয় যা আপনি মাত্র এক লাইন কোড দিয়ে কল করতে পারেন।</p>
<p>jQuery জাভাস্ক্রিপ্টের অনেক জটিল বিষয়ও সহজ করে দেয়, যেমন AJAX কল এবং DOM ম্যানিপুলেশন।</p>
<p>jQuery লাইব্রেরিতে নিচের ফিচারগুলো আছে:</p>
<ul>
                                    <li>HTML/DOM ম্যানিপুলেশন</li>
                                    <li>CSS ম্যানিপুলেশন</li>
                                    <li>HTML ইভেন্ট মেথড</li>
                                    <li>ইফেক্ট ও অ্যানিমেশন</li>
                                    <li>AJAX</li>
                                    <li>ইউটিলিটি</li>
                                </ul>
<p><b>টিপ:</b> এছাড়াও, প্রায় যেকোনো কাজের জন্য jQuery-এর প্লাগইন রয়েছে।</p>
<hr>` },
  { id: 'd1829BtQMKm9', text: 'কেন jQuery?', type: 'heading', level: 2, anchor: 'why-jquery' },
  { id: 'jz6F0jLW1vnp', type: 'richtext', html: `<p>বাজারে আরও অনেক জাভাস্ক্রিপ্ট ফ্রেমওয়ার্ক আছে, কিন্তু jQuery সবচেয়ে জনপ্রিয় এবং সবচেয়ে বেশি এক্সটেন্ডেবল বলে মনে হয়।</p>
<p>ওয়েবের সবচেয়ে বড় অনেক কোম্পানি jQuery ব্যবহার করে, যেমন:</p>
<ul>
                                    <li>Google</li>
                                    <li>Microsoft</li>
                                    <li>IBM</li>
                                    <li>Netflix</li>
                                </ul>
<p class="note"><b>মনে রাখবেন:</b> বাম দিকের মেনুতে দেওয়া ক্রম অনুযায়ী <a href="https://www.w3schools.com/jquery/jquery_intro.asp">এই টিউটোরিয়ালটি</a> পড়ার পরামর্শ দিচ্ছি। সব উদাহরণ চেষ্টা করলে, খুব অল্প সময়ে jQuery সম্পর্কে অনেক কিছু শিখে যাবেন!</p>` },
]

const toc = [
  { id: 'jquery', text: 'jQuery', level: 2 },
  { id: 'what-you-should-already-know', text: 'আপনার আগে থেকে কী জানা উচিত?', level: 2 },
  { id: 'what-is-jquery', text: 'jQuery কী?', level: 2 },
  { id: 'why-jquery', text: 'কেন jQuery?', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/jquery: 1/1 written')
