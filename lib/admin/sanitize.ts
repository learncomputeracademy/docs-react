import sanitizeHtml from 'sanitize-html'
import type { Block } from '@/lib/types'

// ADMIN-PLAN.md §4.5: admin-authored HTML is semi-trusted, but a paste can
// carry anything, and richtext/callout html lands in dangerouslySetInnerHTML
// on a public page — sanitize on every write, server-side, regardless of
// whether the block actually changed this save. Shared (not 'use server' —
// that directive requires every export to be async) between lib/admin/doc.ts
// and lib/admin/translation.ts, the same rule for both locales.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'strong', 'em', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'code'],
  allowedAttributes: { a: ['href', 'target', 'rel'] },
  allowedSchemes: ['http', 'https', 'mailto'],
}

export function sanitizeBlock(block: Block): Block {
  if (block.type === 'richtext' || block.type === 'callout') {
    return { ...block, html: sanitizeHtml(block.html, SANITIZE_OPTIONS) }
  }
  return block
}
