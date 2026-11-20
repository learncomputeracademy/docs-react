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

// Quiz text: same as above plus <pre> for code samples in questions.
const QUIZ_OPTIONS: sanitizeHtml.IOptions = { ...SANITIZE_OPTIONS, allowedTags: [...(SANITIZE_OPTIONS.allowedTags as string[]), 'pre'] }
const clean = (html: string) => sanitizeHtml(html, QUIZ_OPTIONS)

export function sanitizeBlock(block: Block): Block {
  if (block.type === 'richtext' || block.type === 'callout') {
    return { ...block, html: sanitizeHtml(block.html, SANITIZE_OPTIONS) }
  }
  if (block.type === 'quiz') {
    const questions = (block.questions ?? []).map((q) => {
      const options = q.options.map(clean)
      if (options.length < 2) throw new Error('Every quiz question needs at least 2 options')
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= options.length) {
        throw new Error('Every quiz question needs one correct answer selected')
      }
      return { ...q, prompt: clean(q.prompt), options, explain: q.explain ? clean(q.explain) : undefined }
    })
    return { ...block, questions }
  }
  return block
}
