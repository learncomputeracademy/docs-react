import type { Metadata } from 'next'
import { WpHooksTimelineDemo } from '@/components/tools/wp-hooks-timeline-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'WordPress Hooks Timeline',
  description:
    'The order the common WordPress action hooks actually fire during a page load — muplugins_loaded through shutdown — with a description and a ready-to-copy add_action() snippet for each.',
  alternates: buildAlternates('/tools/wp-hooks-timeline', '/tools/wp-hooks-timeline', '/bn/tools/wp-hooks-timeline'),
}

export default function WpHooksTimelinePage() {
  return <WpHooksTimelineDemo locale="en" />
}
