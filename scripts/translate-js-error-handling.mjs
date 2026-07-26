import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '818bcccd-c292-43f7-88d1-5767efc4c54c' // javascript/error-handling
const title = 'জাভাস্ক্রিপ্ট এরর হ্যান্ডলিং'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'try...catch, finally, throw এবং বিল্ট-ইন এরর টাইপ দিয়ে জাভাস্ক্রিপ্টে এরর হ্যান্ডেল করা শিখুন।'

const blocks = [
  { id: 'Ei1mtJWJlIrg', type: 'richtext', html: '<hr>' },
  { id: 'qp91RDY49mQl', text: 'এরর হ্যান্ডলিং কেন গুরুত্বপূর্ণ', type: 'heading', level: 2, anchor: 'why-error-handling-matters' },
  { id: 'jgGeZedKXkPz', type: 'richtext', html: '<p>এরর হতেই পারে! হয়তো ব্যবহারকারী ভুল ডেটা দিয়েছেন, একটি সার্ভার ডাউন আছে, বা একটি ফাংশন ভুল ইনপুট পেয়েছে।</p>\n<p>প্রোগ্রাম ক্র্যাশ না করিয়ে সুন্দরভাবে এরর হ্যান্ডেল করতে <strong>জাভাস্ক্রিপ্ট দেয়</strong> <code>try...catch</code> ব্লক।</p>' },
  { id: 'e9o4EhubvsIo', text: 'সিনট্যাক্স: try...catch', type: 'heading', level: 2, anchor: 'syntax-trycatch' },
  { id: 'asvT-jyen087', type: 'code', language: 'javascript', code: 'try {\n  // এমন কোড যা এরর থ্রো করতে পারে\n} catch (error) {\n  // এরর হ্যান্ডেল করার কোড\n}' },
  { id: 'nAwgWTVv5yTM', text: 'উদাহরণ:', type: 'heading', level: 2, anchor: 'example' },
  { id: 'm_-3d_G3-8_Q', type: 'code', language: 'javascript', code: 'try {\n  let result = someUndefinedVariable + 10;\n} catch (err) {\n  console.log("Something went wrong:", err.message);\n}' },
  { id: '-YEuZlaXu9Bt', type: 'richtext', html: '<p>আউটপুট:</p>' },
  { id: 'iFZ8WAm7rrBv', type: 'code', language: 'html', code: 'Something went wrong: someUndefinedVariable is not defined' },
  { id: 'bpA-vUc-fP23', type: 'richtext', html: '<p><code>try...catch</code> ছাড়া, এই এরর আপনার বাকি জাভাস্ক্রিপ্ট কোড চলা বন্ধ করে দিত!</p>' },
  { id: 'Btrvb2HEm9wz', text: 'finally ব্লক', type: 'heading', level: 2, anchor: 'the-finally-block' },
  { id: 'BnChg_LrvzII', type: 'richtext', html: '<p><code>finally</code> সবসময় চলে — এরর হোক বা না হোক।</p>' },
  { id: '68YfJxuU-nGI', type: 'code', language: 'javascript', code: 'try {\n  console.log("Trying something risky");\n} catch (err) {\n  console.log("Error happened!");\n} finally {\n  console.log("Always runs!");\n}' },
  { id: 'NLGn6_rT6FJf', type: 'richtext', html: '<p>রিসোর্স পরিষ্কার করতে, ফাইল/কানেকশন বন্ধ করতে, বা স্টেট রিসেট করতে <code>finally</code> ব্যবহার করুন।</p>' },
  { id: 'R1qcyT2EhwiN', text: 'throw কীওয়ার্ড', type: 'heading', level: 2, anchor: 'the-throw-keyword' },
  { id: 'BH9yGBxgljAK', type: 'richtext', html: '<p><code>throw</code> ব্যবহার করে আপনি ম্যানুয়ালি কাস্টম এরর থ্রো করতে পারেন।</p>' },
  { id: '5a4a1NTmea4t', type: 'code', language: 'javascript', code: 'function divide(a, b) {\n  if (b === 0) {\n    throw new Error("Cannot divide by zero");\n  }\n  return a / b;\n}\n\ntry {\n  console.log(divide(10, 0));\n} catch (err) {\n  console.log("Caught:", err.message);\n}' },
  { id: 'sIB1jrl32Xqb', text: 'বিল্ট-ইন এরর টাইপ', type: 'heading', level: 2, anchor: 'built-in-error-types' },
  { id: 'UK1rhjNR2B0i', type: 'table', header: ['এরর টাইপ', 'বিবরণ'], rows: [
    ['<code>ReferenceError</code>', 'ভেরিয়েবল নির্ধারিত নয়'],
    ['<code>TypeError</code>', 'ভুল টাইপ বা অবৈধ অপারেশন'],
    ['<code>SyntaxError</code>', 'অবৈধ জাভাস্ক্রিপ্ট সিনট্যাক্স'],
    ['<code>RangeError</code>', 'অনুমোদিত সীমার বাইরে সংখ্যা'],
    ['<code>EvalError</code>', '<code>eval()</code> ফাংশনে এরর'],
    ['<code>URIError</code>', '<code>decodeURI()</code>-এর মতো অবৈধ URI ফাংশন'],
  ] },
  { id: 'GT1KH6PnsSSJ', text: 'বাস্তব জীবনের ব্যবহার: ফর্ম ভ্যালিডেশন', type: 'heading', level: 2, anchor: 'real-life-use-case-form-validation' },
  { id: 'fJ8wX3KMPk_z', type: 'code', language: 'javascript', code: 'function validateAge(age) {\n  if (isNaN(age)) throw new Error("Age must be a number");\n  if (age < 18) throw new Error("You must be at least 18");\n  return true;\n}\n                              \ntry {\n  validateAge("hello");\n} catch (err) {\n  console.log("Validation error:", err.message);\n}' },
  { id: 'H-zZx-uHGzZG', text: 'এরর নেস্টিং এবং রি-থ্রোয়িং', type: 'heading', level: 2, anchor: 'nesting-and-re-throwing-errors' },
  { id: '0rdco9SEE961', type: 'richtext', html: '<p>আপনি একটি এরর ধরতে পারেন, আংশিক হ্যান্ডেল করতে পারেন, এবং আবার থ্রো করতে পারেন।</p>' },
  { id: 'OR1g8Z55thRs', type: 'code', language: 'javascript', code: 'try {\n  try {\n    throw new Error("Original error");\n  } catch (err) {\n    console.log("Logging:", err.message);\n    throw err; // আবার থ্রো করা হচ্ছে\n  }\n} catch (e) {\n  console.log("Final catch:", e.message);\n}' },
  { id: '4adB0eJzo7yV', text: 'ঐচ্ছিক: async/await-এর সাথে try...catch ব্যবহার', type: 'heading', level: 2, anchor: 'optional-using-trycatch-with-asyncawait' },
  { id: 'rc1_vc1aUXEy', type: 'code', language: 'javascript', code: 'async function fetchData() {\n  try {\n    let res = await fetch("https://invalid-url.com");\n    let data = await res.json();\n  } catch (error) {\n    console.log("Network or JSON error:", error.message);\n  }\n}' },
  { id: 'k2v3vM-h7EnU', text: '🧪 অনুশীলনী:', type: 'heading', level: 2, anchor: 'practice-exercise' },
  { id: 'DefYgTnRVQzi', text: 'কাজ:', type: 'heading', level: 3, anchor: 'task' },
  { id: 'LCB3pQuSaRGN', type: 'richtext', html: `<ol>
                                    <li>এমন একটি ফাংশন লিখুন যা আর্গুমেন্টটি স্ট্রিং না হলে একটি এরর থ্রো করে।</li>
                                    <li>দুটি সংখ্যা ভাগ করতে <code>try...catch...finally</code> ব্যবহার করুন।</li>
                                    <li>একটি ফর্মের নাম ফিল্ড ভ্যালিডেট করুন — এটি খালি হলে থ্রো করুন।</li>
                                    <li>একটি নেস্টেড <code>try...catch</code> ব্লক লিখুন এবং এররটি আবার থ্রো করুন।</li>
                                    <li><code>try/catch</code> দিয়ে একটি <code>fetch()</code> রিকোয়েস্টের এরর হ্যান্ডেল করুন।</li>
                                </ol>` },
]

const toc = [
  { id: 'why-error-handling-matters', text: 'এরর হ্যান্ডলিং কেন গুরুত্বপূর্ণ', level: 2 },
  { id: 'syntax-trycatch', text: 'সিনট্যাক্স: try...catch', level: 2 },
  { id: 'example', text: 'উদাহরণ:', level: 2 },
  { id: 'the-finally-block', text: 'finally ব্লক', level: 2 },
  { id: 'the-throw-keyword', text: 'throw কীওয়ার্ড', level: 2 },
  { id: 'built-in-error-types', text: 'বিল্ট-ইন এরর টাইপ', level: 2 },
  { id: 'real-life-use-case-form-validation', text: 'বাস্তব জীবনের ব্যবহার: ফর্ম ভ্যালিডেশন', level: 2 },
  { id: 'nesting-and-re-throwing-errors', text: 'এরর নেস্টিং এবং রি-থ্রোয়িং', level: 2 },
  { id: 'optional-using-trycatch-with-asyncawait', text: 'ঐচ্ছিক: async/await-এর সাথে try...catch ব্যবহার', level: 2 },
  { id: 'practice-exercise', text: '🧪 অনুশীলনী:', level: 2 },
  { id: 'task', text: 'কাজ:', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/error-handling: 1/1 written')
