-- only us — push notification subscriptions.
-- Run once in Supabase → SQL Editor (paste the whole file, then Run). Safe to re-run.
--
-- One row per device that turned notifications on. The Cloudflare Worker reads
-- the partner's rows (with the sender's own login, so RLS still applies) and
-- sends each device a Web Push message.

create table if not exists public.push_subscriptions (
  endpoint text primary key,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from anon;

-- Both of us can read every subscription: sending a notification to the other
-- person needs their device addresses.
drop policy if exists "members read subscriptions" on public.push_subscriptions;
create policy "members read subscriptions" on public.push_subscriptions
  for select to authenticated using ((select public.is_member()));

drop policy if exists "add own subscription" on public.push_subscriptions;
create policy "add own subscription" on public.push_subscriptions
  for insert to authenticated
  with check ((select public.is_member()) and user_id = (select auth.uid()));

drop policy if exists "update own subscription" on public.push_subscriptions;
create policy "update own subscription" on public.push_subscriptions
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Either of us may remove a subscription: the sender cleans up devices the push
-- service reports as gone.
drop policy if exists "members remove subscriptions" on public.push_subscriptions;
create policy "members remove subscriptions" on public.push_subscriptions
  for delete to authenticated using ((select public.is_member()));
