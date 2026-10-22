# Roadmap

Each phase ends with something usable. Design keeps improving along the way.

## Phase 0 — Foundation ✅

- [x] Vite + React + TypeScript + Tailwind + PWA scaffold
- [x] Rose Glass design system (Light default, Dusk), self-hosted fonts
- [x] Home screen: presence, days together, time there, hold-to-hug orb, quick actions
- [x] Chat screen UI with sample data: bubbles, voice note, hug moment, reactions, typing, composer
- [x] Hug character + animations, app icon
- [x] Docs and guidelines

## Phase 1 — Backend & deploy (current)

- [x] Create Supabase project (Mumbai), sign-ups off, two users _(owner)_
- [ ] Cloudflare account + connect repo _(owner — see SETUP.md)_
- [x] Database schema + RLS for two users (migration written and tested locally)
- [ ] Run the migration in Supabase _(owner — see SETUP.md)_
- [x] Login screen (name + password), session handling
- [x] Cloudflare Worker: serves the app + proxies Supabase (REST, Realtime, Storage)
- [ ] First deploy, preview links per branch
- [ ] Show real names, her time zone and start date from the database

## Phase 2 — Real chat

- [ ] Messages over Realtime, offline queue
- [ ] Typing, online presence, read receipts
- [ ] Replies, reactions, emoji picker, jumbo emoji

## Phase 3 — Media

- [ ] Photos (client-side compression), viewer
- [ ] Voice notes (record, upload, playback)

## Phase 4 — Hugs & push

- [ ] Hug / Thinking of You stored and delivered in real time
- [ ] Full-screen hug animation, Hug Sync
- [ ] Web Push (VAPID) via Edge Function; notification setup guide (Moto, Infinix)

## Phase 5 — Our Story

- [ ] Timeline of milestones with photos; days-together from a real start date; On this day

## Phase 6 — Stickers

- [ ] Free sticker packs (Noto Animated Emoji, Fluent Emoji — check licences)
- [ ] Sticker maker from your own photos

## Phase 7 — Safety & reliability

- [ ] App lock PIN, settings, theme setting
- [ ] Keep-alive ping, backups, storage usage display

## Phase 8 — Polish & reveal 💝
