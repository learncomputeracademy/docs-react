import type { Metadata } from 'next'
import { HomeContent } from '@/components/home-content'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  alternates: buildAlternates('/', '/', '/bn'),
}

export default async function Home() {
  return <HomeContent locale="en" />
}
