'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type NavItemRow, type NavItemInput, createNavItem, updateNavItem, deleteNavItem, saveNavOrder } from '@/lib/admin/nav'

function emptyInput(): NavItemInput {
  return { label: '', labelBn: null, url: '' }
}

function NavItemForm({
  initial,
  pending,
  onCancel,
  onSubmit,
}: {
  initial: NavItemInput
  pending: boolean
  onCancel: () => void
  onSubmit: (input: NavItemInput) => void
}) {
  const [label, setLabel] = useState(initial.label)
  const [labelBn, setLabelBn] = useState(initial.labelBn ?? '')
  const [url, setUrl] = useState(initial.url)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ label, labelBn: labelBn || null, url })
      }}
      className="grid grid-cols-1 gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-3"
    >
      <label className="block space-y-1">
        <span className="text-xs font-medium">Label</span>
        <input value={label} onChange={(e) => setLabel(e.target.value)} required className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium">বাংলা label (optional)</span>
        <input value={labelBn} onChange={(e) => setLabelBn(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium">URL</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/resources or https://..."
          required
          className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
        />
      </label>
      <div className="flex items-center gap-2 sm:col-span-3">
        <Button type="submit" size="sm" disabled={pending}>Save</Button>
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

export function NavManager({ items }: { items: NavItemRow[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  function onCreate(input: NavItemInput) {
    setError(null)
    startTransition(async () => {
      try {
        await createNavItem(input)
        setCreating(false)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Create failed')
      }
    })
  }

  function onUpdate(id: string, input: NavItemInput) {
    setError(null)
    startTransition(async () => {
      try {
        await updateNavItem(id, input)
        setEditingId(null)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Update failed')
      }
    })
  }

  function onDelete(item: NavItemRow) {
    if (!confirm(`Delete "${item.label}" from the header nav?`)) return
    setError(null)
    startTransition(async () => {
      try {
        await deleteNavItem(item.id)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Delete failed')
      }
    })
  }

  function onMove(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const reordered = [...items]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(target, 0, moved)
    const updates = reordered.map((item, i) => ({ id: item.id, sort_order: i + 1 }))
    startTransition(async () => {
      await saveNavOrder(updates)
      router.refresh()
    })
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="mb-4">
        {creating ? (
          <NavItemForm initial={emptyInput()} pending={pending} onCancel={() => setCreating(false)} onSubmit={onCreate} />
        ) : (
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="size-3.5" /> New nav item
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item, i) =>
          editingId === item.id ? (
            <NavItemForm
              key={item.id}
              initial={{ label: item.label, labelBn: item.label_bn, url: item.url }}
              pending={pending}
              onCancel={() => setEditingId(null)}
              onSubmit={(input) => onUpdate(item.id, input)}
            />
          ) : (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex flex-col">
                <button type="button" disabled={i === 0 || pending} onClick={() => onMove(i, -1)} aria-label="Move up" className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ArrowUp className="size-3.5" />
                </button>
                <button type="button" disabled={i === items.length - 1 || pending} onClick={() => onMove(i, 1)} aria-label="Move down" className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ArrowDown className="size-3.5" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {item.label}
                  {item.label_bn && <span className="ml-1.5 text-xs text-muted-foreground">({item.label_bn})</span>}
                </p>
                <p className="truncate font-mono text-xs text-muted-foreground">{item.url}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditingId(item.id)} aria-label="Edit">
                  <Pencil className="size-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(item)} aria-label="Delete" className="text-destructive">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          )
        )}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No nav items yet — the header shows just the logo.</p>}
      </div>
    </div>
  )
}
