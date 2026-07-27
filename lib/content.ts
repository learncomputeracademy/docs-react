// All content access goes through here. Pages never call Supabase directly.
// This is the mandatory choke point — see CLAUDE.md §4.
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { createPublicClient } from './supabase/public'
import type { Category, Doc, Locale } from './types'

// Homepage/footer copy that's editable from /admin/settings without a
// deploy. Graceful-degradation on any failure (missing row, migration not
// run yet) — the caller merges this over hardcoded defaults from
// lib/i18n.ts, so returning {} here just means "nothing overridden",
// never a broken page. Tagged 'settings' so the admin's save action can
// revalidate the (static) homepage on publish.
export type SiteSettingsValue = Record<string, unknown>

export const getSiteSettings = cache(function getSiteSettings(key: 'home' | 'footer' | 'contact' | 'seo'): Promise<SiteSettingsValue> {
  return unstable_cache(
    async () => {
      try {
        const supabase = createPublicClient()
        const { data, error } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle()
        if (error || !data) return {}
        return (data.value as SiteSettingsValue) ?? {}
      } catch {
        return {}
      }
    },
    ['site-settings', key],
    { tags: ['settings'] }
  )()
})

export type Resource = { id: string; group_name: string; name: string; url: string; thumbnail_url: string | null }

// Real bug fixed here: this was a plain Supabase fetch with no
// unstable_cache wrapper, but lib/admin/resources.ts's create/update/
// delete actions already called revalidateTag('resources', ...) assuming
// a 'resources'-tagged cache entry existed. Since none did, that
// revalidation was a no-op, and Next's default fetch caching served
// whatever was in the DB at the very first production build forever —
// caught when 94 real rows were seeded directly and /resources kept
// showing empty against a rebuilt production server. Tagged now, matching
// every other read in this file.
export const getResources = cache(function getResources(): Promise<Resource[]> {
  return unstable_cache(
    async () => {
      const supabase = createPublicClient()
      const { data, error } = await supabase.from('resources').select('*').order('group_name').order('sort_order')
      if (error) throw error
      return data ?? []
    },
    ['resources'],
    { tags: ['resources'] }
  )()
})

export type NavItem = { id: string; label: string; label_bn: string | null; url: string; sort_order: number }

// Read from the root layout (every page) — cached + graceful-empty on any
// failure (including the migration not being run yet), same reasoning as
// getSiteSettings: a missing/broken nav_items table must never break the
// header, just render it with no extra links.
export const getNavItems = cache(function getNavItems(): Promise<NavItem[]> {
  return unstable_cache(
    async () => {
      try {
        const supabase = createPublicClient()
        const { data, error } = await supabase.from('nav_items').select('*').order('sort_order')
        if (error) throw error
        return data ?? []
      } catch {
        return []
      }
    },
    ['nav-items'],
    { tags: ['nav'] }
  )()
})

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient()
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
// Two layers of caching, doing two different jobs:
// - React cache(): request-level memoization, so the category layout
//   (sidebar) and the category/lesson page sharing one render don't issue
//   the query twice.
// - unstable_cache(): Next's persistent Data Cache, tagged 'sidebar' so the
//   revalidation webhook can bust it on any docs/categories change without
//   a redeploy. This is the layer that makes it ISR rather than frozen SSG.
export const getSidebarTree = cache(function getSidebarTree(locale: Locale = 'en'): Promise<SidebarCategory[]> {
  return unstable_cache(
    async () => {
      const supabase = createPublicClient()
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
    },
    ['sidebar-tree', locale],
    { tags: ['sidebar'] }
  )()
})

export type AdjacentDoc = { path: string; title: string }

// Flattens the sidebar tree (already locale-aware and correctly ordered) and
// looks up the doc before/after the given path in that same order — mirrors
// VitePress's prev/next, which follows sidebar order rather than a
// category-only sequence.
export async function getAdjacentDocs(path: string, locale: Locale = 'en'): Promise<{ prev: AdjacentDoc | null; next: AdjacentDoc | null }> {
  const categories = await getSidebarTree(locale)
  const flat = categories.flatMap(c => c.docs)
  const i = flat.findIndex(d => d.path === path)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? { path: flat[i - 1].path, title: flat[i - 1].title } : null,
    next: i < flat.length - 1 ? { path: flat[i + 1].path, title: flat[i + 1].title } : null,
  }
}

export async function getCategoryDocs(categorySlug: string): Promise<Doc[]> {
  const supabase = createPublicClient()
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
async function fetchBnTranslation(supabase: ReturnType<typeof createPublicClient>, docId: string): Promise<Translation | null> {
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

// Tagged doc:${path} — shared by both locales, since an English edit
// (blocks/toc a Bengali page falls back to) and a Bengali-only edit
// (doc_translations) should each be able to bust both cached variants.
// Slightly broader than strictly necessary; still one page's worth of
// recompute per publish, not a redeploy — see docs/DECISIONS.md.
export async function getDoc(path: string, locale: Locale = 'en'): Promise<LocalizedDoc | null> {
  return unstable_cache(
    async () => {
      const supabase = createPublicClient()
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
    },
    ['doc', path, locale],
    { tags: [`doc:${path}`] }
  )()
}

export async function searchDocs(query: string): Promise<Pick<Doc, 'id' | 'path' | 'title' | 'meta_description'>[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('docs')
    .select('id, path, title, meta_description')
    .eq('status', 'published')
    .textSearch('search_vector', query, { type: 'websearch' })
    .limit(20)
  if (error) throw error
  return data ?? []
}

export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('categories').select('slug')
  if (error) throw error
  return data ?? []
}

// Feeds [category]/[slug]'s generateStaticParams, which splits `path` on
// '/' into exactly two segments — a standalone page (ADMIN-PLAN.md §1c,
// category_id IS NULL, path = slug with no '/') would split into
// { category: 'about', slug: undefined } and break the param list. Filter
// here, the one place both static-param consumers read from, rather than
// in each route.
export async function getAllDocPaths(): Promise<{ path: string }[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('docs')
    .select('path')
    .eq('status', 'published')
  if (error) throw error
  return (data ?? []).filter((d) => d.path.includes('/'))
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
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('doc_translations')
    .select('doc:docs!inner(path, status)')
    .eq('locale', 'bn')
    .eq('doc.status', 'published')
  if (error) throw error
  return (data ?? [])
    .map((r) => ({ path: (r.doc as unknown as { path: string }).path }))
    .filter((d) => d.path.includes('/')) // same reasoning as getAllDocPaths
}

// Sitemap's own read — unlike getAllDocPaths, deliberately includes
// standalone pages (path with no '/', e.g. 'about') since a sitemap entry
// doesn't need to split into {category, slug} the way generateStaticParams
// does. Soft-deleted rows never reach this: the public client is
// RLS-bound, and the public read policy already excludes deleted_at rows.
export async function getAllPublishedPaths(): Promise<{ path: string; updated_at: string }[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('docs')
    .select('path, updated_at')
    .eq('status', 'published')
  if (error) throw error
  return data ?? []
}

// Bengali equivalent of getAllPublishedPaths, for sitemap /bn/* entries.
// Same graceful-empty-on-failure reasoning as getTranslatedDocPaths.
export async function getTranslatedPathsForSitemap(): Promise<{ path: string; updated_at: string }[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('doc_translations')
      .select('updated_at, doc:docs!inner(path, status)')
      .eq('locale', 'bn')
      .eq('doc.status', 'published')
    if (error) throw error
    return (data ?? []).map((r) => ({
      path: (r.doc as unknown as { path: string }).path,
      updated_at: r.updated_at,
    }))
  } catch {
    return []
  }
}
