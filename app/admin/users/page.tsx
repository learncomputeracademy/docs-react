import { listUsers } from '@/lib/admin/users'
import { createClient } from '@/lib/supabase/server'
import { UsersManager } from '@/components/admin/users-manager'

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const users = await listUsers()

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-xl font-bold">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {users.length} accounts. Editors can write and publish docs/media; only admins manage
        categories, settings, resources, users, and can delete or restore lessons.
      </p>
      <div className="mt-6">
        <UsersManager users={users} currentUserId={user!.id} />
      </div>
    </main>
  )
}
