# S04: SEO & Structured Data — Research

**Date:** 2026-03-27

## Summary

S04 adds JSON-LD structured data, fixes semantic HTML issues, enhances the SEO component with missing OG/meta tags, creates a default OG image, trims over-long meta descriptions, and adds the sitemap link to the HTML head. The codebase is in excellent shape for this work: every page already has a unique meta description, one `<h1>`, and all SEO props wired through BaseLayout → SEO.astro. The sitemap already generates correctly with 26 URLs.

The main work divides into four areas: (1) JSON-LD structured data for every page (5 schema types), (2) SEO component enhancements (og:site_name, og:locale, default OG image, sitemap link), (3) meta description trimming (6 blog posts + 2 static pages over 160 chars), and (4) semantic HTML audit fixes (3 blog posts with heading hierarchy violations, 1 static page with h1→h3 skip).

No external dependencies needed. The SEO.astro component already accepts `jsonLd` as `Record<string, any>` and renders it via `<script type="application/ld+json">`. All JSON-LD can be built inline in each page's frontmatter or via small helper functions — no npm packages required.

## Recommendation

**Build JSON-LD helpers as utility functions** in a `src/utils/structured-data.ts` file rather than inlining JSON-LD objects in every page. This keeps pages clean and ensures consistency across schema types. Each helper takes typed parameters and returns a plain object that gets passed as the `jsonLd` prop to BaseLayout.

**Enhance SEO.astro** to add `og:site_name`, `og:locale`, and a `<link rel="sitemap">` tag. These are site-wide improvements that apply to every page at once.

**Create a simple default OG image** (1200×630 SVG→PNG) with the FAIR wordmark on the brand dark-blue background. This becomes the fallback when no page-specific image exists.

**Fix heading hierarchies** directly in the 3 blog Markdown files and 1 static page source. These are content corrections, not template changes.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| JSON-LD rendering | SEO.astro `jsonLd` prop + `set:html={JSON.stringify()}` | Already built in S01 and renders correctly. Just pass objects |
| Sitemap generation | @astrojs/sitemap already configured | Already generating 26 URLs with /packages/* excluded. Just validate |
| OG image serving | Static file in `public/` | Simple 1200×630 image, no dynamic generation needed |

## Existing Code and Patterns

- `src/components/SEO.astro` — Accepts `jsonLd: Record<string, any>` and renders as `<script type="application/ld+json">`. Currently no pages pass this prop. Needs: `og:site_name`, `og:locale`, `<link rel="sitemap">`, default `og:image` fallback
- `src/layouts/BaseLayout.astro` — Passes all props through to SEO.astro. Props interface mirrors SEO.astro. No changes to BaseLayout needed except if we add new props
- `src/layouts/BlogPost.astro` — Already passes `ogType="article"` and `ogImage={image}`. Needs: JSON-LD `BlogPosting` object construction and pass-through
- `src/pages/blog/[...slug].astro` — Dynamic route that passes frontmatter data to BlogPost layout. JSON-LD BlogPosting should be constructed here where post data is available
- `src/pages/index.astro` — Homepage. Needs: WebSite + Organization JSON-LD
- All static pages — Follow identical pattern: `<BaseLayout title="..." description="...">`. Adding `jsonLd` prop is a one-line addition per page
- `src/content.config.ts` — Blog schema has `title`, `description`, `pubDate`, `author`, `tags`, `image`. All needed for BlogPosting JSON-LD. No `dateModified` field — use `pubDate` for both (acceptable for posts that haven't been updated)

## Constraints

- **No SSR** — All JSON-LD must be statically generated at build time. No runtime computation. This is fine since all data is available at build time.
- **SEO.astro accepts single `jsonLd` object** — Currently typed as `Record<string, any>`. For pages needing multiple schema types (e.g., homepage needs WebSite + Organization), use `@graph` array pattern: `{ "@context": "https://schema.org", "@graph": [...] }`.
- **No `dateModified` in blog schema** — Blog content collection has `pubDate` but no `dateModified`. Use `pubDate` for `datePublished` and omit `dateModified` (valid per schema.org spec). Adding `dateModified` to the Zod schema is optional and could be done later.
- **No Twitter handle** — FAIR doesn't appear to have a Twitter/X account. Omit `twitter:site` meta tag.
- **Blog post `image` field is optional** — Only some posts have images. JSON-LD BlogPosting `image` should be conditional, falling back to the default OG image.
- **Description length target: 120-160 chars** — Google typically truncates at ~155-160 chars. 6 blog posts and 2 static pages currently exceed 160 chars.

## Current State Audit

### Meta Descriptions
- ✅ All 26 pages have unique descriptions
- ⚠️ 8 descriptions over 160 chars (6 blog posts: what-is-fair 190, 2025-fair-recap 178, discover-trust-install 176, fair-connect-1-2-1 163, get-involved/fair-working-groups 179, rethinking-wordpress-distribution 164)
- ✅ No descriptions under 120 chars

### Heading Hierarchy Issues
- ❌ `discover-trust-install-fair-1-0-is-here.md` — 4 `<h1>` in content (should be `<h2>`)
- ❌ `fair-connect-1-2-2-release-announcement.md` — 1 extra `<h1>` in content (should be `<h2>`)
- ❌ `fair-plugin-version-0-4-0-decentralized-installation.md` — `<h3>` with no preceding `<h2>` (should be `<h2>`)
- ❌ `rethinking-wordpress-distribution.astro` — first content heading is `<h3>` (skips `<h2>`)
- ✅ All other 22 pages have correct heading hierarchy
- ✅ Every page has exactly one layout-level `<h1>`

### OG/Twitter Tags
- ✅ og:title, og:description, og:url, og:type present on all pages
- ✅ twitter:card, twitter:title, twitter:description present on all pages
- ❌ Missing: og:site_name (should be "FAIR")
- ❌ Missing: og:locale (should be "en_US")
- ❌ Missing: og:image default (no fallback OG image when page has no specific image)
- ❌ Missing: `<link rel="sitemap" href="/sitemap-index.xml" />` in head

### Sitemap
- ✅ sitemap-index.xml generated with 1 sub-sitemap
- ✅ sitemap-0.xml contains all 26 URLs
- ✅ /packages/* correctly excluded
- ✅ All URLs use https://fair.pm base

### Semantic HTML
- ✅ Every page has `<html lang="en">`
- ✅ Skip-to-content link present
- ✅ `<main id="main-content">` landmark
- ✅ `<header>` with `<nav aria-label="Main">`
- ✅ `<footer>` with `<nav aria-label="Footer">`
- ✅ Blog posts wrapped in `<article>`
- ✅ External links have `rel="noopener noreferrer"` and sr-only indicator

### JSON-LD
- ❌ Zero pages have JSON-LD structured data currently
- Need to add: WebSite, Organization, BlogPosting, BreadcrumbList, WebPage

## JSON-LD Schema Type Plan

### 1. WebSite (homepage only)
```json
{
  "@type": "WebSite",
  "name": "FAIR",
  "url": "https://fair.pm",
  "description": "Federated and Independent Repositories..."
}
```
Note: No `SearchAction` — site search is deferred (R015). Add it when Pagefind is implemented.

### 2. Organization (homepage, can be referenced from other pages)
```json
{
  "@type": "Organization",
  "name": "FAIR Package Manager",
  "url": "https://fair.pm",
  "logo": "https://fair.pm/logo.svg",
  "parentOrganization": {
    "@type": "Organization",
    "name": "The Linux Foundation",
    "url": "https://www.linuxfoundation.org/"
  }
}
```

### 3. BlogPosting (each blog post)
```json
{
  "@type": "BlogPosting",
  "headline": "...",
  "description": "...",
  "datePublished": "2025-09-24",
  "author": { "@type": "Person", "name": "..." },
  "publisher": { "@type": "Organization", "name": "FAIR" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://fair.pm/blog/slug/" },
  "image": "..." // conditional
}
```

### 4. BreadcrumbList (all pages with depth > 1)
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fair.pm/" },
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://fair.pm/about/" },
    { "@type": "ListItem", "position": 3, "name": "Roadmap" }
  ]
}
```

### 5. WebPage (all static pages except homepage)
```json
{
  "@type": "WebPage",
  "name": "...",
  "description": "...",
  "url": "https://fair.pm/about/",
  "isPartOf": { "@type": "WebSite", "url": "https://fair.pm" }
}
```

## Implementation Approach

### Helper Utility Pattern
Create `src/utils/structured-data.ts` with typed helper functions:
- `buildWebSite()` — returns WebSite schema
- `buildOrganization()` — returns Organization schema
- `buildBlogPosting(post)` — takes blog post data, returns BlogPosting
- `buildBreadcrumbs(items)` — takes path segments, returns BreadcrumbList
- `buildWebPage(name, description, url)` — returns WebPage schema
- `buildGraph(schemas)` — wraps multiple schemas in `@graph` array with `@context`

Each page imports what it needs and passes the result as `jsonLd` prop. Blog posts can construct their JSON-LD in `[...slug].astro` and pass it through `BlogPost.astro` → `BaseLayout` → `SEO.astro`.

### BlogPost Layout Change
`BlogPost.astro` needs a new `jsonLd` prop to pass through to BaseLayout. Currently it doesn't accept or forward this prop.

## Common Pitfalls

- **Multiple JSON-LD blocks vs @graph** — Google accepts both patterns (multiple `<script type="application/ld+json">` tags or a single block with `@graph`). Using `@graph` in a single block is cleaner and matches the single `jsonLd` prop pattern in SEO.astro. No component changes needed.
- **OG image must be absolute URL** — `og:image` requires a fully qualified URL (https://fair.pm/og-default.png), not a relative path. The SEO component should prepend site URL.
- **BreadcrumbList last item should omit `item` URL** — Per Google's structured data guidelines, the last breadcrumb (current page) should not have an `item` property, only `name`.
- **Blog descriptions used as meta descriptions** — Blog post `description` frontmatter fields are used directly as meta descriptions. Some are too long. Trimming them changes both the meta description AND the blog listing excerpt. Verify the listing page still looks good after trimming.
- **JSON-LD datePublished format** — Schema.org accepts ISO 8601. Astro's `Date.toISOString()` returns full datetime; `toISOString().split('T')[0]` gives just the date. Either is valid.
- **Heading fixes in Markdown affect rendered IDs** — Changing `# Heading` to `## Heading` in Markdown changes the generated id attribute (lowercase, hyphenated). Any in-page anchor links or table of contents references would break. Check for `#` anchor references in each affected post.

## Open Risks

- **Default OG image creation** — Need to create a 1200×630 PNG. Using SVG with the FAIR wordmark on dark-blue is simplest but needs to be converted to PNG (OG images must be raster). Can use a simple HTML→screenshot approach or create a minimal PNG manually. Alternatively, an SVG in `public/` with correct dimensions works for most platforms (Facebook requires raster, but Twitter/Slack/LinkedIn accept SVG).
  - **Mitigation:** Create SVG first, document that a PNG conversion is recommended for maximum compatibility. Or use the Astro build to generate it.
- **No `dateModified` for blog posts** — Google's BlogPosting spec recommends `dateModified`. Without it, Google may show stale dates. Low risk since these are news posts, not evergreen content.
  - **Mitigation:** Omit `dateModified` for now. Can be added to the content schema later if needed.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | `astrolicious/agent-skills@astro` (2.8K installs) | available — directly relevant to Astro development |
| SEO audit | `coreyhaines31/marketingskills@seo-audit` (57.2K installs) | available — could help validate SEO completeness but not needed for implementation |
| Schema markup | `kostja94/marketing-skills@schema-markup` (261 installs) | available — low install count, likely not worth installing |

The Astro skill could be useful for framework-specific patterns but isn't critical for this slice since the work is primarily JSON-LD (framework-agnostic) and minor SEO.astro enhancements. The SEO audit skill could validate results but the planned Lighthouse + Google Rich Results Test verification is sufficient.

## Sources

- SEO.astro component already supports jsonLd via `set:html={JSON.stringify()}` (source: `src/components/SEO.astro`)
- Astro sitemap should be linked via `<link rel="sitemap">` in head (source: [Astro sitemap docs](https://docs.astro.build/en/guides/integrations-guide/sitemap))
- JSON-LD `@graph` pattern for multiple schemas per page (source: [Schema.org FAQ](https://schema.org/docs/faq.html))
- BreadcrumbList last item should omit `item` URL (source: [Google structured data docs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb))
- Blog heading hierarchy issues discovered via `grep -o '<h[1-6]' dist/blog/*/index.html` audit
- No SearchAction — per D-decision and R015 deferral (source: research doc line 479, REQUIREMENTS.md R015)
