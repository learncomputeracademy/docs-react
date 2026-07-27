'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createTranslation, saveTranslation, deleteTranslation, type TranslationRow } from '@/lib/admin/translation'
import { RichTextBlockEditor } from './blocks/richtext-block-editor'
import { HeadingBlockEditor } from './blocks/heading-block-editor'
import { TableBlockEditor } from './blocks/table-block-editor'
import { CalloutBlockEditor } from './blocks/callout-block-editor'
import type { Block, Doc } from '@/lib/types'

type BlockPatch = { [K in Block['type']]: Partial<Extract<Block, { type: K }>> }[Block['type']]

// richtext/heading/table/callout carry translatable prose. Everything else
// (code, image, loop, file, video, tryit, quiz) stays byte-identical to
// English — code in particular must never drift (ADMIN-PLAN.md §5), and
// the rest have no natural "translated" content of their own today.
const TRANSLATABLE = new Set<Block['type']>(['richtext', 'heading', 'table', 'callout'])

function typeLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function TranslationEditor({ doc, translation: initial }: { doc: Doc; translation: TranslationRow | null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [translation, setTranslation] = useState(initial)
  const [saved, setSaved] = useState(true)
  const [title, setTitle] = useState(initial?.title ?? doc.title)
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? '')
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? '')
  const [blocks, setBlocks] = useState<Block[]>(initial?.blocks ?? [])

  const bengaliById = new Map(blocks.map((b) => [b.id, b]))

  function onCreate() {
    startTransition(async () => {
      const t = await createTranslation(doc.id, doc.title, doc.blocks)
      setTranslation(t)
      setTitle(t.title)
      setBlocks(t.blocks)
    })
  }

  function updateBlock(id: string, patch: BlockPatch) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)))
    setSaved(false)
  }

  function copyFromEnglish(englishBlock: Block) {
    setBlocks((prev) => {
      const exists = prev.some((b) => b.id === englishBlock.id)
      return exists ? prev.map((b) => (b.id === englishBlock.id ? englishBlock : b)) : [...prev, englishBlock]
    })
    setSaved(false)
  }

  function onSave() {
    setError(null)
    startTransition(async () => {
      try {
        await saveTranslation(doc.id, doc.blocks, {
          title,
          metaTitle: metaTitle || null,
          metaDescription: metaDescription || null,
          blocks,
        })
        setSaved(true)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Save failed')
      }
    })
  }

  function onDelete() {
    const ok = confirm('Delete the Bengali translation? The page will fall back to showing English with a "not yet translated" banner.')
    if (!ok) return
    startTransition(async () => {
      await deleteTranslation(doc.id)
      router.push(`/admin/docs/${doc.id}`)
    })
  }

  if (!translation) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link href={`/admin/docs/${doc.id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to editor
        </Link>
        <h1 className="mt-4 text-xl font-bold">{doc.title} — বাংলা</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No Bengali translation yet. Creating one clones the English content as a starting point to translate from.
        </p>
        <Button className="mt-4" disabled={pending} onClick={onCreate}>Create Bengali translation</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link href={`/admin/docs/${doc.id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to editor
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">{doc.title} — বাংলা</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">/bn/{doc.path}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!saved && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
          <Button variant="outline" size="sm" disabled={pending} onClick={onDelete} className="text-destructive">Delete translation</Button>
          <Button size="sm" disabled={pending} onClick={onSave}>Save</Button>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-xs font-medium">Title (বাংলা)</span>
          <input value={title} onChange={(e) => { setTitle(e.target.value); setSaved(false) }} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
        </label>
        <div />
        <label className="block space-y-1">
          <span className="text-xs font-medium">Meta title (বাংলা)</span>
          <input value={metaTitle} onChange={(e) => { setMetaTitle(e.target.value); setSaved(false) }} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium">Meta description (বাংলা)</span>
          <input value={metaDescription} onChange={(e) => { setMetaDescription(e.target.value); setSaved(false) }} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
        </label>
      </div>

      <div className="mt-6 space-y-4">
        {doc.blocks.map((englishBlock) => {
          const bengaliBlock = bengaliById.get(englishBlock.id)
          const translatable = TRANSLATABLE.has(englishBlock.type)

          return (
            <div key={englishBlock.id} className="grid grid-cols-1 gap-3 rounded-lg border p-3 md:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">English — {typeLabel(englishBlock.type)}</p>
                <EnglishPreview block={englishBlock} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">বাংলা</p>
                  {translatable && (
                    <button type="button" onClick={() => copyFromEnglish(englishBlock)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <Copy className="size-3" /> Copy from English
                    </button>
                  )}
                </div>
                {!translatable ? (
                  <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                    {typeLabel(englishBlock.type)} blocks stay identical to English — not translated here.
                  </p>
                ) : !bengaliBlock ? (
                  <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">Not translated yet.</p>
                ) : (
                  <BengaliBlockBody block={bengaliBlock} onChange={(patch) => updateBlock(bengaliBlock.id, patch)} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EnglishPreview({ block }: { block: Block }) {
  switch (block.type) {
    case 'richtext':
    case 'callout':
      return <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border p-2" dangerouslySetInnerHTML={{ __html: block.html }} />
    case 'heading':
      return <p className="rounded-md border p-2 text-sm font-semibold">{'#'.repeat(block.level - 1)} {block.text}</p>
    case 'table':
      return (
        <div className="overflow-x-auto rounded-md border p-2 text-xs">
          <table className="w-full border-collapse">
            <thead>
              <tr>{block.header.map((h, i) => <th key={i} className="border px-1 py-0.5 text-left" dangerouslySetInnerHTML={{ __html: h }} />)}</tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>{row.map((c, j) => <td key={j} className="border px-1 py-0.5" dangerouslySetInnerHTML={{ __html: c }} />)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'code':
      return <pre className="overflow-x-auto rounded-md border bg-muted p-2 text-xs"><code>{block.code}</code></pre>
    default:
      return <p className="rounded-md border p-2 text-xs text-muted-foreground">({block.type} block)</p>
  }
}

function BengaliBlockBody({ block, onChange }: { block: Block; onChange: (patch: BlockPatch) => void }) {
  switch (block.type) {
    case 'richtext':
      return <RichTextBlockEditor html={block.html} onChange={(html) => onChange({ html })} />
    case 'heading':
      return <HeadingBlockEditor text={block.text} level={block.level} anchor={block.anchor} onChange={onChange} />
    case 'table':
      return <TableBlockEditor header={block.header} rows={block.rows} caption={block.caption} onChange={onChange} />
    case 'callout':
      return <CalloutBlockEditor variant={block.variant} title={block.title} html={block.html} onChange={onChange} />
    default:
      return null
  }
}
