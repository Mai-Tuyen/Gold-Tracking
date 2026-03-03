import { cn, formatNumberToVND } from '@/global/lib/utils'
import { ArrowDown, ArrowUp } from 'lucide-react'
import React from 'react'
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
export default function PriceCard({
  brand,
  buy,
  sell,
  changeSell,
  label
}: {
  brand: string
  buy: number
  sell: number
  changeSell: number
  label: string
}) {
  return (
    <div className='hover:border-primary/50 dark:border-border-dark dark:bg-card-dark rounded-xl border border-slate-200 bg-white p-6 transition-all'>
      <div className='mb-6 flex items-start justify-between'>
        <div className='dark:bg-background-dark rounded bg-slate-100 px-3 py-1 text-[10px] font-black tracking-widest text-slate-500 uppercase'>
          {brand}
        </div>
        {renderChange(sell, changeSell)}
      </div>
      <h3 className='mb-1 text-sm font-medium text-slate-500 dark:text-slate-400'>{label}</h3>
      <div className='flex gap-12 md:block md:space-y-4'>
        <div>
          <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Mua</p>
          <p className='text-2xl font-black text-slate-900 dark:text-white'>{formatNumberToVND(buy ?? 0)} </p>
        </div>
        <div>
          <p className='text-xs font-bold tracking-tighter text-slate-400 uppercase'>Bán</p>
          <p className='text-2xl font-black text-slate-900 dark:text-white'>{formatNumberToVND(sell ?? 0)} </p>
        </div>
      </div>
    </div>
  )
}
