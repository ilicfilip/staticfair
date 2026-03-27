---
id: T01
parent: S03
milestone: M001
provides:
  - BlogPost.astro layout with title, date, author, tags, and prose styling
  - Blog listing page at /blog/ with posts sorted by pubDate descending
  - Dynamic [...slug] route generating individual blog pages at /blog/[slug]/
  - RSS feed endpoint at /rss.xml with valid XML and all blog post entries
  - 3 text-only blog posts migrated from WP REST API with Zod-valid frontmatter
  - @astrojs/rss installed as dependency
key_files:
  - src-astro/src/layouts/BlogPost.astro
  - src-astro/src/pages/blog/index.astro
  - src-astro/src/pages/blog/[...slug].astro
  - src-astro/src/pages/rss.xml.ts
  - src-astro/src/content/blog/fair-plugin-1-1-release-announcement.md
  - src-astro/src/content/blog/fair-connect-1-2-release-announcement.md
  - src-astro/src/content/blog/fair-connect-1-2-1-release-announcement.md
key_decisions:
  - "Astro 6.x render() API: import { render } from 'astro:content', destructure { Content }, render in layout via <Content /> component"
  - "Blog post IDs used as slugs directly — glob loader derives ID from filename, so /blog/[...slug] uses post.id for params and links"
  - "RSS feed as rss.xml.ts endpoint using GET function with context.site (not hardcoded URL)"
  - "BlogPost layout wraps BaseLayout with ogType='article' for correct OG meta on blog posts"
  - "Prose styling via scoped <style> with :global() selectors in BlogPost.astro — keeps Markdown rendered content styled without a global prose utility"
patterns_established:
  - "Content collection → getStaticPaths pattern: getCollection('blog') → map to { params: { slug: post.id }, props: { post } }"
  - "Blog listing sort: (await getCollection('blog')).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())"
  - "Blog post frontmatter schema: title, description, pubDate (date), author (string), tags (string[]), image (string) — all match content.config.ts Zod schema"
  - "RSS items mapped with link: /blog/${post.id}/ — consistent with [...slug] route"
observability_surfaces:
  - "`npm run build` exits 0 and lists all generated blog pages in output"
  - "Zod schema validation runs at build time — mismatched frontmatter fields surface exact field name and expected type"
  - "`ls dist/blog/*/index.html` lists all generated blog pages"
  - "`cat dist/rss.xml` shows RSS output; grep for <item> to count entries"
  - "Missing getStaticPaths produces build error naming the file"
duration: 8m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T01: Blog infrastructure and first blog posts

**Full blog pipeline wired end-to-end: BlogPost layout, blog listing, dynamic slug route, RSS feed, and 3 WP-migrated blog posts — all build and render at correct URLs.**

## What Happened

Installed `@astrojs/rss` (v4.0.18). Created `BlogPost.astro` layout extending BaseLayout with article-specific metadata rendering (title as h1, formatted date, author name, tags as pill list) and scoped prose styles for Markdown content. Created `[...slug].astro` dynamic route using `getStaticPaths()` with `getCollection('blog')` and Astro 6.x `render()` API. Created `blog/index.astro` listing page that sorts posts by pubDate descending and renders linked article cards. Created `rss.xml.ts` endpoint using `@astrojs/rss` with feed metadata from `context.site`.

Fetched 3 text-only blog posts from the WP REST API (`https://fair.pm/wp-json/wp/v2/posts`), converted rendered HTML to clean Markdown, and wrote them with YAML frontmatter matching the Zod schema:

1. `fair-plugin-1-1-release-announcement.md` — Colin Stewart, 2025-11-09
2. `fair-connect-1-2-release-announcement.md` — Colin Stewart, 2025-12-11
3. `fair-connect-1-2-1-release-announcement.md` — Joe Dolson, 2025-12-22

All WP block classes stripped, HTML entities decoded, internal links converted to relative paths. Removed `.gitkeep` placeholder from blog content directory.

## Verification

All task-level must-haves verified:

- ✅ `cd src-astro && npm run build` exits 0 — 5 pages built in 731ms
- ✅ `ls dist/blog/fair-plugin-1-1-release-announcement/index.html dist/blog/fair-connect-1-2-release-announcement/index.html dist/blog/fair-connect-1-2-1-release-announcement/index.html` — all 3 exist
- ✅ `cat dist/blog/index.html | grep -c '<article'` — equals 3
- ✅ `grep '<rss' dist/rss.xml` — RSS root element present with valid structure
- ✅ `grep -o '<item>' dist/rss.xml | wc -l` — equals 3
- ✅ `grep 'fair-plugin-1-1-release-announcement' dist/rss.xml` — post appears in RSS
- ✅ All 3 posts have `<h1>` with title, `<time>` with date, author name, and "Release Notes" tag
- ✅ Zod schema validation passes at build (no frontmatter errors)
- ✅ `@astrojs/rss` in package.json dependencies

Slice-level verification (partial — this is T01 of multi-task slice):

- ✅ `npm run build` exits 0
- ✅ RSS has `<rss>` root element and 3 items
- ✅ Blog listing shows all 3 post titles
- ✅ All blog posts have `<h1>` and author/date metadata
- ⬜ 28+ pages (5 now — T02+ adds rest)
- ⬜ 9 blog posts (3 now — T02 adds 6 rich posts)
- ⬜ Static page paths (T03+)
- ⬜ Blog images (T02)
- ⬜ Embeds and video (T02)

## Diagnostics

- `ls dist/blog/*/index.html` — lists all generated blog pages
- `cat dist/rss.xml` — full RSS output; grep for `<item>` to count posts
- Build output shows each generated route with timing
- Zod validation errors at build time show exact field path and expected type
- `grep 'error' build-output` to surface schema validation issues

## Deviations

- RSS `grep -c '<item>'` returns 1 (not 3) because `@astrojs/rss` outputs single-line XML. Use `grep -o '<item>' | wc -l` instead for accurate count. This is a verification command nuance, not a code issue.

## Known Issues

None.

## Files Created/Modified

- `src-astro/package.json` — added `@astrojs/rss` dependency
- `src-astro/src/layouts/BlogPost.astro` — blog post layout with metadata rendering and prose styling
- `src-astro/src/pages/blog/index.astro` — blog listing page sorted by pubDate descending
- `src-astro/src/pages/blog/[...slug].astro` — dynamic route for individual blog posts
- `src-astro/src/pages/rss.xml.ts` — RSS feed endpoint
- `src-astro/src/content/blog/fair-plugin-1-1-release-announcement.md` — blog post (Colin Stewart)
- `src-astro/src/content/blog/fair-connect-1-2-release-announcement.md` — blog post (Colin Stewart)
- `src-astro/src/content/blog/fair-connect-1-2-1-release-announcement.md` — blog post (Joe Dolson)
- `src-astro/src/content/blog/.gitkeep` — removed (no longer needed)
