#!/usr/bin/env node
// scripts/audit-resource-links.mjs
// One-off manual audit, run ahead of migrations/012 (which isn't applied
// yet — no link_status column to write to). Checks every current
// `resources` row, DELETES confirmed-dead or off-domain-redirecting ones
// (backing each deleted row up to a report file first — `resources` isn't
// covered by the daily backup script, so this is the only copy), and
// leaves ambiguous ones (403/429 — likely bot-blocked, not actually dead)
// untouched with a note to check by hand.
//
// Usage: node scripts/audit-resource-links.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const DRY_RUN = process.argv.includes('--dry-run')
const CONCURRENCY = 6
const TIMEOUT_MS = 10000
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

async function loadEnv() {
  const text = await fs.readFile(new URL('../.env.local', import.meta.url), 'utf8')
  const env = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

async function checkOne(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    let res
    try {
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { 'User-Agent': USER_AGENT } })
    } catch (e) {
      return { verdict: 'dead', reason: e.name === 'AbortError' ? 'timeout' : e.message }
    }
    if (res.status === 403 || res.status === 429) return { verdict: 'ambiguous', reason: `status ${res.status} (likely bot-blocked)` }
    if (!res.ok) return { verdict: 'dead', reason: `status ${res.status}` }
    const finalHost = hostOf(res.url)
    const originalHost = hostOf(url)
    if (finalHost && originalHost && finalHost !== originalHost) {
      return { verdict: 'offsite', reason: `redirected ${originalHost} -> ${finalHost} (final: ${res.url})` }
    }
    return { verdict: 'ok' }
  } finally {
    clearTimeout(timer)
  }
}

async function runPool(items, worker, concurrency) {
  const results = new Array(items.length)
  let next = 0
  async function lane() {
    while (next < items.length) {
      const i = next++
      results[i] = await worker(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, lane))
  return results
}

async function main() {
  const env = await loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

  const { data: resources, error } = await supabase.from('resources').select('*').order('group_name').order('sort_order')
  if (error) throw error
  console.log(`Checking ${resources.length} resources...`)

  const results = await runPool(resources, async (r) => ({ r, ...(await checkOne(r.url)) }), CONCURRENCY)

  const toDelete = results.filter((x) => x.verdict === 'dead' || x.verdict === 'offsite')
  const ambiguous = results.filter((x) => x.verdict === 'ambiguous')
  const ok = results.filter((x) => x.verdict === 'ok')

  console.log(`\nOK: ${ok.length}`)
  console.log(`Ambiguous (kept, review by hand): ${ambiguous.length}`)
  for (const x of ambiguous) console.log(`  ? ${x.r.group_name} / ${x.r.name} — ${x.r.url} — ${x.reason}`)
  console.log(`To delete (dead/redirected off-domain): ${toDelete.length}`)
  for (const x of toDelete) console.log(`  x ${x.r.group_name} / ${x.r.name} — ${x.r.url} — ${x.reason}`)

  await fs.mkdir(new URL('./reports/', import.meta.url), { recursive: true })
  await fs.writeFile(
    new URL('./reports/audit-resource-links.json', import.meta.url),
    JSON.stringify({ checked_at: new Date().toISOString(), ok: ok.length, ambiguous, deleted: toDelete }, null, 2)
  )
  console.log('\nFull report + deleted-row backup written to scripts/reports/audit-resource-links.json')

  if (DRY_RUN) {
    console.log('\n--dry-run: nothing deleted.')
    return
  }
  for (const x of toDelete) {
    const { error: delError } = await supabase.from('resources').delete().eq('id', x.r.id)
    if (delError) console.error(`Delete failed for ${x.r.name}:`, delError.message)
  }
  console.log(`\nDeleted ${toDelete.length} rows.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
