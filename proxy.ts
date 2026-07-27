import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

// Re-added for Stage 7 (deleted in session 11 — its only job then was an
// x-locale header, replaced by client-side lang correction). This time
// scoped to /admin only: a dynamic API touched here doesn't affect route
// static-ness the way one in the ROOT LAYOUT does (D-18's headers() bug) —
// but keep the matcher tight anyway and verify `next build` still shows
// ●/○ on every public route after any change here.
//
// auth.getUser() (not getSession()) — it revalidates the token against
// Supabase's auth server instead of trusting a cookie-only session, which
// is what Supabase's own docs call out as required in middleware.
//
// D-37: role/status now come from `profiles`, not the JWT's app_metadata.
// A blocked user's JWT stays technically valid for up to an hour, but this
// query hits the live table every request — blocking takes effect on
// their very next navigation, not on token refresh.
const ADMIN_ONLY_PREFIXES = ['/admin/categories', '/admin/settings', '/admin/resources', '/admin/users', '/admin/activity', '/admin/trash', '/admin/menu']

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  let role: 'admin' | 'editor' | null = null
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
    if (profile?.status === 'active') role = profile.role as 'admin' | 'editor'
  }
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (!role && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }
  if (role && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }
  if (role === 'editor' && ADMIN_ONLY_PREFIXES.some((p) => request.nextUrl.pathname.startsWith(p))) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: '/admin/:path*',
}
