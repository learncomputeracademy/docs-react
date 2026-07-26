'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Menu className="size-4" />
          {s.browseLessons}
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
