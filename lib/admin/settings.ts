'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/admin/activity'

export async function getSettingsForAdmin(key: 'home' | 'footer' | 'contact' | 'seo'): Promise<Record<string, unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle()
  if (error) throw new Error(error.message)
  return (data?.value as Record<string, unknown>) ?? {}
}

// site_settings rows are seeded empty by migration 003 (upsert here just
// means "the row already exists, always update" in practice) — kept as
// upsert anyway so this doesn't break if a key is ever missing. 'seo' key
// added without a migration — site_settings.key has no fixed set, and
// saveSettings' own upsert creates the row on first save.
export async function saveSettings(key: 'home' | 'footer' | 'contact' | 'seo', value: Record<string, unknown>) {
  const supabase = await createClient()
  const { error } = await supabase.from('site_settings').upsert({ key, value })
  if (error) throw new Error(error.message)
  await logActivity('updated', 'settings', key, key)

  revalidateTag('settings', { expire: 0 })
  if (key === 'seo') {
    // Verification meta tags live in the root layout's generateMetadata,
    // shared by every route — 'layout' busts it everywhere at once,
    // unlike revalidatePath('/', 'page') which only covers the homepage.
    revalidatePath('/', 'layout')
  } else {
    // Homepage is static (○) — settings changes need an explicit revalidate
    // to show up without a redeploy, same as any other content edit.
    revalidatePath('/', 'page')
    revalidatePath('/bn', 'page')
  }
}
