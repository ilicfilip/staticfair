---
estimated_steps: 7
estimated_files: 3
---

# T02: Style Header with responsive nav, hamburger menu, and dropdown sub-menus

**Slice:** S02 — Design Refresh & Accessibility
**Milestone:** M001

## Description

The header is the most complex visual and interactive component. This task creates the Linux Foundation banner, styles the main header bar with blue background and responsive navigation, implements the mobile hamburger menu with correct ARIA attributes, and adds CSS-driven dropdown sub-menus for desktop. The hamburger menu requires a small `<script>` for toggling — the only client-side JS in the entire site.

## Steps

1. Create `src-astro/src/components/LFBanner.astro`: a thin dark strip (`bg-[#232323]` or `bg-black`) with "A Linux Foundation Project" text in white/gray small font, linking to linuxfoundation.org. Add `data-focus-dark` attribute so focus indicators use white outline. Keep it simple — one line of text, right-aligned or centered.
2. Compose LFBanner into `BaseLayout.astro` — place it just inside `<body>` before the skip-to-content link (or just after, but before Header). The LF banner sits above the main header.
3. Restyle `Header.astro` with Tailwind classes:
   - Outer `<header>`: `bg-blue` background, padding, `data-focus-dark` for white focus rings
   - Inner container: max-width, flex row, items-center, justify-between
   - Logo/site name: `<a>` with FAIR text (or logo SVG once T03 creates it), white, font-bold, text-xl
   - Add hamburger `<button>` visible only below lg breakpoint (1024px): `aria-expanded="false"`, `aria-controls="main-menu"`, `aria-label="Menu"`, three-line hamburger icon (CSS or inline SVG), white color. Hidden on desktop with `hidden lg:hidden` (visible only on mobile).
   - Nav `<ul id="main-menu">`: hidden on mobile by default (`hidden lg:flex`), shown when hamburger is open. On desktop: horizontal flex row with white links. On mobile: vertical stack with white bg and dark text (or white on blue — choose what passes contrast).
4. Implement dropdown sub-menus for desktop:
   - Each `<li>` with a nested `<ul>` becomes a dropdown group
   - Desktop: sub-`<ul>` is `absolute`, hidden by default, shown on parent `<li>:hover` and `<li>:focus-within` using Tailwind `group-hover:` or CSS rule in a `<style>` block
   - Sub-menu: white background, dark-blue text, box-shadow, rounded corners, z-10+
   - Mobile: sub-menus display inline (always visible within the mobile menu stack) — no toggle needed since the mobile menu is already a vertical list
5. Add `<script>` at the bottom of Header.astro for hamburger interactivity:
   - Query the hamburger button and `#main-menu`
   - On button click: toggle `aria-expanded` between "true"/"false", toggle menu visibility (add/remove `hidden` class)
   - On Escape key (when menu is open): close menu, return focus to hamburger button
   - On click outside menu: close menu
   - On resize above 1024px: ensure menu resets to desktop state (remove hidden if it was toggled)
6. Verify keyboard navigation: Tab from skip-link → LF banner link → logo → first nav item → through all items → dropdowns accessible via focus-within. On mobile, Tab through hamburger → open → nav items.
7. Run `npm run build` to confirm no breakage.

## Must-Haves

- [ ] LF banner renders above header with correct text and link
- [ ] Header has blue background with white text
- [ ] Hamburger button has `aria-expanded`, `aria-controls="main-menu"`, `aria-label="Menu"`
- [ ] Hamburger visible only below 1024px, nav links visible on desktop
- [ ] Hamburger toggles menu open/close with correct ARIA state
- [ ] Escape key closes mobile menu and returns focus to hamburger
- [ ] Desktop dropdowns appear on hover and focus-within
- [ ] Sub-menu items reachable by keyboard (Tab/arrow through)
- [ ] Focus indicators visible (white rings on dark backgrounds)
- [ ] Build passes (`npm run build` exit 0)

## Verification

- Desktop viewport (1024px+): nav links visible in horizontal row, hamburger hidden, dropdowns appear on hover over "About FAIR" etc.
- Mobile viewport (375px): only hamburger and logo visible, clicking hamburger shows nav, `aria-expanded` toggles, Escape closes
- Tab through entire header on desktop — every link gets focus with visible ring
- `grep 'aria-expanded' src-astro/src/components/Header.astro` — confirms ARIA attribute present
- `grep 'aria-controls' src-astro/src/components/Header.astro` — confirms attribute present
- `npm run build` exit 0

## Observability Impact

- Signals added/changed: `aria-expanded` attribute on hamburger button reflects menu state; queryable via `document.querySelector('[aria-expanded]').getAttribute('aria-expanded')`
- How a future agent inspects this: Browser devtools → check `#main-menu` visibility and hamburger `aria-expanded` value. Accessibility tree shows expanded/collapsed state.
- Failure state exposed: If hamburger script fails to load, menu stays hidden on mobile — diagnosable by checking `aria-expanded` never changes from "false"

## Inputs

- `src-astro/src/components/Header.astro` — semantic nav skeleton with full link hierarchy (from S01)
- `src-astro/src/layouts/BaseLayout.astro` — body structure where LF banner is composed (from S01)
- `src-astro/src/styles/global.css` — updated with focus indicators and typography (from T01)
- S02-RESEARCH.md — header design reference, mobile nav pattern, dropdown approach

## Expected Output

- `src-astro/src/components/LFBanner.astro` — new Linux Foundation attribution banner component
- `src-astro/src/components/Header.astro` — fully styled responsive header with hamburger and dropdowns
- `src-astro/src/layouts/BaseLayout.astro` — updated with LFBanner import and placement
