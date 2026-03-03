'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMediaQuery } from '@/global/hooks/use-media-query'
import { Button } from '@/global/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/global/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/global/components/ui/form'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/global/components/ui/drawer'
import { Input } from '@/global/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/global/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/global/components/ui/tabs'
import { createClient } from '@/global/lib/supabase/client'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const alertFormSchema = z.object({
  brand: z.enum(['doji', 'sjc', 'pnj']),
  type: z.enum(['higher', 'lower']),
  priceField: z.enum(['buy', 'sell']),
  price: z
    .string()
    .min(1, 'Vui lòng nhập ngưỡng giá.')
    .refine(
      (val) => {
        const n = Number(val.replace(/[^\d]/g, ''))
        return Number.isFinite(n) && n > 0
      },
      { message: 'Ngưỡng giá phải lớn hơn 0.' }
    )
})

type AlertFormValues = z.infer<typeof alertFormSchema>

type AddPriceAlertModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

function formatVndInput(value: string) {
  const raw = value.replace(/[^\d]/g, '')
  if (!raw) return ''
  return new Intl.NumberFormat('vi-VN').format(Number(raw))
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
          <DrawerTitle className='font-manrope text-foreground text-[20px] font-bold'>Thêm thông báo giá</DrawerTitle>
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

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      brand: 'sjc',
      type: 'higher',
      priceField: 'sell',
      price: ''
    }
  })

  const type = form.watch('type')
  const isSubmitting = form.formState.isSubmitting

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const maybeMessage = (error as { message?: unknown }).message
      if (typeof maybeMessage === 'string' && maybeMessage.length > 0) {
        return maybeMessage
      }
    }
    return fallback
  }

  const onSubmit = async (data: AlertFormValues) => {
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

      const targetPrice = Number(data.price.replace(/[^\d]/g, ''))
      const operator = data.type === 'higher' ? 'gte' : 'lte'

      const { error } = await supabase.from('alert_rules').insert({
        user_id: user.id,
        brand: data.brand,
        price_field: data.priceField,
        operator,
        target_price: targetPrice,
        is_active: true
      })

      if (error) throw error

      toast.success('Đã lưu cài đặt thông báo giá.')
      form.reset({ ...data, price: '' })
      onOpenChange(false)
      onCreated?.()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Không thể lưu thông báo giá. Vui lòng thử lại.'))
    }
  }

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid items-start gap-6'>
          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground text-sm font-semibold'>Chọn hãng vàng</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className='focus:ring-gold/20 focus:border-gold border-border bg-muted/50 text-foreground h-12 rounded-xl'>
                      <SelectValue placeholder='Chọn hãng vàng' />
                    </SelectTrigger>
                    <SelectContent className='bg-popover border-border text-popover-foreground'>
                      <SelectItem value='doji'>DOJI</SelectItem>
                      <SelectItem value='sjc'>SJC</SelectItem>
                      <SelectItem value='pnj'>PNJ</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground text-sm font-semibold'>Loại thông báo</FormLabel>
                <FormControl>
                  <Tabs
                    value={field.value}
                    onValueChange={field.onChange}
                    className='w-full'
                  >
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='priceField'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground text-sm font-semibold'>Theo loại giá</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className='focus:ring-gold/20 focus:border-gold border-border bg-muted/50 text-foreground h-12 rounded-xl'>
                      <SelectValue placeholder='Chọn loại giá' />
                    </SelectTrigger>
                    <SelectContent className='bg-popover border-border text-popover-foreground'>
                      <SelectItem value='buy'>Giá mua vào</SelectItem>
                      <SelectItem value='sell'>Giá bán ra</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground text-sm font-semibold'>Ngưỡng giá (VNĐ)</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Ví dụ: 85.000.000'
                    value={field.value}
                    onChange={(e) => field.onChange(formatVndInput(e.target.value))}
                    className='focus-visible:ring-gold/20 focus-visible:border-gold border-border bg-muted/50 text-foreground placeholder:text-muted-foreground h-12 rounded-xl pl-4 text-base'
                  />
                </FormControl>
                <p className='text-muted-foreground text-[13px]'>
                  Nhận thông báo khi giá {type === 'higher' ? 'vượt quá' : 'xuống dưới'} mức này
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            disabled={isSubmitting}
            className='bg-gold hover:bg-gold/90 hover:shadow-gold/20 h-12 w-full rounded-xl text-base font-bold text-black shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl'
          >
            {isSubmitting ? 'Đang lưu...' : 'Cài đặt thông báo'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddPriceAlertModal
