import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '309f2672-4ed6-4eab-9c1f-11418fb64b66' // react/syllabus
const title = 'React সিলেবাস'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'ভ্যানিলা জাভাস্ক্রিপ্টের সাথে তুলনাসহ React শেখার সম্পূর্ণ অধ্যায়ভিত্তিক সিলেবাস।'

const blocks = [
  { id: 'R5JVm6eJhxii', text: 'ভ্যানিলা JS তুলনাসহ React JS ডকুমেন্টেশন', type: 'heading', level: 2, anchor: 'react-js-documentation-with-vanilla-js-comparison' },
  { id: 'f00tuHOnggPu', type: 'richtext', html: `<div class="note">
                                    <p>React হলো ইউজার ইন্টারফেস তৈরির জন্য একটি জাভাস্ক্রিপ্ট লাইব্রেরি।</p>
                                    <p>সিঙ্গেল-পেজ অ্যাপ্লিকেশন তৈরি করতে React ব্যবহার করা হয়।</p>
                                    <p>React আমাদের পুনঃব্যবহারযোগ্য UI কম্পোনেন্ট তৈরি করতে দেয়।</p>
                                </div>
<hr>` },
  { id: 'R9VqvlGFg1BO', text: 'অধ্যায় ১: React বনাম ভ্যানিলা JS পরিচিতি', type: 'heading', level: 2, anchor: 'chapter-1-introduction-to-react-vs-vanilla-js' },
  { id: '3rG5mq_ynAde', type: 'richtext', html: `<ul>
                                    <li><a href="/react/react-introduction">React</a> কী?</li>
                                    <li><a href="/javascript/javascript-intro">ভ্যানিলা JS</a>-এর বদলে কেন React ব্যবহার করবেন?</li>
                                    <li>বাস্তব-জগতের উদাহরণ: টুলকিট দিয়ে বনাম ছাড়া UI তৈরি</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>ভ্যানিলা JS: একটি ডাইনামিক বাটন তৈরি করে DOM-এ যোগ করা</li>
                                            <li>React: একই বাটন রেন্ডার করে এমন JSX-ভিত্তিক কম্পোনেন্ট</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'OWrRihwT47V-', text: 'অধ্যায় ২: শুরু করা', type: 'heading', level: 2, anchor: 'chapter-2-getting-started' },
  { id: 'KU0Z8ye07Cld', type: 'richtext', html: `<ul>
                                    <li>একটি সাধারণ HTML/JS প্রজেক্ট সেট আপ করা</li>
                                    <li>React সেট আপ করা (CDN বা Create React App দিয়ে)</li>
                                    <li>টুলিং ও ফোল্ডার স্ট্রাকচারের তুলনা টেবিল</li>
                                </ul>` },
  { id: 'wUXsFt6ATV4f', text: 'অধ্যায় ৩: আপনার প্রথম কম্পোনেন্ট তৈরি করা', type: 'heading', level: 2, anchor: 'chapter-3-creating-your-first-component' },
  { id: 'MkczhZczR8cY', type: 'richtext', html: `<ul>
                                    <li>ভ্যানিলা JS: একটি DOM এলিমেন্ট তৈরি ও রিটার্ন করার ফাংশন</li>
                                    <li>React: JSX-সহ ফাংশনাল কম্পোনেন্ট</li>
                                    <li>Props বনাম ফাংশন প্যারামিটার</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>উভয় পদ্ধতিতে UserCard কম্পোনেন্ট</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'uqlttvrwtLba', text: 'অধ্যায় ৪: JSX বনাম DOM ম্যানিপুলেশন', type: 'heading', level: 2, anchor: 'chapter-4-jsx-vs-dom-manipulation' },
  { id: 'TYLyHlwhauAa', type: 'richtext', html: `<ul>
                                    <li>JSX কী?</li>
                                    <li>JSX সিনট্যাক্স বনাম document.createElement</li>
                                    <li>ইনলাইন স্টাইল ও className-এর পার্থক্য</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>ডাইনামিক টেক্সটসহ স্টাইল করা বাটন</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'zxX1m2qqEuHa', text: 'অধ্যায় ৫: স্টেট ম্যানেজমেন্ট', type: 'heading', level: 2, anchor: 'chapter-5-state-management' },
  { id: 'JvRnTc8mkwmE', type: 'richtext', html: `<ul>
                                    <li>কেন স্টেটের প্রয়োজন</li>
                                    <li>ভ্যানিলা JS: ভেরিয়েবল ও ম্যানুয়াল DOM আপডেট ব্যবহার করা</li>
                                    <li>React: useState Hook</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>কাউন্টার অ্যাপ (ভ্যানিলা বনাম React)</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: '1RkeYp74h7Gj', text: 'অধ্যায় ৬: ইভেন্ট হ্যান্ডলিং', type: 'heading', level: 2, anchor: 'chapter-6-event-handling' },
  { id: 'eF9cxMppjJxK', type: 'richtext', html: `<ul>
                                    <li>ভ্যানিলা JS-এ ইভেন্ট সংযুক্ত করা (addEventListener)</li>
                                    <li>React-এর ইভেন্ট সিস্টেম (onClick, onChange)</li>
                                    <li>সিন্থেটিক ইভেন্ট</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>পরিবর্তনের সময় মান ধারণ করা একটি ইনপুট ফিল্ড</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'YpF1FSWWuGZI', text: 'অধ্যায় ৭: কন্ডিশনাল রেন্ডারিং', type: 'heading', level: 2, anchor: 'chapter-7-conditional-rendering' },
  { id: 'RhzZpZCohWog', type: 'richtext', html: `<ul>
                                    <li>ভ্যানিলা JS-এ if ব্লক, টারনারি এবং লজিক্যাল &amp;&amp;</li>
                                    <li>JSX দিয়ে React-এর কন্ডিশনাল রেন্ডারিং</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>কনটেন্টের দৃশ্যমানতা টগল করা</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: '7UWZKTumVfrT', text: 'অধ্যায় ৮: তালিকা ও Key', type: 'heading', level: 2, anchor: 'chapter-8-lists-and-keys' },
  { id: '17nYncGHbmgq', type: 'richtext', html: `<ul>
                                    <li>JS-এ অ্যারের মধ্য দিয়ে লুপ করা (<code>forEach</code>, <code>map</code>)</li>
                                    <li>JSX-এ <code>map()</code> এবং <code>key</code>-এর গুরুত্ব</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>পণ্যের একটি তালিকা প্রদর্শন করা</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'lpVu5NISya4n', text: 'অধ্যায় ৯: ফর্ম ও ইনপুট', type: 'heading', level: 2, anchor: 'chapter-9-forms-and-inputs' },
  { id: 'lrBjG4MtqTqq', type: 'richtext', html: `<ul>
                                    <li>ভ্যানিলা JS-এ ইনপুট ও ফর্ম হ্যান্ডেল করা (ম্যানুয়াল <code>value</code> পড়া)</li>
                                    <li>React-এ কন্ট্রোলড কম্পোনেন্ট</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>ভ্যালিডেশনসহ লগইন ফর্ম</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'd2OHzzhoYrUd', text: 'অধ্যায় ১০: কম্পোনেন্ট কম্পোজিশন', type: 'heading', level: 2, anchor: 'chapter-10-component-composition' },
  { id: 'e8ESrhR60f5l', type: 'richtext', html: `<ul>
                                    <li>ভ্যানিলা JS বনাম React-এ নেস্টিং ও মডুলারাইজেশন</li>
                                    <li>কম্পোনেন্টের পুনঃব্যবহারযোগ্যতা</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>Header, Sidebar এবং Footer-সহ লেআউট</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'ruaGdbMXHKsB', text: 'অধ্যায় ১১: Lifecycle বনাম useEffect', type: 'heading', level: 2, anchor: 'chapter-11-lifecycle-vs-useeffect' },
  { id: 'X6DTMPmSZkXb', type: 'richtext', html: `<ul>
                                    <li>ভ্যানিলা JS lifecycle: DOMContentLoaded, কাস্টম watcher</li>
                                    <li>React Hooks: সাইড ইফেক্টের জন্য useEffect</li>
                                    <li>ক্লিনআপ লজিক</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>মাউন্টে API কল</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'A29jxBm357fB', text: 'অধ্যায় ১২: Props Drilling বনাম Lifting State', type: 'heading', level: 2, anchor: 'chapter-12-props-drilling-vs-lifting-state' },
  { id: 'n0WT6RTpjlhX', type: 'richtext', html: `<ul>
                                    <li>ফাংশন কলে ডেটা পাস করা (ভ্যানিলা)</li>
                                    <li>React: props পাস করা এবং state উপরে তোলা (lifting)</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>চাইল্ড থেকে প্যারেন্ট state আপডেট করা</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'SKA0I9BA84tN', text: 'অধ্যায় ১৩: কন্ডিশনাল ক্লাস ও স্টাইল', type: 'heading', level: 2, anchor: 'chapter-13-conditional-class-styles' },
  { id: '8hEJAFim4adv', type: 'richtext', html: `<ul>
                                    <li>ভ্যানিলা: <code>element.classList.add/remove</code></li>
                                    <li>React: কন্ডিশনাল <code>className</code></li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>active/inactive টগল করে এমন বাটন</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'Lm91uMl8g0DD', text: 'অধ্যায় ১৪: রাউটিং', type: 'heading', level: 2, anchor: 'chapter-14-routing' },
  { id: 'IxyY5F7cyWJs', type: 'richtext', html: `<ul>
                                    <li>ভ্যানিলা JS-এ ম্যানুয়াল রাউট হ্যান্ডলিং (hashchange)</li>
                                    <li>React Router বেসিক্স</li>
                                    <li>উদাহরণ:
                                        <ul>
                                            <li>নেভিগেশন লিংকসহ দুই-পেজের অ্যাপ</li>
                                        </ul>
                                    </li>
                                </ul>` },
  { id: 'n3wxUQJX0TQL', text: 'অধ্যায় ১৫: প্রজেক্ট: Todo অ্যাপ', type: 'heading', level: 2, anchor: 'chapter-15-project-todo-app' },
  { id: 'ZATOsxvWktv_', type: 'richtext', html: `<ul>
                                    <li>ভ্যানিলা JS বনাম React ইমপ্লিমেন্টেশনের সম্পূর্ণ তুলনা</li>
                                    <li>ফোল্ডার স্ট্রাকচার</li>
                                    <li>ফিচার: যোগ করা, মুছে ফেলা, সম্পন্ন হিসেবে চিহ্নিত করা</li>
                                </ul>` },
  { id: 'W5rMqOCEkWy1', text: 'অধ্যায় ১৬: পরবর্তী ধাপ', type: 'heading', level: 2, anchor: 'chapter-16-next-steps' },
  { id: 'ladXws5ngAP6', type: 'richtext', html: `<ul>
                                    <li>ভ্যানিলা JS-এ গ্লোবাল স্টেট বনাম React Context API</li>
                                    <li>API-এর সাথে ইন্টিগ্রেশন (Fetch, Axios)</li>
                                    <li>টেস্টিং</li>
                                    <li>অ্যাপ ডিপ্লয় করা</li>
                                </ul>` },
]

const toc = [
  { id: 'react-js-documentation-with-vanilla-js-comparison', text: 'ভ্যানিলা JS তুলনাসহ React JS ডকুমেন্টেশন', level: 2 },
  { id: 'chapter-1-introduction-to-react-vs-vanilla-js', text: 'অধ্যায় ১: React বনাম ভ্যানিলা JS পরিচিতি', level: 2 },
  { id: 'chapter-2-getting-started', text: 'অধ্যায় ২: শুরু করা', level: 2 },
  { id: 'chapter-3-creating-your-first-component', text: 'অধ্যায় ৩: আপনার প্রথম কম্পোনেন্ট তৈরি করা', level: 2 },
  { id: 'chapter-4-jsx-vs-dom-manipulation', text: 'অধ্যায় ৪: JSX বনাম DOM ম্যানিপুলেশন', level: 2 },
  { id: 'chapter-5-state-management', text: 'অধ্যায় ৫: স্টেট ম্যানেজমেন্ট', level: 2 },
  { id: 'chapter-6-event-handling', text: 'অধ্যায় ৬: ইভেন্ট হ্যান্ডলিং', level: 2 },
  { id: 'chapter-7-conditional-rendering', text: 'অধ্যায় ৭: কন্ডিশনাল রেন্ডারিং', level: 2 },
  { id: 'chapter-8-lists-and-keys', text: 'অধ্যায় ৮: তালিকা ও Key', level: 2 },
  { id: 'chapter-9-forms-and-inputs', text: 'অধ্যায় ৯: ফর্ম ও ইনপুট', level: 2 },
  { id: 'chapter-10-component-composition', text: 'অধ্যায় ১০: কম্পোনেন্ট কম্পোজিশন', level: 2 },
  { id: 'chapter-11-lifecycle-vs-useeffect', text: 'অধ্যায় ১১: Lifecycle বনাম useEffect', level: 2 },
  { id: 'chapter-12-props-drilling-vs-lifting-state', text: 'অধ্যায় ১২: Props Drilling বনাম Lifting State', level: 2 },
  { id: 'chapter-13-conditional-class-styles', text: 'অধ্যায় ১৩: কন্ডিশনাল ক্লাস ও স্টাইল', level: 2 },
  { id: 'chapter-14-routing', text: 'অধ্যায় ১৪: রাউটিং', level: 2 },
  { id: 'chapter-15-project-todo-app', text: 'অধ্যায় ১৫: প্রজেক্ট: Todo অ্যাপ', level: 2 },
  { id: 'chapter-16-next-steps', text: 'অধ্যায় ১৬: পরবর্তী ধাপ', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('react/syllabus: 1/1 written')
