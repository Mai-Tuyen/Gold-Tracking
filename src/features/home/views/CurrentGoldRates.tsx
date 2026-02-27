import { useGoldPricesQuery } from '@/features/home/hooks/query'
import { Skeleton } from '@/global/components/ui/skeleton'
import { cn, formatNumberToVND } from '@/global/lib/utils'
import { ArrowDown, ArrowUp } from 'lucide-react'

export default function CurrentGoldRates() {
  const { data: goldPrices, isPending } = useGoldPricesQuery()

  const getChangePercent = (sell?: number, changeSell?: number) => {
    if (!sell) return 0
    return ((changeSell ?? 0) / sell) * 100
  }

  const renderChange = (sell?: number, changeSell?: number) => {
    const percent = getChangePercent(sell, changeSell)
    const isUp = (changeSell ?? 0) >= 0
    const displayPercent = Math.abs(percent).toFixed(2)
    return (
      <span className={cn('flex items-center gap-1 text-sm font-bold', isUp ? 'text-emerald-500' : 'text-rose-500')}>
        {isUp ? '+' : '-'}
        {displayPercent}% {isUp ? <ArrowUp className='h-3 w-3' /> : <ArrowDown className='h-3 w-3' />}
      </span>
    )
  }

  if (isPending && !goldPrices) {
    return (
      <div className='mb-12'>
        <div className='mb-8 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>Giá hiện tại</h2>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className='dark:border-border-dark dark:bg-card-dark rounded-xl border border-slate-200 bg-white p-6'
            >
              <div className='mb-6 flex items-start justify-between'>
                <Skeleton className='h-6 w-20' />
                <Skeleton className='h-5 w-14' />
              </div>
              <Skeleton className='mb-4 h-5 w-28' />
              <div className='space-y-4'>
                <div>
                  <Skeleton className='mb-2 h-3 w-10' />
                  <Skeleton className='h-8 w-36' />
                </div>
                <div>
                  <Skeleton className='mb-2 h-3 w-10' />
                  <Skeleton className='h-8 w-36' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='mb-12'>
      <div className='mb-8 flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>Giá hiện tại</h2>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {/* SJC Card */}
        <div className='hover:border-primary/50 dark:border-border-dark dark:bg-card-dark rounded-xl border border-slate-200 bg-white p-6 transition-all'>
          <div className='mb-6 flex items-start justify-between'>
            <div className='dark:bg-background-dark rounded bg-slate-100 px-3 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase'>
              SJC
            </div>
            {renderChange(goldPrices?.prices?.SJL1L10?.sell, goldPrices?.prices?.SJL1L10?.change_sell)}
          </div>
          <h3 className='mb-1 text-sm font-medium text-slate-500 dark:text-slate-400'>SJC 9999</h3>
          <div className='space-y-4'>
            <div>
              <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Mua</p>
              <p className='text-2xl font-black text-slate-900 dark:text-white'>
                {formatNumberToVND(goldPrices?.prices?.SJL1L10?.buy ?? 0)}{' '}
              </p>
            </div>
            <div>
              <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Bán</p>
              <p className='text-2xl font-black text-slate-900 dark:text-white'>
                {formatNumberToVND(goldPrices?.prices?.SJL1L10?.sell ?? 0)}{' '}
              </p>
            </div>
          </div>
        </div>

        {/* PNJ Card */}
        <div className='hover:border-primary/50 dark:border-border-dark dark:bg-card-dark rounded-xl border border-slate-200 bg-white p-6 transition-all'>
          <div className='mb-6 flex items-start justify-between'>
            <div className='dark:bg-background-dark rounded bg-slate-100 px-3 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase'>
              PNJ JEWEL
            </div>
            {renderChange(goldPrices?.prices?.PQHNVM?.sell, goldPrices?.prices?.PQHNVM?.change_sell)}
          </div>
          <h3 className='mb-1 text-sm font-medium text-slate-500 dark:text-slate-400'>PNJ 24K Gold</h3>
          <div className='space-y-4'>
            <div>
              <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Mua</p>
              <p className='text-2xl font-black text-slate-900 dark:text-white'>
                {formatNumberToVND(goldPrices?.prices?.PQHNVM?.buy ?? 0)}{' '}
              </p>
            </div>
            <div>
              <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Bán</p>
              <p className='text-2xl font-black text-slate-900 dark:text-white'>
                {formatNumberToVND(goldPrices?.prices?.PQHNVM?.sell ?? 0)}{' '}
              </p>
            </div>
          </div>
        </div>

        {/* DOJI Card */}
        <div className='hover:border-primary/50 dark:border-border-dark dark:bg-card-dark rounded-xl border border-slate-200 bg-white p-6 transition-all'>
          <div className='mb-6 flex items-start justify-between'>
            <div className='dark:bg-background-dark rounded bg-slate-100 px-3 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase'>
              DOJI GROUP
            </div>
            {renderChange(goldPrices?.prices?.DOHNL?.sell, goldPrices?.prices?.DOHNL?.change_sell)}
          </div>
          <h3 className='mb-1 text-sm font-medium text-slate-500 dark:text-slate-400'>DOJI 9999 Ring</h3>
          <div className='space-y-4'>
            <div>
              <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Mua</p>
              <p className='text-2xl font-black text-slate-900 dark:text-white'>
                {formatNumberToVND(goldPrices?.prices?.DOHNL?.buy ?? 0)}{' '}
              </p>
            </div>
            <div>
              <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Bán</p>
              <p className='text-2xl font-black text-slate-900 dark:text-white'>
                {formatNumberToVND(goldPrices?.prices?.DOHNL?.sell ?? 0)}{' '}
              </p>
            </div>
          </div>
        </div>

        <div className='border-primary bg-primary/5 relative rounded-xl border-2 p-6'>
          <div className='bg-primary text-background-dark absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-black uppercase'>
            World
          </div>
          <div className='mb-6 flex items-start justify-between'>
            <div className='bg-primary/20 text-primary mb-4 rounded px-3 py-1 text-[10px] font-black tracking-widest uppercase'>
              Vàng Thế giới
            </div>
            {renderChange(goldPrices?.prices?.XAUUSD?.buy, goldPrices?.prices?.XAUUSD?.change_buy)}
          </div>
          <h3 className='mb-1 text-sm font-medium text-slate-500 dark:text-slate-400'>XAU/USD</h3>
          <div className='space-y-4'>
            <div>
              <p className='text-2xl font-black text-slate-900 dark:text-white'>
                ${goldPrices?.prices?.XAUUSD?.buy ?? 0}
              </p>
            </div>
            <div className='border-primary/20 border-t pt-2'>
              <p className='text-[10px] font-bold text-slate-500 uppercase'>
                {goldPrices?.prices?.XAUUSD?.name ?? '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
