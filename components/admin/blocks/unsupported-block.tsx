import type { Block } from '@/lib/types'

// image/loop/callout/tryit/file/video/quiz — Phases 4-6 in ADMIN-PLAN.md.
// Content is preserved exactly as-is on save (see lib/admin/doc.ts); this
// is display-only so real lessons using these types stay editable for
// everything else (move/duplicate/delete) without corrupting their data.
export function UnsupportedBlock({ block }: { block: Block }) {
  return (
    <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs uppercase">{block.type}</span>
      {' '}block — not editable in this version yet. Content is preserved; reorder, duplicate, or delete only.
    </div>
  )
}
