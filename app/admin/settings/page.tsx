import { getUsageStats } from '@/lib/admin/usage'
import { getSettingsForAdmin } from '@/lib/admin/settings'
import { BrandingManager } from '@/components/admin/branding-manager'
import type { BrandingSettings } from '@/lib/admin/branding'

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

// Moved here from the Dashboard (admin-only, unlike Dashboard which
// editors also see) — free-tier internals like DB size aren't something
// an editor needs in front of them day to day. Page-editable content
// (home hero / about-band) moved the other way, out to /admin/pages,
// since that's genuinely editorial and editors should be able to touch it.
export default async function AdminSettingsPage() {
  const [usage, branding] = await Promise.all([
    getUsageStats(),
    getSettingsForAdmin('branding') as Promise<Partial<BrandingSettings>>,
  ])
  const activityWarning = usage.daysSinceActivity !== null && usage.daysSinceActivity >= 4

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Free-tier usage, branding, and project health.</p>

      <div className="mt-6">
        <h2 className="font-semibold">Branding</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The logo shown in the site header — a separate file for each theme, since the wordmark text
          is baked into the artwork rather than rendered separately.
        </p>
        <div className="mt-3">
          <BrandingManager initial={branding} />
        </div>
      </div>

      {/* ADMIN.md's usage panel: the inactivity row is the one that actually
          matters (free tier pauses at 7 days idle) — kept visually dominant,
          not a footnote next to storage. Egress/file-storage/MAU metrics
          need the separate Supabase Management API (no token for that in
          this project), so they're not shown rather than faked. */}
      <div className="mt-6 rounded-lg border p-4">
        <h2 className="font-semibold">Free-tier usage</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className={`rounded-md border p-3 ${activityWarning ? 'border-destructive/40 bg-destructive/10' : ''}`}>
            <p className={`text-2xl font-bold ${activityWarning ? 'text-destructive' : ''}`}>
              {usage.daysSinceActivity ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground">Days since last DB activity (pauses at 7)</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-2xl font-bold">{usage.dbSizePercent.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Database size — {formatBytes(usage.dbSizeBytes)} of 500 MB</p>
          </div>
        </div>
      </div>
    </main>
  )
}
