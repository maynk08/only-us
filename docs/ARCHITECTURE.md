# Architecture

Everything runs on free tiers. No server of our own to maintain.

```
 Phone (PWA, Chrome)                Cloudflare (free)                 Supabase (free, Mumbai)
 ┌──────────────────┐  HTTPS / WS  ┌──────────────────────┐          ┌──────────────────────┐
 │ React app        │ ───────────▶ │ Pages: static app     │          │ Auth (2 users only)  │
 │ Service worker   │              │ Worker: /api proxy ───┼────────▶ │ Postgres + RLS       │
 │ (offline, push)  │ ◀── push ─── │                       │          │ Realtime (chat)      │
 └──────────────────┘              └──────────────────────┘          │ Storage (media)      │
                                                                      │ Edge Functions (push)│
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
| Hosting  | Cloudflare Pages                                                  |
| Proxy    | Cloudflare Worker in front of Supabase                            |
| Push     | Web Push (VAPID) sent from a Supabase Edge Function               |

## Key decisions

- **Proxy everything through our own domain.** Some Indian ISPs blocked
  `supabase.co` in early 2025. The app never calls Supabase directly — all
  REST, Realtime (WebSocket) and Storage traffic goes through a Cloudflare
  Worker on our domain.
- **Supabase region: Mumbai (ap-south-1)** — closest to both.
- **Time:** store UTC, display in each person's local zone. The partner's zone
  is shown on screen ("Time there"). India is UTC+5:30, Pakistan UTC+5:00.
  Daily things (streaks, "hugs today") reset at each person's own midnight.
- **Exactly two accounts.** Public sign-up disabled; Row Level Security limits
  every table to the two user IDs.
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
  data/           Mock data (until the backend lands)
  styles/         index.css — tokens, utilities, keyframes
  types.ts        Shared domain types
docs/             Product, design, architecture, roadmap
```
