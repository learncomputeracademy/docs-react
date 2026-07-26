import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'd1856bdd-4824-44c0-9528-d6ee8e0e64d3' // design/color-in-design
const title = 'ডিজাইনে রঙ'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'কালার সাইকোলজি, রঙের অর্থ, ব্র্যান্ডিংয়ে রঙ, এবং বয়স-সংস্কৃতি-লিঙ্গ অনুযায়ী রঙের পছন্দ সম্পর্কে জানুন।'

const blocks = [
  { id: 'gGDdYnUgEwVF', type: 'richtext', html: `<p>প্রতিদিন আমরা চারদিক থেকে বিভিন্ন রঙে ঘেরা থাকি। আপনি যদি আশেপাশের জিনিসগুলো ভালোভাবে লক্ষ্য করেন, তাহলে সেগুলো আপনাকে অনেক রঙ ও শেড দিয়ে অবাক করে দিতে পারে। মানুষ হয়তো খেয়াল করেন না যে প্রতিদিনের জিনিসগুলো কতটা রঙিন, কিন্তু রঙের আমাদের আচরণ ও আবেগে উল্লেখযোগ্য প্রভাব আছে। এই নিবন্ধটি কালার সাইকোলজি নামের এই বিষয় নিয়ে গবেষণা করা বিজ্ঞানের জন্য উৎসর্গীকৃত। চলুন রঙের অর্থ নির্ধারণ করি এবং ডিজাইনের জন্য উপযুক্ত রঙ বাছাইয়ের কিছু টিপস দেখি।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960263/img/graphics-design/color-in-design.webp" alt="color-in-design" class="img-fluid">
            </div>` },
  { id: 'rACoU9w33GFR', text: 'কালার সাইকোলজি কী?', type: 'heading', level: 2, anchor: 'what-is-color-psychology' },
  { id: 'wi5lwT2zWH7o', type: 'richtext', html: `<p>এটি মনোবিজ্ঞানের একটি শাখা, যা মানুষের মেজাজ ও আচরণে রঙের প্রভাব নিয়ে গবেষণা করে। বিষয়টি হলো, আমাদের মন রঙের প্রতি প্রতিক্রিয়া দেখায়, যদিও আমরা সাধারণত তা লক্ষ্য করি না। আমাদের চোখ যখন একটি রঙ উপলব্ধি করে, তখন তা মস্তিষ্কের সাথে সংযুক্ত হয়, যা এন্ডোক্রাইন সিস্টেমকে সংকেত পাঠায়, আর তা মেজাজ ও আবেগের পরিবর্তনের জন্য দায়ী হরমোন নিঃসরণ করে। আজকাল এই প্রতিক্রিয়াগুলোর বৈশিষ্ট্য নিয়ে গবেষণার জন্য অনেক গবেষণা চলছে, এবং এরই মধ্যে শেখার মতো অনেক তত্ত্ব আছে। ব্যবসা, মার্কেটিং এবং ডিজাইনসহ অনেক শিল্পে কালার সাইকোলজি সহায়ক।</p>
<p>একটি পণ্যের সাফল্য অনেকাংশে ডিজাইনের জন্য বাছাই করা রঙের উপর নির্ভর করে। সঠিকভাবে বাছাই করা রঙ ব্যবহারকারীদের এমন মানসিকতায় নিয়ে যেতে সাহায্য করে, যা তাদের পদক্ষেপ নিতে বাধ্য করে। Colorcom-এর গবেষণায় দেখা গেছে যে একটি পণ্য সম্পর্কে অবচেতন মতামত তৈরি করতে মানুষের মাত্র 90 সেকেন্ড লাগে, এবং সেই মূল্যায়নের 62% থেকে 90% শুধু রঙের উপর ভিত্তি করে হয়। তাই, কালার সাইকোলজির মৌলিক জ্ঞান আপনার পণ্যের কনভার্সন উন্নত করার পথে সহায়ক হতে পারে। এছাড়াও, সঠিকভাবে বাছাই করা রঙ পণ্যের ব্যবহারযোগ্যতাও বাড়াতে পারে।</p>
<hr>` },
  { id: '8LhEe3LKu-h5', text: 'রঙের অর্থ', type: 'heading', level: 2, anchor: 'meaning-of-colors' },
  { id: 'ASrBHyhHCMur', type: 'richtext', html: '<p>সঠিক টোন ও বার্তা পৌঁছাতে এবং ব্যবহারকারীদের প্রত্যাশিত পদক্ষেপ নিতে বলতে, ডিজাইনারদের বুঝতে হবে রঙের অর্থ কী এবং সেগুলো কী প্রতিক্রিয়া তৈরি করে। আমাদের আগের একটি নিবন্ধে, আমরা রঙের একটি তালিকা তাদের অর্থের সংক্ষিপ্ত বিবরণসহ দেখিয়েছিলাম। আজ আমরা সাধারণ ব্যবহার ও ডিজাইনে রঙের অর্থের একটু বিস্তৃত তালিকা তৈরি করেছি।</p>\n<hr>' },
  { id: 'GYafMpwJOSBy', text: 'লাল', type: 'heading', level: 2, anchor: 'red' },
  { id: 'bTcAKVSjo5Qm', type: 'richtext', html: `<p>এই রঙ সাধারণত আবেগপূর্ণ, শক্তিশালী বা আক্রমণাত্মক অনুভূতির সাথে যুক্ত। এটি মন ও আত্মার ভালো এবং খারাপ উভয় অবস্থার প্রতীক, যার মধ্যে আছে ভালোবাসা, আত্মবিশ্বাস, আবেগ এবং রাগ। ডিজাইনে, লাল রঙের ব্যবহার ব্যবহারকারীদের মনোযোগ আকর্ষণ করার একটি কার্যকর উপায়। এছাড়াও, নেতিবাচক প্রতিক্রিয়া এড়াতে লাল রঙ কম ব্যবহার করার পরামর্শ দেওয়া হয়।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960343/img/graphics-design/red-color.webp" alt="Red Color" class="img-fluid">
            </div>
<hr>` },
  { id: '6GjUEtHUZlPy', text: 'কমলা', type: 'heading', level: 2, anchor: 'orange' },
  { id: 'H94WLBXyJZnx', type: 'richtext', html: `<p>এটি একটি প্রাণবন্ত ও উষ্ণ রঙ, যা উত্তেজনার অনুভূতি নিয়ে আসে। কমলা লালের শক্তি ও হলুদের বন্ধুত্বপূর্ণ ভাব একত্রিত করে, তাই এটি জীবনে অনুপ্রেরণা, উৎসাহ এবং ভালোবাসার অনুভূতি আনতে পারে। ডিজাইনাররা এই রঙ ব্যবহার করেন যখন তাদের সৃজনশীলতা ও অ্যাডভেঞ্চারের চেতনা দেওয়ার প্রয়োজন হয়।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960314/img/graphics-design/orange-color.webp" alt="Orange Color" class="img-fluid">
            </div>
<hr>` },
  { id: 'WGS3vzuQ3_OT', text: 'হলুদ', type: 'heading', level: 2, anchor: 'yellow' },
  { id: 'erzxP8NCHGE8', type: 'richtext', html: `<p>এটি সুখের রঙ, যা সূর্যালোক, আনন্দ এবং উষ্ণতার প্রতীক। হলুদকে দৃশ্যমানভাবে দেখতে সবচেয়ে সহজ রঙ বলে মনে করা হয়। তাছাড়া, এর সবচেয়ে শক্তিশালী মনস্তাত্ত্বিক অর্থগুলোর একটি আছে। ডিজাইনে হলুদ রঙ দেখলে ব্যবহারকারীরা অনুপ্রেরণা ও আত্মবিশ্বাস অনুভব করতে পারেন। তবে, মনে রাখবেন যে অতিরিক্ত হলুদ উদ্বেগ বা ভয়ের মতো নেতিবাচক প্রতিক্রিয়া আনতে পারে।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960386/img/graphics-design/yellow-color.webp" alt="Yellow Color" class="img-fluid">
            </div>
<hr>` },
  { id: 'CICg0MeUhs6s', text: 'সবুজ', type: 'heading', level: 2, anchor: 'green' },
  { id: 'Fpa11PuBI-yu', type: 'richtext', html: `<p>একে প্রায়ই প্রকৃতি, ভারসাম্য এবং সাদৃশ্যের রঙ বলা হয়। সবুজ শান্ত ও সতেজ অনুভূতি নিয়ে আসে। এটি বৃদ্ধি এবং অনভিজ্ঞতারও প্রতীক। এতে অন্যান্য বেশিরভাগ রঙের চেয়ে বেশি ইতিবাচক শক্তি আছে, তবে কখনো কখনো এটি বস্তুবাদের সাথেও যুক্ত। প্রকৃতির সাথে সম্পর্কিত পণ্যের জন্য সবুজ রঙের ডিজাইন পুরোপুরি মানানসই।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960293/img/graphics-design/green-color.webp" alt="Green Color" class="img-fluid">
            </div>
<hr>` },
  { id: 'UUK_Sd59y_lc', text: 'নীল', type: 'heading', level: 2, anchor: 'blue' },
  { id: 'E-SpcD49bmMH', type: 'richtext', html: `<p>এটি প্রায়ই কিছু কর্পোরেট ইমেজ প্রতিনিধিত্ব করে, কারণ নীল হলো বিশ্বাসের রঙ। এটি সাধারণত নির্ভরযোগ্যতা দেখায়, এবং ব্যবহারকারীদের শান্ত অনুভূতি দিতে পারে। তবে, একটি শীতল রঙ হিসেবে, এটি দূরত্ব ও দুঃখের সাথেও যুক্ত, তাই ডিজাইনারদের এটি ভারসাম্যে রাখতে হবে।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <video autoplay="" muted="" loop="" playsinline="" class="img-fluid" aria-label="Blue Color"><source src="https://res.cloudinary.com/docslca/video/upload/v1784960240/img/graphics-design/blue-color.mp4" type="video/mp4"></video>
            </div>
<hr>` },
  { id: 'eGaji9sNBHxw', text: 'বেগুনি', type: 'heading', level: 2, anchor: 'purple' },
  { id: 'JuEImKP2LOvS', type: 'richtext', html: `<p>অনেক রাজা বেগুনি পোশাক পরতেন বলে দীর্ঘদিন ধরে এটি রাজকীয়তা ও সম্পদের সাথে যুক্ত, তাই এটি কিছু বিলাসবহুল পণ্য উপস্থাপনের জন্য উপযোগী। এটি রহস্য ও জাদুরও রঙ। এটি লাল ও নীলের শক্তি মেশায়, তাই এতে শক্তি ও স্থিতিশীলতার একটি ভারসাম্য আছে। এই রঙের বড় ঘনত্ব ব্যবহারকারীদের মনোযোগ বিভ্রান্ত করতে পারে।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960342/img/graphics-design/purple-color.webp" alt="Purple Color" class="img-fluid">
            </div>
<hr>` },
  { id: 'KYPXkedkXYm6', text: 'গোলাপি', type: 'heading', level: 2, anchor: 'pink' },
  { id: 'I7ZKuV-hTsCU', type: 'richtext', html: `<p>এটি আশা, সংবেদনশীলতা এবং রোমান্সের রঙ। গোলাপি লালের চেয়ে অনেক নরম, তাই এটি নিঃশর্ত ভালোবাসার অনুভূতি তৈরি করে। গোলাপি তারুণ্যপূর্ণ নারীসুলভতার সাথে খুব দৃঢ়ভাবে যুক্ত, তাই টার্গেট অডিয়েন্স বেশিরভাগ মেয়ে ও তরুণী হলে এটি একটি কার্যকর রঙ হতে পারে।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960315/img/graphics-design/pink-color.webp" alt="Pink Color" class="img-fluid">
            </div>
<hr>` },
  { id: 'nWNz2hwdfNa7', text: 'বাদামি', type: 'heading', level: 2, anchor: 'brown' },
  { id: 'SgrnO_YvdgGR', type: 'richtext', html: `<p>পৃথিবী মায়ের মতো নিরাপত্তা ও সুরক্ষার রঙ। ডিজাইনাররা সাধারণত বাদামিকে বিভিন্ন শেডে, খুব হালকা থেকে গাঢ় পর্যন্ত, ব্যাকগ্রাউন্ড রঙ হিসেবে ব্যবহার করেন। এটি ডিজাইনে উষ্ণতা ও আরামের অনুভূতি নিয়ে আসে। এছাড়াও, এটি অভিজ্ঞতা ও আশ্বাস দেখাতে ব্যবহার করা যেতে পারে।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <video autoplay="" muted="" loop="" playsinline="" class="img-fluid" aria-label="Brown Color"><source src="https://res.cloudinary.com/docslca/video/upload/v1784960261/img/graphics-design/brown-color.mp4" type="video/mp4"></video>
            </div>
<hr>` },
  { id: '8_8tIapRiZzQ', text: 'কালো', type: 'heading', level: 2, anchor: 'black' },
  { id: 'ojdrHABTt-uJ', type: 'richtext', html: `<p>এই রঙের অনেক অর্থ আছে। এটি করুণ পরিস্থিতি ও মৃত্যুর সাথে যুক্ত। এটি রহস্যের প্রতীক। এটি প্রথাগত, আধুনিক, বা গম্ভীর হতে পারে। সবকিছু নির্ভর করে আপনি এটি কীভাবে ব্যবহার করছেন এবং এর সাথে কোন রঙ মেলাচ্ছেন তার উপর। কালো অন্য যেকোনো রঙের সাথে ভালো মেলে, তাই এটি ব্যাকগ্রাউন্ডের জন্য আদর্শ। ডিজাইনাররা প্রায়ই কনট্রাস্ট তৈরি করতে এটি ব্যবহার করেন।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <video autoplay="" muted="" loop="" playsinline="" class="img-fluid" aria-label="Black Color"><source src="https://res.cloudinary.com/docslca/video/upload/v1784960236/img/graphics-design/black-color.mp4" type="video/mp4"></video>
            </div>
<hr>` },
  { id: 'KeEU2NZxSL4k', text: 'সাদা', type: 'heading', level: 2, anchor: 'white' },
  { id: 'ceKo2auoBxmg', type: 'richtext', html: `<p>এই রঙ পবিত্রতা ও নিষ্পাপতা, পাশাপাশি সম্পূর্ণতা ও স্বচ্ছতার প্রতীক। সাদা প্রায়ই একটি খালি কাগজের সাথে যুক্ত, যা মানুষকে নতুন ধারণা তৈরি করতে অনুপ্রাণিত করে। তবে, অতিরিক্ত সাদা বিচ্ছিন্নতা ও শূন্যতার অনুভূতি তৈরি করতে পারে। ডিজাইনে, সাদা সাধারণত ব্যাকগ্রাউন্ড রঙ হিসেবে ব্যবহৃত হয়, বিশেষ করে এমন রিসোর্সের জন্য যেখানে পঠনযোগ্যতা একটি গুরুত্বপূর্ণ অংশ।</p>
<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <video autoplay="" muted="" loop="" playsinline="" class="img-fluid" aria-label="White Color"><source src="https://res.cloudinary.com/docslca/video/upload/v1784960384/img/graphics-design/white-color.mp4" type="video/mp4"></video>
            </div>
<hr>` },
  { id: 'olPnii7CRuK5', text: 'ব্র্যান্ডিংয়ে রঙের অর্থ', type: 'heading', level: 2, anchor: 'color-meanings-in-branding' },
  { id: 'd6yql4vbOBO4', type: 'richtext', html: `<p>রঙ শুধু পণ্যের ভিজ্যুয়াল চেহারার জন্যই নয়, ব্র্যান্ড রিকগনিশনের জন্যও একটি গুরুত্বপূর্ণ ফ্যাক্টর। তবে, ব্র্যান্ডিংয়ে, সাধারণ বোঝাপড়ার চেয়ে রঙের অর্থ আরও সরাসরি হতে থাকে। এগুলো অল্প কিছু শব্দে সংক্ষেপে বর্ণনা করা যায়, তাই এখানে আপনার জন্য তালিকা দেওয়া হলো:</p>
<ul>
              <li>
                <b>লাল</b> - আত্মবিশ্বাস, তারুণ্য এবং শক্তি।
              </li>
              <li>
                <b>কমলা</b> - বন্ধুত্বপূর্ণ, উষ্ণ এবং প্রাণবন্ত।
              </li>
              <li>
                <b>হলুদ</b> - সুখ, আশাবাদ এবং উষ্ণতা।
              </li>
              <li>
                <b>সবুজ</b> - শান্তি, বৃদ্ধি এবং স্বাস্থ্য।
              </li>
              <li>
                <b>নীল</b> - বিশ্বাস, নিরাপত্তা এবং স্থিতিশীলতা।
              </li>
              <li>
                <b>বেগুনি</b> - বিলাসবহুল, সৃজনশীল এবং জ্ঞানী।
              </li>
              <li>
                <b>কালো</b> - নির্ভরযোগ্য, পরিমার্জিত এবং অভিজ্ঞ।
              </li>
              <li>
                <b>সাদা</b> - সাধারণ, শান্ত এবং পরিচ্ছন্ন।
              </li>
            </ul>
<hr>` },
  { id: 'oJ2OQZ9onwji', text: 'রঙের পছন্দ', type: 'heading', level: 2, anchor: 'color-preferences' },
  { id: 'uVoNGIhHi2UR', type: 'richtext', html: `<p>ভিজ্যুয়াল উপলব্ধি প্রত্যেকের জন্য বেশ ব্যক্তিগত। ডিজাইনারদের মনে রাখতে হবে যে বয়স, সংস্কৃতি এবং লিঙ্গের মতো ফ্যাক্টরের কারণে রঙের প্রভাব ভিন্ন হতে পারে। প্রথমত, খাবার, পোশাক, সঙ্গীত, রঙ এবং আরও অনেক বিষয় যাই হোক না কেন, জীবনের সাথে সাথে মানুষের পছন্দ বদলাতে পারে। এটি জীবনকালে ঘটা মানসিক ও শারীরিক পরিবর্তন উভয়ের কারণে হয়। উদাহরণস্বরূপ, বাচ্চারা হলুদ রঙ বেশ পছন্দ করে, কিন্তু আমরা বড় হওয়ার সাথে সাথে এটি সাধারণত কম আকর্ষণীয় মনে হয়। Faber Birren তার Color Psychology and Color Therapy বইয়ে এটি ব্যাখ্যা করেছেন: "পরিণত বয়সের সাথে সাথে দীর্ঘ তরঙ্গদৈর্ঘ্যের রঙের (লাল, কমলা এবং হলুদ) চেয়ে ছোট তরঙ্গদৈর্ঘ্যের রঙের (নীল, সবুজ, বেগুনি) প্রতি বেশি ভালোলাগা তৈরি হয়"। শিশু ও প্রাপ্তবয়স্কদের উপলব্ধির মধ্যে আরেকটি পার্থক্য হলো, শিশুরা দ্রুত তাদের প্রিয় রঙ পরিবর্তন করতে পারে, আর প্রাপ্তবয়স্কদের রঙের পছন্দ সাধারণত সহজে পরিবর্তনযোগ্য নয়।</p>
<p>এছাড়াও, ডিজাইনারদের বিবেচনা করতে হবে যে অনেক সাংস্কৃতিক পার্থক্য আছে, এবং রঙের উপলব্ধিও এর ব্যতিক্রম নয়। কখনো কখনো বিভিন্ন সংস্কৃতি রঙকে ভিন্নভাবে সংজ্ঞায়িত করে, উদাহরণস্বরূপ, পশ্চিমা দেশগুলোতে, সাদা রঙ মানে সুখ ও পবিত্রতা, আর কিছু এশিয়ান দেশে এটি মৃত্যুর প্রতীক। বিভিন্ন দেশে অর্থগুলো কতটা ভিন্ন হতে পারে তার অনেক উদাহরণ পাওয়া যায়, কিন্তু এ নিয়ে বলতে একটি সম্পূর্ণ নিবন্ধ লাগবে, তাই এই বিষয়ে আগ্রহী হলে, আমাদের ব্লগে আপডেট অনুসরণ করুন, কারণ এই বিষয়ে পোস্ট শীঘ্রই আসছে।</p>
<p>রঙের পছন্দের আরেকটি বিষয় হলো লিঙ্গ। বছরের পর বছর ধরে অনেক কালার স্টাডি করা হয়েছে এবং তাদের অনেকগুলো বলে যে নারী ও পুরুষের রঙের পছন্দ উল্লেখযোগ্যভাবে ভিন্ন। The Color Assignment গ্রুপ এই বিষয়ে গভীর গবেষণা করেছে এবং অনেক ডিজাইনার ইতিমধ্যে সৃজনশীল প্রক্রিয়ায় ফলাফল ব্যবহার করছেন। আমরা গবেষণার সবচেয়ে উল্লেখযোগ্য বিষয়গুলো আপনার সাথে শেয়ার করার জন্য চিহ্নিত করেছি।</p>
<ul>
              <li>
                <h4>নীল সবচেয়ে জনপ্রিয় রঙ।</h4>
                <p>সব বয়সের পুরুষ ও নারী উভয়েই নীলকে প্রিয় রঙ মনে করেন। সেরুলিয়ান, অ্যাজিওর, বেরিল, কর্নফ্লাওয়ার ব্লু এবং স্যাফায়ারের মতো নীলের শেড নারীদের মধ্যে জনপ্রিয়।</p>
              </li>
              <li>
                <h4>বাদামি ও কমলা অপছন্দের তালিকায়।</h4>
                <p>প্রথমটি পুরুষদের মধ্যে কম পছন্দের, দ্বিতীয়টি নারীদের মধ্যে।</p>
              </li>
              <li>
                <h4>শীতল রঙ বেশি পছন্দ।</h4>
                <p>পুরুষ ও নারী উভয়েই সাধারণত নীল, সবুজ এবং তাদের হালকা শেড পছন্দ করেন।</p>
              </li>
              <li>
                <h4>নারীরা হালকা শেড (টিন্ট) পছন্দ করেন।</h4>
                <p>পুরুষরা যেখানে খাঁটি বা গাঢ় শেডের রঙ পছন্দ করেন, নারীরা হালকা শেড নিয়ে সন্তুষ্ট থাকেন।</p>
              </li>
              <li>
                <h4>পুরুষরা অক্রোম্যাটিক রঙ পছন্দ করেন।</h4>
                <p>সাদা, কালো এবং ধূসর হলো নিরপেক্ষ রঙ, এবং পুরুষরা এগুলো বেছে নিতে আগ্রহী।</p>
              </li>
            </ul>
<hr>` },
  { id: 'gymLQwX1HoLl', text: 'প্রিয় রঙ', type: 'heading', level: 2, anchor: 'favourite-colors' },
  { id: 'k9ptclWRFpH4', type: 'richtext', html: `<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960267/img/graphics-design/favorite-color-on-gender.webp" alt="Favourite Color" class="img-fluid">
            </div>
<hr>` },
  { id: 'vJ0eIK8XXQJ3', text: 'সবচেয়ে অপছন্দের রঙ', type: 'heading', level: 2, anchor: 'least-favorite-colors' },
  { id: 'oTj9pQzghaHr', type: 'richtext', html: `<div class="img-block" style="margin-bottom: 1rem;text-align:center;">
              <img src="https://res.cloudinary.com/docslca/image/upload/f_auto,q_auto/v1784960294/img/graphics-design/least-fav-colors-gender.webp" alt="Favourite Color" class="img-fluid">
            </div>
<hr>
<p>UI এবং UX ডিজাইন তৈরি করার সময় টার্গেট অডিয়েন্সের রঙের পছন্দ বিবেচনা করা অত্যন্ত গুরুত্বপূর্ণ, কারণ এটি নেতিবাচক প্রতিক্রিয়া ও সংযোগ এড়াতে সাহায্য করে।</p>` },
  { id: 'QeZFur9kLtek', text: 'বিবেচনা করার বিষয়', type: 'heading', level: 2, anchor: 'points-to-consider' },
  { id: 'dfFZK8HlfXYt', type: 'richtext', html: `<p>কালার সাইকোলজি বোঝা ও শেখা বেশ জটিল। তবে, এটি ব্যবহারকারী ও তাদের চাহিদা বুঝতে সাহায্যকারী একটি কার্যকর টুল হয়ে উঠতে পারে ডিজাইনারদের হাতে। নিবন্ধটি সংক্ষেপে বলতে, এখানে বিবেচনা করার মতো কিছু দরকারি বিষয়ের তালিকা দেওয়া হলো:</p>
<ul>
              <li>বুদ্ধিমত্তার সাথে রঙ বাছাই করুন। এগুলো ব্যবহারকারীদের উপর গভীর প্রভাব ফেলে।</li>
              <li>নিশ্চিত করুন যে আপনার ডিজাইন এবং এর রঙ সঠিক বার্তা ও সুর পৌঁছে দেয়।</li>
              <li>আপনার টার্গেট অডিয়েন্স সম্পর্কে জানুন। রঙের পছন্দ ও অর্থ বয়স, লিঙ্গ এবং সংস্কৃতিসহ অনেক ফ্যাক্টরের উপর নির্ভর করে।</li>
              <li>কিছু রঙ বিভিন্ন ডিভাইসের স্ক্রিনে ভিন্ন দেখাতে পারে। অতিরিক্ত টেস্টিং করে কোনো ক্ষতি নেই।</li>
              <li>টার্গেট অডিয়েন্সের প্রতিনিধিদের সাথে UI রঙ টেস্ট করা একটি ভালো ধারণা হতে পারে।</li>
              <li>ব্যবহারকারীদের উপলব্ধির জন্য সবচেয়ে ভালো উপায়ে, বুদ্ধিমত্তার সাথে কালার কম্বিনেশন তৈরি করার চেষ্টা করুন।</li>
            </ul>
<p class="note">
              <b>মনে রাখবেন:</b>
              Color Theory রিসোর্স ডাউনলোড করতে <a href="https://res.cloudinary.com/docslca/raw/upload/v1784959172/pdfs/Color-Theory" target="_blank" download="LCA-Color-Theory">এখানে ক্লিক করুন</a>।
            </p>` },
]

const toc = [
  { id: 'what-is-color-psychology', text: 'কালার সাইকোলজি কী?', level: 2 },
  { id: 'meaning-of-colors', text: 'রঙের অর্থ', level: 2 },
  { id: 'red', text: 'লাল', level: 2 },
  { id: 'orange', text: 'কমলা', level: 2 },
  { id: 'yellow', text: 'হলুদ', level: 2 },
  { id: 'green', text: 'সবুজ', level: 2 },
  { id: 'blue', text: 'নীল', level: 2 },
  { id: 'purple', text: 'বেগুনি', level: 2 },
  { id: 'pink', text: 'গোলাপি', level: 2 },
  { id: 'brown', text: 'বাদামি', level: 2 },
  { id: 'black', text: 'কালো', level: 2 },
  { id: 'white', text: 'সাদা', level: 2 },
  { id: 'color-meanings-in-branding', text: 'ব্র্যান্ডিংয়ে রঙের অর্থ', level: 2 },
  { id: 'color-preferences', text: 'রঙের পছন্দ', level: 2 },
  { id: 'favourite-colors', text: 'প্রিয় রঙ', level: 2 },
  { id: 'least-favorite-colors', text: 'সবচেয়ে অপছন্দের রঙ', level: 2 },
  { id: 'points-to-consider', text: 'বিবেচনা করার বিষয়', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('design/color-in-design: 1/1 written')
