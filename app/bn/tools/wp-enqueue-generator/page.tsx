import type { Metadata } from 'next'
import { WpEnqueueGeneratorDemo } from '@/components/tools/wp-enqueue-generator-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'WordPress Enqueue Snippet জেনারেটর',
  description:
    'Style আর script row যোগ করুন, handle, dependency আর versioning সেট করুন, আর আসল, সঠিকভাবে wrap করা wp_enqueue_style() / wp_enqueue_script() functions.php ব্লক ফেরত পান।',
  alternates: buildAlternates('/bn/tools/wp-enqueue-generator', '/tools/wp-enqueue-generator', '/bn/tools/wp-enqueue-generator'),
}

export default function WpEnqueueGeneratorPageBn() {
  return <WpEnqueueGeneratorDemo locale="bn" />
}
