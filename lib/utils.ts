import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Client-side-only id for list items (layers, gradient stops, …) — never
// persisted, so collision resistance just needs to beat Math.random when
// crypto.randomUUID isn't available (older Safari, non-secure contexts).
export function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

// Title → URL slug, for admin-created docs/categories/nav items. Was
// duplicated identically in docs-list.tsx, categories-manager.tsx, and
// doc-editor.tsx — consolidated here. NOT the same algorithm as
// lib/admin/anchors.ts's slugify(), which has its own deliberate contract
// (must match scripts/extract-docs.mjs's heading-anchor logic exactly) —
// don't merge the two.
export function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
