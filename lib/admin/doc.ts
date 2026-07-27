'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import sanitizeHtml from 'sanitize-html'
import { createClient } from '@/lib/supabase/server'
import { computeAnchorsAndToc } from '@/lib/admin/anchors'
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

// ADMIN-PLAN.md §4.5: admin-authored HTML is semi-trusted, but a paste can
// carry anything, and richtext/callout html lands in dangerouslySetInnerHTML
// on a public page — sanitize on every write, server-side, regardless of
// whether the block actually changed this save.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'strong', 'em', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'code'],
  allowedAttributes: { a: ['href', 'target', 'rel'] },
  allowedSchemes: ['http', 'https', 'mailto'],
}

function sanitizeBlock(block: Block): Block {
  if (block.type === 'richtext' || block.type === 'callout') {
    return { ...block, html: sanitizeHtml(block.html, SANITIZE_OPTIONS) }
  }
  return block
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
