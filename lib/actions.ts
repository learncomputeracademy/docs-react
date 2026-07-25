'use server'

import { searchDocs } from './content'

export async function searchAction(query: string) {
  if (query.trim().length < 2) return []
  return searchDocs(query)
}
