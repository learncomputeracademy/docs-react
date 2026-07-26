import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '1386c804-eb5a-46b7-b417-8853852bc10c' // javascript/strings
const title = 'জাভাস্ক্রিপ্ট স্ট্রিং'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'স্ট্রিং ঘোষণা, স্ট্রিং মেথড, টেমপ্লেট লিটারেল এবং স্ট্রিংয়ের অপরিবর্তনীয়তা সম্পর্কে জানুন।'

const blocks = [
  { id: 'AlvG9eubWEl0', type: 'richtext', html: '<hr>' },
  { id: 'kFGiJo_8eF3g', text: 'স্ট্রিং কী?', type: 'heading', level: 2, anchor: 'what-is-a-string' },
  { id: 'Nms5xep1p8MX', type: 'richtext', html: '<p>জাভাস্ক্রিপ্টে একটি <strong>স্ট্রিং</strong> হলো <strong>টেক্সট</strong> প্রতিনিধিত্ব করতে ব্যবহৃত অক্ষরের একটি ধারা।</p>' },
  { id: '1-wxcFtDnrwV', type: 'code', language: 'javascript', code: 'const message = "Hello, world!";\nconst name = \'John Doe\';' },
  { id: 'u8eCv8oiMXDY', type: 'richtext', html: `<p>স্ট্রিং এগুলো দিয়ে লেখা যায়:</p>
<ul>
                                    <li>ডাবল কোট <code>" "</code></li>
                                    <li>সিঙ্গেল কোট <code>' '</code></li>
                                    <li>ব্যাকটিক (টেমপ্লেট লিটারেল) <code>\` \`</code></li>
                                </ul>` },
  { id: 'uTjBFjGb0jBe', text: 'স্ট্রিং ঘোষণা করা', type: 'heading', level: 2, anchor: 'declaring-strings' },
  { id: 'q9X5g05gKXR2', type: 'code', language: 'javascript', code: 'let greeting = "Good morning";\nlet city = \'Mumbai\';\nlet message = `Welcome, user!`;' },
  { id: 'L-YexA6xqQyC', text: 'স্ট্রিং-এর দৈর্ঘ্য', type: 'heading', level: 2, anchor: 'string-length' },
  { id: '7ND-21xY5-f_', type: 'code', language: 'javascript', code: 'const msg = "Hello";\nconsole.log(msg.length); // 5' },
  { id: 'dDJCfKMVqXJC', text: 'অক্ষর অ্যাক্সেস করা', type: 'heading', level: 2, anchor: 'accessing-characters' },
  { id: 'lH285Yq44TYd', type: 'richtext', html: '<p>আপনি ইনডেক্স ব্যবহার করে অক্ষর অ্যাক্সেস করতে পারেন (0 থেকে শুরু):</p>' },
  { id: 'VMcw8tOHuIhZ', type: 'code', language: 'javascript', code: 'const word = "JavaScript";\nconsole.log(word[0]);  // J\nconsole.log(word.charAt(4)); // S' },
  { id: '_oXFlrt5HuKE', text: 'কেস পরিবর্তন করা', type: 'heading', level: 2, anchor: 'changing-case' },
  { id: 'MFeohtonTMWw', type: 'code', language: 'javascript', code: 'const text = "Learn JavaScript";\n\nconsole.log(text.toUpperCase()); // LEARN JAVASCRIPT\nconsole.log(text.toLowerCase()); // learn javascript' },
  { id: 'IKKvhn2bkdQI', text: 'সাধারণ স্ট্রিং মেথড', type: 'heading', level: 2, anchor: 'common-string-methods' },
  { id: 'Ym-Nl-GMIqlb', type: 'table', header: ['মেথড', 'বিবরণ', 'উদাহরণ'], rows: [
    ['<code>length</code>', 'দৈর্ঘ্য রিটার্ন করে', '<code>str.length</code>'],
    ['<code>toUpperCase()</code>', 'বড় হাতের অক্ষরে রূপান্তর করে', '<code>"hello".toUpperCase()</code> → <code>"HELLO"</code>'],
    ['<code>toLowerCase()</code>', 'ছোট হাতের অক্ষরে রূপান্তর করে', '<code>"HELLO".toLowerCase()</code> → <code>"hello"</code>'],
    ['<code>includes()</code>', 'স্ট্রিংয়ে টেক্সট আছে কিনা যাচাই করে', '<code>"abc".includes("b")</code> → <code>true</code>'],
    ['<code>indexOf()</code>', 'প্রথম উপস্থিতির অবস্থান খুঁজে বের করে', '<code>"banana".indexOf("a")</code> → <code>1</code>'],
    ['<code>lastIndexOf()</code>', 'শেষ উপস্থিতির অবস্থান খুঁজে বের করে', '<code>"banana".lastIndexOf("a")</code> → <code>5</code>'],
    ['<code>startsWith()</code>', 'স্ট্রিং নির্দিষ্ট টেক্সট দিয়ে শুরু হয় কিনা যাচাই করে', '<code>"hello".startsWith("he")</code> → <code>true</code>'],
    ['<code>endsWith()</code>', 'স্ট্রিং নির্দিষ্ট টেক্সট দিয়ে শেষ হয় কিনা যাচাই করে', '<code>"hello".endsWith("o")</code> → <code>true</code>'],
    ['<code>slice(start, end)</code>', 'স্ট্রিংয়ের একটি অংশ বের করে', '<code>"abcdef".slice(1, 4)</code> → <code>"bcd"</code>'],
    ['<code>substring()</code>', 'slice-এর মতোই', '<code>"hello".substring(0, 2)</code> → <code>"he"</code>'],
    ['<code>replace()</code>', 'প্রথম মিল প্রতিস্থাপন করে', '<code>"I love cats".replace("cats", "dogs")</code>'],
    ['<code>trim()</code>', 'হোয়াইটস্পেস সরায়', '<code>" hello ".trim()</code> → <code>"hello"</code>'],
    ['<code>split()</code>', 'স্ট্রিংকে অ্যারেতে ভাগ করে', '<code>"a,b,c".split(",")</code> → <code>["a", "b", "c"]</code>'],
    ['<code>concat()</code>', 'দুটি স্ট্রিং জোড়া দেয়', '<code>"Hi".concat(" there")</code> → <code>"Hi there"</code>'],
  ] },
  { id: '_wHqcGYN3GPS', text: 'টেমপ্লেট লিটারেল (ES6)', type: 'heading', level: 2, anchor: 'template-literals-es6' },
  { id: 'DXcDGLEzG5sH', type: 'richtext', html: `<p>টেমপ্লেট লিটারেল ব্যাকটিক (\` \`) ব্যবহার করে এগুলো সমর্থন করে:</p>
<ul>
                                    <li>মাল্টি-লাইন স্ট্রিং</li>
                                    <li><code>\${}</code> ব্যবহার করে ভেরিয়েবল ইন্টারপোলেশন</li>
                                </ul>` },
  { id: 'ttOkUn3oWcLz', type: 'code', language: 'javascript', code: 'const name = "Amit";\nconst greeting = `Hello, ${name}!`;\nconsole.log(greeting); // Hello, Amit!' },
  { id: 'cNeuo_1MIpJf', type: 'code', language: 'javascript', code: 'const fullMessage = `\nDear Student,\nYour result is ready.\n                                    \nRegards,\nAdmin\n`;\nconsole.log(fullMessage);' },
  { id: 'YNKPR7vI5aW3', text: 'এস্কেপ ক্যারেক্টার', type: 'heading', level: 2, anchor: 'escape-characters' },
  { id: '05Wd9goXYgeQ', type: 'richtext', html: '<p>স্পেশাল ক্যারেক্টার এস্কেপ করতে <code>\\</code> (ব্যাকস্ল্যাশ) ব্যবহার করুন:</p>' },
  { id: 'tCsn44eTnqz4', type: 'code', language: 'javascript', code: 'const quote = "He said, \\"Let\'s go!\\"";' },
  { id: 'IOXFRp2A_-59', type: 'richtext', html: `<p>অন্যান্য এস্কেপ সিকোয়েন্স:
                                </p>
<ul>
                                    <li><code>\\n</code> - নতুন লাইন</li>
                                    <li><code>\\t</code> - ট্যাব</li>
                                    <li><code>\\\\</code> - ব্যাকস্ল্যাশ<p></p></li>
                                </ul>` },
  { id: '6IdvzfHFzBgi', text: 'স্ট্রিং তুলনা', type: 'heading', level: 2, anchor: 'string-comparison' },
  { id: 'ajzyrIgbRGNQ', type: 'richtext', html: '<p><code>==</code>, <code>===</code>, <code>&lt;</code>, <code>&gt;</code> ব্যবহার করে স্ট্রিং বর্ণানুক্রমিকভাবে তুলনা করা যায়:</p>' },
  { id: 'OThu84gmIC35', type: 'code', language: 'javascript', code: 'console.log("apple" < "banana"); // true\nconsole.log("A" < "a"); // true (বড় হাতের অক্ষর ছোট হাতের অক্ষরের আগে আসে)' },
  { id: 'glA8LGP11OpB', text: 'স্ট্রিংয়ের অপরিবর্তনীয়তা', type: 'heading', level: 2, anchor: 'string-immutability' },
  { id: 'z_xOScOvRDiS', type: 'richtext', html: '<p>স্ট্রিং অপরিবর্তনীয় (immutable) — আপনি সরাসরি একটি অক্ষর পরিবর্তন করতে পারবেন না:</p>' },
  { id: 'AdTswLNBSeH1', type: 'code', language: 'javascript', code: 'let msg = "hello";\nmsg[0] = "H";  // ❌ অবৈধ\nmsg = "Hello"; // ✅ সঠিক উপায়' },
  { id: '0issyqBrTQcn', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'Viv0BVnd3GtU', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'hfmXSrEk00kF', type: 'richtext', html: `<ol>
                                    <li>আপনার পুরো নাম দিয়ে একটি স্ট্রিং তৈরি করুন এবং একটি লুপ ব্যবহার করে প্রতিটি অক্ষর প্রিন্ট করুন।</li>
                                    <li><code>.split()</code> এবং <code>.length</code> ব্যবহার করে <code>a</code> অক্ষরটি কতবার আছে তা গণনা করুন।</li>
                                    <li>একটি পুরো নাম থেকে প্রথম নাম বের করতে <code>slice()</code> ব্যবহার করুন।</li>
                                    <li><code>" Welcome! "</code>-কে <code>"welcome!"</code>-এ রূপান্তর করুন (trim + lowercase)।</li>
                                    <li>টেমপ্লেট লিটারেল ব্যবহার করে প্রিন্ট করুন:</li>
                                </ol>` },
  { id: '5_sfDc_6JF45', type: 'code', language: 'javascript', code: 'Hello, [Your Name]!\nWelcome to JavaScript Strings.' },
]

const toc = [
  { id: 'what-is-a-string', text: 'স্ট্রিং কী?', level: 2 },
  { id: 'declaring-strings', text: 'স্ট্রিং ঘোষণা করা', level: 2 },
  { id: 'string-length', text: 'স্ট্রিং-এর দৈর্ঘ্য', level: 2 },
  { id: 'accessing-characters', text: 'অক্ষর অ্যাক্সেস করা', level: 2 },
  { id: 'changing-case', text: 'কেস পরিবর্তন করা', level: 2 },
  { id: 'common-string-methods', text: 'সাধারণ স্ট্রিং মেথড', level: 2 },
  { id: 'template-literals-es6', text: 'টেমপ্লেট লিটারেল (ES6)', level: 2 },
  { id: 'escape-characters', text: 'এস্কেপ ক্যারেক্টার', level: 2 },
  { id: 'string-comparison', text: 'স্ট্রিং তুলনা', level: 2 },
  { id: 'string-immutability', text: 'স্ট্রিংয়ের অপরিবর্তনীয়তা', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/strings: 1/1 written')
