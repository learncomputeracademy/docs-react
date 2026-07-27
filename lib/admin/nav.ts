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
}

export async function listNavItemsForAdmin(): Promise<NavItemRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('nav_items').select('*').order('sort_order')
  if (error) throw new Error(error.message)
  return data ?? []
}

// The header renders on every route (root layout), so a write here busts
// the layout everywhere — same pattern as saveSettings('seo', ...).
function revalidateNav() {
  revalidateTag('nav', { expire: 0 })
  revalidatePath('/', 'layout')
}

export type NavItemInput = { label: string; labelBn: string | null; url: string }

export async function createNavItem(input: NavItemInput) {
  const supabase = await createClient()
  const { count } = await supabase.from('nav_items').select('id', { count: 'exact', head: true })
  const { error } = await supabase.from('nav_items').insert({
    label: input.label,
    label_bn: input.labelBn,
    url: input.url,
    sort_order: (count ?? 0) + 1,
  })
  if (error) throw new Error(error.message)
  await logActivity('created', 'nav_item', null, input.label)
  revalidateNav()
}

export async function updateNavItem(id: string, input: NavItemInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('nav_items')
    .update({ label: input.label, label_bn: input.labelBn, url: input.url })
    .eq('id', id)
  if (error) throw new Error(error.message)
  await logActivity('updated', 'nav_item', id, input.label)
  revalidateNav()
}

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
