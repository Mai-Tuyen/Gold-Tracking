# Implementation Plan (5-7 ngay) - Gold Tracker VN

## Muc tieu
Ship MVP "CV-ready" voi stack:
- Next.js 16 + shadcn/ui + TanStack Query
- Supabase (Google Auth + Postgres)
- PWA (install + offline)
- Push notification theo nguong gia

Tong thoi gian: 5-7 ngay (co the gom task vao 5 ngay neu tap trung cao).

---

## Day 1 - Project setup + UI foundation
### Viec can lam
1. Khoi tao project Next.js 16 (TypeScript, App Router).
2. Cai dat shadcn/ui + Tailwind + base theme.
3. Setup layout mobile-first:
   - Header, tabs/filter, table/cards gia.
   - Dark/light mode toggle.
4. Cai dat TanStack Query provider.
5. Setup lint/format + env template (`.env.example`).

### Deliverable
- UI shell dep, responsive, chay duoc tren mobile viewport.
- Co structure component ro rang (ui/, features/, lib/).

### Definition done Day 1
- `npm run build` pass.
- Trang home render nhanh, khong loi console.

---

## Day 2 - Gold data pipeline + polling 3s
### Viec can lam
1. Tao Route Handler `GET /api/gold/latest`.
2. Route handler goi vapi endpoints (SJC/DOJI/PNJ) va chuan hoa response.
3. Bao mat API key o server env (khong expose client).
4. TanStack Query:
   - `refetchInterval: 3000`
   - retry/coalesce state loading-error-success
5. Hien thi:
   - buy/sell
   - diff/tang-giam
   - `last_updated`

### Deliverable
- Dashboard cap nhat data moi 3s on-screen.

### Definition done Day 2
- Network tab khong lo API key.
- Refresh/polling on dinh.

---

## Day 3 - Supabase Auth (Google) + schema
### Viec can lam
1. Tao Supabase project.
2. Bat Google OAuth.
3. Tich hop Supabase Auth vao Next.js:
   - login/logout
   - user session state
4. Run SQL schema (profiles, alert_rules, push_subscriptions, user_settings, policies RLS).
5. Tao trang `Settings`/`Alerts` co guard theo user da dang nhap.

### Deliverable
- Dang nhap Google hoat dong local + production.
- DB schema san sang luu alert/push subscription.

### Definition done Day 3
- User dang nhap thanh cong, profile record tao tu dong.
- RLS chan du lieu user khac.

---

## Day 4 - Alerts CRUD + push subscription flow
### Viec can lam
1. Tao UI CRUD alert (brand, field, condition, threshold).
2. Tao API route cho create/update/delete alert.
3. Service Worker:
   - register thanh cong
   - subscribe push (VAPID)
4. Luu push subscription vao Supabase.
5. Tao route test push (`POST /api/push/test`).

### Deliverable
- User tao alert va subscribe push duoc.
- Gui push test hien tren thiet bi.

### Definition done Day 4
- Permission flow hoat dong dung (default -> granted/denied).
- Co thong bao test push end-to-end.

---

## Day 5 - PWA + Offline mode
### Viec can lam
1. Them `manifest.webmanifest` + icons.
2. Setup service worker cache strategy:
   - App shell: Cache First
   - Gold API: Network First + fallback cache
3. Offline UX:
   - banner offline
   - hien snapshot cuoi + timestamp
4. Test install prompt va behavior tren mobile.

### Deliverable
- App installable va dung duoc khi mat mang.

### Definition done Day 5
- Offline reload van vao duoc app.
- Van thay du lieu gia lan cuoi.

---

## Day 6 (optional, rat nen co) - Push automation + hardening
### Viec can lam
1. Tao cron job (`/api/cron/check-alerts`) moi 1-5 phut:
   - Doc alert active
   - Lay gia moi
   - Match condition
   - Gui web push
2. Them notification_logs de debug.
3. Rate limit/coalesce de tranh spam push.
4. Error handling + monitoring logs.

### Deliverable
- Push alert that theo nguong user da set.

### Definition done Day 6
- Co it nhat 1 case alert that da gui thanh cong.

---

## Day 7 (optional) - Performance tune + CV showcase
### Viec can lam
1. Tune Core Web Vitals:
   - optimize image/icon/font
   - reduce JS and rerender
2. Chay Lighthouse mobile.
3. Viet README showcase:
   - architecture diagram
   - screenshot/GIF
   - tech stack
   - benchmark (Lighthouse score)

### Deliverable
- Ban release "CV-ready".

### Definition done Day 7
- Lighthouse Performance >= 90 (mobile).
- README ro rang, de recruiter review nhanh 2-3 phut.

---

## Milestone checklist tong ket
- [ ] Login Google thanh cong (Supabase Auth)
- [ ] Gold dashboard polling 3s
- [ ] Alerts CRUD + luu Supabase
- [ ] Push subscription + test push
- [ ] PWA installable + offline snapshot
- [ ] Cron push alert theo nguong
- [ ] Lighthouse >= 90 + README demo

