---
estimated_steps: 4
estimated_files: 3
---

# T03: Define blog content collection schema and wire homepage

**Slice:** S01 — Astro Foundation & Layout System
**Milestone:** M001

## Description

Create the blog content collection schema in `src/content.config.ts` using Astro 6.x syntax (glob loader, `z` from `astro/zod`). This defines the typed contract that S03 will populate with actual blog posts. Create the `src/content/blog/` directory so the collection has a valid base path. Update the homepage with minimal real content (heading, introductory text) so the demo is meaningful — not just an empty shell. Run full verification suite to confirm the entire S01 deliverable works end-to-end.

## Steps

1. Create `src-astro/src/content.config.ts` with blog collection: `defineCollection` from `astro:content`, `glob` from `astro/loaders`, `z` from `astro/zod`. Schema: `title` (z.string()), `description` (z.string()), `pubDate` (z.coerce.date()), `author` (z.string().optional()), `tags` (z.array(z.string()).optional()), `image` (z.string().optional()). Export as `collections: { blog }`.
2. Create `src-astro/src/content/blog/` directory (empty — S03 will populate with actual posts). Optionally add a `.gitkeep` to preserve the empty directory in git.
3. Update `src-astro/src/pages/index.astro` to have meaningful homepage content: an `<h1>` with "FAIR — Federated and Independent Repositories", a brief introductory paragraph, and a "Learn more" link to `/about/`. Use Tailwind utility classes for basic readability (text sizing, spacing). Ensure the SEO description is 120-160 characters.
4. Run the full verification suite: `astro build` succeeds, dev server responds 200, built HTML contains all required elements (lang, meta tags, OG, Twitter, canonical, nav, main, header, footer, skip link, Mona Sans), content config exists, font file exists, sitemap configured.

## Must-Haves

- [ ] `src/content.config.ts` uses Astro 6.x syntax: imports from `astro:content`, `astro/loaders`, `astro/zod`
- [ ] Blog collection schema has all 6 fields: title, description, pubDate, author, tags, image
- [ ] `src/content/blog/` directory exists
- [ ] Homepage has `<h1>`, introductory text, and meaningful SEO description (120-160 chars)
- [ ] Full verification suite passes (V1-V6 from slice plan)

## Verification

- `cd src-astro && npm run build` exits 0
- `test -f src/content.config.ts` passes
- `grep -q "defineCollection" src/content.config.ts` passes
- `grep -q "glob" src/content.config.ts` passes
- `test -d src/content/blog` passes
- Start dev server, `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/` returns 200
- Built `dist/index.html` contains all required elements per V3 verification script
- SEO description meta tag content is between 120-160 characters

## Observability Impact

- Signals added/changed: Content collection schema validation now active — any future blog post with invalid frontmatter will produce a clear build error naming the file and field
- How a future agent inspects this: Add a malformed `.md` file to `src/content/blog/` → `astro build` will error with specific field validation message; `grep defineCollection src/content.config.ts` to confirm schema exists
- Failure state exposed: Schema violations produce Zod validation errors with field path and expected type during `astro build`

## Inputs

- `src-astro/src/layouts/BaseLayout.astro` — layout used by homepage (from T02)
- `src-astro/src/components/SEO.astro` — SEO component receiving props from homepage (from T02)
- `src-astro/astro.config.mjs` — Astro project config (from T01)
- S01-RESEARCH.md — content collection syntax reference

## Expected Output

- `src-astro/src/content.config.ts` — blog collection with validated Zod schema
- `src-astro/src/content/blog/.gitkeep` — empty directory placeholder for S03
- `src-astro/src/pages/index.astro` — homepage with real content, BaseLayout, and SEO props
- Full S01 verification passing — build succeeds, dev server responds, all HTML checks pass
