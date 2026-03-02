'use client'
import * as React from 'react'
import { useMediaQuery } from '@/global/hooks/use-media-query'
import { Button } from '@/global/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/global/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/global/components/ui/drawer'
import { Input } from '@/global/components/ui/input'
import { Label } from '@/global/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/global/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/global/components/ui/tabs'
import { createClient } from '@/global/lib/supabase/client'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

type AddPriceAlertModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

export function AddPriceAlertModal({ open, onOpenChange, onCreated }: AddPriceAlertModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='bg-card border-border text-foreground gap-0 overflow-hidden rounded-[20px] p-0 sm:max-w-[480px]'>
          <DialogHeader className='border-border border-b px-6 py-5'>
            <DialogTitle className='font-manrope text-foreground text-[20px] font-bold'>
              Cài đặt thông báo giá
            </DialogTitle>
            <DialogDescription className='sr-only'>
              Thiết lập thông báo khi giá vàng đạt ngưỡng mong muốn.
            </DialogDescription>
          </DialogHeader>
          <div className='p-6'>
            <AlertForm className='px-0' onOpenChange={onOpenChange} onCreated={onCreated} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='bg-card border-border text-foreground rounded-t-[20px]'>
        <DrawerHeader className='border-border border-b px-6 py-5 text-left'>
          <DrawerTitle className='font-manrope text-foreground text-[20px] font-bold'>
            Cài đặt thông báo giá
          </DrawerTitle>
          <DrawerDescription className='sr-only'>
            Thiết lập thông báo khi giá vàng đạt ngưỡng mong muốn.
          </DrawerDescription>
        </DrawerHeader>
        <div className='px-6 py-6 pb-10'>
          <AlertForm onOpenChange={onOpenChange} onCreated={onCreated} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function AlertForm({
  onOpenChange,
  onCreated,
  className
}: {
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
  className?: string
}) {
  const supabase = React.useMemo(() => createClient(), [])
  const router = useRouter()
  const pathname = usePathname()
  const [brand, setBrand] = React.useState('sjc')
  const [priceField, setPriceField] = React.useState<'buy' | 'sell'>('sell')
  const [type, setType] = React.useState<'higher' | 'lower'>('higher')
  const [price, setPrice] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const formatVndInput = (value: string) => {
    const raw = value.replace(/[^\d]/g, '')
    if (!raw) return ''
    return new Intl.NumberFormat('vi-VN').format(Number(raw))
  }

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const maybeMessage = (error as { message?: unknown }).message
      if (typeof maybeMessage === 'string' && maybeMessage.length > 0) {
        return maybeMessage
      }
    }
    return fallback
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const rawValue = price.replace(/[^\d]/g, '')
    if (!rawValue) {
      toast.error('Vui lòng nhập ngưỡng giá hợp lệ.')
      return
    }

    const targetPrice = Number(rawValue)
    if (!Number.isFinite(targetPrice) || targetPrice <= 0) {
      toast.error('Ngưỡng giá phải lớn hơn 0.')
      return
    }

    setIsSubmitting(true)
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser()

      if (authError) throw authError

      if (!user) {
        toast.info('Vui lòng đăng nhập để lưu cảnh báo giá.')
        router.push(`/auth/login?next=${encodeURIComponent(pathname ?? '/')}`)
        return
      }

      const operator = type === 'higher' ? 'gte' : 'lte'

      const { error } = await supabase.from('alert_rules').insert({
        user_id: user.id,
        brand,
        price_field: priceField,
        operator,
        target_price: targetPrice,
        is_active: true
      })

      if (error) throw error

      toast.success('Đã lưu cài đặt thông báo giá.')
      setPrice('')
      onOpenChange(false)
      onCreated?.()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Không thể lưu thông báo giá. Vui lòng thử lại.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(formatVndInput((e.target as unknown as { value: string }).value))
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className='grid items-start gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor='brand' className='text-foreground text-sm font-semibold'>
            Chọn hãng vàng
          </Label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger className='focus:ring-gold/20 focus:border-gold border-border bg-muted/50 text-foreground h-12 rounded-xl'>
              <SelectValue placeholder='Chọn hãng vàng' />
            </SelectTrigger>
            <SelectContent className='bg-popover border-border text-popover-foreground'>
              <SelectItem value='doji'>DOJI Group</SelectItem>
              <SelectItem value='sjc'>SJC Miền Bắc</SelectItem>
              <SelectItem value='pnj'>PNJ Jewelry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='grid gap-2'>
          <Label className='text-foreground text-sm font-semibold'>Loại thông báo</Label>
          <Tabs value={type} onValueChange={(value) => setType(value as 'higher' | 'lower')} className='w-full'>
            <TabsList className='bg-muted grid h-12 w-full grid-cols-2 rounded-xl p-1'>
              <TabsTrigger
                value='higher'
                className='data-[state=active]:bg-primary text-muted-foreground rounded-lg text-sm font-medium transition-all data-[state=active]:text-black'
              >
                Giá cao hơn
              </TabsTrigger>
              <TabsTrigger
                value='lower'
                className='data-[state=active]:bg-primary text-muted-foreground rounded-lg text-sm font-medium transition-all data-[state=active]:text-black'
              >
                Giá thấp hơn
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='priceField' className='text-foreground text-sm font-semibold'>
            Theo loại giá
          </Label>
          <Select value={priceField} onValueChange={(value: 'buy' | 'sell') => setPriceField(value)}>
            <SelectTrigger
              id='priceField'
              className='focus:ring-gold/20 focus:border-gold border-border bg-muted/50 text-foreground h-12 rounded-xl'
            >
              <SelectValue placeholder='Chọn loại giá' />
            </SelectTrigger>
            <SelectContent className='bg-popover border-border text-popover-foreground'>
              <SelectItem value='buy'>Giá mua vào</SelectItem>
              <SelectItem value='sell'>Giá bán ra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='price' className='text-foreground text-sm font-semibold'>
            Ngưỡng giá (VNĐ)
          </Label>
          <Input
            id='price'
            type='text'
            placeholder='Ví dụ: 85.000.000'
            value={price}
            onChange={handlePriceInputChange}
            className='focus-visible:ring-gold/20 focus-visible:border-gold border-border bg-muted/50 text-foreground placeholder:text-muted-foreground h-12 rounded-xl pl-4 text-base'
          />
          <p className='text-muted-foreground text-[13px]'>
            Nhận thông báo khi giá {type === 'higher' ? 'vượt quá' : 'xuống dưới'} mức này
          </p>
        </div>

        <Button
          type='submit'
          disabled={isSubmitting}
          className='bg-gold hover:bg-gold/90 hover:shadow-gold/20 h-12 w-full rounded-xl text-base font-bold text-black shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl'
        >
          {isSubmitting ? 'Đang lưu...' : 'Cài đặt thông báo'}
        </Button>
      </div>
    </form>
  )
}
export default AddPriceAlertModal
