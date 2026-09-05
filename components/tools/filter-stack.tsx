'use client'

import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { Slider, Section } from '@/components/tools/tool-controls'
import { cn } from '@/lib/utils'
import { uid } from '@/lib/utils'
import { FILTER_TYPES, FILTER_DEFS, makeFilterOp, type FilterOp, type FilterFnType } from '@/lib/filters'
import type { fs } from '@/lib/filters-i18n'

type Strings = ReturnType<typeof fs>

function RowContent({
  op, active, onSelect, onToggle, onDelete, canDelete, s, dragHandleProps,
}: {
  op: FilterOp
  active: boolean
  onSelect: () => void
  onToggle: () => void
  onDelete: () => void
  canDelete: boolean
  s: Strings
  dragHandleProps?: Record<string, unknown>
}) {
  return (
    <div className={cn('flex items-center gap-2 border-b bg-card px-2 py-1.5 text-sm last:border-b-0', active && 'bg-accent/60')}>
      <span {...dragHandleProps} className="cursor-grab text-muted-foreground touch-none" title={s.dragToReorder}>
        <GripVertical className="size-3.5" />
      </span>
      <input type="checkbox" checked={op.enabled} onChange={onToggle} title={op.enabled ? s.enabled : s.disabled} />
      <button type="button" onClick={onSelect} className={cn('flex-1 text-left font-mono text-xs', !op.enabled && 'text-muted-foreground line-through')}>
        {s.functionNames[op.type]}
      </button>
      {canDelete && (
        <button type="button" onClick={onDelete} title={s.deleteFilter} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  )
}

function SortableRow(props: Parameters<typeof RowContent>[0] & { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  return (
    <div ref={setNodeRef} style={style}>
      <RowContent {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  )
}

export function FilterStack({
  dndId, title, description, stack, onChange, s,
}: {
  // dnd-kit's DndContext auto-generates its own accessibility-description
  // id from a module-scoped mount counter when this prop is omitted — fine
  // with exactly one DndContext on a page (every other tool here), but this
  // is the first page with two, and that counter isn't guaranteed to reach
  // the same value on the server render and the client hydration render,
  // producing a real hydration mismatch (caught live: `aria-describedby`
  // was "DndDescribedBy-2" server-side, "DndDescribedBy-1" client-side).
  // Passing a stable id here is dnd-kit's own documented fix.
  dndId: string
  title: string
  description: string
  stack: FilterOp[]
  onChange: (next: FilterOp[]) => void
  s: Strings
}) {
  const [activeId, setActiveId] = useState<string | null>(stack[0]?.id ?? null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const active = stack.find((o) => o.id === activeId) ?? null

  function addFilter(type: FilterFnType) {
    const op = makeFilterOp(type, uid())
    onChange([...stack, op])
    setActiveId(op.id)
  }
  function updateOp(id: string, patch: Partial<FilterOp>) {
    onChange(stack.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  }
  function deleteOp(id: string) {
    const next = stack.filter((o) => o.id !== id)
    onChange(next)
    if (activeId === id) setActiveId(next[0]?.id ?? null)
  }
  function onDragEnd(event: DragEndEvent) {
    const { active: a, over } = event
    if (!over || a.id === over.id) return
    const oldIndex = stack.findIndex((o) => o.id === a.id)
    const newIndex = stack.findIndex((o) => o.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onChange(arrayMove(stack, oldIndex, newIndex))
  }

  return (
    <Section title={title}>
      <p className="text-xs text-muted-foreground">{description}</p>

      {stack.length === 0 ? (
        <p className="py-2 text-center text-xs text-muted-foreground">{s.empty}</p>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={stack.map((o) => o.id)} strategy={verticalListSortingStrategy}>
              {stack.map((op) => (
                <SortableRow
                  key={op.id}
                  id={op.id}
                  op={op}
                  active={op.id === activeId}
                  onSelect={() => setActiveId(op.id)}
                  onToggle={() => updateOp(op.id, { enabled: !op.enabled })}
                  onDelete={() => deleteOp(op.id)}
                  canDelete
                  s={s}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {FILTER_TYPES.map((t) => (
          <button key={t} type="button" onClick={() => addFilter(t)} className="flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-xs hover:border-primary/50 hover:bg-accent/50">
            <Plus className="size-3" /> {s.functionNames[t]}
          </button>
        ))}
      </div>

      {active && (
        <div className="space-y-2 rounded-md border p-2">
          <p className="text-xs text-muted-foreground">{s.functionDesc[active.type]}</p>
          {active.type === 'drop-shadow' ? (
            <>
              <div className="grid grid-cols-2 gap-x-3">
                <Slider label={s.shadowX} value={active.shadow.x} min={-40} max={40} step={1} suffix="px" onChange={(x) => updateOp(active.id, { shadow: { ...active.shadow, x } })} />
                <Slider label={s.shadowY} value={active.shadow.y} min={-40} max={40} step={1} suffix="px" onChange={(y) => updateOp(active.id, { shadow: { ...active.shadow, y } })} />
              </div>
              <Slider label={s.shadowBlur} value={active.shadow.blur} min={0} max={40} step={1} suffix="px" onChange={(blur) => updateOp(active.id, { shadow: { ...active.shadow, blur } })} />
              <label className="block text-xs">
                <span className="mb-1 block text-muted-foreground">{s.shadowColor}</span>
                <input type="color" value={active.shadow.color.slice(0, 7)} onChange={(e) => updateOp(active.id, { shadow: { ...active.shadow, color: e.target.value } })} className="h-8 w-full rounded-md border" />
              </label>
            </>
          ) : (
            <Slider
              label={s.functionNames[active.type]}
              value={active.amount}
              min={FILTER_DEFS[active.type].min}
              max={FILTER_DEFS[active.type].max}
              step={FILTER_DEFS[active.type].step}
              suffix={FILTER_DEFS[active.type].unit}
              onChange={(amount) => updateOp(active.id, { amount })}
            />
          )}
        </div>
      )}
    </Section>
  )
}
