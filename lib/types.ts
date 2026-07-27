// ── Block types (D-11) ──────────────────────────────────────
// Phase 1: richtext, heading, code, image, table
// Phase 2: callout, tryit, file, video
// Phase 3: quiz

export type Lang = 'html' | 'css' | 'javascript' | 'jsx' | 'tsx' | 'typescript'
  | 'bash' | 'json' | 'sql' | 'python' | 'text'

export type Block =
  | { id: string; type: 'richtext'; html: string }
  | { id: string; type: 'heading'; level: 2 | 3 | 4 | 5 | 6; text: string; anchor: string }
  | { id: string; type: 'code'; language: Lang; code: string; filename?: string; runnable?: boolean }
  | { id: string; type: 'image'; publicId: string; alt: string; caption?: string; width: number; height: number }
  // Was a GIF in the Jekyll source. Renders as <video autoplay muted loop
  // playsinline> — same visual role as an inline animated image, but as an
  // MP4 (typically 80-95% smaller). Distinct from `video`, which is a real
  // player (YouTube/Cloudinary) with a title and controls.
  | { id: string; type: 'loop'; publicId: string; alt: string; width: number; height: number }
  | { id: string; type: 'table'; header: string[]; rows: string[][]; caption?: string }
  | { id: string; type: 'callout'; variant: 'note' | 'tip' | 'warning' | 'danger'; title?: string; html: string }
  | { id: string; type: 'tryit'; mode: 'web' | 'react'; files: { html?: string; css?: string; js?: string; jsx?: string } }
  | { id: string; type: 'file'; publicId: string; kind: 'pdf' | 'zip'; label: string; size: string }
  | { id: string; type: 'video'; provider: 'youtube' | 'cloudinary'; videoId: string; title: string }
  | { id: string; type: 'quiz' }

export type TocItem = { id: string; text: string; level: 2 | 3 | 4 | 5 | 6 }

// ── i18n ─────────────────────────────────────────────────────
// English lives directly on `docs`/`categories` — it's the source of
// truth, not a translation. 'bn' rows live in doc_translations.

export type Locale = 'en' | 'bn'

// ── Database row types ────────────────────────────────────────

export type Category = {
  id: string
  slug: string
  title: string
  title_bn: string | null
  description: string | null
  sort_order: number
  docs?: { count: number }[]
}

export type Doc = {
  id: string
  category_id: string
  slug: string
  path: string             // new URL: 'css/intro'
  old_path: string | null  // Jekyll permalink for 301s
  title: string
  meta_title: string | null
  meta_description: string | null
  blocks: Block[]
  toc: TocItem[]
  status: 'draft' | 'published'
  sort_order: number
  created_at: string
  updated_at: string
  published_at: string | null
  deleted_at: string | null
  category?: Category
}

export type Lead = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string | null
  source: string | null
  status: 'new' | 'contacted' | 'closed'
  created_at: string
}
