'use client'

import { useMemo, useState } from 'react'
import type { ActivityRow } from '@/lib/admin/activity'

const ACTION_LABEL: Record<string, string> = {
  created: 'created',
  updated: 'edited',
  published: 'published',
  unpublished: 'unpublished',
  deleted: 'deleted',
  restored: 'restored',
  uploaded: 'uploaded',
  translated: 'translated',
  invited: 'invited',
  role_changed: 'changed role of',
  blocked: 'blocked',
  unblocked: 'unblocked',
}

const ACTION_COLOR: Record<string, string> = {
  deleted: 'text-destructive',
  blocked: 'text-destructive',
  published: 'text-emerald-600 dark:text-emerald-400',
  restored: 'text-emerald-600 dark:text-emerald-400',
  unblocked: 'text-emerald-600 dark:text-emerald-400',
  created: 'text-emerald-600 dark:text-emerald-400',
}

export function ActivityFeed({ entries }: { entries: ActivityRow[] }) {
  const [actorFilter, setActorFilter] = useState('')
  const actors = useMemo(() => [...new Set(entries.map((e) => e.actorLabel).filter((a): a is string => Boolean(a)))], [entries])

  const filtered = actorFilter ? entries.filter((e) => e.actorLabel === actorFilter) : entries

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
  }

  return (
    <div>
      {actors.length > 1 && (
        <select value={actorFilter} onChange={(e) => setActorFilter(e.target.value)} className="mb-4 rounded-md border bg-background px-2 py-1.5 text-sm">
          <option value="">Everyone</option>
          {actors.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      )}
      <div className="overflow-hidden rounded-lg border">
        {filtered.map((entry) => (
          <div key={entry.id} className="flex flex-wrap items-center gap-2 border-b bg-background px-4 py-2.5 text-sm last:border-0">
            <span className="font-medium">{entry.actorLabel ?? 'System'}</span>
            <span className={ACTION_COLOR[entry.action] ?? 'text-muted-foreground'}>{ACTION_LABEL[entry.action] ?? entry.action}</span>
            <span className="text-muted-foreground">{entry.entity_type}</span>
            {entry.entity_label && <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">{entry.entity_label}</span>}
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
