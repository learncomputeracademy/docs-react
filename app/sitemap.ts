import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { getAllCategorySlugs, getAllPublishedPaths, getTranslatedPathsForSitemap } from '@/lib/content'

// Everything here is data-driven, not hand-maintained — a doc only shows
// up once it's actually published (getAllPublishedPaths reads through the
// same RLS-bound public client every page uses), so this can never list a
// URL that 404s. /about specifically: it's a docs row like any other, so
// it appears here automatically the day someone publishes it (O-1), and
// not before.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, docs, bnDocs] = await Promise.all([
    getAllCategorySlugs(),
    getAllPublishedPaths(),
    getTranslatedPathsForSitemap(),
  ])

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/bn`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/resources`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/tools/box-model`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/box-model`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/box-shadow-generator`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/box-shadow-generator`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/gradient`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/gradient`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/flexbox`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/flexbox`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/scrollbar`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/scrollbar`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  for (const c of categories) {
    entries.push({ url: `${SITE_URL}/${c.slug}`, changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${SITE_URL}/bn/${c.slug}`, changeFrequency: 'weekly', priority: 0.7 })
  }

  for (const d of docs) {
    entries.push({ url: `${SITE_URL}/${d.path}`, lastModified: d.updated_at, changeFrequency: 'monthly', priority: 0.6 })
  }

  for (const d of bnDocs) {
    entries.push({ url: `${SITE_URL}/bn/${d.path}`, lastModified: d.updated_at, changeFrequency: 'monthly', priority: 0.5 })
  }

  return entries
}
