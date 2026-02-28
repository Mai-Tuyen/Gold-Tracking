'use client'
import { useHomeStore } from '@/features/home/store'
import ChartPrice from '@/features/home/views/ChartPrice'
import CurrentGoldRates from '@/features/home/views/CurrentGoldRates'
import Header from '@/features/home/views/Header'
import TickerHeader from '@/features/home/views/TickerHeader'
import { useGoldNewsQuery } from '@/features/home/hooks/query'
import { Skeleton } from '@/global/components/ui/skeleton'
import { Button } from '@/global/components/ui/button'
import { cn } from '@/global/lib/utils'
import { ArrowUpDown, Banknote, Globe, Mail, PiggyBank, Rss, Share2 } from 'lucide-react'
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
                quality={100}
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
                quality={100}
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
          <div className='dark:border-border-dark dark:bg-card-dark rounded-xl border border-slate-200 bg-white p-8'>
            <h3 className='mb-6 font-bold text-slate-900 dark:text-white'>Price Converter</h3>
            <div className='space-y-6'>
              <div>
                <label className='mb-2 block text-xs font-bold text-slate-400 uppercase'>Amount (Tael/Lượng)</label>
                <div className='relative'>
                  <input
                    className='focus:ring-primary dark:bg-background-dark w-full rounded-lg border-none bg-slate-100 p-4 text-xl font-bold text-slate-900 dark:text-white'
                    type='number'
                    defaultValue='1.00'
                  />
                  <span className='absolute top-1/2 right-4 -translate-y-1/2 font-bold text-slate-400'>GOLD</span>
                </div>
              </div>
              <div className='flex justify-center'>
                <div className='bg-primary rounded-full p-2'>
                  <ArrowUpDown className='text-background-dark h-5 w-5' />
                </div>
              </div>
              <div>
                <label className='mb-2 block text-xs font-bold text-slate-400 uppercase'>Estimated Value (VND)</label>
                <div className='relative'>
                  <input
                    className='text-primary dark:bg-background-dark w-full rounded-lg border-none bg-slate-100 p-4 text-xl font-bold'
                    readOnly
                    type='text'
                    defaultValue='82,500,000'
                  />
                  <span className='absolute top-1/2 right-4 -translate-y-1/2 font-bold text-slate-400'>VND</span>
                </div>
              </div>
              <div className='space-y-3 pt-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-slate-500'>Processing Fee (0.5%)</span>
                  <span className='font-medium text-slate-900 dark:text-white'>412,500 VND</span>
                </div>
                <div className='dark:border-border-dark flex justify-between border-t border-slate-100 pt-3 text-lg font-bold'>
                  <span className='text-slate-900 dark:text-white'>Total Estimated</span>
                  <span className='text-primary'>82,912,500 VND</span>
                </div>
              </div>
              <Button className='dark:bg-primary dark:text-background-dark h-auto w-full rounded-xl bg-slate-900 py-4 font-bold text-white transition-opacity hover:opacity-90'>
                Download Quote
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='dark:border-border-dark dark:bg-card-dark mt-20 border-t border-slate-200 bg-slate-100'>
        <div className='mx-auto max-w-[1440px] px-6 py-16'>
          <div className='grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4'>
            <div className='space-y-6'>
              <div className='flex items-center gap-2'>
                <div className='bg-primary rounded-lg p-1'>
                  <Banknote className='text-background-dark h-3.5 w-3.5' />
                </div>
                <span className='text-xl font-black tracking-tighter text-slate-900 dark:text-white'>
                  GOLD<span className='text-primary'>TRACK</span>
                </span>
              </div>
              <p className='text-sm leading-relaxed text-slate-500 dark:text-slate-400'>
                The ultimate financial companion for tracking precious metal markets in Vietnam and globally. Real-time
                data, professional insights.
              </p>
              <div className='flex gap-4'>
                <a
                  href='#'
                  className='hover:bg-primary hover:text-background-dark dark:bg-background-dark flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors dark:text-slate-400'
                >
                  <Globe className='h-4 w-4' />
                </a>
                <a
                  href='#'
                  className='hover:bg-primary hover:text-background-dark dark:bg-background-dark flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors dark:text-slate-400'
                >
                  <Share2 className='h-4 w-4' />
                </a>
                <a
                  href='#'
                  className='hover:bg-primary hover:text-background-dark dark:bg-background-dark flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors dark:text-slate-400'
                >
                  <Mail className='h-4 w-4' />
                </a>
              </div>
            </div>
            <div>
              <h4 className='mb-6 text-xs font-bold tracking-widest text-slate-400 uppercase'>Market Data</h4>
              <ul className='space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400'>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    SJC Bar Gold
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    PNJ Jewelry
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    DOJI Group Rates
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    Global Spot Price
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='mb-6 text-xs font-bold tracking-widest text-slate-400 uppercase'>Resources</h4>
              <ul className='space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400'>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    Price Calculator
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    Market Analysis
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    Historical Archives
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='mb-6 text-xs font-bold tracking-widest text-slate-400 uppercase'>Legal</h4>
              <ul className='space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400'>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    Data Methodology
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary transition-colors'>
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='dark:border-border-dark mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 md:flex-row'>
            <p className='text-xs text-slate-500 dark:text-slate-500'>© 2026 MaiTuyen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
