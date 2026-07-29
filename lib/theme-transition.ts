import { flushSync } from 'react-dom'

// Circular-reveal theme change, adapted from magicui.design's Animated
// Theme Toggler. That component is built for next-themes' setTheme; this
// project doesn't use next-themes (app/layout.tsx explains why: a Server
// Component reading cookies()/headers() for theme would force the whole
// site into per-request SSR, which CLAUDE.md §3.3 forbids), so this wraps
// the existing localStorage + classList toggle instead.
export async function animateThemeChange(originX: number, originY: number, applyTheme: () => void) {
  // No View Transition API (Firefox, older Safari) or the user asked for
  // less motion: just apply the change, nothing to animate.
  if (typeof document.startViewTransition !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyTheme()
    return
  }

  const transition = document.startViewTransition(() => flushSync(applyTheme))
  await transition.ready

  const maxRadius = Math.hypot(Math.max(originX, window.innerWidth - originX), Math.max(originY, window.innerHeight - originY))

  document.documentElement.animate(
    { clipPath: [`circle(0px at ${originX}px ${originY}px)`, `circle(${maxRadius}px at ${originX}px ${originY}px)`] },
    { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
  )
}
