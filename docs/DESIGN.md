# Design system — Rose Glass

Romantic, warm and premium. Glassmorphism used with restraint over soft colour
fields. Light is the default theme; Dusk is the second theme.

Reference mockups: the "Rose Glass — Light (default) & Dusk" row on the design
canvas (Claude artifact, private to the owner).

## Principles

- Warm, muted colours — deep rose is for what matters, not everywhere.
- Important moments are special through typography, imagery and subtle animation.
- Familiar navigation and predictable interactions.
- Decorative gradients and glass effects used sparingly.

## Colour tokens

Defined once in `src/styles/index.css`. Components use tokens only — never raw
hex values. (Exception: the hug character and orb, which always sit on rose and
so use fixed colours.)

| Token          | Light                | Dusk                | Use                   |
| -------------- | -------------------- | ------------------- | --------------------- |
| `--bg`         | `#FFF8F4` warm ivory | `#2A0E1B` deep wine | Page background       |
| `--text`       | `#2B1A1F`            | `#FFF8F4`           | Body text             |
| `--text-muted` | `#6E5A5F`            | ivory 72%           | Secondary text        |
| `--rose`       | `#8F3048` deep rose  | same                | Primary accent        |
| `--blush`      | `#E8B7B7` dusty pink | same                | Secondary accent      |
| `--peach`      | `#F2C4A8`            | same                | Background glow       |
| `--ivory`      | `#FFF8F5`            | same                | Text on rose surfaces |

## Typography

- **Fraunces** (variable, `SOFT` axis at 100 → rounded serif) for headings,
  numbers and special moments. Class: `font-serif`.
- **Figtree** for everything else.
- Both are self-hosted via Fontsource (no Google Fonts requests at runtime).

## Surfaces (utilities in `index.css`)

| Utility                         | What it is                                                           | When                                                                              |
| ------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `glass`                         | Frosted fill + light-catching gradient edge + **real backdrop blur** | Floating chrome only (nav, header pills, composer, hero card). Max ~4 per screen. |
| `glass-lg`                      | Deeper shadow, add to `glass`                                        | Hero surfaces                                                                     |
| `glass-flat`                    | Same look, **no blur**                                               | Anything repeated                                                                 |
| `orb`                           | Glossy 3D rose sphere                                                | Hug button, record/send, reactions                                                |
| `bubble-mine` / `bubble-theirs` | Chat bubbles with depth                                              | Messages                                                                          |

## Hug character

`<HugCharacter />` — two round characters hugging, with closed happy eyes and
rosy cheeks. Hearts mean love (Us tab, reactions); the hug character means hugs.
Animations: squeeze every 2.6 s, heart floats up, orb breathes, small hearts drift.

## Motion

- Animate `transform` and `opacity` only.
- Every animation is disabled under `prefers-reduced-motion`.

## Performance rules (her phone is a budget Infinix)

- Background glows are radial gradients, not `filter: blur()`.
- Real backdrop blur only on a few floating surfaces per screen.
- Keep initial JS small; no heavy libraries without discussing first.
- Only Latin font subsets are precached; other subsets load on demand.

## Copy

Short, plain, warm. No cheesy lines. English UI; messages can be Roman Urdu /
Hinglish or Urdu / Hindi script (`dir="auto"` on message text).
