# S03: Content Migration — Research

**Date:** 2026-03-27

## Summary

S03 migrates all 18 static pages and 9 blog posts from two content sources (fairpm/website-content GitHub repo + WordPress REST API) into the Astro project, plus a blog listing page, RSS feed, and image assets. The foundation is solid — S01 already provides BaseLayout, SEO component, content collection schema, and Tailwind v4 tokens. The primary complexity is HTML-to-Markdown conversion for 9 blog posts (which contain WordPress block markup, YouTube/SpeakerDeck embeds, GitHub-hosted images, and a GitHub-hosted video) and the 2 WordPress-only pages (roadmap, rethinking-wordpress-distribution) which have complex WP block HTML with styled group blocks, heading anchors, and blockquotes.

The 13 static pages sourced from the website-content repo are clean Markdown and can be converted to `.astro` pages with minimal effort. The homepage already exists from S01. The main risks are: (1) WP block HTML cleanup during conversion — stripping `wp-block-*` classes while preserving semantic structure, (2) embedded media handling (7 YouTube iframes, 1 SpeakerDeck iframe, 1 GitHub video, 5 GitHub-hosted images), and (3) content parity between website-content repo and WP (where WP may have newer content for some pages).

## Recommendation

**Approach: Convert static pages as `.astro` files, blog posts as Markdown content collection entries.**

1. **Static pages (13 from website-content repo):** Fetch Markdown from GitHub, convert to `.astro` page files. These are straightforward — the markdown is clean with no WP block markup. Use the website-content repo as primary source, cross-check with live WP for parity.

2. **Static pages (2 WP-only):** Extract `/about/roadmap/` and `/rethinking-wordpress-distribution/` from WP REST API. Convert HTML to clean Markdown/Astro, stripping WP block classes while preserving semantic structure (headings with IDs, blockquotes, styled callout boxes → Tailwind equivalents).

3. **Homepage:** Already implemented in S01's `index.astro`. May need content updates to match current WP homepage if it changed, but the structure is done.

4. **Blog posts (9 from WP REST API):** Extract via API, convert rendered HTML to Markdown with frontmatter. Use `turndown` or manual conversion. Blog posts use the existing content collection schema from S01. Handle embedded media by converting to native HTML elements (YouTube → responsive iframe wrapper, video → `<video>` tag, SpeakerDeck → iframe).

5. **Blog infrastructure:** Create `BlogPost.astro` layout, `blog/index.astro` listing page, `blog/[...slug].astro` dynamic route, and `rss.xml.ts` RSS feed endpoint. Install `@astrojs/rss`.

6. **Images:** Download the 5 blog images from GitHub raw URLs + 1 image used on the homepage. Place in `src/assets/images/` for Astro Image optimization. The GitHub video (MP4) goes in `public/` since Astro doesn't optimize video.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| RSS feed generation | `@astrojs/rss` | Standard Astro package, integrates with content collections via `getCollection()`. Handles XML generation, validation, and feed metadata |
| Image optimization | Astro `<Image>` / `<Picture>` from `astro:assets` | Auto WebP/AVIF conversion, responsive srcset, width/height for CLS prevention, lazy loading, required alt text |
| Content collection querying | `getCollection()` / `getEntry()` from `astro:content` | Type-safe querying, Zod schema validation at build time, `render()` for Markdown → HTML |
| Dynamic blog routes | Astro `getStaticPaths()` | Standard pattern for generating static pages from collections at build time |
| HTML-to-Markdown conversion | `turndown` (npm) | Mature library for converting WordPress HTML output to clean Markdown. Better than regex |

## Existing Code and Patterns

- `src-astro/src/layouts/BaseLayout.astro` — All pages wrap in this. Accepts `title`, `description`, `canonicalURL`, `ogImage`, `ogType`, `twitterCard`, `jsonLd`, `noindex` props which pass through to SEO.astro. New pages just set these props.
- `src-astro/src/components/SEO.astro` — Renders meta description, canonical, OG tags, Twitter Card, JSON-LD. `canonicalURL` auto-computes from `Astro.url.pathname + Astro.site`.
- `src-astro/src/content.config.ts` — Blog collection schema already defined: `title` (string), `description` (string), `pubDate` (coerce date), `author` (optional string), `tags` (optional string[]), `image` (optional string). S03 must populate the `src/content/blog/` directory with Markdown files matching this schema.
- `src-astro/src/pages/index.astro` — Homepage pattern to follow. Uses BaseLayout, custom scoped styles, section-based layout.
- `src-astro/src/components/Header.astro` — Already has complete nav links to all pages including `/about/roadmap/`, `/rethinking-wordpress-distribution/` is NOT in the nav (standalone page).
- `src-astro/src/styles/global.css` — Tailwind v4 `@theme` tokens. Typography base styles for h1-h4 already defined. Content pages should rely on these.
- `src-astro/src/components/LFBanner.astro` — Linux Foundation attribution strip, already in BaseLayout.

### Patterns from S01 to follow

- **Page creation pattern:** Import `BaseLayout`, pass SEO props, structure content in semantic `<section>` blocks with `max-w-4xl mx-auto px-4 py-16` container pattern.
- **External links:** Use `rel="noopener noreferrer" target="_blank"` with `<span class="sr-only"> (external link)</span>`.
- **CSS custom properties:** Brand tokens available as Tailwind classes (`text-green`, `bg-dark-blue`, `text-dark-gray`, `bg-light-gray`, etc.).
- **Astro 6.x content collections:** Use `import { getCollection, render } from 'astro:content'` (not the old `entry.render()` pattern).

## Constraints

- **Astro static output only** — No SSR adapter. All pages pre-rendered at build time. Blog routes use `getStaticPaths()`.
- **Blog posts as Markdown in content collection** — Schema is already defined. Posts go in `src/content/blog/`. Frontmatter must match Zod schema exactly.
- **Content collection `id` is the filename stem** — With glob loader and `base: './src/content/blog'`, a file `what-is-fair.md` gets `id: 'what-is-fair'`. This becomes the URL slug via `[...slug].astro`.
- **Static pages as `.astro` files** — Decision from research doc and S01. Not content collections — each page has unique layout needs.
- **Tailwind v4 CSS-first config** — No `tailwind.config.mjs`. All tokens in `global.css` `@theme` block.
- **`src-astro/` subdirectory** (D014) — All Astro code lives under `src-astro/`. Commands run from there.
- **No `@astrojs/rss` installed yet** — Must be added as a dependency.
- **No `src/assets/` directory exists yet** — Must be created for optimized images.

## Content Source Matrix

| Page | Primary Source | WP Content? | Images | Embeds | Complexity |
|------|---------------|-------------|--------|--------|------------|
| `/` (homepage) | S01 index.astro (done) | Yes (8427 chars) | 1 GitHub PNG | None | Already done |
| `/about/` | website-content repo | Yes (2014 chars) | None | None | Low |
| `/about/fairs-mandate/` | website-content repo | Yes (6887 chars) | None | None | Low |
| `/about/fair-initiatives/` | website-content repo | Yes (5958 chars) | None | None | Low |
| `/about/roadmap/` | **WP only** | Yes (9305 chars) | None | None | Medium — WP block groups, separators |
| `/governance/` | website-content repo | Yes (5557 chars) | None | None | Low |
| `/governance/technical-steering-committee/` | website-content repo | Yes (1224 chars) | None | None | Low |
| `/governance/linux-foundation/` | website-content repo | Yes (2444 chars) | None | None | Low |
| `/governance/code-of-conduct/` | website-content repo (intro only) | Yes (21954 chars, full text) | None | None | Medium — WP has full CoC, repo has just intro |
| `/governance/antitrust-policy/` | website-content repo | Yes (651 chars) | None | None | Low — brief with external link |
| `/governance/privacy-policy/` | website-content repo | Yes (456 chars) | None | None | Low — brief with external link |
| `/governance/terms-of-use/` | website-content repo | Yes (460 chars) | None | None | Low — brief with external link |
| `/get-involved/` | website-content repo | Yes (3262 chars) | None | None | Low |
| `/get-involved/fair-working-groups/` | website-content repo | Yes (8143 chars) | None | None | Low |
| `/fair-knowledge-base/` | website-content repo | Yes (6056 chars) | None | None | Low |
| `/rethinking-wordpress-distribution/` | **WP only** | Yes (19182 chars) | None | None | Medium — long page, WP block groups with backgrounds, blockquotes, heading anchors |
| `/blog/` | Generated listing | N/A | None | None | Low |

### Blog Post Complexity

| Slug | Content (chars) | Images | Embeds | Author ID → Name |
|------|----------------|--------|--------|-----------------|
| `fair-plugin-version-0-4-0-decentralized-installation` | 1,945 | 0 | 1 GitHub video | 5 → siobhan |
| `discover-trust-install-fair-1-0-is-here` | 10,593 | 5 GitHub PNGs | 0 | 6 → crobertson |
| `what-is-fair` | 31,372 | 0 | 1 YouTube + 1 SpeakerDeck | 6 → crobertson |
| `fair-plugin-1-1-release-announcement` | 4,956 | 0 | 0 | 13 → Colin Stewart |
| `fair-connect-1-2-release-announcement` | 3,341 | 0 | 0 | 13 → Colin Stewart |
| `fair-connect-1-2-1-release-announcement` | 2,972 | 0 | 0 | 4 → joedolson |
| `fair-connect-1-2-2-release-announcement` | 1,944 | 0 | 0 | 4 → joedolson |
| `2025-fair-recap` | 13,711 | 0 | 4 YouTube | 7 → Brent Toderash |
| `second-star-to-the-right-and-straight-on-till-morning` | 5,284 | 0 | 0 | 11 → fairpmteam |

### WP Author ID → Name Mapping

| ID | Name | Display Name |
|----|------|-------------|
| 4 | joedolson | Joe Dolson |
| 5 | siobhan | Siobhan |
| 6 | crobertson | crobertson |
| 7 | toderash | Brent Toderash |
| 11 | fairpmteam | FAIR Team |
| 13 | colinstewart | Colin Stewart |

### WP Category Mapping

| ID | Name | Slug |
|----|------|------|
| 2 | Release Notes | release-notes |
| 5 | FAIR News | fair-news |

### Images to Download

Source images for blog posts (all from GitHub, no WP-hosted images):

1. `assets/release-1.0/dashboard-planet.png` (477KB) — used in `discover-trust-install-fair-1-0-is-here`
2. `assets/release-1.0/combined-package-list-gu.png` (155KB) — used in `discover-trust-install-fair-1-0-is-here` + homepage
3. `assets/release-1.0/avatar-settings.png` (409KB) — used in `discover-trust-install-fair-1-0-is-here`
4. `assets/release-1.0/planet-zoomed.png` (170KB) — used in `discover-trust-install-fair-1-0-is-here`
5. `assets/release-1.0/plugin-details-install.png` (497KB) — used in `discover-trust-install-fair-1-0-is-here`
6. Video: `https://github.com/user-attachments/assets/7c887400-839a-43ee-85dd-570fcb3bd031` — used in `fair-plugin-version-0-4-0`

Additional asset in repo but not referenced in blog posts:
- `assets/release-1.0/aspire-explorer.png` (106KB)
- `assets/release-1.0/avatar-profile.png` (270KB)
- `assets/release-1.0/combined-search-results.png` (100KB)
- `assets/maxresdefault.jpg` (85KB)

## Common Pitfalls

- **WordPress block HTML class cruft** — WP renders content with classes like `wp-block-heading`, `wp-block-list`, `wp-block-group`, `wp-block-group__inner-container`, `is-layout-constrained`, `has-light-gray-background-color`. These must be stripped during conversion to Markdown, with semantic structure preserved. Don't try to preserve WP block classes — convert to clean Markdown or clean HTML with Tailwind classes.

- **Code of Conduct content source mismatch** — The website-content repo has only a 2-paragraph intro + link to GitHub. The WP site has the full 21,954-char Code of Conduct text. Decide which to use: the full WP content (self-contained page) or the brief repo version (delegates to GitHub). Recommend: use WP version so the page has content rather than just a link.

- **YouTube/SpeakerDeck embeds in Markdown** — Markdown content collection files can include raw HTML, but embedded iframes need a responsive wrapper. Create a reusable pattern: either use raw HTML in Markdown (works in Astro) or create a custom Astro component and use MDX. Raw HTML in `.md` is simpler since we only have ~7 embeds across 3 posts. Wrap in a `<div class="embed-responsive">` with CSS for 16:9 aspect ratio.

- **Content collection `render()` import** — Astro 6.x changed the API: use `import { render } from 'astro:content'` and call `render(entry)`, NOT `entry.render()`. The old API is removed.

- **Blog post URL routing** — The `[...slug].astro` pattern with content collection glob loader: the `id` comes from the filename. File `what-is-fair.md` → `id: 'what-is-fair'` → URL `/blog/what-is-fair/`. This matches D010 (drop date segments). Verify all 9 slugs produce correct URLs.

- **Missing `@astrojs/rss` dependency** — Not yet in `package.json`. Must install before creating `rss.xml.ts`.

- **Image paths in Markdown** — Blog post images referenced with `![alt](./path)` syntax need to resolve correctly. With Astro content collections, relative image paths in Markdown reference files relative to the content file's location. For images in `src/assets/images/`, use absolute paths from the project root or import them. Simpler approach: reference from `public/images/blog/` with absolute paths in Markdown.

- **GitHub-hosted video** — The MP4 at `github.com/user-attachments/assets/...` should be downloaded and self-hosted in `public/video/` to avoid external dependency. GitHub user-attachment URLs can expire or become rate-limited.

- **`what-is-fair` post is massive** (31,372 chars) — This is the most complex post with 39 headings, 22 lists, 2 embedded iframes (YouTube + SpeakerDeck), and 69 WP block class instances. Needs careful conversion. Budget extra time for this one.

- **Trailing slashes** — Astro defaults to directory-style URLs with trailing slashes (`/about/` not `/about`). The existing WP URLs use trailing slashes. Ensure `trailingSlash` config matches (Astro default is fine).

## Open Risks

- **Content freshness** — The website-content repo and WP may have diverged. The WP REST API returns current content. For pages sourced from both, WP should be treated as authoritative for current content. However, the Markdown in the repo is cleaner to work with. Strategy: use repo Markdown as base, verify against WP, and use WP content when the repo version is stale or incomplete.

- **Embedded media accessibility** — YouTube iframes need `title` attributes (already present in WP HTML). SpeakerDeck iframe needs a meaningful title. Video element needs accessible controls. All embeds should be keyboard-operable.

- **Large image files** — The 5 blog images total ~1.7MB as PNGs. Astro's Image component will convert to WebP/AVIF, significantly reducing size. But source images need to be in `src/assets/` for optimization (not `public/`).

- **RSS feed content** — Including full post HTML content in RSS requires `markdown-it` + `sanitize-html` per Astro docs. Simpler approach: include only title, description, pubDate, and link (no full content). Most RSS readers will follow the link for full content.

- **Blog post tags** — WP posts have category IDs (2=Release Notes, 5=FAIR News) and one tag (ID 6 on `what-is-fair`). The tag name needs to be resolved via WP API. Categories can map to tags in the Astro schema. Need to decide: map WP categories → Astro tags, or just use descriptive strings.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | `astrolicious/agent-skills@astro` | available (2.8K installs) — directly relevant for Astro content collections, routing, Image component |
| Tailwind CSS | `giuseppe-trisciuoglio/developer-kit@tailwind-css-patterns` | available (2.3K installs) — useful but Tailwind patterns already established in S01/S02 |
| WordPress | `johnie/skills@wp-cli` | available (15 installs) — not relevant, we're only reading the REST API |

**Recommendation:** Consider installing `astrolicious/agent-skills@astro` before execution — it has strong adoption and directly covers the content collections, Image component, and routing patterns needed for S03.

## Sources

- WP REST API `/wp-json/wp/v2/posts?per_page=100` — all 9 blog posts with full HTML content, author IDs, category IDs, dates, slugs. No featured images on any post (all `featured_media: 0`).
- WP REST API `/wp-json/wp/v2/pages?per_page=100` — all pages including WP-only content for roadmap (9305 chars) and rethinking-wordpress-distribution (19182 chars).
- WP REST API `/wp-json/wp/v2/users` — author mapping (6 authors: joedolson, siobhan, crobertson, toderash, fairpmteam, colinstewart).
- WP REST API `/wp-json/wp/v2/categories` — 2 categories (Release Notes, FAIR News).
- GitHub API `repos/fairpm/website-content/git/trees/main?recursive=1` — full file tree with sizes. 13 Markdown content files + 8 image assets.
- GitHub raw content — verified Markdown format for about/index.md, governance/*.md pages. Clean Markdown, no frontmatter, headings start with `#`.
- Astro docs (Context7) — Content collections use `getCollection`/`render` from `astro:content`. RSS via `@astrojs/rss` with `getCollection()`. Image component from `astro:assets` with `layout='responsive'` for srcset.
- `Fairly static/fair-pm-astro-migration-research.md` — URL redirect map, package recommendations, SEO strategy, content architecture.
- S01 Summary — BaseLayout props interface, content collection schema, patterns established.
