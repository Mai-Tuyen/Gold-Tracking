'use client'
import { useGoldNewsQuery } from '@/features/home/hooks/query'
import { useHomeStore } from '@/features/home/store'
import ChartPrice from '@/features/home/views/ChartPrice'
import CurrentGoldRates from '@/features/home/views/CurrentGoldRates'
import PriceConverter from '@/features/home/views/PriceConverter'
import TickerHeader from '@/features/home/views/TickerHeader'
import Footer from '@/global/components/layout/Footer'
import Header from '@/global/components/layout/Header'
import { Skeleton } from '@/global/components/ui/skeleton'
import { cn } from '@/global/lib/utils'
import { PiggyBank, Rss } from 'lucide-react'
import Image from 'next/image'
export default function Home() {
  const { typeChecked, setTypeChecked } = useHomeStore()
  const { data: goldNews, isPending: isLoadingGoldNews } = useGoldNewsQuery()
  return (
    <div className='bg-background-light dark:bg-background-dark flex min-h-screen flex-col font-sans text-slate-900 dark:text-slate-100'>
      {/* Ticker Header */}
      <TickerHeader />
      {/* Header */}
      <Header />

      <main className='mx-auto w-full max-w-[1440px] grow px-6 py-8'>
        {/* Top Grid: Market Overview & Stats */}
        <div className='mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Right Column Stats */}
          <div className='flex flex-col justify-between gap-10'>
            {/* SJC 9999  */}
            <div
              onClick={() => setTypeChecked('SJL1L10')}
              className={cn(
                typeChecked === 'SJL1L10' ? 'shadow-primary/50 scale-105 shadow-lg' : '',
                'group bg-primary text-background-dark relative flex h-30 cursor-pointer items-center overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-105'
              )}
            >
              <div className='relative z-10'>
                <h3 className='text-4xl font-black'>SJC 9999</h3>
              </div>
              <PiggyBank className='absolute -right-2 -bottom-4 h-32 w-32 rotate-12 opacity-10 transition-transform duration-500 group-hover:rotate-0' />
            </div>

            {/* PNJ Logo */}
            <div
              onClick={() => setTypeChecked('PQHNVM')}
              className={cn(
                typeChecked === 'PQHNVM' ? 'shadow-primary/50 scale-105 shadow-lg' : '',
                'group relative flex h-30 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:scale-105'
              )}
            >
              <Image
                src='/images/pnj-logo.jpg'
                alt='PNJ Logo'
                width={120}
                height={120}
                className='h-full w-full object-cover'
              />
            </div>

            {/* DOJI Logo */}
            <div
              onClick={() => setTypeChecked('DOHNL')}
              className={cn(
                typeChecked === 'DOHNL' ? 'shadow-primary/50 scale-105 shadow-lg' : '',
                'group relative flex h-30 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:scale-105'
              )}
            >
              <Image
                src='/images/doji-logo.png'
                alt='DOJI Logo'
                width={120}
                height={120}
                className='h-full w-full object-cover'
              />
            </div>
          </div>
          <ChartPrice />
        </div>

        {/* Current Gold Rates */}
        <CurrentGoldRates />

        {/* Bottom Grid: Insights & Converter */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {/* Market Insights */}
          <div className='dark:border-border-dark dark:bg-card-dark overflow-hidden rounded-xl border border-slate-200 bg-white'>
            <div className='dark:border-border-dark flex items-center justify-between border-b border-slate-200 p-6'>
              <h3 className='font-bold text-slate-900 dark:text-white'>Tin nổi bật</h3>
              <Rss className='h-5 w-5 text-slate-400' />
            </div>
            <div className='dark:divide-border-dark divide-y divide-slate-100'>
              {isLoadingGoldNews ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className='p-6'>
                    <Skeleton className='mb-2 h-3 w-16' />
                    <Skeleton className='mb-2 h-5 w-full' />
                    <Skeleton className='h-5 w-4/5' />
                    <div className='mt-4 flex items-center gap-4'>
                      <Skeleton className='h-3 w-24' />
                      <Skeleton className='h-3 w-28' />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {goldNews?.length ? (
                    goldNews.map((article, index) => (
                      <a
                        key={article.link}
                        href={article.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group dark:hover:bg-background-dark block cursor-pointer p-6 transition-colors hover:bg-slate-50'
                      >
                        {index === 0 && <span className='text-primary mb-1 block text-xs font-bold'>BREAKING</span>}
                        <h4 className='group-hover:text-primary font-bold text-slate-900 transition-colors dark:text-white'>
                          {article.title}
                        </h4>
                        <div className='mt-4 flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase'>
                          <span>{new Date(article.publishedAt).toLocaleString('vi-VN')}</span>
                          <span>{article.source}</span>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className='p-6 text-sm text-slate-500'>Chưa có tin mới, vui lòng quay lại sau ít phút.</div>
                  )}
                </>
              )}
            </div>
            {goldNews?.[0]?.link && (
              <a
                href={goldNews[0].link}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-primary block w-full py-4 text-center text-sm font-bold text-slate-500 transition-colors'
              >
                Đọc tin mới nhất
              </a>
            )}
          </div>

          {/* Price Converter */}
          <PriceConverter />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
