---
id: S02
parent: M001
milestone: M001
provides:
  - WCAG AA-compliant color tokens (green #1a7f53 passes 4.99:1 on white)
  - Responsive header with blue background, desktop CSS dropdowns, mobile hamburger menu with ARIA
  - Linux Foundation attribution banner component
  - Dark-blue styled footer with LF attribution and back-to-top link
  - Homepage visual design with hero, CTA cards, feature list, and get-involved sections
  - Placeholder FAIR logo SVG wordmark and favicon (SVG + ICO)
  - Global focus-visible indicators with dark-background variant
  - Base typography scale (body 18px/1.7, heading scale with mobile reduction)
  - prefers-reduced-motion media query
  - Lighthouse accessibility score 100%
requires:
  - slice: S01
    provides: BaseLayout.astro, Header.astro, Footer.astro, SEO.astro, global.css with brand tokens, Mona Sans font, Tailwind v4 config
affects:
  - S05
key_files:
  - src-astro/src/styles/global.css
  - src-astro/src/components/Header.astro
  - src-astro/src/components/Footer.astro
  - src-astro/src/components/LFBanner.astro
  - src-astro/src/pages/index.astro
  - src-astro/src/layouts/BaseLayout.astro
  - src-astro/public/logo.svg
  - src-astro/public/favicon.svg
  - src-astro/public/favicon.ico
key_decisions:
  - "D018: Green #1a7f53 replaces #25b372 for WCAG AA compliance (4.99:1 on white)"
  - "D019: Vanilla <script> in Header.astro for hamburger toggle — no framework hydration needed"
  - "D020: CSS-only :hover + :focus-within for desktop dropdown sub-menus"
  - "D021: data-focus-dark attribute on dark containers triggers white focus rings"
patterns_established:
  - "@layer base for typography defaults that utility classes can override"
  - "data-focus-dark / .focus-dark attribute for white focus rings on dark backgrounds"
  - "Scoped <style> blocks in Astro components for component-specific CSS"
  - "Client-side <script> in Astro components for minimal interactivity (standard Astro pattern)"
  - "nav-group / dropdown / dropdown-link class naming for header nav structure"
  - "id='top' on <html> for back-to-top anchor link from footer"
observability_surfaces:
  - "aria-expanded on #menu-toggle reflects mobile menu state — document.querySelector('#menu-toggle').getAttribute('aria-expanded')"
  - "Menu visibility — document.getElementById('main-menu').classList.contains('hidden')"
  - "Lighthouse CLI for accessibility scoring — npx lighthouse --only-categories=accessibility --output=json"
  - "Missing favicon → 404 in browser network tab; missing logo → broken img with alt='FAIR'"
drill_down_paths:
  - .gsd/milestones/M001/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S02/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S02/tasks/T03-SUMMARY.md
  - .gsd/milestones/M001/slices/S02/tasks/T04-SUMMARY.md
duration: 63m
verification_result: passed
completed_at: 2026-03-27
---

# S02: Design Refresh & Accessibility

**Full visual design refresh with WCAG AA-compliant colors, responsive header/footer, homepage layout, placeholder branding, and Lighthouse accessibility score of 100%.**

## What Happened

Four tasks executed sequentially to build the complete visual layer on top of S01's structural foundation:

**T01 (8m)** laid the CSS foundation: updated the green brand token from `#25b372` to `#1a7f53` for WCAG AA compliance, added a `@layer base` typography scale (body 18px/1.7, h1–h4 heading sizes with mobile responsive reduction), global `focus-visible` outlines (blue on light backgrounds, white on dark via `data-focus-dark`), and a `prefers-reduced-motion` media query.

**T02 (20m)** built the most complex component — the responsive header. Created `LFBanner.astro` (dark strip with "A Linux Foundation Project" link) and restyled `Header.astro` with a blue background, white navigation links, CSS-driven desktop dropdown sub-menus (`:hover` + `:focus-within`), and a mobile hamburger button with full ARIA support (`aria-expanded`, `aria-controls`, Escape key handling, outside-click close). LFBanner was composed into BaseLayout above the header.

**T03 (20m)** completed the visual layer: styled Footer with dark-blue background, white text, LF attribution, and back-to-top link. Built the full homepage with four sections — hero (light-gray bg, green CTA), package explorer cards (Plugins/Themes), "FAIR is:" feature grid with emoji icons, and Get Involved CTA section. Created placeholder FAIR wordmark SVG (`logo.svg`), favicon files (SVG + ICO), and wired them into the header and BaseLayout head.

**T04 (15m)** ran the full accessibility audit. No code changes were needed — T01–T03 produced a fully accessible site. Keyboard navigation verified across all 36 interactive elements. Mobile hamburger tested (open, Tab through items, Escape close). Heading hierarchy confirmed (single h1, no skipped levels). All ARIA landmarks present. Responsive layout verified at 375px, 768px, and 1280px. Lighthouse scored **100% on accessibility**.

## Verification

All 10 slice-level verification checks passed:

| Check | Result |
|-------|--------|
| V1: `npm run build` exit 0 | ✅ Built in 696ms, 1 page |
| V2: Green token `#1a7f53` in global.css | ✅ Confirmed via grep |
| V3: Lighthouse accessibility ≥90 | ✅ Scored 100% |
| V4: Hamburger `aria-expanded` + `aria-controls` | ✅ Both present, state toggles correctly |
| V5: Skip-to-content link visible on Tab | ✅ Renders in built HTML, visible on focus |
| V6: All focus indicators visible | ✅ White on dark, blue on light, all 2px solid |
| V7: Responsive layout correct | ✅ 375px/768px/1280px all verified |
| V8: Logo and favicon files exist | ✅ logo.svg, favicon.svg, favicon.ico present |
| V9: Linux Foundation banner in dist | ✅ Multiple matches in dist/index.html |
| V10: No orange/light-blue text on light bg | ✅ Zero matches in templates |

Additional verification:
- `prefers-reduced-motion` media query present in global.css
- Single h1, no skipped heading levels
- All ARIA landmarks: `<header>`, `<nav aria-label="Main">`, `<main id="main-content">`, `<footer>`, `<nav aria-label="Footer">`
- All images have alt text
- `lang="en"` on `<html>` element

## Requirements Advanced

- **R007 (Accessibility WCAG AA)** — Color contrast fixed (green #1a7f53 passes AA), skip-to-content link functional, visible focus indicators on all backgrounds, keyboard navigation complete, ARIA landmarks and attributes correct, `prefers-reduced-motion` respected
- **R009 (Responsive design)** — Header responsive with hamburger menu below 1024px, homepage sections adapt to mobile/tablet/desktop, no horizontal overflow at any breakpoint
- **R012 (Design refresh)** — Full visual refresh applied: styled header/footer, homepage sections, typography system, color token updates, all using Mona Sans and brand palette
- **R013 (Placeholder branding)** — FAIR text wordmark SVG created, favicon SVG + ICO generated, wired into header and layout head, documented as placeholders for easy replacement

## Requirements Validated

- **R007 (Accessibility WCAG AA)** — Lighthouse 100%, all keyboard navigation paths verified, ARIA attributes correct, contrast ratios passing, focus indicators visible on both light and dark backgrounds
- **R009 (Responsive design)** — Layout verified at 375px, 768px, and 1280px viewpoints with no overflow or layout breaking
- **R012 (Design refresh)** — All visual elements styled and verified in browser: header, footer, homepage hero/cards/features/CTA, typography, color tokens
- **R013 (Placeholder branding)** — Logo SVG, favicon SVG, and favicon ICO files exist and render correctly in browser

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- Added a "Get Involved" CTA section at the bottom of homepage (not in original plan but completes the page layout)
- Used emoji icons with `aria-hidden="true"` for the feature list instead of SVG icon assets — simpler, no additional files needed
- Hamburger button needed `ml-auto` class added after initial implementation to fix positioning in 3-child flex container

## Known Limitations

- Logo SVG uses `<text>` element with system font fallback — rendering varies across systems. A path-based SVG would be more consistent but requires the actual branding asset (deferred to R017)
- favicon.ico is a simple pixel-art "F" — adequate as placeholder, awaiting final branding
- Desktop dropdown sub-menus use CSS-only approach — if animation or transition requirements emerge, may need JS enhancement
- VoiceOver screen reader testing not performed (recommended but not blocking per plan)

## Follow-ups

- none

## Files Created/Modified

- `src-astro/src/styles/global.css` — Green token updated, typography base layer, focus indicators, reduced-motion query
- `src-astro/src/components/LFBanner.astro` — New Linux Foundation attribution banner component
- `src-astro/src/components/Header.astro` — Full responsive styling, hamburger menu, CSS dropdowns, toggle script, logo image
- `src-astro/src/components/Footer.astro` — Dark-blue styled footer with LF attribution, back-to-top link
- `src-astro/src/pages/index.astro` — Homepage with hero, CTA cards, feature list, get-involved sections
- `src-astro/src/layouts/BaseLayout.astro` — LFBanner import, favicon links, id="top" on html
- `src-astro/public/logo.svg` — Placeholder FAIR text wordmark SVG
- `src-astro/public/favicon.svg` — F letter on blue background SVG favicon
- `src-astro/public/favicon.ico` — 32×32 BMP-based ICO favicon

## Forward Intelligence

### What the next slice should know
- The homepage layout is complete but all other pages (about, governance, blog, etc.) are unstyled `.astro` stubs or don't exist yet. S03 should use the same section styling patterns (alternating `bg-light-gray`/`bg-white`, max-width container, consistent spacing) established on the homepage.
- The SEO component from S01 is wired into BaseLayout and accepts props — every new page just needs to pass `title`, `description`, and optionally `type`/`image`/`jsonLD` to BaseLayout.

### What's fragile
- `logo.svg` uses a `<text>` element — it won't render identically everywhere. When final branding assets are ready, replace with a path-based SVG.
- The hamburger `<script>` in Header.astro handles toggle/Escape/outside-click/resize. If Astro view transitions are added later, the script may need re-initialization on navigation.

### Authoritative diagnostics
- Lighthouse CLI (`npx lighthouse http://localhost:4321 --only-categories=accessibility --output=json --chrome-flags="--headless --no-sandbox"`) — the most reliable accessibility signal. Parse `categories.accessibility.score`.
- `grep '#1a7f53' src/styles/global.css` — confirms the AA-compliant green token is in place.
- `document.querySelector('#menu-toggle').getAttribute('aria-expanded')` — confirms hamburger state in browser console.

### What assumptions changed
- Expected to need code fixes in T04 after accessibility audit — none were needed. T01–T03 produced a fully accessible site on the first pass.
