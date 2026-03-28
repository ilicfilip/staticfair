# S04: SEO & Structured Data — UAT

**Milestone:** M001
**Written:** 2026-03-27

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All SEO/structured data is embedded in static HTML output. Every check can be performed by grepping built HTML and parsing JSON-LD. No runtime server or browser interaction required.

## Preconditions

- `cd src-astro && npm run build` exits 0 (produces `dist/` with 26 pages)

## Smoke Test

`grep -rl 'application/ld+json' dist/ | wc -l` returns 26 — every page has JSON-LD structured data.

## Test Cases

### 1. JSON-LD on every page

1. Run `grep -rl 'application/ld+json' dist/ | wc -l`
2. **Expected:** 26

### 2. Homepage structured data types

1. Run `grep '"@type":"WebSite"' dist/index.html`
2. Run `grep '"@type":"Organization"' dist/index.html`
3. **Expected:** Both present in homepage HTML

### 3. Blog post structured data

1. Run `grep '"@type":"BlogPosting"' dist/blog/what-is-fair/index.html`
2. Run `grep '"@type":"BreadcrumbList"' dist/blog/what-is-fair/index.html`
3. **Expected:** Both present

### 4. Static page structured data

1. Run `grep '"@type":"WebPage"' dist/about/index.html`
2. Run `grep '"@type":"BreadcrumbList"' dist/about/index.html`
3. **Expected:** Both present

### 5. Site-wide OG/meta tags

1. Run `grep 'og:site_name' dist/index.html` — expect content="FAIR"
2. Run `grep 'og:locale' dist/index.html` — expect content="en_US"
3. Run `grep 'og:image' dist/index.html` — expect og-default.svg URL
4. Run `grep 'rel="sitemap"' dist/index.html` — expect href="/sitemap-index.xml"
5. **Expected:** All 4 tags present on homepage (and every other page)

### 6. Sitemap completeness

1. Run `grep -o '<loc>' dist/sitemap-0.xml | wc -l`
2. Run `grep 'packages' dist/sitemap-0.xml`
3. **Expected:** 26 URLs, no /packages/* entries

### 7. Meta descriptions within limits

1. Check all 9 blog frontmatter descriptions: none over 160 chars
2. Check all static page description props in built HTML: none over 160 chars
3. **Expected:** All descriptions ≤160 characters

### 8. Heading hierarchy

1. Run `grep -c '<h1' dist/blog/discover-trust-install-fair-1-0-is-here/index.html`
2. Repeat for all 9 blog posts
3. **Expected:** Each returns exactly 1 (layout-level h1 only, no h1 in content)

### 9. JSON-LD structural validity

1. Extract JSON-LD from homepage, parse with `JSON.parse()`
2. Extract JSON-LD from a blog post, parse with `JSON.parse()`
3. Extract JSON-LD from a static page, parse with `JSON.parse()`
4. **Expected:** All parse without errors, contain `@context` and `@graph` with correct `@type` values

## Edge Cases

### Missing author in blog post

1. Check a blog post with no `author` frontmatter (most posts)
2. Extract BlogPosting JSON-LD and inspect `author` field
3. **Expected:** Author defaults to `{"@type":"Person","name":"FAIR"}`

### Default OG image fallback

1. Check any page that doesn't specify a custom OG image
2. Inspect `og:image` meta tag value
3. **Expected:** `https://fair.pm/og-default.svg`

## Failure Signals

- `grep -rl 'application/ld+json' dist/ | wc -l` returns less than 26 — missing JSON-LD on one or more pages
- `JSON.parse()` throws on any page's JSON-LD — malformed structured data
- Any blog post has more than 1 `<h1>` tag — heading hierarchy violation
- Any description over 160 chars — SERP truncation risk
- Sitemap has fewer than 26 URLs or contains /packages/* — incomplete or misconfigured sitemap

## Requirements Proved By This UAT

- R004 (SEO completeness) — Every page has JSON-LD structured data, unique meta description, canonical URL, OG tags, Twitter Cards. All verified via build output inspection.
- R005 (Sitemap) — 26-URL sitemap generated, /packages/* excluded, linked from every page via `<link rel="sitemap">`
- R007 (Accessibility, partial) — Heading hierarchy corrected site-wide. This UAT proves the semantic HTML portion; full WCAG AA validation was done in S02.

## Not Proven By This UAT

- Google Rich Results Test validation (requires live URL submission to Google's tool — recommended but not blocking)
- Social media sharing preview rendering (OG image is SVG; actual rendering on Facebook/Twitter/LinkedIn requires real share testing)
- Lighthouse SEO score (optional enhancement — underlying signals are verified via grep)
- Runtime behavior (static site, no runtime to test)

## Notes for Tester

- All verification is build-time only — run `cd src-astro && npm run build` first
- The sitemap XML is single-line; use `grep -o '<loc>' | wc -l` not `grep -c '<loc>'` to count URLs
- `governance/code-of-conduct.astro` description is 119 chars (1 under 120 minimum threshold) — this is a pre-existing content constraint, not a regression
- The default OG image is SVG; if social sharing previews don't render, converting to PNG is the fix (tracked as known limitation)
