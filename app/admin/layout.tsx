import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getCurrentRole } from '@/lib/admin/session'
import { APP_VERSION } from '@/lib/admin/version'
import { AdminChrome } from '@/components/admin/admin-chrome'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Kept in sync by hand as new screens ship — the sidebar shows every
// planned item, but only these are actually linkable today.
const BUILT_HREFS = [
  '/admin', '/admin/docs', '/admin/media', '/admin/pages', '/admin/seo', '/admin/categories',
  '/admin/settings', '/admin/resources', '/admin/users', '/admin/activity', '/admin/trash',
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const [{ data: { user } }, role] = await Promise.all([supabase.auth.getUser(), getCurrentRole()])

  return (
    <AdminChrome email={user?.email} role={role} builtHrefs={BUILT_HREFS} version={APP_VERSION}>
      {children}
    </AdminChrome>
  )
}
