import type { Metadata } from 'next'
import { getAllCategorySlugs } from '@/lib/content'
import { CategoryContent, loadCategory } from '@/components/category-content'

export async function generateStaticParams() {
  const categories = await getAllCategorySlugs()
  return categories.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const cat = await loadCategory(category, 'en')
  return { title: cat.title }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return <CategoryContent slug={category} locale="en" />
}
