import { notFound } from 'next/navigation'
import { getDocForAdmin } from '@/lib/admin/doc'
import { listCategoriesForAdmin } from '@/lib/admin/docs'
import { listMediaForAdmin } from '@/lib/admin/media'
import { DocEditor } from '@/components/admin/doc-editor'

export default async function AdminDocEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [doc, categories, media] = await Promise.all([
    getDocForAdmin(id),
    listCategoriesForAdmin(),
    listMediaForAdmin(),
  ])
  if (!doc) notFound()

  return <DocEditor doc={doc} categories={categories} media={media} />
}
