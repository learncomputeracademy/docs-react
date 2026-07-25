// All content access goes through here. Pages never call Supabase directly.
// This is the mandatory choke point — see CLAUDE.md §4.
import { createClient } from './supabase/server'
import type { Category, Doc } from './types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*, docs(count)')
    .order('sort_order')
  if (error) throw error
  return (data as Category[]) ?? []
}

export async function getCategoryDocs(categorySlug: string): Promise<Doc[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .select('id, slug, path, title, sort_order, category:categories(slug, title)')
    .eq('status', 'published')
    .eq('categories.slug', categorySlug)
    .order('sort_order')
  if (error) throw error
  return (data as unknown as Doc[]) ?? []
}

export async function getDoc(path: string): Promise<Doc | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .select('*, category:categories(slug, title)')
    .eq('path', path)
    .eq('status', 'published')
    .single()
  if (error) return null
  return data as unknown as Doc
}

export async function searchDocs(query: string): Promise<Pick<Doc, 'id' | 'path' | 'title' | 'meta_description'>[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .select('id, path, title, meta_description')
    .eq('status', 'published')
    .textSearch('search_vector', query, { type: 'websearch' })
    .limit(20)
  if (error) throw error
  return data ?? []
}

export async function getAllDocPaths(): Promise<{ path: string }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .select('path')
    .eq('status', 'published')
  if (error) throw error
  return data ?? []
}
