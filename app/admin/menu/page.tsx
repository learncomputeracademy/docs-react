import { listNavItemsForAdmin } from '@/lib/admin/nav'
import { NavManager } from '@/components/admin/nav-manager'

export default async function AdminMenuPage() {
  const items = await listNavItemsForAdmin()

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-xl font-bold">Menu</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Links shown in the site header, next to the logo. URLs starting with{' '}
        <code className="rounded bg-muted px-1">http</code> open in a new tab automatically.
      </p>
      <div className="mt-6">
        <NavManager items={items} />
      </div>
    </main>
  )
}
