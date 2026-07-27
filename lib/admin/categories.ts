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
