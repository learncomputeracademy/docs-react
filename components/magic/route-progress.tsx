'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'

// Deliberately usePathname() only, never useSearchParams() — this site's
// routes never depend on query params for content, and useSearchParams()
// without a Suspense boundary forces the whole (static) tree into dynamic
// rendering, the same class of mistake as the headers()-in-root-layout bug
// in D-18. usePathname() alone doesn't have that hazard.
const emitter = typeof EventTarget !== 'undefined' ? new EventTarget() : null

// Call this from any navigation NOT triggered by clicking a real <a>/<Link>
// — e.g. the command palette's router.push() — so the bar below still
// shows. Real <Link> clicks are caught automatically by the click listener,
// no per-component wiring needed.
export function startRouteProgress() {
  emitter?.dispatchEvent(new Event('start'))
}

export function RouteProgressBar() {
  const [active, setActive] = useState(false)
  const pathname = usePathname()
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    function start() {
      clearTimeout(hideTimer.current)
      setActive(true)
    }

    function onClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as HTMLElement)?.closest?.('a')
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#')) return
      if (anchor.origin !== window.location.origin) return
      if (anchor.pathname === pathname) return
      start()
    }

    emitter?.addEventListener('start', start)
    document.addEventListener('click', onClick)
    return () => {
      emitter?.removeEventListener('start', start)
      document.removeEventListener('click', onClick)
    }
  }, [pathname])

  // Pathname actually changed — the destination is rendered, wrap up.
  useEffect(() => {
    if (!active) return
    hideTimer.current = setTimeout(() => setActive(false), 150)
    return () => clearTimeout(hideTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0.85, transition: { duration: 8, ease: 'easeOut' } }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.25 } }}
        />
      )}
    </AnimatePresence>
  )
}
