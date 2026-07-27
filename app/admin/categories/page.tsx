import { listCategoriesFull } from '@/lib/admin/categories'
import { CategoriesManager } from '@/components/admin/categories-manager'

export default async function AdminCategoriesPage() {
  const categories = await listCategoriesFull()

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-xl font-bold">Categories</h1>
      <p className="mt-1 text-sm text-muted-foreground">{categories.length} categories.</p>
      <div className="mt-6">
        <CategoriesManager categories={categories} />
      </div>
    </main>
  )
}
