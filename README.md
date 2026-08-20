# Portfolio — Senior Web Developer & E-commerce Expert

An animated single-page portfolio built with Next.js 16 (App Router), React 19,
and Swiper. Dark, type-led, and fluid: layout and type scale continuously with
the viewport rather than snapping at breakpoints.

```bash
npm install
npm run dev
```

## Stack

| Concern       | Choice                                                             |
| ------------- | ------------------------------------------------------------------ |
| Framework     | Next.js 16.3 (App Router, Turbopack), React 19                     |
| Styling       | CSS custom properties + Tailwind v4 utilities                      |
| Grid          | `bootstrap-grid.css` only — the grid, not the framework            |
| Carousel      | Swiper 14 (`swiper/react`), three modules, not the bundle          |
| Type          | `next/font` — Geist, Geist Mono, Instrument Serif (self-hosted)    |
| Animation     | Native CSS. No animation library.                                  |

## How the layout scales

Type and space come from a fluid scale in `app/globals.css`: `clamp()` with a
`vw` term in the middle, so every size moves continuously between a floor and a
ceiling. `--step-0` through `--step-6` for type, `--gap-xs` through `--gap-xl`
for space. Sections use `vh`-based rhythm (`--section-y`) and the hero uses
`100svh` so mobile browser chrome doesn't cause a jump.

**Bootstrap is the grid only.** `bootstrap-grid.css` is ~10% of full Bootstrap
and, critically, ships no Reboot — full Bootstrap would double-reset on top of
Tailwind's preflight and fight it over base element styles. We use `.row` /
`.col-*` and nothing else. Our own wrapper is `.shell`, not `.container`, so the
two never collide.

## How the motion works

Three rules, applied everywhere:

1. **Only `transform` and `opacity` animate.** Both are compositor properties,
   so a frame never triggers layout or paint. No animating `width`, `top`, or
   `background-position`.
2. **Scroll-linked motion prefers native CSS.** Parallax, the media settle, and
   the progress bar use `animation-timeline: view()` / `scroll()`, which run off
   the main thread entirely. `lib/scroll-fx.ts` is a fallback for browsers
   without it (Firefox, Safari < 26) — one shared rAF loop and one passive
   listener for the whole page, reads batched before writes, and only elements
   currently on screen get written to. On browsers with native support it never
   runs.
3. **`will-change` is scoped and released.** It is set on elements that are
   about to move and dropped once they land (`.is-settled`), rather than left on
   permanently.

`prefers-reduced-motion: reduce` disables all of it and shows every element in
its final state — nothing stays hidden.

### The pieces

| File                              | Does                                                          |
| --------------------------------- | ------------------------------------------------------------- |
| `components/motion/Reveal.tsx`     | One-shot fade-and-lift on entry                                |
| `components/motion/Parallax.tsx`   | Scroll-linked depth layer                                     |
| `components/motion/MediaScale.tsx` | Over-scaled media settling to 1:1 on entry                    |
| `components/motion/ScrollProgress.tsx` | Reading progress bar — pure CSS, zero JS                  |
| `components/motion/CountUp.tsx`     | Stat counters, animated on first view                         |
| `components/motion/CursorGlow.tsx`  | Pointer-following light (mouse only, self-halting rAF)        |
| `lib/motion.ts`                     | Capability detection + one shared IntersectionObserver        |
| `lib/scroll-fx.ts`                  | Scroll-linked fallback for older browsers                     |

One IntersectionObserver serves every reveal on the page. Its `rootMargin` has a
deliberately huge top value so an element that is *already* scrolled past still
counts as intersecting — otherwise an anchor deep-link (`/#contact`) or a
restored scroll position leaves that content stranded at `opacity: 0` forever,
because `isIntersecting` never changes. Its `threshold` is `0` for the same
class of reason: any non-zero ratio is unreachable for an element taller than
the viewport.

## Server vs client

`app/page.tsx` is a Server Component and stays one. Interactivity lives in the
leaves — the carousel, the reveal wrappers, the header — so the page shell is
static HTML and only the parts that need a browser ship JavaScript. The hero's
entrance is CSS keyframes, not JS, so it starts when the stylesheet lands rather
than waiting on hydration.

## Replacing the placeholder content

Everything invented is in two files and marked `TODO(you)`:

- **`lib/site.ts`** — name, contact address, availability, stats, capabilities,
  process. **The stats and the email are placeholders.** Note the repo is
  public, so pick an inbox you're happy to have crawled.
- **`lib/projects.ts`** — the six case studies. Client names, metrics, and
  summaries are all illustrative.

### Work images

`public/work/*.webp` are generated placeholders standing in for real captures:

- **Cards** — `1200x2400` (1:2) full-page screenshots. The card shows the top
  and scrolls through the rest on hover, which reads as a walkthrough of the
  live site. The travel distance is derived from the ratio in
  `components/ProjectCard.tsx`; keep 1:2 and it stays exact.
- **Feature band** — `feature-wide.webp`, `1600x1000`.

Drop real screenshots in with the same filenames and ratios, then delete
`scripts/generate-placeholders.mjs` and the `sharp` devDependency — nothing in
the app imports either.

To regenerate the placeholders instead:

```bash
node scripts/generate-placeholders.mjs
```

### Video previews

`ProjectCard` already supports a motion preview: add a `video` path to a project
in `lib/projects.ts` and the card plays it on hover instead of scrolling the
poster. The clip is only fetched on first hover, so visitors who never interact
never download it. Keep clips under ~2 MB and 6 seconds, and always keep the
poster — it is the fallback when autoplay is blocked (low-power mode, data
saver).

## Known caveat: AVIF is off on purpose

`next.config.ts` deliberately does **not** enable `images.formats` with AVIF. On
Next 16.3.1 the optimizer's AVIF path returns a badly darkened image for these
posters — a light mockup came back with a mean top-strip pixel of
`rgb(24,40,35)` instead of `rgb(205,217,211)`, while the WebP output of the same
source is pixel-correct and sharp's own AVIF encode of the same file is fine.
AVIF is opt-in (the default is `["image/webp"]`), so the default is both correct
and safe. Worth re-testing on a future Next release for the compression win.

## Accessibility

- Skip link, semantic landmarks, and a visible focus ring throughout.
- The carousel is keyboard operable (arrow keys) with labelled controls, via
  Swiper's `A11y` and `Keyboard` modules.
- Decorative layers are `aria-hidden`; the duplicated marquee track is too, so
  the platform list is announced once.
- Hover previews are also bound to focus, so the interaction is reachable
  without a mouse.

## Scripts

```bash
npm run dev     # Turbopack dev server
npm run build   # production build
npm run start   # serve the build
npm run lint    # eslint
```
