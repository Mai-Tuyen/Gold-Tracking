# VPS Cron Setup (No Vercel)

This project no longer uses Vercel Cron.
Use your VPS scheduler (Linux `crontab`) to trigger:

- `GET /api/cron/check-alerts`
- Header: `Authorization: Bearer <CRON_SECRET>`

## 1) Keep env on VPS

```env
CRON_SECRET=your-secret
CRON_APP_URL=https://your-domain.com
```

`CRON_APP_URL` can be public domain or local reverse-proxy URL.

## 2) One-time test

Run on VPS:

```bash
npm run cron:check-once
```

If success, output looks like:

```txt
[cron] success 2026-03-05T... {"ok":true,"checked_rules":...,"sent_notifications":...}
```

## 3) Add Linux crontab

Open crontab:

```bash
crontab -e
```

Run every minute:

```cron
* * * * * cd /path/to/gold-tracking && /usr/bin/env CRON_SECRET=your-secret CRON_APP_URL=http://127.0.0.1:3000 npm run cron:check-once >> /var/log/gold-tracking-cron.log 2>&1
```

## 4) Alternative with curl

```cron
* * * * * curl -sS -H "Authorization: Bearer your-secret" http://127.0.0.1:3000/api/cron/check-alerts >> /var/log/gold-tracking-cron.log 2>&1
```

## 5) Notes

- Make sure `next start` is running before cron triggers.
- Keep `CRON_SECRET` same value for app and cron.
- Use UTC or configure server timezone as needed.
