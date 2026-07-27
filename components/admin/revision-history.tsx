'use client'

import { useEffect, useState, useTransition } from 'react'
import { History, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { listRevisions, restoreRevision, type RevisionRow } from '@/lib/admin/revisions'
import type { Block } from '@/lib/types'

// Diffs by block id — a lesson is a list of blocks, so "what changed"
// reads more usefully as added/removed/changed blocks than as a text
// diff of two giant JSON blobs.
function diffBlocks(before: Block[], after: Block[]) {
  const beforeById = new Map(before.map((b) => [b.id, b]))
  const afterById = new Map(after.map((b) => [b.id, b]))
  const added = after.filter((b) => !beforeById.has(b.id))
  const removed = before.filter((b) => !afterById.has(b.id))
  const changed = after.filter((b) => {
    const prev = beforeById.get(b.id)
    return prev && JSON.stringify(prev) !== JSON.stringify(b)
  })
  return { added, removed, changed }
}

function blockLabel(b: Block) {
  if (b.type === 'heading') return `Heading: ${b.text || '(untitled)'}`
  if (b.type === 'richtext') return 'Rich text'
  return b.type
}

export function RevisionHistory({ docId, currentBlocks, onClose }: { docId: string; currentBlocks: Block[]; onClose: () => void }) {
  const [revisions, setRevisions] = useState<RevisionRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<RevisionRow | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    listRevisions(docId).then(setRevisions).catch((e) => setError(e instanceof Error ? e.message : 'Failed to load revisions'))
  }, [docId])

  function onRestore(revision: RevisionRow) {
    if (!confirm(`Restore the version from ${new Date(revision.created_at).toLocaleString()}? Your current version is saved as a new revision first, so nothing is lost.`)) return
    startTransition(async () => {
      await restoreRevision(docId, revision.id)
      // Full reload, not router.refresh() — the editor's block/title state
      // is local useState seeded once from the initial doc prop, and won't
      // pick up a server-side change to the same doc any other way.
      window.location.reload()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold"><History className="size-4" /> Revision history</h2>
          <button onClick={onClose} aria-label="Close"><X className="size-4" /></button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {!revisions && !error && <p className="text-sm text-muted-foreground">Loading…</p>}
        {revisions && revisions.length === 0 && <p className="text-sm text-muted-foreground">No saved revisions yet — they start accumulating from the next save.</p>}

        <div className="space-y-2">
          {revisions?.map((r, i) => {
            const compareAgainst = i === 0 ? currentBlocks : revisions[i - 1].blocks
            const diff = diffBlocks(r.blocks, compareAgainst)
            const isSelected = selected?.id === r.id
            return (
              <div key={r.id} className="rounded-lg border p-3">
                <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setSelected(isSelected ? null : r)}>
                  <div>
                    <p className="text-sm font-medium">{new Date(r.created_at).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{r.actorLabel ?? 'Unknown'} · {r.status}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {diff.added.length > 0 && <span className="text-emerald-600 dark:text-emerald-400">+{diff.added.length} </span>}
                    {diff.changed.length > 0 && <span className="text-amber-600 dark:text-amber-400">~{diff.changed.length} </span>}
                    {diff.removed.length > 0 && <span className="text-destructive">-{diff.removed.length}</span>}
                  </span>
                </button>
                {isSelected && (
                  <div className="mt-3 space-y-2 border-t pt-3">
                    <p className="text-xs font-medium">{r.title}</p>
                    {[...diff.added.map((b) => ({ b, kind: 'added' as const })),
                      ...diff.changed.map((b) => ({ b, kind: 'changed' as const })),
                      ...diff.removed.map((b) => ({ b, kind: 'removed' as const }))].map(({ b, kind }) => (
                      <p key={b.id} className={
                        kind === 'added' ? 'text-xs text-emerald-600 dark:text-emerald-400' :
                        kind === 'removed' ? 'text-xs text-destructive line-through' :
                        'text-xs text-amber-600 dark:text-amber-400'
                      }>
                        {kind === 'added' ? '+ ' : kind === 'removed' ? '− ' : '~ '}{blockLabel(b)}
                      </p>
                    ))}
                    {diff.added.length === 0 && diff.changed.length === 0 && diff.removed.length === 0 && (
                      <p className="text-xs text-muted-foreground">No block-level changes vs. the next version.</p>
                    )}
                    <Button size="sm" variant="outline" disabled={pending} onClick={() => onRestore(r)}>Restore this version</Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
