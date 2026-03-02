# Flow Push Notification Sequence (MVP)

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as Next.js UI (ListPriceAlertModal)
    participant SW as Service Worker (Serwist sw.ts)
    participant API as Next.js API Routes
    participant DB as Supabase (alert_rules/push_subscriptions)
    participant Cron as Vercel Cron
    participant Gold as Gold Price Source
    participant WP as Web Push Service (FCM/Browser Push)

    Note over User,DB: Phase 1 - User tao rule
    User->>UI: Tao rule gia vang (brand/field/operator/target)
    UI->>DB: Insert public.alert_rules (is_active=true)
    DB-->>UI: Rule duoc luu

    Note over User,DB: Phase 2 - User bat push tren thiet bi
    User->>UI: Bam "Bat Push"
    UI->>UI: Notification.requestPermission()
    UI->>SW: navigator.serviceWorker.ready
    UI->>SW: pushManager.subscribe(userVisibleOnly, VAPID public key)
    SW-->>UI: PushSubscription { endpoint, p256dh, auth }
    UI->>API: POST /api/push/subscriptions
    API->>API: Xac thuc user session
    API->>DB: Upsert push_subscriptions (user_id + endpoint)
    DB-->>API: is_active=true
    API-->>UI: 200 OK

    Note over Cron,DB: Phase 3 - Cron check alert dinh ky
    Cron->>API: GET /api/cron/check-alerts (Bearer CRON_SECRET)
    API->>API: Validate CRON_SECRET + runtime=nodejs
    API->>Gold: Fetch latest gold prices
    Gold-->>API: Gia moi nhat
    API->>DB: Query alert_rules active + cooldown pass
    DB-->>API: Danh sach rule matchable
    API->>DB: Query push_subscriptions active theo user
    DB-->>API: Danh sach subscriptions

    loop Moi rule match
        API->>WP: web-push.sendNotification(subscription, payload)
        alt Push success
            WP-->>API: 201/202
        else Endpoint expired/invalid
            WP-->>API: 404/410
            API->>DB: Update push_subscriptions.is_active=false
        end
        API->>DB: Update alert_rules.last_notified_at=now()
    end

    API-->>Cron: { ok: true, checked_rules, sent_notifications }

    Note over User,SW: Phase 4 - Nhan va click notification
    WP-->>SW: push event
    SW->>User: showNotification(title, body, data.url)
    User->>SW: Click notification
    SW->>SW: notificationclick handler
    SW->>UI: clients.openWindow("/")
```

## Review nhanh

- 3 endpoint toi thieu:
  - `POST /api/push/subscriptions`
  - `DELETE /api/push/subscriptions` (tuong ung unsubscribe, tuy khong ve trong diagram)
  - `GET /api/cron/check-alerts`
- Cot chong spam:
  - `alert_rules.last_notified_at` + cooldown.
- Cot on dinh:
  - Neu `web-push` tra `404/410`, deactivate subscription.
