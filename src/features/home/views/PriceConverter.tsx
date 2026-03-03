import { useGoldPricesQuery } from '@/features/home/hooks/query'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/global/components/ui/select'
import { ArrowUpDown } from 'lucide-react'
import { doReadNumber, ReadingConfig } from 'read-vietnamese-number'
import { useMemo, useState } from 'react'

const currencyConfig = new ReadingConfig()
currencyConfig.unit = ['đồng']

export default function PriceConverter() {
  const [selectedBrand, setSelectedBrand] = useState<'SJL1L10' | 'PQHNVM' | 'DOHNL'>('SJL1L10')
  const [amount, setAmount] = useState<number>(1.0)
  const { data: goldPrices } = useGoldPricesQuery()

  const priceByBrandSelected = goldPrices?.prices?.[selectedBrand]?.sell
  const priceInVND = priceByBrandSelected ? priceByBrandSelected * amount : 0
  const priceInWords = useMemo(() => {
    if (!priceInVND || Number.isNaN(priceInVND)) return ''
    try {
      return doReadNumber(Math.round(priceInVND).toString(), currencyConfig)
    } catch {
      return 'Không đọc được số tiền'
    }
  }, [priceInVND])

  return (
    <div className='dark:border-border-dark dark:bg-card-dark rounded-xl border border-slate-200 bg-white p-8'>
      <div className='flex items-center justify-between'>
        <h3 className='mb-6 font-bold text-slate-900 dark:text-white'>Chuyển đổi giá</h3>
        <Select
          defaultValue={selectedBrand}
          onValueChange={(value) => setSelectedBrand(value as 'SJL1L10' | 'PQHNVM' | 'DOHNL')}
        >
          <SelectTrigger className='w-full max-w-48'>
            <SelectValue placeholder='Chọn thương hiệu' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='SJL1L10'>SJC</SelectItem>
              <SelectItem value='PQHNVM'>PNJ</SelectItem>
              <SelectItem value='DOHNL'>DOJI</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className='space-y-6'>
        <div>
          <label className='mb-2 block text-xs font-bold text-slate-400 uppercase'>Lượng</label>
          <div className='relative'>
            <input
              className='focus:ring-primary dark:bg-background-dark w-full [appearance:textfield] rounded-lg border-none bg-slate-100 p-4 text-sm font-bold text-slate-900 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
              type='number'
              defaultValue={amount}
              onChange={(e) => setAmount(Number((e.target as unknown as { value: string }).value))}
              placeholder='Ví dụ: 0.1 (1 chỉ)'
            />
            <span className='absolute top-1/2 right-4 -translate-y-1/2 font-bold text-slate-400'>Lượng</span>
          </div>
        </div>
        <div className='flex justify-center'>
          <div className='bg-primary rounded-full p-2'>
            <ArrowUpDown className='text-background-dark h-5 w-5' />
          </div>
        </div>
        <div>
          <label className='mb-2 block text-xs font-bold text-slate-400 uppercase'>VND</label>
          <div className='relative'>
            <input
              className='text-primary dark:bg-background-dark w-full rounded-lg border-none bg-slate-100 p-4 text-xl font-bold'
              readOnly
              type='text'
              value={priceInVND.toLocaleString('vi-VN')}
            />
            <span className='absolute top-1/2 right-4 -translate-y-1/2 font-bold text-slate-400'>VND</span>
          </div>
        </div>
        <div className='text-sm text-slate-400 first-letter:uppercase'>{priceInWords}</div>
      </div>
    </div>
  )
}
