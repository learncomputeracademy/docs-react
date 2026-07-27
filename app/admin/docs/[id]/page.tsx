import { notFound } from 'next/navigation'
import { getDocForAdmin } from '@/lib/admin/doc'
import { listCategoriesForAdmin } from '@/lib/admin/docs'
import { DocEditor } from '@/components/admin/doc-editor'

export default async function AdminDocEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [doc, categories] = await Promise.all([getDocForAdmin(id), listCategoriesForAdmin()])
  if (!doc) notFound()

  return <DocEditor doc={doc} categories={categories} />
}
