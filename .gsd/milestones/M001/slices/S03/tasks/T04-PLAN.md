---
estimated_steps: 4
estimated_files: 7
---

# T04: Migrate remaining 7 static pages including WP-only pages

**Slice:** S03 — Content Migration
**Milestone:** M001

## Description

Completes static page migration with the remaining 7 pages. Five are clean Markdown from the website-content repo (privacy-policy, terms-of-use, get-involved, fair-working-groups, fair-knowledge-base). Two are WP-only pages that require converting complex WordPress block HTML to clean Astro content: `/about/roadmap/` (9,305 chars with WP group blocks, separators, heading anchors) and `/rethinking-wordpress-distribution/` (19,182 chars with styled group blocks, background colors, blockquotes, heading anchors). The WP-only pages are the highest-complexity conversion in this task.

## Steps

1. Fetch Markdown content for 3 simple pages from GitHub raw URLs and convert to `.astro` page files:
   - `src/pages/governance/privacy-policy.astro` — brief intro + external link
   - `src/pages/governance/terms-of-use.astro` — brief intro + external link
   - `src/pages/fair-knowledge-base.astro` — knowledge base overview (6056 chars)

2. Fetch Markdown content for 2 get-involved pages from GitHub raw URLs:
   - `src/pages/get-involved/index.astro` — get involved overview (3262 chars)
   - `src/pages/get-involved/fair-working-groups.astro` — working groups details (8143 chars)
   Create `src/pages/get-involved/` directory.

3. Extract `/about/roadmap/` from WP REST API. Convert WP block HTML to clean Astro content: strip `wp-block-heading`, `wp-block-list`, `wp-block-group`, `wp-block-separator`, `is-layout-constrained` classes. Preserve heading anchors (IDs on headings for deep linking). Convert `wp-block-separator` to `<hr>`. Convert WP group blocks with backgrounds to Tailwind-styled sections (e.g., `bg-light-gray p-6 rounded`). Create `src/pages/about/roadmap.astro`.

4. Extract `/rethinking-wordpress-distribution/` from WP REST API. This is the longest and most complex WP-only page. Convert: strip all WP block classes, convert styled group blocks (with `has-light-gray-background-color`, `has-white-background-color`) to Tailwind equivalents, preserve blockquotes with proper `<blockquote>` elements, maintain heading hierarchy with anchor IDs. Create `src/pages/rethinking-wordpress-distribution.astro`.

## Must-Haves

- [ ] `src/pages/governance/privacy-policy.astro` renders at `/governance/privacy-policy/`
- [ ] `src/pages/governance/terms-of-use.astro` renders at `/governance/terms-of-use/`
- [ ] `src/pages/get-involved/index.astro` renders at `/get-involved/`
- [ ] `src/pages/get-involved/fair-working-groups.astro` renders at `/get-involved/fair-working-groups/`
- [ ] `src/pages/fair-knowledge-base.astro` renders at `/fair-knowledge-base/`
- [ ] `src/pages/about/roadmap.astro` renders at `/about/roadmap/` with preserved heading anchors
- [ ] `src/pages/rethinking-wordpress-distribution.astro` renders at `/rethinking-wordpress-distribution/` with clean styling (no WP block classes in output)
- [ ] All pages use BaseLayout with meaningful title and description props
- [ ] WP-only pages have no `wp-block-*` or `is-layout-*` classes in output HTML

## Verification

- `cd src-astro && npm run build` exits 0
- `ls dist/governance/privacy-policy/index.html dist/governance/terms-of-use/index.html dist/get-involved/index.html dist/get-involved/fair-working-groups/index.html dist/fair-knowledge-base/index.html dist/about/roadmap/index.html dist/rethinking-wordpress-distribution/index.html` — all 7 exist
- `grep -c 'wp-block' dist/about/roadmap/index.html dist/rethinking-wordpress-distribution/index.html` — 0 matches (no WP class cruft)
- `grep '<h1' dist/rethinking-wordpress-distribution/index.html` — h1 present with page title
- `grep 'id=' dist/about/roadmap/index.html | head -5` — heading anchors preserved
- Total pages in build output: 26+ (homepage + 15 static + 9 blog + RSS)

## Observability Impact

- Signals added/changed: Build page count reaches full target (26+ pages). All nav links from Header.astro now resolve to real pages.
- How a future agent inspects this: `ls dist/` shows complete URL structure. `grep 'wp-block' dist/**/*.html` should return 0 matches across entire site.
- Failure state exposed: Unclosed HTML tags in WP-converted content → Astro build warning or malformed output. Can be detected by checking build warnings or validating HTML.

## Inputs

- `src-astro/src/layouts/BaseLayout.astro` — layout shell with SEO props
- GitHub raw content: `https://raw.githubusercontent.com/fairpm/website-content/main/content/governance/` and `content/get-involved/` and `content/fair-knowledge-base/` — Markdown sources
- WP REST API `https://fair.pm/wp-json/wp/v2/pages` — roadmap and rethinking-wordpress-distribution full HTML content
- S01/S02 patterns — page pattern, external link pattern, Tailwind tokens (`bg-light-gray`, `text-dark-blue`, etc.)

## Expected Output

- `src-astro/src/pages/governance/privacy-policy.astro` — privacy policy page
- `src-astro/src/pages/governance/terms-of-use.astro` — terms of use page
- `src-astro/src/pages/get-involved/index.astro` — get involved page
- `src-astro/src/pages/get-involved/fair-working-groups.astro` — working groups page
- `src-astro/src/pages/fair-knowledge-base.astro` — knowledge base page
- `src-astro/src/pages/about/roadmap.astro` — roadmap page (converted from WP HTML)
- `src-astro/src/pages/rethinking-wordpress-distribution.astro` — standalone long-form page (converted from WP HTML)
