# only us — working guidelines

Private PWA for two people (India ↔ Pakistan). Read `docs/PRODUCT.md`,
`docs/DESIGN.md` and `docs/ARCHITECTURE.md` before larger changes;
`docs/ROADMAP.md` tracks progress — tick items off as they land.

## Commands

```bash
npm install
npm run dev        # dev server (also on LAN, for testing on a phone)
npm run check      # typecheck + lint + format check — run before every push
npm run build      # production build (includes service worker)
npm run format     # auto-format
npx wrangler dev   # run the production Worker locally (after npm run build)
```

## Rules

- **Design tokens only.** No raw hex colours in components; use the Tailwind
  theme colours (`text-muted`, `bg-rose`, …) or `var(--…)`. New colours go into
  `src/styles/index.css` for both Light and Dusk.
- **Glass budget.** `glass` (real blur) only on a few floating surfaces per
  screen; `glass-flat` for anything repeated. Background glows use gradients,
  not `filter: blur()`.
- **Budget phones first.** Her phone is a low-RAM Infinix. Prefer CSS over JS
  animation, animate only `transform`/`opacity`, respect
  `prefers-reduced-motion`. Ask before adding any dependency over ~10 KB gzip.
- **Accessible by default.** Real `<button>`/`<a>`, `aria-label` on icon-only
  buttons, touch targets ≥ 44 px, `dir="auto"` on user-written text.
- **Copy.** Short, plain, warm English. No cheesy lines.
- **Time.** Store UTC, render with `src/lib/time.ts`. Never hard-code a zone in UI code.
- **Privacy.** No analytics or tracking. Never commit secrets. `.env` holds
  public config only (committed); secrets go in `.env.local` (ignored).
- **Supabase only via the proxy.** Use the client in `src/lib/supabase.ts`
  (`/supabase` on our own origin). Never call `*.supabase.co` from the app.
- **Database changes** go in a new file in `supabase/migrations/`, with RLS.
- **Structure.** Feature code in `src/features/<feature>/`, shared UI in
  `src/components/`, helpers in `src/lib/`. Named exports. Function components.

## Git

- Work on a branch, open a PR into `main`. Small, focused commits with
  imperative messages (`Add hug orb hold progress`).
- `npm run check` and `npm run build` must pass before pushing.
