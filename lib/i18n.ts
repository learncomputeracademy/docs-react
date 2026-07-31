import type { Locale } from './types'

// UI chrome strings only — lesson content translations live in
// doc_translations, not here. Keep this to nav/button/label text.
export const STRINGS = {
  en: {
    siteName: 'Learn Computer Academy',
    startLearning: 'Start learning',
    browseSubjects: 'Browse subjects',
    pickASubject: 'Pick a subject',
    pickASubjectSub: 'Jump straight into any topic — no prerequisites enforced.',
    lesson: 'lesson',
    lessons: 'lessons',
    onThisPage: 'On this page',
    freeLessonsSubjects: (lessons: number, subjects: number) => `${lessons} lessons across ${subjects} subjects`,
    heroTitle1: 'Design, code, ',
    heroTitle2: 'build your future.',
    heroSub: 'From computer basics and graphic design to HTML, CSS, JavaScript, React, PHP, Python, SQL, WordPress, and AI — with runnable examples, for absolutely anyone.',
    aboutBandTitle: 'From the team behind Learn Computer Academy',
    aboutBandBody: 'A hands-on training institute in Habra, West Bengal. This site brings the same lessons online — open to anyone, anywhere, at no cost.',
    aboutBandCta: 'Visit learncomputer.in',
    footer: (year: number) => `© ${year} Learn Computer Academy.`,
    notTranslatedBanner: 'This lesson isn’t translated into Bengali yet — showing the English version.',
    toggleTheme: 'Toggle theme',
    languageSwitchTo: 'বাংলা',
    previous: 'Previous',
    next: 'Next',
    browseLessons: 'Browse lessons',
    menu: 'Menu',
  },
  bn: {
    siteName: 'লার্ন কম্পিউটার একাডেমি',
    startLearning: 'শেখা শুরু করুন',
    browseSubjects: 'বিষয় দেখুন',
    pickASubject: 'একটি বিষয় বেছে নিন',
    pickASubjectSub: 'যেকোনো টপিক থেকে সরাসরি শুরু করুন — কোনো পূর্বশর্ত নেই।',
    lesson: 'পাঠ',
    lessons: 'পাঠ',
    onThisPage: 'এই পাতায়',
    freeLessonsSubjects: (lessons: number, subjects: number) => `${lessons}টি পাঠ, ${subjects}টি বিষয়ে`,
    heroTitle1: 'ডিজাইন, কোড, ',
    heroTitle2: 'নিজের ভবিষ্যৎ গড়ুন।',
    heroSub: 'কম্পিউটার বেসিক্স ও গ্রাফিক ডিজাইন থেকে শুরু করে HTML, CSS, JavaScript, React, PHP, Python, SQL, WordPress এবং AI পর্যন্ত — রান করার মতো উদাহরণসহ, সবার জন্য।',
    aboutBandTitle: 'লার্ন কম্পিউটার একাডেমির টিমের একটি উদ্যোগ',
    aboutBandBody: 'হাবরা, পশ্চিমবঙ্গের একটি হাতে-কলমে প্রশিক্ষণ কেন্দ্র। একই পাঠ এখন অনলাইনে পাওয়া যায় — সবার জন্য, যেকোনো জায়গা থেকে, বিনামূল্যে।',
    aboutBandCta: 'learncomputer.in দেখুন',
    footer: (year: number) => `© ${year} লার্ন কম্পিউটার একাডেমি।`,
    notTranslatedBanner: 'এই পাঠটি এখনও বাংলায় অনুবাদ করা হয়নি — ইংরেজি সংস্করণ দেখানো হচ্ছে।',
    toggleTheme: 'থিম পরিবর্তন করুন',
    languageSwitchTo: 'English',
    previous: 'পূর্ববর্তী',
    next: 'পরবর্তী',
    browseLessons: 'পাঠ ব্রাউজ করুন',
    menu: 'মেনু',
  },
} as const satisfies Record<Locale, Record<string, string | ((...args: number[]) => string)>>

export function t(locale: Locale) {
  return STRINGS[locale]
}

// /css/intro <-> /bn/css/intro
export function localizedPath(path: string, locale: Locale): string {
  const withoutLocale = path.replace(/^\/bn(?=\/|$)/, '') || '/'
  if (locale === 'bn') return withoutLocale === '/' ? '/bn' : `/bn${withoutLocale}`
  return withoutLocale
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === '/bn' || pathname.startsWith('/bn/') ? 'bn' : 'en'
}
