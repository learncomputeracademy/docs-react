import type { Metadata } from 'next'
import { getTranslatedDocPaths } from '@/lib/content'
import { LessonContent, loadLocalizedDoc } from '@/components/lesson-content'
import { buildAlternates, articleJsonLd, jsonLdScript } from '@/lib/seo'

// Only pre-render /bn pages that actually have a translation yet — the rest
// resolve on demand (LessonContent falls back to English + a banner) rather
// than statically generating hundreds of not-yet-translated pages.
export async function generateStaticParams() {
  const paths = await getTranslatedDocPaths()
  return paths.map((d) => {
    const [category, slug] = d.path.split('/')
    return { category, slug }
  })
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params
  const doc = await loadLocalizedDoc(category, slug, 'bn')
  const path = `${category}/${slug}`
  return {
    title: doc.meta_title ?? doc.title,
    description: doc.meta_description ?? undefined,
    alternates: buildAlternates(`/bn/${path}`, `/${path}`, `/bn/${path}`),
  }
}

export default async function LessonPageBn({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const doc = await loadLocalizedDoc(category, slug, 'bn')
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd(doc, 'bn')) }} />
      <LessonContent category={category} slug={slug} locale="bn" />
    </>
  )
}
