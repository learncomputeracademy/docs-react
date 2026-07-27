'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sanitizeBlock } from '@/lib/admin/sanitize'
import { logActivity } from '@/lib/admin/activity'
import type { Block, TocItem } from '@/lib/types'

export type TranslationRow = {
  id: string
  doc_id: string
  locale: 'bn'
  title: string
  meta_title: string | null
  meta_description: string | null
  blocks: Block[]
  toc: TocItem[]
  updated_at: string
}

export async function getTranslationForAdmin(docId: string): Promise<TranslationRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('doc_translations')
    .select('*')
    .eq('doc_id', docId)
    .eq('locale', 'bn')
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

// Clones English blocks as the starting point — ADMIN-PLAN.md §5:
// "Creating a translation = clone the English blocks, then edit."
export async function createTranslation(docId: string, englishTitle: string, englishBlocks: Block[]): Promise<TranslationRow> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('doc_translations')
    .insert({ doc_id: docId, locale: 'bn', title: englishTitle, blocks: englishBlocks, toc: [] })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  await logActivity('translated', 'translation', docId, englishTitle)
  return data
}

export async function deleteTranslation(docId: string) {
  const supabase = await createClient()
  const { data: docRow, error: docError } = await supabase.from('docs').select('path, status').eq('id', docId).single()
  if (docError) throw new Error(docError.message)

  const { error } = await supabase.from('doc_translations').delete().eq('doc_id', docId).eq('locale', 'bn')
  if (error) throw new Error(error.message)
  await logActivity('deleted', 'translation', docId, docRow.path)

  // Public site already falls back to English + a banner when no
  // translation exists (lib/content.ts) — deleting is safe, just revalidate
  // so that fallback takes effect immediately rather than waiting for TTL.
  if (docRow.status === 'published') {
    revalidateTag(`doc:${docRow.path}`, { expire: 0 })
    revalidateTag('sidebar', { expire: 0 })
    revalidatePath(`/bn/${docRow.path}`, 'page')
  }
}

export type SaveTranslationInput = {
  title: string
  metaTitle: string | null
  metaDescription: string | null
  blocks: Block[]
}

// englishBlocks is passed in (not re-fetched) so the caller's already-loaded
// copy is the source of truth for both ordering and anchors — no risk of a
// race against a concurrent English edit mid-translation-session.
export async function saveTranslation(docId: string, englishBlocks: Block[], input: SaveTranslationInput) {
  const supabase = await createClient()
  const bengaliById = new Map(input.blocks.map((b) => [b.id, b]))

  // Final order always follows English's current block order, never
  // whatever order blocks were added/edited in client state — a
  // translation added out of sequence (e.g. via "copy from English" on a
  // block with no prior translation) must not end up in the wrong
  // position on the actual /bn page. Blocks whose id no longer exists in
  // English are dropped: an orphan from a since-deleted English block
  // would render Bengali-only content with nothing on the English side to
  // match it.
  const ordered = englishBlocks
    .map((eb) => bengaliById.get(eb.id))
    .filter((b): b is Block => Boolean(b))
    .map(sanitizeBlock)

  // Heading anchors are never recomputed from Bengali text — copied from
  // the matching English block by id, so deep links and the "On this
  // page" TOC resolve to the same anchor in both locales. This is a rule
  // the manual translation scripts already followed by hand; this just
  // enforces it in code.
  const toc: TocItem[] = []
  const blocks = ordered.map((b) => {
    if (b.type !== 'heading') return b
    const englishMatch = englishBlocks.find((eb) => eb.id === b.id)
    const anchor = englishMatch && englishMatch.type === 'heading' ? englishMatch.anchor : b.anchor
    toc.push({ id: anchor, text: b.text, level: b.level })
    return { ...b, anchor }
  })

  const { data: docRow, error: docError } = await supabase.from('docs').select('path, status').eq('id', docId).single()
  if (docError) throw new Error(docError.message)

  const { error } = await supabase
    .from('doc_translations')
    .update({
      title: input.title,
      meta_title: input.metaTitle,
      meta_description: input.metaDescription,
      blocks,
      toc,
    })
    .eq('doc_id', docId)
    .eq('locale', 'bn')
  if (error) throw new Error(error.message)
  await logActivity('translated', 'translation', docId, input.title)

  if (docRow.status === 'published') {
    revalidateTag(`doc:${docRow.path}`, { expire: 0 })
    revalidateTag('sidebar', { expire: 0 })
    revalidatePath(`/bn/${docRow.path}`, 'page')
  }
}
