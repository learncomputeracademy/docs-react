import { notFound } from 'next/navigation'
import { getDocForAdmin } from '@/lib/admin/doc'
import { getTranslationForAdmin } from '@/lib/admin/translation'
import { TranslationEditor } from '@/components/admin/translation-editor'

export default async function AdminTranslationEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [doc, translation] = await Promise.all([getDocForAdmin(id), getTranslationForAdmin(id)])
  if (!doc) notFound()

  return <TranslationEditor doc={doc} translation={translation} />
}
