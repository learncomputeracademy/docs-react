import { SITE_URL } from '@/lib/seo'

// IndexNow: one ping, fans out to every participating engine (Bing, Yandex,
// Seznam, Naver, …). Google does NOT participate — this has no effect on
// Google indexing, only the others. Verification is the plain-text file at
// public/<INDEXNOW_KEY>.txt (see .env.local), not a signed request.
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

// Fire-and-forget by design: a ping failing here must never break the
// revalidate webhook or a content script that calls this as a side effect.
// Logs and swallows instead of throwing.
export async function submitToIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY
  if (!key || urls.length === 0) return

  const host = new URL(SITE_URL).host

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls,
      }),
    })
    // IndexNow returns 200 (or 202) on success; anything else is worth a
    // log line, but still not worth failing the caller over.
    if (!res.ok) {
      console.error(`IndexNow submission returned ${res.status} for ${urls.length} URL(s)`)
    }
  } catch (err) {
    console.error('IndexNow submission failed:', err)
  }
}
