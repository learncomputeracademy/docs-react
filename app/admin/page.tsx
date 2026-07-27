import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getDashboardData } from '@/lib/admin/dashboard'
import { getUsageStats } from '@/lib/admin/usage'

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const [{ data: { user } }, { counts, recent }, usage] = await Promise.all([
    supabase.auth.getUser(),
    getDashboardData(),
    getUsageStats(),
  ])

  const activityWarning = usage.daysSinceActivity !== null && usage.daysSinceActivity >= 4

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Signed in as {user?.email}.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{counts.totalDocs}</p>
          <p className="text-xs text-muted-foreground">Lessons</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{counts.publishedDocs}</p>
          <p className="text-xs text-muted-foreground">Published</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold text-muted-foreground">{counts.draftDocs}</p>
          <p className="text-xs text-muted-foreground">Draft</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{counts.translations}</p>
          <p className="text-xs text-muted-foreground">Bengali translations</p>
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

      <div className="mt-6 rounded-lg border p-4">
        <h2 className="font-semibold">Recently edited</h2>
        <div className="mt-3 space-y-2">
          {recent.map((doc) => (
            <Link key={doc.id} href={`/admin/docs/${doc.id}`} className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
              <span className="min-w-0 truncate">{doc.title}</span>
              <span className={doc.status === 'published' ? 'shrink-0 text-xs text-emerald-600 dark:text-emerald-400' : 'shrink-0 text-xs text-muted-foreground'}>
                {doc.status}
              </span>
            </Link>
          ))}
          {recent.length === 0 && <p className="text-sm text-muted-foreground">No docs yet.</p>}
        </div>
      </div>
    </main>
  )
}
