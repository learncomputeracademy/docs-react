import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDoc } from '@/lib/content'
import { BlockRenderer } from '@/components/blocks/block-renderer'

// Standalone page (ADMIN-PLAN.md §1c) — a docs row with category_id IS
// NULL and path='about', not a dedicated table. Returns 404 until that
// row actually exists (O-1: real copy not written yet) — an honest
// interim state rather than fake placeholder content, deliberately not
// fabricated here. Create it via the admin editor's "New doc" → category
// "Standalone page (no category)" → slug "about".
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getDoc('about')
  if (!doc) return {}
  return {
    title: doc.meta_title ?? doc.title,
    description: doc.meta_description ?? undefined,
  }
}

export default async function AboutPage() {
  const doc = await getDoc('about')
  if (!doc) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
      <div className="mt-8">
        <BlockRenderer blocks={doc.blocks} />
      </div>
    </main>
  )
}
