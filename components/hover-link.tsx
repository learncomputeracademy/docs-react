'use client'

import NextLink from 'next/link'
import { useState, type ComponentProps } from 'react'

// Drop-in for next/link that prefetches on intent (hover / focus / touch)
// instead of when the link scrolls into view. A category sidebar lists 25+
// lessons; with the default, one page view fired that many background
// requests, each one a billable edge request (and, for lesson URLs, a
// proxy.ts invocation). The Nov 2026 Vercel pause was an edge-request
// overage. Navigation still feels instant — the prefetch starts the moment
// the pointer reaches the link.
export default function Link({ prefetch, onMouseEnter, onFocus, onTouchStart, ...props }: ComponentProps<typeof NextLink>) {
  const [armed, setArmed] = useState(false)
  return (
    <NextLink
      {...props}
      prefetch={armed ? (prefetch ?? null) : false}
      onMouseEnter={(e) => { setArmed(true); onMouseEnter?.(e) }}
      onFocus={(e) => { setArmed(true); onFocus?.(e) }}
      onTouchStart={(e) => { setArmed(true); onTouchStart?.(e) }}
    />
  )
}
