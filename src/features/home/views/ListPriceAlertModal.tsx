'use client'

import * as React from 'react'
import { Bell, Plus, Trash2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import AddPriceAlertModal from '@/features/home/views/AddPriceAlertModal'
import { useMediaQuery } from '@/global/hooks/use-media-query'
import { createClient } from '@/global/lib/supabase/client'
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
import { Switch } from '@/global/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/global/components/ui/alert-dialog'

type AlertRule = {
  id: string
  brand: 'sjc' | 'doji' | 'pnj'
  price_field: 'buy' | 'sell'
  operator: 'gte' | 'lte'
  target_price: number
  is_active: boolean
  created_at: string
}

export default function ListPriceAlertModal({ trigger }: { trigger?: React.ReactNode }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [rules, setRules] = React.useState<AlertRule[]>([])
  const [mutatingRuleId, setMutatingRuleId] = React.useState<string | null>(null)
  const [ruleToDelete, setRuleToDelete] = React.useState<AlertRule | null>(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const supabase = React.useMemo(() => createClient(), [])
  const router = useRouter()

  const brandLabel: Record<AlertRule['brand'], string> = {
    sjc: 'SJC',
    doji: 'DOJI',
    pnj: 'PNJ'
  }

  const priceFieldLabel: Record<AlertRule['price_field'], string> = {
    buy: 'Mua vào',
    sell: 'Bán ra'
  }

  const operatorLabel: Record<AlertRule['operator'], string> = {
    gte: '>=',
    lte: '<='
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

  const formatVnd = (value: number) => new Intl.NumberFormat('vi-VN').format(Number(value))

  const loadRules = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser()

      if (authError) throw authError

      if (!user) {
        setIsAuthenticated(false)
        setRules([])
        return
      }

      setIsAuthenticated(true)

      const { data, error } = await supabase
        .from('alert_rules')
        .select('id,brand,price_field,operator,target_price,is_active,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRules((data as AlertRule[]) ?? [])
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Không thể tải danh sách thông báo.'))
      setRules([])
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  React.useEffect(() => {
    if (!isOpen) return
    loadRules()
  }, [isOpen, loadRules])

  const handleToggleRule = async (rule: AlertRule) => {
    setMutatingRuleId(rule.id)
    try {
      const { error } = await supabase.from('alert_rules').update({ is_active: !rule.is_active }).eq('id', rule.id)
      if (error) throw error

      setRules((prev) => prev.map((item) => (item.id === rule.id ? { ...item, is_active: !item.is_active } : item)))
      toast.success(rule.is_active ? 'Đã tắt thông báo.' : 'Đã bật thông báo.')
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Không thể cập nhật thông báo.'))
    } finally {
      setMutatingRuleId(null)
    }
  }

  const handleDeleteRule = async (rule: AlertRule) => {
    setMutatingRuleId(rule.id)
    setRuleToDelete(null)
    try {
      const { error } = await supabase.from('alert_rules').delete().eq('id', rule.id)
      if (error) throw error

      setRules((prev) => prev.filter((item) => item.id !== rule.id))
      toast.success('Đã xóa thông báo.')
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Không thể xóa thông báo.'))
    } finally {
      setMutatingRuleId(null)
    }
  }

  const listContent = (
    <div className='space-y-4'>
      <div className='bg-background-dark/40 border-border flex items-center justify-between rounded-xl border p-3'>
        <div className='flex items-center gap-2'>
          <div className='bg-gold/20 rounded-lg p-2'>
            <Bell className='text-gold h-4 w-4' />
          </div>
          <div>
            <p className='text-sm font-semibold text-white'>Quản lý thông báo giá</p>
            <p className='text-xs text-slate-400'>Theo dõi ngưỡng giá vàng bạn quan tâm</p>
          </div>
        </div>
        <Button
          type='button'
          onClick={() => setIsAddOpen(true)}
          className='bg-gold hover:bg-gold/90 h-9 rounded-lg px-3 text-black'
        >
          <Plus className='mr-1 h-4 w-4' />
          Thêm
        </Button>
      </div>

      {!isAuthenticated && !isLoading ? (
        <div className='space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4'>
          <p className='text-sm text-slate-300'>Bạn cần đăng nhập để quản lý thông báo giá.</p>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push(`/auth/login?next=${encodeURIComponent(pathname ?? '/')}`)}
          >
            Đăng nhập ngay
          </Button>
        </div>
      ) : null}

      {isLoading ? <p className='text-sm text-slate-400'>Đang tải danh sách thông báo...</p> : null}

      {!isLoading && isAuthenticated && rules.length === 0 ? (
        <p className='rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400'>
          Chưa có rule nào. Bấm <span className='text-gold font-semibold'>Thêm</span> để tạo thông báo mới.
        </p>
      ) : null}

      {!isLoading && isAuthenticated && rules.length > 0 ? (
        <div className='space-y-2'>
          {rules.map((rule) => (
            <div
              key={rule.id}
              className='border-border bg-background-dark/50 flex items-center justify-between rounded-xl border p-3'
            >
              <div>
                <p className='text-sm font-semibold text-white'>
                  {brandLabel[rule.brand]} - {priceFieldLabel[rule.price_field]} {operatorLabel[rule.operator]}{' '}
                  {formatVnd(rule.target_price)} VNĐ
                </p>
              </div>
              <div className='flex items-center gap-1'>
                <Switch
                  checked={rule.is_active}
                  onCheckedChange={() => handleToggleRule(rule)}
                  disabled={mutatingRuleId === rule.id}
                />
                <Button
                  type='button'
                  size='icon'
                  variant='ghost'
                  className='h-8 w-8 text-rose-400 hover:text-rose-300'
                  disabled={mutatingRuleId === rule.id}
                  onClick={() => setRuleToDelete(rule)}
                >
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>Xóa thông báo</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )

  return (
    <>
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
          <DialogContent className='bg-card border-border text-foreground gap-0 overflow-hidden rounded-[20px] p-0 sm:max-w-[560px]'>
            <DialogHeader className='border-border border-b px-6 py-5'>
              <DialogTitle className='font-manrope text-[20px] font-bold text-white'>Danh sách thông báo</DialogTitle>
              <DialogDescription className='sr-only'>Danh sách rule cảnh báo giá vàng đã thiết lập.</DialogDescription>
            </DialogHeader>
            <div className='p-6'>{listContent}</div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
          <DrawerContent className='bg-card border-border text-foreground rounded-t-[20px]'>
            <DrawerHeader className='border-border border-b px-6 py-5 text-left'>
              <DrawerTitle className='font-manrope text-[20px] font-bold text-white'>Danh sách thông báo</DrawerTitle>
              <DrawerDescription className='sr-only'>Danh sách rule cảnh báo giá vàng đã thiết lập.</DrawerDescription>
            </DrawerHeader>
            <div className='px-6 py-6 pb-10'>{listContent}</div>
          </DrawerContent>
        </Drawer>
      )}

      <AddPriceAlertModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onCreated={() => {
          loadRules()
        }}
      />

      <AlertDialog open={ruleToDelete !== null} onOpenChange={(open) => !open && setRuleToDelete(null)}>
        <AlertDialogContent className='border-border bg-card text-foreground sm:max-w-[400px]'>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa thông báo?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa thông báo này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={() => ruleToDelete && handleDeleteRule(ruleToDelete)}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
