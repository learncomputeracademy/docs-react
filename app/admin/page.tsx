import { createClient } from '@/lib/supabase/server'

// Phase 1 stub, still — proves the guard + login flow end to end. Nav and
// sign-out moved to the sidebar (AdminChrome) this session. Screen 2's
// real dashboard (counts, recent docs, usage panel) is Phase 9.
export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Signed in as {user?.email}.</p>
    </main>
  )
}
