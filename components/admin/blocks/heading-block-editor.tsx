'use client'

const LEVELS = [2, 3, 4, 5, 6] as const

export function HeadingBlockEditor({
  text,
  level,
  anchor,
  onChange,
}: {
  text: string
  level: 2 | 3 | 4 | 5 | 6
  anchor: string
  onChange: (patch: { text?: string; level?: 2 | 3 | 4 | 5 | 6 }) => void
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border p-2">
      <select
        value={level}
        onChange={(e) => onChange({ level: Number(e.target.value) as 2 | 3 | 4 | 5 | 6 })}
        className="rounded-md border bg-background px-2 py-1.5 text-sm"
      >
        {LEVELS.map((l) => (
          <option key={l} value={l}>H{l}</option>
        ))}
      </select>
      <input
        value={text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Heading text"
        className="flex-1 rounded-md border bg-background px-2 py-1.5 text-sm font-medium"
      />
      {/* Anchor is derived, never hand-edited — computeAnchorsAndToc owns it */}
      <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">#{anchor}</span>
    </div>
  )
}
