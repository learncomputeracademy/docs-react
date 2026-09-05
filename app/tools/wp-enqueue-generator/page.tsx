import type { Metadata } from 'next'
import { WpEnqueueGeneratorDemo } from '@/components/tools/wp-enqueue-generator-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'WordPress Enqueue Snippet Generator',
  description:
    'Add style and script rows, set handles, dependencies and versioning, and get back a real, correctly-wrapped wp_enqueue_style() / wp_enqueue_script() functions.php block.',
  alternates: buildAlternates('/tools/wp-enqueue-generator', '/tools/wp-enqueue-generator', '/bn/tools/wp-enqueue-generator'),
}

export default function WpEnqueueGeneratorPage() {
  return <WpEnqueueGeneratorDemo locale="en" />
}
