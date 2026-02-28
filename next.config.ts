import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import withPWAInit from '@ducanh2912/next-pwa'

const nextConfig: NextConfig = {
  images: {
    domains: ['*', 'lh3.googleusercontent.com']
  }
}

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
})

const withNextIntl = createNextIntlPlugin()
export default withPWA(withNextIntl(nextConfig))
