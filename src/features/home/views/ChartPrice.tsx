import { LineChart } from '@/features/home/views/LineChart'
import { useHomeStore } from '@/features/home/store'
import { cn } from '@/global/lib/utils'
import React from 'react'
export default function ChartPrice() {
  const [chartTimeRange, setChartTimeRange] = React.useState<number>(7)
  const { typeChecked } = useHomeStore()

  const labelTypeChecked = React.useMemo(() => {
    if (typeChecked === 'SJL1L10') return 'SJC 9999'
    if (typeChecked === 'PQHNVM') return 'PNJ'
    if (typeChecked === 'DOHNL') return 'DOJI'
    return ''
  }, [typeChecked])

  return (
    <div className='dark:border-border-dark dark:bg-card-dark flex flex-col rounded-xl border border-slate-200 bg-white p-8 lg:col-span-2'>
      <div className='mb-8 flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='dark:text-primary mb-2 text-3xl font-extrabold text-slate-900'>{labelTypeChecked}</h1>
          <p className='flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400'>
            Lịch sử giá trong {chartTimeRange} ngày qua
          </p>
        </div>
        <div className='dark:bg-background-dark flex rounded-lg bg-slate-100 p-1'>
          {['3D', '7D', '30D'].map((tab) => (
            <button
              key={tab}
              onClick={() => setChartTimeRange(parseInt(tab.split('D')[0]))}
              className={cn(
                'rounded-md px-4 py-1.5 text-xs font-bold transition-all',
                chartTimeRange === parseInt(tab.split('D')[0])
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
          <LineChart days={chartTimeRange} className='h-full w-full' />
        </div>
      </div>
    </div>
  )
}
