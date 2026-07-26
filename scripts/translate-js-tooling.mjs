import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '562ef18f-50f7-44c2-9f55-bdcec3381f5d' // javascript/tooling
const title = 'জাভাস্ক্রিপ্ট টুলিং - Babel, Webpack, এবং npm'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'Babel দিয়ে ট্রান্সপাইল, Webpack দিয়ে বান্ডলিং, এবং npm দিয়ে প্যাকেজ ম্যানেজমেন্ট শিখুন।'

const blocks = [
  { id: 'O_8CKcrxBfF9', type: 'richtext', html: '<p><em>(শক্তিশালী ডেভেলপার টুল দিয়ে আপনার জাভাস্ক্রিপ্ট ওয়ার্কফ্লো আরও কার্যকর করুন)</em></p>\n<hr>' },
  { id: 'Z-Nvh-JTCwim', text: 'জাভাস্ক্রিপ্টে কেন টুলিং ব্যবহার করবেন?', type: 'heading', level: 2, anchor: 'why-use-tooling-in-javascript' },
  { id: 'UqvSmHJdmpci', type: 'richtext', html: `<p>জাভাস্ক্রিপ্ট প্রজেক্ট বড় হওয়ার সাথে সাথে, আমাদের এমন টুল দরকার যা সাহায্য করে:</p>
<ul>
                                  <li><strong>আধুনিক JS-কে পুরনো ভার্সনে ট্রান্সপাইল করতে (কম্প্যাটিবিলিটির জন্য)</strong></li>
                                  <li><strong>একাধিক ফাইল একসাথে বান্ডল করতে</strong></li>
                                  <li><strong>বাহ্যিক লাইব্রেরি ম্যানেজ করতে</strong></li>
                                  <li><strong>কোড কার্যকরভাবে অপ্টিমাইজ ও ডিপ্লয় করতে</strong></li>
                                </ul>
<p>এখানেই <strong>Babel</strong>, <strong>Webpack</strong>, এবং <strong>npm</strong>-এর ভূমিকা আসে।</p>` },
  { id: 'EYhY0Ujf6MlN', text: '১. Babel - জাভাস্ক্রিপ্ট কম্পাইলার', type: 'heading', level: 2, anchor: '1-babel---the-javascript-compiler' },
  { id: 'N3j76uy3o2Qb', text: 'Babel কী?', type: 'heading', level: 3, anchor: 'what-is-babel' },
  { id: 'pAmmXiwVucKf', type: 'richtext', html: '<p><strong>Babel</strong> এমন একটি টুল যা আপনাকে <strong>আধুনিক জাভাস্ক্রিপ্ট (ES6+) লিখতে এবং এটিকে এমন কোডে রূপান্তর করতে</strong> দেয় যা <strong>পুরনো ব্রাউজারেও</strong> (যেমন IE11) কাজ করে।</p>' },
  { id: '_bJqTVVWOfGg', text: 'কেন Babel ব্যবহার করবেন?', type: 'heading', level: 3, anchor: 'why-use-babel' },
  { id: 'klxImwNFp7M7', type: 'richtext', html: `<ul>
                                  <li>অ্যারো ফাংশন, <code>let</code>, <code>const</code>, <code>modules</code> ইত্যাদি রূপান্তর করে</li>
                                  <li>পুরনো ব্রাউজারের সাথে কম্প্যাটিবিলিটি নিশ্চিত করে</li>
                                  <li><strong>React</strong> এবং <strong>Vue</strong>-এর মতো ফ্রেমওয়ার্কের সাথে কাজ করে</li>
                                </ul>` },
  { id: 'nvPHU_EtYROp', text: 'উদাহরণ', type: 'heading', level: 3, anchor: 'example' },
  { id: 'j_2SxsN6HUNA', type: 'code', language: 'javascript', code: '// ES6 কোড\nconst greet = (name) => `Hello ${name}`;\n\n// Babel আউটপুট (ES5)\nvar greet = function(name) {\n  return \'Hello \' + name;\n};' },
  { id: 'qcHQ6dENK5tH', text: 'Babel ইনস্টল করা (npm দিয়ে)', type: 'heading', level: 3, anchor: 'installing-babel-via-npm' },
  { id: 'rnsCkuSWA1qk', type: 'code', language: 'html', code: 'npm install --save-dev @babel/core @babel/cli @babel/preset-env' },
  { id: 'N3-hqOb8p5WE', type: 'richtext', html: '<p>একটি <code>.babelrc</code> কনফিগ ফাইল তৈরি করুন:</p>' },
  { id: 'Re35ITHVSvGs', type: 'code', language: 'text', code: '{\n  "presets": ["@babel/preset-env"]\n}' },
  { id: 'wnizVCcQLroe', type: 'richtext', html: '<p>একটি ফাইল ট্রান্সপাইল করুন:</p>' },
  { id: 'ancO1LH1iqQu', type: 'code', language: 'html', code: 'npx babel script.js --out-file script-compiled.js' },
  { id: '4TJR28t1_aE_', text: '২. Webpack - মডিউল বান্ডলার', type: 'heading', level: 2, anchor: '2-webpack---module-bundler' },
  { id: '6JEA3GGdWU0l', text: 'Webpack কী?', type: 'heading', level: 3, anchor: 'what-is-webpack' },
  { id: 'KZN6tn3ebslY', type: 'richtext', html: '<p><strong>Webpack</strong> একটি শক্তিশালী টুল, যা <strong>জাভাস্ক্রিপ্ট ফাইল (এবং অন্যান্য অ্যাসেট)</strong> একটি বা একাধিক অপ্টিমাইজড আউটপুট ফাইলে বান্ডল করে।</p>' },
  { id: '4FWL5kHHNqn5', text: 'কেন Webpack ব্যবহার করবেন?', type: 'heading', level: 3, anchor: 'why-use-webpack' },
  { id: '4WOxY_OKBQhT', type: 'richtext', html: `<ul>
                                  <li>অনেক <code>.js</code> ফাইলকে একটিতে একত্রিত করে</li>
                                  <li>প্লাগইন ও লোডার সমর্থন করে (যেমন, CSS, ইমেজের জন্য)</li>
                                  <li>ডেভেলপমেন্টের জন্য হট রিলোডিং সক্ষম করে</li>
                                  <li>আধুনিক অ্যাপ বিল্ডের জন্য (যেমন, React, Vue) অপরিহার্য</li>
                                </ul>` },
  { id: 'Nj5wDr0ENaAi', text: 'Webpack ইনস্টল করা', type: 'heading', level: 3, anchor: 'install-webpack' },
  { id: 'ARdi6dQ-vTRG', type: 'code', language: 'html', code: 'npm install --save-dev webpack webpack-cli' },
  { id: 'o4FhdIzPEmcU', text: 'উদাহরণ ফাইল স্ট্রাকচার', type: 'heading', level: 3, anchor: 'example-file-structure' },
  { id: '9AocEBovmjm_', type: 'code', language: 'html', code: 'project/\n├── src/\n│   └── index.js\n├── dist/\n│   └── bundle.js (output)\n├── webpack.config.js' },
  { id: 'ql3G89UbwpJw', text: 'নমুনা webpack.config.js', type: 'heading', level: 3, anchor: 'sample-webpackconfigjs' },
  { id: '5t_a-RWdAEQQ', type: 'code', language: 'javascript', code: "const path = require('path');\n\nmodule.exports = {\n  entry: './src/index.js',\n  output: {\n    filename: 'bundle.js',\n    path: path.resolve(__dirname, 'dist')\n  },\n  mode: 'development'\n};" },
  { id: 'Yz5ieHBoD7qG', text: 'Webpack চালানো', type: 'heading', level: 3, anchor: 'run-webpack' },
  { id: 'sLkJj5aV_PYe', type: 'code', language: 'html', code: 'npx webpack' },
  { id: 'kdI32qgn5SYt', text: '৩. npm - Node Package Manager', type: 'heading', level: 2, anchor: '3-npm---node-package-manager' },
  { id: '4kUDv3WbcM42', text: 'npm কী?', type: 'heading', level: 3, anchor: 'what-is-npm' },
  { id: 'iQ_RqIMZBSUq', type: 'richtext', html: '<p><strong>npm</strong> হলো <strong>Node.js-এর ডিফল্ট প্যাকেজ ম্যানেজার</strong>। এটি আপনাকে তৃতীয়-পক্ষের লাইব্রেরি বা টুল <strong>ইনস্টল</strong>, <strong>আপডেট</strong> এবং <strong>ম্যানেজ</strong> করতে দেয়।</p>' },
  { id: 'FrjenFIxtLdU', text: 'সাধারণ npm কমান্ড', type: 'heading', level: 3, anchor: 'common-npm-commands' },
  { id: 'lyUJW5t0fArA', type: 'code', language: 'html', code: 'npm init # একটি নতুন প্রজেক্ট শুরু করে\nnpm install package   # একটি প্যাকেজ ইনস্টল করে\nnpm install -D package  # ডেভ ডিপেন্ডেন্সি হিসেবে ইনস্টল করে\nnpm uninstall package  # একটি প্যাকেজ সরিয়ে ফেলে\nnpm update            # সব প্যাকেজ আপডেট করে' },
  { id: 'MNIT18-3c2gO', text: 'উদাহরণ: package.json', type: 'heading', level: 3, anchor: 'example-packagejson' },
  { id: 'Rsxf1wJqdCl0', type: 'code', language: 'text', code: '{\n  "name": "my-app",\n  "version": "1.0.0",\n  "scripts": {\n    "build": "webpack",\n    "start": "node server.js"\n  }\n}' },
  { id: 'Wz5HYM9Sh2P_', text: 'npm স্ক্রিপ্ট ব্যবহার করা', type: 'heading', level: 3, anchor: 'using-npm-scripts' },
  { id: 'QQtpyanX71hM', type: 'richtext', html: '<p>ম্যানুয়ালি কমান্ড চালানোর বদলে, সেগুলো <code>scripts</code>-এ যোগ করুন:</p>' },
  { id: 'V2dIMgWAauj2', type: 'code', language: 'html', code: 'npm run build\nnpm start' },
  { id: 'yYZYuhDqCOBI', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: 'bmRGOOAmHXJO', type: 'richtext', html: `<ul>
                                <li><strong>Babel</strong> আপনাকে আধুনিক জাভাস্ক্রিপ্ট লিখতে এবং যেকোনো জায়গায় চালাতে দেয়।</li>
                                <li><strong>Webpack</strong> কার্যকর ডেলিভারির জন্য আপনার সব কোড ও অ্যাসেট বান্ডল করে।</li>
                                <li><strong>npm</strong> লাইব্রেরি ও প্রজেক্ট ডিপেন্ডেন্সি ম্যানেজ করতে সাহায্য করে।</li>
                              </ul>
<p class="note">আধুনিক ফ্রন্ট-এন্ড ফ্রেমওয়ার্ক ও ফুল-স্ট্যাক পরিবেশে কাজ করার জন্য এই টুলগুলো আয়ত্ত করা অপরিহার্য।</p>` },
  { id: 'WH-3I6a6dzJd', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'BWliabEw6OL9', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'padj5kTqnvtB', type: 'richtext', html: `<ol>
                                    <li>অ্যারো ফাংশন ব্যবহার করে একটি ছোট JS ফাইল তৈরি করুন এবং Babel দিয়ে ট্রান্সপাইল করুন।</li>
                                    <li>একাধিক JS ফাইল বান্ডল করতে Webpack দিয়ে একটি প্রজেক্ট সেট আপ করুন।</li>
                                    <li>একটি সাধারণ প্রজেক্টে একটি npm প্যাকেজ (যেমন lodash) ইনস্টল করে ব্যবহার করুন।</li>
                                    <li>build ও start কাজের জন্য কাস্টম npm স্ক্রিপ্ট লিখুন।</li>
                                    <li>একটি ছোট ES6 প্রজেক্টের জন্য Babel + Webpack একসাথে ব্যবহার করুন।</li>
                              </ol>` },
]

const toc = [
  { id: 'why-use-tooling-in-javascript', text: 'জাভাস্ক্রিপ্টে কেন টুলিং ব্যবহার করবেন?', level: 2 },
  { id: '1-babel---the-javascript-compiler', text: '১. Babel - জাভাস্ক্রিপ্ট কম্পাইলার', level: 2 },
  { id: 'what-is-babel', text: 'Babel কী?', level: 3 },
  { id: 'why-use-babel', text: 'কেন Babel ব্যবহার করবেন?', level: 3 },
  { id: 'example', text: 'উদাহরণ', level: 3 },
  { id: 'installing-babel-via-npm', text: 'Babel ইনস্টল করা (npm দিয়ে)', level: 3 },
  { id: '2-webpack---module-bundler', text: '২. Webpack - মডিউল বান্ডলার', level: 2 },
  { id: 'what-is-webpack', text: 'Webpack কী?', level: 3 },
  { id: 'why-use-webpack', text: 'কেন Webpack ব্যবহার করবেন?', level: 3 },
  { id: 'install-webpack', text: 'Webpack ইনস্টল করা', level: 3 },
  { id: 'example-file-structure', text: 'উদাহরণ ফাইল স্ট্রাকচার', level: 3 },
  { id: 'sample-webpackconfigjs', text: 'নমুনা webpack.config.js', level: 3 },
  { id: 'run-webpack', text: 'Webpack চালানো', level: 3 },
  { id: '3-npm---node-package-manager', text: '৩. npm - Node Package Manager', level: 2 },
  { id: 'what-is-npm', text: 'npm কী?', level: 3 },
  { id: 'common-npm-commands', text: 'সাধারণ npm কমান্ড', level: 3 },
  { id: 'example-packagejson', text: 'উদাহরণ: package.json', level: 3 },
  { id: 'using-npm-scripts', text: 'npm স্ক্রিপ্ট ব্যবহার করা', level: 3 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/tooling: 1/1 written')
