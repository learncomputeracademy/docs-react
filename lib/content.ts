// All content access goes through here. Pages never call Supabase directly.
// This is the mandatory choke point — see CLAUDE.md §4.
import { createClient } from './supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
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

export type SidebarCategory = Omit<Category, 'docs'> & {
  docs: Pick<Doc, 'slug' | 'path' | 'title' | 'sort_order'>[]
}

// Persistent sidebar needs every category with its docs in one shot, not
// fetched per-category — that's what a "fixed syllabus sidebar" is.
export async function getSidebarTree(): Promise<SidebarCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*, docs(slug, path, title, sort_order, status)')
    .order('sort_order')
  if (error) throw error
  const rows = (data ?? []) as unknown as (Omit<Category, 'docs'> & { docs: (Pick<Doc, 'slug' | 'path' | 'title' | 'sort_order'> & { status: string })[] })[]
  return rows.map(c => ({
    ...c,
    docs: c.docs
      .filter(d => d.status === 'published')
      .sort((a, b) => a.sort_order - b.sort_order),
  }))
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

// Used by generateStaticParams, which runs at build time with no HTTP
// request — the cookie-aware SSR client can't work there. Reads are public
// (RLS already allows anon reads of published docs), so a plain client is
// correct, not a workaround.
export async function getAllDocPaths(): Promise<{ path: string }[]> {
  const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data, error } = await supabase
    .from('docs')
    .select('path')
    .eq('status', 'published')
  if (error) throw error
  return data ?? []
}
