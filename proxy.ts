import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
import { getSidebarTree } from '@/lib/content'

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
const ADMIN_ONLY_PREFIXES = ['/admin/categories', '/admin/settings', '/admin/users', '/admin/activity', '/admin/trash', '/admin/menu', '/admin/notes']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin')) return checkDocPath(request, pathname)

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

// O-21: [category]/[slug] uses generateStaticParams without dynamicParams
// = false, so an unlisted slug's on-demand render gets cached as a real
// 200 instead of 404 (known Next.js App Router limitation, matches
// vercel/next.js#63483 — reproduced locally and on the live deploy).
// dynamicParams=false would fix the status but 404 a lesson published
// after the last build; force-dynamic would fix it but hits Supabase on
// every request, including bots, which is exactly what the free-tier
// "never SSR a doc page" guardrail (CLAUDE.md §4) forbids. This instead
// rides the same getSidebarTree() cache every category layout already
// reads — tag 'sidebar', busted by the existing revalidateTag('sidebar')
// call on every publish/unpublish — so a genuinely invalid slug gets
// rewritten to a path with no matching route, which forces Next's normal
// (correctly-statused) not-found flow instead of the static-fallback one.
async function checkDocPath(request: NextRequest, pathname: string): Promise<NextResponse> {
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) return NextResponse.next()

  const isBn = pathname === '/bn' || pathname.startsWith('/bn/')
  const segments = (isBn ? pathname.slice(3) : pathname).split('/').filter(Boolean)
  // 'tools' is the one other literal route with real 2-segment children
  // (/tools/grid, etc.) — Next resolves it before ever reaching
  // [category]/[slug], so it never needs the lookup below. Everything
  // else 2-segment funnels through that dynamic route, real category or
  // not, which is exactly the shape this bug affects.
  if (segments.length === 2 && segments[0] !== 'tools') {
    const [category, slug] = segments
    const categories = await getSidebarTree(isBn ? 'bn' : 'en')
    const cat = categories.find((c) => c.slug === category)
    if (!cat?.docs.some((d) => d.path === `${category}/${slug}`)) {
      return NextResponse.rewrite(new URL('/__404__', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/:category/:slug', '/bn/:category/:slug'],
}
