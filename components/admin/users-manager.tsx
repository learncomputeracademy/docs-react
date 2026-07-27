'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type UserRow, createUser, updateUserRole, setUserStatus, deleteUser } from '@/lib/admin/users'

function RoleBadge({ role }: { role: 'admin' | 'editor' }) {
  return (
    <span className={role === 'admin' ? 'rounded px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary' : 'rounded px-1.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground'}>
      {role}
    </span>
  )
}

function CreateUserForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'admin' | 'editor'>('editor')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ email: string; tempPassword: string } | null>(null)
  const [copied, setCopied] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        const res = await createUser({ email: email.trim(), name: name.trim(), role })
        setResult(res)
        setEmail('')
        setName('')
        setRole('editor')
        onCreated()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create user')
      }
    })
  }

  if (result) {
    return (
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm font-medium">Account created for {result.email}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Hand this temporary password to them yourself — it's shown once and can't be retrieved again. They should change it after signing in.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <code className="rounded bg-background px-2 py-1 text-sm">{result.tempPassword}</code>
          <button
            type="button"
            onClick={() => { navigator.clipboard.writeText(result.tempPassword); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Copy password"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        </div>
        <Button size="sm" variant="outline" className="mt-3" onClick={() => { setResult(null); setOpen(false) }}>Done</Button>
      </div>
    )
  }

  if (!open) {
    return <Button size="sm" onClick={() => setOpen(true)}><Plus className="size-3.5" /> New user</Button>
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-2 rounded-lg border bg-muted/30 p-3">
      <div className="space-y-1">
        <label className="text-xs font-medium">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="block rounded-md border bg-background px-2 py-1.5 text-sm" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block rounded-md border bg-background px-2 py-1.5 text-sm" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'editor')} className="block rounded-md border bg-background px-2 py-1.5 text-sm">
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <Button type="submit" size="sm" disabled={pending}>{pending ? 'Creating…' : 'Create'}</Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      {error && <p className="w-full text-sm text-destructive">{error}</p>}
    </form>
  )
}

export function UsersManager({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onRoleChange(user: UserRow, role: 'admin' | 'editor') {
    setError(null)
    startTransition(async () => {
      try {
        await updateUserRole(user.id, role)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to change role')
      }
    })
  }

  function onToggleStatus(user: UserRow) {
    setError(null)
    startTransition(async () => {
      try {
        await setUserStatus(user.id, user.status === 'active' ? 'blocked' : 'active')
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update status')
      }
    })
  }

  function onDelete(user: UserRow) {
    if (user.role === 'admin') {
      setError('This account is an admin. Change its role to Editor first, then delete it.')
      return
    }
    if (!confirm(`Delete ${user.email}? This can't be undone.`)) return
    setError(null)
    startTransition(async () => {
      try {
        await deleteUser(user.id, user.email)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to delete user')
      }
    })
  }

  return (
    <div>
      <div className="mb-4">
        <CreateUserForm onCreated={() => router.refresh()} />
      </div>
      {error && <p className="mb-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      <div className="overflow-hidden rounded-lg border">
        {users.map((user) => {
          const isSelf = user.id === currentUserId
          return (
            <div key={user.id} className="flex flex-wrap items-center gap-3 border-b bg-background px-4 py-2.5 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{user.name ?? user.email}{isSelf && <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <RoleBadge role={user.role} />
              <span className={user.status === 'blocked' ? 'text-xs font-medium text-destructive' : 'text-xs text-muted-foreground'}>
                {user.status}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {user.last_sign_in_at ? `Last seen ${new Date(user.last_sign_in_at).toLocaleDateString()}` : 'Never signed in'}
              </span>
              <select
                value={user.role}
                disabled={pending || isSelf}
                onChange={(e) => onRoleChange(user, e.target.value as 'admin' | 'editor')}
                className="rounded-md border bg-background px-2 py-1 text-xs disabled:opacity-50"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              <Button size="sm" variant="ghost" disabled={pending || isSelf} onClick={() => onToggleStatus(user)}>
                {user.status === 'active' ? 'Block' : 'Unblock'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={pending || isSelf || user.role === 'admin'}
                onClick={() => onDelete(user)}
                className="text-destructive"
                title={user.role === 'admin' ? 'Demote to editor first' : undefined}
              >
                Delete
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
