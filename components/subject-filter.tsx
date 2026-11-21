'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

// Homepage subject search. The cards stay server-rendered (all of them in the
// HTML, for SEO and no-JS); this only toggles `hidden` on the ones that don't
// match, and on any group left empty. Matches the subject name and its slug,
// so "js" finds JavaScript and "ui" finds UI/UX.
export function SubjectFilter({ placeholder, emptyText }: { placeholder: string; emptyText: string }) {
  const [empty, setEmpty] = useState(false)

  function filter(value: string) {
    const q = value.trim().toLowerCase()
    const root = document.getElementById('subjects')
    if (!root) return
    let anyVisible = false
    root.querySelectorAll<HTMLElement>('[data-subject-group]').forEach((group) => {
      let groupVisible = false
      group.querySelectorAll<HTMLElement>('[data-subject]').forEach((card) => {
        const match = !q || (card.dataset.subject ?? '').includes(q)
        card.hidden = !match
        if (match) groupVisible = true
      })
      group.hidden = !groupVisible
      if (groupVisible) anyVisible = true
    })
    setEmpty(!anyVisible)
  }

  return (
    <div className="w-full sm:max-w-sm">
      <label className="relative block">
        <span className="sr-only">{placeholder}</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          onChange={(e) => filter(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-full border bg-card pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
        />
      </label>
      {empty && (
        <p role="status" className="mt-3 text-sm text-muted-foreground">
          {emptyText}
        </p>
      )}
    </div>
  )
}
