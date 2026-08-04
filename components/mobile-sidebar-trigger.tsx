'use client'

import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/components/magic/sidebar'
import { t } from '@/lib/i18n'
import type { SidebarCategory } from '@/lib/content'
import type { Locale } from '@/lib/types'

// Same fixed left-edge affordance the old MobileSidebarDrawer used, now
// just opening the ported Sidebar's own mobile Sheet instead of a bespoke
// drawer. On an actual lesson page this stays hidden — LessonPagination's
// fixed bottom bar has its own sidebar-toggle button there, and showing
// both would just be two ways to do the same thing on screen at once.
// Category index pages have no bottom bar (no prev/next lesson to show),
// so this tab is what they get instead.
export function MobileSidebarTrigger({ categories, locale = 'en' }: { categories: SidebarCategory[]; locale?: Locale }) {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const s = t(locale)

  const activePath = pathname.replace(/^\/bn(\/|$)/, '/').replace(/^\//, '')
  const isLessonPage = categories.some((c) => c.docs.some((d) => d.path === activePath))

  if (isLessonPage) return null

  return (
    <button
      type="button"
      aria-label={s.browseLessons}
      onClick={toggleSidebar}
      className="fixed left-0 top-[55%] z-40 flex -translate-y-1/2 flex-col items-center gap-0.5 rounded-r-lg border border-l-0 bg-background py-2.5 pl-1.5 pr-2 text-muted-foreground shadow-md transition-colors hover:bg-muted hover:text-foreground md:hidden"
    >
      <ChevronRight className="size-4" />
    </button>
  )
}
