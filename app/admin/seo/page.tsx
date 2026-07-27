import { getSettingsForAdmin } from '@/lib/admin/settings'
import { SeoManager } from '@/components/admin/seo-manager'

// Editor-accessible, same reasoning as Pages — search engine verification
// codes are a one-time paste job, not an ongoing config decision, so
// there's no reason to gate it behind admin. The actual Search Console/
// Bing Webmaster property setup (Stage 10) still needs the site owner's
// own Google/Microsoft account — this screen only stores the codes once
// that's done.
export default async function AdminSeoPage() {
  const initial = await getSettingsForAdmin('seo')

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-xl font-bold">SEO</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Search engine verification. Sitemap and robots.txt are automatic — see{' '}
        <code className="rounded bg-muted px-1">/sitemap.xml</code> and{' '}
        <code className="rounded bg-muted px-1">/robots.txt</code>.
      </p>
      <div className="mt-6">
        <SeoManager initial={initial} />
      </div>
    </main>
  )
}
