import type { Metadata } from 'next'
import { WpHooksTimelineDemo } from '@/components/tools/wp-hooks-timeline-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'WordPress Hooks টাইমলাইন',
  description:
    'একটা page load-এ common WordPress action hook গুলো আসলে যে order-এ fire করে — muplugins_loaded থেকে shutdown পর্যন্ত — প্রতিটার জন্য একটা বর্ণনা আর একটা ready-to-copy add_action() snippet সহ।',
  alternates: buildAlternates('/bn/tools/wp-hooks-timeline', '/tools/wp-hooks-timeline', '/bn/tools/wp-hooks-timeline'),
}

export default function WpHooksTimelinePageBn() {
  return <WpHooksTimelineDemo locale="bn" />
}
