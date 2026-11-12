import type { Metadata } from 'next'
import { ProtocolsDemo } from '@/components/tools/protocols-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Network Protocol ভিজুয়ালাইজার',
  description:
    'একটা web page খুললে আসলে কী ঘটে দেখুন, একটা একটা packet ধরে — DHCP, DNS, TCP, HTTP, HTTPS আর UDP, animated নেটওয়ার্ক diagram আর প্রতিটা byte-এর ব্যাখ্যাসহ।',
  alternates: buildAlternates('/bn/tools/protocols', '/tools/protocols', '/bn/tools/protocols'),
}

export default function ProtocolsPageBn() {
  return <ProtocolsDemo locale="bn" />
}
