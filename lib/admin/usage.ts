'use server'

import { createAdminClient } from '@/lib/supabase/admin'

const DB_LIMIT_BYTES = 500 * 1024 * 1024 // Supabase free tier

export type UsageStats = {
  dbSizeBytes: number
  dbSizePercent: number
  daysSinceActivity: number | null
}

// ADMIN.md's usage panel spec asks for 4 metrics (DB size, egress, file
// storage, MAU) but egress/storage/MAU all require the separate Supabase
// *Management* API (a different token than this project's anon/service-
// role keys, not present in .env.local) — not fabricating numbers for
// what isn't actually measurable. Scoped to the two ADMIN.md itself says
// matter most: "storage will sit at 1% for years; the 7-day inactivity
// pause is the thing that will actually interrupt you."
export async function getUsageStats(): Promise<UsageStats> {
  const supabase = createAdminClient()

  const [{ data: dbSize }, { data: docs }] = await Promise.all([
    supabase.rpc('db_size'),
    supabase.from('docs').select('updated_at').order('updated_at', { ascending: false }).limit(1),
  ])

  const dbSizeBytes = typeof dbSize === 'number' ? dbSize : 0
  const lastActivity = docs?.[0]?.updated_at ? new Date(docs[0].updated_at) : null
  const daysSinceActivity = lastActivity
    ? Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
    : null

  return {
    dbSizeBytes,
    dbSizePercent: (dbSizeBytes / DB_LIMIT_BYTES) * 100,
    daysSinceActivity,
  }
}
