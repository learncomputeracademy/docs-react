import type { Metadata } from 'next'
import { WpQueryBuilderDemo } from '@/components/tools/wp-query-builder-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'WP_Query Args বিল্ডার',
  description:
    'একটা secondary WordPress query visually বানান — post type, order, category/tag/search filter, related-posts exclusion — আর loop-সহ আসল WP_Query PHP ফেরত পান।',
  alternates: buildAlternates('/bn/tools/wp-query-builder', '/tools/wp-query-builder', '/bn/tools/wp-query-builder'),
}

export default function WpQueryBuilderPageBn() {
  return <WpQueryBuilderDemo locale="bn" />
}
