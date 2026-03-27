---
id: T03
parent: S03
milestone: M001
provides:
  - 3 about pages (about, fairs-mandate, fair-initiatives) rendering at /about/ paths
  - 5 governance pages (index, TSC, Linux Foundation, Code of Conduct, antitrust-policy) rendering at /governance/ paths
  - Full Code of Conduct from WP REST API (21K chars) — not just the 2-paragraph GitHub repo intro
key_files:
  - src-astro/src/pages/about/index.astro
  - src-astro/src/pages/about/fairs-mandate.astro
  - src-astro/src/pages/about/fair-initiatives.astro
  - src-astro/src/pages/governance/index.astro
  - src-astro/src/pages/governance/technical-steering-committee.astro
  - src-astro/src/pages/governance/linux-foundation.astro
  - src-astro/src/pages/governance/code-of-conduct.astro
  - src-astro/src/pages/governance/antitrust-policy.astro
key_decisions:
  - "Static page pattern: .astro files with inline HTML in a prose div, scoped prose styles per page — no Markdown content collection for static pages since each page is unique and doesn't need collection features"
  - "Content sourced from fairpm/website-content GitHub repo (main branch, root-level about/ and governance/ dirs) except Code of Conduct which uses WP REST API for the full 21K-char version"
patterns_established:
  - "Static page template: BaseLayout wrapper → section.bg-white → div.max-w-4xl.mx-auto.px-4.py-16 → div.prose → semantic HTML content with scoped prose styles"
  - "External link pattern on static pages: rel='noopener noreferrer' target='_blank' with sr-only '(opens in new tab)' indicator"
  - "Internal links use relative paths (e.g. /governance/, /get-involved/fair-working-groups/) — no domain prefix"
observability_surfaces:
  - "ls dist/about/ dist/governance/ — shows all generated page directories"
  - "grep '<h1' dist/governance/code-of-conduct/index.html — confirms page has real content"
  - "wc -c dist/governance/code-of-conduct/index.html — 33K+ bytes confirms full CoC"
  - "Build errors surface at build time with exact file and line for broken imports or invalid props"
duration: 15m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T03: Migrate 8 governance and about static pages

**All 8 governance and about pages render at correct URLs with full content from GitHub repo sources and WP REST API (Code of Conduct).**

## What Happened

Fetched Markdown content from the `fairpm/website-content` GitHub repo for 7 pages (3 about, 4 governance) and the full Code of Conduct from the WP REST API (21,954 chars). Converted all content to `.astro` page files using the established static page pattern: BaseLayout with title/description props, semantic sections with `max-w-4xl` container, and `prose` div with scoped typography styles.

The Code of Conduct page uses the full WP content including all sections (Introduction, Statement of Intent, Code, Scope, Glossary, Incident Procedure, Enforcement Guidelines, Behavioral Examples, Credits) rather than the repo's 2-paragraph intro that just links to GitHub. WP HTML was cleaned: stripped `wp-block-*` classes, removed empty anchor links from headings, preserved heading hierarchy and semantic structure.

The antitrust-policy page is a brief intro with an external link to the Linux Foundation's full policy document — rendered as described in the plan.

## Verification

- `cd src-astro && npm run build` — exits 0, 19 pages built
- `ls dist/about/index.html dist/about/fairs-mandate/index.html dist/about/fair-initiatives/index.html` — all 3 exist ✅
- `ls dist/governance/index.html dist/governance/technical-steering-committee/index.html dist/governance/linux-foundation/index.html dist/governance/code-of-conduct/index.html dist/governance/antitrust-policy/index.html` — all 5 exist ✅
- All 8 pages have `<h1>` tags with meaningful content ✅
- All 8 pages have page-specific `<title>` tags (not just "FAIR") ✅
- Code of Conduct page is 33,524 bytes — well over 5KB threshold ✅
- External links use `rel="noopener noreferrer" target="_blank"` with sr-only indicators ✅

### Slice-level verification (partial — intermediate task)

- ✅ `npm run build` exits 0 with 19 pages (28+ requires T04 pages)
- ✅ `ls dist/blog/*/index.html | wc -l` equals 9
- ✅ 8 of 15 static pages now exist (7 remaining for T04)
- ✅ RSS feed contains 9 items
- ✅ Blog listing contains all 9 post titles
- ✅ Blog images: 5 PNGs in src/assets/images/blog/
- ⬜ 7 remaining static pages (roadmap, privacy-policy, terms-of-use, get-involved, fair-working-groups, fair-knowledge-base, rethinking-wordpress-distribution) — T04

## Diagnostics

- `ls dist/about/ dist/governance/` — lists all generated page directories
- `grep '<h1' dist/<section>/<page>/index.html` — confirms page has content
- `wc -c dist/governance/code-of-conduct/index.html` — should be 33K+ (full CoC)
- Build errors show exact file path and line number for any broken import or prop issue

## Deviations

- GitHub repo structure uses root-level `about/` and `governance/` dirs (not `content/about/` as the task plan assumed) — adjusted raw URLs accordingly
- Prose styles are scoped per-page via `<style>` blocks rather than extracted to a shared component — keeps pages self-contained and matches the pattern established in BlogPost.astro

## Known Issues

None.

## Files Created/Modified

- `src-astro/src/pages/about/index.astro` — About FAIR page
- `src-astro/src/pages/about/fairs-mandate.astro` — FAIR's Mandate page with core values
- `src-astro/src/pages/about/fair-initiatives.astro` — FAIR Initiatives overview
- `src-astro/src/pages/governance/index.astro` — Policy & Governance page with org structure
- `src-astro/src/pages/governance/technical-steering-committee.astro` — TSC page
- `src-astro/src/pages/governance/linux-foundation.astro` — Linux Foundation page
- `src-astro/src/pages/governance/code-of-conduct.astro` — Full Code of Conduct (21K chars from WP)
- `src-astro/src/pages/governance/antitrust-policy.astro` — Antitrust policy with LF link
