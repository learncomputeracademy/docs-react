import { listResourcesForAdmin } from '@/lib/admin/resources'
import { ResourcesManager } from '@/components/admin/resources-manager'

export default async function AdminResourcesPage() {
  const resources = await listResourcesForAdmin()

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-xl font-bold">Resources</h1>
      <p className="mt-1 text-sm text-muted-foreground">{resources.length} resources.</p>
      <div className="mt-6">
        <ResourcesManager resources={resources} />
      </div>
    </main>
  )
}
