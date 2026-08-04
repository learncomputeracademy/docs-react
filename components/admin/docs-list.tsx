'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  type AdminDocRow,
  setDocStatus,
  bulkPublish,
  deleteDoc,
  saveSortOrder,
  createDraftDoc,
} from '@/lib/admin/docs'
import { saveCategoryOrder } from '@/lib/admin/categories'
import { slugify } from '@/lib/utils'

type Category = { id: string; slug: string; title: string }

type RowProps = {
  doc: AdminDocRow
  selected: boolean
  onToggleSelected: () => void
  onToggleStatus: () => void
  onDelete: () => void
  pending: boolean
  canDelete: boolean
}

// Shared row markup for both the sortable (drag+arrows) and plain (filtered
// browse, no reorder — see reorderDisabled below) presentations.
function RowContent(
  props: RowProps & {
    dragHandleProps?: Record<string, unknown>
    moveButtons?: { onMoveUp: () => void; onMoveDown: () => void; isFirst: boolean; isLast: boolean }
  }
) {
  const { doc, selected, onToggleSelected, onToggleStatus, onDelete, pending, canDelete, dragHandleProps, moveButtons } = props
  return (
    <div className="flex items-center gap-3 border-b bg-background px-4 py-2.5 last:border-0">
      {dragHandleProps && (
        <button
          type="button"
          {...dragHandleProps}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-4" />
        </button>
      )}
      {moveButtons && (
        <div className="flex flex-col">
          <button
            type="button"
            disabled={moveButtons.isFirst}
            onClick={moveButtons.onMoveUp}
            aria-label="Move up"
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ArrowUp className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={moveButtons.isLast}
            onClick={moveButtons.onMoveDown}
            aria-label="Move down"
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ArrowDown className="size-3.5" />
          </button>
        </div>
      )}
      <input type="checkbox" checked={selected} onChange={onToggleSelected} />
      <Link href={`/admin/docs/${doc.id}`} className="min-w-0 flex-1 truncate font-medium hover:text-primary">
        {doc.title}
      </Link>
      <span className="hidden font-mono text-xs text-muted-foreground sm:inline">{doc.path}</span>
      <span className={doc.status === 'published' ? 'text-xs text-emerald-600 dark:text-emerald-400' : 'text-xs text-muted-foreground'}>
        {doc.status}
      </span>
      <Button size="sm" variant="ghost" disabled={pending} onClick={onToggleStatus}>
        {doc.status === 'published' ? 'Unpublish' : 'Publish'}
      </Button>
      {canDelete && (
        <Button size="sm" variant="ghost" disabled={pending} onClick={onDelete} className="text-destructive">
          Delete
        </Button>
      )}
    </div>
  )
}

function SortableDocRow(props: RowProps & { onMoveUp: () => void; onMoveDown: () => void; isFirst: boolean; isLast: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.doc.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  return (
    <div ref={setNodeRef} style={style}>
      <RowContent
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
        moveButtons={{ onMoveUp: props.onMoveUp, onMoveDown: props.onMoveDown, isFirst: props.isFirst, isLast: props.isLast }}
      />
    </div>
  )
}

type CategoryGroup = { category: Category; allDocs: AdminDocRow[]; visibleDocs: AdminDocRow[] }

// Same shared-content + sortable-wrapper split as the doc rows above, just
// for the category headers instead. The drag handle and arrow buttons are
// separate elements from the expand/collapse button so a drag gesture
// starting on the handle never fires the toggle's click handler.
function CategoryHeaderContent({
  group,
  isOpen,
  onToggle,
  dragHandleProps,
  moveButtons,
}: {
  group: CategoryGroup
  isOpen: boolean
  onToggle: () => void
  dragHandleProps?: Record<string, unknown>
  moveButtons?: { onMoveUp: () => void; onMoveDown: () => void; isFirst: boolean; isLast: boolean }
}) {
  return (
    <div className="flex items-center gap-1 bg-background px-2">
      {dragHandleProps && (
        <button
          type="button"
          {...dragHandleProps}
          className="cursor-grab touch-none p-2 text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder category"
        >
          <GripVertical className="size-4" />
        </button>
      )}
      {moveButtons && (
        <div className="flex flex-col">
          <button
            type="button"
            disabled={moveButtons.isFirst}
            onClick={moveButtons.onMoveUp}
            aria-label="Move category up"
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ArrowUp className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={moveButtons.isLast}
            onClick={moveButtons.onMoveDown}
            aria-label="Move category down"
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ArrowDown className="size-3.5" />
          </button>
        </div>
      )}
      <button type="button" onClick={onToggle} className="flex flex-1 items-center justify-between py-3 pl-1 text-left">
        <span className="font-medium">{group.category.title}</span>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          {group.visibleDocs.length} of {group.allDocs.length}
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </span>
      </button>
    </div>
  )
}

function SortableCategoryHeader(
  props: Omit<Parameters<typeof CategoryHeaderContent>[0], 'dragHandleProps' | 'moveButtons'> & {
    onMoveUp: () => void
    onMoveDown: () => void
    isFirst: boolean
    isLast: boolean
  }
) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.group.category.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  return (
    <div ref={setNodeRef} style={style}>
      <CategoryHeaderContent
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
        moveButtons={{ onMoveUp: props.onMoveUp, onMoveDown: props.onMoveDown, isFirst: props.isFirst, isLast: props.isLast }}
      />
    </div>
  )
}

export function DocsList({ docs, categories, canDelete }: { docs: AdminDocRow[]; categories: Category[]; canDelete: boolean }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [titleFilter, setTitleFilter] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  const [newDocOpen, setNewDocOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newCategoryId, setNewCategoryId] = useState(categories[0]?.id ?? '')
  // Categories arrive pre-sorted by sort_order (listCategoriesForAdmin);
  // this is the client-side order that reordering (drag/arrows) mutates,
  // kept separate from `categories` itself so a reorder doesn't need to
  // wait on router.refresh() to feel instant.
  const [categoryOrder, setCategoryOrder] = useState(() => categories.map((c) => c.id))
  // Same idea, one order array per category, for reordering docs within a
  // category — keyed by category id since sort_order is scoped per category
  // (saveSortOrder), not global.
  const [docOrderByCategory, setDocOrderByCategory] = useState<Map<string, string[]>>(() => {
    const map = new Map<string, string[]>()
    for (const cat of categories) {
      map.set(
        cat.id,
        docs.filter((d) => d.category?.id === cat.id).sort((a, b) => a.sort_order - b.sort_order).map((d) => d.id)
      )
    }
    return map
  })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  // Drag-and-drop and the arrow buttons both need the FULL, unfiltered
  // order of a category to stay correct — reordering a status/title-
  // filtered subset would silently corrupt the sequence for the rows
  // hidden by the filter. Disable reordering rather than risk that.
  const reorderDisabled = statusFilter !== '' || titleFilter !== ''
  // A single filtered-to-one category has nothing to reorder against.
  const categoryReorderDisabled = categoryFilter !== ''

  const orderedCategories = useMemo(() => {
    const byId = new Map(categories.map((c) => [c.id, c]))
    return categoryOrder.map((id) => byId.get(id)).filter((c): c is Category => Boolean(c))
  }, [categories, categoryOrder])

  const groups = useMemo((): CategoryGroup[] => {
    const byCategory = new Map<string, AdminDocRow[]>()
    for (const cat of categories) byCategory.set(cat.id, [])
    for (const doc of docs) {
      if (doc.category) byCategory.get(doc.category.id)?.push(doc)
    }
    for (const list of byCategory.values()) list.sort((a, b) => a.sort_order - b.sort_order)

    // Apply the optimistic per-category order on top of the server-sorted
    // list. Any doc not yet in docOrderByCategory (created or moved into
    // this category since the last full load) falls back to its
    // server sort_order position, appended after the known ones.
    for (const [categoryId, serverSorted] of byCategory) {
      const order = docOrderByCategory.get(categoryId)
      if (!order) continue
      const byId = new Map(serverSorted.map((d) => [d.id, d]))
      const known = order.map((id) => byId.get(id)).filter((d): d is AdminDocRow => Boolean(d))
      const knownIds = new Set(known.map((d) => d.id))
      const unknown = serverSorted.filter((d) => !knownIds.has(d.id))
      byCategory.set(categoryId, [...known, ...unknown])
    }

    return orderedCategories
      .filter((c) => !categoryFilter || c.id === categoryFilter)
      .map((c) => {
        const allDocs = byCategory.get(c.id) ?? []
        const visibleDocs = allDocs.filter((d) => {
          if (statusFilter && d.status !== statusFilter) return false
          if (titleFilter && !d.title.toLowerCase().includes(titleFilter.toLowerCase())) return false
          return true
        })
        return { category: c, allDocs, visibleDocs }
      })
  }, [docs, categories, orderedCategories, docOrderByCategory, categoryFilter, statusFilter, titleFilter])

  const totalVisible = groups.reduce((sum, g) => sum + g.visibleDocs.length, 0)

  function toggleGroup(id: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function persistOrder(categoryId: string, orderedIds: string[]) {
    setDocOrderByCategory((prev) => {
      const next = new Map(prev)
      next.set(categoryId, orderedIds)
      return next
    })
    const updates = orderedIds.map((id, i) => ({ id, sort_order: i + 1 }))
    startTransition(async () => {
      await saveSortOrder(updates)
      router.refresh()
    })
  }

  function onDragEnd(categoryId: string, allDocs: AdminDocRow[]) {
    return (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      const oldIndex = allDocs.findIndex((d) => d.id === active.id)
      const newIndex = allDocs.findIndex((d) => d.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      persistOrder(categoryId, arrayMove(allDocs, oldIndex, newIndex).map((d) => d.id))
    }
  }

  function moveByOne(categoryId: string, allDocs: AdminDocRow[], docId: string, direction: -1 | 1) {
    const index = allDocs.findIndex((d) => d.id === docId)
    const target = index + direction
    if (index === -1 || target < 0 || target >= allDocs.length) return
    persistOrder(categoryId, arrayMove(allDocs, index, target).map((d) => d.id))
  }

  function persistCategoryOrder(orderedIds: string[]) {
    setCategoryOrder(orderedIds)
    startTransition(async () => {
      await saveCategoryOrder(orderedIds)
      router.refresh()
    })
  }

  function onCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = categoryOrder.findIndex((id) => id === active.id)
    const newIndex = categoryOrder.findIndex((id) => id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    persistCategoryOrder(arrayMove(categoryOrder, oldIndex, newIndex))
  }

  function moveCategoryByOne(categoryId: string, direction: -1 | 1) {
    const index = categoryOrder.findIndex((id) => id === categoryId)
    const target = index + direction
    if (index === -1 || target < 0 || target >= categoryOrder.length) return
    persistCategoryOrder(arrayMove(categoryOrder, index, target))
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
    const ok = confirm(`Delete "${doc.title}"? It moves to Trash and can be restored later.`)
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
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-md border bg-background px-2 py-1.5 text-sm">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border bg-background px-2 py-1.5 text-sm">
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
        <span className="text-sm text-muted-foreground">{totalVisible} of {docs.length}</span>
        <div className="ml-auto flex items-center gap-2">
          {selected.size > 0 && (
            <Button size="sm" variant="outline" disabled={pending} onClick={onBulkPublish}>
              Publish {selected.size} selected
            </Button>
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
            <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} required className="block rounded-md border bg-background px-2 py-1.5 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Category</label>
            <select value={newCategoryId} onChange={(e) => setNewCategoryId(e.target.value)} className="block rounded-md border bg-background px-2 py-1.5 text-sm">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <Button type="submit" size="sm" disabled={pending}>Create draft</Button>
        </form>
      )}

      <div className="space-y-3">
        {categoryReorderDisabled && (
          <p className="rounded-lg border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
            Clear the category filter to drag-and-drop or reorder the categories themselves.
          </p>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={categoryReorderDisabled ? undefined : onCategoryDragEnd}
        >
          <SortableContext items={groups.map((g) => g.category.id)} strategy={verticalListSortingStrategy}>
            {groups.map((group, groupIndex) => {
              const { category, allDocs, visibleDocs } = group
              const isOpen = openGroups.has(category.id) || categoryFilter === category.id
              const header = categoryReorderDisabled ? (
                <CategoryHeaderContent group={group} isOpen={isOpen} onToggle={() => toggleGroup(category.id)} />
              ) : (
                <SortableCategoryHeader
                  group={group}
                  isOpen={isOpen}
                  onToggle={() => toggleGroup(category.id)}
                  onMoveUp={() => moveCategoryByOne(category.id, -1)}
                  onMoveDown={() => moveCategoryByOne(category.id, 1)}
                  isFirst={groupIndex === 0}
                  isLast={groupIndex === groups.length - 1}
                />
              )
              return (
            <div key={category.id} className="overflow-hidden rounded-lg border">
              {header}
              {isOpen && (
                <div className="border-t">
                  {reorderDisabled && (
                    <p className="border-b bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                      Clear the status/title filter to drag-and-drop or reorder this category.
                    </p>
                  )}
                  {reorderDisabled ? (
                    visibleDocs.map((doc) => (
                      <RowContent
                        key={doc.id}
                        doc={doc}
                        selected={selected.has(doc.id)}
                        onToggleSelected={() => toggleSelected(doc.id)}
                        onToggleStatus={() => toggleStatus(doc)}
                        onDelete={() => onDelete(doc)}
                        pending={pending}
                        canDelete={canDelete}
                      />
                    ))
                  ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd(category.id, allDocs)}>
                      <SortableContext items={allDocs.map((d) => d.id)} strategy={verticalListSortingStrategy}>
                        {allDocs.map((doc, i) => (
                          <SortableDocRow
                            key={doc.id}
                            doc={doc}
                            selected={selected.has(doc.id)}
                            onToggleSelected={() => toggleSelected(doc.id)}
                            onToggleStatus={() => toggleStatus(doc)}
                            onDelete={() => onDelete(doc)}
                            onMoveUp={() => moveByOne(category.id, allDocs, doc.id, -1)}
                            onMoveDown={() => moveByOne(category.id, allDocs, doc.id, 1)}
                            isFirst={i === 0}
                            isLast={i === allDocs.length - 1}
                            pending={pending}
                            canDelete={canDelete}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  )}
                  {visibleDocs.length === 0 && <p className="px-4 py-3 text-sm text-muted-foreground">No lessons match these filters.</p>}
                </div>
              )}
            </div>
              )
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
