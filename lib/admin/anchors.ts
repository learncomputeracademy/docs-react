import type { Block, TocItem } from '@/lib/types'

// Identical algorithm to scripts/extract-docs.mjs's slugify/uniqueAnchor —
// headings edited here must generate the same anchors that already exist
// in the DB from extraction, or deep links and the "On this page" TOC
// silently drift out of sync with content written before this editor
// existed. Shared (not 'use server') so both the save action and the
// editor's live anchor preview use the exact same logic.
export function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
}

export function computeAnchorsAndToc(blocks: Block[]): { blocks: Block[]; toc: TocItem[] } {
  const used = new Map<string, number>()
  const toc: TocItem[] = []
  const next = blocks.map((b) => {
    if (b.type !== 'heading') return b
    const base = slugify(b.text)
    const count = used.get(base) ?? 0
    used.set(base, count + 1)
    const anchor = count === 0 ? base : `${base}-${count + 1}`
    toc.push({ id: anchor, text: b.text, level: b.level })
    return { ...b, anchor }
  })
  return { blocks: next, toc }
}
