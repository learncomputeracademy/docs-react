'use client'

import { useMemo, useOptimistic, useState, useTransition } from 'react'
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

// Every mutation is expressed as one of these and applied to `items` via
// useOptimistic before the server call resolves — the list reorders/nests/
// updates instantly, then silently reconciles with the real row once
// router.refresh() lands. If the server call throws, the transition ends
// without new `items` ever arriving, so React reverts to the pre-action
// list on its own — no manual rollback needed.
type NavAction =
  | { type: 'move'; ids: string[] }
  | { type: 'setParent'; id: string; parentId: string | null; newSortOrder: number }
  | { type: 'update'; id: string; input: NavItemInput }
  | { type: 'delete'; id: string }
  | { type: 'create'; tempItem: NavItemRow }

function navReducer(state: NavItemRow[], action: NavAction): NavItemRow[] {
  switch (action.type) {
    case 'move': {
      const order = new Map(action.ids.map((id, i) => [id, i + 1]))
      return state.map((it) => (order.has(it.id) ? { ...it, sort_order: order.get(it.id)! } : it))
    }
    case 'setParent':
      return state.map((it) => (it.id === action.id ? { ...it, parent_id: action.parentId, sort_order: action.newSortOrder } : it))
    case 'update':
      return state.map((it) =>
        it.id === action.id ? { ...it, label: action.input.label, label_bn: action.input.labelBn, url: action.input.url, parent_id: action.input.parentId } : it
      )
    case 'delete': {
      // Mirrors the DB's on-delete cascade (migration 008): dropping a
      // parent optimistically drops its children too, same as the real write.
      const removed = new Set([action.id])
      for (const it of state) if (it.parent_id === action.id) removed.add(it.id)
      return state.filter((it) => !removed.has(it.id))
    }
    case 'create':
      return [...state, action.tempItem]
  }
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
  const [optimisticItems, applyOptimistic] = useOptimistic(items, navReducer)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const roots = useMemo(
    () => optimisticItems.filter((i) => !i.parent_id).sort((a, b) => a.sort_order - b.sort_order),
    [optimisticItems]
  )
  const childrenOf = useMemo(() => {
    const map = new Map<string, NavItemRow[]>()
    for (const item of optimisticItems) {
      if (!item.parent_id) continue
      if (!map.has(item.parent_id)) map.set(item.parent_id, [])
      map.get(item.parent_id)!.push(item)
    }
    for (const list of map.values()) list.sort((a, b) => a.sort_order - b.sort_order)
    return map
  }, [optimisticItems])

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

  function run(action: NavAction, fn: () => Promise<void>, failMessage: string) {
    setError(null)
    startTransition(async () => {
      applyOptimistic(action)
      try {
        await fn()
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : failMessage)
      }
    })
  }

  function onCreate(input: NavItemInput) {
    const siblingCount = input.parentId ? (childrenOf.get(input.parentId)?.length ?? 0) : roots.length
    const tempItem: NavItemRow = {
      id: `temp-${Date.now()}`,
      label: input.label,
      label_bn: input.labelBn,
      url: input.url,
      parent_id: input.parentId,
      sort_order: siblingCount + 1,
    }
    setCreating(false)
    run({ type: 'create', tempItem }, () => createNavItem(input), 'Create failed')
  }

  function onUpdate(id: string, input: NavItemInput) {
    setEditingId(null)
    run({ type: 'update', id, input }, () => updateNavItem(id, input), 'Update failed')
  }

  function onDelete(item: NavItemRow) {
    const kids = childrenOf.get(item.id) ?? []
    const warning = kids.length > 0
      ? `Delete "${item.label}" and its ${kids.length} sub-item${kids.length === 1 ? '' : 's'}? This removes them from the header too.`
      : `Delete "${item.label}" from the header nav?`
    if (!confirm(warning)) return
    run({ type: 'delete', id: item.id }, () => deleteNavItem(item.id), 'Delete failed')
  }

  function onMove(siblings: NavItemRow[], index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= siblings.length) return
    const reordered = [...siblings]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(target, 0, moved)
    const ids = reordered.map((s) => s.id)
    run({ type: 'move', ids }, () => saveNavOrder(ids.map((id, i) => ({ id, sort_order: i + 1 }))), 'Reorder failed')
  }

  // Indent = nest under the sibling directly above (WordPress's rule).
  function onIndent(index: number) {
    if (index === 0) return
    const above = roots[index - 1]
    const item = roots[index]
    const newSortOrder = (childrenOf.get(above.id)?.length ?? 0) + 1
    run({ type: 'setParent', id: item.id, parentId: above.id, newSortOrder }, () => setNavParent(item.id, above.id), 'Could not nest this item')
  }

  function onOutdent(item: NavItemRow) {
    const newSortOrder = roots.length + 1
    run({ type: 'setParent', id: item.id, parentId: null, newSortOrder }, () => setNavParent(item.id, null), 'Could not un-nest this item')
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
        {optimisticItems.length === 0 && <p className="text-sm text-muted-foreground">No nav items yet — the header shows just the logo.</p>}
      </div>
    </div>
  )
}
