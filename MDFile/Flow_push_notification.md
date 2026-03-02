# Flow Push Notification (Don gian nhat) - Gold Tracking

Tai lieu nay mo ta flow toi gian de gui push notification khi gia vang cham nguong, phu hop voi stack hien tai: Next.js App Router + Serwist (Turbopack) + Supabase.

## 1) Muc tieu

- User tao alert rule trong `public.alert_rules`.
- User bat push tren trinh duyet (1 lan moi thiet bi/browser).
- Server luu subscription vao `public.push_subscriptions`.
- Cron check gia dinh ky, match rule, gui push.
- User click notification mo app route `/`.

---

## 2) Thu vien can cai va cach dung

## 2.1 Bat buoc

1. `serwist` + `@serwist/turbopack` (da co)
- Muc dich: quan ly Service Worker voi Next.js Turbopack.
- Dang dung trong project:
  - `src/app/serwist/[path]/route.ts` qua `createSerwistRoute(...)`
  - `src/global/lib/providers/SerwistProvider.tsx` qua `<SerwistProvider swUrl='/serwist/sw.js'>`
  - `src/app/sw.ts` la file service worker chinh.

2. `web-push` (server side)
- Muc dich: gui Web Push den cac `PushSubscription` da dang ky.
- Cai dat:
```bash
npm i web-push
```
- Cach dung toi gian:
  - Khoi tao 1 lan tren server bang `setVapidDetails(...)`.
  - Moi lan can gui thi goi `sendNotification(subscription, payload)`.
  - Neu loi `404` hoac `410` thi danh dau subscription `is_active=false`.

3. `@supabase/supabase-js` / `@supabase/ssr` (da co)
- Muc dich: xac thuc user va doc/ghi `alert_rules`, `push_subscriptions`.
- Client:
  - Dung de lay user session va goi API noi bo.
- Server:
  - Route cron dung service role de doc toan bo alert/subscription can thiet.

## 2.2 Nen co (khong bat buoc)

4. `zod`
- Muc dich: validate body request cho API route (`/api/push/subscriptions`, `/api/cron/check-alerts`).
- Cai dat:
```bash
npm i zod
```

---

## 3) Bien moi truong can co

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxxx
WEB_PUSH_PUBLIC_KEY=xxxx
WEB_PUSH_PRIVATE_KEY=xxxx
WEB_PUSH_SUBJECT=mailto:you@example.com
CRON_SECRET=super-secret
SUPABASE_SERVICE_ROLE_KEY=xxxx
```

Ghi chu:
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` dung o client khi `pushManager.subscribe(...)`.
- `WEB_PUSH_PRIVATE_KEY` chi dung o server, tuyet doi khong expose ra client.

---

## 4) Flow toi gian End-to-End

## B1. User tao rule
- UI luu vao `public.alert_rules` (da co san).

## B2. User bam "Bat Push"
- Client check:
  - co ho tro SW + PushManager khong
  - `Notification.permission`
- Neu chua duoc cap quyen -> goi `Notification.requestPermission()`.
- Lay service worker registration:
  - `navigator.serviceWorker.ready`
- Tao subscription:
  - `registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`
- Goi `POST /api/push/subscriptions` de luu DB.

## B3. Server luu subscription
- API route:
  - xac thuc user
  - trich `endpoint`, `keys.p256dh`, `keys.auth`
  - upsert vao `push_subscriptions` theo `(user_id, endpoint)`
  - set `is_active=true`

## B4. Cron check alert dinh ky
- Vercel Cron goi `GET /api/cron/check-alerts` moi 1-2 phut.
- Route phai:
  - `export const runtime = 'nodejs'`
  - validate `Authorization: Bearer ${CRON_SECRET}`
- Server:
  - lay gia vang moi nhat
  - query rule active + cooldown (`last_notified_at`)
  - match dieu kien `gte/lte`
  - gui push den tat ca subscription active cua user
  - cap nhat `last_notified_at`

## B5. SW hien notification va xu ly click
- Trong `src/app/sw.ts` them:
  - listener `push` -> `self.registration.showNotification(...)`
  - listener `notificationclick` -> `clients.openWindow('/')`

---

## 5) API contract toi thieu

## 5.1 POST `/api/push/subscriptions`

Request:
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "base64...",
    "auth": "base64..."
  }
}
```

Response:
```json
{ "ok": true }
```

## 5.2 DELETE `/api/push/subscriptions`

Request:
```json
{ "endpoint": "https://fcm.googleapis.com/fcm/send/..." }
```

Response:
```json
{ "ok": true }
```

## 5.3 GET `/api/cron/check-alerts`

Header:
```txt
Authorization: Bearer <CRON_SECRET>
```

Response:
```json
{
  "ok": true,
  "checked_rules": 12,
  "sent_notifications": 4
}
```

---

## 6) Cach dung `web-push` toi gian (server)

```ts
import webpush from 'web-push'

webpush.setVapidDetails(
  process.env.WEB_PUSH_SUBJECT!,
  process.env.WEB_PUSH_PUBLIC_KEY!,
  process.env.WEB_PUSH_PRIVATE_KEY!
)

await webpush.sendNotification(
  {
    endpoint,
    keys: { p256dh, auth }
  },
  JSON.stringify({
    title: 'Canh bao gia vang',
    body: 'SJC ban ra da cham nguong ban dat.',
    url: '/'
  })
)
```

Luu y quan trong:
- `setVapidDetails` chi can cau hinh 1 lan.
- Bat loi `404/410` de vo hieu hoa subscription trong DB.

---

## 7) Cach dung Serwist/Turbopack trong flow push

- `createSerwistRoute(...)` tao route SW build output (`/serwist/sw.js`).
- `SerwistProvider` dam bao app register SW.
- `sw.ts` la noi xu ly:
  - cache/offline (da co)
  - push event + notification click (can bo sung).

---

## 8) Checklist test nhanh

1. Dang nhap, tao 1 rule active.
2. Bam "Bat Push", browser tra `granted`.
3. Kiem tra DB co ban ghi trong `push_subscriptions`.
4. Trigger thu cong `/api/cron/check-alerts`.
5. Nhan notification tren thiet bi.
6. Bam vao notification -> mo app `/`.
7. Thu xoa subscription tren browser, gui lai:
   - server nhan `404/410`
   - DB update `is_active=false`.

---

## 9) Nguyen tac giu he thong don gian

- Chi 1 cron endpoint, khong can queue cho MVP.
- Cooldown dung `last_notified_at` de chong spam.
- Subscription la theo thiet bi/browser, khong gan tung rule.
- Mo rong sau: quiet hours, daily limit, notification_logs.
