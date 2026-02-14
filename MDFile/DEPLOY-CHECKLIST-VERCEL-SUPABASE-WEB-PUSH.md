# Deploy Checklist - Vercel + Supabase + Web Push

Use checklist nay de deploy MVP an toan va khong sot buoc.

---

## A) Supabase setup
- [ ] Tao Supabase project moi.
- [ ] Vao SQL Editor, run file `SUPABASE-SCHEMA-SQL.md`.
- [ ] Vao Authentication -> URL Configuration:
  - [ ] Site URL: `https://<your-domain>`
  - [ ] Additional Redirect URLs:
    - `http://localhost:3000/**`
    - `https://<your-domain>/**`
- [ ] Luu lai:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (server only)

---

## B) Google OAuth setup (cho Supabase Auth)

### B1. Google Cloud Console
- [ ] Tao OAuth Client ID (Web application).
- [ ] Authorized redirect URI:
  - [ ] `https://<supabase-project-ref>.supabase.co/auth/v1/callback`
- [ ] Lay `Google Client ID` + `Google Client Secret`.

### B2. Supabase Auth Provider
- [ ] Vao Authentication -> Providers -> Google -> Enable.
- [ ] Paste Client ID/Secret tu Google.
- [ ] Save.

### B3. App test auth
- [ ] Login Google thanh cong o local.
- [ ] Login Google thanh cong o production.
- [ ] Logout va login lai khong loi callback.

---

## C) Vercel project setup
- [ ] Import GitHub repo vao Vercel.
- [ ] Framework auto-detect: Next.js.
- [ ] Them Environment Variables (Production + Preview):
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `VAPI_GOLD_API_KEY`
  - [ ] `NEXT_PUBLIC_APP_URL` (vd: `https://<your-domain>`)
  - [ ] `WEB_PUSH_PUBLIC_KEY`
  - [ ] `WEB_PUSH_PRIVATE_KEY`
  - [ ] `CRON_SECRET`
- [ ] Redeploy sau khi add env.

---

## D) Web Push setup

### D1. Tao VAPID keys (local)
Chay mot lan:
```bash
npx web-push generate-vapid-keys
```

- [ ] Gan `publicKey` -> `WEB_PUSH_PUBLIC_KEY`
- [ ] Gan `privateKey` -> `WEB_PUSH_PRIVATE_KEY`

### D2. Browser requirements
- [ ] Site chay HTTPS (production).
- [ ] Service worker register thanh cong.
- [ ] User cap quyen notifications (granted).

### D3. Push flow test
- [ ] Login Google.
- [ ] Subscribe push thanh cong (subscription luu vao Supabase).
- [ ] Tao 1 alert rule nguong gia.
- [ ] Goi API test push (hoac trigger cron) va nhan thong bao that.

---

## E) Cron/job setup cho alert push
Ban co 2 cach, chon 1:

### Cach 1 (de nhat): Vercel Cron + Next.js API Route
- [ ] Tao route: `GET /api/cron/check-alerts` (check `CRON_SECRET`).
- [ ] Trong route:
  - [ ] Doc alert active tu Supabase bang service role.
  - [ ] Goi gia moi nhat.
  - [ ] Match dieu kien alert.
  - [ ] Gui web push.
  - [ ] Ghi `notification_logs`.
- [ ] Tao `vercel.json`:
```json
{
  "crons": [
    { "path": "/api/cron/check-alerts", "schedule": "*/2 * * * *" }
  ]
}
```

### Cach 2: Supabase Edge Function + pg_cron
- [ ] Viet edge function check-alerts.
- [ ] Tao scheduler trigger dinh ky.
- [ ] Dam bao env va web push libs available.

---

## F) PWA + Offline verification
- [ ] Co `manifest.webmanifest` hop le.
- [ ] Co icons 192x192 va 512x512.
- [ ] Service worker active.
- [ ] Offline test (Chrome DevTools -> Network Offline):
  - [ ] Reload van vao duoc app.
  - [ ] Hien snapshot gia cuoi + timestamp.
- [ ] Install test tren mobile (Add to Home Screen) thanh cong.

---

## G) Performance verification (de show CV)
- [ ] Chay Lighthouse mobile (Production URL).
- [ ] Muc tieu:
  - [ ] Performance >= 90
  - [ ] Accessibility >= 90
  - [ ] Best Practices >= 90
  - [ ] PWA pass cac muc co ban
- [ ] Toi uu neu chua dat:
  - [ ] giam JS bundle
  - [ ] toi uu font/image/icon
  - [ ] tranh render lai khong can thiet

---

## H) Final smoke test truoc demo
- [ ] Dashboard cap nhat gia moi 3s.
- [ ] Login/Logout Google ok.
- [ ] Tao/sua/xoa alert ok.
- [ ] Push test ok.
- [ ] Offline mode ok.
- [ ] README co live URL + screenshot/GIF + Lighthouse score.

---

## I) Troubleshooting nhanh
1. Khong login duoc Google:
   - Check redirect URI trong Google Cloud va Supabase.
2. Push khong toi:
   - Check Notification permission = granted.
   - Check VAPID keys da set dung env.
   - Check subscription co trong DB.
3. Cron chay nhung khong gui:
   - Check `CRON_SECRET`, logs route, va query alert active.
4. Offline khong hien data:
   - Check cache strategy Network First + fallback da luu response.

