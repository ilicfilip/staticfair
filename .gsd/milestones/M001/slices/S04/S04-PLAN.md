# S04: SEO & Structured Data

**Goal:** Every page has JSON-LD structured data, optimized meta descriptions, correct heading hierarchy, enhanced OG/Twitter tags, and a validated sitemap — making the site fully SEO-ready for launch.
**Demo:** Build the site, grep for JSON-LD in output HTML, validate structured data with Google Rich Results Test, confirm all 26 pages in sitemap, and run Lighthouse SEO audit on homepage ≥90.

## Must-Haves

- JSON-LD structured data on every page (WebSite + Organization on homepage, BlogPosting on blog posts, WebPage + BreadcrumbList on static pages)
- SEO.astro enhanced with `og:site_name`, `og:locale`, default `og:image` fallback, `<link rel="sitemap">`
- Default OG image (1200×630 SVG) in `public/`
- All meta descriptions ≤160 chars (trim 3 blog posts + 2 static pages)
- Heading hierarchy fixed in 3 blog posts and 1 static page
- Sitemap validated: all 26 pages present, `/packages/*` excluded
- Structured data validates (no JSON-LD syntax errors in build output)

## Proof Level

- This slice proves: contract (SEO metadata correctness verified via build output inspection and Lighthouse SEO audit)
- Real runtime required: no (all verification via static build output; Lighthouse run is optional enhancement)
- Human/UAT required: no (Google Rich Results Test is recommended but not blocking — structured data shape is verifiable via grep)

## Verification

All checks run against `cd src-astro && npm run build` output:

1. `grep -rl 'application/ld+json' dist/ | wc -l` ≥ 26 — every page has JSON-LD
2. `grep -l '"@type":"WebSite"' dist/index.html` — homepage has WebSite schema
3. `grep -l '"@type":"Organization"' dist/index.html` — homepage has Organization schema
4. `grep -l '"@type":"BlogPosting"' dist/blog/what-is-fair/index.html` — blog post has BlogPosting schema
5. `grep -l '"@type":"BreadcrumbList"' dist/about/index.html` — static page has BreadcrumbList
6. `grep -l '"@type":"WebPage"' dist/about/index.html` — static page has WebPage schema
7. `grep 'og:site_name' dist/index.html` — og:site_name present
8. `grep 'og:locale' dist/index.html` — og:locale present
9. `grep 'og:image' dist/index.html` — default OG image present on homepage
10. `grep 'rel="sitemap"' dist/index.html` — sitemap link in head
11. Sitemap contains 26 URLs: `grep -c '<loc>' dist/sitemap-0.xml` = 26
12. No description over 160 chars: script check across all blog frontmatter and static page description props
13. No `<h1>` in blog post content divs (only in layout header): `grep -c '<h1' dist/blog/discover-trust-install-fair-1-0-is-here/index.html` = 1
14. `npm run build` exits 0 with no errors

## Observability / Diagnostics

- Runtime signals: None (static site — all verification is build-time)
- Inspection surfaces: `grep 'application/ld+json' dist/*/index.html` shows JSON-LD per page; `node -e "JSON.parse(...)"` validates JSON-LD syntax; built HTML is greppable for all meta tags
- Failure visibility: Build failure with error message → exact file/line. Invalid JSON-LD → `JSON.parse()` throws with position. Missing meta tags → grep returns empty.
- Redaction constraints: None

## Integration Closure

- Upstream surfaces consumed: `SEO.astro` (S01 — jsonLd prop, meta tag rendering), `BaseLayout.astro` (S01 — props pass-through), `BlogPost.astro` (S03 — blog layout), `[...slug].astro` (S03 — blog dynamic route), all 15 static `.astro` pages (S03), 9 blog `.md` files (S03), `astro.config.mjs` (S01 — sitemap config)
- New wiring introduced in this slice: `src/utils/structured-data.ts` helper functions → consumed by every page → passed as `jsonLd` prop through BaseLayout → rendered by SEO.astro. BlogPost.astro gains `jsonLd` prop pass-through. SEO.astro gains `og:site_name`, `og:locale`, default `og:image`, sitemap link.
- What remains before the milestone is truly usable end-to-end: S05 (deployment, redirects, robots.txt, _headers, CI/CD)

## Tasks

- [x] **T01: Create structured data helpers and enhance SEO component** `est:25m`
  - Why: Foundation for all JSON-LD — utility functions that every page will import, plus SEO.astro enhancements that apply site-wide
  - Files: `src/utils/structured-data.ts`, `src/components/SEO.astro`, `public/og-default.svg`
  - Do: Create `structured-data.ts` with typed helpers (buildWebSite, buildOrganization, buildBlogPosting, buildBreadcrumbs, buildWebPage, buildGraph). Add `og:site_name`, `og:locale`, `<link rel="sitemap">`, default `og:image` fallback to SEO.astro. Create 1200×630 SVG default OG image with FAIR wordmark on dark-blue background.
  - Verify: `npm run build` exits 0. `grep 'og:site_name' dist/index.html` shows "FAIR". `grep 'og:locale' dist/index.html` shows "en_US". `grep 'rel="sitemap"' dist/index.html` present. `ls public/og-default.svg` exists.
  - Done when: SEO component renders all 4 new tags, structured data helpers export all 6 functions with correct TypeScript types, default OG image exists

- [x] **T02: Wire JSON-LD into homepage, blog posts, and all static pages** `est:30m`
  - Why: Every page needs JSON-LD — this task imports helpers and passes `jsonLd` prop to BaseLayout on all 26 pages
  - Files: `src/pages/index.astro`, `src/layouts/BlogPost.astro`, `src/pages/blog/[...slug].astro`, `src/pages/about/index.astro`, `src/pages/about/fairs-mandate.astro`, `src/pages/about/fair-initiatives.astro`, `src/pages/about/roadmap.astro`, `src/pages/governance/index.astro`, `src/pages/governance/technical-steering-committee.astro`, `src/pages/governance/linux-foundation.astro`, `src/pages/governance/code-of-conduct.astro`, `src/pages/governance/antitrust-policy.astro`, `src/pages/governance/privacy-policy.astro`, `src/pages/governance/terms-of-use.astro`, `src/pages/get-involved/index.astro`, `src/pages/get-involved/fair-working-groups.astro`, `src/pages/fair-knowledge-base.astro`, `src/pages/rethinking-wordpress-distribution.astro`, `src/pages/blog/index.astro`
  - Do: Homepage: WebSite + Organization via `buildGraph`. Blog posts: add `jsonLd` prop to BlogPost.astro, construct BlogPosting + BreadcrumbList in `[...slug].astro`. Static pages: add WebPage + BreadcrumbList to each page. Blog listing: WebPage + BreadcrumbList.
  - Verify: `grep -rl 'application/ld+json' dist/ | wc -l` ≥ 26. Spot-check homepage, one blog post, one static page for correct schema types.
  - Done when: Every page in `dist/` contains a `<script type="application/ld+json">` block with correct schema types

- [x] **T03: Fix heading hierarchy and trim meta descriptions** `est:15m`
  - Why: Content corrections — heading hierarchy violations break accessibility/SEO, over-long descriptions get truncated in SERPs
  - Files: `src/content/blog/discover-trust-install-fair-1-0-is-here.md`, `src/content/blog/fair-connect-1-2-2-release-announcement.md`, `src/content/blog/fair-plugin-version-0-4-0-decentralized-installation.md`, `src/pages/rethinking-wordpress-distribution.astro`, `src/content/blog/what-is-fair.md`, `src/content/blog/2025-fair-recap.md`, `src/pages/get-involved/fair-working-groups.astro`
  - Do: Fix `# Heading` → `## Heading` in 3 blog posts (discover-trust-install: 4 h1→h2, fair-connect-1-2-2: 1 h1→h2, fair-plugin-0-4-0: h3→h2). Fix rethinking-wordpress-distribution.astro first content heading h3→h2. Trim 3 blog descriptions to ≤160 chars (what-is-fair, 2025-fair-recap, discover-trust-install). Trim 2 static page descriptions (get-involved/fair-working-groups, rethinking-wordpress-distribution).
  - Verify: `grep -c '<h1' dist/blog/discover-trust-install-fair-1-0-is-here/index.html` = 1. No blog post content `<h1>` tags (only layout-level). All descriptions ≤160 chars verified by script.
  - Done when: Zero heading hierarchy violations in build output. All 26 page descriptions between 120-160 chars.

- [x] **T04: Validate sitemap, run full verification, and confirm SEO readiness** `est:10m`
  - Why: Final verification — proves all S04 must-haves are met by running every check against the built output
  - Files: none (verification only)
  - Do: Build site. Run all 14 verification checks from the slice plan. Validate sitemap has exactly 26 URLs. Spot-check JSON-LD structure by parsing with `node -e "JSON.parse()"`. Verify no regressions (build still produces 26 pages, RSS still has 9 items).
  - Verify: All 14 slice-level checks pass. `npm run build` exits 0. Sitemap contains 26 URLs. JSON-LD parses without errors on sampled pages.
  - Done when: All slice verification checks pass with documented results

## Files Likely Touched

- `src-astro/src/utils/structured-data.ts` (new)
- `src-astro/public/og-default.svg` (new)
- `src-astro/src/components/SEO.astro`
- `src-astro/src/layouts/BlogPost.astro`
- `src-astro/src/pages/blog/[...slug].astro`
- `src-astro/src/pages/index.astro`
- `src-astro/src/pages/blog/index.astro`
- `src-astro/src/pages/about/index.astro` (and 3 siblings)
- `src-astro/src/pages/governance/index.astro` (and 6 siblings)
- `src-astro/src/pages/get-involved/index.astro` (and 1 sibling)
- `src-astro/src/pages/fair-knowledge-base.astro`
- `src-astro/src/pages/rethinking-wordpress-distribution.astro`
- `src-astro/src/content/blog/discover-trust-install-fair-1-0-is-here.md`
- `src-astro/src/content/blog/fair-connect-1-2-2-release-announcement.md`
- `src-astro/src/content/blog/fair-plugin-version-0-4-0-decentralized-installation.md`
- `src-astro/src/content/blog/what-is-fair.md`
- `src-astro/src/content/blog/2025-fair-recap.md`
