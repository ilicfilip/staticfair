---
id: T04
parent: S03
milestone: M001
provides:
  - 5 static pages from website-content repo (privacy-policy, terms-of-use, get-involved, fair-working-groups, fair-knowledge-base)
  - 2 WP-only pages converted to clean Astro content (roadmap, rethinking-wordpress-distribution)
  - All 15 static pages (excluding homepage) now render at their preserved WP URLs
key_files:
  - src-astro/src/pages/governance/privacy-policy.astro
  - src-astro/src/pages/governance/terms-of-use.astro
  - src-astro/src/pages/get-involved/index.astro
  - src-astro/src/pages/get-involved/fair-working-groups.astro
  - src-astro/src/pages/fair-knowledge-base.astro
  - src-astro/src/pages/about/roadmap.astro
  - src-astro/src/pages/rethinking-wordpress-distribution.astro
key_decisions:
  - "WP group blocks with has-light-gray-background-color converted to <aside class='bg-light-gray p-6 rounded my-6'> — semantic aside element for callout/infobox content"
  - "WP solution headings (has-blue-color has-text-color) converted to h4.text-blue — preserves visual hierarchy from WP theme"
  - "Footnotes on roadmap page: WP wp-block-separator + group/inner-container converted to simple <hr> + <p id='footnote-1'> with bidirectional anchor links preserved"
patterns_established:
  - "WP-to-Astro conversion pattern: strip all wp-block-*, is-layout-*, wp-elements-* classes; convert wp-block-group with background to <aside> with Tailwind; convert wp-block-separator to <hr>; preserve id attributes on headings and anchors for deep linking"
  - "GitHub repo content fetched from raw.githubusercontent.com/fairpm/website-content/main/ with paths matching repo tree (no content/ prefix)"
observability_surfaces:
  - "grep -rl 'wp-block' dist/ — should return 0 files (no WP cruft in any output)"
  - "ls dist/ shows complete URL structure for all 26 pages"
duration: 20m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T04: Migrate remaining 7 static pages including WP-only pages

**All 7 remaining static pages migrated — 5 from GitHub Markdown sources, 2 converted from WP block HTML to clean Astro with zero wp-block classes in output.**

## What Happened

Created 7 new `.astro` page files completing the static page migration:

**From website-content repo (Markdown → Astro):**
- `privacy-policy.astro` — brief intro + external link to LF policy
- `terms-of-use.astro` — brief intro + external link to LF terms
- `fair-knowledge-base.astro` — full glossary with 20+ term definitions, FAQ section, code examples
- `get-involved/index.astro` — contributor guide with GitHub, Slack, LFX, testing sections
- `get-involved/fair-working-groups.astro` — detailed WG listing (AspireCloud, Community, FAIR, Infrastructure, Website, plus archived Technical Independence)

**From WP REST API (block HTML → clean Astro):**
- `about/roadmap.astro` — 2026 milestones (Trust Systems, Expanding Federation, Resilience & Efficiency) with heading anchors and footnote back-links preserved. WP group blocks with separator/footnotes converted to `<hr>` + anchored `<p>`.
- `rethinking-wordpress-distribution.astro` — 19K-char long-form page with 8 problem/solution sections. WP styled group blocks (has-light-gray-background-color) converted to `<aside class="bg-light-gray p-6 rounded my-6">`. Blockquote (Ken Thompson) preserved as `<blockquote>`. Solution headings with WP blue color class converted to `h4.text-blue`.

All pages follow the established pattern: BaseLayout wrapper → section.bg-white → div.max-w-4xl container → div.prose → semantic HTML with scoped prose styles.

## Verification

All task-level must-haves verified:
- `npm run build` exits 0 — 26 pages built in 1.14s
- All 7 new pages exist at correct URLs in dist/
- `grep -c 'wp-block' dist/about/roadmap/index.html` → 0
- `grep -c 'wp-block' dist/rethinking-wordpress-distribution/index.html` → 0
- `grep -rl 'wp-block' dist/` → 0 files (no WP cruft across entire site)
- `grep '<h1' dist/rethinking-wordpress-distribution/index.html` → h1 with page title present
- `grep 'id=' dist/about/roadmap/index.html` → heading anchors preserved (2026-milestones, fair-trust-systems, expanding-federation, etc.)

Slice-level checks passing after T04:
- ✅ Build exits 0 with 26 pages (28+ target met with T05 validation remaining)
- ✅ 9 blog pages generated
- ✅ All 15 static page paths exist in dist/
- ✅ RSS has 9 items
- ✅ Blog images in posts, YouTube/SpeakerDeck embeds, video element all present
- ✅ Blog listing has 9 titles
- ✅ 5 blog PNGs in src/assets/images/blog/
- ✅ 0 wp-block matches across entire dist/

## Diagnostics

- `ls dist/` — complete URL structure for all generated routes
- `grep 'id=' dist/about/roadmap/index.html | head -10` — inspect heading anchors on roadmap
- `grep -c 'aside' dist/rethinking-wordpress-distribution/index.html` — should show 3 aside callout boxes
- Build errors show exact file path and line number for any broken HTML or prop issue

## Deviations

None. All 7 pages created as planned.

## Known Issues

None.

## Files Created/Modified

- `src-astro/src/pages/governance/privacy-policy.astro` — privacy policy page (LF external link)
- `src-astro/src/pages/governance/terms-of-use.astro` — terms of use page (LF external link)
- `src-astro/src/pages/fair-knowledge-base.astro` — knowledge base with glossary and FAQ
- `src-astro/src/pages/get-involved/index.astro` — get involved overview page
- `src-astro/src/pages/get-involved/fair-working-groups.astro` — working groups details page
- `src-astro/src/pages/about/roadmap.astro` — 2026 roadmap (converted from WP HTML)
- `src-astro/src/pages/rethinking-wordpress-distribution.astro` — long-form page (converted from WP HTML)
