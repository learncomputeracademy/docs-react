import type { Metadata } from 'next'
import { PlaceholderDemo } from '@/components/tools/placeholder-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Placeholder Image জেনারেটর',
  description:
    'Lorem Picsum থেকে আসল photo placeholder, বা placehold.co থেকে solid-colour টেক্সট বক্স — aspect-ratio lock, common-size preset, photographer credit-সহ একটা আসল photo browser, grayscale/blur, আর একটা responsive srcset জেনারেটরসহ।',
  alternates: buildAlternates('/bn/tools/lorem-image', '/tools/lorem-image', '/bn/tools/lorem-image'),
}

export default function PlaceholderImageGeneratorPageBn() {
  return <PlaceholderDemo locale="bn" />
}
