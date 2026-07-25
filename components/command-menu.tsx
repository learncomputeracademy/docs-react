'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { Search, FileText, Loader2 } from 'lucide-react'
import { searchAction } from '@/lib/actions'
import { localeFromPathname, localizedPath } from '@/lib/i18n'

type Result = { id: string; path: string; title: string; meta_description: string | null }

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)

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
    router.push(localizedPath(`/${path}`, locale))
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">⌘K</kbd>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border bg-popover shadow-2xl">
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
