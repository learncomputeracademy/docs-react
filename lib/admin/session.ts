import { createClient } from '@/lib/supabase/server'

// Read once per request wherever a screen needs to know "am I admin or
// editor" for UI gating (hide a button, hide a nav item) — RLS is the
// real enforcement everywhere that matters, this is only ever cosmetic.
export async function getCurrentRole(): Promise<'admin' | 'editor' | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
  if (profile?.status !== 'active') return null
  return (profile?.role as 'admin' | 'editor') ?? null
}
