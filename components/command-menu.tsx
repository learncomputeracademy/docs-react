'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { Search, FileText, Loader2 } from 'lucide-react'
import { searchAction, categoriesAction } from '@/lib/actions'
import { localeFromPathname, localizedPath, t } from '@/lib/i18n'
import { CATEGORY_ICONS } from '@/lib/category-icons'
import { startRouteProgress } from '@/components/magic/route-progress'

type Result = { id: string; path: string; title: string; meta_description: string | null }
type CategoryItem = { slug: string; title: string; firstPath: string; count: number }

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const strings = t(locale)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // Fetched on mount, not on open — CommandMenu lives in the header and is
  // always mounted, so by the time someone actually opens the dialog this
  // has almost always already resolved. Fetching on open instead made the
  // "Pick a subject" list visibly pop in after the dialog itself appeared.
  useEffect(() => {
    categoriesAction(locale).then(setCategories)
  }, [locale])

  const runSearch = useCallback((q: string) => {
    setQuery(q)
    if (q.trim().length < 2) { setResults([]); return }
    startTransition(async () => {
      const r = await searchAction(q)
      setResults(r)
    })
  }, [])

  function select(path: string) {
    setOpen(false)
    setQuery('')
    startRouteProgress()
    router.push(localizedPath(`/${path}`, locale))
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">⌘K</kbd>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-[20%] z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border bg-popover shadow-2xl">
            <Dialog.Title className="sr-only">Search lessons</Dialog.Title>
            <Command shouldFilter={false} className="flex flex-col">
              <div className="flex items-center gap-2 border-b px-4">
                {pending ? <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" /> : <Search className="size-4 shrink-0 text-muted-foreground" />}
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={runSearch}
                  placeholder="Search lessons..."
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                {query.trim().length < 2 && categories.length > 0 && (
                  <Command.Group heading={strings.pickASubject} className="px-2 pb-1 pt-2 text-xs font-medium text-muted-foreground [&_[cmdk-group-items]]:mt-1">
                    {categories.map((cat) => {
                      const Icon = CATEGORY_ICONS[cat.slug]
                      return (
                        <Command.Item
                          key={cat.slug}
                          value={`category-${cat.slug}`}
                          onSelect={() => select(cat.firstPath)}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground data-[selected=true]:bg-accent"
                        >
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent">
                            {Icon && <Icon className="size-4" />}
                          </span>
                          <span className="font-medium">{cat.title}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {cat.count} {cat.count === 1 ? strings.lesson : strings.lessons}
                          </span>
                        </Command.Item>
                      )
                    })}
                  </Command.Group>
                )}
                {query.trim().length >= 2 && !pending && results.length === 0 && (
                  <Command.Empty className="py-8 text-center text-sm text-muted-foreground">No lessons found.</Command.Empty>
                )}
                {results.map((r) => (
                  <Command.Item
                    key={r.id}
                    value={r.id}
                    onSelect={() => select(r.path)}
                    className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-sm data-[selected=true]:bg-accent"
                  >
                    <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="font-medium">{r.title}</p>
                      {r.meta_description && <p className="truncate text-xs text-muted-foreground">{r.meta_description}</p>}
                    </div>
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
