# Supabase Schema SQL (ban don gian)

Schema nay chi giu phan can thiet cho 4 tinh nang:
1. Dang nhap Google (dung Supabase Auth san co trong `auth.users`)
2. Goi API gia vang (khong can bang rieng)
3. PWA offline xem gia gan nhat (luu tren client cache/IndexedDB, khong can bang)
4. Push notification theo muc gia user dat (can 2 bang duoi day)

---

## 1) SQL script (copy-paste vao Supabase SQL Editor)
```sql
begin;

create extension if not exists pgcrypto;

-- 1) Alert rules: nguong gia ma user dat
create table if not exists public.alert_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand text not null check (brand in ('sjc', 'doji', 'pnj')),
  price_field text not null check (price_field in ('buy', 'sell')),
  operator text not null check (operator in ('gte', 'lte')),
  target_price numeric(14,2) not null check (target_price > 0),
  is_active boolean not null default true,
  last_notified_at timestamptz,
  created_at timestamptz not null default now()
);

-- 2) Push subscriptions: endpoint cua trinh duyet de gui web push
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

-- Index nhe de query nhanh hon
create index if not exists idx_alert_rules_user_active
  on public.alert_rules (user_id, is_active);

create index if not exists idx_alert_rules_match
  on public.alert_rules (brand, price_field, is_active);

create index if not exists idx_push_subscriptions_user_active
  on public.push_subscriptions (user_id, is_active);

-- RLS
alter table public.alert_rules enable row level security;
alter table public.push_subscriptions enable row level security;

-- alert_rules policies (user chi thay/sua du lieu cua minh)
drop policy if exists "alert_rules_select_own" on public.alert_rules;
create policy "alert_rules_select_own"
on public.alert_rules
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "alert_rules_insert_own" on public.alert_rules;
create policy "alert_rules_insert_own"
on public.alert_rules
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "alert_rules_update_own" on public.alert_rules;
create policy "alert_rules_update_own"
on public.alert_rules
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "alert_rules_delete_own" on public.alert_rules;
create policy "alert_rules_delete_own"
on public.alert_rules
for delete
to authenticated
using (auth.uid() = user_id);

-- push_subscriptions policies
drop policy if exists "push_subscriptions_select_own" on public.push_subscriptions;
create policy "push_subscriptions_select_own"
on public.push_subscriptions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "push_subscriptions_insert_own" on public.push_subscriptions;
create policy "push_subscriptions_insert_own"
on public.push_subscriptions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "push_subscriptions_update_own" on public.push_subscriptions;
create policy "push_subscriptions_update_own"
on public.push_subscriptions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "push_subscriptions_delete_own" on public.push_subscriptions;
create policy "push_subscriptions_delete_own"
on public.push_subscriptions
for delete
to authenticated
using (auth.uid() = user_id);

commit;
```

---

## 2) Quick verify
```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('alert_rules', 'push_subscriptions')
order by table_name;
```

```sql
select schemaname, tablename, policyname
from pg_policies
where schemaname = 'public'
  and tablename in ('alert_rules', 'push_subscriptions')
order by tablename, policyname;
```

---

## 3) Ghi chu su dung
1. Google login khong can bang `profiles` neu ban muon giu don gian.
2. Offline gia vang gan nhat nen luu o client (Service Worker + Cache/IndexedDB).
3. Cron/backend de gui push nen dung `SUPABASE_SERVICE_ROLE_KEY` (server only).

