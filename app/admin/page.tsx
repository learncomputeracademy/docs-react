import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/admin/sign-out-button'

// Phase 1 stub — proves the guard + login flow end to end. Screen 2's real
// dashboard (counts, recent docs, usage panel) is separate, later work.
export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin</h1>
        <SignOutButton />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Signed in as {user?.email}.</p>
    </main>
  )
}
