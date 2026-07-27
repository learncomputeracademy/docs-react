import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Untyped on purpose, same reasoning as lib/supabase/public.ts: Database
// (lib/database.types.ts) is still the empty pre-schema stub, and typing
// admin writes against it infers `never` for every insert/update payload
// rather than adding real safety. Only admin code (lib/admin/*.ts) uses
// this client — nothing in the public read path depends on it.
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // called from Server Component — cookie writes will happen in middleware
          }
        },
      },
    }
  )
}
