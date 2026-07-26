import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = '7bfbaad4-d366-4776-bb2c-6700e05e45b4' // react/introduction
const title = 'React পরিচিতি'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'React কী, কেন এটি গুরুত্বপূর্ণ, এর ইতিহাস, এবং ভ্যানিলা জাভাস্ক্রিপ্টের সাথে তুলনা জানুন।'

const featureTableHeader = ['ফিচার', 'ভ্যানিলা JS', 'React']

const blocks = [
  { id: 'uo-p1IFryYJP', text: 'React বনাম ভ্যানিলা JS পরিচিতি', type: 'heading', level: 2, anchor: 'introduction-to-react-vs-vanilla-js' },
  { id: 'RO1aKOKeoUOS', type: 'richtext', html: `<p>React-এর জগতে স্বাগতম! আপনি যদি ওয়েব ডেভেলপমেন্টে নতুন হন বা সবেমাত্র React শুরু করছেন, আপনি সঠিক জায়গায় আছেন। এই গাইডে, আমরা দেখব React কী, কেন এটি গুরুত্বপূর্ণ, এবং এর তৈরি হওয়ার পেছনের আকর্ষণীয় গল্প। চলুন শুরু করা যাক!</p>
<p>React হলো <strong>ইউজার ইন্টারফেস</strong> তৈরির জন্য একটি <strong>জাভাস্ক্রিপ্ট লাইব্রেরি</strong>। এটি <strong>Facebook (এখন Meta)</strong> তৈরি করেছে ডেভেলপারদের দ্রুত ও ইন্টারঅ্যাক্টিভ ওয়েব অ্যাপ্লিকেশন তৈরিতে সাহায্য করার জন্য। React দিয়ে, আপনি এমন ওয়েব পেজ তৈরি করতে পারেন যা ডেটা পরিবর্তন হলে <strong>স্বয়ংক্রিয়ভাবে আপডেট</strong> হয়, ম্যানুয়ালি পেজ রিলোড করার দরকার হয় না।</p>` },
  { id: 'NtYSmBJEAzRM', text: 'কেন React গুরুত্বপূর্ণ?', type: 'heading', level: 2, anchor: 'why-is-react-important' },
  { id: 'mndYPiQ51SyF', type: 'richtext', html: `<p>React আসার আগে, একটি ওয়েবপেজের আপডেট ম্যানেজ করতে ডেভেলপারদের অনেক কোড লিখতে হতো। কিছু পরিবর্তন হলেই (যেমন একটি নতুন মেসেজ বা নতুন কমেন্ট), পুরো পেজটি রিলোড বা ম্যানুয়ালি আপডেট করতে হতো। এটি ধীর ও অদক্ষ ছিল।</p>
<p>React ওয়েব ডেভেলপমেন্টকে <strong>দ্রুততর</strong>, <strong>সহজ</strong>, এবং <strong>আরও কার্যকর</strong> করে তোলে:</p>
<ul>
                                    <li><strong>কম্পোনেন্ট পুনঃব্যবহার</strong>: আপনি পুনঃব্যবহারযোগ্য UI অংশ তৈরি করে জটিল অ্যাপ্লিকেশন তৈরি করতে সেগুলো একত্রিত করতে পারেন।</li>
                                    <li><strong>কার্যকর আপডেট</strong>: React শুধু পেজের সেই অংশগুলো আপডেট করে যেগুলো পরিবর্তন করা প্রয়োজন, পুরো পেজ রিলোড করার বদলে।</li>
                                    <li><strong>ভালো পারফরম্যান্স</strong>: React একটি "ভার্চুয়াল DOM" ব্যবহার করে, যা ব্যবহারকারীদের জন্য আপডেটকে দ্রুততর ও মসৃণ করে তোলে।</li>
                                    <li><strong>শেখা সহজ</strong>: এটি শুধু UI-এর উপর মনোনিবেশ করে বলে, আপনি দ্রুত React বুঝতে ও ব্যবহার করতে পারেন।</li>
                                </ul>` },
  { id: 'tdcidBVhcQWa', text: 'React-এর ইতিহাস: কেন এটি তৈরি হয়েছিল?', type: 'heading', level: 2, anchor: 'the-history-of-react-why-was-it-created' },
  { id: 'SqyhhzTtXb4I', type: 'richtext', html: '<p>React তৈরি হয়েছিল <strong>Facebook-এ</strong> একটি বিরক্তিকর সমস্যা সমাধান করতে, যেখানে নোটিফিকেশনে এমন অপঠিত মেসেজ দেখাত যেগুলো আসলে ছিল না। সমস্যাটি হতো কারণ মেসেজ একাধিক জায়গায় দেখানো হতো কিন্তু সেগুলো সিঙ্কে থাকত না। এই সমস্যা সমাধানের জন্য, <strong>Facebook-এর ইঞ্জিনিয়াররা</strong> React তৈরি করেন, যা <strong>ভার্চুয়াল DOM</strong> ব্যবহার করে UI কার্যকরভাবে আপডেট করে। এটি পারফরম্যান্স উন্নত করে এবং অসামঞ্জস্য দূর করে, যার ফলে ২০১৩ সালে <strong>React</strong> প্রকাশ্যে রিলিজ হয়। আজ, এটি সবচেয়ে জনপ্রিয় ওয়েব ডেভেলপমেন্ট টুলগুলোর একটি।</p>' },
  { id: 'LepbEeOrTWyl', text: 'কেন আপনার React শেখা উচিত?', type: 'heading', level: 3, anchor: 'why-should-you-learn-react' },
  { id: 'PvVr5A0e9NQt', type: 'richtext', html: `<p>আজ, <strong>Instagram, WhatsApp, Airbnb, Uber, Netflix-এর মতো বড় বড় কোম্পানি</strong> ওয়েব অ্যাপ্লিকেশন তৈরি করতে React ব্যবহার করে। React শেখা <strong>দারুণ ক্যারিয়ারের সুযোগ</strong> এনে দিতে পারে, আপনি নিজের প্রজেক্ট তৈরি করুন বা টেকে চাকরি খুঁজুন।</p>
<p>এখন আপনি বুঝেছেন React কী এবং কেন এটি তৈরি হয়েছিল, এখন সময় এতে ডুবে যাওয়ার! ধাপে ধাপে, আমরা শিখব React কীভাবে কাজ করে, পাশাপাশি কিছু আকর্ষণীয় প্রজেক্টও তৈরি করব।</p>
<hr>` },
  { id: 'eHZx0gxs7naV', text: 'আবার, React কী?', type: 'heading', level: 2, anchor: 'again-what-is-react' },
  { id: 'gwR4n72PRT5b', type: 'richtext', html: '<p>React হলো Facebook-এর তৈরি একটি <strong>জাভাস্ক্রিপ্ট লাইব্রেরি</strong>, যা <strong>ইউজার ইন্টারফেস (UI)</strong> তৈরির জন্য ব্যবহৃত হয়, বিশেষ করে সিঙ্গেল-পেজ অ্যাপ্লিকেশনের (SPA) জন্য। এটি UI-কে পুনঃব্যবহারযোগ্য কম্পোনেন্টে ভাগ করে ডাইনামিক ওয়েব অ্যাপ তৈরি সহজ করে তোলে।</p>' },
  { id: 'LGdw6eQZ3RAb', text: 'ভ্যানিলা জাভাস্ক্রিপ্ট কী?', type: 'heading', level: 2, anchor: 'what-is-vanilla-javascript' },
  { id: '8Jr4mKirZEN9', type: 'richtext', html: '<p>ভ্যানিলা জাভাস্ক্রিপ্ট বলতে বোঝায় কোনো লাইব্রেরি বা ফ্রেমওয়ার্ক ছাড়া সাধারণ, নেটিভ জাভাস্ক্রিপ্ট ব্যবহার করা। এটি শক্তিশালী, কিন্তু আপনার অ্যাপ যত জটিল হবে, ততই এটি দীর্ঘ ও পরিচালনা করা কঠিন হয়ে উঠতে পারে।</p>' },
  { id: '3tjPzmUBn0sx', text: 'কেন ভ্যানিলা JS-এর বদলে React ব্যবহার করবেন?', type: 'heading', level: 2, anchor: 'why-use-react-instead-of-vanilla-js' },
  { id: 'UssP2ORL38vw', type: 'table', header: featureTableHeader, rows: [
    ['DOM ম্যানিপুলেশন', 'ম্যানুয়াল ও দীর্ঘ', 'ভার্চুয়াল DOM-এর মাধ্যমে বিমূর্ত'],
    ['UI পুনঃব্যবহারযোগ্যতা', 'কাস্টম ফাংশন ও HTML টেমপ্লেট', 'কম্পোনেন্ট-ভিত্তিক'],
    ['স্টেট ম্যানেজমেন্ট', 'ম্যানুয়াল স্টেট ট্র্যাকিং', 'hook (<code>useState</code>)-সহ বিল্ট-ইন স্টেট'],
    ['পারফরম্যান্স অপ্টিমাইজেশন', 'ম্যানুয়াল টিউনিং', 'ভার্চুয়াল DOM ডিফিং'],
    ['লার্নিং কার্ভ', 'কম (শুরুতে)', 'কিছুটা বেশি, কিন্তু আরও ভালোভাবে স্কেল করে'],
  ] },
  { id: '_c7C1ItzpAIm', text: '💡 বাস্তব-জগতের উদাহরণ', type: 'heading', level: 2, anchor: 'real-world-analogy' },
  { id: '0e1bOE_i8Ip-', type: 'richtext', html: '<p class="note"><strong>ভ্যানিলা JS</strong> হলো ধাতু, বোল্ট এবং ইঞ্জিন দিয়ে শুরু থেকে একটি গাড়ি তৈরি করার মতো।</p>\n<p class="note"><strong>React</strong> হলো উচ্চমানের প্রি-বিল্ট কম্পোনেন্ট (ইঞ্জিন ব্লক, সিট, ড্যাশবোর্ড) দিয়ে নমনীয় কাস্টমাইজেশনসহ একটি গাড়ি একত্রিত করার মতো।</p>' },
  { id: 'g-jNrMM-hr2D', text: 'উদাহরণ: একটি অ্যালার্ট দেখায় এমন একটি বাটন তৈরি করা', type: 'heading', level: 2, anchor: 'example-creating-a-button-that-shows-an-alert' },
  { id: 'bYbt5_WtOZ2W', text: '১. ভ্যানিলা JS পদ্ধতি', type: 'heading', level: 3, anchor: '1-vanilla-js-approach' },
  { id: 'IMbwiI_MuW1X', type: 'code', language: 'html', code: `<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Vanilla JS Button</title>
</head>
<body>
    <div id="app"></div>

    <script>
        const app = document.getElementById('app');

        const button = document.createElement('button');
        button.textContent = 'Click Me';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';

        button.addEventListener('click', () => {
            alert('Hello from Vanilla JS!');
        });

        app.appendChild(button);
    </script>
</body>
</html>` },
  { id: '1gwwRTI-YLc3', text: 'বিশ্লেষণ:', type: 'heading', level: 2, anchor: 'breakdown' },
  { id: '55gXqN5hfxk_', type: 'richtext', html: `<ul>
                                    <li>ম্যানুয়ালি একটি বাটন এলিমেন্ট তৈরি করুন।</li>
                                    <li>জাভাস্ক্রিপ্টের মাধ্যমে স্টাইল যোগ করুন।</li>
                                    <li>ইভেন্ট লিসেনার সংযুক্ত করুন।</li>
                                    <li>DOM-এ যোগ করুন।</li>
                                </ul>` },
  { id: 'UD5ZgIUPPV_j', text: '২. React JS পদ্ধতি (CDN দিয়ে)', type: 'heading', level: 2, anchor: '2-react-js-approach-with-cdn' },
  { id: 'eTOf3Kemvy_a', type: 'code', language: 'html', code: `<!-- react.html -->
<!DOCTYPE html>
<html>
<head>
    <title>React Button</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigi></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
    function App() {
        const handleClick = () => {
        alert('Hello from React!');
        };

        return (
        <button
            onClick={handleClick}
            style={{ padding: '10px 20px', fontSize: '16px' }}
        >
            Click Me
        </button>
        );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
    </script>
</body>
</html>` },
  { id: 'Vpuqi5d5qo7l', text: 'বিশ্লেষণ:', type: 'heading', level: 2, anchor: 'breakdown-2' },
  { id: 'CNx3Q4-KqAzT', type: 'richtext', html: `<ul>
                                    <li>একটি কম্পোনেন্টকে একটি ফাংশন হিসেবে সংজ্ঞায়িত করুন।</li>
                                    <li>UI বর্ণনা করতে JSX ব্যবহার করুন।</li>
                                    <li><code>onClick</code> হলো ইভেন্ট লিসেনারের একটি সিনট্যাক্টিক সুগার।</li>
                                    <li>অবজেক্টের মাধ্যমে স্টাইল প্রয়োগ করা যায়।</li>
                                </ul>` },
  { id: 'gy3N1oNBFS72', text: 'সারসংক্ষেপ', type: 'heading', level: 2, anchor: 'summary' },
  { id: '0ZuMrenGHZcC', type: 'table', header: featureTableHeader, rows: [
    ['DOM অ্যাক্সেস', '<code>document.getElementById</code>', 'প্রয়োজন নেই; ডিক্লারেটিভ রেন্ডারিং'],
    ['ইভেন্ট বাইন্ডিং', '<code>addEventListener</code>', 'props-এর মাধ্যমে <code>onClick</code>, <code>onChange</code>'],
    ['UI সংজ্ঞায়ন', 'HTML + JS DOM ম্যানিপুলেশন', 'JSX + কম্পোনেন্ট ফাংশন'],
    ['পঠনযোগ্যতা', 'বড় অ্যাপের জন্য কম', 'বেশি (বিশেষ করে পুনঃব্যবহারে)'],
  ] },
  { id: 'dTGtrp80eyIc', text: 'এরপর কী?', type: 'heading', level: 2, anchor: 'whats-next' },
  { id: 'jIMH83DRtRPp', type: 'richtext', html: `<p><strong>দ্বিতীয় অধ্যায়ে</strong>, আমরা:</p>
<ul>
                                    <li>ভ্যানিলা JS এবং React উভয় দিয়ে একটি বেসিক প্রজেক্ট সেট আপ করব।</li>
                                    <li>ফাইল স্ট্রাকচার এবং রেন্ডারিং বেসিক্স নিয়ে জানব।</li>
                                </ul>` },
]

const toc = [
  { id: 'introduction-to-react-vs-vanilla-js', text: 'React বনাম ভ্যানিলা JS পরিচিতি', level: 2 },
  { id: 'why-is-react-important', text: 'কেন React গুরুত্বপূর্ণ?', level: 2 },
  { id: 'the-history-of-react-why-was-it-created', text: 'React-এর ইতিহাস: কেন এটি তৈরি হয়েছিল?', level: 2 },
  { id: 'why-should-you-learn-react', text: 'কেন আপনার React শেখা উচিত?', level: 3 },
  { id: 'again-what-is-react', text: 'আবার, React কী?', level: 2 },
  { id: 'what-is-vanilla-javascript', text: 'ভ্যানিলা জাভাস্ক্রিপ্ট কী?', level: 2 },
  { id: 'why-use-react-instead-of-vanilla-js', text: 'কেন ভ্যানিলা JS-এর বদলে React ব্যবহার করবেন?', level: 2 },
  { id: 'real-world-analogy', text: '💡 বাস্তব-জগতের উদাহরণ', level: 2 },
  { id: 'example-creating-a-button-that-shows-an-alert', text: 'উদাহরণ: একটি অ্যালার্ট দেখায় এমন একটি বাটন তৈরি করা', level: 2 },
  { id: '1-vanilla-js-approach', text: '১. ভ্যানিলা JS পদ্ধতি', level: 3 },
  { id: 'breakdown', text: 'বিশ্লেষণ:', level: 2 },
  { id: '2-react-js-approach-with-cdn', text: '২. React JS পদ্ধতি (CDN দিয়ে)', level: 2 },
  { id: 'breakdown-2', text: 'বিশ্লেষণ:', level: 2 },
  { id: 'summary', text: 'সারসংক্ষেপ', level: 2 },
  { id: 'whats-next', text: 'এরপর কী?', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('react/introduction: 1/1 written')
