# S02: Design Refresh & Accessibility

**Goal:** Apply the full visual design refresh to the Astro site with WCAG AA-compliant colors, responsive layout, accessible navigation, placeholder branding, and visible focus indicators.
**Demo:** Homepage at localhost:4321 shows the styled header (blue bar, responsive nav with hamburger on mobile), styled footer (dark-blue background), hero section, placeholder FAIR logo/favicon, and all interactive elements are keyboard-navigable with visible focus rings. Lighthouse accessibility score ≥90 on homepage.

## Must-Haves

- Green token updated from `#25b372` to `#1a7f53` for WCAG AA compliance (R007, R012)
- All text/background combinations meet WCAG AA contrast ratios (R007)
- Header styled with blue background, white text, responsive nav, hamburger menu on mobile (R009, R012)
- Mobile hamburger menu toggles via `<script>` with correct `aria-expanded`/`aria-controls` (R007, R009)
- Desktop nav has hover/focus-within dropdowns for sub-menus (R007, R009)
- Footer styled with dark-blue background, white text, link grid (R012)
- Linux Foundation attribution banner at top of page (R012)
- Homepage sections styled: hero, CTA cards, feature list (R012)
- Placeholder FAIR text logo SVG in header and as favicon (R013)
- Skip-to-content link visible on focus and functional (R007)
- Visible focus indicators on all interactive elements, on both light and dark backgrounds (R007)
- `prefers-reduced-motion` respected (R007)
- Keyboard navigation works: Tab through all nav items, Escape closes mobile menu (R007)
- Typography system applied: body 18px/1.7, heading scale with mobile reduction (R012)
- Lighthouse accessibility ≥90 on homepage (R007)

## Proof Level

- This slice proves: contract (visual design, accessibility, responsive behavior verified via Lighthouse and browser checks)
- Real runtime required: yes (dev server + browser verification)
- Human/UAT required: no (Lighthouse audit and browser assertions provide objective measurement; VoiceOver UAT is recommended but not blocking)

## Verification

All checks run against `cd src-astro && npm run dev` (localhost:4321):

- **V1:** `npm run build` exits 0 — no build regressions from styling changes
- **V2:** Green token is `#1a7f53` in `global.css` — `grep '#1a7f53' src/styles/global.css`
- **V3:** Homepage Lighthouse accessibility score ≥90 — run Lighthouse in browser devtools or via `npx lighthouse http://localhost:4321 --only-categories=accessibility --output=json --chrome-flags="--headless"` and check `categories.accessibility.score >= 0.9`
- **V4:** Hamburger button has `aria-expanded` and `aria-controls` attributes — check HTML source
- **V5:** Skip-to-content link visible on Tab focus — browser keyboard test
- **V6:** All focus indicators visible — Tab through page in browser, verify ring/outline on every interactive element
- **V7:** Responsive layout works — viewport at 375px (mobile) shows hamburger, 1024px+ shows desktop nav
- **V8:** Placeholder logo SVG exists at `public/logo.svg` and favicon files exist
- **V9:** Built HTML contains Linux Foundation banner markup — `grep -i "linux foundation" dist/index.html`
- **V10:** No orange or light-blue used as text color on white/light backgrounds — visual audit + grep for text-orange, text-light-blue classes in page templates

## Observability / Diagnostics

- Runtime signals: Dev server at localhost:4321 — visual rendering is the primary signal. Build errors surface via `npm run build` exit code.
- Inspection surfaces: Lighthouse CLI for accessibility scoring. Browser devtools accessibility tree for ARIA attributes. `document.querySelectorAll('[aria-expanded]')` in browser console for hamburger state.
- Failure visibility: Lighthouse audit flags specific accessibility issues with element selectors and descriptions. Build failures give exact file/line.
- Redaction constraints: none (no secrets in this slice)

## Integration Closure

- Upstream surfaces consumed: `BaseLayout.astro`, `Header.astro`, `Footer.astro`, `global.css`, `index.astro` (all from S01)
- New wiring introduced in this slice: LF banner component composed into BaseLayout or Header, hamburger `<script>` for mobile nav interactivity, placeholder logo/favicon files in `public/`, typography base styles in `global.css`
- What remains before the milestone is truly usable end-to-end: S03 (content pages), S04 (SEO structured data), S05 (deployment/redirects)

## Tasks

- [x] **T01: Update color tokens, add typography base styles, and global focus indicators** `est:25m`
  - Why: Foundation for all subsequent styling — the green contrast fix (R007), typography scale (R012), and global focus ring styles must be in place before component styling begins
  - Files: `src-astro/src/styles/global.css`
  - Do: Change `--color-green` from `#25b372` to `#1a7f53`. Add base typography styles (body 18px/1.7, heading scale with responsive reduction, font-weight mappings). Add global `focus-visible` ring styles with dark-background variant using `data-theme="dark"` or direct class. Add `prefers-reduced-motion` media query to disable transitions/animations. Add utility class for focus on dark backgrounds.
  - Verify: `grep '#1a7f53' src-astro/src/styles/global.css` returns match. `npm run build` exits 0. Dev server renders text at correct sizes.
  - Done when: Green token updated, typography renders correctly at all heading levels, focus ring visible on a test link in dev server

- [x] **T02: Style Header with responsive nav, hamburger menu, and dropdown sub-menus** `est:40m`
  - Why: The header is the most complex component — responsive layout with mobile hamburger, desktop dropdowns, LF banner, and accessibility (R007, R009, R012). This is the highest-risk task in S02.
  - Files: `src-astro/src/components/Header.astro`, `src-astro/src/components/LFBanner.astro` (new)
  - Do: Create LF banner component (dark strip with "A Linux Foundation Project" text). Restyle Header.astro with blue background (`bg-blue`), white text, FAIR logo link on left, nav on right. Add hamburger `<button>` with `aria-expanded="false"` and `aria-controls="main-menu"`, visible only on mobile (<1024px). Add `<script>` to toggle menu visibility, `aria-expanded`, and handle Escape key. Desktop dropdowns use CSS `:hover` + `:focus-within` on `<li>` parent to show `<ul>` sub-menus. Sub-menus positioned absolutely with white background, shadow, and proper z-index. Compose LF banner into Header (or BaseLayout above Header).
  - Verify: Desktop (1024px+): nav links visible, dropdowns appear on hover/focus. Mobile (375px): hamburger visible, clicking toggles menu, Escape closes menu. `aria-expanded` toggles correctly. Keyboard Tab reaches all nav items.
  - Done when: Header fully styled and responsive, hamburger works with correct ARIA, dropdowns accessible by keyboard and mouse

- [x] **T03: Style Footer, homepage sections, and placeholder logo/favicon** `est:35m`
  - Why: Completes the visual design for all visible elements — footer (R012), homepage content sections (R012), and placeholder branding assets (R013)
  - Files: `src-astro/src/components/Footer.astro`, `src-astro/src/pages/index.astro`, `src-astro/public/logo.svg`, `src-astro/public/favicon.svg`, `src-astro/public/favicon.ico`
  - Do: Style Footer with dark-blue background, white text, horizontal link list, LF attribution, and back-to-top link. Create placeholder FAIR text logo as SVG (clean wordmark, documented for replacement). Generate favicon.svg from logo and convert to favicon.ico. Add favicon links to BaseLayout `<head>`. Style homepage hero section with light-gray background, prominent heading, descriptive text, and green CTA link. Add homepage CTA card section (side-by-side cards for Plugins/Themes linking to /packages/). Add "FAIR is:" feature list section. Wire logo SVG into Header.
  - Verify: Footer renders with dark-blue bg and white text. Homepage shows styled hero + cards. Logo visible in header. Favicon loads in browser tab. `npm run build` exits 0.
  - Done when: Footer styled, homepage sections complete with visual hierarchy, logo.svg and favicon files created and wired into layout

- [x] **T04: Accessibility audit, keyboard nav verification, and Lighthouse ≥90** `est:25m`
  - Why: Final verification task — ensures all accessibility requirements are met end-to-end (R007) and responsive design works across breakpoints (R009). This task catches issues introduced during T01–T03 styling.
  - Files: `src-astro/src/components/Header.astro` (fixes), `src-astro/src/styles/global.css` (fixes), `src-astro/src/layouts/BaseLayout.astro` (fixes)
  - Do: Start dev server. Tab through entire page — verify every interactive element has a visible focus indicator. Test on both light sections and dark header/footer. Verify skip-to-content link appears on first Tab. Test hamburger at 375px viewport — open, Tab through items, Escape to close. Check heading hierarchy (single h1, no skipped levels). Run Lighthouse accessibility audit. Fix any issues found (contrast, missing labels, focus visibility, ARIA). Re-run until score ≥90. Test at 375px, 768px, and 1024px+ viewports for layout correctness.
  - Verify: Lighthouse accessibility ≥90. All interactive elements have visible focus. Skip link works. Hamburger ARIA correct. No heading hierarchy violations. Responsive layout correct at 3 breakpoints.
  - Done when: Lighthouse accessibility ≥90 on homepage, all V1–V10 verification checks pass, no keyboard navigation dead-ends

## Files Likely Touched

- `src-astro/src/styles/global.css` — color token fix, typography base styles, focus indicators
- `src-astro/src/components/Header.astro` — full responsive styling, hamburger menu, dropdowns
- `src-astro/src/components/LFBanner.astro` — new LF attribution banner
- `src-astro/src/components/Footer.astro` — dark-blue styled footer
- `src-astro/src/pages/index.astro` — homepage section styling
- `src-astro/src/layouts/BaseLayout.astro` — favicon links, LF banner composition
- `src-astro/public/logo.svg` — placeholder FAIR wordmark
- `src-astro/public/favicon.svg` — SVG favicon
- `src-astro/public/favicon.ico` — ICO favicon
