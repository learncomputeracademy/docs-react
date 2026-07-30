'use client'

import { ChevronRight } from 'lucide-react'
import { useSidebar } from '@/components/magic/sidebar'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/types'

// Same fixed left-edge affordance the old MobileSidebarDrawer used, now
// just opening the ported Sidebar's own mobile Sheet instead of a
// bespoke drawer. md:hidden in CSS rather than gating on the isMobile
// hook's JS value, so there's no post-mount flash while it resolves.
export function MobileSidebarTrigger({ locale = 'en' }: { locale?: Locale }) {
  const { toggleSidebar } = useSidebar()
  const s = t(locale)

  return (
    <button
      type="button"
      aria-label={s.browseLessons}
      onClick={toggleSidebar}
      className="fixed left-0 top-[55%] z-40 flex -translate-y-1/2 items-center rounded-r-lg border border-l-0 bg-background py-2.5 pl-1.5 pr-2 text-muted-foreground shadow-md transition-colors hover:bg-muted hover:text-foreground md:hidden"
    >
      <ChevronRight className="size-4" />
    </button>
  )
}
