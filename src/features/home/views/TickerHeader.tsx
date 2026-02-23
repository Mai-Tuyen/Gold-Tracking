import React from 'react'

export default function TickerHeader() {
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
            <span className='text-slate-400'>SJC Gold:</span>
            <span className='flex items-center gap-1 text-emerald-500'>
              82.50M <span className='material-symbols-outlined text-sm'>trending_up</span>
            </span>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-slate-400'>PNJ 24K:</span>
            <span className='flex items-center gap-1 text-rose-500'>
              74.30M <span className='material-symbols-outlined text-sm'>trending_down</span>
            </span>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-slate-400'>DOJI Jewel:</span>
            <span className='flex items-center gap-1 text-emerald-500'>
              82.45M <span className='material-symbols-outlined text-sm'>trending_up</span>
            </span>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-slate-400'>XAU/USD:</span>
            <span className='flex items-center gap-1 text-emerald-500'>
              $2,345.50 <span className='material-symbols-outlined text-sm'>trending_up</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
