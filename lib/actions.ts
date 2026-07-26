'use server'

import { searchDocs, getSidebarTree } from './content'
import type { Locale } from './types'

export async function searchAction(query: string) {
  if (query.trim().length < 2) return []
  return searchDocs(query)
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
