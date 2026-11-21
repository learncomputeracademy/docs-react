// GA4 events for the docs stream (G-XTBB1C05FC, D-140). The Google tag is
// injected by Cloudflare's tag gateway via GTM, so there is no global gtag();
// a gtag-style command pushed onto dataLayer is picked up by that tag
// (verified 2026-11-21: arrives as /5oas/…/g/c?tid=G-XTBB1C05FC&en=…).
// send_to keeps it off the main site's GA4 streams. No-op if blocked.
const DOCS_GA4 = 'G-XTBB1C05FC'

export function trackEvent(name: string, params: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  // gtag reads Arguments objects, not plain arrays; the rest param only types the call.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;(function (..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments)
  })('event', name, { ...params, send_to: DOCS_GA4 })
}
