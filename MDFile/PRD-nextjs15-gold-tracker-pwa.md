# PRD - Website theo doi gia vang trong nuoc (Next.js 15 + PWA)

## 1) Thong tin tai lieu
- Ten san pham: **Gold Tracker VN (web app)**
- Muc tieu phien ban: **MVP v1**
- Nen tang: **Next.js 15 (App Router), PWA**
- Nguon du lieu gia vang: **https://vapi.vnappmob.com/**
- Trang thai: Draft de thao luan
- Ngon ngu noi dung: Tieng Viet

---

## 2) Boi canh va van de
Nguoi dung can theo doi gia vang trong nuoc (SJC, DOJI, PNJ...) lien tuc trong ngay, nhung:
- Nguon gia phan tan, cap nhat khong dong nhat.
- Kiem tra thu cong ton thoi gian.
- Khi mat mang thi khong xem duoc gia gan nhat.
- Chua co trai nghiem app-like tren mobile (cai dat, thong bao day, hoat dong offline).

San pham can giai quyet van de tren bang mot web app hien dai, mobile-first, cap nhat realtime 3 giay/lan, co PWA, offline mode va push notification.

---

## 3) Muc tieu san pham
### 3.1 Muc tieu kinh doanh
1. Tao diem den tin cay de theo doi gia vang trong nuoc theo thoi gian thuc.
2. Tang tan suat quay lai nhan nho push notification va install PWA.
3. Dat trai nghiem nhanh, muot tren mobile.

### 3.2 Muc tieu nguoi dung
1. Xem duoc gia mua/ban moi nhat cua cac thuong hieu trong <= 1 thao tac.
2. Nhan canh bao khi gia dat nguong quan tam.
3. Van xem duoc du lieu gan nhat khi offline.

### 3.3 Chi so thanh cong (MVP)
- Time to first data < 2.5s tren 4G trung binh.
- Ty le update thanh cong moi chu ky 3s >= 99% (khi online).
- Ty le cho phep push >= 25% nguoi dung active.
- Ty le install PWA >= 15% nguoi dung mobile active.
- Session trung binh >= 3 phut.

---

## 4) Pham vi
### 4.1 In scope (MVP)
1. Dashboard gia vang realtime (polling 3s/lan).
2. Theo doi it nhat 3 nguon: SJC, DOJI, PNJ (mo rong sau).
3. Hien thi gia mua/ban + chenhlech + xu huong tang/giam.
4. Loc/sap xep nhanh theo thuong hieu, khu vuc (neu du lieu co).
5. PWA installable (manifest + service worker).
6. Offline mode: doc du lieu gan nhat da cache.
7. Push notification:
   - Alert theo nguong gia do nguoi dung cai dat.
   - Alert bien dong manh (% thay doi trong khoang thoi gian).
8. Cai dat nguoi dung: don vi hien thi, thuong hieu yeu thich, bat/tat thong bao.

### 4.2 Out of scope (MVP)
- Giao dich mua ban vang.
- Tu van dau tu tai chinh.
- Dang nhap phuc tap social SSO (co the them o phase 2).
- Lich su nhieu nam (MVP chi can lich su ngan han de ve chart trong ngay).

---

## 5) Doi tuong nguoi dung (Personas)
1. **Nguoi theo doi gia hang ngay (Retail watcher)**
   - Muc tieu: xem nhanh gia mua/ban, doi chieu SJC-DOJI-PNJ.
2. **Nguoi cho diem mua (Opportunity hunter)**
   - Muc tieu: dat nguong gia va nhan push ngay khi cham nguong.
3. **Nguoi dung mobile thuong xuyen di chuyen**
   - Muc tieu: truy cap nhanh nhu app, co du lieu khi mang yeu/mat mang.

---

## 6) User stories chinh
1. La nguoi dung, toi muon mo app va thay ngay gia vang moi nhat trong < 3 giay.
2. La nguoi dung, toi muon du lieu tu dong cap nhat moi 3 giay.
3. La nguoi dung, toi muon dat canh bao "Bao khi SJC ban ra <= X".
4. La nguoi dung, toi muon nhan push ngay ca khi khong mo trang.
5. La nguoi dung, toi muon van xem gia gan nhat neu offline.
6. La nguoi dung, toi muon cai web len man hinh chinh nhu app.

---

## 7) Yeu cau chuc nang chi tiet

## 7.1 Data realtime
### Nguon API ngoai
- Co so: `https://vapi.vnappmob.com`
- Endpoint doc du lieu (GET):
  - `/api/v2/gold/sjc`
  - `/api/v2/gold/doji`
  - `/api/v2/gold/pnj`
- Xac thuc: `Authorization: Bearer <api_key>`
- Luu y nghiep vu:
  - `api_key` co han mac dinh 15 ngay (can co co che rotate/renew).
  - Khong expose key tren client.

### Quy tac cap nhat
1. Polling chu ky 3 giay/lan.
2. Moi chu ky fetch theo batch cho cac thuong hieu dang bat theo doi.
3. Neu tab an (Page Visibility hidden):
   - Van giu polling 3s trong 1-2 phut dau.
   - Sau do fallback 10-15s de tranh ton tai nguyen (co the tinh chinh theo yeu cau business).
4. Khi tab active lai: fetch ngay lap tuc.
5. Hien thi `last_updated` ro rang tren UI.

## 7.2 Dashboard va UI/UX
1. Mobile-first (uu tien man hinh 360-430px).
2. Layout gom:
   - Header (gia tri tong quan + trang thai ket noi)
   - Bang gia theo thuong hieu
   - Card chi tiet theo loai (buy/sell, spread, change)
   - Chart mini xu huong trong ngay
   - Khu vuc alerts cua toi
3. Mau sac:
   - Tang: xanh la
   - Giam: do
   - Trung tinh: xam
4. Hien thi skeleton/loading state, empty state, error state.
5. Hieu ung micro-interaction nhe, khong gay lag.

## 7.3 Loc, so sanh, uu tien
1. Loc theo thuong hieu (SJC/DOJI/PNJ...).
2. So sanh nhanh chenhlech gia ban giua cac thuong hieu.
3. Danh dau "yeu thich" de dua len dau danh sach.

## 7.4 Alert va push notification
### Loai canh bao
1. **Threshold alert**: gia mua/ban <= hoac >= nguong.
2. **Volatility alert**: bien dong vuot X% trong Y phut.
3. **Daily digest** (tuong lai gan): tong hop sang/toi.

### Luong nghiep vu push
1. User bat thong bao -> browser xin quyen.
2. Tao push subscription (Service Worker + VAPID).
3. Luu subscription + rule alert tren server.
4. Worker/job backend danh gia dieu kien alert theo chu ky.
5. Khi thoa dieu kien -> gui Web Push toi thiet bi.

### Noi dung push mau
- "SJC ban ra da giam xuong 88.5 trieu. Cham nguong ban dat."
- "DOJI tang 1.2% trong 20 phut qua."

## 7.5 Offline mode (bat buoc)
1. Cache app shell (HTML/CSS/JS/font/icon) de mo app khi khong mang.
2. Cache du lieu API moi nhat (theo thuong hieu) vao IndexedDB/Cache Storage.
3. Khi offline:
   - Hien thi snapshot cuoi cung + timestamp.
   - Banner "Ban dang offline".
4. Khi online tro lai:
   - Tu dong dong bo lai.
   - Refresh ngay du lieu moi.

## 7.6 Cai dat va ca nhan hoa
1. Chon thuong hieu mac dinh.
2. Cai dat nguong alert.
3. Bat/tat push notification.
4. Chon giao dien sang/toi (dark mode).

---

## 8) Yeu cau phi chuc nang (NFR)

## 8.1 Hieu nang
- LCP mobile <= 2.5s (mang 4G).
- CLS <= 0.1.
- INP <= 200ms.
- Kich thuoc bundle ban dau duoi 250KB gzip (muc tieu).

## 8.2 Do tin cay
- Uptime frontend >= 99.9%.
- Retry voi exponential backoff khi loi mang.
- Circuit breaker tam thoi neu API ngoai loi lien tuc.

## 8.3 Bao mat
1. API key Vapi chi duoc dung server-side (qua Next Route Handler/BFF).
2. Khong de lo key trong source map, request client, log.
3. Rate limit endpoint noi bo de tranh abuse.
4. Validate payload cho cac API tao/sua alert.

## 8.4 Kha nang truy cap (Accessibility)
- Dat muc WCAG AA cho contrast, focus ring, keyboard navigation.
- Aria-label day du cho control quan trong.

## 8.5 Tuong thich
- Chrome/Edge/Firefox/Safari ban gan day.
- iOS PWA push (iOS >= 16.4, can them vao home screen).

---

## 9) Kien truc de xuat (MVP)
1. **Frontend**: Next.js 15 App Router, React 19, UI component system.
2. **BFF layer (trong Next.js)**:
   - `/api/gold/*`: goi sang vapi.vnappmob.com kem Authorization header.
   - Chuan hoa response ve mot schema chung.
3. **Polling client**:
   - Hook `useGoldPrices()` voi interval 3000ms.
   - Quan ly stale data, reconnect va visibility.
4. **PWA**:
   - `manifest.webmanifest`
   - Service Worker (Workbox hoac next-pwa)
   - Cache strategy:
     - App shell: Cache First
     - API data: Network First + fallback cache moi nhat
5. **Push system**:
   - Web Push (VAPID keys)
   - API subscribe/unsubscribe
   - Job scheduler danh gia rule alert dinh ky
6. **Storage**:
   - MVP co the bat dau voi SQLite/Postgres cho alerts + subscriptions.
   - IndexedDB tren client cho offline snapshot + user preferences.

---

## 10) Data model draft
### 10.1 GoldPriceSnapshot
- id
- brand (sjc|doji|pnj)
- buy_price
- sell_price
- extra_fields (jsonb)
- source_timestamp
- fetched_at

### 10.2 UserAlert
- id
- user_id (hoac device_id neu chua login)
- brand
- field (buy|sell)
- condition (gte|lte)
- threshold_value
- is_active
- created_at
- updated_at

### 10.3 PushSubscription
- id
- user_id/device_id
- endpoint
- p256dh
- auth
- user_agent
- is_active
- created_at

---

## 11) API noi bo de xuat
1. `GET /api/gold/latest?brands=sjc,doji,pnj`
2. `GET /api/gold/history?brand=sjc&range=1d`
3. `POST /api/alerts`
4. `PATCH /api/alerts/:id`
5. `DELETE /api/alerts/:id`
6. `POST /api/push/subscribe`
7. `POST /api/push/unsubscribe`

---

## 12) Goi y tinh nang PWA "hay va phu hop"
1. **Install prompt thong minh**: chi hien khi user da co muc do engagement.
2. **Offline dashboard**: xem snapshot cuoi + nhan biet ro du lieu cu.
3. **Quick actions** (Android shortcut): "Mo SJC", "Mo Alerts".
4. **Background sync**: dong bo alert pending khi online lai.
5. **Push theo ngu canhan**: canh bao dung nhuong, khong spam.
6. **Quiet hours**: tat push khung gio nghi (VD 22:00-06:00).
7. **Badge/indicator**: thong bao co update moi (neu browser ho tro).
8. **Add to home screen education card**: huong dan ngan gon tren iOS.

---

## 13) Acceptance criteria (MVP)
1. User mo trang tren mobile, thay gia SJC/DOJI/PNJ va cap nhat moi 3 giay.
2. User co the cai PWA len home screen thanh cong.
3. User offline van mo duoc app va thay du lieu gan nhat + timestamp.
4. User tao duoc alert threshold va nhan push khi dat dieu kien.
5. API key khong xuat hien tren client request.
6. Trang dat cac nguong Core Web Vitals muc tieu co ban.

---

## 14) Test plan (MVP)
1. Unit test:
   - Chuan hoa du lieu tu 3 endpoint.
   - Rule engine alert (gte/lte, bien dong %).
2. Integration test:
   - BFF route -> vapi response -> frontend render.
3. E2E test:
   - Tao alert, mo phong thay doi gia, nhan push.
   - Chuyen offline/online va kiem tra fallback.
4. Performance test:
   - Thong luong polling 3s voi N nguoi dung dong thoi.
5. Security test:
   - Kiem tra khong lo api_key.
   - Input validation endpoint alerts/push.

---

## 15) Rui ro va giam thieu
1. **Rui ro quota/limit API vi polling 3s**
   - Giam thieu: batch request, visibility-aware polling, cache trung gian.
2. **API key het han sau 15 ngay**
   - Giam thieu: monitoring expiry, nhac rotate key, key vault.
3. **Push support khac nhau giua trinh duyet**
   - Giam thieu: fallback in-app alert + huong dan theo tung nen tang.
4. **Du lieu khong dong nhat giua cac thuong hieu**
   - Giam thieu: schema mapping linh hoat + log anomaly.

---

## 16) Lo trinh de xuat
### Phase 1 (1-2 tuan): Nen tang
- Setup Next.js 15, BFF proxy, dashboard co ban, polling 3s.

### Phase 2 (1-2 tuan): PWA + offline
- Manifest, service worker, cache strategy, offline snapshot.

### Phase 3 (1-2 tuan): Alerts + push
- Rule engine, subscription, web push, cai dat alert.

### Phase 4 (toi uu)
- Performance tuning, A/B install prompt, analytics KPI.

---

## 17) Cac diem can chot de implement
1. Co bat buoc dang nhap hay cho phep theo device anonymous?
2. Nguong tan suat push toi da moi ngay de tranh spam?
3. Uu tien thuong hieu nao ngoai SJC/DOJI/PNJ cho phase sau?
4. Muc tieu chinh: toc do cap nhat hay toi uu chi phi API?
5. Co can trang admin de quan ly thong bao he thong khong?

---

## 18) Dinh nghia hoan thanh (Definition of Done)
1. Hoan thanh tat ca acceptance criteria MVP.
2. Co tai lieu runbook cho rotate api_key va push keys.
3. Co dashboard monitoring loi API, ty le push thanh cong.
4. Co tai lieu handover ky thuat + huong dan van hanh.

