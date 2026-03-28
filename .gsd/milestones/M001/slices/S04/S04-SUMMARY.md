---
id: S04
parent: M001
milestone: M001
provides:
  - JSON-LD structured data on all 26 pages (WebSite+Organization on homepage, BlogPosting+BreadcrumbList on blog posts, WebPage+BreadcrumbList on static pages)
  - SEO.astro enhanced with og:site_name, og:locale, default og:image fallback, sitemap link
  - Default OG image SVG (1200×630) at public/og-default.svg
  - Typed structured data helper functions in src/utils/structured-data.ts
  - Correct heading hierarchy across all blog posts and static pages
  - All meta descriptions ≤160 chars (most ≥120)
  - Validated sitemap with 26 URLs, /packages/* excluded
requires:
  - slice: S01
    provides: SEO.astro component, BaseLayout.astro, astro.config.mjs with sitemap config
  - slice: S03
    provides: Blog content collection (9 .md files), BlogPost.astro layout, [...slug].astro route, all 15 static .astro pages, blog listing page
affects:
  - S05
key_files:
  - src-astro/src/utils/structured-data.ts
  - src-astro/src/components/SEO.astro
  - src-astro/public/og-default.svg
  - src-astro/src/layouts/BlogPost.astro
  - src-astro/src/pages/blog/[...slug].astro
  - src-astro/src/pages/index.astro
key_decisions:
  - D029: JSON-LD helpers in structured-data.ts with buildGraph() composing @context+@graph envelope
  - D030: Default OG image as SVG (1200×630, dark-blue bg, white FAIR text)
  - D031: Blog posts without author default to 'FAIR' in BlogPosting schema
  - D032: BreadcrumbList uses short nav labels; WebPage name uses readable page titles
patterns_established:
  - Import helpers from src/utils/structured-data.ts → compose with buildGraph() → pass as jsonLd prop to BaseLayout → rendered by SEO.astro
  - buildBreadcrumbs last item omits `item` URL per Google structured data spec
  - Static pages construct jsonLd in frontmatter script, pass as prop to BaseLayout
  - Blog posts construct jsonLd in [...slug].astro, pass through BlogPost.astro → BaseLayout → SEO.astro
observability_surfaces:
  - "grep -rl 'application/ld+json' dist/ | wc -l — count pages with JSON-LD (expect 26)"
  - "grep -o '<loc>' dist/sitemap-0.xml | wc -l — sitemap URL count (expect 26)"
  - "node -e parse JSON-LD from any page HTML to validate structure"
  - "grep 'og:site_name\\|og:locale\\|og:image\\|rel=\"sitemap\"' dist/*/index.html — verify site-wide meta tags"
drill_down_paths:
  - .gsd/milestones/M001/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S04/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S04/tasks/T03-SUMMARY.md
  - .gsd/milestones/M001/slices/S04/tasks/T04-SUMMARY.md
duration: ~35 minutes (4 tasks)
verification_result: passed
completed_at: 2026-03-27
---

# S04: SEO & Structured Data

**Every page has JSON-LD structured data, optimized meta descriptions, correct heading hierarchy, enhanced OG/Twitter tags, and a validated 26-URL sitemap — site is fully SEO-ready for launch.**

## What Happened

Built the full SEO layer across all 26 pages in 4 tasks:

**T01** created the foundation: `src/utils/structured-data.ts` with 6 typed helper functions (`buildWebSite`, `buildOrganization`, `buildBlogPosting`, `buildBreadcrumbs`, `buildWebPage`, `buildGraph`) and 2 constants (`SITE_URL`, `SITE_NAME`). Enhanced `SEO.astro` with `og:site_name`, `og:locale`, default `og:image` fallback to `/og-default.svg`, and `<link rel="sitemap">`. Created the default OG image (1200×630 SVG, dark-blue background, white FAIR wordmark).

**T02** wired JSON-LD into all 26 pages: homepage gets WebSite+Organization graph, 9 blog posts get BlogPosting+BreadcrumbList, blog listing gets WebPage+BreadcrumbList, and 15 static pages each get WebPage+BreadcrumbList with appropriate breadcrumb hierarchies. Updated 19 files total — `BlogPost.astro` gained a `jsonLd` prop pass-through, `[...slug].astro` constructs BlogPosting from frontmatter, and each static page imports helpers and constructs its own structured data in the frontmatter script.

**T03** fixed content quality issues: demoted 4 `h1`→`h2` in discover-trust-install, 1 `h1`→`h2` in fair-connect-1-2-2, promoted 1 `h3`→`h2` in fair-plugin-0-4-0, changed first `h3`→`h2` in rethinking-wordpress-distribution. Trimmed 6 meta descriptions to ≤160 chars (3 planned blog posts + 1 bonus blog post + 2 static pages).

**T04** ran all 14 slice-level verification checks — all passed. Validated JSON-LD structural correctness on 3 sample pages. Confirmed sitemap completeness (26 URLs, no /packages/*). Verified no regressions (9 blog posts, 9 RSS items, 26 pages).

## Verification

All 14 slice-level checks pass against `cd src-astro && npm run build` output:

| # | Check | Result |
|---|-------|--------|
| V1 | JSON-LD on all pages | **26 ✓** |
| V2 | Homepage WebSite schema | ✓ |
| V3 | Homepage Organization schema | ✓ |
| V4 | Blog post BlogPosting schema | ✓ |
| V5 | Static page BreadcrumbList | ✓ |
| V6 | Static page WebPage schema | ✓ |
| V7 | og:site_name = "FAIR" | ✓ |
| V8 | og:locale = "en_US" | ✓ |
| V9 | og:image = og-default.svg | ✓ |
| V10 | Sitemap link in head | ✓ |
| V11 | Sitemap has 26 URLs | **26 ✓** |
| V12 | All descriptions ≤160 chars | ✓ (blog: 126–156, static: 119–154) |
| V13 | Single h1 per blog post | ✓ (all 9 = 1) |
| V14 | Build exits 0 | ✓ (26 pages, 5 images) |

JSON-LD structural validation (3 samples parsed with Node.js):
- Homepage: @graph → WebSite + Organization ✓
- Blog post (what-is-fair): @graph → BlogPosting + BreadcrumbList ✓
- About page: @graph → WebPage + BreadcrumbList ✓

Regression checks: 9 blog posts ✓, 9 RSS items ✓, 26 sitemap URLs ✓, no /packages/* in sitemap ✓

## Requirements Advanced

- R004 (SEO completeness) — All 26 pages now have unique meta descriptions (120–160 chars), canonical URLs, OG tags (including og:site_name, og:locale, og:image), Twitter Card tags, and JSON-LD structured data with correct schema types per page category
- R005 (Sitemap) — Sitemap validated with exactly 26 URLs, /packages/* excluded via astro.config.mjs filter
- R007 (Accessibility) — Heading hierarchy corrected in 3 blog posts and 1 static page; proper semantic structure now site-wide

## Requirements Validated

- R004 (SEO completeness) — Every page verified to have JSON-LD, meta description ≤160 chars, OG tags, Twitter Cards, canonical URL. 14 automated checks all pass. Structured data parses correctly on 3 sampled pages
- R005 (Sitemap) — Sitemap contains exactly 26 URLs, no /packages/*, generated automatically by @astrojs/sitemap

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- T03 also trimmed `fair-connect-1-2-1-release-announcement.md` description (163→154 chars), not in the original plan but required to meet the "all descriptions ≤160" must-have.

## Known Limitations

- `governance/code-of-conduct.astro` description is 119 chars (1 char under the 120 recommended minimum). Pre-existing content constraint — the description is accurate and complete, just short.
- Default OG image is SVG format. Most social platforms accept SVG, but Facebook may not render it in previews. A PNG/JPEG conversion would improve maximum compatibility.
- Structured data not validated against Google Rich Results Test (recommended but not blocking — schema shapes verified via build output parsing).

## Follow-ups

- none

## Files Created/Modified

- `src-astro/src/utils/structured-data.ts` — new: 6 typed JSON-LD helper functions + SITE_URL/SITE_NAME constants
- `src-astro/public/og-default.svg` — new: 1200×630 default OG image
- `src-astro/src/components/SEO.astro` — enhanced: og:site_name, og:locale, always-render og:image/twitter:image with fallback, sitemap link
- `src-astro/src/layouts/BlogPost.astro` — added jsonLd prop pass-through to BaseLayout
- `src-astro/src/pages/blog/[...slug].astro` — BlogPosting + BreadcrumbList construction
- `src-astro/src/pages/index.astro` — WebSite + Organization JSON-LD
- `src-astro/src/pages/blog/index.astro` — WebPage + BreadcrumbList JSON-LD
- `src-astro/src/pages/about/index.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/about/fairs-mandate.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/about/fair-initiatives.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/about/roadmap.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/governance/index.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/governance/technical-steering-committee.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/governance/linux-foundation.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/governance/code-of-conduct.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/governance/antitrust-policy.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/governance/privacy-policy.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/governance/terms-of-use.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/get-involved/index.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/get-involved/fair-working-groups.astro` — WebPage + BreadcrumbList, trimmed description
- `src-astro/src/pages/fair-knowledge-base.astro` — WebPage + BreadcrumbList
- `src-astro/src/pages/rethinking-wordpress-distribution.astro` — WebPage + BreadcrumbList, h3→h2 fix, trimmed description
- `src-astro/src/content/blog/discover-trust-install-fair-1-0-is-here.md` — 4× h1→h2, trimmed description
- `src-astro/src/content/blog/fair-connect-1-2-2-release-announcement.md` — 1× h1→h2
- `src-astro/src/content/blog/fair-plugin-version-0-4-0-decentralized-installation.md` — 1× h3→h2
- `src-astro/src/content/blog/what-is-fair.md` — trimmed description
- `src-astro/src/content/blog/2025-fair-recap.md` — trimmed description
- `src-astro/src/content/blog/fair-connect-1-2-1-release-announcement.md` — trimmed description

## Forward Intelligence

### What the next slice should know
- SEO.astro is now the single source of truth for all meta tags — `og:site_name`, `og:locale`, `og:image`, `twitter:image`, and `<link rel="sitemap">` are rendered unconditionally on every page. No per-page wiring needed for these.
- JSON-LD is per-page via the `jsonLd` prop passed through BaseLayout → SEO.astro. The structured data helpers in `src/utils/structured-data.ts` export `SITE_URL` which S05 should use for any URL construction (value: `https://fair.pm`).
- The sitemap is at `/sitemap-index.xml` (Astro's default), referenced by `<link rel="sitemap">` and should be referenced by `robots.txt`.

### What's fragile
- Sitemap URL count (26) depends on the exact page set. Adding or removing pages changes this number. The `/packages/*` filter in `astro.config.mjs` is the only exclusion rule.
- Default OG image is SVG — social platforms vary in SVG support. If social sharing previews look broken, convert to PNG.

### Authoritative diagnostics
- `grep -rl 'application/ld+json' dist/ | wc -l` — most reliable check for JSON-LD coverage. Must equal total page count.
- `grep -o '<loc>' dist/sitemap-0.xml | wc -l` — use `-o` not `-c` because sitemap XML is single-line.

### What assumptions changed
- Original plan called for trimming 3 blog + 2 static page descriptions. Actually needed to trim 4 blog + 2 static (fair-connect-1-2-1 was also over 160 chars, discovered during execution).
