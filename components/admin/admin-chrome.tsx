'use client'

import { usePathname } from 'next/navigation'
import { AdminSidebar } from './admin-sidebar'

// Login has no session to show a sidebar for; preview is meant to read as
// close to the real public page as possible, not framed in admin chrome.
// Client-side pathname check (not a route-group split) — much less file
// restructuring for the same result, and this layout is already fully
// dynamic (proxy.ts-guarded), so there's no static-route risk from being
// a client component the way there was in the root layout (D-18).
function shouldHideSidebar(pathname: string) {
  return pathname === '/admin/login' || pathname.endsWith('/preview')
}

export function AdminChrome({
  email,
  builtHrefs,
  children,
}: {
  email: string | undefined
  builtHrefs: string[]
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (shouldHideSidebar(pathname)) return children

  return (
    <div className="flex">
      <AdminSidebar email={email} builtHrefs={builtHrefs} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
