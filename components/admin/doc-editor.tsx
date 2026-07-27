'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUp, ArrowDown, Copy, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { saveDoc, type SaveDocInput } from '@/lib/admin/doc'
import { setDocStatus } from '@/lib/admin/docs'
import { computeAnchorsAndToc } from '@/lib/admin/anchors'
import { RichTextBlockEditor } from './blocks/richtext-block-editor'
import { HeadingBlockEditor } from './blocks/heading-block-editor'
import { CodeBlockEditor } from './blocks/code-block-editor'
import { TableBlockEditor } from './blocks/table-block-editor'
import { UnsupportedBlock } from './blocks/unsupported-block'
import type { Block, Doc } from '@/lib/types'

type Category = { id: string; slug: string; title: string }

// Partial<Block> would only expose fields common to every union member
// (id, type) — this distributes Partial over each variant instead, so a
// patch like { html: '...' } still type-checks as "a valid partial update
// for whichever block this actually is."
type BlockPatch = { [K in Block['type']]: Partial<Extract<Block, { type: K }>> }[Block['type']]

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const ADDABLE_TYPES: { type: Block['type']; label: string }[] = [
  { type: 'richtext', label: 'Rich text' },
  { type: 'heading', label: 'Heading' },
  { type: 'code', label: 'Code' },
  { type: 'table', label: 'Table' },
]

function newBlock(type: Block['type']): Block {
  const id = crypto.randomUUID()
  switch (type) {
    case 'richtext': return { id, type, html: '<p></p>' }
    case 'heading': return { id, type, level: 2, text: '', anchor: '' }
    case 'code': return { id, type, language: 'html', code: '' }
    case 'table': return { id, type, header: ['', ''], rows: [['', '']] }
    default: throw new Error(`Cannot create a new "${type}" block from this editor yet`)
  }
}

export function DocEditor({ doc, categories }: { doc: Doc; categories: Category[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(doc.title)
  const [slug, setSlug] = useState(doc.slug)
  const [categoryId, setCategoryId] = useState<string | null>(doc.category_id ?? null)
  const [metaTitle, setMetaTitle] = useState(doc.meta_title ?? '')
  const [metaDescription, setMetaDescription] = useState(doc.meta_description ?? '')
  const [sortOrder, setSortOrder] = useState(doc.sort_order)
  const [status, setStatus] = useState(doc.status)
  const [blocks, setBlocks] = useState<Block[]>(doc.blocks)

  // ADMIN-PLAN.md §4.8: path is locked after first publish, no redirects
  // table — a rename post-launch is rare/deliberate enough to be manual.
  const locked = doc.published_at !== null
  const categorySlug = categories.find((c) => c.id === categoryId)?.slug
  const path = locked ? doc.path : categoryId ? `${categorySlug ?? ''}/${slug}` : slug

  // Live anchor preview as headings are edited — same algorithm the save
  // action uses, so what's shown here matches what actually gets stored.
  const previewBlocks = useMemo(() => computeAnchorsAndToc(blocks).blocks, [blocks])

  function markDirty() {
    setSaved(false)
  }

  function updateBlock(id: string, patch: BlockPatch) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)))
    markDirty()
  }

  function moveBlock(id: string, dir: -1 | 1) {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id)
      const target = index + dir
      if (index === -1 || target < 0 || target >= prev.length) return prev
      const next = [...prev]
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
    markDirty()
  }

  function duplicateBlock(id: string) {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id)
      if (index === -1) return prev
      const copy = { ...prev[index], id: crypto.randomUUID() }
      const next = [...prev]
      next.splice(index + 1, 0, copy)
      return next
    })
    markDirty()
  }

  function deleteBlock(id: string) {
    if (!confirm('Delete this block?')) return
    setBlocks((prev) => prev.filter((b) => b.id !== id))
    markDirty()
  }

  function addBlockOfType(type: Block['type']) {
    setBlocks((prev) => [...prev, newBlock(type)])
    markDirty()
  }

  function buildInput(): SaveDocInput {
    return {
      title,
      slug,
      path,
      categoryId,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      sortOrder,
      blocks,
    }
  }

  function onSave() {
    setError(null)
    startTransition(async () => {
      try {
        await saveDoc(doc.id, buildInput())
        setSaved(true)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Save failed')
      }
    })
  }

  function onPublish() {
    setError(null)
    startTransition(async () => {
      try {
        // Save first — publishing must reflect current edits, never stale
        // in-DB content from before this session started.
        await saveDoc(doc.id, buildInput())
        await setDocStatus(doc.id, 'published')
        setSaved(true)
        setStatus('published')
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Publish failed')
      }
    })
  }

  function onUnpublish() {
    startTransition(async () => {
      await setDocStatus(doc.id, 'draft')
      setStatus('draft')
      router.refresh()
    })
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/admin/docs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to docs
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">{title || 'Untitled'}</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">/{path}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={status === 'published' ? 'text-xs font-medium text-emerald-600 dark:text-emerald-400' : 'text-xs font-medium text-muted-foreground'}>
            {status}
          </span>
          {!saved && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
          <Button variant="outline" size="sm" disabled={pending} onClick={onSave}>Save</Button>
          {status === 'published' ? (
            <Button variant="outline" size="sm" disabled={pending} onClick={onUnpublish}>Unpublish</Button>
          ) : (
            <Button size="sm" disabled={pending} onClick={onPublish}>Save &amp; publish</Button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); markDirty() }}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          />
        </Field>
        <Field label="Slug" hint={locked ? 'Locked — this doc has been published' : undefined}>
          <input
            value={slug}
            disabled={locked}
            onChange={(e) => { setSlug(slugify(e.target.value)); markDirty() }}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm disabled:opacity-50"
          />
        </Field>
        <Field label="Category" hint={locked ? 'Locked — this doc has been published' : undefined}>
          <select
            value={categoryId ?? ''}
            disabled={locked}
            onChange={(e) => { setCategoryId(e.target.value || null); markDirty() }}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm disabled:opacity-50"
          >
            <option value="">Standalone page (no category)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </Field>
        <Field label="Sort order">
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => { setSortOrder(Number(e.target.value)); markDirty() }}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          />
        </Field>
        <Field label="Meta title">
          <input
            value={metaTitle}
            onChange={(e) => { setMetaTitle(e.target.value); markDirty() }}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          />
        </Field>
        <Field label="Meta description">
          <input
            value={metaDescription}
            onChange={(e) => { setMetaDescription(e.target.value); markDirty() }}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          />
        </Field>
      </div>

      <div className="mt-6 space-y-3">
        {previewBlocks.map((block, i) => (
          <div key={block.id} className="flex items-start gap-2">
            <div className="flex shrink-0 flex-col gap-1 pt-2">
              <button type="button" disabled={i === 0} onClick={() => moveBlock(block.id, -1)} aria-label="Move up" className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                <ArrowUp className="size-3.5" />
              </button>
              <button type="button" disabled={i === previewBlocks.length - 1} onClick={() => moveBlock(block.id, 1)} aria-label="Move down" className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                <ArrowDown className="size-3.5" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <BlockBody block={block} onChange={(patch) => updateBlock(block.id, patch)} />
            </div>
            <div className="flex shrink-0 flex-col gap-1 pt-2">
              <button type="button" onClick={() => duplicateBlock(block.id)} aria-label="Duplicate block" className="text-muted-foreground hover:text-foreground">
                <Copy className="size-3.5" />
              </button>
              <button type="button" onClick={() => deleteBlock(block.id)} aria-label="Delete block" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground">Add block:</span>
          {ADDABLE_TYPES.map((t) => (
            <button
              key={t.type}
              type="button"
              onClick={() => addBlockOfType(t.type)}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
            >
              <Plus className="size-3" /> {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

function BlockBody({ block, onChange }: { block: Block; onChange: (patch: BlockPatch) => void }) {
  switch (block.type) {
    case 'richtext':
      return <RichTextBlockEditor html={block.html} onChange={(html) => onChange({ html })} />
    case 'heading':
      return <HeadingBlockEditor text={block.text} level={block.level} anchor={block.anchor} onChange={onChange} />
    case 'code':
      return <CodeBlockEditor code={block.code} language={block.language} filename={block.filename} onChange={onChange} />
    case 'table':
      return <TableBlockEditor header={block.header} rows={block.rows} caption={block.caption} onChange={onChange} />
    default:
      return <UnsupportedBlock block={block} />
  }
}
