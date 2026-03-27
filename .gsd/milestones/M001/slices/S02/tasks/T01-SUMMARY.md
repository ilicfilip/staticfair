---
id: T01
parent: S02
milestone: M001
provides:
  - WCAG AA-compliant green color token (#1a7f53)
  - Base typography scale (body 18px, h1-h4 heading sizes with mobile reduction)
  - Global focus-visible indicators with dark-background variant
  - prefers-reduced-motion media query
key_files:
  - src-astro/src/styles/global.css
key_decisions: []
patterns_established:
  - "@layer base" for typography defaults that utility classes can override
  - "data-focus-dark" / ".focus-dark" attribute for white focus rings on dark backgrounds
  - Comment-sectioned CSS (Typography / Focus Indicators / Reduced Motion)
observability_surfaces:
  - "none (CSS-only changes — inspect via grep or browser devtools computed styles)"
duration: 8m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T01: Update color tokens, add typography base styles, and global focus indicators

**Updated green token to #1a7f53, added responsive typography base layer, global focus-visible outlines, and prefers-reduced-motion media query in global.css**

## What Happened

All four planned additions to `global.css` were made in a single edit:

1. Changed `--color-green` from `#25b372` to `#1a7f53` in the `@theme` block for WCAG AA contrast compliance.
2. Added `@layer base` block with body typography (18px/1.7/400) and heading scale (h1 2.5rem/1.2/700, h2 1.875rem/1.3/700, h3 1.5rem/1.4/700, h4 1.25rem/1.4/700). Includes `@media (max-width: 767px)` responsive reduction: body→1rem, h1→2rem, h2→1.5rem, h3→1.33rem.
3. Added global `*:focus-visible` rule with blue outline (2px solid, 2px offset) and dark-background variants via `[data-focus-dark]` and `.focus-dark` selectors that switch to white outline.
4. Added `@media (prefers-reduced-motion: reduce)` query disabling animations, transitions, and smooth scrolling.

The `@layer base` approach means these styles serve as defaults — Tailwind utility classes on existing elements (like the h1 which has `text-4xl sm:text-5xl`) correctly override them. This is the intended behavior for a base typography layer.

## Verification

- ✅ `grep '#1a7f53' src-astro/src/styles/global.css` — returns the green token line
- ✅ `grep -c '#25b372' src-astro/src/styles/global.css` — returns 0 (old value fully removed)
- ✅ `npm run build` — exits 0, 1 page built successfully
- ✅ Browser computed styles: body fontSize=18px, lineHeight=30.6px (18×1.7), fontWeight=400
- ✅ Focus ring visible on Tab — blue outline on "Skip to main content" link and nav links
- ✅ Root font-size confirmed at 16px (rem calculations correct)

### Slice-level checks (T01 scope):
- **V1:** ✅ `npm run build` exits 0
- **V2:** ✅ Green token is `#1a7f53` in global.css
- **V3:** ⬜ Not applicable yet (Lighthouse audit is T04)
- **V4:** ⬜ Not applicable yet (hamburger ARIA is T02)
- **V5:** ✅ Skip-to-content link visible on Tab (already existed from S01)
- **V6:** ✅ Focus indicators visible (global rule applied)
- **V7:** ⬜ Not applicable yet (responsive layout is T02/T03)
- **V8:** ⬜ Not applicable yet (logo/favicon is T03)
- **V9:** ⬜ Not applicable yet (LF banner is T02)
- **V10:** ⬜ Not applicable yet (color audit is T04)

## Diagnostics

CSS-only changes. Inspect via:
- `grep` patterns in `src-astro/src/styles/global.css` for token values and style rules
- Browser devtools: computed styles on any element show font-size, line-height, font-weight
- Build failure on CSS syntax error surfaces via `npm run build` exit code

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src-astro/src/styles/global.css` — Updated green token, added base typography layer, global focus indicators, and reduced-motion media query
