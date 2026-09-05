import type { Metadata } from 'next'
import { WpQueryBuilderDemo } from '@/components/tools/wp-query-builder-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'WP_Query Args Builder',
  description:
    'Build a secondary WordPress query visually — post type, order, category/tag/search filters, related-posts exclusion — and get back real WP_Query PHP with the loop wrapped around it.',
  alternates: buildAlternates('/tools/wp-query-builder', '/tools/wp-query-builder', '/bn/tools/wp-query-builder'),
}

export default function WpQueryBuilderPage() {
  return <WpQueryBuilderDemo locale="en" />
}
