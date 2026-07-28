import type { Locale } from './types'

// Static, hand-maintained list — these tools aren't in Supabase (see
// docs/TOOLS.md: tools are code, not content), so this index is just a
// literal array, updated here whenever a tool ships or docs/TOOLS.md's
// "Built" table changes. Icon is a lucide-react component name, resolved
// in the index component rather than imported here to keep this file
// framework-agnostic (plain data).
export type ToolEntry = {
  slug: string
  icon: 'Box' | 'Layers' | 'Palette' | 'LayoutGrid' | 'MousePointer2' | 'Ruler' | 'Contrast'
  name: string
  description: string
  lessonHref: string | null
}

export const TOOLS_INDEX_STRINGS = {
  en: {
    title: 'Tools',
    subtitle:
      'Interactive apps for the CSS you can’t learn from a screenshot. Each one is linked from the lesson it teaches where one exists, explains itself as you use it, and works fully in Bengali.',
    openTool: 'Open',
    tools: [
      {
        slug: 'box-model',
        icon: 'Box',
        name: 'Interactive Box Model',
        description: 'Drag padding, border and margin and watch a 300px box become 360px — then flip to border-box and watch it snap back.',
        lessonHref: '/css/boxmodel',
      },
      {
        slug: 'box-shadow-generator',
        icon: 'Layers',
        name: 'Box Shadow Generator',
        description: 'Stack multiple shadow layers, drag directly on the shape, compare box-shadow against filter: drop-shadow().',
        lessonHref: null,
      },
      {
        slug: 'gradient',
        icon: 'Palette',
        name: 'Gradient Generator',
        description: 'Linear, radial and conic gradients with unlimited stops — see sRGB vs OKLCH interpolation compared side by side.',
        lessonHref: null,
      },
      {
        slug: 'flexbox',
        icon: 'LayoutGrid',
        name: 'Flexbox Playground',
        description: 'Every container and item property, live. Watch order change what you see without touching the HTML.',
        lessonHref: null,
      },
      {
        slug: 'scrollbar',
        icon: 'MousePointer2',
        name: 'Scrollbar App',
        description: 'Style every part of a scrollbar — track, thumb, corner, buttons — with an honest note on which browsers support what.',
        lessonHref: '/css/pseudo-elements',
      },
      {
        slug: 'specificity',
        icon: 'Ruler',
        name: 'CSS Specificity Calculator',
        description: 'Paste a selector, see its (a, b, c) weight broken down and colour-coded. Compare two selectors to see which wins.',
        lessonHref: '/css/specificity',
      },
      {
        slug: 'colour',
        icon: 'Contrast',
        name: 'Colour & Contrast Studio',
        description: 'Build a palette from one colour, check WCAG AA/AAA contrast, preview how it looks under colour blindness.',
        lessonHref: '/css/colors',
      },
    ] as ToolEntry[],
  },
  bn: {
    title: 'টুলস',
    subtitle:
      'যে CSS একটা স্ক্রিনশট থেকে শেখা যায় না, তার জন্য ইন্টারঅ্যাক্টিভ অ্যাপ। প্রতিটি যেখানে সম্ভব সেই পাঠের সাথে যুক্ত যা এটি শেখায়, ব্যবহারের সময় নিজেই ব্যাখ্যা দেয়, আর সম্পূর্ণ বাংলায় কাজ করে।',
    openTool: 'খুলুন',
    tools: [
      {
        slug: 'box-model',
        icon: 'Box',
        name: 'ইন্টারঅ্যাক্টিভ বক্স মডেল',
        description: 'padding, border আর margin টেনে দেখুন কীভাবে ৩০০px-এর বাক্স ৩৬০px হয়ে যায় — তারপর border-box-এ বদলে দেখুন সেটা ঠিক হয়ে যায়।',
        lessonHref: '/css/boxmodel',
      },
      {
        slug: 'box-shadow-generator',
        icon: 'Layers',
        name: 'বক্স শ্যাডো জেনারেটর',
        description: 'একাধিক শ্যাডো লেয়ার সাজান, shape-এর উপর সরাসরি টেনে দেখুন, box-shadow-কে filter: drop-shadow()-এর সাথে তুলনা করুন।',
        lessonHref: null,
      },
      {
        slug: 'gradient',
        icon: 'Palette',
        name: 'গ্রেডিয়েন্ট জেনারেটর',
        description: 'অসীম স্টপসহ linear, radial আর conic গ্রেডিয়েন্ট — sRGB বনাম OKLCH interpolation পাশাপাশি দেখুন।',
        lessonHref: null,
      },
      {
        slug: 'flexbox',
        icon: 'LayoutGrid',
        name: 'ফ্লেক্সবক্স প্লেগ্রাউন্ড',
        description: 'প্রতিটি কন্টেইনার আর আইটেম প্রপার্টি, লাইভ। দেখুন order আসল HTML স্পর্শ না করেই যা দেখছেন তা বদলে দেয়।',
        lessonHref: null,
      },
      {
        slug: 'scrollbar',
        icon: 'MousePointer2',
        name: 'স্ক্রলবার অ্যাপ',
        description: 'স্ক্রলবারের প্রতিটি অংশ স্টাইল করুন — track, thumb, corner, buttons — কোন ব্রাউজার কী সাপোর্ট করে তার honest নোটসহ।',
        lessonHref: '/css/pseudo-elements',
      },
      {
        slug: 'specificity',
        icon: 'Ruler',
        name: 'CSS স্পেসিফিসিটি ক্যালকুলেটর',
        description: 'একটি সিলেক্টর পেস্ট করুন, তার (a, b, c) ওজন ভেঙে রং-কোডেড দেখুন। দুটো সিলেক্টর তুলনা করে দেখুন কোনটা জেতে।',
        lessonHref: '/css/specificity',
      },
      {
        slug: 'colour',
        icon: 'Contrast',
        name: 'কালার ও কনট্রাস্ট স্টুডিও',
        description: 'একটি রং থেকে প্যালেট তৈরি করুন, WCAG AA/AAA কনট্রাস্ট যাচাই করুন, colour blindness-এ কেমন দেখায় তা প্রিভিউ করুন।',
        lessonHref: '/css/colors',
      },
    ] as ToolEntry[],
  },
} as const

export function tis(locale: Locale) {
  return TOOLS_INDEX_STRINGS[locale]
}
