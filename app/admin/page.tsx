import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getDashboardData } from '@/lib/admin/dashboard'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const [{ data: { user } }, { counts, recent }] = await Promise.all([
    supabase.auth.getUser(),
    getDashboardData(),
  ])

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
