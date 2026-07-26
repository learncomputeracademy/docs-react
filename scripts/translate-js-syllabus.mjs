import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '8c785c22-3372-4cae-beb9-1b4a5f782670' // javascript/syllabus
const title = 'জাভাস্ক্রিপ্ট সিলেবাস'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'বেসিক থেকে অ্যাডভান্সড পর্যন্ত জাভাস্ক্রিপ্ট শেখার সম্পূর্ণ অধ্যায়ভিত্তিক সিলেবাস।'

const blocks = [
  { id: 'jJF7l42Ye0CL', text: 'জাভাস্ক্রিপ্ট', type: 'heading', level: 2, anchor: 'javascript' },
  { id: 'Lru25iXwhSI5', type: 'richtext', html: `<div class="note">
                                    <p>জাভাস্ক্রিপ্ট হলো HTML এবং ওয়েবের প্রোগ্রামিং ভাষা।</p>
                                    <p>জাভাস্ক্রিপ্ট শেখা সহজ।</p>
                                    <p>এই টিউটোরিয়াল আপনাকে বেসিক থেকে অ্যাডভান্সড পর্যন্ত জাভাস্ক্রিপ্ট শেখাবে।</p>
                                </div>
<hr>` },
  { id: 'wT5G2dY1DwbF', text: 'কেন জাভাস্ক্রিপ্ট পড়বেন?', type: 'heading', level: 2, anchor: 'why-study-javascript' },
  { id: 'fXFdYgs_yGGM', type: 'richtext', html: `<p>জাভাস্ক্রিপ্ট হলো সেই <b>৩টি ভাষার</b> একটি যা সব ওয়েব ডেভেলপারের <b>অবশ্যই</b> শেখা উচিত:</p>
<ol>
                                    <li>ওয়েব পেজের কনটেন্ট নির্ধারণ করতে <b>HTML</b></li>
                                    <li>ওয়েব পেজের লেআউট নির্দিষ্ট করতে <b>CSS</b></li>
                                    <li>ওয়েব পেজের আচরণ প্রোগ্রাম করতে <b>জাভাস্ক্রিপ্ট</b></li>
                                </ol>
<p>ওয়েব পেজই জাভাস্ক্রিপ্ট ব্যবহারের একমাত্র জায়গা নয়। অনেক ডেস্কটপ ও সার্ভার প্রোগ্রাম জাভাস্ক্রিপ্ট ব্যবহার করে। Node.js এর মধ্যে সবচেয়ে পরিচিত। MongoDB এবং CouchDB-এর মতো কিছু ডেটাবেসও তাদের প্রোগ্রামিং ভাষা হিসেবে জাভাস্ক্রিপ্ট ব্যবহার করে।</p>
<hr>` },
  { id: '6fs-1vOwEOv9', text: 'জাভাস্ক্রিপ্ট ডকুমেন্টেশন', type: 'heading', level: 2, anchor: 'javascript-documentation' },
  { id: 'z9_yOhB16vWd', text: 'অধ্যায় ১: জাভাস্ক্রিপ্ট পরিচিতি', type: 'heading', level: 3, anchor: 'chapter-1-introduction-to-javascript' },
  { id: 'Ky4B-xl-H_BF', type: 'richtext', html: `<ul>
                                    <li>জাভাস্ক্রিপ্ট কী?</li>
                                    <li>ইতিহাস ও বিবর্তন</li>
                                    <li>জাভাস্ক্রিপ্ট বনাম অন্যান্য ভাষা</li>
                                    <li>HTML-এ জাভাস্ক্রিপ্ট কীভাবে যোগ করবেন
                                        <ul>
                                            <li>ইনলাইন স্ক্রিপ্ট</li>
                                            <li>ইন্টারনাল স্ক্রিপ্ট</li>
                                            <li>এক্সটার্নাল স্ক্রিপ্ট</li>
                                        </ul>
                                    </li>
                                    <li>জাভাস্ক্রিপ্ট আউটপুট (alert, console.log, document.write, innerHTML)</li>
                                </ul>` },
  { id: 'GOoG4agCLR9R', text: 'অধ্যায় ২: জাভাস্ক্রিপ্ট বেসিকস', type: 'heading', level: 3, anchor: 'chapter-2-javascript-basics' },
  { id: 'irZyO_to-HWz', type: 'richtext', html: `<ul>
                                    <li>সিনট্যাক্স</li>
                                    <li>স্টেটমেন্ট</li>
                                    <li>কমেন্ট</li>
                                    <li>ভেরিয়েবল (<code>var</code>, <code>let</code>, <code>const</code>)</li>
                                    <li>ডেটা টাইপ</li>
                                    <li>অপারেটর (অ্যারিথমেটিক, অ্যাসাইনমেন্ট, তুলনা, লজিক্যাল)</li>
                                </ul>` },
  { id: 'dwF2hzmoNZiF', text: 'অধ্যায় ৩: জাভাস্ক্রিপ্ট কন্ট্রোল ফ্লো', type: 'heading', level: 3, anchor: 'chapter-3-javascript-control-flow' },
  { id: 'aOkIKpce-3A4', type: 'richtext', html: `<ul>
                                    <li>কন্ডিশনাল স্টেটমেন্ট
                                        <ul>
                                            <li><code>if</code>, <code>else</code>, <code>else if</code></li>
                                            <li><code>switch</code></li>
                                        </ul>
                                    </li>
                                    <li>লুপ
                                        <ul>
                                            <li><code>for</code>, <code>while</code>, <code>do...while</code></li>
                                            <li><code>break</code>, <code>continue</code></li>
                                        </ul>
                                    </li>
                                    <li>টারনারি অপারেটর</li>
                                </ul>` },
  { id: 'oXsehFfOAKnD', text: 'অধ্যায় ৪: জাভাস্ক্রিপ্ট ফাংশন', type: 'heading', level: 3, anchor: 'chapter-4-javascript-functions' },
  { id: 'jYPts4aEhVKP', type: 'richtext', html: `<ul>
                                    <li>ফাংশন ডিক্লারেশন</li>
                                    <li>ফাংশন এক্সপ্রেশন</li>
                                    <li>অ্যারো ফাংশন</li>
                                    <li>প্যারামিটার ও আর্গুমেন্ট</li>
                                    <li>রিটার্ন স্টেটমেন্ট</li>
                                    <li>স্কোপ (গ্লোবাল বনাম লোকাল)</li>
                                </ul>` },
  { id: '2XbIrdkNa9UG', text: 'অধ্যায় ৫: জাভাস্ক্রিপ্ট অবজেক্ট', type: 'heading', level: 3, anchor: 'chapter-5-javascript-objects' },
  { id: 'opzSIzkdmIZL', type: 'richtext', html: `<ul>
                                    <li>অবজেক্ট তৈরি করা (অবজেক্ট লিটারেল, কনস্ট্রাক্টর)</li>
                                    <li>প্রপার্টি অ্যাক্সেস করা (Dot বনাম Bracket নোটেশন)</li>
                                    <li>মেথড</li>
                                    <li><code>this</code> কীওয়ার্ড</li>
                                    <li>অবজেক্ট মেথড (<code>Object.keys</code>, <code>Object.values</code>, <code>Object.entries</code>)</li>
                                </ul>` },
  { id: 'ycNCrE2LPy6J', text: 'অধ্যায় ৬: জাভাস্ক্রিপ্ট অ্যারে', type: 'heading', level: 3, anchor: 'chapter-6-javascript-arrays' },
  { id: 'WG9Ihv4QVUZ6', type: 'richtext', html: `<ul>
                                    <li>অ্যারে তৈরি করা</li>
                                    <li>অ্যারে ইনডেক্সিং ও দৈর্ঘ্য</li>
                                    <li>সাধারণ মেথড:
                                        <ul>
                                            <li><code>push()</code>, <code>pop()</code>, <code>shift()</code>, <code>unshift()</code></li>
                                            <li><code>splice()</code>, <code>slice()</code></li>
                                            <li><code>indexOf()</code>, <code>includes()</code></li>
                                            <li><code>map()</code>, <code>filter()</code>, <code>reduce()</code>, <code>forEach()</code></li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'EF3bq7j_hq64', text: 'অধ্যায় ৭: জাভাস্ক্রিপ্ট স্ট্রিং', type: 'heading', level: 3, anchor: 'chapter-7-javascript-strings' },
  { id: 'gYjSL6GEdTkQ', type: 'richtext', html: `<ul>
                                    <li>স্ট্রিং বেসিকস</li>
                                    <li>সাধারণ মেথড:
                                        <ul>
                                            <li><code>length</code>, <code>indexOf()</code>, <code>slice()</code>, <code>substring()</code></li>
                                            <li><code>replace()</code>, <code>toUpperCase()</code>, <code>toLowerCase()</code></li>
                                            <li><code>trim()</code>, <code>split()</code>, <code>concat()</code>, <code>includes()</code></li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: '4MG0PLvv_R-S', text: 'অধ্যায় ৮: জাভাস্ক্রিপ্ট Date ও Time', type: 'heading', level: 3, anchor: 'chapter-8-javascript-date-and-time' },
  { id: 't1NfQGWRrshe', type: 'richtext', html: `<ul>
                                    <li><code>Date</code> অবজেক্ট</li>
                                    <li>Date মান পাওয়া ও সেট করা</li>
                                    <li>তারিখ ফরম্যাট করা</li>
                                    <li>টাইম মেথড</li>
                                </ul>` },
  { id: '4t31LvS33fkT', text: 'অধ্যায় ৯: জাভাস্ক্রিপ্ট Math', type: 'heading', level: 3, anchor: 'chapter-9-javascript-math' },
  { id: 'f4kNw89S8XLR', type: 'richtext', html: `<ul>
                                    <li>Math অবজেক্ট ও মেথড
                                        <ul>
                                            <li><code>Math.round()</code>, <code>Math.floor()</code>, <code>Math.ceil()</code></li>
                                            <li><code>Math.random()</code>, <code>Math.max()</code>, <code>Math.min()</code></li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'u9bljUMkBFY9', text: 'অধ্যায় ১০: জাভাস্ক্রিপ্ট ইভেন্ট', type: 'heading', level: 3, anchor: 'chapter-10-javascript-events' },
  { id: '6PI_2u142Anh', type: 'richtext', html: `<ul>
                                    <li>ইভেন্টের পরিচিতি</li>
                                    <li>ইভেন্ট হ্যান্ডলার (onclick, onmouseover, ইত্যাদি)</li>
                                    <li>addEventListener()</li>
                                    <li>ইভেন্ট অবজেক্ট (event.target, event.preventDefault())</li>
                                </ul>` },
  { id: 'wl3W71_QdGHc', text: 'অধ্যায় ১১: জাভাস্ক্রিপ্ট DOM (Document Object Model)', type: 'heading', level: 3, anchor: 'chapter-11-javascript-dom-document-object-model' },
  { id: 'YqLYgyTF3590', type: 'richtext', html: `<ul>
                                    <li>DOM কী?</li>
                                    <li>DOM ট্রি স্ট্রাকচার</li>
                                    <li>এলিমেন্ট সিলেক্ট করা (<code>getElementById</code>, <code>querySelector</code>)</li>
                                    <li>এলিমেন্ট ম্যানিপুলেট করা (<code>innerHTML</code>, <code>style</code>, <code>classList</code>)</li>
                                    <li>এলিমেন্ট তৈরি ও মুছে ফেলা</li>
                                    <li>DOM ট্রাভার্স করা</li>
                                </ul>` },
  { id: 'RzT31-w0iFD3', text: 'অধ্যায় ১২: জাভাস্ক্রিপ্ট BOM (Browser Object Model)', type: 'heading', level: 3, anchor: 'chapter-12-javascript-bom-browser-object-model' },
  { id: '1dycpg16D8zq', type: 'richtext', html: `<ul>
                                    <li><code>window</code> অবজেক্ট</li>
                                    <li><code>alert()</code>, <code>confirm()</code>, <code>prompt()</code></li>
                                    <li><code>setTimeout()</code>, <code>setInterval()</code></li>
                                    <li><code>navigator</code>, <code>screen</code>, <code>location</code>, <code>history</code></li>
                                </ul>` },
  { id: 'wM4fJ7DkigUE', text: 'অধ্যায় ১৩: জাভাস্ক্রিপ্ট ফর্ম', type: 'heading', level: 3, anchor: 'chapter-13-javascript-forms' },
  { id: 'I2X2nkcUXagv', type: 'richtext', html: `<ul>
                                    <li>ফর্ম এলিমেন্ট অ্যাক্সেস করা</li>
                                    <li>ফর্ম ভ্যালিডেশন (বেসিক)</li>
                                    <li>ডিফল্ট আচরণ প্রতিরোধ করা</li>
                                    <li>জাভাস্ক্রিপ্ট দিয়ে ফর্ম সাবমিট করা</li>
                                </ul>` },
  { id: 'eb4EoaIWs4p3', text: 'অধ্যায় ১৪: জাভাস্ক্রিপ্ট এরর হ্যান্ডলিং', type: 'heading', level: 3, anchor: 'chapter-14-javascript-error-handling' },
  { id: 'kASoaPvhxwzU', type: 'richtext', html: `<ul>
                                    <li><code>try...catch</code></li>
                                    <li><code>finally</code> ব্লক</li>
                                    <li><code>throw</code> স্টেটমেন্ট</li>
                                    <li>কাস্টম এরর মেসেজ</li>
                                </ul>` },
  { id: 'xnPrfjXvUV4-', text: 'অধ্যায় ১৫: জাভাস্ক্রিপ্ট ES6 এবং পরবর্তী', type: 'heading', level: 3, anchor: 'chapter-15-javascript-es6-and-beyond' },
  { id: 'Qb_--JE5Q3tz', type: 'richtext', html: `<ul>
                                    <li><code>let</code>, <code>const</code></li>
                                    <li>টেমপ্লেট লিটারেল</li>
                                    <li>অ্যারো ফাংশন</li>
                                    <li>ডিস্ট্রাকচারিং</li>
                                    <li>স্প্রেড ও রেস্ট অপারেটর</li>
                                    <li>ডিফল্ট প্যারামিটার</li>
                                    <li>মডিউল (import/export)</li>
                                    <li>ক্লাস ও ইনহেরিটেন্স</li>
                                </ul>` },
  { id: 'yH2UkFUd6R2R', text: 'অধ্যায় ১৬: জাভাস্ক্রিপ্ট JSON', type: 'heading', level: 3, anchor: 'chapter-16-javascript-json' },
  { id: 'uKeN25R0wx6T', type: 'richtext', html: `<ul>
                                    <li>JSON কী?</li>
                                    <li>জাভাস্ক্রিপ্ট থেকে JSON-এ রূপান্তর এবং এর উল্টো</li>
                                    <li><code>JSON.stringify()</code> এবং <code>JSON.parse()</code></li>
                                    <li>API নিয়ে কাজ করা (বেসিক)</li>
                                </ul>` },
  { id: 'pX1oCKfQQUVg', text: 'অধ্যায় ১৭: জাভাস্ক্রিপ্ট Promise ও Async/Await', type: 'heading', level: 3, anchor: 'chapter-17-javascript-promises-asyncawait' },
  { id: 'seX0TTfEWcqK', type: 'richtext', html: `<ul>
                                    <li>Promise-এর পরিচিতি</li>
                                    <li><code>.then()</code> এবং <code>.catch()</code></li>
                                    <li><code>async</code> এবং <code>await</code></li>
                                    <li>একাধিক Promise হ্যান্ডেল করা</li>
                                </ul>` },
  { id: 'VEJFk1-GotFD', text: 'অধ্যায় ১৮: জাভাস্ক্রিপ্ট Fetch API', type: 'heading', level: 3, anchor: 'chapter-18-javascript-fetch-api' },
  { id: '1wPZUuP6ukmJ', type: 'richtext', html: `<ul>
                                    <li>Fetch কী?</li>
                                    <li>GET ও POST রিকোয়েস্ট</li>
                                    <li>JSON নিয়ে কাজ করা</li>
                                    <li>Fetch-এ এরর হ্যান্ডলিং</li>
                                </ul>` },
  { id: 'Nrtws-OY3Agf', text: 'অধ্যায় ১৯: জাভাস্ক্রিপ্ট স্টোরেজ', type: 'heading', level: 3, anchor: 'chapter-19-javascript-storage' },
  { id: 'Sry7j-8EiTJv', type: 'richtext', html: `<ul>
                                    <li>Local Storage</li>
                                    <li>Session Storage</li>
                                    <li>স্টোরেজে JSON ব্যবহার করা</li>
                                </ul>` },
  { id: 'beml8wPgdlfb', text: 'অধ্যায় ২০: জাভাস্ক্রিপ্ট প্রজেক্ট ও অনুশীলন', type: 'heading', level: 3, anchor: 'chapter-20-javascript-projects-and-practice' },
  { id: 'XCxj-cXRxKzG', type: 'richtext', html: `<ul>
                                    <li>মিনি প্রজেক্ট (যেমন, To-Do অ্যাপ, ক্যালকুলেটর)</li>
                                    <li>DOM অনুশীলন</li>
                                    <li>API ইন্টিগ্রেশন অনুশীলন</li>
                                    <li>ফর্ম ভ্যালিডেশন প্রজেক্ট</li>
                                </ul>
<p class="note"><b>মনে রাখবেন:</b> বাম দিকের মেনুতে দেওয়া ক্রম অনুযায়ী <a href="/javascript/javascript-intro">এই টিউটোরিয়ালটি</a> পড়ার পরামর্শ দিচ্ছি। সব উদাহরণ চেষ্টা করলে, খুব অল্প সময়ে জাভাস্ক্রিপ্ট সম্পর্কে অনেক কিছু শিখে যাবেন!</p>` },
]

const toc = [
  { id: 'javascript', text: 'জাভাস্ক্রিপ্ট', level: 2 },
  { id: 'why-study-javascript', text: 'কেন জাভাস্ক্রিপ্ট পড়বেন?', level: 2 },
  { id: 'javascript-documentation', text: 'জাভাস্ক্রিপ্ট ডকুমেন্টেশন', level: 2 },
  { id: 'chapter-1-introduction-to-javascript', text: 'অধ্যায় ১: জাভাস্ক্রিপ্ট পরিচিতি', level: 3 },
  { id: 'chapter-2-javascript-basics', text: 'অধ্যায় ২: জাভাস্ক্রিপ্ট বেসিকস', level: 3 },
  { id: 'chapter-3-javascript-control-flow', text: 'অধ্যায় ৩: জাভাস্ক্রিপ্ট কন্ট্রোল ফ্লো', level: 3 },
  { id: 'chapter-4-javascript-functions', text: 'অধ্যায় ৪: জাভাস্ক্রিপ্ট ফাংশন', level: 3 },
  { id: 'chapter-5-javascript-objects', text: 'অধ্যায় ৫: জাভাস্ক্রিপ্ট অবজেক্ট', level: 3 },
  { id: 'chapter-6-javascript-arrays', text: 'অধ্যায় ৬: জাভাস্ক্রিপ্ট অ্যারে', level: 3 },
  { id: 'chapter-7-javascript-strings', text: 'অধ্যায় ৭: জাভাস্ক্রিপ্ট স্ট্রিং', level: 3 },
  { id: 'chapter-8-javascript-date-and-time', text: 'অধ্যায় ৮: জাভাস্ক্রিপ্ট Date ও Time', level: 3 },
  { id: 'chapter-9-javascript-math', text: 'অধ্যায় ৯: জাভাস্ক্রিপ্ট Math', level: 3 },
  { id: 'chapter-10-javascript-events', text: 'অধ্যায় ১০: জাভাস্ক্রিপ্ট ইভেন্ট', level: 3 },
  { id: 'chapter-11-javascript-dom-document-object-model', text: 'অধ্যায় ১১: জাভাস্ক্রিপ্ট DOM (Document Object Model)', level: 3 },
  { id: 'chapter-12-javascript-bom-browser-object-model', text: 'অধ্যায় ১২: জাভাস্ক্রিপ্ট BOM (Browser Object Model)', level: 3 },
  { id: 'chapter-13-javascript-forms', text: 'অধ্যায় ১৩: জাভাস্ক্রিপ্ট ফর্ম', level: 3 },
  { id: 'chapter-14-javascript-error-handling', text: 'অধ্যায় ১৪: জাভাস্ক্রিপ্ট এরর হ্যান্ডলিং', level: 3 },
  { id: 'chapter-15-javascript-es6-and-beyond', text: 'অধ্যায় ১৫: জাভাস্ক্রিপ্ট ES6 এবং পরবর্তী', level: 3 },
  { id: 'chapter-16-javascript-json', text: 'অধ্যায় ১৬: জাভাস্ক্রিপ্ট JSON', level: 3 },
  { id: 'chapter-17-javascript-promises-asyncawait', text: 'অধ্যায় ১৭: জাভাস্ক্রিপ্ট Promise ও Async/Await', level: 3 },
  { id: 'chapter-18-javascript-fetch-api', text: 'অধ্যায় ১৮: জাভাস্ক্রিপ্ট Fetch API', level: 3 },
  { id: 'chapter-19-javascript-storage', text: 'অধ্যায় ১৯: জাভাস্ক্রিপ্ট স্টোরেজ', level: 3 },
  { id: 'chapter-20-javascript-projects-and-practice', text: 'অধ্যায় ২০: জাভাস্ক্রিপ্ট প্রজেক্ট ও অনুশীলন', level: 3 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('javascript/syllabus: 1/1 written')
