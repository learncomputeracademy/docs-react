import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Client-side-only id for list items (layers, gradient stops, …) — never
// persisted, so collision resistance just needs to beat Math.random when
// crypto.randomUUID isn't available (older Safari, non-secure contexts).
export function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}
