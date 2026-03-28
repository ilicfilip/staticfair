---
estimated_steps: 5
estimated_files: 3
---

# T01: Create structured data helpers and enhance SEO component

**Slice:** S04 — SEO & Structured Data
**Milestone:** M001

## Description

Build the foundation that all JSON-LD wiring depends on. Create a `src/utils/structured-data.ts` file with typed helper functions for each schema type (WebSite, Organization, BlogPosting, BreadcrumbList, WebPage) plus a `buildGraph` wrapper for pages needing multiple schemas. Enhance SEO.astro with four site-wide improvements: `og:site_name`, `og:locale`, default `og:image` fallback, and `<link rel="sitemap">`. Create a simple 1200×630 SVG default OG image.

## Steps

1. Create `src-astro/src/utils/structured-data.ts` with the following typed helper functions:
   - `buildWebSite()` — returns WebSite schema object with name "FAIR", url "https://fair.pm", description
   - `buildOrganization()` — returns Organization schema with name "FAIR Package Manager", url, logo reference, parentOrganization (The Linux Foundation)
   - `buildBlogPosting({ title, description, datePublished, author, url, image? })` — returns BlogPosting with publisher, mainEntityOfPage. Image falls back to default OG image URL. datePublished formatted as ISO date string.
   - `buildBreadcrumbs(items: Array<{ name: string; url?: string }>)` — returns BreadcrumbList. Last item omits `item` property per Google spec.
   - `buildWebPage({ name, description, url })` — returns WebPage with isPartOf WebSite reference
   - `buildGraph(...schemas: Record<string, any>[])` — wraps multiple schemas in `{ "@context": "https://schema.org", "@graph": [...] }` 
   - Export `SITE_URL` and `SITE_NAME` constants used by all helpers
   - All functions return plain objects (not JSON strings). The `@context` is added only by `buildGraph` or at the top level of single schemas.

2. Create `src-astro/public/og-default.svg` — a 1200×630 SVG with dark-blue (#1B2D4E) background and white "FAIR" text centered, using the Mona Sans font stack with system sans-serif fallback. Keep it simple — this is a fallback image.

3. Enhance `src-astro/src/components/SEO.astro`:
   - Add `<meta property="og:site_name" content="FAIR" />` (unconditional)
   - Add `<meta property="og:locale" content="en_US" />` (unconditional)
   - Add `<link rel="sitemap" href="/sitemap-index.xml" />` (unconditional)
   - Add default `og:image` fallback: if `ogImage` prop is falsy, use `new URL('/og-default.svg', Astro.site).href`. Ensure the `og:image` and `twitter:image` meta tags always render (not conditional on ogImage prop).

4. Verify build succeeds: `cd src-astro && npm run build` exits 0.

5. Verify the 4 new SEO tags in built homepage HTML:
   - `grep 'og:site_name' dist/index.html`
   - `grep 'og:locale' dist/index.html`
   - `grep 'og:image' dist/index.html` (should show og-default.svg URL)
   - `grep 'rel="sitemap"' dist/index.html`

## Must-Haves

- [ ] `structured-data.ts` exports all 6 helper functions + 2 constants with TypeScript types
- [ ] `buildBreadcrumbs` last item omits `item` URL per Google spec
- [ ] `buildBlogPosting` falls back to default OG image when no post image provided
- [ ] SEO.astro renders `og:site_name`, `og:locale`, `<link rel="sitemap">`, and default `og:image` on every page
- [ ] Default OG image SVG exists at `public/og-default.svg` (1200×630, dark-blue bg, white FAIR text)

## Verification

- `cd src-astro && npm run build` exits 0
- `grep 'og:site_name' dist/index.html` returns `content="FAIR"`
- `grep 'og:locale' dist/index.html` returns `content="en_US"`
- `grep 'og:image' dist/index.html` returns URL containing `og-default.svg`
- `grep 'rel="sitemap"' dist/index.html` returns `href="/sitemap-index.xml"`
- `ls -la public/og-default.svg` exists and is non-empty
- TypeScript compilation succeeds (no type errors in structured-data.ts)

## Observability Impact

- Signals added/changed: Every page now emits `og:site_name`, `og:locale`, `og:image`, and sitemap link in HTML `<head>` — these are greppable in build output for automated verification
- How a future agent inspects this: `grep -c 'og:site_name' dist/*/index.html` across all pages; `grep 'og:image' dist/index.html` to check default image wiring
- Failure state exposed: Missing meta tags → grep returns empty. Build failure → npm exit code non-zero with file/line error.

## Inputs

- `src-astro/src/components/SEO.astro` — current component with `jsonLd` prop support, conditional ogImage rendering
- `src-astro/src/layouts/BaseLayout.astro` — passes all props to SEO.astro (no changes needed in this task)
- S04-RESEARCH.md — JSON-LD schema type plan, OG image requirements, sitemap link pattern

## Expected Output

- `src-astro/src/utils/structured-data.ts` — new file with 6 typed helper functions and 2 constants
- `src-astro/public/og-default.svg` — new 1200×630 SVG default OG image
- `src-astro/src/components/SEO.astro` — enhanced with 4 new site-wide meta tags and default og:image logic
