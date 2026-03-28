---
id: T02
parent: S04
milestone: M001
provides:
  - JSON-LD structured data on all 26 pages via jsonLd prop wired to BaseLayout
  - Homepage: WebSite + Organization in @graph
  - Blog posts (9): BlogPosting + BreadcrumbList in @graph
  - Blog listing: WebPage + BreadcrumbList
  - Static pages (15): WebPage + BreadcrumbList in @graph
  - BlogPost.astro jsonLd prop pass-through to BaseLayout
key_files:
  - src-astro/src/layouts/BlogPost.astro
  - src-astro/src/pages/blog/[...slug].astro
  - src-astro/src/pages/index.astro
  - src-astro/src/pages/blog/index.astro
  - src-astro/src/pages/about/index.astro
  - src-astro/src/pages/about/fairs-mandate.astro
  - src-astro/src/pages/about/fair-initiatives.astro
  - src-astro/src/pages/about/roadmap.astro
  - src-astro/src/pages/governance/index.astro
  - src-astro/src/pages/governance/technical-steering-committee.astro
  - src-astro/src/pages/governance/linux-foundation.astro
  - src-astro/src/pages/governance/code-of-conduct.astro
  - src-astro/src/pages/governance/antitrust-policy.astro
  - src-astro/src/pages/governance/privacy-policy.astro
  - src-astro/src/pages/governance/terms-of-use.astro
  - src-astro/src/pages/get-involved/index.astro
  - src-astro/src/pages/get-involved/fair-working-groups.astro
  - src-astro/src/pages/fair-knowledge-base.astro
  - src-astro/src/pages/rethinking-wordpress-distribution.astro
key_decisions:
  - Blog posts with no author default to 'FAIR' for BlogPosting author field
  - Breadcrumb names use short labels (e.g. 'TSC' for Technical Steering Committee, 'Working Groups' for FAIR Working Groups) matching nav-level naming
  - WebPage names use readable page titles (e.g. 'About FAIR', 'Knowledge Base') distinct from the full <title> tag
patterns_established:
  - Static pages import { buildWebPage, buildBreadcrumbs, buildGraph, SITE_URL } and construct jsonLd in frontmatter, pass as prop to BaseLayout
  - Blog posts construct jsonLd in [...slug].astro and pass through BlogPost.astro → BaseLayout → SEO.astro
  - All URLs in structured data use SITE_URL constant for consistency
observability_surfaces:
  - "grep -rl 'application/ld+json' dist/ | wc -l" returns 26 — count of pages with JSON-LD
  - "node -e \"JSON.parse(...)\"" validates individual page JSON-LD syntax
  - grep for specific @type values confirms correct schema types per page category
duration: 15m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T02: Wire JSON-LD into homepage, blog posts, and all static pages

**Wired JSON-LD structured data into all 26 pages — homepage gets WebSite+Organization, blog posts get BlogPosting+BreadcrumbList, static pages get WebPage+BreadcrumbList.**

## What Happened

Updated 19 files to import structured data helpers from T01 and pass JSON-LD as the `jsonLd` prop to BaseLayout:

1. **BlogPost.astro** — Added `jsonLd?: Record<string, any>` to Props interface and passed it through to BaseLayout.
2. **blog/[...slug].astro** — Imported `buildBlogPosting`, `buildBreadcrumbs`, `buildGraph`, `SITE_URL`. Constructed BlogPosting from post frontmatter (title, description, pubDate, author, image) and BreadcrumbList (Home → Blog → post title). Passed `buildGraph(blogPosting, breadcrumbs)` as `jsonLd` prop to BlogPost.
3. **index.astro (homepage)** — Imported `buildWebSite`, `buildOrganization`, `buildGraph`. Passed `buildGraph(buildWebSite(), buildOrganization())` as `jsonLd` prop.
4. **blog/index.astro** — WebPage + BreadcrumbList (Home → Blog).
5. **15 static pages** — Each got WebPage + BreadcrumbList with appropriate breadcrumb hierarchy matching the site navigation structure.

## Verification

All checks passed against `cd src-astro && npm run build` output:

- ✅ `npm run build` exits 0, 26 pages built
- ✅ `grep -rl 'application/ld+json' dist/ | wc -l` = 26
- ✅ `grep '"@type":"WebSite"' dist/index.html` — homepage has WebSite
- ✅ `grep '"@type":"Organization"' dist/index.html` — homepage has Organization
- ✅ `grep '"@type":"BlogPosting"' dist/blog/what-is-fair/index.html` — blog post has BlogPosting
- ✅ `grep '"@type":"BreadcrumbList"' dist/about/index.html` — static page has BreadcrumbList
- ✅ `grep '"@type":"WebPage"' dist/about/index.html` — static page has WebPage
- ✅ `node -e "JSON.parse(...)"` — homepage JSON-LD parses as valid JSON

Slice-level checks (passing so far, T01+T02 scope):
- ✅ Check 1: 26 pages with JSON-LD
- ✅ Check 2: Homepage WebSite schema
- ✅ Check 3: Homepage Organization schema
- ✅ Check 4: Blog post BlogPosting schema
- ✅ Check 5: Static page BreadcrumbList
- ✅ Check 6: Static page WebPage schema
- ✅ Check 7: og:site_name present
- ✅ Check 8: og:locale present
- ✅ Check 9: og:image present
- ✅ Check 10: sitemap link in head
- ✅ Check 11: Sitemap contains 26 URLs
- ⏳ Check 12: Description length — T03 scope
- ⏳ Check 13: Heading hierarchy — T03 scope
- ✅ Check 14: Build exits 0

## Diagnostics

- Count pages with JSON-LD: `grep -rl 'application/ld+json' dist/ | wc -l`
- Validate specific page JSON-LD: `node -e "const h=require('fs').readFileSync('dist/<path>/index.html','utf8'); const m=h.match(/<script type=\"application\/ld\+json\">(.*?)<\/script>/s); console.log(JSON.stringify(JSON.parse(m[1]),null,2))"`
- Check specific schema type: `grep '"@type":"<Type>"' dist/<path>/index.html`

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src-astro/src/layouts/BlogPost.astro` — Added `jsonLd` prop and pass-through to BaseLayout
- `src-astro/src/pages/blog/[...slug].astro` — BlogPosting + BreadcrumbList construction
- `src-astro/src/pages/index.astro` — WebSite + Organization JSON-LD
- `src-astro/src/pages/blog/index.astro` — WebPage + BreadcrumbList JSON-LD
- `src-astro/src/pages/about/index.astro` — WebPage + BreadcrumbList (Home → About)
- `src-astro/src/pages/about/fairs-mandate.astro` — WebPage + BreadcrumbList (Home → About → FAIR's Mandate)
- `src-astro/src/pages/about/fair-initiatives.astro` — WebPage + BreadcrumbList (Home → About → FAIR Initiatives)
- `src-astro/src/pages/about/roadmap.astro` — WebPage + BreadcrumbList (Home → About → Roadmap)
- `src-astro/src/pages/governance/index.astro` — WebPage + BreadcrumbList (Home → Governance)
- `src-astro/src/pages/governance/technical-steering-committee.astro` — WebPage + BreadcrumbList (Home → Governance → TSC)
- `src-astro/src/pages/governance/linux-foundation.astro` — WebPage + BreadcrumbList (Home → Governance → Linux Foundation)
- `src-astro/src/pages/governance/code-of-conduct.astro` — WebPage + BreadcrumbList (Home → Governance → Code of Conduct)
- `src-astro/src/pages/governance/antitrust-policy.astro` — WebPage + BreadcrumbList (Home → Governance → Antitrust Policy)
- `src-astro/src/pages/governance/privacy-policy.astro` — WebPage + BreadcrumbList (Home → Governance → Privacy Policy)
- `src-astro/src/pages/governance/terms-of-use.astro` — WebPage + BreadcrumbList (Home → Governance → Terms of Use)
- `src-astro/src/pages/get-involved/index.astro` — WebPage + BreadcrumbList (Home → Get Involved)
- `src-astro/src/pages/get-involved/fair-working-groups.astro` — WebPage + BreadcrumbList (Home → Get Involved → Working Groups)
- `src-astro/src/pages/fair-knowledge-base.astro` — WebPage + BreadcrumbList (Home → Knowledge Base)
- `src-astro/src/pages/rethinking-wordpress-distribution.astro` — WebPage + BreadcrumbList (Home → Rethinking WordPress Distribution)
