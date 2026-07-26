import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const title = 'কম্পিউটারের প্রাথমিক ধারণা'
const meta_title = 'কম্পিউটারের প্রাথমিক ধারণা | Learn Computer Academy'
const meta_description = 'কম্পিউটার, তার প্রজন্ম, মেমরি, হার্ডওয়্যার, সফটওয়্যার, নেটওয়ার্কিং, ইন্টারনেট, সাইবার নিরাপত্তা, কোয়ান্টাম কম্পিউটিং এবং কৃত্রিম বুদ্ধিমত্তার প্রাথমিক ধারণা।'

const blocks = [
  { id: '5MdmBuUeak3d', text: '📘 বিষয়সূচি', type: 'heading', level: 4, anchor: 'contents' },
  { id: 'JuguTV2hZmZM', type: 'richtext', html: `<ol>
                                    <li><a href="#chp1">💡 কম্পিউটার পরিচিতি</a></li>
                                    <li><a href="#chp2">🧩 কম্পিউটারের শ্রেণীবিভাগ</a></li>
                                    <li><a href="#chp3">📚 কম্পিউটারের প্রজন্ম</a></li>
                                    <li><a href="#chp4">🧠 কম্পিউটার মেমরি</a></li>
                                    <li><a href="#chp5">🔢 সংখ্যা পদ্ধতি</a></li>
                                    <li><a href="#chp6">🛠️ কম্পিউটার হার্ডওয়্যার</a></li>
                                    <li><a href="#chp7">📦 কম্পিউটার সফটওয়্যার</a></li>
                                    <li><a href="#chp8">⌨️ ইনপুট ও আউটপুট ডিভাইস</a></li>
                                    <li><a href="#chp9">💾 স্টোরেজ ডিভাইস</a></li>
                                    <li><a href="#chp10">⚙️ অপারেটিং সিস্টেমের প্রাথমিক ধারণা</a></li>
                                    <li><a href="#chp11">🌐 কম্পিউটার নেটওয়ার্কিং পরিচিতি</a></li>
                                    <li><a href="#chp12">🌍 ইন্টারনেটের প্রাথমিক ধারণা</a></li>
                                    <li><a href="#chp13">🔐 সাইবার নিরাপত্তা ও ভালো অভ্যাস</a></li>
                                    <li><a href="#chp14">🖥️ ব্যবহারিক কম্পিউটার অ্যাপ্লিকেশন</a></li>
                                    <li><a href="#chp15">🔮 কোয়ান্টাম কম্পিউটার</a></li>
                                    <li><a href="#chp16">🤖 কৃত্রিম বুদ্ধিমত্তা: ব্যবহারের ক্ষেত্র ও গুরুত্ব</a></li>
                                </ol>
<hr>` },
  { id: 'SJZaH8iTWPe_', text: '1. কম্পিউটার পরিচিতি', type: 'heading', level: 2, anchor: 'chp1' },
  { id: 'XyFA9tUedwWS', type: 'richtext', html: '<p>কম্পিউটার হলো এমন একটি ইলেকট্রনিক যন্ত্র, যা ইনপুট গ্রহণ করে, ডেটা প্রসেস করে, তথ্য সংরক্ষণ করে এবং তা কাজে লাগার মতো আকারে আউটপুট হিসেবে দেয়। এটি দ্রুততা, নির্ভুলতা এবং স্বয়ংক্রিয়ভাবে কাজ সম্পন্ন করে। একটি কম্পিউটার সিস্টেমের মূল উপাদানগুলির মধ্যে রয়েছে হার্ডওয়্যার (ভৌত অংশ), সফটওয়্যার (প্রোগ্রাম), ডেটা এবং ব্যবহারকারী।</p>' },
  { id: 'shTJbhcEEeBK', text: 'মূল বৈশিষ্ট্য:', type: 'heading', level: 4, anchor: 'key-characteristics' },
  { id: '-3eTqrqe8X02', type: 'richtext', html: `<ul>
                                    <li><strong>গতি:</strong> প্রতি সেকেন্ডে লক্ষ লক্ষ অপারেশন সম্পন্ন করতে পারে</li>
                                    <li><strong>নির্ভুলতা:</strong> খুব কম ভুলের সাথে উচ্চ নির্ভুলতা</li>
                                    <li><strong>স্বয়ংক্রিয়তা:</strong> একবার প্রোগ্রাম করা হলে নিজে থেকেই কাজ করে</li>
                                    <li><strong>বহুমুখিতা:</strong> বিভিন্ন ধরনের কাজ করতে পারে</li>
                                    <li><strong>সংরক্ষণক্ষমতা:</strong> বিপুল পরিমাণ ডেটা জমা রাখতে পারে</li>
                                </ul>` },
  { id: 'TsN-Ew0rxGjR', text: 'ব্যবহারক্ষেত্র:', type: 'heading', level: 4, anchor: 'applications' },
  { id: 'awhfJx1Ja8xg', type: 'richtext', html: '<p>শিক্ষা, ব্যবসা, স্বাস্থ্যসেবা, ব্যাংকিং, সরকারি কাজ, বিনোদন</p>\n<hr>' },

  { id: 'oL4HIZ1AhWJH', text: '2. কম্পিউটারের শ্রেণীবিভাগ', type: 'heading', level: 2, anchor: 'chp2' },
  { id: 'mnYegjMABzOR', type: 'richtext', html: '<p>আকার, উদ্দেশ্য এবং ধরন অনুযায়ী কম্পিউটারকে বিভিন্ন ভাগে ভাগ করা যায়:</p>' },
  { id: '-5Fw6ll0fbHs', text: 'আকার অনুযায়ী:', type: 'heading', level: 4, anchor: 'by-size' },
  { id: 'vrBj6tR0H9Pr', type: 'richtext', html: `<ul>
                                    <li><strong>মাইক্রোকম্পিউটার:</strong> ব্যক্তিগত কম্পিউটার (ডেস্কটপ/ল্যাপটপ)</li>
                                    <li><strong>মিনিকম্পিউটার:</strong> একসাথে একাধিক ব্যবহারকারীর জন্য সিস্টেম</li>
                                    <li><strong>মেইনফ্রেম:</strong> বিপুল পরিমাণ ডেটা প্রক্রিয়াকরণের জন্য বড় সিস্টেম</li>
                                    <li><strong>সুপারকম্পিউটার:</strong> বৈজ্ঞানিক হিসাব-নিকাশের জন্য অতি দ্রুতগতির কম্পিউটার</li>
                                </ul>` },
  { id: 'SgnshB2aKZYx', text: 'উদ্দেশ্য অনুযায়ী:', type: 'heading', level: 4, anchor: 'by-purpose' },
  { id: '-sm7_EajrwEL', type: 'richtext', html: `<ul>
                                    <li><strong>সাধারণ উদ্দেশ্যে ব্যবহৃত:</strong> ওয়ার্ড প্রসেসিং, ব্রাউজিং, গেমিং</li>
                                    <li><strong>বিশেষ উদ্দেশ্যে ব্যবহৃত:</strong> এটিএমের মতো এমবেডেড সিস্টেম</li>
                                </ul>` },
  { id: 'wB9XvXG3p6RO', text: 'ধরন অনুযায়ী:', type: 'heading', level: 4, anchor: 'by-type' },
  { id: '2ZRzE1PuFpcq', type: 'richtext', html: `<ul>
                                    <li><strong>অ্যানালগ:</strong> ভৌত মান পরিমাপ করে</li>
                                    <li><strong>ডিজিটাল:</strong> বাইনারি ডেটা নিয়ে কাজ করে</li>
                                    <li><strong>হাইব্রিড:</strong> অ্যানালগ এবং ডিজিটাল উভয়ের বৈশিষ্ট্যের মিশ্রণ</li>
                                </ul>
<hr>` },

  { id: 'Vn3Rh3E8prgu', text: '3. কম্পিউটারের প্রজন্ম', type: 'heading', level: 2, anchor: 'chp3' },
  { id: '86iBqaNEKfvr', type: 'richtext', html: `<p>কম্পিউটারের বিবর্তনকে বিভিন্ন প্রজন্মে ভাগ করা হয়েছে:</p>
<ul>
                                    <li><strong>প্রথম প্রজন্ম (1940-1956):</strong> ভ্যাকুয়াম টিউব ব্যবহৃত হতো, গতি কম ছিল, আকারে বড় ছিল (যেমন, ENIAC, EDVAC, UNIVAC, IBM-701 এবং IBM-650)</li>
                                    <li><strong>দ্বিতীয় প্রজন্ম (1956-1963):</strong> ট্রানজিস্টর ব্যবহৃত হতো, আকারে ছোট ও গতিতে দ্রুত (যেমন, IBM 1401)</li>
                                    <li><strong>তৃতীয় প্রজন্ম (1964-1971):</strong> ইন্টিগ্রেটেড সার্কিট (IC) ব্যবহৃত হতো, আরও নির্ভরযোগ্য</li>
                                    <li><strong>চতুর্থ প্রজন্ম (1971-বর্তমান):</strong> মাইক্রোপ্রসেসর, ব্যক্তিগত কম্পিউটার</li>
                                    <li><strong>পঞ্চম প্রজন্ম (বর্তমান ও ভবিষ্যৎ):</strong> কৃত্রিম বুদ্ধিমত্তা, রোবোটিক্স</li>
                                </ul>` },
  { id: 'OEHKMdmt_hEG', text: 'কম্পিউটারের বিবর্তনকে বিভিন্ন প্রজন্মে ভাগ করা হয়েছে:', type: 'heading', level: 4, anchor: 'computer-evolution-is-categorized-into-generations' },
  { id: 'c40iTycm8cLr', text: 'প্রথম প্রজন্ম (1940-1956)', type: 'heading', level: 5, anchor: 'first-generation-1940-1956' },
  { id: '1q9Kxms9bEy7', text: 'মূল বৈশিষ্ট্য:', type: 'heading', level: 6, anchor: 'key-characteristics-2' },
  { id: 'MnFLDOxQ9WXk', type: 'richtext', html: `<ul>
                                    <li>ভ্যাকুয়াম টিউব ব্যবহার করা হতো</li>
                                    <li>আকারে অনেক বড় ছিল</li>
                                    <li>প্রচুর বিদ্যুৎ খরচ হতো</li>
                                    <li>প্রচুর তাপ উৎপন্ন হতো</li>
                                    <li>মেশিন ভাষায় প্রোগ্রামিং করা হতো</li>
                                </ul>` },
  { id: 'q2LdJ-QObo39', text: 'উদাহরণ:', type: 'heading', level: 6, anchor: 'examples' },
  { id: 'BxNAM2hFr3-Z', type: 'richtext', html: `<p><strong>ENIAC:</strong> Electronic Numerical Integrator and Computer, প্রথম দিকের সাধারণ-উদ্দেশ্যের ইলেকট্রনিক কম্পিউটারগুলির একটি, এতে 18,000 ভ্যাকুয়াম টিউব ব্যবহার করা হয়েছিল।</p>
<p><strong>EDVAC:</strong> Electronic Discrete Variable Automatic Computer একটি স্টোরড-প্রোগ্রাম কম্পিউটার ছিল, যা ডিজাইন করেছিলেন জন ভন নিউম্যান।</p>
<p><strong>UNIVAC:</strong> Universal Automatic Computer ছিল বাণিজ্যিকভাবে ব্যাপক হারে উৎপাদিত প্রথম দিকের কম্পিউটারগুলোর একটি।</p>
<p><strong>IBM-701:</strong> IBM-এর প্রথম বাণিজ্যিকভাবে পাওয়া যায় এমন কম্পিউটার, যা বৈজ্ঞানিক ও সামরিক কাজে ব্যবহৃত হতো।</p>
<p><strong>IBM-650:</strong> ব্যাপক হারে উৎপাদিত প্রথম দিকের কম্পিউটারগুলোর একটি, যা বৈজ্ঞানিক ও ব্যবসায়িক হিসাব-নিকাশে ব্যবহৃত হতো।</p>` },
  { id: 'AVmFWoJp82BC', text: 'দ্বিতীয় প্রজন্ম (1956-1963)', type: 'heading', level: 5, anchor: 'second-generation-1956-1963' },
  { id: 'X5cWG4JDMQie', text: 'মূল বৈশিষ্ট্য:', type: 'heading', level: 6, anchor: 'key-characteristics-3' },
  { id: 'wyKjXu_kfli9', type: 'richtext', html: `<ul>
                                    <li>ভ্যাকুয়াম টিউবের বদলে ট্রানজিস্টর ব্যবহার করা হতো</li>
                                    <li>আকারে ছোট, দ্রুতগতির এবং আরও নির্ভরযোগ্য</li>
                                    <li>কম তাপ উৎপন্ন হতো</li>
                                    <li>অ্যাসেম্বলি ভাষায় প্রোগ্রামিং করা হতো</li>
                                </ul>` },
  { id: 'ZaLbRD83zYY0', text: 'উদাহরণ:', type: 'heading', level: 6, anchor: 'examples-2' },
  { id: '0FB4jRk1Q1CF', type: 'richtext', html: '<p>IBM 1401</p>\n<p>CDC 1604</p>' },
  { id: 'vDWzxpF75E07', text: 'তৃতীয় প্রজন্ম (1964-1971)', type: 'heading', level: 5, anchor: 'third-generation-1964-1971' },
  { id: 'ghicUHkXdzhh', text: 'মূল বৈশিষ্ট্য:', type: 'heading', level: 6, anchor: 'key-characteristics-4' },
  { id: 'Syoxo_RI4FLb', type: 'richtext', html: `<ul>
                                    <li>ইন্টিগ্রেটেড সার্কিট (IC) ব্যবহার করা হতো</li>
                                    <li>আকারে ছোট এবং আরও কার্যকর</li>
                                    <li>খরচ কম ছিল</li>
                                    <li>উচ্চ-স্তরের প্রোগ্রামিং ভাষা ব্যবহার করা হতো</li>
                                </ul>` },
  { id: 'LnKl8Kvp5Zq3', text: 'উদাহরণ:', type: 'heading', level: 6, anchor: 'examples-3' },
  { id: '9itz5jYnylNe', type: 'richtext', html: '<p>IBM System/360</p>\n<p>PDP-8</p>' },
  { id: 'UUrI9WCdjbyq', text: 'চতুর্থ প্রজন্ম (1971-বর্তমান)', type: 'heading', level: 5, anchor: 'fourth-generation-1971-present' },
  { id: 'BFHuoNWUfuej', text: 'মূল বৈশিষ্ট্য:', type: 'heading', level: 6, anchor: 'key-characteristics-5' },
  { id: 'vtwpXkmtUgqL', type: 'richtext', html: `<ul>
                                    <li>মাইক্রোপ্রসেসর ব্যবহার করা হতো</li>
                                    <li>ব্যক্তিগত কম্পিউটারের (PC) প্রচলন শুরু হয়</li>
                                    <li>খুবই কমপ্যাক্ট এবং দ্রুতগতির</li>
                                    <li>GUI-ভিত্তিক অপারেটিং সিস্টেম ব্যবহার করা হতো</li>
                                </ul>` },
  { id: 'VyS7x7-V6NCv', text: 'উদাহরণ:', type: 'heading', level: 6, anchor: 'examples-4' },
  { id: 'J0-XUmf5te9Y', type: 'richtext', html: '<p>IBM PC</p>\n<p>Apple Macintosh</p>' },
  { id: 'YnEWUo0Lj51U', text: 'পঞ্চম প্রজন্ম (বর্তমান ও ভবিষ্যৎ)', type: 'heading', level: 5, anchor: 'fifth-generation-present-beyond' },
  { id: 'pvW6cC_us07s', text: 'মূল বৈশিষ্ট্য:', type: 'heading', level: 6, anchor: 'key-characteristics-6' },
  { id: 'tASlSjJB7fp4', type: 'richtext', html: `<ul>
                                    <li>কৃত্রিম বুদ্ধিমত্তার (AI) উপর ভিত্তি করে তৈরি</li>
                                    <li>ভয়েস রিকগনিশন এবং ন্যাচারাল ল্যাঙ্গুয়েজ প্রসেসিং</li>
                                    <li>এক্সপার্ট সিস্টেম এবং রোবোটিক্স</li>
                                    <li>প্যারালাল প্রসেসিংয়ের উপর গুরুত্ব</li>
                                </ul>` },
  { id: 't0mMbZrEaEN6', text: 'উদাহরণ:', type: 'heading', level: 6, anchor: 'examples-5' },
  { id: 'uNOW92cbrZ6O', type: 'richtext', html: '<p>IBM Watson-এর মতো AI-ভিত্তিক সিস্টেম</p>\n<p>রোবট, স্মার্ট অ্যাসিস্ট্যান্ট (Alexa, Siri)</p>\n<hr>' },

  { id: 'mv1TU1DgeK1B', text: '4. কম্পিউটার মেমরি', type: 'heading', level: 2, anchor: 'chp4' },
  { id: 'tgC2Il0qhBus', type: 'richtext', html: '<p>মেমরি অস্থায়ী বা স্থায়ীভাবে ডেটা সংরক্ষণ করে।</p>' },
  { id: '4gP4MueGbULK', text: 'প্রাইমারি মেমরি:', type: 'heading', level: 4, anchor: 'primary-memory' },
  { id: 'iGZ8XNDoQmWm', type: 'richtext', html: `<ul>
                                    <li><strong>RAM (Random Access Memory):</strong> অস্থায়ী, ভোলাটাইল স্টোরেজ</li>
                                    <li><strong>ROM (Read Only Memory):</strong> স্থায়ী, নন-ভোলাটাইল নির্দেশাবলী</li>
                                </ul>` },
  { id: 'ICKwc32LZTLY', text: 'সেকেন্ডারি স্টোরেজ:', type: 'heading', level: 4, anchor: 'secondary-storage' },
  { id: 'oi_JREWA46sH', type: 'richtext', html: `<ul>
                                    <li>হার্ড ডিস্ক, SSD, USB ড্রাইভ, অপটিক্যাল ডিস্ক</li>
                                </ul>
<ul>
                                    <li><strong>ক্যাশ মেমরি:</strong> CPU ও RAM-এর মধ্যে থাকা দ্রুতগতির মেমরি</li>
                                </ul>
<ul>
                                    <li><strong>রেজিস্টার:</strong> প্রসেসিংয়ের সময় ব্যবহৃত CPU-এর সবচেয়ে ছোট মেমরি</li>
                                </ul>
<hr>` },

  { id: '3WbPPyAemXQ-', text: '5. সংখ্যা পদ্ধতি', type: 'heading', level: 2, anchor: 'chp5' },
  { id: 'NGh4zJ5vCsxe', type: 'richtext', html: `<p>ডেটা প্রকাশের জন্য কম্পিউটার বিভিন্ন সংখ্যা পদ্ধতি ব্যবহার করে।</p>
<ul>
                                    <li><strong>দশমিক (বেস 10):</strong> 0-9</li>
                                    <li><strong>বাইনারি (বেস 2):</strong> 0 এবং 1</li>
                                    <li><strong>অক্টাল (বেস 8):</strong> 0-7</li>
                                    <li><strong>হেক্সাডেসিমাল (বেস 16):</strong> 0-9 এবং A-F</li>
                                </ul>
<p><strong>রূপান্তর:</strong> বাইনারি থেকে দশমিক, দশমিক থেকে বাইনারি ইত্যাদি।</p>
<hr>` },

  { id: 'WZDuw4MxRnq8', text: '6. কম্পিউটার হার্ডওয়্যার', type: 'heading', level: 2, anchor: 'chp6' },
  { id: 'DIojFupzs-Kp', type: 'richtext', html: `<p>হার্ডওয়্যারের মধ্যে সমস্ত ভৌত উপাদান অন্তর্ভুক্ত থাকে:</p>
<ul>
                                    <li><strong>ইনপুট ডিভাইস:</strong> কীবোর্ড, মাউস, স্ক্যানার</li>
                                    <li><strong>আউটপুট ডিভাইস:</strong> মনিটর, প্রিন্টার</li>
                                    <li><strong>CPU (Central Processing Unit):</strong> ALU + CU + রেজিস্টার</li>
                                    <li><strong>মাদারবোর্ড:</strong> সমস্ত উপাদানকে সংযুক্ত করে</li>
                                    <li><strong>মেমরি ইউনিট:</strong> RAM, ROM</li>
                                </ul>
<hr>` },

  { id: '1dvwGcPgZJNj', text: '7. কম্পিউটার সফটওয়্যার', type: 'heading', level: 2, anchor: 'chp7' },
  { id: '9MSkfvhO_vaz', type: 'richtext', html: '<p>সফটওয়্যার হলো নির্দেশাবলীর একটি সেট।</p>' },
  { id: '1_22JDha663C', text: 'প্রকারভেদ:', type: 'heading', level: 4, anchor: 'types' },
  { id: 'bXgpFf_1niDO', type: 'richtext', html: `<ul>
                                    <li><strong>সিস্টেম সফটওয়্যার:</strong> অপারেটিং সিস্টেম, ডিভাইস ড্রাইভার</li>
                                    <li><strong>অ্যাপ্লিকেশন সফটওয়্যার:</strong> MS Office, ব্রাউজার</li>
                                    <li><strong>প্রোগ্রামিং সফটওয়্যার:</strong> IDE, কম্পাইলার</li>
                                </ul>
<hr>` },

  { id: 'iH28KQJ58-Xg', text: '8. ইনপুট ও আউটপুট ডিভাইস', type: 'heading', level: 2, anchor: 'chp8' },
  { id: 'Z_LHozTVQMA4', type: 'richtext', html: `<p><strong>ইনপুট ডিভাইস:</strong> কম্পিউটারে ডেটা দেওয়ার জন্য ব্যবহৃত হয়</p>
<ul>
                                    <li>কীবোর্ড, মাউস, জয়স্টিক, স্ক্যানার, ওয়েবক্যাম</li>
                                </ul>
<p><strong>আউটপুট ডিভাইস:</strong> কম্পিউটার থেকে ফলাফল পাওয়ার জন্য ব্যবহৃত হয়</p>
<ul>
                                    <li>মনিটর, প্রিন্টার, স্পিকার, প্রজেক্টর</li>
                                </ul>` },
  { id: 'ZjMECkyzEixT', type: 'image', alt: '', width: 638, height: 479, publicId: 'img/block-diagram-of-computer' },
  { id: 'zHJtMBeeNZxQ', type: 'richtext', html: '<hr>' },

  { id: 'aUWBSfwh_mzX', text: '9. স্টোরেজ ডিভাইস', type: 'heading', level: 2, anchor: 'chp9' },
  { id: 'oyYOG2APyCls', type: 'richtext', html: `<p>স্টোরেজ ডিভাইস ডেটা সংরক্ষণ করে রাখে।</p>
<ul>
                                    <li><strong>ম্যাগনেটিক স্টোরেজ:</strong> হার্ড ডিস্ক, ফ্লপি</li>
                                    <li><strong>অপটিক্যাল স্টোরেজ:</strong> CD, DVD</li>
                                    <li><strong>সলিড স্টেট স্টোরেজ:</strong> SSD, USB ড্রাইভ</li>
                                    <li><strong>ক্লাউড স্টোরেজ:</strong> Google Drive, Dropbox</li>
                                </ul>
<hr>` },

  { id: '6xksl97MCpzj', text: '10. অপারেটিং সিস্টেমের প্রাথমিক ধারণা', type: 'heading', level: 2, anchor: 'chp10' },
  { id: 'tK3EFCi0pulQ', type: 'richtext', html: '<p>অপারেটিং সিস্টেম (OS) হলো একটি সিস্টেম সফটওয়্যার, যা কম্পিউটারের হার্ডওয়্যার, সফটওয়্যার এবং রিসোর্স পরিচালনা করে।</p>' },
  { id: 'HJZcFPjVTn1N', text: 'কাজ:', type: 'heading', level: 4, anchor: 'functions' },
  { id: 'nv3VxQOhSUWr', type: 'richtext', html: `<ul>
                                    <li>ফাইল ব্যবস্থাপনা</li>
                                    <li>প্রসেস ব্যবস্থাপনা</li>
                                    <li>মেমরি ব্যবস্থাপনা</li>
                                    <li>ডিভাইস নিয়ন্ত্রণ</li>
                                </ul>` },
  { id: 'Xc1_E-Y8006E', text: 'প্রকারভেদ:', type: 'heading', level: 4, anchor: 'types-2' },
  { id: 'zerWL6aD3dGR', type: 'richtext', html: `<ul>
                                    <li>সিঙ্গেল-ইউজার, মাল্টি-ইউজার</li>
                                    <li>GUI (গ্রাফিক্যাল), CLI (কমান্ড লাইন)</li>
                                    <li>উদাহরণ: Windows, Linux, macOS, Android</li>
                                </ul>
<hr>` },

  { id: 'tgCqC0FtRuCr', text: '11. কম্পিউটার নেটওয়ার্কিং', type: 'heading', level: 2, anchor: 'chp11' },
  { id: 'HpLvp-278yxQ', type: 'richtext', html: '<p>নেটওয়ার্কিং কম্পিউটারগুলোকে যুক্ত করে যাতে ডেটা আদান-প্রদান করা যায়।</p>' },
  { id: 'ecN3d2xyGFFx', text: 'প্রকারভেদ:', type: 'heading', level: 4, anchor: 'types-3' },
  { id: 'AOsUdDoTjLa1', type: 'richtext', html: `<ul>
                                    <li><strong>LAN (Local Area Network):</strong> অফিসের মতো ছোট এলাকায় ব্যবহৃত</li>
                                    <li><strong>MAN (Metropolitan Area Network):</strong> একটি শহর জুড়ে বিস্তৃত</li>
                                    <li><strong>WAN (Wide Area Network):</strong> ইন্টারনেটের মতো বৃহৎ পরিসরে বিস্তৃত</li>
                                </ul>
<p><strong>ডিভাইস:</strong> রাউটার, সুইচ, হাব, মোডেম</p>
<hr>` },

  { id: 'XvZ5EGt2Jz-y', text: '12. ইন্টারনেটের প্রাথমিক ধারণা', type: 'heading', level: 2, anchor: 'chp12' },
  { id: 'T6PmZxrvRW6F', type: 'richtext', html: '<p>ইন্টারনেট হলো কম্পিউটারের একটি বিশ্বব্যাপী নেটওয়ার্ক।</p>' },
  { id: 'TvL68mp2VFgq', text: 'পরিভাষা:', type: 'heading', level: 4, anchor: 'terms' },
  { id: 'q7BniOrO4o1B', type: 'richtext', html: `<ul>
                                    <li><strong>WWW (World Wide Web):</strong> ওয়েব পেজের সমষ্টি</li>
                                    <li><strong>ব্রাউজার:</strong> ওয়েব ব্যবহারের সফটওয়্যার (Chrome, Firefox)</li>
                                    <li><strong>URL:</strong> একটি ওয়েবসাইটের ঠিকানা</li>
                                    <li><strong>ইমেইল:</strong> ইলেকট্রনিক বার্তা আদান-প্রদান</li>
                                    <li><strong>ক্লাউড কম্পিউটিং:</strong> সংরক্ষণ ও সফটওয়্যারের জন্য দূরবর্তী সার্ভার ব্যবহার</li>
                                </ul>
<hr>` },

  { id: 'KYT_YXD0yu3N', text: '13. সাইবার নিরাপত্তা ও ভালো অভ্যাস', type: 'heading', level: 2, anchor: 'chp13' },
  { id: '3DQwtRcASdIw', type: 'richtext', html: '<p>সাইবার নিরাপত্তা মানে অনলাইনে নিজেকে সুরক্ষিত রাখা।</p>' },
  { id: 'tfujRyW9BPeY', text: 'পরামর্শ:', type: 'heading', level: 4, anchor: 'tips' },
  { id: 'kgyp36dJsCPY', type: 'richtext', html: `<ul>
                                    <li>শক্তিশালী পাসওয়ার্ড ব্যবহার করুন</li>
                                    <li>অচেনা লিঙ্কে ক্লিক করা এড়িয়ে চলুন</li>
                                    <li>অ্যান্টিভাইরাস সফটওয়্যার ইনস্টল করুন</li>
                                    <li>নিরাপদ ওয়েবসাইট (HTTPS) ব্যবহার করুন</li>
                                    <li>ফিশিং ও প্রতারণা সম্পর্কে সতর্ক থাকুন</li>
                                </ul>
<hr>` },

  { id: 'iqF7orihfr-r', text: '14. ব্যবহারিক কম্পিউটার অ্যাপ্লিকেশন', type: 'heading', level: 2, anchor: 'chp14' },
  { id: 'vthvDcbaGhZC', type: 'richtext', html: `<p>হাতে-কলমে অনুশীলন করা অত্যন্ত জরুরি:</p>
<ul>
                                    <li>Windows OS-এ কাজ করা শেখা</li>
                                    <li>MS Word: টাইপিং, ফরম্যাটিং</li>
                                    <li>MS Excel: টেবিল, চার্ট, সূত্র</li>
                                    <li>MS PowerPoint: স্লাইড, ট্রানজিশন</li>
                                    <li>Paint ও Notepad</li>
                                    <li>ইন্টারনেট ব্রাউজিং ও ইমেইল সেটআপ</li>
                                </ul>
<hr>` },

  { id: 'TcRlI6uMEeqK', text: '15. কোয়ান্টাম কম্পিউটার', type: 'heading', level: 2, anchor: 'chp15' },
  { id: 'kX9DrPdzbv_i', type: 'richtext', html: '<p>কোয়ান্টাম কম্পিউটার ডেটা প্রসেসিংয়ের জন্য কোয়ান্টাম মেকানিক্সের নীতি ব্যবহার করে।</p>' },
  { id: 'XrEdOwMDavYF', text: 'মূল ধারণা:', type: 'heading', level: 4, anchor: 'key-concepts' },
  { id: 'VHxg_QSkh--A', type: 'richtext', html: `<ul>
                                    <li><strong>কিউবিট:</strong> কোয়ান্টাম তথ্যের মৌলিক একক; এটি একই সাথে 0, 1, বা উভয়ই হতে পারে</li>
                                    <li><strong>সুপারপজিশন:</strong> একটি কিউবিট একসাথে একাধিক অবস্থা প্রকাশ করতে পারে</li>
                                    <li><strong>এনট্যাঙ্গলমেন্ট:</strong> কিউবিটগুলো এমনভাবে যুক্ত থাকতে পারে যে একটির অবস্থা অন্যটিকে প্রভাবিত করে</li>
                                    <li><strong>কোয়ান্টাম স্পিড-আপ:</strong> চিরাচরিত কম্পিউটারের চেয়ে জটিল সমস্যা দ্রুত সমাধান করতে সক্ষম</li>
                                </ul>` },
  { id: 'NiudD9BvhAEr', text: 'ব্যবহারক্ষেত্র:', type: 'heading', level: 4, anchor: 'applications-2' },
  { id: 'Xa9hAwLZ2dxr', type: 'richtext', html: `<ul>
                                    <li>ওষুধ আবিষ্কার</li>
                                    <li>ক্রিপ্টোগ্রাফি</li>
                                    <li>আবহাওয়ার পূর্বাভাস</li>
                                    <li>আর্থিক মডেলিং</li>
                                </ul>` },
  { id: 'RabRk1q2RiJy', text: 'কোয়ান্টাম সিস্টেমের উদাহরণ:', type: 'heading', level: 4, anchor: 'example-quantum-systems' },
  { id: 'MwU_7B-bZid6', type: 'richtext', html: `<ul>
                                    <li>IBM Quantum</li>
                                    <li>Google Sycamore</li>
                                    <li>D-Wave Systems</li>
                                </ul>` },
  { id: 'VE0UYFMnAB7h', text: 'বর্তমান সীমাবদ্ধতা:', type: 'heading', level: 4, anchor: 'limitations-current' },
  { id: 'twqBTaGAwmD2', type: 'richtext', html: `<ul>
                                    <li>খরচ অনেক বেশি</li>
                                    <li>নয়েজের প্রতি সংবেদনশীল</li>
                                    <li>অতি নিম্ন তাপমাত্রার প্রয়োজন হয়</li>
                                </ul>
<p>কোয়ান্টাম কম্পিউটিং এখনও প্রাথমিক পর্যায়ে রয়েছে, তবে প্রযুক্তি ও কম্পিউটেশনে বৈপ্লবিক পরিবর্তন আনার সম্ভাবনা রয়েছে এর মধ্যে।</p>
<hr>` },

  { id: 'XnJQXqs8N9Gw', text: '16. কৃত্রিম বুদ্ধিমত্তা: ব্যবহারের ক্ষেত্র ও গুরুত্ব', type: 'heading', level: 2, anchor: 'chp16' },
  { id: 'mwOEVhNjoShJ', type: 'richtext', html: '<p>কৃত্রিম বুদ্ধিমত্তা (AI) যন্ত্রকে মানুষের বুদ্ধিমত্তা অনুকরণ করে কাজ সম্পাদনে সক্ষম করে তোলে।</p>' },
  { id: 'gZDLXFRd1SMA', text: 'AI-এর গুরুত্ব:', type: 'heading', level: 4, anchor: 'importance-of-ai' },
  { id: 'vJe3D9lY7T3k', type: 'richtext', html: `<ul>
                                    <li>স্বয়ংক্রিয়করণের মাধ্যমে উৎপাদনশীলতা বৃদ্ধি করে</li>
                                    <li>ডেটা বিশ্লেষণের মাধ্যমে সিদ্ধান্ত গ্রহণের প্রক্রিয়া উন্নত করে</li>
                                    <li>স্মার্ট এবং ইন্টারঅ্যাক্টিভ ব্যবহারকারী অভিজ্ঞতা তৈরি করে</li>
                                </ul>` },
  { id: 'YGsVWRuHW7jF', text: 'প্রধান ব্যবহারক্ষেত্র:', type: 'heading', level: 4, anchor: 'key-use-cases' },
  { id: 'KTMrE6P6D1u3', type: 'richtext', html: `<ul>
                                    <li><strong>ন্যাচারাল ল্যাঙ্গুয়েজ প্রসেসিং (NLP):</strong> চ্যাটবট, ভয়েস অ্যাসিস্ট্যান্ট</li>
                                    <li><strong>ইমেজ রিকগনিশন:</strong> চিকিৎসা-সংক্রান্ত ইমেজিং, নিরাপত্তা</li>
                                    <li><strong>রিকমেন্ডেশন সিস্টেম:</strong> শপিং, স্ট্রিমিং প্ল্যাটফর্ম</li>
                                    <li><strong>স্বচালিত গাড়ি:</strong> সেলফ-ড্রাইভিং প্রযুক্তি</li>
                                    <li><strong>প্রেডিক্টিভ অ্যানালিটিক্স:</strong> ব্যবসায়িক পূর্বাভাস, স্টক বিশ্লেষণ</li>
                                </ul>` },
  { id: 'qCJi4N_oa97N', text: 'জনপ্রিয় AI টুল/প্ল্যাটফর্ম:', type: 'heading', level: 4, anchor: 'popular-ai-toolsplatforms' },
  { id: 'cDS33EuSx5bq', type: 'richtext', html: `<ul>
                                    <li><strong><a href="https://chatgpt.com/" target="_blank">ChatGPT (OpenAI-এর তৈরি):</a></strong> কথোপকথনভিত্তিক AI, শিক্ষা, কনটেন্ট লেখা, কোডিংয়ে সহায়তা</li>
                                    <li><strong><a href="https://grok.com/?referrer=website" target="_blank">Grok (xAI-এর তৈরি):</a></strong> X (Twitter)-এর সাথে যুক্ত AI চ্যাটবট, ব্যক্তিগতকৃত উত্তর</li>
                                    <li><strong><a href="https://gemini.google.com/app?hl=en-IN" target="_blank">Gemini (Google-এর তৈরি):</a></strong> উৎপাদনশীলতা ও কনটেন্ট তৈরির জন্য মাল্টিমোডাল AI</li>
                                    <li><strong><a href="https://chat.deepseek.com/" target="_blank">DeepSeek:</a></strong> সার্চ-সমৃদ্ধ AI, যাতে রয়েছে প্রোগ্রামিং ও যুক্তিবিশ্লেষণের ক্ষমতা</li>
                                </ul>` },
  { id: 'siNZlgxIdOgl', text: 'নৈতিক বিবেচনা:', type: 'heading', level: 4, anchor: 'ethical-considerations' },
  { id: 'hRPQyzeKobar', type: 'richtext', html: `<ul>
                                    <li>ডেটা প্রাইভেসি</li>
                                    <li>কর্মসংস্থান হারানোর ঝুঁকি</li>
                                    <li>AI অ্যালগরিদমে পক্ষপাত</li>
                                </ul>
<p>শিক্ষা ও স্বাস্থ্যসেবা থেকে শুরু করে ব্যবসা ও বিনোদন — AI প্রতিটি ক্ষেত্রে পরিবর্তন আনছে, তাই ভবিষ্যতের জন্য প্রস্তুত থাকতে এই বিষয়ে জ্ঞান থাকা অত্যন্ত জরুরি।</p>` },
]

const toc = [
  { id: 'contents', text: '📘 বিষয়সূচি', level: 4 },
  { id: 'chp1', text: '1. কম্পিউটার পরিচিতি', level: 2 },
  { id: 'key-characteristics', text: 'মূল বৈশিষ্ট্য:', level: 4 },
  { id: 'applications', text: 'ব্যবহারক্ষেত্র:', level: 4 },
  { id: 'chp2', text: '2. কম্পিউটারের শ্রেণীবিভাগ', level: 2 },
  { id: 'by-size', text: 'আকার অনুযায়ী:', level: 4 },
  { id: 'by-purpose', text: 'উদ্দেশ্য অনুযায়ী:', level: 4 },
  { id: 'by-type', text: 'ধরন অনুযায়ী:', level: 4 },
  { id: 'chp3', text: '3. কম্পিউটারের প্রজন্ম', level: 2 },
  { id: 'computer-evolution-is-categorized-into-generations', text: 'কম্পিউটারের বিবর্তনকে বিভিন্ন প্রজন্মে ভাগ করা হয়েছে:', level: 4 },
  { id: 'first-generation-1940-1956', text: 'প্রথম প্রজন্ম (1940-1956)', level: 5 },
  { id: 'key-characteristics-2', text: 'মূল বৈশিষ্ট্য:', level: 6 },
  { id: 'examples', text: 'উদাহরণ:', level: 6 },
  { id: 'second-generation-1956-1963', text: 'দ্বিতীয় প্রজন্ম (1956-1963)', level: 5 },
  { id: 'key-characteristics-3', text: 'মূল বৈশিষ্ট্য:', level: 6 },
  { id: 'examples-2', text: 'উদাহরণ:', level: 6 },
  { id: 'third-generation-1964-1971', text: 'তৃতীয় প্রজন্ম (1964-1971)', level: 5 },
  { id: 'key-characteristics-4', text: 'মূল বৈশিষ্ট্য:', level: 6 },
  { id: 'examples-3', text: 'উদাহরণ:', level: 6 },
  { id: 'fourth-generation-1971-present', text: 'চতুর্থ প্রজন্ম (1971-বর্তমান)', level: 5 },
  { id: 'key-characteristics-5', text: 'মূল বৈশিষ্ট্য:', level: 6 },
  { id: 'examples-4', text: 'উদাহরণ:', level: 6 },
  { id: 'fifth-generation-present-beyond', text: 'পঞ্চম প্রজন্ম (বর্তমান ও ভবিষ্যৎ)', level: 5 },
  { id: 'key-characteristics-6', text: 'মূল বৈশিষ্ট্য:', level: 6 },
  { id: 'examples-5', text: 'উদাহরণ:', level: 6 },
  { id: 'chp4', text: '4. কম্পিউটার মেমরি', level: 2 },
  { id: 'primary-memory', text: 'প্রাইমারি মেমরি:', level: 4 },
  { id: 'secondary-storage', text: 'সেকেন্ডারি স্টোরেজ:', level: 4 },
  { id: 'chp5', text: '5. সংখ্যা পদ্ধতি', level: 2 },
  { id: 'chp6', text: '6. কম্পিউটার হার্ডওয়্যার', level: 2 },
  { id: 'chp7', text: '7. কম্পিউটার সফটওয়্যার', level: 2 },
  { id: 'types', text: 'প্রকারভেদ:', level: 4 },
  { id: 'chp8', text: '8. ইনপুট ও আউটপুট ডিভাইস', level: 2 },
  { id: 'chp9', text: '9. স্টোরেজ ডিভাইস', level: 2 },
  { id: 'chp10', text: '10. অপারেটিং সিস্টেমের প্রাথমিক ধারণা', level: 2 },
  { id: 'functions', text: 'কাজ:', level: 4 },
  { id: 'types-2', text: 'প্রকারভেদ:', level: 4 },
  { id: 'chp11', text: '11. কম্পিউটার নেটওয়ার্কিং', level: 2 },
  { id: 'types-3', text: 'প্রকারভেদ:', level: 4 },
  { id: 'chp12', text: '12. ইন্টারনেটের প্রাথমিক ধারণা', level: 2 },
  { id: 'terms', text: 'পরিভাষা:', level: 4 },
  { id: 'chp13', text: '13. সাইবার নিরাপত্তা ও ভালো অভ্যাস', level: 2 },
  { id: 'tips', text: 'পরামর্শ:', level: 4 },
  { id: 'chp14', text: '14. ব্যবহারিক কম্পিউটার অ্যাপ্লিকেশন', level: 2 },
  { id: 'chp15', text: '15. কোয়ান্টাম কম্পিউটার', level: 2 },
  { id: 'key-concepts', text: 'মূল ধারণা:', level: 4 },
  { id: 'applications-2', text: 'ব্যবহারক্ষেত্র:', level: 4 },
  { id: 'example-quantum-systems', text: 'কোয়ান্টাম সিস্টেমের উদাহরণ:', level: 4 },
  { id: 'limitations-current', text: 'বর্তমান সীমাবদ্ধতা:', level: 4 },
  { id: 'chp16', text: '16. কৃত্রিম বুদ্ধিমত্তা: ব্যবহারের ক্ষেত্র ও গুরুত্ব', level: 2 },
  { id: 'importance-of-ai', text: 'AI-এর গুরুত্ব:', level: 4 },
  { id: 'key-use-cases', text: 'প্রধান ব্যবহারক্ষেত্র:', level: 4 },
  { id: 'popular-ai-toolsplatforms', text: 'জনপ্রিয় AI টুল/প্ল্যাটফর্ম:', level: 4 },
  { id: 'ethical-considerations', text: 'নৈতিক বিবেচনা:', level: 4 },
]

const DOC_ID = 'a1367ca7-d7a7-40fb-8f2e-5dbcf67f07c9'

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('basics: 1/1 written')
