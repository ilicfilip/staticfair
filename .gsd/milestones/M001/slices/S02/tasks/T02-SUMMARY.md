---
id: T02
parent: S02
milestone: M001
provides:
  - Fully styled responsive header with blue background and white navigation
  - Linux Foundation attribution banner component (LFBanner.astro)
  - Mobile hamburger menu with ARIA-compliant toggle (aria-expanded, aria-controls)
  - Desktop CSS-driven dropdown sub-menus via :hover and :focus-within
  - Client-side script for hamburger toggle, Escape close, outside-click close, resize reset
key_files:
  - src-astro/src/components/LFBanner.astro
  - src-astro/src/components/Header.astro
  - src-astro/src/layouts/BaseLayout.astro
key_decisions:
  - Mobile menu background uses dark-blue (#003d5c) instead of blue to differentiate from header bar
  - Desktop dropdowns use CSS :hover + :focus-within (no JS) — simplest accessible pattern
  - Mobile sub-menus display inline (always visible when menu is open) rather than nested toggles
  - Hamburger icon uses inline SVG (3 lines) rather than CSS pseudo-elements for clarity
patterns_established:
  - Scoped <style> block in Astro components for component-specific CSS (dropdown positioning, mobile menu layout)
  - data-focus-dark attribute on dark-background containers triggers white focus rings (from T01 global.css)
  - <script> tag in Astro component for minimal client-side interactivity (standard Astro pattern, no framework needed)
  - nav-group / dropdown / dropdown-link class naming for header nav structure
observability_surfaces:
  - "aria-expanded attribute on #menu-toggle reflects mobile menu state — queryable via document.querySelector('#menu-toggle').getAttribute('aria-expanded')"
  - "Menu visibility inspectable via document.getElementById('main-menu').classList.contains('hidden')"
duration: 20m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T02: Style Header with responsive nav, hamburger menu, and dropdown sub-menus

**Created LFBanner component, restyled Header.astro with blue bar, responsive hamburger nav, CSS dropdown sub-menus, and ARIA-compliant mobile menu toggle script.**

## What Happened

1. Created `LFBanner.astro` — dark strip (#232323) with right-aligned "A Linux Foundation Project" link to linuxfoundation.org, `data-focus-dark` for white focus rings, external link sr-only indicator.

2. Composed LFBanner into `BaseLayout.astro` — placed between skip-to-content link and Header, so it renders above the main header.

3. Restyled `Header.astro` completely:
   - Blue background (`bg-blue` = #0073aa) with `data-focus-dark` for white focus indicators
   - Max-width container with flex layout, logo left, nav right
   - Hamburger button with SVG icon, visible only below 1024px (`lg:hidden`), with `aria-expanded`, `aria-controls="main-menu"`, `aria-label="Menu"`
   - Desktop nav: horizontal flex row with white links, hover state `bg-white/15`
   - Desktop dropdowns: absolute positioned white panels with dark-blue text, box-shadow, shown on `:hover` and `:focus-within` (CSS only, no JS)
   - Mobile nav: dark-blue vertical stack with white text, sub-menus displayed inline (no nested toggles)

4. Added `<script>` for hamburger interactivity:
   - Click toggle: flips `aria-expanded` and adds/removes `hidden` class on menu
   - Escape key: closes menu and returns focus to hamburger button
   - Click outside: closes menu
   - Resize above 1024px: resets menu to hidden (desktop default state)

5. Fixed hamburger positioning: added `ml-auto` to push button to far-right on mobile (3-child flex with hidden nav was centering it).

## Verification

- **V1 (build):** `npm run build` exits 0 ✅
- **V2 (green token):** `grep '#1a7f53' src/styles/global.css` — present ✅ (from T01)
- **V4 (ARIA):** `grep 'aria-expanded' Header.astro` — present ✅; `grep 'aria-controls' Header.astro` — present ✅
- **V7 (responsive):** Browser at 375px shows hamburger + logo only; 1280px shows full desktop nav ✅
- **V9 (LF banner):** `grep -i 'linux foundation' dist/index.html` — present in built output ✅
- **Desktop dropdown:** Hover on "About FAIR" shows sub-menu with FAIR's Mandate, FAIR Initiatives, Roadmap ✅
- **Desktop keyboard:** Tab through nav → focus-within opens dropdown → sub-menu items reachable ✅
- **Focus indicators:** White 2px solid outline on focused nav links (confirmed via computed styles) ✅
- **Mobile hamburger toggle:** Click opens menu, aria-expanded="true"; Escape closes, returns focus, aria-expanded="false" ✅

Checks not yet passing (expected — later tasks):
- V3 (Lighthouse ≥90): deferred to T04
- V5 (skip-to-content): functional from S01, visual verification in T04
- V6 (all focus indicators): full audit in T04
- V8 (placeholder logo/favicon): T03
- V10 (no orange/light-blue text): visual audit in T04

## Diagnostics

- Hamburger state: `document.querySelector('#menu-toggle').getAttribute('aria-expanded')` — returns "true" or "false"
- Menu visibility: `document.getElementById('main-menu').classList.contains('hidden')` — true when closed
- Focus ring color on header: inspect any focused link in devtools → computed outline-color should be `rgb(255, 255, 255)` (white, from `data-focus-dark` rule)
- If hamburger script fails to load: menu stays permanently hidden on mobile, `aria-expanded` never changes from "false"

## Deviations

- Hamburger button needed `ml-auto` class added after initial implementation — the 3-child flex container (logo, button, nav) with `justify-between` centered the button on mobile since nav had 0 width. `ml-auto` pushes button to right edge.

## Known Issues

None.

## Files Created/Modified

- `src-astro/src/components/LFBanner.astro` — new Linux Foundation attribution banner component
- `src-astro/src/components/Header.astro` — fully restyled with responsive nav, hamburger, dropdowns, and toggle script
- `src-astro/src/layouts/BaseLayout.astro` — added LFBanner import and placement above Header
