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
