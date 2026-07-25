import { notFound } from 'next/navigation'
import { getDoc } from '@/lib/content'
import { DocSidebar } from '@/components/doc-sidebar'
import { BlockRenderer } from '@/components/blocks/block-renderer'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/types'

export async function loadLocalizedDoc(category: string, slug: string, locale: Locale) {
  const doc = await getDoc(`${category}/${slug}`, locale)
  if (!doc) notFound()
  return doc
}

export async function LessonContent({ category, slug, locale }: { category: string; slug: string; locale: Locale }) {
  const doc = await loadLocalizedDoc(category, slug, locale)
  const s = t(locale)

  return (
    // No max-width cap: sidebar and TOC stay fixed-width, the center column
    // (flex-1) absorbs all remaining space on wide/ultra-wide screens. Mobile
    // is unaffected — sidebar/TOC are already hidden below md/xl.
    <div className="mx-auto flex w-full gap-8 px-6 lg:px-10">
      <DocSidebar activePath={doc.path} locale={locale} />

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
    </div>
  )
}
