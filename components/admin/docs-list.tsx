'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  type AdminDocRow,
  setDocStatus,
  bulkPublish,
  deleteDoc,
  saveSortOrder,
  createDraftDoc,
} from '@/lib/admin/docs'

type Category = { id: string; slug: string; title: string }

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function DocsList({ docs, categories }: { docs: AdminDocRow[]; categories: Category[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [titleFilter, setTitleFilter] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [orderEdits, setOrderEdits] = useState<Record<string, number>>({})
  const [newDocOpen, setNewDocOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newCategoryId, setNewCategoryId] = useState(categories[0]?.id ?? '')

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (categoryFilter && d.category?.id !== categoryFilter) return false
      if (statusFilter && d.status !== statusFilter) return false
      if (titleFilter && !d.title.toLowerCase().includes(titleFilter.toLowerCase())) return false
      return true
    })
  }, [docs, categoryFilter, statusFilter, titleFilter])

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected((prev) => (prev.size === filtered.length ? new Set() : new Set(filtered.map((d) => d.id))))
  }

  function onOrderChange(id: string, value: string) {
    const n = Number(value)
    if (Number.isNaN(n)) return
    setOrderEdits((prev) => ({ ...prev, [id]: n }))
  }

  function saveOrder() {
    const updates = Object.entries(orderEdits).map(([id, sort_order]) => ({ id, sort_order }))
    if (updates.length === 0) return
    startTransition(async () => {
      await saveSortOrder(updates)
      setOrderEdits({})
      router.refresh()
    })
  }

  function toggleStatus(doc: AdminDocRow) {
    startTransition(async () => {
      await setDocStatus(doc.id, doc.status === 'published' ? 'draft' : 'published')
      router.refresh()
    })
  }

  function onBulkPublish() {
    if (selected.size === 0) return
    startTransition(async () => {
      await bulkPublish([...selected])
      setSelected(new Set())
      router.refresh()
    })
  }

  function onDelete(doc: AdminDocRow) {
    const ok = confirm(`Delete "${doc.title}"? This also removes its Bengali translation, if any. This cannot be undone.`)
    if (!ok) return
    startTransition(async () => {
      await deleteDoc(doc.id)
      router.refresh()
    })
  }

  function onCreateSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim() || !newSlug.trim() || !newCategoryId) return
    startTransition(async () => {
      const id = await createDraftDoc(newCategoryId, newSlug.trim(), newTitle.trim())
      router.push(`/admin/docs/${id}`)
    })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border bg-background px-2 py-1.5 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border bg-background px-2 py-1.5 text-sm"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <input
          type="text"
          placeholder="Filter by title…"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="rounded-md border bg-background px-2 py-1.5 text-sm"
        />
        <span className="text-sm text-muted-foreground">{filtered.length} of {docs.length}</span>
        <div className="ml-auto flex items-center gap-2">
          {selected.size > 0 && (
            <Button size="sm" variant="outline" disabled={pending} onClick={onBulkPublish}>
              Publish {selected.size} selected
            </Button>
          )}
          {Object.keys(orderEdits).length > 0 && (
            <Button size="sm" disabled={pending} onClick={saveOrder}>Save order</Button>
          )}
          <Button size="sm" disabled={pending} onClick={() => setNewDocOpen((v) => !v)}>New doc</Button>
        </div>
      </div>

      {newDocOpen && (
        <form onSubmit={onCreateSubmit} className="mb-4 flex flex-wrap items-end gap-2 rounded-lg border bg-muted/30 p-3">
          <div className="space-y-1">
            <label className="text-xs font-medium">Title</label>
            <input
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value)
                setNewSlug((prev) => (prev === '' || prev === slugify(newTitle) ? slugify(e.target.value) : prev))
              }}
              required
              className="block rounded-md border bg-background px-2 py-1.5 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Slug</label>
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              required
              className="block rounded-md border bg-background px-2 py-1.5 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Category</label>
            <select
              value={newCategoryId}
              onChange={(e) => setNewCategoryId(e.target.value)}
              className="block rounded-md border bg-background px-2 py-1.5 text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <Button type="submit" size="sm" disabled={pending}>Create draft</Button>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50 text-left">
            <tr>
              <th className="w-8 p-2">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} />
              </th>
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Path</th>
              <th className="p-2">Status</th>
              <th className="w-20 p-2">Order</th>
              <th className="p-2">Updated</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => (
              <tr key={doc.id} className="border-b last:border-0">
                <td className="p-2">
                  <input type="checkbox" checked={selected.has(doc.id)} onChange={() => toggleSelected(doc.id)} />
                </td>
                <td className="p-2">
                  <Link href={`/admin/docs/${doc.id}`} className="font-medium hover:text-primary">{doc.title}</Link>
                </td>
                <td className="p-2 text-muted-foreground">{doc.category?.title ?? '—'}</td>
                <td className="p-2 font-mono text-xs text-muted-foreground">{doc.path}</td>
                <td className="p-2">
                  <span className={doc.status === 'published' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}>
                    {doc.status}
                  </span>
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue={doc.sort_order}
                    onChange={(e) => onOrderChange(doc.id, e.target.value)}
                    className="w-16 rounded-md border bg-background px-1.5 py-1 text-sm"
                  />
                </td>
                <td className="p-2 text-muted-foreground">{new Date(doc.updated_at).toLocaleDateString()}</td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" disabled={pending} onClick={() => toggleStatus(doc)}>
                      {doc.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button size="sm" variant="ghost" disabled={pending} onClick={() => onDelete(doc)} className="text-destructive">
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-muted-foreground">No lessons match these filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
