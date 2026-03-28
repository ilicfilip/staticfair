---
estimated_steps: 5
estimated_files: 19
---

# T02: Wire JSON-LD into homepage, blog posts, and all static pages

**Slice:** S04 — SEO & Structured Data
**Milestone:** M001

## Description

Import the structured data helpers from T01 and wire JSON-LD into every page. This is the high-file-count task — 19 files need a `jsonLd` prop addition — but each change is mechanical: import helpers, construct the schema object, pass it as the `jsonLd` prop to BaseLayout. BlogPost.astro needs a new `jsonLd` prop to pass through to BaseLayout.

The three patterns are:
1. **Homepage** — `buildGraph(buildWebSite(), buildOrganization())` 
2. **Blog posts** — `buildGraph(buildBlogPosting({...}), buildBreadcrumbs([...]))` constructed in `[...slug].astro`, passed through BlogPost.astro → BaseLayout → SEO.astro
3. **Static pages** — `buildGraph(buildWebPage({...}), buildBreadcrumbs([...]))` added directly in each `.astro` page

## Steps

1. Update `src-astro/src/layouts/BlogPost.astro`:
   - Add `jsonLd?: Record<string, any>` to Props interface
   - Pass `jsonLd` through to BaseLayout
   - No other changes to the layout

2. Wire JSON-LD into `src-astro/src/pages/blog/[...slug].astro`:
   - Import `buildBlogPosting`, `buildBreadcrumbs`, `buildGraph` from `../../utils/structured-data`
   - Construct BlogPosting from `post.data` (title, description, pubDate, author, image)
   - Construct BreadcrumbList: Home → Blog → post title
   - Pass `buildGraph(blogPosting, breadcrumbs)` as `jsonLd` prop to BlogPost

3. Wire JSON-LD into `src-astro/src/pages/index.astro`:
   - Import `buildWebSite`, `buildOrganization`, `buildGraph`
   - Pass `buildGraph(buildWebSite(), buildOrganization())` as `jsonLd` prop to BaseLayout

4. Wire JSON-LD into blog listing `src-astro/src/pages/blog/index.astro`:
   - Import `buildWebPage`, `buildBreadcrumbs`, `buildGraph`
   - Construct WebPage (name: "Blog", description from existing description prop, url)
   - Construct BreadcrumbList: Home → Blog
   - Pass as `jsonLd` prop

5. Wire JSON-LD into all 15 static pages — each gets WebPage + BreadcrumbList:
   - `about/index.astro` — breadcrumbs: Home → About
   - `about/fairs-mandate.astro` — breadcrumbs: Home → About → FAIR's Mandate
   - `about/fair-initiatives.astro` — breadcrumbs: Home → About → FAIR Initiatives
   - `about/roadmap.astro` — breadcrumbs: Home → About → Roadmap
   - `governance/index.astro` — breadcrumbs: Home → Governance
   - `governance/technical-steering-committee.astro` — breadcrumbs: Home → Governance → TSC
   - `governance/linux-foundation.astro` — breadcrumbs: Home → Governance → Linux Foundation
   - `governance/code-of-conduct.astro` — breadcrumbs: Home → Governance → Code of Conduct
   - `governance/antitrust-policy.astro` — breadcrumbs: Home → Governance → Antitrust Policy
   - `governance/privacy-policy.astro` — breadcrumbs: Home → Governance → Privacy Policy
   - `governance/terms-of-use.astro` — breadcrumbs: Home → Governance → Terms of Use
   - `get-involved/index.astro` — breadcrumbs: Home → Get Involved
   - `get-involved/fair-working-groups.astro` — breadcrumbs: Home → Get Involved → Working Groups
   - `fair-knowledge-base.astro` — breadcrumbs: Home → Knowledge Base
   - `rethinking-wordpress-distribution.astro` — breadcrumbs: Home → Rethinking WordPress Distribution

   Each page: import `buildWebPage`, `buildBreadcrumbs`, `buildGraph`, construct objects using existing page title/description, add `jsonLd` prop to BaseLayout.

## Must-Haves

- [ ] Homepage has WebSite + Organization JSON-LD in `@graph`
- [ ] Every blog post has BlogPosting + BreadcrumbList JSON-LD
- [ ] Every static page has WebPage + BreadcrumbList JSON-LD
- [ ] Blog listing has WebPage + BreadcrumbList JSON-LD
- [ ] BlogPost.astro passes `jsonLd` prop through to BaseLayout
- [ ] All 26 pages produce `<script type="application/ld+json">` in build output

## Verification

- `cd src-astro && npm run build` exits 0
- `grep -rl 'application/ld+json' dist/ | wc -l` ≥ 26
- `grep '"@type":"WebSite"' dist/index.html` — homepage has WebSite
- `grep '"@type":"Organization"' dist/index.html` — homepage has Organization
- `grep '"@type":"BlogPosting"' dist/blog/what-is-fair/index.html` — blog post has BlogPosting
- `grep '"@type":"BreadcrumbList"' dist/about/index.html` — static page has BreadcrumbList
- `grep '"@type":"WebPage"' dist/about/index.html` — static page has WebPage
- `node -e "const h=require('fs').readFileSync('dist/index.html','utf8'); const m=h.match(/<script type=\"application\/ld\+json\">(.*?)<\/script>/s); JSON.parse(m[1]); console.log('valid JSON-LD')"` — homepage JSON-LD parses

## Observability Impact

- Signals added/changed: Every page in `dist/` now contains a `<script type="application/ld+json">` block. The count of files with this tag is a health metric (should be ≥26).
- How a future agent inspects this: `grep -rl 'application/ld+json' dist/ | wc -l` for count. Parse individual pages' JSON-LD with `node -e "JSON.parse(...)"` to validate structure.
- Failure state exposed: Missing JSON-LD → grep count < 26. Malformed JSON → JSON.parse throws with position. Missing schema type → grep for specific `@type` returns empty.

## Inputs

- `src-astro/src/utils/structured-data.ts` — T01 output: helper functions for all schema types
- `src-astro/src/components/SEO.astro` — T01 output: enhanced with default og:image and new meta tags
- `src-astro/src/layouts/BlogPost.astro` — current layout, needs `jsonLd` prop addition
- `src-astro/src/pages/blog/[...slug].astro` — current dynamic route with post data available
- All 15 static `.astro` page files — current pages with title/description props on BaseLayout

## Expected Output

- `src-astro/src/layouts/BlogPost.astro` — modified with `jsonLd` prop pass-through
- `src-astro/src/pages/blog/[...slug].astro` — modified with BlogPosting + BreadcrumbList construction
- `src-astro/src/pages/index.astro` — modified with WebSite + Organization JSON-LD
- `src-astro/src/pages/blog/index.astro` — modified with WebPage + BreadcrumbList
- 15 static `.astro` pages — each modified with WebPage + BreadcrumbList JSON-LD
- All 26 pages produce JSON-LD in build output
