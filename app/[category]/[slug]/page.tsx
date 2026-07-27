import type { Metadata } from 'next'
import { getAllDocPaths } from '@/lib/content'
import { LessonContent, loadLocalizedDoc } from '@/components/lesson-content'
import { buildAlternates, articleJsonLd, jsonLdScript } from '@/lib/seo'

export async function generateStaticParams() {
  const paths = await getAllDocPaths()
  return paths.map((d) => {
    const [category, slug] = d.path.split('/')
    return { category, slug }
  })
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params
  const doc = await loadLocalizedDoc(category, slug, 'en')
  const path = `${category}/${slug}`
  return {
    title: doc.meta_title ?? doc.title,
    description: doc.meta_description ?? undefined,
    alternates: buildAlternates(`/${path}`, `/${path}`, `/bn/${path}`),
  }
}

export default async function LessonPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const doc = await loadLocalizedDoc(category, slug, 'en')
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd(doc, 'en')) }} />
      <LessonContent category={category} slug={slug} locale="en" />
    </>
  )
}
