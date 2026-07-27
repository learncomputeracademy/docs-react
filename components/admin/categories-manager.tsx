'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type CategoryRow, type CategoryInput, createCategory, updateCategory, deleteCategory } from '@/lib/admin/categories'

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function emptyInput(): CategoryInput {
  return { slug: '', title: '', titleBn: null, description: null }
}

function CategoryForm({
  initial,
  pending,
  onCancel,
  onSubmit,
}: {
  initial: CategoryInput
  pending: boolean
  onCancel: () => void
  onSubmit: (input: CategoryInput) => void
}) {
  const [slug, setSlug] = useState(initial.slug)
  const [title, setTitle] = useState(initial.title)
  const [titleBn, setTitleBn] = useState(initial.titleBn ?? '')
  const [description, setDescription] = useState(initial.description ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ slug, title, titleBn: titleBn || null, description: description || null })
      }}
      className="grid grid-cols-1 gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2"
    >
      <label className="block space-y-1">
        <span className="text-xs font-medium">Title</span>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (!slugTouched) setSlug(slugify(e.target.value))
          }}
          required
          className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium">Slug</span>
        <input
          value={slug}
          onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true) }}
          required
          className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium">Title (বাংলা, optional)</span>
        <input value={titleBn} onChange={(e) => setTitleBn(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium">Description (optional)</span>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
      </label>
      <div className="flex items-center gap-2 sm:col-span-2">
        <Button type="submit" size="sm" disabled={pending}>Save</Button>
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  function onCreate(input: CategoryInput) {
    setError(null)
    startTransition(async () => {
      try {
        await createCategory(input)
        setCreating(false)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Create failed')
      }
    })
  }

  function onUpdate(id: string, input: CategoryInput) {
    setError(null)
    startTransition(async () => {
      try {
        await updateCategory(id, input)
        setEditingId(null)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Update failed')
      }
    })
  }

  function onDelete(category: CategoryRow) {
    setError(null)
    if (category.doc_count > 0) {
      setError(`"${category.title}" still has ${category.doc_count} lesson(s) in it. Move or delete them first.`)
      return
    }
    if (!confirm(`Delete "${category.title}"?`)) return
    startTransition(async () => {
      try {
        await deleteCategory(category.id)
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
          <CategoryForm initial={emptyInput()} pending={pending} onCancel={() => setCreating(false)} onSubmit={onCreate} />
        ) : (
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="size-3.5" /> New category
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {categories.map((c) =>
          editingId === c.id ? (
            <CategoryForm
              key={c.id}
              initial={{ slug: c.slug, title: c.title, titleBn: c.title_bn, description: c.description }}
              pending={pending}
              onCancel={() => setEditingId(null)}
              onSubmit={(input) => onUpdate(c.id, input)}
            />
          ) : (
            <div key={c.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="min-w-0">
                <p className="font-medium">
                  {c.title} {c.title_bn && <span className="text-muted-foreground">— {c.title_bn}</span>}
                </p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">/{c.slug} · {c.doc_count} lesson{c.doc_count === 1 ? '' : 's'}</p>
                {c.description && <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditingId(c.id)} aria-label="Edit">
                  <Pencil className="size-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(c)} aria-label="Delete" className="text-destructive">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
