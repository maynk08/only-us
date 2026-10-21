# Roadmap

Each phase ends with something usable. Design keeps improving along the way.

## Phase 0 — Foundation ✅ (current)

- [x] Vite + React + TypeScript + Tailwind + PWA scaffold
- [x] Rose Glass design system (Light default, Dusk), self-hosted fonts
- [x] Home screen: presence, days together, time there, hold-to-hug orb, quick actions
- [x] Chat screen UI with sample data: bubbles, voice note, hug moment, reactions, typing, composer
- [x] Hug character + animations, app icon
- [x] Docs and guidelines

## Phase 1 — Backend & deploy

- [ ] Create Supabase project (Mumbai) and Cloudflare account _(owner)_
- [ ] Database schema + RLS for two users
- [ ] Login screen, session handling
- [ ] Cloudflare Worker proxy for Supabase (REST, Realtime, Storage)
- [ ] Deploy to Cloudflare Pages with preview links per branch

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
