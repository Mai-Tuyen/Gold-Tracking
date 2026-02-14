# Supabase Schema SQL (copy-paste runnable)

Su dung file nay trong Supabase SQL Editor.

## 1) SQL script
```sql
-- =========================================
-- Gold Tracker VN - Supabase schema v1
-- =========================================

begin;

-- 0) Extensions
create extension if not exists pgcrypto;

-- 1) Tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  favorite_brands text[] not null default array['sjc','doji','pnj']::text[],
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  push_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alert_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand text not null check (brand in ('sjc', 'doji', 'pnj')),
  field text not null check (field in ('buy', 'sell')),
  condition text not null check (condition in ('gte', 'lte')),
  threshold numeric(14,2) not null check (threshold > 0),
  is_active boolean not null default true,
  last_triggered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  is_active boolean not null default true,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

-- Optional but useful for debugging and CV demo
create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  alert_rule_id uuid references public.alert_rules(id) on delete set null,
  title text not null,
  body text not null,
  sent_at timestamptz not null default now(),
  status text not null default 'sent' check (status in ('sent', 'failed')),
  error_message text
);

-- 2) Indexes
create index if not exists idx_alert_rules_user_active
  on public.alert_rules (user_id, is_active);

create index if not exists idx_alert_rules_brand_field_active
  on public.alert_rules (brand, field, is_active);

create index if not exists idx_push_subscriptions_user_active
  on public.push_subscriptions (user_id, is_active);

create index if not exists idx_notification_logs_user_sent_at
  on public.notification_logs (user_id, sent_at desc);

-- 3) Generic updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 4) Attach updated_at triggers
drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_user_settings_set_updated_at on public.user_settings;
create trigger trg_user_settings_set_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_alert_rules_set_updated_at on public.alert_rules;
create trigger trg_alert_rules_set_updated_at
before update on public.alert_rules
for each row execute function public.set_updated_at();

drop trigger if exists trg_push_subscriptions_set_updated_at on public.push_subscriptions;
create trigger trg_push_subscriptions_set_updated_at
before update on public.push_subscriptions
for each row execute function public.set_updated_at();

-- 5) Auto-create profile + settings after signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 6) Row Level Security
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.alert_rules enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.notification_logs enable row level security;

-- profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- user_settings policies
drop policy if exists "user_settings_select_own" on public.user_settings;
create policy "user_settings_select_own"
on public.user_settings
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "user_settings_insert_own" on public.user_settings;
create policy "user_settings_insert_own"
on public.user_settings
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own"
on public.user_settings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- alert_rules policies
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

-- notification_logs policies
drop policy if exists "notification_logs_select_own" on public.notification_logs;
create policy "notification_logs_select_own"
on public.notification_logs
for select
to authenticated
using (auth.uid() = user_id);

commit;
```

---

## 2) Quick verify (sau khi run SQL)
Chay cac query sau de check:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('profiles', 'user_settings', 'alert_rules', 'push_subscriptions', 'notification_logs')
order by table_name;
```

```sql
select schemaname, tablename, policyname
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'user_settings', 'alert_rules', 'push_subscriptions', 'notification_logs')
order by tablename, policyname;
```

---

## 3) Luu y khi dung trong app
1. Client-side query su dung `anon key` + session user (RLS se bao ve du lieu).
2. Server cron/push sender nen dung `service_role key` (khong dua ra client).
3. `notification_logs` la optional, nhung rat huu ich de demo va debug push flow.

