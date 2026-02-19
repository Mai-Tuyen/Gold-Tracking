import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter, Manrope } from 'next/font/google'
import '@/global/globals.css'

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

export const metadata: Metadata = {
  title: 'GoldTrack | Dashboard Giá Vàng Vietnam',
  description: 'Vàng lên là vui'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='dark'>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${manrope.variable} antialiased`}>
        <link
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
          rel='stylesheet'
        />
        {children}
      </body>
    </html>
  )
}
