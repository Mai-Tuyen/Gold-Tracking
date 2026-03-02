import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { withSerwist } from '@serwist/turbopack'

const nextConfig: NextConfig = {
  images: {
    domains: ['*', 'lh3.googleusercontent.com']
  }
}

const withNextIntl = createNextIntlPlugin()
export default withSerwist(withNextIntl(nextConfig))
