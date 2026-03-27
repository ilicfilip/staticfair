---
estimated_steps: 7
estimated_files: 7
---

# T03: Style Footer, homepage sections, and placeholder logo/favicon

**Slice:** S02 — Design Refresh & Accessibility
**Milestone:** M001

## Description

Completes the visual design for all remaining visible elements: styled footer with dark-blue background, homepage content sections with hero/cards/features, and placeholder branding assets (FAIR text logo SVG + favicon). After this task, the full design refresh is visible.

## Steps

1. Create `src-astro/public/logo.svg`: a clean FAIR text wordmark SVG. White text by default (for dark/blue backgrounds), simple sans-serif letterforms. Add a comment at the top: `<!-- Placeholder logo — replace with final branding per R017 -->`. Keep it minimal — purely typographic, no icon.
2. Create `src-astro/public/favicon.svg`: a small square SVG with the letter "F" or "FAIR" initials on a blue (`#0073aa`) background with white text. Add same placeholder comment.
3. Generate `src-astro/public/favicon.ico` from the SVG concept — use a simple 32×32 ICO file. If generating programmatically is complex, create a minimal PNG-based approach or document that favicon.ico should be generated from the SVG.
4. Add favicon links to `BaseLayout.astro` `<head>`: `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` and `<link rel="icon" href="/favicon.ico" sizes="32x32">`. Keep the existing head content intact.
5. Style `Footer.astro`: dark-blue background (`bg-dark-blue`), white text, `data-focus-dark` for white focus rings. Horizontal link list centered or spread. "Hosted by the Linux Foundation" attribution with link. Copyright line. Optional back-to-top link (`<a href="#top">`) anchored to a `id="top"` on `<body>` or `<html>`. Padding and max-width container matching header.
6. Restyle `index.astro` homepage sections:
   - Hero section: light-gray background (`bg-light-gray`), full-width, centered content with max-w-4xl, large h1 in dark-blue, body text in dark-gray, green CTA link styled as a visible button or bold link
   - Package explorer CTA: two side-by-side cards (Plugins / Themes) linking to `/packages/plugins/` and `/packages/themes/`, using brand colors as accents, with brief description text
   - "FAIR is:" feature list section: bulleted or icon-based list of key FAIR attributes, using the established typography
   - Wrap sections with appropriate vertical spacing and alternating background colors (white / light-gray)
7. Wire logo SVG into Header.astro: replace the text "FAIR" in the logo `<a>` with an `<img src="/logo.svg" alt="FAIR" class="h-8">` (or inline SVG). Ensure the alt text is correct for accessibility.

## Must-Haves

- [ ] `public/logo.svg` exists with FAIR wordmark, documented as placeholder
- [ ] `public/favicon.svg` exists with FAIR initials on brand color
- [ ] Favicon links in BaseLayout `<head>`
- [ ] Footer has dark-blue background with white text and LF attribution
- [ ] Footer links are keyboard-accessible with visible focus
- [ ] Homepage has styled hero, CTA cards, and feature list sections
- [ ] Hero CTA link uses the corrected green (`#1a7f53`) — not orange on white
- [ ] Logo visible in header
- [ ] Build passes (`npm run build` exit 0)

## Verification

- `test -f src-astro/public/logo.svg && echo "logo exists"` — confirms file created
- `test -f src-astro/public/favicon.svg && echo "favicon exists"` — confirms file created
- `grep 'favicon' src-astro/src/layouts/BaseLayout.astro` — confirms favicon links in head
- Dev server: footer renders with dark-blue bg, white text visible
- Dev server: homepage shows hero + cards + feature list with visual hierarchy
- Dev server: FAIR logo visible in header
- `npm run build` exit 0

## Observability Impact

- Signals added/changed: None (static assets and CSS styling)
- How a future agent inspects this: Check `public/` for branding assets. Visual verification in browser. `grep 'favicon' dist/index.html` to confirm favicon links in built output.
- Failure state exposed: Missing favicon = 404 in browser network tab. Missing logo = broken img in header.

## Inputs

- `src-astro/src/components/Footer.astro` — semantic footer skeleton (from S01)
- `src-astro/src/pages/index.astro` — homepage with basic content (from S01)
- `src-astro/src/components/Header.astro` — styled header (from T02) — logo `<a>` to update with SVG
- `src-astro/src/layouts/BaseLayout.astro` — layout head for favicon links (from T02 with LFBanner)
- `src-astro/src/styles/global.css` — typography and focus styles (from T01)
- S02-RESEARCH.md — footer design reference, homepage section layout, typography tokens

## Expected Output

- `src-astro/public/logo.svg` — FAIR text wordmark placeholder
- `src-astro/public/favicon.svg` — FAIR initials favicon
- `src-astro/public/favicon.ico` — ICO format favicon (or documented generation step)
- `src-astro/src/components/Footer.astro` — fully styled dark-blue footer
- `src-astro/src/pages/index.astro` — homepage with styled hero, CTA cards, and feature list
- `src-astro/src/components/Header.astro` — updated with logo SVG image
- `src-astro/src/layouts/BaseLayout.astro` — updated with favicon links in head
