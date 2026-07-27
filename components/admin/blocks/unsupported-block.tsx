import type { Block } from '@/lib/types'

// Only `quiz` reaches here now (image/loop/file: Phase 5; callout/tryit/
// video: Phase 6, ADMIN-PLAN.md) — quiz is Phase 3 in CONTENT-MODEL.md
// with zero real rows, deliberately not built. Content is preserved
// exactly as-is on save (see lib/admin/doc.ts); this is display-only so a
// doc using an unbuilt type stays editable for everything else
// (move/duplicate/delete) without corrupting its data.
export function UnsupportedBlock({ block }: { block: Block }) {
  return (
    <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs uppercase">{block.type}</span>
      {' '}block — not editable in this version yet. Content is preserved; reorder, duplicate, or delete only.
    </div>
  )
}
