import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import withPWAInit from '@ducanh2912/next-pwa'

const nextConfig: NextConfig = {
  images: {
    domains: ['*', 'lh3.googleusercontent.com']
  }
}

const withPWA = withPWAInit({
  dest: 'public'
})

const withNextIntl = createNextIntlPlugin()

const isProduction = process.env.NODE_ENV === 'production'

export default isProduction ? withPWA(withNextIntl(nextConfig)) : withNextIntl(nextConfig)
