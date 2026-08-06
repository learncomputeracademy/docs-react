'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/admin/activity'

// Cookie-aware SSR client, never the service-role client — RLS's
// "admin manages docs" policy is the actual enforcement (public.is_admin()),
// the proxy.ts route guard is UX on top of it, not a substitute for it.

export type AdminDocRow = {
  id: string
  title: string
  path: string
  status: 'draft' | 'published'
  sort_order: number
  updated_at: string
  category: { id: string; slug: string; title: string } | null
}

export async function listDocsForAdmin(): Promise<AdminDocRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .select('id, title, path, status, sort_order, updated_at, category:categories(id, slug, title)')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as AdminDocRow[]
}

export async function listCategoriesForAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('id, slug, title').order('sort_order')
  if (error) throw new Error(error.message)
  return data ?? []
}

// Shared by every action that touches an already-published doc's page
// (this file, doc.ts, revisions.ts). revalidatePath eagerly writes to the
// ISR cache regardless of whether anyone's about to visit. Whether the
// /bn write is worth paying for depends on translation state: with NO bn
// row, getDoc() falls back to this same English content under /bn/path,
// so an English edit changes that page too and the write is real. WITH a
// bn row, the translation overrides title/blocks/toc independently, so an
// English-only edit doesn't touch what bn readers see and the write is
// waste — that's the case this skips.
export async function revalidateDoc(supabase: Awaited<ReturnType<typeof createClient>>, id: string, path: string) {
  revalidateTag(`doc:${path}`, { expire: 0 })
  revalidateTag('sidebar', { expire: 0 })
  revalidatePath(`/${path}`, 'page')
  const { count } = await supabase
    .from('doc_translations')
    .select('id', { count: 'exact', head: true })
    .eq('doc_id', id)
    .eq('locale', 'bn')
  if (!count) revalidatePath(`/bn/${path}`, 'page')
}

export async function setDocStatus(id: string, status: 'draft' | 'published') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .update({ status, published_at: status === 'published' ? new Date().toISOString() : null })
    .eq('id', id)
    .select('path')
    .single()
  if (error) throw new Error(error.message)
  await logActivity(status === 'published' ? 'published' : 'unpublished', 'doc', id, data.path)
  await revalidateDoc(supabase, id, data.path)
}

export async function bulkPublish(ids: string[]) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .in('id', ids)
    .select('id, path')
  if (error) throw new Error(error.message)
  for (const d of data ?? []) await logActivity('published', 'doc', null, d.path)
  for (const d of data ?? []) await revalidateDoc(supabase, d.id, d.path)
}

// Soft delete, admin-only (enforced by the docs_delete_restore_guard
// trigger, not just this app-layer check) — the 150 migrated lessons are
// the one genuinely irreplaceable thing in this project, so "delete" here
// means "hide + revalidate," never a real DELETE. status/published_at are
// deliberately left untouched: the public read policy's `deleted_at is
// null` clause is what actually hides it, so restoreDoc can be a true
// undo — a previously-published doc comes back still published, and
// still slug-locked (CLAUDE.md §3.2, no accidental URL changes).
export async function deleteDoc(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .select('path')
    .single()
  if (error) throw new Error(error.message)
  await logActivity('deleted', 'doc', id, data.path)
  await revalidateDoc(supabase, id, data.path)
}

export type TrashedDocRow = {
  id: string
  title: string
  path: string
  deleted_at: string
  category: { id: string; slug: string; title: string } | null
}

export async function listTrash(): Promise<TrashedDocRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .select('id, title, path, deleted_at, category:categories(id, slug, title)')
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as TrashedDocRow[]
}

export async function restoreDoc(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .update({ deleted_at: null })
    .eq('id', id)
    .select('path')
    .single()
  if (error) throw new Error(error.message)
  await logActivity('restored', 'doc', id, data.path)
  await revalidateDoc(supabase, id, data.path)
}

// One row per changed order number, not a single upsert — "Save order" is
// a batch of at most ~40 rows (one category at a time in practice), and a
// real upsert would need every NOT NULL column repeated for no benefit.
export async function saveSortOrder(updates: { id: string; sort_order: number }[]) {
  const supabase = await createClient()
  for (const u of updates) {
    const { error } = await supabase.from('docs').update({ sort_order: u.sort_order }).eq('id', u.id)
    if (error) throw new Error(error.message)
  }
  revalidateTag('sidebar', { expire: 0 })
}

export async function createDraftDoc(categoryId: string, slug: string, title: string) {
  const supabase = await createClient()
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('slug')
    .eq('id', categoryId)
    .single()
  if (catError) throw new Error(catError.message)

  const path = `${category.slug}/${slug}`
  const { data, error } = await supabase
    .from('docs')
    .insert({ category_id: categoryId, slug, path, title, blocks: [], toc: [], status: 'draft' })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  await logActivity('created', 'doc', data.id, path)
  return data.id as string
}
