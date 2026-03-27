# S03: Content Migration

**Goal:** All 18 static pages and 9 blog posts render with correct content at their preserved URLs. Blog listing page shows posts sorted by date. RSS feed at /rss.xml validates. Images optimized via Astro assets pipeline.
**Demo:** `npm run build` succeeds with 28+ pages generated. Dev server shows navigable blog listing at /blog/, individual posts at /blog/[slug]/, all static pages at their WP-matching URLs, and RSS at /rss.xml. Content visually matches the live WP site.

## Must-Haves

- All 9 blog posts as Markdown files in `src/content/blog/` matching the Zod schema (title, description, pubDate, author, tags, image)
- BlogPost.astro layout renders post metadata (title, date, author, tags) and body content
- Blog listing page at `/blog/` shows all 9 posts sorted by date (newest first)
- Dynamic route `[...slug].astro` generates pages for all 9 posts
- RSS feed at `/rss.xml` via `@astrojs/rss` containing all 9 posts
- 15 static pages as `.astro` files (13 from website-content repo + 2 WP-only), all at correct URL paths
- Homepage content verified against WP (already built in S01/S02 — validate only)
- 5 blog images downloaded to `src/assets/images/blog/` and served via Astro `<Image>` component
- 1 video file in `public/video/` with `<video>` element
- YouTube/SpeakerDeck embeds rendered with responsive wrappers and accessible `title` attributes
- Content parity: all page text, headings, links, and media match the live WP site

## Proof Level

- This slice proves: integration (content renders through real Astro build pipeline with schema validation, image optimization, RSS generation)
- Real runtime required: yes (dev server for visual verification, build for output validation)
- Human/UAT required: no (automated content parity checks sufficient; visual spot-check in browser)

## Verification

- `cd src-astro && npm run build` exits 0 with 28+ pages in output
- `ls dist/blog/*/index.html | wc -l` equals 9 (all blog posts generated)
- `ls dist/about/index.html dist/about/fairs-mandate/index.html dist/about/fair-initiatives/index.html dist/about/roadmap/index.html dist/governance/index.html dist/governance/technical-steering-committee/index.html dist/governance/linux-foundation/index.html dist/governance/code-of-conduct/index.html dist/governance/antitrust-policy/index.html dist/governance/privacy-policy/index.html dist/governance/terms-of-use/index.html dist/get-involved/index.html dist/get-involved/fair-working-groups/index.html dist/fair-knowledge-base/index.html dist/rethinking-wordpress-distribution/index.html` — all exist
- `cat dist/rss.xml` contains all 9 blog post titles and valid `<rss>` root element
- `grep -l '<img' dist/blog/discover-trust-install-fair-1-0-is-here/index.html` — images present in post with optimized sources
- `grep 'iframe' dist/blog/what-is-fair/index.html` — YouTube and SpeakerDeck embeds present
- `grep '<video' dist/blog/fair-plugin-version-0-4-0-decentralized-installation/index.html` — video element present
- Blog listing at `dist/blog/index.html` contains all 9 post titles
- All blog post HTML files contain `<h1>` with post title and author/date metadata
- `ls src-astro/src/assets/images/blog/*.png | wc -l` equals 5 (all blog images downloaded)

## Observability / Diagnostics

- Runtime signals: Astro build output shows page count and errors. Content collection Zod validation errors include field path and expected type. RSS generation errors surface at build time.
- Inspection surfaces: `dist/` directory structure mirrors URL structure — `ls dist/` to see all generated routes. `cat dist/rss.xml` for RSS content. `npm run dev` at localhost:4321 for interactive browsing.
- Failure visibility: Build failure with Zod schema error → exact file and field mismatch. Missing image → build error with path. Broken import → build error with line number.
- Redaction constraints: none (no secrets in content)

## Integration Closure

- Upstream surfaces consumed: `BaseLayout.astro` (layout shell + SEO props), `SEO.astro` (meta tags), `content.config.ts` (blog collection schema), `global.css` (Tailwind v4 tokens + typography), `astro.config.mjs` (site URL, integrations)
- New wiring introduced in this slice: Blog content collection populated (schema → real data), BlogPost layout + dynamic route + listing page, RSS feed endpoint, 15 new static page files, image assets pipeline
- What remains before the milestone is truly usable end-to-end: S04 (unique meta descriptions, JSON-LD structured data, sitemap validation), S05 (redirects, deployment, robots.txt, Cloudflare config)

## Tasks

- [x] **T01: Blog infrastructure and first blog posts** `est:45m`
  - Why: Establishes the full blog pipeline — layout, listing, dynamic routing, RSS feed — and proves it works with real content. This is the highest-risk piece because it wires content collections to Astro's build system for the first time.
  - Files: `src-astro/src/layouts/BlogPost.astro`, `src-astro/src/pages/blog/index.astro`, `src-astro/src/pages/blog/[...slug].astro`, `src-astro/src/pages/rss.xml.ts`, `src-astro/src/content/blog/fair-plugin-1-1-release-announcement.md`, `src-astro/src/content/blog/fair-connect-1-2-release-announcement.md`, `src-astro/src/content/blog/fair-connect-1-2-1-release-announcement.md`, `src-astro/package.json`
  - Do: Install `@astrojs/rss`. Create BlogPost.astro layout (extends BaseLayout, renders title/date/author/tags + body via slot). Create blog listing page showing all posts sorted by pubDate descending. Create `[...slug].astro` dynamic route using `getStaticPaths()` + `getCollection('blog')` + `render()`. Create RSS feed endpoint using `@astrojs/rss`. Extract 3 simple text-only blog posts from WP REST API (fair-plugin-1-1, fair-connect-1-2, fair-connect-1-2-1) as the initial content to prove the pipeline. Verify build succeeds and all 3 posts render.
  - Verify: `npm run build` exits 0, 3 blog post HTML files generated, RSS XML contains 3 titles, blog listing shows 3 posts
  - Done when: Blog pipeline end-to-end proven — content collection → dynamic route → listing → RSS all working with 3 real posts

- [x] **T02: Migrate remaining 6 blog posts with images, video, and embeds** `est:45m`
  - Why: Completes blog content migration including the complex posts with embedded media. The `what-is-fair` post (31K chars, YouTube + SpeakerDeck embeds) and the `fair-plugin-version-0-4-0` post (GitHub video) are the hardest conversion targets.
  - Files: `src-astro/src/content/blog/fair-connect-1-2-2-release-announcement.md`, `src-astro/src/content/blog/fair-plugin-version-0-4-0-decentralized-installation.md`, `src-astro/src/content/blog/discover-trust-install-fair-1-0-is-here.md`, `src-astro/src/content/blog/what-is-fair.md`, `src-astro/src/content/blog/2025-fair-recap.md`, `src-astro/src/content/blog/second-star-to-the-right-and-straight-on-till-morning.md`, `src-astro/src/assets/images/blog/` (5 PNGs), `public/video/`, `src-astro/src/styles/global.css`
  - Do: Download 5 blog images from GitHub raw URLs to `src/assets/images/blog/`. Download GitHub video MP4 to `public/video/`. Convert 6 remaining blog posts from WP HTML to Markdown with frontmatter matching Zod schema. For `what-is-fair`: convert YouTube and SpeakerDeck iframes to responsive embed wrappers. For `fair-plugin-version-0-4-0`: convert GitHub video to `<video>` element. For `discover-trust-install-fair-1-0-is-here`: reference images from `src/assets/images/blog/` using Markdown image syntax. Add embed-responsive CSS to global.css for 16:9 iframe wrapper. Update BlogPost.astro if needed to handle image rendering from content collection.
  - Verify: `npm run build` exits 0 with 9 blog posts generated. Images present in built output. YouTube/SpeakerDeck iframes render. Video element renders. All 9 posts visible on blog listing.
  - Done when: All 9 blog posts migrated with correct content, all media (5 images, 1 video, 7 YouTube iframes, 1 SpeakerDeck iframe) rendering correctly

- [x] **T03: Migrate 8 governance and about static pages** `est:35m`
  - Why: Migrates the first batch of static pages — the about section (3 pages) and governance section (5 pages) from the website-content GitHub repo. These are clean Markdown sources with straightforward conversion.
  - Files: `src-astro/src/pages/about/index.astro`, `src-astro/src/pages/about/fairs-mandate.astro`, `src-astro/src/pages/about/fair-initiatives.astro`, `src-astro/src/pages/governance/index.astro`, `src-astro/src/pages/governance/technical-steering-committee.astro`, `src-astro/src/pages/governance/linux-foundation.astro`, `src-astro/src/pages/governance/code-of-conduct.astro`, `src-astro/src/pages/governance/antitrust-policy.astro`
  - Do: Fetch Markdown content from fairpm/website-content GitHub repo raw URLs. Convert each to `.astro` page file wrapping content in BaseLayout with appropriate title and description props. Use the established page pattern (semantic sections, `max-w-4xl mx-auto px-4 py-16` container). For Code of Conduct: use the full WP content (21K chars) rather than the repo's 2-paragraph intro. For governance policy pages (antitrust, privacy, terms): these are brief with external links — render the intro text plus the link.
  - Verify: `npm run build` exits 0. All 8 page HTML files exist in dist/ at correct URL paths. Each page has an `<h1>` and content.
  - Done when: All 8 governance and about pages render at their correct URLs with content matching WP site

- [x] **T04: Migrate remaining 7 static pages including WP-only pages** `est:40m`
  - Why: Completes static page migration — the remaining pages from the website-content repo (get-involved, knowledge base, privacy/terms-of-use) plus the 2 complex WP-only pages (roadmap, rethinking-wordpress-distribution) that require HTML-to-clean-content conversion.
  - Files: `src-astro/src/pages/governance/privacy-policy.astro`, `src-astro/src/pages/governance/terms-of-use.astro`, `src-astro/src/pages/get-involved/index.astro`, `src-astro/src/pages/get-involved/fair-working-groups.astro`, `src-astro/src/pages/fair-knowledge-base.astro`, `src-astro/src/pages/about/roadmap.astro`, `src-astro/src/pages/rethinking-wordpress-distribution.astro`
  - Do: Fetch remaining website-content repo Markdown for get-involved (2 pages), fair-knowledge-base, privacy-policy, terms-of-use. Convert to `.astro` page files with BaseLayout. For `roadmap` (WP-only, 9305 chars): extract from WP REST API, strip WP block classes, convert to clean semantic HTML with Tailwind classes preserving heading anchors and section structure. For `rethinking-wordpress-distribution` (WP-only, 19182 chars): extract from WP REST API, strip WP block groups/classes, convert styled group blocks and blockquotes to Tailwind equivalents. Both WP-only pages need careful conversion to preserve semantic structure while removing WordPress cruft.
  - Verify: `npm run build` exits 0. All 7 page HTML files exist in dist/ at correct paths. WP-only pages have correct heading structure and content.
  - Done when: All 15 static pages (excluding homepage) render correctly at their preserved URLs

- [x] **T05: Build validation and content parity verification** `est:20m`
  - Why: Final verification that the entire content migration is complete and correct. Validates build output, content parity with the live WP site, RSS feed validity, image optimization, and all slice-level verification checks pass.
  - Files: (read-only verification — no new files created)
  - Do: Run full build and count pages. Verify all 28+ pages generated. Check blog listing shows all 9 posts sorted by date. Validate RSS XML structure. Spot-check content parity for 3 key pages against live WP. Verify images are optimized (WebP/AVIF in output). Verify all embeds render. Run dev server and visually verify blog listing, a blog post, and a static page in browser.
  - Verify: All 10 slice-level verification checks pass (see Verification section above). Blog listing visually shows 9 posts in date order. At least 1 blog post verified in browser for content parity.
  - Done when: All verification checks pass, content parity confirmed, build succeeds cleanly with no warnings about missing content

## Files Likely Touched

- `src-astro/package.json` — add `@astrojs/rss` dependency
- `src-astro/src/layouts/BlogPost.astro` — new blog post layout
- `src-astro/src/pages/blog/index.astro` — new blog listing page
- `src-astro/src/pages/blog/[...slug].astro` — new dynamic blog route
- `src-astro/src/pages/rss.xml.ts` — new RSS feed endpoint
- `src-astro/src/content/blog/*.md` — 9 blog post Markdown files
- `src-astro/src/pages/about/index.astro` — about page
- `src-astro/src/pages/about/fairs-mandate.astro` — FAIR's mandate page
- `src-astro/src/pages/about/fair-initiatives.astro` — FAIR initiatives page
- `src-astro/src/pages/about/roadmap.astro` — roadmap page (WP-only source)
- `src-astro/src/pages/governance/index.astro` — governance overview page
- `src-astro/src/pages/governance/technical-steering-committee.astro` — TSC page
- `src-astro/src/pages/governance/linux-foundation.astro` — LF page
- `src-astro/src/pages/governance/code-of-conduct.astro` — code of conduct page
- `src-astro/src/pages/governance/antitrust-policy.astro` — antitrust policy page
- `src-astro/src/pages/governance/privacy-policy.astro` — privacy policy page
- `src-astro/src/pages/governance/terms-of-use.astro` — terms of use page
- `src-astro/src/pages/get-involved/index.astro` — get involved page
- `src-astro/src/pages/get-involved/fair-working-groups.astro` — working groups page
- `src-astro/src/pages/fair-knowledge-base.astro` — knowledge base page
- `src-astro/src/pages/rethinking-wordpress-distribution.astro` — standalone page (WP-only source)
- `src-astro/src/assets/images/blog/` — 5 downloaded PNG images
- `src-astro/public/video/` — 1 downloaded MP4 video
- `src-astro/src/styles/global.css` — embed-responsive CSS for iframe wrappers
