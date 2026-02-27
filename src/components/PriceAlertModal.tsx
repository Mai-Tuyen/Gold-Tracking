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
            <AlertForm className='px-0' />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
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
        <Tabs value={type} onValueChange={setType} className='w-full'>
          <TabsList className='bg-muted grid h-12 w-full grid-cols-2 rounded-xl p-1'>
            <TabsTrigger
              value='higher'
              className='data-[state=active]:bg-gold text-muted-foreground rounded-lg text-sm font-medium transition-all data-[state=active]:text-black'
            >
              Giá cao hơn
            </TabsTrigger>
            <TabsTrigger
              value='lower'
              className='data-[state=active]:bg-gold text-muted-foreground rounded-lg text-sm font-medium transition-all data-[state=active]:text-black'
            >
              Giá thấp hơn
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='price' className='text-foreground text-sm font-semibold'>
          Ngưỡng giá (VNĐ)
        </Label>
        <div className='relative'>
          <Input
            id='price'
            type='text'
            placeholder='Ví dụ: 85.000.000'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='focus-visible:ring-gold/20 focus-visible:border-gold border-border bg-muted/50 text-foreground placeholder:text-muted-foreground h-12 rounded-xl pl-4 text-base'
          />
        </div>
        <p className='text-muted-foreground text-[13px]'>
          Nhận thông báo khi giá {type === 'higher' ? 'vượt quá' : 'xuống dưới'} mức này
        </p>
      </div>

      <Button
        type='submit'
        className='bg-gold hover:bg-gold/90 hover:shadow-gold/20 mt-2 h-12 w-full rounded-xl text-base font-bold text-black shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl'
      >
        Cài đặt thông báo
      </Button>
    </form>
  )
}
