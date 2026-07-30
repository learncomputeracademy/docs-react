'use client'

import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/components/magic/sidebar'
import { t } from '@/lib/i18n'
import type { SidebarCategory } from '@/lib/content'
import type { Locale } from '@/lib/types'

// Same fixed left-edge affordance the old MobileSidebarDrawer used, now
// just opening the ported Sidebar's own mobile Sheet instead of a bespoke
// drawer — including its "which lesson, out of how many" badge, e.g.
// "7/16", so the trigger still tells you where you are without opening it.
export function MobileSidebarTrigger({ categories, locale = 'en' }: { categories: SidebarCategory[]; locale?: Locale }) {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const s = t(locale)

  const activePath = pathname.replace(/^\/bn(\/|$)/, '/').replace(/^\//, '')
  const activeCategory = categories.find((c) => c.docs.some((d) => d.path === activePath))
  const docIndex = activeCategory ? activeCategory.docs.findIndex((d) => d.path === activePath) : -1
  const position = activeCategory && docIndex >= 0 ? { index: docIndex + 1, total: activeCategory.docs.length } : null

  return (
    <button
      type="button"
      aria-label={s.browseLessons}
      onClick={toggleSidebar}
      className="fixed left-0 top-[55%] z-40 flex -translate-y-1/2 flex-col items-center gap-0.5 rounded-r-lg border border-l-0 bg-background py-2.5 pl-1.5 pr-2 text-muted-foreground shadow-md transition-colors hover:bg-muted hover:text-foreground md:hidden"
    >
      <ChevronRight className="size-4" />
      {position && (
        <span className="text-[10px] font-semibold leading-none tabular-nums">
          {position.index}/{position.total}
        </span>
      )}
    </button>
  )
}
