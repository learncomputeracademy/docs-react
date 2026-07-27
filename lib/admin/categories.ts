'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveCategoryOrder(orderedIds: string[]) {
  const supabase = await createClient()
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase.from('categories').update({ sort_order: i + 1 }).eq('id', orderedIds[i])
    if (error) throw new Error(error.message)
  }
  revalidateTag('sidebar', { expire: 0 })
}

export type CategoryRow = {
  id: string
  slug: string
  title: string
  title_bn: string | null
  description: string | null
  sort_order: number
  doc_count: number
}

export async function listCategoriesFull(): Promise<CategoryRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, title, title_bn, description, sort_order, docs(count)')
    .order('sort_order')
  if (error) throw new Error(error.message)
  return (data ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    title_bn: c.title_bn,
    description: c.description,
    sort_order: c.sort_order,
    doc_count: (c.docs as unknown as { count: number }[])[0]?.count ?? 0,
  }))
}

export type CategoryInput = {
  slug: string
  title: string
  titleBn: string | null
  description: string | null
}

// New categories get lib/category-icons.tsx's generic fallback — a real
// brand icon (logos:css-3 etc.) is a code change, not admin-editable, per
// CLAUDE.md §4/docs/UI.md's ban on runtime Iconify. Documented ceiling,
// not an oversight.
export async function createCategory(input: CategoryInput) {
  const supabase = await createClient()
  const { count } = await supabase.from('categories').select('id', { count: 'exact', head: true })
  const { error } = await supabase.from('categories').insert({
    slug: input.slug,
    title: input.title,
    title_bn: input.titleBn,
    description: input.description,
    sort_order: (count ?? 0) + 1,
  })
  if (error) throw new Error(error.message)
  revalidateTag('sidebar', { expire: 0 })
}

export async function updateCategory(id: string, input: CategoryInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('categories')
    .update({ slug: input.slug, title: input.title, title_bn: input.titleBn, description: input.description })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('sidebar', { expire: 0 })
}

// The FK (docs.category_id references categories on delete restrict) is
// the real enforcement — this just turns Postgres's raw "violates foreign
// key constraint" into a message an editor can act on instead of a code.
export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) {
    if (error.code === '23503') {
      throw new Error('This category still has lessons in it. Move or delete them first.')
    }
    throw new Error(error.message)
  }
  revalidateTag('sidebar', { expire: 0 })
}
