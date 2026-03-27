# S01: Astro Foundation & Layout System — UAT

**Milestone:** M001
**Written:** 2026-03-27

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: S01 produces infrastructure (project scaffold, layout components, design tokens, content schema) — no user-facing visual design or interactive behavior to evaluate. All quality signals are verifiable through build output, HTML structure analysis, and automated checks. Human visual review is deferred to S02 when styling is applied.

## Preconditions

- Node.js 18+ installed
- Working directory is `src-astro/`
- Dependencies installed (`npm install`)

## Smoke Test

Run `cd src-astro && npm run build` — must exit 0 and produce `dist/index.html`.

## Test Cases

### 1. Build succeeds cleanly

1. `cd src-astro && npm run build`
2. **Expected:** Exit code 0, output shows "Complete!", `dist/index.html` exists

### 2. Dev server responds

1. `cd src-astro && npm run dev`
2. `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/`
3. **Expected:** Status code 200

### 3. HTML contains all required semantic elements

1. Build the project (`npm run build`)
2. Inspect `dist/index.html` for: `lang="en"`, `<meta name="description"`, `og:title`, `og:description`, `twitter:card`, `canonical`, `<nav`, `<main`, `<header`, `<footer`, `skip`, `Mona Sans`
3. **Expected:** All 12 elements present in the HTML output

### 4. Content collection schema exists and is valid

1. Verify `src/content.config.ts` exists
2. Verify it imports `defineCollection` from `astro:content` and `z` from `astro/zod`
3. Verify schema includes: title (string), description (string), pubDate (coerce date), author (optional), tags (optional array), image (optional)
4. **Expected:** File exists with correct imports and all 6 schema fields

### 5. Font file present

1. Verify `public/fonts/monasansvf.woff2` exists and is >100KB
2. **Expected:** File exists (262KB)

### 6. Sitemap integration configured

1. `grep "sitemap" src-astro/astro.config.mjs`
2. Verify /packages/ filter is present
3. **Expected:** Sitemap integration with filter active, `sitemap-index.xml` generated during build

### 7. Canonical URL resolves correctly

1. Build the project
2. `grep "canonical" dist/index.html`
3. **Expected:** Shows `https://fair.pm/` (not localhost)

### 8. SEO props are complete

1. Build the project
2. Inspect `dist/index.html` for OG tags (og:title, og:description, og:url, og:type) and Twitter Card tags (twitter:card, twitter:title, twitter:description)
3. Verify meta description is between 120-160 characters
4. **Expected:** All tags present, description is 134 characters

## Edge Cases

### Missing SEO props trigger TypeScript errors

1. Create a test page that uses BaseLayout without title or description
2. Run `npm run build`
3. **Expected:** TypeScript error identifying the missing required props

### Empty content directory is handled gracefully

1. Verify `src/content/blog/` is empty (only `.gitkeep`)
2. Run `npm run build`
3. **Expected:** Build succeeds with a warning about no files found (not an error)

## Failure Signals

- `npm run build` exits non-zero — project scaffold broken
- Missing meta tags in `dist/index.html` — SEO component or BaseLayout wiring broken
- Canonical URL shows `localhost` — site config wrong in `astro.config.mjs`
- `dist/index.html` missing `<nav`, `<header`, `<footer` — Header/Footer not imported in BaseLayout
- `dist/index.html` missing "skip" — skip-to-content link missing from BaseLayout
- `dist/index.html` missing "Mona Sans" — inline @font-face removed from BaseLayout
- `public/fonts/monasansvf.woff2` missing — font download failed

## Requirements Proved By This UAT

- R002 (Blog content collection) — Schema defined and validated by Astro build; directory structure ready
- R004 (SEO completeness) — SEO component contract verified: meta description, canonical URL, OG tags, Twitter Cards all present in built HTML; JSON-LD prop accepted (full structured data types added in S04)
- R005 (Sitemap) — Sitemap generation verified in build output with /packages/* filter
- R007 (Accessibility / WCAG AA) — Semantic landmarks present (header, nav, main, footer), skip-to-content link present, lang="en" set, external link indicators — partial proof (visual contrast, focus indicators, keyboard nav verified in S02)
- R012 (Design refresh) — Design token infrastructure verified (10 brand colors in @theme, Mona Sans configured) — partial proof (visual application verified in S02)

## Not Proven By This UAT

- R007 color contrast compliance — raw brand colors used; contrast fixes are S02 scope
- R007 visible focus indicators — no styling applied yet; S02 scope
- R007 keyboard navigation — Header unstyled, no mobile nav; S02 scope
- R004 JSON-LD structured data rendering — prop interface exists but structured data types (WebSite, BlogPosting, etc.) are S04 scope
- R005 sitemap completeness — sitemap generates but content pages don't exist yet; verified in S04 after S03 adds pages
- Visual design quality — components are unstyled skeletons; S02 applies design
- Content parity — homepage has placeholder content; S03 migrates real content
- Responsive layout — no styling means no responsive behavior yet; S02 scope

## Notes for Tester

- The glob-loader warning about "No files found matching **/*.{md,mdx}" is expected — S03 populates the blog directory.
- Header renders as a flat unstyled link list — this is intentional for S01. S02 adds visual design.
- The `@font-face` for Mona Sans appears in two places: inline in BaseLayout (for HTML visibility / critical path) and in global.css (for Tailwind integration). Both are intentional.
