---
id: S03
parent: M001
milestone: M001
provides:
  - 9 blog posts as Zod-validated Markdown content collection with frontmatter schema
  - BlogPost.astro layout with title, date, author, tags rendering and prose styling
  - Blog listing page at /blog/ showing all 9 posts sorted by pubDate descending
  - Dynamic [...slug] route generating individual blog pages at /blog/[slug]/
  - RSS feed endpoint at /rss.xml with all 9 posts and valid RSS 2.0 structure
  - 15 static .astro page files at their preserved WP URL paths (about, governance, get-involved, knowledge base, roadmap, rethinking-wordpress-distribution)
  - 5 PNG blog images in src/assets/images/blog/ optimized to WebP via Astro pipeline
  - 1 MP4 video in public/video/ for HTML5 video element
  - Responsive embed CSS for YouTube/SpeakerDeck iframes (16:9 aspect-ratio)
  - Content parity verified against live WP site for 3 key pages
requires:
  - slice: S01
    provides: BaseLayout.astro, SEO.astro, content.config.ts (blog collection schema), astro.config.mjs, global.css
affects:
  - S04
  - S05
key_files:
  - src-astro/src/layouts/BlogPost.astro
  - src-astro/src/pages/blog/index.astro
  - src-astro/src/pages/blog/[...slug].astro
  - src-astro/src/pages/rss.xml.ts
  - src-astro/src/content/blog/*.md (9 files)
  - src-astro/src/pages/about/ (4 files: index, fairs-mandate, fair-initiatives, roadmap)
  - src-astro/src/pages/governance/ (7 files: index, TSC, linux-foundation, code-of-conduct, antitrust-policy, privacy-policy, terms-of-use)
  - src-astro/src/pages/get-involved/ (2 files: index, fair-working-groups)
  - src-astro/src/pages/fair-knowledge-base.astro
  - src-astro/src/pages/rethinking-wordpress-distribution.astro
  - src-astro/src/assets/images/blog/ (5 PNGs)
  - src-astro/public/video/fair-plugin-0-4-demo.mp4
  - src-astro/src/styles/global.css (embed-responsive + video-responsive CSS)
key_decisions:
  - "D022: Code of Conduct uses full WP content (21K chars) instead of repo's 2-paragraph intro"
  - "D023: Blog images in src/assets/ for Astro optimization (WebP output); video in public/"
  - "D024: Raw HTML embeds in .md files with responsive CSS wrapper (not MDX)"
  - "D025: Static pages as standalone .astro files (not content collections)"
  - "D026: RSS feed with metadata only (no full post HTML in items)"
  - "D027: WP group blocks → <aside> with Tailwind; WP solution headings → h4.text-blue"
patterns_established:
  - "Content collection → getStaticPaths: getCollection('blog') → map to { params: { slug: post.id }, props: { post } }"
  - "Astro 6.x render API: import { render } from 'astro:content', destructure { Content }, render via <Content /> component"
  - "Blog post frontmatter schema: title, description, pubDate (date), author (string), tags (string[]), image (string)"
  - "Static page template: BaseLayout → section.bg-white → div.max-w-4xl.mx-auto.px-4.py-16 → div.prose → semantic HTML with scoped prose styles"
  - "YouTube embed pattern: <div class='embed-responsive'><iframe> with title, loading='lazy', allowfullscreen"
  - "Video embed pattern: <div class='video-responsive'><video controls preload='metadata' aria-label='...'>"
  - "Blog image pattern: Markdown ![alt](../../assets/images/blog/filename.png) for Astro optimization"
  - "WP-to-Astro conversion: strip wp-block-* classes, convert wp-block-group with background → <aside>, preserve id attributes for deep linking"
  - "External link pattern: rel='noopener noreferrer' target='_blank' with sr-only '(opens in new tab)'"
observability_surfaces:
  - "`cd src-astro && npm run build` — exits 0 with 26 pages, 5 optimized images; any schema or import error surfaces at build time"
  - "`ls dist/blog/*/index.html | wc -l` — quick blog count check (should be 9)"
  - "`grep -o '<item>' dist/rss.xml | wc -l` — RSS entry count"
  - "`ls dist/_astro/*.webp` — confirms image optimization pipeline working"
  - "`grep -rl 'wp-block' dist/` — should return 0 files (no WP cruft in output)"
  - "Zod schema validation at build time — mismatched frontmatter shows exact field path and expected type"
drill_down_paths:
  - .gsd/milestones/M001/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T03-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T04-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T05-SUMMARY.md
duration: 57m
verification_result: passed
completed_at: 2026-03-27
---

# S03: Content Migration

**All 18 static pages and 9 blog posts render with correct content at preserved URLs. Blog listing, RSS feed, image optimization, YouTube/SpeakerDeck embeds, and HTML5 video all working end-to-end. Content parity confirmed against live WP site.**

## What Happened

Built the complete content layer in 5 tasks:

**T01 — Blog infrastructure (8m).** Installed `@astrojs/rss`. Created BlogPost.astro layout (extends BaseLayout with article metadata rendering and scoped prose styles), blog listing page sorted by pubDate descending, `[...slug].astro` dynamic route using Astro 6.x `render()` API, and RSS feed endpoint. Migrated 3 simple text-only posts from WP REST API to prove the pipeline end-to-end.

**T02 — Rich blog posts (12m).** Downloaded 5 PNG images and 1 MP4 video. Added embed-responsive and video-responsive CSS to global.css using modern `aspect-ratio: 16/9`. Migrated 6 remaining posts including the 31K-char `what-is-fair` (YouTube + SpeakerDeck embeds), `discover-trust-install-fair-1-0-is-here` (5 images), `fair-plugin-version-0-4-0` (HTML5 video), and `2025-fair-recap` (4 YouTube iframes). All images flow through Astro's optimization pipeline producing WebP output with responsive srcset.

**T03 — Governance and about pages (15m).** Fetched Markdown from fairpm/website-content GitHub repo for 7 pages and the full Code of Conduct from WP REST API (21K chars). Created 8 `.astro` page files using the established pattern: BaseLayout wrapper, max-w-4xl container, prose div with scoped styles.

**T04 — Remaining static pages (20m).** Created 7 final pages: 5 from GitHub repo Markdown (privacy-policy, terms-of-use, get-involved, fair-working-groups, fair-knowledge-base) and 2 complex WP-only pages (roadmap, rethinking-wordpress-distribution) that required careful conversion of WP block HTML to clean semantic HTML — stripping all `wp-block-*` classes, converting group blocks to `<aside>` elements, preserving heading anchors and footnote back-links.

**T05 — Verification (12m).** Ran all 10 slice-level checks. Verified content parity against live WP for 3 pages (about, what-is-fair, governance). Visual browser verification of blog listing, blog post with images, static page, and RSS feed. Zero `wp-block` classes in any output file.

## Verification

All 10 slice-level checks pass:

1. ✅ `npm run build` exits 0 — 26 pages built in ~1s, 5 optimized images
2. ✅ `ls dist/blog/*/index.html | wc -l` = 9 (all blog posts generated)
3. ✅ All 15 static page HTML files exist at correct URL paths
4. ✅ `grep -o '<item>' dist/rss.xml | wc -l` = 9 with valid `<rss version="2.0">` root
5. ✅ Images present in discover-trust-install post (6 `<img>` tags with WebP sources)
6. ✅ YouTube and SpeakerDeck iframes in what-is-fair post
7. ✅ `<video>` element with controls and aria-label in fair-plugin-version-0-4-0 post
8. ✅ Blog listing at /blog/ contains all 9 post titles in `<h2>` tags
9. ✅ All 9 blog post HTML files contain `<h1>` with post title
10. ✅ 5 PNG images in `src/assets/images/blog/`, 5 WebP outputs in `dist/_astro/`

Additional checks:
- ✅ `grep -rl 'wp-block' dist/` returns 0 files (zero WP cruft)
- ✅ Content parity confirmed for 3 pages against live fair.pm
- ✅ Total output: 26 HTML + rss.xml + 2 sitemap XMLs = 29 files (exceeds 28+ threshold)

## Requirements Advanced

- R001 (Static page migration) — All 15 static pages (+ homepage from S01/S02) render at their preserved WP URLs with correct content. All 18 pages accounted for.
- R002 (Blog content collection) — 9 blog posts as Zod-validated Markdown with typed schema (title, description, pubDate, author, tags, image). Listing page and individual post pages work.
- R003 (RSS feed) — Valid RSS 2.0 at /rss.xml with all 9 posts. Feed metadata (title, description, link, language) correct. /feed/ redirect deferred to S05.
- R008 (Image optimization) — 5 blog images served through Astro pipeline with automatic WebP conversion, responsive srcset, width/height attributes.
- R009 (Responsive design) — Content pages use max-w-4xl responsive container. Embed wrappers use responsive aspect-ratio. Blog images use responsive srcset.

## Requirements Validated

- R001 — All 18 static pages (homepage + 15 content pages) render with correct content at preserved URLs. Content parity confirmed against live WP for 3 key pages. Build produces all expected paths.
- R002 — 9 blog posts with Zod-validated schema, listing page sorted by date, individual post pages via dynamic route. All build and render correctly.
- R003 — RSS 2.0 feed at /rss.xml with all 9 posts, valid structure. Feed endpoint generates cleanly at build time.
- R008 — 5 blog images optimized to WebP via Astro pipeline. Built output contains WebP files in dist/_astro/ with responsive srcset in HTML.

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- Blog listing title count check (S03-PLAN check 7) needed adjusted grep pattern — titles are inside `<h2>` tags but with nested `<a>` elements spanning multiple lines. `grep -c '<h2'` is the correct check, not `grep -o '<h2[^>]*>[^<]*</h2>'`. This is a verification command nuance, not a code deviation.
- Prose styles are scoped per-page via `<style>` blocks rather than a shared component — keeps pages self-contained and matches the BlogPost.astro pattern from T01.

## Known Limitations

- RSS feed contains metadata only (title, description, pubDate, link) — no full post HTML content in items. Readers must follow the link for full content. Decision D026 documents this as revisable.
- Build produces one benign vite warning about unused imports from `@astrojs/internal-helpers/remote` — this is from the Astro framework itself, not project code.
- Content parity was spot-checked for 3 pages, not exhaustively compared for all 18. The build succeeds with all content, but minor text differences vs. live WP are possible.

## Follow-ups

- S04 needs to add unique meta descriptions to all 15 static pages and 9 blog posts (currently using page-specific descriptions only where provided in BaseLayout props)
- S04 needs to add JSON-LD structured data (BlogPosting for posts, WebPage for static pages, BreadcrumbList for navigation)
- S05 needs to add /feed/ → /rss.xml redirect in _redirects file

## Files Created/Modified

- `src-astro/package.json` — added @astrojs/rss dependency
- `src-astro/src/layouts/BlogPost.astro` — blog post layout with metadata rendering and prose styling
- `src-astro/src/pages/blog/index.astro` — blog listing page sorted by pubDate descending
- `src-astro/src/pages/blog/[...slug].astro` — dynamic route for individual blog posts
- `src-astro/src/pages/rss.xml.ts` — RSS feed endpoint
- `src-astro/src/content/blog/*.md` — 9 blog post Markdown files with Zod-valid frontmatter
- `src-astro/src/pages/about/` — 4 pages (index, fairs-mandate, fair-initiatives, roadmap)
- `src-astro/src/pages/governance/` — 7 pages (index, TSC, linux-foundation, code-of-conduct, antitrust-policy, privacy-policy, terms-of-use)
- `src-astro/src/pages/get-involved/` — 2 pages (index, fair-working-groups)
- `src-astro/src/pages/fair-knowledge-base.astro` — knowledge base with glossary and FAQ
- `src-astro/src/pages/rethinking-wordpress-distribution.astro` — long-form page (19K chars from WP)
- `src-astro/src/assets/images/blog/` — 5 PNG images for blog posts
- `src-astro/public/video/fair-plugin-0-4-demo.mp4` — demo video
- `src-astro/src/styles/global.css` — embed-responsive and video-responsive CSS

## Forward Intelligence

### What the next slice should know
- All 26 pages now exist and build cleanly. S04 (SEO & Structured Data) can iterate over every page to add meta descriptions and JSON-LD.
- Blog posts already have `description` in frontmatter — S04 can use these directly as meta descriptions for blog pages.
- Static pages pass `title` and `description` props to BaseLayout which forwards to SEO.astro — S04 just needs to ensure all pages have meaningful descriptions (some may currently be generic).
- The sitemap is already generating via @astrojs/sitemap with /packages/* excluded (configured in S01). S04 just needs to validate it includes all 26 pages.

### What's fragile
- Prose styling is scoped per-page via `<style>` blocks — if a global prose utility is introduced later, it could conflict with per-page scoped styles. Keep one approach or the other, not both.
- Blog Markdown files contain raw HTML for embeds (iframes, video elements) — these are valid in standard Markdown but would need conversion if the project ever switches to MDX.
- The `what-is-fair.md` post is 31K chars with 39+ headings — it's the largest and most complex content file. Changes to prose styling or heading formatting should be smoke-tested against this post.

### Authoritative diagnostics
- `cd src-astro && npm run build` is the single most trustworthy signal — it validates Zod schema, resolves all imports, generates all routes, and optimizes images in one pass.
- `grep -rl 'wp-block' dist/` confirms zero WP cruft leaked through — run this after any content changes.
- `ls dist/blog/*/index.html | wc -l` is the fastest blog health check.

### What assumptions changed
- GitHub repo structure uses root-level `about/` and `governance/` dirs (not `content/about/` as initially assumed) — all raw URL fetches were adjusted.
- RSS `grep -c '<item>'` returns 1 because @astrojs/rss outputs single-line XML — use `grep -o '<item>' | wc -l` for accurate counts.
