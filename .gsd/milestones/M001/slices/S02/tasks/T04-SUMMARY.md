---
id: T04
parent: S02
milestone: M001
provides:
  - Full accessibility audit confirmation — Lighthouse 100%, keyboard nav verified, ARIA landmarks complete
  - All S02 V1–V10 verification checks passing
key_files:
  - src-astro/src/styles/global.css
  - src-astro/src/components/Header.astro
  - src-astro/src/layouts/BaseLayout.astro
  - src-astro/src/pages/index.astro
key_decisions:
  - No code changes needed — T01–T03 implementation was already fully accessible
patterns_established:
  - Lighthouse CLI audit command: `npx lighthouse http://localhost:4321 --only-categories=accessibility --output=json --chrome-flags="--headless --no-sandbox"`
observability_surfaces:
  - Lighthouse CLI for accessibility scoring — parse JSON output `categories.accessibility.score`
  - Browser devtools accessibility tree for ARIA attribute inspection
  - `document.querySelector('#menu-toggle').getAttribute('aria-expanded')` for hamburger state
duration: 15m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T04: Accessibility audit, keyboard nav verification, and Lighthouse ≥90

**Ran full accessibility audit — Lighthouse scored 100%, all keyboard navigation verified, all V1–V10 slice checks pass with zero issues found.**

## What Happened

Executed the complete accessibility audit and verification task against the styled Astro site from T01–T03. No code fixes were needed — the implementation was already fully accessible.

**Keyboard navigation audit (desktop 1280px):**
- Skip-to-content link appears visually on first Tab press (white bg, blue text, z-50)
- Tab order: skip link → LF banner link → logo → nav items (with dropdown sub-items via focus-within) → hero CTA → card links → bottom CTAs → footer links → back-to-top
- Dark backgrounds (header, LF banner, footer): focus ring is white `rgb(255, 255, 255)` via `data-focus-dark` rule
- Light backgrounds (hero, cards, CTA sections): focus ring is blue `rgb(0, 115, 170)` via default `focus-visible` rule
- All 36 interactive elements reachable — zero skipped, zero invisible focus rings

**Mobile hamburger audit (375px):**
- Hamburger button visible, nav links hidden
- Click → menu opens, `aria-expanded="true"`, all nav items displayed
- Tab moves through menu items (confirmed "About FAIR" focused inside `#main-menu`)
- Escape → menu closes, `aria-expanded="false"`, focus returns to hamburger button

**Heading hierarchy and semantics:**
- Single `<h1>` on homepage ("Federated and Independent Repositories")
- No skipped levels: H1 → H2 → H3 throughout
- All landmarks present: `<header>`, `<nav aria-label="Main">`, `<main id="main-content">`, `<footer>`, `<nav aria-label="Footer">`
- All images have alt text (logo img has `alt="FAIR"`)
- `lang="en"` on `<html>` element

**Responsive layout (3 breakpoints):**
- 375px: single-column, hamburger visible, no horizontal overflow (`scrollWidth === clientWidth`)
- 768px: hamburger visible (below 1024px breakpoint), cards side-by-side, content width adapts
- 1280px: full desktop nav visible, cards side-by-side, max-width container

**Lighthouse:** Accessibility score = **1.0 (100%)** — zero failing audits.

## Verification

All V1–V10 slice checks:

| Check | Result |
|-------|--------|
| V1: `npm run build` exit 0 | ✅ PASS — built in 754ms, 1 page |
| V2: Green token `#1a7f53` in global.css | ✅ PASS — grep confirmed |
| V3: Lighthouse accessibility ≥90 | ✅ PASS — scored 100% |
| V4: Hamburger `aria-expanded` + `aria-controls` | ✅ PASS — both present, state toggles correctly |
| V5: Skip-to-content link visible on Tab | ✅ PASS — appears with white bg, blue text |
| V6: All focus indicators visible | ✅ PASS — white on dark, blue on light, all 2px solid |
| V7: Responsive layout correct | ✅ PASS — 375px/768px/1280px all verified |
| V8: Logo and favicon files exist | ✅ PASS — logo.svg, favicon.svg, favicon.ico present |
| V9: Linux Foundation banner in dist | ✅ PASS — grep confirmed in dist/index.html |
| V10: No orange/light-blue text on light bg | ✅ PASS — zero matches in templates |

Additional must-have checks:
- `prefers-reduced-motion` media query: present in global.css
- Single h1, no skipped heading levels: confirmed
- All ARIA landmarks present: confirmed
- All images have alt text: confirmed

## Diagnostics

- Run Lighthouse: `cd src-astro && npx lighthouse http://localhost:4321 --only-categories=accessibility --output=json --chrome-flags="--headless --no-sandbox"` → parse `categories.accessibility.score`
- Check hamburger state: `document.querySelector('#menu-toggle').getAttribute('aria-expanded')`
- Check focus ring on any element: inspect computed `outline-color` and `outline-style` in devtools
- Heading hierarchy: `document.querySelectorAll('h1, h2, h3, h4, h5, h6')` — verify no skipped levels
- Horizontal overflow: `document.documentElement.scrollWidth > document.documentElement.clientWidth`

## Deviations

None. No code changes were needed — T01–T03 produced a fully accessible site.

## Known Issues

None.

## Files Created/Modified

No source files modified. This was a verification-only task. All V1–V10 checks passed against existing code from T01–T03.
