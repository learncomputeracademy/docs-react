import type { Metadata } from 'next'
import { WpTemplateHierarchyDemo } from '@/components/tools/wp-template-hierarchy-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'WordPress Template Hierarchy ভিজুয়ালাইজার',
  description:
    'একটা request type বেছে নিন — single post, category archive, 404, আরও অনেক কিছু — আর file check/uncheck করে দেখুন WordPress আসলে কোন template load করবে, আসল documented search order-এ।',
  alternates: buildAlternates('/bn/tools/wp-template-hierarchy', '/tools/wp-template-hierarchy', '/bn/tools/wp-template-hierarchy'),
}

export default function WpTemplateHierarchyPageBn() {
  return <WpTemplateHierarchyDemo locale="bn" />
}
