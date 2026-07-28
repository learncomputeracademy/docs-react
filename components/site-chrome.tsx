'use client'

import { usePathname } from 'next/navigation'
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'
import type { NavNode } from '@/lib/content'

// The admin panel is a separate application surface with its own sidebar
// chrome (AdminChrome) — the public marketing header/footer (home logo,
// language switcher, theme toggle aimed at readers) don't belong there,
// and were eating into the admin sidebar's full-viewport-height layout.
// Client-side pathname check, not a second root layout via route groups —
// far less restructuring for the same result, and (like AdminChrome)
// carries none of D-18's SSR-poisoning risk since it never touches
// headers()/cookies(), just the client-only usePathname() hook.
export function SiteChrome({
  navItems,
  logoLightUrl,
  logoDarkUrl,
  children,
}: {
  navItems: NavNode[]
  logoLightUrl: string
  logoDarkUrl: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return children

  return (
    <>
      <SiteHeader navItems={navItems} logoLightUrl={logoLightUrl} logoDarkUrl={logoDarkUrl} />
      {children}
      <SiteFooter />
    </>
  )
}
