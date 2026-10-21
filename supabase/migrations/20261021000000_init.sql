-- only us — initial schema.
-- Run once in Supabase → SQL Editor (paste the whole file, then Run).
-- Safe to re-run: it skips anything that already exists.

-- ---------------------------------------------------------------------------
-- Members: exactly the two of us. A row here is what grants access.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  time_zone text not null default 'Asia/Kolkata',
  created_at timestamptz not null default now()
);

create or replace function public.is_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()))
$$;

-- ---------------------------------------------------------------------------
-- Shared settings (single row).
-- ---------------------------------------------------------------------------
create table if not exists public.couple (
  id boolean primary key default true check (id),
  together_since date
);

-- ---------------------------------------------------------------------------
-- Messages. Hugs, nudges, stickers etc. are messages with a different kind.
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('text', 'photo', 'voice', 'sticker', 'hug', 'nudge')),
  body text,
  meta jsonb not null default '{}'::jsonb,
  reply_to uuid references public.messages (id) on delete set null,
  created_at timestamptz not null default now(),
  seen_at timestamptz
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security: nothing is readable unless you are one of the two.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.couple enable row level security;
alter table public.messages enable row level security;

revoke all on public.profiles, public.couple, public.messages from anon;

drop policy if exists "members read profiles" on public.profiles;
create policy "members read profiles" on public.profiles
  for select to authenticated using ((select public.is_member()));

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "members read couple" on public.couple;
create policy "members read couple" on public.couple
  for select to authenticated using ((select public.is_member()));

drop policy if exists "members update couple" on public.couple;
create policy "members update couple" on public.couple
  for update to authenticated using ((select public.is_member())) with check ((select public.is_member()));

drop policy if exists "members read messages" on public.messages;
create policy "members read messages" on public.messages
  for select to authenticated using ((select public.is_member()));

drop policy if exists "members send messages" on public.messages;
create policy "members send messages" on public.messages
  for insert to authenticated
  with check ((select public.is_member()) and sender_id = (select auth.uid()));

-- Only the receiver may update a message, and only its seen_at (column grant below).
drop policy if exists "receiver marks seen" on public.messages;
create policy "receiver marks seen" on public.messages
  for update to authenticated
  using ((select public.is_member()) and sender_id <> (select auth.uid()))
  with check ((select public.is_member()) and sender_id <> (select auth.uid()));

drop policy if exists "sender deletes own" on public.messages;
create policy "sender deletes own" on public.messages
  for delete to authenticated using (sender_id = (select auth.uid()));

revoke update on public.messages from authenticated;
grant update (seen_at) on public.messages to authenticated;

-- ---------------------------------------------------------------------------
-- Realtime: stream new messages and seen updates to both phones.
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Seed: one profile per existing user (the two accounts created in the
-- dashboard), named after the part of the email before "@".
-- ---------------------------------------------------------------------------
insert into public.profiles (id, display_name)
select id, split_part(email, '@', 1) from auth.users
on conflict (id) do nothing;

insert into public.couple (id) values (true) on conflict (id) do nothing;
