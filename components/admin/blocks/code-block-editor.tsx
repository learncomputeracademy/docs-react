'use client'

import type { Lang } from '@/lib/types'

const LANGUAGES: Lang[] = ['html', 'css', 'javascript', 'jsx', 'tsx', 'typescript', 'bash', 'json', 'sql', 'python', 'text']

// No "make runnable" toggle here — that converts a code block into a
// tryit block, and tryit's own editor UI isn't built until Phase 6
// (ADMIN-PLAN.md). Adding the toggle now would produce a block type this
// editor can't then edit.
export function CodeBlockEditor({
  code,
  language,
  filename,
  onChange,
}: {
  code: string
  language: Lang
  filename?: string
  onChange: (patch: { code?: string; language?: Lang; filename?: string }) => void
}) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(e) => onChange({ language: e.target.value as Lang })}
          className="rounded-md border bg-background px-2 py-1.5 text-sm"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <input
          value={filename ?? ''}
          onChange={(e) => onChange({ filename: e.target.value || undefined })}
          placeholder="filename (optional)"
          className="flex-1 rounded-md border bg-background px-2 py-1.5 text-sm"
        />
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange({ code: e.target.value })}
        spellCheck={false}
        rows={8}
        className="w-full resize-y rounded-md border bg-background p-2 font-mono text-sm outline-none"
      />
    </div>
  )
}
