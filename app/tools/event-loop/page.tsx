import type { Metadata } from 'next'
import { EventLoopDemo } from '@/components/tools/event-loop-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Call Stack + Event Loop Visualizer',
  description:
    'Real JavaScript, really run — watch the call stack, Web APIs, and microtask queue live as your own code (or a preset) actually executes, with a plain-English narration for every step and full animated step-by-step playback.',
  alternates: buildAlternates('/tools/event-loop', '/tools/event-loop', '/bn/tools/event-loop'),
}

export default function EventLoopVisualizerPage() {
  return <EventLoopDemo locale="en" />
}
