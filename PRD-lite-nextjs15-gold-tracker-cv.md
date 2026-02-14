# PRD-Lite (1 trang) - Gold Tracker VN cho CV

## 1) Muc tieu project
Xay dung mot web app ca nhan bang Next.js de show tren CV:
- Fullstack voi Next.js (FE + BE cung 1 codebase)
- Performance tot (Lighthouse/Core Web Vitals)
- PWA chuan (installable + offline)

Project uu tien don gian, de lam nhanh trong 2-4 ngay.

---

## 2) Pham vi MVP (don gian)
### In scope
1. Dashboard gia vang trong nuoc (SJC, DOJI, PNJ).
2. Tu dong cap nhat gia moi 3 giay.
3. UI mobile-first, responsive, dark mode.
4. PWA:
   - Co manifest + service worker
   - Cai duoc len home screen
   - Offline van mo duoc app va xem gia lan cuoi
5. Trang/About hoac README co screenshot + diem Lighthouse de show CV.

### Out of scope (de giu nhe)
- Dang nhap/phan quyen user.
- Alert push phuc tap voi rule engine.
- Admin panel.

---

## 3) Kien truc de xuat (rat gon)
### Frontend
- Next.js App Router + React.
- Mot trang chinh hien bang gia, mau tang/giam, timestamp cap nhat.

### Backend trong Next.js
- Dung Route Handler: `GET /api/gold/latest`
- Server goi `https://vapi.vnappmob.com/api/v2/gold/{brand}`
- Header auth: `Authorization: Bearer <api_key>`
- Chuan hoa du lieu tra ve cho client.

### Polling
- Client fetch `/api/gold/latest` moi 3000ms.
- Co retry nhe khi loi mang.

### PWA + Offline
- Cache app shell (HTML/CSS/JS/icon).
- Cache response gia moi nhat (Network First + cache fallback).
- Neu offline: hien thi du lieu cuoi cung + badge "offline".

---

## 4) Can database rieng khong?
### Quyet dinh MVP: KHONG CAN DB
Ly do:
1. Project CV can nhanh, gon, de trinh dien.
2. Chi can xem gia realtime + offline cache la du.
3. Preferences co the luu local (`localStorage`/IndexedDB).

### Khi nao moi can DB?
- Khi can luu alert cua user, push subscription, lich su gia dai han.
- Neu muon lam phase 2, co the them Postgres/Supabase sau.

---

## 5) Next.js co lam duoc ca BE va FE khong?
### Co, day la lua chon phu hop cho case nay
- FE: UI, state, polling, render.
- BE: API proxy trong `app/api/*` de giu an toan `api_key`.
- Cung deployment 1 noi (Vercel), don gian cho project ca nhan.

---

## 6) Yeu cau ky thuat toi thieu
1. Khong expose `api_key` tren client.
2. Co loading/error/empty state.
3. Mobile-first: man hinh 360px van dung tot.
4. PWA install thanh cong tren Android/Chrome.
5. Offline mo duoc va thay snapshot cuoi.

---

## 7) KPI de show tren CV
1. Lighthouse Performance >= 90 (mobile).
2. PWA checklist dat cac muc co ban (installable, offline start_url).
3. Time to first data < 2.5s (mang 4G mo phong).

---

## 8) Ke hoach thuc hien (goi y 3 buoc)
1. Buoc 1: UI + API proxy + polling 3s.
2. Buoc 2: PWA manifest + service worker + offline cache.
3. Buoc 3: Tune performance + them README showcase (anh, diem, tech stack).

---

## 9) Definition of Done (MVP)
- Chay duoc local va deploy production.
- Gia SJC/DOJI/PNJ cap nhat moi 3s.
- Co nut/cach install PWA.
- Offline van hien duoc du lieu lan cuoi.
- README co link live + screenshot + diem Lighthouse.

