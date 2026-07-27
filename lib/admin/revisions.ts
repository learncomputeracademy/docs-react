'use server'

import { createClient } from '@/lib/supabase/server'
import { sanitizeBlock } from '@/lib/admin/sanitize'
import { computeAnchorsAndToc } from '@/lib/admin/anchors'
import { logActivity } from '@/lib/admin/activity'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Block, TocItem } from '@/lib/types'

const MAX_REVISIONS_PER_DOC = 20

// Called from saveDoc right after a successful update — snapshots the
// state that was just written, not the state before it, so "restore this
// revision" always means "go back to exactly what the editor saw at that
// point in time."
export async function snapshotRevision(docId: string, title: string, blocks: Block[], toc: TocItem[], status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('doc_revisions').insert({
    doc_id: docId,
    actor_id: user?.id ?? null,
    title,
    blocks,
    toc,
    status,
  })
  if (error) throw new Error(error.message)

  // Prune oldest beyond the cap. Two queries instead of one clever SQL
  // delete-with-offset because the admin client here has no raw SQL
  // access — this runs once per save, on at most a handful of rows.
  const { data: old } = await supabase
    .from('doc_revisions')
    .select('id')
    .eq('doc_id', docId)
    .order('created_at', { ascending: false })
    .range(MAX_REVISIONS_PER_DOC, MAX_REVISIONS_PER_DOC + 50)
  if (old && old.length > 0) {
    await supabase.from('doc_revisions').delete().in('id', old.map((r) => r.id))
  }
}

export type RevisionRow = {
  id: string
  title: string
  blocks: Block[]
  toc: TocItem[]
  status: string
  created_at: string
  actorLabel: string | null
}

export async function listRevisions(docId: string): Promise<RevisionRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('doc_revisions')
    .select('id, title, blocks, toc, status, created_at, actor_id')
    .eq('doc_id', docId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)

  const actorIds = [...new Set((data ?? []).map((r) => r.actor_id).filter((id): id is string => Boolean(id)))]
  const nameById = new Map<string, string | null>()
  if (actorIds.length > 0) {
    const { data: profiles } = await supabase.from('profiles').select('id, name').in('id', actorIds)
    for (const p of profiles ?? []) nameById.set(p.id, p.name)
  }

  return (data ?? []).map((r) => ({
    ...r,
    actorLabel: r.actor_id ? (nameById.get(r.actor_id) ?? r.actor_id.slice(0, 8)) : null,
  }))
}

// Restoring writes a fresh revision snapshot first (so the pre-restore
// state is never lost, only ever superseded), then applies the old
// content to the live doc. Re-sanitized/re-anchored on the way back in —
// cheap, and guards against restoring a revision written before a
// sanitize-rules change.
export async function restoreRevision(docId: string, revisionId: string) {
  const supabase = await createClient()
  const { data: revision, error: revError } = await supabase
    .from('doc_revisions')
    .select('title, blocks')
    .eq('id', revisionId)
    .eq('doc_id', docId)
    .single()
  if (revError) throw new Error(revError.message)

  const { data: current, error: curError } = await supabase
    .from('docs')
    .select('title, blocks, toc, status')
    .eq('id', docId)
    .single()
  if (curError) throw new Error(curError.message)
  await snapshotRevision(docId, current.title, current.blocks, current.toc, current.status)

  const sanitized = (revision.blocks as Block[]).map(sanitizeBlock)
  const { blocks, toc } = computeAnchorsAndToc(sanitized)

  const { data: updated, error } = await supabase
    .from('docs')
    .update({ title: revision.title, blocks, toc })
    .eq('id', docId)
    .select('path, status')
    .single()
  if (error) throw new Error(error.message)

  await logActivity('restored', 'doc', docId, updated.path)

  if (updated.status === 'published') {
    revalidateTag(`doc:${updated.path}`, { expire: 0 })
    revalidateTag('sidebar', { expire: 0 })
    revalidatePath(`/${updated.path}`, 'page')
    revalidatePath(`/bn/${updated.path}`, 'page')
  }
}
