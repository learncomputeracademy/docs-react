import type { NextConfig } from 'next'
import Icons from 'unplugin-icons/webpack'

const nextConfig: NextConfig = {
  // CLAUDE.md §3.2: every moved path gets a 301. The old Jekyll site served
  // this tool at /box-model; docs/URLS.md R4 groups tools under /tools/.
  async redirects() {
    return [
      { source: '/box-model', destination: '/tools/box-model', permanent: true },
      { source: '/box-shadow-generator', destination: '/tools/box-shadow-generator', permanent: true },
      // Old link had a trailing slash (/gradient/); trailingSlash:false
      // (docs/URLS.md R5) makes Next redirect that to /gradient first, so
      // this one entry catches it.
      { source: '/gradient', destination: '/tools/gradient', permanent: true },
    ]
  },
  images: {
    // Custom loader bypasses Next's own image optimizer/proxy entirely —
    // Cloudinary already does format/quality negotiation. remotePatterns
    // isn't needed here; that's only for the built-in optimizer's fetch allowlist.
    loader: 'custom',
    loaderFile: './lib/cloudinary.ts',
  },
  webpack(config) {
    config.plugins.push(
      Icons({ compiler: 'jsx', jsx: 'react' })
    )
    return config
  },
}

export default nextConfig
