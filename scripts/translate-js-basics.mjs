import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '76f8333a-7f39-46c5-9184-9b05bf9a796d' // javascript/basics
const title = 'জাভাস্ক্রিপ্ট বেসিকস'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'সিনট্যাক্স, স্টেটমেন্ট, কমেন্ট, ভেরিয়েবল, ডেটা টাইপ এবং অপারেটরসহ জাভাস্ক্রিপ্টের মূল বিষয়গুলো শিখুন।'

const blocks = [
  { id: 'Oczk8D3vbkFm', type: 'richtext', html: '<hr>' },
  { id: '1RazDD0eje5Z', text: 'জাভাস্ক্রিপ্ট সিনট্যাক্স', type: 'heading', level: 2, anchor: 'javascript-syntax' },
  { id: '7a3vQZZ7eRO0', type: 'richtext', html: `<p>জাভাস্ক্রিপ্ট সিনট্যাক্স হলো এমন নিয়মের একটি সেট, যা একটি জাভাস্ক্রিপ্ট প্রোগ্রাম কীভাবে লেখা ও ব্যাখ্যা করা হয় তা নির্ধারণ করে।</p>
<ul>
                                    <li>জাভাস্ক্রিপ্ট <strong>কেস-সেনসিটিভ</strong></li>
                                    <li>স্টেটমেন্ট একটি সেমিকোলন <code>;</code> দিয়ে শেষ হয় (ঐচ্ছিক, তবে সুপারিশকৃত)</li>
                                    <li>স্টেটমেন্ট <strong>উপর থেকে নিচে</strong>, <strong>বাম থেকে ডানে</strong> এক্সিকিউট হয়</li>
                                </ul>` },
  { id: 'X51mdMpLRWzL', type: 'code', language: 'javascript', code: 'let message = "Hello!";\nconsole.log(message);' },
  { id: 'CSGnwE8usPzr', text: 'জাভাস্ক্রিপ্ট স্টেটমেন্ট', type: 'heading', level: 2, anchor: 'javascript-statements' },
  { id: 'nuuD4cVwSshL', type: 'richtext', html: '<p>একটি <strong>স্টেটমেন্ট</strong> হলো এক লাইনের কোড, যা একটি কাজ সম্পন্ন করে।</p>' },
  { id: 'oqNlC6Wm6XSP', type: 'code', language: 'javascript', code: 'let x = 10;       // স্টেটমেন্ট ১\nx = x + 5;        // স্টেটমেন্ট ২\nconsole.log(x);   // স্টেটমেন্ট ৩' },
  { id: 'JmCbJgWirRMA', type: 'richtext', html: '<p>একাধিক স্টেটমেন্ট <strong>কার্লি ব্রেস</strong> <code>{}</code> দিয়ে একত্রে গ্রুপ করা যায় (একে কোড ব্লক বলা হয়):</p>' },
  { id: 'tliIwj6S8ynF', type: 'code', language: 'javascript', code: '{\n    let name = "John";\n    console.log(name);\n}' },
  { id: 'x8MMCZ3LTTTG', text: 'জাভাস্ক্রিপ্ট কমেন্ট', type: 'heading', level: 2, anchor: 'javascript-comments' },
  { id: 'cjeJr-gs6Cxf', type: 'richtext', html: `<p>কমেন্ট কোড ব্যাখ্যা করতে ব্যবহৃত হয় এবং ব্রাউজার এগুলো উপেক্ষা করে।</p>
<ul>
                                    <li><strong>সিঙ্গেল-লাইন কমেন্ট:</strong></li>
                                </ul>` },
  { id: 'RffEBRIb_rxR', type: 'code', language: 'javascript', code: '// এটি একটি সিঙ্গেল-লাইন কমেন্ট' },
  { id: '6Qy9_CJlrnnH', type: 'richtext', html: `<ul>
                                    <li><strong>মাল্টি-লাইন কমেন্ট:</strong></li>
                                </ul>` },
  { id: 'Mn6u2PvdpwQ0', type: 'code', language: 'javascript', code: '/* এটি একটি \nমাল্টি-লাইন কমেন্ট */' },
  { id: 'Z9IkKH5gBC2m', text: 'জাভাস্ক্রিপ্টে ভেরিয়েবল', type: 'heading', level: 2, anchor: 'variables-in-javascript' },
  { id: 'O0su0vnH-zwz', type: 'richtext', html: '<p>ভেরিয়েবল <strong>ডেটা ভ্যালু</strong> সংরক্ষণ করে। আপনি এগুলো ঘোষণা করতে পারেন:</p>' },
  { id: 'EGVZ3o2336-6', text: 'var (পুরনো পদ্ধতি)', type: 'heading', level: 3, anchor: 'var-old-way' },
  { id: 'BhZTpLR619PA', type: 'code', language: 'javascript', code: 'var name = "Alice";' },
  { id: 'enx2Pt-tWK5H', text: 'let (আধুনিক, ব্লক-স্কোপড)', type: 'heading', level: 3, anchor: 'let-modern-block-scoped' },
  { id: 'x1LWveYEBtJZ', type: 'code', language: 'javascript', code: 'let age = 25;' },
  { id: 'TFm9pBZXJOuf', text: 'const (কনস্ট্যান্ট - মান পরিবর্তন করা যায় না)', type: 'heading', level: 3, anchor: 'const-constant---value-cannot-change' },
  { id: 'sruAr5fXJ44e', type: 'code', language: 'javascript', code: 'const country = "India";' },
  { id: 'cn867a0lRvEW', type: 'table', header: ['কীওয়ার্ড', 'পুনঃবরাদ্দ করা যায়?', 'স্কোপ টাইপ'], rows: [
    ['var', 'হ্যাঁ', 'ফাংশন-লেভেল'],
    ['let', 'হ্যাঁ', 'ব্লক-লেভেল'],
    ['const', 'না', 'ব্লক-লেভেল'],
  ] },
  { id: 'Q_RF5rhkUsL5', text: 'জাভাস্ক্রিপ্ট ডেটা টাইপ', type: 'heading', level: 2, anchor: 'javascript-data-types' },
  { id: 'IZu_AMiEnwne', type: 'richtext', html: '<p>জাভাস্ক্রিপ্ট <strong>ডাইনামিকালি টাইপড</strong>, অর্থাৎ আপনাকে একটি ডেটা টাইপ ঘোষণা করতে হয় না।</p>' },
  { id: '-pQXPP6r6-XV', text: 'প্রিমিটিভ টাইপ:', type: 'heading', level: 3, anchor: 'primitive-types' },
  { id: 'C0j9hz3qWP7L', type: 'richtext', html: `<ul>
                                    <li><code>String</code> - <code>"Hello"</code></li>
                                    <li><code>Number</code> - <code>42</code>, <code>3.14</code></li>
                                    <li><code>Boolean</code> - <code>true</code>, <code>false</code></li>
                                    <li><code>Undefined</code> - ভেরিয়েবল ঘোষিত কিন্তু কোনো মান বরাদ্দ করা হয়নি</li>
                                    <li><code>Null</code> - মানের ইচ্ছাকৃত অনুপস্থিতি</li>
                                    <li><code>Symbol</code> - ইউনিক আইডেন্টিফায়ার (অ্যাডভান্সড ব্যবহার)</li>
                                    <li><code>BigInt</code> - অনেক বড় সংখ্যা (ES2020-এ যোগ হয়েছে)</li>
                                </ul>` },
  { id: 'EUABNYUpoa3-', text: 'নন-প্রিমিটিভ টাইপ:', type: 'heading', level: 3, anchor: 'non-primitive-types' },
  { id: 'M7xGdgW0Bruw', type: 'richtext', html: `<ul>
                                    <li><code>Object</code></li>
                                    <li><code>Array</code></li>
                                    <li><code>Function</code></li>
                                </ul>` },
  { id: 'h0iBEJWG5myA', type: 'code', language: 'javascript', code: 'let name = "Tom";           // স্ট্রিং\nlet age = 30;               // সংখ্যা\nlet isOnline = true;        // বুলিয়ান\nlet person = {name: "Tom", age: 30}; // অবজেক্ট' },
  { id: '5u7SveYLu3Ow', text: 'জাভাস্ক্রিপ্ট অপারেটর', type: 'heading', level: 2, anchor: 'javascript-operators' },
  { id: 'ZPJ0jrQlumel', type: 'richtext', html: '<p>জাভাস্ক্রিপ্ট বিভিন্ন ধরনের অপারেটর সমর্থন করে:</p>' },
  { id: 'VQ7asABLQiwB', text: '১. অ্যারিথমেটিক অপারেটর', type: 'heading', level: 3, anchor: '1-arithmetic-operators' },
  { id: 'sygYvglK4acf', type: 'code', language: 'javascript', code: '+  -  *  /  %  **  ++  --' },
  { id: 'BVgKpJWtDqQ3', text: '২. অ্যাসাইনমেন্ট অপারেটর', type: 'heading', level: 3, anchor: '2-assignment-operators' },
  { id: 'yQCe_Aq0jZMT', type: 'code', language: 'javascript', code: '=  +=  -=  *=  /=  %=  **=' },
  { id: '1UBDae1Wc5Zy', text: '৩. তুলনা অপারেটর', type: 'heading', level: 3, anchor: '3-comparison-operators' },
  { id: 'D2WxyhAOPY-v', type: 'code', language: 'javascript', code: '==   ===   !=   !==   >   <   >=   <=' },
  { id: 'x5xsuc7WywYI', type: 'richtext', html: `<ul>
                                    <li><code>==</code> শুধু মান যাচাই করে</li>
                                    <li><code>===</code> মান এবং টাইপ উভয়ই যাচাই করে (সুপারিশকৃত)</li>
                                </ul>` },
  { id: 'isfid5oKQcEG', text: '৪. লজিক্যাল অপারেটর', type: 'heading', level: 3, anchor: '4-logical-operators' },
  { id: 'z4QYLftIkagV', type: 'code', language: 'javascript', code: '&&   ||   !' },
  { id: '64Y6ST-3bLs_', type: 'code', language: 'javascript', code: 'true && false // false\ntrue || false // true\n!false        // true' },
  { id: 'UvB37MRQlbsy', text: '৫. স্ট্রিং কনক্যাটেনেশন অপারেটর', type: 'heading', level: 3, anchor: '5-string-concatenation-operator' },
  { id: 'B-esEz4yHbli', type: 'code', language: 'javascript', code: 'let fullName = "John" + " " + "Doe"; // "John Doe"' },
  { id: 'gfJkU25jTn4C', text: 'টাইপ কনভার্সন (কাস্টিং)', type: 'heading', level: 2, anchor: 'type-conversion-casting' },
  { id: 'p_qv5OVhtavw', text: '👉 ইমপ্লিসিট (স্বয়ংক্রিয়)', type: 'heading', level: 3, anchor: 'implicit-automatic' },
  { id: 'unzhyuua0svq', type: 'code', language: 'javascript', code: 'let result = "5" + 2;    // "52" (সংখ্যা 2 স্ট্রিং-এ রূপান্তরিত হয়েছে)' },
  { id: '-BbsG0rF8qDs', text: '👉 এক্সপ্লিসিট (ম্যানুয়াল)', type: 'heading', level: 3, anchor: 'explicit-manual' },
  { id: 'o9mqsvPfoFUn', type: 'code', language: 'javascript', code: 'Number("10");     // 10\nString(20);       // "20"\nBoolean(0);       // false' },
  { id: 'KRFxv4VVq5yE', text: 'typeof অপারেটর', type: 'heading', level: 2, anchor: 'typeof-operator' },
  { id: 'QHm9fdNPBOMn', type: 'richtext', html: '<p>একটি ভেরিয়েবলের <strong>টাইপ</strong> যাচাই করতে ব্যবহৃত হয়।</p>' },
  { id: 'HDoCMhXklPwi', type: 'code', language: 'javascript', code: 'typeof "hello";    // "string"\ntypeof 5;          // "number"\ntypeof true;       // "boolean"\ntypeof undefined;  // "undefined"\ntypeof null;       // "object" (জাভাস্ক্রিপ্টের একটি অদ্ভুত আচরণ)' },
  { id: '2dx0rKFz7H0_', text: '🧪 অনুশীলন টিপ:', type: 'heading', level: 2, anchor: 'practice-tip' },
  { id: '7pleDE_CIqJm', type: 'richtext', html: `<p>এমন একটি ছোট স্ক্রিপ্ট তৈরি করুন যা:</p>
<ol>
                                    <li><code>let</code> এবং <code>const</code> ব্যবহার করে ভেরিয়েবল ঘোষণা করে</li>
                                    <li>অ্যারিথমেটিক ও লজিক্যাল অপারেটর ব্যবহার করে</li>
                                    <li><code>console.log()</code> দিয়ে ফলাফল আউটপুট করে</li>
                                </ol>
<p>উদাহরণ:</p>` },
  { id: '4-kI66nghJrH', type: 'code', language: 'javascript', code: 'let a = 10;\nlet b = 5;\nlet sum = a + b;\n                                    \nconsole.log("Sum:", sum);\nconsole.log("Are both greater than 0?", a > 0 && b > 0);' },
]

const toc = [
  { id: 'javascript-syntax', text: 'জাভাস্ক্রিপ্ট সিনট্যাক্স', level: 2 },
  { id: 'javascript-statements', text: 'জাভাস্ক্রিপ্ট স্টেটমেন্ট', level: 2 },
  { id: 'javascript-comments', text: 'জাভাস্ক্রিপ্ট কমেন্ট', level: 2 },
  { id: 'variables-in-javascript', text: 'জাভাস্ক্রিপ্টে ভেরিয়েবল', level: 2 },
  { id: 'var-old-way', text: 'var (পুরনো পদ্ধতি)', level: 3 },
  { id: 'let-modern-block-scoped', text: 'let (আধুনিক, ব্লক-স্কোপড)', level: 3 },
  { id: 'const-constant---value-cannot-change', text: 'const (কনস্ট্যান্ট - মান পরিবর্তন করা যায় না)', level: 3 },
  { id: 'javascript-data-types', text: 'জাভাস্ক্রিপ্ট ডেটা টাইপ', level: 2 },
  { id: 'primitive-types', text: 'প্রিমিটিভ টাইপ:', level: 3 },
  { id: 'non-primitive-types', text: 'নন-প্রিমিটিভ টাইপ:', level: 3 },
  { id: 'javascript-operators', text: 'জাভাস্ক্রিপ্ট অপারেটর', level: 2 },
  { id: '1-arithmetic-operators', text: '১. অ্যারিথমেটিক অপারেটর', level: 3 },
  { id: '2-assignment-operators', text: '২. অ্যাসাইনমেন্ট অপারেটর', level: 3 },
  { id: '3-comparison-operators', text: '৩. তুলনা অপারেটর', level: 3 },
  { id: '4-logical-operators', text: '৪. লজিক্যাল অপারেটর', level: 3 },
  { id: '5-string-concatenation-operator', text: '৫. স্ট্রিং কনক্যাটেনেশন অপারেটর', level: 3 },
  { id: 'type-conversion-casting', text: 'টাইপ কনভার্সন (কাস্টিং)', level: 2 },
  { id: 'implicit-automatic', text: '👉 ইমপ্লিসিট (স্বয়ংক্রিয়)', level: 3 },
  { id: 'explicit-manual', text: '👉 এক্সপ্লিসিট (ম্যানুয়াল)', level: 3 },
  { id: 'typeof-operator', text: 'typeof অপারেটর', level: 2 },
  { id: 'practice-tip', text: '🧪 অনুশীলন টিপ:', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/basics: 1/1 written')
