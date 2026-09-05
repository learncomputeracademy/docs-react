import type { Locale } from './types'

export const WP_TEMPLATE_HIERARCHY_STRINGS = {
  en: {
    title: 'WordPress Template Hierarchy Visualizer',
    subtitle: 'Pick a request type, then check or uncheck files to see exactly which one WordPress would actually load.',
    lessonCta: 'Template Hierarchy lesson',
    requestType: 'Request Type',
    chain: 'File Search Order',
    chainHint: 'WordPress checks these files top to bottom and uses the first one that exists in the theme. index.php always exists — it\'s the one truly required template.',
    exists: 'exists in theme?',
    winner: 'WordPress would load this',
    notFound: 'not in theme',
    resetAll: 'Check all',
    uncheckAll: 'Uncheck all (except index.php)',
    placeholderNote: 'Curly-brace parts like {slug} or {post-type} are stand-ins WordPress fills in from the actual request — {slug} for a page named "about" becomes page-about.php.',
  },
  bn: {
    title: 'WordPress Template Hierarchy ভিজুয়ালাইজার',
    subtitle: 'একটা request type বেছে নিন, তারপর file check/uncheck করে দেখুন WordPress আসলে কোনটা load করবে।',
    lessonCta: 'Template Hierarchy পাঠ',
    requestType: 'Request Type',
    chain: 'File খোঁজার Order',
    chainHint: 'WordPress এই file গুলো উপর থেকে নিচে check করে আর theme-এ যেটা প্রথম পাওয়া যায় সেটাই ব্যবহার করে। index.php সবসময় থাকে — এটাই একমাত্র সত্যিকারের প্রয়োজনীয় template।',
    exists: 'theme-এ আছে?',
    winner: 'WordPress এটা load করবে',
    notFound: 'theme-এ নেই',
    resetAll: 'সব check করুন',
    uncheckAll: 'সব uncheck করুন (index.php বাদে)',
    placeholderNote: '{slug} বা {post-type}-এর মতো curly-brace অংশগুলো WordPress আসল request থেকে নিজে বসিয়ে দেয় — "about" নামের একটা page-এর জন্য {slug} হয়ে যায় page-about.php।',
  },
} as const

export function wths(locale: Locale) {
  return WP_TEMPLATE_HIERARCHY_STRINGS[locale]
}
