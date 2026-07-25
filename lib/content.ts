// All content access goes through here. Pages never call Supabase directly.
// This is the mandatory choke point — see CLAUDE.md §4.
import { createClient } from './supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Category, Doc, Locale } from './types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*, docs(count)')
    .order('sort_order')
  if (error) throw error
  return (data as Category[]) ?? []
}

export type SidebarDoc = Pick<Doc, 'slug' | 'path' | 'title' | 'sort_order'>
export type SidebarCategory = Omit<Category, 'docs'> & { docs: SidebarDoc[] }

// Persistent sidebar needs every category with its docs in one shot, not
// fetched per-category — that's what a "fixed syllabus sidebar" is.
// locale='bn': doc titles fall back to English where no translation exists
// yet — partial rollout shows real titles, not blanks, while translation
// is still in progress category-by-category.
export async function getSidebarTree(locale: Locale = 'en'): Promise<SidebarCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*, docs(id, slug, path, title, sort_order, status)')
    .order('sort_order')
  if (error) throw error
  type Row = Omit<Category, 'docs'> & { docs: (SidebarDoc & { id: string; status: string })[] }
  const rows = (data ?? []) as unknown as Row[]

  // Same graceful-degradation reasoning as getDoc: if doc_translations
  // isn't there yet (pre-migration) or errors for any reason, the sidebar
  // just shows English doc titles under Bengali category names, not a crash.
  let titleByDocId = new Map<string, string>()
  if (locale === 'bn') {
    try {
      const { data: translations } = await supabase.from('doc_translations').select('doc_id, title').eq('locale', 'bn')
      const rows2 = (translations ?? []) as unknown as { doc_id: string; title: string }[]
      titleByDocId = new Map(rows2.map(row => [row.doc_id, row.title]))
    } catch {
      // leave titleByDocId empty — falls back to English titles below
    }
  }

  return rows.map(c => ({
    ...c,
    title: locale === 'bn' ? (c.title_bn ?? c.title) : c.title,
    docs: c.docs
      .filter(d => d.status === 'published')
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(d => ({ ...d, title: titleByDocId.get(d.id) ?? d.title })),
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

export type LocalizedDoc = Doc & { isTranslated: boolean }

type Translation = Pick<Doc, 'title' | 'meta_title' | 'meta_description' | 'blocks' | 'toc'>

// Falls back to null on ANY failure — including doc_translations not
// existing yet pre-migration — rather than crashing the page. A missing
// translation is an expected, common state during rollout, not an error.
async function fetchBnTranslation(supabase: Awaited<ReturnType<typeof createClient>>, docId: string): Promise<Translation | null> {
  try {
    const { data } = await supabase
      .from('doc_translations')
      .select('title, meta_title, meta_description, blocks, toc')
      .eq('doc_id', docId)
      .eq('locale', 'bn')
      .maybeSingle()
    return data as unknown as Translation | null
  } catch {
    return null
  }
}

export async function getDoc(path: string, locale: Locale = 'en'): Promise<LocalizedDoc | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .select('*, category:categories(slug, title)')
    .eq('path', path)
    .eq('status', 'published')
    .single()
  if (error) return null
  const doc = data as unknown as Doc

  if (locale !== 'bn') return { ...doc, isTranslated: true }

  const translation = await fetchBnTranslation(supabase, doc.id)
  if (!translation) return { ...doc, isTranslated: false }
  return { ...doc, ...translation, isTranslated: true }
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

// Only paths with a real Bengali translation get statically generated under
// /bn — a page with no translation still resolves (getDoc falls back to
// English + isTranslated:false), it's just server-rendered on demand rather
// than pre-built, since most docs won't have one yet during the rollout.
// Returns [] rather than throwing if doc_translations doesn't exist yet
// (pre-migration) or any other error occurs — generateStaticParams failing
// would break the entire /bn route, not just one page.
export async function getTranslatedDocPaths(): Promise<{ path: string }[]> {
  try {
    return await getTranslatedDocPathsUnsafe()
  } catch {
    return []
  }
}

async function getTranslatedDocPathsUnsafe(): Promise<{ path: string }[]> {
  const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data, error } = await supabase
    .from('doc_translations')
    .select('doc:docs!inner(path, status)')
    .eq('locale', 'bn')
    .eq('doc.status', 'published')
  if (error) throw error
  return (data ?? []).map((r) => ({ path: (r.doc as unknown as { path: string }).path }))
}
