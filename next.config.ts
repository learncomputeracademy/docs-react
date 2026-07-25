import type { NextConfig } from 'next'
import Icons from 'unplugin-icons/webpack'

const nextConfig: NextConfig = {
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
