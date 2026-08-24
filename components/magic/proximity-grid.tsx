'use client'

import { createContext, useContext } from 'react'
import { useMotionValue, type MotionValue } from 'motion/react'
import { cn } from '@/lib/utils'

// Shared pointer position for a grid of MagicCards — lets every card in the
// grid react to cursor proximity (react-bits Magic Bento style), not just
// the one directly under the pointer. mouseX/mouseY are viewport (clientX/Y)
// coordinates so each card can independently compute its own distance
// without listening on the pointer itself; `active` flips to 0 on leave so
// every card glow fades out together instead of the last-known position
// sticking around.
export const ProximityContext = createContext<{ mouseX: MotionValue<number>; mouseY: MotionValue<number>; active: MotionValue<number> } | null>(null)

export function useProximity() {
  return useContext(ProximityContext)
}

export function ProximityGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const active = useMotionValue(0)

  return (
    <ProximityContext.Provider value={{ mouseX, mouseY, active }}>
      <div
        className={cn(className)}
        onMouseMove={(e) => {
          mouseX.set(e.clientX)
          mouseY.set(e.clientY)
          active.set(1)
        }}
        onMouseLeave={() => active.set(0)}
      >
        {children}
      </div>
    </ProximityContext.Provider>
  )
}
