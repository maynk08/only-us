# Roadmap

Each phase ends with something usable. Design keeps improving along the way.

## Phase 0 — Foundation ✅

- [x] Vite + React + TypeScript + Tailwind + PWA scaffold
- [x] Rose Glass design system (Light default, Dusk), self-hosted fonts
- [x] Home screen: presence, days together, time there, hold-to-hug orb, quick actions
- [x] Chat screen UI with sample data: bubbles, voice note, hug moment, reactions, typing, composer
- [x] Hug character + animations, app icon
- [x] Docs and guidelines

## Phase 1 — Backend & deploy ✅

- [x] Create Supabase project (Mumbai), sign-ups off, two users _(owner)_
- [x] Cloudflare account + connect repo _(owner)_
- [x] Database schema + RLS for two users (migration written and tested locally)
- [x] Run the migration in Supabase _(owner)_
- [x] Login screen (name + password), session handling
- [x] Cloudflare Worker: serves the app + proxies Supabase (REST, Realtime, Storage)
- [x] First deploy — https://only-us.swaggerb666.workers.dev (login tested on the Moto)
- [x] Show real names, her time zone and start date from the database

## Phase 2 — Real chat (current)

- [x] Messages from the database + Realtime, optimistic send, retry on failure
- [x] Hugs and Thinking of You saved as messages; pop-up when one arrives while the app is open
- [ ] Offline queue (send automatically when back online)
- [x] Typing, online presence, read receipts
- [ ] Replies, reactions, emoji picker, jumbo emoji

## Phase 3 — Media

- [ ] Photos (client-side compression), viewer
- [ ] Voice notes (record, upload, playback)

## Phase 4 — Hugs & push (current)

- [x] Hug / Thinking of You stored and delivered in real time
- [ ] Full-screen hug animation, Hug Sync
- [x] Web Push (VAPID) sent by the Cloudflare Worker; turn-on card; notification guide (Moto, Infinix)
- [ ] Owner: run push migration, add VAPID secrets, turn on on both phones (see SETUP.md §3)

## Phase 5 — Our Story

- [ ] Timeline of milestones with photos; days-together from a real start date; On this day

## Phase 6 — Stickers

- [ ] Free sticker packs (Noto Animated Emoji, Fluent Emoji — check licences)
- [ ] Sticker maker from your own photos

## Phase 7 — Safety & reliability

- [ ] App lock PIN, settings, theme setting
- [ ] Keep-alive ping, backups, storage usage display

## Phase 8 — Polish & reveal 💝
