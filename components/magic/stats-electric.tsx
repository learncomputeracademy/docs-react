'use client'

import { useSyncExternalStore } from 'react'
import ElectricBorder from './electric-border'

// Follows the `dark` class the head script / theme toggle sets on <html>.
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => mo.disconnect()
}
const isDark = () => document.documentElement.classList.contains('dark')

// React Bits ElectricBorder in the site's orange, theme-aware.
export function StatsElectric({ children }: { children: React.ReactNode }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => true)
  return (
    <ElectricBorder color="#f97316" borderRadius={16} theme={dark ? 'dark' : 'light'} speed={0.8} chaos={0.5} glow={0.7} className="rounded-2xl">
      {children}
    </ElectricBorder>
  )
}
