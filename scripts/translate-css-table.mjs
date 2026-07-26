import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '8944d099-3ab1-45fc-8330-bab35b0f9efb' // css/table
const title = 'CSS টেবিল'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'বর্ডার, প্যাডিং, অ্যালাইনমেন্ট, হোভার ইফেক্ট এবং রেসপন্সিভ ডিজাইনসহ CSS দিয়ে HTML টেবিল স্টাইল করা শিখুন।'

const namesTable1 = {
  header: ['কোম্পানি', 'যোগাযোগ', 'দেশ'],
  rows: [
    ['Alfreds Futterkiste', 'Maria Anders', 'Germany'],
    ['Berglunds snabbköp', 'Christina Berglund', 'Sweden'],
    ['Centro comercial Moctezuma', 'Francisco Chang', 'Mexico'],
    ['Ernst Handel', 'Roland Mendel', 'Austria'],
    ['Island Trading', 'Helen Bennett', 'UK'],
    ['Königlich Essen', 'Philip Cramer', 'Germany'],
    ['Laughing Bacchus Winecellars', 'Yoshi Tannamuri', 'Canada'],
    ['Magazzini Alimentari Riuniti', 'Giovanni Rovelli', 'Italy'],
  ],
}
const nameTable2 = { header: ['প্রথম নাম', 'পদবি'], rows: [['Peter', 'Griffin'], ['Lois', 'Griffin']] }
const nameTable3header = ['প্রথম নাম', 'পদবি', 'সঞ্চয়']
const nameTable3rows = [['Peter', 'Griffin', '$100'], ['Lois', 'Griffin', '$150'], ['Joe', 'Swanson', '$300']]
const responsiveHeader = ['প্রথম নাম', 'পদবি', 'পয়েন্ট', 'পয়েন্ট', 'পয়েন্ট', 'পয়েন্ট', 'পয়েন্ট', 'পয়েন্ট', 'পয়েন্ট', 'পয়েন্ট', 'পয়েন্ট', 'পয়েন্ট', 'পয়েন্ট', 'পয়েন্ট']
const responsiveRows = [
  ['Jill', 'Smith', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50', '50'],
  ['Eve', 'Jackson', '94', '94', '94', '94', '94', '94', '94', '94', '94', '94', '94', '94'],
  ['Jill', 'Smith', '67', '67', '67', '67', '67', '67', '67', '67', '67', '67', '67', '67'],
]

const blocks = [
  { id: 'W_CZPStYsEuF', type: 'richtext', html: '<hr>\n<p>CSS দিয়ে একটি HTML টেবিলের চেহারা অনেক ভালো করা যায়:</p>' },
  { id: '3A6Fem8S-OEL', type: 'table', header: namesTable1.header, rows: namesTable1.rows },
  { id: 'CKcFW4o2hvZt', type: 'richtext', html: '<hr>' },
  { id: 'lgHthjK37hzX', text: 'টেবিল বর্ডার', type: 'heading', level: 2, anchor: 'table-borders' },
  { id: 'iEQnMsuJyyjT', type: 'richtext', html: '<p>CSS-এ টেবিলের বর্ডার নির্দিষ্ট করতে <code>border</code> প্রপার্টি ব্যবহার করুন।</p>\n<p>নিচের উদাহরণে &lt;table&gt;, &lt;th&gt;, এবং &lt;td&gt; এলিমেন্টের জন্য একটি কালো বর্ডার নির্দিষ্ট করা হয়েছে:</p>' },
  { id: 'C3C8lvaVkLH2', type: 'table', header: nameTable2.header, rows: nameTable2.rows },
  { id: '0cSypxfIDcMD', type: 'code', language: 'css', code: 'table, th, td {\n  border: 1px solid black;\n}' },
  { id: '259jb3YlPsnb', type: 'richtext', html: '<p>লক্ষ্য করুন যে উপরের উদাহরণে টেবিলটির ডাবল বর্ডার আছে। কারণ টেবিল এবং &lt;th&gt;/&lt;td&gt; এলিমেন্টের নিজস্ব আলাদা বর্ডার আছে।</p>\n<hr>' },
  { id: 'CK1cMTSEWOoh', text: 'টেবিল বর্ডার একত্রিত করা', type: 'heading', level: 2, anchor: 'collapse-table-borders' },
  { id: 'yvp9hTN8kKbK', type: 'richtext', html: '<p><code>border-collapse</code> প্রপার্টি ঠিক করে টেবিলের বর্ডারগুলো একটিমাত্র বর্ডারে একত্রিত হবে কিনা:</p>' },
  { id: 'o4e0Keq7BwMX', type: 'table', header: nameTable2.header, rows: nameTable2.rows },
  { id: 'hmuddR0QoD2X', type: 'code', language: 'css', code: 'table {\n  border-collapse: collapse;\n}\ntable, th, td {\n  border: 1px solid black;\n}' },
  { id: 'CINF3bvng4kw', type: 'richtext', html: '<p>শুধু টেবিলের চারপাশে একটি বর্ডার চাইলে, শুধু &lt;table&gt;-এর জন্য <code>border</code> প্রপার্টি নির্দিষ্ট করুন:</p>' },
  { id: 's6zV_U4jeePC', type: 'table', header: nameTable2.header, rows: nameTable2.rows },
  { id: 'gGln4xhWjzgC', type: 'code', language: 'css', code: 'table {\n  border: 1px solid black;\n}' },
  { id: 's6BQ_d7HfPpy', type: 'richtext', html: '<hr>' },
  { id: 'yO0TuYacsf-Z', text: 'টেবিলের প্রস্থ ও উচ্চতা', type: 'heading', level: 2, anchor: 'table-width-and-height' },
  { id: 'rkp_NyObNOK1', type: 'richtext', html: '<p>একটি টেবিলের প্রস্থ ও উচ্চতা নির্ধারণ করা হয় <code>width</code> এবং <code>height</code> প্রপার্টি দিয়ে।</p>\n<p>নিচের উদাহরণে টেবিলের প্রস্থ 100% এবং &lt;th&gt; এলিমেন্টের উচ্চতা 50px নির্ধারণ করা হয়েছে:</p>' },
  { id: '_B-skB0jRSZf', type: 'table', header: nameTable3header, rows: nameTable3rows },
  { id: 'EER_-AcFkpaZ', type: 'code', language: 'css', code: 'table {\n  width: 100%;\n}\nth {\n  height: 50px;\n}' },
  { id: 'QCHZIzuBeOfR', type: 'richtext', html: '<hr>' },
  { id: 'zLEmmvzwXTfy', text: 'অনুভূমিক অ্যালাইনমেন্ট', type: 'heading', level: 2, anchor: 'horizontal-alignment' },
  { id: '_GfVj0Hd-bYe', type: 'richtext', html: '<p><code>text-align</code> প্রপার্টি &lt;th&gt; বা &lt;td&gt;-এর কনটেন্টের অনুভূমিক অ্যালাইনমেন্ট (যেমন left, right, বা center) নির্ধারণ করে।</p>\n<p>ডিফল্টভাবে, &lt;th&gt; এলিমেন্টের কনটেন্ট মাঝ বরাবর এবং &lt;td&gt; এলিমেন্টের কনটেন্ট বামদিকে অ্যালাইন করা থাকে।</p>\n<p>নিচের উদাহরণে &lt;th&gt; এলিমেন্টের টেক্সট বামদিকে অ্যালাইন করা হয়েছে:</p>' },
  { id: 'MIfq_a7FfyU7', type: 'table', header: nameTable3header, rows: nameTable3rows },
  { id: 't8GILXyNZsF2', type: 'code', language: 'css', code: 'th {\n  text-align: left;\n}' },
  { id: 'MOLc0O8qNplH', type: 'richtext', html: '<hr>' },
  { id: 'LJsfsT2p5jwF', text: 'উলম্ব অ্যালাইনমেন্ট', type: 'heading', level: 2, anchor: 'vertical-alignment' },
  { id: 'kmnp06Il-Cwx', type: 'richtext', html: '<p><code>vertical-align</code> প্রপার্টি &lt;th&gt; বা &lt;td&gt;-এর কনটেন্টের উলম্ব অ্যালাইনমেন্ট (যেমন top, bottom, বা middle) নির্ধারণ করে।</p>\n<p>ডিফল্টভাবে, একটি টেবিলে কনটেন্টের উলম্ব অ্যালাইনমেন্ট মাঝ বরাবর থাকে (&lt;th&gt; এবং &lt;td&gt; উভয় এলিমেন্টের ক্ষেত্রেই)।</p>\n<p>নিচের উদাহরণে &lt;td&gt; এলিমেন্টের উলম্ব টেক্সট অ্যালাইনমেন্ট নিচের দিকে (bottom) সেট করা হয়েছে:</p>' },
  { id: 'XyabCNVjudoL', type: 'table', header: nameTable3header, rows: nameTable3rows },
  { id: 'iHnSPItsngMk', type: 'code', language: 'css', code: 'td {\n  height: 50px;\n  vertical-align: bottom;\n}' },
  { id: '9ObLaEHSUDap', type: 'richtext', html: '<hr>' },
  { id: 'e5nxeKm_F9n-', text: 'টেবিল প্যাডিং', type: 'heading', level: 2, anchor: 'table-padding' },
  { id: 'MSMQeiUHurRi', type: 'richtext', html: '<p>একটি টেবিলে বর্ডার এবং কনটেন্টের মধ্যে জায়গা নিয়ন্ত্রণ করতে, &lt;td&gt; এবং &lt;th&gt; এলিমেন্টে <code>padding</code> প্রপার্টি ব্যবহার করুন:</p>' },
  { id: 'y3X57Zygufnw', type: 'table', header: nameTable3header, rows: nameTable3rows },
  { id: 'yesg_fsRwIZS', type: 'code', language: 'css', code: 'th, td {\n  padding: 15px;\n  text-align: left;\n}' },
  { id: '5FzKLqopO2X0', type: 'richtext', html: '<hr>' },
  { id: 'AXglczt0u65Q', text: 'অনুভূমিক ডিভাইডার', type: 'heading', level: 2, anchor: 'horizontal-dividers' },
  { id: 'PiojJzsIZQRU', type: 'table', header: nameTable3header, rows: nameTable3rows },
  { id: 'b3PmmmlXusPL', type: 'richtext', html: '<p>অনুভূমিক ডিভাইডারের জন্য &lt;th&gt; ও &lt;td&gt;-তে <code>border-bottom</code> প্রপার্টি যোগ করুন:</p>' },
  { id: '-8mGf-xOTROs', type: 'code', language: 'css', code: 'th, td {\n  border-bottom: 1px solid #ddd;\n}' },
  { id: '53Cm3BdN2T7e', type: 'richtext', html: '<hr>' },
  { id: 'y0QrC2sT8RCT', text: 'হোভারযোগ্য টেবিল', type: 'heading', level: 2, anchor: 'hoverable-table' },
  { id: 'b5tWDMZS8_gy', type: 'richtext', html: '<p>মাউস হোভার করলে টেবিলের সারি হাইলাইট করতে &lt;tr&gt;-তে <code class="w3-codespan">:hover</code> সিলেক্টর ব্যবহার করুন:</p>' },
  { id: 'Ozg-vCvrCoXj', type: 'table', header: nameTable3header, rows: nameTable3rows },
  { id: 'CWOEWARf0CPs', type: 'code', language: 'css', code: 'tr:hover {background-color: #f5f5f5;}' },
  { id: '7YRVdvlD4-u9', type: 'richtext', html: '<hr>' },
  { id: 'fgJeskKMkm5p', text: 'ডোরাকাটা (Striped) টেবিল', type: 'heading', level: 2, anchor: 'striped-tables' },
  { id: 'zp9jfWqV9Xrb', type: 'table', header: nameTable3header, rows: nameTable3rows },
  { id: 'x5nn1D_pgrwN', type: 'richtext', html: '<p>জেব্রা-স্ট্রাইপড টেবিলের জন্য, <code>nth-child()</code> সিলেক্টর ব্যবহার করুন এবং সব জোড় (বা বিজোড়) টেবিল সারিতে একটি <code>background-color</code> যোগ করুন:</p>' },
  { id: 'sq9dz4PdzXcN', type: 'code', language: 'css', code: 'tr:nth-child(even) {background-color: #dee2e6;}' },
  { id: 'WIboRoRTWyCg', type: 'richtext', html: '<hr>' },
  { id: 'PHpg9kKxRYe5', text: 'টেবিলের রঙ', type: 'heading', level: 2, anchor: 'table-color' },
  { id: 'yfVxEYOnx15e', type: 'richtext', html: '<p>নিচের উদাহরণে &lt;th&gt; এলিমেন্টের ব্যাকগ্রাউন্ড রঙ এবং টেক্সট রঙ নির্দিষ্ট করা হয়েছে:</p>' },
  { id: 'PFx5fnXbQKNU', type: 'table', header: nameTable3header, rows: nameTable3rows },
  { id: 'GRa5fk0-G8LK', type: 'code', language: 'css', code: 'th {\n  background-color: #0054D1;\n  color: white;\n}' },
  { id: '_exOR2tr3WxS', type: 'richtext', html: '<hr>' },
  { id: 'IrP9lC653AJN', text: 'রেসপন্সিভ টেবিল', type: 'heading', level: 2, anchor: 'responsive-table' },
  { id: 'aqcs2hvPSzzX', type: 'richtext', html: '<p>স্ক্রিন যদি পুরো কনটেন্ট দেখানোর জন্য খুব ছোট হয়, তাহলে একটি রেসপন্সিভ টেবিলে একটি অনুভূমিক স্ক্রল বার দেখাবে:</p>' },
  { id: 'WS5YGhuA3SFw', type: 'table', header: responsiveHeader, rows: responsiveRows },
  { id: 'LLyKBZDyMhJD', type: 'richtext', html: '<p>টেবিলটি রেসপন্সিভ করতে &lt;table&gt; এলিমেন্টের চারপাশে <code>overflow-x:auto</code>-সহ একটি কন্টেইনার এলিমেন্ট (যেমন &lt;div&gt;) যোগ করুন:</p>' },
  { id: 'EN37N2kndnoq', type: 'code', language: 'html', code: '<div style="overflow-x:auto;">\n<table>\n... table content ...\n</table>\n</div>' },
  { id: 'ZD6MgApi5YdG', type: 'richtext', html: '<p class="note"><b>মনে রাখবেন:</b> OS X Lion-এ (Mac-এ), স্ক্রলবার ডিফল্টভাবে লুকানো থাকে এবং শুধুমাত্র ব্যবহারের সময় দেখা যায় (এমনকি "overflow:scroll" সেট করা থাকলেও)।</p>' },
]

const toc = [
  { id: 'table-borders', text: 'টেবিল বর্ডার', level: 2 },
  { id: 'collapse-table-borders', text: 'টেবিল বর্ডার একত্রিত করা', level: 2 },
  { id: 'table-width-and-height', text: 'টেবিলের প্রস্থ ও উচ্চতা', level: 2 },
  { id: 'horizontal-alignment', text: 'অনুভূমিক অ্যালাইনমেন্ট', level: 2 },
  { id: 'vertical-alignment', text: 'উলম্ব অ্যালাইনমেন্ট', level: 2 },
  { id: 'table-padding', text: 'টেবিল প্যাডিং', level: 2 },
  { id: 'horizontal-dividers', text: 'অনুভূমিক ডিভাইডার', level: 2 },
  { id: 'hoverable-table', text: 'হোভারযোগ্য টেবিল', level: 2 },
  { id: 'striped-tables', text: 'ডোরাকাটা (Striped) টেবিল', level: 2 },
  { id: 'table-color', text: 'টেবিলের রঙ', level: 2 },
  { id: 'responsive-table', text: 'রেসপন্সিভ টেবিল', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('css/table: 1/1 written')
