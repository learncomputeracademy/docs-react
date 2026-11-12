import type { Metadata } from 'next'
import { ProtocolsDemo } from '@/components/tools/protocols-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Network Protocol Visualizer',
  description:
    'Watch what really happens when you open a web page, one packet at a time — DHCP, DNS, TCP, HTTP, HTTPS and UDP, with an animated network diagram and every byte explained.',
  alternates: buildAlternates('/tools/protocols', '/tools/protocols', '/bn/tools/protocols'),
}

export default function ProtocolsPage() {
  return <ProtocolsDemo locale="en" />
}
