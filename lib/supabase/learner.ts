'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { AUTH_STORAGE_KEY } from '@/lib/account-state'

// Learner (public site) sign-in client. Deliberately separate from the
// cookie-based admin client (lib/supabase/client.ts): the session lives in
// localStorage, so public pages never send or set auth cookies and stay
// fully static/cacheable (CLAUDE.md §3.3, Cloudflare caching). PKCE flow;
// the OAuth redirect lands on /account, where detectSessionInUrl finishes
// the exchange.
let client: SupabaseClient | null = null

export function learnerClient(): SupabaseClient {
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      storageKey: AUTH_STORAGE_KEY,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  })
  return client
}
