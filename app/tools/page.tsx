import type { Metadata } from 'next'
import { ToolsIndex } from '@/components/tools-index'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Tools',
  description:
    'Interactive tools for CSS you can’t learn from a screenshot — box model, box shadow, gradients, flexbox, scrollbars, specificity and colour contrast. Each links to the lesson it teaches and works fully in Bengali.',
  alternates: buildAlternates('/tools', '/tools', '/bn/tools'),
}

export default function ToolsIndexPage() {
  return <ToolsIndex locale="en" />
}
