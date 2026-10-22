# only us

A private little world for two. Chat, hugs, and our story — as a web app you can
install on your phone.

> Status: **Phase 1 — backend & deploy.** Login and the Supabase proxy are built; home
> and chat still show sample data. See [docs/ROADMAP.md](docs/ROADMAP.md).

## Run it locally (Mac)

1. Install [Node.js](https://nodejs.org) 22 or newer (e.g. `brew install node`).
2. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Open the URL it prints (e.g. `http://localhost:5173`).
   - **Phone layout on the laptop:** Chrome DevTools → toggle device toolbar.
   - **On your phone:** connect to the same Wi-Fi and open the "Network" URL it prints.

The moon/sun button on the home screen switches between Light and Dusk.

## Docs

- [Product](docs/PRODUCT.md) — what we're building and why
- [Design](docs/DESIGN.md) — Rose Glass design system
- [Architecture](docs/ARCHITECTURE.md) — stack and key decisions
- [Roadmap](docs/ROADMAP.md) — phases and progress
- [Setup](docs/SETUP.md) — Supabase and Cloudflare, step by step
- [CLAUDE.md](CLAUDE.md) — coding guidelines

## Credits

Fonts: [Fraunces](https://github.com/undercasetype/Fraunces) and
[Figtree](https://github.com/erikdkennedy/figtree), both under the SIL Open Font License.
