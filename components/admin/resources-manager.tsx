'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type ResourceRow, type ResourceInput, createResource, updateResource, deleteResource } from '@/lib/admin/resources'

function emptyInput(groupName = ''): ResourceInput {
  return { groupName, name: '', url: '', thumbnailUrl: null }
}

function ResourceForm({
  initial,
  pending,
  onCancel,
  onSubmit,
}: {
  initial: ResourceInput
  pending: boolean
  onCancel: () => void
  onSubmit: (input: ResourceInput) => void
}) {
  const [groupName, setGroupName] = useState(initial.groupName)
  const [name, setName] = useState(initial.name)
  const [url, setUrl] = useState(initial.url)
  const [thumbnailUrl, setThumbnailUrl] = useState(initial.thumbnailUrl ?? '')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ groupName, name, url, thumbnailUrl: thumbnailUrl || null })
      }}
      className="grid grid-cols-1 gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2"
    >
      <label className="block space-y-1">
        <span className="text-xs font-medium">Group</span>
        <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="e.g. Free images" required className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium">Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium">URL</span>
        <input value={url} onChange={(e) => setUrl(e.target.value)} type="url" required className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium">Thumbnail URL (optional)</span>
        <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
      </label>
      <div className="flex items-center gap-2 sm:col-span-2">
        <Button type="submit" size="sm" disabled={pending}>Save</Button>
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

export function ResourcesManager({ resources }: { resources: ResourceRow[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const groups = useMemo(() => {
    const map = new Map<string, ResourceRow[]>()
    for (const r of resources) {
      if (!map.has(r.group_name)) map.set(r.group_name, [])
      map.get(r.group_name)!.push(r)
    }
    return [...map.entries()]
  }, [resources])

  function onCreate(input: ResourceInput) {
    setError(null)
    startTransition(async () => {
      try {
        await createResource(input)
        setCreating(false)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Create failed')
      }
    })
  }

  function onUpdate(id: string, input: ResourceInput) {
    setError(null)
    startTransition(async () => {
      try {
        await updateResource(id, input)
        setEditingId(null)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Update failed')
      }
    })
  }

  function onDelete(resource: ResourceRow) {
    if (!confirm(`Delete "${resource.name}"?`)) return
    setError(null)
    startTransition(async () => {
      try {
        await deleteResource(resource.id)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Delete failed')
      }
    })
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="mb-4">
        {creating ? (
          <ResourceForm initial={emptyInput()} pending={pending} onCancel={() => setCreating(false)} onSubmit={onCreate} />
        ) : (
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="size-3.5" /> New resource
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {groups.map(([groupName, items]) => (
          <div key={groupName}>
            <h2 className="mb-2 font-semibold">{groupName}</h2>
            <div className="space-y-2">
              {items.map((r) =>
                editingId === r.id ? (
                  <ResourceForm
                    key={r.id}
                    initial={{ groupName: r.group_name, name: r.name, url: r.url, thumbnailUrl: r.thumbnail_url }}
                    pending={pending}
                    onCancel={() => setEditingId(null)}
                    onSubmit={(input) => onUpdate(r.id, input)}
                  />
                ) : (
                  <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="min-w-0">
                      <p className="font-medium">{r.name}</p>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="truncate text-xs text-muted-foreground hover:text-primary hover:underline">
                        {r.url}
                      </a>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(r.id)} aria-label="Edit">
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(r)} aria-label="Delete" className="text-destructive">
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
        {resources.length === 0 && <p className="text-sm text-muted-foreground">No resources yet.</p>}
      </div>
    </div>
  )
}
