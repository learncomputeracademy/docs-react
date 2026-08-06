import type { Locale } from './types'

// The interactive /tools/* pages (Box Model, Flexbox Playground, etc.)
// aren't rows in `docs` — they're static app routes — so they'd never show
// up in a docs-table-driven search index. Small fixed list instead, merged
// into CommandMenu's client-side search index directly alongside lessons.
// No 'use server' here on purpose — this is plain static data, safe to
// import straight into the client component with zero network cost.
const TOOLS: { en: string; bn: string | null; url: string }[] = [
  { en: 'Box Model Demo', bn: 'বক্স মডেল ডেমো', url: 'tools/box-model' },
  { en: 'Box Shadow Generator', bn: 'বক্স শ্যাডো জেনারেটর', url: 'tools/box-shadow-generator' },
  { en: 'Gradient Generator', bn: 'গ্রেডিয়েন্ট জেনারেটর', url: 'tools/gradient' },
  { en: 'Flexbox Playground', bn: 'ফ্লেক্সবক্স প্লেগ্রাউন্ড', url: 'tools/flexbox' },
  { en: 'Grid Generator', bn: null, url: 'tools/grid' },
  { en: 'Colour & Contrast Studio', bn: null, url: 'tools/colour' },
  { en: 'Scrollbar Styler', bn: 'স্ক্রলবার স্টাইলার', url: 'tools/scrollbar' },
  { en: 'CSS Specificity Calculator', bn: null, url: 'tools/specificity' },
]

export function localizedTools(locale: Locale) {
  return TOOLS.map((tool) => ({
    path: tool.url,
    title: locale === 'bn' ? (tool.bn ?? tool.en) : tool.en,
    description: null as string | null,
  }))
}
