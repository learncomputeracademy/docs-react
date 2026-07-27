'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/admin/activity'

export async function getSettingsForAdmin(key: 'home' | 'footer' | 'contact'): Promise<Record<string, unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle()
  if (error) throw new Error(error.message)
  return (data?.value as Record<string, unknown>) ?? {}
}

// site_settings rows are seeded empty by migration 003 (upsert here just
// means "the row already exists, always update" in practice) — kept as
// upsert anyway so this doesn't break if a key is ever missing.
export async function saveSettings(key: 'home' | 'footer' | 'contact', value: Record<string, unknown>) {
  const supabase = await createClient()
  const { error } = await supabase.from('site_settings').upsert({ key, value })
  if (error) throw new Error(error.message)
  await logActivity('updated', 'settings', key, key)

  revalidateTag('settings', { expire: 0 })
  // Homepage is static (○) — settings changes need an explicit revalidate
  // to show up without a redeploy, same as any other content edit.
  revalidatePath('/', 'page')
  revalidatePath('/bn', 'page')
}
