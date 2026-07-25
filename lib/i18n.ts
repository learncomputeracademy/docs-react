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
    freeLessonsSubjects: (n: number) => `${n} free lessons, 7 subjects`,
    heroTitle1: 'Learn to build ',
    heroTitle2: 'for the web',
    heroSub: 'Free lessons on HTML, CSS, JavaScript, React, and graphic design — with runnable examples, for absolutely anyone.',
    footer: (year: number) => `© ${year} Learn Computer Academy. Free to use, for everyone.`,
    notTranslatedBanner: 'This lesson isn’t translated into Bengali yet — showing the English version.',
    toggleTheme: 'Toggle theme',
    languageSwitchTo: 'বাংলা',
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
    freeLessonsSubjects: (n: number) => `${n}টি ফ্রি পাঠ, ৭টি বিষয়`,
    heroTitle1: 'ওয়েবের জন্য ',
    heroTitle2: 'তৈরি করা শিখুন',
    heroSub: 'HTML, CSS, JavaScript, React এবং গ্রাফিক ডিজাইনের ফ্রি পাঠ — রান করার মতো উদাহরণসহ, সবার জন্য।',
    footer: (year: number) => `© ${year} লার্ন কম্পিউটার একাডেমি। সবার জন্য সম্পূর্ণ ফ্রি।`,
    notTranslatedBanner: 'এই পাঠটি এখনও বাংলায় অনুবাদ করা হয়নি — ইংরেজি সংস্করণ দেখানো হচ্ছে।',
    toggleTheme: 'থিম পরিবর্তন করুন',
    languageSwitchTo: 'English',
  },
} as const satisfies Record<Locale, Record<string, string | ((n: number) => string)>>

export function t(locale: Locale) {
  return STRINGS[locale]
}

// /css/intro <-> /bn/css/intro
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.replace(/^\/?(bn\/)?/, '/')
  return locale === 'bn' ? `/bn${clean}` : clean
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === '/bn' || pathname.startsWith('/bn/') ? 'bn' : 'en'
}
