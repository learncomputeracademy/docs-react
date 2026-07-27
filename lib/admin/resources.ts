'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ResourceRow = {
  id: string
  group_name: string
  name: string
  url: string
  thumbnail_url: string | null
  sort_order: number
}

export async function listResourcesForAdmin(): Promise<ResourceRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('resources').select('*').order('group_name').order('sort_order')
  if (error) throw new Error(error.message)
  return data ?? []
}

export type ResourceInput = {
  groupName: string
  name: string
  url: string
  thumbnailUrl: string | null
}

export async function createResource(input: ResourceInput) {
  const supabase = await createClient()
  const { count } = await supabase
    .from('resources')
    .select('id', { count: 'exact', head: true })
    .eq('group_name', input.groupName)
  const { error } = await supabase.from('resources').insert({
    group_name: input.groupName,
    name: input.name,
    url: input.url,
    thumbnail_url: input.thumbnailUrl,
    sort_order: (count ?? 0) + 1,
  })
  if (error) throw new Error(error.message)
  revalidateTag('resources', { expire: 0 })
}

export async function updateResource(id: string, input: ResourceInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('resources')
    .update({ group_name: input.groupName, name: input.name, url: input.url, thumbnail_url: input.thumbnailUrl })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('resources', { expire: 0 })
}

export async function deleteResource(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('resources').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTag('resources', { expire: 0 })
}
