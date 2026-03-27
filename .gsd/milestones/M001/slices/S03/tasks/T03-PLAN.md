---
estimated_steps: 4
estimated_files: 8
---

# T03: Migrate 8 governance and about static pages

**Slice:** S03 — Content Migration
**Milestone:** M001

## Description

Migrates the first batch of static pages: 3 about-section pages (`/about/`, `/about/fairs-mandate/`, `/about/fair-initiatives/`) and 5 governance pages (`/governance/`, `/governance/technical-steering-committee/`, `/governance/linux-foundation/`, `/governance/code-of-conduct/`, `/governance/antitrust-policy/`). All except Code of Conduct are sourced from the fairpm/website-content GitHub repo (clean Markdown). Code of Conduct uses the full WP content (21K chars) rather than the repo's brief intro, so the page has real content instead of just a link to GitHub.

## Steps

1. Fetch Markdown content for 3 about pages from GitHub raw URLs (`fairpm/website-content` repo, `main` branch, path `content/about/`). Convert each to an `.astro` page file that wraps content in `BaseLayout` with appropriate `title` and `description` props. Use the established page pattern: semantic `<section>`, `max-w-4xl mx-auto px-4 py-16` container, Markdown content rendered as HTML within the section. Create directory structure `src/pages/about/`.
2. Fetch Markdown content for 4 governance pages from GitHub raw URLs (`content/governance/`). Convert to `.astro` page files following the same pattern. Create directory structure `src/pages/governance/`. For antitrust-policy: it's a brief page with an external link to the full document — render the intro text plus the link with the established external link pattern (`rel="noopener noreferrer" target="_blank"` + sr-only indicator).
3. For `/governance/code-of-conduct/`: extract the full content from the WP REST API (21,954 chars) rather than the repo's 2-paragraph intro. Convert WP HTML to clean semantic HTML — strip `wp-block-*` classes, preserve heading hierarchy, lists, and block quotes. This is the longest governance page and needs careful conversion to maintain readability.
4. Verify all 8 pages build correctly and render at their preserved URL paths. Check each page has an `<h1>`, meaningful content, and correct `<title>` tag.

## Must-Haves

- [ ] `src/pages/about/index.astro` renders at `/about/`
- [ ] `src/pages/about/fairs-mandate.astro` renders at `/about/fairs-mandate/`
- [ ] `src/pages/about/fair-initiatives.astro` renders at `/about/fair-initiatives/`
- [ ] `src/pages/governance/index.astro` renders at `/governance/`
- [ ] `src/pages/governance/technical-steering-committee.astro` renders at `/governance/technical-steering-committee/`
- [ ] `src/pages/governance/linux-foundation.astro` renders at `/governance/linux-foundation/`
- [ ] `src/pages/governance/code-of-conduct.astro` renders at `/governance/code-of-conduct/` with full CoC text (not just intro)
- [ ] `src/pages/governance/antitrust-policy.astro` renders at `/governance/antitrust-policy/`
- [ ] All pages use BaseLayout with meaningful title and description props
- [ ] All external links use `rel="noopener noreferrer" target="_blank"` with sr-only indicator

## Verification

- `cd src-astro && npm run build` exits 0
- `ls dist/about/index.html dist/about/fairs-mandate/index.html dist/about/fair-initiatives/index.html` — all exist
- `ls dist/governance/index.html dist/governance/technical-steering-committee/index.html dist/governance/linux-foundation/index.html dist/governance/code-of-conduct/index.html dist/governance/antitrust-policy/index.html` — all exist
- `grep '<h1' dist/governance/code-of-conduct/index.html` — h1 present (confirming real content, not empty page)
- `wc -c dist/governance/code-of-conduct/index.html` — significantly more than 5KB (full CoC, not just intro)
- Each page's `<title>` contains a meaningful page-specific title (not just "FAIR")

## Observability Impact

- Signals added/changed: Build page count increases by 8. Any page with broken imports or invalid props causes build-time TypeScript error.
- How a future agent inspects this: `ls dist/about/ dist/governance/` shows all generated page directories. `grep '<h1' dist/about/index.html` confirms page has content.
- Failure state exposed: Missing BaseLayout import → build error. Invalid prop → TypeScript error with file and line.

## Inputs

- `src-astro/src/layouts/BaseLayout.astro` — layout shell with SEO props
- GitHub raw content: `https://raw.githubusercontent.com/fairpm/website-content/main/content/about/` and `content/governance/` — Markdown sources
- WP REST API `https://fair.pm/wp-json/wp/v2/pages` — Code of Conduct full content
- S01/S02 patterns — page creation pattern, external link pattern, container widths

## Expected Output

- `src-astro/src/pages/about/index.astro` — about page
- `src-astro/src/pages/about/fairs-mandate.astro` — FAIR's mandate page
- `src-astro/src/pages/about/fair-initiatives.astro` — FAIR initiatives page
- `src-astro/src/pages/governance/index.astro` — governance overview
- `src-astro/src/pages/governance/technical-steering-committee.astro` — TSC page
- `src-astro/src/pages/governance/linux-foundation.astro` — Linux Foundation page
- `src-astro/src/pages/governance/code-of-conduct.astro` — full Code of Conduct
- `src-astro/src/pages/governance/antitrust-policy.astro` — antitrust policy page
