'use client'

import { GoldPriceChart } from '@/components/GoldPriceChart'
import Header from '@/features/home/views/Header'
import TickerHeader from '@/features/home/views/TickerHeader'
import { Button } from '@/global/components/ui/button'
import { cn } from '@/global/lib/utils'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Banknote,
  Globe,
  Info,
  Mail,
  PiggyBank,
  Rss,
  Share2,
  TrendingUp
} from 'lucide-react'
import React from 'react'
import Image from 'next/image'
export default function Home() {
  const [chartTimeRange, setChartTimeRange] = React.useState<'30D' | '90D' | '1Y' | 'ALL'>('30D')

  return (
    <div className='bg-background-light dark:bg-background-dark flex min-h-screen flex-col font-sans text-slate-900 dark:text-slate-100'>
      {/* Ticker Header */}
      <TickerHeader />
      {/* Header */}
      <Header />

      <main className='mx-auto w-full max-w-[1440px] flex-grow px-6 py-8'>
        {/* Top Grid: Market Overview & Stats */}
        <div className='mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Market Overview (2 cols) */}
          <div className='dark:border-border-dark dark:bg-card-dark flex flex-col rounded-xl border border-slate-200 bg-white p-8 lg:col-span-2'>
            <div className='mb-8 flex flex-wrap items-start justify-between gap-4'>
              <div>
                <h1 className='mb-2 text-3xl font-extrabold text-slate-900 dark:text-white'>Market Overview</h1>
                <p className='flex items-center gap-2 text-slate-500 dark:text-slate-400'>
                  Global Spot Gold Price (XAU/USD) <span className='font-bold text-emerald-500'>+5.24% this month</span>
                </p>
              </div>
              <div className='dark:bg-background-dark flex rounded-lg bg-slate-100 p-1'>
                {['30D', '90D', '1Y', 'ALL'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setChartTimeRange(tab as any)}
                    className={cn(
                      'rounded-md px-4 py-1.5 text-xs font-bold transition-all',
                      chartTimeRange === tab
                        ? 'dark:bg-card-dark bg-white shadow-sm dark:text-white'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className='relative min-h-[300px] flex-grow'>
              <div className='absolute inset-0 px-2 pt-10'>
                <GoldPriceChart timeRange={chartTimeRange} className='h-full w-full' />
              </div>
              {/* Tooltip Override - Positioning manually to match design */}
              <div className='border-primary/30 absolute top-[15%] left-[78%] z-10 -translate-x-1/2 rounded-lg border bg-slate-900 p-3 text-xs text-white shadow-xl'>
                <p className='text-primary mb-1 font-bold'>May 24, 2024</p>
                <p className='opacity-80'>Price: $2,345.50</p>
                <p className='font-bold text-emerald-400'>+1.2% Today</p>
              </div>
            </div>
            <div className='dark:border-border-dark mt-6 flex justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-400'>
              <span>MAY 01</span>
              <span>MAY 08</span>
              <span>MAY 15</span>
              <span>MAY 22</span>
              <span>JUN 01</span>
            </div>
          </div>

          {/* Right Column Stats */}
          <div className='flex flex-col gap-10'>
            {/* SJC 9999  */}
            <div className='group bg-primary text-background-dark relative flex h-30 cursor-pointer items-center overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-105'>
              <div className='relative z-10'>
                <h3 className='text-4xl font-black'>SJC 9999</h3>
              </div>
              <PiggyBank className='absolute -right-2 -bottom-4 h-32 w-32 rotate-12 opacity-10 transition-transform duration-500 group-hover:rotate-0' />
            </div>

            {/* PNJ Logo */}
            <div className='group relative flex h-30 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:scale-105'>
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
            <div className='group relative flex h-30 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:scale-105'>
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
        </div>

        {/* Current Gold Rates */}
        <div className='mb-12'>
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>Current Gold Rates</h2>
            <button className='text-primary flex items-center gap-1 text-sm font-bold hover:underline'>
              View Full Table <ArrowRight className='h-4 w-4' />
            </button>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {/* SJC Card */}
            <div className='hover:border-primary/50 dark:border-border-dark dark:bg-card-dark cursor-pointer rounded-xl border border-slate-200 bg-white p-6 transition-all'>
              <div className='mb-6 flex items-start justify-between'>
                <div className='dark:bg-background-dark rounded bg-slate-100 px-3 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase'>
                  SJC BRAND
                </div>
                <span className='flex items-center gap-1 text-sm font-bold text-emerald-500'>
                  +0.8% <ArrowUp className='h-3 w-3' />
                </span>
              </div>
              <h3 className='mb-1 text-sm font-medium text-slate-500 dark:text-slate-400'>Gold SJC (999.9)</h3>
              <div className='space-y-4'>
                <div>
                  <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Buy</p>
                  <p className='text-2xl font-black text-slate-900 dark:text-white'>
                    82,500,000 <span className='text-xs font-normal opacity-50'>VND</span>
                  </p>
                </div>
                <div>
                  <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Sell</p>
                  <p className='text-2xl font-black text-slate-900 dark:text-white'>
                    84,500,000 <span className='text-xs font-normal opacity-50'>VND</span>
                  </p>
                </div>
              </div>
            </div>

            {/* PNJ Card */}
            <div className='hover:border-primary/50 dark:border-border-dark dark:bg-card-dark cursor-pointer rounded-xl border border-slate-200 bg-white p-6 transition-all'>
              <div className='mb-6 flex items-start justify-between'>
                <div className='dark:bg-background-dark rounded bg-slate-100 px-3 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase'>
                  PNJ JEWEL
                </div>
                <span className='flex items-center gap-1 text-sm font-bold text-rose-500'>
                  -0.2% <ArrowDown className='h-3 w-3' />
                </span>
              </div>
              <h3 className='mb-1 text-sm font-medium text-slate-500 dark:text-slate-400'>PNJ 24K Gold</h3>
              <div className='space-y-4'>
                <div>
                  <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Buy</p>
                  <p className='text-2xl font-black text-slate-900 dark:text-white'>
                    74,300,000 <span className='text-xs font-normal opacity-50'>VND</span>
                  </p>
                </div>
                <div>
                  <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Sell</p>
                  <p className='text-2xl font-black text-slate-900 dark:text-white'>
                    76,100,000 <span className='text-xs font-normal opacity-50'>VND</span>
                  </p>
                </div>
              </div>
            </div>

            {/* DOJI Card */}
            <div className='hover:border-primary/50 dark:border-border-dark dark:bg-card-dark cursor-pointer rounded-xl border border-slate-200 bg-white p-6 transition-all'>
              <div className='mb-6 flex items-start justify-between'>
                <div className='dark:bg-background-dark rounded bg-slate-100 px-3 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase'>
                  DOJI GROUP
                </div>
                <span className='flex items-center gap-1 text-sm font-bold text-emerald-500'>
                  +0.4% <ArrowUp className='h-3 w-3' />
                </span>
              </div>
              <h3 className='mb-1 text-sm font-medium text-slate-500 dark:text-slate-400'>DOJI 9999 Ring</h3>
              <div className='space-y-4'>
                <div>
                  <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Buy</p>
                  <p className='text-2xl font-black text-slate-900 dark:text-white'>
                    82,450,000 <span className='text-xs font-normal opacity-50'>VND</span>
                  </p>
                </div>
                <div>
                  <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Sell</p>
                  <p className='text-2xl font-black text-slate-900 dark:text-white'>
                    84,450,000 <span className='text-xs font-normal opacity-50'>VND</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Global Spot Benchmark Card */}
            <div className='border-primary bg-primary/5 relative cursor-pointer rounded-xl border-2 p-6'>
              <div className='bg-primary text-background-dark absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-black uppercase'>
                Benchmark
              </div>
              <div className='mb-6 flex items-start justify-between'>
                <div className='bg-primary/20 text-primary rounded px-3 py-1 text-[10px] font-black tracking-widest uppercase'>
                  GLOBAL SPOT
                </div>
                <span className='flex items-center gap-1 text-sm font-bold text-emerald-500'>
                  +1.2% <ArrowUp className='h-3 w-3' />
                </span>
              </div>
              <h3 className='mb-1 text-sm font-medium text-slate-500 dark:text-slate-400'>XAU/USD (Ounce)</h3>
              <div className='space-y-4'>
                <div>
                  <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Current Price</p>
                  <p className='text-2xl font-black text-slate-900 dark:text-white'>$2,345.50</p>
                </div>
                <div className='border-primary/20 border-t pt-2'>
                  <p className='text-[10px] font-bold text-slate-500 uppercase'>Day High: $2,360.20</p>
                  <p className='text-[10px] font-bold text-slate-500 uppercase'>Day Low: $2,315.40</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Insights & Converter */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {/* Market Insights */}
          <div className='dark:border-border-dark dark:bg-card-dark overflow-hidden rounded-xl border border-slate-200 bg-white'>
            <div className='dark:border-border-dark flex items-center justify-between border-b border-slate-200 p-6'>
              <h3 className='font-bold text-slate-900 dark:text-white'>Market Insights</h3>
              <Rss className='h-5 w-5 text-slate-400' />
            </div>
            <div className='dark:divide-border-dark divide-y divide-slate-100'>
              <div className='group dark:hover:bg-background-dark cursor-pointer p-6 transition-colors hover:bg-slate-50'>
                <span className='text-primary mb-1 block text-xs font-bold'>BREAKING</span>
                <h4 className='group-hover:text-primary font-bold text-slate-900 transition-colors dark:text-white'>
                  Fed signals potential rate cuts as inflation cools, sparking gold rally
                </h4>
                <p className='mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400'>
                  The Federal Reserve&apos;s latest meeting minutes suggest a shift in policy that could bolster
                  precious metals...
                </p>
                <div className='mt-4 flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase'>
                  <span>2 HOURS AGO</span>
                  <span>REUTERS</span>
                </div>
              </div>
              <div className='group dark:hover:bg-background-dark cursor-pointer p-6 transition-colors hover:bg-slate-50'>
                <h4 className='group-hover:text-primary font-bold text-slate-900 transition-colors dark:text-white'>
                  Physical gold demand in Vietnam reaches 5-year high amid domestic currency volatility
                </h4>
                <p className='mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400'>
                  Local investors are flocking to SJC bars as the VND continues to experience pressure against the
                  USD...
                </p>
                <div className='mt-4 flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase'>
                  <span>5 HOURS AGO</span>
                  <span>BLOOMBERG</span>
                </div>
              </div>
            </div>
            <button className='hover:text-primary w-full py-4 text-sm font-bold text-slate-500 transition-colors'>
              Read All News
            </button>
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
