import type { Metadata } from 'next'
import { WpTemplateHierarchyDemo } from '@/components/tools/wp-template-hierarchy-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'WordPress Template Hierarchy Visualizer',
  description:
    'Pick a request type — single post, category archive, 404, and more — and check or uncheck files to see exactly which template WordPress would actually load, in the real documented search order.',
  alternates: buildAlternates('/tools/wp-template-hierarchy', '/tools/wp-template-hierarchy', '/bn/tools/wp-template-hierarchy'),
}

export default function WpTemplateHierarchyPage() {
  return <WpTemplateHierarchyDemo locale="en" />
}
