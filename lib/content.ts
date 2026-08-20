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

export const getSiteSettings = cache(function getSiteSettings(key: 'home' | 'footer' | 'contact' | 'branding'): Promise<SiteSettingsValue> {
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

export type Resource = {
  id: string
  group_name: string
  name: string
  url: string
  thumbnail_url: string | null
  link_status: 'unchecked' | 'ok' | 'redirect_offsite' | 'dead'
  link_force_show: boolean
}

// Real bug fixed here: this was a plain Supabase fetch with no
// unstable_cache wrapper, but lib/admin/resources.ts's create/update/
// delete actions already called revalidateTag('resources', ...) assuming
// a 'resources'-tagged cache entry existed. Since none did, that
// revalidation was a no-op, and Next's default fetch caching served
// whatever was in the DB at the very first production build forever —
// caught when 94 real rows were seeded directly and /resources kept
// showing empty against a rebuilt production server. Tagged now, matching
// every other read in this file.
//
// Filters out link_status 'dead'/'redirect_offsite' (scripts/check-
// resource-links.mjs, run daily) unless an admin set link_force_show —
// 'unchecked' still shows (a just-added resource shouldn't vanish before
// its first check). Filtered here in JS, not via RLS/query — same pattern
// docs uses for status:'published' (lib/content.ts's getDoc), and the
// catalog is small enough that fetching all rows and filtering is simpler
// than a Supabase .or() clause.
//
// `?? 'unchecked'` / `?? false`: migration 012 (link_status/link_force_show
// columns) isn't applied everywhere yet — a select('*') against a DB still
// on the old schema returns those keys as undefined, not the column's SQL
// default. Without the fallback, `undefined === 'ok'` is false for every
// row and this filters out the entire catalog — a real regression caught
// live (2026-08-20): /resources went empty locally before migration 012
// had been run. Falling back to 'unchecked' (visible) matches what the
// column's own `default 'unchecked'` will do once the migration lands.
export const getResources = cache(function getResources(): Promise<Resource[]> {
  return unstable_cache(
    async () => {
      const supabase = createPublicClient()
      const { data, error } = await supabase.from('resources').select('*').order('group_name').order('sort_order')
      if (error) throw error
      const rows = (data ?? []) as Resource[]
      return rows.filter((r) => {
        const status = r.link_status ?? 'unchecked'
        return (r.link_force_show ?? false) || status === 'ok' || status === 'unchecked'
      })
    },
    ['resources'],
    { tags: ['resources'] }
  )()
})

export type NavItem = {
  id: string
  label: string
  label_bn: string | null
  url: string
  sort_order: number
  parent_id: string | null
}
export type NavNode = NavItem & { children: NavItem[] }

// Read from the root layout (every page) — cached + graceful-empty on any
// failure (including the migration not being run yet), same reasoning as
// getSiteSettings: a missing/broken nav_items table must never break the
// header, just render it with no extra links.
//
// Returns a two-level tree (D-43). `parent_id` is selected via `*`, so this
// still degrades correctly if 008 hasn't run — the column comes back
// undefined, every item reads as a root, and the header renders a flat nav.
export const getNavItems = cache(function getNavItems(): Promise<NavNode[]> {
  return unstable_cache(
    async () => {
      try {
        const supabase = createPublicClient()
        const { data, error } = await supabase.from('nav_items').select('*').order('sort_order')
        if (error) throw error
        const rows = (data ?? []) as NavItem[]
        const roots = rows.filter((r) => !r.parent_id)
        return roots.map((r) => ({
          ...r,
          children: rows.filter((c) => c.parent_id === r.id).sort((a, b) => a.sort_order - b.sort_order),
        }))
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
// fetched per-category on the *client* — that's what a "fixed syllabus
// sidebar" is (SidebarNav still receives the full tree as props and does
// its accordion open/close client-side, unchanged). But it used to be
// cached and *tagged* as one shot too — a single unstable_cache entry for
// all ~600 docs across every category, tagged 'sidebar'. That meant every
// single doc edit anywhere on the site invalidated the exact same cache
// entry every other category's page, the homepage, and search all read
// from — one lesson edit in `mongodb/` forced the next visitor to `css/`
// to pay for a full 23-category requery too. Split into two cached layers
// instead (2026-08-19, ISR-write investigation):
//   - getCategoryMeta(): cheap, id/slug/title/sort_order only, tagged
//     'categories-list' — busted only when a category itself is added/
//     renamed/reordered/deleted, not by ordinary doc edits.
//   - getCategoryDocsCached(): one cache entry PER category, tagged
//     `sidebar:<slug>` — a doc edit only busts its own category's entry;
//     the other 22 stay warm.
// getSidebarTree() itself is no longer unstable_cache-wrapped — it's a
// plain merge of already-cached pieces, so nothing here talks to Supabase
// on a cache hit. Still React cache()-wrapped for request-level dedup
// (sidebar + page sharing one render), same as before.
function getCategoryMeta(locale: Locale): Promise<Omit<Category, 'docs'>[]> {
  return unstable_cache(
    async () => {
      const supabase = createPublicClient()
      const { data, error } = await supabase.from('categories').select('id, slug, title, title_bn, description, sort_order').order('sort_order')
      if (error) throw error
      return (data ?? []).map(c => ({ ...c, title: locale === 'bn' ? (c.title_bn ?? c.title) : c.title }))
    },
    ['categories-meta', locale],
    { tags: ['categories-list'] }
  )()
}

// locale='bn': doc titles fall back to English where no translation exists
// yet — partial rollout shows real titles, not blanks, while translation
// is still in progress category-by-category. Same graceful-degradation
// reasoning as getDoc: if doc_translations isn't there yet or errors for
// any reason, this just shows English titles, not a crash.
function getCategoryDocsCached(categoryId: string, categorySlug: string, locale: Locale): Promise<SidebarDoc[]> {
  return unstable_cache(
    async () => {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('docs')
        .select('id, slug, path, title, sort_order, status')
        .eq('category_id', categoryId)
        .order('sort_order')
      if (error) throw error
      type Row = SidebarDoc & { id: string; status: string }
      const rows = (data ?? []) as unknown as Row[]
      const published = rows.filter(d => d.status === 'published')

      let titleByDocId = new Map<string, string>()
      if (locale === 'bn' && published.length > 0) {
        try {
          const { data: translations } = await supabase
            .from('doc_translations')
            .select('doc_id, title')
            .eq('locale', 'bn')
            .in('doc_id', published.map(d => d.id))
          const rows2 = (translations ?? []) as unknown as { doc_id: string; title: string }[]
          titleByDocId = new Map(rows2.map(row => [row.doc_id, row.title]))
        } catch {
          // leave titleByDocId empty — falls back to English titles below
        }
      }

      return published.map(d => ({ ...d, title: titleByDocId.get(d.id) ?? d.title }))
    },
    ['category-docs', categorySlug, locale],
    { tags: [`sidebar:${categorySlug}`] }
  )()
}

export const getSidebarTree = cache(async function getSidebarTree(locale: Locale = 'en'): Promise<SidebarCategory[]> {
  const meta = await getCategoryMeta(locale)
  const withDocs = await Promise.all(meta.map(async c => ({ ...c, docs: await getCategoryDocsCached(c.id, c.slug, locale) })))
  return withDocs
})

export type AdjacentDoc = { path: string; title: string }

export type DocPosition = { index: number; total: number }

// Flattens the sidebar tree (already locale-aware and correctly ordered) and
// looks up the doc before/after the given path in that same order — mirrors
// VitePress's prev/next, which follows sidebar order rather than a
// category-only sequence. `position` is deliberately different: it's the
// doc's 1-based spot within its own category ("7/16"), not the global flat
// index — a chapter-position hint reads as "chapter 7 of 16", not "lesson
// 245 of 687 sitewide".
export async function getAdjacentDocs(path: string, locale: Locale = 'en'): Promise<{ prev: AdjacentDoc | null; next: AdjacentDoc | null; position: DocPosition | null }> {
  const categories = await getSidebarTree(locale)
  const flat = categories.flatMap(c => c.docs)
  const i = flat.findIndex(d => d.path === path)

  const category = categories.find(c => c.docs.some(d => d.path === path))
  const indexInCategory = category ? category.docs.findIndex(d => d.path === path) : -1
  const position = category && indexInCategory >= 0 ? { index: indexInCategory + 1, total: category.docs.length } : null

  if (i === -1) return { prev: null, next: null, position }
  return {
    prev: i > 0 ? { path: flat[i - 1].path, title: flat[i - 1].title } : null,
    next: i < flat.length - 1 ? { path: flat[i + 1].path, title: flat[i + 1].title } : null,
    position,
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

export type SearchIndexEntry = { path: string; title: string; description: string | null }

// Feeds CommandMenu's client-side search — cmdk's own fuzzy filter runs
// against this, fetched once per locale rather than queried per keystroke.
// Replaced a Postgres textSearch('websearch') call: websearch_to_tsquery
// only matches whole stemmed words ("outli" never matched "outline"), and
// cost a network round trip on every keystroke besides. Same locale
// fallback as getSidebarTree — bn falls back to English title/description
// wherever no translation exists, never a blank entry.
export const getSearchIndex = cache(function getSearchIndex(locale: Locale = 'en'): Promise<SearchIndexEntry[]> {
  return unstable_cache(
    async () => {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('docs')
        .select('id, path, title, meta_description')
        .eq('status', 'published')
      if (error) throw error
      const rows = (data ?? []) as { id: string; path: string; title: string; meta_description: string | null }[]

      if (locale !== 'bn') {
        return rows.map((d) => ({ path: d.path, title: d.title, description: d.meta_description }))
      }

      let trById = new Map<string, { title: string; description: string | null }>()
      try {
        const { data: translations } = await supabase
          .from('doc_translations')
          .select('doc_id, title, meta_description')
          .eq('locale', 'bn')
        const rows2 = (translations ?? []) as { doc_id: string; title: string; meta_description: string | null }[]
        trById = new Map(rows2.map((r) => [r.doc_id, { title: r.title, description: r.meta_description }]))
      } catch {
        // leave trById empty — falls back to English below
      }

      return rows.map((d) => {
        const tr = trById.get(d.id)
        return { path: d.path, title: tr?.title ?? d.title, description: tr?.description ?? d.meta_description }
      })
    },
    ['search-index', locale],
    // Genuinely site-wide (search must find any doc in any category), so
    // it can't be scoped per-category like getSidebarTree's cache is —
    // stays on its own global tag instead of riding the old 'sidebar' tag,
    // which no longer exists as a single entry after that split.
    { tags: ['search-index'] }
  )()
})

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
