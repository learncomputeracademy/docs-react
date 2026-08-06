'use server'

import { getSearchIndex, getSidebarTree } from './content'
import type { Locale } from './types'

// Fetched once per locale on CommandMenu mount, not per keystroke — cmdk's
// own fuzzy filter does the actual matching client-side. lib/tools-index.ts
// (a plain, no-'use server' module) is merged in on the client directly,
// since it's static data with no DB involved.
export async function searchIndexAction(locale: Locale) {
  return getSearchIndex(locale)
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
