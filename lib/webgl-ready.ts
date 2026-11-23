'use client'

import { useEffect, useState, type RefObject } from 'react'

// Page-speed fix (2026-11-23): the WebGL effects (SpecularButton; ElectricBorder until it was removed)
// compiled their shaders all at once during hydration, blocking the main
// thread on the homepage (Lighthouse mobile: TBT 3.3 s, ~2.6 s of it these
// effects). Now each one starts only after the visitor's first interaction
// (mouse move, touch, scroll, key), once it is near the viewport, one per idle
// period. Until then the element renders normally, without the effect.
// Starting after load instead was measured and still landed in the TBT window.

const queue: (() => void)[] = []
let pumping = false

const idle = (fn: () => void) =>
  'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 200)

function pump() {
  const next = queue.shift()
  if (!next) {
    pumping = false
    return
  }
  next()
  idle(pump)
}

function enqueue(fn: () => void) {
  queue.push(fn)
  if (pumping) return
  pumping = true
  if (interacted) idle(pump)
  else waiting = true
}

const INTERACTIONS = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'] as const
let interacted = false
let waiting = false
let listening = false

function listenOnce() {
  if (listening) return
  listening = true
  const onFirst = () => {
    for (const e of INTERACTIONS) window.removeEventListener(e, onFirst)
    interacted = true
    if (waiting) idle(pump)
  }
  for (const e of INTERACTIONS) window.addEventListener(e, onFirst, { passive: true })
}

export function useWebglReady(ref: RefObject<Element | null>): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || ready) return
    listenOnce()
    let cancelled = false
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        enqueue(() => {
          if (!cancelled) setReady(true)
        })
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
    }
  }, [ref, ready])
  return ready
}
