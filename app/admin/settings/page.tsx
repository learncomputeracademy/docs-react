import { getSettingsForAdmin } from '@/lib/admin/settings'
import { SettingsManager } from '@/components/admin/settings-manager'

export default async function AdminSettingsPage() {
  const initial = await getSettingsForAdmin('home')

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-xl font-bold">Site content</h1>
      <p className="mt-1 text-sm text-muted-foreground">Homepage hero and "about" band copy. Leave a field empty to use the site default.</p>
      <div className="mt-6">
        <SettingsManager initial={initial} />
      </div>
    </main>
  )
}
