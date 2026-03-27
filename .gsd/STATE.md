# GSD State

**Active Milestone:** M001 — WordPress to Astro Migration
**Active Slice:** S02 complete, ready for S03
**Active Task:** none — between slices
**Phase:** S02 complete — slice summary and UAT written

## Progress
- S01 complete: 3/3 tasks done ✅
- S02 complete: 4/4 tasks done ✅
  - T01: ✅ Update color tokens, typography base styles, global focus indicators
  - T02: ✅ Style Header with responsive nav, hamburger menu, dropdowns
  - T03: ✅ Style Footer, homepage sections, placeholder logo/favicon
  - T04: ✅ Accessibility audit, keyboard nav verification, Lighthouse 100%
- S03 pending: Content Migration
- S04 pending: SEO & Structured Data (depends on S01, S03)
- S05 pending: Deployment & Redirects (depends on S01–S04)

## Recent Decisions
- D018: Green token `#1a7f53` replaces `#25b372` for WCAG AA compliance
- D019: Vanilla `<script>` in Header.astro for mobile hamburger (no framework)
- D020: CSS-only `:hover` + `:focus-within` for desktop dropdowns
- D021: `data-focus-dark` attribute for white focus rings on dark backgrounds

## Blockers
- None

## Next Action
Begin S03 (Content Migration) — migrate 18 static pages and 9 blog posts
