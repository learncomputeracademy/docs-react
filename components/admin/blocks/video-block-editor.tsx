'use client'

type Provider = 'youtube' | 'cloudinary'

export function VideoBlockEditor({
  provider,
  videoId,
  title,
  onChange,
}: {
  provider: Provider
  videoId: string
  title: string
  onChange: (patch: { provider?: Provider; videoId?: string; title?: string }) => void
}) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center gap-2">
        <select value={provider} onChange={(e) => onChange({ provider: e.target.value as Provider })} className="rounded-md border bg-background px-2 py-1.5 text-sm">
          <option value="youtube">YouTube</option>
          <option value="cloudinary">Cloudinary</option>
        </select>
        <input
          value={videoId}
          onChange={(e) => onChange({ videoId: e.target.value })}
          placeholder={provider === 'youtube' ? 'YouTube video ID (e.g. dQw4w9WgXcQ)' : 'Cloudinary public ID'}
          className="flex-1 rounded-md border bg-background px-2 py-1.5 text-sm"
        />
      </div>
      <input
        value={title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Title"
        className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
      />
    </div>
  )
}
