'use server'

import { createClient } from '@/lib/supabase/server'

export type ActivityAction =
  | 'created' | 'updated' | 'published' | 'unpublished' | 'deleted' | 'restored'
  | 'uploaded' | 'translated' | 'invited' | 'role_changed' | 'blocked' | 'unblocked'

export type EntityType = 'doc' | 'translation' | 'media' | 'category' | 'settings' | 'resource' | 'user'

// Never throws — a logging failure (e.g. this migration not run yet)
// must not take down the save/publish/delete it's recording. Same
// graceful-degradation reasoning as lib/content.ts's getSiteSettings.
export async function logActivity(action: ActivityAction, entityType: EntityType, entityId: string | null, entityLabel: string | null, meta?: Record<string, unknown>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('activity_log').insert({
      actor_id: user?.id ?? null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      entity_label: entityLabel,
      meta: meta ?? null,
    })
  } catch {
    // logging is best-effort — see doc comment above
  }
}

export type ActivityRow = {
  id: string
  action: ActivityAction
  entity_type: EntityType
  entity_id: string | null
  entity_label: string | null
  meta: Record<string, unknown> | null
  created_at: string
  actorLabel: string | null
}

// Admin-only per RLS ("admin reads activity") — an editor calling this
// gets an empty list, not an error, since the query itself succeeds and
// simply returns nothing under their policy.
export async function listActivity(limit = 100): Promise<ActivityRow[]> {
  const supabase = await createClient()
  const { data: logs, error } = await supabase
    .from('activity_log')
    .select('id, action, entity_type, entity_id, entity_label, meta, created_at, actor_id')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)

  const actorIds = [...new Set((logs ?? []).map((l) => l.actor_id).filter((id): id is string => Boolean(id)))]
  const nameById = new Map<string, string | null>()
  if (actorIds.length > 0) {
    const { data: profiles } = await supabase.from('profiles').select('id, name').in('id', actorIds)
    // profiles has no email column (that lives on auth.users, which RLS
    // doesn't expose to a non-service-role client) — name is enough to
    // identify who acted; falls back to a short id if name was never set.
    for (const p of profiles ?? []) nameById.set(p.id, p.name)
  }

  return (logs ?? []).map((l) => ({
    ...l,
    action: l.action as ActivityAction,
    entity_type: l.entity_type as EntityType,
    actorLabel: l.actor_id ? (nameById.get(l.actor_id) ?? l.actor_id.slice(0, 8)) : null,
  }))
}
