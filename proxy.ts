import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only job: let the root layout (which can't read dynamic route params —
// /bn is a literal folder split, not a [locale] segment) know which
// language is active, so <html lang> is correct for a11y/SEO.
export function proxy(request: NextRequest) {
  const locale = request.nextUrl.pathname.startsWith('/bn') ? 'bn' : 'en'
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: '/((?!_next|.*\\..*).*)',
}
