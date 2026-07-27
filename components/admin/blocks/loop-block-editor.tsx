'use client'

import { useState, useTransition } from 'react'
import { uploadMedia, type MediaRow } from '@/lib/admin/media'

// `loop` = a GIF-turned-MP4, rendered <video autoplay muted loop
// playsinline> — see lib/types.ts. Distinct from the (not yet built)
// `video` block editor, a real player with a title.
export function LoopBlockEditor({
  publicId,
  alt,
  width,
  height,
  media,
  onChange,
}: {
  publicId: string
  alt: string
  width: number
  height: number
  media: MediaRow[]
  onChange: (patch: { publicId?: string; alt?: string; width?: number; height?: number }) => void
}) {
  const [pending, startTransition] = useTransition()
  const [uploadError, setUploadError] = useState<string | null>(null)
  const videos = media.filter((m) => m.kind === 'video')
  const selected = videos.find((m) => m.public_id === publicId)

  function onSelect(id: string) {
    const item = videos.find((m) => m.public_id === id)
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
      {selected && <video src={selected.url} muted loop autoPlay playsInline className="h-24 w-40 rounded-md border object-cover" />}
      <select value={publicId} onChange={(e) => onSelect(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
        <option value="">Select from library…</option>
        {videos.map((m) => (
          <option key={m.id} value={m.public_id}>{m.alt || m.public_id}</option>
        ))}
      </select>
      <label className="block text-xs text-muted-foreground">
        or upload new (MP4): <input type="file" accept="video/*" disabled={pending} onChange={onUploadNew} className="text-xs" />
      </label>
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
      <input value={alt} onChange={(e) => onChange({ alt: e.target.value })} placeholder="Alt text" className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
    </div>
  )
}
