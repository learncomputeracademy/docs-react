#!/usr/bin/env node
// scripts/check-resource-links.mjs
// Run daily by .github/workflows/check-resource-links.yml. Checks a slice
// of the `resources` table's links and writes link_status/link_checked_at/
// link_fail_count back to Supabase — never calls revalidateTag (see
// CLAUDE.md's active ISR-quota block; /resources stays on whatever it last
// revalidated to until that's lifted and this is wired up).
//
// Doesn't check every link every day: healthy links rotate through 30
// daily buckets (full catalog re-checked monthly, cheap regardless of
// catalog size), while unchecked/already-flagged links are checked every
// run so new or broken links get caught/cleared fast. See docs/ADMIN.md
// "Resources link-health check".
//
// A link only flips out of 'ok' after 2 consecutive failures — sites blip.
// "redirect_offsite" means the final URL landed on a different domain than
// the one saved (likely link rot masked by a parked-domain redirect); a
// same-domain redirect (http->https, trailing slash, www) is not flagged.

import { createClient } from '@supabase/supabase-js'

const BUCKET_COUNT = 30
const CONCURRENCY = 6
const TIMEOUT_MS = 8000
const FAIL_THRESHOLD = 2
// Real browser UA — some sites 403 bare bot/fetch UAs on links that are
// fine for actual visitors, which would otherwise read as false dead links.
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function bucketOf(id) {
  let sum = 0
  for (const ch of id) sum += ch.charCodeAt(0)
  return sum % BUCKET_COUNT
}

async function checkOne(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal, headers: { 'User-Agent': USER_AGENT } })
    // Some servers reject HEAD (405/501) even though the page is fine — retry with GET.
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { 'User-Agent': USER_AGENT } })
    }
    if (!res.ok) return { ok: false, reason: `status ${res.status}` }
    const finalHost = hostOf(res.url)
    const originalHost = hostOf(url)
    if (finalHost && originalHost && finalHost !== originalHost) {
      return { ok: false, status: 'redirect_offsite', reason: `redirected ${originalHost} -> ${finalHost}` }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, reason: e.name === 'AbortError' ? 'timeout' : e.message }
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
  const { data: resources, error } = await supabase
    .from('resources')
    .select('id, url, link_status, link_fail_count')
  if (error) throw error

  const today = new Date().getUTCDate() % BUCKET_COUNT
  const due = resources.filter((r) => r.link_status !== 'ok' || bucketOf(r.id) === today)
  console.log(`${due.length} of ${resources.length} resources due for a check (bucket ${today}/${BUCKET_COUNT}).`)
  if (due.length === 0) return

  const results = await runPool(due, async (r) => ({ id: r.id, url: r.url, prevFailCount: r.link_fail_count, ...(await checkOne(r.url)) }), CONCURRENCY)

  const now = new Date().toISOString()
  let okCount = 0, flaggedCount = 0
  for (const r of results) {
    if (r.ok) {
      okCount++
      const { error: upErr } = await supabase
        .from('resources')
        .update({ link_status: 'ok', link_checked_at: now, link_fail_count: 0 })
        .eq('id', r.id)
      if (upErr) console.error(`Update failed for ${r.url}:`, upErr.message)
      continue
    }
    const failCount = r.prevFailCount + 1
    // Only flip the visible status after FAIL_THRESHOLD consecutive misses —
    // otherwise keep the previous status (usually 'unchecked' or 'ok') and
    // just bump the counter, so one flaky check doesn't hide a link.
    const nextStatus = failCount >= FAIL_THRESHOLD ? (r.status ?? 'dead') : undefined
    console.log(`FAIL (${failCount}/${FAIL_THRESHOLD}) ${r.url} — ${r.reason}`)
    if (nextStatus) flaggedCount++
    const patch = { link_checked_at: now, link_fail_count: failCount }
    if (nextStatus) patch.link_status = nextStatus
    const { error: upErr } = await supabase.from('resources').update(patch).eq('id', r.id)
    if (upErr) console.error(`Update failed for ${r.url}:`, upErr.message)
  }

  console.log(`Done. ${okCount} ok, ${flaggedCount} newly flagged, ${due.length - okCount - flaggedCount} failed but under threshold.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
