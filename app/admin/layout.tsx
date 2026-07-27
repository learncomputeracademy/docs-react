import type { Metadata } from 'next'

// Bare shell for Phase 1 — no shared nav/chrome yet, deliberately, per
// ADMIN-PLAN.md's build order (there's only a login page and a dashboard
// stub to link between so far). noindex covers the whole /admin subtree.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
