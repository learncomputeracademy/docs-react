import type { Block } from '@/lib/types'

// Nothing reaches here today (quiz got its editor in D-142); kept as the
// fallback for any future block type the editor doesn't know. Content is preserved
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
