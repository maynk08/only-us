# Setup

One-time setup for the backend (Supabase) and hosting (Cloudflare). Everything
is on free plans. Dashboard menu names drift over time — if a label differs
slightly, look for the closest match.

Values that are **safe to share or commit**: Supabase project URL, publishable
(`sb_publishable_…`) key. **Never share or commit**: the database password, the
secret (`sb_secret_…` / service_role) key.

## 1. Supabase

Already done:

- Project created in **South Asia (Mumbai)** — ref `laywfuhtlcbhencsmrnb`.
- Public sign-ups turned off; two users created with **Auto Confirm User**.

### 1a. Create the database tables

1. Open **SQL Editor → New query**.
2. Paste the whole of
   [`supabase/migrations/20261021000000_init.sql`](../supabase/migrations/20261021000000_init.sql)
   and click **Run**. It should finish with "Success. No rows returned".
3. Check: **Table Editor** now shows `profiles`, `couple` and `messages`, and
   `profiles` has **two rows** (one per user).

### 1b. Set names, her time zone and your start date

In **SQL Editor**, run this (edit the values in quotes first):

```sql
-- Which login is hers? Use the name before "@" in her account's email.
update public.profiles set time_zone = 'Asia/Karachi' where display_name = 'her';

-- Optional: nicer display names
-- update public.profiles set display_name = 'Mayank' where display_name = 'me';

-- The day you got together (YYYY-MM-DD)
update public.couple set together_since = '2024-09-05';
```

### 1c. Logging in

The login screen asks for a **name** and **password**. A name without `@`
becomes `<name>@only-us.com` (configured in `.env` as
`VITE_LOGIN_EMAIL_DOMAIN`). A full email address also works. So if the accounts
are `me@only-us.com` and `she@only-us.com`, the names are `me` and `she`.

Forgotten password → **Authentication → Users → (user) → Update user** in the
dashboard.

## 2. Cloudflare

The app is one Cloudflare **Worker**: it serves the built app and proxies
`/supabase/*` to the Supabase project (config in [`wrangler.jsonc`](../wrangler.jsonc),
code in [`worker/`](../worker)).

1. Sign up at **dash.cloudflare.com** (Free plan) and verify your email.
2. **Workers & Pages** → choose your **workers.dev subdomain** (pick something
   neutral — it becomes part of the app's link).
3. **Workers & Pages → Create → Import a repository** (Workers, not Pages).
   - Connect GitHub and allow access to the `only-us` repository.
   - **Project name:** `only-us` (must match `name` in `wrangler.jsonc`).
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Non-production branch deploy command:** `npx wrangler versions upload`
     (gives every branch its own preview link).
   - **Production branch:** `main`.
   - Under **Build variables**, add `NODE_VERSION` = `22`.
4. **Deploy.** The app appears at `https://only-us.<your-subdomain>.workers.dev`.
5. From then on every push to `main` deploys automatically, and other branches
   get preview links shown on the GitHub commit / pull request.

## 3. Local development (Mac)

```bash
npm install
npm run dev          # http://localhost:5173 — /supabase is proxied like in production
```

To run the real Worker locally instead (after `npm run build`):

```bash
npx wrangler dev
```
