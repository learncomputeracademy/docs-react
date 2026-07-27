import { listActivity } from '@/lib/admin/activity'
import { ActivityFeed } from '@/components/admin/activity-feed'

export default async function ActivityPage() {
  const entries = await listActivity(200)

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-xl font-bold">Activity</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Last {entries.length} actions across the admin panel. Only catches what goes through
        the app — direct database changes aren&apos;t attributed to anyone here.
      </p>
      <div className="mt-6">
        <ActivityFeed entries={entries} />
      </div>
    </main>
  )
}
