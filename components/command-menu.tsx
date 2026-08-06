'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { Command, defaultFilter } from 'cmdk'
import { Search, FileText, Wrench, Loader2 } from 'lucide-react'
import { searchIndexAction, categoriesAction } from '@/lib/actions'
import { localizedTools } from '@/lib/tools-index'
import { localeFromPathname, localizedPath, t } from '@/lib/i18n'
import { CATEGORY_ICONS } from '@/lib/category-icons'
import { startRouteProgress } from '@/components/magic/route-progress'

type SearchItem = { path: string; title: string; description: string | null; kind: 'doc' | 'tool' }
type CategoryItem = { slug: string; title: string; firstPath: string; count: number }

// command-score (cmdk's default filter) weighs a contiguous match near the
// start of the string highest — concatenating title+description this way
// still lets "outli" score "Outline" top of the list, while a
// description-only match (rarer) still surfaces instead of vanishing.
function itemValue(item: SearchItem) {
  return `${item.title} ${item.description ?? ''}`
}

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<SearchItem[] | null>(null)
  const [categories, setCategories] = useState<CategoryItem[]>([])
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

  // Both fetched on mount, not on open — CommandMenu lives in the header
  // and is always mounted, so by the time someone actually opens the
  // dialog these have almost always already resolved. The search index is
  // the whole point of going client-side: fetched once per locale, then
  // cmdk's own fuzzy filter (command-score — the same class of algorithm
  // VSCode's command palette uses) matches it against every keystroke
  // locally, no network round trip and no debounce needed. Tools merged in
  // directly — lib/tools-index.ts is plain static data, not a DB query.
  useEffect(() => {
    categoriesAction(locale).then(setCategories)
    searchIndexAction(locale).then((docs) => {
      const tools = localizedTools(locale).map((t) => ({ ...t, kind: 'tool' as const }))
      const withKind = docs.map((d) => ({ ...d, kind: 'doc' as const }))
      setIndex([...tools, ...withKind])
    })
  }, [locale])

  function select(path: string) {
    setOpen(false)
    setQuery('')
    startRouteProgress()
    router.push(localizedPath(`/${path}`, locale))
  }

  const showResults = query.trim().length > 0

  // Sorted here with React's own render, not cmdk's built-in filter:
  // cmdk's default matching re-sorts by directly reordering DOM nodes
  // (imperative appendChild calls) via an effect chain off the controlled
  // Command.Input, which visibly lagged behind typing on a 470+ item list —
  // measured multiple seconds to settle. Same scoring algorithm
  // (command-score, exported as defaultFilter), just applied synchronously
  // during render instead of as a delayed DOM shuffle, so shouldFilter is
  // off below and this is the only place matching happens.
  const results = useMemo(() => {
    if (!showResults || index === null) return []
    return index
      .map((item) => ({ item, score: defaultFilter(itemValue(item), query, []) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
  }, [index, query, showResults])

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
                {showResults && index === null ? (
                  <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                ) : (
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                )}
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search lessons..."
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                {!showResults && categories.length > 0 && (
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
                {showResults && index !== null && (
                  <>
                    <Command.Empty className="py-8 text-center text-sm text-muted-foreground">No lessons found.</Command.Empty>
                    {results.map((item) => (
                      <Command.Item
                        key={item.path}
                        value={itemValue(item)}
                        onSelect={() => select(item.path)}
                        className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-sm data-[selected=true]:bg-accent"
                      >
                        {item.kind === 'tool' ? (
                          <Wrench className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium">{item.title}</p>
                          {item.kind === 'tool' ? (
                            <p className="truncate text-xs text-muted-foreground">{strings.interactiveTool}</p>
                          ) : (
                            item.description && <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                      </Command.Item>
                    ))}
                  </>
                )}
              </Command.List>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
