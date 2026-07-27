'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, FileText, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type MediaRow, uploadMedia, updateMediaAlt, deleteMedia, findMediaReferences } from '@/lib/admin/media'

export function MediaLibrary({ media }: { media: MediaRow[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [altDraft, setAltDraft] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await uploadMedia(formData)
        e.currentTarget.reset()
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      }
    })
  }

  function onAltBlur(id: string, currentAlt: string | null) {
    if (altDraft === (currentAlt ?? '')) return
    startTransition(async () => {
      await updateMediaAlt(id, altDraft)
      router.refresh()
    })
  }

  async function onDelete(item: MediaRow) {
    const refs = await findMediaReferences(item.public_id)
    const message = refs.length > 0
      ? `This is referenced by ${refs.length} page(s): ${refs.map((r) => r.title).join(', ')}. Deleting it here only removes it from this library, NOT from those pages — they'll keep showing it via their existing URL. Delete anyway?`
      : 'Delete this from the media library? The underlying file on Cloudinary/R2 is not removed.'
    if (!confirm(message)) return
    startTransition(async () => {
      await deleteMedia(item.id)
      router.refresh()
    })
  }

  return (
    <div>
      <form onSubmit={onUpload} className="mb-6 flex flex-wrap items-end gap-2 rounded-lg border bg-muted/30 p-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">File</label>
          <input ref={fileInputRef} type="file" name="file" required className="block text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Alt text</label>
          <input name="alt" placeholder="Describe the image" className="block rounded-md border bg-background px-2 py-1.5 text-sm" />
        </div>
        <Button type="submit" size="sm" disabled={pending}>Upload</Button>
        <span className="text-xs text-muted-foreground">Files ≥10 MB need R2 (not configured yet — see note below).</span>
      </form>

      {error && (
        <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg border">
            <div className="flex aspect-video items-center justify-center bg-muted">
              {item.kind === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.alt ?? ''} className="size-full object-cover" />
              ) : item.kind === 'video' ? (
                <Video className="size-8 text-muted-foreground" />
              ) : (
                <FileText className="size-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1.5 p-2">
              <p className="truncate font-mono text-xs text-muted-foreground" title={item.public_id}>{item.public_id}</p>
              <input
                defaultValue={item.alt ?? ''}
                placeholder="Alt text"
                onChange={(e) => setAltDraft(e.target.value)}
                onBlur={() => onAltBlur(item.id, item.alt)}
                className="w-full rounded-md border bg-background px-1.5 py-1 text-xs"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.backend}</span>
                <button type="button" onClick={() => onDelete(item)} aria-label="Delete" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {media.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No media yet.</p>}
      </div>
    </div>
  )
}
