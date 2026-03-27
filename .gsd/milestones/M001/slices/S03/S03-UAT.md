# S03: Content Migration — UAT

**Milestone:** M001
**Written:** 2026-03-27

## UAT Type

- UAT mode: mixed (artifact-driven build checks + live-runtime browser verification)
- Why this mode is sufficient: Build validation catches schema errors, missing files, and broken routes. Browser verification confirms visual rendering and content parity. No user authentication, forms, or server-side state to test.

## Preconditions

- `cd src-astro && npm install` completed
- Node.js 18+ available
- No running dev server required for build checks (dev server needed only for browser verification)

## Smoke Test

```bash
cd src-astro && npm run build && ls dist/blog/*/index.html | wc -l
```
Expected: build exits 0, count equals 9.

## Test Cases

### 1. Full build succeeds with expected page count

1. `cd src-astro && npm run build`
2. Count HTML files: `find dist -name 'index.html' | wc -l`
3. **Expected:** Build exits 0 with 26 HTML files generated. Build output shows "26 page(s) built" and "generating optimized images" section with 5 images.

### 2. All 9 blog posts generate at correct URLs

1. `ls dist/blog/*/index.html`
2. **Expected:** 9 files: `2025-fair-recap`, `discover-trust-install-fair-1-0-is-here`, `fair-connect-1-2-1-release-announcement`, `fair-connect-1-2-2-release-announcement`, `fair-connect-1-2-release-announcement`, `fair-plugin-1-1-release-announcement`, `fair-plugin-version-0-4-0-decentralized-installation`, `second-star-to-the-right-and-straight-on-till-morning`, `what-is-fair`

### 3. All 15 static pages exist at preserved WP URLs

1. `ls dist/about/index.html dist/about/fairs-mandate/index.html dist/about/fair-initiatives/index.html dist/about/roadmap/index.html dist/governance/index.html dist/governance/technical-steering-committee/index.html dist/governance/linux-foundation/index.html dist/governance/code-of-conduct/index.html dist/governance/antitrust-policy/index.html dist/governance/privacy-policy/index.html dist/governance/terms-of-use/index.html dist/get-involved/index.html dist/get-involved/fair-working-groups/index.html dist/fair-knowledge-base/index.html dist/rethinking-wordpress-distribution/index.html`
2. **Expected:** All 15 files exist with no errors.

### 4. RSS feed valid with 9 entries

1. `grep '<rss' dist/rss.xml` — root element present
2. `grep -o '<item>' dist/rss.xml | wc -l` — count items
3. **Expected:** Valid `<rss version="2.0">` root. 9 `<item>` elements. Each item has `<title>`, `<link>`, `<description>`, `<pubDate>`.

### 5. Blog listing shows all 9 posts

1. `grep -c '<h2' dist/blog/index.html`
2. **Expected:** 9 h2 elements (one per post).

### 6. Blog images optimized to WebP

1. `ls src/assets/images/blog/*.png | wc -l` — source images
2. `ls dist/_astro/*.webp | wc -l` — optimized output
3. `grep '/_astro/' dist/blog/discover-trust-install-fair-1-0-is-here/index.html | head -1`
4. **Expected:** 5 source PNGs, 5 WebP outputs. Blog HTML references `/_astro/*.webp` paths.

### 7. YouTube/SpeakerDeck embeds render

1. `grep -c 'iframe' dist/blog/what-is-fair/index.html` — embeds in what-is-fair
2. `grep -c 'iframe' dist/blog/2025-fair-recap/index.html` — embeds in recap
3. **Expected:** what-is-fair has 2 iframes (1 YouTube + 1 SpeakerDeck). 2025-fair-recap has 4 iframes (YouTube).

### 8. HTML5 video element renders

1. `grep '<video' dist/blog/fair-plugin-version-0-4-0-decentralized-installation/index.html`
2. **Expected:** `<video>` element with `controls`, `preload="metadata"`, and `aria-label` attribute.

### 9. Zero WP block cruft in output

1. `grep -rl 'wp-block' dist/`
2. **Expected:** No output (0 files containing WP block classes).

### 10. Content parity spot-check (browser)

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:4321/blog/`
3. Verify 9 posts listed, sorted newest first (Feb 2026 at top)
4. Click into `discover-trust-install-fair-1-0-is-here` — verify 5 images render
5. Navigate to `/about/` — verify headings and content match https://fair.pm/about/
6. Navigate to `/rss.xml` — verify XML renders in browser
7. **Expected:** All content renders correctly. Images are visible. RSS is valid XML.

## Edge Cases

### Large post rendering (what-is-fair — 31K chars, 39+ headings)

1. `wc -c dist/blog/what-is-fair/index.html`
2. Navigate to `http://localhost:4321/blog/what-is-fair/` in browser
3. **Expected:** Page renders completely without truncation. All headings, lists, and embedded media visible.

### Code of Conduct full content (21K chars from WP)

1. `wc -c dist/governance/code-of-conduct/index.html`
2. **Expected:** File is 30K+ bytes (full CoC, not just 2-paragraph intro).

### WP-only pages preserve heading anchors

1. `grep 'id=' dist/about/roadmap/index.html | head -5`
2. **Expected:** Heading anchors preserved (e.g., `id="2026-milestones"`, `id="fair-trust-systems"`).

## Failure Signals

- Build failure with Zod schema error → frontmatter field mismatch in a blog post .md file (exact field path in error)
- Build failure with missing import → broken image path or missing component reference
- `wp-block` in output → WP HTML not fully cleaned in a page
- RSS item count ≠ 9 → blog post missing from content collection or slug mismatch
- Missing index.html in dist/ path → page file not created or wrong filename
- Empty `<h1>` in blog post → frontmatter title field missing or empty

## Requirements Proved By This UAT

- R001 (Static page migration) — all 18 pages render at preserved URLs with correct content
- R002 (Blog content collection) — 9 posts with Zod schema, listing, individual pages, dynamic routing
- R003 (RSS feed) — valid RSS 2.0 at /rss.xml with all 9 posts
- R008 (Image optimization) — 5 images optimized to WebP via Astro pipeline with responsive srcset

## Not Proven By This UAT

- R004 (SEO completeness) — unique meta descriptions and JSON-LD structured data are S04 scope
- R005 (Sitemap) — sitemap generation works (S01) but full validation of all pages included deferred to S04
- R006 (URL preservation) — 301 redirects from old WP blog URLs are S05 scope
- R007 (Accessibility) — content page WCAG AA compliance not separately audited in S03 (Lighthouse run deferred to S04/S05; S02 validated homepage)
- R009 (Responsive design) — content page responsive behavior not viewport-tested in S03 (visual spot-check only, formal test deferred)
- Full content parity — spot-checked 3 pages, not exhaustively compared all 18 against live WP

## Notes for Tester

- The build warning about `@astrojs/internal-helpers/remote` is benign — it's from the Astro framework, not project code.
- RSS grep for `<item>` must use `grep -o '<item>' | wc -l` (not `grep -c`) because the RSS is single-line XML.
- Blog listing h2 count is the most reliable check for post count on the listing page — titles are inside nested `<a>` tags.
- The what-is-fair post is the best stress test — it's the largest, most complex content with multiple embed types.
