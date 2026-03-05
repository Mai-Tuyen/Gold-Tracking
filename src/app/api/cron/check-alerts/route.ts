import { GoldPriceCurrent } from '@/features/home/type'
import { formatNumberToVND } from '@/global/lib/utils'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import webpush from 'web-push'

export const runtime = 'nodejs'

const GOLD_PRICE_URL = 'https://www.vang.today/api/prices'
const COOLDOWN_MINUTES = 0.1

const BRAND_TO_SOURCE_KEY = {
  sjc: 'SJL1L10',
  doji: 'DOHNL',
  pnj: 'PQHNVM'
} as const

type AlertRule = {
  id: string
  user_id: string
  brand: keyof typeof BRAND_TO_SOURCE_KEY
  price_field: 'buy' | 'sell'
  operator: 'gte' | 'lte'
  target_price: number
  last_notified_at: string | null
}

type PushSubscriptionRow = {
  id: string
  user_id: string
  endpoint: string
  p256dh: string
  auth: string
}

let isWebPushConfigured = false

const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role environment variables.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  })
}

const ensureWebPushConfigured = () => {
  if (isWebPushConfigured) return

  const subject = process.env.WEB_PUSH_SUBJECT
  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY

  if (!subject || !publicKey || !privateKey) {
    throw new Error('Missing Web Push VAPID environment variables.')
  }

  webpush.setVapidDetails(subject, publicKey, privateKey)
  isWebPushConfigured = true
}

const isCooldownPassed = (lastNotifiedAt: string | null, nowMs: number) => {
  if (!lastNotifiedAt) return true
  const lastMs = new Date(lastNotifiedAt).getTime()
  if (!Number.isFinite(lastMs)) return true
  return nowMs - lastMs >= COOLDOWN_MINUTES * 60 * 1000
}

const isRuleMatched = (currentValue: number, operator: AlertRule['operator'], targetPrice: number) => {
  if (operator === 'gte') return currentValue >= targetPrice
  return currentValue <= targetPrice
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    const isAuthorizedBySecret = Boolean(cronSecret) && authHeader === `Bearer ${cronSecret}`

    if (!isAuthorizedBySecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    ensureWebPushConfigured()
    const supabase = getAdminClient()

    const priceResponse = await fetch(GOLD_PRICE_URL, { cache: 'no-store' })
    if (!priceResponse.ok) {
      return NextResponse.json({ error: 'Cannot fetch latest gold prices' }, { status: 502 })
    }
    const latestPrices = (await priceResponse.json()) as GoldPriceCurrent

    const { data: activeRules, error: rulesError } = await supabase
      .from('alert_rules')
      .select('id,user_id,brand,price_field,operator,target_price,last_notified_at')
      .eq('is_active', true)

    if (rulesError) {
      return NextResponse.json({ error: rulesError.message }, { status: 500 })
    }

    const rules = (activeRules as AlertRule[] | null) ?? []
    const nowMs = Date.now()
    const matchedRules = rules.filter((rule) => {
      if (!isCooldownPassed(rule.last_notified_at, nowMs)) return false
      const sourceKey = BRAND_TO_SOURCE_KEY[rule.brand]
      const priceNode = latestPrices.prices?.[sourceKey]
      if (!priceNode) return false
      const currentValue = Number(priceNode[rule.price_field])
      const targetPrice = Number(rule.target_price)
      if (!Number.isFinite(currentValue) || !Number.isFinite(targetPrice)) return false
      return isRuleMatched(currentValue, rule.operator, targetPrice)
    })

    if (matchedRules.length === 0) {
      return NextResponse.json({ ok: true, checked_rules: rules.length, sent_notifications: 0 })
    }

    const targetUserIds = [...new Set(matchedRules.map((rule) => rule.user_id))]
    const { data: subscriptionsData, error: subscriptionsError } = await supabase
      .from('push_subscriptions')
      .select('id,user_id,endpoint,p256dh,auth')
      .eq('is_active', true)
      .in('user_id', targetUserIds)

    if (subscriptionsError) {
      return NextResponse.json({ error: subscriptionsError.message }, { status: 500 })
    }

    const subscriptions = (subscriptionsData as PushSubscriptionRow[] | null) ?? []
    const subscriptionsByUser = new Map<string, PushSubscriptionRow[]>()
    for (const subscription of subscriptions) {
      const list = subscriptionsByUser.get(subscription.user_id) ?? []
      list.push(subscription)
      subscriptionsByUser.set(subscription.user_id, list)
    }

    let sentNotifications = 0
    const notifiedRuleIds = new Set<string>()
    const invalidEndpointSet = new Set<string>()

    for (const rule of matchedRules) {
      const sourceKey = BRAND_TO_SOURCE_KEY[rule.brand]
      const priceNode = latestPrices.prices?.[sourceKey]
      if (!priceNode) continue

      const currentValue = Number(priceNode[rule.price_field])
      if (!Number.isFinite(currentValue)) continue

      const userSubscriptions = subscriptionsByUser.get(rule.user_id) ?? []
      if (userSubscriptions.length === 0) continue

      const payload = JSON.stringify({
        title: 'Gold Tracker - Thông báo giá vàng',
        body: `${rule.brand.toUpperCase()} ${rule.price_field === 'buy' ? 'mua vào' : 'bán ra'} đã chạm ngưỡng ${formatNumberToVND(rule.target_price)}`,
        data: { url: '/' }
      })

      let sentForRule = false
      for (const subscription of userSubscriptions) {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth
              }
            },
            payload
          )
          sentNotifications += 1
          sentForRule = true
        } catch (error: unknown) {
          const statusCode =
            typeof error === 'object' && error !== null && 'statusCode' in error
              ? Number((error as { statusCode?: number }).statusCode)
              : null

          if (statusCode === 404 || statusCode === 410) {
            invalidEndpointSet.add(subscription.endpoint)
          }
        }
      }

      if (sentForRule) {
        notifiedRuleIds.add(rule.id)
      }
    }

    if (invalidEndpointSet.size > 0) {
      await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .in('endpoint', [...invalidEndpointSet])
    }

    if (notifiedRuleIds.size > 0) {
      await supabase
        .from('alert_rules')
        .update({ last_notified_at: new Date().toISOString() })
        .in('id', [...notifiedRuleIds])
    }

    return NextResponse.json({
      ok: true,
      checked_rules: rules.length,
      sent_notifications: sentNotifications
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
