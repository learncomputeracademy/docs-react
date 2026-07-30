'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X, Sun, Moon, Languages } from 'lucide-react'
import { t } from '@/lib/i18n'
import { labelFor, itemLinkProps } from '@/components/site-nav'
import type { NavNode } from '@/lib/content'
import type { Locale } from '@/lib/types'

// Site-wide nav + language + theme, collapsed into one drawer below `sm` —
// the same breakpoint SiteNav hides at. Slides from the right, deliberately
// opposite MobileSidebarDrawer's left edge tab: right = "where else on this
// site", left = "which lesson" — two different intents, two edges, so
// neither is mistaken for the other. Search stays in the header itself
// (not moved here) since it's the one control worth the extra tap cost.
export function MobileMenuDrawer({
  navItems,
  locale,
  dark,
  onToggleTheme,
  switchHref,
}: {
  navItems: NavNode[]
  locale: Locale
  dark: boolean
  onToggleTheme: (e: React.MouseEvent<HTMLButtonElement>) => void
  switchHref: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const s = t(locale)

  // Same reasoning as MobileSidebarDrawer: links don't know about the
  // drawer, so close it ourselves whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label={s.menu}
          className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
        >
          <Menu className="size-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="animate-fade-in fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="animate-drawer-in-right fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-l bg-background p-4">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold">{s.menu}</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close" className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Language + theme up top, in a segmented-control card so they
              read as settings rather than more nav rows — the plain nav
              rows below are the differentiator. */}
          <div className="mb-4 flex items-center gap-1 rounded-xl border bg-muted/40 p-1">
            <Link
              href={switchHref}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-sm"
            >
              <Languages className="size-4" />
              {s.languageSwitchTo}
            </Link>
            <div className="h-5 w-px bg-border" aria-hidden />
            <button
              onClick={onToggleTheme}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-sm"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {s.toggleTheme}
            </button>
          </div>

          {navItems.length > 0 && (
            <nav className="flex flex-col gap-0.5 text-sm">
              {navItems.map((node) => (
                <div key={node.id}>
                  <Link href={node.url} {...itemLinkProps(node.url)} className="block rounded-md px-2 py-2 font-medium hover:bg-muted">
                    {labelFor(node, locale)}
                  </Link>
                  {node.children.length > 0 && (
                    <div className="ml-2 flex flex-col gap-0.5 border-l pl-2">
                      {node.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          {...itemLinkProps(child.url)}
                          className="block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {labelFor(child, locale)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
