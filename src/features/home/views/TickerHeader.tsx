import { useGoldPricesHistoryQuery, useGoldPricesQuery } from '@/features/home/hooks/query'
import { Skeleton } from '@/global/components/ui/skeleton'
import { convertNumberToVND } from '@/global/lib/utils'

export default function TickerHeader() {
  const { data: goldPrices, isPending: isLoadingGoldPrices } = useGoldPricesQuery()
  const { data: goldPricesHistory } = useGoldPricesHistoryQuery(2)

  return (
    <div className='bg-primary/10 border-primary/20 overflow-hidden border-b py-2'>
      <div className='mx-auto flex max-w-[1440px] items-center px-6'>
        <div className='text-primary mr-6 flex shrink-0 items-center gap-2 text-xs font-bold tracking-widest uppercase'>
          <span className='relative flex h-2 w-2'>
            <span className='bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
            <span className='bg-primary relative inline-flex h-2 w-2 rounded-full' />
          </span>
          Live Market
        </div>
        <div className='flex gap-12 text-sm font-medium'>
          <div className='flex items-center gap-4'>
            <span className='text-slate-400'>SJC:</span>
            {isLoadingGoldPrices ? (
              <Skeleton className='bg-primary/20 h-4 w-18' />
            ) : (
              <span className='flex items-center gap-1 text-emerald-500'>
                {convertNumberToVND(goldPrices?.prices?.VNGSJC?.sell)}{' '}
                <span className='material-symbols-outlined text-sm'>trending_up</span>
              </span>
            )}
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-slate-400'>PNJ:</span>
            {isLoadingGoldPrices ? (
              <Skeleton className='bg-primary/20 h-4 w-18' />
            ) : (
              <span className='flex items-center gap-1 text-rose-500'>
                {convertNumberToVND(goldPrices?.prices?.PQHNVM?.sell)}{' '}
                <span className='material-symbols-outlined text-sm'>trending_down</span>
              </span>
            )}
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-slate-400'>DOJI:</span>
            {isLoadingGoldPrices ? (
              <Skeleton className='bg-primary/20 h-4 w-18' />
            ) : (
              <span className='flex items-center gap-1 text-emerald-500'>
                {convertNumberToVND(goldPrices?.prices?.DOHNL?.sell)}{' '}
                <span className='material-symbols-outlined text-sm'>trending_up</span>
              </span>
            )}
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-slate-400'>XAU/USD:</span>
            {isLoadingGoldPrices ? (
              <Skeleton className='bg-primary/20 h-4 w-18' />
            ) : (
              <span className='flex items-center gap-1 text-emerald-500'>
                $ {goldPrices?.prices?.XAUUSD?.buy}{' '}
                <span className='material-symbols-outlined text-sm'>trending_up</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
