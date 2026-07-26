import { createClient } from '@supabase/supabase-js'

// Plain anon client — no cookies(), safe inside unstable_cache(),
// generateStaticParams, and any other context Next.js forbids request-scoped
// APIs in. RLS already allows anon reads of published content, so this is
// the correct client for every public read in lib/content.ts, not a
// workaround. The cookie-aware client in supabase/server.ts is reserved for
// future request-scoped (authenticated) access — nothing here needs it.
//
// ponytail: untyped on purpose — lib/database.types.ts's `Database` is still
// the empty pre-schema stub (never regenerated after the schema was
// applied), and typing against it actively breaks embedded-relation selects
// (infers `never`) rather than adding real safety. Regenerate with
// `supabase gen types typescript` once the CLI is linked to this project's
// own account, then reinstate `createClient<Database>(...)` here.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
