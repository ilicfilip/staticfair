---
estimated_steps: 4
estimated_files: 0
---

# T04: Validate sitemap, run full verification, and confirm SEO readiness

**Slice:** S04 — SEO & Structured Data
**Milestone:** M001

## Description

Final verification task. Build the site and run all 14 slice-level checks systematically. Validate sitemap completeness (26 URLs, no /packages/*). Parse JSON-LD from sampled pages to verify structural correctness. Confirm no regressions from S01/S03 (build produces 26 pages, RSS still has 9 items). Document results.

## Steps

1. Run `cd src-astro && npm run build` and confirm exit 0 with expected output (26 pages, 5 images).

2. Run all 14 slice-level verification checks:
   - V1: `grep -rl 'application/ld+json' dist/ | wc -l` ≥ 26
   - V2: `grep '"@type":"WebSite"' dist/index.html` — present
   - V3: `grep '"@type":"Organization"' dist/index.html` — present
   - V4: `grep '"@type":"BlogPosting"' dist/blog/what-is-fair/index.html` — present
   - V5: `grep '"@type":"BreadcrumbList"' dist/about/index.html` — present
   - V6: `grep '"@type":"WebPage"' dist/about/index.html` — present
   - V7: `grep 'og:site_name' dist/index.html` — present with "FAIR"
   - V8: `grep 'og:locale' dist/index.html` — present with "en_US"
   - V9: `grep 'og:image' dist/index.html` — present with og-default.svg
   - V10: `grep 'rel="sitemap"' dist/index.html` — present
   - V11: `grep -c '<loc>' dist/sitemap-0.xml` = 26
   - V12: Description length check across all pages
   - V13: `grep -c '<h1' dist/blog/discover-trust-install-fair-1-0-is-here/index.html` = 1
   - V14: `npm run build` exits 0

3. Validate JSON-LD structural correctness on 3 sample pages:
   - Extract JSON-LD from `dist/index.html`, parse with `node -e "JSON.parse()"`, verify `@graph` contains WebSite + Organization
   - Extract from `dist/blog/what-is-fair/index.html`, verify BlogPosting with headline, datePublished, author
   - Extract from `dist/about/index.html`, verify WebPage + BreadcrumbList with correct items

4. Regression check:
   - `ls dist/blog/*/index.html | wc -l` = 9
   - `grep -o '<item>' dist/rss.xml | wc -l` = 9
   - `grep -c '<loc>' dist/sitemap-0.xml` = 26

## Must-Haves

- [ ] All 14 slice-level verification checks pass
- [ ] JSON-LD parses without errors on 3 sampled pages
- [ ] Sitemap contains exactly 26 URLs with no /packages/* entries
- [ ] No S01/S03 regressions (9 blog posts, 9 RSS items, 26 pages built)

## Verification

- Every check listed in the slice plan's Verification section passes
- `npm run build` exits 0 with clean output
- JSON-LD from 3 sample pages parses as valid JSON with correct `@type` values

## Observability Impact

- Signals added/changed: None (verification only)
- How a future agent inspects this: The T04-SUMMARY.md will document all 14 check results as a reference for S05 and future audits
- Failure state exposed: None

## Inputs

- Full build output in `src-astro/dist/` from T01-T03 changes
- S04-PLAN.md verification section — defines the 14 checks to run

## Expected Output

- All 14 verification checks documented as passed
- T04-SUMMARY.md with complete results (written by auto-mode after execution)
- Slice marked as verified and ready for S05
