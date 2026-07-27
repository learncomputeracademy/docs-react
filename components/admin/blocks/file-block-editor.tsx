'use client'

import { useState, useTransition } from 'react'
import { uploadMedia, type MediaRow } from '@/lib/admin/media'

function humanSize(bytes: number | null) {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

export function FileBlockEditor({
  publicId,
  kind,
  label,
  size,
  media,
  onChange,
}: {
  publicId: string
  kind: 'pdf' | 'zip'
  label: string
  size: string
  media: MediaRow[]
  onChange: (patch: { publicId?: string; kind?: 'pdf' | 'zip'; label?: string; size?: string }) => void
}) {
  const [pending, startTransition] = useTransition()
  const [uploadError, setUploadError] = useState<string | null>(null)
  const files = media.filter((m) => m.kind === 'file')

  function onSelect(id: string) {
    const item = files.find((m) => m.public_id === id)
    if (!item) return
    onChange({ publicId: item.public_id, size: humanSize(item.bytes) || size })
  }

  function onUploadNew(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt', label)
    startTransition(async () => {
      try {
        const item = await uploadMedia(formData)
        const inferredKind = file.name.toLowerCase().endsWith('.zip') ? 'zip' : 'pdf'
        onChange({ publicId: item.public_id, kind: inferredKind, size: humanSize(item.bytes) || size })
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed')
      }
    })
  }

  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center gap-2">
        <select value={kind} onChange={(e) => onChange({ kind: e.target.value as 'pdf' | 'zip' })} className="rounded-md border bg-background px-2 py-1.5 text-sm">
          <option value="pdf">PDF</option>
          <option value="zip">ZIP</option>
        </select>
        <input value={size} onChange={(e) => onChange({ size: e.target.value })} placeholder="Size, e.g. 2.3 MB" className="flex-1 rounded-md border bg-background px-2 py-1.5 text-sm" />
      </div>
      <select value={publicId} onChange={(e) => onSelect(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
        <option value="">Select from library…</option>
        {files.map((m) => (
          <option key={m.id} value={m.public_id}>{m.alt || m.public_id}</option>
        ))}
      </select>
      <label className="block text-xs text-muted-foreground">
        or upload new: <input type="file" accept=".pdf,.zip" disabled={pending} onChange={onUploadNew} className="text-xs" />
      </label>
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
      <input value={label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Label (link text)" className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
    </div>
  )
}
