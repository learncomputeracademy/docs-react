'use server'

import { createClient } from '@/lib/supabase/server'

export type DashboardCounts = {
  totalDocs: number
  publishedDocs: number
  draftDocs: number
  categories: number
  translations: number
}

export type RecentDoc = { id: string; title: string; path: string; status: 'draft' | 'published'; updated_at: string }

export async function getDashboardData(): Promise<{ counts: DashboardCounts; recent: RecentDoc[] }> {
  const supabase = await createClient()

  const [totalRes, publishedRes, draftRes, categoriesRes, translationsRes, recentRes] = await Promise.all([
    supabase.from('docs').select('id', { count: 'exact', head: true }),
    supabase.from('docs').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('docs').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('doc_translations').select('id', { count: 'exact', head: true }),
    supabase.from('docs').select('id, title, path, status, updated_at').order('updated_at', { ascending: false }).limit(5),
  ])

  return {
    counts: {
      totalDocs: totalRes.count ?? 0,
      publishedDocs: publishedRes.count ?? 0,
      draftDocs: draftRes.count ?? 0,
      categories: categoriesRes.count ?? 0,
      translations: translationsRes.count ?? 0,
    },
    recent: recentRes.data ?? [],
  }
}
