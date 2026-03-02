import { GoldPriceCurrent } from '@/features/home/type'
import { createClient as createServerAuthClient } from '@/global/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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
  is_active: boolean
  last_notified_at: string | null
}

type PushSubscriptionRow = {
  id: string
  user_id: string
  endpoint: string
  is_active: boolean
  created_at: string
}

const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role credentials.')
  }
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  })
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

const resolveUserId = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams
  const secretFromQuery = searchParams.get('secret')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && secretFromQuery === cronSecret) {
    return searchParams.get('user_id')
  }

  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
  const admin = getAdminClient()

  if (bearerToken) {
    const {
      data: { user }
    } = await admin.auth.getUser(bearerToken)
    if (user) return user.id
  }

  const cookieStore = cookies()
  const authClient = await createServerAuthClient(cookieStore)
  const {
    data: { user }
  } = await authClient.auth.getUser()

  return user?.id ?? null
}

export async function GET(request: Request) {
  try {
    const userId = await resolveUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = getAdminClient()
    const nowMs = Date.now()

    const [{ data: rulesData, error: rulesError }, { data: subsData, error: subsError }, priceResponse] =
      await Promise.all([
        admin
          .from('alert_rules')
          .select('id,user_id,brand,price_field,operator,target_price,is_active,last_notified_at')
          .eq('user_id', userId),
        admin.from('push_subscriptions').select('id,user_id,endpoint,is_active,created_at').eq('user_id', userId),
        fetch(GOLD_PRICE_URL, { cache: 'no-store' })
      ])

    if (rulesError) {
      return NextResponse.json({ error: rulesError.message }, { status: 500 })
    }
    if (subsError) {
      return NextResponse.json({ error: subsError.message }, { status: 500 })
    }

    if (!priceResponse.ok) {
      return NextResponse.json({ error: 'Cannot fetch latest prices' }, { status: 502 })
    }

    const latestPrices = (await priceResponse.json()) as GoldPriceCurrent

    const rules = ((rulesData as AlertRule[] | null) ?? []).filter((rule) => rule.is_active)
    const subscriptions = (subsData as PushSubscriptionRow[] | null) ?? []
    const activeSubscriptions = subscriptions.filter((sub) => sub.is_active)

    const ruleEvaluations = rules.map((rule) => {
      const sourceKey = BRAND_TO_SOURCE_KEY[rule.brand]
      const priceNode = latestPrices.prices?.[sourceKey]
      const currentValue = Number(priceNode?.[rule.price_field])
      const targetPrice = Number(rule.target_price)
      const cooldownPassed = isCooldownPassed(rule.last_notified_at, nowMs)
      const matched =
        Number.isFinite(currentValue) &&
        Number.isFinite(targetPrice) &&
        cooldownPassed &&
        isRuleMatched(currentValue, rule.operator, targetPrice)

      return {
        id: rule.id,
        brand: rule.brand,
        price_field: rule.price_field,
        operator: rule.operator,
        target_price: targetPrice,
        current_value: Number.isFinite(currentValue) ? currentValue : null,
        cooldown_passed: cooldownPassed,
        last_notified_at: rule.last_notified_at,
        matched
      }
    })

    const matchedRules = ruleEvaluations.filter((rule) => rule.matched)

    return NextResponse.json({
      ok: true,
      user_id: userId,
      env: {
        has_supabase_url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        has_service_role: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        has_vapid_public: Boolean(process.env.WEB_PUSH_PUBLIC_KEY),
        has_vapid_private: Boolean(process.env.WEB_PUSH_PRIVATE_KEY),
        has_vapid_subject: Boolean(process.env.WEB_PUSH_SUBJECT),
        has_cron_secret: Boolean(process.env.CRON_SECRET)
      },
      subscriptions: {
        total: subscriptions.length,
        active: activeSubscriptions.length,
        latest_endpoint_suffix:
          activeSubscriptions.length > 0 ? activeSubscriptions[0].endpoint.slice(Math.max(0, activeSubscriptions[0].endpoint.length - 16)) : null
      },
      rules: {
        active: rules.length,
        matched: matchedRules.length,
        evaluations: ruleEvaluations
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
