---
estimated_steps: 6
estimated_files: 8
---

# T01: Blog infrastructure and first blog posts

**Slice:** S03 — Content Migration
**Milestone:** M001

## Description

Establishes the full blog pipeline end-to-end: BlogPost layout, blog listing page, dynamic `[...slug]` route, and RSS feed endpoint. Installs `@astrojs/rss`. Populates 3 simple text-only blog posts (no images/embeds) from the WP REST API to prove the pipeline works. This is the highest-risk task because it wires content collections to Astro's build system for the first time — if the collection schema, glob loader, render pipeline, or RSS generation has issues, this task surfaces them early.

## Steps

1. Install `@astrojs/rss` in the `src-astro/` directory
2. Create `src/layouts/BlogPost.astro` — extends BaseLayout, renders post metadata (title as h1, formatted date, author name, tags as inline list), then renders the post body via `<slot />`. Pass title, description, and `ogType="article"` to BaseLayout for SEO.
3. Create `src/pages/blog/[...slug].astro` — uses `getStaticPaths()` with `getCollection('blog')` to generate static paths. For each entry, calls `render(entry)` from `astro:content` (Astro 6.x API), passes the `Content` component into BlogPost layout.
4. Create `src/pages/blog/index.astro` — uses `getCollection('blog')`, sorts by `pubDate` descending, renders a list of posts with title (linked), date, description, and author. Wraps in BaseLayout with blog-specific SEO props.
5. Create `src/pages/rss.xml.ts` — uses `@astrojs/rss` with `getCollection('blog')`. Sets feed title, description, site from `context.site`. Maps each post to RSS item with title, pubDate, description, and link.
6. Extract 3 simple blog posts from WP REST API and convert to Markdown files in `src/content/blog/`:
   - `fair-plugin-1-1-release-announcement.md` (text-only, author: Colin Stewart)
   - `fair-connect-1-2-release-announcement.md` (text-only, author: Colin Stewart)
   - `fair-connect-1-2-1-release-announcement.md` (text-only, author: Joe Dolson)
   
   Each file: YAML frontmatter matching Zod schema (title, description, pubDate, author, tags), then clean Markdown body converted from WP rendered HTML (strip `wp-block-*` classes, convert to standard Markdown elements).

## Must-Haves

- [ ] `@astrojs/rss` installed and in package.json dependencies
- [ ] BlogPost.astro layout renders title, date, author, tags, and body content
- [ ] Blog listing at `/blog/` shows posts sorted by pubDate descending
- [ ] Dynamic route generates individual pages for each blog post at `/blog/[slug]/`
- [ ] RSS feed at `/rss.xml` contains valid XML with post entries
- [ ] 3 blog post Markdown files with valid frontmatter (build-time Zod validation passes)
- [ ] All 3 posts render at their correct URLs: `/blog/fair-plugin-1-1-release-announcement/`, `/blog/fair-connect-1-2-release-announcement/`, `/blog/fair-connect-1-2-1-release-announcement/`

## Verification

- `cd src-astro && npm run build` exits 0
- `ls dist/blog/fair-plugin-1-1-release-announcement/index.html dist/blog/fair-connect-1-2-release-announcement/index.html dist/blog/fair-connect-1-2-1-release-announcement/index.html` — all 3 exist
- `cat dist/blog/index.html | grep -c '<article'` — equals 3 (listing shows all posts)
- `grep '<rss' dist/rss.xml` — RSS root element present
- `grep -c '<item>' dist/rss.xml` — equals 3 (one item per post)
- `grep 'fair-plugin-1-1-release-announcement' dist/rss.xml` — post appears in RSS

## Observability Impact

- Signals added/changed: Content collection Zod validation now runs against real data (not empty dir). Build output shows page count including blog pages and RSS.
- How a future agent inspects this: `ls dist/blog/*/index.html` lists all generated blog pages. `cat dist/rss.xml` shows RSS output. `grep 'error' build-output` surfaces schema validation issues.
- Failure state exposed: Zod schema mismatch → build error with exact field name and expected type. Missing `getStaticPaths` → build error naming the file. Invalid RSS → build error from `@astrojs/rss`.

## Inputs

- `src-astro/src/content.config.ts` — existing blog collection schema (title, description, pubDate, author, tags, image)
- `src-astro/src/layouts/BaseLayout.astro` — layout shell with SEO props pass-through
- WP REST API `https://fair.pm/wp-json/wp/v2/posts` — source for blog post content
- S01 Summary — patterns for page creation, BaseLayout usage, external links, Astro 6.x content collection API

## Expected Output

- `src-astro/package.json` — updated with `@astrojs/rss` dependency
- `src-astro/src/layouts/BlogPost.astro` — blog post layout component
- `src-astro/src/pages/blog/index.astro` — blog listing page
- `src-astro/src/pages/blog/[...slug].astro` — dynamic blog post route
- `src-astro/src/pages/rss.xml.ts` — RSS feed endpoint
- `src-astro/src/content/blog/fair-plugin-1-1-release-announcement.md` — blog post
- `src-astro/src/content/blog/fair-connect-1-2-release-announcement.md` — blog post
- `src-astro/src/content/blog/fair-connect-1-2-1-release-announcement.md` — blog post
