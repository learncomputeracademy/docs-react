'use client'

import { useState, useTransition } from 'react'
import { uploadMedia, type MediaRow } from '@/lib/admin/media'

export function ImageBlockEditor({
  publicId,
  alt,
  caption,
  width,
  height,
  media,
  onChange,
}: {
  publicId: string
  alt: string
  caption?: string
  width: number
  height: number
  media: MediaRow[]
  onChange: (patch: { publicId?: string; alt?: string; caption?: string; width?: number; height?: number }) => void
}) {
  const [pending, startTransition] = useTransition()
  const [uploadError, setUploadError] = useState<string | null>(null)
  const images = media.filter((m) => m.kind === 'image')
  const selected = images.find((m) => m.public_id === publicId)

  function onSelect(id: string) {
    const item = images.find((m) => m.public_id === id)
    if (!item) return
    onChange({ publicId: item.public_id, width: item.width ?? width, height: item.height ?? height })
  }

  function onUploadNew(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt', alt)
    startTransition(async () => {
      try {
        const item = await uploadMedia(formData)
        onChange({ publicId: item.public_id, width: item.width ?? width, height: item.height ?? height })
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed')
      }
    })
  }

  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-start gap-4">
        {selected && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={selected.url} alt={alt} className="h-20 w-32 shrink-0 rounded-md border object-cover" />
        )}
        <div className="flex-1 space-y-2">
          <select value={publicId} onChange={(e) => onSelect(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
            <option value="">Select from library…</option>
            {images.map((m) => (
              <option key={m.id} value={m.public_id}>{m.alt || m.public_id}</option>
            ))}
          </select>
          <label className="block text-xs text-muted-foreground">
            or upload new: <input type="file" accept="image/*" disabled={pending} onChange={onUploadNew} className="text-xs" />
          </label>
        </div>
      </div>
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
      <input value={alt} onChange={(e) => onChange({ alt: e.target.value })} placeholder="Alt text" className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
      <input
        value={caption ?? ''}
        onChange={(e) => onChange({ caption: e.target.value || undefined })}
        placeholder="Caption (optional)"
        className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
      />
    </div>
  )
}
