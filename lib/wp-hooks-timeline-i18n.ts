import type { Locale } from './types'

export const WP_HOOKS_TIMELINE_STRINGS = {
  en: {
    title: 'WordPress Hooks Timeline',
    subtitle: 'The order the common action hooks actually fire during a typical front-end page load. Click any hook for what it\'s for.',
    lessonCta: 'Hooks — Actions and Filters lesson',
    actionsTitle: 'Action Hooks — Fixed Order, Every Page Load',
    actionsHint: 'Not the full list — the WordPress core Hook Reference on developer.wordpress.org has every one. This is the common, stable sequence worth knowing by heart.',
    filtersTitle: 'A Few Common Filters (fire on demand, not on this fixed timeline)',
    filtersHint: 'Filters run whenever the relevant template tag is called, not at one fixed point in the page load — so they sit outside the timeline above rather than inside it.',
    play: 'Play',
    pause: 'Pause',
    prev: 'Prev',
    next: 'Next',
    reset: 'Reset',
    snippet: 'Example code for the selected hook',
    copy: 'Copy',
    copied: 'Copied',
    refTitle: 'Hook Reference — By Category',
    refHint: 'These fire on their own trigger — a save, a login, an admin page load — not at one fixed point in every request, so they\'re grouped by category instead of a single sequence.',
    action: 'Action',
    filter: 'Filter',
    selectAHook: 'Select a hook to see its details.',
  },
  bn: {
    title: 'WordPress Hooks টাইমলাইন',
    subtitle: 'একটা সাধারণ front-end page load-এ common action hook গুলো আসলে যে order-এ fire করে। যেকোনো hook click করে দেখুন এটা কীসের জন্য।',
    lessonCta: 'Hooks — Actions ও Filters পাঠ',
    actionsTitle: 'Action Hooks — নির্দিষ্ট Order, প্রতিটা Page Load-এ',
    actionsHint: 'পুরো লিস্ট না — developer.wordpress.org-এর WordPress core Hook Reference-এ প্রতিটা আছে। এটা common, স্থিতিশীল sequence যা মুখস্থ রাখার মতো।',
    filtersTitle: 'কয়েকটা common Filter (demand অনুযায়ী fire করে, এই fixed timeline-এ না)',
    filtersHint: 'সংশ্লিষ্ট template tag কল হলেই filter চলে, page load-এর কোনো fixed জায়গায় না — তাই এগুলো উপরের timeline-এর ভেতরে না, বাইরে থাকে।',
    play: 'Play',
    pause: 'Pause',
    prev: 'আগের',
    next: 'পরের',
    reset: 'Reset',
    snippet: 'বাছাই করা hook-এর উদাহরণ কোড',
    copy: 'কপি',
    copied: 'কপি হয়েছে',
    refTitle: 'Hook Reference — Category অনুযায়ী',
    refHint: 'এগুলো নিজের trigger-এ fire করে — একটা save, একটা login, একটা admin page load — প্রতিটা request-এর কোনো fixed জায়গায় না, তাই এগুলো একটা single sequence-এর বদলে category অনুযায়ী গ্রুপ করা।',
    action: 'Action',
    filter: 'Filter',
    selectAHook: 'ডিটেইল দেখতে একটা hook বেছে নিন।',
  },
} as const

export function whts(locale: Locale) {
  return WP_HOOKS_TIMELINE_STRINGS[locale]
}
