---
estimated_steps: 5
estimated_files: 1
---

# T01: Update color tokens, add typography base styles, and global focus indicators

**Slice:** S02 — Design Refresh & Accessibility
**Milestone:** M001

## Description

Lay the styling foundation for the entire slice by fixing the green color token for WCAG AA compliance, establishing the typography scale from the WP theme, and adding global focus indicator styles. Every subsequent task depends on these base styles being correct.

## Steps

1. In `src-astro/src/styles/global.css`, change `--color-green: #25b372` to `--color-green: #1a7f53` in the `@theme` block
2. Add base typography layer below the `@theme` block: body font-size 1.125rem (18px), line-height 1.7, font-weight 400. Heading styles: h1 2.5rem/1.2/700, h2 1.875rem/1.3/700, h3 1.5rem/1.4/700, h4 1.25rem/1.4/700. Add responsive reduction via `@media (max-width: 767px)`: h1→2rem, h2→1.5rem, h3→1.33rem, body→1rem
3. Add global focus-visible styles: `*:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }` and a dark-background variant: `[data-focus-dark] *:focus-visible, .focus-dark *:focus-visible { outline-color: #fff; }` so focus rings are visible on blue/dark-blue backgrounds
4. Add `@media (prefers-reduced-motion: reduce)` rule that sets `*, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }`
5. Verify: run `npm run build` from `src-astro/`, confirm exit 0. Start dev server, check typography renders at correct sizes. Grep for `#1a7f53` in global.css.

## Must-Haves

- [ ] Green token is `#1a7f53` (not `#25b372`)
- [ ] Typography scale matches WP theme: body 18px, h1 2.5rem, h2 1.875rem, h3 1.5rem, h4 1.25rem
- [ ] Mobile typography reduction active below 768px
- [ ] Global focus-visible outline on all interactive elements
- [ ] Dark-background focus variant available (white outline)
- [ ] `prefers-reduced-motion` respected
- [ ] Build passes (`npm run build` exit 0)

## Verification

- `grep '#1a7f53' src-astro/src/styles/global.css` returns the green token line
- `grep -c '#25b372' src-astro/src/styles/global.css` returns 0 (old value fully removed)
- `cd src-astro && npm run build` exits 0
- Dev server shows body text at 18px size, headings at correct scale
- Focus ring visible when tabbing to the "Learn more" link on homepage

## Observability Impact

- Signals added/changed: None (CSS-only changes)
- How a future agent inspects this: Grep `global.css` for token values and base styles. Browser devtools computed styles on any element.
- Failure state exposed: Build failure if CSS syntax error in global.css

## Inputs

- `src-astro/src/styles/global.css` — existing Tailwind @theme block with brand tokens and @font-face (from S01)
- S02-RESEARCH.md color contrast matrix — `#1a7f53` chosen as AA-compliant green

## Expected Output

- `src-astro/src/styles/global.css` — updated with corrected green token, typography base layer, global focus indicators, and reduced-motion media query
