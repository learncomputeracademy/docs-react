import type { Metadata } from 'next'
import { ScopeClosureDemo } from '@/components/tools/scope-closure-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Scope ও Closure ভিজুয়ালাইজার',
  description:
    'আসল কোড চলার সময় scope chain সত্যিই তৈরি হতে আর ভেঙে যেতে দেখুন — প্রতিটা variable-এর আসল value, temporal dead zone-এর আসল ReferenceError, আর একটা closure বাইরের function return করে যাওয়ার পরও ঠিক কী বাঁচিয়ে রাখে।',
  alternates: buildAlternates('/bn/tools/scope-closure', '/tools/scope-closure', '/bn/tools/scope-closure'),
}

export default function ScopeClosureVisualizerPageBn() {
  return <ScopeClosureDemo locale="bn" />
}
