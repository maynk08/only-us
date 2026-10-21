# Product

**only us** is a private web app (PWA) for exactly two people — a couple in a
long-distance relationship, one in India and one in Pakistan. It is not a
general chat app: there is no sign-up, no contact list, no other users.

## Principles

- **A shared space, not a messenger.** Home is "Us", not a list of chats.
- **Special moments feel special.** Hugs, milestones and memories get their own
  visual treatment; ordinary messages stay calm.
- **Warm, not cringe.** UI copy is short, plain and grown-up ("Hold to hug",
  "You're both here"). Personality comes from the design, not from cheesy lines.
- **Private by default.** No analytics, no trackers, no third-party SDKs that
  phone home.
- **Works on budget phones and bad networks.** See performance rules in
  [DESIGN.md](DESIGN.md).

## Users and devices

|         | Phone                              | Notes                                                                           |
| ------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| Owner   | Moto G34 (Android 14)              | Near-stock Android; notifications reliable                                      |
| Partner | Infinix (XOS, budget, ~2–3 GB RAM) | Aggressive battery management — needs an in-app setup guide; keep the app light |

Both use Chrome on Android. Her laptop (Windows) can also install the PWA.

## v1 scope

1. Email + password login for the two accounts only (no public sign-up) + app lock PIN
2. Real-time chat: text, photos, voice notes, replies, reactions, emoji picker,
   typing / online / read indicators, Urdu & Hindi script (RTL) support
3. **Send a Hug** (hold to hug — longer hold, tighter hug), **Thinking of You**,
   **Hug Sync** (both holding at the same time unlocks a special animation)
4. Push notifications for messages, hugs and nudges
5. **Our Story** timeline (milestones with photos and notes)
6. Days-together counter and partner's local time
7. Stickers: free sticker packs + custom stickers made from your own photos
8. Installable PWA, light (default) and dusk themes
9. Behind the scenes: blocking-resistant proxy, keep-alive ping, backups

## Later (v1.1+)

Heartbeat vibration, Miss-you meter, Open-When letters, Love Jar, Daily Question,
mood check-in, meet-up countdown, "Her sky" background, secret-word effects,
fingerprint unlock, GIF search, end-to-end encryption, voice/video calls.

## Known platform limits

- Custom vibration patterns only work while the app is open. With the app
  closed, Android uses the phone's normal notification vibration.
- When the app is closed, new messages arrive as push notifications; the chat
  catches up when reopened.
- Supabase free tier: ~500 MB database, 1 GB file storage (≈3,000 compressed
  photos), project pauses after 7 days of inactivity (we ping it).
