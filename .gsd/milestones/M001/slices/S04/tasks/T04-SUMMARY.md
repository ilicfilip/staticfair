---
id: T04
parent: S04
milestone: M001
provides:
  - Full verification of all 14 slice-level SEO checks — all pass
  - JSON-LD structural validation on 3 sample pages (homepage, blog post, about)
  - Sitemap completeness confirmation (26 URLs, no /packages/*)
  - S01/S03 regression confirmation (9 blog posts, 9 RSS items, 26 pages)
key_files: []
key_decisions: []
patterns_established: []
observability_surfaces:
  - "Verify JSON-LD count: grep -rl 'application/ld+json' dist/ | wc -l"
  - "Validate any page JSON-LD: node -e \"const h=require('fs').readFileSync('dist/<path>/index.html','utf8'); const m=h.match(/<script type=\\\"application\\/ld\\+json\\\">(.*?)<\\/script>/s); console.log(JSON.stringify(JSON.parse(m[1]),null,2))\""
  - "Sitemap URL count: grep -o '<loc>' dist/sitemap-0.xml | wc -l"
  - "Blog description lengths: for f in src/content/blog/*.md; do desc=$(grep '^description:' \"$f\" | sed 's/^description: *\"//' | sed 's/\"$//'); echo \"$(basename $f): ${#desc}\"; done"
duration: 1 step (verification only, no code changes)
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T04: Validate sitemap, run full verification, and confirm SEO readiness

**All 14 slice-level SEO verification checks pass — site is SEO-ready with JSON-LD on all 26 pages, complete sitemap, correct meta tags, and no regressions.**

## What Happened

Ran `npm run build` — produced 26 pages and 5 images with exit 0. Executed all 14 slice-level verification checks systematically. Validated JSON-LD structural correctness on 3 sample pages by parsing with Node.js and verifying schema types, required fields, and graph structure. Confirmed sitemap completeness (26 URLs, no /packages/* entries). Verified no regressions from S01/S03 (9 blog posts, 9 RSS items).

## Verification

### Build (V14)
- `npm run build` exits 0 — 26 pages, 5 images built

### All 14 Slice Checks

| # | Check | Result |
|---|-------|--------|
| V1 | JSON-LD on all pages (`grep -rl 'application/ld+json' dist/ \| wc -l`) | **26 ✓** |
| V2 | Homepage has WebSite schema | **present ✓** |
| V3 | Homepage has Organization schema | **present ✓** |
| V4 | Blog post has BlogPosting schema | **present ✓** |
| V5 | Static page has BreadcrumbList | **present ✓** |
| V6 | Static page has WebPage schema | **present ✓** |
| V7 | og:site_name = "FAIR" | **present ✓** |
| V8 | og:locale = "en_US" | **present ✓** |
| V9 | og:image = og-default.svg | **present ✓** |
| V10 | Sitemap link in head | **present ✓** |
| V11 | Sitemap has 26 URLs | **26 ✓** |
| V12 | All descriptions ≤160 chars | **all 9 OK ✓** |
| V13 | Single h1 in blog post | **1 ✓** |
| V14 | Build exits 0 | **✓** |

### JSON-LD Structural Validation (3 samples)

**Homepage (`dist/index.html`):**
- @context: https://schema.org ✓
- @graph contains: WebSite (name, url, description) + Organization (name, url, logo, parentOrganization) ✓

**Blog post (`dist/blog/what-is-fair/index.html`):**
- @graph contains: BlogPosting (headline, datePublished, author with Person type, publisher, mainEntityOfPage, url) + BreadcrumbList (3 items: Home → Blog → What is FAIR?) ✓

**About page (`dist/about/index.html`):**
- @graph contains: WebPage (name, description, url, isPartOf WebSite) + BreadcrumbList (2 items: Home → About, last item omits URL per spec) ✓

### Regression Checks
- Blog posts: 9 ✓
- RSS items: 9 ✓
- Sitemap URLs: 26 ✓
- No /packages/* in sitemap ✓

## Diagnostics

No code changes in this task. Future agents can re-run verification with:
- Build: `cd src-astro && npm run build`
- JSON-LD count: `grep -rl 'application/ld+json' dist/ | wc -l`
- Sitemap count: `grep -o '<loc>' dist/sitemap-0.xml | wc -l` (note: single-line XML requires `-o` not `-c`)
- Parse any page JSON-LD: extract with regex, pass to `JSON.parse()`

## Deviations

V11 sitemap check required `grep -o '<loc>' | wc -l` instead of `grep -c '<loc>'` because the sitemap XML is single-line. `grep -c` counts matching lines (1), not occurrences (26). Adjusted accordingly.

## Known Issues

None.

## Files Created/Modified

No source files modified (verification-only task).
