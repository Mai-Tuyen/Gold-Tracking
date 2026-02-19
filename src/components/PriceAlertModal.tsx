'use client'
import * as React from 'react'
import { useMediaQuery } from '@/global/hooks/use-media-query'
import { Button } from '@/global/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/global/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/global/components/ui/drawer'
import { Input } from '@/global/components/ui/input'
import { Label } from '@/global/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/global/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/global/components/ui/tabs'
import { cn } from '@/global/lib/utils'

export function PriceAlertModal({
  open,
  onOpenChange,
  trigger
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // Sync internal state with controlled prop if provided
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value)
    onOpenChange?.(value)
  }

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className='gap-0 overflow-hidden rounded-[20px] bg-card p-0 sm:max-w-[480px] border-border text-foreground'>
          <DialogHeader className='border-b border-border px-6 py-5'>
            <DialogTitle className='font-manrope text-[20px] font-bold text-foreground'>Cài đặt thông báo giá</DialogTitle>
            <DialogDescription className='sr-only'>
              Thiết lập thông báo khi giá vàng đạt ngưỡng mong muốn.
            </DialogDescription>
          </DialogHeader>
          <div className='p-6'>
            <AlertForm className='px-0' />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent className='rounded-t-[20px] bg-card border-border text-foreground'>
        <DrawerHeader className='border-b border-border px-6 py-5 text-left'>
          <DrawerTitle className='font-manrope text-[20px] font-bold text-foreground'>Cài đặt thông báo giá</DrawerTitle>
          <DrawerDescription className='sr-only'>
            Thiết lập thông báo khi giá vàng đạt ngưỡng mong muốn.
          </DrawerDescription>
        </DrawerHeader>
        <div className='px-6 py-6 pb-10'>
          <AlertForm />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function AlertForm({ className }: React.ComponentProps<'form'>) {
  const [brand, setBrand] = React.useState('sjc')
  const [type, setType] = React.useState('higher')
  const [price, setPrice] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log({ brand, type, price })
  }

  return (
    <form className={cn('grid items-start gap-6', className)} onSubmit={handleSubmit}>
      <div className='grid gap-2'>
        <Label htmlFor='brand' className='text-sm font-semibold text-foreground'>
          Chọn hãng vàng
        </Label>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger className='focus:ring-gold/20 focus:border-gold h-12 rounded-xl border-border bg-muted/50 text-foreground'>
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
        <Label className='text-sm font-semibold text-foreground'>Loại thông báo</Label>
        <Tabs value={type} onValueChange={setType} className='w-full'>
          <TabsList className='grid h-12 w-full grid-cols-2 rounded-xl bg-muted p-1'>
            <TabsTrigger
              value='higher'
              className='data-[state=active]:bg-gold rounded-lg text-sm font-medium transition-all data-[state=active]:text-black text-muted-foreground'
            >
              Giá cao hơn
            </TabsTrigger>
            <TabsTrigger
              value='lower'
              className='data-[state=active]:bg-gold rounded-lg text-sm font-medium transition-all data-[state=active]:text-black text-muted-foreground'
            >
              Giá thấp hơn
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='price' className='text-sm font-semibold text-foreground'>
          Ngưỡng giá (VNĐ)
        </Label>
        <div className='relative'>
          <Input
            id='price'
            type='text'
            placeholder='Ví dụ: 85.000.000'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='focus-visible:ring-gold/20 focus-visible:border-gold h-12 rounded-xl border-border bg-muted/50 pl-4 text-base text-foreground placeholder:text-muted-foreground'
          />
        </div>
        <p className='text-[13px] text-muted-foreground'>
          Nhận thông báo khi giá {type === 'higher' ? 'vượt quá' : 'xuống dưới'} mức này
        </p>
      </div>

      <Button
        type='submit'
        className='mt-2 h-12 w-full rounded-xl bg-gold text-base font-bold text-black shadow-lg transition-all hover:scale-[1.01] hover:bg-gold/90 hover:shadow-xl hover:shadow-gold/20'
      >
        Cài đặt thông báo
      </Button>
    </form>
  )
}
