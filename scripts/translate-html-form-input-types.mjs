import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DOC_ID = 'f30314fe-c554-4d61-a979-28b04a7a531b' // html/form-input-types
const title = 'HTML ফর্ম ইনপুট টাইপ'
const meta_title = `${title} | Learn Computer Academy`
const meta_description = 'text, password, radio, checkbox, date, email, range, color সহ সব HTML ও HTML5 ইনপুট টাইপ শিখুন।'

const demoIntro = 'উপরের HTML কোডটি ব্রাউজারে এভাবে দেখাবে:'

const blocks = [
  { id: 'jsWBvFRgH4Rq', type: 'richtext', html: '<hr>\n<p>এই চ্যাপ্টারে <code>&lt;input&gt;</code> এলিমেন্টের বিভিন্ন ইনপুট টাইপ বর্ণনা করা হয়েছে।</p>\n<hr>' },
  { id: 'V4E541yGcB6c', text: 'HTML ইনপুট টাইপ', type: 'heading', level: 2, anchor: 'html-input-types' },
  { id: 'nwrmNbq0_SHJ', type: 'richtext', html: `<p>HTML-এ ব্যবহারযোগ্য বিভিন্ন ইনপুট টাইপ এখানে দেওয়া হলো:</p>
<ul>
                                    <li><code>&lt;input type="button"&gt;</code></li>
                                    <li><code>&lt;input type="checkbox"&gt;</code></li>
                                    <li><code>&lt;input type="color"&gt;</code></li>
                                    <li><code>&lt;input type="date"&gt;</code></li>
                                    <li><code>&lt;input type="datetime-local"&gt;</code></li>
                                    <li><code>&lt;input type="email"&gt;</code></li>
                                    <li><code>&lt;input type="file"&gt;</code></li>
                                    <li><code>&lt;input type="hidden"&gt;</code></li>
                                    <li><code>&lt;input type="image"&gt;</code></li>
                                    <li><code>&lt;input type="month"&gt;</code></li>
                                    <li><code>&lt;input type="number"&gt;</code></li>
                                    <li><code>&lt;input type="password"&gt;</code></li>
                                    <li><code>&lt;input type="radio"&gt;</code></li>
                                    <li><code>&lt;input type="range"&gt;</code></li>
                                    <li><code>&lt;input type="reset"&gt;</code></li>
                                    <li><code>&lt;input type="search"&gt;</code></li>
                                    <li><code>&lt;input type="submit"&gt;</code></li>
                                    <li><code>&lt;input type="tel"&gt;</code></li>
                                    <li><code>&lt;input type="text"&gt;</code></li>
                                    <li><code>&lt;input type="time"&gt;</code></li>
                                    <li><code>&lt;input type="url"&gt;</code></li>
                                    <li><code>&lt;input type="week"&gt;</code></li>
                                </ul>
<hr>` },
  { id: 'TuOyqTTUIKTX', text: 'ইনপুট টাইপ Text', type: 'heading', level: 2, anchor: 'input-type-text' },
  { id: '32iWCKZ1KP1f', type: 'richtext', html: '<p><code>&lt;input type="text"&gt;</code> একটি <b>এক-লাইনের টেক্সট ইনপুট ফিল্ড</b> নির্ধারণ করে:</p>' },
  { id: 'unw9H9tpXHJU', type: 'code', language: 'html', code: '<form>\n    First name:<br>\n    <input type="text" name="firstname"><br>\n    Last name:<br>\n    <input type="text" name="lastname">\n</form>' },
  { id: 'z0YbElxNuO3V', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  নামের প্রথম অংশ:<br>
                                  <input type="text" name="firstname"><br>
                                  পদবি:<br>
                                  <input type="text" name="lastname">
                                </form>
<hr>` },
  { id: 'JqHfX__uo0aU', text: 'ইনপুট টাইপ Password', type: 'heading', level: 2, anchor: 'input-type-password' },
  { id: '40KzSSmx8q9v', type: 'richtext', html: '<p><code>&lt;input type="password"&gt;</code> একটি <b>পাসওয়ার্ড ফিল্ড</b> নির্ধারণ করে:</p>' },
  { id: 'e0ZhrArzp87j', type: 'code', language: 'html', code: '<form>\n    User name:<br>\n    <input type="text" name="username"><br>\n    User password:<br>\n    <input type="password" name="psw">\n</form>' },
  { id: 'D75YE43U1d_D', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  ব্যবহারকারীর নাম:<br>
                                  <input type="text" name="username"><br>
                                  ব্যবহারকারীর পাসওয়ার্ড:<br>
                                  <input type="password" name="psw">
                                </form>
<p>পাসওয়ার্ড ফিল্ডের অক্ষরগুলো মাস্ক করা থাকে (তারকা চিহ্ন [*] বা বৃত্ত হিসেবে দেখানো হয়)।</p>
<hr>` },
  { id: 'LSAzL8zqIWjA', text: 'ইনপুট টাইপ Submit', type: 'heading', level: 2, anchor: 'input-type-submit' },
  { id: 'EeHw-lygefRW', type: 'richtext', html: '<p><code>&lt;input type="submit"&gt;</code> ফর্ম ডেটা একটি <b>ফর্ম-হ্যান্ডলারে</b> <b>জমা দেওয়ার</b> জন্য একটি বাটন নির্ধারণ করে।</p>\n<p>ফর্ম-হ্যান্ডলার সাধারণত একটি সার্ভার পেজ, যেখানে ইনপুট ডেটা প্রসেস করার একটি স্ক্রিপ্ট থাকে।</p>\n<p>ফর্মের <code>action</code> অ্যাট্রিবিউটে ফর্ম-হ্যান্ডলার উল্লেখ করা হয়:</p>' },
  { id: 'wn2WT-iwvFFm', type: 'code', language: 'html', code: '<form action="/action_page.php">\n    First name:<br>\n    <input type="text" name="firstname" value="Mickey"><br>\n    Last name:<br>\n    <input type="text" name="lastname" value="Mouse"><br><br>\n    <input type="submit" value="Submit">\n</form>' },
  { id: 'VGi88Wpnmk5U', type: 'richtext', html: `<p>${demoIntro}</p>
<form action="">
                                  নামের প্রথম অংশ:<br>
                                  <input type="text" name="firstname" value="Mickey"><br>
                                  পদবি:<br>
                                  <input type="text" name="lastname" value="Mouse"><br><br>
                                  <input type="submit" value="জমা দিন">
                                </form>
<p>সাবমিট বাটনের value অ্যাট্রিবিউট বাদ দিলে, বাটনটি একটি ডিফল্ট টেক্সট পাবে:</p>
<hr>` },
  { id: 'eS2EBXRHcPgd', text: 'ইনপুট টাইপ Reset', type: 'heading', level: 2, anchor: 'input-type-reset' },
  { id: 'd2VuSIOQdl4o', type: 'richtext', html: '<p><code>&lt;input type="reset"&gt;</code> একটি <b>রিসেট বাটন</b> নির্ধারণ করে, যা সব ফর্ম মান তাদের ডিফল্ট মানে ফিরিয়ে দেবে:</p>' },
  { id: 'V4CV3XQV_Xo5', type: 'code', language: 'html', code: '<form action="/action_page.php">\n    First name:<br>\n    <input type="text" name="firstname" value="Mickey"><br>\n    Last name:<br>\n    <input type="text" name="lastname" value="Mouse"><br><br>\n    <input type="submit" value="Submit">\n    <input type="reset">\n</form>' },
  { id: 'N6-xe3gLSp_A', type: 'richtext', html: `<p>${demoIntro}</p>
<form action="">
                                  নামের প্রথম অংশ:<br>
                                  <input type="text" name="firstname" value="Mickey"><br>
                                  পদবি:<br>
                                  <input type="text" name="lastname" value="Mouse"><br><br>
                                  <input type="submit" value="জমা দিন">
                                  <input type="reset">
                                </form>
<p>ইনপুট মান পরিবর্তন করে "Reset" বাটনে ক্লিক করলে, ফর্ম-ডেটা ডিফল্ট মানে ফিরে যাবে।</p>
<hr>` },
  { id: 'zPg8o8WmPeGX', text: 'ইনপুট টাইপ Radio', type: 'heading', level: 2, anchor: 'input-type-radio' },
  { id: 'j99D33Z7MKjN', type: 'richtext', html: '<p><code>&lt;input type="radio"&gt;</code> একটি <b>রেডিও বাটন</b> নির্ধারণ করে।</p>\n<p>রেডিও বাটন ব্যবহারকারীকে সীমিত সংখ্যক বিকল্প থেকে শুধুমাত্র একটি বেছে নিতে দেয়:</p>' },
  { id: 'bqJW1_uxVrQX', type: 'code', language: 'html', code: '<form>\n    <input type="radio" name="gender" value="male" checked> Male<br>\n    <input type="radio" name="gender" value="female"> Female<br>\n    <input type="radio" name="gender" value="other"> Other\n</form>' },
  { id: '49LrLXnWwEip', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  <input type="radio" name="gender" value="male" checked=""> পুরুষ<br>
                                  <input type="radio" name="gender" value="female"> মহিলা<br>
                                  <input type="radio" name="gender" value="other"> অন্যান্য
                                </form>
<hr>` },
  { id: '-sVTB-AArzmP', text: 'ইনপুট টাইপ Checkbox', type: 'heading', level: 2, anchor: 'input-type-checkbox' },
  { id: 'kmIPWpHaMw74', type: 'richtext', html: '<p><code>&lt;input type="checkbox"&gt;</code> একটি <b>চেকবক্স</b> নির্ধারণ করে।</p>\n<p>চেকবক্স ব্যবহারকারীকে সীমিত সংখ্যক বিকল্প থেকে শূন্য বা তার বেশি অপশন বেছে নিতে দেয়।</p>' },
  { id: 'cdITXYdjB4zc', type: 'code', language: 'html', code: '<form>\n    <input type="checkbox" name="vehicle1" value="Bike"> I have a bike<br>\n    <input type="checkbox" name="vehicle2" value="Car"> I have a car \n</form>' },
  { id: 'dMTee0BL5b_Q', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  <input type="checkbox" name="vehicle1" value="Bike"> আমার একটি বাইক আছে<br>
                                  <input type="checkbox" name="vehicle2" value="Car"> আমার একটি গাড়ি আছে
                                </form>
<hr>` },
  { id: '7cmY_H1-l_5N', text: 'ইনপুট টাইপ Button', type: 'heading', level: 2, anchor: 'input-type-button' },
  { id: '3jas8WEsvCbu', type: 'richtext', html: '<p><code>&lt;input type="button"&gt;</code> একটি বাটন নির্ধারণ করে:</p>' },
  { id: 'k1YSpOgAj0Kt', type: 'code', language: 'html', code: "<input type=\"button\" onclick=\"alert('Hello World!')\" value=\"Click Me!\">" },
  { id: '1evn6H0cIKae', type: 'richtext', html: `<p>${demoIntro}</p>
<input type="button" onclick="alert('Hello World!')" value="এখানে ক্লিক করুন!">
<hr>` },
  { id: 'BnF7UtW7MJVt', text: 'HTML5 ইনপুট টাইপ', type: 'heading', level: 2, anchor: 'html5-input-types' },
  { id: 'EJHtfbX_IL3U', type: 'richtext', html: `<p>HTML5-এ বেশ কিছু নতুন ইনপুট টাইপ যোগ করা হয়েছে:</p>
<ul>
                                    <li>color</li>
                                    <li>date</li>
                                    <li>datetime-local</li>
                                    <li>email</li>
                                    <li>month</li>
                                    <li>number</li>
                                    <li>range</li>
                                    <li>search</li>
                                    <li>tel</li>
                                    <li>time</li>
                                    <li>url</li>
                                    <li>week</li>
                                </ul>
<p>যে নতুন ইনপুট টাইপগুলো <u>পুরনো ওয়েব ব্রাউজারে সমর্থিত নয়</u>, সেগুলো <code>&lt;input type="text"&gt;</code>-এর মতো আচরণ করবে।</p>
<hr>` },
  { id: 'P4KSZKpbUKe3', text: 'ইনপুট টাইপ Color', type: 'heading', level: 2, anchor: 'input-type-color' },
  { id: 'EOUExWv0qC21', type: 'richtext', html: '<p><code>&lt;input type="color"&gt;</code> এমন ইনপুট ফিল্ডের জন্য ব্যবহৃত হয়, যাতে একটি রঙ থাকা উচিত।</p>\n<p>ব্রাউজার সমর্থনের উপর নির্ভর করে, ইনপুট ফিল্ডে একটি কালার পিকার দেখা যেতে পারে।</p>' },
  { id: 'Vf22Yw_RDYzx', type: 'code', language: 'html', code: '<form>\n    Select your favorite color:\n    <input type="color" name="favcolor">\n</form>' },
  { id: 'WelYr1W4aVMm', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  আপনার পছন্দের রঙ বেছে নিন:
                                  <input type="color" name="favcolor" value="#ff0000">
                                </form>
<hr>` },
  { id: 'pIx5ZVDDOv3m', text: 'ইনপুট টাইপ Date', type: 'heading', level: 2, anchor: 'input-type-date' },
  { id: 'cfh1yRZyNaEe', type: 'richtext', html: '<p><code>&lt;input type="date"&gt;</code> এমন ইনপুট ফিল্ডের জন্য ব্যবহৃত হয়, যাতে একটি তারিখ থাকা উচিত।</p>\n<p>ব্রাউজার সমর্থনের উপর নির্ভর করে, ইনপুট ফিল্ডে একটি ডেট পিকার দেখা যেতে পারে।</p>' },
  { id: '46PrU9wetsA1', type: 'code', language: 'html', code: '<form>\n    Birthday:\n    <input type="date" name="bday">\n</form>' },
  { id: 'q2tfKzuWR4c3', type: 'richtext', html: '<p>তারিখে সীমাবদ্ধতা যোগ করতে আপনি <code>min</code> এবং <code>max</code> অ্যাট্রিবিউটও ব্যবহার করতে পারেন:</p>' },
  { id: 'N-nCvuWAWkJF', type: 'code', language: 'html', code: '<form>\n    Enter a date before 1980-01-01:\n    <input type="date" name="bday" max="1979-12-31"><br>\n    Enter a date after 2000-01-01:\n    <input type="date" name="bday" min="2000-01-02"><br>\n</form>' },
  { id: '9cW9-n6PiK0N', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  1980-01-01-এর আগের একটি তারিখ দিন:
                                  <input type="date" name="bday" max="1979-12-31"><br>
                                  2000-01-01-এর পরের একটি তারিখ দিন:
                                  <input type="date" name="bday" min="2000-01-02"><br>
                                </form>
<hr>` },
  { id: 'MF_xmnlPsjAD', text: 'ইনপুট টাইপ Datetime-local', type: 'heading', level: 2, anchor: 'input-type-datetime-local' },
  { id: 'wYRd3w9eYfau', type: 'richtext', html: '<p><code>&lt;input type="datetime-local"&gt;</code> একটি তারিখ ও সময়ের ইনপুট ফিল্ড নির্ধারণ করে, যেখানে কোনো টাইম জোন থাকে না।</p>\n<p>ব্রাউজার সমর্থনের উপর নির্ভর করে, ইনপুট ফিল্ডে একটি ডেট পিকার দেখা যেতে পারে।</p>' },
  { id: 'nTO6MW1gbTWR', type: 'code', language: 'html', code: '<form>\n    Birthday (date and time):\n    <input type="datetime-local" name="bdaytime">\n</form>' },
  { id: '5V60HiIuDIiv', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  জন্মতারিখ (তারিখ ও সময়):
                                  <input type="datetime-local" name="bdaytime">
                                </form>
<hr>` },
  { id: 'TohYP8GU4b4d', text: 'ইনপুট টাইপ Email', type: 'heading', level: 2, anchor: 'input-type-email' },
  { id: 'STIeM8wrZqkr', type: 'richtext', html: '<p><code>&lt;input type="email"&gt;</code> এমন ইনপুট ফিল্ডের জন্য ব্যবহৃত হয়, যাতে একটি ইমেইল ঠিকানা থাকা উচিত।</p>\n<p>ব্রাউজার সমর্থনের উপর নির্ভর করে, জমা দেওয়ার সময় ইমেইল ঠিকানা স্বয়ংক্রিয়ভাবে ভ্যালিডেট হতে পারে।</p>\n<p>কিছু স্মার্টফোন email টাইপ শনাক্ত করে, এবং ইমেইল ইনপুটের সাথে মিলিয়ে কিবোর্ডে ".com" যোগ করে।</p>' },
  { id: 'i_Q8lCfuEvTv', type: 'code', language: 'html', code: '<form>\n    E-mail:\n    <input type="email" name="email">\n</form>' },
  { id: 'LfLw_m_TD0CX', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  ইমেইল:
                                  <input type="email" name="email">
                                </form>
<hr>` },
  { id: 'f2DZD2z-YZQd', text: 'ইনপুট টাইপ File', type: 'heading', level: 2, anchor: 'input-type-file' },
  { id: 'sneqjPTqUS9X', type: 'richtext', html: '<p><code>&lt;input type="file"&gt;</code> ফাইল আপলোডের জন্য একটি ফাইল-সিলেক্ট ফিল্ড এবং একটি "Browse" বাটন নির্ধারণ করে।</p>' },
  { id: 'adqEfrgLsaaQ', type: 'code', language: 'html', code: '<form>\n    Select a file: <input type="file" name="myFile">\n</form>' },
  { id: 'f-nl8haP240v', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  একটি ফাইল বেছে নিন: <input type="file" name="myFile">
                                </form>
<hr>` },
  { id: 'tWKYAjg9nReg', text: 'ইনপুট টাইপ Month', type: 'heading', level: 2, anchor: 'input-type-month' },
  { id: 'ixlIhVKLySia', type: 'richtext', html: '<p><code>&lt;input type="month"&gt;</code> ব্যবহারকারীকে একটি মাস ও বছর বেছে নেওয়ার সুযোগ দেয়।</p>\n<p>ব্রাউজার সমর্থনের উপর নির্ভর করে, ইনপুট ফিল্ডে একটি ডেট পিকার দেখা যেতে পারে।</p>' },
  { id: 'KnWIThWb1NzD', type: 'code', language: 'html', code: '<form>\n    Birthday (month and year):\n    <input type="month" name="bdaymonth">\n</form>' },
  { id: 'BDs2vKdO_sYD', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  জন্মতারিখ (মাস ও বছর):
                                  <input type="month" name="bdaymonth">
                                </form>
<hr>` },
  { id: '9ZeKCJUqSbqw', text: 'ইনপুট টাইপ Number', type: 'heading', level: 2, anchor: 'input-type-number' },
  { id: 'TwFd1SHj-Qxc', type: 'richtext', html: '<p><code>&lt;input type="number"&gt;</code> একটি <b>সংখ্যাসূচক</b> ইনপুট ফিল্ড নির্ধারণ করে।</p>\n<p>কোন সংখ্যাগুলো গ্রহণযোগ্য তার সীমাবদ্ধতাও আপনি সেট করতে পারেন।</p>\n<p>নিচের উদাহরণে একটি সংখ্যাসূচক ইনপুট ফিল্ড দেখানো হয়েছে, যেখানে আপনি 1 থেকে 5-এর মধ্যে একটি মান দিতে পারবেন:</p>' },
  { id: 'Om_98MyYifFo', type: 'code', language: 'html', code: '<form>\n    Quantity (between 1 and 5):\n    <input type="number" name="quantity" min="1" max="5">\n</form>' },
  { id: 'dIjFZniknm4U', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  পরিমাণ (1 থেকে 5-এর মধ্যে):
                                  <input type="number" name="quantity" min="1" max="5">
                                </form>
<hr>` },
  { id: 'cPYHsgB-j6NS', text: 'ইনপুট রেস্ট্রিকশন', type: 'heading', level: 2, anchor: 'input-restrictions' },
  { id: 'JWU-PvKPiuvC', type: 'richtext', html: '<p>এখানে কিছু সাধারণ ইনপুট রেস্ট্রিকশনের তালিকা দেওয়া হলো:</p>' },
  { id: 'v1Zwe8eBtFtZ', type: 'table', header: ['অ্যাট্রিবিউট', 'বিবরণ'], rows: [
    ['disabled', 'নির্ধারণ করে যে একটি ইনপুট ফিল্ড নিষ্ক্রিয় থাকবে'],
    ['max', 'একটি ইনপুট ফিল্ডের সর্বোচ্চ মান নির্ধারণ করে'],
    ['maxlength', 'একটি ইনপুট ফিল্ডের সর্বোচ্চ অক্ষর সংখ্যা নির্ধারণ করে'],
    ['min', 'একটি ইনপুট ফিল্ডের সর্বনিম্ন মান নির্ধারণ করে'],
    ['pattern', 'ইনপুট মান যাচাই করার জন্য একটি রেগুলার এক্সপ্রেশন নির্ধারণ করে'],
    ['readonly', 'নির্ধারণ করে যে একটি ইনপুট ফিল্ড শুধু পড়ার জন্য (পরিবর্তন করা যাবে না)'],
    ['required', 'নির্ধারণ করে যে একটি ইনপুট ফিল্ড বাধ্যতামূলক (অবশ্যই পূরণ করতে হবে)'],
    ['size', 'একটি ইনপুট ফিল্ডের প্রস্থ (অক্ষরে) নির্ধারণ করে'],
    ['step', 'একটি ইনপুট ফিল্ডের বৈধ সংখ্যার ব্যবধান নির্ধারণ করে'],
    ['value', 'একটি ইনপুট ফিল্ডের ডিফল্ট মান নির্ধারণ করে'],
  ] },
  { id: 'hW2h0xpKwaAl', type: 'richtext', html: '<p>পরের চ্যাপ্টারে ইনপুট রেস্ট্রিকশন সম্পর্কে আরও জানবেন।</p>\n<p>নিচের উদাহরণে একটি সংখ্যাসূচক ইনপুট ফিল্ড দেখানো হয়েছে, যেখানে আপনি 0 থেকে 100-এর মধ্যে, 10-এর ধাপে একটি মান দিতে পারবেন। ডিফল্ট মান হলো 30:</p>' },
  { id: 'pF4v9qQi7CKO', type: 'code', language: 'html', code: '<form>\n    Quantity:\n    <input type="number" name="points" min="0" max="100" step="10" value="30">\n</form>' },
  { id: 'hWxY8gpm05Xk', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  পরিমাণ:
                                  <input type="number" name="points" min="0" max="100" step="10" value="30">
                                </form>
<hr>` },
  { id: 'rBAek4eWlRyL', text: 'ইনপুট টাইপ Range', type: 'heading', level: 2, anchor: 'input-type-range' },
  { id: 'fAq_pZdmIgVK', type: 'richtext', html: '<p><code>&lt;input type="range"&gt;</code> এমন একটি সংখ্যা দেওয়ার জন্য একটি কন্ট্রোল নির্ধারণ করে, যার সঠিক মান তেমন গুরুত্বপূর্ণ নয় (যেমন একটি স্লাইডার কন্ট্রোল)। ডিফল্ট রেঞ্জ 0 থেকে 100। তবে, <code>min</code>, <code>max</code>, এবং <code>step</code> অ্যাট্রিবিউট দিয়ে আপনি কোন সংখ্যাগুলো গ্রহণযোগ্য তার সীমাবদ্ধতা সেট করতে পারেন:</p>' },
  { id: 'HEykdmCmbjqk', type: 'code', language: 'html', code: '<form>\n    <input type="range" name="points" min="0" max="10">\n</form>' },
  { id: 'uOjKthYLSuGf', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  <input type="range" name="points" min="0" max="10">
                                </form>
<hr>` },
  { id: 'SXc-86DtE2Hq', text: 'ইনপুট টাইপ Search', type: 'heading', level: 2, anchor: 'input-type-search' },
  { id: 'c8EvtwkEkEkm', type: 'richtext', html: '<p><code>&lt;input type="search"&gt;</code> সার্চ ফিল্ডের জন্য ব্যবহৃত হয় (একটি সার্চ ফিল্ড সাধারণ টেক্সট ফিল্ডের মতোই আচরণ করে)।</p>' },
  { id: 'k6o0SqXwSnPl', type: 'code', language: 'html', code: '<form>\n    Search Google:\n    <input type="search" name="googlesearch">\n</form>' },
  { id: '_vDsSJYLtgw8', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  Google-এ সার্চ করুন:
                                  <input type="search" name="googlesearch">
                                </form>
<hr>` },
  { id: 'Q2YoPFTk4ApW', text: 'ইনপুট টাইপ Tel', type: 'heading', level: 2, anchor: 'input-type-tel' },
  { id: 'Ftju_blnhgns', type: 'richtext', html: '<p><code>&lt;input type="tel"&gt;</code> এমন ইনপুট ফিল্ডের জন্য ব্যবহৃত হয়, যাতে একটি টেলিফোন নম্বর থাকা উচিত।</p>' },
  { id: 'JmIIao7bLF6U', type: 'code', language: 'html', code: '<form>\n    Telephone:\n    <input type="tel" name="phone" pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}">\n</form>' },
  { id: 'QL74e8jGILAj', type: 'richtext', html: `<p>${demoIntro}</p>
<form>
                                  টেলিফোন:
                                  <input type="tel" name="phone" pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}">
                                    <input type="submit">
                                    <span>ফরম্যাট: 1234-567-890</span>
                                </form>
<hr>` },
  { id: '7sQ4dXwOCqrt', text: 'ইনপুট টাইপ Time', type: 'heading', level: 2, anchor: 'input-type-time' },
  { id: 'yYX1d05ahQ6O', type: 'richtext', html: '<p><code>&lt;input type="time"&gt;</code> ব্যবহারকারীকে একটি সময় বেছে নেওয়ার সুযোগ দেয় (কোনো টাইম জোন থাকে না)।</p>\n<p>ব্রাউজার সমর্থনের উপর নির্ভর করে, ইনপুট ফিল্ডে একটি টাইম পিকার দেখা যেতে পারে।</p>' },
  { id: '2Dc3GeGN0drr', type: 'code', language: 'html', code: '<form>\n    Select a time:\n    <input type="time" name="usr_time">\n</form>' },
  { id: 'MeNaCz2XMzC4', type: 'richtext', html: `<p>${demoIntro}</p>
<form action="/action_page.php">
                                  একটি সময় বেছে নিন:
                                  <input type="time" name="usr_time">
                                  <input type="submit">
                                </form>
<p><b>মনে রাখবেন:</b> Safari অথবা Internet Explorer 12 এবং তার আগের ভার্সনে type="time" সমর্থিত নয়।</p>
<hr>` },
  { id: 'N5psAuaw7oeJ', text: 'ইনপুট টাইপ Url', type: 'heading', level: 2, anchor: 'input-type-url' },
  { id: 'LIkXjTvg2VHY', type: 'richtext', html: '<p><code>&lt;input type="url"&gt;</code> এমন ইনপুট ফিল্ডের জন্য ব্যবহৃত হয়, যাতে একটি URL ঠিকানা থাকা উচিত।</p>\n<p>ব্রাউজার সমর্থনের উপর নির্ভর করে, জমা দেওয়ার সময় url ফিল্ড স্বয়ংক্রিয়ভাবে ভ্যালিডেট হতে পারে।</p>\n<p>কিছু স্মার্টফোন url টাইপ শনাক্ত করে, এবং url ইনপুটের সাথে মিলিয়ে কিবোর্ডে ".com" যোগ করে।</p>' },
  { id: 'cb9M7KVb5wKf', type: 'code', language: 'html', code: '<form>\n    Add your homepage:\n    <input type="url" name="homepage">\n</form>' },
  { id: '0PdwyRPBSu1_', type: 'richtext', html: `<form action="">
                                    আপনার হোমপেজ যোগ করুন:
                                    <input type="url" name="homepage">
                                    <input type="submit">
                                </form>
<p><b>মনে রাখবেন:</b> IE9 এবং তার আগের ভার্সনে type="url" সমর্থিত নয়।</p>
<hr>` },
  { id: 'dZMCLIlLFBgu', text: 'ইনপুট টাইপ Week', type: 'heading', level: 2, anchor: 'input-type-week' },
  { id: 'tyAEAuW_Pxas', type: 'richtext', html: '<p><code>lt;&amp;input type="week"&gt;</code> ব্যবহারকারীকে একটি সপ্তাহ ও বছর বেছে নেওয়ার সুযোগ দেয়।</p>\n<p>ব্রাউজার সমর্থনের উপর নির্ভর করে, ইনপুট ফিল্ডে একটি ডেট পিকার দেখা যেতে পারে।</p>' },
  { id: 'Gxvah6o7cLE1', type: 'code', language: 'html', code: '<form>\n    Select a week:\n    <input type="week" name="week_year">\n</form>' },
  { id: 'AHXNW8_dJ1o6', type: 'richtext', html: `<form action="">
                                    একটি সপ্তাহ বেছে নিন:
                                    <input type="week" name="year_week">
                                    <input type="submit">
                                </form>
<p><b>মনে রাখবেন:</b> Firefox, Safari অথবা Internet Explorer 11 এবং তার আগের ভার্সনে type="week" সমর্থিত নয়।</p>` },
]

const toc = [
  { id: 'html-input-types', text: 'HTML ইনপুট টাইপ', level: 2 },
  { id: 'input-type-text', text: 'ইনপুট টাইপ Text', level: 2 },
  { id: 'input-type-password', text: 'ইনপুট টাইপ Password', level: 2 },
  { id: 'input-type-submit', text: 'ইনপুট টাইপ Submit', level: 2 },
  { id: 'input-type-reset', text: 'ইনপুট টাইপ Reset', level: 2 },
  { id: 'input-type-radio', text: 'ইনপুট টাইপ Radio', level: 2 },
  { id: 'input-type-checkbox', text: 'ইনপুট টাইপ Checkbox', level: 2 },
  { id: 'input-type-button', text: 'ইনপুট টাইপ Button', level: 2 },
  { id: 'html5-input-types', text: 'HTML5 ইনপুট টাইপ', level: 2 },
  { id: 'input-type-color', text: 'ইনপুট টাইপ Color', level: 2 },
  { id: 'input-type-date', text: 'ইনপুট টাইপ Date', level: 2 },
  { id: 'input-type-datetime-local', text: 'ইনপুট টাইপ Datetime-local', level: 2 },
  { id: 'input-type-email', text: 'ইনপুট টাইপ Email', level: 2 },
  { id: 'input-type-file', text: 'ইনপুট টাইপ File', level: 2 },
  { id: 'input-type-month', text: 'ইনপুট টাইপ Month', level: 2 },
  { id: 'input-type-number', text: 'ইনপুট টাইপ Number', level: 2 },
  { id: 'input-restrictions', text: 'ইনপুট রেস্ট্রিকশন', level: 2 },
  { id: 'input-type-range', text: 'ইনপুট টাইপ Range', level: 2 },
  { id: 'input-type-search', text: 'ইনপুট টাইপ Search', level: 2 },
  { id: 'input-type-tel', text: 'ইনপুট টাইপ Tel', level: 2 },
  { id: 'input-type-time', text: 'ইনপুট টাইপ Time', level: 2 },
  { id: 'input-type-url', text: 'ইনপুট টাইপ Url', level: 2 },
  { id: 'input-type-week', text: 'ইনপুট টাইপ Week', level: 2 },
]

const { error } = await supabase.from('doc_translations').upsert(
  { doc_id: DOC_ID, locale: 'bn', title, meta_title, meta_description, blocks, toc },
  { onConflict: 'doc_id,locale' }
)
if (error) { console.error(error); process.exit(1) }
console.log('form-input-types: 1/1 written')
