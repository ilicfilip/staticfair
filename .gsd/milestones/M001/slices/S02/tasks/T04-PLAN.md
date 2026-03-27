---
estimated_steps: 6
estimated_files: 4
---

# T04: Accessibility audit, keyboard nav verification, and Lighthouse ≥90

**Slice:** S02 — Design Refresh & Accessibility
**Milestone:** M001

## Description

Final verification and fix-up task. Runs the complete accessibility audit, tests keyboard navigation end-to-end, checks responsive layout at three breakpoints, runs Lighthouse, and fixes any issues found. This is the task that proves R007 (Accessibility), R009 (Responsive), and validates the full S02 slice is complete.

## Steps

1. Start dev server (`cd src-astro && npm run dev`). Open browser at localhost:4321.
2. Keyboard navigation audit:
   - Press Tab from page load — skip-to-content link should appear visually above header
   - Continue tabbing: LF banner link → logo → each nav item → CTA link → footer links
   - On dark-blue header/footer: confirm focus ring is white (not blue-on-blue invisible)
   - On light-gray/white sections: confirm focus ring is blue
   - No interactive element should be skipped or unreachable
   - Fix any issues found (z-index on skip link, tabindex problems, missing focus styles)
3. Mobile hamburger audit (set viewport to 375px):
   - Hamburger button visible, nav links hidden
   - Click hamburger → menu opens, `aria-expanded="true"`
   - Tab through menu items — all reachable
   - Press Escape → menu closes, focus returns to hamburger, `aria-expanded="false"`
   - Fix any issues (focus trap, incorrect ARIA state, menu not closing)
4. Heading hierarchy and semantic audit:
   - Confirm single `<h1>` on homepage
   - Confirm no skipped heading levels (h1→h2→h3, no h1→h3)
   - Confirm all landmark elements present: `<header>`, `<nav aria-label="Main">`, `<main id="main-content">`, `<footer>`, `<nav aria-label="Footer">`
   - Check all images have alt text (logo SVG)
   - Check `lang="en"` on `<html>` (from S01)
5. Responsive layout check at three breakpoints:
   - 375px (mobile): single-column, hamburger visible, content readable, no horizontal overflow
   - 768px (tablet): content width adapts, hamburger may still show, cards stack or side-by-side
   - 1024px+ (desktop): full nav visible, cards side-by-side, max-width container
   - Fix any layout breaks
6. Run Lighthouse accessibility audit on homepage. Target ≥90 (0.9). If score is below 90, read the specific issues flagged, fix them, and re-run. Common fixes: missing button labels, insufficient contrast on specific elements, missing landmark labels, form inputs without labels.

## Must-Haves

- [ ] Skip-to-content link visible on first Tab press
- [ ] Every interactive element has visible focus indicator
- [ ] Focus indicators visible on both light and dark backgrounds
- [ ] Hamburger menu keyboard-accessible (open, Tab through, Escape to close)
- [ ] `aria-expanded` correctly reflects menu state
- [ ] Single h1, no skipped heading levels
- [ ] All ARIA landmarks present
- [ ] All images have alt text
- [ ] `prefers-reduced-motion` media query present in CSS
- [ ] Responsive layout correct at 375px, 768px, and 1024px+
- [ ] Lighthouse accessibility ≥90 on homepage
- [ ] `npm run build` exit 0

## Verification

- Lighthouse accessibility score ≥90 (the primary objective metric)
- All 10 V-checks from S02-PLAN pass (V1–V10)
- Browser Tab-through: zero unreachable interactive elements, zero invisible focus rings
- Mobile hamburger: open → Tab through → Escape → focus returns to button
- Three viewport sizes checked with no layout breaks
- `npm run build` exit 0

## Observability Impact

- Signals added/changed: None (this task audits and fixes, not adds new signals)
- How a future agent inspects this: Run `npx lighthouse http://localhost:4321 --only-categories=accessibility --output=json` and check `categories.accessibility.score`. Browser devtools Accessibility pane for ARIA tree.
- Failure state exposed: Lighthouse audit provides specific element selectors and descriptions for every failing check — directly actionable.

## Inputs

- All files from T01–T03 (complete styled site)
- S02-RESEARCH.md accessibility checklist
- S02-PLAN.md V1–V10 verification list

## Expected Output

- `src-astro/src/components/Header.astro` — any accessibility fixes (ARIA, focus, keyboard)
- `src-astro/src/styles/global.css` — any focus indicator or contrast fixes
- `src-astro/src/layouts/BaseLayout.astro` — any semantic/landmark fixes
- `src-astro/src/pages/index.astro` — any heading hierarchy or contrast fixes
- All S02 verification checks (V1–V10) passing
- Lighthouse accessibility ≥90 confirmed
