'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { computeAnchorsAndToc } from '@/lib/admin/anchors'
import { sanitizeBlock } from '@/lib/admin/sanitize'
import { snapshotRevision } from '@/lib/admin/revisions'
import { logActivity } from '@/lib/admin/activity'
import type { Block, Doc } from '@/lib/types'

export async function getDocForAdmin(id: string): Promise<Doc | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('docs')
    .select('*, category:categories(id, slug, title, title_bn, description, sort_order)')
    .eq('id', id)
    .single()
  if (error) return null
  return data as unknown as Doc
}

export type SaveDocInput = {
  title: string
  slug: string
  path: string
  categoryId: string | null
  metaTitle: string | null
  metaDescription: string | null
  sortOrder: number
  blocks: Block[]
}

// Status/published_at are never touched here — publish/unpublish stays the
// dedicated setDocStatus action (lib/admin/docs.ts), reused by the editor's
// own Publish button, so there's exactly one place that flips a doc live.
export async function saveDoc(id: string, input: SaveDocInput) {
  const supabase = await createClient()
  const sanitized = input.blocks.map(sanitizeBlock)
  const { blocks, toc } = computeAnchorsAndToc(sanitized)

  const { data, error } = await supabase
    .from('docs')
    .update({
      title: input.title,
      slug: input.slug,
      path: input.path,
      category_id: input.categoryId,
      meta_title: input.metaTitle,
      meta_description: input.metaDescription,
      sort_order: input.sortOrder,
      blocks,
      toc,
    })
    .eq('id', id)
    .select('path, status')
    .single()

  if (error) throw new Error(error.message)

  await snapshotRevision(id, input.title, blocks, toc, data.status)
  await logActivity('updated', 'doc', id, data.path)

  // Editing an already-published doc's content changes what's live right
  // now, even though this action never touches `status` itself.
  if (data.status === 'published') {
    revalidateTag(`doc:${data.path}`, { expire: 0 })
    revalidateTag('sidebar', { expire: 0 })
    revalidatePath(`/${data.path}`, 'page')
    revalidatePath(`/bn/${data.path}`, 'page')
  }

  return { path: data.path as string, toc }
}
