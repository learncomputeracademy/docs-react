'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, IndentIncrease, IndentDecrease, CornerDownRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  type NavItemRow,
  type NavItemInput,
  createNavItem,
  updateNavItem,
  deleteNavItem,
  saveNavOrder,
  setNavParent,
} from '@/lib/admin/nav'

function emptyInput(): NavItemInput {
  return { label: '', labelBn: null, url: '', parentId: null }
}

function NavItemForm({
  initial,
  parents,
  selfId,
  pending,
  onCancel,
  onSubmit,
}: {
  initial: NavItemInput
  parents: NavItemRow[]
  selfId?: string
  pending: boolean
  onCancel: () => void
  onSubmit: (input: NavItemInput) => void
}) {
  const [label, setLabel] = useState(initial.label)
  const [labelBn, setLabelBn] = useState(initial.labelBn ?? '')
  const [url, setUrl] = useState(initial.url)
  const [parentId, setParentId] = useState(initial.parentId ?? '')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ label, labelBn: labelBn || null, url, parentId: parentId || null })
      }}
      className="grid grid-cols-1 gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-4"
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
      <label className="block space-y-1">
        <span className="text-xs font-medium">Nested under</span>
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
        >
          <option value="">— Top level —</option>
          {parents.filter((p) => p.id !== selfId).map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-2 sm:col-span-4">
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

  const roots = useMemo(
    () => items.filter((i) => !i.parent_id).sort((a, b) => a.sort_order - b.sort_order),
    [items]
  )
  const childrenOf = useMemo(() => {
    const map = new Map<string, NavItemRow[]>()
    for (const item of items) {
      if (!item.parent_id) continue
      if (!map.has(item.parent_id)) map.set(item.parent_id, [])
      map.get(item.parent_id)!.push(item)
    }
    for (const list of map.values()) list.sort((a, b) => a.sort_order - b.sort_order)
    return map
  }, [items])

  // Flattened render order with depth, so the list reads top-to-bottom the
  // way it renders in the header — same mental model as WordPress's editor.
  const flat = useMemo(() => {
    const out: { item: NavItemRow; depth: 0 | 1; siblings: NavItemRow[]; index: number }[] = []
    roots.forEach((root, i) => {
      out.push({ item: root, depth: 0, siblings: roots, index: i })
      const kids = childrenOf.get(root.id) ?? []
      kids.forEach((kid, j) => out.push({ item: kid, depth: 1, siblings: kids, index: j }))
    })
    return out
  }, [roots, childrenOf])

  function run(fn: () => Promise<void>, failMessage: string) {
    setError(null)
    startTransition(async () => {
      try {
        await fn()
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : failMessage)
      }
    })
  }

  function onCreate(input: NavItemInput) {
    run(async () => {
      await createNavItem(input)
      setCreating(false)
    }, 'Create failed')
  }

  function onUpdate(id: string, input: NavItemInput) {
    run(async () => {
      await updateNavItem(id, input)
      setEditingId(null)
    }, 'Update failed')
  }

  function onDelete(item: NavItemRow) {
    const kids = childrenOf.get(item.id) ?? []
    const warning = kids.length > 0
      ? `Delete "${item.label}" and its ${kids.length} sub-item${kids.length === 1 ? '' : 's'}? This removes them from the header too.`
      : `Delete "${item.label}" from the header nav?`
    if (!confirm(warning)) return
    run(() => deleteNavItem(item.id), 'Delete failed')
  }

  function onMove(siblings: NavItemRow[], index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= siblings.length) return
    const reordered = [...siblings]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(target, 0, moved)
    run(() => saveNavOrder(reordered.map((s, i) => ({ id: s.id, sort_order: i + 1 }))), 'Reorder failed')
  }

  // Indent = nest under the sibling directly above (WordPress's rule).
  function onIndent(index: number) {
    if (index === 0) return
    const above = roots[index - 1]
    run(() => setNavParent(roots[index].id, above.id), 'Could not nest this item')
  }

  function onOutdent(item: NavItemRow) {
    run(() => setNavParent(item.id, null), 'Could not un-nest this item')
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="mb-4">
        {creating ? (
          <NavItemForm initial={emptyInput()} parents={roots} pending={pending} onCancel={() => setCreating(false)} onSubmit={onCreate} />
        ) : (
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="size-3.5" /> New nav item
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {flat.map(({ item, depth, siblings, index }) =>
          editingId === item.id ? (
            <div key={item.id} style={{ marginLeft: depth * 32 }}>
              <NavItemForm
                initial={{ label: item.label, labelBn: item.label_bn, url: item.url, parentId: item.parent_id }}
                parents={roots}
                selfId={item.id}
                pending={pending}
                onCancel={() => setEditingId(null)}
                onSubmit={(input) => onUpdate(item.id, input)}
              />
            </div>
          ) : (
            <div
              key={item.id}
              style={{ marginLeft: depth * 32 }}
              className={depth === 1 ? 'flex items-center gap-3 rounded-lg border border-dashed bg-muted/20 p-3' : 'flex items-center gap-3 rounded-lg border p-3'}
            >
              <div className="flex flex-col">
                <button type="button" disabled={index === 0 || pending} onClick={() => onMove(siblings, index, -1)} aria-label="Move up" className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ArrowUp className="size-3.5" />
                </button>
                <button type="button" disabled={index === siblings.length - 1 || pending} onClick={() => onMove(siblings, index, 1)} aria-label="Move down" className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ArrowDown className="size-3.5" />
                </button>
              </div>

              {depth === 1 && <CornerDownRight className="size-4 shrink-0 text-muted-foreground" />}

              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {item.label}
                  {item.label_bn && <span className="ml-1.5 text-xs text-muted-foreground">({item.label_bn})</span>}
                </p>
                <p className="flex items-center gap-1 truncate font-mono text-xs text-muted-foreground">
                  {item.url.startsWith('http') && <ExternalLink className="size-3 shrink-0" />}
                  {item.url}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {depth === 0 ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={index === 0 || pending}
                    onClick={() => onIndent(index)}
                    aria-label="Nest under the item above"
                    title={index === 0 ? 'Nothing above to nest under' : `Nest under "${roots[index - 1]?.label}"`}
                  >
                    <IndentIncrease className="size-3.5" />
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" disabled={pending} onClick={() => onOutdent(item)} aria-label="Move to top level" title="Move to top level">
                    <IndentDecrease className="size-3.5" />
                  </Button>
                )}
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
