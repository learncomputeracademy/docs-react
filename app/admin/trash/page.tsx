import { listTrash } from '@/lib/admin/docs'
import { TrashList } from '@/components/admin/trash-list'

export default async function TrashPage() {
  const docs = await listTrash()

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-xl font-bold">Trash</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Deleted lessons. Restoring brings a lesson back exactly as it was — same status, same URL.
      </p>
      <div className="mt-6">
        <TrashList docs={docs} />
      </div>
    </main>
  )
}
