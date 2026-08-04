import { notFound } from 'next/navigation'
import { getDoc, getAdjacentDocs } from '@/lib/content'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { Toc } from '@/components/toc'
import { LessonPagination } from '@/components/lesson-pagination'
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
      <main className="min-w-0 flex-1 pb-24 pt-8 md:pb-8">
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
          <LessonPagination
            prev={prev}
            next={next}
            prefix={prefix}
            previousLabel={s.previous}
            nextLabel={s.next}
            menuLabel={s.menu}
            browseLessonsLabel={s.browseLessons}
          />
        )}
      </main>

      {doc.toc.length > 0 && (
        <aside className="hidden w-56 shrink-0 py-8 xl:block">
          <Toc items={doc.toc} title={s.onThisPage} />
        </aside>
      )}
    </>
  )
}
