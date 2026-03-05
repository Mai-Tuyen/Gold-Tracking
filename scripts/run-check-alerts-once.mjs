import process from 'node:process'

const appUrl = process.env.CRON_APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://127.0.0.1:3000'
const cronSecret = process.env.CRON_SECRET

if (!cronSecret) {
  console.error('[cron] Missing CRON_SECRET')
  process.exit(1)
}

const endpoint = `${appUrl.replace(/\/$/, '')}/api/cron/check-alerts`

try {
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cronSecret}`
    }
  })

  const text = await response.text()
  if (!response.ok) {
    console.error(`[cron] request failed ${response.status}: ${text}`)
    process.exit(1)
  }

  console.log(`[cron] success ${new Date().toISOString()} ${text}`)
} catch (error) {
  console.error('[cron] request error', error)
  process.exit(1)
}
