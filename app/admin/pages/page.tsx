import { getSettingsForAdmin } from '@/lib/admin/settings'
import { PagesManager } from '@/components/admin/pages-manager'

// Editors can reach this screen (unlike Settings) — it's page content, not
// project configuration. Today only the "home" key (hero + about-band
// text) has a form; more pages get a form here the same way, as they're
// added — footer/contact site_settings keys already exist (003-admin.sql)
// but have no editor UI yet, same as before this split.
export default async function AdminPagesPage() {
  const initial = await getSettingsForAdmin('home')

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-xl font-bold">Pages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Home — hero and &quot;about&quot; band copy. Leave a field empty to use the site default.
      </p>
      <div className="mt-6">
        <PagesManager initial={initial} />
      </div>
    </main>
  )
}
