import { createClient } from '@supabase/supabase-js'

// ⚠️ Service-role client — bypasses RLS. Server-only. Never import in client components.
// Untyped on purpose, same reasoning as lib/supabase/public.ts and
// lib/supabase/server.ts: Database (lib/database.types.ts) is still the
// empty pre-schema stub, and typing against it infers `never` for
// embedded-relation selects rather than adding real safety.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
