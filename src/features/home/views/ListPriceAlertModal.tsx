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
  const [isPushSupported, setIsPushSupported] = React.useState(true)
  const [isPushEnabled, setIsPushEnabled] = React.useState(false)
  const [isPushLoading, setIsPushLoading] = React.useState(false)
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

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    return Uint8Array.from(rawData, (char) => char.charCodeAt(0))
  }

  const syncSubscriptionToServer = React.useCallback(
    async (subscription: PushSubscription) => {
      const subscriptionJson = subscription.toJSON()
      const endpoint = subscription.endpoint
      const p256dh = subscriptionJson.keys?.p256dh
      const auth = subscriptionJson.keys?.auth

      if (!endpoint || !p256dh || !auth) {
        throw new Error('Không đọc được dữ liệu subscription hợp lệ.')
      }

      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      }

      const response = await fetch('/api/push/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          endpoint,
          keys: { p256dh, auth }
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(result?.error ?? 'Không thể đồng bộ đăng ký thông báo.')
      }
    },
    [supabase]
  )

  const checkPushStatus = React.useCallback(async () => {
    if (typeof window === 'undefined') return

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setIsPushSupported(false)
      setIsPushEnabled(false)
      return
    }

    setIsPushSupported(true)

    if (Notification.permission === 'denied') {
      setIsPushEnabled(false)
      return
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    setIsPushEnabled(Boolean(subscription))

    // Auto-heal: browser da subscribe nhung DB chua co ban ghi.
    if (subscription) {
      try {
        await syncSubscriptionToServer(subscription)
      } catch {
        // Khong fail UI state, user van thay status local.
      }
    }
  }, [syncSubscriptionToServer])

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

  React.useEffect(() => {
    if (!isOpen || !isAuthenticated) return
    checkPushStatus().catch(() => {
      setIsPushSupported(false)
      setIsPushEnabled(false)
    })
  }, [isOpen, isAuthenticated, checkPushStatus])

  const handleEnablePush = async () => {
    setIsPushLoading(true)
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setIsPushSupported(false)
        throw new Error('Trình duyệt không hỗ trợ Push Notification.')
      }

      let permission = Notification.permission
      if (permission === 'default') {
        permission = await Notification.requestPermission()
      }

      if (permission !== 'granted') {
        throw new Error('Bạn chưa cấp quyền nhận thông báo.')
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        throw new Error('Thiếu NEXT_PUBLIC_VAPID_PUBLIC_KEY.')
      }

      const registration = await navigator.serviceWorker.ready
      let subscription = await registration.pushManager.getSubscription()
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        })
      }

      await syncSubscriptionToServer(subscription)

      setIsPushEnabled(true)
      toast.success('Đã bật thông báo đẩy.')
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Không thể bật thông báo đẩy.'))
      await checkPushStatus()
    } finally {
      setIsPushLoading(false)
    }
  }

  const handleDisablePush = async () => {
    setIsPushLoading(true)
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setIsPushSupported(false)
        setIsPushEnabled(false)
        return
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        setIsPushEnabled(false)
        toast.info('Thiết bị chưa đăng ký thông báo đẩy.')
        return
      }

      const endpoint = subscription.endpoint
      const {
        data: { session }
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      }

      const response = await fetch('/api/push/subscriptions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ endpoint }),
        credentials: 'include'
      })

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(result?.error ?? 'Không thể tắt đăng ký thông báo trên server.')
      }

      await subscription.unsubscribe()
      setIsPushEnabled(false)
      toast.success('Đã tắt thông báo đẩy.')
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Không thể tắt thông báo đẩy.'))
      await checkPushStatus()
    } finally {
      setIsPushLoading(false)
    }
  }

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

      {!isLoading && isAuthenticated ? (
        <div className='border-border bg-background-dark/50 flex items-center justify-between rounded-xl border p-3'>
          <div>
            <p className='text-sm font-semibold text-white'>Thông báo đẩy trên thiết bị</p>
            <p className='text-xs text-slate-400'>
              {isPushSupported
                ? isPushEnabled
                  ? 'Đang bật cho trình duyệt hiện tại.'
                  : 'Đang tắt cho trình duyệt hiện tại.'
                : 'Trình duyệt hiện tại không hỗ trợ push.'}
            </p>
          </div>
          <Button
            type='button'
            variant={isPushEnabled ? 'outline' : 'default'}
            disabled={isPushLoading || !isPushSupported}
            onClick={isPushEnabled ? handleDisablePush : handleEnablePush}
          >
            {isPushLoading ? 'Đang xử lý...' : isPushEnabled ? 'Tắt Notification' : 'Bật Notification'}
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
