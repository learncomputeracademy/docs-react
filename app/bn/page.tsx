import type { Metadata } from 'next'
import { HomeContent } from '@/components/home-content'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  alternates: buildAlternates('/bn', '/', '/bn'),
}

export default async function HomeBn() {
  return <HomeContent locale="bn" />
}
