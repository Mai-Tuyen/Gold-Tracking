import { createClient as createServerAuthClient } from '@/global/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type SubscriptionBody = {
  endpoint?: string
  keys?: {
    p256dh?: string
    auth?: string
  }
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

const resolveUserId = async (request: Request) => {
  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  const admin = getAdminClient()

  if (bearerToken) {
    const {
      data: { user },
      error
    } = await admin.auth.getUser(bearerToken)

    if (!error && user) {
      return { userId: user.id, admin }
    }
  }

  const cookieStore = cookies()
  const authClient = await createServerAuthClient(cookieStore)
  const {
    data: { user },
    error
  } = await authClient.auth.getUser()

  if (error || !user) {
    return { userId: null, admin }
  }

  return { userId: user.id, admin }
}

export async function POST(request: Request) {
  try {
    const { userId, admin } = await resolveUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as SubscriptionBody
    const endpoint = body.endpoint?.trim()
    const p256dh = body.keys?.p256dh?.trim()
    const auth = body.keys?.auth?.trim()

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: 'Invalid subscription payload' }, { status: 400 })
    }

    const { error: upsertError } = await admin.from('push_subscriptions').upsert(
      {
        user_id: userId,
        endpoint,
        p256dh,
        auth,
        is_active: true
      },
      {
        onConflict: 'user_id,endpoint'
      }
    )

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, admin } = await resolveUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as { endpoint?: string }
    const endpoint = body.endpoint?.trim()

    const deactivateQuery = admin.from('push_subscriptions').update({ is_active: false }).eq('user_id', userId)
    const { error: updateError } = endpoint ? await deactivateQuery.eq('endpoint', endpoint) : await deactivateQuery

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, endpoint: endpoint ?? null })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
