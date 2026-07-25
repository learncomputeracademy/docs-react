import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDoc, getAllDocPaths } from '@/lib/content'
import { DocSidebar } from '@/components/doc-sidebar'
import { BlockRenderer } from '@/components/blocks/block-renderer'

export async function generateStaticParams() {
  const paths = await getAllDocPaths()
  return paths.map((d) => {
    const [category, slug] = d.path.split('/')
    return { category, slug }
  })
}

async function loadDoc(category: string, slug: string) {
  const doc = await getDoc(`${category}/${slug}`)
  if (!doc) notFound()
  return doc
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params
  const doc = await loadDoc(category, slug)
  return {
    title: doc.meta_title ?? doc.title,
    description: doc.meta_description ?? undefined,
  }
}

export default async function LessonPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const doc = await loadDoc(category, slug)

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-6">
      <DocSidebar activePath={doc.path} />

      <main className="min-w-0 flex-1 py-8">
        <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
        <div className="mt-8">
          <BlockRenderer blocks={doc.blocks} />
        </div>
      </main>

      {doc.toc.length > 0 && (
        <aside className="hidden w-56 shrink-0 py-8 xl:block">
          <div className="sticky top-20 text-sm">
            <p className="mb-2 font-semibold">On this page</p>
            <ul className="space-y-1 border-l">
              {doc.toc.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 0.75 + 0.75}rem` }}>
                  <a href={`#${item.id}`} className="block text-muted-foreground hover:text-foreground py-0.5">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  )
}
