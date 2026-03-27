# S02: Design Refresh & Accessibility — UAT

**Milestone:** M001
**Written:** 2026-03-27

## UAT Type

- UAT mode: live-runtime
- Why this mode is sufficient: All design and accessibility claims require a running dev server and browser interaction to verify. Lighthouse audit, keyboard navigation, responsive layout, and visual rendering are runtime-only signals. Build-time checks (grep, file existence) supplement but do not replace runtime verification.

## Preconditions

- `cd src-astro && npm run dev` running at `http://localhost:4321`
- Modern browser (Chrome/Firefox/Safari) with devtools available
- No browser extensions that modify accessibility (disable ad blockers, dark mode extensions)

## Smoke Test

Open `http://localhost:4321` — homepage renders with blue header bar, FAIR logo, Linux Foundation banner above header, hero section with green CTA button, and dark-blue footer. No console errors.

## Test Cases

### 1. Color contrast — WCAG AA compliance

1. Open homepage in browser
2. Inspect the green CTA button ("Explore the FAIR Project") — check computed `background-color`
3. **Expected:** `rgb(26, 127, 83)` (#1a7f53) — contrast ratio ≥4.5:1 against white text

### 2. Responsive header — desktop

1. Set viewport to 1280px wide
2. Observe header navigation
3. Hover over "About FAIR" nav item
4. **Expected:** Horizontal nav links visible, hamburger button hidden. Dropdown sub-menu appears on hover with white background and shadow, containing links to FAIR's Mandate, Initiatives, Roadmap.

### 3. Responsive header — mobile hamburger

1. Set viewport to 375px wide
2. Observe header — only logo and hamburger icon visible
3. Click hamburger button
4. Tab through menu items
5. Press Escape
6. **Expected:** Menu opens showing all nav links vertically on dark-blue background. `aria-expanded` changes to "true". Tab moves through menu items. Escape closes menu, `aria-expanded` returns to "false", focus returns to hamburger button.

### 4. Keyboard navigation — full page

1. At desktop viewport, press Tab repeatedly from the top of the page
2. Observe focus indicators on each interactive element
3. **Expected:** First Tab reveals skip-to-content link. Subsequent Tabs move through: LF banner link → logo → nav items → dropdown sub-items (via focus-within) → hero CTA → card links → bottom CTAs → footer links → back-to-top link. Every focused element has a visible 2px outline — blue on light backgrounds, white on dark backgrounds (header, LF banner, footer).

### 5. Skip-to-content link

1. Load homepage fresh
2. Press Tab once
3. Press Enter on the skip-to-content link
4. **Expected:** Skip-to-content link appears visually on focus (white bg, blue text, positioned at top). Pressing Enter scrolls/jumps focus to `#main-content`.

### 6. Homepage sections

1. Scroll through the full homepage
2. **Expected:** Four distinct sections visible:
   - Hero: light-gray background, "Federated and Independent Repositories" heading, green CTA button
   - Explore Packages: white background, two side-by-side cards (Plugins/Themes) with colored accent bars
   - "FAIR is:": light-gray background, 2×2 feature grid with emoji icons
   - Get Involved: white background, two CTA buttons (solid green + outlined green)

### 7. Footer

1. Scroll to page bottom
2. **Expected:** Dark-blue background footer with white text. Contains navigation links, "Hosted by The Linux Foundation" attribution with link, copyright line, and back-to-top link.

### 8. Linux Foundation banner

1. Look at the very top of the page (above the blue header)
2. **Expected:** Dark (#232323) narrow strip with "A Linux Foundation Project" text linking to linuxfoundation.org.

### 9. Placeholder branding

1. Check header for FAIR logo
2. Check browser tab for favicon
3. **Expected:** FAIR text wordmark visible in header (white text on blue). Browser tab shows "F" favicon on blue background.

### 10. Lighthouse accessibility audit

1. Run `npx lighthouse http://localhost:4321 --only-categories=accessibility --output=json --chrome-flags="--headless --no-sandbox"`
2. Parse JSON output for `categories.accessibility.score`
3. **Expected:** Score ≥ 0.9 (90%). Actual achieved: 1.0 (100%).

## Edge Cases

### Reduced motion preference

1. Enable `prefers-reduced-motion: reduce` in browser devtools (Rendering panel)
2. Navigate the page — hover states, focus transitions
3. **Expected:** No CSS animations or transitions fire. Smooth scrolling disabled.

### Very narrow viewport (320px)

1. Set viewport width to 320px
2. **Expected:** No horizontal overflow (`scrollWidth === clientWidth`). All content readable. Hamburger menu functional.

### Desktop dropdown keyboard access

1. At 1024px+ viewport, Tab to "About FAIR" nav link
2. Continue tabbing
3. **Expected:** Focus-within triggers dropdown to appear. Tab moves through dropdown items (FAIR's Mandate, FAIR Initiatives, Roadmap). Tabbing past last dropdown item closes it and moves to next top-level nav item.

## Failure Signals

- Hamburger button visible at desktop viewport width (≥1024px) — responsive breakpoint broken
- Focus ring invisible on any interactive element — focus indicator CSS missing or overridden
- No skip-to-content link on first Tab — link missing or `sr-only` class not removing on focus
- Green CTA button color is `#25b372` instead of `#1a7f53` — old token not updated
- 404 for `/favicon.svg` or `/favicon.ico` in network tab — favicon files missing or not in public/
- Lighthouse accessibility score below 90 — accessibility regression
- Horizontal scrollbar at 375px — content overflowing mobile viewport
- `aria-expanded` not toggling on hamburger click — script not loading or event handler broken

## Requirements Proved By This UAT

- **R007 (Accessibility WCAG AA)** — Lighthouse 100%, keyboard navigation complete, focus indicators visible on all backgrounds, skip-to-content functional, ARIA attributes correct, `prefers-reduced-motion` respected, heading hierarchy valid, all ARIA landmarks present
- **R009 (Responsive design)** — Layout verified at 375px, 768px, and 1280px. Hamburger menu on mobile, full nav on desktop. No horizontal overflow.
- **R012 (Design refresh)** — Full visual refresh verified: styled header/footer, homepage sections, typography, color tokens, all using Mona Sans and brand palette
- **R013 (Placeholder branding)** — Logo and favicon files exist and render correctly

## Not Proven By This UAT

- **R007 partial** — VoiceOver/NVDA screen reader testing not performed (recommended but not blocking). Full site-wide accessibility not proven — only homepage tested; content pages from S03 may introduce new issues.
- **R009 partial** — Only homepage responsive layout tested. Content pages and blog posts from S03 need their own responsive verification.
- **R008 (Image optimization)** — No content images exist yet (S03 scope)
- **R004 (SEO completeness)** — JSON-LD structured data and unique meta descriptions are S04 scope
- **R006 (URL preservation)** — Redirects are S05 scope

## Notes for Tester

- The logo SVG uses a `<text>` element with system fonts — it may render slightly differently across OS/browser combinations. This is expected for a placeholder; final branding (R017) will use a path-based SVG.
- The favicon.ico is a minimal 32×32 pixel "F" — it's intentionally simple as a placeholder.
- Mobile sub-menus display inline (all items visible when hamburger opens) rather than as nested collapsible sections. This is an intentional simplification for the current nav depth.
- Only 1 page exists (homepage). Lighthouse and keyboard tests cover the entire rendered site at this point.
