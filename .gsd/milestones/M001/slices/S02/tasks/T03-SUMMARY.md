---
id: T03
parent: S02
milestone: M001
provides:
  - Styled dark-blue footer with white text, LF attribution, back-to-top link, and keyboard-accessible links
  - Homepage with hero section (light-gray bg, green CTA button), package explorer CTA cards (Plugins/Themes), "FAIR is:" feature list, and Get Involved CTA section
  - Placeholder FAIR text wordmark SVG (logo.svg) wired into header
  - Placeholder favicon (SVG + ICO) with favicon links in BaseLayout head
key_files:
  - src-astro/public/logo.svg
  - src-astro/public/favicon.svg
  - src-astro/public/favicon.ico
  - src-astro/src/components/Footer.astro
  - src-astro/src/pages/index.astro
  - src-astro/src/components/Header.astro
  - src-astro/src/layouts/BaseLayout.astro
key_decisions:
  - Hero CTA uses green (#1a7f53) solid button style rather than plain text link — more prominent and accessible
  - Homepage uses alternating bg-light-gray / bg-white sections for visual rhythm
  - Feature list uses emoji icons (🌐 🔓 🤝 🛡️) with aria-hidden — lightweight, no icon library dependency
  - favicon.ico generated programmatically via Node.js (BMP-based ICO, 32x32) — no external tooling required
  - Logo SVG uses text element with system font fallback — renders as FAIR wordmark on any system
patterns_established:
  - Scoped <style> blocks for page-specific CSS (.hero-cta, .cta-card, .feature-item) — keeps styles co-located with component
  - data-focus-dark on dark-background containers (footer) for white focus rings (consistent with T01/T02 pattern)
  - id="top" on <html> element for back-to-top anchor link from footer
observability_surfaces:
  - Missing favicon → 404 in browser network tab
  - Missing logo → broken img in header (alt text "FAIR" still visible)
  - Visual verification via dev server at localhost:4321
duration: 20m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T03: Style Footer, homepage sections, and placeholder logo/favicon

**Styled footer with dark-blue background, built full homepage layout with hero/cards/features sections, created placeholder FAIR logo and favicon SVGs, and wired branding into header and layout head.**

## What Happened

Created all remaining visual elements for the design refresh:

1. **Logo SVG** (`public/logo.svg`): Clean FAIR text wordmark using `<text>` element, white fill (for dark backgrounds), with placeholder comment for future branding replacement.

2. **Favicon files**: `favicon.svg` (F letter on blue #0073aa background) and `favicon.ico` (32×32 BMP-based ICO generated via Node.js script). Both have placeholder comments.

3. **Favicon links**: Added `<link rel="icon">` for both SVG and ICO formats to BaseLayout `<head>`, above the font preload.

4. **Footer** (`Footer.astro`): Dark-blue background (`bg-dark-blue`), white text, `data-focus-dark` for accessible white focus rings. Horizontal link list centered with flex-wrap. "Hosted by The Linux Foundation" attribution with external link. Copyright line. Back-to-top link anchored to `id="top"` on `<html>`.

5. **Homepage** (`index.astro`): Four sections with alternating backgrounds:
   - Hero: light-gray bg, centered H1, description, green (#1a7f53) CTA button
   - Explore Packages: white bg, two side-by-side CTA cards for Plugins/Themes with colored accent bars (blue/green)
   - "FAIR is:": light-gray bg, 2×2 feature grid with emoji icons and descriptions
   - Get Involved: white bg, two CTA buttons (solid green + outlined green)

6. **Header logo**: Replaced text "FAIR" with `<img src="/logo.svg" alt="FAIR">` with explicit width/height attributes.

## Verification

- `npm run build` exits 0 — ✓ no regressions
- `test -f public/logo.svg` — ✓ exists
- `test -f public/favicon.svg` — ✓ exists
- `test -f public/favicon.ico` — ✓ exists
- `grep 'favicon' BaseLayout.astro` — ✓ both favicon links present
- Browser: footer renders with dark-blue bg (`rgb(0, 61, 92)` = #003d5c) — ✓
- Browser: hero CTA button uses green (`rgb(26, 127, 83)` = #1a7f53) — ✓
- Browser: FAIR logo img visible in header — ✓
- Browser: all homepage sections render with correct visual hierarchy — ✓
- Browser: 12/12 browser_assert checks passed (all text sections, logo, footer, CTA elements visible)
- No orange or light-blue text classes on white backgrounds (`grep` found none) — ✓

**Slice V-checks status (T03 is intermediate task, not final):**
- V1: ✅ Build exits 0
- V2: ✅ Green token #1a7f53 in global.css
- V8: ✅ logo.svg and favicon files exist
- V9: ✅ "Linux Foundation" appears 7 times in dist/index.html
- V10: ✅ No text-orange or text-light-blue on white backgrounds
- V3–V7: Deferred to T04 (Lighthouse, keyboard nav, responsive checks)

## Diagnostics

- Check branding assets: `ls src-astro/public/logo.svg src-astro/public/favicon.svg src-astro/public/favicon.ico`
- Favicon in built output: `grep 'favicon' src-astro/dist/index.html`
- Footer dark bg: browser devtools → computed `background-color` on `<footer>` should be `rgb(0, 61, 92)`
- CTA green: browser devtools → computed `background-color` on `.hero-cta` should be `rgb(26, 127, 83)`
- Missing favicon: 404 in browser network tab for `/favicon.svg` or `/favicon.ico`
- Missing logo: broken img element, alt text "FAIR" still renders as accessible text

## Deviations

- Added a "Get Involved" CTA section at the bottom of homepage (not in original plan but completes the page layout with a clear call-to-action before the footer)
- Used emoji icons for feature list instead of SVG icons — simpler, no additional assets needed, with `aria-hidden="true"` for accessibility

## Known Issues

- Logo SVG uses `<text>` element which depends on system fonts — on systems without sans-serif fonts it may render differently. A path-based SVG would be more consistent but requires the actual branding asset.
- favicon.ico is a simple pixel-art F — adequate as placeholder but should be replaced with final branding.

## Files Created/Modified

- `src-astro/public/logo.svg` — FAIR text wordmark SVG (placeholder, white text for dark backgrounds)
- `src-astro/public/favicon.svg` — F letter on blue background SVG favicon (placeholder)
- `src-astro/public/favicon.ico` — 32×32 BMP-based ICO favicon generated via Node.js
- `src-astro/src/components/Footer.astro` — Styled with dark-blue bg, white text, LF attribution, back-to-top link
- `src-astro/src/pages/index.astro` — Full homepage with hero, CTA cards, feature list, get-involved sections
- `src-astro/src/components/Header.astro` — Logo text replaced with `<img src="/logo.svg">`
- `src-astro/src/layouts/BaseLayout.astro` — Added favicon links and id="top" on html element
