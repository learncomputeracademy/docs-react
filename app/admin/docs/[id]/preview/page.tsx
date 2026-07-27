import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDocForAdmin } from '@/lib/admin/doc'
import { BlockRenderer } from '@/components/blocks/block-renderer'

// ADMIN-PLAN.md §4.4: preview is its own admin-only route reusing the same
// BlockRenderer the public site uses — never a flag on [category]/[slug]
// that would force that route dynamic and break "never SSR a doc page"
// (CLAUDE.md §3.3, the free-tier egress guardrail). The public route is
// untouched; a draft is already invisible there today via RLS's "public
// reads published docs" policy, independent of anything built here.
export default async function AdminDocPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doc = await getDocForAdmin(id)
  if (!doc) notFound()

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b bg-yellow-100 px-6 py-2 text-sm text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200">
        <span>
          Preview — {doc.status === 'published' ? 'this doc is live; showing current saved content.' : 'not published, not visible to the public.'}
        </span>
        <Link href={`/admin/docs/${doc.id}`} className="font-medium underline">Back to editor</Link>
      </div>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
        <div className="mt-6">
          <BlockRenderer blocks={doc.blocks} />
        </div>
      </main>
    </div>
  )
}
