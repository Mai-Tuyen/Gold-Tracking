import { Banknote } from 'lucide-react'

export default function Logo() {
  return (
    <div className='flex shrink-0 items-center gap-4'>
      <div className='bg-primary shadow-primary/20 rounded-xl p-2.5 shadow-lg'>
        <Banknote className='text-background-dark h-6 w-6' strokeWidth={2.5} />
      </div>
      <div className='flex flex-col'>
        <div className='flex items-center gap-1.5'>
          <span className='text-lg font-black tracking-tighter text-white'>
            GOLD<span className='text-primary'>TRACK</span>
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='mt-0.5 text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase'>Vietnam Market</span>
        </div>
      </div>
    </div>
  )
}
