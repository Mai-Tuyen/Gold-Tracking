'use client'

import { useEffect } from 'react'

export default function DevSwCleanup() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const cleanup = async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map((registration) => registration.unregister()))
      }

      if ('caches' in window) {
        const cacheKeys = await caches.keys()
        await Promise.all(cacheKeys.map((key) => caches.delete(key)))
      }
    }

    cleanup().catch(() => {
      // Ignore cleanup failures in local development.
    })
  }, [])

  return null
}
