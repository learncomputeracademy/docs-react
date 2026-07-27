import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminChrome } from '@/components/admin/admin-chrome'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Kept in sync by hand as new screens ship (Phase 8/9) — the sidebar shows
// every planned item, but only these are actually linkable today.
const BUILT_HREFS = ['/admin', '/admin/docs', '/admin/media', '/admin/categories', '/admin/settings', '/admin/resources']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <AdminChrome email={user?.email} builtHrefs={BUILT_HREFS}>
      {children}
    </AdminChrome>
  )
}
