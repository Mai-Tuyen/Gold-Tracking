import Link from 'next/link'
import { WifiOff, RefreshCw, BellRing } from 'lucide-react'
import { Button } from '@/global/components/ui/button'

export const metadata = {
  title: 'Offline | GoldTrack',
  description: 'Mất kết nối internet.'
}

export default function OfflinePage() {
  return (
    <main className='bg-background-light dark:bg-background-dark flex min-h-screen items-center justify-center px-6 py-10'>
      <section className='border-border bg-card/95 flex w-full max-w-xl flex-col items-center justify-center rounded-2xl border p-8 shadow-2xl backdrop-blur'>
        <div className='bg-gold/15 mb-5 inline-flex rounded-full p-3'>
          <WifiOff className='text-gold h-7 w-7' />
        </div>

        <h1 className='font-manrope text-foreground mb-2 text-2xl font-bold'>Bạn đang offline</h1>

        <div className='flex flex-col gap-3 sm:flex-row'>
          <Button asChild className='bg-gold hover:bg-gold/90 text-black sm:flex-1'>
            <Link href='/'>
              <RefreshCw className='h-4 w-4' />
              Thử lại
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
