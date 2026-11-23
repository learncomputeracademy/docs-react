import Link from '@/components/hover-link'
import type { Locale } from '@/lib/types'

// /privacy and /bn/privacy (2026-11-21). Describes what the site actually does
// today: learning data in the visitor's browser only, GA4 analytics, Cloudflare
// + server logs, Cloudinary images, and optional Google/GitHub accounts
// (2026-11-21). Contact and name confirmed by the owner.
// Keep both languages in step when editing.

const UPDATED = { en: '21 November 2026', bn: '২১ নভেম্বর ২০২৬' }
const EMAIL = 'info@learncomputer.in'

type Section = { h: string; p: React.ReactNode[] }

function sections(locale: Locale, prefix: string): Section[] {
  const mail = <a href={`mailto:${EMAIL}`} className="font-medium text-primary underline-offset-4 hover:underline">{EMAIL}</a>
  const account = (label: string) => <Link href={`${prefix}/account`} className="font-medium text-primary underline-offset-4 hover:underline">{label}</Link>
  if (locale === 'bn') {
    return [
      { h: 'আমরা কারা', p: [<>এই সাইট (docs.learncomputer.in) চালায় লার্ন কম্পিউটার একাডেমি, হাবড়া, পশ্চিমবঙ্গ, ভারত। এই নীতি জানায় সাইটটি কী তথ্য ব্যবহার করে, কেন করে, আর আপনার কী কী অধিকার আছে।</>] },
      { h: 'আপনার ব্রাউজারে যা থাকে (আমাদের কাছে আসে না)', p: [
        <>আপনার পাঠের অগ্রগতি, কুইজের স্কোর, XP, স্ট্রিক, ব্যাজ, শেষ পড়া পাঠ, নোট, টাইপিং টেস্টের ইতিহাস আর টুলের সেটিংস শুধু আপনার ডিভাইসের ব্রাউজারে (localStorage) সেভ থাকে। এগুলো আমাদের সার্ভারে পাঠানো হয় না, আর আমরা দেখতে পাই না।</>,
        <>{account('আমার অ্যাকাউন্ট')} পাতা থেকে আপনি যেকোনো সময় এই তথ্য ডাউনলোড করতে বা মুছে ফেলতে পারেন। ব্রাউজারের ডেটা ক্লিয়ার করলেও এগুলো মুছে যায়।</>,
        <>সাইন ইন না করলে আমরা আপনার নাম, ইমেল বা ফোন নম্বর সংগ্রহ করি না।</>,
      ] },
      { h: 'ঐচ্ছিক অ্যাকাউন্ট (Google বা GitHub দিয়ে সাইন ইন)', p: [
        <>সাইন ইন করা ঐচ্ছিক। করলে Google বা GitHub আমাদের আপনার নাম, ইমেল ঠিকানা আর প্রোফাইল ছবি দেয়। আমরা আপনার password কখনো দেখি না।</>,
        <>সাইন ইন করলে আপনার শেখার তথ্য (শেষ করা পাঠ, কুইজের ফল, স্ট্রিক, শেষ পড়া পাঠ, দেখা ব্যাজ আর টাইপিং টেস্টের ফল) আর আপনার লাইট/ডার্ক থিমের পছন্দ আমাদের ডেটাবেসে (Supabase) আপনার অ্যাকাউন্টে সেভ হয়, যাতে সব ডিভাইসে মিলে থাকে। এগুলো শুধু আপনিই দেখতে পারেন; নোট আর অন্য টুলের সেটিংস ব্রাউজারেই থাকে।</>,
        <>এই তথ্য শুধু আপনার অগ্রগতি সেভ রাখতে ব্যবহার হয়। আমরা এটা বিক্রি করি না, বিজ্ঞাপনে ব্যবহার করি না, আর Google Analytics-এর সাথে যুক্ত করি না।</>,
        <>{account('আমার অ্যাকাউন্ট')} পাতা থেকে আপনি যেকোনো সময় অ্যাকাউন্টের তথ্য মুছে ফেলতে বা পুরো অ্যাকাউন্টটাই মুছে ফেলতে পারেন। মুছলে তা আমাদের ডেটাবেস থেকে সঙ্গে সঙ্গে সরে যায়।</>,
      ] },
      { h: 'অ্যানালিটিক্স (Google Analytics)', p: [
        <>সাইটটি কীভাবে ব্যবহার হচ্ছে বুঝতে আমরা Google Analytics 4 ব্যবহার করি: কোন পাতা দেখা হচ্ছে, কোন ডিভাইস বা ব্রাউজার, আনুমানিক দেশ/শহর, আর কুইজ শেষ হলে তার ফল (কোন পাঠ, স্কোর, পাস না ফেল)। এতে আপনার নাম বা যোগাযোগের তথ্য থাকে না।</>,
        <>Google Analytics আপনার ব্রাউজারে কুকি রাখে। চাইলে ব্রাউজারের সেটিংসে কুকি ব্লক করতে বা Google-এর Analytics opt-out add-on ব্যবহার করতে পারেন; তাতেও সাইট স্বাভাবিকভাবে চলবে।</>,
      ] },
      { h: 'সার্ভার আর নিরাপত্তা লগ', p: [
        <>সাইটটি Cloudflare-এর মাধ্যমে পরিবেশিত হয় এবং আমাদের নিজস্ব সার্ভারে চলে। প্রতিটি অনুরোধে আপনার IP অ্যাড্রেস, ব্রাউজারের ধরন আর দেখা পাতার ঠিকানা লগে থাকে। আমরা এটি নিরাপত্তা, অপব্যবহার ঠেকাতে আর মোট ভিজিটরের পরিসংখ্যানের জন্য ব্যবহার করি, কাউকে আলাদা করে চিহ্নিত করতে নয়।</>,
      ] },
      { h: 'অন্য পরিষেবা', p: [
        <>পাঠের ছবিগুলো Cloudinary থেকে আসে, তাই ছবি লোড করার সময় আপনার ব্রাউজার Cloudinary-র সাথে যোগাযোগ করে। পাঠের লেখা একটি ডেটাবেস (Supabase) থেকে আসে; সেখানে ভিজিটরদের কোনো ব্যক্তিগত তথ্য রাখা হয় না।</>,
        <>আমরা কোনো তথ্য বিক্রি করি না, আর বিজ্ঞাপনের জন্য ব্যবহার করি না।</>,
      ] },
      { h: 'শিশু ও কিশোর-কিশোরী', p: [
        <>এই সাইট সব বয়সের শিক্ষার্থীর জন্য খোলা। সাইন ইন না করেও সব পাঠ আর টুল ব্যবহার করা যায়, কোনো ব্যক্তিগত তথ্য দিতে হয় না। ১৮ বছরের কম বয়সী হলে অভিভাবকের অনুমতি নিয়েই অ্যাকাউন্ট খুলুন।</>,
      ] },
      { h: 'আপনার অধিকার', p: [
        <>ভারতের ডিজিটাল ব্যক্তিগত ডেটা সুরক্ষা আইন, ২০২৩ অনুযায়ী আপনি আপনার তথ্য সম্পর্কে জানতে, সংশোধন করতে বা মুছে ফেলতে বলতে পারেন, আর অভিযোগ জানাতে পারেন। আপনার ব্রাউজার আর অ্যাকাউন্টের তথ্য আপনি নিজেই {account('আমার অ্যাকাউন্ট')} পাতা থেকে ডাউনলোড, মুছে ফেলা বা অ্যাকাউন্ট মুছে ফেলতে পারেন।</>,
        <>অন্য কোনো অনুরোধ বা অভিযোগের জন্য আমাদের ইমেল করুন: {mail}। আমরা যত দ্রুত সম্ভব উত্তর দেব। আমাদের উত্তরে সন্তুষ্ট না হলে আপনি ভারতের ডেটা সুরক্ষা বোর্ডে অভিযোগ জানাতে পারেন।</>,
      ] },
      { h: 'এই নীতির পরিবর্তন', p: [
        <>সাইটে নতুন কিছু যোগ হলে এই পাতা আপডেট করা হবে, আর উপরের তারিখ বদলাবে।</>,
      ] },
      { h: 'যোগাযোগ', p: [<>লার্ন কম্পিউটার একাডেমি, হাবড়া, পশ্চিমবঙ্গ, ভারত। ইমেল: {mail}</>] },
    ]
  }
  return [
    { h: 'Who we are', p: [<>This site (docs.learncomputer.in) is run by Learn Computer Academy, Habra, West Bengal, India. This policy explains what information the site uses, why, and what your rights are.</>] },
    { h: 'What stays in your browser (never sent to us)', p: [
      <>Your lesson progress, quiz scores, XP, streak, badges, last lesson read, notes, typing-test history and tool settings are saved only in your device&rsquo;s browser (localStorage). They are not sent to our servers and we cannot see them.</>,
      <>You can download or clear this data at any time from {account('My account')}. Clearing your browser data also removes it.</>,
      <>If you do not sign in, we do not collect your name, email address or phone number.</>,
    ] },
    { h: 'Optional accounts (sign in with Google or GitHub)', p: [
      <>Signing in is optional. If you do, Google or GitHub gives us your name, email address and profile picture. We never see your password.</>,
      <>When you are signed in, your learning data (lessons completed, quiz results, streak, last lesson read, badges seen and typing test results) and your light/dark theme choice are saved to your account in our database (Supabase) so it stays in step across your devices. Only you can read it; notes and other tools&rsquo; settings stay in your browser.</>,
      <>We use this data only to keep your progress. We do not sell it, use it for advertising, or link it to Google Analytics.</>,
      <>You can clear your account data, or delete your whole account, at any time from {account('My account')}. Deleting removes it from our database straight away.</>,
    ] },
    { h: 'Analytics (Google Analytics)', p: [
      <>We use Google Analytics 4 to understand how the site is used: which pages are viewed, device and browser type, approximate country or city, and the result when a quiz is finished (which lesson, the score, pass or fail). This does not include your name or contact details.</>,
      <>Google Analytics sets cookies in your browser. You can block cookies in your browser settings or use Google&rsquo;s Analytics opt-out add-on; the site keeps working normally.</>,
    ] },
    { h: 'Server and security logs', p: [
      <>The site is delivered through Cloudflare and runs on our own server. Each request logs your IP address, browser type and the page address. We use these logs for security, to stop abuse, and for overall visitor statistics, not to identify individuals.</>,
    ] },
    { h: 'Other services', p: [
      <>Lesson images are served by Cloudinary, so your browser connects to Cloudinary when it loads them. Lesson text comes from a database (Supabase) that holds no personal information about visitors.</>,
      <>We do not sell any data and do not use it for advertising.</>,
    ] },
    { h: 'Children and teenagers', p: [
      <>The site is open to learners of every age. Every lesson and tool works without signing in, so no personal information is needed to learn here. If you are under 18, please create an account only with a parent&rsquo;s or guardian&rsquo;s permission.</>,
    ] },
    { h: 'Your rights', p: [
      <>Under India&rsquo;s Digital Personal Data Protection Act, 2023, you can ask to know about, correct or erase your data, and you can raise a grievance. You can download or clear your data, and delete your account, yourself from {account('My account')}.</>,
      <>For any other request or complaint, email us at {mail}. We will reply as soon as we can. If you are not satisfied with our answer, you can complain to the Data Protection Board of India.</>,
    ] },
    { h: 'Changes to this policy', p: [
      <>When the site adds something new, this page will be updated and the date above will change.</>,
    ] },
    { h: 'Contact', p: [<>Learn Computer Academy, Habra, West Bengal, India. Email: {mail}</>] },
  ]
}

export function PrivacyContent({ locale }: { locale: Locale }) {
  const prefix = locale === 'bn' ? '/bn' : ''
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{locale === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy policy'}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{locale === 'bn' ? 'সর্বশেষ আপডেট' : 'Last updated'}: {UPDATED[locale]}</p>
      <div className="mt-8 space-y-8">
        {sections(locale, prefix).map((sec) => (
          <section key={sec.h}>
            <h2 className="text-xl font-semibold">{sec.h}</h2>
            <div className="mt-2 space-y-3 leading-relaxed text-muted-foreground">
              {sec.p.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
