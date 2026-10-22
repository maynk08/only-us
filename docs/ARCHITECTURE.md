# Architecture

Everything runs on free tiers. No server of our own to maintain.

```
 Phone (PWA, Chrome)                Cloudflare (free)                 Supabase (free, Mumbai)
 ┌──────────────────┐  HTTPS / WS  ┌──────────────────────┐          ┌──────────────────────┐
 │ React app        │ ───────────▶ │ Worker: serves app    │          │ Auth (2 users only)  │
 │ Service worker   │              │ + /supabase proxy ────┼────────▶ │ Postgres + RLS       │
 │ (offline, push)  │ ◀── push ─── │                       │          │ Realtime (chat)      │
 └──────────────────┘              └──────────────────────┘          │ Storage (media)      │
                                                                      │ Edge Functions       │
                                                                      └──────────────────────┘
```

## Stack

| Layer    | Choice                                                            |
| -------- | ----------------------------------------------------------------- |
| Frontend | React 19 + TypeScript + Vite                                      |
| Styling  | Tailwind CSS v4 + design tokens (see DESIGN.md)                   |
| Routing  | React Router                                                      |
| PWA      | vite-plugin-pwa (Workbox)                                         |
| Backend  | Supabase: Auth, Postgres (RLS), Realtime, Storage, Edge Functions |
| Hosting  | Cloudflare Worker with static assets (`wrangler.jsonc`)           |
| Proxy    | Same Worker: `/supabase/*` → Supabase (`worker/index.ts`)         |
| Push     | Web Push (VAPID) sent by the same Worker (`worker/push.ts`)       |

## Key decisions

- **Proxy everything through our own domain.** Some Indian ISPs blocked
  `supabase.co` in early 2025. The app never calls Supabase directly — all
  REST, Realtime (WebSocket) and Storage traffic goes to `/supabase/*` on our
  own domain; the Worker forwards it (the Vite dev server does the same
  locally). One Worker serves the app too — no separate Pages project.
- **Supabase region: Mumbai (ap-south-1)** — closest to both.
- **Time:** store UTC, display in each person's local zone. The partner's zone
  is shown on screen ("Time there"). India is UTC+5:30, Pakistan UTC+5:00.
  Daily things (streaks, "hugs today") reset at each person's own midnight.
- **Exactly two accounts.** Public sign-up disabled; Row Level Security limits
  every table to members (users with a row in `profiles`). Schema lives in
  `supabase/migrations/`; setup steps in [SETUP.md](SETUP.md).
- **Push notifications from the Worker.** After a message is saved, the
  sender's app calls `POST /api/push`. The Worker checks the sender's login,
  reads the message and the partner's devices with that same login (RLS
  applies; no service key exists anywhere), and sends encrypted Web Push
  messages. The service worker (`public/push-handler.js`) shows them unless the
  app is already on screen. VAPID keys are Cloudflare secrets.
- **Email + password**, not magic links (Supabase's free email sender is too
  rate-limited).
- **Media:** photos compressed client-side (~300 KB) before upload.
- **Keep-alive:** a scheduled GitHub Action pings Supabase so the free project
  never pauses. **Backups:** scheduled export to private storage (TBD).
- **Not in v1:** end-to-end encryption, calls (need a TURN relay).

## Folder structure

```
src/
  app/            App shell and routes
  components/     Shared UI (icons, HugCharacter, HugOrb, BottomNav, …)
  features/       One folder per feature: home/, chat/, story/, stickers/
  lib/            Framework-free helpers (time, theme, hooks)
  data/           Supabase data: couple + presence, live messages (providers, row mapping)
  styles/         index.css — tokens, utilities, keyframes
  types.ts        Shared domain types
worker/           Cloudflare Worker (serves app, proxies Supabase)
supabase/         SQL migrations
docs/             Product, design, architecture, roadmap, setup
```
