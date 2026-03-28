---
id: T01
parent: S04
milestone: M001
provides:
  - structured-data.ts with 6 typed JSON-LD helper functions + 2 constants (SITE_URL, SITE_NAME)
  - SEO.astro enhanced with og:site_name, og:locale, default og:image fallback, sitemap link
  - Default OG image SVG at public/og-default.svg (1200×630)
key_files:
  - src-astro/src/utils/structured-data.ts
  - src-astro/src/components/SEO.astro
  - src-astro/public/og-default.svg
key_decisions:
  - All structured data helpers return plain objects; @context only added by buildGraph() or at page-level serialisation
  - Default OG image resolved via `new URL('/og-default.svg', Astro.site).href` for absolute URL
  - og:image and twitter:image always render (never conditional) using resolvedOgImage variable
patterns_established:
  - Import helpers from src/utils/structured-data.ts, compose with buildGraph(), pass as jsonLd prop to BaseLayout
  - buildBreadcrumbs last item omits `item` URL per Google structured data spec
observability_surfaces:
  - grep 'og:site_name' dist/*/index.html — verify site-wide meta tag presence
  - grep 'og:image' dist/*/index.html — verify default OG image wiring on all pages
  - grep 'rel="sitemap"' dist/*/index.html — verify sitemap link on all pages
duration: 8m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T01: Create structured data helpers and enhance SEO component

**Built JSON-LD structured data helpers (6 functions, 2 constants) and enhanced SEO.astro with 4 site-wide meta tags plus default OG image fallback.**

## What Happened

Created `src-astro/src/utils/structured-data.ts` with typed helper functions:
- `buildWebSite()` — WebSite schema with FAIR name/url/description
- `buildOrganization()` — Organization schema with Linux Foundation parent org
- `buildBlogPosting()` — BlogPosting with publisher, mainEntityOfPage, image fallback to default OG
- `buildBreadcrumbs()` — BreadcrumbList where last item omits `item` URL per Google spec
- `buildWebPage()` — WebPage with isPartOf WebSite reference
- `buildGraph()` — wraps multiple schemas in `@context`/`@graph` envelope

Constants `SITE_URL` and `SITE_NAME` exported for reuse across the site.

Created `public/og-default.svg` — 1200×630 SVG with dark-blue (#1B2D4E) background and white "FAIR" text centered.

Enhanced `SEO.astro` with:
1. `<meta property="og:site_name" content="FAIR" />` (unconditional)
2. `<meta property="og:locale" content="en_US" />` (unconditional)
3. `<meta property="og:image">` always renders with fallback to `https://fair.pm/og-default.svg`
4. `<meta name="twitter:image">` always renders with same fallback
5. `<link rel="sitemap" href="/sitemap-index.xml" />` (unconditional)

## Verification

- `npm run build` exits 0 — 26 pages built successfully
- `grep 'og:site_name' dist/index.html` → `content="FAIR"` ✅
- `grep 'og:locale' dist/index.html` → `content="en_US"` ✅
- `grep 'og:image' dist/index.html` → `content="https://fair.pm/og-default.svg"` ✅
- `grep 'rel="sitemap"' dist/index.html` → `href="/sitemap-index.xml"` ✅
- `ls -la public/og-default.svg` → 386 bytes ✅
- Tags confirmed on non-homepage page (blog/what-is-fair) — site-wide ✅
- TypeScript types validated via successful Astro build (no type errors) ✅

### Slice-level checks (5 of 14 applicable to T01):
- Check 7: og:site_name present ✅
- Check 8: og:locale present ✅
- Check 9: og:image with default OG image ✅
- Check 10: sitemap link in head ✅
- Check 14: build exits 0 ✅
- Checks 1–6, 11–13: Not yet applicable (require T02/T03 work)

## Diagnostics

- Verify meta tags on any page: `grep -o 'og:site_name\|og:locale\|og:image\|rel="sitemap"' dist/*/index.html`
- Verify structured data helpers compile: build succeeds (Astro validates TS during build)
- Verify OG image exists: `ls src-astro/public/og-default.svg`

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src-astro/src/utils/structured-data.ts` — new: 6 typed JSON-LD helper functions + SITE_URL/SITE_NAME constants
- `src-astro/public/og-default.svg` — new: 1200×630 default OG image (dark-blue bg, white FAIR text)
- `src-astro/src/components/SEO.astro` — enhanced: added og:site_name, og:locale, always-render og:image/twitter:image with fallback, sitemap link
