'use client'

import { RichTextBlockEditor } from './richtext-block-editor'

const VARIANTS = ['note', 'tip', 'warning', 'danger'] as const
type Variant = (typeof VARIANTS)[number]

export function CalloutBlockEditor({
  variant,
  title,
  html,
  onChange,
}: {
  variant: Variant
  title?: string
  html: string
  onChange: (patch: { variant?: Variant; title?: string; html?: string }) => void
}) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center gap-2">
        <select value={variant} onChange={(e) => onChange({ variant: e.target.value as Variant })} className="rounded-md border bg-background px-2 py-1.5 text-sm capitalize">
          {VARIANTS.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <input
          value={title ?? ''}
          onChange={(e) => onChange({ title: e.target.value || undefined })}
          placeholder="Title (optional)"
          className="flex-1 rounded-md border bg-background px-2 py-1.5 text-sm"
        />
      </div>
      <RichTextBlockEditor html={html} onChange={(html) => onChange({ html })} />
    </div>
  )
}
