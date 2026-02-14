# PRD-Lite v2 (1 trang) - Gold Tracker VN cho CV

## 1) Muc tieu
Xay dung mot website dep, muot, hieu suat cao bang **Next.js 16** de show tren CV, dong thoi trinh dien cac tinh nang "kho":
- Dang nhap Google (Supabase Auth)
- Push notification theo nguong gia
- PWA installable + offline mode

Muc tieu la MVP gon, lam duoc trong 5-7 ngay, nhung van "impressive" khi demo.

---

## 2) Cong nghe chot
- **Next.js 16** (App Router, Route Handlers) - fullstack FE + BE trong 1 project.
- **shadcn/ui + Tailwind CSS** - giao dien hien dai, responsive, mobile-first.
- **TanStack Query** - polling 3s, cache, retry, stale handling.
- **Supabase**:
  - Auth (Google OAuth)
  - Postgres (alerts + push subscriptions + user settings)
  - (Tuy chon) Edge Function/Cron de xu ly push theo lich
- **PWA**: manifest + service worker + cache strategy.
- Nguon gia: `https://vapi.vnappmob.com/api/v2/gold/*` (goi qua BE route de an API key).

---

## 3) Pham vi MVP
### In scope
1. Dashboard gia vang (SJC/DOJI/PNJ), cap nhat moi 3 giay.
2. Google Login/Logout bang Supabase Auth.
3. User tao/sua/xoa alert nguong gia (>= hoac <=).
4. Push notification khi gia dat nguong (khi user da subscribe).
5. PWA:
   - Install len home screen
   - Mo duoc khi offline
   - Hien snapshot gia gan nhat + timestamp
6. UI dep va muot:
   - Dark/Light mode
   - Skeleton/loading state
   - Smooth transition nhe

### Out of scope (giu project gon)
- Trading/mua ban vang.
- Admin panel.
- He thong phan quyen phuc tap (chi user thuong).

---

## 4) Kien truc ngan gon
1. Client (Next.js + shadcn + TanStack Query) goi `/api/gold/latest`.
2. Route Handler trong Next.js goi vapi va tra ve schema da chuan hoa.
3. Supabase luu:
   - profile/user settings
   - alert rules
   - push subscriptions
4. Service Worker quan ly cache offline + nhan push.
5. Job dinh ky (cron) check gia va gui web push neu dat dieu kien alert.

---

## 5) Data model toi thieu (Supabase)
1. `profiles`
   - id (auth user id), display_name, created_at
2. `alert_rules`
   - id, user_id, brand, field(buy/sell), condition(gte/lte), threshold, is_active, created_at
3. `push_subscriptions`
   - id, user_id, endpoint, p256dh, auth, is_active, created_at
4. (Tuy chon) `price_snapshots`
   - id, brand, buy_price, sell_price, fetched_at (de debug/analytics)

---

## 6) Yeu cau quan trong de show CV
1. **Bao mat**: API key vapi chi nam o server env, khong lo tren client.
2. **Performance**:
   - Lighthouse mobile >= 90
   - LCP <= 2.5s
   - INP <= 200ms
3. **PWA**:
   - Installable
   - Offline start_url thanh cong
   - App shell cache + API fallback cache
4. **Push**:
   - User login Google -> subscribe push -> tao alert -> nhan push that.

---

## 7) Lo trinh 4 buoc (thuc te)
1. Setup stack (Next.js 16, shadcn, TanStack Query, Supabase Auth Google).
2. Lam dashboard + API route + polling 3s + responsive UI.
3. Them PWA/offline (manifest, service worker, cache strategy).
4. Them alerts + push flow + tune performance + README showcase.

---

## 8) KPI va Definition of Done
### KPI de dua vao CV
- Lighthouse Performance >= 90 (mobile)
- PWA pass cac muc co ban (install + offline)
- Login Google + push alert demo thanh cong tren production

### Done khi:
- Deploy production on Vercel.
- Login Google chay on/off duoc.
- Gia vang cap nhat moi 3s tren dashboard.
- User tao alert va nhan push khi dat nguong.
- Offline van xem duoc snapshot cuoi.
- README co: live URL, screenshot, GIF demo, tech stack, ket qua Lighthouse.

