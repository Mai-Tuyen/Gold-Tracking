import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Inter, Manrope } from 'next/font/google'
import '@/global/globals.css'
import TanstackqueryProvider from '@/global/lib/providers/TanstackqueryProvider'
import ErrorBoundaryProvider from '@/global/lib/providers/ErrorBoundary'
import SerwistProvider from '@/global/lib/providers/SerwistProvider'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
})

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin']
})

const APP_NAME = 'GoldTrack | Dashboard Giá Vàng Vietnam'
const APP_DEFAULT_TITLE = 'GoldTrack | Dashboard Giá Vàng Vietnam'
const APP_TITLE_TEMPLATE = '%s - GoldTrack'
const APP_DESCRIPTION = 'Vàng lên là vui'

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  }
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF'
}

export default function RootLayout({
  children,
  modalLogin
}: Readonly<{
  children: React.ReactNode
  modalLogin: React.ReactNode
}>) {
  return (
    <html lang='en' className='dark' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${manrope.variable} antialiased`}>
        <link
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
          rel='stylesheet'
        />
        <SerwistProvider>
          <ErrorBoundaryProvider>
            <TanstackqueryProvider>{children}</TanstackqueryProvider>
          </ErrorBoundaryProvider>
          {modalLogin}
        </SerwistProvider>
      </body>
    </html>
  )
}
