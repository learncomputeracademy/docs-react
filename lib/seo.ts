// Server-only-safe (no DOM/client APIs) — used from generateMetadata and
// server components. SITE_URL is the one place the canonical domain lives;
// everything else (sitemap, robots, canonical tags, JSON-LD) reads from here.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://docs.learncomputer.in').replace(/\/$/, '')
export const SITE_NAME = 'Learn Computer Academy'

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

// Next's `alternates` metadata field — canonical plus hreflang pairs.
// `currentPath` is always the URL of the page calling this (so the EN and
// BN versions of the same content each get their OWN canonical, never each
// other's). `bnPath` is optional: standalone pages (about/contact/
// resources) have no Bengali URL yet, so only self-canonical applies there.
// Most lesson `meta_title` values were written by content scripts that baked
// " | Learn Computer Academy" into the string directly (matching the old
// Jekyll front matter's style). The root layout's title.template appends the
// same suffix again, so the raw value would double up in the tab (O-16).
// Strip a trailing site-name suffix here, once, so it flows through the
// template exactly once regardless of whether the stored title already has
// it, doesn't have it, or (via the admin panel) never gets it added at all.
export function docMetaTitle(doc: { meta_title: string | null; title: string }): string {
  const raw = doc.meta_title ?? doc.title
  const suffix = ` | ${SITE_NAME}`
  return raw.endsWith(suffix) ? raw.slice(0, -suffix.length) : raw
}

export function buildAlternates(currentPath: string, enPath: string, bnPath?: string) {
  if (!bnPath) return { canonical: absoluteUrl(currentPath) }
  return {
    canonical: absoluteUrl(currentPath),
    languages: {
      en: absoluteUrl(enPath),
      bn: absoluteUrl(bnPath),
      'x-default': absoluteUrl(enPath),
    },
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/logo-icon.png'),
    sameAs: ['https://learncomputer.in'],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ['en', 'bn'],
  }
}

export function articleJsonLd(doc: {
  title: string
  meta_description: string | null
  path: string
  created_at: string
  updated_at: string
}, locale: 'en' | 'bn') {
  const path = locale === 'bn' ? `/bn/${doc.path}` : `/${doc.path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: doc.title,
    description: doc.meta_description ?? undefined,
    url: absoluteUrl(path),
    datePublished: doc.created_at,
    dateModified: doc.updated_at,
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'EducationalOrganization', name: SITE_NAME, url: SITE_URL },
  }
}

// <script type="application/ld+json"> content. Escapes "<" so an
// admin-authored title/description containing the literal string
// "</script>" can't break out of the script tag when injected via
// dangerouslySetInnerHTML — standard practice for inline JSON-LD.
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
