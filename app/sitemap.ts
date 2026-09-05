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
    { url: `${SITE_URL}/tools`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools`, changeFrequency: 'monthly', priority: 0.6 },
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
    { url: `${SITE_URL}/tools/specificity`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/specificity`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/colour`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/colour`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/grid`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/grid`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/clamp`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/clamp`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/units`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/units`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/animation`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/animation`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/filters`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/filters`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/colorblind`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/colorblind`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/shades`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/shades`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/lorem-text`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/lorem-text`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/lorem-image`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/lorem-image`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/lorem-video`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/lorem-video`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/number-system`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/number-system`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/notepad`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/notepad`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/event-loop`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/event-loop`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/recursion`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/recursion`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/scope-closure`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/scope-closure`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/serp-preview`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/serp-preview`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/wp-template-hierarchy`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/wp-template-hierarchy`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/wp-hooks-timeline`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/wp-hooks-timeline`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/wp-query-builder`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/wp-query-builder`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tools/wp-enqueue-generator`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/tools/wp-enqueue-generator`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/typing-test`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/bn/typing-test`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/typing-test/lessons`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/bn/typing-test/lessons`, changeFrequency: 'monthly', priority: 0.5 },
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
