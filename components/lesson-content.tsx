import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getDoc, getAdjacentDocs } from '@/lib/content'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/types'

export async function loadLocalizedDoc(category: string, slug: string, locale: Locale) {
  const doc = await getDoc(`${category}/${slug}`, locale)
  if (!doc) notFound()
  return doc
}

// Sidebar and the outer flex/padding shell live in layout.tsx now — this
// only renders the part that actually changes per lesson (main + TOC), so
// it's the only piece loading.tsx needs to suspend on.
export async function LessonContent({ category, slug, locale }: { category: string; slug: string; locale: Locale }) {
  const doc = await loadLocalizedDoc(category, slug, locale)
  const { prev, next } = await getAdjacentDocs(doc.path, locale)
  const s = t(locale)
  const prefix = locale === 'bn' ? '/bn' : ''

  return (
    <>
      <main className="min-w-0 flex-1 py-8">
        {locale === 'bn' && !doc.isTranslated && (
          <div className="mb-6 rounded-lg border border-primary/30 bg-accent/50 px-4 py-3 text-sm text-accent-foreground">
            {s.notTranslatedBanner}
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
        <div className="mt-8">
          <BlockRenderer blocks={doc.blocks} />
        </div>

        {(prev || next) && (
          <div className="mt-12 grid grid-cols-2 gap-4 border-t pt-6">
            {prev ? (
              <Link href={`${prefix}/${prev.path}`} className="group flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-accent/50">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeft className="size-3.5" /> {s.previous}
                </span>
                <span className="font-medium group-hover:text-primary">{prev.title}</span>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`${prefix}/${next.path}`} className="group flex flex-col items-end gap-1 rounded-lg border p-4 text-right transition-colors hover:border-primary/40 hover:bg-accent/50">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {s.next} <ArrowRight className="size-3.5" />
                </span>
                <span className="font-medium group-hover:text-primary">{next.title}</span>
              </Link>
            ) : <div />}
          </div>
        )}
      </main>

      {doc.toc.length > 0 && (
        <aside className="hidden w-56 shrink-0 py-8 xl:block">
          <div className="sticky top-20 text-sm">
            <p className="mb-2 font-semibold">{s.onThisPage}</p>
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
    </>
  )
}
