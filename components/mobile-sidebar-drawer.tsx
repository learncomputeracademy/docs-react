'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronRight, X } from 'lucide-react'
import { SidebarNav } from '@/components/sidebar-nav'
import { t } from '@/lib/i18n'
import type { SidebarCategory } from '@/lib/content'
import type { Locale } from '@/lib/types'

export function MobileSidebarDrawer({ categories, locale = 'en' }: { categories: SidebarCategory[]; locale?: Locale }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const s = t(locale)

  // SidebarNav's links are plain next/link navigations — they don't know
  // about the drawer, so close it ourselves whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Same activePath logic as SidebarNav — strip the /bn prefix so both
  // locales resolve against the same path shape stored on each doc.
  // -1 (no number shown) covers both "not a doc page" and "on the bare
  // category index page", where a position would be misleading anyway.
  const activePath = pathname.replace(/^\/bn(\/|$)/, '/').replace(/^\//, '')
  const activeCategory = categories.find((c) => c.docs.some((d) => d.path === activePath))
  const docIndex = activeCategory ? activeCategory.docs.findIndex((d) => d.path === activePath) : -1
  const position = activeCategory && docIndex >= 0 ? { index: docIndex + 1, total: activeCategory.docs.length } : null

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Fixed edge tab, not a bar in document flow — stays reachable the
          whole time someone's reading, without permanently spending
          vertical space the way a sticky top bar would. Slightly below
          center for thumb reach, not dead-center. Left edge, opposite
          MobileMenuDrawer's right-side site menu — two intents, two edges. */}
      <Dialog.Trigger asChild>
        <button
          aria-label={s.browseLessons}
          className="fixed left-0 top-[55%] z-40 flex -translate-y-1/2 flex-col items-center gap-0.5 rounded-r-lg border border-l-0 bg-background py-2.5 pl-1.5 pr-2 text-muted-foreground shadow-md transition-colors hover:bg-muted hover:text-foreground md:hidden"
        >
          <ChevronRight className="size-4" />
          {position && (
            <span className="text-[10px] font-semibold leading-none tabular-nums">
              {position.index}/{position.total}
            </span>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="animate-fade-in fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="animate-drawer-in fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto border-r bg-background p-4">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold">{s.pickASubject}</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close" className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>
          <SidebarNav categories={categories} locale={locale} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
