---
estimated_steps: 5
estimated_files: 0
---

# T05: Build validation and content parity verification

**Slice:** S03 — Content Migration
**Milestone:** M001

## Description

Final verification task that validates the entire content migration is complete and correct. Runs the full build and checks all slice-level verification criteria. Validates the RSS feed structure. Spot-checks content parity against the live WP site for key pages. Verifies image optimization is working (images served as optimized formats in build output). Runs the dev server and visually verifies the blog listing, a blog post with images, and a static page in the browser. Fixes any issues found during verification.

## Steps

1. Run `npm run build` and verify:
   - Exit code 0 (clean build)
   - Count pages in dist: should be 28+ (homepage + 15 static pages + 9 blog posts + blog listing + RSS + sitemap pages)
   - No build warnings about missing content, unresolved imports, or schema violations
2. Run all 10 slice-level verification checks from S03-PLAN.md:
   - 9 blog post HTML files generated
   - 15 static page HTML files at correct paths
   - RSS XML contains 9 `<item>` elements with correct titles
   - Images present in blog post HTML
   - YouTube/SpeakerDeck iframes present in relevant posts
   - Video element present in fair-plugin-version-0-4-0 post
   - Blog listing contains all 9 post titles
   - All post HTML files contain h1 and metadata
   - 5 PNG images in src/assets/images/blog/
3. Verify image optimization: check `dist/_astro/` for optimized image files (WebP or AVIF format). Confirm blog post HTML references optimized images (not raw PNGs).
4. Start dev server and visually verify in browser:
   - Blog listing at `/blog/` shows 9 posts sorted by newest first
   - A blog post with images (`/blog/discover-trust-install-fair-1-0-is-here/`) renders with visible images
   - A static page (`/about/`) renders with correct content and styling
   - RSS at `/rss.xml` returns valid XML in browser
5. Content parity spot-check: compare title, first heading, and key content sections for at least 3 pages against the live WP site (use curl or fetch_page on fair.pm URLs). Fix any discrepancies found.

## Must-Haves

- [ ] `npm run build` exits 0 with no content-related warnings
- [ ] All 10 slice-level verification checks from S03-PLAN pass
- [ ] Blog listing visually shows 9 posts in date order (newest first)
- [ ] Images render in browser (not broken img placeholders)
- [ ] RSS feed returns valid XML structure
- [ ] At least 3 pages spot-checked for content parity with live WP

## Verification

- All 10 slice-level verification checks pass (enumerated in S03-PLAN.md Verification section)
- Dev server visual confirmation: blog listing, blog post with images, static page, RSS feed
- Content parity spot-check passed for 3+ pages
- Build output page count: 28+

## Observability Impact

- Signals added/changed: None — this is a verification-only task
- How a future agent inspects this: The verification checks in this task's output serve as a runbook for re-verifying S03 at any time. Run `cd src-astro && npm run build && ls dist/blog/*/index.html | wc -l` as a quick health check.
- Failure state exposed: Any failing check produces a specific, actionable error that points to the exact file or content issue

## Inputs

- All files created in T01–T04
- Live WP site at `https://fair.pm` for content parity comparison
- S03-PLAN.md Verification section for the complete check list

## Expected Output

- No new files — this task validates and fixes existing work
- All slice-level verification checks confirmed passing
- Any discrepancies found during verification are fixed in the relevant files
- Build succeeds cleanly with 28+ pages
