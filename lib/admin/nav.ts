'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/admin/activity'

export type NavItemRow = {
  id: string
  label: string
  label_bn: string | null
  url: string
  sort_order: number
  parent_id: string | null
}

export async function listNavItemsForAdmin(): Promise<NavItemRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('nav_items').select('*').order('sort_order')
  if (error) throw new Error(error.message)
  return data ?? []
}

// The header renders on every route (root layout), so a write here busts
// the layout everywhere — same pattern as saveSettings('branding', ...).
function revalidateNav() {
  revalidateTag('nav', { expire: 0 })
  revalidatePath('/', 'layout')
}

export type NavItemInput = { label: string; labelBn: string | null; url: string; parentId: string | null }

// Two levels only (D-43). Enforced here rather than in the schema: a
// self-referencing FK can't express "a parent must itself be a root"
// without a trigger, and every write path goes through this file.
async function assertValidParent(supabase: Awaited<ReturnType<typeof createClient>>, parentId: string | null, selfId?: string) {
  if (!parentId) return
  if (selfId && parentId === selfId) throw new Error('An item cannot be its own parent.')
  const { data, error } = await supabase.from('nav_items').select('parent_id').eq('id', parentId).single()
  if (error) throw new Error(error.message)
  if (data.parent_id) throw new Error('Menus are two levels deep — you cannot nest under an item that is already a sub-item.')
  if (selfId) {
    const { count } = await supabase
      .from('nav_items')
      .select('id', { count: 'exact', head: true })
      .eq('parent_id', selfId)
    if ((count ?? 0) > 0) throw new Error('This item has sub-items. Move them out first, then nest it.')
  }
}

export async function createNavItem(input: NavItemInput) {
  const supabase = await createClient()
  await assertValidParent(supabase, input.parentId)
  // sort_order is scoped to the sibling group, not global — otherwise
  // moving an item between levels leaves gaps that reorder can't reason about.
  const siblings = supabase.from('nav_items').select('id', { count: 'exact', head: true })
  const { count } = await (input.parentId ? siblings.eq('parent_id', input.parentId) : siblings.is('parent_id', null))
  const { error } = await supabase.from('nav_items').insert({
    label: input.label,
    label_bn: input.labelBn,
    url: input.url,
    parent_id: input.parentId,
    sort_order: (count ?? 0) + 1,
  })
  if (error) throw new Error(error.message)
  await logActivity('created', 'nav_item', null, input.label)
  revalidateNav()
}

export async function updateNavItem(id: string, input: NavItemInput) {
  const supabase = await createClient()
  await assertValidParent(supabase, input.parentId, id)
  const { error } = await supabase
    .from('nav_items')
    .update({ label: input.label, label_bn: input.labelBn, url: input.url, parent_id: input.parentId })
    .eq('id', id)
  if (error) throw new Error(error.message)
  await logActivity('updated', 'nav_item', id, input.label)
  revalidateNav()
}

// on delete cascade (migration 008) removes children with the parent —
// surfaced in the UI's confirm text so it's never a surprise.
export async function deleteNavItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('nav_items').delete().eq('id', id)
  if (error) throw new Error(error.message)
  await logActivity('deleted', 'nav_item', id, null)
  revalidateNav()
}

export async function saveNavOrder(updates: { id: string; sort_order: number }[]) {
  const supabase = await createClient()
  for (const u of updates) {
    const { error } = await supabase.from('nav_items').update({ sort_order: u.sort_order }).eq('id', u.id)
    if (error) throw new Error(error.message)
  }
  revalidateNav()
}

// Indent = become a child of the sibling directly above. Outdent = become
// a root, positioned after the former parent. Both mirror WordPress's
// menu editor, where nesting is a movement, not a form field.
export async function setNavParent(id: string, parentId: string | null) {
  const supabase = await createClient()
  await assertValidParent(supabase, parentId, id)
  const siblings = supabase.from('nav_items').select('id', { count: 'exact', head: true })
  const { count } = await (parentId ? siblings.eq('parent_id', parentId) : siblings.is('parent_id', null))
  const { error } = await supabase
    .from('nav_items')
    .update({ parent_id: parentId, sort_order: (count ?? 0) + 1 })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidateNav()
}
