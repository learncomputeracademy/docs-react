import { listDocsForAdmin, listCategoriesForAdmin } from '@/lib/admin/docs'
import { DocsList } from '@/components/admin/docs-list'

export default async function AdminDocsPage() {
  const [docs, categories] = await Promise.all([listDocsForAdmin(), listCategoriesForAdmin()])

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-xl font-bold">Docs</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {docs.length} lessons across {categories.length} categories.
      </p>
      <div className="mt-6">
        <DocsList docs={docs} categories={categories} />
      </div>
    </main>
  )
}
