'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Paperclip, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NoteEditor } from '@/components/admin/note-editor'
import { type NoteRow, createNote, updateNote, deleteNote, uploadNoteAttachment, removeNoteAttachment } from '@/lib/admin/notes'

function formatRelative(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export function NotesManager({ notes }: { notes: NoteRow[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id ?? null)
  const [title, setTitle] = useState(notes[0]?.title ?? '')
  const [bodyHtml, setBodyHtml] = useState(notes[0]?.body_html ?? '')
  const [dirty, setDirty] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selected = notes.find((n) => n.id === selectedId) ?? null

  function select(note: NoteRow) {
    setSelectedId(note.id)
    setTitle(note.title)
    setBodyHtml(note.body_html)
    setDirty(false)
  }

  function onCreate() {
    setError(null)
    startTransition(async () => {
      try {
        const note = await createNote()
        select(note)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Create failed')
      }
    })
  }

  function onSave() {
    if (!selected) return
    setError(null)
    startTransition(async () => {
      try {
        await updateNote(selected.id, { title, bodyHtml })
        setDirty(false)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Save failed')
      }
    })
  }

  function onDelete(note: NoteRow) {
    if (!confirm(`Delete "${note.title || 'Untitled'}"? This can't be undone.`)) return
    setError(null)
    startTransition(async () => {
      try {
        await deleteNote(note.id)
        if (selectedId === note.id) setSelectedId(null)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Delete failed')
      }
    })
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !selected) return
    setError(null)
    const formData = new FormData()
    formData.set('file', file)
    startTransition(async () => {
      try {
        await uploadNoteAttachment(selected.id, formData)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        e.target.value = ''
      }
    })
  }

  function onRemoveAttachment(url: string) {
    if (!selected) return
    startTransition(async () => {
      await removeNoteAttachment(selected.id, url)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <aside className="shrink-0 sm:w-64">
        <Button size="sm" onClick={onCreate} disabled={pending} className="mb-3 w-full">
          <Plus className="size-3.5" /> New note
        </Button>
        <div className="space-y-1">
          {notes.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => select(n)}
              className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                selectedId === n.id ? 'border-primary/40 bg-accent' : 'hover:bg-muted'
              }`}
            >
              <p className="truncate font-medium">{n.title || 'Untitled'}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(n.updated_at)}</p>
            </button>
          ))}
          {notes.length === 0 && <p className="px-1 text-sm text-muted-foreground">No notes yet.</p>}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {error && (
          <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        {selected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setDirty(true)
                }}
                placeholder="Untitled"
                className="min-w-0 flex-1 rounded-md border bg-background px-2.5 py-1.5 text-lg font-semibold"
              />
              <Button size="sm" onClick={onSave} disabled={pending || !dirty}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(selected)} aria-label="Delete note" className="text-destructive">
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            <NoteEditor
              key={selected.id}
              html={bodyHtml}
              onChange={(html) => {
                setBodyHtml(html)
                setDirty(true)
              }}
            />

            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Attachments</p>
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={pending}>
                  <Paperclip className="size-3.5" /> Attach file
                </Button>
                <input ref={fileInputRef} type="file" onChange={onUpload} className="hidden" />
              </div>
              {selected.attachments.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {selected.attachments.map((a) => (
                    <li key={a.url} className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-2 py-1.5 text-sm">
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-w-0 items-center gap-1.5 truncate hover:text-primary hover:underline"
                      >
                        <FileText className="size-3.5 shrink-0" /> <span className="truncate">{a.filename}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => onRemoveAttachment(a.url)}
                        aria-label="Remove attachment"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">No files attached.</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">Files ≥10 MB need R2 (not configured yet).</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Select a note, or create a new one.</p>
        )}
      </div>
    </div>
  )
}
