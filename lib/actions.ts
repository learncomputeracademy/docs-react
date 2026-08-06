'use server'

import { searchDocs, getSidebarTree } from './content'
import type { Locale } from './types'

// The interactive /tools/* pages (Box Model, Flexbox Playground, etc.)
// aren't rows in `docs` — they're static app routes — so searchDocs()
// alone can never surface them. A learner searching "flexbox" got "No
// lessons found" even though the Flexbox Playground exists, because no
// lesson happens to use that exact word. Small fixed list, matched here
// rather than added to the docs table, since these aren't content rows and
// don't belong in a content search index.
const TOOLS: { en: string; bn: string | null; url: string; keywords: string[] }[] = [
  { en: 'Box Model Demo', bn: 'বক্স মডেল ডেমো', url: 'tools/box-model', keywords: ['box model', 'padding', 'margin', 'border'] },
  { en: 'Box Shadow Generator', bn: 'বক্স শ্যাডো জেনারেটর', url: 'tools/box-shadow-generator', keywords: ['box shadow', 'shadow'] },
  { en: 'Gradient Generator', bn: 'গ্রেডিয়েন্ট জেনারেটর', url: 'tools/gradient', keywords: ['gradient', 'linear-gradient', 'radial-gradient'] },
  { en: 'Flexbox Playground', bn: 'ফ্লেক্সবক্স প্লেগ্রাউন্ড', url: 'tools/flexbox', keywords: ['flexbox', 'flex', 'justify-content', 'align-items'] },
  { en: 'Grid Generator', bn: null, url: 'tools/grid', keywords: ['grid', 'css grid', 'grid-template'] },
  { en: 'Colour & Contrast Studio', bn: null, url: 'tools/colour', keywords: ['colour', 'color', 'contrast', 'accessibility', 'a11y', 'wcag'] },
  { en: 'Scrollbar Styler', bn: 'স্ক্রলবার স্টাইলার', url: 'tools/scrollbar', keywords: ['scrollbar'] },
  { en: 'CSS Specificity Calculator', bn: null, url: 'tools/specificity', keywords: ['specificity', 'css specificity'] },
]

function searchTools(query: string, locale: Locale) {
  const q = query.trim().toLowerCase()
  return TOOLS.filter((tool) => {
    const title = (locale === 'bn' ? tool.bn ?? tool.en : tool.en).toLowerCase()
    return title.includes(q) || tool.keywords.some((k) => k.includes(q) || q.includes(k))
  }).map((tool) => ({
    id: `tool-${tool.url}`,
    path: tool.url,
    title: locale === 'bn' ? tool.bn ?? tool.en : tool.en,
    meta_description: null as string | null,
    kind: 'tool' as const,
  }))
}

export async function searchAction(query: string, locale: Locale = 'en') {
  if (query.trim().length < 2) return []
  const [docs, tools] = await Promise.all([searchDocs(query), Promise.resolve(searchTools(query, locale))])
  // Tools first: a query matching a tool by name/keyword is usually higher
  // intent ("flexbox" → the playground) than a lesson that merely mentions
  // the word in passing.
  return [
    ...tools,
    ...docs.map((d) => ({ ...d, kind: 'doc' as const })),
  ]
}

// Same "first lesson" linking as the homepage subject cards — category
// index pages don't exist yet (see docs/PROGRESS.md), so a category in the
// command menu jumps straight to its first lesson.
export async function categoriesAction(locale: Locale) {
  const categories = await getSidebarTree(locale)
  return categories
    .filter(c => c.docs[0])
    .map(c => ({ slug: c.slug, title: c.title, firstPath: c.docs[0].path, count: c.docs.length }))
}
