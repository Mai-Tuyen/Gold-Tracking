/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from '@serwist/turbopack/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { NetworkOnly, Serwist } from 'serwist'

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const runtimeCaching = [
  {
    matcher: ({ request }: { request: Request }) => request.mode === 'navigate' || request.destination === 'document',
    handler: new NetworkOnly()
  },
  ...defaultCache
]

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document'
        }
      }
    ]
  }
})

serwist.addEventListeners()

type PushPayload = {
  title?: string
  body?: string
  icon?: string
  badge?: string
  data?: {
    url?: string
  }
}

self.addEventListener('push', (event) => {
  const payload = (() => {
    try {
      return (event.data?.json() as PushPayload | undefined) ?? {}
    } catch {
      return {}
    }
  })()

  const title = payload.title ?? 'Gold Tracker - Thông báo giá vàng'
  const body = payload.body ?? 'Giá vàng đã chạm ngưỡng cài đặt'
  const icon = payload.icon ?? '/icons/icon-192x192.png'
  const badge = payload.badge ?? '/icons/icon-192x192.png'
  const url = payload.data?.url ?? '/'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      data: { url }
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = (event.notification.data?.url as string | undefined) ?? '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
      return undefined
    })
  )
})
