import { execSync } from 'node:child_process'

// Vercel sets this for every deployment — the real source in production.
// Local dev has no such env var, so fall back to asking git directly;
// wrapped in try/catch since a shallow checkout or missing git binary
// shouldn't ever break the admin panel over a version label. Computed
// once per server process (module-level), not per-request.
function computeVersion(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'dev'
  }
}

export const APP_VERSION = computeVersion()
