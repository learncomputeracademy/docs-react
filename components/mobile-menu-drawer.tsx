'use client'

import Link from '@/components/hover-link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowRight, BarChart3, ChevronDown, Keyboard, Languages, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { labelFor, itemLinkProps } from '@/components/site-nav'
import { DOCS_NAV_ID, groupNavChildren } from '@/lib/nav-megamenu'
import { useContinueTarget } from '@/lib/progress'
import type { NavNode } from '@/lib/content'
import type { Locale } from '@/lib/types'

// Phone menu (below `sm`, where SiteNav hides). Redesigned 2026-11-24: the
// old narrow side drawer listed every subject and tool at once.
// Now a full-height sheet from the bottom:
//   1. language + theme (kept at the top, owner request),
//   2. quick actions: search, continue learning, my progress, typing test,
//   3. Docs: all five groups with every subject (2-column icon rows,
//      the subject you're on highlighted),
//   4. every other menu item; ones with children (Tools) fold open on tap.
const QUICK_URLS = new Set(['/typing-test', '/progress'])

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
  const bn = locale === 'bn'
  const prefix = bn ? '/bn' : ''
  const plainPath = pathname.replace(/^\/bn(?=\/|$)/, '') || '/'

  // Links don't know about the sheet, so close it whenever the route changes.
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    setOpen(false)
  }

  const docs = navItems.find((n) => n.id === DOCS_NAV_ID)
  const docGroups = docs ? groupNavChildren(docs) : null
  const isCurrent = (url: string) => plainPath === url || plainPath.startsWith(`${url}/`)

  const target = useContinueTarget()

  // The search palette (CommandMenu) opens on Ctrl/Cmd+K; close the sheet
  // first so the two dialogs don't stack.
  const openSearch = () => {
    setOpen(false)
    setTimeout(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true })), 50)
  }

  const quick = 'flex min-h-12 items-center gap-2.5 rounded-xl border bg-card px-3 text-sm font-medium transition-colors active:bg-muted'

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
        <Dialog.Overlay className="animate-fade-in fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="animate-sheet-in-up fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-3xl border-t bg-background shadow-2xl">
          {/* Grab handle + title + close */}
          <div className="shrink-0 px-4 pt-2 pb-3">
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-muted-foreground/30" aria-hidden />
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-base font-semibold">{s.menu}</Dialog.Title>
              <Dialog.Close asChild>
                <button aria-label="Close" className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-foreground">
                  <X className="size-4" />
                </button>
              </Dialog.Close>
            </div>
            {/* Language + theme: always at the top */}
            <div className="mt-3 flex items-center gap-1 rounded-xl border bg-muted/40 p-1">
              <Link href={switchHref} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-background">
                <Languages className="size-4" />
                {s.languageSwitchTo}
              </Link>
              <div className="h-5 w-px bg-border" aria-hidden />
              <button onClick={onToggleTheme} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-background">
                {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {s.toggleTheme}
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            {/* Quick actions */}
            <button type="button" onClick={openSearch} className="flex min-h-12 w-full items-center gap-2.5 rounded-xl border bg-muted/40 px-3 text-sm text-muted-foreground">
              <Search className="size-4" />
              {bn ? 'পাঠ বা টুল খুঁজুন…' : 'Search lessons and tools…'}
            </button>
            {target && (
              <Link href={`${prefix}/${target.path}`} className="mt-2 flex min-h-14 items-center gap-3 rounded-xl bg-primary px-4 text-primary-foreground">
                <span className="min-w-0 flex-1">
                  <span className="block text-xs opacity-80">{s.continueLearning}</span>
                  <span className="block truncate text-sm font-semibold">{target.title}</span>
                </span>
                <ArrowRight className="size-4 shrink-0" />
              </Link>
            )}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href={`${prefix}/progress`} className={quick}>
                <BarChart3 className="size-4 text-primary" />
                <span className="min-w-0 flex-1 truncate">{bn ? 'আমার অগ্রগতি' : 'My progress'}</span>
              </Link>
              <Link href={`${prefix}/typing-test`} className={quick}>
                <Keyboard className="size-4 text-primary" />
                <span className="truncate">{bn ? 'টাইপিং টেস্ট' : 'Typing test'}</span>
              </Link>
            </div>

            {/* Docs: every group and subject at once (2026-11-24: tabs hid
                four of the five groups), as compact 2-column icon rows. */}
            {docs && docGroups && (
              <section className="mt-6">
                <Link href={docs.url} {...itemLinkProps(docs.url)} className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{labelFor(docs, locale)}</h2>
                  <span className="text-xs font-medium text-primary">{bn ? 'সব দেখুন' : 'See all'}</span>
                </Link>
                <div className="mt-3 space-y-4">
                  {docGroups.map((g) => (
                    <div key={g.title}>
                      <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
                        <g.icon className="size-4 text-primary" />
                        {g.title}
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {g.items.map((item) => {
                          const cur = isCurrent(item.url)
                          return (
                            <Link
                              key={item.id}
                              href={item.url}
                              {...itemLinkProps(item.url)}
                              aria-current={cur ? 'page' : undefined}
                              className={cn(
                                'flex min-h-11 items-center gap-2 rounded-lg border px-2.5 py-2 text-sm leading-tight transition-colors active:bg-muted',
                                cur ? 'border-primary/60 bg-primary/10 font-medium text-primary' : 'bg-card',
                              )}
                            >
                              <item.icon className="size-4 shrink-0 text-primary" />
                              <span className="min-w-0">{labelFor(item, locale)}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Everything else */}
            <nav className="mt-6 flex flex-col gap-1.5 text-sm">
              {navItems
                // Docs and the quick-action pages are already shown above.
                .filter((n) => n.id !== DOCS_NAV_ID && !QUICK_URLS.has(n.url))
                .map((node) => {
                  const groups = groupNavChildren(node)
                  if (node.children.length === 0) {
                    return (
                      <Link
                        key={node.id}
                        href={node.url}
                        {...itemLinkProps(node.url)}
                        className={cn('flex min-h-12 items-center rounded-xl px-3 font-medium active:bg-muted', isCurrent(node.url) && 'bg-primary/10 text-primary')}
                      >
                        {labelFor(node, locale)}
                      </Link>
                    )
                  }
                  return (
                    <details key={node.id} className="group rounded-xl border bg-card">
                      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-3 font-medium [&::-webkit-details-marker]:hidden">
                        {labelFor(node, locale)}
                        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="space-y-3 border-t px-3 py-3">
                        <Link href={node.url} {...itemLinkProps(node.url)} className="block text-xs font-medium text-primary">
                          {bn ? 'সব দেখুন' : 'See all'} →
                        </Link>
                        {(groups ?? [{ title: '', icon: null, items: node.children }]).map((g) => (
                          <div key={g.title || 'all'}>
                            {g.title && <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{g.title}</p>}
                            <div className="grid grid-cols-2 gap-1">
                              {g.items.map((item) => (
                                <Link
                                  key={item.id}
                                  href={item.url}
                                  {...itemLinkProps(item.url)}
                                  className={cn('rounded-lg px-2 py-2 text-sm text-muted-foreground active:bg-muted', isCurrent(item.url) && 'bg-primary/10 font-medium text-primary')}
                                >
                                  {labelFor(item, locale)}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  )
                })}
            </nav>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
